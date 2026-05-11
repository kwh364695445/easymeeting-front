<!--
 * @Date: 2026-04-08 11:17:30
 * @LastEditTime: 2026-04-25 17:41:06
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\components\Header.vue
 * @Description:顶部通用组件，方便拖动窗口
-->
<template>
  <div class="header" :style="{ 'border-bottom': showButtonBorder ? '1px solid #ddd' : '' }">
    <div class="title" v-if="title">{{ title }}</div>
    <TitleBar :showMax :closeType></TitleBar>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TitleBar from "./TitleBar.vue";
const props = defineProps({
  title: {
    type: String,
    default: ""
  },
  showMax: {
    type: Boolean,
    default: false
  },
  showButtonBorder: {
    type: Boolean,
    default: false
  },
  closeType: {
    type: Number,
    default: 1 // 0:关闭,1:隐藏
  }
});


</script>

<style lang="scss" scoped>
.header {
  height: 30px;
  -webkit-app-region: drag;
  text-align: center;
  padding-top: 5px;
  overflow: hidden;
  border-radius: 5px;
}
</style>
