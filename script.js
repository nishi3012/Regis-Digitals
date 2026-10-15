/* =========================================================
   DESSES.CO REPLICA — script.js
   Full animations: loader, cursor, hero, scroll reveals,
   magnetic buttons, FAQ, sticky nav, counter, marquee
   ========================================================= */
(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────
     1. PAGE LOADER
     ───────────────────────────────────────────────────────── */
  var loader = document.getElementById('pageLoader');
  var hero   = document.querySelector('.hero');

  function dismissLoader() {
    if (loader) {
      loader.classList.add('loaded');
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 700);
    }
    if (hero) {
      hero.classList.add('loaded');      // triggers bg zoom-out
      hero.classList.add('hero-ready'); // triggers hero text reveals
    }
  }

  // Minimum visible time + wait for DOM ready
  var loaderTimer = setTimeout(dismissLoader, 1800);

  window.addEventListener('load', function () {
    clearTimeout(loaderTimer);
    setTimeout(dismissLoader, 600);
  });


  /* ─────────────────────────────────────────────────────────
     2. STICKY + TRANSPARENT NAV
     ───────────────────────────────────────────────────────── */
  var navHeader = document.getElementById('navHeader');
  var heroEl    = document.querySelector('.hero');

  function onScroll() {
    if (!navHeader) return;
    var heroBottom = heroEl ? heroEl.getBoundingClientRect().bottom : 0;
    if (window.scrollY > 60) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ─────────────────────────────────────────────────────────
     4. NAV — fullscreen overlay
     ───────────────────────────────────────────────────────── */
  var menuBtn    = document.getElementById('hamburger');
  var navOverlay = document.getElementById('mobileNav');
  var navLogo    = document.querySelector('.nav-logo');

  if (menuBtn && navOverlay) {

    function openOverlay(open) {
      if (open) {
        navOverlay.classList.add('is-open');
        menuBtn.classList.add('is-open');
        menuBtn.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        if (navLogo) navLogo.style.color = '#ffffff';
      } else {
        navOverlay.classList.remove('is-open');
        menuBtn.classList.remove('is-open');
        menuBtn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        if (navLogo) navLogo.style.color = '';
      }
    }

    menuBtn.addEventListener('click', function () {
      openOverlay(!navOverlay.classList.contains('is-open'));
    });

    navOverlay.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { openOverlay(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') openOverlay(false);
    });
  }


  /* ─────────────────────────────────────────────────────────
     5. SCROLL REVEAL — INTERSECTION OBSERVER
     ───────────────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {

    // Generic fade-up for section-level elements
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        revealIO.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    // Stagger children
    var staggerIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var siblings = Array.from(entry.target.parentElement.children).filter(function (el) {
          return el.hasAttribute('data-stagger');
        });
        var idx = siblings.indexOf(entry.target);
        var delay = Math.min(idx * 75, 320);
        setTimeout(function () {
          entry.target.classList.add('in-view');
        }, delay);
        staggerIO.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    // Split text lines into individual animated spans
    document.querySelectorAll('.reveal-text').forEach(function (el) {
      // Wrap content in line spans if not already done
      if (!el.querySelector('.line-inner')) {
        var html = el.innerHTML;
        // Split on <br> tags
        var lines = html.split(/<br\s*\/?>/i);
        el.innerHTML = lines.map(function (line) {
          return '<span class="line-wrap" style="display:block;overflow:hidden"><span class="line-inner">' + line + '</span></span>';
        }).join('');
      }
    });

    var textRevealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('.line-inner').forEach(function (line, i) {
          setTimeout(function () {
            line.style.transform = 'translateY(0)';
          }, i * 90);
        });
        textRevealIO.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.reveal-text').forEach(function (el) {
      el.querySelectorAll('.line-inner').forEach(function (line) {
        line.style.transform = 'translateY(102%)';
        line.style.transition = 'transform 0.78s cubic-bezier(0.16, 1, 0.3, 1)';
        line.style.display = 'block';
      });
      textRevealIO.observe(el);
    });

    // Fade-up elements (section containers)
    document.querySelectorAll('.about-section, .services-section, .cases-section, .stats-section, .testimonials-section, .pricing-section, .faq-section, .founder-section, .final-cta').forEach(function (el) {
      el.classList.add('js-fade-up');
      revealIO.observe(el);
    });

    // Stagger items
    document.querySelectorAll('[data-stagger]').forEach(function (el) {
      staggerIO.observe(el);
    });

    // Service cards — stagger with delay
    var svcCards = document.querySelectorAll('.svc-card');
    var svcIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var allCards = Array.from(document.querySelectorAll('.svc-card'));
        var idx = allCards.indexOf(entry.target);
        setTimeout(function () {
          entry.target.classList.add('in-view');
        }, idx * 120);
        svcIO.unobserve(entry.target);
      });
    }, { threshold: 0.10 });

    svcCards.forEach(function (el) { svcIO.observe(el); });
  }


  /* ─────────────────────────────────────────────────────────
     6. FAQ ACCORDION
     ───────────────────────────────────────────────────────── */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn  = item.querySelector('.faq-btn');
    var body = item.querySelector('.faq-body');
    if (!btn || !body) return;

    // Wrap inner content for padding animation
    if (!body.querySelector('.faq-body-inner')) {
      var inner = document.createElement('div');
      inner.className = 'faq-body-inner';
      while (body.firstChild) inner.appendChild(body.firstChild);
      body.appendChild(inner);
    }

    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-item').forEach(function (other) {
        var ob = other.querySelector('.faq-btn');
        var od = other.querySelector('.faq-body');
        if (ob && od) {
          ob.setAttribute('aria-expanded', 'false');
          od.style.maxHeight = '0';
          od.classList.remove('open');
        }
      });

      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        body.classList.add('open');
        var inner2 = body.querySelector('.faq-body-inner');
        body.style.maxHeight = (inner2 ? inner2.scrollHeight + 22 : 200) + 'px';
      }
    });
  });


  /* ─────────────────────────────────────────────────────────
     7. COUNTER ANIMATION (stats section)
     ───────────────────────────────────────────────────────── */
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var start = performance.now();

    function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

    function frame(now) {
      var elapsed = now - start;
      var progress = Math.min(elapsed / duration, 1);
      var value = Math.round(easeOut(progress) * target);
      el.textContent = prefix + value + suffix;
      if (progress < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    var counterIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var counters = entry.target.querySelectorAll('.count-up');
        counters.forEach(function (c) {
          setTimeout(function () { animateCounter(c); }, 300);
        });
        counterIO.unobserve(entry.target);
      });
    }, { threshold: 0.3 });

    var statsSection = document.querySelector('.stats-section');
    if (statsSection) counterIO.observe(statsSection);
  }


  /* ─────────────────────────────────────────────────────────
     8. MAGNETIC BUTTONS
     ───────────────────────────────────────────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(function (btn) {
      var strength = 0.30;

      btn.addEventListener('mousemove', function (e) {
        var rect = btn.getBoundingClientRect();
        var cx   = rect.left + rect.width / 2;
        var cy   = rect.top  + rect.height / 2;
        var dx   = (e.clientX - cx) * strength;
        var dy   = (e.clientY - cy) * strength;
        btn.style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
      });

      btn.addEventListener('mouseleave', function () {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }


  /* ─────────────────────────────────────────────────────────
     9. SMOOTH ANCHOR SCROLLING
     ───────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href === '#') return;
      var target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  /* ─────────────────────────────────────────────────────────
     10. REDUCED MOTION — PAUSE MARQUEES
     ───────────────────────────────────────────────────────── */
  var mq = window.matchMedia('(prefers-reduced-motion: reduce)');

  function applyMotion(m) {
    var state = m.matches ? 'paused' : 'running';
    document.querySelectorAll('.logos-inner, .hero-marquee-inner').forEach(function (el) {
      el.style.animationPlayState = state;
    });
  }

  applyMotion(mq);
  if (mq.addEventListener) {
    mq.addEventListener('change', applyMotion);
  }


  /* ─────────────────────────────────────────────────────────
     11. HERO PARALLAX on scroll
     ───────────────────────────────────────────────────────── */
  var heroBgImg = document.querySelector('.hero-bg img');

  if (heroBgImg && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroBgImg.style.transform = 'scale(1.0) translateY(' + (scrollY * 0.18) + 'px)';
      }
    }, { passive: true });
  }


  /* ─────────────────────────────────────────────────────────
     12. SERVICE CARD — TILT on mousemove
     ───────────────────────────────────────────────────────── */
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.svc-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width  - 0.5;
        var y = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = 'perspective(600px) rotateX(' + (-y * 4) + 'deg) rotateY(' + (x * 4) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }


  /* ─────────────────────────────────────────────────────────
     13. SCROLL PROGRESS INDICATOR (thin top bar)
     ───────────────────────────────────────────────────────── */
  var progressBar = document.createElement('div');
  progressBar.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'height:2px',
    'background:rgba(17,17,16,0.65)',
    'z-index:9999',
    'width:0%',
    'transition:width 0.1s linear',
    'pointer-events:none'
  ].join(';');
  document.body.appendChild(progressBar);

  window.addEventListener('scroll', function () {
    var scrollTop = window.scrollY;
    var docHeight = document.documentElement.scrollHeight - window.innerHeight;
    var pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });


  /* ─────────────────────────────────────────────────────────
     14. FOOTER ENTRANCE
     ───────────────────────────────────────────────────────── */
  if ('IntersectionObserver' in window) {
    var footerIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          footerIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });

    var footer = document.querySelector('.footer');
    if (footer) {
      footer.style.opacity = '0';
      footer.style.transform = 'translateY(16px)';
      footer.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      footerIO.observe(footer);
    }
  }

})();

  /* ─────────────────────────────────────────────────────────
     READING EFFECT — word by word highlight on scroll
     ───────────────────────────────────────────────────────── */
  (function () {
    var el = document.getElementById('readingText');
    if (!el) return;

    var text = "You'd refer a heart problem to a cardiologist, not a GP. Your reputation deserves the same. A specialist, not a generalist.";
    var words = text.split(' ');

    // Find sentence boundaries
    var firstSentenceEnd = 0;
    var secondSentenceEnd = 0;
    var dotCount = 0;
    for (var i = 0; i < words.length; i++) {
      if (words[i].endsWith('.')) {
        dotCount++;
        if (dotCount === 1) firstSentenceEnd = i;
        if (dotCount === 2) secondSentenceEnd = i;
      }
    }

    // Build spans — first sentence normal, second italic, third italic+final
    el.innerHTML = words.map(function (w, i) {
      var cls;
      if (i <= firstSentenceEnd) {
        cls = 'read-word normal-word';
      } else if (i <= secondSentenceEnd) {
        cls = 'read-word italic-word';
      } else {
        cls = 'read-word final';
      }
      return '<span class="' + cls + '" data-index="' + i + '">' + w + ' </span>';
    }).join('');

    var spans = el.querySelectorAll('.read-word');

    function updateWords() {
      var elRect   = el.getBoundingClientRect();
      var winH     = window.innerHeight;

      // How far the section has scrolled through the viewport:
      // 0 = element top just entered bottom of screen
      // 1 = element bottom just left top of screen
      var progress = 1 - (elRect.bottom / (winH + elRect.height));
      progress = Math.max(0, Math.min(1, progress));

      // Map progress to word index with a small highlight window
      var litIndex = Math.floor(progress * (spans.length + 4)) - 2;

      spans.forEach(function (span, i) {
        span.classList.remove('lit', 'passed');
        if (i === litIndex || i === litIndex + 1) {
          span.classList.add('lit');
        } else if (i < litIndex) {
          span.classList.add('passed');
        }
      });
    }

    window.addEventListener('scroll', updateWords, { passive: true });
    updateWords();
  }());

  /* ─────────────────────────────────────────────────────────
     FEATURED CASES — thumbnail switcher
     ───────────────────────────────────────────────────────── */
  (function () {
    var cases = [
      { img: 'images/chargeblock.png', cat: 'Energy solutions',      name: 'ChargeBlock' },
      { img: 'images/aespire.png',     cat: 'Sharefunding Real Estate', name: 'AESPIRE'  },
      { img: 'images/robotx.png',      cat: 'AI Powered Audit',      name: 'RobotX'     },
      { img: 'images/sully.png',       cat: 'AI Healthcare',         name: 'Sully.ai'   }
    ];

    var items   = document.querySelectorAll('.cases-thumb-item');
    var bigImg  = document.getElementById('casesBigImg');
    var bigEl   = document.getElementById('casesBigImgEl');
    var bigCat  = document.getElementById('casesBigCat');
    var bigName = document.getElementById('casesBigName');

    if (!items.length || !bigImg) return;

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        var idx = parseInt(item.getAttribute('data-index'), 10);

        // update active state
        items.forEach(function (i) { i.classList.remove('active'); });
        item.classList.add('active');

        // swap image with transition
        bigImg.classList.add('switching');
        setTimeout(function () {
          bigEl.src       = cases[idx].img;
          bigEl.alt       = cases[idx].name;
          bigCat.textContent  = cases[idx].cat;
          bigName.textContent = cases[idx].name;
          bigImg.classList.remove('switching');
        }, 300);
      });
    });
  }());

  /* ─────────────────────────────────────────────────────────
     CASES — active card switcher (hover/click on thumb)
     ───────────────────────────────────────────────────────── */
  (function () {
    var casesData = [
      { img: 'images/chargeblock.png', cat: 'Energy solutions',       name: 'ChargeBlock', desc: 'Leader in custom compact battery storage solutions.',        href: 'https://desses.co/cases/chargeblock', note: 'Custom compact battery storage' },
      { img: 'images/aespire.png',     cat: 'Sharefunding Real Estate',name: 'AESPIRE',    desc: 'AFM-licensed platform to co-own real estate.',               href: 'https://aespire.eu/',                 note: 'AFM-licensed investment platform' },
      { img: 'images/robotx.png',      cat: 'AI Powered Audit',       name: 'RobotX',     desc: 'AI-powered audit automation for Audit, Tax and Finance.',    href: 'https://desses.co/cases/robotx',      note: 'AI audit automation platform' },
      { img: 'images/sully.png',       cat: 'AI Healthcare',          name: 'Sully.ai',   desc: 'Superhuman team of AI employees for healthcare providers.',  href: 'https://desses.co/cases/sully.ai',    note: 'Superhuman AI for healthcare' }
    ];

    var thumbItems  = document.querySelectorAll('.cases-thumb-item');
    var activeCard  = document.getElementById('casesActiveCard');
    var activeImg   = document.getElementById('casesActiveImg');
    var activeCat   = document.getElementById('casesActiveCat');
    var activeName  = document.getElementById('casesActiveName');
    var activeDesc  = document.getElementById('casesActiveDesc');
    var activeNote  = document.getElementById('casesFooterNote');
    var viewBtn     = document.getElementById('casesViewBtn');

    if (!thumbItems.length || !activeCard) return;

    function switchCase(idx) {
      var d = casesData[idx];

      // update active thumb
      thumbItems.forEach(function (t) { t.classList.remove('active'); });
      thumbItems[idx].classList.add('active');

      // fade out → swap → fade in
      activeCard.classList.add('switching');
      setTimeout(function () {
        activeImg.src         = d.img;
        activeImg.alt         = d.name;
        activeCat.textContent = d.cat;
        activeName.textContent= d.name;
        activeDesc.textContent= d.desc;
        activeNote.textContent= d.note;
        if (viewBtn) viewBtn.href = d.href;
        activeCard.classList.remove('switching');
      }, 300);
    }

    thumbItems.forEach(function (item) {
      // switch on hover
      item.addEventListener('mouseenter', function () {
        switchCase(parseInt(item.getAttribute('data-index'), 10));
      });
      // also on click
      item.addEventListener('click', function () {
        switchCase(parseInt(item.getAttribute('data-index'), 10));
      });
    });
  }());

  /* ─────────────────────────────────────────────────────────
     CASES — big single image switcher (final version)
     ───────────────────────────────────────────────────────── */
  (function () {
    var casesData = [
      { img: 'images/chargeblock.png', href: 'https://desses.co/cases/chargeblock' },
      { img: 'images/aespire.png',     href: 'https://aespire.eu/'                 },
      { img: 'images/robotx.png',      href: 'https://desses.co/cases/robotx'      },
      { img: 'images/sully.png',       href: 'https://desses.co/cases/sully.ai'    }
    ];

    var thumbItems = document.querySelectorAll('.cases-thumb-item');
    var bigSingle  = document.getElementById('casesBigSingle');
    var bigImg     = document.getElementById('casesBigSingleImg');
    var bigBtn     = document.getElementById('casesBigSingleBtn');

    if (!thumbItems.length || !bigSingle) return;

    function switchTo(idx) {
      thumbItems.forEach(function (t) { t.classList.remove('active'); });
      thumbItems[idx].classList.add('active');

      bigSingle.classList.add('switching');
      setTimeout(function () {
        bigImg.src  = casesData[idx].img;
        bigImg.alt  = thumbItems[idx].querySelector('strong').textContent;
        bigBtn.href = casesData[idx].href;
        bigSingle.classList.remove('switching');
      }, 300);
    }

    thumbItems.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        switchTo(parseInt(item.getAttribute('data-index'), 10));
      });
      item.addEventListener('click', function () {
        switchTo(parseInt(item.getAttribute('data-index'), 10));
      });
    });
  }());
