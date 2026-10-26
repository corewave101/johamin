// 4.3.2 익명 접속 수: 날짜별 숫자 하나만. 계정 · 이메일을 보내거나 저장하지 않는지 확인한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);

const sql = fs.readFileSync('db/visits-4.3.2.sql', 'utf8');
const table = sql.match(/create table if not exists public\.daily_visits \(([\s\S]*?)\);/)[1];
const columns = table.split('\n').map(l => l.trim()).filter(Boolean).map(l => l.split(/\s+/)[0]);
assert.deepEqual(columns, ['day', 'visits'], '날짜와 숫자만 저장한다');
assert.ok(/enable row level security/.test(sql) && !/create policy/.test(sql), '앱에서 읽을 수 없다(대시보드만)');
assert.ok(/revoke execute on function public\.count_visit\(\) from public, anon/.test(sql) && /if not public\.is_member\(\) then return/.test(sql));
assert.ok(!/auth\.uid\(\)|auth\.jwt\(\)|email/.test(sql.split('create or replace function')[1]), 'count_visit은 누구인지 쓰지 않는다');

const visits = fs.readFileSync('lib/visits.ts', 'utf8');
assert.ok(visits.includes("body: '{}'") && !/email|user\.id|userId/.test(visits.replace(/^\/\/.*$/gm, '')), '보내는 내용은 빈 요청');
assert.ok(visits.includes("'johamin-visit-day-v1'"));
const { seoulDay } = require('../lib/visits.ts');
assert.equal(seoulDay(new Date('2026-10-26T14:59:00Z')), '2026-10-26');
assert.equal(seoulDay(new Date('2026-10-26T15:00:00Z')), '2026-10-27', '서울 자정에 날짜가 바뀐다');
const auth = fs.readFileSync('lib/auth.ts', 'utf8');
assert.ok(/if \(ok\) void countVisit\(session\.access_token\);/.test(auth), '허용된 계정만, 로그인 확인 뒤에 센다');
assert.ok(fs.readFileSync('public/privacy.html', 'utf8').includes('접속 수'), '개인정보처리방침에 알린다');
console.log('PASS: 익명 접속 수 — 날짜 · 숫자만, 하루 한 번, 개인정보처리방침에 안내');
