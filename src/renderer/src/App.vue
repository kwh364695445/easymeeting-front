<!--
 * @Date: 2026-04-03 10:30:13
 * @LastEditTime: 2026-04-03 20:48:28
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\App.vue
 * @Description:
-->
<template>
  <el-config-provider :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<script setup>
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
</script>

<style lang="scss" scoped></style>
d
