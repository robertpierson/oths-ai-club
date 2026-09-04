/* ---- nav ---- */
var burger = document.getElementById('burger'), menu = document.getElementById('menu');

burger.addEventListener('click', function () {
  var open = menu.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  burger.textContent = open ? 'Close' : 'Menu';
});

menu.addEventListener('click', function (e) {
  if (e.target.tagName === 'A') {
    menu.classList.remove('open');
    burger.textContent = 'Menu';
    burger.setAttribute('aria-expanded', 'false');
  }
});

/* ---- scroll reveal ----
   Stagger is scoped to each element's own parent, so siblings in a row animate
   together. Keying off a global index (the old approach) gave unrelated elements
   arbitrary delays. */
document.querySelectorAll('.rv').forEach(function (el) {
  var i = [].indexOf.call(el.parentNode.children, el);
  el.style.transitionDelay = Math.min(i, 5) * 60 + 'ms';
});

var io = new IntersectionObserver(function (entries) {
  entries.forEach(function (en) {
    if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
  });
}, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

/* ---- schedule state ----
   Marks past weeks as done and points the announcement bar at the next one, so
   the page stops being stale the morning after a meeting. The bar ships with
   the correct date hardcoded, so this only ever refines what is already right. */
(function () {
  var weeks = [].slice.call(document.querySelectorAll('.week[data-date]'));
  if (!weeks.length) return;

  // compare date-only, and treat a meeting as current until it has finished
  var now = new Date();
  var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  var next = null;

  weeks.forEach(function (el) {
    var p = el.dataset.date.split('-');
    var when = new Date(+p[0], p[1] - 1, +p[2]).getTime();
    if (when < today) el.classList.add('done');
    else if (!next) { next = el; el.classList.add('next'); }
  });

  if (!next) return;                       // season over: leave the hardcoded copy alone
  var label = next.querySelector('.label').textContent.trim();
  var title = next.querySelector('h3');
  var body = next.querySelector('p');
  var line = document.getElementById('ann-line');
  var big = document.getElementById('next-big');

  if (big) big.textContent = label;
  if (line && title) {
    var d = next.dataset.date.split('-');
    var full = new Date(+d[0], d[1] - 1, +d[2]).toLocaleDateString('en-US',
      { weekday: 'long', month: 'long', day: 'numeric' });
    line.innerHTML = '<span class="num">' + full + '</span> — 2:45–3:15 PM, Room 1661. ' +
      title.textContent.trim() + (body ? ': ' + body.textContent.trim().split('.')[0] + '.' : '');
  }
})();

/* ---- background drift ----
   Background wordmarks and the badge move at a different rate to the page.
   Transform only, batched into one rAF per scroll, and skipped entirely when
   the user asks for reduced motion. */
(function () {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var layers = [].slice.call(document.querySelectorAll('[data-drift]'));
  if (!layers.length) return;

  var ticking = false;
  function place() {
    var mid = innerHeight / 2;
    layers.forEach(function (el) {
      var box = el.parentNode.getBoundingClientRect();
      if (box.bottom < -200 || box.top > innerHeight + 200) return;
      var progress = (mid - (box.top + box.height / 2)) / innerHeight;
      el.style.transform = 'translate3d(0,' + (progress * +el.dataset.drift).toFixed(1) + 'px,0)';
    });
    ticking = false;
  }
  addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(place); }
  }, { passive: true });
  addEventListener('resize', place, { passive: true });
  place();
})();

// failsafe: if the observer never fires (embedded views that don't composite),
// drop the gate so the page shows content instead of staying blank.
setTimeout(function () {
  if (!document.querySelector('.rv.in')) document.documentElement.classList.remove('js');
}, 1200);
