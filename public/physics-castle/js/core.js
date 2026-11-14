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
const RT = .5, DMG_K = 300, LASER_MW = 100, LASER_WMIN = 1.0, LOSS = .03;
/* A: 가운데에서 나온 광선(높이 cm, 기울기), B: 광원 가장자리에서 나온 평행 광선 → 빔 반지름 = |A| + |B| */
const SOURCES = {
  bulb:{id:'bulb', name:'백열전등', price:10, draw:1.0, out:3200, pol:null, s:.5, div:.1, color:'#ffb35c', work:.5, sub:'연속 스펙트럼 · 대부분 적외선 · 밝지만 전기 많이'},
  fluo:{id:'fluo', name:'형광등', price:20, draw:.5, out:1600, pol:null, s:.9, div:.12, color:'#dff1ff', work:.5, sub:'선 스펙트럼 · 관이 길어 상이 커요'},
  led:{id:'led', name:'백색 LED', price:35, draw:.3, out:150, pol:null, s:.15, div:.06, color:'#f2f5ff', work:.5, sub:'파란 빛 + 노란 형광 · 작은 칩'},
  uv:{id:'uv', name:'UV 블랙라이트', price:60, draw:.45, out:120, pol:null, s:.4, div:.08, color:'#b47cff', work:1, sub:'365 nm 자외선 · 어둡지만 진동수 높음'},
  disp:{id:'disp', name:'디스플레이', price:40, draw:.2, out:350, pol:90, s:.7, div:.1, color:'#9fc4ff', work:1, sub:'RGB 화소 · 이미 90° 편광된 빛'},
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
  ag:{name:'산화세슘 젤리', short:'젤리', W:1.1, R:3,  color:'#ff9ad5', hp:40,  speed:4.6, reward:6,  wall:1, drop:3},
  cs:{name:'세슘 슬라임',   short:'슬라임', W:2.1, R:4,  color:'#7be0c3', hp:60,  speed:5,   reward:8,  wall:1, drop:4},
  na:{name:'나트륨 고블린', short:'고블린', W:2.3, R:6,  color:'#f2c14e', hp:90,  speed:6,   reward:11, wall:1, drop:5},
  ca:{name:'칼슘 골렘',     short:'골렘', W:2.9, R:10, color:'#c9c4b8', hp:70,  speed:3,  reward:20, wall:3, drop:12},
  kn:{name:'편광 기사',     short:'기사', W:2.3, R:6,  color:'#9db4ff', hp:110, speed:4.4,  reward:16, wall:2, drop:8},
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
function minWOf(d){ return isLaser(d) ? LASER_WMIN/Math.sqrt(capMult()/4) : 0; }
function srcPower(d){ return isLaser(d) ? (d.medium && d.pump ? powerAt(d.pump, d.R, d.loss ?? LOSS)*LASER_MW : 0) : srcOf(d).out*(d.source === 'disp' && d.pix && d.pix !== 'w' ? 1/3 : 1); }
function drawOf(d){ return isLaser(d) ? .4 + .2*d.pump + (MEDIA[d.medium] && MEDIA[d.medium].research ? .3 : 0) : srcOf(d).draw; }
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
/* 여러 파장 광전관 + 저항 R: 전압 u에서 흐르는 전류 = 정지 전압이 u보다 큰 빛들의 광전류 합. u = I(u)·R 이 되는 점을 찾아요 */
function solveCircuit(lines, R){
  lines = lines.filter(l => l.V > 0 && l.I > 0).sort((a, b) => b.V - a.V);
  let C = 0;
  for (let k = 0; k < lines.length; k++){
    C += lines[k].I;
    const vn = k + 1 < lines.length ? lines[k + 1].V : 0, u = Math.min(R*C, lines[k].V);
    if (u >= vn - 1e-12) return {u, I:C, Itot:lines.reduce((s, l) => s + l.I, 0), sat:R*C >= lines[k].V - 1e-12, V0:lines[0].V};
  }
  return {u:0, I:0, Itot:0, sat:false, V0:0};
}
const kindScale = d => d.kind === 'weapon' ? weaponScale() : d.kind === 'soldier' ? soldierScale() : 1;
function hitD(d, foe, dist, armor, polTheta, scaleOverride){
  const p = srcPower(d), zero = why => ({v:0, why, w:1, I:0, V0:0, u:0, sat:false, Ph:0, frac:0, t:0});
  if (!p) return zero('발진 안 함');
  const tr = traceD(d, Math.max(.01, dist), polTheta), sp = specOf(d);
  if (!sp.some(([nm]) => 1240/nm > foe.W)) return Object.assign(zero('E < W'), {w:tr.w});
  let t = tr.t; if (armor != null) t *= tr.pol == null ? .5 : cos2(tr.pol - armor);
  if (t < .005) return Object.assign(zero('편광 차단'), {w:tr.w});
  const frac = Math.min(1, (RT/Math.max(tr.w, minWOf(d)))**2), Ph = p*t*frac;
  const c = solveCircuit(sp.map(([nm, w]) => { const E = 1240/nm; return {I:Ph*w/E, V:E - foe.W}; }), foe.R);
  const P = c.u*c.u/foe.R, scale = scaleOverride ?? kindScale(d);
  return {v:DMG_K*P*scale, why:'', w:tr.w, I:c.I, Itot:c.Itot, V0:c.V0, u:c.u, sat:c.sat, P, Ph, frac, t, scale};
}
const fracAt = (d, dist) => Math.min(1, (RT/Math.max(traceD(d, Math.max(.01, dist)).w, minWOf(d)))**2);
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
  hPow:    {b:'train', name:'주인공 사격', max:5, cost:l => 70*(l + 1), eff:l => `무기 배율 ×${(.6*(1 + .25*l)).toFixed(2)} → ×${(.6*(1 + .25*(l+1))).toFixed(2)}`},
  hSpd:    {b:'train', name:'주인공 달리기', max:5, cost:l => 50*(l + 1), eff:l => `속도 +${12*l}% → +${12*(l+1)}%`},
  wallHp:  {b:'wall', name:'성벽 보강', max:5, cost:l => 100*(l + 1), eff:l => `성벽 ${30 + 10*l} → ${40 + 10*l}`},
};
const CRAFT_SPD = [1, 1.5, 2, 3];
const up = id => G.up[id] || 0;
const panelsN = () => 3 + up('panels');
/* ═════════ 광전 패널 (22번): 금속판 → 광전자 → 검출판. 충전 전압 U에서 전류 = 정지 전압이 U보다 큰 빛들의 광전류 ═════════ */
const SUN = (() => { const o = []; for (let nm = 300; nm <= 2500; nm += 5) o.push([nm, 1/(Math.pow(nm, 5)*(Math.exp(1.4388e7/(nm*5800)) - 1))]); return normSpec(o); })();
const METALS = {
  na:{name:'나트륨', W:2.3, color:'#f2c14e', need:0},
  cs:{name:'세슘', W:2.1, color:'#7be0c3', need:12},
  ag:{name:'산화세슘', W:1.1, color:'#ff9ad5', need:25},
  ca:{name:'칼슘', W:2.9, color:'#c9c4b8', need:null},
};
const DROP_METAL = {ag:'ag', cs:'cs', na:'na', kn:'na', ca:'ca'};
const PANEL_K = 1280, PN_U = .55, PN_EG = 1.1;
const labOk = k => !!(G.lab && G.lab[k]);
function sunLines(W, sc = 1){ return SUN.filter(([nm]) => 1240/nm > W).map(([nm, w]) => ({I:sc*w/(1240/nm), V:1240/nm - W, nm})); }
const currentAt = (L, U) => L.filter(l => l.V > U).reduce((s, l) => s + l.I, 0);
const chargeU = () => labOk('cond') ? G.chargeU : .3;
function panelPower(metal = G.panelMetal, U = chargeU()){
  if (labOk('pn')) return PANEL_K*PN_U*SUN.filter(([nm]) => 1240/nm > PN_EG).reduce((s, [nm, w]) => s + w/(1240/nm), 0);
  return PANEL_K*U*currentAt(sunLines(METALS[metal].W), U);
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
function weaponScale(){ return .6*(1 + .25*up('hPow')); }
const heroSpeed = () => 1 + .12*up('hSpd');
const wallMax = () => 30 + 10*up('wallHp');
const AUTO_PRICE = 40;
const FLOOR_COST = {3:250, 2:450, 1:700};

/* ═════════ 웨이브 밸런스 (무리함수: 초반에 빨리, 뒤로 갈수록 완만하게) ═════════ */
const sq = n => Math.sqrt(Math.max(0, n - 1));
const hpMul = n => 1 + .5*sq(n);
const spdMul = n => 1 + .04*sq(n);
const rewardMul = n => Math.pow(hpMul(n), .9);
const waveCount = n => Math.round(4 + 2.2*sq(n));
function waveList(n){
  const count = waveCount(n), out = [];
  for (let i = 0; i < count; i++){
    const w = [['ag', Math.max(.15, 1 - .25*sq(n))]];
    if (n >= 2) w.push(['cs', .9]);
    if (n >= 3) w.push(['na', .6 + .05*sq(n)]);
    if (n >= 5) w.push(['kn', .3 + .05*sq(n)]);
    if (n >= 6) w.push(['ca', .15 + .05*sq(n)]);
    const tot = w.reduce((t, [, x]) => t + x, 0); let r = Math.random()*tot, type = w[0][0];
    for (const [k, x] of w){ if ((r -= x) <= 0){ type = k; break; } }
    const armor = type === 'kn' ? (n < 8 ? 90 : rnd([0, 45, 90, 90, 135])) : null;
    out.push({type, armor});
  }
  if (n === 1) for (const o of out) o.type = 'ag';
  return out;
}
function waveSummary(n){
  const c = {ag:'젤리', cs:'슬라임', na:'고블린', kn:'기사', ca:'골렘'}, have = [];
  if (n >= 1) have.push(c.ag); if (n >= 2) have.push(c.cs); if (n >= 3) have.push(c.na); if (n >= 5) have.push(c.kn); if (n >= 6) have.push(c.ca);
  return `약 ${waveCount(n)}마리 · ${have.join(' · ')}${n >= 8 ? ' · 기사 갑옷 각도 섞임' : ''}`;
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
    energy:100, research:{}, up:{}, floors:{4:true}, laserExam:false,
    sel:null, placeView:'follow', building:null, dept:'design',
    hero:{x:0, floor:4, route:[], climb:null, yaw:0},
    view:'third', aim:null, aimHeld:false, ride:null,
    enemies:[], queue:[], spawnT:0, kills:0, total:0, waveGold:0,
    sortie:null, sortieUsed:false, sortieResult:null, floats:[], anim:null,
    learn:true, ptype:0, solved:{}, winOpen:true, showSettings:false,
    autoSortie:'off', tSel:null,
    panelMetal:'na', metals:{na:0, cs:0, ag:0, ca:0}, lab:{recs:[]}, chargeU:.3,
    stick:{x:0, y:0}, keys:{}, settings:loadSettings(), best:loadBest(), report:null,
  };
}
const bumpBest = v => { if (v > G.best.dps){ G.best.dps = v; bestDirty = true; } };

/* ═════════ 자동 저장 (낮 상태만 저장 · 밤 도중에 꺼지면 그날 낮으로) ═════════ */
const SAVE_KEY = 'johamin-castle-save-v1';
const SAVE_FIELDS = ['wave', 'gold', 'wallHp', 'designs', 'weapon', 'nextDesign', 'inventory', 'craft', 'soldiers', 'nextSoldier', 'energy', 'research', 'up', 'floors', 'laserExam', 'learn', 'ptype', 'solved', 'autoSortie', 'panelMetal', 'metals', 'lab', 'chargeU', 'look'];
function snapshot(){
  const o = {v:6, at:Date.now(), nextUid};
  for (const k of SAVE_FIELDS) o[k] = G[k];
  o.towers = SOCKETS.map(so => so.tower ? {design:so.tower.design, uid:so.tower.uid, auto:so.tower.auto, autoOn:so.tower.autoOn, soldier:so.tower.soldier} : null);
  return o;
}
let lastSaveStr = '';
function saveGame(){
  if (!G || !['map', 'forge', 'place', 'cleared', 'train', 'solar', 'dress'].includes(G.mode)) return false;
  try { const s = JSON.stringify(snapshot()); if (s !== lastSaveStr){ localStorage.setItem(SAVE_KEY, s); lastSaveStr = s; } return true; } catch(e){ return false; }
}
function readSave(){ try { const o = JSON.parse(localStorage.getItem(SAVE_KEY) || 'null'); return o && o.v === 6 ? o : null; } catch(e){ return null; } }
function clearSave(){ try { localStorage.removeItem(SAVE_KEY); } catch(e){} lastSaveStr = ''; }
