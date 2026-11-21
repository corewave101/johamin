'use strict';
/* ═════════ 내정 · 마을 시뮬레이션 (6.7) ═════════
   지도 남쪽(성 아래) 칸 10개에 건물을 짓고 시민에게 일을 맡긴다. 날이 밝을 때마다 하루 계산(townTick):
     식량 = 농부 × 3 (2단계 ×1.5) − 인구 × 1        → 모자라면 굶어서 만족도 ↓ · 인구 ↓
     위생 = 70 − 인구 × 2 + 우물 18(2단계 30) + 의사 × 6   (0~100)
     만족도 → 목표값 쪽으로 하루에 40%씩: 50 ± 식량 · 전광판 · 아픈 사람 비율 · 노는 사람 · 세율 · 시장
     세금 = 인구 × 2.5 × 세율 × (0.5 + 만족도/100)
     인구: 식량이 남고 만족도 50 이상이면 +1(70 이상이면 +2), 집 정원까지
   물리 콘텐츠 셋(양동비T 편광 가상실험실 · 20 · 21 · 22 · 24번):
     · 전광판(LCD/OLED): 시민 의뢰(야구 중계 점수판 …)를 밝기 맞춰 띄우면 만족도 ↑
       LCD = 백라이트 + 엇갈린 편광판 2장 + 액정이 편광을 φ 돌림 → 밝기 = sin²φ (말뤼스), 전기는 백라이트라 늘 같음
       OLED = 화소가 직접 빛남 → 밝기만큼 전기 (검은색 = 전기 0)
     · 역병 · 현미경: 위생이 나쁘면 돈다. 정체를 밝혀야 진료소가 고친다
       광학 현미경 배율 M = (L/f대물)(250 mm/f접안), 분해능 ≈ 0.61λ/NA = 0.25 μm → 세균(2 μm)은 보이고 바이러스(0.1 μm)는 '빈 배율'
       전자 현미경(진료소 2단계): λ = 1.226/√V nm, 분해능 ≈ 1220λ (렌즈 수차로 NA가 아주 작다) → 바이러스를 보려면 몇 kV
     · 무역 · 광자 통신: 상단에 주문을 보내기 전에 편광 광자로 비밀 열쇠를 나눈다(+ 기저 ↕↔ · × 기저 ⤢⤡)
       기저가 같은 것만 남기고 일부를 공개해 비교 → 도적이 중간에 재면(측정이 상태를 바꿈) 남긴 것의 25%가 틀린다 */
const TOWN_PLOTS = 10, PLOT = i => ({x:250 + (i % 5)*100, y:616 + Math.floor(i/5)*84, w:88, h:72});
const TB = {
  house:{name:'집', ic:'🏠', cost:60, cap:[6, 10, 15], desc:'시민이 살 곳 · 정원'},
  farm:{name:'농장', ic:'🌾', cost:80, jobs:3, desc:'농부 1명이 식량 3 (2단계 ×1.5)'},
  mine:{name:'광산', ic:'⛏', cost:120, jobs:2, desc:'광부 1명이 하루 금속 조각 0.4개 (2단계 ×1.5)'},
  well:{name:'우물', ic:'⛲', cost:70, desc:'위생 +18 (2단계 +30)'},
  clinic:{name:'진료소', ic:'🩺', cost:150, jobs:2, desc:'의사 1명이 위생 +6 · 역병 치료 · 광학 현미경 (2단계: 전자 현미경)'},
  board:{name:'전광판', ic:'📺', cost:160, jobs:1, desc:'시민 의뢰를 띄우면 만족도 ↑ · LCD (2단계: OLED)'},
  market:{name:'시장', ic:'⚖', cost:180, jobs:2, desc:'무역 · 광자 통신 · 세금 +10%'},
};
const TB_ORDER = ['house', 'farm', 'mine', 'well', 'clinic', 'board', 'market'];
const upCost = (k, lv) => Math.round(TB[k].cost*(lv === 1 ? 1.5 : 2.5));
function townNew(){ return {pop:6, food:20, happy:60, san:70, tax:1, plots:[{b:'house', lv:1, w:0}, {b:'farm', lv:1, w:3}, null, null, null, null, null, null, null, null],
  plague:null, disp:{day:-1, acc:0, req:null}, trade:{day:-1, offers:null, sent:0}, log:[], days:0}; }
const T = () => (G.town = G.town || townNew());
const cap = () => T().plots.reduce((s, p) => s + (p && p.b === 'house' ? TB.house.cap[p.lv - 1] : 0), 0);
const jobsOf = k => T().plots.filter(p => p && p.b === k).reduce((s, p) => s + p.w, 0);
const has = k => T().plots.some(p => p && p.b === k);
const lvOf = k => Math.max(0, ...T().plots.filter(p => p && p.b === k).map(p => p.lv));
const employed = () => T().plots.reduce((s, p) => s + (p ? p.w : 0), 0);
const sickN = () => T().plague ? T().plague.sick : 0;
const idle = () => Math.max(0, T().pop - employed());
const foodProd = () => T().plots.reduce((s, p) => s + (p && p.b === 'farm' ? p.w*3*(p.lv > 1 ? 1.5 : 1) : 0), 0);
const sanOf = () => clamp(70 - 2*T().pop + T().plots.reduce((s, p) => s + (p && p.b === 'well' ? (p.lv > 1 ? 30 : 18) : 0), 0) + 6*jobsOf('clinic'), 0, 100);
const sanSum = () => {   // 위생 식의 항별 값 (회관 카드 표시용)
  const wells = T().plots.reduce((s, p) => s + (p && p.b === 'well' ? (p.lv > 1 ? 30 : 18) : 0), 0);
  return {base:70, pop:-2*T().pop, wells, docs:6*jobsOf('clinic')};
};
function happyTarget(){
  const t = T(), food = t.food + foodProd() - t.pop >= 0, sick = t.pop ? sickN()/t.pop : 0, disp = t.disp.day === G.wave - 1 || t.disp.day === G.wave ? 25*t.disp.acc*t.disp.acc : 0;
  const parts = {base:50, food:food ? 10 : -25, disp:Math.round(disp), sick:-Math.round(60*sick), idle:-2*idle(), tax:-Math.round((t.tax - 1)*30), market:has('market') ? 5 : 0};
  parts.total = clamp(Object.values(parts).reduce((a, b) => a + b, 0), 0, 100); return parts;
}
const taxGold = () => Math.round(T().pop*2.5*T().tax*(.5 + T().happy/100)*(has('market') ? 1.1 : 1));

/* ── 하루 계산 ── */
function townTick(){
  const t = T(), out = {}; t.days++;
  // 식량
  const prod = foodProd(); t.food += prod - t.pop; out.food = prod - t.pop;
  let starve = 0; if (t.food < 0){ starve = Math.min(t.pop - 1, Math.ceil(-t.food/3)); t.food = 0; }
  t.food = Math.min(t.food, 60 + 20*jobsOf('farm'));
  // 위생 · 역병
  t.san = sanOf(); out.san = t.san;
  let died = 0;
  if (t.plague){
    const P = t.plague; P.days++;
    if (P.found && jobsOf('clinic')) P.sick = Math.max(0, P.sick - Math.ceil(jobsOf('clinic')*(P.kind === 'virus' ? 1.5 : 2)));
    else P.sick = Math.min(t.pop, P.sick + Math.ceil(P.sick*Math.max(.05, .35 - t.san/400)));
    if (P.days > 3 && P.sick && !P.found){ died = Math.max(1, Math.round(P.sick*.1)); P.sick = Math.max(0, P.sick - died); }
    if (!P.sick){ out.plagueEnd = P.kind; t.plague = null; }
  } else if (t.days >= 6){
    const p = .02 + Math.max(0, 60 - t.san)/400 + (t.trade.sent === G.wave ? .04 : 0);   // 오늘 상단이 다녀왔으면 병이 들어올 수 있다
    if (Math.random() < p){ const kind = t.days >= 15 && Math.random() < .45 ? 'virus' : 'bacteria'; t.plague = {kind, sick:Math.max(1, Math.ceil(t.pop*.15)), days:0, found:false}; out.plagueStart = kind; }
  }
  // 인구
  const before = t.pop; t.pop = Math.max(1, t.pop - starve - died);
  if (!starve && t.food >= Math.ceil(t.pop*.2) && t.happy >= 50 && t.pop < cap()) t.pop = Math.min(cap(), t.pop + (t.happy >= 70 ? 2 : 1));
  out.pop = t.pop - before; out.starve = starve; out.died = died;
  if (t.plague) t.plague.sick = Math.min(t.plague.sick, t.pop);
  townFixJobs();
  // 만족도 · 세금 · 광산
  const ht = happyTarget(); t.happy = Math.round(t.happy + (ht.total - t.happy)*.4); out.happy = t.happy;
  const tax = taxGold(); G.gold += tax; out.tax = tax;
  out.metals = {}; for (const p of t.plots) if (p && p.b === 'mine') for (let i = 0; i < p.w; i++) if (Math.random() < .4*(p.lv > 1 ? 1.5 : 1)){ const k = rnd(['na', 'na', 'cs', 'cs', 'ag', 'ca']); G.metals[k] = (G.metals[k] || 0) + 1; out.metals[k] = (out.metals[k] || 0) + 1; }
  t.trade.offers = null; t.disp.req = null;
  t.last = out; return out;
}
/* 인구가 줄면 일꾼부터 뺀다(뒤 칸부터) */
function townFixJobs(){ const t = T(); let over = employed() - t.pop; for (let i = t.plots.length - 1; i >= 0 && over > 0; i--){ const p = t.plots[i]; if (p && p.w){ const k = Math.min(p.w, over); p.w -= k; over -= k; } } }

/* ── 지도: 마을 칸 · 회관 ── */
const _mapSVG12 = window.mapSVG;
window.mapSVG = function(){
  let s = _mapSVG12();
  // 예전 '농장 · 광산 준비 중' 자리를 마을로
  s = s.replace('<text x="375" y="608" font-size="16" opacity=".55">농장 (준비 중)</text><text x="640" y="608" font-size="16" opacity=".55">광산 (준비 중)</text>', '<text x="500" y="608" font-size="16" opacity=".6">성 아래 마을 ↓</text>');
  if (mapStage() < 1) return s;
  s = s.replace('<rect x="300" y="628" width="150" height="90" rx="6"/><rect x="565" y="628" width="150" height="90" rx="6"/>', '')
    .replace('<path d="M318 700 h114 M318 684 h114 M318 668 h114" stroke-width="1.4" opacity=".6"/>', '')
    .replace('<path d="M600 712 l40 -62 l40 62 M628 712 v-18 a12 12 0 0 1 24 0 v18" opacity=".8"/>', '')
    .replace(/<text[^>]*>농장 터<\/text>/, '').replace(/<text[^>]*>광산 터<\/text>/, '').replace(/<text[^>]*>농장 · 광산은 준비 중<\/text>/, '');
  const t = T(), ink = '#5a3e28';
  const plots = t.plots.map((p, i) => { const R = PLOT(i), sel = UI.site === `plot${i}`;
    const art = !p ? `<text x="${R.x + R.w/2}" y="${R.y + 44}" font-size="15" opacity=".55" text-anchor="middle">빈 땅 +</text>`
      : `<text x="${R.x + R.w/2}" y="${R.y + 34}" font-size="26" text-anchor="middle">${TB[p.b].ic}</text><text x="${R.x + R.w/2}" y="${R.y + 58}" font-size="15" font-weight="700" text-anchor="middle">${TB[p.b].name}${p.lv > 1 ? ` ${p.lv}` : ''}${TB[p.b].jobs ? ` · ${p.w}/${TB[p.b].jobs}` : ''}</text>`;
    return `<g class="mp site" data-go="plot${i}" tabindex="0" role="button" aria-label="마을 ${i + 1}번 칸${p ? ` · ${TB[p.b].name}` : ' · 빈 땅'}"><rect x="${R.x}" y="${R.y}" width="${R.w}" height="${R.h}" rx="8" fill="${p ? '#ead2a0' : 'rgba(234,210,160,.35)'}" stroke="${sel ? '#d2603a' : ink}" stroke-width="${sel ? 3 : 1.6}" ${p ? '' : 'stroke-dasharray="5 5"'}/>${art}</g>`; }).join('');
  const P = t.plague;
  const hall = `<g class="mp site" data-go="hall" tabindex="0" role="button" aria-label="마을 회관">
    <rect x="128" y="618" width="110" height="156" fill="transparent" stroke="none"/>
    <path d="M140 712 V668 l43 -30 l43 30 V712 Z" fill="#e2c592" stroke="${ink}" stroke-width="2.4"/><path d="M171 712 v-24 h24 v24" fill="#c9a877" stroke="${ink}" stroke-width="2"/>
    <text x="183" y="734" font-size="18" font-weight="700" text-anchor="middle">마을 회관</text>
    <text x="183" y="754" font-size="14" text-anchor="middle">👥 ${t.pop}/${cap()} · 😊 ${t.happy}</text>
    <text x="183" y="772" font-size="14" text-anchor="middle" ${P ? 'fill="#b8322a" font-weight="700"' : ''}>${P ? `역병! 아픈 사람 ${P.sick}` : `🌾 ${t.food} · 위생 ${sanOf()}`}</text></g>`;
  const add = `<g font-family="Gaegu, 'IBM Plex Sans KR', sans-serif" fill="${ink}" filter="url(#wob)">${hall}${plots}</g>`;
  const at = s.indexOf('<mask id="fm');
  return at > 0 ? s.slice(0, at) + add + s.slice(at) : s.replace(/<\/svg>\s*$/, `${add}</svg>`);
};
for (let i = 0; i < TOWN_PLOTS; i++) SITE_KEYS.push(`plot${i}`);
SITE_KEYS.push('hall');
const _siteHtml12 = window.siteHtml;
window.siteHtml = function(k){ if (k === 'hall') return hallHtml(); if (/^plot\d$/.test(k)) return plotHtml(+k.slice(4)); return _siteHtml12(k); };

/* ── 카드: 회관 ── */
const bar = (v, max, cls = '') => `<span class="tb-bar ${cls}"><i style="width:${clamp(v/max*100, 0, 100)}%"></i></span>`;
function hallHtml(){
  const t = T(), ht = happyTarget(), ss = sanSum(), P = t.plague, fp = foodProd();
  const jobRows = t.plots.map((p, i) => p && TB[p.b].jobs ? `<div class="row tb-job"><span>${TB[p.b].ic} ${i + 1}번 ${TB[p.b].name}</span><b><button class="btn mini" type="button" data-tw="w-" data-v="${i}" ${p.w ? '' : 'disabled'}>−</button> ${p.w}/${TB[p.b].jobs} <button class="btn mini" type="button" data-tw="w+" data-v="${i}" ${p.w < TB[p.b].jobs && idle() ? '' : `disabled data-why="${idle() ? '자리가 꽉 찼어요' : '노는 시민이 없어요 · 집을 지어 인구를 늘려요'}"`}>+</button></b></div>` : '').join('');
  const sign = v => v > 0 ? `+${v}` : `${v}`;
  return `<div class="ed-head"><h3>마을 회관</h3><span>마을 ${t.days + 1}일째</span></div>
  <div class="st-grid"><div>
    <div class="rows">
      <div class="row"><span>👥 인구 · 정원</span><b>${t.pop} / ${cap()} ${bar(t.pop, Math.max(1, cap()))}</b></div>
      <div class="row"><span>🌾 식량 (하루 ${sign(Math.round(fp - t.pop))})</span><b>${t.food} ${bar(t.food, 60)}</b></div>
      <div class="row"><span>🧼 위생</span><b>${sanOf()} ${bar(sanOf(), 100, sanOf() < 40 ? 'bad' : '')}</b></div>
      <div class="row"><span>😊 만족도 (목표 ${ht.total})</span><b>${t.happy} ${bar(t.happy, 100, t.happy < 35 ? 'bad' : '')}</b></div>
      <div class="row"><span>💰 내일 세금</span><b>${taxGold()}G</b></div>
      ${P ? `<div class="row bad"><span>🦠 역병 (${P.days}일째)</span><b>아픈 사람 ${P.sick} · ${P.found ? (P.kind === 'virus' ? '바이러스 · 치료 중' : '세균 · 치료 중') : '정체 모름 → 진료소 현미경'}</b></div>` : ''}
    </div>
    <div class="sg-lab">세율</div><div class="chips">${[.5, .75, 1, 1.25, 1.5].map(r => `<button type="button" data-tw="tax" data-v="${r}" aria-pressed="${t.tax === r}">×${r}</button>`).join('')}</div>
    <p class="eq">위생 = ${ss.base} ${sign(ss.pop)}(인구×2) ${sign(ss.wells)}(우물) ${sign(ss.docs)}(의사×6)<br>만족도 목표 = 50 ${sign(ht.food)}(식량) ${sign(ht.disp)}(전광판) ${sign(ht.sick)}(아픈 사람) ${sign(ht.idle)}(노는 사람) ${sign(ht.tax)}(세율) ${sign(ht.market)}(시장)<br>세금 = 인구 × 2.5 × 세율 × (0.5 + 만족도/100)</p>
  </div><div>
    <div class="sg-lab">직업 배치 · 노는 시민 ${idle()}명</div>
    <div class="rows">${jobRows || '<p class="muted">일터가 없어요. 빈 땅에 농장 · 광산 · 진료소 · 전광판 · 시장을 지어요.</p>'}</div>
    <p class="muted">날이 밝을 때마다 마을이 한 번 돌아가요. 식량이 모자라면 굶고, 위생이 나쁘면 역병이 돌아요.</p>
  </div></div>`;
}

/* ── 카드: 칸 (짓기 · 건물) ── */
function plotHtml(i){
  const t = T(), p = t.plots[i];
  if (!p){
    const opts = TB_ORDER.map(k => { const B = TB[k], ok = G.gold >= B.cost;
      return `<button type="button" class="tb-opt" data-tw="build" data-k="${k}" data-v="${i}" ${ok ? '' : `disabled data-why="골드 부족 · ${B.cost}G"`}><span class="ic">${B.ic}</span><b>${B.name} · ${B.cost}G</b><small>${B.desc}</small></button>`; }).join('');
    return `<div class="ed-head"><h3>${i + 1}번 칸 · 빈 땅</h3>${cGold()}</div><div class="tb-opts">${opts}</div>`;
  }
  const B = TB[p.b], maxLv = p.b === 'house' ? 3 : p.b === 'market' ? 1 : 2, uc = p.lv < maxLv ? upCost(p.b, p.lv) : 0;
  const head = `<div class="ed-head"><h3>${B.ic} ${i + 1}번 · ${B.name}${p.lv > 1 ? ` ${p.lv}단계` : ''}</h3>${cGold()}</div>`;
  const jobs = B.jobs ? `<div class="row"><span>일꾼 (노는 시민 ${idle()})</span><b><button class="btn mini" type="button" data-tw="w-" data-v="${i}" ${p.w ? '' : 'disabled'}>−</button> ${p.w}/${B.jobs} <button class="btn mini" type="button" data-tw="w+" data-v="${i}" ${p.w < B.jobs && idle() ? '' : `disabled data-why="${idle() ? '자리가 꽉 찼어요' : '노는 시민이 없어요'}"`}>+</button></b></div>` : '';
  const eff = ({house:() => `정원 ${B.cap[p.lv - 1]}명`, farm:() => `식량 하루 +${(p.w*3*(p.lv > 1 ? 1.5 : 1)).toFixed(1)}`, mine:() => `금속 조각 하루 약 ${(p.w*.4*(p.lv > 1 ? 1.5 : 1)).toFixed(1)}개`, well:() => `위생 +${p.lv > 1 ? 30 : 18}`, clinic:() => `위생 +${6*p.w} · ${p.lv > 1 ? '전자 현미경' : '광학 현미경'}`, board:() => p.lv > 1 ? 'OLED 패널' : 'LCD 패널', market:() => '세금 +10% · 무역'})[p.b]();
  const common = `<div class="rows">${jobs}<div class="row"><span>효과</span><b>${eff}</b></div></div>
    <div class="btns">${p.lv < maxLv ? `<button class="btn" type="button" data-tw="up" data-v="${i}" ${G.gold >= uc ? '' : `disabled data-why="골드 부족 · ${uc}G"`}>${p.lv + 1}단계 · ${uc}G${p.b === 'clinic' ? ' (전자 현미경)' : p.b === 'board' ? ' (OLED)' : ''}</button>` : ''}<button class="btn" type="button" data-tw="raze" data-v="${i}">허물기 (반값 돌려받기)</button></div>`;
  const special = p.b === 'board' ? boardHtml(p) : p.b === 'clinic' ? clinicHtml(p) : p.b === 'market' ? marketHtml(p) : '';
  return special ? `${head}<div class="st-grid"><div>${special}</div><div>${common}</div></div>` : `${head}${common}`;
}

/* ═════════ 전광판 (LCD · OLED) ═════════ */
const DISP_REQ = [
  {name:'야구 중계 점수판', who:'야구 좋아하는 시민들', parts:[['점수 숫자', 100], ['이닝 표시', 50], ['배경', 0]]},
  {name:'날씨 예보', who:'농부들', parts:[['해 그림', 100], ['구름', 50], ['하늘', 25]]},
  {name:'밤 경보', who:'성벽 경비대', parts:[['경고 글자', 100], ['테두리', 75], ['배경', 0]]},
  {name:'장터 광고', who:'상인들', parts:[['가격', 100], ['물건 그림', 75], ['배경', 25]]},
  {name:'영화 상영', who:'아이들', parts:[['밝은 장면', 75], ['어두운 장면', 25], ['자막', 100]]},
];
const LCD_POWER = 8, OLED_POWER = 12;
function dispReq(){ const t = T(); if (!t.disp.req || t.disp.req.day !== G.wave){ const r = DISP_REQ[(G.wave*7 + t.days*3) % DISP_REQ.length]; t.disp.req = {day:G.wave, i:DISP_REQ.indexOf(r), set:r.parts.map(() => 0)}; } return t.disp.req; }
const isOled = p => p.lv > 1;
const dispB = (p, v) => isOled(p) ? v/100 : Math.sin(rad(v))**2;   // LCD: 슬라이더 = 액정 회전 φ(0~90°), OLED: 슬라이더 = 밝기(%)
function dispCalc(p){ const R = dispReq(), r = DISP_REQ[R.i], b = R.set.map(v => dispB(p, v));
  const err = b.reduce((s, x, k) => s + Math.abs(x - r.parts[k][1]/100), 0)/b.length, acc = Math.max(0, 1 - 2*err);
  const power = isOled(p) ? Math.round(OLED_POWER*b.reduce((s, x) => s + x, 0)/b.length*10)/10 : LCD_POWER;
  return {b, acc, power}; }
function dispView(p){
  const R = dispReq(), r = DISP_REQ[R.i], c = dispCalc(p), g = x => Math.round(255*x);
  const col = k => `rgb(${g(c.b[k])},${g(c.b[k]*.92)},${g(c.b[k]*.7)})`;
  return `<svg class="pz" viewBox="0 0 280 120"><rect x="20" y="8" width="240" height="96" rx="6" fill="${col(2)}" stroke="#555"/>
    <rect x="36" y="22" width="120" height="66" rx="4" fill="${col(0)}"/><rect x="170" y="22" width="74" height="66" rx="4" fill="${col(1)}"/>
    <text x="96" y="62" text-anchor="middle" font-size="22" fill="#333">${r.parts[0][0].slice(0, 5)}</text><text x="207" y="60" text-anchor="middle" font-size="12" fill="#333">${r.parts[1][0].slice(0, 5)}</text>
    <text x="140" y="117" text-anchor="middle">${isOled(p) ? 'OLED · 화소가 직접 빛나요' : 'LCD · 백라이트 + 편광판 2장(90° 엇갈림) + 액정'}</text></svg>`;
}
function dispEq(p){ const R = dispReq(), r = DISP_REQ[R.i], c = dispCalc(p);
  const rows = r.parts.map(([nm, tg], k) => `${nm}: ${isOled(p) ? `밝기 ${R.set[k]}%` : `sin²${R.set[k]}° = ${(c.b[k]*100).toFixed(0)}%`} (목표 ${tg}%)`).join('<br>');
  return `${rows}<br>정확도 <b class="${c.acc >= .8 ? 'ok' : ''}">${Math.round(c.acc*100)}%</b> → 만족도 +${Math.round(25*c.acc*c.acc)} · 전기 <b>${c.power} ⚡</b>${isOled(p) ? ' (밝을수록 많이)' : ' (백라이트는 늘 켜져서 그림과 상관없이 같아요)'}`; }
function boardHtml(p){
  const t = T(), R = dispReq(), r = DISP_REQ[R.i], c = dispCalc(p), done = t.disp.day === G.wave;
  if (done) return `<div class="sg-lab">오늘 의뢰 · ${r.name}</div><p class="sg-v"><span class="ok">띄웠어요</span> · 정확도 ${Math.round(t.disp.acc*100)}% → 내일 만족도 +${Math.round(25*t.disp.acc*t.disp.acc)}</p><p class="muted">내일 새 의뢰가 와요.</p>`;
  if (!p.w) return `<div class="sg-lab">오늘 의뢰 · ${r.name}</div><p class="muted">전광판을 다룰 일꾼이 없어요. 일꾼을 1명 맡겨요.</p>`;
  const sl = r.parts.map(([nm], k) => `<label class="lk-row"><span>${nm} · ${isOled(p) ? '밝기' : '액정 회전 φ'}</span><b id="dpV${k}">${R.set[k]}${isOled(p) ? '%' : '°'}</b></label><input class="dpS" data-k="${k}" type="range" min="0" max="${isOled(p) ? 100 : 90}" step="1" value="${R.set[k]}" aria-label="${nm}">`).join('');
  return `<div class="sg-lab">오늘 의뢰 · ${r.who}: ${r.name}</div><div id="dpView">${dispView(p)}</div>${sl}<p class="eq" id="dpEq">${dispEq(p)}</p>
    <button class="btn primary" type="button" id="dpGo" data-tw="show" data-v="${t.plots.indexOf(p)}" ${G.energy >= c.power ? '' : `disabled data-why="배터리 부족 · ${c.power} ⚡ 필요"`}>띄우기 · ${c.power} ⚡</button>`;
}

/* ═════════ 역병 · 현미경 ═════════ */
const PATH = {bacteria:{name:'세균', size:2.0, shape:'rod'}, virus:{name:'바이러스', size:.1, shape:'ball'}};   // 크기 μm
const OPT_RES = .25, EM_NA = 1220;   // 광학 분해능 μm, 전자 현미경: 분해능 ≈ 1220λ (수차 때문에 NA가 아주 작다)
function microCalc(p){
  const P = T().plague, s = PATH[P.kind].size, M = T().micro || (T().micro = {fo:16, fe:25, kv:1});
  if (p.lv > 1 && M.em){ const lam = 1.226/Math.sqrt(M.kv*1000), res = EM_NA*lam/1000;   // nm → μm
    const burn = M.kv > 25, ok = !burn && res <= s/5; return {em:true, lam, res, burn, ok, M, s}; }
  const mag = (160/M.fo)*(250/M.fe), app = s*mag/1000, blur = OPT_RES > s/2;   // 눈에 보이는 크기 mm
  return {em:false, mag, app, blur, ok:!blur && app >= .5, M, s};
}
function microView(p){
  const c = microCalc(p), P = T().plague, shape = PATH[P.kind].shape;
  const scale = c.em ? clamp(.2/c.res*6, 1, 40) : clamp(c.app/.5*14, 1, 60), blur = c.em ? (c.burn ? 6 : clamp(c.res/(c.s/5), 0, 6)) : (c.blur ? 6 : 0);
  const bugs = [[-30, -18], [18, -6], [-8, 26], [34, 24]].map(([x, y]) => shape === 'rod' ? `<rect x="${x - scale/2}" y="${y - scale/5}" width="${scale}" height="${scale/2.5}" rx="${scale/5}" fill="#7bd96b"/>` : `<circle cx="${x}" cy="${y}" r="${scale/3}" fill="#e07bd9"/>`).join('');
  return `<svg class="scope" viewBox="-70 -70 140 140" role="img" aria-label="현미경으로 본 모습"><defs><clipPath id="mcC"><circle r="62"/></clipPath><filter id="mcB" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${blur.toFixed(2)}"/></filter></defs>
    <circle r="66" fill="${c.em ? '#1a1a1a' : '#f4f1e4'}" stroke="#ffd166" stroke-width="3"/><g clip-path="url(#mcC)" filter="url(#mcB)">${bugs}</g>${c.burn ? '<text y="4" text-anchor="middle" fill="#ff7a5a" font-size="12">시료가 타요!</text>' : ''}</svg>`;
}
function microEq(p){ const c = microCalc(p);
  if (c.em) return `전자 물질파 λ = 1.226/√V = 1.226/√${c.M.kv*1000} = <b>${(c.lam*1000).toFixed(2)} pm</b><br>분해능 ≈ 1220λ = <b>${(c.res*1000).toFixed(0)} nm</b> (병원체 ${c.s*1000} nm의 1/5 = ${c.s*200} nm 이하면 보여요)${c.burn ? '<br>25 kV 넘으면 전자가 시료를 태워요' : ''}`;
  return `배율 M = (160/${c.M.fo}) × (250/${c.M.fe}) = <b>${c.mag}배</b> → 눈에 ${(c.app*1000).toFixed(0)} μm로 보여요 (500 μm 넘어야 알아봐요)<br>광학 분해능 ≈ 0.61λ/NA ≈ ${OPT_RES} μm${c.blur ? ` → 병원체(${c.s} μm)가 더 작아서 <b>배율을 올려도 흐려요(빈 배율)</b>` : ''}`; }
function clinicHtml(p){
  const P = T().plague;
  if (!P) return `<div class="sg-lab">현미경</div><p class="muted">지금은 역병이 없어요. 위생을 높게 두면 역병이 잘 안 돌아요.</p>`;
  if (P.found) return `<div class="sg-lab">역병 · ${PATH[P.kind].name}</div><p class="sg-v"><span class="ok">정체를 밝혔어요</span> · 의사 ${p.w}명이 하루 ${Math.ceil(p.w*(P.kind === 'virus' ? 1.5 : 2))}명씩 고쳐요 · 아픈 사람 ${P.sick}</p>${p.w ? '' : '<p class="muted">의사가 없으면 못 고쳐요. 일꾼을 맡겨요.</p>'}`;
  const M = T().micro || (T().micro = {fo:16, fe:25, kv:1}), em = p.lv > 1, c = microCalc(p);
  const ctl = em && M.em ? `<label class="lk-row"><span>가속 전압</span><b id="mcV">${M.kv} kV</b></label><input id="mcS" type="range" min="1" max="30" step="1" value="${M.kv}" aria-label="가속 전압">`
    : `<div class="sg-lab">대물렌즈 f</div><div class="chips">${[16, 8, 4].map(f => `<button type="button" data-tw="fo" data-v="${f}" aria-pressed="${M.fo === f}">${f} mm</button>`).join('')}</div>
       <div class="sg-lab">접안렌즈 f</div><div class="chips">${[25, 10].map(f => `<button type="button" data-tw="fe" data-v="${f}" aria-pressed="${M.fe === f}">${f} mm</button>`).join('')}</div>`;
  return `<div class="sg-lab">역병 ${P.days}일째 · 아픈 사람 ${P.sick} · 정체 모름</div>
    ${em ? `<div class="chips"><button type="button" data-tw="em" data-v="0" aria-pressed="${!M.em}">광학 현미경</button><button type="button" data-tw="em" data-v="1" aria-pressed="${!!M.em}">전자 현미경</button></div>` : ''}
    <div id="mcView">${microView(p)}</div>${ctl}<p class="eq" id="mcEq">${microEq(p)}</p>
    <button class="btn primary" type="button" id="mcGo" data-tw="identify" ${c.ok ? '' : `disabled data-why="${!em && c.blur ? '광학 현미경으로는 안 보여요 · 진료소 2단계(전자 현미경)가 필요해요' : '아직 또렷하지 않아요'}"`}>${c.ok ? '정체 밝히기' : '아직 안 보여요'}</button>`;
}

/* ═════════ 무역 · 광자 통신 ═════════ */
const BASES = {'+':['↕', '↔'], '×':['⤢', '⤡']};
function tradeOffers(){ const t = T(); if (!t.trade.offers || t.trade.offers.day !== G.wave){
  const list = [{give:{metal:'cs', n:3}, get:{gold:110}}, {give:{metal:'na', n:4}, get:{gold:90}}, {give:{gold:120}, get:{metal:'ag', n:2}}, {give:{food:15}, get:{gold:70}}, {give:{gold:90}, get:{metal:'cs', n:3}}, {give:{metal:'ca', n:3}, get:{gold:100}}];
  const k = (G.wave*5 + t.days) % list.length; t.trade.offers = {day:G.wave, list:[list[k], list[(k + 2) % list.length], list[(k + 4) % list.length]], eve:Math.random() < .3, pick:null, run:null}; }
  return t.trade.offers; }
const goodsTxt = g => g.gold ? `${g.gold}G` : g.food ? `식량 ${g.food}` : `${METALS[g.metal].name} ${g.n}`;
const canGive = g => g.gold ? G.gold >= g.gold : g.food ? T().food >= g.food : (G.metals[g.metal] || 0) >= g.n;
function bb84(eve, n = 20){
  const rows = []; for (let i = 0; i < n; i++){
    const a = rnd(['+', '×']), bit = rint(0, 1); let carry = {b:a, bit};
    if (eve){ const e = rnd(['+', '×']); carry = {b:e, bit:e === a ? bit : rint(0, 1)}; }   // 도적이 재면 그 기저로 다시 보낸다(상태가 바뀜)
    const b = rnd(['+', '×']), got = b === carry.b ? carry.bit : rint(0, 1);
    rows.push({a, bit, b, got, keep:a === b}); }
  return rows; }
function marketHtml(p){
  const O = tradeOffers(), t = T();
  if (t.trade.sent === G.wave) return `<div class="sg-lab">오늘 무역</div><p class="muted">상단은 하루에 한 번만 떠나요. 내일 또 와요.</p>`;
  if (!p.w) return `<div class="sg-lab">오늘 무역</div><p class="muted">상인이 없어요. 일꾼을 맡겨요.</p>`;
  if (O.pick == null) return `<div class="sg-lab">오늘 들어온 거래 · 도적 소문 30%</div><div class="tb-opts">${O.list.map((o, k) => `<button type="button" class="tb-opt" data-tw="offer" data-v="${k}" ${canGive(o.give) ? '' : `disabled data-why="${goodsTxt(o.give)}이 모자라요"`}><b>${goodsTxt(o.give)} → ${goodsTxt(o.get)}</b><small>주문은 편광 광자로 몰래 보내요</small></button>`).join('')}</div>`;
  const run = O.run || (O.run = {rows:bb84(O.eve), check:0, shown:false});
  const kept = run.rows.filter(r => r.keep), chk = kept.slice(0, run.check), err = chk.filter(r => r.got !== r.bit).length, left = kept.length - run.check;
  const tbl = `<table class="bb"><tr><th>#</th>${run.rows.map((_, i) => `<th>${i + 1}</th>`).join('')}</tr>
    <tr><td>보낸 빛</td>${run.rows.map(r => `<td>${BASES[r.a][r.bit]}</td>`).join('')}</tr>
    <tr><td>상단 기저</td>${run.rows.map(r => `<td>${r.b}</td>`).join('')}</tr>
    <tr><td>기저 같음</td>${run.rows.map(r => `<td class="${r.keep ? 'ok' : 'dim'}">${r.keep ? '✓' : '·'}</td>`).join('')}</tr>
    <tr><td>검사</td>${run.rows.map(r => { const k = kept.indexOf(r); return `<td>${k >= 0 && k < run.check ? (r.got === r.bit ? '○' : '<b class="bad">✗</b>') : ''}</td>`; }).join('')}</tr></table>`;
  return `<div class="sg-lab">${goodsTxt(O.list[O.pick].give)} → ${goodsTxt(O.list[O.pick].get)} · 비밀 열쇠 나누기</div>
    <div class="bbw">${tbl}</div>
    <label class="lk-row"><span>공개해서 비교할 비트</span><b id="bbV">${run.check}개</b></label><input id="bbS" type="range" min="0" max="${Math.max(0, kept.length - 3)}" step="1" value="${run.check}" aria-label="검사할 비트 수">
    <p class="eq">기저가 같은 ${kept.length}개만 열쇠로 남겨요 · 그중 ${run.check}개를 공개해 비교 → 틀린 것 <b class="${err ? 'bad' : ''}">${err}개</b><br>도적이 중간에 재면 남긴 것의 약 25%가 틀려요 → ${run.check}개 다 맞을 확률 ${Math.round(Math.pow(.75, run.check)*100)}% (도적이 있어도 못 알아챌 확률)<br>남은 열쇠 ${left}비트 (3비트 넘어야 주문을 숨길 수 있어요)</p>
    <div class="btns"><button class="btn primary" type="button" data-tw="send" ${left >= 3 ? '' : 'disabled data-why="열쇠가 모자라요 · 검사할 비트를 줄여요"'}>이 열쇠로 주문 보내기</button><button class="btn" type="button" data-tw="abort">${err ? '도청 들킴! 길 바꾸기(취소)' : '취소'}</button></div>`;
}

/* ── 버튼 · 슬라이더 ── */
$('cards').addEventListener('click', ev => {
  const b = ev.target.closest('[data-tw]'); if (!b || b.disabled) return;
  const a = b.dataset.tw, v = b.dataset.v, t = T();
  if (a === 'build'){ const k = b.dataset.k, i = +v; if (t.plots[i] || G.gold < TB[k].cost) return; G.gold -= TB[k].cost; t.plots[i] = {b:k, lv:1, w:0};
    if (TB[k].jobs){ t.plots[i].w = Math.min(TB[k].jobs, idle()); } hint(`${TB[k].name}을 지었어요${TB[k].jobs ? ` · 노는 시민 ${t.plots[i].w}명을 맡겼어요` : ''}`); }
  else if (a === 'up'){ const p = t.plots[+v], c = upCost(p.b, p.lv); if (G.gold < c) return; G.gold -= c; p.lv++; hint(`${TB[p.b].name} ${p.lv}단계`); }
  else if (a === 'raze'){ const p = t.plots[+v]; if (!p) return; G.gold += Math.round(TB[p.b].cost/2); t.plots[+v] = null; if (p.b === 'house') t.pop = Math.min(t.pop, Math.max(1, cap())); townFixJobs(); hint(`${TB[p.b].name}을 허물었어요`); }
  else if (a === 'w+'){ const p = t.plots[+v]; if (p && p.w < TB[p.b].jobs && idle()) p.w++; }
  else if (a === 'w-'){ const p = t.plots[+v]; if (p && p.w) p.w--; }
  else if (a === 'tax') t.tax = +v;
  else if (a === 'show'){ const p = t.plots[+v], c = dispCalc(p); if (G.energy < c.power || t.disp.day === G.wave) return; G.energy -= c.power; t.disp.day = G.wave; t.disp.acc = c.acc; const fee = Math.round(10 + 30*c.acc); G.gold += fee; hint(`전광판에 띄웠어요 · 정확도 ${Math.round(c.acc*100)}% · 의뢰비 ${fee}G`); }
  else if (a === 'fo'){ T().micro.fo = +v; } else if (a === 'fe'){ T().micro.fe = +v; } else if (a === 'em'){ T().micro.em = !!+v; }
  else if (a === 'identify'){ const P = t.plague; if (!P) return; P.found = true; hint(`정체를 밝혔어요: ${PATH[P.kind].name} · 진료소가 치료를 시작해요`); }
  else if (a === 'offer'){ const O = tradeOffers(); O.pick = +v; O.run = null; }
  else if (a === 'abort'){ const O = tradeOffers(); O.pick = null; O.run = null; hint(O.eve ? '길을 바꿨어요 · 도적을 피했어요' : '거래를 그만뒀어요'); O.eve = Math.random() < .3; }
  else if (a === 'send'){ const O = tradeOffers(), o = O.list[O.pick]; if (!canGive(o.give)) return; t.trade.sent = G.wave;
    const take = g => { if (g.gold) G.gold -= g.gold; else if (g.food) t.food -= g.food; else G.metals[g.metal] -= g.n; };
    const give = g => { if (g.gold) G.gold += g.gold; else if (g.food) t.food += g.food; else G.metals[g.metal] = (G.metals[g.metal] || 0) + g.n; };
    take(o.give); if (O.eve){ hint('도적이 주문을 엿봤어요! 상단이 털렸어요 · 다음엔 더 많이 검사해요'); } else { give(o.get); hint(`무역 성공 · ${goodsTxt(o.get)}`); } O.pick = null; O.run = null; }
  else return;
  renderAll();
});
document.addEventListener('input', ev => {
  const el = ev.target; const set = (id, f) => { const e = document.getElementById(id); if (e) f(e); };
  if (el.classList && el.classList.contains('dpS')){ const t = T(), i = +UI.site.slice(4), p = t.plots[i]; if (!p) return; const R = dispReq(); R.set[+el.dataset.k] = +el.value;
    set(`dpV${el.dataset.k}`, e => e.textContent = `${el.value}${isOled(p) ? '%' : '°'}`); set('dpView', e => e.innerHTML = dispView(p)); set('dpEq', e => e.innerHTML = dispEq(p));
    const c = dispCalc(p); set('dpGo', e => { e.textContent = `띄우기 · ${c.power} ⚡`; e.disabled = G.energy < c.power; }); }
  if (el.id === 'mcS'){ const p = T().plots[+UI.site.slice(4)]; T().micro.kv = +el.value; set('mcV', e => e.textContent = `${el.value} kV`); set('mcView', e => e.innerHTML = microView(p)); set('mcEq', e => e.innerHTML = microEq(p));
    const c = microCalc(p); set('mcGo', e => { e.disabled = !c.ok; e.textContent = c.ok ? '정체 밝히기' : '아직 안 보여요'; if (c.ok) e.removeAttribute('data-why'); else e.dataset.why = '아직 또렷하지 않아요'; }); }
  if (el.id === 'bbS'){ const O = tradeOffers(); if (O.run) O.run.check = +el.value; renderAll(); }
});

/* ── 날이 밝으면 마을 계산 · 아침 보고 ── */
const _waveCleared12 = window.waveCleared;
window.waveCleared = function(){
  const out = townTick();
  _waveCleared12();
  if (G.report){ G.report.town = out; renderAll(); }   // 원래 함수가 보고서를 새로 만든 뒤에 마을 줄을 붙인다
  if (out.plagueStart){ const b = $('banner'); if (b){ b.innerHTML = `<b>마을에 역병이 돌아요!</b><span>아픈 사람 ${T().plague.sick}명 · 진료소 현미경으로 정체를 밝혀야 고칠 수 있어요${has('clinic') ? '' : '<br>진료소가 없어요! 빈 땅에 지어요'}</span>`; b.hidden = false; clearTimeout(showBossBanner.t); showBossBanner.t = setTimeout(() => { b.hidden = true; }, 6000); } }
};
const _clearedPanel12 = window.clearedPanel;
window.clearedPanel = function(){
  _clearedPanel12();
  const o = (G.report || {}).town, d = $('result'); if (!o || !d) return;
  const rows = d.querySelector('.rows'); if (!rows || rows.querySelector('.tw-r')) return;
  const sg = v => v > 0 ? `+${v}` : `${v}`, mt = Object.entries(o.metals || {}).map(([k, n]) => `${METALS[k].name} ${n}`).join(' · ');
  rows.insertAdjacentHTML('beforeend', `<div class="row tw-r"><span>마을 세금</span><b>+${o.tax}G</b></div>
    <div class="row tw-r"><span>마을</span><b>👥 ${T().pop}(${sg(o.pop)}) · 🌾 ${sg(o.food)} · 😊 ${o.happy} · 위생 ${o.san}</b></div>
    ${mt ? `<div class="row tw-r"><span>광산</span><b>${mt}</b></div>` : ''}
    ${o.starve ? `<div class="row tw-r bad"><span>굶주림</span><b>−${o.starve}명</b></div>` : ''}${o.died ? `<div class="row tw-r bad"><span>역병으로</span><b>−${o.died}명</b></div>` : ''}
    ${o.plagueStart ? `<div class="row tw-r bad"><span>역병 발생</span><b>진료소 현미경으로!</b></div>` : ''}${o.plagueEnd ? `<div class="row tw-r"><span>역병</span><b>끝났어요</b></div>` : ''}`);
};
