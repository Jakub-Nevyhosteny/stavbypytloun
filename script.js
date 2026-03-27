'use strict';

// ═══════════════ COOKIE CONSENT ══════════════════════
const COOKIE_KEY = 'pytlounstav_cookie_consent';

const cookieBanner      = document.getElementById('cookie-banner');
const cookieOverlay     = document.getElementById('cookie-overlay');
const cookieAcceptBtn   = document.getElementById('cookie-accept');
const cookieRejectBtn   = document.getElementById('cookie-reject');
const cookieSettingsBtn = document.getElementById('cookie-settings-btn');
const mapIframe         = document.getElementById('map-iframe');
const mapPlaceholder    = document.getElementById('map-placeholder');
const mapCookieAccept   = document.getElementById('map-cookie-accept');

const showCookieBanner = () => {
  document.body.classList.add('cookie-pending');
  cookieBanner.classList.add('active');
  cookieOverlay.classList.add('active');
  cookieSettingsBtn.hidden = true;
  cookieAcceptBtn.focus();
};

const hideCookieBanner = () => {
  cookieBanner.classList.remove('active');
  cookieOverlay.classList.remove('active');
  document.body.classList.remove('cookie-pending');
  cookieSettingsBtn.hidden = false;
};

const applyConsent = (accepted) => {
  if (accepted) {
    mapIframe.src = mapIframe.dataset.src;
    mapIframe.style.display = '';
    if (mapPlaceholder) mapPlaceholder.style.display = 'none';
  } else {
    mapIframe.style.display = 'none';
    if (mapPlaceholder) mapPlaceholder.style.display = '';
  }
};

const handleAccept = () => {
  localStorage.setItem(COOKIE_KEY, 'accepted');
  hideCookieBanner();
  applyConsent(true);
};

const handleReject = () => {
  localStorage.setItem(COOKIE_KEY, 'rejected');
  hideCookieBanner();
  applyConsent(false);
};

cookieAcceptBtn.addEventListener('click', handleAccept);
cookieRejectBtn.addEventListener('click', handleReject);
if (mapCookieAccept) mapCookieAccept.addEventListener('click', handleAccept);

// Re-open banner from floating settings button
cookieSettingsBtn.addEventListener('click', () => {
  showCookieBanner();
});

// Init on load
const savedConsent = localStorage.getItem(COOKIE_KEY);
if (savedConsent === 'accepted') {
  applyConsent(true);
  cookieSettingsBtn.hidden = false;
} else if (savedConsent === 'rejected') {
  applyConsent(false);
  cookieSettingsBtn.hidden = false;
} else {
  // No decision yet — show banner immediately
  showCookieBanner();
}

// ─── NAVBAR — transparent over hero, white after ──────
const navbar  = document.getElementById('navbar');
const heroEl  = document.getElementById('domů');

const updateNavbar = () => {
  if (window.scrollY > 10) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
};

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// ─── MOBILE MENU ──────────────────────────────────────
const menuBtn    = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobile-menu');

const closeMobileMenu = () => {
  mobileMenu.classList.remove('open');
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
};

menuBtn.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeMobileMenu();
});

// ─── SMOOTH SCROLL ────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
    const top  = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── ACTIVE NAV LINK ──────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

const setActiveLink = () => {
  const scrollY = window.scrollY + 120;
  let current   = '';
  sections.forEach(s => {
    if (scrollY >= s.offsetTop) current = s.id;
  });
  navLinks.forEach(link => {
    const href = link.getAttribute('href').slice(1);
    link.classList.toggle('active', href === current);
  });
};

window.addEventListener('scroll', setActiveLink, { passive: true });
setActiveLink();

// ─── SCROLL REVEAL ────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -32px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

// ─── LIGHTBOX ─────────────────────────────────────────
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const lightboxCounter = document.getElementById('lightboxCounter');

const portfolioItems  = [...document.querySelectorAll('.portfolio-item')];
const portfolioImages = portfolioItems.map(item => item.querySelector('img'));
let currentIndex = 0;

const showImage = (index) => {
  currentIndex = (index + portfolioImages.length) % portfolioImages.length;
  const img = portfolioImages[currentIndex];

  lightboxImg.classList.add('loading');
  lightboxImg.alt = img.alt;

  const tmp = new Image();
  tmp.onload = () => {
    lightboxImg.src = tmp.src;
    lightboxImg.classList.remove('loading');
  };
  tmp.src = img.src;

  lightboxCounter.textContent = `${currentIndex + 1} / ${portfolioImages.length}`;
};

const openLightbox = (index) => {
  showImage(index);
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
};

const closeLightbox = () => {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  portfolioItems[currentIndex]?.focus();
};

// Click on portfolio items
portfolioItems.forEach((item, i) => {
  item.setAttribute('tabindex', '0');
  item.setAttribute('role', 'button');
  item.setAttribute('aria-label', `Zobrazit fotografii ${i + 1}`);

  item.addEventListener('click', () => openLightbox(i));
  item.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(i);
    }
  });
});

// Controls
lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => showImage(currentIndex - 1));
lightboxNext.addEventListener('click', () => showImage(currentIndex + 1));

// Close on backdrop click
lightbox.addEventListener('click', e => {
  if (e.target === lightbox) closeLightbox();
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowRight')  showImage(currentIndex + 1);
  if (e.key === 'ArrowLeft')   showImage(currentIndex - 1);
});

// Touch swipe
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener('touchend',   e => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 50) showImage(delta < 0 ? currentIndex + 1 : currentIndex - 1);
}, { passive: true });

// ─── REDUCED MOTION ───────────────────────────────────
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
if (prefersReduced.matches) {
  revealEls.forEach(el => el.classList.add('visible'));
}

// ─── SCROLL TO TOP ────────────────────────────────────
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
  scrollTopBtn.classList.toggle('visible', window.scrollY > 80);
}, { passive: true });

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ─── STAT COUNTER ANIMATION ───────────────────────────
const statNums = document.querySelectorAll('.stat-num[data-target]');

const animateCounter = (el, delay) => {
  const target  = parseInt(el.dataset.target, 10);
  const suffix  = el.dataset.suffix || '';
  const duration = 1400; // ms
  const startTime = performance.now() + delay;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const tick = (now) => {
    const elapsed  = Math.max(0, now - startTime);
    const progress = Math.min(elapsed / duration, 1);
    el.textContent = Math.round(easeOut(progress) * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    statsObserver.unobserve(entry.target);

    statNums.forEach((el, i) => {
      animateCounter(el, i * 220); // 220ms stagger between each
    });
  });
}, { threshold: 0.1 });

const statsGroup = document.querySelector('.stats-group');
if (statsGroup) statsObserver.observe(statsGroup);
