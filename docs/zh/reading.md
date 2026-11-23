# 读取与对齐

## 主时钟

数据集帧率定义一条**主时钟**。第 `i` 帧时间戳是 `t = i / fps`；其他流保留原生时间戳，`ds[i]` 围绕 `t` 解析每一路。

| `window` | 返回值 | 典型用途 |
|----------|--------|----------|
| `None` | 最近的一个采样 | 状态、RGB、一个音频 chunk |
| `"interpolate"` | 在 `t` 处线性插值 | 中频位姿 |
| `(start, end)` | `(t + start, t + end]` 内的全部采样 + `_timestamps` | 注视、肌电、脑电、IMU |

```python
item = ds[100]
print(item["timestamp"])                          # tensor(3.3333)
print(item["observation.eye_gaze"].shape)         # 约 [6, 2]
print(item["observation.eeg_denoise"].shape)      # 约 [33, 132]
print(item["observation.left_wrist_emg"].shape)   # 约 [66, 8]
print(item["observation.images.head_rgb"].shape)  # [3, 360, 640]
print(item["action"].shape)                       # [58]
```

键名随发布变化，先打印 `ds.meta.features`。

## 缓存与访问顺序

第一次访问某条 episode 时，每路 Parquet 会被加载并缓存；之后再读同一 episode 很快。视频帧按需解码。顺序读取远快于跨 episode 随机读取；`num_workers > 0` 会成倍增加内存。

## 索引列与标签

`item` 包含 `timestamp`、`frame_index`、`episode_index`、`index`、`task_index` 和 `task`。`index` 是仓库内全局帧号。在 L3，`observation.state` 和 `action` 是 58 维融合向量：双腕位姿与头部位姿（18 维）加 40 个手指关节角。

## 子集与 delta 时间戳

```python
# 只加载指定 episode
ds = HumanCOINDataset(repo_id=..., root=..., episodes=[0, 2])

# 把特征在查询帧前后若干偏移上堆叠
ds = HumanCOINDataset(
    repo_id=..., root=...,
    delta_timestamps={"observation.head_pose": [-0.5, 0.0, 0.5]},
)
item = ds[100]
print(item["observation.head_pose"].shape)   # [3, 7]
```

`delta_timestamps` 适合短时上下文。当前实现把同一组偏移应用到被堆叠的特征上，依赖逐特征对齐时只传一组偏移。

## 组 batch

窗口特征是变长的，可以 padding + mask，或用列表 collate：

```python
from torch.utils.data import DataLoader

def collate(batch):
    return {key: [b[key] for b in batch] for key in batch[0]}

loader = DataLoader(ds, batch_size=4, shuffle=True, collate_fn=collate)
```

需要把 gaze/EMG/EEG 保留为张量的 padded collate，见[使用数据](usage.md)。
