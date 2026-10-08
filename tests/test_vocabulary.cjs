const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:1,target:ts.ScriptTarget.ES2022,jsx:4,esModuleInterop:true}}).outputText,f);
const {parkVocabulary:terms}=require('../data/park-vocabulary.ts');
const {compareAnswer,blankProgress,gradeTerm,currentRecord,streakDays,dayKey}=require('../lib/vocabulary.ts');
assert.equal(terms.length,22);assert.equal(new Set(terms.map(t=>t.id)).size,22);
assert.equal(terms[0].definition,'상동염색체의 특정한 같은 위치에 존재하며, 하나의 유전 형질을 결정하는 서로 다른 유전자이다. 상동염색체 위에 쌍으로 존재하는 대립유전자는 같을 수도 있고 다를 수도 있다.');
for(const t of terms){assert.ok(compareAnswer(t.definition,t.definition).correct);assert.ok(!compareAnswer(t.definition.slice(0,-1),t.definition).correct);assert.ok(!compareAnswer(t.definition.replace(' ','  '),t.definition).correct);assert.ok(compareAnswer(t.definition.replace(/ /g,''),t.definition,true).correct);}
assert.ok(compareAnswer('가','가').correct);assert.equal(compareAnswer('상동염색체는','상동염색체의').index,5);
const {scoreKeywords,splitPieces,keywordHit,looseText}=require('../lib/vocabulary.ts');const {vocabularySets}=require('../data/park-vocabulary.ts');
// keyword scoring: every definition scores full marks against itself; a partial answer gets partial credit, word order and spaces don't matter
for(const t of terms){const s=scoreKeywords(t.definition,t);assert.ok(t.keywords.length>=2,t.term);assert.equal(s.got,s.total,t.term);assert.ok(s.perfect,t.term);assert.ok(scoreKeywords(t.definition.replace(/ /g,''),t).perfect,t.term);
 assert.equal(t.pieces.join(' '),t.definition,t.term);assert.ok(t.pieces.length>=3&&t.pieces.length<=5,t.term);assert.equal(scoreKeywords('모르겠다',t).got,0,t.term);}
const allele=terms[0];let s=scoreKeywords('상동염색체의 같은 위치에 있는 서로 다른 유전자',allele);assert.equal(s.total,4);assert.equal(s.got,3);assert.ok(!s.perfect);assert.deepEqual(s.hits,[true,true,false,true]);
s=scoreKeywords('하나의 형질을 정하는 서로 다른 유전자로 상동 염색체의 같은 좌위에 있다',allele);assert.equal(s.got,4);
assert.equal(scoreKeywords('인산, 당, 염기가 1:1:1로 결합한 핵산의 기본 단위',terms.find(t=>t.term==='뉴클레오타이드')).got,5);
assert.equal(looseText(' A a '),'aa');assert.ok(keywordHit({label:'x',pattern:'같은(위치|좌위)'},'같은 좌위'));
// fixed sets cover all 22 terms exactly once
assert.deepEqual(vocabularySets.flatMap(x=>x.terms).sort(),terms.map(t=>t.term).sort());
// ordering pieces for written answers: sentences first, never cut inside brackets
for(const p of [splitPieces('가나다라마바사아자차카타파하는 것이므로 가나다라마바사아자차카타파하가 된다. 둘째 문장이다. 셋째 문장(예: 하나, 둘, 셋)이다.')]){assert.equal(p.join(' '),'가나다라마바사아자차카타파하는 것이므로 가나다라마바사아자차카타파하가 된다. 둘째 문장이다. 셋째 문장(예: 하나, 둘, 셋)이다.');assert.ok(p.every(x=>(x.match(/\(/g)??[]).length===(x.match(/\)/g)??[]).length));}
const {parkWritten}=require('../data/biology-written.ts');for(const q of parkWritten){const p=splitPieces(q.modelAnswer);assert.ok(p.length>=3,q.id);assert.equal(p.join(' '),q.modelAnswer.normalize('NFC'),q.id);}
// grading: XP in proportion to key ideas, best try per day, never twice; a full answer schedules review 1·3·7 days later
const t=allele,now=new Date('2026-10-08T12:00:00').getTime();let p=blankProgress();
p=gradeTerm(p,t,{got:3,total:4,perfect:false},true,now);assert.equal(p.xp,8);assert.equal(currentRecord(p,t).wins,0);assert.equal(currentRecord(p,t).due,now);assert.equal(currentRecord(p,t).mistakes,1);
p=gradeTerm(p,t,{got:4,total:4,perfect:false},true,now);assert.equal(p.xp,10);assert.equal(currentRecord(p,t).wins,1);assert.equal(p.days[dayKey(new Date(now))].length,1);assert.equal(currentRecord(p,t).due,now+86400000);
p=gradeTerm(p,t,{got:4,total:4,perfect:true},true,now);assert.equal(p.xp,10);assert.equal(currentRecord(p,t).wins,1);assert.ok(currentRecord(p,t).perfect);
p=gradeTerm(p,t,{got:4,total:4,perfect:false},false,now+86400000);assert.equal(p.xp,10);assert.equal(currentRecord(p,t).wins,1); // hint: no XP, no new win
p=gradeTerm(p,t,{got:4,total:4,perfect:false},true,now+86400000);assert.equal(p.xp,20);assert.equal(currentRecord(p,t).wins,2);assert.equal(currentRecord(p,t).due,now+86400000+3*86400000);
p=gradeTerm(p,t,{got:1,total:4,perfect:false},true,now+86400000);assert.equal(currentRecord(p,t).wins,1);assert.equal(currentRecord(p,t).due,now+86400000);
// a 3.1 record that already got its 10 XP today gets no more
let old={...blankProgress(),xp:10,terms:{[t.id]:{definition:t.definition,wins:1,mistakes:0,due:0,starred:false,lastCredit:dayKey(new Date(now))}}};old=gradeTerm(old,t,{got:4,total:4,perfect:false},true,now);assert.equal(old.xp,10);
assert.equal(currentRecord(p,{...t,definition:t.definition+'변경'}).wins,0);
assert.equal(streakDays({ '2026-10-07':['a'],'2026-10-08':['b'] },new Date(now)),2);
assert.equal(streakDays({ '2026-10-07':['a'] },new Date(now)),1);
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {subjectDecks}=require('../data/swipe-subjects.ts');const SubjectStudy=require('../components/swipe/SubjectStudy.tsx').default;
const html=renderToStaticMarkup(React.createElement(SubjectStudy,{deck:subjectDecks.find(d=>d.id==='biology-park'),onBack:()=>{}}));
assert.ok(html.includes('→ 원문 단어장'));assert.ok(html.includes('22개 용어'));assert.ok(html.includes('객관식 47 · 서술형 14'));
const ParkVocabulary=require('../components/swipe/ParkVocabulary.tsx').default;const vocab=renderToStaticMarkup(React.createElement(ParkVocabulary,{onBack:()=>{}}));
for(const label of ['↑ 카드로 외우기','← 문장 배치','→ 쓰기 테스트','↓ 박상영T'])assert.ok(vocab.includes(label),label);
console.log('PASS: 22 source definitions with key ideas and ordering pieces, lenient keyword scoring with partial credit, word-for-word badge, fixed sets, proportional XP without duplicates, review scheduling, card-style menus.');
