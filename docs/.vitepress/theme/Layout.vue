<script setup lang="ts">
/**
 * The default layout, plus the group code.
 *
 * VitePress renders one Layout component for every page; wrapping the default
 * one is the documented way to add chrome that is not part of the content. The
 * slot puts the card inside the layout rather than beside it, so the layout's
 * own z-index stack keeps making sense.
 */
import DefaultTheme from 'vitepress/theme'
import QrCorner from './QrCorner.vue'

const DefaultLayout = DefaultTheme.Layout
</script>

<template>
  <DefaultLayout>
    <template #layout-bottom>
      <QrCorner />
    </template>
  </DefaultLayout>
</template>
