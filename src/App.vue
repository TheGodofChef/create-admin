<template>
  <el-config-provider :locale="locale" :size="assemblySize" :button="buttonConfig">
    <router-view></router-view>
  </el-config-provider>

</template>

<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useGlobalStore } from '@/store/modules/global'
import { useTheme } from '@/hooks/useTheme'

const globalStore = useGlobalStore()

// init theme
const { initTheme } = useTheme()
initTheme()

const locale = zhCn
// element assemblySize
const assemblySize = computed(() => globalStore.assemblySize)

// element button config
const buttonConfig = reactive({ autoInsertSpace: false })
</script>

<style scoped>
</style>
