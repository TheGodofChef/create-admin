import { defineStore } from 'pinia'
import { useDataStore } from './modules/data'

export const indexStore = defineStore('index', () => {
  // 在 Setup Store 中：
  // ref() 就是 state 属性
  // computed() 就是 getters
  // function() 就是 actions
  // Option 的写法可以直接去看菠萝的文档
  return {
    /* permission: usePermissionStore(), */
    data: useDataStore()
  }
}/* ,{persist: true} */)
