'use client';
import { siteFetch as fetch } from './pages-runtime';

import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Check, GraduationCap, PenLine, UsersRound } from 'lucide-react';
import { BuddyReadings, OutcomeWall } from './buddy-reading';
import { journals } from './data';
import { buddyReadings } from './curated-reading';
import type { BoardListDraft } from './board-lists-data';
import { communityEndpoint, communityRoles, type CommunityMember, type CommunityProfile, type CommunityRole } from './community-data';

const blankProfile: CommunityProfile = { nickname: '', role: 'learner', focus: '', bio: '', published: false, updatedAt: 0 };
type Feed = { canSave: boolean; signInUrl: string; profile: CommunityProfile | null; members: CommunityMember[] };

export default function BanzhiCommunity({ onRead, onCreateList }: { onRead: (id: string) => void; onCreateList: (draft: BoardListDraft) => void }) {
  const [readingFilter, setReadingFilter] = useState('');
  const [feed, setFeed] = useState<Feed | null>(null);
  const [profile, setProfile] = useState(blankProfile);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [retry, setRetry] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setLoadError('');
    fetch(communityEndpoint, { signal: controller.signal }).then(async response => {
      const data = await response.json() as Feed & { error?: string };
      if (!response.ok) throw Error(data.error || '搭子页面暂时无法加载。');
      if (controller.signal.aborted) return;
      setFeed(data);
      if (data.profile) setProfile(data.profile);
    }).catch(error => { if (!controller.signal.aborted) setLoadError(error.message || '搭子页面暂时无法加载。'); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [retry]);
  function chooseRole(role: CommunityRole) {
    setProfile(prev => ({ ...prev, role })); setNotice('');
    document.getElementById('community-join')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSaving(true); setError(''); setNotice('');
    try {
      const response = await fetch(communityEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) });
      const data = await response.json() as CommunityProfile & { error?: string };
      if (!response.ok) throw Error(data.error || '保存未完成。');
      setProfile(data); setFeed(prev => prev ? { ...prev, profile: data } : prev);
      setNotice(data.published ? '名片已保存，并展示在半知搭子。你可以随时取消展示。' : '名片已保存到你的账号，仅自己可见。');
    } catch (error) { setError(error instanceof Error ? error.message : '保存未完成，请重试。'); }
    finally { setSaving(false); }
  }
  const allMembers = [...(feed?.profile?.published ? [feed.profile] : []), ...(feed?.members ?? [])];
  const members = allMembers.filter(member => !readingFilter || member.readingId === readingFilter);
  function match(id: string) { setReadingFilter(id); requestAnimationFrame(() => document.getElementById('community-readers')?.scrollIntoView({ behavior: 'smooth', block: 'start' })); }
  return <div className="banzhi-community house-wrap">
    <section className="community-hero"><span className="house-eyebrow"><UsersRound size={15}/> BANZHI BUDDIES / 半知搭子</span><h1>把认真读过的一页，<br/><span>变成彼此的启发。</span></h1><p>欢迎英语学习爱好者，也欢迎英语老师。<br/>用半知精读做一份手账，分享一种读法，一起把学习往前推进。</p><div className="house-actions"><button className="house-button dark" onClick={() => chooseRole('learner')}>我是学习爱好者 <ArrowRight size={16}/></button><button className="house-button light" onClick={() => chooseRole('teacher')}>我是英语老师 <ArrowUpRight size={16}/></button></div><small>从一张搭子名片、一份精读手账开始。</small></section>
    <BuddyReadings onRead={onRead} onCreateList={onCreateList} onMatch={match}/>
    <section className="community-roles" aria-label="搭子参与方式">
      <article><BookOpen size={24}/><span>01 / LEARN TOGETHER</span><h2>学习爱好者</h2><p>把正在读的资料变成自己的学习作品，让理解留下来。</p><ul><li><Check size={14}/>用 Skill 制作精读手账</li><li><Check size={14}/>分享笔记、复述与学习心得</li><li><Check size={14}/>按目标建立自己的手账清单</li></ul><button className="house-text-link" onClick={() => chooseRole('learner')}>创建学习者名片 <ArrowRight size={15}/></button></article>
      <article><GraduationCap size={24}/><span>02 / TEACH & CREATE</span><h2>英语老师</h2><p>带着你的选题、讲解和教学经验，做值得反复学习的一页。</p><ul><li><Check size={14}/>用 Skill 辅助准备精读材料</li><li><Check size={14}/>分享原创讲义与教学手账</li><li><Check size={14}/>展示擅长的方向与教学思路</li></ul><button className="house-text-link" onClick={() => chooseRole('teacher')}>创建老师名片 <ArrowRight size={15}/></button></article>
    </section>
    <section className="community-join" id="community-join" aria-labelledby="community-join-title"><div><span className="house-eyebrow">YOUR FIRST PAGE</span><h2 id="community-join-title">先认识你，<br/>再一起精读。</h2><p>选择你的身份和方向，留下一个想认真学习、或想带大家读懂的主题。</p><div className="community-join-note"><PenLine size={20}/><p>搭子名片与公开读者展示在在线版。点击下方按钮前往；老师身份为自行填写的教学介绍。</p></div></div>
      <form onSubmit={save} aria-label="搭子名片"><fieldset disabled={saving || loading || Boolean(loadError) || !feed?.canSave}><div className="community-form-row"><label>昵称<input required maxLength={30} value={profile.nickname} onChange={e => { setNotice(''); setProfile({ ...profile, nickname: e.target.value }); }} placeholder="希望大家怎样称呼你"/></label><label>我的身份<select value={profile.role} onChange={e => { setNotice(''); setProfile({ ...profile, role: e.target.value as CommunityRole }); }}><option value="learner">英语学习爱好者</option><option value="teacher">英语老师</option></select></label></div><label>{profile.role === 'teacher' ? '擅长的教学方向' : '正在学习的方向'}<input required maxLength={60} value={profile.focus} onChange={e => { setNotice(''); setProfile({ ...profile, focus: e.target.value }); }} placeholder={profile.role === 'teacher' ? '如：外刊精读、长难句、雅思阅读' : '如：考研英语、职场阅读、英文名著'}/></label><label>想一起读的手账 <small>选填</small><select value={profile.readingId ?? ''} onChange={e => { setNotice(''); setProfile({ ...profile, readingId: e.target.value || null }); }}><option value="">先聊聊学习方向</option>{journals.map(j => <option key={j.id} value={j.id}>{j.title.replace('\n', '')}</option>)}</select></label><label>介绍自己 <small>选填 · 160 字以内</small><textarea rows={3} maxLength={160} value={profile.bio} onChange={e => { setNotice(''); setProfile({ ...profile, bio: e.target.value }); }} placeholder="分享你的学习目标、读法或教学理念……"/></label><label className="community-publish"><input type="checkbox" checked={profile.published} onChange={e => { setNotice(''); setProfile({ ...profile, published: e.target.checked }); }}/><span>在半知搭子展示我的名片<small>能访问本站的读者可以看到昵称、身份、方向、简介与正在读的手账。取消勾选并保存即可撤下展示。</small></span></label></fieldset>
        {loading ? <p className="community-message" role="status">正在读取搭子名片…</p> : loadError ? <p className="community-message" role="alert">{loadError} <button type="button" className="house-text-link" onClick={() => setRetry(prev => prev + 1)}>重新加载</button></p> : feed?.canSave ? <button className="house-button dark" disabled={saving}>{saving ? '正在保存…' : feed.profile ? '更新我的名片' : '保存名片，加入半知搭子'}<ArrowRight size={16}/></button> : <a className="house-button dark" href={feed?.signInUrl} target="_top">前往在线版入驻 <ArrowUpRight size={16}/></a>}
        {error && <p className="community-message error" role="alert">{error}</p>}{notice && <p className="community-message" role="status">{notice}</p>}
      </form></section>
    <section className="community-members" id="community-readers"><div className="house-section-top"><div><span className="house-eyebrow">MEET FELLOW READERS</span><h2>在同一本手账旁，遇见彼此。</h2></div></div><div className="buddy-match-filter" role="group" aria-label="按共读手账筛选"><button aria-pressed={!readingFilter} onClick={()=>setReadingFilter('')}>全部搭子</button>{buddyReadings.map(plan=><button key={plan.ids[0]} aria-pressed={readingFilter===plan.ids[0]} onClick={()=>setReadingFilter(plan.ids[0])}>{journals.find(j=>j.id===plan.ids[0])!.title.replace('\n','')}</button>)}</div>{loading ? <p className="community-empty">正在加载名片…</p> : loadError ? <p className="community-empty">名片暂未加载，重试后再看看。</p> : members.length ? <div className="community-member-grid">{members.map((member, i) => <article key={i}><span className="community-member-role">{communityRoles[member.role]}</span><h3>{member.nickname}</h3><strong>{member.focus}</strong>{member.bio && <p>{member.bio}</p>}{member.readingId && <button className="member-reading house-text-link" onClick={()=>onRead(member.readingId!)}><BookOpen size={14}/>正在读：{journals.find(j=>j.id===member.readingId)?.title.replace('\n','')}<ArrowUpRight size={13}/></button>}</article>)}</div> : <div className="community-empty"><UsersRound size={25}/><p>{'前往在线版，查看公开的同读搭子名片。'}<br/>留下你想一起读的手账，彼此就多了一个共同起点。</p><button className="house-text-link" onClick={()=>{setProfile(prev=>({...prev,readingId:readingFilter||prev.readingId}));chooseRole(profile.role);}}>我也想一起读 <ArrowRight size={14}/></button></div>}</section>
    <OutcomeWall onRead={onRead}/>
    <div className="community-next"><a href="#/">获取半知精读 Skill <ArrowUpRight size={15}/></a><a href="#/camp">了解石雄与三方陪学 <ArrowUpRight size={15}/></a></div>
  </div>;
}
