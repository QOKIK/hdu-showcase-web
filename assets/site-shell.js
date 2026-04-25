/**
 * Theme persistence, mobile nav, lightweight particle canvas (respects reduced motion).
 */
(function () {
  var body = document.body;
  var header = document.querySelector(".site-header");
  var themeKey = "hdu-theme";

  function applyTheme(mode) {
    if (mode === "dark") body.setAttribute("data-theme", "dark");
    else body.removeAttribute("data-theme");
  }

  var stored = localStorage.getItem(themeKey);
  if (stored === "dark") applyTheme("dark");
  else if (stored === "light") applyTheme("light");
  else applyTheme("light");

  var themeBtn = document.getElementById("theme-toggle");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var dark = body.getAttribute("data-theme") === "dark";
      if (dark) {
        applyTheme("light");
        localStorage.setItem(themeKey, "light");
      } else {
        applyTheme("dark");
        localStorage.setItem(themeKey, "dark");
      }
    });
  }

  var navBtn = document.getElementById("nav-toggle");
  if (navBtn && header) {
    var nav = document.getElementById("site-nav");
    navBtn.addEventListener("click", function () {
      var open = header.classList.toggle("nav-open");
      navBtn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        navBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  var canvas = document.getElementById("bg-particles");
  if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  var ctx = canvas.getContext("2d");
  var particles = [];
  var w = 0;
  var h = 0;
  var running = true;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = [];
    var n = Math.min(72, Math.floor((w * h) / 22000));
    for (var i = 0; i < n; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        a: 0.12 + Math.random() * 0.35
      });
    }
  }

  function tick() {
    if (!running) return;
    var dark = body.getAttribute("data-theme") === "dark";
    ctx.clearRect(0, 0, w, h);
    var fill = dark ? "rgba(123, 228, 255," : "rgba(47, 128, 237,";
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = fill + p.a + ")";
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }

  window.addEventListener("resize", function () {
    resize();
    initParticles();
  });
  resize();
  initParticles();
  tick();

  document.addEventListener("visibilitychange", function () {
    running = document.visibilityState === "visible";
    if (running) tick();
  });
})();
