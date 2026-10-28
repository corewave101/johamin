// 양동비T 편광 가상실험실(4.10.0~): 말뤼스 법칙 계산, LCD 모형, 광자 정보 전송(BB84) 모형, 화면 연결을 확인한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const lab = require('../lib/polarization-lab.ts');
const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-9, `${msg}: ${a} vs ${b}`);

// 자연광 한 장: 각도와 관계없이 절반, 나온 빛은 투과축 방향
for (const t of [0, 17, 45, 90, 135, 180]) {
  const [s] = lab.benchStages({ source: 'natural', i0: 100, phi: 0, plates: [t] });
  near(s.intensity, 50, `natural ${t}`); assert.equal(s.pol, lab.fold(t)); assert.equal(s.delta, null);
}
near(lab.naturalAverage(100), 50, 'average of cos² over 0~π');
// 선편광 한 장: 말뤼스 법칙
for (const [phi, t, want] of [[0, 0, 100], [0, 60, 25], [30, 60, 75], [0, 90, 0], [45, 0, 50], [0, 180, 100]]) near(lab.finalIntensity({ source: 'linear', i0: 100, phi, plates: [t] }), want, `linear ${phi}->${t}`);
// 두 장: 두 번째 판은 θ₂ − θ₁ (광원 방향이 아니라)
near(lab.finalIntensity({ source: 'natural', i0: 100, phi: 0, plates: [0, 60] }), 12.5, 'natural two 60');
near(lab.finalIntensity({ source: 'linear', i0: 100, phi: 0, plates: [30, 90] }), 100 * 0.75 * 0.25, 'linear two');
near(lab.finalIntensity({ source: 'natural', i0: 100, phi: 0, plates: [0, 90] }), 0, 'crossed');
const dark = lab.benchStages({ source: 'linear', i0: 100, phi: 0, plates: [90, 0] });
assert.equal(dark[0].pol, null, '빛이 없으면 편광 방향도 없다'); near(dark[1].intensity, 0, 'stays dark');
// 세 장: 수직인 두 판 사이 α → ⅛I₀ sin²2α, α = 45°에서 최대
for (const a of [0, 15, 30, 45, 60, 75, 90]) near(lab.finalIntensity({ source: 'natural', i0: 80, phi: 0, plates: [0, a, 90] }), lab.threePlates(80, a), `three ${a}`);
near(lab.threePlates(100, 45), 12.5, 'max ⅛I₀');
assert.ok([0, 10, 20, 30, 40, 50, 60, 70, 80, 90].every(a => lab.threePlates(100, a) <= lab.threePlates(100, 45) + 1e-12));

// LCD: 전압 끄면 액정이 90° 돌려 밝고, 켜면 어둡다
assert.ok(lab.lcdPixel(100, false).bright && Math.abs(lab.lcdPixel(100, false).out - 50) < 1e-9);
assert.ok(!lab.lcdPixel(100, true).bright && lab.lcdPixel(100, true).out === 0);
near(lab.overLinear(100, 90, 90), 100, 'outer polarizer parallel'); near(lab.overLinear(100, 90, 0), 0, 'outer crossed'); near(lab.overNatural(100), 50, 'natural half');

// BB84: 편광 대응, 같은 기준 = 같은 비트, 도청 없으면 기준 일치 비트 오류 0, 도청 있으면 약 25%
assert.deepEqual([lab.polOf(0, '+'), lab.polOf(1, '+'), lab.polOf(0, '×'), lab.polOf(1, '×')], [0, 90, 45, 135]);
const rnd = lab.seeded(20261028);
let clean = 0, kept = 0, errors = 0, evKept = 0;
for (let run = 0; run < 400; run += 1) {
  const plan = lab.randomPlan(24, rnd);
  const quiet = lab.transmit(plan, false, rnd);
  for (const i of lab.sift(quiet)) { kept += 1; if (quiet[i].aBit !== quiet[i].bBit) clean += 1; }
  const tapped = lab.transmit(plan, true, rnd);
  for (const i of lab.sift(tapped)) { evKept += 1; if (tapped[i].aBit !== tapped[i].bBit) errors += 1; }
  assert.ok(tapped.every(p => p.eBasis && (p.eBit === 0 || p.eBit === 1)));
}
assert.equal(clean, 0, '도청이 없으면 기준이 같은 비트는 모두 일치');
assert.ok(kept > 400 * 24 * 0.4 && kept < 400 * 24 * 0.6, `about half kept: ${kept}`);
const rate = errors / evKept;
assert.ok(rate > 0.22 && rate < 0.28, `intercept-resend error rate ≈ 25%: ${rate}`);
// 검사 표본: 일치 번호 중에서만, 적어도 1개, 검사한 비트는 키에서 빠진다
const photons = lab.transmit(lab.randomPlan(16, rnd), false, rnd);
const kept16 = lab.sift(photons), sample = lab.pickSample(kept16, rnd);
assert.ok(sample.every(i => kept16.includes(i)) && (kept16.length === 0 || sample.length >= 1));
const result = lab.keyResult(photons, sample);
assert.equal(result.aKey.length, kept16.length - sample.length); assert.deepEqual(result.aKey, result.bKey); assert.equal(result.safe, sample.length > 0);
// XOR 암호화 · 복호화
const msg = lab.parseBits('1011'), key = lab.parseBits('0110');
assert.deepEqual(lab.xor(msg, key), [1, 1, 0, 1]); assert.deepEqual(lab.xor(lab.xor(msg, key), key), msg);
assert.equal(lab.parseBits('10a'), null);

// 화면: 양동비T 덱 학습 메뉴에 들어가고, 선생님 파일의 공동 접속 · 다운로드는 뺐다
const component = fs.readFileSync('components/swipe/PolarizationLab.tsx', 'utf8');
assert.ok(!/fetch\(|https?:\/\/|chatgpt|WebSocket|localStorage/.test(component), '서버 · 외부 주소 · 기기 저장 없음');
assert.ok(!/download|\.csv/i.test(component), '다운로드 없음');
assert.ok(!/from '\.\.\/\.\.\/data\//.test(component), '실습 화면은 카드 묶음을 불러오지 않는다');
assert.ok(/<MenuCard/.test(component) && /Escape/.test(component), '메뉴는 MenuCard(방향키 · 스와이프), Esc는 뒤로');
const study = fs.readFileSync('components/swipe/SubjectStudy.tsx', 'utf8');
assert.ok(study.includes("polarization = labs.includes('polarization')") && study.includes('<PolarizationLab'));
assert.ok(fs.readFileSync('app/main.tsx', 'utf8').includes("import '../components/swipe/polarization.css';"));
console.log(`PASS: 편광 가상실험실 — 말뤼스 · 두 장 · 세 장(⅛I₀ sin²2α), LCD, BB84(도청 오류율 ${(rate * 100).toFixed(1)}%), 화면 연결`);
