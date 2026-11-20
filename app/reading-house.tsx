'use client';
import {useState} from 'react';
import {ArrowRight,ArrowUpRight,BookOpen,Feather} from 'lucide-react';
import {JournalSample} from './journal-experience';
import type {LearningRecord} from './reading-records';
import {campPlans,campRoute,learningGoals} from './reading-house-data';
import {journals} from './data';
import JournalWorkshop from './journal-workshop';
import SkillHome from './skill-home';

const recommendations=[
 {book:'pdf-human-memory',camp:'press-month',campName:'外刊精读 · 一月营',why:'备考阅读常遇到作者先提出解释、再用实验修正它。练习定位观点和证据，适合四六级、考研阅读备考。此篇为拓展练习。'},
 {book:'ted-180',camp:'ted-week',campName:'TED 精读 · 一周营',why:'从分布式团队的案例入手，练习用英文向同事解释一项工作安排。'},
 {book:'book-into-life',camp:'books-week',campName:'名著节选 · 一周营',why:'从一段文字里找出打动自己的细节，再用一句话说明它与你的生活有什么关系。'},
];
export default function ReadingHouse({onRead,record,onChange}:{onRead:(id:string)=>void;record:LearningRecord;onChange:(value:{note:string;done:boolean})=>void}){
 const [goal,setGoal]=useState(0), pick=recommendations[goal], book=journals.find(j=>j.id===pick.book)!;
 return <div className="reading-house">
 <JournalWorkshop onRead={onRead}/><JournalSample record={record} onChange={onChange} onRead={onRead}/>
 <section className="house-wrap front-section"><div className="house-section-top"><h2>按你的目标，找一本读。</h2></div>
 <div className="front-tabs" role="group" aria-label="学习目标">{learningGoals.map((g,i)=><button key={g.id} aria-pressed={goal===i} onClick={()=>setGoal(i)}>{g.label}</button>)}</div>
 <div className="front-recommend" aria-live="polite"><div><small>{book.tedTopic?'TED 演讲':book.pdf?'PDF 精读笔记':'本站原创'} · {book.level} · {book.duration}</small><h3>{book.title.replaceAll('\n','')}</h3><p>{pick.why}</p></div><div><button className="house-button light" onClick={()=>onRead(book.id)}>试读这一本 <ArrowRight size={16}/></button><a className="house-text-link" href={'#/camp/'+pick.camp}>{pick.campName} <ArrowUpRight size={15}/></a></div></div>
 <div className="front-links"><a href="./read/index.html">查看全馆 {journals.length} 本手账 →</a><a href="#/exhibition">按标签逛手帐展 →</a></div></section>
 <section className="house-wrap front-section"><div className="house-section-top"><h2>自己读，还是一起学？</h2></div><div className="house-product-grid">
 <article className="house-product journal"><BookOpen size={23}/><h3>自己读一本</h3><strong className="front-price">¥12.9 <small>/ 本</small></strong><p>按本购买，照自己的节奏读。TED 系列每本含可手写的 PDF 和互动网页版，其他手账的交付格式见详情。</p><a className="house-button light" href="#/cinema">浏览与试读 <ArrowUpRight size={16}/></a></article>
 <article className="house-product camp"><Feather size={23}/><h3>跟着陪学营读</h3><div className="house-camp-options">{campPlans.map(p=><a key={p.key} href={'#/camp/'+campRoute('ted',p)}><span>{p.name}</span><strong>¥{p.price}</strong><small>{p.days} 天 · {p.days} 篇</small></a>)}</div><p>每天一篇，按营期使用当期学习材料，共同带读、打卡和答疑。选营时可查看开营日期，待排期的营可免费登记提醒。</p><a className="house-button light" href="#/camp">查看各营排期 <ArrowUpRight size={16}/></a></article></div></section>
 <section className="house-wrap front-section front-trust"><div><small>半知创始人 · 石雄</small><h2>谁在陪你读？</h2><p>石雄发起精读手账馆，带领半知精读教研团队选材、设计练习，在陪学营中参与带读、讨论和阶段回看。Agent 助教团协助拆句、复述和复习。</p><a className="house-text-link" href="#/camp">了解陪学分工 →</a></div><div><small>翻开一份真实馆藏</small><h3>《睡眠才是超能力》</h3><p>看看第 1 页怎样安排学习路线，再翻到第 3 页，看演讲中的英文怎样变成一页精读练习。</p><button className="house-text-link" onClick={()=>onRead('ted-001')}>查看原版内页 →</button></div></section>
 <section className="house-wrap front-section front-faq"><h2>开始前，你可能想知道</h2>
 <details><summary>适合什么程度？一篇要读多久？</summary><p>先看每本的难度和预计时长。原创体验篇《把注意力，还给自己》标为 B1、约 20 分钟。TED 手账通常包含多项练习，可以先完成一个选段，之后再做复述。</p></details>
 <details><summary>PDF 和互动网页版怎么选？</summary><p>PDF 适合打印和 iPad 手写；互动版适合在浏览器里听读、做题和复习。购买前可在详情页核对这一本包含哪些格式。</p></details>
 <details><summary>陪学营含哪些材料？错过打卡怎么办？</summary><p>对应营期安排 7、30 或 60 篇学习材料。营内使用当期学习材料；如需某一本的独立下载版，请先核对报名说明。错过当天可先回看自己的手账，需要补交或调整进度时联系当期带读老师。</p></details>
 <details><summary>付款后多久开通？需要退款怎么联系？</summary><p>订单采用微信扫码、人工核实到账。客服在 09:00–20:00 处理。遇到重复付款、下载异常或退营需求，请保留订单号，联系微信 imhuangshu 或邮箱 2031887069@qq.com。</p><a href="./service.html#refund">查看售后与退款流程 →</a></details>
 <SkillHome/></section></div>;
}
