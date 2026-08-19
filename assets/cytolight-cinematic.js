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

    function smoothstep(value) {
      return value * value * (3 - 2 * value);
    }

    // Zoom finishes early (by ~45% of scroll through the pinned section),
    // eased out so it settles smoothly instead of drifting linearly.
    function zoomStep(value) {
      var t = clamp(value / 0.45, 0, 1);
      return responsiveEase(t);
    }

    // Red light glow only starts once the zoom has essentially finished,
    // then ramps in smoothly (no more instant jump between fixed steps).
    function lightStep(value) {
      var t = clamp((value - 0.45) / 0.45, 0, 1);
      return smoothstep(t);
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
        scene.el.style.setProperty('--cy-zoom', zoomStep(scene.currentProgress).toFixed(4));
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

    function animateCount(el) {
      var target = parseFloat(el.dataset.countTo);
      var suffix = el.dataset.suffix || '';
      if (!isFinite(target)) return;
      if (reduceMotion) {
        el.textContent = target.toLocaleString('en-US') + suffix;
        return;
      }
      var duration = 1100;
      var start = null;
      function step(timestamp) {
        if (start === null) start = timestamp;
        var progress = Math.min(1, (timestamp - start) / duration);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            var counter = entry.target.querySelector('[data-count-to]');
            if (counter) animateCount(counter);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16 });
      root.querySelectorAll('.cy-reveal').forEach(function (el) { observer.observe(el); });
    } else {
      root.querySelectorAll('.cy-reveal').forEach(function (el) {
        el.classList.add('is-visible');
        var counter = el.querySelector('[data-count-to]');
        if (counter) animateCount(counter);
      });
    }
  }

  function initAll() {
    document.querySelectorAll('[data-cytolight-home]').forEach(init);
  }

  document.addEventListener('DOMContentLoaded', initAll);
  document.addEventListener('shopify:section:load', function (event) { init(event.target.querySelector('[data-cytolight-home]')); });
})();
