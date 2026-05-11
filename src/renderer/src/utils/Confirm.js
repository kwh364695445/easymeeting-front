/*
 * @Date: 2026-04-13 22:17:07
 * @LastEditTime: 2026-04-13 22:17:15
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\utils\Confirm.js
 * @Description: 消息确认框和警告框工具函数
 */
import { ElMessageBox } from 'element-plus'

/**
 * 自定义确认对话框
 * @param {string} message - 显示的消息内容
 * @param {function} okfun - 点击确定按钮执行的回调函数
 * @param {boolean} showCancelBtn - 是否显示取消按钮，默认true
 * @param {boolean} showClose - 是否显示右上角关闭按钮，默认true
 * @param {string} okText - 确认按钮文字，默认'确定'
 * @param {string} cancelText - 取消按钮文字，默认'取消'
 * @param {function} cancelfun - 点击取消按钮执行的回调函数
 */
const Confirm = ({ message, okfun, showCancelBtn = true, showClose = true, okText = '确定', cancelText = '取消', cancelfun }) => {
    ElMessageBox.confirm(message, '提示', {
        "close-on-click-modal": false,
        confirmButtonText: okText,
        cancelButtonText: cancelText,
        showCancelButton: showCancelBtn,
        showClose: showClose,
        type: 'info',
    }).then(async () => {
        if (okfun) {
            okfun();
        }
    }).catch((action) => {
        if (action == "cancel" && cancelfun) {
            cancelfun()
        }
    });
};

/**
 * 自定义警告对话框
 * @param {string} msg - 显示的警告消息
 * @param {function} okfun - 点击OK按钮执行的回调函数
 */
const Alert = (msg, okfun) => {
    ElMessageBox.alert(msg, '确认', {
        confirmButtonText: 'OK',
        showClose: false,
        callback: (action) => {
            if (action == "confirm" && okfun) {
                okfun();
            }
        },
    })
}
export {
    Confirm,
    Alert
}