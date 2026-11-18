'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import Nebula from './journal-nebula';
import { rooms } from './journal-tags';
import { importedJournals } from './imported-journals';

const gallery = importedJournals.flatMap(j => j.pdf?.previews.length ? [{ ...j, pdf: j.pdf }] : []);
type Exhibit = (typeof gallery)[number];
const roomOf = (item: Exhibit) => rooms.find(room => room.ids.includes(item.id.slice(4)))?.name ?? '其他';
const selections = ['pdf-plant-intelligence','pdf-printing-press','pdf-deep-reading'].map(id => gallery.find(item=>item.id===id)!);

function Viewer({ item, close }: { item: Exhibit; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const gesture = useRef<{x:number;y:number}|null>(null);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(false);
  const previews = item.pdf.previews;
  const sheet = previews[page];
  function turn(next: number) {
    if (next < 0 || next >= previews.length) return;
    setPage(next);
    setZoom(false);
    stage.current?.scrollTo(0, 0);
  }
  useEffect(() => {
    const modal = dialog.current!;
    modal.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { modal.close(); document.body.style.overflow = overflow; };
  }, []);
  return <dialog className="ex-viewer" ref={dialog} aria-labelledby="ex-name" onCancel={e=>{e.preventDefault();close();}}
    onKeyDown={e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();turn(page+(e.key==='ArrowRight'?1:-1));}}}>
    <header><div><small>{roomOf(item)}</small><h2 id="ex-name">{item.title}</h2></div><button onClick={close} aria-label="关闭展品"><X/></button></header>
    <div className={'ex-sheet'+(zoom?' zoomed':'')} ref={stage}
      onTouchStart={e=>{gesture.current=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;}}
      onTouchEnd={e=>{const start=gesture.current;gesture.current=null;if(!start||zoom)return;const dx=e.changedTouches[0].clientX-start.x,dy=e.changedTouches[0].clientY-start.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.5)turn(page+(dx<0?1:-1));}}>
      <img key={sheet.src} src={sheet.src} alt={item.title+' · 原稿第 '+sheet.page+' 页'} />
    </div>
    <div className="ex-controls"><div className="ex-pager"><button disabled={!page} onClick={()=>turn(page-1)} aria-label="上一张展页"><ChevronLeft/></button><span aria-live="polite">展页 {page+1} / {previews.length}<small>原稿第 {sheet.page} 页</small></span><button disabled={page===previews.length-1} onClick={()=>turn(page+1)} aria-label="下一张展页"><ChevronRight/></button></div>
    <button aria-pressed={zoom} onClick={()=>setZoom(!zoom)}>{zoom?<ZoomOut size={17}/>:<ZoomIn size={17}/>} {zoom?'适合窗口':'放大细看'}</button>
    <a href={'#/journal/'+item.id} onClick={close}>手账详情 <ArrowUpRight size={16}/></a></div>
  </dialog>;
}

export default function JournalExhibition(){
  const [mode,setMode]=useState<'nebula'|'wall'>('nebula');
  const [room,setRoom]=useState('全部');
  const [feature,setFeature]=useState(0);
  const [view,setView]=useState<Exhibit|null>(null);
  const featured=selections[feature];
  const works=gallery.filter(item=>room==='全部'||roomOf(item)===room);
  return <div className="exhibition house-wrap">
    <header className="ex-title"><h1>手帐展</h1><div className="ex-rooms" aria-label="展览视图"><button aria-pressed={mode==='nebula'} onClick={()=>setMode('nebula')}>手账星云</button><button aria-pressed={mode==='wall'} onClick={()=>setMode('wall')}>原稿展墙</button></div></header>
    {mode==='nebula'?<Nebula onPreview={id=>setView(gallery.find(j=>j.id===id)??null)}/>:<><section className="ex-feature" aria-label="轮看精选展品">
      <div className="ex-feature-label"><small>精选展品 ／ {roomOf(featured)}</small><h2>{featured.title}</h2><p>{featured.desc}</p><button onClick={()=>setView(featured)}>翻开展品 <ArrowUpRight size={16}/></button>
      <div className="ex-switch"><button aria-label="上一件精选展品" onClick={()=>setFeature((feature+2)%3)}><ArrowLeft size={17}/></button><span>{feature+1} / 3</span><button aria-label="下一件精选展品" onClick={()=>setFeature((feature+1)%3)}><ArrowRight size={17}/></button></div></div>
      <button className="ex-folio" onClick={()=>setView(featured)} aria-label={'翻看'+featured.title}><span key={featured.id}><img className="ex-back" src={featured.pdf.previews[1].src} alt="" /><img className="ex-front" src={featured.pdf.cover} alt={featured.title+'封面'}/></span></button>
    </section>
    <section aria-labelledby="wall-heading"><div className="ex-wall-head"><h2 id="wall-heading">展品墙</h2><div className="ex-rooms" role="group" aria-label="按展区筛选">{['全部',...rooms.map(r=>r.name)].map(name=><button key={name} aria-pressed={name===room} onClick={()=>setRoom(name)}>{name}</button>)}</div></div>
    <div className="ex-grid">{works.map(item=><button className="ex-work" key={item.id} onClick={()=>setView(item)} style={{'--mat':item.color} as CSSProperties}><span className="ex-mat"><img src={item.pdf.cover} alt="" loading="lazy"/><span className="ex-peek">翻看 <ArrowUpRight size={13}/></span></span><small>{roomOf(item)} · {item.pdf.previews.length} 张展页</small><strong>{item.title}</strong></button>)}</div></section>
    </>}
    {view&&<Viewer key={view.id} item={view} close={()=>setView(null)}/>}
  </div>;
}
