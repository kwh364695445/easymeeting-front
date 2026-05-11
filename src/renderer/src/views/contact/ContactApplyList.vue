<!--
 * @Date: 2026-04-25 09:15:41
 * @LastEditTime: 2026-05-01 22:34:58
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\views\contact\ContactApplyList.vue
 * @Description:
-->
<template>
  <div class="contact-apply-list">
    <div class="apply-item" v-for="item in contactApplyList">
      <el-avatar :src="item.applyUserId" :size="35"></el-avatar>
      <span class="user-nick">{{ item.nickName }}</span>
      <NoData v-if="contactApplyList.length == 0" msg="暂无联系人申请"></NoData>
      <span v-else-if="item.status != 0">{{ item.statusName }}</span>
      <el-dropdown v-if="item.status == 0">
        <el-button type="primary" size="small">接受</el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="dealWithApply(item.applyUserId, 1)">同意</el-dropdown-item>
            <el-dropdown-item @click="dealWithApply(item.applyUserId, 2)">拒绝</el-dropdown-item>
            <el-dropdown-item @click="dealWithApply(item.applyUserId, 3)">拉黑</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, inject, onUnmounted } from 'vue';
import { useUserContactStore } from "@/stores/UserContactStore";
import mitter from '@/eventBus';
const { Request, Api } = inject('utils');

const contactApplyList = ref([]);
const userContactStore = useUserContactStore();

const getContactApplyList = async () => {
  const result = await Request(
    {
      url: Api.loadContactApply,
    }
  );
  if (!result) {
    return;
  }
  contactApplyList.value = result.data;
};
getContactApplyList();


const dealWithApply = async (applyUserId, status) => {
  const result = await Request(
    {
      url: Api.dealWithApply,
      mode: 'POST',
      params: {
        applyUserId,
        status,
      },
    }
  );
  if (!result) {
    return;
  }
  userContactStore.updateLastUpdate();
  mitter.emit("reloadContact");
};

const stopWatch = watch(
  () => userContactStore.lastUpdate,
  (newVal) => {
    // debugger;
    if (!newVal) {
      return;
    }
    getContactApplyList();
  },
  { immediate: true, deep: true }
);
onUnmounted(() => {
  stopWatch();
});

</script>

<style lang="scss" scoped>
.contact-apply-list {
  .apply-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;

    .user-nick {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      font-size: 14px;
    }
  }
}
</style>
