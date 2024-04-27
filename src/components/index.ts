const importFn = import.meta.glob('@/components/*/*.vue', { eager: true })
import type { App } from 'vue'

interface comObj {
  default?: any
  [props: string]: any;
}

export default {
  async install(app: App) {
    // 自动导入
    for (const keys in importFn) {
      const component = (importFn[keys] as comObj).default
      const name = keys.substring(16, keys.length - 10);
      app.component(name, component)
    }
  }
}