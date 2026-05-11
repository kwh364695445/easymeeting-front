<!--
 * @Date: 2026-04-26 09:59:25
 * @LastEditTime: 2026-04-29 13:26:55
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\views\contact\ApplyContact.vue
 * @Description:
-->
<template>
  <Dialog v-model="dialogShow" v-bind="dialogConfig">
    <div class="search-panel">
      <el-input placeholder="请输入ID搜索" v-model="userId" clearable :prefix-icon="Search" :maxlength="12"></el-input>
      <el-button type="primary" class="btn-search" @click="search">搜索</el-button>
    </div>
    <div class="search-result">
      <div v-if="!userInfo">
        <el-empty description="用户不存在" :image-size="50" :style="{ padding: '10px' }">
          <template #description>
            <span style="font-size: 14px; color: #999;">用户不存在</span>
          </template>
        </el-empty>
      </div>
      <div class="user-info" v-else-if="Object.keys(userInfo).length > 0">
        <el-avatar :src="userInfo.avatar" :size="35"></el-avatar>
        <span class="nick-name">{{ userInfo.nickName }}</span>
        <div class="tips">
          <el-button v-if="userInfo?.status == null" type="primary" size="small" @click="addContact">添加联系人</el-button>
          <span v-else>{{ tipsOption[userInfo.status] }}</span>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup>
import { Search } from "@element-plus/icons-vue";
import { ref, reactive, inject } from "vue";
const { Request, Api, Message } = inject("utils");
const dialogShow = defineModel({ type: Boolean, default: false });

const dialogConfig = reactive({
  title: "添加联系人",
  width: "400px",
  showCancel: false,
});

const userId = ref("");
const userInfo = ref({});
const search = async () => {
  if (!userId.value) {
    return;
  }
  let result = await Request({
    url: Api.searchContact,
    params: {
      contactId: userId.value,
    },
  });
  if (!result) {
    return;
  }
  userInfo.value = result.data;
};
const tipsOption = {
  '-1': '自己',
  1: '已联系人',
  3: '你被对方拉黑',
  0: '已申请待处理'
};

const emit = defineEmits([ "reload" ]);
const addContact = async () => {
  let result = await Request({
    url: Api.contactApply,
    params: {
      receiveUserId: userInfo.value.userId,
    },
  });
  if (!result) {
    return;
  }
  if (result.data == 0) {
    Message.success("申请成功，等待对方接受申请");
  } else {
    Message.success("添加成功");
  }
  emit("reload");
  dialogShow.value = false;
};

</script>

<style lang="scss" scoped>
.search-panel {
  display: flex;
  gap: 10px;
  align-items: center;
}

.user-info {
  margin-top: 15px;
  display: flex;
  align-items: center;
  gap: 10px;

  .nick-name {
    font-size: 16px;
    flex: 1;
  }
}
</style>
