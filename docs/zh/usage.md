# 使用数据

`ds[i]` 已经返回逐帧 batch 所需的内容：默认 observation、state 和 action，以及 `info.json` 中配置好的代理窗口。不需要先自己拼一个窗口数据集。

| 键 | 典型形状 | 含义 |
|----|----------|------|
| `observation.images.head_rgb` | `(3, H, W)` | 相机帧 |
| `observation.state` | `(58,)` | 头/腕位姿 + 40 个手指关节的融合状态 |
| `action` | `(58,)` | 融合动作目标 |
| `observation.eye_gaze` | `(N_g, 2)` | 像素坐标注视窗口 |
| `observation.left_wrist_emg` | `(N_e, 8)` | 8 通道肌电窗口 |
| `observation.eeg_denoise` | `(N_c, 132)` | 132 通道脑电窗口 |

代理窗口是变长的，batch 时只需要 padding 和 mask。先打印 `ds.meta.features`：有些发布使用 `*_raw` / `*_denoise` 后缀。

## 组默认字段的 batch

```python
from pathlib import Path

import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.utils.data import DataLoader, Subset

from humancoin import HumanCOINDataset

REPO = "HumanCOIN/l3_bedroom_fold_clothes_eye_1600x1200_30fps_12views_eeg128_emg8"
ds = HumanCOINDataset(
    repo_id=REPO,
    root=Path("data") / REPO,
    tolerance_s=1 / 30,          # L3 视频可能比主时钟偏一帧
)

PROXY_KEYS = (
    "observation.eye_gaze",
    "observation.left_wrist_emg",
    "observation.eeg_denoise",
)


def collate(batch):
    out = {
        "observation.images.head_rgb": torch.stack(
            [b["observation.images.head_rgb"] for b in batch]),
        "observation.state": torch.stack([b["observation.state"] for b in batch]),
        "action": torch.stack([b["action"] for b in batch]),
    }
    for key in PROXY_KEYS:
        seqs = [b[key] for b in batch]
        length = max(len(seq) for seq in seqs)
        dim = seqs[0].shape[-1]
        padded = torch.zeros(len(seqs), length, dim)
        mask = torch.zeros(len(seqs), length, dtype=torch.bool)
        for i, seq in enumerate(seqs):
            if len(seq):
                padded[i, :len(seq)] = seq
                mask[i, :len(seq)] = True
        out[key] = padded
        out[f"{key}_mask"] = mask
    return out


loader = DataLoader(
    Subset(ds, range(1, len(ds))),   # 跳过第 0 帧，它的视频可能晚一个 tick
    batch_size=8,
    shuffle=True,
    collate_fn=collate,
)
```

## Demo：把 gaze / EMG / EEG 接入动作头

这个模型刻意做小：一个图像编码器、一个 state 编码器、每路代理一个编码器、masked mean pooling，最后接动作头。它足以演示注视、肌电和脑电如何与 `o`、`a` 进入同一次前向。

```python
class ProxyPolicy(nn.Module):
    def __init__(self, state_dim=58, action_dim=58, width=64):
        super().__init__()
        self.image = nn.Sequential(
            nn.Conv2d(3, 16, 5, stride=2, padding=2), nn.ReLU(),
            nn.Conv2d(16, 32, 3, stride=2, padding=1), nn.ReLU(),
            nn.AdaptiveAvgPool2d(1), nn.Flatten(),
            nn.Linear(32, width),
        )
        self.state = nn.Linear(state_dim, width)
        self.gaze = nn.Linear(2, width)
        self.emg = nn.Linear(8, width)
        self.eeg = nn.Linear(132, width)
        self.head = nn.Sequential(
            nn.Linear(width * 5, width * 2), nn.GELU(),
            nn.Linear(width * 2, action_dim),
        )

    @staticmethod
    def masked_mean(x, mask):
        x = x * mask.unsqueeze(-1)
        return x.sum(1) / mask.sum(1, keepdim=True).clamp_min(1)

    def forward(self, batch):
        image = F.interpolate(
            batch["observation.images.head_rgb"],
            size=(128, 128), mode="bilinear", align_corners=False,
        )
        z_img = self.image(image)
        z_state = self.state(batch["observation.state"])
        z_gaze = self.masked_mean(
            self.gaze(batch["observation.eye_gaze"]),
            batch["observation.eye_gaze_mask"],
        )
        z_emg = self.masked_mean(
            self.emg(batch["observation.left_wrist_emg"]),
            batch["observation.left_wrist_emg_mask"],
        )
        z_eeg = self.masked_mean(
            self.eeg(batch["observation.eeg_denoise"]),
            batch["observation.eeg_denoise_mask"],
        )
        return self.head(torch.cat([z_img, z_state, z_gaze, z_emg, z_eeg], dim=-1))


device = "cuda" if torch.cuda.is_available() else "cpu"
model = ProxyPolicy().to(device)
optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)

for step, batch in enumerate(loader):
    batch = {key: value.to(device) for key, value in batch.items()}
    pred = model(batch)
    loss = F.mse_loss(pred, batch["action"])
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()
    print(f"step {step}: loss={loss.item():.4f}")
    if step == 0:
        break
```

在真实 L3 episode 上可以跑一步；这只说明形状和梯度接通了。

## 接到 LeRobot Diffusion Policy

LeRobot 的 `DiffusionPolicy` 消费 `observation.images.*`、`observation.state` 和 `action`，用图像与 state 编码器构造 global conditioning。原版 `DiffusionConfig` 没有 gaze/EMG/EEG 的一等输入。要把代理信号接进去，可以把三路 embedding 融合成一个向量，然后：

- 拼到 `observation.state`，同时加宽策略的 state 特征；
- 或在 `DiffusionModel._prepare_global_conditioning` 中作为额外的 global-conditioning token 注入。

`lerobot-train` 还要求合并成单表、带统计量的 `LeRobotDataset`；HumanCOIN 的逐流布局不是那个格式。生产流水线需要一个小适配器，或先把固定频率视图物化。

## 为什么不能直接使用

- **动作空间是人体，不是机器人。** `action` 是 58 维融合位姿与手指向量；机器人需要重定向、隐动作空间或不同输出头。
- **一条 episode 不构成数据集。** 这里是 28 秒录制上的接线测试。
- **没有归一化和评测。** 动作与代理按原始尺度使用。
- **代理键名会变。** 发布可能使用 `*_raw` / `*_denoise` 或 `left_wrist_emg` / `.denoised`；先读 `ds.meta.features`。
- **窗口默认很短。** 33 ms 只是默认查询，不一定是意图的合适时间上下文。

## 这份语料适合做什么

更有价值的用法在上一层：预训练多模态表征、学习代理模型 `p(m | o)`、训练以意图为条件的架构 `p(a | o, m)`、在只有视频时估计注视/手部位姿，以及检验意图能否跨层迁移。生产级训练配方不是本项目的重点；重点是语料与读取工具。欢迎社区贡献。
