'use strict';
/* ═════════ 학습 모드: 문제 (매번 새로 출제) · 경통은 cm, 전장은 m ═════════ */
const fEl = id => F.free.find(e => e.id === id);
const PTYPES = [
  {type:'medium', short:'매질 고르기', unit:'22번 광전 효과'},
  {type:'cavity', short:'출력 거울', unit:'23번 레이저'},
  {type:'focus',  short:'초점 맞추기', unit:'20번 광학 기기'},
  {type:'lampimg', short:'램프 상 맺기', unit:'20번 광학 기기'},
  {type:'mag',    short:'배율 · 상 크기', unit:'20번 광학 기기'},
  {type:'lenseq', short:'렌즈 두 개', unit:'20번 광학 기기'},
  {type:'tele',   short:'망원경 배치', unit:'20번 광학 기기'},
  {type:'pol1',   short:'편광판 한 장', unit:'21번 편광'},
  {type:'pol2',   short:'편광판 여러 장', unit:'21번 편광'},
  {type:'disp',   short:'디스플레이', unit:'21 · 22번'},
];
const COS_GIVEN = ['cos(α ± β) = cos α cos β ∓ sin α sin β', 'sin 30° = 1/2, cos 30° = √3/2, cos 45° = √2/2'];
const tPct = t => Math.round(t*1000)/10;
function polChain(start, plates, armor){
  let pol = start, t = 1; const steps = [];
  for (const th of plates){ const v = pol == null ? .5 : cos2(th - pol); steps.push(pol == null ? '자연광 → ½' : `cos²(${th}° − ${pol}°) = ${v.toFixed(3)}`); t *= v; pol = th; }
  if (armor != null){ const v = pol == null ? .5 : cos2(armor - pol); steps.push(pol == null ? '갑옷: 자연광 → ½' : `갑옷 cos²(${armor}° − ${pol}°) = ${v.toFixed(3)}`); t *= v; }
  return {t, steps};
}
const LAMPS = ['bulb', 'fluo', 'led'];
// 매질은 값이 싼 순서(루비 → 질소)로 정렬돼 있어요
const cheapest = ok => MEDIA_LIST.filter(m => !m.research).find(m => ok(1240/m.nm));
const imgTotal = (a, f) => a + a*f/(a - f);   // 광원에서 상까지 (cm)
function genProblem(type, hard){
  const meta = PTYPES.find(p => p.type === type);
  const P = Object.assign({type, hard, reward:hard ? 60 : 30, given:[], inputs:[], bin:[], hint:''}, meta);
  const S = {source:'laser', medium:'argon', pump:2, R:.92, loss:.03, barrel:40, free:[], dummy:{x:20, foe:'na'}};
  if (type === 'medium'){
    S.medium = null; P.bin = ['medium']; S.barrel = 20;
    if (!hard){
      const W = rnd([1.8, 1.9, 2.0, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.8, 3.0, 3.2]), ans = cheapest(E => E > W);
      S.dummy = {x:20, foe:W >= 2.8 ? 'ca' : 'na', W};
      P.title = '광전 효과 · 매질 고르기';
      P.text = `이 적의 일함수는 <b>W = ${W} eV</b>예요. 전자를 떼어 낼 수 있는 매질 중 <b>가장 싼 것</b>을 부품함에서 끌어다 공진기에 끼우세요.`;
      P.given = ['hc = 1240 eV·nm', 'E = hc / λ', 'E &gt; W 여야 광전자가 튀어나와요', '부품함은 위에서부터 싼 순서예요'];
      P.check = () => { if (!F.medium) return {ok:false, msg:'공진기에 매질이 없어요.'};
        const m = MEDIA[F.medium], E = 1240/m.nm;
        if (E <= W) return {ok:false, msg:`E = 1240 / ${m.nm} = ${E.toFixed(2)} eV ≤ ${W} eV → 전자가 안 튀어나와요.`};
        if (m.id !== ans.id) return {ok:false, msg:`E = ${E.toFixed(2)} eV라 데미지는 들어가요. 더 싼 매질도 되는지 계산해 보세요.`};
        return {ok:true, msg:`E = 1240 / ${m.nm} = ${E.toFixed(2)} eV &gt; ${W} eV · 더 싼 매질은 전부 E ≤ W예요.`}; };
      P.hint = '부품함의 파장(nm)을 하나씩 E = 1240 / λ로 바꿔 보세요.';
    } else {
      const W = rnd([1.6, 1.7, 1.8, 1.9, 2.0, 2.1]), need = rnd([.3, .4, .5]), ans = cheapest(E => E - W >= need);
      S.dummy = {x:20, foe:'cs', W};
      P.title = '광전 효과 · 정지 전압';
      P.text = `적의 일함수는 <b>W = ${W} eV</b>예요. 정지 전압(= 광전자의 최대 운동 에너지 ÷ e)이 <b>${need} V 이상</b>이 되는 매질 중 가장 싼 것을 끼우세요.`;
      P.given = ['hc = 1240 eV·nm', 'E = hc / λ', 'eV₀ = E_k,max = E − W'];
      P.check = () => { if (!F.medium) return {ok:false, msg:'공진기에 매질이 없어요.'};
        const m = MEDIA[F.medium], E = 1240/m.nm, K2 = E - W;
        if (K2 < need) return {ok:false, msg:`V₀ = ${E.toFixed(2)} − ${W} = ${K2.toFixed(2)} V &lt; ${need} V`};
        if (m.id !== ans.id) return {ok:false, msg:`V₀ = ${K2.toFixed(2)} V로 조건은 맞아요. 더 싼 매질도 되는지 보세요.`};
        return {ok:true, msg:`V₀ = ${E.toFixed(2)} − ${W} = ${K2.toFixed(2)} V ≥ ${need} V · 정지 전압이 클수록 저항 큰 적에게 세요.`}; };
      P.hint = '각 매질의 E를 구하고 W를 빼 보세요.';
    }
  } else if (type === 'cavity'){
    const pump = hard ? rint(1, 3) : rnd([1, 2, 3]), L = hard ? rnd([2, 4, 5, 6]) : 3, g0 = Math.round(PUMPS[pump-1].g0*100), Rmin = 100 - (g0 - L) + 1;
    Object.assign(S, {pump, R:.6, loss:L/100, barrel:20, dummy:{x:20, foe:'cs'}});
    P.title = '공진기 · 출력 거울 반사율';
    P.text = `${PUMPS[pump-1].label}의 왕복 이득은 <b>g₀ = ${g0}%</b>, 공진기 안 손실은 <b>${L}%</b>예요. 레이저가 발진하는 출력 거울 반사율 R 중 <b>가장 낮은 값</b>(정수 %)을 넣으세요.`;
    P.given = ['투과 T = 1 − R', '발진 조건: g₀ &gt; T + 손실'];
    P.inputs = [{key:'R', label:'출력 거울 반사율 R', unit:'%', min:50, max:99, step:1}];
    P.check = () => { const R = Math.round(F.R*100), T = 100 - R;
      if (T + L >= g0) return {ok:false, msg:`T + 손실 = ${T} + ${L} = ${T+L}% ≥ ${g0}% → 발진 안 함.`};
      if (R > Rmin) return {ok:false, msg:`T + 손실 = ${T+L}% &lt; ${g0}%라 발진은 해요. 더 낮은 R도 되는지 따져 보세요.`};
      return {ok:true, msg:`T &lt; ${g0}% − ${L}% = ${g0-L}% → R &gt; ${100-(g0-L)}% → ${Rmin}%. ${100-(g0-L)}%면 이득과 손실이 똑같아서 발진하지 않아요.`}; };
    P.hint = `T &lt; g₀ − 손실 을 먼저 구하세요.`;
  } else if (type === 'focus'){
    const x0 = rnd([5, 10, 15, 20, 25, 30]), D = rint(15, 60), f = D*100 - x0;
    S.barrel = 40; S.dummy = {x:D, foe:'na'};
    P.given = ['레이저는 평행광 → a = ∞ → b = f', '거리는 모두 광원(경통 0 cm)에서 재요', '1 m = 100 cm'];
    if (!hard){
      S.free = [{id:1, type:'convex', x:x0, f:1000}];
      P.title = '볼록 렌즈 · 초점 맞추기';
      P.text = `적이 광원에서 <b>${D} m</b> 떨어진 곳에 몰려 있어요. 볼록 렌즈는 경통 <b>${x0} cm</b>에 있어요. 빛을 적에게 모으려면 초점 거리 f는 몇 cm일까요?`;
      P.inputs = [{key:'f', id:1, label:'볼록 렌즈 초점 거리 f', unit:'cm', min:100, max:9999, step:1}];
      P.check = () => { const v = fEl(1).f; return v === f ? {ok:true, msg:`${D} m = ${D*100} cm · b = ${D*100} − ${x0} = ${f} cm = f → 초점!`} : {ok:false, msg:`빛이 광원에서 ${r1((x0 + v)/100)} m에 모여요. 적은 ${D} m에 있어요.`}; };
      P.hint = 'm를 cm로 바꾼 뒤, 렌즈 위치만큼 빼세요.';
    } else {
      S.free = [{id:1, type:'convex', x:5, f}];
      P.title = '볼록 렌즈 · 렌즈 위치 정하기';
      P.text = `초점 거리 <b>f = ${f} cm</b>인 볼록 렌즈가 있어요. 적이 광원에서 <b>${D} m</b>에 있을 때, 렌즈를 경통 몇 cm에 놓아야 할까요?`;
      P.inputs = [{key:'x', id:1, label:'렌즈 위치', unit:'cm', min:1, max:39, step:1}];
      P.check = () => { const v = fEl(1).x; return v === x0 ? {ok:true, msg:`${D*100} − ${f} = ${x0} cm`} : {ok:false, msg:`빛이 광원에서 ${r1((v + f)/100)} m에 모여요. 적은 ${D} m에 있어요.`}; };
      P.hint = '렌즈에서 f만큼 떨어진 곳에 빛이 모여요. 단위를 맞추세요.';
    }
  } else if (type === 'lampimg'){
    const src = rnd(LAMPS); S.source = src; S.barrel = 80;
    P.given = ['광원(물체)은 경통 0 cm → 물체 거리 a = 렌즈 위치', '1/a + 1/b = 1/f', '답은 광원에서 잰 거리(a + b), m 단위'];
    if (!hard){
      let a, dl, T, tries = 0;
      do { a = rnd([20, 30, 40, 50, 60, 75]); dl = rnd([.5, 1, 1.5, 2, 2.5, 3, 4, 5]); T = imgTotal(a, a - dl); } while ((T > 9500 || T < 500 || Math.abs(T/10 - Math.round(T/10)) > 1e-6) && ++tries < 300);
      const f = a - dl, ans = r1(T/100);
      S.free = [{id:1, type:'convex', x:a, f}]; S.dummy = {x:clamp(Math.round(ans), 2, 100), foe:'ag'};
      P.title = '램프의 상 · 상 위치 구하기';
      P.text = `${SOURCES[src].name}를 경통 0 cm에 두고, 초점 거리 <b>f = ${f} cm</b>인 볼록 렌즈를 <b>${a} cm</b>에 놓았어요. 광원의 실상은 광원에서 몇 m 떨어진 곳에 맺힐까요?`;
      P.inputs = [{key:'ans', label:'상 위치 (광원에서)', unit:'m', min:0, max:200, step:.1}];
      P.check = () => { const v = +F.ans; return Math.abs(v - ans) <= .15 ? {ok:true, msg:`b = af/(a − f) = ${a}×${f}/${dl} = ${r1(T - a)} cm → a + b = ${r1(T)} cm = ${ans} m · 배율 ${r1((T - a)/a)}배`} : {ok:false, msg:`${v} m는 아니에요. b를 cm로 구한 뒤 a를 더하고 m로 바꿔요.`}; };
      P.hint = 'b = af / (a − f). a − f가 작을수록 상이 아주 멀리 맺혀요.';
    } else {
      const a = rnd([40, 50, 60, 75]), T = rint(8, 40), b = T*100 - a, fx = a*b/(a + b);
      S.free = [{id:1, type:'convex', x:a, f:a - 5}]; S.dummy = {x:T, foe:'ag'};
      P.title = '램프의 상 · 초점 거리 고르기';
      P.text = `${SOURCES[src].name}를 경통 0 cm에, 볼록 렌즈를 <b>${a} cm</b>에 놓았어요. 광원에서 <b>${T} m</b> 떨어진 적에게 광원의 실상을 맺으려면 초점 거리 f는? (소수 첫째 자리 cm)`;
      P.inputs = [{key:'f', id:1, label:'볼록 렌즈 초점 거리 f', unit:'cm', min:1, max:a - .1, step:.1}];
      P.check = () => { const v = fEl(1).f; if (v >= a) return {ok:false, msg:'f ≥ a라 실상이 안 생기고 빛이 퍼져요.'};
        const at = imgTotal(a, v)/100;
        return Math.abs(at - T) <= Math.max(1, T*.06) ? {ok:true, msg:`b = ${T*100} − ${a} = ${b} cm → 1/f = 1/${a} + 1/${b} → f = ${fx.toFixed(2)} cm · 상 ${r1(at)} m`} : {ok:false, msg:`상이 광원에서 ${r1(at)} m에 맺혀요. 목표는 ${T} m예요. f를 0.1 cm만 바꿔도 상이 크게 움직여요.`}; };
      P.hint = `b = ${T} m − ${a} cm를 cm로 맞춘 다음 렌즈 방정식에 넣어요.`;
    }
  } else if (type === 'mag'){
    const src = rnd(LAMPS), s = SOURCES[src].s; S.source = src; S.barrel = 80;
    let a, T, f, b;
    if (!hard){ a = rnd([20, 25, 40, 50]); T = rnd([10, 12, 15, 20, 25]); b = T*100 - a; f = r1(a*b/(a + b)); }
    else { let dl, tries = 0; do { a = rnd([20, 30, 40, 50, 60]); dl = rnd([1, 2, 2.5, 4, 5]); f = a - dl; b = a*f/dl; } while ((a + b > 9500 || a + b < 500) && ++tries < 200); T = r1((a + b)/100); }
    const ans = r1(s*b/a);
    S.free = [{id:1, type:'convex', x:a, f}]; S.dummy = {x:clamp(Math.round(T), 2, 100), foe:'ag'};
    P.title = hard ? '배율 · 상 크기 (상 위치부터)' : '배율 · 상 크기';
    P.text = hard ? `${SOURCES[src].name}(빛나는 부분 반지름 <b>${s} cm</b>)를 경통 0 cm에, f = <b>${f} cm</b> 볼록 렌즈를 <b>${a} cm</b>에 놓았어요. 상에서 빛 원의 반지름은 몇 cm일까요?`
                  : `${SOURCES[src].name}(빛나는 부분 반지름 <b>${s} cm</b>)의 상이 광원에서 <b>${T} m</b>에 맺혔어요. 렌즈는 경통 <b>${a} cm</b>에 있어요. 상에서 빛 원의 반지름은 몇 cm일까요?`;
    P.given = ['배율 = 상 거리 / 물체 거리 = b / a', '상의 크기 = 광원 크기 × 배율', ...(hard ? ['1/a + 1/b = 1/f'] : ['b = (광원에서 상까지) − a'])];
    P.inputs = [{key:'ans', label:'상의 반지름', unit:'cm', min:0, max:999, step:.1}];
    P.check = () => { const v = +F.ans; return Math.abs(v - ans) <= Math.max(.15, ans*.03) ? {ok:true, msg:`b = ${r1(b)} cm → 배율 ${r1(b)}/${a} = ${r1(b/a)}배 → ${s} × ${r1(b/a)} = ${ans} cm. 경통을 길게(a↑) 하면 상이 작아져서 빛이 더 모여요.`} : {ok:false, msg:`${v} cm는 아니에요.`}; };
    P.hint = '먼저 b를 cm로 구하고, b/a를 곱하세요.';
  } else if (type === 'lenseq'){
    const f1 = rnd([5, 10]), x1 = rnd([5, 10]), L = rnd([10, 15, 20]), a = f1 + L, x2 = x1 + L;
    S.barrel = 40; P.given = ['오목 렌즈를 지난 평행광은 렌즈 앞 초점에서 나온 것처럼 퍼져요', '1/a + 1/b = 1/f', '답은 광원(0 cm)에서 잰 거리'];
    if (!hard){
      let dl, T, tries = 0; do { dl = rnd([.5, 1, 1.5, 2, 2.5]); T = x2 + a*(a - dl)/dl; } while ((T > 9500 || T < 600 || Math.abs(T/10 - Math.round(T/10)) > 1e-6) && ++tries < 200);
      const f = a - dl, ans = r1(T/100);
      S.free = [{id:1, type:'concave', x:x1, f:f1}, {id:2, type:'convex', x:x2, f}]; S.dummy = {x:clamp(Math.round(ans), 2, 100), foe:'na'};
      P.title = '렌즈 두 개 · 초점 위치';
      P.text = `오목 렌즈(f = ${f1} cm)를 경통 <b>${x1} cm</b>에, 볼록 렌즈(f = <b>${f} cm</b>)를 <b>${x2} cm</b>에 놓았어요. 레이저 빛은 광원에서 몇 m에 모일까요?`;
      P.inputs = [{key:'ans', label:'빛이 모이는 곳 (광원에서)', unit:'m', min:0, max:200, step:.1}];
      P.check = () => { const v = +F.ans; return Math.abs(v - ans) <= .15 ? {ok:true, msg:`a = ${f1} + ${L} = ${a} cm, b = ${a}×${f}/${dl} = ${r1(T - x2)} cm → ${x2} + ${r1(T - x2)} = ${r1(T)} cm = ${ans} m`} : {ok:false, msg:`${v} m는 아니에요.`}; };
      P.hint = `볼록 렌즈 입장에서 빛은 오목 렌즈 초점(경통 ${x1 - f1} cm)에서 출발한 것처럼 보여요.`;
    } else {
      const T = rint(10, 40), b = T*100 - x2, fx = a*b/(a + b);
      S.free = [{id:1, type:'concave', x:x1, f:f1}, {id:2, type:'convex', x:x2, f:a - 3}]; S.dummy = {x:T, foe:'na'};
      P.title = '렌즈 두 개 · 초점 거리 구하기';
      P.text = `오목 렌즈(f = ${f1} cm)를 경통 <b>${x1} cm</b>에, 볼록 렌즈를 <b>${x2} cm</b>에 놓았어요. 빛을 광원에서 <b>${T} m</b>에 모으려면 볼록 렌즈의 f는? (소수 둘째 자리 cm)`;
      P.inputs = [{key:'f', id:2, label:'볼록 렌즈 초점 거리 f', unit:'cm', min:1, max:a - .01, step:.01}];
      P.check = () => { const v = fEl(2).f; if (v >= a) return {ok:false, msg:'빛이 모이지 않고 계속 퍼져요. f가 너무 커요.'};
        const at = (x2 + a*v/(a - v))/100;
        return Math.abs(at - T) <= Math.max(1, T*.06) ? {ok:true, msg:`a = ${a} cm, b = ${b} cm → 1/f = 1/${a} + 1/${b} → f = ${fx.toFixed(2)} cm · 초점 ${r1(at)} m`} : {ok:false, msg:`빛이 ${r1(at)} m에 모여요. 목표는 ${T} m예요.`}; };
      P.hint = `볼록 렌즈 기준 물체 거리 a = ${f1} + ${L} = ${a} cm`;
    }
  } else if (type === 'tele'){
    S.barrel = 80; S.dummy = {x:60, foe:'na'};
    if (!hard){
      const f1 = rnd([5, 8, 10]), x1 = rnd([5, 10]), f2 = rnd([20, 30, 40, 50]), ans = x1 + f1 + f2;
      S.free = [{id:1, type:'convex', x:x1, f:f1}, {id:2, type:'convex', x:x1 + 5, f:f2}];
      P.title = '케플러식 빔 확대기';
      P.text = `볼록 렌즈 f₁ = ${f1} cm를 경통 <b>${x1} cm</b>에 놓았어요. 볼록 렌즈 f₂ = ${f2} cm를 어디에 놓아야 빛이 다시 평행광이 될까요?`;
      P.given = ['대물렌즈 초점에 생긴 상이 접안렌즈 초점에 있으면 평행광으로 나가요', '빔이 f₂/f₁배 넓어지면 퍼지는 각은 f₁/f₂배로 줄어요'];
      P.inputs = [{key:'x', id:2, label:'두 번째 렌즈 위치', unit:'cm', min:x1 + 1, max:79, step:1}];
      P.check = () => { const v = fEl(2).x; return v === ans ? {ok:true, msg:`두 렌즈 사이 = ${f1} + ${f2} = ${f1 + f2} cm → ${ans} cm · 빔 폭 ×${(f2/f1).toFixed(2)}, 퍼짐 ÷${(f2/f1).toFixed(2)}`} : {ok:false, msg:`두 렌즈 사이가 ${v - x1} cm라 평행광이 아니에요.`}; };
      P.hint = '두 렌즈 사이 거리 = f₁ + f₂';
    } else {
      const f1 = rnd([5, 8, 10]), x1 = rnd([5, 10]), f2 = rnd([30, 40, 60]), ans = x1 + f2 - f1;
      S.free = [{id:1, type:'concave', x:x1, f:f1}, {id:2, type:'convex', x:x1 + 2, f:f2}];
      P.title = '갈릴레이식 빔 확대기';
      P.text = `오목 렌즈 f₁ = ${f1} cm를 경통 <b>${x1} cm</b>에 놓았어요. 볼록 렌즈 f₂ = ${f2} cm를 어디에 놓아야 빛이 다시 평행광이 될까요?`;
      P.given = ['오목 렌즈를 지난 빛은 렌즈 앞 초점에서 나온 것처럼 퍼져요', '볼록 렌즈 초점에서 나온 빛은 평행광이 돼요'];
      P.inputs = [{key:'x', id:2, label:'볼록 렌즈 위치', unit:'cm', min:x1 + 1, max:79, step:1}];
      P.check = () => { const v = fEl(2).x; return v === ans ? {ok:true, msg:`두 렌즈 사이 = f₂ − f₁ = ${f2 - f1} cm → ${ans} cm · 빔 폭 ×${(f2/f1).toFixed(2)}`} : {ok:false, msg:`두 렌즈 사이가 ${v - x1} cm라 평행광이 아니에요.`}; };
      P.hint = '퍼져 나오는 점(오목 렌즈 초점)이 볼록 렌즈 초점과 겹쳐야 해요.';
    }
  } else if (type === 'pol1'){
    S.barrel = 40;
    if (Math.random() < .45){
      const src = rnd(LAMPS), th = hard ? rnd([15, 75, 105]) : rnd([0, 30, 45, 60]), A = hard ? rnd([30, 60, 90, 120]) : rnd([60, 90]), c = polChain(null, [th], A), ans = tPct(c.t);
      S.source = src; S.free = [{id:1, type:'pol', x:10, theta:th}]; S.dummy = {x:20, foe:'kn', armor:A};
      P.title = hard ? '자연광 · 편광판 · 특수각 아닌 각' : '자연광 · 편광판 한 장';
      P.text = `${SOURCES[src].name} 빛은 편광 안 된 자연광이에요. 편광판 <b>${th}°</b> → 갑옷 <b>${A}°</b>을 지나면 처음 세기의 몇 %일까요? (소수 첫째 자리까지)`;
      P.given = ['자연광이 편광판 한 장을 지나면 세기 ½', '그다음부터는 cos²(각도 차)', ...(hard ? COS_GIVEN : [])];
      P.inputs = [{key:'ans', label:'투과율', unit:'%', min:0, max:100, step:.1}];
      P.check = () => { const v = +F.ans; return Math.abs(v - ans) <= .15 ? {ok:true, msg:`${c.steps.join(' × ')} = ${c.t.toFixed(4)} → ${ans}%`} : {ok:false, msg:`${v}%는 아니에요.`}; };
      P.hint = '첫 판은 각도와 상관없이 ½이에요.';
      P.setup = S; return P;
    }
    if (!hard){
      const A = rnd([60, 90]);
      S.free = [{id:1, type:'pol', x:10, theta:0}]; S.dummy = {x:20, foe:'kn', armor:A};
      let best = 0; for (let th = 0; th <= 180; th += 5) best = Math.max(best, cos2(th)*cos2(th - A));
      P.title = '편광판 한 장 · 기사 뚫기';
      P.text = `레이저는 <b>0°</b>로 진동하는 선형 편광이에요. 편광 기사의 갑옷 투과축은 <b>${A}°</b>예요. 편광판 한 장으로 갑옷을 지나는 빛을 최대로 하려면 투과축 θ는?`;
      P.given = ['말뤼스 법칙 I = I₀ cos²(각도 차)', '레이저는 이미 편광된 빛이라 첫 판에서 ½이 아니라 cos²θ'];
      P.inputs = [{key:'theta', id:1, label:'편광판 투과축 θ', unit:'°', min:0, max:180, step:5}];
      P.check = () => { const th = fEl(1).theta, v = cos2(th)*cos2(th - A);
        return v >= best - 1e-9 ? {ok:true, msg:`cos²${th}° × cos²(${th}° − ${A}°) = ${v.toFixed(3)} · 한 장으로는 이게 최대예요.`} : {ok:false, msg:`투과 = cos²${th}° × cos²(${th}° − ${A}°) = ${v.toFixed(3)}`}; };
      P.hint = '두 각도 차가 똑같을 때 곱이 가장 커요.';
    } else {
      const th = rnd([15, 75, 105, 165]), A = rnd([30, 60, 90, 120]), c = polChain(0, [th], A), ans = tPct(c.t);
      S.free = [{id:1, type:'pol', x:10, theta:th}]; S.dummy = {x:20, foe:'kn', armor:A};
      P.title = '편광판 한 장 · 투과율 계산';
      P.text = `레이저(0°) → 편광판 <b>${th}°</b> → 갑옷 <b>${A}°</b>. 갑옷을 지나는 빛은 처음의 몇 %일까요? (소수 첫째 자리까지)`;
      P.given = ['말뤼스 법칙 I = I₀ cos²(각도 차)', ...COS_GIVEN];
      P.inputs = [{key:'ans', label:'투과율', unit:'%', min:0, max:100, step:.1}];
      P.check = () => { const v = +F.ans; return Math.abs(v - ans) <= .15 ? {ok:true, msg:`${c.steps.join(' × ')} = ${(c.t).toFixed(4)} → ${ans}%`} : {ok:false, msg:`${v}%는 아니에요.`}; };
      P.hint = `cos ${th}°를 덧셈정리로 바꿔 보세요 (예: 75° = 45° + 30°).`;
    }
  } else if (type === 'pol2'){
    S.barrel = 40;
    if (Math.random() < .4){
      const src = rnd(LAMPS), sets = hard ? [[15, 60, 90], [15, 75, 90], [30, 75, 120], [45, 105, 90]] : [[30, 60, 90], [0, 45, 90], [45, 90, 90], [0, 60, 90]], [a, b, A] = rnd(sets), c = polChain(null, [a, b], A), ans = tPct(c.t);
      S.source = src; S.free = [{id:1, type:'pol', x:10, theta:a}, {id:2, type:'pol', x:20, theta:b}]; S.dummy = {x:20, foe:'kn', armor:A};
      P.title = '자연광 · 편광판 두 장';
      P.text = `${SOURCES[src].name}(자연광) → 편광판 <b>${a}°</b> → 편광판 <b>${b}°</b> → 갑옷 <b>${A}°</b>. 처음 세기의 몇 %가 남을까요? (소수 첫째 자리까지)`;
      P.given = ['자연광이 첫 편광판을 지나면 ½', '그다음부터는 cos²(각도 차)', ...(hard ? COS_GIVEN : [])];
      P.inputs = [{key:'ans', label:'투과율', unit:'%', min:0, max:100, step:.1}];
      P.check = () => { const v = +F.ans; return Math.abs(v - ans) <= .15 ? {ok:true, msg:`${c.steps.join(' × ')} = ${c.t.toFixed(4)} → ${ans}%`} : {ok:false, msg:`${v}%는 아니에요.`}; };
      P.hint = '½ × cos²(θ₂ − θ₁) × cos²(갑옷 − θ₂)';
      P.setup = S; return P;
    }
    if (!hard){
      if (Math.random() < .5){
        S.free = [{id:1, type:'pol', x:10, theta:0}, {id:2, type:'pol', x:20, theta:0}]; S.dummy = {x:20, foe:'kn', armor:90};
        P.title = '편광판 두 장 · 각도 나누기';
        P.text = '편광판 두 장을 경통 10 cm, 20 cm에 놓았어요. 0°에서 갑옷 90°까지 <b>똑같은 각도로 나눠</b> 꺾으면 투과가 가장 커요. θ₁, θ₂는?';
        P.given = ['판마다 cos²(각도 차)를 곱해요', '마지막엔 갑옷(90°)과의 각도 차도 곱해요'];
        P.inputs = [{key:'theta', id:1, label:'첫 번째 θ₁', unit:'°', min:0, max:180, step:5}, {key:'theta', id:2, label:'두 번째 θ₂', unit:'°', min:0, max:180, step:5}];
        P.check = () => { const a = fEl(1).theta, b = fEl(2).theta, c = polChain(0, [a, b], 90);
          return a === 30 && b === 60 ? {ok:true, msg:`(cos²30°)³ = ${c.t.toFixed(3)} · 한 장(0.25)보다 더 많이 통과! 판을 더 넣었는데 더 밝아져요.`} : {ok:false, msg:`투과 = ${c.steps.join(' × ')} = ${c.t.toFixed(3)}`}; };
        P.hint = '90°를 세 번 똑같이 나눠요.';
      } else {
        const pairs = [[30, 60, 90], [45, 90, 90], [30, 90, 90], [60, 90, 90], [45, 45, 90], [30, 60, 60]], [a, b, A] = rnd(pairs), c = polChain(0, [a, b], A), ans = tPct(c.t);
        S.free = [{id:1, type:'pol', x:10, theta:a}, {id:2, type:'pol', x:20, theta:b}]; S.dummy = {x:20, foe:'kn', armor:A};
        P.title = '편광판 두 장 · 투과율 계산';
        P.text = `레이저(0°) → 편광판 <b>${a}°</b> → 편광판 <b>${b}°</b> → 갑옷 <b>${A}°</b>. 갑옷을 지나는 빛은 처음의 몇 %일까요? (소수 첫째 자리까지)`;
        P.given = ['말뤼스 법칙 I = I₀ cos²(각도 차)', '판을 지날 때마다 곱해요'];
        P.inputs = [{key:'ans', label:'투과율', unit:'%', min:0, max:100, step:.1}];
        P.check = () => { const v = +F.ans; return Math.abs(v - ans) <= .15 ? {ok:true, msg:`${c.steps.join(' × ')} = ${c.t.toFixed(4)} → ${ans}%`} : {ok:false, msg:`${v}%는 아니에요.`}; };
        P.hint = '각도 차를 하나씩 구해서 cos²를 곱하세요.';
      }
    } else {
      const sets = [[15, 60, 90], [15, 45, 90], [30, 75, 90], [15, 75, 90], [45, 105, 120], [15, 30, 75]], [a, b, A] = rnd(sets), c = polChain(0, [a, b], A), ans = tPct(c.t);
      S.free = [{id:1, type:'pol', x:10, theta:a}, {id:2, type:'pol', x:20, theta:b}]; S.dummy = {x:20, foe:'kn', armor:A};
      P.title = '편광판 두 장 · 특수각 아닌 각';
      P.text = `레이저(0°) → 편광판 <b>${a}°</b> → 편광판 <b>${b}°</b> → 갑옷 <b>${A}°</b>. 갑옷을 지나는 빛은 처음의 몇 %일까요? (소수 첫째 자리까지)`;
      P.given = ['말뤼스 법칙 I = I₀ cos²(각도 차)', ...COS_GIVEN, 'cos²x = (1 + cos 2x) / 2'];
      P.inputs = [{key:'ans', label:'투과율', unit:'%', min:0, max:100, step:.1}];
      P.check = () => { const v = +F.ans; return Math.abs(v - ans) <= .15 ? {ok:true, msg:`${c.steps.join(' × ')} = ${c.t.toFixed(4)} → ${ans}%`} : {ok:false, msg:`${v}%는 아니에요.`}; };
      P.hint = 'cos²15° = (1 + cos 30°)/2 처럼 반각 공식을 쓰면 편해요.';
    }
  } else if (type === 'disp'){
    S.source = 'disp'; S.barrel = 40;
    if (Math.random() < .5){
      const th = hard ? rnd([15, 75, 105]) : rnd([0, 30, 45, 60]), A = hard ? rnd([30, 60, 120]) : rnd([0, 30, 60, 90]), c = polChain(90, [th], A), ans = tPct(c.t);
      S.pix = 'w'; S.free = [{id:1, type:'pol', x:10, theta:th}]; S.dummy = {x:20, foe:'kn', armor:A};
      P.title = '디스플레이 빛 · 편광';
      P.text = `디스플레이(LCD) 빛은 나올 때 이미 편광판을 지나서 <b>90°</b>로 편광돼 있어요. 편광판 <b>${th}°</b> → 갑옷 <b>${A}°</b>을 지나면 처음 세기의 몇 %일까요? (소수 첫째 자리까지)`;
      P.given = ['이미 편광된 빛 → 첫 판부터 cos²(각도 차)', '자연광이 아니라서 ½이 아니에요', ...(hard ? COS_GIVEN : [])];
      P.inputs = [{key:'ans', label:'투과율', unit:'%', min:0, max:100, step:.1}];
      P.check = () => { const v = +F.ans; return Math.abs(v - ans) <= .15 ? {ok:true, msg:`${c.steps.join(' × ')} = ${c.t.toFixed(4)} → ${ans}%`} : {ok:false, msg:`${v}%는 아니에요. 디스플레이 빛은 자연광이 아니에요.`}; };
      P.hint = '90°에서 출발해서 cos²를 차례로 곱해요.';
    } else {
      const pix = hard ? 'g' : 'b', nm = PIX[pix].nm, E = 1240/nm, W = hard ? rnd([1.6, 1.8, 2.0, 2.1]) : rnd([1.8, 2.0, 2.1, 2.2, 2.3, 2.5]), ans = Math.round((E - W)*100)/100;
      S.pix = pix; S.dummy = {x:10, foe:'cs', W};
      P.title = '디스플레이 화소 · 정지 전압';
      P.text = `디스플레이에서 <b>${PIX[pix].name} 화소(${nm} nm)</b>만 켰어요. 일함수 <b>W = ${W} eV</b>인 적에게 쏘면 정지 전압 V₀는 몇 V일까요? (소수 둘째 자리)`;
      P.given = ['E = 1240 / λ (eV)', 'eV₀ = E − W', '빨강 620 nm · 초록 535 nm · 파랑 455 nm'];
      P.inputs = [{key:'ans', label:'정지 전압 V₀', unit:'V', min:0, max:9, step:.01}];
      P.check = () => { const v = +F.ans; return Math.abs(v - ans) <= .02 ? {ok:true, msg:`E = 1240 / ${nm} = ${E.toFixed(3)} eV → V₀ = ${E.toFixed(2)} − ${W} = ${ans.toFixed(2)} V. 빨강(${(1240/620).toFixed(2)} eV)은 ${1240/620 > W ? '전자를 떼어 내요' : '전자를 못 떼어 내요'}.`} : {ok:false, msg:`${v} V는 아니에요.`}; };
      P.hint = '먼저 화소 빛 광자 하나의 에너지를 eV로 구하세요.';
    }
  }
  P.setup = S;
  return P;
}
function loadProblem(ti){
  ti = ti ?? G.ptype; ti = clamp(ti, 0, PTYPES.length - 1);
  const P = genProblem(PTYPES[ti].type, G.settings.hard), s = copy(P.setup);
  F = {kind:'tower', sourceId:null, source:s.source || 'laser', pix:s.pix || 'w', medium:s.medium, pump:s.pump, R:s.R, loss:s.loss, mirror:true, barrel:s.barrel || 40, free:s.free,
    dummy:{x:s.dummy.x, foe:s.dummy.foe, armor:s.dummy.armor ?? null, W:s.dummy.W ?? null}, sel:null, nextId:10,
    learn:true, prob:P, fired:false, fails:0, result:null, solved:false, ans:''};
  G.ptype = ti;
}
function inputVal(inp){
  if (inp.key === 'R') return Math.round(F.R*100);
  if (inp.key === 'ans') return F.ans;
  const e = fEl(inp.id); return e ? e[inp.key] : 0;
}
function setInput(inp, v){
  const q = x => inp.step < 1 ? Math.round(x/inp.step)*inp.step : Math.round(x);
  const fix = x => +x.toFixed(inp.step < .1 ? 2 : inp.step < 1 ? 1 : 0);
  if (inp.key === 'ans'){ F.ans = fix(clamp(+v, inp.min, inp.max)); }
  else {
    v = fix(clamp(inp.step === 5 ? Math.round(v/5)*5 : q(v), inp.min, inp.max));
    if (inp.key === 'R') F.R = v/100; else { const e = fEl(inp.id); if (e) e[inp.key] = v; }
  }
  F.fired = false; F.result = null;
}
function learnPanel(){
  const P = F.prob, r = F.result;
  const inputs = P.inputs.map((inp, k) => `<div class="num"><label for="li${k}">${inp.label}</label>
    <div class="stepper"><button type="button" data-lstep="-${k}" aria-label="줄이기">−</button><input id="li${k}" type="number" inputmode="decimal" value="${inputVal(inp)}" min="${inp.min}" max="${inp.max}" step="${inp.step}"><span>${inp.unit}</span><button type="button" data-lstep="+${k}" aria-label="늘리기">+</button></div></div>`).join('');
  const canBorrow = r && r.ok && fReady() && fPower() && !F.borrowed;
  $('panel').innerHTML = deptHead() + `
    <div class="sec">
      <div class="seg"><button type="button" data-act="learnOn" aria-pressed="true">문제 풀기</button><button type="button" data-act="learnOff" aria-pressed="false">자유 설계</button></div>
      <div class="seg"><button type="button" data-act="diffNormal" aria-pressed="${!G.settings.hard}">보통</button><button type="button" data-act="diffHard" aria-pressed="${G.settings.hard}">하드</button></div>
      <div class="chips">${PTYPES.map((q, i) => `<button class="chip ${i===G.ptype?'on':''}" type="button" data-ptype="${i}">${q.short}${G.solved[q.type] ? ` ✓${G.solved[q.type]}` : ''}</button>`).join('')}</div>
    </div>
    <div class="sec">
      <div class="ed-head"><h3>${P.title}</h3><span>${P.hard ? '하드' : '보통'}</span></div>
      <span class="tag">${P.unit}</span>
      <p class="q">${P.text}</p>
      <h2>주어진 조건</h2>
      <div class="eq">${P.given.join('<br>')}</div>
      ${inputs || `<p class="muted">왼쪽 부품함에서 매질을 끌어다 공진기에 끼우세요. 지금 끼운 매질: <b style="color:var(--ink)">${F.medium ? `${MEDIA[F.medium].name} ${MEDIA[F.medium].nm}nm` : '없음'}</b></p>`}
      <div class="btns"><button class="btn primary" type="button" data-act="fire">시험 발사</button><button class="btn" type="button" data-act="newProb">새 문제</button></div>
      ${r ? `<div class="res ${r.ok ? 'ok' : 'no'}"><b>${r.ok ? '정답!' : '아직이에요'}</b><span>${r.msg}</span>${!r.ok && F.fails >= 2 ? `<span class="hint2">힌트 · ${P.hint}</span>` : ''}</div>` : ''}
      ${r && r.ok ? `<div class="btns">${r.reward ? `<span class="muted">보상 +${r.reward}G</span>` : ''}${canBorrow ? `<button class="btn" type="button" data-act="borrow">설계도 빌리기</button>` : F.borrowed ? '<span class="muted">설계도를 빌렸어요 · 제작부에서 만들 수 있어요</span>' : ''}<button class="btn primary" type="button" data-act="newProb">다음 문제 →</button></div>` : ''}
    </div>
    ${F.fired && fReady() && fPower() ? `<div class="sec"><h2>표적 결과 · ${fFoe().name} @ ${F.dummy.x} m</h2>${elecHtml(fHit(), fFoe(), fArmor())}</div>` : ''}
    <div class="sec"><p class="muted">값을 넣고 <b>시험 발사</b>를 누르면 실험부 사격장에서 빔과 결과가 보여요. 설계부 탭을 누르면 경통 안(cm)을 볼 수 있어요. 계산기는 써도 돼요.</p></div>`;
}
function fireOrder(){
  const P = F.prob;
  F.fired = true; G.dept = 'test'; fSync();
  const r = P.check();
  if (r.ok){
    r.reward = 0;
    if (!F.solved){ F.solved = true; r.reward = P.reward; G.gold += P.reward; G.solved[P.type] = (G.solved[P.type] || 0) + 1; }
  } else F.fails++;
  F.result = r; renderHud(); learnPanel();
  hint(r.ok ? '정답! 설계도를 빌리거나 다음 문제로 넘어가요' : '결과를 보고 다시 계산해 보세요');
}
function borrowDesign(){
  if (!F.result || !F.result.ok || F.borrowed) return;
  const d = Object.assign(fDesign(), {id:'b' + G.nextDesign, name:`${F.prob.short} 설계 ${G.nextDesign}`}); delete d.loss; G.nextDesign++;
  G.designs.push(d); F.borrowed = true; hint(`${d.name}을 설계도에 추가했어요 · 제작부에서 만들 수 있어요`); learnPanel();
}
