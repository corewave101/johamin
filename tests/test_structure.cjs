// 4.4.0 주민지T 구조식 실습: 이름 붙이기(PPT 화합물 그대로), 같은 분자 판정, 시스 · 트랜스, 문제 · 보기 만들기.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const S = require('../lib/structure.ts');
const named = (smiles, stereo) => { const mol = S.layout(S.parseSmiles(smiles), stereo); assert.ok(mol, `layout ${smiles}`); const r = S.nameOf(mol); return r.ok ? r.name : `ERR ${r.reason}`; };

// PPT에 나온 화합물은 PPT 이름 그대로.
for (const e of S.PPT_EXAMPLES) assert.equal(named(e.smiles, e.stereo), e.name, e.smiles);
assert.ok(S.PPT_EXAMPLES.length >= 30);
// 명명 규칙: 가장 긴 사슬 · 치환기 많은 사슬 · 작은 번호 · 알파벳 순서 · 다이/트라이 · 고리 · 다중 결합 · OH.
const known = {
  'CC(C)C(CC)CC': '3-에틸-2-메틸펜테인', 'CCC(CC)CC': '3-에틸펜테인', 'CCC(C)(C)CC': '3,3-다이메틸펜테인', 'CC(C)CC(C)(C)C': '2,2,4-트라이메틸펜테인',
  'CCCCC(C(C)CC)CCCC': '5-sec-뷰틸노네인', 'CCCCC(CCC)CC(C)C': '2-메틸-4-프로필옥테인', 'CCCCCCCCCC': '데케인',
  'CC1CCCCC1': '메틸사이클로헥세인', 'CC1CCC(C)CC1': '1,4-다이메틸사이클로헥세인', 'CC1CCCC=C1': '3-메틸사이클로헥센', 'C1CC1': '사이클로프로페인',
  'C=C(C)C': '2-메틸프로펜', 'C=C(C)CC': '2-메틸-1-뷰텐', 'C=CC(C)C': '3-메틸-1-뷰텐', 'CC=C(C)C': '2-메틸-2-뷰텐', 'C#CC': '프로파인', 'CC(C)C#CCC': '2-메틸-3-헥사인',
  'CCO': '에탄올', 'CC(C)O': '2-프로판올', 'CC(C)(C)O': '2-메틸-2-프로판올', 'ClCCO': '2-클로로에탄올', 'OCC(Cl)CBr': '3-브로모-2-클로로-1-프로판올',
};
for (const [smiles, name] of Object.entries(known)) assert.equal(named(smiles), name, smiles);
// 시스 · 트랜스는 그린 모양으로 정한다.
assert.equal(named('CC=CCC', 'cis'), '시스-2-펜텐');
assert.equal(named('CC=CCC', 'trans'), '트랜스-2-펜텐');
const flat = { atoms: [0, 1, 2, 3].map(i => ({ el: 'C', x: i, y: 0 })), bonds: [{ a: 0, b: 1, order: 1 }, { a: 1, b: 2, order: 2 }, { a: 2, b: 3, order: 1 }] };
assert.equal(S.nameOf(flat).ok, false, '일직선으로 그린 2-뷰텐은 시스/트랜스를 알 수 없다');
// 범위 밖 · 잘못 그린 구조는 이유를 말한다.
for (const bad of ['C(C)(C)(C)(C)C', 'OCCO', 'C1CC2CC1C2', 'CC=CC=C']) { const r = S.nameOf(S.parseSmiles(bad)); assert.equal(r.ok, false, bad); assert.ok(r.reason.length > 5); }
assert.equal(S.nameOf({ atoms: [{ el: 'C', x: 0, y: 0 }, { el: 'C', x: 1, y: 0 }, { el: 'C', x: 3, y: 0 }], bonds: [{ a: 0, b: 1, order: 1 }] }).ok, false, '떨어진 조각');

// 같은 분자: 그린 방향 · 순서와 상관없이 연결만 본다.
const same = (a, b) => S.sameMolecule(S.parseSmiles(a), S.parseSmiles(b));
assert.ok(same('CCC(C)CC', 'CC(CC)CC') && same('CC(C)CCC', 'CCCC(C)C') && same('OCCCCl', 'ClCCCO') && same('CC1CC=CC1', 'C1=CCC(C)C1'));
assert.ok(!same('CCC(C)CC', 'CC(C)CCC') && !same('C=CCC', 'CC=CC') && !same('CCCO', 'CC(O)C') && !same('C1CCC1', 'CCCC'));

// 문제 만들기: 이름이 다시 붙여도 같고, 보기는 서로 다른 넷에 정답 하나.
let seed = 42;
const rng = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const cats = ['alkane', 'cyclo', 'alkene', 'alkyne', 'alcohol'];
let made = 0;
for (const cat of cats) for (let i = 0; i < 60; i += 1) {
  const p = S.makePuzzle([cat], rng, { minCarbons: 2 });
  assert.equal(p.category, cat);
  const again = S.nameOf(p.mol);
  assert.ok(again.ok && again.name === p.name, p.name);
  const choices = S.nameChoices(p, rng);
  assert.equal(choices.length, 4, p.name);
  assert.equal(new Set(choices).size, 4, choices.join());
  assert.equal(choices.filter(c => c === p.name).length, 1);
  assert.ok(S.explain(p.plan).length >= 1);
  made += 1;
}
// 고난도: 주사슬 7~10개, 치환기 3개 이상, 알켄은 시스/트랜스. 다시 이름을 붙여도 같고 보기 넷은 서로 다르다.
let hardMade = 0;
for (const cat of cats) for (let i = 0; i < 25; i += 1) {
  const p = S.makePuzzle([cat], rng, { hard: true });
  assert.equal(p.category, cat);
  assert.ok(p.plan.subs.length >= 3 && p.name.length >= 18, p.name);
  if (cat === 'alkene') assert.ok(p.plan.stereo, p.name);
  const again = S.nameOf(p.mol);
  assert.ok(again.ok && again.name === p.name, p.name);
  const choices = S.nameChoices(p, rng);
  assert.equal(new Set(choices).size, 4, choices.join());
  assert.ok(choices.includes(p.name));
  hardMade += 1;
}
// 주사슬 후보에 표에 없는 가지가 생기는 분자는 이름을 붙이지 않는다(엉뚱한 사슬로 이름 짓지 않게).
assert.equal(S.nameOf(S.parseSmiles('CCCC(CC)C(C)CCC')).ok, true);
// 틀린 이름 함정: 반대쪽 번호, 알파벳 순서 무시
const w = S.wrongNames(S.layout(S.parseSmiles('CC(C)CCC(CC)CC')));
assert.ok(w.includes('3-에틸-6-메틸헵테인') && w.includes('2-메틸-5-에틸헵테인'), w.join());
assert.equal(S.formula(S.parseSmiles('CC(C)(O)CCCCBr')), 'C₇H₁₅BrO');

// 화면 연결: 화학(주민지T · 기말) 덱 학습 메뉴 맨 앞 '구조식 실습'.
const { finalMenu } = require('../data/final-subjects.ts');
const chem = finalMenu.children.find(n => n.id === 'science').children.find(n => n.id === 'physics-chemistry').children.find(n => n.id === 'chemistry-final');
assert.equal(chem.lab, 'structure');
const study = fs.readFileSync('components/swipe/SubjectStudy.tsx', 'utf8');
assert.ok(study.includes("const structure = deck.lab === 'structure';") && study.includes('<StructureLab'));
assert.ok(!/from '\.\.\/\.\.\/data\//.test(fs.readFileSync('components/swipe/StructureLab.tsx', 'utf8').replace("import type { Direction } from '../../data/swipe-cards';", '')), '실습 화면은 카드 묶음을 불러오지 않는다');
console.log(`PASS: 구조식 실습 — PPT 화합물 ${S.PPT_EXAMPLES.length}개 이름 그대로, 명명 규칙 ${Object.keys(known).length}개, 같은 분자 · 시스/트랜스, 문제 ${made}개 · 고난도 ${hardMade}개 다시 확인`);
