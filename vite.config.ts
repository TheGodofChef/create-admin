import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx"
import AutoImport from 'unplugin-auto-import/vite' // 自动引入插件
import path from 'path'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { compression } from 'vite-plugin-compression2'
import { Plugin as viteCDNPlugin } from 'vite-plugin-cdn-import'
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'src/auto-import.d.ts',
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    compression(),
    viteCDNPlugin({
      modules: [
        {
          name: "vue",
          var: "Vue",
          path: "https://unpkg.com/vue@3/dist/vue.global.js"
        },
       /*  {
          name: "element-plus",
          var: "ElementPlus",
          path: "https://unpkg.com/element-plus",
          css: "https://unpkg.com/element-plus/dist/index.css"
        } */
      ]
    }),
    createSvgIconsPlugin({
      // 指定要缓存的图标文件夹（将所有svg都放在一个文件夹下）
      iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
          // 指定symbolId格式
          symbolId: '[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  build: {
    chunkSizeWarningLimit: 2000,
    cssCodeSplit: true, // css 拆分
    sourcemap: false,
    minify: 'esbuild', // 是否禁用最小化混淆， esbuild打包速度最快 terser打包体积最小 false 禁用
    assetsInlineLimit: 4096, // 小于这个值的东西会转成base64
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // 将node_modules里的文件分别打包
          if(id.includes("node_modules")) {
            return "vendor"
          }
        }
      }
    }
  },
  server: {
    proxy: {
      /* "/api": {
        target: "http://127.0.0.1:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      }, */
      '/api': {
        target: 'http://192.168.6.74:8088',
        changeOrigin: true,
        ws: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    open: true, // 项目运行自动打开
  },
  css: {
    modules: {
      // localsConvention: 'camelCaseOnly', // 修改生成的配置对象的key的展示形式（驼峰或者中划线）
      // scopeBehaviour: 'local', // 配置当前的模块化行为是模块化还是全局化
      // hashPrefix: 'hello', // 生成的hash会根据你的类名 + 一些其他的字符串（文件名+他内部随机生成的一些字符）去生成
      // globalModulePaths: [], // 代表你不想参与到css模块化的路径
    },
    preprocessorOptions: { // key + config key代表预处理器的名
      less: {
        // math: 'always',
        /* globalVars: { // 全局变量
          mainColor: 'red'
        } */
      }
    },
    // devSourcemap: true, // 开发模式下，显示源文件（文件索引）
    /* postcss: {
      plugins: []
    }, */

  },
  clearScreen: false
})
