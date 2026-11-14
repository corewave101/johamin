'use strict';
/* ═════════ 패널 ═════════ */
function vsHtml(d, dist){
  return `<div class="vs">${Object.entries(FOES).map(([id, f]) => { const r = hitD(d, f, dist, id === 'kn' ? 90 : null); return `<div><small>${f.short}</small><b class="${r.v ? '' : 'zero'}">${r.v ? Math.round(r.v) : r.why === 'E < W' ? 'E&lt;W' : r.why === '편광 차단' ? '차단' : '0'}</b></div>`; }).join('')}</div>`;
}
const bandHtml = d => { const b = band(d); return b ? `가장 센 구간 <b>${b[0]}–${b[1]} m</b>` : '빛이 모이지 않음 · 가까울수록 셈'; };
function recordsHtml(){
  return `<div class="sec"><h2>기록</h2><div class="rows">
    <div class="row"><span>최고 방어 밤</span><b>${G.best.wave}</b></div>
    <div class="row"><span>최고 초당 데미지</span><b>${G.best.dps.toFixed(1)}</b></div>
    <div class="row"><span>토벌 최고 수확</span><b>${G.best.sortie}G</b></div></div>
    <p class="muted">이 기기에만 저장돼요. 학교 계정 로그인을 붙이면 Supabase 랭킹으로 올릴 자리예요.</p></div>`;
}
function placePanel(){
  let h = '';
  if (G.sel == null){
    const next = [3, 2, 1].find(f => !built(f));
    h = `<div class="sec"><div class="ed-head"><h3>성벽</h3><span>${builtFloors().map(f => FLOORS[f].name).join(' · ')}</span></div>
      <p class="muted">주황 고리를 누르면 주인공이 그 자리로 가요. 다른 층은 성벽 양 끝 계단으로 오르내려요.</p>
      <div class="rows"><div class="row"><span>창고의 탑</span><b>${G.inventory.filter(i => i.design.kind === 'tower').length}개</b></div><div class="row"><span>성벽</span><b>${G.wallHp} / ${wallMax()}</b></div></div>
      <h2>증축</h2>
      ${next ? `<button class="btn primary" type="button" data-build="${next}" ${G.gold >= FLOOR_COST[next] ? '' : 'disabled'}>${FLOORS[next].name} 증축 · ${FLOOR_COST[next]}G</button><p class="muted">층마다 탑 자리 4개가 생겨요. 낮은 층일수록 적과 가까워요.</p>` : '<p class="muted">1층까지 다 지었어요.</p>'}
      <button class="btn" type="button" data-act="night">밤 시작 · 웨이브 ${G.wave}</button></div>` + upgradeSec('wall', '성벽 업그레이드');
  } else {
    const so = SOCKETS[G.sel], here = atSocket(G.sel);
    if (so.tower){
      const T = so.tower, d = T.design, idle = G.soldiers.filter(s => s.role === 'idle' && !s.down), op = G.soldiers.find(s => s.id === T.soldier);
      h = `<div class="sec"><div class="ed-head"><h3>${sockName(so)} · ${d.name}</h3><span class="${here?'go':''}">${here ? '도착' : '이동 중…'}</span></div>
        <div class="bp-f">${formula(d)}</div><div class="band">${bandHtml(d)}</div>
        <p class="muted">강 가운데(44 m)에서 적별 초당 데미지 · 기사는 갑옷 90°</p>${vsHtml(d, 44)}
        <h2>누가 쏘나요?</h2>
        <div class="rows">
          <div class="row"><span>직접 탑승</span><b>밤에 탑 근처에서 탑승 · 발사비만</b></div>
          <div class="row"><span>쫄병 조종 (조준 ${Math.round(soldierAcc()*100)}%)</span>${op ? `<button class="btn" type="button" data-unassign="${so.i}">${op.name} 빼기</button>` : `<button class="btn" type="button" data-assign="${so.i}" ${idle.length ? '' : 'disabled'}>${idle.length ? `${idle[0].name} 맡기기` : '대기 쫄병 없음'}</button>`}</div>
          <div class="row"><span>자동 조준 모듈</span>${T.auto ? `<button class="btn" type="button" data-act="${T.autoOn ? 'autoOff' : 'autoOn'}">${T.autoOn ? '켜짐 · 끄기' : '꺼짐 · 켜기'}</button>` : `<button class="btn" type="button" data-act="buyAuto" ${G.gold >= AUTO_PRICE ? '' : 'disabled'}>달기 · ${AUTO_PRICE}G</button>`}</div>
        </div>
        <p class="muted">쏠 때마다 ${drawOf(d).toFixed(2)} ⚡/초. 자동은 유지비 ${autoUpkeep().toFixed(2)} ⚡/초가 더 들어요. 쫄병이 있으면 쫄병이 먼저 쏴요.</p>
        <button class="btn danger" type="button" data-act="unplace" ${here ? '' : 'disabled'}>창고로 내리기</button></div>`;
    } else {
      const items = G.inventory.filter(i => i.design.kind === 'tower');
      h = `<div class="sec"><div class="ed-head"><h3>${sockName(so)} 자리</h3><span class="${here?'go':''}">${here ? '도착' : '이동 중…'}</span></div>
        ${items.length ? `<p class="muted">창고에 있는 탑을 올려요. 카드를 누르면 바닥에 세기 띠가 보여요.</p><div class="bps">${items.map(it => { const d = it.design;
          return `<div class="bp ${G.previewUid===it.uid?'on':''}" data-prev="${it.uid}" role="button" tabindex="0"><div class="bp-h"><i style="background:${beamColor(d)}"></i><b>${d.name}</b></div>
            <div class="bp-f">${formula(d)}</div><div class="band">${bandHtml(d)}</div>${vsHtml(d, 44)}
            <div class="btns"><button class="btn" type="button" data-place="${it.uid}" ${here ? '' : 'disabled'}>${here ? '설치' : '도착하면 설치'}</button><button class="btn primary" type="button" data-place="${it.uid}" data-auto="1" ${here && G.gold >= AUTO_PRICE ? '' : 'disabled'}>설치 + 자동 · ${AUTO_PRICE}G</button></div></div>`; }).join('')}</div>`
          : '<p class="muted">창고에 탑이 없어요. 대장간 제작부에서 탑을 만들면 밤이 지난 뒤 여기 올릴 수 있어요.</p>'}</div>`;
    }
  }
  $('panel').innerHTML = h;
}
function wavePanel(){
  const near = nearSockets().filter(q => q.tower), ns = near[0];
  $('panel').innerHTML = `
    <div class="sec"><div class="ed-head"><h3>밤 ${G.wave}</h3><span id="wLeft"></span></div>
      <div class="eq" id="wEn"></div>
      <p class="muted">${G.ride ? '탑 시점이에요. 왼쪽 조이스틱 좌우로 탑을 돌리고, 위아래로 겨누는 거리를 바꿔요. 오른쪽 발사 버튼을 누르고 있을 때만 쏘고 전기를 써요.' : '조이스틱 좌우로 움직이고, 위아래로 시선 거리를 바꿔요(성벽 바로 앞도 보여요). 성벽 끝 계단에서 위아래로 밀면 층을 옮겨요. 화면을 누르고 있으면 그 지점으로 쏘고, 떼면 가까운 적을 자동으로 쏴요.'}</p>
      <div class="seg"><button type="button" data-act="third" aria-pressed="${G.view==='third'}">3인칭</button><button type="button" data-act="first" aria-pressed="${G.view==='first'}">1인칭</button></div>
      ${G.ride ? '' : `<button class="btn primary" type="button" data-act="ride" ${ns ? `data-ride="${ns.i}"` : 'disabled'}>${ns ? `${sockName(ns)} 탑승` : '같은 층 탑 가까이 가면 탑승'}</button>`}
    </div>
    ${G.sortie && G.sortie.auto ? `<div class="sec"><h2>토벌대 출병 중</h2><p class="muted">탑은 꺼져 있어요. 절반이 쓰러지면 알아서 돌아와요.</p><button class="btn" type="button" data-act="retreat">토벌대 퇴각</button></div>` : ''}
    ${G.ride || G.sortie ? '' : `<div class="sec"><h2>토벌 · 밤마다 1번</h2>
      ${G.sortieResult ? `<div class="rows"><div class="row"><span>이번 토벌</span><b>+${G.sortieResult.got}G · ${({retreat:'퇴각 · 보존', fall:'쓰러짐 · 절반', clear:'끝까지', lost:'성벽 함락'})[G.sortieResult.how]}</b></div></div>` : ''}
      <button class="btn" type="button" data-act="sortie" ${G.sortieUsed ? 'disabled' : ''}>${G.sortieUsed ? '이번 밤 토벌은 끝났어요' : `성문 열고 토벌 · 쫄병 ${G.soldiers.filter(s => s.role === 'sortie' && !s.down).length}명 동행`}</button>
      <p class="muted">나가 있는 동안 탑은 아군 오사 방지로 전부 꺼져요. 퇴각은 어디서든 바로 되고, 모은 결정은 그대로 남아요. 훈련소에서 자동 출병을 켤 수도 있어요.</p></div>`}
    <div class="sec"><h2>주인공 무기</h2><div class="bp-f">${G.weapon.name} · ${formula(G.weapon)}</div><div class="band">${bandHtml(G.weapon)} · 휴대용 ×${weaponScale().toFixed(2)}</div></div>`;
  renderLive();
}
function renderLive(){
  const en = $('wEn');
  if (en){ const auto = SOCKETS.filter(q => q.tower && q.tower.auto && q.tower.autoOn && q.tower.soldier == null).length, sold = SOCKETS.filter(q => q.tower && q.tower.soldier != null).length;
    en.innerHTML = `배터리 <b>${Math.floor(G.energy)} / ${batteryCap()}</b> ⚡ · 밤엔 충전 안 돼요<br>자동 탑 ${auto}대 · 쫄병 탑 ${sold}대`; }
  const n = $('wLeft'); if (n) n.textContent = `처치 ${G.kills}/${G.total}`;
  const rl = $('rideLive');
  if (rl && G.ride){
    const so = SOCKETS[G.ride.sock], d = so.tower.design, e = G.ride.target;
    if (!e) rl.innerHTML = `조준 거리 ${Math.round(G.ride.aimD)} m · ${G.ride.firing || G.keys[' '] ? '발사 중' : '발사 버튼을 누르고 있으면 쏴요'}`;
    else {
      const oo = towerOrigin(so), dist = Math.hypot(e.mesh.position.x - oo.x, e.mesh.position.z - oo.z)/M2W, th = hasPol(d) ? G.ride.theta : null, r = hitD(d, FOES[e.type], dist, e.armor, th), tr = traceD(d, dist, th);
      rl.innerHTML = `${FOES[e.type].name}${e.armor != null ? ` · 갑옷 ${e.armor}°` : ''} @ ${Math.round(dist)} m<br>` +
        (e.armor != null ? `편광 ${tr.t.toFixed(2)} × ${tr.pol == null ? '자연광 ½' : `cos²(${tr.pol}° − ${e.armor}°)`} = <b>${(tr.t*(tr.pol == null ? .5 : cos2(tr.pol - e.armor))).toFixed(2)}</b><br>` : '') +
        (r.v ? `I ${r.Itot.toFixed(3)} mA · V₀ ${r.V0.toFixed(2)} V · ${r.sat ? '<span class="gold">전압 포화</span>' : '전류 제한'}<br>초당 <b class="ok">${r.v.toFixed(1)}</b>` : `<span class="warn">0 · ${r.why}</span>`);
    }
  }
  const sl = $('sLive'); if (sl && G.sortie) sl.innerHTML = `체력 <b>${Math.max(0, G.sortie.hp)} / ${G.sortie.max}</b> · 쫄병 ${G.sortie.squad.filter(u => !u.down).length}/${G.sortie.squad.length}<br>광자 결정 <b class="gold">${G.sortie.gold}G</b> · 바닥에 ${G.sortie.drops.length}개<br>남은 적 <b>${G.enemies.length + G.queue.length}</b>`;
}
function drawDial(){
  const c = $('dial'); if (!c || !G.ride) return;
  const g = c.getContext('2d'), s = 144, r = 58; g.clearRect(0, 0, s, s);
  g.strokeStyle = '#26324d'; g.lineWidth = 6; g.beginPath(); g.arc(s/2, s/2, r, 0, Math.PI*2); g.stroke();
  const ang = rad(G.ride.theta), dx = Math.sin(ang)*r, dy = -Math.cos(ang)*r;
  g.strokeStyle = '#ffd166'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.moveTo(s/2 - dx, s/2 - dy); g.lineTo(s/2 + dx, s/2 + dy); g.stroke();
  const e = G.ride.target;
  if (e && e.armor != null){ const a = rad(e.armor), ax = Math.sin(a)*r*.75, ay = -Math.cos(a)*r*.75; g.strokeStyle = 'rgba(157,180,255,.8)'; g.lineWidth = 3; g.setLineDash([6, 5]); g.beginPath(); g.moveTo(s/2 - ax, s/2 - ay); g.lineTo(s/2 + ax, s/2 + ay); g.stroke(); g.setLineDash([]); }
}
function renderDialbox(){
  const box = $('dialbox');
  if (!(G.mode === 'wave' && G.ride)){ box.hidden = true; box.innerHTML = ''; return; }
  const so = SOCKETS[G.ride.sock], d = so.tower.design, pol = hasPol(d);
  box.hidden = false;
  box.innerHTML = `<h3>${sockName(so)} 탑승 · ${d.name}<button class="rm" type="button" data-act="unride">내리기</button></h3>
    ${pol ? `<div class="dial"><canvas id="dial" width="144" height="144"></canvas><div class="range"><label for="sPol">편광판 투과축 <b id="vPol">${G.ride.theta}°</b></label><input id="sPol" type="range" min="0" max="180" step="5" value="${G.ride.theta}"></div></div>` : `<p class="muted">이 탑에는 편광판이 없어서 돌릴 게 없어요.</p>`}
    <div class="eq" id="rideLive">왼쪽 조이스틱으로 겨누고 발사 버튼을 눌러요</div>`;
  drawDial(); renderLive();
}
function clearedPanel(){
  const R = G.report || {};
  $('panel').innerHTML = `<div class="sec"><div class="ed-head"><h3>밤 ${R.wave} 방어 성공</h3><span>날이 밝았어요</span></div>
    <div class="rows"><div class="row"><span>이번 밤 수입</span><b>+${R.gold}G</b></div><div class="row"><span>방어 보너스 (포함)</span><b>+${R.bonus}G</b></div>
    ${R.sortie ? `<div class="row"><span>${R.sortie.auto ? '자동 출병 수확' : '토벌 수확'} (포함)</span><b>+${R.sortie.got}G</b></div>` : `<div class="row"><span>토벌</span><b>안 나감</b></div>`}
    <div class="row"><span>낮 동안 태양광 충전</span><b>+${R.charged} ⚡</b></div>
    <div class="row"><span>제작 완료</span><b>${R.crafted && R.crafted.length ? R.crafted.join(', ') : '없음'}</b></div>
    <div class="row"><span>성벽</span><b>${G.wallHp} / ${wallMax()}</b></div></div>
    <button class="btn primary" type="button" data-act="toMap">지도로 · ${G.wave}일째 낮</button><p class="muted">자동 저장했어요.</p></div>` + recordsHtml();
}
function sortiePanel(){
  $('panel').innerHTML = `<div class="sec"><div class="ed-head"><h3>성문 밖 토벌 · 밤 ${G.wave}</h3></div>
    <div class="eq" id="sLive"></div>
    <button class="btn primary" type="button" data-act="retreat">퇴각 · 바로 성으로</button>
    <p class="muted">퇴각하면 어디에 있든 바로 돌아오고 주운 결정은 전부 남아요. 쓰러지면 절반만 남아요. 탑은 지금 꺼져 있어요.</p>
    <p class="muted">조이스틱으로 움직여요(키보드 WASD). 화면을 누르면 그 지점으로 쏘고, 떼면 가까운 적을 자동으로 쏴요. 쫄병은 따라오면서 쏘는데 자주 빗나가요.</p></div>`;
  renderLive();
}
function overPanel(){ $('panel').innerHTML = `<div class="sec"><div class="ed-head"><h3>성벽 함락</h3></div><p class="muted">밤 ${G.wave}에 무너졌어요.</p><button class="btn primary" type="button" data-act="restart">처음부터 다시</button></div>` + recordsHtml(); }
function settingsPanel(){
  const row = (key, lab, opts) => `<div class="setrow"><span>${lab}</span><div class="seg">${opts.map(([v, t]) => `<button type="button" data-set="${key}:${v}" aria-pressed="${String(G.settings[key]) === String(v)}">${t}</button>`).join('')}</div></div>`;
  $('panel').innerHTML = `<div class="sec"><div class="ed-head"><h3>설정</h3><button class="rm" type="button" data-act="closeSettings" style="color:var(--ink)">닫기</button></div>
    ${row('stick', '조이스틱', [['fixed', '고정'], ['float', '누른 곳에서 시작']])}
    ${row('side', '조이스틱 위치', [['left', '왼쪽'], ['right', '오른쪽']])}
    ${row('size', '조이스틱 크기', [['s', '작게'], ['m', '보통'], ['l', '크게']])}
    ${row('autoClose', '밤이 되면 창 닫기', [['true', '켜기'], ['false', '끄기']])}
    ${row('dmgText', '피해 · 보상 글자', [['true', '보이기'], ['false', '숨기기']])}
    ${row('sens', '탑 조준 감도', [['s', '낮게'], ['m', '보통'], ['l', '높게']])}
    ${row('gfx', '그래픽 (그림자)', [['auto', '자동'], ['high', '높게'], ['low', '낮게']])}
    ${row('hard', '문제 난이도', [['false', '보통 · 특수각'], ['true', '하드 · 덧셈정리']])}
    <p class="muted">설정과 진행은 이 기기(브라우저)에만 저장돼요. 낮마다 자동 저장되고, 밤 도중에 꺼지면 그날 낮으로 돌아와요.</p>
    <button class="btn danger" type="button" data-act="${G.confirmReset ? 'resetYes' : 'resetAsk'}">${G.confirmReset ? '정말 지울까요? 한 번 더 누르면 처음부터' : '저장 지우고 처음부터'}</button><p class="muted">피직스 캐슬 v1.0.0</p></div>`;
}
const STICK_PX = {s:108, m:132, l:164};
function applySettings(){
  const st = $('stick'), px = STICK_PX[G.settings.size] || 132;
  st.style.width = st.style.height = `${px}px`;
  st.classList.toggle('right', G.settings.side === 'right');
  st.classList.toggle('float', G.settings.stick === 'float');
  $('fireBtn').classList.toggle('left', G.settings.side === 'right');
  st.querySelector('small').textContent = G.ride ? '조준' : (G.mode === 'wave' ? '이동 · 시선' : '이동');
  if (G.settings.stick === 'fixed'){ st.style.left = st.style.top = st.style.right = st.style.bottom = ''; }
}
function renderTabs(){
  let h = '';
  const m = G.mode;
  if (m === 'map') h = `<button class="tbtn" type="button" data-act="goHome">← 조하민</button>`;
  else if (m === 'forge' || m === 'train' || m === 'solar' || m === 'dress') h = `<button class="tbtn" type="button" data-act="toMap">← 지도</button>`;
  else if (m === 'place') h = `<button class="tbtn" type="button" data-act="toMap">← 지도</button><button class="tbtn" type="button" data-act="placeView">${G.placeView === 'follow' ? '전체 보기' : '주인공 시점'}</button><button class="tbtn go" type="button" data-act="night">밤 시작</button>`;
  else if (m === 'wave'){
    if (G.ride) h = `<button class="tbtn" type="button" data-act="unride">내리기</button>`;
    else {
      h = nearSockets().filter(q => q.tower).map(q => `<button class="tbtn go" type="button" data-act="ride" data-ride="${q.i}">${sockName(q)} 탑승</button>`).join('');
      if (inStairs() && !H().climb){ const u = nextFloor(H().floor, 1), dn = nextFloor(H().floor, -1); if (u) h += `<button class="tbtn" type="button" data-act="floorUp">▲ ${FLOORS[u].name}</button>`; if (dn) h += `<button class="tbtn" type="button" data-act="floorDown">▼ ${FLOORS[dn].name}</button>`; }
      h += `<button class="tbtn" type="button" data-act="${G.view === 'third' ? 'first' : 'third'}">${G.view === 'third' ? '1인칭' : '3인칭'}</button>` + (G.sortie && G.sortie.auto ? `<button class="tbtn go" type="button" data-act="retreat">토벌대 퇴각</button>` : G.sortieUsed ? '' : `<button class="tbtn go" type="button" data-act="sortie">성문 열고 토벌</button>`);
    }
  } else if (m === 'sortie') h = `<button class="tbtn go" type="button" data-act="retreat">퇴각</button>`;
  if (m !== 'over' && m !== 'build') h += `<button class="tbtn" type="button" data-act="win" aria-pressed="${G.winOpen}">${G.winOpen ? '창 닫기' : '창 열기'}</button><button class="tbtn" type="button" data-act="settings" aria-pressed="${G.showSettings}">설정</button>`;
  $('tabs').innerHTML = h;
}
function renderHud(){ $('hGold').textContent = G.gold; $('hWall').textContent = `${Math.max(0, G.wallHp)}/${wallMax()}`; $('hWave').textContent = ['map','forge','place','cleared','build','train','solar','dress'].includes(G.mode) ? `${G.wave}일째 낮` : `밤 ${G.wave}`; $('hEn').textContent = `${Math.floor(G.energy)}/${batteryCap()}`; }
let floatPid = null, floatC = null;
function renderAll(){
  renderHud(); renderTabs(); renderMap();
  if (G.showSettings && G.mode !== 'over' && G.mode !== 'build'){ G.winOpen = true; settingsPanel(); }
  else ({map:mapPanel, forge:forgePanel, place:placePanel, wave:wavePanel, cleared:clearedPanel, sortie:sortiePanel, over:overPanel, build:() => {}, train:trainPanel, solar:solarPanel, dress:dressPanel})[G.mode]();
  renderParts();
  $('cross').hidden = !(G.mode === 'wave' && G.view === 'first' && !G.ride);
  $('panel').hidden = !G.winOpen || G.mode === 'over' || G.mode === 'build';
  stage.classList.toggle('winopen', G.winOpen && G.mode !== 'over' && G.mode !== 'build');
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
}

/* ═════════ 입력 ═════════ */
const groundPlane = new THREE.Plane(V(0, 1, 0), 0);
let wPtr = null;
function moveInput(){
  let mx = G.stick.x, mz = G.stick.y; const k = G.keys;
  if (k.a || k.arrowleft) mx -= 1; if (k.d || k.arrowright) mx += 1;
  if (k.w || k.arrowup) mz -= 1; if (k.s || k.arrowdown) mz += 1;
  return [mx, mz];
}
function inStickZone(ev){ const r = stage.getBoundingClientRect(), fx = (ev.clientX - r.left)/r.width, fy = (ev.clientY - r.top)/r.height; return fy > .35 && (G.settings.side === 'left' ? fx < .42 : fx > .58); }
function stickVec(cx, cy, R, ev){
  let dx = ev.clientX - cx, dy = ev.clientY - cy; const l = Math.hypot(dx, dy); if (l > R){ dx *= R/l; dy *= R/l; }
  $('stickKnob').style.transform = `translate(${dx}px, ${dy}px)`; G.stick.x = dx/R; G.stick.y = dy/R;
  if (Math.hypot(G.stick.x, G.stick.y) < .12){ G.stick.x = 0; G.stick.y = 0; }
}
function floatEnd(){ floatPid = null; floatC = null; G.stick.x = 0; G.stick.y = 0; $('stickKnob').style.transform = ''; if (G.settings.stick === 'float') $('stick').hidden = true; }
function startAim(){ const p = new THREE.Vector3(); if (ray.ray.intersectPlane(groundPlane, p) && p.z < -1.4){ G.aim = p; G.aimHeld = true; wPtr.aiming = true; } }
function wDown(ev){
  const moving = G.mode === 'wave' || G.mode === 'sortie';
  if (moving && G.settings.stick === 'float' && floatPid == null && inStickZone(ev)){
    floatPid = ev.pointerId; const r = stage.getBoundingClientRect(), px = STICK_PX[G.settings.size] || 132, st = $('stick');
    floatC = {x:ev.clientX, y:ev.clientY, R:px/2 - 14};
    st.style.left = `${ev.clientX - r.left - px/2}px`; st.style.top = `${ev.clientY - r.top - px/2}px`; st.style.right = 'auto'; st.style.bottom = 'auto';
    st.hidden = false; $('stickKnob').style.transform = ''; return;
  }
  setRay(ev); wPtr = {x:ev.clientX, y:ev.clientY, aiming:false, id:ev.pointerId};
  if ((G.mode === 'wave' && !G.ride) || G.mode === 'sortie') startAim();
}
function wMove(ev){
  if (ev.pointerId === floatPid){ stickVec(floatC.x, floatC.y, floatC.R, ev); return; }
  if (!wPtr || ev.pointerId !== wPtr.id || !wPtr.aiming) return;
  setRay(ev); const p = new THREE.Vector3(); if (ray.ray.intersectPlane(groundPlane, p) && p.z < -1.4) G.aim = p;
}
function wUp(ev){
  if (ev.pointerId === floatPid){ floatEnd(); return; }
  if (!wPtr || ev.pointerId !== wPtr.id) return;
  const tap = Math.hypot(ev.clientX - wPtr.x, ev.clientY - wPtr.y) < 8, aiming = wPtr.aiming; wPtr = null;
  G.aimHeld = false; if (aiming && !G.ride) G.aim = null;
  if (aiming || !tap || (G.mode !== 'place' && G.mode !== 'cleared')) return;
  setRay(ev);
  const objs = sockPicks.filter(q => built(q.userData.sock.floor)).concat(SOCKETS.filter(s => s.tower).map(s => s.tower.mesh));
  const h = ray.intersectObjects(objs, true)[0];
  if (h){ let o = h.object; while (o && !o.userData.sock) o = o.parent; if (o){ selectSocket(o.userData.sock.i); return; } }
  const w = ray.intersectObjects(walkways.filter(m => built(m.userData.floor)))[0];
  if (w){ goTo(w.point.x, w.object.userData.floor); G.sel = null; buildPreview(); renderAll(); }
}
canvas.addEventListener('pointerdown', ev => { canvas.setPointerCapture(ev.pointerId); if (G.mode === 'forge') fDown(ev); else if (G.mode === 'train') tDown(ev); else if (G.mode === 'dress') dDown(ev); else if (G.mode === 'solar') sTap(ev); else if (G.mode !== 'map' && G.mode !== 'build') wDown(ev); });
canvas.addEventListener('pointermove', ev => { if (G.mode === 'forge'){ if (!(fDrag && fDrag.card)) fMove(ev); } else if (G.mode === 'train') tMove(ev); else if (G.mode === 'dress') dMove(ev); else wMove(ev); });
canvas.addEventListener('pointerup', ev => { if (G.mode === 'forge'){ if (!(fDrag && fDrag.card)) fUp(ev); } else if (G.mode === 'train') tUp(ev); else if (G.mode === 'dress') dUp(ev); else wUp(ev); });
canvas.addEventListener('pointercancel', ev => { if (ev.pointerId === floatPid){ floatEnd(); return; } if (!(fDrag && fDrag.card)) fCancel(); wPtr = null; G.aimHeld = false; if (!G.ride) G.aim = null; });
// 사이드바 카드 끌기
$('parts').addEventListener('pointerdown', ev => { const c = ev.target.closest('.pcard'); if (!c || G.mode !== 'forge') return; ev.preventDefault(); startCardDrag(c, ev); });
window.addEventListener('pointermove', ev => { if (fDrag && fDrag.card && ev.pointerId === fDrag.pid) fMove(ev); });
window.addEventListener('pointerup', ev => { if (fDrag && fDrag.card && ev.pointerId === fDrag.pid) fUp(ev); });
window.addEventListener('pointercancel', ev => { if (fDrag && fDrag.card && ev.pointerId === fDrag.pid) fCancel(); });
window.addEventListener('keydown', ev => { if (ev.target.tagName !== 'INPUT' && ev.target.tagName !== 'SELECT') G.keys[ev.key.toLowerCase()] = true; });
window.addEventListener('keyup', ev => { G.keys[ev.key.toLowerCase()] = false; });
window.addEventListener('blur', () => { G.keys = {}; if (G.ride) G.ride.firing = false; });
window.addEventListener('keydown', ev => { if (ev.key === ' ' && G.mode === 'wave' && G.ride && ev.target.tagName !== 'INPUT') ev.preventDefault(); });
{
  const fb = $('fireBtn'); let fid = null;
  const off = () => { fid = null; fb.classList.remove('on'); if (G.ride) G.ride.firing = false; };
  fb.addEventListener('pointerdown', ev => { if (!G.ride) return; fid = ev.pointerId; fb.setPointerCapture(fid); G.ride.firing = true; fb.classList.add('on'); ev.preventDefault(); });
  fb.addEventListener('pointerup', off); fb.addEventListener('pointercancel', off); fb.addEventListener('lostpointercapture', off);
  fb.addEventListener('contextmenu', ev => ev.preventDefault());
}
{
  const st = $('stick'), knob = $('stickKnob'); let sid = null;
  const upd = ev => { const r = st.getBoundingClientRect(); stickVec(r.left + r.width/2, r.top + r.height/2, r.width/2 - 14, ev); };
  const end = () => { sid = null; knob.style.transform = ''; G.stick.x = 0; G.stick.y = 0; };
  st.addEventListener('pointerdown', ev => { if (G.settings.stick !== 'fixed') return; sid = ev.pointerId; st.setPointerCapture(sid); upd(ev); ev.preventDefault(); });
  st.addEventListener('pointermove', ev => { if (ev.pointerId === sid) upd(ev); });
  st.addEventListener('pointerup', end); st.addEventListener('pointercancel', end);
}
$('map').addEventListener('click', ev => {
  const g = ev.target.closest('.mp'); if (!g) return;
  const go = g.dataset.go;
  if (go === 'forge'){ enterForge(G.dept); }
  else if (go === 'wall'){ G.mode = 'place'; G.sel = null; G.winOpen = true; G.showSettings = false; renderAll(); hint('성벽이에요 · 주황 고리를 눌러 탑을 올려요'); }
  else if (go === 'train'){ G.mode = 'train'; G.winOpen = true; G.showSettings = false; tSync(); renderAll(); hint('연병장이에요 · 쫄병을 끌어서 깃발 뒤에 세우면 토벌 대형이 돼요'); }
  else if (go === 'solar'){ G.mode = 'solar'; G.winOpen = true; G.showSettings = false; sSync(); renderAll(); hint('광전 연구소예요 · 실험대에서 광전 효과를 재고, 연구 탭에서 해금해요'); }
});
$('map').addEventListener('keydown', ev => { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.closest('.mp')){ ev.preventDefault(); ev.target.closest('.mp').dispatchEvent(new MouseEvent('click', {bubbles:true})); } });
function enterForge(dept){
  G.mode = 'forge'; G.dept = DEPTS.some(q => q[0] === dept) ? dept : 'design'; G.winOpen = true; G.showSettings = false; G.building = null;
  if (G.learn && !F.learn) loadProblem(); fSync(); renderAll();
  hint(G.dept === 'research' ? '연구로 성능 한계를 올려요' : G.dept === 'craft' ? '설계도를 골라 제작을 시작해요 · 밤이 지나면 완성' : G.dept === 'test' ? '실험부: m 단위 사격장에서 표적에 쏴 봐요' : G.learn ? '문제를 읽고 계산해서 값을 넣어요' : '설계부: 부품함 카드를 끌어다 경통(cm) 안에 놓아요');
}

/* ═════════ 버튼 ═════════ */
document.addEventListener('click', ev => {
  const b = ev.target.closest('button, .bp'); if (!b) return;
  const a = b.dataset.act, ds = b.dataset;
  if (ds.dept){ G.dept = ds.dept; if ((G.dept === 'design' || G.dept === 'test') && G.learn && !F.learn) loadProblem(); fSync(); renderAll(); return; }
  if (ds.fbar){ setBarrel(+ds.fbar); F.sel = {kind:'barrel'}; fSync(); renderAll(); return; }
  if (ds.fpix){ F.pix = ds.fpix; fChanged(true); return; }
  if (ds.fstep){ const e = fSelFree(); if (!e) return; e.f = clamp(r1(e.f + +ds.fstep), 1, 9999); fChanged(false); return; }
  if (ds.form){ applyForm(ds.form); renderAll(); return; }
  if (ds.auto){ G.autoSortie = ds.auto; renderAll(); return; }
  if (ds.sweap){ giveWeapon(G.soldiers.find(q => q.id === G.tSel), ds.sweap); renderAll(); return; }
  if (ds.pcat){ partsCat = ds.pcat; renderParts(); return; }
  if (ds.fkind){ F = newDraft(ds.fkind, ds.fkind === 'weapon' ? G.weapon : G.designs.find(d => d.id === 'bulbT')); if (ds.fkind === 'weapon') F.sourceId = null; fSync(); renderAll(); return; }
  if (ds.fload){ F = newDraft(F.kind, G.designs.find(d => d.id === ds.fload)); fSync(); renderAll(); hint('설계도를 작업대에 올렸어요'); return; }
  if (ds.fnew){ F = newDraft(F.kind, null); F.free = []; F.source = 'led'; fSync(); renderAll(); return; }
  if (ds.fsel){ const v = ds.fsel; F.sel = v.startsWith('free:') ? {kind:'free', id:+v.slice(5)} : {kind:v}; fChanged(true); return; }
  if (ds.fsrc){ F.source = ds.fsrc; fChanged(true); return; }
  if (ds.fmed){ F.medium = ds.fmed; fChanged(true); return; }
  if (ds.fpump){ F.pump = +ds.fpump; fChanged(true); return; }
  if (ds.ffoe){ F.dummy.foe = ds.ffoe; F.dummy.armor = ds.ffoe === 'kn' ? (F.dummy.armor ?? 90) : null; fChanged(true); return; }
  if (ds.frm){ const e = fSelFree(); F.free = F.free.filter(q => q !== e); F.sel = null; fChanged(true); return; }
  if (ds.fsave){ fSave(ds.fsave); renderAll(); return; }
  if (ds.ptype != null && b.classList.contains('chip')){ loadProblem(+ds.ptype); fSync(); renderAll(); return; }
  if (ds.lstep){ const v = ds.lstep, k = +v.slice(1), inp = F.prob.inputs[k]; setInput(inp, (+inputVal(inp) || 0) + (v[0] === '+' ? 1 : -1)*inp.step); fSync(); const el = $(`li${k}`); if (el) el.value = inputVal(inp); if (document.querySelector('.res')) learnPanel(); return; }
  if (ds.exq){ const [i, j] = ds.exq.split(':').map(Number); exam[i].pick = j; researchPanel(); return; }
  if (ds.research){ const r = RESEARCH.find(q => q.id === ds.research); if (!r || G.research[r.id] || G.gold < r.cost || (r.req && !G.research[r.req]) || (r.exam && !G.laserExam)) return; G.gold -= r.cost; G.research[r.id] = true; hint(`${r.name} 연구 완료`); fSync(); renderAll(); return; }
  if (ds.up){ const u = UPG[ds.up], lv = up(ds.up); if (!u || lv >= u.max || G.gold < u.cost(lv)) return; G.gold -= u.cost(lv); G.up[ds.up] = lv + 1; if (ds.up === 'wallHp') G.wallHp += 10; if (ds.up === 'battery') G.energy = Math.min(batteryCap(), G.energy); hint(`${u.name} Lv.${lv + 1}`); renderAll(); return; }
  if (ds.craft){ startCraft(ds.craft); renderAll(); return; }
  if (ds.equip){ const it = G.inventory.find(q => q.uid === +ds.equip); if (!it) return; G.inventory = G.inventory.filter(q => q !== it); G.inventory.push({uid:nextUid++, design:copy(G.weapon)}); G.weapon = copy(it.design); hint(`${G.weapon.name} 장착`); renderAll(); return; }
  if (ds.prev){ G.previewUid = +ds.prev; buildPreview(); renderAll(); return; }
  if (ds.place){ const so = SOCKETS[G.sel], it = G.inventory.find(q => q.uid === +ds.place), auto = !!ds.auto; if (!so || !it || so.tower || !atSocket(G.sel) || (auto && G.gold < AUTO_PRICE)) return; if (auto) G.gold -= AUTO_PRICE; G.inventory = G.inventory.filter(q => q !== it); placeTower(so, it, auto); hint(`${sockName(so)}에 ${it.design.name} 설치`); buildPreview(); renderAll(); return; }
  if (ds.assign != null){ const so = SOCKETS[+ds.assign], s = G.soldiers.find(q => q.role === 'idle' && !q.down); if (!so.tower || !s) return; s.role = 'tower'; s.sock = so.i; setOperator(so.tower, s); hint(`${s.name}이 ${sockName(so)}를 맡았어요`); renderAll(); return; }
  if (ds.unassign != null){ const so = SOCKETS[+ds.unassign], s = G.soldiers.find(q => q.id === so.tower.soldier); if (s){ s.role = 'idle'; s.sock = null; } setOperator(so.tower, null); renderAll(); return; }
  if (ds.srole){ const s = G.soldiers.find(q => q.id === +ds.srole); if (!s || s.role === 'tower') return; s.role = s.role === 'sortie' ? 'idle' : 'sortie'; if (s.role === 'sortie' && (!s.slot || slotTaken(s.slot[0], s.slot[1], s))) s.slot = freeSlot(); if (G.mode === 'train') tSync(); renderAll(); return; }
  if (ds.build){ buildFloor(+ds.build); return; }
  if (ds.set){ G.confirmReset = false; const [k, v] = ds.set.split(':'); G.settings[k] = v === 'true' ? true : v === 'false' ? false : v; saveSettings(); if (k === 'stick' && floatPid != null) floatEnd(); if (k === 'hard' && G.mode === 'forge' && F.learn){ loadProblem(); fSync(); } renderAll(); return; }
  switch (a){
    case 'toMap': if (G.mode === 'place' || G.mode === 'cleared') H().route = []; G.mode = 'map'; G.sel = null; G.building = null; G.winOpen = true; G.showSettings = false; buildPreview(); hideBeams(); renderAll(); break;
    case 'mapBack': G.building = null; renderAll(); break;
    case 'night': if (G.mode !== 'place'){ G.mode = 'place'; } startWave(); break;
    case 'placeView': G.placeView = G.placeView === 'follow' ? 'top' : 'follow'; renderAll(); break;
    case 'learnOn': G.learn = true; loadProblem(); fSync(); renderAll(); break;
    case 'learnOff': G.learn = false; F = newDraft('tower', G.designs.find(d => d.id === 'ledT')); fSync(); renderAll(); break;
    case 'newProb': loadProblem(); fSync(); renderAll(); break;
    case 'fire': fireOrder(); renderParts(); break;
    case 'borrow': borrowDesign(); break;
    case 'diffNormal': case 'diffHard': G.settings.hard = a === 'diffHard'; saveSettings(); loadProblem(); fSync(); renderAll(); break;
    case 'exam': startExam(); break;
    case 'examSubmit': { const ok = exam.every(q => q.opts[q.pick] === q.a); if (ok){ G.laserExam = true; hint('자격 시험 통과! 이제 레이저를 연구할 수 있어요'); } else hint(`${exam.filter(q => q.opts[q.pick] !== q.a).length}문제 틀렸어요 · 다시 도전해요`); exam = null; researchPanel(); break; }
    case 'win': G.winOpen = !G.winOpen; renderAll(); break;
    case 'settings': G.showSettings = !G.showSettings; G.confirmReset = false; renderAll(); break;
    case 'dress': G.mode = 'dress'; G.winOpen = true; G.showSettings = false; dressSync(); renderAll(); hint('캐릭터 꾸미기 · 화면을 끌면 돌아가요'); break;
    case 'goHome': saveGame(); saveBest(); location.href = '../'; break;
    case 'resetAsk': G.confirmReset = true; renderAll(); break;
    case 'resetYes': G.confirmReset = false; G.showSettings = false; clearSave(); restart(true); break;
    case 'closeSettings': G.showSettings = false; renderAll(); break;
    case 'recruit': { if (G.soldiers.length >= soldierMax() || G.gold < recruitCost()) return; G.gold -= recruitCost(); const id = G.nextSoldier++; G.soldiers.push({id, name:`쫄병 ${id}`, role:'idle', sock:null, down:false, slot:null, weapon:null}); G.tSel = id; hint(`쫄병 ${id} 입대! 끌어서 대형에 세워요`); if (G.mode === 'train') tSync(); renderAll(); break; }
    case 'buyAuto': { const so = SOCKETS[G.sel]; if (!so || !so.tower || so.tower.auto || G.gold < AUTO_PRICE) return; G.gold -= AUTO_PRICE; so.tower.auto = true; addAutoMesh(so.tower); renderAll(); break; }
    case 'autoOn': case 'autoOff': { const so = SOCKETS[G.sel]; if (so && so.tower) so.tower.autoOn = a === 'autoOn'; renderAll(); break; }
    case 'unplace': { const so = SOCKETS[G.sel]; if (!so || !so.tower || !atSocket(G.sel)) return; removeTower(so); hint('탑을 창고로 내렸어요'); buildPreview(); renderAll(); break; }
    case 'third': G.view = 'third'; renderAll(); break;
    case 'first': G.view = 'first'; renderAll(); break;
    case 'floorUp': case 'floorDown': { const nf = nextFloor(H().floor, a === 'floorUp' ? 1 : -1); if (nf) H().route = [{floor:nf}]; break; }
    case 'ride': { const so = SOCKETS[+ds.ride]; if (!so || !so.tower) return; G.stick.x = 0; G.stick.y = 0; G.ride = {sock:so.i, yaw:clamp(so.tower.mesh.userData.head.rotation.y, -1, 1), aimD:30, firing:false, theta:hasPol(so.tower.design) ? firstPol(so.tower.design) : 0, target:null}; G.aim = null; G.aimHeld = false; if (G.settings.stick === 'float' && floatPid != null) floatEnd(); hint('탑승 · 왼쪽 조이스틱으로 겨누고 오른쪽 발사 버튼을 누르고 있어요'); renderAll(); break; }
    case 'unride': G.ride = null; G.aim = null; G.stick.x = 0; G.stick.y = 0; renderAll(); break;
    case 'sortie': startSortie(); break;
    case 'retreat': endSortie('retreat'); break;
    case 'restart': clearSave(); restart(); break;
  }
});
document.addEventListener('change', ev => { if (ev.target.id === 'pSort'){ partsSort = ev.target.value; renderParts(); } });
document.addEventListener('keydown', ev => { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.classList && ev.target.classList.contains('bp')){ ev.preventDefault(); ev.target.click(); } });
document.addEventListener('input', ev => {
  const t = ev.target;
  if (t.id && t.id.startsWith('li') && F.learn){ const inp = F.prob.inputs[+t.id.slice(2)]; if (t.value === '' || isNaN(+t.value)) return; setInput(inp, +t.value); fSync(); const rs = document.querySelector('.res'); if (rs) rs.remove(); return; }
  if (t.id === 'sPol' && G.ride){ G.ride.theta = +t.value; $('vPol').textContent = `${G.ride.theta}°`; drawDial(); renderLive(); return; }
  if (G.mode !== 'forge') return;
  const e = fSelFree();
  if (t.id === 'sR') F.R = +t.value/100;
  else if (t.id === 'sX' && e) e.x = clamp(+t.value, 1, F.barrel - 1);
  else if (t.id === 'nF' && e){ if (t.value === '' || isNaN(+t.value) || +t.value <= 0) return; e.f = clamp(r1(+t.value), 1, 9999); }
  else if (t.id === 'sFl' && e) e.f = clamp(r1(Math.pow(10, +t.value/1000)), 1, 9999);
  else if (t.id === 'sT' && e) e.theta = +t.value;
  else if (t.id === 'sD') F.dummy.x = +t.value;
  else if (t.id === 'sA') F.dummy.armor = +t.value;
  else return;
  fChangedSoon();
});
function restart(fresh){
  for (const so of SOCKETS){ if (so.tower){ wScene.remove(so.tower.mesh); dispose(so.tower.mesh); wScene.remove(so.tower.beam); dispose(so.tower.beam); } so.tower = null; }
  for (const f of G.floats){ fxGroup.remove(f.s); dispose(f.s); }
  if (G.sortie) endSortie('lost');
  for (const e of G.enemies.slice()) killFoe(e, G.enemies);
  const best = G.best, sv = G.solved, ln = G.learn; newGame(); G.best = best; G.solved = sv; G.learn = ln;
  updateFloors(); for (const f of [3, 2, 1]) floorGroups[f].scale.y = 1; gate.visible = true; hideBeams(); setWallXray(false); if (floatPid != null) floatEnd();
  loadProblem(0); fSync(); buildPreview(); renderAll(); hint(fresh ? '저장을 지웠어요 · 처음부터 시작해요' : '처음부터 다시! 지도에서 대장간부터 가 보세요');
}

/* ═════════ 카메라 · 루프 ═════════ */
const camPos = V(0, 14, 16), camLook = V(0, 2, -14), goalPos = V(), goalLook = V();
function fit(){ const w = stage.clientWidth, h = stage.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w/h; viewShift = -999; camera.updateProjectionMatrix(); }
new ResizeObserver(fit).observe(stage);
let viewShift = 0;
const sideW = () => (!$('parts').hidden ? 224 : 0), winW = () => (G.winOpen && !$('panel').hidden && stage.clientWidth > 760 ? 352 : 0);
function applyViewOffset(){
  const w = stage.clientWidth, h = stage.clientHeight, s = Math.round((winW() - sideW())/2);
  if (s !== viewShift){ viewShift = s; if (s) camera.setViewOffset(w, h, s, 0, w, h); else camera.clearViewOffset(); }
}
function camGoal(){
  let k = .09; const h = H(), fy = heroY();
  if (G.mode === 'forge'){
    const effA = Math.max(.5, (stage.clientWidth - sideW() - winW())/Math.max(1, stage.clientHeight));
    const tan = Math.tan(rad(camera.fov/2)), d = Math.max(9/(2*tan), fSpan()/(2*tan*effA))*1.04, c = fCenter();
    goalPos.copy(c).add(V(0, Math.sin(rad(62)), Math.cos(rad(62))).multiplyScalar(d)); goalLook.copy(c); k = .15;
  } else if (G.mode === 'dress'){ goalPos.set(0, 3.6, -7.2); goalLook.set(0, 2.4, 0); k = .12;
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
}
const clock = new THREE.Clock(); let wasNear = '', lastMode = null, liveT = 0;
function frame(){
  const rawDt = clock.getDelta(), dt = Math.min(.05, rawDt), time = clock.elapsedTime;
  if (G.mode === 'forge'){
    if (fAnim.cav) fAnim.cav.material.opacity = .32 + .14*Math.sin(time*9);
    if (fAnim.rod) fAnim.rod.material.emissiveIntensity = (fPower() && !(F.learn && !F.fired)) ? .55 + .2*Math.sin(time*9) : .2;
    const span = X_OUT - X_REAR - .3;
    for (const ph of fAnim.photons || []){ const s = (time*.9 + ph.userData.phase) % 2, f = s < 1 ? s : 2 - s; ph.position.set(X_REAR + .15 + f*span, BEAM_Y + ph.userData.dy, ph.userData.dz); }
    if (fAnim.ring) fAnim.ring.scale.setScalar(1 + .04*Math.sin(time*4));
    if (fAnim.body) fAnim.body.material.emissiveIntensity = fAnim.hit ? .25 + .35*Math.abs(Math.sin(time*14)) : .1;
  } else if (G.mode === 'train' || G.mode === 'solar' || G.mode === 'dress'){ if (G.mode === 'solar') updateLab(dt); if (G.mode === 'dress'){ if (!dDrag) dSpin += dt*.4; dHero.rotation.y = dSpin; } }
  else if (G.mode !== 'map'){
    const h = H();
    if (G.mode === 'wave' && !G.ride && !h.climb && !h.route.length){
      const [mx, mz] = moveInput();
      if (Math.abs(mx) > .05){ h.x = clamp(h.x + Math.sign(mx)*Math.min(1, Math.abs(mx))*7*heroSpeed()*dt, -STAIR_X, STAIR_X); h.walkDir = Math.sign(mx); h.walking = true; } else h.walking = false;
      if (inStairs() && Math.abs(mz) > .6){ const nf = nextFloor(h.floor, mz < 0 ? 1 : -1); if (nf) h.climb = {from:h.floor, to:nf, t:0}; }
      else if (Math.abs(mz) > .15) G.lookD = clamp((G.lookD || 24) - mz*40*dt, 4, 80);
    } else if (G.mode !== 'sortie') h.walking = stepHero(dt);
    if (G.mode !== 'sortie'){
      hero.position.set(h.x, heroY() + .1, heroZ());
      if (h.walking || h.climb) hero.rotation.y = h.climb ? Math.PI : (h.walkDir > 0 ? -Math.PI/2 : Math.PI/2); else if (G.mode === 'wave') hero.rotation.y = h.yaw; else hero.rotation.y *= .85;
      const [lL, lR] = hero.userData.legs, sw = (h.walking || h.climb) ? Math.sin(time*14)*.12 : 0; lL.position.z = sw; lR.position.z = -sw;
      hero.visible = !G.ride && !(G.mode === 'wave' && G.view === 'first');
      const near = nearSockets().map(q => q.i + (q.tower ? 't' : '')).join() + (inStairs() ? 's' + h.floor : '') + (h.climb ? 'c' : '');
      if (near !== wasNear && (G.mode === 'place' || G.mode === 'wave')){ wasNear = near; renderTabs(); if (G.mode === 'place' && G.sel != null) placePanel(); }
    } else { const [lL, lR] = hero.userData.legs, sw = Math.sin(time*14)*.12; lL.position.z = sw; lR.position.z = -sw; hero.visible = true; }
    for (const so of SOCKETS){ so.ring.visible = built(so.floor) && !so.tower && G.mode !== 'build'; so.ring.material.color.set(G.sel === so.i ? 0xffd166 : 0xff8a3d); so.ring.scale.setScalar(G.sel === so.i ? 1 + .06*Math.sin(time*5) : 1); }
    if (river) river.material.emissiveIntensity = .5 + .12*Math.sin(time*1.6);
    if (G.mode === 'wave' || G.mode === 'sortie'){ updateWave(dt); liveT -= dt; if (liveT <= 0){ liveT = .25; renderLive(); renderHud(); drawDial(); } }
    if (G.mode === 'build') updateBuild(dt);
    for (const f of G.floats){ f.life -= dt; f.s.position.y += dt*.8; f.s.material.opacity = Math.min(1, f.life*1.5); }
    for (const f of G.floats.filter(q => q.life <= 0)){ fxGroup.remove(f.s); dispose(f.s); }
    G.floats = G.floats.filter(q => q.life > 0);
  }
  if (G.mode !== 'map'){
    applyViewOffset();
    const k = camGoal(), key = G.mode + (G.ride ? 'r' : '');
    if (lastMode !== key){ const snap = G.mode === 'forge' || key.endsWith('r') || lastMode === 'map' || lastMode === null; lastMode = key; if (snap){ camPos.copy(goalPos); camLook.copy(goalLook); } }
    camPos.lerp(goalPos, k); camLook.lerp(goalLook, k);
    camera.position.copy(camPos); camera.lookAt(camLook);
    const sc = G.mode === 'forge' ? fScene : G.mode === 'train' ? tScene : G.mode === 'solar' ? sScene : G.mode === 'dress' ? dScene : wScene;
    if (sc === wScene){ applySky(['wave', 'sortie', 'over'].includes(G.mode)); wAnimate(time); gfxSample(rawDt); }
    renderer.setClearColor(G.mode === 'forge' ? 0x0f355e : G.mode === 'train' ? 0x9fc7e8 : G.mode === 'solar' ? 0xa8d8f0 : 0x0b1220);
    renderer.render(sc, camera);
  } else lastMode = 'map';
  if (bestDirty && G.mode !== 'wave' && G.mode !== 'sortie'){ bestDirty = false; saveBest(); }
  if (G.mode === 'train' && tDrag == null){ for (const m of tPicks) m.rotation.y = Math.sin(time*.8 + m.userData.sid)*.15; }
  requestAnimationFrame(frame);
}
window.addEventListener('pagehide', () => { try { saveBest(); saveGame(); } catch(e){} });
document.addEventListener('visibilitychange', () => { if (document.hidden){ try { saveBest(); saveGame(); } catch(e){} } });
function applySave(o){
  for (const k of SAVE_FIELDS) if (o[k] !== undefined) G[k] = o[k];
  nextUid = Math.max(nextUid, o.nextUid || 1);
  for (const s of G.soldiers){ s.down = false; if (s.role === 'tower') s.role = 'idle'; s.sock = null; }
  (o.towers || []).forEach((t, i) => { const so = SOCKETS[i]; if (!t || !so || !built(so.floor)) return; placeTower(so, {uid:t.uid, design:t.design}, t.auto); so.tower.autoOn = t.autoOn !== false;
    const s = G.soldiers.find(q => q.id === t.soldier); if (s){ s.role = 'tower'; s.sock = i; setOperator(so.tower, s); } });
  updateFloors(); G.mode = 'map'; G.wallHp = Math.min(G.wallHp, wallMax());
}
function boot(){
  newGame(); loadProblem(0);
  fBuildStatic(); wBuild(); wDecorate(); tBuildStatic(); tDecorate(); sBuildStatic(); sDecorate(); dBuildStatic(); fit();
  const sv = readSave(); let resumed = false;
  if (sv){ try { applySave(sv); resumed = true; } catch(e){ console.warn('save load failed', e); clearSave(); } }
  loadProblem(G.ptype); if (!G.learn) F = newDraft('tower', G.designs.find(d => d.id === 'ledT'));
  buildHero(); loadFace(); fSync(); renderAll();
  hint(resumed ? `이어하기 · ${G.wave}일째 낮부터 다시 시작해요` : '지도에서 건물을 눌러 이동해요 · 대장간 제작부에서 탑부터 만들어 보세요');
  requestAnimationFrame(frame);
}
window.__pc = {get G(){ return G; }, get F(){ return F; }, PTYPES, genProblem, loadProblem, setInput, startWave, startSortie, endSortie, selectSocket, enterForge, buildFloor, goTo, hitD, FOES, PRESETS, saveGame, readSave, tSync, applyForm, proj(x, y, z){ const v = V(x, y, z).project(camera), r = canvas.getBoundingClientRect(); return {x:r.left + (v.x + 1)/2*r.width, y:r.top + (1 - v.y)/2*r.height}; }};
let booted = false; const go = () => { if (!booted){ booted = true; boot(); } };
if (document.fonts && document.fonts.ready){ document.fonts.ready.then(go); setTimeout(go, 1500); } else go();
