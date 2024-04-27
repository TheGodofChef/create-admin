import axios from 'axios'
import qs from 'qs'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { getToken } from '@/utils/auth'
import type { AxiosResponse, AxiosRequestConfig } from 'axios'
import router from '@/router'

interface headerInter {
  'Content-Type'?: string,
  'Authorization'?: string | null
  'type'?: string | null
  [props: string]: any;
}
type configType = {
  download?: boolean
  [params: string]: any
}

let store: any
// create an axios instance

function blobToString(blob: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsText(blob);
    reader.onload = () => {
      resolve(JSON.parse(reader.result as string));
    };
    reader.onerror = reject;
  });
}

// create an axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, // url = base url + request url
  timeout: 5000, // request timeout
})
// request interceptor
instance.interceptors.request.use(
  (config: any) => {
    if(!store) store = useUserStore()
    if (store.token) {
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  (error: any) => {
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data
    if (res.code && res.code !== 200) {
      ElMessage({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return response
    }
  },
  async (error: any) => {
    let data = null
    if (error.response.data instanceof Blob) {
      data = await blobToString(error.response.data)
    } else {
      data = error.response.data
    }

    if(error.response.status === 401) {
      store.dispatch('user/logout')
      ElMessage({
        message: '登录超时，请重新登录',
        type: 'error',
        duration: 5 * 1000
      })
      return router.push('/login')
    }
    ElMessage({
      message: data.msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(data)
  }
)

export default (url: string, method: string, params: any, config: configType= {}) => {
  // 负责发请求
  const headerConfig: headerInter = {}
  let { responseType, download, headers } = config
  if(download) {
    responseType = 'blob'
  }
  if(method === 'post' ) {
    headerConfig['Content-Type'] = 'application/x-www-form-urlencoded'
    params = qs.stringify(params)
  }
  if(method === 'uploadFile') {
    method = 'post'
    headerConfig['Content-Type'] = 'multipart/form-data'
  }
  if(method === 'postJSON' ) {
    method = 'post'
    headerConfig['Content-Type'] = 'application/json'
  }
  Object.assign(headerConfig, headers)
  return instance({
    url,
    method,
    [method.toLowerCase() === 'get' ? 'params' : 'data']: params,
    headers: headerConfig,
    responseType
  }).then((res: any) => {
    if (config.download) {
      const contentDisposition = res.headers['content-disposition']
      let fileName = ''
      if (contentDisposition) {
        fileName = contentDisposition.replace(/.*filename[*]?=(.*)utf\-8''?/, '$1')
      }
      fileName = decodeURI(fileName)
      const config: any = {}
      if(fileName.includes('zip')) {
        config.type = 'application/zip'
      }
      const url = window.URL.createObjectURL(new Blob([res.data], config))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', fileName)

      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
      return { data: res.data }
    }
    return res.data
  }, err => {
    return Promise.resolve(err)
  })
}
