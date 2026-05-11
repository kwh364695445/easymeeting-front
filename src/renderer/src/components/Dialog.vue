<!--
 * @Date: 2026-04-25 18:05:23
 * @LastEditTime: 2026-04-29 13:40:06
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\components\Dialog.vue
 * @Description:
-->
<template>
  <el-dialog class="customer-dialog" v-model="dialogShow" :title :draggable :show-close="showClose" :width="dialogWidth"
    :top="dialogTop" :close-on-click-modal="false" @open="handleOpen" @close="handleClose">
    <!-- 自定义头部 -->
    <template #header="{ close, titleId, titleClass }">
      <div class="dialog-header">
        <h4 v-if="title" :id="titleId" :class="['title', titleClass]">{{ title }}</h4>
        <slot v-else name="header" v-bind="{ close, titleId, titleClass }"></slot>
      </div>
    </template>
    <div class="dialog-body" :style="{ 'max-height': maxHeight, padding: dialogPadding }">
      <slot></slot>
    </div>
    <template #footer v-if="buttons?.length > 0 || showCancel">
      <div class="dialog-footer">
        <el-button link @click="handleCancel" v-if="showCancel">取消</el-button>
        <el-button v-for="btn in buttons" :key="btn.text" :type="btn.type || 'primary'" @click="btn.click">
          {{ btn.text }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  title: {
    type: String,
  },
  draggable: {
    type: Boolean,
    default: false
  },
  showClose: {
    type: Boolean,
    default: true
  },
  width: {
    type: [ String, Number ],
    default: '30%'
  },
  top: {
    type: [ String, Number ],
    default: 50
  },
  padding: {
    type: [ String, Number ],
    default: 15
  },
  buttons: {
    type: Array,
    default: () => []
  },
  showCancel: {
    type: Boolean,
    default: true
  }
});
const dialogShow = defineModel({ type: Boolean, default: false });

// 格式化单位
const formatUnit = (value) => {
  return typeof value === 'number' ? `${value}px` : value;
};
const dialogWidth = computed(() => {
  return formatUnit(props.width);
});
const dialogTop = computed(() => {
  return formatUnit(props.top);
});
const dialogPadding = computed(() => {
  return formatUnit(props.padding);
});

// 使用 vh 单位，让高度能随窗口缩放自动调节
const maxHeight = computed(() => {
  const btnHeight = (props.buttons?.length || props.showCancel) ? '90px' : '50px';
  // 逻辑：视口高度 - 顶边距 - (页头+页脚预留位)
  return `calc(100vh - ${formatUnit(props.top)} - ${btnHeight})`;
});
// const maxHeight = computed(() => {
//   return window.innerHeight - props.top - (props.buttons?.length ? 90 : 50);
// });

const emit = defineEmits([ 'close', 'open' ]);
const handleCancel = () => {
  dialogShow.value = false; // 真正关闭弹窗
};
const handleClose = () => {
  emit('close');
};
const handleOpen = () => {
  emit('open');
};
</script>

<style lang="scss" scoped>
.customer-dialog {
  padding: 0 !important;
  margin-bottom: 5px !important;
  -webkit-app-region: no-drag;

  :deep(.el-dialog__header) {
    padding: 5px 0 5px 10px;
    border-bottom: 1px solid #ddd;
    -webkit-app-region: no-drag;
  }

  :deep(.el-dialog__body),
  :deep(.el-dialog__footer) {
    padding: 0;
  }

  :deep(.title) {
    font-size: 20px;
  }

  .dialog-body {
    min-height: 80px;
    overflow: auto;
    overflow-x: hidden;
  }

  .dialog-footer {
    border-top: 1px solid #ddd;
    text-align: right;
    padding: 5px 20px;
  }
}
</style>
