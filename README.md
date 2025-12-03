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
