'use strict';

document.documentElement.classList.add('js');

const header = document.getElementById('siteHeader');
const menuToggle = document.getElementById('menuToggle');
const menuOverlay = document.getElementById('menuOverlay');
const menuLabel = document.getElementById('menuLabel');
const progressBar = document.getElementById('scrollProgress');
const principleProgress = document.getElementById('principleProgress');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function updateScrollState() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.transform = `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`;
  header.classList.toggle('is-scrolled', window.scrollY > 24);
}

window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', updateScrollState);
updateScrollState();

function setMenu(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuOverlay.setAttribute('aria-hidden', String(!open));
  menuOverlay.classList.toggle('is-open', open);
  document.body.classList.toggle('menu-open', open);
  menuLabel.textContent = open ? 'Close' : 'Menu';
}

menuToggle.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});
menuOverlay.addEventListener('click', event => {
  if (event.target === menuOverlay || event.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setMenu(false);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

document.querySelectorAll('[data-reveal], [data-stagger]').forEach(element => revealObserver.observe(element));

const reviewWindow = document.querySelector('.review-window');
if (reviewWindow) {
  let dragStartX = 0;
  let startScrollLeft = 0;
  let isDragging = false;

  reviewWindow.addEventListener('wheel', event => {
    if (window.matchMedia('(max-width: 760px)').matches || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const maxScroll = reviewWindow.scrollWidth - reviewWindow.clientWidth;
    const canScroll = event.deltaY > 0 ? reviewWindow.scrollLeft < maxScroll - 1 : reviewWindow.scrollLeft > 1;
    if (!canScroll) return;
    event.preventDefault();
    reviewWindow.scrollLeft += event.deltaY;
  }, { passive: false });

  reviewWindow.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0) return;
    isDragging = true;
    dragStartX = event.clientX;
    startScrollLeft = reviewWindow.scrollLeft;
    reviewWindow.classList.add('is-dragging');
    reviewWindow.setPointerCapture(event.pointerId);
  });
  reviewWindow.addEventListener('pointermove', event => {
    if (!isDragging) return;
    reviewWindow.scrollLeft = startScrollLeft - (event.clientX - dragStartX);
  });
  const endDrag = () => {
    isDragging = false;
    reviewWindow.classList.remove('is-dragging');
  };
  reviewWindow.addEventListener('pointerup', endDrag);
  reviewWindow.addEventListener('pointercancel', endDrag);
}

function animateCount(element) {
  const target = Number(element.dataset.count);
  if (!Number.isFinite(target)) return;
  const prefix = element.dataset.prefix || '';
  const suffix = element.dataset.suffix || '';
  if (reduceMotion) {
    element.textContent = `${prefix}${target}${suffix}`;
    return;
  }
  const start = performance.now();
  const duration = 1500;
  const frame = now => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    element.textContent = `${prefix}${Math.round(target * eased)}${suffix}`;
    if (progress < 1) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

const countObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCount(entry.target);
    countObserver.unobserve(entry.target);
  });
}, { threshold: 0.6 });
document.querySelectorAll('[data-count]').forEach(element => countObserver.observe(element));

const principles = [...document.querySelectorAll('[data-principle]')];
const jumps = [...document.querySelectorAll('.principle-jump')];
function setActivePrinciple(index) {
  principles.forEach((item, itemIndex) => {
    const active = itemIndex === index;
    item.classList.toggle('is-active', active);
    if (active) item.classList.add('is-visible');
  });
  jumps.forEach((button, itemIndex) => {
    const active = itemIndex === index;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-current', active ? 'step' : 'false');
  });
  principleProgress.style.transform = `scaleX(${(index + 1) / principles.length})`;
}

const activeObserver = new IntersectionObserver(entries => {
  entries.filter(entry => entry.isIntersecting).forEach(entry => entry.target.classList.add('is-visible'));
  const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visible) return;
  const index = principles.indexOf(visible.target);
  setActivePrinciple(index);
}, { threshold: [0.2, 0.45, 0.7], rootMargin: '-18% 0px -25% 0px' });
principles.forEach(item => activeObserver.observe(item));

jumps.forEach(button => {
  button.addEventListener('click', () => {
    const target = document.getElementById(button.dataset.target);
    const index = principles.indexOf(target);
    if (index >= 0) setActivePrinciple(index);
    target?.classList.add('is-visible');
    target?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
  });
});

document.querySelectorAll('a[href]').forEach(link => {
  const url = new URL(link.href, window.location.href);
  const samePage = url.origin === window.location.origin && url.pathname === window.location.pathname && !url.hash;
  if (url.origin !== window.location.origin || samePage || link.target === '_blank') return;
  link.addEventListener('click', event => {
    if (reduceMotion || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    document.body.classList.add('is-leaving');
    window.setTimeout(() => { window.location.href = url.href; }, 500);
  });
});
