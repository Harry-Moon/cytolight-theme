/*
 * Animations des pages Learn.
 *
 * Deux mecanismes seulement, tous deux passifs :
 *   - une frise dont la ligne rouge se remplit au fil du defilement, pilotee
 *     par la propriete custom --ln-progress lue par le CSS ;
 *   - un IntersectionObserver qui allume les jalons et declenche les reveals.
 *
 * Le calcul de progression tourne dans un requestAnimationFrame et ne lit le
 * DOM qu'une fois par frame : pas de layout thrashing sur une page longue.
 *
 * Le CSS ne masque rien de lui-meme : c'est ce script qui pose `is-armed` sur
 * les elements qu'il va animer, juste avant de les observer. Si le script ne
 * s'execute pas — bloque, 404 sur le CDN, mouvement reduit — rien n'est arme
 * et la page s'affiche entierement, au lieu de rester blanche.
 */
(function () {
  'use strict';

  function init(root) {
    if (!root || root.dataset.lnInit === 'true') return;
    root.dataset.lnInit = 'true';

    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    var revealTargets = root.querySelectorAll('.ln-reveal');
    var milestones = root.querySelectorAll('.ln-tl');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add(entry.target.classList.contains('ln-tl') ? 'is-lit' : 'is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(revealTargets, function (el) {
      el.classList.add('is-armed');
      observer.observe(el);
    });
    Array.prototype.forEach.call(milestones, function (el) {
      el.classList.add('is-armed');
      observer.observe(el);
    });

    initTimeline(root);
  }

  /*
   * Progression de la frise.
   *
   * La ligne se remplit entre le moment ou le haut de la frise atteint 78 % de
   * la fenetre et celui ou son bas passe au-dessus de 30 % : la lueur suit
   * ainsi le regard plutot que le bord de l'ecran.
   */
  function initTimeline(root) {
    var timelines = root.querySelectorAll('[data-ln-timeline]');
    if (!timelines.length) return;

    var raf = 0;

    function render() {
      raf = 0;
      var viewport = window.innerHeight || document.documentElement.clientHeight;
      var enter = viewport * 0.78;
      var exit = viewport * 0.3;

      Array.prototype.forEach.call(timelines, function (el) {
        var rect = el.getBoundingClientRect();
        // La course va de « haut de la frise sur la ligne d'entree » a « bas de
        // la frise sur la ligne de sortie », soit la hauteur de la frise plus
        // l'ecart entre les deux lignes. Soustraire cet ecart au lieu de
        // l'ajouter remplirait la ligne rouge un quart trop tot.
        var travel = rect.height + (enter - exit);
        var progress = travel > 0 ? (enter - rect.top) / travel : 0;
        el.style.setProperty('--ln-progress', Math.min(1, Math.max(0, progress)).toFixed(4));
      });
    }

    function request() {
      if (!raf) raf = window.requestAnimationFrame(render);
    }

    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request, { passive: true });

    // Synchrone et non via rAF : --ln-progress vaut 1 par defaut dans le CSS,
    // passer par une frame laisserait la ligne rouge pleine le temps d'un rendu.
    render();
  }

  function initAll() {
    document.querySelectorAll('[data-learn]').forEach(init);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  document.addEventListener('shopify:section:load', function (event) {
    init(event.target.querySelector('[data-learn]'));
  });
})();
