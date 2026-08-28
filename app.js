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
