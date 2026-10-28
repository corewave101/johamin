// 기말고사 · 국어(백은미T): 「춘향전」 · 「봉산 탈춤」 카드 규격, 근거, 학습지 정답 표시와 필기 내용을 확인한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { koreanFinalCards: cards, koreanFinalWritten: written, KOREAN_FINAL_TOPICS: topics } = require('../data/korean-final-cards.ts');
const { finalMenu } = require('../data/final-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');

const deck = finalMenu.children.find(n => n.id === 'humanities').children.find(n => n.id === 'korean-final');
assert.equal(deck.fullName, '국어(백은미T · 기말)');
assert.equal(deck.cards, cards);
assert.equal(deck.writtenQuestions, written);

const len = s => [...s].length;
assert.ok(cards.length >= 100, `${cards.length} cards`);
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.equal(new Set(cards.map(c => c.question)).size, cards.length);
for (const c of cards) {
  assert.match(c.id, /^korean-final-\d{3}$/);
  assert.ok(topics.includes(c.topic), c.id);
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(len(c.question) <= 70 && Object.values(c.answers).every(a => len(a) <= 26), `${c.id} size`);
  assert.ok(c.explanation.length > 16 && /다\.$/.test(c.explanation), c.id);
  assert.match(c.sourceNote, /^백은미T · (공통국어2 교과서 1(2[89]|3[0-5])쪽|춘향전·봉산 탈춤 학습지 [1-6]쪽|수업 필기)$/, c.id);
  assert.ok(!/(위 그림|다음 그림|학습지에서|앞 문제|위 자료|윗글|\((가|나)\) 장면)/.test(c.question), `${c.id} self-contained`);
}
for (const t of topics) assert.ok(cards.filter(c => c.topic === t).length >= 7, t);
const rubrics = written.filter(q => q.id.startsWith('korean-final-written-'));
assert.equal(rubrics.length, 4);
for (const q of rubrics) assert.ok(q.criteria.length >= 3 && q.modelAnswer.length > 150, q.id);
const lessons = conceptsFor('korean-final');
assert.equal(lessons.length, 3);
assert.deepEqual([...new Set(lessons.flatMap(l => l.topicKeys))].sort(), [...topics].sort());

// 학습지 정답 표시 · 필기와 같은지 (뜻으로 확인)
const correct = phrase => { const c = cards.find(c => c.question.includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct]; };
assert.equal(correct('「춘향전」의 서술 시점'), '3인칭 전지적 작가 시점');
assert.equal(correct('「춘향전」의 공간적 배경'), '전라도 남원');
assert.equal(correct('「봉산 탈춤」의 공간적 배경'), '황해도 봉산');
assert.equal(correct('"금 술잔의 아름다운 술"'), '백성의 피');
assert.equal(correct('"노랫소리 높은 곳"'), '원망 소리');
assert.equal(correct('1행과 2행, 3행과 4행'), '대구법');
assert.equal(correct('어찌 아니 명관(名官)인가."에 쓰인 표현법'), '반어법');
assert.equal(correct('"갈비 한 대 먹고지고."'), '중의적 표현');
assert.equal(correct('"문 들어온다 바람 닫아라. 물 마르다 목 들여라."에 쓰인'), '말의 순서를 바꾼 언어유희');
assert.equal(correct('"대감"은 누구'), '이몽룡의 아버지');
assert.equal(correct('되풀이되는 재담 구조'), '조롱 → 호통 → 변명 → 안심');                // 학습지 5쪽 2번 ⑤
assert.equal(correct('가면극의 일반적 특징'), '과장의 인물 · 사건이 유기적임');               // 1번 ⑤
assert.equal(correct('"쉬이."가 하는 기능'), '양반에 대한 풍자를 강화함');                  // 3번 ④ (ㄷ만 아님)
assert.equal(correct('말뚝이와 양반의 관계'), '순종하는 척하나 속으로 무시함');              // 4번 ④
assert.equal(correct('굿거리장단으로 모두 춤을 춘다'), '무대를 관객석까지 확대함');          // 5번 ②
assert.equal(correct('알 수 있는 당대 사회상으로 알맞지 않은'), '매관매직의 세태가 팽배함'); // 8번 ③
assert.equal(correct('취발이가 대변하는 계층'), '조선 후기 신흥 상인 세력');
console.log(`PASS: 기말 국어 백은미T — 객관식 ${cards.length} (${topics.map(t => `${t} ${cards.filter(c => c.topic === t).length}`).join(', ')}) + 서술형 ${rubrics.length} + 연습 ${written.length - rubrics.length} · 개념 ${lessons.length}`);
