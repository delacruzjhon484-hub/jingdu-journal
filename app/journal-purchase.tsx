'use client';
import { AccessHelp } from './access-help';
import { siteFetch as fetch } from './pages-runtime';
import {useEffect,useState} from 'react';
import {Download,LockKeyhole,Check,ArrowUpRight,RefreshCw} from 'lucide-react';
import {journals,type Journal} from './data';
import {groupById,groupForBook} from './group-data';
import {studyLink} from './study-selection';
import {checkoutLink} from './pages-runtime';
export type ProductAccess={owned:boolean;canPurchase:boolean;priceCents:number;signedIn:boolean;signInUrl:string;onlineOnly?:boolean};
export function useJournalProduct(id:string){
 const [access,setAccess]=useState<ProductAccess|null>(null);const [content,setContent]=useState<Journal|null>(null);const [error,setError]=useState('');const [attempt,setAttempt]=useState(0);
 useEffect(()=>{const c=new AbortController();setAccess(null);setContent(null);setError('');fetch(`/api/journal-access?id=${encodeURIComponent(id)}`,{signal:c.signal}).then(async r=>{const d=await r.json() as ProductAccess & {error?:string};if(!r.ok)throw Error(d.error||'暂时无法核验购买记录。');if(c.signal.aborted)return;setAccess(d);if(d.owned){const response=await fetch(`/api/journal-content?id=${encodeURIComponent(id)}`,{signal:c.signal});const full=await response.json() as Journal & {error?:string};if(!response.ok)throw Error(full.error||'暂时无法打开已购手账。');if(!c.signal.aborted)setContent(full);}}).catch(e=>{if(!c.signal.aborted)setError(e.message||'暂时无法核验购买记录。');});return()=>c.abort();},[id,attempt]);
 return {access,content,error,retry:()=>setAttempt(v=>v+1)};
}
export function PurchasePanel({id,product}:{id:string;product:ReturnType<typeof useJournalProduct>}){
 const group=groupById(id)??groupForBook(id);
 if(!group)return <section className="purchase-panel"><a href={studyLink(id)??'#/groups'}>进入免费书房 →</a></section>;
 return <section className="purchase-panel" id="journal-purchase"><small>精读手账 · 七本组</small><h3>{group.title}</h3><strong>¥12.90 / 组</strong><ol>{group.books.map(book=><li key={book}><a href={'#/journal/'+book}>{journals.find(j=>j.id===book)?.title.replaceAll('\n','')}</a></li>)}</ol><p>官网下单，微信扫码后人工核实。核实到账后开通以上全部 7 本。</p><a className="btn btn-dark" href={checkoutLink('/groups/'+group.id)}>前往官网购买这 7 本 · ¥12.90 →</a><AccessHelp/></section>;
}
export function JournalPurchase({id}:{id:string}){const product=useJournalProduct(id);return <PurchasePanel id={id} product={product}/>;}
