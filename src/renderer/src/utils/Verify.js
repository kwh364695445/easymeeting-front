/**
 * 正则表达式集合对象
 * @type {Object}
 */
const regs = {
    /** 邮箱格式验证：匹配标准邮箱格式，如 username@domain.com */
    email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
    /** 正整数验证：匹配正整数，不能以0开头（除了单独的0），可带+号 */
    number: /^\+?[1-9][0-9]*$/,
    /** 密码格式验证：至少包含一个数字和一个字母，长度8-18位，允许特殊字符 */
    password: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*_.]{8,18}$/,
    /** 版本号格式验证：只包含数字和点号 */
    version: /^[0-9\.]+$/
}

/**
 * 通用验证函数
 * @param {Object} rule - 验证规则对象
 * @param {*} value - 待验证的值
 * @param {RegExp} reg - 用于验证的正则表达式
 * @param {Function} callback - 回调函数，验证结果通过参数传递
 */
const verify = (rule, value, reg, callback) => {
    if (value) {
        if (reg.test(value)) {
            callback()
        } else {
            callback(new Error(rule.message))
        }
    } else {
        callback()
    }
}

/**
 * 检查密码格式是否符合要求
 * @param {string} value - 待检查的密码字符串
 * @returns {boolean} 返回验证结果
 */
const checkPassword = (value) => {
    return regs.password.test(value);
}

/**
 * 检查邮箱格式是否符合要求
 * @param {string} value - 待检查的邮箱字符串
 * @returns {boolean} 返回验证结果
 */
const checkEmail = (value) => {
    return regs.email.test(value);
}

/**
 * 密码验证规则函数
 * @param {Object} rule - 验证规则对象
 * @param {*} value - 待验证的值
 * @param {Function} callback - 回调函数
 */
const password = (rule, value, callback) => {
    return verify(rule, value, regs.password, callback)
}

/**
 * 数字验证规则函数
 * @param {Object} rule - 验证规则对象
 * @param {*} value - 待验证的值
 * @param {Function} callback - 回调函数
 */
const number = (rule, value, callback) => {
    return verify(rule, value, regs.number, callback)
}

/**
 * 版本号验证规则函数
 * @param {Object} rule - 验证规则对象
 * @param {*} value - 待验证的值
 * @param {Function} callback - 回调函数
 */
const version = (rule, value, callback) => {
    return verify(rule, value, regs.version, callback)
}

/** 导出验证工具函数 */
export default{
    checkPassword,
    checkEmail,
    password,
    number,
    version,
}