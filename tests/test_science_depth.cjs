const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,f);
const {parkDepthCards:park,parkDepthWritten:pw}=require('../data/biology-depth.ts');
const {joDepthCards:jo,joDepthWritten:jw}=require('../data/biology-jo-depth.ts');
const {chemistryCards:chem,chemistryWritten:cw}=require('../data/chemistry-content.ts');
const {scienceDepthConcepts:concepts}=require('../data/science-depth-concepts.ts');
const {strongTitration,bufferAddition,approximationPercent}=require('../lib/chemistry-lab.ts');
const {subjectMenu,subjectDecks}=require('../data/swipe-subjects.ts');
assert.deepEqual([park.length,pw.length,jo.length,jw.length,chem.length,cw.length],[64,12,18,3,76,13]);
assert.equal(concepts.length,16);
for(const cards of [park,jo,chem]) {
 const correct={};assert.equal(new Set(cards.map(c=>c.question)).size,cards.length);
 for(const c of cards){assert.equal(new Set(Object.values(c.answers)).size,4,c.id);assert.ok(Object.values(c.answers).every(x=>x.length<=40),c.id);assert.ok(c.question.length<=200 && !/위 그림|위 자료|앞 문제|학습지에서/.test(c.question),c.id);assert.ok(c.explanation.length>=16 && c.sourceNote,c.id);correct[c.correct]=(correct[c.correct]??0)+1;}
 assert.ok(Math.max(...Object.values(correct))-Math.min(...Object.values(correct))<=1);
}
for(const q of [...pw,...jw,...cw]) {assert.ok(q.modelAnswer.length>50);assert.equal(new Set(q.criteria).size,3);}
const answer=(list,fragment)=>{const c=list.find(c=>c.question.includes(fragment));assert.ok(c,fragment);return c.answers[c.correct];};
assert.equal(answer(park,'AB:420'),'20%');assert.equal((100+100)/(420+380+100+100),.2);
assert.equal(answer(park,'재조합률이 12%'),'6%');assert.equal(.12/2,.06);
assert.equal(answer(park,'p=10⁻⁹'),'A가 3 높다');assert.equal(-Math.log10(1e-9)+Math.log10(1e-6),3);
assert.equal(answer(park,'1분열에서 비분리'),'n+1 두 개·n−1 두 개');
assert.equal(answer(park,'2분열 비분리했다'),'정상 두 개·n+1·n−1');
assert.equal(answer(park,'정상 자녀 중 Aa'),'2/3');
assert.equal(answer(jo,'100개 아미노산'),'303개');assert.equal(answer(jo,'GCU-3′에 역평행'),'5′-AGC-3′');
assert.equal(answer(chem,'NaOH 22.0'),'0.110 M');assert.ok(Math.abs(.1*.022/.02-.11)<1e-12);
assert.equal(answer(chem,'질량 백분율은'),'4.8%');assert.equal(.8*60/1000*100,4.8);
assert.equal(answer(chem,'잔류 물이 표준'),'산 농도를 과대 추정');
assert.equal(answer(chem,'잔류 물이 정량'),'과소 추정');
assert.equal(answer(chem,'기포가 적정 중'),'과대 추정');
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
close(strongTitration(.1,20,.1,0).ph,1);close(strongTitration(.1,20,.1,20).ph,7);close(strongTitration(.1,20,.1,30).ph,12.30102999566398);
close(strongTitration(.1,20,.2,10).ph,7);close(strongTitration(.1,20,.2,0).endpointMl,10);
assert.throws(()=>strongTitration(.1,20,.1,-1),RangeError);
let last=0;for(let v=0;v<=30;v+=.1){const ph=strongTitration(.1,20,.1,v).ph;assert.ok(Number.isFinite(ph)&&ph>=last);last=ph;}
assert.deepEqual(bufferAddition(10,10,2,'acid'),{ha:12,a:8,excess:0,buffering:true});
assert.deepEqual(bufferAddition(10,10,3,'base'),{ha:7,a:13,excess:0,buffering:true});
assert.deepEqual(bufferAddition(10,10,12,'base'),{ha:0,a:20,excess:2,buffering:false});
assert.equal(approximationPercent(.01,.003).acceptable,false);close(approximationPercent(.1,.002).percent,2);assert.equal(approximationPercent(.1,.005).acceptable,true);assert.equal(approximationPercent(.01,.02),null);assert.equal(approximationPercent(0,.001),null);
const science=subjectMenu.children.find(n=>n.id==='science');const group=science.children.find(n=>n.id==='physics-chemistry');assert.equal(group.kind,'group');assert.deepEqual(group.children.map(n=>n.id),['physics-ii','chemistry']);
function directions(g){assert.equal(new Set(g.children.map(n=>n.direction)).size,g.children.length);assert.ok(g.children.every(n=>n.direction!=='down'));g.children.filter(n=>n.kind==='group').forEach(directions);}directions(subjectMenu);
assert.ok(subjectDecks.find(d=>d.id==='chemistry').cards.length);
console.log('PASS: 186 new cards, 16 concepts, chiasma/GWAS/nondisjunction/codon semantics, independent chemistry calculations, titration monotonicity and menu directions.');
const release=fs.readFileSync('db/science-depth-release.sql','utf8');
assert.ok(release.includes('raise exception')&&release.includes('on conflict(id) do nothing;'));
assert.ok(!/\b(update|delete)\s+(public\.|from\s+public\.)/i.test(release),'Additive release may not overwrite existing rows');
assert.ok(release.includes('<> 186'));
for(const c of [...park,...jo,...chem,...pw,...jw,...cw])assert.ok(release.includes(c.id),c.id);
for (const ext of ['.tsx']) require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,f);
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),Lab=require('../components/swipe/ChemistryLab.tsx').default;
const menuHtml=renderToStaticMarkup(React.createElement(Lab,{onBack:()=>{}}));
for(const text of ['적정 곡선','완충 성분 변화','5% 근사 검토','학습 메뉴'])assert.ok(menuHtml.includes(text));
console.log('PASS: chemistry experiment menu renders and additive SQL covers all 186 rows without existing row updates/deletes.');
