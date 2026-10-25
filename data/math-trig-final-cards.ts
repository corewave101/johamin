import type { Direction, SwipeCard } from './swipe-cards';
import type { WrittenQuestion } from './biology-written';

// 기말고사 · 수학(황종철T) 「일반각에 대한 삼각함수의 성질」 → 삼각함수 각 변환 암산 덱.
// 근거: 개념원리 수학Ⅰ 170~173쪽(2nπ+x · −x · π±x · π/2±x · 각 변환 방법 · 삼각함수표)과 408~410번.
// 카드는 손으로 쓰지 않고 아래 규칙으로 만든다. 값은 각도로 계산하고(tests/test_math_trig_final.cjs가
// 모든 카드를 Math.sin/cos/tan으로 다시 확인한다), 해설은 교재의 변환 순서를 그대로 보여 준다.
// ⚠ 카드 id는 만들어지는 순서로 붙는다. 이미 있는 묶음의 순서·범위를 바꾸지 말고 새 묶음은 맨 뒤에 붙인다.

type Fn = 'sin' | 'cos' | 'tan';
const FNS: Fn[] = ['sin', 'cos', 'tan'];
const M = '−'; // 화면용 마이너스

// ── 값 ───────────────────────────────────────────────────────────────────────
const SPECIAL: [string, number][] = [
  ['0', 0], ['1/2', 0.5], ['√2/2', Math.SQRT2 / 2], ['√3/2', Math.sqrt(3) / 2], ['1', 1], ['√3/3', Math.sqrt(3) / 3], ['√3', Math.sqrt(3)],
];
const neg = (s: string) => s === '0' ? '0' : s.startsWith(M) ? s.slice(1) : M + s;
export function parseValue(s: string): number {
  const sign = s.startsWith(M) ? -1 : 1;
  const body = sign < 0 ? s.slice(1) : s;
  const hit = SPECIAL.find(([t]) => t === body);
  if (hit) return sign * hit[1];
  const n = Number(body);
  if (Number.isNaN(n)) throw new Error(`value ${s}`);
  return sign * n;
}
const raw = (f: Fn, deg: number) => { const r = deg * Math.PI / 180; return f === 'sin' ? Math.sin(r) : f === 'cos' ? Math.cos(r) : Math.tan(r); };
const defined = (f: Fn, deg: number) => f !== 'tan' || Math.abs(Math.cos(deg * Math.PI / 180)) > 1e-9;
/** Exact value as text, e.g. value('cos', 210) = '−√3/2'. */
export function value(f: Fn, deg: number): string {
  const v = raw(f, deg);
  for (const [t, n] of SPECIAL) {
    if (Math.abs(v - n) < 1e-9) return t;
    if (Math.abs(v + n) < 1e-9) return neg(t);
  }
  throw new Error(`no exact value for ${f} ${deg}`);
}

// ── 각 표기 ──────────────────────────────────────────────────────────────────
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);
const degText = (d: number) => `${d < 0 ? M : ''}${Math.abs(d)}°`;
function radText(d: number) {
  if (d === 0) return '0';
  const g = gcd(Math.abs(d), 180), p = Math.abs(d) / g, q = 180 / g, s = d < 0 ? M : '';
  return `${s}${p === 1 ? '' : p}π${q === 1 ? '' : `/${q}`}`;
}
type Unit = 'deg' | 'rad';
const ang = (d: number, u: Unit) => u === 'deg' ? degText(d) : radText(d);
/** sin 750° / sin(−60°) */
const call = (f: Fn | string, inner: string) => inner.startsWith(M) || /[+−]/.test(inner.slice(1)) ? `${f}(${inner})` : `${f} ${inner}`;
const full = (u: Unit) => u === 'deg' ? '360°' : '2π';
const half = (u: Unit) => u === 'deg' ? '180°' : 'π';
const quarter = (u: Unit) => u === 'deg' ? '90°' : 'π/2';

// ── 보기 ─────────────────────────────────────────────────────────────────────
const COMPLEMENT: Record<string, string> = { '0': '1', '1': '0', '1/2': '√3/2', '√3/2': '1/2', '√2/2': '√2/2', '√3/3': '√3', '√3': '√3/3' };
const FILL = ['1/2', '√3/2', '√2/2', '1', '0', '√3', '√3/3'];
function valueChoices(v: string): [string, string, string, string] {
  const abs = v.startsWith(M) ? v.slice(1) : v;
  const swap = COMPLEMENT[abs];
  const out = [v];
  const add = (c: string) => { if (c && !out.includes(c)) out.push(c); };
  add(neg(v));
  add(v.startsWith(M) ? neg(swap) : swap);
  add(v.startsWith(M) ? swap : neg(swap));
  for (const c of FILL) { if (out.length >= 4) break; add(v.startsWith(M) ? neg(c) : c); add(c); }
  return out.slice(0, 4) as [string, string, string, string];
}
const symbolChoices = (f: Fn, x: string, correct: string): [string, string, string, string] => {
  const all = f === 'tan' ? [`tan ${x}`, `${M}tan ${x}`, `1/tan ${x}`, `${M}1/tan ${x}`] : [`sin ${x}`, `${M}sin ${x}`, `cos ${x}`, `${M}cos ${x}`];
  return [correct, ...all.filter(c => c !== correct)] as [string, string, string, string];
};

// ── 변환 규칙 ────────────────────────────────────────────────────────────────
const quadrant = (deg: number) => { const a = ((deg % 360) + 360) % 360; return a < 90 ? 1 : a < 180 ? 2 : a < 270 ? 3 : 4; };
const positive = (f: Fn, q: number) => f === 'sin' ? q <= 2 : f === 'cos' ? q === 1 || q === 4 : q === 1 || q === 3;
const SWAP: Record<Fn, Fn> = { sin: 'cos', cos: 'sin', tan: 'tan' };
/** 사인·코사인은 '은', 탄젠트는 '는' */
const eun = (f: Fn) => f === 'tan' ? '는' : '은';
/** f(90°×n ± θ)를 θ의 삼각함수로: [부호, 함수 글자] — θ는 예각으로 본다. */
function transform(f: Fn, n: number, plus: boolean): { sign: 1 | -1; text: (x: string) => string } {
  const q = quadrant(90 * n + (plus ? 10 : -10));
  const sign = positive(f, q) ? 1 : -1;
  const odd = Math.abs(n) % 2 === 1;
  const text = (x: string) => {
    const body = odd ? (f === 'tan' ? `1/tan ${x}` : `${SWAP[f]} ${x}`) : `${f} ${x}`;
    return sign < 0 ? `${M}${body}` : body;
  };
  return { sign, text };
}

// ── 카드 모으기 ──────────────────────────────────────────────────────────────
type Row = { topic: string; question: string; choices: [string, string, string, string]; explanation: string; page: number };
const rows: Row[] = [];
const seen = new Set<string>();
function push(topic: string, question: string, choices: [string, string, string, string], explanation: string, page: number) {
  if (seen.has(question)) return;
  if (new Set(choices).size !== 4) throw new Error(`choices ${question} ${choices}`);
  seen.add(question);
  rows.push({ topic, question, choices, explanation, page });
}
const T1 = '2nπ+x의 삼각함수', T2 = '−x의 삼각함수', T3 = 'π±x의 삼각함수', T4 = 'π/2±x의 삼각함수';
const T5 = '각 변환 공식(90°×n±θ)', T6 = '각 변환으로 값 구하기', T7 = '삼각함수표로 나타내기', T8 = '동경과 부호';
const REFS = [30, 45, 60];
const UNITS: Unit[] = ['deg', 'rad'];

/** 0°~360° 사이 각 하나를 예각 삼각함수로 줄이는 한 단계(π±x, 2π−x). 예: sin 150° = sin(180° − 30°) = sin 30° */
function reduceStep(f: Fn, deg: number, u: Unit): { chain: string; sign: 1 | -1; ref: number } {
  const a = ((deg % 360) + 360) % 360;
  if (a <= 90) return { chain: '', sign: 1, ref: a };
  if (a < 180) { const r = 180 - a; const s = f === 'sin' ? 1 : -1; return { chain: `${call(f, `${half(u)} ${M} ${ang(r, u)}`)} = ${s < 0 ? M : ''}${call(f, ang(r, u))}`, sign: s, ref: r }; }
  if (a < 270) { const r = a - 180; const s = f === 'tan' ? 1 : -1; return { chain: `${call(f, `${half(u)} + ${ang(r, u)}`)} = ${s < 0 ? M : ''}${call(f, ang(r, u))}`, sign: s, ref: r }; }
  const r = 360 - a; const s = f === 'cos' ? 1 : -1;
  return { chain: `${call(f, `${full(u)} ${M} ${ang(r, u)}`)} = ${s < 0 ? M : ''}${call(f, ang(r, u))}`, sign: s, ref: r };
}

// 1) 2nπ + x
for (const u of UNITS) for (const k of [1, 2, 3, 4, 5]) for (const f of FNS) for (const r of [...REFS, 0, 90]) {
  const d = 360 * k + r;
  if (!defined(f, d)) continue;
  const v = value(f, d);
  push(T1, `${call(f, ang(d, u))}의 값은?`, valueChoices(v),
    `${ang(d, u)} = ${full(u)}×${k} + ${ang(r, u)}이므로 ${call(f, ang(d, u))} = ${call(f, ang(r, u))} = ${v}이다.`, 170);
}
for (const u of UNITS) for (const k of [1, 2, 3, 4]) for (const f of FNS) {
  const x = u === 'deg' ? 'θ' : 'x';
  const inner = u === 'deg' ? `${360 * k}° + θ` : `${2 * k}π + x`;
  const ans = `${f} ${x}`;
  push(T1, `${f}(${inner})를 간단히 하면?`, symbolChoices(f, x, ans), `${f === 'tan' ? 'tan의 주기는 π, ' : ''}${f}(2nπ + x) = ${f} x (n은 정수)이므로 ${f}(${inner}) = ${ans}이다.`, 170);
}

// 2) −x
for (const u of UNITS) for (const f of FNS) for (const d of [...REFS, 120, 135, 150, 210, 225, 240, 300, 315, 330, 390, 405, 420, 750, 765, 780]) {
  if (!defined(f, d)) continue;
  const v = value(f, -d);
  const first = f === 'cos' ? `${call(f, ang(-d, u))} = ${call(f, ang(d, u))}` : `${call(f, ang(-d, u))} = ${M}${call(f, ang(d, u))}`;
  const outer = f === 'cos' ? 1 : -1;
  let rest = '';
  if (d > 360) { const k = Math.floor(d / 360), r = d - 360 * k; rest = ` = ${outer < 0 ? M : ''}${call(f, ang(r, u))}`; }
  else if (d > 90) { const st = reduceStep(f, d, u); const s = outer * st.sign; rest = ` = ${s < 0 ? M : ''}${call(f, ang(st.ref, u))}`; }
  push(T2, `${call(f, ang(-d, u))}의 값은?`, valueChoices(v),
    `${f === 'cos' ? 'cos(−x) = cos x' : `${f}(−x) = −${f} x`}이므로 ${first}${rest} = ${v}이다.`, 170);
}
for (const f of FNS) for (const x of ['x', 'θ']) {
  const ans = f === 'cos' ? `cos ${x}` : `${M}${f} ${x}`;
  push(T2, `${f}(${M}${x})를 간단히 하면?`, symbolChoices(f, x, ans),
    `${f === 'cos' ? 'y = cos x의 그래프는 y축에 대하여 대칭' : `y = ${f} x의 그래프는 원점에 대하여 대칭`}이므로 ${f}(${M}${x}) = ${ans}이다.`, 170);
}

// 3) π ± x
for (const u of UNITS) for (const f of FNS) for (const r of REFS) for (const plus of [true, false]) {
  const d = plus ? 180 + r : 180 - r;
  const v = value(f, d);
  const s = plus ? (f === 'tan' ? 1 : -1) : (f === 'sin' ? 1 : -1);
  const inner = `${half(u)} ${plus ? '+' : M} ${ang(r, u)}`;
  const rule = `${f}(π ${plus ? '+' : M} x) = ${s < 0 ? M : ''}${f} x`;
  push(T3, `${f}(${inner})의 값은?`, valueChoices(v), `${rule}이므로 ${f}(${inner}) = ${s < 0 ? M : ''}${call(f, ang(r, u))} = ${v}이다.`, 170);
  push(T3, `${call(f, ang(d, u))}의 값은?`, valueChoices(v),
    `${ang(d, u)} = ${inner}이고 ${rule}이므로 ${call(f, ang(d, u))} = ${s < 0 ? M : ''}${call(f, ang(r, u))} = ${v}이다.`, 170);
}
for (const u of UNITS) for (const f of FNS) for (const plus of [true, false]) {
  const x = u === 'deg' ? 'θ' : 'x';
  const s = plus ? (f === 'tan' ? 1 : -1) : (f === 'sin' ? 1 : -1);
  const ans = `${s < 0 ? M : ''}${f} ${x}`;
  push(T3, `${f}(${half(u)} ${plus ? '+' : M} ${x})를 간단히 하면?`, symbolChoices(f, x, ans),
    `y = ${f} x의 그래프를 x축 방향으로 ${M}π만큼 평행이동해 보면 ${f}(π ${plus ? '+' : M} x) = ${s < 0 ? M : ''}${f} x이다.`, 170);
}

// 4) π/2 ± x
for (const u of UNITS) for (const f of FNS) for (const plus of [true, false]) {
  const x = u === 'deg' ? 'θ' : 'x';
  const t = transform(f, 1, plus);
  push(T4, `${f}(${quarter(u)} ${plus ? '+' : M} ${x})를 간단히 하면?`, symbolChoices(f, x, t.text(x)),
    `${f}(π/2 ${plus ? '+' : M} x) = ${t.text('x')}이다. ${f === 'tan' ? 'tan = sin/cos로 바꿔 계산하면 나온다.' : `y = ${f} x의 그래프를 평행이동해 겹쳐 보면 알 수 있다.`}`, 171);
}
for (const u of UNITS) for (const f of FNS) for (const r of REFS) for (const plus of [true, false]) {
  const d = plus ? 90 + r : 90 - r;
  const v = value(f, d);
  const t = transform(f, 1, plus);
  const inner = `${quarter(u)} ${plus ? '+' : M} ${ang(r, u)}`;
  push(T4, `${f}(${inner})의 값은?`, valueChoices(v), `${f}(π/2 ${plus ? '+' : M} x) = ${t.text('x')}이므로 ${f}(${inner}) = ${t.text(ang(r, u))} = ${v}이다.`, 171);
}

// 5) 90°×n ± θ 공식
for (const u of UNITS) for (const n of [-4, -3, -2, -1, 2, 3, 4, 5, 6, 7]) for (const f of FNS) for (const plus of [true, false]) {
  const x = u === 'deg' ? 'θ' : 'x';
  const t = transform(f, n, plus);
  const q = quadrant(90 * n + (plus ? 10 : -10));
  const base = u === 'deg' ? degText(90 * n) : radText(90 * n);
  const inner = n < 0 ? (plus ? `${x} ${M} ${base.slice(1)}` : `${base} ${M} ${x}`) : `${base} ${plus ? '+' : M} ${x}`;
  if (n < 0 && !plus) continue; // −90°×k − θ는 −(90°×k + θ)라 위와 겹친다
  const odd = Math.abs(n) % 2 === 1;
  push(T5, `${f}(${inner})를 간단히 하면?`, symbolChoices(f, x, t.text(x)),
    `${quarter(u)}×${n < 0 ? `(${M}${-n})` : n} ${plus ? '+' : M} ${x}에서 n이 ${odd ? `홀수라 ${f} → ${f === 'tan' ? '1/tan' : SWAP[f]}` : `짝수라 ${f} 그대로`}, ${x}를 예각으로 보면 제${q}사분면이고 거기서 ${f}${eun(f)} ${t.sign > 0 ? '양수' : '음수'}이므로 ${t.text(x)}이다.`, 171);
}
const RULES: [string, [string, string, string, string], string][] = [
  ['f(90°×n ± θ)에서 n이 짝수일 때 sin은?', ['sin 그대로', 'cos으로 바꾼다', '1/tan으로 바꾼다', '−sin으로 바꾼다'], 'n이 짝수이면 함수를 그대로 둔다(sin → sin, cos → cos, tan → tan). 부호는 따로 정한다.'],
  ['f(90°×n ± θ)에서 n이 홀수일 때 cos은?', ['sin으로 바꾼다', 'cos 그대로', 'tan으로 바꾼다', '1/cos로 바꾼다'], 'n이 홀수이면 sin → cos, cos → sin, tan → 1/tan으로 바꾼다.'],
  ['f(90°×n ± θ)에서 n이 홀수일 때 tan은?', ['1/tan으로 바꾼다', 'tan 그대로', 'sin으로 바꾼다', 'cos으로 바꾼다'], 'n이 홀수이면 tan → 1/tan으로 바꾼다. n이 짝수이면 tan 그대로다.'],
  ['각 변환에서 부호를 정하는 기준은?', ['원래 함수의 부호', '바뀐 함수의 부호', 'n이 짝수면 +', 'θ의 부호'], '90°×n ± θ를 나타내는 동경이 있는 사분면에서 원래 주어진 삼각함수의 부호가 양이면 +, 음이면 −를 붙인다.'],
  ['각 변환에서 θ의 값이 정해지지 않았을 때 θ는?', ['예각으로 본다', '둔각으로 본다', '0으로 본다', '90°로 본다'], 'θ의 값이 정해지지 않은 경우에는 θ를 예각으로 간주하여 부호를 결정한다.'],
  ['여러 가지 각의 삼각함수 값을 구하는 첫 단계는?', ['90°×n ± θ 꼴로 나타내기', '부호부터 정하기', '함수 바꾸기', '삼각함수표 보기'], '(i) 각을 90°×n ± θ 또는 π/2×n ± θ 꼴로 나타내고, (ii) 함수를 정하고, (iii) 부호를 정한다.'],
  ['일반각의 삼각함수를 몇 도 사이 각의 삼각함수로 나타낼 수 있는가?', ['0°~90°', '0°~180°', '0°~360°', '−90°~90°'], '삼각함수의 성질을 쓰면 일반각의 삼각함수를 0°에서 90°까지의 각의 삼각함수로 나타낼 수 있다.'],
  ['y = sin x의 그래프와 y = tan x의 그래프의 대칭으로 옳은 것은?', ['둘 다 원점 대칭', '둘 다 y축 대칭', 'sin만 y축 대칭', 'tan만 y축 대칭'], 'sin과 tan은 원점에 대하여 대칭이라 sin(−x) = −sin x, tan(−x) = −tan x이다. cos은 y축 대칭이다.'],
  ['y = tan x의 주기는?', ['π', '2π', 'π/2', '4π'], 'y = tan x의 주기는 π라 tan(π + x) = tan x이다. sin, cos의 주기는 2π다.'],
];
for (const [q, c, e] of RULES) push(T5, q, c, e.endsWith('다.') ? e : `${e}이다.`, 171);

// 6) 90°×n ± θ로 값 구하기 (예: cos 7π/6, sin 11π/4, tan 240°)
const ANGLES: number[] = [];
for (let d = 0; d <= 1440; d += 15) if (d % 30 === 0 || d % 45 === 0) ANGLES.push(d);
for (const u of UNITS) for (const f of FNS) for (const d of ANGLES) {
  if (!defined(f, d)) continue;
  const v = value(f, d);
  const q = `${call(f, ang(d, u))}의 값은?`;
  if (seen.has(q)) continue;
  if (d % 90 === 0) {
    const k = Math.floor(d / 360), r = d - 360 * k;
    const point = ({ 0: '(1, 0)', 90: '(0, 1)', 180: '(−1, 0)', 270: '(0, −1)' } as Record<number, string>)[r];
    const coord = f === 'sin' ? 'y좌표' : f === 'cos' ? 'x좌표' : 'y좌표 ÷ x좌표';
    push(T6, q, valueChoices(v), `${k ? `${ang(d, u)} = ${full(u)}×${k} + ${ang(r, u)}이고, ` : ''}단위원에서 ${ang(r, u)}의 동경은 점 ${point}을 지나며 ${f}${eun(f)} ${coord}이므로 ${call(f, ang(d, u))} = ${v}이다.`, 171);
    continue;
  }
  const n = Math.floor(d / 90), th = d - 90 * n;
  const t = transform(f, n, true);
  const odd = n % 2 === 1;
  push(T6, q, valueChoices(v),
    `${ang(d, u)} = ${quarter(u)}×${n} + ${ang(th, u)}: n이 ${odd ? `홀수라 ${f} → ${f === 'tan' ? '1/tan' : SWAP[f]}` : `짝수라 ${f} 그대로`}, 제${quadrant(d)}사분면에서 ${f}${eun(f)} ${t.sign > 0 ? '양수' : '음수'}이므로 ${t.text(ang(th, u))} = ${v}이다.`, 171);
}
for (const u of UNITS) for (const f of FNS) for (const d of ANGLES.filter(a => a > 0 && a <= 720)) {
  if (!defined(f, -d)) continue;
  const v = value(f, -d);
  const q = `${call(f, ang(-d, u))}의 값은?`;
  if (seen.has(q)) continue;
  const outer = f === 'cos' ? 1 : -1;
  const a = d % 360;
  const st = reduceStep(f, a, u);
  const s = outer * st.sign;
  push(T6, q, valueChoices(v),
    `${f === 'cos' ? 'cos(−x) = cos x' : `${f}(−x) = −${f} x`}이므로 ${call(f, ang(-d, u))} = ${outer < 0 ? M : ''}${call(f, ang(d, u))}${d > 360 ? ` = ${outer < 0 ? M : ''}${call(f, ang(a, u))}` : ''}${a > 90 ? ` = ${s < 0 ? M : ''}${call(f, ang(st.ref, u))}` : ''} = ${v}이다.`, 170);
}

// 7) 삼각함수표: 0°~90°의 삼각함수로 나타내기 / 표 값으로 구하기
const TABLE_ANGLES = [100, 110, 130, 140, 160, 170, 190, 200, 220, 230, 250, 260, 280, 290, 310, 320, 340, 350];
const four = (n: number) => (n < 0 ? M : '') + Math.abs(n).toFixed(4);
for (const f of FNS) for (const d of TABLE_ANGLES) {
  const st = reduceStep(f, d, 'deg');
  const correct = `${st.sign < 0 ? M : ''}${f} ${st.ref}°`;
  const c = f === 'tan'
    ? [correct, ...[`tan ${st.ref}°`, `${M}tan ${st.ref}°`, `1/tan ${st.ref}°`, `${M}1/tan ${st.ref}°`].filter(x => x !== correct)]
    : [correct, ...[`sin ${st.ref}°`, `${M}sin ${st.ref}°`, `cos ${st.ref}°`, `${M}cos ${st.ref}°`].filter(x => x !== correct)];
  push(T7, `${f} ${d}°를 0°~90°의 같은 삼각함수로 나타내면?`, c as [string, string, string, string],
    `${f} ${d}° = ${st.chain}이다. 이렇게 바꾸면 삼각함수표의 값을 쓸 수 있다.`, 172);
}
for (const f of FNS) for (const d of TABLE_ANGLES) {
  const st = reduceStep(f, d, 'deg');
  const r = st.ref;
  const v = raw(f, d);
  const base = Math.abs(raw(f, r));
  const other = f === 'tan' ? 1 / base : Math.abs(raw(f === 'sin' ? 'cos' : 'sin', r));
  const given = f === 'tan' ? `tan ${r}° = ${base.toFixed(4)}` : `sin ${r}° = ${Math.abs(raw('sin', r)).toFixed(4)}, cos ${r}° = ${Math.abs(raw('cos', r)).toFixed(4)}`;
  const correct = four(Math.sign(v) * base);
  const choices = [correct, four(-Math.sign(v) * base), four(Math.sign(v) * other), four(-Math.sign(v) * other)] as [string, string, string, string];
  push(T7, `${given}일 때 ${f} ${d}°의 값은?`, choices, `${f} ${d}° = ${st.chain} = ${correct}이다.`, 172);
}

// 8) 동경의 사분면과 부호
for (const [q, ans] of [[1, '모두'], [2, 'sin만'], [3, 'tan만'], [4, 'cos만']] as const) {
  push(T8, `제${q}사분면의 각 θ에서 값이 양수인 삼각함수는?`, [ans, ...['모두', 'sin만', 'cos만', 'tan만'].filter(x => x !== ans)] as [string, string, string, string],
    `제1사분면은 모두, 제2사분면은 sin, 제3사분면은 tan, 제4사분면은 cos만 양수다. 그래서 제${q}사분면은 ${ans} 양수이다.`, 171);
}
for (const u of UNITS) for (const d of [...ANGLES.filter(a => a % 90 !== 0 && a > 90), ...[30, 60, 135, 225, 300, 405].map(a => -a)]) {
  const q = quadrant(d);
  const ans = `제${q}사분면`;
  push(T8, `${ang(d, u)}를 나타내는 동경은 몇 사분면에 있는가?`, [ans, ...[1, 2, 3, 4].filter(x => x !== q).map(x => `제${x}사분면`)] as [string, string, string, string],
    d >= 0 && d < 360
      ? `${ang(90 * (q - 1), u)} < ${ang(d, u)} < ${ang(90 * q, u)}이므로 동경은 제${q}사분면에 있다.`
      : `${ang(d, u)}${d < 0 ? '에' : '에서'} ${full(u)}의 정수배를 ${d < 0 ? '더하면' : '빼면'} ${ang(((d % 360) + 360) % 360, u)}이고, 이 각의 동경은 제${q}사분면에 있다.`, 171);
}

// ── 카드 ─────────────────────────────────────────────────────────────────────
export const MATH_TRIG_TOPICS = [T1, T2, T3, T4, T5, T6, T7, T8];
export const mathTrigSource = (page: number) => `황종철T 개념원리 수학Ⅰ · ${page}쪽`;
const directions: Direction[] = ['up', 'left', 'right', 'down'];
// 정답 방향이 한쪽에 몰리지 않고 순서도 읽히지 않게, id 번호로 정해지는 섞기(같은 카드는 늘 같은 배치).
function arrange(index: number, choices: [string, string, string, string]): { answers: Record<Direction, string>; correct: Direction } {
  let h = (index + 1) * 2654435761 >>> 0;
  const order = [0, 1, 2, 3];
  for (let i = 3; i > 0; i -= 1) { h = (h * 1103515245 + 12345) >>> 0; const j = (h >>> 16) % (i + 1); [order[i], order[j]] = [order[j], order[i]]; }
  const answers = Object.fromEntries(directions.map((direction, slot) => [direction, choices[order[slot]]])) as Record<Direction, string>;
  return { answers, correct: directions[order.indexOf(0)] };
}
export const mathTrigFinalCards: SwipeCard[] = rows.map((row, index) => ({
  id: `math-trig-final-${String(index + 1).padStart(4, '0')}`,
  topic: row.topic, question: row.question,
  ...arrange(index, row.choices),
  explanation: row.explanation, sourceNote: mathTrigSource(row.page),
}));

export const mathTrigFinalWritten: WrittenQuestion[] = [
  { id: 'math-trig-final-written-001', topic: T5, question: '여러 가지 각의 삼각함수 값을 구하는 세 단계를 쓰고, 이를 이용해 cos 210°와 sin 11π/4의 값을 구하시오.',
    modelAnswer: '(i) 주어진 각을 90°×n ± θ 또는 π/2×n ± θ(n은 정수) 꼴로 나타낸다. (ii) n이 짝수이면 함수를 그대로 두고, 홀수이면 sin → cos, cos → sin, tan → 1/tan으로 바꾼다. (iii) 그 각을 나타내는 동경이 있는 사분면에서 원래 함수의 부호가 양이면 +, 음이면 −를 붙인다(θ는 예각으로 본다). cos 210° = cos(90°×2 + 30°): n = 2 짝수라 cos 그대로, 제3사분면에서 cos은 음수이므로 −cos 30° = −√3/2. sin 11π/4 = sin(π/2×5 + π/4): n = 5 홀수라 cos으로 바꾸고, 제2사분면에서 sin은 양수이므로 cos π/4 = √2/2.',
    criteria: ['90°×n ± θ 꼴로 나타내기', 'n 짝수: 그대로 / 홀수: sin↔cos, tan→1/tan', '부호: 원래 함수의 사분면 부호 (θ는 예각)', 'cos 210° = −√3/2, sin 11π/4 = √2/2'], sourceNote: mathTrigSource(171) },
  { id: 'math-trig-final-written-002', topic: T3, question: 'y = sin x, y = cos x의 그래프의 평행이동과 대칭을 이용해 sin(π + x), cos(π − x), sin(−x), cos(−x)를 간단히 하고 그 까닭을 쓰시오.',
    modelAnswer: 'y = sin x의 그래프를 x축 방향으로 −π만큼 평행이동하면 y = −sin x의 그래프와 겹쳐지므로 sin(π + x) = −sin x이다. y = cos x의 그래프를 −π만큼 평행이동하면 y = −cos x와 겹쳐지므로 cos(π + x) = −cos x이고, x 대신 −x를 넣으면 cos(π − x) = −cos(−x) = −cos x이다. y = sin x의 그래프는 원점에 대하여 대칭이므로 sin(−x) = −sin x이고, y = cos x의 그래프는 y축에 대하여 대칭이므로 cos(−x) = cos x이다.',
    criteria: ['sin(π + x) = −sin x (−π 평행이동)', 'cos(π − x) = −cos x (x 대신 −x 대입)', 'sin(−x) = −sin x (원점 대칭)', 'cos(−x) = cos x (y축 대칭)'], sourceNote: mathTrigSource(172) },
];
