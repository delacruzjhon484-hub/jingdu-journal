import {saleLabel} from '../app/group-data';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import type {Journal} from '../app/data';

const base='https://www.jingdushouzhang.com/';
const esc=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
const style='*{box-sizing:border-box}body{margin:0;background:#f8f6f0;color:#273d33;font:17px/1.85 system-ui,sans-serif}main{max-width:830px;margin:auto;padding:clamp(24px,6vw,64px) 24px}header{border-bottom:1px solid #c7d0bd;padding-bottom:14px;margin-bottom:32px}a{color:#245c49;text-underline-offset:3px}h1,h2{font-family:Georgia,"Songti SC",serif;line-height:1.35}h1{font-size:clamp(32px,5vw,55px)}img{max-width:100%;height:auto;border:1px solid #d8d9cf}li{margin:.35em 0}.actions{display:flex;gap:16px;align-items:center;flex-wrap:wrap}.go{background:#285943;color:white;padding:8px 18px;border-radius:5px;text-decoration:none}small{color:#536157} section{padding:10px 0}';
function documentPage(path:string,title:string,description:string,body:string){
 const home=path.startsWith('read/')?'../':'./';
 return '<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+' · 精读手账馆</title><meta name="description" content="'+esc(description)+'"><link rel="canonical" href="'+base+path+'"><style>'+style+'</style></head><body><main><header><a href="'+home+'">精读手账馆</a>　/　<a href="'+home+'read/index.html">馆藏目录</a></header>'+body+'</main></body></html>';
}
export function writeReadingPages(books:Journal[]){
 const dir=join(process.cwd(),'public');
 mkdirSync(join(dir,'read'),{recursive:true});
 const save=(path:string,title:string,desc:string,body:string)=>writeFileSync(join(dir,path),documentPage(path,title,desc,body));
 const link=(j:Journal)=>'<li><a href="'+j.id+'.html">'+esc(j.title.replaceAll('\n',''))+'</a>　<small>'+esc(j.level)+' · '+esc(j.duration)+'</small></li>';
 for(const j of books){
  const title=j.title.replaceAll('\n','');
  const source=j.tedTopic?'TED 演讲 · '+j.tedTopic:j.pdf?'馆藏 PDF 原稿':'本站原创练习';
  const excerpt=j.pdf?'<img loading="lazy" width="360" alt="'+esc(title)+' · 原版封面试读" src="../'+esc(j.pdf.cover.replace(/^\.\//,''))+'">':'<blockquote lang="en">'+esc(j.passages[0]??'')+'</blockquote>';
  save('read/'+j.id+'.html',title,j.desc,'<small>'+esc(source)+'</small><h1>'+esc(title)+'</h1><p>'+esc(j.desc)+'</p><p>'+esc(j.level)+' · '+esc(j.duration)+' · '+saleLabel(j.id)+'</p><p class="actions"><a class="go" href="../#/journal/'+j.id+'">打开试读与购买详情 →</a><a href="index.html">继续选读</a></p>'+excerpt+'<h2>适合谁</h2><p>'+esc(j.audience)+'</p><h2>这篇练什么</h2><p>'+esc(j.outcome)+'</p>');
 }
 save('read/index.html','全馆手账目录','按来源浏览手账、查看难度、学习时长和独立试读页。','<h1>全馆手账目录</h1><p>共 '+books.length+' 本。选择书名，查看学习重点、难度与试读。</p>'+[['原创练习',books.filter(b=>!b.pdf)],['精读笔记',books.filter(b=>b.pdf&&!b.tedTopic)],['TED 演讲',books.filter(b=>b.tedTopic)]].map(([name,items])=>'<section><h2>'+name+'</h2><ul>'+(items as Journal[]).map(link).join('')+'</ul></section>').join(''));
 const paths=['','read/index.html','service.html',...books.map(j=>'read/'+j.id+'.html')];
 writeFileSync(join(dir,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+paths.map(p=>'<url><loc>'+base+p+'</loc></url>').join('')+'</urlset>');
 writeFileSync(join(dir,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: '+base+'sitemap.xml\n');
}
