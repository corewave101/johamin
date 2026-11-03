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
// 4.11.0~: 검수를 통과한 묶음만 들어가므로 수는 묶음이 늘 때마다 커진다(최소 기준만 둔다).
assert.ok(cards.length >= 20, `${cards.length} cards`);
const all = [...cards, ...written];
assert.equal(new Set(all.map(c => c.id)).size, all.length);
assert.equal(new Set(cards.map(c => (c.subject ?? c.passage ?? '') + c.question)).size, cards.length);
// 1차(001~119) · 2차 초안(120~197) 번호는 학생 기록 · 초안과 섞이지 않게 다시 쓰지 않는다.
for (const c of cards) assert.ok(Number(c.id.slice(-3)) >= 201, `${c.id} reuses an old id`);
for (const c of cards) {
  assert.match(c.id, /^korean-final-\d{3}$/);
  assert.ok(topics.includes(c.topic), c.id);
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(len(c.question) <= 70 && Object.values(c.answers).every(a => len(a) <= 26), `${c.id} size`);
  assert.ok(c.explanation.length > 16 && /다\.$/.test(c.explanation), c.id);
  assert.match(c.sourceNote, /^백은미T · (공통국어2 교과서 1(2[89]|3[0-5])쪽|춘향전·봉산 탈춤 학습지 ([1-9]|1[01])쪽|수업 필기)$/, c.id);
  assert.ok(!/(위 그림|다음 그림|학습지에서|앞 문제|위 자료|윗글|위 지문|〈보기〉)/.test(c.question), `${c.id} self-contained`);
  // 「뉴욕제과점」식: 카드 위 큰 줄에 구절 한 줄, 질문은 그 구절의 개념을 묻는다.
  if (c.passage) {
    // 지문 세트: 질문이 가리키는 ㉠~㉤은 지문에 있어야 한다.
    for (const mark of c.question.match(/[㉠-㉦]/g) ?? []) assert.ok(c.passage.includes(mark), `${c.id} ${mark} not in passage`);
  } else assert.ok(c.subject && len(c.subject) <= 90, `${c.id} needs a short quote line`);
}
const lessons = conceptsFor('korean-final');
assert.ok(lessons.length >= 1);
for (const l of lessons) assert.ok(!/sc-\d/.test(l.sourceNote + JSON.stringify(l.sections)), `${l.id} cites a scratch file name`);

// 학습지 정답 표시 · 필기와 같은지 (뜻으로 확인)
// 지문 세트는 3장 이상이고 번호가 이어진다(게임에서 이 순서대로 나온다).
const sets = new Map();
cards.forEach((c, i) => { if (c.passage) sets.set(c.passage, [...(sets.get(c.passage) ?? []), i]); });
assert.ok(sets.size >= 1);
for (const idx of sets.values()) assert.ok(idx.length >= 3 && idx.every((v, k) => k === 0 || v === idx[k - 1] + 1), 'passage set');
assert.ok(written.every(q => !q.passage), 'passage sets stay out of the practice cards');
const by = (subject, q) => { const c = cards.find(c => c.subject?.includes(subject) && c.question.includes(q)); assert.ok(c, subject); return c.answers[c.correct]; };
assert.equal(by('어찌 다 설화', '말하는 이'), '서술자 · 이야기를 줄여 넘김');
assert.equal(by('대감이 좌정하시던', '대감'), '이몽룡의 아버지');
assert.equal(by('흰 창옷에 관', '차림'), '차림은 위엄, 언청이는 희화화');            // 학습지 5쪽 6번 ② 오답 처리
assert.equal(by('모가지를 뽑아서', '명령'), '서민에 대한 양반의 횡포');
assert.equal(by('나랏돈 노랑돈', '계층'), '조선 후기 신흥 상인층');
assert.equal(by('천지가 뒤집히는', '표현'), '과장 · 설의');
console.log(`PASS: 기말 국어 백은미T — 객관식 ${cards.length} (${topics.map(t => `${t} ${cards.filter(c => c.topic === t).length}`).join(', ')}) + 서술형 ${written.filter(q => q.id.startsWith('korean-final-written-')).length} + 연습 ${written.length} · 개념 ${lessons.length}`);
