import { createApp } from 'vue'
// reset style sheet
import "@/styles/reset.scss";
// CSS common style sheet
import "@/styles/common.scss";
// custom element css
import "@/styles/element.scss";
// iconfont css
import "@/assets/iconfont/iconfont.scss";
// element dark css
import "element-plus/theme-chalk/dark/css-vars.css";
// custom element dark css
import "@/styles/element-dark.scss";
// custom element css
import "@/styles/element.scss";
import 'element-plus/dist/index.css'
// vue i18n
import I18n from "@/languages/index";
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// element plus
import ElementPlus from "element-plus";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import component from './components'
import FormCreate from '@form-create/element-ui'
import directives from "@/directives/index";
import 'virtual:svg-icons-register';

const app = createApp(App)

export const pinia = createPinia()
pinia.use(piniaPluginPersistedstate);

app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.use(I18n)
app.use(component)
app.use(FormCreate)
app.use(directives)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.mount('#app')
