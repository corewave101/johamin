'use strict';
/* ═════════ 대장간 3D: 설계부(경통 · cm) / 실험부(사격장 · m) ═════════ */
const fScene = new THREE.Scene();
fScene.add(new THREE.HemisphereLight(0xdcecff, 0x0a2440, .9));
{ const s = new THREE.DirectionalLight(0xffffff, .8); s.position.set(-6, 20, 12); fScene.add(s); }
const BX0 = -3.0, BX1 = 15.0, BAR_R = 1.7;
const X_REAR = -9.0, X_MED = -6.7, X_OUT = -4.4, X_LAMP = BX0 - .45;
const RX0 = -8.5, RSC = .225, mToW = m => RX0 + m*RSC, wToM = X => (X - RX0)/RSC;
const fDyn = new THREE.Group(); fScene.add(fDyn);
const benchStatic = new THREE.Group(); fScene.add(benchStatic); let benchKey = '';
const rangeStatic = new THREE.Group(); fScene.add(rangeStatic);
let fDynPicks = [], fAnim = {};
const fCS = () => (BX1 - BX0)/F.barrel, bToW = cm => BX0 + cm*fCS(), wToB = X => (X - BX0)/fCS();
const fView = () => G.dept === 'test' ? 'range' : 'bench';
function fCenter(){ return fView() === 'range' ? V((RX0 - 3.5 + mToW(100))/2, 0, .3) : V(F.source === 'laser' ? (X_REAR + BX1)/2 : (X_LAMP - 1 + BX1)/2, 0, .3); }
function fSpan(){ return fView() === 'range' ? mToW(100) - RX0 + 5 : F.source === 'laser' ? BX1 - X_REAR + 3 : BX1 - X_LAMP + 4; }

function newDraft(kind, src){
  const d = src ? copy(src) : (kind === 'weapon' ? copy(PRESETS.find(p => p.id === 'lantern')) : {kind:'tower', source:'led', barrel:80, els:[]});
  const L = d.barrel || 20; let id = 1;
  return {kind, sourceId:src ? src.id : null, source:d.source || 'laser', pix:d.pix || 'w', medium:d.medium || 'argon', pump:d.pump || 1, R:d.R ?? .95, loss:LOSS, mirror:true, barrel:L,
    free:d.els.map(e => Object.assign({id:id++}, e, {x:clamp(Math.round(e.x), 1, L - 1)})),
    dummy:{x:kind === 'weapon' ? 10 : 20, foe:'cs', armor:null, W:null}, sel:null, nextId:id, learn:false};
}
const fDesign = () => ({kind:F.kind, source:F.source, pix:F.pix, medium:F.medium, pump:F.pump, R:F.R, loss:F.loss, barrel:F.barrel,
  els:F.free.slice().sort((a, b) => a.x - b.x).map(e => { const o = {type:e.type, x:e.x}; if (e.type === 'pol') o.theta = e.theta; else o.f = e.f; return o; })});
const fIsLaser = () => F.source === 'laser';
const fReady = () => !fIsLaser() || (F.medium && F.pump && F.mirror);
const fPower = () => fReady() ? srcPower(fDesign()) : 0;
const fFoe = () => Object.assign({}, FOES[F.dummy.foe], F.dummy.W != null ? {W:F.dummy.W} : {});
const fArmor = () => F.dummy.foe === 'kn' ? (F.dummy.armor ?? 90) : null;
function fHit(){ if (!fReady()) return {v:0, why:!F.medium ? '매질 없음' : !F.pump ? '펌핑 없음' : '출력 거울 없음', w:1}; return hitD(fDesign(), fFoe(), F.dummy.x, fArmor()); }
/* 경통 안 추적 (cm) · 렌즈 정보 */
function fTrace(toCm){
  const d = fDesign(), s = srcOf(d), els = F.free.slice().sort((a, b) => a.x - b.x);
  let ay, au, by, bu; if (fIsLaser()){ ay = s.r0; au = 0; by = 0; bu = s.th; } else { ay = 0; au = s.div; by = s.s; bu = 0; }
  let pos = 0, pol = s.pol, t = 1;
  const samples = [{x:0, w:Math.abs(ay) + Math.abs(by), t, pol}], info = {};
  const fine = toCm <= F.barrel + 1e-9;
  const go = x => { const L = x - pos; if (L <= 0) return; const n = fine ? Math.max(1, Math.ceil(L/(F.barrel/60))) : 1; for (let i = 0; i < n; i++){ ay += au*L/n; by += bu*L/n; pos += L/n; samples.push({x:pos, w:Math.abs(ay) + Math.abs(by), t, pol}); } };
  for (const e of els){
    if (e.x >= toCm) break; go(e.x);
    const rec = {yIn:ay, uIn:au, byIn:by, buIn:bu, polIn:pol, tIn:t};
    if (e.type === 'convex'){ au -= ay/e.f; bu -= by/e.f; } else if (e.type === 'concave'){ au += ay/e.f; bu += by/e.f; }
    else { t *= pol == null ? .5 : cos2(e.theta - pol); pol = e.theta; }
    rec.uOut = au; info[e.id] = rec; samples.push({x:pos, w:Math.abs(ay) + Math.abs(by), t, pol});
  }
  go(toCm);
  return {samples, w:Math.abs(ay) + Math.abs(by), t, pol, info};
}
/* 광선 A(가운데에서 출발)가 축을 지나는 곳 = 상(초점) 위치 */
function lensAB(inf){
  const a = Math.abs(inf.uIn) < 1e-12 ? Infinity : (inf.yIn === 0 ? 0 : inf.yIn/inf.uIn);
  const b = Math.abs(inf.uOut) < 1e-12 ? Infinity : -inf.yIn/inf.uOut;
  return {a, b};
}
function fImages(){
  const all = fTrace(1e6), out = [];
  for (const e of F.free){ if (e.type === 'pol') continue; const inf = all.info[e.id]; if (!inf) continue; const {a, b} = lensAB(inf); if (isFinite(b) && b > 0) out.push({id:e.id, at:e.x + b, a, b}); }
  return out;
}
function fBuildStatic(){
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(160, 100), new THREE.MeshBasicMaterial({color:0x0f355e})); plane.rotation.x = -Math.PI/2; fScene.add(plane);
  for (const [n, col, op, y] of [[160, 0x2f6aa3, .35, .005], [32, 0x6fa8de, .4, .01]]){ const g = new THREE.GridHelper(160, n, col, col); g.material.transparent = true; g.material.opacity = op; g.position.y = y; fScene.add(g); }
  const rail = new THREE.Mesh(new THREE.BoxGeometry(mToW(100) - RX0 + .6, .12, .5), std(0x5d6f86, {metalness:.6, roughness:.35})); rail.position.set((RX0 + mToW(100))/2, .06, 0); rangeStatic.add(rail);
  for (let m = 0; m <= 100; m += 10){ const l = label(m === 100 ? '100 m' : String(m), {size:18, color:'#8fc0ea', h:.02}); l.position.set(mToW(m), .2, 1.4); rangeStatic.add(l); }
  const zl = label('실험장 · 거리 (m)', {size:26, bold:true, h:.024}); zl.position.set(mToW(50), .2, -3.0); rangeStatic.add(zl);
}
const fIsSel = (kind, id) => F.sel && F.sel.kind === kind && (id == null || F.sel.id === id);
function fAddPick(g, pick){ g.userData.pick = pick; fDynPicks.push(g); fDyn.add(g); }
function fRing(x, z){ const r = new THREE.Mesh(new THREE.TorusGeometry(1.0, .05, 8, 48), new THREE.MeshBasicMaterial({color:0xff8a3d})); r.rotation.x = -Math.PI/2; r.position.set(x, .08, z); fDyn.add(r); fAnim.ring = r; }
function dashedBox(x0, z0, x1, z1){ const g = new THREE.BufferGeometry().setFromPoints([V(x0,.02,z0), V(x1,.02,z0), V(x1,.02,z1), V(x0,.02,z1), V(x0,.02,z0)]); const l = new THREE.Line(g, new THREE.LineDashedMaterial({color:0xbfe0ff, dashSize:.35, gapSize:.25, transparent:true, opacity:.75})); l.computeLineDistances(); fDyn.add(l); }
function fSync(){
  clearGroup(fDyn); fDynPicks = []; fAnim = {photons:[]};
  rangeStatic.visible = fView() === 'range'; benchStatic.visible = fView() !== 'range';
  if (fView() === 'range') buildRange(); else buildBench();
}
function buildCavity(hide, p, col){
  const rear = part('rearMirror'); rear.position.set(X_REAR, BEAM_Y, 0); fDyn.add(rear);
  const lab = label('레이저 공진기', {size:20, color:'#bfe0ff', h:.02}); lab.position.set(-6.7, .2, 1.9); fDyn.add(lab);
  if (F.medium){ const g = part('medium', {value:F.medium}); g.position.set(X_MED, BEAM_Y, 0); fAddPick(g, {kind:'medium'}); fAnim.rod = g.userData.rod; if (fIsSel('medium')) fRing(X_MED, 0); }
  if (F.pump){ const g = part('pump', {value:F.pump}); g.position.set(X_MED, BEAM_Y + .05, -.82); fAddPick(g, {kind:'pump'}); if (fIsSel('pump')) fRing(X_MED, -.82); }
  if (F.mirror){ const g = part('mirror', {R:F.R}); g.position.set(X_OUT, BEAM_Y, 0); fAddPick(g, {kind:'mirror'}); if (fIsSel('mirror')) fRing(X_OUT, 0); }
  if (!hide && fReady() && p){
    const cav = new THREE.Mesh(new THREE.CylinderGeometry(.2, .2, X_OUT - X_REAR, 16, 1, true), new THREE.MeshBasicMaterial({color:col, transparent:true, opacity:.4, blending:THREE.AdditiveBlending, depthWrite:false}));
    cav.rotation.z = Math.PI/2; cav.position.set((X_REAR + X_OUT)/2, BEAM_Y, 0); fDyn.add(cav); fAnim.cav = cav;
    const n = clamp(Math.round(p/2), 2, 14);
    for (let i = 0; i < n; i++){ const ph = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 6), new THREE.MeshBasicMaterial({color:0xffffff})); ph.userData = {phase:i/n, dz:(Math.random() - .5)*.24, dy:(Math.random() - .5)*.24}; fDyn.add(ph); fAnim.photons.push(ph); }
    const lead = new THREE.Mesh(new THREE.CylinderGeometry(.12, .12, BX0 - X_OUT, 12, 1, true), new THREE.MeshBasicMaterial({color:col, transparent:true, opacity:.45, blending:THREE.AdditiveBlending, depthWrite:false})); lead.rotation.z = Math.PI/2; lead.position.set((BX0 + X_OUT)/2, BEAM_Y, 0); fDyn.add(lead);
  }
  if (!fReady() || (!hide && !p)){
    const why = !F.medium ? '매질을 끼워 주세요' : !F.pump ? '펌핑 램프를 끼워 주세요' : !F.mirror ? '출력 거울을 끼워 주세요' : '발진 안 함 · 이득 < 손실';
    const l = label(why, {size:20, color:'#ffffff', bg:'rgba(200,50,70,.88)', h:.017}); l.position.set(X_MED + .5, BEAM_Y + 1.6, 0); fDyn.add(l);
  }
}
function tube(x0, x1, r, color, op){ const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, x1 - x0, 36, 1, true), new THREE.MeshBasicMaterial({color, transparent:true, opacity:op, side:THREE.DoubleSide, depthWrite:false})); m.rotation.z = Math.PI/2; m.position.set((x0 + x1)/2, BEAM_Y, 0); return m; }
function buildBenchStatic(L){
  if (benchKey === String(L)) return;
  benchKey = String(L); clearGroup(benchStatic); const add = o => benchStatic.add(o);
  { const g = new THREE.BufferGeometry().setFromPoints([V(-10.4,.02,-2.9), V(BX0 - .1,.02,-2.9), V(BX0 - .1,.02,2.9), V(-10.4,.02,2.9), V(-10.4,.02,-2.9)]); const l = new THREE.Line(g, new THREE.LineDashedMaterial({color:0xbfe0ff, dashSize:.35, gapSize:.25, transparent:true, opacity:.75})); l.computeLineDistances(); add(l); }
  add(tube(BX0, BX1, BAR_R, 0xbfe0ff, .07));
  for (const x of [BX0, BX1]){ const r = new THREE.Mesh(new THREE.TorusGeometry(BAR_R, .05, 8, 48), new THREE.MeshBasicMaterial({color:0xbfe0ff})); r.rotation.y = Math.PI/2; r.position.set(x, BEAM_Y, 0); add(r); }
  for (const s of [-1, 1]){ const g = new THREE.BufferGeometry().setFromPoints([V(BX0, BEAM_Y, s*BAR_R), V(BX1, BEAM_Y, s*BAR_R)]); add(new THREE.Line(g, new THREE.LineBasicMaterial({color:0xbfe0ff, transparent:true, opacity:.6}))); }
  const bar = new THREE.Mesh(new THREE.BoxGeometry(BX1 - BX0, .1, .4), std(0x5d6f86, {metalness:.6, roughness:.35})); bar.position.set((BX0 + BX1)/2, .05, 0); add(bar);
  const step = L <= 20 ? 2 : L <= 40 ? 5 : L <= 80 ? 10 : 20, cs = (BX1 - BX0)/L;
  for (let c = 0; c <= L; c += step){ const l = label(c === L ? `${c} cm` : String(c), {size:18, color:'#8fc0ea', h:.02}); l.position.set(BX0 + c*cs, .2, BAR_R + .7); add(l); }
  const bl = label(['경통', `길이 ${L} cm`], {size:22, bold:true, h:.022, sub:'#9fc8ee'}); bl.position.set((BX0 + BX1)/2, .2, -BAR_R - 1.1); add(bl);
}
function buildBench(){
  const hide = F.learn && !F.fired, p = fPower(), d = fDesign(), col = fReady() ? beamColor(d) : '#ffffff', L = F.barrel, CS = fCS();
  buildBenchStatic(L);
  const barPick = new THREE.Mesh(new THREE.BoxGeometry(.6, 3.4, 3.6), new THREE.MeshBasicMaterial({visible:false})); barPick.position.set(BX1 + .3, BEAM_Y, 0); fAddPick(barPick, {kind:'barrel'}); if (fIsSel('barrel')) fRing(BX1 + .3, 0);
  // 광원
  if (fIsLaser()) buildCavity(hide, p, col);
  else {
    const g = new THREE.Group(); g.add(lampModel(F.source, .9)); g.add(post()); g.position.set(X_LAMP, BEAM_Y, 0); fAddPick(g, {kind:'source'}); if (fIsSel('source')) fRing(X_LAMP, 0);
    const lab = label(['광원 · 0 cm', `${SOURCES[F.source].name} · 반지름 ${SOURCES[F.source].s} cm`], {size:20, color:'#bfe0ff', sub:'#8fc0ea', h:.02}); lab.position.set(X_LAMP + .6, .2, BAR_R + 2.0); fDyn.add(lab);
    if (!hide){ const glow = new THREE.PointLight(new THREE.Color(col), 1.2, 6); glow.position.set(X_LAMP, BEAM_Y + .3, 0); fDyn.add(glow); }
  }
  for (const e of F.free){ const g = part(e.type, e.type === 'pol' ? {theta:e.theta} : {f:e.f*fCS()}); g.position.set(bToW(e.x), BEAM_Y, 0); fAddPick(g, {kind:'free', id:e.id}); if (fIsSel('free', e.id)) fRing(bToW(e.x), 0); }
  if (!hide && fReady() && p){
    const tr = fTrace(L); fDrawBeam(tr.samples.map(q => ({X:bToW(q.x), r:clamp(q.w*CS, .015, BAR_R - .05), t:q.t, pol:q.pol, b:1})), col, true);
    const imgs = fImages(); let exitTxt = [];
    for (const im of imgs){
      if (im.at <= L){ const X = bToW(im.at); const dot = new THREE.Mesh(new THREE.SphereGeometry(.08, 12, 8), new THREE.MeshBasicMaterial({color:0xffffff})); dot.position.set(X, BEAM_Y, 0); fDyn.add(dot);
        const l = label(fIsLaser() ? '초점' : '상', {size:18, h:.016}); l.position.set(X, BEAM_Y + .75, 0); fDyn.add(l); }
      else exitTxt.push(`${fIsLaser() ? '초점' : '상'} ${r1(im.at/100)} m`);
    }
    const ex = label(['경통 밖으로 →', exitTxt.length ? exitTxt.join(' · ') : `출구 빔 반지름 ${r1(tr.w)} cm`], {size:20, color:'#ffffff', sub:'#ffd9b8', bg:'rgba(10,36,64,.9)', h:.018}); ex.position.set(BX1 - 2.4, BEAM_Y + 2.9, 0); fDyn.add(ex);
  }
  if (hide){ const l = label('시험 발사 전', {size:22, color:'#ffffff', bg:'rgba(10,36,64,.9)', h:.018, bold:true}); l.position.set(BX1 - 2.4, BEAM_Y + 2.9, 0); fDyn.add(l); }
}
function emitterModel(){
  const g = new THREE.Group(), L = F.barrel, len = .8 + L/160*2;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.45, .55, .3, 18), std(0x3a4152, {metalness:.4})); base.position.y = -BEAM_Y + .15; g.add(base);
  g.add(post());
  const body = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, len, 18), std(0x232a3a, {metalness:.5, roughness:.4})); body.rotation.z = Math.PI/2; body.position.x = -len/2; g.add(body);
  const lip = new THREE.Mesh(new THREE.TorusGeometry(.32, .05, 8, 24), std(0x8a99ad, {metalness:.7})); lip.rotation.y = Math.PI/2; g.add(lip);
  return g;
}
function buildRange(){
  const hide = F.learn && !F.fired, p = fPower(), d = fDesign(), col = fReady() ? beamColor(d) : '#ffffff';
  const em = emitterModel(); em.position.set(RX0, BEAM_Y, 0); fDyn.add(em);
  const nm = label([F.kind === 'weapon' ? '주인공 무기' : '탑 설계', `경통 ${F.barrel} cm · 0 m = 광원`], {size:20, color:'#bfe0ff', sub:'#8fc0ea', h:.02}); nm.position.set(RX0 - .6, .2, 2.2); fDyn.add(nm);
  const dm = part('dummy', {foe:F.dummy.foe, armor:fArmor()}); dm.position.set(mToW(F.dummy.x), BEAM_Y, 0); fAddPick(dm, {kind:'dummy'}); fAnim.body = dm.userData.body; if (fIsSel('dummy')) fRing(mToW(F.dummy.x), 0);
  const hit = fHit();
  if (!hide && fReady() && p){
    const s = [], end = F.dummy.x, mw = minWOf(d); let fmax = 0;
    for (let m = 0; m <= end + 1e-9; m += .5){ const tr = traceD(d, Math.max(.01, m)), fr = Math.min(1, (RT/Math.max(tr.w, mw))**2); fmax = Math.max(fmax, fr); s.push({X:mToW(m), w:tr.w, t:tr.t, pol:tr.pol, fr, x:m}); }
    fDrawBeam(s.map(q => ({X:q.X, r:clamp(.035*q.w, .03, 2.4), t:q.t, pol:q.pol, b:Math.max(.12, Math.sqrt(q.fr/Math.max(fmax, 1e-9))), x:q.x})), col, false);
    for (const im of fImages()){ const m = im.at/100; if (m > .5 && m <= 100){ const X = mToW(m);
      const dot = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 8), new THREE.MeshBasicMaterial({color:0xffffff})); dot.position.set(X, BEAM_Y, 0); fDyn.add(dot);
      const l = label([fIsLaser() ? '초점' : '상', `${r1(m)} m`], {size:18, h:.016, sub:'#ffd9b8'}); l.position.set(X, BEAM_Y + .95, 0); fDyn.add(l); } }
  }
  const dl = hide ? label('시험 발사 전', {size:22, color:'#ffffff', bg:'rgba(10,36,64,.9)', h:.018, bold:true}) : label(hit.v ? [`초당 ${hit.v.toFixed(1)}`, hit.sat ? '전압 포화' : '전류 제한'] : `0 · ${hit.why}`, {size:22, color:'#ffffff', sub:'#ffd9b8', bg:hit.v ? 'rgba(10,36,64,.9)' : 'rgba(200,50,70,.88)', h:.018, bold:true});
  dl.position.set(mToW(F.dummy.x), BEAM_Y + 1.7, 0); fDyn.add(dl);
  fAnim.hit = hide ? 0 : hit.v; if (hit.v && !hide) bumpBest(hit.v);
}
/* s: [{X, r, t, pol, b}] 월드 좌표 · 반지름 · 세기 */
function fDrawBeam(s, colorHex, inBarrel){
  const base = new THREE.Color(colorHex), seg = 18, pos = [], cols = [], idx = [];
  s.forEach((q, i) => {
    const b = q.t > .002 ? Math.max(.06, q.t*q.b) : 0;
    for (let j = 0; j < seg; j++){ const a = j/seg*Math.PI*2; pos.push(q.X, BEAM_Y + q.r*Math.cos(a), q.r*Math.sin(a)); cols.push(base.r*b, base.g*b, base.b*b); }
    if (i) for (let j = 0; j < seg; j++){ const a0 = (i-1)*seg + j, a1 = (i-1)*seg + (j+1)%seg, b0 = i*seg + j, b1 = i*seg + (j+1)%seg; idx.push(a0, b0, a1, a1, b0, b1); }
  });
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3)); g.setIndex(idx);
  fDyn.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({vertexColors:true, transparent:true, opacity:.65, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.DoubleSide})));
  const X0 = s[0].X, X1 = s[s.length - 1].X, n = inBarrel ? 6 : Math.max(2, Math.round((X1 - X0)/1.8));
  for (let k = 1; k < n; k++){
    const X = X0 + (X1 - X0)*k/n; let q = s[0]; for (const z of s){ if (z.X <= X) q = z; else break; }
    if (q.t < .01) continue;
    if (q.pol == null){ for (const a of [0, 60, 120]){ const grp = new THREE.Group(); grp.rotation.x = rad(a); grp.add(new THREE.Mesh(new THREE.BoxGeometry(.03, .5, .03), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:.25}))); grp.position.set(X, BEAM_Y, 0); fDyn.add(grp); } }
    else { const grp = new THREE.Group(); grp.rotation.x = rad(q.pol); grp.add(new THREE.Mesh(new THREE.BoxGeometry(.04, .62, .04), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:.25 + .6*q.t}))); grp.position.set(X, BEAM_Y, 0); fDyn.add(grp); }
  }
}

/* ═════════ 부품 사이드바 · 끌어다 놓기 (설계부) ═════════ */
const PARTS = () => [
  ...LAMP_IDS.map(id => ({cat:'src', type:'source', value:id, name:SOURCES[id].name, sub:SOURCES[id].sub, price:SOURCES[id].price, color:SOURCES[id].color})),
  {cat:'src', type:'laserkit', value:'laser', name:'레이저 공진기', sub:'매질 · 펌핑 · 거울을 끼워 써요', price:0, color:'#3fd0ff', lock:!G.research.laser && '연구부: 레이저'},
  {cat:'opt', type:'convex', name:'볼록 렌즈', sub:'빛을 모아요 · f(cm) 조절', price:PRICE.convex, color:'#a8e6ff'},
  {cat:'opt', type:'concave', name:'오목 렌즈', sub:'빛을 퍼뜨려요 · f(cm) 조절', price:PRICE.concave, color:'#a8e6ff'},
  {cat:'opt', type:'pol', name:'편광판', sub:'투과축 θ 조절', price:PRICE.pol, color:'#ffd166'},
  ...MEDIA_LIST.map(m => ({cat:'laser', type:'medium', value:m.id, name:m.name, sub:`${m.nm} nm`, price:m.price, color:m.color, lock:(!G.research.laser && '연구부: 레이저') || (!mediumOk(m) && '연구부 연구 필요')})),
  ...PUMPS.map(q => ({cat:'laser', type:'pump', value:q.lv, name:q.label, sub:`g₀ ${Math.round(q.g0*100)}%`, price:q.price, color:'#ffe2a8', lock:(!G.research.laser && '연구부: 레이저') || (!pumpOk(q) && '연구부 연구 필요')})),
  {cat:'laser', type:'mirror', name:'출력 거울', sub:'반사율 R 조절', price:PRICE.mirror, color:'#b9d8f2', lock:!G.research.laser && '연구부: 레이저'},
];
let partsCat = 'src', partsSort = 'base';
function renderParts(){
  const el = $('parts'), show = G.mode === 'forge' && G.dept === 'design' && (!F.learn || (F.prob && F.prob.bin.length));
  el.hidden = !show; stage.classList.toggle('partsopen', show);
  if (!show) return;
  let list = PARTS().filter(p => p.cat === partsCat);
  if (F.learn && F.prob) list = PARTS().filter(p => F.prob.bin.includes(p.type) && !(p.type === 'medium' && MEDIA[p.value].research)).map(p => Object.assign(p, {lock:false}));
  if (partsSort === 'price') list.sort((a, b) => a.price - b.price); else if (partsSort === 'name') list.sort((a, b) => a.name.localeCompare(b.name, 'ko'));
  el.innerHTML = `<div class="ph"><b>부품함</b><select id="pSort" aria-label="정렬"><option value="base" ${partsSort==='base'?'selected':''}>기본 순서</option><option value="price" ${partsSort==='price'?'selected':''}>가격 낮은 순</option><option value="name" ${partsSort==='name'?'selected':''}>이름 순</option></select></div>
    ${F.learn ? '<p class="muted" style="margin:0 2px">이 문제에 쓰는 부품만 보여요</p>' : `<div class="ptabs">${[['src','광원'],['opt','렌즈 · 편광'],['laser','레이저 부품']].map(([c, t]) => `<button type="button" data-pcat="${c}" aria-pressed="${partsCat===c}">${t}</button>`).join('')}</div>`}
    <div class="plist">${list.map(p => `<div class="pcard ${p.lock ? 'lock' : ''}" data-ptype="${p.type}" data-pval="${p.value ?? ''}" data-pname="${p.name}"><i style="background:${p.color}"></i><div><b>${p.name}</b><small>${p.lock ? '🔒 ' + p.lock : p.sub}</small></div><span>${p.price ? p.price + 'G' : ''}</span></div>`).join('')}</div>
    <p class="muted" style="margin:0 2px">카드를 끌어서 작업대에 놓아요</p>`;
}
let fDrag = null;
const fPlane = new THREE.Plane(V(0, 1, 0), -BEAM_Y);
const fPlanePt = () => { const p = new THREE.Vector3(); return ray.ray.intersectPlane(fPlane, p) ? p : null; };
function fDropTarget(type, p){
  if (!p) return null;
  if (type === 'source' || type === 'laserkit') return (p.x > -10.8 && p.x < BX0 + .6 && Math.abs(p.z) < 3.4) ? {src:true} : null;
  if (['medium', 'pump', 'mirror'].includes(type)) return (p.x > -10.8 && p.x < -3.4 && Math.abs(p.z) < 3.4) ? {cavity:true} : null;
  if (p.x > BX0 - .2 && p.x < BX1 + .2 && Math.abs(p.z) < BAR_R + .6) return {cm:Math.round(clamp(wToB(p.x), 1, F.barrel - 1))};
  return null;
}
function startCardDrag(card, ev){
  if (card.classList.contains('lock')){ hint(`잠겨 있어요 · ${card.querySelector('small').textContent.replace('🔒 ', '')}`); return; }
  const type = card.dataset.ptype, value = card.dataset.pval === '' ? undefined : (type === 'pump' ? +card.dataset.pval : card.dataset.pval);
  const it = {type, value, name:card.dataset.pname};
  const ghost = type === 'source' ? (() => { const g = new THREE.Group(); g.add(lampModel(value, .9)); return g; })() : part(type, {value, f:30, theta:45, R:.9, post:false});
  ghost.traverse(o => { if (o.material){ o.material.transparent = true; o.material.opacity = Math.min(o.material.opacity ?? 1, .6); } });
  ghost.visible = false; fScene.add(ghost);
  fDrag = {mode:'new', it, ghost, sx:ev.clientX, sy:ev.clientY, card:true, pid:ev.pointerId};
}
function fDown(ev){
  setRay(ev);
  let root = null;
  for (const h of ray.intersectObjects(fDynPicks, true)){ let o = h.object; while (o && !o.userData.pick) o = o.parent; if (o){ root = o; break; } }
  if (!root) return;
  const pick = root.userData.pick, sx = ev.clientX, sy = ev.clientY;
  if (F.learn && pick.kind !== 'dummy'){ hint('문제 풀기에서는 오른쪽 창에 값을 넣어요'); return; }
  if (F.learn && pick.kind === 'dummy'){ hint('문제의 표적 위치는 고정이에요'); return; }
  if (pick.kind === 'free' || pick.kind === 'dummy') fDrag = {mode:'move', pick, sx, sy, moved:false};
  else fDrag = {mode:'tap', pick, sx, sy};
}
function fMove(ev){
  if (!fDrag) return;
  setRay(ev); const p = fPlanePt(), far = Math.hypot(ev.clientX - fDrag.sx, ev.clientY - fDrag.sy) > 6;
  if (fDrag.mode === 'new'){
    if (!p) return; fDrag.ghost.visible = true;
    const t = fDrag.it.type, tgt = fDropTarget(t, p);
    if (tgt && tgt.src) fDrag.ghost.position.set(X_LAMP, BEAM_Y, 0);
    else if (tgt && tgt.cavity) fDrag.ghost.position.copy(t === 'medium' ? V(X_MED, BEAM_Y, 0) : t === 'pump' ? V(X_MED, BEAM_Y + .05, -.82) : V(X_OUT, BEAM_Y, 0));
    else if (tgt) fDrag.ghost.position.set(bToW(tgt.cm), BEAM_Y, 0);
    else fDrag.ghost.position.set(p.x, BEAM_Y + .4, p.z);
    fDrag.ghost.scale.setScalar(tgt ? 1 : .7);
  } else if (fDrag.mode === 'move' && (far || fDrag.moved) && p){
    fDrag.moved = true;
    if (fDrag.pick.kind === 'dummy'){ const m = Math.round(clamp(wToM(p.x), 1, 100)); if (F.dummy.x !== m){ F.dummy.x = m; F.sel = {kind:'dummy'}; fChangedSoon(); } }
    else { const c = Math.round(clamp(wToB(p.x), 1, F.barrel - 1)), e = F.free.find(q => q.id === fDrag.pick.id); if (e && e.x !== c){ e.x = c; F.sel = {kind:'free', id:e.id}; fChangedSoon(); } }
  }
}
function defaultF(type, x){ if (type === 'concave') return 10; return fIsLaser() ? 3000 - x : lensFor(x, 15); }
function fUp(ev){
  if (!fDrag) return;
  if (fDrag.mode === 'new'){
    setRay(ev); const p = fPlanePt(), it = fDrag.it, tgt = fDropTarget(it.type, p);
    fScene.remove(fDrag.ghost); dispose(fDrag.ghost);
    const r = canvas.getBoundingClientRect(), overCanvas = ev.clientX > r.left && ev.clientX < r.right && ev.clientY > r.top && ev.clientY < r.bottom;
    if (!overCanvas || Math.hypot(ev.clientX - fDrag.sx, ev.clientY - fDrag.sy) < 8) hint(`${it.name}: 끌어서 작업대에 놓아요`);
    else if (!tgt) hint(it.type === 'source' || it.type === 'laserkit' ? '광원은 왼쪽 광원 자리에 놓아요' : ['medium','pump','mirror'].includes(it.type) ? '이 부품은 레이저 공진기 칸에 놓아요' : '렌즈 · 편광판은 경통 안에 놓아요');
    else if (tgt.src){
      if (it.type === 'laserkit'){ F.source = 'laser'; F.medium = F.medium || 'argon'; F.pump = F.pump || 1; F.mirror = true; }
      else F.source = it.value;
      F.sel = {kind:F.source === 'laser' ? 'medium' : 'source'}; hint(`${it.name}로 바꿨어요`); fChanged(true);
    } else if (tgt.cavity){
      if (!fIsLaser() && !F.learn){ hint('먼저 레이저 공진기를 광원 자리에 놓아요'); }
      else {
        if (!fIsLaser()) F.source = 'laser';
        if (it.type === 'medium'){ F.medium = it.value; F.sel = {kind:'medium'}; }
        else if (it.type === 'pump'){ F.pump = it.value; F.sel = {kind:'pump'}; }
        else { F.mirror = true; F.sel = {kind:'mirror'}; }
        hint(`${it.name} 장착`); fChanged(true);
      }
    } else {
      const isPol = it.type === 'pol', lim = F.kind === 'weapon' ? {lens:2, pol:1} : {lens:3, pol:3};
      const nPol = F.free.filter(e => e.type === 'pol').length, nLens = F.free.length - nPol;
      if (isPol && nPol >= lim.pol) hint(`편광판은 ${lim.pol}장까지 놓을 수 있어요`);
      else if (!isPol && nLens >= lim.lens) hint(`렌즈는 ${lim.lens}개까지 놓을 수 있어요`);
      else { const e = {id:F.nextId++, type:it.type, x:tgt.cm}; if (isPol) e.theta = 45; else e.f = defaultF(it.type, tgt.cm); F.free.push(e); F.sel = {kind:'free', id:e.id}; hint(`${it.name}을 경통 ${tgt.cm} cm에 놓았어요`); fChanged(true); }
    }
  } else if (fDrag.mode === 'move' && !fDrag.moved){ F.sel = fDrag.pick.kind === 'dummy' ? {kind:'dummy'} : {kind:'free', id:fDrag.pick.id}; fChanged(true); }
  else if (fDrag.mode === 'move') fRenderEditor();
  else if (fDrag.mode === 'tap'){ F.sel = {kind:fDrag.pick.kind}; fChanged(true); }
  fDrag = null;
}
function fCancel(){ if (fDrag && fDrag.ghost){ fScene.remove(fDrag.ghost); dispose(fDrag.ghost); } fDrag = null; }
let fPending = null;
function fChangedSoon(){ if (fPending) return; fPending = requestAnimationFrame(() => { fPending = null; fChanged(false); }); }
function fChanged(rebuild){ if (F.learn){ F.fired = false; F.result = null; fSync(); learnPanel(); renderParts(); return; } fSync(); if (G.dept === 'test'){ if (rebuild) testPanel(); else fRefreshTest(); return; } if (rebuild) fRenderEditor(); else fRefresh(); }
const fSelFree = () => F.sel && F.sel.kind === 'free' ? F.free.find(e => e.id === F.sel.id) : null;
const fFreeName = e => e.type === 'convex' ? '볼록 렌즈' : e.type === 'concave' ? '오목 렌즈' : '편광판';
function setBarrel(L){ if (F.kind === 'weapon' && L > 40) return; F.barrel = L; for (const e of F.free) e.x = clamp(e.x, 1, L - 1); }

/* ═════════ 대장간 창 (부서) ═════════ */
const DEPTS = [['research','연구부'],['design','설계부'],['test','실험부'],['craft','제작부']];
function deptHead(){
  return `<div class="sec"><div class="seg seg4">${DEPTS.map(([k, t]) => `<button type="button" data-dept="${k}" aria-pressed="${G.dept===k}">${t}</button>`).join('')}</div></div>`;
}
function forgePanel(){
  if (G.dept === 'research') return researchPanel();
  if (G.dept === 'craft') return craftPanel();
  if (F.learn) return learnPanel();
  if (G.dept === 'test') return testPanel();
  const list = G.designs.filter(d => d.kind === F.kind);
  $('panel').innerHTML = deptHead() + `
    <div class="sec">
      <div class="seg"><button type="button" data-act="learnOn" aria-pressed="false">문제 풀기</button><button type="button" data-act="learnOff" aria-pressed="true">자유 설계</button></div>
      <div class="seg"><button type="button" data-fkind="tower" aria-pressed="${F.kind==='tower'}">탑 설계</button><button type="button" data-fkind="weapon" aria-pressed="${F.kind==='weapon'}">주인공 무기</button></div>
      <h2>설계도 불러오기</h2>
      <div class="chips">${list.map(d => `<button class="chip ${F.sourceId===d.id?'on':''}" type="button" data-fload="${d.id}">${needsLaser(d) ? '🔒 ' : ''}${d.name}</button>`).join('')}<button class="chip" type="button" data-fnew="1">+ 빈 설계</button></div>
    </div>
    <div class="sec"><h2>경통 길이 · 길수록 비싸요</h2><div class="seg">${BARRELS.map(b => `<button type="button" data-fbar="${b.L}" aria-pressed="${F.barrel===b.L}" ${F.kind === 'weapon' && b.L > 40 ? 'disabled' : ''}>${b.L}cm${b.price ? ` · ${b.price}G` : ''}</button>`).join('')}</div>
      <p class="muted">${F.kind === 'weapon' ? '주인공 무기는 들고 다녀야 해서 40 cm까지예요. ' : ''}경통 안은 cm, 실험부 사격장은 m예요. 광원이 렌즈에서 멀수록(a가 클수록) 상의 배율 b/a가 작아져서 빛이 작게 모여요.</p></div>
    <div class="sec"><h2>조합식</h2><div class="chips" id="fchips"></div></div>
    <div class="sec" id="feditor"></div>
    <div class="sec" id="fquick"></div>
    <div class="sec" id="fsave"></div>`;
  fRenderEditor();
}
function lensEditor(e){
  return `<div class="range"><label for="sX">경통 안 위치 <b id="vX"></b></label><input id="sX" type="range" min="1" max="${F.barrel - 1}" step="1" value="${e.x}"></div>
    <div class="num"><label for="nF">초점 거리 f (cm) · 1 m = 100 cm</label>
      <div class="stepper"><button type="button" data-fstep="-1" aria-label="1 cm 줄이기">−</button><input id="nF" type="number" inputmode="decimal" value="${e.f}" min="1" max="9999" step="0.1"><span>cm</span><button type="button" data-fstep="1" aria-label="1 cm 늘리기">+</button></div>
      <div class="fine">${[-100, -10, -.1, .1, 10, 100].map(s => `<button type="button" data-fstep="${s}">${s > 0 ? '+' : '−'}${Math.abs(s)}</button>`).join('')}</div>
      <input id="sFl" type="range" min="0" max="4000" step="1" value="${Math.round(Math.log10(e.f)*1000)}" aria-label="초점 거리 크게 바꾸기"></div>`;
}
function fRenderEditor(){
  const el = $('feditor'); if (!el) return;
  const k = F.sel && F.sel.kind; let h = '';
  if (k === 'source' && !fIsLaser()){
    const S = SOURCES[F.source];
    h = `<div class="ed-head"><h3>광원 · ${S.name}</h3></div>
      <div class="seg">${LAMP_IDS.map(id => `<button type="button" aria-pressed="${F.source===id}" data-fsrc="${id}"><i style="background:${SOURCES[id].color}"></i>${SOURCES[id].name}</button>`).join('')}</div>
      ${F.source === 'disp' ? `<h2>켜 둘 화소</h2><div class="seg">${Object.entries(PIX).map(([k2, p]) => `<button type="button" aria-pressed="${F.pix===k2}" data-fpix="${k2}">${p.color ? `<i style="background:${p.color}"></i>` : ''}${p.name}</button>`).join('')}</div>` : ''}
      <div class="eq" id="fex"></div>`;
  } else if (k === 'medium' && fIsLaser()){
    h = `<div class="ed-head"><h3>매질 · ${MEDIA[F.medium].name}</h3></div>
      <div class="seg">${MEDIA_LIST.filter(mediumOk).map(m => `<button type="button" aria-pressed="${F.medium===m.id}" data-fmed="${m.id}"><i style="background:${m.color}"></i>${m.nm}</button>`).join('')}</div><div class="eq" id="fex"></div>`;
  } else if (k === 'pump' && fIsLaser()){
    h = `<div class="ed-head"><h3>펌핑 램프</h3></div><div class="seg">${PUMPS.filter(pumpOk).map(q => `<button type="button" aria-pressed="${F.pump===q.lv}" data-fpump="${q.lv}">${q.label}</button>`).join('')}</div><div class="eq" id="fex"></div><canvas id="rplot" class="spec" aria-label="반사율과 출력 그래프"></canvas>`;
  } else if (k === 'mirror' && fIsLaser()){
    h = `<div class="ed-head"><h3>출력 거울</h3><span>심화 · 시험 범위 밖</span></div><div class="range"><label for="sR">반사율 R <b id="vR"></b></label><input id="sR" type="range" min="60" max="99" step="1" value="${Math.round(F.R*100)}"></div>
      <canvas id="rplot" class="spec" aria-label="반사율과 출력 그래프"></canvas><p class="muted">R이 너무 낮으면 빛이 다 새어 나가 발진을 못 하고, 너무 높으면 안에만 갇혀서 밖으로 나오는 빛이 적어요. 그래서 중간 어딘가에 최고점이 있어요.</p><div class="eq" id="fex"></div>`;
  } else if (k === 'barrel'){
    h = `<div class="ed-head"><h3>경통 · ${F.barrel} cm</h3></div><p class="muted">위 '경통 길이'에서 바꿔요. 렌즈는 경통 안(1 ~ ${F.barrel - 1} cm)에만 놓을 수 있어요.</p>`;
  } else if (k === 'free' && fSelFree()){
    const e = fSelFree();
    h = `<div class="ed-head"><h3>${fFreeName(e)}</h3><button class="rm" type="button" data-frm="free">빼기</button></div>` +
      (e.type === 'pol' ? `<div class="range"><label for="sX">경통 안 위치 <b id="vX"></b></label><input id="sX" type="range" min="1" max="${F.barrel - 1}" step="1" value="${e.x}"></div><div class="range"><label for="sT">투과축 θ <b id="vT"></b></label><input id="sT" type="range" min="0" max="180" step="5" value="${e.theta}"></div>` : lensEditor(e)) + `<div class="eq" id="fex"></div>`;
  } else h = `<div class="ed-head"><h3>부품을 눌러 보세요</h3></div><p class="muted">작업대 위 부품을 누르면 여기서 값을 바꿔요. 새 부품은 왼쪽 부품함에서 끌어다 경통 안에 놓아요. 맞히는 결과는 실험부에서 봐요.</p>`;
  el.innerHTML = h; fRefresh();
}
function drawSpectrum(cv, d, W){
  if (!cv) return;
  const w = cv.clientWidth, h = cv.clientHeight, r = Math.min(2, window.devicePixelRatio || 1); cv.width = w*r; cv.height = h*r;
  const g = cv.getContext('2d'); g.setTransform(r, 0, 0, r, 0, 0);
  const pad = {l:8, r:8, t:8, b:18}, e0 = .4, e1 = 6.6, xs = E => pad.l + (E - e0)/(e1 - e0)*(w - pad.l - pad.r);
  const sp = specOf(d), max = Math.max(...sp.map(([, x]) => x));
  g.fillStyle = 'rgba(255,100,116,.10)'; g.fillRect(pad.l, pad.t, xs(W) - pad.l, h - pad.t - pad.b);
  for (const [nm, x] of sp){
    const E = 1240/nm, X = xs(E), hh = (x/max)*(h - pad.t - pad.b);
    const hue = nm < 380 ? 275 : nm > 700 ? 0 : 270 - (nm - 380)/(320)*270;
    g.fillStyle = nm > 700 ? 'rgba(160,60,60,.8)' : `hsl(${hue},85%,${nm < 380 ? 70 : 60}%)`;
    g.fillRect(X - 2, h - pad.b - hh, sp.length > 20 ? 3 : 5, hh);
  }
  g.strokeStyle = '#ff6474'; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(xs(W), pad.t); g.lineTo(xs(W), h - pad.b); g.stroke(); g.setLineDash([]);
  g.fillStyle = '#8e98b0'; g.font = '10px "JetBrains Mono", monospace'; g.textAlign = 'center';
  for (const E of [1, 2, 3, 4, 5, 6]) g.fillText(`${E}eV`, xs(E), h - 4);
  g.fillStyle = '#ff6474'; g.textAlign = 'left'; g.fillText(`W ${W}`, xs(W) + 4, pad.t + 9);
}
function plotSetup(cv){ const w = cv.clientWidth, h = cv.clientHeight, r = Math.min(2, window.devicePixelRatio || 1); cv.width = w*r; cv.height = h*r; const g = cv.getContext('2d'); g.setTransform(r, 0, 0, r, 0, 0); return {g, w, h}; }
/* 출력 거울 반사율 R → 레이저 출력 (심화) */
function drawRPlot(cv){
  if (!cv || !F.pump) return;
  const {g, w, h} = plotSetup(cv), pad = {l:30, r:8, t:10, b:18}, xs = R => pad.l + (R - .5)/(.995 - .5)*(w - pad.l - pad.r);
  let mx = 0; const pts = []; for (let R = .5; R <= .995; R += .005){ const p = powerAt(F.pump, R, F.loss ?? LOSS); pts.push([R, p]); mx = Math.max(mx, p); }
  const top = Math.max(mx, .05), ys = p => h - pad.b - p/top*(h - pad.t - pad.b);
  g.strokeStyle = '#26324d'; g.beginPath(); g.moveTo(pad.l, pad.t); g.lineTo(pad.l, h - pad.b); g.lineTo(w - pad.r, h - pad.b); g.stroke();
  g.strokeStyle = '#ffd166'; g.lineWidth = 2; g.beginPath(); pts.forEach(([R, p], i) => i ? g.lineTo(xs(R), ys(p)) : g.moveTo(xs(R), ys(p))); g.stroke(); g.lineWidth = 1;
  const cur = powerAt(F.pump, F.R, F.loss ?? LOSS);
  g.strokeStyle = '#ff8a3d'; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(xs(F.R), pad.t); g.lineTo(xs(F.R), h - pad.b); g.stroke(); g.setLineDash([]);
  g.fillStyle = '#ff8a3d'; g.beginPath(); g.arc(xs(F.R), ys(cur), 4, 0, Math.PI*2); g.fill();
  g.fillStyle = '#8e98b0'; g.font = '10px "JetBrains Mono", monospace'; g.textAlign = 'center';
  for (const R of [.5, .6, .7, .8, .9, 1]) g.fillText(`${Math.round(R*100)}%`, xs(Math.min(R, .995)), h - 4);
  g.textAlign = 'left'; g.fillText('출력', 2, pad.t + 8); g.fillText(`R ${Math.round(F.R*100)}% → ${(cur*LASER_MW).toFixed(1)} mW`, pad.l + 6, pad.t + 8);
}
/* 거리별 초당 데미지 (실험부) */
function drawDistPlot(cv){
  if (!cv || !fReady()) return;
  const {g, w, h} = plotSetup(cv), pad = {l:30, r:8, t:10, b:18}, d = fDesign(), foe = fFoe(), arm = fArmor();
  const xs = m => pad.l + m/100*(w - pad.l - pad.r); const pts = []; let mx = 0;
  for (let m = 1; m <= 100; m++){ const r = hitD(d, foe, m, arm); pts.push([m, r.v, r.sat]); mx = Math.max(mx, r.v); }
  const top = Math.max(mx, 1), ys = v => h - pad.b - v/top*(h - pad.t - pad.b);
  g.strokeStyle = '#26324d'; g.beginPath(); g.moveTo(pad.l, pad.t); g.lineTo(pad.l, h - pad.b); g.lineTo(w - pad.r, h - pad.b); g.stroke();
  for (let i = 1; i < pts.length; i++){ g.strokeStyle = pts[i][2] ? '#ff8a3d' : '#7fd3ff'; g.lineWidth = 2; g.beginPath(); g.moveTo(xs(pts[i-1][0]), ys(pts[i-1][1])); g.lineTo(xs(pts[i][0]), ys(pts[i][1])); g.stroke(); }
  g.lineWidth = 1; g.strokeStyle = '#e8ecf4'; g.setLineDash([4, 3]); g.beginPath(); g.moveTo(xs(F.dummy.x), pad.t); g.lineTo(xs(F.dummy.x), h - pad.b); g.stroke(); g.setLineDash([]);
  g.fillStyle = '#8e98b0'; g.font = '10px "JetBrains Mono", monospace'; g.textAlign = 'center';
  for (const m of [0, 20, 40, 60, 80, 100]) g.fillText(`${m}m`, xs(m), h - 4);
  g.textAlign = 'left'; g.fillText(`최대 ${mx.toFixed(0)}/초`, pad.l + 6, pad.t + 8);
}
function lensInfoHtml(e, inf){
  const {a, b} = lensAB(inf), fs = e.type === 'convex' ? e.f : -e.f;
  const aTxt = !isFinite(a) ? '∞ (평행광)' : a > 0 ? `${r1(a)} cm (${fIsLaser() ? '퍼지며 들어옴' : '광원까지 거리'})` : `${r1(a)} cm (허물체)`;
  const bTxt = !isFinite(b) ? '∞ → 평행광으로 나가요' : b > 0 ? `${fmtLen(b)} → 광원에서 ${fmtLen(e.x + b)} 지점에 ${fIsLaser() ? '초점' : '실상'}` : `${fmtLen(b)} → 허상 (모이지 않고 퍼짐)`;
  let extra = '';
  if (isFinite(a) && a > 0 && isFinite(b) && b > 0 && !fIsLaser()){ const m = b/a, s = SOURCES[F.source].s; extra = `<br>배율 b/a = ${r1(m)}배 → 상의 반지름 ≈ ${s} × ${r1(m)} = <b>${fmtLen(s*m)}</b>`; }
  return `1/a + 1/b = 1/f (f = ${fs > 0 ? '+' : '−'}${fmtF(e.f)})<br>a = ${aTxt}<br>b = ${bTxt}${extra}`;
}
function fRefresh(){
  if (!$('fchips')) return;
  const c = [], chip = (sel, text, on, miss) => `<button class="chip ${on?'on':''} ${miss?'miss':''}" type="button" data-fsel="${sel}">${text}</button>`;
  if (fIsLaser()){
    c.push(chip('medium', F.medium ? `${MEDIA[F.medium].name} ${MEDIA[F.medium].nm}nm` : '매질 ?', fIsSel('medium'), !F.medium));
    c.push(chip('pump', F.pump ? PUMPS[F.pump-1].label : '펌핑 ?', fIsSel('pump'), !F.pump));
    c.push(chip('mirror', `R ${Math.round(F.R*100)}%`, fIsSel('mirror')));
  } else c.push(chip('source', SOURCES[F.source].name + (F.source === 'disp' && F.pix !== 'w' ? `(${PIX[F.pix].name})` : ''), fIsSel('source')));
  c.push(chip('barrel', `경통 ${F.barrel}cm`, fIsSel('barrel')));
  for (const e of F.free.slice().sort((a, b) => a.x - b.x)) c.push(chip(`free:${e.id}`, e.type === 'pol' ? `편광 ${e.theta}° @${e.x}cm` : `${e.type === 'convex' ? '볼록' : '오목'} f${fmtF(e.f).replace(' ', '')} @${e.x}cm`, fIsSel('free', e.id)));
  $('fchips').innerHTML = c.join('<span class="bond"></span>');
  const all = fTrace(1e6), d = fDesign();
  const set = (id, v) => { const n = $(id); if (n) n.innerHTML = v; }, k = F.sel && F.sel.kind;
  if (k === 'source' && !fIsLaser()){
    const S = SOURCES[F.source];
    set('fex', `${S.sub}<br>${S.pol == null ? '편광 안 된 빛 → 첫 편광판에서 세기 ½' : `이미 ${S.pol}° 편광 → 첫 편광판부터 cos²(각도 차)`}<br>광원 반지름 ${S.s} cm · 광출력 ${srcPower(d)} mW · 전기 ${S.draw} ⚡/초` +
      (F.source === 'disp' ? `<br>${F.pix === 'w' ? 'R 620 · G 535 · B 455 nm 세 화소를 다 켜요' : `${PIX[F.pix].name} 화소만 · ${PIX[F.pix].nm} nm · E = ${(1240/PIX[F.pix].nm).toFixed(2)} eV · 세기 ⅓`}` : ''));
  } else if (k === 'medium' && fIsLaser()){
    const E = 1240/MEDIA[F.medium].nm; set('fex', `E = hc/λ = 1240 / ${MEDIA[F.medium].nm} = <b>${E.toFixed(2)} eV</b> · 단색광`);
  } else if (k === 'pump' && fIsLaser()){ set('fex', `왕복 이득 g₀ = ${Math.round(PUMPS[F.pump-1].g0*100)}% · 밀도 반전이 클수록 이득이 커요`); drawRPlot($('rplot')); }
  else if (k === 'mirror' && fIsLaser()){ const T = 1 - F.R, g0 = PUMPS[F.pump-1].g0, p = fPower(); set('vR', `${Math.round(F.R*100)}%`); set('fex', `T = ${(T*100).toFixed(0)}% · 손실 ${LOSS*100}% → ${g0 > T + LOSS ? '<span class="ok">발진</span>' : '<span class="warn">발진 안 함</span>'} · 출력 ${p.toFixed(1)} mW`); drawRPlot($('rplot')); }
  else if (k === 'free' && fSelFree()){
    const e = fSelFree(), inf = all.info[e.id];
    set('vX', `${e.x} cm`);
    if (e.type === 'pol'){
      set('vT', `${e.theta}°`);
      const plates = F.free.filter(q => q.type === 'pol').sort((p, q) => p.x - q.x), s0 = srcOf(d).pol;
      let pol = s0, t = 1; const lines = [s0 == null ? `${SOURCES[F.source].name}: 편광 안 된 빛(자연광)` : `${fIsLaser() ? '레이저' : SOURCES[F.source].name}: 처음부터 ${s0}° 선형 편광`];
      for (const q of plates){ const v = pol == null ? .5 : cos2(q.theta - pol); t *= v; lines.push(`${q.x} cm 판 ${q.theta}°: ${pol == null ? '자연광 → ½' : `cos²(${q.theta}° − ${pol}°)`} = ${v.toFixed(3)} → 누적 <b>${t.toFixed(3)}</b>${q.id === e.id ? ' ◀' : ''}`); pol = q.theta; }
      set('fex', lines.join('<br>'));
    } else {
      const nf = $('nF'); if (nf && document.activeElement !== nf) nf.value = e.f;
      const sl = $('sFl'); if (sl) sl.value = Math.round(Math.log10(e.f)*1000);
      set('fex', inf ? lensInfoHtml(e, inf) : '');
    }
  }
  const p = fPower(), imgs = fImages();
  set('fquick', `<h2>요약</h2><div class="rows">
      <div class="row"><span>광출력</span><b>${p ? p.toFixed(1) : 0} mW</b></div>
      <div class="row"><span>경통 출구 빔 반지름</span><b>${fReady() ? fmtLen(fTrace(F.barrel).w) : '-'}</b></div>
      <div class="row"><span>${fIsLaser() ? '초점' : '광원의 상'} 위치</span><b>${imgs.length ? imgs.map(i => fmtLen(i.at)).join(', ') : '없음 (퍼지거나 평행)'}</b></div>
      <div class="row"><span>전기</span><b>${fReady() ? drawOf(d).toFixed(2) : '-'} ⚡/초</b></div></div>
    <button class="btn" type="button" data-dept="test">실험부에서 쏴 보기 →</button>`);
  const ok = fReady() && p, src = F.sourceId ? G.designs.find(q => q.id === F.sourceId) : null, isPreset = src && PRESETS.some(q => q.id === src.id);
  let s = `<h2>설계도 저장</h2>`;
  if (!ok) s += `<p class="muted">빛이 나와야 저장할 수 있어요.</p>`;
  else s += `<p class="muted">저장은 무료예요. 실제 물건은 제작부에서 만들어요 (재료비 ${costOf(fDesign())}G · 작업량 ${workOf(fDesign())}).</p><div class="btns">${src && !isPreset ? `<button class="btn" type="button" data-fsave="over">덮어쓰기</button>` : ''}<button class="btn primary" type="button" data-fsave="new">새 설계도로 저장</button></div>`;
  set('fsave', s);
}
/* 실험부 창: 표적 · 전기 계산 */
function elecHtml(hit, foe, armor){
  if (!hit.v) return `<div class="eq"><span class="warn">0 · ${hit.why}</span>${hit.why === 'E < W' ? `<br>어떤 광자도 일함수 ${foe.W} eV를 못 넘어요. 세기를 올려도 소용없어요 → 진동수를 올려요.` : hit.why === '편광 차단' ? '<br>편광 방향과 갑옷 투과축이 수직이에요.' : ''}</div>`;
  const lim = hit.sat ? `IR = ${(hit.Itot*foe.R).toFixed(2)} V &gt; V₀ → <span class="gold">전압 포화</span> · u = ${hit.u.toFixed(2)} V<br>→ 세기를 올려도 그대로, 진동수를 올려야 세져요` : `IR = ${hit.u.toFixed(2)} V &lt; V₀ → <span class="ok">전류 제한</span><br>→ 빛을 더 모으면(세기↑) 더 세져요`;
  return `<div class="eq">빔 반지름 ${fmtLen(hit.w)} → 급소(반지름 ${RT} cm)에 ${(hit.frac*100).toFixed(hit.frac < .01 ? 2 : 1)}%${hit.t < 1 ? ` · 편광 투과 ${hit.t.toFixed(3)}` : ''}<br>
    들어간 빛 ${hit.Ph < .1 ? hit.Ph.toFixed(3) : hit.Ph.toFixed(2)} mW → 광전류 I = Σ P/E = <b>${hit.Itot < .01 ? hit.Itot.toFixed(4) : hit.Itot.toFixed(3)} mA</b><br>
    정지 전압 V₀ = E − W = <b>${hit.V0.toFixed(2)} V</b> · 저항 R = ${foe.R} kΩ<br>${lim}<br>
    전력 P = u²/R = ${hit.P < .01 ? hit.P.toFixed(4) : hit.P.toFixed(3)} mW × ${DMG_K}${hit.scale !== 1 ? ` × ${hit.scale.toFixed(2)}` : ''} = <b>${hit.v.toFixed(1)}/초</b></div>`;
}
function testPanel(){
  const foe = fFoe(), armor = fArmor();
  $('panel').innerHTML = deptHead() + `
    <div class="sec">
      <div class="seg"><button type="button" data-act="learnOn" aria-pressed="false">문제 풀기</button><button type="button" data-act="learnOff" aria-pressed="true">자유 설계</button></div>
      <div class="ed-head"><h3>시험 표적</h3><span>${F.kind === 'weapon' ? '주인공 무기' : '탑'} · 경통 ${F.barrel} cm</span></div>
      <div class="seg">${Object.entries(FOES).map(([id, f]) => `<button type="button" aria-pressed="${F.dummy.foe===id}" data-ffoe="${id}"><i style="background:${f.color}"></i>${f.short}</button>`).join('')}</div>
      ${F.dummy.foe === 'kn' ? `<div class="range"><label for="sA">기사 갑옷 투과축 <b id="vA">${armor}°</b></label><input id="sA" type="range" min="0" max="180" step="15" value="${armor}"></div>` : ''}
      <div class="range"><label for="sD">표적 거리 <b id="vD">${F.dummy.x} m</b></label><input id="sD" type="range" min="1" max="100" step="1" value="${F.dummy.x}"></div>
      <p class="muted">${foe.name} · 일함수 W = ${foe.W} eV · 저항 R = ${foe.R} kΩ${armor != null ? ` · 갑옷 ${armor}°` : ''}</p>
    </div>
    <div class="sec" id="fresult"></div>
    <div class="sec"><button class="btn" type="button" data-dept="design">← 설계부에서 고치기</button></div>`;
  fRefreshTest();
}
function fRefreshTest(){
  const el = $('fresult'); if (!el) return;
  const foe = fFoe(), armor = fArmor(), hit = fHit(), d = fDesign(), bd = fReady() ? band(d) : null;
  const set = (id, v) => { const n = $(id); if (n) n.innerHTML = v; };
  set('vD', `${F.dummy.x} m`); set('vA', `${armor ?? ''}°`);
  el.innerHTML = `<h2>결과 · ${foe.name} @ ${F.dummy.x} m</h2>
    <div class="big"><b class="${hit.v ? '' : 'zero'}">${hit.v ? hit.v.toFixed(1) : `0 · ${hit.why}`}</b><span>초당 데미지</span></div>
    ${elecHtml(hit, foe, armor)}
    ${fReady() ? `<h2>거리별 데미지 · 주황 = 전압 포화</h2><canvas id="dplot" class="spec" aria-label="거리별 데미지"></canvas>
    <h2>스펙트럼 · 빨간 선 = 일함수</h2><canvas id="spec" class="spec" aria-label="광원 스펙트럼"></canvas><p class="muted">선 오른쪽 광자만 전자를 떼어 내요. 선에서 멀수록 정지 전압이 커요.</p>` : ''}
    <div class="rows"><div class="row"><span>빛이 가장 잘 모이는 구간</span><b>${bd ? `${bd[0]}–${bd[1]} m` : '-'}</b></div><div class="row"><span>전기</span><b>${fReady() ? drawOf(d).toFixed(2) : '-'} ⚡/초</b></div></div>`;
  if (fReady()){ drawDistPlot($('dplot')); drawSpectrum($('spec'), d, foe.W); }
}
function autoName(d){
  const lens = d.els.find(e => e.type !== 'pol'), pol = hasPol(d), base = isLaser(d) ? MEDIA[d.medium].name : srcOf(d).name;
  return `${base}${pol ? ' 편광' : ''}${lens ? (lens.type === 'convex' ? ' 집광' : ' 확산') : ''}${d.kind === 'weapon' ? '총' : '탑'} ${G.nextDesign}`;
}
function fSave(how){
  const d = fDesign(); delete d.loss;
  if (how === 'over'){ const src = G.designs.find(q => q.id === F.sourceId); Object.assign(src, d, {id:src.id, name:src.name}); hint(`${src.name} 덮어쓰기 완료`); return; }
  const nd = Object.assign(d, {id:'d' + G.nextDesign, name:autoName(d)}); G.nextDesign++;
  G.designs.push(nd); F.sourceId = nd.id; hint(`${nd.name} 저장 · 제작부에서 만들 수 있어요`);
}

/* ═════════ 연구부 (블루프린트) ═════════ */
const RESEARCH = [
  {id:'laser', name:'레이저', desc:'유도 방출로 빛을 증폭하는 광원. 단색 · 지향성 · 집속성 · 가간섭성', cost:300, exam:true, unit:'23번 레이저', art:'cavity'},
  {id:'doublet', name:'겹렌즈 · 수차 보정', desc:'볼록 · 오목 렌즈를 겹쳐 수차를 줄여요. 레이저를 모을 수 있는 최소 반지름 1.0 → 0.82 cm', cost:150, req:'laser', unit:'20번 수차', art:'doublet'},
  {id:'ap1', name:'대구경 렌즈 Ⅰ', desc:'렌즈 지름을 키우면 회절로 퍼지는 정도가 줄어요. 0.82 → 0.67 cm', cost:300, req:'doublet', unit:'회절 한계', art:'lens'},
  {id:'ap2', name:'대구경 렌즈 Ⅱ', desc:'0.67 → 0.5 cm (급소 크기와 같아져요)', cost:600, req:'ap1', unit:'회절 한계', art:'lens'},
  {id:'pump4', name:'펌핑 Ⅳ', desc:'왕복 이득 g₀ 45% 램프', cost:200, req:'laser', unit:'23번 밀도 반전', art:'pump'},
  {id:'pump5', name:'펌핑 Ⅴ', desc:'왕복 이득 g₀ 55% 램프', cost:400, req:'pump4', unit:'23번 밀도 반전', art:'pump'},
  {id:'krf', name:'KrF 엑시머 248 nm', desc:'더 짧은 파장 → 광자 에너지 5.0 eV → 정지 전압 ↑. 전압이 막히는 단단한 적에게 세요', cost:450, req:'pump4', unit:'22번 광전 효과', art:'excimer'},
  {id:'arf', name:'ArF 엑시머 193 nm', desc:'광자 에너지 6.4 eV. 골렘도 전압 포화로 녹여요', cost:800, req:'krf', unit:'22번 광전 효과', art:'excimer'},
];
const BP_ART = {
  cavity:'<svg viewBox="0 0 160 50"><line x1="10" y1="25" x2="150" y2="25" stroke-dasharray="4 3"/><rect x="18" y="8" width="5" height="34"/><rect x="137" y="8" width="5" height="34"/><rect x="50" y="17" width="60" height="16" rx="3"/><path d="M50 10 h60 M50 40 h60" stroke-dasharray="2 3"/><text x="80" y="49">유도 방출</text></svg>',
  doublet:'<svg viewBox="0 0 160 50"><line x1="5" y1="25" x2="155" y2="25" stroke-dasharray="4 3"/><path d="M70 5 Q80 25 70 45 Q60 25 70 5"/><path d="M84 5 Q78 25 84 45 L92 45 Q86 25 92 5 Z"/><path d="M10 15 L70 15 L130 25 M10 35 L70 35 L130 25"/></svg>',
  lens:'<svg viewBox="0 0 160 50"><line x1="5" y1="25" x2="155" y2="25" stroke-dasharray="4 3"/><path d="M70 2 Q90 25 70 48 Q50 25 70 2"/><path d="M10 6 L70 6 L135 25 M10 44 L70 44 L135 25"/><circle cx="135" cy="25" r="2"/><text x="100" y="12">D ↑ · 점 ↓</text></svg>',
  pump:'<svg viewBox="0 0 160 50"><path d="M15 32 l10 -14 l10 14 l10 -14 l10 14 l10 -14 l10 14 l10 -14 l10 14 l10 -14 l10 14"/><line x1="15" y1="42" x2="125" y2="42"/><text x="132" y="30">E₂</text><text x="132" y="46">E₁</text></svg>',
  excimer:'<svg viewBox="0 0 160 50"><path d="M10 25 q5 -18 10 0 t10 0 t10 0 t10 0 t10 0 t10 0"/><path d="M80 25 q2.5 -18 5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0 t5 0"/><text x="40" y="47">λ 길게</text><text x="115" y="47">λ 짧게 · E ↑</text></svg>',
};
const LASER_QS = [
  {q:'LASER는 무엇의 약자일까요?', a:'유도 방출에 의한 빛의 증폭', w:['자발 방출에 의한 빛의 증폭', '빛의 흡수에 의한 증폭', '광전 효과에 의한 빛의 증폭']},
  {q:'유도 방출로 새로 나온 광자는 입사한 광자와 무엇이 같을까요?', a:'진동수 · 진행 방향 · 편광 · 위상이 모두 같다', w:['진동수만 같고 위상은 무작위다', '진행 방향만 같다', '에너지가 두 배다']},
  {q:'레이저에서 빛이 증폭되려면 어떤 상태가 필요할까요?', a:'준안정 상태의 원자 수가 바닥 상태보다 많은 밀도 반전', w:['바닥 상태의 원자가 더 많은 상태', '모든 원자가 바닥 상태인 상태', '원자가 모두 이온화된 상태']},
  {q:'백열등으로 이중 슬릿 실험을 하면 간섭무늬가 안 보이는 까닭은?', a:'원자마다 빛의 위상이 제각각이라 위상차가 계속 변해서', w:['백열등 빛은 파동이 아니라서', '백열등 빛의 진동수가 너무 높아서', '백열등 빛이 너무 밝아서']},
  {q:'같은 진동수의 레이저가 증폭될 때 맞는 것은?', a:'광자 한 개의 에너지는 그대로, 광자 수가 늘어난다', w:['광자 한 개의 에너지가 커진다', '광자 수는 그대로, 진동수가 커진다', '광자 수가 줄고 에너지가 커진다']},
  {q:'준안정 상태의 특징은?', a:'다른 들뜬 상태보다 오래(약 10⁻³초) 머무른다', w:['바닥 상태보다 에너지가 낮다', '10⁻⁸초보다 짧게 머무른다', '전자가 원자 밖으로 나간 상태다']},
  {q:'레이저 양쪽 거울 중 하나를 부분 반사 거울로 만드는 까닭은?', a:'증폭된 빛의 일부를 밖으로 내보내려고', w:['빛을 흡수해서 열을 줄이려고', '빛의 진동수를 바꾸려고', '밀도 반전을 없애려고']},
  {q:'레이저의 집속성이란?', a:'렌즈로 아주 작은 점에 빛을 모을 수 있는 성질', w:['여러 색이 섞여 있는 성질', '사방으로 고르게 퍼지는 성질', '편광판을 지나면 사라지는 성질']},
];
let exam = null;
function startExam(){ const pool = LASER_QS.slice().sort(() => Math.random() - .5).slice(0, 3); exam = pool.map(q => ({q:q.q, a:q.a, opts:[q.a, ...q.w].sort(() => Math.random() - .5), pick:null})); researchPanel(); }
function researchPanel(){
  const card = r => { const done = G.research[r.id], locked = r.req && !G.research[r.req], needExam = r.exam && !G.laserExam;
    let btn = '';
    if (!done){
      if (locked) btn = `<button class="btn" type="button" disabled>먼저: ${RESEARCH.find(q => q.id === r.req).name}</button>`;
      else if (needExam) btn = exam ? '' : `<button class="btn primary" type="button" data-act="exam">자격 시험 보기 (3문제)</button>`;
      else btn = `<button class="btn primary" type="button" data-research="${r.id}" ${G.gold >= r.cost ? '' : 'disabled'}>${G.gold >= r.cost ? `연구하기 · ${r.cost}G` : `골드 부족 · ${r.cost}G`}</button>`;
    }
    const ex = r.exam && exam && !G.laserExam ? `<div class="exam">${exam.map((q, i) => `<p>${i+1}. ${q.q}</p>${q.opts.map((o, j) => `<button type="button" class="opt ${q.pick===j?'on':''}" data-exq="${i}:${j}">${o}</button>`).join('')}`).join('')}<button class="btn primary" type="button" data-act="examSubmit" ${exam.every(q => q.pick != null) ? '' : 'disabled'}>제출</button></div>` : '';
    return `<div class="bpcard ${done ? 'done' : ''}"><div class="bph"><b>${r.name}</b><span>${done ? '완료' : r.unit}</span></div>${BP_ART[r.art] || ''}<p>${r.desc}</p>${btn}${ex}</div>`; };
  $('panel').innerHTML = deptHead() + `<div class="sec"><div class="ed-head"><h3>연구부</h3><span>레이저 최소 반지름 ${(LASER_WMIN/Math.sqrt(capMult()/4)).toFixed(2)} cm</span></div>
    ${RESEARCH.map(card).join('')}
    <p class="muted">레이저는 자격 시험(23번 레이저 내용 3문제)을 통과해야 연구할 수 있어요.</p></div>`;
}
/* ═════════ 제작부 ═════════ */
function craftPanel(){
  const inv = {}; for (const it of G.inventory){ const k = it.design.name + '|' + it.design.kind; (inv[k] = inv[k] || {d:it.design, items:[]}).items.push(it); }
  const slotsFree = craftSlots() - G.craft.length;
  const designs = G.designs.filter(d => d.kind === 'tower' || d.kind === 'weapon');
  $('panel').innerHTML = deptHead() + `<div class="sec"><div class="ed-head"><h3>제작부</h3><span>칸 ${G.craft.length}/${craftSlots()} · 밤마다 작업량 ${craftSpeed()}</span></div>
      <h2>제작 중</h2>
      ${G.craft.length ? G.craft.map(j => `<div class="job"><div class="row" style="border:0"><span><b style="color:var(--ink);font-family:var(--f-body)">${j.design.name}</b></span><b>${Math.max(1, Math.ceil((j.need - j.done)/craftSpeed()))}밤 남음</b></div><div class="bar"><i style="width:${Math.round(j.done/j.need*100)}%"></i></div></div>`).join('') : '<p class="muted">비어 있어요. 아래 설계도에서 제작을 시작하세요. 밤(웨이브)이 지나야 완성돼요.</p>'}
      <h2>창고</h2>
      ${Object.keys(inv).length ? Object.values(inv).map(g => `<div class="row"><span>${g.d.kind === 'weapon' ? '무기' : '탑'} · ${g.d.name}</span>${g.d.kind === 'weapon' ? `<span class="btns"><b>${g.items.length}개</b><button class="btn" type="button" data-equip="${g.items[0].uid}">주인공 장착</button></span>` : `<b>${g.items.length}개</b>`}</div>`).join('') : '<p class="muted">완성된 물건이 없어요.</p>'}
      <div class="row"><span>장착 중인 무기</span><b>${G.weapon.name}</b></div>
      <p class="muted">무기는 훈련소에서 쫄병에게 나눠 줄 수도 있어요.</p>
    </div>
    <div class="sec"><h2>설계도</h2><div class="bps">${designs.map(d => { const c = costOf(d), nights = Math.ceil(workOf(d)/craftSpeed()), lock = needsLaser(d);
      return `<div class="bp" style="cursor:default"><div class="bp-h"><i style="background:${beamColor(d)}"></i><b>${d.name}</b><span class="cost">${c}G</span></div>
        <div class="bp-f">${d.kind === 'weapon' ? '무기 · ' : ''}${formula(d)}</div>
        <div class="band">작업량 ${workOf(d)} → <b>${nights}밤</b> · 전기 ${drawOf(d).toFixed(2)} ⚡/초</div>
        <button class="btn primary" type="button" data-craft="${d.id}" ${!lock && slotsFree > 0 && G.gold >= c ? '' : 'disabled'}>${lock ? '🔒 연구 필요' : slotsFree <= 0 ? '제작 칸이 꽉 찼어요' : G.gold < c ? '골드 부족' : '제작 시작'}</button></div>`; }).join('')}</div></div>
    ${upgradeSec('craft', '제작부 업그레이드')}`;
}
function upgradeSec(b, title){
  return `<div class="sec"><h2>${title}</h2>${Object.entries(UPG).filter(([, u]) => u.b === b).map(([id, u]) => { const lv = up(id), max = lv >= u.max, c = max ? 0 : u.cost(lv);
    if (u.req && !labOk(u.req)) return `<div class="row"><span><b style="color:var(--ink);font-family:var(--f-body)">${u.name}</b><br>🔒 발전단지 광전 연구: ${LAB_NAMES[u.req]}</span><b>잠김</b></div>`;
    return `<div class="row"><span><b style="color:var(--ink);font-family:var(--f-body)">${u.name} Lv.${lv}</b><br>${max ? '최대' : u.eff(lv)}</span>${max ? '' : `<button class="btn" type="button" data-up="${id}" ${G.gold >= c ? '' : 'disabled'}>${c}G</button>`}</div>`; }).join('')}</div>`;
}
function startCraft(id){
  const d = G.designs.find(q => q.id === id); if (!d || needsLaser(d)) return;
  const c = costOf(d); if (G.gold < c || G.craft.length >= craftSlots()) return;
  G.gold -= c; G.craft.push({uid:nextUid++, design:copy(d), need:workOf(d), done:0});
  hint(`${d.name} 제작 시작 · ${Math.ceil(workOf(d)/craftSpeed())}밤 뒤 완성`);
}
function advanceCraft(){
  const doneNow = [];
  for (const j of G.craft){ j.done += craftSpeed(); if (j.done >= j.need - 1e-9){ G.inventory.push({uid:j.uid, design:j.design}); doneNow.push(j.design.name); } }
  G.craft = G.craft.filter(j => j.done < j.need - 1e-9);
  return doneNow;
}
