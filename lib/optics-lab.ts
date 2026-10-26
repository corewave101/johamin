// 양동비T 「빛과 렌즈」 실습: 광선추적 가상실험실의 계산 부분.
// 수업에서 보여 주신 광학 기기 광선추적 가상실험실(rayyang.html)의 모형을 그대로 옮기고,
// 스크린 상맺힘(screenView)과 작도 가이드(guideSteps · checkStroke)를 더했다.
// 좌표는 cm, 광축이 y = 0, 렌즈 · 거울 중심이 x = 0, 물체는 왼쪽(x < 0)에 있다. 근축(얇은 렌즈) 모형이다.

export type SingleKind = 'convex-lens' | 'concave-lens' | 'concave-mirror' | 'convex-mirror';
export type Pt = { x: number; y: number };
export type Seg = [Pt, Pt];

export const GRID_CM = 5;
/** 단일 렌즈 · 거울 작도판의 범위(cm). */
export const SINGLE_VIEW = { left: -45, right: 45, top: 22, bottom: -22 };
export const isLens = (kind: SingleKind) => kind === 'convex-lens' || kind === 'concave-lens';
/** 볼록 렌즈 · 오목 거울은 f > 0, 오목 렌즈 · 볼록 거울은 f < 0. */
export const signedFocal = (kind: SingleKind, f: number) => (kind === 'convex-lens' || kind === 'concave-mirror' ? 1 : -1) * Math.max(1, f);

export interface SingleImage {
  f: number; d: number; h: number;
  /** a = f: 나간 광선이 나란해서 상이 유한한 곳에 맺히지 않는다. */
  infinite: boolean;
  /** 상 거리(렌즈 방정식의 b): + 실상, − 허상 */
  b: number;
  m: number;
  /** 작도판에서 상의 위치 · 끝 높이 */
  x: number; y: number;
  real: boolean; upright: boolean; enlarged: boolean;
}

/** 1/f = 1/a + 1/b, m = −b/a. 거울은 실상이 거울 앞(왼쪽)에 생긴다. */
export function singleImage(kind: SingleKind, focal: number, distance: number, height: number): SingleImage {
  const f = signedFocal(kind, focal), d = Math.max(1, distance), h = height;
  if (f > 0 && Math.abs(d - f) < 0.05) return { f, d, h, infinite: true, b: Infinity, m: Infinity, x: NaN, y: NaN, real: false, upright: false, enlarged: true };
  const b = 1 / (1 / f - 1 / d), m = -b / d;
  return { f, d, h, infinite: false, b, m, x: isLens(kind) ? b : -b, y: m * h, real: b > 0, upright: m > 0, enlarged: Math.abs(m) > 1.03 };
}

export const snapDistance = (value: number) => Math.round(Math.min(42, Math.max(4, value)) * 2) / 2;

// ── 스크린 상맺힘 ─────────────────────────────────────────────────────────────
/** 흐림 계산에 쓰는 렌즈 · 거울의 반지름(조리개, cm). 수업 모형이라 실제 렌즈 크기와는 다르다. */
export const APERTURE = 4;
export interface ScreenView {
  /** 스크린에 상이 맺힐 수 있는가(실상일 때만). */
  formed: boolean;
  /** 스크린 위 흐림 원의 지름(cm). 0이면 또렷하다. */
  blur: number;
  /** 스크린에서 물체 끝이 비치는 높이(중심 광선 기준, cm). 음수면 거꾸로 */
  size: number;
  sharp: boolean;
  /** 또렷해지려면 스크린을 어느 쪽으로: 'away' 렌즈에서 멀리, 'closer' 가까이 */
  move: 'away' | 'closer' | null;
  reason: string;
}
export const SHARP_BLUR = 0.4;
/** 스크린은 실상이 생기는 쪽(렌즈는 오른쪽, 거울은 앞쪽)에서 광학 기기로부터 s cm 떨어져 있다. */
export function screenView(image: SingleImage, s: number): ScreenView {
  if (image.infinite) return { formed: false, blur: Infinity, size: 0, sharp: false, move: null, reason: '물체가 초점에 있어서 나간 광선이 나란해요. 스크린을 어디에 두어도 상이 맺히지 않아요.' };
  if (!image.real) return { formed: false, blur: Infinity, size: 0, sharp: false, move: null, reason: '허상이에요. 광선이 실제로 모이지 않아서 스크린에는 맺히지 않아요. 눈으로 보면 보여요.' };
  const blur = 2 * APERTURE * Math.abs(s - image.b) / image.b;
  const sharp = blur < SHARP_BLUR;
  return { formed: true, blur, size: -image.h * s / image.d, sharp, move: sharp ? null : s < image.b ? 'away' : 'closer',
    reason: sharp ? '상이 또렷하게 맺혔어요.' : s < image.b ? '광선이 아직 모이기 전이라 흐려요.' : '광선이 모였다가 다시 퍼져서 흐려요.' };
}

// ── 작도 가이드 ───────────────────────────────────────────────────────────────
export const GUIDE_TOL = 2;
export const SNAP_RADIUS = 2.2;
interface Rule {
  /** 선분의 한쪽 끝이 이 점 근처 */ from?: Pt;
  /** 다른 쪽 끝이 이 점 근처 */ to?: Pt;
  /** 선분을 늘인 직선이 이 점들 근처를 지난다 */ through?: Pt[];
  /** from에서 다른 끝으로 가는 방향 */ toward?: 'left' | 'right';
  /** 선분이 이 x보다 왼쪽(reachLeft) · 오른쪽(reachRight)까지 닿는다 */ reachLeft?: number; reachRight?: number;
}
export interface GuideStep { id: string; title: string; hint: string; kind: 'ray' | 'extension' | 'image'; rule: Rule; ghost: Seg }
export interface GuidePlan { steps: GuideStep[]; note: string | null; snaps: Pt[] }

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
function lineDistance(p: Pt, a: Pt, b: Pt) {
  const len = dist(a, b);
  return len < 1e-9 ? dist(p, a) : Math.abs((b.x - a.x) * (a.y - p.y) - (a.x - p.x) * (b.y - a.y)) / len;
}
/** a에서 b 쪽 직선 위, x = targetX인 점 */
function along(a: Pt, b: Pt, targetX: number): Pt {
  if (Math.abs(b.x - a.x) < 1e-9) return { x: a.x, y: b.y };
  return { x: targetX, y: a.y + (b.y - a.y) * (targetX - a.x) / (b.x - a.x) };
}

export function checkStroke(step: GuideStep, seg: Seg, tol = GUIDE_TOL): boolean {
  if (dist(seg[0], seg[1]) < (step.kind === 'image' ? 0.5 : 1.5)) return false; // 아주 작은 상도 그릴 수 있게
  const { from, to, through = [], toward, reachLeft, reachRight } = step.rule;
  return [[seg[0], seg[1]], [seg[1], seg[0]]].some(([a, b]) =>
    (!from || dist(a, from) <= tol)
    && (!to || dist(b, to) <= tol)
    && through.every(p => lineDistance(p, a, b) <= tol)
    && (!toward || (toward === 'right' ? b.x > a.x + 1 : b.x < a.x - 1))
    && (reachLeft === undefined || Math.min(a.x, b.x) <= reachLeft)
    && (reachRight === undefined || Math.max(a.x, b.x) >= reachRight));
}

/** 작도할 때 끝점이 붙는 점: 물체 끝 · 렌즈(거울)와 만나는 점 · 중심 · 초점 · 2F. 상의 위치는 넣지 않는다(답이 되므로). */
export function snapPoint(p: Pt, snaps: Pt[], radius = SNAP_RADIUS): Pt {
  let best: Pt | null = null, bestDistance = radius;
  for (const s of snaps) { const d = dist(p, s); if (d <= bestDistance) { best = s; bestDistance = d; } }
  return best ? { ...best } : p;
}

export function guideSteps(kind: SingleKind, image: SingleImage, view = SINGLE_VIEW): GuidePlan {
  const { f, d, h } = image;
  const lens = isLens(kind);
  const T = { x: -d, y: h }, L = { x: 0, y: h }, O = { x: 0, y: 0 };
  // 렌즈는 F를 x = f(볼록: 오른쪽, 오목: 왼쪽), 거울은 F를 x = −f(오목: 앞쪽, 볼록: 뒤쪽)에 둔다.
  const F = { x: lens ? f : -f, y: 0 };
  const snaps = lens
    ? [T, L, O, { x: f, y: 0 }, { x: -f, y: 0 }, { x: 2 * f, y: 0 }, { x: -2 * f, y: 0 }]
    : [T, L, O, F, { x: 2 * F.x, y: 0 }];
  if (image.infinite) return { steps: [], snaps, note: '물체가 초점에 있으면 나간 광선이 모두 나란해서 상이 생기지 않아요. 물체를 옮긴 뒤 시작해 주세요.' };
  const I = { x: image.x, y: image.y };
  const inside = I.x > view.left + 2 && I.x < view.right - 2 && Math.abs(I.y) < view.top - 1;
  if (!inside) return { steps: [], snaps, note: '상이 작도판 밖에 생겨요. 물체를 조금 옮겨서 상이 작도판 안에 들어오게 해 주세요.' };
  const edge = (a: Pt, b: Pt, side: 'left' | 'right') => along(a, b, side === 'right' ? view.right - 3 : view.left + 3);
  const steps: GuideStep[] = [];
  const name = lens ? '렌즈' : '거울';
  steps.push({ id: 'parallel', kind: 'ray', title: '① 광축에 나란한 광선', hint: `물체 끝에서 광축과 나란하게 ${name}까지 그어요.`, rule: { from: T, to: L }, ghost: [T, L] });
  if (lens) {
    steps.push(f > 0
      ? { id: 'focus', kind: 'ray', title: '② 굴절 후 초점을 지나는 광선', hint: '렌즈를 지난 광선은 반대쪽 초점 F를 지나요. 렌즈 위 점에서 F를 지나 오른쪽으로 그어요.', rule: { from: L, through: [F], toward: 'right' }, ghost: [L, edge(L, F, 'right')] }
      : { id: 'focus', kind: 'ray', title: '② 퍼지는 굴절 광선', hint: '오목 렌즈를 지난 광선은 물체 쪽 초점 F에서 나온 것처럼 퍼져요. F와 렌즈 위 점을 잇는 방향으로 오른쪽에 그어요.', rule: { from: L, through: [F], toward: 'right' }, ghost: [L, edge(F, L, 'right')] });
    steps.push({ id: 'center', kind: 'ray', title: '③ 렌즈 중심을 지나는 광선', hint: '렌즈 중심을 지나는 광선은 꺾이지 않고 곧게 나가요. 물체 끝에서 렌즈 중심을 지나 오른쪽까지 그어요.', rule: { from: T, through: [O], reachRight: 2 }, ghost: [T, edge(T, O, 'right')] });
    if (!image.real) steps.push({ id: 'extension', kind: 'extension', title: '④ 연장선 그리기', hint: '나간 광선들이 만나지 않아요. ②의 광선을 렌즈 왼쪽으로 거꾸로 늘여 ③의 직선과 만나는 점을 찾아요.', rule: { through: [L, F], reachLeft: Math.min(-1, I.x + 1) }, ghost: [L, along(L, I, I.x - 3)] });
  } else {
    steps.push(f > 0
      ? { id: 'focus', kind: 'ray', title: '② 반사 후 초점을 지나는 광선', hint: '광축에 나란히 들어온 광선은 반사한 뒤 초점 F를 지나요. 거울 위 점에서 F를 지나 왼쪽으로 그어요.', rule: { from: L, through: [F], toward: 'left' }, ghost: [L, edge(L, F, 'left')] }
      : { id: 'focus', kind: 'ray', title: '② 퍼지는 반사 광선', hint: '볼록 거울에서 반사한 광선은 거울 뒤 초점 F에서 나온 것처럼 퍼져요. F와 거울 위 점을 잇는 방향으로 왼쪽에 그어요.', rule: { from: L, through: [F], toward: 'left' }, ghost: [L, edge(F, L, 'left')] });
    steps.push({ id: 'vertex-in', kind: 'ray', title: '③ 거울 중심(꼭짓점)으로 가는 광선', hint: '물체 끝에서 거울과 광축이 만나는 점까지 그어요.', rule: { from: T, to: O }, ghost: [T, O] });
    const mirrored = { x: -d, y: -h };
    steps.push({ id: 'vertex-out', kind: 'ray', title: '④ 꼭짓점에서 반사한 광선', hint: '입사각과 반사각이 같아요. 광축을 기준으로 들어온 광선과 대칭이 되게 왼쪽으로 그어요.', rule: { from: O, through: [mirrored], toward: 'left' }, ghost: [O, edge(O, mirrored, 'left')] });
    if (!image.real) steps.push({ id: 'extension', kind: 'extension', title: '⑤ 연장선 그리기', hint: '반사 광선들이 만나지 않아요. ②의 광선을 거울 뒤쪽으로 거꾸로 늘여 ④를 늘인 직선과 만나는 점을 찾아요.', rule: { through: [L, F], reachRight: Math.max(1, I.x - 1) }, ghost: [L, along(L, I, I.x + 3)] });
  }
  const last = steps.length + 1;
  const mark = '①②③④⑤⑥'[last - 1];
  steps.push({ id: 'image', kind: 'image', title: `${mark} ${image.real ? '실상' : '허상'} 그리기`,
    hint: image.real ? '광선들이 실제로 만나는 점이 상의 끝이에요. 광축에서 그 점까지 세로로 그어요.' : '연장선들이 만나는 점이 허상의 끝이에요. 광축에서 그 점까지 세로로 그어요.',
    rule: { from: { x: I.x, y: 0 }, to: I }, ghost: [{ x: I.x, y: 0 }, I] });
  return { steps, snaps, note: null };
}

// ── 망원경 · 현미경 · 프리즘 (원래 실험실 모형 그대로) ───────────────────────────
export interface TelescopeInput { fo: number; fe: number; angle: number; distant: boolean; objectDistance: number; gap: number }
export function telescopeState(t: TelescopeInput) {
  const { fo, fe } = t;
  const theta = t.angle * Math.PI / 180;
  if (t.distant) return { distant: true as const, fo, fe, sep: fo + fe, theta, imageHeight: -fo * Math.tan(theta), angularMag: -fo / fe };
  const doValue = t.objectDistance;
  const di1 = 1 / (1 / fo - 1 / doValue), m1 = -di1 / doValue;
  const do2 = t.gap, sep = di1 + do2; // 접안렌즈가 중간 상 앞 간격을 유지하며 따라 움직인다
  const infinite = Math.abs(do2 - fe) < 0.05;
  const di2 = infinite ? Infinity : 1 / (1 / fe - 1 / do2);
  const m2 = infinite ? Infinity : -di2 / do2;
  return { distant: false as const, fo, fe, sep, theta, doValue, di1, m1, do2, di2, m2, infinite, totalM: m1 * m2, imageHeight: m1 * 5, finalX: sep + di2 };
}
export function microscopeBounds(fo: number, tube: number) {
  const min = Math.ceil((fo * tube / (tube - fo) + 0.15) * 10) / 10;
  return { min, max: Math.max(12, Math.round((min + 2) * 10) / 10) };
}
export function microscopeState(fo: number, fe: number, objectDistance: number, tube: number) {
  const di1 = 1 / (1 / fo - 1 / objectDistance), m1 = -di1 / objectDistance;
  const do2 = tube - di1, di2 = 1 / (1 / fe - 1 / do2), m2 = -di2 / do2;
  return { fo, fe, doValue: objectDistance, sep: tube, di1, m1, do2, di2, m2, totalM: m1 * m2 };
}
export function prismState(n: number, angle: number) {
  const critical = Math.asin(1 / n) * 180 / Math.PI;
  return { n, critical, totalReflection: angle > critical };
}

export const fmtCm = (value: number) => !Number.isFinite(value) ? '무한대' : `${Math.abs(value) >= 100 ? value.toFixed(0) : value.toFixed(1)} cm`;
