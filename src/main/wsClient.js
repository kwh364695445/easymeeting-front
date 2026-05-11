/*
 * @Date: 2026-04-18 11:04:50
 * @LastEditTime: 2026-05-01 21:39:25
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\main\wsClient.js
 * @Description:WebSocket客户端
 */
import WebSocket from 'ws'
import { getWindow, getAllWindow } from './windowProxy'

// 心跳间隔时间（毫秒）
const HEARTBEAT_INTERVAL = 5000
// 最大重试连接次数
const MAX_RETRY_COUNT = 5

// 全局变量定义
let ws = null // WebSocket实例
let heartBeatTimer = null // 心跳定时器
let retryCount = 0 // 当前重试次数
let retryDelay = 2000 // 初始重连延迟时间
let wsUrl = null // WebSocket服务器地址
let needReconnect = false // 是否需要重连标志

/**
 * 检查是否启用WebSocket连接检查功能
 * @returns {boolean} 返回环境变量VITE_WS_CHECK的布尔值
 */
const wsCheck = () => {
  return import.meta.env.VITE_WS_CHECK === 'true'
}

/**
 * 初始化WebSocket连接
 * @param {string} _wsUrl - WebSocket服务器地址
 */
const initWs = (_wsUrl) => {
  wsUrl = _wsUrl
  needReconnect = true
  connectWs()
}

/**
 * 建立WebSocket连接
 * 如果当前已有连接中的WebSocket，则直接返回
 * 设置连接事件监听器：onopen、onmessage、onerror、onclose
 */
const connectWs = () => {
  // 检查当前WebSocket状态，避免重复连接
  if (ws && ws.retryCount === (WebSocket.CONNECTING || WebSocket.OPEN)) {
    console.log('已经或正在连接')
    return
  }
  console.log(`尝试连接...(重试次数：${retryCount}/${MAX_RETRY_COUNT}), 连接地址：${wsUrl}`)
  ws = new WebSocket(wsUrl)

  // WebSocket连接建立成功回调
  ws.onopen = () => {
    // 如果是重连成功，向主窗口发送重连成功的消息
    if (retryCount > 0 && wsCheck()) {
      const mainWindow = getWindow('main')
      mainWindow.webContents.send('reconnect', true)
    }
    retryCount = 0
    console.log('websocket连接成功')
    startHeartBeat()
  }

  // 接收消息回调
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    console.log('收到ws消息', data)
    const meetingWindow = getWindow('meeting')
    const mainWindow = getWindow('main')
    switch (data.messageType) {
      case 8: // 自己同意别人好友申请
      case 12: // 别人回应自己的好友申请
        if (!mainWindow) {
          return
        }
        mainWindow.webContents.send('mainMessage', data)
        break
    }
  }

  // 错误处理回调
  ws.onerror = (error) => {
    console.error('websocket连接错误', error)
    ws.close()
  }

  // 连接关闭回调
  ws.onclose = (event) => {
    cleanHeartBeatTimer()
    handleReconnect()
    console.log(`连接关闭，code=${event.code} reason=${event.reason} wasClean= ${event.wasClean}`)
  }
}

/**
 * 开始心跳检测，定期发送ping消息维持连接
 */
const startHeartBeat = () => {
  heartBeatTimer = setInterval(() => {
    if (ws?.readyState == WebSocket.OPEN) {
      ws.send('ping')
    }
  }, HEARTBEAT_INTERVAL)
}

/**
 * 清除心跳定时器
 */
const cleanHeartBeatTimer = () => {
  clearInterval(heartBeatTimer)
  heartBeatTimer = null
}
/**
 * 处理WebSocket重连逻辑
 * 如果超过最大重试次数，则停止重连并执行登出操作
 * 否则递增重试次数并按指数退避策略延迟重连
 */
const handleReconnect = () => {
  if (!needReconnect) return
  if (retryCount >= MAX_RETRY_COUNT) {
    console.error('已经到达最大重连次数，停止重连')
    retryCount = 0
    if (wsCheck()) {
      logout(false)
    }
    return
  }
  retryCount++
  // 使用指数退避算法计算重连延迟时间
  const delay = retryDelay * Math.pow(1.5, retryCount - 1)
  console.log(`连接断开，等待${delay / 1000}秒后重试`)

  const mainWindow = getWindow('main')
  mainWindow.webContents.send('reconnect', false)
  setTimeout(() => {
    connectWs()
  }, delay)
}
/**
 * 执行登出操作，关闭所有窗口并清理连接
 * @param {boolean} isCloseWs - 是否关闭WebSocket连接，默认为true
 */
const logout = (isCloseWs = true) => {
  const login_width = 375
  const login_height = 365
  const mainWindow = getWindow('main')
  mainWindow.setResizable(true)
  mainWindow.setMinimumSize(login_width, login_height)
  mainWindow.setSize(login_width, login_height)
  mainWindow.setResizable(false)
  if (isCloseWs) {
    needReconnect = false
    ws.close()
  }
  const windows = getAllWindow()
  for (let winKey in windows) {
    if (winKey != 'main') windows[winKey].close()
  }

  mainWindow.webContents.send('logout')
}

/**
 * 发送数据到WebSocket服务器
 * @param {*} data - 要发送的数据
 */
const sendWsData = (data) => {
  if (!ws) {
    return
  }

  ws.send(data)
}
export { initWs, logout, sendWsData }
