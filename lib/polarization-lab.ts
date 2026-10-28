// 양동비T 편광 가상실험실(components/swipe/PolarizationLab.tsx)의 계산. 이상적인 선형 편광판(투과축 = 편광축) 모형.
// 각도는 도(°), 0°는 수직 · 90°는 수평. 세기는 상대 세기(a.u.).

export type Source = 'natural' | 'linear';
export interface Bench { source: Source; i0: number; /** 선편광 광원의 전기장 방향 */ phi: number; /** 편광판 투과축, 빛이 지나는 순서대로 */ plates: number[] }
export interface Stage { /** 이 판을 지난 세기 */ intensity: number; /** 이 판을 지난 빛의 편광 방향(빛이 없으면 null) */ pol: number | null; /** 들어온 빛과 투과축 사이의 각(자연광이면 null) */ delta: number | null }

const EPS = 1e-9;
export const rad = (deg: number) => deg * Math.PI / 180;
export const cos2 = (deg: number) => Math.cos(rad(deg)) ** 2;
/** 0 ≤ 각 < 180으로 접는다(편광 방향은 180° 돌리면 같다). */
export const fold = (deg: number) => ((deg % 180) + 180) % 180;

/** 말뤼스 법칙 I = I₀ cos²θ. */
export const malus = (i0: number, theta: number) => i0 * cos2(theta);

/** 광원에서 시작해 편광판을 하나씩 지날 때의 세기와 편광 방향. */
export function benchStages(bench: Bench): Stage[] {
  let intensity = bench.i0, pol: number | null = bench.source === 'linear' ? fold(bench.phi) : null;
  const stages: Stage[] = [];
  for (const angle of bench.plates) {
    // 자연광: 모든 방향이 고르게 섞여 있어 어느 투과축이든 시간 평균 세기의 절반이 지난다.
    const delta = pol === null ? null : fold(angle - pol);
    intensity = pol === null ? intensity / 2 : malus(intensity, angle - pol);
    if (intensity < EPS) intensity = 0;
    pol = intensity > 0 ? fold(angle) : null;
    stages.push({ intensity, pol, delta });
  }
  return stages;
}

export const finalIntensity = (bench: Bench) => benchStages(bench).at(-1)?.intensity ?? bench.i0;

/** 수직인 두 편광판 사이에 α만큼 돌린 판을 넣을 때: I₃ = ⅛ I₀ sin²2α. */
export const threePlates = (i0: number, alpha: number) => i0 / 8 * Math.sin(rad(2 * alpha)) ** 2;

/** 자연광 평균: (1/π)∫₀^π I₀cos²θ dθ를 n칸 사다리꼴로 어림한다(I₀/2에 가까워진다). */
export function naturalAverage(i0: number, n = 360) {
  let sum = 0;
  for (let k = 0; k < n; k += 1) sum += malus(i0, (180 * (k + 0.5)) / n);
  return sum / n;
}

/** 0.1 단위까지(정수면 정수로). */
export const fmt = (v: number, digits = 1) => { const r = Number(v.toFixed(digits)); return Object.is(r, -0) ? '0' : String(r); };

// ── LCD · 외부 편광판 ──────────────────────────────────────────────
/** TN 방식 이상 모형: 수직 편광판 → 액정(전압 끄면 90° 회전, 켜면 그대로) → 수평 편광판. */
export function lcdPixel(i0: number, voltageOn: boolean) {
  const afterFirst = i0 / 2;
  const rotated = voltageOn ? 0 : 90;
  const out = malus(afterFirst, fold(0 + rotated) - 90);
  return { afterFirst, rotated, out: out < EPS ? 0 : out, bright: out > EPS };
}
/** 화면 앞에 선형 편광판을 겹쳐 돌릴 때: 선편광 출력은 cos²로 변하고, 자연광 · 이상적 원편광은 항상 절반. */
export const overLinear = (relative: number, outputPol: number, angle: number) => relative * cos2(angle - outputPol);
export const overNatural = (relative: number) => relative / 2;

// ── 광자의 편광과 정보 전송 (BB84 모형) ─────────────────────────────
export type Bit = 0 | 1;
export type Basis = '+' | '×';
/** + 기준: 비트 0 = 수직 0°, 비트 1 = 수평 90° · × 기준: 비트 0 = 대각 45°, 비트 1 = 역대각 135°. */
export const polOf = (bit: Bit, basis: Basis) => basis === '+' ? (bit ? 90 : 0) : (bit ? 135 : 45);
export const ARROW: Record<number, string> = { 0: '↕', 90: '↔', 45: '⤢', 135: '⤡' };

/** 이상적인 측정: 같은 기준이면 원래 비트, 다른 기준이면 0 · 1이 반반. */
export const measure = (bit: Bit, prepared: Basis, measured: Basis, random: () => number): Bit =>
  prepared === measured ? bit : (random() < 0.5 ? 0 : 1);

export interface Photon { aBit: Bit; aBasis: Basis; eBasis?: Basis; eBit?: Bit; bBasis: Basis; bBit: Bit }
export interface Plan { aBits: Bit[]; aBases: Basis[]; bBases: Basis[]; eBases?: Basis[] }

export const randomBit = (random: () => number): Bit => random() < 0.5 ? 0 : 1;
export const randomBasis = (random: () => number): Basis => random() < 0.5 ? '+' : '×';
export function randomPlan(n: number, random: () => number): Plan {
  const list = <T,>(make: () => T) => Array.from({ length: n }, make);
  return { aBits: list(() => randomBit(random)), aBases: list(() => randomBasis(random)), bBases: list(() => randomBasis(random)), eBases: list(() => randomBasis(random)) };
}

/** 앨리스가 보내고, (이브가 가로채 자기 결과로 새 광자를 보내고,) 밥이 측정한다. */
export function transmit(plan: Plan, eve: boolean, random: () => number): Photon[] {
  return plan.aBits.map((aBit, i) => {
    const aBasis = plan.aBases[i], bBasis = plan.bBases[i];
    if (!eve) return { aBit, aBasis, bBasis, bBit: measure(aBit, aBasis, bBasis, random) };
    const eBasis = plan.eBases?.[i] ?? randomBasis(random);
    const eBit = measure(aBit, aBasis, eBasis, random);
    return { aBit, aBasis, eBasis, eBit, bBasis, bBit: measure(eBit, eBasis, bBasis, random) };
  });
}

/** 기준만 공개해 같은 기준인 번호를 남긴다. */
export const sift = (photons: Photon[]) => photons.flatMap((p, i) => p.aBasis === p.bBasis ? [i] : []);

/** 남긴 번호 중 일부(대략 절반, 적어도 1개)를 무작위로 골라 검사한다. 검사한 비트는 공개되므로 키에서 뺀다. */
export function pickSample(kept: number[], random: () => number) {
  if (!kept.length) return [];
  const count = Math.max(1, Math.round(kept.length / 2));
  const pool = [...kept];
  for (let i = pool.length - 1; i > 0; i -= 1) { const j = Math.floor(random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
  return pool.slice(0, count).sort((a, b) => a - b);
}

export interface KeyResult { kept: number[]; sample: number[]; errors: number; rate: number | null; aKey: Bit[]; bKey: Bit[]; safe: boolean }
export function keyResult(photons: Photon[], sample: number[]): KeyResult {
  const kept = sift(photons);
  const errors = sample.filter(i => photons[i].aBit !== photons[i].bBit).length;
  const rest = kept.filter(i => !sample.includes(i));
  return {
    kept, sample, errors, rate: sample.length ? errors / sample.length : null,
    aKey: rest.map(i => photons[i].aBit), bKey: rest.map(i => photons[i].bBit),
    safe: sample.length > 0 && errors === 0,
  };
}

/** 메시지 XOR 키: 같은 비트끼리 0, 다른 비트끼리 1. */
export const xor = (a: Bit[], b: Bit[]): Bit[] => a.map((bit, i) => (bit ^ b[i]) as Bit);
export const parseBits = (text: string): Bit[] | null => /^[01]+$/.test(text) ? [...text].map(ch => (ch === '1' ? 1 : 0)) : null;

/** 같은 시드면 같은 결과(테스트용). */
export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => { s ^= s << 13; s >>>= 0; s ^= s >> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; };
}
