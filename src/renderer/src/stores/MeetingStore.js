/*
 * @Date: 2026-04-17 17:09:44
 * @LastEditTime: 2026-04-19 15:52:23
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\stores\MeetingStore.js
 * @Description:
 */
import { defineStore } from 'pinia'

const useMeetingStore = defineStore('meetingInfo', {
  state: () => {
    return {
      inMeeting: false,
      lastUpdate: null
    }
  },
  actions: {
    updateMeeting(inMeeting) {
      this.lastUpdate = new Date().getTime()
      this.inMeeting = inMeeting
    }
  }
})

export { useMeetingStore }
