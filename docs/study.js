(() => {
  const get = id => document.getElementById(id);
  const shelf = get('shelf'), desk = get('desk'), viewer = get('viewer');
  const stage = get('stage'), spread = get('spread'), thumbs = get('thumbs');
  const books = [...document.querySelectorAll('.open-book')];
  const covers = [...shelf.querySelectorAll('.volume')];
  const wide = matchMedia('(min-width: 780px) and (min-aspect-ratio: 6/5)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let book, leaves = [], first = 1, selected = 1, count = 1, lastId = '';
  let zoomed = false, textMode = false, touch, overlay;
  const src = n => './study-pdfs/'+book.dataset.id+'/'+n+'.webp';
  function plate(n) {
    const img = new Image();
    img.src = src(n);
    img.alt = book.getAttribute('aria-label')+'，第 '+n+' 页，'+leaves[n-1].querySelector('.chapter').textContent;
    img.draggable = false;
    return img;
  }
  function jump(n) {
    if (!book || n < 1 || n > leaves.length) return;
    history.replaceState(null,'','#'+leaves[n-1].id);
    render();
  }
  function closeIndex() {
    thumbs.hidden = true;
    get('index').setAttribute('aria-expanded','false');
  }
  function resetZoom() {
    zoomed = false;
    stage.classList.remove('zoomed');
    get('zoom').textContent='放大';
    get('zoom').setAttribute('aria-label','放大书页');
    get('zoom').setAttribute('aria-pressed','false');
  }
  function focusMode(on) {
    viewer.classList.toggle('focused',on);
    document.body.classList.toggle('in-focus',on);
    get('full').textContent=on?'退出':'全屏';
    get('full').setAttribute('aria-pressed',String(on));
  }
  function animateTurn(oldPage,forward) {
    const sheet=document.createElement('div');
    sheet.className='sheet '+(forward?'forward':'backward');
    oldPage.className='front';
    sheet.append(oldPage);
    const bothPages=count===2 && spread.querySelectorAll(':scope > img').length===2;
    if(bothPages) {
      const reverse=plate(forward?first:first+1);
      reverse.className='reverse';
      reverse.alt='';
      sheet.classList.add('two-sided');
      sheet.append(reverse);
    }
    sheet.setAttribute('aria-hidden','true');
    spread.append(sheet);
    overlay=sheet;
    sheet.addEventListener('animationend',()=>sheet.remove(),{once:true});
  }
  function render(moveFocus=false) {
    const target=get(location.hash.slice(1));
    const chosen=target?.classList.contains('leaf') ? target.closest('.open-book') : null;
    const changed=chosen!==book;
    const oldFirst=first, oldCount=count;
    const previous=[...spread.querySelectorAll(':scope > img')];
    if (overlay) overlay.remove();
    book=chosen;
    books.forEach(b=>b.hidden=true);
    shelf.hidden=!!book;
    desk.hidden=viewer.hidden=!book;
    if (!book) {
      if(document.fullscreenElement===viewer) document.exitFullscreen?.().catch(()=>{});
      focusMode(false);
      document.title='半知书房 · 精读手账馆';
      if(moveFocus) (covers.find(c=>c.dataset.volume===lastId)||shelf).focus({preventScroll:true});
      return;
    }
    if(changed) {
      closeIndex(); resetZoom(); textMode=false;
      stage.scrollTop=stage.scrollLeft=0;
      leaves=[...book.querySelectorAll('.leaf')];
      lastId=book.dataset.id;
      get('pdf').href='./study-pdfs/'+lastId+'/journal.pdf';
      const title=book.getAttribute('aria-label');
      get('book-title').textContent=title;
      document.title=title+' · 半知书房';
      thumbs.replaceChildren(...leaves.map((leaf,i)=>{
        const button=document.createElement('button');
        button.type='button';
        const img=plate(i+1); img.loading='lazy'; img.alt='';
        const label=document.createElement('span');
        label.textContent=(i+1)+' · '+leaf.querySelector('.chapter').textContent;
        button.append(img,label);
        button.onclick=()=>{ closeIndex(); jump(i+1); get('index').focus(); };
        return button;
      }));
    }
    selected=leaves.indexOf(target)+1;
    count=wide.matches && !textMode ? 2 : 1;
    first=selected-((selected-1)%count);
    const end=Math.min(first+count-1,leaves.length);
    const pages=[];
    for(let n=first;n<=end;n++) pages.push(plate(n));
    spread.classList.toggle('double',count===2);
    spread.classList.toggle('last-single',count===2 && pages.length===1);
    spread.replaceChildren(...pages);
    if(!changed && oldCount===count && oldFirst!==first && !reduced.matches && !zoomed && !textMode && previous.length) {
      animateTurn((first>oldFirst?previous.at(-1):previous[0]),first>oldFirst);
    }
    stage.hidden=textMode;
    get('transcript').hidden=!textMode;
    get('text-mode').setAttribute('aria-pressed',String(textMode));
    get('text-mode').textContent=textMode?'翻页版':'文字版';
    get('zoom').disabled=textMode;
    if(textMode) get('transcript').replaceChildren(target.querySelector('.leaf-content').cloneNode(true));
    get('position').textContent=(first===end?String(first):first+'–'+end)+' / '+leaves.length;
    get('prev').disabled=first===1;
    get('next').disabled=end===leaves.length;
    [...thumbs.children].forEach((b,i)=>b.setAttribute('aria-current',i+1===selected?'page':'false'));
    const cover=covers.find(c=>c.dataset.volume===lastId);
    cover.hash=target.id;
    try{localStorage.setItem('banzhi-study-page:'+lastId,target.id);}catch{}
    if(moveFocus && changed){stage.focus({preventScroll:true});window.scrollTo(0,0);}
  }
  covers.forEach(c=>{
    try{const leaf=get(localStorage.getItem('banzhi-study-page:'+c.dataset.volume));
      if(leaf?.closest('.open-book')?.dataset.id===c.dataset.volume)c.hash=leaf.id;
    }catch{}
  });
  get('prev').onclick=()=>jump(first-count);
  get('next').onclick=()=>jump(first+count);
  get('index').onclick=()=>{
    thumbs.hidden=!thumbs.hidden;
    get('index').setAttribute('aria-expanded',String(!thumbs.hidden));
    if(!thumbs.hidden) thumbs.querySelector('[aria-current="page"]')?.focus();
  };
  get('text-mode').onclick=()=>{textMode=!textMode;resetZoom();render();};
  get('zoom').onclick=()=>{
    if(zoomed) return resetZoom();
    zoomed=true;stage.classList.add('zoomed');
    get('zoom').textContent='还原';get('zoom').setAttribute('aria-label','还原书页尺寸');
    get('zoom').setAttribute('aria-pressed','true');
  };
  get('full').onclick=async()=>{
    if(document.fullscreenElement===viewer){ await document.exitFullscreen();return; }
    if(viewer.classList.contains('focused')){focusMode(false);return;}
    focusMode(true);
    try{await viewer.requestFullscreen?.();}catch{/* Keep focus mode on unsupported devices. */}
  };
  document.addEventListener('fullscreenchange',()=>focusMode(document.fullscreenElement===viewer));
  document.addEventListener('keydown',e=>{
    if(!book || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey)return;
    if(e.key==='Escape'){if(!thumbs.hidden){closeIndex();get('index').focus();}else focusMode(false);return;}
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){
      if(zoomed && document.activeElement===stage)return;
      e.preventDefault();jump(first+(e.key==='ArrowRight'?count:-count));
    }
  });
  stage.addEventListener('touchstart',e=>{touch=!zoomed && e.touches.length===1 ? [e.touches[0].clientX,e.touches[0].clientY]:null;},{passive:true});
  stage.addEventListener('touchcancel',()=>touch=null);
  stage.addEventListener('touchend',e=>{
    if(!touch)return;
    const dx=e.changedTouches[0].clientX-touch[0],dy=e.changedTouches[0].clientY-touch[1];
    touch=null;if(Math.abs(dx)>48 && Math.abs(dx)>1.5*Math.abs(dy))jump(first+(dx<0?count:-count));
  },{passive:true});
  wide.addEventListener('change',()=>render());
  window.addEventListener('hashchange',()=>render(true));
  render();
})();
