/*
 * @Date: 2026-05-02 20:24:44
 * @LastEditTime: 2026-05-02 20:25:08
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\global.d.ts
 * @Description:
 */
import { IpcRenderer } from 'electron'

declare global {
  interface Window {
    // 直接告诉 TS，window.electron.ipcRenderer 的类型就是 Electron 官方定义的那个
    electron: {
      ipcRenderer: IpcRenderer
    }
  }
}
