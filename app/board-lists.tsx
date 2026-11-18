'use client';
import { siteFetch as fetch } from './pages-runtime';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, BookOpen, FileText, FolderOpen, Pencil, Plus, X } from 'lucide-react';
import { journals } from './data';
import { cinemaFeed } from './cinema-data';
import {
  boardListEndpoint, boardListDescriptionLimit, boardListJournalLimit, boardListTitleLimit,
  type BoardListDraft, type BoardListFeed, type PersonalBoardList, type SubmittedJournal, wantToReadId,
} from './board-lists-data';

const originalOptions = journals.map(journal => ({
  id: journal.id, title: journal.title.replace('\n', ''), label: journal.category, pdf: false,
}));

function journalOptions(submitted: SubmittedJournal[]) {
  return [...originalOptions, ...submitted.map(journal => ({
    id: journal.id, title: journal.title, label: `投稿 · ${journal.author}`, pdf: true,
  }))];
}

type ListEditorProps = {
  draft: BoardListDraft;
  editingId?: string;
  feed: BoardListFeed | null;
  loadError: string;
  retry: () => void;
  onClose: () => void;
  onSaved: (list: PersonalBoardList) => void;
  onRemoved: (id: string) => void;
};

export function ListEditor({ draft, editingId, feed, loadError, retry, onClose, onSaved, onRemoved }: ListEditorProps) {
  const [id, setId] = useState(editingId);
  const [selected, setSelected] = useState(draft.bookIds);
  const [search, setSearch] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [signInUrl, setSignInUrl] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const options = journalOptions(feed?.submitted ?? []);
  const visible = options.filter(journal => `${journal.title} ${journal.label}`.toLowerCase().includes(search.trim().toLowerCase()));
  const bookIds = selected.filter(id => options.some(option => option.id === id));

  useEffect(() => {
    const dialog = dialogRef.current!;
    dialog.showModal();
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { dialog.close(); document.body.style.overflow = priorOverflow; };
  }, []);

  async function commit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (busy || !feed?.canEdit) return;
    const removing = !event && editingId;
    let path = boardListEndpoint;
    let init: RequestInit;
    if (removing) {
      path += `?id=${encodeURIComponent(removing)}`;
      init = { method: 'DELETE' };
    } else {
      if (!event) return;
      const form = new FormData(event.currentTarget);
      const draftId = id ?? crypto.randomUUID();
      setId(draftId);
      init = {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: draftId, title: form.get('title'), description: form.get('description'), bookIds }),
      };
    }
    setBusy(true);
    setError('');
    try {
      const response = await fetch(path, init);
      if (!response.ok) {
        const result = await response.json() as { error?: string; signInUrl?: string };
        if (response.status === 401 && result.signInUrl) setSignInUrl(result.signInUrl);
        throw Error(result.error || '操作未完成，请重试。');
      }
      if (removing) onRemoved(removing);
      else onSaved(await response.json() as PersonalBoardList);
    } catch (error) {
      setError(error instanceof Error ? error.message : '操作未完成，请重试。');
    } finally { setBusy(false); }
  }

  const isDefault = editingId === wantToReadId;
  const signIn = signInUrl || (feed && !feed.canEdit ? feed.signInUrl : '');
  return <dialog ref={dialogRef} className="board-list-dialog" aria-labelledby="board-list-editor-title" onCancel={event => {
    event.preventDefault();
    if (!busy) onClose();
  }}>
    <div className="board-list-editor-head">
      <div><span className="eyebrow">我的清单</span><h2 id="board-list-editor-title">{editingId ? '编辑清单' : '新建手账清单'}</h2></div>
      <button type="button" className="board-list-close" aria-label="关闭清单编辑器" onClick={onClose} disabled={busy}><X size={20}/></button>
    </div>
    <form className="board-list-form" onSubmit={commit}>
      <label>清单名称<input name="title" readOnly={isDefault} defaultValue={draft.title} maxLength={boardListTitleLimit} placeholder="例如，出发前的一周" required autoFocus/></label>
      <label>用途说明 <small>选填</small><input name="description" readOnly={isDefault} defaultValue={draft.description} maxLength={boardListDescriptionLimit} placeholder="这组手账什么时候用？"/></label>
      <fieldset>
        <legend>挑选手账 <span>{bookIds.length} / {boardListJournalLimit}</span></legend>
        <input type="search" aria-label="搜索可加入的手账" placeholder="搜索手账名称、类型或作者" value={search} onChange={event => setSearch(event.target.value)}/>
        <div className="board-list-picker">
          {visible.map(journal => <label key={journal.id} className="board-list-option">
            <input type="checkbox" checked={bookIds.includes(journal.id)}
              disabled={busy || (bookIds.length >= boardListJournalLimit && !bookIds.includes(journal.id))}
              onChange={event => setSelected(current => event.target.checked ? [...current, journal.id] : current.filter(id => id !== journal.id))}/>
            <span>{journal.title}<small>{journal.label}</small></span>
          </label>)}
          {!visible.length && <p>没有找到符合搜索词的手账。</p>}
        </div>
        {feed?.canEdit && selected.length > bookIds.length && <p className="board-list-hint">已撤下的投稿会在保存时移出清单。</p>}
      </fieldset>
      {error && <p className="board-list-error" role="alert">{error}</p>}
      {loadError && <p className="board-list-error" role="alert">{loadError} <button type="button" onClick={retry}>重试</button></p>}
      <div className="board-list-form-actions">
        {signIn ? <a href={signIn} target="_top" className="board-list-primary">登录后保存 <ArrowUpRight size={15}/></a> :
          <button className="board-list-primary" type="submit" disabled={busy || !feed?.canEdit}>{busy ? '处理中…' : '保存清单'}</button>}
        {editingId && !isDefault && !confirmRemove && <button type="button" className="board-list-remove" disabled={busy} onClick={() => setConfirmRemove(true)}>删除清单</button>}
        {confirmRemove && <div className="board-list-confirm"><span>删除这份清单？</span>
          <button type="button" disabled={busy} className="board-list-remove" onClick={() => commit()}>确认删除</button>
          <button type="button" disabled={busy} onClick={() => setConfirmRemove(false)}>取消</button>
        </div>}
      </div>
    </form>
  </dialog>;
}

export function useBoardListFeed() {
  const [feed, setFeed] = useState<BoardListFeed | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetch(boardListEndpoint, { signal: controller.signal }).then(async response => {
      if (!response.ok) throw Error();
      const payload = await response.json() as BoardListFeed;
      if (!controller.signal.aborted) setFeed(payload);
    }).catch(() => { if (!controller.signal.aborted) setError('暂时无法读取清单。'); });
    return () => controller.abort();
  }, [attempt]);

  function retry() { setError(''); setAttempt(value => value + 1); }
  function saveList(list: PersonalBoardList) {
    setFeed(current => {
      if (!current) return current;
      const others = current.lists.filter(item => item.id !== list.id);
      const first = others.find(item => item.id === wantToReadId);
      const lists = first ? [first, list, ...others.filter(item => item !== first)] : [list, ...others];
      return { ...current, lists };
    });
  }
  function removeList(id: string) {
    setFeed(current => current && { ...current, lists: current.lists.filter(item => item.id !== id) });
  }
  return { feed, error, retry, saveList, removeList };
}

export type BoardListFeedState = ReturnType<typeof useBoardListFeed>;

export function AddToList({ journalId, lists }: { journalId: string; lists: BoardListFeedState }) {
  const [open, setOpen] = useState(false);
  const [target, setTarget] = useState(wantToReadId);
  const [newId, setNewId] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { feed } = lists;

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!feed?.canEdit || busy) return;
    const create = target === 'new';
    const form = new FormData(event.currentTarget);
    const id = create ? newId || crypto.randomUUID() : target;
    if (create) setNewId(id);
    setBusy(true);
    setError('');
    try {
      const response = await fetch(boardListEndpoint, {
        method: create ? 'POST' : 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, title: form.get('title'), description: '', bookIds: [journalId] }),
      });
      const result = await response.json() as PersonalBoardList & { error?: string };
      if (!response.ok) throw Error(result.error || '保存未完成，请重试。');
      lists.saveList(result);
      setTarget(result.id);
      setNewId('');
      setOpen(false);
      setMessage(`已加入「${result.title}」。`);
    } catch (error) { setError(error instanceof Error ? error.message : '保存未完成，请重试。'); }
    finally { setBusy(false); }
  }

  return <div className="add-to-list">
    <button className="board-list-secondary" aria-expanded={open} onClick={() => { setOpen(value => !value); setMessage(''); }}><Plus size={15}/>加入清单</button>
    {message && <span className="add-list-message" role="status">{message}</span>}
    {open && <div className="add-list-panel">
      {feed?.canEdit ? <form onSubmit={add}>
        <label><span>选择清单</span><select value={target} onChange={event => setTarget(event.target.value)} disabled={busy}>
          {feed.lists.map(list => <option key={list.id} value={list.id}>{list.title}{list.bookIds.includes(journalId) ? '（已收录）' : ''}</option>)}
          <option value="new">新建清单…</option>
        </select></label>
        {target === 'new' && <label><span>清单名称</span><input name="title" placeholder="例如，我的 AI 学习清单" maxLength={boardListTitleLimit} required/></label>}
        <button type="submit" className="board-list-primary" disabled={busy}>{busy ? '保存中…' : '确认加入'}</button>
      </form> : feed ? <a href={feed.signInUrl} target="_top" className="board-list-primary">登录后保存 <ArrowUpRight size={14}/></a>
        : lists.error ? <p>{lists.error} <button onClick={lists.retry}>重试</button></p> : <p>正在读取清单…</p>}
      {error && <p className="board-list-error" role="alert">{error}</p>}
    </div>}
  </div>;
}

export default function BoardLists({ listsState, onRead, initialId }: {
  listsState: BoardListFeedState; onRead: (id: string) => void; initialId: string;
}) {
  const { feed, error, retry, saveList, removeList } = listsState;
  const [activeId, setActiveId] = useState(initialId);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<PersonalBoardList | null>(null);
  const [notice, setNotice] = useState('');

  function close() { setCreating(false); setEditing(null); }
  function saved(list: PersonalBoardList) {
    saveList(list);
    setActiveId(list.id);
    setNotice(`已保存「${list.title}」。`);
    close();
  }
  function removed(id: string) {
    removeList(id);
    setActiveId(wantToReadId);
    setNotice('清单已删除。');
    close();
  }

  const lists = feed?.lists ?? [];
  const active = lists.find(list => list.id === activeId) ?? lists[0];
  const options = new Map(journalOptions(feed?.submitted ?? []).map(journal => [journal.id, journal]));
  const draft = editing ?? (creating ? { title: '', description: '', bookIds: [] } : null);

  return <section className="board-lists" id="board-lists" tabIndex={-1} aria-labelledby="board-lists-title">
    <div className="board-lists-head">
      <div><span className="eyebrow"><FolderOpen size={14}/> PERSONAL COLLECTIONS</span><h2 id="board-lists-title">我的手账清单</h2>
        <p>把手账按自己的场景归在一起。清单保存在你的账号下。</p></div>
      <button className="board-list-primary" onClick={() => setCreating(true)}><Plus size={16}/>新建清单</button>
    </div>
    {notice && <p className="board-list-notice" role="status">{notice}</p>}
    {active ? <>
      <div className="board-list-grid">
        {lists.map(list => <button key={list.id} className="board-list-tile" aria-pressed={list.id === active.id}
          aria-controls="board-list-detail" onClick={() => setActiveId(list.id)}>
          <span><FolderOpen size={15}/> {list.id === wantToReadId ? '默认清单' : '自建清单'} <ArrowUpRight size={13}/></span>
          <strong>{list.title}</strong><small>{list.bookIds.filter(id => options.has(id)).length} 份手账</small>
        </button>)}
      </div>
      <div className="board-list-detail" id="board-list-detail">
        <div className="board-list-detail-head"><div><h3>{active.title}</h3>{active.description && <p>{active.description}</p>}</div>
          <button className="board-list-secondary" onClick={() => setEditing(active)}><Pencil size={14}/>编辑清单</button></div>
        <ol className="board-list-entries">
          {active.bookIds.map(id => {
            const journal = options.get(id);
            if (!journal) return <li key={id} className="board-list-missing"><FileText size={16}/>这份投稿已撤下</li>;
            const label = <><span>{journal.pdf ? <FileText size={17}/> : <BookOpen size={17}/>}</span><strong>{journal.title}</strong><small>{journal.label}</small><ArrowUpRight size={15}/></>;
            return <li key={id}>{journal.pdf
              ? <a href={`${cinemaFeed}/${id}`} target="_blank" rel="noopener noreferrer">{label}</a>
              : <button onClick={() => onRead(id)}>{label}</button>}</li>;
          })}
        </ol>
        {!active.bookIds.length && <p className="board-list-hint">这份清单还是空的。打开「编辑清单」就能加入手账。</p>}
      </div>
    </> : <div className="board-list-empty">
      {error ? <p>{error} <button onClick={retry}>重试</button></p> : !feed ? <p>正在读取你的清单…</p> : <p>登录后，可在这里管理想读和自建清单。</p>}
    </div>}
    {draft && <ListEditor draft={draft} editingId={editing?.id} feed={feed} loadError={error} retry={retry} onClose={close} onSaved={saved} onRemoved={removed}/>}
  </section>;
}
