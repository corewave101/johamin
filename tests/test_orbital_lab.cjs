// 6.5.0 주민지T 오비탈 실습: 분자 모형의 결합 길이 · 결합각, 혼성, σ/π 개수, 고리 스트레인, 비틀기, 문제 만들기.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const O = require('../lib/orbital.ts');
const near = (got, want, tol, msg) => assert.ok(Math.abs(got - want) <= tol, `${msg}: ${got} ≠ ${want}`);

// 모든 분자: 결합 길이가 말이 되고, 탄소는 결합 4개(이중 = 2, 삼중 = 3), 수소는 1개, 원자끼리 겹치지 않는다.
const formulas = {
  methane: 'CH₄', ethane: 'C₂H₆', ethene: 'C₂H₄', ethyne: 'C₂H₂', propene: 'C₃H₆', butene1: 'C₄H₈', propyne: 'C₃H₄',
  'cis-2-butene': 'C₄H₈', 'trans-2-butene': 'C₄H₈', 'cis-2-pentene': 'C₅H₁₀', 'trans-2-pentene': 'C₅H₁₀',
  cyclopropane: 'C₃H₆', cyclobutane: 'C₄H₈', cyclopentane: 'C₅H₁₀', chair: 'C₆H₁₂', boat: 'C₆H₁₂',
};
assert.deepEqual(new Set(O.MOLECULE_IDS), new Set(Object.keys(formulas)));
for (const id of O.MOLECULE_IDS) {
  const m = O.molecule(id);
  assert.equal(O.formula(m), formulas[id], `${id} 분자식`);
  m.atoms.forEach((a, i) => {
    const valence = O.neighbors(m, i).reduce((s, n) => s + n.order, 0);
    assert.equal(valence, a.el === 'C' ? 4 : 1, `${id} 원자 ${i} 결합 수`);
  });
  for (const b of m.bonds) {
    const d = O.len(O.sub(m.atoms[b.a].p, m.atoms[b.b].p));
    const ch = m.atoms[b.a].el === 'H' || m.atoms[b.b].el === 'H';
    const [lo, hi] = ch ? [1.0, 1.12] : b.order === 3 ? [1.18, 1.22] : b.order === 2 ? [1.32, 1.36] : [1.44, 1.56];
    assert.ok(d >= lo && d <= hi, `${id} 결합 ${b.a}-${b.b} 길이 ${d}`);
  }
  for (let i = 0; i < m.atoms.length; i++) for (let j = i + 1; j < m.atoms.length; j++) {
    assert.ok(O.len(O.sub(m.atoms[i].p, m.atoms[j].p)) > 0.95, `${id} 원자 ${i}, ${j}가 너무 가까움`);
  }
}

// 혼성과 결합각(PPT 2 · 4 · 5).
const allAngles = (id, i) => O.anglesAround(O.molecule(id), i).map(x => x.angle);
for (const a of allAngles('methane', 0)) near(a, 109.47, 0.05, '메테인');
for (const a of allAngles('ethane', 0)) near(a, 109.47, 0.05, '에테인');
for (const a of allAngles('ethene', 0)) near(a, 120, 0.05, '에텐');
for (const a of allAngles('ethyne', 0)) near(a, 180, 0.05, '에타인');
assert.deepEqual(['methane', 'ethene', 'ethyne'].map(id => O.hybOf(O.molecule(id), 0)), ['sp3', 'sp2', 'sp']);
const propyne = O.molecule('propyne');
assert.deepEqual([0, 1, 2].map(i => O.hybOf(propyne, i)), ['sp', 'sp', 'sp3']);
assert.equal(O.hybOf(propyne, 3), null, '수소는 혼성 없음');
// sp² 탄소: 결합 3개가 한 평면, 남는 p 하나가 그 평면에 수직. sp: 남는 p 둘이 축과 서로에 수직.
const eth = O.molecule('ethene'), so = O.orbitalsOf(eth, 0);
assert.equal(so.lobes.length, 3); assert.equal(so.p.length, 1);
for (const l of so.lobes) near(O.dot(l.dir, so.p[0]), 0, 1e-9, 'p ⟂ sp²');
const sp = O.orbitalsOf(O.molecule('ethyne'), 0);
assert.equal(sp.lobes.length, 2); assert.equal(sp.p.length, 2);
near(O.dot(sp.p[0], sp.p[1]), 0, 1e-9, 'p ⟂ p'); for (const p of sp.p) near(O.dot(p, sp.lobes[0].dir), 0, 1e-9, 'p ⟂ 축');
assert.equal(O.orbitalsOf(O.molecule('methane'), 0).p.length, 0);

// σ/π 개수.
const counts = id => { const c = O.bondCounts(O.molecule(id)); return [c.sigma, c.pi]; };
assert.deepEqual(counts('ethane'), [7, 0]); assert.deepEqual(counts('ethene'), [5, 1]); assert.deepEqual(counts('ethyne'), [3, 2]);
assert.deepEqual(counts('propene'), [8, 1]); assert.deepEqual(counts('propyne'), [6, 2]); assert.deepEqual(counts('chair'), [18, 0]);

// 고리 결합각(PPT 3 · 1~2쪽): 60° · 88° · 정사면체 가까이.
near(O.ringAngle(O.molecule('cyclopropane')), 60, 0.01, '사이클로프로페인');
near(O.ringAngle(O.molecule('cyclobutane')), 88, 0.01, '사이클로뷰테인');
const c5 = O.ringAngle(O.molecule('cyclopentane')), c6 = O.ringAngle(O.molecule('chair'));
assert.ok(c5 > 100 && c5 < 109, `사이클로펜테인 ${c5}`); near(c6, 111.4, 0.01, '의자형');
for (const id of ['cyclopropane', 'cyclobutane', 'cyclopentane', 'chair', 'boat']) {
  const m = O.molecule(id); assert.equal(m.kind, 'ring'); assert.equal(m.ring.length, Number(O.formula(m)[1].replace(/[₀-₉]/, d => '₀₁₂₃₄₅₆₇₈₉'.indexOf(d))));
}
near(O.bentAngle(60), 24.74, 0.01, '스트레인 각'); assert.equal(O.bentAngle(111.4), 0);
// 스트레인을 켜면 사이클로프로페인의 C–C 쪽 오비탈은 109.5°로 벌어지고, C–C 축에서 약 24.7° 비껴 있다.
const cp = O.molecule('cyclopropane'), bent = O.orbitalsOf(cp, cp.ring[0], true);
const ringLobes = bent.lobes.filter(l => cp.ring.includes(l.toward));
assert.equal(ringLobes.length, 2);
near(O.angleBetween(ringLobes[0].dir, ringLobes[1].dir), 109.47, 0.05, '굽은 오비탈 사이각');
for (const l of ringLobes) near(l.bent, 24.74, 0.05, '굽은 정도');
// 보트형: 깃대 H 두 개가 다른 어떤 H 쌍보다 가깝다. 의자형에는 그렇게 가까운 H가 없다.
const boat = O.molecule('boat');
for (const c of boat.ring) for (const x of O.anglesAround(boat, c)) near(x.angle, 109.47, 2.5, '보트형 결합각');
// 서로 다른 탄소에 붙은 H끼리 가장 가까운 거리(같은 탄소의 H 두 개는 원래 가깝다).
const carbonOf = (m, h) => O.neighbors(m, h)[0].atom;
const hh = m => {
  const hs = m.atoms.map((a, i) => i).filter(i => m.atoms[i].el === 'H');
  let best = Infinity;
  for (const a of hs) for (const b of hs) if (a < b && carbonOf(m, a) !== carbonOf(m, b)) best = Math.min(best, O.len(O.sub(m.atoms[a].p, m.atoms[b].p)));
  return best;
};
const flag = O.len(O.sub(boat.atoms[boat.flagpole[0]].p, boat.atoms[boat.flagpole[1]].p));
assert.ok(flag < 2.0, `깃대 H ${flag}`); near(hh(boat), flag, 1e-9, '깃대 H가 가장 가까운 쌍');
assert.ok(hh(O.molecule('chair')) > flag + 0.3, '의자형에는 부딪히는 H가 없다');

// 비틀기(PPT 4 · 3 · 6쪽): 에테인은 돌려도 σ 그대로, 에텐은 90°에서 p가 수직, 180°에서 다시 나란.
const [a, b] = eth.axis;
near(O.piAlignment(eth, a, b), 1, 1e-9, '평면 에텐');
near(O.piAlignment(O.twist(eth, a, b, 90), a, b), 0, 1e-9, '90°');
near(O.piAlignment(O.twist(eth, a, b, 45), a, b), Math.SQRT1_2, 1e-9, '45°');
near(O.piAlignment(O.twist(eth, a, b, 180), a, b), 1, 1e-9, '180°');
const tw = O.twist(eth, a, b, 37);
near(O.len(O.sub(tw.atoms[a].p, tw.atoms[b].p)), 1.34, 1e-9, '돌려도 C=C 길이 그대로');
// 시스 ↔ 트랜스: 시스-2-뷰텐을 180° 돌리면 트랜스, 90°면 판단 불가.
const cis = O.molecule('cis-2-butene');
assert.equal(O.stereoOf(cis), 'cis'); assert.equal(O.stereoOf(O.molecule('trans-2-butene')), 'trans');
assert.equal(O.stereoOf(O.molecule('cis-2-pentene')), 'cis'); assert.equal(O.stereoOf(O.molecule('trans-2-pentene')), 'trans');
assert.equal(O.stereoOf(O.twist(cis, ...cis.axis, 180)), 'trans');
assert.equal(O.stereoOf(O.twist(cis, ...cis.axis, 90)), null);
assert.equal(O.twist(O.molecule('chair'), 0, 1, 30), O.molecule('chair'), '고리 결합은 안 돈다');

// 문제 만들기: 유형마다 보기 넷이 모두 다르고 정답이 딱 하나, 해설과 근거가 있다. 직전 유형은 피한다.
let seed = 7;
const rng = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const seen = new Set();
let prev;
for (let n = 0; n < 1500; n++) {
  const q = O.makeQuestion(rng, prev);
  assert.notEqual(q.kind, prev, '같은 유형이 연달아 나옴');
  prev = q.kind; seen.add(q.kind);
  assert.equal(q.choices.length, 4, `${q.kind} 보기 수`);
  assert.equal(new Set(q.choices).size, 4, `${q.kind} 보기 중복: ${q.choices}`);
  assert.equal(q.choices.filter(c => c === q.answer).length, 1, `${q.kind} 정답`);
  assert.ok(q.choices.every(c => c.length <= 26), `${q.kind} 보기 길이`);
  assert.ok(q.ask.length >= 10 && q.ask.length <= 80, `${q.kind} 질문 길이 ${q.ask}`);
  assert.ok(q.explain.length >= 2 && q.explain.every(l => l.length > 8), `${q.kind} 해설`);
  assert.match(q.source, /^PPT \d/);
  if (q.kind === 'hyb') {
    const h = O.hybOf(q.mol, q.highlight);
    assert.ok(q.answer.startsWith(O.HYB_TEXT[h] + ' ·'), '혼성 정답');
  }
  if (q.kind === 'count') { const c = O.bondCounts(q.mol); assert.equal(q.answer, `σ ${c.sigma}개 · π ${c.pi}개`); }
  if (q.kind === 'cistrans') assert.equal(q.answer.startsWith('시스'), O.stereoOf(q.mol) === 'cis');
  if (q.kind === 'twist') { const [x, y] = q.mol.axis; assert.equal(q.answer.startsWith('σ만'), O.piAlignment(q.mol, x, y) < 0.2); }
  if (q.kind === 'chair') assert.equal(q.answer.startsWith('보트형'), Boolean(q.mol.flagpole));
}
assert.deepEqual([...seen].sort(), [...O.QUIZ_KINDS].sort(), '모든 유형이 나옴');
// 혼성 문제에서 sp · sp² · sp³ 탄소가 모두 빛난다.
const hybs = new Set();
for (let n = 0; n < 300; n++) { const q = O.makeQuestion(rng, undefined, ['hyb']); hybs.add(O.hybOf(q.mol, q.highlight)); }
assert.deepEqual([...hybs].sort(), ['sp', 'sp2', 'sp3']);

// 화면 연결: 화학(주민지T · 기말) 덱 학습 메뉴에 ‘3D로 돌려 보기’ · ‘돌려 보고 맞히기’.
const { finalMenu } = require('../data/final-subjects.ts');
const chem = finalMenu.children.find(n => n.id === 'science').children.find(n => n.id === 'physics-chemistry').children.find(n => n.id === 'chemistry-final');
assert.deepEqual(chem.lab, ['structure', 'orbital']);
const study = fs.readFileSync('components/swipe/SubjectStudy.tsx', 'utf8');
assert.ok(study.includes("labs.includes('orbital')") && study.includes('<OrbitalLab') && study.includes("setOrbitalStart('quiz')"));
for (const f of ['components/swipe/OrbitalLab.tsx', 'components/swipe/OrbitalScene.tsx', 'lib/orbital.ts']) {
  const src = fs.readFileSync(f, 'utf8').replace("import type { Direction } from '../../data/swipe-cards';", '');
  assert.ok(!/from '\.\.\/\.\.\/data\/|from '\.\.\/data\//.test(src), `${f}: 실습 화면은 카드 묶음을 불러오지 않는다`);
}
// Three.js는 새로 넣지 않고 피직스 캐슬의 파일을 같이 쓴다(앱 번들 · 미리 받기 목록에 안 들어감).
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
assert.ok(!pkg.dependencies.three && !(pkg.devDependencies ?? {}).three, 'three 패키지를 더하지 않는다');
assert.ok(fs.readFileSync('lib/three-loader.ts', 'utf8').includes("'physics-castle/three.min.js'"));
assert.ok(fs.existsSync('public/physics-castle/three.min.js'));

console.log('PASS: 오비탈 실습 — 분자 모형 16개(결합 길이 · 결합각 · 원자가), 혼성 · σ/π · 고리 스트레인 · 비틀기, 문제 1500개 다시 확인');
