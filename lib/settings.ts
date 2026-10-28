// 설정(≡) 버튼에서 켜고 끄는 값들(4.11.0~). 이 기기에만 저장한다(localStorage, 키는 johamin- 접두사).
//   scares    — 갑툭튀(하민의 가호 · 직접 만든 가호의 갑툭튀). 끄면 어떤 가호에서도 안 나온다.
//   lottePeek — 메인 화면 구석의 롯데 로고(LottePeek). 롯데 페이지 자체는 그대로다.
export type ToggleKey = 'scares' | 'lottePeek';
const KEYS: Record<ToggleKey, string> = { scares: 'johamin-scares-v1', lottePeek: 'johamin-lotte-peek-v1' };
const listeners = new Set<(key: ToggleKey, on: boolean) => void>();

const read = (key: ToggleKey) => { try { return localStorage.getItem(KEYS[key]) !== 'off'; } catch { return true; } };
const state: Record<ToggleKey, boolean> = { scares: read('scares'), lottePeek: read('lottePeek') };

export const isOn = (key: ToggleKey) => state[key];
export function setOn(key: ToggleKey, on: boolean) {
  state[key] = on;
  try { localStorage.setItem(KEYS[key], on ? 'on' : 'off'); } catch { /* storage may be unavailable */ }
  listeners.forEach(listener => listener(key, on));
}
export function onToggle(listener: (key: ToggleKey, on: boolean) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

// ── 설정 버튼 위치: 화면 왼쪽 · 오른쪽 가장자리에 붙고, 위아래 위치는 화면 높이에 대한 비율로 기억한다. ──
export interface DockSpot { side: 'left' | 'right'; y: number }
const DOCK_KEY = 'johamin-settings-dock-v1';
export function dockSpot(): DockSpot | null {
  try {
    const saved = JSON.parse(localStorage.getItem(DOCK_KEY) ?? 'null') as DockSpot | null;
    if (saved && (saved.side === 'left' || saved.side === 'right') && typeof saved.y === 'number' && saved.y >= 0 && saved.y <= 1) return saved;
  } catch { /* use the default spot */ }
  return null;
}
export function saveDockSpot(spot: DockSpot) {
  try { localStorage.setItem(DOCK_KEY, JSON.stringify(spot)); } catch { /* storage may be unavailable */ }
}
/** 가장자리 붙이기: 놓은 곳의 가로 위치로 왼쪽 · 오른쪽을 고르고, 세로는 화면 안(위아래 여백 포함)으로 자른다. */
export function snapDock(x: number, y: number, width: number, height: number, margin = 64): DockSpot {
  const clamped = Math.min(Math.max(y, margin), Math.max(margin, height - margin));
  return { side: x < width / 2 ? 'left' : 'right', y: height ? clamped / height : 0.5 };
}
