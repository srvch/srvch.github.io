(function () {
  var root = document.documentElement;

  // ----- Theme toggle -----
  function currentTheme() {
    var explicit = root.getAttribute("data-theme");
    if (explicit) return explicit;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  var themeBtn = document.getElementById("theme-toggle");
  function applyTheme(next) {
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
  }
  themeBtn.addEventListener("click", function () {
    var next = currentTheme() === "dark" ? "light" : "dark";
    var calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || calm) { applyTheme(next); return; }
    // Circular wipe that expands from the toggle button
    var r = themeBtn.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));
    var vt = document.startViewTransition(function () { applyTheme(next); });
    vt.ready.then(function () {
      root.animate(
        { clipPath: ["circle(0px at " + x + "px " + y + "px)", "circle(" + radius + "px at " + x + "px " + y + "px)"] },
        { duration: 650, easing: "cubic-bezier(.2,.7,.2,1)", pseudoElement: "::view-transition-new(root)" }
      );
    }).catch(function () {});
  });

  // ----- Mobile menu -----
  var nav = document.getElementById("nav");
  var menuBtn = document.getElementById("menu-toggle");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });

  // ----- Highlight active nav link while scrolling -----
  var links = {};
  nav.querySelectorAll("a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
  var ind = nav.querySelector(".nav-ind");
  var activeLink = null;
  function placeInd(link) {
    if (!ind) return;
    if (!link) { ind.classList.remove("on"); return; }
    ind.style.width = link.offsetWidth + "px";
    ind.style.setProperty("--x", link.offsetLeft + "px");
    ind.classList.add("on");
  }
  function setActive(link) {
    Object.values(links).forEach(function (l) { l.classList.toggle("active", l === link); });
    activeLink = link; placeInd(link);
  }
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && links[entry.target.id] && window.scrollY > 300) setActive(links[entry.target.id]);
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  window.addEventListener("scroll", function () { if (window.scrollY <= 300 && activeLink) setActive(null); }, { passive: true });
  window.addEventListener("resize", function () { placeInd(activeLink); });
  Object.values(links).forEach(function (l) {
    l.addEventListener("mouseenter", function () { placeInd(l); });
    l.addEventListener("mouseleave", function () { placeInd(activeLink); });
  });
  Object.keys(links).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // ----- Experience timeline: scroll-driven progress line + reveal -----
  var timeline = document.getElementById("timeline");
  if (timeline) {
    var items = Array.prototype.slice.call(timeline.querySelectorAll(".t-item"));
    var ticking = false;

    function updateTimeline() {
      ticking = false;
      var rect = timeline.getBoundingClientRect();
      var line = window.innerHeight * 0.6; // reading line, 60% down the viewport
      var progress = (line - rect.top) / rect.height;
      timeline.style.setProperty("--p", Math.max(0, Math.min(1, progress)).toFixed(4));
      items.forEach(function (item) {
        // The dot sits ~29px below the top of its item.
        item.classList.toggle("reached", item.getBoundingClientRect().top + 29 < line);
      });
    }
    function onScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(updateTimeline); }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateTimeline();

    var reveal = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add("in"); reveal.unobserve(entry.target); }
      });
    }, { threshold: 0.12 });
    items.forEach(function (item) { reveal.observe(item); });
  }

  // ----- Scroll progress bar -----
  var bar = document.getElementById("progress");
  var barTick = false;
  function updateBar() {
    barTick = false;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.setProperty("--scroll", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
  }
  window.addEventListener("scroll", function () {
    if (!barTick) { barTick = true; requestAnimationFrame(updateBar); }
  }, { passive: true });
  updateBar();

  // ----- Auto-tag elements for reveal (staggered within their group) -----
  [".section h2", ".skills > .skill-group", ".edu-card", ".awards > li", ".contact p", ".contact .cta", ".footer p"].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.classList.add("reveal");
      if (!el.style.getPropertyValue("--d")) el.style.setProperty("--d", (i * 90) + "ms");
    });
  });

  // ----- Chip stagger index -----
  document.querySelectorAll(".skill-group .chips").forEach(function (list) {
    list.querySelectorAll("li").forEach(function (li, i) { li.style.setProperty("--i", i); });
  });

  // ----- Stat count-up -----
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var counters = document.querySelectorAll("[data-count]");
  function runCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var start = null, dur = 1400;
    function frame(ts) {
      if (start === null) start = ts;
      var t = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  if (!reduce) {
    var countObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCount(e.target); countObs.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { el.textContent = "0" + (el.getAttribute("data-suffix") || ""); countObs.observe(el); });
  }

  // ----- Generic scroll reveal -----
  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) { entry.target.classList.add("in"); revealer.unobserve(entry.target); }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".reveal").forEach(function (el) { revealer.observe(el); });

  // ----- Cursor spotlight (mouse only; skipped on touch) -----
  [".t-card", ".skill-group", ".edu-card", ".award", ".pillars li", ".now-card", ".stats li"].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.classList.add("spot"); });
  });
  var lastSpot = null;
  document.addEventListener("pointermove", function (e) {
    if (e.pointerType !== "mouse") return;
    var el = e.target.closest ? e.target.closest(".spot") : null;
    if (lastSpot && lastSpot !== el) lastSpot.style.setProperty("--sp", 0);
    if (el) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", (e.clientX - r.left) + "px");
      el.style.setProperty("--my", (e.clientY - r.top) + "px");
      el.style.setProperty("--sp", 1);
    }
    lastSpot = el;
  }, { passive: true });
  document.addEventListener("pointerleave", function () {
    if (lastSpot) { lastSpot.style.setProperty("--sp", 0); lastSpot = null; }
  });

  // ----- Back to top -----
  var toTop = document.getElementById("to-top");
  function toggleTop() { toTop.classList.toggle("show", window.scrollY > 700); }
  window.addEventListener("scroll", toggleTop, { passive: true });
  toggleTop();
  toTop.addEventListener("click", function () { window.scrollTo({ top: 0 }); });

  // ----- Typing role line -----
  var typed = document.getElementById("typed");
  if (typed && !reduce) {
    var words = typed.getAttribute("data-words").split("|");
    var wi = 0, ci = words[0].length, deleting = true;
    (function tick() {
      var w = words[wi];
      if (!deleting) {
        if (ci < w.length) { ci++; typed.textContent = w.slice(0, ci); return setTimeout(tick, 70); }
        deleting = true; return setTimeout(tick, 1700);
      }
      if (ci > 0) { ci--; typed.textContent = w.slice(0, ci); return setTimeout(tick, 35); }
      deleting = false; wi = (wi + 1) % words.length; setTimeout(tick, 250);
    })();
  }

  // ----- Card edge glow + 3D tilt (mouse only) -----
  [".t-card", ".skill-group", ".edu-card", ".award", ".stats li"].forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el) { el.classList.add("glow"); });
  });
  document.querySelectorAll(".t-card").forEach(function (card) {
    card.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var r = card.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
      card.style.setProperty("--ry", (px * 5).toFixed(2) + "deg");
      card.style.setProperty("--rx", (-py * 4).toFixed(2) + "deg");
    });
    card.addEventListener("pointerleave", function () {
      card.style.setProperty("--rx", "0deg"); card.style.setProperty("--ry", "0deg");
    });
  });

  // ----- Magnetic buttons (mouse only) -----
  if (!reduce) {
    document.querySelectorAll(".cta .btn, .btn.hire").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        if (e.pointerType !== "mouse") return;
        var r = btn.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width, dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        btn.style.transform = "translate(" + (dx * 10).toFixed(1) + "px," + (dy * 8).toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", function () { btn.style.transform = ""; });
    });
  }

  // ----- Copy email + toast -----
  var copyBtn = document.getElementById("copy-email");
  var toast = document.getElementById("toast");
  if (copyBtn && toast) {
    var timer;
    var done = function () {
      var label = copyBtn.querySelector(".copy-label");
      label.textContent = "Copied \u2713"; copyBtn.classList.add("copied"); toast.classList.add("show");
      clearTimeout(timer);
      timer = setTimeout(function () {
        label.textContent = "Copy email"; copyBtn.classList.remove("copied"); toast.classList.remove("show");
      }, 2200);
    };
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.getAttribute("data-email");
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, function () { fallbackCopy(email); });
      } else { fallbackCopy(email); }
    });
    var fallbackCopy = function (text) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); done(); } catch (e) {}
      document.body.removeChild(ta);
    };
  }

  // ----- Footer year -----
  document.getElementById("year").textContent = new Date().getFullYear();
})();
