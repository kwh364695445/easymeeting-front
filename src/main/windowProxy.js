/*
 * @Date: 2026-04-07 10:37:53
 * @LastEditTime: 2026-04-18 16:34:33
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\main\windowProxy.js
 * @Description: // 统一进行窗口管理
 */
const windowManage = {}

const saveWindow = (id, window) => {
  windowManage[id] = window
}

const getWindow = (id) => {
  return windowManage[id]
}
const delWindow = (id) => {
  delete windowManage[id]
}

const getAllWindow = () => {
  return windowManage
}

export { saveWindow, getWindow, delWindow, getAllWindow }
