document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.horizontal-sections');
  if (!container) return;

  const panels = Array.from(container.querySelectorAll('.panel'));
  const navLinks = Array.from(document.querySelectorAll('.navbar a[href^="#"]'));

  // Flèches de chaque section
  panels.forEach((panel, i) => {
    const left = panel.querySelector('.swipe-left');
    const right = panel.querySelector('.swipe-right');

    if (left) left.addEventListener('click', () => scrollToIndex(i - 1));
    if (right) right.addEventListener('click', () => scrollToIndex(i + 1));
  });

  // Liens internes (menu, boutons "Voir mon parcours", etc.)
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const idx = panels.findIndex(p => '#' + p.id === link.getAttribute('href'));
      if (idx === -1) return;
      e.preventDefault();
      scrollToIndex(idx);
    });
  });

  function isHorizontal() {
    return container.scrollWidth > container.clientWidth + 10;
  }

  function scrollToIndex(idx) {
    if (idx < 0) idx = panels.length - 1;
    if (idx >= panels.length) idx = 0;
    const target = panels[idx];
    if (!target) return;

    if (isHorizontal()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      container.scrollTo({ left: target.offsetLeft - container.offsetLeft, behavior: 'smooth' });
    } else {
      const navHeight = document.querySelector('.navbar')?.offsetHeight || 0;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  function currentVisibleIndex() {
    const rects = panels.map(p => p.getBoundingClientRect());
    if (isHorizontal()) {
      const centerX = window.innerWidth / 2;
      for (let i = 0; i < rects.length; i++) {
        if (rects[i].left <= centerX && rects[i].right >= centerX) return i;
      }
    } else {
      const centerY = window.innerHeight / 2;
      for (let i = 0; i < rects.length; i++) {
        if (rects[i].top <= centerY && rects[i].bottom >= centerY) return i;
      }
    }
    return 0;
  }

  // Navigation au clavier
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') scrollToIndex(currentVisibleIndex() + 1);
    if (e.key === 'ArrowLeft') scrollToIndex(currentVisibleIndex() - 1);
  });

  // Lien actif dans le menu selon la section visible
  function updateActiveLink() {
    const current = panels[currentVisibleIndex()];
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current.id);
    });
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateActiveLink();
      ticking = false;
    });
  }

  container.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  updateActiveLink();
});