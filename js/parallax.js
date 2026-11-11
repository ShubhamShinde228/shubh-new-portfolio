/**
 * 3D Mouse Parallax & Tilt Engine for Shubham's Hero & About Stages
 */
(function () {
  'use strict';

  // HERO STAGE
  const heroStage = document.getElementById('workspace-stage');
  const heroArtwork = heroStage ? heroStage.querySelector('.workspace-artwork-container') : null;
  const heroParallaxItems = heroStage ? heroStage.querySelectorAll('[data-parallax-depth]') : [];

  // ABOUT ME PORTRAIT STAGE
  const aboutStage = document.getElementById('about-portrait-stage');
  const aboutPortraitCard = aboutStage ? aboutStage.querySelector('.portrait-card') : null;
  const aboutBadgeItems = aboutStage ? aboutStage.querySelectorAll('[data-badge-depth]') : [];

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let rafId = null;

  function resetTransforms() {
    if (heroArtwork) heroArtwork.style.transform = '';
    if (aboutPortraitCard) aboutPortraitCard.style.transform = '';
    heroParallaxItems.forEach(item => {
      item.style.setProperty('--px-x', '0px');
      item.style.setProperty('--px-y', '0px');
    });
    aboutBadgeItems.forEach(badge => {
      badge.style.setProperty('--px-x', '0px');
      badge.style.setProperty('--px-y', '0px');
    });
  }

  window.addEventListener('mousemove', e => {
    if (prefersReducedMotion.matches) return;
    const normX = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
    const normY = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);

    mouse.targetX = Math.max(-1, Math.min(1, normX));
    mouse.targetY = Math.max(-1, Math.min(1, normY));
  });

  // Reset when cursor leaves window
  document.addEventListener('mouseleave', () => {
    mouse.targetX = 0;
    mouse.targetY = 0;
  });

  function renderParallax() {
    if (document.hidden || prefersReducedMotion.matches) {
      rafId = null;
      return;
    }

    // Smooth lerp
    mouse.x += (mouse.targetX - mouse.x) * 0.08;
    mouse.y += (mouse.targetY - mouse.y) * 0.08;

    // 1. Tilt Hero Artwork
    if (heroArtwork) {
      const rotX = -mouse.y * 12;
      const rotY = mouse.x * 14;
      heroArtwork.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(10px)`;
    }

    // Parallax Hero Floating Badges
    heroParallaxItems.forEach(item => {
      const depth = parseFloat(item.getAttribute('data-parallax-depth')) || 20;
      const moveX = mouse.x * depth;
      const moveY = mouse.y * depth;
      item.style.setProperty('--px-x', `${moveX.toFixed(1)}px`);
      item.style.setProperty('--px-y', `${moveY.toFixed(1)}px`);
    });

    // 2. Tilt About Me Portrait Card
    if (aboutPortraitCard) {
      const rotX = -mouse.y * 10;
      const rotY = mouse.x * 12;
      aboutPortraitCard.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(12px)`;
    }

    // Parallax About Floating Badges
    aboutBadgeItems.forEach(badge => {
      const depth = parseFloat(badge.getAttribute('data-badge-depth')) || 25;
      const moveX = mouse.x * depth;
      const moveY = mouse.y * depth;
      badge.style.setProperty('--px-x', `${moveX.toFixed(1)}px`);
      badge.style.setProperty('--px-y', `${moveY.toFixed(1)}px`);
    });

    rafId = requestAnimationFrame(renderParallax);
  }

  function startOrStopParallax() {
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (prefersReducedMotion.matches) {
      resetTransforms();
    } else if (!document.hidden) {
      renderParallax();
    }
  }

  document.addEventListener('visibilitychange', startOrStopParallax);
  prefersReducedMotion.addEventListener('change', startOrStopParallax);

  startOrStopParallax();
})();
