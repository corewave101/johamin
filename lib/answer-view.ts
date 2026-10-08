// 답 보기: how the four answers show on question cards. One setting for every blessing, saved on this device.
//   open   — all four answers are written out (the original way)
//   hidden — answers stay blurred; pulling the card (or the first arrow press / tap) brings that one answer into focus
//            while a ring fills, so you think of the answer before you see it
export type AnswerView = 'open' | 'hidden';
const KEY = 'johamin-answer-view';
const listeners = new Set<(view: AnswerView) => void>();
let view: AnswerView = (() => { try { return localStorage.getItem(KEY) === 'hidden' ? 'hidden' : 'open'; } catch { return 'open'; } })();

export const answerView = () => view;
export function setAnswerView(next: AnswerView) {
  view = next === 'hidden' ? 'hidden' : 'open';
  try { localStorage.setItem(KEY, view); } catch { /* storage may be unavailable */ }
  listeners.forEach(listener => listener(view));
}
export function onAnswerViewChange(listener: (view: AnswerView) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
