// 박상영T 수행평가 대비(5.0.0~): 피펫 · 추출 · NanoDrop 계산과 메뉴 연결.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, file);
const lab = require('../lib/dna-lab.ts');
const { finalMenu } = require('../data/final-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');

// 표시창: 같은 0·7·5가 피펫마다 다르다(설명서 표의 예).
assert.equal(lab.displayValue('P20', [0, 8, 5]), 8.5);
assert.equal(lab.displayValue('P20', [1, 5, 6]), 15.6);
assert.equal(lab.displayValue('P200', [0, 7, 5]), 75);
assert.equal(lab.displayValue('P200', [1, 7, 8]), 178);
assert.equal(lab.displayValue('P1000', [0, 2, 5]), 250);
assert.equal(lab.displayValue('P1000', [0, 6, 0]), 600);
// 피펫 고르기: 범위 안의 가장 작은 모델.
assert.equal(lab.pickPipette(20), 'P20');
assert.equal(lab.pickPipette(8.5), 'P20');
assert.equal(lab.pickPipette(100), 'P100');
assert.equal(lab.pickPipette(200), 'P200');
assert.equal(lab.pickPipette(600), 'P1000');
assert.equal(lab.pickPipette(50), 'P100');
assert.equal(lab.inRange('P1000', 50), false); // P1000으로 50 µL ✕
assert.equal(lab.PIPETTES.P1000.tip, '파란색');
// 공식.
assert.ok(Math.abs(lab.volumeFromMass(99.8) - 100) < 1e-9);
assert.ok(Math.abs(lab.errorPercent(98, 100) + 2) < 1e-9);
assert.equal(lab.dnaConcentration(0.3), 15);
assert.equal(lab.totalYield(15, 100), 1.5);
// 순도: 순수하면 약 1.8, 단백질이면 A260/A280 ↓, 염 · 에탄올이면 A260/A230 ↓, RNA면 A260/A280 ↑ · 농도 ↑.
const pure = lab.ratios(lab.measure([]));
assert.ok(Math.abs(pure.r280 - 1.8) < 0.05 && pure.r230 >= 1.8 && pure.r230 <= 2.2);
assert.equal(lab.judge280(pure.r280), 'ok');
const protein = lab.ratios(lab.measure(['protein']));
assert.equal(lab.judge280(protein.r280), 'low');
assert.equal(lab.judge230(protein.r230), 'ok', '단백질만 남으면 A260/A230은 정상 범위');
const salt = lab.ratios(lab.measure(['salt']));
assert.equal(lab.judge230(salt.r230), 'low');
assert.ok(Math.abs(salt.r280 - pure.r280) < 1e-9, '염 · 에탄올은 A260/A280을 바꾸지 않아요');
const rna = lab.measure(['rna']);
assert.ok(lab.ratios(rna).r280 > pure.r280 && lab.dnaConcentration(rna.a260) > lab.dnaConcentration(lab.PURE.a260));

// 메뉴: 생물 → 박상영T 덱(실습 dna + 개념 4단원).
const flat = g => g.children.flatMap(n => n.kind === 'group' ? flat(n) : [n]);
const deck = flat(finalMenu).find(d => d.id === 'biology-park-final');
assert.ok(deck && deck.lab === 'dna');
const lessons = conceptsFor('biology-park-final');
assert.equal(lessons.length, 4);
for (const l of lessons) assert.ok(l.summary.length > 35 && l.sections.length >= 3 && l.sourceNote.startsWith('박상영T 수행평가 설명서'), l.id);

// 실험 따라하기: 단계 순서(채취 → 용해 → … → 용출 → NanoDrop)와 장면 문구.
const src = fs.readFileSync('components/swipe/DnaProtocol.tsx', 'utf8');
const titles = [...src.matchAll(/\{ title: '([^']+)'/g)].map(m => m[1]);
const order = ['구강상피세포 채취', '용해 완충액 200 µL', '프로테이네이스 K 20 µL', '볼텍싱 → 56°C 배양', '결합 완충액 200 µL', '무수 에탄올 200 µL', '컬럼에 올리기 → 원심분리', '세척 1 · 2', '건조 원심분리(Dry spin)', '용출 100 µL → DNA 얻기', 'NanoDrop: 닦고 블랭크', 'NanoDrop: 시료 측정'];
assert.deepEqual(titles, order);
assert.ok(src.includes("transfer('P20', 'ProK'") && src.includes("transfer('P1000', 'GW1'") && src.includes("transfer('P200', 'EA'"), '시약마다 맞는 피펫');
console.log('PASS: 표시창 읽기 · 피펫 고르기 · 오차 · 농도 · 수득량 · 순도 해석 · 메뉴 · 실험 순서');
