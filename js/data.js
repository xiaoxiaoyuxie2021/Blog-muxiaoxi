// 博客首页哔哩哔哩iframe视频轮播数据
// 约定：window.carouselData 用于“视频轮播”（避免破坏现有 carousel.js 的调用）
window.carouselData = [
  { src: "https://player.bilibili.com/player.html?bvid=BV19CiEBaEUc&p=1&autoplay=false&danmaku=true&quality=1080p" },
  { src: "https://player.bilibili.com/player.html?bvid=BV1W8411n7Vb&p=1&autoplay=false&danmaku=true&quality=1080p" },

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


// 博客首页网易云音乐播放器轮播数据
window.musicPlayerData = [
    { 
        src: "https://music.163.com/outchain/player?type=2&id=2111993053&auto=1&height=66",
        width: "340",
        height: "100"
    }
	,
    { 
        src: "https://music.163.com/outchain/player?type=2&id=2668140501&auto=1&height=66",
        width: "340",
        height: "100"
    }
	,
    { 
        src: "https://music.163.com/outchain/player?type=2&id=2702706005&auto=1&height=66",
        width: "340",
        height: "100"
    }
    ,
    { 
        src: "https://music.163.com/outchain/player?type=2&id=2093279062&auto=1&height=66",
        width: "340",
        height: "100"
    }
	,
    { 
        src: "https://music.163.com/outchain/player?type=2&id=1461071138&auto=1&height=66",
        width: "340",
        height: "100"
    }
	,
    { 
        src: "https://music.163.com/outchain/player?type=2&id=1963053471&auto=1&height=66",
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

/*文章列表数据*/
window.articles = [
    {
        id: "mua1",
        title: "制作博客网站的一些心得",
        desc: "为什么会选择制作博客网站？这是因为我希望有一个属于自己的空间，分享我的兴趣和见解，同时也能记录生活中的点滴。",
        time: "2025-12-25",
        cover: "https://picsum.photos/180/120?random=1", // 占位图，替换为自己的封面
        banner: "https://picsum.photos/1080/400?random=10", // 可选文章头图
        link: "article-detail.html?id=mua1",
        meta: {
            views: 0,
            comments: 0
        },
        content: [
            "为什么会选择制作博客网站？这是因为我希望有一个属于自己的空间，分享我的兴趣和见解，同时也能记录生活中的点滴。"
        ]
    }
];

// 根据 id 获取文章（id 支持 mua1/mua2 等字符串）
window.getArticleById = function(id) {
    if (!Array.isArray(window.articles)) return undefined;
    return window.articles.find((item) => String(item.id) === String(id));
};

// 文章列表渲染（仅当存在 #articleList 时执行）
window.renderArticleList = function() {
    const articleList = document.getElementById('articleList');
    if (!articleList || !Array.isArray(window.articles)) return;

    let html = '';
    window.articles.forEach((article) => {
        const link = article.link || `article-detail.html?id=${article.id}`;
        html += `
            <div class="article-card">
                <img src="${article.cover}" alt="${article.title}" class="article-cover">
                <div class="article-content">
                    <h3 class="article-title-A"><a href="${link}">${article.title}</a></h3>
                    <p class="article-desc">${article.desc}</p>
                    <p class="article-meta">发布时间：${article.time}</p>
                </div>
            </div>
        `;
    });

    articleList.innerHTML = html;
};

// 文章详情渲染（仅当存在 #articleContent 时执行）
window.renderArticleDetail = function() {
    const contentEl = document.getElementById('articleContent');
    const titleEl = document.getElementById('articleTitle');
    const dateEl = document.getElementById('articleDate');
    const viewsEl = document.getElementById('articleViews');
    const commentsEl = document.getElementById('articleComments');
    const bannerWrap = document.getElementById('articleBanner');
    const bannerImg = document.getElementById('articleBannerImg');
    if (!contentEl || !titleEl) return;

    const path = window.location.pathname.split('/').filter(Boolean);
    const query = new URLSearchParams(window.location.search);
    const idFromQuery = query.get('id') || query.get('slug');
    const rawId = path.length ? path[path.length - 1] : '';
    const id = idFromQuery || rawId.replace('.html', '');
    const article = window.getArticleById(id);

    if (!article) {
        titleEl.textContent = '文章不存在';
        contentEl.innerHTML = '<p>抱歉，没有找到对应的文章内容。</p>';
        if (dateEl) dateEl.textContent = '';
        if (viewsEl) viewsEl.textContent = '0';
        if (commentsEl) commentsEl.textContent = '0';
        if (bannerWrap) bannerWrap.style.display = 'none';
        return;
    }

    titleEl.textContent = article.title;
    if (dateEl) dateEl.textContent = article.time || '';
    if (viewsEl) viewsEl.textContent = article.meta?.views ?? 0;
    if (commentsEl) commentsEl.textContent = article.meta?.comments ?? 0;

    if (bannerWrap && bannerImg) {
        if (article.banner) {
            bannerImg.src = article.banner;
            bannerImg.alt = article.title;
            bannerWrap.style.display = 'block';
        } else {
            bannerWrap.style.display = 'none';
        }
    }

    contentEl.innerHTML = '';
    if (Array.isArray(article.content)) {
        article.content.forEach((block) => {
            if (typeof block === 'string') {
                const p = document.createElement('p');
                p.textContent = block;
                contentEl.appendChild(p);
                return;
            }
            if (block?.type === 'h2') {
                const h2 = document.createElement('h2');
                h2.textContent = block.text || '';
                contentEl.appendChild(h2);
                return;
            }
            if (block?.type === 'html') {
                const wrapper = document.createElement('div');
                wrapper.innerHTML = block.html || '';
                contentEl.appendChild(wrapper);
            }
        });
    }
};

// 自动渲染：根据页面存在的占位符决定执行哪些渲染
document.addEventListener('DOMContentLoaded', () => {
    window.renderArticleList();
    window.renderArticleDetail();
});

