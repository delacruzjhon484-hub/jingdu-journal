'use client';

import { useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, Copy, Feather, MessageCircle, PenLine, Users } from 'lucide-react';

function jumpTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: 'start',
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}

const supportTeam = [
  { id: 'person', title: '石雄真人陪学', role: '陪你建立节奏，也一起面对卡点。', label: '真人陪伴', icon: Users,
    tasks: ['带读中的思路引导', '关键问题的讨论与反馈', '阶段复盘与结营回看'], result: '有人回应，也有人一起往前走。' },
  { id: 'agent', title: 'Agent 助教团', role: '把随手一问，变成具体的学习动作。', label: '日常练习', icon: MessageCircle,
    tasks: ['词句助教 · 拆长句、看搭配', '表达助教 · 练复述、找遗漏', '复习助教 · 整理回看清单'], result: '把问题拆小，把练习做具体。' },
  { id: 'research', title: '半知精读教研团队', role: '在你翻开手账之前，把学习路径理顺。', label: '内容与方法', icon: BookOpen,
    tasks: ['围绕目标选材与编排', '设计译注、问题与练习', '结合学习反馈迭代手账'], result: '每次阅读，都有材料、方法和落点。' },
];

const dailySteps = [
  { title: '带读', subtitle: '读进去', owner: '石雄真人陪学 × 半知精读教研团队', desc: '先带着一个问题进入文章，再拆开关键句、主张和证据。',
    task: '读完后用自己的话说说，窗边的笔记本改变了什么？', output: '留下一个自己的解释',
    prompt: '我在精读一篇关于注意力的文章。请先问我“窗边的笔记本最先改变了什么”，等我回答后再追问证据，最后帮我区分文章写到的内容和我的推断。' },
  { title: '打卡', subtitle: '留痕迹', owner: '社群 × Agent 助教团', desc: '交一段复述、一条批注或一个练习，让这次阅读有东西留下。',
    task: '用 “Before…, I…” 写一句你愿意尝试的小改变。', output: '留下一句迁移表达',
    prompt: '我想用 Before…, I… 写一句日常表达。请先让我自己写，收到后检查句意是否清楚、时态是否一致，再给我一个相似场景继续练习。' },
  { title: '答疑', subtitle: '解卡点', owner: 'Agent 助教团 × 石雄真人陪学', desc: '具体词句先拆解，再把仍未理解的部分整理成问题带入讨论。',
    task: '“a space in which to choose” 怎么理解？哪部分修饰哪部分？', output: '留下一张问题卡',
    prompt: '请用中文帮我拆解 a space in which to choose。先标出中心词与修饰关系，给出两个简单例句，再用一道小题检查我是否理解。' },
  { title: '社群', subtitle: '听见别人', owner: '同伴交流 × 石雄真人陪学', desc: '把自己的理解讲出来，也听听别人怎样读同一段文字。',
    task: '选一句你认同或有疑问的话，补上理由，向同伴提一个问题。', output: '留下一次有内容的交流',
    prompt: '我想把阅读感受整理成社群讨论发言。请依次问我：我选了哪句话、为什么、它让我想到什么、我想问同伴什么。最后帮我整理成四句话。' },
  { title: '复盘', subtitle: '再回看', owner: 'Agent 助教团 × 半知精读教研团队', desc: '回看 D1、D3、D7 的记录，找到记住了什么、哪里还需要再练。',
    task: '合上原文，复述主线，再对照最初的笔记补一处遗漏。', output: '留下一版更新后的理解',
    prompt: '请帮我做一次精读复盘。先让我不看原文复述主线，再让我贴出原文和初次笔记，比较哪些理解有依据、哪些遗漏需要补充，最后整理下一轮回看清单。' },
];

export function CampHero() {
  return <section className="camp-v2-hero house-wrap">
    <div className="camp-v2-intro">
      <span className="house-eyebrow"><Feather size={14}/> 精读手账馆 · 半知精读陪学</span>
      <h1>60 天，把「看懂」<br/>练成<span>「说出来」。</span></h1>
      <p className="camp-v2-lead">一篇内容，一本精读手账，一次自己的表达。<br/>带读 · 打卡 · 答疑 · 社群，把阅读落到每天。</p>
      <div className="camp-v2-teamline"><strong>石雄真人陪学</strong><span>×</span><strong>Agent 助教团</strong><span>×</span><strong>半知精读教研团队</strong></div>
      <div className="house-actions"><button className="house-button dark" onClick={() => jumpTo('camp-interest')}>选择我的陪学主题 <ArrowRight size={16}/></button><button className="house-text-link" onClick={() => jumpTo('camp-support')}>看看谁来陪、怎么陪 <ArrowDown size={15}/></button></div>
      <p className="camp-v2-status">60 天 · 每主题规划 60 篇 · ¥699 / 主题方案</p>
      <small className="house-plan-note">陪学服务筹备中 · 开营时间、服务排期与 Agent 使用方式将在报名开放时公布</small>
    </div>
    <div className="camp-v2-desk" aria-label="精读手账和三方陪学分工示意">
      <span className="camp-v2-desk-top">THE DAILY READING JOURNAL <span>01 / 60</span></span>
      <div className="camp-v2-notebook">
        <span>精读手账馆 / 原创练习</span><h2>A little more<br/>attention.</h2>
        <p>What deserves my attention today?</p>
        <span className="camp-v2-paper-note">今天，什么值得我投入注意力？</span>
        <div className="camp-v2-paper-checks"><span><Check size={12}/>读懂一句</span><span><Check size={12}/>写下联想</span><span><Check size={12}/>复述一次</span></div>
        <small>READ · THINK · WRITE · RETELL</small>
      </div>
      <div className="camp-v2-margin"><div><span>教研团队</span><p>选材、译注、设计练习</p></div><div><span>Agent 助教团</span><p>拆词句、练表达、做复习</p></div><div><span>石雄</span><p>真人带读与阶段陪伴</p></div></div>
      <span className="camp-v2-desk-foot">一份手账，把陪学串起来。</span>
    </div>
    <div className="camp-v2-measures">{[['60','天','持续精读周期'],['60','篇','每主题内容规划'],['3','方','真人 × Agent × 教研'],['3','分钟','TED 主题结营复述目标']].map(([number,unit,label]) => <div key={label}><strong>{number}<small>{unit}</small></strong><span>{label}</span></div>)}</div>
  </section>;
}

export function CampSupport() {
  return <section className="camp-v2-support house-wrap" id="camp-support" aria-labelledby="camp-support-title">
    <div className="house-section-top"><div><span className="house-eyebrow">THREE ROLES, ONE LEARNING JOURNEY</span><h2 id="camp-support-title">有人陪你学，也有人把学习备好。</h2></div><span className="house-section-note">三方协作的陪学服务设计</span></div>
    <div className="camp-v2-team-grid">{supportTeam.map(({ id, title, role, label, icon: Icon, tasks, result }) => <article className={`camp-v2-team ${id}`} key={id}><div className="camp-v2-team-head"><Icon size={22}/><span>{label}</span></div><h3>{title}</h3><p>{role}</p><ul>{tasks.map(task => <li key={task}><Check size={13}/>{task}</li>)}</ul><div className="camp-v2-team-result">{result}</div></article>)}</div>
  </section>;
}

export function CampStudyDay({ onRead }: { onRead: (id: string) => void }) {
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState('');
  const selected = dailySteps[step];
  async function copy() {
    try { await navigator.clipboard.writeText(selected.prompt); setMessage('指令已复制，可带到你的 AI 工具中练习。'); }
    catch { setMessage('可以选中下方练习指令，手动复制。'); }
  }
  return <section className="camp-v2-day house-wrap" aria-labelledby="camp-day-title">
    <div className="house-section-top"><div><span className="house-eyebrow">A DAY IN THE CAMP</span><h2 id="camp-day-title">每天怎么学，先体验一个小片段。</h2></div><button className="house-text-link" onClick={() => onRead('small-attention')}>打开配套原创手账 <ArrowUpRight size={15}/></button></div>
    <div className="camp-v2-day-tabs" role="group" aria-label="每日陪学环节">{dailySteps.map((item,index) => <button key={item.title} aria-pressed={step === index} onClick={() => {setStep(index);setMessage('');}}><span>0{index + 1}</span><strong>{item.title}</strong><small>{item.subtitle}</small></button>)}</div>
    <div className="camp-v2-day-panel"><div><span className="house-eyebrow">0{step + 1} / {selected.owner}</span><h3>{selected.title}，{selected.subtitle}。</h3><p>{selected.desc}</p><div className="camp-v2-task"><PenLine size={17}/><p>{selected.task}</p></div><span className="camp-v2-output"><Check size={13}/>{selected.output}</span></div>
      <div className="camp-v2-prompt"><div><span>Agent 助教练习指令</span><small>方法体验</small></div><p>{selected.prompt}</p><button className="house-text-link" onClick={copy}><Copy size={14}/>复制这个练习指令</button>{message && <p className="camp-v2-copy-notice" role="status">{message}</p>}</div>
    </div>
  </section>;
}

export function CampJourney() {
  return <section className="camp-v2-journey house-wrap" aria-labelledby="camp-journey-title">
    <div className="house-section-top"><div><span className="house-eyebrow">60 DAYS, SMALL STEPS</span><h2 id="camp-journey-title">有节奏地读，也有意识地回头看。</h2></div></div>
    <ol>{[['D1','建立方法','认识精读手账，记录第一版理解。'],['D3','第一次回看','合上原文，回想词句与观点。'],['D7','第一周复盘','带着问题再读，补充自己的笔记。'],['每周','交流与反馈','跟读、复述、讨论，整理待解决的问题。'],['D60','结营作品','以一份精读成果，回看自己的变化。']].map(([day,title,line]) => <li key={day}><span>{day}</span><h3>{title}</h3><p>{line}</p></li>)}</ol>
    <div className="camp-v2-final"><span>结营目标</span><p>TED 主题以 <strong>3 分钟英文复述</strong>为目标；外刊与名著节选主题围绕所读内容完成复述或读后表达。</p><small>具体篇目、任务与评价方式以开营安排为准。</small></div>
  </section>;
}
