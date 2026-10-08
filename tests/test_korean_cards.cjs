// 국어 문법 (우리말 바로 쓰기): sizes, self-contained cards, sources, and a few rule checks.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { koreanGrammarCards: cards, koreanGrammarWritten: written } = require('../data/korean-cards.ts');
const { subjectMenu, subjectDecks } = require('../data/swipe-subjects.ts');
const korean = subjectMenu.children.find(n => n.id === 'humanities').children.find(n => n.id === 'korean');
assert.equal(korean.kind, 'group');
assert.deepEqual(korean.children.map(d => [d.direction, d.name]), [['left', '뉴욕제과점'], ['up', '문법'], ['right', '고전 시가']]);
assert.equal(subjectDecks.find(d => d.id === 'korean-grammar').cards, cards);
assert.equal(cards.length, 189);
assert.equal(written.length, 4);
const len = s => [...s].length;
assert.equal(new Set(cards.map(c => c.id)).size, cards.length);
assert.equal(new Set(cards.map(c => `${c.subject}|${c.question}`)).size, cards.length);
for (const c of cards) {
  assert.equal(new Set(Object.values(c.answers)).size, 4, c.id);
  assert.ok(c.subject && len(c.subject) <= 62 && len(c.question) <= 50, c.id);
  assert.ok(Object.values(c.answers).every(a => len(a) <= 26), c.id);
  assert.match(c.sourceNote, /^우리말 바로 쓰기 · (1[7-9]|2\d|30)쪽$/, c.id);
  assert.ok(c.explanation.length > 15, c.id);
}
for (const q of written) assert.ok(q.criteria.length === 3 && q.modelAnswer && /쪽$/.test(q.sourceNote), q.id);
const answer = (shown, prompt = '') => { const c = cards.find(c => c.subject === shown && c.question.includes(prompt)); assert.ok(c, shown); return c.answers[c.correct]; };
assert.equal(answer('부주의로 손을 ___.'), '다쳤다');
assert.equal(answer('비가 와서 우산을 ___ 간다.'), '받치고');
assert.equal(answer('생각하건대'), '생각건대');
assert.equal(answer('나무 + 잎'), '나뭇잎');
assert.equal(answer('장마 + 비 → 장맛비 [장마삐]'), '뒷말 첫소리 된소리');
assert.equal(answer('너뿐이야. / 웃을 뿐이었다.'), '조사–의존 명사');
assert.equal(answer('마중 (맞- + -웅)'), '-이·-음 외 접미사가 붙음');
assert.equal(answer('사람___ 그럴 수는 없다.'), '으로서');
console.log(`PASS: 국어 group (뉴욕제과점 · 문법 · 고전 시가), ${cards.length} self-contained grammar cards over ${new Set(cards.map(c => c.topic)).size} topics, ${written.length} written, sources and rule checks.`);
