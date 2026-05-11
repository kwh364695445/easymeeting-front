/*
 * @Date: 2026-04-13 21:16:10
 * @LastEditTime: 2026-04-13 23:32:09
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\utils\request.js
 * @Description: HTTP请求工具类，封装了axios并添加了拦截器、loading处理等功能
 */
import axios from 'axios'
import { ElLoading } from 'element-plus'
import Message from '@/utils/Message'
import router from '@/router'
const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8' // 表单提交内容类型
const contentTypeJson = 'application/json' // JSON提交内容类型
const responseTypeJson = 'json' // 默认响应类型
let loading = null;

// 创建axios实例，配置基础参数
const instance = axios.create({
    withCredentials: true, // 允许携带cookie
    baseURL: (import.meta.env.PROD ? import.meta.env.VITE_DOMAIN : "") + "/api", // 如果生成环境则使用生产环境地址，否则使用/api
    timeout: 10 * 1000, // 请求超时时间10秒
});

//请求前拦截器 - 处理loading显示等逻辑
instance.interceptors.request.use(
    (config) => {
        if (config.showLoading) {
            loading = ElLoading.service({
                lock: true,
                text: '加载中......',
                background: 'rgba(0, 0, 0, 0.7)',
            });
        }
        return config;
    },
    (error) => {
        if (error.config.showLoading && loading) {
            loading.close();
        }
        Message.error("请求发送失败");
        return Promise.reject("请求发送失败");
    }
);

//请求后拦截器 - 处理响应数据、错误状态、登录过期等
instance.interceptors.response.use(
    async (response) => {
        const { showLoading, errorCallback, showError = true, responseType } = response.config;
        if (showLoading && loading) {
            loading.close()
        }
        const responseData = response.data;

        // 处理文件下载类型响应
        if (responseType == "arraybuffer" || responseType == "blob") {
            return responseData;
        }

        // 正常业务响应处理
        if (responseData.code == 200) {
            return responseData;
        }
        // 登录过期处理 - 调用登出操作并跳转到首页
        else if (responseData.code == 901) {
            await window.electron.ipcRenderer.invoke('logout')
            router.push('/')
            return Promise.reject({ showError: false });
        }
        // 其他业务错误处理
        else {
            if (errorCallback) {
                errorCallback(responseData);
            }
            return Promise.reject({ showError: showError, msg: responseData.msg });
        }
    },
    (error) => {
        if (error.config.showLoading && loading) {
            loading.close();
        }
        return Promise.reject({ showError: true, msg: "网络异常" })
    }
);

/**
 * 封装的HTTP请求方法
 * @param {Object} config - 请求配置对象
 * @param {String} config.url - 请求地址
 * @param {Object} config.params - 请求参数
 * @param {String} config.dataType - 数据类型(form/json)
 * @param {Boolean} config.showLoading - 是否显示loading
 * @param {String} config.responseType - 响应类型(json/blob/arraybuffer)
 * @param {Boolean} config.showError - 是否显示错误信息
 * @param {Function} config.errorCallback - 自定义错误回调
 * @param {Function} config.uploadProgressCallback - 上传进度回调
 */
const request = (config) => {
    const { url, params, dataType, showLoading = true, responseType = responseTypeJson, showError = true } = config;
    let contentType = contentTypeForm; // 默认表单格式
    let formData = new FormData();// 创建form对象，用于处理表单数据

    // 将params对象转换为FormData格式
    for (let key in params) {
        formData.append(key, params[key] == undefined ? "" : params[key]);
    }

    // 根据dataType决定content-type
    if (dataType != null && dataType == 'json') {
        contentType = contentTypeJson;
    }

    // 获取本地存储的用户信息用于认证
    let userInfoJson = localStorage.getItem('userInfo');
    const token = userInfoJson ? JSON.parse(userInfoJson).token : "";
    let headers = {
        'Content-Type': contentType,
        'X-Requested-With': 'XMLHttpRequest', // 标识这是一个Ajax请求
        "token": token // 认证令牌
    }

    // 发起POST请求
    return instance.post(url, formData, {
        // 上传进度回调函数，用于监听文件上传进度(Axios内置配置)
        onUploadProgress: (event) => {
            if (config.uploadProgressCallback) {
                // event.loaded 表示已上传的字节数
                // event.total 表示总字节数
                // 可以计算上传百分比: Math.round((event.loaded * 100) / event.total)
                config.uploadProgressCallback(event);
            }
        },
        // 响应数据类型，指定服务器返回的数据格式（如json、blob、arraybuffer等）(Axios内置配置)
        responseType: responseType,
        // 请求头信息，包含内容类型、认证令牌等必要信息(Axios内置配置)
        headers: headers,
        // 是否显示加载提示，控制是否显示loading动画(自定义配置)
        showLoading: showLoading,
        // 错误回调函数，自定义错误处理逻辑(自定义配置)
        errorCallback: config.errorCallback,
        // 是否显示错误信息，控制错误消息是否展示给用户(自定义配置)
        showError: showError,
    }).catch(error => {
        if (error.showError) {
            Message.error(error.msg);
        }
        return null;
    });
};

export default request;
