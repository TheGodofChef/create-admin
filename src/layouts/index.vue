<template>
  <component :is="LayoutComponents[layout]" />
  <ThemeDrawer />
</template>

<script setup lang="ts" name="layout">
import { computed, type Component } from 'vue'
import { LayoutType } from '@/store/interface/index'
import { useGlobalStore } from '@/store/modules/global'
import LayoutVertical from './LayoutVertical/index.vue'
import ThemeDrawer from '@/layouts/components/ThemeDrawer/index.vue'
import LayoutClassic from './LayoutClassic/index.vue'
import LayoutTransverse from './LayoutTransverse/index.vue'
import LayoutColumns from './LayoutColumns/index.vue'

const LayoutComponents: Record<LayoutType, Component> = {
  vertical: LayoutVertical,
  classic: LayoutClassic,
  transverse: LayoutTransverse,
  columns: LayoutColumns,
}
const globalStore = useGlobalStore()
const layout = computed(() => globalStore.layout)
</script>


<style scoped lang="scss">
.layout {
  min-width: 600px;
}
</style>