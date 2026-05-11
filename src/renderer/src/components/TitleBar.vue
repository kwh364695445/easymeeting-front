<!--
 * @Date: 2026-04-08 14:34:14
 * @LastEditTime: 2026-04-16 10:27:10
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\components\TitleBar.vue
 * @Description:
-->
<template>
  <div>
    <div class="op-btns"
      :style="{ top: `${styleTop}px`, right: `${styleRight}px`, 'border-radius': `${borderRadius}px` }">
      <div class="iconfont icon-min" :style="{ 'border-radius': `${borderRadius}` }" title="最小化" v-if="showMin"
        @click="minimize()"></div>
      <div :class="['iconfont', isMax ? 'icon-max' : 'icon-maximize']" :title="isMax ? '还原' : '最大化'"
        :style="{ 'border-radius': `${borderRadius}` }" v-if="showMax" @click="maximize()"></div>
      <div class="iconfont icon-close" :style="{ 'border-radius': `${borderRadius}` }" title="关闭" v-if="showClose"
        @click="close()"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";

const props = defineProps({
  showMin: {  // 最小化
    type: Boolean,
    default: true
  },
  showMax: {  // 最大化
    type: Boolean,
    default: true
  },
  showClose: {    // 关闭
    type: Boolean,
    default: true
  },
  closeType: {    // 关闭类型 0:关闭,1:隐藏
    type: Number,
    default: 1
  },
  styleTop: { // 距上边框位置
    type: Number,
    default: 0
  },
  styleRight: {   // 距右边框位置
    type: Number,
    default: 0
  },
  borderRadius: { // 圆角
    type: Number,
    default: 0
  },
  forceClose: {   // 强制关闭
    type: Boolean,
    default: true
  }
});

const isMax = ref(false);

const winOp = (action, data) => {
  window.electron.ipcRenderer.send('winTitleOp', { action, data });
};

const minimize = () => {
  winOp('minimize');
};
const maximize = () => {
  if(isMax.value){
    winOp('unmaximize')
  }else{
    winOp('maximize')
  }

};
onMounted(() => {
  isMax.value = false
  // 当窗口maximize和unmaximize时，从主进程传递过来窗口最大化的状态
  window.electron.ipcRenderer.on('winIsMax', (e, result) => {
    isMax.value = result
  })
})
// 根据closeType状态判断是关闭还是最小化到托盘
const close = () => {
  winOp('close', { closeType: props.closeType, forceClose: props.forceClose });
};
// 强制关闭
const custClose = () => {
  winOp('close', { closeType: props.closeType, forceClose: true });
};

defineExpose({ custClose });
</script>

<style lang="scss" scoped>
.op-btns {
  position: absolute;
  -webkit-app-region: no-drag;
  display: flex;
  // justify-content: flex-end;

  .iconfont {
    color: var(--text);
    padding: 6px;
    cursor: pointer;

    &:hover {
      background: #ddd;
    }
  }

  .close {
    border-top-right-radius: 10px !important;

    &:hover {
      background: #fa4e32;
      color: #fff;
    }
  }

  .win-top {
    color: var(--pink);
  }
}
</style>
