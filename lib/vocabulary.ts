import type { Keyword, VocabularyTerm } from '../data/park-vocabulary';
export type TermRecord = {
 definition: string; wins: number; mistakes: number; due: number; starred: boolean;
 lastCredit?: string; creditXp?: number; // the day XP was last given for this term, and how much (best score that day)
 lastWin?: string; perfect?: boolean;     // the day of the last full keyword success; wrote the definition word for word once
};
export type VocabularyProgress = { terms: Record<string, TermRecord>; days: Record<string, string[]>; xp: number };
const KEY = 'johamin-park-vocabulary-v1';
export const blankProgress = (): VocabularyProgress => ({ terms: {}, days: {}, xp: 0 });
export const dayKey = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
// Preserve particles, punctuation and internal spacing. Only input-edge whitespace and Unicode composition are normalized.
export const normalizeAnswer = (text: string, ignoreSpaces = false) => {
 const value = text.normalize('NFC').replace(/\r\n/g,'\n').trim();
 return ignoreSpaces ? value.replace(/\s/g,'') : value;
};
export function compareAnswer(input: string, target: string, ignoreSpaces = false) {
 const a = [...normalizeAnswer(input, ignoreSpaces)], b = [...normalizeAnswer(target, ignoreSpaces)];
 let index = 0; while(index < Math.min(a.length,b.length) && a[index] === b[index]) index++;
 return { correct: a.join('') === b.join(''), index, entered: a[index] ?? '', expected: b[index] ?? '', expectedRest: b.slice(index).join('') };
}

/** Text as keywords see it: composed, lower case, no spaces. Particles and word order are left to the patterns. */
export const looseText = (text: string) => text.normalize('NFC').toLowerCase().replace(/\s/g, '');
export const keywordHit = (keyword: Keyword, input: string) => new RegExp(keyword.pattern, 'i').test(looseText(input));
export type KeywordScore = { hits: boolean[]; got: number; total: number; perfect: boolean };
/** Lenient scoring: one point per key idea written, in any order and wording the pattern allows. "perfect" = the definition word for word (spaces aside). */
export function scoreKeywords(input: string, term: VocabularyTerm): KeywordScore {
 const hits = term.keywords.map(k => keywordHit(k, input));
 return { hits, got: hits.filter(Boolean).length, total: hits.length, perfect: looseText(input) === looseText(term.definition) };
}
/** A short, kind verdict for a score. */
export function scoreMessage(score: Pick<KeywordScore, 'got' | 'total' | 'perfect'>) {
 if (score.perfect) return '원문 그대로! 완벽해요';
 if (score.got === score.total) return '핵심어를 전부 썼어요!';
 if (score.got * 2 >= score.total) return '거의 다 왔어요';
 if (score.got > 0) return '핵심어를 몇 개 잡았어요';
 return '이번엔 정의를 다시 보고 가요';
}

export function currentRecord(progress: VocabularyProgress, term: VocabularyTerm): TermRecord {
 const record = progress.terms[term.id];
 return record?.definition === term.definition ? record : { definition: term.definition, wins: 0, mistakes: 0, due: 0, starred: record?.starred ?? false };
}
/**
 * Records one written answer. eligible = no hint was used.
 * XP: up to 10 per term per day, in proportion to the key ideas written (the best try that day counts, never twice).
 * Review schedule: writing every key idea counts as a success (next review 1·3·7 days later); anything less brings the term back now.
 */
export function gradeTerm(progress: VocabularyProgress, term: VocabularyTerm, score: Pick<KeywordScore, 'got' | 'total' | 'perfect'>, eligible: boolean, now = Date.now()): VocabularyProgress {
 const record = currentRecord(progress,term), today = dayKey(new Date(now));
 const full = score.total > 0 && score.got === score.total;
 const success = full && eligible;
 const earned = eligible && score.total ? Math.round(10 * score.got / score.total) : 0;
 const already = record.lastCredit === today ? record.creditXp ?? 10 : 0; // records from 3.1 only credited a full 10
 const gain = Math.max(0, earned - already);
 const firstWinToday = success && record.lastWin !== today;
 const wins = success ? record.wins + (firstWinToday || record.wins === 0 ? 1 : 0) : full ? record.wins : Math.max(0, record.wins - 1);
 const days = { ...progress.days };
 if (success) days[today] = [...new Set([...(days[today] ?? []),term.id])];
 const next: TermRecord = {
  ...record, wins, mistakes: record.mistakes + (full ? 0 : 1),
  due: success ? now + [1,3,7][Math.min(wins-1,2)]*86400000 : full ? record.due : now,
  lastCredit: gain > 0 ? today : record.lastCredit, creditXp: gain > 0 ? already + gain : record.creditXp,
  lastWin: success ? today : record.lastWin, perfect: record.perfect || (score.perfect && eligible),
 };
 return { xp: progress.xp + gain, days, terms: { ...progress.terms, [term.id]: next } };
}
export function loadVocabulary(): VocabularyProgress {
 try { const p=JSON.parse(localStorage.getItem(KEY) ?? 'null'); return p && p.terms && p.days && Number.isFinite(p.xp) ? p : blankProgress(); } catch { return blankProgress(); }
}
export function saveVocabulary(p: VocabularyProgress): boolean {
 try { localStorage.setItem(KEY,JSON.stringify(p)); return true; } catch { return false; }
}
export function streakDays(days: VocabularyProgress['days'], now = new Date()) {
 const cursor=new Date(now); if(!days[dayKey(cursor)]?.length) cursor.setDate(cursor.getDate()-1);
 let count=0; while(days[dayKey(cursor)]?.length){count++;cursor.setDate(cursor.getDate()-1);}return count;
}

// ----- 문장 배치: a text cut into pieces to put back in order -----
const BREAK = /(므로|으므로|이며|으며|지만|하고|되어|하여|해서|이고|었고|았고|했고|는데|,)\s/g;
function cut(text: string, max: number): string[] {
 if ([...text].length <= max) return [text];
 const middle = text.length / 2;
 let best = -1;
 for (const m of text.matchAll(BREAK)) {
  const at = (m.index ?? 0) + m[0].length;
  const before = text.slice(0, at);
  if ((before.match(/\(/g) ?? []).length > (before.match(/\)/g) ?? []).length) continue; // never inside ( … )
  if (at >= 12 && text.length - at >= 12 && (best < 0 || Math.abs(at - middle) < Math.abs(best - middle))) best = at;
 }
 if (best < 0) return [text];
 return [...cut(text.slice(0, best).trim(), max), ...cut(text.slice(best).trim(), max)];
}
/** Sentences first, then long sentences at their joints (…므로 / …이며 / , …), so each piece reads as one step. */
export function splitPieces(text: string, max = 46): string[] {
 const sentences = text.normalize('NFC').split(/(?<=다\.|\.)\s+/).map(s => s.trim()).filter(Boolean);
 let pieces = sentences.flatMap(s => cut(s, max));
 if (pieces.length < 3) pieces = sentences.flatMap(s => cut(s, Math.max(20, Math.floor(max * 0.6))));
 return pieces;
}
