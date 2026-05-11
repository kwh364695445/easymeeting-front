<!--
 * @Date: 2026-04-25 09:14:49
 * @LastEditTime: 2026-05-01 18:04:12
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\views\contact\ContactList.vue
 * @Description:
-->
<template>
  <div>
    <div class="search-panel">
      <el-input clearable placeholder="输入联系人搜索" v-model="keywords" :prefix-icon="Search" @keyup="search">
      </el-input>
      <div class="iconfont icon-invite" @click="applyContact"></div>
    </div>
    <div class="contact-list">
      <div class="contact-item" v-for="item in contactList" :key="item.contactId">
        <!-- <Avatar :userId="item.contactId"></Avatar> -->
        <div class="nick-name">{{ item.nickName }}</div>

        <el-dropdown>
          <div class="iconfont icon-more"></div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="delContact(item.contactId, 2)">删除</el-dropdown-item>
              <el-dropdown-item @click="delContact(item.contactId, 3)">拉黑</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <NoData v-if="contactList.length == 0" msg="暂无联系人"></NoData>
    </div>
  </div>
  <ApplyContact v-model='dialogShow' v-if="dialogShow" @reload="loadContactUser"></ApplyContact>
</template>

<script setup>
import ApplyContact from './ApplyContact.vue';
import { Search } from '@element-plus/icons-vue';
import { ref, inject, reactive, onMounted, onUnmounted } from 'vue';
import mitter from '@/eventBus';
const { Request, Api } = inject('utils');

const keywords = ref('');

const dialogShow = ref(false);
const applyContact = () => {
  dialogShow.value = true;
};
const search = () => {
  // TODO: 搜索
  console.log(keywords.value);
};

const sourceContactList = ref([]);
const contactList = ref([]);

async function loadContactUser() {
  const result = await Request({
    url: Api.loadContactUser,
  });
  if (!result) {
    return;
  }
  sourceContactList.value = result.data;
  contactList.value = result.data;
};
loadContactUser();

onMounted(() => {
  mitter.on("reloadContact", loadContactUser);
});

onUnmounted(() => {
  mitter.off("reloadContact", loadContactUser);
});
</script>

<style lang="scss" scoped>
.search-panel {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  gap: 10px;
}

.iconfont {
  background-color: #eeeeee;
  font-size: 20px;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #dddddd;
  }
}

.contact-list {
  height: calc(100vh - 100px);
  overflow: auto;

  .contact-item {
    padding-top: 5px;
    display: flex;
    align-items: center;

    .nick-name {
      flex: 1;
      width: 0;
      margin: 0px 5px;
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;

      .icon-more {
        cursor: pointer;
      }

      .el-tooltip_trigger:focus-visible {
        outline: unset;
      }
    }
  }
}
</style>
