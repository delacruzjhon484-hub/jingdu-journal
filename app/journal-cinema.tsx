'use client';
import { siteFetch as fetch } from './pages-runtime';

import { useEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Clapperboard, FileUp, Play, Plus, Search, X } from 'lucide-react';
import { cinemaFeed, cinemaThemes, cinemaUploadLimit, themeForJournal, themeJournals, type CinemaSubmission } from './cinema-data';
import { categories, journals, type Journal } from './data';
import { EditorialShelf } from './journal-experience';
import { boardScenes } from './scene-board-data';
import { AddToList, type BoardListFeedState } from './board-lists';

type Film = {
  id: string; title: string; label: string; color: string; ink: string; number: number;
  caption: string; submission?: CinemaSubmission;
};
const originals = new Map(journals.map((journal, index) => [journal.id, makeOriginal(journal, index)]));
const featured = journals.find(journal => journal.id === 'pdf-deep-reading') ?? journals[0];
const selectedIds = ['ai-as-coach', 'travel-confirm-first', 'after-a-breakup', 'story-in-frames', 'ielts-small-story', 'presentation-one-idea'];

function makeOriginal(journal: Journal, number: number): Film {
  return { id: journal.id, title: journal.title, label: themeForJournal(journal.id).name,
    color: journal.color, ink: journal.accent, number, caption: journal.pdf ? `${journal.pdf.pages} 页 · PDF` : journal.duration };
}

function makeSubmission(item: CinemaSubmission, index: number): Film {
  const theme = cinemaThemes.find(theme => theme.id === item.theme) ?? cinemaThemes[2];
  return { id: item.id, title: item.title, label: '观众投稿', color: theme.color, ink: theme.ink,
    number: index + journals.length, caption: item.author, submission: item };
}

function Poster({ film, hero = false }: { film: Film; hero?: boolean }) {
  const pdf=journals.find(j=>j.id===film.id)?.pdf;
  if(pdf)return <div className={`cinema-poster cinema-pdf-poster ${hero?'cinema-poster-hero':''}`} aria-hidden="true"><img src={pdf.cover} alt="" loading={hero?'eager':'lazy'}/><span className="cinema-pdf-pages">PDF · {pdf.pages} 页</span></div>;
  const motif = film.number % 5;
  return <div className={`cinema-poster ${hero ? 'cinema-poster-hero' : ''}`} style={{ '--poster-paper': film.color, '--poster-ink': film.ink } as CSSProperties} aria-hidden="true">
    <div className="cinema-poster-top"><span>精读手账</span><span>{String(film.number + 1).padStart(2, '0')}</span></div>
    <svg className="cinema-poster-art" viewBox="0 0 200 190" fill="none">
      {motif === 0 && <><path d="M12 136L100 15l88 121z" fill="currentColor" opacity=".22"/><circle cx="100" cy="92" r="62" stroke="currentColor" strokeWidth="2"/><path d="M38 92h124M100 30v124M57 49l86 86m0-86l-86 86" stroke="currentColor" strokeWidth="1.3"/><circle cx="100" cy="92" r="19" fill="currentColor"/></>}
      {motif === 1 && <><circle cx="100" cy="89" r="67" fill="currentColor" opacity=".2"/><circle cx="100" cy="89" r="43" stroke="currentColor" strokeWidth="2"/><path d="M25 105c-9-16 23-40 67-55 44-14 85-13 92 2 5 16-24 40-68 55-45 15-83 14-91-2Z" stroke="currentColor" strokeWidth="2"/><circle cx="139" cy="60" r="12" fill="currentColor"/></>}
      {motif === 2 && <><path d="M39 32h96v128H39z" fill="currentColor" opacity=".18"/><path d="M62 15h96v128H62zM79 42h63m-63 17h47M79 76h58m-58 17h40" stroke="currentColor" strokeWidth="2"/><path d="M46 148 147 47l12 12L58 160l-21 9z" fill="currentColor"/></>}
      {motif === 3 && <><path d="M100 20c30 30 57 33 70 70-9 37-43 64-70 71-27-7-61-34-70-71 13-37 40-40 70-70Z" fill="currentColor" opacity=".22"/><path d="M100 20v141M30 90h140M100 20c-34 38-34 103 0 141m0-141c34 38 34 103 0 141" stroke="currentColor" strokeWidth="2"/><circle cx="100" cy="90" r="14" fill="currentColor"/></>}
      {motif === 4 && <><rect x="31" y="32" width="138" height="115" rx="5" fill="currentColor" opacity=".19"/><path d="M31 50h138M31 129h138M62 32v115m76-115v115" stroke="currentColor" strokeWidth="2"/><path d="m86 66 41 24-41 24z" fill="currentColor"/><circle cx="45" cy="41" r="4" fill="currentColor"/><circle cx="155" cy="138" r="4" fill="currentColor"/></>}
    </svg>
    <div className="cinema-poster-title">{film.title}</div>
    <div className="cinema-poster-foot"><span>{film.label}</span><span>CLOSE READING</span></div>
  </div>;
}

function FilmRow({ title, detail, films, onOpen, grid = false }: { title: string; detail: string; films: Film[]; onOpen: (film: Film) => void; grid?: boolean }) {
  const rail = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ left: false, right: false });
  function updateEdges() {
    const node = rail.current;
    if (!node) return;
    setEdges({ left: node.scrollLeft > 3, right: node.scrollLeft + node.clientWidth < node.scrollWidth - 3 });
  }
  useEffect(() => {
    const observer = new ResizeObserver(updateEdges);
    if (rail.current) observer.observe(rail.current);
    updateEdges();
    return () => observer.disconnect();
  }, [films.length]);
  function scroll(direction: number) {
    const node = rail.current;
    if (!node) return;
    node.scrollBy({ left: Math.round(node.clientWidth * .82) * direction,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  return <section className="cinema-row">
    <div className="cinema-row-heading">
      <div><h2>{title}</h2><p>{detail}</p></div>
      {!grid && (edges.left || edges.right) && <div className="cinema-arrows">
        <button aria-label={`向左浏览${title}`} disabled={!edges.left} onClick={() => scroll(-1)}><ArrowLeft size={17}/></button>
        <button aria-label={`向右浏览${title}`} disabled={!edges.right} onClick={() => scroll(1)}><ArrowRight size={17}/></button>
      </div>}
    </div>
    <div className={grid ? "cinema-rail cinema-results" : "cinema-rail"} ref={rail} onScroll={updateEdges}>
      {films.map(film => <button key={film.id} className="cinema-film" onClick={() => onOpen(film)} aria-label={`${film.submission ? '打开' : '试读'}《${film.title.replace('\n', '')}》`}>
        <div className="cinema-film-image"><Poster film={film}/><span className="cinema-film-play"><Play size={16} fill="currentColor"/></span></div>
        <div className="cinema-card-price"><span>{film.submission ? '免费 · 作者分享' : '¥12.9 / 本'}</span><small>{film.submission ? '查看' : '点击试读'} <ArrowUpRight size={12}/></small></div><strong>{film.title.replace('\n', '')}</strong><small>{film.label} · {film.caption}</small>{!film.submission && <><span className="cinema-learning-level">{journals.find(j => j.id === film.id)?.level}</span><p className="cinema-learning-output">{journals.find(j => j.id === film.id)?.outcome}</p></>}
      </button>)}
    </div>
  </section>;
}

export default function JournalCinema({ onRead, lists, initialUpload = false }: { onRead: (id: string) => void; lists: BoardListFeedState; initialUpload?: boolean }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [submissions, setSubmissions] = useState<CinemaSubmission[]>([]);
  const [access, setAccess] = useState<{ canUpload: boolean; signInUrl: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedError, setFeedError] = useState('');
  const [modal, setModal] = useState<'upload' | Film | null>(initialUpload ? 'upload' : null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [confirmRemoval, setConfirmRemoval] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { if (initialUpload) setModal('upload'); }, [initialUpload]);

  useEffect(() => {
    const controller = new AbortController();
    fetch(cinemaFeed, { signal: controller.signal }).then(async response => {
      const payload = await response.json() as { submissions: CinemaSubmission[]; canUpload: boolean; signInUrl: string; error?: string };
      if (!response.ok) throw Error(payload.error);
      setSubmissions(payload.submissions);
      setAccess({ canUpload: payload.canUpload, signInUrl: payload.signInUrl });
    }).catch(() => { if (!controller.signal.aborted) setFeedError('投稿清单暂时无法加载，刷新页面可重试。'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const hasModal = Boolean(modal);
  useEffect(() => {
    if (!hasModal || !dialog.current) return;
    const element = dialog.current;
    element.showModal();
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = priorOverflow; };
  }, [hasModal]);

  function showUpload() { setError(''); setNotice(''); setModal('upload'); }
  function openFilm(film: Film) {
    if (!film.submission) { onRead(film.id); return; }
    setConfirmRemoval(false);
    setError('');
    setModal(film);
  }

  async function upload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    const form = new FormData(event.currentTarget);
    const file = form.get('file');
    if (!(file instanceof File) || file.size < 5 || file.size > cinemaUploadLimit || !file.name.toLowerCase().endsWith('.pdf')) {
      setError('请选择 12 MB 以内的 PDF 文件。');
      return;
    }
    setError('');
    setBusy(true);
    try {
      const response = await fetch(cinemaFeed, { method: 'POST', body: form });
      if (!response.ok) {
        const item = await response.json() as { error?: string; signInUrl?: string };
        if (response.status === 401 && item.signInUrl) setAccess({ canUpload: false, signInUrl: item.signInUrl });
        throw Error(item.error || '上传失败，请稍后重试。');
      }
      const item = await response.json() as CinemaSubmission;
      setSubmissions(current => [item, ...current]);
      setFilter('submissions');
      setQuery('');
      setCategory('');
      lists.retry();
      setModal(null);
      setNotice(`《${item.title}》已加入观众投稿。`);
    } catch (error) {
      setError(error instanceof Error ? error.message : '上传失败，请稍后重试。');
    } finally { setBusy(false); }
  }

  async function withdraw(id: string) {
    setBusy(true);
    setError('');
    try {
      const response = await fetch(`${cinemaFeed}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw Error('撤下失败，请刷新后重试。');
      setSubmissions(current => current.filter(item => item.id !== id));
      setModal(null);
      setNotice('投稿已撤下。');
      lists.retry();
    } catch (error) { setError(error instanceof Error ? error.message : '撤下失败。'); }
    finally { setBusy(false); }
  }

  const audienceFilms = submissions.map(makeSubmission);
  const featureFilm = originals.get(featured.id)!;
  const searching = Boolean(query.trim() || category);
  const theme = cinemaThemes.find(item => item.id === filter);
  const themeIds = theme ? new Set(themeJournals(theme).map(journal => journal.id)) : null;
  const keywords = query.trim().toLowerCase().split(/\s+/);
  const results = searching ? [...originals.values(), ...audienceFilms].filter(film => {
    const journal = journals[film.number];
    const submission = film.submission;
    if (filter === 'submissions' && !submission) return false;
    if (theme && (submission ? submission.theme !== theme.id : !themeIds?.has(film.id))) return false;
    if (category && (submission ? category !== 'PDF 投稿' : category !== journal.category)) return false;
    const scenes = boardScenes.filter(scene => scene.bookIds.includes(film.id)).map(scene => scene.title).join(' ');
    const text = [film.title.replaceAll('\n', ''), film.label, journal?.category, journal?.desc, journal?.outcome,
      scenes, submission?.author, submission?.summary].filter(Boolean).join(' ').toLowerCase();
    return keywords.every(word => text.includes(word));
  }) : [];

  return <div className="cinema">
    <div className="cinema-wrap">
      <section className="cinema-hero" aria-labelledby="cinema-title">
        <div className="cinema-hero-copy">
          <div className="cinema-wordmark"><Clapperboard size={18}/>精读手账馆 <span>/</span> JOURNAL COLLECTION</div>
          <h1 id="cinema-title">精读手账</h1>
          <p className="cinema-subtitle">先试读，再带走你喜欢的一本。</p>
          <div className="cinema-feature"><span>本期推荐</span><h2>{featured.title.replace('\n', '')}</h2><p>{featured.desc}</p></div>
          <div className="cinema-feature-price"><strong>¥12.9</strong><span>/ 本 · 购买后下载完整手账</span></div><div className="cinema-actions"><button className="cinema-btn cinema-play" onClick={() => onRead(featured.id)}><Play size={16} fill="currentColor"/>免费试读</button><button className="cinema-btn cinema-upload" onClick={showUpload}><Plus size={17}/>上传手账</button></div>
        </div>
        <div className="cinema-hero-stage" aria-hidden="true">
          <span className="cinema-screen-label">THIS WEEK’S READING</span>
          <div className="cinema-stage-frame"/>
          <Poster film={featureFilm} hero/>
          <span className="cinema-stage-number">{String(featureFilm.number + 1).padStart(2, '0')}<small>/ 本期推荐</small></span>
        </div>
      </section>
      <div className="cinema-buy-steps"><span><b>01</b> 点击封面，免费试读</span><span><b>02</b> 单本购买 ¥12.9</span><span><b>03</b> 付费后下载，随时重读</span><small>当前可试读，购买暂未开放。</small></div>
      {!query && !category && filter === 'all' && <EditorialShelf onRead={onRead} compact/>}
      <div className="cinema-find">
        <label><Search size={18}/><input type="search" aria-label="搜索手账" placeholder="搜手账名称、场景或作者" value={query} onChange={event => setQuery(event.target.value)}/></label>
        <select aria-label="手账品类" value={category} onChange={event => { setCategory(event.target.value); setFilter('all'); }}>
          <option value="">全部品类</option>
          {categories.slice(1).map(item => <option key={item.code}>{item.name}</option>)}
          <option>PDF 投稿</option>
        </select>
      </div>
      <div className="cinema-bar"><div className="cinema-tabs" role="group" aria-label="精读主题分类">
        {[{ id: 'all', name: '全部清单' }, ...cinemaThemes, { id: 'submissions', name: '观众投稿' }].map(tab => <button key={tab.id} aria-pressed={filter === tab.id} onClick={() => { setFilter(tab.id); if (tab.id === 'submissions' && category !== 'PDF 投稿') setCategory(''); }}>{tab.name}</button>)}
      </div><span className="cinema-count">{journals.length} 本手账 · {submissions.length} 份投稿</span></div>
      {notice && <p className="cinema-notice" role="status">{notice}</p>}
      {searching ? (results.length
        ? <FilmRow title="搜索与筛选结果" detail={`找到 ${results.length} 份手账`} films={results} onOpen={openFilm} grid/>
        : <section className="cinema-empty"><h2>还没找到符合条件的手账</h2><p>试试换个关键词，或浏览全部清单。</p><button className="cinema-btn cinema-upload" onClick={() => { setQuery(''); setCategory(''); setFilter('all'); }}>清除筛选</button></section>)
        : <>
      {filter === 'all' && <FilmRow title="新上架 · 半知精读 PDF" detail="14 个主题 · 同主题版本合并 · 点击封面试读真实内页" films={journals.filter(j=>j.pdf).map(j=>originals.get(j.id)!)} onOpen={openFilm} grid/>}
      {filter === 'all' && <FilmRow title="方法体验 · 今天读什么" detail="先挑一本最贴近当下的手账。" films={selectedIds.map(id => originals.get(id)!)} onOpen={openFilm}/>}
      {cinemaThemes.filter(theme => filter === 'all' || filter === theme.id).map(theme => <FilmRow key={theme.id} title={theme.name} detail={theme.line} films={[
        ...themeJournals(theme).filter(j=>filter!=='all'||!j.pdf).map(journal => originals.get(journal.id)!), ...audienceFilms.filter(film => film.submission?.theme === theme.id),
      ]} onOpen={openFilm}/>)}
      {(filter === 'all' || filter === 'submissions') && (audienceFilms.length
        ? <FilmRow title="观众投稿" detail="来自其他作者的学习、工作和生活手账。" films={audienceFilms} onOpen={openFilm}/>
        : <section className="cinema-empty"><h2>观众投稿</h2><p>{loading ? '正在读取投稿清单…' : feedError || '这里等着第一部来自观众的手账。'}</p></section>)}
        </>}
      <section className="cinema-invite"><div className="cinema-invite-icon"><FileUp size={25}/></div><div><h2>分享你认真读过的一页。</h2><p>读书笔记、译注联想、复盘清单，都可以成为一份精读手账。</p></div><button className="cinema-btn cinema-upload" onClick={showUpload}><Plus size={16}/>上传我的手账</button></section>
    </div>
    {modal && <dialog ref={dialog} className="cinema-dialog" aria-label={modal === 'upload' ? '上传手账' : modal.title} onCancel={event => { event.preventDefault(); if (!busy) setModal(null); }}>
      <button className="cinema-close" aria-label="关闭" disabled={busy} onClick={() => setModal(null)}><X size={21}/></button>
      {modal === 'upload' ? <form className="cinema-form" onSubmit={upload}>
        <span className="cinema-kicker">观众投稿</span><h2>上传你的手账</h2><p>公开体验站不接收文件上传。请前往在线版，完成 PDF 手账的署名投稿与展示。</p>
        <p className="cinema-scope">文件的上传、署名和公开展示在在线版完成。</p>
        {error && <p className="cinema-error" role="alert">{error}</p>}
        {access && !access.canUpload ? <a href={access.signInUrl} target="_top" className="cinema-btn cinema-play">前往在线版上传 <ArrowUpRight size={16}/></a>
          : <button type="submit" className="cinema-btn cinema-play" disabled={busy || loading}>{busy ? '正在上传…' : '上传并加入手账馆'}</button>}
      </form> : <div className="cinema-detail">
        <Poster film={modal}/><div><span className="cinema-kicker">观众投稿</span><h2>{modal.title}</h2><p className="cinema-credit">{modal.submission!.author} · {cinemaThemes.find(theme => theme.id === modal.submission!.theme)?.name}</p><p>{modal.submission!.summary}</p>
        <div className="cinema-actions"><a className="cinema-btn cinema-play" href={`${cinemaFeed}/${modal.id}`} target="_blank" rel="noopener noreferrer"><BookOpen size={17}/>打开 PDF <ArrowUpRight size={15}/></a></div><AddToList journalId={modal.id} lists={lists}/>
        {modal.submission!.owned && <div className="cinema-removal">{confirmRemoval ? <><span>确认撤下这份手账？</span><button disabled={busy} onClick={() => withdraw(modal.id)}>{busy ? '正在撤下…' : '确认撤下'}</button><button disabled={busy} onClick={() => setConfirmRemoval(false)}>取消</button></> : <button onClick={() => setConfirmRemoval(true)}>撤下我的投稿</button>}</div>}
        {error && <p className="cinema-error" role="alert">{error}</p>}
      </div></div>}
    </dialog>}
  </div>;
}
