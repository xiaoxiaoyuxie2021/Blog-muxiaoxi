// 深色模式脚本：基于 URL hash(#dark) 或 localStorage 保存用户偏好
(function(){
  function applyDark(dark){
    if(dark) document.documentElement.setAttribute('data-theme','dark');
    else document.documentElement.removeAttribute('data-theme');
    try{ localStorage.setItem('theme', dark ? 'dark' : 'light'); }catch(e){}
  }

  function isDark(){ return document.documentElement.getAttribute('data-theme') === 'dark'; }

  function updateThemeButtons(){
    var btns = document.querySelectorAll('.btn-theme-toggle');
    btns.forEach(function(btn){
      var darkLabel = btn.dataset.themeLabelDark || '深色版';
      var lightLabel = btn.dataset.themeLabelLight || '浅色版';
      btn.textContent = isDark() ? lightLabel : darkLabel;
    });
  }

  function getPreferred(){
    try{
      if(location.hash === '#dark') return true;
      var s = localStorage.getItem('theme');
      if(s === 'dark') return true;
      return false;
    }catch(e){
      return location.hash === '#dark';
    }
  }

  window.addEventListener('DOMContentLoaded', function(){
    applyDark(getPreferred());
    updateThemeButtons();
  });

  window.addEventListener('hashchange', function(){
    applyDark(getPreferred());
    updateThemeButtons();
  });

  // 当 switchto 弹窗每次打开且内容插入 DOM 后，会触发该事件，需更新按钮显示
  document.addEventListener('switchto-opened', function(){
    // 等一帧以确保插入完成（防止极端 race）
    requestAnimationFrame(updateThemeButtons);
  });

  // 小工具：在控制台提供切换方法，方便调试
  window.__toggleDark = function(){
    var cur = isDark();
    applyDark(!cur);
    updateThemeButtons();
  };

  // 事件委托：处理动态插入的开关按钮
  document.addEventListener('click', function(e){
    var t = e.target.closest && e.target.closest('.btn-theme-toggle');
    if(!t) return;
    e.preventDefault();
    var cur = isDark();
    applyDark(!cur);
    updateThemeButtons();
  });
})();
