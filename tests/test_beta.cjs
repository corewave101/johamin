// 베타 테스트: the switch lives in the update log (v0.0.-1), and the spread menu lists every part exactly once.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, f);
const { parseChangelog } = require('../lib/changelog.ts');
const { subjectMenu, subjectDecks } = require('../data/swipe-subjects.ts');
const { spreadOf } = require('../components/swipe/DeckSpread.tsx');

const log = parseChangelog(fs.readFileSync('CHANGELOG.md', 'utf8'));
const beta = log.at(-1);
assert.equal(beta.version, '0.0.-1', '베타 스위치는 업데이트 기록 맨 끝(v0.0.-1)에 있어야 해요');
assert.ok(beta.items.some(item => item.text.includes('](#beta)')), '베타 스위치 링크(#beta)가 있어야 해요');

const spread = spreadOf(subjectMenu);
assert.deepEqual(spread.map(s => s.group.name), subjectMenu.children.map(c => c.name));
const ids = spread.flatMap(s => s.decks.map(d => d.deck.id));
assert.deepEqual([...ids].sort(), subjectDecks.map(d => d.id).sort());
assert.equal(spread.find(s => s.group.id === 'humanities').decks.find(d => d.deck.id === 'korean-grammar').path, '국어');

const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
const DeckSpread = require('../components/swipe/DeckSpread.tsx').default;
const html = renderToStaticMarkup(React.createElement(DeckSpread, { menu: subjectMenu, onPick: () => {}, onClassic: () => {} }));
assert.equal((html.match(/class="spread-card/g) ?? []).length, subjectDecks.length);
assert.ok(html.includes('한 장씩 넘겨서 고르기') && html.includes('준비 중'));
console.log(`PASS: beta switch at v0.0.-1, spread menu shows all ${subjectDecks.length} parts once, grouped by subject.`);
