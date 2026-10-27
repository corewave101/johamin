// Every deck must convert cleanly into the database card format (same rules as db/schema.sql).
const assert = require('node:assert/strict');
const { decks, cards } = require('../scripts/export-cards.cjs');
const { subjectDecks } = require('../data/swipe-subjects.ts');
const { finalMenu } = require('../data/final-subjects.ts');
const { lotteMenu } = require('../data/lotte-subjects.ts');
// 중간고사 decks + 기말 decks that already have cards ('준비 중' decks are not in the DB yet).
const flatten = g => g.children.flatMap(n => n.kind === 'group' ? flatten(n) : [n]);
const finals = flatten(finalMenu).filter(d => d.cards.length || d.writtenQuestions?.length);
// 4.8.0~ 롯데 페이지 덱(문제가 있는 것)도 DB에 들어간다.
const lottes = flatten(lotteMenu).filter(d => d.cards.length);
assert.equal(decks.length, subjectDecks.length + finals.length + lottes.length);
for (const d of lottes) assert.ok(decks.some(x => x.id === d.id), d.id);
for (const d of finals) assert.ok(decks.some(x => x.id === d.id && x.teacher !== undefined), d.id);
assert.equal(new Set(cards.map(c => c.id)).size, cards.length, 'Card ids must be unique across all decks');
for (const c of cards) {
  assert.ok(decks.some(d => d.id === c.deck_id), c.id);
  assert.ok(c.topic && c.question && c.answer && c.source_label, c.id);
  assert.ok(c.question.length <= 200, c.id);
  if (c.kind === 'choice') {
    assert.equal(c.wrong.length, 3, c.id);
    assert.equal(new Set([c.answer, ...c.wrong]).size, 4, c.id);
    assert.ok(c.answer.length <= 40 && c.explanation.length > 10, c.id);
  } else {
    assert.ok(c.criteria.length >= 1, c.id);
  }
}
console.log(`PASS: ${decks.length} decks, ${cards.length} cards convert to the database format.`);
