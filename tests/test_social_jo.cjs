const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { socialJoCards, socialJoWritten, socialJoSource } = require('../data/social-jo-cards.ts');
const { subjectMenu, subjectDecks } = require('../data/swipe-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');

// 사회 is split into two teacher parts; the original deck keeps its id so saved progress stays.
const humanities = subjectMenu.children.find(n => n.id === 'humanities');
const social = humanities.children.find(n => n.name === '사회');
assert.equal(social.kind, 'group');
assert.deepEqual(social.children.map(d => [d.id, d.name, d.direction]), [['social', '성신제T', 'left'], ['social-jo', '조안나T', 'right']]);
const deck = subjectDecks.find(d => d.id === 'social-jo');
assert.equal(deck.cards, socialJoCards);
assert.equal(deck.writtenQuestions, socialJoWritten);

assert.equal(socialJoCards.length, 49);
assert.equal(socialJoWritten.length, 4);
const all = [...socialJoCards, ...socialJoWritten];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.ok(all.every(c => /^social-jo-(written-)?\d{3}$/.test(c.id)));
assert.equal(new Set(socialJoCards.map(c => c.question)).size, socialJoCards.length);
for (const c of socialJoCards) {
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(c.question.length <= 65 && Object.values(c.answers).every(a => a.length <= 17), c.id);
  assert.ok(c.explanation.length > 20 && c.sourceNote === socialJoSource, c.id);
  // One card is enough to solve it: no pointing at notes, pictures or other questions.
  assert.ok(!/(위 그림|다음 그림|자료에서|학습지|노트에서|앞 문제)/.test(c.question), c.id);
}
for (const q of socialJoWritten) assert.ok(q.modelAnswer.length > 80 && q.criteria.length >= 3 && q.sourceNote === socialJoSource, q.id);
const lessons = conceptsFor('social-jo');
assert.equal(lessons.length, 4);
for (const card of socialJoCards) assert.ok(lessons.some(l => l.topicKeys.includes(card.topic)), card.topic);

// A few facts from the note, checked by meaning rather than by shape.
const correct = phrase => { const c = socialJoCards.find(c => c.question.includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct]; };
assert.equal(correct('무엇으로써 제한'), '법률');
assert.equal(correct('2권 분립 A'), '로크–몽테스키외');
assert.equal(correct('X를 제청하는 곳'), '법원');
assert.equal(correct('제청 신청을 법원이 기각'), '위헌 심사형 헌법 소원');
assert.equal(correct('법 개정 때까지 효력'), '헌법 불합치');
assert.equal(correct('선거구를 법률로'), '게리맨더링');
console.log(`PASS: 사회 split into 성신제T · 조안나T; ${socialJoCards.length} 조안나T choices + ${socialJoWritten.length} rubrics, lengths, sources, 4 concept lessons, note facts.`);
