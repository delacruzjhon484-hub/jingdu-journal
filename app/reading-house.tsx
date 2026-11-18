'use client';

import { useState } from 'react';
import { ArrowRight, ArrowUpRight, BookOpen, Feather, Layers3 } from 'lucide-react';
import { JournalSample, EditorialShelf } from './journal-experience';
import type { LearningRecord } from './reading-records';
import { learningGoals } from './reading-house-data';
import SkillHome from './skill-home';

export default function ReadingHouse({ onRead, record, onChange }: { onRead: (id: string) => void; record: LearningRecord; onChange: (value: { note: string; done: boolean }) => void }) {
  const [goal, setGoal] = useState<typeof learningGoals[number]>(learningGoals[0]);
  return <div className="reading-house">
    <SkillHome onRead={onRead}><JournalSample record={record} onChange={onChange} onRead={onRead}/></SkillHome>

    <section className="house-goals house-wrap" aria-labelledby="goals-title">
      <div className="house-section-top"><div><span className="house-eyebrow">START WITH YOUR GOAL</span><h2 id="goals-title">你想从阅读里，得到什么？</h2></div><span className="house-section-note">选一个目标，找第一本手账。</span></div>
      <div className="house-goal-tabs" role="group" aria-label="学习目标">{learningGoals.map(item => <button key={item.id} aria-pressed={item.id === goal.id} onClick={() => setGoal(item)}><span>0{learningGoals.indexOf(item) + 1}</span><strong>{item.label}</strong><small>{item.audience}</small><ArrowUpRight size={17}/></button>)}</div>
      <div className="house-goal-result"><p>{goal.line}</p><button onClick={() => onRead(goal.bookId)}>打开推荐体验篇 <ArrowRight size={15}/></button><a href={`#/camp/${goal.camp}`}>看看适合的陪学主题 <ArrowUpRight size={14}/></a></div>
    </section>

    <section className="house-products house-wrap" aria-labelledby="products-title">
      <div className="house-section-top"><div><span className="house-eyebrow">JOURNALS & COMPANIONSHIP</span><h2 id="products-title">自己慢慢读，也有人陪着走。</h2></div></div>
      <div className="house-product-grid">
        <article className="house-product journal">
          <div className="house-product-top"><span>01 / 内容产品</span><BookOpen size={24}/></div><h3>精读手账</h3><p>从一篇内容出发，留下理解、批注和练习。<br/>单本入手，也能按主题收成一组。</p>
          <div className="house-product-levels"><div><span>单本</span><p>一篇内容 · 一本手账</p></div><div><span>合集</span><p>围绕目标 · 组合成组</p></div><div><span>学习笔记</span><p>译注联想 · 留下自己的话</p></div></div>
          <a className="house-button light" href="#/cinema">浏览精读手账 <ArrowUpRight size={16}/></a>
        </article>
        <article className="house-product camp">
          <div className="house-product-top"><span>02 / 陪学服务</span><Feather size={24}/></div><h3>陪学营</h3><p>围绕一个主题，按节奏一起精读。<br/>带读 · 打卡 · 答疑 · 社群。</p>
          <div className="house-camp-facts"><strong>60<small>天</small></strong><span className="house-camp-price">¥699<small>陪学方案</small></span></div>
          <p className="house-camp-team">半知创始人真人陪学 × Agent 助教团<br/>半知精读教研团队</p>
          <p className="house-camp-plan">TED · 外刊 · 名著节选，每个主题规划 60 篇。</p>
          <a className="house-button light" href="#/camp">了解陪学营 <ArrowUpRight size={16}/></a><small className="house-plan-note">方案筹备中 · 开营日期待公布</small>
        </article>
      </div>
    </section>

    <EditorialShelf onRead={onRead}/>
    <section className="house-wrap">
      <div className="house-board-link"><Layers3 size={20}/><div><strong>已经有具体想做的事？</strong><p>从备考、旅行到写作，在 18 份场景清单里找手账。</p></div><a href="#/board" className="house-text-link">打开场景白板 <ArrowUpRight size={16}/></a></div>
    </section>

    <section className="house-method house-wrap">
      <div><span className="house-eyebrow">ONE PAGE AT A TIME</span><h2>读 · 拆 · 写 · 用</h2><p>从看懂文字，到说出自己的理解。</p><a href="#/method" className="house-text-link">看看精读方法 <ArrowUpRight size={15}/></a></div>
      <ol>{[['读','带着问题读一遍'],['拆','拆词句，也拆观点'],['写','写下复述与联想'],['用','做一个小练习']].map(([word, line], index) => <li key={word}><span>0{index + 1}</span><strong>{word}</strong><p>{line}</p></li>)}</ol>
    </section>

    <section className="house-founder house-wrap"><div className="house-founder-monogram" aria-hidden="true">知</div><div><span className="house-eyebrow">FOUNDER / 创始人</span><h2>半知创始人</h2><p>精读手账馆，由半知创始人发起。<br/>以精读手账为核心产品，连接自主阅读与持续陪学。</p></div><a href="#/camp" className="house-text-link">从一次陪学开始 <ArrowRight size={16}/></a></section>
  </div>;
}
