const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
for (const ext of ['.ts', '.tsx']) require.extensions[ext] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: 1, target: ts.ScriptTarget.ES2022, jsx: 4, esModuleInterop: true } }).outputText, f);
const { studyPractice, isShortQuestion } = require('../data/study-practice.ts');
const { sciencePractice } = require('../data/science-practice.ts');
const { subjectDecks } = require('../data/swipe-subjects.ts');
const { gradeShortAnswer } = require('../lib/practice-answer.ts');
const { vocabularyPieces } = require('../lib/vocabulary.ts');
const { parkVocabulary } = require('../data/park-vocabulary.ts');
const { groupRows, withLiveCards } = require('../lib/card-store.ts');
const { subjectMenu } = require('../data/swipe-subjects.ts');
const rows = Object.values(studyPractice).flat();
assert.equal(rows.filter(isShortQuestion).length, 152);
assert.equal(rows.filter(q => !isShortQuestion(q)).length, 130);
assert.equal(Object.values(sciencePractice).flat().length, 52);
assert.equal(Object.keys(studyPractice).length, 11);
assert.equal(new Set(rows.map(q => q.id)).size, rows.length);
for (const deck of subjectDecks.filter(d => d.cards.length)) {
  assert.ok(deck.writtenQuestions.some(isShortQuestion), deck.id);
  assert.ok(deck.writtenQuestions.some(q => q.id.startsWith('practice-written-')), deck.id);
}
for (const q of rows) { assert.ok(q.sourceNote && q.criteria.length && q.modelAnswer, q.id); if (isShortQuestion(q)) { assert.ok(gradeShortAnswer(q.modelAnswer, q.modelAnswer)); assert.ok(!gradeShortAnswer('', q.modelAnswer)); } }
assert.ok(gradeShortAnswer(' 대립 유전자. ', '대립유전자'));
assert.ok(gradeShortAnswer('dna', 'DNA'));
assert.ok(!gradeShortAnswer('aa', 'Aa'));
assert.ok(!gradeShortAnswer('AA', 'Aa'));
assert.ok(!gradeShortAnswer('12', '1/2'));
assert.ok(!gradeShortAnswer('15', '1.5'));
assert.ok(!gradeShortAnswer('2n+1', '2n−1'));
for (const term of parkVocabulary) {
  for (const size of ['large', 'small', 'word']) assert.equal(vocabularyPieces(term, size).join(' '), term.definition);
  assert.ok(vocabularyPieces(term, 'word').length >= vocabularyPieces(term, 'small').length);
}
const allRows = JSON.parse(fs.readFileSync('db/cards.json', 'utf8')).cards;
const exported = allRows.filter(c => c.id.startsWith('practice-'));
const { socialBulkPractice } = require('../data/social-bulk-cards.ts'); // 뭉탱이 makes its own short/written variants
const { biologyJoBulkPractice } = require('../data/biology-jo-bulk-cards.ts'); // 조용민T 뭉탱이도 같은 방식
const { koreanClassicPractice } = require('../data/korean-classic-cards.ts'); // 고전 시가도 같은 방식
const bulkPractice = socialBulkPractice.short.length + socialBulkPractice.written.length + biologyJoBulkPractice.short.length + biologyJoBulkPractice.written.length + koreanClassicPractice.short.length + koreanClassicPractice.written.length;
assert.equal(exported.length, 334 + bulkPractice);
const live = groupRows(allRows);
assert.equal(Object.values(live).flatMap(d => d.written).filter(isShortQuestion).length, 152 + socialBulkPractice.short.length + biologyJoBulkPractice.short.length + koreanClassicPractice.short.length + require('../data/hwang-exam.ts').hwangExam.filter(isShortQuestion).length);
const liveMenu = withLiveCards(subjectMenu, live);
assert.ok(JSON.stringify(liveMenu).includes('practice-short-'));
const dna = sciencePractice['biology-park'];
assert.equal(dna.find(c => c.question.includes('Ab의 기대')).answers[dna.find(c => c.question.includes('Ab의 기대')).correct], '10%');
const chem = sciencePractice.chemistry;
assert.equal(chem.find(c => c.question.includes('24 mL')).answers[chem.find(c => c.question.includes('24 mL')).correct], '0.12 M');
for (const cards of Object.values(sciencePractice)) for (const c of cards) { assert.equal(new Set(Object.values(c.answers)).size, 4); assert.ok(c.explanation.length >= 16); assert.ok(Object.values(c.answers).every(a => a.length <= 40)); }
const React = require('react'), { renderToStaticMarkup } = require('react-dom/server');
const Written = require('../components/swipe/WrittenPractice.tsx').default;
const q = rows.find(isShortQuestion);
const html = renderToStaticMarkup(React.createElement(Written, { questions: [q], state: { index: 0, drafts: {}, revealed: {} }, setState: () => {} }));
assert.ok(html.includes('단답형 연습') && html.includes('채점하기'));
assert.ok(!html.includes('각 1점'));
console.log('PASS: 334 added exercises across 11 parts; exact short-answer scoring preserves numeric and genetic distinctions; all vocabulary sizes preserve source; DB round-trip and short-answer UI.');
