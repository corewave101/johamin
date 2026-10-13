// 사회(성신제T) · 뭉탱이: one edition per worksheet, many self-contained cards from that worksheet only.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { socialBulkCards: cards, socialBulkWritten: written, socialBulkEditions: editions } = require('../data/social-bulk-cards.ts');
const { socialCards, socialSources } = require('../data/social-cards.ts');
const { subjectDecks } = require('../data/swipe-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');
const deck = subjectDecks.find(d => d.id === 'social-bulk');
assert.equal(deck.cards, cards);
assert.equal(deck.writtenQuestions, written);
assert.equal(subjectDecks.find(d => d.id === 'social').cards, socialCards, '기본 덱은 그대로');

const len = s => [...s].length;
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.equal(new Set(cards.map(c => c.question)).size, cards.length);
const old = new Set(socialCards.map(c => c.question));
for (const c of cards) {
  assert.match(c.id, /^social-bulk-\d{2,3}-\d{3}$/);
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(len(c.question) <= 65 && Object.values(c.answers).every(a => len(a) <= 20), c.id);
  assert.ok(c.explanation.length > 20, c.id);
  assert.ok(!/(위 그림|다음 그림|학습지에서|앞 문제|위 자료)/.test(c.question), c.id);
  assert.ok(!old.has(c.question), `${c.id}: same question as the 기본 deck`);
  const source = socialSources.find(s => s.title === c.source.title);
  assert.ok(source && c.source.teacher === '성신제T' && c.source.page >= 1 && c.source.page <= source.pages, c.id);
}
for (const e of editions) {
  const n = cards.filter(c => c.topic === e.name).length;
  assert.ok(n >= 50, `${e.name}: ${n} cards (an edition digs deep)`);
  assert.ok(/에디션$/.test(e.name), e.name);
}
const { isShortQuestion } = require('../data/study-practice.ts');
const rubrics = written.filter(q => /^social-bulk-/.test(q.id));
for (const q of rubrics) assert.ok(q.criteria.length >= 3 && q.modelAnswer.length > 100, q.id);
const short = written.filter(isShortQuestion), reasons = written.filter(q => q.id.startsWith('practice-written-'));
assert.ok(short.length >= 15 && reasons.length >= short.length, `${short.length} short, ${reasons.length} reason-writing`);
for (const q of short) assert.ok([...q.modelAnswer].length <= 10 && !q.modelAnswer.includes('–'), q.id);
assert.equal(conceptsFor('social-bulk').length, editions.length);
const correct = phrase => { const c = cards.find(c => c.question.includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct]; };
assert.equal(correct('지역성은?'), '약화된다');
assert.equal(correct('부뇰의 나라와 그 기후'), '에스파냐–지중해성 기후');
assert.equal(correct('마추픽추 A'), '페루–브라질');
assert.equal(correct('지역이 아니라 기업이 쓰는 전략'), '현지화');
console.log(`PASS: 뭉탱이 ${editions.map(e => e.name).join(', ')} — ${cards.length} choices + ${rubrics.length} rubrics + ${short.length} short + ${reasons.length} reason-writing, sizes, sources, no repeats of the 기본 deck.`);
