'use client';
import { siteFetch as fetch } from './pages-runtime';
import {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowUpRight,Minus,Plus,RotateCcw,Search} from 'lucide-react';
import {catalogStars,describeSubmission,type StarBook} from './journal-tags';
import {cinemaFeed,type CinemaSubmission} from './cinema-data';

type Lens='theme'|'category';
const inks=['#bed3a0','#e9c08b','#94c9c6','#c6b5d5','#e3ada1','#a9c8df','#cfce99','#d3bfa8'];
const polar=(angle:number,r:number)=>({x:320+Math.cos(angle)*r,y:290+Math.sin(angle)*r});
function layout(books:StarBook[],lens:Lens){
  const groups=Array.from(new Set(books.map(b=>b[lens])));
  let start=-Math.PI/2;
  return groups.map((name,i)=>{
    const members=books.filter(b=>b[lens]===name);
    const arc=2*Math.PI*(.5/groups.length+.5*members.length/books.length);
    const angle=start+arc/2;
    const center=polar(angle,142);
    const nodes=members.map((book,k)=>{
      const ring=k%2, lane=Math.floor(k/2), lanes=Math.ceil((members.length-ring)/2);
      return {book,...polar(start+arc*((lane+.5+ring*.12)/(lanes+.12)),ring?240:209)};
    });
    start+=arc;
    return {name,center,nodes,color:inks[i%inks.length]};
  });
}
function initialTag(){
  if(typeof window==='undefined')return '';
  return new URLSearchParams(window.location.hash.split('?')[1]).get('tag')??'';
}
export default function Nebula({onPreview}:{onPreview:(id:string)=>void}){
  const [books,setBooks]=useState(catalogStars),[feed,setFeed]=useState<'loading'|'ready'|'error'>('loading');
  const [lens,setLens]=useState<Lens>('theme'),[query,setQuery]=useState(''),[tag,setTag]=useState(initialTag);
  const [picked,setPicked]=useState(''),[hover,setHover]=useState(''),[scale,setScale]=useState(1),[offset,setOffset]=useState({x:0,y:0});
  const drag=useRef<{x:number;y:number;ox:number;oy:number}|null>(null);
  useEffect(()=>{
    const c=new AbortController();
    async function read(){
      const extra:StarBook[]=[];let before='';
      do {
        const r=await fetch(cinemaFeed+'?view=archive&before='+encodeURIComponent(before),{signal:c.signal});
        if(!r.ok)throw Error();
        const d=await r.json() as {submissions:CinemaSubmission[];next?:string};
        extra.push(...d.submissions.map(describeSubmission));before=d.next??'';
      }while(before);
      if(!c.signal.aborted){setBooks([...catalogStars,...extra]);setFeed('ready');}
    }
    read().catch(()=>{if(!c.signal.aborted)setFeed('error');});
    return ()=>c.abort();
  },[]);
  const groups=useMemo(()=>layout(books,lens),[books,lens]);
  const allTags=useMemo(()=>[...new Set(books.flatMap(b=>b.tags))].sort((a,b)=>a.localeCompare(b,'zh-CN')),[books]);
  const terms=query.trim().toLowerCase().split(/\s+/).filter(Boolean);
  const hits=books.filter(b=>(!tag||b.tags.includes(tag))&&terms.every(t=>(b.title+' '+b.tags.join(' ')).toLowerCase().includes(t)));
  const ids=new Set(hits.map(b=>b.id));
  const selected=hits.find(b=>b.id===picked);
  const filtered=Boolean(query||tag);
  function resetFrame(){setScale(1);setOffset({x:0,y:0});}
  function selectTag(value:string){setTag(value);setPicked('');resetFrame();}
  function reset(){selectTag('');setQuery('');}
  function zoom(n:number){setScale(s=>Math.max(.75,Math.min(2.5,s+n)));}
  return <section className="neb" aria-label="全馆手账星云">
    <div className="neb-top"><div><h2>全馆星云</h2><p>每颗星是一本手账。点亮星点看展签，沿着标签找下一本。</p></div><span>{books.length} 本手账　/　{allTags.length} 个标签</span></div>
    <div className="neb-layout"><aside className="neb-tools"><label className="neb-search"><Search size={15}/><input aria-label="搜索标题或标签" placeholder="搜索标题或标签" value={query} onChange={e=>{setQuery(e.target.value);setPicked('');}}/></label>
    <div className="neb-toggle">{(['theme','category'] as const).map(k=><button key={k} aria-pressed={k===lens} onClick={()=>{setLens(k);selectTag('');}}>{k==='theme'?'按主题':'按品类'}</button>)}</div>
    <h3>星团索引</h3>{groups.map(g=><button className="neb-group" key={g.name} aria-pressed={tag===g.name} onClick={()=>selectTag(tag===g.name?'':g.name)}><i style={{background:g.color}}/>{g.name}<b>{g.nodes.length}</b></button>)}
    <label className="neb-tag-select">全馆标签<select value={tag} onChange={e=>selectTag(e.target.value)}><option value="">所有标签</option>{allTags.map(t=><option key={t}>{t}</option>)}</select></label>
    {filtered&&<button className="neb-clear" onClick={reset}>清除筛选</button>}</aside>
    <div className="neb-stage"><div className="neb-stage-head"><span>{lens==='theme'?'主题星图':'品类星图'}</span><span aria-live="polite">{hits.length} / {books.length} 本</span></div>
    <svg viewBox="0 0 640 580" aria-label="可交互手账星图" className="neb-graph"
      onPointerDown={e=>{if((e.target as Element).closest('[role=button]'))return;drag.current={x:e.clientX,y:e.clientY,ox:offset.x,oy:offset.y};e.currentTarget.setPointerCapture(e.pointerId);}}
      onPointerMove={e=>{const d=drag.current;if(!d)return;const m=e.currentTarget.getScreenCTM();if(m)setOffset({x:d.ox+(e.clientX-d.x)/m.a,y:d.oy+(e.clientY-d.y)/m.d});}}
      onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}>
      <g transform={'translate('+(320+offset.x)+' '+(290+offset.y)+') scale('+scale+') translate(-320 -290)'}>
      {[80,145,210,242].map(radius=><circle key={radius} cx="320" cy="290" r={radius} stroke="#789581" opacity=".27" strokeDasharray="2 6" fill="none"/>)}
      {tag && groups.flatMap(group=>group.nodes).filter(node=>ids.has(node.book.id)).map(node=>
        <path key={node.book.id} d={`M 320 290 Q ${node.x} 290 ${node.x} ${node.y}`} fill="none" stroke="#ead9a7" strokeWidth="1.2" strokeDasharray="3 5" opacity=".65"/>)}
      {groups.map(g=><g key={g.name}><line x1="320" y1="290" x2={g.center.x} y2={g.center.y} stroke={g.color} opacity=".48"/>
      {g.nodes.map(n=>{const active=ids.has(n.book.id);const focus=n.book.id===selected?.id||n.book.id===hover;
        return <g key={n.book.id} opacity={active?1:.14}><line x1={g.center.x} y1={g.center.y} x2={n.x} y2={n.y} stroke={g.color} opacity={focus?1:.45}/>
        <g role="button" tabIndex={active?0:-1} aria-disabled={!active} aria-label={n.book.title} className="neb-node" onFocus={()=>setHover(n.book.id)} onBlur={()=>setHover('')} onPointerEnter={()=>setHover(n.book.id)} onPointerLeave={()=>setHover('')}
         onClick={()=>active&&setPicked(n.book.id)} onKeyDown={e=>{if(active&&(e.key==='Enter'||e.key===' ')){e.preventDefault();setPicked(n.book.id);}}}>
        <title>{n.book.title}</title><circle cx={n.x} cy={n.y} r="12" fill="transparent"/><circle cx={n.x} cy={n.y} r={focus?9:6} fill={g.color} stroke={focus?'white':'#1e392f'} strokeWidth="2"/></g></g>;})}
      <g className="neb-node" role="button" tabIndex={0} aria-label={'筛选'+g.name} onClick={()=>selectTag(g.name)} onKeyDown={e=>{if(e.key==='Enter')selectTag(g.name);}}><circle cx={g.center.x} cy={g.center.y} r="7" fill="#233f34" stroke={g.color} strokeWidth="2"/><text className="neb-svg-label" x={g.center.x} y={g.center.y+22} textAnchor="middle" fill={g.color}>{g.name}</text></g></g>)}
      <circle cx="320" cy="290" r="36" fill="#284b3a" stroke="#b9c5a0"/><text x="320" y="296" textAnchor="middle" fill="#faf6e9" fontSize="16">手账馆</text>
      </g></svg>
      <div className="neb-stage-foot"><span>{books.find(b=>b.id===hover)?.title??'拖动平移 · 点击星点'}</span><div><button aria-label="缩小星图" disabled={scale<=.75} onClick={()=>zoom(-.25)}><Minus size={16}/></button><button aria-label="复位星图" onClick={resetFrame}><RotateCcw size={15}/></button><button aria-label="放大星图" disabled={scale>=2.5} onClick={()=>zoom(.25)}><Plus size={16}/></button></div></div></div>
    <aside className="neb-card" aria-live="polite">{selected?<><small>{selected.theme} ／ 展签</small><h3>{selected.title}</h3>{selected.cover&&<img src={selected.cover} alt={selected.title+'封面'}/>}<p>{selected.description}</p><div className="neb-tags">{selected.tags.map(t=><button key={t} onClick={()=>selectTag(t)}>{t}</button>)}</div>{selected.cover?<button className="neb-open" onClick={()=>onPreview(selected.id)}>翻看原稿 <ArrowUpRight size={14}/></button>:<a className="neb-open" href={selected.href} target={selected.source==='读者投稿'?'_blank':undefined} rel="noreferrer">{selected.source==='读者投稿'?'打开投稿 PDF':'打开手账试读'} <ArrowUpRight size={14}/></a>}<button className="neb-clear" onClick={()=>setPicked('')}>回到目录</button></>:<><small>{filtered?'筛选结果':'馆藏分布'}</small><h3>{tag||'手账目录'}</h3><div className="neb-tally">{['PDF 原稿','网页手账','读者投稿'].map(s=><div key={s}><span>{s}</span><strong>{hits.filter(b=>b.source===s).length}</strong></div>)}</div>
    <div className="neb-results">{hits.map(b=><button key={b.id} onClick={()=>setPicked(b.id)}>{b.title}<span>↗</span></button>)}{!hits.length&&<p>没有匹配的手账。<button onClick={reset}>查看全馆</button></p>}</div></>}</aside></div>
    {feed!=='ready'&&<p role="status">{feed==='loading'?'正在载入读者投稿…':'读者投稿暂未载入，当前展示馆藏目录。'}</p>}
  </section>;
}
