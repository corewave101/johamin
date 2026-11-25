'use strict';
/* ═════════ 6.5 · 3D 마을 · 성주탑 걷기 · 훈련소 건물 ═════════
   사용자: "마을도 3D 가능? 카메라를 RTS로 해서 거기서도 조이스틱으로 움직이게 / 마을 가면 성주탑을 거기서 들어가게 하고,
            성주탑 들어가서도 조이스틱으로 움직일 수 있게 / 훈련소 쫄병 모집 버튼을 위로(안 가리게), 옆에 훈련은 건물로"
   · 마을(G.mode 'town'): 지도의 회관 · 마을 칸을 누르면 들어온다. 위에서 비스듬히 내려다보는 카메라가 주인공을 따라가고,
     조이스틱(WASD)으로 걷는다. 건물을 누르거나 앞에 가면 표지판 → 지도에서 쓰던 회관 · 칸 카드(siteHtml)가 그대로 뜬다.
     마을 북쪽 끝 성주탑 문으로 들어가면 성주관(keep), 성주관 문으로 나오면 다시 마을.
   · 성주관(keep): 주인공이 조이스틱으로 걷고 카메라가 뒤에서 따라간다. 게시판 · 거울 · 왕좌 · 문 앞에 가면 표지판.
   · 훈련소: 병영 · 훈련장 건물을 울타리 뒤에 세우고 모집 · 훈련 표지판을 지붕 위로 (병영에 선 쫄병을 안 가리게).
   이 파일은 town.js 다음, 맨 마지막에 불러온다. */

/* ═════════ 공통: 조이스틱으로 걷기 ═════════ */
const ROAM = ['town', 'keep'];
let roamPtr = null;
stage.addEventListener('pointerdown', ev => {
  if (!ROAM.includes(G.mode) || ev.target !== canvas) return;
  ev.stopPropagation(); try { canvas.setPointerCapture(ev.pointerId); } catch(e){}
  if (G.settings.stick === 'float' && floatPid == null && inStickZone(ev)){
    floatPid = ev.pointerId; const r = stage.getBoundingClientRect(), px = STICK_PX[G.settings.size] || 132, st = $('stick');
    floatC = {x:ev.clientX, y:ev.clientY, R:px/2 - 14};
    st.style.left = `${ev.clientX - r.left - px/2}px`; st.style.top = `${ev.clientY - r.top - px/2}px`; st.style.right = 'auto'; st.style.bottom = 'auto';
    st.hidden = false; $('stickKnob').style.transform = ''; return;
  }
  roamPtr = {id:ev.pointerId, x:ev.clientX, y:ev.clientY};
}, true);
stage.addEventListener('pointermove', ev => {
  if (!ROAM.includes(G.mode) || ev.target !== canvas) return;
  ev.stopPropagation(); if (ev.pointerId === floatPid) stickVec(floatC.x, floatC.y, floatC.R, ev);
}, true);
for (const t of ['pointerup', 'pointercancel']) stage.addEventListener(t, ev => {
  if (!ROAM.includes(G.mode) || ev.target !== canvas) return;
  ev.stopPropagation();
  if (ev.pointerId === floatPid){ floatEnd(); return; }
  const P = roamPtr; roamPtr = null;
  if (t === 'pointerup' && P && P.id === ev.pointerId && Math.hypot(ev.clientX - P.x, ev.clientY - P.y) < 9){ if (G.mode === 'keep') kTap(ev); else nTap(ev); }
}, true);

/* 걷기 한 걸음: 막대 입력 → 위치 · 방향 · 다리 */
function roamStep(hero, dt, time, speed, solve){
  const [mx, mz] = moveInput(), ml = Math.hypot(mx, mz), walk = ml > .08;
  if (walk){
    const sp = speed*heroSpeed()*Math.min(1, ml);
    const p = solve(hero.position.x + mx/ml*sp*dt, hero.position.z + mz/ml*sp*dt);
    hero.position.x = p[0]; hero.position.z = p[1];
    let df = Math.atan2(-mx, -mz) - hero.rotation.y; df = Math.atan2(Math.sin(df), Math.cos(df)); hero.rotation.y += df*Math.min(1, dt*12);
  }
  const legs = hero.userData.legs; if (legs){ const sw = walk ? Math.sin(time*13)*.12 : 0; legs[0].position.z = sw; legs[1].position.z = -sw; }
  return walk;
}
/* 상자 장애물에서 밀어내기 (원 반지름 r) */
function pushOut(x, z, r, obs){
  for (const o of obs){
    if (o.r != null){ const dx = x - o.x, dz = z - o.z, d = Math.hypot(dx, dz), R = o.r + r; if (d < R && d > 1e-6){ x = o.x + dx/d*R; z = o.z + dz/d*R; } continue; }
    const cx = clamp(x, o.x - o.hw, o.x + o.hw), cz = clamp(z, o.z - o.hd, o.z + o.hd), dx = x - cx, dz = z - cz, d = Math.hypot(dx, dz);
    if (d < r){
      if (d > 1e-6){ x = cx + dx/d*r; z = cz + dz/d*r; }
      else { const L = x - (o.x - o.hw), Rr = o.x + o.hw - x, U = z - (o.z - o.hd), D = o.z + o.hd - z, m = Math.min(L, Rr, U, D);
        if (m === L) x = o.x - o.hw - r; else if (m === Rr) x = o.x + o.hw + r; else if (m === U) z = o.z - o.hd - r; else z = o.z + o.hd + r; }
    }
  }
  return [x, z];
}
const boxDist = (x, z, o) => o.r != null ? Math.max(0, Math.hypot(x - o.x, z - o.z) - o.r) : Math.hypot(x - clamp(x, o.x - o.hw, o.x + o.hw), z - clamp(z, o.z - o.hd, o.z + o.hd));

/* ═════════ 마을 ═════════ */
const nScene = new THREE.Scene(), nHero = new THREE.Group(), nDyn = new THREE.Group(), nFolk = new THREE.Group();
const N = {built:false, sig:'', picks:[], obs:[], fixedObs:[], near:null, folk:[], boardTex:null, boardCtx:null, mill:null};
const NPLOT = i => ({x:-24 + (i % 5)*12, z:i < 5 ? 0 : 14});
const N_HALL = {x:-13, z:-14, hw:3.7, hd:2.7}, N_KEEP = {x:0, z:-26, r:4.4}, N_DOOR = {x:0, z:-20.6};
const N_BOUND = {x0:-35, x1:35, z0:-21.5, z1:23};
const ROAD_Z = [-7, 7], GAP_X = [-30, -18, -6, 6, 18, 30];

function nBuild(){
  if (N.built) return; N.built = true;
  nScene.background = skyTex('#5d9bd6', '#a9c6e2', '#e6eef4');
  nScene.add(new THREE.HemisphereLight(0xfff1d6, 0x3a2e1c, .95));
  const sun = new THREE.DirectionalLight(0xfff4e0, .8); sun.position.set(-14, 30, 18); nScene.add(sun);
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 110), std(0xa8cf8e, {map:grassTex, roughness:.95})); ground.rotation.x = -Math.PI/2; nScene.add(ground);
  const road = (w, d, x, z) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), std(0xd8c4a0, {map:dirtTex, roughness:1})); m.rotation.x = -Math.PI/2; m.position.set(x, .02, z); nScene.add(m); };
  for (const z of ROAD_Z) road(70, 3.6, 0, z);
  road(3.6, 15, 0, -14.2);   // 성주탑 → 북쪽 길
  for (const x of [-32, 32]) road(3.6, 30, x, 7);
  road(70, 3.6, 0, 21.5);
  /* 성벽 · 성주탑 (북쪽) */
  const stoneM = std(0xc9c2b4, {map:brickTex(6, 2), roughness:.9}), roofM = std(0xb4553a, {roughness:.7, flatShading:true});
  for (const sx of [-1, 1]){ const w = new THREE.Mesh(new THREE.BoxGeometry(40, 7, 2.4), stoneM); w.position.set(sx*24.5, 3.5, -28); nScene.add(w);
    for (let x = 5.5; x < 44; x += 2.4){ const c = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.1, 2.4), stoneM); c.position.set(sx*x, 7.55, -28); nScene.add(c); } }
  const keep = new THREE.Group(); keep.position.set(N_KEEP.x, 0, N_KEEP.z);
  const tower = new THREE.Mesh(new THREE.CylinderGeometry(3.8, 4.2, 13, 20), std(0xd2cabb, {map:brickTex(5, 3), roughness:.9})); tower.position.y = 6.5; keep.add(tower);
  for (let i = 0; i < 12; i++){ const a = i/12*Math.PI*2, c = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.1, .8), stoneM); c.position.set(Math.sin(a)*3.75, 13.5, Math.cos(a)*3.75); c.rotation.y = a; keep.add(c); }
  const cone = new THREE.Mesh(new THREE.ConeGeometry(4.3, 5.2, 20), roofM); cone.position.y = 16.6; keep.add(cone);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.06, .06, 2.4, 6), std(0xdddddd, {metalness:.6})); pole.position.y = 20.2; keep.add(pole);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 1), new THREE.MeshStandardMaterial({color:0xff8a3d, side:THREE.DoubleSide})); flag.position.set(.82, 20.8, 0); keep.add(flag); N.flag = flag;
  const door = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.4, .3), std(0x5a3219, {roughness:.8})); door.position.set(0, 1.7, 4.05); keep.add(door);
  const arch = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, .32, 16, 1, false, -Math.PI/2, Math.PI), std(0x5a3219)); arch.rotation.x = Math.PI/2; arch.rotation.y = Math.PI/2; arch.position.set(0, 3.4, 4.05); keep.add(arch);
  for (const sx of [-1.7, 1.7]){ const tl = new THREE.Mesh(new THREE.ConeGeometry(.14, .4, 8), new THREE.MeshBasicMaterial({color:0xffb347})); tl.position.set(sx, 3.4, 4.3); keep.add(tl); }
  keep.traverse(o => { if (o.isMesh) o.userData.tk = 'keep'; }); keep.userData.tk = 'keep'; nScene.add(keep); N.picks.push(keep);
  const kl = label(['성주탑', '들어가면 성주관'], {size:22, bold:true, h:.034, color:'#fff3df', sub:'#ffd9a8', bg:'rgba(30,18,10,.55)'}); kl.position.set(-6.2, .4, -21.2); nScene.add(kl);
  /* 마을 회관 */
  const hall = new THREE.Group(); hall.position.set(N_HALL.x, 0, N_HALL.z);
  const hb = new THREE.Mesh(new THREE.BoxGeometry(7, 4, 5), std(0xe9d6ad, {roughness:.85})); hb.position.y = 2; hall.add(hb);
  const hr = new THREE.Mesh(new THREE.CylinderGeometry(3.1, 3.1, 7.6, 3), roofM); hr.rotation.z = Math.PI/2; hr.rotation.x = Math.PI/2; hr.scale.set(1, 1, .62); hr.position.y = 4 + 1.0; hall.add(hr);
  const hd = new THREE.Mesh(new THREE.BoxGeometry(1.4, 2.2, .1), std(0x6b4a2a)); hd.position.set(0, 1.1, 2.52); hall.add(hd);
  for (const sx of [-2.4, 2.4]){ const w = new THREE.Mesh(new THREE.BoxGeometry(1.1, .9, .08), new THREE.MeshStandardMaterial({color:0xfff3c4, emissive:0xffd27a, emissiveIntensity:.3})); w.position.set(sx, 2.1, 2.52); hall.add(w); }
  const clk = new THREE.Mesh(new THREE.CircleGeometry(.55, 24), basic(0xf8f1df)); clk.position.set(0, 4.6, 2.56); hall.add(clk);
  hall.traverse(o => { if (o.isMesh) o.userData.tk = 'hall'; }); hall.userData.tk = 'hall'; nScene.add(hall); N.picks.push(hall);
  N.hallLabel = new THREE.Group(); nScene.add(N.hallLabel);
  /* 풍차 (동쪽 빈터) */
  const mill = new THREE.Group(); mill.position.set(14, 0, -15);
  const mt = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.9, 6.5, 10), std(0xe8dcc4, {flatShading:true})); mt.position.y = 3.25; mill.add(mt);
  const mc = new THREE.Mesh(new THREE.ConeGeometry(1.6, 1.8, 10), roofM); mc.position.y = 7.4; mill.add(mc);
  const hub = new THREE.Group(); hub.position.set(0, 6.1, 1.5); mill.add(hub);
  for (let i = 0; i < 4; i++){ const b = new THREE.Mesh(new THREE.BoxGeometry(.5, 4.2, .06), std(0xf4efe2)); b.position.y = 2.1; const arm = new THREE.Group(); arm.rotation.z = i*Math.PI/2; arm.add(b); hub.add(arm); }
  nScene.add(mill); N.mill = hub; N.fixedObs.push({x:14, z:-15, r:1.9});
  /* 나무 */
  const trees = []; for (let i = 0; i < 60; i++){ const side = srand() < .5 ? -1 : 1; trees.push([side*(39 + srand()*16), -26 + srand()*56, .9 + srand()*.6]); }
  for (let i = 0; i < 26; i++) trees.push([-36 + srand()*72, 26.5 + srand()*12, .9 + srand()*.5]);
  addTrees(nScene, trees);
  N.fixedObs.push({x:N_KEEP.x, z:N_KEEP.z, r:N_KEEP.r}, {x:N_HALL.x, z:N_HALL.z, hw:N_HALL.hw, hd:N_HALL.hd});
  N.ring = new THREE.Mesh(new THREE.RingGeometry(.9, 1.15, 32), new THREE.MeshBasicMaterial({color:0xff8a3d, transparent:true, opacity:.8, depthWrite:false})); N.ring.rotation.x = -Math.PI/2; N.ring.position.y = .06; nScene.add(N.ring);
  nScene.add(nDyn, nFolk, nHero);
}

/* ── 건물 모양 (칸마다) ── */
function nBuilding(p, i){
  const g = new THREE.Group(), P = NPLOT(i), obs = [], o = (x, z, hw, hd) => obs.push({x:P.x + x, z:P.z + z, hw, hd}), oc = (x, z, r) => obs.push({x:P.x + x, z:P.z + z, r});
  g.position.set(P.x, 0, P.z);
  const pad = new THREE.Mesh(new THREE.PlaneGeometry(9, 9), std(p ? 0xcdb48a : 0xb8a886, {map:dirtTex, roughness:1, transparent:!p, opacity:p ? 1 : .7})); pad.rotation.x = -Math.PI/2; pad.position.y = .03; g.add(pad);
  const roof = c => std(c, {roughness:.7, flatShading:true}), wall = c => std(c, {roughness:.85}), glow = () => new THREE.MeshStandardMaterial({color:0xfff3c4, emissive:0xffd27a, emissiveIntensity:.3});
  const add = (geo, mat, x, y, z, f) => { const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); if (f) f(m); g.add(m); return m; };
  const pyramid = (w, h, d, y, c, x = 0, z = 0) => add(new THREE.ConeGeometry(Math.SQRT1_2*Math.max(w, d)*1.08, h, 4), roof(c), x, y + h/2, z, m => { m.rotation.y = Math.PI/4; m.scale.z = d/Math.max(w, d); m.scale.x = w/Math.max(w, d); });
  if (!p){
    for (const [x, z] of [[-4, -4], [4, -4], [-4, 4], [4, 4]]) add(new THREE.CylinderGeometry(.09, .09, .9, 6), wall(0x7a5a3a), x, .45, z);
    add(new THREE.BoxGeometry(1.4, .9, .1), wall(0xe9d6ad), 0, 1.2, 0); add(new THREE.CylinderGeometry(.06, .06, 1.2, 6), wall(0x7a5a3a), 0, .6, -.08);
  } else if (p.b === 'house'){
    const h = p.lv === 1 ? 2.6 : 4.2, w = p.lv === 3 ? 4.6 : 4, d = 3.6;
    add(new THREE.BoxGeometry(w, h, d), wall(0xead7b0), 0, h/2, -.8); pyramid(w + .5, 2, d + .5, h, 0xb4553a, 0, -.8);
    add(new THREE.BoxGeometry(.8, 1.4, .06), wall(0x6b4a2a), 0, .7, -.8 + d/2 + .03);
    for (const fl of p.lv === 1 ? [1.6] : [1.6, 3.2]) for (const sx of [-1.25, 1.25]) add(new THREE.BoxGeometry(.7, .6, .06), glow(), sx, fl, -.8 + d/2 + .03);
    o(0, -.8, w/2 + .1, d/2 + .1);
    if (p.lv === 3){ add(new THREE.BoxGeometry(2.6, 2.4, 2.6), wall(0xe2cba0), 3.1, 1.2, 1.8); pyramid(3, 1.4, 3, 2.4, 0x9c4a33, 3.1, 1.8); o(3.1, 1.8, 1.4, 1.4);
      add(new THREE.BoxGeometry(.5, 1.4, .5), wall(0x8a7a6a), -1.3, h + 1.2, -1.6); }
  } else if (p.b === 'farm'){
    const crop = p.lv > 1 ? 0xd9b84a : 0x6faa4a;
    add(new THREE.PlaneGeometry(8, 4.8), wall(0x7a5a3a), 0, .04, 1.6, m => { m.rotation.x = -Math.PI/2; });
    for (let r = 0; r < 6; r++) add(new THREE.BoxGeometry(7.4, .45, .42), std(crop, {roughness:.9, flatShading:true}), 0, .24, -.3 + r*.78);
    add(new THREE.BoxGeometry(2.8, 2.2, 2.2), wall(0xb13b2e), -2.4, 1.1, -3); pyramid(3.1, 1.2, 2.5, 2.2, 0x6b3a22, -2.4, -3);
    add(new THREE.BoxGeometry(1.1, 1.4, .06), wall(0xf4efe2), -2.4, .7, -1.87);
    o(-2.4, -3, 1.5, 1.2);
    if (p.lv > 1){ add(new THREE.CylinderGeometry(.8, .8, 3.4, 12), wall(0xc9c2b4), 2.6, 1.7, -3); add(new THREE.SphereGeometry(.8, 12, 8, 0, Math.PI*2, 0, Math.PI/2), roof(0x9aa3b2), 2.6, 3.4, -3); oc(2.6, -3, .9); }
  } else if (p.b === 'mine'){
    add(new THREE.DodecahedronGeometry(3, 0), std(0x86817a, {flatShading:true, roughness:.95}), 0, .6, -1.8, m => { m.scale.set(1.15, .7, .9); });
    add(new THREE.BoxGeometry(1.6, 1.8, .5), basic(0x1b1410), 0, .9, .6);
    for (const sx of [-.95, .95]) add(new THREE.BoxGeometry(.22, 2.1, .22), wall(0x6b4a2a), sx, 1.05, .9);
    add(new THREE.BoxGeometry(2.2, .24, .26), wall(0x6b4a2a), 0, 2.1, .9);
    for (const sx of [-.35, .35]) add(new THREE.BoxGeometry(.08, .06, 3.4), std(0x8a8f98, {metalness:.7}), sx, .06, 2.6);
    add(new THREE.BoxGeometry(.9, .6, 1.2), std(0x5d4a3a), 0, .45, 3.4); add(new THREE.DodecahedronGeometry(.32, 0), std(0xd9a43a, {metalness:.6, flatShading:true}), 0, .85, 3.4);
    oc(0, -1.8, 3.1);
    if (p.lv > 1){ for (const [x, z] of [[2.6, 1.6], [3.8, 1.6], [2.6, 2.8], [3.8, 2.8]]) add(new THREE.BoxGeometry(.16, 4, .16), wall(0x6b4a2a), x, 2, z);
      add(new THREE.TorusGeometry(.6, .1, 8, 20), std(0x8a8f98, {metalness:.7}), 3.2, 4.2, 2.2); o(3.2, 2.2, .8, .8); }
  } else if (p.b === 'well'){
    const R = p.lv > 1 ? 2.2 : 1.2;
    add(new THREE.CylinderGeometry(R, R + .1, .9, 20), std(0xb9b1a2, {map:brickTex(3, 1), roughness:.9}), 0, .45, 0);
    add(new THREE.CircleGeometry(R - .15, 20), std(0x5aa7d6, {roughness:.2, metalness:.2}), 0, .86, 0, m => { m.rotation.x = -Math.PI/2; });
    if (p.lv > 1){ add(new THREE.CylinderGeometry(.3, .4, 1.8, 10), std(0xb9b1a2), 0, 1.3, 0); add(new THREE.ConeGeometry(.5, 1, 12), new THREE.MeshStandardMaterial({color:0xbfe6ff, transparent:true, opacity:.6}), 0, 2.6, 0); }
    else { for (const sx of [-1, 1]) add(new THREE.BoxGeometry(.16, 2.2, .16), wall(0x6b4a2a), sx*1.05, 1.1, 0); add(new THREE.ConeGeometry(1.6, .9, 4), roof(0xb4553a), 0, 2.6, 0, m => { m.rotation.y = Math.PI/4; }); }
    oc(0, 0, R + .1);
  } else if (p.b === 'clinic'){
    add(new THREE.BoxGeometry(5, 3.2, 3.8), wall(0xf2f0ea), 0, 1.6, -1); add(new THREE.BoxGeometry(5.4, .3, 4.2), wall(0x9aa3b2), 0, 3.35, -1);
    add(new THREE.BoxGeometry(1.2, .34, .08), basic(0xd03a3a), 0, 2.35, .94); add(new THREE.BoxGeometry(.34, 1.2, .08), basic(0xd03a3a), 0, 2.35, .94);
    add(new THREE.BoxGeometry(1, 1.6, .06), wall(0x6b8aa8), 0, .8, .93);
    o(0, -1, 2.6, 2);
    if (p.lv > 1){ add(new THREE.SphereGeometry(1.3, 16, 10, 0, Math.PI*2, 0, Math.PI/2), std(0xc8d4e0, {metalness:.5, roughness:.3}), 0, 3.5, -1.2); add(new THREE.CylinderGeometry(.05, .05, 1.4, 6), std(0xdddddd), 0, 5.4, -1.2); }
  } else if (p.b === 'board'){
    for (const sx of [-2.8, 2.8]) add(new THREE.BoxGeometry(.26, 4.8, .26), std(0x4a4f5c, {metalness:.5}), sx, 2.4, -1);
    add(new THREE.BoxGeometry(6.2, 3.5, .3), std(0x23262e, {metalness:.4}), 0, 3.3, -1);
    if (!N.boardCtx){ const c = document.createElement('canvas'); c.width = 512; c.height = 280; N.boardCtx = c.getContext('2d'); N.boardTex = new THREE.CanvasTexture(c); }
    add(new THREE.PlaneGeometry(5.8, 3.1), new THREE.MeshBasicMaterial({map:N.boardTex}), 0, 3.3, -.84);
    nDrawBoard(p); o(0, -1, 3.1, .3);
  } else if (p.b === 'market'){
    const stripes = (c) => canvasTex(128, 64, (x, w, h) => { for (let k = 0; k < 8; k++){ x.fillStyle = k % 2 ? '#fff4e0' : c; x.fillRect(k*w/8, 0, w/8, h); } });
    [[-2.8, -1.4, '#c8453a'], [0, -2.2, '#3a7bc8'], [2.8, -1.4, '#3f9a5a']].forEach(([x, z, c]) => {
      add(new THREE.BoxGeometry(2.2, .9, 1.2), wall(0x8a6a48), x, .45, z);
      for (const [dx, dz] of [[-1, -.6], [1, -.6], [-1, .6], [1, .6]]) add(new THREE.CylinderGeometry(.05, .05, 2.2, 6), wall(0x6b4a2a), x + dx, 1.1, z + dz);
      add(new THREE.PlaneGeometry(2.4, 1.6), std(0xffffff, {map:stripes(c), side:THREE.DoubleSide}), x, 2.25, z, m => { m.rotation.x = -Math.PI/2 + .35; });
      add(new THREE.BoxGeometry(.5, .4, .5), std(0xe0a040), x - .5, 1.1, z); add(new THREE.SphereGeometry(.22, 10, 8), std(0xd45050), x + .5, 1.12, z);
      o(x, z, 1.15, .65);
    });
    add(new THREE.BoxGeometry(.8, .8, .8), wall(0x9a7a54), 3.4, .4, 2.4); add(new THREE.BoxGeometry(.7, .7, .7), wall(0x8a6a48), 2.6, .35, 2.8);
  }
  g.traverse(m => { if (m.isMesh) m.userData.tk = `plot${i}`; }); g.userData.tk = `plot${i}`;
  const B = p && TB[p.b], lab = label(p ? [`${i + 1} · ${B.name}${p.lv > 1 ? ` ${p.lv}단계` : ''}`, B.jobs ? `일꾼 ${p.w}/${B.jobs}` : B.desc.split(' · ')[0]] : [`${i + 1} · 빈 땅`, '눌러서 짓기'], {size:20, bold:true, h:.03, color:'#fff6e6', sub:'#ffe0b0', bg:'rgba(30,18,10,.55)'});
  lab.position.set(0, .35, 4.2); g.add(lab);
  return {g, obs};
}
function nDrawBoard(p){
  const x = N.boardCtx, w = 512, h = 280; if (!x) return;
  const t = T(), on = t.disp.day === G.wave, oled = isOled(p);
  x.fillStyle = oled ? '#000' : '#10161c'; x.fillRect(0, 0, w, h);
  if (!on){ x.fillStyle = oled ? '#333' : '#2a3a44'; x.font = '700 40px "IBM Plex Sans KR", sans-serif'; x.textAlign = 'center'; x.fillText(oled ? 'OLED · 의뢰 대기' : 'LCD · 의뢰 대기', w/2, h/2 + 14); }
  else {
    const c = (r, g, b) => oled ? `rgb(${r},${g},${b})` : `rgb(${(r*.75 + 30)|0},${(g*.75 + 34)|0},${(b*.75 + 40)|0})`;
    x.fillStyle = c(40, 160, 70); x.fillRect(14, 14, w - 28, h - 28);
    x.fillStyle = c(255, 255, 255); x.font = '700 34px "JetBrains Mono", monospace'; x.textAlign = 'center';
    x.fillText('HOME  3 : 2  AWAY', w/2, 92); x.font = '500 26px "JetBrains Mono", monospace'; x.fillText('7th ▲  B 2  S 1  O 2', w/2, 150);
    x.fillStyle = c(255, 210, 70); x.fillText(`정확도 ${Math.round(t.disp.acc*100)}%`, w/2, 214);
  }
  N.boardTex.needsUpdate = true;
}
/* ── 시민: 길 위를 걸어 다닌다 (아픈 사람은 초록빛 · 느리게) ── */
function nFolkBuild(){
  clearGroup(nFolk); N.folk = [];
  const t = T(), n = Math.min(t.pop, 22), sick = Math.min(n, sickN()), cols = [0x3a7bc8, 0xc8453a, 0xe0a040, 0x7a5ab8, 0x3f9a5a, 0xd06a9a, 0x5a6a7a];
  for (let k = 0; k < n; k++){
    const m = new THREE.Group(), ill = k < sick;
    const body = new THREE.Mesh(new THREE.CylinderGeometry(.24, .32, .9, 8), std(ill ? 0x8fbf6a : cols[k % cols.length])); body.position.y = .55; m.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(.22, 10, 8), std(ill ? 0xb9d9a0 : 0xf2c9a0)); head.position.y = 1.2; m.add(head);
    m.scale.setScalar(1.25);
    const r = ROAD_Z[k % 2], x = -28 + srand()*56; m.position.set(x, 0, r + (srand() - .5)*1.6);
    nFolk.add(m); N.folk.push({m, road:r, path:[], wait:srand()*3, sp:(ill ? .7 : 1.4) + srand()*.5});
  }
}
function nFolkStep(dt, time){
  for (const f of N.folk){
    if (f.wait > 0){ f.wait -= dt; continue; }
    if (!f.path.length){
      const r2 = ROAD_Z[(Math.random()*2)|0], x2 = -30 + Math.random()*60, z2 = r2 + (Math.random() - .5)*1.6, x = f.m.position.x;
      if (r2 === f.road) f.path = [[x2, z2]];
      else { const gx = GAP_X.reduce((a, b) => Math.abs(b - x) < Math.abs(a - x) ? b : a); f.path = [[gx, f.road], [gx, r2], [x2, z2]]; }
      f.road = r2;
    }
    const [tx, tz] = f.path[0], dx = tx - f.m.position.x, dz = tz - f.m.position.z, d = Math.hypot(dx, dz);
    if (d < .15){ f.path.shift(); if (!f.path.length) f.wait = 1 + Math.random()*3; continue; }
    const s = Math.min(d, f.sp*dt); f.m.position.x += dx/d*s; f.m.position.z += dz/d*s; f.m.rotation.y = Math.atan2(dx, dz);
    f.m.position.y = Math.abs(Math.sin(time*9 + f.sp*7))*.07;
  }
}
/* 칸 · 인구 · 역병이 바뀌면 다시 짓는다 */
function nSync(force){
  const t = T(), sig = JSON.stringify([t.plots, t.pop, sickN(), t.disp.day === G.wave, t.disp.acc]);
  if (!force && sig === N.sig) return; const folkSig = `${t.pop}|${sickN()}`, refolk = force || !N.sig || N.folkSig !== folkSig; N.sig = sig; N.folkSig = folkSig;
  clearGroup(nDyn); N.picks = N.picks.filter(q => q.userData.tk === 'keep' || q.userData.tk === 'hall'); N.obs = N.fixedObs.slice();
  t.plots.forEach((p, i) => { const b = nBuilding(p, i); nDyn.add(b.g); N.picks.push(b.g); N.obs.push(...b.obs); });
  clearGroup(N.hallLabel);
  const hl = label(['마을 회관', `👥 ${t.pop}/${cap()} · 😊 ${t.happy} · 🌾 ${t.food}${t.plague ? ' · 🦠 역병' : ''}`], {size:22, bold:true, h:.032, color:'#fff6e6', sub:t.plague ? '#ffb0a0' : '#ffe0b0', bg:'rgba(30,18,10,.6)'});
  hl.position.set(N_HALL.x - 4.6, .4, N_HALL.z + 3.4); N.hallLabel.add(hl);
  if (refolk) nFolkBuild();
}
/* 칸 · 회관 · 성주탑의 앞자리 (들어올 때 주인공이 서는 곳) */
function nFront(k){
  if (k === 'keep') return {x:N_DOOR.x, z:N_DOOR.z + 1.8};
  if (k === 'hall') return {x:N_HALL.x + 1.5, z:N_HALL.z + N_HALL.hd + 2.4};
  const P = NPLOT(+k.slice(4)); return {x:P.x, z:P.z + (P.z > 7 ? -5.6 : 5.6)};
}
/* 가장 가까운 건물 (발 앞 2.4 m 안) */
function nNearest(){
  const h = nHero.position; let best = null, bd = 2.4;
  const keepD = Math.hypot(h.x - N_DOOR.x, h.z - N_DOOR.z); if (keepD < 3.4) return 'keep';
  const hd = boxDist(h.x, h.z, N_HALL); if (hd < bd){ bd = hd; best = 'hall'; }
  T().plots.forEach((p, i) => { const P = NPLOT(i), d = boxDist(h.x, h.z, {x:P.x, z:P.z, hw:4.5, hd:4.5}); if (d < bd || (d === 0 && bd > 0)){ bd = d; best = `plot${i}`; } });
  return best;
}
function enterTown(k){
  if (mapStage() < 1){ hint('지도가 더 펼쳐지면 마을에 갈 수 있어요'); return; }
  nBuild(); clearGroup(nHero); buildHeroInto(nHero, lookOf()); nHero.scale.setScalar(2.1);
  const f = nFront(k || 'keep'); nHero.position.set(f.x, 0, f.z);
  nHero.rotation.y = !k || k === 'keep' || (/^plot/.test(k) && NPLOT(+k.slice(4)).z > 7) ? Math.PI : 0;   // 건물 쪽을 본다 (성주탑에서 나오면 남쪽)
  G.mode = 'town'; G.showSettings = false; UI.keepFrom = null; UI.site = k && k !== 'keep' ? k : null; N.near = null;
  nSync(true); renderAll();
  hint('성 아래 마을이에요 · 조이스틱(WASD)으로 걸어서 건물 앞에 가거나 건물을 눌러요');
}
function nTap(ev){
  setRay(ev); const h = ray.intersectObjects(N.picks, true)[0];
  let o = h && h.object; while (o && !o.userData.tk) o = o.parent;
  const k = o && o.userData.tk;
  if (k === 'keep'){ goKeepFromTown(); return; }
  if (k){ UI.site = UI.site === k ? null : k; renderAll(); return; }
  if (UI.site){ UI.site = null; renderAll(); }
}
function goKeepFromTown(){ UI.site = null; enterKeep(); UI.keepFrom = 'town'; renderAll(); }
window.townPanel = function(){
  if (!painted) return renderAll();
  nSync();
  const t = T(), k = N.near === UI.site ? null : N.near;
  if (k === 'keep') sign('nnear', () => V(N_DOOR.x, 5.6, N_DOOR.z - .6), sgB('data-tn="keep"', '🏰', '성주탑 들어가기', '명예의 전당 · 거울 · 왕좌', 'go'));
  else if (k === 'hall') sign('nnear', () => V(N_HALL.x, 7.2, N_HALL.z), sgB(`data-tn="open" data-k="hall" aria-pressed="${UI.site === 'hall'}"`, '🏛', '마을 회관', `👥 ${t.pop}/${cap()} · 😊 ${t.happy} · 🌾 ${t.food}`));
  else if (k){ const i = +k.slice(4), p = t.plots[i], P = NPLOT(i), B = p && TB[p.b];
    sign('nnear', () => V(P.x, p ? 6 : 2.6, P.z - 1), sgB(`data-tn="open" data-k="${k}" aria-pressed="${UI.site === k}"`, p ? B.ic : '🪧', p ? `${i + 1}번 · ${B.name}${p.lv > 1 ? ` ${p.lv}단계` : ''}` : `${i + 1}번 · 빈 땅`, p ? (B.jobs ? `일꾼 ${p.w}/${B.jobs} · 열기` : '열기') : '건물 짓기', p ? '' : 'go')); }
  if (UI.site && (UI.site === 'hall' || /^plot\d$/.test(UI.site))) paintPop('site', {fixed:'right'}, siteHtml(UI.site), false, {cls:`site site-${UI.site}`});
};
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-tn]'); if (!b || b.disabled) return;
  ev.stopPropagation();
  if (b.dataset.tn === 'keep') goKeepFromTown();
  else if (b.dataset.tn === 'open'){ UI.site = UI.site === b.dataset.k ? null : b.dataset.k; renderAll(); }
}, true);
/* 카드 ✕ · 지도로 · 마을로 */
document.addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b) return;
  if (b.dataset.pclose === 'site' && G.mode === 'town') UI.site = null;
  if (b.dataset.act === 'toMap' && (G.mode === 'town' || G.mode === 'keep')){ UI.site = null; UI.keepFrom = null; }
  if (b.dataset.act === 'toTown'){ ev.stopPropagation(); enterTown('keep'); }
}, true);
/* 지도의 회관 · 마을 칸을 누르면 3D 마을로 (그 건물 앞에서 카드를 연 채로) */
$('map').addEventListener('click', ev => {
  if (ev.defaultPrevented) return;
  const g = ev.target.closest('.mp'); if (!g) return; const k = g.dataset.go;
  if ((k === 'hall' || /^plot\d$/.test(k)) && mapStage() >= 1){ ev.stopPropagation(); ev.stopImmediatePropagation(); enterTown(k); }
}, true);

/* ═════════ 성주관: 조이스틱으로 걷기 ═════════ */
const K_OBS = [{x:0, z:-7.2, hw:3.6, hd:1.85}];
for (const z of [-4.5, 0, 4.5]) for (const sx of [-1, 1]) K_OBS.push({x:sx*6.3, z, r:.5});
const K = {near:null};
const _enterKeep65 = window.enterKeep;
window.enterKeep = function(){
  _enterKeep65(); kHero.position.set(0, 0, 5.4); kHero.rotation.y = 0; K.near = null; UI.keepFrom = null;
  hint('성주관이에요 · 조이스틱(WASD)으로 걸어서 게시판 · 거울 · 왕좌 앞에 가 보세요');
};
function kNearest(){
  const p = kHero.position;
  if (p.x < -6.4 && Math.abs(p.z + 2.4) < 3.2) return 'board';
  if (p.x > 6.4 && Math.abs(p.z + 2.4) < 3.2) return 'mirror';
  if (p.z < -4.4 && Math.abs(p.x) < 4.2) return 'throne';
  if (p.z > 6.6) return 'door';
  return null;
}
const _keepPanel65 = window.keepPanel;
window.keepPanel = function(){
  _keepPanel65();
  const k = K.near, back = UI.keepFrom === 'town';
  if (k === 'board') sign('knear', () => V(-8.2, 5.9, -2.4), sgB(`data-kact="board" aria-pressed="${UI.keepCard === 'board'}"`, '📜', '명예의 전당', '기록 보기'));
  else if (k === 'mirror') sign('knear', () => V(8.2, 5.6, -2.4), sgB('data-kact="mirror"', '🪞', '거울 · 꾸미기', '주인공 모습 바꾸기'));
  else if (k === 'throne') sign('knear', () => V(0, 6.2, -7.4), sgB('data-kact="throne"', '👑', '성주의 왕좌', '성을 지킨 기록은 왼쪽 게시판에'));
  else if (k === 'door') sign('knear', () => V(0, 3.4, 8.6), sgB(`data-act="${back ? 'toTown' : 'toMap'}"`, '🚪', back ? '마을로 나가기' : '지도로 나가기', back ? '성주탑 문 앞' : '', 'go'));
};

/* ── 매 프레임 (ui.js frame이 부른다) ── */
function roamTick(dt, time){
  if (G.mode === 'town'){
    roamStep(nHero, dt, time, 6.2, (x, z) => pushOut(clamp(x, N_BOUND.x0, N_BOUND.x1), clamp(z, N_BOUND.z0, N_BOUND.z1), .55, N.obs));
    N.ring.position.x = nHero.position.x; N.ring.position.z = nHero.position.z; N.ring.scale.setScalar(1 + .06*Math.sin(time*4));
    nFolkStep(dt, time); if (N.mill) N.mill.rotation.z += dt*.6; if (N.flag) N.flag.rotation.y = Math.sin(time*2)*.18;
    const near = nNearest(); if (near !== N.near){ N.near = near; renderAll(); }
  } else if (G.mode === 'keep'){
    roamStep(kHero, dt, time, 3.8, (x, z) => pushOut(clamp(x, -8.6, 8.6), clamp(z, -8, 8.9), .45, K_OBS));
    const near = kNearest(); if (near !== K.near){ K.near = near; renderAll(); }
  }
}
const _camGoal65 = window.camGoal;
window.camGoal = function(){
  if (G.mode === 'town'){
    const p = nHero.position, tall = camera.aspect < 1.1, dy = tall ? 40 : 30, dz = tall ? 19 : 16;
    // 오른쪽에 카드가 떠 있으면 주인공이 카드 왼쪽 빈자리 가운데에 오게 옆으로 민다
    const c = CARDS.get('site'); let sx = 0;
    if (c && !narrowUI()){ const ppm = stage.clientHeight/(2*Math.hypot(dy, dz)*Math.tan(rad(camera.fov/2))); sx = (c.el.offsetWidth + 24)/2/ppm; }
    goalPos.set(p.x + sx, dy, p.z + dz); goalLook.set(p.x + sx, 0, p.z - (tall ? .5 : 1)); return .1; }
  if (G.mode === 'keep'){ const p = kHero.position, tall = camera.aspect < 1.1; goalPos.set(p.x*.55, tall ? 7.5 : 5.4, Math.min(p.z + (tall ? 12 : 9.5), 15)); goalLook.set(p.x*.75, 2.1, p.z - 4); return .1; }
  return _camGoal65();
};

/* ═════════ 훈련소: 병영 · 훈련장 건물 (울타리 뒤) ═════════ */
const tBld = [], TB_HALL = {x:-11.4, z:-12}, TB_BARR = {x:11.4, z:-12};
(function(){
  const roofM = c => std(c, {roughness:.7, flatShading:true});
  const mk = (P, wallC, roofC, tag) => {
    const g = new THREE.Group(); g.position.set(P.x, 0, P.z);
    const b = new THREE.Mesh(new THREE.BoxGeometry(6.4, 3.2, 4), std(wallC, {roughness:.85})); b.position.y = 1.6; g.add(b);
    const r = new THREE.Mesh(new THREE.CylinderGeometry(2.6, 2.6, 7, 3), roofM(roofC)); r.rotation.z = Math.PI/2; r.rotation.x = Math.PI/2; r.scale.set(1, 1, .6); r.position.y = 3.2 + .85; g.add(r);
    const d = new THREE.Mesh(new THREE.BoxGeometry(1.2, 2, .08), std(0x5a3219)); d.position.set(0, 1, 2.02); g.add(d);
    for (const sx of [-2, 2]){ const w = new THREE.Mesh(new THREE.BoxGeometry(.9, .7, .06), new THREE.MeshStandardMaterial({color:0xfff3c4, emissive:0xffd27a, emissiveIntensity:.25})); w.position.set(sx, 1.8, 2.02); g.add(w); }
    g.traverse(o => { if (o.isMesh) o.userData.tb = tag; }); g.userData.tb = tag; tScene.add(g); tBld.push(g); return g;
  };
  const hall = mk(TB_HALL, 0x9a7650, 0x8e3b2a, 'train');
  // 훈련장 앞: 허수아비 · 과녁
  const wood = std(0x7a5a3a);
  const post = new THREE.Mesh(new THREE.CylinderGeometry(.1, .1, 2, 8), wood); post.position.set(-4.4, 1, 1.2); hall.add(post);
  const bar = new THREE.Mesh(new THREE.BoxGeometry(1.4, .12, .12), wood); bar.position.set(-4.4, 1.5, 1.2); hall.add(bar);
  const sack = new THREE.Mesh(new THREE.SphereGeometry(.36, 10, 8), std(0xd8c49a)); sack.position.set(-4.4, 2.1, 1.2); hall.add(sack);
  const tgtTex = canvasTex(128, 128, (x, w, h) => { ['#f4efe2', '#d03a3a', '#f4efe2', '#d03a3a', '#ffd166'].forEach((c, i) => { x.fillStyle = c; x.beginPath(); x.arc(w/2, h/2, w/2 - i*12, 0, Math.PI*2); x.fill(); }); });
  const tgt = new THREE.Mesh(new THREE.CylinderGeometry(.8, .8, .14, 24), [std(0x8a6a48), std(0xffffff, {map:tgtTex}), std(0x8a6a48)]); tgt.rotation.x = Math.PI/2; tgt.position.set(4.3, 1.4, 1.2); hall.add(tgt);
  const leg = new THREE.Mesh(new THREE.BoxGeometry(.12, 1.4, .12), wood); leg.position.set(4.3, .6, 1.0); hall.add(leg);
  hall.traverse(o => { if (o.isMesh) o.userData.tb = 'train'; });
  const barr = mk(TB_BARR, 0xe2d2b4, 0x3a5a8a, 'barracks');
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 2.6, 6), std(0xdddddd, {metalness:.6})); pole.position.set(2.6, 5.4, 0); barr.add(pole);
  const fl = new THREE.Mesh(new THREE.PlaneGeometry(1, .62), new THREE.MeshStandardMaterial({color:0x3a7bc8, side:THREE.DoubleSide})); fl.position.set(3.12, 6.4, 0); barr.add(fl);
})();
const _tUp65 = window.tUp;
window.tUp = function(ev){
  const D = tDrag;
  if (D && !D.s && Math.hypot(ev.clientX - D.sx, ev.clientY - D.sy) < 8){
    setRay(ev); const h = ray.intersectObjects(tBld, true)[0];
    if (h){ let o = h.object; while (o && !o.userData.tb) o = o.parent; tDrag = null;
      if (o.userData.tb === 'train'){ UI.upg = UI.upg === 'train' ? null : 'train'; UI.tmenu = null; UI.page = null; renderAll(); }
      else hint(`병영이에요 · 쫄병 ${G.soldiers.length}/${soldierMax()}명 · 지붕 위 표지판에서 모집해요`);
      return; }
  }
  _tUp65(ev);
};
const _trainPanel65 = window.trainPanel;
window.trainPanel = function(){
  if (!painted) return renderAll();
  _trainPanel65();
  if (narrowUI()) return;
  const full = G.soldiers.length >= soldierMax(), c = recruitCost(), ok = !full && G.gold >= c;
  sign('recruit', () => V(TB_BARR.x, .4, TB_BARR.z + 2.2), sgB(`data-act="recruit" ${ok ? '' : `disabled data-why="${full ? '병영이 꽉 찼어요 · 훈련장에서 「병영 늘리기」' : `골드 부족 · ${c}G`}"`}`, '🪖', full ? '병영이 꽉 찼어요' : `쫄병 모집 · ${c}G`, `병영 ${G.soldiers.length}/${soldierMax()}${!full && !ok ? ` · 보유 ${G.gold}G` : ''}`, ok ? 'go' : ''));
  if (UI.upg !== 'train') sign('tupg', () => V(TB_HALL.x, .4, TB_HALL.z + 2.2), sgB(`data-act="upgTrain" aria-pressed="false"`, '📋', '훈련장', '쫄병 · 주인공 업그레이드'));
};
