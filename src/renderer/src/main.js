/*
 * @Date: 2026-04-03 10:30:13
 * @LastEditTime: 2026-05-10 19:38:51
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\main.js
 * @Description:
 */
import './assets/base.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/icons/iconfont.css'

import { createPinia } from 'pinia'

import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'

import globalComponents from '@/components'

import * as utils from '@/utils'

const app = createApp(App)
app.use(ElementPlus)
app.use(router)
app.use(createPinia())

app.use(globalComponents) // 激活全局组件注册

app.provide('utils', { ...utils })
app.mount('#app')
