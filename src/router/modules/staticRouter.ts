import { RouteRecordRaw } from "vue-router";
import { LOGIN_URL } from "@/config";

export const staticRouter: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home/index'
  },
  {
    path: LOGIN_URL,
    name: "login",
    component: () => import("@/view/login/index.vue"),
    meta: {
      title: "登录"
    }
  },
  {
    path: "/layout",
    name: "layout",
    component: () => import("@/layouts/index.vue"),
    redirect: '/home/index',
    children: [

    ]
  }
]

export const asyncRouter: Menu.MenuOptions[] = [
  {
    path: '/home/index',
    name: 'home',
    /* component: () => import('@/view/home/index.vue'), */
    component: '/home/index',
    meta: { title: '首页', icon: "icon-home", isAffix: true, isKeepAlive: true, isHide: false, isFull: false }
  },
  {
    path: '/test/index',
    name: 'test',
    component: '/test/index',
    /* component: () => import('@/view/test/index.vue'), */
    meta: { title: '测试', icon: "Box", isAffix: false, isKeepAlive: true, isHide: false, isFull: false}
  },
  {
    path: '/testNest',
    name: 'testNest',
    meta: { title: '测试多级路由', icon: "Box", isAffix: false, isKeepAlive: true, isHide: false, isFull: false},
    redirect: "/testNest/testChildren",
    children: [
      {
        path: '/testNest/testChildren',
        name: 'ho1me',
        component: '/test/index',
        /* component: () => import('@/view/test/index.vue'), */
        meta: { title: '子路由', icon: "HomeFilled", isAffix: false,  isKeepAlive: true, isHide: false, isFull: false}
      },
    ]
  }
]