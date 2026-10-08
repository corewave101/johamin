// 베타 테스트: features still being tried out. Turned on/off from the update log (v0.0.-1), saved on this device.
//   - 카드 펼쳐 고르기: the main menu lays every part out as cards to pick one directly
//   - 가로 화면 해설 카드: on wide landscape screens the answered card flips to its back (explanation) on the right
const KEY = 'johamin-beta';
const listeners = new Set<(on: boolean) => void>();
let on = (() => { try { return localStorage.getItem(KEY) === '1'; } catch { return false; } })();

function paint() {
  if (typeof document === 'undefined') return;
  if (on) document.documentElement.dataset.beta = 'on';
  else delete document.documentElement.dataset.beta;
}
paint();

export const betaOn = () => on;
export function setBeta(next: boolean) {
  on = next;
  try { if (on) localStorage.setItem(KEY, '1'); else localStorage.removeItem(KEY); } catch { /* storage may be unavailable */ }
  paint();
  listeners.forEach(listener => listener(on));
}
export function onBetaChange(listener: (on: boolean) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
