<template>
  <el-container class="layout">
    <el-header>
      <div class="header-lf">
        <div class="logo flx-center">
          <img class="logo-img" src="@/assets/images/vue.svg" alt="logo" />
          <span class="logo-text">Create Admin</span>
        </div>
        <ToolBarLeft></ToolBarLeft>
      </div>
      <div class="header-ri">
        <ToolBarRight />
      </div>
    </el-header>
    <el-container class="classic-content">
      <el-aside>
        <div class="aside-box" :style="{width: isCollapse ? '65px' : '210px' }">
          <el-scrollbar>
            <el-menu :default-active="activeMenu" :collapse="isCollapse" :router="false" :unique-opened="true"
              :collapse-transition="false">
              <SubMenu :menuList="menuList"></SubMenu>
            </el-menu>
          </el-scrollbar>
        </div>
      </el-aside>
      <el-container class="classic-main">
        <Main />
      </el-container>
    </el-container>
  </el-container>
</template>

<script setup lang='ts' name="classic">
import { useAuthStore } from '@/store/modules/auth'
import { useGlobalStore } from '@/store/modules/global'
import Main from '@/layouts/components/Main/index.vue'
import ToolBarLeft from '@/layouts/components/Header/ToolBarLeft.vue'
import ToolBarRight from '@/layouts/components/Header/ToolBarRight.vue'
import SubMenu from '@/layouts/components/Menu/SubMenu.vue'

const route = useRoute()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const isCollapse = computed(() => globalStore.isCollapse)
const menuList = computed(() => authStore.showMenuListGet)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>