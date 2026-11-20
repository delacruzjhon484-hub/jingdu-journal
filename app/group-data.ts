// Published editions keep their original membership. Assign a new ID to a revised edition.
export const groupPriceCents = 1290;
export type JournalGroup = {id:string; title:string; books:string[]};
export const journalGroups: JournalGroup[] = [
  {id:"set-01-v1", title:"读懂，再记住", books:["pdf-deep-reading", "pdf-human-memory", "pdf-neuroplasticity", "retrieve-then-check", "practice-loop", "ai-as-coach", "book-into-life"]},
  {id:"set-02-v1", title:"把英语说清楚", books:["toefl-listen-for-turns", "ielts-small-story", "interview-proof-story", "email-one-request", "presentation-one-idea", "listen-for-ideas", "brief-that-works"]},
  {id:"set-03-v1", title:"科学里的证据", books:["evidence-first", "pdf-plant-intelligence", "pdf-keystone-species", "pdf-planetary-systems", "pdf-loop-engineering", "pdf-tech-efficiency", "ted-001"]},
  {id:"set-04-v1", title:"城市与公共生活", books:["pdf-parking", "pdf-urban-civilizations", "pdf-printing-press", "pdf-cost-of-free", "pdf-convenience-cost", "pdf-democrats-adrift", "new-city-first-week"]},
  {id:"set-05-v1", title:"故事里的转折", books:["story-in-frames", "study-abroad-first-week", "after-a-breakup", "ted-002", "ted-003", "ted-004", "ted-005"]},
  {id:"set-06-v1", title:"TED 精读选集 · 01", books:["ted-006", "ted-007", "ted-008", "ted-009", "ted-010", "ted-011", "ted-012"]},
  {id:"set-07-v1", title:"TED 精读选集 · 02", books:["ted-013", "ted-014", "ted-015", "ted-016", "ted-017", "ted-018", "ted-019"]},
  {id:"set-08-v1", title:"TED 精读选集 · 03", books:["ted-020", "ted-021", "ted-022", "ted-023", "ted-024", "ted-025", "ted-026"]},
  {id:"set-09-v1", title:"TED 精读选集 · 04", books:["ted-027", "ted-028", "ted-029", "ted-030", "ted-031", "ted-032", "ted-033"]},
  {id:"set-10-v1", title:"TED 精读选集 · 05", books:["ted-034", "ted-035", "ted-036", "ted-037", "ted-038", "ted-039", "ted-040"]},
  {id:"set-11-v1", title:"TED 精读选集 · 06", books:["ted-041", "ted-042", "ted-043", "ted-044", "ted-045", "ted-046", "ted-047"]},
  {id:"set-12-v1", title:"TED 精读选集 · 07", books:["ted-048", "ted-049", "ted-050", "ted-051", "ted-052", "ted-053", "ted-054"]},
  {id:"set-13-v1", title:"TED 精读选集 · 08", books:["ted-055", "ted-056", "ted-057", "ted-058", "ted-059", "ted-060", "ted-061"]},
  {id:"set-14-v1", title:"TED 精读选集 · 09", books:["ted-062", "ted-063", "ted-064", "ted-065", "ted-066", "ted-067", "ted-068"]},
  {id:"set-15-v1", title:"TED 精读选集 · 10", books:["ted-069", "ted-070", "ted-071", "ted-072", "ted-073", "ted-074", "ted-075"]},
  {id:"set-16-v1", title:"TED 精读选集 · 11", books:["ted-076", "ted-077", "ted-078", "ted-079", "ted-080", "ted-081", "ted-082"]},
  {id:"set-17-v1", title:"TED 精读选集 · 12", books:["ted-083", "ted-084", "ted-085", "ted-086", "ted-087", "ted-088", "ted-089"]},
  {id:"set-18-v1", title:"TED 精读选集 · 13", books:["ted-090", "ted-091", "ted-092", "ted-093", "ted-094", "ted-095", "ted-096"]},
  {id:"set-19-v1", title:"TED 精读选集 · 14", books:["ted-097", "ted-098", "ted-099", "ted-100", "ted-101", "ted-102", "ted-103"]},
  {id:"set-20-v1", title:"TED 精读选集 · 15", books:["ted-104", "ted-105", "ted-106", "ted-107", "ted-108", "ted-109", "ted-110"]},
  {id:"set-21-v1", title:"TED 精读选集 · 16", books:["ted-111", "ted-112", "ted-113", "ted-114", "ted-115", "ted-116", "ted-117"]},
  {id:"set-22-v1", title:"TED 精读选集 · 17", books:["ted-118", "ted-119", "ted-120", "ted-121", "ted-122", "ted-123", "ted-124"]},
  {id:"set-23-v1", title:"TED 精读选集 · 18", books:["ted-125", "ted-126", "ted-127", "ted-128", "ted-129", "ted-130", "ted-131"]},
  {id:"set-24-v1", title:"TED 精读选集 · 19", books:["ted-132", "ted-133", "ted-134", "ted-135", "ted-136", "ted-137", "ted-138"]},
  {id:"set-25-v1", title:"TED 精读选集 · 20", books:["ted-139", "ted-140", "ted-141", "ted-142", "ted-143", "ted-144", "ted-145"]},
  {id:"set-26-v1", title:"TED 精读选集 · 21", books:["ted-146", "ted-147", "ted-148", "ted-149", "ted-150", "ted-151", "ted-152"]},
  {id:"set-27-v1", title:"TED 精读选集 · 22", books:["ted-153", "ted-154", "ted-155", "ted-156", "ted-157", "ted-158", "ted-159"]},
  {id:"set-28-v1", title:"TED 精读选集 · 23", books:["ted-160", "ted-161", "ted-162", "ted-163", "ted-164", "ted-165", "ted-166"]},
  {id:"set-29-v1", title:"TED 精读选集 · 24", books:["ted-167", "ted-168", "ted-169", "ted-170", "ted-171", "ted-172", "ted-173"]},
  {id:"set-30-v1", title:"TED 精读选集 · 25", books:["ted-174", "ted-175", "ted-176", "ted-177", "ted-178", "ted-179", "ted-180"]},
];
export const groupById = (id:unknown) => journalGroups.find(group => group.id === id);
export const groupForBook = (id:string) => journalGroups.find(group => group.books.includes(id));
export const saleLabel = (id:string) => groupForBook(id) ? '7 本一组 · ¥12.90' : '免费整本阅读';
