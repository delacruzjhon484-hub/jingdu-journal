export type BoardListDraft = { title: string; description: string; bookIds: string[] };
export type PersonalBoardList = BoardListDraft & { id: string; updatedAt: number };
export type SubmittedJournal = { id: string; title: string; author: string };
export type BoardListFeed = { canEdit: boolean; signInUrl: string; lists: PersonalBoardList[]; submitted: SubmittedJournal[] };

export const boardListEndpoint = '/api/board-lists';
export const boardListTitleLimit = 40;
export const boardListDescriptionLimit = 120;
export const boardListJournalLimit = 50;

export const wantToReadId = 'want-to-read';
export const wantToReadList: PersonalBoardList = {
  id: wantToReadId, title: '想读', description: '留给下次想翻开的手账。', bookIds: [], updatedAt: 0,
};
