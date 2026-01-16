/* eslint-disable no-console */
(function(){
    'use strict';

    // Adapted to `home.html` markup: support tutorialTip, tutorialClose, musicDisc, expandedPlayer, playerPlayBtn, playerCloseBtn

    function $(sel){ return document.querySelector(sel); }
    function bind(el, ev, fn){ if(el) el.addEventListener(ev, fn); }
    function hide(el){ if(el) el.style.display = 'none'; }
    function show(el){ if(el) el.style.display = 'block'; }
    // 给 range 元素设置填充样式，显示已播放进度
    function setRangeFill(rangeEl, pct){
        if(!rangeEl) return;
        const p = Math.max(0, Math.min(100, pct || 0));
        rangeEl.style.background = `linear-gradient(90deg, #f48fb1 ${p}%, #f0f0f0 ${p}%)`;
    }
    function fmtTime(s){ if(isNaN(s)||s===Infinity) return '00:00'; const m=Math.floor(s/60); const sec=Math.floor(s%60); return `${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`; }

    function init() {
        // Tutorial close
        const tutorialClose = document.getElementById('tutorialClose') || document.querySelector('.tutorial-close');
        const tutorialTip = document.getElementById('tutorialTip') || document.querySelector('.tutorial-tip');
        if(tutorialTip) {
            // 判断是否已查看教程（localStorage 标记），若已查看则隐藏
            try {
                const seen = localStorage.getItem('tutorialSeen');
                if (seen === '1') tutorialTip.classList.add('hidden');
                else tutorialTip.classList.remove('hidden');
            } catch (err) {
                // 如果 localStorage 不可用，保持当前显示状态（不阻塞）
            }
        }

        if(tutorialClose){
            bind(tutorialClose, 'click', function(e){
                if(tutorialTip) tutorialTip.classList.add('hidden');
                // 标记已查看，下次不再显示
                try { localStorage.setItem('tutorialSeen', '1'); } catch(err) {}
                if(e && e.stopPropagation) e.stopPropagation();
            });
        }

        // Music player elements
        const audio = document.getElementById('bgMusic');
        const musicDisc = document.getElementById('musicDisc');
        const expanded = document.getElementById('expandedPlayer');
        const playerClose = document.getElementById('playerCloseBtn');
        const playerPlay = document.getElementById('playerPlayBtn');
        const playerPlayIcon = document.getElementById('playerPlayIcon');
        const progressBar = document.getElementById('progressBar');
        const currentTime = document.getElementById('currentTime');
        const durationEl = document.getElementById('duration');

        // Toggle expanded player by clicking disc — use class to match CSS animation
        if(musicDisc && expanded){
            bind(musicDisc, 'click', function(e){
                expanded.classList.toggle('expanded');
                e && e.stopPropagation && e.stopPropagation();
            });
        }

        // Close button for expanded player — remove `expanded` class so toggle still works
        if(playerClose && expanded){
            bind(playerClose, 'click', function(){
                // 仅收起播放器视图，不影响音频播放或封面旋转
                expanded.classList.remove('expanded');
            });
        }

        if(!audio) return; // no audio -> minimal tutorial support already bound

        // Audio events
        bind(audio, 'loadedmetadata', function(){
            if (durationEl) durationEl.textContent = fmtTime(audio.duration);
            if (progressBar) { progressBar.value = 0; progressBar.max = 100; }
        });
        bind(audio, 'timeupdate', function(){
            if(progressBar) {
                const val = audio.duration ? (audio.currentTime / audio.duration * 100) : 0;
                progressBar.value = val;
                setRangeFill(progressBar, val);
            }
            if(currentTime) currentTime.textContent = fmtTime(audio.currentTime);
            // if duration still not shown but now available, update it
            if (durationEl && (durationEl.textContent === '00:00' || !durationEl.textContent)) {
                const d = audio.duration;
                if (!isNaN(d) && d > 0) durationEl.textContent = fmtTime(d);
            }
        });
        // If metadata already loaded before event binding, set duration immediately
        if (audio.readyState >= 1) {
            if (durationEl) durationEl.textContent = fmtTime(audio.duration);
            if (progressBar) { progressBar.value = 0; progressBar.max = 100; setRangeFill(progressBar, 0); }
        }
        // 同步初始 UI 状态：确保播放图标与 audio.paused 一致
        try {
            if (playerPlayIcon) {
                if (audio.paused) playerPlayIcon.className = 'fas fa-play';
                else playerPlayIcon.className = 'fas fa-pause';
            }
            if (musicDisc) {
                if (audio.paused) musicDisc.classList.remove('playing');
                else musicDisc.classList.add('playing');
            }
            if (progressBar && audio.duration) {
                progressBar.value = audio.duration ? (audio.currentTime / audio.duration * 100) : 0;
            }
        } catch (err) {
            // ignore
        }

        // Play/pause button
        if(playerPlay){
            bind(playerPlay, 'click', function(){
                if(audio.paused){
                    audio.play().catch(()=>{});
                    if(playerPlayIcon) playerPlayIcon.className = 'fas fa-pause';
                    if(musicDisc) musicDisc.classList.add('playing');
                } else {
                    audio.pause();
                    if(playerPlayIcon) playerPlayIcon.className = 'fas fa-play';
                    if(musicDisc) musicDisc.classList.remove('playing');
                }
            });
        }

        // Progress (input range)
        if(progressBar){
            bind(progressBar, 'input', function(e){
                const pct = Number(progressBar.value) || 0;
                setRangeFill(progressBar, pct);
                if(audio.duration) audio.currentTime = (pct / 100) * audio.duration;
            });
            // initial visual
            setRangeFill(progressBar, progressBar.value || 0);
        }
    }

    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();