'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Check, Copy, Grid2X2, Pause, Play, Plus, X } from 'lucide-react';
import { journals, type Journal } from './data';
import type { LearningRecords } from './reading-records';
import { boardScenes, type BoardScene } from './scene-board-data';
import type { BoardListDraft } from './board-lists-data';

type BooksProps = { records: LearningRecords; onRead: (id: string) => void };
type Flight = { id: number; sceneId: string; journalId: string; path: string };
const journalIndex = new Map(journals.map((journal, index) => [journal.id, { journal, index }]));
const groupClass: Record<BoardScene['group'], string> = {
  '英语与出行': 'board-travel', '表达与工作': 'board-work', '生活与学习': 'board-life',
};
const offsets = [-5, 4, -3, 5, -4, 3, 4, -5, 6, -6, 4, -3, -4, 4, -2, 6, -3, 3];
const tilts = [-12, 8, -8, 10, -11, 6, 8, -13, 9, -8, 7, -10, -9, 11, -7, 8, -10, 7];
const interval = 1520;
const groups = Object.keys(groupClass) as BoardScene['group'][];
const displayBooks = ['toefl-listen-for-turns', 'travel-confirm-first', 'story-in-frames', 'after-a-breakup', 'ai-as-coach', 'brief-that-works'];

function placement(index: number): CSSProperties {
  if (index < 6) return { gridColumn: index + 1, gridRow: 1 };
  if (index < 12) return { gridColumn: index % 2 ? 6 : 1, gridRow: 2 + Math.floor((index - 6) / 2) };
  return { gridColumn: index - 11, gridRow: 5 };
}

function coverTitle(journal: Journal) {
  return journal.title.replace('\n', '');
}

function CoverContents({ journal, index, done }: { journal: Journal; index: number; done?: boolean }) {
  return <>
    <span className="board-book-top"><span>{journal.code}</span><span>{String(index + 1).padStart(2, '0')}</span></span>
    <strong>{journal.title.split('\n').map(line => <span key={line}>{line}</span>)}</strong>
    <i className="board-book-mark" aria-hidden="true"/>
    <span className="board-book-bottom">{done ? <Check size={11}/> : 'JOURNAL'}</span>
  </>;
}

function BoardBook({ id, onRead, records, scatterIndex }: BooksProps & { id: string; scatterIndex?: number }) {
  const { journal, index } = journalIndex.get(id)!;
  const done = records[id]?.done;
  const scattered = scatterIndex !== undefined;
  const row = Math.floor((scatterIndex ?? 0) / 3);
  const column = (scatterIndex ?? 0) % 3;
  const offset = offsets[index % offsets.length];
  const style = {
    '--book-paper': journal.color,
    '--book-ink': journal.accent,
    '--book-tilt': `${scattered ? tilts[index % tilts.length] : index % 2 ? 4 : -5}deg`,
    ...(scattered && { left: `${18 + column * 32 + offset * .55}%`, top: `${27 + row * 49 + offset * .8}%` }),
  } as CSSProperties;
  return <div className={`board-book ${scattered ? 'is-scattered' : ''}`} style={style}>
    <button className={`board-cover board-cover-${index % 4}`} aria-label={`打开手账《${coverTitle(journal)}》${done ? '，已读完' : ''}`} title={coverTitle(journal)} onClick={() => onRead(id)}>
      <CoverContents journal={journal} index={index} done={done}/>
    </button>
  </div>;
}

function BoardSceneTile({ scene, index, active, arriving, books, onSelect, mobileHidden, ...props }: BooksProps & {
  scene: BoardScene; index: number; active: boolean; arriving: boolean; books: readonly string[]; onSelect: () => void; mobileHidden: boolean;
}) {
  return <div className={`board-scene ${groupClass[scene.group]} ${active ? 'is-active' : ''} ${arriving ? 'is-receiving' : ''}`} style={placement(index)} data-mobile-hidden={mobileHidden}>
    <button className="board-scene-open" onClick={onSelect} aria-haspopup="dialog" aria-expanded={active}>
      <span className="board-scene-id"><span>{String(index + 1).padStart(2, '0')} / {scene.group}</span><ArrowUpRight size={14}/></span>
      <strong>{scene.title}</strong>
      <small className="board-scene-pick" title={coverTitle(journalIndex.get(scene.bookIds[0])!.journal)}>{coverTitle(journalIndex.get(scene.bookIds[0])!.journal)}</small>
    </button>
    <div className="board-scene-books" data-scene-shelf={scene.id}>
      {books.map(id => <BoardBook key={id} id={id} {...props}/>)}
    </div>
  </div>;
}

function FlightCover({ flight, onArrive }: { flight: Flight; onArrive: (flight: Flight) => void }) {
  const { journal, index } = journalIndex.get(flight.journalId)!;
  return <div className="board-flight" style={{
    '--book-paper': journal.color, '--book-ink': journal.accent, offsetPath: `path("${flight.path}")`,
  } as CSSProperties} onAnimationEnd={event => { if (event.target === event.currentTarget) onArrive(flight); }}>
    <div className={`board-cover board-cover-${index % 4}`}><CoverContents journal={journal} index={index}/></div>
  </div>;
}

export default function SceneBoard({ records, onRead, reading, onCreateList }: BooksProps & { reading: boolean; onCreateList: (draft?: BoardListDraft) => void }) {
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [flights, setFlights] = useState<Flight[]>([]);
  const [arrivals, setArrivals] = useState<Record<string, string[]>>({});
  const [active, setActive] = useState<BoardScene | null>(null);
  const [group, setGroup] = useState(groups[0]);
  const boardRef = useRef<HTMLDivElement>(null);
  const emitterRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDialogElement>(null);
  const sequence = useRef(0);
  const running = !paused && !reduceMotion && onScreen && pageVisible && !reading && !active;
  const guideOpen = Boolean(active);

  useEffect(() => {
    const dialog = guideRef.current;
    if (!guideOpen || !dialog) return;
    dialog.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = overflow; };
  }, [guideOpen]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    function syncMotion() {
      setReduceMotion(media.matches);
      if (media.matches) setFlights([]);
    }
    function syncVisibility() { setPageVisible(!document.hidden); }
    syncMotion();
    syncVisibility();
    media.addEventListener('change', syncMotion);
    document.addEventListener('visibilitychange', syncVisibility);

    const visibility = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting));
    if (emitterRef.current) visibility.observe(emitterRef.current);
    const resize = new ResizeObserver(() => setFlights(current => current.length ? [] : current));
    if (boardRef.current) resize.observe(boardRef.current);
    return () => {
      media.removeEventListener('change', syncMotion);
      document.removeEventListener('visibilitychange', syncVisibility);
      visibility.disconnect();
      resize.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    function launch() {
      const board = boardRef.current;
      const emitter = emitterRef.current;
      if (!board || !emitter) return;
      const id = sequence.current++;
      const scenes = window.matchMedia('(max-width: 740px)').matches ? boardScenes.filter(scene => scene.group === group) : boardScenes;
      const position = id % scenes.length;
      const half = Math.ceil(scenes.length / 2);
      const scene = scenes[Math.floor(position / 2) + (position % 2 ? half : 0)];
      const journalId = scene.bookIds[Math.floor(id / scenes.length) % scene.bookIds.length];
      const shelf = board.querySelector(`[data-scene-shelf="${scene.id}"]`);
      if (!shelf?.getClientRects().length) return;
      const boardRect = board.getBoundingClientRect();
      const from = emitter.getBoundingClientRect();
      const to = shelf.getBoundingClientRect();
      const x = from.left + from.width / 2 - boardRect.left;
      const y = from.top + from.height / 2 - boardRect.top;
      const endX = to.left + to.width / 2 - boardRect.left;
      const endY = to.top + to.height / 2 - boardRect.top;
      const dx = endX - x;
      const dy = endY - y;
      const length = Math.hypot(dx, dy) || 1;
      const bend = Math.min(66, length * .2) * (id % 2 ? -1 : 1);
      const bendX = -dy / length * bend;
      const bendY = dx / length * bend;
      const path = `M ${x} ${y} C ${x + dx * .28 + bendX} ${y + dy * .28 + bendY}, ${x + dx * .69 + bendX} ${y + dy * .69 + bendY}, ${endX} ${endY}`;
      setFlights(current => [...current.slice(-2), { id, sceneId: scene.id, journalId, path }]);
    }
    const first = window.setTimeout(launch, 440);
    const timer = window.setInterval(launch, interval);
    return () => { window.clearTimeout(first); window.clearInterval(timer); };
  }, [running, group]);

  function arrive(flight: Flight) {
    setFlights(current => current.filter(item => item.id !== flight.id));
    setArrivals(current => ({
      ...current,
      [flight.sceneId]: [...(current[flight.sceneId] ?? []).filter(id => id !== flight.journalId), flight.journalId].slice(-2),
    }));
  }

  return <div className="board-page" id="scene-board" tabIndex={-1}>
    <div className="board-wrap">
      <header className="board-heading">
        <div>
          <span className="eyebrow"><Grid2X2 size={14}/>精读手账馆 / THE SCENE BOARD</span>
          <h1>场景白板</h1>
          <p>每个场景都是一份手账清单。把用得上的手账归到一起。</p>
        </div>
        <div className="board-heading-actions"><button className="board-list-primary" onClick={() => onCreateList()}><Plus size={16}/>新建手账清单</button>
        <div className="board-controls">
          <span className="board-flow-state"><i className={running ? 'is-running' : ''}/>{reduceMotion ? '静态浏览' : paused ? '流动已暂停' : '自动流动'}</span>
          {!reduceMotion && <button onClick={() => setPaused(value => !value)}>{paused ? <Play size={15}/> : <Pause size={15}/>} {paused ? '继续流动' : '暂停流动'}</button>}
        </div></div>
      </header>
      <div className="board-strip"><span>白板 01</span><span>{boardScenes.length} 份内置清单 <i/> {journals.length} 份原创手账</span><span>选场景看清单 · 点封面直接读</span></div>
      <div className="board-mobile-groups" role="group" aria-label="白板场景主题">
        {groups.map(name => <button key={name} aria-pressed={group === name} onClick={() => { setGroup(name); setFlights([]); }}>{name}</button>)}
      </div>
      <div className="board-grid" ref={boardRef} data-flow-paused={!running}>
        <section className="board-center" aria-label="白板中央的手账">
          <div className="board-center-header"><span><i/>白板中央</span><span>JOURNAL FLOW</span></div>
          <div className="board-emitter" ref={emitterRef} aria-hidden="true"><BookOpen size={20}/><span>手账出发点</span></div>
          <div className="board-scatter">{displayBooks.map((id, index) => <BoardBook id={id} key={id} records={records} onRead={onRead} scatterIndex={index}/>)}</div>
        </section>
        {boardScenes.map((scene, index) => <BoardSceneTile scene={scene} index={index} key={scene.id}
          active={active?.id === scene.id} mobileHidden={scene.group !== group} arriving={flights.some(flight => flight.sceneId === scene.id)}
          books={[scene.bookIds[0], ...(arrivals[scene.id] ?? []).filter(id => id !== scene.bookIds[0]).slice(-1)]}
          onSelect={() => setActive(scene)} records={records} onRead={onRead}/>)}
        <div className="board-flight-layer" aria-hidden="true">
          <svg className="board-flight-lines">{flights.map(flight => <path key={flight.id} d={flight.path} stroke={journalIndex.get(flight.journalId)!.journal.accent}/>)}</svg>
          {flights.map(flight => <FlightCover key={flight.id} flight={flight} onArrive={arrive}/>)}
        </div>
      </div>
      <div className="board-bottom"><span>每个格子是一份手账清单。</span><a href="#/shelf">查看我的清单 <ArrowUpRight size={13}/></a></div>
      {active && <dialog className={`board-scene-dialog ${groupClass[active.group]}`} ref={guideRef} aria-labelledby="board-guide-title"
        onCancel={event => { event.preventDefault(); setActive(null); }}
        onClick={event => { if (event.target === guideRef.current) setActive(null); }}>
        <section className="board-guide">
          <button className="board-list-close board-scene-close" aria-label="关闭场景清单" onClick={() => setActive(null)}><X size={19}/></button>
          <div className="board-guide-intro"><span className="eyebrow">内置清单 / {active.group}</span><h2 id="board-guide-title">{active.title}</h2><p>{active.prompt}</p><div className="board-guide-action"><ArrowRight size={15}/><span>{active.action}</span></div>
            <button className="board-back" onClick={() => { onCreateList({ title: active.title, description: active.action, bookIds: [...active.bookIds] }); setActive(null); }}><Copy size={14}/>复制为我的清单</button></div>
        <div className="board-guide-books">
          {active.bookIds.map(id => {
            const journal = journalIndex.get(id)!.journal;
            return <div key={id} className="board-guide-book" style={{ '--book-paper': journal.color, '--book-ink': journal.accent } as CSSProperties}>
              <span className="board-guide-icon"><BookOpen size={17}/></span>
              <div><button onClick={() => { setActive(null); onRead(id); }}>{coverTitle(journal)} <ArrowUpRight size={14}/></button><p>{journal.desc}</p><small>{journal.duration}{records[id]?.done && ' · 已读完'}</small></div>
            </div>;
          })}
        </div>
        </section>
      </dialog>}
    </div>
  </div>;
}
