// Every deck must convert cleanly into the database card format (same rules as db/schema.sql).
const assert = require('node:assert/strict');
const { decks, cards } = require('../scripts/export-cards.cjs');
const { subjectDecks } = require('../data/swipe-subjects.ts');
assert.equal(decks.length, subjectDecks.length);
assert.equal(new Set(cards.map(c => c.id)).size, cards.length, 'Card ids must be unique across all decks');
for (const c of cards) {
  assert.ok(decks.some(d => d.id === c.deck_id), c.id);
  assert.ok(c.topic && c.question && c.answer && c.source_label, c.id);
  assert.ok(c.question.length <= 200, c.id);
  if (c.kind === 'choice') {
    assert.equal(c.wrong.length, 3, c.id);
    assert.equal(new Set([c.answer, ...c.wrong]).size, 4, c.id);
    assert.ok(c.answer.length <= 30 && c.explanation.length > 10, c.id);
  } else {
    assert.ok(c.criteria.length >= 1, c.id);
  }
}
console.log(`PASS: ${decks.length} decks, ${cards.length} cards convert to the database format.`);
