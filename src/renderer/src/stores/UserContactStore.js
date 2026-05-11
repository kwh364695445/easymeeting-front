/*
 * @Date: 2026-05-01 11:48:14
 * @LastEditTime: 2026-05-01 22:34:25
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\stores\UsercontactStore.js
 * @Description: 用户联系人
 */
import { defineStore } from 'pinia'

export const useUserContactStore = defineStore('userContact', {
  state: () => {
    return {
      lastUpdate: null
    }
  },
  actions: {
    updateLastUpdate() {
      this.lastUpdate = Date.now()
    }
  }
})
