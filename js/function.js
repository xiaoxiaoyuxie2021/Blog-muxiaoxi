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

/* 侧边栏开合 */
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebarClose = document.getElementById('sidebarClose');

if (sidebar && sidebarOverlay && sidebarToggle && sidebarClose) {
  const openSidebar = () => {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('show');
  };

  const closeSidebar = () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('show');
  };

  sidebarToggle.addEventListener('click', openSidebar);
  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  document.querySelectorAll('.sidebar-links a').forEach((link) => {
    link.addEventListener('click', closeSidebar);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeSidebar();
    }
  });
}

/* 分享弹窗 */
const shareBackdrop = document.getElementById('shareBackdrop');
const shareModal = document.getElementById('shareModal');
const shareClose = document.getElementById('shareClose');
const shareTriggers = document.querySelectorAll('#btnShare');
const shareCopy = document.getElementById('shareCopy');
const shareWeibo = document.getElementById('shareWeibo');
const shareQQ = document.getElementById('shareQQ');
const shareTwitter = document.getElementById('shareTwitter');

const setShareLinks = () => {
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title || '分享给你');
  if (shareWeibo) shareWeibo.href = `https://service.weibo.com/share/share.php?url=${url}&title=${title}`;
  if (shareQQ) shareQQ.href = `https://connect.qq.com/widget/shareqq/index.html?url=${url}&title=${title}`;
  if (shareTwitter) shareTwitter.href = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
};
let openShare;
let closeShare;

if (shareBackdrop && shareModal && shareClose) {
  setShareLinks();

  openShare = () => {
    shareBackdrop.classList.add('show');
    shareModal.classList.add('show');
  };

  closeShare = () => {
    shareBackdrop.classList.remove('show');
    shareModal.classList.remove('show');
  };

  if (shareTriggers.length) {
    shareTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        openShare();
      });
    });
  }

  shareClose.addEventListener('click', closeShare);
  shareBackdrop.addEventListener('click', closeShare);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeShare();
  });

  if (shareCopy) {
    shareCopy.addEventListener('click', async (e) => {
      e.preventDefault();
      try {
        await navigator.clipboard.writeText(window.location.href);
        shareCopy.innerHTML = '<i class="fas fa-check"></i><span>已复制</span>';
        setTimeout(() => {
          shareCopy.innerHTML = '<i class="fas fa-link"></i><span>复制链接</span>';
        }, 1200);
      } catch (err) {
        console.error('复制失败', err);
        shareCopy.innerHTML = '<i class="fas fa-times"></i><span>复制失败</span>';
        setTimeout(() => {
          shareCopy.innerHTML = '<i class="fas fa-link"></i><span>复制链接</span>';
        }, 1400);
      }
    });
  }
}

/* 留言区输入字数限制 */
const commentBox = document.querySelector('.comment-box');
const commentBubble = document.getElementById('commentBubble');

if (commentBox) {
  const maxChars = Math.max(parseInt(commentBox.dataset.maxChars || '300', 10) || 300, 1);
  let lastValidHTML = commentBox.innerHTML;
  let warnLock = false;
  let bubbleTimer;

  const placeCaretAtEnd = (el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const warn = () => {
    if (warnLock) return;
    warnLock = true;
    if (commentBubble) {
      commentBubble.textContent = `最多只能输入 ${maxChars} 字`;
      commentBubble.classList.add('show');
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => {
        commentBubble.classList.remove('show');
      }, 1400);
    }
    setTimeout(() => {
      warnLock = false;
    }, 500);
  };

  commentBox.addEventListener('beforeinput', (e) => {
    if (e.inputType === 'deleteContentBackward' || e.inputType === 'deleteContentForward' || e.inputType === 'insertParagraph') {
      return;
    }
    const text = commentBox.innerText || '';
    if (text.length >= maxChars) {
      e.preventDefault();
      warn();
    }
  });

  commentBox.addEventListener('input', () => {
    const text = commentBox.innerText || '';
    if (text.length > maxChars) {
      commentBox.innerHTML = lastValidHTML;
      placeCaretAtEnd(commentBox);
      warn();
      return;
    }
    lastValidHTML = commentBox.innerHTML;
  });
}
