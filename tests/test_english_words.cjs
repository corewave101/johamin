// 영어 단어 문제: 학습지 1~4 검은 단어 필기 → 영단어를 보고 본문 속 뜻 + 품사를 고르는 4지선다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { englishWordCards, englishWordUnits, englishWordReview, isEnglishWordCard } = require('../data/english-words.ts');
const { englishCards } = require('../data/english-cards.ts');
const { subjectDecks } = require('../data/swipe-subjects.ts');

assert.ok(englishWordCards.length >= 150, 'every black-note word from 학습지 1~4');
assert.equal(new Set(englishWordCards.map(c => c.id)).size, englishWordCards.length);
englishWordCards.forEach((card, i) => assert.equal(card.id, `english-word-${String(i + 1).padStart(3, '0')}`));
for (const unit of englishWordUnits) assert.ok(englishWordCards.filter(c => c.topic === unit).length >= 25, unit);
for (const card of englishWordCards) {
  assert.ok(isEnglishWordCard(card) && card.subject && card.correct === 'up', card.id);
  const options = Object.values(card.answers);
  assert.equal(new Set(options).size, 4, card.id);
  // 보기마다 품사 + 뜻: "(형) 박식한"
  for (const option of options) assert.ok(/^\((명|동|형|부|전|접|숙어)\) \S/.test(option) && option.length <= 40, `${card.id}: ${option}`);
  // 카드 한 장으로 풀 수 있게: 본문 구절을 따옴표로 보여 주거나 필기 단어임을 밝힌다.
  assert.ok(/^“.+” 속 뜻과 품사는\?$/.test(card.question) || /필기한 .+의 뜻과 품사는\?$/.test(card.question), card.id);
  assert.ok(!/(위 자료|학습지에서|앞 문제)/.test(card.question), card.id);
  assert.ok(card.explanation.length >= 16 && card.explanation.includes(card.subject), card.id);
  assert.match(card.sourceNote, /^영어 학습지[1-4] · \d쪽 단어 필기$/);
}
// 품사 함정: 같은 단어의 다른 품사가 오답으로 들어간다.
const pick = word => englishWordCards.find(c => c.subject === word);
assert.equal(pick('rose').answers.up, '(동) 올라갔다(rise의 과거형)');
assert.ok(Object.values(pick('rose').answers).includes('(명) 장미'));
assert.ok(Object.values(pick('though').answers).includes('(접) 비록 ~이지만'));
assert.equal(pick('noble').answers.up, '(명) 귀족');
// 필기를 고친 단어는 해설과 검토 메모에 ☆로 남긴다.
assert.ok(pick('weep').answers.up.startsWith('(동) 울다') && pick('weep').explanation.includes('☆'));
assert.ok(Object.keys(englishWordReview).length >= 5);
// 영어 덱 안에서 본문 문제와 함께 저장되고, 본문 문제(englishCards)는 그대로다.
const english = subjectDecks.find(d => d.id === 'english');
assert.equal(english.cards.length, englishCards.length + englishWordCards.length);
assert.equal(englishCards.length, 170);
console.log(`english words ok: ${englishWordCards.length} cards`);
