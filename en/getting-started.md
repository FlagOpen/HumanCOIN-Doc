# Getting started

From zero to a decoded frame of real HumanCOIN data in about five minutes.

## 1. Install

```bash
pip install -U "humancoin>=0.1.1"
```

Python 3.10–3.13. The package pins LeRobot 0.3.3 and includes the downloader, dataset reader and both visualizers.

## 2. Choose and download a dataset

Open the **[HumanCOIN DataManager](https://flagopen.github.io/HumanCOIN-DataManager/)**, filter by tier, modality, scene, task or resolution, select one or more repositories, choose Hugging Face or ModelScope, then click **Generate Download Command**.

The example below is a 65 MB, 29 s L1 repository:

```bash
humancoin-download --hub huggingface \
  --datasets 'HumanCOIN/l1_study_room_fill_task_1920x1456_30fps_2views' \
  --revision 'b1b5d76c9a06d100733f4e4eac1a3e5f8942dfba' \
  --target-dir ./data --max-workers 8
```

Files land in `./data/HumanCOIN/<repository>/`. An L1 repository groups one or more task recordings; each `<task>/` directory is a complete dataset. L2 and L3 repositories are flat.

Most datasets are gated: request access on the dataset page once, then authenticate:

```bash
hf auth login
hf auth whoami
```

For ModelScope, see [ModelScope access](download.md#modelscope).

## 3. Read one frame

```python
from pathlib import Path
from humancoin import HumanCOINDataset

REPO = "HumanCOIN/l1_study_room_fill_task_1920x1456_30fps_2views"
repo_dir = Path("data") / REPO
task_dir = repo_dir if (repo_dir / "meta/info.json").is_file() else next(
    p for p in sorted(repo_dir.iterdir()) if (p / "meta/info.json").is_file()
)

ds = HumanCOINDataset(repo_id=REPO, root=task_dir)

print(task_dir.name)
print(len(ds), "frames @", ds.fps, "fps")   # 882 frames @ 30.0 fps
frame = ds[0]

print(frame["observation.images.head_left_rectified"].shape)  # (3, 1456, 1920)
print(frame["observation.head_pose"].shape)                   # (7,)
print(frame["eye_gaze_predict"].shape)                        # (2,)
print(frame["task"])
```

`ds[i]` looks up the i-th master-clock timestamp and resolves each stream around it. No stream is pre-resampled.

## 4. Look at it

```bash
# point the viewer at the task directory (flat L2/L3: use the repository root)
TASK=$(dirname "$(dirname "$(find "data/HumanCOIN/l1_study_room_fill_task_1920x1456_30fps_2views" -path '*/meta/info.json' | head -n 1)")")
humancoin-visualize-web "$TASK"
```

The browser viewer opens on `http://127.0.0.1:8000`. See [Visualization](visualization.md) for controls.

## Next

- [What is in the data](data.md)
- [Download](download.md)
- [Using the data](usage.md)
