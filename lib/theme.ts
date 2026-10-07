// Which blessing (가호) dresses the app, saved on this device.
//   hamin  — 하민의 가호: village video, 조하민 card photo, gold, jump scares (the default and the app's identity)
//   none   — 가호 없음: plain blue screen and plain cards, no scares
//   custom — a blessing someone made: their background and card photo, their colour and coin text, no scares
import { trackPromise } from './boot';
import { getBlessing } from './blessing-store';
import { HAMIN_PALETTE, PLAIN_PALETTE, paletteFrom, type Palette } from './palette';

export type ThemeChoice =
  | { kind: 'hamin' }
  | { kind: 'none' }
  | { kind: 'custom'; id: string; name: string; coinFront: string; coinBack: string; color: string };

export interface Theme {
  choice: ThemeChoice;
  name: string;            // shown on the blessing button
  coinFront: string;       // intro coin text, and on hover/press
  coinBack: string;
  palette: Palette;
  scares: boolean;         // jump scares only belong to 하민의 가호
  background: { url: string; focusX: number; focusY: number } | null; // custom photo, once loaded
  card: string | null;
}

const KEY = 'johamin-theme';
const LEGACY_KEY = 'johamin-blessing'; // 1.x on/off switch

function loadChoice(): ThemeChoice {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null') as ThemeChoice | null;
    if (saved?.kind === 'hamin' || saved?.kind === 'none') return { kind: saved.kind };
    if (saved?.kind === 'custom' && saved.id && saved.name) return saved;
    if (localStorage.getItem(LEGACY_KEY) === '0') return { kind: 'none' };
  } catch { /* storage unavailable or broken: start blessed */ }
  return { kind: 'hamin' };
}

function describe(choice: ThemeChoice): Theme {
  if (choice.kind === 'hamin') return { choice, name: '하민의 가호', coinFront: 'JO', coinBack: 'HAMIN!', palette: HAMIN_PALETTE, scares: true, background: null, card: null };
  if (choice.kind === 'none') return { choice, name: '가호 없음', coinFront: 'JO', coinBack: 'HAMIN!', palette: PLAIN_PALETTE, scares: false, background: null, card: null };
  return { choice, name: choice.name, coinFront: choice.coinFront, coinBack: choice.coinBack, palette: paletteFrom(choice.color), scares: false, background: null, card: null };
}

let theme = describe(loadChoice());
let objectUrls: string[] = [];
let loading = 0;
const listeners = new Set<(theme: Theme) => void>();

function paint() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.theme = theme.choice.kind;
  root.dataset.blessing = theme.choice.kind === 'none' ? 'off' : 'on';
  const p = theme.palette;
  for (const [name, value] of Object.entries({ light: p.light, soft: p.soft, base: p.base, deep: p.deep, ink: p.ink, glow: p.glow })) root.style.setProperty(`--theme-${name}`, value);
  if (theme.card) root.style.setProperty('--card-image', `url("${theme.card}")`);
  else root.style.removeProperty('--card-image');
}

function publish(next: Theme) {
  theme = next;
  paint();
  listeners.forEach(listener => listener(theme));
}

function releaseImages() {
  objectUrls.forEach(url => URL.revokeObjectURL(url));
  objectUrls = [];
}

/** Loads a custom blessing's pictures from the device. If it was deleted, falls back to no blessing. */
function loadPictures(choice: Extract<ThemeChoice, { kind: 'custom' }>) {
  const ticket = ++loading;
  const work = (async () => {
    const record = typeof indexedDB === 'undefined' ? undefined : await getBlessing(choice.id).catch(() => undefined);
    if (ticket !== loading) return;
    if (!record) { setThemeChoice({ kind: 'none' }); return; }
    releaseImages();
    const background = URL.createObjectURL(record.background), card = URL.createObjectURL(record.card);
    objectUrls = [background, card];
    await Promise.all([background, card].map(src => new Promise<void>(resolve => { const image = new Image(); image.onload = image.onerror = () => resolve(); image.src = src; })));
    if (ticket !== loading) return;
    publish({ ...describe(choice), background: { url: background, focusX: record.focusX, focusY: record.focusY }, card });
  })();
  trackPromise('blessing', work); // the intro waits for the pictures
}

export const getTheme = () => theme;
export function onThemeChange(listener: (theme: Theme) => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function setThemeChoice(choice: ThemeChoice) {
  try { localStorage.setItem(KEY, JSON.stringify(choice)); } catch { /* storage may be unavailable */ }
  loading++;
  if (choice.kind !== 'custom') releaseImages();
  publish(describe(choice));
  if (choice.kind === 'custom') loadPictures(choice);
}

/** Shows the JO intro again, e.g. after the blessing changes. */
export function replayIntro() {
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('johamin:intro'));
}

paint();
if (theme.choice.kind === 'custom') loadPictures(theme.choice);
