import request from '@/utils/request/request'
import dayjs from 'dayjs'

export default {
  // 获取控制器列表
  getControllerList: (params) => {
    if (params.time) {
      params.startTime = dayjs(params.time[0]).format('YYYY-MM-DD HH:mm:ss')
      params.endTime = dayjs(params.time[1]).format('YYYY-MM-DD HH:mm:ss')
      delete params.time
    }
    return request('/controlCollector/page', 'get', params, {})
  },
}