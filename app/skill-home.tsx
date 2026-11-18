'use client';

import { useState } from 'react';
import JournalWorkshop from './journal-workshop';
import { ArrowDown, ArrowRight, ArrowUpRight, Copy } from 'lucide-react';

const starterPrompt = '请使用「半知精读」技能，把我提供的英语学习资料制作成可阅读、可学习的精读手账。先问我学习目标和英语水平，再围绕材料整理词句解析、内容理解与学习练习；保留来源信息，最后留出用自己的话复述和做笔记的位置。';
export default function SkillHome({ onRead }: { onRead: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState('');
  async function copy(value: string, message: string) {
    try { await navigator.clipboard.writeText(value); setCopied(message); }
    catch { setCopied('复制未完成，可选中下面文字手动复制。'); }
  }
  function showInstall() {
    setOpen(true);
    requestAnimationFrame(() => document.getElementById('get-banzhi-skill')?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
  return <>
    <JournalWorkshop onRead={onRead} onGetSkill={showInstall} installOpen={open}/>
    <section className="skill-getting-started house-wrap" id="get-banzhi-skill" aria-labelledby="skill-start-title"><div className="skill-start-top"><div><span className="house-eyebrow">MAKE YOUR OWN JOURNAL</span><h2 id="skill-start-title">一份资料，一本自己的精读手账。</h2></div><button className="house-text-link" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="skill-install-details">{open ? '收起使用指引' : '展开使用指引'}<ArrowDown size={15}/></button></div><div className="skill-three-steps">{[['01','准备资料','选一份你想读懂的英语材料。'],['02','交给半知精读','在 Workbuddy 中调用 Skill，说明学习目标。'],['03','开始认真学习','阅读、练习，补上你自己的理解。']].map(([n,title,copy])=><div key={n}><span>{n}</span><strong>{title}</strong><p>{copy}</p></div>)}</div>
      {open && <div className="skill-install-details" id="skill-install-details"><div><h3>在 Workbuddy 中找到「半知精读」</h3><p>打开 Workbuddy，进入技能页面，查找「半知精读」并安装。安装后，在对话中调用技能，提供资料和学习目标。</p><div className="skill-install-actions"><a href="https://www.workbuddy.cn/" target="_blank" rel="noopener noreferrer" className="house-button dark">前往 Workbuddy <ArrowUpRight size={15}/></a><button className="house-text-link" onClick={() => copy('半知精读', '技能名已复制：半知精读')}>复制技能名 <Copy size={14}/></button></div><a className="skill-doc-link" href="https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market" target="_blank" rel="noopener noreferrer">查看 Workbuddy 官方技能安装说明 <ArrowUpRight size={12}/></a></div><div><h3>第一次使用，可以这样开始</h3><p className="skill-prompt">{starterPrompt}</p><button className="house-text-link" onClick={() => copy(starterPrompt, '使用指令已复制，带到 Workbuddy 开始制作。')}>复制使用指令 <Copy size={14}/></button></div><p className="skill-install-note">本站提供成品试读与学习场景，Skill 的安装和资料生成在 Workbuddy 中完成。</p>{copied && <p className="skill-copy-notice" role="status">{copied}</p>}</div>}
    </section>
    <section className="skill-community-strip house-wrap"><div><span className="house-eyebrow">MAKE · READ · SHARE</span><p>一个人做手账，一群人把英语读得更深。</p></div><a href="#/community" className="house-text-link">加入半知搭子 <ArrowRight size={16}/></a></section>
  </>;
}
