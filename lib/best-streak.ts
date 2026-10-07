// The single best streak ever reached on this device, with the subject it happened in.
export interface BestStreak { subject: string; count: number }
const KEY = 'johamin-best-streak';
let best: BestStreak | null = (() => { try { return JSON.parse(localStorage.getItem(KEY) ?? 'null') as BestStreak | null; } catch { return null; } })();
const listeners = new Set<(best: BestStreak | null) => void>();

export const bestStreak = () => best;
/** Keeps only the highest count; a tie does not replace the earlier record. */
export function recordStreak(subject: string, count: number) {
  if (count <= (best?.count ?? 0)) return;
  best = { subject, count };
  try { localStorage.setItem(KEY, JSON.stringify(best)); } catch { /* storage may be unavailable */ }
  listeners.forEach(listener => listener(best));
}
export function onBestStreakChange(listener: (best: BestStreak | null) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
