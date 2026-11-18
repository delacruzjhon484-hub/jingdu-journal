'use client';
import { siteFetch as fetch } from './pages-runtime';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ArrowUpRight, ArrowRight, ArrowLeft, Check, Plus, X, BookOpen, Bookmark, Download, ChevronDown, Copy, CheckCheck, Menu, PenLine, Headphones, Layers3, Sparkles, Clock3, ShoppingBag, House, LibraryBig, UsersRound, NotebookPen } from 'lucide-react';
import { journals, lessons, clubTasks, type Journal } from './data';
import SceneBoard from './scene-board';
import { useJournalProduct, PurchasePanel, JournalPurchase } from './journal-purchase';
import { PdfJournalReader } from './pdf-journal-reader';
import FloatingSidebar from './floating-sidebar';
import { LearningSnapshot } from './journal-experience';
import ReadingHouse from './reading-house';
import ReadingCamp from './reading-camp';
import BanzhiCommunity from './banzhi-community';
import JournalCinema from './journal-cinema';
import BoardLists, { AddToList, ListEditor, useBoardListFeed, type BoardListFeedState } from './board-lists';
import { boardListEndpoint, wantToReadId, type BoardListDraft, type PersonalBoardList } from './board-lists-data';
import { savedExerciseTitles, type LearningRecords } from './reading-records';

type LocalState = { records: LearningRecords; outputs: Record<string, string>; lessonNotes: string[]; completedLessons: number[]; clubNotes: string[]; completedDays: number[]; shortlist: string[]; plan: string };
const emptyState: LocalState = { records: {}, outputs: {}, lessonNotes: ['', '', '', ''], completedLessons: [], clubNotes: Array(7).fill(''), completedDays: [], shortlist: [], plan: '' };
const KEY = 'everything-journal-v1';
const navItems = [['/', '首页'], ['/cinema', '精读手账'], ['/camp', '陪学营'], ['/community', '半知搭子'], ['/shelf', '我的手账']];
const navIcons = [House, LibraryBig, UsersRound, Sparkles, NotebookPen];
function escapeHtml(value: string) { return value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)); }
function downloadNotes(journal: Journal, note: string) {
  const html = `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>${escapeHtml(journal.title.replace('\n',''))} · 我的笔记</title><style>body{max-width:740px;margin:60px auto;padding:0 25px;font:17px/1.9 system-ui}p{white-space:pre-wrap}</style><small>精读手账馆 / 我的个人学习笔记</small><h1>${escapeHtml(journal.title.replace('\n',''))}</h1><p>${escapeHtml(note || '尚未填写笔记。')}</p><footer>本文件仅包含你写下的笔记，不含完整付费手账。</footer></html>`;
  const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download=`${journal.id}-my-notes.html`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
function Logo({ small = false }: { small?: boolean }) { return <a href="#/" className={`brand ${small ? 'brand-small' : ''}`} aria-label="精读手账馆首页"><img className="house-brand-logo" src="./banzhi-logo-transparent.png" alt="半知" width={55} height={55}/><span>精读手账馆<small>JINGDU JOURNAL HOUSE</small></span></a>; }
function AppIcon({ code, color, small = false }: { code: string; color: string; small?: boolean }) { return <span className={`app-icon ${small ? 'small' : ''}`} style={{ '--app-color': color } as CSSProperties}>{code}</span>; }
function Cover({ journal, mini = false }: { journal: Journal; mini?: boolean }) {
  return <div className={`cover cover-${journal.code} ${mini ? 'cover-mini' : ''}`} style={{ '--cover-color': journal.color, '--cover-accent': journal.accent } as CSSProperties}>
    <div className="cover-top"><span>精读手账馆</span><span>VOL. 0{journals.indexOf(journal)+1}</span></div>
    <h3>{journal.title.split('\n').map((line,i)=><span key={i}>{line}</span>)}</h3>
    <div className="cover-art" aria-hidden="true"><span className="art-circle"/><span className="art-square"/><span className="art-line"/><span className="art-star">✳</span></div>
    <div className="cover-bottom"><span>{journal.en}</span><b>{journal.code}</b></div>
    <span className="cover-binding" aria-hidden="true"/>
  </div>;
}
function Modal({ title, children, onClose, wide = false }: { title: string; children: ReactNode; onClose: () => void; wide?: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current!; dialog.showModal(); const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous; }; }, []);
  return <dialog ref={ref} className={`modal ${wide ? 'modal-wide' : ''}`} aria-label={title} onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === ref.current) onClose(); }}><div className="modal-head"><span>{title}</span><button className="icon-button" onClick={onClose} aria-label="关闭窗口"><X size={21}/></button></div>{children}</dialog>;
}
function Reader({ journal: preview, record, update, toast, lists, onClose }: { journal: Journal; record: { note: string; done: boolean }; update: (record: { note: string; done: boolean }) => void; toast: (s: string) => void; lists: BoardListFeedState; onClose: () => void }) {
  const product = useJournalProduct(preview.id);
  const journal = product.content ?? preview;
  const owned = Boolean(product.content);
  const [buyOpen, setBuyOpen] = useState(false);
  const [bilingual, setBilingual] = useState(true); const [answer, setAnswer] = useState(false);
  if (preview.pdf) return <PdfJournalReader journal={preview} product={product} record={record} update={update}/>;
  return <div className="reader"><div className="reader-toolbar"><span><AppIcon code={journal.code} color={journal.accent} small/>{owned ? '完整已购手账' : '精读手账试读'}</span>{journal.translation.length > 0 && <button className={`pill ${bilingual ? 'active' : ''}`} aria-pressed={bilingual} onClick={()=>setBilingual(!bilingual)}>{bilingual ? '中英对照' : '仅看英文'}</button>}<span className="reader-price">¥12.9 / 本</span>{owned ? <a className="text-button" href={`/api/journal-content?id=${journal.id}&download=1`}><Download size={16}/>下载已购手账</a> : <button className="text-button" onClick={()=>setBuyOpen(v=>!v)} aria-expanded={buyOpen}>购买完整手账 · ¥12.9 <ArrowUpRight size={15}/></button>}</div>
    <div className="reader-content">{(buyOpen || owned) && <PurchasePanel id={journal.id} product={product}/>}<span className="eyebrow">{journal.en}</span><h2>{journal.title.replace('\n','')}</h2><p className="reader-intro">{journal.outcome}</p>
      {journal.passages.map((passage,i)=><section className="passage" key={i}><span className="passage-number">0{i+1}</span><p className={journal.category === '英语精读' ? 'english-passage' : ''}>{passage}</p>{bilingual && journal.translation[i] && <p className="translation">{journal.translation[i]}</p>}</section>)}
      {!owned && <div className="trial-boundary"><span>试读到这里 · 完整手账共 {journal.totalPassages ?? 3} 个段落</span><p>购买后解锁完整内容、词句讲解与参考思路，并下载留存。</p><button className="btn btn-dark" onClick={()=>{setBuyOpen(true);requestAnimationFrame(()=>document.getElementById('journal-purchase')?.scrollIntoView({behavior:'smooth',block:'center'}));}}>购买完整手账 · ¥12.9 <ArrowUpRight size={15}/></button></div>}
      <div className="vocabulary"><h3><PenLine size={17}/>把这些留在手账里</h3>{journal.vocabulary.map(v=><p key={v}>{v}</p>)}</div>
      {owned && <div className="question-block"><small>CHECK YOUR UNDERSTANDING</small><h3>{journal.question}</h3><button className="text-button" onClick={()=>setAnswer(!answer)} aria-expanded={answer}>{answer ? '收起参考思路' : '先想一想，再看参考思路'}<ChevronDown size={15}/></button>{answer && <p className="answer">{journal.answer}</p>}</div>}
      <label className="notes-label" htmlFor="reader-note"><PenLine size={17}/>轮到你了</label><p>{journal.task}</p><textarea id="reader-note" rows={4} placeholder="用自己的话写下来。笔记自动保存在当前浏览器。" value={record.note} onChange={e=>update({ ...record, note: e.target.value })}/><div className="note-status"><span>仅保存在当前浏览器</span><button className={record.done ? 'btn btn-green' : 'btn btn-dark'} onClick={()=>update({ ...record, done: !record.done })}>{record.done ? <CheckCheck size={17}/> : <Check size={17}/>} {record.done ? (owned ? '已完成这次精读' : '已完成试读练习') : (owned ? '标记本次精读完成' : '完成试读练习')}</button></div>
      <div className="reader-next"><AddToList journalId={journal.id} lists={lists}/><div>
        <a href={`#/journal/${journal.id}`} onClick={onClose}>手账详情 <ArrowUpRight size={13}/></a>
        <a href="#/method" onClick={onClose}>学精读方法 <ArrowUpRight size={13}/></a>
        {journal.category === '英语精读' && <a href="#/club" onClick={onClose}>七天英语练习 <ArrowUpRight size={13}/></a>}
        <a href="#/camp" onClick={onClose}>了解陪学营 <ArrowUpRight size={13}/></a>
        <a href="#/shelf" onClick={onClose}>我的手账 <ArrowUpRight size={13}/></a>
      </div></div>
      <div className="source-note"><b>关于这份内容</b><p>本站原创示例文本与练习，供个人学习、打印和批注。所有情境均为教学虚构，未收录第三方外刊全文、演讲文稿或音视频。{owned ? '当前为已购完整手账，可下载留存。' : '当前显示试读节选；购买后可下载完整手账。'}</p></div>
    </div></div>;
}
export default function Home() {
  const [route, setRoute] = useState('/'); const [mobileNav, setMobileNav] = useState(false);
  const lists = useBoardListFeed();
  const [createDraft, setCreateDraft] = useState<BoardListDraft | null>(null);
  const [selectedList, setSelectedList] = useState(wantToReadId);
  const [migrationError, setMigrationError] = useState(false);
  const migrating = useRef(false);
  const [local, setLocal] = useState<LocalState>(emptyState); const [loaded, setLoaded] = useState(false);
  const [readerId, setOpenReaderId] = useState<string|null>(null);
  const [activeLesson, setActiveLesson] = useState(0); const [clubDay, setClubDay] = useState(0); const [message, setMessage] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout>|null>(null);
  function toast(text: string) { setMessage(text); if (toastTimer.current) clearTimeout(toastTimer.current); toastTimer.current = setTimeout(()=>setMessage(''), 3800); }
  useEffect(() => {
    function updateRoute() {
      let next = window.location.hash.slice(1) || '/';
      if (next === '/network' || next === '/store' || next === '/plans') {
        next = next === '/store' ? '/cinema' : next === '/plans' ? '/camp' : '/board';
        window.history.replaceState(window.history.state, '', `#${next}`);
      }
      setRoute(next);
      setMobileNav(false);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    updateRoute();
    window.addEventListener('hashchange', updateRoute);
    return () => window.removeEventListener('hashchange', updateRoute);
  }, []);
  useEffect(()=>{ try { const raw = localStorage.getItem(KEY); if (raw) { const parsed = JSON.parse(raw); const merged = { ...emptyState }; if (parsed && typeof parsed === 'object') { merged.records = Object.fromEntries(Object.entries(parsed.records || {}).filter(([id,v])=>journals.some(j=>j.id===id)&&v&&typeof v==='object'&&typeof (v as {note:unknown}).note==='string'&&typeof (v as {done:unknown}).done==='boolean')) as LearningRecords; merged.outputs = Object.fromEntries(Object.keys(savedExerciseTitles).flatMap(id => typeof parsed.outputs?.[id] === 'string' && parsed.outputs[id].trim() ? [[id, parsed.outputs[id]]] : [])); merged.shortlist = Array.isArray(parsed.shortlist) ? [...new Set<string>(parsed.shortlist.filter((id:unknown)=>journals.some(j=>j.id===id)))] : []; merged.plan = typeof parsed.plan==='string' ? parsed.plan : ''; for (const field of ['lessonNotes','clubNotes'] as const) { merged[field] = emptyState[field].map((v,i)=>typeof parsed[field]?.[i]==='string' ? parsed[field][i] : v); } merged.completedLessons = Array.isArray(parsed.completedLessons) ? parsed.completedLessons.filter((n:unknown)=>Number.isInteger(n)&&Number(n)>=0&&Number(n)<4) : []; merged.completedDays = Array.isArray(parsed.completedDays) ? parsed.completedDays.filter((n:unknown)=>Number.isInteger(n)&&Number(n)>=0&&Number(n)<7) : []; setLocal(merged); } } } catch { toast('未能读取之前的笔记，可继续体验并下载保存'); } setLoaded(true); return ()=>{ if(toastTimer.current) clearTimeout(toastTimer.current); }; }, []);
  useEffect(()=>{ if (!loaded) return; try { localStorage.setItem(KEY, JSON.stringify(local)); } catch { toast('浏览器存储不可用，请及时下载笔记保存'); } }, [local, loaded]);
  function setRecord(id: string, value: { note:string; done:boolean }) { setLocal(prev=>({ ...prev, records: { ...prev.records, [id]: { ...prev.records[id], visitedAt: prev.records[id]?.visitedAt ?? Date.now(), ...value } } })); }
  function setReaderId(id: string | null) {
    setOpenReaderId(id);
    if (!id) return;
    const visitedAt = Date.now();
    setLocal(previous => ({
      ...previous,
      records: {
        ...previous.records,
        [id]: { ...(previous.records[id] ?? { note: '', done: false }), visitedAt },
      },
    }));
  }
  function record(id: string) { return local.records[id] || { note:'', done:false }; }
  async function importShortlist() {
    if (!lists.feed?.canEdit || !local.shortlist.length || migrating.current) return;
    migrating.current = true;
    setMigrationError(false);
    const ids = local.shortlist;
    try {
      const response = await fetch(boardListEndpoint, { method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: wantToReadId, bookIds: ids }) });
      if (!response.ok) throw Error();
      lists.saveList(await response.json() as PersonalBoardList);
      setLocal(current => ({ ...current, shortlist: current.shortlist.filter(id => !ids.includes(id)) }));
    } catch { setMigrationError(true); }
    finally { migrating.current = false; }
  }
  useEffect(() => { if (loaded) void importShortlist(); }, [loaded, lists.feed?.canEdit, local.shortlist]);
  function openList(draft?: BoardListDraft) {
    setCreateDraft(draft ?? { title: '', description: '', bookIds: [] });
  }
  function openSavedList(list: PersonalBoardList) {
    lists.saveList(list);
    setCreateDraft(null);
    setSelectedList(list.id);
    window.location.hash = '/shelf';
  }
  async function copyPrompt() { try { await navigator.clipboard.writeText(lessons[activeLesson].prompt); toast('提示词已复制，带上自己的素材开始练习'); } catch { toast('可选中下方提示词手动复制'); } }
  const activeJournal = journals.find(j=>route===`/journal/${j.id}`);
  const readerJournal = journals.find(j=>j.id===readerId);
  const recent = journals.filter(journal => local.records[journal.id])
    .sort((a, b) => (local.records[b.id].visitedAt ?? 0) - (local.records[a.id].visitedAt ?? 0));
  const noted = recent.filter(journal => local.records[journal.id].note.trim());
  return <>
    <span className="site-version" aria-label="网站版本 1.0">1.0</span>
    <FloatingSidebar route={route}/>
    <div className="site-content"><main>
    {route === '/' && <ReadingHouse onRead={setReaderId} record={record('small-attention')} onChange={value => setRecord('small-attention', value)}/>}
    {route === '/community' && <BanzhiCommunity onRead={setReaderId} onCreateList={openList}/>}
    {(route === '/camp' || route.startsWith('/camp/')) && <ReadingCamp themeId={route.split('/')[2] ?? 'ted'} onRead={setReaderId}/>}
    {route === '/board' && <SceneBoard records={local.records} onRead={setReaderId} onCreateList={openList} reading={Boolean(readerId || createDraft)}/>}
    {(route === '/cinema' || route === '/cinema/upload') && <JournalCinema onRead={setReaderId} lists={lists} initialUpload={route === '/cinema/upload'}/>}
    {activeJournal && <div className="wrap page-space">
      <a href="#/cinema" className="back-link"><ArrowLeft size={16}/>精读手账</a>
      <div className="detail-grid"><div className="detail-cover"><Cover journal={activeJournal}/></div><div className="detail-copy">
        <div className="product-meta"><span><i style={{background:activeJournal.accent}}/>{activeJournal.category}</span><span>原创手账</span></div>
        <h1>{activeJournal.title.replace('\n','')}</h1><p className="detail-desc">{activeJournal.desc}</p>
        <div className="detail-facts"><span><Clock3 size={17}/>{activeJournal.duration}</span><span><BookOpen size={17}/>{activeJournal.level}</span><span><Download size={17}/>网页 · 可打印文件</span></div>
        <div className="detail-outcome"><small>读完，你会带走</small><p>{activeJournal.outcome}</p></div>
        <div className="detail-buttons"><button className="btn btn-dark" onClick={() => setReaderId(activeJournal.id)}>免费试读 <ArrowUpRight size={17}/></button><span className="detail-price">¥12.9 <small>/ 本</small></span></div><JournalPurchase id={activeJournal.id}/>
        <AddToList key={activeJournal.id} journalId={activeJournal.id} lists={lists}/>
      </div></div>
      <div className="detail-info-grid">
        <div><span className="eyebrow">MADE FOR YOU</span><h2>适合谁</h2><p>{activeJournal.audience}</p></div>
        <div><span className="eyebrow">WHAT IS INSIDE</span><h2>手账内容</h2><p>试读部分内容，购买后解锁完整文本、精读讲解与练习，可下载打印。</p></div>
        <div><span className="eyebrow">SOURCE & USE</span><h2>内容来源</h2><p>本站原创示例文本与练习，供个人学习、打印与批注。</p></div>
      </div>
    </div>}
    {route==='/method' && <div className="wrap page-space"><div className="page-heading"><span className="eyebrow">THE CLOSE READING SKILL</span><h1>AI 陪你读，<span className="serif">理解归你自己。</span></h1><p>一个可以带到外刊、报告、书籍和工作里的方法。四步，做完第一份精读手账。</p></div><div className="lesson-layout"><aside className="lesson-nav">{lessons.map((l,i)=><button key={l.label} className={activeLesson===i?'active':''} onClick={()=>setActiveLesson(i)}><span>{local.completedLessons.includes(i)?<Check size={15}/>:String(i+1).padStart(2,'0')}</span><div><small>{l.label}</small><b>{l.title}</b></div><ArrowUpRight size={16}/></button>)}<div className="lesson-progress"><span>已完成 {local.completedLessons.length} / 4 步</span><progress max={4} value={local.completedLessons.length}/><p>练习与进度保存在当前浏览器。</p></div></aside><article className="lesson-content"><span className="eyebrow">{lessons[activeLesson].label}</span><h2>{lessons[activeLesson].title}</h2><p className="lesson-detail">{lessons[activeLesson].detail}</p><div className="prompt-card"><div><span><Sparkles size={17}/>把这段话交给你的 AI 学习伙伴</span><button className="text-button" onClick={copyPrompt}><Copy size={15}/>复制</button></div><p>{lessons[activeLesson].prompt}</p></div><label htmlFor="lesson-note" className="notes-label"><PenLine size={17}/>先写下你的想法</label><textarea id="lesson-note" rows={5} placeholder={lessons[activeLesson].exercise} value={local.lessonNotes[activeLesson]} onChange={e=>setLocal(prev=>({...prev,lessonNotes:prev.lessonNotes.map((v,i)=>i===activeLesson?e.target.value:v)}))}/><div className="lesson-actions"><button className="btn btn-outline" onClick={()=>{setLocal(prev=>({...prev,completedLessons:prev.completedLessons.includes(activeLesson)?prev.completedLessons.filter(v=>v!==activeLesson):[...prev.completedLessons,activeLesson]}));}}>{local.completedLessons.includes(activeLesson)?<CheckCheck size={17}/>:<Check size={17}/>} {local.completedLessons.includes(activeLesson)?'这一步已完成':'完成这一步'}</button>{activeLesson<3?<button className="btn btn-dark" onClick={()=>setActiveLesson(activeLesson+1)}>下一步 <ArrowRight size={17}/></button>:<button className="btn btn-dark" onClick={()=>setReaderId(journals[0].id)}>拿一篇短文练练手 <ArrowUpRight size={17}/></button>}</div><div className="source-note"><b>从现有 AI 工具开始</b><p>本课提供方法、提示词和原创练习。将提示词与有权使用的材料带入你自己的 AI 工具即可练习，分享输出前复核事实与来源。</p></div></article></div><section className="principles"><div><h3>素材有出处</h3><p>记录作者、链接和许可。付费访问权限与再分发权限分别核验。</p></div><div><h3>理解有自己的话</h3><p>先复述再对照，把推断与原文提供的事实区分开。</p></div><div><h3>学习有下一步</h3><p>留下一次练习、一个行动或一个可在未来回看的问题。</p></div></section></div>}
    {route==='/club' && <div className="wrap page-space"><div className="club-page-hero"><div><span className="eyebrow">SEVEN-DAY PRACTICE</span><h1>七天英语精读练习</h1><p>一篇短文，几次追问，一份有自己笔迹的手账。<br/>从每天 15–20 分钟的小练习开始。</p><button className="btn btn-dark" onClick={()=>setReaderId(journals[0].id)}>打开本周原创短文 <BookOpen size={17}/></button><span className="small-copy muted">自定进度 · 七个练习</span></div><div className="club-paper"><span className="hand-note">a little every day.</span><h2>读 · 说 · 写 · 用</h2><p>每次多一点自己的理解。<br/>也多留一个值得继续追问的问题。</p><div>{[BookOpen,Headphones,PenLine,CheckCheck].map((Icon,i)=><span key={i}><Icon size={26}/></span>)}</div></div></div><div className="section-heading"><div><span className="eyebrow">YOUR FIRST SEVEN DAYS</span><h2>先陪自己读完这一周。</h2></div><span className="muted">{local.completedDays.length} / 7 天完成</span></div><div className="day-picker">{clubTasks.map((t,i)=><button key={t} className={clubDay===i?'active':''} onClick={()=>setClubDay(i)} aria-pressed={clubDay===i}><small>DAY</small><b>{String(i+1).padStart(2,'0')}</b>{local.completedDays.includes(i)&&<Check size={15}/>}</button>)}</div><div className="club-task"><div><span className="eyebrow">DAY {String(clubDay+1).padStart(2,'0')} / YOUR LITTLE PRACTICE</span><h2>{clubTasks[clubDay]}</h2><p>围绕《把注意力，还给自己》完成今天的练习。<br/>完成情况与内容只保存在你当前的浏览器中。</p><button className="text-button" onClick={()=>setReaderId(journals[0].id)}>回看短文 <ArrowUpRight size={16}/></button></div><div><label className="notes-label" htmlFor="club-note">今天留下一点什么？</label><textarea id="club-note" rows={5} value={local.clubNotes[clubDay]} onChange={e=>setLocal(prev=>({...prev,clubNotes:prev.clubNotes.map((v,i)=>i===clubDay?e.target.value:v)}))} placeholder="一句复述、一个例句，或一个还没想明白的问题……"/><button className="btn btn-dark" onClick={()=>setLocal(prev=>({...prev,completedDays:prev.completedDays.includes(clubDay)?prev.completedDays.filter(v=>v!==clubDay):[...prev.completedDays,clubDay]}))}>{local.completedDays.includes(clubDay)?<CheckCheck size={17}/>:<Check size={17}/>} {local.completedDays.includes(clubDay)?'已完成今天的练习':'完成今天的练习'}</button></div></div></div>}
    {route === '/shelf' && <div className="wrap page-space personal-shelf">
      <div className="page-heading"><span className="eyebrow">YOUR JOURNAL SHELF</span><h1>我的手账</h1><p>清单、阅读进度和笔记仅保存在当前浏览器。</p></div>
      <LearningSnapshot records={local.records}/>
      <section aria-labelledby="continue-title"><h2 id="continue-title" className="shelf-title">继续读</h2>
        {recent.length ? recent.map(journal => <div className="shelf-row" key={journal.id}><AppIcon code={journal.code} color={journal.accent}/><div>
          <h3>{journal.title.replace('\n','')}</h3><p>{record(journal.id).done ? '已完成精读' : '读过'}{record(journal.id).note.trim() && ' · 已有笔记'}</p></div>
          <button className="btn btn-outline" onClick={() => setReaderId(journal.id)}>继续精读 <ArrowRight size={16}/></button></div>)
          : <p className="shelf-empty">读过的手账会出现在这里。<a href="#/board" className="inline-link">去白板选一本 <ArrowUpRight size={13}/></a></p>}
      </section>
      <BoardLists key={selectedList} initialId={selectedList} listsState={lists} onRead={setReaderId}/>
      {migrationError && local.shortlist.length > 0 && <p className="shelf-empty">还有 {local.shortlist.length} 本旧收藏待合并。<button className="text-button" onClick={importShortlist}>重试合并到「想读」</button></p>}
      {!lists.feed?.canEdit && local.shortlist.length > 0 && <p className="shelf-empty">当前浏览器有 {local.shortlist.length} 本旧收藏，登录后会合并到「想读」。</p>}
      <section className="shelf-notes" aria-labelledby="notes-title"><h2 id="notes-title" className="shelf-title">我的学习成果</h2>
        {noted.map(journal => <article className="shelf-note" key={journal.id}><h3>{journal.title.replace('\n','')}</h3><p>{record(journal.id).note}</p>
          <div><button className="text-button" onClick={() => setReaderId(journal.id)}>打开手账 <ArrowUpRight size={14}/></button>
          <button className="text-button" onClick={() => downloadNotes(journal, record(journal.id).note)}>下载笔记 <Download size={14}/></button></div></article>)}
        {Object.entries(local.outputs).map(([id, output]) => <article className="shelf-note" key={id}><h3>{savedExerciseTitles[id]}</h3><p>{output}</p></article>)}
        {!noted.length && !Object.keys(local.outputs).length && <p className="shelf-empty">在任意原创手账里写下一句，笔记就会出现在这里。</p>}
      </section>
      <a className="shelf-practice" href="#/camp"><BookOpen size={19}/><div><strong>我的学习计划</strong><small>查看主题与学习目标</small></div><ArrowUpRight size={16}/></a>
      <a className="shelf-practice" href="#/club"><BookOpen size={19}/><div><strong>七天英语精读练习</strong><small>{local.completedDays.length} / 7 天完成</small></div><ArrowUpRight size={16}/></a>
    </div>}
    {!['/import','/','/board','/cinema','/cinema/upload','/community','/method','/club','/camp','/shelf'].includes(route) && !route.startsWith('/camp/') && !activeJournal && <div className="wrap empty-state page-space"><h1>这一页，还在路上。</h1><a href="#/" className="btn btn-dark">回到首页 <ArrowRight size={17}/></a></div>}
    </main>
    <footer className="site-footer"><div className="wrap footer-main">
      <div><Logo small/><p>读一篇读懂，把实力存下。<br/>精读手账 · 陪学营</p></div>
      <div><h3>精读与陪学</h3><a href="#/cinema">精读手账</a><a href="#/camp">陪学营</a><a href="#/board">场景白板</a></div>
      <div><h3>在这里开始</h3><a href="#/shelf">我的手账</a><a href="#/community">半知搭子</a><a href="#/method">精读方法</a><span className="footer-founder">半知创始人</span></div>
      <div className="footer-note"><span className="hand-note">保持好奇，<br/>慢慢成为自己的作者。</span><small>READ DEEPLY. KEEP SOMETHING.</small></div>
    </div><div className="wrap pages-edition-note">公开体验版 · 清单与学习记录保存在当前浏览器。<a href="https://everything-journal.delacruzjhon484.chatgpt.site/">前往在线版使用购买、投稿与搭子名片 <ArrowUpRight size={12}/></a></div><div className="wrap footer-bottom"><span>© {new Date().getFullYear()} 精读手账馆</span><span>半知创始人</span></div></footer></div>
    {readerJournal && <Modal title="精读手账 · 试读与已购阅读" wide onClose={() => setReaderId(null)}>
      <Reader key={readerJournal.id} journal={readerJournal} record={record(readerJournal.id)} update={value => setRecord(readerJournal.id, value)} toast={toast} lists={lists} onClose={() => setReaderId(null)}/>
    </Modal>}
    {createDraft && <ListEditor draft={createDraft} feed={lists.feed} loadError={lists.error} retry={lists.retry} onClose={() => setCreateDraft(null)} onSaved={openSavedList} onRemoved={() => {}}/>}
    <div className={`toast ${message?'visible':''}`} role="status">{message&&<><CheckCheck size={17}/>{message}</>}</div>
  </>;
}
