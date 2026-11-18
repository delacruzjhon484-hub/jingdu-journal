'use client';

import { siteFetch as fetch } from './pages-runtime';

import { useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Check, FileUp, GraduationCap, PenLine, UsersRound } from 'lucide-react';
import { communityEndpoint, communityRoles, type CommunityMember, type CommunityProfile, type CommunityRole } from './community-data';

const blankProfile: CommunityProfile = { nickname: '', role: 'learner', focus: '', bio: '', published: false, updatedAt: 0 };
type Feed = { canSave: boolean; signInUrl: string; profile: CommunityProfile | null; members: CommunityMember[] };

export default function BanzhiCommunity() {
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
      if (!response.ok) throw Error(data.error || '社区暂时无法加载。');
      if (controller.signal.aborted) return;
      setFeed(data);
      if (data.profile) setProfile(data.profile);
    }).catch(error => { if (!controller.signal.aborted) setLoadError(error.message || '社区暂时无法加载。'); })
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
      setNotice(data.published ? '名片已保存，并展示在社区。你可以随时取消展示。' : '名片已保存到你的账号，仅自己可见。');
    } catch (error) { setError(error instanceof Error ? error.message : '保存未完成，请重试。'); }
    finally { setSaving(false); }
  }
  const members = [...(feed?.profile?.published ? [feed.profile] : []), ...(feed?.members ?? [])];
  return <div className="banzhi-community house-wrap">
    <section className="community-hero"><span className="house-eyebrow"><UsersRound size={15}/> BANZHI COMMUNITY / 半知社区</span><h1>把认真读过的一页，<br/><span>变成彼此的启发。</span></h1><p>欢迎英语学习爱好者，也欢迎英语老师。<br/>用半知精读做一份手账，分享一种读法，一起把学习往前推进。</p><div className="house-actions"><button className="house-button dark" onClick={() => chooseRole('learner')}>我是学习爱好者 <ArrowRight size={16}/></button><button className="house-button light" onClick={() => chooseRole('teacher')}>我是英语老师 <ArrowUpRight size={16}/></button></div><small>从一张社区名片、一份精读手账开始。</small></section>
    <section className="community-roles" aria-label="社区参与方式">
      <article><BookOpen size={24}/><span>01 / LEARN TOGETHER</span><h2>学习爱好者</h2><p>把正在读的资料变成自己的学习作品，让理解留下来。</p><ul><li><Check size={14}/>用 Skill 制作精读手账</li><li><Check size={14}/>分享笔记、复述与学习心得</li><li><Check size={14}/>按目标建立自己的手账清单</li></ul><button className="house-text-link" onClick={() => chooseRole('learner')}>创建学习者名片 <ArrowRight size={15}/></button></article>
      <article><GraduationCap size={24}/><span>02 / TEACH & CREATE</span><h2>英语老师</h2><p>带着你的选题、讲解和教学经验，做值得反复学习的一页。</p><ul><li><Check size={14}/>用 Skill 辅助准备精读材料</li><li><Check size={14}/>分享原创讲义与教学手账</li><li><Check size={14}/>展示擅长的方向与教学思路</li></ul><button className="house-text-link" onClick={() => chooseRole('teacher')}>创建老师名片 <ArrowRight size={15}/></button></article>
    </section>
    <section className="community-join" id="community-join" aria-labelledby="community-join-title"><div><span className="house-eyebrow">YOUR FIRST PAGE</span><h2 id="community-join-title">先认识你，<br/>再一起精读。</h2><p>选择你的身份和方向，留下一个想认真学习、或想带大家读懂的主题。</p><div className="community-join-note"><PenLine size={20}/><p>社区名片和成员展示在在线版使用。前往在线版并登录后，可创建和管理名片。</p></div></div>
      <form onSubmit={save} aria-label="社区名片"><fieldset disabled={saving || loading || Boolean(loadError) || !feed?.canSave}><div className="community-form-row"><label>昵称<input required maxLength={30} value={profile.nickname} onChange={e => { setNotice(''); setProfile({ ...profile, nickname: e.target.value }); }} placeholder="希望大家怎样称呼你"/></label><label>我的身份<select value={profile.role} onChange={e => { setNotice(''); setProfile({ ...profile, role: e.target.value as CommunityRole }); }}><option value="learner">英语学习爱好者</option><option value="teacher">英语老师</option></select></label></div><label>{profile.role === 'teacher' ? '擅长的教学方向' : '正在学习的方向'}<input required maxLength={60} value={profile.focus} onChange={e => { setNotice(''); setProfile({ ...profile, focus: e.target.value }); }} placeholder={profile.role === 'teacher' ? '如：外刊精读、长难句、雅思阅读' : '如：考研英语、职场阅读、英文名著'}/></label><label>介绍自己 <small>选填 · 160 字以内</small><textarea rows={3} maxLength={160} value={profile.bio} onChange={e => { setNotice(''); setProfile({ ...profile, bio: e.target.value }); }} placeholder="分享你的学习目标、读法或教学理念……"/></label><label className="community-publish"><input type="checkbox" checked={profile.published} onChange={e => { setNotice(''); setProfile({ ...profile, published: e.target.checked }); }}/><span>在社区展示我的名片<small>能访问本站的读者可以看到昵称、身份、方向与简介。取消勾选并保存即可撤下展示。</small></span></label></fieldset>
        {loading ? <p className="community-message" role="status">正在读取社区…</p> : loadError ? <p className="community-message" role="alert">{loadError} <button type="button" className="house-text-link" onClick={() => setRetry(prev => prev + 1)}>重新加载</button></p> : feed?.canSave ? <button className="house-button dark" disabled={saving}>{saving ? '正在保存…' : feed.profile ? '更新我的名片' : '保存名片，加入半知社区'}<ArrowRight size={16}/></button> : <a className="house-button dark" href={feed?.signInUrl} target="_top">前往在线版入驻 <ArrowUpRight size={16}/></a>}
        {error && <p className="community-message error" role="alert">{error}</p>}{notice && <p className="community-message" role="status">{notice}</p>}
      </form></section>
    <section className="community-members"><div className="house-section-top"><div><span className="house-eyebrow">MEET FELLOW READERS</span><h2>认识同路的读者与老师。</h2></div></div>{loading ? <p className="community-empty">正在加载名片…</p> : loadError ? <p className="community-empty">名片暂未加载，重试后再看看。</p> : members.length ? <div className="community-member-grid">{members.map((member, i) => <article key={i}><span className="community-member-role">{communityRoles[member.role]}</span><h3>{member.nickname}</h3><strong>{member.focus}</strong>{member.bio && <p>{member.bio}</p>}</article>)}</div> : <div className="community-empty"><UsersRound size={25}/><p>在在线版认识读者与老师。<br/>社区成员和名片请前往在线版查看。</p></div>}</section>
    <section className="community-share"><FileUp size={27}/><div><h2>让你的手账，成为下一位读者的起点。</h2><p>分享自己的学习笔记、原创教学讲义，或有权公开的精读手账。PDF 可署名投稿，展示在手账馆。</p></div><a className="house-button dark" href="#/cinema/upload">分享我的手账 <ArrowUpRight size={16}/></a></section>
    <div className="community-next"><a href="#/">获取半知精读 Skill <ArrowUpRight size={15}/></a><a href="#/camp">了解石雄与三方陪学 <ArrowUpRight size={15}/></a></div>
  </div>;
}
