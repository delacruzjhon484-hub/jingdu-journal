import { boardScenes } from './scene-board-data';
import { journals } from './data';

export const cinemaThemes = [
  { id: 'english', name: '英语与出行', line: '练口语、备考试，把手账带到真实对话里。', color: '#bdd2e8', ink: '#233951' },
  { id: 'work', name: '表达与工作', line: '从写好一句话，到讲清一个故事、做完一份方案。', color: '#ead0a6', ink: '#47341d' },
  { id: 'life', name: '生活与学习', line: '留住生活里的感受，也为下一次尝试做准备。', color: '#dcc7d6', ink: '#432940' },
] as const;

export type CinemaTheme = typeof cinemaThemes[number]['id'];
export type CinemaSubmission = {
  id: string; title: string; author: string; theme: CinemaTheme; summary: string; createdAt: number; owned: boolean;
};

export const cinemaUploadLimit = 12 * 1024 * 1024;
export const cinemaFeed = '/api/cinema/submissions';

export function themeJournals(theme: typeof cinemaThemes[number]) {
  const ids = new Set(boardScenes.filter(scene => scene.group === theme.name).flatMap(scene => scene.bookIds));
  return journals.filter(journal => ids.has(journal.id) || (theme.id === 'english' && Boolean(journal.pdf))); 
}

export function themeForJournal(id: string) {
  if (journals.find(j=>j.id===id)?.pdf) return cinemaThemes[0];
  const group = boardScenes.find(scene => scene.bookIds[0] === id)?.group ?? boardScenes.find(scene => scene.bookIds.includes(id))?.group;
  return cinemaThemes.find(theme => theme.name === group) ?? cinemaThemes[2];
}
