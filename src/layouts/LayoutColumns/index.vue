<template>
  <el-container class="layout">
    <div class="aside-split">
      <div class="logo flx-center">
        <img class="logo-img" src="@/assets/images/logo.svg" alt="logo" />
      </div>
      <el-scrollbar>
        <div class="split-list">
          <div class="split-item" v-for="item in menuList" :key="item.path"
            :class="{ 'split-active': splitActive === item.path || `/${splitActive.split('/')[1]}` === item.path}"
            @click="changeSubMenu(item)">
            <svg-icon v-if="useSvg(item.meta.icon)" iconName="icon-home" iconClass="mr-0 svg-icon "></svg-icon>
            <el-icon v-else>
              <component :is="item.meta.icon"></component>
            </el-icon>
            <el-tooltip class="box-item" effect="light" :content="item.meta.title" placement="right">
              <span class="title">{{  item.meta.title }}</span>
            </el-tooltip>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <el-aside :class="{ 'not-aside': !subMenuList.length }" :style="{ width: isCollapse ? '65px' : '210px' }">
      <div class="logo flx-center">
        <span class="logo-text" v-show="subMenuList.length">{{ isCollapse ? "L" : "Create Admin" }}</span>
      </div>
      <el-scrollbar>
        <el-menu :default-active="activeMenu" :router="false" :collapse="isCollapse" :collapse-transition="false"
          :unique-opened="true">
          <SubMenu :menuList="subMenuList" />
        </el-menu>
      </el-scrollbar>
    </el-aside>
    <el-container>
      <el-header>
        <ToolBarLeft />
        <ToolBarRight />
      </el-header>
      <Main />
    </el-container>
  </el-container>
</template>

<script setup lang='ts'>
import { useAuthStore } from '@/store/modules/auth'
import { useGlobalStore } from '@/store/modules/global'
import Main from '@/layouts/components/Main/index.vue'
import ToolBarLeft from '@/layouts/components/Header/ToolBarLeft.vue'
import ToolBarRight from '@/layouts/components/Header/ToolBarRight.vue'
import SubMenu from '@/layouts/components/Menu/SubMenu.vue'
import { useSvg } from '@/utils/svg'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const globalStore = useGlobalStore()
const isCollapse = computed(() => globalStore.isCollapse)
const menuList = computed(() => authStore.showMenuListGet)
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path) as string)

const subMenuList = ref<Menu.MenuOptions[]>([])
const splitActive = ref('')

watch(
  () => [menuList, route],
  () => {
    // 当前菜单没有数据直接 return
    if (!menuList.value.length) return
    splitActive.value = route.path
    const menuItem = menuList.value.filter((item: Menu.MenuOptions) => {
      return route.path === item.path || `/${route.path.split('/')[1]}` === item.path
    })
    if (menuItem[0].children?.length) return (subMenuList.value = menuItem[0].children)
    subMenuList.value = []
  },
  {
    deep: true,
    immediate: true,
  }
)

// change SubMenu
const changeSubMenu = (item: Menu.MenuOptions) => {
  splitActive.value = item.path
  if (item.children?.length) return (subMenuList.value = item.children)
  subMenuList.value = []
  router.push(item.path)
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>