const assert=require('node:assert/strict'), fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,f);
const {physicsCards:cards}=require('../data/physics-cards.ts');const {physicsWritten:written}=require('../data/physics-written.ts');const {subjectMenu}=require('../data/swipe-subjects.ts');
assert.deepEqual(new Set(subjectMenu.children.map(x=>x.id)),new Set(['science','humanities']));
const science=subjectMenu.children.find(x=>x.id==='science');assert.deepEqual(science.children.map(x=>x.id),['biology','astronomy','physics-ii']);
assert.equal(cards.length,72);assert.equal(written.length,18);
const ranges=[[86,91],[99,103],[109,115],[122,128],[136,142],[152,157]];
for(let u=6;u<=11;u++){const list=cards.filter(c=>c.id.startsWith(`physics-u${String(u).padStart(2,'0')}-`));assert.equal(list.length,12);const answers={};for(const c of list){answers[c.correct]=(answers[c.correct]??0)+1;}assert.deepEqual(Object.values(answers),[3,3,3,3]);}
for(const c of [...cards,...written]) { assert.ok(c.question.length<=200,c.id);assert.ok(!/위 그림|위 자료|앞 문제|학습지에서/.test(c.question),c.id);const u=Number(c.id.match(/u(\d+)/)[1]);const p=Number(c.sourceNote.match(/(\d+)쪽$/)[1]);assert.ok(p>=ranges[u-6][0]&&p<=ranges[u-6][1],c.id); }
for(const c of cards){assert.equal(new Set(Object.values(c.answers)).size,4,c.id);assert.ok(Object.values(c.answers).every(s=>s.length<=40),c.id);assert.ok(c.explanation.length>=16,c.id);}
const answer=id=>{const c=cards.find(c=>c.id===id);return c.answers[c.correct];};
assert.equal(answer('physics-u07-003'),'2 Ω');assert.equal(answer('physics-u08-006'),'12 μC');assert.equal(answer('physics-u08-007'),'100 μJ');assert.equal(answer('physics-u10-003'),'6 V');assert.equal(answer('physics-u11-007'),'2 mm');
// Independent numeric checks of the governing relations.
assert.equal(1/(1/3+1/6),2);assert.ok(Math.abs(.5*2e-6*10**2-100e-6)<1e-12);assert.ok(Math.abs(20*.03/.1-6)<1e-12);assert.equal(500e-9*2/(.5e-3),.002);
console.log('PASS: two subject branches, six physics units, 72 balanced choices + 18 rubrics, scope/source ranges and independent numeric checks.');
