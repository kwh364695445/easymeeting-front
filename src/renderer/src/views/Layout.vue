<!--
 * @Date: 2026-04-17 14:34:59
 * @LastEditTime: 2026-05-02 12:33:58
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\views\Layout.vue
 * @Description:
-->
<template>
  <div class="layout">
    <div class="layout-left">
      <div class="top-penal">
        <div class="avatar"> </div>
        <div class="top-menu">
          <div :class="['menu-item', item.codes.includes(route.meta.code) ? 'active' : '']" v-for="item in leftTopMenus"
            @click="jumpMenu(item)">
            <el-badge :value="item.messageCount" :max="99" :hidden="item.messageCount == 0" :offset="[-5, 0]">
              <div :class="`iconfont icon-${item.icon}`"></div>
              <div class="name">{{ item.name }}</div>
            </el-badge>
          </div>
        </div>
      </div>
      <div class="bottom-penal">
        <template v-for="item in leftBottomMenus">
          <div :class="['menu-item', item.codes.includes(route.meta.code) ? 'active' : '']"
            v-if="!item.onlyAdmin || (item.onlyAdmin && userInfoStore.userInfo.admin)" @click="jumpMenu(item)">
            <div :class="`iconfont icon-${item.icon}`"></div>
          </div>
        </template>
      </div>
    </div>
    <div class="layout-right">

      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>

import { ref, watch, inject, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import mitter from "@/eventBus";

import { useUserInfoStore } from "@/stores/UserInfoStore.js";
import { useUserContactStore } from "@/stores/UserContactStore";

const userInfoStore = useUserInfoStore();
const userContactStore = useUserContactStore();

const { Request, Api, Alert } = inject('utils');

const router = useRouter();
const route = useRoute();

const leftTopMenus = ref([
  {
    name: '会议',
    icon: 'video',
    path: '/meetingMain',
    codes: [ 'meeting' ],
    messageCount: 0
  },
  {
    name: '通讯录',
    icon: 'contact',
    path: '/contact',
    codes: [ 'contact' ],
    messageCount: 0
  },
  {
    name: '录制',
    icon: 'record',
    path: '/screenCapture',
    codes: [ 'screenCapture' ],
    messageCount: 0
  }
]);

const leftBottomMenus = ref([
  {
    icon: 'settings',
    path: '/setting',
    codes: [ 'setting' ],
    onlyAdmin: false
  },
  {
    icon: 'admin',
    codes: [],
    btnType: 'admin',
    onlyAdmin: true
  },
]);

function jumpMenu(item) {
  if (item.btnType == 'admin') {
    // todo
    return;
  }
  router.push(item.path);
}
const listenMessage = () => {
  window.electron.ipcRenderer.on('mainMessage', (event, data) => {
    const { messageType, messageContent, sendUserNickName } = data;
    switch (messageType) {
      case 8: // 自己同意别人好友后刷新通讯录
        userContactStore.updateLastUpdate();
        break;
      case 12: // 别人回应自己好友申请
        let result = '';
        if (messageContent == 1) {
          mitter.emit("reloadContact");
          result = '已同意你的申请';
        }
        else if (messageContent == 2) {
          result = '已拒绝你的申请';
        }
        else if (messageContent == 3) {
          result = '已将你拉黑';
        }
        Alert(`${sendUserNickName}${result}`);
        break;
    }
  });

};
listenMessage();
const loadContactApplyCount = async () => {
  const result = await Request({
    url: Api.loadContactApplyDealWithCount,
  });
  if (!result) {
    return;
  }
  leftTopMenus.value[ 1 ].messageCount = result.data;
};

const unwatch = watch(() => userContactStore.lastUpdate, () => {
  loadContactApplyCount();
}, { immediate: true });

onUnmounted(() => {
  unwatch();
});
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  // height: 100vh;

  .layout-right {
    flex: 1;
    height: 100vh;
  }

  .layout-left {
    width: 64px;
    // border-right: 1px solid #ddd;
    background-color: #f3f3f4;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    -webkit-app-region: drag;

    .top-penal {
      text-align: center;

      .avatar {
        width: 50px;
        height: 50px;
        background-color: red;
        display: flex;
        justify-content: center;
        -webkit-app-region: no-drag;
        margin: 40px 0 20px 0;
      }
    }

    .menu-item {
      text-align: center;
      -webkit-app-region: no-drag;
      cursor: pointer;
      margin-bottom: 20px;
      color: #4c5262;

      .iconfont {
        font-size: 20px;
      }

      .name {
        margin-top: 5px;
        font-size: 12px;
      }

      &:hover {
        color: #353535;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }

    .active {
      .iconfont {
        color: var(--blue);
      }

      .name {
        color: var(--blue);
      }
    }

    .bottom-penal {
      margin-bottom: 30px;
    }
  }
}
</style>
