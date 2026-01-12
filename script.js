(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  // Smooth scroll for same-page anchors
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const el = $(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
      closeMobileMenu();
    });
  });

  // Active nav highlighting
  const sections = $$('section[id]');
  const navLinks = $$('header nav a[href^="#"]');
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id));
    });
  }, { rootMargin: '-30% 0px -60% 0px', threshold: 0.01 });
  sections.forEach(s => obs.observe(s));

  // Scroll reveal
  const revealItems = $$('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in');
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
  revealItems.forEach(el => revealObs.observe(el));

  // Back-to-top
  const backTop = $('#backTop');
  if (backTop) {
    const onScroll = () => {
      backTop.classList.toggle('show', window.scrollY > 700);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // Copy-to-clipboard actions
  $$('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = btn.getAttribute('data-copy');
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        toast(`Copied: ${value}`);
      } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = value;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
        toast(`Copied: ${value}`);
      }
    });
  });

  // Projects filter
  const chips = $$('.chip[data-filter]');
  const cards = $$('.project-card');
  if (chips.length && cards.length) {
    const setActive = (chip) => chips.forEach(c => c.classList.toggle('active', c === chip));
    const apply = (tag) => {
      cards.forEach(card => {
        const tags = (card.getAttribute('data-tags') || '').split(',').map(s => s.trim());
        const show = tag === 'all' || tags.includes(tag);
        card.style.display = show ? '' : 'none';
      });
    };
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const tag = chip.getAttribute('data-filter');
        setActive(chip);
        apply(tag);
      });
    });
  }

  // Mobile nav
  const burger = $('#burger');
  const mobilePanel = $('#mobilePanel');
  function closeMobileMenu() {
    if (!mobilePanel) return;
    mobilePanel.classList.remove('open');
    document.body.classList.remove('no-scroll');
  }
  if (burger && mobilePanel) {
    burger.addEventListener('click', () => {
      mobilePanel.classList.toggle('open');
      document.body.classList.toggle('no-scroll', mobilePanel.classList.contains('open'));
    });
    $$('#mobilePanel a').forEach(a => a.addEventListener('click', closeMobileMenu));
    $('#mobileClose')?.addEventListener('click', closeMobileMenu);
  }

  // Toast
  const toastEl = $('#toast');
  let toastTimer = null;
  function toast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 2200);
  }

  // Footer year
  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();