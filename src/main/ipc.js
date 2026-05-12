/*
 * @Date: 2026-04-07 10:32:01
 * @LastEditTime: 2026-05-11 14:44:55
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\main\ipc.js
 * @Description: 主进程中与渲染进程通信相关的事件
 */
import { ipcMain, desktopCapturer, shell } from 'electron'
import { getWindow } from './windowProxy'
import { BrowserWindow } from 'electron/main'
import { initWs } from './wsClient'
import store from './store'
import { startRecording, stopRecording } from './recording'

// 随登录或注册状态改变窗口大小
const onLoginOrRegister = () => {
  ipcMain.on('loginOrRegister', (e, isLogin) => {
    const login_width = 375
    const login_height = 365
    const register_height = 485
    const mainWindow = getWindow('main')
    mainWindow.setResizable(true)
    mainWindow.setMinimumSize(login_width, login_height)
    // 设置登录和注册时对应窗口
    isLogin
      ? mainWindow.setSize(login_width, login_height)
      : mainWindow.setSize(login_width, register_height)
    mainWindow.setResizable(false)
  })
}

// 窗口最小化、最大化、关闭控制
const onWinTitleOp = () => {
  ipcMain.on('winTitleOp', (event, { action, data }) => {
    const win = BrowserWindow.fromWebContents(event.sender) // 通过事件对象获取当前窗口
    switch (action) {
      case 'close':
        if (data.closeType == 0) {
          win.forceClose = data.forceClose
          win.close()
        } else {
          win.setSkipTaskbar(true) // 从任务栏移除
          win.hide() // 隐藏窗口
        }
        break
      case 'minimize':
        win.minimize()
        break
      case 'maximize':
        win.maximize()
        break
      case 'unmaximize':
        win.unmaximize()
        break
    }
  })
}

const onLoginSuccess = () => {
  ipcMain.handle('loginSuccess', (e, { userInfo, wsUrl }) => {
    const win = BrowserWindow.fromWebContents(e.sender)
    win.setResizable(true)
    win.setMinimumSize(720, 480)
    win.setSize(720, 480)
    win.setResizable(false)
    initWs(wsUrl + userInfo.token)
    store.initUserId(userInfo.userId)
    store.setData('userInfo', userInfo)
  })
}

const onGetScreenSource = () => {
  // 获取屏幕截图
  ipcMain.handle('getScreenSources', async (event, opts) => {
    const sources = await desktopCapturer.getSources(opts)
    return sources
      .filter((source) => {
        const size = source.thumbnail.getSize()
        return size.width > 10 && size.height > 10
      })
      .map(({ id, name, display_id, thumbnail }) => ({
        id,
        name,
        displayId: display_id,
        // thumbnail: thumbnail.toDataURL()
        thumbnail: 'data:image/jpeg;base64,' + thumbnail.toJPEG(80).toString('base64')
      }))
  })
}

const onStartRecording = () => {
  ipcMain.on('startRecording', (e, { displayId, mic }) => {
    startRecording(e.sender, displayId, mic)
  })
}
const onStopRecording = () => {
  ipcMain.on('stopRecording', stopRecording)
}

const onOpenLocalPath = () => {
  ipcMain.on('openLocalFile', (event, { localFilePath, folder = false }) => {
    if (folder) {
      shell.openPath(localFilePath) // 直接打开文件或文件夹
      return
    }
    shell.showItemInFolder(localFilePath) // 打开文件所在目录
  })
}

export {
  onLoginOrRegister,
  onWinTitleOp,
  onLoginSuccess,
  onGetScreenSource,
  onStartRecording,
  onStopRecording,
  onOpenLocalPath
}
