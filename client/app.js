// DOM 元素
const loginSection = document.getElementById('login-section');
const chatSection = document.getElementById('chat-section');
const userIdInput = document.getElementById('user-id');
const loginBtn = document.getElementById('login-btn');
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');
const onlineCount = document.getElementById('online-count');
const deviceInfoBtn = document.getElementById('device-info-btn');
const deviceInfoModal = document.getElementById('device-info');
const deviceDetails = document.getElementById('device-details');
const closeModal = document.querySelector('.close');

let socket;
let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
    window.isAndroidWebView = typeof window.AndroidInterface !== 'undefined';
    
    loginBtn.addEventListener('click', handleLogin);
    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    deviceInfoBtn.addEventListener('click', getDeviceInfo);
    closeModal.addEventListener('click', () => {
        deviceInfoModal.classList.add('hidden');
    });
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

function handleLogin() {
    const userId = userIdInput.value.trim();
    
    if (!userId) {
        alert('请输入用户ID');
        return;
    }
    
    currentUser = { id: userId };
    
    socket = io();
    
    socket.on('connect', () => {
        console.log('连接成功');
        
        socket.emit('login', currentUser);
        
        loginSection.classList.add('hidden');
        chatSection.classList.remove('hidden');
        
        addSystemMessage('已连接到聊天服务器');
    });
    
    // 监听聊天消息
    socket.on('chat_message', (message) => {
        displayMessage(message);
        
        if (document.hidden && window.isAndroidWebView) {
            try {
                window.AndroidInterface.showNotification(
                    `${message.sender.name}: ${message.content}`
                );
            } catch (e) {
                console.error('无法显示通知:', e);
            }
        }
    });
    
    socket.on('user_joined', (data) => {
        addSystemMessage(`${data.user.name} 加入了聊天室`);
        onlineCount.textContent = data.onlineCount;
    });
    
    socket.on('user_left', (data) => {
        addSystemMessage(`${data.user.name} 离开了聊天室`);
        onlineCount.textContent = data.onlineCount;
    });
    
    socket.on('online_users', (users) => {
        onlineCount.textContent = users.length;
    });
    
    socket.on('connect_error', (error) => {
        console.error('连接错误:', error);
        alert('无法连接到服务器，请检查网络连接');
    });
}

function sendMessage() {
    const messageContent = messageInput.value.trim();
    
    if (!messageContent) {
        return;
    }
    
    socket.emit('chat_message', {
        content: messageContent
    });
    
    messageInput.value = '';
}

function displayMessage(message) {
    const messageElement = document.createElement('div');
    const isOwnMessage = message.sender.id === currentUser.id;
    
    messageElement.classList.add('message');
    messageElement.classList.add(isOwnMessage ? 'own' : 'other');
    
    const time = new Date(message.timestamp).toLocaleTimeString();
    
    messageElement.innerHTML = `
        <div class="message-header">${message.sender.name} · ${time}</div>
        <div class="message-content">${message.content}</div>
    `;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addSystemMessage(content) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('system-notification');
    messageElement.textContent = content;
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function getDeviceInfo() {
    if (window.isAndroidWebView) {
        try {
            const deviceInfo = window.AndroidInterface.getDeviceInfo();
            deviceDetails.innerHTML = `
                <p><strong>设备型号:</strong> ${deviceInfo}</p>
                <p><strong>用户代理:</strong> ${navigator.userAgent}</p>
                <p><strong>平台:</strong> ${navigator.platform}</p>
                <p><strong>语言:</strong> ${navigator.language}</p>
                <p><strong>在线状态:</strong> ${navigator.onLine ? '在线' : '离线'}</p>
            `;
            deviceInfoModal.classList.remove('hidden');
        } catch (e) {
            console.error('获取设备信息失败:', e);
            deviceDetails.innerHTML = '<p>无法获取设备信息</p>';
            deviceInfoModal.classList.remove('hidden');
        }
    } else {
        deviceDetails.innerHTML = `
            <p><strong>用户代理:</strong> ${navigator.userAgent}</p>
            <p><strong>平台:</strong> ${navigator.platform}</p>
            <p><strong>语言:</strong> ${navigator.language}</p>
            <p><strong>在线状态:</strong> ${navigator.onLine ? '在线' : '离线'}</p>
            <p><strong>Cookie启用:</strong> ${navigator.cookieEnabled ? '是' : '否'}</p>
        `;
        deviceInfoModal.classList.remove('hidden');
    }
}

function handleVisibilityChange() {
    if (!document.hidden) {
        console.log('页面变为可见');
    }
}