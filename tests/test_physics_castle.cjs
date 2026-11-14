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

if (failed){ console.error(`physics castle: ${failed}개 실패`); process.exit(1); }
console.log('physics castle ok');
