<!--
 * @Date: 2026-04-25 09:08:51
 * @LastEditTime: 2026-04-25 15:59:15
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\views\contact\Contact.vue
 * @Description:
-->
<template>
  <Header :showButtonBorder="true"></Header>
  <div class="body-panel">
    <div class="contact-user-panel">
      <div class="contact-user">
        <div class="part-title">我的联系人</div>
        <ContactList></ContactList>
      </div>
      <div class="contact-apply">
        <div class="part-title">联系人申请</div>
        <ContactApplyList></ContactApplyList>
      </div>
    </div>
  </div>
</template>

<script setup>
import ContactList from './ContactList.vue';
import ContactApplyList from './ContactApplyList.vue'

</script>

<style lang="scss" scoped>
.body-panel {
  height: calc(100vh - 30px);
}

.contact-user-panel {
  height: 100%;
  display: flex;

  .contact-user {
    border-right: 1px solid #e5e5e5;
    flex: 1;
    padding: 0 15px;
  }

  .contact-apply {
    flex: 1;
  }
}
</style>
