'use strict';
/* ═════════ 훈련소 · 연병장 3D (대형 · 병사별 무기 · 자동 출병) ═════════ */
const tScene = new THREE.Scene();
tScene.add(new THREE.HemisphereLight(0xfff1d6, 0x3a2e1c, .95));
{ const s = new THREE.DirectionalLight(0xfff4e0, .8); s.position.set(-10, 24, 14); tScene.add(s); }
const tDyn = new THREE.Group(); tScene.add(tDyn);
const T_SP = 1.9, T_LEAD = V(0, 0, -5.2);
const slotPos = (gx, gz) => V(T_LEAD.x + gx*T_SP, 0, T_LEAD.z + (gz + 1)*T_SP);
const BARRACK = {x0:8.4, x1:14.4, z0:-6, z1:6}, DUTY = {x0:-14.4, x1:-8.4, z0:-6, z1:6};
let tPicks = [], tSlotPicks = [], tDrag = null;
function tBuildStatic(){
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 60), std(0x6b5a3e, {roughness:.95})); ground.rotation.x = -Math.PI/2; tScene.add(ground);
  const field = new THREE.Mesh(new THREE.PlaneGeometry(16, 13), std(0x8a7350, {roughness:.95})); field.rotation.x = -Math.PI/2; field.position.set(0, .01, 0); tScene.add(field);
  for (const A of [BARRACK, DUTY]){ const pad = new THREE.Mesh(new THREE.PlaneGeometry(A.x1 - A.x0, A.z1 - A.z0), std(A === BARRACK ? 0x5d6a4a : 0x5a5f72, {roughness:.9})); pad.rotation.x = -Math.PI/2; pad.position.set((A.x0 + A.x1)/2, .015, (A.z0 + A.z1)/2); tScene.add(pad); if (A === BARRACK){ pad.userData.area = 'idle'; tSlotPicks.push(pad); } }
  const wood = std(0x5a3e24);
  for (let x = -18; x <= 18; x += 2){ for (const z of [-8.5, 8.5]){ const p = new THREE.Mesh(new THREE.BoxGeometry(.2, 1, .2), wood); p.position.set(x, .5, z); tScene.add(p); } }
  for (const z of [-8.5, 8.5]){ const r = new THREE.Mesh(new THREE.BoxGeometry(36, .12, .1), wood); r.position.set(0, .8, z); tScene.add(r); }
  // 깃발 = 토벌 때 주인공(대장) 자리
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(.07, .07, 3.4, 8), std(0xd8d8d8, {metalness:.6})); pole.position.set(T_LEAD.x, 1.7, T_LEAD.z); tScene.add(pole);
  const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.3, .8), new THREE.MeshStandardMaterial({color:0xff8a3d, side:THREE.DoubleSide})); flag.position.set(T_LEAD.x + .68, 3.0, T_LEAD.z); tScene.add(flag);
  const lab = (t, x, z, o = {}) => { const l = label(t, Object.assign({size:22, bold:true, h:.026}, o)); l.position.set(x, .3, z); tScene.add(l); };
  lab(['대장 자리', '토벌 때 주인공 · 자동 출병 땐 깃발'], T_LEAD.x, T_LEAD.z - 1.3, {size:18, sub:'#ffd9b8'});
  lab('↑ 적이 오는 쪽', -4.6, -7.4, {size:18, color:'#ffd9b8'});
  lab(['병영 (대기)', '여기로 끌어오면 출병 안 함'], (BARRACK.x0 + BARRACK.x1)/2, BARRACK.z0 - .4, {size:18, sub:'#cfe3b5'});
  lab(['성벽 근무', '탑을 맡은 쫄병'], (DUTY.x0 + DUTY.x1)/2, DUTY.z0 - .4, {size:18, sub:'#c9d1e3'});
  for (let gx = -3; gx <= 3; gx++) for (let gz = 0; gz <= 4; gz++){
    const p = slotPos(gx, gz), pad = new THREE.Mesh(new THREE.PlaneGeometry(T_SP*.86, T_SP*.86), new THREE.MeshBasicMaterial({color:0xfff1d6, transparent:true, opacity:.12}));
    pad.rotation.x = -Math.PI/2; pad.position.set(p.x, .03, p.z); pad.userData.slot = [gx, gz]; tScene.add(pad); tSlotPicks.push(pad);
    const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(T_SP*.86, T_SP*.86)), new THREE.LineBasicMaterial({color:0xfff1d6, transparent:true, opacity:.35})); edge.rotation.x = -Math.PI/2; edge.position.set(p.x, .035, p.z); tScene.add(edge);
  }
}
const slotTaken = (gx, gz, except) => G.soldiers.find(s => s !== except && s.role === 'sortie' && s.slot && s.slot[0] === gx && s.slot[1] === gz);
const FORMS = {
  row:{name:'횡대', o:[[0,0],[-1,0],[1,0],[-2,0],[2,0],[-3,0],[3,0],[0,1],[-1,1],[1,1],[-2,1],[2,1],[-3,1],[3,1]]},
  wedge:{name:'쐐기', o:[[0,0],[-1,1],[1,1],[-2,2],[2,2],[-3,3],[3,3],[0,2],[0,3],[-1,3],[1,3],[0,4],[-2,4],[2,4]]},
  box:{name:'방진', o:[[-1,0],[0,0],[1,0],[-1,2],[0,2],[1,2],[-1,1],[1,1],[0,1],[-2,0],[2,0],[-2,2],[2,2],[0,3]]},
  spread:{name:'산개', o:[[-3,0],[3,0],[-1,1],[1,1],[-3,2],[3,2],[0,3],[-2,4],[2,4],[0,0],[-2,1],[2,1],[0,2]]},
};
function freeSlot(){ for (const o of FORMS.row.o.concat(FORMS.wedge.o)) if (!slotTaken(o[0], o[1])) return o.slice(); for (let gz = 0; gz <= 4; gz++) for (let gx = -3; gx <= 3; gx++) if (!slotTaken(gx, gz)) return [gx, gz]; return null; }
function applyForm(k){ const squad = G.soldiers.filter(s => s.role === 'sortie'); const o = FORMS[k].o; squad.forEach((s, i) => { s.slot = (o[i] || freeSlot() || [0, 4]).slice(); }); hint(`${FORMS[k].name} 대형으로 섰어요`); tSync(); }
function tSync(){
  clearGroup(tDyn); tPicks = [];
  const idle = G.soldiers.filter(s => s.role !== 'sortie' && s.role !== 'tower'), duty = G.soldiers.filter(s => s.role === 'tower');
  const put = (s, p) => {
    const m = soldierMesh(s); m.scale.setScalar(1.25); m.position.copy(p); m.userData.sid = s.id; tDyn.add(m); tPicks.push(m);
    const hb = new THREE.Mesh(new THREE.CylinderGeometry(.8, .8, 2.2, 10), new THREE.MeshBasicMaterial({visible:false})); hb.position.y = .9; m.add(hb);
    if (s.down) m.rotation.z = Math.PI/2.4;
    const nm = label(s.name.replace('쫄병 ', '#'), {size:16, color:'#fff', bg:G.tSel === s.id ? 'rgba(255,138,61,.95)' : 'rgba(11,18,32,.8)', h:.022, bold:true}); nm.position.set(p.x, 2.1, p.z); tDyn.add(nm);
    if (G.tSel === s.id){ const r = new THREE.Mesh(new THREE.TorusGeometry(.75, .06, 8, 40), new THREE.MeshBasicMaterial({color:0xff8a3d})); r.rotation.x = -Math.PI/2; r.position.set(p.x, .06, p.z); tDyn.add(r); }
  };
  for (const s of G.soldiers.filter(q => q.role === 'sortie')){ if (!s.slot || slotTaken(s.slot[0], s.slot[1], s)) s.slot = freeSlot() || [0, 4]; put(s, slotPos(s.slot[0], s.slot[1])); }
  idle.forEach((s, i) => put(s, V(BARRACK.x0 + 1.1 + (i % 3)*1.9, 0, BARRACK.z0 + 1.6 + Math.floor(i/3)*2.1)));
  duty.forEach((s, i) => put(s, V(DUTY.x0 + 1.1 + (i % 3)*1.9, 0, DUTY.z0 + 1.6 + Math.floor(i/3)*2.1)));
  if (!G.soldiers.length){ const l = label(['아직 쫄병이 없어요', '오른쪽 창에서 모집해요'], {size:22, color:'#fff', sub:'#ffd9b8', bg:'rgba(11,18,32,.85)', h:.026}); l.position.set(0, 1.5, 0); tDyn.add(l); }
}
const tPlane = new THREE.Plane(V(0, 1, 0), 0);
/* 손가락이 조금 빗나가도 잡히게: 직접 맞히기 → 바닥에서 가장 가까운 쫄병(1.4칸 안) */
function tPick(ev){
  setRay(ev);
  for (const h of ray.intersectObjects(tPicks, true)){ let o = h.object; while (o && o.userData.sid == null) o = o.parent; if (o) return G.soldiers.find(s => s.id === o.userData.sid); }
  const p = new THREE.Vector3(); if (!ray.ray.intersectPlane(tPlane, p)) return null;
  let best = null, bd = 1.4; for (const m of tPicks){ const d = Math.hypot(m.position.x - p.x, m.position.z - p.z); if (d < bd){ bd = d; best = m; } }
  return best ? G.soldiers.find(s => s.id === best.userData.sid) : null;
}
function tSlotAt(ev){ setRay(ev); const h = ray.intersectObjects(tSlotPicks)[0]; return h ? h.object.userData : null; }
function tDown(ev){ const s = tPick(ev); tDrag = {s, sx:ev.clientX, sy:ev.clientY, moved:false, mesh:s ? tPicks.find(m => m.userData.sid === s.id) : null}; }
function tMove(ev){
  if (!tDrag || !tDrag.s || tDrag.s.role === 'tower') return;
  if (!tDrag.moved && Math.hypot(ev.clientX - tDrag.sx, ev.clientY - tDrag.sy) < 8) return;
  tDrag.moved = true; setRay(ev); const p = new THREE.Vector3(); if (ray.ray.intersectPlane(tPlane, p) && tDrag.mesh){ tDrag.mesh.position.set(p.x, .4, p.z); }
  const at = tSlotAt(ev); for (const pad of tSlotPicks) if (pad.userData.slot) pad.material.opacity = pad.userData === at ? .5 : .12;
}
function tUp(ev){
  const D = tDrag; tDrag = null; if (!D) return;
  for (const pad of tSlotPicks) if (pad.userData.slot) pad.material.opacity = .12;
  if (D.s && D.moved){
    if (D.s.role === 'tower'){ hint('탑을 맡은 쫄병은 성벽 배치에서 빼요'); tSync(); return; }
    const at = tSlotAt(ev);
    if (at && at.slot){ const other = slotTaken(at.slot[0], at.slot[1], D.s); if (other) other.slot = D.s.role === 'sortie' && D.s.slot ? D.s.slot.slice() : freeSlot(); D.s.slot = at.slot.slice(); if (D.s.role !== 'sortie'){ D.s.role = 'sortie'; hint(`${D.s.name} 토벌대 합류`); } }
    else if (at && at.area === 'idle'){ D.s.role = 'idle'; hint(`${D.s.name} 병영 대기`); }
    G.tSel = D.s.id; tSync(); renderAll(); return;
  }
  if (D.s){ G.tSel = D.s.id; tSync(); renderAll(); return; }
  const at = tSlotAt(ev), sel = G.soldiers.find(s => s.id === G.tSel);
  if (sel && sel.role !== 'tower' && at && at.slot){ const other = slotTaken(at.slot[0], at.slot[1], sel); if (other) other.slot = sel.role === 'sortie' && sel.slot ? sel.slot.slice() : freeSlot(); sel.slot = at.slot.slice(); sel.role = 'sortie'; tSync(); renderAll(); }
  else if (sel && sel.role !== 'tower' && at && at.area === 'idle'){ sel.role = 'idle'; tSync(); renderAll(); }
}
function weaponGroups(){ const g = {}; for (const it of G.inventory.filter(i => i.design.kind === 'weapon')){ (g[it.design.name] = g[it.design.name] || {d:it.design, items:[]}).items.push(it); } return Object.values(g); }
function giveWeapon(s, uid){
  if (!s) return;
  if (s.weapon){ G.inventory.push({uid:nextUid++, design:Object.assign(copy(s.weapon), {kind:'weapon'})}); s.weapon = null; }
  if (uid !== 'base'){ const it = G.inventory.find(q => q.uid === +uid); if (!it) return; G.inventory = G.inventory.filter(q => q !== it); s.weapon = copy(it.design); }
  hint(`${s.name}: ${s.weapon ? s.weapon.name : SOLDIER_GUN.name}`); tSync();
}
function trainPanel(){
  const s = G.soldiers.find(q => q.id === G.tSel), roleTxt = q => q.down ? '기절 (다음 밤 회복)' : q.role === 'sortie' ? '토벌대' : q.role === 'tower' ? `${sockName(SOCKETS[q.sock])} 조종` : '병영 대기';
  const squad = G.soldiers.filter(q => q.role === 'sortie');
  let sel = '';
  if (s){
    const gun = gunOf(s), sc = soldierScale(), acc = soldierAcc();
    sel = `<div class="sec"><div class="ed-head"><h3>${s.name}</h3><span>${roleTxt(s)}</span></div>
      <div class="bp-f">${gun.name} · ${formula(gun)}</div>
      <p class="muted">10 m에서 초당 데미지 (사격 ×${sc.toFixed(1)}, 조준 ${Math.round(acc*100)}% → 명중 ×${(.5 + .5*acc).toFixed(2)})</p>
      <div class="vs">${Object.entries(FOES).map(([id, f]) => { const r = hitD(gun, f, 10, id === 'kn' ? 90 : null, null, sc); return `<div><small>${f.short}</small><b class="${r.v ? '' : 'zero'}">${r.v ? Math.round(r.v*(.5 + .5*acc)) : r.why === 'E < W' ? 'E&lt;W' : '0'}</b></div>`; }).join('')}</div>
      <h2>무기 쥐여 주기</h2>
      <div class="chips"><button class="chip ${!s.weapon ? 'on' : ''}" type="button" data-sweap="base">${SOLDIER_GUN.name} (기본)</button>${weaponGroups().map(g => `<button class="chip" type="button" data-sweap="${g.items[0].uid}">${g.d.name} ×${g.items.length}</button>`).join('')}</div>
      <p class="muted">무기는 대장간 제작부에서 '주인공 무기' 설계로 만들어요. 쥐여 주면 창고에서 빠지고, 바꾸면 원래 무기는 창고로 돌아가요.</p>
      ${s.role === 'tower' ? '<p class="muted">탑을 맡고 있어요. 성벽 배치에서 빼면 다시 출병할 수 있어요.</p>' : `<button class="btn" type="button" data-srole="${s.id}">${s.role === 'sortie' ? '병영 대기로' : '토벌대에 넣기'}</button>`}
    </div>`;
  }
  $('panel').innerHTML = `<div class="sec"><div class="ed-head"><h3>훈련소 · 연병장</h3><span>토벌대 ${squad.length}명</span></div>
      <p class="muted">쫄병을 눌러 고르고, 끌어서 깃발 뒤 칸에 세우면 토벌 대형이 돼요. 병영으로 끌어오면 출병하지 않아요.</p>
      <div class="seg">${Object.entries(FORMS).map(([k, f]) => `<button type="button" data-form="${k}" ${squad.length ? '' : 'disabled'}>${f.name}</button>`).join('')}</div>
      <button class="btn primary" type="button" data-act="recruit" ${G.soldiers.length < soldierMax() && G.gold >= recruitCost() ? '' : 'disabled'}>${G.soldiers.length >= soldierMax() ? `병영이 꽉 찼어요 (${soldierMax()}명)` : `쫄병 모집 · ${recruitCost()}G`}</button>
    </div>
    ${sel}
    <div class="sec"><h2>자동 출병</h2><div class="seg">${[['off','끔'],['start','밤이 시작되면'],['half','적이 절반 남으면']].map(([k, t]) => `<button type="button" data-auto="${k}" aria-pressed="${G.autoSortie===k}">${t}</button>`).join('')}</div>
      <p class="muted">토벌대가 주인공 없이 알아서 나가요(밤마다 한 번). 나가 있는 동안 탑은 아군 오사 방지로 꺼지고, 절반이 쓰러지면 알아서 퇴각해요.</p>
      <div class="rows"><div class="row"><span>쫄병 조준</span><b>${Math.round(soldierAcc()*100)}%</b></div><div class="row"><span>쫄병 체력</span><b>${soldierHpMax()}</b></div><div class="row"><span>쫄병 사격 배율</span><b>×${soldierScale().toFixed(1)}</b></div></div></div>` + upgradeSec('train', '훈련 · 업그레이드');
}

/* ═════════ 태양광 발전단지 = 광전 연구소 (22번 전부) ═════════ */
const sScene = new THREE.Scene();
sScene.add(new THREE.HemisphereLight(0xeaf4ff, 0x2a3a20, 1.0));
{ const s = new THREE.DirectionalLight(0xffffff, .9); s.position.set(-8, 20, -10); sScene.add(s); }
const sDyn = new THREE.Group(); sScene.add(sDyn);
const sLab = new THREE.Group(); sScene.add(sLab);
let sPicks = [], cellTex = null;
const LAB_NAMES = {cond:'회로 조건표', A:'탐구 A · 빛의 세기', B:'탐구 B · 일함수', C:'탐구 C · 플랑크 상수', pn:'p-n 반도체 패널', sensor:'이미지 센서'};
const LAB_NMS = [300, 350, 400, 450, 500, 550, 600];
const LAB0 = V(-3.5, 0, 4.2), TUBE_D = 3.4;
let L = null; const labAns = {}, labOrder = {};
const LS = () => L || (L = {src:400, inten:50, basis:'power', metal:'na', closed:true, light:true, x:0, seen:{}, tab:'lab', msg:{}});
const labMetals = () => Object.keys(METALS).filter(k => k === 'na' || (G.metals[k] || 0) > 0 || G.panelMetal === k);
function labLines(){
  const l = LS(), m = METALS[l.metal], k = l.inten/100; if (!l.light) return [];
  if (l.src === 'sun') return sunLines(m.W, k*20);
  const E = 1240/l.src; if (E <= m.W) return [];
  return [{I:k*2*(l.basis === 'photon' ? 1 : 3.1/E), V:E - m.W, nm:l.src}];
}
const labIsat = () => labLines().reduce((s, q) => s + q.I, 0);
const labV0 = () => { const q = labLines(); return q.length ? Math.max(...q.map(z => z.V)) : 0; };
/* x = 검출판 전위 − 금속판 전위. 음수면 역전압 */
function labI(x){ const l = LS(); if (!l.closed) return 0; const q = labLines(); return x >= 0 ? q.reduce((s, z) => s + z.I, 0) : currentAt(q, -x); }
const r2 = v => Math.round(v*100)/100;
function noteSeen(){ const l = LS(); l.seen[l.light ? (l.closed ? 'onC' : 'onO') : 'off'] = true; }

/* ── 3D ── */
function liveLabel(w = 300, h = 84){
  const c = document.createElement('canvas'); c.width = w*2; c.height = h*2; const x = c.getContext('2d'), tex = new THREE.CanvasTexture(c); tex.minFilter = THREE.LinearFilter;
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({map:tex, transparent:true, depthTest:false})); sp.scale.set(w*.012, h*.012, 1); sp.renderOrder = 10; let last = '';
  sp.userData.set = (a, b, col = '#7fd3ff') => { const k = a + '|' + b + col; if (k === last) return; last = k; x.clearRect(0, 0, c.width, c.height); x.fillStyle = 'rgba(11,18,32,.88)'; x.beginPath(); if (x.roundRect) x.roundRect(0, 0, c.width, c.height, 24); else x.rect(0, 0, c.width, c.height); x.fill();
    x.textAlign = 'center'; x.fillStyle = '#e8ecf4'; x.font = '500 40px "IBM Plex Sans KR", sans-serif'; x.fillText(a, c.width/2, 64); x.fillStyle = col; x.font = '600 52px "JetBrains Mono", monospace'; x.fillText(b, c.width/2, 136); tex.needsUpdate = true; };
  return sp;
}
const labFx = {photons:[], electrons:[], spawn:0};
function sBuildStatic(){
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(90, 60), std(0x3f6b34, {roughness:.95})); ground.rotation.x = -Math.PI/2; sScene.add(ground);
  const sun = new THREE.Mesh(new THREE.SphereGeometry(2.4, 24, 16), new THREE.MeshBasicMaterial({color:0xffe08a, fog:false})); sun.position.set(-14, 9, -22); sScene.add(sun);
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  x.fillStyle = '#ffffff'; x.fillRect(0, 0, 128, 128); x.strokeStyle = '#2a3a55'; x.lineWidth = 3;
  for (let i = 0; i <= 4; i++){ x.beginPath(); x.moveTo(i*32, 0); x.lineTo(i*32, 128); x.stroke(); x.beginPath(); x.moveTo(0, i*32); x.lineTo(128, i*32); x.stroke(); }
  cellTex = new THREE.CanvasTexture(c);
  const house = new THREE.Mesh(new THREE.BoxGeometry(3.4, 2.6, 2.6), std(0xd8cdb6)); house.position.set(5.5, 1.3, -2); sScene.add(house);
  const roof = new THREE.Mesh(new THREE.ConeGeometry(2.7, 1.4, 4), std(0x8a4f2a)); roof.rotation.y = Math.PI/4; roof.position.set(5.5, 3.3, -2); sScene.add(roof);
  const l = label(['배터리실', '낮에 모은 전기를 밤에 써요'], {size:20, bold:true, sub:'#cfe3b5', h:.026}); l.position.set(5.5, .3, .9); sScene.add(l);
  // 광전관 실험대
  const g = sLab; g.position.copy(LAB0);
  const table = new THREE.Mesh(new THREE.BoxGeometry(8, .25, 3.2), std(0x7a5a3a)); table.position.y = 1; g.add(table);
  for (const [a, b] of [[-3.7, -1.4], [3.7, -1.4], [-3.7, 1.4], [3.7, 1.4]]){ const leg = new THREE.Mesh(new THREE.BoxGeometry(.2, 1, .2), std(0x5a3e24)); leg.position.set(a, .5, b); g.add(leg); }
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.1, 4.6, 32, 1, true), new THREE.MeshBasicMaterial({color:0xcfe8ff, transparent:true, opacity:.16, side:THREE.DoubleSide, depthWrite:false})); glass.rotation.z = Math.PI/2; glass.position.y = 2.3; g.add(glass);
  const plate = new THREE.Mesh(new THREE.BoxGeometry(.16, 1.5, 1.5), std(0xf2c14e, {metalness:.8, roughness:.25})); plate.position.set(-TUBE_D/2 - .08, 2.3, 0); g.add(plate); g.userData.plate = plate;
  const col = new THREE.Mesh(new THREE.BoxGeometry(.12, 1.5, 1.5), std(0x9aa3b2, {metalness:.8, roughness:.3})); col.position.set(TUBE_D/2 + .06, 2.3, 0); g.add(col);
  const wire = new THREE.Line(new THREE.BufferGeometry().setFromPoints([V(-TUBE_D/2 - .1, 1.6, 0), V(-TUBE_D/2 - .1, 1.15, 1.2), V(TUBE_D/2 + .1, 1.15, 1.2), V(TUBE_D/2 + .1, 1.6, 0)]), new THREE.LineBasicMaterial({color:0xffd166})); g.add(wire);
  const sw = new THREE.Group(); sw.position.set(.9, 1.2, 1.2); const swb = new THREE.Mesh(new THREE.BoxGeometry(.5, .12, .3), std(0x2b3346)); sw.add(swb);
  const lever = new THREE.Mesh(new THREE.BoxGeometry(.6, .06, .08), std(0xff8a3d)); lever.position.set(0, .1, 0); sw.add(lever); sw.userData.lever = lever; sw.userData.labPick = 'switch'; g.add(sw); g.userData.sw = sw;
  const swHit = new THREE.Mesh(new THREE.BoxGeometry(1.2, .8, .9), new THREE.MeshBasicMaterial({visible:false})); swHit.userData.labPick = 'switch'; sw.add(swHit);
  const lamp = new THREE.Group(); lamp.position.set(-3.1, 4.3, 0); lamp.rotation.z = .584;   // 렌즈(−y쪽)가 금속판을 보게
  lamp.add(new THREE.Mesh(new THREE.CylinderGeometry(.35, .55, .9, 20), std(0x2b3346, {metalness:.5})));
  const lens = new THREE.Mesh(new THREE.CircleGeometry(.5, 24), new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide})); lens.rotation.x = Math.PI/2; lens.position.y = -.46; lamp.add(lens); lamp.userData.lens = lens;
  const lHit = new THREE.Mesh(new THREE.SphereGeometry(.9, 8, 6), new THREE.MeshBasicMaterial({visible:false})); lHit.userData.labPick = 'lamp'; lamp.add(lHit);
  g.add(lamp); g.userData.lamp = lamp;
  const ray = new THREE.Mesh(new THREE.CylinderGeometry(.3, .7, 1.84, 20, 1, true), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:.25, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide}));
  ray.position.set(-2.34, 3.15, 0); ray.rotation.z = .584; g.add(ray); g.userData.ray = ray;
  const am = liveLabel(); am.position.set(-2.3, 5.3, -1.2); g.add(am); g.userData.am = am;
  const vm = liveLabel(); vm.position.set(2.3, 5.3, -1.2); g.add(vm); g.userData.vm = vm;
  const tl = label(['광전관 실험대', '금속판 → 광전자 → 검출판'], {size:20, bold:true, sub:'#ffe6b0', h:.024}); tl.position.set(0, .3, 2.2); g.add(tl);
  const pl = label('금속판', {size:16, h:.02}); pl.position.set(-TUBE_D/2, 1.3, -1.2); g.add(pl);
  const cl = label('검출판', {size:16, h:.02}); cl.position.set(TUBE_D/2, 1.3, -1.2); g.add(cl);
  for (let i = 0; i < 28; i++){ const p = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 6), new THREE.MeshBasicMaterial({color:0xffffff})); p.visible = false; g.add(p); labFx.photons.push({m:p, t:0, on:false});
    const e = new THREE.Mesh(new THREE.SphereGeometry(.09, 8, 6), new THREE.MeshBasicMaterial({color:0x7fd3ff})); e.visible = false; g.add(e); labFx.electrons.push({m:e, s:0, k:0, dir:1, on:false, y:0, z:0}); }
}
function nmColor(nm){ if (nm === 'sun') return '#fff3c4'; if (nm < 380) return '#c9a0ff'; const h = 270 - (nm - 380)/320*270; return `hsl(${h},90%,62%)`; }
function sSync(){
  clearGroup(sDyn); sPicks = [];
  const n = Math.min(panelsN(), 24), pc = labOk('pn') ? 0x2a4a8a : new THREE.Color(METALS[G.panelMetal].color).getHex();
  for (let i = 0; i < n; i++){
    const c = i % 6, r = Math.floor(i/6), g = new THREE.Group();
    const al = std(0xc8d0dc, {metalness:.8, roughness:.3});
    for (const sx of [-.9, .9]){ const leg = new THREE.Mesh(new THREE.CylinderGeometry(.05, .06, 1.1, 8), al); leg.position.set(sx, .55, .25); g.add(leg); const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(.05, .06, .6, 8), al); leg2.position.set(sx, .3, -.45); g.add(leg2); }
    const foot = new THREE.Mesh(new THREE.BoxGeometry(2.3, .12, 1.3), std(0x9aa0a8, {roughness:.9})); foot.position.y = .06; g.add(foot);
    const pg = new THREE.Group(); pg.position.y = 1.0; pg.rotation.x = rad(34); g.add(pg);
    const cell = new THREE.Mesh(new THREE.BoxGeometry(2.5, .06, 1.7), [al, al, new THREE.MeshStandardMaterial({map:cellTex, color:pc, roughness:.15, metalness:.5}), std(0x2b3346), al, al]); pg.add(cell);
    for (const [w, d, x, z] of [[2.62, .07, 0, .88], [2.62, .07, 0, -.88], [.07, 1.83, 1.28, 0], [.07, 1.83, -1.28, 0]]){ const f = new THREE.Mesh(new THREE.BoxGeometry(w, .1, d), al); f.position.set(x, .02, z); pg.add(f); }
    g.position.set(-14 + c*3.0, 0, -8 + r*2.8); g.userData.panel = i; shade(g); sDyn.add(g); sPicks.push(g);
  }
  const lv = clamp(G.energy/batteryCap(), 0, 1);
  const gauge = new THREE.Mesh(new THREE.CylinderGeometry(.55, .55, 3, 20, 1, true), new THREE.MeshBasicMaterial({color:0x9fb6c9, transparent:true, opacity:.3, side:THREE.DoubleSide})); gauge.position.set(8.4, 1.5, -.6); sDyn.add(gauge);
  const fill = new THREE.Mesh(new THREE.CylinderGeometry(.48, .48, 3*Math.max(.02, lv), 20), new THREE.MeshStandardMaterial({color:0x7fd3ff, emissive:0x2a90c8, emissiveIntensity:.6})); fill.position.set(8.4, 1.5*Math.max(.02, lv), -.6); sDyn.add(fill);
  const bl = label(`${Math.floor(G.energy)} / ${batteryCap()} ⚡`, {size:20, color:'#fff', bg:'rgba(11,18,32,.85)', h:.026, bold:true}); bl.position.set(8.4, 4.4, -.6); sDyn.add(bl);
  const pl = label([`${labOk('pn') ? 'p-n 반도체' : METALS[G.panelMetal].name + ' 금속판'} 패널 ${panelsN()}장`, `낮마다 +${dayCharge().toFixed(0)} ⚡`], {size:20, color:'#fff', sub:'#cfe3b5', bg:'rgba(11,18,32,.8)', h:.026}); pl.position.set(-6.5, 3.6, -10.5); sDyn.add(pl);
  syncLab();
}
function syncLab(){
  const l = LS(), g = sLab.userData, c = new THREE.Color(nmColor(l.src));
  g.plate.material.color.set(METALS[l.metal].color);
  g.ray.visible = l.light; g.ray.material.color.copy(c); g.ray.material.opacity = .08 + .3*l.inten/100;
  g.lamp.userData.lens.material.color.copy(l.light ? c : new THREE.Color(0x333333));
  g.sw.userData.lever.rotation.z = l.closed ? 0 : .7;
}
function updateLab(dt){
  const l = LS(), q = labLines(), Isat = q.reduce((s, z) => s + z.I, 0), V0 = labV0(), g = sLab.userData;
  const x = l.closed ? l.x : -V0;   // 열린 회로: 검출판에 전자가 쌓여 정지 전압만큼 역전압이 생김
  g.am.userData.set('전류계', l.closed ? `${labI(l.x).toFixed(2)} μA` : '0.00 μA', '#7fd3ff');
  g.vm.userData.set(l.closed ? '전압 (검출판 − 금속판)' : '회로 열림 · 전압계', `${(l.closed ? l.x : -V0).toFixed(2)} V`, l.closed ? '#ffd166' : '#ff8a3d');
  const color = new THREE.Color(nmColor(l.src));
  if (l.light){ labFx.spawn += dt*(4 + 10*l.inten/100);
    while (labFx.spawn >= 1){ labFx.spawn--; const p = labFx.photons.find(z => !z.on); if (p){ p.on = true; p.t = 0; p.y = (Math.random() - .5)*1.1; p.z = (Math.random() - .5)*1.1; p.m.material.color.copy(color); p.m.visible = true; } } }
  const lampPos = V(-2.85, 3.92, 0), tot = q.length ? Isat : 0;
  for (const p of labFx.photons){ if (!p.on) continue; p.t += dt*2.2; const to = V(-TUBE_D/2, 2.3 + p.y, p.z); p.m.position.lerpVectors(lampPos, to, Math.min(1, p.t));
    if (p.t >= 1){ p.on = false; p.m.visible = false;
      if (q.length && Math.random() < .85){ const e = labFx.electrons.find(z => !z.on); if (e){ let r = Math.random()*tot, line = q[0]; for (const z of q){ if ((r -= z.I) <= 0){ line = z; break; } } e.on = true; e.s = 0; e.k = line.V; e.dir = 1; e.y = p.y; e.z = p.z; e.m.visible = true; } } } }
  for (const e of labFx.electrons){ if (!e.on) continue;
    const ke = e.k + x*e.s/TUBE_D, sp = 1.2 + 2.2*Math.sqrt(Math.max(0, ke));
    if (e.dir > 0 && ke <= .005){ e.dir = -1; }
    e.s += e.dir*Math.max(.6, sp)*dt;
    if (e.s >= TUBE_D || e.s < 0){ e.on = false; e.m.visible = false; continue; }
    e.m.position.set(-TUBE_D/2 + e.s, 2.3 + e.y, e.z); }
}
function sTap(ev){
  setRay(ev); const picks = []; sLab.traverse(o => { if (o.userData.labPick) picks.push(o); });
  const h = ray.intersectObjects(picks, false)[0];
  if (h){ const l = LS(); if (h.object.userData.labPick === 'switch'){ l.closed = !l.closed; hint(l.closed ? '회로 연결' : '회로 열림 · 전압계만 연결'); } else { l.light = !l.light; hint(l.light ? '빛 켬' : '빛 끔'); } noteSeen(); syncLab(); solarPanel(); return; }
  const h2 = ray.intersectObjects(sPicks, true)[0]; if (h2) hint(labOk('pn') ? 'p-n 태양전지: 빛을 흡수하면 전자–양공 쌍이 생기고, 접합부 전기장이 전자는 n형, 양공은 p형으로 보내요' : `${METALS[G.panelMetal].name} 금속판 패널: 햇빛의 광자가 전자를 떼어 내고, 검출판에 모인 전자가 배터리로 흘러요`);
}

/* ── 연구 (실험 + 빈칸 문제) ── */
function recsOf(f){ return (G.lab.recs || []).filter(f); }
const LABS = [
  {id:'cond', unit:'22번 2 · 3 태양전지 조건표', reward:'충전 전압 다이얼 (발전 탭)', need:() => { const s = LS().seen; return s.onC && s.onO && s.off; }, needTxt:'실험대에서 빛 켜기/끄기 · 회로 연결/열기를 바꿔 세 가지 상태(빛+연결, 빛+열림, 빛 없음)를 다 확인하세요. 3D 실험대의 스위치와 램프를 눌러도 돼요.',
    qs:[{q:'빛 있음 · 회로 연결', opts:['외부 전류가 흐른다', '전압만 생긴다 (정지 전압만큼)', '아무것도 없다'], a:0}, {q:'빛 있음 · 회로 열림', opts:['외부 전류가 흐른다', '전압만 생긴다 (정지 전압만큼)', '아무것도 없다'], a:1}, {q:'빛 없음', opts:['외부 전류가 흐른다', '전압만 생긴다 (정지 전압만큼)', '아무것도 없다'], a:2}]},
  {id:'A', req:'cond', unit:'22번 4 · 탐구 A', reward:'패널 추가 업그레이드', need:() => { const r = recsOf(q => q.inten === 25), s = recsOf(q => q.inten === 75); return r.some(a => s.some(b => b.metal === a.metal && b.src === a.src && b.basis === a.basis)); },
    needTxt:'금속과 빛은 그대로 두고 세기만 25%, 75%로 바꿔서 각각 정지 전압을 찾아 기록하세요. (나트륨 · 400 nm · 광출력 기준 추천)',
    qs:[{q:'포화 전류의 비 (75% ÷ 25%)', num:3, tol:.06}, {q:'세기를 25% → 75%로 바꾸면 정지 전압은?', opts:['그대로', '커진다', '작아진다'], a:0}, {q:'세기가 커져도 달라지지 않는 물리량', opts:['광자 한 개의 에너지 (= 광전자의 최대 운동 에너지)', '단위 시간당 광자 수', '포화 전류'], a:0}]},
  {id:'B', req:'A', unit:'22번 4 · 탐구 B', perMetal:true, reward:'그 금속으로 패널 도금', need:m => [350, 400].every(nm => recsOf(q => q.metal === m && q.src === nm).length),
    needTxt:'측정할 금속을 고르고, 350 nm와 400 nm에서 각각 정지 전압을 찾아 기록하세요. "입사 광자 수" 기준으로 두면 포화 전류가 같아져요.',
    qs:m => [{q:`${METALS[m].name}의 일함수 W (eV, 소수 둘째 자리)`, num:METALS[m].W, tol:.03}, {q:'광자 수 기준에서 진동수가 높아지면 포화 전류는?', opts:['그대로', '커진다', '작아진다'], a:0}]},
  {id:'C', req:'B', unit:'22번 4 · 탐구 C', reward:'배터리 업그레이드', need:() => { const by = {}; for (const r of G.lab.recs || []) if (r.src !== 'sun') (by[r.metal] = by[r.metal] || new Set()).add(r.src); return Object.values(by).some(s => s.size >= 3); },
    needTxt:'한 금속으로 파장을 세 가지 이상 바꿔 가며 정지 전압을 기록하세요. 아래 V₀–f 그래프에 점이 찍히고 추세선이 그려져요.',
    qs:[{q:'추세선 기울기로 구한 플랑크 상수 h (×10⁻¹⁵ eV·s)', num:4.14, tol:.12}, {q:'금속판을 다른 금속(예: Cs)으로 바꾸면?', opts:['기울기는 같고 절편(일함수)이 바뀐다', '기울기가 바뀐다', '기울기와 절편이 모두 그대로'], a:0}]},
  {id:'pn', req:'C', cost:300, unit:'22번 5 · 광다이오드 · 태양전지', reward:'모든 패널을 p-n 반도체로 교체 (효율 크게 상승)', need:() => true, needTxt:'',
    qs:[{q:'광다이오드가 빛을 흡수하면 반도체 안에 생기는 것', opts:['전자–양공 쌍', '양성자–중성자 쌍', '광자 쌍'], a:0}, {q:'접합부 전기장은 전자를 ( )형으로 보낸다', opts:['n', 'p', '어느 쪽으로도 안 보냄'], a:0}, {q:'태양전지의 에너지 전환', opts:['빛에너지 → 전기에너지', '전기에너지 → 빛에너지', '열에너지 → 빛에너지'], a:0}]},
  {id:'sensor', req:'pn', cost:200, unit:'22번 5 · 이미지 센서', reward:'자동 조준 절전 업그레이드 (적을 카메라로 봐요)', need:() => true, needTxt:'',
    qs:[{q:'이미지 센서에서 화소 역할을 하는 것', opts:['광다이오드', '편광판', '볼록 렌즈'], a:0}, {q:'빛의 세기 정보는 무엇으로 얻나요?', opts:['광전 효과로 튀어나온 전자의 수', '전자 한 개의 속도', '광자의 편광 방향'], a:0}, {q:'색은 어떻게 구분하나요?', opts:['컬러 필터를 통과한 빛의 양을 재서', '전자의 색을 봐서', '렌즈 초점 거리를 바꿔서'], a:0}, {q:'CCD와 CMOS의 공통점', opts:['빛에너지를 전기에너지로 바꾼다', '전기에너지를 빛에너지로 바꾼다', '빛을 증폭해서 레이저를 만든다'], a:0}]},
];
const labDone = (id, m) => id === 'B' ? !!G.lab['B_' + m] : !!G.lab[id];
function shuffled(key, n){ if (!labOrder[key]){ const o = [...Array(n).keys()]; for (let i = n - 1; i > 0; i--){ const j = Math.floor(Math.random()*(i + 1)); [o[i], o[j]] = [o[j], o[i]]; } labOrder[key] = o; } return labOrder[key]; }
function labCard(R){
  const m = LS().metal, done = labDone(R.id, m), locked = R.req && !labOk(R.req), title = R.perMetal ? `${LAB_NAMES[R.id]} (${METALS[m].name})` : LAB_NAMES[R.id];
  const qs = typeof R.qs === 'function' ? R.qs(m) : R.qs, key = R.id + (R.perMetal ? m : '');
  let body = '';
  if (done) body = `<p>완료 · ${R.reward}</p>`;
  else if (locked) body = `<p>먼저: ${LAB_NAMES[R.req]}</p>`;
  else {
    const ready = R.need(m);
    body = `${R.needTxt ? `<p>${ready ? '✓ ' : ''}${R.needTxt}</p>` : ''}${ready ? qs.map((q, i) => { const k = `${key}:${i}`;
      if (q.num != null) return `<div class="lq"><span>${i + 1}. ${q.q}</span><input type="number" inputmode="decimal" step="0.01" data-labnum="${k}" value="${labAns[k] ?? ''}"></div>`;
      return `<div class="lq"><span>${i + 1}. ${q.q}</span>${shuffled(k, q.opts.length).map(j => `<button type="button" class="opt ${labAns[k] === j ? 'on' : ''}" data-labopt="${k}:${j}">${q.opts[j]}</button>`).join('')}</div>`; }).join('') +
      `<button class="btn primary" type="button" data-labsubmit="${R.id}" ${R.cost && G.gold < R.cost ? 'disabled' : ''}>${R.cost ? `제출 · ${R.cost}G` : '제출'}</button>${LS().msg[key] ? `<p class="warn">${LS().msg[key]}</p>` : ''}` : ''}<p class="muted" style="color:#bfe0ff">해금: ${R.reward}</p>`;
  }
  return `<div class="bpcard labcard ${done ? 'done' : ''}"><div class="bph"><b>${title}</b><span>${done ? '완료' : R.unit}</span></div>${body}</div>`;
}
function submitLab(id){
  const R = LABS.find(r => r.id === id), m = LS().metal, qs = typeof R.qs === 'function' ? R.qs(m) : R.qs, key = R.id + (R.perMetal ? m : '');
  if (!R.need(m) || labDone(id, m) || (R.cost && G.gold < R.cost)) return;
  const wrong = qs.map((q, i) => { const v = labAns[`${key}:${i}`]; return q.num != null ? !(v !== undefined && v !== '' && Math.abs(+v - q.num) <= q.tol) : v !== q.a; }).map((w, i) => w ? i + 1 : 0).filter(Boolean);
  if (wrong.length){ LS().msg[key] = `${wrong.join(', ')}번이 틀렸어요. 실험대에서 다시 재 보세요.`; solarPanel(); return; }
  LS().msg[key] = '';
  if (R.cost) G.gold -= R.cost;
  if (id === 'B'){ G.lab['B_' + m] = true; G.lab.B = true; } else G.lab[id] = true;
  if (id === 'cond') G.chargeU = .3;
  hint(`${LAB_NAMES[id]} 완료! ${R.reward}`); sSync(); renderAll();
}
function recordV0(){
  const l = LS();
  if (!l.light || !l.closed){ hint('빛을 켜고 회로를 연결해야 전류를 잴 수 있어요'); return; }
  const V0 = labV0(); if (!V0){ hint(`전자가 안 나와요 · 광자 에너지가 일함수 ${METALS[l.metal].W} eV보다 작아요`); return; }
  if (Math.abs(-l.x - V0) > .021){ hint(`전류가 막 0이 되는 전압을 찾아요 · 지금 I = ${labI(l.x).toFixed(2)} μA`); return; }
  const rec = {metal:l.metal, src:l.src, inten:l.inten, basis:l.basis, V0:r2(V0), Isat:r2(labIsat())};
  G.lab.recs = (G.lab.recs || []).filter(r => !(r.metal === rec.metal && r.src === rec.src && r.inten === rec.inten && r.basis === rec.basis)).concat(rec).slice(-24);
  hint(`기록: 정지 전압 ${rec.V0.toFixed(2)} V · 포화 전류 ${rec.Isat.toFixed(2)} μA`); solarPanel();
}
/* ── 그래프 ── */
function drawIV(cv){
  if (!cv) return; const {g, w, h} = plotSetup(cv), pad = {l:34, r:8, t:12, b:20}, x0 = -3.5, x1 = 2;
  const xs = x => pad.l + (x - x0)/(x1 - x0)*(w - pad.l - pad.r), top = Math.max(.5, labIsat()*1.15), ys = I => h - pad.b - I/top*(h - pad.t - pad.b);
  g.strokeStyle = '#26324d'; g.beginPath(); g.moveTo(pad.l, pad.t); g.lineTo(pad.l, h - pad.b); g.lineTo(w - pad.r, h - pad.b); g.stroke();
  g.beginPath(); g.moveTo(xs(0), pad.t); g.lineTo(xs(0), h - pad.b); g.stroke();
  const l = LS(); if (l.closed && l.light){ g.strokeStyle = nmColor(l.src); g.lineWidth = 2.5; g.beginPath(); for (let i = 0; i <= 220; i++){ const x = x0 + (x1 - x0)*i/220, y = ys(labI(x)); i ? g.lineTo(xs(x), y) : g.moveTo(xs(x), y); } g.stroke(); g.lineWidth = 1; }
  const V0 = labV0(); if (V0){ g.strokeStyle = '#ff6474'; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(xs(-V0), pad.t); g.lineTo(xs(-V0), h - pad.b); g.stroke(); g.setLineDash([]); }
  g.fillStyle = '#ffd166'; g.beginPath(); g.arc(xs(l.x), ys(labI(l.x)), 4.5, 0, Math.PI*2); g.fill();
  g.fillStyle = '#8e98b0'; g.font = '10px "JetBrains Mono", monospace'; g.textAlign = 'center';
  for (const x of [-3, -2, -1, 0, 1, 2]) g.fillText(`${x}V`, xs(x), h - 5);
  g.textAlign = 'left'; g.fillText('광전류 (μA)', pad.l + 4, pad.t + 8);
}
function drawV0f(cv){
  if (!cv) return; const {g, w, h} = plotSetup(cv), pad = {l:30, r:8, t:12, b:20}, f0 = 4, f1 = 11, xs = f => pad.l + (f - f0)/(f1 - f0)*(w - pad.l - pad.r), ys = v => h - pad.b - (v + 3)/6*(h - pad.t - pad.b);
  g.strokeStyle = '#26324d'; g.beginPath(); g.moveTo(pad.l, pad.t); g.lineTo(pad.l, h - pad.b); g.lineTo(w - pad.r, h - pad.b); g.stroke(); g.beginPath(); g.moveTo(pad.l, ys(0)); g.lineTo(w - pad.r, ys(0)); g.stroke();
  const by = {}; for (const r of G.lab.recs || []) if (r.src !== 'sun') (by[r.metal] = by[r.metal] || {}) [r.src] = r.V0;
  for (const [mt, pts] of Object.entries(by)){
    const P = Object.entries(pts).map(([nm, v]) => [3e17/+nm/1e14, v]); g.fillStyle = METALS[mt].color; g.strokeStyle = METALS[mt].color;
    for (const [f, v] of P){ g.beginPath(); g.arc(xs(f), ys(v), 4, 0, Math.PI*2); g.fill(); }
    if (P.length >= 2){ const n = P.length, sx = P.reduce((s, p) => s + p[0], 0), sy = P.reduce((s, p) => s + p[1], 0), sxx = P.reduce((s, p) => s + p[0]*p[0], 0), sxy = P.reduce((s, p) => s + p[0]*p[1], 0), k = (n*sxy - sx*sy)/(n*sxx - sx*sx), b = (sy - k*sx)/n;
      g.setLineDash([5, 3]); g.beginPath(); g.moveTo(xs(f0), ys(k*f0 + b)); g.lineTo(xs(f1), ys(k*f1 + b)); g.stroke(); g.setLineDash([]);
      g.font = '10px "JetBrains Mono", monospace'; g.textAlign = 'left'; g.fillText(`${METALS[mt].name}: V₀ = ${k.toFixed(3)}·f(×10¹⁴) ${b < 0 ? '−' : '+'} ${Math.abs(b).toFixed(2)}`, pad.l + 4, pad.t + 10 + 12*Object.keys(by).indexOf(mt)); } }
  g.fillStyle = '#8e98b0'; g.font = '10px "JetBrains Mono", monospace'; g.textAlign = 'center'; for (const f of [4, 6, 8, 10]) g.fillText(`${f}`, xs(f), h - 5);
  g.textAlign = 'right'; g.fillText('f (×10¹⁴ Hz)', w - pad.r, h - pad.b - 4);
}
function drawPU(cv){
  if (!cv) return; const {g, w, h} = plotSetup(cv), pad = {l:30, r:8, t:12, b:20}, mt = G.panelMetal, V0 = METALS[mt].W ? 1240/300 - METALS[mt].W : 2, x1 = Math.max(.5, V0);
  const pts = []; let mx = 0; for (let i = 0; i <= 160; i++){ const U = x1*i/160, p = panelPower(mt, U); pts.push([U, p]); mx = Math.max(mx, p); }
  const xs = U => pad.l + U/x1*(w - pad.l - pad.r), ys = p => h - pad.b - p/Math.max(1, mx)*(h - pad.t - pad.b);
  g.strokeStyle = '#26324d'; g.beginPath(); g.moveTo(pad.l, pad.t); g.lineTo(pad.l, h - pad.b); g.lineTo(w - pad.r, h - pad.b); g.stroke();
  g.strokeStyle = '#ffd166'; g.lineWidth = 2; g.beginPath(); pts.forEach(([U, p], i) => i ? g.lineTo(xs(U), ys(p)) : g.moveTo(xs(U), ys(p))); g.stroke(); g.lineWidth = 1;
  const cur = panelPower(mt, G.chargeU); g.fillStyle = '#ff8a3d'; g.beginPath(); g.arc(xs(G.chargeU), ys(cur), 4.5, 0, Math.PI*2); g.fill();
  g.fillStyle = '#8e98b0'; g.font = '10px "JetBrains Mono", monospace'; g.textAlign = 'center'; for (let U = 0; U <= x1 + 1e-9; U += .5) g.fillText(`${U.toFixed(1)}V`, xs(U), h - 5);
  g.textAlign = 'left'; g.fillText('패널 1장 하루 충전 (전력 = U × I)', pad.l + 4, pad.t + 8);
}
/* ── 창 ── */
function solarPanel(){
  const l = LS(), tab = l.tab, seg = `<div class="sec"><div class="ed-head"><h3>발전단지 · 광전 연구소</h3><span>22번</span></div><div class="seg">${[['power','발전'],['lab','실험대'],['study','연구']].map(([k, t]) => `<button type="button" data-ltab="${k}" aria-pressed="${tab===k}">${t}</button>`).join('')}</div></div>`;
  let h = '';
  if (tab === 'power'){
    const pn = labOk('pn'), bu = bestU();
    h = `<div class="sec"><div class="rows">
        <div class="row"><span>패널</span><b>${pn ? 'p-n 반도체' : METALS[G.panelMetal].name + ' 금속판 (W ' + METALS[G.panelMetal].W + ' eV)'} · ${panelsN()}장</b></div>
        <div class="row"><span>낮 동안 충전 (밤이 끝날 때)</span><b>+${dayCharge().toFixed(0)} ⚡</b></div>
        <div class="row"><span>배터리</span><b>${Math.floor(G.energy)} / ${batteryCap()} ⚡</b></div></div>
      <div class="eq">${pn ? 'p-n 태양전지: 빛을 흡수하면 반도체 안에 전자–양공 쌍이 생기고, 접합부 전기장이 전자는 n형, 양공은 p형으로 보내 전압과 전류를 만들어요. 금속판보다 빛을 훨씬 많이 전기로 바꿔요.' : `금속판 패널 = 광전관: 햇빛 광자가 금속판에서 전자를 떼어 내고, 전자가 검출판에 모여 배터리로 흘러요. 배터리 전압 U가 역전압 역할을 해서, 정지 전압이 U보다 큰 전자만 넘어가요.<br>밤엔 빛이 없어서 아무것도 안 생겨요 → 낮에 모아 밤에 써요.`}</div>
      ${!pn && labOk('cond') ? `<div class="range"><label for="chgU">충전 전압 U <b>${G.chargeU.toFixed(2)} V</b></label><input id="chgU" type="range" min="0" max="${(1240/300 - METALS[G.panelMetal].W).toFixed(2)}" step="0.01" value="${G.chargeU}"></div>
        <canvas id="puPlot" class="spec" aria-label="충전 전압과 전력"></canvas><p class="muted">U가 너무 낮으면 전류는 많아도 전압이 작고, 너무 높으면 넘어오는 전자가 줄어요. 전력 = U × I가 최대인 곳을 찾아요. ${G.lab.A ? `(최대 약 ${bu.U.toFixed(2)} V)` : ''}</p>` : !pn ? '<p class="muted">충전 전압은 0.3 V로 고정이에요. 연구 탭의 "회로 조건표"를 끝내면 직접 조절해요.</p>' : ''}
    </div>
    ${pn ? '' : `<div class="sec"><h2>패널 금속 · 적이 떨어뜨린 조각으로 도금</h2><div class="rows">${['na', 'cs', 'ag'].map(k => { const M = METALS[k], have = G.metals[k] || 0, on = G.panelMetal === k, meas = k === 'na' || G.lab['B_' + k];
      return `<div class="row"><span><b style="color:var(--ink);font-family:var(--f-body)">${M.name}</b> W ${M.W} eV · 조각 ${have}개<br>${on ? '사용 중' : !meas ? '연구 탭 탐구 B로 일함수를 먼저 재요' : `도금에 조각 ${M.need}개 · 하루 ${(panelsN()*panelPower(k)).toFixed(0)} ⚡ 예상`}</span>${on ? '<b>사용 중</b>' : `<button class="btn" type="button" data-plate="${k}" ${meas && have >= M.need ? '' : 'disabled'}>도금</button>`}</div>`; }).join('')}
      <div class="row"><span>칼슘 조각 (W 2.9 · 실험용)</span><b>${G.metals.ca || 0}개</b></div></div>
      <p class="muted">일함수가 작은 금속일수록 햇빛의 더 많은 광자가 전자를 떼어 내고, 정지 전압도 커서 발전이 잘 돼요. 제일 약한 젤리(산화세슘)가 제일 좋은 패널 재료예요!</p></div>`}` + upgradeSec('solar', '발전단지 업그레이드');
  } else if (tab === 'lab'){
    const V0 = labV0(), E = l.src === 'sun' ? null : 1240/l.src;
    h = `<div class="sec">
      <h2>빛</h2><div class="seg"><button type="button" data-lsrc="sun" aria-pressed="${l.src==='sun'}">햇빛</button>${LAB_NMS.map(nm => `<button type="button" data-lsrc="${nm}" aria-pressed="${l.src===nm}"><i style="background:${nmColor(nm)}"></i>${nm}</button>`).join('')}</div>
      <div class="range"><label for="labInt">빛의 세기 <b>${l.inten}%</b></label><input id="labInt" type="range" min="25" max="100" step="25" value="${l.inten}"></div>
      ${l.src === 'sun' ? '' : `<div class="seg"><button type="button" data-lbasis="power" aria-pressed="${l.basis==='power'}">광출력 기준</button><button type="button" data-lbasis="photon" aria-pressed="${l.basis==='photon'}">입사 광자 수 기준</button></div>`}
      <h2>금속판</h2><div class="seg">${labMetals().map(k => `<button type="button" data-lmetal="${k}" aria-pressed="${l.metal===k}"><i style="background:${METALS[k].color}"></i>${METALS[k].name}</button>`).join('')}</div>
      <p class="muted">${labMetals().length < 4 ? '적이 떨어뜨린 금속 조각이 있으면 그 금속도 실험할 수 있어요.' : ''}</p>
      <div class="seg"><button type="button" data-lact="light" aria-pressed="${l.light}">${l.light ? '빛 켜짐' : '빛 꺼짐'}</button><button type="button" data-lact="circuit" aria-pressed="${l.closed}">${l.closed ? '회로 연결' : '회로 열림'}</button></div>
    </div>
    <div class="sec"><h2>전압 = 검출판 전위 − 금속판 전위</h2>
      <div class="range"><label for="labX">전압 <b id="labXv">${l.x.toFixed(2)} V</b></label><input id="labX" type="range" min="-3.5" max="2" step="0.01" value="${l.x}" ${l.closed ? '' : 'disabled'}></div>
      <div class="fine">${[-.1, -.01, .01, .1].map(s => `<button type="button" data-lx="${s}">${s > 0 ? '+' : '−'}${Math.abs(s)}</button>`).join('')}<button type="button" data-lx="zero">0</button><button type="button" data-lact="rec">기록</button></div>
      <div class="eq" id="labLive"></div>
      <canvas id="ivPlot" class="spec tall" aria-label="광전류-전압 그래프"></canvas>
      <p class="muted">전압을 음(−)으로 내려서 전류가 막 0이 되는 곳이 정지 전압이에요. 거기서 "기록"을 누르면 아래 표에 남아요.</p></div>
    <div class="sec"><h2>기록</h2>${(G.lab.recs || []).length ? `<div class="rows">${G.lab.recs.slice().reverse().map(r => `<div class="row"><span>${METALS[r.metal].name} · ${r.src === 'sun' ? '햇빛' : r.src + ' nm'} · ${r.inten}%${r.src === 'sun' ? '' : r.basis === 'photon' ? ' · 광자 수' : ' · 광출력'}</span><b>V₀ ${r.V0.toFixed(2)} V · ${r.Isat.toFixed(2)} μA</b></div>`).join('')}</div>` : '<p class="muted">아직 없어요.</p>'}</div>`;
  } else {
    h = `<div class="sec">${LABS.map(labCard).join('')}
      <h2>V₀ – 진동수 그래프 (탐구 C)</h2><canvas id="v0fPlot" class="spec tall" aria-label="정지 전압과 진동수 그래프"></canvas>
      <p class="muted">eV₀ = hf − W → 기울기 = h/e, 절편 = −W/e. 진동수 f = c/λ.</p></div>`;
  }
  $('panel').innerHTML = seg + h;
  if (tab === 'lab'){ labLive(); drawIV($('ivPlot')); }
  if (tab === 'power') drawPU($('puPlot'));
  if (tab === 'study') drawV0f($('v0fPlot'));
}
function labLive(){
  const el = $('labLive'); if (!el) return; const l = LS(), V0 = labV0(), E = l.src === 'sun' ? null : 1240/l.src;
  el.innerHTML = `${E ? `광자 에너지 E = 1240 / ${l.src} = <b>${E.toFixed(2)} eV</b>` : '햇빛: 여러 파장이 섞인 빛'} · 일함수 W = ${METALS[l.metal].W} eV<br>` +
    (!l.light ? '빛이 꺼져 있어요 → 전류도 전압도 없어요' : !l.closed ? `회로가 열려 있어요 → 전류는 0, 검출판에 전자가 쌓여서 전압계는 정지 전압 <b>${V0.toFixed(2)} V</b>를 가리켜요` :
     !V0 ? '<span class="warn">E &lt; W → 광전자가 안 나와요. 세기를 올려도 그대로예요.</span>' : `광전류 I = <b>${labI(l.x).toFixed(2)} μA</b> · 포화 전류 ${labIsat().toFixed(2)} μA`);
  const xv = $('labXv'); if (xv) xv.textContent = `${l.x.toFixed(2)} V`;
}
document.addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b || G.mode !== 'solar') return; const d = b.dataset, l = LS();
  if (d.ltab){ l.tab = d.ltab; solarPanel(); return; }
  if (d.lsrc){ l.src = d.lsrc === 'sun' ? 'sun' : +d.lsrc; syncLab(); solarPanel(); return; }
  if (d.lbasis){ l.basis = d.lbasis; solarPanel(); return; }
  if (d.lmetal){ l.metal = d.lmetal; syncLab(); solarPanel(); return; }
  if (d.lact === 'light'){ l.light = !l.light; noteSeen(); syncLab(); solarPanel(); return; }
  if (d.lact === 'circuit'){ l.closed = !l.closed; noteSeen(); syncLab(); solarPanel(); return; }
  if (d.lact === 'rec'){ recordV0(); return; }
  if (d.lx){ l.x = d.lx === 'zero' ? 0 : clamp(r2(l.x + +d.lx), -3.5, 2); const s = $('labX'); if (s) s.value = l.x; labLive(); drawIV($('ivPlot')); return; }
  if (d.labopt){ const i = d.labopt.lastIndexOf(':'); labAns[d.labopt.slice(0, i)] = +d.labopt.slice(i + 1); solarPanel(); return; }
  if (d.labsubmit){ submitLab(d.labsubmit); return; }
  if (d.plate){ const k = d.plate, M = METALS[k]; if (!(k === 'na' || G.lab['B_' + k]) || (G.metals[k] || 0) < M.need) return; G.metals[k] -= M.need; G.panelMetal = k; if (labOk('cond')) G.chargeU = Math.min(G.chargeU, 1240/300 - M.W); hint(`${M.name} 도금 완료 · 하루 +${dayCharge().toFixed(0)} ⚡`); sSync(); renderAll(); return; }
});
document.addEventListener('input', ev => {
  if (G.mode !== 'solar') return; const t = ev.target, l = LS();
  if (t.id === 'labX'){ l.x = +t.value; labLive(); drawIV($('ivPlot')); }
  else if (t.id === 'labInt'){ l.inten = +t.value; syncLab(); solarPanel(); }
  else if (t.id === 'chgU'){ G.chargeU = +t.value; const lb = t.previousElementSibling.querySelector('b'); if (lb) lb.textContent = `${G.chargeU.toFixed(2)} V`; drawPU($('puPlot')); const r = document.querySelector('.rows .row:nth-child(2) b'); if (r) r.textContent = `+${dayCharge().toFixed(0)} ⚡`; }
  else if (t.dataset.labnum){ labAns[t.dataset.labnum] = t.value; }
});
document.addEventListener('change', ev => { if (G.mode === 'solar' && ev.target.id === 'chgU'){ sSync(); saveGame(); } });

/* ═════════ 캐릭터 꾸미기 (3D 회전대 · 얼굴 사진) ═════════ */
const dScene = new THREE.Scene();
dScene.add(new THREE.HemisphereLight(0xfff4e6, 0x3a2e4a, 1.0));
{ const s = new THREE.DirectionalLight(0xffffff, .9); s.position.set(-4, 8, -6); dScene.add(s); const r = new THREE.DirectionalLight(0xffc89a, .5); r.position.set(5, 4, 6); dScene.add(r); }
const dHero = new THREE.Group(); dHero.scale.setScalar(2.4); dScene.add(dHero);
let dSpin = 0, dDrag = null;
function dBuildStatic(){
  const disc = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.4, .3, 48), smooth(0x2b3346, {metalness:.3})); disc.position.y = -.15; dScene.add(disc);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.25, .05, 8, 64), basic(0xff8a3d)); ring.rotation.x = Math.PI/2; ring.position.y = .01; dScene.add(ring);
  dScene.background = canvasTex(512, 512, (x, w, h) => { const g = x.createRadialGradient(w/2, h*.45, 30, w/2, h/2, w*.7); g.addColorStop(0, '#3a3f66'); g.addColorStop(1, '#0d1122'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
}
const SW = {
  hair:['#9a5a2e', '#3b2416', '#111111', '#e0b25a', '#c94a2a', '#e9e3d6', '#6a8cff', '#ff8ab8'],
  hood:['#ff8a3d', '#4f6690', '#2f9e6a', '#c9542a', '#8a5cd6', '#e9e3d6', '#2b3346', '#ffd166'],
  eye:['#ffb020', '#3a6bd6', '#3d8a4a', '#6b3f1f', '#9b59d0', '#d03a3a'],
  skin:['#f6dcc4', '#f1d2b6', '#e0b48e', '#c48a5e', '#8d5a3b', '#5c3a24'],
};
const STYLES = [['pony', '로우 포니테일'], ['bob', '단발'], ['long', '긴 머리'], ['short', '짧은 머리'], ['twin', '양갈래']];
function dressSync(){ G.look = Object.assign({}, LOOK_DEFAULT, G.look || {}); buildHeroInto(dHero); buildHero(); saveGame(); }
function dressPanel(){
  const L = lookOf(), sw = (k, list) => `<div class="sws">${list.map(c => `<button type="button" class="sw ${L[k] === c ? 'on' : ''}" data-look="${k}:${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}</div>`;
  $('panel').innerHTML = `<div class="sec"><div class="ed-head"><h3>캐릭터 꾸미기</h3><button class="rm" type="button" data-act="toMap" style="color:var(--ink)">지도</button></div>
      <p class="muted">화면을 끌면 캐릭터가 돌아가요. 성벽 · 토벌에 나가는 주인공에 바로 적용돼요.</p></div>
    <div class="sec"><h2>얼굴</h2>
      <div class="seg"><button type="button" data-face="0" aria-pressed="${!L.face}">기본 얼굴</button><button type="button" data-face="1" aria-pressed="${!!L.face}" ${faceImg ? '' : 'disabled'}>사진 얼굴</button></div>
      <label class="btn primary filebtn" for="faceFile">사진 고르기</label><input id="faceFile" type="file" accept="image/*" hidden>
      ${L.face && faceImg ? `<div class="range"><label for="fz">확대 <b>${L.fz.toFixed(2)}×</b></label><input id="fz" type="range" min=".6" max="2.4" step=".02" value="${L.fz}"></div>
      <div class="range"><label for="fx">좌우 <b>${L.fx.toFixed(2)}</b></label><input id="fx" type="range" min="-1" max="1" step=".02" value="${L.fx}"></div>
      <div class="range"><label for="fy">위아래 <b>${L.fy.toFixed(2)}</b></label><input id="fy" type="range" min="-1" max="1" step=".02" value="${L.fy}"></div>
      <button class="btn danger" type="button" data-act="faceDel">사진 지우기</button>` : ''}
      <p class="muted">사진은 이 기기(브라우저)에만 저장되고 다른 곳으로 보내지 않아요. 얼굴이 가운데 오게 찍은 정면 사진이 잘 맞아요.</p></div>
    <div class="sec"><h2>머리 모양</h2><div class="seg">${STYLES.map(([k, t]) => `<button type="button" data-look="style:${k}" aria-pressed="${L.style === k}">${t}</button>`).join('')}</div>
      <h2>머리 색</h2>${sw('hair', SW.hair)}<h2>후드 색</h2>${sw('hood', SW.hood)}
      ${L.face && faceImg ? '' : `<h2>눈 색</h2>${sw('eye', SW.eye)}`}<h2>피부</h2>${sw('skin', SW.skin)}
      <button class="btn" type="button" data-act="lookReset">처음 모습으로</button></div>`;
}
function readFace(file){
  if (!file || !/^image\//.test(file.type)){ hint('사진 파일을 골라 주세요'); return; }
  const fr = new FileReader();
  fr.onload = () => { const im = new Image(); im.onload = () => {
      const s = Math.min(im.width, im.height), c = document.createElement('canvas'); c.width = c.height = 320;
      c.getContext('2d').drawImage(im, (im.width - s)/2, (im.height - s)/2, s, s, 0, 0, 320, 320);
      const url = c.toDataURL('image/jpeg', .86), im2 = new Image();
      im2.onload = () => { faceImg = im2; try { localStorage.setItem('johamin-castle-face', url); } catch(e){ hint('사진을 저장하지 못했어요 · 이번에만 적용돼요'); }
        G.look = Object.assign(lookOf(), {face:true, fz:1, fx:0, fy:0}); dressSync(); dressPanel(); hint('사진 얼굴 적용! 확대 · 위치를 맞춰 보세요'); };
      im2.src = url; };
    im.onerror = () => hint('이 사진은 열 수 없어요'); im.src = fr.result; };
  fr.readAsDataURL(file);
}
function dDown(ev){ dDrag = {x:ev.clientX, s:dSpin}; }
function dMove(ev){ if (dDrag) dSpin = dDrag.s + (ev.clientX - dDrag.x)*.012; }
function dUp(){ dDrag = null; }
document.addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b || G.mode !== 'dress') return; const d = b.dataset;
  if (d.look){ const i = d.look.indexOf(':'); G.look = Object.assign(lookOf(), {[d.look.slice(0, i)]:d.look.slice(i + 1)}); dressSync(); dressPanel(); return; }
  if (d.face){ G.look = Object.assign(lookOf(), {face:d.face === '1'}); dressSync(); dressPanel(); return; }
  if (d.act === 'faceDel'){ faceImg = null; try { localStorage.removeItem('johamin-castle-face'); } catch(e){} G.look = Object.assign(lookOf(), {face:false}); dressSync(); dressPanel(); return; }
  if (d.act === 'lookReset'){ G.look = Object.assign({}, LOOK_DEFAULT); dressSync(); dressPanel(); return; }
});
document.addEventListener('change', ev => { if (ev.target.id === 'faceFile'){ readFace(ev.target.files && ev.target.files[0]); ev.target.value = ''; } });
document.addEventListener('input', ev => {
  if (G.mode !== 'dress' || !['fz', 'fx', 'fy'].includes(ev.target.id)) return;
  G.look = Object.assign(lookOf(), {[ev.target.id]:+ev.target.value}); const lb = ev.target.previousElementSibling.querySelector('b'); if (lb) lb.textContent = ev.target.id === 'fz' ? `${(+ev.target.value).toFixed(2)}×` : (+ev.target.value).toFixed(2);
  if (!dressSync.t){ dressSync.t = requestAnimationFrame(() => { dressSync.t = 0; buildHeroInto(dHero); }); }
});
document.addEventListener('change', ev => { if (G.mode === 'dress' && ['fz', 'fx', 'fy'].includes(ev.target.id)) dressSync(); });

/* ═════════ 발전단지 · 연병장 풍경 업그레이드 ═════════ */
function addTrees(scene, list){
  const trunkG = new THREE.CylinderGeometry(.16, .24, 1.4, 7), leafG = new THREE.ConeGeometry(1.2, 2.8, 9), leaf2 = new THREE.ConeGeometry(.95, 2.0, 9);
  const t = new THREE.InstancedMesh(trunkG, smooth(0x5a3e24), list.length), a = new THREE.InstancedMesh(leafG, smooth(0x2f6b3e, {flatShading:true}), list.length), b2 = new THREE.InstancedMesh(leaf2, smooth(0x3d8a4e, {flatShading:true}), list.length), m = new THREE.Matrix4();
  list.forEach(([x, z, s], i) => { m.makeScale(s, s, s).setPosition(x, .7*s, z); t.setMatrixAt(i, m); m.makeScale(s, s, s).setPosition(x, 2.2*s, z); a.setMatrixAt(i, m); m.makeScale(s, s, s).setPosition(x, 3.3*s, z); b2.setMatrixAt(i, m); });
  t.castShadow = a.castShadow = b2.castShadow = true; scene.add(t, a, b2);
}
function cloud(scene, x, y, z, s){ const g = new THREE.Group(), m = new THREE.MeshStandardMaterial({color:0xffffff, roughness:1, flatShading:true}); for (let i = 0; i < 5; i++){ const b = new THREE.Mesh(new THREE.DodecahedronGeometry(1 + srand()*.6, 1), m); b.position.set((i - 2)*1.1, srand()*.6, srand()*.8); g.add(b); } g.position.set(x, y, z); g.scale.setScalar(s); scene.add(g); return g; }
function sDecorate(){
  sScene.background = skyTex('#5d9bd6', '#a9c6e2', '#e6eef4');
  let sun = null; sScene.traverse(o => { if (o.isDirectionalLight) sun = o; if (o.isMesh && o.geometry.type === 'PlaneGeometry' && o.geometry.parameters.width === 90){ o.material.map = grassTex; o.material.color.set(0xa8cf8e); o.material.needsUpdate = true; o.receiveShadow = true; } });
  sun.position.set(-14, 24, 14); sun.castShadow = true; sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, {left:-24, right:24, top:24, bottom:-24, near:1, far:80}); sun.shadow.normalBias = .04; sun.target.position.set(-3, 0, -2); sScene.add(sun.target);
  const path = new THREE.Mesh(new THREE.PlaneGeometry(4, 40), std(0xbfae94, {map:dirtTex, roughness:1})); path.rotation.x = -Math.PI/2; path.rotation.z = .25; path.position.set(1.5, .02, 2); path.receiveShadow = true; sScene.add(path);
  for (let x = -18; x <= 14; x += 2.2){ for (const z of [-13.5]){ const p = new THREE.Mesh(new THREE.BoxGeometry(.16, 1, .16), smooth(0x7a5a3a)); p.position.set(x, .5, z); sScene.add(p); } }
  const rail = new THREE.Mesh(new THREE.BoxGeometry(32.5, .1, .08), smooth(0x7a5a3a)); rail.position.set(-2, .8, -13.5); sScene.add(rail);
  const trees = []; for (let i = 0; i < 40; i++){ const side = srand() < .5 ? -1 : 1; trees.push([-3 + side*(18 + srand()*16), -24 + srand()*40, .8 + srand()*.6]); } for (let i = 0; i < 18; i++) trees.push([-30 + srand()*56, -18 - srand()*10, .8 + srand()*.5]);
  addTrees(sScene, trees);
  for (const [x, y, z, s] of [[-20, 12, -28, 1.6], [6, 14, -32, 2], [20, 11, -24, 1.3]]) cloud(sScene, x, y, z, s);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({map:canvasTex(128, 128, (x, w, h) => { const g = x.createRadialGradient(64, 64, 10, 64, 64, 64); g.addColorStop(0, 'rgba(255,240,180,.9)'); g.addColorStop(1, 'rgba(255,240,180,0)'); x.fillStyle = g; x.fillRect(0, 0, w, h); }), transparent:true, depthWrite:false, fog:false})); halo.scale.set(14, 14, 1); halo.position.set(-14, 9, -22.2); sScene.add(halo);
  // 배터리실: 벽돌 · 창 · 문 · 굴뚝
  sScene.traverse(o => { if (o.isMesh && o.geometry.type === 'BoxGeometry' && o.geometry.parameters.width === 3.4){ o.material = std(0xd8cdb6, {map:brickTex(3, 2), roughness:.9}); } });
  const door = new THREE.Mesh(new THREE.BoxGeometry(.8, 1.5, .06), smooth(0x6b4a2a)); door.position.set(5.5, .75, -.68); sScene.add(door);
  for (const x of [4.5, 6.5]){ const w = new THREE.Mesh(new THREE.BoxGeometry(.6, .5, .05), new THREE.MeshStandardMaterial({color:0xbfe3ff, emissive:0x6fb6ff, emissiveIntensity:.4})); w.position.set(x, 1.7, -.68); sScene.add(w); }
  const chim = new THREE.Mesh(new THREE.BoxGeometry(.4, 1.1, .4), std(0xb8ad96, {map:brickTex(1, 1)})); chim.position.set(6.4, 3.9, -2.6); sScene.add(chim);
  // 패널 → 배터리실 전선
  const cable = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(-4, .05, -5.5), V(0, .05, -4), V(4, .05, -2.2), V(5.5, .6, -.7)]), 40, .05, 6), smooth(0x222833)); sScene.add(cable);
  // 실험대 다듬기: 유리관 끝 링 · 받침 · 굵은 전선 · 계기 상자
  const g = sLab;
  for (const x of [-2.3, 2.3]){ const r = new THREE.Mesh(new THREE.TorusGeometry(1.1, .07, 10, 40), smooth(0x9aa3b2, {metalness:.8, roughness:.25})); r.rotation.y = Math.PI/2; r.position.set(x, 2.3, 0); g.add(r);
    const st = new THREE.Mesh(new THREE.CylinderGeometry(.08, .14, 1.05, 10), smooth(0x9aa3b2, {metalness:.7})); st.position.set(x*.8, 1.6, 0); g.add(st); }
  const wire = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V(-1.95, 1.6, 0), V(-1.95, 1.18, .8), V(-1, 1.16, 1.25), V(1, 1.16, 1.25), V(1.95, 1.18, .8), V(1.95, 1.6, 0)]), 50, .035, 6), smooth(0xd8a038, {metalness:.6})); g.add(wire);
  for (const x of [-1.2, 1.6]){ const box = new THREE.Mesh(new THREE.BoxGeometry(.7, .45, .4), smooth(0x2b3346)); box.position.set(x, 1.36, 1.2); g.add(box);
    const face = new THREE.Mesh(new THREE.CircleGeometry(.16, 20), basic(0xf2f2e6)); face.position.set(x, 1.38, 1.41); g.add(face);
    const nd = new THREE.Mesh(new THREE.BoxGeometry(.02, .13, .01), basic(0xd03a3a)); nd.position.set(x, 1.42, 1.42); nd.rotation.z = x < 0 ? -.4 : .5; g.add(nd); }
  const lampBody = g.userData.lamp; if (lampBody){ const hood2 = new THREE.Mesh(new THREE.CylinderGeometry(.6, .62, .12, 24), smooth(0x9aa3b2, {metalness:.7})); hood2.position.y = -.42; lampBody.add(hood2);
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 2.6, 8), smooth(0x9aa3b2, {metalness:.7})); arm.position.set(-3.6, 2.6, 0); g.add(arm); }
  const top = new THREE.Mesh(new THREE.BoxGeometry(8.1, .06, 3.3), std(0x8a6a48, {map:canvasTex(256, 64, (x, w, h) => { x.fillStyle = '#9a7a54'; x.fillRect(0, 0, w, h); for (let i = 0; i < 40; i++){ x.strokeStyle = `rgba(80,50,25,${.15 + srand()*.2})`; x.beginPath(); const y = srand()*h; x.moveTo(0, y); x.bezierCurveTo(w*.3, y + 4, w*.6, y - 4, w, y + 2); x.stroke(); } }), roughness:.7})); top.position.y = 1.15; g.add(top);
  sScene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o.material && !o.material.transparent && !o.material.isMeshBasicMaterial) o.castShadow = true; });
}
function tDecorate(){
  tScene.background = skyTex('#5d9bd6', '#a9c6e2', '#e6eef4');
  tScene.traverse(o => { if (o.isMesh && o.geometry.type === 'PlaneGeometry' && o.geometry.parameters.width === 90){ o.material.map = grassTex; o.material.color.set(0xa8cf8e); o.material.needsUpdate = true; }
    if (o.isMesh && o.geometry.type === 'PlaneGeometry' && o.geometry.parameters.width === 16){ o.material.map = dirtTex; o.material.color.set(0xd8c4a0); o.material.needsUpdate = true; } });
  const trees = []; for (let i = 0; i < 34; i++){ const side = srand() < .5 ? -1 : 1; trees.push([side*(20 + srand()*14), -20 + srand()*36, .8 + srand()*.5]); } for (let i = 0; i < 14; i++) trees.push([-24 + srand()*48, -16 - srand()*8, .8 + srand()*.5]);
  addTrees(tScene, trees);
}
