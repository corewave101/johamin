// 국어 · 「뉴욕제과점」: self-contained cards from the class notes, sizes, sources and a few readings.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { koreanNewyorkCards: cards, koreanNewyorkWritten: written, koreanNewyorkSource } = require('../data/korean-newyork-cards.ts');
const { subjectDecks } = require('../data/swipe-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');
const deck = subjectDecks.find(d => d.id === 'korean-newyork');
assert.equal(deck.cards, cards);
assert.equal(deck.writtenQuestions, written);
assert.equal(cards.length, 70);
assert.equal(written.length, 4);
const len = s => [...s].length;
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.ok(all.every(c => /^korean-newyork-(written-)?\d{3}$/.test(c.id)));
assert.equal(new Set(cards.map(c => `${c.subject}|${c.question}`)).size, cards.length);
for (const c of cards) {
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(c.subject && len(c.subject) <= 62 && len(c.question) <= 50, c.id);
  assert.ok(Object.values(c.answers).every(a => len(a) <= 26), c.id);
  assert.ok(c.explanation.length > 15 && c.sourceNote === koreanNewyorkSource, c.id);
  // The work is named or quoted on the card itself, and nothing points at a handout.
  assert.ok(/뉴욕제과점|"|'나'|불빛|고향 사람/.test(c.subject), c.id);
  assert.ok(!/(몇 그릇|몇 년|몇 번 테이블|언제 문을 닫)/.test(c.question), `${c.id}: ask meaning, not trivia`);
  assert.ok(!/(위 글|윗글|학습지|노트에서|앞 문제|위 그림)/.test(c.subject + c.question), c.id);
}
for (const q of written) assert.ok(q.criteria.length === 3 && q.modelAnswer.length > 80 && q.sourceNote === koreanNewyorkSource, q.id);
assert.equal(conceptsFor('korean-newyork').length, 2);
const answer = (shown, prompt = '') => { const c = cards.find(c => c.subject.includes(shown) && c.question.includes(prompt)); assert.ok(c, shown); return c.answers[c.correct]; };
assert.equal(answer('연필로 쓰기로'), '정성 들여 고쳐 가며 쓰려 함');
assert.equal(answer('곧잘 문맥을 놓친다'), '제과점을 보는 시각 차이');
assert.equal(answer('어차피 인생이란'), '설의법');
assert.equal(answer('상식적으로'), '담담히 받아들임');
assert.equal(answer('정상적인 세상에서'), '반어적으로 상실감 강조');
assert.equal(answer('그와 마찬가지다', '표현법'), '반어법');
assert.equal(answer('검정 봉투'), '자존심이 강함');
assert.equal(answer('전성기와 쇠퇴기'), '어머니 삶의 흐름');
assert.equal(answer('마음 변화'), '두려움→안도·희망→깨달음');
console.log(`PASS: 국어 뉴욕제과점 ${cards.length} self-contained choices + ${written.length} rubrics, sizes, sources, 2 concept lessons, readings from the notes.`);
