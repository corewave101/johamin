'use strict';
/* ═════════ 양피지 성 지도 (낮 허브) ═════════ */
function mapSVG(){
  const ink = '#5a3e28', inkS = '#7a5a3c';
  const crafting = G.craft.length, sold = G.soldiers.length, bat = G.energy/batteryCap();
  const crenels = []; for (let x = 120; x <= 870; x += 30) crenels.push(`<rect x="${x}" y="262" width="14" height="10"/>`);
  const grass = []; for (let i = 0; i < 70; i++){ const x = 40 + (i*137) % 920, y = 40 + (i*71) % 190; grass.push(`<path d="M${x} ${y} l3 -7 M${x+5} ${y} l2 -6"/>`); }
  const panels = []; const n = Math.min(panelsN(), 12); for (let i = 0; i < n; i++){ const c = i % 4, r = Math.floor(i/4); panels.push(`<rect x="${712 + c*24}" y="${398 + r*20}" width="20" height="14" transform="skewX(-12)"/>`); }
  return `<svg viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet" role="img" aria-label="성 지도">
  <defs>
    <filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .32  0 0 0 0 .18  0 0 0 .18 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <radialGradient id="parch" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#f3e2bd"/><stop offset=".7" stop-color="#e6cc98"/><stop offset="1" stop-color="#b98a52"/></radialGradient>
    <filter id="wob"><feTurbulence type="turbulence" baseFrequency=".02" numOctaves="2" seed="8"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter>
  </defs>
  <rect x="6" y="6" width="988" height="608" rx="18" fill="url(#parch)" stroke="#8a6238" stroke-width="3"/>
  <rect x="6" y="6" width="988" height="608" rx="18" fill="#fff" filter="url(#rough)"/>
  <g filter="url(#wob)" fill="none" stroke="${ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
    <g stroke="${inkS}" stroke-width="1.2" opacity=".55">${grass.join('')}</g>
    <path d="M30 130 C 180 100, 300 165, 470 128 S 760 105, 970 140" stroke="#3f6d8f" stroke-width="16" opacity=".45"/>
    <path d="M30 130 C 180 100, 300 165, 470 128 S 760 105, 970 140" stroke="#3f6d8f" stroke-width="2"/>
    <g stroke="#8b2f2f" stroke-width="2" opacity=".75"><path d="M300 40 v60 m-8 -10 l8 12 l8 -12"/><path d="M500 30 v70 m-8 -10 l8 12 l8 -12"/><path d="M700 40 v60 m-8 -10 l8 12 l8 -12"/></g>
    <g class="mp" data-go="wall" tabindex="0" role="button" aria-label="성벽">
      <rect x="100" y="230" width="800" height="70" fill="transparent" stroke="none"/>
      <path d="M120 272 H880 M120 296 H880" stroke-width="3.2"/>
      <g fill="${ink}" stroke="none">${crenels.join('')}</g>
      <circle cx="105" cy="284" r="30" fill="#e9d3a5"/><circle cx="895" cy="284" r="30" fill="#e9d3a5"/>
      <path d="M480 296 v-18 a20 20 0 0 1 40 0 v18" fill="#c9a877"/>
      ${[3, 2, 1].map((f, i) => built(f) ? `<path d="M140 ${300 + i*5} H860" stroke-width="1.4" opacity=".7"/>` : '').join('')}
    </g>
    <g class="mp" data-go="forge" tabindex="0" role="button" aria-label="대장간">
      <rect x="170" y="360" width="170" height="130" fill="transparent" stroke="none"/>
      <path d="M190 470 V410 L255 370 L320 410 V470 Z" fill="#e2c592"/>
      <path d="M225 470 v-30 h30 v30"/><path d="M290 395 v-28 h14 v38"/>
      <path d="M298 362 c-6 -10 8 -14 2 -26 c-6 -10 6 -14 2 -22" stroke-width="1.6" opacity=".7"/>
      <path d="M200 488 h44 l-6 10 h-32 z" fill="${ink}"/>
    </g>
    <g class="mp" data-go="train" tabindex="0" role="button" aria-label="훈련소">
      <rect x="420" y="380" width="170" height="120" fill="transparent" stroke="none"/>
      <path d="M440 480 L505 400 L570 480 Z" fill="#e2c592"/><path d="M505 400 v-26 l24 8 l-24 8"/>
      <path d="M470 470 l70 -50 M540 470 l-70 -50" stroke-width="3"/>
    </g>
    <g class="mp" data-go="solar" tabindex="0" role="button" aria-label="태양광 발전단지">
      <rect x="680" y="370" width="170" height="130" fill="transparent" stroke="none"/>
      <g fill="#9fb6c9" stroke="${ink}" stroke-width="1.6">${panels.join('')}</g>
      <circle cx="830" cy="380" r="14"/><path d="M830 358 v-8 M830 402 v8 M808 380 h-8 M852 380 h8 M815 365 l-6 -6 M845 395 l6 6 M845 365 l6 -6 M815 395 l-6 6" stroke-width="1.6"/>
      <rect x="700" y="478" width="130" height="12" rx="4"/><rect x="702" y="480" width="${Math.max(2, 126*bat)}" height="8" rx="3" fill="#6c9a4a" stroke="none"/>
    </g>
    <g opacity=".35"><path d="M340 560 h70 v30 h-70 z M355 560 l20 -20 l20 20"/><path d="M610 590 l30 -40 l30 40 z"/><path d="M820 590 h80 v-25 h-80 z M835 565 v-15 h50 v15"/></g>
    <g transform="translate(905 70)" stroke-width="1.6"><circle r="34"/><path d="M0 -44 L8 0 L0 44 L-8 0 Z" fill="${ink}"/><path d="M-44 0 L0 6 L44 0 L0 -6 Z"/></g>
  </g>
  <g font-family="Gaegu, 'Nanum Pen Script', 'IBM Plex Sans KR', sans-serif" fill="${ink}" text-anchor="middle">
    <text x="500" y="168" font-size="20" opacity=".8">얕은 강 · 밤마다 적이 내려와요</text>
    <text x="500" y="226" font-size="26" font-weight="700">성벽 · 탑 배치 · 증축</text>
    <text x="255" y="520" font-size="28" font-weight="700">대장간</text><text x="255" y="544" font-size="18">연구 · 설계 · 실험 · 제작${crafting ? ` · 제작 중 ${crafting}` : ''}</text>
    <text x="505" y="526" font-size="28" font-weight="700">훈련소</text><text x="505" y="550" font-size="18">연병장 · 쫄병 ${sold}/${soldierMax()} · 대형</text>
    <text x="765" y="526" font-size="26" font-weight="700">태양광 발전단지</text><text x="765" y="550" font-size="18">광전 연구소 · 배터리 ${Math.floor(G.energy)}/${batteryCap()} ⚡</text>
    <text x="375" y="608" font-size="16" opacity=".55">농장 (준비 중)</text><text x="640" y="608" font-size="16" opacity=".55">광산 (준비 중)</text><text x="860" y="608" font-size="16" opacity=".55">대형 무기 공방 (준비 중)</text>
    <text x="905" y="128" font-size="16">북 · 적</text>
  </g>
  <g font-family="Gaegu, 'IBM Plex Sans KR', sans-serif" fill="${ink}"><text x="40" y="56" font-size="34" font-weight="700">피직스 캐슬</text><text x="42" y="84" font-size="20">${G.wave}일째 낮 · 밤이 오면 웨이브 ${G.wave}</text></g>
</svg>`;
}
function renderMap(){
  const m = $('map'); m.hidden = G.mode !== 'map';
  if (G.mode === 'map') m.innerHTML = mapSVG();
}
function mapPanel(){
  const jobs = G.craft.map(j => `${j.design.name} (${Math.max(1, Math.ceil((j.need - j.done)/craftSpeed()))}밤)`).join(', ');
  $('panel').innerHTML = `<div class="sec"><div class="ed-head"><h3>${G.wave}일째 낮</h3><span>지도에서 건물을 눌러요</span></div>
    <div class="rows">
      <div class="row"><span>오늘 밤 웨이브 ${G.wave}</span><b>${waveSummary(G.wave)}</b></div>
      <div class="row"><span>배터리</span><b>${Math.floor(G.energy)} / ${batteryCap()} ⚡</b></div>
      <div class="row"><span>밤이 끝나면 충전</span><b>+${dayCharge().toFixed(0)} ⚡</b></div>
      <div class="row"><span>제작 중</span><b>${jobs || '없음'}</b></div>
      <div class="row"><span>창고의 탑</span><b>${G.inventory.filter(i => i.design.kind === 'tower').length}개</b></div>
      <div class="row"><span>설치한 탑</span><b>${SOCKETS.filter(s => s.tower).length}대</b></div>
      <div class="row"><span>쫄병</span><b>${G.soldiers.length}명</b></div>
      <div class="row"><span>금속 조각</span><b>${['na','cs','ag','ca'].map(k => `${METALS[k].name} ${G.metals[k] || 0}`).join(' · ')}</b></div>
    </div>
    <div class="btns"><button class="btn primary" type="button" data-act="night">밤 시작 · 웨이브 ${G.wave}</button><button class="btn" type="button" data-act="dress">캐릭터 꾸미기</button></div>
    ${G.wave === 1 ? '<p class="muted">첫날은 탑이 없어요. 제작부에서 탑을 만들어 두면 첫 밤이 끝난 뒤 완성돼요. 첫 밤은 주인공 LED 랜턴으로 버텨요!</p>' : ''}
    <p class="muted">낮마다 자동 저장돼요. 밤 도중에 꺼지면 그날 낮으로 돌아와요.</p></div>` + recordsHtml();
}
