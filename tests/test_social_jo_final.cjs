// 기말고사 · 사회(조안나T) 1차시 「자본주의의 발달과 시장경제」: 학습 노트 1쪽 + 교과서 69쪽.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { socialJoFinalCards: cards, socialJoFinalWritten: written, NOTE, BOOK } = require('../data/social-jo-final-cards.ts');
const { finalMenu } = require('../data/final-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');

// 기말 사회 = 성신제T(←, 준비 중) · 조안나T(→), like the 중간고사 menu.
const social = finalMenu.children.find(n => n.id === 'humanities').children.find(n => n.name === '사회');
assert.equal(social.kind, 'group');
assert.deepEqual(social.children.map(d => [d.id, d.name, d.direction]), [['social-sung-final', '성신제T', 'left'], ['social-jo-final', '조안나T', 'right']]);
const deck = social.children[1];
assert.equal(deck.cards, cards);
assert.equal(deck.writtenQuestions, written);

assert.ok(cards.length >= 35, `${cards.length} cards`);
assert.ok(written.length >= 3);
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.ok(all.every(c => /^social-jo-final-(written-)?\d{3}$/.test(c.id)));
assert.equal(new Set(cards.map(c => c.question)).size, cards.length);
for (const c of cards) {
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(c.question.length <= 65, `${c.id} question ${c.question.length}`);
  assert.ok(Object.values(c.answers).every(a => a.length <= 17), `${c.id} answers`);
  assert.ok(c.explanation.length > 20 && [NOTE, BOOK].includes(c.sourceNote), c.id);
  assert.ok(/다\.$/.test(c.explanation), `${c.id}: 해설은 ~다.`);
  // One card is enough to solve it: no pointing at notes, pictures or other questions.
  assert.ok(!/(위 그림|다음 그림|자료에서|학습지|노트에서|교과서에서|앞 문제|빈칸)/.test(c.question), c.id);
}
for (const q of written) assert.ok(q.modelAnswer.length > 80 && q.criteria.length >= 3 && [NOTE, BOOK].includes(q.sourceNote), q.id);
const lessons = conceptsFor('social-jo-final');
assert.equal(lessons.length, 3);
for (const card of cards) assert.ok(lessons.some(l => l.topicKeys.includes(card.topic)), card.topic);

// Facts from the note and textbook, checked by meaning.
const correct = phrase => { const c = cards.find(c => c.question.includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct]; };
assert.equal(correct('개인의 경제적 자유를 최대로'), '자유방임주의'); // 노트 ❷ 필기('산업 자본주의')를 교과서 69쪽대로 고침
assert.equal(correct('금·은의 유출을 막고'), '중상주의');
assert.equal(correct('1929년 미국'), '대공황');
assert.equal(correct('경기 침체와 물가 상승이 함께'), '스태그플레이션');
assert.equal(correct('유효 수요'), '케인스');
assert.equal(correct('시장의 기능을 비유'), '보이지 않는 손');
assert.equal(correct('시장 가격에 따른'), '시장 경제 체제');
assert.equal(correct('전개된 순서'), '상업→산업→수정→신자유');
console.log(`PASS: 기말 사회 조안나T — ${cards.length} choices + ${written.length} rubrics, lengths, sources, ${lessons.length} concept lessons, note facts.`);
