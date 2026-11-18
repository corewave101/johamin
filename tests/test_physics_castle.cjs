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
if (failed){ console.error(`physics castle: ${failed}개 실패`); process.exit(1); }
console.log('physics castle ok');
