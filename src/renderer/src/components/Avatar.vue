<!--
 * @Date: 2026-04-25 16:21:15
 * @LastEditTime: 2026-04-25 16:23:33
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\components\Avatar.vue
 * @Description:
-->
<template>
  <div :style="{ width: width + 'px', height: width + 'px' }" class="no-select">
    <Cover :lazy="false" :width="width" :source="avatarUrl" borderRadius="50%" :scale="1"></Cover>
  </div>
</template>

<script setup>
import { ref, reactive, inject, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";
const { Utils } = inject("utils");
const router = useRouter();
const route = useRoute();

const props = defineProps({
  width: {
    type: Number,
    default: 50
  },
  userId: {
    type: String,
  },
  update: {
    type: Boolean,
    default: false
  },
});

const avatarUrl = ref(Utils.getAvatarPath(props.userId, props.update));

const updateAvatarUrl = () => {
  avatarUrl.value = Utils.getAvatarPath(props.userId, true);
};

defineExpose({
  updateAvatarUrl
});
</script>

<style lang="scss" scoped></style>
