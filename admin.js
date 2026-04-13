// 数据存储键
const USERS_KEY = 'video_tool_users';
const CURRENT_USER_KEY = 'video_tool_current_user';
const LOGS_KEY = 'video_tool_logs';
const STATS_KEY = 'video_tool_stats';
const ADMIN_KEY = 'video_tool_admin';

// 检查管理员权限
function checkAdminAuth() {
    const currentUser = localStorage.getItem(CURRENT_USER_KEY) || sessionStorage.getItem(CURRENT_USER_KEY);
    
    if (!currentUser) {
        window.location.href = 'auth.html';
        return null;
    }
    
    const user = JSON.parse(currentUser);
    
    // 检查是否是管理员（用户名为 admin）
    if (user.username !== 'admin') {
        alert('无权访问管理后台！');
        window.location.href = 'index.html';
        return null;
    }
    
    return user;
}

// 初始化
const currentAdmin = checkAdminAuth();
if (currentAdmin) {
    document.getElementById('adminUsername').textContent = currentAdmin.username;
}

// 获取数据
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function getLogs() {
    const logs = localStorage.getItem(LOGS_KEY);
    return logs ? JSON.parse(logs) : [];
}

function getStats() {
    const stats = localStorage.getItem(STATS_KEY);
    return stats ? JSON.parse(stats) : {
        totalParses: 0,
        totalDownloads: 0,
        todayVisits: 0,
        dailyStats: []
    };
}

// 保存数据
function saveLogs(logs) {
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
}

function saveStats(stats) {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// 导航切换
const navItems = document.querySelectorAll('.nav-item');
const pages = document.querySelectorAll('.page-content');
const pageTitle = document.getElementById('pageTitle');

const pageTitles = {
    dashboard: '数据概览',
    users: '用户管理',
    logs: '使用记录',
    settings: '系统设置'
};

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const page = item.dataset.page;
        
        // 更新导航状态
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // 切换页面
        pages.forEach(p => p.classList.remove('active'));
        document.getElementById(page + 'Page').classList.add('active');
        
        // 更新标题
        pageTitle.textContent = pageTitles[page];
        
        // 加载对应页面数据
        loadPageData(page);
    });
});

// 加载页面数据
function loadPageData(page) {
    switch(page) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'users':
            loadUsers();
            break;
        case 'logs':
            loadLogs();
            break;
        case 'settings':
            loadSettings();
            break;
    }
}

// 加载数据概览
function loadDashboard() {
    const users = getUsers();
    const stats = getStats();
    
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalParses').textContent = stats.totalParses || 0;
    document.getElementById('totalDownloads').textContent = stats.totalDownloads || 0;
    document.getElementById('todayVisits').textContent = stats.todayVisits || 0;
    
    // 绘制图表
    drawChart();
}

// 绘制简单图表
function drawChart() {
    const canvas = document.getElementById('chartCanvas');
    const ctx = canvas.getContext('2d');
    const stats = getStats();
    
    // 设置画布大小
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 模拟数据（最近7天）
    const days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
    const data = stats.dailyStats && stats.dailyStats.length > 0 
        ? stats.dailyStats.slice(-7) 
        : [12, 19, 15, 25, 22, 30, 28];
    
    const maxValue = Math.max(...data);
    const barWidth = (width - padding * 2) / data.length;
    
    // 绘制坐标轴
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // 绘制柱状图
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * (height - padding * 2);
        const x = padding + index * barWidth + barWidth * 0.2;
        const y = height - padding - barHeight;
        const w = barWidth * 0.6;
        
        // 渐变色
        const gradient = ctx.createLinearGradient(x, y, x, height - padding);
        gradient.addColorStop(0, '#00d4ff');
        gradient.addColorStop(1, '#7877c6');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, w, barHeight);
        
        // 绘制数值
        ctx.fillStyle = '#00d4ff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value, x + w / 2, y - 5);
        
        // 绘制日期
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.fillText(days[index], x + w / 2, height - padding + 20);
    });
}

// 加载用户列表
function loadUsers() {
    const users = getUsers();
    const tbody = document.getElementById('usersTableBody');
    const logs = getLogs();
    
    tbody.innerHTML = '';
    
    users.forEach(user => {
        // 统计用户使用次数
        const userLogs = logs.filter(log => log.username === user.username);
        const useCount = userLogs.length;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${user.username}</td>
            <td>${user.email || '-'}</td>
            <td>${new Date(user.createdAt).toLocaleString()}</td>
            <td>${useCount}</td>
            <td><span class="status-badge status-active">正常</span></td>
            <td>
                <button class="btn-small btn-primary" onclick="viewUser('${user.username}')">查看</button>
                <button class="btn-small btn-danger" onclick="deleteUser('${user.username}')">删除</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    
    if (users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 30px;">暂无用户数据</td></tr>';
    }
}

// 查看用户详情
function viewUser(username) {
    const users = getUsers();
    const user = users.find(u => u.username === username);
    const logs = getLogs();
    const userLogs = logs.filter(log => log.username === username);
    
    if (!user) return;
    
    const modal = document.getElementById('userModal');
    const modalBody = document.getElementById('userModalBody');
    
    modalBody.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h4 style="color: #00d4ff; margin-bottom: 10px;">基本信息</h4>
            <p><strong>用户名：</strong>${user.username}</p>
            <p><strong>邮箱：</strong>${user.email || '未填写'}</p>
            <p><strong>注册时间：</strong>${new Date(user.createdAt).toLocaleString()}</p>
        </div>
        <div>
            <h4 style="color: #00d4ff; margin-bottom: 10px;">使用统计</h4>
            <p><strong>总使用次数：</strong>${userLogs.length}</p>
            <p><strong>解析次数：</strong>${userLogs.filter(l => l.type === 'parse').length}</p>
            <p><strong>下载次数：</strong>${userLogs.filter(l => l.type === 'download').length}</p>
            <p><strong>最后活动：</strong>${userLogs.length > 0 ? new Date(userLogs[userLogs.length - 1].time).toLocaleString() : '无'}</p>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// 删除用户
function deleteUser(username) {
    if (!confirm(`确定要删除用户 "${username}" 吗？此操作不可恢复！`)) {
        return;
    }
    
    const users = getUsers();
    const filteredUsers = users.filter(u => u.username !== username);
    localStorage.setItem(USERS_KEY, JSON.stringify(filteredUsers));
    
    alert('用户已删除');
    loadUsers();
}

// 加载使用记录
function loadLogs() {
    const logs = getLogs();
    const tbody = document.getElementById('logsTableBody');
    const filter = document.getElementById('logFilter').value;
    
    tbody.innerHTML = '';
    
    const filteredLogs = filter === 'all' 
        ? logs 
        : logs.filter(log => log.type === filter);
    
    filteredLogs.reverse().slice(0, 100).forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(log.time).toLocaleString()}</td>
            <td>${log.username}</td>
            <td>${getLogTypeText(log.type)}</td>
            <td>${log.detail || '-'}</td>
            <td><span class="status-badge ${log.status === 'success' ? 'status-success' : 'status-failed'}">${log.status === 'success' ? '成功' : '失败'}</span></td>
        `;
        tbody.appendChild(tr);
    });
    
    if (filteredLogs.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 30px;">暂无记录</td></tr>';
    }
}

function getLogTypeText(type) {
    const types = {
        parse: '视频解析',
        download: '视频下载',
        login: '用户登录',
        register: '用户注册'
    };
    return types[type] || type;
}

// 加载设置
function loadSettings() {
    // 从 app.js 读取当前配置（如果有的话）
    const apiKey = localStorage.getItem('api_key') || '';
    const apiUrl = localStorage.getItem('api_url') || 'https://api.wxshares.com/api/qsy/plus';
    
    document.getElementById('apiKey').value = apiKey;
    document.getElementById('apiUrl').value = apiUrl;
}

// 保存 API 配置
document.getElementById('saveApiBtn').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value.trim();
    const apiUrl = document.getElementById('apiUrl').value.trim();
    
    if (!apiKey || !apiUrl) {
        alert('请填写完整的 API 配置');
        return;
    }
    
    localStorage.setItem('api_key', apiKey);
    localStorage.setItem('api_url', apiUrl);
    
    alert('API 配置已保存！');
});

// 清空使用记录
document.getElementById('clearLogsBtn').addEventListener('click', () => {
    if (!confirm('确定要清空所有使用记录吗？')) return;
    
    localStorage.setItem(LOGS_KEY, JSON.stringify([]));
    alert('使用记录已清空');
    loadLogs();
});

// 重置统计数据
document.getElementById('clearStatsBtn').addEventListener('click', () => {
    if (!confirm('确定要重置统计数据吗？')) return;
    
    const emptyStats = {
        totalParses: 0,
        totalDownloads: 0,
        todayVisits: 0,
        dailyStats: []
    };
    saveStats(emptyStats);
    alert('统计数据已重置');
    loadDashboard();
});

// 清空所有数据
document.getElementById('clearAllDataBtn').addEventListener('click', () => {
    if (!confirm('⚠️ 警告：此操作将清空所有数据（除管理员账号），确定继续吗？')) return;
    if (!confirm('再次确认：真的要清空所有数据吗？此操作不可恢复！')) return;
    
    // 保留管理员账号
    const users = getUsers();
    const adminUser = users.find(u => u.username === 'admin');
    localStorage.setItem(USERS_KEY, JSON.stringify(adminUser ? [adminUser] : []));
    
    // 清空其他数据
    localStorage.setItem(LOGS_KEY, JSON.stringify([]));
    saveStats({
        totalParses: 0,
        totalDownloads: 0,
        todayVisits: 0,
        dailyStats: []
    });
    
    alert('所有数据已清空');
    loadDashboard();
    loadUsers();
    loadLogs();
});

// 导出用户数据
document.getElementById('exportUsersBtn').addEventListener('click', () => {
    const users = getUsers();
    const dataStr = JSON.stringify(users, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
});

// 导出使用记录
document.getElementById('exportLogsBtn').addEventListener('click', () => {
    const logs = getLogs();
    const dataStr = JSON.stringify(logs, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `logs_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
});

// 返回主页
document.getElementById('backToMainBtn').addEventListener('click', () => {
    window.location.href = 'index.html';
});

// 退出登录
document.getElementById('adminLogoutBtn').addEventListener('click', () => {
    if (!confirm('确定要退出登录吗？')) return;
    
    localStorage.removeItem(CURRENT_USER_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = 'auth.html';
});

// 关闭弹窗
document.querySelector('.modal-close').addEventListener('click', () => {
    document.getElementById('userModal').classList.add('hidden');
});

document.getElementById('userModal').addEventListener('click', (e) => {
    if (e.target.id === 'userModal') {
        document.getElementById('userModal').classList.add('hidden');
    }
});

// 用户搜索
document.getElementById('userSearch').addEventListener('input', (e) => {
    const keyword = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#usersTableBody tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(keyword) ? '' : 'none';
    });
});

// 日志筛选
document.getElementById('logFilter').addEventListener('change', () => {
    loadLogs();
});

// 页面加载时初始化
loadDashboard();
