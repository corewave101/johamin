const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript');
for(const ext of ['.ts','.tsx'])require.extensions[ext]=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:1,target:9,jsx:4,esModuleInterop:true}}).outputText,f);
const {hwangExam,hwangFigurePage}=require('../data/hwang-exam.ts');
const {isShortQuestion}=require('../data/study-practice.ts');
const {gradeHwangAnswer}=require('../lib/hwang-answer.ts');
const short=hwangExam.filter(isShortQuestion),written=hwangExam.filter(q=>!isShortQuestion(q));
assert.equal(short.length,250);assert.equal(written.length,33);assert.equal(new Set(hwangExam.map(q=>q.id)).size,283);
const pages=new Set(hwangExam.map(q=>Number(/· (\d+)쪽$/.exec(q.sourceNote)[1])));
assert.deepEqual([...pages].sort((a,b)=>a-b),[3,4,5,6,7,8,9,11,12,13,14,15,16,17,18,19,20,22,23,24,25,26,27,28,29,30,32,33,35,36,37,38,43,44,45,46]);
for(const q of hwangExam){
 assert.ok(q.question&&q.modelAnswer&&q.criteria.length&&q.sourceNote,q.id);
 assert.ok(!/표류법|EM-?11|셔터|ISO/.test(q.modelAnswer),q.id);
 if(isShortQuestion(q)){assert.ok(gradeHwangAnswer(q.modelAnswer,q),q.id);assert.ok(!gradeHwangAnswer('',q),q.id);assert.ok(!gradeHwangAnswer('모르겠다',q),q.id);}
 const page=hwangFigurePage(q);if(page)assert.ok(fs.existsSync('public/images/hwang-exam/page-'+page+'.jpg'));
}
assert.equal(written[0].criteria.length,6);assert.equal(written[1].criteria.length,5);
const q=short.find(q=>q.modelAnswer==='균형추');assert.ok(gradeHwangAnswer('무게추',q));assert.ok(!gradeHwangAnswer('경통',q));
const n=short.find(q=>q.modelAnswer==='0.60');assert.ok(gradeHwangAnswer('0.6',n));assert.ok(!gradeHwangAnswer('60',n));
const opt=short.find(q=>q.modelAnswer==='31.7');assert.ok(!gradeHwangAnswer('50.8',opt));
const exported=JSON.parse(fs.readFileSync('db/cards.json','utf8')).cards;
for(const q of hwangExam){const row=exported.find(c=>c.id===q.id);assert.equal(row.answer,q.modelAnswer);assert.equal(row.deck_id,'astronomy-hwang');}
// Cards added after 3.5.2 (사회 뭉탱이) are new rows, not changes to the cards this check protects.
const prior=exported.filter(c=>!c.id.startsWith('hwang-exam-')&&c.deck_id!=='social-bulk'&&c.deck_id!=='biology-jo-bulk'&&c.deck_id!=='korean-classic'&&!c.id.startsWith('english-word-')).sort((a,b)=>a.id.localeCompare(b.id));
assert.equal(prior.length,1663);
assert.equal(require('node:crypto').createHash('sha256').update(JSON.stringify(prior)).digest('hex'), '310eedda11e5e81e0b46ec07ed894dbf6cdf26d18890b671dec0f21aece4c352', 'Existing cards changed');
console.log('PASS: 250 short + 33 written; exact included pages, no excluded content, aliases/numeric distinctions, diagrams, 6-step/5-safety rubric, DB export, all existing cards preserved.');
