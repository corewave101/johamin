const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { socialCards, socialSources } = require('../data/social-cards.ts');
const { subjectDecks } = require('../data/swipe-subjects.ts');
const { newGame, answerCard } = require('../lib/swipe-game.ts');
assert.equal(socialCards.length, 166);
assert.equal(subjectDecks.find(d => d.id === 'social').cards, socialCards);
assert.equal(new Set(socialCards.map(c => c.id)).size, socialCards.length);
assert.equal(new Set(socialCards.map(c => c.question)).size, socialCards.length);
assert.equal(socialSources.length, 10);
for (const s of socialSources) assert.ok(socialCards.some(c => c.source.title === s.title), `No card from ${s.title}`);
for (const c of socialCards) {
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(c.question.length <= 65 && Object.values(c.answers).every(a => a.length <= 17), c.id);
  const source = socialSources.find(s => s.title === c.source.title);
  assert.ok(source && c.source.page >= 1 && c.source.page <= source.pages, c.id);
  assert.equal(c.source.teacher, '성신제T');
  assert.ok(c.explanation.length > 20 && !/(그림을|위 그림|다음 그림)/.test(c.question), c.id);
}
// The deck mixes the three requested twists: pairings, a question inside a question, and "not correct" picks.
const pairs = socialCards.filter(c => /A–B|A, .*B는/.test(c.question)).length;
const nested = socialCards.filter(c => /\bX\b/.test(c.question)).length;
const negative = socialCards.filter(c => c.question.includes('옳지 않은')).length;
assert.ok(pairs >= 25 && nested >= 40 && negative >= 25, `${pairs} pairs, ${nested} nested, ${negative} negative`);
const correct = phrase => { const c = socialCards.find(c => c.question.includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct]; };
assert.equal(correct('정언 명령으로 본 A'), '칸트–베카리아');
assert.equal(correct('서사적 자아를 말한 A'), '매킨타이어–샌델');
assert.equal(correct('취득·이전·교정의 원칙'), '최소 국가');
assert.equal(correct('분쟁 지역과 주요 원인'), '카슈미르–언어 차이');
const snapshot = JSON.stringify(socialCards);
let game = newGame(socialCards), first = game.queue[0];
game = answerCard(game, 'unknown', 1);
assert.equal(game.queue[12].id, first.id); assert.notEqual(game.queue[12].correct, first.correct);
assert.equal(JSON.stringify(socialCards), snapshot);
console.log(`PASS: 166 sourced social cards from 10 worksheets (${pairs} pairings, ${nested} nested, ${negative} "옳지 않은"), lengths, pages, retry.`);
