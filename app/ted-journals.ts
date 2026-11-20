import type { Journal } from './data';
import editions from './ted-index.json';

export const tedJournals: Journal[] = editions.map(item => {
  const page = (number: number) => ({src: './ted-previews/'+item.n+'-'+number+'.webp',page:number});
  return {
    id:'ted-'+item.n, category:'英语精读', code:'En', en:'TED '+item.n, title:item.title, desc:item.desc,
    tedTopic:item.topic, color:'#e2e9da', accent:'#4c6742', price:12.9,
    level:item.level, audience:item.audience, duration:item.duration+' 分钟',
    outcome:'用自己的话复述演讲观点，并用文中的表达写下一条观察。',
    passages:[], translation:[], vocabulary:[], question:'你会如何复述这篇演讲的观点？',
    answer:'详见手账内的练习与参考答案。', task:'试读后写下你想追问的一个问题。',
    pdf:{cover:page(1).src,previews:[page(1),page(3)],pages:item.pages,versions:[{key:'standard',label:'原版 PDF',pages:item.pages}]},
  };
});
