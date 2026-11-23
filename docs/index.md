---
layout: home

title: HumanCOIN
description: A 12,500-hour egocentric manipulation dataset that records human intent through gaze, surface EMG and EEG.

hero:
  name: HumanCOIN
  text: Human intent, at dataset scale.
  tagline: 12,500 hours of egocentric manipulation. Three measurement tiers. Gaze, surface EMG and EEG on one task ontology and one time base.
  actions:
    - theme: brand
      text: Quick start
      link: /getting-started
    - theme: alt
      text: Data portal
      link: https://flagopen.github.io/HumanCOIN-DataManager/

features:
  - icon: ⏱
    title: 12,500 hours
    details: 1.35 B master frames across 38 scene classes and 6 collection sites.
  - icon: 🎬
    title: 38 scene classes
    details: Five functional zones plus a residual class, recorded in real environments.
  - icon: 🧠
    title: 3 intent tiers
    details: L1 attention, L2 exertion and L3 cognition, nested by instrumentation.
  - icon: 🧩
    title: LeRobot-style
    details: One Parquet per stream plus a master index, MP4 video and WAV audio.
---

<div class="hc-home-cover">
  <img src="/assets/cover.jpg" alt="HumanCOIN report cover">
  <p class="caption">The corpus in one view: three tiers, proxy signals and the scenes behind them. Figure from the report.</p>
</div>

<div class="hc-section">
  <div class="hc-section-head">
    <h2>Start here</h2>
    <p>From first frame to an intent-conditioned model.</p>
  </div>
  <div class="hc-links">
    <a class="hc-link" href="./getting-started.html">
      <strong>Quick start</strong>
      <span>Install, download one repository and read a frame in five minutes.</span>
    </a>
    <a class="hc-link" href="./data.html">
      <strong>What is in the data</strong>
      <span>The formal framing, three tiers, episode anatomy and annotations.</span>
    </a>
    <a class="hc-link" href="./download.html">
      <strong>Download</strong>
      <span>The data portal, CLI, Hugging Face and ModelScope access.</span>
    </a>
    <a class="hc-link" href="./format.html">
      <strong>On-disk format</strong>
      <span>Per-stream Parquet, master index and query-time alignment.</span>
    </a>
    <a class="hc-link" href="./visualization.html">
      <strong>Visualization</strong>
      <span>Browser and desktop viewers for cameras, signals and 3D pose.</span>
    </a>
    <a class="hc-link" href="./usage.html">
      <strong>Using the data</strong>
      <span>Default frames plus a gaze/EMG/EEG demo and Diffusion Policy notes.</span>
    </a>
  </div>
</div>

<div class="hc-rule"><hr></div>

<div class="hc-section">
  <div class="hc-section-head">
    <h2>A dataset, not just a video corpus</h2>
  </div>
  <p>HumanCOIN records what happens between seeing and acting: where gaze lands before the hand moves, how the forearm loads before contact, and what the cortex prepares before the motor command. The controlled L3 subset measures gaze, pose and finger kinematics directly, so estimates in the shallower tiers can be scored against reference measurements.</p>
</div>
