
(() => {
    'use strict';

    // =========================
    // HELPER FUNCTIONS
    // =========================

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) =>
        Array.from(r.querySelectorAll(s));


    // =========================
    // PAGE LOADER
    // =========================

    const hero = $('.hero');
    const loader = $('#pageLoader');

    function ready() {
        loader?.classList.add('loaded');
        hero?.classList.add('hero-ready');

        setTimeout(() => loader?.remove(), 700);
    }

    window.addEventListener('load', () => {
        setTimeout(ready, 350);
    });

    setTimeout(ready, 2200);


    // =========================
    // UPDATED NAVBAR
    // =========================

    const nav = $('#navHeader');
    const menu = $('#hamburger');
    const panel = $('#mobileNav');

    function closeMenu() {
        if (!panel || !menu) return;

        panel.hidden = true;

        menu.classList.remove('is-open');
        menu.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-label', 'Open menu');
    }

    function toggleMenu() {
        if (!panel || !menu) return;

        const isOpen = !panel.hidden;

        panel.hidden = isOpen;

        menu.classList.toggle('is-open', !isOpen);
        menu.setAttribute('aria-expanded', String(!isOpen));
        menu.setAttribute(
            'aria-label',
            isOpen ? 'Open menu' : 'Close menu'
        );
    }

    // Open / close menu
    menu?.addEventListener('click', toggleMenu);

    // Close menu with Escape
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // Close menu when a navigation link is clicked
    $$('.nav-overlay a').forEach(a => {
        a.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', e => {
        if (nav && !nav.contains(e.target)) {
            closeMenu();
        }
    });


    // =========================
    // SCROLL REVEAL EFFECTS
    // =========================

    if ('IntersectionObserver' in window) {

        const io = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('in-view');
                        io.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.06 }
        );

        $$(
            '.about-section, ' +
            '.services-section, ' +
            '.cases-section, ' +
            '.stats-section, ' +
            '.testimonials, ' +
            '.pricing-section, ' +
            '.faq-section, ' +
            '.founder-section, ' +
            '.final-cta, ' +
            '[data-stagger], ' +
            '.reveal-text'
        ).forEach(el => {

            if (el.hasAttribute('data-stagger')) {

                const items = $$(
                    '[data-stagger]',
                    el.parentElement
                );

                const index = items.indexOf(el);

                el.style.transitionDelay =
                    Math.min(index * 70, 300) + 'ms';
            }

            if (
                !el.hasAttribute('data-stagger') &&
                !el.classList.contains('reveal-text')
            ) {
                el.classList.add('js-fade-up');
            }

            io.observe(el);
        });

    } else {

        $$('.js-fade-up, [data-stagger]').forEach(el => {
            el.classList.add('in-view');
        });

    }


    // =========================
    // REVEAL TEXT
    // =========================

    $$('.reveal-text').forEach(el => {

        if (!el.querySelector('.line-inner')) {

            const wrap = document.createElement('span');
            wrap.className = 'line-inner';

            while (el.firstChild) {
                wrap.appendChild(el.firstChild);
            }

            el.appendChild(wrap);
        }
    });


    // =========================
    // FAQ ACCORDION
    // =========================

    $$('.faq-item').forEach(item => {

        const btn = $('.faq-btn', item);
        const body = $('.faq-body', item);

        if (!btn || !body) return;

        const inner = document.createElement('div');
        inner.className = 'faq-body-inner';

        while (body.firstChild) {
            inner.appendChild(body.firstChild);
        }

        body.appendChild(inner);

        btn.addEventListener('click', () => {

            const open =
                btn.getAttribute('aria-expanded') !== 'true';

            // Close all FAQ items
            $$('.faq-item').forEach(i => {

                const b = $('.faq-btn', i);
                const p = $('.faq-body', i);

                b?.setAttribute('aria-expanded', 'false');

                if (p) {
                    p.style.maxHeight = '0px';
                }
            });

            // Open selected FAQ
            if (open) {

                btn.setAttribute('aria-expanded', 'true');

                body.style.maxHeight =
                    inner.scrollHeight + 'px';
            }
        });
    });


    // =========================
    // STATS COUNTER
    // =========================

    const stats = $('.stats-section');

    if (stats && 'IntersectionObserver' in window) {

        const obs = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                $$('.count-up', stats).forEach(el => {

                    const target =
                        Number(el.dataset.target) || 0;

                    const suffix = el.dataset.suffix || '';

                    const start = performance.now();

                    function tick(now) {

                        const t = Math.min(
                            (now - start) / 1500,
                            1
                        );

                        const value = Math.round(
                            target * (1 - (1 - t) ** 3)
                        );

                        el.textContent = value + suffix;

                        if (t < 1) {
                            requestAnimationFrame(tick);
                        }
                    }

                    requestAnimationFrame(tick);
                });

                obs.disconnect();
            });

        }, { threshold: 0.25 });

        obs.observe(stats);
    }


    // =========================
    // READING TEXT ANIMATION
    // =========================

    const reading = $('#readingText');

    if (reading) {

        const words = (
            "You'd refer a heart problem to a cardiologist, " +
            "not a GP. Your reputation deserves the same. " +
            "A specialist, not a generalist."
        ).split(' ');

        let dots = 0;

        reading.innerHTML = words.map(word => {

            const className =
                dots === 0
                    ? 'normal-word'
                    : dots === 1
                        ? 'italic-word'
                        : 'final';

            if (word.endsWith('.')) {
                dots++;
            }

            return `<span class="read-word ${className}">${word} </span>`;

        }).join('');

        const spans = $$('.read-word', reading);

        let busy = false;

        function updateReading() {

            if (busy) return;

            busy = true;

            requestAnimationFrame(() => {

                const rect = reading.getBoundingClientRect();

                const progress = Math.max(
                    0,
                    Math.min(
                        1,
                        (innerHeight - rect.top) /
                        (innerHeight + rect.height)
                    )
                );

                const count = Math.floor(
                    progress * spans.length
                );

                spans.forEach((span, index) => {

                    span.classList.toggle(
                        'lit',
                        index === count ||
                        index === count - 1
                    );

                    span.classList.toggle(
                        'passed',
                        index < count - 1
                    );
                });

                busy = false;
            });
        }

        window.addEventListener(
            'scroll',
            updateReading,
            { passive: true }
        );

        updateReading();
    }


    // =========================
    // TESTIMONIAL DRAG SCROLL
    // =========================

    const review = $('.review-window');

    if (review) {

        let down = false;
        let x = 0;
        let left = 0;

        review.addEventListener('pointerdown', e => {

            down = true;
            x = e.clientX;
            left = review.scrollLeft;

            review.setPointerCapture(e.pointerId);
        });

        review.addEventListener('pointermove', e => {

            if (down) {
                review.scrollLeft =
                    left - (e.clientX - x);
            }
        });

        review.addEventListener('pointerup', () => {
            down = false;
        });

        review.addEventListener('pointercancel', () => {
            down = false;
        });
    }


    // =========================
    // SMOOTH SCROLL
    // =========================

    $$('a[href^="#"]').forEach(a => {

        a.addEventListener('click', e => {

            const href = a.getAttribute('href');

            if (href === '#') return;

            const target = $(href);

            if (target) {

                e.preventDefault();

                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

})();

