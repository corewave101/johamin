// 3.11.0 로그인: 주소에 붙은 로그인 오류 정리, 학교 계정 표시, 오프라인용 통과 기록, 화면 연결.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const { takeAuthError, shortEmail, readMark, saveMark, clearMark, MEMBER_KEY } = require('../lib/member.ts');

// Login errors come back in the query or the hash; the message is read and the address cleaned.
let r = takeAuthError('https://corewave101.github.io/johamin/?error=access_denied&error_description=denied');
assert.equal(r.message, '로그인을 취소했거나 학교에서 막았어요.');
assert.equal(r.clean, 'https://corewave101.github.io/johamin/');
r = takeAuthError('https://x.io/johamin/#error=server_error&error_description=Database+error+saving+new+user');
assert.equal(r.message, 'Database error saving new user');
assert.equal(r.clean, 'https://x.io/johamin/');
r = takeAuthError('https://x.io/johamin/#demo');
assert.equal(r.message, null, 'normal addresses are untouched');
assert.equal(r.clean, 'https://x.io/johamin/#demo');

assert.equal(shortEmail('2610112@bsis.hs.kr'), '2610112');
assert.equal(shortEmail('2610112@BSIS.HS.KR'), '2610112');
assert.equal(shortEmail('someone@gmail.com'), 'someone@gmail.com');

// The remembered pass is only a device convenience and can be cleared.
const store = new Map();
global.localStorage = { getItem: k => store.get(k) ?? null, setItem: (k, v) => store.set(k, v), removeItem: k => store.delete(k) };
assert.equal(readMark(), null);
saveMark({ userId: 'u1', email: '2610112@bsis.hs.kr', ok: true, at: 1 });
assert.equal(readMark().ok, true);
assert.ok(MEMBER_KEY.startsWith('johamin-'));
store.set(MEMBER_KEY, '{"broken":');
assert.equal(readMark(), null, 'a damaged value is ignored');
clearMark();
assert.equal(store.has(MEMBER_KEY), false);

// Wiring: the menu sits behind the gate, cards are fetched with the login token, and only public keys are used.
const main = fs.readFileSync('app/main.tsx', 'utf8');
assert.ok(main.includes('<AuthGate>{isDemo ? <SwipeGame /> : <SubjectPicker />}</AuthGate>'));
assert.ok(fs.readFileSync('components/swipe/useLiveMenu.ts', 'utf8').includes('fetchCardRows(controller.signal, token)'));
const auth = fs.readFileSync('lib/auth.ts', 'utf8');
assert.ok(auth.includes("flowType: 'pkce'") && auth.includes('rpc/is_member'));
assert.ok(!/sb_secret_|eyJ[A-Za-z0-9_-]{20,}/.test(auth + fs.readFileSync('lib/supabase-config.ts', 'utf8')), 'no secret keys');
// The database decides who passes; user_metadata (editable by the user) must not be trusted there.
const sql = fs.readFileSync('db/login-3.11.0.sql', 'utf8');
assert.ok(sql.includes("auth.jwt() ->> 'email'") && sql.includes("'google'"));
assert.ok(!/^[^-]*user_metadata/m.test(sql), 'is_member() never reads user_metadata');
console.log('PASS: login errors, school account names, remembered pass and the login gate wiring.');
