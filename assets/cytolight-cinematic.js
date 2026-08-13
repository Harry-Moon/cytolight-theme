(function () {
  'use strict';

  function init(root) {
    if (!root || root.dataset.cyInit === 'true') return;
    root.dataset.cyInit = 'true';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var cinemas = Array.prototype.map.call(root.querySelectorAll('[data-cy-cinema]'), function (el) {
      return {
        el: el,
        targetProgress: 0,
        currentProgress: 0,
        hasMeasured: false
      };
    });
    var raf = 0;
    var lastFrameTime = 0;

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function responsiveEase(value) {
      return 1 - Math.pow(1 - value, 3);
    }

    function lightStep(value) {
      if (value > 0.62) return 1;
      if (value > 0.28) return 0.56;
      return 0;
    }

    function measureCinema(scene) {
      if (!scene || !scene.el || reduceMotion) return;
      var rect = scene.el.getBoundingClientRect();
      var travel = Math.max(1, rect.height - window.innerHeight);
      scene.targetProgress = clamp((0 - rect.top) / travel, 0, 1);
    }

    function renderCinema(now) {
      raf = 0;
      if (!cinemas.length || reduceMotion) return;
      var delta = lastFrameTime ? Math.min(48, now - lastFrameTime) : 16;
      lastFrameTime = now;
      var follow = 1 - Math.pow(0.001, delta / 180);
      var shouldContinue = false;
      cinemas.forEach(function (scene) {
        measureCinema(scene);
        if (!scene.hasMeasured) {
          scene.currentProgress = scene.targetProgress;
          scene.hasMeasured = true;
        }
        scene.currentProgress += (scene.targetProgress - scene.currentProgress) * follow;
        if (Math.abs(scene.targetProgress - scene.currentProgress) < 0.0007) {
          scene.currentProgress = scene.targetProgress;
        }
        scene.el.style.setProperty('--cy-p', scene.currentProgress.toFixed(4));
        scene.el.style.setProperty('--cy-pe', responsiveEase(scene.currentProgress).toFixed(4));
        scene.el.style.setProperty('--cy-light-step', lightStep(scene.currentProgress).toFixed(2));
        if (scene.currentProgress !== scene.targetProgress) {
          shouldContinue = true;
        }
      });
      if (shouldContinue) requestFrame();
    }

    function requestFrame() {
      if (!raf) raf = window.requestAnimationFrame(renderCinema);
    }

    if (cinemas.length && !reduceMotion) {
      window.addEventListener('scroll', requestFrame, { passive: true });
      window.addEventListener('resize', requestFrame, { passive: true });
      requestFrame();
    }

    root.querySelectorAll('[data-cy-rail]').forEach(function (rail) {
      var track = rail.querySelector('[data-cy-track]');
      var prev = rail.querySelector('[data-cy-prev]');
      var next = rail.querySelector('[data-cy-next]');
      if (!track) return;
      function amount() { return Math.max(280, Math.round(track.clientWidth * 0.82)); }
      prev && prev.addEventListener('click', function () { track.scrollBy({ left: -amount(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
      next && next.addEventListener('click', function () { track.scrollBy({ left: amount(), behavior: reduceMotion ? 'auto' : 'smooth' }); });
    });

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16 });
      root.querySelectorAll('.cy-reveal').forEach(function (el) { observer.observe(el); });
    } else {
      root.querySelectorAll('.cy-reveal').forEach(function (el) { el.classList.add('is-visible'); });
    }

    initHeroVideo(root, reduceMotion);
  }

  /*
   * Video de fond du hero.
   *
   * Elle etait en autoplay avec un src direct : 1,4 Mo telecharges depuis un
   * domaine tiers avant le moindre pixel peint, ce qui en faisait l'element LCP
   * a 7,3 s sur mobile. Elle est purement decorative — l'image poster porte
   * seule le contenu du hero.
   *
   * Elle n'est donc jamais chargee sur mobile, ou elle coute 1,4 Mo de data
   * pour un fond, ni en mouvement reduit, ni en data saver, ni sur une
   * connexion lente. Ailleurs, elle attend l'evenement load puis la premiere
   * interaction du visiteur : le LCP est deja fige a ce moment-la.
   */
  function initHeroVideo(root, reduceMotion) {
    var video = root.querySelector('[data-cy-hero-video]');
    if (!video || video.dataset.cyVideoInit === 'true') return;
    video.dataset.cyVideoInit = 'true';

    if (reduceMotion) return;
    if (!window.matchMedia('(min-width: 768px)').matches) return;

    var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection) {
      if (connection.saveData) return;
      if (/(^|-)(2g|3g)$/.test(connection.effectiveType || '')) return;
    }

    var started = false;
    var triggers = ['pointerdown', 'pointermove', 'keydown', 'wheel', 'touchstart', 'scroll'];

    function start() {
      if (started) return;
      started = true;
      triggers.forEach(function (name) { window.removeEventListener(name, start); });

      var src = video.dataset.src;
      if (!src) return;
      video.src = src;
      video.addEventListener('canplay', function () { video.classList.add('is-ready'); }, { once: true });
      var played = video.play();
      if (played && typeof played.catch === 'function') {
        played.catch(function () { /* autoplay refuse : le poster reste affiche */ });
      }
    }

    function arm() {
      triggers.forEach(function (name) {
        window.addEventListener(name, start, { passive: true });
      });
    }

    if (document.readyState === 'complete') {
      arm();
    } else {
      window.addEventListener('load', arm, { once: true });
    }
  }

  function initAll() {
    document.querySelectorAll('[data-cytolight-home]').forEach(init);
  }

  document.addEventListener('DOMContentLoaded', initAll);
  document.addEventListener('shopify:section:load', function (event) { init(event.target.querySelector('[data-cytolight-home]')); });
})();
