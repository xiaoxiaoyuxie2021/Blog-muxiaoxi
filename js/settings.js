// ===== 设置页面核心逻辑（类名修正版）=====

// 渲染分类菜单（如果存在）
if (typeof renderCategories === 'function') {
  renderCategories();
}

// ===== 初始化设置项可见性 =====
function initSettingsVisibility() {
  // 检查 isLoggedIn 函数是否存在
  if (typeof isLoggedIn !== 'function') {
    console.warn('isLoggedIn 函数未定义');
    return;
  }

  const loggedIn = isLoggedIn();
  const controlledTabs = ['account', 'privacy', 'security'];
  
  controlledTabs.forEach(tabName => {
    // 控制侧边栏菜单项
    const sidebarItem = document.querySelector(`.tab-item[data-tab="${tabName}"]`);
    // 控制主内容卡片
    const contentCard = document.getElementById(`${tabName}-tab`);

    if (sidebarItem) {
      sidebarItem.style.display = loggedIn ? '' : 'none';
    }
    if (contentCard) {
      contentCard.style.display = loggedIn ? '' : 'none';
    }
  });
}

// ===== 激活第一个可见的设置项 =====
function activateFirstVisibleTab() {
  const sidebarItems = document.querySelectorAll('.tab-item');
  const contentCards = document.querySelectorAll('.content-card');
  
  // 移除所有激活状态
  sidebarItems.forEach(i => i.classList.remove('active'));
  contentCards.forEach(c => c.classList.remove('active'));
  
  // 找到第一个可见的侧边栏项
  const firstVisibleItem = Array.from(sidebarItems).find(
    item => item.style.display !== 'none' && getComputedStyle(item).display !== 'none'
  );
  
  if (firstVisibleItem) {
    // 激活第一个可见的侧边栏项
    firstVisibleItem.classList.add('active');
    
    // 找到对应的内容卡片并激活
    const targetTab = firstVisibleItem.dataset.tab;
    const targetCard = document.getElementById(`${targetTab}-tab`);
    if (targetCard) {
      targetCard.classList.add('active');
    }
  }
}

// ===== 设置页导航切换（修正类名）=====
document.addEventListener('DOMContentLoaded', () => {
  // 先初始化可见性（在渲染之前执行）
  initSettingsVisibility();
  
  const sidebarItems = document.querySelectorAll('.tab-item');
  // ✅ 修正：使用新的类名 .content-card
  const contentCards = document.querySelectorAll('.content-card');

  // 防御检查
  if (sidebarItems.length === 0 || contentCards.length === 0) {
    console.warn('导航或卡片元素未找到');
    return;
  }

  // 激活第一个可见的设置项（而不是固定的第一个）
  activateFirstVisibleTab();

  // 点击切换
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      sidebarItems.forEach(i => i.classList.remove('active'));
      contentCards.forEach(c => c.classList.remove('active'));

      item.classList.add('active');
      const targetTab = item.dataset.tab;
      // ✅ 修正：使用新的ID格式
      const targetCard = document.getElementById(`${targetTab}-tab`);
      if (targetCard) {
        targetCard.classList.add('active');
      }
    });
  });

  // hover 效果
  sidebarItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (!item.classList.contains('active')) {
        item.style.background = 'rgba(255, 255, 255, 0.9)';
      }
    });
    item.addEventListener('mouseleave', () => {
      if (!item.classList.contains('active')) {
        item.style.background = '';
      }
    });
  });

  console.log('设置导航初始化完成');
});

// ===== 保存/取消按钮 =====
document.querySelectorAll('.btn-save').forEach(btn => {
  btn.addEventListener('click', () => {
    const originalText = btn.textContent;
    btn.textContent = '保存成功！';
    btn.style.background = 'linear-gradient(135deg, #d4edda, #87cefa)';
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
    }, 2000);
  });
});

document.querySelectorAll('.cancel-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    alert('已取消更改');
  });
});

// ===== 浏览信息功能（完全保留原始逻辑）=====
// 确保函数在调用前已定义
function initBrowserInfo() {
  const browserTab = document.getElementById('browser-tab');
  if (!browserTab) return;

  // 填充信息
  const browserNameEl = document.getElementById('browserName');
  const browserVersionEl = document.getElementById('browserVersion');
  const platformEl = document.getElementById('platform');
  const screenResolutionEl = document.getElementById('screenResolution');
  const ipAddressEl = document.getElementById('ipAddress');
  const networkStatusEl = document.getElementById('networkStatus');

  if (browserNameEl) browserNameEl.textContent = getBrowserName();
  if (browserVersionEl) browserVersionEl.textContent = navigator.userAgent.split('/').pop().split(' ')[0];
  if (screenResolutionEl) screenResolutionEl.textContent = `${screen.width} × ${screen.height}`;

  // 异步获取操作系统（保留原始逻辑）
  if (platformEl) {
    getOSName().then(osName => {
      platformEl.textContent = osName;
    }).catch(() => {
      platformEl.textContent = navigator.platform;
    });
  }

  // 获取IP地址（保留原始的多API轮询逻辑）
  if (ipAddressEl) {
    (async function fetchIPAddress() {
      const apis = [
        'https://api.ipify.org?format=json',
        'https://api64.ipify.org?format=json',
        'https://ip.seeip.org/jsonip'
      ];

      for (const api of apis) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);
          const response = await fetch(api, { signal: controller.signal });
          clearTimeout(timeoutId);
          if (response.ok) {
            const data = await response.json();
            ipAddressEl.textContent = data.ip;
            return;
          }
        } catch (error) {
          continue;
        }
      }
      ipAddressEl.textContent = '网络受限';
    })();
  }

  // 网络状态（保留原始逻辑）
  if (networkStatusEl) {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      const speed = Math.round(connection.downlink * 10) / 10;
      const isMobile = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
      let networkType = connection.effectiveType;
      if (!isMobile && networkType === '4g') networkType = 'WiFi';
      networkStatusEl.textContent = `${networkType} (${speed} Mbps)`;
    } else {
      networkStatusEl.textContent = '未知';
    }
  }
}

// 在 DOM 加载完成后执行
document.addEventListener('DOMContentLoaded', initBrowserInfo);

// ===== 辅助函数（完全保留原始版本）=====

function getBrowserName() {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('MiuiBrowser') > -1) return '小米浏览器';
  if (userAgent.indexOf('HuaweiBrowser') > -1 || userAgent.indexOf('HUAWEI/') > -1) return '华为浏览器';
  if (userAgent.indexOf('SamsungBrowser') > -1) return '三星浏览器';
  if (userAgent.indexOf('OppoBrowser') > -1) return 'OPPO浏览器';
  if (userAgent.indexOf('vivoBrowser') > -1 || userAgent.indexOf('VivoBrowser') > -1) return 'vivo浏览器';
  if (userAgent.indexOf('OnePlus') > -1) return '一加浏览器';
  if (userAgent.indexOf('QQBrowser') > -1) return 'QQ浏览器';
  if (userAgent.indexOf('UCBrowser') > -1) return 'UC浏览器';
  if (userAgent.indexOf('Baidu') > -1 || userAgent.indexOf('baidu') > -1) return '百度浏览器';
  if (userAgent.indexOf('360SE') > -1 || userAgent.indexOf('QihooBrowser') > -1) return '360安全浏览器';
  if (userAgent.indexOf('360EE') > -1) return '360极速浏览器';
  if (userAgent.indexOf('Edg/') > -1) return 'Microsoft Edge';
  if (userAgent.indexOf('Edge/') > -1) return 'Microsoft Edge (旧版)';
  if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Edg/') === -1 && userAgent.indexOf('SamsungBrowser') === -1) {
    return userAgent.indexOf('Mobile') > -1 ? 'Chrome Mobile' : 'Chrome';
  }
  if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
  if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') === -1) {
    return userAgent.indexOf('Mobile') > -1 ? 'Safari (iOS)' : 'Safari';
  }
  if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident/') > -1) return 'Internet Explorer';
  return '未知浏览器';
}

function getBrowserEngine() {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf('WebKit') > -1) return 'WebKit';
  if (userAgent.indexOf('Gecko') > -1 && userAgent.indexOf('WebKit') === -1) return 'Gecko';
  if (userAgent.indexOf('Trident') > -1) return 'Trident';
  if (userAgent.indexOf('Presto') > -1) return 'Presto';
  return '未知引擎';
}

async function getOSName() {
  if (navigator.userAgentData) {
    try {
      const highEntropyValues = await navigator.userAgentData.getHighEntropyValues(["platformVersion"]);
      const platformVersion = highEntropyValues.platformVersion;
      if (navigator.userAgentData.platform === "Windows") {
        if (platformVersion && parseFloat(platformVersion) >= 13.0) return "Windows 11";
        return "Windows 10";
      }
      return navigator.userAgentData.platform || '未知系统';
    } catch (e) {
      console.log("无法获取高熵值数据:", e);
    }
  }

  const userAgent = navigator.userAgent;
  const platform = navigator.platform;

  if (platform.indexOf('Win') > -1) {
    if (userAgent.indexOf('Windows NT 10.0') > -1) return 'Windows 10/11';
    if (userAgent.indexOf('Windows NT 6.3') > -1) return 'Windows 8.1';
    if (userAgent.indexOf('Windows NT 6.2') > -1) return 'Windows 8';
    if (userAgent.indexOf('Windows NT 6.1') > -1) return 'Windows 7';
    if (userAgent.indexOf('WOW64') > -1 || userAgent.indexOf('Win64') > -1) return 'Windows (64-bit)';
    return 'Windows (32-bit)';
  }

  if (platform.indexOf('Mac') > -1) return 'macOS';
  if (platform.indexOf('Linux') > -1) return 'Linux';
  if (/iPhone|iPad|iPod/.test(userAgent)) return 'iOS';

  if (userAgent.indexOf('Android') > -1) {
    const versionMatch = userAgent.match(/Android\s+(\d+)(?:\.(\d+))?/);
    if (versionMatch) {
      const major = versionMatch[1];
      const minor = versionMatch[2];
      return minor ? `Android ${major}.${minor}` : `Android ${major}`;
    }
    return 'Android';
  }

  return platform || '未知系统';
}
