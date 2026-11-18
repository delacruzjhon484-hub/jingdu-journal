export type LearningRecord = { note: string; done: boolean; visitedAt?: number };
export type LearningRecords = Record<string, LearningRecord>;

// Preserve exercises that were saved from the former learning routes.
export const savedExerciseTitles: Record<string, string> = {
  'learn-ai': '设计自己的 AI 学习回路',
  'judge-claim': '写一张结论、证据、未知卡',
  'write-deliverable': '交出一页可评审的工作方案',
};
