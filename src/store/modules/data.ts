import { defineStore } from 'pinia'
import api from '@/api/index'
import piniaPersistConfig from "@/config/piniaPersist";

export const useDataStore = defineStore('data', () => {

  function getControllerList(params: any) {
    return api.data.getControllerList(params)
  }

  return {
    getControllerList,
  }
},{
  persist: piniaPersistConfig('data')
})