'use client';
import {useState} from 'react';
import {Search} from 'lucide-react';
import {journals,type Journal} from './data';
import {groupById,groupPriceCents,journalGroups} from './group-data';
import {JournalPurchase} from './journal-purchase';

const catalog = new Map(journals.map(book=>[book.id,book]));
const cleanTitle = (book:Journal) => book.title.replaceAll('\n','');
const editions = journalGroups.map(group=>{
  const books=group.books.map(id=>catalog.get(id)!);
  return {group,books,series:books.every(book=>book.tedTopic)?'TED 选集':'主题选读'};
});
const price = '¥'+(groupPriceCents/100).toFixed(2);
const featured=editions[0];
const firstBook=featured.books[0];
const inside=firstBook.pdf!.previews.find(page=>page.page>1);

export default function GroupShelf({id,onRead}:{id?:string;onRead:(id:string)=>void}) {
  const [query,setQuery]=useState('');
  const [series,setSeries]=useState('全部');
  const group=groupById(id);
  if (group) return <div className="wrap page-space folio-detail"><a className="folio-back" href="#/groups">返回七本组目录</a><JournalPurchase key={group.id} id={group.id}/></div>;
  if (id) return <section className="wrap page-space"><h1>未找到这个书组</h1><a className="folio-back" href="#/groups">查看全部书组</a></section>;

  const needle=query.trim().toLocaleLowerCase();
  const results=editions.filter(item=>series==='全部'||item.series===series).map(item=>{
    const matches=needle?item.books.filter(book=>[cleanTitle(book),book.en,book.tedTopic,book.level].some(value=>value?.toLocaleLowerCase().includes(needle))):[];
    return {...item,matches};
  }).filter(({group,matches})=>!needle||matches.length>0||group.title.toLocaleLowerCase().includes(needle));
  return <div className="wrap folio">
    <header className="folio-mast"><div><h1>七本组书架</h1><p>{journalGroups.length} 组精读手账，每组 7 本。点开书名即可试读。</p><span className="folio-price">{price}<small> / 组</small></span></div>
      <a className="folio-feature" href={'#/groups/'+featured.group.id}>
        <div className="folio-plates" aria-hidden="true">{inside&&<img className="folio-inner-page" src={inside.src} alt=""/>}<img className="folio-cover-page" src={firstBook.pdf!.cover} alt=""/></div>
        <div><small>本架选读</small><strong>{featured.group.title}</strong><span>从《{cleanTitle(firstBook)}》读起</span></div>
      </a>
    </header>
    <div className="folio-tools"><div className="folio-tabs" role="group" aria-label="书组系列">{['全部','主题选读','TED 选集'].map(label=><button type="button" key={label} aria-pressed={series===label} onClick={()=>setSeries(label)}>{label}</button>)}</div>
      <label className="folio-search"><Search size={18} aria-hidden="true"/><input type="search" value={query} placeholder="搜书名、主题或难度" aria-label="搜书名、主题或难度" onChange={event=>setQuery(event.target.value)}/></label></div>
    <p className="folio-results" role="status">{results.length} 组{needle?'匹配「'+query.trim()+'」':''}</p>
    <div className="folio-list">{results.map(({group,books,matches,series:category})=>{
      const preview=matches.length?matches:category==='TED 选集'?books.slice(1,3):books.slice(0,2);
      const cover=books.find(b=>b.pdf)?.pdf?.cover;
      return <article key={group.id} className="folio-row">
        <a className="folio-thumb" href={'#/groups/'+group.id} aria-label={'查看'+group.title}>{cover?<img loading="lazy" decoding="async" width="72" height="96" src={cover} alt=""/>:<span className="folio-typeset" aria-hidden="true">{group.title}</span>}</a>
        <div className="folio-body"><small>{category}{category==='TED 选集'?' · '+group.title.split(' · ').at(-1):''}</small>
          <h2><a href={'#/groups/'+group.id}>{category==='TED 选集'&&!needle?cleanTitle(books[0])+' 等七篇':group.title}</a></h2>
          <div className="folio-titles">{preview.map(book=><button type="button" key={book.id} onClick={()=>onRead(book.id)} aria-label={'试读'+cleanTitle(book)}>{cleanTitle(book)}</button>)}</div>
        </div><a className="folio-open" href={'#/groups/'+group.id} aria-label={'查看'+group.title+'的七本书目'}>查看 7 本</a>
      </article>;
    })}</div>
    {!results.length&&<div className="folio-empty"><p>当前范围内没有匹配的书组。</p><button type="button" className="house-button light" onClick={()=>{setQuery('');setSeries('全部')}}>查看全部书组</button></div>}
  </div>;
}
