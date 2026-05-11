<template>
  <div class="today-penal">
    <div class="cur-date">{{ Utils.formatDate2(new Date().getTime(), 'M月DD日') }}</div>
    <div class="history">
      <div class="china-date-day">
        {{ Utils.getChinaDateDay() }}
      </div>
      <div class="btn">全部会议
        <span class="iconfont icon-narrow-right"></span>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, inject } from "vue";

const { Utils } = inject("utils");
</script>

<style lang="scss" scoped>
.today-penal {
  height: calc(30vh);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  .cur-date {
    font-size: 30px;
    font-weight: 600;
    color: #333;
  }

  .history {
    display: flex;
    justify-content: space-between;
  }
}
</style>
