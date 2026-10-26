// 기말고사 · 물리학Ⅱ(양동비T) 「물리 20번 · 광학 기기의 원리」: 메뉴 · 카드 규격 · 렌즈 방정식 계산 카드를 다시 계산한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { physicsYangFinalCards: cards, physicsYangFinalWritten: written, PHYSICS_YANG_TOPICS: topics } = require('../data/physics-yang-final-cards.ts');
const { finalMenu } = require('../data/final-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');

// 과학 → 물리 · 화학 → 물리학Ⅱ → 양동비T (빛과 렌즈 실습도 같은 덱)
const physics = finalMenu.children.find(n => n.id === 'science').children.find(n => n.id === 'physics-chemistry').children.find(n => n.id === 'physics-final-group');
const deck = physics.children.find(n => n.id === 'physics-yang-final');
assert.equal(deck.cards, cards);
assert.equal(deck.writtenQuestions, written);
assert.equal(deck.lab, 'optics');

assert.ok(cards.length >= 150, `${cards.length} cards`);
assert.equal(written.length, 4);
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.ok(cards.every(c => /^physics-yang-final-\d{3}$/.test(c.id)));
assert.equal(new Set(cards.map(c => c.question)).size, cards.length);
for (const c of cards) {
  assert.ok(topics.includes(c.topic), c.id);
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(Object.values(c.answers).every(a => typeof a === 'string' && [...a].length <= 40), `${c.id} answers`);
  assert.ok([...c.question].length <= 60, `${c.id} question`);
  assert.ok(c.explanation.length > 16 && c.explanation.endsWith('다.'), c.id);
  assert.ok(/^양동비T 물리 20번 · [1-5]쪽$/.test(c.sourceNote), c.id);
  assert.ok(!/(위 그림|그림의|학습지에서|앞 문제|위 자료|표에서|\(가\)|\(나\))/.test(c.question), c.id);
}

// 렌즈 방정식 1/a + 1/b = 1/f, m = −b/a
const num = s => Number(s.replace('−', '-').replace('+', ''));
let computed = 0;
for (const c of cards) {
  const right = c.answers[c.correct];
  let m;
  if ((m = c.question.match(/^초점 거리 (\d+) cm인 (볼록|오목) 렌즈 앞 (\d+) cm에 물체가 있다\. 상 거리 b는\?$/))) {
    const f = Number(m[1]) * (m[2] === '볼록' ? 1 : -1), a = Number(m[3]), b = a * f / (a - f);
    assert.ok(Math.abs(num(right.match(/b = (\S+) cm/)[1]) - b) < 1e-9, `${c.id}: ${right} vs ${b}`);
    for (const w of Object.values(c.answers).filter(x => x !== right)) assert.ok(Math.abs(num(w.match(/b = (\S+) cm/)[1]) - b) > 0.01, `${c.id} wrong ${w}`);
    computed += 1;
  } else if ((m = c.question.match(/^초점 거리 (\d+) cm인 (볼록|오목) 렌즈 앞 (\d+) cm 물체의 배율과 상은\?$/))) {
    const f = Number(m[1]) * (m[2] === '볼록' ? 1 : -1), a = Number(m[3]), b = a * f / (a - f), mag = -b / a;
    const r = right.match(/^m = (\S+) · (정립|도립) (실상|허상)$/);
    assert.ok(r && Math.abs(num(r[1]) - mag) < 1e-9 && (r[2] === '정립') === (mag > 0) && (r[3] === '실상') === (b > 0), `${c.id}: ${right}`);
    computed += 1;
  }
}
assert.ok(computed >= 70, `computed ${computed}`);
// 확인 문제 1: a = 20, b = 100 → f = 50/3, a = 10 → b = −25, m = 2.5
const f1 = 1 / (1 / 20 + 1 / 100);
assert.ok(Math.abs(f1 - 50 / 3) < 1e-9);
const b2 = 1 / (1 / f1 - 1 / 10);
assert.ok(Math.abs(b2 + 25) < 1e-9 && Math.abs(-b2 / 10 - 2.5) < 1e-9);
const p1 = cards.find(c => c.question.startsWith('볼록 렌즈 앞 20 cm의 물체가 렌즈 뒤 100 cm'));
assert.equal(p1.answers[p1.correct], '50/3 cm');

for (const q of written) assert.ok(q.modelAnswer.length > 100 && q.criteria.length >= 3, q.id);
const lessons = conceptsFor('physics-yang-final');
assert.equal(lessons.length, 4);
assert.deepEqual([...new Set(lessons.flatMap(l => l.topicKeys))].sort(), [...topics].sort());

console.log(`PASS: 물리학Ⅱ 양동비T 광학 기기의 원리 ${cards.length}장 (렌즈 방정식 ${computed}장 다시 계산) · 서술형 ${written.length} · 개념 ${lessons.length}`);
