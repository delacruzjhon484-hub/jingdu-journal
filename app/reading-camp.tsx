'use client';
import {siteFetch as fetch} from './pages-runtime';


import { OutcomeWall } from './buddy-reading';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Check, CheckCheck } from 'lucide-react';
import { campProducts, campRoute, campThemes, type CampInterestFeed } from './reading-house-data';
import { CampHero, CampSupport, CampStudyDay, CampJourney } from './camp-experience';

export default function ReadingCamp({ themeId, onRead }: { themeId: string; onRead: (id: string) => void }) {
  const product = campProducts.find(item => item.route === themeId) ?? campProducts[0];
  const {theme:selected,plan} = product;
  const [access, setAccess] = useState<CampInterestFeed | null>(null);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/camp-interest', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw Error();
      const result = await response.json() as CampInterestFeed;
      if (!controller.signal.aborted) setAccess(result);
    }).catch(() => { if (!controller.signal.aborted) setError('暂时无法读取陪学意向。'); });
    return () => controller.abort();
  }, [attempt]);

  useEffect(() => {
    setNotice('');
  }, [selected.id]);

  useEffect(() => {
    if (access) setGoal(access.interests.find(item => item.theme === selected.id)?.goal ?? '');
  }, [selected.id, access]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving || !access?.canSave) return;
    setSaving(true);
    setError('');
    try {
      const response = await fetch('/api/camp-interest', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ theme: selected.id, goal }),
      });
      const result = await response.json() as { error?: string; signInUrl?: string; savedAt: number };
      if (response.status === 401 && result.signInUrl) setAccess(current => current && { ...current, canSave: false, signInUrl: result.signInUrl! });
      if (!response.ok) throw Error(result.error || '保存未完成，请重试。');
      setAccess(current => current && { ...current, interests: [
        { theme: selected.id, goal: goal.trim(), savedAt: result.savedAt }, ...current.interests.filter(item => item.theme !== selected.id),
      ] });
      setNotice('陪学意向已保存在此设备。开营时间公布后，可回来查看。');
    } catch (error) { setError(error instanceof Error ? error.message : '保存未完成，请重试。'); }
    finally { setSaving(false); }
  }
  const saved = access?.interests.some(item => item.theme === selected.id);

  return <div className="reading-camp">
    <header className="house-wrap front-section"><h1>精读陪学营</h1><p>带读、打卡、答疑与社群 · 免费登记陪学意向</p><a className="house-text-link" href="#/groups">购买学习资料 · 每组 7 本 ¥12.90 →</a></header>
    <section className="house-wrap camp-choose" aria-labelledby="camp-themes-title"><div className="house-section-top"><div><span className="house-eyebrow">CHOOSE YOUR READING</span><h2 id="camp-themes-title">这次想读哪个主题？</h2></div><span className="house-section-note">{plan.name} · 每天一篇，共 {plan.days} 篇</span></div>
      <div className="camp-theme-grid">{campThemes.map(theme => <a href={`#/camp/${campRoute(theme.id,plan)}`} key={theme.id} className={`camp-theme ${selected.id === theme.id ? 'selected' : ''}`} aria-current={selected.id === theme.id ? 'true' : undefined}><span>{theme.number} / {theme.note}</span><strong className="camp-theme-mark" aria-hidden="true">{theme.mark}</strong><h3>{theme.title} <small>{plan.days} 篇</small></h3><p>{theme.line}</p><div>{selected.id === theme.id ? <><Check size={15}/>已选主题</> : <>选择这个主题 <ArrowUpRight size={15}/></>}</div></a>)}</div>
    </section>

    <section className="camp-interest house-wrap" id="camp-interest"><div><span className="house-eyebrow">学习目标</span><h2>这次想练好什么？</h2><p>{selected.title} · 主题学习意向</p><p className="camp-interest-note">把你想读的主题和学习目标留下。陪学方案包含带读、打卡、答疑、社群，由半知创始人真人陪学、Agent 助教团与半知精读教研团队协作开展。可在这里免费登记意向。</p><button className="house-text-link" onClick={() => onRead(selected.sampleId)}><BookOpen size={16}/>先读一份原创练习，感受方法 <ArrowUpRight size={14}/></button><small className="house-plan-note">当前体验篇为本站原创练习。</small></div>
      <form onSubmit={save}><label htmlFor="camp-goal">为这个主题留一句学习目标<small>选填</small></label><textarea id="camp-goal" maxLength={160} rows={4} value={goal} onChange={event => setGoal(event.target.value)} placeholder="例如，读懂长句，并用自己的话复述文章的观点。"/>
        {access?.canSave ? <button className="house-button violet" disabled={saving}>{saving ? '保存中…' : saved ? '更新我的陪学意向' : '保存我的陪学意向'}{saved ? <CheckCheck size={16}/> : <ArrowRight size={16}/>}</button> : access ? <a href={access.signInUrl} target="_top" className="house-button violet">登录后保存陪学意向 <ArrowUpRight size={16}/></a> : <button type="button" className="house-button light" onClick={() => {setError('');setAttempt(value => value + 1);}}>{error ? '重试加载' : '正在读取意向…'}</button>}
        {notice && <p className="camp-save-notice" role="status">{notice}</p>}{saved && !notice && <p className="camp-save-notice"><Check size={14}/> 这个主题已保存在此设备。</p>}
        {error && <p className="board-list-error" role="alert">{error}</p>}
      </form>
    </section>
    <CampJourney plan={plan}/>
    <CampSupport/>
    <CampStudyDay onRead={onRead}/>
    <div className="house-wrap"><OutcomeWall onRead={onRead}/></div>
    <section className="camp-faq house-wrap"><h2>关于这次陪学</h2>{[
      ['半知创始人、Agent 助教团和教研团队分别做什么？','半知创始人负责真人陪学中的引导、交流与阶段回看。Agent 助教团围绕词句、表达、复习协助日常练习。半知精读教研团队负责选材编排、译注与练习设计，并结合学习反馈迭代内容。'],
      ['现在可以试用 Agent 助教吗？','页面提供可切换的练习示例与可复制指令，可配合原创手账在你自己的 AI 工具中体验。陪学营的 Agent 使用入口与具体使用方式将在正式报名时公布。'],
      ['陪学营和精读手账有什么区别？','精读手账提供文本拆解、批注和练习，适合自主使用。陪学营增加学习节奏、真人陪伴、Agent 助教与社群交流，把手账串成持续的学习过程。'],
      ['现在可以报名吗？','目前可免费登记陪学意向。站内仅售七本手账组，每组 ¥12.90，仅含所列学习资料。'],
      ['三个主题是一起学吗？','TED、外刊、名著节选是三个不同主题。当前展示的每个营期选一个主题，每天一篇。'],
    ].map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</section>
  </div>;
}
