import { sceneJournals } from './scene-journals';

export type Journal = {
  id: string; category: string; code: string; title: string; en: string; color: string;
  accent: string; desc: string; price: number; level: string; duration: string;
  audience: string; outcome: string; passages: string[]; translation: string[];
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
export const journals: Journal[] = [
  { id: 'small-attention', category: '英语精读', code: 'En', title: '把注意力，\n还给自己', en: 'A LITTLE MORE ATTENTION', color: '#e2e9f7', accent: '#3159b8', desc: '从一篇原创英文短文开始，体验双语精读、词汇迁移与自己的第一条批注。', price: 19.9, level: 'B1 · 进阶入门', duration: '20 分钟', audience: '能读懂日常英文，想从“看过”走向“读懂”的学习者。', outcome: '复述核心观点，掌握 3 个表达，写出一条与自己有关的观察。', passages: [
    'Every morning, Lin opens her phone before she opens her curtains. One message leads to another. Ten minutes later, she knows what strangers had for breakfast, but she has forgotten what she wanted to do herself.',
    'One day, she leaves a notebook beside the window. Before touching her phone, she writes one sentence: “What deserves my attention today?” The sentence does not make her more productive at once. It simply gives her a small space in which to choose.',
    'Attention is more than the ability to concentrate. It is also a way of deciding what matters. We cannot control every message that arrives, but we can create a pause before we respond. Sometimes, a better day begins with a question, not an answer.'
  ], translation: [
    '每天早晨，林在拉开窗帘之前就打开了手机。一条消息接着另一条。十分钟后，她知道了陌生人早餐吃了什么，却忘记了自己原本想做什么。',
    '有一天，她在窗边放了一本笔记本。在碰手机之前，她先写下一句话：“今天，什么值得我投入注意力？”这句话并没有让她立刻变得高效。它只是给了她一点可以做选择的空间。',
    '注意力不只是一种专注能力，也是一种决定什么重要的方式。我们无法控制每一条到来的消息，但可以在回应前留出片刻停顿。有时，更好的一天始于一个问题。'
  ], vocabulary: ['deserve one’s attention · 值得某人关注', 'a space in which to choose · 可以做选择的空间', 'create a pause · 留出片刻停顿'], question: '窗边的笔记本最先改变了什么？', answer: '它在习惯性看手机之前创造了一个做选择的停顿。文中没有声称效率立刻提高。', task: '用 “Before…, I…” 写一句你愿意尝试的小改变。' },
  { id: 'evidence-first', category: '报告研读', code: 'Re', title: '别急着\n相信结论', en: 'FOLLOW THE EVIDENCE', color: '#f2ddd3', accent: '#bc543f', desc: '拿一份原创模拟报告练手，区分观察、推断和证据边界。', price: 29.9, level: '零基础', duration: '25 分钟', audience: '需要阅读研究报告、行业简报或业务数据的工作者。', outcome: '写出一张结论—证据—局限卡，识别样本与总体的差距。', passages: ['模拟材料：一家社区书店连续四周记录了 80 位到店顾客的购买情况。参与周末读书活动的 20 人中，有 12 人购买了书籍。其他 60 人中，有 18 人购买了书籍。', '店主提出判断：“读书活动提高了购买率。”活动参与者的购买比例为 60%，其他顾客为 30%。但活动参与者可能原本就更爱读书，两个群体也没有经过随机分配。', '因此，这份记录支持“活动参与和购书在该样本中相关”，还不足以单独证明活动带来了购买增长。下一步可以比较相似时段，或设计规模适当的对照观察。'], translation: [], vocabulary: ['观察 · 直接记录到的情况', '推断 · 从记录延伸出的解释', '选择偏差 · 参与者原本就可能不同'], question: '60% 与 30% 的差距，足以证明因果关系吗？', answer: '不足以。参与活动的顾客可能原本就有更强的购书意愿，需要控制其他差异。', task: '写出你想补充收集的一条数据，并解释为什么。' },
  { id: 'book-into-life', category: '书籍共读', code: 'Bk', title: '让一本书\n走进生活', en: 'READ. RELATE. REUSE.', color: '#e3e8d7', accent: '#697e48', desc: '用原创短章练习概念卡、关联卡和行动卡，搭起自己的阅读系统。', price: 19.9, level: '零基础', duration: '20 分钟', audience: '读过许多书，却很少再翻笔记的读者。', outcome: '把一个想法转成一个可观察、可回顾的小行动。', passages: ['原创短章《书页之后》：一本书读完后，我们常留下许多画线，却很少留下一个自己的问题。画线记录了作者说得好的地方，问题则记录了自己还没理解的地方。', '试着把阅读笔记分成三张卡。概念卡用自己的语言解释一个观点。关联卡记录它与某次经历的联系。行动卡则写下一个可在一周内尝试的改变。', '一周后，回到行动卡。记录实际发生了什么，哪些地方与预想不同。让生活成为理解的第二轮材料，笔记就会从保存内容，慢慢走向更新判断。'], translation: [], vocabulary: ['概念卡 · 我如何理解它', '关联卡 · 它让我想起什么', '行动卡 · 我接下来试什么'], question: '为什么要在一周后回看行动卡？', answer: '用真实反馈检查原先的理解，记录预想与实际之间的差异。', task: '选一个你读过的观点，写下一个本周能完成的行动。' },
  { id: 'listen-for-ideas', category: '播客听记', code: 'Po', title: '听见观点\n背后的线索', en: 'LISTEN BETWEEN THE LINES', color: '#e9e1ef', accent: '#8762a0', desc: '用原创对话稿模拟听记，分清说话者的经验、判断和理由。', price: 19.9, level: '零基础', duration: '15 分钟', audience: '经常听访谈，希望把灵感转成可复用笔记的人。', outcome: '写出带有说话者归属的观点卡，补上一个追问。', passages: ['原创对话稿（文字练习）\n主持人：“你为什么把会议改到了下午？”\n来宾：“我的团队上午通常需要独立工作。我们试了两周下午开会，大家说更容易集中注意力。”', '主持人：“这能说明所有团队都该下午开会吗？”\n来宾：“我们只有六个人，而且主要做设计。我只能说，这次尝试适合目前的工作节奏。”', '听记时，可以把“做了什么”“观察到什么”“如何解释”分开。不要把一个团队的局部经验，直接改写成适用于所有人的结论。'], translation: [], vocabulary: ['经验 · 说话者亲历的事情', '判断 · 对经验的解释', '边界 · 结论适用于什么条件'], question: '这段访谈可以支持“下午开会普遍更有效”吗？', answer: '不可以。这是六人设计团队的短期体验，并没有跨团队的证据。', task: '给来宾写一个能获得更多具体信息的追问。' },
  { id: 'story-in-frames', category: '视频拆解', code: 'Vi', title: '一段视频的\n叙事骨架', en: 'A STORY IN SIX FRAMES', color: '#f4e8c9', accent: '#bb8428', desc: '从原创六镜头脚本出发，观察目标、阻碍和转折怎样推进故事。', price: 29.9, level: '零基础', duration: '25 分钟', audience: '想提升短视频观察与脚本组织能力的内容创作者。', outcome: '把一个普通过程改写成有目标和变化的六镜头脚本。', passages: ['原创脚本《最后一把椅子》\n镜头一：社区读书会即将开始，一位组织者数了数，只剩下一把空椅子。\n镜头二：门口出现两位新来的人。\n镜头三：组织者环顾房间，储物柜前堆着纸箱。', '镜头四：一位读者主动起身，帮忙挪开纸箱。\n镜头五：柜子里找到了两张折叠椅。\n镜头六：所有人坐下，新来的读者翻开书，组织者终于松了一口气。', '这段故事的目标是让到场的人都有座位。人数超出预期形成阻碍，读者一起行动形成转折。最后的松弛感来自一个具体问题被解决。'], translation: [], vocabulary: ['目标 · 人物想完成什么', '阻碍 · 什么阻止了目标实现', '转折 · 哪个行动改变了局面'], question: '镜头四在叙事中起到了什么作用？', answer: '它是转折。读者从等待者成为参与解决问题的人，推动故事进入解决阶段。', task: '选一件日常小事，写出目标、阻碍和转折各一句。' },
  { id: 'brief-that-works', category: '工作方案', code: 'Wk', title: '把一个念头\n写成方案', en: 'MAKE THE NEXT STEP CLEAR', color: '#dcebed', accent: '#357d81', desc: '从“想做个活动”走到可以交接的一页任务书，练习定义问题。', price: 39.9, level: '零基础', duration: '30 分钟', audience: '需要与同事、客户或 AI 协作，却常常返工的人。', outcome: '完成一份包含目标、对象、交付物和验收标准的一页简报。', passages: ['原创情境：一家社区书店想举办一次面向新住户的周末活动。初始要求只有一句：“做一个有意思的读书活动。”执行者很难据此决定规模、内容和准备方式。', '把要求写具体。对象是刚搬来的成年居民，目标是让参与者认识书店并交流阅读兴趣。交付物包括一页活动流程、招募文案和现场物料清单。预算与可用空间需要向发起人确认。', '验收标准也要能观察。例如，流程应标出每个环节的时长与负责人，物料清单应区分已有和待采购。对尚未确认的条件保留问题清单，避免把猜测写成事实。'], translation: [], vocabulary: ['目标 · 为什么做', '交付物 · 具体交出什么', '验收标准 · 如何判断完成'], question: '材料中还有哪些关键条件尚未确认？', answer: '预算、可用空间、活动人数与日期等都需要进一步确认，不能自行当作既定条件。', task: '用四行写一份你最近要做的事情的简报。' },
  {
    id: 'practice-loop', category: '书籍共读', code: 'Bk',
    title: '练习之后，\n改哪里', en: 'THE NEXT ATTEMPT', color: '#e6ead8', accent: '#697e48',
    desc: '用原创练习案例，把一个模糊的学习目标拆成一轮可以复盘的尝试。',
    price: 19.9, level: '零基础', duration: '15 分钟',
    audience: '愿意练习，却很难判断自己哪里进步了的学习者。',
    outcome: '写出一张练习目标、观察信号与下一轮改动的反馈卡。',
    passages: [
      '原创练习案例：小方想学会把行业报告讲给同事听。她的第一轮目标只有一个：用三句话说清楚报告的结论、证据和局限。她录下自己的一分钟讲解，再和这三个要求逐项对照。',
      '第一次讲解里，她把大量时间花在背景介绍上，只说了结论，漏了局限。她把第二轮的改动写成一句话：说完结论，立刻说清数据覆盖了谁。改动越具体，下一轮越容易判断它有没有发生。',
      '反馈回路包括一次尝试、一个可观察的差距和下一轮的改动。第一次学习陌生技能时，可以先做一个很小的尝试，再用提示帮助自己走出卡点。'
    ],
    translation: [], vocabulary: ['练习目标 · 本轮只练哪一件事', '观察信号 · 什么能显示差距', '反馈回路 · 尝试、观察、调整、再试'],
    question: '为什么第二轮先只改一个地方？',
    answer: '让改动足够清楚，可以在下一次尝试中检查它是否发生，也更容易找到值得继续保留的做法。',
    task: '选一个真实技能，写下本轮目标、判断差距的信号和下轮只改的一处。',
  },
  {
    id: 'retrieve-then-check', category: '书籍共读', code: 'Bk',
    title: '合上材料，\n再讲一遍', en: 'RECALL BEFORE REVIEW', color: '#e3e8f3', accent: '#3159b8',
    desc: '用一次先复述再对照的小实验，找到自己真的能说清楚的部分。',
    price: 19.9, level: '零基础', duration: '15 分钟',
    audience: '阅读时感觉熟悉，隔一会儿却说不出要点的人。',
    outcome: '完成一张提取卡，留下自己的复述、漏掉的要点与下一次检查时间。',
    passages: [
      '原创练习案例：读完一小段材料后，合上页面。给自己六十秒，用自己的话说出它回答了什么问题，依据是什么，还有哪一处没读懂。把答案写在白纸上。',
      '接着打开材料，用另一种颜色标出遗漏和误读。对照之前的尝试会让差距具体起来。下次可以把最容易忘记的一点改写成问句，隔一天再次尝试回答。',
      '如果目的是检验独立理解，就把 AI 的解释和提示放到第一次复述之后。先留下自己的回答，才能分辨自己已经掌握了什么，哪些部分是听到提示后才想起来的。'
    ],
    translation: [], vocabulary: ['提取练习 · 暂时离开材料，主动回忆', '对照反馈 · 拿自己的答案逐项核对', '复测 · 隔一段时间再试一次'],
    question: '为什么复述完成后才看解释？',
    answer: '先保留一份独立回答，之后才能判断遗漏来自哪里，区分自己能提取的内容和提示带来的帮助。',
    task: '合上任意一篇读过的手账，写三句复述。对照后，把一处遗漏改写成明天要回答的问题。',
  },
  {
    id: 'ai-as-coach', category: '播客听记', code: 'Po',
    title: '让 AI \n做你的陪练', en: 'COACH, QUESTION, REPEAT', color: '#eee4ee', accent: '#8762a0',
    desc: '用一段原创访谈稿，比较 AI 提前给提示与延后给反馈各自适合什么阶段。',
    price: 19.9, level: '零基础', duration: '20 分钟',
    audience: '想在用 AI 的同时，留下一份可以检查的独立思考记录的人。',
    outcome: '写一条只在卡住时提示、复述之后再反馈的陪练指令。',
    passages: [
      '原创模拟播客（文字练习）。主持人：“用 AI 读一份陌生报告，第一步要让它总结吗？”来宾：“我会先说自己想回答的问题。如果连术语都看不懂，可以请它先解释一个关键术语，然后自己继续读。”',
      '主持人：“那什么时候应该让 AI 等一等？”来宾：“当我想检查自己能不能独立讲出来，就先合上材料复述一次。等我交出这次尝试，再请它指出遗漏，给我一个追问。”',
      '试着把陪练分成两轮。第一轮只允许一个卡点提示。第二轮让 AI 根据你有权使用的素材指出证据与误读，并把无法核实的部分标出来。保留第一次和第二次回答，下一轮用同样的提问比较变化。'
    ],
    translation: [], vocabulary: ['脚手架 · 跨过一个具体的卡点', '提取练习 · 先尝试独立复述', '反馈时机 · 在不同阶段安排帮助'],
    question: '哪些情况下，提前给一个提示更合适？',
    answer: '当陌生术语或任务规则让学习者无法开始时，可以给一个有限提示。若目的是测独立理解，应该保留第一次回答再给反馈。',
    task: '写一条陪练提示词，注明你想先做什么、什么时候允许提示、AI 要按什么标准反馈。',
  },
  ...sceneJournals,
];
export const lessons = [
  { title: '从一个好问题开始', label: '01 / 提问', detail: '先写下为什么读这份材料、读完要做什么，再选择合适的阅读深度。', prompt: '请担任我的精读学习伙伴。先问我阅读目标和当前基础，再帮我把目标整理成一个可完成的学习任务。一次只问一个问题。', exercise: '我读完这份材料后，希望能够……' },
  { title: '为素材确认边界', label: '02 / 选材', detail: '优先使用自己的作品、已获许可的材料或权利状态已核验的开放内容。逐份记录来源与使用范围。', prompt: '以下是我有权使用的材料和来源说明。请只依据提供的内容，列出核心概念、证据与待核实项。区分作者观点和可核验事实，不补写缺失的原文。', exercise: '材料来源、作者、使用许可或我拥有的权利是……' },
  { title: '精读，留下自己的痕迹', label: '03 / 对话', detail: '先自己理解一遍，再请 AI 解释卡住的地方。用复述、追问和例子检查理解。', prompt: '请按段陪我精读。先让我用自己的话复述，再指出遗漏或误读。解释一个关键表达，提出一个理解题。等我回答后再给反馈，不要一次给完答案。', exercise: '我理解这段话在说……我还不确定的是……' },
  { title: '把理解变成可以复用的手账', label: '04 / 迁移', detail: '保留概念、证据、个人关联与一次行动。复核事实、引用和输出权限，再整理为手账。', prompt: '请根据我们的讨论，整理一份手账草稿，包含核心问题、我的复述、关键概念、证据与局限、个人关联、一个小练习和来源记录。明确标出待核实处。不要补充未经证实的材料。', exercise: '这个想法可以用在……我准备在……尝试。' },
];
export const clubTasks = ['读完原创短文，写下一句主旨', '选一个短语，写一个自己的例句', '遮住译文，用三句话复述', '提出一个原文没有直接回答的问题', '把文中的方法用在一天里', '记录尝试结果，写下一个新发现', '整理本周手账，写给下周的自己'];
