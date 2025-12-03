# 混合聊天应用

这是一个使用 Web 技术 + Android WebView + Node.js 实现的混合聊天应用。

## 项目结构

```
hybrid/
├── server/           # Node.js 服务端
│   ├── package.json
│   └── server.js
├── client/           # 前端 H5 页面
│   ├── index.html
│   ├── style.css
│   └── app.js
└── android/          # Android 原生端
    ├── build.gradle
    ├── gradle.properties
    ├── settings.gradle
    └── app/
        ├── build.gradle
        └── src/main/
            ├── AndroidManifest.xml
            ├── java/com/example/hybridchat/
            │   └── MainActivity.java
            └── res/
                ├── layout/
                │   └── activity_main.xml
                └── values/
                    ├── strings.xml
                    ├── styles.xml
                    └── colors.xml
```

## 技术栈

- **服务端**: Node.js + Express + Socket.io
- **前端**: 原生 HTML + CSS + JavaScript + Socket.io-client
- **客户端**: Android (Java) + WebView

## 功能特性

- 实时聊天功能
- 用户登录和在线状态显示
- 获取设备信息 (Android 原生功能)
- 新消息通知 (Android 原生功能)
- JSBridge 交互 (WebView 与 Android 原生代码通信)

## 快速开始

### 1. 启动服务端

```bash
cd server
npm install
npm start
```

服务器将在 3000 端口启动，并自动提供前端 H5 页面的静态文件服务。

### 2. 访问前端页面

在浏览器中访问 `http://localhost:3000` 或 `http://[您的IP地址]:3000`

### 3. 运行 Android 应用

1. 使用 Android Studio 打开 `android` 目录
2. 修改 `MainActivity.java` 中的服务器地址为您电脑的局域网 IP 地址
3. 构建并运行应用

## 详细说明

### 服务端

服务端使用 Express 和 Socket.io 实现：

- 创建 HTTP 服务器监听 3000 端口
- 提供静态文件服务（前端页面）
- 处理 WebSocket 连接和事件：
  - `login`: 用户登录
  - `chat_message`: 聊天消息
  - `disconnect`: 用户断开连接

### 前端 H5

前端使用原生 HTML/CSS/JavaScript 实现：

- 登录界面：输入用户 ID 并登录
- 聊天界面：显示聊天记录、在线人数、发送消息
- JSBridge 交互：
  - 调用 Android 原生方法获取设备信息
  - 当页面不可见时，调用 Android 原生方法显示通知

### Android 原生端

Android 应用使用 WebView 加载 H5 页面，并提供 JSBridge 接口：

- `MainActivity`: 初始化 WebView，加载聊天应用页面
- `WebAppInterface`: 提供 JavaScript 可调用的原生方法
  - `getDeviceInfo()`: 返回手机型号
  - `showNotification(String message)`: 显示系统通知

## 注意事项

1. **网络权限**: Android 应用需要网络权限才能访问服务器
2. **明文流量**: Android 应用需要允许明文 HTTP 流量
3. **IP 地址**: 请确保在 Android 代码中使用正确的服务器 IP 地址
4. **通知权限**: Android 6.0+ 需要动态申请通知权限

## 开发环境要求

- Node.js 14+
- Android Studio
- Android SDK (API 21+)
- 一台 Android 设备或模拟器

## 故障排除

1. **无法连接服务器**: 检查服务器是否正常运行，IP 地址是否正确
2. **无法显示通知**: 检查通知权限是否已授予
3. **页面加载失败**: 检查网络权限和服务器地址

## 扩展功能

可以考虑添加以下功能来扩展应用：

- 用户注册和认证
- 私聊功能
- 文件/图片分享
- 消息历史记录
- 表情符号支持
- 语音消息