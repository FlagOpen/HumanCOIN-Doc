# Reading and alignment

## Master clock

The dataset's frame rate defines a **master clock**. Frame `i` has timestamp `t = i / fps`. Every other stream keeps its native timestamps; `ds[i]` resolves each feature around `t`.

| `window` | Returned value | Typical use |
|----------|----------------|-------------|
| `None` | one nearest sample | state, RGB, one audio chunk |
| `"interpolate"` | linear interpolation at `t` | mid-rate pose |
| `(start, end)` | all samples in `(t + start, t + end]` + `_timestamps` | gaze, EMG, EEG, IMU |

```python
item = ds[100]
print(item["timestamp"])                          # tensor(3.3333)
print(item["observation.eye_gaze"].shape)         # ~[6, 2]
print(item["observation.eeg_denoise"].shape)      # ~[33, 132]
print(item["observation.left_wrist_emg"].shape)   # ~[66, 8]
print(item["observation.images.head_rgb"].shape)  # [3, 360, 640]
print(item["action"].shape)                       # [58]
```

Keys vary by release; print `ds.meta.features` before relying on a name.

## Caching and access order

The first time an episode is touched, each stream's Parquet is loaded and cached. Later frames from that episode are cheap. Video frames decode on demand. Sequential access is much faster than random access across episodes; `num_workers > 0` multiplies memory because each worker has its own cache.

## Index columns and labels

`item` contains `timestamp`, `frame_index`, `episode_index`, `index`, `task_index` and `task`. `index` is global across the repository. In L3, `observation.state` and `action` are 58-D fused vectors: both wrist poses and the head pose (18 values) plus 40 finger joint angles.

## Subsets and delta timestamps

```python
# load only selected episodes
ds = HumanCOINDataset(repo_id=..., root=..., episodes=[0, 2])

# stack one feature over offsets around each queried frame
ds = HumanCOINDataset(
    repo_id=..., root=...,
    delta_timestamps={"observation.head_pose": [-0.5, 0.0, 0.5]},
)
item = ds[100]
print(item["observation.head_pose"].shape)   # [3, 7]
```

`delta_timestamps` is for short temporal context. The current implementation applies one offset list to the stacked features, so pass a single list when per-feature alignment matters.

## Batching

Window features are variable length. Pad and mask them, or use a list collate:

```python
from torch.utils.data import DataLoader

def collate(batch):
    return {key: [b[key] for b in batch] for key in batch[0]}

loader = DataLoader(ds, batch_size=4, shuffle=True, collate_fn=collate)
```

See [Using the data](usage.md) for a padded collate that keeps gaze/EMG/EEG windows as tensors.
