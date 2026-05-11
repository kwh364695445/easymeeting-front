# Vue 3 + Electron 项目规范

## 技术栈

- 框架：Vue 3 (Composition API + <script setup>)。
- 构建工具：Vite + electron-vite。
- 状态管理：Pinia。

## 开发规约

- **IPC 通信**：严禁在 Renderer 进程直接调用 Node.js API。
- **组件规范**：优先使用 TypeScript 定义 Props 和 Emits。
- **Electron 安全**：确保所有新窗口开启 `contextIsolation`。
- **逻辑预审补充**：在分析阶段，额外评估该功能是否涉及主进程(Main)与渲染进程(Renderer)的同步问题。

## 常用指令

- 启动开发环境：`npm run dev`
- 打包项目：`npm run build`
