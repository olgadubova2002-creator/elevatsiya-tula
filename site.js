(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // лента hero: прогресс скролла внутри секции ведёт кадры вверх
  var hero = document.querySelector('.hero');
  var stage = document.querySelector('.hero__stage');
  var ticking = false;
  function progress() {
    ticking = false;
    if (!hero || reduce) return;
    var r = hero.getBoundingClientRect();
    var span = r.height - window.innerHeight;
    var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    stage.style.setProperty('--p', p.toFixed(4));
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(progress); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  progress();

  // выход частей секций по очереди
  var items = [].slice.call(document.querySelectorAll('.rv'));
  items.forEach(function (el, i) { el.style.setProperty('--d', ((i % 3) * 0.08) + 's'); });
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('in'); });
  }

  // живое: выбор направления меняет фото слева
  var photo = document.getElementById('dirPhoto');
  var links = [].slice.call(document.querySelectorAll('#dirs a'));
  function pick(a) {
    links.forEach(function (l) { l.classList.toggle('on', l === a); });
    var src = a.getAttribute('data-photo');
    if (photo && src && photo.getAttribute('src') !== src) {
      photo.style.opacity = '0';
      setTimeout(function () { photo.setAttribute('src', src); photo.style.opacity = '1'; }, 180);
    }
  }
  links.forEach(function (a) {
    a.addEventListener('mouseenter', function () { pick(a); });
    a.addEventListener('focus', function () { pick(a); });
    // на телефоне первое касание выбирает направление, второе звонит
    a.addEventListener('click', function (e) {
      if (!a.classList.contains('on')) { e.preventDefault(); pick(a); }
    });
  });
  if (links[0]) links[0].classList.add('on');
})();
