/* 별의 일생 — 공용 물리 모델 (행성우주과학 10번, 학습지 36~41쪽)
   단위: 질량 M☉, 광도 L☉, 반지름 R☉, 온도 K, 시간 년
   쓰는 식
   - 질량-광도: L ∝ M^2.3 (M<0.43), M^4 (0.43~2), 1.4·M^3.5 (2~55)
   - 주계열 반지름: R ∝ M^0.8 (M<1), M^0.57 (M≥1)
   - 표면 온도: L = 4πR²σT⁴ → T = 5772·(L/R²)^¼
   - 주계열 수명: t = 10¹⁰년 × M/L (연료 ∝ M, 소모 ∝ L) ≈ M^-2.5
   - 중심 온도(비리얼 정리): T_c ∝ M/R, 태양 보정 1.5×10⁷ K. 1000만 K에서 수소 핵융합 시작 */
(function (g) {
  'use strict';
  const T_SUN = 5772;
  const AGE_UNIVERSE = 1.38e10;

  function msL(M) {
    if (M < 0.43) return 0.23 * Math.pow(M, 2.3);
    if (M < 2) return Math.pow(M, 4);
    if (M < 55) return 1.4 * Math.pow(M, 3.5);
    return 32000 * M;
  }
  function msR(M) { return M < 1 ? Math.pow(M, 0.8) : Math.pow(M, 0.57); }
  function teff(L, R) { return T_SUN * Math.pow(L / (R * R), 0.25); }
  function radius(L, T) { return Math.sqrt(L) * Math.pow(T_SUN / T, 2); }
  function lum(R, T) { return R * R * Math.pow(T / T_SUN, 4); }
  function tMS(M) { return 1e10 * M / msL(M); }
  /* 비리얼 정리: 중력 수축으로 줄어든 퍼텐셜 에너지의 절반은 열(중심 온도↑), 절반은 빛으로 나감 */
  function coreT(M, R) { return 1.5e7 * M / R; }
  const R_IGNITE = M => 1.5 * M; // coreT = 1e7 K 가 되는 반지름

  function fate(M) {
    if (M < 0.08) return 'brown';
    if (M < 8) return 'wd';
    if (M < 25) return 'ns';
    return 'bh';
  }
  const FATE_NAME = { brown: '갈색 왜성', wd: '백색 왜성', ns: '중성자별', bh: '블랙홀' };
  function remnantMass(M) {
    const f = fate(M);
    if (f === 'wd') return Math.min(1.35, M < 0.5 ? M * 0.9 : 0.45 + 0.11 * M);
    if (f === 'ns') return Math.min(2.1, 1.3 + 0.03 * (M - 8));
    if (f === 'bh') return 0.3 * M;
    return M;
  }

  const lerp = (a, b, t) => a + (b - a) * t;
  const llerp = (a, b, t) => Math.exp(lerp(Math.log(a), Math.log(b), t));
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const smooth = t => t * t * (3 - 2 * t);

  /* 층 색: 성분별 */
  const C = { H: '#f4c26b', He: '#f08a4b', C: '#b65d8f', O: '#6e7fd1', Ne: '#53b3c9', Si: '#7fc28a', Fe: '#9aa1a8', deg: '#e9f1ff' };

  /* 질량 M인 별의 일생 단계 목록 */
  function lifeTrack(M) {
    const ph = [];
    const Lz = msL(M), Rz = msR(M), Tz = teff(Lz, Rz);
    const sM = Math.sqrt(M);
    const R0 = 200 * sM, R1 = 50 * sM; // 원시별 시작/전주계열 시작 반지름
    ph.push({
      key: 'protostar', name: '원시별', dur: 1e5,
      L: [lum(R0, 400), lum(R1, 1000)], T: [400, 1000], Tc: [1e5, 1e6],
      text: '회전하며 중력 수축. 주위 물질을 끌어당겨 질량·밀도·온도가 올라감',
      energy: '중력 수축', force: 'in', p: 36,
      layers: [{ c: C.H, r: 1, n: '수소 가스(수축 중)' }]
    });
    if (M < 0.08) {
      const TcMax = 1e7 * Math.pow(M / 0.08, 1.3);
      const Rmin = 1.5e7 * M / TcMax;
      ph.push({
        key: 'premain', name: '수축 중', dur: 1e8,
        L: [lum(R1, 1000), lum(Rmin, 1600)], T: [1000, 1600], Tc: [1e6, TcMax],
        text: '중심 온도가 1000만 K에 못 미침. 수소 핵융합을 시작하지 못함',
        energy: '중력 수축', force: 'in', p: 37,
        layers: [{ c: C.H, r: 1, n: '수소(핵융합 없음)' }]
      });
      ph.push({
        key: 'brown', name: '갈색 왜성', dur: 1e10,
        L: [lum(Rmin, 1600), lum(Rmin, 600)], T: [1600, 600], Tc: [TcMax, TcMax * 0.6],
        text: '별이 되지 못하고 천천히 식어 감', energy: '남은 열', force: 'eq', p: 37, final: true,
        layers: [{ c: C.H, r: 1, n: '수소(식는 중)' }]
      });
      return finalize(ph, M);
    }
    ph.push({
      key: 'premain', name: '전주계열성', dur: Math.min(1e9, 3e7 * Math.pow(M, -2)),
      L: [lum(R1, 1000), Lz], T: [1000, Tz], Tc: [1e6, 1e7],
      text: '표면 온도 약 1000 K → 가시광선을 내기 시작. 계속 수축하며 중심 온도 상승',
      energy: '중력 수축', force: 'in', p: 36,
      layers: [{ c: C.H, r: 1, n: '수소(수축 중)' }]
    });
    const tm = tMS(M);
    const grow = M < 0.5 ? 1.15 : 1.8, rgrow = M < 0.5 ? 1.1 : 1.6;
    const Lt = Lz * grow, Tt = teff(Lt, Rz * rgrow);
    const TcMS = Math.max(1.0e7, 1.5e7 * Math.pow(M, 0.3));
    ph.push({
      key: 'ms', name: '주계열성', dur: tm,
      L: [Lz, Lt], T: [Tz, Tt], Tc: [1e7, TcMS],
      text: '중심핵에서 수소 핵융합. 중력 = 압력 경도력(정역학적 평형) → 반지름 일정',
      energy: '수소 핵융합', force: 'eq', p: 37,
      layers: [
        { c: C.He, r: 0.12, n: '헬륨이 쌓이는 중심핵', burn: 'H→He', grow: [0.02, 0.12] },
        { c: C.H, r: 1, n: '수소 외곽층' }
      ]
    });
    if (M < 0.5) {
      const Mw = remnantMass(M), Rw = 0.0126 * Math.pow(Mw / 0.6, -1 / 3);
      ph.push({
        key: 'wd', name: '헬륨 백색 왜성', dur: 1e10,
        L: [lum(Rw, 12000), lum(Rw, 4000)], T: [12000, 4000], Tc: [2e7, 5e6],
        text: '아주 가벼운 별: 거성이 되지 않고 식는다(이론). 수명이 우주 나이보다 길어 아직 관측된 적 없음',
        energy: '남은 열', force: 'deg', p: 40, final: true, Mw, Rw,
        layers: [{ c: C.He, r: 1, n: '헬륨(축퇴)' }]
      });
      return finalize(ph, M);
    }
    if (M < 8) {
      const Lrg = 800 * Math.pow(M, 1.3), Trg = 3700 + 200 * Math.log10(M);
      ph.push({
        key: 'rgb', name: '적색 거성으로 진화', dur: 0.12 * tm,
        L: [Lt, Lrg], T: [Tt, Trg], Tc: [TcMS, 1e8],
        text: '수소 고갈 → 헬륨핵 수축(압력 경도력 < 중력). 핵 주변 수소 껍질 연소로 외곽층 팽창, 광도↑ 표면 온도↓',
        energy: '헬륨핵 수축 + 수소 껍질 연소', force: 'split', p: 38,
        layers: [
          { c: C.He, r: 0.05, n: '헬륨핵(수축)' },
          { c: C.H, r: 0.09, n: '수소 껍질 연소', burn: 'H→He' },
          { c: C.H, r: 1, n: '팽창하는 외곽층' }
        ]
      });
      const Lg = 50 * Math.pow(M, 1.8), Tg = 4800 + 900 * Math.log10(M);
      ph.push({
        key: 'giant', name: '거성', dur: 0.1 * tm,
        L: [Lrg, Lg], T: [Trg, Tg], Tc: [1e8, 1.2e8],
        text: '중심 온도 1억 K → 헬륨 핵융합(헬륨→탄소). 바깥에서는 수소 껍질 연소 계속',
        energy: '헬륨 핵융합 + 수소 껍질 연소', force: 'eq', p: 39,
        layers: [
          { c: C.C, r: 0.04, n: '탄소가 생기는 중심핵', burn: 'He→C' },
          { c: C.He, r: 0.08, n: '헬륨층' },
          { c: C.H, r: 0.12, n: '수소 껍질 연소', burn: 'H→He' },
          { c: C.H, r: 1, n: '외곽층' }
        ]
      });
      const La = 3000 * Math.pow(M, 1.2);
      ph.push({
        key: 'agb', name: '맥동 변광성', dur: 0.012 * tm,
        L: [Lg, La], T: [Tg, 3000], Tc: [1.2e8, 3e8], pulse: true,
        text: '헬륨 소진 → 탄소핵 수축. 헬륨·수소 껍질 연소로 외곽층 급팽창, 수축·팽창 반복하며 광도가 주기적으로 변함',
        energy: '탄소핵 수축 + 헬륨·수소 껍질 연소', force: 'split', p: 39,
        layers: [
          { c: C.C, r: 0.03, n: '탄소핵(수축)' },
          { c: C.He, r: 0.06, n: '헬륨 껍질 연소', burn: 'He→C' },
          { c: C.H, r: 0.09, n: '수소 껍질 연소', burn: 'H→He' },
          { c: C.H, r: 1, n: '부푼 외곽층' }
        ]
      });
      const Mw = remnantMass(M), Rw = 0.0126 * Math.pow(Mw / 0.6, -1 / 3);
      ph.push({
        key: 'pn', name: '행성상 성운', dur: 3e4,
        L: [La, lum(Rw * 3, 100000)], T: [3000, 100000], Tc: [3e8, 2e8],
        text: '외곽층이 우주 공간으로 흩어져 행성상 성운. 남은 탄소핵이 드러남',
        energy: '남은 열', force: 'out', p: 40, Mw, Rw, nebula: true,
        layers: [{ c: C.C, r: 1, n: '드러난 탄소핵' }]
      });
      ph.push({
        key: 'wd', name: '백색 왜성', dur: 1e10,
        L: [lum(Rw, 100000), lum(Rw, 4000)], T: [100000, 4000], Tc: [2e8, 5e6],
        text: '탄소핵이 더 수축해 지구만 한 크기. 핵융합 없이 서서히 식음',
        energy: '남은 열', force: 'deg', p: 40, final: true, Mw, Rw,
        layers: [{ c: C.deg, r: 1, n: '탄소·산소(축퇴)' }]
      });
      return finalize(ph, M);
    }
    // 질량이 매우 큰 별
    const Lsg = Lt * 1.15;
    ph.push({
      key: 'rsg', name: '초거성', dur: 0.11 * tm,
      L: [Lt, Lsg], T: [Tt, 3500], Tc: [TcMS, 3e9], onion: true,
      text: '중심핵에서 수소→헬륨→탄소→네온→산소→규소 순서로 핵융합. 껍질에서도 차례로 핵융합. 거성보다 훨씬 크고 밝음',
      energy: '여러 겹 핵융합', force: 'split', p: 40,
      layers: [] // onion()에서 시간에 따라 만듦
    });
    const f = fate(M), Mr = remnantMass(M);
    ph.push({
      key: 'sn', name: '초신성 폭발', dur: 1,
      L: [Lsg, 1e9], T: [3500, 15000], Tc: [3e9, 1e11],
      text: '중심핵이 철로 채워져 더 이상 에너지를 못 냄 → 중력 붕괴 → 초신성 폭발, 외곽층이 날아감',
      energy: '중력 붕괴', force: 'in', p: 41, nebula: true,
      layers: [{ c: C.Fe, r: 0.1, n: '철 중심핵(붕괴)' }, { c: C.O, r: 1, n: '날아가는 외곽층' }]
    });
    if (f === 'ns') {
      const Rn = 1.0e-5 * 1.44; // 10 km
      ph.push({
        key: 'ns', name: '중성자별', dur: 1e9,
        L: [lum(Rn, 1e6), lum(Rn, 3e5)], T: [1e6, 3e5], Tc: [1e11, 1e9],
        text: '지름 약 20 km에 태양보다 무거운 질량이 뭉친 별. 빠르게 자전',
        energy: '남은 열', force: 'deg', p: 41, final: true, Mr, Rr: Rn,
        layers: [{ c: '#9fc3ff', r: 1, n: '중성자(축퇴)' }]
      });
    } else {
      const rs = 2.95 * Mr; // km
      ph.push({
        key: 'bh', name: '블랙홀', dur: 1e9,
        L: [1e-9, 1e-9], T: [1000, 1000], Tc: [1e11, 1e11],
        text: '중력이 너무 커서 빛도 빠져나오지 못함. 사건의 지평선 반지름 ' + rs.toFixed(0) + ' km',
        energy: '없음', force: 'in', p: 41, final: true, Mr, rs,
        layers: []
      });
    }
    return finalize(ph, M);
  }

  function finalize(ph, M) {
    let t = 0;
    for (const p of ph) { p.t0 = t; t += p.dur; p.t1 = t; }
    return { M, phases: ph, total: t, fate: fate(M), fateName: FATE_NAME[fate(M)], tMS: tMS(M) };
  }

  /* 초거성 양파 구조: 실제 기간 비율 (15 M☉ 별 계산값, Woosley·Heger·Weaver 2002)
     헬륨 200만 년 · 탄소 2000년 · 네온 0.7년 · 산소 2.6년 · 규소 약 18일 → 초거성 단계 길이에 비례해서 씀 */
  const ONION_YR15 = [['He', 2.0e6, 1e8, '헬륨 핵융합(헬륨→탄소)'], ['C', 2.0e3, 6e8, '탄소 핵융합'], ['Ne', 0.7, 1.2e9, '네온 핵융합'], ['O', 2.6, 1.5e9, '산소 핵융합'], ['Si', 0.05, 3e9, '규소 핵융합 → 철']];
  const ONION = (() => {
    const tot = ONION_YR15.reduce((a, r) => a + r[1], 0); let acc = 0;
    return ONION_YR15.map(([core, yr, Tc, label]) => { const o = { at: acc / tot, frac: yr / tot, core, label, Tc }; acc += yr; o.end = acc / tot; return o; });
  })();
  function onionLayers(u) {
    const seq = ['Fe', 'Si', 'O', 'Ne', 'C', 'He', 'H'];
    let stage = 0;
    for (let i = 0; i < ONION.length; i++) if (u >= ONION[i].at) stage = i;
    // 중심핵에서 지금 타는 원소, 그 바깥 껍질들이 차례로 탐
    const burning = ['He', 'C', 'Ne', 'O', 'Si'][stage];
    const product = { H: 'He', He: 'C', C: 'Ne', Ne: 'O', O: 'Si', Si: 'Fe' };
    const NAME = { H: '수소', He: '헬륨', C: '탄소', Ne: '네온', O: '산소', Si: '규소', Fe: '철' };
    const order = ['H', 'He', 'C', 'Ne', 'O', 'Si'];
    const k = order.indexOf(burning);
    const L = [];
    let r = 0.035;
    if (burning === 'Si' && (u - ONION[4].at) / ONION[4].frac > 0.5) { L.push({ c: C.Fe, r: 0.02, n: '철 중심핵(더 못 탐)', el: 'Fe' }); }
    L.push({ c: C[burning], r, n: NAME[burning] + ' 핵융합 중심핵', burn: burning + '→' + product[burning], el: burning, core: true });
    for (let j = k - 1; j >= 0; j--) {
      r += 0.028;
      const el = order[j];
      L.push({ c: C[el], r, n: NAME[el] + ' 껍질 연소', burn: el + '→' + product[el], el });
    }
    L.push({ c: C.H, r: 1, n: '거대한 수소 외곽층', el: 'H' });
    return { layers: L, stage: ONION[stage], seq };
  }

  /* 나이 age(년)에서의 상태 */
  function state(track, age) {
    const ph = track.phases;
    let i = ph.findIndex(p => age < p.t1);
    if (i < 0) i = ph.length - 1;
    const p = ph[i];
    const u = clamp((age - p.t0) / p.dur, 0, 1);
    const s = p.key === 'sn' ? Math.sin(Math.PI * u) : smooth(u);
    let L = llerp(p.L[0], p.L[1], p.key === 'sn' ? s : u);
    let T = llerp(p.T[0], p.T[1], p.key === 'rgb' || p.key === 'rsg' ? smooth(u) : u);
    if (p.key === 'sn') T = llerp(p.T[0], p.T[1], s);
    const Tc = llerp(p.Tc[0], p.Tc[1], u);
    let pulseF = 1;
    if (p.pulse) { pulseF = 1 + 0.25 * Math.sin(age / p.dur * Math.PI * 2 * 14); L *= pulseF; }
    let R = radius(L, T);
    if (p.key === 'bh') R = p.rs / 696000;
    let layers = p.layers, onion = null;
    let TcOut = Tc;
    if (p.onion) { onion = onionLayers(u); layers = onion.layers; TcOut = onion.stage.core === 'He' ? llerp(p.Tc[0], 1.2e8, Math.min(1, u / 0.1)) : onion.stage.Tc; }
    if (p.key === 'ms') {
      layers = [
        { c: C.He, r: lerp(0.02, 0.14, u), n: '쌓이는 헬륨', el: 'He' },
        { c: C.H, r: 0.25, n: '수소 핵융합 중심핵', burn: 'H→He', el: 'H' },
        { c: C.H, r: 1, n: '수소 외곽층', el: 'H' }
      ];
    }
    return { phase: p, idx: i, u, L, T, R, Tc: TcOut, pulseF, layers, onion, age };
  }

  /* ---------- 표시용 ---------- */
  function sci(x, d = 1) {
    if (!isFinite(x)) return '∞';
    if (x === 0) return '0';
    const e = Math.floor(Math.log10(Math.abs(x)));
    if (e >= -2 && e <= 3) return (+x.toPrecision(d + 2)).toLocaleString('ko-KR');
    const m = x / Math.pow(10, e);
    const sup = String(e).replace(/-/g, '⁻').replace(/\d/g, c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]);
    return m.toFixed(d) + '×10' + sup;
  }
  function years(y) {
    if (y < 1) return Math.max(1, Math.round(y * 365)) + '일';
    if (y < 1e4) return Math.round(y).toLocaleString('ko-KR') + '년';
    const unit = (v, u) => (v >= 100 ? Math.round(v).toLocaleString('ko-KR') : (+v.toPrecision(3)).toString()) + u;
    if (y < 1e8) return unit(y / 1e4, '만 년');
    if (y < 1e12) return unit(y / 1e8, '억 년');
    return unit(y / 1e12, '조 년');
  }
  function tempK(T) {
    if (T >= 1e10) return Math.round(T / 1e8).toLocaleString('ko-KR') + '억 K';
    if (T >= 1e8) return (+(T / 1e8).toPrecision(2)) + '억 K';
    if (T >= 1e6) return Math.round(T / 1e4).toLocaleString('ko-KR') + '만 K';
    if (T >= 1e4) return (+(T / 1e4).toPrecision(3)) + '만 K';
    return Math.round(T).toLocaleString('ko-KR') + ' K';
  }
  /* 흑체 색(약 1000~40000 K) */
  function bbRGB(T) {
    const t = clamp(T, 1000, 40000) / 100;
    let r, g, b;
    if (t <= 66) { r = 255; g = 99.4708025861 * Math.log(t) - 161.1195681661; b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307; }
    else { r = 329.698727446 * Math.pow(t - 60, -0.1332047592); g = 288.1221695283 * Math.pow(t - 60, -0.0755148492); b = 255; }
    return [clamp(r, 0, 255) / 255, clamp(g, 0, 255) / 255, clamp(b, 0, 255) / 255];
  }
  function spectral(T) {
    if (T >= 30000) return 'O'; if (T >= 10000) return 'B'; if (T >= 7500) return 'A';
    if (T >= 6000) return 'F'; if (T >= 5200) return 'G'; if (T >= 3700) return 'K'; return 'M';
  }

  /* 질량-에너지 등가: 4 ¹H → ⁴He */
  const FUSION = (() => {
    const mH = 1.007825, mHe = 4.002603, u = 931.494; // MeV
    const dm = 4 * mH - mHe;
    return { mH, mHe, dm, frac: dm / (4 * mH), MeV: dm * u };
  })();

  /* ---------- 학습지 빈칸 문제 (정답은 항상 opts[0], 화면에서 섞음) ---------- */
  const Q = [
    { id: 'nebula', ph: 'nebula', q: '별은 어떤 곳에서 탄생할까?', opts: ['저온·고밀도의 암흑 성운', '고온·저밀도의 성간 공간', '적색 거성의 외곽층', '백색 왜성 주변'], why: '성간 물질이 밀집한 저온·고밀도 암흑 성운에서 별이 탄생해요.', p: 36 },
    { id: 'proto', ph: 'protostar', q: '회전하며 중력 수축해 고밀도 중심핵을 이룬 천체는?', opts: ['원시별', '전주계열성', '주계열성', '행성상 성운'], why: '성운이 회전하며 중력 수축 → 고밀도 중심핵이 생기면 원시별이에요.', p: 36 },
    { id: 'energy', ph: 'protostar', q: '원시별 에너지원: 중력 수축 → (  ) 에너지 감소 → 열·빛 에너지', opts: ['중력 퍼텐셜', '핵', '운동', '화학'], why: '중력 수축으로 줄어든 중력 퍼텐셜 에너지가 열에너지와 빛에너지로 바뀌어요. (비리얼 정리: 절반은 열, 절반은 빛)', p: 36 },
    { id: 'pre1000', ph: 'premain', q: '원시별의 표면 온도가 약 몇 K가 되면 가시광선을 내는 전주계열성이 될까?', opts: ['약 1000 K', '약 100 K', '약 1000만 K', '약 1억 K'], why: '표면 온도 약 1000 K에서 가시광선을 방출하기 시작해 전주계열성이 돼요.', p: 36 },
    { id: 'wien', ph: 'premain', q: '표면 온도 약 1000 K인 전주계열성이 가장 많이 내는 빛은?', opts: ['적외선 (가시광선은 곡선의 꼬리만)', '가시광선', '자외선', 'X선'], why: '최대 에너지 파장 λmax ≈ 2900 μm·K ÷ 1000 K ≈ 2.9 μm라서 적외선이에요. 가시광선(0.38~0.75 μm)은 곡선 꼬리만 걸쳐서 어두운 붉은빛으로 보여요. 온도가 높을수록 λmax는 짧아져요.', p: 35 },
    { id: 'ms1e7', ph: 'ms', q: '중심부 온도가 약 몇 K에 이르면 수소 핵융합 반응이 시작될까?', opts: ['약 1000만 K', '약 1000 K', '약 1억 K', '약 10억 K'], why: '중심 온도 약 1000만 K → 수소 핵융합 시작 → 주계열성.', p: 37 },
    { id: 'hydro', ph: 'ms', q: '주계열성의 반지름이 일정한 까닭은?', opts: ['중력과 압력 경도력이 평형', '중력이 압력 경도력보다 큼', '압력 경도력이 중력보다 큼', '자전이 멈춰서'], why: '정역학적 평형: 안쪽으로 당기는 중력과 바깥으로 미는 압력 경도력이 같아요.', p: 37 },
    { id: 'hrpos', ph: 'ms', q: '질량이 큰 주계열성은 H-R도의 어디에 있을까?', opts: ['왼쪽 위', '오른쪽 아래', '오른쪽 위', '왼쪽 아래'], why: '질량이 클수록 뜨겁고(왼쪽) 밝아서(위) 왼쪽 위예요.', p: 37 },
    { id: 'life', ph: 'ms', q: '질량이 큰 주계열성일수록 주계열에 머무는 시간은?', opts: ['짧다', '길다', '질량과 상관없다', '항상 100억 년이다'], why: 'L ∝ M^3.5 정도라 연료(∝M)보다 소모가 훨씬 빨라요. 수명 ∝ M/L ≈ M^-2.5.', p: 37 },
    { id: 'mass', ph: 'ms', q: '수소 원자핵 4개 → 헬륨 원자핵 1개. 에너지는 어디서 올까?', opts: ['줄어든 질량(질량 결손)', '늘어난 질량', '중력 수축', '전자의 운동'], why: '질량-에너지 등가(E=mc²): 4개의 수소핵보다 헬륨핵이 약 0.7% 가벼운 만큼 에너지로 바뀌어요.', p: 37 },
    { id: 'rgb', ph: 'rgb', q: '중심 수소가 고갈된 뒤 헬륨핵은 왜 수축할까?', opts: ['헬륨 핵융합을 하기엔 온도가 낮아 압력 경도력 < 중력', '헬륨 핵융합이 너무 활발해서', '압력 경도력 > 중력', '외곽층이 날아가서'], why: '헬륨 핵융합을 할 만큼 뜨겁지 않아 압력 경도력이 중력보다 작아져 수축해요.', p: 38 },
    { id: 'shell', ph: 'rgb', q: '수소 껍질 연소에서는 (  ) → (  ) 로 변한다', opts: ['수소 → 헬륨', '헬륨 → 탄소', '탄소 → 철', '헬륨 → 수소'], why: '헬륨핵 주변 수소층에서 수소가 헬륨으로 융합돼요.', p: 38 },
    { id: 'cno', ph: 'rgb', q: '수소 핵융합 과정이 p-p 연쇄 반응이냐 CNO 순환 반응이냐를 가르는 것은?', opts: ['별 중심부의 온도', '별의 나이', '별의 색 이름', '자전 속도'], why: '중심부 온도에 따라 달라요. (온도가 높은, 질량 큰 별일수록 CNO 순환 반응 비중↑)', p: 38 },
    { id: 'red', ph: 'rgb', q: '외곽층이 팽창할 때 광도와 표면 온도는?', opts: ['광도↑, 표면 온도↓', '광도↓, 표면 온도↑', '둘 다 ↑', '둘 다 ↓'], why: '반지름이 커서 광도는 크지만 표면 온도가 낮아져 붉게 보여요(적색 거성).', p: 38 },
    { id: 'he1e8', ph: 'giant', q: '중심 온도가 약 몇 K에 이르면 헬륨 핵융합이 시작될까?', opts: ['약 1억 K', '약 1000만 K', '약 1000 K', '약 100억 K'], why: '중심부가 수축해 약 1억 K가 되면 헬륨 핵융합(거성 단계).', p: 39 },
    { id: 'pulse', ph: 'agb', q: '헬륨 껍질 연소가 불안정해 수축·팽창을 반복하며 광도가 주기적으로 변하는 별은?', opts: ['맥동 변광성', '주계열성', '중성자별', '원시별'], why: '수축과 팽창을 반복하며 광도가 주기적으로 변해요.', p: 39 },
    { id: 'pn', ph: 'pn', q: '태양 정도 질량의 별: 외곽층이 흩어져 (  ), 중심 탄소핵은 (  )', opts: ['행성상 성운, 백색 왜성', '초신성, 중성자별', '암흑 성운, 원시별', '초신성, 블랙홀'], why: '외곽층이 흩어지면 행성상 성운, 탄소핵은 더 수축해 백색 왜성.', p: 40 },
    { id: 'onion', ph: 'rsg', q: '질량이 매우 큰 별의 중심핵에서 핵융합이 일어나는 순서는?', opts: ['수소→헬륨→탄소→네온→산소', '산소→네온→탄소→헬륨→수소', '헬륨→수소→탄소→산소→네온', '철→규소→산소→탄소→헬륨'], why: '수소, 헬륨, 탄소, 네온, 산소… 순서대로 핵융합하고 껍질에서도 차례로 일어나요.', p: 40 },
    { id: 'sg', ph: 'rsg', q: '적색 거성보다 반지름·광도가 훨씬 큰 별은?', opts: ['초거성', '백색 왜성', '주계열성', '전주계열성'], why: '질량이 매우 큰 별은 초거성이 돼요.', p: 41 },
    { id: 'short', ph: 'rsg', q: '거성·초거성 단계의 기간은 주계열 단계에 비해?', opts: ['매우 짧다', '매우 길다', '같다', '거성 단계가 없다'], why: '거성·초거성으로 진화하는 단계와 머무는 기간 모두 주계열보다 매우 짧아요.', p: 41 },
    { id: 'sn', ph: 'sn', q: '중심핵이 철로 채워져 에너지를 못 내면?', opts: ['중력 붕괴 → 초신성 폭발', '헬륨 핵융합 시작', '행성상 성운이 됨', '다시 원시별이 됨'], why: '철 중심핵이 중력 붕괴하며 초신성 폭발을 일으켜요.', p: 41 },
    { id: 'remnant', ph: 'sn', q: '초신성 폭발 뒤 남은 중심핵은?', opts: ['중성자별이나 블랙홀', '백색 왜성이나 갈색 왜성', '원시별이나 성운', '적색 거성'], why: '외곽층은 날아가고 중심핵은 중성자별이나 블랙홀이 돼요.', p: 41 }
  ];

  function shuffledQuiz(q) {
    const idx = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    return { ...q, shown: idx.map(i => q.opts[i]), answer: idx.indexOf(0) };
  }

  g.STAR = { ONION, T_SUN, AGE_UNIVERSE, msL, msR, teff, radius, lum, tMS, coreT, R_IGNITE, fate, FATE_NAME, remnantMass, lifeTrack, state, onionLayers, sci, years, tempK, bbRGB, spectral, FUSION, Q, shuffledQuiz, clamp, lerp, llerp, smooth, COLORS: C };
})(window);
