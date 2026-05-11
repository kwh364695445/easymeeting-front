<!--
 * @Date: 2026-04-03 21:12:00
 * @LastEditTime: 2026-04-27 13:23:23
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\views\login\Login.vue
 * @Description: 登录页面
-->
<template>
  <Header :closeType="0"></Header>
  <div class="loading-panel" v-if="showLoading">
    <img src="@/assets/images/loading.gif" alt="">
    <div>正在登录...</div>
  </div>
  <div class="login-form" v-else>
    <div class="error-msg">{{ errorMsg }}</div>
    <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="0px" @keyup.enter="submit">
      <!--input输入-->
      <el-form-item prop="email">
        <el-input clearable placeholder="请输入邮箱" v-model.trim="formData.email" size="large" autocomplete="off">
          <template #prefix>
            <span class="iconfont icon-email"></span>
          </template>
        </el-input>
      </el-form-item>

      <!--昵称-->
      <el-form-item prop="nickName" v-if="!isLogin">
        <el-input clearable placeholder="请输入昵称" maxLength="15" v-model.trim="formData.nickName" size="large">
          <template #prefix>
            <span class="iconfont icon-user-nick"></span>
          </template>
        </el-input>
      </el-form-item>
      <!--密码-->
      <el-form-item prop="password">
        <el-input clearable placeholder="请输入密码" type='password' maxLength="18" show-password
          v-model.trim="formData.password" size="large">
          <template #prefix>
            <span class="iconfont icon-password"></span>
          </template>
        </el-input>
      </el-form-item>
      <!--再次输入密码-->
      <el-form-item prop="rePassword" v-if="!isLogin">
        <el-input clearable placeholder="请再次输入密码" type='password' maxLength="18" show-password
          v-model.trim="formData.rePassword" size="large">
          <template #prefix>
            <span class="iconfont icon-password"></span>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="checkCode">
        <div class="check-code-panel">
          <el-input clearable placeholder="请输入验证码" v-model.trim="formData.checkCode" size="large" autofocus>
            <template #prefix>
              <span class="iconfont icon-checkcode"></span>
            </template>
          </el-input>
          <img :src="checkCodeUrl" class="check-code" @click="debouncedChangeCheckCode">
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" size="large" @click="submit">{{ isLogin ? '登录' : '注册'
          }}</el-button>
      </el-form-item>
      <div class="bottom-link">
        <span class="a-link no-account" @click="changeOpType()">{{ isLogin ? '没有账号?' : '已有账号' }}</span>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { debounce } from "lodash-es";
import { md5 } from "js-md5";
import { useRouter } from "vue-router";

import { ref, reactive, getCurrentInstance, computed, inject, nextTick } from "vue";
import { useUserInfoStore } from "@/stores/UserInfoStore.js";
// const { proxy } = getCurrentInstance();
const { Api, Request, Utils, Verify, Message } = inject('utils');

const userInfo = useUserInfoStore();

const formData = ref({ email: 'test7@qq.com', password: 'test7@qq.com' });
const rules = reactive({});
const formDataRef = ref();
const isLogin = ref(true);
const checkCodeUrl = ref(null);
const showLoading = ref(false);
const errorMsg = ref("");

const router = useRouter();

// 根据文本长度动态计算字体大小
const dynamicFontSize = computed(() => {
  const textLength = errorMsg.value?.length;
  if (textLength <= 20) return '14px';
  if (textLength <= 50) return '10px';
  if (textLength <= 100) return '9px';
  return '8px';
});
// 清空提示信息
const cleanVerify = () => {
  errorMsg.value = null;
};
// 获取验证码
const changeCheckCode = async () => {
  let result = await Request({
    url: Api.checkCode,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  checkCodeUrl.value = result.data.checkCodeBase64;
  localStorage.setItem("checkCodeKey", result.data.checkCodeKey);
};
changeCheckCode();

// 在script部分创建防抖版本的changeCheckCode函数
const debouncedChangeCheckCode = debounce(changeCheckCode, 500);

const checkValue = (type, value, msg) => {
  if (Utils.isEmpty(value)) {
    errorMsg.value = '内容不能为空';
    return false;
  }
  if (type && !Verify[ type ](value)) {
    errorMsg.value = msg;
    return false;
  }
  return true;
};

// 提交表单
const submit = async () => {
  cleanVerify();
  if (!checkValue("checkEmail", formData.value.email, "请输入正确邮箱")) return;
  if (!isLogin.value && !checkValue(null, formData.value.nickName, '请输入昵称')) return;
  if (!checkValue("checkPassword", formData.value.password, "密码至少包含一个数字和一个字母，长度8-18位，允许特殊字符")) return;
  if (!isLogin.value && formData.value.password !== formData.value.rePassword) {
    errorMsg.value = '两次输入的密码不一致';
    return;
  }
  if (!checkValue(null, formData.value.checkCode, '请输入验证码')) return;

  if (isLogin.value) {
    showLoading.value = true;
  }

  // 都验证成功后，发送请求
  const result = await Request({
    url: isLogin.value ? Api.login : Api.register,
    params: {
      email: formData.value.email,
      nickName: formData.value.nickName,
      password: md5(formData.value.password),
      checkCode: formData.value.checkCode,
      checkCodeKey: localStorage.getItem("checkCodeKey"),
    },
    showError: false,
    showLoading: false,
    errorCallback: (res) => {
      changeCheckCode();
      errorMsg.value = res.msg;
      showLoading.value = false;
    }
  }
  );
  if (!result) return;
  // 登录成功
  if (isLogin.value) {
    Message.success('登录成功');
    await window.electron.ipcRenderer.invoke('loginSuccess', {
      userInfo: result.data,
      wsUrl: import.meta.env.VITE_WS,
    });

    userInfo.setUserInfo(result.data);
    router.push('/home');
  } else {
    // 注册成功
    Message.success('注册成功');
    changeOpType();
  }
};

// 切换登录和注册
const changeOpType = async () => {
  window.electron.ipcRenderer.send('loginOrRegister', !isLogin.value);
  isLogin.value = !isLogin.value;

  await nextTick();
  // 清空输入框和提示信息、更新验证码
  formDataRef.value.resetFields();
  formData.value = {};
  cleanVerify();
  changeCheckCode();
};
</script>

<style lang="scss" scoped>
.email-select {
  width: 320px;
}

.icon-close {
  float: right;
  cursor: pointer;
  margin-right: 5px;
  font-size: 12px;
}

.loading-panel {
  height: calc(100vh - 32px);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  font-size: 14px;
  color: #727272;

  img {
    width: 30px;
    margin-right: 3px;
  }
}

.login-form {
  padding: 5px 15px 13px;
  height: calc(100vh - 32px);

  :deep(.el-input__wrapper) {
    box-shadow: none;
    border-radius: none;
  }

  .el-form-item {
    // border-bottom: 1px solid #ddd;
    border-bottom: 1px solid #0dd;
  }

  .email-panel {
    align-items: center;
    width: 100%;
    display: flex;
    flex: 1;

    .input {
      flex: 1;
    }

    .icon-narrow-down {
      margin-right: 14px;
      width: 16px;
      cursor: pointer;
      border: none;
    }
  }

  .error-msg {
    // line-height: 0m;
    min-height: 20px;
    font-size: v-bind(dynamicFontSize);
    color: #fb7373;
    // white-space: nowrap;
    /* 2. 强制不换行 */
    overflow: hidden;
    /* 3. 隐藏超出部分 */
    text-overflow: ellipsis;
    /* 4. 超出部分显示为 ... */
  }

  .check-code-panel {
    display: flex;

    .check-code {
      cursor: pointer;
      width: 120px;
      margin-left: 5px;
    }
  }

  .login-btn {
    margin-top: 20px;
    width: 100%;
  }

  .bottom-link {
    text-align: right;
    font-size: 13px;

    .remember-password {
      float: left;
      margin-top: -7px;

      :deep(.el-checkbox__label) {
        color: #494949;
      }
    }
  }

}
</style>
