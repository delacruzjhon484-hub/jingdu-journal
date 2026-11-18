'use client';
import { onlineSite, siteFetch as fetch } from './pages-runtime';
import {useEffect,useState} from 'react';
import {Download,LockKeyhole,Check,ArrowUpRight,RefreshCw} from 'lucide-react';
import {journals,type Journal} from './data';
export type ProductAccess={owned:boolean;canPurchase:boolean;priceCents:number;signedIn:boolean;signInUrl:string;onlineOnly?:boolean};
export function useJournalProduct(id:string){
 const [access,setAccess]=useState<ProductAccess|null>(null);const [content,setContent]=useState<Journal|null>(null);const [error,setError]=useState('');const [attempt,setAttempt]=useState(0);
 useEffect(()=>{const c=new AbortController();setAccess(null);setContent(null);setError('');fetch(`/api/journal-access?id=${encodeURIComponent(id)}`,{signal:c.signal}).then(async r=>{const d=await r.json() as ProductAccess & {error?:string};if(!r.ok)throw Error(d.error||'暂时无法核验购买记录。');if(c.signal.aborted)return;setAccess(d);if(d.owned){const response=await fetch(`/api/journal-content?id=${encodeURIComponent(id)}`,{signal:c.signal});const full=await response.json() as Journal & {error?:string};if(!response.ok)throw Error(full.error||'暂时无法打开已购手账。');if(!c.signal.aborted)setContent(full);}}).catch(e=>{if(!c.signal.aborted)setError(e.message||'暂时无法核验购买记录。');});return()=>c.abort();},[id,attempt]);
 return {access,content,error,retry:()=>setAttempt(v=>v+1)};
}
export function PurchasePanel({id,product}:{id:string;product:ReturnType<typeof useJournalProduct>}){
 const journal=journals.find(j=>j.id===id)!;const {access,error,retry}=product;
 return <section className="purchase-panel" id="journal-purchase" aria-label="购买与下载"><div className="purchase-heading"><div><small>单本购买 · 一次付费</small><h3>{journal.title.replace('\n','')}</h3></div><strong className="journal-price">¥12.9<small>/ 本</small></strong></div><ul><li><Check size={14}/>完整原文与译注</li><li><Check size={14}/>词句解析、练习与参考思路</li><li><Check size={14}/>{journal.pdf ? `原版 PDF · ${journal.pdf.pages} 页${journal.pdf.versions.length>1 ? ' · 含不同版本' : ''}` : '下载 HTML 手账，可打印为 PDF'}</li></ul>{error?<p className="purchase-status" role="alert">{error}<button onClick={retry}><RefreshCw size={13}/>重试</button></p>:!access?<p className="purchase-status" role="status">正在核验购买记录…</p>:access.owned?<><a className="btn btn-dark" href={`/api/journal-content?id=${encodeURIComponent(id)}&download=1`}><Download size={16}/>下载已购手账</a><p className="purchase-status">已购买 · 下载权限随账号保存</p></>:<><p className="purchase-status">登录后生成订单，微信付款 ¥12.90。人工核实后，用同一账号下载。北京时间 09:00–20:00 处理，时段外顺延。</p><a className="btn btn-dark" href={access.signInUrl} target="_top">购买这本手账 · ¥12.90 <ArrowUpRight size={14}/></a><a className="house-text-link" href={onlineSite+'#/orders'}>查看我的订单与下载</a></>}</section>;
}
export function JournalPurchase({id}:{id:string}){const product=useJournalProduct(id);return <PurchasePanel id={id} product={product}/>;}
