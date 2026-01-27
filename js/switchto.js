/*切换主题弹窗逻辑*/
(function () {
    const tpl = document.getElementById('switchto-template');
    const btn = document.getElementById('btnSwitchTo');
    if (!btn || !tpl) return;
    btn.addEventListener('click', function () {
        if (!window.switchTo || !window.switchTo.open) { location.href = 'home-simple.html'; return; }
        const m = window.switchTo.open({ dismissible: true });
        const node = tpl.content.cloneNode(true);
        m.dialog.innerHTML = '';
        m.dialog.appendChild(node);
        // 通知其他脚本：switchto 弹窗已打开（内容已插入 DOM），便于更新动态按钮文字
        try{ document.dispatchEvent(new CustomEvent('switchto-opened')); }catch(e){}
        const cancel = m.dialog.querySelector('.modal-cancel');
        const confirm = m.dialog.querySelector('.modal-confirm');
        const closeBtn = m.dialog.querySelector('.switchto-close');
        if (cancel) cancel.addEventListener('click', function (e) { e && e.stopPropagation && e.stopPropagation(); m.close(); });
        if (confirm) confirm.addEventListener('click', function (e) { e && e.stopPropagation && e.stopPropagation(); location.href = 'home-simple.html'; });
        if (closeBtn) closeBtn.addEventListener('click', function (e) { e && e.stopPropagation && e.stopPropagation(); m.close(); });
        (confirm || cancel) && (confirm || cancel).focus();
    });
})();

(function () {
    'use strict';

    function createModal() {
        const overlay = document.createElement('div'); overlay.className = 'switchto-overlay';
        const dialog = document.createElement('div'); dialog.className = 'switchto-dialog switchto-blank';
        overlay.appendChild(dialog);
        return { overlay, dialog };
    }

    function open(opts) {
        ensureStyles();
        opts = opts || {};
        const modal = createModal();
        document.body.appendChild(modal.overlay);
        document.documentElement.classList.add('switchto-noscroll');

        // 延迟添加 show 以触发 CSS 动画
        requestAnimationFrame(() => {
            modal.overlay.classList.add('show');
            modal.dialog.classList.add('show');
        });

        function cleanup() {
            document.removeEventListener('keydown', keyHandler);
            modal.overlay.removeEventListener('click', overlayClick);
        }

        function close() {
            try { document.documentElement.classList.remove('switchto-noscroll'); } catch (e) { }
            modal.overlay.classList.remove('show');
            modal.dialog.classList.remove('show');
            setTimeout(() => {
                if (modal.overlay && modal.overlay.parentNode) modal.overlay.parentNode.removeChild(modal.overlay);
            }, 200);
            cleanup();
            if (typeof opts.onClose === 'function') opts.onClose();
        }

        function keyHandler(e) { if (e.key === 'Escape') { e.preventDefault(); close(); } }
        document.addEventListener('keydown', keyHandler);

        function overlayClick(e) { if (e.target === modal.overlay && opts.dismissible !== false) close(); }
        modal.overlay.addEventListener('click', overlayClick);

        return { overlay: modal.overlay, dialog: modal.dialog, close };
    }

    window.switchTo = { open };

    // inject minimal styles so modal shows even without external CSS
    function ensureStyles() {
        if (document.getElementById('switchto-styles')) return;
        const css = '\n.switchto-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);backdrop-filter:blur(2px);opacity:0;pointer-events:none;display:flex;align-items:center;justify-content:center;transition:opacity 0.2s ease;z-index:2100}\n.switchto-overlay.show{opacity:1;pointer-events:auto}\n.switchto-dialog{background:rgba(255,255,255,0.98);border-radius:14px;max-width:86vw;width:380px;box-shadow:0 16px 36px rgba(0,0,0,0.18);overflow:hidden;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial;padding:18px;opacity:0;transform:scale(0.96);transition:opacity 0.2s ease,transform 0.2s ease;z-index:2101;position:relative}\n.switchto-dialog.show{opacity:1;transform:scale(1)}\n.switchto-blank{padding:0}\n.switchto-noscroll{overflow:hidden}\n.switchto-btn{padding:8px 12px;border-radius:8px;border:0;cursor:pointer;font-weight:600}\n.switchto-dialog .modal-content{padding:16px}\n.switchto-dialog h3{margin:0 0 8px}\n.switchto-close{position:absolute;top:10px;right:10px;background:none;border:none;cursor:pointer;font-size:1.05rem;color:#444;padding:6px;border-radius:6px;transition:background 0.15s ease,color 0.15s ease}\n.switchto-close:hover{background:rgba(0,0,0,0.06);color:#000}\n@media (prefers-color-scheme: dark){.switchto-dialog{background:rgba(25,25,25,0.96);box-shadow:0 16px 36px rgba(0,0,0,0.35);color:#f2f2f2}.switchto-overlay{background:rgba(0,0,0,0.55)}.switchto-close{color:#ddd}.switchto-close:hover{background:rgba(255,255,255,0.08);color:#fff}}\n';
        const s = document.createElement('style'); s.id = 'switchto-styles'; s.textContent = css; document.head.appendChild(s);
    }
})();
/*卡片切换逻辑*/

