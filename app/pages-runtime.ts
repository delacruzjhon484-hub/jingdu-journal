import { journals } from './data';
import { campThemes } from './reading-house-data';
import { wantToReadList, wantToReadId, boardListJournalLimit, type PersonalBoardList } from './board-lists-data';

export const onlineSite = 'https://everything-journal.delacruzjhon484.chatgpt.site/';
const listsKey = 'jingdu-pages-lists-v1';
const campKey = 'jingdu-pages-plans-v1';
type Plan = { theme: string; goal: string; savedAt: number };
function read<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { const value = JSON.parse(raw); return Array.isArray(value) ? value as T : fallback; } catch { return fallback; }
}
function listStore(): PersonalBoardList[] {
  const stored = read<PersonalBoardList[]>(listsKey, []).filter(item => item && typeof item.id === 'string' && typeof item.title === 'string' && Array.isArray(item.bookIds));
  return [stored.find(item => item.id === wantToReadId) ?? { ...wantToReadList }, ...stored.filter(item => item.id !== wantToReadId)];
}
const json = (data: unknown, status = 200) => Response.json(data, { status });

/** Static Pages uses explicit browser-local records; shared operations stay on the online site. */
export async function siteFetch(input: string, init: RequestInit = {}): Promise<Response> {
  if (init.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  const path = new URL(input, 'https://local.invalid');
  const method = init.method?.toUpperCase() ?? 'GET';
  try {
    if (path.pathname === '/api/board-lists') {
      const lists = listStore();
      if (method === 'GET') return json({ canEdit: true, signInUrl: `${onlineSite}#/shelf`, lists, submitted: [] });
      if (method === 'DELETE') {
        const id = path.searchParams.get('id');
        if (!id || id === wantToReadId) return json({ error: '默认清单不能删除。' }, 400);
        localStorage.setItem(listsKey, JSON.stringify(lists.filter(item => item.id !== id)));
        return new Response(null, { status: 204 });
      }
      const body = JSON.parse(String(init.body ?? '{}'));
      if (!['POST','PATCH','PUT'].includes(method) || typeof body.id !== 'string' || !Array.isArray(body.bookIds)
        || !body.bookIds.every((id: unknown) => typeof id === 'string' && journals.some(journal => journal.id === id))) return json({ error: '请选择有效的手账。' }, 400);
      const current = lists.find(item => item.id === body.id);
      if (method !== 'POST' && !current) return json({ error: '这份清单已找不到。' }, 404);
      if (method === 'POST' && current) return json(current);
      const bookIds = [...new Set<string>(method === 'PUT' ? [...current!.bookIds, ...body.bookIds] : body.bookIds)];
      if (bookIds.length > boardListJournalLimit) return json({ error: '每份清单最多保存 50 本手账。' }, 400);
      const title = body.id === wantToReadId ? wantToReadList.title : method === 'PUT' ? current!.title : String(body.title ?? '').trim();
      const description = body.id === wantToReadId ? wantToReadList.description : method === 'PUT' ? current!.description : String(body.description ?? '').trim();
      if (!title || title.length > 40 || description.length > 120) return json({ error: '请检查清单名称与说明的长度。' }, 400);
      const result = { id: body.id, title, description, bookIds, updatedAt: Date.now() };
      localStorage.setItem(listsKey, JSON.stringify([...lists.filter(item => item.id !== body.id), result]));
      return json(result);
    }
    if (path.pathname === '/api/camp-interest') {
      const interests = read<Plan[]>(campKey, []);
      if (method === 'GET') return json({ canSave: true, signInUrl: `${onlineSite}#/camp`, interests });
      if (method !== 'POST') return json({ error: '不支持此操作。' }, 405);
      const body = JSON.parse(String(init.body ?? '{}'));
      if (!campThemes.some(theme => theme.id === body.theme) || typeof body.goal !== 'string' || body.goal.length > 160) return json({ error: '请检查主题与学习目标。' }, 400);
      const plan = { theme: body.theme, goal: body.goal.trim(), savedAt: Date.now() };
      localStorage.setItem(campKey, JSON.stringify([plan, ...interests.filter(item => item.theme !== plan.theme)]));
      return json(plan);
    }
    if (path.pathname === '/api/cinema/submissions' && method === 'GET') return json({ submissions: [], canUpload: false, signInUrl: `${onlineSite}#/cinema/upload` });
    if (path.pathname === '/api/community' && method === 'GET') return json({ canSave: false, signInUrl: `${onlineSite}#/community`, profile: null, members: [] });
    return json({ error: '请前往在线版使用此功能。' }, 405);
  } catch {
    return json({ error: '当前浏览器无法保存数据，请检查浏览器存储设置后重试。' }, 503);
  }
}
