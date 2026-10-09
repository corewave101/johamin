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
  if (!deck.cards.length && !deck.writtenQuestions?.length) { assert.ok(menu.includes('아직 자료가 없어요') && !menu.includes('문제 파트'), deck.id); continue; }
  if (deck.id === 'biology-park') {
    // 박상영T: card-style menu (↑ 개념 정리 · ← 문제 풀기 · → 원문 단어장 · ↓ 과목·파트)
    const general = deck.cards.filter(c => c.topic !== '유전학 핵심 용어').length;
    const written = deck.writtenQuestions.filter(q => q.topic !== '유전학 핵심 용어').length;
    assert.ok(menu.includes('↑ 개념 정리') && menu.includes('← 문제 풀기') && menu.includes('→ 원문 단어장') && menu.includes('↓ 과목·파트'), deck.id);
    assert.ok(menu.includes(`객관식 ${general} · 서술형 ${written}`), deck.id);
  } else {
    // 카드 패 (3.4.1부터 기본): 개념 정리 · 전체 풀기 · 단원 골라 풀기 (+ 서술형 쓰기)
    assert.ok(menu.includes('class="hand-card') && menu.includes('개념 정리') && menu.includes('전체 풀기') && menu.includes('단원 골라 풀기'), deck.id);
    assert.ok(menu.includes(`${deck.cards.length}문제`), deck.id);
    if (deck.writtenQuestions?.length) assert.ok(menu.includes('서술형 쓰기') && menu.includes(`${deck.writtenQuestions.length}문제`), deck.id);
  }
  const lessons = conceptsFor(deck.id);
  const markup = renderToStaticMarkup(React.createElement(ConceptReader, { lessons, onPractice: () => {}, read: [lessons[0].id], setRead: () => {} }));
  assert.ok(markup.includes('개념 검색') && markup.includes('관련 문제 연습'), deck.id);
  assert.ok(markup.includes('aria-current="true"') && markup.includes('aria-pressed="true"'), deck.id);
  assert.ok(markup.includes(lessons[0].title));
}
console.log('PASS: all subject menus render as card hands with concept/problem choices and counts; concept search, active chapter, retained read marker, practice link and the waiting notice for empty Korean parts render correctly.');
