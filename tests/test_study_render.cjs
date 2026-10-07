const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
for (const extension of ['.ts', '.tsx']) require.extensions[extension] = (module, file) => module._compile(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText, file);
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { subjectDecks } = require('../data/swipe-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');
const SubjectStudy = require('../components/swipe/SubjectStudy.tsx').default;
const ConceptReader = require('../components/swipe/ConceptReader.tsx').default;
for (const deck of subjectDecks) {
  const menu = renderToStaticMarkup(React.createElement(SubjectStudy, { deck, onBack: () => {} }));
  assert.ok(menu.includes('개념 파트') && menu.includes('문제 파트'), deck.id);
  assert.ok(menu.includes(`${deck.cards.length} / 서술형`), deck.id);
  const lessons = conceptsFor(deck.id);
  const markup = renderToStaticMarkup(React.createElement(ConceptReader, { lessons, onPractice: () => {}, read: [lessons[0].id], setRead: () => {} }));
  assert.ok(markup.includes('개념 검색') && markup.includes('관련 문제 연습'), deck.id);
  assert.ok(markup.includes('aria-current="true"') && markup.includes('aria-pressed="true"'), deck.id);
  assert.ok(markup.includes(lessons[0].title));
  if (deck.id === 'korean') assert.ok(menu.includes('특정 시험 범위 정리는 아니에요'));
}
console.log('PASS: all subject menus render concept/problem choices and counts; concept search, active chapter, retained read marker, practice link and Korean scope notice render correctly.');
