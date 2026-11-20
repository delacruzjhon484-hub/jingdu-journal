'use client';
import {useState} from 'react';
import {journals} from './data';
import {groupById,journalGroups} from './group-data';
import {JournalPurchase} from './journal-purchase';

const titleFor = (id:string) => journals.find(book=>book.id===id)?.title.replaceAll('\n','') ?? '';
export default function GroupShelf({id}:{id?:string}) {
  const [query,setQuery]=useState('');
  const group=groupById(id);
  if (group) return <div className="wrap page-space"><a className="back-link" href="#/groups">← 全部七本组</a><h1>{group.title}</h1><JournalPurchase key={group.id} id={group.id}/></div>;
  const visible=journalGroups.filter(group=>[group.title,...group.books.map(titleFor)].some(title=>title.includes(query.trim())));
  return <section className="wrap page-space"><h1>七本一组，按组收藏。</h1><p>每组 ¥12.90。展开书目，翻开任意一本试读。</p>
    <label className="group-search">查找主题或书名 <input type="search" value={query} onChange={event=>setQuery(event.target.value)} placeholder="例如：睡眠"/></label>
    <div className="group-grid">{visible.map(group=><article key={group.id}><h2><a href={'#/groups/'+group.id}>{group.title}</a></h2><p>{titleFor(group.books[0])} 等 7 本</p><details><summary>查看七本书目</summary><ol>{group.books.map(id=><li key={id}><a href={'#/journal/'+id}>{titleFor(id)}</a></li>)}</ol></details><a className="house-text-link" href={'#/groups/'+group.id}>查看整组 · ¥12.90 →</a></article>)}</div>
    {!visible.length&&<p>没有匹配的书组，可以换个书名试试。</p>}</section>;
}
