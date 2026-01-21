/*设置移动端视口*/
(function(){
  const pcWidth = 1920;                    
  const scale = screen.width / pcWidth;    
  const meta = document.querySelector('meta[name=viewport]');
  if (meta) {
    meta.setAttribute('content',
      `width=${pcWidth},initial-scale=${scale},minimum-scale=${scale},maximum-scale=${scale},user-scalable=no`);
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
