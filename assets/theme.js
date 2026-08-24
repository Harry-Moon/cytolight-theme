/* BON CHARGE-inspired theme — light interactivity */
(function () {
  'use strict';

  // Sticky-on-scroll shadow for header
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /*
     * Publie la hauteur du header dans --header-h.
     *
     * Toute autre barre collante de la page — la sous-navigation de l'espace
     * Learn — doit se caler dessous, sinon elle glisse derriere lui. La hauteur
     * varie selon la largeur d'ecran et selon le retour a la ligne du bandeau
     * de reassurance : elle est mesuree plutot qu'ecrite en dur.
     *
     * Le CSS garde une valeur de repli : sans ce script, rien ne bouge.
     */
    const publishHeaderHeight = () => {
      const h = Math.round(header.getBoundingClientRect().height);
      if (h > 0) document.documentElement.style.setProperty('--header-h', h + 'px');
    };
    publishHeaderHeight();
    if ('ResizeObserver' in window) {
      new ResizeObserver(publishHeaderHeight).observe(header);
    } else {
      window.addEventListener('resize', publishHeaderHeight, { passive: true });
    }

    /*
     * Masquage au defilement vers le bas, retour au defilement vers le haut.
     *
     * Seule la rangee de menu se retire — le bandeau de reassurance et la
     * barre logo restent affiches, sinon le repere de marque disparaitrait
     * avec le reste au premier defilement.
     *
     * L'etat est binaire : revelee ou masquee, jamais entre les deux. Le
     * suivi au pixel pres qui vivait ici immobilisait la rangee a mi-course
     * des qu'on defilait de quelques pixels — une demi-rangee a demi
     * transparente, suspendue sous le logo, qui n'allait plus nulle part
     * tant qu'on ne defilait pas davantage.
     *
     * Changer d'etat demande donc une intention : HIDE_AFTER px cumules vers
     * le bas pour masquer, SHOW_AFTER px cumules vers le haut pour revenir.
     * Tout changement de direction remet le compteur oppose a zero, sans quoi
     * une lente derive finirait par franchir le seuil toute seule. Les deux
     * seuils different a dessein : on masque a contrecoeur, on revele au
     * premier geste franc vers le haut. La transition est portee par le CSS —
     * le script ne fait que poser des classes.
     *
     * Le CSS retient la rangee tant que le curseur est dessus ou qu'un onglet
     * a le focus clavier ; on relit ces etats a chaque scroll plutot que de
     * maintenir un booleen a la main. Un booleen pose ou leve par des paires
     * d'evenements (pointerenter/pointerleave, focusin/focusout) peut se
     * desynchroniser de l'etat reel — un pointerleave rate, un blur qui part
     * vers un element hors de la rangee sans passer par le chemin prevu — et
     * une fois bloque a "actif" plus rien ne bougeait, y compris en
     * remontant : c'etait un bug precedent. Relire l'etat reel a chaque frame
     * se corrige tout seul, il n'y a pas d'etat a desynchroniser.
     */
    const navRow = header.querySelector('.site-header__nav');
    const navInner = navRow && navRow.querySelector('.site-header__nav-row');
    /*
     * L'enveloppe de section porte le collant : c'est elle qui occupe la
     * hauteur du header dans le flux, donc elle qui doit la rendre.
     */
    const stickyWrap = header.closest('#shopify-section-header');
    const REVEAL_AT = 120;  // au-dessus de ce point, la rangee reste entiere
    const HIDE_AFTER = 64;  // px cumules vers le bas avant de masquer
    const SHOW_AFTER = 24;  // px cumules vers le haut avant de revenir
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (navRow && !reduceMotion) {
      /*
       * Hauteur exacte de la rangee, publiee dans --nav-row-h. Elle sert deux
       * fois : comme max-height revelee, et comme marge de compensation sur
       * l'enveloppe collante. Les deux doivent etre le meme nombre, sinon la
       * compensation ne s'annule pas.
       *
       * Mesuree sur .site-header__nav-row, l'interieur : la rangee elle-meme
       * est clippee par le max-height qu'on lui pose, et se mesurer a travers
       * son propre clip ferait ratcheter la valeur vers zero a chaque cycle.
       */
      const publishRowHeight = () => {
        // Non arrondie : au pixel entier, la marge rendue au flux ne vaut plus
        // tout a fait la hauteur retiree, et le document change de taille d'un
        // pixel a chaque bascule — la compensation doit tomber juste.
        const h = (navInner || navRow).getBoundingClientRect().height;
        if (h > 0) document.documentElement.style.setProperty('--nav-row-h', h.toFixed(2) + 'px');
      };
      publishRowHeight();
      /*
       * Force la resolution du style avec la mesure fraichement publiee, puis
       * seulement arme les transitions.
       *
       * L'ordre n'est pas cosmetique : une transition part des que la
       * propriete change ET qu'une transition est declaree dans le style
       * d'arrivee. Publier la mesure et armer dans la meme passe, c'est donc
       * animer le passage du repli (61px) a la hauteur mesuree — la rangee se
       * retractait de dix pixels toute seule au chargement de la page. En
       * lisant la mise en page entre les deux, la valeur mesuree devient le
       * point de depart, et armer ensuite ne change plus aucune valeur.
       */
      void navRow.offsetHeight;
      document.documentElement.classList.add('nav-collapse-ready');
      if ('ResizeObserver' in window && navInner) {
        new ResizeObserver(publishRowHeight).observe(navInner);
      } else {
        window.addEventListener('resize', publishRowHeight, { passive: true });
      }

      let isHidden = false;
      let downPx = 0;
      let upPx = 0;
      let lastY = window.scrollY;
      let ticking = false;

      /*
       * :focus-visible distingue le focus clavier du focus laisse par un clic
       * souris. Un clic sur un onglet focalise son bouton et ce focus reste :
       * traite comme du focus clavier, il epinglait la rangee pour de bon et
       * plus rien ne se masquait apres un simple clic dans le menu. Le focus
       * clavier, lui, doit bel et bien tout retenir — on ne derobe pas la
       * rangee sous quelqu'un qui la parcourt au clavier.
       */
      let focusVisibleOk = true;
      try { document.querySelector(':focus-visible'); } catch (e) { focusVisibleOk = false; }

      const isHeld = () => navRow.matches(':hover') || (focusVisibleOk
        ? !!navRow.querySelector(':focus-visible')
        : navRow.matches(':focus-within'));

      const closePanelsAndBlur = () => {
        navRow.querySelectorAll('.site-header__nav-item.is-open').forEach((item) => {
          item.classList.remove('is-open');
          const toggle = item.querySelector('[aria-expanded]');
          if (toggle) toggle.setAttribute('aria-expanded', 'false');
        });
        const active = document.activeElement;
        if (active && navRow.contains(active) && typeof active.blur === 'function') {
          active.blur();
        }
      };

      const setHidden = (next) => {
        downPx = 0;
        upPx = 0;
        if (next === isHidden) return;
        isHidden = next;
        // Un panneau ouvert au clic suivrait la rangee hors de l'ecran : le
        // defilement le referme et rend le focus laisse par la souris.
        if (isHidden) closePanelsAndBlur();
        navRow.classList.toggle('is-hidden', isHidden);
        if (stickyWrap) stickyWrap.classList.toggle('is-nav-hidden', isHidden);
        /*
         * Le changement d'etat peut deplacer le defilement lui-meme : si la
         * compensation CSS n'a pas pris (navigateur sans :has, feuille de
         * style absente), le document se raccourcit et l'ancrage de
         * defilement recule la page pour compenser. Ce recul n'est le geste
         * de personne : le relire comme un defilement vers le haut ferait
         * revenir la rangee aussitot masquee — masquage, saut, retour, en
         * boucle, au moindre petit scroll. On resynchronise donc le repere
         * apres coup ; lire scrollY force le calcul de mise en page, la
         * valeur tient deja compte de l'ajustement.
         */
        lastY = Math.max(0, window.scrollY);
      };

      const reveal = () => setHidden(false);

      const updateHeaderVisibility = () => {
        ticking = false;
        const y = Math.max(0, window.scrollY);
        const delta = y - lastY;
        lastY = y;
        if (delta === 0) return;

        // Haut de page, curseur sur la rangee ou onglet au focus clavier :
        // rangee entiere.
        if (y <= REVEAL_AT || isHeld()) {
          reveal();
          return;
        }

        if (delta > 0) {
          upPx = 0;
          downPx += delta;
          if (downPx >= HIDE_AFTER) setHidden(true);
        } else {
          downPx = 0;
          upPx -= delta;
          if (upPx >= SHOW_AFTER) setHidden(false);
        }
      };

      window.addEventListener('scroll', () => {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(updateHeaderVisibility);
        }
      }, { passive: true });

      /*
       * Le survol ou le focus clavier d'un onglet ouvre son panneau (regle
       * CSS :hover / :focus-within) ; sans attendre le prochain scroll, on
       * rouvre tout de suite au cas ou la rangee etait deja masquee quand le
       * curseur/le focus arrive dessus.
       */
      navRow.addEventListener('pointerenter', reveal);
      navRow.addEventListener('focusin', reveal);
    }
  }

  // Quantity selectors
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-qty-step]');
    if (!btn) return;
    const wrapper = btn.closest('.product__qty');
    if (!wrapper) return;
    const input = wrapper.querySelector('input[type="number"]');
    const step = parseInt(btn.dataset.qtyStep, 10) || 1;
    const next = Math.max(1, (parseInt(input.value, 10) || 1) + step);
    input.value = next;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  // Variant option toggle (cosmetic — Shopify form posts variant id)
  document.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-variant-option]');
    if (!opt) return;
    const group = opt.closest('.product__variant-options');
    if (!group) return;
    group.querySelectorAll('[data-variant-option]').forEach((b) => b.setAttribute('aria-pressed', 'false'));
    opt.setAttribute('aria-pressed', 'true');
    const hidden = document.querySelector('[data-variant-id-input]');
    if (hidden && opt.dataset.variantId) hidden.value = opt.dataset.variantId;
    const main = document.querySelector('.product__media-main img');
    if (main && opt.dataset.variantImage) main.src = opt.dataset.variantImage;
  });

  // Gallery thumbnails
  document.addEventListener('click', (e) => {
    const thumb = e.target.closest('.product__thumbs button');
    if (!thumb) return;
    const main = document.querySelector('.product__media-main img');
    const src = thumb.querySelector('img')?.src;
    if (main && src) main.src = src;
    thumb.parentElement.querySelectorAll('button').forEach((b) => b.setAttribute('aria-current', 'false'));
    thumb.setAttribute('aria-current', 'true');
  });

  // Carousel arrows (optional)
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    const track = carousel.querySelector('.carousel__track');
    const prev = carousel.querySelector('[data-carousel-prev]');
    const next = carousel.querySelector('[data-carousel-next]');
    if (!track) return;
    const scrollBy = () => Math.round(track.clientWidth * 0.85);
    prev?.addEventListener('click', () => track.scrollBy({ left: -scrollBy(), behavior: 'smooth' }));
    next?.addEventListener('click', () => track.scrollBy({ left: scrollBy(), behavior: 'smooth' }));
  });

  // Header nav submenu / mega-menu — click/tap toggle on top of hover
  document.querySelectorAll('[data-nav-submenu]').forEach((item) => {
    const toggle = item.querySelector('.site-header__nav-link');
    if (!toggle) return;
    const close = () => {
      item.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
    document.addEventListener('click', (e) => {
      if (!item.contains(e.target)) close();
    });
  });

  // Announcement bar rotator (if multiple items + data-rotate)
  document.querySelectorAll('[data-announcement-rotate]').forEach((bar) => {
    const items = bar.querySelectorAll('.announcement__item');
    if (items.length < 2) return;
    let i = 0;
    items.forEach((it, idx) => (it.style.display = idx === 0 ? '' : 'none'));
    setInterval(() => {
      items[i].style.display = 'none';
      i = (i + 1) % items.length;
      items[i].style.display = '';
    }, 4000);
  });

  // Policy pages (Shopify's built-in /policies/* markup): some policies —
  // Terms of Service in particular — mark section titles as inline
  // "<strong>SECTION 1 - ...</strong><br>" instead of real headings, so
  // there's nothing for the .shopify-policy__body h2 styling to select.
  // Promote those ALL-CAPS <strong> labels into real <h2> elements so they
  // get the same heading treatment as policies that already use <h2>.
  const policyBody = document.querySelector('.shopify-policy__body');
  if (policyBody) {
    const stripAdjacentBreaks = (start, direction) => {
      let node = start;
      while (node) {
        const isBlankText = node.nodeType === Node.TEXT_NODE && !node.textContent.trim();
        const isBreak = node.nodeName === 'BR';
        if (!isBlankText && !isBreak) break;
        const adjacent = direction === 'next' ? node.nextSibling : node.previousSibling;
        node.remove();
        node = adjacent;
      }
    };
    Array.from(policyBody.querySelectorAll('strong')).forEach((el) => {
      if (el.closest('h1, h2, h3, h4, h5, h6')) return;
      const text = el.textContent.trim();
      if (text.length < 3 || text.length > 80) return;
      if (text !== text.toUpperCase() || !/[A-Z]/.test(text)) return;
      const h2 = document.createElement('h2');
      h2.textContent = text;
      el.replaceWith(h2);
      stripAdjacentBreaks(h2.nextSibling, 'next');
      stripAdjacentBreaks(h2.previousSibling, 'previous');
    });
  }
})();
