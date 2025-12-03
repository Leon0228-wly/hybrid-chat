const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// 创建Express应用
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 设置端口
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../client')));

// 存储在线用户
const onlineUsers = {};

// Socket连接处理
io.on('connection', (socket) => {
  console.log('新用户连接:', socket.id);

  socket.on('login', (userData) => {
    console.log('用户登录:', userData);
    
    onlineUsers[socket.id] = {
      id: userData.id,
      name: userData.name || `用户${userData.id}`
    };
    
    io.emit('user_joined', {
      user: onlineUsers[socket.id],
      onlineCount: Object.keys(onlineUsers).length
    });
    
    socket.emit('online_users', Object.values(onlineUsers));
  });

  socket.on('chat_message', (messageData) => {
    console.log('收到消息:', messageData);
    
    const message = {
      ...messageData,
      timestamp: new Date().toISOString(),
      sender: onlineUsers[socket.id]
    };
    
    io.emit('chat_message', message);
  });

  // 监听断开连接
  socket.on('disconnect', () => {
    console.log('用户断开连接:', socket.id);
    
    if (onlineUsers[socket.id]) {
      const user = onlineUsers[socket.id];
      delete onlineUsers[socket.id];
      
      io.emit('user_left', {
        user: user,
        onlineCount: Object.keys(onlineUsers).length
      });
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`服务器运行在 http://0.0.0.0:${PORT}`);
  console.log(`局域网访问请使用: http://[您的IP地址]:${PORT}`);
});