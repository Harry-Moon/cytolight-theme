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

  // Header nav submenu (e.g. "Produits") — click/tap toggle on top of hover
  document.querySelectorAll('[data-nav-submenu]').forEach((item) => {
    const toggle = item.querySelector('.site-header__submenu-toggle');
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
})();
