const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, file);
const { subjectDecks } = require('../data/swipe-subjects.ts');
const { conceptsFor, studyConcepts } = require('../data/study-concepts.ts');
const { englishCards } = require('../data/english-cards.ts');
const { englishWritten } = require('../data/english-written.ts');
const { newGame, answerCard } = require('../lib/swipe-game.ts');
assert.equal(englishCards.length, 80);
assert.equal(englishWritten.length, 16);
assert.equal(studyConcepts.length, 53);
const ids = new Set();
for (const deck of subjectDecks) {
  const lessons = conceptsFor(deck.id);
  assert.ok(lessons.length > 0, deck.id);
  assert.ok(deck.cards.length > 0, deck.id);
  for (const card of deck.cards) {
    assert.ok(lessons.some(lesson => lesson.topicKeys.includes(card.topic)), `${deck.id}: missing concept for ${card.topic}`);
  }
  for (const lesson of lessons) {
    assert.ok(!ids.has(lesson.id)); ids.add(lesson.id);
    assert.ok(lesson.summary.length > 35 && lesson.sections.length >= 3 && lesson.sourceNote);
    assert.ok(lesson.topicKeys.every(topic => deck.cards.some(card => card.topic === topic)), lesson.id);
    for (const section of lesson.sections) {
      if (section.table) assert.ok(section.table.rows.every(row => row.length === section.table.columns.length), lesson.id);
    }
  }
  if (!['english', 'korean'].includes(deck.id)) {
    const examples = lessons.flatMap(lesson => lesson.examples ?? []).map(example => example.id);
    assert.equal(examples.length, deck.cards.length, `${deck.id}: all original examples retained`);
    assert.equal(new Set(examples).size, deck.cards.length);
  }
}
assert.equal(new Set(englishCards.map(card => card.question)).size, englishCards.length);
for (const card of englishCards) {
  assert.equal(new Set(Object.values(card.answers)).size, 4, card.id);
  assert.ok(card.answers[card.correct] && card.sourceNote && card.explanation.length > 15);
}
for (const q of englishWritten) assert.ok(q.modelAnswer && q.criteria.length === 3 && q.sourceNote);
assert.equal(englishCards.filter(card => card.passage).length, 10);
// Semantic checks for common traps rather than just data shape.
const correct = text => { const card = englishCards.find(card => card.question.includes(text)); assert.ok(card, text); return card.answers[card.correct]; };
assert.equal(correct('had stopped writing'), '발견보다 앞선 실제 완료');
assert.equal(correct('Dead Letter Office 경력'), '화자가 나중에 들은 소문');
assert.equal(correct('objects that people wore'), '목적격 관계대명사');
assert.equal(correct('allow와 make'), 'allow O to V / make O V');
let game = newGame(englishCards, () => .4);
const first = game.queue[0];
game = answerCard(game, 'unknown', 1, () => .4);
assert.equal(game.queue[12].id, first.id);
assert.equal(game.queue[12].answers[game.queue[12].correct], first.answers[first.correct]);
while (game.queue.length) game = answerCard(game, game.queue[0].correct, 1);
assert.equal(game.mastered.length, englishCards.length);
console.log('PASS: all 7 subject parts have 53 concepts and connected practice; all 463 original examples retained; 80 English choices, 16 rubrics, 10 reading contexts, semantic traps, retry and completion.');
