/**
 * Main Interactive Application Script
 * Shubham Ganesh Shinde Developer Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --- 1. HEADER SCROLL & PROGRESS BAR ---
  const header = document.getElementById('header');
  const scrollProgress = document.getElementById('scroll-progress');

  function handleScroll() {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // --- 2. ACTIVE NAVIGATION OBSERVER ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const navObserverOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const currentId = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${currentId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, navObserverOptions);

  sections.forEach(section => navObserver.observe(section));

  // --- 3. MOBILE MENU TOGGLE ---
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenuWrapper = document.getElementById('nav-menu-wrapper');

  if (mobileToggle && navMenuWrapper) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenuWrapper.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close menu when clicking any nav link or pressing Escape
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenuWrapper.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenuWrapper.classList.contains('open')) {
        navMenuWrapper.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.focus();
      }
    });
  }

  // --- 4. THEME TOGGLE (DARK / LIGHT) ---
  const themeToggle = document.getElementById('theme-toggle');
  const rootHtml = document.documentElement;

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  rootHtml.setAttribute('data-theme', savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = rootHtml.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      rootHtml.setAttribute('data-theme', newTheme);
      localStorage.setItem('portfolio-theme', newTheme);
    });
  }

  // --- 5. ANIMATED NUMBER COUNTERS FOR STATISTIC CARDS ---
  function animateNumber(el, target, decimals = 0, duration = 1600) {
    let start = 0;
    const startTime = performance.now();

    function updateCounter(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (target - start) * easeProgress;

      el.textContent = decimals > 0 ? current.toFixed(decimals) : Math.floor(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = decimals > 0 ? target.toFixed(decimals) : target;
      }
    }

    requestAnimationFrame(updateCounter);
  }

  function triggerStatsInContainer(container) {
    const cards = container.querySelectorAll('[data-stat-card]');
    cards.forEach(card => {
      if (card.dataset.hasAnimated) return;
      card.dataset.hasAnimated = 'true';
      const numEl = card.querySelector('.stat-number');
      if (numEl) {
        const target = parseFloat(numEl.getAttribute('data-count')) || 0;
        const decimals = parseInt(numEl.getAttribute('data-decimals')) || 0;
        animateNumber(numEl, target, decimals);
      }
    });
  }

  const statContainers = document.querySelectorAll('.hero-stats-wrapper, .about-stats-container');
  if (statContainers.length > 0) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerStatsInContainer(entry.target);
        }
      });
    }, { threshold: 0.15 });

    statContainers.forEach(container => statsObserver.observe(container));
  }

  // --- 6. RESUME PREVIEW & DOWNLOAD MODAL ---
  const resumeModal = document.getElementById('resume-modal');
  const navResumeBtn = document.getElementById('nav-resume-btn');
  const closeModalBtn = document.getElementById('close-modal-btn');

  function openResumeModal(e) {
    if (e) e.preventDefault();
    if (resumeModal) {
      resumeModal.showModal();
    }
  }

  function closeResumeModal() {
    if (resumeModal) {
      resumeModal.close();
    }
  }

  if (navResumeBtn) {
    navResumeBtn.addEventListener('click', openResumeModal);
  }

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeResumeModal);
  }

  // Close modal when clicking outside the dialog box
  if (resumeModal) {
    resumeModal.addEventListener('click', (e) => {
      const dialogBox = resumeModal.querySelector('.resume-dialog-box');
      if (dialogBox && !dialogBox.contains(e.target)) {
        closeResumeModal();
      }
    });
  }

  // Smooth scroll for all anchor hash links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#resume') {
        openResumeModal(e);
        return;
      }

      if (targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const targetPos = targetEl.getBoundingClientRect().top + window.scrollY - 75;
          window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // --- 7. CONTACT FORM (mailto fallback) ---
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = document.getElementById('contact-name');
      const email   = document.getElementById('contact-email');
      const subject = document.getElementById('contact-subject');
      const message = document.getElementById('contact-message');
      const submitBtn = document.getElementById('contact-submit-btn');

      let valid = true;

      function setError(inputEl, errorId, msg) {
        const errEl = document.getElementById(errorId);
        if (msg) {
          inputEl.classList.add('input-error');
          if (errEl) errEl.textContent = msg;
          valid = false;
        } else {
          inputEl.classList.remove('input-error');
          if (errEl) errEl.textContent = '';
        }
      }

      setError(name, 'error-name', name.value.trim() ? '' : 'Please enter your name.');
      setError(email, 'error-email', /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()) ? '' : 'Please enter a valid email address.');
      setError(subject, 'error-subject', subject.value.trim() ? '' : 'Please enter a subject.');
      setError(message, 'error-message', message.value.trim().length >= 10 ? '' : 'Please enter a message (at least 10 characters).');

      if (!valid) return;

      // Build mailto link
      const toEmail  = 'shubhamshinde89555@gmail.com';
      const mailBody = `Hi Shubham,\n\nMy name is ${name.value.trim()}.\nMy email: ${email.value.trim()}\n\n${message.value.trim()}\n\nSent via portfolio contact form.`;
      const mailtoUrl = `mailto:${toEmail}?subject=${encodeURIComponent(subject.value.trim())}&body=${encodeURIComponent(mailBody)}`;

      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Opening email client\u2026';

      window.location.href = mailtoUrl;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Send Message';
        contactForm.reset();
        // Clear all errors
        document.querySelectorAll('.form-error').forEach(el => el.textContent = '');
        document.querySelectorAll('.form-input, .form-textarea').forEach(el => el.classList.remove('input-error'));
      }, 3000);
    });

    // Live validation on blur
    ['contact-name', 'contact-email', 'contact-subject', 'contact-message'].forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('blur', () => {
        if (el.value.trim()) {
          el.classList.remove('input-error');
          const errEl = document.getElementById('error-' + id.replace('contact-', ''));
          if (errEl) errEl.textContent = '';
        }
      });
    });
  }

});
