// 기말고사 · 행성우주과학(전효진T) 학습지 8번 「외계 행성 탐사」: 메뉴 · 카드 규격 · 계산 문제 정답을 다시 계산한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { astronomyJeonFinalCards: cards, astronomyJeonFinalWritten: written, ASTRONOMY_JEON_TOPICS: topics } = require('../data/astronomy-jeon-final-cards.ts');
const { finalMenu } = require('../data/final-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');

// 과학(→) → 지구과학(←) → 전효진T(→). 왼쪽 황윤환T는 준비 중.
const earth = finalMenu.children.find(n => n.id === 'science').children.find(n => n.id === 'astronomy-final-group');
assert.equal(earth.direction, 'left');
const deck = earth.children.find(n => n.id === 'astronomy-jeon-final');
assert.equal(deck.direction, 'right');
assert.equal(deck.cards, cards);
assert.equal(deck.writtenQuestions, written);
assert.deepEqual(earth.children.find(n => n.id === 'astronomy-hwang-final').cards, []);

assert.ok(cards.length >= 120, `${cards.length} cards`);
assert.equal(written.length, 3);
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.ok(cards.every(c => /^astronomy-jeon-final-\d{3}$/.test(c.id)));
assert.equal(new Set(cards.map(c => c.question)).size, cards.length);
for (const c of cards) {
  assert.ok(topics.includes(c.topic), c.id);
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok([...c.question].length <= 70, `${c.id} question`);
  assert.ok(Object.values(c.answers).every(a => [...a].length <= 40), `${c.id} answers`);
  assert.ok(c.explanation.length > 16 && c.explanation.endsWith('.'), c.id);
  assert.ok(c.source && /8번/.test(c.source.title) && [1, 2].includes(c.source.page), c.id);
  assert.ok(!/(위 그림|그림의|학습지에서|앞 문제|위 자료|표에서)/.test(c.question), c.id);
}
// ★ 필기 바로잡음: 자외선은 가시광선보다 짧은 쪽, 적외선은 긴 쪽.
const order = cards.find(c => c.question === '전자기파를 파장이 짧은 것부터 늘어놓은 것은?');
assert.equal(order.answers[order.correct], 'γ선→X선→자외선→가시광선→적외선→전파');

// 계산 문제: Vr = c × (λ − λ₀)/λ₀, c = 3×10⁵ km/s
const C = 3e5;
const close = (a, b) => Math.abs(a - b) < 1e-6;
let computed = 0;
for (const c of cards) {
  const right = c.answers[c.correct];
  let m;
  if ((m = c.question.match(/^원래 파장 (\d+) nm인 흡수선이 ([\d.]+) nm로 관측됐다\. 시선 속도는\?/))) {
    const v = C * (Number(m[2]) - Number(m[1])) / Number(m[1]);
    const a = right.match(/^([\d.]+) km\/s로 (멀어짐|다가옴)$/);
    assert.ok(a && close(Number(a[1]), Math.abs(v)) && (a[2] === '멀어짐') === (v > 0), `${c.id}: ${right} vs ${v}`);
    computed += 1;
  } else if ((m = c.question.match(/^원래 파장 (\d+) nm인 흡수선을 내는 별이 (\d+) km\/s로 (멀어진다|다가온다)\. 관측 파장은\?/))) {
    const l0 = Number(m[1]), v = Number(m[2]) * (m[3] === '멀어진다' ? 1 : -1);
    assert.ok(close(Number(right.replace(' nm', '')), l0 + l0 * v / C), `${c.id}: ${right}`);
    computed += 1;
  } else if ((m = c.question.match(/^원래 파장 (\d+) nm인 흡수선이 ([\d.]+) nm로 관측됐다\. 이 별은\?$/))) {
    assert.equal(right, Number(m[2]) > Number(m[1]) ? '적색 편이 · 멀어진다' : '청색 편이 · 다가온다', c.id);
    computed += 1;
  } else if ((m = c.question.match(/^시선 속도 (\d+) km\/s, 접선 속도 (\d+) km\/s인 별의 공간 속도는\?$/))) {
    assert.equal(right, `${Math.hypot(Number(m[1]), Number(m[2]))} km/s`, c.id);
    computed += 1;
  }
}
assert.ok(computed >= 80, `computed ${computed}`);

for (const q of written) assert.ok(q.modelAnswer.length > 100 && q.criteria.length >= 3, q.id);
const lessons = conceptsFor('astronomy-jeon-final');
assert.equal(lessons.length, 3);
assert.deepEqual([...new Set(lessons.flatMap(l => l.topicKeys))].sort(), [...topics].sort());

console.log(`PASS: 행성우주과학 전효진T 외계 행성 탐사 ${cards.length}장 (계산 ${computed}장 다시 계산) · 서술형 ${written.length} · 개념 ${lessons.length}`);
