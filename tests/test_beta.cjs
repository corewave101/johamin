// 베타 테스트: the switch lives in the update log (v0.0.-1); with it on, a subject's menus become a hand of cards.
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
assert.ok(!betaOn() && render().includes('문제 파트'), 'beta off: the usual menu');
setBeta(true);
const hand = render();
const cards = (hand.match(/class="hand-card/g) ?? []).length;
assert.ok(cards >= 3 && hand.includes('개념 정리') && hand.includes('전체 풀기') && hand.includes('단원 골라 풀기'), 'beta on: the menu is a hand of cards');
assert.ok(hand.includes('aria-selected="true"') && hand.includes('전체 풀기 고르기'), 'the second card (전체 풀기) starts lifted');
setBeta(false);
console.log(`PASS: beta switch at v0.0.-1, version shown as "3.3.0 베타.1", subject menu becomes a ${cards}-card hand with beta on.`);
