// 양동비T 빛과 렌즈 실습: 렌즈 · 거울 상, 스크린 상맺힘, 작도 가이드 채점, 메뉴 연결(베타 스위치 · 딱지 없음).
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, f);
const lab = require('../lib/optics-lab.ts');
const { singleImage, screenView, guideSteps, checkStroke, snapPoint, telescopeState, microscopeState, microscopeBounds, prismState } = lab;
const close = (a, b, eps = 1e-6) => Math.abs(a - b) < eps;

// 렌즈 방정식 1/f = 1/a + 1/b, m = −b/a (원래 실험실과 같은 값)
let im = singleImage('convex-lens', 12, 30, 8);
assert.ok(close(im.b, 20) && close(im.m, -2 / 3) && im.real && !im.upright && close(im.x, 20) && close(im.y, -16 / 3));
im = singleImage('convex-lens', 12, 24, 8); assert.ok(close(im.b, 24) && close(im.m, -1)); // 2F → 같은 크기
im = singleImage('convex-lens', 12, 6, 8); assert.ok(close(im.b, -12) && !im.real && im.upright && im.enlarged && close(im.x, -12));
assert.ok(singleImage('convex-lens', 12, 12, 8).infinite);
im = singleImage('concave-lens', 12, 28, 8); assert.ok(!im.real && im.upright && !im.enlarged && im.x < 0 && im.x > -12);
im = singleImage('concave-mirror', 12, 32, 8); assert.ok(im.real && !im.upright && close(im.x, -im.b) && im.x < 0);
im = singleImage('concave-mirror', 12, 6, 8); assert.ok(!im.real && im.upright && im.x > 0);
im = singleImage('convex-mirror', 12, 30, 8); assert.ok(!im.real && im.upright && !im.enlarged && im.x > 0 && im.x < 12);
for (const kind of ['convex-lens', 'concave-lens', 'concave-mirror', 'convex-mirror']) for (let d = 4; d <= 42; d += 0.5) {
  const s = singleImage(kind, 12, d, 8);
  if (s.infinite) continue;
  assert.ok(close(1 / s.f, 1 / s.d + 1 / s.b, 1e-9), `${kind} ${d}`);
  if (kind.startsWith('concave-lens') || kind === 'convex-mirror') assert.ok(!s.real && s.upright && !s.enlarged, `${kind} ${d} always small upright virtual`);
}

// 스크린: 상 거리에서 또렷, 앞뒤로 흐려지고 어느 쪽으로 옮길지 알려 준다. 허상은 맺히지 않는다.
im = singleImage('convex-lens', 12, 30, 8);
let sc = screenView(im, 20); assert.ok(sc.formed && sc.sharp && close(sc.blur, 0) && close(sc.size, im.y));
sc = screenView(im, 15); assert.ok(sc.formed && !sc.sharp && sc.move === 'away' && sc.blur > 1);
sc = screenView(im, 30); assert.ok(!sc.sharp && sc.move === 'closer');
assert.ok(screenView(im, 15).blur < screenView(im, 10).blur, '멀어질수록 더 흐리다');
assert.equal(screenView(singleImage('convex-lens', 12, 6, 8), 20).formed, false);
assert.equal(screenView(singleImage('convex-mirror', 12, 30, 8), 10).formed, false);
assert.equal(screenView(singleImage('convex-lens', 12, 12, 8), 20).formed, false);
assert.ok(screenView(singleImage('concave-mirror', 12, 32, 8), 19.2).sharp);

// 작도 가이드: 각 단계의 모범 선은 통과하고, 상의 끝은 광선(또는 연장선) 위에 있다(물리적으로 맞는 단계인지 확인).
const onLine = (p, a, b, eps = 1e-6) => Math.abs((b.x - a.x) * (a.y - p.y) - (a.x - p.x) * (b.y - a.y)) / Math.hypot(b.x - a.x, b.y - a.y) < eps;
let planned = 0;
for (const kind of ['convex-lens', 'concave-lens', 'concave-mirror', 'convex-mirror']) for (const f of [8, 12, 16]) for (let d = 4; d <= 42; d += 0.5) {
  const s = singleImage(kind, f, d, 8);
  const plan = guideSteps(kind, s);
  if (!plan.steps.length) { assert.ok(plan.note, `${kind} ${f} ${d} note`); continue; }
  planned += 1;
  const I = { x: s.x, y: s.y };
  assert.equal(plan.steps.at(-1).id, 'image');
  assert.equal(plan.steps.some(st => st.id === 'extension'), !s.real, `${kind} ${d} extension only for virtual`);
  for (const st of plan.steps) {
    assert.ok(checkStroke(st, st.ghost), `${kind} f${f} d${d} ${st.id} ghost passes`);
    assert.ok(checkStroke(st, [st.ghost[1], st.ghost[0]]), `${kind} ${st.id} either direction`);
    if (st.kind !== 'image' && st.id !== 'parallel' && st.id !== 'vertex-in') assert.ok(onLine(I, st.ghost[0], st.ghost[1], 1e-6), `${kind} f${f} d${d} ${st.id}: image tip on the ray line`);
  }
  // 상의 위치는 끝점이 붙는 점에 들어가지 않는다(답 노출 방지).
  assert.ok(!plan.snaps.some(p => close(p.x, I.x, 0.01) && close(p.y, I.y, 0.01)), `${kind} ${d} no snap on image`);
}
assert.ok(planned > 300, `planned ${planned}`);

// 틀린 선은 통과하지 않는다.
const conv = guideSteps('convex-lens', singleImage('convex-lens', 12, 30, 8)).steps;
const [parallel, focus, center, image] = conv;
assert.equal(checkStroke(parallel, [{ x: -30, y: 8 }, { x: 0, y: 0 }]), false, '광축과 나란하지 않으면 틀림');
assert.equal(checkStroke(focus, [{ x: 0, y: 8 }, { x: 40, y: 8 }]), false, '굴절 후 그대로 직진하면 틀림');
assert.equal(checkStroke(focus, [{ x: 0, y: 8 }, { x: -30, y: 8 - 30 * 8 / 12 }]), false, '왼쪽으로 그리면 틀림');
assert.equal(checkStroke(center, [{ x: -30, y: 8 }, { x: 0, y: 8 }]), false, '중심을 안 지나면 틀림');
assert.equal(checkStroke(image, [{ x: 12, y: 0 }, { x: 12, y: -5.3 }]), false, '초점에 그린 상은 틀림');
assert.equal(checkStroke(image, [{ x: 20, y: 0 }, { x: 20.8, y: -5 }]), true, '손으로 그린 약간의 오차는 괜찮다');
assert.equal(checkStroke(parallel, [{ x: -30, y: 8 }, { x: -29.5, y: 8 }]), false, '너무 짧은 선');
// 끝점 붙이기: 가까운 기준점으로 붙고, 멀면 그대로
const plan0 = guideSteps('convex-lens', singleImage('convex-lens', 12, 30, 8));
assert.deepEqual(snapPoint({ x: 11.2, y: 0.9 }, plan0.snaps), { x: 12, y: 0 });
assert.deepEqual(snapPoint({ x: 5, y: 5 }, plan0.snaps), { x: 5, y: 5 });
// 상이 판 밖이면 안내만
assert.ok(guideSteps('convex-lens', singleImage('convex-lens', 12, 13, 8)).note);

// 망원경 · 현미경 · 프리즘
const tel = telescopeState({ fo: 20, fe: 6, angle: 6, distant: true, objectDistance: 50, gap: 4 });
assert.ok(close(tel.sep, 26) && close(tel.angularMag, -20 / 6));
const near = telescopeState({ fo: 20, fe: 6, angle: 6, distant: false, objectDistance: 50, gap: 4 });
assert.ok(close(near.di1, 100 / 3) && near.di2 < 0 && near.totalM < 0);
const mic = microscopeState(5, 8, 6.2, 30);
assert.ok(mic.di1 > 0 && mic.m1 < 0 && mic.do2 < 8 && mic.di2 < 0 && mic.totalM < 0, '중간 상 도립 실상, 최종 상 도립 허상');
const bounds = microscopeBounds(5, 30); assert.ok(bounds.min > 5 && bounds.max >= 12);
assert.ok(close(prismState(1.52, 48).critical, Math.asin(1 / 1.52) * 180 / Math.PI) && prismState(1.52, 48).totalReflection && !prismState(1.52, 30).totalReflection);

// 메뉴: 과학 → 물리 · 화학 → 물리학Ⅱ → 양동비T. 실습 카드는 베타 스위치가 켜졌을 때만, '베타' 글자 없이.
const { finalMenu } = require('../data/final-subjects.ts');
const pc = finalMenu.children.find(n => n.id === 'science').children.find(n => n.id === 'physics-chemistry');
const physics = pc.children.find(n => n.id === 'physics-final-group');
assert.equal(physics.direction, 'left');
const yang = physics.children.find(n => n.id === 'physics-yang-final');
assert.ok(yang && yang.name === '양동비T' && yang.lab === 'optics');
const study = fs.readFileSync('components/swipe/SubjectStudy.tsx', 'utf8');
assert.ok(/deck\.lab === 'optics' && beta/.test(study), '실습은 베타 스위치 뒤에');
const component = fs.readFileSync('components/swipe/OpticsLab.tsx', 'utf8');
assert.ok(!/베타|beta/i.test(component), '실습 화면에 베타 딱지 없음');
assert.ok(!/cdn-cgi|challenge-platform|modelContext|registerTool|clipboard/.test(component + fs.readFileSync('lib/optics-lab.ts', 'utf8')), '원본의 추적 스크립트 · WebMCP · 복사 기능은 뗐다');
assert.ok(!/from '\.\.\/\.\.\/data\//.test(component), '실습 화면은 카드 묶음을 불러오지 않는다');

console.log(`PASS: 빛과 렌즈 실습 — 렌즈·거울 상, 스크린 상맺힘, 작도 가이드 ${planned}가지 배치 채점 확인, 망원경·현미경·프리즘, 베타 스위치(딱지 없음)`);
