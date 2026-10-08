// 카드 크기: one setting for every blessing, saved on this device.
// The whole card set (card, arrows, buttons) is zoomed; phones stop at 120% so the arrows still fit.
const KEY = 'johamin-card-size';
export const CARD_SIZES = [0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4];
const listeners = new Set<(size: number) => void>();

const valid = (value: number) => CARD_SIZES.includes(value) ? value : 1;
let size = (() => { try { return valid(Number(localStorage.getItem(KEY) ?? 1)); } catch { return 1; } })();

function paint() {
  if (typeof document === 'undefined') return;
  document.documentElement.style.setProperty('--card-scale', String(size));
}
paint();

export const cardSize = () => size;
export function setCardSize(value: number) {
  size = valid(value);
  try { localStorage.setItem(KEY, String(size)); } catch { /* storage may be unavailable */ }
  paint();
  listeners.forEach(listener => listener(size));
}
/** One step bigger (+1) or smaller (−1). */
export const stepCardSize = (direction: 1 | -1) => setCardSize(CARD_SIZES[Math.min(CARD_SIZES.length - 1, Math.max(0, CARD_SIZES.indexOf(size) + direction))]);
export function onCardSizeChange(listener: (size: number) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
