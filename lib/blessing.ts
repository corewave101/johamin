// "하민의 가호": while on, jump scares can appear and the streak flame grows. Saved on this device.
const KEY = 'johamin-blessing';
let on = (() => { try { return localStorage.getItem(KEY) !== '0'; } catch { return true; } })();
const listeners = new Set<(on: boolean) => void>();

function mark() {
  try { document.documentElement.dataset.blessing = on ? 'on' : 'off'; } catch { /* no document (tests) */ }
}
mark();

export const isBlessed = () => on;
export function setBlessed(value: boolean) {
  on = value;
  try { localStorage.setItem(KEY, value ? '1' : '0'); } catch { /* storage may be unavailable */ }
  mark();
  listeners.forEach(listener => listener(value));
}
export function onBlessedChange(listener: (on: boolean) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
