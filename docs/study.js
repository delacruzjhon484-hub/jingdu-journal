(() => {
  const shelf = document.getElementById('shelf');
  const desk = document.getElementById('desk');
  const books = Array.from(document.querySelectorAll('.open-book'));
  const covers = Array.from(shelf.querySelectorAll('.volume'));
  let active = null;
  let lastBook = '';
  function show(shouldFocus) {
    const page = document.getElementById(location.hash.slice(1));
    active = page?.classList.contains('leaf') ? page : null;
    shelf.hidden = Boolean(active);
    desk.hidden = !active;
    document.documentElement.classList.toggle('reading', Boolean(active));
    for (const book of books) {
      book.hidden = !active || !book.contains(active);
      for (const leaf of book.querySelectorAll('.leaf')) leaf.hidden = leaf !== active;
      for (const link of book.querySelectorAll('.inside nav a')) {
        if (active && link.hash === '#'+active.id) link.setAttribute('aria-current','page');
        else link.removeAttribute('aria-current');
      }
    }
    if (active) {
      const book = active.closest('.open-book');
      lastBook = book.dataset.id;
      document.title = book.getAttribute('aria-label') + ' · 半知书房';
      const cover = covers.find(item => item.dataset.volume === lastBook);
      cover.setAttribute('href','#'+active.id);
      try { localStorage.setItem('banzhi-study-page:'+lastBook, active.id); } catch {}
      if (shouldFocus) active.focus({preventScroll:true});
    } else {
      document.title = '半知书房 · 精读手账馆';
      if (shouldFocus) (covers.find(item => item.dataset.volume === lastBook) || shelf).focus({preventScroll:true});
    }
    window.scrollTo(0,0);
  }
  for (const cover of covers) {
    try {
      const saved = localStorage.getItem('banzhi-study-page:'+cover.dataset.volume);
      const leaf = saved && document.getElementById(saved);
      if (leaf && leaf.closest('.open-book')?.dataset.id === cover.dataset.volume) cover.hash = saved;
    } catch {}
  }
  function turn(direction) {
    const link = active?.querySelector('[rel='+direction+']');
    if (link) location.hash = link.hash;
  }
  document.addEventListener('keydown', event => {
    if (!active || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); turn(event.key === 'ArrowRight' ? 'next' : 'prev');
    }
  });
  let start = null;
  desk.addEventListener('touchstart', event => {
    const touch = event.touches[0];
    start = event.touches.length === 1 && active?.contains(event.target) ? [touch.clientX,touch.clientY] : null;
  },{passive:true});
  desk.addEventListener('touchcancel', () => {start=null});
  desk.addEventListener('touchend', event => {
    if (!start || !event.changedTouches.length) return;
    const touch = event.changedTouches[0];
    const dx=touch.clientX-start[0], dy=touch.clientY-start[1];
    start=null;
    if (Math.abs(dx)>60 && Math.abs(dx)>2*Math.abs(dy) && !window.getSelection()?.toString()) turn(dx<0?'next':'prev');
  },{passive:true});
  window.addEventListener('hashchange', () => show(true));
  show(false);
})();
