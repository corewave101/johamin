import { isBlessed } from './blessing';
import type { LoadedScare, SoundRef } from './theme';

/**
 * 갑툭튀 rules. Numbers match the user's list:
 *  1 aria     every 10th streak                         100%
 *  2 fart     a streak of 10+ breaks                    100%
 *  3 impostor 3 wrong answers in a row (once per run)   100%
 *  4 crash    행성우주과학 streak of 3+ breaks            100%
 *  5 ya       any wrong answer, only if nothing else     30%
 *  6 horn     streak 5+ breaks → 10% → within 3 turns, only if nothing else fires that turn
 *  7 scratch  wrong after thinking 30 s or more         100%
 *  8 ball     the answer right after a fart is wrong     100%
 *  9 idle     5 minutes on one card (handled by the game screen; stays until any input)
 * 10 leave    leaving a game in progress                 10%
 * 11 huh      streak reaches a random 5–8, once per game 100%
 * A "모름" answer halves every chance it causes. Only one scare per answer, in this priority:
 * 9 > 8 > 2 > 3 > 7 > 4 > 1 > 11 > 6 > 5
 */
export type ScareId = 'aria' | 'fart' | 'impostor' | 'crash' | 'ya' | 'horn' | 'scratch' | 'ball' | 'idle' | 'leave' | 'huh';
export const SCARE_IDS: ScareId[] = ['aria', 'fart', 'impostor', 'crash', 'ya', 'horn', 'scratch', 'ball', 'idle', 'leave', 'huh'];
export const IDLE_MS = 5 * 60 * 1000;
export const LEAVE_CHANCE = 0.1;

export interface ScareTracker {
  turn: number;            // answers given so far in this game
  wrongRun: number;        // wrong (or 모름) answers in a row
  impostorDone: boolean;   // impostor already shown for the current wrong run
  huhTarget: number;       // streak that triggers 11 in this game (5–8)
  huhDone: boolean;
  fartTurn: number | null; // turn on which 2 was shown
  horn: { at: number; until: number } | null;
}
export interface AnswerEvent { correct: boolean; unknown: boolean; seconds: number; streakBefore: number; streakAfter: number; astronomy: boolean }

export function newTracker(random = Math.random): ScareTracker {
  return { turn: 0, wrongRun: 0, impostorDone: false, huhTarget: 5 + Math.floor(random() * 4), huhDone: false, fartTurn: null, horn: null };
}

/** Decides which scare (if any) an answer causes, and returns the updated tracker. */
export function scareForAnswer(state: ScareTracker, e: AnswerEvent, random = Math.random): { tracker: ScareTracker; scare: ScareId | null } {
  const turn = state.turn + 1;
  const t: ScareTracker = { ...state, turn };
  const wrong = !e.correct;
  t.wrongRun = wrong ? state.wrongRun + 1 : 0;
  if (!wrong) t.impostorDone = false;
  const roll = (chance: number) => random() < (e.unknown ? chance / 2 : chance);

  const ordered: [ScareId, boolean, number][] = [
    ['ball', wrong && state.fartTurn === turn - 1, 1],
    ['fart', wrong && e.streakBefore >= 10, 1],
    ['impostor', wrong && t.wrongRun >= 3 && !state.impostorDone, 1],
    ['scratch', wrong && e.seconds >= 30, 1],
    ['crash', wrong && e.astronomy && e.streakBefore >= 3, 1],
    ['aria', e.correct && e.streakAfter > 0 && e.streakAfter % 10 === 0, 1],
    ['huh', e.correct && !state.huhDone && e.streakAfter === state.huhTarget, 1],
  ];
  let scare: ScareId | null = null;
  for (const [id, applies, chance] of ordered) {
    if (applies && roll(chance)) { scare = id; break; }
  }
  // 6: a pending horn fires on the first free turn inside its window.
  if (!scare && state.horn && turn >= state.horn.at && turn <= state.horn.until) { scare = 'horn'; t.horn = null; }
  else if (state.horn && turn > state.horn.until) t.horn = null;
  if (!scare && wrong && roll(0.3)) scare = 'ya';

  if (scare === 'fart') t.fartTurn = turn;
  if (scare === 'impostor') t.impostorDone = true;
  if (scare === 'huh') t.huhDone = true;
  // A 5+ streak breaking may schedule the horn 1–3 turns later.
  if (wrong && e.streakBefore >= 5 && !t.horn && roll(0.1)) {
    const at = turn + 1 + Math.floor(random() * 3);
    t.horn = { at, until: turn + 3 };
  }
  return { tracker: t, scare };
}

// ─── Showing scares (one overlay listens) ───────────────────────────────
export interface ScareEvent { id: string; persistent: boolean; key: number; image: string; sound: SoundRef }
const haminImage = (id: ScareId) => `scares/${id}.webp`; // relative to the site; the overlay adds the base path
const show = (event: Omit<ScareEvent, 'key'>) => {
  const full = { ...event, key: Date.now() + Math.random() };
  listeners.forEach(listener => listener(full));
  return true;
};
const listeners = new Set<(event: ScareEvent) => void>();
export function onScare(listener: (event: ScareEvent) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
/** 하민의 가호 scares (no-op under any other blessing). */
export function triggerScare(id: ScareId, persistent = false) {
  if (!isBlessed()) return false;
  return show({ id, persistent, image: haminImage(id), sound: id === 'idle' ? { kind: 'none' } : { kind: 'builtin', id } });
}
/** A custom blessing's own scare. */
export function triggerCustomScare(rule: LoadedScare, persistent = false) {
  return show({ id: rule.id, persistent, image: rule.image, sound: rule.sound });
}

/** Asks the subject menu to go back to the very first screen. */
export const goHome = () => window.dispatchEvent(new Event('johamin:home'));
