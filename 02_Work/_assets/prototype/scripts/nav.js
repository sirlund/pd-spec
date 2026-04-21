// Keyboard navigation across v3 screens.
// ←/→ : prev/next   Esc : back to index   Home: splash
(function () {
  const order = [
    '/screens/v3/00-splash.html',
    '/screens/v3/01-landing.html',
    '/screens/v3/02-pool.html?state=low',
    '/screens/v3/02-pool.html?state=mid',
    '/screens/v3/02-pool.html?state=complete',
    '/screens/v3/03-game.html',
    '/screens/v3/04-winner.html',
    '/screens/v3/05-multiskin.html',
    '/screens/v3/05-multiskin.html?bare=1',
  ];

  function currentIndex() {
    const path = location.pathname;
    const search = location.search;
    const here = path + search;
    for (let i = 0; i < order.length; i++) {
      if (here.endsWith(order[i])) return i;
    }
    for (let i = 0; i < order.length; i++) {
      if (path.endsWith(order[i].split('?')[0]) && !order[i].includes('?')) return i;
    }
    return -1;
  }

  function go(delta) {
    const i = currentIndex();
    if (i === -1) { location.href = order[0]; return; }
    const next = Math.max(0, Math.min(order.length - 1, i + delta));
    if (next !== i) location.href = order[next];
  }

  document.addEventListener('keydown', function (e) {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); go(1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(-1); }
    else if (e.key === 'Escape') { location.href = '/'; }
    else if (e.key === 'Home') { location.href = order[0]; }
  });

  // Build floating nav with DOM APIs (no innerHTML)
  const hint = document.createElement('div');
  hint.className = 'kb-nav';

  const prev = document.createElement('button');
  prev.className = 'kb-nav-btn prev';
  prev.setAttribute('aria-label', 'Anterior');
  prev.textContent = '‹';

  const label = document.createElement('span');
  label.className = 'kb-nav-label';
  label.textContent = '← → navega · Esc = index';

  const next = document.createElement('button');
  next.className = 'kb-nav-btn next';
  next.setAttribute('aria-label', 'Siguiente');
  next.textContent = '›';

  hint.appendChild(prev);
  hint.appendChild(label);
  hint.appendChild(next);
  document.body.appendChild(hint);

  prev.addEventListener('click', () => go(-1));
  next.addEventListener('click', () => go(1));

  const style = document.createElement('style');
  style.textContent = `
    .kb-nav {
      position: fixed; bottom: 16px; left: 50%;
      transform: translateX(-50%);
      display: inline-flex; align-items: center; gap: 10px;
      padding: 8px 14px;
      background: rgba(10, 5, 20, 0.85);
      border: 1px solid rgba(204, 0, 255, 0.3);
      border-radius: 100px;
      backdrop-filter: blur(8px);
      z-index: 10000;
      font-family: "Outfit", sans-serif;
      opacity: 0.35;
      transition: opacity 0.25s ease;
    }
    .kb-nav:hover { opacity: 1; }
    .kb-nav-label {
      font-size: 10px; letter-spacing: 2px; text-transform: uppercase;
      color: #9896AA;
    }
    .kb-nav-btn {
      width: 28px; height: 28px;
      background: transparent;
      border: 1px solid rgba(204, 0, 255, 0.4);
      border-radius: 50%;
      color: #FF6AD0;
      font-size: 20px; line-height: 0;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      padding-bottom: 3px;
    }
    .kb-nav-btn:hover {
      background: rgba(204, 0, 255, 0.15);
      box-shadow: 0 0 10px rgba(204, 0, 255, 0.3);
    }
    body.bare .kb-nav { display: none; }
  `;
  document.head.appendChild(style);
})();
