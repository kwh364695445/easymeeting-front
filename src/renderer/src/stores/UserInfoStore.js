/*
 * @Date: 2026-04-17 17:09:44
 * @LastEditTime: 2026-04-17 17:53:25
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\stores\UserInfoStore.js
 * @Description:
 */
import { defineStore } from 'pinia'

const useUserInfoStore = defineStore('userInfo', {
  state: () => {
    return {
      userInfo: {}
    }
  },
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
    },
    getUserInfo() {
      return this.userInfo
    }
  }
})

export { useUserInfoStore }
