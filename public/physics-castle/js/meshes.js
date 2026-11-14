'use strict';
/* ═════════ v1.0 메쉬 업그레이드: 적 · 주인공 · 쫄병 · 탑 · 성벽 · 풍경 · 낮밤 ═════════ */
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
function canvasTex(w, h, draw, rx = 1, ry = 1){
  const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rx, ry); t.anisotropy = 4; return t;
}
let seed = 7; const srand = () => (seed = (seed*16807) % 2147483647)/2147483647;
const brickTex = (rx, ry) => canvasTex(256, 256, (x, w, h) => {
  x.fillStyle = '#3e4254'; x.fillRect(0, 0, w, h); const bh = 32, bw = 64;
  for (let r = 0; r < h/bh; r++) for (let c = -1; c <= w/bw; c++){ const ox = (r % 2)*bw/2, s = 150 + srand()*45; x.fillStyle = `rgb(${s - 8},${s - 4},${s + 14})`; x.fillRect(c*bw + ox + 3, r*bh + 3, bw - 6, bh - 6);
    x.fillStyle = 'rgba(0,0,0,.08)'; x.fillRect(c*bw + ox + 3, r*bh + bh - 9, bw - 6, 6); }
}, rx, ry);
const grassTex = canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#5f8a4a'; x.fillRect(0, 0, w, h);
  for (let i = 0; i < 2600; i++){ const g = 100 + srand()*70; x.fillStyle = `rgba(${g*.45|0},${g|0},${g*.35|0},.55)`; x.fillRect(srand()*w, srand()*h, 2, 2 + srand()*4); } }, 60, 60);
const dirtTex = canvasTex(128, 128, (x, w, h) => { x.fillStyle = '#7a6a52'; x.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++){ const g = 90 + srand()*60; x.fillStyle = `rgba(${g},${g*.85|0},${g*.65|0},.5)`; x.fillRect(srand()*w, srand()*h, 2, 2); } }, 8, 4);
const shade = (o, cast = true, recv = false) => { o.traverse(m => { if (m.isMesh){ m.castShadow = cast; m.receiveShadow = recv; } }); return o; };
const smooth = (c, o = {}) => std(c, Object.assign({roughness:.55}, o));
const basic = c => new THREE.MeshBasicMaterial({color:c});
function eyes(g, y, z, sep, r = .08, look = 0){
  for (const s of [-1, 1]){
    const w = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), basic(0xffffff)); w.position.set(s*sep, y, z); g.add(w);
    const p = new THREE.Mesh(new THREE.SphereGeometry(r*.55, 10, 8), basic(0x161a24)); p.position.set(s*sep + look, y, z - r*.6); g.add(p);
  }
}
const lathe = (pts, seg = 28) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);

/* ── 적 (발이 y = −오프셋, foeMesh가 위로 올려 줌) ── */
const FOE_OFF = {ag:.5, cs:.5, na:.6, ca:.6, kn:.5};
function foeBody(type, armor, mat){
  const outer = new THREE.Group(), g = new THREE.Group(); g.rotation.y = Math.PI; outer.add(g);   // 앞(눈 · 방패)이 성벽(+z)을 보게
  const _g = g, off = FOE_OFF[type] || .5; let body, anim;
  if (type === 'ag'){ // 산화세슘 젤리: 말랑한 반투명 방울
    mat.transparent = true; mat.opacity = .82; mat.roughness = .15;
    body = new THREE.Mesh(lathe([[0, 0], [.42, .04], [.5, .2], [.44, .42], [.26, .58], [0, .64]]), mat); body.position.y = -off; g.add(body);
    const core = new THREE.Mesh(new THREE.SphereGeometry(.16, 12, 10), new THREE.MeshBasicMaterial({color:0xffe1f2})); core.position.y = -off + .28; g.add(core);
    eyes(g, -off + .4, -.38, .14, .07);
    anim = t => { const s = 1 + .09*Math.sin(t*9); body.scale.set(1/Math.sqrt(s), s, 1/Math.sqrt(s)); };
  } else if (type === 'cs'){ // 세슘 슬라임: 물방울 모양 + 반짝이
    body = new THREE.Mesh(lathe([[0, 0], [.56, .05], [.6, .22], [.46, .5], [.22, .78], [.04, .95], [0, .97]]), mat); body.position.y = -off; g.add(body);
    const hi = new THREE.Mesh(new THREE.SphereGeometry(.1, 10, 8), new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:.75})); hi.position.set(-.2, -off + .62, -.3); hi.scale.set(1, 1.6, .6); g.add(hi);
    eyes(g, -off + .42, -.5, .17, .09);
    anim = t => { const s = 1 + .07*Math.sin(t*7); body.scale.set(1/Math.sqrt(s), s, 1/Math.sqrt(s)); };
  } else if (type === 'na'){ // 나트륨 고블린
    const skin = mat;
    body = new THREE.Mesh(lathe([[0, 0], [.3, .02], [.36, .3], [.3, .6], [.18, .72], [0, .74]]), skin); body.position.y = -off + .28; g.add(body);
    const head = new THREE.Mesh(new THREE.SphereGeometry(.27, 18, 14), skin); head.position.y = -off + 1.12; g.add(head);
    for (const s of [-1, 1]){ const ear = new THREE.Mesh(new THREE.ConeGeometry(.09, .42, 10), skin); ear.position.set(s*.32, -off + 1.18, 0); ear.rotation.z = -s*1.25; g.add(ear);
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(.08, .07, .3, 8), smooth(0x5a4a2a)); leg.position.set(s*.13, -off + .15, 0); g.add(leg); }
    const nose = new THREE.Mesh(new THREE.ConeGeometry(.06, .2, 8), skin); nose.rotation.x = -Math.PI/2; nose.position.set(0, -off + 1.08, -.3); g.add(nose);
    eyes(g, -off + 1.2, -.22, .1, .06);
    const club = new THREE.Mesh(new THREE.CylinderGeometry(.07, .04, .7, 8), smooth(0x6b4a2a)); club.position.set(.42, -off + .62, -.1); club.rotation.z = -.5; g.add(club);
    const belt = new THREE.Mesh(new THREE.TorusGeometry(.33, .04, 6, 20), smooth(0x5a3e24)); belt.rotation.x = Math.PI/2; belt.position.y = -off + .52; g.add(belt);
    anim = t => { g.rotation.z = .08*Math.sin(t*10); club.rotation.z = -.5 + .3*Math.sin(t*10); };
  } else if (type === 'ca'){ // 칼슘 골렘: 각진 바위 덩어리
    mat.flatShading = true; mat.roughness = .9; mat.needsUpdate = true;
    body = new THREE.Mesh(new THREE.DodecahedronGeometry(.48, 0), mat); body.position.y = -off + .62; body.scale.set(1.1, .95, .9); g.add(body);
    const head = new THREE.Mesh(new THREE.DodecahedronGeometry(.26, 0), mat); head.position.y = -off + 1.2; g.add(head);
    for (const s of [-1, 1]){
      const arm = new THREE.Mesh(new THREE.DodecahedronGeometry(.2, 0), mat); arm.position.set(s*.62, -off + .55, 0); arm.scale.set(.9, 1.5, .9); g.add(arm);
      const leg = new THREE.Mesh(new THREE.DodecahedronGeometry(.18, 0), mat); leg.position.set(s*.24, -off + .14, 0); g.add(leg);
      const e = new THREE.Mesh(new THREE.BoxGeometry(.08, .05, .03), new THREE.MeshBasicMaterial({color:0x8fe9ff})); e.position.set(s*.09, -off + 1.24, -.24); g.add(e);
    }
    anim = t => { g.rotation.z = .05*Math.sin(t*3); };
  } else { // 편광 기사: 투구 · 갑옷 · 편광 방패(투과축 줄무늬)
    body = new THREE.Mesh(lathe([[0, 0], [.34, .02], [.42, .35], [.36, .7], [.2, .82], [0, .84]]), mat); body.position.y = -off + .12; g.add(body);
    const helm = new THREE.Mesh(new THREE.CylinderGeometry(.24, .26, .32, 18), smooth(0x4b5a7a, {metalness:.6, roughness:.35})); helm.position.y = -off + 1.12; g.add(helm);
    const dome = new THREE.Mesh(new THREE.SphereGeometry(.24, 18, 10, 0, Math.PI*2, 0, Math.PI/2), helm.material); dome.position.y = -off + 1.28; g.add(dome);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(.3, .05, .05), basic(0x0b0f18)); visor.position.set(0, -off + 1.12, -.25); g.add(visor);
    const plume = new THREE.Mesh(new THREE.ConeGeometry(.08, .4, 10), smooth(0x9db4ff)); plume.position.y = -off + 1.6; g.add(plume);
    const sh = new THREE.Group(); sh.position.set(0, -off + .62, -.48); sh.rotation.z = rad(armor == null ? 90 : armor);
    sh.add(new THREE.Mesh(new THREE.CylinderGeometry(.42, .42, .06, 28), smooth(0x1b2438, {metalness:.4})).rotateX(Math.PI/2));
    for (let i = -3; i <= 3; i++){ const ln = new THREE.Mesh(new THREE.BoxGeometry(.03, .72*Math.sqrt(1 - (i/3.6)**2), .02), new THREE.MeshBasicMaterial({color:0xbfd4ff})); ln.position.set(i*.1, 0, -.04); sh.add(ln); }
    g.add(sh);
    const by = body.position.y; anim = t => { body.position.y = by + .03*Math.abs(Math.sin(t*6)); };
  }
  shade(outer); outer.userData.body = body; outer.userData.anim = anim; return outer;
}

/* ── 주인공 (꾸미기: 머리 모양 · 색 · 얼굴 사진) ── */
const LOOK_DEFAULT = {hood:'#ff8a3d', hair:'#9a5a2e', style:'pony', eye:'#ffb020', skin:'#f1d2b6', face:false, fz:1, fx:0, fy:0};
const lookOf = () => Object.assign({}, LOOK_DEFAULT, G.look || {});
let faceImg = null;
function loadFace(){ try { const d = localStorage.getItem('johamin-castle-face'); if (d){ const im = new Image(); im.onload = () => { faceImg = im; if (G && G.look && G.look.face){ buildHero(); if (typeof dressSync === 'function') dressSync(); } }; im.src = d; } } catch(e){} }
/* 구 UV: 앞(−z)이 u = 0.75. 사진을 얼굴 자리에 그리고 가장자리를 피부색으로 부드럽게 */
function faceTexture(L){
  const c = document.createElement('canvas'); c.width = 512; c.height = 256; const x = c.getContext('2d');
  x.fillStyle = L.skin; x.fillRect(0, 0, 512, 256);
  if (faceImg){
    const cx = 384 + L.fx*60, cy = 132 + L.fy*50, w = 150*L.fz, h = 150*L.fz;
    const p = document.createElement('canvas'); p.width = 512; p.height = 256; const q = p.getContext('2d');
    q.drawImage(faceImg, cx - w/2, cy - h/2, w, h);
    const g = q.createRadialGradient(384, 132, 30, 384, 132, 78); g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    q.globalCompositeOperation = 'destination-in'; q.fillStyle = g; q.fillRect(0, 0, 512, 256);
    x.drawImage(p, 0, 0);
  }
  const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
}
function buildHeroInto(grp, L = lookOf()){
  while (grp.children.length){ const o = grp.children[0]; grp.remove(o); dispose(o); }
  const photo = L.face && faceImg;
  const hood = smooth(L.hood, {roughness:.75}), hair = smooth(L.hair, {roughness:.6}), pants = smooth(0x2b3346);
  const skin = photo ? new THREE.MeshStandardMaterial({map:faceTexture(L), roughness:.6}) : smooth(L.skin);
  const body = new THREE.Mesh(lathe([[0, .3], [.3, .32], [.34, .55], [.3, .85], [.22, 1.02], [0, 1.06]]), hood); grp.add(body);
  const hoodBack = new THREE.Mesh(new THREE.SphereGeometry(.2, 14, 10, 0, Math.PI*2, 0, Math.PI/2), hood); hoodBack.position.set(0, 1.0, .18); hoodBack.rotation.x = .9; grp.add(hoodBack);
  const head = new THREE.Mesh(new THREE.SphereGeometry(.24, 32, 20), skin); head.position.y = 1.28; grp.add(head);
  // 머리카락: 사진이면 이마를 덜 가리게 뒤로
  const capT = photo ? .3 : L.style === 'short' ? .45 : .55;
  const cap = new THREE.Mesh(new THREE.SphereGeometry(.26, 24, 14, 0, Math.PI*2, 0, Math.PI*capT), hair); cap.position.y = 1.31; cap.rotation.x = photo ? .42 : .15; grp.add(cap);
  if (L.style === 'bob' || L.style === 'long'){ const shell = new THREE.Mesh(new THREE.SphereGeometry(.275, 24, 14, Math.PI*1.75, Math.PI*1.5, 0, Math.PI*(L.style === 'long' ? .7 : .62)), hair); hair.side = THREE.DoubleSide; shell.position.y = 1.3; grp.add(shell); }
  if (L.style === 'long'){ const back = new THREE.Mesh(new THREE.BoxGeometry(.42, .55, .06), hair); back.position.set(0, .98, .22); back.rotation.x = .12; grp.add(back); }
  if (L.style === 'pony'){ const tail = new THREE.Mesh(new THREE.CylinderGeometry(.08, .05, .42, 10), hair); tail.position.set(0, 1.08, .25); tail.rotation.x = .35; grp.add(tail);
    const tie = new THREE.Mesh(new THREE.TorusGeometry(.07, .02, 6, 12), smooth(L.hood)); tie.position.set(0, 1.26, .24); tie.rotation.x = 1.2; grp.add(tie); }
  if (L.style === 'twin') for (const sd of [-1, 1]){ const t = new THREE.Mesh(new THREE.CylinderGeometry(.07, .04, .36, 10), hair); t.position.set(sd*.27, 1.12, .05); t.rotation.z = sd*.35; grp.add(t); }
  if (!photo) for (const sd of [-1, 1]){ const e = new THREE.Mesh(new THREE.SphereGeometry(.035, 8, 6), basic(new THREE.Color(L.eye))); e.position.set(sd*.09, 1.3, -.22); grp.add(e); }
  for (const sd of [-1, 1]){ const arm = new THREE.Mesh(new THREE.CylinderGeometry(.07, .06, .5, 8), hood); arm.position.set(sd*.35, .72, -.05); arm.rotation.z = sd*.15; grp.add(arm); }
  const lantern = new THREE.Group(); lantern.position.set(.36, .78, -.32);
  lantern.add(new THREE.Mesh(new THREE.CylinderGeometry(.08, .1, .5, 12), smooth(0x2b3346, {metalness:.6})).rotateX(Math.PI/2));
  const glow = new THREE.Mesh(new THREE.CircleGeometry(.08, 14), basic(0xfff3c4)); glow.position.z = -.26; glow.rotation.y = Math.PI; lantern.add(glow); grp.add(lantern);
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(.09, .08, .32, 8), pants); legL.position.set(-.12, .16, 0); grp.add(legL);
  const legR = legL.clone(); legR.position.x = .12; grp.add(legR); grp.userData.legs = [legL, legR];
  shade(grp);
}
function buildHero(){ buildHeroInto(hero); }

/* ── 쫄병 (튜닉 · 투구 깃털 · 들고 있는 무기 색) ── */
function soldierMesh(s){
  const g = new THREE.Group(), cloth = smooth(0x4f6690), skin = smooth(0xe8c9a8), iron = smooth(0x8a99ad, {metalness:.7, roughness:.3});
  const b = new THREE.Mesh(lathe([[0, .25], [.25, .27], [.3, .5], [.25, .8], [.16, .92], [0, .95]]), cloth); g.add(b);
  const belt = new THREE.Mesh(new THREE.TorusGeometry(.27, .035, 6, 18), smooth(0x5a3e24)); belt.rotation.x = Math.PI/2; belt.position.y = .55; g.add(belt);
  const h = new THREE.Mesh(new THREE.SphereGeometry(.19, 14, 12), skin); h.position.y = 1.1; g.add(h);
  const helm = new THREE.Mesh(new THREE.SphereGeometry(.21, 14, 8, 0, Math.PI*2, 0, Math.PI*.5), iron); helm.position.y = 1.13; g.add(helm);
  const brim = new THREE.Mesh(new THREE.TorusGeometry(.21, .03, 6, 18), iron); brim.rotation.x = Math.PI/2; brim.position.y = 1.13; g.add(brim);
  const plume = new THREE.Mesh(new THREE.ConeGeometry(.05, .26, 8), smooth(0xff8a3d)); plume.position.y = 1.42; g.add(plume);
  eyes(g, 1.1, -.17, .07, .035);
  for (const sd of [-1, 1]){ const leg = new THREE.Mesh(new THREE.CylinderGeometry(.08, .07, .28, 8), smooth(0x2b3346)); leg.position.set(sd*.1, .14, 0); g.add(leg); }
  const gd = s ? gunOf(s) : SOLDIER_GUN, gl = .35 + barrelOf(gd)/160*.6;
  const gun = new THREE.Mesh(new THREE.CylinderGeometry(.06, .07, gl, 10), smooth(0x2b3346, {metalness:.6})); gun.rotation.x = Math.PI/2; gun.position.set(.26, .72, -gl/2 + .05); g.add(gun);
  const tip = new THREE.Mesh(new THREE.SphereGeometry(.07, 8, 6), basic(new THREE.Color(beamColor(gd)))); tip.position.set(.26, .72, -gl + .05); g.add(tip);
  return shade(g);
}

/* ── 탑 (돌 받침 · 회전 포탑 · 경통 · 앞 렌즈) ── */
let brickSmall = null;
function towerMesh(d){
  const g = new THREE.Group();
  brickSmall = brickSmall || brickTex(2, 1);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(.55, .66, .5, 20), std(0xc8ccd8, {map:brickSmall, roughness:.9})); base.position.y = .25; g.add(base);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(.5, .05, 8, 28), smooth(0xb08a3c, {metalness:.7, roughness:.3})); ring.rotation.x = Math.PI/2; ring.position.y = .52; g.add(ring);
  const head = new THREE.Group(); head.position.y = .85; g.add(head);
  const metal = smooth(0x2a3245, {metalness:.6, roughness:.35}), trim = smooth(0x8a99ad, {metalness:.8, roughness:.25});
  for (const s of [-1, 1]){ const yoke = new THREE.Mesh(new THREE.BoxGeometry(.08, .55, .5), trim); yoke.position.set(s*.36, -.05, 0); head.add(yoke); }
  const blen = .7 + barrelOf(d)/160*1.3;
  const hb = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, 1.0, 20), metal); hb.rotation.x = Math.PI/2; head.add(hb);
  const cap = new THREE.Mesh(new THREE.SphereGeometry(.3, 20, 12, 0, Math.PI*2, 0, Math.PI/2), metal); cap.rotation.x = Math.PI/2; cap.position.z = .5; head.add(cap);
  const bar = new THREE.Mesh(new THREE.CylinderGeometry(.2, .23, blen, 18), metal); bar.rotation.x = Math.PI/2; bar.position.set(0, .03, -.5 - blen/2); head.add(bar);
  for (let i = 0; i < 3; i++){ const r = new THREE.Mesh(new THREE.TorusGeometry(.22, .03, 6, 20), trim); r.position.set(0, .03, -.55 - blen*(i + 1)/4); head.add(r); }
  const col = new THREE.Color(beamColor(d));
  const muzzle = new THREE.Mesh(new THREE.CircleGeometry(.17, 20), new THREE.MeshBasicMaterial({color:col})); muzzle.position.set(0, .03, -.51 - blen); muzzle.rotation.y = Math.PI; head.add(muzzle);
  if (isLaser(d)){ const m = MEDIA[d.medium]; const rod = new THREE.Mesh(new THREE.CylinderGeometry(.09, .09, .9, 12), std(m.color, {emissive:m.color, emissiveIntensity:.9})); rod.rotation.x = Math.PI/2; rod.position.y = .33; head.add(rod); }
  else { const win = new THREE.Mesh(new THREE.CircleGeometry(.12, 16), basic(col)); win.position.set(.31, 0, 0); win.rotation.y = Math.PI/2; head.add(win); const w2 = win.clone(); w2.position.x = -.31; w2.rotation.y = -Math.PI/2; head.add(w2); }
  let z = -.62 - blen*.25;
  for (const e of d.els){
    if (e.type === 'pol'){
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(.32, .32, .04, 24), std(0x2b3346, {transparent:true, opacity:.8})); disc.rotation.x = Math.PI/2; disc.position.z = z; head.add(disc);
      const ax = new THREE.Group(); ax.position.z = z; ax.rotation.z = rad(e.theta); ax.add(new THREE.Mesh(new THREE.BoxGeometry(.05, .6, .06), std(0xffd166, {emissive:0xffb020, emissiveIntensity:.6}))); head.add(ax);
      if (!head.userData.polAxis) head.userData.polAxis = ax;
    } else { const l = new THREE.Mesh(new THREE.SphereGeometry(.26, 20, 12), std(0xa8e6ff, {transparent:true, opacity:.55, roughness:.05, emissive:0x2a90c8, emissiveIntensity:.4})); l.scale.set(1, 1, e.type === 'convex' ? .3 : .14); l.position.set(0, .03, z); head.add(l); }
    z -= .14;
  }
  shade(g); g.userData.head = head; return g;
}

/* ── 성 · 풍경 · 낮밤 ── */
const wAnimList = [];
let skyDay = null, skyNight = null, wHemi = null, wSun = null, isNight = null;
function skyTex(top, mid, bottom, stars){
  return canvasTex(512, 512, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, top); gr.addColorStop(.55, mid); gr.addColorStop(1, bottom); x.fillStyle = gr; x.fillRect(0, 0, w, h);
    if (stars) for (let i = 0; i < 260; i++){ x.fillStyle = `rgba(255,255,255,${.3 + srand()*.6})`; const r = srand() < .1 ? 2 : 1; x.fillRect(srand()*w, srand()*h*.5, r, r); } });
}
function applySky(night){
  if (isNight === night || !wSun) return; isNight = night;
  wScene.background = night ? skyNight : skyDay;
  wScene.fog.color.set(night ? 0x141c33 : 0xa9c6e2);
  wHemi.intensity = night ? .55 : 1.0; wHemi.color.set(night ? 0x9fb4ff : 0xeaf2ff);
  wSun.intensity = night ? .55 : 1.0; wSun.color.set(night ? 0xbcd0ff : 0xfff2dc);
  moon.visible = night;
}
const moon = new THREE.Mesh(new THREE.SphereGeometry(3, 20, 14), new THREE.MeshBasicMaterial({color:0xf3f0d8, fog:false}));
function wDecorate(){
  skyDay = skyTex('#5d9bd6', '#a9c6e2', '#d9e6f0'); skyNight = skyTex('#05070f', '#141c33', '#28304a', true);
  wScene.traverse(o => { if (o.isHemisphereLight) wHemi = o; if (o.isDirectionalLight) wSun = o; });
  wSun.position.set(-22, 40, 24); wSun.castShadow = true; wSun.shadow.mapSize.set(2048, 2048);
  Object.assign(wSun.shadow.camera, {left:-46, right:46, top:46, bottom:-46, near:1, far:140}); wSun.shadow.bias = -.0004; wSun.shadow.normalBias = .05; wSun.target.position.set(0, 0, -18); wScene.add(wSun.target);
  moon.position.set(40, 55, -150); wScene.add(moon);
  // 바닥: 풀 · 마당 흙
  wScene.traverse(o => { if (o.isMesh && o.geometry.type === 'PlaneGeometry' && o.geometry.parameters.width === 260){ o.material.map = grassTex; o.material.color.set(0x9fc48a); o.material.needsUpdate = true; o.receiveShadow = true; }
    if (o.isMesh && o.geometry.type === 'PlaneGeometry' && o.geometry.parameters.width === 44){ o.material.map = dirtTex; o.material.color.set(0xbfae94); o.material.needsUpdate = true; o.receiveShadow = true; } });
  // 성벽 벽돌
  const big = brickTex(14, 3);
  for (const m of wallMats){ m.map = big; m.color.set(m === wallMats[0] ? 0xc6cad8 : 0xaab0c2); m.needsUpdate = true; }
  wScene.traverse(o => { if (o.isMesh && o.geometry.type === 'CylinderGeometry' && o.geometry.parameters.radiusTop === 2.4){ o.material = std(0xc6cad8, {map:brickTex(6, 3), roughness:.9}); } });
  for (const s of [-1, 1]){
    const roof = new THREE.Mesh(new THREE.ConeGeometry(3.0, 3.4, 28), smooth(0x8a3b2a, {roughness:.7})); roof.position.set(s*20.2, WALL_TOP + 1.6 + 1.7 + .4, 0); wScene.add(roof);
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(.05, .05, 1.6, 6), smooth(0xdddddd)); pole.position.set(s*20.2, WALL_TOP + 7.3, 0); wScene.add(pole);
    const flag = new THREE.Mesh(new THREE.PlaneGeometry(1.2, .7), new THREE.MeshStandardMaterial({color:0xff8a3d, side:THREE.DoubleSide})); flag.position.set(s*20.2 + .6, WALL_TOP + 7.7, 0); wScene.add(flag); wAnimList.push({flag, k:s*3});
  }
  for (const x of [-9, 9]){ // 성벽 깃발 현수막
    const ban = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 3.2), new THREE.MeshStandardMaterial({color:0xc9542a, side:THREE.DoubleSide})); ban.position.set(x, WALL_TOP - 2.2, -1.25); ban.userData.wallPart = 3; wScene.add(ban);
    const em = new THREE.Mesh(new THREE.CircleGeometry(.4, 20), basic(0xffd166)); em.position.set(x, WALL_TOP - 1.8, -1.27); em.userData.wallPart = 4; em.rotation.y = Math.PI; wScene.add(em); wallMats.push(ban.material, em.material);
  }
  for (let x = -16; x <= 16; x += 8){ // 횃불
    const t = new THREE.Group(); t.position.set(x, WALL_TOP + 1.05, -1.25);
    t.add(new THREE.Mesh(new THREE.CylinderGeometry(.05, .04, .5, 6), smooth(0x5a3e24)));
    const f = new THREE.Mesh(new THREE.ConeGeometry(.12, .3, 8), new THREE.MeshBasicMaterial({color:0xffa53d})); f.position.y = .38; t.add(f); wAnimList.push({flame:f, k:x}); wScene.add(t);
  }
  // 나무 · 바위 (인스턴스)
  const trunkG = new THREE.CylinderGeometry(.18, .26, 1.6, 7), leafG = new THREE.ConeGeometry(1.4, 3.2, 8);
  const pos = []; for (let i = 0; i < 120; i++){ const side = srand() < .5 ? -1 : 1, x = side*(34 + srand()*50), z = 22 - srand()*110; pos.push([x, z, .7 + srand()*.8]); }
  for (let i = 0; i < 30; i++) pos.push([-40 + srand()*80, 14 + srand()*16, .7 + srand()*.6]);
  const trunks = new THREE.InstancedMesh(trunkG, smooth(0x5a3e24), pos.length), leaves = new THREE.InstancedMesh(leafG, smooth(0x2f5d3a, {flatShading:true}), pos.length), mt = new THREE.Matrix4();
  pos.forEach(([x, z, s], i) => { mt.makeScale(s, s, s).setPosition(x, .8*s, z); trunks.setMatrixAt(i, mt); mt.makeScale(s, s, s).setPosition(x, 2.9*s, z); leaves.setMatrixAt(i, mt); });
  trunks.castShadow = leaves.castShadow = true; wScene.add(trunks, leaves);
  const rockG = new THREE.DodecahedronGeometry(.8, 0), rocks = new THREE.InstancedMesh(rockG, smooth(0x7d8290, {flatShading:true, roughness:.95}), 40);
  for (let i = 0; i < 40; i++){ const side = srand() < .5 ? -1 : 1; mt.makeScale(.5 + srand(), .4 + srand()*.6, .5 + srand()).setPosition(side*(24 + srand()*30), .2, -srand()*90); rocks.setMatrixAt(i, mt); }
  rocks.castShadow = rocks.receiveShadow = true; wScene.add(rocks);
  // 그림자
  wScene.traverse(o => { if (o.isMesh && !o.isInstancedMesh && o !== moon){ const tr = o.material && o.material.transparent; if (!tr && o.material && !o.material.isMeshBasicMaterial) o.castShadow = true; if (o.geometry && (o.geometry.type === 'BoxGeometry')) o.receiveShadow = true; } });
  // 반투명 성벽은 그리는 순서를 고정해서 움직일 때 앞뒤가 뒤바뀌며 깜빡이지 않게
  wScene.traverse(o => { if (o.userData.wallPart) o.renderOrder = o.userData.wallPart; });
  buildHero();
  applySky(false);
}
/* 그래픽 품질: 자동이면 처음 몇 초 프레임을 재서 느리면 그림자를 꺼요 */
let gfxAutoLow = false, gfxOn = null; const gfxProbe = {n:0, t:0, done:false};
function applyGfx(){
  const on = G.settings.gfx === 'high' || (G.settings.gfx === 'auto' && !gfxAutoLow);
  if (on === gfxOn) return; gfxOn = on;
  renderer.shadowMap.enabled = on; if (wSun) wSun.castShadow = on;
  for (const sc of [wScene, fScene, tScene, sScene]) sc.traverse(o => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => m.needsUpdate = true); });
}
function gfxSample(dt){
  if (gfxProbe.done || G.settings.gfx !== 'auto') return;
  gfxProbe.n++; gfxProbe.t += dt;
  if (gfxProbe.n >= 150){ gfxProbe.done = true; const fps = gfxProbe.n/gfxProbe.t; if (fps < 35){ gfxAutoLow = true; applyGfx(); hint('기기가 느려서 그림자를 껐어요 · 설정에서 바꿀 수 있어요'); } }
}
function wAnimate(t){ for (const a of wAnimList){ if (a.flame) a.flame.scale.set(1, 1 + .25*Math.sin(t*12 + a.k), 1); else a.flag.rotation.y = .25*Math.sin(t*2 + a.k); } }
