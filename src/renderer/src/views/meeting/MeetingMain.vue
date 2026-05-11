<!--
 * @Date: 2026-04-17 14:32:16
 * @LastEditTime: 2026-04-19 16:20:31
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\views\meeting\MeetingMain.vue
 * @Description:
-->
<template>
  <Header :showBottomBorder="false"></Header>
  <div class="main-body">
    <div class="left-panel">
      <div class="quick-btns">
        <div :class="['btn', meetingStore.inMeeting ? 'btn-disable' : '']" @click="addMeeting(0)">
          <div class="iconfont icon-add"></div>
          <div class="name">加入会议</div>
        </div>
        <div :class="['btn', meetingStore.inMeeting ? 'btn-disable' : '']" @click="quickMeeting">
          <div class="iconfont icon-quick"></div>
          <div class="name">快速会议</div>
          <div class="btn-disable" v-if="meetingStore.inMeeting"></div>
        </div>
        <div class="btn" @click="reserveMeeting">
          <div class="iconfont icon-ok"></div>
          <div class="name">预定会议</div>
        </div>
        <div :class="['btn', meetingStore.inMeeting ? 'btn-disable' : '']" @click="addMeeting(1)">
          <div class="iconfont icon-share-screen"></div>
          <div class="name">共享屏幕</div>
        </div>
      </div>
    </div>
    <div class="right-panel">
      <Today></Today>
    </div>
  </div>
</template>

<script setup>
import { useMeetingStore } from '@/stores/MeetingStore';
import Today from './Today.vue';
const meetingStore = useMeetingStore();

const quickMeeting = () => {

}


</script>

<style lang="scss" scoped>
.main-body {
  display: flex;
  height: 100vh;

  .left-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid #ddd;
    flex: 2;

    .quick-btns {
      padding: 30px;
      text-align: center;
      // border: 1px solid #ddd;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;

      .btn {
        // border: 1px solid #e0e;
        -webkit-app-region: no-drag;
        cursor: pointer;
        // overflow: hidden;

        &:hover {
          opacity: 0.9;
        }

        .iconfont {
          display: inline-block;
          // border: 1px solid #e0e;
          width: 65px;
          height: 65px;
          align-content: center;
          border-radius: 10px;
          font-size: 35px;
          background: #0471ff;
          color: #fff;
          padding: 5px;
        }

        .name {
          font-size: 13px;
          margin-top: 10px;

        }
      }

      .btn-disable {
        opacity: 0.5;
        cursor: not-allowed;

        &:hover {
          opacity: 0.5;
        }
      }
    }

  }

  .right-panel {
    flex: 3;
    flex-direction: column;
    align-items: center;
    text-align: left;
  }
}
</style>
