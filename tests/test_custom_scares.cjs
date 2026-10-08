// 3.1 beta: a custom blessing's own jump scares and card position.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { customScareForAnswer, newCustomTracker, normalizeRule, describeRule } = require('../lib/custom-scares.ts');
const { checkBlessingFile } = require('../lib/blessing-store.ts');

const always = () => 0, never = () => 0.999, fixed = v => () => v;
const ev = (o = {}) => ({ correct: true, unknown: false, seconds: 3, streakBefore: 0, streakAfter: 1, astronomy: false, ...o });
const right = s => ev({ streakBefore: s, streakAfter: s + 1 });
const wrong = (s, o = {}) => ev({ correct: false, streakBefore: s, streakAfter: 0, ...o });
const rule = (id, trigger, n, chance = 100) => normalizeRule({ id, trigger, n, chance });
function play(rules, events, random = always) {
  let t = newCustomTracker(); const shown = [];
  for (const e of events) { const r = customScareForAnswer(t, rules, e, random); t = r.tracker; shown.push(r.rule); }
  return shown;
}

assert.deepEqual(play([rule('a', 'streakEvery', 3)], [right(0), right(1), right(2), right(3), right(4), right(5)]), [null, null, 'a', null, null, 'a']);
assert.deepEqual(play([rule('b', 'streakBreak', 5)], [wrong(4), wrong(0), wrong(5)]), [null, null, 'b']);
// N in a row: once per run, again after a correct answer.
assert.deepEqual(play([rule('c', 'wrongRun', 2)], [wrong(0), wrong(0), wrong(0), right(0), wrong(0), wrong(0)]), [null, 'c', null, null, null, 'c']);
assert.deepEqual(play([rule('d', 'slowWrong', 20)], [wrong(0, { seconds: 19 }), wrong(0, { seconds: 20 }), ev({ seconds: 60 })]), [null, 'd', null]);
// Once per game at exactly N.
assert.deepEqual(play([rule('e', 'streakOnce', 2)], [right(0), right(1), wrong(2), right(0), right(1)]), [null, 'e', null, null, null]);
// Order decides; one scare per answer.
assert.deepEqual(play([rule('first', 'wrong', 0), rule('second', 'streakBreak', 1)], [wrong(3)]), ['first']);
assert.deepEqual(play([rule('second', 'streakBreak', 1), rule('first', 'wrong', 0)], [wrong(3)]), ['second']);
// Chance and 모름 halving; a failed roll lets the next rule try.
assert.deepEqual(play([rule('w', 'wrong', 0, 30)], [wrong(0)], fixed(0.29)), ['w']);
assert.deepEqual(play([rule('w', 'wrong', 0, 30)], [wrong(0)], fixed(0.31)), [null]);
assert.deepEqual(play([rule('w', 'wrong', 0, 30)], [wrong(0, { unknown: true })], fixed(0.16)), [null]);
assert.deepEqual(play([rule('w', 'wrong', 0, 30), rule('x', 'wrong', 0, 100)], [wrong(0)], fixed(0.5)), ['x']);
// Idle and leave are timed by the game screen, never by an answer.
assert.deepEqual(play([rule('i', 'idle', 5), rule('l', 'leave', 0)], [wrong(9), right(9)]), [null, null]);
// Numbers are kept in range.
assert.equal(rule('z', 'streakEvery', 999).n, 50);
assert.equal(rule('z', 'wrong', 7, 0).chance, 1);
assert.equal(rule('z', 'wrong', 7, 250).chance, 100);
assert.equal(describeRule(rule('z', 'slowWrong', 40, 50)), 'N초 넘게 고민하고 틀림'.replace('N', '40') + ' · 50%');

// Blessing files carry the card position and scares, and are checked.
const image = 'data:image/webp;base64,AAAA';
const base = { type: 'johamin-blessing', version: 2, name: '철수의 가호', coinFront: '철수', coinBack: '철수!', color: '#3fb8b0', focusX: 50, focusY: 40, crop: { x: 0, y: 0, scale: 1.2 }, background: image, cardSource: image, card: image };
const scare = { id: 's1', trigger: 'wrong', n: 0, chance: 30, image, sound: { kind: 'builtin', id: 'ya' } };
assert.equal(checkBlessingFile({ ...base, layout: { x: 80, y: 20 }, scares: [scare, { ...scare, sound: { kind: 'file', data: 'data:audio/mpeg;base64,AAAA' } }] }), null);
assert.equal(checkBlessingFile({ ...base, layout: { x: 'left' } }), '카드 위치 정보가 올바르지 않아요.');
assert.equal(checkBlessingFile({ ...base, scares: [{ ...scare, trigger: 'hack' }] }), '갑툭튀 정보가 올바르지 않아요.');
assert.equal(checkBlessingFile({ ...base, scares: [{ ...scare, sound: { kind: 'file', data: 'https://evil.example/x.mp3' } }] }), '갑툭튀 소리 정보가 올바르지 않아요.');
assert.equal(checkBlessingFile({ ...base, scares: Array(13).fill(scare) }), '갑툭튀 정보가 올바르지 않아요.');
assert.equal(checkBlessingFile(base), null, '2.0 files without the new parts still open');
console.log('PASS: custom scares (every N, break, run, slow, once, order, chance, 모름), number limits, and blessing files with card position and scares.');
