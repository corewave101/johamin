'use strict';
/* ═════════ 패널 없는 화면 (시안 v2) ═════════
   옆 창(#panel) · 부품함 사이드바(#parts) · 고정 상태줄(골드 · 성벽 …)을 쓰지 않는다. 대신
   · 아래 독(#dock): 그 화면의 이동 · 주요 행동. 화면 안 이동(대장간 부서, 발전단지 탭)도 독 왼쪽에 둔다
   · 카드(.pop, 여러 장): 누른 물건 옆에 붙어 다닌다 (탑 자리 · 렌즈 · 표적 · 램프 · 계기 · 쫄병 …)
   · 설정은 설정 버튼 밑으로 내려오는 카드
   · 페이지(#page): 연구부 · 제작부 · 업그레이드 · 명예의 전당. 독 위까지만 덮어서, 연 버튼으로 다시 닫는다
   · 상태 값(골드 · 성벽 · 배터리)은 그 값을 쓰는 곳 옆에 붙인다(.cGold · .cWall · .cBat)
   · 지도는 화면을 꽉 채우고 한 손가락으로 끌고 두 손가락(휠)으로 확대한다
   ui.js 등의 같은 이름 함수를 여기서 바꿔 끼운다(이 파일은 ui.js 다음에 불러온다). */
const IN_JOHAMIN = /\/johamin\//.test(location.pathname);
const UI = {menu:null, page:null, pageMode:null, noteOpen:true, givenOpen:false, trayInfo:null, testView:null, calc:false};
const CARDS = new Map();
let painted = null;

/* ── 칸 그리기 ── */
function beginUI(){ painted = {dock:false, topc:false, note:false, result:false, pops:new Set()}; }
function endUI(){
  const p = painted; painted = null;
  if (!p.dock) paintDock(''); if (!p.topc) paintTopc(''); if (!p.note) paintNote(''); if (!p.result) paintResult('');
  for (const k of [...CARDS.keys()]) if (!p.pops.has(k)) closePop(k);
  paintPage();
}
/* 누르는 중인 카드 · 슬라이더를 잡은 카드는 다시 그리지 않는다 (다시 그리면 버튼이 새로 만들어져서 그 탭이 사라진다) */
function guard(d){ if ((UI.rangeEl && d.contains(UI.rangeEl)) || (UI.pressEl && d.contains(UI.pressEl))){ UI.skipped = true; return true; } return false; }
document.addEventListener('pointerdown', ev => { const t = ev.target.closest && ev.target.closest('#cards .pop, #note, #page, #dock'); UI.pressEl = t ? ev.target : null; }, true);
const pressEnd = () => { if (!UI.pressEl) return; setTimeout(() => { UI.pressEl = null; if (UI.skipped){ UI.skipped = false; renderAll(); } }, 0); };
document.addEventListener('pointerup', pressEnd, true); document.addEventListener('pointercancel', pressEnd, true);
function paintDock(h){ const d = $('dock'); if (painted) painted.dock = !!h; if (guard(d)) return; if (d.dataset.h !== h){ d.innerHTML = h; d.dataset.h = h; } d.hidden = !h; renderHud(); requestAnimationFrame(syncDockH); }
function syncDockH(){ const d = $('dock'); stage.style.setProperty('--dockh', `${d.hidden ? 0 : d.offsetHeight + 12}px`); }
function paintTopc(h){ const d = $('topc'); if (painted) painted.topc = !!h; d.innerHTML = h; d.hidden = !h; }
function paintNote(h){ const d = $('note'); if (painted) painted.note = !!h; if (guard(d)) return; const st = d.scrollTop; d.innerHTML = h; d.hidden = !h; d.scrollTop = st; }
function paintResult(h){ const d = $('result'); if (painted) painted.result = !!h; d.innerHTML = h; d.hidden = !h; }
/* 카드: key마다 한 장. at = () => 3D 점 | {el, below}. opts.side = 'left' | 'right'(먼저 놓을 쪽), opts.cls */
function paintPop(key, at, h, noX, opts = {}){
  if (painted) painted.pops.add(key);
  let c = CARDS.get(key);
  if (c && guard(c.el)) return;
  if (!c){
    const el = document.createElement('div'); el.className = `pop ${opts.cls || ''}`; el.dataset.key = key;
    el.innerHTML = `<button class="popx" type="button" data-pclose="${key}" aria-label="닫기">✕</button><div class="popb"></div>`;
    $('cards').appendChild(el); c = {el}; CARDS.set(key, c);
  }
  const b = c.el.querySelector('.popb'), st = b.scrollTop;
  c.at = at; c.opts = opts; c.noX = !!noX; c.el.querySelector('.popx').hidden = !!noX; c.el.toggleAttribute('data-nox', !!noX);
  b.innerHTML = h; b.scrollTop = st; placeCard(c);
}
function closePop(key){ const c = CARDS.get(key); if (c){ c.el.remove(); CARDS.delete(key); } }
const hasPop = k => CARDS.has(k);
const dockH = () => { const d = $('dock'); return d.hidden ? 0 : d.offsetHeight + 12; };
/* 화면 위아래를 가리는 UI 높이(px): 3D 장면을 그 사이에 맞춘다 */
function occ(){
  const s = stage.getBoundingClientRect(); let top = 52 + (G && G.mode === 'forge' && G.dept === 'design' && !F.learn && fView() === 'bench' ? 78 : 0);
  for (const id of ['topc', 'note']){ const e = $(id); if (!e.hidden){ const r = e.getBoundingClientRect(); top = Math.max(top, Math.min(r.bottom - s.top + 8, s.height*.5)); } }
  return {top, bottom:dockH()};
}
function placeCard(c){
  const p = c.el, at = c.at; if (!at) return;
  const W = stage.clientWidth, Hh = stage.clientHeight, pw = p.offsetWidth, ph = p.offsetHeight, o = occ(), top0 = o.top, bot = Hh - o.bottom - 10;
  let left, top;
  if (typeof at === 'function'){
    const v = at(); if (!v){ p.style.visibility = 'hidden'; return; }
    camera.updateMatrixWorld(); const q = v.clone().project(camera);
    if (q.z > 1){ p.style.visibility = 'hidden'; return; }
    const x = (q.x + 1)/2*W, y = (1 - q.y)/2*Hh, R = x + 36, L = x - 36 - pw;
    if (c.opts.place){   // 표지판: 물건 바로 위(아래)에 꽂힌다. 물건이 화면 밖이면 같이 사라진다
      if (x < -10 || x > W + 10 || y < -10 || y > Hh + 10){ p.style.visibility = 'hidden'; return; }
      left = clamp(x - pw/2, 6, W - pw - 6); top = c.opts.place === 'below' ? y + 14 : y - ph - 16;
      p.style.setProperty('--tail', `${Math.round(x - left)}px`); p.dataset.place = c.opts.place;
      p.style.left = `${Math.round(left)}px`; p.style.top = `${Math.round(top)}px`; p.style.visibility = 'visible'; return;
    }
    left = c.opts.side === 'left' ? (L >= 10 ? L : R) : (R + pw <= W - 10 ? R : L);
    if (left < 10 || left + pw > W - 10) left = clamp(x - pw/2, 10, W - pw - 10);
    top = clamp(y - Math.min(ph*.3, 90), top0, Math.max(top0, bot - ph));
  } else if (at.fixed){
    left = W - pw - 14; top = clamp((top0 + bot - ph)/2, top0, Math.max(top0, bot - ph));
  } else {
    const el = document.querySelector(at.el); if (!el){ p.style.visibility = 'hidden'; return; }
    const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
    if (at.below){ left = clamp(r.right - s.left - pw, 10, W - pw - 10); top = r.bottom - s.top + 8; }
    else { const dk0 = $('dock'), dt = dk0.hidden ? r.top : Math.min(r.top, dk0.getBoundingClientRect().top);
      left = clamp(r.left - s.left + r.width/2 - pw/2, 10, W - pw - 10); top = dt - s.top - ph - 10;
      if (top < top0) top = Math.min(r.bottom - s.top + 10, Hh - ph - 10); }
  }
  p.style.left = `${Math.round(left)}px`; p.style.top = `${Math.round(top)}px`; p.style.visibility = 'visible';
}
document.addEventListener('pointerdown', ev => { const t = ev.target; if (t.matches && t.matches('input[type=range]')) UI.rangeEl = t; }, true);
const rangeEnd = () => { if (!UI.rangeEl) return; UI.rangeEl = null; if (UI.skipped){ UI.skipped = false; renderAll(); } };
window.addEventListener('pointerup', rangeEnd); window.addEventListener('pointercancel', rangeEnd);
(function popLoop(){ for (const c of CARDS.values()) placeCard(c); requestAnimationFrame(popLoop); })();

/* ── 상태 값은 쓰는 곳 옆에 ── */
const cGold = () => `<span class="chip-s gold">골드 <b class="cGold">${G.gold}</b></span>`;
const cWall = () => `<span class="chip-s hp">성벽 <b class="cWall">${Math.max(0, G.wallHp)}/${wallMax()}</b></span>`;
const cBat = () => `<span class="chip-s en">배터리 <b class="cBat">${Math.floor(G.energy)}/${batteryCap()}</b></span>`;
window.renderHud = function(){
  const set = (cls, v) => { for (const e of document.getElementsByClassName(cls)) if (e.textContent !== v) e.textContent = v; };
  set('cGold', String(G.gold)); set('cWall', `${Math.max(0, G.wallHp)}/${wallMax()}`); set('cBat', `${Math.floor(G.energy)}/${batteryCap()}`);
};

/* ── 페이지: 독 위까지만 덮는다. 연 독 버튼을 다시 누르면 닫힌다 ── */
const PAGES = {
  research:{t:'대장간 · 연구부', b:() => researchHtml(), gold:true},
  craft:{t:'대장간 · 제작부', b:() => craftHtml(), gold:true},
  'upg-train':{t:'훈련소 · 업그레이드', b:() => `<div class="pgrid">${upgradeSec('train', '훈련 · 업그레이드')}${trainStatsHtml()}</div>`, gold:true},
  'upg-solar':{t:'발전단지 · 업그레이드', b:() => `<div class="pgrid">${upgradeSec('solar', '발전단지 업그레이드')}</div>`, gold:true},
  study:{t:'광전 연구소 · 연구', b:() => `<div class="pgrid">${LABS.map(l => `<div class="sec">${labCard(l)}</div>`).join('')}<div class="sec"><h2>V₀ – 진동수 그래프 (탐구 C)</h2><canvas id="v0fPlot" class="spec tall" aria-label="정지 전압과 진동수 그래프"></canvas><p class="muted">eV₀ = hf − W → 기울기 = h/e, 절편 = −W/e. 진동수 f = c/λ.</p></div></div>`, after:() => drawV0f($('v0fPlot')), gold:true},
};
function openPage(id){ if (UI.page === id) return closePage(); UI.page = id; UI.pageMode = G.mode; renderAll(); }
function paintPage(){
  const pg = $('page'), P = UI.page && PAGES[UI.page];
  if (!P){ pg.hidden = true; pg.dataset.id = ''; return; }
  const same = pg.dataset.id === UI.page, st = same ? $('pageBody').scrollTop : 0;
  pg.dataset.id = UI.page; pg.hidden = false;
  $('pageHead').innerHTML = `<h2>${P.t}</h2>${P.gold ? cGold() : ''}<button class="tbtn" type="button" data-act="pageClose">닫기</button>`;
  $('pageBody').innerHTML = P.b(); $('pageBody').scrollTop = st;
  if (P.after) P.after();
}
function closePage(){
  const id = UI.page; UI.page = null;
  if ((id === 'research' || id === 'craft') && G.mode === 'forge'){ G.dept = 'design'; fSync(); }
  if (id === 'study' && G.mode === 'solar') LS().tab = 'lab';
  renderAll();
}

/* ═════════ 전체 그리기 ═════════ */
window.renderAll = function(){
  if (!UI.firstDone && G.mode === 'map'){ UI.firstDone = true; if (firstDress() && G.wave === 1){ G.mode = 'dress'; dressSync(); hint('처음이에요! 주인공을 꾸미고 시작해요 · 화면을 끌면 돌아가요'); } }
  renderTabs(); renderMap();
  beginUI();
  if (UI.page && UI.pageMode !== G.mode) UI.page = null;
  ({keep:keepPanel, map:mapPanel, forge:forgePanel, place:placePanel, wave:wavePanel, cleared:clearedPanel, sortie:sortiePanel, over:overPanel, build:() => {}, train:trainPanel, solar:solarPanel, dress:dressPanel})[G.mode]();
  if (G.showSettings && G.mode !== 'over' && G.mode !== 'build') paintPop('settings', {el:'[data-act="settings"]', below:true}, settingsHtml(), false, {cls:'drop'});
  endUI();
  renderHud(); renderParts();
  stage.dataset.mode = G.mode;
  $('cross').hidden = !(G.mode === 'wave' && G.view === 'first' && !G.ride);
  $('panel').hidden = true; stage.classList.remove('winopen');
  applySettings(); applyGfx();
  const stickMode = G.mode === 'wave' || G.mode === 'sortie';
  $('stick').hidden = !stickMode || (G.settings.stick === 'float' && floatPid == null);
  $('fireBtn').hidden = !(G.mode === 'wave' && G.ride);
  renderDialbox();
  $('timer').hidden = !G.sortie;
  $('veil').hidden = G.mode !== 'over';
  if (G.mode === 'over') $('veilBox').innerHTML = `<h2 style="color:var(--bad)">성벽 함락</h2><p class="muted" style="font-size:13px">밤 ${G.wave}에 무너졌어요 · 최고 방어 ${G.best.wave}</p><button class="btn primary" type="button" data-act="restart">처음부터 다시</button>`;
  if (bestDirty){ bestDirty = false; saveBest(); }
  saveGame();
};
window.renderTabs = function(){
  const m = G.mode; let h = '';
  if (m === 'map') h = IN_JOHAMIN ? `<button class="tbtn" type="button" data-act="goHome">← 조하민</button>` : '';
  else if (m === 'forge' || m === 'train' || m === 'solar' || m === 'dress' || m === 'keep') h = `<button class="tbtn" type="button" data-act="toMap">← 지도</button>`;
  else if (m === 'place') h = `<button class="tbtn" type="button" data-act="toMap">← 지도</button><button class="tbtn" type="button" data-act="placeView">${G.placeView === 'follow' ? '전체 보기' : '주인공 시점'}</button>`;
  if (m !== 'over' && m !== 'build') h += `<button class="tbtn" type="button" data-act="settings" aria-pressed="${G.showSettings}">설정 ${G.showSettings ? '▴' : '▾'}</button>`;
  $('tabs').innerHTML = h;
  if (m === 'wave' && !painted) paintDock(waveDockHtml());
};
window.renderParts = function(){
  $('parts').hidden = true; stage.classList.remove('partsopen');
  buildTray();
  for (const b of document.querySelectorAll('#dock [data-pcat]')) b.setAttribute('aria-pressed', String(b.dataset.pcat === partsCat));
};
window.settingsPanel = function(){};

/* ── 공통 조각 ── */
const dk = (attrs, text, sub, cls = '') => `<button class="dk ${cls}" type="button" ${attrs}>${text}${sub != null && sub !== '' ? `<small>${sub}</small>` : ''}</button>`;
const dseg = (items) => `<div class="dseg">${items.map(([attrs, text, on, dis]) => `<button type="button" ${attrs} aria-pressed="${!!on}" ${dis ? 'disabled' : ''}>${text}</button>`).join('')}</div>`;
const dgrp = (label, inner) => `<div class="dg">${label ? `<span class="dl">${label}</span>` : ''}${inner}</div>`;
function upgradeDockBtns(b){
  return Object.entries(UPG).filter(([, u]) => u.b === b).map(([id, u]) => { const lv = up(id), max = lv >= u.max, c = max ? 0 : u.cost(lv);
    return dk(max ? 'disabled' : `data-up="${id}" ${G.gold >= c ? '' : 'disabled'}`, `${u.name} Lv.${lv}`, max ? '최대' : `${c}G`); }).join('');
}

/* ═════════ 지도 ═════════ */
window.mapPanel = function(){
  if (!painted) return renderAll();
  paintDock(dgrp('', dk('data-act="night"', `밤 시작 · 웨이브 ${G.wave}`, waveSummary(G.wave), 'go')));
};
const _mapSVG = window.mapSVG;
window.mapSVG = function(){
  const ink = '#5a3e28', s = _mapSVG(), inv = G.inventory.filter(i => isMount(i.design)).length, placed = SOCKETS.filter(q => q.tower).length;
  const jobs = G.craft.length ? G.craft.map(j => `${j.design.name} ${Math.max(1, Math.ceil((j.need - j.done)/craftSpeed()))}밤`).join(' · ') : '';
  const extra = `<g font-family="Gaegu, 'IBM Plex Sans KR', sans-serif" fill="${ink}" text-anchor="middle">
      <text x="500" y="192" font-size="18" opacity=".85">오늘 밤 · ${waveSummary(G.wave)}</text>
      <text x="500" y="330" font-size="18">성벽 ${Math.max(0, G.wallHp)}/${wallMax()} · 설치한 탑 ${placed}대 · 창고 ${inv}개</text>
      ${jobs ? `<text x="255" y="566" font-size="15" opacity=".85">${jobs.length > 34 ? jobs.slice(0, 33) + '…' : jobs}</text>` : ''}
      <text x="765" y="572" font-size="16">밤이 끝나면 +${dayCharge().toFixed(0)} ⚡</text>
    </g>
    <g font-family="Gaegu, 'IBM Plex Sans KR', sans-serif" fill="${ink}" font-size="16"><text x="866" y="430" font-weight="700">금속 조각</text>${['na', 'cs', 'ag', 'ca'].map((k, i) => `<text x="866" y="${452 + i*19}">${METALS[k].name} ${G.metals[k] || 0}</text>`).join('')}</g>
    <g class="mp" data-go="keep" tabindex="0" role="button" aria-label="성주관" filter="url(#wob)">
      <rect x="20" y="320" width="150" height="240" fill="transparent" stroke="none"/>
      <path d="M44 500 V392 h16 v-14 h14 v14 h16 v-14 h14 v14 h16 v-14 h14 v14 V500 Z" fill="#e2c592" stroke="${ink}" stroke-width="2.4"/>
      <path d="M78 500 v-34 a14 14 0 0 1 28 0 v34" fill="#c9a877" stroke="${ink}" stroke-width="2.2"/>
      <path d="M58 420 h12 v14 h-12 z M114 420 h12 v14 h-12 z" fill="${ink}" opacity=".8"/>
      <path d="M92 378 v-46" stroke="${ink}" stroke-width="2.4"/><path d="M92 332 l26 8 l-26 8 z" fill="#c0392b" stroke="${ink}" stroke-width="1.6"/>
      <path d="M36 500 h112" stroke="${ink}" stroke-width="3"/>
      <text x="92" y="528" font-family="Gaegu, 'IBM Plex Sans KR', sans-serif" font-size="25" font-weight="700" fill="${ink}" text-anchor="middle" stroke="none">성주관</text>
      <text x="92" y="550" font-family="Gaegu, 'IBM Plex Sans KR', sans-serif" font-size="15" fill="${ink}" text-anchor="middle" stroke="none">명예의 전당 · 꾸미기</text>
    </g>`;
  return s.replace('</svg>', `${extra}</svg>`);
};
$('map').addEventListener('click', ev => { const g = ev.target.closest('.mp'); if (g && g.dataset.go === 'keep') enterKeep(); });
function keepHtmlOld(){ return `<div class="pgrid"><div class="sec"><h2>캐릭터 꾸미기</h2><p class="muted">머리 · 색 · 사진 얼굴을 바꿔요. 성벽 · 토벌에 나가는 주인공에 바로 적용돼요.</p><button class="btn primary" type="button" data-act="dress">꾸미러 가기</button></div>${recordsHtml()}</div>`; }
window.recordsHtml = function(){
  return `<div class="sec"><h2>기록</h2><div class="rows">
    <div class="row"><span>최고 방어 밤</span><b>${G.best.wave}</b></div>
    <div class="row"><span>최고 초당 데미지</span><b>${G.best.dps.toFixed(1)}</b></div>
    <div class="row"><span>토벌 최고 수확</span><b>${G.best.sortie}G</b></div></div>
    <p class="muted">이 기기에 저장돼요. 로그인하면 랭킹에도 올라가요.</p></div>` + rankHtml();
};

/* ═════════ 성벽 (낮) ═════════ */
const sockPos = () => { const so = SOCKETS[G.sel]; return so ? so.ring.getWorldPosition(new THREE.Vector3()).add(V(0, 1.2, 0)) : null; };
window.placePanel = function(){
  if (!painted) return renderAll();
  const next = [3, 2, 1].find(f => !built(f)), inv = G.inventory.filter(i => isMount(i.design)).length, placed = SOCKETS.filter(s => s.tower).length;
  paintDock(dgrp('', cGold() + cWall()) +
    dgrp('증축', next ? dk(`data-build="${next}" ${G.gold >= FLOOR_COST[next] ? '' : 'disabled'}`, `${FLOORS[next].name} 증축`, `${FLOOR_COST[next]}G · 탑 자리 4개`) : `<span class="dl">${builtFloors().length}층 다 지음</span>`) +
    dgrp('성벽', upgradeDockBtns('wall')) +
    dgrp('', dk('data-act="night"', `밤 시작 · 웨이브 ${G.wave}`, waveSummary(G.wave), 'go')));
  if (G.sel != null) paintPop('sock', sockPos, sockHtml());
};
function sockHtml(){
  const so = SOCKETS[G.sel], here = atSocket(G.sel);
  const head = (t) => `<div class="ed-head"><h3>${t}</h3><span class="${here ? 'go' : ''}">${here ? '도착' : '이동 중…'}</span></div>`;
  if (so.tower){
    const T = so.tower, d = T.design, idle = G.soldiers.filter(s => s.role === 'idle' && !s.down), op = G.soldiers.find(s => s.id === T.soldier);
    return `${head(`${sockName(so)} · ${d.name}`)}
      <div class="bp-f">${formula(d)}</div><div class="band">${bandHtml(d)}</div>${vsHtml(d, 44)}
      <p class="muted">강 가운데(44 m)에서 적별 초당 데미지 · 기사는 갑옷 90°</p>
      <div class="rows">
        <div class="row"><span>쫄병 (조준 ${Math.round(soldierAcc()*100)}%)</span>${op ? `<button class="btn" type="button" data-unassign="${so.i}">${op.name} 빼기</button>` : `<button class="btn" type="button" data-assign="${so.i}" ${idle.length ? '' : 'disabled'}>${idle.length ? `${idle[0].name} 맡기기` : '대기 쫄병 없음'}</button>`}</div>
        <div class="row"><span>자동 조준</span>${T.auto ? `<button class="btn" type="button" data-act="${T.autoOn ? 'autoOff' : 'autoOn'}">${T.autoOn ? '켜짐 · 끄기' : '꺼짐 · 켜기'}</button>` : `<button class="btn" type="button" data-act="buyAuto" ${G.gold >= AUTO_PRICE ? '' : 'disabled'}>달기 · ${AUTO_PRICE}G</button>`}</div>
      </div>${rangeHtml(T)}
      <p class="muted">쏠 때 ${drawOf(d).toFixed(2)} ⚡/초 · 자동은 유지비 ${autoUpkeep().toFixed(2)} ⚡/초 더. 밤에 탑 근처에서 직접 탈 수도 있어요.</p>
      <button class="btn danger" type="button" data-act="unplace" ${here ? '' : 'disabled'}>창고로 내리기</button>`;
  }
  const items = G.inventory.filter(i => isMount(i.design));
  if (!items.length) return `${head(`${sockName(so)} 자리`)}<p class="muted">창고에 탑이 없어요. 대장간 제작부에서 탑을 만들면 밤이 지난 뒤 올릴 수 있어요.</p>`;
  const groups = {}; for (const it of items){ const k = it.design.name + '|' + formula(it.design); (groups[k] = groups[k] || []).push(it); }
  const pv = items.find(i => i.uid === G.previewUid);
  return `${head(`${sockName(so)} 자리`)}<p class="muted">탑을 누르면 바닥에 세기 띠가 보여요.</p>
    <div class="trows">${Object.values(groups).map(g => { const it = g[0], d = it.design, on = g.some(i => i.uid === G.previewUid);
      return `<div class="trow ${on ? 'on' : ''}"><button class="tpick" type="button" data-prev="${it.uid}"><i style="background:${beamColor(d)}"></i><b>${d.name}</b><small>${bandHtml(d).replace(/<\/?b>/g, '')}${g.length > 1 ? ` · ${g.length}개` : ''}</small></button>
        ${d.kind === 'siege' && siegeBlock(so) ? `<button class="btn" type="button" disabled data-why="${siegeBlock(so)}">${siegeBlock(so).split(' · ')[0]}</button>` : `<button class="btn" type="button" data-place="${it.uid}" ${here ? '' : 'disabled'}>설치</button><button class="btn primary" type="button" data-place="${it.uid}" data-auto="1" ${here && G.gold >= AUTO_PRICE ? '' : 'disabled'}>+자동</button>`}</div>`; }).join('')}</div>
    ${pv ? `<div class="bp-f">${formula(pv.design)}</div>${vsHtml(pv.design, 44)}` : ''}`;
}

/* ═════════ 밤 · 토벌 · 결과 ═════════ */
function waveDockHtml(){
  if (G.ride) return dgrp('', dk('data-act="unride"', '내리기'));
  let h = nearSockets().filter(q => q.tower).map(q => dk(`data-act="ride" data-ride="${q.i}"`, `${sockName(q)} 탑승`, '', 'go')).join('');
  if (inStairs() && !H().climb){ const u = nextFloor(H().floor, 1), dn = nextFloor(H().floor, -1); if (u) h += dk('data-act="floorUp"', `▲ ${FLOORS[u].name}`); if (dn) h += dk('data-act="floorDown"', `▼ ${FLOORS[dn].name}`); }
  h += dk(`data-act="${G.view === 'third' ? 'first' : 'third'}"`, G.view === 'third' ? '1인칭' : '3인칭');
  h += G.sortie && G.sortie.auto ? dk('data-act="retreat"', '토벌대 퇴각', '', 'go') : G.sortieUsed ? dk('disabled', '토벌 끝', '밤마다 1번') : dk('data-act="sortie"', '성문 열고 토벌', `쫄병 ${G.soldiers.filter(s => s.role === 'sortie' && !s.down).length}명 동행`);
  return dgrp('', h);
}
window.wavePanel = function(){
  paintTopc(`<div class="live"><b>밤 ${G.wave}</b>${cWall()}<span id="wLeft"></span>${cBat()}<span id="wEn"></span></div>`);
  paintDock(waveDockHtml()); renderLive();
};
window.sortiePanel = function(){
  if (!painted) return renderAll();
  paintTopc(`<div class="live"><b>토벌 · 밤 ${G.wave}</b><span id="sLive"></span></div>`);
  paintDock(dgrp('', dk('data-act="retreat"', '퇴각 · 바로 성으로', '주운 결정은 그대로', 'go')));
  renderLive();
};
window.renderLive = function(){
  const en = $('wEn');
  if (en){ const auto = SOCKETS.filter(q => q.tower && q.tower.auto && q.tower.autoOn && q.tower.soldier == null).length, sold = SOCKETS.filter(q => q.tower && q.tower.soldier != null).length;
    en.innerHTML = `자동 탑 ${auto} · 쫄병 탑 ${sold}`; }
  renderHud();
  const n = $('wLeft'); if (n) n.innerHTML = `처치 <b>${G.kills}/${G.total}</b>`;
  const rl = $('rideLive');
  if (rl && G.ride){
    const so = SOCKETS[G.ride.sock], d = so.tower.design, e = G.ride.target;
    if (!e) rl.innerHTML = `조준 거리 ${Math.round(G.ride.aimD)} m · ${G.ride.firing || G.keys[' '] ? '발사 중' : '발사 버튼을 누르고 있으면 쏴요'}`;
    else {
      const oo = towerOrigin(so), dist = Math.hypot(e.mesh.position.x - oo.x, e.mesh.position.z - oo.z)/M2W, th = hasPol(d) ? G.ride.theta : null, r = hitD(d, foeOf(e), dist, e.armor, th), tr = traceD(d, dist, th);
      rl.innerHTML = `${FOES[e.type].name}${e.armor != null ? ` · 갑옷 ${e.armor}°` : ''} @ ${Math.round(dist)} m<br>` +
        (e.armor != null ? `편광 ${tr.t.toFixed(2)} × ${tr.pol == null ? '자연광 ½' : `cos²(${tr.pol}° − ${e.armor}°)`} = <b>${(tr.t*(tr.pol == null ? .5 : cos2(tr.pol - e.armor))).toFixed(2)}</b><br>` : '') +
        (r.v ? `I ${r.Itot.toFixed(3)} mA · V₀ ${r.V0.toFixed(2)} V · ${r.sat ? '<span class="gold">전압 포화</span>' : '전류 제한'}<br>초당 <b class="ok">${r.v.toFixed(1)}</b>` : `<span class="warn">0 · ${r.why}</span>`);
    }
  }
  const sl = $('sLive'); if (sl && G.sortie) sl.innerHTML = `체력 <b>${Math.max(0, G.sortie.hp)}/${G.sortie.max}</b> · 쫄병 ${G.sortie.squad.filter(u => !u.down).length}/${G.sortie.squad.length} · 결정 <b class="gold">${G.sortie.gold}G</b> · 남은 적 <b>${G.enemies.length + G.queue.length}</b>`;
};
window.clearedPanel = function(){
  const R = G.report || {};
  paintResult(`<div class="ed-head"><h3>밤 ${R.wave} 방어 성공</h3><span>날이 밝았어요</span></div>
    <div class="rows"><div class="row"><span>이번 밤 수입</span><b>+${R.gold}G</b></div><div class="row"><span>방어 보너스 (포함)</span><b>+${R.bonus}G</b></div>
    ${R.sortie ? `<div class="row"><span>${R.sortie.auto ? '자동 출병 수확' : '토벌 수확'} (포함)</span><b>+${R.sortie.got}G</b></div>` : `<div class="row"><span>토벌</span><b>안 나감</b></div>`}
    <div class="row"><span>낮 동안 태양광 충전</span><b>+${R.charged} ⚡</b></div>
    <div class="row"><span>제작 완료</span><b>${R.crafted && R.crafted.length ? R.crafted.join(', ') : '없음'}</b></div>
    <div class="row"><span>성벽</span><b>${G.wallHp} / ${wallMax()}</b></div></div>
    <div class="btns"><button class="btn primary" type="button" data-act="toMap">지도로 · ${G.wave}일째 낮</button></div><p class="muted">자동 저장했어요.</p>`);
};
window.overPanel = function(){};

/* ═════════ 설정 ═════════ */
function settingsHtml(){
  const row = (key, lab, opts) => `<div class="setrow"><span>${lab}</span><div class="seg">${opts.map(([v, t]) => `<button type="button" data-set="${key}:${v}" aria-pressed="${String(G.settings[key]) === String(v)}">${t}</button>`).join('')}</div></div>`;
  return `<div class="ed-head"><h3>설정</h3><span>v1.2.0 시안</span></div>
    <h2>조작</h2>${row('stick', '조이스틱', [['fixed', '고정'], ['float', '누른 곳']])}${row('side', '조이스틱 위치', [['left', '왼쪽'], ['right', '오른쪽']])}${row('size', '조이스틱 크기', [['s', '작게'], ['m', '보통'], ['l', '크게']])}${row('sens', '탑 조준 감도', [['s', '낮게'], ['m', '보통'], ['l', '높게']])}
    <div class="setrow"><span>밤 시점</span><div class="seg"><button type="button" data-act="third" aria-pressed="${G.view === 'third'}">3인칭</button><button type="button" data-act="first" aria-pressed="${G.view === 'first'}">1인칭</button></div></div>
    <h2>화면 · 문제</h2>${row('dmgText', '피해 · 보상 글자', [['true', '보이기'], ['false', '숨기기']])}${row('gfx', '그래픽 (그림자)', [['auto', '자동'], ['high', '높게'], ['low', '낮게']])}${row('hard', '문제 난이도', [['false', '보통'], ['true', '하드']])}
    <h2>저장</h2><p class="muted">이 기기(브라우저)에 낮마다 자동 저장돼요. 밤 도중에 꺼지면 그날 낮으로 돌아와요.</p>
    <button class="btn danger" type="button" data-act="${G.confirmReset ? 'resetYes' : 'resetAsk'}">${G.confirmReset ? '정말 지울까요? 한 번 더 누르면 처음부터' : '저장 지우고 처음부터'}</button>`;
}

/* ═════════ 대장간 ═════════ */
const deptSeg = () => `<div class="dg">${dseg([['research', '연구'], ['design', '설계'], ['test', '실험'], ['craft', '제작']].map(([k, t]) => [`data-dept="${k}"`, t, G.dept === k]))}</div>`;
const learnSeg = (on) => dseg([['data-act="learnOn"', '문제 풀기', on], ['data-act="learnOff"', '자유 설계', !on]]);
function fSelPos(){
  const k = F.sel && F.sel.kind; if (!k) return null;
  if (k === 'free'){ const e = fSelFree(); return e ? V(bToW(e.x), BEAM_Y + 1.1, 0) : null; }
  return ({source:V(X_LAMP, BEAM_Y + 1.1, 0), medium:V(X_MED, BEAM_Y + 1.1, 0), pump:V(X_MED, BEAM_Y + 1.1, -.82), mirror:V(X_OUT, BEAM_Y + 1.1, 0), barrel:V(BX1 + .3, BEAM_Y + 1.1, 0), dummy:V(mToW(F.dummy.x), BEAM_Y + 1.1, 0)})[k] || null;
}
const dummyPos = () => V(mToW(F.dummy.x), BEAM_Y + .6, 0);
function forgeUI(){
  if (G.dept === 'research' || G.dept === 'craft'){ UI.page = G.dept; UI.pageMode = 'forge'; paintDock(deptSeg()); return; }
  if (UI.page === 'research' || UI.page === 'craft') UI.page = null;
  if (F.learn) return learnUI();
  if (G.dept === 'test') return testUI();
  designUI();
}
window.forgePanel = forgeUI; window.researchPanel = () => renderAll(); window.craftPanel = () => renderAll();
window.testPanel = () => renderAll(); window.learnPanel = () => renderAll();

function designUI(){
  const list = G.designs.filter(d => d.kind === F.kind);
  paintDock(deptSeg() +
    dgrp('', dseg([['src', '광원'], ['opt', '렌즈'], ['laser', '레이저']].map(([c, t]) => [`data-pcat="${c}"`, t, partsCat === c]))) +
    dgrp('', dk(`data-menu="bar" aria-pressed="${UI.menu === 'bar'}"`, `경통 ${F.barrel}cm ▴`) + dk(`data-menu="designs" aria-pressed="${UI.menu === 'designs'}"`, '설계도 ▴') + dk(`data-menu="save" aria-pressed="${UI.menu === 'save'}"`, '저장 ▴') + dk(`data-menu="mode" aria-pressed="${UI.menu === 'mode'}"`, F.kind === 'weapon' ? '무기 ▴' : '탑 ▴')));
  const menu = {
    bar:() => `<div class="ed-head"><h3>경통 길이</h3>${cGold()}</div><div class="seg">${BARRELS.map(b => `<button type="button" data-fbar="${b.L}" aria-pressed="${F.barrel === b.L}" ${F.kind === 'weapon' && b.L > 40 ? 'disabled' : ''}>${b.L}cm${b.price ? ` · ${b.price}G` : ''}</button>`).join('')}</div><p class="muted">길수록 비싸요. 광원에서 멀리(a 크게) 둘수록 상이 작게 모여요.${F.kind === 'weapon' ? ' 무기는 40 cm까지.' : ''}</p>`,
    designs:() => `<div class="ed-head"><h3>설계도 불러오기</h3></div><div class="chips">${list.map(d => `<button class="chip ${F.sourceId === d.id ? 'on' : ''}" type="button" data-fload="${d.id}">${needsLaser(d) ? '🔒 ' : ''}${d.name}</button>`).join('')}<button class="chip" type="button" data-fnew="1">+ 빈 설계</button></div>`,
    save:() => `<div id="fsaveBody">${saveHtml()}</div>`,
    mode:() => `<div class="ed-head"><h3>만들 것 · 모드</h3></div><div class="seg"><button type="button" data-fkind="tower" aria-pressed="${F.kind === 'tower'}">탑</button><button type="button" data-fkind="weapon" aria-pressed="${F.kind === 'weapon'}">주인공 무기</button></div><div class="seg"><button type="button" data-act="learnOn">문제 풀기</button><button type="button" data-act="learnOff" aria-pressed="true">자유 설계</button></div>`,
  }[UI.menu];
  if (menu) paintPop('menu', {el:`[data-menu="${UI.menu}"]`}, menu(), false, {cls:'narrow'});
  else if (UI.trayInfo) paintPop('tray', () => UI.trayInfo && UI.trayInfo.pos, trayInfoHtml(UI.trayInfo.p), false, {cls:'narrow'});
  fRenderEditor();
}
function saveHtml(){
  const ok = fReady() && fPower(), src = F.sourceId ? G.designs.find(q => q.id === F.sourceId) : null, isPreset = src && PRESETS.some(q => q.id === src.id);
  if (!ok) return `<div class="ed-head"><h3>설계도 저장</h3></div><p class="muted">빛이 나와야 저장할 수 있어요.</p>`;
  const d = fDesign();
  return `<div class="ed-head"><h3>설계도 저장</h3><span>무료</span></div><p class="muted">광출력 ${fPower().toFixed(1)} mW · 전기 ${drawOf(d).toFixed(2)} ⚡/초 · 재료비 ${costOf(d)}G · 작업량 ${workOf(d)}<br>실제 물건은 제작부에서 만들어요.</p><div class="btns">${src && !isPreset ? `<button class="btn" type="button" data-fsave="over">덮어쓰기</button>` : ''}<button class="btn primary" type="button" data-fsave="new">새 설계도로 저장</button></div>`;
}
window.fRenderEditor = function(){
  if (G.mode !== 'forge' || G.dept !== 'design' || F.learn) return;
  const k = F.sel && F.sel.kind; let h = '';
  if (k === 'source' && !fIsLaser()){
    const S = SOURCES[F.source];
    h = `<div class="ed-head"><h3>광원 · ${S.name}</h3><span>0 cm</span></div>
      ${F.source === 'disp' ? `<h2>켜 둘 화소</h2><div class="seg">${Object.entries(PIX).map(([k2, p]) => `<button type="button" aria-pressed="${F.pix === k2}" data-fpix="${k2}">${p.color ? `<i style="background:${p.color}"></i>` : ''}${p.name}</button>`).join('')}</div>` : ''}
      ${calcBox()}<p class="muted">다른 광원은 선반에서 끌어다 놓아요.</p>`;
  } else if (k === 'medium' && fIsLaser()){
    h = `<div class="ed-head"><h3>매질 · ${MEDIA[F.medium].name}</h3></div><div class="seg">${MEDIA_LIST.filter(mediumOk).map(m => `<button type="button" aria-pressed="${F.medium === m.id}" data-fmed="${m.id}"><i style="background:${m.color}"></i>${m.nm}</button>`).join('')}</div>${calcBox()}`;
  } else if (k === 'pump' && fIsLaser()){
    h = `<div class="ed-head"><h3>펌핑 램프</h3></div><div class="seg">${PUMPS.filter(pumpOk).map(q => `<button type="button" aria-pressed="${F.pump === q.lv}" data-fpump="${q.lv}">${q.label}</button>`).join('')}</div>${calcBox()}<canvas id="rplot" class="spec" aria-label="반사율과 출력 그래프"></canvas>`;
  } else if (k === 'mirror' && fIsLaser()){
    h = `<div class="ed-head"><h3>출력 거울</h3><span>심화 · 시험 범위 밖</span></div><div class="range"><label for="sR">반사율 R <b id="vR"></b></label><span class="rng"><input id="sR" type="range" min="60" max="99" step="1" value="${Math.round(F.R*100)}"><span class="rng-e"><i>60%</i><i>99%</i></span></span></div>
      <canvas id="rplot" class="spec" aria-label="반사율과 출력 그래프"></canvas>${calcBox()}`;
  } else if (k === 'barrel'){
    h = `<div class="ed-head"><h3>경통 · ${F.barrel} cm</h3></div><div class="seg">${BARRELS.map(b => `<button type="button" data-fbar="${b.L}" aria-pressed="${F.barrel === b.L}" ${F.kind === 'weapon' && b.L > 40 ? 'disabled' : ''}>${b.L}cm${b.price ? ` · ${b.price}G` : ''}</button>`).join('')}</div>
      <p class="muted">${F.kind === 'weapon' ? '주인공 무기는 40 cm까지예요. ' : ''}렌즈는 경통 안(1 ~ ${F.barrel - 1} cm)에만 놓아요. 광원이 렌즈에서 멀수록(a가 클수록) 배율 b/a가 작아져서 빛이 작게 모여요.</p>`;
  } else if (k === 'free' && fSelFree()){
    const e = fSelFree();
    h = `<div class="ed-head"><h3>${fFreeName(e)}</h3><button class="rm" type="button" data-frm="free">빼기</button></div>` +
      `<div class="crow"><span>위치</span><input id="sX" type="range" min="1" max="${F.barrel - 1}" step="1" value="${e.x}"><b id="vX"></b></div>` +
      (e.type === 'pol' ? `<div class="crow"><span>θ</span><input id="sT" type="range" min="0" max="180" step="5" value="${e.theta}"><b id="vT"></b></div>`
        : `<div class="crow"><span>f</span><div class="stepper sm"><button type="button" data-fstep="-1" aria-label="1 cm 줄이기">−</button><input id="nF" type="number" inputmode="decimal" value="${e.f}" min="1" max="9999" step="0.1"><span>cm</span><button type="button" data-fstep="1" aria-label="1 cm 늘리기">+</button></div></div>
           <div class="crow"><span></span><input id="sFl" type="range" min="0" max="4000" step="1" value="${Math.round(Math.log10(e.f)*1000)}" aria-label="초점 거리 크게 바꾸기"><b></b></div>`) + calcBox();
  }
  if (h) paintPop('fsel', fSelPos, h, false, {cls:'narrow'}); else closePop('fsel');
  fRefresh();
};
const calcBox = () => `<button class="calc-t" type="button" data-calc="1">${UI.calc ? '계산 접기 ▴' : '계산 보기 ▾'}</button>${UI.calc ? '<div class="eq" id="fex"></div>' : ''}`;
window.fRefresh = function(){
  if (G.mode !== 'forge' || G.dept !== 'design' || F.learn) return;
  const all = fTrace(1e6), d = fDesign(), set = (id, v) => { const n = $(id); if (n) n.innerHTML = v; }, k = F.sel && F.sel.kind;
  if (k === 'source' && !fIsLaser()){
    const S = SOURCES[F.source];
    set('fex', `${S.sub}<br>${S.pol == null ? '편광 안 된 빛 → 첫 편광판에서 세기 ½' : `이미 ${S.pol}° 편광 → 첫 편광판부터 cos²(각도 차)`}<br>광원 반지름 ${S.s} cm · 광출력 ${srcPower(d)} mW · 전기 ${S.draw} ⚡/초` +
      (F.source === 'disp' ? `<br>${F.pix === 'w' ? 'R 620 · G 535 · B 455 nm 세 화소를 다 켜요' : `${PIX[F.pix].name} 화소만 · ${PIX[F.pix].nm} nm · E = ${(1240/PIX[F.pix].nm).toFixed(2)} eV · 세기 ⅓`}` : ''));
  } else if (k === 'medium' && fIsLaser()){ const E = 1240/MEDIA[F.medium].nm; set('fex', `E = hc/λ = 1240 / ${MEDIA[F.medium].nm} = <b>${E.toFixed(2)} eV</b> · 단색광`); }
  else if (k === 'pump' && fIsLaser()){ set('fex', `왕복 이득 g₀ = ${Math.round(PUMPS[F.pump-1].g0*100)}% · 밀도 반전이 클수록 이득이 커요`); drawRPlot($('rplot')); }
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
  set('fquick', fReady() && p ? `광출력 <b>${p.toFixed(1)} mW</b> · 경통 출구 빔 <b>${fmtLen(fTrace(F.barrel).w)}</b> · ${fIsLaser() ? '초점' : '광원의 상'} <b>${imgs.length ? imgs.map(i => fmtLen(i.at)).join(', ') : '없음 (퍼지거나 평행)'}</b> · 전기 <b>${drawOf(d).toFixed(2)} ⚡/초</b> · 재료비 ${costOf(d)}G` : '<span class="warn">빛이 안 나와요</span> · 광원을 확인해요');
  if (UI.menu === 'save') set('fsaveBody', saveHtml());
};

/* 실험부: 표적 옆 결과 카드 */
function testUI(){
  paintDock(deptSeg());
  paintPop('test', {fixed:'right'}, `<div id="fctl"></div><div id="fresult"></div>`, true, {cls:'narrow'});
  fRefreshTest();
}
window.fRefreshTest = function(){
  const el = $('fresult'); if (!el) return;
  const foe = fFoe(), armor = fArmor(), hit = fHit(), d = fDesign(), bd = fReady() ? band(d) : null, hide = F.learn && !F.fired;
  const set = (id, v) => { const n = $(id); if (n) n.innerHTML = v; };
  const ctl = $('fctl');
  if (ctl && !ctl.dataset.built){
    ctl.dataset.built = 1;
    ctl.innerHTML = F.learn ? '' : `<div class="seg foeseg">${Object.entries(FOES).map(([id, f]) => `<button type="button" data-ffoe="${id}" aria-pressed="${F.dummy.foe === id}"><i style="background:${f.color}"></i>${f.short}</button>`).join('')}</div>
      <div class="range"><label for="sD">거리 <b id="vD"></b></label><input id="sD" type="range" min="1" max="100" step="1" value="${F.dummy.x}"></div>
      ${F.dummy.foe === 'kn' ? `<div class="range"><label for="sA">갑옷 투과축 <b id="vA"></b></label><input id="sA" type="range" min="0" max="180" step="15" value="${armor}"></div>` : ''}`;
  }
  set('vD', `${F.dummy.x} m`); set('vA', `${armor ?? ''}°`);
  if (hide){ el.innerHTML = `<div class="ed-head"><h3>${foe.name} @ ${F.dummy.x} m</h3></div><p class="muted">쪽지에 값을 넣고 시험 발사를 누르면 여기에 결과가 나와요.</p>`; return; }
  el.innerHTML = `<div class="ed-head"><h3>${foe.name} @ ${F.dummy.x} m</h3><span>W ${foe.W} eV · R ${foe.R} kΩ${armor != null ? ` · 갑옷 ${armor}°` : ''}</span></div>
    <div class="big"><b class="${hit.v ? '' : 'zero'}">${hit.v ? hit.v.toFixed(1) : `0 · ${hit.why}`}</b><span>초당 데미지 · 가장 센 구간 ${bd ? `${bd[0]}–${bd[1]} m` : '-'}</span></div>
    <div class="seg"><button type="button" data-tview="calc" aria-pressed="${UI.testView === 'calc'}">계산</button><button type="button" data-tview="dist" aria-pressed="${UI.testView === 'dist'}">그래프</button><button type="button" data-tview="spec" aria-pressed="${UI.testView === 'spec'}">스펙트럼</button></div>
    ${!UI.testView ? '' : UI.testView === 'calc' ? elecHtml(hit, foe, armor) : !fReady() ? '' : UI.testView === 'spec' ? `<canvas id="spec" class="spec" aria-label="광원 스펙트럼"></canvas><p class="muted">빨간 선(일함수) 오른쪽 광자만 전자를 떼어 내요.</p>` : `<canvas id="dplot" class="spec" aria-label="거리별 데미지"></canvas><p class="muted">주황 = 전압 포화 · 점선 = 지금 표적 거리 · 전기 ${drawOf(d).toFixed(2)} ⚡/초</p>`}`;
  if (fReady()){ if (UI.testView === 'dist') drawDistPlot($('dplot')); if (UI.testView === 'spec') drawSpectrum($('spec'), d, foe.W); }
};

/* 문제 풀기: 위쪽 쪽지 */
function learnUI(){
  const P = F.prob, r = F.result;
  paintDock(deptSeg() + dgrp('', dk(`data-menu="ptype" aria-pressed="${UI.menu === 'ptype'}"`, `${PTYPES[G.ptype].short} ▴`) + dk(`data-menu="lmode" aria-pressed="${UI.menu === 'lmode'}"`, `${G.settings.hard ? '하드' : '보통'} ▴`)));
  if (UI.menu === 'ptype') paintPop('menu', {el:'[data-menu="ptype"]'}, `<div class="ed-head"><h3>문제 유형</h3></div><div class="chips">${PTYPES.map((q, i) => `<button class="chip ${i === G.ptype ? 'on' : ''}" type="button" data-ptype="${i}">${q.short}${G.solved[q.type] ? ` ✓${G.solved[q.type]}` : ''}</button>`).join('')}</div>`, false, {cls:'narrow'});
  if (UI.menu === 'lmode') paintPop('menu', {el:'[data-menu="lmode"]'}, `<div class="ed-head"><h3>난이도 · 모드</h3></div><div class="seg"><button type="button" data-act="diffNormal" aria-pressed="${!G.settings.hard}">보통</button><button type="button" data-act="diffHard" aria-pressed="${G.settings.hard}">하드</button></div><div class="seg"><button type="button" data-act="learnOn" aria-pressed="true">문제 풀기</button><button type="button" data-act="learnOff">자유 설계</button></div>`, false, {cls:'narrow'});
  const inputs = P.inputs.map((inp, k) => `<div class="num"><label for="li${k}">${inp.label}</label>
    <div class="stepper"><button type="button" data-lstep="-${k}" aria-label="줄이기">−</button><input id="li${k}" type="number" inputmode="decimal" value="${inputVal(inp)}" min="${inp.min}" max="${inp.max}" step="${inp.step}"><span>${inp.unit}</span><button type="button" data-lstep="+${k}" aria-label="늘리기">+</button></div></div>`).join('');
  const canBorrow = r && r.ok && fReady() && fPower() && !F.borrowed;
  paintNote(`<div class="note-h"><b>${P.title}</b><span class="tag">${P.unit}</span>
      <span class="note-b"><button class="btn primary" type="button" data-act="fire">시험 발사</button><button class="btn" type="button" data-act="newProb">새 문제</button><button class="rm" type="button" data-act="noteToggle" style="color:var(--ink)">${UI.noteOpen ? '접기 ▴' : '펼치기 ▾'}</button></span></div>
    ${UI.noteOpen ? `<p class="q">${P.text}</p><button class="calc-t" type="button" data-given="1">${UI.givenOpen ? '주어진 값 접기 ▴' : `주어진 값 ${P.given.length}개 보기 ▾`}</button>${UI.givenOpen ? `<div class="eq given">${P.given.map(g => `<span>${g}</span>`).join('')}</div>` : ''}
    <div class="note-in">${inputs || `<p class="muted">아래 선반에서 매질을 끌어다 공진기에 끼우세요. 지금: <b style="color:var(--ink)">${F.medium ? `${MEDIA[F.medium].name} ${MEDIA[F.medium].nm}nm` : '없음'}</b></p>`}</div>` : ''}
    ${r ? `<div class="btns"><span class="res-inline ${r.ok ? 'ok' : 'no'}"><b>${r.ok ? '정답!' : '아직이에요'}</b> ${r.msg}${!r.ok && F.fails >= 2 ? ` <span class="hint2">힌트 · ${P.hint}</span>` : ''}</span>
      ${r.ok ? `${r.reward ? `<span class="muted">보상 +${r.reward}G</span>` : ''}${canBorrow ? `<button class="btn" type="button" data-act="borrow">설계도 빌리기</button>` : F.borrowed ? '<span class="muted">설계도를 빌렸어요</span>' : ''}` : ''}</div>` : ''}`);
  if (G.dept === 'test') paintPop('test', {fixed:'right'}, `<div id="fresult"></div>`, true, {cls:'narrow'}), fRefreshTest();
}

/* 연구부 · 제작부: 전체 화면 */
function researchHtml(){
  const card = r => { const done = G.research[r.id], locked = r.req && !G.research[r.req], ek = examKind(r), needExam = ek && !examPassed(ek), myExam = exam && exam.kind === ek;
    let btn = '';
    if (!done){
      if (locked) btn = `<button class="btn" type="button" disabled>먼저: ${RESEARCH.find(q => q.id === r.req).name}</button>`;
      else if (needExam) btn = myExam ? '' : `<button class="btn primary" type="button" data-act="exam" data-exam="${ek}">자격 시험 보기 (3문제)</button>`;
      else btn = `<button class="btn primary" type="button" data-research="${r.id}" ${G.gold >= r.cost ? '' : 'disabled'}>${G.gold >= r.cost ? `연구하기 · ${r.cost}G` : `골드 부족 · ${r.cost}G`}</button>`;
    }
    const ex = ek && myExam && !examPassed(ek) ? `<div class="exam">${exam.map((q, i) => `<p>${i+1}. ${q.q}</p>${q.opts.map((o, j) => `<button type="button" class="opt ${q.pick === j ? 'on' : ''}" data-exq="${i}:${j}">${o}</button>`).join('')}`).join('')}<button class="btn primary" type="button" data-act="examSubmit" ${exam.every(q => q.pick != null) ? '' : 'disabled'}>제출</button></div>` : '';
    return `<div class="bpcard ${done ? 'done' : ''}"><div class="bph"><b>${r.name}</b><span>${done ? '완료' : r.unit}</span></div>${BP_ART[r.art] || ''}<p>${r.desc}</p>${btn}${ex}</div>`; };
  return `<p class="muted pnote">렌즈가 모으는 램프 빛 ×${lampGain().toFixed(2)} · 레이저 최소 반지름 ${(LASER_WMIN/Math.sqrt(capMult()/4)).toFixed(2)} cm · 레이저(23번 레이저)와 교전 범위(20번 렌즈)는 자격 시험 3문제를 통과해야 연구할 수 있어요.</p><div class="bpgrid">${RESEARCH.map(card).join('')}</div>`;
}
function craftHtml(){
  const inv = {}; for (const it of G.inventory){ const k = it.design.name + '|' + it.design.kind; (inv[k] = inv[k] || {d:it.design, items:[]}).items.push(it); }
  const slotsFree = craftSlots() - G.craft.length, designs = G.designs.filter(d => d.kind === 'tower' || d.kind === 'weapon');
  return `<div class="pcols">
    <div class="pcol">
      <div class="sec"><div class="ed-head"><h3>제작 중</h3><span>칸 ${G.craft.length}/${craftSlots()} · 밤마다 작업량 ${craftSpeed()}</span></div>
        ${G.craft.length ? G.craft.map(j => `<div class="job"><div class="row" style="border:0"><span><b style="color:var(--ink);font-family:var(--f-body)">${j.design.name}</b></span><b>${Math.max(1, Math.ceil((j.need - j.done)/craftSpeed()))}밤 남음</b></div><div class="bar"><i style="width:${Math.round(j.done/j.need*100)}%"></i></div></div>`).join('') : '<p class="muted">비어 있어요. 오른쪽 설계도에서 제작을 시작해요. 밤이 지나야 완성돼요.</p>'}</div>
      <div class="sec"><h2>창고</h2>
        ${Object.keys(inv).length ? Object.values(inv).map(g => `<div class="row"><span>${g.d.kind === 'weapon' ? '무기' : '탑'} · ${g.d.name}</span>${g.d.kind === 'weapon' ? `<span class="btns"><b>${g.items.length}개</b><button class="btn" type="button" data-equip="${g.items[0].uid}">주인공 장착</button></span>` : `<b>${g.items.length}개</b>`}</div>`).join('') : '<p class="muted">완성된 물건이 없어요.</p>'}
        <div class="row"><span>장착 중인 무기</span><b>${G.weapon.name}</b></div></div>
      ${upgradeSec('craft', '제작부 업그레이드')}
    </div>
    <div class="pcol wide"><div class="sec"><h2>설계도 · 눌러서 제작</h2><div class="bpgrid">${designs.map(d => { const c = costOf(d), nights = Math.ceil(workOf(d)/craftSpeed()), lock = needsLaser(d);
      return `<div class="bp" style="cursor:default"><div class="bp-h"><i style="background:${beamColor(d)}"></i><b>${d.name}</b><span class="cost">${c}G</span></div>
        <div class="bp-f">${d.kind === 'weapon' ? '무기 · ' : ''}${formula(d)}</div>
        <div class="band">작업량 ${workOf(d)} → <b>${nights}밤</b> · 전기 ${drawOf(d).toFixed(2)} ⚡/초</div>
        <button class="btn primary" type="button" data-craft="${d.id}" ${!lock && slotsFree > 0 && G.gold >= c ? '' : 'disabled'}>${lock ? '🔒 연구 필요' : slotsFree <= 0 ? '제작 칸이 꽉 찼어요' : G.gold < c ? '골드 부족' : '제작 시작'}</button></div>`; }).join('')}</div></div></div>
  </div>`;
}

/* ═════════ 부품함 = 대장간 바닥의 3D 선반 ═════════ */
const fTray = new THREE.Group(); fScene.add(fTray);
let trayPicks = [], trayKey = '';
const TRAY = {z0:BAR_R + 5.4, dz:2.7, dx:3.0, per:8};
const benchCX = () => F.source === 'laser' ? (X_REAR + BX1)/2 : (X_LAMP - 1 + BX1)/2;
function trayItems(){
  let list = PARTS().filter(p => p.cat === partsCat);
  if (F.learn && F.prob) list = PARTS().filter(p => F.prob.bin.includes(p.type) && !(p.type === 'medium' && MEDIA[p.value].research)).map(p => Object.assign(p, {lock:false}));
  return list;
}
const trayShown = () => G.mode === 'forge' && G.dept === 'design' && fView() === 'bench' && (!F.learn || (F.prob && F.prob.bin.length > 0));
const trayRows = () => Math.max(1, Math.ceil(trayItems().length/TRAY.per));
function trayModel(p){
  if (p.type === 'source'){ const g = new THREE.Group(); g.add(lampModel(p.value, .9)); return g; }
  if (p.type === 'laserkit') return part('medium', {value:'argon', post:false});
  return part(p.type, {value:p.value, f:30, theta:45, R:.9, post:false});
}
function buildTray(){
  const show = trayShown(), list = show ? trayItems() : [];
  fTray.visible = list.length > 0;
  const key = list.map(p => `${p.type}:${p.value}:${p.lock ? 1 : 0}`).join() + '|' + benchCX();
  if (!list.length || key === trayKey) return;
  trayKey = key; clearGroup(fTray); trayPicks = [];
  const per = Math.min(TRAY.per, list.length), cx = benchCX(), rows = Math.ceil(list.length/per);
  const w = per*TRAY.dx + .6, x0 = cx - w/2, z0 = TRAY.z0 - 1.5, z1 = TRAY.z0 + (rows - 1)*TRAY.dz + 1.6;
  const shelf = new THREE.Mesh(new THREE.BoxGeometry(w, .14, z1 - z0), std(0x14304f, {transparent:true, opacity:.9})); shelf.position.set(cx, .07, (z0 + z1)/2); fTray.add(shelf);
  const edge = new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(w, .14, z1 - z0)), new THREE.LineBasicMaterial({color:0xbfe0ff, transparent:true, opacity:.6})); edge.position.copy(shelf.position); fTray.add(edge);
  fTray.userData.signAt = V(cx, .2, z0 - .2);
  list.forEach((p, i) => {
    const r = Math.floor(i/per), c = i % per, rowN = Math.min(per, list.length - r*per), x = cx + (c - (rowN - 1)/2)*TRAY.dx, z = TRAY.z0 + r*TRAY.dz;
    const pad = new THREE.Mesh(new THREE.BoxGeometry(TRAY.dx - .3, .06, TRAY.dz - .35), std(p.lock ? 0x1a2433 : 0x1d4a7a, {transparent:true, opacity:.85})); pad.position.set(x, .17, z); fTray.add(pad);
    const m = trayModel(p); m.scale.setScalar(.5); m.position.set(x, .75, z - .35);
    if (p.lock) m.traverse(o => { if (o.material){ o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = .3; } });
    fTray.add(m);
    const l = label([p.name, p.lock ? '🔒 잠김' : (p.price ? `${p.price}G` : '무료')], {size:17, h:.019, sub:p.lock ? '#ff9aa5' : '#ffd166', color:p.lock ? '#8e98b0' : '#e8ecf4'}); l.position.set(x, .26, z + .72); fTray.add(l);
    const hit = new THREE.Mesh(new THREE.BoxGeometry(TRAY.dx - .3, 1.6, TRAY.dz - .35), new THREE.MeshBasicMaterial({visible:false})); hit.position.set(x, .8, z); hit.userData.tray = p; fTray.add(hit); trayPicks.push(hit);
  });
}
const _fSync = window.fSync;
window.fSync = function(){ _fSync(); buildTray(); };
window.fCenter = function(){
  if (fView() === 'range') return V((RX0 - 3.5 + mToW(100))/2, 0, .3);
  const z = fTray.visible ? (-BAR_R - 1.6 + TRAY.z0 + (trayRows() - 1)*TRAY.dz + 1.9)/2 + .4 : .3;
  return V(benchCX(), 0, z);
};
window.fSpan = function(){ return fView() === 'range' ? mToW(100) - RX0 + 5 : Math.max(F.source === 'laser' ? BX1 - X_REAR + 3 : BX1 - X_LAMP + 4, fTray.visible ? Math.min(TRAY.per, trayItems().length)*TRAY.dx + 1.5 : 0); };
const fDepth = () => fView() === 'bench' && fTray.visible ? TRAY.z0 + (trayRows() - 1)*TRAY.dz + 1.9 + BAR_R + 1.6 + 2.2 : 9;
function trayInfoHtml(p){
  return `<div class="ed-head"><h3>${p.name}</h3><span>${p.price ? `${p.price}G` : '무료'}</span></div><p class="muted">${p.sub}</p>${p.lock ? `<p class="warn" style="margin:0;font-size:12px">🔒 ${p.lock}</p>` : `<p class="muted">끌어서 ${p.type === 'source' || p.type === 'laserkit' ? '왼쪽 광원 자리' : ['medium', 'pump', 'mirror'].includes(p.type) ? '레이저 공진기 칸' : '경통 안'}에 놓아요.</p>`}`;
}
function trayInfo(p, pos){ UI.trayInfo = {p, pos:pos.clone().add(V(0, 1.4, 0))}; F.sel = null; UI.menu = null; renderAll(); }
window.fDown = function(ev){
  setRay(ev);
  if (fTray.visible){
    const h = ray.intersectObjects(trayPicks, false)[0];
    if (h){
      const p = h.object.userData.tray;
      if (p.lock){ trayInfo(p, h.object.position); hint(`잠겨 있어요 · ${p.lock}`); return; }
      const value = p.value, ghost = p.type === 'source' ? (() => { const g = new THREE.Group(); g.add(lampModel(value, .9)); return g; })() : trayModel(p);
      ghost.traverse(o => { if (o.material){ o.material = o.material.clone(); o.material.transparent = true; o.material.opacity = Math.min(o.material.opacity ?? 1, .6); } });
      ghost.visible = false; fScene.add(ghost);
      fDrag = {mode:'new', it:{type:p.type, value, name:p.name}, ghost, sx:ev.clientX, sy:ev.clientY, card:false, pid:ev.pointerId, tray:p, trayPos:h.object.position.clone()};
      return;
    }
  }
  let root = null;
  for (const h of ray.intersectObjects(fDynPicks, true)){ let o = h.object; while (o && !o.userData.pick) o = o.parent; if (o){ root = o; break; } }
  if (!root){ fDrag = {mode:'empty', sx:ev.clientX, sy:ev.clientY}; return; }
  const pick = root.userData.pick, sx = ev.clientX, sy = ev.clientY;
  UI.trayInfo = null; UI.menu = null;
  if (F.learn && pick.kind !== 'dummy'){ hint('문제 풀기에서는 위쪽 쪽지에 값을 넣어요'); return; }
  if (F.learn && pick.kind === 'dummy'){ hint('문제의 표적 위치는 고정이에요'); return; }
  if (pick.kind === 'free' || pick.kind === 'dummy') fDrag = {mode:'move', pick, sx, sy, moved:false};
  else fDrag = {mode:'tap', pick, sx, sy};
};
const _fUp = window.fUp;
window.fUp = function(ev){
  if (!fDrag) return;
  if (fDrag.mode === 'empty'){
    const tap = Math.hypot(ev.clientX - fDrag.sx, ev.clientY - fDrag.sy) < 8; fDrag = null;
    if (tap && (F.sel || UI.trayInfo || UI.menu) && G.dept === 'design'){ F.sel = null; UI.trayInfo = null; UI.menu = null; fSync(); renderAll(); }
    return;
  }
  if (fDrag.mode === 'new' && fDrag.tray && Math.hypot(ev.clientX - fDrag.sx, ev.clientY - fDrag.sy) < 8){
    fScene.remove(fDrag.ghost); dispose(fDrag.ghost); const p = fDrag.tray, pos = fDrag.trayPos; fDrag = null; trayInfo(p, pos); return;
  }
  if (fDrag.mode === 'new') UI.trayInfo = null;
  _fUp(ev);
};
window.camGoal = function(){
  let k = .09; const h = H(), fy = heroY();
  if (G.mode === 'forge'){
    const W = stage.clientWidth, Hh = Math.max(1, stage.clientHeight), o = occ(), Ha = Math.max(140, Hh - o.top - o.bottom), tan = Math.tan(rad(camera.fov/2));
    const tc = CARDS.get('test'), res = fView() === 'range' && tc && W > 640 ? tc.el.offsetWidth + 28 : 0, Wa = Math.max(200, W - res);   // 실험부: 오른쪽 결과 카드 자리를 비우고 레일을 그 왼쪽에 맞춘다
    const d = Math.max(fDepth()*Hh/(Ha*2*tan), fSpan()/(2*tan*Wa/Hh))*1.04, c = fCenter(); UI.viewDY = (o.top - o.bottom)/2; UI.viewDX = res/2;
    goalPos.copy(c).add(V(0, Math.sin(rad(62)), Math.cos(rad(62))).multiplyScalar(d)); goalLook.copy(c); k = .15;
  } else if (G.mode === 'dress'){ const dx = stage.clientWidth > 640 ? -1.45 : 0; goalPos.set(dx, 3.5, -7.4); goalLook.set(dx, 2.3, 0); k = .12;
  } else if (G.mode === 'keep'){ goalPos.set(0, 5.6, 12.5); goalLook.set(0, 2.6, -3); k = .1;
  } else if (G.mode === 'train'){ goalPos.set(0, camera.aspect < 1.1 ? 36 : 25, 17); goalLook.set(0, 0, -.5); k = .12;
  } else if (G.mode === 'solar'){ goalPos.set(-3.5, camera.aspect < 1.1 ? 28 : 16.5, 17.5); goalLook.set(-3.5, 1, -.8); k = .12;
  } else if (G.mode === 'sortie' && G.sortie){ goalPos.set(G.sortie.x, 19, Math.min(G.sortie.z + 10, -1.6)); goalLook.set(G.sortie.x, 0, G.sortie.z - 5); k = .14; }
  else if (G.mode === 'build'){ goalPos.set(0, 10, 27); goalLook.set(0, 4.5, 0); k = .06; }
  else if (G.mode === 'wave' && G.ride){
    const so = SOCKETS[G.ride.sock], y = G.ride.yaw, o = towerOrigin(so), ad = G.ride.aimD*M2W;
    goalPos.set(o.x + Math.sin(y)*3.4, o.y + 3.1, o.z + Math.cos(y)*3.4); goalLook.set(o.x - Math.sin(y)*ad, 0, o.z - Math.cos(y)*ad); k = .2;
  } else if (G.mode === 'wave' && G.view === 'first'){
    const cx = clamp(h.x, -16.4, 16.4);
    if (h.floor === 4) goalPos.set(cx, fy + 2.0, -1.6); else goalPos.set(cx, fy + 1.3, -2.0);
    goalLook.set(cx, 0, dToZ(G.lookD || 24)); k = .16;
  } else if (G.mode === 'wave'){ goalPos.set(h.x*.85, fy + 9, 12); goalLook.set(h.x*.6, 0, dToZ(G.lookD || 24)); }
  else if ((G.mode === 'place' && G.placeView === 'top') || G.mode === 'cleared' || G.mode === 'over'){ const far = camera.aspect < 1.1 ? 86 : 64; goalPos.set(0, far, 26); goalLook.set(0, 0, -22); }
  else { goalPos.set(h.x*.85, Math.max(11, fy + 7), 14); goalLook.set(h.x*.6, fy - 4, -18); }
  return k;
};

/* ═════════ 훈련소 ═════════ */
const soldierPos = () => { const m = tPicks.find(q => q.userData.sid === G.tSel); return m ? m.position.clone().add(V(0, 2.6, 0)) : null; };
function trainStatsHtml(){ return `<div class="sec"><h2>지금 쫄병</h2><div class="rows"><div class="row"><span>쫄병 조준</span><b>${Math.round(soldierAcc()*100)}%</b></div><div class="row"><span>쫄병 체력</span><b>${soldierHpMax()}</b></div><div class="row"><span>쫄병 사격 배율</span><b>×${soldierScale().toFixed(1)}</b></div></div></div>`; }
window.trainPanel = function(){
  if (!painted) return renderAll();
  const squad = G.soldiers.filter(q => q.role === 'sortie');
  paintDock(dgrp('', cGold()) +
    dgrp('', dk(`data-act="recruit" ${G.soldiers.length < soldierMax() && G.gold >= recruitCost() ? '' : 'disabled'}`, '쫄병 모집', G.soldiers.length >= soldierMax() ? '병영 꽉 참' : `${recruitCost()}G`, 'go')) +
    dgrp('대형', dseg(Object.entries(FORMS).map(([k, f]) => [`data-form="${k}"`, f.name, false, !squad.length]))) +
    dgrp('자동 출병', dseg([['off', '끔'], ['start', '밤 시작'], ['half', '절반 남으면']].map(([k, t]) => [`data-auto="${k}"`, t, G.autoSortie === k]))) +
    dgrp('', dk(`data-act="upgTrain" aria-pressed="${UI.page === 'upg-train'}"`, '훈련 업그레이드')));
  const s = G.soldiers.find(q => q.id === G.tSel);
  if (s){
    const roleTxt = q => q.down ? '기절 (다음 밤 회복)' : q.role === 'sortie' ? '토벌대' : q.role === 'tower' ? `${sockName(SOCKETS[q.sock])} 조종` : '병영 대기';
    const gun = gunOf(s), sc = soldierScale(), acc = soldierAcc();
    paintPop('soldier', soldierPos, `<div class="ed-head"><h3>${s.name}</h3><span>${roleTxt(s)}</span></div>
      <div class="bp-f">${gun.name} · ${formula(gun)}</div>
      <div class="vs">${Object.entries(FOES).map(([id, f]) => { const r = hitD(gun, f, 10, id === 'kn' ? 90 : null, null, sc); return `<div><small>${f.short}</small><b class="${r.v ? '' : 'zero'}">${r.v ? Math.round(r.v*(.5 + .5*acc)) : r.why === 'E < W' ? 'E&lt;W' : '0'}</b></div>`; }).join('')}</div>
      <p class="muted">10 m 초당 데미지 · 명중 ×${(.5 + .5*acc).toFixed(2)}</p>
      <h2>무기 쥐여 주기</h2>
      <div class="chips"><button class="chip ${!s.weapon ? 'on' : ''}" type="button" data-sweap="base">${SOLDIER_GUN.name} (기본)</button>${weaponGroups().map(g => `<button class="chip" type="button" data-sweap="${g.items[0].uid}">${g.d.name} ×${g.items.length}</button>`).join('')}</div>
      ${s.role === 'tower' ? '<p class="muted">탑을 맡고 있어요. 성벽에서 빼면 다시 출병할 수 있어요.</p>' : `<button class="btn" type="button" data-srole="${s.id}">${s.role === 'sortie' ? '병영 대기로' : '토벌대에 넣기'}</button>`}`);
  }
};

/* ═════════ 발전단지 = 광전 연구소 ═════════ */
const solarSeg = () => `<div class="dg"><span class="dl">발전단지</span>${dseg([['power', '발전'], ['lab', '실험대'], ['study', '연구']].map(([k, n]) => [`data-ltab="${k}"`, n, LS().tab === k]))}</div>`;
const lampPos = () => LAB0.clone().add(V(-3.1, 4.3, 0));
const labPos = () => LAB0.clone().add(V(3.9, 3.2, 0));
const panelPos = () => { if (!sPicks.length) return V(-12, 2, -6); const c = V(); for (const g of sPicks) c.add(g.position); return c.multiplyScalar(1/sPicks.length).add(V(0, 2, 0)); };
window.solarPanel = function(){
  if (!painted) return renderAll();
  const l = LS(), tab = l.tab;
  if (tab === 'study'){ UI.page = 'study'; UI.pageMode = 'solar'; paintDock(solarSeg()); return; }
  if (UI.page === 'study') UI.page = null;
  if (tab === 'power'){
    const pn = labOk('pn'), bu = bestU();
    paintDock(solarSeg() + dgrp('', cBat()) + dgrp('', dk(`data-act="upgSolar" aria-pressed="${UI.page === 'upg-solar'}"`, '발전단지 업그레이드')));
    paintPop('power', {fixed:'right'}, `<div class="ed-head"><h3>${pn ? 'p-n 반도체' : METALS[G.panelMetal].name + ' 금속판'} 패널</h3><span>${pn ? '' : `W ${METALS[G.panelMetal].W} eV`}</span></div>
      <div class="eq">${pn ? 'p-n 태양전지: 빛을 흡수하면 전자–양공 쌍이 생기고, 접합부 전기장이 전자는 n형, 양공은 p형으로 보내 전압과 전류를 만들어요.' : `금속판 패널 = 광전관: 햇빛 광자가 금속판에서 전자를 떼어 내고, 전자가 검출판에 모여 배터리로 흘러요. 배터리 전압 U가 역전압 역할을 해서, 판에 수직인 운동 에너지가 eU보다 큰 전자만 넘어가요. 그래서 U를 올리면 전압은 커지지만 넘어가는 전자는 줄어요.`}</div>
      ${!pn && labOk('cond') ? `<div class="range"><label for="chgU">충전 전압 U <b>${G.chargeU.toFixed(2)} V</b></label><input id="chgU" type="range" min="0" max="${puRange()}" step="0.01" value="${Math.min(G.chargeU, puRange())}"></div>
        <canvas id="puPlot" class="spec" aria-label="충전 전압과 전력"></canvas><p class="muted">전력 = U × I가 최대인 곳을 찾아요. ${G.lab.A ? `(최대 약 ${bu.U.toFixed(2)} V)` : ''}</p>` : !pn ? '<p class="muted">충전 전압은 0.5 V로 고정이에요. 연구의 "회로 조건표"를 끝내면 직접 조절해요.</p>' : ''}
      ${pn ? '' : `<h2>도금 · 적이 떨어뜨린 조각</h2><div class="rows">${['na', 'cs', 'ag'].map(k => { const M = METALS[k], have = G.metals[k] || 0, on = G.panelMetal === k, meas = k === 'na' || G.lab['B_' + k];
        return `<div class="row"><span><b style="color:var(--ink);font-family:var(--f-body)">${M.name}</b> W ${M.W} eV · 조각 ${have}개<br>${on ? '사용 중' : !meas ? '연구 탐구 B로 일함수를 먼저 재요' : `조각 ${M.need}개 · 하루 ${(panelsN()*panelPower(k)).toFixed(0)} ⚡`}</span>${on ? '<b>사용 중</b>' : `<button class="btn" type="button" data-plate="${k}" ${meas && have >= M.need ? '' : 'disabled'}>도금</button>`}</div>`; }).join('')}</div>`}`, true);
    drawPU($('puPlot'));
  } else {
    const nm = l.src;
    paintDock(solarSeg() + dgrp('금속판', dseg(labMetals().map(k => [`data-lmetal="${k}"`, `<i style="background:${METALS[k].color}"></i>${METALS[k].name}`, l.metal === k]))) +
      dgrp('', dseg([['data-lact="circuit"', l.closed ? '회로 연결' : '회로 열림', l.closed]])));
    paintPop('lamp', lampPos, `<div class="ed-head"><h3>램프</h3><span>${nm === 'sun' ? '햇빛' : `${nm} nm`}</span></div>
      <div class="seg"><button type="button" data-lsrc="sun" aria-pressed="${nm === 'sun'}">햇빛</button><button type="button" data-lsrc="${nm === 'sun' ? (UI.lastNm || 400) : nm}" aria-pressed="${nm !== 'sun'}">단색 빛</button></div>
      ${nm === 'sun' ? '' : `<div class="crow"><span>λ</span><span class="rng"><input id="labNm" type="range" min="300" max="600" step="50" value="${nm}"><span class="rng-e"><i>300</i><i>600 nm</i></span></span><b id="labNmV" style="color:${nmColor(nm)}">${nm} nm</b></div>`}
      <div class="crow"><span>세기</span><div class="seg inten">${[25, 50, 75, 100].map(v => `<button type="button" data-linten="${v}" aria-pressed="${l.inten === v}">${v}%</button>`).join('')}</div></div>
      ${nm === 'sun' ? '' : `<div class="seg"><button type="button" data-lbasis="power" aria-pressed="${l.basis === 'power'}">광출력 기준</button><button type="button" data-lbasis="photon" aria-pressed="${l.basis === 'photon'}">광자 수 기준</button></div>`}
      <button class="btn" type="button" data-lact="light">${l.light ? '빛 끄기' : '빛 켜기'}</button>`, true, {side:'left', cls:'narrow'});
    paintPop('lab', labPos, `<div class="ed-head"><h3>전압 = 검출판 − 금속판</h3><span>${l.closed ? '회로 연결' : '회로 열림'}</span></div>
      <div class="range"><label for="labX">전압 <b id="labXv">${l.x.toFixed(2)} V</b></label><input id="labX" type="range" min="-3.5" max="2" step="0.01" value="${l.x}" ${l.closed ? '' : 'disabled'}></div>
      <div class="fine">${[-.1, -.01, .01, .1].map(s => `<button type="button" data-lx="${s}">${s > 0 ? '+' : '−'}${Math.abs(s)}</button>`).join('')}<button type="button" data-lx="zero">0</button><button type="button" data-lact="rec">기록</button></div>
      <div class="eq" id="labLive"></div>
      <canvas id="ivPlot" class="spec tall" aria-label="광전류-전압 그래프"></canvas>
      <p class="muted">전류가 막 0이 되는 전압이 정지 전압이에요. 거기서 "기록"을 눌러요.</p>
      <details class="model"><summary>이 그래프의 식</summary>
        <p>광전관: 오목한 금속판(반지름 R) 가운데에 작은 공 검출판(반지름 r), (r/R)² = k = ${LAB_K}</p>
        <p>전자: 운동 에너지 K가 0 ~ E − W에 고르게, 방향은 cos θ 분포</p>
        <p>에너지 · 각운동량 보존 → 검출판에 닿을 조건 <b>sin²θ ≤ k(1 + eU/K)</b></p>
        <p>역전압(U &lt; 0, w = e|U|/(E − W)): <b>I = k·I<sub>포화</sub>(1 − w + w ln w)</b> → 정지 전압에서 0</p>
        <p>정전압: U ≥ (E − W)(1 − k)/(ek)이면 모든 전자가 모여서 I = I<sub>포화</sub></p>
      </details>
      <h2>기록</h2>${(G.lab.recs || []).length ? `<div class="rows">${G.lab.recs.slice().reverse().slice(0, 8).map(r => `<div class="row"><span>${METALS[r.metal].name} · ${r.src === 'sun' ? '햇빛' : r.src + ' nm'} · ${r.inten}%</span><b>V₀ ${r.V0.toFixed(2)} V · ${r.Isat.toFixed(2)} μA</b></div>`).join('')}</div>` : '<p class="muted">아직 없어요.</p>'}`, true);
    labLive(); drawIV($('ivPlot'));
  }
};

/* ═════════ 캐릭터 꾸미기 ═════════ */
const dressPos = () => V(-1.3, 2.9, 0);
const firstDress = () => { try { return !localStorage.getItem('johamin-castle-dressed-v1'); } catch(e){ return false; } };
const DRESS_CATS = [['face', '얼굴'], ['style', '머리 모양'], ['hair', '머리 색'], ['hood', '후드 색'], ['eye', '눈 색'], ['skin', '피부']];
window.dressPanel = function(){
  if (!painted) return renderAll();
  const L = lookOf(), cat = UI.dressCat || 'style', photo = L.face && faceImg;
  const sw = k => `<div class="sws">${SW[k].map(c => `<button type="button" class="sw ${L[k] === c ? 'on' : ''}" data-look="${k}:${c}" style="background:${c}" aria-label="${c}"></button>`).join('')}</div>`;
  const body = {
    face:() => `<div class="seg"><button type="button" data-face="0" aria-pressed="${!L.face}">기본 얼굴</button><button type="button" data-face="1" aria-pressed="${!!L.face}" ${faceImg ? '' : 'disabled'}>사진 얼굴</button></div>
      <label class="btn primary filebtn" for="faceFile">사진 고르기</label><input id="faceFile" type="file" accept="image/*" hidden>
      ${photo ? `<div class="range"><label for="fz">확대 <b>${L.fz.toFixed(2)}×</b></label><input id="fz" type="range" min=".6" max="2.4" step=".02" value="${L.fz}"></div>
      <div class="range"><label for="fx">좌우 <b>${L.fx.toFixed(2)}</b></label><input id="fx" type="range" min="-1" max="1" step=".02" value="${L.fx}"></div>
      <div class="range"><label for="fy">위아래 <b>${L.fy.toFixed(2)}</b></label><input id="fy" type="range" min="-1" max="1" step=".02" value="${L.fy}"></div>
      <button class="btn danger" type="button" data-act="faceDel">사진 지우기</button>` : ''}
      <p class="muted">사진은 이 기기에만 저장돼요. 정면 사진이 잘 맞아요.</p>`,
    style:() => `<div class="seg">${STYLES.map(([k, t]) => `<button type="button" data-look="style:${k}" aria-pressed="${L.style === k}">${t}</button>`).join('')}</div>`,
    hair:() => sw('hair'), hood:() => sw('hood'), skin:() => sw('skin'),
    eye:() => photo ? '<p class="muted">사진 얼굴을 쓰는 동안은 눈 색이 안 보여요.</p>' : sw('eye'),
  }[cat]();
  paintPop('dress', {fixed:'right'}, `<div class="ed-head"><h3>${DRESS_CATS.find(c => c[0] === cat)[1]}</h3><button class="rm" type="button" data-act="lookReset" style="color:var(--muted)">처음 모습</button></div>${body}`, true, {cls:'narrow'});
  paintDock(dgrp('', dseg(DRESS_CATS.map(([k, t]) => [`data-dcat="${k}"`, t, cat === k]))) + dgrp('', dk('data-act="dressDone"', firstDress() ? '이대로 시작하기 →' : '다 했어요', '', 'go')));
};

/* ═════════ 버튼 ═════════ */
document.addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b) return;
  const a = b.dataset.act, ds = b.dataset;
  if (ds.menu){ UI.menu = UI.menu === ds.menu ? null : ds.menu; UI.trayInfo = null; if (UI.menu) F.sel = null; fSync(); renderAll(); return; }
  if (ds.ptype || ds.fkind || (a && /^(diff|learn)/.test(a))) UI.menu = null;
  if (ds.tview){ UI.testView = UI.testView === ds.tview ? null : ds.tview; fRefreshTest(); return; }
  if (ds.calc){ UI.calc = !UI.calc; fRenderEditor(); return; }
  if (ds.dcat){ UI.dressCat = ds.dcat; renderAll(); return; }
  if (ds.kact){ keepAct(ds.kact); return; }
  if (ds.given){ UI.givenOpen = !UI.givenOpen; renderAll(); return; }
  if (ds.ffoe){ const c = $('fctl'); if (c) delete c.dataset.built; }
  if (ds.pclose){
    const k = ds.pclose;
    if (k === 'sock'){ G.sel = null; G.previewUid = null; buildPreview(); }
    else if (k === 'fsel'){ F.sel = null; fSync(); }
    else if (k === 'soldier'){ G.tSel = null; tSync(); }
    else if (k === 'menu') UI.menu = null;
    else if (k === 'tray') UI.trayInfo = null;
    else if (k === 'settings') G.showSettings = false;
    else if (k === 'keepBoard') UI.keepCard = null;
    closePop(k); renderAll(); return;
  }
  if (ds.fload || ds.fnew || ds.fsave || ds.dept || ds.pcat){ UI.menu = null; UI.trayInfo = null; return; }
  switch (a){
    case 'pageClose': closePage(); break;
    case 'dress': UI.page = null; UI.dressFrom = G.mode; break;
    case 'dressDone': { const first = firstDress(); try { localStorage.setItem('johamin-castle-dressed-v1', '1'); } catch(e){} if (!first && UI.dressFrom === 'keep'){ enterKeep(); } else { G.mode = 'map'; renderAll(); } break; }
    case 'upgTrain': openPage('upg-train'); break;
    case 'upgSolar': openPage('upg-solar'); break;
    case 'noteToggle': UI.noteOpen = !UI.noteOpen; renderAll(); break;
    case 'toMap': if (G.mode === 'dress'){ try { localStorage.setItem('johamin-castle-dressed-v1', '1'); } catch(e){} } UI.page = null; UI.menu = null; UI.trayInfo = null; break;
  }
}, true);
document.addEventListener('keydown', ev => { if (ev.key !== 'Escape') return; if (UI.page) return closePage(); const c = [...CARDS.values()].reverse().find(q => !q.noX); if (c) c.el.querySelector('.popx').click(); });

/* 장면을 위아래 UI 사이 가운데로 (대장간) */
window.applyViewOffset = function(){
  const w = stage.clientWidth, h = stage.clientHeight, dy = G.mode === 'forge' ? Math.round(UI.viewDY || 0) : 0, dx = G.mode === 'forge' ? Math.round(UI.viewDX || 0) : 0, key = `${w}x${h}:${dx}:${dy}`;
  if (key === UI.voKey && camera.view && camera.view.fullWidth === w) return;
  UI.voKey = key; if (dy || dx) camera.setViewOffset(w, h, dx, -dy, w, h); else camera.clearViewOffset();
};

/* ═════════ 지도: 화면을 꽉 채우고, 한 손가락으로 끌고, 두 손가락 · 휠로 확대 ═════════ */
const MV = {s:1, tx:0, ty:0, init:false};
const MAP_W = 1000, MAP_H = 620;
function mapBounds(){ const W = stage.clientWidth, Hh = stage.clientHeight; return {W, Hh, cover:Math.max(W/MAP_W, Hh/MAP_H), contain:Math.min(W/MAP_W, (Hh - dockH())/MAP_H)}; }
function mapClamp(){
  const {W, Hh, cover, contain} = mapBounds(), db = dockH();
  MV.s = clamp(MV.s, cover, cover*2.6);
  const w = MAP_W*MV.s, h = MAP_H*MV.s;
  MV.tx = w <= W ? (W - w)/2 : clamp(MV.tx, W - w, 0);
  MV.ty = h <= Hh ? (Hh - h)/2 : clamp(MV.ty, Hh - db - h, 0);
}
function mapFit(){ const {W, Hh} = mapBounds(); MV.s = Math.max(W/MAP_W, Hh/MAP_H);   // 배경을 꽉 채운다(남는 쪽은 끌어서 봄)
  MV.user = false; MV.tx = (W - MAP_W*MV.s)/2; MV.ty = 0; mapClamp(); MV.init = true; }
function applyMapView(){ const svg = $('map').querySelector('svg'); if (svg) svg.style.transform = `translate(${MV.tx}px, ${MV.ty}px) scale(${MV.s})`; }
const _renderMap = window.renderMap;
window.renderMap = function(){
  _renderMap();
  if (G.mode !== 'map') return;
  const svg = $('map').querySelector('svg'); svg.setAttribute('width', MAP_W); svg.setAttribute('height', MAP_H);
  if (!MV.init) requestAnimationFrame(() => { mapFit(); applyMapView(); });
  else { mapClamp(); applyMapView(); }
};
new ResizeObserver(() => { if (typeof G !== 'undefined' && G && G.mode === 'map' && MV.init){ if (!MV.user) mapFit(); else mapClamp(); applyMapView(); } }).observe(stage);
(function mapGestures(){
  const m = $('map'), pts = new Map(); let start = null, dragged = false;
  const snap = () => { const a = [...pts.values()]; const mid = a.length > 1 ? {x:(a[0].x + a[1].x)/2, y:(a[0].y + a[1].y)/2} : a[0]; const d = a.length > 1 ? Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y) : 0; return {mid, d, s:MV.s, tx:MV.tx, ty:MV.ty}; };
  const local = ev => { const r = stage.getBoundingClientRect(); return {x:ev.clientX - r.left, y:ev.clientY - r.top}; };
  m.addEventListener('pointerdown', ev => { pts.set(ev.pointerId, local(ev)); start = snap(); if (pts.size === 1) dragged = false; });
  window.addEventListener('pointermove', ev => {
    if (!pts.has(ev.pointerId) || G.mode !== 'map') return;
    pts.set(ev.pointerId, local(ev)); const now = snap();
    if (!dragged && Math.hypot(now.mid.x - start.mid.x, now.mid.y - start.mid.y) < 7 && pts.size < 2) return;
    dragged = true; MV.user = true;
    const k = pts.size > 1 && start.d > 0 ? now.d/start.d : 1, s = start.s*k;
    MV.s = s; MV.tx = now.mid.x - (start.mid.x - start.tx)*(s/start.s); MV.ty = now.mid.y - (start.mid.y - start.ty)*(s/start.s);
    mapClamp(); applyMapView();
  });
  const up = ev => { if (!pts.has(ev.pointerId)) return; pts.delete(ev.pointerId); start = pts.size ? snap() : null; };
  window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  m.addEventListener('click', ev => { if (dragged){ ev.stopPropagation(); ev.preventDefault(); dragged = false; } }, true);
  m.addEventListener('wheel', ev => { ev.preventDefault(); const p = local(ev), s0 = MV.s, s = s0*Math.exp(-ev.deltaY*.0015); MV.user = true; MV.s = s; MV.tx = p.x - (p.x - MV.tx)*(MV.s/s0); MV.ty = p.y - (p.y - MV.ty)*(MV.s/s0); mapClamp(); applyMapView(); }, {passive:false});
  m.addEventListener('dblclick', () => { mapFit(); applyMapView(); });
})();

/* 실험대 파장 슬라이더 → 기존 data-lsrc 버튼 처리로 넘긴다 */
document.addEventListener('input', ev => {
  const t = ev.target; if (!t || t.id !== 'labNm') return;
  const v = +t.value, lab = $('labNmV'); if (lab){ lab.textContent = `${v} nm`; lab.style.color = nmColor(v); }
  UI.lastNm = v; const b = document.createElement('button'); b.type = 'button'; b.dataset.lsrc = String(v); b.hidden = true; t.parentNode.appendChild(b); b.click(); b.remove();
});

/* ═════════ 성주관: 성 안 3D 홀 (왕좌 · 명예의 전당 게시판 · 거울) ═════════ */
const kScene = new THREE.Scene(), kPicks = [], kHero = new THREE.Group();
let kBuilt = false, kBoardTex = null, kBoardCtx = null;
function kBuild(){
  if (kBuilt) return; kBuilt = true;
  kScene.background = new THREE.Color(0x140d09); kScene.fog = new THREE.Fog(0x140d09, 22, 40);
  kScene.add(new THREE.HemisphereLight(0xffe4c0, 0x2a1a10, .62));
  const key = new THREE.DirectionalLight(0xfff0dc, .55); key.position.set(4, 10, 8); kScene.add(key);
  const stone = canvasTex(256, 256, (x, w, h) => { x.fillStyle = '#3d342d'; x.fillRect(0, 0, w, h); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++){ const v = 40 + ((i*5 + j*3) % 4)*5; x.fillStyle = `rgb(${v + 22},${v + 15},${v + 8})`; x.fillRect(i*64 + 2, j*64 + 2, 60, 60); } }, 8, 8);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 22), std(0xffffff, {map:stone, roughness:.85})); floor.rotation.x = -Math.PI/2; floor.position.z = -1; kScene.add(floor);
  const wallTex = brickTex(6, 3), wallM = std(0xb8a58e, {map:wallTex, roughness:.9});
  const back = new THREE.Mesh(new THREE.BoxGeometry(20, 10, .6), wallM); back.position.set(0, 5, -9); kScene.add(back);
  for (const sx of [-1, 1]){ const w = new THREE.Mesh(new THREE.BoxGeometry(.6, 10, 18), wallM); w.position.set(sx*9.7, 5, -.5); kScene.add(w); }
  const carpet = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 13), std(0x8e1b26, {roughness:.95})); carpet.rotation.x = -Math.PI/2; carpet.position.set(0, .02, 0); kScene.add(carpet);
  for (const sx of [-1.45, 1.45]){ const t = new THREE.Mesh(new THREE.PlaneGeometry(.12, 13), std(0xd9a43a, {metalness:.5})); t.rotation.x = -Math.PI/2; t.position.set(sx, .025, 0); kScene.add(t); }
  const gold = std(0xd9a43a, {metalness:.7, roughness:.35}), velvet = std(0x9b1c2a, {roughness:.8}), wood = std(0x5a3219, {roughness:.7});
  [[7, .45, 3.4, -7], [5, .45, 2.6, -7.2]].forEach(([w, h, d, z], i) => { const st = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), std(0x5b4c40, {roughness:.8})); st.position.set(0, h/2 + i*.45, z); kScene.add(st); });
  const th = new THREE.Group(); th.position.set(0, .9, -7.4);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(1.9, .5, 1.5), velvet); seat.position.y = .7; th.add(seat);
  const base = new THREE.Mesh(new THREE.BoxGeometry(2.1, .5, 1.7), wood); base.position.y = .25; th.add(base);
  const backr = new THREE.Mesh(new THREE.BoxGeometry(1.9, 3.0, .35), velvet); backr.position.set(0, 2.2, -.6); th.add(backr);
  const frame = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.3, .3), gold); frame.position.set(0, 2.25, -.72); th.add(frame);
  for (const sx of [-1, 1]){ const arm = new THREE.Mesh(new THREE.BoxGeometry(.32, .7, 1.5), wood); arm.position.set(sx*1.1, 1.0, 0); th.add(arm); const knob = new THREE.Mesh(new THREE.SphereGeometry(.2, 16, 12), gold); knob.position.set(sx*1.1, 1.4, .65); th.add(knob); }
  const crown = new THREE.Mesh(new THREE.ConeGeometry(.45, .7, 5), gold); crown.position.set(0, 4.15, -.72); th.add(crown);
  th.traverse(o => { if (o.isMesh) o.userData.kpick = 'throne'; }); kScene.add(th); kPicks.push(th);
  const banner = canvasTex(128, 256, (x, w, h) => { x.fillStyle = '#9b1c2a'; x.fillRect(0, 0, w, h); x.fillStyle = '#d9a43a'; x.fillRect(0, 0, w, 10); x.fillRect(10, 0, 6, h); x.fillRect(w - 16, 0, 6, h);
    x.strokeStyle = '#ffd98a'; x.lineWidth = 6; x.beginPath(); x.ellipse(w/2, h*.42, 26, 40, 0, 0, Math.PI*2); x.stroke(); x.beginPath(); x.moveTo(w/2 - 44, h*.42); x.lineTo(w/2 + 44, h*.42); x.stroke(); });
  for (const sx of [-4, 4]){ const b = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 3.6), std(0xffffff, {map:banner, side:THREE.DoubleSide})); b.position.set(sx, 5.4, -8.65); kScene.add(b); }
  for (const z of [-4.5, 0, 4.5]) for (const sx of [-1, 1]){
    const col = new THREE.Mesh(new THREE.CylinderGeometry(.42, .5, 9, 16), std(0x8c7a68, {roughness:.8})); col.position.set(sx*6.3, 4.5, z); kScene.add(col);
    if (z === 0){ const fl = new THREE.Mesh(new THREE.ConeGeometry(.16, .45, 10), new THREE.MeshBasicMaterial({color:0xffb347})); fl.position.set(sx*5.75, 4.1, z); kScene.add(fl);
      const tl = new THREE.PointLight(0xffa04a, 1.1, 14, 1.6); tl.position.set(sx*5.6, 4.3, z); kScene.add(tl); }
  }
  // 명예의 전당 게시판 (왼쪽 벽)
  const bc = document.createElement('canvas'); bc.width = 512; bc.height = 360; kBoardCtx = bc.getContext('2d'); kBoardTex = new THREE.CanvasTexture(bc);
  const board = new THREE.Group(); board.position.set(-9.3, 3.4, -2.4); board.rotation.y = Math.PI/2;
  const bf = new THREE.Mesh(new THREE.BoxGeometry(4.4, 3.2, .2), wood); board.add(bf);
  const bp = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 2.8), new THREE.MeshBasicMaterial({map:kBoardTex})); bp.position.z = .11; board.add(bp);
  const star = new THREE.Mesh(new THREE.OctahedronGeometry(.35), gold); star.position.set(0, 1.85, .1); board.add(star);
  board.traverse(o => { if (o.isMesh) o.userData.kpick = 'board'; }); kScene.add(board); kPicks.push(board);
  // 거울 (오른쪽 벽) = 꾸미기
  const mirror = new THREE.Group(); mirror.position.set(9.3, 3.2, -2.4); mirror.rotation.y = -Math.PI/2;
  const mf = new THREE.Mesh(new THREE.BoxGeometry(2.2, 3.6, .2), gold); mirror.add(mf);
  const mg = canvasTex(128, 256, (x, w, h) => { const g = x.createLinearGradient(0, 0, w, h); g.addColorStop(0, '#dfe8f2'); g.addColorStop(.5, '#8fa3b8'); g.addColorStop(1, '#e8eef5'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
  const mp = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 3.2), std(0xffffff, {map:mg, metalness:.6, roughness:.15})); mp.position.z = .11; mirror.add(mp);
  mirror.traverse(o => { if (o.isMesh) o.userData.kpick = 'mirror'; }); kScene.add(mirror); kPicks.push(mirror);
  for (const [t, x] of [['명예의 전당', -8.6], ['거울 · 꾸미기', 8.6]]){ const l = label(t, {size:26, bold:true, h:.026, color:'#ffe2b0'}); l.position.set(x, .06, -2.4); kScene.add(l); }
  kHero.scale.setScalar(1.5); kHero.position.set(0, 0, -3.2); kScene.add(kHero);
  kHero.userData.kpick = 'hero';
}
function kDrawBoard(){
  const x = kBoardCtx, w = 512, h = 360; if (!x) return;
  x.fillStyle = '#2b1d12'; x.fillRect(0, 0, w, h); x.fillStyle = '#f3e2bd'; x.fillRect(10, 10, w - 20, h - 20);
  x.fillStyle = '#5a3e28'; x.textAlign = 'center'; x.font = '700 40px "IBM Plex Sans KR", sans-serif'; x.fillText('명예의 전당', w/2, 66);
  x.font = '500 28px "IBM Plex Sans KR", sans-serif'; x.textAlign = 'left';
  [['최고 방어 밤', `${G.best.wave}`], ['최고 초당 데미지', G.best.dps.toFixed(1)], ['토벌 최고 수확', `${G.best.sortie}G`]].forEach(([a, b], i) => { const y = 136 + i*64; x.fillStyle = '#5a3e28'; x.fillText(a, 44, y); x.textAlign = 'right'; x.font = '600 32px "JetBrains Mono", monospace'; x.fillText(b, w - 44, y); x.textAlign = 'left'; x.font = '500 28px "IBM Plex Sans KR", sans-serif'; x.fillStyle = 'rgba(90,62,40,.3)'; x.fillRect(44, y + 16, w - 88, 2); });
  kBoardTex.needsUpdate = true;
}
function enterKeep(){ kBuild(); clearGroup(kHero); buildHeroInto(kHero, lookOf()); kHero.traverse(o => { if (o.isMesh) o.userData.kpick = 'hero'; }); kDrawBoard(); G.mode = 'keep'; G.showSettings = false; UI.keepCard = null; renderAll(); hint('성주관이에요 · 게시판 · 거울 · 왕좌를 눌러 보세요'); }
function keepAct(a){
  if (a === 'board'){ UI.keepCard = UI.keepCard === 'board' ? null : 'board'; renderAll(); }
  else if (a === 'mirror' || a === 'hero'){ UI.dressFrom = 'keep'; G.mode = 'dress'; dressSync(); renderAll(); hint('캐릭터 꾸미기 · 화면을 끌면 돌아가요'); }
  else if (a === 'throne') hint('성주의 자리예요 · 성을 지킨 기록은 왼쪽 게시판에 남아요');
}
window.keepPanel = function(){
  paintDock(dgrp('', dk(`data-kact="board" aria-pressed="${UI.keepCard === 'board'}"`, '명예의 전당') + dk('data-kact="mirror"', '캐릭터 꾸미기')));
  if (UI.keepCard === 'board') paintPop('keepBoard', {fixed:'right'}, recordsHtml(), false, {cls:'narrow'});
};
function kTap(ev){
  setRay(ev); const h = ray.intersectObjects(kPicks.concat([kHero]), true)[0]; if (!h) return;
  let o = h.object; while (o && !o.userData.kpick) o = o.parent; if (o) keepAct(o.userData.kpick);
}

/* ═════════════════════════════════════════════════════════════════
   v5 · 아래 독을 없앤다. 버튼은 그 일을 하는 "물건"에 붙는다.
   · 지도: 양피지에 그린 달 도장(밤 맞이하기)
   · 성벽: 성문 위 종(밤 시작), 성벽 면의 공사 간판(증축) · 보강 간판
   · 밤: 가까운 탑 위 "탑승" 팻말, 계단 팻말, 성문 팻말(토벌), 주인공 발밑 상황판
   · 대장간: 도면 주석처럼 생긴 파란 태그(작업대 · 부품함 선반 · 양 끝 부서 이동), 화면을 옆으로 밀면 부서 이동
   · 훈련소: 병영 팻말(모집), 깃발 지휘판(대형 · 자동 출병), 근무지 게시판(업그레이드)
   · 발전단지: 패널 · 실험대 · 배터리실 · 연구 노트에 붙은 실험실 라벨
   · 성주관 · 꾸미기: 버튼은 카드 안 / 물건 자체
   ═════════════════════════════════════════════════════════════════ */
window.paintDock = function(){ const d = $('dock'); d.hidden = true; if (d.innerHTML) d.innerHTML = ''; d.dataset.h = ''; if (painted) painted.dock = false; stage.style.setProperty('--dockh', '0px'); };
const sign = (key, at, html, style = 'wood', place = 'above') => paintPop(key, at, html, true, {cls:`sign ${style}`, place});
const sgB = (attrs, ic, title, sub, cls = '') => `<button class="sg-b ${cls}" type="button" ${attrs}>${ic ? `<span class="ic">${ic}</span>` : ''}<span class="tx"><b>${title}</b>${sub ? `<small>${sub}</small>` : ''}</span></button>`;
const sgRow = (items) => `<div class="sg-row">${items.map(([attrs, t, on, dis]) => `<button type="button" ${attrs} aria-pressed="${!!on}" ${dis ? 'disabled' : ''}>${t}</button>`).join('')}</div>`;

/* ── 지도: 달 도장 ── */
window.mapPanel = function(){ if (!painted) return renderAll(); };
const _mapSVG3 = window.mapSVG;
window.mapSVG = function(){
  const ink = '#5a3e28', s = _mapSVG3();
  const seal = `<g class="mp seal" data-go="night" tabindex="0" role="button" aria-label="밤 맞이하기 · 웨이브 ${G.wave}">
      <rect x="640" y="150" width="330" height="96" fill="transparent" stroke="none"/>
      <g filter="url(#wob)" transform="translate(64 136)"><circle cx="846" cy="62" r="38" fill="#26305a" stroke="${ink}" stroke-width="3"/>
        <circle cx="846" cy="62" r="31" fill="none" stroke="#f3e2bd" stroke-width="1.2" stroke-dasharray="3 4" opacity=".7"/>
        <path d="M858 44 a22 22 0 1 0 6 34 a17 17 0 1 1 -6 -34 z" fill="#f6dc8c"/>
        <path d="M826 50 l2 5 l5 0 l-4 3 l2 5 l-5 -3 l-5 3 l2 -5 l-4 -3 l5 0 z" fill="#f6dc8c" transform="scale(.8) translate(208 14)"/></g>
      <text x="860" y="192" font-family="Gaegu, 'IBM Plex Sans KR', sans-serif" font-size="27" font-weight="700" fill="${ink}" text-anchor="end">밤 맞이하기</text>
      <text x="860" y="216" font-family="Gaegu, 'IBM Plex Sans KR', sans-serif" font-size="16" fill="${ink}" text-anchor="end">웨이브 ${G.wave} · ${waveSummary(G.wave)}</text>
      
    </g>`;
  return s.replace('</svg>', `${seal}</svg>`);
};
$('map').addEventListener('click', ev => { const g = ev.target.closest('.mp'); if (g && g.dataset.go === 'night'){ G.mode = 'place'; startWave(); } });

/* ── 성벽 (낮): 종 · 공사 간판 · 보강 간판 ── */
window.placePanel = function(){
  if (!painted) return renderAll();
  const next = [3, 2, 1].find(f => !built(f));
  sign('bell', () => V(0, WALL_TOP + 2.0, .2), sgB('data-act="night"', '🔔', '종 치기 · 밤 시작', `웨이브 ${G.wave} · ${waveSummary(G.wave)}`, 'go'));
  if (next){ const c = FLOOR_COST[next], ok = G.gold >= c;
    sign('build', () => V(-5.2, 4.6, 1.7), sgB(`data-build="${next}" ${ok ? '' : 'disabled'}`, '🏗', `${FLOORS[next].name} 증축 · ${c}G`, ok ? '탑 자리 4개 더' : `골드 부족 · 보유 ${G.gold}G`)); }
  const w = Object.entries(UPG).find(([, u]) => u.b === 'wall');
  if (w){ const [id, u] = w, lv = up(id), max = lv >= u.max, c = max ? 0 : u.cost(lv), ok = !max && G.gold >= c;
    sign('wallup', () => V(5.2, 4.6, 1.7), sgB(`${max ? 'disabled' : `data-up="${id}"`} ${ok || max ? '' : 'disabled'}`, '🧱', `${u.name} Lv.${lv}${max ? ' · 최대' : ` · ${c}G`}`, `성벽 ${Math.max(0, G.wallHp)}/${wallMax()}${!max && !ok ? ` · 보유 ${G.gold}G` : ''}`)); }
  if (G.sel != null) paintPop('sock', sockPos, sockHtml());
};

/* ── 밤: 탑승 · 계단 · 성문 팻말, 발밑 상황판 ── */
const heroFeet = () => V(H().x, heroY(), FLOORS[H().floor].z);
function waveSigns(){
  const keep = new Set(), put = (k, ...a) => { keep.add(k); sign(k, ...a); };
  if (G.mode === 'wave' && !G.ride){
    for (const q of nearSockets().filter(q => q.tower)) put(`ride${q.i}`, () => q.ring.getWorldPosition(new THREE.Vector3()).add(V(0, 2.4, 0)), sgB(`data-act="ride" data-ride="${q.i}"`, '🎯', '탑승', q.tower.design.name, 'go'));
    if (inStairs() && !H().climb){ const u = nextFloor(H().floor, 1), dn = nextFloor(H().floor, -1);
      if (u || dn) put('stairs', () => heroFeet().add(V(0, 3.4, 0)), `<span class="sg-t">계단</span>${sgRow([...(u ? [['data-act="floorUp"', `▲ ${FLOORS[u].name}`]] : []), ...(dn ? [['data-act="floorDown"', `▼ ${FLOORS[dn].name}`]] : [])])}`); }
    const squad = G.soldiers.filter(s => s.role === 'sortie' && !s.down).length;
    put('gate', () => V(0, 2.4, 1.8), G.sortie && G.sortie.auto ? sgB('data-act="retreat"', '🏳', '토벌대 퇴각', '바로 성으로', 'go') : G.sortieUsed ? sgB('disabled', '🚪', '성문 닫힘', '토벌은 밤마다 한 번') : sgB('data-act="sortie"', '⚔', '성문 열고 토벌', `쫄병 ${squad}명 동행`));
    put('wstat', heroFeet, `<div class="pill"><b class="pl-t">밤 ${G.wave}</b><span id="wLeft"></span><span class="chip-s en" title="배터리">🔋<b class="cBat">${Math.floor(G.energy)}/${batteryCap()}</b></span><span class="chip-s hp" title="성벽">🧱<b class="cWall">${Math.max(0, G.wallHp)}/${wallMax()}</b></span></div>`, 'pill', 'below');
  }
  for (const k of [...CARDS.keys()]) if (/^(ride\d+|stairs|gate|wstat)$/.test(k) && !keep.has(k)) closePop(k);
}
window.wavePanel = function(){ waveSigns(); renderLive(); };
const _renderTabs5 = window.renderTabs;
window.renderTabs = function(){ _renderTabs5(); if (G.mode === 'wave' && !painted){ waveSigns(); renderLive(); } };
window.sortiePanel = function(){
  if (!painted) return renderAll();
  const nw = narrowUI();
  sign('sstat', () => G.sortie ? V(G.sortie.x, nw ? 2.6 : 0, G.sortie.z) : null, `<div class="pill" id="sPill"><button class="pl-flag" type="button" data-act="retreat" title="퇴각 · 바로 성으로 (주운 결정은 그대로)" aria-label="퇴각 · 바로 성으로">🏳</button><span class="pl-hp" title="체력"><i></i></span><b class="pl-n"></b><span class="pl-sq" title="쫄병"></span><span class="pl-g gold" title="광자 결정"></span><span class="pl-e" title="남은 적"></span></div>`, 'pill', nw ? 'above' : 'below');
  renderLive();
};

/* ── 대장간: 도면 태그 · 옆으로 밀어서 부서 이동 ── */
const DEPT_ORDER = ['research', 'design', 'test', 'craft'], DEPT_NAME = {research:'연구부', design:'설계부', test:'실험부', craft:'제작부'};
function deptStep(dir){
  const n = DEPT_ORDER[DEPT_ORDER.indexOf(G.dept) + dir]; if (!n) return false;
  deptGo(n); return true;
}
function deptGo(n){
  if (!DEPT_ORDER.includes(n) || n === G.dept) return;
  UI.slide = DEPT_ORDER.indexOf(n) > DEPT_ORDER.indexOf(G.dept) ? 1 : -1;
  UI.menu = null; UI.trayInfo = null; G.dept = n; fSync(); renderAll();
}
const navBtn = (dir) => { const i = DEPT_ORDER.indexOf(G.dept), n = DEPT_ORDER[i + dir]; return n ? `<button class="sg-b nav" type="button" data-dstep="${dir}">${dir < 0 ? `◀ ${DEPT_NAME[n]}` : `${DEPT_NAME[n]} ▶`}</button>` : ''; };
function forgeSigns(){
  closePop('navL'); closePop('navR');   // 부서 이동은 왼쪽 위 제목 자리의 부서 탭 + 옆으로 밀기
}
function forgeUI5(){
  if (G.dept === 'research' || G.dept === 'craft'){ UI.page = G.dept; UI.pageMode = 'forge'; return; }
  if (UI.page === 'research' || UI.page === 'craft') UI.page = null;
  forgeSigns();
  if (F.learn) return learnUI5();
  if (G.dept === 'test') return testUI5();
  designUI5();
}
window.forgePanel = forgeUI5;
function trayTabs(){
  if (!fTray.visible) return;
  sign('trayTabs', () => fTray.visible ? fTray.userData.signAt : null, F.learn ? `<span class="sg-t">부품함 · 이 문제에 쓰는 것만</span>` :
    `<div class="sg-in"><span class="sg-t">부품함<br><span class="sg-h">끌어서 경통에</span></span>${sgRow([['src', '광원'], ['opt', '렌즈 · 편광'], ['laser', '레이저']].map(([c, t]) => [`data-pcat="${c}"`, t, partsCat === c]))}</div>`, 'blue', 'above');
}
function designUI5(){
  const list = G.designs.filter(d => d.kind === F.kind);
  sign('bench', () => V(benchCX(), BEAM_Y, -BAR_R - 2.4), `<div class="sg-in"><span class="sg-t">${F.kind === 'weapon' ? '무기' : '탑'}<br>설계</span>${sgRow([
      ['data-menu="bar"', `경통 ${F.barrel} cm ▾`, UI.menu === 'bar'], ['data-menu="designs"', `설계도 ${list.length} ▾`, UI.menu === 'designs'], ['data-menu="save"', '저장 ▾', UI.menu === 'save'],
      [`data-fkind="${F.kind === 'tower' ? 'weapon' : 'tower'}"`, F.kind === 'tower' ? '무기 만들기 ⇄' : '탑 만들기 ⇄'], ['data-act="learnOn"', '문제 풀기 ✎']])}</div>`, 'blue wide', 'above');
  trayTabs();
  const menu = {
    bar:() => `<div class="ed-head"><h3>경통 길이</h3>${cGold()}</div><div class="seg">${BARRELS.map(b => `<button type="button" data-fbar="${b.L}" aria-pressed="${F.barrel === b.L}" ${F.kind === 'weapon' && b.L > 40 ? 'disabled' : ''}>${b.L}cm${b.price ? ` · ${b.price}G` : ''}</button>`).join('')}</div><p class="muted">길수록 비싸요. 광원에서 멀리(a 크게) 둘수록 상이 작게 모여요.${F.kind === 'weapon' ? ' 무기는 40 cm까지.' : ''}</p>`,
    designs:() => `<div class="ed-head"><h3>설계도 불러오기</h3></div><div class="chips">${list.map(d => `<button class="chip ${F.sourceId === d.id ? 'on' : ''}" type="button" data-fload="${d.id}">${needsLaser(d) ? '🔒 ' : ''}${d.name}</button>`).join('')}<button class="chip" type="button" data-fnew="1">+ 빈 설계</button></div>`,
    save:() => `<div id="fsaveBody">${saveHtml()}</div>`,
  }[UI.menu];
  if (menu) paintPop('menu', {el:`#cards [data-menu="${UI.menu}"]`, under:'#cards .pop[data-key="bench"]'}, menu(), false, {cls:'narrow'});
  else if (UI.trayInfo) paintPop('tray', () => UI.trayInfo && UI.trayInfo.pos, trayInfoHtml(UI.trayInfo.p), false, {cls:'narrow'});
  fRenderEditor();
}
function testUI5(){
  paintPop('test', {fixed:'right'}, `<div id="fctl"></div><div id="fresult"></div>`, true, {cls:'narrow'});
  fRefreshTest();
}
function learnUI5(){
  learnUI();                                  // 쪽지 + (실험부면) 결과 카드
  paintDock('');
  trayTabs();
  const n = $('note'); if (n && !n.querySelector('.note-tools')){
    const tools = document.createElement('div'); tools.className = 'note-tools';
    tools.innerHTML = `<button class="chip" type="button" data-menu="ptype">유형 · ${PTYPES[G.ptype].short} ▾</button><button class="chip ${!G.settings.hard ? 'on' : ''}" type="button" data-act="diffNormal">보통</button><button class="chip ${G.settings.hard ? 'on' : ''}" type="button" data-act="diffHard">하드</button><button class="chip" type="button" data-act="learnOff">자유 설계로 ⇄</button>`;
    n.insertBefore(tools, n.children[1] || null);
  }
  if (UI.menu === 'ptype') paintPop('menu', {el:'[data-menu="ptype"]'}, `<div class="ed-head"><h3>문제 유형</h3></div><div class="chips">${PTYPES.map((q, i) => `<button class="chip ${i === G.ptype ? 'on' : ''}" type="button" data-ptype="${i}">${q.short}${G.solved[q.type] ? ` ✓${G.solved[q.type]}` : ''}</button>`).join('')}</div>`, false, {cls:'narrow'});
}
// 연구부 · 제작부 페이지: 머리에 부서 이동, 옆으로 밀기
const _paintPage5 = paintPage;
window.paintPage = function(){
  const before = $('page').dataset.id; _paintPage5();
  const pg = $('page');
  if (!pg.hidden && (UI.page === 'research' || UI.page === 'craft')){
    const h = $('pageHead'), h2 = h.querySelector('h2'); h2.textContent = '대장간'; h2.insertAdjacentHTML('afterend', deptTabs(false));
  }
  if (!pg.hidden && before !== pg.dataset.id && UI.slide){ pg.classList.remove('slide-l', 'slide-r'); void pg.offsetWidth; pg.classList.add(UI.slide > 0 ? 'slide-l' : 'slide-r'); }
  UI.slide = 0;
};
(function pageSwipe(){
  const pg = $('page'); let st = null;
  pg.addEventListener('pointerdown', ev => { if (ev.target.closest('button, input, canvas, label')) return; st = {x:ev.clientX, y:ev.clientY}; });
  pg.addEventListener('pointerup', ev => { if (!st || G.mode !== 'forge') return; const dx = ev.clientX - st.x, dy = ev.clientY - st.y; st = null; if (Math.abs(dx) > 70 && Math.abs(dx) > 1.6*Math.abs(dy)) deptStep(dx < 0 ? 1 : -1); });
})();
// 작업대 빈 곳을 옆으로 밀면 부서 이동
const _fUp5 = window.fUp;
window.fUp = function(ev){
  if (fDrag && fDrag.mode === 'empty'){ const dx = ev.clientX - fDrag.sx, dy = ev.clientY - fDrag.sy; if (Math.abs(dx) > 70 && Math.abs(dx) > 1.6*Math.abs(dy)){ fDrag = null; deptStep(dx < 0 ? 1 : -1); return; } }
  _fUp5(ev);
};

/* ── 훈련소: 병영 팻말 · 깃발 지휘판 · 근무지 게시판 ── */
window.trainPanel = function(){
  if (!painted) return renderAll();
  const squad = G.soldiers.filter(q => q.role === 'sortie'), full = G.soldiers.length >= soldierMax(), c = recruitCost(), ok = !full && G.gold >= c;
  sign('recruit', () => V((BARRACK.x0 + BARRACK.x1)/2, 0, BARRACK.z0 + 4.6), sgB(`data-act="recruit" ${ok ? '' : 'disabled'}`, '🪖', full ? '병영이 꽉 찼어요' : `쫄병 모집 · ${c}G`, `병영 ${G.soldiers.length}/${soldierMax()}${!full && !ok ? ` · 보유 ${G.gold}G` : ''}`, ok ? 'go' : ''));
  const AUTO_T = {off:'끔', start:'밤 시작', half:'절반 남으면'};
  sign('command', () => T_LEAD.clone(), `<div class="sg-in"><span class="sg-t">🚩 토벌대<br>${squad.length}명</span>${sgRow([[`data-tmenu="form"`, '대형 ▾', UI.tmenu === 'form', !squad.length], [`data-tmenu="auto"`, `자동 · ${AUTO_T[G.autoSortie] || '끔'} ▾`, UI.tmenu === 'auto']])}</div>${narrowUI() ? `<div class="sg-row2 sg-narrow">${sgB(`data-act="recruit" ${ok ? '' : 'disabled'}`, '🪖', full ? '병영 꽉 참' : `모집 · ${c}G`, `병영 ${G.soldiers.length}/${soldierMax()}`, ok ? 'go' : '')}${sgB(`data-act="upgTrain" aria-pressed="${UI.upg === 'train'}"`, '📋', '훈련', '업그레이드')}</div>` : ''}`);
  if (narrowUI()){ closePop('recruit'); closePop('tupg'); }
  if (UI.tmenu === 'form') paintPop('tmenu', {el:'#cards [data-tmenu="form"]', under:'#cards .pop[data-key="command"]'}, `<div class="ed-head"><h3>대형</h3></div>${sgRow(Object.entries(FORMS).map(([k, f]) => [`data-form="${k}"`, f.name, false]))}<p class="muted">토벌대가 깃발 뒤에 서는 모양이에요.</p>`, false, {cls:'narrow'});
  else if (UI.tmenu === 'auto') paintPop('tmenu', {el:'#cards [data-tmenu="auto"]', under:'#cards .pop[data-key="command"]'}, `<div class="ed-head"><h3>자동 출병</h3></div>${sgRow(Object.entries(AUTO_T).map(([k, t]) => [`data-auto="${k}"`, t, G.autoSortie === k]))}<p class="muted">밤에 토벌대가 알아서 성문 밖으로 나가요.</p>`, false, {cls:'narrow'});
  else closePop('tmenu');
  sign('tupg', () => V((DUTY.x0 + DUTY.x1)/2, 0, DUTY.z0 + 4.6), sgB(`data-act="upgTrain" aria-pressed="${UI.upg === 'train'}"`, '📋', '훈련', '업그레이드'));
  const s = G.soldiers.find(q => q.id === G.tSel);
  if (s){
    const roleTxt = q => q.down ? '기절 (다음 밤 회복)' : q.role === 'sortie' ? '토벌대' : q.role === 'tower' ? `${sockName(SOCKETS[q.sock])} 조종` : '병영 대기';
    const gun = gunOf(s), sc = soldierScale(), acc = soldierAcc();
    paintPop('soldier', soldierPos, `<div class="ed-head"><h3>${s.name}</h3><span>${roleTxt(s)}</span></div>
      <div class="bp-f">${gun.name} · ${formula(gun)}</div>
      <div class="vs">${Object.entries(FOES).map(([id, f]) => { const r = hitD(gun, f, 10, id === 'kn' ? 90 : null, null, sc); return `<div><small>${f.short}</small><b class="${r.v ? '' : 'zero'}">${r.v ? Math.round(r.v*(.5 + .5*acc)) : r.why === 'E < W' ? 'E&lt;W' : '0'}</b></div>`; }).join('')}</div>
      <p class="muted">10 m 초당 데미지 · 명중 ×${(.5 + .5*acc).toFixed(2)}</p>
      <h2>무기 쥐여 주기</h2>
      <div class="chips"><button class="chip ${!s.weapon ? 'on' : ''}" type="button" data-sweap="base">${SOLDIER_GUN.name} (기본)</button>${weaponGroups().map(g => `<button class="chip" type="button" data-sweap="${g.items[0].uid}">${g.d.name} ×${g.items.length}</button>`).join('')}</div>
      ${s.role === 'tower' ? '<p class="muted">탑을 맡고 있어요. 성벽에서 빼면 다시 출병할 수 있어요.</p>' : `<button class="btn" type="button" data-srole="${s.id}">${s.role === 'sortie' ? '병영 대기로' : '토벌대에 넣기'}</button>`}`, false, {cls:'narrow'});
  }
};

/* ── 발전단지: 실험실 라벨 ── */
const _solarPanel5 = window.solarPanel;
window.solarPanel = function(){
  if (!painted) return renderAll();
  _solarPanel5();
  const t = LS().tab;
  sign('spanel', () => panelPos().add(V(0, .6, 0)), `<div class="sg-row2">${sgB(`data-ltab="power" aria-pressed="${t === 'power'}"`, '☀', '발전 패널', `밤이 끝나면 +${dayCharge().toFixed(0)} ⚡`)}${sgB(`data-ltab="study" aria-pressed="${t === 'study'}"`, '📖', '연구 노트', '탐구 · 해금')}${narrowUI() ? sgB(`data-ltab="lab" aria-pressed="${t === 'lab'}"`, '🔬', '실험대', '광전관') : ''}</div>`, 'lab');
  if (t !== 'lab' && !narrowUI()) sign('slab', () => LAB0.clone().add(V(0, 2.2, 0)), sgB('data-ltab="lab"', '🔬', '광전관 실험대', '눌러서 실험하기'), 'lab');
  if (t === 'power'){ const c = CARDS.get('power'); if (c && !c.el.querySelector('.ugs')) c.el.querySelector('.popb').insertAdjacentHTML('afterbegin', `<div class="ug-head"><b>🔋 배터리 ${Math.floor(G.energy)} / ${batteryCap()} ⚡</b>${cGold()}</div><div class="ugs">${upgRows(['panels', 'battery'])}</div>`); }
  if (t === 'lab'){ const l = LS(), c = CARDS.get('lab');
    if (c && !c.el.querySelector('.lab-tools')){ const d = document.createElement('div'); d.className = 'lab-tools';
      d.innerHTML = `<div class="seg">${labMetals().map(k => `<button type="button" data-lmetal="${k}" aria-pressed="${l.metal === k}"><i style="background:${METALS[k].color}"></i>${METALS[k].name}</button>`).join('')}</div><button class="btn" type="button" data-lact="circuit">${l.closed ? '회로 열기' : '회로 연결'}</button>`;
      c.el.querySelector('.popb').insertBefore(d, c.el.querySelector('.popb').children[1]); }
  }
};

/* ── 꾸미기: 카드 안에 항목 탭 · 완료 버튼 ── */
const _dressPanel5 = window.dressPanel;
window.dressPanel = function(){
  if (!painted) return renderAll();
  _dressPanel5();
  const c = CARDS.get('dress'); if (!c) return;
  const cat = UI.dressCat || 'style', b = c.el.querySelector('.popb');
  b.insertAdjacentHTML('afterbegin', `<div class="dtabs">${DRESS_CATS.map(([k, t]) => `<button type="button" data-dcat="${k}" aria-pressed="${cat === k}">${t}</button>`).join('')}</div>`);
  b.insertAdjacentHTML('beforeend', `<button class="btn primary" type="button" data-act="dressDone">${firstDress() ? '이대로 시작하기 →' : '다 했어요'}</button>`);
};
window.keepPanel = function(){ if (UI.keepCard === 'board') paintPop('keepBoard', {fixed:'right'}, recordsHtml(), false, {cls:'narrow'}); };

/* ── 버튼 ── */
document.addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b) return;
  if (b.dataset.dstep){ deptStep(+b.dataset.dstep); ev.stopPropagation(); }
}, true);

/* ═════════════════════════════════════════════════════════════════
   v6 · 지도는 성과 함께 자란다 · 표지판은 3D 크기 · 바깥을 누르면 팝업이 닫힌다
   ═════════════════════════════════════════════════════════════════ */

/* ── 카드 자리: 슬라이더를 잡고 있는 카드는 움직이지 않는다 (렌즈 위치 슬라이더 드드득 방지)
      world 표지판은 3D 물건과 같은 비율로 작아진다 (전체 보기에서 버튼이 커지지 않게) ── */
const _placeCard6 = placeCard;
window.placeCard = function(c){
  const p = c.el;
  if (UI.rangeEl && p.contains(UI.rangeEl) && p.style.visibility === 'visible') return;
  _placeCard6(c);
  if (c.opts && c.opts.world && typeof c.at === 'function' && p.style.visibility === 'visible'){
    const v = c.at(); if (!v) return;
    const W = stage.clientWidth, Hh = stage.clientHeight, a = v.clone().project(camera);
    const b = v.clone().add(new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion)).project(camera);
    const ppu = Math.hypot((b.x - a.x)/2*W, (b.y - a.y)/2*Hh), s = clamp(ppu/c.opts.world, .45, 1);
    const tail = parseFloat(p.style.getPropertyValue('--tail')) || p.offsetWidth/2;
    p.style.transformOrigin = `${tail}px ${c.opts.place === 'below' ? '-14px' : 'calc(100% + 16px)'}`;
    p.style.scale = s.toFixed(3);
  } else if (p.style.scale) p.style.scale = '';
};
const WORLD_PPU = 37;   // 성벽 기본 시점에서 1 m가 이 정도 px일 때 원래 크기
const _placePanel6 = window.placePanel;
window.placePanel = function(){
  if (!painted) return renderAll();
  _placePanel6();
  for (const k of ['bell', 'build', 'wallup']){ const c = CARDS.get(k); if (c) c.opts.world = WORLD_PPU; }
};

/* ── 바깥을 누르면 닫힌다 ── */
// 성벽: 탑 자리 카드
const _wUp6 = window.wUp;
window.wUp = function(ev){
  const w0 = wPtr, sel0 = G.sel;
  _wUp6(ev);
  if (!w0 || ev.pointerId !== w0.id || sel0 == null || G.sel !== sel0) return;
  if (Math.hypot(ev.clientX - w0.x, ev.clientY - w0.y) >= 8 || (G.mode !== 'place' && G.mode !== 'cleared')) return;
  setRay(ev);
  const objs = sockPicks.filter(q => built(q.userData.sock.floor)).concat(SOCKETS.filter(s => s.tower).map(s => s.tower.mesh));
  if (!ray.intersectObjects(objs, true)[0]){ G.sel = null; G.previewUid = null; buildPreview(); renderAll(); }
};
// 훈련소: 쫄병 카드
const _tUp6 = window.tUp;
window.tUp = function(ev){
  const D = tDrag, sel = G.tSel, s0 = G.soldiers.find(q => q.id === sel), before = s0 ? JSON.stringify([s0.role, s0.slot]) : '';
  _tUp6(ev);
  if (!D || D.s || D.moved || sel == null || G.tSel !== sel) return;
  const s1 = G.soldiers.find(q => q.id === sel);
  if (!s1 || JSON.stringify([s1.role, s1.slot]) === before){ G.tSel = null; tSync(); renderAll(); }
};
// 성주관: 게시판 카드
const _kTap6 = window.kTap;
window.kTap = function(ev){
  setRay(ev); const h = ray.intersectObjects(kPicks.concat([kHero]), true)[0];
  if (!h && UI.keepCard){ UI.keepCard = null; renderAll(); return; }
  _kTap6(ev);
};
// 발전단지: 램프 · 전압 카드도 물건을 눌러야 열린다
UI.sCard = 'both';
const sOpen = k => UI.sCard === k || (UI.sCard === 'both' && !(narrowUI() && k === 'lamp'));
const sAdd = k => { UI.sCard = narrowUI() ? k : UI.sCard && UI.sCard !== k ? 'both' : k; };   // 좁은 세로 화면은 카드 하나씩
const _solarPanel6 = window.solarPanel;
window.solarPanel = function(){
  if (!painted) return renderAll();
  _solarPanel6();
  const l = LS(); if (l.tab !== 'lab') return;
  if (!sOpen('lamp')){ closePop('lamp'); sign('slamp', lampPos, sgB('data-scard="lamp"', '💡', '램프', `${l.src === 'sun' ? '햇빛' : `${l.src} nm`} · ${l.inten}% · ${l.light ? '켜짐' : '꺼짐'}`), 'lab'); }
  if (!sOpen('lab')){ closePop('lab'); sign('slab2', labPos, sgB('data-scard="lab"', '⚡', '전압 · 그래프', `${l.x.toFixed(2)} V · ${l.closed ? '회로 연결' : '회로 열림'}`), 'lab'); }
};
const _sTap6 = window.sTap;
window.sTap = function(ev){
  if (LS().tab === 'lab'){
    setRay(ev); const picks = []; sLab.traverse(o => { if (o.userData.labPick) picks.push(o); });
    const h = ray.intersectObjects(picks, false)[0];
    if (h && h.object.userData.labPick === 'lamp' && !sOpen('lamp')){ sAdd('lamp'); solarPanel(); return; }
    if (!h){
      if (ray.intersectObject(sLab, true)[0]){ if (!sOpen('lab')){ sAdd('lab'); solarPanel(); } return; }
      if (!ray.intersectObjects(sPicks, true)[0] && UI.sCard){ UI.sCard = null; solarPanel(); return; }
    }
  }
  _sTap6(ev);
};
// 어디서든: 빈 곳을 누르면 설정 목록이 접힌다
(function settingsFold(){
  let st = null;
  canvas.addEventListener('pointerdown', ev => { st = {x:ev.clientX, y:ev.clientY}; });
  canvas.addEventListener('pointerup', ev => { if (!st) return; const tap = Math.hypot(ev.clientX - st.x, ev.clientY - st.y) < 8; st = null; if (tap && G.showSettings){ G.showSettings = false; renderAll(); } });
  $('map').addEventListener('click', ev => { if (!ev.target.closest('.mp') && G.showSettings){ G.showSettings = false; renderAll(); } });
})();

/* ── 대장간: 렌즈 근처를 잡으면 렌즈를 잡은 것 · 경통 위에서 미는 건 부서 이동이 아니다 ── */
const beamBand = () => {
  const W = stage.clientWidth, Hh = stage.clientHeight, sp = v => { const q = v.clone().project(camera); return {x:(q.x + 1)/2*W, y:(1 - q.y)/2*Hh}; };
  const a = fView() === 'range' ? sp(V(RX0 - 3, BEAM_Y, 0)) : sp(V((F.source === 'laser' ? X_REAR : X_LAMP) - 1, BEAM_Y, 0));
  const b = fView() === 'range' ? sp(V(mToW(100) + 1, BEAM_Y, 0)) : sp(V(BX1 + 1, BEAM_Y, 0));
  return {x0:Math.min(a.x, b.x), x1:Math.max(a.x, b.x), y:(a.y + b.y)/2};
};
const _fDown6 = window.fDown;
window.fDown = function(ev){
  _fDown6(ev);
  if (!fDrag || fDrag.mode !== 'empty') return;
  const r = stage.getBoundingClientRect(), mx = ev.clientX - r.left, my = ev.clientY - r.top, W = stage.clientWidth, Hh = stage.clientHeight;
  camera.updateMatrixWorld();
  let best = null, bd = 44;
  for (const g of fDynPicks){
    const pk = g.userData.pick; if (!pk || (pk.kind !== 'free' && pk.kind !== 'dummy')) continue;
    const q = g.getWorldPosition(new THREE.Vector3()).project(camera), d = Math.hypot((q.x + 1)/2*W - mx, (1 - q.y)/2*Hh - my);
    if (d < bd){ bd = d; best = pk; }
  }
  if (best && !F.learn){ UI.trayInfo = null; UI.menu = null; fDrag = {mode:'move', pick:best, sx:ev.clientX, sy:ev.clientY, moved:false}; return; }
  const bb = beamBand(); if (mx > bb.x0 - 30 && mx < bb.x1 + 30 && Math.abs(my - bb.y) < 64) fDrag.noSwipe = true;
};
const _fUp6 = window.fUp;
window.fUp = function(ev){
  if (fDrag && fDrag.mode === 'empty'){
    const tap = Math.hypot(ev.clientX - fDrag.sx, ev.clientY - fDrag.sy) < 8;
    if (tap){ fDrag = null; if (F.sel || UI.trayInfo || UI.menu || G.showSettings){ F.sel = null; UI.trayInfo = null; UI.menu = null; G.showSettings = false; fSync(); renderAll(); } return; }
    if (fDrag.noSwipe){ fDrag = null; return; }
  }
  _fUp6(ev);
};

/* ═════════ 지도: 처음엔 성만 보이고, 성이 크면 안개가 걷힌다 ═════════
   0단계: 성 둘레만 · 끌 수 없음 (안개가 가장자리를 덮음)
   1단계: 3층 증축 또는 4일째 → 남쪽 빈 터 · 서쪽 호수 · 동쪽 바위산이 보이고 끌어서 둘러봄. 북쪽은 안개(적의 소굴)
   2단계: 보스를 쓰러뜨리면(G.bossDown) 북쪽 안개가 걷히고 위로 끌어 올려 소굴로 */
const MW = {x0:-220, y0:-380, w:1440, h:1170}, CORE = {x0:8, y0:12, x1:992, y1:590};
const mapStage = () => G.bossDown ? 2 : (built(3) || G.wave >= 4) ? 1 : 0;
const MSEEN = 'johamin-castle-mapseen-v1';
let mSeen = (() => { try { return +(localStorage.getItem(MSEEN) || 0); } catch(e){ return 0; } })();
function homeView(){
  const W = stage.clientWidth, Hh = stage.clientHeight, cw = CORE.x1 - CORE.x0, ch = CORE.y1 - CORE.y0, s = Math.min(W/cw, Hh/ch);
  return {s, tx:W/2 - s*((CORE.x0 + CORE.x1)/2 - MW.x0), ty:Hh/2 - s*((CORE.y0 + CORE.y1)/2 - MW.y0)};
}
const viewAt = (wx, wy, s) => ({s, tx:stage.clientWidth/2 - s*(wx - MW.x0), ty:stage.clientHeight/2 - s*(wy - MW.y0)});
window.mapFit = function(){ const h = homeView(); MV.s = h.s; MV.tx = h.tx; MV.ty = h.ty; MV.user = false; MV.init = true; };
window.mapClamp = function(){
  const W = stage.clientWidth, Hh = stage.clientHeight, hv = homeView();
  if (mapStage() === 0 && !UI.mapGlide){ MV.s = hv.s; MV.tx = hv.tx; MV.ty = hv.ty; return; }
  MV.s = clamp(MV.s, Math.max(W/MW.w, Hh/MW.h, hv.s*.7), hv.s*2.6);
  const w = MW.w*MV.s, h = MW.h*MV.s;
  MV.tx = w <= W ? (W - w)/2 : clamp(MV.tx, W - w, 0);
  MV.ty = h <= Hh ? (Hh - h)/2 : clamp(MV.ty, Hh - h, 0);
};
function landsSVG(){
  const ink = '#5a3e28', T = [], tree = (x, y, k = 1) => `<path d="M${x} ${y} l${13*k} ${-32*k} l${13*k} ${32*k} z M${x + 13*k} ${y} v${7*k}"/>`;
  // 북쪽 숲 (소굴 앞 길은 비운다)
  for (let i = 0; i < 46; i++){ const x = -200 + (i*97) % 1400, y = -60 - ((i*53) % 230); if (Math.abs(x - 500) < 110 && y > -260) continue; T.push(tree(x, y, .9 + (i % 3)*.15)); }
  // 서쪽 · 동쪽 숲
  for (let i = 0; i < 26; i++){ const left = i % 2 === 0, x = left ? -200 + (i*37) % 170 : 1012 + (i*41) % 170, y = 200 + (i*67) % 520; T.push(tree(x, y, .85)); }
  return `<g filter="url(#wob)" fill="none" stroke="${ink}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M-220 -300 L-120 -350 L-40 -310 L60 -360 L170 -300 L280 -350 L400 -290 L500 -345 L610 -295 L720 -352 L840 -300 L950 -345 L1060 -305 L1220 -350" stroke-width="2" opacity=".7"/>
    <g fill="#dcc48f" stroke-width="1.8">${T.join('')}</g>
    <path d="M500 -168 C 470 -110, 540 -60, 500 0 S 470 80, 500 112" stroke="#8b2f2f" stroke-width="2.4" stroke-dasharray="6 9" opacity=".75"/>
    <path d="M436 -170 Q436 -262 500 -262 Q564 -262 564 -170 Z" fill="#3a2a1c" stroke-width="3"/>
    <path d="M420 -170 h160 M424 -170 l-14 -16 m182 16 l14 -18 M452 -246 l-16 -10 m112 10 l14 -12"/>
    <circle cx="486" cy="-208" r="4" fill="#d24a3a" stroke="none"/><circle cx="514" cy="-208" r="4" fill="#d24a3a" stroke="none"/>
    <path d="M-220 128 C -120 112, -40 140, 30 130 M970 140 C 1040 150, 1120 120, 1220 134" stroke="#3f6d8f" stroke-width="16" opacity=".45"/>
    <path d="M-220 128 C -120 112, -40 140, 30 130 M970 140 C 1040 150, 1120 120, 1220 134" stroke="#3f6d8f" stroke-width="2"/>
    <ellipse cx="-104" cy="420" rx="78" ry="44" fill="#a9c2cf" stroke="#3f6d8f" opacity=".85"/>
    <path d="M1030 470 l40 -70 l30 40 l26 -56 l54 86 z" fill="#d6bf92"/><path d="M1060 470 l18 -30 l16 30" opacity=".6"/>
    <path d="M500 590 C 505 620, 490 650, 500 700" stroke-dasharray="4 7" opacity=".6"/>
    <g stroke-dasharray="7 6" opacity=".8"><rect x="300" y="628" width="150" height="90" rx="6"/><rect x="565" y="628" width="150" height="90" rx="6"/><rect x="800" y="628" width="160" height="90" rx="6"/></g>
    <path d="M318 700 h114 M318 684 h114 M318 668 h114" stroke-width="1.4" opacity=".6"/>
    <path d="M600 712 l40 -62 l40 62 M628 712 v-18 a12 12 0 0 1 24 0 v18" opacity=".8"/>
    <path d="M830 708 h100 v-36 h-100 z M850 672 v-16 h60 v16" opacity=".75"/>
  </g>
  <g font-family="Gaegu, 'IBM Plex Sans KR', sans-serif" fill="${ink}" text-anchor="middle">
    ${mapStage() >= 2 ? `<text x="500" y="-130" font-size="26" font-weight="700">적의 소굴</text><text x="500" y="-108" font-size="16" opacity=".8">던전 · 준비 중</text>` : ''}
    <text x="-104" y="490" font-size="20" font-weight="700">서쪽 호수</text><text x="1110" y="500" font-size="20" font-weight="700">동쪽 바위산</text>
    <text x="375" y="742" font-size="19" font-weight="700">농장 터</text><text x="640" y="742" font-size="19" font-weight="700">광산 터</text><text x="880" y="742" font-size="19" font-weight="700">대형 무기 공방 터</text>
    <text x="640" y="764" font-size="14" opacity=".7">셋 다 준비 중 · 지을 날을 기다려요</text>
  </g>`;
}
function fogSVG(st, cls = '', delay = 0){
  const id = `fm${st}${cls ? 'o' : ''}`;
  const hole = st === 0 ? `<rect x="${CORE.x0 - 4}" y="${CORE.y0 - 30}" width="${CORE.x1 - CORE.x0 + 8}" height="${CORE.y1 - CORE.y0 + 34}" rx="60" fill="#000" filter="url(#fogBlur)"/>`
    : st === 1 ? `<rect x="${MW.x0 - 80}" y="-6" width="${MW.w + 160}" height="${MW.h}" rx="60" fill="#000" filter="url(#fogBlur)"/>` : '';
  if (st >= 2) return '';
  const words = st === 0
    ? `<text x="500" y="-170" font-size="44" font-weight="700">안개</text><text x="500" y="-136" font-size="20">성을 키우면 지도가 펼쳐져요</text><text x="500" y="700" font-size="34" font-weight="700" opacity=".7">안개</text>`
    : `<text x="500" y="-62" font-size="36" font-weight="700">안개 너머 · 적의 소굴</text><text x="500" y="-32" font-size="19">밤마다 적이 내려오는 곳 · 보스를 쓰러뜨리면 걷혀요</text>`;
  return `<mask id="${id}"><rect x="${MW.x0}" y="${MW.y0}" width="${MW.w}" height="${MW.h}" fill="#fff"/>${hole}</mask>
    <g class="fog ${cls}" mask="url(#${id})" pointer-events="none" ${cls ? `style="animation-delay:${-delay}s"` : ''}>
      <rect x="${MW.x0}" y="${MW.y0}" width="${MW.w}" height="${MW.h}" fill="#ecdcb8" opacity=".72"/>
      <rect x="${MW.x0}" y="${MW.y0}" width="${MW.w}" height="${MW.h}" filter="url(#fogN)"/>
      <g font-family="Gaegu, 'IBM Plex Sans KR', sans-serif" fill="#7a5a3c" text-anchor="middle" opacity=".85">${words}</g>
    </g>`;
}
const WORLD_DEFS = `<defs>
  <radialGradient id="parchW" cx="50%" cy="45%" r="72%"><stop offset="0" stop-color="#f3e2bd"/><stop offset=".72" stop-color="#e6cc98"/><stop offset="1" stop-color="#b98a52"/></radialGradient>
  <filter id="fogBlur" x="-10%" y="-10%" width="120%" height="120%"><feGaussianBlur stdDeviation="16"/></filter>
  <filter id="fogN" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".011" numOctaves="3" seed="5"/><feColorMatrix values="0 0 0 0 .95  0 0 0 0 .89  0 0 0 0 .77  0 0 0 1.6 -.45"/></filter>
</defs>`;
window.mapSVG = function(){
  const st = mapStage(), R = UI.mapReveal;
  let s = _mapSVG3();
  s = s.replace('viewBox="0 0 1000 620"', `viewBox="${MW.x0} ${MW.y0} ${MW.w} ${MW.h}"`)
    .replace('<rect x="6" y="6" width="988" height="608" rx="18" fill="url(#parch)" stroke="#8a6238" stroke-width="3"/>', '')
    .replace('<rect x="6" y="6" width="988" height="608" rx="18" fill="#fff" filter="url(#rough)"/>',
      `${WORLD_DEFS}<rect x="${MW.x0 + 4}" y="${MW.y0 + 4}" width="${MW.w - 8}" height="${MW.h - 8}" rx="26" fill="url(#parchW)" stroke="#8a6238" stroke-width="4"/><rect x="${MW.x0 + 4}" y="${MW.y0 + 4}" width="${MW.w - 8}" height="${MW.h - 8}" rx="26" fill="#fff" filter="url(#rough)"/>${landsSVG()}`)
    .replace(/<g opacity="\.35">[\s\S]*?<\/g>/, '')
    .replace(/<text[^>]*>(농장|광산|대형 무기 공방) \(준비 중\)<\/text>/g, '')
    .replace(/(>오늘 밤 · [^<]*)</, '$1 · 성문 위 종을 치면 시작<');
  const old = R ? fogSVG(R.from, 'fog-old', (performance.now() - R.t0)/1000) : '';
  return s.replace(/<\/svg>\s*$/, `${fogSVG(st)}${old}</svg>`);
};
window.renderMap = function(){
  const m = $('map'); m.hidden = G.mode !== 'map';
  if (G.mode !== 'map'){ if (UI.mapBanner) mapBannerHide(); return; }
  m.innerHTML = mapSVG();
  const svg = m.querySelector('svg'); svg.setAttribute('width', MW.w); svg.setAttribute('height', MW.h); svg.style.width = `${MW.w}px`; svg.style.height = `${MW.h}px`;
  if (!MV.init) requestAnimationFrame(() => { mapFit(); applyMapView(); });
  else { mapClamp(); applyMapView(); }
  mapReveal();
};
/* 안개가 걷히는 순간: 성벽 드립 · 지도가 스스로 한 바퀴 보여 줌 → 끌어 보게 만든다 */
const MAP_STORY = {
  1: () => ({t:'지도가 펼쳐졌어요!', l:built(3) ? ['3층을 올렸더니 성 밖이 다 보인다?', '— 원래 다 있었는데 아무도 안 봤답니다'] : ['며칠 버텼더니 성 밖이 궁금해졌다', '— 지도가 접혀 있었던 거래요'], s:'끌어서 둘러봐요 · 북쪽 안개 너머엔 적의 소굴이…'}),
  2: () => ({t:'북쪽 안개가 걷혔어요!', l:['보스가 쓰러지자 적의 소굴이 드러났다', '— 위로 쭉 끌어 올려서 쳐들어가요'], s:'던전은 준비 중이에요'}),
};
function mapBannerHide(){ const b = $('banner'); if (UI.mapBanner){ clearTimeout(UI.mapBanner); UI.mapBanner = null; b.hidden = true; b.classList.remove('story'); } }
$('banner').addEventListener('click', () => { if (UI.mapBanner) mapBannerHide(); });
function mapReveal(){
  const st = mapStage(); if (UI.mapReveal || st <= mSeen) return;
  UI.mapReveal = {from:mSeen, t0:performance.now()}; mSeen = st; try { localStorage.setItem(MSEEN, String(st)); } catch(e){}
  const S = MAP_STORY[st](), b = $('banner');
  b.innerHTML = `<b>${S.t}</b><span>${S.l.join('<br>')}</span><small>${S.s}</small>`; b.classList.add('story'); b.hidden = false;
  clearTimeout(UI.mapBanner); UI.mapBanner = setTimeout(mapBannerHide, 6500);
  setTimeout(() => { UI.mapReveal = null; if (G.mode === 'map') renderMap(); }, 2700);
  mapTour(st);
}
function mapTour(st){
  const hv = homeView(), legs = st === 1
    ? [[hv, 700], [viewAt(560, 560, hv.s*.92), 1300], [null, 600], [viewAt(500, -120, hv.s*.92), 1600], [null, 800], [hv, 1200]]
    : [[hv, 500], [viewAt(500, -150, hv.s), 1700], [null, 1100], [hv, 1300]];
  UI.mapGlide = {i:0};
  const G0 = UI.mapGlide, ease = t => t < .5 ? 2*t*t : 1 - (-2*t + 2)**2/2;
  const step = () => {
    if (UI.mapGlide !== G0 || G.mode !== 'map'){ if (UI.mapGlide === G0) UI.mapGlide = null; return; }
    const [to, dur] = legs[G0.i];
    if (!G0.from){ G0.from = {s:MV.s, tx:MV.tx, ty:MV.ty}; G0.t0 = performance.now(); }
    const k = clamp((performance.now() - G0.t0)/dur, 0, 1), e = ease(k);
    if (to){ MV.s = G0.from.s + (to.s - G0.from.s)*e; MV.tx = G0.from.tx + (to.tx - G0.from.tx)*e; MV.ty = G0.from.ty + (to.ty - G0.from.ty)*e; mapClamp(); applyMapView(); }
    if (k >= 1){ G0.i++; G0.from = null; if (G0.i >= legs.length){ UI.mapGlide = null; MV.user = false; hint('지도를 끌어서 둘러봐요 · 두 손가락이나 휠로 크게 볼 수 있어요'); return; } }
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
(function mapTouch(){
  const m = $('map'); let st = null, told = 0;
  m.addEventListener('pointerdown', ev => { if (UI.mapGlide){ UI.mapGlide = null; } st = {x:ev.clientX, y:ev.clientY}; }, true);
  m.addEventListener('pointermove', ev => {
    if (!st || mapStage() > 0) return;
    if (Math.hypot(ev.clientX - st.x, ev.clientY - st.y) > 26 && performance.now() - told > 5000){ told = performance.now(); hint('지도가 아직 접혀 있어요 · 성을 키우면 안개가 걷혀요'); }
  });
  window.addEventListener('pointerup', () => { st = null; });
  m.addEventListener('wheel', () => { if (mapStage() === 0 && performance.now() - told > 5000){ told = performance.now(); hint('지도가 아직 접혀 있어요 · 성을 키우면 안개가 걷혀요'); } });
})();
// 실험대 카드 열기 · 실험대 탭으로 들어오면 카드 둘 다
document.addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b) return;
  if (b.dataset.scard){ sAdd(b.dataset.scard); ev.stopPropagation(); solarPanel(); }
  else if (b.dataset.ltab === 'lab') UI.sCard = 'both';
}, true);

/* ═════════════════════════════════════════════════════════════════
   v7 · 대장간 부서 탭(제목 자리) · 메뉴는 표지판 아래 · 못 누르는 버튼은 이유를 말한다 · 토벌 상황은 작은 알약
   ═════════════════════════════════════════════════════════════════ */

/* ── 부서 탭: 왼쪽 위 「피직스 캐슬」 제목 자리가 대장간에서는 부서 탭이 된다. 장면을 안 가리고, 어느 부서든 한 번에 간다 ── */
function deptTabs(label = true){
  return `<nav class="ftabs" aria-label="대장간 부서">${label ? '<span class="ft-t">대장간</span>' : ''}${DEPT_ORDER.map(d => `<button type="button" data-dgo="${d}" aria-pressed="${G.dept === d}">${DEPT_NAME[d]}</button>`).join('')}</nav>`;
}
const brandEl = document.querySelector('.hud .brand'), BRAND0 = brandEl.innerHTML;
function paintBrand(){
  const f = G.mode === 'forge', h = f ? deptTabs() : BRAND0;
  if (brandEl.dataset.h !== h){ brandEl.innerHTML = h; brandEl.dataset.h = h; }
  brandEl.classList.toggle('has-tabs', f);
}
const _renderAll7 = window.renderAll;
window.renderAll = function(){ _renderAll7.apply(this, arguments); paintBrand(); };

/* ── 메뉴 카드: 누른 버튼 바로 아래, 표지판 밑줄 아래에 연다 (표지판의 다른 버튼을 덮지 않는다) ── */
const _placeCard7 = placeCard;
window.placeCard = function(c){
  _placeCard7(c);
  const at = c.at; if (!at || typeof at === 'function' || !at.under) return;
  const btn = document.querySelector(at.el), u = document.querySelector(at.under); if (!btn || !u) return;
  const s = stage.getBoundingClientRect(), rb = btn.getBoundingClientRect(), ru = u.getBoundingClientRect(), p = c.el, W = stage.clientWidth;
  p.style.left = `${Math.round(clamp(rb.left + rb.width/2 - s.left - p.offsetWidth/2, 10, W - p.offsetWidth - 10))}px`;
  p.style.top = `${Math.round(ru.bottom - s.top + 8)}px`; p.style.visibility = 'visible';
};

/* ── 토벌 알약: 숫자만 바꾸고 버튼은 그대로 둔다 (버튼을 다시 만들면 누르는 중에 사라진다) ── */
const _renderLive7 = window.renderLive;
window.renderLive = function(){
  _renderLive7();
  const p = $('sPill'), S = G.sortie; if (!p || !S) return;
  const up = S.squad.filter(u => !u.down).length, hp = Math.max(0, S.hp);
  p.querySelector('.pl-hp i').style.width = `${Math.round(hp/S.max*100)}%`;
  p.querySelector('.pl-hp').classList.toggle('low', hp/S.max < .35);
  p.querySelector('.pl-n').textContent = `${hp}`;
  p.querySelector('.pl-sq').textContent = `🪖 ${up}/${S.squad.length}`;
  p.querySelector('.pl-g').textContent = `◆ ${S.gold}G`;
  p.querySelector('.pl-e').textContent = `적 ${G.enemies.length + G.queue.length}`;
};

/* ── 못 누르는 버튼: 눌러도 아무 일이 없으면 고장 난 것처럼 보인다 → 왜 못 누르는지, 어디로 가면 되는지 알려 준다 ── */
function flashResearch(r){
  if (!r) return;
  const card = [...document.querySelectorAll('#page .bpcard')].find(c => c.querySelector('.bph b')?.textContent === r.name); if (!card) return;
  card.scrollIntoView({block:'center', behavior:'smooth'}); card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
}
function whyNot(b){
  const t = b.textContent.replace(/\s+/g, ' ').trim(); let m;
  if (b.dataset.why){ b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); return hint(b.dataset.why); }
  b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope');
  if (b.id === 'labX') return hint('회로가 열려 있어요 · 「회로 연결」을 먼저 눌러요');
  if ((m = t.match(/^먼저: (.+)$/))){
    if (Object.values(LAB_NAMES).includes(m[1])) return hint(`발전단지 실험대의 연구 노트에서 「${m[1]}」을 먼저 끝내요`);
    flashResearch(RESEARCH.find(q => q.name === m[1])); return hint(`먼저 「${m[1]}」 연구를 끝내야 열려요`);
  }
  if (b.dataset.craft && /연구 필요/.test(t)){
    const d = G.designs.find(q => q.id === b.dataset.craft), need = !G.research.laser ? RESEARCH.find(q => q.id === 'laser') : null;
    deptGo('research'); setTimeout(() => flashResearch(need), 300);
    return hint(need ? `${d ? d.name : '이 설계도'}는 레이저예요 · 연구부에서 「레이저」를 먼저 연구해요` : `${d ? d.name : '이 설계도'}의 레이저 매질 연구가 먼저예요 · 연구부에서 확인해요`);
  }
  if (/꽉 찼/.test(t)) return hint(/병영/.test(t) ? '병영이 꽉 찼어요 · 훈련 업그레이드로 늘려요' : '제작 칸이 꽉 찼어요 · 밤이 지나 완성되면 비어요');
  if (b.dataset.fbar) return hint('주인공 무기 경통은 40 cm까지예요');
  const cost = +((t.match(/(\d+)\s*G\b/) || [])[1] || 0);
  if (cost && G.gold < cost) return hint(`골드가 ${cost - G.gold}G 모자라요 · 지금 ${G.gold}G`);
  if (/최대/.test(t)) return hint('이미 최대예요');
  hint(`지금은 못 눌러요 · ${t}`);
}
window.addEventListener('click', ev => {
  if (ev.target.closest('button:not(:disabled), input:not(:disabled), select, label')) return;
  const box = ev.target.closest('#cards .pop, #page, #note'); if (!box) return;
  const x = ev.clientX, y = ev.clientY;
  const b = [...box.querySelectorAll('button:disabled, input:disabled')].find(e => { const r = e.getBoundingClientRect(); return r.width && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom; });
  if (b){ ev.stopPropagation(); whyNot(b); }
}, true);
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-dgo]'); if (!b) return;
  ev.stopPropagation(); if (G.mode === 'forge') deptGo(b.dataset.dgo);
}, true);

/* ═════════════════════════════════════════════════════════════════
   v8 · 업그레이드는 그 건물 옆 작은 카드 · 대장간 부서는 엄지가 닿는 아래 구석에서도 넘긴다
   ═════════════════════════════════════════════════════════════════ */

/* ── 업그레이드 카드: 화면 전체 페이지 대신 그 자리(연병장 게시판 · 발전 패널) 옆에 뜬다 ── */
UI.upg = null; UI.upgTab = 'soldier';
const UPG_TABS = {soldier:['sAcc', 'sHp', 'sPow', 'barracks'], hero:['hHp', 'hPow', 'hSpd']};
function upgRows(ids){
  return ids.map(id => {
    const u = UPG[id], lv = up(id), max = lv >= u.max, c = max ? 0 : u.cost(lv);
    const lock = u.req && !labOk(u.req);
    const btn = lock ? `<button class="btn" type="button" disabled data-why="발전단지 실험대의 연구 노트에서 「${LAB_NAMES[u.req]}」을 먼저 끝내요">🔒</button>`
      : max ? '<span class="ug-max">최대</span>' : `<button class="btn" type="button" data-up="${id}" ${G.gold >= c ? '' : 'disabled'}>${c}G</button>`;
    return `<div class="ug"><div><b>${u.name}</b> <small>Lv.${lv}/${u.max}</small><span>${max ? '다 올렸어요' : u.eff(lv)}</span>${lock ? `<span class="ug-lock">연구 노트 「${LAB_NAMES[u.req]}」 먼저</span>` : ''}</div>${btn}</div>`;
  }).join('');
}
function upgCard(){
  if (UI.upg === 'train' && G.mode === 'train'){
    const t = UI.upgTab;
    paintPop('upg', {fixed:'left'}, `<div class="ed-head"><h3>훈련 업그레이드</h3>${cGold()}</div>
      <div class="seg"><button type="button" data-ugtab="soldier" aria-pressed="${t === 'soldier'}">쫄병</button><button type="button" data-ugtab="hero" aria-pressed="${t === 'hero'}">주인공</button></div>
      <div class="ugs">${upgRows(UPG_TABS[t])}</div>`, false, {cls:'narrow'});
  } else closePop('upg');
}
const _trainPanel8 = window.trainPanel;
window.trainPanel = function(){ if (!painted) return renderAll(); _trainPanel8(); if (UI.upg === 'train') closePop('tupg'); upgCard(); };
const _solarPanel8 = window.solarPanel;
window.solarPanel = function(){
  if (!painted) return renderAll(); _solarPanel8();
  // 패널 표지판: 금속 · 장 수 · 하루 충전량을 한 곳에서 (3D 이름표는 없앴다)
  const sp = CARDS.get('spanel'); if (sp){ const s = sp.el.querySelector('[data-ltab="power"] small, [data-ltab="power"] .sg-s'); if (s) s.textContent = `${labOk('pn') ? 'p-n 반도체' : METALS[G.panelMetal].name} ${panelsN()}장 · 밤이 끝나면 +${dayCharge().toFixed(0)} ⚡`; }
  upgCard();
  if (narrowUI() && LS().tab === 'lab'){
    if (sOpen('lab')) closePop('slamp'); if (sOpen('lamp')) closePop('slab2');   // 시트에 가린 표지판 대신 시트 머리의 바꾸기 단추
    for (const [k, o, ic, t] of [['lab', 'lamp', '💡', '램프'], ['lamp', 'lab', '⚡', '전압 · 그래프']]){
      const c = CARDS.get(k); if (c && !c.el.querySelector('.swap')) c.el.querySelector('.ed-head')?.insertAdjacentHTML('beforeend', `<button class="tbtn swap" type="button" data-scard="${o}">${ic} ${t}</button>`);
    }
  }
};
document.addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b) return;
  const a = b.dataset.act;
  if (a === 'upgTrain' || a === 'upgSolar'){ ev.stopPropagation(); const k = a === 'upgTrain' ? 'train' : 'solar'; UI.upg = UI.upg === k ? null : k; UI.page = null; renderAll(); return; }
  if (b.dataset.ugtab){ ev.stopPropagation(); UI.upgTab = b.dataset.ugtab; renderAll(); return; }
  if (b.dataset.pclose === 'upg') UI.upg = null;
  if (b.dataset.ltab) UI.upg = null;
}, true);
(function upgFold(){
  let st = null;
  canvas.addEventListener('pointerdown', ev => { st = {x:ev.clientX, y:ev.clientY}; });
  canvas.addEventListener('pointerup', ev => { if (!st) return; const tap = Math.hypot(ev.clientX - st.x, ev.clientY - st.y) < 8; st = null; if (tap && UI.upg){ UI.upg = null; renderAll(); } });
})();
let lastMode8 = G.mode;
const _renderAll8 = window.renderAll;
window.renderAll = function(){ if (G.mode !== lastMode8){ lastMode8 = G.mode; UI.upg = null; } _renderAll8.apply(this, arguments); thumbNav(); };

/* ── 대장간 엄지 이동: 패드를 두 손으로 쥐면 위쪽 탭에 손가락이 안 닿는다 → 아래 양 구석에 이전 · 다음 부서 ── */
const tnav = document.createElement('div'); tnav.className = 'thumbnav'; tnav.hidden = true; stage.appendChild(tnav);
function thumbNav(){
  const on = G.mode === 'forge'; tnav.hidden = !on; if (!on) return;
  const i = DEPT_ORDER.indexOf(G.dept), p = DEPT_ORDER[i - 1], n = DEPT_ORDER[i + 1];
  const h = `${p ? `<button type="button" class="tn-l" data-dgo="${p}" aria-label="${DEPT_NAME[p]}로"><span>◀</span>${DEPT_NAME[p]}</button>` : '<i></i>'}${n ? `<button type="button" class="tn-r" data-dgo="${n}" aria-label="${DEPT_NAME[n]}로">${DEPT_NAME[n]}<span>▶</span></button>` : '<i></i>'}`;
  if (tnav.dataset.h !== h){ tnav.innerHTML = h; tnav.dataset.h = h; }
}

/* ── 훈련소 지휘 메뉴 · 업그레이드 카드는 왼쪽에 붙인다(가운데 표지판을 안 덮게) · 좁은 세로 화면에서는 고정 카드가 아래 시트가 된다 ── */
UI.tmenu = null;
document.addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b) return;
  if (b.dataset.tmenu){ ev.stopPropagation(); UI.tmenu = UI.tmenu === b.dataset.tmenu ? null : b.dataset.tmenu; UI.upg = null; renderAll(); return; }
  if (b.dataset.form || b.dataset.auto && G.mode === 'train') UI.tmenu = null;
  if (b.dataset.pclose === 'tmenu') UI.tmenu = null;
  if (b.dataset.act === 'upgTrain') UI.tmenu = null;
}, true);
(function tmenuFold(){
  let st = null;
  canvas.addEventListener('pointerdown', ev => { st = {x:ev.clientX, y:ev.clientY}; });
  canvas.addEventListener('pointerup', ev => { if (!st) return; const tap = Math.hypot(ev.clientX - st.x, ev.clientY - st.y) < 8; st = null; if (tap && UI.tmenu){ UI.tmenu = null; renderAll(); } });
})();
const narrowUI = () => stage.clientWidth < 600 && stage.clientHeight > stage.clientWidth;
const SHEET_KEYS = new Set(['test', 'power', 'dress', 'keepBoard', 'lab', 'lamp', 'upg', 'soldier', 'sock', 'fsel']);
let sheetH = 0;   // 이번 프레임에 아래 시트가 차지한 높이 → 엄지 이동 버튼을 그 위로 올린다
(function sheetLoop(){ stage.style.setProperty('--sheeth', `${sheetH}px`); sheetH = 0; requestAnimationFrame(sheetLoop); })();
const _placeCard8 = placeCard;
window.placeCard = function(c){
  _placeCard8(c);
  const p = c.el, at = c.at, W = stage.clientWidth, Hh = stage.clientHeight;
  const sheet = narrowUI() && SHEET_KEYS.has(c.key || p.dataset.key);
  p.classList.toggle('sheet', sheet);
  if (sheet){ p.style.left = '8px'; p.style.top = `${Math.round(Hh - p.offsetHeight - 8)}px`; p.style.visibility = 'visible'; p.style.scale = ''; sheetH = Math.max(sheetH, p.offsetHeight + 8); return; }
  if (at && at.fixed === 'left'){ const top0 = 60; p.style.left = '14px'; p.style.top = `${Math.round(clamp((Hh - p.offsetHeight)/2, top0, Math.max(top0, Hh - p.offsetHeight - 10)))}px`; p.style.visibility = 'visible'; }
};

/* ═════════════════════════════════════════════════════════════════
   v9 · 교전 범위 모듈 (연구 → 탑마다 구매) · 렌즈 자격 시험
   ═════════════════════════════════════════════════════════════════ */
const examKind = r => r.exam === true ? 'laser' : r.exam || null;
const examPassed = k => k === 'laser' ? !!G.laserExam : !!(G.exams && G.exams[k]);
function rangeHtml(T){
  if (!G.research.range) return `<div class="row"><span>교전 범위</span><button class="btn" type="button" disabled data-why="대장간 연구부에서 「교전 범위 모듈 Ⅰ」을 먼저 연구해요 (자격 시험 · 20번 렌즈)">🔒</button></div>`;
  if (!T.rng) return `<div class="row"><span>교전 범위 모듈<br><small class="muted">범위 밖 적은 안 쏘고 전기도 안 써요</small></span><button class="btn" type="button" data-act="buyRange" ${G.gold >= RANGE_PRICE ? '' : 'disabled'}>달기 · ${RANGE_PRICE}G</button></div>`;
  const [lo, hi] = rangeOf(T), bd = band(T.design), auto = T.rng.auto && G.research.range2, pct = v => `${clamp(v, 0, 100)}%`;
  return `<div class="rng-box">
    <div class="row"><span>교전 범위 <b id="rngV">${Math.round(lo)}–${Math.round(hi)} m</b></span>${G.research.range2 ? `<button class="btn" type="button" data-act="rngAuto" aria-pressed="${auto}">${auto ? '자동 구간 · 켜짐' : '자동 구간'}</button>` : ''}</div>
    <div class="rbar" aria-hidden="true">${bd ? `<i class="bd" style="left:${pct(bd[0])};width:${pct(bd[1] - bd[0])}"></i>` : ''}<i class="sel" id="rngSel" style="left:${pct(lo)};width:${pct(hi - lo)}"></i><span>0</span><span>50</span><span>100 m</span></div>
    <p class="muted rng-key"><i class="k bd"></i>빛이 잘 모이는 구간${bd ? ` ${bd[0]}–${bd[1]} m` : ' 없음(가까울수록 셈)'} · <i class="k sel"></i>쏘는 범위</p>
    ${auto ? '' : `<div class="crow"><span>최소</span><input id="rMin" type="range" min="0" max="100" step="1" value="${T.rng.min}"><b id="rMinV">${T.rng.min} m</b></div>
    <div class="crow"><span>최대</span><input id="rMax" type="range" min="0" max="100" step="1" value="${T.rng.max}"><b id="rMaxV">${T.rng.max} m</b></div>`}
    ${G.research.range3 ? `<div class="row"><span>효율 문턱<br><small class="muted">최고 데미지의 ${Math.round(EFF_MIN*100)}%보다 약하면 건너뜀</small></span><button class="btn" type="button" data-act="rngEff" aria-pressed="${!!T.rng.eff}">${T.rng.eff ? '켜짐' : '꺼짐'}</button></div>` : ''}
  </div>`;
}
document.addEventListener('click', ev => {
  const b = ev.target.closest('button'); if (!b) return;
  const a = b.dataset.act, so = G.sel != null ? SOCKETS[G.sel] : null, T = so && so.tower;
  if (a === 'exam' && b.dataset.exam === 'range'){ ev.stopPropagation(); exam = rangeQs().map(q => ({q:q.q, a:q.a, opts:[q.a, ...q.w].sort(() => Math.random() - .5), pick:null})); exam.kind = 'range'; renderAll(); return; }
  if (a === 'exam'){ setTimeout(() => { if (exam && !exam.kind) exam.kind = 'laser'; renderAll(); }, 0); return; }
  if (a === 'examSubmit' && exam && exam.kind === 'range'){
    ev.stopPropagation(); const bad = exam.filter(q => q.opts[q.pick] !== q.a).length;
    if (!bad){ G.exams = G.exams || {}; G.exams.range = true; hint('자격 시험 통과! 이제 교전 범위 모듈을 연구할 수 있어요'); } else hint(`${bad}문제 틀렸어요 · 숫자를 바꿔서 다시 도전해요`);
    exam = null; renderAll(); return;
  }
  if (!T) return;
  if (a === 'buyRange'){ ev.stopPropagation(); if (G.gold < RANGE_PRICE || T.rng) return; G.gold -= RANGE_PRICE; const bd = band(T.design); T.rng = {min:bd ? Math.max(0, bd[0] - 2) : 0, max:bd ? Math.min(100, bd[1] + 2) : 60, auto:false, eff:false}; hint(`교전 범위 모듈을 달았어요 · ${T.rng.min}–${T.rng.max} m`); buildPreview(); renderAll(); }
  else if (a === 'rngAuto'){ ev.stopPropagation(); T.rng.auto = !T.rng.auto; buildPreview(); renderAll(); }
  else if (a === 'rngEff'){ ev.stopPropagation(); T.rng.eff = !T.rng.eff; renderAll(); }
}, true);
document.addEventListener('input', ev => {
  const t = ev.target; if (!t || (t.id !== 'rMin' && t.id !== 'rMax')) return;
  const T = G.sel != null && SOCKETS[G.sel] && SOCKETS[G.sel].tower; if (!T || !T.rng) return;
  let v = +t.value;
  if (t.id === 'rMin'){ v = Math.min(v, T.rng.max - 2); T.rng.min = v; } else { v = Math.max(v, T.rng.min + 2); T.rng.max = v; }
  t.value = v; const lb = $(t.id + 'V'); if (lb) lb.textContent = `${v} m`;
  const [lo, hi] = rangeOf(T), sel = $('rngSel'), rv = $('rngV');
  if (sel){ sel.style.left = `${lo}%`; sel.style.width = `${hi - lo}%`; } if (rv) rv.textContent = `${Math.round(lo)}–${Math.round(hi)} m`;
  buildPreview();
});
/* 바닥 표시: 고른 탑의 교전 범위 양 끝에 주황 선 */
const _buildPreview9 = window.buildPreview;
window.buildPreview = function(){
  _buildPreview9();
  if (G.mode !== 'place' || G.sel == null) return;
  const so = SOCKETS[G.sel], T = so && so.tower; if (!T || !T.rng) return;
  const [lo, hi] = rangeOf(T), mat = new THREE.MeshBasicMaterial({color:0xff8a3d, transparent:true, opacity:.9, depthWrite:false, fog:false});
  for (const m of [lo, hi]){ const bar = new THREE.Mesh(new THREE.BoxGeometry(4.2, .06, .22), mat); bar.position.set(so.x, .09, dToZ(clamp(m, 0, 100))); previewGroup.add(bar); }
  const l = label(['쏘는 범위', `${Math.round(lo)}–${Math.round(hi)} m`], {size:20, color:'#1a0d04', sub:'#3b2716', bg:'rgba(255,170,90,.95)', h:.026}); l.position.set(so.x + 3, 1.2, dToZ(clamp(hi, 0, 100))); previewGroup.add(l);
};

/* 연구 · 제작 페이지도 누르는 동안은 다시 그리지 않는다 */
const _paintPage10 = window.paintPage;
window.paintPage = function(){ const pg = $('page'); if (!pg.hidden && UI.page && pg.dataset.id === UI.page && guard(pg)) return; _paintPage10.apply(this, arguments); };

/* ── 떠 있는 카드는 덜 움직인다: 주인공이 걸어가며 카메라가 따라가도, 물건이 크게(160px) 움직이거나 화면 밖으로 나가기 전까지
      카드는 제자리. 누르고 있는 동안은 아예 안 움직인다 (움직이는 단추는 누르기 어렵다). 표지판은 물건에 붙어 있으니 그대로 따라간다 ── */
const _placeCard10 = placeCard;
window.placeCard = function(c){
  const p = c.el, isSign = p.classList.contains('sign'), anchored = typeof c.at === 'function';
  if (!anchored || isSign || p.classList.contains('sheet')) return _placeCard10(c);
  if (UI.pressEl && p.contains(UI.pressEl) && p.style.visibility === 'visible') return;
  const v = c.at(); let ax = null, ay = null;
  if (v){ const q = v.clone().project(camera); ax = (q.x + 1)/2*stage.clientWidth; ay = (1 - q.y)/2*stage.clientHeight; }
  const fits = st => st && parseFloat(st.left) + p.offsetWidth <= stage.clientWidth - 4 && parseFloat(st.top) + p.offsetHeight <= stage.clientHeight - 4 && parseFloat(st.left) >= 0 && parseFloat(st.top) >= 0;   // 내용이 커져서 화면 밖으로 나가면 다시 놓는다
  if (c.stick && v && p.style.visibility === 'visible' && fits(c.stick) && Math.hypot(ax - c.stick.ax, ay - c.stick.ay) < 160 && ax > 0 && ax < stage.clientWidth && ay > 0 && ay < stage.clientHeight){
    p.style.left = c.stick.left; p.style.top = c.stick.top; return;
  }
  _placeCard10(c);
  c.stick = v && p.style.visibility === 'visible' ? {ax, ay, left:p.style.left, top:p.style.top} : null;
};
/* 탑 자리 카드: 주인공이 걸어가는 동안 카메라가 움직여서 카드가 따라 미끄러졌다 → 탑 반대쪽 가장자리에 고정 */
const _paintPop11 = paintPop;
window.paintPop = function(key, at, h, noX, opts = {}){
  if (key === 'sock' && typeof at === 'function'){
    const c = CARDS.get('sock'); let side = c && c.sockSide && c.sockSel === G.sel ? c.sockSide : null;
    if (!side){ const v = at(), q = v ? v.clone().project(camera) : null; side = q && q.x < 0 ? 'right' : 'left'; }
    _paintPop11(key, {fixed:side}, h, noX, opts);
    const c2 = CARDS.get('sock'); if (c2){ c2.sockSide = side; c2.sockSel = G.sel; }
    return;
  }
  return _paintPop11(key, at, h, noX, opts);
};
