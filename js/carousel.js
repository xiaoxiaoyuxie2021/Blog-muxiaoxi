        // 核心：等待DOM完全加载后执行，避免获取不到元素
        document.addEventListener('DOMContentLoaded', function() {
            function initHorizontalCarousel(opts) {
                const container = document.getElementById(opts.containerId);
                const list = document.getElementById(opts.listId);
                const prevBtn = document.getElementById(opts.prevBtnId);
                const nextBtn = document.getElementById(opts.nextBtnId);
                if (!container || !list || !prevBtn || !nextBtn) return;

                // 先渲染数据到 DOM
                if (typeof opts.render === 'function') {
                    try { opts.render(opts.listId); } catch (e) { console.error(e); }
                }

                // 注意：必须在渲染之后再取 items
                const items = list.querySelectorAll('.carousel-item');
                const itemNum = items.length;
                if (itemNum === 0) return;

                let currentIndex = 0;
                let itemWidth = 0;
                let timer = null;
                const autoplayInterval = typeof opts.autoplayInterval === 'number' ? opts.autoplayInterval : 0;

                function applyLayout() {
                    itemWidth = container.offsetWidth;
                    items.forEach(item => item.style.width = itemWidth + 'px');
                    list.style.width = (itemWidth * itemNum) + 'px';
                    list.style.left = `-${currentIndex * itemWidth}px`;
                }

                function normalizeIndex() {
                    if (currentIndex < 0) currentIndex = itemNum - 1;
                    else if (currentIndex >= itemNum) currentIndex = 0;
                }

                function goNext() {
                    currentIndex++;
                    normalizeIndex();
                    list.style.left = `-${currentIndex * itemWidth}px`;
                }
                function goPrev() {
                    currentIndex--;
                    normalizeIndex();
                    list.style.left = `-${currentIndex * itemWidth}px`;
                }

                function stopAutoplay() {
                    if (timer) {
                        clearInterval(timer);
                        timer = null;
                    }
                }
                function startAutoplay() {
                    stopAutoplay();
                    if (autoplayInterval > 0) {
                        timer = setInterval(goNext, autoplayInterval);
                    }
                }
                function resetAutoplay() {
                    if (autoplayInterval > 0) startAutoplay();
                }

                nextBtn.addEventListener('click', () => {
                    goNext();
                    resetAutoplay();
                });
                prevBtn.addEventListener('click', () => {
                    goPrev();
                    resetAutoplay();
                });

                container.addEventListener('mouseenter', stopAutoplay);
                container.addEventListener('mouseleave', startAutoplay);
                window.addEventListener('resize', applyLayout);

                applyLayout();
                startAutoplay();
            }

            // 视频轮播（保持原有自动轮播）
            initHorizontalCarousel({
                containerId: 'carousel',
                listId: 'carouselList',
                prevBtnId: 'prevBtn',
                nextBtnId: 'nextBtn',
                render: (listId) => {
                    if (typeof window.renderCarouselItems === 'function') window.renderCarouselItems(listId);
                },
                autoplayInterval: 9000
            });

            // 音乐轮播（默认不自动切换，避免突然切歌）
            initHorizontalCarousel({
                containerId: 'musicCarousel',
                listId: 'musicCarouselList',
                prevBtnId: 'musicPrevBtn',
                nextBtnId: 'musicNextBtn',
                render: (listId) => {
                    if (typeof window.renderMusicCarouselItems === 'function') window.renderMusicCarouselItems(listId);
                    else if (typeof window.renderCarousel === 'function') window.renderCarousel('music', listId);
                },
                autoplayInterval: 0
            });
        });
