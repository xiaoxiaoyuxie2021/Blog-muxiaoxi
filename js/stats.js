/* ========== 1. 总访问人次 ========== */
(function(){
  const key = 'muxiaoxi_visits';
  let count = +localStorage.getItem(key) || 0;
  if (sessionStorage.getItem('visited') !== '1') {
    count += 1;
    localStorage.setItem(key, count);
    sessionStorage.setItem('visited', '1');
  }
  document.getElementById('totalVisits').textContent = count;
})();

/* ========== 2. 当前在线人数 ========== */
(function(){
  // ① 有 WebSocket 后端时走 ws，② 无后端用随机浮动
  const id = 'muxiaoxi_online';
  let online = +sessionStorage.getItem(id) || Math.floor(Math.random() * 5) + 1;
  sessionStorage.setItem(id, online);
  document.getElementById('onlineUsers').textContent = online;

  // 每 15s 随机波动 ±1，模拟进出
  setInterval(() => {
    online = Math.max(1, online + (Math.random() > 0.5 ? 1 : -1));
    sessionStorage.setItem(id, online);
    document.getElementById('onlineUsers').textContent = online;
  }, 15000);
})();

/* ========== 3. 北京时间 ========== */
(function(){
  const week = '日一二三四五六';
  const el = document.getElementById('beijingTime');
  function tick() {
    const now = new Date(new Date().getTime() + 8 * 3600 * 1000); // 强制+8
    const YY = now.getUTCFullYear();
    const MM = String(now.getUTCMonth() + 1).padStart(2, '0');
    const DD = String(now.getUTCDate()).padStart(2, '0');
    const hh = String(now.getUTCHours()).padStart(2, '0');
    const mm = String(now.getUTCMinutes()).padStart(2, '0');
    const ss = String(now.getUTCSeconds()).padStart(2, '0');
    const w  = week[now.getUTCDay()];
    el.textContent = `${YY}-${MM}-${DD} 周${w} ${hh}:${mm}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ========== 4. 网站运行时间 ========== */
(function(){
  const START = new Date('2025-01-15T00:00:00'); // 改这里
  const el = document.getElementById('siteRuntime');
  function calc() {
    const dur = Date.now() - START;
    const days = Math.floor(dur / 86400000);
    const hrs  = Math.floor(dur / 3600000) % 24;
    const mins = Math.floor(dur / 60000) % 60;
    const secs = Math.floor(dur / 1000) % 60;
    el.textContent = `${days} 天 ${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;
  }
  calc();
  setInterval(calc, 1000);
})();
