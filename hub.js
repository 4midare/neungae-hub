// neungae.com 허브 — 비 애니메이션 + 서브도메인 카드
(function () {
  // ---------- 1) 사진이 있으면 배경으로 ----------
  var hero = document.getElementById('hero');
  var probe = new Image();
  probe.onload = function () { hero.classList.add('has-photo'); };
  probe.src = 'img/hero.jpg';

  // ---------- 2) 는개: 가늘고 촘촘한 비 (canvas) ----------
  var canvas = document.getElementById('rain');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (canvas && !reduce) {
    var ctx = canvas.getContext('2d');
    var drops = [];
    var W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = Math.round((W * H) / 2600);          // 화면 크기에 비례
      drops = [];
      for (var i = 0; i < count; i++) drops.push(make(true));
    }
    function make(anywhere) {
      var z = 0.4 + Math.random() * 0.6;                 // 깊이(가늘고 느린 것 ~ 굵고 빠른 것)
      return {
        x: Math.random() * (W + 40) - 20,
        y: anywhere ? Math.random() * H : -20 - Math.random() * 60,
        len: 8 + z * 14,
        speed: 2.2 + z * 4.5,
        drift: 0.35 + z * 0.3,                            // 살짝 비껴 내리는 바람
        alpha: 0.18 + z * 0.3,
        w: z > 0.8 ? 1.1 : 0.7
      };
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      for (var i = 0; i < drops.length; i++) {
        var d = drops[i];
        ctx.strokeStyle = 'rgba(220,235,245,' + d.alpha + ')';
        ctx.lineWidth = d.w;
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x - d.drift * d.len * 0.25, d.y + d.len);
        ctx.stroke();
        d.y += d.speed; d.x -= d.drift;
        if (d.y > H + 20 || d.x < -30) drops[i] = make(false);
      }
      requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener('resize', resize);
    frame();
  }

  // ---------- 3) 서브도메인 카드 ----------
  var grid = document.getElementById('projects');
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function card(p) {
    var live = p.status !== 'soon' && p.host;
    var badge = '<span class="status ' + (live ? 'live' : 'soon') + '">' + (live ? '운영 중' : '준비 중') + '</span>';
    var inner =
      '<div class="top"><div class="emoji">' + esc(p.emoji || '🌧️') + '</div>' +
      '<div><div class="name">' + esc(p.name) + '</div>' +
      (p.host ? '<div class="host">' + esc(p.host) + '</div>' : '') + '</div>' + badge + '</div>' +
      (p.desc ? '<div class="desc">' + esc(p.desc) + '</div>' : '');
    if (live) {
      return '<a class="card" href="https://' + esc(p.host) + '/" target="_blank" rel="noopener">' + inner + '<span class="arrow">›</span></a>';
    }
    return '<div class="card soon">' + inner + '</div>';
  }
  fetch('projects.json', { cache: 'no-cache' })
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(function (list) {
      if (!list.length) { grid.innerHTML = '<p class="empty">아직 등록된 사이트가 없어요.</p>'; return; }
      grid.innerHTML = list.map(card).join('');
    })
    .catch(function () {
      grid.innerHTML = '<p class="empty">목록을 불러오지 못했어요.</p>';
    });
})();
