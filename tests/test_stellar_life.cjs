// 별의 일생 3D(6.8.0~): public/stellar-life/의 따로 된 페이지가 제대로 연결되고, 물리 식이 맞는지 확인한다.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { execFileSync } = require('child_process');
const root = path.join(__dirname, '..');
const dir = path.join(root, 'public', 'stellar-life');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
let failed = 0;
const check = (ok, msg) => { if (!ok) { failed++; console.error('✗ ' + msg); } };

const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
check(/^<!doctype html>/i.test(html), 'index.html은 <!doctype html>로 시작해야 해요');
check(html.includes('<meta charset="utf-8">'), 'index.html에 charset이 있어야 해요');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
check(scripts[0] === 'three.min.js', 'three.min.js를 먼저 불러야 해요(전역 THREE)');
check(!scripts.some(s => /^https?:/.test(s)), '스크립트는 저장소 안 파일만 써요(CDN 금지)');
check(scripts.indexOf('js/star.js') === 1, 'star.js(물리)가 Three.js 다음에 와야 해요');
for (const s of scripts) {
  const file = path.join(dir, s);
  check(fs.existsSync(file), `${s} 파일이 있어야 해요`);
  if (s.startsWith('js/') && fs.existsSync(file)) {
    try { execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' }); } catch (e) { check(false, `${s} 문법 오류: ${e.stderr}`); }
    const src = fs.readFileSync(file, 'utf8');
    for (const m of src.matchAll(/localStorage\.(?:getItem|setItem|removeItem)\(\s*'([^']+)'/g)) check(m[1].startsWith('johamin-stellar-'), `${s}: 저장 키 '${m[1]}'는 johamin-stellar- 접두사여야 해요`);
    check(!/\bimport\s|\bexport\s/.test(src), `${s}: 클래식 스크립트라 import/export를 쓰지 않아요`);
  }
}
check(html.includes('href="../"'), '처음 화면에 조하민으로 돌아가는 버튼이 있어야 해요');
check(/시뮬레이션[\s\S]{0,40}먼저[\s\S]{0,40}문제/.test(html), '처음 화면에 시뮬 → 문제 순서 안내가 있어야 해요');

// 물리 식 (star.js)
const ctx = { window: {}, Math, console };
vm.runInNewContext(fs.readFileSync(path.join(dir, 'js/star.js'), 'utf8'), ctx);
const S = ctx.window.STAR;
const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.abs(b);
check(near(S.msL(1), 1, 1e-9) && near(S.msR(1), 1, 1e-9), '태양: L = 1, R = 1');
check(near(S.teff(1, 1), 5772, 1e-9), '태양 표면 온도 5772 K (L = 4πR²σT⁴)');
check(near(S.tMS(1), 1e10, 1e-9), '태양 주계열 수명 100억 년');
check(S.tMS(10) < S.tMS(1) / 100, '무거운 별일수록 주계열 수명이 짧아요');
check(near(S.coreT(1, S.R_IGNITE(1)), 1e7, 1e-9), '점화 반지름에서 중심 온도 1000만 K');
check(S.fate(0.05) === 'brown' && S.fate(1) === 'wd' && S.fate(15) === 'ns' && S.fate(30) === 'bh', '질량별 최후');
const t1 = S.lifeTrack(1).phases.map(p => p.key).join(',');
check(t1 === 'protostar,premain,ms,rgb,giant,agb,pn,wd', '태양급 일생 순서: ' + t1);
const t15 = S.lifeTrack(15).phases.map(p => p.key).join(',');
check(t15 === 'protostar,premain,ms,rsg,sn,ns', '15 M☉ 일생 순서: ' + t15);
check(S.ONION.map(o => o.core).join('') === 'HeCNeOSi', '초거성 중심핵 순서: 헬륨 → 탄소 → 네온 → 산소 → 규소');
check(near(S.FUSION.frac, 0.0071, 0.02), '4 ¹H → ⁴He 질량 결손 약 0.7%');
for (const q of S.Q) check(new Set(q.opts).size === 4 && q.why && q.p >= 35 && q.p <= 41, `문제 ${q.id}: 보기 4개 · 해설 · 학습지 쪽`);
check(new Set(S.Q.map(q => q.id)).size === S.Q.length, '문제 id는 고유');

// 앱 쪽 연결
check(/'stellar'/.test(read('lib/labs.ts')), "LabKind에 'stellar'가 있어야 해요");
check(/id: 'astronomy-jeon-final'[^\n]*lab: 'stellar'/.test(read('data/final-subjects.ts')), '전효진T 기말 덱 lab에 stellar가 있어야 해요');
check(/stellar-life\//.test(read('components/swipe/SubjectStudy.tsx')), '학습 메뉴 카드가 stellar-life/로 가야 해요');
check(/stellar-life/.test(read('vite.config.ts')), 'vite.config.ts가 stellar-life를 미리 받기에서 빼야 해요');
const sw = read('public/sw.js');
check(/stellar-life[\s\S]{0,80}castle\(request\)/.test(sw), 'sw.js가 stellar-life 요청을 castle()로 따로 처리해야 해요');

if (failed) { console.error(`${failed}개 실패`); process.exit(1); }
console.log('✓ stellar-life ok');
