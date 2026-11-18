'use client';
import { useEffect, useRef, useState, type PointerEvent, type KeyboardEvent } from 'react';
import { GripVertical, Minus, House, LibraryBig, UsersRound, Sparkles, NotebookPen, RotateCcw } from 'lucide-react';
const items = [['/', '首页', House], ['/cinema', '精读手账', LibraryBig], ['/camp', '陪学营', UsersRound], ['/exhibition', '手帐展', Sparkles], ['/shelf', '我的手账', NotebookPen]] as const;
const key = 'jingdu-navigation-v1';
type Position = { x: number; y: number; collapsed: boolean; floating: boolean };
function bounds(p: Position): Position { return { ...p, x: Math.max(12, Math.min(p.x, Math.max(12, window.innerWidth - (p.collapsed ? 56 : 224) - 12))), y: Math.max(12, Math.min(p.y, Math.max(12, window.innerHeight - (p.collapsed ? 56 : Math.min(590,window.innerHeight-24)) - 12))) }; }
export default function FloatingSidebar({route}: {route:string}) {
  const [position,setPosition] = useState<Position>({x:16,y:16,collapsed:false,floating:false});
  const [ready,setReady] = useState(false); const [dragging,setDragging] = useState(false);
  const current=useRef(position); current.current=position;
  const drag=useRef<{id:number;x:number;y:number;start:Position;moved:boolean}|null>(null);
  const suppressClick=useRef(false); const launcher=useRef<HTMLButtonElement>(null); const handle=useRef<HTMLButtonElement>(null);
  useEffect(()=>{ let p: Position={x:16,y:16,collapsed:window.innerWidth<=900,floating:false}; try {const v=JSON.parse(localStorage.getItem(key)||'null');if(v&&Number.isFinite(v.x)&&Number.isFinite(v.y)&&typeof v.collapsed==='boolean'&&typeof v.floating==='boolean')p=v;}catch{}setPosition(bounds(p));setReady(true);const resize=()=>setPosition(p=>bounds(p));window.addEventListener('resize',resize);return()=>window.removeEventListener('resize',resize);},[]);
  useEffect(()=>{ if(!ready)return;try{localStorage.setItem(key,JSON.stringify(position));}catch{}document.documentElement.classList.toggle('journal-nav-reserved',!position.collapsed&&!position.floating);return()=>document.documentElement.classList.remove('journal-nav-reserved');},[position,ready]);
  function change(collapsed:boolean){ setPosition(p=>bounds({...p,collapsed}));requestAnimationFrame(()=>{(collapsed?launcher:handle).current?.focus();}); }
  function down(e:PointerEvent<HTMLButtonElement>){if(e.button!==0)return;suppressClick.current=false;drag.current={id:e.pointerId,x:e.clientX,y:e.clientY,start:current.current,moved:false};e.currentTarget.setPointerCapture(e.pointerId);}
  function move(e:PointerEvent<HTMLButtonElement>){const d=drag.current;if(!d||d.id!==e.pointerId)return;const dx=e.clientX-d.x,dy=e.clientY-d.y;if(!d.moved&&Math.hypot(dx,dy)<5)return;d.moved=true;setDragging(true);setPosition(bounds({...d.start,x:d.start.x+dx,y:d.start.y+dy,floating:true}));}
  function up(e:PointerEvent<HTMLButtonElement>){const d=drag.current;if(!d||d.id!==e.pointerId)return;suppressClick.current=d.moved;drag.current=null;setDragging(false);if(e.currentTarget.hasPointerCapture(e.pointerId))e.currentTarget.releasePointerCapture(e.pointerId);}
  function keyboard(e:KeyboardEvent<HTMLButtonElement>){const delta:{[key:string]:[number,number]}={ArrowLeft:[-20,0],ArrowRight:[20,0],ArrowUp:[0,-20],ArrowDown:[0,20]};if(delta[e.key]){e.preventDefault();const [x,y]=delta[e.key];setPosition(p=>bounds({...p,x:p.x+x,y:p.y+y,floating:true}));}if(e.key==='Home'){e.preventDefault();setPosition(p=>bounds({...p,x:16,y:16,floating:false}));}if(e.key==='Escape'&&!position.collapsed){e.preventDefault();change(true);}}
  const events={onPointerDown:down,onPointerMove:move,onPointerUp:up,onPointerCancel:up,onKeyDown:keyboard};
  return <aside className={`floating-navigation ${position.collapsed?'is-collapsed':''} ${dragging?'is-dragging':''}`} style={{left:position.x,top:position.y}} aria-label="精读手账馆导航">
    {position.collapsed ? <button ref={launcher} {...events} className="navigation-launcher" aria-label="展开导航（可拖拽移动）" aria-expanded={false} title="点击展开 · 拖动移动" onClick={()=>{if(suppressClick.current){suppressClick.current=false;return;}change(false);}}><img src="./banzhi-logo-transparent.png" alt="" width={38} height={38}/></button> : <>
      <div className="navigation-controls"><button ref={handle} {...events} className="navigation-drag-handle" aria-label="拖动导航；方向键移动，Home 键复位" title="拖动移动 · 方向键也可移动"><GripVertical size={16}/><span>拖动导航</span></button><button className="navigation-reset" aria-label="导航回到左上角" title="回到左上角" onClick={()=>setPosition(p=>bounds({...p,x:16,y:16,floating:false}))}><RotateCcw size={14}/></button><button className="navigation-minimize" onClick={()=>change(true)} aria-label="收起为最小图标" title="收起为最小图标"><Minus size={18}/></button></div>
      <a className="floating-brand" href="#/"><img src="./banzhi-logo-transparent.png" alt="半知" width={42} height={42}/><span>精读手账馆<small>JINGDU JOURNAL HOUSE</small></span></a>
      <nav aria-label="主导航">{items.map(([href,label,Icon])=>{const active=route===href||(href==='/camp'&&route.startsWith('/camp/'))||(href==='/cinema'&&(route.startsWith('/cinema/')||route.startsWith('/journal/')));return <a href={`#${href}`} key={href} aria-current={active?'page':undefined} onClick={()=>{if(window.innerWidth<=900)change(true);}}><Icon size={19} strokeWidth={1.6}/><span>{label}</span></a>;})}</nav><div className="floating-nav-foot"><small>READ DEEPLY.</small><p>把一篇读懂，<br/>把实力存下。</p></div>
    </>}
  </aside>;
}
