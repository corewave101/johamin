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
assert.ok(cards.length >= 60, `${cards.length} cards`);
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.equal(new Set(cards.map(c => c.question + (c.passage ?? ''))).size, cards.length);
// 1차 카드(001~119)는 학생 풀이 기록에 남아 있을 수 있어 번호를 다시 쓰지 않는다.
for (const c of cards) assert.ok(Number(c.id.slice(-3)) >= 120, `${c.id} reuses a 1차 id`);
for (const c of cards) {
  assert.match(c.id, /^korean-final-\d{3}$/);
  assert.ok(topics.includes(c.topic), c.id);
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(len(c.question) <= 70 && Object.values(c.answers).every(a => len(a) <= 26), `${c.id} size`);
  assert.ok(c.explanation.length > 16 && /다\.$/.test(c.explanation), c.id);
  assert.match(c.sourceNote, /^백은미T · (공통국어2 교과서 1(2[89]|3[0-5])쪽|춘향전·봉산 탈춤 학습지 [1-6]쪽|수업 필기)$/, c.id);
  assert.ok(!/(위 그림|다음 그림|학습지에서|앞 문제|위 자료|윗글|위 지문|\((가|나)\) 장면|\[ \])/.test(c.question), `${c.id} self-contained`);
  // "밑줄 친 부분"을 묻는 카드는 지문에 [밑줄]이 있어야 하고, 지문은 카드 아래 칸에 다 들어갈 길이.
  if (/밑줄 친/.test(c.question)) assert.ok(/\[[^\]\s][^\]]*\]/.test(c.passage ?? ''), `${c.id} needs a marked passage`);
  if (c.passage) assert.ok(len(c.passage) >= 20 && len(c.passage) <= 320, `${c.id} passage length ${len(c.passage)}`);
}
assert.ok(cards.filter(c => c.passage).length >= cards.length * 0.6, 'most cards read a passage (학습지 수준)');
for (const t of topics) assert.ok(cards.filter(c => c.topic === t).length >= 5, t);
const rubrics = written.filter(q => q.id.startsWith('korean-final-written-'));
assert.equal(rubrics.length, 6);
for (const q of rubrics) assert.ok(q.criteria.length >= 3 && q.modelAnswer.length > 150 && Number(q.id.slice(-3)) >= 5, q.id);
const lessons = conceptsFor('korean-final');
assert.equal(lessons.length, 7);
assert.deepEqual([...new Set(lessons.flatMap(l => l.topicKeys))].sort(), [...topics].sort());
for (const l of lessons) assert.ok(!/sc-\d/.test(l.sourceNote + JSON.stringify(l.sections)), `${l.id} cites a scratch file name`);

// 학습지 정답 표시 · 필기와 같은지 (뜻으로 확인)
const correct = phrase => { const c = cards.find(c => c.question.includes(phrase) || (c.passage ?? '').includes(phrase)); assert.ok(c, phrase); return c.answers[c.correct]; };
const by = (q, p) => { const c = cards.find(c => c.question.includes(q) && (c.passage ?? '').includes(p)); assert.ok(c, `${q} / ${p}`); return c.answers[c.correct]; };
assert.equal(correct('가면극(탈춤)의 일반적 특징'), '여러 과장이 유기적으로 연결된다');              // 학습지 5쪽 1번 ⑤
assert.equal(correct('되풀이되는 재담 구조'), '조롱 → 호통 → 변명 → 안심');                        // 2번 ⑤
assert.equal(by('기능으로 알맞지 않은', '[쉬이.]'), '양반에 대한 풍자를 강화한다');                   // 3번 ④ (ㄷ만 아님)
assert.equal(correct('말뚝이에 대한 설명으로 가장 알맞은'), '순종하는 척하나 속으로는 무시한다');    // 4번 ④
assert.equal(by('알맞지 않은', '[굿거리장단으로 모두 춤을 춘다.]'), '무대를 관객석까지 확대한다');  // 5번 ②
assert.equal(by('알맞은', '[샌님과 서방님은 흰 창옷에 관을 썼다.]'), '양반의 위엄을 드러낸다');     // 6번 ② 오답 처리
assert.equal(by('알맞지 않은', '날램이 비호(飛虎) 같은데]'), '취발이가 가진 부정행위를 암시한다');  // 9번 ⑤
assert.equal(correct('당대 사회상으로 알맞지 않은'), '매관매직의 세태가 팽배했다');                  // 8번 ③
assert.equal(correct('취발이가 대변하는 계층'), '조선 후기의 신흥 상인 세력');
assert.equal(by('표현 방법으로 알맞은', '[문 들어온다 바람 닫아라.'), '말의 순서를 뒤바꾼 언어유희');
assert.equal(by('표현 방법으로 알맞은', "[개잘량이라는 '양' 자"), '동음이의어를 이용한 언어유희');
assert.equal(by('가리키는 인물', '[대감]'), '이몽룡의 아버지');
assert.equal(correct('시어와 그 의미의 연결로 알맞지 않은'), '옥반가효 → 수령들의 기름');           // 학습지 3쪽 비유 표
assert.equal(correct('「춘향전」의 이면적 주제'), '부패한 지배층에 대한 서민의 항거');
console.log(`PASS: 기말 국어 백은미T — 객관식 ${cards.length} (${topics.map(t => `${t} ${cards.filter(c => c.topic === t).length}`).join(', ')}) + 서술형 ${rubrics.length} + 연습 ${written.length - rubrics.length} · 개념 ${lessons.length}`);
