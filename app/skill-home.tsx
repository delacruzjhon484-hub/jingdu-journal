'use client';

import { useState, type ReactNode } from 'react';
import JournalWorkshop from './journal-workshop';
import { ArrowDown, ArrowRight, ArrowUpRight, Copy } from 'lucide-react';

const skillUrl = 'https://www.workbuddy.cn/share/asset?extra_from=&resource_type=link&shareCode=cs261118YZWQFx8j4E1EJqoU1XnaX6&share_way=link&sig=pUXI9n0BCGOK411w';
const starterPrompt = '请使用「半知精读」技能，把我提供的英语学习资料制作成可阅读、可学习的精读手账。先问我学习目标和英语水平，再围绕材料整理词句解析、内容理解与学习练习；保留来源信息，最后留出用自己的话复述和做笔记的位置。';
export default function SkillHome({ onRead, children }: { onRead: (id: string) => void; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState('');
  async function copy(value: string, message: string) {
    try { await navigator.clipboard.writeText(value); setCopied(message); }
    catch { setCopied('复制未完成，可选中下面文字手动复制。'); }
  }
  return <>
    <JournalWorkshop onRead={onRead} skillUrl={skillUrl}/>
    {children}
    <section className="skill-getting-started house-wrap" id="get-banzhi-skill" aria-labelledby="skill-start-title"><div className="skill-start-top"><div><span className="house-eyebrow">MAKE YOUR OWN JOURNAL</span><h2 id="skill-start-title">一份资料，一本自己的精读手账。</h2></div><button className="house-text-link" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="skill-install-details">{open ? '收起使用指引' : '展开使用指引'}<ArrowDown size={15}/></button></div><div className="skill-three-steps">{[['01','选一份资料','准备想读懂、有权使用的英语材料。'],['02','说明学习目标','说明英语水平和学习目的。'],['03','确定手账重点','选择生词发音、长难句解析或地道表达。'],['04','在 WorkBuddy 制作','调用半知精读技能，生成手账。'],['05','读完自己检查','做题型演练，用自己的话复述，再回看生词。']].map(([n,title,copy])=><div key={n}><span>{n}</span><strong>{title}</strong><p>{copy}</p></div>)}</div>
      {open && <div className="skill-install-details" id="skill-install-details"><div><h3>在 WorkBuddy 使用「半知精读」</h3><p>打开技能分享页，在 WorkBuddy 中使用「半知精读」。贴入一段英文，告诉它你的水平和想练习的内容。</p><div className="skill-install-actions"><a href={skillUrl} target="_blank" rel="noopener noreferrer" className="house-button dark">打开半知精读分享页 <ArrowUpRight size={15}/></a><button className="house-text-link" onClick={() => copy(skillUrl, '分享链接已复制')}>复制分享链接 <Copy size={14}/></button></div><a className="skill-doc-link" href="https://www.workbuddy.cn/docs/workbuddy/From-Beginner-to-Expert-Guide/Function-Description/Skills-Market" target="_blank" rel="noopener noreferrer">查看 WorkBuddy 官方技能安装说明 <ArrowUpRight size={12}/></a></div><div><h3>第一次使用，可以这样开始</h3><p className="skill-prompt">{starterPrompt}</p><button className="house-text-link" onClick={() => copy(starterPrompt, '使用指令已复制，带到 WorkBuddy 开始制作。')}>复制使用指令 <Copy size={14}/></button></div><p className="skill-install-note">本站提供成品试读与学习场景，Skill 的安装和资料生成在 WorkBuddy 中完成。</p>{copied && <p className="skill-copy-notice" role="status">{copied}</p>}</div>}
    </section>
    <section className="skill-community-strip house-wrap"><div><p>翻看精读手账的封面与原稿内页。</p></div><a href="#/exhibition" className="house-text-link">逛手帐展 <ArrowRight size={16}/></a></section>
  </>;
}
