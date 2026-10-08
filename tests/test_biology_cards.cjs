const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, file);
const { parkCards, joCards } = require('../data/biology-cards.ts');
const { parkWritten, joWritten } = require('../data/biology-written.ts');
const { subjectDecks, subjectMenu } = require('../data/swipe-subjects.ts');
const { newGame, answerCard } = require('../lib/swipe-game.ts');
assert.equal(subjectMenu.children.find(x => x.id === 'biology').kind, 'group');
const ids = new Set();
for (const [id, cards, written, maxPage] of [['biology-park', parkCards, parkWritten, 3], ['biology-jo', joCards, joWritten, 25]]) {
  const deck = subjectDecks.find(x => x.id === id);
  assert.deepEqual(deck.cards.filter(q => !q.id.startsWith('park-term-')), cards);
  assert.deepEqual(deck.writtenQuestions.filter(q => !q.id.startsWith('park-term-')), written);
  assert.ok(cards.length >= (id === 'biology-jo' ? 38 : 40) && written.length >= 10);
  assert.equal(new Set(cards.map(x => x.question)).size, cards.length);
  for (const q of [...cards, ...written]) {
    assert.ok(!ids.has(q.id), q.id); ids.add(q.id);
    assert.ok(q.question && q.topic);
    const page = Number(q.sourceNote.match(/(\d+)쪽$/)[1]);
    assert.ok(page > 0 && page <= maxPage, q.id);
  }
  for (const q of cards) {
    assert.equal(new Set(Object.values(q.answers)).size, 4, q.id);
    assert.ok(q.answers[q.correct] && q.explanation.length > 15);
  }
  for (const q of written) {
    assert.ok(q.modelAnswer.length > 50, q.id);
    assert.equal(q.criteria.length, 3, q.id);
    assert.equal(new Set(q.criteria).size, 3);
  }
  let state = newGame(cards, () => .37);
  const first = state.queue[0];
  state = answerCard(state, 'unknown', 1, () => .37);
  assert.equal(state.queue[12].id, first.id);
  assert.equal(state.queue[12].answers[state.queue[12].correct], first.answers[first.correct]);
  while (state.queue.length) state = answerCard(state, state.queue[0].correct, 1);
  assert.equal(new Set(state.mastered).size, cards.length);
}
console.log(`PASS: biology teacher routing, ${parkCards.length + joCards.length} multiple choice, ${parkWritten.length + joWritten.length} written questions, sources, rubrics, answer uniqueness, retry and completion.`);
