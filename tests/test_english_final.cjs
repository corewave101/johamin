// 기말고사 · 영어(진달래T) 학습지 추가 1번 「연결사와 접속사」.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { englishFinalCards: cards, englishFinalWritten: written, NOTE } = require('../data/english-final-cards.ts');
const { finalMenu } = require('../data/final-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');
const { isEnglishWordCard } = require('../data/english-words.ts');

const deck = finalMenu.children.find(n => n.id === 'humanities').children.find(n => n.id === 'english-final');
assert.equal(deck.direction, 'right');
assert.equal(deck.cards, cards);
assert.equal(deck.writtenQuestions, written);

assert.ok(cards.length >= 35, `${cards.length} cards`);
assert.equal(written.length, 3);
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.ok(all.every(c => /^english-final-(written-)?\d{3}$/.test(c.id)));
assert.ok(cards.every(c => !isEnglishWordCard(c)), '단어 문제 카드 패로 빠지지 않는다');
assert.equal(new Set(cards.map(c => c.question)).size, cards.length);
for (const c of cards) {
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok([...c.question].length <= 80, `${c.id} question ${[...c.question].length}`);
  assert.ok(Object.values(c.answers).every(a => [...a].length <= 30), `${c.id} answers`);
  assert.ok(c.explanation.length > 16 && c.sourceNote === NOTE, c.id);
  assert.ok(!/(위 그림|학습지에서|앞 문제|위 자료|표에서)/.test(c.question), c.id);
}
for (const q of written) assert.ok(q.modelAnswer.length > 100 && q.criteria.length >= 3 && q.sourceNote === NOTE, q.id);
const lessons = conceptsFor('english-final');
assert.equal(lessons.length, 2);
for (const card of cards) assert.ok(lessons.some(l => l.topicKeys.includes(card.topic)), card.topic);

// Grammar from the worksheet (and the two corrected notes), checked by meaning.
const correct = phrase => { const c = cards.find(c => c.question.includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct]; };
assert.equal(correct('It rained heavily. ___, the game continued.'), 'However'); // ★ 문장 맨 앞 연결사 자리
assert.equal(correct('실제로 비가 많이 왔던 일'), 'Even though');            // ★ even if가 아님
assert.equal(correct('The game continued ___ the heavy rain.'), 'despite');
assert.equal(correct('(원인, ___ 결과)'), 'so');
assert.equal(correct('(결과, ___ 원인)'), 'for');
assert.equal(correct('We arrived late ___ the blocked road.'), 'due to');
assert.equal(correct('등위접속사가 아닌 것은?'), 'although');
console.log(`PASS: 기말 영어 진달래T — ${cards.length} choices + ${written.length} rubrics, lengths, source, ${lessons.length} concept lessons, grammar facts.`);
