// 주민지T 「Ⅲ. 탄소 화합물과 반응」 오비탈 실습의 화학 로직(3D 그림 없이 테스트할 수 있게 여기에 둔다).
// 분자 좌표(Å) · 혼성 · σ/π 개수 · 오비탈 방향 · 고리 스트레인 · 비틀기 · 문제 만들기.
// 근거: PPT 2 · 3쪽(알케인 sp³ · 109.5°), PPT 3 · 1~2쪽(고리형 알케인 · 의자형/보트형),
//       PPT 4 · 3~4쪽(알켄 sp² · 자유 회전 없음 · 시스-트랜스), PPT 4 · 6쪽(σ · π), PPT 5 · 4쪽(알카인 sp).

export type Vec = [number, number, number];
export type El = 'C' | 'H';
export type Hyb = 'sp3' | 'sp2' | 'sp';
export interface Atom { el: El; p: Vec }
export interface Bond { a: number; b: number; order: 1 | 2 | 3 }
export type MolKind = 'alkane' | 'alkene' | 'alkyne' | 'ring';
export interface Molecule {
  id: string; name: string; kind: MolKind;
  atoms: Atom[]; bonds: Bond[];
  /** 고리 원자(순서대로). 고리 스트레인을 그릴 때 쓴다. */
  ring?: number[];
  /** 보트형에서 서로 밀어내는 위쪽 두 H. */
  flagpole?: [number, number];
  /** 시스-트랜스를 볼 이중 결합과 양쪽 사슬 탄소: [사슬 탄소, 이중 결합 탄소, 이중 결합 탄소, 사슬 탄소]. */
  stereo?: [number, number, number, number];
  /** C=C나 C–C를 축으로 돌려 볼 결합. */
  axis?: [number, number];
}

// ── 벡터 ───────────────────────────────────────────────────────────────
export const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const scale = (a: Vec, k: number): Vec => [a[0] * k, a[1] * k, a[2] * k];
export const dot = (a: Vec, b: Vec) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const cross = (a: Vec, b: Vec): Vec => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const len = (a: Vec) => Math.hypot(a[0], a[1], a[2]);
export const unit = (a: Vec): Vec => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const rad = (deg: number) => deg * Math.PI / 180;
const deg = (r: number) => r * 180 / Math.PI;
/** 두 방향 사이의 각(°). */
export const angleBetween = (a: Vec, b: Vec) => deg(Math.acos(Math.max(-1, Math.min(1, dot(unit(a), unit(b))))));
/** 축 k(단위 벡터)를 중심으로 v를 θ만큼 돌린다(로드리게스). */
export function rotate(v: Vec, k: Vec, theta: number): Vec {
  const c = Math.cos(theta), s = Math.sin(theta);
  return add(add(scale(v, c), scale(cross(k, v), s)), scale(k, dot(k, v) * (1 - c)));
}
/** u에 수직인 두 단위 벡터. ref를 주면 e1이 ref 쪽을 향한다. */
export function perpBasis(u: Vec, ref?: Vec): [Vec, Vec] {
  const tries: Vec[] = [...(ref ? [ref] : []), [0, 0, 1], [0, 1, 0], [1, 0, 0]];
  for (const r of tries) {
    const e = sub(r, scale(u, dot(r, u)));
    if (len(e) > 1e-6) { const e1 = unit(e); return [e1, cross(u, e1)]; }
  }
  return [[0, 1, 0], [0, 0, 1]];
}
/** u와 θ(°)를 이루고, u 둘레로 φ(°) 돈 방향. */
export function dirAt(u: Vec, theta: number, phi: number, ref?: Vec): Vec {
  const [e1, e2] = perpBasis(u, ref);
  const side = add(scale(e1, Math.cos(rad(phi))), scale(e2, Math.sin(rad(phi))));
  return unit(add(scale(u, Math.cos(rad(theta))), scale(side, Math.sin(rad(theta)))));
}

// ── 분자 만들기 ─────────────────────────────────────────────────────────
export const TETRA = deg(Math.acos(-1 / 3)); // 109.47°
const CH = 1.09, CH_SP = 1.06, CC = 1.53, C_EQ_C = 1.34, C_TR_C = 1.20, C_SP2 = 1.50, C_SP = 1.46;

class Builder {
  atoms: Atom[] = []; bonds: Bond[] = [];
  add(el: El, p: Vec) { this.atoms.push({ el, p }); return this.atoms.length - 1; }
  bond(a: number, b: number, order: 1 | 2 | 3 = 1) { this.bonds.push({ a, b, order }); }
  /** center에서 toward 쪽 축과 θ, 그 둘레 φ 방향으로 원자를 붙인다. */
  attach(center: number, el: El, toward: number, theta: number, phi: number, length: number, ref?: Vec, order: 1 | 2 | 3 = 1) {
    const c = this.atoms[center].p;
    const u = unit(sub(this.atoms[toward].p, c));
    const i = this.add(el, add(c, scale(dirAt(u, theta, phi, ref), length)));
    this.bond(center, i, order);
    return i;
  }
  methyl(center: number, toward: number, phase = 0, ref: Vec = [0, 0, 1]) {
    for (const k of [0, 120, 240]) this.attach(center, 'H', toward, TETRA, phase + k, CH, ref);
  }
  /** 고리 탄소의 H 두 개: C–C–C 평면에 수직인 면에서 이등분선 양쪽으로. */
  ringH(i: number, prev: number, next: number) {
    const c = this.atoms[i].p;
    const n1 = unit(sub(this.atoms[prev].p, c)), n2 = unit(sub(this.atoms[next].p, c));
    const bis = unit(scale(add(n1, n2), -1)), nrm = unit(cross(n1, n2));
    const half = rad(TETRA / 2);
    for (const s of [1, -1]) {
      const h = this.add('H', add(c, scale(unit(add(scale(bis, Math.cos(half)), scale(nrm, s * Math.sin(half)))), CH)));
      this.bond(i, h);
    }
  }
  ring(points: Vec[]) {
    const idx = points.map(p => this.add('C', p));
    idx.forEach((a, k) => this.bond(a, idx[(k + 1) % idx.length]));
    idx.forEach((a, k) => this.ringH(a, idx[(k + idx.length - 1) % idx.length], idx[(k + 1) % idx.length]));
    return idx;
  }
  done(m: Omit<Molecule, 'atoms' | 'bonds'>): Molecule { return { ...m, atoms: this.atoms, bonds: this.bonds }; }
}

const Y: Vec = [0, 1, 0], Z: Vec = [0, 0, 1];

function methane() {
  const b = new Builder();
  const c = b.add('C', [0, 0, 0]);
  for (const d of [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]] as Vec[]) b.bond(c, b.add('H', scale(unit(d), CH)));
  return b.done({ id: 'methane', name: '메테인', kind: 'alkane' });
}
function ethane() {
  const b = new Builder();
  const c0 = b.add('C', [0, 0, 0]), c1 = b.add('C', [CC, 0, 0]);
  b.bond(c0, c1); b.methyl(c0, c1, 0); b.methyl(c1, c0, 60); // 엇갈린 모양
  return b.done({ id: 'ethane', name: '에테인', kind: 'alkane', axis: [c0, c1] });
}
function ethene() {
  const b = new Builder();
  const c0 = b.add('C', [0, 0, 0]), c1 = b.add('C', [C_EQ_C, 0, 0]);
  b.bond(c0, c1, 2);
  for (const c of [c0, c1]) for (const phi of [0, 180]) b.attach(c, 'H', c === c0 ? c1 : c0, 120, phi, CH, Y);
  return b.done({ id: 'ethene', name: '에텐', kind: 'alkene', axis: [c0, c1] });
}
function ethyne() {
  const b = new Builder();
  const c0 = b.add('C', [0, 0, 0]), c1 = b.add('C', [C_TR_C, 0, 0]);
  b.bond(c0, c1, 3);
  b.bond(c0, b.add('H', [-CH_SP, 0, 0])); b.bond(c1, b.add('H', [C_TR_C + CH_SP, 0, 0]));
  return b.done({ id: 'ethyne', name: '에타인', kind: 'alkyne' });
}
function propene() {
  const b = new Builder();
  const c0 = b.add('C', [0, 0, 0]), c1 = b.add('C', [C_EQ_C, 0, 0]);
  b.bond(c0, c1, 2);
  for (const phi of [0, 180]) b.attach(c0, 'H', c1, 120, phi, CH, Y);
  const c2 = b.attach(c1, 'C', c0, 120, 0, C_SP2, Y);
  b.attach(c1, 'H', c0, 120, 180, CH, Y);
  b.methyl(c2, c1, 90);
  return b.done({ id: 'propene', name: '프로펜', kind: 'alkene', axis: [c0, c1] });
}
function butene1() {
  const b = new Builder();
  const c0 = b.add('C', [0, 0, 0]), c1 = b.add('C', [C_EQ_C, 0, 0]);
  b.bond(c0, c1, 2);
  for (const phi of [0, 180]) b.attach(c0, 'H', c1, 120, phi, CH, Y);
  const c2 = b.attach(c1, 'C', c0, 120, 0, C_SP2, Y);
  b.attach(c1, 'H', c0, 120, 180, CH, Y);
  const c3 = b.attach(c2, 'C', c1, TETRA, 120, CC, Z);
  b.attach(c2, 'H', c1, TETRA, 0, CH, Z); b.attach(c2, 'H', c1, TETRA, 240, CH, Z);
  b.methyl(c3, c2, 60);
  return b.done({ id: 'butene1', name: '1-뷰텐', kind: 'alkene', axis: [c0, c1] });
}
/** 2-뷰텐(ethyl=false) · 2-펜텐(ethyl=true), 시스면 두 사슬 탄소가 이중 결합의 같은 쪽. */
function ene2(cis: boolean, ethyl: boolean) {
  const b = new Builder();
  const c0 = b.add('C', [0, 0, 0]), c1 = b.add('C', [C_EQ_C, 0, 0]);
  b.bond(c0, c1, 2);
  const m0 = b.attach(c0, 'C', c1, 120, 0, C_SP2, Y); b.attach(c0, 'H', c1, 120, 180, CH, Y);
  const m1 = b.attach(c1, 'C', c0, 120, cis ? 0 : 180, C_SP2, Y); b.attach(c1, 'H', c0, 120, cis ? 180 : 0, CH, Y);
  b.methyl(m0, c0, 90);
  if (ethyl) {
    const e = b.attach(m1, 'C', c1, TETRA, 90, CC, Z);
    b.attach(m1, 'H', c1, TETRA, 210, CH, Z); b.attach(m1, 'H', c1, TETRA, 330, CH, Z);
    b.methyl(e, m1, 30);
  } else b.methyl(m1, c1, 90);
  const name = `${cis ? '시스' : '트랜스'}-2-${ethyl ? '펜텐' : '뷰텐'}`;
  return b.done({ id: `${cis ? 'cis' : 'trans'}-2-${ethyl ? 'pentene' : 'butene'}`, name, kind: 'alkene', stereo: [m0, c0, c1, m1], axis: [c0, c1] });
}
function propyne() {
  const b = new Builder();
  const c0 = b.add('C', [0, 0, 0]), c1 = b.add('C', [C_TR_C, 0, 0]), c2 = b.add('C', [C_TR_C + C_SP, 0, 0]);
  b.bond(c0, c1, 3); b.bond(c1, c2);
  b.bond(c0, b.add('H', [-CH_SP, 0, 0]));
  b.methyl(c2, c1, 0);
  return b.done({ id: 'propyne', name: '프로파인', kind: 'alkyne' });
}
function cyclopropane() {
  const r = CC / Math.sqrt(3);
  const b = new Builder();
  const ring = b.ring([0, 1, 2].map(k => [r * Math.cos(rad(90 + 120 * k)), r * Math.sin(rad(90 + 120 * k)), 0] as Vec));
  return b.done({ id: 'cyclopropane', name: '사이클로프로페인', kind: 'ring', ring });
}
/** 주름진 사각형: 네 결합각이 모두 88°(PPT 3 · 2쪽). */
function cyclobutane() {
  const c = Math.cos(rad(88));
  const z = Math.sqrt(c * CC * CC / 4), a = Math.sqrt((CC * CC - 4 * z * z) / 2);
  const b = new Builder();
  const ring = b.ring([[a, 0, z], [0, a, -z], [-a, 0, z], [0, -a, -z]]);
  return b.done({ id: 'cyclobutane', name: '사이클로뷰테인', kind: 'ring', ring });
}
/** 봉투 모양: 정오각형에서 한 탄소를 25° 접어 올린다. */
function cyclopentane() {
  const R = CC / (2 * Math.sin(rad(36)));
  const pts = [0, 1, 2, 3, 4].map(k => [R * Math.cos(rad(90 + 72 * k)), R * Math.sin(rad(90 + 72 * k)), 0] as Vec);
  const hinge = unit(sub(pts[4], pts[1]));
  pts[0] = add(pts[1], rotate(sub(pts[0], pts[1]), hinge, rad(-25)));
  const b = new Builder();
  const ring = b.ring(pts);
  return b.done({ id: 'cyclopentane', name: '사이클로펜테인', kind: 'ring', ring });
}
/** 의자형: 탄소가 번갈아 위아래(±h), 결합각 111.4°. cosθ = −1/2 + 6h²/L². */
function chair() {
  const h = CC * Math.sqrt((Math.cos(rad(111.4)) + 0.5) / 6), r = Math.sqrt(CC * CC - 4 * h * h);
  const b = new Builder();
  const ring = b.ring([0, 1, 2, 3, 4, 5].map(k => [r * Math.cos(rad(60 * k)), r * Math.sin(rad(60 * k)), k % 2 ? -h : h] as Vec));
  return b.done({ id: 'chair', name: '사이클로헥세인(의자형)', kind: 'ring', ring });
}
/** 보트형: C2 · C3 · C5 · C6이 한 평면, C1 · C4가 같은 쪽(위)으로 들림. 모든 결합각 109.5°. */
function boat() {
  const p = CC / 2, u = -CC * Math.cos(rad(TETRA));
  const qh = CC * CC - u * u, diff = CC * CC * Math.cos(rad(TETRA)) - u * u; // h² − q² = diff
  const h = Math.sqrt((qh + diff) / 2), q = Math.sqrt((qh - diff) / 2);
  const b = new Builder();
  // 고리 순서: C1(왼쪽 위) → C2 → C3 → C4(오른쪽 위) → C5 → C6
  const ring = b.ring([[-p - u, 0, h], [-p, q, 0], [p, q, 0], [p + u, 0, h], [p, -q, 0], [-p, -q, 0]]);
  // 들린 두 탄소(C1, C4)의 H 가운데 서로 가까운 쪽이 깃대 H.
  const hOf = (c: number) => b.bonds.filter(x => x.a === c && b.atoms[x.b].el === 'H').map(x => x.b);
  let best: [number, number] = [0, 0], dist = Infinity;
  for (const x of hOf(ring[0])) for (const y of hOf(ring[3])) { const d = len(sub(b.atoms[x].p, b.atoms[y].p)); if (d < dist) { dist = d; best = [x, y]; } }
  return b.done({ id: 'boat', name: '사이클로헥세인(보트형)', kind: 'ring', ring, flagpole: best });
}

const FACTORIES: Record<string, () => Molecule> = {
  methane, ethane, ethene, ethyne, propene, butene1, propyne,
  'cis-2-butene': () => ene2(true, false), 'trans-2-butene': () => ene2(false, false),
  'cis-2-pentene': () => ene2(true, true), 'trans-2-pentene': () => ene2(false, true),
  cyclopropane, cyclobutane, cyclopentane, chair, boat,
};
export type MolId = keyof typeof FACTORIES;
export const MOLECULE_IDS = Object.keys(FACTORIES);
const cache = new Map<string, Molecule>();
export function molecule(id: string): Molecule {
  const make = FACTORIES[id];
  if (!make) throw new Error(`unknown molecule ${id}`);
  if (!cache.has(id)) cache.set(id, make());
  return cache.get(id)!;
}

// ── 분자 읽기 ───────────────────────────────────────────────────────────
export const neighbors = (m: Molecule, i: number) => m.bonds.filter(b => b.a === i || b.b === i).map(b => ({ atom: b.a === i ? b.b : b.a, order: b.order }));
export function hybOf(m: Molecule, i: number): Hyb | null {
  if (m.atoms[i].el !== 'C') return null;
  const max = Math.max(...neighbors(m, i).map(n => n.order));
  return max === 3 ? 'sp' : max === 2 ? 'sp2' : 'sp3';
}
export function formula(m: Molecule) {
  const sup = (n: number) => n === 1 ? '' : String(n).replace(/\d/g, d => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]);
  const c = m.atoms.filter(a => a.el === 'C').length, h = m.atoms.filter(a => a.el === 'H').length;
  return `C${sup(c)}H${sup(h)}`;
}
/** σ는 결합마다 하나, π는 이중 결합에 하나 · 삼중 결합에 둘. */
export function bondCounts(m: Molecule) {
  const sigma = m.bonds.length, pi = m.bonds.reduce((s, b) => s + b.order - 1, 0);
  const cc = m.bonds.filter(b => m.atoms[b.a].el === 'C' && m.atoms[b.b].el === 'C').length;
  return { sigma, pi, cc, ch: sigma - cc };
}
/** center에서 본 a–center–b 각(°). */
export const angleAt = (m: Molecule, center: number, a: number, b: number) => angleBetween(sub(m.atoms[a].p, m.atoms[center].p), sub(m.atoms[b].p, m.atoms[center].p));
/** 탄소 하나 둘레의 결합각들(같은 각은 한 번). */
export function anglesAround(m: Molecule, i: number) {
  const nb = neighbors(m, i).map(n => n.atom);
  const list: { a: number; b: number; angle: number }[] = [];
  for (let x = 0; x < nb.length; x++) for (let y = x + 1; y < nb.length; y++) list.push({ a: nb[x], b: nb[y], angle: angleAt(m, i, nb[x], nb[y]) });
  return list;
}
export const ringAngle = (m: Molecule) => {
  const r = m.ring!;
  return r.reduce((s, c, k) => s + angleAt(m, c, r[(k + r.length - 1) % r.length], r[(k + 1) % r.length]), 0) / r.length;
};

/** 혼성 오비탈과 남는 p 오비탈의 방향. strain이면 고리 C–C 쪽 sp³ 오비탈을 정사면체 각(109.5°)으로 벌린다. */
export interface OrbitalSet { center: number; hyb: Hyb; lobes: { dir: Vec; toward: number; bent: number }[]; p: Vec[] }
export function orbitalsOf(m: Molecule, i: number, strain = false): OrbitalSet | null {
  const hyb = hybOf(m, i);
  if (!hyb) return null;
  const c = m.atoms[i].p;
  const nb = neighbors(m, i);
  const dirs = nb.map(n => unit(sub(m.atoms[n.atom].p, c)));
  const lobes = nb.map((n, k) => ({ dir: dirs[k], toward: n.atom, bent: 0 }));
  if (strain && hyb === 'sp3' && m.ring?.includes(i)) {
    const r = m.ring, k = r.indexOf(i);
    const prev = r[(k + r.length - 1) % r.length], next = r[(k + 1) % r.length];
    const n1 = unit(sub(m.atoms[prev].p, c)), n2 = unit(sub(m.atoms[next].p, c));
    const bis = unit(add(n1, n2)), e = unit(sub(n1, n2)), half = rad(TETRA / 2);
    for (const lobe of lobes) {
      if (lobe.toward !== prev && lobe.toward !== next) continue;
      const s = lobe.toward === prev ? 1 : -1;
      const ideal = unit(add(scale(bis, Math.cos(half)), scale(e, s * Math.sin(half))));
      lobe.bent = angleBetween(ideal, lobe.dir);
      lobe.dir = ideal;
    }
  }
  let p: Vec[] = [];
  if (hyb === 'sp2') {
    const n = cross(dirs[0], dirs[1]);
    p = [unit(len(n) > 1e-6 ? n : perpBasis(dirs[0])[0])];
  } else if (hyb === 'sp') {
    p = perpBasis(dirs[0], Z);
  }
  return { center: i, hyb, lobes, p };
}

/** 고리 C–C 결합에서 sp³ 오비탈이 C–C 축에서 벗어난 각(°): (109.5° − 결합각)/2, 0보다 작으면 0. */
export const bentAngle = (ringAngleDeg: number) => Math.max(0, (TETRA - ringAngleDeg) / 2);

/** a–b 결합을 축으로 b 쪽 조각을 θ(°) 돌린 새 분자. */
export function twist(m: Molecule, a: number, b: number, theta: number): Molecule {
  const side = new Set([b]), stack = [b];
  while (stack.length) {
    const x = stack.pop()!;
    for (const n of neighbors(m, x)) if (!(x === b && n.atom === a) && !side.has(n.atom)) { side.add(n.atom); stack.push(n.atom); }
  }
  if (side.has(a)) return m; // 고리 안의 결합은 못 돌린다
  const origin = m.atoms[b].p, k = unit(sub(m.atoms[b].p, m.atoms[a].p));
  return { ...m, atoms: m.atoms.map((at, i) => side.has(i) ? { ...at, p: add(origin, rotate(sub(at.p, origin), k, rad(theta))) } : at) };
}
/** 이중 결합 양쪽 p 오비탈이 나란한 정도 |cos| (1 = 나란함, 0 = 수직). */
export function piAlignment(m: Molecule, a: number, b: number) {
  const pa = orbitalsOf(m, a)?.p[0], pb = orbitalsOf(m, b)?.p[0];
  return pa && pb ? Math.abs(dot(pa, pb)) : 0;
}
/** 네 원자 a–b–c–d의 이면각(°, −180~180). */
export function dihedral(m: Molecule, a: number, b: number, c: number, d: number) {
  const [p0, p1, p2, p3] = [a, b, c, d].map(i => m.atoms[i].p);
  const b0 = sub(p0, p1), b1 = unit(sub(p2, p1)), b2 = sub(p3, p2);
  const v = sub(b0, scale(b1, dot(b0, b1))), w = sub(b2, scale(b1, dot(b2, b1)));
  return deg(Math.atan2(dot(cross(b1, v), w), dot(v, w)));
}
/** 지금 모양이 시스인지 트랜스인지(사슬 탄소 이면각으로). 거의 수직이면 null. */
export function stereoOf(m: Molecule): 'cis' | 'trans' | null {
  if (!m.stereo) return null;
  const d = Math.abs(dihedral(m, ...m.stereo));
  return d < 60 ? 'cis' : d > 120 ? 'trans' : null;
}

// ── 문제 만들기 ─────────────────────────────────────────────────────────
export type QuizKind = 'hyb' | 'count' | 'cistrans' | 'ring' | 'chair' | 'twist';
export const QUIZ_KINDS: QuizKind[] = ['hyb', 'count', 'cistrans', 'ring', 'chair', 'twist'];
export type SceneMode = 'ball' | 'p' | 'orbital';
export interface OrbitalQuestion {
  kind: QuizKind; mol: Molecule; ask: string;
  choices: string[]; answer: string; explain: string[]; source: string;
  /** 문제 그림: 원자 모형만 · p 오비탈만 · 오비탈 전부, 빛나는 원자, 처음 보는 방향(라디안). */
  mode: SceneMode; highlight?: number; view: [number, number];
}
export const HYB_TEXT: Record<Hyb, string> = { sp3: 'sp³', sp2: 'sp²', sp: 'sp' };
const HYB_LABEL: Record<Hyb, string> = { sp3: 'sp³ · 109.5°', sp2: 'sp² · 120°', sp: 'sp · 180°' };
const HYB_WRONG_ANGLE: Record<Hyb, string> = { sp3: 'sp³ · 120°', sp2: 'sp² · 109.5°', sp: 'sp · 120°' };
export const HYB_SOURCE: Record<Hyb, string> = { sp3: 'PPT 2 · 3쪽', sp2: 'PPT 4 · 3쪽', sp: 'PPT 5 · 4쪽' };
const TWIST_CHOICES = ['σ · π 둘 다 있음', 'σ만 남음(π 끊김)', 'π만 남음(σ 끊김)', 'σ · π 둘 다 끊김'];
const RING_PROP = { strained: '겹침이 비뚤어 반응성 큼', stable: '정면으로 겹쳐 매우 안정' };
const RING_IDS = ['cyclopropane', 'cyclobutane', 'cyclopentane', 'chair'];
const RING_NAME: Record<string, string> = { cyclopropane: '사이클로프로페인', cyclobutane: '사이클로뷰테인', cyclopentane: '사이클로펜테인', chair: '사이클로헥세인' };
const CHAIN_IDS = ['ethane', 'ethene', 'ethyne', 'propene', 'butene1', 'propyne', 'cis-2-butene', 'trans-2-butene', 'cis-2-pentene', 'trans-2-pentene'];

type Rng = () => number;
const pick = <T,>(list: readonly T[], rng: Rng) => list[Math.floor(rng() * list.length) % list.length];
function shuffle<T>(list: T[], rng: Rng) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const randomView = (rng: Rng): [number, number] => [(rng() - 0.5) * 1.6, rng() * Math.PI * 2];
const fmt = (n: number) => `${Math.round(n * 10) / 10}°`.replace('.0°', '°');
const countLabel = (s: number, p: number) => `σ ${s}개 · π ${p}개`;

function hybQuestion(rng: Rng): OrbitalQuestion {
  const mol = molecule(pick(CHAIN_IDS, rng));
  const carbons = mol.atoms.map((a, i) => i).filter(i => mol.atoms[i].el === 'C');
  // 같은 분자 안에 여러 혼성이 있으면 고르게 나오도록 혼성부터 고른다.
  const kinds = [...new Set(carbons.map(i => hybOf(mol, i)!))];
  const want = pick(kinds, rng);
  const atom = pick(carbons.filter(i => hybOf(mol, i) === want), rng);
  const hyb = hybOf(mol, atom)!;
  const answer = HYB_LABEL[hyb];
  const choices = shuffle([answer, ...(['sp3', 'sp2', 'sp'] as Hyb[]).filter(h => h !== hyb).map(h => HYB_LABEL[h]), HYB_WRONG_ANGLE[hyb]], rng);
  const bonds = neighbors(mol, atom);
  const bondText = hyb === 'sp' ? '삼중 결합이 있어' : hyb === 'sp2' ? '이중 결합이 있어' : '단일 결합만 있어';
  const measured = anglesAround(mol, atom).map(a => a.angle);
  return {
    kind: 'hyb', mol, highlight: atom, mode: 'ball', view: randomView(rng),
    ask: `${mol.name}에서 빛나는 탄소의 혼성 오비탈과 그 둘레 결합각은?`,
    choices, answer, source: HYB_SOURCE[hyb],
    explain: [
      `빛나는 탄소는 원자 ${bonds.length}개와 결합하고 ${bondText} ${HYB_TEXT[hyb]} 혼성이에요.`,
      hyb === 'sp3' ? 'sp³ 혼성 오비탈 4개가 정사면체로 퍼져 결합각은 109.5°예요.'
        : hyb === 'sp2' ? 'sp² 혼성 오비탈 3개가 평면 삼각형으로 퍼져 결합각은 120°예요. 남는 p 오비탈 1개가 π 결합을 만들어요.'
          : 'sp 혼성 오비탈 2개가 일직선이라 결합각은 180°예요. 남는 p 오비탈 2개가 π 결합 2개를 만들어요.',
      `이 모형에서 잰 각: ${[...new Set(measured.map(fmt))].join(', ')}`,
    ],
  };
}

function countQuestion(rng: Rng): OrbitalQuestion {
  const mol = molecule(pick([...CHAIN_IDS, 'methane', 'cyclopropane', 'cyclobutane', 'chair'], rng));
  const { sigma, pi, cc, ch } = bondCounts(mol);
  const answer = countLabel(sigma, pi);
  const pool: [number, number][] = pi > 0
    ? [[sigma + pi, 0], [sigma - (pi > 1 ? 2 : 1), pi * 2], [cc + pi, pi], [sigma, pi + 1], [sigma + pi, pi]]
    : [[cc, 0], [sigma, 1], [sigma + 1, 0], [sigma - 1, 0], [cc, 1]];
  const wrong = [...new Set(pool.filter(([s, p]) => s > 0 && p >= 0 && !(s === sigma && p === pi)).map(([s, p]) => countLabel(s, p)))];
  const choices = shuffle([answer, ...wrong.slice(0, 3)], rng);
  const doubles = mol.bonds.filter(b => b.order === 2).length, triples = mol.bonds.filter(b => b.order === 3).length;
  return {
    kind: 'count', mol, mode: 'ball', view: randomView(rng),
    ask: `${mol.name}(${formula(mol)}) 분자 전체의 σ 결합과 π 결합 수는?`,
    choices, answer, source: 'PPT 4 · 6쪽',
    explain: [
      `원자 사이 결합 하나에는 σ 결합이 꼭 하나: C–C ${cc}개 + C–H ${ch}개 = σ ${sigma}개예요.`,
      pi === 0 ? '이중 · 삼중 결합이 없어서 π 결합은 0개예요.'
        : `${doubles ? `이중 결합 ${doubles}개는 σ 1 + π 1` : ''}${doubles && triples ? ', ' : ''}${triples ? `삼중 결합 ${triples}개는 σ 1 + π 2` : ''} → π ${pi}개예요.`,
      '이중 결합을 σ 2개로 세거나, C–H 결합을 빼먹는 실수가 많아요.',
    ],
  };
}

function cistransQuestion(rng: Rng): OrbitalQuestion {
  const id = pick(['cis-2-butene', 'trans-2-butene', 'cis-2-pentene', 'trans-2-pentene'], rng);
  const mol = molecule(id);
  const pentene = id.includes('pentene'), cis = id.startsWith('cis');
  return {
    kind: 'cistrans', mol, mode: 'ball', view: randomView(rng),
    ask: '돌려 보며 판단해 보세요. 이 분자의 이름은?',
    choices: shuffle(['시스-2-뷰텐', '트랜스-2-뷰텐', '시스-2-펜텐', '트랜스-2-펜텐'], rng), answer: mol.name, source: 'PPT 4 · 3~4쪽',
    explain: [
      `탄소가 ${pentene ? '5' : '4'}개이고 2번 탄소에서 이중 결합이 시작해 ${pentene ? '2-펜텐' : '2-뷰텐'}이에요.`,
      `이중 결합 양쪽 탄소에 붙은 사슬(${pentene ? 'CH₃와 C₂H₅' : 'CH₃와 CH₃'})이 ${cis ? '같은 쪽 → 시스' : '서로 다른 쪽 → 트랜스'}예요.`,
      'C=C는 실온에서 자유 회전을 못 해서 시스와 트랜스가 서로 바뀌지 않아요.',
    ],
  };
}

function ringQuestion(rng: Rng): OrbitalQuestion {
  const id = pick(RING_IDS, rng);
  const mol = molecule(id);
  const strained = id === 'cyclopropane' || id === 'cyclobutane';
  const trueProp = strained ? RING_PROP.strained : RING_PROP.stable, otherProp = strained ? RING_PROP.stable : RING_PROP.strained;
  const other = RING_NAME[pick(RING_IDS.filter(x => x !== id), rng)];
  const answer = `${RING_NAME[id]} · ${trueProp}`;
  const angle = ringAngle(mol), bent = bentAngle(angle);
  return {
    kind: 'ring', mol, mode: 'ball', view: randomView(rng),
    ask: '이 고리형 알케인의 이름과 성질로 옳은 것은?',
    choices: shuffle([answer, `${RING_NAME[id]} · ${otherProp}`, `${other} · ${trueProp}`, `${other} · ${otherProp}`], rng), answer, source: 'PPT 3 · 1~2쪽',
    explain: [
      `탄소 ${mol.ring!.length}개 고리 → ${RING_NAME[id]}, 고리 결합각은 약 ${fmt(angle)}예요.`,
      strained
        ? `sp³ 오비탈끼리는 109.5°로 벌어지려 해서, C–C 축에서 약 ${fmt(bent)} 비껴 겹쳐요. 정면으로 효율적으로 못 겹치니 결합이 약하고 반응성이 커요.`
        : '정사면체 결합각에 아주 가까워 sp³ 오비탈이 정면에서 효율적으로 겹쳐요. 그래서 아주 강한 C–C 결합을 이루고 매우 안정해요.',
    ],
  };
}

function chairQuestion(rng: Rng): OrbitalQuestion {
  const isBoat = rng() < 0.5;
  const mol = molecule(isBoat ? 'boat' : 'chair');
  const answer = isBoat ? '보트형 · 위쪽 두 H가 반발' : '의자형 · 더 안정';
  return {
    kind: 'chair', mol, mode: 'ball', view: randomView(rng),
    ask: '돌려 보며 판단해 보세요. 이 사이클로헥세인의 형태와 설명으로 옳은 것은?',
    choices: shuffle(['의자형 · 더 안정', '보트형 · 더 안정', '의자형 · 위쪽 두 H가 반발', '보트형 · 위쪽 두 H가 반발'], rng), answer, source: 'PPT 3 · 2쪽',
    explain: [
      isBoat ? '양 끝 두 탄소가 같은 쪽으로 들려 배 모양이에요(보트형).' : '탄소가 번갈아 위아래로 주름진 모양이에요(의자형).',
      isBoat ? `보트형은 위쪽 두 수소가 약 ${(len(sub(mol.atoms[mol.flagpole![0]].p, mol.atoms[mol.flagpole![1]].p))).toFixed(1)} Å로 가까워 반발력이 커요.` : '의자형에는 서로 부딪히는 수소가 없어서 보트형보다 안정해요.',
      '25℃에서 사이클로헥세인은 99% 이상 의자형으로 존재해요.',
    ],
  };
}

function twistQuestion(rng: Rng): OrbitalQuestion {
  const base = molecule(pick(['ethene', 'cis-2-butene'], rng));
  const theta = pick([0, 90, 90, 180], rng);
  const [a, b] = base.axis!;
  const mol = theta ? twist(base, a, b, theta) : base;
  const align = piAlignment(mol, a, b);
  const broken = align < 0.2;
  const answer = broken ? TWIST_CHOICES[1] : TWIST_CHOICES[0];
  const turned = stereoOf(mol);
  return {
    kind: 'twist', mol, mode: 'p', view: randomView(rng),
    ask: `${base.name}의 C=C를 축으로 한쪽을 ${theta}° 돌린 모습이에요. 지금 두 탄소 사이에 남은 결합은?`,
    choices: shuffle(TWIST_CHOICES, rng), answer, source: 'PPT 4 · 3 · 6쪽',
    explain: [
      'σ 결합은 C–C 축을 따라 정면으로 겹쳐서 돌려도 겹침이 그대로예요.',
      broken ? '두 p 오비탈이 수직이 되어 측면으로 겹칠 수 없어요 → π 결합이 끊어져요.'
        : `두 p 오비탈이 다시 나란해서 측면으로 겹쳐요 → π 결합이 있어요.${theta === 180 && turned ? ` (돌린 결과 ${turned === 'trans' ? '트랜스' : '시스'} 모양)` : ''}`,
      'π 결합을 끊어야만 돌 수 있으니 C=C는 실온에서 자유 회전을 못 해요.',
    ],
  };
}

const MAKERS: Record<QuizKind, (rng: Rng) => OrbitalQuestion> = {
  hyb: hybQuestion, count: countQuestion, cistrans: cistransQuestion, ring: ringQuestion, chair: chairQuestion, twist: twistQuestion,
};
/** 문제 하나. 직전과 같은 유형은 피한다. */
export function makeQuestion(rng: Rng = Math.random, previous?: QuizKind, kinds: QuizKind[] = QUIZ_KINDS): OrbitalQuestion {
  const pool = kinds.length > 1 ? kinds.filter(k => k !== previous) : kinds;
  return MAKERS[pick(pool, rng)](rng);
}
