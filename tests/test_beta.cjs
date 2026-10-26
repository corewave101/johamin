// 베타 테스트: the switch lives in the update log (v0.0.-1). Since 3.4.1 the 카드 패 and 해설 카드 are regular features;
// only the first-screen 실습 is still behind the switch.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, f);
const { parseChangelog } = require('../lib/changelog.ts');
const { setBeta, betaOn } = require('../lib/beta.ts');
const { showVersion } = require('../components/swipe/UpdateLog.tsx');
const { subjectDecks } = require('../data/swipe-subjects.ts');

const log = parseChangelog(fs.readFileSync('CHANGELOG.md', 'utf8'));
const beta = log.at(-1);
assert.equal(beta.version, '0.0.-1', '베타 스위치는 업데이트 기록 맨 끝(v0.0.-1)에 있어야 해요');
assert.ok(beta.items.some(item => item.text.includes('](#beta)')), '베타 스위치 링크(#beta)가 있어야 해요');
assert.equal(showVersion('3.3.0-beta.1'), '3.3.0 베타.1');
assert.equal(showVersion('3.2.1'), '3.2.1');

const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
const SubjectStudy = require('../components/swipe/SubjectStudy.tsx').default;
const social = subjectDecks.find(d => d.id === 'social');
const render = () => renderToStaticMarkup(React.createElement(SubjectStudy, { deck: social, onBack: () => {} }));
assert.ok(!betaOn());
const hand = render();
const cards = (hand.match(/class="hand-card/g) ?? []).length;
assert.ok(cards >= 3 && hand.includes('개념 정리') && hand.includes('전체 풀기') && hand.includes('단원 골라 풀기'), 'beta off: the menu is already a hand of cards');
assert.ok(hand.includes('aria-selected="true"') && hand.includes('전체 풀기 고르기'), 'the second card (전체 풀기) starts lifted');
assert.ok(!hand.includes('hand-beta'), 'no 베타 badge on the hand any more');
setBeta(true);
assert.equal(render(), hand, 'the switch no longer changes the subject menu');
// SwipeGame and CardHand don't read the switch. The first-screen 실습 and (4.0.1) 양동비T 빛과 렌즈 실습 do.
for (const f of ['SwipeGame.tsx', 'CardHand.tsx']) assert.ok(!/useBeta|betaOn/.test(fs.readFileSync('components/swipe/' + f, 'utf8')), f);
assert.ok(/useBeta/.test(fs.readFileSync('components/swipe/SubjectPicker.tsx', 'utf8')), '실습 stays behind the switch');
const study = fs.readFileSync('components/swipe/SubjectStudy.tsx', 'utf8');
assert.equal((study.match(/\bbeta\b/g) ?? []).length, 2, 'SubjectStudy reads the switch only for the optics lab (const beta = useBeta(); deck.lab === optics && beta)');
// 양동비T (4.0.2부터 카드가 있다): beta off → 카드 패에 실습 없음, beta on → 실습 카드가 맨 앞에 더해지고 '베타' 글자는 없다.
const { finalMenu } = require('../data/final-subjects.ts');
const flat = g => g.children.flatMap(n => n.kind === 'group' ? flat(n) : [n]);
const yang = flat(finalMenu).find(d => d.id === 'physics-yang-final');
const renderYang = () => renderToStaticMarkup(React.createElement(SubjectStudy, { deck: yang, onBack: () => {} }));
setBeta(false);
const off = renderYang();
assert.ok(off.includes('전체 풀기') && !off.includes('광선 작도하기'), 'beta off: 양동비T has cards but no lab');
setBeta(true);
const on = renderYang();
assert.ok(on.includes('광선 작도하기') && !/베타|beta/i.test(on.replace(/data-[a-z-]+="[^"]*"/g, '')), 'beta on: the lab card, no 베타 label');
assert.equal((on.match(/class="hand-card/g) ?? []).length, (off.match(/class="hand-card/g) ?? []).length + 1, 'beta on adds exactly the lab card');
setBeta(false);
console.log(`PASS: beta switch at v0.0.-1, version shown as "3.3.0 베타.1", subject menu is a ${cards}-card hand without beta; the switch only gates 실습.`);
