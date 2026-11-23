# Using the data

`ds[i]` already returns everything needed for a per-frame batch: the default observation, state and action, plus the proxy windows configured in `info.json`. There is no need to build a custom window dataset.

| Key | Typical shape | Meaning |
|-----|---------------|---------|
| `observation.images.head_rgb` | `(3, H, W)` | camera frame |
| `observation.state` | `(58,)` | fused head/wrist pose + 40 finger joints |
| `action` | `(58,)` | fused action target |
| `observation.eye_gaze` | `(N_g, 2)` | gaze window in pixels |
| `observation.left_wrist_emg` | `(N_e, 8)` | EMG window |
| `observation.eeg_denoise` | `(N_c, 132)` | EEG window |

The proxy windows are variable-length; batching only needs padding and a mask. Print `ds.meta.features` first — some releases use `*_raw` / `*_denoise` suffixes.

## Batch the default fields

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
    tolerance_s=1 / 30,          # L3 videos can be one frame off the master grid
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
    Subset(ds, range(1, len(ds))),   # skip frame 0, whose video may start late
    batch_size=8,
    shuffle=True,
    collate_fn=collate,
)
```

## Demo: add gaze, EMG and EEG to the action head

This small model has one image encoder, one state encoder, one encoder per proxy, masked mean pooling and an action head. It is enough to show gaze, EMG and EEG entering the same forward pass as `o` and `a`.

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

On a real L3 episode this runs one step; that only proves the shapes and gradients line up.

## Connecting to LeRobot Diffusion Policy

LeRobot's `DiffusionPolicy` consumes `observation.images.*`, `observation.state` and `action`, and builds global conditioning from its image and state encoders. The stock `DiffusionConfig` has no first-class gaze/EMG/EEG inputs. To use the proxies there, fuse the three proxy embeddings into one vector and either:

- concatenate it to `observation.state` and widen the policy state feature, or
- inject it as an extra global-conditioning token inside `DiffusionModel._prepare_global_conditioning`.

`lerobot-train` also expects a merged `LeRobotDataset` with dataset statistics; HumanCOIN's per-stream layout is not that format. A production pipeline needs a small adapter or a materialised fixed-rate view.

## Why this is not directly usable

- **The action is human, not robotic.** `action` is a 58-D fused pose-and-finger vector; a robot needs retargeting, a latent action space or a different head.
- **One episode is not a dataset.** This is a plumbing test on a 28 s recording.
- **No normalisation or evaluation.** Actions and proxies are used at raw scale.
- **Proxy keys vary.** Releases can use `*_raw` / `*_denoise` or `left_wrist_emg` / `.denoised`; read `ds.meta.features`.
- **Windows are short by default.** A 33 ms query window is a default, not necessarily the right temporal context for intent.

## What the corpus is for

The interesting uses are one level up: pretraining multimodal representations, learning proxy models `p(m | o)`, training intent-conditioned architectures `p(a | o, m)`, estimating gaze/hand pose from video, and testing whether intent transports across tiers. A production training recipe is not the focus of this project; the corpus and its readers are. Community contributions are welcome.
