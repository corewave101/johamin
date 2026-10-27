// 기말고사 · 사회(성신제T): 중간고사 뭉탱이처럼 학습지 하나 = 에디션 하나. 학습지 213(피라미드 에디션), 214(부양비 에디션).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { socialSungFinalCards: cards, socialSungFinalWritten: written, socialSungFinalEditions: editions, socialSungFinalSources: sources } = require('../data/social-sung-final-cards.ts');
const { socialBulkCards } = require('../data/social-bulk-cards.ts');
const { finalMenu } = require('../data/final-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');
const { isShortQuestion } = require('../data/study-practice.ts');

const social = finalMenu.children.find(n => n.id === 'humanities').children.find(n => n.name === '사회');
const deck = social.children.find(d => d.id === 'social-sung-final');
assert.equal(deck.direction, 'left');
assert.equal(deck.cards, cards);
assert.equal(deck.writtenQuestions, written);
assert.equal(editions[0].key, '213', '기말 성신제T는 학습지 213부터');

const len = s => [...s].length;
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.equal(new Set(cards.map(c => c.question)).size, cards.length);
const midterm = new Set(socialBulkCards.map(c => c.question));
for (const c of cards) {
  assert.match(c.id, /^social-sung-final-\d{3}-\d{3}$/);
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(len(c.question) <= 65 && Object.values(c.answers).every(a => len(a) <= 20), `${c.id} ${len(c.question)}`);
  assert.ok(c.explanation.length > 20, c.id);
  assert.ok(!/(위 그림|다음 그림|학습지에서|앞 문제|위 자료)/.test(c.question), c.id);
  assert.ok(!midterm.has(c.question), `${c.id}: same question as a 중간고사 card`);
  const source = sources.find(s => s.title === c.source.title);
  assert.ok(source && c.source.teacher === '성신제T' && c.source.page >= 1 && c.source.page <= source.pages, c.id);
}
for (const e of editions) {
  const n = cards.filter(c => c.topic === e.name).length;
  assert.ok(n >= 50, `${e.name}: ${n} cards (an edition digs deep)`);
  assert.ok(/에디션$/.test(e.name), e.name);
}
const rubrics = written.filter(q => /^social-sung-final-/.test(q.id));
for (const q of rubrics) assert.ok(q.criteria.length >= 3 && q.modelAnswer.length > 100, q.id);
const short = written.filter(isShortQuestion), reasons = written.filter(q => q.id.startsWith('practice-written-'));
assert.ok(short.length >= 15 && reasons.length >= short.length, `${short.length} short, ${reasons.length} reason-writing`);
for (const q of short) assert.ok([...q.modelAnswer].length <= 10 && !q.modelAnswer.includes('–'), q.id);
assert.equal(conceptsFor('social-sung-final').length, editions.length);

// Facts from 학습지 213 (and the 필기 on it), checked by meaning.
const correct = phrase => { const c = cards.find(c => c.question.includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct]; };
assert.equal(correct('인구 밀도(국제 연합 2024)가 가장 높은'), '아시아');
assert.equal(correct('생산 가능 인구라고도'), '15~64세');
assert.equal(correct('0~14세 비중이 약 40%로 가장 높은 대륙'), '아프리카');
assert.equal(correct('일본과 한국의 인구 피라미드'), '방추형→역피라미드형');
assert.equal(correct('프랑스와 스웨덴이'), '출산 장려 정책');
assert.equal(correct('성비가 105'), '남초');
assert.equal(correct('가임 기간은'), '15~49세');
// Facts from 학습지 214.
assert.equal(editions[1].key, '214');
assert.equal(correct('사망률이 출생률보다 높아져 인구가 자연적으로'), '5단계 감소기');
assert.equal(correct('유소년층 인구에 대한 노년층 인구의 비율'), '노령화 지수');
assert.equal(correct('고령 사회의 범위'), '14~20%');
assert.equal(correct('고령 30%인 지역의 노령화 지수'), '150');
assert.equal(correct('2050년(추정)은'), '16.7% → 39.4%');
assert.equal(correct('로힝야족'), '미얀마');
assert.equal(correct('투발루 난민'), '환경적 원인');
assert.equal(correct('76%로 가장 높은'), '싱가포르');
console.log(`PASS: 기말 성신제T ${editions.map(e => `${e.key} ${e.name}`).join(', ')} — ${cards.length} choices + ${rubrics.length} rubrics + ${short.length} short + ${reasons.length} reason-writing, sizes, sources, no repeats of 중간고사.`);
