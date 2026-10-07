const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, file);
const { swipeCards } = require('../data/swipe-cards.ts');
const { astronomyCards } = require('../data/astronomy-cards.ts');
const { subjectDecks } = require('../data/swipe-subjects.ts');
const { newGame, answerCard, getStats, RETRY_GAP } = require('../lib/swipe-game.ts');
const rng = seed => () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
assert.equal(RETRY_GAP, 12);
assert.equal(astronomyCards.length, 75);
assert.equal(new Set(astronomyCards.map(c => c.id)).size, 75);
assert.equal(new Set(astronomyCards.map(c => c.question)).size, 75);
assert.ok(!JSON.stringify(astronomyCards).match(/2030|2050|정렬 정밀도|조정 범위/));
assert.equal(subjectDecks.find(d => d.id === 'astronomy-hwang').cards, astronomyCards);
assert.ok(subjectDecks.every(d => d.cards.length > 0 || ['korean-newyork', 'korean-classic'].includes(d.id)), 'Only the Korean parts waiting for material may be empty');
for (const c of [...swipeCards, ...astronomyCards]) {
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(c.answers[c.correct]);
  if (c.id.startsWith('astronomy')) assert.ok(c.sourceSlide && c.explanation.length > 20);
}
const sourceSnapshot = JSON.stringify(astronomyCards);
const a = newGame(astronomyCards, rng(1)), b = newGame(astronomyCards, rng(2));
assert.notDeepEqual(a.queue.map(c => c.id), b.queue.map(c => c.id), 'New sessions shuffle card order');
assert.notDeepEqual(a.queue.map(c => c.answers), b.queue.map(c => c.answers), 'New sessions shuffle choices');
for (const c of a.queue) {
  const original = astronomyCards.find(o => o.id === c.id);
  assert.equal(c.answers[c.correct], original.answers[original.correct], 'Shuffle preserves correct text');
  assert.deepEqual(Object.values(c.answers).sort(), Object.values(original.answers).sort());
}
for (const choice of ['wrong', 'unknown']) {
  const initial = newGame(astronomyCards, rng(5));
  const first = initial.queue[0];
  const selected = choice === 'unknown' ? 'unknown' : Object.keys(first.answers).find(d => d !== first.correct);
  let state = answerCard(initial, selected, 2, rng(9));
  assert.equal(initial.attempts.length, 0);
  assert.equal(state.queue[12].id, first.id);
  assert.notEqual(state.queue[12].correct, first.correct, 'Retry must change the correct arrow');
  assert.equal(state.queue[12].answers[state.queue[12].correct], first.answers[first.correct]);
  assert.equal(state.attempts[0].card, first, 'Feedback retains the old answer mapping');
  for (let i = 0; i < 12; i++) state = answerCard(state, state.queue[0].correct, 1);
  assert.equal(state.queue[0].id, first.id);
  assert.equal(state.streak, 12);
  state = answerCard(state, 'unknown', 1);
  assert.equal(state.streak, 0);
  assert.equal(state.bestStreak, 12);
  while (state.queue.length) state = answerCard(state, state.queue[0].correct, 1);
  assert.equal(state.mastered.length, 75);
  assert.equal(new Set(state.mastered).size, 75);
  assert.equal(state.attempts.length, 77);
  assert.equal(getStats(state).mistakes, 2);
  assert.equal(answerCard(state, 'up', 1), state);
}
let one = newGame([swipeCards[0]], rng(9));
one = answerCard(one, 'unknown', 1);
assert.equal(one.queue.length, 1);
one = answerCard(one, one.queue[0].correct, 1);
assert.equal(one.queue.length, 0);
assert.equal(JSON.stringify(astronomyCards), sourceSnapshot, 'Authored data is never mutated');
console.log('PASS: 75 sourced prompts, immutable shuffle with preserved meaning, new order per seed, guaranteed changed retry arrow, 12-card delay, unknown, streak reset, completion and one-card fallback.');

