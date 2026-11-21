'use strict';
/* ═════════ 공통 도구 ═════════ */
const $ = id => document.getElementById(id);
const rad = d => d*Math.PI/180, cos2 = d => Math.cos(rad(d))**2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const copy = o => JSON.parse(JSON.stringify(o));
const rnd = a => a[Math.floor(Math.random()*a.length)];
const rint = (a, b) => a + Math.floor(Math.random()*(b - a + 1));
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const r1 = v => Math.round(v*10)/10;
/* 조사: 앞말 끝 글자에 받침이 있으면 앞 것(이 · 을 · 은), 없으면 뒤 것(가 · 를 · 는) */
const josa = (w, a, b) => { const c = String(w).charCodeAt(String(w).length - 1) - 0xac00; return w + (c >= 0 && c <= 11171 && c % 28 ? a : b); };

/* ═════════ 광원 · 스펙트럼 ═════════ */
function normSpec(a){ const s = a.reduce((t, [, w]) => t + w, 0); return a.map(([n, w]) => [n, w/s]); }
function planck(T){ const o = []; for (let nm = 300; nm <= 2500; nm += 25) o.push([nm, 1/(Math.pow(nm, 5)*(Math.exp(1.4388e7/(nm*T)) - 1))]); return normSpec(o); }
const SPEC = {
  bulb: planck(2800),
  fluo: normSpec([[405,.04],[436,.1],[487,.06],[546,.28],[578,.07],[611,.3],[710,.15]]),
  led: normSpec([[450,.3], ...[500,525,550,575,600,625,650,675,700].map(nm => [nm, Math.exp(-(((nm - 575)/55)**2))*.16])]),
  uv: normSpec([[365,.85],[405,.15]]),
  disp: normSpec([[455,1],[535,1],[620,1]]),
};
const PIX = {w:{name:'흰 화면', nm:null}, r:{name:'빨강', nm:620, color:'#ff5a5a'}, g:{name:'초록', nm:535, color:'#5aff7a'}, b:{name:'파랑', nm:455, color:'#5a8cff'}};
/* 단위: 경통 · 렌즈는 cm, 전장은 m. 전류 mA · 전압 V · 저항 kΩ · 전력 mW */
/* 6.4 몸 전체 판정: 예전에는 급소(반지름 0.5 cm)에 들어간 빛만 쳤다 → 상이 크면 몬스터가 빛 속에 있어도 데미지가 0에 가까웠다.
   이제 빛이 적의 몸(반지름 rb cm, 아래 FOES)에 들어간 만큼 친다. 대신 금속의 양자 효율(광자 하나당 튀어나오는 전자 수)이
   실제처럼 아주 작다(ETA = 5×10⁻⁴: 광자 2000개에 전자 1개) → 광전류 I₀ = ETA · Σ P/E.
   BODY_REF: 설계 화면 · 교전 범위가 기준으로 쓰는 몸 반지름(젤리 · 슬라임).
   DMG_K: 기본 설계 · 적 · 거리 250곳의 중앙값이 예전과 같게 맞춘 값. LASER_MW: 레이저가 램프와 겨룰 수 있게 1200 mW 기준 */
const BODY_REF = 30, ETA = 5e-4, DMG_K = 2700, LASER_MW = 2800, LASER_WMIN = 1.0, LOSS = .03;
/* A: 가운데에서 나온 광선(높이 cm, 기울기), B: 광원 가장자리에서 나온 평행 광선 → 빔 반지름 = |A| + |B| */
const SOURCES = {
  bulb:{id:'bulb', name:'백열전등', price:10, draw:1.0, out:3400, pol:null, s:.5, div:.1, color:'#ffb35c', work:.5, sub:'연속 스펙트럼 · 대부분 적외선 · 밝지만 전기 많이'},
  fluo:{id:'fluo', name:'형광등', price:20, draw:.5, out:850, pol:null, s:.9, div:.12, color:'#dff1ff', work:.5, sub:'선 스펙트럼 · 관이 길어 상이 커요'},
  led:{id:'led', name:'백색 LED', price:35, draw:.3, out:400, pol:null, s:.15, div:.06, color:'#f2f5ff', work:.5, sub:'파란 빛 + 노란 형광 · 작은 칩'},
  uv:{id:'uv', name:'UV 블랙라이트', price:60, draw:.45, out:110, pol:null, s:.4, div:.08, color:'#b47cff', work:1, sub:'365 nm 자외선 · 어둡지만 진동수 높음'},
  disp:{id:'disp', name:'디스플레이', price:40, draw:.2, out:220, pol:90, s:.7, div:.1, color:'#9fc4ff', work:1, sub:'RGB 화소 · 이미 90° 편광된 빛'},
  laser:{id:'laser', name:'레이저', price:0, research:'laser', pol:0, r0:.8, th:.0004, color:null, work:2, sub:'단색 · 지향성 · 0° 편광'},
};
const LAMP_IDS = ['bulb', 'fluo', 'led', 'uv', 'disp'];
const MEDIA_LIST = [
  {id:'ruby',  name:'루비',        nm:694, price:15,  color:'#ff3b3b'},
  {id:'hene',  name:'헬륨-네온',   nm:633, price:30,  color:'#ff6a2a'},
  {id:'green', name:'Nd:YAG 녹색', nm:532, price:50,  color:'#4dff6a'},
  {id:'argon', name:'아르곤',      nm:488, price:90,  color:'#3fd0ff'},
  {id:'n2',    name:'질소 자외선', nm:337, price:160, color:'#b47cff'},
  {id:'krf',   name:'KrF 엑시머',  nm:248, price:260, color:'#e070ff', research:'krf'},
  {id:'arf',   name:'ArF 엑시머',  nm:193, price:400, color:'#ff70d0', research:'arf'},
];
const MEDIA = Object.fromEntries(MEDIA_LIST.map(m => [m.id, m]));
const PUMPS = [
  {lv:1, label:'펌핑 Ⅰ', g0:.15, price:20}, {lv:2, label:'펌핑 Ⅱ', g0:.25, price:50}, {lv:3, label:'펌핑 Ⅲ', g0:.35, price:100},
  {lv:4, label:'펌핑 Ⅳ', g0:.45, price:160, research:'pump4'}, {lv:5, label:'펌핑 Ⅴ', g0:.55, price:240, research:'pump5'},
];
const PRICE = {mirror:10, convex:30, concave:30, pol:20};
const BARRELS = [{L:20, price:0}, {L:40, price:15}, {L:80, price:40}, {L:120, price:70}, {L:160, price:110}];
const barrelPrice = L => (BARRELS.find(b => b.L === L) || BARRELS[0]).price;
/* 몬스터 = 광전관에 물린 저항 R. W는 일함수 */
const FOES = {
  ag:{name:'산화세슘 젤리', short:'젤리', W:1.1, R:3,  color:'#ff9ad5', hp:40,  speed:4.6, reward:6,  wall:1, drop:3, rb:30},
  cs:{name:'세슘 슬라임',   short:'슬라임', W:2.1, R:4,  color:'#7be0c3', hp:60,  speed:5,   reward:8,  wall:1, drop:4, rb:30},
  na:{name:'나트륨 고블린', short:'고블린', W:2.3, R:6,  color:'#f2c14e', hp:90,  speed:6,   reward:11, wall:1, drop:5, rb:35},
  ca:{name:'칼슘 골렘',     short:'골렘', W:2.9, R:10, color:'#c9c4b8', hp:70,  speed:3,  reward:20, wall:3, drop:12, rb:60},
  kn:{name:'편광 기사',     short:'기사', W:2.3, R:6,  color:'#9db4ff', hp:110, speed:4.4,  reward:16, wall:2, drop:8, rb:40},
  /* 6.4 새 몬스터 · 몸 크기가 다르다: 작은 박쥐는 빛을 작게 모아야 다 맞고, 큰 거인은 저항이 커서 전압이 금방 막힌다 */
  bt:{name:'칼륨 박쥐',     short:'박쥐', W:2.3, R:5,  color:'#a88bff', hp:30,  speed:8,   reward:9,  wall:1, drop:3, rb:12, fly:true, unit:.5},
  /* 6.5 새 몬스터 · 한계 전압 말고 다른 특성
     ne 네온 정령(23번 에너지 준위): 몸의 두 준위 차가 1.96 eV → 그 근처(±0.045 eV) 광자만 흡수, 나머지 빛은 그냥 지나간다. 헬륨-네온 633 nm · 빨강 화소 620 nm가 맞음
     sp 분열 슬라임: 쓰러지면 꼬마 슬라임(sk) 둘로 갈라진다. 꼬마는 몸이 작아(12 cm) 빛을 작게 모아야 다 맞는다
     sh 그림자 도깨비: 어두워서 램프 빛이 닿는 곳(램프 탑 · 주인공 램프 25 m 안)이나 성벽 12 m 안에서만 보인다. 레이저는 가늘어서 주변을 못 비춘다 */
  ne:{name:'네온 정령',     short:'정령', W:1.6, R:6,  color:'#ff7a4a', hp:70,  speed:4.2, reward:18, wall:2, drop:0, rb:30, fly:true, line:1.96, band:.045},
  sp:{name:'분열 슬라임',   short:'분열', W:2.1, R:4,  color:'#5fe0b0', hp:70,  speed:3.6, reward:10, wall:2, drop:6, rb:40, split:'sk', unit:1.6},
  sk:{name:'꼬마 슬라임',   short:'꼬마', W:2.1, R:4,  color:'#8ff0c8', hp:21,  speed:6,   reward:4,  wall:1, drop:1, rb:12, mini:true},
  sh:{name:'그림자 도깨비', short:'그림자', W:2.3, R:6, color:'#4a4466', hp:80,  speed:5,   reward:16, wall:2, drop:6, rb:35, dark:true},
  /* qg 양자 유령(24번 이중 슬릿): 소굴의 두 문(슬릿)을 지나 물질파로 퍼져 온다. 평소엔 간섭무늬(밝은 줄 5개)로만 보이고 맞지 않는다.
     몇 초마다 한 줄에서 '관측'되어 잠깐 나타나는데, 줄을 고르는 확률이 밝기(확률 밀도 ρ)에 비례한다. 줄 간격 Δx = λL/d */
  qg:{name:'양자 유령',     short:'유령', W:2.0, R:5,  color:'#b8f0ff', hp:60,  speed:4,   reward:20, wall:2, drop:0, rb:30, fly:true, quantum:true},
  /* 6.6 보스(10밤마다): 그 집안의 왕. 몸이 크고 체력은 한 마리 몫(unit)만큼, 체력이 3/4 · 1/2 · 1/4이 될 때마다 졸개를 부른다 */
  Bs:{name:'슬라임 왕',     short:'슬라임 왕', W:2.1, R:4,  color:'#4fd6a0', hp:720,  speed:2.0, reward:160, wall:10, drop:30, rb:110, unit:12, boss:true, mini:true, base:'cs', summon:['cs', 3], scale:2.3, ch:1},
  Bk:{name:'편광 기사왕',   short:'기사왕',   W:2.3, R:6,  color:'#8fa8ff', hp:840,  speed:2.4, reward:220, wall:12, drop:30, rb:70,  unit:14, boss:true, mini:true, base:'kn', summon:['kn', 2], scale:1.9, ch:2, spin:40},
  Bg:{name:'골렘왕',        short:'골렘왕',   W:3.2, R:12, color:'#d8d0bc', hp:960,  speed:1.8, reward:300, wall:14, drop:30, rb:90,  unit:16, boss:true, mini:true, base:'ca', summon:['ca', 2], scale:1.9, ch:3},
  Bd:{name:'그림자 군주',   short:'군주',     W:2.3, R:8,  color:'#3a3355', hp:1080, speed:2.6, reward:380, wall:16, drop:30, rb:70,  unit:18, boss:true, mini:true, base:'sh', summon:['sh', 3], scale:1.9, ch:4, dark:true},
  Bq:{name:'유령왕',        short:'유령왕',   W:2.0, R:6,  color:'#a8ecff', hp:1200, speed:2.4, reward:460, wall:18, drop:30, rb:60,  unit:20, boss:true, mini:true, base:'qg', summon:['qg', 2], scale:1.9, ch:5, quantum:true, fly:true},
  gt:{name:'바륨 거인',     short:'거인', W:2.5, R:40, color:'#d98c5f', hp:320, speed:2.2, reward:48, wall:5, drop:20, rb:90, unit:4.5},   /* unit: 웨이브 체력 예산에서 몇 마리 몫인지 */
};
const pumpOk = q => !q.research || G.research[q.research];
const mediumOk = m => !m.research || G.research[m.research];
const powerAt = (pump, R, loss = LOSS) => { const g0 = PUMPS[pump-1].g0, T = 1 - R; return g0 <= T + loss ? 0 : T*(g0/(T + loss) - 1); };
const srcOf = d => SOURCES[d.source || 'laser'];
const isLaser = d => (d.source || 'laser') === 'laser';
const barrelOf = d => d.barrel || 20;
function specOf(d){
  if (isLaser(d)) return [[MEDIA[d.medium].nm, 1]];
  if (d.source === 'disp' && d.pix && d.pix !== 'w') return [[PIX[d.pix].nm, 1]];
  return SPEC[d.source];
}
function capMult(){ const r = G.research; return r.ap2 ? 16 : r.ap1 ? 9 : r.doublet ? 6 : 4; }
/* 큰 렌즈 · 겹렌즈 연구: 램프에서 퍼져 나가는 빛을 렌즈가 더 많이 받아 모은다 (렌즈 지름 ∝ √capMult → 모으는 빛 ×√(capMult/4)) */
const lampGain = () => Math.sqrt(capMult()/4);
function minWOf(d){ return isLaser(d) ? LASER_WMIN/Math.sqrt(capMult()/4) : 0; }
/* 대형 무기(6.4): 같은 광원 N개를 한 경통에 묶는다(mods) → 광출력 N배 · 전기 N배 */
const modsOf = d => d.mods || 1;
function srcPower(d){ return modsOf(d)*(isLaser(d) ? (d.medium && d.pump ? powerAt(d.pump, d.R, d.loss ?? LOSS)*LASER_MW : 0) : srcOf(d).out*lampGain()*(d.source === 'disp' && d.pix && d.pix !== 'w' ? 1/3 : 1)); }
function drawOf(d){ return modsOf(d)*(isLaser(d) ? .4 + .2*d.pump + (MEDIA[d.medium] && MEDIA[d.medium].research ? .3 : 0) : srcOf(d).draw); }
function beamColor(d){ if (isLaser(d)) return MEDIA[d.medium].color; if (d.source === 'disp' && d.pix && d.pix !== 'w') return PIX[d.pix].color; return srcOf(d).color; }
function withPol(els, theta){ if (theta == null) return els; let done = false; return els.map(e => (!done && e.type === 'pol') ? (done = true, Object.assign({}, e, {theta})) : e); }
const fmtF = f => f >= 1000 ? `${+(f/100).toFixed(2)} m` : `${+f.toFixed(1)} cm`;
const fmtLen = cm => Math.abs(cm) >= 100 ? `${+(cm/100).toFixed(2)} m` : `${+cm.toFixed(1)} cm`;
/* 광선 추적: 경통 0 cm = 광원(램프) 또는 출력 거울(레이저). 거리는 m로 받아 cm로 계산 */
function traceD(d, distM, polTheta){
  const s = srcOf(d), els = withPol(d.els, polTheta), dist = distM*100;
  let ay, au, by, bu;
  if (isLaser(d)){ ay = s.r0; au = 0; by = 0; bu = s.th; } else { ay = 0; au = s.div; by = s.s; bu = 0; }
  let pos = 0, pol = s.pol, t = 1;
  for (const e of els){
    if (e.x >= dist) break;
    const L = e.x - pos; ay += au*L; by += bu*L; pos = e.x;
    if (e.type === 'convex'){ au -= ay/e.f; bu -= by/e.f; }
    else if (e.type === 'concave'){ au += ay/e.f; bu += by/e.f; }
    else { t *= pol == null ? .5 : cos2(e.theta - pol); pol = e.theta; }
  }
  const L = dist - pos; ay += au*L; by += bu*L;
  return {w:Math.abs(ay) + Math.abs(by), t, pol};
}
/* 여러 파장 광전관 + 저항 R (적의 몸 = 금속판, 적의 저항 R)
   전자가 R에 흐르면 R 양 끝에 u = I·R가 생기고, 이 u가 광전관에 역전압으로 걸린다.
   한 파장의 전류 = I₀ · panelFrac(u, Kmax)  (평행판 · 운동 에너지 고르게 · cos θ 분포 → 1 − w + w ln w, w = eu/Kmax)
   → u = R · Σ I₀ · panelFrac(u, Kmax)인 u를 이분법으로 찾는다 (왼쪽은 u가 커질수록 줄고, 오른쪽은 늘어서 답이 하나)
   sat: 전류가 다 흘렀다면 u가 정지 전압을 넘었을 상황 → 전압이 막혀요(짧은 파장이 필요)
   (예전 식: 정지 전압이 u보다 큰 빛만 통째로 더함 → 계단) */
function solveCircuit(lines, R){
  lines = lines.filter(l => l.V > 0 && l.I > 0);
  if (!lines.length) return {u:0, I:0, Itot:0, sat:false, V0:0};
  const Itot = lines.reduce((s, l) => s + l.I, 0), V0 = Math.max(...lines.map(l => l.V));
  const Iat = u => lines.reduce((s, l) => s + l.I*panelFrac(u, l.V), 0);
  let lo = 0, hi = V0;
  for (let k = 0; k < 48; k++){ const m = (lo + hi)/2; if (R*Iat(m) > m) lo = m; else hi = m; }
  const u = (lo + hi)/2;
  return {u, I:Iat(u), Itot, sat:R*Itot >= V0, V0};
}
/* 소굴 유물(챕터 우두머리 보상): 하나에 모든 데미지 +6% */
const relicMul = () => 1 + .06*((G && G.dg && G.dg.relics) || []).length;
const kindScale = d => (d.kind === 'weapon' ? weaponScale() : d.kind === 'soldier' ? soldierScale() : 1)*(G && G.sites && G.sites.scoutDay === G.wave && G.mode === 'wave' ? SCOUT_BUFF : 1)*relicMul();
/* 성벽에 올리는 것: 탑 · 대형 무기 */
const isMount = d => d.kind === 'tower' || d.kind === 'siege';
function hitD(d, foe, dist, armor, polTheta, scaleOverride){
  const p = srcPower(d), zero = why => ({v:0, why, w:1, I:0, V0:0, u:0, sat:false, Ph:0, frac:0, t:0});
  if (!p) return zero('발진 안 함');
  const tr = traceD(d, Math.max(.01, dist), polTheta);
  let sp = specOf(d), abs = 1;
  // 흡수선이 있는 몸(정령): 준위 차 근처 광자만 흡수, 나머지는 그냥 지나간다
  if (foe.line){ sp = sp.map(([nm, w]) => [nm, Math.abs(1240/nm - foe.line) <= foe.band ? w : 0]); abs = sp.reduce((s, q) => s + q[1], 0); if (abs <= 0) return Object.assign(zero('흡수선 밖'), {w:tr.w, abs:0}); }
  if (!sp.some(([nm, w]) => w > 0 && 1240/nm > foe.W)) return Object.assign(zero('E < W'), {w:tr.w});
  let t = tr.t; if (armor != null) t *= tr.pol == null ? .5 : cos2(tr.pol - armor);
  if (t < .005) return Object.assign(zero('편광 차단'), {w:tr.w});
  const rb = foe.rb || BODY_REF, frac = Math.min(1, (rb/Math.max(tr.w, minWOf(d)))**2), Ph = p*t*frac;
  const c = solveCircuit(sp.map(([nm, w]) => { const E = 1240/nm; return {I:ETA*Ph*w/E, V:E - foe.W}; }), foe.R);
  const P = c.u*c.u/foe.R, scale = scaleOverride ?? kindScale(d);
  return {v:DMG_K*P*scale, why:'', w:tr.w, I:c.I, Itot:c.Itot, V0:c.V0, u:c.u, sat:c.sat, P, Ph, frac, t, scale, rb, abs};
}
const fracAt = (d, dist, rb = BODY_REF) => Math.min(1, (rb/Math.max(traceD(d, Math.max(.01, dist)).w, minWOf(d)))**2);
/* 정예는 몸이 1.45배 */
const ELITE_FOES = {};
const foeOf = e => !e.elite ? FOES[e.type] : (ELITE_FOES[e.type] = ELITE_FOES[e.type] || Object.assign({}, FOES[e.type], {rb:FOES[e.type].rb*1.45}));
function band(d){ let mx = 0; const f = []; for (let m = 1; m <= 100; m++){ f[m] = fracAt(d, m); mx = Math.max(mx, f[m]); } let lo = null, hi = null; for (let m = 1; m <= 100; m++) if (f[m] >= mx/2){ if (lo == null) lo = m; hi = m; } return lo == null ? null : [lo, hi]; }
function costOf(d){ let c = (isLaser(d) ? MEDIA[d.medium].price + PUMPS[d.pump-1].price + PRICE.mirror : srcOf(d).price) + barrelPrice(barrelOf(d)); for (const e of d.els) c += PRICE[e.type]; return c; }
function workOf(d){ return srcOf(d).work + .5*d.els.length + (barrelOf(d) >= 120 ? .5 : 0); }
function formula(d){
  const parts = isLaser(d) ? [`${MEDIA[d.medium].name} ${MEDIA[d.medium].nm}nm`, PUMPS[d.pump-1].label, `R ${Math.round(d.R*100)}%`] : [srcOf(d).name + (d.source === 'disp' && d.pix && d.pix !== 'w' ? `(${PIX[d.pix].name})` : '')];
  parts.push(`경통 ${barrelOf(d)}cm`);
  for (const e of d.els) parts.push(e.type === 'pol' ? `편광 ${e.theta}°@${e.x}cm` : `${e.type === 'convex' ? '볼록' : '오목'} f${fmtF(e.f).replace(' ', '')}@${e.x}cm`);
  return parts.join(' ─ ');
}
const hasPol = d => d.els.some(e => e.type === 'pol');
const firstPol = d => (d.els.find(e => e.type === 'pol') || {}).theta;
const needsLaser = d => isLaser(d) && (!G.research.laser || (MEDIA[d.medium] && !mediumOk(MEDIA[d.medium])));
/* 렌즈 하나로 광원의 상을 bM m(광원 기준)에 맺는 초점 거리 */
const lensFor = (a, totalM) => { const b = totalM*100 - a; return r1(a*b/(a + b)); };

/* ═════════ 설계도 기본값 ═════════ */
const PRESETS = [
  {id:'bulbT', kind:'tower', name:'백열 탐조등', source:'bulb', barrel:80, els:[{type:'convex', x:78, f:lensFor(78, 15)}]},
  {id:'fluoT', kind:'tower', name:'형광 산광등', source:'fluo', barrel:40, els:[{type:'convex', x:38, f:lensFor(38, 8)}]},
  {id:'ledT',  kind:'tower', name:'LED 집광등',  source:'led',  barrel:80, els:[{type:'convex', x:78, f:lensFor(78, 30)}]},
  {id:'uvT',   kind:'tower', name:'블랙라이트 등', source:'uv', barrel:80, els:[{type:'convex', x:78, f:lensFor(78, 15)}]},
  {id:'dispT', kind:'tower', name:'디스플레이 조명', source:'disp', pix:'w', barrel:80, els:[{type:'convex', x:78, f:lensFor(78, 15)}]},
  {id:'focus', kind:'tower', name:'청색 집속포', source:'laser', medium:'argon', pump:2, R:.92, barrel:40, els:[{type:'convex', x:10, f:2990}]},
  {id:'uv',    kind:'tower', name:'자외선 직사포', source:'laser', medium:'n2', pump:3, R:.90, barrel:20, els:[]},
  {id:'lantern', kind:'weapon', name:'LED 랜턴', source:'led', barrel:40, els:[{type:'convex', x:38, f:lensFor(38, 10)}]},
  {id:'torch', kind:'weapon', name:'손전등', source:'bulb', barrel:20, els:[{type:'convex', x:18, f:lensFor(18, 8)}]},
];
const SOLDIER_GUN = {id:'sgun', kind:'soldier', name:'LED 소총', source:'led', barrel:40, els:[{type:'convex', x:38, f:lensFor(38, 9)}]};

/* ═════════ 업그레이드 ═════════ */
const UPG = {
  panels:  {b:'solar', req:'A', name:'태양광 패널 추가', max:16, cost:l => 50 + 25*l, eff:l => `패널 ${3+l}장 → ${4+l}장`},
  battery: {b:'solar', req:'C', name:'배터리 용량', max:10, cost:l => 70*(l + 1), eff:l => `${100 + 50*l} → ${150 + 50*l} ⚡`},
  slots:   {b:'craft', name:'제작 칸', max:2, cost:l => 160*(l + 1), eff:l => `${1+l}칸 → ${2+l}칸`},
  speed:   {b:'craft', name:'제작 속도', max:3, cost:l => 130*(l + 1), eff:l => `밤마다 작업량 ${CRAFT_SPD[l]} → ${CRAFT_SPD[l+1]}`},
  lowPower:{b:'craft', req:'sensor', name:'자동 조준 절전', max:3, cost:l => 100*(l + 1), eff:l => `유지비 ${autoUpkeep(l).toFixed(2)} → ${autoUpkeep(l+1).toFixed(2)} ⚡/초`},
  sAcc:    {b:'train', name:'쫄병 조준 훈련', max:5, cost:l => 70*(l + 1), eff:l => `조준 ${Math.round((.4 + .1*l)*100)}% → ${Math.round((.5 + .1*l)*100)}%`},
  sHp:     {b:'train', name:'쫄병 체력 훈련', max:5, cost:l => 60*(l + 1), eff:l => `체력 ${8 + 3*l} → ${11 + 3*l}`},
  sPow:    {b:'train', name:'쫄병 사격 훈련', max:5, cost:l => 80*(l + 1), eff:l => `무기 배율 ×${(.5 + .1*l).toFixed(1)} → ×${(.6 + .1*l).toFixed(1)}`},
  barracks:{b:'train', name:'병영 늘리기', max:4, cost:l => 120*(l + 1), eff:l => `정원 ${3 + 2*l} → ${5 + 2*l}명`},
  hHp:     {b:'train', name:'주인공 체력', max:5, cost:l => 60*(l + 1), eff:l => `토벌 체력 ${12 + 5*l} → ${17 + 5*l}`},
  hPow:    {b:'train', name:'주인공 사격', max:5, cost:l => 70*(l + 1), eff:l => `무기 배율 ×${(.8*(1 + .25*l)).toFixed(2)} → ×${(.8*(1 + .25*(l+1))).toFixed(2)}`},
  hSpd:    {b:'train', name:'주인공 달리기', max:5, cost:l => 50*(l + 1), eff:l => `속도 +${12*l}% → +${12*(l+1)}%`},
  wallHp:  {b:'wall', name:'성벽 보강', max:5, cost:l => 100*(l + 1), eff:l => `성벽 ${30 + 10*l} → ${40 + 10*l}`},
};
const CRAFT_SPD = [1, 1.5, 2, 3];
const up = id => G.up[id] || 0;
const panelsN = () => 3 + up('panels');
/* ═════════ 광전 패널 (22번): 금속판 → 광전자 → 검출판. 충전 전압 U에서 전류 = 각 파장 광전류 × panelFrac (아래) ═════════ */
const SUN = (() => { const o = []; for (let nm = 300; nm <= 2500; nm += 5) o.push([nm, 1/(Math.pow(nm, 5)*(Math.exp(1.4388e7/(nm*5800)) - 1))]); return normSpec(o); })();
const METALS = {
  na:{name:'나트륨', W:2.3, color:'#f2c14e', need:0},
  cs:{name:'세슘', W:2.1, color:'#7be0c3', need:12},
  ag:{name:'산화세슘', W:1.1, color:'#ff9ad5', need:25},
  ca:{name:'칼슘', W:2.9, color:'#c9c4b8', need:null},
};
const DROP_METAL = {ag:'ag', cs:'cs', na:'na', kn:'na', ca:'ca', sp:'cs', sk:'cs', sh:'na', Bs:'cs', Bk:'na', Bg:'ca', Bd:'na'};
/* 목록에 보이는 몬스터(꼬마 슬라임처럼 갈라져서만 나오는 건 뺀다) */
const foeEntries = () => Object.entries(FOES).filter(([, f]) => !f.mini);
const SHADOW_NEAR = 12, LAMP_LIGHT = 25;
/* 양자 유령의 간섭무늬: 밝은 줄 k = −2…2, 위치 x = k·Δx (성 가운데가 0), 밝기 ρ ∝ cos²(무늬) × 한 슬릿 회절 봉우리 → 가운데가 제일 밝다 */
const QG_DX = 7, QG_RHO = [.12, .62, 1, .62, .12], QG_SPREAD = 2.4, QG_SHOW = 1.6;
const qgPick = r => { const t = QG_RHO.reduce((a, b) => a + b, 0); let x = r*t; for (let k = 0; k < 5; k++){ if ((x -= QG_RHO[k]) <= 0) return k - 2; } return 2; };   // 박쥐(칼륨) · 거인(바륨)은 패널 금속이 아니라 골드만
const PANEL_K = 1280, PN_U = .55, PN_EG = 1.1;
/* 금속판 패널 한 장 = 평행판 광전관. 충전 전압 U를 거슬러 반대쪽 판에 닿은 전자만 충전한다.
   전자: 운동 에너지 0 ~ Kmax(= E − W)에 고르게, 방향 cos θ 분포. 평행판에서는 판에 수직인 운동 에너지 K cos²θ ≥ eU여야 닿는다
   → 한 파장의 전류 비율 = 1 − w + w ln w  (w = eU/Kmax; 실험실 광전관 식 labFrac에서 k = 1인 경우)
   (예전 식은 정지 전압이 U보다 큰 빛만 통째로 더해서 그래프가 5 nm 간격 계단이었다)
   PANEL_KM: 나트륨 패널이 기본 충전 전압 0.5 V에서 예전(0.3 V, 계단 식)과 같은 하루 충전량이 되게 맞춘 값 */
const PANEL_KM = 7646, U_DEFAULT = .5;
const panelFrac = (U, Km) => U <= 0 ? 1 : U >= Km ? 0 : (w => 1 - w + w*Math.log(w))(U/Km);
const labOk = k => !!(G.lab && G.lab[k]);
function sunLines(W, sc = 1){ return SUN.filter(([nm]) => 1240/nm > W).map(([nm, w]) => ({I:sc*w/(1240/nm), V:1240/nm - W, nm})); }
const currentAt = (L, U) => L.reduce((s, l) => s + l.I*panelFrac(U, l.V), 0);
const chargeU = () => labOk('cond') ? G.chargeU : U_DEFAULT;
function panelPower(metal = G.panelMetal, U = chargeU()){
  if (labOk('pn')) return PANEL_K*PN_U*SUN.filter(([nm]) => 1240/nm > PN_EG).reduce((s, [nm, w]) => s + w/(1240/nm), 0);
  return PANEL_KM*U*currentAt(sunLines(METALS[metal].W), U);
}
function bestU(metal = G.panelMetal){ let b = 0, bu = 0; for (let U = 0; U <= 3.2; U += .01){ const p = panelPower(metal, U); if (p > b){ b = p; bu = U; } } return {U:bu, P:b}; }
const dayCharge = () => panelsN()*panelPower();
const batteryCap = () => 100 + 50*up('battery');
const craftSlots = () => 1 + up('slots');
const craftSpeed = () => CRAFT_SPD[up('speed')];
function autoUpkeep(l = up('lowPower')){ return .25*(1 - .2*l); }
const soldierAcc = () => .4 + .1*up('sAcc');
const soldierHpMax = () => 8 + 3*up('sHp');
const soldierScale = () => .5 + .1*up('sPow');
const soldierMax = () => 3 + 2*up('barracks');
const recruitCost = () => 40 + 15*G.soldiers.length;
const heroHpMax = () => 12 + 5*up('hHp');
function weaponScale(){ return .8*(1 + .25*up('hPow')); }
const heroSpeed = () => 1 + .12*up('hSpd');
const wallMax = () => 30 + 10*up('wallHp');
const AUTO_PRICE = 40;
/* ═════════ 지도 터 (6.4): 대형 무기 공방 · 서쪽 호수 · 동쪽 바위산 ═════════ */
const SIEGE_BUILD = 400, SIEGE_MODS = [2, 3, 4], SIEGE_FEE = 120, SCOUT_BUFF = 1.1;
function siegeDesign(base, n){ const d = copy(base); delete d.id; d.kind = 'siege'; d.mods = n; d.base = base.id; d.name = `대형 ${base.name} ×${n}`; return d; }
const siegeCost = (base, n) => costOf(base)*n + SIEGE_FEE*(n - 1);
const siegeWork = (base, n) => workOf(base)*(1 + .5*(n - 1));
const FLOOR_COST = {3:250, 2:450, 1:700};

/* ═════════ 웨이브 밸런스 (무리함수: 초반에 빨리, 뒤로 갈수록 완만하게) ═════════ */
const sq = n => Math.sqrt(Math.max(0, n - 1));
/* ═════════ 웨이브 곡선 (6.4 · 두 번째 판, 사용자: "사인 빼고 미분한 식이 이차함수가 되게, 골드가 쌓이면 쉬워져서")
   밤 n의 총 체력(기본 몬스터 체력 단위), m = n − 1:
     B(n) = 4·(1 + c₁m + c₂m² + c₃m³)   →   B′(n) = 4·(c₁ + 2c₂m + 3c₃m²)  (이차함수: 밤마다 느는 양 자체가 점점 빨리 는다)
     c₁ = 0.7 · c₂ = 0.03 · c₃ = 0.001
     5밤 ≈ 17 · 10밤 ≈ 42 · 20밤 ≈ 128 · 30밤 ≈ 284 · 60밤 ≈ 1407 (첫 판 18 · 37 · 74 · 110 · 215)
   마리 수 = 총 체력 ÷ 천천히 느는 한 마리 체력(1 + 0.1(n−1)). 40마리에 닿으면 그 뒤는 한 마리 체력이 늘어난다.
   밤마다 테마(젤리 떼는 많고 약하게 · 골렘 습격은 적고 세게) · 5밤마다 정예(체력 ×4, 몸 ×1.45) ═════════ */
const WAVE_C = [.7, .03, .001], WAVE_CAP = 40, ELITE_HP = 4;
const waveB = n => { const m = n - 1; return 4*(1 + WAVE_C[0]*m + WAVE_C[1]*m*m + WAVE_C[2]*m*m*m); };
const waveDB = n => { const m = n - 1; return 4*(WAVE_C[0] + 2*WAVE_C[1]*m + 3*WAVE_C[2]*m*m); };
const hpBase = n => 1 + .1*(n - 1);   // 0.06이면 마리 수가 너무 빨리 불어나서(10밤 20마리) 새는 적이 성벽을 금방 깬다
const eliteCount = n => n % 5 === 0 && n % 10 !== 0 ? Math.min(3, 1 + Math.floor(n/20)) : 0;   // 5 · 15 · 25…밤에 1마리, 20밤부터 2 · 40밤부터 3 (10의 배수는 보스 밤)
/* 6.6 새 몬스터는 5밤마다 하나씩 (사용자: "너무 붙어서 나온다") · 첫 밤엔 젤리 · 슬라임 둘, 그다음 6 · 11 · 16 …밤
   10밤마다 보스가 오고, 보스는 그 전에 나온 몬스터 집안의 왕이다 → 잡으면 소굴 던전에 그 테마 챕터가 열린다 */
const FOE_FROM = {ag:1, cs:1, na:6, kn:11, ca:16, bt:21, sh:26, sp:31, ne:36, qg:41, gt:46};   // 5밤 간격 · 보스 밤(10의 배수)과 겹치지 않게 6 · 11 · 16 …
const FOE_TIP = {
  ag:'젤리 · 일함수가 아주 작아(1.1 eV) 빨간빛 · 적외선도 통해요', cs:'슬라임 · 세슘(2.1 eV)', na:'고블린 · 나트륨(2.3 eV) · 몽둥이로 성벽을 쳐요',
  kn:'편광 기사 · 방패가 편광판이라 투과축과 수직인 빛은 막혀요', ca:'칼슘 골렘 · 일함수가 커서(2.9 eV) 보라 · 자외선만 통해요', bt:'칼륨 박쥐 · 작고 빨라요 · 빛을 작게 모아야 다 맞아요',
  sh:'그림자 도깨비 · 램프 빛(25 m) 안에서만 보여요 · 레이저는 주변을 못 비춰요', sp:'분열 슬라임 · 쓰러지면 꼬마 둘로 갈라져요', ne:'네온 정령 · 1.96 eV 근처 광자만 흡수 · 헬륨-네온 · 빨강 화소',
  qg:'양자 유령 · 간섭무늬 밝은 줄에서만 나타나요 · 경로 측정기를 켜면 두 줄로', gt:'바륨 거인 · 저항이 커서 전압이 금방 막혀요 · 진동수 높은 빛'};
const WAVE_THEMES = {
  mix:{name:'섞여서', w:{}},
  jelly:{name:'젤리 떼', w:{ag:3, cs:2}, count:1.25},
  bat:{name:'박쥐 떼', w:{bt:4}, count:1.3, main:'bt'},
  knight:{name:'기사 행진', w:{kn:3}, main:'kn'},
  golem:{name:'골렘 습격', w:{ca:3}, count:.6, main:'ca'},
  giant:{name:'거인 행진', w:{gt:12}, count:.45, main:'gt'},   // 거인은 한 마리가 4.5마리 몫이라 마리 수를 줄인다
  shadow:{name:'그림자 습격', w:{sh:4}, main:'sh'},
  split:{name:'분열 떼', w:{sp:4}, count:.8, main:'sp'},
  spirit:{name:'정령 무리', w:{ne:4}, main:'ne'},
  ghost:{name:'유령 행렬', w:{qg:4}, main:'qg'},
};
const THEME_CYCLE = ['jelly', 'bat', 'knight', 'golem', 'shadow', 'split', 'spirit', 'giant', 'ghost', 'mix'];
/* 테마는 그 몬스터가 나온 뒤에만. 새 몬스터가 처음 나오는 밤과 보스 밤은 섞여서 */
function waveTheme(n){ if (n < 4 || n % 10 === 0 || Object.values(FOE_FROM).includes(n)) return 'mix'; const t = THEME_CYCLE[(n - 4) % THEME_CYCLE.length], m = WAVE_THEMES[t].main; return !m || n > FOE_FROM[m] ? t : 'mix'; }
/* 몬스터 가중치(나온 뒤부터) */
const WAVE_W = {ag:n => Math.max(.15, 1 - .25*sq(n)), cs:() => .9, na:n => .6 + .05*sq(n), kn:n => .3 + .05*sq(n), ca:n => .15 + .05*sq(n), bt:n => .3 + .04*sq(n),
  sh:n => .25 + .03*sq(n), sp:n => .3 + .03*sq(n), ne:n => .2 + .03*sq(n), qg:n => .15 + .03*sq(n), gt:n => .05 + .02*sq(n)};
/* ── 보스: 10밤마다. 아직 못 잡은 보스 중 첫째가 온다(잡을 때까지 10밤마다 다시). 다 잡으면 차례로 돈다 ── */
const BOSS_ORDER = ['Bs', 'Bk', 'Bg', 'Bd', 'Bq'];
function bossFor(n){
  if (n % 10 !== 0) return null;
  const ok = BOSS_ORDER.filter(b => n > FOE_FROM[FOES[b].base]);
  const left = ok.filter(b => !((G && G.bosses) || {})[b]);
  return left[0] || ok[(n/10 - 1) % ok.length] || null;
}
const waveSize = n => clamp(Math.round(waveB(n)/hpBase(n)*(WAVE_THEMES[waveTheme(n)].count || 1)) - eliteCount(n), 3, WAVE_CAP);
const waveCount = waveSize;
/* 한 마리 체력 배율(보상 계산용 어림값) = 총 체력 ÷ (마리 수 + 정예 몫). 정예 한 마리는 보통 ELITE_HP마리 몫 */
const hpMul = n => waveB(n)/(waveSize(n) + ELITE_HP*eliteCount(n));
/* 실제 밤의 체력 배율: 뽑힌 몬스터들의 몫(unit · 정예 ×ELITE_HP · 보스는 자기 unit)을 다 더해서 총 체력이 꼭 B(n)이 되게 */
const unitOf = q => (FOES[q.type].unit || 1)*(q.elite ? ELITE_HP : 1);
const waveHpMul = (list, n) => waveB(n)/Math.max(1e-9, list.reduce((s, q) => s + unitOf(q), 0));
const spdMul = n => 1 + .04*sq(n);
const rewardMul = n => Math.pow(hpMul(n), .9);
function waveList(n){
  const count = waveSize(n), th = WAVE_THEMES[waveTheme(n)], out = [];
  for (let i = 0; i < count; i++){
    const w = Object.keys(WAVE_W).filter(k => n >= FOE_FROM[k]).map(k => [k, WAVE_W[k](n)]);
    for (const q of w) if (th.w[q[0]]) q[1] *= th.w[q[0]] + 1;   // 테마 몬스터가 더 자주
    const tot = w.reduce((t, [, x]) => t + x, 0); let r = Math.random()*tot, type = w[0][0];
    for (const [k, x] of w){ if ((r -= x) <= 0){ type = k; break; } }
    const armor = type === 'kn' ? (n < FOE_FROM.kn + 5 ? 90 : rnd([0, 45, 90, 90, 135])) : null;
    out.push({type, armor});
  }
  // 정예: 그 밤의 가장 센 종류로, 웨이브 뒤쪽에 섞는다
  const strong = n >= FOE_FROM.ca ? 'ca' : n >= FOE_FROM.kn ? 'kn' : n >= FOE_FROM.na ? 'na' : 'cs';
  for (let i = 0; i < eliteCount(n); i++) out.splice(Math.round(out.length*(.55 + .4*Math.random())), 0, {type:strong, armor:strong === 'kn' ? 90 : null, elite:true});
  // 보스: 맨 뒤에
  const B = bossFor(n); if (B) out.push({type:B, armor:FOES[B].base === 'kn' ? 0 : null, boss:true});
  return out;
}
function waveSummary(n){
  const have = Object.keys(FOE_FROM).filter(k => n >= FOE_FROM[k]).map(k => FOES[k].short);
  const th = waveTheme(n), ec = eliteCount(n), B = bossFor(n), fresh = Object.keys(FOE_FROM).filter(k => FOE_FROM[k] === n).map(k => FOES[k].short);
  return `약 ${waveSize(n)}마리${B ? ` · 보스 ${FOES[B].name}` : ''}${fresh.length ? ` · 새 몬스터 ${fresh.join(' · ')}` : ''}${th !== 'mix' ? ` · ${WAVE_THEMES[th].name}` : ''}${ec ? ` · 정예 ${ec}` : ''} · ${have.join(' · ')}${n >= FOE_FROM.kn + 5 ? ' · 기사 갑옷 각도 섞임' : ''}`;
}

/* ═════════ 교전 범위 모듈 (6.4): 연구 → 탑마다 구매. Ⅰ 수동 [최소–최대 m] · Ⅱ 설계 반값 폭 구간 자동 · Ⅲ 효율 문턱 ═════════ */
const RANGE_PRICE = 60, EFF_MIN = .35;
function rangeOf(T){
  if (!T || !T.rng) return [0, 100];
  if (T.rng.auto && G.research.range2){ const b = band(T.design); return b ? [Math.max(0, b[0] - 2), Math.min(100, b[1] + 2)] : [0, 100]; }
  return [T.rng.min, T.rng.max];
}
const peakCache = new WeakMap();
function peakV(d, type, armor){
  let m = peakCache.get(d); if (!m){ m = {}; peakCache.set(d, m); }
  const k = `${type}|${armor}`; if (m[k] != null) return m[k];
  let best = 0; for (let x = 1; x <= 100; x += 3) best = Math.max(best, hitD(d, FOES[type], x, armor, null).v);
  return (m[k] = best);
}

/* ═════════ 상태 ═════════ */
function setDefaults(){ return {stick:'fixed', side:'left', size:'m', autoClose:true, hard:false, dmgText:true, sens:'m', gfx:'auto'}; }
function loadSettings(){ try { return Object.assign(setDefaults(), JSON.parse(localStorage.getItem('johamin-castle-settings') || '{}')); } catch(e){ return setDefaults(); } }
function saveSettings(){ try { localStorage.setItem('johamin-castle-settings', JSON.stringify(G.settings)); } catch(e){} }
function loadBest(){ try { return Object.assign({wave:0, dps:0, sortie:0}, JSON.parse(localStorage.getItem('johamin-castle-best') || '{}')); } catch(e){ return {wave:0, dps:0, sortie:0}; } }
function saveBest(){ try { localStorage.setItem('johamin-castle-best', JSON.stringify(G.best)); } catch(e){} }
let G, F, bestDirty = false, nextUid = 1;
function newGame(){
  G = {
    mode:'map', wave:1, gold:400, wallHp:30,
    designs:copy(PRESETS), weapon:copy(PRESETS.find(p => p.id === 'lantern')), nextDesign:1,
    inventory:[], craft:[], soldiers:[], nextSoldier:1,
    energy:100, research:{}, up:{}, floors:{4:true}, laserExam:false, exams:{},
    sel:null, placeView:'follow', building:null, dept:'design',
    hero:{x:0, floor:4, route:[], climb:null, yaw:0},
    view:'third', aim:null, aimHeld:false, ride:null,
    enemies:[], queue:[], spawnT:0, kills:0, total:0, waveGold:0,
    sortie:null, sortieUsed:false, sortieResult:null, floats:[], anim:null,
    learn:true, ptype:0, solved:{}, winOpen:true, showSettings:false,
    autoSortie:'off', tSel:null,
    panelMetal:'na', metals:{na:0, cs:0, ag:0, ca:0}, lab:{recs:[]}, chargeU:U_DEFAULT,
    sites:{siege:false, mount:false, lakeDay:0, mountDay:0, scoutDay:0},
    bosses:{}, bossDown:false, which:false, dg:{day:0, ch:{}, relics:[]}, town:null,
    stick:{x:0, y:0}, keys:{}, settings:loadSettings(), best:loadBest(), report:null,
  };
}
const bumpBest = v => { if (v > G.best.dps){ G.best.dps = v; bestDirty = true; } };

/* ═════════ 자동 저장 (낮 상태만 저장 · 밤 도중에 꺼지면 그날 낮으로) ═════════ */
const SAVE_KEY = 'johamin-castle-save-v1';
const SAVE_FIELDS = ['wave', 'gold', 'wallHp', 'designs', 'weapon', 'nextDesign', 'inventory', 'craft', 'soldiers', 'nextSoldier', 'energy', 'research', 'up', 'floors', 'laserExam', 'exams', 'learn', 'ptype', 'solved', 'autoSortie', 'panelMetal', 'metals', 'lab', 'chargeU', 'look', 'sites', 'bosses', 'bossDown', 'which', 'dg', 'town'];
function snapshot(){
  const o = {v:6, at:Date.now(), nextUid};
  for (const k of SAVE_FIELDS) o[k] = G[k];
  o.towers = SOCKETS.map(so => so.tower ? {design:so.tower.design, uid:so.tower.uid, auto:so.tower.auto, autoOn:so.tower.autoOn, soldier:so.tower.soldier, rng:so.tower.rng || null} : null);
  return o;
}
let lastSaveStr = '';
function saveGame(){
  if (!G || !['map', 'forge', 'place', 'cleared', 'train', 'solar', 'dress'].includes(G.mode)) return false;
  try { const s = JSON.stringify(snapshot()); if (s !== lastSaveStr){ localStorage.setItem(SAVE_KEY, s); lastSaveStr = s; } return true; } catch(e){ return false; }
}
function readSave(){ try { const o = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); return o && o.v === 6 ? o : null; } catch(e){ return null; } }
function clearSave(){ try { localStorage.removeItem(SAVE_KEY); } catch(e){} lastSaveStr = ''; }
