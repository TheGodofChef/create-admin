<template>
  <el-container class="layout">
    <el-header>
      <div class="logo flx-center">
        <img class="logo-img" src="@/assets/images/vue.svg" alt="logo" />
        <span class="logo-text">Create Admin</span>
      </div>
      <el-menu mode="horizontal" :default-active="activeMenu" :router="false" :unique-opened="true">
        <template v-for="subItem in menuList" :key="subItem.path">
          <el-sub-menu v-if="subItem.children?.length" :index="subItem.path + 'el-sub-menu'" :key="subItem.path">
            <template #title>
              <svg-icon v-if="useSvg(subItem.meta.icon)" iconName="icon-home"></svg-icon>
              <el-icon v-else>
                <component :is="subItem.meta.icon"></component>
              </el-icon>
              <span class="sle">{{ subItem.meta.title }}</span>
            </template>
            <SubMenu :menuList="subItem.children" />
          </el-sub-menu>
          <el-menu-item v-else :index="subItem.path" :key="subItem.path + 'el-menu-item'"
            @click="handleClickMenu(subItem)">
            <svg-icon v-if="useSvg(subItem.meta.icon)" iconName="icon-home"></svg-icon>
            <el-icon v-else>
              <component :is="subItem.meta.icon"></component>
            </el-icon>
            <template #title>
              <span class="sle">{{ subItem.meta.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
      <ToolBarRight />
    </el-header>
    <Main />
  </el-container>
</template>

<script setup lang='ts' name="classic">
import { useAuthStore } from '@/store/modules/auth'
/* import { useGlobalStore } from '@/store/modules/global' */
import Main from '@/layouts/components/Main/index.vue'
import ToolBarRight from '@/layouts/components/Header/ToolBarRight.vue'
import SubMenu from '../components/Menu/SubMenu.vue'
import { useSvg } from '@/utils/svg'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
/* const globalStore = useGlobalStore() */
/* const isCollapse = computed(() => globalStore.isCollapse) */
const menuList = computed(() => authStore.showMenuListGet)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)
const handleClickMenu = (subItem: Menu.MenuOptions) => {
  if (subItem.meta.isLink) return window.open(subItem.meta.isLink, '_blank')
  router.push(subItem.path)
}
</script>

<style lang='scss' scoped>
@import './index.scss';
</style>