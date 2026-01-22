        // 核心：等待DOM完全加载后执行，避免获取不到元素
        document.addEventListener('DOMContentLoaded', function() {
            const carousel = document.getElementById('carousel');
            const carouselList = document.getElementById('carouselList');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            // 如果存在 render 函数（由 js/data.js 提供），先渲染数据到 DOM
            if (typeof window.renderCarouselItems === 'function') {
                try { window.renderCarouselItems('carouselList'); } catch (e) { console.error(e); }
            }
            const items = document.querySelectorAll('.carousel-item');
            const itemNum = items.length;
            let currentIndex = 0;
            let itemWidth = 0;
            let timer = null;
            const AUTOPLAY_INTERVAL = 9000; // 自动轮播间隔（毫秒），可按需调整

            // 初始化/更新宽度：解决首次获取宽度为0的问题
            function initWidth() {
                itemWidth = carousel.offsetWidth;
                // 给每个卡片设置固定宽度，给列表设置总宽度
                items.forEach(item => item.style.width = itemWidth + 'px');
                carouselList.style.width = itemWidth * itemNum + 'px';
                // 重置初始位置
                carouselList.style.left = `-${currentIndex * itemWidth}px`;
            }

            // 切换卡片核心函数
            function switchCard(index) {
                if (index < 0) currentIndex = itemNum - 1;
                else if (index >= itemNum) currentIndex = 0;
                carouselList.style.left = `-${currentIndex * itemWidth}px`;
            }

            // 左右按钮点击事件
            nextBtn.addEventListener('click', () => {
                currentIndex++;
                switchCard(currentIndex);
                resetTimer();
            });
            prevBtn.addEventListener('click', () => {
                currentIndex--;
                switchCard(currentIndex);
                resetTimer();
            });
           // 自动轮播
            function autoPlay() {
                // 清除已有定时器以防重复创建
                if (timer) clearInterval(timer);
                timer = setInterval(() => {
                    currentIndex++;
                    switchCard(currentIndex);
                }, AUTOPLAY_INTERVAL);
            }
            // 重置定时器
            function resetTimer() {
                clearInterval(timer);
                autoPlay();
            }
            // 悬停暂停：mouseenter 停止，mouseleave 重新启动（使用 resetTimer 保证清理旧定时器）
            carousel.addEventListener('mouseenter', () => { if (timer) { clearInterval(timer); timer = null; } });
            carousel.addEventListener('mouseleave', () => { resetTimer(); });

            // 窗口大小改变时，重新计算宽度（适配窗口缩放）
            window.addEventListener('resize', initWidth);

            // 初始化执行
            initWidth();
            autoPlay();
        });
