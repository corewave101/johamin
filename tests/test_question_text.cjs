// 틀린 것 고르기 강조(4.11.0~): 질문의 "않은 · 아닌 · 볼 수 없는"만 빨간색으로 잡고, 다른 말은 건드리지 않는다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const src = fs.readFileSync('components/swipe/QuestionText.tsx', 'utf8');
const re = new RegExp(src.match(/export const NEGATION = \/(.+)\/g;/)[1], 'g');
const hits = text => [...text.matchAll(re)].map(m => m[1]);
assert.deepEqual(hits('이 대목에 대한 설명으로 알맞지 않은 것은?'), ['알맞지 않은']);
assert.deepEqual(hits('당대 사회상으로 적절하지 않은 것은?'), ['적절하지 않은']);
assert.deepEqual(hits('「춘향전」의 성격과 거리가 먼 것은?'), ['거리가 먼']);
assert.deepEqual(hits('서술자의 개입으로 볼 수 없는 것은?'), ['볼 수 없는']);
assert.deepEqual(hits('가리키는 인물이 아닌 하나는?'), ['아닌']);
assert.deepEqual(hits('밑줄 친 부분에 대한 이해로 알맞은 것은?'), []);
assert.deepEqual(hits('"쉬이."가 아니라 굿거리장단 춤이 하는 일은?'), []);
assert.deepEqual(hits('잃은 것과 든 것의 대비가 드러내는 것은?'), []);
assert.ok(fs.readFileSync('components/swipe/LaminatedCard.tsx', 'utf8').includes('<QuestionText text={question} />'));
assert.ok(fs.readFileSync('app/swipe.css', 'utf8').includes('.q-negation'));
console.log('PASS: 틀린 것 고르기 강조');
