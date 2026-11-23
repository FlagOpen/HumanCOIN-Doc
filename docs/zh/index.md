---
layout: home

title: HumanCOIN
description: 一个 12,500 小时的第一视角操作数据集，记录注视、表面肌电与脑电中的意图信号。

hero:
  name: HumanCOIN
  text: 让人的意图，成为数据。
  tagline: 12,500 小时第一视角操作数据。三层测量深度，让动作背后的意图可观测——共享一套任务本体与一条时间轴。
  actions:
    - theme: brand
      text: 快速开始
      link: /zh/getting-started
    - theme: alt
      text: 数据门户
      link: https://flagopen.github.io/HumanCOIN-DataManager/
---

<div class="hc-film">
  <div class="hc-film-head">
    <p class="hc-eyebrow">技术报告影片 · 3:42</p>
    <h2>HumanCOIN：12,500 小时第一视角操作人类意图数据集</h2>
    <p class="hc-film-meta">BAAI · AhaData Group · 2026 年 11 月</p>
  </div>
  <div class="hc-film-frame">
    <video controls autoplay muted loop playsinline preload="metadata" poster="https://flagopen.github.io/HumanCOIN/film/film-poster.jpg" aria-label="HumanCOIN 技术报告影片">
      <source src="https://flagopen.github.io/HumanCOIN/film/HumanCOIN-film.mp4" type="video/mp4">
      当前浏览器不支持视频播放。<a href="https://flagopen.github.io/HumanCOIN/film/HumanCOIN-film.mp4">直接打开影片</a>。
    </video>
  </div>
  <p class="hc-caption">三分钟浏览语料：三层测量、真实场景，以及让意图可观测的注视、肌电与脑电信号。</p>
</div>

<div class="hc-stats">
  <div class="hc-stat">
    <strong>≈12,500<span>h</span></strong>
    <p>录制规模</p>
    <small>计划总量，三层采集</small>
  </div>
  <div class="hc-stat">
    <strong>7</strong>
    <p>传感器模态</p>
    <small>互补通道</small>
  </div>
  <div class="hc-stat">
    <strong>3</strong>
    <p>采集层级</p>
    <small>广度 × 密度</small>
  </div>
  <div class="hc-stat">
    <strong>1</strong>
    <p>时空基准</p>
    <small>共享时钟与坐标系</small>
  </div>
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
