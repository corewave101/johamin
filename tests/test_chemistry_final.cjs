// 기말고사 · 화학(주민지T) 「Ⅲ. 탄소 화합물과 반응」: 수업 PPT 1~5번, 6.6.0~ PPT 7~9번(그림 카드 포함).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { chemistryFinalCards: cards, chemistryFinalWritten: written } = require('../data/chemistry-final-cards.ts');
const { finalMenu } = require('../data/final-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');

const flatten = g => g.children.flatMap(n => n.kind === 'group' ? flatten(n) : [n]);
const deck = flatten(finalMenu).find(d => d.id === 'chemistry-final');
assert.equal(deck.cards, cards);
assert.equal(deck.writtenQuestions, written);

assert.ok(cards.length >= 60, `${cards.length} cards`);
assert.equal(written.length, 4);
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.ok(all.every(c => /^chemistry-final-(written-)?\d{3}$/.test(c.id)));
assert.equal(new Set(cards.map(c => c.question)).size, cards.length);
const pages = { 1: 21, 2: 15, 3: 6, 4: 8, 5: 12, 7: 5 }; // PDF 쪽수 (7번은 5쪽까지 확인)
// 6.6.0~ PPT 8 · 9번은 파일 전체가 한 탐구라 쪽 대신 ‘전체’로 적는다(저장소 주인 확인). 다른 PPT에는 ‘전체’를 쓰지 않는다.
for (const c of [...cards, ...written]) {
  const m = /^주민지T PPT (\d) · (?:(\d+)쪽|전체)$/.exec(c.sourceNote);
  assert.ok(m, `${c.id}: ${c.sourceNote}`);
  if (m[2] === undefined) assert.ok(m[1] === '8' || m[1] === '9', `${c.id}: ‘전체’는 PPT 8 · 9번만`);
  else assert.ok(Number(m[2]) >= 1 && Number(m[2]) <= pages[m[1]], `${c.id}: ${c.sourceNote}`);
}
for (const c of cards) {
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(c.question.length <= 80, `${c.id} question ${c.question.length}`);
  assert.ok(Object.values(c.answers).every(a => a.length <= 22), `${c.id} answers`);
  assert.ok(c.explanation.length > 16 && /다\.$/.test(c.explanation), c.id);
  assert.ok(!/(위 그림|다음 그림|PPT에서|슬라이드|앞 문제|자료에서)/.test(c.question), c.id);
}
for (const q of written) assert.ok(q.modelAnswer.length > 80 && q.criteria.length >= 3, q.id);
const lessons = conceptsFor('chemistry-final');
assert.equal(lessons.length, 6); // +1: PPT 6 · 7 탄화수소 유도체(5.1.1), +1: PPT 8 · 9 산화제 · 에스터 · 은거울 · 바나나향(6.6.0)
for (const card of cards) assert.ok(lessons.some(l => l.topicKeys.includes(card.topic)), card.topic);

// Facts from the PPT, checked by meaning.
const correct = phrase => { const c = cards.find(c => c.question.includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct]; };
assert.equal(correct('알케인의 일반식'), 'CₙH₂ₙ₊₂');
assert.equal(correct('정삼각형 구조인 사이클로프로페인'), '60°');
assert.equal(correct('두 형태 중 더 안정'), '의자형');
assert.equal(correct('CH₃CH₂CH₂C≡CCH₂CH₃'), '3-헵타인');
assert.equal(correct('CH₂=CHCH₂CH₃'), '1-뷰텐');
assert.equal(correct('펜테인(C₅H₁₂)의 구조 이성질체 수'), '3개');
assert.equal(correct('알카인의 삼중 결합 탄소'), 'sp');
assert.equal(correct('2-뷰탄올'), '이차 알코올');
// 6.6.0~ 그림 카드: 덱이 그림 칸을 켜고, 그림 파일이 있고, 그림이 있는 카드만 ‘그림의 …’을 묻는다. DB로 내보낼 때도 그림 열이 따라간다.
assert.equal(deck.figures, true);
const figureCards = cards.filter(c => c.figure);
assert.equal(figureCards.length, 4);
for (const c of figureCards) {
  assert.ok(/^figures\/chemistry\/[a-z-]+\.webp$/.test(c.figure.src) && fs.existsSync(`public/${c.figure.src}`), c.id);
  assert.ok(c.figure.alt.length > 10 && /그림/.test(c.question), c.id);
}
for (const c of cards.filter(c => !c.figure)) assert.ok(!/그림의 |그림처럼/.test(c.question), `${c.id}: asks about a figure it does not have`);
const { cards: exported } = require('../scripts/export-cards.cjs');
const rows = exported.filter(r => r.deck_id === 'chemistry-final' && r.kind === 'choice');
assert.equal(rows.length, cards.length);
for (const r of rows) assert.equal(r.figure_src, cards.find(c => c.id === r.id).figure?.src, r.id);
// 6.6.0~ PPT 7~9: 산화제 세기 · 에스터화 · 은거울 · 음주 측정기 · 바나나향.
assert.equal(correct('1-propanol을 PCC로 산화하면 A'), 'A 알데하이드 · B 카복실산');
assert.equal(correct('2-propanol을 PCC로'), '둘 다 케톤으로 같다');
assert.equal(correct('PCC를 쓰는 방법'), '고체 그대로, 물 없이 쓴다');
assert.equal(correct('끊어지는 결합 두 개'), '① · ③');
assert.equal(correct('산화되는 것과 환원되는 것'), '포도당의 –CHO · Ag⁺');
assert.equal(correct('주황색에서 초록색'), 'Cr⁶⁺→Cr³⁺ · 에탄올→아세트산');
assert.equal(correct('진한 황산을 넣는 까닭'), '생기는 물을 없애 반응을 돕는다');
console.log(`PASS: 기말 화학 주민지T — ${cards.length} choices (${figureCards.length} figure) + ${written.length} rubrics, PPT pages, lengths, ${lessons.length} concept lessons, PPT facts.`);
