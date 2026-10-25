// 3.12.0 중간고사 보관함: 처음 화면은 기말고사(빈 덱), /midterm/은 중간고사 카드 그대로.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { finalMenu } = require('../data/final-subjects.ts');
const { subjectDecks } = require('../data/swipe-subjects.ts');
const { isMidterm, MIDTERM_URL, HOME_URL } = require('../lib/exam.ts');

const flatten = g => g.children.flatMap(n => n.kind === 'group' ? flatten(n) : [n]);
const finals = flatten(finalMenu);
assert.ok(finals.length >= 6, '기말 메뉴에 과목 덱이 있어요');
// 기말 덱은 새 id: 중간고사 덱 id(풀이 기록·DB deck_id)와 겹치면 중간고사 카드가 처음 화면에 다시 나타난다.
const midtermIds = new Set(subjectDecks.map(d => d.id));
for (const deck of finals) {
  assert.ok(!midtermIds.has(deck.id), `${deck.id}: 중간고사 덱 id를 다시 쓰지 않아요`);
  assert.ok(deck.id.endsWith('-final'), deck.id);
}
assert.equal(new Set(finals.map(d => d.id)).size, finals.length, '기말 덱 id는 서로 달라요');
// ↓는 뒤로, 처음 화면 ↑는 중간고사 바로가기 자리.
(function directions(group, root) {
  assert.equal(new Set(group.children.map(n => n.direction)).size, group.children.length, group.id);
  // 처음 화면에는 뒤로 갈 곳이 없어서 ↓도 과목 자리(수학). 그 안쪽 메뉴의 ↓는 뒤로.
  if (!root) assert.ok(group.children.every(n => n.direction !== 'down'), group.id);
  if (root) assert.ok(group.children.every(n => n.direction !== 'up'), '처음 화면 ↑는 중간고사 바로가기');
  group.children.filter(n => n.kind === 'group').forEach(g => directions(g, false));
})(finalMenu, true);
// 중간고사 쪽은 예전 카드가 그대로(삭제가 아니라 보관).
assert.ok(subjectDecks.length > 0 && subjectDecks.every(d => d.cards.length > 0));

// Without a page (tests) the app counts as the first screen at '/'.
assert.equal(isMidterm, false);
assert.equal(HOME_URL, '/');
assert.equal(MIDTERM_URL, '/midterm/');

// Wiring: the menu picks its decks by address, the build makes midterm/index.html, login returns to the registered address.
const live = fs.readFileSync('components/swipe/useLiveMenu.ts', 'utf8');
assert.ok(live.includes('const baseMenu = isMidterm ? subjectMenu : finalMenu;'));
const vite = fs.readFileSync('vite.config.ts', 'utf8');
assert.ok(vite.includes("join(outDir, 'midterm', 'index.html')") && vite.includes('<base href='));
const picker = fs.readFileSync('components/swipe/SubjectPicker.tsx', 'utf8');
assert.ok(picker.includes('MIDTERM_URL') && picker.includes('HOME_URL'));
const auth = fs.readFileSync('lib/auth.ts', 'utf8');
assert.ok(auth.includes('redirectTo: `${window.location.origin}${HOME_URL}`'));
console.log(`PASS: ${finals.length} 기말 decks on new ids, ${subjectDecks.length} 중간고사 decks kept at /midterm/.`);
