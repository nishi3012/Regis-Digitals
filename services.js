document.addEventListener("DOMContentLoaded", function () {

  /* ---------- DATA ----------
     t   = heading
     s   = grey sentence (recommended)
     alt = alternative sentence from your brief (not shown)
     i   = detail items: [["Title", "Text"], ...]   (hidden while empty)
     h/p = "What's included" heading + paragraph    (hidden while empty) */
  var S = [
    { id: "strategy-growth-advisory", t: "Strategy & Growth Advisory",
      s: "The thinking behind the marketing, for practices that don’t know where to start.",
      i: [], h: "", p: "" },
    { id: "ai-content-production", t: "AI Content & Production",
      s: "Films, reels and graphics made faster with AI, and checked by a person before they go out.",
      alt: "Content for practices that need more of it than they have time to make.",
      i: [], h: "", p: "" },
    { id: "social-media-management", t: "Social Media Management",
      s: "A steady presence on the platforms your patients already use, run so you don’t have to.",
      alt: "Instagram, YouTube and LinkedIn, planned a month ahead.",
      i: [], h: "", p: "" },
    { id: "websites-discoverability", t: "Websites & Discoverability",
      s: "A website a patient can trust in one scroll, and Google and AI tools can read.",
      alt: "Sites built for the person deciding, and the search that sends them.",
      i: [], h: "", p: "" },
    { id: "campaigns", t: "Campaigns",
      s: "One goal, one finish line, planned inside the advertising rules from the first draft.",
      alt: "For anything with a date: a machine, a service, an event.",
      i: [], h: "", p: "" },
    { id: "leadership-reputation", t: "Leadership & Reputation",
      s: "For doctors aiming at a society role, a scientific stage, or a seat in their field.",
      alt: "Elections, conference programmes and recognition, run by people who know how medical bodies work.",
      i: [], h: "", p: "" }
  ];
  var EMAIL = "mayank@regisdigitals.com";

  /* ---------- RENDER ---------- */
  var $ = function (id) { return document.getElementById(id); };
  var pad = function (n) { return (n < 9 ? "0" : "") + (n + 1); };

  // Service index list (right side of intro)
  $("weekList").innerHTML = S.map(function (s, n) {
    return '<a class="reveal" style="--d:' + n * .06 + 's" href="#' + s.id + '">' +
           "<h3>" + s.t + "</h3><h6>" + pad(n) + "</h6></a>";
  }).join("");

  // Six service sections
  $("serviceSections").innerHTML = S.map(function (s, n) {
    var items = s.i.map(function (it, j) {
      return '<div class="item reveal" style="--d:' + (j % 3) * .1 + 's"><em>0' + (j + 1) + "</em><h3>" +
             it[0] + "</h3><p>" + it[1] + "</p></div>";
    }).join("");

    var included = s.h
      ? '<div class="included reveal"><div><small>What\'s included</small><h3>' + s.h + "</h3><p>" + s.p +
        '</p></div><div class="btns"><a class="btn btn-ghost" href="mailto:' + EMAIL + '"><span>Get in touch</span></a></div></div>'
      : "";

    return '<section class="service" id="' + s.id + '"><div class="wrap">' +
      '<div class="service-head"><div>' +
        '<div class="eyebrow reveal"><span class="pulse-dot"></span>Services · ' + pad(n) + "</div>" +
        "<h2 data-split>" + s.t + "</h2></div>" +
        '<h5 class="reveal">' + s.s + "</h5></div>" +
      '<div class="ph media-ph reveal"><small>Image / video — ' + s.t + "</small></div>" +
      (items ? '<div class="items">' + items + "</div>" : "") +
      included +
      "</div></section>";
  }).join("");

  /* ---------- PAGE LOADER + HERO REVEAL ---------- */
  var loader = $("pageLoader");
  var hero = document.querySelector(".hero");

  function dismissLoader() {
    if (loader) {
      loader.classList.add("loaded");
      setTimeout(function () {
        if (loader.parentNode) loader.parentNode.removeChild(loader);
      }, 700);
    }
    if (hero) {
      hero.classList.add("loaded");     // bg zoom-out
      hero.classList.add("hero-ready"); // hero text reveals
    }
  }

  var loaderTimer = setTimeout(dismissLoader, 1800);
  window.addEventListener("load", function () {
    clearTimeout(loaderTimer);
    setTimeout(dismissLoader, 600);
  });

  /* ---------- MAGNETIC BUTTON ---------- */
  document.querySelectorAll(".magnetic").forEach(function (el) {
    el.addEventListener("mousemove", function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left - r.width / 2) * 0.25;
      var y = (e.clientY - r.top - r.height / 2) * 0.35;
      el.style.transform = "translate(" + x + "px," + y + "px)";
    });
    el.addEventListener("mouseleave", function () { el.style.transform = ""; });
  });

  /* ---------- SPLIT-LINE HEADINGS ---------- */
  document.querySelectorAll("[data-split]").forEach(function (el) {
    el.innerHTML = el.textContent.trim().split(/\s+/).map(function (w, n) {
      return '<span class="line"><span style="--d:' + n * .05 + 's">' + w + "</span></span> ";
    }).join("");
    el.classList.add("reveal-split");
  });

  /* ---------- SCROLL REVEAL ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  document.querySelectorAll(".reveal, .reveal-split").forEach(function (el) { io.observe(el); });

  /* ---------- PROGRESS BAR + NAV "SCROLLED" STATE ---------- */
  var bar = $("progress");
  var header = document.querySelector(".nav-header");

  function onScroll() {
    var y = window.scrollY;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    header.classList.toggle("scrolled", y > 60);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- NAVBAR MENU ---------- */
  var menuButton = $("hamburger");
  var menuOverlay = $("mobileNav");
  if (!menuButton || !menuOverlay) return;

  var menuText = menuButton.querySelector("span");

  function openMenu() {
    menuOverlay.classList.add("is-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuOverlay.setAttribute("aria-hidden", "false");
    if (menuText) menuText.textContent = "Close";
    document.body.style.overflow = "hidden";
  }

  function closeMenu() {
    menuOverlay.classList.remove("is-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuOverlay.setAttribute("aria-hidden", "true");
    if (menuText) menuText.textContent = "Menu";
    document.body.style.overflow = "";
  }

  menuButton.addEventListener("click", function () {
    menuOverlay.classList.contains("is-open") ? closeMenu() : openMenu();
  });

  menuOverlay.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });
});