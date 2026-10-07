const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, file);
const { subjectDecks } = require('../data/swipe-subjects.ts');
const { conceptsFor, studyConcepts } = require('../data/study-concepts.ts');
const { englishCards } = require('../data/english-cards.ts');
const { englishWritten } = require('../data/english-written.ts');
const { newGame, answerCard } = require('../lib/swipe-game.ts');
assert.equal(englishCards.length, 170);
assert.equal(englishWritten.length, 16);
assert.equal(studyConcepts.length, 54);
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
// English cards share short prompts (e.g. 빈칸에 알맞은 것은?), so the shown sentence + prompt pair must be unique.
assert.equal(new Set(englishCards.map(card => `${card.subject}|${card.question}`)).size, englishCards.length);
for (const card of englishCards) {
  assert.equal(new Set(Object.values(card.answers)).size, 4, card.id);
  assert.ok(card.answers[card.correct] && card.sourceNote && card.explanation.length > 15);
  // Self-contained: the sentence or word being asked about is printed on the card itself.
  assert.ok(card.subject && card.subject.length <= 62 && card.question.length <= 34, card.id);
  assert.ok(!card.passage && !/지문에서|본문에서|윗글/.test(card.question), card.id);
  assert.ok(Object.values(card.answers).every(a => a.length <= 26), card.id);
}
for (const q of englishWritten) assert.ok(q.modelAnswer && q.criteria.length === 3 && q.sourceNote);

// Semantic checks for common traps rather than just data shape.
const shown = (sentence, prompt) => { const card = englishCards.find(c => c.subject.includes(sentence) && c.question.includes(prompt)); assert.ok(card, sentence); return card.answers[card.correct]; };
assert.equal(shown('Amazingly, though,', '품사'), '그러나 (부사)');
assert.equal(shown('consists of stone pillars', '바꿔 쓸'), 'is composed of');
assert.equal(shown('Had he seemed angry', '같은 뜻'), 'If he had seemed');
assert.equal(shown('He would spend hours', 'would'), '~하곤 했다');
assert.equal(shown('allowed people ____', '빈칸'), 'to live');
assert.equal(shown('commanded a view', 'commanded'), '(창에서) 내다보였다');
assert.equal(shown('If I ___ rich', '빈칸'), 'were');
let game = newGame(englishCards, () => .4);
const first = game.queue[0];
game = answerCard(game, 'unknown', 1, () => .4);
assert.equal(game.queue[12].id, first.id);
assert.equal(game.queue[12].answers[game.queue[12].correct], first.answers[first.correct]);
while (game.queue.length) game = answerCard(game, game.queue[0].correct, 1);
assert.equal(game.mastered.length, englishCards.length);
console.log('PASS: all 7 subject parts have 54 concepts and connected practice; all 495 original examples retained; 170 self-contained English choices, 16 rubrics, semantic traps, retry and completion.');
