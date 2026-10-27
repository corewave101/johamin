// 3.12.0 중간고사 보관함: 처음 화면은 기말고사(빈 덱), /midterm/은 중간고사 카드 그대로.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { finalMenu } = require('../data/final-subjects.ts');
const { subjectDecks } = require('../data/swipe-subjects.ts');
const { isMidterm, isElice, isLotte, examPage, MIDTERM_URL, ELICE_URL, LOTTE_URL, HOME_URL, NAV_TARGETS, navTargets, BRAND, PAGE_URL } = require('../lib/exam.ts');
const { lotteMenu } = require('../data/lotte-subjects.ts');
const { subjectMenu } = require('../data/swipe-subjects.ts');

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
// ↓는 뒤로, 처음 화면 ↑는 이동 메뉴(4.2.0~) 자리.
(function directions(group, root) {
  assert.equal(new Set(group.children.map(n => n.direction)).size, group.children.length, group.id);
  // 처음 화면에는 뒤로 갈 곳이 없어서 ↓도 과목 자리(수학). 그 안쪽 메뉴의 ↓는 뒤로.
  if (!root) assert.ok(group.children.every(n => n.direction !== 'down'), group.id);
  if (root) assert.ok(group.children.every(n => n.direction !== 'up'), '처음 화면 ↑는 이동 메뉴');
  group.children.filter(n => n.kind === 'group').forEach(g => directions(g, false));
})(finalMenu, true);
// 중간고사 쪽은 예전 카드가 그대로(삭제가 아니라 보관).
assert.ok(subjectDecks.length > 0 && subjectDecks.every(d => d.cards.length > 0));

// Without a page (tests) the app counts as the first screen at '/'.
assert.equal(isMidterm, false);
assert.equal(isElice, false);
assert.equal(examPage, 'final');
assert.equal(HOME_URL, '/');
assert.equal(MIDTERM_URL, '/midterm/');
assert.equal(ELICE_URL, '/elice/');
assert.equal(LOTTE_URL, '/lotte/');
assert.equal(isLotte, false);
assert.deepEqual(BRAND, { first: '조하민', rest: '레츠고' });
assert.deepEqual(Object.keys(PAGE_URL).sort(), ['elice', 'final', 'lotte', 'midterm']);
// 이동 메뉴: 방향은 어디서나 같고(↑ 기말 · ← 중간 · → 정보), 지금 페이지 자리는 비운다.
assert.deepEqual(NAV_TARGETS.map(t => `${t.direction}:${t.label}:${t.href}`), ['up:기말고사:/', 'left:중간고사:/midterm/', 'right:정보:/elice/']);
// 4.6.0: 롯데는 지금 페이지가 비운 자리에 들어간다. 롯데 페이지에서는 기말 · 중간 · 정보가 원래 자리.
const show = from => navTargets(from).map(t => `${t.direction}:${t.label}`).sort();
assert.deepEqual(show('final'), ['left:중간고사', 'right:정보', 'up:롯데']);
assert.deepEqual(show('midterm'), ['left:롯데', 'right:정보', 'up:기말고사']);
assert.deepEqual(show('elice'), ['left:중간고사', 'right:롯데', 'up:기말고사']);
assert.deepEqual(show('lotte'), ['left:중간고사', 'right:정보', 'up:기말고사']);
// 두 카드 메뉴 모두 첫 화면 ↑는 비어 있다(이동 자리). 중간고사 첫 화면 ↓는 베타 실습 자리라 비운다.
for (const m of [finalMenu, subjectMenu, lotteMenu]) assert.ok(m.children.every(n => n.direction !== 'up'), m.name);
// 롯데 메뉴: 덱 id는 'lotte-'로 시작하고 다른 메뉴와 겹치지 않는다(4.8.0~ 문제는 tests/test_lotte_cards.cjs가 검사).
assert.ok(flatten(lotteMenu).every(d => d.id.startsWith('lotte-') && !midtermIds.has(d.id)));
assert.ok(subjectMenu.children.every(n => n.direction !== 'down'));
// 정보 페이지(4.3.0~)는 카드가 아니라 엘리스식 코딩 연습장이다(tests/test_elice.cjs). 문제 id는 'info-'로 시작해 덱 id와 겹치지 않는다.
const { eliceProblems } = require('../data/elice-problems.ts');
assert.ok(eliceProblems.every(p => p.id.startsWith('info-') && !midtermIds.has(p.id) && !finals.some(f => f.id === p.id)));

// Wiring: the menu picks its decks by address, the build makes midterm/index.html, login returns to the registered address.
const live = fs.readFileSync('components/swipe/useLiveMenu.ts', 'utf8');
assert.ok(live.includes('const baseMenu = isLotte ? lotteMenu : isMidterm ? subjectMenu : finalMenu;'));
const vite = fs.readFileSync('vite.config.ts', 'utf8');
assert.ok(vite.includes("for (const dir of ['midterm', 'elice', 'lotte'])") && vite.includes("join(outDir, dir, 'index.html')") && vite.includes('<base href='));
const picker = fs.readFileSync('components/swipe/SubjectPicker.tsx', 'utf8');
assert.ok(picker.includes('navTargets(examPage)') && picker.includes("setNav(true)") && picker.includes('window.location.assign(target.href)'));
const auth = fs.readFileSync('lib/auth.ts', 'utf8');
assert.ok(auth.includes('redirectTo: `${window.location.origin}${HOME_URL}`') && auth.includes('sessionStorage.setItem(RETURN_KEY, PAGE_URL[examPage])'));
// 4.6.1: 구석의 롯데 로고는 메인 화면(과목 메뉴 첫 화면 · 정보 문제 목록)에서만. 문제 · 과목 · 이동 메뉴 안에서는 숨는다.
assert.ok(picker.includes('useHomeScreen(atRoot && !nav)'), 'peek only on the first menu screen');
assert.ok(fs.readFileSync('components/swipe/EliceStudio.tsx', 'utf8').includes('useHomeScreen(!problem)'), 'peek only on the elice list');
assert.ok(fs.readFileSync('components/swipe/lotte.css', 'utf8').includes(':root:not(.at-home) .lotte-peek'), 'peek hidden off home');
console.log(`PASS: ${finals.length} 기말 decks on new ids, ${subjectDecks.length} 중간고사 decks kept at /midterm/, 정보 코딩 연습장 at /elice/, 롯데 at /lotte/, 이동 menu on ↑ everywhere.`);
