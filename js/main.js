/**
 * Alternative Computations 2026
 * Exhibition Website JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all components
  initLanguageToggle();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initEssayToggle();
  initHeaderScroll();
});

/**
 * Language Toggle
 * Switches between Japanese and English
 */
function initLanguageToggle() {
  const langBtns = document.querySelectorAll('.lang-btn');
  const body = document.body;

  // Check URL parameter first, then localStorage, default to 'ja'
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  const savedLang = urlLang || localStorage.getItem('language') || 'ja';

  // Validate language
  const lang = (savedLang === 'en') ? 'en' : 'ja';
  setLanguage(lang);

  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      setLanguage(lang);
      localStorage.setItem('language', lang);

      // Update URL without reload
      const url = new URL(window.location);
      url.searchParams.set('lang', lang);
      window.history.replaceState({}, '', url);
    });
  });

  function setLanguage(lang) {
    // Remove existing language classes
    body.classList.remove('lang-ja', 'lang-en');
    // Add new language class
    body.classList.add(`lang-${lang}`);

    // Update active button state
    langBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update navigation links text
    document.querySelectorAll('[data-ja][data-en]').forEach(el => {
      el.textContent = el.dataset[lang];
    });

    // Update html lang attribute
    document.documentElement.lang = lang === 'ja' ? 'ja' : 'en';

    // Save to localStorage
    localStorage.setItem('language', lang);
  }
}

/**
 * Mobile Menu
 * Hamburger menu toggle for mobile devices
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu__links a');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('active');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Animate hamburger
    hamburger.classList.toggle('open', isOpen);
  });

  // Close menu when clicking a link
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
      mobileMenu.classList.remove('active');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Smooth Scroll
 * Smooth scrolling for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // Update URL without jumping
      history.pushState(null, null, href);
    });
  });
}

/**
 * Scroll Animations
 * Fade in sections as they enter viewport
 */
function initScrollAnimations() {
  const sections = document.querySelectorAll('.section');

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionally stop observing after animation
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach(section => {
    observer.observe(section);
  });
}

/**
 * Essay Toggle
 * Expand/collapse curatorial essay
 */
function initEssayToggle() {
  const toggle = document.querySelector('.essay-toggle');
  const content = document.querySelector('.essay-content');

  if (!toggle || !content) return;

  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

    toggle.setAttribute('aria-expanded', !isExpanded);
    content.hidden = isExpanded;

    // Update toggle text
    const jaSpan = toggle.querySelector('.ja');
    const enSpan = toggle.querySelector('.en');

    if (isExpanded) {
      jaSpan.textContent = '寄稿文を読む →';
      enSpan.textContent = 'Read Curatorial Essay →';
    } else {
      jaSpan.textContent = '寄稿文を閉じる ×';
      enSpan.textContent = 'Close Curatorial Essay ×';
    }

    // Smooth scroll to essay if opening
    if (!isExpanded) {
      setTimeout(() => {
        content.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  });
}

/**
 * Header Scroll Effect
 * Show header after scrolling past threshold
 */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  if (!header) return;

  const scrollThreshold = 200;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Show/hide header based on scroll position
    if (currentScroll > scrollThreshold) {
      header.classList.add('visible');
    } else {
      header.classList.remove('visible');
    }
  }, { passive: true });
}

/**
 * Utility: Debounce function
 */
function debounce(func, wait = 100) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Utility: Throttle function
 */
function throttle(func, limit = 100) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
