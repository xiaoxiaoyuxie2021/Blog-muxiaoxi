/*设置移动端视口为 1920 逻辑画布（动态计算 initial-scale）*/
(function(){
  const pcWidth = 1920;
  const meta = document.querySelector('meta[name=viewport]');
  if (meta) {
    // 计算初始缩放，使得设备上看到的逻辑宽度为 1920
    const initialScale = Math.max( (screen && screen.width) ? (screen.width / pcWidth) : 1, 0.01 );
    meta.setAttribute('content', `width=1920,initial-scale=${initialScale},user-scalable=yes`);
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
