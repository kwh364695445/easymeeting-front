/*
 * @Date: 2026-04-03 20:48:45
 * @LastEditTime: 2026-05-11 11:27:36
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\router\index.js
 * @Description:路由配置
 */
import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: '登录',
    component: () => import('@/views/login/Login.vue')
    // component: () => import('@/views/login/LoginTest.vue')
  },
  {
    path: '/home',
    name: '主页布局',
    redirect: '/meetingMain',
    component: () => import('@/views/Layout.vue'),
    children: [
      {
        path: '/meetingMain',
        name: '首页',
        component: () => import('@/views/meeting/MeetingMain.vue'),
        meta: { code: 'meeting' }
      },
      {
        path: '/contact',
        name: '联系人',
        component: () => import('@/views/contact/Contact.vue'),
        meta: { code: 'contact' }
      },
      {
        path: '/screenCapture',
        name: '录屏',
        component: () => import('@/views/screenCapture/ScreenCapture.vue'),
        meta: { code: 'screenCapture' }
      }
    ]
  }
]
const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})
export default router
