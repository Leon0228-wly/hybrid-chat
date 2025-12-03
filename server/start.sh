#!/bin/bash

echo "混合聊天应用服务端启动脚本"
echo "=========================="

if ! command -v node &> /dev/null; then
    echo "错误: Node.js 未安装，请先安装 Node.js"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "错误: 请在 server 目录下运行此脚本"
    exit 1
fi

# 安装依赖
if [ ! -d "node_modules" ]; then
    echo "正在安装依赖..."
    npm install
fi

IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)

echo "正在启动服务器..."
echo "服务器地址: http://localhost:3000"
echo "局域网访问地址: http://$IP:3000"
echo "请按 Ctrl+C 停止服务器"
echo "=========================="

npm start