'use strict';
/* ═════════ 적의 소굴 던전 (6.6) ═════════
   웨이브와 따로 도는 두 번째 메인 콘텐츠. 10밤마다 오는 보스를 잡으면 그 보스 집안의 챕터가 열린다.
     1장 슬라임 동굴(슬라임 왕) · 2장 편광 성채(편광 기사왕) · 3장 수정 광산(골렘왕) · 4장 어둠의 미궁(그림자 군주) · 5장 간섭의 방(유령왕)
   챕터 = 방 5개: 전투 → 물리 퍼즐(챕터마다 다름) → 전투 → 보물 → 우두머리. 깬 방까지는 다음에 이어서 들어간다.
   낮에 하루 한 번. 주인공 + 토벌대 쫄병이 들어간다(토벌 조작 그대로). 퇴각하면 결정을 다 챙기고, 쓰러지면 절반.
   챕터 우두머리를 처음 잡으면 유물(모든 데미지 +6%).
   구현: 던전 방은 성 앞 들판에서 멀리 떨어진 곳(z = DZ)에 짓고, 모드는 토벌('sortie')을 그대로 쓴다(G.dgRun이 있으면 던전) */
const DZ = -420, RW = 13, RL = 15, DOOR_Z = DZ - RL, ENTRY_Z = DZ + RL - 2.5, DEV = () => V(0, 1.6, DZ - 5);
const DG_ROOMS = ['fight', 'puzzle', 'fight', 'loot', 'boss'];
const ROOM_NAME = {fight:'전투', puzzle:'퍼즐', loot:'보물', boss:'우두머리'};
const DG_CH = {
  1:{name:'슬라임 동굴', boss:'Bs', foes:['cs', 'ag', 'cs', 'sp'], floor:0x23382c, wall:0x34503f, light:0x6dffc0, deco:0x4fd6a0, puzzle:'photo', metal:'cs', unit:'22번 광전 효과'},
  2:{name:'편광 성채', boss:'Bk', foes:['kn', 'na', 'kn'], floor:0x262c44, wall:0x39425f, light:0x9db4ff, deco:0x8fa8ff, puzzle:'pol3', metal:'na', unit:'21번 편광'},
  3:{name:'수정 광산', boss:'Bg', foes:['ca', 'bt', 'ca'], floor:0x34302a, wall:0x4a4438, light:0xd8f4ff, deco:0xbfe8ff, puzzle:'dg', metal:'ca', unit:'24번 물질파'},
  4:{name:'어둠의 미궁', boss:'Bd', foes:['sh', 'bt', 'sh'], floor:0x17151f, wall:0x221f2c, light:0x8a7cff, deco:0x4a4466, puzzle:'lens', metal:'na', unit:'20번 렌즈'},
  5:{name:'간섭의 방', boss:'Bq', foes:['qg', 'ne', 'qg'], floor:0x1b2a35, wall:0x283a49, light:0x7fe0ff, deco:0xa8ecff, puzzle:'slit', metal:'cs', unit:'24번 이중 슬릿'},
};
const chOpen = c => !!G.bosses[DG_CH[c].boss];
const chState = c => (G.dg.ch[c] = G.dg.ch[c] || {room:0, done:false});
SITE_KEYS.push('lair'); SHEET_KEYS.add('dgpz');
UI.pz = null;

/* ── 지도: 북쪽 소굴 입구 ── */
const _mapSVG11 = window.mapSVG;
window.mapSVG = function(){
  let s = _mapSVG11();
  if (mapStage() < 2) return s;
  const n = [1, 2, 3, 4, 5].filter(chOpen).length, ink = '#5a3e28';
  s = s.replace('던전 · 준비 중', `던전 · ${n}장 열림 · 눌러서 들어가요`);
  const g = `<g class="mp site" data-go="lair" tabindex="0" role="button" aria-label="적의 소굴 던전" filter="url(#wob)">
    <rect x="380" y="-270" width="240" height="190" fill="transparent" stroke="none"/>
    <path d="M440 -150 q60 -90 120 0 z" fill="#3a2a22" stroke="${ink}" stroke-width="3"/>
    ${G.dg.day !== G.wave ? '<path d="M500 -232 l3 8 l8 3 l-8 3 l-3 8 l-3 -8 l-8 -3 l8 -3 z" fill="#ffd166" stroke="#5a3e28" stroke-width="1.2"/>' : ''}
  </g>`;
  const at = s.indexOf('<mask id="fm');
  return at > 0 ? s.slice(0, at) + g + s.slice(at) : s.replace(/<\/svg>\s*$/, `${g}</svg>`);
};
const _siteHtml11 = window.siteHtml;
window.siteHtml = function(k){ return k === 'lair' ? lairHtml() : _siteHtml11(k); };
function lairHtml(){
  const squad = G.soldiers.filter(s => s.role === 'sortie' && !s.down).length, used = G.dg.day === G.wave;
  const rows = [1, 2, 3, 4, 5].map(c => {
    const C = DG_CH[c], B = FOES[C.boss], st = chState(c), open = chOpen(c);
    const prog = st.done ? `<span class="ok">완료 · 유물</span>` : open ? `방 ${st.room}/5` : `잠김`;
    const btn = !open ? `<button class="btn" type="button" disabled data-why="${josa(B.name, '을', '를')} 잡으면 열려요 · 보스는 10밤마다 와요">${josa(B.name, '을', '를')} 잡으면</button>`
      : used ? `<button class="btn" type="button" disabled data-why="던전은 하루 한 번 · 밤을 보내고 와요">오늘은 다녀왔어요</button>`
      : `<button class="btn primary" type="button" data-dz="enter" data-v="${c}">${st.done ? '다시 돌기' : st.room ? `방 ${st.room + 1}부터` : '들어가기'}</button>`;
    return `<div class="dg-ch ${open ? '' : 'locked'}"><div><b>${c}장 · ${C.name}</b><small>${C.unit} · 우두머리 ${B.name}</small></div><span class="dg-p">${prog}</span>${btn}</div>`; }).join('');
  return `<div class="ed-head"><h3>적의 소굴</h3><span>유물 ${G.dg.relics.length}개 · 데미지 ×${relicMul().toFixed(2)}</span></div>
    <p class="muted">방 5개: 전투 → 물리 퍼즐 → 전투 → 보물 → 우두머리. 깬 방까지는 다음에 이어서 들어가요. 낮에 하루 한 번 · 주인공과 토벌대 쫄병 ${squad}명이 가요.</p>
    <div class="dg-list">${rows}</div>`;
}

/* ── 방 짓기 ── */
let dgGroup = null, dgDoor = null, dgChest = null, dgDevMesh = null;
function dgBuild(ch, kind){
  if (dgGroup){ wScene.remove(dgGroup); dispose(dgGroup); }
  const C = DG_CH[ch], g = new THREE.Group(); dgGroup = g; wScene.add(g);
  const stone = std(C.wall, {roughness:.95}), floor = new THREE.Mesh(new THREE.PlaneGeometry(2*RW + 4, 2*RL + 6), std(C.floor, {roughness:.98}));
  floor.rotation.x = -Math.PI/2; floor.position.set(0, .03, DZ); floor.receiveShadow = true; g.add(floor);
  const box = (w, h, d, x, y, z, m = stone) => { const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m); b.position.set(x, y, z); g.add(b); return b; };
  box(.8, 6, 2*RL + 2, -RW - .4, 3, DZ); box(.8, 6, 2*RL + 2, RW + .4, 3, DZ); box(2*RW + 2, .8, .8, 0, .4, DZ + RL + .4);   // 남쪽(카메라 쪽) 벽은 낮게: 높으면 주인공을 가린다
  box(RW - 2.2, 6, .8, -(RW + 2.2)/2, 3, DOOR_Z); box(RW - 2.2, 6, .8, (RW + 2.2)/2, 3, DOOR_Z); box(4.4, 1.6, .8, 0, 5.2, DOOR_Z);
  dgDoor = box(4.4, 4.4, .5, 0, 2.2, DOOR_Z + .1, std(0x4a3a2a, {roughness:.8, metalness:.2})); dgDoor.userData.y0 = 2.2;
  // 장식: 챕터 색 돌기둥 · 결정
  const deco = std(C.deco, {emissive:C.deco, emissiveIntensity:.25, roughness:.5});
  for (let i = 0; i < 14; i++){ const side = i % 2 ? 1 : -1, z = DZ - RL + 2 + (i >> 1)*4.2, h = 1 + (i*37 % 10)/5;
    const m = new THREE.Mesh(ch === 3 ? new THREE.OctahedronGeometry(.6, 0) : new THREE.ConeGeometry(.55, h*1.4, 7), deco); m.position.set(side*(RW - .9), ch === 3 ? .8 : h*.7, z); m.scale.y = ch === 3 ? 1.8 : 1; g.add(m); }
  // 횃불 + 방 조명 (챕터 색)
  for (const [x, z] of [[-RW + .3, DZ - 6], [RW - .3, DZ - 6], [-RW + .3, DZ + 7], [RW - .3, DZ + 7]]){ const t = new THREE.Mesh(new THREE.SphereGeometry(.22, 10, 8), new THREE.MeshBasicMaterial({color:0xffb050})); t.position.set(x, 3, z); g.add(t); }
  for (const z of [DZ - 7, DZ + 7]){ const L = new THREE.PointLight(C.light, ch === 4 ? .7 : 1.5, 34, 1.6); L.position.set(0, 7, z); g.add(L); }
  dgChest = null; dgDevMesh = null;
  if (kind === 'puzzle'){ const ped = new THREE.Mesh(new THREE.CylinderGeometry(.7, .9, 1.1, 16), stone); ped.position.set(0, .55, DZ - 5); g.add(ped);
    dgDevMesh = new THREE.Mesh(new THREE.SphereGeometry(.45, 18, 14), new THREE.MeshStandardMaterial({color:C.light, emissive:C.light, emissiveIntensity:.8})); dgDevMesh.position.set(0, 1.6, DZ - 5); g.add(dgDevMesh); }
  if (kind === 'loot'){ dgChest = new THREE.Group(); const body = new THREE.Mesh(new THREE.BoxGeometry(1.6, .9, 1), std(0x8a5a2a)); body.position.y = .45; dgChest.add(body);
    const lid = new THREE.Mesh(new THREE.BoxGeometry(1.6, .3, 1), std(0xa06a32)); lid.position.y = 1.05; dgChest.add(lid); dgChest.userData.lid = lid;
    const trim = new THREE.Mesh(new THREE.BoxGeometry(1.65, .12, 1.05), std(0xffd166, {metalness:.7, emissive:0xb08020, emissiveIntensity:.4})); trim.position.y = .9; dgChest.add(trim);
    dgChest.position.set(0, 0, DZ - 4); g.add(dgChest); }
}

/* ── 들어가기 · 방 넘어가기 · 나가기 ── */
/* 던전 몬스터 체력은 밤 수와 상관없이 챕터마다 정해진 배율(DG_BASE) → 나중에 강해져서 다시 오면 쉬워진다.
   배율은 '그 챕터에 맞는 무기를 든 기본 장비'(1·2·4장 LED, 3장 자외선 레이저, 5장 LED + 헬륨-네온)로 첫 방이 30초 안팎이 되게 맞춘 값
   (기사는 체력이 크고 편광 방패로 절반만 받아서 낮고, 골렘은 자외선이면 잘 녹아서 높다). 우두머리는 자기 체력 × 배율 × 0.45.
   대신 방 안의 적이 한꺼번에 덤빈다. 주인공은 던전에서 체력 2배 · 적은 느리게(DG_SPD) · 한 대에 1(우두머리 2) */
const DG_BASE = [.8, .35, 2.5, .7, .5], DG_BOSS = .4, DG_SPD = .6, DG_HIT = 1.4;
function dgMul(ch){ return DG_BASE[ch - 1]; }
function startDungeon(ch){
  if (!chOpen(ch) || G.dg.day === G.wave || G.mode !== 'map') return;
  const st = chState(ch), room = st.done || st.room >= 5 ? 0 : st.room;
  G.dg.day = G.wave; UI.site = null;
  const squad = G.soldiers.filter(s => s.role === 'sortie' && !s.down), hp = heroHpMax()*2;
  G.enemies = []; G.queue = []; G.kills = 0; G.total = 0; G.waveT = 0; G.waveMul = dgMul(ch); G.sortieUsed = true;
  G.sortie = {auto:false, hp, max:hp, x:0, z:ENTRY_Z, drops:[], gold:0, zero:{t:0}, squad:[], bounds:{x0:-RW + 1, x1:RW - 1, z0:DZ + RL - 1, z1:DOOR_Z + .2}};
  for (const s of squad){
    const m = soldierMesh(s), off = slotOff(s); wScene.add(m);
    const gun = gunOf(s), b = beamMesh(beamColor(gun)); wScene.add(b);
    G.sortie.squad.push({s, mesh:m, beam:b, off, gun, hp:soldierHpMax(), down:false, retarget:0, target:null});
  }
  sortieBeam.material.color.set(beamColor(G.weapon));
  G.dgRun = {ch, room, loot:0, metals:{}};
  G.mode = 'sortie'; G.aim = null; G.aimHeld = false; G.ride = null; G.showSettings = false;
  dgEnter(room);
  hint(`${ch}장 · ${DG_CH[ch].name} · 쫄병 ${squad.length}명 동행 · 퇴각(🏳)하면 결정은 그대로`);
  renderAll();
}
function dgEnter(room){
  const R = G.dgRun, kind = DG_ROOMS[room]; R.room = room; R.kind = kind; R.state = kind === 'fight' || kind === 'boss' ? 'fight' : kind; R.chest = false;
  for (const e of G.enemies.slice()) killFoe(e, G.enemies);
  const S = G.sortie; for (const d of S.drops){ S.gold += d.v; wScene.remove(d.m); dispose(d.m); } S.drops = [];   // 남은 결정은 자동으로 챙겨서 다음 방으로
  dgBuild(R.ch, kind);
  S.x = 0; S.z = ENTRY_Z; hero.position.set(0, 0, S.z); hero.rotation.y = 0;
  for (const u of S.squad){ u.mesh.position.set(u.off[0], 0, S.z + u.off[1]); u.mesh.rotation.y = 0; u.target = null; }
  const C = DG_CH[R.ch];
  if (kind === 'fight'){ const n = room === 0 ? 5 : 8; for (let i = 0; i < n; i++) dgSpawn(C.foes[i % C.foes.length], -8 + (i % 5)*4, DZ - 4 - Math.floor(i/5)*5 - (i % 2)*1.5); }
  if (kind === 'boss'){ const b = dgSpawn(C.boss, 0, DZ - 8, true); for (let i = 0; i < 4; i++) dgSpawn(C.foes[i % C.foes.length], -7 + i*4.7, DZ - 3); }
  if (kind === 'puzzle') UI.pz = PZ[C.puzzle].make(); else UI.pz = null;
  dgDoor.position.y = dgDoor.userData.y0;
  if (kind === 'loot') hint('보물방 · 상자에 다가가면 열려요');
  if (kind === 'puzzle') hint(`퍼즐방 · ${C.unit} · 가운데 받침대로 가면 자물쇠가 열려요`);
  renderAll();
}
function dgSpawn(type, x, z, boss){
  const f = FOES[type];
  spawnFoe({type, armor:type === 'kn' ? rnd([0, 45, 90, 135]) : f.base === 'kn' ? 0 : null});
  const e = G.enemies[G.enemies.length - 1];
  if (boss){ e.hp = e.max = Math.round(f.hp*G.waveMul*DG_BOSS); }
  e.mesh.position.set(f.quantum ? 0 : x, 0, z); e.x = e.mesh.position.x; e.d = 50; G.total++;
  return e;
}
function endDungeon(how){
  const S = G.sortie, R = G.dgRun; if (!S || !R) return;
  const floor = S.drops.reduce((s, d) => s + d.v, 0), crystals = how === 'fall' ? Math.floor(S.gold/2) : S.gold + floor;
  const got = crystals + (how === 'clear' ? R.loot : R.loot);   // 퍼즐 · 보물 상금은 쓰러져도 그대로
  G.gold += got;
  for (const e of G.enemies.slice()) killFoe(e, G.enemies);
  for (const d of S.drops){ wScene.remove(d.m); dispose(d.m); }
  for (const u of S.squad){ wScene.remove(u.mesh); dispose(u.mesh); wScene.remove(u.beam); dispose(u.beam); }
  sortieBeam.visible = false;
  if (dgGroup){ wScene.remove(dgGroup); dispose(dgGroup); dgGroup = null; }
  const st = chState(R.ch), relic = R.relic;
  G.sortie = null; G.dgRun = null; UI.pz = null; G.waveMul = null; G.sortieUsed = false; G.queue = []; G.enemies = [];
  G.mode = 'map'; UI.site = 'lair';
  const b = $('banner');
  if (b){ b.innerHTML = how === 'clear' ? `<b>${R.ch}장 ${DG_CH[R.ch].name} 돌파!</b><span>결정 · 상금 ${got}G${relic ? `<br>유물을 얻었어요 · 모든 데미지 ×${relicMul().toFixed(2)}` : ''}</span>`
      : how === 'fall' ? `<b>쓰러져서 실려 나왔어요</b><span>결정 절반 + 상금 ${got}G · 방 ${st.room}/5까지는 깬 걸로 남아요</span>`
      : `<b>퇴각!</b><span>결정 · 상금 ${got}G 그대로 · 방 ${st.room}/5부터 이어서 들어가요</span>`;
    b.hidden = false; clearTimeout(showBossBanner.t); showBossBanner.t = setTimeout(() => { b.hidden = true; }, 5200); }
  renderAll();
}

/* ── 매 프레임 ── */
function updateDungeon(dt){
  const S = G.sortie, R = G.dgRun; G.waveT += dt;
  sortieMove(dt);
  for (const e of G.enemies){
    const f = FOES[e.type], sp = f.speed*DG_SPD; e.hitT = Math.max(0, e.hitT - dt);
    let tgt = null, td = 1e9; for (const u of sortieUnits()){ const d = Math.hypot(u.x - e.mesh.position.x, u.z - e.mesh.position.z); if (d < td){ td = d; tgt = u; } }
    if (tgt){
      const dx = tgt.x - e.mesh.position.x, dz = tgt.z - e.mesh.position.z;
      if (td > .9){ if (!f.quantum) e.mesh.position.x = clamp(e.mesh.position.x + dx/td*sp*M2W*dt, -RW + .8, RW - .8); e.mesh.position.z = clamp(e.mesh.position.z + dz/td*sp*M2W*dt, DOOR_Z + .8, DZ + RL - .8); if (!f.quantum) e.x = e.mesh.position.x; }
      e.cool = (e.cool || 0) - dt; if (td < 1.1 && e.cool <= 0){ e.cool = DG_HIT; tgt.hurt(f.boss ? 2 : 1); }
      if (!f.quantum){ const want = Math.atan2(dx, dz); let df = want - e.mesh.rotation.y; df = Math.atan2(Math.sin(df), Math.cos(df)); e.mesh.rotation.y += df*Math.min(1, dt*6); }
    }
    { const fb = e.mesh.children[0]; if (fb && fb.userData.anim) fb.userData.anim(G.waveT + e.x); }
  }
  for (const e of G.enemies) if (e.boss) bossStep(e, dt);
  lightShadows();
  for (const e of G.enemies) if (FOES[e.type].quantum) quantumStep(e, dt);
  sortieFire(dt); sortieCollect(dt);
  // 쓰러진 적: 결정 · 금속 조각 · 분열
  const rm = rewardMul(Math.max(G.wave, 5));
  for (const e of G.enemies.slice()){
    if (e.hp > 0){ e.mesh.userData.bar.scale.x = Math.max(.02, e.hp/e.max); e.mesh.userData.bar.quaternion.copy(e.mesh.quaternion).invert().multiply(camera.quaternion); e.mesh.userData.body.material.emissiveIntensity = e.hitT ? .9 : .15; continue; }
    const f = FOES[e.type], v = Math.round(f.reward*rm*(f.boss ? .5 : .8)); G.kills++;
    const cr = new THREE.Mesh(new THREE.OctahedronGeometry(f.boss ? .55 : .3), new THREE.MeshStandardMaterial({color:0xffd166, emissive:0xffb020, emissiveIntensity:.8})); cr.position.set(e.mesh.position.x, .5, e.mesh.position.z); wScene.add(cr); S.drops.push({m:cr, v});
    if (DROP_METAL[e.type] && Math.random() < .35){ const mt = DROP_METAL[e.type]; G.metals[mt] = (G.metals[mt] || 0) + 1; floatText(`+${METALS[mt].name} 조각`, V(e.mesh.position.x, 3, e.mesh.position.z)); }
    if (f.split){ for (const s of [-1, 1]){ spawnFoe({type:f.split}); const k = G.enemies[G.enemies.length - 1]; k.mesh.position.set(e.mesh.position.x + s*.7, 0, e.mesh.position.z); k.x = k.mesh.position.x; k.d = 50; } G.total += 2; }
    if (f.boss){ R.bossDown = true; floatText(`${f.name} 격파!`, V(e.mesh.position.x, 4, e.mesh.position.z)); }
    killFoe(e, G.enemies);
  }
  // 방 상태
  if (R.state === 'fight' && !G.enemies.length){
    if (R.kind === 'boss'){ const st = chState(R.ch); if (!st.done){ st.done = true; if (!G.dg.relics.includes(R.ch)){ G.dg.relics.push(R.ch); R.relic = true; } } R.loot += 120 + 60*R.ch; }
    dgOpen(R.kind === 'boss' ? '우두머리를 쓰러뜨렸어요! 북쪽 문으로 나가요' : '방을 비웠어요 · 북쪽 문이 열렸어요');
  }
  if (R.state === 'loot' && dgChest && Math.hypot(S.x - dgChest.position.x, S.z - dgChest.position.z) < 2.2){
    const g = 80 + 40*R.ch, mt = DG_CH[R.ch].metal, c = rint(2, 4); R.loot += g; G.metals[mt] = (G.metals[mt] || 0) + c;
    dgChest.userData.lid.rotation.x = -1.1; dgChest.userData.lid.position.z = .4;
    floatText(`+${g}G · ${METALS[mt].name} ${c}`, V(0, 2.6, DZ - 4)); dgOpen('보물을 챙겼어요 · 문이 열렸어요');
  }
  if (R.state === 'puzzle'){ const near = Math.hypot(S.x, S.z - (DZ - 5)) < 5; if (near !== !!R.nearDev){ R.nearDev = near; renderAll(); } }
  if (dgDevMesh){ dgDevMesh.rotation.y += dt; dgDevMesh.position.y = 1.6 + .1*Math.sin(G.waveT*2); }
  if (dgDoor && R.state === 'open' && dgDoor.position.y < 6.6) dgDoor.position.y += dt*3;
  // 문으로 나가기
  if (R.state === 'open' && S.z < DOOR_Z + 1.4 && Math.abs(S.x) < 2.4){
    const st = chState(R.ch); st.room = Math.max(st.room, R.room + 1);
    if (R.room + 1 >= DG_ROOMS.length){ st.room = 0; endDungeon('clear'); return; }
    dgEnter(R.room + 1); return;
  }
  if (S.hp <= 0){ const st = chState(R.ch); st.room = Math.max(st.room, R.room); endDungeon('fall'); return; }
  $('timer').textContent = `${R.ch}장 ${DG_CH[R.ch].name} · 방 ${R.room + 1}/5 ${ROOM_NAME[R.kind]} · ♥ ${Math.max(0, S.hp)} · 결정 ${S.gold}G`;
}
function dgOpen(msg){ const R = G.dgRun; if (R.state === 'open') return; R.state = 'open'; hint(msg); renderAll(); }

/* ── 토벌 함수들에 던전 연결 ── */
const _updateWave11 = window.updateWave;
window.updateWave = function(dt){ if (G.dgRun) return updateDungeon(dt); return _updateWave11(dt); };
const _endSortie11 = window.endSortie;
window.endSortie = function(how){ if (G.dgRun){ if (how === 'retreat'){ const st = chState(G.dgRun.ch); st.room = Math.max(st.room, G.dgRun.state === 'open' ? G.dgRun.room + 1 : G.dgRun.room); } return endDungeon(how); } return _endSortie11(how); };
const _sortiePanel11 = window.sortiePanel;
window.sortiePanel = function(){
  _sortiePanel11();
  if (!G.dgRun) return;
  const R = G.dgRun, C = DG_CH[R.ch];
  const door = R.state === 'open' ? `<b>문 열림</b><small>북쪽 문으로 가요</small>` : R.state === 'puzzle' ? `<b>잠긴 문</b><small>퍼즐을 풀면 열려요</small>` : R.state === 'loot' ? `<b>잠긴 문</b><small>상자를 열어요</small>` : `<b>잠긴 문</b><small>적을 다 쓰러뜨려요 · 남은 ${G.enemies.length}</small>`;
  sign('dgtag', () => V(0, 6.4, DOOR_Z + .4), `<span class="sg-t">${R.ch}장 ${C.name} · 방 ${R.room + 1}/5 ${ROOM_NAME[R.kind]}</span><div class="sg-b">${door}</div>`);
  // 퍼즐 카드는 받침대에 다가가야 열리고, 멀어지면 닫힌다(퇴각 깃발을 가리지 않게)
  if (R.state === 'puzzle' && UI.pz && R.nearDev) paintPop('dgpz', DEV, pzHtml(), true, {cls:'site'});
  else if (R.state === 'puzzle' && UI.pz) sign('dgdev', () => V(0, 3.2, DZ - 5), `<span class="sg-t">🔒 ${C.unit} 퍼즐</span><div class="sg-b"><small>받침대로 가까이 가요</small></div>`);
};

/* ═════════ 챕터 퍼즐 ═════════ */
const PZ = {
  /* 1장 · 광전 문 (22번): 전자가 문 틈의 역전압 Vr을 넘어 자물쇠에 닿아야 열린다 → Ek(max) = hf − W ≥ eVr. 밝기는 전자 수만 바꾼다 */
  photo:{
    make(){ const [W, nm] = rnd([[2.3, '칼륨'], [2.1, '세슘']]); return {type:'photo', W, nm, Vr:rnd([.5, .7]), lam:650, v:60}; },
    slider:p => ({label:'램프 밝기', min:10, max:100, step:5, val:p.v, unit:'%'}),
    chips:p => [[650, 550, 470, 420, 380].map(l => ({v:l, on:l === p.lam, t:`${l} nm`, col:nmColor(l)})), 'lam'],
    calc(p){ const E = 1240/p.lam, Ek = E - p.W; return {E, Ek, pass:Ek >= p.Vr, I:Ek >= p.Vr ? p.v/100 : 0}; },
    solved(p){ return this.calc(p).pass; },
    view(p){ const c = this.calc(p), col = nmColor(p.lam), n = c.Ek > 0 ? Math.max(1, Math.round(p.v/20)) : 0;
      const es = Array.from({length:n}, (_, i) => { const y = 30 + i*16, x2 = c.pass ? 232 : 130 + Math.max(0, c.Ek)/p.Vr*70; return `<line x1="104" y1="${y}" x2="${x2}" y2="${y}" stroke="#ffe066" stroke-width="2" marker-end="url(#ar)"/>${c.pass ? '' : `<line x1="${x2}" y1="${y + 3}" x2="110" y2="${y + 6}" stroke="#ff8a6a" stroke-width="1.4" stroke-dasharray="3 3"/>`}`; }).join('');
      return `<svg class="pz" viewBox="0 0 280 130"><defs><marker id="ar" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6 z" fill="#ffe066"/></marker></defs>
        <circle cx="30" cy="62" r="16" fill="${col}" opacity="${.3 + .7*p.v/100}"/><path d="M46 62 L96 62" stroke="${col}" stroke-width="${2 + p.v/20}" opacity=".8"/>
        <rect x="96" y="18" width="8" height="96" fill="#9aa3b2"/><text x="100" y="128" text-anchor="middle">${p.nm}</text>
        <rect x="236" y="18" width="8" height="96" fill="${c.pass ? '#5ad48e' : '#c9a24a'}"/><text x="240" y="128" text-anchor="middle">자물쇠</text>
        <text x="170" y="14" text-anchor="middle">역전압 ${p.Vr} V</text>${es}</svg>`; },
    eq(p){ const c = this.calc(p); return `광자 에너지 E = 1240/λ = <b>${c.E.toFixed(2)} eV</b><br>튀어나온 전자의 최대 운동 에너지 Ek = E − W = ${c.E.toFixed(2)} − ${p.W} = <b class="${c.pass ? 'ok' : ''}">${c.Ek > 0 ? c.Ek.toFixed(2) : '0 (안 튀어나옴)'} eV</b><br>문 틈을 넘으려면 Ek ≥ e·${p.Vr} V → ${c.pass ? '<b class="ok">넘어가요!</b>' : '못 넘어요'} · 밝기는 전자 <i>수</i>만 바꿔요`; },
  },
  /* 2장 · 세 장 편광판 문 (21번): 0°와 90° 편광판 사이에 θ 판을 끼우면 I/I₀ = ½·cos²θ·cos²(90° − θ) = ⅛·sin²2θ */
  pol3:{
    make(){ return {type:'pol3', v:10, mid:true}; },
    slider:p => ({label:'가운데 편광판 투과축 θ', min:0, max:180, step:1, val:p.v, unit:'°'}),
    chips:p => [[{v:1, on:p.mid, t:'가운데 판 끼움'}, {v:0, on:!p.mid, t:'가운데 판 뺌'}], 'mid'],
    calc(p){ const I = p.mid ? .5*cos2(p.v)*cos2(90 - p.v) : 0; return {I, pass:I >= .1}; },
    solved(p){ return this.calc(p).pass; },
    view(p){ const c = this.calc(p), disc = (x, ang, t, on = true) => on ? `<g transform="translate(${x} 60)"><circle r="26" fill="rgba(60,80,130,.35)" stroke="#9db4ff"/><line x1="-22" y1="0" x2="22" y2="0" stroke="#ffd166" stroke-width="3" transform="rotate(${-ang})"/><text y="44" text-anchor="middle">${t}</text></g>` : '';
      const w = [8, 4, p.mid ? 8*cos2(p.v) : 4, Math.max(.4, c.I*16)];
      return `<svg class="pz" viewBox="0 0 280 120"><path d="M8 60 H50" stroke="#fff" stroke-width="${w[0]}" opacity=".7"/><path d="M78 60 H${p.mid ? 112 : 200}" stroke="#fff" stroke-width="${w[1]}" opacity=".7"/>${p.mid ? `<path d="M168 60 H200" stroke="#fff" stroke-width="${Math.max(.4, 4*cos2(p.v))}" opacity=".7"/>` : ''}<path d="M228 60 H270" stroke="#5ad48e" stroke-width="${w[3]}" opacity="${c.I > .001 ? .9 : 0}"/>
        ${disc(64, 0, '0°')}${disc(140, p.v, `${p.v}°`, p.mid)}${disc(214, 90, '90°')}<rect x="266" y="44" width="10" height="32" fill="${c.pass ? '#5ad48e' : '#666'}"/></svg>`; },
    eq(p){ const c = this.calc(p); return p.mid ? `첫 판 뒤: I₀/2 → 가운데 판 뒤: (I₀/2)·cos²${p.v}° → 마지막 판 뒤: ×cos²(90° − ${p.v}°)<br>= ⅛·sin²(2θ)·I₀ = <b class="${c.pass ? 'ok' : ''}">${(c.I*100).toFixed(1)}%</b> (10% 넘으면 열려요)` : `0°와 90° 판만 있으면 cos²90° = 0 → <b>0%</b>. 가운데 판을 끼워 봐요`; },
  },
  /* 3장 · 결정 감정 (24번 데이비슨–저머): 전자를 V로 가속 → 물질파 λ = h/p = 1.226/√V nm. 결정면 간격 d · 검출기 각 φ에서 d·sinφ = λ일 때 강하게 튄다 */
  dg:{
    make(){ return {type:'dg', phi:rnd([40, 50, 60]), d:.215, v:20}; },
    slider:p => ({label:'가속 전압 V', min:10, max:200, step:1, val:p.v, unit:' V'}),
    chips:() => null,
    lam:V => 1.226/Math.sqrt(V),
    I(p, V){ return Math.exp(-(((this.lam(V) - p.d*Math.sin(rad(p.phi)))/.008)**2)); },
    calc(p){ const I = this.I(p, p.v); return {lam:this.lam(p.v), tgt:p.d*Math.sin(rad(p.phi)), I, pass:I >= .8}; },
    solved(p){ return this.calc(p).pass; },
    view(p){ const pts = []; for (let V = 10; V <= 200; V += 2) pts.push(`${(20 + (V - 10)/190*240).toFixed(1)},${(100 - this.I(p, V)*80).toFixed(1)}`);
      const mx = 20 + (p.v - 10)/190*240, my = 100 - this.I(p, p.v)*80;
      return `<svg class="pz" viewBox="0 0 280 120"><path d="M20 100 H262 M20 100 V14" stroke="#8e98b0"/><polyline points="${pts.join(' ')}" fill="none" stroke="#7fd8ff" stroke-width="2"/>
        <circle cx="${mx}" cy="${my}" r="5" fill="#ffd166"/><text x="140" y="116" text-anchor="middle">가속 전압 V (10–200 V) → 검출기 ${p.phi}°의 전자 수</text></svg>`; },
    eq(p){ const c = this.calc(p); return `물질파 λ = h/√(2meV) = 1.226/√${p.v} = <b>${c.lam.toFixed(4)} nm</b><br>강하게 튀는 조건 d·sinφ = ${p.d}·sin${p.phi}° = <b>${c.tgt.toFixed(4)} nm</b><br>검출기 신호 <b class="${c.pass ? 'ok' : ''}">${Math.round(c.I*100)}%</b> (80% 넘으면 결정이 감정돼요)`; },
  },
  /* 4장 · 상 맺기 (20번): 램프 ─ 볼록렌즈(f) ─ 센서(90 cm). 1/a + 1/b = 1/f, 센서 글씨를 읽으려면 확대된 상(배율 b/a > 1) */
  lens:{
    make(){ return {type:'lens', f:rnd([15, 20]), L:90, v:12}; },
    slider:p => ({label:'렌즈 위치 a (램프에서)', min:5, max:85, step:.5, val:p.v, unit:' cm'}),
    chips:() => null,
    calc(p){ const a = p.v, b = a > p.f ? 1/(1/p.f - 1/a) : -1, miss = b > 0 ? Math.abs(a + b - p.L) : 99, m = b > 0 ? b/a : 0; return {a, b, miss, m, pass:miss <= 1.5 && m > 1}; },
    solved(p){ return this.calc(p).pass; },
    view(p){ const c = this.calc(p), X = cm => 14 + cm/p.L*250, blur = Math.min(26, c.miss*1.2);
      return `<svg class="pz" viewBox="0 0 280 120"><path d="M8 60 H272" stroke="#8e98b0" stroke-dasharray="4 3"/>
        <path d="M${X(0)} 60 v-16" stroke="#ffb050" stroke-width="3"/><circle cx="${X(0)}" cy="42" r="5" fill="#ffb050"/>
        <path d="M${X(c.a)} 22 q8 38 0 76 q-8 -38 0 -76" fill="rgba(168,230,255,.5)" stroke="#a8e6ff"/><text x="${X(c.a)}" y="114" text-anchor="middle">f ${p.f}</text>
        <rect x="${X(p.L) - 2}" y="20" width="5" height="80" fill="#9aa3b2"/><text x="${X(p.L)}" y="114" text-anchor="middle">센서</text>
        ${c.b > 0 && c.b < 200 ? `<path d="M${X(Math.min(c.a + c.b, p.L + 20))} 60 v${Math.min(36, 16*c.m)}" stroke="#ffb050" stroke-width="3" opacity=".8"/>` : ''}
        <ellipse cx="${X(p.L)}" cy="60" rx="3" ry="${(3 + blur).toFixed(1)}" fill="#ffb050" opacity="${c.b > 0 ? .7 : 0}"/></svg>`; },
    eq(p){ const c = this.calc(p); return c.b > 0 ? `1/a + 1/b = 1/f → b = <b>${c.b.toFixed(1)} cm</b> · 상 위치 a + b = ${(c.a + c.b).toFixed(1)} cm (센서 ${p.L} cm)<br>배율 b/a = <b>${c.m.toFixed(2)}</b>${c.miss <= 1.5 ? (c.m > 1 ? ' → <b class="ok">또렷하고 크게!</b>' : ' → 또렷하지만 작아요 (거꾸로 · 축소)') : ' → 흐려요'}` : `a ≤ f라서 실상이 안 맺혀요 (허상)`; },
  },
  /* 5장 · 이중 슬릿 (24번 · 빛): λ = 600 nm, 스크린까지 L = 2 m. 밝은 무늬 간격 Δx = λL/d → 첫 밝은 줄을 표적 x에 */
  slit:{
    make(){ return {type:'slit', xt:rnd([2.0, 2.4, 3.0]), v:.2}; },
    slider:p => ({label:'슬릿 간격 d', min:.1, max:1.5, step:.01, val:p.v, unit:' mm'}),
    chips:() => null,
    calc(p){ const dx = 600e-9*2/(p.v*1e-3)*1e3; return {dx, pass:Math.abs(dx - p.xt) <= .06}; },
    solved(p){ return this.calc(p).pass; },
    view(p){ const c = this.calc(p), S = x => 140 + x*22; let path = '';
      for (let x = -6; x <= 6.001; x += .05){ const I = cos2(180*x/c.dx)*Math.exp(-((x/9)**2)); path += `${path ? 'L' : 'M'}${S(x).toFixed(1)} ${(96 - I*70).toFixed(1)} `; }
      return `<svg class="pz" viewBox="0 0 280 120"><path d="M10 96 H270" stroke="#8e98b0"/><path d="${path}" fill="none" stroke="#7fe0ff" stroke-width="2"/>
        <path d="M${S(p.xt)} 18 V100" stroke="#ffd166" stroke-dasharray="3 3"/><text x="${S(p.xt)}" y="14" text-anchor="middle">표적 ${p.xt} mm</text><text x="140" y="114" text-anchor="middle">스크린 위치 x (mm)</text></svg>`; },
    eq(p){ const c = this.calc(p); return `밝은 무늬 간격 Δx = λL/d = (600 nm × 2 m)/${p.v.toFixed(2)} mm = <b class="${c.pass ? 'ok' : ''}">${c.dx.toFixed(2)} mm</b><br>첫 밝은 줄을 표적 ${p.xt} mm에 (±0.06) · d를 키우면 무늬가 촘촘해져요`; },
  },
};
function nmColor(l){ return l >= 620 ? '#ff5a4a' : l >= 570 ? '#ffd24a' : l >= 495 ? '#5aff7a' : l >= 450 ? '#4a8cff' : l >= 400 ? '#9a6cff' : '#c08aff'; }
function pzHtml(){
  const p = UI.pz, P = PZ[p.type], C = DG_CH[G.dgRun.ch], sl = P.slider(p), ch = P.chips(p), ok = P.solved(p);
  return `<div class="ed-head"><h3>${{photo:'광전 문', pol3:'세 장 편광판 문', dg:'결정 감정', lens:'상 맺기 자물쇠', slit:'이중 슬릿 자물쇠'}[p.type]}</h3><span>${C.unit}</span><button class="btn mini" type="button" data-act="retreat" title="퇴각 · 결정은 그대로">🏳 퇴각</button></div>
    <div class="st-grid"><div><div id="pzView">${P.view(p)}</div></div><div>
      ${ch ? `<div class="chips">${ch[0].map(c => `<button type="button" data-dz="chip" data-k="${ch[1]}" data-v="${c.v}" aria-pressed="${c.on}">${c.col ? `<i style="background:${c.col}"></i>` : ''}${c.t}</button>`).join('')}</div>` : ''}
      <label class="lk-row"><span>${sl.label}</span><b id="pzV">${sl.val}${sl.unit}</b></label>
      <input id="pzS" type="range" min="${sl.min}" max="${sl.max}" step="${sl.step}" value="${sl.val}" aria-label="${sl.label}">
      <p class="eq" id="pzEq">${P.eq(p)}</p>
      <button class="btn primary" type="button" id="pzGo" data-dz="solve" ${ok ? '' : 'disabled data-why="아직 조건이 안 맞아요 · 식을 보고 값을 바꿔 봐요"'}>${ok ? '문 열기' : '아직 안 열려요'}</button>
    </div></div>`;
}
document.addEventListener('input', ev => {
  const t = ev.target; if (!t || t.id !== 'pzS' || !UI.pz) return;
  const p = UI.pz, P = PZ[p.type]; p.v = +t.value;
  const set = (id, f) => { const e = document.getElementById(id); if (e) f(e); };
  set('pzV', e => e.textContent = `${p.v}${P.slider(p).unit}`); set('pzView', e => e.innerHTML = P.view(p)); set('pzEq', e => e.innerHTML = P.eq(p));
  const ok = P.solved(p); set('pzGo', e => { e.disabled = !ok; e.textContent = ok ? '문 열기' : '아직 안 열려요'; if (ok) e.removeAttribute('data-why'); else e.dataset.why = '아직 조건이 안 맞아요 · 식을 보고 값을 바꿔 봐요'; });
});
$('cards').addEventListener('click', ev => {
  const b = ev.target.closest('[data-dz]'); if (!b || b.disabled) return;
  const a = b.dataset.dz;
  if (a === 'enter'){ startDungeon(+b.dataset.v); return; }
  if (a === 'chip' && UI.pz){ UI.pz[b.dataset.k] = b.dataset.k === 'mid' ? !!+b.dataset.v : +b.dataset.v; renderAll(); return; }
  if (a === 'solve' && UI.pz && G.dgRun && PZ[UI.pz.type].solved(UI.pz)){
    const R = G.dgRun, g = 60 + 30*R.ch, mt = DG_CH[R.ch].metal, c = rint(2, 3); R.loot += g; G.metals[mt] = (G.metals[mt] || 0) + c;
    floatText(`+${g}G · ${METALS[mt].name} ${c}`, V(0, 2.8, DZ - 5)); UI.pz = null; closePop('dgpz'); dgOpen('퍼즐을 풀었어요! 문이 열렸어요'); return; }
});

/* ═════════ 경로 측정기 표지판 (성벽, 밤) ═════════ */
const _waveSigns11 = window.waveSigns;
window.waveSigns = function(){
  _waveSigns11();
  if (G.mode === 'wave' && !G.ride && G.research.which) sign('which', () => V(7.5, 2.4, 1.8), sgB('data-dz="which"', '🔭', `경로 측정기 ${G.which ? '켜짐' : '꺼짐'}`, G.which ? '유령이 두 줄로 · ⚡1/초' : '간섭무늬 · 눌러서 켜기', G.which ? 'go' : ''));
  else closePop('which');
};
$('cards').addEventListener('click', ev => { const b = ev.target.closest('[data-dz="which"]'); if (!b) return; G.which = !G.which; hint(G.which ? '경로 측정기 켬 · 어느 문으로 왔는지 재니까 간섭무늬가 사라져요 (상보성)' : '경로 측정기 끔 · 다시 간섭무늬로 와요'); renderAll(); });
