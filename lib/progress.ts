import type { SwipeCard } from '../data/swipe-cards';

/** Per-card results kept on this device only (no login). c = correct, w = wrong, u = unknown. */
export type Result = 'c' | 'w' | 'u';
export interface CardProgress { right: number; wrong: number; last: Result; at: number }
type Store = Record<string, CardProgress>;
const KEY = 'johamin-progress-v1';

let memory: Store | null = null;
function load(): Store {
  if (memory) return memory;
  try { memory = JSON.parse(localStorage.getItem(KEY) ?? '{}') as Store; } catch { memory = {}; }
  return memory;
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(memory)); } catch { /* storage may be unavailable */ }
}

export function recordResult(cardId: string, result: Result, now = Date.now()) {
  const store = load();
  const previous = store[cardId] ?? { right: 0, wrong: 0, last: result, at: now };
  store[cardId] = { right: previous.right + (result === 'c' ? 1 : 0), wrong: previous.wrong + (result === 'c' ? 0 : 1), last: result, at: now };
  save();
}

export const progressOf = (cardId: string): CardProgress | undefined => load()[cardId];

/** Cards whose most recent answer on this device was wrong or "모름". */
export const missedCards = (cards: SwipeCard[]) => cards.filter(card => { const p = load()[card.id]; return p && p.last !== 'c'; });
export const seenCount = (cards: SwipeCard[]) => cards.filter(card => load()[card.id]).length;

export function resetProgress(cardIds: string[]) {
  const store = load();
  for (const id of cardIds) delete store[id];
  save();
}
