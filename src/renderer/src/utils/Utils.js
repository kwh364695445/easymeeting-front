/*
 * @Date: 2026-04-15 11:04:50
 * @LastEditTime: 2026-04-15 18:12:54
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\utils\Utils.js
 * @Description: 工具函数集合，包含日期格式化、文件大小转换、时间计算等功能
 */
import moment from 'moment'
import LunarCalendar from 'lunar-calendar'
import { Api } from '@/utils/Api'
import { debounce } from 'lodash-es'

moment.locale('zh-cn', {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:sS',
    L: 'YYYY-MM-DD',
    LL: 'YYYY年MM月DD日',
    LLL: 'YYYY年MM月DD日Ah点mm分',
    LLLL: 'YYYY年MM月DD日ddddAh点mm分',
    l: 'YYYY-M-D',
    ll: 'YYYY年M月D日',
    lll: 'YYYY年M月D日 HH:mm',
    llll: 'YYYY年M月D日dddd HH:mm'
  }
})

/**
 * 判断字符串是否为空
 * @param {string} str - 待检测字符串
 * @returns {boolean} - 是否为空
 */
const isEmpty = (str) => {
  if (str == null || str == '' || str == undefined) {
    return true
  }
  return false
}

/**
 * 根据时间戳格式化日期显示
 * @param {number} timestamp - 时间戳
 * @returns {string} - 格式化后的日期字符串
 */
const formatDate = (timestamp) => {
  const timestampTime = moment(timestamp)
  const days =
    Number.parseInt(moment().format('YYYYMMDD')) - Number.parseInt(timestampTime.format('YYYYMMDD'))
  if (days == 0) {
    return timestampTime.format('HH:mm')
  } else if (days == 1) {
    return '昨天'
  } else if (days >= 2 && days < 7) {
    //大于1天小于7天显示星期几
    return timestampTime.format('dddd')
  } else if (days >= 7) {
    //显示年月日
    return timestampTime.format('YYYY-MM-DD')
  }
}

/**
 * 根据指定格式格式化日期
 * @param {number} timestamp - 时间戳
 * @param {string} patten - 日期格式
 * @returns {string} - 格式化后的日期字符串
 */
const formatDate2 = (timestamp, patten) => {
  const timestampTime = moment(timestamp)
  return timestampTime.format(patten)
}

/**
 * 获取当前日期的中文显示（星期+农历）
 * @returns {string} - 星期及农历信息
 */
const getChinaDateDay = () => {
  const today = moment()
  //计算周几(中文)
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][today.day()]
  // 转换为农历日期(注意月份需+1，因moment月份从0开始)
  const lunar = LunarCalendar.solarToLunar(today.year(), today.month() + 1, today.date())
  //-处理闰月显示
  const isLeap = lunar.isleap ? '闰' : ''
  const lunarDate = `${isLeap}${lunar.lunarMonthName}${lunar.lunarDayName}`

  return `星期${weekday}   农历${lunarDate}`
}

/**
 * 获取指定时间戳的星期和日期
 * @param {number} timestamp - 时间戳
 * @returns {string} - 星期和日期的组合字符串
 */
const getWeekAndDate = (timestamp) => {
  const today = moment(new Date(timestamp))
  // 计算周几(中文)
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][today.day()]
  return `星期${weekday} ${today.format('M月DD日')}`
}

/**
 * 将字节大小转换为可读的单位表示
 * @param {number} limit - 字节数
 * @returns {string} - 带单位的大小字符串
 */
const size2Str = (limit) => {
  let size = ''
  if (limit < 0.1 * 1024)
    //个于0.1KB，则转化成B
    size = limit.toFixed(2) + 'B'
  else if (limit < 1024 * 1024) {
    //小于0.1MB，则转化成KB
    size = (limit / 1024).toFixed(2) + 'KB'
  } else if (limit < 1024 * 1024 * 1024) {
    //小于1GB，则转化成MB
    size = (limit / (1024 * 1024)).toFixed(2) + 'MB'
  } else {
    //其他转化成GB
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }
  const sizeStr = size + ''
  //转成字符串
  const index = sizeStr.indexOf('.')
  //获取小数点处的索引
  const dou = sizeStr.substring(index + 1, 2)
  //获取小数点后两位的值
  if (dou == '00') {
    //判断后两位是否为00，如果是则删除00
    return sizeStr.substring(0, index) + sizeStr.substring(index + 3, 2)
  }
  return sizeStr
}

/**
 * 将秒数转换为时分秒格式
 * @param {number} seconds - 秒数
 * @param {boolean} showHours - 是否显示小时部分
 * @returns {string} - 格式化的时分秒字符串
 */
const convertSecondsToHMS = (seconds, showHours = false) => {
  let hours = Math.floor(seconds / 3600)
  let minutes = Math.floor((seconds % 3600) / 60)
  let remainingSeconds = seconds % 60
  let hourStr = showHours ? '00' : ''
  return (
    (hours == 0 ? hourStr : hours.toString().padStart(2, '0')) +
    ':' +
    minutes.toString().padStart(2, '0') +
    ':' +
    remainingSeconds.toString().padStart(2, '0')
  )
}

/**
 * 给指定时间增加分钟数并返回格式化时间
 * @param {number} timestamp - 时间戳
 * @param {number} addMin - 要增加的分钟数
 * @returns {string} - 格式化的时间字符串
 */
const timeAddMin = (timestamp, addMin) => {
  return moment(timestamp).add(addMin, 'minutes').format('HH:mm')
}

/**
 * 获取文件名（不含扩展名）
 * @param {string} fileName - 完整文件名
 * @returns {string} - 不含扩展名的文件名
 */
const getFileName = (fileName) => {
  if (!fileName) {
    return fileName
  }
  return fileName.lastIndexOf('.') == -1 ? fileName : fileName.slice(0, fileName.lastIndexOf('.'))
}

/**
 * 获取本地资源路径
 * @param {string} resource - 资源名称
 * @returns {string} - 完整的资源URL
 */
const getLocalResource = (resource) => {
  resource = `../assets/${resource}`
  return new URL(resource, import.meta.url).href
}

/**
 * 重置HTML内容（替换换行符为<br/>标签）
 * @param {string} data - 原始数据
 * @returns {string} - 处理后的HTML内容
 */
const resetHtmlContent = (data) => {
  if (!data) {
    return data
  }

  data = data.replace(/\r\n/g, '<br/>')
  data = data.replace(/\n/g, '<br/>')
  return data
}

/**
 * 获取用户令牌
 * @returns {string} - 用户令牌
 */
const getToken = () => {
  let userInfoJson = localStorage.getItem('userInfo')
  const token = userInfoJson ? JSON.parse(userInfoJson).token : ''
  return token
}

/**
 * 获取资源路径
 * @param {Object} options - 参数对象
 * @param {string} options.messageId - 消息ID
 * @param {boolean} options.thumbnail - 是否为缩略图
 * @param {string} options.fileType - 文件类型
 * @param {string} options.sendTime - 发送时间
 * @returns {string} - 完整的资源URL
 */
const getResourcePath = ({ messageId, thumbnail = false, fileType, sendTime }) => {
  return `${import.meta.env.PROD ? import.meta.env.VITE_DOMAIN : ''}${Api.getResource}?messageId=${messageId}&fileType=${fileType}&sendTime=${sendTime}&token=${getToken()}&thumbnail=${thumbnail}`
}

/**
 * 获取头像路径
 * @param {string} userId - 用户ID
 * @param {boolean} forceUpdate - 是否强制更新
 * @returns {string} - 完整的头像URL
 */
const getAvatarPath = (userId, forceUpdate = false) => {
  return `${import.meta.env.PROD ? import.meta.env.VITE_DOMAIN : ''}${Api.getAvatar}?userId=${userId}&token=${getToken()}${forceUpdate ? '&' + new Date().getTime() : ''}`
}

/**
 * 格式化会议号（添加空格分隔）
 * @param {string} meetingNo - 原始会议号
 * @returns {string} - 格式化后的会议号
 */
const formatMeetingNo = (meetingNo) => {
  return meetingNo.slice(0, 3) + ' ' + meetingNo.slice(3, 6) + ' ' + meetingNo.slice(6, 10)
}

/**
 * 根据性别获取图标类名
 * @param {number} sex - 性别（0女，1男，其他未知）
 * @returns {string} - 图标类名
 */
const getSexIcon = (sex) => {
  if (sex == 0) {
    return 'icon-woman'
  } else if (sex == 1) {
    return 'icon-man'
  } else {
    return 'icon-user-nick'
  }
}



export default {
  isEmpty,
  formatDate,
  formatDate2,
  getChinaDateDay,
  getWeekAndDate,
  size2Str,
  convertSecondsToHMS,
  timeAddMin,
  getFileName,
  getLocalResource,
  resetHtmlContent,
  getToken,
  getResourcePath,
  getAvatarPath,
  formatMeetingNo,
  getSexIcon,
}
