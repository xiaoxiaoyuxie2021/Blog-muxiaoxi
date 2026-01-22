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
        if (cancel) cancel.addEventListener('click', function (e) { e && e.stopPropagation && e.stopPropagation(); m.close(); });
        if (confirm) confirm.addEventListener('click', function (e) { e && e.stopPropagation && e.stopPropagation(); location.href = 'home-simple.html'; });
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

        function cleanup() {
            document.removeEventListener('keydown', keyHandler);
            modal.overlay.removeEventListener('click', overlayClick);
        }

        function close() {
            try { document.documentElement.classList.remove('switchto-noscroll'); } catch (e) { }
            if (modal.overlay && modal.overlay.parentNode) modal.overlay.parentNode.removeChild(modal.overlay);
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
        const css = '\n.switchto-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center;z-index:9999}\n.switchto-dialog{background:#fff;border-radius:10px;max-width:92%;width:420px;box-shadow:0 12px 40px rgba(0,0,0,0.25);overflow:hidden;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial;padding:0}\n.switchto-blank{padding:0}\n.switchto-noscroll{overflow:hidden}\n.switchto-btn{padding:8px 12px;border-radius:8px;border:0;cursor:pointer;font-weight:600}\n.switchto-dialog .modal-content{padding:16px}\n.switchto-dialog h3{margin:0 0 8px}\n';
        const s = document.createElement('style'); s.id = 'switchto-styles'; s.textContent = css; document.head.appendChild(s);
    }
})();
/*卡片切换逻辑*/

