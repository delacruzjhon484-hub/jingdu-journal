'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, FileText, Pause, Play, Sparkles } from 'lucide-react';
import { journals } from './data';

const phases = [
  { label: 'Skill 制作', title: '把资料，整理成能学的一本。', copy: '半知精读 Skill 辅助整理英语资料，把词句理解、内容拆解和学习练习放进一份精读手账。' },
  { label: '教研精选', title: '海量制作之后，再认真挑一本。', copy: '石雄带领半知精读教研团队，从选题价值、讲解清晰度与练习设计逐一筛选；值得继续打磨的，回到制作环节。' },
  { label: '进入手账馆', title: '读懂一篇，留下自己的理解。', copy: '精选手账按主题归入手账馆。你可以独立精读，也可以加入陪学营，和老师、学习伙伴一起读。' },
];
const picks = ['small-attention', 'travel-confirm-first', 'ielts-small-story'].map(id => journals.find(j => j.id === id)!);
const flowingBooks = [...journals.filter(j => j.category === '英语精读'), ...journals].slice(0, 13);

export default function JournalWorkshop({ onRead, onGetSkill, installOpen }: { onRead: (id: string) => void; onGetSkill: () => void; installOpen: boolean }) {
  const root = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState(0);
  const [paused, setPaused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [reduced, setReduced] = useState(false);
  const stopped = paused || offscreen || hidden || reduced;
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotion = () => setReduced(media.matches);
    const updateVisibility = () => setHidden(document.hidden);
    updateMotion(); updateVisibility();
    media.addEventListener('change', updateMotion);
    document.addEventListener('visibilitychange', updateVisibility);
    const observer = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), { rootMargin: '80px' });
    if (root.current) observer.observe(root.current);
    return () => { observer.disconnect(); media.removeEventListener('change', updateMotion); document.removeEventListener('visibilitychange', updateVisibility); };
  }, []);
  useEffect(() => {
    if (stopped) return;
    const timer = setInterval(() => setPhase(value => (value + 1) % phases.length), 6000);
    return () => clearInterval(timer);
  }, [stopped, phase]);
  return <section className="journal-workshop" ref={root} data-paused={stopped} data-phase={phase} aria-labelledby="workshop-title">
    <div className="workshop-intro house-wrap"><span className="house-eyebrow"><Sparkles size={14}/> 半知精读 Skill × 半知精读教研团队</span><h1 id="workshop-title">海量精读手账，<br/>一本一本<span>认真做。</span></h1><p>半知精读 Skill，让英语资料成为可阅读、可学习的精读手账。<br/>石雄带领教研团队精细筛选，把值得学的一本，送到你面前。</p><div className="workshop-actions"><button className="house-button dark" onClick={onGetSkill} aria-expanded={installOpen} aria-controls="get-banzhi-skill">获取半知精读 Skill <ArrowDown size={15}/></button><button className="house-text-link" onClick={() => onRead('small-attention')}>翻开一本试读 <ArrowUpRight size={15}/></button></div><span className="workshop-available"><i/>已可在 Workbuddy 技能中下载使用</span></div>
    <div className="workshop-scene house-wrap"><div className="workshop-scene-top"><span>THE JOURNAL WORKSHOP <i/> 一份资料，一本手账</span><button onClick={() => setPaused(!paused)} className="workshop-motion" disabled={reduced} aria-label={reduced ? '已按系统偏好减少动画' : paused ? '播放主视觉动画' : '暂停主视觉动画'} aria-pressed={paused || reduced}>{paused || reduced ? <Play size={12}/> : <Pause size={12}/>}<span>{reduced ? '静态展示' : paused ? '播放' : '暂停'}</span></button></div>
      <div className="workshop-stage">
        <div className="workshop-source" aria-hidden="true"><div className="workshop-source-paper"><FileText size={18}/><span>ENGLISH MATERIAL</span><b>英语资料</b><i/><i/><i/><small>文章 · 演讲 · 书籍</small></div><div className="workshop-source-paper behind"/></div>
        <div className="workshop-stream" aria-hidden="true">{flowingBooks.map((journal, i) => <div key={i} className={`workshop-flow-book ${i % 4 === 2 ? 'needs-rework' : ''}`} style={{ '--book-paper': journal.color, '--book-ink': journal.accent, '--book-delay': `${-i * 2.2}s` } as CSSProperties}><div className="workshop-raw-face"><span>READING MATERIAL</span><FileText size={23}/><b>一份英语资料</b><i/><i/><small>从一个问题开始</small></div><div className="workshop-book-face"><span>精读手账 / {String(i + 1).padStart(2, '0')}</span><strong>{journal.title}</strong><small>{journal.en}</small><div><BookOpen size={12}/><span>读 · 拆 · 写 · 用</span></div></div><span className="workshop-book-check"><Check size={11}/>精选</span></div>)}</div>
        <div className="workshop-belt" aria-hidden="true"><div className="workshop-belt-track"/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/><span/></div>
        <button className="workshop-station workshop-skill" onClick={() => setPhase(0)} aria-pressed={phase === 0} aria-controls="workshop-explanation"><span className="workshop-station-number">01 / MAKE</span><div className="workshop-skill-mark"><Sparkles size={26}/><span>Skill</span></div><strong>半知精读</strong><small>把资料，做成手账</small><span className="workshop-status-dot"/></button>
        <button className="workshop-station workshop-editor" onClick={() => setPhase(1)} aria-pressed={phase === 1} aria-controls="workshop-explanation"><span className="workshop-station-number">02 / CURATE</span><div className="workshop-editor-head"><span className="workshop-founder-stamp">石</span><div><strong>石雄带领</strong><small>半知精读教研团队</small></div><Check size={19}/></div><div className="workshop-editor-checks"><span>选题价值</span><span>讲解清晰</span><span>练习设计</span></div><span className="workshop-editor-seal">一本一本，精细筛选</span></button>
        <div className="workshop-rework" aria-hidden="true"><span>↺</span>再打磨，再出发</div>
        <button className="workshop-station workshop-library" onClick={() => setPhase(2)} aria-pressed={phase === 2} aria-controls="workshop-explanation"><span className="workshop-station-number">03 / LEARN</span><div className="workshop-mini-shelf"><i>外刊</i><i>TED</i><i>名著</i><i>更多</i></div><strong>精读手账馆</strong><small>按主题，找到你的一本</small></button>
        <div className="workshop-stage-labels" aria-hidden="true"><span>英语学习资料</span><ArrowRight size={13}/><span>Skill 辅助制作</span><ArrowRight size={13}/><span>教研精细筛选</span><ArrowRight size={13}/><span>你的下一本精读</span></div>
      </div>
      <div className="workshop-explanation" id="workshop-explanation"><div className="workshop-phase-picker" role="group" aria-label="查看手账制作环节">{phases.map((item, i) => <button key={item.label} aria-pressed={phase === i} onClick={() => setPhase(i)}><span>0{i + 1}</span>{item.label}</button>)}</div><div className="workshop-phase-copy"><h2>{phases[phase].title}</h2><p>{phases[phase].copy}</p></div></div>
      <div className="workshop-picks"><span>先翻一本<br/><small>原创体验篇</small></span>{picks.map(journal => <button key={journal.id} onClick={() => onRead(journal.id)}><span className="workshop-pick-spine" style={{ background: journal.accent }}/><span><strong>{journal.title.replace('\n', '')}</strong><small>{journal.duration} · 点击试读</small></span><ArrowUpRight size={15}/></button>)}</div><p className="workshop-disclosure">制作与筛选流程示意 · 流动封面为本站原创体验篇 · 主题分类展示内容拓展方向</p>
    </div>
  </section>;
}
