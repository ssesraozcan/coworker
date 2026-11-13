export type ItemId = 'plant' | 'bench' | 'lantern';
export type Placement = { id: string; item: ItemId; area: 'home' | 'island'; x: number; y: number };
export type Session = { id: string; duration: number; remaining: number; deadline: number | null; goal: string; shared: boolean };
export type StudyRecord = { id: string; completedAt: number; minutes: number; shared: boolean };
export type State = { leaves: number; outfit: string; placements: Placement[]; records: StudyRecord[]; claims: string[]; session: Session | null };
export const initialState: State = { leaves: 240, outfit: 'hoodie', placements: [], records: [], claims: [], session: null };
export const prices: Record<ItemId, number> = { plant: 80, bench: 120, lantern: 100 };
export function remaining(session: Session, now = Date.now()) { return session.deadline === null ? session.remaining : Math.max(0, Math.ceil((session.deadline - now) / 1000)); }
export function finish(state: State, now = Date.now()): State {
  const s = state.session;
  if (!s || remaining(s, now) > 0 || state.records.some(r => r.id === s.id)) return state;
  return { ...state, leaves: state.leaves + 25, records: [...state.records, { id: s.id, completedAt: now, minutes: s.duration / 60, shared: s.shared }], session: null };
}
export function purchase(state: State, item: ItemId, id: string): State {
  if (state.leaves < prices[item] || state.placements.some(p => p.id === id)) return state;
  return { ...state, leaves: state.leaves - prices[item], placements: [...state.placements, { id, item, area: 'home', x: .5, y: .52 }] };
}
function dayKey(t: number) { const d = new Date(t); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
function weekStart(t: number) { const d = new Date(t); d.setHours(0,0,0,0); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return d.getTime(); }
export function rewards(state: State, now = Date.now()) {
  const date = new Date(now), today = dayKey(now), week = weekStart(now), month = `${date.getFullYear()}-${date.getMonth()}`;
  const weekly = state.records.filter(r => r.completedAt >= week && r.completedAt <= now);
  const monthly = state.records.filter(r => { const d = new Date(r.completedAt); return `${d.getFullYear()}-${d.getMonth()}` === month; });
  return [
    { id: `day:${today}`, label: 'GÜNLÜK', title: 'Bir oturum tamamla', value: state.records.filter(r => dayKey(r.completedAt) === today).length, target: 1, amount: 15 },
    { id: `week:${week}`, label: 'HAFTALIK', title: 'Kendine üç gün ayır', value: new Set(weekly.map(r => dayKey(r.completedAt))).size, target: 3, amount: 60 },
    { id: `month:${month}`, label: 'AYLIK', title: 'Dört farklı haftada çalış', value: new Set(monthly.map(r => weekStart(r.completedAt))).size, target: 4, amount: 150 },
  ];
}
export function claim(state: State, id: string, now = Date.now()): State {
  const r = rewards(state, now).find(r => r.id === id);
  return !r || r.value < r.target || state.claims.includes(id) ? state : { ...state, leaves: state.leaves + r.amount, claims: [...state.claims, id] };
}
export function decode(raw: string | null): State {
  if (!raw) return initialState;
  try { const x = JSON.parse(raw); if (x.version !== 1 || !Number.isFinite(x.state?.leaves) || x.state.leaves < 0 || !Array.isArray(x.state.placements) || !Array.isArray(x.state.records) || !Array.isArray(x.state.claims)) return initialState; return x.state; } catch { return initialState; }
}
