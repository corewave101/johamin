const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
for (const ext of ['.ts','.tsx']) require.extensions[ext] = (m,f) => m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText,f);
const { subjectDecks, subjectMenu } = require('../data/swipe-subjects.ts');
const { conceptsFor } = require('../data/study-concepts.ts');
const { geneticsCards, geneticsWritten } = require('../data/genetics-terms.ts');
const { englishCards } = require('../data/english-cards.ts');
const { englishWritten } = require('../data/english-written.ts');
const { withLiveCards } = require('../lib/card-store.ts');
const { portraitFor, portraits } = require('../data/card-portraits.ts');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const Card = require('../components/swipe/LaminatedCard.tsx').default;
const park = subjectDecks.find(d => d.id === 'biology-park');
const jo = subjectDecks.find(d => d.id === 'biology-jo');
assert.equal(geneticsCards.length,22); assert.equal(geneticsWritten.length,22);
assert.equal(park.cards.filter(q => q.topic === '유전학 핵심 용어').length,22);
assert.equal(park.writtenQuestions.filter(q => q.topic === '유전학 핵심 용어').length,22);
for (const q of geneticsWritten) assert.ok(q.modelAnswer.length > 60 && new Set(q.criteria).size === 3);
const glossary = conceptsFor(park.id).find(l => l.id === 'biology-park-terms');
assert.equal(glossary.sections.flatMap(s => s.table?.rows ?? []).length,22);
const joContent = JSON.stringify([jo.cards,jo.writtenQuestions,conceptsFor(jo.id)]);
assert.ok(!/선택적 스플라이싱|히스톤 아세틸화|인핸서|MyoD|Hox|iPS|세포 분화와 발생/.test(joContent));
for (const q of [...jo.cards,...jo.writtenQuestions]) assert.ok(Number(q.sourceNote.match(/(\d+)쪽/)[1]) <= 29);
assert.ok(jo.cards.some(q => q.question.includes('오페론')));
for (const q of [...englishCards,...englishWritten]) assert.ok(q.passage && q.passage.length > 20,q.id);
assert.ok(englishCards.filter(q=>q.topic==='Chichén Itzá').every(q=>q.passage.includes('Chichén')));
// Simulate a stale database: removed slides must stay removed; missing passages and terms are restored.
const stale = withLiveCards(subjectMenu, {
 'biology-jo': { cards:[{...jo.cards[0],id:'biology-jo-099',sourceNote:'유전자의 발현 · 44쪽'}],written:[] },
 'biology-park': { cards:park.cards.filter(q=>!q.id.startsWith('park-term-')),written:[] },
 english: { cards:englishCards.map(q=>({...q,passage:undefined})),written:[] },
});
const flatten = g=>g.children.flatMap(n=>n.kind==='group'?flatten(n):[n]);
const merged=flatten(stale);
assert.equal(merged.find(d=>d.id===jo.id).cards.length,jo.cards.length);
assert.equal(merged.find(d=>d.id===park.id).cards.length,park.cards.length);
assert.ok(merged.find(d=>d.id==='english').cards.every(q=>q.passage));
assert.notEqual(portraitFor('korean-grammar').image,portraitFor('english').image);
assert.equal(portraitFor('english','공통 문법·독해'),portraits.english);
assert.notEqual(portraitFor('biology-park').image,portraitFor('astronomy-hwang').image);
for(const [key,p] of Object.entries(portraits)) {
 assert.ok(p.remoteImage.startsWith('https://upload.wikimedia.org/') && p.source.startsWith('https://commons.wikimedia.org/'));
 const html=renderToStaticMarkup(React.createElement(Card,{topic:key,portraitKey:key,question:'관련 개념을 확인하세요'}));
 assert.ok(html.includes('인물 초상') && html.includes('Commons / PD') && html.includes('portrait-credit'));
}
console.log('PASS: 22 glossary choices + 22 applied essays; operon scope in concepts/practice/cache; all English passages; subject portraits and attribution.');
