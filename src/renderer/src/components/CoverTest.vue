<template>
  <div class="image-panel" :style="panelStyle">
    <el-image v-if="displaySrc" :lazy="lazy" :src="displaySrc" :fit="fit" preview-teleported
      :preview-src-list="imageListResult" :initial-index="initialIndex">
      <template #error>
        <img src="../assets/images/404.png" class="el-image__inner" :style="{ objectFit: fit }" />
      </template>
    </el-image>
    <div v-else class="no-image">请选择图片</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onUnmounted, type PropType, type CSSProperties } from 'vue'

const props = defineProps({
  source: { type: [String, Object] as PropType<string | File | null> },
  width: { type: Number, default: 100 },
  fit: { type: String as PropType<CSSProperties['objectFit']>, default: 'scale-down' },
  preview: { type: Boolean, default: false },
  borderRadius: { type: String, default: '5px' },
  lazy: { type: Boolean, default: true },
  scale: { type: Number },
  initialIndex: { type: Number, default: 0 },
  imageList: { type: Array as PropType<string[]>, default: () => [] }
});

const fileImageUrl = ref<string | null>(null)

// 1. 样式计算逻辑抽离，保持模板整洁
const panelStyle = computed(() => ({
  borderRadius: props.borderRadius,
  width: props.width ? `${props.width}px` : '100%',
  height: props.scale && props.width ? `${props.width * props.scale}px` : 'auto',
}))

// 2. 核心逻辑：监听 source 变化
watch(() => props.source, (newSource) => {
  // 释放旧的 URL 内存，防止内存泄漏
  if (fileImageUrl.value && fileImageUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(fileImageUrl.value)
  }

  if (newSource instanceof File) {
    // 优化点：使用 createObjectURL 代替 FileReader，性能更好且是同步的
    fileImageUrl.value = URL.createObjectURL(newSource)
  } else {
    fileImageUrl.value = null
  }
}, { immediate: true })

// 3. 统一输出源
const displaySrc = computed(() => {
  if (typeof props.source === 'string') return props.source
  return fileImageUrl.value
})

// 4. 预览列表逻辑
const imageListResult = computed(() => {
  if (!props.preview) return []
  // 如果没有传列表，则默认预览当前单图
  if (!props.imageList || props.imageList.length === 0) {
    return displaySrc.value ? [displaySrc.value] : []
  }
  return props.imageList
})

// 组件销毁前清理内存
onUnmounted(() => {
  if (fileImageUrl.value && fileImageUrl.value.startsWith('blob:')) {
    URL.revokeObjectURL(fileImageUrl.value)
  }
})
</script>
