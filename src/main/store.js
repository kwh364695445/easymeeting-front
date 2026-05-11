/*
 * @Date: 2026-04-18 22:36:31
 * @LastEditTime: 2026-04-18 22:51:12
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\main\store.js
 * @Description:
 */
import Store from 'electron-store'

const store = new Store()

let userId = null

const initUserId = (id) => {
  userId = id
}

const getUserId = () => {
  return userId
}

const setData = (key, value) => {
  store.set(userId + key, value)
}

const getData = (key) => {
  return store.get(userId + key)
}

export default { initUserId, getUserId, setData, getData }
