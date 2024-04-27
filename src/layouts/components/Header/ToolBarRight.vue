<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <AssemblySize id="assemblySize" />
      <SearchMenu id="SearchMenu" />
      <ThemeSetting id="ThemeSetting" />
      <Fullscreen id="Fullscreen" />
    </div>
    <span class="username">{{ username }}</span>
    <Avatar />
  </div>
</template>

<script setup lang="ts">
import AssemblySize from '@/layouts/components/Header/components/AssemblySize.vue'
import SearchMenu from '@/layouts/components/Header/components/SearchMenu.vue'
import { useUserStore } from '@/store/modules/user'
import Fullscreen from '@/layouts/components/Header/components/Fullscreen.vue'
import ThemeSetting from '@/layouts/components/Header/components/ThemeSetting.vue'
import Avatar from './components/Avatar.vue'

const userStore = useUserStore()
const username = computed(() => userStore.userInfo.name)
</script>

<style lang="scss" scoped>
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 15px;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
      color: var(--el-header-text-color);
    }
  }
  .username {
    margin: 0 20px;
    font-size: 15px;
    color: var(--el-header-text-color);
  }
}
</style>