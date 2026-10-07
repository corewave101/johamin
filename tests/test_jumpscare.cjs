// 갑툭튀 rules: conditions, chances, "모름" halving, priority and once-only limits.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const store = new Map();
global.localStorage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
const { newTracker, scareForAnswer } = require('../lib/jumpscare.ts');
const { recordStreak, bestStreak } = require('../lib/best-streak.ts');

const always = () => 0;        // every roll succeeds, horn delay = 1 turn, huh target = 5
const never = () => 0.999;     // every roll fails, huh target = 8
const fixed = v => () => v;
const ev = (o = {}) => ({ correct: true, unknown: false, seconds: 3, streakBefore: 0, streakAfter: 1, astronomy: false, ...o });
const right = s => ev({ streakBefore: s, streakAfter: s + 1 });
const wrong = (s, o = {}) => ev({ correct: false, streakBefore: s, streakAfter: 0, ...o });
function play(events, random = never, tracker = newTracker(random)) {
  const shown = [];
  for (const e of events) { const r = scareForAnswer(tracker, e, random); tracker = r.tracker; shown.push(r.scare); }
  return { shown, tracker };
}

// 1: every 10th streak.
assert.deepEqual(play([right(9), right(10), right(19)]).shown, ['aria', null, 'aria']);
// 2 then 8: a 10+ streak breaks, and the very next answer is wrong again.
assert.deepEqual(play([wrong(12), wrong(0)]).shown, ['fart', 'ball']);
assert.deepEqual(play([wrong(12), right(0), wrong(1)]).shown, ['fart', null, null], 'BALL needs the next answer');
assert.deepEqual(play([wrong(9), wrong(0)]).shown, [null, null], 'No fart below 10, so no BALL');
// 3: third wrong in a row, once per run, again after a correct answer resets the run.
assert.deepEqual(play([wrong(0), wrong(0), wrong(0), wrong(0), right(0), wrong(0), wrong(0), wrong(0)]).shown,
  [null, null, 'impostor', null, null, null, null, 'impostor']);
// 4: 행성우주과학 only, streak of 3+.
assert.equal(play([wrong(3, { astronomy: true })]).shown[0], 'crash');
assert.equal(play([wrong(3)]).shown[0], null);
assert.equal(play([wrong(2, { astronomy: true })]).shown[0], null);
// 7: thinking 30 s or more, then wrong.
assert.equal(play([wrong(0, { seconds: 30 })]).shown[0], 'scratch');
assert.equal(play([ev({ seconds: 45 })]).shown[0], null);
// 11: streak reaches the game's random target (5–8), once per game.
assert.deepEqual(play([right(4), right(5), right(6), right(7), wrong(8), right(0), right(1), right(2), right(3), right(4), right(5), right(6)], fixed(0.5)).shown,
  [null, null, 'huh', null, null, null, null, null, null, null, null, null], 'target 7, shown once per game');
assert.equal(newTracker(fixed(0)).huhTarget, 5); assert.equal(newTracker(fixed(0.99)).huhTarget, 8);
// Priority 9 > 8 > 2 > 3 > 7 > 4 > 1 > 11 > 6 > 5.
assert.equal(play([wrong(12, { seconds: 40, astronomy: true })]).shown[0], 'fart');
assert.equal(play([wrong(0), wrong(0), wrong(0, { seconds: 40 })]).shown[2], 'impostor');
assert.equal(play([wrong(4, { seconds: 40, astronomy: true })]).shown[0], 'scratch');
assert.equal(play([right(9)], fixed(0.5), { ...newTracker(fixed(0.99)), huhTarget: 5 }).shown[0], 'aria', '1 beats 11');
// 5: 30% on a plain wrong answer, never together with another scare.
assert.equal(play([wrong(0)], fixed(0.29)).shown[0], 'ya');
assert.equal(play([wrong(0)], fixed(0.31)).shown[0], null);
// 모름 halves chances: 30% → 15%, 100% → 50%.
assert.equal(play([wrong(0, { unknown: true })], fixed(0.16)).shown[0], null);
assert.equal(play([wrong(0, { unknown: true })], fixed(0.14)).shown[0], 'ya');
assert.equal(play([wrong(12, { unknown: true })], fixed(0.6)).shown[0], null);
assert.equal(play([wrong(12, { unknown: true })], fixed(0.4)).shown[0], 'fart');
// 6: a 5+ streak breaks → 10% → horn within the next 3 turns on a free turn.
{
  let t = { ...newTracker(never), huhTarget: 99 };
  let r = scareForAnswer(t, wrong(6), fixed(0.05)); // 0.05 passes both the 30% ya roll (now) and the 10% horn roll (scheduled)
  assert.equal(r.scare, 'ya');
  assert.ok(r.tracker.horn && r.tracker.horn.until === 4 && r.tracker.horn.at >= 2 && r.tracker.horn.at <= 4);
  t = { ...r.tracker, horn: { at: 2, until: 4 } };
  const busy = scareForAnswer(t, right(9), never);      // aria takes turn 2 → horn waits
  assert.equal(busy.scare, 'aria');
  const free = scareForAnswer(busy.tracker, right(10), never);
  assert.equal(free.scare, 'horn');
  assert.equal(free.tracker.horn, null);
  const late = scareForAnswer({ ...t, turn: 4 }, right(0), never);
  assert.equal(late.scare, null, 'Horn expires after 3 turns');
  assert.equal(scareForAnswer(newTracker(never), wrong(4), fixed(0.05)).tracker.horn, null, 'Needs a 5+ streak');
}

// Best streak: one record, highest count wins.
recordStreak('사회(성신제)', 7); recordStreak('생물(박상영T)', 5); recordStreak('행성우주과학(전)', 7);
assert.deepEqual(bestStreak(), { subject: '사회(성신제)', count: 7 });
recordStreak('행성우주과학(전)', 12);
assert.deepEqual(JSON.parse(store.get('johamin-best-streak')), { subject: '행성우주과학(전)', count: 12 });
console.log('PASS: 갑툭튀 conditions, chances, 모름 halving, priority, horn window, once-per-game limits and best streak record.');
