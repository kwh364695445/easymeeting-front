/*
 * @Date: 2026-04-03 10:30:13
 * @LastEditTime: 2026-05-10 11:29:44
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\main\index.js
 * @Description:
 */
import { app, shell, BrowserWindow, ipcMain, Tray } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { saveWindow } from './windowProxy'

import {
  onLoginOrRegister,
  onWinTitleOp,
  onLoginSuccess,
  onGetScreenSource,
  onStartRecording,
  onStopRecording,
  onOpenLocalPath
} from './ipc'
import { Menu } from 'electron/main'

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 375,
    height: 365,
    show: false,
    autoHideMenuBar: true, // 自动隐藏菜单栏
    resizable: false, // 禁止用户通过拖拽窗口边缘来改变窗口大小
    frame: false, // 无边框窗口(隐藏顶部标题栏)
    transparent: false, // 窗口不透明
    maximizable: false, // 禁止双击标题或用原生ui使窗口最大化(不能阻止调用api来进行最大化)
    // alwaysOnTop: true, // 添加这行代码，让窗口始终显示在最上层
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  saveWindow('main', mainWindow)

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })
  //当窗口maximize和unmaximize时，传递过来窗口最大化的状态给渲染进程(双击标题栏了点击最大化图标都会导致状态变化，因此需要从主进程传递)
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('winIsMax', true)
  })
  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('winIsMax', false)
  })

  //托盘设置
  const tray = new Tray(icon) //创建托盘并设置图标
  tray.setToolTip('MyMeeting') //设置鼠标悬停提示
  // 点击托盘图标时显示窗口
  tray.on('click', () => {
    mainWindow.setSkipTaskbar(false) // 显示在任务栏
    mainWindow.show() // 显示窗口
  })

  // 定义右键菜单模板
  const contextMenu = [
    {
      label: '退出',
      click() {
        app.quit()
      }
    }
  ]
  const menu = Menu.buildFromTemplate(contextMenu) // 创建菜单
  tray.setContextMenu(menu) //  关联菜单与托盘

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

onLoginOrRegister()
onWinTitleOp()
onLoginSuccess()
onGetScreenSource()
onStartRecording()
onStopRecording()
onOpenLocalPath()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
