// 기말고사 · 행성우주과학(전효진T) 학습지 27~36쪽: 메뉴 · 카드 규격 · 계산 카드 정답을 다시 계산한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { astronomyJeonFinalCards: cards, astronomyJeonFinalWritten: written, ASTRONOMY_JEON_TOPICS: topics } = require('../data/astronomy-jeon-final-cards.ts');
const { finalMenu } = require('../data/final-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');

// 과학(→) → 지구과학(←) → 전효진T(→)
const earth = finalMenu.children.find(n => n.id === 'science').children.find(n => n.id === 'astronomy-final-group');
assert.equal(earth.direction, 'left');
const deck = earth.children.find(n => n.id === 'astronomy-jeon-final');
assert.equal(deck.direction, 'right');
assert.equal(deck.cards, cards);
assert.equal(deck.writtenQuestions, written);

// 6.2.0에서 새로 썼다: 예전 001~145는 다시 쓰지 않는다.
assert.ok(cards.length >= 30, `${cards.length} cards`);
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.ok(cards.every(c => /^astronomy-jeon-final-\d{3}$/.test(c.id) && Number(c.id.slice(-3)) >= 201), 'ids start at 201');
assert.ok(written.every(q => /^astronomy-jeon-final-written-1\d\d$/.test(q.id)));
assert.equal(new Set(cards.map(c => c.question)).size, cards.length);
for (const c of cards) {
  assert.ok(topics.includes(c.topic), c.id);
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok([...c.question].length <= 100, `${c.id} question`);
  assert.ok(Object.values(c.answers).every(a => [...a].length <= 40), `${c.id} answers`);
  assert.ok(c.explanation.length > 16 && c.explanation.endsWith('.'), c.id);
  const m = /^전효진T 행성우주과학 학습지(?: ★필기 바로잡음)? · (\d+)쪽$/.exec(c.sourceNote ?? '');
  assert.ok(m && Number(m[1]) >= 27 && Number(m[1]) <= 36, `${c.id} source`);
  assert.ok(!/(위 그림|그림의|학습지에서|앞 문제|위 자료|표에서)/.test(c.question), c.id);
}
for (const t of topics) assert.ok(cards.some(c => c.topic === t), t);

const right = q => { const c = cards.find(card => card.question.includes(q)); assert.ok(c, q); return c.answers[c.correct]; };
const near = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);
const num = s => Number(s.replace(/,/g, '').match(/[\d.]+/)[0]);

// ★ 필기 바로잡음: 빨간색보다 파장이 긴 쪽은 적외선
assert.equal(right('다음으로 들어가는 영역은?'), '적외선');
assert.ok(cards.find(c => c.question.includes('다음으로 들어가는 영역은?')).sourceNote.includes('★'));
// 시선 속도 Vr = c × (λ − λ₀)/λ₀
const C = 3e5;
near(num(right('정지 파장 500 nm인 흡수선이 중심별 스펙트럼에서 500.2 nm')), C * 0.2 / 500, 1e-9);
assert.ok(right('500.2 nm로 관측됐다').endsWith('멀어진다'));
near(num(right('30 km/s로 다가온다. 관측되는 파장은?')), 600 - 600 * 30 / C, 1e-9);
near(num(right('공간 속도 50 km/s, 접선 속도 40 km/s')), Math.sqrt(50 ** 2 - 40 ** 2), 1e-9);
// 공전 주기 · 케플러 3법칙
near(num(right('0.07일, 2.27일, 4.47일')), 2.2, 1e-9);
near(num(right('2.2일 주기로 도는 행성의 궤도 장반경은?')), Math.cbrt(2.96e-4 * 1.5 * 2.2 ** 2 / (4 * Math.PI ** 2)), 0.0005);
// 반지름 비
near(num(right('밝기가 1% 줄었다')), Math.sqrt(0.01), 1e-9);
near(num(right('밝기 감소율이 0.6%')), Math.sqrt(0.006) * 2.0, 0.005);
// L ∝ R²T⁴, λmax ∝ 1/T
near(num(right('반지름은 태양의 1/2배')), 0.5 ** 2 * 2 ** 4, 1e-9);
near(num(right('광도는 태양의 100배')), Math.sqrt(100 * 2 ** 4), 1e-9);
near(num(right('1,000 K인 원시별')), 483 * 6000 / 1000, 5);

for (const q of written) assert.ok(q.modelAnswer.length > 100 && q.criteria.length >= 3 && q.sourceNote, q.id);
const lessons = conceptsFor('astronomy-jeon-final');
assert.equal(lessons.length, 3);
assert.deepEqual([...new Set(lessons.flatMap(l => l.topicKeys))].sort(), [...topics].sort());

console.log(`PASS: 행성우주과학 전효진T 27~36쪽 ${cards.length}장 (계산 11장 다시 계산) · 서술형 ${written.length} · 개념 ${lessons.length}`);
