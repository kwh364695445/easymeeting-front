/*
 * @Date: 2026-05-09 18:13:22
 * @LastEditTime: 2026-05-11 09:35:46
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\main\recording.ts
 * @Description: 使用ffmpeg进行视频转码
 */
import fs from 'fs'
import path from 'path'
import { spawn } from 'child_process'
import { app, screen, type WebContents } from 'electron'
import { type ChildProcess } from 'child_process'

const { NODE_ENV } = process.env

const ffmpegPath = '/assets/ffmpeg.exe'

let ffmpegProcess: ChildProcess | null = null

const getResourcePath = () => {
  let resourcePath = app.getAppPath()
  if (NODE_ENV !== 'development') {
    resourcePath = path.join(path.dirname(app.getPath('exe')), 'resources')
  }
  return resourcePath
}

const getFFmpegPath = () => {
  return path.join(getResourcePath(), ffmpegPath)
}

// let sender: WebContents | null = null
let currentTime = 0
function getDisplayInfo(id: number) {
  const displays = screen.getAllDisplays()
  return displays.find((display) => display.id === id)
}
const startRecording = (sender: WebContents, displayId: number, mic: string) => {
  if (ffmpegProcess) {
    console.warn('录制已在进行中')
    return
  }
  // sender = _sender
  currentTime = 0
  const videoSaveDir = app.getPath('desktop') // todo: 用户指定的的视频保存路径，此处先设为固定值
  let tempPath = path.join(videoSaveDir, `${Date.now()}_temp.mp4`)
  const finalPath = tempPath.replace('_temp', '')
  // bounds: 表示整个屏幕范围,做全屏用。worksArea: 表示工作区域范围(扣除菜单栏等系统空间)，做最大化用
  const display = getDisplayInfo(displayId)
  if (!display) return
  const { bounds, workArea } = display
  console.log(bounds, workArea)
  // const ffmpeg = getFFmpegPath()

  let args = [
    //视频输入
    '-f',
    'gdigrab', //指定使用 Windows 的 GDI 接口进行抓屏。它是 Windows 上最通用的录屏方式。
    '-draw_mouse',
    '1', // 捕获录屏的时候的鼠标指针 1显示 0隐藏
    '-framerate',
    '30', // 设置视频捕获频率
    '-offset_x',
    `${workArea.x}`, // 录制区域的左上角起点坐标。
    '-offset_y',
    `${workArea.y}`,
    '-video_size', // 录制区域的宽高
    `${workArea.width}x${workArea.height}`, //只想录制排除任务栏后的区域
    '-i',
    'desktop' // 输入源为整个桌面(可替换为title-窗口标题，捕获特定窗口)
  ]

  if (mic) {
    //-f音频输入 指定DirectionShow音频设备(Windows 处理多媒体设备的标准接口)。-i指定输入的音频设备名称（即你传入的麦克风名称）
    args = args.concat(['-f', 'dshow', '-i', `audio=${mic}`])
  }

  const otherArgs = [
    '-c:v', // 使用最流行的 H.264 视频编码器
    'libx264',
    '-preset', // 编码预设。ultrafast 意味着 CPU 占用最低，压缩速度最快，非常适合实时录屏，防止掉帧。
    'ultrafast',
    '-crf', // 设置视频质量。值越小，视频质量越高，文件体积越大。
    '18',
    '-movflags',
    'faststart', // 正常退出时，会将索引移至文件头，方便秒开
    '-g', // 设置关键帧间隔。每 60 帧产生一个关键帧（对于 30fps 的视频，正好是 2 秒一个）
    '60', // 每2秒一个关键帧
    '-x264-params',
    'nal-hrd=cbr:force-cfr=1', //恒定帧率
    //音频编码
    '-c:a', //音频编码器
    'aac',
    '-b:a', //音频码率
    '192k',
    '-ar', //音频采样率
    '44100',
    '-ac',
    '2', //立体声
    // 像索格式
    '-pix_fmt',
    'yuv420p',
    '-flush_packets',
    '1',
    '-fflags',
    '+genpts',
    '-max_interleave_delta',
    '0', //减少交错延迟
    tempPath
  ]

  args = args.concat(otherArgs)
  ffmpegProcess = spawn(getFFmpegPath(), args, {
    detached: false,
    stdio: ['pipe', 'pipe', 'pipe']
  })
  function parseTime(timeStr: string): number {
    // 1. split 得到 ['HH', 'MM', 'SS.ms']
    // 2. map(s => parseInt(s, 10)) 会自动把 'SS.ms' 截断为 'SS'
    const [hours, minutes, seconds] = timeStr.split(':').map((s) => parseInt(s, 10))

    return hours * 3600 + minutes * 60 + seconds
  }
  ffmpegProcess.stderr!.on('data', (data: Buffer) => {
    const msg = data.toString() //默认data输出为buffer，转为string
    console.log(`stderr: ${msg}`)
    // FFmpeg 的状态行输出通常长这样： frame= 123 fps= 30 q=28.0 size= 1200kB time=00:00:05.67 bitrate= 178.9kbits/s speed=1.01x
    const timeMatch = msg.match(/time=(\d{2}:\d{2}:\d{2}(\.\d+)?)/)
    if (timeMatch && timeMatch[1]) {
      const seconds = parseTime(timeMatch[1])
      if (seconds > currentTime) {
        sender.send('recordTime', seconds)
        currentTime = seconds
      }
    }
  })
  ffmpegProcess.on('error', (err: Error) => {
    console.error('ffmpeg启动失败', err.message)
    ffmpegProcess = null
  })

  // 修复文件
  // const repairVideo = (filePath: string) => {
  //   const ffmpeg = getFFmpegPath()
  //   const args = ['-i', filePath, filePath.replace('_temp', '')]

  //   const process = spawn(ffmpeg, args, {
  //     stdio: ['pipe', 'pipe', 'pipe'], // 捕获stdout和stderr
  //     detached: true //创建独立进程
  //   })

  //   process.on('error', (err) => {
  //     console.log('ffmpeg 错误', err)
  //   })

  //   process.on('exit', (code) => {
  //     if (code === 0) {
  //       fs.unlinkSync(filePath)
  //       // 给渲染进程发送录制停止成功信号
  //       sender.send('finishRecording', filePath.replace('_temp', ''))
  //     }
  //   })
  // }

  ffmpegProcess.on('exit', (code) => {
    ffmpegProcess = null
    // repairVideo(filePath)
    console.log(`FFmpeg 退出，代码：${code}`)

    // 如果录制正常结束，将临时文件更名（或执行你的 repair 逻辑）
    if (fs.existsSync(tempPath)) {
      if (code === 0) {
        fs.renameSync(tempPath, finalPath)
        if (!sender.isDestroyed()) sender.send('finishRecording', finalPath)
      } else {
        // 如果是非正常退出，可以在这里调用 repairVideo
        console.error('检测到非正常退出，尝试修复文件...')
      }
    }
  })
}

// const stopRecording = () => {
//   if (ffmpegProcess) {
//     // 向 FFmpeg 发送 'q' 信号来优雅停止
//     ffmpegProcess.stdin!.write('q')

//     // 设置超时，如果优雅停止失败则强制终止
//     setTimeout(() => {
//       if (ffmpegProcess && !ffmpegProcess.killed) {
//         console.log('停止录制超时，强制终止进程')
//         ffmpegProcess.kill('SIGINT')
//       }
//     }, 5000) // 5秒超时
//   }
//   // if (ffmpegProcess) {
//   //   ffmpegProcess.kill('SIGINT')
//   // }
// }
const stopRecording = () => {
  if (ffmpegProcess) {
    // 2. 关键修改：发送 'q' 指令优雅停止
    // 这会让 FFmpeg 正常写入 MP4 头部信息，解决文件损坏问题
    ffmpegProcess.stdin?.write('q')

    // 安全保护：如果 3 秒内没退出，再强杀
    const timer = setTimeout(() => {
      if (ffmpegProcess) {
        ffmpegProcess.kill('SIGKILL')
        ffmpegProcess = null
      }
    }, 3000)

    ffmpegProcess.once('exit', () => clearTimeout(timer))
  }
}

export { startRecording, stopRecording }
