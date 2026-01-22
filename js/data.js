
// Carousel data: 把 iframe 源放在这里，便于维护
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
