// 생물(조용민T) · 뭉탱이: 전사·번역 에디션, 카드 한 장만 보고 풀 수 있는 객관식만.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { biologyJoBulkCards: cards, biologyJoBulkEditions: editions } = require('../data/biology-jo-bulk-cards.ts');
const { joCards } = require('../data/biology-cards.ts');
const { subjectMenu, subjectDecks } = require('../data/swipe-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');

// 조용민T is split like 성신제T: ← 기본 (old deck id kept so saved progress stays) / → 뭉탱이.
const biology = subjectMenu.children.find(n => n.id === 'science').children.find(n => n.id === 'biology');
const jo = biology.children.find(n => n.name === '조용민T');
assert.equal(jo.kind, 'group');
assert.deepEqual(jo.children.map(d => [d.id, d.name, d.direction]), [['biology-jo', '기본', 'left'], ['biology-jo-bulk', '뭉탱이', 'right']]);
assert.equal(subjectDecks.find(d => d.id === 'biology-jo').cards.slice(0, joCards.length).length, joCards.length);
assert.equal(subjectDecks.find(d => d.id === 'biology-jo-bulk').cards, cards);

const len = s => [...s].length;
const old = new Set(joCards.map(c => c.question));
assert.equal(new Set(cards.map(c => c.id)).size, cards.length);
assert.equal(new Set(cards.map(c => c.question)).size, cards.length);
for (const c of cards) {
  assert.match(c.id, /^biology-jo-bulk-(tx|tl)-\d{3}$/);
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(len(c.question) <= 65 && Object.values(c.answers).every(a => len(a) <= 20), c.id);
  assert.ok(c.explanation.length > 20, c.id);
  assert.ok(!/(위 그림|다음 그림|학습지에서|앞 문제|위 자료)/.test(c.question), c.id);
  assert.ok(!old.has(c.question), `${c.id}: same question as the 기본 deck`);
  const edition = editions.find(e => e.name === c.topic);
  assert.ok(edition, c.id);
  assert.ok(c.source.teacher === '조용민T' && c.source.url.startsWith('https://drive.google.com/'), c.id);
  // 전사 에디션 = 3~14쪽 (7쪽 비주형 가닥 카드 포함), 번역 에디션 = 15~25쪽.
  assert.ok(c.source.page >= edition.pages[0] && c.source.page <= edition.pages[1], `${c.id}: page ${c.source.page}`);
}
for (const e of editions) {
  const n = cards.filter(c => c.topic === e.name).length;
  assert.ok(n >= 50, `${e.name}: ${n} cards (an edition digs deep)`);
  assert.ok(/에디션$/.test(e.name), e.name);
}
assert.equal(conceptsFor('biology-jo-bulk').length, editions.length);

// Content traps: PPT wording is kept, handwritten slips are corrected.
const correct = phrase => { const c = cards.find(c => c.question.includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct]; };
assert.equal(correct('-10 지역의 공통 서열'), 'TATAAT');
assert.equal(correct('진핵 TATA 상자의 공통 서열'), 'TATAAA');
assert.equal(correct('α-아마니틴에 전혀'), 'RNA pol. Ⅰ');
assert.equal(correct('RNA 간섭(RNAi)이 작용하는 방식'), '상보적 RNA 분해·번역 억제');
assert.equal(correct('3′-GAU-5′'), 'CUA, CUG');
assert.equal(correct('3′-UAI-5′'), '5′-AUG-3′');
assert.equal(correct('Leu(류신)를 지정하는 코돈의 개수'), '6개');
assert.equal(correct('GTP를 쓰지 않는 단계'), '펩타이드 결합 형성');
console.log(`PASS: 조용민T 뭉탱이 ${editions.map(e => `${e.name} ${cards.filter(c => c.topic === e.name).length}`).join(', ')} — sizes, pages, sources, no repeats of the 기본 deck.`);
