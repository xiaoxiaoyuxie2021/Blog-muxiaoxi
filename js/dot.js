document.addEventListener('DOMContentLoaded', function () {
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
  let dragThreshold = 5; 

  const hasSeenTutorial = localStorage.getItem('hasSeenMusicTutorial');
  if (hasSeenTutorial) {
    tutorialTip.style.display = 'none';
  }

  if (bgMusic) {
    bgMusic.addEventListener('loadedmetadata', function () {
      updateDuration();
    });

    bgMusic.addEventListener('timeupdate', function () {
      updateProgress();
    });

    bgMusic.addEventListener('ended', function () {
      isPlaying = false;
      updatePlayButton();
      musicDisc.classList.remove('playing');
    });

    floatingMusicPlayer.addEventListener('mousedown', function (e) {
      if (isDragging) return;

      if (e.target.closest('.player-play-btn') || e.target.closest('.player-close')) {
        return;
      }

      dragStartX = e.clientX;
      dragStartY = e.clientY;
    });

    floatingMusicPlayer.addEventListener('mousedown', function (e) {
      if (isExpanded) return; 

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

      const finalX = Math.max(0, Math.min(x, maxX));
      const finalY = Math.max(0, Math.min(y, maxY));

      floatingMusicPlayer.style.right = (window.innerWidth - finalX - floatingMusicPlayer.offsetWidth) + 'px';
      floatingMusicPlayer.style.bottom = (window.innerHeight - finalY - floatingMusicPlayer.offsetHeight) + 'px';
    });

    document.addEventListener('mouseup', function (e) {
      const deltaX = Math.abs(e.clientX - dragStartX);
      const deltaY = Math.abs(e.clientY - dragStartY);
      const isSignificantDrag = deltaX > dragThreshold || deltaY > dragThreshold;

      if (isDragging) {
        isDragging = false;
        floatingMusicPlayer.style.cursor = 'pointer';
      }

      if (isSignificantDrag) return;

      if (!isExpanded && !isDragging) {
        if (!e.target.closest('.mini-play-btn') && !e.target.closest('.player-play-btn') && !e.target.closest('.player-close')) {
          expandPlayer();
        }
      } else if (isExpanded && e.target.closest('.expanded-player') && !e.target.closest('.player-play-btn') && !e.target.closest('.player-close')) {
        collapsePlayer();
      }
    });

    playerPlayBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      togglePlay();
    });

    playerCloseBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      collapsePlayer();
    });

    progressBar.addEventListener('input', function () {
      const time = bgMusic.duration * (progressBar.value / 100);
      bgMusic.currentTime = time;
    });

    tutorialClose.addEventListener('click', function () {
      tutorialTip.classList.add('hidden');
      localStorage.setItem('hasSeenMusicTutorial', 'true');
    });

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

    function updatePlayButton() {
      if (isPlaying) {
        miniPlayBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playerPlayIcon.className = 'fas fa-pause';
      } else {
        miniPlayBtn.innerHTML = '<i class="fas fa-play"></i>';
        playerPlayIcon.className = 'fas fa-play';
      }
    }

    function updateDiscAnimation() {
      if (isPlaying) {
        musicDisc.classList.add('playing');
      } else {
        musicDisc.classList.remove('playing');
      }
    }

    function expandPlayer() {
      isExpanded = true;
      expandedPlayer.classList.add('expanded');
      tutorialTip.style.display = 'none';
    }

    function collapsePlayer() {
      isExpanded = false;
      expandedPlayer.classList.remove('expanded');
    }

    function updateProgress() {
      if (bgMusic.duration) {
        const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
        progressBar.value = progress;
        currentTimeEl.textContent = formatTime(bgMusic.currentTime);
      }
    }

    function updateDuration() {
      durationEl.textContent = formatTime(bgMusic.duration);
    }

    function formatTime(seconds) {
      if (isNaN(seconds)) return '00:00';
      const min = Math.floor(seconds / 60);
      const sec = Math.floor(seconds % 60);
      return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
  }
  });