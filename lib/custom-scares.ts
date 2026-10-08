// 나만의 갑툭튀: jump scares a custom blessing defines for itself.
// Each rule = a condition (with its number), a chance, a photo and an optional sound. Rules higher in the list win;
// only one scare per answer, and a "모름" answer halves the chance, the same as 하민의 가호.
import type { AnswerEvent } from './jumpscare';

export type ScareTrigger = 'streakEvery' | 'streakBreak' | 'wrongRun' | 'wrong' | 'slowWrong' | 'streakOnce' | 'idle' | 'leave';

export interface ScareRuleSpec { id: string; trigger: ScareTrigger; n: number; chance: number } // chance in percent (1–100)

/** Conditions offered in the editor, with the number each one takes. */
export const TRIGGERS: Record<ScareTrigger, { label: string; n?: { min: number; max: number; initial: number; unit: string } }> = {
  streakEvery: { label: '연속 정답 N개마다', n: { min: 2, max: 50, initial: 10, unit: '개마다' } },
  streakBreak: { label: '연속 정답 N개 이상에서 틀림', n: { min: 2, max: 50, initial: 5, unit: '개 이상' } },
  wrongRun: { label: 'N문제 연속으로 틀림', n: { min: 2, max: 10, initial: 3, unit: '문제' } },
  wrong: { label: '틀릴 때마다' },
  slowWrong: { label: 'N초 넘게 고민하고 틀림', n: { min: 5, max: 300, initial: 30, unit: '초' } },
  streakOnce: { label: '연속 정답 N개째 (한 판에 한 번)', n: { min: 2, max: 50, initial: 7, unit: '개째' } },
  idle: { label: 'N분 동안 가만히 (누를 때까지 안 사라짐)', n: { min: 1, max: 30, initial: 5, unit: '분' } },
  leave: { label: '문제 풀다가 나감' },
};
export const TRIGGER_ORDER: ScareTrigger[] = ['streakEvery', 'streakBreak', 'wrongRun', 'wrong', 'slowWrong', 'streakOnce', 'idle', 'leave'];
export const MAX_RULES = 12;

export function describeRule(rule: Pick<ScareRuleSpec, 'trigger' | 'n' | 'chance'>) {
  const t = TRIGGERS[rule.trigger];
  const text = t.n ? t.label.replace('N', String(rule.n)) : t.label;
  return rule.chance >= 100 ? text : `${text} · ${rule.chance}%`;
}

export function normalizeRule<T extends ScareRuleSpec>(rule: T): T {
  const spec = TRIGGERS[rule.trigger] ?? TRIGGERS.wrong;
  const n = spec.n ? Math.round(Math.min(spec.n.max, Math.max(spec.n.min, Number(rule.n) || spec.n.initial))) : 0;
  const raw = Number(rule.chance);
  const chance = Math.round(Math.min(100, Math.max(1, Number.isFinite(raw) ? raw : 100)));
  return { ...rule, trigger: TRIGGERS[rule.trigger] ? rule.trigger : 'wrong', n, chance };
}

export interface CustomTracker { wrongRun: number; once: string[] } // rule ids already used up this game / this wrong run
export const newCustomTracker = (): CustomTracker => ({ wrongRun: 0, once: [] });

/** Which rule (if any) fires for this answer. Idle and leave are timed by the game screen, not here. */
export function customScareForAnswer(state: CustomTracker, rules: ScareRuleSpec[], e: AnswerEvent, random = Math.random): { tracker: CustomTracker; rule: string | null } {
  const wrong = !e.correct;
  const wrongRun = wrong ? state.wrongRun + 1 : 0;
  // "N in a row" may show again after the run is broken by a correct answer.
  const once = wrong ? state.once : state.once.filter(id => rules.find(r => r.id === id)?.trigger !== 'wrongRun');
  const tracker: CustomTracker = { wrongRun, once };
  for (const rule of rules) {
    const applies =
      rule.trigger === 'streakEvery' ? e.correct && e.streakAfter > 0 && e.streakAfter % rule.n === 0
      : rule.trigger === 'streakBreak' ? wrong && e.streakBefore >= rule.n
      : rule.trigger === 'wrongRun' ? wrong && wrongRun >= rule.n && !once.includes(rule.id)
      : rule.trigger === 'wrong' ? wrong
      : rule.trigger === 'slowWrong' ? wrong && e.seconds >= rule.n
      : rule.trigger === 'streakOnce' ? e.correct && e.streakAfter === rule.n && !once.includes(rule.id)
      : false;
    if (!applies) continue;
    const chance = rule.chance / 100;
    if (random() < (e.unknown ? chance / 2 : chance)) {
      if (rule.trigger === 'wrongRun' || rule.trigger === 'streakOnce') tracker.once = [...once, rule.id];
      return { tracker, rule: rule.id };
    }
  }
  return { tracker, rule: null };
}
