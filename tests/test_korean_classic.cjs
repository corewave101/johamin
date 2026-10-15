// 국어(고전 시가): 학습지 7~14쪽에서만, 단원마다 촘촘하게, 카드 한 장만 보고 풀 수 있게.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { koreanClassicCards: cards, koreanClassicWritten: written, koreanClassicTopics: topics, koreanClassicPractice: practice } = require('../data/korean-classic-cards.ts');
const { subjectMenu, subjectDecks } = require('../data/swipe-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');

const korean = subjectMenu.children.find(n => n.id === 'humanities').children.find(n => n.name === '국어');
assert.ok(korean.children.some(d => d.id === 'korean-classic' && d.name === '고전 시가'));
const deck = subjectDecks.find(d => d.id === 'korean-classic');
assert.equal(deck.cards, cards);
assert.deepEqual(deck.writtenQuestions.slice(0, written.length), written);

const len = s => [...s].length;
assert.equal(new Set(cards.map(c => c.id)).size, cards.length);
assert.equal(new Set(cards.map(c => c.question)).size, cards.length);
cards.forEach((c, i) => {
  assert.equal(c.id, `korean-classic-${String(i + 1).padStart(3, '0')}`);
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(len(c.question) <= 65 && Object.values(c.answers).every(a => len(a) <= 20), c.id);
  assert.ok(c.explanation.length > 20 && /다\.?\)?$/.test(c.explanation.trim()), c.id);
  assert.ok(!/(위 그림|다음 그림|학습지에서|앞 문제|위 자료|위 작품|이 작품|이 시)/.test(c.question), `${c.id}: not self-contained`);
  const page = Number(c.sourceNote.match(/^고전 시가 학습지 · (\d+)쪽$/)[1]);
  assert.ok(page >= 7 && page <= 14, `${c.id}: only the worksheet (7~14쪽) — ${page}`);
  assert.ok(topics.includes(c.topic), c.id);
});
// Units follow the worksheet order, and every unit digs in.
assert.deepEqual([...new Set(cards.map(c => c.topic))], topics);
for (const t of topics) assert.ok(cards.filter(c => c.topic === t).length >= 12, t);
assert.ok(cards.length >= 300, `${cards.length} cards`);
assert.ok(conceptsFor('korean-classic').flatMap(l => l.topicKeys).sort().join() === [...topics].sort().join());
assert.ok(practice.short.length >= 30 && practice.written.length >= practice.short.length);
for (const q of practice.short) assert.ok(len(q.modelAnswer) <= 10 && !/[–→/·,]/.test(q.modelAnswer), q.id);

// Content traps the student checked by hand.
const answer = phrase => { const c = cards.find(c => c.question.includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct]; };
assert.ok(!cards.some(c => /꾀꼬리/.test(c.question) && /감정이입/.test(c.answers[c.correct])), '황조가의 꾀꼬리는 감정이입이 아니라 대조되는 객관적 상관물');
assert.equal(answer('작가와 연대가 뚜렷하며 현전하는 최고'), '<황조가>');
assert.equal(answer('우리나라에서 가장 오래된 서정시로 알려진'), '<공무도하가>');
assert.equal(answer("'죽어도 아니 눈물 흘리우리다'"), '반어');
console.log(`PASS: 고전 시가 ${cards.length} cards in ${topics.length} units (7~14쪽), ${practice.short.length} short + ${practice.written.length} reason-writing, concepts cover every unit.`);
