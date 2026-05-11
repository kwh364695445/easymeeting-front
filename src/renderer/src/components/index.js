/*
 * @Date: 2026-04-25 16:25:19
 * @LastEditTime: 2026-04-26 09:57:03
 * @FilePath: \MyMeeting-Client-maind:\前端练习\vue3\easymeeting-front\src\renderer\src\components\index.js
 * @Description: 以插件方式暴露全局组件
 */
const Components = import.meta.glob('./*.vue', { eager: true })
/*
Vue 的 app.use() 方法专门设计用来接收一个“插件”。
如果你传入一个对象，Vue 会自动寻找该对象中的 install 方法并执行。
如果你传入一个函数，Vue 会直接执行这个函数 */
export default {
  install(app) {
    Object.keys(Components).forEach((key) => {
      const componentName = key.split('/').pop().replace('.vue', '')
      app.component(componentName, Components[key].default)
    })
  }
}
