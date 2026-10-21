// 기말고사 · 화학(주민지T) 「Ⅲ. 탄소 화합물과 반응」: 수업 PPT 1~5번.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { chemistryFinalCards: cards, chemistryFinalWritten: written } = require('../data/chemistry-final-cards.ts');
const { finalMenu } = require('../data/final-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');

const flatten = g => g.children.flatMap(n => n.kind === 'group' ? flatten(n) : [n]);
const deck = flatten(finalMenu).find(d => d.id === 'chemistry-final');
assert.equal(deck.cards, cards);
assert.equal(deck.writtenQuestions, written);

assert.ok(cards.length >= 60, `${cards.length} cards`);
assert.equal(written.length, 4);
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.ok(all.every(c => /^chemistry-final-(written-)?\d{3}$/.test(c.id)));
assert.equal(new Set(cards.map(c => c.question)).size, cards.length);
const pages = { 1: 21, 2: 15, 3: 6, 4: 8, 5: 12 }; // PDF 쪽수
for (const c of [...cards, ...written]) {
  const m = /^주민지T PPT (\d) · (\d+)쪽$/.exec(c.sourceNote);
  assert.ok(m && Number(m[2]) >= 1 && Number(m[2]) <= pages[m[1]], `${c.id}: ${c.sourceNote}`);
}
for (const c of cards) {
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(c.question.length <= 80, `${c.id} question ${c.question.length}`);
  assert.ok(Object.values(c.answers).every(a => a.length <= 22), `${c.id} answers`);
  assert.ok(c.explanation.length > 16 && /다\.$/.test(c.explanation), c.id);
  assert.ok(!/(위 그림|다음 그림|PPT에서|슬라이드|앞 문제|자료에서)/.test(c.question), c.id);
}
for (const q of written) assert.ok(q.modelAnswer.length > 80 && q.criteria.length >= 3, q.id);
const lessons = conceptsFor('chemistry-final');
assert.equal(lessons.length, 4);
for (const card of cards) assert.ok(lessons.some(l => l.topicKeys.includes(card.topic)), card.topic);

// Facts from the PPT, checked by meaning.
const correct = phrase => { const c = cards.find(c => c.question.includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct]; };
assert.equal(correct('알케인의 일반식'), 'CₙH₂ₙ₊₂');
assert.equal(correct('정삼각형 구조인 사이클로프로페인'), '60°');
assert.equal(correct('두 형태 중 더 안정'), '의자형');
assert.equal(correct('CH₃CH₂CH₂C≡CCH₂CH₃'), '3-헵타인');
assert.equal(correct('CH₂=CHCH₂CH₃'), '1-뷰텐');
assert.equal(correct('펜테인(C₅H₁₂)의 구조 이성질체 수'), '3개');
assert.equal(correct('알카인의 삼중 결합 탄소'), 'sp');
assert.equal(correct('2-뷰탄올'), '이차 알코올');
console.log(`PASS: 기말 화학 주민지T — ${cards.length} choices + ${written.length} rubrics, PPT pages, lengths, ${lessons.length} concept lessons, PPT facts.`);
