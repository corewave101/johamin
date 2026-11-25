// 기말고사 · 행성우주과학(황윤환T) 「행성우주과학 탐구」 수정본 슬라이드 50~117: 메뉴 · 카드 규격 · 계산 카드 정답을 다시 계산한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { astronomyHwangFinalCards: cards, astronomyHwangFinalWritten: written, ASTRONOMY_HWANG_TOPICS: topics } = require('../data/astronomy-hwang-final-cards.ts');
const { finalMenu } = require('../data/final-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');

// 과학(→) → 지구과학(←) → 황윤환T(←)
const earth = finalMenu.children.find(n => n.id === 'science').children.find(n => n.id === 'astronomy-final-group');
const deck = earth.children.find(n => n.id === 'astronomy-hwang-final');
assert.equal(deck.direction, 'left');
assert.equal(deck.cards, cards);
assert.equal(deck.writtenQuestions, written);

assert.ok(cards.length >= 30, `${cards.length} cards`);
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.ok(cards.every(c => /^astronomy-hwang-final-\d{3}$/.test(c.id)));
assert.equal(new Set(cards.map(c => c.question)).size, cards.length);
for (const c of cards) {
  assert.ok(topics.includes(c.topic), c.id);
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok([...c.question].length <= 100, `${c.id} question`);
  assert.ok(Object.values(c.answers).every(a => [...a].length <= 40), `${c.id} answers`);
  assert.ok(c.explanation.length > 16 && c.explanation.endsWith('.'), c.id);
  assert.ok(Number.isInteger(c.sourceSlide) && c.sourceSlide >= 50 && c.sourceSlide <= 117, `${c.id} slide ${c.sourceSlide}`); // 시험 범위
  assert.ok(!/(위 그림|그림의|슬라이드에서|앞 문제|위 자료|표에서)/.test(c.question), c.id);
}
for (const t of topics) assert.ok(cards.some(c => c.topic === t), t);

const right = q => { const c = cards.find(card => card.question.includes(q)); assert.ok(c, q); return c.answers[c.correct]; };
const near = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);
const num = s => Number(s.replace(/,/g, '').match(/[\d.]+/)[0]);

// 조리개 I ∝ 1/N²: F8 → F4는 4배 밝아 셔터 1/125 → 1/500
assert.equal(right('조리개를 F4로 열었을 때'), `1/${125 * (8 / 4) ** 2} s`);
near(num(right('F7.5 망원경과 F5 망원경')), (5 / 7.5) ** 2, 0.005);
// 양자 효율: t_CCD = t_건판 × QE_건판/QE_CCD
near(num(right('양자 효율 2%인 사진 건판으로 90분')), 90 * 2 / 90, 1e-9);
// s = fθ, N = s/p
near(num(right('시직경 40″인 목성')), 900e-3 * (40 / 206265) / 4.3e-6, 0.5);
// 크롭 팩터 = 35mm 대각선 / APS-C 대각선
near(Math.hypot(36, 24) / Math.hypot(22.3, 14.9), 1.6, 0.02);
near(num(right('크롭 팩터 약 1.6')), 900 * 1.6, 1e-9);
// 셔터 4″ = 4 s, 4 = 1/4 s
assert.ok(right('셔터 속도 표기 4″와 4').includes(`${4 / (1 / 4)}배`));
// 장노출 노이즈 감소: 노출 시간만큼 처리 → 1분 + 1분
near(num(right('벌브로 1분 노출하면')), 2, 1e-9);
// 밴드갭: λ가 길수록 E = hc/λ가 작다
assert.equal(right('1.1 μm보다 긴 적외선'), '광자 에너지가 밴드갭보다 작아서');

// 픽셀 스케일 θ = p/f × 206265, 2× 바로우 → f 2배
near(num(right('TSA-102(f = 816 mm)에 2× 바로우')), 4.3e-3 / (816 * 2) * 206265, 0.01);
// 실제 크기 D = d × (N × θ_px)/206265 (만 km)
near(num(right('본체 지름이 36 px였다')) * 1e4, 13e8 * (36 * 0.54) / 206265, 5e3);
// 고리 실제 지름 = 본체 지름 × 장축/본체 (만 km)
near(num(right('고리 장축이 82 px')) * 1e4, 12e4 * 82 / 36, 5e3);
// sin B = b/a, 1 px 더 크게 → B 커짐
{ const a = right('고리 장축이 80 px'); near(num(a), Math.asin(10 / 80) * 180 / Math.PI, 0.05);
  near(Number(a.match(/약 ([\d.]+)° 커짐/)[1]), (Math.asin(11 / 80) - Math.asin(10 / 80)) * 180 / Math.PI, 0.05); }
// 위도 = acos(R′/R)
near(num(right('R′가 330 px')), Math.acos(330 / 440) * 180 / Math.PI, 0.5);
// P = 360°/θ × Δt (반대쪽 α + β, 같은 쪽 |α − β|)
near(num(right('흑점이 40° 돌았다')), 360 / 40 * 3, 1e-9);
near(num(right('α = 8°, β = 48°')), 360 / Math.abs(8 - 48) * 3, 1e-9);
// 1/P겉 = 1/P실 − 1/E
near(num(right('겉보기 자전 주기가 26.3일')), 26.3 * 365 / (26.3 + 365), 0.05);

for (const q of written) assert.ok(q.modelAnswer.length > 100 && q.criteria.length >= 3 && q.sourceNote, q.id);
const lessons = conceptsFor('astronomy-hwang-final');
assert.equal(lessons.length, 5);
assert.deepEqual([...new Set(lessons.flatMap(l => l.topicKeys))].sort(), [...topics].sort());

console.log(`PASS: 행성우주과학 황윤환T 슬라이드 50~117 ${cards.length}장 (계산 16장 다시 계산) · 서술형 ${written.length} · 개념 ${lessons.length}`);
