export const studyTitles = [
  {id: 'small-attention', theme: '日常观察', ink: '#405744', cloth: '#e1e2ca'},
  {id: 'ielts-small-story', theme: '英语叙事', ink: '#783d32', cloth: '#ead5c3'},
  {id: 'travel-confirm-first', theme: '旅行英语', ink: '#3e535a', cloth: '#d4deda'},
  {id: 'email-one-request', theme: '职场书信', ink: '#5a4b32', cloth: '#eee0b8'},
] as const;

export function studyLink(id: string) {
  return studyTitles.some(book => book.id === id) ? './study.html#' + id + '-1' : null;
}
