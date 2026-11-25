<script setup lang="ts">
/**
 * The corner code.
 *
 * The release's WeCom group code, parked at the foot of the right-hand column
 * the outline uses — the same place the project homepage puts it. It reads as a
 * thumbnail while a reader is reading and as the scannable card on hover, or on
 * keyboard focus, or on a tap, since touch screens have no hover.
 *
 * The card keeps a white ground in both themes: a QR needs the contrast, and
 * the site's dark paper would break the scan.
 */
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useData, withBase } from 'vitepress'

const QR_SRC = withBase('/assets/wecom-group.png')

/**
 * Locale comes from the page's own file path (`zh/usage.md`): the site data's
 * `lang` is the root locale only, and the router's path carries the base during
 * the build but not in the browser.
 */
const { page } = useData()
const isZh = computed(() => page.value.relativePath.startsWith('zh/'))

const labels = computed(() =>
  isZh.value
    ? { caption: '企业微信扫码入群', aria: '企业微信群二维码，悬停或点击放大' }
    : { caption: 'Scan with WeCom to join the group', aria: 'WeCom group code — hover or tap to enlarge' },
)

const root = ref<HTMLElement | null>(null)
const open = ref(false)

/** Touch screens have no hover, so there the card opens and closes on tap. */
const canHover =
  typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

function toggle() {
  if (canHover) return
  open.value = !open.value
}

function onOutside(e: PointerEvent) {
  if (open.value && root.value && !root.value.contains(e.target as Node)) open.value = false
}

onMounted(() => document.addEventListener('pointerdown', onOutside))
onBeforeUnmount(() => document.removeEventListener('pointerdown', onOutside))
</script>

<template>
  <div ref="root" class="qr" :class="{ 'qr--open': open }">
    <button
      class="qr__card"
      type="button"
      :aria-expanded="open"
      :aria-label="labels.aria"
      @click="toggle"
    >
      <img class="qr__img" :src="QR_SRC" width="396" height="396" :alt="labels.aria" />
      <span class="qr__cap">{{ labels.caption }}</span>
    </button>
  </div>
</template>

<style scoped>
.qr {
  position: fixed;
  /* The outline's right edge: the doc container is centred at the layout max
     width with 32px of padding, so the card lands on the same frame line as
     the outline above it. Where the viewport is narrower than that max, the
     term goes negative and the 32px floor keeps it on the container's edge. */
  right: max(32px, calc((100vw - var(--vp-layout-max-width)) / 2 + 32px));
  bottom: 24px;
  /* below the nav (30) and the mobile backdrop (40) */
  z-index: 20;
}

.qr__card {
  display: block;
  width: 84px;
  padding: 8px;
  border: 1px solid var(--vp-c-border);
  border-radius: 14px;
  background: #ffffff;
  box-shadow: var(--hc-shadow);
  cursor: pointer;
  text-align: center;
  transition: width 260ms cubic-bezier(0.22, 1, 0.36, 1),
    padding 260ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 260ms ease;
}

.qr__img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 8px;
}

/* The caption lives on the white card, so its colour is fixed rather than
   taken from the theme tokens — the dark theme's text would vanish here. */
.qr__cap {
  display: block;
  max-height: 0;
  margin-top: 0;
  overflow: hidden;
  opacity: 0;
  font-size: 0.72rem;
  font-weight: 550;
  line-height: 1.35;
  color: #43525e;
  transition: max-height 260ms cubic-bezier(0.22, 1, 0.36, 1),
    margin-top 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease;
}

.qr:hover .qr__card,
.qr__card:focus-visible,
.qr--open .qr__card {
  width: 200px;
  padding: 10px;
}
.qr:hover .qr__cap,
.qr__card:focus-visible .qr__cap,
.qr--open .qr__cap {
  max-height: 4em;
  margin-top: 8px;
  opacity: 1;
}

@media (max-width: 640px) {
  .qr { bottom: 16px; }
  .qr__card { width: 68px; padding: 6px; border-radius: 12px; }
  .qr:hover .qr__card,
  .qr__card:focus-visible,
  .qr--open .qr__card { width: 168px; padding: 9px; }
}

@media (prefers-reduced-motion: reduce) {
  .qr__card,
  .qr__cap { transition: none; }
}

@media print {
  .qr { display: none; }
}
</style>
