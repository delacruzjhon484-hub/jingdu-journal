'use client';
import { AccessHelp } from './access-help';
import { checkoutLink } from './pages-runtime';

import { OutcomeWall } from './buddy-reading';
import { ArrowUpRight, Check } from 'lucide-react';
import { campProducts, campRoute, campThemes } from './reading-house-data';
import { CampHero, CampSupport, CampStudyDay, CampJourney } from './camp-experience';

export default function ReadingCamp({ themeId, onRead }: { themeId: string; onRead: (id: string) => void }) {
  const product = campProducts.find(item => item.route === themeId) ?? campProducts[0];
  const {theme:selected,plan} = product;
  return <div className="reading-camp">
    <CampHero plan={plan} theme={selected.id}/>
    <section className="house-wrap camp-choose" aria-labelledby="camp-themes-title"><div className="house-section-top"><div><span className="house-eyebrow">CHOOSE YOUR READING</span><h2 id="camp-themes-title">这次想读哪个主题？</h2></div><span className="house-section-note">{plan.name} · 每天一篇，共 {plan.days} 篇</span></div>
      <div className="camp-theme-grid">{campThemes.map(theme => <a href={`#/camp/${campRoute(theme.id,plan)}`} key={theme.id} className={`camp-theme ${selected.id === theme.id ? 'selected' : ''}`} aria-current={selected.id === theme.id ? 'true' : undefined}><span>{theme.number} / {theme.note}</span><strong className="camp-theme-mark" aria-hidden="true">{theme.mark}</strong><h3>{theme.title} <small>{plan.days} 篇</small></h3><p>{theme.line}</p><div>{selected.id === theme.id ? <><Check size={15}/>已选主题</> : <>选择这个主题 <ArrowUpRight size={15}/></>}</div></a>)}</div>
    </section>
    <section className="camp-interest house-wrap" id="camp-interest"><div><span className="house-eyebrow">{plan.days} 天陪学</span><h2>{product.title}</h2><p>共 {plan.days} 篇，¥{plan.price}。用 ChatGPT 账号登录后查看报名安排，尚未排期的主题可免费登记邮件提醒。</p></div><div><a className="house-button violet" href={checkoutLink('/camp/'+product.route)}>查看排期与报名 <ArrowUpRight size={15}/></a><p><a href="#/orders">查看我的报名订单</a></p><AccessHelp/></div></section>
    <CampJourney plan={plan}/>
    <CampSupport/>
    <CampStudyDay onRead={onRead}/>
    <div className="house-wrap"><OutcomeWall onRead={onRead}/></div>
    <section className="camp-faq house-wrap"><h2>关于这次陪学</h2>{[
      ['半知创始人、Agent 助教团和教研团队分别做什么？','半知创始人负责真人陪学中的引导、交流与阶段回看。Agent 助教团围绕词句、表达、复习协助日常练习。半知精读教研团队负责选材编排、译注与练习设计，并结合学习反馈迭代内容。'],
      ['现在可以试用 Agent 助教吗？','页面提供可切换的练习示例与可复制指令，可配合原创手账在你自己的 AI 工具中体验。陪学营的 Agent 使用入口与具体使用方式将在正式报名时公布。'],
      ['陪学营和精读手账有什么区别？','精读手账提供文本拆解、批注和练习，适合自主使用。陪学营增加学习节奏、真人陪伴、Agent 助教与社群交流，把手账串成持续的学习过程。'],
      ['现在可以报名吗？','已公布排期并开放报名的主题可按所选营期的价格生成报名订单。其余主题可免费登记开营提醒。'],
      ['三个主题是一起学吗？','TED、外刊、名著节选是三个不同主题。当前展示的每个营期选一个主题，每天一篇。'],
    ].map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</section>
  </div>;
}
