// 피직스 캐슬(6.0.0~): public/physics-castle/의 따로 된 게임 페이지가 제대로 연결 · 배포되는지 확인한다.
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.join(__dirname, '..');
const dir = path.join(root, 'public', 'physics-castle');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
let failed = 0;
const check = (ok, msg) => { if (!ok) { failed++; console.error('✗ ' + msg); } };

const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
check(/^<!doctype html>/i.test(html), 'index.html은 <!doctype html>로 시작해야 해요');
check(html.includes('<meta charset="utf-8">'), 'index.html에 charset이 있어야 해요');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
check(scripts[0] === 'three.min.js', 'three.min.js를 먼저 불러야 해요(전역 THREE)');
check(!scripts.some(s => /^https?:/.test(s)), '스크립트는 저장소 안 파일만 써요(CDN 금지)');
for (const s of scripts){
  const file = path.join(dir, s);
  check(fs.existsSync(file), `${s} 파일이 있어야 해요`);
  if (s.startsWith('js/') && fs.existsSync(file)){
    try { execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }); } catch (e){ check(false, `${s} 문법 오류: ${e.stderr}`); }
    const src = fs.readFileSync(file, 'utf8');
    for (const m of src.matchAll(/localStorage\.(?:getItem|setItem|removeItem)\(\s*(?:'([^']+)'|([A-Z_]+))/g)){ if (m[1]) check(m[1].startsWith('johamin-castle-'), `${s}: 저장 키 '${m[1]}'는 johamin-castle- 접두사여야 해요`); }
    check(!/\bimport\s|\bexport\s/.test(src), `${s}: 클래식 스크립트라 import/export를 쓰지 않아요`);
  }
}
const three = fs.readFileSync(path.join(dir, 'three.min.js'), 'utf8');
check(/REVISION\s*=\s*"128"|REVISION="128"/.test(three) || three.includes('"128"'), 'Three.js r128이어야 해요');
check(/SAVE_KEY = 'johamin-castle-save-v1'/.test(fs.readFileSync(path.join(dir, 'js/core.js'), 'utf8')), '진행 저장 키는 johamin-castle-save-v1');

// 앱 쪽 연결
check(/'castle'/.test(read('lib/labs.ts')), "LabKind에 'castle'이 있어야 해요");
check(/id: 'physics-yang-final'[^\n]*lab: \[[^\]]*'castle'/.test(read('data/final-subjects.ts')), '양동비T 기말 덱 lab에 castle이 있어야 해요');
check(/physics-castle\//.test(read('components/swipe/SubjectStudy.tsx')), '학습 메뉴 카드가 physics-castle/로 가야 해요');
// 오프라인: 미리 받기에서 빼고, 워커가 앱 첫 화면 사본으로 저장하지 않는다
check(/physics-castle/.test(read('vite.config.ts')), 'vite.config.ts가 physics-castle을 미리 받기에서 빼야 해요');
const sw = read('public/sw.js');
check(/physics-castle[\s\S]{0,80}castle\(request\)/.test(sw), 'sw.js가 physics-castle 요청을 castle()로 따로 처리해야 해요');
check(sw.indexOf('castle(request)') < sw.indexOf("request.mode === 'navigate') event.respondWith(page(request))"), 'physics-castle 검사가 page()보다 먼저여야 해요');

// 랭킹(6.1.0~): 앱 로그인을 같이 쓴다. 키 · 주소가 앱과 어긋나면 로그인해도 게임이 모른다.
const rank = fs.readFileSync(path.join(dir, 'js/rank.js'), 'utf8');
const authTs = read('lib/auth.ts'), cfg = read('lib/supabase-config.ts'), examTs = read('lib/exam.ts');
const val = (src, re) => { const m = src.match(re); return m && m[1]; };
check(scripts.includes('js/rank.js') && scripts.indexOf('js/rank.js') < scripts.indexOf('js/ui.js'), 'rank.js를 ui.js보다 먼저 불러야 해요');
check(val(rank, /RK_AUTH = '([^']+)'/) === val(authTs, /storageKey: '([^']+)'/), '게임의 로그인 키가 lib/auth.ts storageKey와 같아야 해요');
check(val(rank, /RK_RETURN = '([^']+)'/) === val(authTs, /RETURN_KEY = '([^']+)'/), '로그인 뒤 돌아오기 키가 lib/auth.ts RETURN_KEY와 같아야 해요');
check(val(rank, /RK_URL = '([^']+)'/) === val(cfg, /SUPABASE_URL = '([^']+)'/), 'Supabase 주소가 lib/supabase-config.ts와 같아야 해요');
check(val(rank, /RK_KEY = '([^']+)'/) === val(cfg, /SUPABASE_PUBLISHABLE_KEY = '([^']+)'/), '공개 키가 lib/supabase-config.ts와 같아야 해요');
check(/^sb_publishable_/.test(val(rank, /RK_KEY = '([^']+)'/) || ''), '게임에는 공개 키(sb_publishable_)만 넣어요');
check(!/service_role|sb_secret_/.test(rank), '비밀 키 금지');
for (const k of [...rank.matchAll(/const RK_(?:NICK|SENT) = '([^']+)'/g)].map(m => m[1])) check(k.startsWith('johamin-castle-'), `랭킹 저장 키 '${k}'는 johamin-castle- 접두사여야 해요`);
check(/CASTLE_URL = `\$\{BASE\}physics-castle\/`/.test(examTs) && /RETURN_URLS[^\n]*CASTLE_URL/.test(examTs), 'lib/exam.ts RETURN_URLS에 피직스 캐슬 주소가 있어야 해요');
check(/RETURN_URLS\.includes\(returnTo\)/.test(authTs), 'lib/auth.ts가 RETURN_URLS로 돌아갈 곳을 확인해야 해요');
const sql = read('db/castle-ranking-6.1.0.sql');
for (const fn of ['castle_submit', 'castle_board', 'castle_me', 'castle_forget']){
  check(new RegExp(`function public\\.${fn}\\(`).test(sql), `db: ${fn} 함수가 있어야 해요`);
  check(new RegExp(`revoke execute on function public\\.${fn}\\([^)]*\\) from public, anon`).test(sql), `db: ${fn}은 로그인 안 한 사람에게 막혀야 해요`);
  check(rank.includes(`'${fn}'`), `rank.js가 ${fn}을 불러야 해요`);
}
check(/castle_scores enable row level security/.test(sql) && !/create policy[^;]*castle_scores/i.test(sql), 'castle_scores는 RLS를 켜고 정책 없이 함수로만 써요');
check(!/email/i.test(sql.replace(/--[^\n]*/g, '')), '랭킹 표에 이메일을 저장하지 않아요');
check(/피직스 캐슬|랭킹/.test(read('public/privacy.html')) , '개인정보처리방침에 랭킹(별명 · 기록)을 적어야 해요');


// 광전류–전압 곡선(6.3.1~): village.js의 닫힌 식 labFrac이 모형의 정의를 그대로 적분한 값과 같은지 다시 계산한다.
// 정의: 운동 에너지 K ~ 고르게(0..Kmax), 모이는 비율 f(K) = min(1, max(0, k(1 + u/K)))   (u = eU)
{
  const vsrc = fs.readFileSync(path.join(dir, 'js/village.js'), 'utf8');
  const kM = vsrc.match(/const LAB_K = ([\d.]+);/), fM = vsrc.match(/function labFrac\(u, Km\)\{[\s\S]*?\n\}/);
  check(kM && fM, 'village.js에 LAB_K와 labFrac이 있어야 해요');
  if (kM && fM){
    const LAB_K = +kM[1], labFrac = new Function('LAB_K', `${fM[0]}; return labFrac;`)(LAB_K);
    const numeric = (u, Km) => { const n = 20000; let s = 0; for (let i = 0; i < n; i++){ const K = (i + .5)/n*Km; s += Math.min(1, Math.max(0, LAB_K*(1 + u/K))); } return s/n; };
    let worst = 0;
    for (const Km of [.15, .38, 1, 2.3]) for (let u = -Km*1.1; u <= 2.2; u += Km/37) worst = Math.max(worst, Math.abs(labFrac(u, Km) - numeric(u, Km)));
    check(worst < 2e-3, `광전류 닫힌 식이 정의를 적분한 값과 달라요 (최대 차이 ${worst.toFixed(4)})`);
    check(labFrac(-.38, .38) === 0 && labFrac(-.5, .38) === 0, '정지 전압 이하에서는 전류 0');
    check(Math.abs(labFrac(-1e-9, .38) - LAB_K) < 1e-6 && Math.abs(labFrac(1e-9, .38) - LAB_K) < 1e-6, '0 V에서 양쪽 식이 k로 이어져야 해요');
    check(labFrac(.38*(1 - LAB_K)/LAB_K + 1e-6, .38) === 1, '포화 전압 이상에서는 포화 전류');
  }
}

// 발전 패널(6.3.2~): 평행판 광전관 → 한 파장의 전류 비율 panelFrac = 1 − w + w ln w (계단 식이 아님)
{
  const csrc = fs.readFileSync(path.join(dir, 'js/core.js'), 'utf8');
  const m = csrc.match(/const panelFrac = ([^\n]*);/);
  check(m, 'core.js에 panelFrac이 있어야 해요');
  check(!/const currentAt = \(L, U\) => L\.filter\(l => l\.V > U\)/.test(csrc), '패널 전류를 계단 식(정지 전압이 U보다 큰 빛만 통째로)으로 더하지 않아요');
  if (m){
    const f = eval(m[1]); let worst = 0, prev = f(0, .8);
    for (let U = .001; U < .8; U += .001){ const v = f(U, .8); worst = Math.max(worst, Math.abs(v - prev)); prev = v; }
    check(f(0, .8) === 1 && f(.8, .8) === 0, '패널: U = 0이면 전부, U = Kmax면 0');
    check(worst < .01, `패널 전류 비율이 끊기지 않고 이어져야 해요 (최대 한 걸음 변화 ${worst.toFixed(4)})`);
  }
}

// 교전 범위 자격 시험(6.4~): 표의 정답이 렌즈 식 · 닮음으로 맞는지, 오답이 정답과 겹치지 않는지
{
  const fsrc = fs.readFileSync(path.join(dir, 'js/forge.js'), 'utf8');
  const m = fsrc.match(/const RANGE_Q = (\{[\s\S]*?\n\});/), wm = fsrc.match(/function wrongs\(ans, cands\)\{[^\n]*\n?/);
  check(m && wm, 'forge.js에 RANGE_Q와 wrongs가 있어야 해요');
  if (m && wm){
    const Q = eval('(' + m[1].replace(/\/\/[^\n]*/g, '') + ')'), wrongs = new Function(`${wm[0]}; return wrongs;`)();
    for (const [a, f, b] of Q.image) check(Math.abs(1/a + 1/b - 1/f) < 1e-9, `상 거리 문제 a=${a} f=${f} → b=${b}가 렌즈 식과 달라요`);
    for (const [a, b, f] of Q.focal) check(Math.abs(1/a + 1/b - 1/f) < 1e-9, `초점 거리 문제 a=${a} b=${b} → f=${f}가 렌즈 식과 달라요`);
    for (const [r, F, D, x] of Q.beam) check(D > F && Math.abs(r*(D - F)/F - x) < 1e-9, `빔 반지름 문제 r=${r} F=${F} D=${D} → ${x}가 닮음과 달라요`);
    for (const ans of [1, 2, 5, 18, 60]){ const w = wrongs(ans, [ans, ans + 1, ans + 1, -3]); check(w.length === 3 && !w.includes(ans) && new Set(w).size === 3, `오답 고르기(${ans})가 3개 · 서로 다름 · 정답 아님이어야 해요`); }
  }
  // 웨이브 곡선: 첫 밤 4, 계속 오른다, 5의 배수 근처가 더 가파르다, 마리 수 상한
  const csrc = fs.readFileSync(path.join(dir, 'js/core.js'), 'utf8');
  const blk = csrc.slice(csrc.indexOf('const WAVE_A'), csrc.indexOf('function waveList'));
  const env = new Function('sq', 'clamp', `${blk}; return {waveB, waveSize, hpMul, eliteCount, ELITE_HP, WAVE_CAP};`)(n => Math.sqrt(Math.max(0, n - 1)), (v, a, b) => Math.max(a, Math.min(b, v)));
  check(Math.abs(env.waveB(1) - 4) < 1e-9, '웨이브 1의 총 체력은 4 (예전과 같게)');
  let mono = true; for (let n = 2; n <= 80; n++) if (env.waveB(n) <= env.waveB(n - 1)) mono = false;
  check(mono, '총 체력은 밤마다 늘어야 해요');
  check(env.waveB(5) - env.waveB(4) > env.waveB(8) - env.waveB(7), '5밤 근처가 7~8밤 사이보다 가파르게 올라야 해요(계단)');
  for (let n = 1; n <= 80; n++){ const c = env.waveSize(n); check(c >= 3 && c <= env.WAVE_CAP, `밤 ${n}의 마리 수 ${c}가 3~${env.WAVE_CAP} 밖이에요`); check(Math.abs((c + env.ELITE_HP*env.eliteCount(n))*env.hpMul(n) - env.waveB(n)) < 1e-6, `밤 ${n}: 마리 수 × 체력 ≠ 총 체력`); }
  // 탑 광전관: solveCircuit이 u = R·I(u)를 풀었는지
  const sc = csrc.match(/function solveCircuit\(lines, R\)\{[\s\S]*?\n\}/), pf = csrc.match(/const panelFrac = ([^\n]*);/);
  check(sc && pf, 'core.js에 solveCircuit과 panelFrac이 있어야 해요');
  if (sc && pf){
    const panelFrac = eval(pf[1]), solve = new Function('panelFrac', `${sc[0]}; return solveCircuit;`)(panelFrac);
    for (const [lines, R] of [[[{I:.2, V:1.2}], 3], [[{I:.05, V:.4}, {I:.3, V:2.1}, {I:.1, V:.9}], 6], [[{I:2, V:.7}], 10], [[{I:.001, V:3}], 4]]){
      const c = solve(lines, R), Iu = lines.reduce((t, l) => t + l.I*panelFrac(c.u, l.V), 0);
      check(Math.abs(c.u - R*Iu) < 1e-6 && c.u >= 0 && c.u < Math.max(...lines.map(l => l.V)), `탑 회로식이 u = R·I(u)를 못 풀었어요 (R=${R})`);
    }
  }
}
if (failed){ console.error(`physics castle: ${failed}개 실패`); process.exit(1); }
console.log('physics castle ok');
