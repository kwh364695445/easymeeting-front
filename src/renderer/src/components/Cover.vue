<!--
 * @Date: 2026-05-02 15:42:23
 * @LastEditTime: 2026-05-02 16:23:27
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\components\Cover.vue
 * @Description:
-->
<template>
  <div class="image-panel" ref="coverRef" :style="{
    'border-radius': borderRadius,
    width: width ? width + 'px' : '100%',
    height: scale ? width * scale + 'px' : 'auto',
  }">
    <el-image :lazy="lazy" :src="fileSource || fileImage" :fit="fit" v-if="fileSource || fileImage" preview-teleported
      :preview-src-list="imageListResult" :initial-index="initialIndex">
      <template #error>
        <img src="../assets/images/404.png" class="el-image__inner" :style="{ 'object-fit': fit }" />
      </template>
    </el-image>
    <div v-else class="no-image">请选择图片</div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick, computed } from "vue";
const { proxy } = getCurrentInstance();
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const props = defineProps({
  source: {   // 缩略图地址|文件
    type: [ String, File ]
  },
  width: {
    type: Number,
  },
  fit: {      // 控制图片如何适应容器
    type: String,
    default: 'scale-down',
  },
  preview: {  // 是否展示预览
    type: Boolean,
    default: false
  },
  borderRadius: {
    type: String,
    default: '5px'
  },
  lazy: {     // 图片懒加载
    type: Boolean,
    default: true
  },
  scale: {    // 图片比例
    type: Number
  },
  initialIndex: { // 多张图片展示第几张
    type: Number,
    default: 0
  },
  imageList: {    // 图片列表
    type: Array
  }
});

const fileImage = ref();
const fileSource = computed(() => {
  if (!props.source) {
    fileImage.value = null;
    return;
  }
  if (props.source instanceof File) {
    let img = new FileReader();
    img.readAsDataURL(props.source);
    img.onload = ({ target }) => {
      fileImage.value = target.result;
    };
    return;
  }
  if (typeof props.source === 'string') {
    return props.source;
  }
});

const imageListResult = computed(() => {
  if (!props.preview) {
    return [];
  }
  if (props.imageList) {
    // TODO 聊天图片预览
    const result = props.imageList.map((item) => {

    });
    return [];
  }
})

</script>

<style lang="scss" scoped>
.image-panel {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: #f8f8f8;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;

  :deep(.eL-image) {
    width: 100%;
    height: 100%;
  }

  :deep(.is-loading) {
    display: none;
  }

  :deep(.el-image__wrapper) {
    position: relative;
    vertical-align: top;
    width: 100%;
    height: 100%;
    display: flex;
  }

  .icon-image-error {
    margin: opx auto;
    font-size: 20px;
    color:
      #838383;
    height: 100%;
  }

  .loading {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 20px;
    }
  }

  .no-image {
    text-align: center;
    color: #9f9f9f;
  }
}
</style>
