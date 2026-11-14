'use strict';
/* ═════════ 성 (월드) ═════════ */
const wScene = new THREE.Scene();
wScene.fog = new THREE.Fog(0x0b1220, 90, 210);
wScene.add(new THREE.HemisphereLight(0xbfd2ff, 0x1a2418, .75));
{ const m = new THREE.DirectionalLight(0xdfe8ff, .85); m.position.set(-14, 30, 18); wScene.add(m); }
const M2W = .55, dToZ = d => -1.3 - d*M2W, zToD = z => (-1.3 - z)/M2W;
const WALL_TOP = 8, STAIR_X = 17.8;
const RIVER = [40, 48];
const FLOORS = {4:{y:WALL_TOP, z:.35, name:'옥상'}, 3:{y:6, z:.75, name:'3층'}, 2:{y:4, z:.75, name:'2층'}, 1:{y:2, z:.75, name:'1층'}};
const SOCKETS = [
  ...[-14, -8.5, -3, 3, 8.5, 14].map(x => ({x, floor:4})),
  ...[3, 2, 1].flatMap(f => [-12, -6, 6, 12].map(x => ({x, floor:f}))),
].map((so, i) => Object.assign(so, {i, tower:null, y:FLOORS[so.floor].y, z:so.floor === 4 ? -.25 : .15}));
const sockName = so => so.floor === 4 ? `옥상 ${so.i + 1}` : `${FLOORS[so.floor].name} ${SOCKETS.filter(q => q.floor === so.floor).indexOf(so) + 1}`;
const built = f => !!G.floors[f];
const builtFloors = () => [4, 3, 2, 1].filter(built);
let walkways = [], river, gate, aimMark;
const wallMats = [];
const sockPicks = [], floorGroups = {};
const hero = new THREE.Group();
const heroBeam = beamMesh(0xffffff), sortieBeam = beamMesh(0xffffff), previewGroup = new THREE.Group(), fxGroup = new THREE.Group();
function wBuild(){
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), std(0x22352b, {roughness:.9})); ground.rotation.x = -Math.PI/2; wScene.add(ground);
  const court = new THREE.Mesh(new THREE.PlaneGeometry(44, 22), std(0x262b36)); court.rotation.x = -Math.PI/2; court.position.set(0, .02, 11); wScene.add(court);
  for (let d = 10; d <= 100; d += 10){
    const ln = new THREE.Mesh(new THREE.PlaneGeometry(40, .06), new THREE.MeshBasicMaterial({color:0x8e98b0, transparent:true, opacity:.28})); ln.rotation.x = -Math.PI/2; ln.position.set(0, .03, dToZ(d)); wScene.add(ln);
    const l = label(`${d} m`, {size:20, color:'#9fb0cc', h:.03}); l.position.set(-15.5, .4, dToZ(d)); wScene.add(l);
  }
  const z0 = dToZ(RIVER[0]), z1 = dToZ(RIVER[1]);
  river = new THREE.Mesh(new THREE.PlaneGeometry(80, z0 - z1), new THREE.MeshStandardMaterial({color:0x2b6f9e, roughness:.25, metalness:.2, emissive:0x0d3552, emissiveIntensity:.6, transparent:true, opacity:.9}));
  river.rotation.x = -Math.PI/2; river.position.set(0, .04, (z0 + z1)/2); wScene.add(river);
  const rl = label(['얕은 강', '40–48 m · 적이 느려져요'], {size:22, color:'#bfe3ff', sub:'#8fc3e8', h:.032}); rl.position.set(9, .8, (z0 + z1)/2); wScene.add(rl);
  const stone = std(0x5a6178, {roughness:.85}), stoneD = std(0x4a5065, {roughness:.85}), wallStone = std(0x5a6178, {roughness:.85}), wallStoneD = std(0x4a5065, {roughness:.85});
  wallMats.push(wallStone, wallStoneD);
  const facade = new THREE.Mesh(new THREE.BoxGeometry(37, WALL_TOP - .06, .96), wallStone); facade.position.set(0, (WALL_TOP - .06)/2, -.7); facade.userData.wallPart = 1; wScene.add(facade);
  const roof = new THREE.Mesh(new THREE.BoxGeometry(36.96, .3, 2.54), std(0x6b7289)); roof.position.set(0, WALL_TOP - .15, .12); wScene.add(roof); roof.userData.floor = 4; walkways.push(roof);
  for (let x = -17.8; x <= 17.8; x += 1.8){ const mer = new THREE.Mesh(new THREE.BoxGeometry(1, 1, .45), wallStoneD); mer.position.set(x, WALL_TOP + .5, -1); mer.userData.wallPart = 2; wScene.add(mer); }
  const rail = new THREE.Mesh(new THREE.BoxGeometry(37, .45, .2), wallStoneD); rail.position.set(0, WALL_TOP + .22, 1.3); rail.userData.wallPart = 2; wScene.add(rail);
  gate = new THREE.Mesh(new THREE.BoxGeometry(3.2, 3.4, .1), std(0x2a1d14)); gate.position.set(0, 1.7, -1.27); wScene.add(gate);
  for (const s of [-1, 1]){
    const tw = new THREE.Mesh(new THREE.CylinderGeometry(2.4, 2.6, WALL_TOP + 1.6, 28), stone); tw.position.set(s*20.2, (WALL_TOP + 1.6)/2, 0); wScene.add(tw);
    for (let a = 0; a < 12; a += 2){ const m = new THREE.Mesh(new THREE.BoxGeometry(.8, .8, .5), stoneD), t = a/12*Math.PI*2; m.position.set(s*20.2 + Math.cos(t)*2.2, WALL_TOP + 2, Math.sin(t)*2.2); m.rotation.y = -t; wScene.add(m); }
    for (let k = 0; k < 16; k++){ const st = new THREE.Mesh(new THREE.BoxGeometry(1.1, .22, .8), std(0x7a8196)); st.position.set(s*(18.3 + (k % 2)*.35), k*.5 + .2, 2.2 - (k % 4)*.12); wScene.add(st); }
    const sl = label('계단', {size:18, color:'#c9d1e3', h:.026}); sl.position.set(s*18.5, 1.2, 3.2); wScene.add(sl);
  }
  for (const f of [3, 2, 1]){
    const g = new THREE.Group(), y = FLOORS[f].y;
    const slab = new THREE.Mesh(new THREE.BoxGeometry(36.96, .25, 1.74), std(0x6b7289)); slab.position.set(0, y - .125, .73); slab.userData.floor = f; g.add(slab); walkways.push(slab);
    const rl2 = new THREE.Mesh(new THREE.BoxGeometry(37, .45, .12), wallStoneD); rl2.position.set(0, y + .22, 1.55); rl2.userData.wallPart = 2; g.add(rl2);
    for (const so of SOCKETS.filter(q => q.floor === f)){ const slit = new THREE.Mesh(new THREE.BoxGeometry(.5, 1.1, .05), std(0x0b0f18)); slit.position.set(so.x, y + .95, -1.24); g.add(slit); }
    const fl = label(FLOORS[f].name, {size:20, color:'#ffb27a', bold:true, h:.028}); fl.position.set(-16.2, y + .5, 1.7); g.add(fl);
    g.visible = false; wScene.add(g); floorGroups[f] = g;
  }
  { const fl = label('옥상 (4층)', {size:20, color:'#ffb27a', bold:true, h:.028}); fl.position.set(-16.2, WALL_TOP + .5, 1.7); wScene.add(fl); }
  for (const so of SOCKETS){
    const ring = new THREE.Mesh(new THREE.TorusGeometry(.6, .07, 8, 40), new THREE.MeshBasicMaterial({color:0xff8a3d})); ring.rotation.x = -Math.PI/2; ring.position.set(so.x, so.y + .03, so.z + (so.floor === 4 ? 0 : .3)); wScene.add(ring); so.ring = ring;
    const pick = new THREE.Mesh(new THREE.CylinderGeometry(.9, .9, 1.4, 12), new THREE.MeshBasicMaterial({visible:false})); pick.position.set(so.x, so.y + .6, so.z + .3); pick.userData.sock = so; wScene.add(pick); sockPicks.push(pick);
  }
  // 주인공
  const hood = std(0xff8a3d, {roughness:.7});
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.27, .33, .85, 16), hood); body.position.y = .62; hero.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.24, 16, 12), std(0xf1d2b6)); head.position.y = 1.27; hero.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(.26, 16, 12, 0, Math.PI*2, 0, Math.PI*.55), std(0x8a4f2a)); hair.position.y = 1.3; hero.add(hair);
  const tail = new THREE.Mesh(new THREE.SphereGeometry(.12, 10, 8), std(0x8a4f2a)); tail.position.set(0, 1.18, .27); tail.scale.set(1, 1.5, 1); hero.add(tail);
  const gun = new THREE.Mesh(new THREE.BoxGeometry(.12, .12, .6), std(0x2b3346, {metalness:.6})); gun.position.set(.3, .85, -.25); hero.add(gun);
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .3, 8), std(0x2b3346)); legL.position.set(-.12, .15, 0); hero.add(legL);
  const legR = legL.clone(); legR.position.x = .12; hero.add(legR); hero.userData.legs = [legL, legR];
  aimMark = new THREE.Mesh(new THREE.RingGeometry(.55, .75, 40), new THREE.MeshBasicMaterial({color:0xffd166, transparent:true, opacity:.85, side:THREE.DoubleSide, depthTest:false, fog:false})); aimMark.rotation.x = -Math.PI/2; aimMark.renderOrder = 9; aimMark.visible = false;
  wScene.add(hero, heroBeam, sortieBeam, previewGroup, fxGroup, aimMark);
  updateFloors();
}
function updateFloors(){ for (const f of [3, 2, 1]) floorGroups[f].visible = built(f); }
/* 밤에는 성벽을 반투명하게: 성벽 바로 앞(0–10 m)이 가려지지 않게 */
let xray = null;
function setWallXray(on){ if (xray === on) return; xray = on; for (const m of wallMats){ m.transparent = on; m.opacity = on ? .28 : 1; m.depthWrite = !on; m.needsUpdate = true; } }
function soldierMesh(s){
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.CylinderGeometry(.22, .27, .75, 12), std(0x5b6f96)); b.position.y = .55; g.add(b);
  const h = new THREE.Mesh(new THREE.SphereGeometry(.2, 12, 10), std(0xe8c9a8)); h.position.y = 1.1; g.add(h);
  const helm = new THREE.Mesh(new THREE.SphereGeometry(.22, 12, 8, 0, Math.PI*2, 0, Math.PI*.5), std(0x8a99ad, {metalness:.6})); helm.position.y = 1.13; g.add(helm);
  const gd = s ? gunOf(s) : SOLDIER_GUN, gl = .35 + barrelOf(gd)/160*.6;
  const gun = new THREE.Mesh(new THREE.BoxGeometry(.1, .1, gl), std(0x2b3346, {metalness:.6})); gun.position.set(.26, .72, -gl/2 + .05); g.add(gun);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 6), new THREE.MeshBasicMaterial({color:new THREE.Color(beamColor(gd))})); tip.position.set(.26, .72, -gl + .05); g.add(tip);
  return g;
}
function towerMesh(d){
  const g = new THREE.Group();
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.5, .6, .45, 20), std(0x3a4152, {metalness:.4})); base.position.y = .22; g.add(base);
  const head = new THREE.Group(); head.position.y = .8; g.add(head);
  const blen = .7 + barrelOf(d)/160*1.3;
  const hb = new THREE.Mesh(new THREE.BoxGeometry(.62, .5, 1.1), std(0x232a3a, {metalness:.5, roughness:.4})); head.add(hb);
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(.2, .22, blen, 16), std(0x2b3346, {metalness:.6, roughness:.35})); bar.rotation.x = Math.PI/2; bar.position.set(0, .05, -.55 - blen/2); head.add(bar);
  if (isLaser(d)){ const m = MEDIA[d.medium]; const rod = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, 1, 12), std(m.color, {emissive:m.color, emissiveIntensity:.8})); rod.rotation.x = Math.PI/2; rod.position.y = .3; head.add(rod); }
  else { const lm = lampModel(d.source, .5); lm.rotation.y = Math.PI/2; lm.position.set(0, .35, .1); head.add(lm); }
  let z = -.62 - blen*.25;
  for (const e of d.els){
    if (e.type === 'pol'){
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, .04, 24), std(0x2b3346, {transparent:true, opacity:.8})); disc.rotation.x = Math.PI/2; disc.position.z = z; head.add(disc);
      const ax = new THREE.Group(); ax.position.z = z; ax.rotation.z = rad(e.theta); ax.add(new THREE.Mesh(new THREE.BoxGeometry(.05, .6, .06), std(0xffd166, {emissive:0xffb020, emissiveIntensity:.6}))); head.add(ax);
      if (!head.userData.polAxis) head.userData.polAxis = ax;
    } else { const l = new THREE.Mesh(new THREE.SphereGeometry(.34, 20, 12), std(0xa8e6ff, {transparent:true, opacity:.6, roughness:.05, emissive:0x2a90c8, emissiveIntensity:.4})); l.scale.set(1, 1, e.type === 'convex' ? .35 : .15); l.position.z = z; head.add(l); }
    z -= .14;
  }
  g.userData.head = head; return g;
}
function addAutoMesh(T){
  const ant = new THREE.Group();
  ant.add(new THREE.Mesh(new THREE.CylinderGeometry(.03, .03, .55, 6), std(0xaab3c5)));
  const dish = new THREE.Mesh(new THREE.SphereGeometry(.12, 10, 8), std(0x5ad48e, {emissive:0x2a7a4a, emissiveIntensity:.8})); dish.position.y = .3; ant.add(dish);
  ant.position.set(.35, .8, .35); T.mesh.add(ant);
}
function setOperator(T, s){
  if (T.opMesh){ T.mesh.remove(T.opMesh); dispose(T.opMesh); T.opMesh = null; }
  T.soldier = s ? s.id : null;
  if (s){ T.opMesh = soldierMesh(s);T.opMesh.position.set(-.75, 0, .35); T.mesh.add(T.opMesh); }
}
function placeTower(so, item, auto){
  const mesh = towerMesh(item.design); mesh.position.set(so.x, so.y, so.z); mesh.userData.sock = so; wScene.add(mesh);
  so.tower = {design:item.design, uid:item.uid, mesh, auto:false, autoOn:true, soldier:null, beam:beamMesh(beamColor(item.design))};
  wScene.add(so.tower.beam);
  if (auto){ so.tower.auto = true; addAutoMesh(so.tower); }
}
function removeTower(so){
  const T = so.tower; if (!T) return;
  const s = G.soldiers.find(q => q.id === T.soldier); if (s){ s.role = 'idle'; s.sock = null; }
  wScene.remove(T.mesh); dispose(T.mesh); wScene.remove(T.beam); dispose(T.beam);
  G.inventory.push({uid:T.uid, design:T.design}); if (T.auto) G.gold += AUTO_PRICE/2;
  so.tower = null;
}
function buildPreview(){
  clearGroup(previewGroup);
  if (G.mode !== 'place' || G.sel == null) return;
  const so = SOCKETS[G.sel], d = so.tower ? so.tower.design : (G.inventory.find(it => it.uid === G.previewUid && it.design.kind === 'tower') || {}).design; if (!d) return;
  const col = new THREE.Color(beamColor(d)), pos = [], cols = [], idx = []; let cap = 1e-9; for (let m = 1; m <= 100; m++) cap = Math.max(cap, fracAt(d, m));
  for (let m = 0; m <= 100; m++){
    const tr = traceD(d, Math.max(.01, m)), fr = fracAt(d, m), hw = clamp(.15 + tr.w*.012, .15, 1.6), z = dToZ(m), b = clamp(Math.sqrt(fr/cap), .06, 1)*Math.max(.15, tr.t);
    pos.push(so.x - hw, .06, z, so.x + hw, .06, z); for (let k = 0; k < 2; k++) cols.push(col.r*b, col.g*b, col.b*b);
    if (m){ const a = (m - 1)*2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); g.setIndex(idx);
  previewGroup.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({vertexColors:true, transparent:true, opacity:.85, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide, fog:false})));
  const bd = band(d), mid = bd ? (bd[0] + bd[1])/2 : 15;
  const l = label(bd ? ['빛이 잘 모이는 구간', `${bd[0]}–${bd[1]} m`] : ['모이지 않는 빛', '가까울수록 셈'], {size:22, color:'#ffffff', sub:'#ffd9b8', bg:'rgba(11,18,32,.85)', h:.03});
  l.position.set(so.x, 1.6, dToZ(clamp(mid, 5, 95))); previewGroup.add(l);
}

/* ═════════ 주인공 이동 (층 · 계단) ═════════ */
const H = () => G.hero;
function heroY(){ const h = H(); if (h.climb){ const a = FLOORS[h.climb.from].y, b = FLOORS[h.climb.to].y, t = h.climb.t; return a + (b - a)*t; } return FLOORS[h.floor].y; }
function heroZ(){ const h = H(); if (h.climb) return 2.2; return FLOORS[h.floor].z; }
function nextFloor(f, dir){ const fl = builtFloors().sort((a, b) => a - b); return dir > 0 ? fl.find(q => q > f) : fl.slice().reverse().find(q => q < f); }
function goTo(x, floor){
  const h = H(); x = clamp(x, -STAIR_X, STAIR_X);
  if (floor === h.floor && !h.climb){ h.route = [{x}]; return; }
  const sx = (Math.abs(h.x - STAIR_X) + Math.abs(STAIR_X - x)) < (Math.abs(h.x + STAIR_X) + Math.abs(-STAIR_X - x)) ? STAIR_X : -STAIR_X;
  h.route = [{x:sx}, {floor}, {x}];
}
function stepHero(dt){
  const h = H(), sp = 7*heroSpeed();
  if (h.climb){ h.climb.t += dt/.5; if (h.climb.t >= 1){ h.floor = h.climb.to; h.climb = null; } return true; }
  const st = h.route[0]; if (!st) return false;
  if (st.x != null){ const dx = st.x - h.x; if (Math.abs(dx) <= sp*dt){ h.x = st.x; h.route.shift(); } else h.x += Math.sign(dx)*sp*dt; h.walkDir = Math.sign(dx); return true; }
  if (st.floor != null){
    if (st.floor === h.floor){ h.route.shift(); return true; }
    const nf = nextFloor(h.floor, st.floor > h.floor ? 1 : -1); if (nf == null){ h.route = []; return false; }
    h.climb = {from:h.floor, to:nf, t:0}; return true;
  }
  return false;
}
const inStairs = () => Math.abs(H().x) > STAIR_X - .6;
const atSocket = i => i != null && SOCKETS[i].floor === H().floor && !H().climb && Math.abs(H().x - SOCKETS[i].x) < .3;
const nearSockets = () => SOCKETS.filter(s => built(s.floor) && s.floor === H().floor && !H().climb && Math.abs(H().x - s.x) < (G.mode === 'wave' ? 1.2 : .3)).sort((a, b) => Math.abs(H().x - a.x) - Math.abs(H().x - b.x));
function selectSocket(i){
  G.sel = i; const so = SOCKETS[i]; goTo(so.x, so.floor);
  G.previewUid = (G.inventory.find(it => it.design.kind === 'tower') || {}).uid;
  buildPreview(); hint(so.tower ? `${sockName(so)} · 바닥 띠가 센 구간이에요` : `${sockName(so)} 자리로 가는 중`); renderAll();
}

/* ═════════ 웨이브 ═════════ */
function foeMesh(type, armor, scale = 1){
  const f = FOES[type], mat = std(f.color, {emissive:f.color, emissiveIntensity:.15, roughness:.5});
  const g = new THREE.Group(), body = foeBody(type, armor, mat);
  body.position.y = type === 'ca' ? .75 : type === 'na' ? .6 : .5; body.scale.setScalar(scale*(type === 'ca' ? 1.25 : 1)); g.add(body);
  g.userData.body = body.userData.body;
  const bar = new THREE.Mesh(new THREE.PlaneGeometry(1.1, .12), new THREE.MeshBasicMaterial({color:0x5ad48e, fog:false})); bar.position.y = type === 'ca' ? 2.1 : 1.55; g.add(bar); g.userData.bar = bar;
  return g;
}
function startWave(){
  G.queue = waveList(G.wave); G.total = G.queue.length; G.kills = 0; G.waveGold = 0; G.spawnT = .5; G.enemies = []; G.waveT = 0;
  G.mode = 'wave'; G.sel = null; G.ride = null; G.showSettings = false; G.sortieUsed = false; G.sortieResult = null; G.building = null;
  if (G.settings.autoClose) G.winOpen = false;
  H().route = []; buildPreview(); setWallXray(true);
  heroBeam.material.color.set(beamColor(G.weapon));
  hint(`밤 ${G.wave} · 적이 온다! 화면을 누르면 그 지점으로 쏴요`);
  renderAll();
}
function spawnFoe(spec){
  const f = FOES[spec.type], hp = Math.round(f.hp*hpMul(G.wave)), mesh = foeMesh(spec.type, spec.armor), x = -15 + Math.random()*30;
  mesh.position.set(x, 0, dToZ(100)); wScene.add(mesh);
  G.enemies.push({type:spec.type, armor:spec.armor, mesh, x, d:100, hp, max:hp, hitT:0});
}
function killFoe(e, list){ wScene.remove(e.mesh); dispose(e.mesh); list.splice(list.indexOf(e), 1); }
function floatText(text, pos, bad){
  if (!G.settings.dmgText) return;
  const s = label(text, {size:20, color:'#ffffff', bg:bad ? 'rgba(200,50,70,.9)' : 'rgba(11,18,32,.85)', h:.03, bold:true});
  s.position.copy(pos); fxGroup.add(s); G.floats.push({s, life:1.1});
}
const tA = V(), tB = V();
const beamW = w => clamp(.04 + w*.004, .04, .5);
const spreadW = w => Math.min(w/100, 2.5)*M2W;   // 빔 반지름(cm) → 월드 반지름
function towerOrigin(so){ return tA.set(so.x, so.y + 1.05, so.floor === 4 ? -.95 : -1.45); }
function pickNearest(ox, oz, list, cone, maxD, design){
  let best = null, bd = 1e9, good = null, gd = 1e9;
  for (const e of list){
    const dx = e.mesh.position.x - ox, dz = e.mesh.position.z - oz; if (cone && dz > 0) continue;
    if (cone && Math.atan2(Math.abs(dx), -dz) > rad(cone)) continue;
    const dist = Math.hypot(dx, dz)/M2W; if (dist > maxD) continue;
    if (dist < bd){ bd = dist; best = e; }
    if (design && dist < gd && hitD(design, FOES[e.type], dist, e.armor, null).v > 0){ gd = dist; good = e; }
  }
  if (good) return {e:good, dist:gd};
  return best ? {e:best, dist:bd} : null;
}
function applyHit(design, e, dist, dt, polTheta, acc = 1, scale){
  const r = hitD(design, FOES[e.type], dist, e.armor, polTheta, scale);
  if (r.v){ e.hp -= r.v*dt*acc; e.hitT = .1; bumpBest(r.v); }
  return r;
}
/* 넓게 퍼진 빛은 빔 안에 있는 적을 여러 마리 맞혀요 (대신 한 마리당 세기는 약해요) */
function splash(design, center, dist, dt, r, acc = 1, scale){
  const R = spreadW(r.w); if (R < .35) return;
  for (const o of G.enemies) if (o !== center && o.mesh.position.distanceTo(center.mesh.position) < R + .3) applyHit(design, o, dist, dt, null, acc, scale);
}
function fireAlong(design, origin, dirX, dirZ, dt, polTheta, zeroCtx){
  let best = null, bt = 1e9;
  for (const e of G.enemies){
    const px = e.mesh.position.x - origin.x, pz = e.mesh.position.z - origin.z, t = px*dirX + pz*dirZ; if (t <= 0) continue;
    const lat = Math.abs(px*dirZ - pz*dirX), w = traceD(design, t/M2W).w;
    if (lat < .65 + spreadW(w) && t < bt){ bt = t; best = e; }
  }
  const endT = best ? bt : 100*M2W;
  tB.set(origin.x + dirX*endT, best ? .9 : .3, origin.z + dirZ*endT);
  if (best){
    const dist = bt/M2W, r = applyHit(design, best, dist, dt, polTheta);
    splash(design, best, dist, dt, r);
    if (!r.v && zeroCtx){ zeroCtx.t -= dt; if (zeroCtx.t <= 0){ zeroCtx.t = 1.1; floatText(r.why, V(best.mesh.position.x, 2.6, best.mesh.position.z), true); } }
    return {target:best, end:tB, w:r.w, zero:!r.v, hit:r};
  }
  return {target:null, end:tB, w:1, zero:false};
}
const heroZero = {t:0}, rideZero = {t:0};
const SENS = {s:45, m:75, l:115};
function updateWave(dt){
  const S = G.sortie;
  G.waveT = (G.waveT || 0) + dt;
  if (G.queue.length){ G.spawnT -= dt; if (G.spawnT <= 0){ G.spawnT = Math.max(.5, 1.1 - .04*sq(G.wave)); spawnFoe(G.queue.shift()); } }
  if (S) sortieMove(dt);
  const sm = spdMul(G.wave);
  for (const e of G.enemies){
    const slow = e.d <= RIVER[1] && e.d >= RIVER[0] ? .35 : 1, sp = FOES[e.type].speed*slow*sm;
    e.hitT = Math.max(0, e.hitT - dt);
    let chased = false;
    if (S){
      let tgt = null, td = CHASE_R;
      for (const u of sortieUnits()){ const dd = Math.hypot(u.x - e.mesh.position.x, u.z - e.mesh.position.z); if (dd < td){ td = dd; tgt = u; } }
      e.chase = tgt;
      if (tgt){
        chased = true;
        const dx = tgt.x - e.mesh.position.x, dz = tgt.z - e.mesh.position.z;
        if (td > .8){ e.mesh.position.x += dx/td*sp*M2W*dt; e.mesh.position.z += dz/td*sp*M2W*dt; e.x = e.mesh.position.x; e.d = Math.max(0, zToD(e.mesh.position.z)); }
        e.cool = (e.cool || 0) - dt;
        if (td < .95 && e.cool <= 0){ e.cool = .8; tgt.hurt(FOES[e.type].wall); }
      }
    }
    if (!chased){ e.d -= sp*dt; e.mesh.position.z = dToZ(e.d); }
    // 몬스터가 노려보는 쪽: 토벌 중엔 쫓는 상대, 아니면 성벽 위 주인공
    { let lx, lz; if (chased && e.chase){ lx = e.chase.x; lz = e.chase.z; } else { lx = S && !S.auto ? S.x : H().x; lz = S && !S.auto ? S.z : heroZ(); }
      const want = Math.atan2(lx - e.mesh.position.x, lz - e.mesh.position.z); let df = want - e.mesh.rotation.y; df = Math.atan2(Math.sin(df), Math.cos(df)); e.mesh.rotation.y += df*Math.min(1, dt*6); }
    { const fb = e.mesh.children[0]; if (fb && fb.userData.anim) fb.userData.anim(G.waveT + e.x); }
    e.mesh.position.y = slow < 1 ? -.25 : 0;
  }
  // 자동 출병
  if (!S && !G.sortieUsed && G.autoSortie !== 'off' && G.mode === 'wave' && G.soldiers.some(s => s.role === 'sortie' && !s.down)){
    if ((G.autoSortie === 'start' && G.waveT > 3 && G.enemies.length) || (G.autoSortie === 'half' && G.kills >= Math.ceil(G.total/2) && G.enemies.length)) startSortie(true);
  }
  // 탑: 탑승(수동) · 쫄병(조준 낮음) · 자동 모듈. 토벌 중에는 전부 정지
  aimMark.visible = false;
  if (!S) for (const so of SOCKETS){
    const T = so.tower; if (!T) continue;
    const o = towerOrigin(so).clone(), head = T.mesh.userData.head, draw = drawOf(T.design);
    const noPower = () => { T.beam.visible = false; T.zeroT = (T.zeroT || 0) - dt; if (T.zeroT <= 0){ T.zeroT = 1.6; floatText('전기 부족', V(o.x, o.y + 1.2, o.z), true); } };
    if (G.ride && G.ride.sock === so.i){
      const [mx, mz] = moveInput(), rate = SENS[G.settings.sens] || 75;
      G.ride.yaw = clamp(G.ride.yaw - mx*rad(rate)*dt, -rad(62), rad(62));
      G.ride.aimD = clamp(G.ride.aimD - mz*rate*.55*dt, 2, 100);
      head.rotation.y = G.ride.yaw;
      if (head.userData.polAxis) head.userData.polAxis.rotation.z = rad(G.ride.theta);
      const dx = -Math.sin(G.ride.yaw), dz = -Math.cos(G.ride.yaw), ad = G.ride.aimD*M2W;
      aimMark.position.set(o.x + dx*ad, .08, o.z + dz*ad); aimMark.visible = true;
      if (!(G.ride.firing || G.keys[' '])){ T.beam.visible = false; G.ride.target = null; continue; }
      if (G.energy < draw*dt){ noPower(); continue; }
      G.energy -= draw*dt;
      const r = fireAlong(T.design, o, dx, dz, dt, hasPol(T.design) ? G.ride.theta : null, rideZero);
      G.ride.target = r.target;
      setBeam(T.beam, o, r.end, beamW(r.w), r.zero ? .25 : .8);
      continue;
    }
    if (head.userData.polAxis) head.userData.polAxis.rotation.z = rad(firstPol(T.design));
    const op = T.soldier != null ? 'soldier' : (T.auto && T.autoOn) ? 'auto' : null;
    if (!op){ T.beam.visible = false; continue; }
    if (op === 'auto') G.energy = Math.max(0, G.energy - autoUpkeep()*dt);
    const nb = pickNearest(o.x, o.z, G.enemies, 42, 100, op === 'auto' ? T.design : null);
    if (!nb){ T.beam.visible = false; continue; }
    if (G.energy < draw*dt){ noPower(); continue; }
    G.energy -= draw*dt;
    const e = nb.e, acc = op === 'soldier' ? soldierAcc() : 1;
    const jit = (1 - acc)*1.6, jx = (Math.random() - .5)*jit, jz = (Math.random() - .5)*jit;
    head.rotation.y = Math.atan2(-(e.mesh.position.x + jx - o.x), -(e.mesh.position.z + jz - o.z));
    const r = applyHit(T.design, e, nb.dist, dt, null, op === 'soldier' ? .5 + .5*acc : 1); splash(T.design, e, nb.dist, dt, r, op === 'soldier' ? .5 + .5*acc : 1);
    T.zeroT = (T.zeroT || 0) - dt;
    if (!r.v && T.zeroT <= 0){ T.zeroT = 1.2; floatText(r.why, V(e.mesh.position.x, 2.6, e.mesh.position.z), true); }
    setBeam(T.beam, o, tB.set(e.mesh.position.x + jx, e.mesh.position.y + .8, e.mesh.position.z + jz), beamW(r.w), r.v ? (r.sat ? .8 : .5) : .2);
  } else for (const so of SOCKETS) if (so.tower) so.tower.beam.visible = false;
  // 주인공 무기
  if (S && !S.auto) sortieFire(dt);
  else {
    if (S) sortieFire(dt);
    if (!G.ride){
      const o = V(H().x + .25, heroY() + 1.0, heroZ() - (H().floor === 4 ? .35 : 2.2));
      let target = null, dist = 0, end = null;
      if (G.aimHeld && G.aim){
        let bd = 2.5; for (const e of G.enemies){ const q = Math.hypot(e.mesh.position.x - G.aim.x, e.mesh.position.z - G.aim.z); if (q < bd){ bd = q; target = e; } }
        if (!target) end = V(G.aim.x, .2, G.aim.z);
      } else { const nb = pickNearest(o.x, o.z, G.enemies, 50, 70, G.weapon); if (nb) target = nb.e; }
      if (target){ dist = Math.hypot(target.mesh.position.x - o.x, target.mesh.position.z - o.z)/M2W; end = V(target.mesh.position.x, target.mesh.position.y + .8, target.mesh.position.z);
        const r = applyHit(G.weapon, target, dist, dt, null); splash(G.weapon, target, dist, dt, r);
        heroZero.t -= dt; if (!r.v && heroZero.t <= 0){ heroZero.t = 1.2; floatText(r.why, V(target.mesh.position.x, 2.6, target.mesh.position.z), true); } }
      if (end){ setBeam(heroBeam, o, end, .06, target ? .75 : .3); H().yaw = Math.atan2(-(end.x - o.x), -(end.z - o.z)); }
      else heroBeam.visible = false;
    } else heroBeam.visible = false;
  }
  // 정리
  const rm = rewardMul(G.wave);
  for (const e of G.enemies.slice()){
    if (e.hp <= 0){
      const f = FOES[e.type], rw = Math.round(f.reward*rm); G.kills++;
      if (Math.random() < .35){ const mt = DROP_METAL[e.type]; G.metals[mt] = (G.metals[mt] || 0) + 1; floatText(`+${METALS[mt].name} 조각`, V(e.mesh.position.x, 3.0, e.mesh.position.z)); }
      if (S){ const v = Math.round(rw*1.5), cr = new THREE.Mesh(new THREE.OctahedronGeometry(.3), new THREE.MeshStandardMaterial({color:0xffd166, emissive:0xffb020, emissiveIntensity:.8})); cr.position.set(e.mesh.position.x, .5, e.mesh.position.z); wScene.add(cr); S.drops.push({m:cr, v}); }
      else { G.gold += rw; G.waveGold += rw; floatText(`+${rw}G`, V(e.mesh.position.x, 2.2, e.mesh.position.z)); }
      killFoe(e, G.enemies);
    }
    else if (e.d <= 0){ G.wallHp -= FOES[e.type].wall; killFoe(e, G.enemies); hint(`${FOES[e.type].name}가 성벽에 닿았어요 −${FOES[e.type].wall}`); if (G.wallHp <= 0) return gameOver(); }
    else { e.mesh.userData.bar.scale.x = Math.max(.02, e.hp/e.max); e.mesh.userData.bar.quaternion.copy(e.mesh.quaternion).invert().multiply(camera.quaternion); e.mesh.userData.body.material.emissiveIntensity = e.hitT ? .9 : .15; }
  }
  if (S){
    sortieCollect(dt);
    const alive = S.squad.filter(u => !u.down).length;
    $('timer').textContent = S.auto ? `토벌대 ${alive}/${S.squad.length} · 결정 ${S.gold}G · 남은 적 ${G.enemies.length + G.queue.length}` : `♥ ${Math.max(0, S.hp)} · 결정 ${S.gold}G · 남은 적 ${G.enemies.length + G.queue.length}`;
    if (!S.auto && S.hp <= 0){ endSortie('fall'); return; }
    if (S.auto && alive*2 < S.squad.length){ endSortie('retreat'); return; }
  }
  if (!G.queue.length && !G.enemies.length){ if (G.sortie) endSortie('clear'); waveCleared(); }
}
function hideBeams(){ heroBeam.visible = false; aimMark.visible = false; for (const so of SOCKETS) if (so.tower) so.tower.beam.visible = false; }
function waveCleared(){
  const bonus = Math.round((25 + 10*sq(G.wave)*3)*rewardMul(G.wave)/1.2);
  G.gold += bonus; G.waveGold += bonus;
  G.best.wave = Math.max(G.best.wave, G.wave); bestDirty = true;
  const before = G.energy, crafted = advanceCraft();
  G.energy = Math.min(batteryCap(), G.energy + dayCharge());
  for (const s of G.soldiers) s.down = false;
  G.report = {wave:G.wave, gold:G.waveGold, bonus, crafted, charged:Math.round(G.energy - before), sortie:G.sortieResult};
  G.wave++; G.mode = 'cleared'; G.winOpen = true; G.ride = null; G.aimHeld = false; G.aim = null; hideBeams(); setWallXray(false);
  hint(`밤 ${G.report.wave} 방어 성공 · 날이 밝았어요 · 자동 저장했어요`); renderAll();
}
function gameOver(){
  if (G.sortie) endSortie('lost');
  G.mode = 'over'; G.wallHp = 0; G.ride = null; hideBeams(); setWallXray(false);
  for (const e of G.enemies.slice()) killFoe(e, G.enemies); G.queue = [];
  bestDirty = true; clearSave(); renderAll();
}

/* ═════════ 토벌 (웨이브 중 한 번 · 쫄병 동행 · 자동 출병) ═════════ */
const SOR_BOUNDS = {x0:-30, x1:30, z0:dToZ(3), z1:dToZ(110)};
const CHASE_R = 9, SLOT_DX = 1.2, SLOT_DZ = 1.1;
const slotOff = s => s.slot ? [s.slot[0]*SLOT_DX, (s.slot[1] + 1)*SLOT_DZ] : [0, 1.5];
const gunOf = s => s.weapon || SOLDIER_GUN;
function sortieUnits(){
  const S = G.sortie, out = S.auto ? [] : [{x:S.x, z:S.z, hurt:n => { S.hp -= n; floatText(`−${n}`, V(S.x, 2.2, S.z), true); }}];
  for (const u of S.squad) if (!u.down) out.push({x:u.mesh.position.x, z:u.mesh.position.z, hurt:n => { u.hp -= n; if (u.hp <= 0){ u.down = true; u.mesh.visible = false; u.beam.visible = false; u.s.down = true; floatText('쫄병 기절', V(u.mesh.position.x, 2, u.mesh.position.z), true); } }});
  return out;
}
function startSortie(auto){
  if (G.mode !== 'wave' || G.sortieUsed || G.sortie) return;
  if (!auto && G.ride) return;
  const squad = G.soldiers.filter(s => s.role === 'sortie' && !s.down);
  if (auto && !squad.length) return;
  G.sortieUsed = true; gate.visible = false;
  if (!auto){ G.mode = 'sortie'; G.aim = null; G.aimHeld = false; }
  const hp = heroHpMax();
  G.sortie = {auto:!!auto, hp, max:hp, x:0, z:dToZ(4), drops:[], gold:0, zero:{t:0}, squad:[]};
  for (const s of squad){
    const m = soldierMesh(s), off = slotOff(s); m.position.set(off[0], 0, dToZ(4) + off[1]); wScene.add(m);
    const gun = gunOf(s), b = beamMesh(beamColor(gun)); wScene.add(b);
    G.sortie.squad.push({s, mesh:m, beam:b, off, gun, hp:soldierHpMax(), down:false, retarget:0, target:null});
  }
  for (const u of G.sortie.squad) u.mesh.rotation.y = 0;
  if (!auto){ hero.position.set(0, 0, G.sortie.z); hero.rotation.y = 0; hero.visible = true; sortieBeam.material.color.set(beamColor(G.weapon)); }
  for (const so of SOCKETS) if (so.tower) so.tower.beam.visible = false;
  hint(auto ? `토벌대 자동 출병 · ${squad.length}명 · 탑은 꺼졌어요 · 절반이 쓰러지면 알아서 퇴각` : `성문 개방 · 쫄병 ${squad.length}명 동행 · 탑은 전부 꺼졌어요`); renderAll();
}
function sortieMove(dt){
  const S = G.sortie;
  if (S.auto){
    let tgt = null, td = 1e9; for (const e of G.enemies){ const d = Math.hypot(e.mesh.position.x - S.x, e.mesh.position.z - S.z); if (d < td){ td = d; tgt = e; } }
    const gx = tgt ? clamp(tgt.mesh.position.x, -14, 14) : 0, gz = tgt ? Math.min(dToZ(4), tgt.mesh.position.z + 5) : dToZ(4);
    const dx = gx - S.x, dz = gz - S.z, d = Math.hypot(dx, dz);
    if (d > .1){ const sp = Math.min(d, 3.2*dt); S.x += dx/d*sp; S.z += dz/d*sp; S.heading = Math.atan2(-dx, -dz); }
  } else {
    const [mx, mz] = moveInput(), ml = Math.hypot(mx, mz);
    if (ml > .05){ const sp = 4.2*heroSpeed()*Math.min(1, ml); S.x = clamp(S.x + mx/ml*sp*dt, SOR_BOUNDS.x0, SOR_BOUNDS.x1); S.z = clamp(S.z + mz/ml*sp*dt, SOR_BOUNDS.z1, SOR_BOUNDS.z0); hero.rotation.y = Math.atan2(-mx, -mz); }
    hero.position.set(S.x, 0, S.z);
  }
  // 대형은 대장이 보는 방향을 따라 돌아가고, 쏠 적이 없으면 다들 대장과 같은 쪽을 봐요
  const hd = S.auto ? (S.heading || 0) : hero.rotation.y, ch = Math.cos(hd), sh = Math.sin(hd);
  for (const u of S.squad){
    if (u.down) continue;
    const ox = u.off[0], oz = u.off[1], tx = S.x + ox*ch + oz*sh, tz = S.z - ox*sh + oz*ch, dx = tx - u.mesh.position.x, dz = tz - u.mesh.position.z, d = Math.hypot(dx, dz);
    if (d > .1){ const sp = Math.min(d, 4.4*dt); u.mesh.position.x += dx/d*sp; u.mesh.position.z += dz/d*sp; }
    if (!u.target){ const want = d > .8 ? Math.atan2(-dx, -dz) : hd; let df = want - u.mesh.rotation.y; df = Math.atan2(Math.sin(df), Math.cos(df)); u.mesh.rotation.y += df*Math.min(1, dt*8); }
  }
}
function sortieFire(dt){
  const S = G.sortie;
  if (!S.auto){
    const o = V(S.x, .9, S.z);
    let nb = null;
    if (G.aimHeld && G.aim){
      let bd = 2.5, t = null; for (const e of G.enemies){ const q = Math.hypot(e.mesh.position.x - G.aim.x, e.mesh.position.z - G.aim.z); if (q < bd){ bd = q; t = e; } }
      if (t) nb = {e:t, dist:Math.hypot(t.mesh.position.x - S.x, t.mesh.position.z - S.z)/M2W};
      else { setBeam(sortieBeam, o, V(G.aim.x, .2, G.aim.z), .05, .3); hero.rotation.y = Math.atan2(-(G.aim.x - S.x), -(G.aim.z - S.z)); }
    } else nb = pickNearest(S.x, S.z, G.enemies, 0, 40, G.weapon);
    if (nb){
      const best = nb.e, r = hitD(G.weapon, FOES[best.type], nb.dist, best.armor, null);
      if (r.v){ best.hp -= r.v*1.4*dt; best.hitT = .1; bumpBest(r.v*1.4); }
      splash(G.weapon, best, nb.dist, dt*1.4, r);
      S.zero.t -= dt; if (!r.v && S.zero.t <= 0){ S.zero.t = 1.2; floatText(r.why, V(best.mesh.position.x, 2.4, best.mesh.position.z), true); }
      setBeam(sortieBeam, o, V(best.mesh.position.x, best.mesh.position.y + .6, best.mesh.position.z), beamW(r.w), r.v ? .8 : .25);
    } else if (!(G.aimHeld && G.aim)) sortieBeam.visible = false;
  }
  // 쫄병: 조준이 서툴러서 빗나가요 · 각자 들고 있는 무기로 쏴요
  const acc = soldierAcc(), sc = soldierScale();
  for (const u of S.squad){
    if (u.down){ u.beam.visible = false; continue; }
    u.retarget -= dt;
    if (u.retarget <= 0 || !u.target || !G.enemies.includes(u.target)){ u.retarget = .8; const p = pickNearest(u.mesh.position.x, u.mesh.position.z, G.enemies, 0, 30, u.gun); u.target = p ? p.e : null; }
    if (!u.target){ u.beam.visible = false; continue; }
    const e = u.target, dist = Math.hypot(e.mesh.position.x - u.mesh.position.x, e.mesh.position.z - u.mesh.position.z)/M2W;
    const jit = (1 - acc)*1.8, jx = (Math.random() - .5)*jit, jz = (Math.random() - .5)*jit;
    const r = hitD(u.gun, FOES[e.type], dist, e.armor, null, sc);
    if (r.v){ e.hp -= r.v*(.5 + .5*acc)*dt; e.hitT = .1; }
    setBeam(u.beam, V(u.mesh.position.x, .8, u.mesh.position.z), V(e.mesh.position.x + jx, .7, e.mesh.position.z + jz), .04, .55);
    u.mesh.rotation.y = Math.atan2(-(e.mesh.position.x - u.mesh.position.x), -(e.mesh.position.z - u.mesh.position.z));
  }
}
function sortieCollect(dt){
  const S = G.sortie, pts = S.auto ? S.squad.filter(u => !u.down).map(u => u.mesh.position) : [V(S.x, 0, S.z)];
  for (const dr of S.drops.slice()){
    dr.m.rotation.y += dt*3;
    let best = null, bd = 1e9; for (const p of pts){ const d = Math.hypot(p.x - dr.m.position.x, p.z - dr.m.position.z); if (d < bd){ bd = d; best = p; } }
    if (!best) continue;
    const dx = best.x - dr.m.position.x, dz = best.z - dr.m.position.z, d = bd;
    if (d < 3.5 && d > .01){ dr.m.position.x += dx/d*8*dt; dr.m.position.z += dz/d*8*dt; }
    if (d < .9){ S.gold += dr.v; wScene.remove(dr.m); dispose(dr.m); S.drops.splice(S.drops.indexOf(dr), 1); }
  }
}
function endSortie(how){
  const S = G.sortie; if (!S) return;
  const floor = S.drops.reduce((s, d) => s + d.v, 0);
  const got = how === 'fall' ? Math.floor(S.gold/2) : how === 'lost' ? 0 : how === 'clear' ? S.gold + floor : S.gold;
  G.gold += got; G.waveGold += got; G.sortieResult = {how, got, down:S.squad.filter(u => u.down).length, auto:S.auto};
  if (got > G.best.sortie){ G.best.sortie = got; bestDirty = true; }
  for (const d of S.drops){ wScene.remove(d.m); dispose(d.m); }
  for (const u of S.squad){ wScene.remove(u.mesh); dispose(u.mesh); wScene.remove(u.beam); dispose(u.beam); }
  sortieBeam.visible = false; gate.visible = true;
  G.sortie = null; if (G.mode === 'sortie') G.mode = 'wave';
  if (how === 'retreat') hint(S.auto ? `토벌대 퇴각 · 결정 ${got}G · 탑 다시 가동` : `퇴각! 결정 ${got}G 그대로 챙겼어요 · 탑 다시 가동`);
  else if (how === 'fall') hint(`쓰러져서 성으로 실려 왔어요 · 결정 절반 ${got}G`);
  else if (how === 'clear') hint(`밤이 끝났어요 · 바닥 결정까지 ${got}G`);
  renderAll();
}

/* ═════════ 증축 연출 ═════════ */
const BUILD_LINES = ['4층으론 부족한데, 3층 없어?', '— 제작자가 떠올렸을 땐 이미 완공됐답니다'];
function buildFloor(f){
  const c = FLOOR_COST[f]; if (G.gold < c || built(f)) return;
  G.gold -= c; G.floors[f] = true;
  const g = floorGroups[f]; g.visible = true; g.scale.y = .01;
  const dust = [];
  for (let i = 0; i < 40; i++){ const m = new THREE.Mesh(new THREE.SphereGeometry(.25 + Math.random()*.35, 8, 6), new THREE.MeshBasicMaterial({color:0xc9b89a, transparent:true, opacity:.6})); m.position.set(-18 + Math.random()*36, FLOORS[f].y*Math.random(), 1 + Math.random()*1.5); m.userData.v = .5 + Math.random(); fxGroup.add(m); dust.push(m); }
  G.anim = {type:'build', f, t:0, dust, prevMode:G.mode};
  G.mode = 'build'; G.winOpen = false; renderAll();
}
function updateBuild(dt){
  const A = G.anim; A.t += dt;
  const g = floorGroups[A.f], k = clamp(A.t/1.6, 0, 1), e = 1 - Math.pow(1 - k, 3);
  g.scale.y = Math.max(.01, e);
  for (const m of A.dust){ m.position.y += m.userData.v*dt; m.material.opacity = Math.max(0, .6 - A.t*.25); }
  if (A.t > 1.7 && !A.banner){ A.banner = true; const b = $('banner'); b.innerHTML = `<b>${FLOORS[A.f].name} 증축 완료!</b><span>${A.f === 3 ? BUILD_LINES.join('<br>') : `${FLOORS[A.f].name}에 탑 자리 4개가 생겼어요`}</span>`; b.hidden = false; }
  if (A.t > 4.2){
    for (const m of A.dust){ fxGroup.remove(m); dispose(m); }
    $('banner').hidden = true; G.anim = null; G.mode = 'place'; G.winOpen = true;
    hint(`${FLOORS[A.f].name}는 성벽 양 끝 계단으로 올라가요`); renderAll();
  }
}
