/* =========================================================
   ALTOPIANO ROOMS SUITE — main.js
   Navbar scroll, mobile menu, reveal-on-scroll
   ========================================================= */

(() => {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const menu = nav?.querySelector('.nav__menu');

  /* ----- Mobile menu ----- */
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('is-open');
      document.body.style.overflow = nav.classList.contains('is-open') ? 'hidden' : '';
    });

    menu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        nav.classList.remove('is-open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----- Scroll state ----- */
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 40) nav.classList.add('nav--scrolled');
    else nav.classList.remove('nav--scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----- Reveal on scroll ----- */
  const revealEls = document.querySelectorAll('.reveal, .feature, .room-card, .room-detail, .foggia__item');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) {
          // small stagger for nicer feel
          setTimeout(() => e.target.classList.add('is-visible'), i * 60);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => {
      el.classList.add('reveal');
      io.observe(el);
    });
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ----- Smooth scroll for in-page anchors ----- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ----- Room photo galleries ----- */
  document.querySelectorAll('.gallery').forEach(gallery => {
    const track = gallery.querySelector('.gallery__track');
    const slides = gallery.querySelectorAll('.gallery__slide');
    const prevBtn = gallery.querySelector('.gallery__btn--prev');
    const nextBtn = gallery.querySelector('.gallery__btn--next');
    const dotsContainer = gallery.querySelector('.gallery__dots');
    const counter = gallery.querySelector('.gallery__counter');
    if (!track || slides.length < 2) return;

    const total = slides.length;
    let current = 0;

    // Build dots
    if (dotsContainer) {
      slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.className = 'gallery__dot' + (i === 0 ? ' is-active' : '');
        dot.setAttribute('aria-label', 'Vai alla foto ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsContainer.appendChild(dot);
      });
    }

    const updateUI = () => {
      if (dotsContainer) {
        dotsContainer.querySelectorAll('.gallery__dot').forEach((d, i) => {
          d.classList.toggle('is-active', i === current);
        });
      }
      if (counter) counter.textContent = (current + 1) + ' / ' + total;
    };

    const goTo = (i) => {
      current = (i + total) % total;
      track.scrollTo({ left: current * track.clientWidth, behavior: 'smooth' });
      updateUI();
    };

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

    // Sync state when user swipes/scrolls manually
    let scrollTimeout;
    track.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const newIndex = Math.round(track.scrollLeft / track.clientWidth);
        if (newIndex !== current) {
          current = newIndex;
          updateUI();
        }
      }, 80);
    });

    updateUI();
  });
})();
