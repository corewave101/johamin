// Cards read from the database must behave exactly like the bundled cards they came from.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { cards: rows } = require('../scripts/export-cards.cjs');
const { groupRows, withLiveCards } = require('../lib/card-store.ts');
const { subjectMenu, subjectDecks } = require('../data/swipe-subjects.ts');
const { missedCards, recordResult, seenCount, resetProgress } = require('../lib/progress.ts');

const live = groupRows(rows);
const menu = withLiveCards(subjectMenu, live);
const flatten = g => g.children.flatMap(n => n.kind === 'group' ? flatten(n) : [n]);
const sourceText = c => c.sourceSlide ? `slide ${c.sourceSlide}` : c.source ? `${c.source.url} ${c.source.page}` : c.sourceNote;
for (const [deck, liveDeck] of flatten(menu).map(d => [subjectDecks.find(b => b.id === d.id), d])) {
  assert.equal(liveDeck.cards.length, deck.cards.length, deck.id);
  deck.cards.forEach((card, i) => {
    const got = liveDeck.cards[i];
    assert.equal(got.id, card.id);
    assert.equal(got.answers[got.correct], card.answers[card.correct], card.id);
    assert.deepEqual(Object.values(got.answers).sort(), Object.values(card.answers).sort(), card.id);
    for (const key of ['topic', 'question', 'explanation', 'subject', 'passage']) assert.equal(got[key], card[key], `${card.id} ${key}`);
    assert.equal(sourceText(got), sourceText(card), card.id);
  });
  assert.deepEqual((liveDeck.writtenQuestions ?? []).map(q => [q.id, q.modelAnswer, q.criteria.join('|'), q.sourceNote]),
    (deck.writtenQuestions ?? []).map(q => [q.id, q.modelAnswer, q.criteria.join('|'), q.sourceNote]), deck.id);
}
assert.notEqual(menu, subjectMenu, 'Bundled menu is never mutated');

// Device progress: the latest result decides whether a card is in "오답만 다시".
const store = new Map();
global.localStorage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
const sample = subjectDecks.find(d => d.id === 'social').cards.slice(0, 3);
recordResult(sample[0].id, 'w'); recordResult(sample[1].id, 'u'); recordResult(sample[2].id, 'c');
assert.deepEqual(missedCards(sample).map(c => c.id), [sample[0].id, sample[1].id]);
recordResult(sample[0].id, 'c');
assert.deepEqual(missedCards(sample).map(c => c.id), [sample[1].id]);
assert.equal(seenCount(sample), 3);
assert.match(store.get('johamin-progress-v1'), /"right":1,"wrong":1/);
resetProgress([sample[1].id]);
assert.equal(missedCards(sample).length, 0);
console.log(`PASS: ${rows.length} database rows rebuild every bundled deck exactly; device progress tracks the latest result.`);
