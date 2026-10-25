// 기말고사 · 수학(황종철T) 「삼각함수 각 변환」 암산 덱: 모든 카드의 정답을 Math.sin/cos/tan으로 다시 계산해 본다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { mathTrigFinalCards: cards, mathTrigFinalWritten: written, MATH_TRIG_TOPICS } = require('../data/math-trig-final-cards.ts');
const { finalMenu } = require('../data/final-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');

// 처음 화면 ↓ 수학 → ← 황종철T → ↑ 삼각함수 각 변환
const math = finalMenu.children.find(n => n.id === 'math-final-group');
assert.equal(math.direction, 'down');
const hwang = math.children.find(n => n.id === 'math-hwang-final-group');
assert.equal(hwang.name, '황종철T');
const deck = hwang.children.find(n => n.id === 'math-trig-final');
assert.equal(deck.name, '삼각함수 각 변환');
assert.equal(deck.cards, cards);
assert.equal(deck.writtenQuestions, written);

assert.ok(cards.length >= 1000 && cards.length <= 1100, `${cards.length} cards`);
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.ok(cards.every(c => /^math-trig-final-\d{4}$/.test(c.id)));
assert.ok(written.every(c => /^math-trig-final-written-\d{3}$/.test(c.id)));
assert.equal(new Set(cards.map(c => c.question)).size, cards.length, '같은 문제가 두 번 나오지 않는다');

// 정답 방향은 고르게(각 방향 20~30%).
const share = { up: 0, left: 0, right: 0, down: 0 };
cards.forEach(c => { share[c.correct] += 1; });
for (const [d, n] of Object.entries(share)) assert.ok(n / cards.length > 0.2 && n / cards.length < 0.3, `${d} ${n}`);

// ── 식 계산기: 'sin(180° − 60°)', 'cos 43π/6', '−1/tan θ', '−√3/2', '−0.3420' ──
const D = Math.PI / 180;
const F = { sin: 'S', cos: 'C', tan: 'T' };
function js(text) {
  return text
    .replace(/(sin|cos|tan) ([^\s()]+)/g, (_, f, a) => `${F[f]}(${a})`)
    .replace(/(sin|cos|tan)\(/g, (_, f) => `${F[f]}(`)
    .replace(/√(\d)/g, 'R($1)')
    .replace(/(\d)π/g, '$1*P').replace(/π/g, 'P')
    .replace(/(\d)°/g, '$1*D')
    .replace(/−/g, '-').replace(/[θx]/g, 't');
}
const evaluate = (text, t) => new Function('S', 'C', 'T', 'R', 'D', 'P', 't', `return ${js(text)};`)(Math.sin, Math.cos, Math.tan, Math.sqrt, D, Math.PI, t);
const close = (a, b, eps) => Math.abs(a - b) < eps;

const counts = Object.fromEntries(MATH_TRIG_TOPICS.map(t => [t, 0]));
for (const c of cards) {
  counts[c.topic] += 1;
  const answers = Object.values(c.answers);
  assert.equal(new Set(answers).size, 4, c.id);
  assert.ok(answers.every(a => [...a].length <= 20), `${c.id} answers`);
  assert.ok([...c.question].length <= 60, `${c.id} question`);
  assert.ok(c.explanation.length > 16 && c.explanation.endsWith('다.'), c.id);
  assert.ok(/^황종철T 개념원리 수학Ⅰ · 17[0-3]쪽$/.test(c.sourceNote), c.id);
  assert.ok(!/(위 그림|학습지에서|앞 문제|위 자료|표에서)/.test(c.question), c.id);
  const right = c.answers[c.correct];

  let m;
  if ((m = c.question.match(/^(?:.*일 때 )?(.+?)(?:의 값은\?|를 간단히 하면\?|를 0°~90°의 같은 삼각함수로 나타내면\?)$/)) && /^(sin|cos|tan)/.test(m[1])) {
    const decimal = /\d\.\d{4}/.test(right);
    for (const t of [0.3, 1.1]) {
      const want = evaluate(m[1], t);
      assert.ok(Number.isFinite(want), `${c.id} ${m[1]}`);
      const eps = decimal ? 6e-5 : 1e-9;
      assert.ok(close(evaluate(right, t), want, eps), `${c.id}: ${m[1]} = ${right}?`);
      // 오답은 진짜 오답이어야 한다.
      for (const wrong of answers.filter(a => a !== right)) assert.ok(!close(evaluate(wrong, t), want, 1e-6), `${c.id}: 오답 ${wrong}도 맞음`);
    }
    // 값 문제는 해설의 마지막 값이 정답과 같다(간단히 하기 문제의 해설은 공식을 x로 쓴다).
    assert.ok(!c.question.endsWith('의 값은?') || c.explanation.includes(`= ${right}이다.`), `${c.id} explanation`);
  } else if ((m = c.question.match(/^(.+)를 나타내는 동경은 몇 사분면에 있는가\?$/))) {
    const a = ((evaluate(m[1], 0) / D % 360) + 360) % 360;
    assert.equal(right, `제${Math.floor(a / 90) + 1}사분면`, c.id);
  } else {
    assert.ok(['각 변환 공식(90°×n±θ)', '동경과 부호'].includes(c.topic), `${c.id}: 계산하지 못한 카드 ${c.question}`);
  }
}
// 단원마다 넉넉히.
for (const [topic, n] of Object.entries(counts)) assert.ok(n >= 40, `${topic} ${n}`);
// 교재 손풀이 확인: 410(1) cos 7π/6 = −√3/2 (손글씨 −1/2은 틀림)
const c76 = cards.find(c => c.question === 'cos 7π/6의 값은?');
assert.equal(c76.answers[c76.correct], '−√3/2');

for (const q of written) assert.ok(q.modelAnswer.length > 100 && q.criteria.length >= 3, q.id);
const lessons = conceptsFor('math-trig-final');
assert.equal(lessons.length, 4);
assert.deepEqual(lessons.flatMap(l => l.topicKeys).sort(), [...MATH_TRIG_TOPICS].sort());

console.log(`PASS: 수학 황종철T 삼각함수 각 변환 ${cards.length}장 · 정답 전부 계산 확인 · 서술형 ${written.length} · 개념 ${lessons.length}`);
