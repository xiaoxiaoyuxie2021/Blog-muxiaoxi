// Carousel data: 把 iframe 源放在这里，便于维护
// 约定：window.carouselData 用于“视频轮播”（避免破坏现有 carousel.js 的调用）
window.carouselData = [
  { src: "https://player.bilibili.com/player.html?bvid=BV19CiEBaEUc&p=1&autoplay=false&danmaku=true&quality=1080p" },
  { src: "https://player.bilibili.com/player.html?bvid=BV1W8411n7Vb&p=1&autoplay=false&danmaku=true&quality=1080p" }
];

// 渲染函数：将 data 渲染到指定列表容器
window.renderCarouselItems = function(listId) {
	const list = document.getElementById(listId);
	if (!list || !Array.isArray(window.carouselData)) return;
	list.innerHTML = '';
	window.carouselData.forEach((item, idx) => {
		const div = document.createElement('div');
		div.className = 'carousel-item item' + (idx + 1);
		div.setAttribute('style', 'position:relative;width:100%;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;');
		const iframe = document.createElement('iframe');
		iframe.src = item.src;
		iframe.setAttribute('scrolling', 'no');
		iframe.setAttribute('frameborder', 'no');
		iframe.setAttribute('allowfullscreen', 'true');
		iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0;';
		div.appendChild(iframe);
		list.appendChild(div);
	});
};


// 网易云音乐播放器数据
window.musicPlayerData = [
    { 
        src: "https://music.163.com/outchain/player?type=2&id=2124462309&auto=1&height=66",
        width: "340",
        height: "100"
    }
	,
    { 
        src: "https://music.163.com/outchain/player?type=2&id=2668140501&auto=1&height=66",
        width: "340",
        height: "100"
    }
];

// 渲染函数：将音乐 data 渲染到指定列表容器（与视频轮播隔离，避免选择器互相影响）
window.renderMusicCarouselItems = function(listId) {
  const list = document.getElementById(listId);
  if (!list || !Array.isArray(window.musicPlayerData)) return;

  list.innerHTML = '';
  window.musicPlayerData.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'carousel-item music-item' + (idx + 1);
    div.style.cssText = 'position:relative;width:100%;height:' + (item.height || '86') + 'px;overflow:hidden;border-radius:8px;';

    const outer = document.createElement('div');
    outer.className = 'music-player-iframe-container';
    const inner = document.createElement('div');
    inner.className = 'yunmusic-iframe-transform';

    const iframe = document.createElement('iframe');
    iframe.src = item.src;
    iframe.setAttribute('scrolling', 'no');
    iframe.setAttribute('frameborder', 'no');
    iframe.setAttribute('allowfullscreen', 'true');
    iframe.width = item.width || '340';
    iframe.height = item.height || '86';
    iframe.style.cssText = 'border:0;';

    inner.appendChild(iframe);
    outer.appendChild(inner);
    div.appendChild(outer);
    list.appendChild(div);
  });
};

// 2. 通用渲染函数：支持渲染视频/音乐轮播
// 说明：历史原因 window.carouselData 是“数组”（视频），不是 {video:[],music:[]}。
window.renderCarousel = function(type, listId) {
	if (type === 'video') return window.renderCarouselItems(listId);
	if (type === 'music') return window.renderMusicCarouselItems(listId);
};

// 3. 通用轮播切换逻辑：支持多轮播实例
window.initCarousel = function(type, prevBtnId, nextBtnId, listId) {
  const prevBtn = document.getElementById(prevBtnId);
  const nextBtn = document.getElementById(nextBtnId);
  const carouselList = document.getElementById(listId);
  if (!carouselList) return;
  const items = carouselList.querySelectorAll('.carousel-item');
  let currentIndex = 0;

  if (!prevBtn || !nextBtn || items.length === 0) return;

  // 初始化显示第一个 item
  items.forEach((item, idx) => {
    item.style.display = idx === 0 ? 'block' : 'none';
  });

  // 切换函数
  const switchItem = (direction) => {
    items[currentIndex].style.display = 'none';
    currentIndex = direction === 'prev' 
      ? (currentIndex - 1 + items.length) % items.length 
      : (currentIndex + 1) % items.length;
    items[currentIndex].style.display = 'block';
  };

  // 绑定按钮事件
  prevBtn.addEventListener('click', () => switchItem('prev'));
  nextBtn.addEventListener('click', () => switchItem('next'));
};