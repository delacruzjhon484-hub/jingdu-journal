export type BoardScene = {
  id: string;
  title: string;
  group: '英语与出行' | '表达与工作' | '生活与学习';
  prompt: string;
  action: string;
  bookIds: readonly string[];
};

export const boardScenes: readonly BoardScene[] = [
  { id: 'toefl', title: '托福备考', group: '英语与出行', prompt: '听完一段英文短讲，怎样抓住它的主线？', action: '圈出观点转折，合上材料复述主张、反例和结论。', bookIds: ['toefl-listen-for-turns', 'retrieve-then-check'] },
  { id: 'ielts', title: '雅思备考', group: '英语与出行', prompt: '英语口语只说得出两句，怎么展开？', action: '从自己的生活选一件小事，写四行提纲，再讲一遍。', bookIds: ['ielts-small-story', 'practice-loop'] },
  { id: 'travel', title: '出国旅行', group: '英语与出行', prompt: '听不清站台、时间或地址时，怎么开口核对？', action: '把下一段行程的时间和地点填进一条确认句。', bookIds: ['travel-confirm-first', 'email-one-request'] },
  { id: 'interview', title: '英文面试', group: '英语与出行', prompt: '怎样用一个真实例子讲清自己的贡献？', action: '挑一段经历，分开写情境、个人行动和可观察结果。', bookIds: ['interview-proof-story', 'ielts-small-story'] },
  { id: 'email', title: '写英文邮件', group: '英语与出行', prompt: '怎么写一封对方容易回复的邮件？', action: '用一句背景、一个请求、一个时间点写好草稿。', bookIds: ['email-one-request', 'brief-that-works'] },
  { id: 'study-abroad', title: '第一次留学', group: '英语与出行', prompt: '抵达前，怎样把第一周要办的事想清楚？', action: '把地址、报到入口和联系人放在一页，先排好抵达日的顺序。', bookIds: ['study-abroad-first-week', 'travel-confirm-first'] },
  { id: 'write', title: '写一篇文章', group: '表达与工作', prompt: '手上有一堆素材，第一段从哪写？', action: '先写读者的问题，再找一个能说明变化的具体场景。', bookIds: ['small-attention', 'story-in-frames'] },
  { id: 'team', title: '带一个新团队', group: '表达与工作', prompt: '怎样把模糊的要求交给团队执行？', action: '约定负责人、交付物、验收标准与回看时间。', bookIds: ['brief-that-works', 'listen-for-ideas'] },
  { id: 'video', title: '做一条短视频', group: '表达与工作', prompt: '怎样用几段镜头讲清一件事？', action: '从人物目标开始，标出阻碍、转折和结尾。', bookIds: ['story-in-frames', 'presentation-one-idea'] },
  { id: 'career', title: '准备转行', group: '表达与工作', prompt: '能不能先试做一项新岗位的真实任务？', action: '给一份小作品约一次评审，记录下一轮只改哪里。', bookIds: ['practice-loop', 'book-into-life'] },
  { id: 'present', title: '准备一场演讲', group: '表达与工作', prompt: '希望听众明天还记住哪句话？', action: '把核心句、具体故事和结尾动作写在同一张卡上。', bookIds: ['presentation-one-idea', 'story-in-frames'] },
  { id: 'decision', title: '做一个决定', group: '表达与工作', prompt: '一个结论听起来合理，证据支持到哪一步？', action: '分开写下判断、证据和最需要验证的未知。', bookIds: ['evidence-first', 'listen-for-ideas'] },
  { id: 'breakup', title: '失恋之后', group: '生活与学习', prompt: '今天有点乱，可以先写下什么？', action: '用一页记下发生的事、此刻的感受和今晚能照顾自己的一件事。', bookIds: ['after-a-breakup', 'small-attention'] },
  { id: 'moving', title: '搬到新城市', group: '生活与学习', prompt: '在陌生的地方，怎样先让一周过得顺一点？', action: '画出三个常用点，找一条路线在真实的出门时间走一次。', bookIds: ['new-city-first-week', 'book-into-life'] },
  { id: 'books', title: '读完一本书', group: '生活与学习', prompt: '读过的内容，怎样变成我用得上的东西？', action: '留一张概念卡、一张关联卡和一张行动卡。', bookIds: ['book-into-life', 'retrieve-then-check'] },
  { id: 'ai', title: '用 AI 学新技能', group: '生活与学习', prompt: '什么时候让 AI 提示，什么时候先自己试？', action: '先写一份自己的回答，再让 AI 给一个具体反馈。', bookIds: ['ai-as-coach', 'retrieve-then-check', 'practice-loop'] },
  { id: 'report', title: '读懂一份报告', group: '生活与学习', prompt: '这份报告的结论究竟来自什么证据？', action: '把结论、观察和适用边界写成三栏。', bookIds: ['evidence-first', 'listen-for-ideas'] },
  { id: 'deliver', title: '做一份方案', group: '生活与学习', prompt: '怎样把一个想法写成别人能接手的方案？', action: '写下服务对象、交付物、验收标准和一个待确认事项。', bookIds: ['brief-that-works', 'small-attention'] },
];
