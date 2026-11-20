export const learningGoals = [
  { id: 'exam', label: '应试提分', audience: '四六级 · 考研 · 英语备考', line: '拆开长句，抓住观点，再用一道题检验理解。', bookId: 'toefl-listen-for-turns', camp: 'press' },
  { id: 'career', label: '职场进阶', audience: '阅读理解 · 观点表达', line: '从一篇内容里整理逻辑，把读到的转成说得清的。', bookId: 'interview-proof-story', camp: 'ted' },
  { id: 'interest', label: '兴趣阅读', audience: '外刊 · 名著 · 好奇心', line: '慢一点读，留下联想，让喜欢的内容进入自己的生活。', bookId: 'book-into-life', camp: 'books' },
] as const;

export const campThemes = [
  { id: 'ted', title: 'TED 精读', line: '从一场演讲进入一个观点，练习听读、结构与复述。', number: '01', mark: 'T', sampleId: 'listen-for-ideas', note: '观点与表达' },
  { id: 'press', title: '外刊精读', line: '从真实议题展开阅读，逐步积累词句、语境和判断。', number: '02', mark: 'P', sampleId: 'small-attention', note: '语言与世界' },
  { id: 'books', title: '名著节选', line: '读一段故事，理解文字的细节，再写下自己的感受。', number: '03', mark: 'B', sampleId: 'book-into-life', note: '故事与理解' },
] as const;
export type CampThemeId = typeof campThemes[number]['id'];
export type CampInterest = { theme: CampThemeId; goal: string; savedAt: number };
export type CampInterestFeed = { canSave: boolean; signInUrl: string; interests: CampInterest[] };

export const campPlans = [
  { key:'week', name:'一周营', days:7, price:99, purpose:'先读完一个星期', detail:'每天读一篇，第七天合上原文，复述最想记住的观点。' },
  { key:'month', name:'一月营', days:30, price:299, purpose:'把阅读练成习惯', detail:'每天积累一份手账，每周回看批注，月底写下自己的主题小结。' },
  { key:'deep', name:'60 天深度营', days:60, price:699, purpose:'围绕主题持续深读', detail:'用两个月跟读、讨论和修改，结营时完成一份自己的表达作品。' },
] as const;
export type CampPlan = typeof campPlans[number];
export function campRoute(theme: CampThemeId, plan: CampPlan) {
  return plan.key === 'deep' ? theme : theme + '-' + plan.key;
}
export const campProducts = campPlans.flatMap(plan => campThemes.map(theme => {
  const route = campRoute(theme.id, plan);
  return {id:'camp-'+route, route, theme, plan, title:theme.title+' · '+plan.name};
}));
