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

// failsafe: if the observer never fires (embedded views that don't composite),
// drop the gate so the page shows content instead of staying blank.
setTimeout(function () {
  if (!document.querySelector('.rv.in')) document.documentElement.classList.remove('js');
}, 1200);
