// 주민지T 「Ⅲ. 탄소 화합물과 반응」 구조식 실습의 화학 로직.
// 분자 = 골격 구조식(탄소와 OH · Cl · Br, H는 그리지 않는다)의 그래프. 이름 붙이기는 PPT 규칙을 그대로 따른다:
//   가장 긴 사슬(OH가 붙은 탄소 · 이중/삼중 결합을 반드시 포함) → 치환기가 많은 사슬 → OH · 다중 결합 · 치환기 순으로 번호가 작게
//   → 치환기는 알파벳 순서(di/tri, sec-/tert-는 무시), 같은 치환기는 다이 · 트라이. 고리는 사이클로-, 고리형 알켄은 이중 결합이 1 · 2번.
//   알켄은 이중 결합의 같은 쪽에 사슬이 있으면 시스, 반대쪽이면 트랜스(그린 모양에서 읽는다).
// 치환기는 표 22.2(메틸 · 에틸 · 프로필 · 아이소프로필 · 뷰틸 · sec-뷰틸 · 아이소뷰틸 · tert-뷰틸)와 알코올 단원의 클로로 · 브로모.

export type El = 'C' | 'O' | 'Cl' | 'Br';
export type Order = 1 | 2 | 3;
export interface Atom { el: El; x: number; y: number }
export interface Bond { a: number; b: number; order: Order }
export interface Mol { atoms: Atom[]; bonds: Bond[] }
export type Category = 'alkane' | 'cyclo' | 'alkene' | 'alkyne' | 'alcohol';
export type Stereo = 'cis' | 'trans';

export const CATEGORY_LABEL: Record<Category, string> = { alkane: '알케인', cyclo: '고리형', alkene: '알켄', alkyne: '알카인', alcohol: '알코올' };

// ── 작은 SMILES(C · O · Cl · Br, 가지 (), 고리 번호, = #) ───────────────────────────
export function parseSmiles(smiles: string): Mol {
  const atoms: Atom[] = [];
  const bonds: Bond[] = [];
  const stack: number[] = [];
  const rings = new Map<string, { atom: number; order: Order }>();
  let prev = -1;
  let order: Order = 1;
  for (let i = 0; i < smiles.length; i += 1) {
    const ch = smiles[i];
    if (ch === '(') { stack.push(prev); continue; }
    if (ch === ')') { prev = stack.pop() ?? -1; continue; }
    if (ch === '=') { order = 2; continue; }
    if (ch === '#') { order = 3; continue; }
    if (/\d/.test(ch)) {
      const open = rings.get(ch);
      if (open) { bonds.push({ a: open.atom, b: prev, order: (order > 1 ? order : open.order) as Order }); rings.delete(ch); }
      else rings.set(ch, { atom: prev, order });
      order = 1;
      continue;
    }
    let el: El;
    if (smiles.startsWith('Cl', i)) { el = 'Cl'; i += 1; }
    else if (smiles.startsWith('Br', i)) { el = 'Br'; i += 1; }
    else if (ch === 'C' || ch === 'O') el = ch;
    else throw new Error(`smiles: ${smiles} @${i}`);
    atoms.push({ el, x: 0, y: 0 });
    const index = atoms.length - 1;
    if (prev >= 0) bonds.push({ a: prev, b: index, order });
    order = 1;
    prev = index;
  }
  if (rings.size || stack.length) throw new Error(`smiles: ${smiles} unclosed`);
  return { atoms, bonds };
}

// ── 그래프 도구 ─────────────────────────────────────────────────────────────
type Adj = { to: number; order: Order }[][];
export function adjacency(mol: Mol): Adj {
  const adj: Adj = mol.atoms.map(() => []);
  for (const b of mol.bonds) { adj[b.a].push({ to: b.b, order: b.order }); adj[b.b].push({ to: b.a, order: b.order }); }
  return adj;
}
const bondOrder = (adj: Adj, a: number, b: number) => adj[a].find(n => n.to === b)?.order ?? 0;
const valence = (adj: Adj, a: number) => adj[a].reduce((sum, n) => sum + n.order, 0);
const carbonNeighbors = (mol: Mol, adj: Adj, a: number) => adj[a].filter(n => mol.atoms[n.to].el === 'C').map(n => n.to);

function connected(mol: Mol, adj: Adj): boolean {
  if (!mol.atoms.length) return false;
  const seen = new Set([0]);
  const queue = [0];
  while (queue.length) { const a = queue.shift()!; for (const n of adj[a]) if (!seen.has(n.to)) { seen.add(n.to); queue.push(n.to); } }
  return seen.size === mol.atoms.length;
}

// ── 이름 ────────────────────────────────────────────────────────────────────
const ALKANE = ['', '메테인', '에테인', '프로페인', '뷰테인', '펜테인', '헥세인', '헵테인', '옥테인', '노네인', '데케인'];
const ALKENE = ['', '', '에텐', '프로펜', '뷰텐', '펜텐', '헥센', '헵텐', '옥텐', '노넨', '데센'];
const ALKYNE = ['', '', '에타인', '프로파인', '뷰타인', '펜타인', '헥사인', '헵타인', '옥타인', '노나인', '데카인'];
const ALCOHOL = ['', '메탄올', '에탄올', '프로판올', '뷰탄올', '펜탄올', '헥산올', '헵탄올', '옥탄올', '노난올', '데칸올'];
const MULTIPLIER = ['', '', '다이', '트라이', '테트라'];
export const MAX_CHAIN = 10;

interface Group { ko: string; key: string; size: number }
const GROUPS: Record<string, Group> = {
  methyl: { ko: '메틸', key: 'methyl', size: 1 }, ethyl: { ko: '에틸', key: 'ethyl', size: 2 },
  propyl: { ko: '프로필', key: 'propyl', size: 3 }, isopropyl: { ko: '아이소프로필', key: 'isopropyl', size: 3 },
  butyl: { ko: '뷰틸', key: 'butyl', size: 4 }, 'sec-butyl': { ko: 'sec-뷰틸', key: 'butyl', size: 4 },
  isobutyl: { ko: '아이소뷰틸', key: 'isobutyl', size: 4 }, 'tert-butyl': { ko: 'tert-뷰틸', key: 'butyl', size: 4 },
  chloro: { ko: '클로로', key: 'chloro', size: 0 }, bromo: { ko: '브로모', key: 'bromo', size: 0 },
};
export const SUBSTITUENT_NAMES = Object.values(GROUPS).map(g => g.ko);

/** 주사슬(고리)에서 뻗은 가지 하나가 무슨 치환기인지. 표에 없는 모양이면 null. */
function classify(mol: Mol, adj: Adj, attach: number, from: number): Group | null {
  const el = mol.atoms[attach].el;
  if (bondOrder(adj, attach, from) !== 1) return null;
  if (el === 'Cl') return adj[attach].length === 1 ? GROUPS.chloro : null;
  if (el === 'Br') return adj[attach].length === 1 ? GROUPS.bromo : null;
  if (el !== 'C') return null;
  const seen = new Set([from, attach]);
  const stack = [attach];
  const atoms: number[] = [];
  while (stack.length) {
    const a = stack.pop()!;
    atoms.push(a);
    for (const n of adj[a]) {
      if (n.to === from && a === attach) continue;
      if (n.to === from) return null; // a ring through the parent
      if (n.order !== 1 || mol.atoms[n.to].el !== 'C') return null;
      if (!seen.has(n.to)) { seen.add(n.to); stack.push(n.to); }
    }
  }
  const inside = (a: number) => adj[a].filter(n => n.to !== from && atoms.includes(n.to)).length;
  const deg = inside(attach);
  if (atoms.length === 1) return GROUPS.methyl;
  if (atoms.length === 2) return GROUPS.ethyl;
  if (atoms.length === 3) return deg === 1 ? GROUPS.propyl : GROUPS.isopropyl;
  if (atoms.length === 4) {
    const branched = atoms.some(a => inside(a) === 3);
    if (branched) return deg === 3 ? GROUPS['tert-butyl'] : deg === 1 ? GROUPS.isobutyl : null;
    return deg === 1 ? GROUPS.butyl : deg === 2 ? GROUPS['sec-butyl'] : null;
  }
  return null;
}

interface Sub { group: Group; locant: number }
export interface Plan {
  category: Category;
  ring: boolean;
  /** 주사슬(고리) 원자를 번호 순서대로. */
  parent: number[];
  subs: Sub[];
  oh?: number;
  multi?: { locant: number; order: 2 | 3 };
  stereo?: Stereo;
}
export type NameResult = { ok: true; name: string; plan: Plan } | { ok: false; reason: string };

const compareLists = (a: number[], b: number[]) => {
  for (let i = 0; i < Math.min(a.length, b.length); i += 1) if (a[i] !== b[i]) return a[i] - b[i];
  return a.length - b.length;
};
const sortedLocants = (subs: Sub[]) => subs.map(s => s.locant).sort((x, y) => x - y);
/** 알파벳 순서로 늘어놓았을 때의 번호(같은 번호 집합이면 알파벳이 앞선 치환기가 작은 번호를 받는다). */
const alphaLocants = (subs: Sub[]) => [...subs].sort((x, y) => x.group.key.localeCompare(y.group.key) || x.locant - y.locant).map(s => s.locant);

/** 이름 붙이기 순서대로 비교할 값(작을수록 좋다). */
function numberingKey(plan: Plan): number[][] {
  return [[plan.oh ?? 0], [plan.multi?.locant ?? 0], sortedLocants(plan.subs), alphaLocants(plan.subs)];
}
const compareKeys = (a: number[][], b: number[][]) => {
  for (let i = 0; i < a.length; i += 1) { const c = compareLists(a[i], b[i]); if (c) return c; }
  return 0;
};

function crossSide(o: Atom, a: Atom, p: Atom) {
  return (a.x - o.x) * (p.y - o.y) - (a.y - o.y) * (p.x - o.x);
}

/** 알켄의 시스 · 트랜스(사슬형, 이중 결합 탄소마다 탄소 치환기가 하나씩일 때). 'none'이면 붙이지 않는다. */
function alkeneStereo(mol: Mol, adj: Adj, a: number, b: number, groupOf: (atom: number, from: number) => Group | null): Stereo | 'none' | 'unknown' | 'unsupported' {
  const outA = carbonNeighbors(mol, adj, a).filter(x => x !== b);
  const outB = carbonNeighbors(mol, adj, b).filter(x => x !== a);
  if (adj[a].some(n => mol.atoms[n.to].el !== 'C') || adj[b].some(n => mol.atoms[n.to].el !== 'C')) return 'unsupported';
  if (!outA.length || !outB.length) return 'none';
  const same = (out: number[], from: number) => out.length === 2 && (() => { const g = out.map(x => groupOf(x, from)); return g[0] && g[1] && g[0].ko === g[1].ko; })();
  if (same(outA, a) || same(outB, b)) return 'none';
  if (outA.length !== 1 || outB.length !== 1) return 'unsupported';
  const A = mol.atoms[a], B = mol.atoms[b];
  const len = Math.hypot(B.x - A.x, B.y - A.y) || 1;
  const s1 = crossSide(A, B, mol.atoms[outA[0]]) / len, s2 = crossSide(A, B, mol.atoms[outB[0]]) / len;
  if (Math.abs(s1) < 0.15 || Math.abs(s2) < 0.15) return 'unknown';
  return Math.sign(s1) === Math.sign(s2) ? 'cis' : 'trans';
}

/** 구조 → 이름. PPT 범위 밖(고리 2개, 다이올, 에터 등)이면 이유와 함께 ok: false. */
export function nameOf(mol: Mol): NameResult {
  const fail = (reason: string): NameResult => ({ ok: false, reason });
  const plans = candidatePlans(mol);
  if ('reason' in plans) return fail(plans.reason);
  const best = plans.list[0];
  if (best.stereoState === 'unknown') return fail('시스인지 트랜스인지 보이게 이중 결합 양쪽 사슬을 꺾어 그려요.');
  if (best.stereoState === 'unsupported') return fail('이 알켄은 수업 범위 밖이에요(시스 · 트랜스로 구별할 수 없어요).');
  return { ok: true, name: render(best.plan), plan: best.plan };
}

type Candidate = { plan: Plan; stereoState?: Stereo | 'none' | 'unknown' | 'unsupported'; length: number; subCount: number };

function candidatePlans(mol: Mol): { list: Candidate[]; all: Candidate[] } | { reason: string } {
  const adj = adjacency(mol);
  const n = mol.atoms.length;
  if (!n) return { reason: '아직 아무것도 안 그렸어요.' };
  if (!connected(mol, adj)) return { reason: '떨어진 조각이 있어요. 한 분자로 이어 그려요.' };
  const carbons = mol.atoms.map((a, i) => (a.el === 'C' ? i : -1)).filter(i => i >= 0);
  if (!carbons.length) return { reason: '탄소가 없어요.' };
  for (let i = 0; i < n; i += 1) {
    const el = mol.atoms[i].el;
    if (el === 'C' && valence(adj, i) > 4) return { reason: '결합이 4개보다 많은 탄소가 있어요. 탄소는 결합을 4개까지 해요.' };
    if (el !== 'C' && (adj[i].length !== 1 || adj[i][0].order !== 1 || mol.atoms[adj[i][0].to].el !== 'C')) return { reason: `${el === 'O' ? 'OH' : el}는 탄소 하나에 단일 결합으로만 붙어요.` };
  }
  const oxygens = mol.atoms.filter(a => a.el === 'O').length;
  if (oxygens > 1) return { reason: 'OH가 2개 이상인 화합물은 수업 범위 밖이에요.' };
  const multis = mol.bonds.filter(b => b.order > 1);
  if (multis.length > 1) return { reason: '이중 · 삼중 결합은 하나만 넣어요(수업 범위).' };
  const carbonBonds = mol.bonds.filter(b => mol.atoms[b.a].el === 'C' && mol.atoms[b.b].el === 'C').length;
  const rings = carbonBonds - carbons.length + 1;
  if (rings > 1) return { reason: '고리가 2개 이상이면 수업 범위 밖이에요.' };
  const halogens = mol.atoms.filter(a => a.el === 'Cl' || a.el === 'Br').length;
  const multi = multis[0];
  if (multi && oxygens) return { reason: 'OH와 다중 결합이 함께 있는 화합물은 수업 범위 밖이에요.' };
  if (multi && halogens) return { reason: '할로젠과 다중 결합이 함께 있는 화합물은 수업 범위 밖이에요.' };
  const groupOf = (atom: number, from: number) => classify(mol, adj, atom, from);

  if (rings === 1) {
    if (oxygens || halogens) return { reason: '고리에 OH · 할로젠이 붙은 화합물은 수업 범위 밖이에요.' };
    // 가지를 잘라 내면 고리만 남는다.
    const deg = new Map(carbons.map(c => [c, carbonNeighbors(mol, adj, c).length]));
    const alive = new Set(carbons);
    let changed = true;
    while (changed) {
      changed = false;
      for (const c of [...alive]) if ((deg.get(c) ?? 0) <= 1) { alive.delete(c); for (const m of carbonNeighbors(mol, adj, c)) deg.set(m, (deg.get(m) ?? 0) - 1); changed = true; }
    }
    const ringAtoms = [...alive];
    const size = ringAtoms.length;
    if (size < 3 || size > 8) return { reason: '고리는 탄소 3~8개만 이름을 붙여요.' };
    const order: number[] = [ringAtoms[0]];
    while (order.length < size) {
      const last = order[order.length - 1];
      const next = carbonNeighbors(mol, adj, last).find(m => alive.has(m) && !order.includes(m));
      if (next === undefined) return { reason: '고리를 읽지 못했어요.' };
      order.push(next);
    }
    if (multi && multi.order === 3) return { reason: '고리 안 삼중 결합은 수업 범위 밖이에요.' };
    if (multi && !(alive.has(multi.a) && alive.has(multi.b))) return { reason: '고리 밖 가지의 이중 결합은 수업 범위 밖이에요.' };
    const branchOf = new Map<number, Group[]>();
    for (const r of order) for (const nb of adj[r]) if (!alive.has(nb.to)) {
      const g = groupOf(nb.to, r);
      if (!g) return { reason: '수업에서 배운 치환기(메틸 · 에틸 · 프로필 · 아이소프로필 · 뷰틸들)만 쓸 수 있어요.' };
      if (g.size >= size) return { reason: '가지가 고리보다 크면 수업 범위 밖이에요.' };
      branchOf.set(r, [...(branchOf.get(r) ?? []), g]);
    }
    const all: Candidate[] = [];
    for (let start = 0; start < size; start += 1) for (const dir of [1, -1]) {
      const parent = Array.from({ length: size }, (_, k) => order[(start + dir * k + size * 2) % size]);
      if (multi && bondOrder(adj, parent[0], parent[1]) !== 2) continue;
      const subs: Sub[] = [];
      parent.forEach((atom, k) => (branchOf.get(atom) ?? []).forEach(group => subs.push({ group, locant: k + 1 })));
      if (!multi && subs.length && !subs.some(s => s.locant === 1)) continue;
      all.push({ plan: { category: 'cyclo', ring: true, parent, subs, multi: multi ? { locant: 1, order: 2 } : undefined }, length: size, subCount: subs.length });
    }
    if (!all.length) return { reason: '고리 번호를 정하지 못했어요.' };
    const keys = new Set(all.flatMap(c => c.plan.subs.map(s => s.group.key)));
    const kos = new Set(all.flatMap(c => c.plan.subs.map(s => s.group.ko)));
    if (keys.size !== kos.size) return { reason: '뷰틸 종류 두 가지를 함께 쓰는 화합물은 수업 범위 밖이에요.' };
    const list = [...all].sort((x, y) => compareKeys(numberingKey(x.plan), numberingKey(y.plan)));
    return { list, all };
  }

  // 사슬: 탄소 골격은 나무 모양. 끝 탄소 두 개를 잇는 길이 후보 주사슬이다.
  const ohCarbon = mol.atoms.findIndex(a => a.el === 'O') >= 0 ? adj[mol.atoms.findIndex(a => a.el === 'O')][0].to : -1;
  const required = [ohCarbon, ...(multi ? [multi.a, multi.b] : [])].filter(a => a >= 0);
  const leaves = carbons.filter(c => carbonNeighbors(mol, adj, c).length <= 1);
  const pathBetween = (from: number, to: number): number[] => {
    const prev = new Map<number, number>([[from, -1]]);
    const queue = [from];
    while (queue.length) { const a = queue.shift()!; if (a === to) break; for (const m of carbonNeighbors(mol, adj, a)) if (!prev.has(m)) { prev.set(m, a); queue.push(m); } }
    const path: number[] = [];
    for (let a = to; a !== -1; a = prev.get(a)!) path.unshift(a);
    return path;
  };
  const paths: number[][] = [];
  for (const a of leaves) for (const b of leaves) if (a <= b) {
    const p = pathBetween(a, b);
    if (required.every(r => p.includes(r))) { paths.push(p); if (a !== b) paths.push([...p].reverse()); }
  }
  if (!paths.length) return { reason: '주사슬을 정하지 못했어요.' };
  const all: Candidate[] = [];
  for (const parent of paths) {
    if (parent.length > MAX_CHAIN) return { reason: '주사슬이 탄소 10개보다 길어요.' };
    const inChain = new Set(parent);
    const subs: Sub[] = [];
    let oh: number | undefined;
    let bad = false;
    parent.forEach((atom, k) => {
      for (const nb of adj[atom]) {
        if (inChain.has(nb.to)) continue;
        if (mol.atoms[nb.to].el === 'O') { oh = k + 1; continue; }
        const g = groupOf(nb.to, atom);
        if (!g) bad = true; else subs.push({ group: g, locant: k + 1 });
      }
    });
    if (bad) continue;
    let multiInfo: Plan['multi'];
    let stereoState: Candidate['stereoState'];
    if (multi) {
      const i = parent.indexOf(multi.a), j = parent.indexOf(multi.b);
      multiInfo = { locant: Math.min(i, j) + 1, order: multi.order as 2 | 3 };
      if (multi.order === 2) stereoState = alkeneStereo(mol, adj, multi.a, multi.b, groupOf);
    }
    const category: Category = oh ? 'alcohol' : multi ? (multi.order === 3 ? 'alkyne' : 'alkene') : 'alkane';
    const plan: Plan = { category, ring: false, parent, subs, oh, multi: multiInfo, stereo: stereoState === 'cis' || stereoState === 'trans' ? stereoState : undefined };
    all.push({ plan, stereoState, length: parent.length, subCount: subs.length });
  }
  if (!all.length) return { reason: '수업에서 배운 치환기(메틸 · 에틸 · 프로필 · 아이소프로필 · 뷰틸들 · 클로로 · 브로모)만 쓸 수 있어요.' };
  const maxLength = Math.max(...all.map(c => c.length));
  const longest = all.filter(c => c.length === maxLength);
  const maxSubs = Math.max(...longest.map(c => c.subCount));
  const list = longest.filter(c => c.subCount === maxSubs).sort((x, y) => compareKeys(numberingKey(x.plan), numberingKey(y.plan)));
  const best = list[0];
  const keys = new Set(best.plan.subs.map(s => s.group.key));
  const kos = new Set(best.plan.subs.map(s => s.group.ko));
  if (keys.size !== kos.size) return { reason: '뷰틸 종류 두 가지를 함께 쓰는 화합물은 수업 범위 밖이에요.' };
  return { list, all };
}

/** Plan → 한국어 이름. alphabetical=false면 번호 순서로 늘어놓은(틀린) 이름. */
export function render(plan: Plan, alphabetical = true): string {
  const groups = new Map<string, { group: Group; locants: number[] }>();
  for (const s of plan.subs) {
    const g = groups.get(s.group.ko) ?? { group: s.group, locants: [] };
    g.locants.push(s.locant);
    groups.set(s.group.ko, g);
  }
  const list = [...groups.values()].map(g => ({ ...g, locants: g.locants.sort((a, b) => a - b) }));
  list.sort(alphabetical ? (x, y) => x.group.key.localeCompare(y.group.key) : (x, y) => x.locants[0] - y.locants[0] || x.group.key.localeCompare(y.group.key));
  const n = plan.parent.length;
  const onlyOneOnRing = plan.ring && !plan.multi && plan.subs.length === 1;
  const prefix = list.map(g => `${onlyOneOnRing ? '' : `${g.locants.join(',')}-`}${MULTIPLIER[g.locants.length] ?? ''}${g.group.ko}`).join('-');
  let base: string;
  let locant: number | undefined;
  if (plan.ring) base = `사이클로${(plan.multi ? ALKENE : ALKANE)[n]}`;
  else if (plan.category === 'alcohol') { base = ALCOHOL[n]; if (n > 2) locant = plan.oh; }
  else if (plan.category === 'alkene') { base = ALKENE[n]; if (n > 3) locant = plan.multi!.locant; }
  else if (plan.category === 'alkyne') { base = ALKYNE[n]; if (n > 3) locant = plan.multi!.locant; }
  else base = ALKANE[n];
  const core = locant ? `${prefix ? `${prefix}-` : ''}${locant}-${base}` : `${prefix}${base}`;
  return plan.stereo ? `${plan.stereo === 'cis' ? '시스' : '트랜스'}-${core}` : core;
}

/** 시험에 잘 나오는 틀린 이름들: 반대쪽 번호, 알파벳 순서 무시, 더 짧은 사슬, 시스 ↔ 트랜스. */
export function wrongNames(mol: Mol): string[] {
  const plans = candidatePlans(mol);
  if ('reason' in plans) return [];
  const right = render(plans.list[0].plan);
  const out = new Set<string>();
  const best = plans.list[0].plan;
  const longest = Math.max(...plans.all.map(c => c.length));
  for (const c of plans.all) {
    if (c.length < Math.max(2, longest - 1)) continue; // 너무 짧은 사슬로 지은 이름은 함정이 아니라 엉뚱하다
    const name = render(c.plan);
    if (name !== right) out.add(name); // 다른 번호 · 다른 사슬
    const order = render(c.plan, false);
    if (order !== right) out.add(order);
  }
  out.add(render(best, false));
  if (best.stereo) out.add(render({ ...best, stereo: best.stereo === 'cis' ? 'trans' : 'cis' }));
  out.delete(right);
  return [...out];
}

// ── 같은 분자인지(그린 모양 · 방향과 상관없이 연결만 본다) ───────────────────────────
export function sameMolecule(a: Mol, b: Mol): boolean {
  if (a.atoms.length !== b.atoms.length || a.bonds.length !== b.bonds.length) return false;
  const adjA = adjacency(a), adjB = adjacency(b);
  const sig = (mol: Mol, adj: Adj, i: number) => `${mol.atoms[i].el}:${adj[i].map(n => `${n.order}${mol.atoms[n.to].el}`).sort().join(',')}`;
  const sigA = a.atoms.map((_, i) => sig(a, adjA, i)), sigB = b.atoms.map((_, i) => sig(b, adjB, i));
  if ([...sigA].sort().join('|') !== [...sigB].sort().join('|')) return false;
  const map = new Array<number>(a.atoms.length).fill(-1);
  const used = new Set<number>();
  // Visit A's atoms in BFS order so each new atom has an already-mapped neighbour.
  const order: number[] = [];
  const seen = new Set<number>();
  for (let s = 0; s < a.atoms.length; s += 1) if (!seen.has(s)) {
    seen.add(s); const q = [s];
    while (q.length) { const x = q.shift()!; order.push(x); for (const nb of adjA[x]) if (!seen.has(nb.to)) { seen.add(nb.to); q.push(nb.to); } }
  }
  const fits = (i: number, j: number) => {
    if (sigA[i] !== sigB[j]) return false;
    for (const nb of adjA[i]) if (map[nb.to] >= 0 && bondOrder(adjB, j, map[nb.to]) !== nb.order) return false;
    return true;
  };
  const step = (k: number): boolean => {
    if (k === order.length) return true;
    const i = order[k];
    for (let j = 0; j < b.atoms.length; j += 1) {
      if (used.has(j) || !fits(i, j)) continue;
      map[i] = j; used.add(j);
      if (step(k + 1)) return true;
      map[i] = -1; used.delete(j);
    }
    return false;
  };
  return step(0);
}

export const carbonCount = (mol: Mol) => mol.atoms.filter(a => a.el === 'C').length;
export const formula = (mol: Mol) => {
  const adj = adjacency(mol);
  let c = 0, h = 0, o = 0, cl = 0, br = 0;
  mol.atoms.forEach((a, i) => {
    if (a.el === 'C') { c += 1; h += 4 - valence(adj, i); }
    else if (a.el === 'O') { o += 1; h += 1; }
    else if (a.el === 'Cl') cl += 1; else br += 1;
  });
  const sub = (k: number) => (k > 1 ? String(k).split('').map(d => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]).join('') : '');
  return `C${sub(c)}H${sub(h)}${cl ? `Cl${sub(cl)}` : ''}${br ? `Br${sub(br)}` : ''}${o ? `O${sub(o)}` : ''}`;
};

// ── 그리기(문제 그림): 지그재그 사슬 · 정다각형 고리, 겹치지 않게 ─────────────────────
const rad = (d: number) => d * Math.PI / 180;
const step = (p: { x: number; y: number }, deg: number) => ({ x: p.x + Math.cos(rad(deg)), y: p.y + Math.sin(rad(deg)) });

type Rng = () => number;

/** 좌표를 정한다(y는 위가 +). stereo는 사슬 알켄을 시스/트랜스로 그릴 때. 겹치면 다른 모양을 시도하고, 끝내 안 되면 null. */
export function layout(input: Mol, stereo?: Stereo, rng: Rng = Math.random): Mol | null {
  const plans = candidatePlans({ atoms: input.atoms.map(a => ({ ...a })), bonds: input.bonds });
  if ('reason' in plans) return null;
  const plan = plans.list[0].plan;
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const mol: Mol = { atoms: input.atoms.map(a => ({ ...a, x: NaN, y: NaN })), bonds: input.bonds };
    if (tryLayout(mol, plan, stereo, attempt === 0 ? () => 0.99 : rng) && !collides(mol)) return mol;
  }
  return null;
}

function tryLayout(mol: Mol, plan: Plan, stereo: Stereo | undefined, rng: Rng): boolean {
  const adj = adjacency(mol);
  const placed = (i: number) => !Number.isNaN(mol.atoms[i].x);
  const put = (i: number, p: { x: number; y: number }) => { mol.atoms[i].x = p.x; mol.atoms[i].y = p.y; };
  const angleTo = (from: number, to: number) => Math.atan2(mol.atoms[to].y - mol.atoms[from].y, mol.atoms[to].x - mol.atoms[from].x) * 180 / Math.PI;
  const parent = plan.parent;
  const n = parent.length;
  if (plan.ring) {
    const r = 1 / (2 * Math.sin(Math.PI / n));
    const start = n % 2 ? 90 : 90 - 180 / n;
    parent.forEach((atom, k) => put(atom, { x: r * Math.cos(rad(start + k * 360 / n)), y: r * Math.sin(rad(start + k * 360 / n)) }));
  } else {
    const dirs: number[] = [];
    const multiAt = plan.multi ? plan.multi.locant - 1 : -1;
    const triple = plan.multi?.order === 3;
    let turn = -60;
    for (let k = 0; k < n - 1; k += 1) {
      if (triple && (k === multiAt - 1 || k === multiAt || k === multiAt + 1)) { dirs.push(0); continue; }
      if (k === 0) { dirs.push(30); continue; }
      const prev = dirs[k - 1];
      if (prev === 0) { dirs.push(turn > 0 ? 30 : -30); turn = -turn; continue; }
      let next = prev + turn;
      if (stereo && k === multiAt + 1 && multiAt >= 1) {
        // 이중 결합(multiAt → multiAt+1) 앞뒤 사슬이 같은 쪽이면 시스.
        const options = [prev + 60, prev - 60];
        next = options.find(d => {
          const a = { x: 0, y: 0 }, b = step(a, prev), before = step(a, dirs[k - 2] + 180), after = step(b, d);
          const s1 = crossSide(a as Atom, b as Atom, before as Atom), s2 = crossSide(a as Atom, b as Atom, after as Atom);
          return (Math.sign(s1) === Math.sign(s2)) === (stereo === 'cis');
        }) ?? next;
      }
      turn = next > prev ? -60 : 60;
      dirs.push(next);
    }
    put(parent[0], { x: 0, y: 0 });
    for (let k = 1; k < n; k += 1) put(parent[k], step(mol.atoms[parent[k - 1]], dirs[k - 1]));
  }
  // 가지: 주사슬 원자에서 바깥쪽으로, 가지 안에서는 지그재그로 뻗는다.
  const grow = (atom: number, from: number, incoming: number, lastTurn: number) => {
    const kids = adj[atom].map(nb => nb.to).filter(x => x !== from && !placed(x));
    if (!kids.length) return;
    let angles: number[];
    if (kids.length === 1) angles = [incoming + (lastTurn > 0 ? -60 : 60)];
    else if (kids.length === 2) angles = [incoming + 60, incoming - 60];
    else angles = [incoming, incoming + 90, incoming - 90];
    if (rng() < 0.3) angles = angles.map(a => (kids.length === 1 ? incoming + (lastTurn > 0 ? 60 : -60) : a));
    kids.forEach((kid, i) => { put(kid, step(mol.atoms[atom], angles[i])); grow(kid, atom, angles[i], angles[i] - incoming || lastTurn); });
  };
  for (const atom of parent) {
    const kids = adj[atom].map(nb => nb.to).filter(x => !placed(x));
    if (!kids.length) continue;
    const used = adj[atom].map(nb => nb.to).filter(placed).map(x => angleTo(atom, x));
    let angles: number[];
    if (plan.ring) {
      const out = Math.atan2(mol.atoms[atom].y, mol.atoms[atom].x) * 180 / Math.PI;
      angles = kids.length === 1 ? [out] : [out + 35, out - 35];
    } else if (used.length <= 1) {
      // 사슬 끝(또는 탄소 하나): 지그재그를 이어 가도록, 이미 놓인 원자에서 먼 쪽으로.
      const back = used[0] ?? 210;
      const far = (deg: number) => { const p = step(mol.atoms[atom], deg); return Math.min(...mol.atoms.filter(t => !Number.isNaN(t.x)).map(t => Math.hypot(t.x - p.x, t.y - p.y))); };
      angles = kids.length === 1 ? [[back + 120, back - 120].sort((x, y) => far(y) - far(x))[0]] : [back + 120, back - 120, back + 180].slice(0, kids.length);
    } else {
      // 두 결합 사이 바깥쪽 이등분선
      const [a1, a2] = used;
      let bis = (a1 + a2) / 2 + 180;
      if (Math.abs(((a1 - a2 + 540) % 360) - 180) < 1) bis = a1 + 90; // 일직선(삼중 결합 옆)
      angles = kids.length === 1 ? [bis] : [bis + 40, bis - 40];
    }
    kids.forEach((kid, i) => { put(kid, step(mol.atoms[atom], angles[i])); grow(kid, atom, angles[i], rng() < 0.5 ? 60 : -60); });
  }
  return mol.atoms.every((_, i) => placed(i));
}

function collides(mol: Mol): boolean {
  const atoms = mol.atoms;
  for (let i = 0; i < atoms.length; i += 1) for (let j = i + 1; j < atoms.length; j += 1) if (Math.hypot(atoms[i].x - atoms[j].x, atoms[i].y - atoms[j].y) < 0.7) return true;
  const cross = (p: Atom, q: Atom, r: Atom, s: Atom) => {
    const d = (a: Atom, b: Atom, c: Atom) => (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
    return d(p, q, r) * d(p, q, s) < -1e-9 && d(r, s, p) * d(r, s, q) < -1e-9;
  };
  for (let i = 0; i < mol.bonds.length; i += 1) for (let j = i + 1; j < mol.bonds.length; j += 1) {
    const b1 = mol.bonds[i], b2 = mol.bonds[j];
    if (b1.a === b2.a || b1.a === b2.b || b1.b === b2.a || b1.b === b2.b) continue;
    if (cross(atoms[b1.a], atoms[b1.b], atoms[b2.a], atoms[b2.b])) return true;
  }
  return false;
}

// ── 문제 만들기 ───────────────────────────────────────────────────────────────
/** PPT에 나온 화합물(이름은 PPT 그대로, 띄어쓰기 · 하이픈만 맞춤). */
export const PPT_EXAMPLES: { smiles: string; name: string; stereo?: Stereo; page: string }[] = [
  { smiles: 'CCCC', name: '뷰테인', page: 'PPT 2 · 8쪽' },
  { smiles: 'CC(C)C', name: '2-메틸프로페인', page: 'PPT 2 · 8쪽' },
  { smiles: 'CCCCC', name: '펜테인', page: 'PPT 2 · 9쪽' },
  { smiles: 'CC(C)CC', name: '2-메틸뷰테인', page: 'PPT 2 · 9쪽' },
  { smiles: 'CC(C)(C)C', name: '2,2-다이메틸프로페인', page: 'PPT 2 · 9쪽' },
  { smiles: 'CCCCCC', name: '헥세인', page: 'PPT 2 · 13쪽' },
  { smiles: 'CC(C)CCC', name: '2-메틸펜테인', page: 'PPT 2 · 13쪽' },
  { smiles: 'CCC(C)CC', name: '3-메틸펜테인', page: 'PPT 2 · 13쪽' },
  { smiles: 'CC(C)(C)CC', name: '2,2-다이메틸뷰테인', page: 'PPT 2 · 13쪽' },
  { smiles: 'CC(C)C(C)C', name: '2,3-다이메틸뷰테인', page: 'PPT 2 · 13쪽' },
  { smiles: 'CCC(C)CCC', name: '3-메틸헥세인', page: 'PPT 2 · 11쪽' },
  { smiles: 'CCC(C)C(CC)C(C)CCCC', name: '4-에틸-3,5-다이메틸노네인', page: 'PPT 2 · 14쪽' },
  { smiles: 'CCCC(C(C)(C)C)CCC', name: '4-tert-뷰틸헵테인', page: 'PPT 2 · 14쪽' },
  { smiles: 'CC1CC1C', name: '1,2-다이메틸사이클로프로페인', page: 'PPT 3 · 6쪽' },
  { smiles: 'CC(C)C1CCCC(C)C1', name: '1-아이소프로필-3-메틸사이클로헥세인', page: 'PPT 3 · 5쪽' },
  { smiles: 'CCC1CCC1CCC', name: '1-에틸-2-프로필사이클로뷰테인', page: 'PPT 3 · 5쪽' },
  { smiles: 'C1=CCCCC1', name: '사이클로헥센', page: 'PPT 4 · 8쪽' },
  { smiles: 'CC1CC=CC1', name: '4-메틸사이클로펜텐', page: 'PPT 4 · 8쪽' },
  { smiles: 'C=C', name: '에텐', page: 'PPT 4 · 3쪽' },
  { smiles: 'C=CC', name: '프로펜', page: 'PPT 4 · 3쪽' },
  { smiles: 'C=CCC', name: '1-뷰텐', page: 'PPT 4 · 3쪽' },
  { smiles: 'CC=CC', name: '시스-2-뷰텐', stereo: 'cis', page: 'PPT 4 · 4쪽' },
  { smiles: 'CC=CC', name: '트랜스-2-뷰텐', stereo: 'trans', page: 'PPT 4 · 4쪽' },
  { smiles: 'CC=CC(C)CC', name: '트랜스-4-메틸-2-헥센', stereo: 'trans', page: 'PPT 4 · 7쪽' },
  { smiles: 'C#C', name: '에타인', page: 'PPT 5 · 3쪽' },
  { smiles: 'CCC#CCCC', name: '3-헵타인', page: 'PPT 5 · 4쪽' },
  { smiles: 'CCC#CC(CC)CC', name: '5-에틸-3-헵타인', page: 'PPT 5 · 5쪽' },
  { smiles: 'CO', name: '메탄올', page: 'PPT 5 · 7쪽' },
  { smiles: 'CC(O)CC', name: '2-뷰탄올', page: 'PPT 5 · 11쪽' },
  { smiles: 'OCCCCl', name: '3-클로로-1-프로판올', page: 'PPT 5 · 11쪽' },
  { smiles: 'CC(C)(O)CCCCBr', name: '6-브로모-2-메틸-2-헥산올', page: 'PPT 5 · 11쪽' },
];

export interface Puzzle { mol: Mol; name: string; category: Category; page?: string; plan: Plan }

const pick = <T,>(list: T[], rng: Rng) => list[Math.floor(rng() * list.length)];
const weighted = <T,>(items: [T, number][], rng: Rng) => {
  let r = rng() * items.reduce((s, [, w]) => s + w, 0);
  for (const [item, w] of items) { r -= w; if (r <= 0) return item; }
  return items[items.length - 1][0];
};
const ALKYL_SMILES: Record<string, string> = { methyl: 'C', ethyl: 'CC', propyl: 'CCC', isopropyl: 'C(C)C', butyl: 'CCCC', 'sec-butyl': 'C(C)CC', isobutyl: 'CC(C)C', 'tert-butyl': 'C(C)(C)C', chloro: 'Cl', bromo: 'Br' };

/** 주사슬 n개, k번 원자에 붙일 가지들, 다중 결합(k번-k+1번), OH로 SMILES를 만든다. */
function chainSmiles(n: number, branches: Map<number, string[]>, multi?: { at: number; order: 2 | 3 }, ohAt?: number): string {
  let s = '';
  for (let k = 0; k < n; k += 1) {
    if (k > 0) s += multi && multi.at === k - 1 ? (multi.order === 2 ? '=' : '#') : '';
    s += 'C';
    const extra = [...(branches.get(k) ?? []), ...(ohAt === k ? ['O'] : [])];
    for (const b of extra) s += `(${b})`;
  }
  return s;
}

function generate(category: Category, rng: Rng): { smiles: string; stereo?: Stereo } {
  const branches = new Map<number, string[]>();
  const add = (k: number, g: string) => branches.set(k, [...(branches.get(k) ?? []), ALKYL_SMILES[g]]);
  if (category === 'alkane') {
    if (rng() < 0.12) return { smiles: 'C'.repeat(3 + Math.floor(rng() * 8)) };
    const n = 4 + Math.floor(rng() * 6);
    const count = 1 + Math.floor(rng() * (n >= 6 ? 3 : 2));
    for (let i = 0; i < count; i += 1) {
      const g = weighted<string>([['methyl', 6], ['ethyl', 3], ['propyl', 1], ['isopropyl', 1.5], ['tert-butyl', 1], ['sec-butyl', 0.5], ['isobutyl', 0.5], ['butyl', 0.3]], rng);
      const size = GROUPS[g].size;
      const k = 1 + Math.floor(rng() * (n - 2));
      if (Math.min(k, n - 1 - k) < size) continue;
      if ((branches.get(k)?.length ?? 0) >= 2) continue;
      add(k, g);
    }
    if (!branches.size) add(Math.floor(n / 2), 'methyl');
    return { smiles: chainSmiles(n, branches) };
  }
  if (category === 'cyclo') {
    const size = 3 + Math.floor(rng() * 4);
    const ene = size >= 5 && rng() < 0.3;
    const count = Math.floor(rng() * 3);
    const ring: string[][] = Array.from({ length: size }, () => []);
    for (let i = 0; i < count; i += 1) {
      const g = weighted<string>([['methyl', 5], ['ethyl', 2], ['propyl', 1], ['isopropyl', 1]], rng);
      if (GROUPS[g].size >= size) continue;
      const k = Math.floor(rng() * size);
      if (ring[k].length >= (ene ? 1 : 2) || (ene && (k === 0 || k === 1))) continue;
      ring[k].push(ALKYL_SMILES[g]);
    }
    let s = '';
    for (let k = 0; k < size; k += 1) {
      s += k === 0 ? 'C1' : k === 1 && ene ? '=C' : 'C';
      for (const b of ring[k]) s += `(${b})`;
    }
    return { smiles: `${s}1` };
  }
  if (category === 'alkene' || category === 'alkyne') {
    const order = category === 'alkene' ? 2 : 3;
    const n = 2 + Math.floor(rng() * 6);
    const at = Math.floor(rng() * (n - 1));
    const count = n >= 4 ? Math.floor(rng() * 3) : 0;
    for (let i = 0; i < count; i += 1) {
      const g = weighted<string>([['methyl', 4], ['ethyl', 1.5]], rng);
      const k = 1 + Math.floor(rng() * (n - 2));
      if (order === 3 && (k === at || k === at + 1)) continue;
      if (Math.min(k, n - 1 - k) < GROUPS[g].size || (branches.get(k)?.length ?? 0) >= (k === at || k === at + 1 ? 1 : 2)) continue;
      add(k, g);
    }
    return { smiles: chainSmiles(n, branches, { at, order }), stereo: order === 2 ? (rng() < 0.5 ? 'cis' : 'trans') : undefined };
  }
  const n = 1 + Math.floor(rng() * 6);
  const ohAt = Math.floor(rng() * n);
  const count = n >= 3 ? Math.floor(rng() * 3) : n === 2 ? Math.floor(rng() * 2) : 0;
  for (let i = 0; i < count; i += 1) {
    const g = weighted<string>([['methyl', 3], ['chloro', 2], ['bromo', 2]], rng);
    const k = Math.floor(rng() * n);
    if (k === ohAt || (g === 'methyl' && (k === 0 || k === n - 1)) || (branches.get(k)?.length ?? 0) >= 1) continue;
    add(k, g);
  }
  return { smiles: chainSmiles(n, branches, undefined, ohAt) };
}

/** 문제 하나. PPT 화합물이 자주 나오고, 나머지는 범위 안에서 새로 만든다. */
export function makePuzzle(categories: Category[], rng: Rng = Math.random, options: { minCarbons?: number } = {}): Puzzle {
  const minCarbons = options.minCarbons ?? 1;
  for (let tries = 0; tries < 400; tries += 1) {
    let spec: { smiles: string; stereo?: Stereo; page?: string };
    if (rng() < 0.35) {
      const pool = PPT_EXAMPLES.filter(e => categories.includes(categoryOfSmiles(e.smiles)));
      if (!pool.length) continue;
      spec = pick(pool, rng);
    } else spec = generate(pick(categories, rng), rng);
    const base = parseSmiles(spec.smiles);
    if (carbonCount(base) < minCarbons || carbonCount(base) > 14) continue;
    const mol = layout(base, spec.stereo, rng);
    if (!mol) continue;
    const named = nameOf(mol);
    if (!named.ok || !categories.includes(named.plan.category)) continue;
    if (named.name.length > 34) continue;
    return { mol, name: named.name, category: named.plan.category, page: spec.page, plan: named.plan };
  }
  const fallback = layout(parseSmiles('CCC(C)CC'))!;
  const named = nameOf(fallback) as Extract<NameResult, { ok: true }>;
  return { mol: fallback, name: named.name, category: 'alkane', plan: named.plan };
}

function categoryOfSmiles(smiles: string): Category {
  if (/\d/.test(smiles)) return 'cyclo';
  if (smiles.includes('O')) return 'alcohol';
  if (smiles.includes('#')) return 'alkyne';
  if (smiles.includes('=')) return 'alkene';
  return 'alkane';
}

/** 이름 맞히기 보기 네 개(정답 + 헷갈리는 이름 셋). */
export function nameChoices(puzzle: Puzzle, rng: Rng = Math.random): string[] {
  const wrong = new Set(wrongNames(puzzle.mol));
  // 비슷한 다른 분자: 같은 범위에서 몇 개 만들어 탄소 수가 가까운 것.
  for (let i = 0; i < 60 && wrong.size < 8; i += 1) {
    const other = makePuzzle([puzzle.category], rng);
    const near = Math.abs(carbonCount(other.mol) - carbonCount(puzzle.mol)) <= (i < 40 ? 2 : 5);
    if (near && other.name !== puzzle.name) wrong.add(other.name);
  }
  wrong.delete(puzzle.name);
  const list = [...wrong];
  for (let i = list.length - 1; i > 0; i -= 1) { const j = Math.floor(rng() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
  // 틀린 번호 · 순서 이름을 먼저(시험 함정), 다른 분자는 그다음.
  const traps = wrongNames(puzzle.mol);
  const chosen = [...new Set([...traps.filter(() => rng() < 0.8), ...list])].slice(0, 3);
  const all = [puzzle.name, ...chosen];
  for (let i = all.length - 1; i > 0; i -= 1) { const j = Math.floor(rng() * (i + 1)); [all[i], all[j]] = [all[j], all[i]]; }
  return all;
}

/** 정답 풀이 몇 줄: 주사슬, 번호 방향, 치환기. */
export function explain(plan: Plan): string[] {
  const n = plan.parent.length;
  const lines: string[] = [];
  if (plan.ring) lines.push(`고리 탄소 ${n}개 → 사이클로${(plan.multi ? ALKENE : ALKANE)[n]}${plan.multi ? '(이중 결합 탄소가 1 · 2번)' : ''}`);
  else {
    const need = plan.category === 'alcohol' ? ' (OH가 붙은 탄소 포함)' : plan.multi ? ` (${plan.multi.order === 2 ? '이중' : '삼중'} 결합 포함)` : '';
    lines.push(`가장 긴 사슬 탄소 ${n}개${need} → ${render({ ...plan, subs: [], stereo: undefined }).replace(/^\d+-/, '')}`);
  }
  if (plan.oh) lines.push(`OH가 붙은 탄소가 작은 번호가 되게: ${plan.oh}번`);
  else if (plan.multi && !plan.ring && n > 3) lines.push(`${plan.multi.order === 2 ? '이중' : '삼중'} 결합이 작은 번호가 되게: ${plan.multi.locant}번`);
  if (plan.subs.length) lines.push(`치환기: ${[...plan.subs].sort((a, b) => a.locant - b.locant).map(s => `${s.locant}번 ${s.group.ko}`).join(', ')}${new Set(plan.subs.map(s => s.group.key)).size > 1 ? ' → 이름은 알파벳 순서' : ''}`);
  if (plan.stereo) lines.push(`이중 결합 양쪽 사슬이 ${plan.stereo === 'cis' ? '같은 쪽 → 시스' : '반대쪽 → 트랜스'}`);
  return lines;
}

// ── 화면에 그릴 선과 글자(문제 그림 · 그리기 판 공통) ──────────────────────────────
export interface Stroke { x1: number; y1: number; x2: number; y2: number; kind: 'single' | 'inner' | 'outer' }
export interface Label { x: number; y: number; text: string }
/** 골격 구조식 선분들. 좌표는 분자 단위(결합 길이 1), y는 위가 +. 이중 결합은 안쪽에 짧은 선, 삼중 결합은 양쪽에 선. */
export function skeleton(mol: Mol): { strokes: Stroke[]; labels: Label[]; box: { minX: number; maxX: number; minY: number; maxY: number } } {
  const adj = adjacency(mol);
  const labels: Label[] = mol.atoms.map((a, i) => ({ a, i })).filter(({ a }) => a.el !== 'C').map(({ a }) => ({ x: a.x, y: a.y, text: a.el === 'O' ? 'OH' : a.el }));
  const center = (() => { const xs = mol.atoms.map(a => a.x), ys = mol.atoms.map(a => a.y); return { x: xs.reduce((s, v) => s + v, 0) / xs.length, y: ys.reduce((s, v) => s + v, 0) / ys.length }; })();
  const strokes: Stroke[] = [];
  const trim = (i: number) => (mol.atoms[i].el === 'C' ? 0 : 0.32);
  for (const b of mol.bonds) {
    const A = mol.atoms[b.a], B = mol.atoms[b.b];
    const len = Math.hypot(B.x - A.x, B.y - A.y) || 1;
    const ux = (B.x - A.x) / len, uy = (B.y - A.y) / len;
    const x1 = A.x + ux * trim(b.a), y1 = A.y + uy * trim(b.a), x2 = B.x - ux * trim(b.b), y2 = B.y - uy * trim(b.b);
    strokes.push({ x1, y1, x2, y2, kind: 'single' });
    if (b.order === 1) continue;
    let nx = -uy, ny = ux;
    if (b.order === 2) {
      // 안쪽(이웃 원자가 많은 쪽, 고리면 고리 중심 쪽)에 짧은 선
      const others = [...adj[b.a], ...adj[b.b]].map(n => n.to).filter(t => t !== b.a && t !== b.b).map(t => mol.atoms[t]);
      const side = others.reduce((s, t) => s + Math.sign((t.x - A.x) * nx + (t.y - A.y) * ny), 0) || Math.sign((center.x - A.x) * nx + (center.y - A.y) * ny) || 1;
      nx *= side; ny *= side;
      const o = 0.17, cut = 0.16;
      strokes.push({ x1: x1 + nx * o + ux * cut, y1: y1 + ny * o + uy * cut, x2: x2 + nx * o - ux * cut, y2: y2 + ny * o - uy * cut, kind: 'inner' });
    } else {
      const o = 0.15;
      for (const s of [1, -1]) strokes.push({ x1: x1 + nx * o * s, y1: y1 + ny * o * s, x2: x2 + nx * o * s, y2: y2 + ny * o * s, kind: 'outer' });
    }
  }
  const xs = mol.atoms.map(a => a.x), ys = mol.atoms.map(a => a.y);
  return { strokes, labels, box: { minX: Math.min(...xs), maxX: Math.max(...xs), minY: Math.min(...ys), maxY: Math.max(...ys) } };
}
