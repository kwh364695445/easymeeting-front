<!--
 * @Date: 2026-05-02 14:09:50
 * @LastEditTime: 2026-05-11 14:42:00
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\views\screenCapture\ScreenSelect.vue
 * @Description: 负责屏幕录制的选择
-->
<template>
  <div class="screen-source-list">
    <div :class="['source-item', screenDisplayId == item.displayId ? 'active' : '']" v-for="item in screenSources"
      :key="item.name" @click="selectSource(item)">
      <CoverTest :source="item.thumbnail" borderRadius="0px"></CoverTest>
      <div class="name">{{ item.name }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'


interface ScreenSource {
  id: string;
  name: string;
  thumbnail: string;  // 此时是 Base64 字符串
  displayId: string;  // 对应你主进程处理后的字段
}
const screenSources = ref<ScreenSource[]>([])
const screenDisplayId = ref('')

const selectSource = (item: ScreenSource) => {
  // screenDisplayId.value = item.displayId
  console.log(item.displayId)
  screenDisplayId.value = item.displayId
  emit("selectScreenDisplayId", screenDisplayId.value)
}

const emit = defineEmits(['selectScreenDisplayId'])
const getScreenSources = async () => {
  screenSources.value = await window.electron.ipcRenderer.invoke('getScreenSources', {
    // types: ['screen', 'window'],
    types: ['screen'],
    thumbnailSize: {
      // width: 600,
      // height: 360
      width: 320,
      height: 180
    }
  })
  screenDisplayId.value = screenSources.value[0].displayId
  emit("selectScreenDisplayId", screenDisplayId.value)
}

onMounted(() => {
  getScreenSources()
})


</script>

<style lang="scss" scoped>
.screen-source-list {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  flex-wrap: wrap;
  max-height: 400px;
  /* 设置固定高度 */
  overflow-y: auto;
  /* 垂直滚动 */
  overflow-x: hidden;
  /* 防止水平滚动 */
  padding: 5px;

  .source-item {
    overflow: hidden;
    border: 2px solid #ddd;
    border-radius: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    &:hover {
      border-color: var(--blue);
    }

    .name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
      margin-top: 2px;
      padding: 4px 0;
    }
  }

  .active {
    border-color: var(--blue);

    .name {
      color: var(--blue);
    }
  }
}
</style>
