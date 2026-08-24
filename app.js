var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---- nav ---- */
var burger = document.getElementById('burger'), menu = document.getElementById('menu');
burger.addEventListener('click', function () {
  var open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  burger.innerHTML = open ? '&#10005;' : '&#9776;';
});
menu.addEventListener('click', function (e) {
  if (e.target.tagName === 'A') {
    menu.classList.remove('open');
    burger.innerHTML = '&#9776;';
    burger.setAttribute('aria-expanded', 'false');
  }
});

/* ---- ticker: duplicate the list so the -50% loop is seamless ---- */
var tick = document.getElementById('tick');
tick.innerHTML += tick.innerHTML;

/* ---- hero neural net ---- */
(function () {
  if (reduce) return;
  var c = document.getElementById('net'), x = c.getContext('2d'), pts = [], W = 0, H = 0,
      dpr = Math.min(devicePixelRatio || 1, 2);

  function init() {
    W = c.width = c.offsetWidth * dpr;
    H = c.height = c.offsetHeight * dpr;
    // node count from CSS pixels, so density looks the same on retina and non-retina
    var n = Math.max(28, Math.min(70, Math.round(c.offsetWidth * c.offsetHeight / 16000)));
    pts = [];
    for (var i = 0; i < n; i++) pts.push({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .24 * dpr, vy: (Math.random() - .5) * .24 * dpr,
      r: (Math.random() * 1.5 + .7) * dpr
    });
  }

  function frame() {
    x.clearRect(0, 0, W, H);
    var D = 150 * dpr;
    for (var i = 0; i < pts.length; i++) {
      var p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      for (var j = i + 1; j < pts.length; j++) {
        var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
        if (d < D) {
          x.strokeStyle = 'rgba(90,160,255,' + (0.22 * (1 - d / D)).toFixed(3) + ')';
          x.lineWidth = dpr;
          x.beginPath(); x.moveTo(p.x, p.y); x.lineTo(q.x, q.y); x.stroke();
        }
      }
      x.fillStyle = 'rgba(150,205,255,.55)';
      x.beginPath(); x.arc(p.x, p.y, p.r, 0, 6.2832); x.fill();
    }
    requestAnimationFrame(frame);
  }

  // ResizeObserver fires once on observe and on every size change, so the canvas
  // can't get stuck at zero if it was laid out late.
  new ResizeObserver(init).observe(c);
  requestAnimationFrame(frame);
})();

/* ---- scroll reveal ---- */
var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (en) {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

document.querySelectorAll('.rv').forEach(function (el, i) {
  el.style.transitionDelay = (Math.min(i % 6, 5) * 55) + 'ms';
  io.observe(el);
});

// failsafe: if the observer never fires (embedded/headless views that don't composite),
// drop the gate so the page shows content instead of staying blank.
setTimeout(function () {
  if (!document.querySelector('.rv.in')) document.documentElement.classList.remove('js');
}, 1200);
