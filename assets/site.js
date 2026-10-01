(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---- copper wire progress, header over steel, dock ---- */
  const fill = $('#wireFill');
  const spark = $('#wireSpark');
  const bar = $('.bar');
  const steel = $$('.circuits, .where, .foot');
  const dock = $('.dock');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    const h = (p * 100).toFixed(2) + '%';
    fill.style.height = h;
    spark.style.top = h;
    const bh = bar.offsetHeight;
    bar.classList.toggle('on-steel', steel.some((s) => { const r = s.getBoundingClientRect(); return r.top < bh && r.bottom > 0; }));
    if (dock) dock.classList.toggle('show', scrollY > 320);
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  /* ---- menu ---- */
  const menuBtn = $('.menu-btn');
  const nav = $('#siteNav');
  const setMenu = (open) => { bar.classList.toggle('menu-open', open); menuBtn.setAttribute('aria-expanded', String(open)); };
  menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && bar.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); } });
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('click', (e) => { if (!bar.contains(e.target)) setMenu(false); });

  /* ---- reveal ---- */
  const rvObs = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rvObs.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  $$('.rv').forEach((el) => rvObs.observe(el));

  /* ---- count-up (real numbers only) ---- */
  $$('[data-count]').forEach((el) => {
    if (reduce) return;
    const target = parseFloat(el.dataset.count);
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 1100);
        el.textContent = (target * (1 - Math.pow(1 - k, 3))).toFixed(1);
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    o.observe(el);
  });

  /* ---- home: panel door opens, then the circuits power up ---- */
  const rig = $('#rig');
  if (rig) {
    const main = $('.main-bk .bk', rig);
    const live = $$('.bk-grid .bk:not(.bk-spare)', rig);
    if (reduce) {
      rig.classList.add('open');
      [main, ...live].forEach((b) => b.classList.add('on'));
    } else {
      setTimeout(() => rig.classList.add('open'), 450);
      setTimeout(() => main.classList.add('on'), 2150);
      live.forEach((b, i) => setTimeout(() => b.classList.add('on'), 2550 + i * 170));
    }
  }

  /* ---- home: the wire along the circuit run energises in view ---- */
  const run = $('.run');
  if (run) {
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { run.classList.add('live'); o.disconnect(); } }, { threshold: 0.3 });
    o.observe(run);
  }

  /* ---- circuit pages: the breaker powers the page ---- */
  const big = $('#bigBk');
  if (big) {
    const hero = big.closest('.c-hero');
    const set = (on) => { big.setAttribute('aria-pressed', String(on)); hero.classList.toggle('powered', on); };
    big.addEventListener('click', () => set(big.getAttribute('aria-pressed') !== 'true'));
    if (reduce) set(true); else setTimeout(() => set(true), 750);
  }

  /* ---- videos: play only while on screen ---- */
  const vids = $$('video.lazyvid');
  if (reduce) vids.forEach((v) => v.pause());
  else {
    const vObs = new IntersectionObserver((es) => es.forEach((e) => {
      const v = e.target;
      if (e.isIntersecting) {
        if (v.preload === 'none') { v.preload = 'auto'; v.load(); }
        const p = v.play(); if (p && p.catch) p.catch(() => {});
      } else v.pause();
    }), { rootMargin: '120px 0px', threshold: 0.15 });
    vids.forEach((v) => vObs.observe(v));
  }
})();
