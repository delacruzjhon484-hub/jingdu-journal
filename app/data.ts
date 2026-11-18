import { importedJournals } from './imported-journals';

export type Journal = {
  id: string; category: string; code: string; title: string; en: string; color: string;
  accent: string; desc: string; price: number; level: string; duration: string;
  pdf?: {cover:string;previews:{src:string;page:number}[];pages:number;versions:{key:string;label:string;pages:number}[]};
  totalPassages?: number; audience: string; outcome: string; passages: string[]; translation: string[];
  vocabulary: string[]; question: string; answer: string; task: string;
};
export const categories = [
  { name: '全部手账', code: 'All', color: '#252925', desc: '把好奇心，变成自己的知识' },
  { name: '英语精读', code: 'En', color: '#3159b8', desc: '读懂一句话，也读懂一个世界' },
  { name: '报告研读', code: 'Re', color: '#bc543f', desc: '从结论往回走，找到证据' },
  { name: '书籍共读', code: 'Bk', color: '#697e48', desc: '留住一本书里真正有用的部分' },
  { name: '播客听记', code: 'Po', color: '#8762a0', desc: '让耳边经过的观点，有迹可循' },
  { name: '视频拆解', code: 'Vi', color: '#bb8428', desc: '看见结构，拆开叙事' },
  { name: '工作方案', code: 'Wk', color: '#357d81', desc: '把学到的，变成做得出的' },
];
// Public catalogue contains trial excerpts only. Complete journals are served after purchase verification.
export const journals: Journal[] = [
  ...importedJournals,
  {
    "id": "small-attention",
    "category": "英语精读",
    "code": "En",
    "title": "把注意力，\n还给自己",
    "en": "A LITTLE MORE ATTENTION",
    "color": "#e2e9f7",
    "accent": "#3159b8",
    "desc": "从一篇原创英文短文开始，体验双语精读、词汇迁移与自己的第一条批注。",
    "price": 12.9,
    "level": "B1 · 进阶入门",
    "duration": "20 分钟",
    "audience": "能读懂日常英文，想从“看过”走向“读懂”的学习者。",
    "outcome": "复述核心观点，掌握 3 个表达，写出一条与自己有关的观察。",
    "passages": [
      "Every morning, Lin opens her phone before she opens her curtains. One message leads to another. Ten minutes later, she knows what strangers had for breakfast, but she has forgotten what she wanted to do herself.",
      "One day, she leaves a notebook beside the window. Before touching her phone, she writes one sentence: “What deserves my attention today?” The sentence does not make her more productive at once. It simply gives her a small space in which to choose."
    ],
    "translation": [
      "每天早晨，林在拉开窗帘之前就打开了手机。一条消息接着另一条。十分钟后，她知道了陌生人早餐吃了什么，却忘记了自己原本想做什么。",
      "有一天，她在窗边放了一本笔记本。在碰手机之前，她先写下一句话：“今天，什么值得我投入注意力？”这句话并没有让她立刻变得高效。它只是给了她一点可以做选择的空间。"
    ],
    "vocabulary": [
      "deserve one’s attention · 值得某人关注"
    ],
    "question": "窗边的笔记本最先改变了什么？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "用 “Before…, I…” 写一句你愿意尝试的小改变。",
    "totalPassages": 3
  },
  {
    "id": "evidence-first",
    "category": "报告研读",
    "code": "Re",
    "title": "别急着\n相信结论",
    "en": "FOLLOW THE EVIDENCE",
    "color": "#f2ddd3",
    "accent": "#bc543f",
    "desc": "拿一份原创模拟报告练手，区分观察、推断和证据边界。",
    "price": 12.9,
    "level": "零基础",
    "duration": "25 分钟",
    "audience": "需要阅读研究报告、行业简报或业务数据的工作者。",
    "outcome": "写出一张结论—证据—局限卡，识别样本与总体的差距。",
    "passages": [
      "模拟材料：一家社区书店连续四周记录了 80 位到店顾客的购买情况。参与周末读书活动的 20 人中，有 12 人购买了书籍。其他 60 人中，有 18 人购买了书籍。"
    ],
    "translation": [],
    "vocabulary": [
      "观察 · 直接记录到的情况"
    ],
    "question": "60% 与 30% 的差距，足以证明因果关系吗？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "写出你想补充收集的一条数据，并解释为什么。",
    "totalPassages": 3
  },
  {
    "id": "book-into-life",
    "category": "书籍共读",
    "code": "Bk",
    "title": "让一本书\n走进生活",
    "en": "READ. RELATE. REUSE.",
    "color": "#e3e8d7",
    "accent": "#697e48",
    "desc": "用原创短章练习概念卡、关联卡和行动卡，搭起自己的阅读系统。",
    "price": 12.9,
    "level": "零基础",
    "duration": "20 分钟",
    "audience": "读过许多书，却很少再翻笔记的读者。",
    "outcome": "把一个想法转成一个可观察、可回顾的小行动。",
    "passages": [
      "原创短章《书页之后》：一本书读完后，我们常留下许多画线，却很少留下一个自己的问题。画线记录了作者说得好的地方，问题则记录了自己还没理解的地方。"
    ],
    "translation": [],
    "vocabulary": [
      "概念卡 · 我如何理解它"
    ],
    "question": "为什么要在一周后回看行动卡？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "选一个你读过的观点，写下一个本周能完成的行动。",
    "totalPassages": 3
  },
  {
    "id": "listen-for-ideas",
    "category": "播客听记",
    "code": "Po",
    "title": "听见观点\n背后的线索",
    "en": "LISTEN BETWEEN THE LINES",
    "color": "#e9e1ef",
    "accent": "#8762a0",
    "desc": "用原创对话稿模拟听记，分清说话者的经验、判断和理由。",
    "price": 12.9,
    "level": "零基础",
    "duration": "15 分钟",
    "audience": "经常听访谈，希望把灵感转成可复用笔记的人。",
    "outcome": "写出带有说话者归属的观点卡，补上一个追问。",
    "passages": [
      "原创对话稿（文字练习）\n主持人：“你为什么把会议改到了下午？”\n来宾：“我的团队上午通常需要独立工作。我们试了两周下午开会，大家说更容易集中注意力。”"
    ],
    "translation": [],
    "vocabulary": [
      "经验 · 说话者亲历的事情"
    ],
    "question": "这段访谈可以支持“下午开会普遍更有效”吗？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "给来宾写一个能获得更多具体信息的追问。",
    "totalPassages": 3
  },
  {
    "id": "story-in-frames",
    "category": "视频拆解",
    "code": "Vi",
    "title": "一段视频的\n叙事骨架",
    "en": "A STORY IN SIX FRAMES",
    "color": "#f4e8c9",
    "accent": "#bb8428",
    "desc": "从原创六镜头脚本出发，观察目标、阻碍和转折怎样推进故事。",
    "price": 12.9,
    "level": "零基础",
    "duration": "25 分钟",
    "audience": "想提升短视频观察与脚本组织能力的内容创作者。",
    "outcome": "把一个普通过程改写成有目标和变化的六镜头脚本。",
    "passages": [
      "原创脚本《最后一把椅子》\n镜头一：社区读书会即将开始，一位组织者数了数，只剩下一把空椅子。\n镜头二：门口出现两位新来的人。\n镜头三：组织者环顾房间，储物柜前堆着纸箱。"
    ],
    "translation": [],
    "vocabulary": [
      "目标 · 人物想完成什么"
    ],
    "question": "镜头四在叙事中起到了什么作用？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "选一件日常小事，写出目标、阻碍和转折各一句。",
    "totalPassages": 3
  },
  {
    "id": "brief-that-works",
    "category": "工作方案",
    "code": "Wk",
    "title": "把一个念头\n写成方案",
    "en": "MAKE THE NEXT STEP CLEAR",
    "color": "#dcebed",
    "accent": "#357d81",
    "desc": "从“想做个活动”走到可以交接的一页任务书，练习定义问题。",
    "price": 12.9,
    "level": "零基础",
    "duration": "30 分钟",
    "audience": "需要与同事、客户或 AI 协作，却常常返工的人。",
    "outcome": "完成一份包含目标、对象、交付物和验收标准的一页简报。",
    "passages": [
      "原创情境：一家社区书店想举办一次面向新住户的周末活动。初始要求只有一句：“做一个有意思的读书活动。”执行者很难据此决定规模、内容和准备方式。"
    ],
    "translation": [],
    "vocabulary": [
      "目标 · 为什么做"
    ],
    "question": "材料中还有哪些关键条件尚未确认？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "用四行写一份你最近要做的事情的简报。",
    "totalPassages": 3
  },
  {
    "id": "practice-loop",
    "category": "书籍共读",
    "code": "Bk",
    "title": "练习之后，\n改哪里",
    "en": "THE NEXT ATTEMPT",
    "color": "#e6ead8",
    "accent": "#697e48",
    "desc": "用原创练习案例，把一个模糊的学习目标拆成一轮可以复盘的尝试。",
    "price": 12.9,
    "level": "零基础",
    "duration": "15 分钟",
    "audience": "愿意练习，却很难判断自己哪里进步了的学习者。",
    "outcome": "写出一张练习目标、观察信号与下一轮改动的反馈卡。",
    "passages": [
      "原创练习案例：小方想学会把行业报告讲给同事听。她的第一轮目标只有一个：用三句话说清楚报告的结论、证据和局限。她录下自己的一分钟讲解，再和这三个要求逐项对照。"
    ],
    "translation": [],
    "vocabulary": [
      "练习目标 · 本轮只练哪一件事"
    ],
    "question": "为什么第二轮先只改一个地方？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "选一个真实技能，写下本轮目标、判断差距的信号和下轮只改的一处。",
    "totalPassages": 3
  },
  {
    "id": "retrieve-then-check",
    "category": "书籍共读",
    "code": "Bk",
    "title": "合上材料，\n再讲一遍",
    "en": "RECALL BEFORE REVIEW",
    "color": "#e3e8f3",
    "accent": "#3159b8",
    "desc": "用一次先复述再对照的小实验，找到自己真的能说清楚的部分。",
    "price": 12.9,
    "level": "零基础",
    "duration": "15 分钟",
    "audience": "阅读时感觉熟悉，隔一会儿却说不出要点的人。",
    "outcome": "完成一张提取卡，留下自己的复述、漏掉的要点与下一次检查时间。",
    "passages": [
      "原创练习案例：读完一小段材料后，合上页面。给自己六十秒，用自己的话说出它回答了什么问题，依据是什么，还有哪一处没读懂。把答案写在白纸上。"
    ],
    "translation": [],
    "vocabulary": [
      "提取练习 · 暂时离开材料，主动回忆"
    ],
    "question": "为什么复述完成后才看解释？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "合上任意一篇读过的手账，写三句复述。对照后，把一处遗漏改写成明天要回答的问题。",
    "totalPassages": 3
  },
  {
    "id": "ai-as-coach",
    "category": "播客听记",
    "code": "Po",
    "title": "让 AI \n做你的陪练",
    "en": "COACH, QUESTION, REPEAT",
    "color": "#eee4ee",
    "accent": "#8762a0",
    "desc": "用一段原创访谈稿，比较 AI 提前给提示与延后给反馈各自适合什么阶段。",
    "price": 12.9,
    "level": "零基础",
    "duration": "20 分钟",
    "audience": "想在用 AI 的同时，留下一份可以检查的独立思考记录的人。",
    "outcome": "写一条只在卡住时提示、复述之后再反馈的陪练指令。",
    "passages": [
      "原创模拟播客（文字练习）。主持人：“用 AI 读一份陌生报告，第一步要让它总结吗？”来宾：“我会先说自己想回答的问题。如果连术语都看不懂，可以请它先解释一个关键术语，然后自己继续读。”"
    ],
    "translation": [],
    "vocabulary": [
      "脚手架 · 跨过一个具体的卡点"
    ],
    "question": "哪些情况下，提前给一个提示更合适？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "写一条陪练提示词，注明你想先做什么、什么时候允许提示、AI 要按什么标准反馈。",
    "totalPassages": 3
  },
  {
    "id": "toefl-listen-for-turns",
    "category": "英语精读",
    "code": "En",
    "title": "先听清\n观点怎么转",
    "en": "LISTEN FOR THE TURN",
    "color": "#e4ecfa",
    "accent": "#3159a0",
    "desc": "用一段原创英文短讲，练习识别观点、转折和补充证据。",
    "price": 12.9,
    "level": "英语听读练习",
    "duration": "15 分钟",
    "audience": "备考托福，想练习听懂一段英文论述的人。",
    "outcome": "用三句话复述一段短讲的主张、反例和最后结论。",
    "passages": [
      "Many people assume that adding more benches will make a public square busier. In a small observation exercise, students counted how many people stopped in two parts of a square."
    ],
    "translation": [
      "很多人以为增加长椅会让广场更热闹。在一次小型观察练习中，学生数了数有多少人在广场的两个区域停留。"
    ],
    "vocabulary": [
      "assume · 假定"
    ],
    "question": "第二段用什么观察改变了第一段的预期？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "请朋友或朗读工具读一遍英文。合上材料，写下原先的假定、新观察和下一步问题。",
    "totalPassages": 3
  },
  {
    "id": "ielts-small-story",
    "category": "英语精读",
    "code": "En",
    "title": "把一件小事\n讲完整",
    "en": "ONE SMALL STORY",
    "color": "#f0e8f5",
    "accent": "#725489",
    "desc": "用原创示例练习把人物、细节和感受串成一段自然的英语回答。",
    "price": 12.9,
    "level": "英语口语练习",
    "duration": "15 分钟",
    "audience": "备考雅思，开口时容易只说一两句的人。",
    "outcome": "整理一份四行提纲，并完成一轮自己的英语口述。",
    "passages": [
      "Last month, a neighbor showed me how to fix a loose bicycle chain. I had been putting it off because I thought I would need special tools."
    ],
    "translation": [
      "上个月，一位邻居教我怎么修松掉的自行车链条。我原先以为需要专门的工具，所以一直拖着。"
    ],
    "vocabulary": [
      "put something off · 推迟某事"
    ],
    "question": "哪些细节让这段回答更容易被听懂和记住？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "选一件你亲身经历的小事，按事情、动作、细节、后续变化写四行提纲，再用英文讲一遍。",
    "totalPassages": 3
  },
  {
    "id": "travel-confirm-first",
    "category": "英语精读",
    "code": "En",
    "title": "没听清，\n就核对一次",
    "en": "CHECK BEFORE YOU GO",
    "color": "#e2efe9",
    "accent": "#337365",
    "desc": "用换乘和酒店登记的短对话，准备旅行时能直接开口的确认句。",
    "price": 12.9,
    "level": "旅行英语",
    "duration": "10 分钟",
    "audience": "准备独自出国旅行，担心听错时间、地点或方向的人。",
    "outcome": "做一张随身确认卡，记下复述信息和请对方写下来的句子。",
    "passages": [
      "At the station: “Just to check, do I change trains at Central or at Riverside?” “At Central. The next train leaves from platform four.”"
    ],
    "translation": [
      "在车站：“确认一下，我是在中央站换车，还是在河滨站？”“在中央站。下一班车从四号站台发车。”"
    ],
    "vocabulary": [
      "just to check · 确认一下"
    ],
    "question": "当一个信息同时包含地点和时间时，可以怎样确认？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "把你下一段行程里的真实地点与时间填进确认句。",
    "totalPassages": 3
  },
  {
    "id": "interview-proof-story",
    "category": "工作方案",
    "code": "Wk",
    "title": "把经验说成\n一个例子",
    "en": "SHOW YOUR WORK",
    "color": "#e6edf5",
    "accent": "#315e83",
    "desc": "为第一次英文面试准备一个能讲清自己贡献的案例。",
    "price": 12.9,
    "level": "面试准备",
    "duration": "15 分钟",
    "audience": "准备英文面试，简历上有经历却不知道怎么展开的人。",
    "outcome": "写出一个真实案例的情境、行动和可验证结果。",
    "passages": [
      "面试官问：“Tell me about a time you improved a process.” 先挑一件你参与过的小事，说明当时谁遇到了什么麻烦。"
    ],
    "translation": [],
    "vocabulary": [
      "handoff · 交接"
    ],
    "question": "为什么要单独写出自己负责的动作？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "从自己的经历选一件事，按情境、个人行动、结果写成三句英文。",
    "totalPassages": 3
  },
  {
    "id": "email-one-request",
    "category": "英语精读",
    "code": "En",
    "title": "写一封\n好回复的邮件",
    "en": "MAKE THE REPLY EASY",
    "color": "#f1e9d6",
    "accent": "#876930",
    "desc": "把英文邮件压缩成清楚的背景、一个请求和一个时间点。",
    "price": 12.9,
    "level": "实用英语",
    "duration": "10 分钟",
    "audience": "要联系海外同事、老师或客服的人。",
    "outcome": "写出一封收件人可以快速理解并回答的英文邮件。",
    "passages": [
      "Subject: Confirming the meeting time. Hi Maya, I am writing to confirm the time for our project meeting next week."
    ],
    "translation": [
      "主题：确认会议时间。你好，Maya，我写信是想确认下周项目会议的时间。"
    ],
    "vocabulary": [
      "confirm · 确认"
    ],
    "question": "这封邮件给收件人留了哪个容易回应的选项？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "找一封你正要发送的邮件，将请求改写为一个明确的问题。",
    "totalPassages": 3
  },
  {
    "id": "study-abroad-first-week",
    "category": "工作方案",
    "code": "Wk",
    "title": "留学第一周\n的生活清单",
    "en": "THE FIRST WEEK",
    "color": "#e3ece9",
    "accent": "#37766f",
    "desc": "把落地第一周拆成校园、住处、交通与求助四张卡。",
    "price": 12.9,
    "level": "留学准备",
    "duration": "15 分钟",
    "audience": "第一次去海外读书，正在梳理抵达后一周的人。",
    "outcome": "留下一张按抵达前、抵达日和第一周排序的清单。",
    "passages": [
      "先把学校发来的报到信息、住宿地址和联系人整理到同一页，记录资料来源与更新日期。用学校和住宿方提供的最新信息填入自己的清单。"
    ],
    "translation": [],
    "vocabulary": [
      "arrival · 抵达"
    ],
    "question": "为什么要给地址和联系方式做一份离线记录？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "填好自己的抵达路线、住处联系方法和校方报到入口，并写下尚待核实的一项。",
    "totalPassages": 3
  },
  {
    "id": "presentation-one-idea",
    "category": "视频拆解",
    "code": "Vi",
    "title": "先说清楚\n这一句话",
    "en": "ONE IDEA ON STAGE",
    "color": "#f4e7d6",
    "accent": "#986327",
    "desc": "为即将上台的分享，写一张让听众记住重点的演讲卡。",
    "price": 12.9,
    "level": "演讲准备",
    "duration": "15 分钟",
    "audience": "在准备课堂分享、内部汇报或公开演讲的人。",
    "outcome": "完成一句主张、一个具体故事和一个结尾动作。",
    "passages": [
      "打开空白页，先写一句希望听众第二天还能复述的话。比如“每次交接都补上一个负责人和一个截止时间”。"
    ],
    "translation": [],
    "vocabulary": [
      "核心句 · 希望听众带走的话"
    ],
    "question": "演讲里为什么要写一个可观察的场景？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "用一句主张、一个故事和一个结尾动作搭出你自己的三段提纲。",
    "totalPassages": 3
  },
  {
    "id": "after-a-breakup",
    "category": "书籍共读",
    "code": "Bk",
    "title": "失恋之后\n写下今天",
    "en": "A PAGE FOR TODAY",
    "color": "#f3e6e4",
    "accent": "#9d514a",
    "desc": "一页可以随时停下的私人手账，记录感受、牵挂和今天能照顾的一件事。",
    "price": 12.9,
    "level": "生活手账",
    "duration": "10 分钟",
    "audience": "刚经历关系结束，想把此刻的感受写下来的人。",
    "outcome": "留下一页属于今天的记录，并选一个自己愿意做的小动作。",
    "passages": [
      "把日期写在纸上。先记一句今天发生的事，再写一句身体和心里的感受。可以只写几个词，也可以在这一格停下。"
    ],
    "translation": [],
    "vocabulary": [
      "事实 · 今天实际发生的事"
    ],
    "question": "如果今天只有一点点精力，可以只写哪一行？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "补完三句：今天发生了……我此刻感到……今晚我想照顾自己的一件事是……",
    "totalPassages": 3
  },
  {
    "id": "new-city-first-week",
    "category": "工作方案",
    "code": "Wk",
    "title": "搬到一座\n新城市之后",
    "en": "A LITTLE LOCAL MAP",
    "color": "#e8ecdb",
    "accent": "#617646",
    "desc": "给新生活画一张小地图，先把一周里最常用的几个点连起来。",
    "price": 12.9,
    "level": "生活手账",
    "duration": "15 分钟",
    "audience": "准备搬家，或刚到一座陌生城市的人。",
    "outcome": "列好第一周的生活路线、待办与值得再去的地方。",
    "passages": [
      "从住处出发，在纸上画三个点：买日用品的地方、常去的交通站点，以及一处你愿意停留的地方。写下走过去大约需要多久。"
    ],
    "translation": [],
    "vocabulary": [
      "常用点 · 一周里反复到达的地方"
    ],
    "question": "为什么要在真实出门时间试走？",
    "answer": "完整讲解与参考思路在购买后的手账中。",
    "task": "画三个常用点，给其中一条路线约一个试走时间。",
    "totalPassages": 3
  }
];
export const lessons = [
  { title: '从一个好问题开始', label: '01 / 提问', detail: '先写下为什么读这份材料、读完要做什么，再选择合适的阅读深度。', prompt: '请担任我的精读学习伙伴。先问我阅读目标和当前基础，再帮我把目标整理成一个可完成的学习任务。一次只问一个问题。', exercise: '我读完这份材料后，希望能够……' },
  { title: '为素材确认边界', label: '02 / 选材', detail: '优先使用自己的作品、已获许可的材料或权利状态已核验的开放内容。逐份记录来源与使用范围。', prompt: '以下是我有权使用的材料和来源说明。请只依据提供的内容，列出核心概念、证据与待核实项。区分作者观点和可核验事实，不补写缺失的原文。', exercise: '材料来源、作者、使用许可或我拥有的权利是……' },
  { title: '精读，留下自己的痕迹', label: '03 / 对话', detail: '先自己理解一遍，再请 AI 解释卡住的地方。用复述、追问和例子检查理解。', prompt: '请按段陪我精读。先让我用自己的话复述，再指出遗漏或误读。解释一个关键表达，提出一个理解题。等我回答后再给反馈，不要一次给完答案。', exercise: '我理解这段话在说……我还不确定的是……' },
  { title: '把理解变成可以复用的手账', label: '04 / 迁移', detail: '保留概念、证据、个人关联与一次行动。复核事实、引用和输出权限，再整理为手账。', prompt: '请根据我们的讨论，整理一份手账草稿，包含核心问题、我的复述、关键概念、证据与局限、个人关联、一个小练习和来源记录。明确标出待核实处。不要补充未经证实的材料。', exercise: '这个想法可以用在……我准备在……尝试。' },
];
export const clubTasks = ['读完原创短文，写下一句主旨', '选一个短语，写一个自己的例句', '遮住译文，用三句话复述', '提出一个原文没有直接回答的问题', '把文中的方法用在一天里', '记录尝试结果，写下一个新发现', '整理本周手账，写给下周的自己'];
