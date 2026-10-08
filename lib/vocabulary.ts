import type { VocabularyTerm } from '../data/park-vocabulary';
export type TermRecord = { definition: string; wins: number; mistakes: number; due: number; starred: boolean; lastCredit?: string };
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
export function currentRecord(progress: VocabularyProgress, term: VocabularyTerm): TermRecord {
 const record = progress.terms[term.id];
 return record?.definition === term.definition ? record : { definition: term.definition, wins: 0, mistakes: 0, due: 0, starred: record?.starred ?? false };
}
export function gradeTerm(progress: VocabularyProgress, term: VocabularyTerm, correct: boolean, eligible: boolean, now = Date.now()): VocabularyProgress {
 const record = currentRecord(progress,term), today = dayKey(new Date(now));
 const strictSuccess = correct && eligible;
 const wins = strictSuccess ? record.wins+(record.lastCredit === today && record.wins > 0 ? 0 : 1) : correct ? record.wins : 0;
 const credit = strictSuccess && record.lastCredit !== today;
 const days = { ...progress.days };
 if(credit) days[today] = [...new Set([...(days[today] ?? []),term.id])];
 return { xp: progress.xp + (credit ? 10 : 0), days, terms: { ...progress.terms, [term.id]: { ...record, wins, mistakes: record.mistakes+(correct ? 0 : 1), due: strictSuccess ? now + [1,3,7][Math.min(wins-1,2)]*86400000 : correct ? record.due : now, lastCredit: credit ? today : record.lastCredit } } };
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
