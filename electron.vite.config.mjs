/*
 * @Date: 2026-04-03 10:30:13
 * @LastEditTime: 2026-04-13 23:33:03
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\electron.vite.config.mjs
 * @Description:
 */
import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import vue from '@vitejs/plugin-vue'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver' // 直接从 unplugin-icons 导出
import Components from 'unplugin-vue-components/vite'

export default defineConfig({
  main: {},
  preload: {},
  renderer: {
    resolve: {
      alias: {
        '@': resolve('src/renderer/src')
      }
    },
    plugins: [
      vue(),
      // 1. 自动导入组件
      Components({
        resolvers: [
          // 关键配置：让翻译官工作
          IconsResolver({
            prefix: 'i', // 标签前缀，如 <i-ep-edit />
            enabledCollections: ['ep'] // 启用 Element Plus 图标集
          })
        ]
      }),
      // 2. 图标插件
      Icons({
        autoInstall: true // 没装数据集时尝试自动安装
      })
    ],
    server: {
      historyApiFallback: true, // 404 走前端路由
      hmr: true,  // 启用热更新
      port: 6001, // Vite 开发服务器（Dev Server）在本地运行的端口号
      proxy: {
        '/api': { // /api 开头的请求都要走这个代理
          target: 'http://localhost:6060', // 代理目标地址
          changeOrigin: true,  // 允许跨域
          rewrite: (path) => path.replace(/^\/api/, '/api') // 重写路径
        }
      }
    }
  }
})
