<!--
 * @Date: 2026-05-02 11:24:48
 * @LastEditTime: 2026-05-11 14:27:27
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\views\screenCapture\ScreenCapture.vue
 * @Description: 进行屏幕录制，显示录制状态
-->

<template>
  <Header :showBottomBorder="true"></Header>
  <div class="body-main">
    <template v-if="recordStatus === 0">
      <div class="setting-panel">
        <div>录制设置</div>
        <div class="device-panel">
          <div class="device-title">音频输入</div>
          <!-- <MicIcon v-model="micInfo" ref="micInfoRef" @click="openOrClose"></MicIcon> -->
        </div>
        <div class="record-btn">
          <el-button class="btn" type="primary" size="large" @click="startRecord"
            :disabled="screenDisplayId == 0">开始录制</el-button>
        </div>
      </div>
      <div class="screen-panel">
        <div class="screen-select">选择录制屏幕</div>
        <ScreenSelect ref="screenSelectRef" @selectScreenDisplayId="handleSelectScreen"></ScreenSelect>
      </div>
    </template>
    <template v-else>
      <div class="recording-panel">
        <div v-if="recordStatus === 1" class="status-tips">开始录制中,请稍后...</div>
        <div v-if="recordStatus === 3" class="status-tips">停止录制中,请稍后...</div>
        <div v-if="recordStatus === 2" class="recording-time">
          录制中:&nbsp;&nbsp;{{ Utils.convertSecondsToHMS(recordTime, true) }}
        </div>

        <div class="record-panel" v-if="recordStatus === 2">
          <!-- <MicIcon v-model="micInfo" ref="micInfoRef"></MicIcon> -->
          <div :class="['iconfont icon-stop', recordTime < 3 ? 'stop-disable' : '']" @click="stopRecord">
            <el-button :disabled="recordTime < 3" class="btn" type="primary" size="large">停止录制</el-button>
          </div>
        </div>
        <div v-if="recordStatus === 4">
          <div class="file-panel">
            <div class="file-path" :title="filePath">{{ filePath }}</div>
            <div class="iconfont icon-folder" @click="openFile">打开文件</div>
          </div>
          <el-button type="primary" @click="restart">
            <span class="iconfont icon-narrow-left"></span>返回录制
          </el-button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import ScreenSelect from './ScreenSelect.vue'

const { Utils } = inject('utils')

const { ipcRenderer } = window.electron
// 0初始状态 1开始录制 2录制中 3停止录制中 4停止录制
const recordStatus = ref(0)
const startRecord = () => {
  console.log('屏幕id', screenDisplayId.value)
  recordStatus.value = 1
  ipcRenderer.send('startRecording', {
    displayId: screenDisplayId.value,
    mic: ''
  })
}

const stopRecord = () => {
  recordStatus.value = 3
  ipcRenderer.send('stopRecording')
}

let recordTime = ref(0)
let filePath = ref('')
const listenRecordTime = () => {
  ipcRenderer.on('recordTime', (event, time) => {
    recordTime.value = time
    if (time == 1) {
      recordStatus.value = 2
    }
  })
  ipcRenderer.on('finishRecording', (event, path) => {
    recordStatus.value = 4
    filePath.value = path
  })
}
onMounted(() => {
  listenRecordTime()
})
const screenDisplayId = ref(0)
const handleSelectScreen = (id: number) => {
  screenDisplayId.value = id
}

const openFile = () => {
  console.log('openFile', filePath.value)
  ipcRenderer.send('openLocalFile', { localFilePath: filePath.value })
}
const restart = () => {
  recordStatus.value = 0
  recordTime.value = 0
  screenDisplayId.value = 0
}

</script>

<style scoped>
/* .screen-capture-panel {

  display: flex;
  height: calc(100vh - 30px);

  .audio-panel {
    width: 45%;
    height: 100%;
    padding: 20px;
    border-right: 1px solid #eee;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .video-panel {
    padding: 20px;
    background: #f5f5f5;
    flex: 1;
  }
} */
.body-main {
  height: calc(100vh - 32px);
  display: flex;

  .setting-panel {
    width: 300px;
    padding: 20px;
    position: relative;

    .device-panel {
      margin-top: 5px;

      .device-title {
        font-size: 13px;
        margin: 5px 0;
      }
    }

    #preview {
      width: 200px;
      height: 150px;
      background: #000;
      margin: 10px 0;
    }

    .record-btn {
      position: absolute;
      left: 20px;
      right: 20px;
      bottom: 20px;

      .btn {
        width: 100%;
      }
    }
  }

  .screen-panel {
    flex: 1;
    background: #f3f3f4;
    padding: 20px;
  }

  .recording-panel {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .status-tips {
      margin-bottom: 20px;
    }

    .recording-time {
      font-size: 20px;
    }

    .record-panel {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;

      .icon-stop {
        display: flex;
        align-items: center;
        font-size: 13px;
        color: red;
        cursor: pointer;
        margin-left: 25px;

        &::before {
          font-size: 40px;
          margin-right: 4px;
        }
      }
    }



    .stop-disable {
      color: rgba(255, 0, 0, 0.5);
      pointer-events: none;
      cursor: not-allowed;
    }

    .file-panel {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 10px;

      .file-path {
        border: 1px solid #ddd;
        border-radius: 3px;
        padding: 3px 5px;
        width: 300px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }

      .icon-folder {
        cursor: pointer;
        margin-left: 10px;
        font-size: 14px;
        display: flex;
        align-items: center;
        color: #555555;

        &::before {
          font-size: 28px;
          color: var(--blue);
          margin-right: 2px;
        }
      }
    }
  }
}
</style>
