import { journals, type Journal } from './data';
import { boardScenes } from './scene-board-data';
import { cinemaFeed, cinemaThemes, type CinemaSubmission } from './cinema-data';

export const rooms = [
  { name: '阅读与心智', ids: ['deep-reading','human-memory','neuroplasticity'] },
  { name: '自然与宇宙', ids: ['plant-intelligence','keystone-species','planetary-systems'] },
  { name: '技术与文明', ids: ['tech-efficiency','loop-engineering','printing-press','urban-civilizations'] },
  { name: '社会与生活', ids: ['cost-of-free','convenience-cost','parking','democrats-adrift'] },
];
export type StarBook = {
  id:string; title:string; theme:string; category:string; tags:string[];
  description:string; href:string; cover?:string; source:'PDF 原稿'|'网页手账'|'读者投稿';
};
const pdfTopics:Record<string,string[]> = {
  'deep-reading':['深度阅读','注意力'], 'human-memory':['记忆','认知科学'],
  'neuroplasticity':['大脑','认知科学'], 'plant-intelligence':['植物','生态'],
  'keystone-species':['物种','生态'], 'planetary-systems':['天文','行星'],
  'tech-efficiency':['效率','技术'], 'loop-engineering':['工程','技术'],
  'printing-press':['印刷术','经济'], 'urban-civilizations':['城市','历史'],
  'cost-of-free':['经济','消费'], 'convenience-cost':['消费','生活方式'],
  'parking':['城市','公共空间'], 'democrats-adrift':['政治','公共议题'],
};
export function describeBook(j:Journal):StarBook {
  const scenes=boardScenes.filter(s=>s.bookIds.includes(j.id));
  const key=j.id.replace(/^pdf-/,'');
  const primary=scenes.find(s=>s.bookIds[0]===j.id)??scenes[0];
  const theme=rooms.find(r=>r.ids.includes(key))?.name??primary?.group??j.category;
  const source=j.pdf?'PDF 原稿':'网页手账';
  const tags=[theme,j.category,source,...(pdfTopics[key]??[]),...scenes.map(s=>s.title),...((j.level.match(/[ABC][12]/g))??[])];
  return {id:j.id,title:j.title.replaceAll('\n',''),theme,category:j.category,tags:[...new Set(tags)],description:j.desc,cover:j.pdf?.cover,source,href:'#/journal/'+j.id};
}
export const catalogStars=journals.map(describeBook);
export function describeSubmission(s:CinemaSubmission):StarBook {
  const theme=cinemaThemes.find(t=>t.id===s.theme)?.name??'读者投稿';
  return {id:s.id,title:s.title,theme,category:'读者投稿',source:'读者投稿',tags:[...new Set([theme,'读者投稿','PDF'])],description:s.summary,href:cinemaFeed+'/'+encodeURIComponent(s.id)};
}
