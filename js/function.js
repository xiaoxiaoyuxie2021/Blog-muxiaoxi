/*设置移动端视口*/
(function(){
  const pcWidth = 1920;                    
  const scale = screen.width / pcWidth;    
  const meta = document.querySelector('meta[name=viewport]');
  if (meta) {
    meta.setAttribute('content', `width=1920,initial-scale=1,user-scalable=yes`);
  }
})();

/*返回顶部按钮功能*/
const btnBackToTop = document.getElementById('btnBackToTop');

if (btnBackToTop) {
  /*向上滚动按钮功能*/
  const scrollContainer = document.querySelector('.glass') || window;

  const checkScroll = () => {
    const scrolled = (scrollContainer === window) ? window.scrollY : scrollContainer.scrollTop;
    if (scrolled > 300) {
      btnBackToTop.classList.add('btn-backtotop-show');
    } else {
      btnBackToTop.classList.remove('btn-backtotop-show');
    }
  };

  // 监听正确的滚动容器
  scrollContainer.addEventListener('scroll', checkScroll);
  // 页面加载时立即检查一次（防止刷新在中间位置）
  checkScroll();

  // 点击按钮回到顶部（对 .glass 使用平滑滚动）
  btnBackToTop.addEventListener('click', () => {
    if (scrollContainer === window) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

/* 按 1920 画布宽度缩放 .glass 容器（保持内部坐标为 1920，不改变布局） */
(function(){
  const DESKTOP_WIDTH = 1920;
  let resizeTimer = null;

  function applyDesktopScale(){
    const container = document.querySelector('.glass');
    if (!container) return;

    // 确保容器基准宽度为 1920px
    container.style.width = DESKTOP_WIDTH + 'px';
    container.style.transformOrigin = '0 0';

    // 计算缩放比：视口宽度 / 1920
    const viewportW = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const scale = viewportW / DESKTOP_WIDTH;

    // 应用缩放（允许放大或缩小），视觉上保持与桌面相同的逻辑画布尺寸
    container.style.transform = `scale(${scale})`;

    // 修正文档高度以配合 transform 缩放后的可滚动区域
    // 先清除可能的 inline height 再测量真实高度
    container.style.height = '';
    const contentHeight = container.getBoundingClientRect().height;
    const scaledHeight = contentHeight * scale;
    document.documentElement.style.height = scaledHeight + 'px';
    document.body.style.height = scaledHeight + 'px';
  }

  // 首次加载与窗口尺寸变化时应用，使用防抖减少重排
  window.addEventListener('load', applyDesktopScale);
  window.addEventListener('orientationchange', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(applyDesktopScale, 120); });
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(applyDesktopScale, 80); });

  // 如果需要，也可以暴露函数供调试使用：window.applyDesktopScale()
  window.applyDesktopScale = applyDesktopScale;
})();
