/* Rylo — motion: lifestyle/closing-banner parallax + Apple-style scroll reveals.
   GPU-accelerated (transform), rAF-throttled, and disabled for reduced-motion users. */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Subtle parallax on the lifestyle bands + closing CTA photo */
  function parallax() {
    if (reduce) return;
    var imgs = Array.prototype.slice.call(document.querySelectorAll('.evidence-img, .fcta-bg'));
    if (!imgs.length) return;
    var ticking = false;

    function update() {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for (var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        var sec = img.closest ? img.closest('.evidence, .fcta') : null;
        if (!sec) continue;
        var r = sec.getBoundingClientRect();
        if (r.bottom < -120 || r.top > vh + 120) continue;
        var progress = (r.top + r.height / 2 - vh / 2) / vh;
        var range = sec.offsetHeight * (sec.classList && sec.classList.contains('fcta') ? 0.045 : 0.12);
        var y = progress * range * 1.5;
        if (y > range) y = range; else if (y < -range) y = -range;
        img.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
      }
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* Gentle rise + fade as each block scrolls into view (scroll-sweep — reveals
     anything in view OR already scrolled past, so nothing stays stuck hidden) */
  function reveals() {
    if (reduce) return;
    var els = Array.prototype.slice.call(
      document.querySelectorAll('.how-header, .how-card, .pcard, .evidence-inner, .fcta-content')
    );
    if (!els.length) return;
    els.forEach(function (el) { el.classList.add('rl-reveal'); });
    var pending = els.slice();
    var ticking = false;

    function check() {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      var still = [];
      for (var i = 0; i < pending.length; i++) {
        var el = pending[i];
        if (el.getBoundingClientRect().top < vh * 0.88) {
          var delay = 0;
          if (el.classList.contains('how-card') && el.parentNode) {
            var sibs = Array.prototype.slice.call(el.parentNode.children);
            delay = Math.max(0, sibs.indexOf(el)) * 100; // stagger the step cards
          }
          el.style.transitionDelay = delay + 'ms';
          el.classList.add('rl-in');
        } else {
          still.push(el);
        }
      }
      pending = still;
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(check); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    check();
  }

  function init() { parallax(); reveals(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
