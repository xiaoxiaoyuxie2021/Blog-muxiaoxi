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
  const el = document.getElementById('beijingTime');
  function tick() {
    const now = new Date(new Date().getTime() + 8 * 3600 * 1000); // 强制+8
    const YY = now.getUTCFullYear();
    const MM = String(now.getUTCMonth() + 1).padStart(2, '0');
    const DD = String(now.getUTCDate()).padStart(2, '0');
    const hh = String(now.getUTCHours()).padStart(2, '0');
    const mm = String(now.getUTCMinutes()).padStart(2, '0');
    const ss = String(now.getUTCSeconds()).padStart(2, '0');
    el.innerHTML = `${YY}-${MM}-${DD} <br> ${hh}:${mm}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);
})();

/* ========== 4. 网站运行时间 ========== */
(function(){
  const START = new Date('2026-01-10T15:17:00'); 
  const el = document.getElementById('siteRuntime');
  function calc() {
    const dur = Date.now() - START;
    const days = Math.floor(dur / 86400000);
    const hrs  = Math.floor(dur / 3600000) % 24;
    const mins = Math.floor(dur / 60000) % 60;
    const secs = Math.floor(dur / 1000) % 60;
    el.innerHTML = `${days} 天 <br> ${String(hrs).padStart(2,'0')}时${String(mins).padStart(2,'0')}分${String(secs).padStart(2,'0')}秒`;
  }
  calc();
  setInterval(calc, 1000);
})();

/* ========== 4. 节假日倒计时 ========== */
// 2026年法定节假日数据
const holidays = [
  { name: "元旦", date: "2026-01-01" },
  { name: "春节", date: "2026-02-17" },
  { name: "清明节", date: "2026-04-05" },
  { name: "劳动节", date: "2026-05-01" },
  { name: "端午节", date: "2026-06-19" },
  { name: "中秋节", date: "2026-09-26" },
  { name: "国庆节", date: "2026-10-01" }
];

// 计算下一个节假日
function getNextHoliday() {
  const now = new Date();
  const futureHolidays = holidays.filter(holiday => {
    const [y, m, d] = holiday.date.split('-').map(Number);
    const holidayDate = new Date(y, m - 1, d);
    return holidayDate >= now;
  });

  if (futureHolidays.length === 0) {
    const nextYear = now.getFullYear() + 1;
    return { name: `${nextYear}年元旦`, date: `${nextYear}-01-01` };
  }

  futureHolidays.sort((a, b) => {
    const [y1, m1, d1] = a.date.split('-').map(Number);
    const [y2, m2, d2] = b.date.split('-').map(Number);
    return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
  });

  // 核心修改：动态拼接年份
  const targetHoliday = futureHolidays[0];
  const holidayYear = targetHoliday.date.split('-')[0];
  return { 
    name: `${holidayYear}年${targetHoliday.name}`, 
    date: targetHoliday.date 
  };
}

// 格式化倒计时
function formatCountdown(targetDate) {
  const now = new Date();
  const diff = targetDate - now;
  if (diff <= 0) return "今天就是节假日啦！🎉";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${days}天${hours}时${minutes}分${seconds}秒`;
}

// 更新页面显示
function updateHolidayCountdown() {
  const nextHoliday = getNextHoliday();
  const targetDate = new Date(nextHoliday.date);
  const countdown = formatCountdown(targetDate);
  
  document.getElementById('holidayName').textContent = nextHoliday.name;
  document.getElementById('countdownNumbers').textContent = countdown;
}

// 初始化 + 每秒更新
updateHolidayCountdown();
setInterval(updateHolidayCountdown, 1000);


