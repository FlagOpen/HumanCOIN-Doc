# 快速开始

从零到解出一帧真实数据，大约五分钟。

## 1. 安装

```bash
pip install -U "humancoin>=0.1.1"
```

支持 Python 3.10–3.13。包固定 LeRobot 0.3.3，并自带下载器、数据读取器和两个可视化器。

## 2. 选一个数据集并下载

打开 **[HumanCOIN 数据门户](https://flagopen.github.io/HumanCOIN-DataManager/)**，按层级、模态、场景、任务或分辨率筛选，勾选仓库，选择 Hugging Face 或 ModelScope，然后点 **Generate Download Command**。

下面是一个 65 MB、29 秒的 L1 仓库：

```bash
humancoin-download --hub huggingface \
  --datasets 'HumanCOIN/l1_study_room_fill_task_1920x1456_30fps_2views' \
  --revision 'b1b5d76c9a06d100733f4e4eac1a3e5f8942dfba' \
  --target-dir ./data --max-workers 8
```

文件落在 `./data/HumanCOIN/<仓库名>/`。L1 仓库会把一条或多条任务录制放在各自的 `<task>/` 目录下，每个任务目录才是一个完整数据集；L2/L3 是扁平的。

多数数据集需要申请访问：先在数据集页面申请，等待通过，再登录：

```bash
hf auth login
hf auth whoami
```

ModelScope 的流程见[下载数据](download.md#modelscope)。

## 3. 读一帧

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

`ds[i]` 先查第 i 个主时钟时间戳，再围绕该时刻解析每一路数据流；没有数据流在写入时被预重采样。

## 4. 看一看

```bash
# 指向任务目录（扁平的 L2/L3 直接用仓库根目录）
TASK=$(dirname "$(dirname "$(find "data/HumanCOIN/l1_study_room_fill_task_1920x1456_30fps_2views" -path '*/meta/info.json' | head -n 1)")")
humancoin-visualize-web "$TASK"
```

浏览器界面默认打开 `http://127.0.0.1:8000`。操作说明见[可视化](visualization.md)。

## 下一步

- [数据里有什么](data.md)
- [下载数据](download.md)
- [使用数据](usage.md)
