'use client';

import {useEffect,useRef,useState} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight,Pause,Play} from 'lucide-react';
import {journals} from './data';

const showcase=['ted-001','pdf-deep-reading','ted-027','pdf-human-memory','ted-180'].map(id=>journals.find(book=>book.id===id)!);
export default function JournalWorkshop({onRead}:{onRead:(id:string)=>void}) {
 const [index,setIndex]=useState(0);
 const [paused,setPaused]=useState(false);
 const [canAnimate,setCanAnimate]=useState(false);
 const section=useRef<HTMLElement>(null);
 useEffect(()=>{
   const media=matchMedia('(min-width: 760px) and (prefers-reduced-motion: no-preference)');
   let visible=false;
   const sync=()=>setCanAnimate(media.matches && visible && !document.hidden);
   const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;sync()});
   if(section.current)observer.observe(section.current);
   media.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);
   return ()=>{observer.disconnect();media.removeEventListener('change',sync);document.removeEventListener('visibilitychange',sync)};
 },[]);
 useEffect(()=>{
   if(paused||!canAnimate)return;
   const timer=setInterval(()=>setIndex(i=>(i+1)%showcase.length),8500);
   return ()=>clearInterval(timer);
 },[paused,canAnimate]);
 const book=showcase[index];
 function step(offset:number){setPaused(true);setIndex(i=>(i+offset+showcase.length)%showcase.length)}
 return <section ref={section} className="house-wrap front-hero" aria-labelledby="front-title">
   <div className="front-lead"><p className="house-eyebrow">半知精读 Skill × 半知精读教研团队</p><h1 id="front-title">把一篇读懂，<br/>把实力存下。</h1><p className="front-intro">从一段英文开始。读原文，拆开难句，再用自己的话讲一次。</p>
   <div className="house-actions"><button className="house-button dark" onClick={()=>onRead('small-attention')}>免费试读一本 <ArrowRight size={17}/></button><button className="house-text-link" onClick={()=>{const guide=document.querySelector<HTMLDetailsElement>('#skill-guide');if(guide){guide.open=true;guide.scrollIntoView({block:'center'});guide.querySelector('summary')?.focus({preventScroll:true});}}}>用自己的材料做手账 <ArrowUpRight size={15}/></button></div>
   <p className="front-count">馆藏 {journals.length} 本 · 其中 TED 演讲 {journals.filter(j=>j.tedTopic).length} 本</p></div>
   <div className="front-display"><div className="front-display-bar"><span>馆藏选读</span><span>{String(index+1).padStart(2,'0')} / {String(showcase.length).padStart(2,'0')}</span></div>
   <div className="front-spread" key={book.id}><button className="front-cover" onClick={()=>onRead(book.id)} aria-label={'翻开'+book.title}><img src={book.pdf!.cover} width="220" height="300" decoding="async" alt={book.title+'原版封面'}/></button><div className="front-label"><small>{book.tedTopic?'TED 演讲 · '+book.tedTopic:'精读笔记 · PDF 原稿'}</small><h2>{book.title}</h2><p>{book.desc}</p><p>{book.level} · {book.duration}</p><strong>¥{book.price} / 本</strong></div></div>
   <div className="front-display-bar"><button className="house-text-link" onClick={()=>onRead(book.id)}>翻开试读 <ArrowUpRight size={15}/></button><div className="front-arrows"><button aria-label="上一本" onClick={()=>step(-1)}><ArrowLeft size={16}/></button>{canAnimate&&<button aria-label={paused?'继续轮播':'暂停轮播'} aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?<Play size={15}/>:<Pause size={15}/>}</button>}<button aria-label="下一本" onClick={()=>step(1)}><ArrowRight size={16}/></button></div></div></div>
 </section>;
}
