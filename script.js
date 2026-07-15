// ==========================================================================
// MARIAM CARLIER — PORTFOLIO
// Funcionalidades: modo oscuro persistente, menú mobile, animaciones sutiles
// ==========================================================================

(function () {
  'use strict';

  /* ---------------- Modo oscuro / claro ---------------- */
  const root = document.documentElement;
  const STORAGE_KEY = 'mariam-theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
      toggle.setAttribute(
        'aria-label',
        theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'
      );
    }
  }

  // Aplica el tema lo antes posible para evitar parpadeo
  applyTheme(getPreferredTheme());

  document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.querySelector('.theme-toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(STORAGE_KEY, next);
      });
    }

    // Si el usuario no ha elegido manualmente, sigue el tema del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });

    /* ---------------- Menú mobile ---------------- */
    const navToggle = document.querySelector('.nav-toggle');
    const mainNav = document.querySelector('nav[aria-label="Navegación principal"]');

    if (navToggle && mainNav) {
      navToggle.addEventListener('click', function () {
        const isOpen = mainNav.classList.toggle('is-open');
        navToggle.setAttribute('aria-expanded', String(isOpen));
      });

      // Cierra el menú al elegir un enlace (mobile)
      mainNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          mainNav.classList.remove('is-open');
          navToggle.setAttribute('aria-expanded', 'false');
        });
      });
    }

    /* ---------------- Animación de entrada (reveal on scroll) ---------------- */
    const revealTargets = document.querySelectorAll('main > section');
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      revealTargets.forEach(function (el) { observer.observe(el); });
    } else {
      // Sin soporte o con animaciones reducidas: mostrar todo directo
      revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
    }

    /* ---------------- Barras de progreso animadas ---------------- */
    const progressBars = document.querySelectorAll('progress[value]');
    progressBars.forEach(function (bar) {
      bar.dataset.target = bar.getAttribute('value');
      bar.setAttribute('value', '0');
    });

    if ('IntersectionObserver' in window) {
      const progressObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              const bar = entry.target;
              const target = bar.dataset.target || '0';
              requestAnimationFrame(function () {
                bar.setAttribute('value', target);
              });
              progressObserver.unobserve(bar);
            }
          });
        },
        { threshold: 0.4 }
      );
      progressBars.forEach(function (bar) { progressObserver.observe(bar); });
    } else {
      progressBars.forEach(function (bar) {
        bar.setAttribute('value', bar.dataset.target || '0');
      });
    }
  });
})();