---
layout: home

title: HumanCOIN
description: 一个 12,500 小时的第一视角操作数据集，记录注视、表面肌电与脑电中的意图信号。

hero:
  name: HumanCOIN
  text: 让人的意图，成为数据。
  tagline: 12,500 小时第一视角操作数据。三层测量深度。注视、表面肌电与脑电，共享一套任务本体与一条时间轴。
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/getting-started
    - theme: alt
      text: 数据门户
      link: https://flagopen.github.io/HumanCOIN-DataManager/

features:
  - icon: ⏱
    title: 12,500 小时
    details: 约 13.5 亿个主帧，覆盖 38 类场景和 6 个采集点。
  - icon: 🎬
    title: 38 类场景
    details: 5 个功能区加 1 个残差类，全部来自真实环境。
  - icon: 🧠
    title: 3 个意图层级
    details: L1 注意、L2 用力、L3 认知，按设备嵌套。
  - icon: 🧩
    title: LeRobot 风格
    details: 每个数据流一个 Parquet，外加主索引、MP4 与 WAV。
---

<div class="hc-home-cover">
  <img src="/assets/cover.jpg" alt="HumanCOIN 报告封面">
  <p class="caption">一图看全：三层测量、代理信号与背后的场景。图源：报告封面。</p>
</div>

<div class="hc-section">
  <div class="hc-section-head">
    <h2>从这里开始</h2>
    <p>从第一帧到意图条件模型。</p>
  </div>
  <div class="hc-links">
    <a class="hc-link" href="./getting-started.html">
      <strong>快速开始</strong>
      <span>安装、下载一个仓库，五分钟内读出一帧。</span>
    </a>
    <a class="hc-link" href="./data.html">
      <strong>数据里有什么</strong>
      <span>形式化框架、三个层级、episode 解剖与标注。</span>
    </a>
    <a class="hc-link" href="./download.html">
      <strong>下载数据</strong>
      <span>数据门户、CLI、Hugging Face 与 ModelScope 访问。</span>
    </a>
    <a class="hc-link" href="./format.html">
      <strong>磁盘上的格式</strong>
      <span>逐流 Parquet、主索引与查询时对齐。</span>
    </a>
    <a class="hc-link" href="./visualization.html">
      <strong>可视化</strong>
      <span>浏览器与桌面查看器：相机、信号与 3D 位姿。</span>
    </a>
    <a class="hc-link" href="./usage.html">
      <strong>使用数据</strong>
      <span>默认帧 + gaze/EMG/EEG demo，以及 Diffusion Policy 说明。</span>
    </a>
  </div>
</div>

<div class="hc-rule"><hr></div>

<div class="hc-section">
  <div class="hc-section-head">
    <h2>不只是视频语料</h2>
  </div>
  <p>HumanCOIN 记录“看见”和“行动”之间的过程：手出发之前注视落在哪里，接触之前前臂如何加载，运动命令之前皮层准备了什么。受控 L3 直接测量注视、位姿与手指运动学，因此浅层估计值可以对照参考测量来评估。</p>
</div>
