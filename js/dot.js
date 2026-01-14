// 音乐播放器功能
document.addEventListener('DOMContentLoaded', function () {
  // 音乐播放器相关元素
  const bgMusic = document.getElementById('bgMusic');
  const floatingMusicPlayer = document.getElementById('floatingMusicPlayer');
  const musicDisc = document.getElementById('musicDisc');
  const miniPlayBtn = document.getElementById('miniPlayBtn');
  const expandedPlayer = document.getElementById('expandedPlayer');
  const playerPlayBtn = document.getElementById('playerPlayBtn');
  const playerPlayIcon = document.getElementById('playerPlayIcon');
  const playerCloseBtn = document.getElementById('playerCloseBtn');
  const progressBar = document.getElementById('progressBar');
  const currentTimeEl = document.getElementById('currentTime');
  const durationEl = document.getElementById('duration');
  const tutorialTip = document.getElementById('tutorialTip');
  const tutorialClose = document.getElementById('tutorialClose');

  let isPlaying = false;
  let isExpanded = false;
  let isDragging = false;
  let offsetX = 0, offsetY = 0;
  let dragStartX = 0, dragStartY = 0;
  let dragThreshold = 5; // 拖动阈值，防止轻微移动也被认为是拖动

  // 检查是否显示过教程提示
  const hasSeenTutorial = localStorage.getItem('hasSeenMusicTutorial');
  if (hasSeenTutorial) {
    tutorialTip.style.display = 'none';
  }

  // 音乐播放器功能
  if (bgMusic) {
    // 音乐加载完成后更新时长
    bgMusic.addEventListener('loadedmetadata', function () {
      updateDuration();
    });

    // 更新播放进度
    bgMusic.addEventListener('timeupdate', function () {
      updateProgress();
    });

    // 音乐播放结束后重置
    bgMusic.addEventListener('ended', function () {
      isPlaying = false;
      updatePlayButton();
      musicDisc.classList.remove('playing');
    });

    // 播放器展开/收起 - 使用mousedown事件而不是click
    floatingMusicPlayer.addEventListener('mousedown', function (e) {
      // 如果已经在拖动，则不触发展开/收起
      if (isDragging) return;

      // 如果是点击播放/暂停或关闭按钮，不触发展开/收起
      if (e.target.closest('.player-play-btn') || e.target.closest('.player-close')) {
        return;
      }

      // 记录点击位置，用于判断是否为拖动
      dragStartX = e.clientX;
      dragStartY = e.clientY;
    });

    // 鼠标按下事件（用于拖动检测）
    floatingMusicPlayer.addEventListener('mousedown', function (e) {
      if (isExpanded) return; // 展开时不拖动

      isDragging = true;
      const rect = floatingMusicPlayer.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      floatingMusicPlayer.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging || isExpanded) return;

      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      const maxX = window.innerWidth - floatingMusicPlayer.offsetWidth;
      const maxY = window.innerHeight - floatingMusicPlayer.offsetHeight;

      // 限制在窗口范围内
      const finalX = Math.max(0, Math.min(x, maxX));
      const finalY = Math.max(0, Math.min(y, maxY));

      floatingMusicPlayer.style.right = (window.innerWidth - finalX - floatingMusicPlayer.offsetWidth) + 'px';
      floatingMusicPlayer.style.bottom = (window.innerHeight - finalY - floatingMusicPlayer.offsetHeight) + 'px';
    });

    document.addEventListener('mouseup', function (e) {
      // 检查是否发生了显著拖动
      const deltaX = Math.abs(e.clientX - dragStartX);
      const deltaY = Math.abs(e.clientY - dragStartY);
      const isSignificantDrag = deltaX > dragThreshold || deltaY > dragThreshold;

      if (isDragging) {
        isDragging = false;
        floatingMusicPlayer.style.cursor = 'pointer';
      }

      // 如果发生了显著拖动，则不触发展开/收起
      if (isSignificantDrag) return;

      // 只有在非拖动状态下才处理展开/收起逻辑
      if (!isExpanded && !isDragging) {
        // 检查点击的目标是否是按钮，如果是则不展开
        if (!e.target.closest('.mini-play-btn') && !e.target.closest('.player-play-btn') && !e.target.closest('.player-close')) {
          expandPlayer();
        }
      } else if (isExpanded && e.target.closest('.expanded-player') && !e.target.closest('.player-play-btn') && !e.target.closest('.player-close')) {
        // 如果在展开状态下点击展开区域，则收起（除了按钮区域）
        collapsePlayer();
      }
    });

    // 展开播放器中的播放按钮
    playerPlayBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePlay();
    });

    // 关闭展开的播放器
    playerCloseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      collapsePlayer();
    });

    // 进度条拖动
    progressBar.addEventListener('input', function () {
      const time = bgMusic.duration * (progressBar.value / 100);
      bgMusic.currentTime = time;
    });

    // 教程提示关闭
    tutorialClose.addEventListener('click', function () {
      tutorialTip.classList.add('hidden');
      localStorage.setItem('hasSeenMusicTutorial', 'true');
    });

    // 播放/暂停切换
    function togglePlay() {
      if (isPlaying) {
        bgMusic.pause();
      } else {
        bgMusic.play().catch(e => console.log('播放失败:', e));
      }
      isPlaying = !isPlaying;
      updatePlayButton();
      updateDiscAnimation();
    }

    // 更新播放按钮图标
    function updatePlayButton() {
      if (isPlaying) {
        miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playerPlayIcon.className = 'fas fa-pause';
      } else {
        miniPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        playerPlayIcon.className = 'fas fa-play';
      }
    }

    // 更新圆盘旋转动画
    function updateDiscAnimation() {
      if (isPlaying) {
        musicDisc.classList.add('playing');
      } else {
        musicDisc.classList.remove('playing');
      }
    }

    // 展开播放器
    function expandPlayer() {
      isExpanded = true;
      expandedPlayer.classList.add('expanded');
      // 隐藏教程提示
      tutorialTip.style.display = 'none';
    }

    // 收起播放器
    function collapsePlayer() {
      isExpanded = false;
      expandedPlayer.classList.remove('expanded');
    }

    // 更新播放进度
    function updateProgress() {
      if (bgMusic.duration) {
        const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
        progressBar.value = progress;
        currentTimeEl.textContent = formatTime(bgMusic.currentTime);
      }
    }

    // 更新音乐总时长
    function updateDuration() {
      durationEl.textContent = formatTime(bgMusic.duration);
    }

    // 格式化时间显示
    function formatTime(seconds) {
      if (isNaN(seconds)) return '00:00';
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
  }
});