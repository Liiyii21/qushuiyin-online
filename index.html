// 用户数据存储（使用 localStorage 模拟数据库）
const USERS_KEY = 'video_tool_users';
const CURRENT_USER_KEY = 'video_tool_current_user';

// DOM 元素
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginFormElement = document.getElementById('loginFormElement');
const registerFormElement = document.getElementById('registerFormElement');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const messageDiv = document.getElementById('message');

// 获取所有用户
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

// 保存用户
function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// 查找用户
function findUser(username) {
    const users = getUsers();
    return users.find(u => u.username === username);
}

// 显示消息
function showMessage(text, type = 'success') {
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
    messageDiv.classList.remove('hidden');
    
    setTimeout(() => {
        messageDiv.classList.add('hidden');
    }, 3000);
}

// 切换到注册表单
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    registerForm.classList.add('active');
    messageDiv.classList.add('hidden');
});

// 切换到登录表单
showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.remove('active');
    loginForm.classList.add('active');
    messageDiv.classList.add('hidden');
});

// 注册表单提交
registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value;
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value;
    const email = document.getElementById('registerEmail').value.trim();
    
    // 验证用户名
    if (username.length < 3 || username.length > 20) {
        showMessage('用户名长度必须在3-20个字符之间', 'error');
        return;
    }
    
    // 验证密码
    if (password.length < 6) {
        showMessage('密码长度至少6个字符', 'error');
        return;
    }
    
    // 验证密码确认
    if (password !== passwordConfirm) {
        showMessage('两次输入的密码不一致', 'error');
        return;
    }
    
    // 检查用户名是否已存在
    if (findUser(username)) {
        showMessage('用户名已存在，请换一个', 'error');
        return;
    }
    
    // 创建新用户
    const newUser = {
        username,
        password, // 注意：实际项目中应该加密存储
        email,
        createdAt: new Date().toISOString()
    };
    
    saveUser(newUser);
    showMessage('注册成功！请登录', 'success');
    
    // 清空表单
    registerFormElement.reset();
    
    // 2秒后切换到登录表单
    setTimeout(() => {
        registerForm.classList.remove('active');
        loginForm.classList.add('active');
    }, 2000);
});

// 登录表单提交
loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // 查找用户
    const user = findUser(username);
    
    if (!user) {
        showMessage('用户名不存在', 'error');
        return;
    }
    
    // 验证密码
    if (user.password !== password) {
        showMessage('密码错误', 'error');
        return;
    }
    
    // 登录成功
    const loginData = {
        username: user.username,
        email: user.email,
        loginTime: new Date().toISOString(),
        rememberMe
    };
    
    // 保存登录状态
    if (rememberMe) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loginData));
    } else {
        sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(loginData));
    }
    
    showMessage('登录成功！正在跳转...', 'success');
    
    // 1.5秒后跳转到主页
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});

// 页面加载时检查是否已登录
window.addEventListener('DOMContentLoaded', () => {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY) || sessionStorage.getItem(CURRENT_USER_KEY);
    
    if (currentUser) {
        // 已登录，直接跳转到主页
        window.location.href = 'index.html';
    }
});
