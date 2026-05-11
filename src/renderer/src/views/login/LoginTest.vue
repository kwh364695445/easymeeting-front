<!--
 * @Date: 2026-04-16 14:50:42
 * @LastEditTime: 2026-04-17 13:54:34
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\views\login\LoginTest.vue
 * @Description:
-->
<template>
  <div class="login">
    <Header></Header>
    <!-- <div class="error-msg"></div> -->
    <div class="loading-panel" v-if="showLoading">
      <img src="@/assets/images/loading.gif" alt="">
      <div>正在登录...</div>
    </div>
    <div class="form-box">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :validate-on-rule-change="false">
        <el-form-item prop="email">
          <el-input v-model="ruleForm.email" placeholder="请输入邮箱" type="email" clearable autocomplete="off" size="large">
            <template #prefix>
              <span class="iconfont icon-email"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="nickName" v-if="!isLogin">
          <el-input v-model="ruleForm.nickName" placeholder="请输入昵称" type="text" clearable autocomplete="off"
            size="large">
            <template #prefix>
              <span class="iconfont icon-user-nick"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="ruleForm.password" placeholder="请输入密码" type="password" clearable show-password
            size="large">
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="rePassword" v-if="!isLogin">
          <el-input v-model="ruleForm.rePassword" placeholder="请输入确认密码" type="password" show-password size="large">
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkCode" class="check-code" size="large">
          <el-input v-model="ruleForm.checkCode" placeholder="请输入验证码" type="text" clearable size="large">
            <template #prefix>
              <span class="iconfont icon-checkcode"></span>
            </template>
            <template #suffix>
              <span class="check-code-img">
                <img :src="checkCodeUrl" @click="getCheckCode" alt="">
              </span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-button" type="primary" @click="submitForm(ruleFormRef)">
            登录
          </el-button>
          <!-- <el-button @click="resetForm(ruleFormRef)">Reset</el-button> -->
        </el-form-item>
        <div class="login-register-link">
          <span class="switch-link" @click="switchWindow"> {{ isLogin ? "没有账号?" : '已有账号' }} </span>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, inject, nextTick } from 'vue';

const { Api, Request, Utils, Verify, Message } = inject('utils');


const ruleFormRef = ref();
const isLogin = ref(true);
const showLoading = ref(false);
const ruleForm = reactive({
  email: '',
  nickName: '',
  password: '',
  rePassword: '',
  checkCode: '',
});

const rules = computed(() => {
  const baseRules = {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { type: 'email', message: '请输入正确的邮箱地址', trigger: [ 'blur', 'change' ] }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      // { min: 6, max: 18, message: '长度在 6 到 18 个字符', trigger: 'blur' },
      { validator: checkValue, checkType: 'checkPassword', trigger: 'blur' }
    ],
    checkCode: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
    ]
  };
  if (isLogin.value) return baseRules;
  return {
    ...baseRules,
    nickName: [
      { required: true, message: '请输入昵称', trigger: 'blur' },
      { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
    ],
    rePassword: [
      { required: true, message: '请输入确认密码', trigger: 'blur' },
      { validator: checkRePassword, trigger: 'blur' }
    ],
  };
});

const checkValue = (rule, value, callback) => {
  const result = Verify[ rule.checkType ](value);
  if (!result) {
    return callback(new Error('至少包含一个数字和一个字母，长度8-18位，允许特殊字符'));
  }
  callback();
};

const checkRePassword = (rule, value, callback) => {
  if (value !== ruleForm.password) {
    callback(new Error('两次密码不一致'));
  } else {
    callback();
  }
};

// 切换窗口大小
const switchWindow = () => {
  isLogin.value = !isLogin.value;
  window.electron.ipcRenderer.send("loginOrRegister", isLogin.value);
  getCheckCode();
  nextTick(() => {
    resetForm(ruleFormRef.value);
  });
};
const checkCodeUrl = ref('');

// 获取验证码
const getCheckCode = async () => {
  const result = await Request({
    url: Api.checkCode,
    showLoading: false
  });
  if (!result) return;
  checkCodeUrl.value = result.data.checkCodeBase64;
  localStorage.setItem("checkCodeKey", result.data.checkCodeKey);
};
getCheckCode();


const submitForm = async (formEl) => {
  if (!formEl) return;
  formEl.validate((valid) => {
    if (valid) {
      const response = Request({
        url: isLogin.value ? Api.login : Api.register
      });
    } else {
      console.log('error submit!');
    }
  });
};

const resetForm = (formEl) => {
  if (!formEl) return;
  formEl.resetFields();
  formEl.clearValidate();
};
</script>

<style lang="scss" scoped>
.login {
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


  .error-msg {
    color: red;
    height: 18px;
  }


  .form-box {
    margin-top: 18px;
    padding: 5px 15px 13px;
    height: calc(100vh - 32px);
    overflow: hidden;
    font-size: 14px;
    color: #727272;

    .check-code {
      .check-code-img {
        display: flex;
        border-left: 1px solid #cecdcd;

        img {
          cursor: pointer;
          width: 70px;
          margin-left: 5px;
        }
      }
    }


    .login-button {
      margin-top: 20px;
      width: 100%;
    }

    .login-register-link {
      // margin-top: 15px;
      text-align: right;

      .switch-link {
        cursor: pointer;
        color: #3a84ff;
        line-height: 2em;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>
