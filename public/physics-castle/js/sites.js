'use strict';
/* ═════════ 지도 터 (6.4): 대형 무기 공방 · 서쪽 호수 · 동쪽 바위산 ═════════
   지도가 펼쳐진 뒤(mapStage ≥ 1) 남쪽 공방 터 · 서쪽 호수 · 동쪽 바위산을 누르면 그 자리에 카드가 뜬다.
   · 대형 무기 공방(20 · 22번): 탑 설계 하나의 광원을 N개 묶는다 → 세기 N배. 전류 제한이면 전력이 N²배 가까이, 전압 포화면 그대로
   · 서쪽 호수(21번): 수면 반사광은 대부분 수평 편광 → 편광 필터 투과축을 세우면 반사광이 줄어 물속 보물이 보인다 (하루 한 번)
   · 동쪽 바위산(20번): 케플러식 망원경. 렌즈 사이 = f대물 + f접안이면 또렷, 배율 = f대물/f접안 → 적의 소굴을 정찰 (하루 한 번)
   이 파일은 hud.js 다음에 불러온다(hud의 같은 이름 함수를 감싼다). */
const SITE_KEYS = ['siege', 'lake', 'mount'];
SHEET_KEYS.add('site');
UI.site = null;
UI.sg = {base:'ledT', mods:2, foe:'cs'};
UI.lake = {th:20, found:null};
UI.mt = {fo:100, fe:5, L:60, done:false};
const MOUNT_BUILD = 150, LAKE_P = .8, SCOUT_M = 50;

/* 대형 무기는 옥상에만, 한 대만 */
function siegeBlock(so){
  if (so.floor !== 4) return '옥상에만 · 대형 무기는 무거워서 옥상(4층)에만 올려요';
  const other = SOCKETS.find(q => q !== so && q.tower && q.tower.design.kind === 'siege');
  return other ? `하나만 · 대형 무기는 성벽에 한 대만 · 지금 ${sockName(other)}에 있어요` : '';
}

/* ── 지도 그림 ── */
const _mapSVG10 = window.mapSVG;
window.mapSVG = function(){
  let s = _mapSVG10();
  if (mapStage() < 1) return s;
  const ink = '#5a3e28', S = G.sites, lakeOk = S.lakeDay !== G.wave, mtOk = S.mountDay !== G.wave;
  s = s.replace(/<text[^>]*>대형 무기 공방 터<\/text>/, '').replace('셋 다 준비 중 · 지을 날을 기다려요', '농장 · 광산은 준비 중');
  const spark = (x, y) => `<path d="M${x} ${y - 9} l2.5 6.5 l6.5 2.5 l-6.5 2.5 l-2.5 6.5 l-2.5 -6.5 l-6.5 -2.5 l6.5 -2.5 z" fill="#fff6d0" stroke="${ink}" stroke-width="1.2"/>`;
  const T = (x, y, t, sz = 20, w = 700) => `<text x="${x}" y="${y}" font-size="${sz}" font-weight="${w}" fill="${ink}" text-anchor="middle" stroke="none" font-family="Gaegu, 'IBM Plex Sans KR', sans-serif">${t}</text>`;
  const siege = `<g class="mp site" data-go="siege" tabindex="0" role="button" aria-label="대형 무기 공방" filter="url(#wob)">
      <rect x="792" y="620" width="176" height="160" fill="transparent" stroke="none"/>
      ${S.siege ? `<path d="M812 714 V664 l36 -24 l36 24 V714 Z" fill="#e2c592" stroke="${ink}" stroke-width="2.4"/>
        <path d="M836 714 v-26 h24 v26" fill="#c9a877" stroke="${ink}" stroke-width="2"/>
        <g transform="rotate(-24 900 676)"><rect x="884" y="668" width="70" height="16" rx="4" fill="#b9a27a" stroke="${ink}" stroke-width="2.2"/><circle cx="954" cy="676" r="9" fill="#a8e6ff" stroke="${ink}" stroke-width="2"/></g>
        <circle cx="900" cy="700" r="15" fill="#d6bf92" stroke="${ink}" stroke-width="2.2"/><path d="M866 640 c-6 -10 8 -14 2 -26" stroke="${ink}" stroke-width="1.6" fill="none" opacity=".7"/>` : spark(948, 640)}
      ${T(880, 742, '대형 무기 공방', 19)}${T(880, 762, S.siege ? '대형 포 만들기' : `짓기 ${SIEGE_BUILD}G`, 14, 400)}
    </g>`;
  const lake = `<g class="mp site" data-go="lake" tabindex="0" role="button" aria-label="서쪽 호수 · 편광 낚시" filter="url(#wob)">
      <ellipse cx="-104" cy="440" rx="112" ry="84" fill="transparent" stroke="none"/>
      ${lakeOk ? spark(-140, 410) + spark(-70, 432) : ''}
      <path d="M-150 446 q10 -6 20 0 t20 0 M-96 404 q10 -6 20 0 t20 0" stroke="#3f6d8f" stroke-width="1.6" fill="none"/>
      ${T(-104, 512, lakeOk ? '편광 낚시 · 오늘 한 번' : '오늘은 다 건졌어요', 14, 400)}
    </g>`;
  const mount = `<g class="mp site" data-go="mount" tabindex="0" role="button" aria-label="동쪽 바위산 · 관측소" filter="url(#wob)">
      <rect x="1016" y="376" width="182" height="146" fill="transparent" stroke="none"/>
      ${S.mount ? `<path d="M1084 404 a14 14 0 0 1 28 0 z" fill="#e2c592" stroke="${ink}" stroke-width="2"/><path d="M1100 396 l18 -12" stroke="${ink}" stroke-width="3"/>` : spark(1150, 392)}
      ${T(1110, 520, S.mount ? (mtOk ? '관측소 · 정찰' : '오늘 정찰 끝') : `관측소 짓기 ${MOUNT_BUILD}G`, 14, 400)}
    </g>`;
  const at = s.indexOf('<mask id="fm');
  const add = siege + lake + mount;
  return at > 0 ? s.slice(0, at) + add + s.slice(at) : s.replace(/<\/svg>\s*$/, `${add}</svg>`);
};
$('map').addEventListener('click', ev => {
  const g = ev.target.closest('.mp');
  if (g && SITE_KEYS.includes(g.dataset.go)){ if (mapStage() < 1) return; UI.site = UI.site === g.dataset.go ? null : g.dataset.go; G.showSettings = false; renderAll(); return; }
  if (UI.site){ UI.site = null; renderAll(); }
});
const _mapPanel10 = window.mapPanel;
window.mapPanel = function(){
  if (!painted) return renderAll();
  _mapPanel10();
  if (UI.site && mapStage() >= 1) paintPop('site', UI.site === 'lair' ? {fixed:'right'} : {el:`#map [data-go="${UI.site}"]`}, siteHtml(UI.site), false, {cls:`site site-${UI.site}`});
};
function siteHtml(k){ return k === 'siege' ? siegeHtml() : k === 'lake' ? lakeHtml() : mountHtml(); }

/* ── 대형 무기 공방 ── */
function siegeCurve(base, foe){
  const pts = []; for (let n = 1; n <= 6; n++){ const h = hitD(Object.assign(copy(base), {kind:'siege', mods:n}), foe, 40, foe === FOES.kn ? 90 : null); pts.push({n, v:h.v, sat:h.sat}); }
  return pts;
}
function siegeChart(pts, sel){
  const W = 280, H = 118, mx = Math.max(1e-6, ...pts.map(p => p.v)), bw = 30, gap = (W - 30 - bw*6)/5;
  const bars = pts.map((p, i) => { const h = Math.max(1.5, p.v/mx*(H - 34)), x = 26 + i*(bw + gap), y = H - 18 - h;
    return `<rect x="${x}" y="${y}" width="${bw}" height="${h}" rx="3" fill="${p.sat ? 'var(--ember)' : 'var(--good)'}" opacity="${p.n === sel ? 1 : .55}"/>
      <text x="${x + bw/2}" y="${H - 5}" text-anchor="middle">${p.n}개</text><text x="${x + bw/2}" y="${y - 3}" text-anchor="middle">${p.v >= 10 ? Math.round(p.v) : p.v.toFixed(1)}</text>`; }).join('');
  return `<svg class="sg-chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="광원 수에 따른 초당 데미지"><text x="2" y="12">초당 데미지 · 40 m</text>${bars}</svg>`;
}
function siegeHtml(){
  const S = G.sites, head = `<div class="ed-head"><h3>대형 무기 공방</h3>${cGold()}</div>`;
  if (!S.siege) return `${head}<p>탑 설계 하나를 골라 <b>같은 광원을 여러 개</b> 한 경통에 묶는 곳이에요. 옥상에 한 대만 올리고, 굵은 빔이 줄 선 적을 꿰뚫어요.</p>
    <p class="muted">광원 N개 = 세기 N배 → 광전류 N배. 그런데 데미지도 N배일까요? 지어 보면 알 수 있어요.</p>
    <button class="btn primary" type="button" data-sx="siegeBuild" ${G.gold >= SIEGE_BUILD ? '' : `disabled data-why="골드 부족 · ${SIEGE_BUILD}G가 필요해요"`}>${G.gold >= SIEGE_BUILD ? `공방 짓기 · ${SIEGE_BUILD}G` : `골드 부족 · ${SIEGE_BUILD}G`}</button>`;
  const towers = G.designs.filter(d => d.kind === 'tower');
  if (!towers.find(d => d.id === UI.sg.base)) UI.sg.base = (towers[0] || {}).id;
  const base = towers.find(d => d.id === UI.sg.base); if (!base) return `${head}<p class="muted">탑 설계가 없어요. 대장간 설계부에서 먼저 만들어요.</p>`;
  const n = UI.sg.mods, foe = FOES[UI.sg.foe], pts = siegeCurve(base, foe), one = pts[0], cur = pts[n - 1];
  const sd = siegeDesign(base, n), c = siegeCost(base, n), w = siegeWork(base, n), full = G.craft.length >= craftSlots(), poor = G.gold < c;
  const ratio = one.v > 0 ? cur.v/one.v : 0;
  const verdict = !one.v ? `<span class="warn">${hitD(base, foe, 40, UI.sg.foe === 'kn' ? 90 : null).why || '0'}</span> · 광원을 늘려도 0이에요` : cur.sat ? `<span class="gold">전압 포화</span> · ${n}개로 늘려도 ×${ratio.toFixed(1)}뿐이에요. u가 정지 전압 V₀ 아래에서 막혀요 → 진동수를 올려야 해요` : `<span class="ok">전류 제한</span> · ${n}개면 ×${ratio.toFixed(1)}. u ≪ V₀라면 P = I²R라서 N² = ${n*n}배지만, u가 커질수록 되돌아가는 전자가 늘어서 그보다 덜 늘어요`;
  const chip = (a, v, on, t, col) => `<button type="button" data-sx="${a}" data-v="${v}" aria-pressed="${on}">${col ? `<i style="background:${col}"></i>` : ''}${t}</button>`;
  return `${head}<div class="st-grid"><div>
    <div class="sg-lab">설계</div><div class="chips">${towers.map(d => chip('sgBase', d.id, d.id === base.id, d.name, beamColor(d))).join('')}</div>
    <div class="sg-lab">묶을 광원 수</div><div class="chips">${SIEGE_MODS.map(m => chip('sgMods', m, m === n, `${m}개`)).join('')}</div>
    <div class="sg-lab">표적 (40 m)</div><div class="chips">${foeEntries().map(([id, f]) => chip('sgFoe', id, id === UI.sg.foe, f.short, f.color)).join('')}</div>
    <div class="rows"><div class="row"><span>재료비 · 작업량</span><b>${c}G · ${w.toFixed(1)}</b></div><div class="row"><span>쏠 때 전기</span><b>${drawOf(sd).toFixed(2)} ⚡/초</b></div></div>
    <button class="btn primary" type="button" data-sx="siegeMake" ${full || poor ? `disabled data-why="${full ? '제작 칸이 꽉 찼어요 · 밤이 지나면 비어요' : `골드 부족 · ${c}G`}"` : ''}>${full ? '제작 칸 꽉 참' : poor ? `골드 부족 · ${c}G` : `${sd.name} 만들기 · ${c}G`}</button>
  </div><div>
    ${siegeChart(pts, n)}
    <p class="sg-v">${verdict}</p>
    <p class="muted">초록 = 전류 제한(I₀R &lt; V₀) · 주황 = 전압 포화. 저항이 큰 거인은 금방 포화돼요. 제작 칸은 대장간과 같이 쓰고, 다 되면 성벽 옥상 자리에서 설치해요.</p>
  </div></div>`;
}

/* ── 서쪽 호수: 편광 낚시 ── */
const lakeGlare = th => (1 - LAKE_P)/2 + LAKE_P*cos2(th);   // 반사광 투과 비율 (θ = 투과축과 수평 사이 각)
const lakeVis = th => .5/(.5 + 1.6*lakeGlare(th));          // 물속 빛(편광 안 됨 → 절반 통과) ÷ 전체. 반사광이 물속 빛의 1.6배 밝다
const LAKE_FIND = .55;
function lakeSVG(th){
  const g = lakeGlare(th), v = lakeVis(th);
  return `<svg class="lake" viewBox="0 0 280 140" role="img" aria-label="호수 수면">
    <defs><linearGradient id="lkW" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f6f8f"/><stop offset="1" stop-color="#123a52"/></linearGradient></defs>
    <rect x="0" y="0" width="280" height="140" rx="10" fill="url(#lkW)"/>
    <g id="lkUnder" opacity="${clamp((v - .25)/.5, 0, 1).toFixed(3)}">
      <path d="M40 112 h46 v-22 h-46 z M40 90 l6 -9 h34 l6 9" fill="#c9a24a" stroke="#5a3e28" stroke-width="2"/><rect x="58" y="96" width="10" height="8" fill="#5a3e28"/>
      <path d="M150 74 q22 -16 44 0 q-22 16 -44 0 z M194 74 l14 -10 v20 z" fill="#ffb27a" stroke="#5a3e28" stroke-width="2"/><circle cx="160" cy="72" r="2.5" fill="#1a0d04"/>
      <path d="M226 118 l10 -22 l10 22 l-10 8 z" fill="#b0e6ff" stroke="#3f6d8f" stroke-width="2"/>
    </g>
    <g id="lkGlare" opacity="${(g*.95).toFixed(3)}">
      <rect x="0" y="0" width="280" height="140" rx="10" fill="#f4f7ff"/>
      <path d="M0 30 Q70 18 140 30 T280 30 M0 62 Q70 50 140 62 T280 62 M0 96 Q70 84 140 96 T280 96" stroke="#ffffff" stroke-width="6" fill="none"/>
    </g>
    <g transform="translate(246 28)"><circle r="20" fill="rgba(20,30,50,.55)" stroke="#ffd166" stroke-width="2"/><g id="lkAxis" transform="rotate(${-th})"><line x1="-17" y1="0" x2="17" y2="0" stroke="#ffd166" stroke-width="3"/></g><text y="34" text-anchor="middle" fill="#ffd166" font-size="11">투과축</text></g>
  </svg>`;
}
function lakeHtml(){
  const S = G.sites, th = UI.lake.th, head = `<div class="ed-head"><h3>서쪽 호수 · 편광 낚시</h3><span>21번 편광</span></div>`;
  if (UI.lake.found) return `${head}<p class="sg-v"><span class="ok">건졌어요!</span> ${UI.lake.found}</p><p class="muted">수면 반사광을 거의 다 막아서 물속이 보였어요. 편광 선글라스가 눈부심을 줄이는 원리예요. 내일 또 와요.</p>`;
  if (S.lakeDay === G.wave) return `${head}<p class="muted">오늘은 이미 건졌어요. 밤을 보내고 내일 다시 와요.</p>`;
  const v = lakeVis(th), ok = v >= LAKE_FIND;
  return `${head}<div class="st-grid"><div>${lakeSVG(th)}<p class="muted">θ = 투과축과 수평 사이 각. 물속에서 올라오는 빛은 편광이 안 돼서 늘 절반이 지나가요.</p></div><div>
    <label class="lk-row"><span>편광 필터 투과축 θ</span><b id="lkThV">${th}°</b></label>
    <input id="lkTh" type="range" min="0" max="180" step="1" value="${th}" aria-label="편광 필터 투과축 각도">
    <p class="eq" id="lkEq">${lakeEq(th)}</p>
    <button class="btn primary" type="button" id="lkGo" data-sx="lakeCatch" ${ok ? '' : 'disabled data-why="반사광에 가려 물속이 안 보여요 · 투과축을 돌려 반사광을 줄여요"'}>${ok ? '보이는 걸 건지기' : '물속이 안 보여요'}</button>
  </div></div>`;
}
function lakeEq(th){
  const g = lakeGlare(th), v = lakeVis(th);
  return `수면 반사광: 대부분(${Math.round(LAKE_P*100)}%) 수평으로 진동<br>지나가는 반사광 = (1 − p)/2 + p·cos²θ = <b>${Math.round(g*100)}%</b><br>보이는 정도 = 물속 빛 ÷ 전체 = <b class="${v >= LAKE_FIND ? 'ok' : ''}">${Math.round(v*100)}%</b>${v >= LAKE_FIND ? ' → 보여요!' : ` (${Math.round(LAKE_FIND*100)}% 넘으면 보여요)`}`;
}
document.addEventListener('input', ev => {
  const t = ev.target; if (!t || t.id !== 'lkTh') return;
  const th = +t.value; UI.lake.th = th;
  const set = (id, f) => { const e = document.getElementById(id); if (e) f(e); };
  set('lkThV', e => e.textContent = `${th}°`); set('lkEq', e => e.innerHTML = lakeEq(th));
  set('lkAxis', e => e.setAttribute('transform', `rotate(${-th})`));
  set('lkGlare', e => e.setAttribute('opacity', (lakeGlare(th)*.95).toFixed(3)));
  set('lkUnder', e => e.setAttribute('opacity', clamp((lakeVis(th) - .25)/.5, 0, 1).toFixed(3)));
  const ok = lakeVis(th) >= LAKE_FIND;
  set('lkGo', e => { e.disabled = !ok; e.textContent = ok ? '보이는 걸 건지기' : '물속이 안 보여요'; if (ok) e.removeAttribute('data-why'); else e.dataset.why = '반사광에 가려 물속이 안 보여요 · 투과축을 돌려 반사광을 줄여요'; });
});
function lakeLoot(){
  const r = Math.random(), n = G.wave;
  if (r < .5){ const g = Math.round(40 + 12*Math.sqrt(n)*3); G.gold += g; return `상자에서 <b>${g}G</b>`; }
  const k = rnd(['cs', 'cs', 'ag', 'na']), c = rint(2, 4); G.metals[k] = (G.metals[k] || 0) + c; return `물고기가 물고 있던 <b>${METALS[k].name} 조각 ${c}개</b>`;
}

/* ── 동쪽 바위산: 케플러식 망원경 관측소 ── */
const MT_FO = [50, 100, 150], MT_FE = [1, 2, 5];
const mtSharp = M => Math.abs(M.L - (M.fo + M.fe));   // 또렷하려면 렌즈 사이 = f대물 + f접안 (두 초점이 겹친다)
function mountView(){
  const M = UI.mt, mag = M.fo/M.fe, blur = Math.min(8, mtSharp(M)*.6), sz = clamp(mag/12, .5, 8);
  // 오늘 밤 나올 수 있는 종류(테마 몬스터는 두 번) — 무작위로 뽑지 않아서 다시 그려도 같다
  const th = WAVE_THEMES[waveTheme(G.wave)], kinds = Object.keys(FOE_FROM).filter(k => G.wave >= FOE_FROM[k]);
  const tonight = [...Object.keys(th.w).filter(k => kinds.includes(k)), ...kinds].slice(0, 8);
  const sil = tonight.map((k, i) => { const x = -48 + (i % 4)*32, y = -10 + Math.floor(i/4)*30, col = FOES[k].color;
    return `<g transform="translate(${x} ${y}) scale(${(sz/4).toFixed(3)})"><ellipse cx="0" cy="0" rx="9" ry="7" fill="${col}"/><circle cx="-3" cy="-2" r="1.6" fill="#111"/><circle cx="3" cy="-2" r="1.6" fill="#111"/></g>`; }).join('');
  return `<svg class="scope" viewBox="-70 -70 140 140" role="img" aria-label="망원경으로 본 모습">
    <defs><clipPath id="scC"><circle r="62"/></clipPath><filter id="scB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur id="scBlur" stdDeviation="${blur.toFixed(2)}"/></filter></defs>
    <circle r="66" fill="#0b1220" stroke="#ffd166" stroke-width="3"/>
    <g clip-path="url(#scC)"><rect x="-70" y="-70" width="140" height="140" fill="#3a4a3a"/><g id="scImg" filter="url(#scB)" transform="rotate(180)"><path d="M-70 20 L-30 -10 L0 12 L30 -14 L70 18 L70 70 L-70 70 Z" fill="#5a4a3a"/>${sil}</g></g>
    <line x1="-62" y1="0" x2="62" y2="0" stroke="rgba(255,255,255,.25)"/><line x1="0" y1="-62" x2="0" y2="62" stroke="rgba(255,255,255,.25)"/>
  </svg>`;
}
function mountHtml(){
  const S = G.sites, M = UI.mt, head = `<div class="ed-head"><h3>동쪽 바위산 · 관측소</h3><span>20번 망원경</span></div>`;
  if (!S.mount) return `${head}<p>바위산 꼭대기에서는 북쪽 적의 소굴까지 보여요. 관측소를 지으면 <b>케플러식 망원경</b>으로 오늘 밤 올 적을 미리 볼 수 있어요.</p>
    <button class="btn primary" type="button" data-sx="mountBuild" ${G.gold >= MOUNT_BUILD ? '' : `disabled data-why="골드 부족 · ${MOUNT_BUILD}G가 필요해요"`}>${G.gold >= MOUNT_BUILD ? `관측소 짓기 · ${MOUNT_BUILD}G` : `골드 부족 · ${MOUNT_BUILD}G`}</button>`;
  if (S.mountDay === G.wave) return `${head}<p class="sg-v"><span class="ok">정찰 끝</span> · 오늘 밤 탑 데미지 ×${SCOUT_BUFF}</p>${forecastHtml()}`;
  const mag = M.fo/M.fe, d = mtSharp(M), ok = d <= 1 && mag >= SCOUT_M;
  return `${head}<div class="st-grid"><div>${mountView()}<p class="eq" id="mtEq">${mountEq()}</p></div><div>
    <div class="sg-lab">대물렌즈 (앞)</div><div class="chips">${MT_FO.map(f => `<button type="button" data-sx="mtFo" data-v="${f}" aria-pressed="${f === M.fo}">f ${f} cm</button>`).join('')}</div>
    <div class="sg-lab">접안렌즈 (눈 쪽)</div><div class="chips">${MT_FE.map(f => `<button type="button" data-sx="mtFe" data-v="${f}" aria-pressed="${f === M.fe}">f ${f} cm</button>`).join('')}</div>
    <label class="lk-row"><span>두 렌즈 사이</span><b id="mtLV">${M.L} cm</b></label>
    <input id="mtL" type="range" min="10" max="170" step="1" value="${M.L}" aria-label="두 렌즈 사이 거리">
    <button class="btn primary" type="button" id="mtGo" data-sx="mountScout" ${ok ? '' : `disabled data-why="${mountWhy()}"`}>${ok ? '정찰 기록하기' : '아직 안 보여요'}</button>
  </div></div>`;
}
function mountWhy(){ const M = UI.mt, mag = M.fo/M.fe; return mtSharp(M) > 1 ? '흐려요 · 두 렌즈 사이를 f대물 + f접안에 맞춰요' : `너무 작게 보여요 · 배율 ${Math.round(mag)}배 → ${SCOUT_M}배 넘게`; }
function mountEq(){
  const M = UI.mt, mag = M.fo/M.fe, d = mtSharp(M);
  return `또렷: 렌즈 사이 = f대물 + f접안 = <b>${M.fo + M.fe} cm</b> · 지금 ${d <= 1 ? '<b class="ok">또렷해요</b>' : `${d} cm 어긋남`}<br>배율 M = f대물 ÷ f접안 = <b class="${mag >= SCOUT_M ? 'ok' : ''}">${+mag.toFixed(1)}배</b> (${SCOUT_M}배 넘어야 적이 보여요)<br>상이 거꾸로 보여요 (케플러식 = 도립)`;
}
document.addEventListener('input', ev => {
  const t = ev.target; if (!t || t.id !== 'mtL') return;
  UI.mt.L = +t.value; const M = UI.mt, ok = mtSharp(M) <= 1 && M.fo/M.fe >= SCOUT_M;
  const set = (id, f) => { const e = document.getElementById(id); if (e) f(e); };
  set('mtLV', e => e.textContent = `${M.L} cm`); set('mtEq', e => e.innerHTML = mountEq());
  set('scBlur', e => e.setAttribute('stdDeviation', Math.min(8, mtSharp(M)*.6).toFixed(2)));
  set('mtGo', e => { e.disabled = !ok; e.textContent = ok ? '정찰 기록하기' : '아직 안 보여요'; if (ok) e.removeAttribute('data-why'); else e.dataset.why = mountWhy(); });
});
function forecastHtml(){
  const rows = [0, 1, 2].map(k => { const n = G.wave + k, nw = Object.keys(FOE_FROM).filter(f => FOE_FROM[f] === n).map(f => FOES[f].short);
    return `<div class="row"><span>${k ? `${n}밤` : '오늘 밤'}</span><b>${waveSummary(n).split(' · ').slice(0, 3).join(' · ')}${nw.length ? ` · <span class="gold">새 적: ${nw.join(' · ')}</span>` : ''}</b></div>`; }).join('');
  return `<div class="rows">${rows}</div><p class="muted">정찰한 날 밤에는 탑이 미리 조준해 둬서 데미지 ×${SCOUT_BUFF}이에요.</p>`;
}

/* ── 카드 버튼 ── */
$('cards').addEventListener('click', ev => {
  const b = ev.target.closest('[data-sx]'); if (!b || b.disabled) return;
  const a = b.dataset.sx, v = b.dataset.v, S = G.sites;
  if (a === 'siegeBuild'){ if (S.siege || G.gold < SIEGE_BUILD) return; G.gold -= SIEGE_BUILD; S.siege = true; hint('대형 무기 공방을 지었어요 · 탑 설계를 골라 광원을 묶어 봐요'); }
  else if (a === 'sgBase') UI.sg.base = v;
  else if (a === 'sgMods') UI.sg.mods = +v;
  else if (a === 'sgFoe') UI.sg.foe = v;
  else if (a === 'siegeMake'){
    const base = G.designs.find(d => d.id === UI.sg.base); if (!base || G.craft.length >= craftSlots()) return;
    const n = UI.sg.mods, c = siegeCost(base, n); if (G.gold < c) return;
    const d = siegeDesign(base, n); G.gold -= c; G.craft.push({uid:nextUid++, design:d, need:siegeWork(base, n), done:0});
    hint(`${d.name} 제작 시작 · 밤이 지나면 창고에 들어가요`);
  }
  else if (a === 'lakeCatch'){ if (S.lakeDay === G.wave || lakeVis(UI.lake.th) < LAKE_FIND) return; S.lakeDay = G.wave; UI.lake.found = lakeLoot(); hint('호수에서 건졌어요!'); }
  else if (a === 'mountBuild'){ if (S.mount || G.gold < MOUNT_BUILD) return; G.gold -= MOUNT_BUILD; S.mount = true; hint('관측소를 지었어요 · 렌즈 두 개로 망원경을 맞춰 봐요'); }
  else if (a === 'mtFo') UI.mt.fo = +v;
  else if (a === 'mtFe') UI.mt.fe = +v;
  else if (a === 'mountScout'){ const M = UI.mt; if (S.mountDay === G.wave || mtSharp(M) > 1 || M.fo/M.fe < SCOUT_M) return; S.mountDay = S.scoutDay = G.wave; hint(`정찰 성공 · 오늘 밤 탑 데미지 ×${SCOUT_BUFF}`); }
  else return;
  renderAll();
});
/* 새 날이 되면 호수 결과 카드는 지운다 · 정찰한 밤엔 알려 준다 */
const _startWave10 = window.startWave;
window.startWave = function(){ UI.lake.found = null; UI.site = null; _startWave10(); if (G.sites.scoutDay === G.wave) hint(`밤 ${G.wave} · 정찰해 둔 덕분에 탑 데미지 ×${SCOUT_BUFF}`); };
