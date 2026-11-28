/* 천천히 보기 — 단계가 바뀔 때 시뮬을 멈추고 힘의 관계를 천천히 보여 주는 장면들
   2D 캔버스, 가상 좌표 1000×600 (아래 100은 자막 자리). 모든 수치는 star.js 식으로 계산. */
(function (g) {
  'use strict';
  const S = STAR, K = CORE;
  const VW = 1000, VH = 600;
  const COL = { red: '#ff6b7d', blue: '#8fe0ff', ink: '#e9eefc', dim: '#9aa6c4', sun: '#ffb45a', light: '#ffe6a8', heat: '#ff9a6a', teal: '#6fffd8', ...S.COLORS };
  const cl = S.clamp, E = S.smooth, lerp = S.lerp;
  const seg = (t, a, b) => cl((t - a) / (b - a), 0, 1);
  const NAME = { H: '수소', He: '헬륨', C: '탄소', Ne: '네온', O: '산소', Si: '규소', Fe: '철' };
  function rnd(seed) { return function () { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function rgbT(T, a = 1, k = 1) { const [r, gg, b] = S.bbRGB(Math.max(1000, T)); return `rgba(${Math.min(255, r * 255 * k) | 0},${Math.min(255, gg * 255 * k) | 0},${Math.min(255, b * 255 * k) | 0},${a})`; }
  function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${a})`; }
  function mixHex(a, b, t) { const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16); const f = (s) => Math.round(lerp(A >> s & 255, B >> s & 255, t)); return `rgb(${f(16)},${f(8)},${f(0)})`; }

  /* ---------- 그리기 도구 ---------- */
  function arrow(x, x0, y0, x1, y1, col, w = 5) {
    const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy); if (L < 3) return;
    const ux = dx / L, uy = dy / L, hl = Math.min(L * 0.55, w * 3.4), hw = w * 1.9;
    x.save(); x.strokeStyle = col; x.fillStyle = col; x.lineWidth = w; x.lineCap = 'round';
    x.beginPath(); x.moveTo(x0, y0); x.lineTo(x1 - ux * hl * 0.8, y1 - uy * hl * 0.8); x.stroke();
    x.beginPath(); x.moveTo(x1, y1); x.lineTo(x1 - ux * hl - uy * hw, y1 - uy * hl + ux * hw); x.lineTo(x1 - ux * hl + uy * hw, y1 - uy * hl - ux * hw); x.closePath(); x.fill(); x.restore();
  }
  // 경계 반지름 r 위에서: 중력(안쪽, 빨강) 길이 gl, 압력 경도력(바깥쪽, 파랑) 길이 pl
  function forcePair(x, cx, cy, r, a, gl, pl, w = 5) {
    const sep = Math.min(0.5, 13 / Math.max(r, 10));
    const at = (ang, rr) => [cx + Math.cos(ang) * rr, cy + Math.sin(ang) * rr];
    if (gl > 2) { const [x0, y0] = at(a - sep, r + gl * 0.5), [x1, y1] = at(a - sep, r - gl * 0.5); arrow(x, x0, y0, x1, y1, COL.red, w); }
    if (pl > 2) { const [x0, y0] = at(a + sep, r - pl * 0.5), [x1, y1] = at(a + sep, r + pl * 0.5); arrow(x, x0, y0, x1, y1, COL.blue, w); }
  }
  function ring(x, cx, cy, r, n, gl, pl, rot = 0, w = 5) { for (let i = 0; i < n; i++) forcePair(x, cx, cy, r, rot + i / n * Math.PI * 2, gl, pl, w); }
  function tag(x, txt, X, Y, col = COL.ink, size = 17, align = 'center', bg = 'rgba(6,10,22,.78)') {
    x.save(); x.font = `600 ${size}px "IBM Plex Sans KR", sans-serif`; const w = x.measureText(txt).width + 16, h = size + 12;
    const left = align === 'center' ? X - w / 2 : align === 'right' ? X - w : X;
    if (bg) { x.fillStyle = bg; rr(x, left, Y - h / 2, w, h, 8); x.fill(); }
    x.fillStyle = col; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText(txt, left + 8, Y + 1); x.restore();
  }
  function text(x, txt, X, Y, col = COL.ink, size = 16, align = 'left', weight = 500) { x.save(); x.font = `${weight} ${size}px "IBM Plex Sans KR", sans-serif`; x.fillStyle = col; x.textAlign = align; x.textBaseline = 'middle'; x.fillText(txt, X, Y); x.restore(); }
  function mono(x, txt, X, Y, col = COL.ink, size = 16, align = 'left') { x.save(); x.font = `700 ${size}px "JetBrains Mono", monospace`; x.fillStyle = col; x.textAlign = align; x.textBaseline = 'middle'; x.fillText(txt, X, Y); x.restore(); }
  function rr(x, X, Y, W, H, r) { x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + W, Y, X + W, Y + H, r); x.arcTo(X + W, Y + H, X, Y + H, r); x.arcTo(X, Y + H, X, Y, r); x.arcTo(X, Y, X + W, Y, r); x.closePath(); }
  function panel(x, X, Y, W, H, title) {
    x.save(); x.fillStyle = 'rgba(14,22,44,.72)'; x.strokeStyle = 'rgba(150,180,255,.22)'; x.lineWidth = 1.5; rr(x, X, Y, W, H, 14); x.fill(); x.stroke(); x.restore();
    if (title) text(x, title, X + 14, Y + 20, COL.dim, 14, 'left', 600);
  }
  function glow(x, X, Y, R, col, a = 0.6) { const gr = x.createRadialGradient(X, Y, 0, X, Y, R); gr.addColorStop(0, hexA(col, a)); gr.addColorStop(1, hexA(col, 0)); x.fillStyle = gr; x.beginPath(); x.arc(X, Y, R, 0, 7); x.fill(); }
  function starDisk(x, X, Y, R, T, k = 1, halo = 2) {
    if (halo > 0 && k > 0.02) { const gr = x.createRadialGradient(X, Y, R * 0.7, X, Y, R * halo); gr.addColorStop(0, rgbT(T, 0.45 * k)); gr.addColorStop(1, rgbT(T, 0)); x.fillStyle = gr; x.beginPath(); x.arc(X, Y, R * halo, 0, 7); x.fill(); }
    const gr = x.createRadialGradient(X - R * 0.2, Y - R * 0.2, R * 0.05, X, Y, R);
    gr.addColorStop(0, rgbT(T, 1, 1.08 * k)); gr.addColorStop(0.75, rgbT(T, 1, 0.9 * k)); gr.addColorStop(1, rgbT(T, 1, 0.55 * k));
    x.fillStyle = gr; x.beginPath(); x.arc(X, Y, R, 0, 7); x.fill();
  }
  // 단면: layers 바깥→안쪽 {r, c, burn}
  function section(x, X, Y, layers, w) {
    for (const L of layers) {
      if (L.r <= 0.5) continue;
      x.fillStyle = L.c; x.beginPath(); x.arc(X, Y, L.r, 0, 7); x.fill();
      if (L.burn) { const f = 0.6 + 0.3 * Math.sin(w * 6 + L.r * 0.2); x.save(); x.globalCompositeOperation = 'lighter'; const gr = x.createRadialGradient(X, Y, L.r * 0.55, X, Y, L.r); gr.addColorStop(0, 'rgba(255,190,110,0)'); gr.addColorStop(1, `rgba(255,225,160,${0.6 * f})`); x.fillStyle = gr; x.beginPath(); x.arc(X, Y, L.r, 0, 7); x.fill(); x.restore(); }
      x.strokeStyle = 'rgba(0,0,0,.35)'; x.lineWidth = 1.5; x.beginPath(); x.arc(X, Y, L.r, 0, 7); x.stroke();
    }
  }
  function lane(x, X, Y, W, H, on, col, title, sub, w, note) {
    x.save(); x.globalAlpha = on ? 1 : 0.28;
    x.fillStyle = on ? 'rgba(255,255,255,.06)' : 'rgba(255,255,255,.02)'; x.strokeStyle = on ? hexA(col.startsWith('#') ? col : '#ffffff', 0.7) : 'rgba(150,180,255,.2)'; x.lineWidth = 2;
    rr(x, X, Y, W, H, 12); x.fill(); x.stroke();
    const pulse = on ? 0.75 + 0.25 * Math.sin(w * 5) : 1;
    x.fillStyle = col; x.globalAlpha *= pulse; x.beginPath(); x.arc(X + 22, Y + H / 2, 9, 0, 7); x.fill(); x.globalAlpha = on ? 1 : 0.28;
    text(x, title, X + 42, Y + H / 2 - 11, COL.ink, 18, 'left', 700);
    text(x, sub, X + 42, Y + H / 2 + 13, COL.dim, 14);
    if (note) text(x, note, X + W - 12, Y + H / 2, col, 15, 'right', 700);
    if (on) { // 진행 중 표시: 흐르는 줄
      x.save(); rr(x, X, Y, W, H, 12); x.clip(); const off = (w * 60) % 40;
      x.strokeStyle = hexA('#ffffff', 0.05); x.lineWidth = 10;
      for (let i = -2; i < W / 40 + 2; i++) { x.beginPath(); x.moveTo(X + i * 40 + off, Y + H); x.lineTo(X + i * 40 + off + H, Y); x.stroke(); }
      x.restore();
    }
    x.restore();
  }
  function bracket(x, X, Y0, Y1, label, a) {
    if (a <= 0) return; x.save(); x.globalAlpha = a; x.strokeStyle = COL.sun; x.lineWidth = 3;
    x.beginPath(); x.moveTo(X, Y0); x.lineTo(X + 12, Y0); x.lineTo(X + 12, Y1); x.lineTo(X, Y1); x.stroke();
    x.save(); x.translate(X + 30, (Y0 + Y1) / 2); x.rotate(Math.PI / 2); text(x, label, 0, 0, COL.sun, 17, 'center', 700); x.restore(); x.restore();
  }
  function legend(x, X, Y) {
    arrow(x, X, Y, X + 34, Y, COL.red, 4); text(x, '중력', X + 42, Y, COL.red, 14, 'left', 600);
    arrow(x, X + 92, Y, X + 126, Y, COL.blue, 4); text(x, '압력 경도력', X + 134, Y, COL.blue, 14, 'left', 600);
  }
  function flashAll(x, a) { if (a <= 0) return; x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.fillStyle = `rgba(255,248,232,${a})`; x.fillRect(0, 0, x.canvas.width, x.canvas.height); x.restore(); }
  // 카메라 확대: 별 하나를 중심(cx,cy) 기준으로 z배 키워서 봄 (확대 원을 따로 두지 않음). 왼쪽 그림 영역만 잘라 그림
  // 확대 중에만 둥근 창 안으로 자름 (배율 1이면 자르지 않아서 원래 모습 그대로)
  const VIEW = [14, 64, 560, 430];
  let curZ = 1;
  function clipView(x, fn) { x.save(); if (curZ > 1.001) { rr(x, ...VIEW, 22); x.clip(); } fn(); x.restore(); }
  function zoomed(x, cx, cy, z, fn) {
    curZ = z;
    clipView(x, () => { if (z > 1.001) { x.fillStyle = '#05070f'; x.fillRect(...VIEW); } x.translate(cx, cy); x.scale(z, z); x.translate(-cx, -cy); fn(); });
    if (z > 1.001) { x.save(); x.globalAlpha = seg(z, 1, 1.4); x.strokeStyle = 'rgba(150,180,255,.35)'; x.lineWidth = 2; rr(x, ...VIEW, 22); x.stroke(); x.restore(); }
  }
  // keys: [[시간, 배율], ...] 사이를 부드럽게
  function zoomAt(t, keys) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) return lerp(keys[i - 1][1], keys[i][1], E(seg(t, keys[i - 1][0], keys[i][0])));
    return keys[keys.length - 1][1];
  }
  function zoomTag(x, z) { if (z > 1.25) { x.save(); x.globalAlpha = seg(z, 1.25, 1.7); tag(x, `중심부 ${z.toFixed(1)}배 확대`, VIEW[0] + VIEW[2] / 2, VIEW[1] + 24, COL.dim, 14); x.globalAlpha = 1; x.strokeStyle = 'rgba(150,180,255,.35)'; x.lineWidth = 2; rr(x, ...VIEW, 22); x.stroke(); x.restore(); } }
  // 층 안에 원소 이름을 직접 씀. bands: [{r0, r1, el}] (확대 전 반지름, r0 = 0이면 중심핵)
  function bandLabels(x, sx, sy, z, bands, a = 1) {
    if (a <= 0.01) return;
    clipView(x, () => {
      x.globalAlpha = a;
      for (const b of bands) {
        const th = (b.r1 - b.r0) * z, rm = (b.r0 + b.r1) / 2 * z;
        const core = b.r0 === 0, full = th >= 19 || (core && th >= 22);
        const txt = full ? NAME[b.el] : b.el, fs = cl(th * (core ? 0.32 : 0.6), 11, 18);
        const Y = core ? sy : sy - rm;
        x.font = `800 ${fs}px "IBM Plex Sans KR", sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle';
        x.lineWidth = 4; x.strokeStyle = 'rgba(10,12,24,.85)'; x.lineJoin = 'round'; x.strokeText(txt, sx, Y); x.fillStyle = '#fff'; x.fillText(txt, sx, Y);
        if (core && b.note) { x.font = `700 ${cl(fs * 0.7, 10, 13)}px "IBM Plex Sans KR", sans-serif`; x.strokeText(b.note, sx, Y + fs * 0.95); x.fillStyle = '#ffe6c8'; x.fillText(b.note, sx, Y + fs * 0.95); }
      }
      x.globalAlpha = 1;
    });
  }
  // 중력에 끌려 안으로 들어오는 물결 (화면 픽셀 단위)
  function infall(x, sx, sy, rIn, rOut, w, a = 1) {
    if (a <= 0.01 || rOut <= rIn + 4) return;
    clipView(x, () => {
      x.save(); x.setLineDash([7, 8]); x.lineWidth = 2.5;
      for (let i = 0; i < 4; i++) { const ph = (w * 0.55 + i / 4) % 1, r = rOut - (rOut - rIn) * ph; x.strokeStyle = `rgba(255,107,125,${a * (0.15 + 0.6 * ph)})`; x.beginPath(); x.arc(sx, sy, r, 0, 7); x.stroke(); }
      x.setLineDash([]);
      for (let k = 0; k < 10; k++) { const ang = k / 10 * 6.283 + 0.3, ph = (w * 0.55 + k * 0.137) % 1, r = rOut + 10 - (rOut + 10 - rIn) * ph; x.globalAlpha = a * Math.sin(Math.PI * ph); arrow(x, sx + Math.cos(ang) * (r + 12), sy + Math.sin(ang) * (r + 12), sx + Math.cos(ang) * r, sy + Math.sin(ang) * r, COL.red, 3); }
      x.restore();
    });
  }
  // 층 이름표: 왼쪽에 세로로 쌓고 선으로 연결. items: [{r: 확대 전 반지름, txt, col}]
  function layerTags(x, sx, sy, z, items, a = 1) {
    if (a <= 0.01 || !items.length) return;
    const outer = Math.max(...items.map(i => i.r)) * z + 30, tx = Math.max(sx - outer - 14, 110);
    x.save(); x.globalAlpha = a;
    items.forEach((it, i) => {
      const ty = sy - (items.length - 1) * 19 + i * 38, px = sx - it.r * z;
      x.strokeStyle = 'rgba(255,255,255,.6)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(tx + 2, ty); x.lineTo(px, sy); x.stroke();
      x.fillStyle = '#fff'; x.beginPath(); x.arc(px, sy, 3.2, 0, 7); x.fill();
      tag(x, it.txt, tx, ty, it.col || COL.ink, 15, 'right');
    });
    x.restore();
  }
  function photon(x, X0, Y0, ang, d, a, len = 34) {
    x.save(); x.globalAlpha = a; x.strokeStyle = COL.light; x.lineWidth = 2.2; x.beginPath();
    for (let i = 0; i <= 14; i++) { const s = d + i / 14 * len, wv = Math.sin(s * 0.5) * 4; const px = X0 + Math.cos(ang) * s - Math.sin(ang) * wv, py = Y0 + Math.sin(ang) * s + Math.cos(ang) * wv; i ? x.lineTo(px, py) : x.moveTo(px, py); }
    x.stroke(); x.restore();
  }
  function bars(x, X, Y, f, title) { // 비리얼: 퍼텐셜 에너지 감소분의 절반은 열, 절반은 빛
    panel(x, X, Y, 340, 330, title);
    const base = Y + 270, H = 200, cols = [[X + 60, '중력 퍼텐셜\n에너지', '#9c8cff', 1 - 0.6 * f], [X + 170, '열에너지', COL.heat, 0.3 * f], [X + 280, '빛에너지', COL.light, 0.3 * f]];
    for (const [cx, lab, c, v] of cols) {
      x.fillStyle = 'rgba(255,255,255,.06)'; x.fillRect(cx - 26, base - H, 52, H);
      x.fillStyle = c; x.fillRect(cx - 26, base - H * v, 52, H * v);
      lab.split('\n').forEach((l, i) => text(x, l, cx, base + 18 + i * 18, COL.ink, 14, 'center', 600));
    }
    arrow(x, X + 98, base - H * 0.5, X + 132, base - H * 0.5, COL.dim, 3); text(x, '½', X + 115, base - H * 0.5 - 16, COL.dim, 14, 'center', 700);
    arrow(x, X + 208, base - H * 0.5, X + 242, base - H * 0.5, COL.dim, 3); text(x, '½', X + 225, base - H * 0.5 - 16, COL.dim, 14, 'center', 700);
    text(x, '줄어든 만큼 ½씩', X + 326, Y + 20, COL.dim, 13, 'right', 600);
  }
  // 플랑크 곡선
  const C2 = 14388; // μm·K
  const B = (l, T) => 1 / (Math.pow(l, 5) * (Math.exp(Math.min(700, C2 / (l * T))) - 1));
  function visFrac(T) { let tot = 0, vis = 0; for (let i = 0; i < 600; i++) { const l = Math.pow(10, -1.3 + i * 3.6 / 600), b = B(l, T) * l; tot += b; if (l >= 0.38 && l <= 0.75) vis += b; } return vis / tot; }

  /* ---------- 장면 ---------- */
  const SC = {};

  /* ① 원시별: 중력 수축 */
  SC.proto = () => {
    const R = rnd(7), N = 240, ps = [];
    for (let i = 0; i < N; i++) ps.push({ a: R() * 6.283, r0: 320 + R() * 1100, ts: 6 + R() * 4.5, du: 3.2 + R() * 2.4, k: R() });
    const cx = 320, cy = 255, a0 = -2.45, r0 = 250, rEnd = 30;
    const rOne = t => { const u = seg(t, 0.6, 5.6); return lerp(r0, rEnd, u * u); };
    return {
      title: '원시별 · 중력 수축', p: 36, dur: 17,
      beats: [[0, '성운 속 가스 알갱이 하나가 중력에 끌려 중심으로 떨어져요'], [2.6, '가까워질수록 중력 퍼텐셜 에너지가 줄어요 → 줄어든 만큼 열에너지와 빛에너지가 돼요'], [6, '이런 알갱이가 셀 수 없이 많아요. 모두 떨어지며 열과 빛을 내요'], [11.5, '원시별: 중력 > 압력 경도력 → 계속 수축. 에너지원은 중력 수축이에요']],
      draw(x, t, w) {
        const zoom = lerp(1, 0.3, E(seg(t, 6, 9.5)));
        const Rc = t < 6 ? 26 : t < 11.5 ? lerp(26, 92, E(seg(t, 6, 11.5))) : lerp(92, 80, seg(t, 11.5, 17));
        // 중심 덩어리
        const Tc = 1000, k = t < 11.5 ? lerp(0.35, 0.55, seg(t, 6, 11.5)) : 0.6;
        glow(x, cx, cy, Rc * 2.4, '#ff6a3a', 0.35 * k + (t > 11.5 ? 0.15 : 0));
        starDisk(x, cx, cy, Rc, Tc, k, 0);
        // 알갱이 하나
        if (t < 6.2) {
          const r = rOne(t), px = cx + Math.cos(a0) * r, py = cy + Math.sin(a0) * r, heat = cl((r0 / r - 1) / 7, 0, 1);
          for (let i = 0; i < 18; i++) { const te = 1 + i * 0.27; if (te > t || te > 5.6) break; const age = t - te; if (age > 1.5) continue; const re = rOne(te), ex = cx + Math.cos(a0) * re, ey = cy + Math.sin(a0) * re; const ang = a0 + Math.PI + (i % 5 - 2) * 0.55 + 0.3; photon(x, ex, ey, ang, 14 + age * 90, 1 - age / 1.5); }
          glow(x, px, py, 14 + 26 * heat, '#ff9a5a', 0.25 + 0.5 * heat);
          x.fillStyle = mixHex('#a35a3a', '#ffd38a', heat); x.beginPath(); x.arc(px, py, 9, 0, 7); x.fill();
          if (t < 5.6) { const gl = cl(28 + 4200 / r, 30, 105), ux = -Math.cos(a0), uy = -Math.sin(a0); arrow(x, px + ux * 14, py + uy * 14, px + ux * (14 + gl), py + uy * (14 + gl), COL.red, 6); tag(x, '중력', px + ux * (14 + gl / 2) - uy * 30, py + uy * (14 + gl / 2) + ux * 30, COL.red, 15); }
          if (t > 5.4) glow(x, cx, cy, 70 * (1 - seg(t, 5.6, 6.2)), '#fff2c0', 0.8 * (1 - seg(t, 5.6, 6.2)));
          if (t > 2.6 && t < 5.6) tag(x, `거리 ${Math.round(r)} → 퍼텐셜 에너지 ↓`, cx + 40, cy - 190, COL.dim, 15);
        }
        // 많은 알갱이
        if (t >= 6) {
          for (const q of ps) {
            const u = seg(t, q.ts, q.ts + q.du); if (u >= 1) continue;
            const r = lerp(q.r0, 20, u * u) * zoom, px = cx + Math.cos(q.a) * r, py = cy + Math.sin(q.a) * r; if (r < Rc) continue;
            const heat = cl(u * u * 1.3, 0, 1), a = seg(t, q.ts - 0.6, q.ts);
            x.globalAlpha = a; x.fillStyle = mixHex('#7a3a2a', '#ffd38a', heat); x.beginPath(); x.arc(px, py, 2.6 + 2 * heat, 0, 7); x.fill();
            if (heat > 0.25 && ((w * 3 + q.k * 10) % 1) < 0.35) { x.strokeStyle = COL.light; x.lineWidth = 1.4; x.beginPath(); x.moveTo(px - 6, py); x.lineTo(px + 6, py); x.moveTo(px, py - 6); x.lineTo(px, py + 6); x.stroke(); }
            x.globalAlpha = 1;
          }
        }
        // 원시별 완성: 힘 · 열 · 빛
        if (t >= 11.5) {
          const a = seg(t, 11.5, 12.5);
          x.globalAlpha = a; ring(x, cx, cy, Rc, 6, 74, 40, w * 0.12); x.globalAlpha = 1;
          for (let i = 0; i < 4; i++) { const ph = ((w * 0.6 + i / 4) % 1); x.strokeStyle = hexA('#ffe6a8', 0.35 * (1 - ph) * a); x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, Rc + 30 + ph * 170, 0, 7); x.stroke(); }
          tag(x, '중력 > 압력 경도력 → 계속 수축', cx, cy + Rc + 70, COL.ink, 17);
          tag(x, '빛 → 밖으로', cx + 175, cy - 120, COL.light, 15); tag(x, '열 → 내부 온도↑', cx - 10, cy - Rc - 70, COL.heat, 15);
        }
        legend(x, 30, 40);
        // 에너지 막대
        const f = t < 6 ? (1 / rOne(Math.min(t, 5.6)) - 1 / r0) / (1 / rEnd - 1 / r0) : E(seg(t, 6, 14));
        bars(x, 630, 80, cl(f, 0, 1), t < 6 ? '알갱이 하나의 에너지' : '성운 전체의 에너지');
      }
    };
  };

  /* ② 전주계열성: 플랑크 곡선 */
  SC.premain = () => {
    const vf1000 = visFrac(1000);
    const Tof = t => lerp(600, 1100, E(seg(t, 1, 11.5)));
    return {
      title: '전주계열성 · 가시광선이 보이기 시작', p: 36, dur: 15,
      beats: [[0, '원시별의 표면 온도는 수백 K: 내는 빛이 거의 다 적외선이라 눈에 안 보여요'], [3.5, '중력 수축으로 표면 온도↑ → 곡선 꼭대기가 짧은 파장 쪽으로 (λmax ≈ 2900 μm·K ÷ T)'], [8, '약 1000 K: 곡선 꼬리가 가시광선(빨강)에 걸쳐요 → 전주계열성'], [11.5, '꼭대기는 아직 적외선! 가시광선은 아주 조금이라 어두운 붉은빛이에요']],
      draw(x, t, w) {
        const T = Tof(t), sx = 210, sy = 250, Rv = lerp(118, 92, E(seg(t, 1, 11.5)));
        const vf = visFrac(T), va = cl(1 + 0.5 * Math.log10(vf / vf1000), 0, 1);
        // 적외선(눈에 안 보임): 점선 테두리
        x.save(); x.setLineDash([6, 7]); x.strokeStyle = 'rgba(200,120,255,.55)'; x.lineWidth = 2.5;
        for (let i = 0; i < 3; i++) { const ph = (w * 0.4 + i / 3) % 1; x.globalAlpha = 1 - ph; x.beginPath(); x.arc(sx, sy, Rv + 18 + ph * 70, 0, 7); x.stroke(); }
        x.restore();
        x.fillStyle = '#1c1018'; x.beginPath(); x.arc(sx, sy, Rv, 0, 7); x.fill();
        if (va > 0) starDisk(x, sx, sy, Rv, T, va * 0.75, 1.8);
        x.save(); x.setLineDash([5, 5]); x.strokeStyle = 'rgba(200,120,255,.6)'; x.lineWidth = 2; x.beginPath(); x.arc(sx, sy, Rv, 0, 7); x.stroke(); x.restore();
        ring(x, sx, sy, Rv, 6, 58, 40, 0.3, 4);
        tag(x, '적외선 (눈에 안 보임)', sx, sy - Rv - 66, '#d7a6ff', 14);
        mono(x, Math.round(T) + ' K', sx, sy + Rv + 46, va > 0.3 ? COL.sun : COL.ink, 30, 'center');
        text(x, '표면 온도', sx, sy + Rv + 76, COL.dim, 14, 'center');
        legend(x, 30, 40);
        // 그래프
        const GX = 430, GY = 60, GW = 545, GH = 420, px0 = GX + 54, px1 = GX + GW - 20, py0 = GY + GH - 50, py1 = GY + 78;
        panel(x, GX, GY, GW, GH, '플랑크 곡선 (곡선 높이는 각자의 꼭대기 = 1)');
        const l0 = Math.log10(0.2), l1 = Math.log10(30), X = l => px0 + (Math.log10(l) - l0) / (l1 - l0) * (px1 - px0), Y = v => py0 - v * (py0 - py1);
        // 띠
        const xv0 = X(0.38), xv1 = X(0.75); const gr = x.createLinearGradient(xv0, 0, xv1, 0);
        ['#8a5cff', '#3d7bff', '#2fd06f', '#ffe14a', '#ff9a2e', '#ff3b3b'].forEach((c, i, arr) => gr.addColorStop(i / (arr.length - 1), c));
        x.globalAlpha = 0.22; x.fillStyle = gr; x.fillRect(xv0, py1, xv1 - xv0, py0 - py1); x.globalAlpha = 1;
        x.fillStyle = gr; x.fillRect(xv0, py0 + 2, xv1 - xv0, 8);
        text(x, '가시광선', (xv0 + xv1) / 2, py0 - 14, COL.ink, 13, 'center', 700);
        text(x, '적외선 →', X(12), py0 - 14, '#d7a6ff', 13, 'center', 700);
        // 축
        x.strokeStyle = 'rgba(200,220,255,.4)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(px0, py1); x.lineTo(px0, py0); x.lineTo(px1, py0); x.stroke();
        [0.3, 0.5, 1, 2, 5, 10, 20].forEach(l => { const xx = X(l); x.beginPath(); x.moveTo(xx, py0); x.lineTo(xx, py0 + 6); x.stroke(); mono(x, String(l), xx, py0 + 24, COL.dim, 12, 'center'); });
        text(x, '파장 (μm)', (px0 + px1) / 2, py0 + 44, COL.dim, 13, 'center');
        // 곡선
        const lmax = 2898 / T, peak = B(lmax, T);
        x.beginPath(); let first = true;
        for (let i = 0; i <= 300; i++) { const l = Math.pow(10, l0 + i / 300 * (l1 - l0)), v = B(l, T) / peak; const xx = X(l), yy = Y(v); first ? x.moveTo(xx, yy) : x.lineTo(xx, yy); first = false; }
        x.lineTo(px1, py0); x.lineTo(px0, py0); x.closePath(); x.fillStyle = 'rgba(200,120,255,.18)'; x.fill();
        x.beginPath(); for (let i = 0; i <= 300; i++) { const l = Math.pow(10, l0 + i / 300 * (l1 - l0)), v = B(l, T) / peak; i ? x.lineTo(X(l), Y(v)) : x.moveTo(X(l), Y(v)); }
        x.strokeStyle = '#e2b6ff'; x.lineWidth = 3.5; x.stroke();
        // 꼭대기
        x.save(); x.setLineDash([5, 5]); x.strokeStyle = COL.sun; x.lineWidth = 2; x.beginPath(); x.moveTo(X(lmax), py0); x.lineTo(X(lmax), Y(1)); x.stroke(); x.restore();
        tag(x, `λmax = ${lmax.toFixed(1)} μm (적외선)`, cl(X(lmax), GX + 130, GX + GW - 110), Y(1) - 20, COL.sun, 15);
        // 가시광선 꼬리 ×10000
        if (t > 7) {
          const a = seg(t, 7, 8.5); x.save(); x.globalAlpha = a; x.beginPath(); let st = false;
          for (let i = 0; i <= 80; i++) { const l = 0.38 + i / 80 * 0.37, v = Math.min(1.05, B(l, T) / peak * 1e4); const xx = X(l), yy = Y(v); st ? x.lineTo(xx, yy) : x.moveTo(xx, yy); st = true; }
          x.strokeStyle = '#ff5a4a'; x.lineWidth = 4; x.shadowColor = '#ff5a4a'; x.shadowBlur = 12; x.stroke(); x.restore();
          x.globalAlpha = a; tag(x, '가시광선 부분 ×1만 확대', X(0.55) + 30, Y(0.62), '#ff8a7a', 14); x.globalAlpha = 1;
        }
        // 비율
        const pct = vf * 100; tag(x, '가시광선으로 나오는 몫  ' + (pct < 1e-4 ? pct.toExponential(1) : pct.toPrecision(2)) + ' %', GX + GW - 16, GY + GH - 18 - 0, va > 0.5 ? '#ffb0a0' : COL.dim, 14, 'right');
      }
    };
  };

  /* ③ 주계열성: 수소 핵융합 점화 */
  SC.ignite = (P) => {
    const M = P.M || 1, tI = 9, tau = tI / Math.log(5);
    const Lms = S.msL(M), Tms = S.teff(Lms, S.msR(M));
    const pre = S.lifeTrack(Math.max(0.08, M)).phases.find(p => p.key === 'premain');
    const Tc = t => t < tI ? 2e6 * Math.exp(t / tau) : 1e7;
    const Rr = t => Math.exp(-Math.min(t, tI) / tau);
    return {
      title: '주계열성 · 수소 핵융합 점화', p: 37, dur: 16,
      beats: [[0, '전주계열성: 아직 중력 > 압력 경도력 → 계속 수축'], [3.5, '반지름이 줄수록 중심 온도↑ (중심 온도 ∝ 질량 ÷ 반지름) → 점점 가파르게'], [tI, '중심 온도 약 1000만 K: 수소 핵융합 점화!'], [tI + 2.6, '핵융합 에너지로 압력 경도력 = 중력 → 정역학적 평형, 반지름 일정 (주계열성)']],
      draw(x, t, w) {
        const sx = 250, sy = 255, Rv = 165 * Math.sqrt(Rr(t)), T = t < tI ? lerp(1300, Tms * 0.85, E(seg(t, 0, tI))) : lerp(Tms * 0.85, Tms, seg(t, tI, tI + 2));
        const lit = t >= tI;
        starDisk(x, sx, sy, Rv, T, 0.95, 1.9);
        const cR = Rv * 0.26, hot = cl((Math.log10(Tc(t)) - 6.3) / 0.7, 0, 1);
        glow(x, sx, sy, cR * (lit ? 3.2 : 1.6), lit ? '#fff6d8' : '#ffb07a', lit ? 0.95 : 0.25 + 0.4 * hot);
        if (lit) { x.save(); x.globalCompositeOperation = 'lighter'; for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283 + w * 0.4; x.strokeStyle = 'rgba(255,240,200,.35)'; x.lineWidth = 3; x.beginPath(); x.moveTo(sx + Math.cos(a) * cR, sy + Math.sin(a) * cR); x.lineTo(sx + Math.cos(a) * cR * 2.4, sy + Math.sin(a) * cR * 2.4); x.stroke(); } x.restore(); }
        const gL = 66, pL = lit ? 66 : gL * lerp(0.4, 0.88, hot);
        ring(x, sx, sy, Rv, 6, gL, pL, 0.25, 5);
        if (lit) tag(x, '4 ¹H → ⁴He + 에너지', sx, sy + cR + 34, COL.light, 15);
        tag(x, lit ? '중력 = 압력 경도력' : '중력 > 압력 경도력', sx, sy - Rv - 70, lit ? COL.ink : COL.red, 17);
        // 번쩍
        if (t > tI && t < tI + 1.6) { const u = seg(t, tI, tI + 1.6); x.strokeStyle = `rgba(255,245,215,${1 - u})`; x.lineWidth = 8 * (1 - u) + 1; x.beginPath(); x.arc(sx, sy, u * 520, 0, 7); x.stroke(); flashAll(x, 0.55 * (1 - u) * (1 - u)); }
        legend(x, 30, 40);
        // 그래프: 중심 온도 vs 시간
        const GX = 520, GY = 60, GW = 455, GH = 420, px0 = GX + 78, px1 = GX + GW - 24, py0 = GY + GH - 56, py1 = GY + 50;
        panel(x, GX, GY, GW, GH, '중심 온도');
        const Xt = s => px0 + s / 16 * (px1 - px0), Yv = v => py0 - v / 1.3e7 * (py0 - py1);
        x.strokeStyle = 'rgba(200,220,255,.4)'; x.lineWidth = 1.5; x.beginPath(); x.moveTo(px0, py1); x.lineTo(px0, py0); x.lineTo(px1, py0); x.stroke();
        [[0, '0'], [5e6, '500만'], [1e7, '1000만 K']].forEach(([v, l]) => mono(x, l, px0 - 8, Yv(v), COL.dim, 12, 'right'));
        x.save(); x.setLineDash([7, 6]); x.strokeStyle = COL.sun; x.lineWidth = 2; x.beginPath(); x.moveTo(px0, Yv(1e7)); x.lineTo(px1, Yv(1e7)); x.stroke(); x.restore();
        text(x, '수소 핵융합 시작', px1 - 4, Yv(1e7) - 14, COL.sun, 13, 'right', 700);
        x.beginPath(); for (let i = 0; i <= 200; i++) { const s = i / 200 * t; const xx = Xt(s), yy = Yv(Tc(s)); i ? x.lineTo(xx, yy) : x.moveTo(xx, yy); }
        x.strokeStyle = COL.blue; x.lineWidth = 3.5; x.stroke();
        x.fillStyle = '#fff'; x.beginPath(); x.arc(Xt(t), Yv(Tc(t)), 7, 0, 7); x.fill();
        text(x, `시간 → (전주계열성 단계 약 ${S.years(pre ? pre.dur : 3e7)})`, (px0 + px1) / 2, py0 + 26, COL.dim, 13, 'center');
        mono(x, S.tempK(Tc(t)), px0 + 12, py1 + 4, COL.ink, 22);
        mono(x, '반지름 ×' + Rr(t).toFixed(2), px0 + 12, py1 + 34, COL.dim, 14);
      }
    };
  };

  /* ④ 적색 거성으로 진화: 세 가지가 동시에 */
  SC.rgb = (P) => {
    const tr = P.track || S.lifeTrack(1), ph = tr.phases.find(p => p.key === 'rgb') || S.lifeTrack(1).phases.find(p => p.key === 'rgb');
    return {
      title: '적색 거성으로 진화', p: 38, dur: 18,
      beats: [[0, '중심의 수소가 다 떨어져 헬륨핵만 남아요'], [2.6, '① 헬륨핵 수축: 헬륨 핵융합엔 온도가 모자라 압력 경도력 < 중력'], [6, '② 동시에: 수축으로 나온 에너지가 핵 주변 수소층으로 → 수소 껍질 연소 (수소 → 헬륨)'], [9.5, '③ 동시에: 압력 경도력↑ → 외곽층 급팽창 → 광도↑, 표면 온도↓'], [13.5, '셋은 따로가 아니라 한꺼번에 계속 일어나며 적색 거성이 돼요']],
      draw(x, t, w) {
        const sx = 335, sy = 255;
        const uE = E(seg(t, 9.5, 17)), Re = lerp(118, 215, uE), Ts = S.llerp(ph.T[0], ph.T[1], uE), Ls = S.llerp(ph.L[0], ph.L[1], uE);
        const rc = t < 2.6 ? 42 : t < 6 ? lerp(42, 30, E(seg(t, 2.6, 5.8))) : lerp(30, 24, E(seg(t, 6, 17))), shellOn = t >= 6;
        // 처음엔 별 전체 → 중심부로 확대(헬륨핵 수축 · 수소 껍질 연소) → 다시 전체(외곽층 팽창)
        const z = zoomAt(t, [[0.6, 1], [2.4, 3.4], [9.6, 3.4], [11.2, 1]]), coreA = seg(z, 1.8, 3), envA = 1 - seg(z, 1.05, 1.5);
        zoomed(x, sx, sy, z, () => {
          glow(x, sx, sy, Re * 1.5, '#ff8a52', 0.18);
          x.fillStyle = rgbT(Ts, 1, 0.9); x.beginPath(); x.arc(sx, sy, Re, 0, 7); x.fill();
          const env = x.createRadialGradient(sx, sy, rc, sx, sy, Re - 6); env.addColorStop(0, '#f4c26b'); env.addColorStop(1, mixHex('#f4c26b', '#c9553a', uE));
          x.fillStyle = env; x.beginPath(); x.arc(sx, sy, Re - 6, 0, 7); x.fill();
          section(x, sx, sy, [{ r: rc + 15, c: shellOn ? '#ffd27a' : '#f4c26b', burn: shellOn }, { r: rc, c: COL.He }], w);
        });
        clipView(x, () => {
          if (coreA > 0) { x.globalAlpha = coreA; ring(x, sx, sy, rc * z, 4, 42, t >= 2.6 ? 14 : 42, 0.4, 5); x.globalAlpha = 1; }
          if (envA > 0) { x.globalAlpha = envA; if (t >= 9.5) ring(x, sx, sy, Re, 6, 26, 62, 0.15, 5); else ring(x, sx, sy, Re, 6, 40, 40, 0.15, 5); x.globalAlpha = 1; }
        });
        if (t >= 2.6 && t < 6) infall(x, sx, sy, rc * z + 6, (rc + 15) * z + 46, w, coreA * seg(t, 2.6, 3) * (1 - seg(t, 5.6, 6)));
        bandLabels(x, sx, sy, z, [{ r0: rc, r1: rc + 15, el: 'H' }, { r0: 0, r1: rc, el: 'He', note: t >= 2.6 && t < 6 ? '수축 중' : '중심핵' }], coreA);
        layerTags(x, sx, sy, z, [{ r: rc + 7.5, txt: shellOn ? '수소 껍질 연소' : '수소', col: '#ffd27a' }, { r: rc * 0.75, txt: t >= 2.6 ? '헬륨핵 (수축)' : '헬륨핵', col: COL.He }], coreA);
        if (t >= 12) { x.save(); x.globalAlpha = seg(t, 12, 13); tag(x, '중심: 수축 ↓', sx, sy + 46, COL.red, 15); tag(x, '바깥: 팽창 ↑', sx, sy - Re - 24, COL.blue, 15); x.restore(); }
        zoomTag(x, z);
        legend(x, 30, 40);
        // 레인
        const LX = 600, LW = 340;
        lane(x, LX, 70, LW, 78, t >= 2.6, COL.He, '헬륨핵', '수축 (압력 경도력 < 중력)', w, '↓');
        lane(x, LX, 162, LW, 78, t >= 6, '#ffd27a', '수소 껍질', '연소 (수소 → 헬륨)', w);
        lane(x, LX, 254, LW, 78, t >= 9.5, COL.red, '외곽층', '팽창 → 광도↑ 표면 온도↓', w, '↑');
        bracket(x, LX + LW + 8, 74, 328, '동시에!', seg(t, 13.5, 14.5));
        panel(x, LX, 350, LW, 118);
        mono(x, '광도   ' + S.sci(Ls) + ' L☉', LX + 18, 384, COL.ink, 18); mono(x, '표면   ' + S.tempK(Ts), LX + 18, 416, COL.ink, 18);
        mono(x, '반지름 ' + S.sci(S.radius(Ls, Ts)) + ' R☉', LX + 18, 448, COL.dim, 15);
        if (t > 9.5) { text(x, '↑', LX + LW - 30, 384, COL.sun, 22, 'center', 700); text(x, '↓', LX + LW - 30, 416, COL.blue, 22, 'center', 700); }
      }
    };
  };

  /* ⑤ 거성: 헬륨 핵융합 */
  SC.giant = (P) => {
    const tr = P.track || S.lifeTrack(1), ph = tr.phases.find(p => p.key === 'giant') || S.lifeTrack(1).phases.find(p => p.key === 'giant');
    return {
      title: '거성 · 헬륨 핵융합', p: 39, dur: 13,
      beats: [[0, '헬륨핵이 계속 수축하면서 중심 온도가 올라가요'], [3.6, '중심 온도 약 1억 K: 헬륨 핵융합 시작 → 거성'], [7, '동시에: 중심핵은 헬륨 → 탄소, 바깥 껍질은 수소 → 헬륨']],
      draw(x, t, w) {
        const sx = 335, sy = 255, u = E(seg(t, 3.6, 12));
        const Re = lerp(215, 175, u), Ts = S.llerp(ph.T[0], ph.T[1], u), Tc = t < 3.6 ? S.llerp(5e7, 1e8, E(seg(t, 0, 3.6))) : lerp(1e8, 1.15e8, u);
        const lit = t >= 3.6, rc = lit ? lerp(20, 22, u) : lerp(26, 20, E(seg(t, 0.6, 3.6))), rC = lit ? lerp(3, 13, u) : 0;
        const z = zoomAt(t, [[0.3, 1], [1.8, 3.2], [7, 3.2], [8.6, 1]]), coreA = seg(z, 1.8, 3), envA = 1 - seg(z, 1.05, 1.5);
        zoomed(x, sx, sy, z, () => {
          glow(x, sx, sy, Re * 1.5, '#ff8a52', 0.16);
          x.fillStyle = rgbT(Ts, 1, 0.9); x.beginPath(); x.arc(sx, sy, Re, 0, 7); x.fill();
          const env = x.createRadialGradient(sx, sy, rc, sx, sy, Re - 6); env.addColorStop(0, '#f4c26b'); env.addColorStop(1, '#c9703a'); x.fillStyle = env; x.beginPath(); x.arc(sx, sy, Re - 6, 0, 7); x.fill();
          section(x, sx, sy, [{ r: rc + 15, c: '#ffd27a', burn: true }, { r: rc, c: COL.He, burn: lit }, { r: rC, c: COL.C }], w);
          if (lit && t < 5) { const v = seg(t, 3.6, 5); glow(x, sx, sy, 15 + 50 * v, '#fff2d0', 0.9 * (1 - v)); }
        });
        clipView(x, () => {
          if (coreA > 0) { x.globalAlpha = coreA; ring(x, sx, sy, rc * z, 4, 40, lit ? 40 : 14, 0.4, 5); x.globalAlpha = 1; }
          if (envA > 0) { x.globalAlpha = envA; ring(x, sx, sy, Re, 6, 40, 40, 0.15, 5); x.globalAlpha = 1; }
        });
        if (!lit) infall(x, sx, sy, rc * z + 6, (rc + 15) * z + 46, w, coreA * seg(t, 0.6, 1.2) * (1 - seg(t, 3.3, 3.6)));
        bandLabels(x, sx, sy, z, [{ r0: rc, r1: rc + 15, el: 'H' }, ...(rC * z > 20 ? [{ r0: rC, r1: rc, el: 'He' }, { r0: 0, r1: rC, el: 'C', note: '생기는 중' }] : [{ r0: 0, r1: rc, el: 'He', note: lit ? '핵융합' : '수축 중' }])], coreA);
        layerTags(x, sx, sy, z, [{ r: rc + 7.5, txt: '수소 껍질 연소', col: '#ffd27a' }, { r: rc * 0.8, txt: lit ? '중심핵: 헬륨 → 탄소' : '헬륨핵 (수축)', col: COL.He }], coreA);
        if (envA > 0.5) { x.save(); x.globalAlpha = envA; tag(x, '수소 껍질 연소', sx + 150, sy + 165, '#ffd27a', 15); x.restore(); }
        zoomTag(x, z);
        legend(x, 30, 40);
        const LX = 600, LW = 340;
        panel(x, LX, 70, LW, 110, '중심 온도');
        const gx0 = LX + 18, gx1 = LX + LW - 18, gv = v => gx0 + cl((Math.log10(v) - 7.5) / 0.7, 0, 1) * (gx1 - gx0);
        x.fillStyle = 'rgba(255,255,255,.08)'; rr(x, gx0, 112, gx1 - gx0, 16, 8); x.fill();
        const gg = x.createLinearGradient(gx0, 0, gx1, 0); gg.addColorStop(0, '#b65d3a'); gg.addColorStop(1, '#fff0c8'); x.fillStyle = gg; rr(x, gx0, 112, gv(Tc) - gx0, 16, 8); x.fill();
        x.strokeStyle = COL.sun; x.lineWidth = 3; x.beginPath(); x.moveTo(gv(1e8), 104); x.lineTo(gv(1e8), 136); x.stroke();
        mono(x, '5000만', gx0, 152, COL.dim, 12); mono(x, '1억 K 헬륨 핵융합', gv(1e8), 152, COL.sun, 12, 'center'); mono(x, S.tempK(Tc), gx1, 90, COL.ink, 18, 'right');
        lane(x, LX, 200, LW, 78, lit, COL.C, '중심핵', '헬륨 핵융합 (헬륨 → 탄소)', w);
        lane(x, LX, 292, LW, 78, true, '#ffd27a', '수소 껍질', '연소 계속 (수소 → 헬륨)', w);
        bracket(x, LX + LW + 8, 204, 366, '동시에!', seg(t, 7, 8));
        text(x, '외곽층은 조금 줄고 표면 온도는 조금 올라요', LX + 4, 400, COL.dim, 14);
        mono(x, '표면 ' + S.tempK(Ts) + '  ·  광도 ' + S.sci(S.llerp(ph.L[0], ph.L[1], u)) + ' L☉', LX + 4, 430, COL.ink, 15);
      }
    };
  };

  /* ⑥ 맥동 변광성 → 행성상 성운 → 백색 왜성 */
  SC.agb = (P) => {
    const R = rnd(11), puffs = [];
    const T0 = 7, PER = 1.7, END = 14.5, TS = 4.4, TW = END + 4.8;
    for (let k = 0; T0 + PER * (0.25 + k) < END; k++) { const te = T0 + PER * (0.25 + k); for (let i = 0; i < 54; i++) puffs.push({ te, a: i / 54 * 6.283 + R() * 0.12, v: 34 + R() * 26, s: R() }); }
    for (let i = 0; i < 520; i++) puffs.push({ te: END + R() * 3.5, a: R() * 6.283, v: 26 + R() * 30, s: R(), late: true });
    const Rb = 165, Renv = t => { const base = lerp(165, 182, E(seg(t, 0, 3))); return t < T0 ? base : t < END ? Rb * (1 + 0.15 * Math.sin(2 * Math.PI * (t - T0) / PER)) : Rb * (1 + 0.15 * Math.sin(2 * Math.PI * (END - T0) / PER)); };
    const Mw = S.remnantMass(P.M || 1);
    return {
      title: '맥동 변광성 → 행성상 성운 → 백색 왜성', p: 39, dur: TW + 4.2,
      beats: [[0, '헬륨이 다 타면 탄소핵이 수축해요 (압력 경도력 < 중력)'], [TS, '동시에: 핵 주변 헬륨 껍질과 수소 껍질에서 핵융합 → 외곽층 급팽창'], [T0, '헬륨 껍질 연소가 불안정 → 수축·팽창을 반복하며 광도가 주기적으로 변해요 (맥동 변광성)'], [T0 + 3.5, '팽창할 때마다 외곽층 가스가 조금씩 날아가요. 폭발이 아니에요'], [END, '외곽층이 다 흩어지면 드러난 뜨거운 중심핵이 가스를 비춰요 → 행성상 성운'], [TW, `남은 탄소핵은 더 수축해서 백색 왜성 (약 ${Mw.toFixed(2)} M☉, 지구만 한 크기)`]],
      draw(x, t, w) {
        const LX = 600, LW = 340;
        const sx = 335, sy = 255, gone = E(seg(t, END, END + 3.5));
        const Re = Renv(t) * (1 + 0.25 * seg(t, END, END + 1.4)), rC = t < TS ? lerp(28, 18, E(seg(t, 1.6, TS))) : lerp(18, 16, E(seg(t, TS, END)));
        const ion = E(seg(t, END + 0.5, END + 4));
        // 날아간 가스
        for (const q of puffs) {
          if (t < q.te) continue; const age = Math.min(t, TW + 4.2) - q.te; const r0 = q.late ? Re * 0.9 : Rb * 1.15;
          const r = r0 + q.v * age, a = cl(1 - age / 13, 0, 1) * (q.late ? 0.9 : 0.8);
          x.globalAlpha = a; x.fillStyle = mixHex('#d98a5a', COL.teal, ion); x.beginPath(); x.arc(sx + Math.cos(q.a) * r, sy + Math.sin(q.a) * r * 0.96, 2.2 + q.s * 1.6, 0, 7); x.fill();
        }
        x.globalAlpha = 1;
        if (ion > 0) glow(x, sx, sy, 330, COL.teal, 0.12 * ion);
        // 처음엔 중심부 확대(탄소핵 수축 · 껍질 연소) → 전체(맥동)
        const z = zoomAt(t, [[0.3, 1], [1.6, 3.2], [5.8, 3.2], [6.9, 1]]), zA = seg(z, 1.8, 3), zE = 1 - seg(z, 1.05, 1.5);
        curZ = z; x.save(); if (z > 1.001) { rr(x, ...VIEW, 22); x.clip(); x.fillStyle = '#05070f'; x.fillRect(...VIEW); } x.translate(sx, sy); x.scale(z, z); x.translate(-sx, -sy);
        // 외곽층
        const envA = 1 - seg(t, END, END + 1.4);
        if (envA > 0.01) {
          x.globalAlpha = envA; glow(x, sx, sy, Re * 1.4, '#ff7a4a', 0.2);
          x.fillStyle = rgbT(3000, 1, 0.85); x.beginPath(); x.arc(sx, sy, Re, 0, 7); x.fill();
          const env = x.createRadialGradient(sx, sy, rC + 20, sx, sy, Re - 6); env.addColorStop(0, '#f4c26b'); env.addColorStop(1, '#b8503a'); x.fillStyle = env; x.beginPath(); x.arc(sx, sy, Re - 6, 0, 7); x.fill();
          x.globalAlpha = 1;
        }
        const coreA = 1 - gone;
        if (coreA > 0.01) { x.globalAlpha = coreA; section(x, sx, sy, [{ r: rC + 24, c: '#ffd27a', burn: t >= TS }, { r: rC + 12, c: COL.He, burn: t >= TS }, { r: rC, c: COL.C }], w); x.globalAlpha = 1; }
        x.restore();
        if (zA > 0) { clipView(x, () => { x.globalAlpha = zA; ring(x, sx, sy, rC * z, 4, 36, 12, 0.4, 5); x.globalAlpha = 1; }); infall(x, sx, sy, rC * z + 6, (rC + 24) * z + 40, w, zA * seg(t, 1.6, 2.1) * (1 - seg(t, TS - 0.4, TS))); bandLabels(x, sx, sy, z, [{ r0: rC + 12, r1: rC + 24, el: 'H' }, { r0: rC, r1: rC + 12, el: 'He' }, { r0: 0, r1: rC, el: 'C', note: t < TS ? '수축 중' : '중심핵' }], zA); layerTags(x, sx, sy, z, [{ r: rC + 18, txt: t >= TS ? '수소 껍질 연소' : '수소', col: '#ffd27a' }, { r: rC + 6, txt: t >= TS ? '헬륨 껍질 연소' : '헬륨', col: COL.He }, { r: rC * 0.75, txt: '탄소핵 (수축)', col: '#e7a3cb' }], zA); }
        zoomTag(x, z);
        // 드러난 핵 → 백색 왜성
        if (gone > 0) { const rw = lerp(rC, 6, E(seg(t, TW, TW + 3))); starDisk(x, sx, sy, rw, 80000, 1.2, 4 * gone); }
        // 힘
        if (t < END) {
          let gL = 40, pL = 40;
          if (t >= TS && t < T0) { gL = 26; pL = 58; }
          if (t >= T0) { const c = Math.cos(2 * Math.PI * (t - T0) / PER); pL = 40 + 24 * c; gL = 40 - 24 * c; }
          if (zE > 0) { x.globalAlpha = zE; ring(x, sx, sy, Re, 6, gL, pL, 0.15, 5); x.globalAlpha = 1; }
          if (t >= T0) tag(x, Math.cos(2 * Math.PI * (t - T0) / PER) > 0 ? '팽창 중: 압력 경도력 > 중력' : '수축 중: 중력 > 압력 경도력', LX + LW / 2, 242, COL.ink, 16);
        }
        if (t >= END) tag(x, '행성상 성운', sx + 170, sy - 190, COL.teal, 17);
        if (t >= TW) tag(x, '백색 왜성', sx, sy + 46, '#dfe8ff', 16);
        legend(x, 30, 40);
        // 광도 곡선
        panel(x, LX, 60, LW, 160, '광도 (맥동 전 = 1)');
        const gx0 = LX + 40, gx1 = LX + LW - 16, gy0 = 196, gy1 = 92, Xs = s => gx0 + (s - T0) / (END - T0) * (gx1 - gx0), Yl = v => gy0 - (v - 0.6) / 0.85 * (gy0 - gy1);
        x.strokeStyle = 'rgba(200,220,255,.3)'; x.lineWidth = 1; x.beginPath(); x.moveTo(gx0, Yl(1)); x.lineTo(gx1, Yl(1)); x.stroke(); mono(x, '1', gx0 - 8, Yl(1), COL.dim, 12, 'right');
        if (t > T0) { x.beginPath(); const te = Math.min(t, END); for (let i = 0; i <= 160; i++) { const s = T0 + i / 160 * (te - T0); const L = Math.pow(Renv(s) / Rb, 2); i ? x.lineTo(Xs(s), Yl(L)) : x.moveTo(Xs(s), Yl(L)); } x.strokeStyle = COL.sun; x.lineWidth = 3; x.stroke(); }
        text(x, '시간 →', gx1, gy0 + 14, COL.dim, 12, 'right');
        lane(x, LX, 268, LW, 62, t < END, COL.C, '탄소핵', '수축 (압력 경도력 < 중력)', w);
        lane(x, LX, 338, LW, 62, t >= TS && t < END, COL.He, '헬륨 껍질', t >= T0 ? '연소 · 불안정 → 맥동' : '연소 (헬륨 → 탄소)', w);
        lane(x, LX, 408, LW, 62, t >= TS && t < END, '#ffd27a', '수소 껍질', '연소 (수소 → 헬륨)', w);
        bracket(x, LX + LW + 8, 272, 466, '동시에!', seg(t, TS, TS + 0.8) * (1 - seg(t, END, END + 1)));
      }
    };
  };

  /* ⑦ 초거성: 양파 구조 (반응 그림 없이 힘만)
     원소 하나마다: 연소(중심에 재가 쌓임) → 바닥(핵융합 멈춤) → 수축(중력 > 압력, 바깥 층도 끌려 들어옴, 온도↑) → 점화 → 평형 */
  SC.onion = (P) => {
    const M = P.M || 15, tr = P.track || S.lifeTrack(M), rsg = tr.phases.find(p => p.key === 'rsg');
    const FUEL = ['H', 'He', 'C', 'Ne', 'O', 'Si'], ASH = ['He', 'C', 'Ne', 'O', 'Si', 'Fe'];
    const TC = { H: 1.5e7, He: 1e8, C: 6e8, Ne: 1.2e9, O: 1.5e9, Si: 3e9, Fe: 1e10 };
    const T0 = 2.2, STP = 7, P_OUT = 1.6, P_CON = 2.3, P_IGN = 5.0, P_SET = 5.6, CR = 22, SH = 12;
    const dur = T0 + 6 * STP;
    const rows = FUEL.map((e, j) => [e, j === 0 ? S.years(S.tMS(M)) : S.years(S.ONION[j - 1].frac * rsg.dur)]).concat([['Fe', '']]);
    const beats = [[0, '처음엔 중심핵에서 수소가 타요. 층마다 무슨 원소인지 이름이 써 있어요']];
    FUEL.forEach((f, i) => {
      const a = ASH[i];
      beats.push([T0 + i * STP, a === 'Fe'
        ? '규소 바닥 → 핵융합 멈춤 → 중력 > 압력: 철 중심핵 수축, 바깥 층도 끌려 들어와요. 그런데 철은 핵융합으로 에너지를 못 내요'
        : `${NAME[f]} 바닥 → 핵융합 멈춤 → 중력 > 압력: ${NAME[a]} 중심핵 수축, 바깥 층도 끌려 들어와요 → ${S.tempK(TC[a])}에서 ${NAME[a]} 점화 (${NAME[f]}은 껍질에서 계속)`]);
    });
    return {
      title: '초거성 · 양파 구조', p: 40, dur,
      beats,
      draw(x, t, w) {
        const sx = 335, sy = 250, Re = 215;
        const i = t < T0 ? -1 : Math.min(5, Math.floor((t - T0) / STP)), u = t < T0 ? 0 : t - T0 - i * STP;
        const ph = i < 0 ? 'burn' : u < P_OUT ? 'burn' : u < P_CON ? 'out' : (ASH[i] === 'Fe' || u < P_IGN) ? 'con' : u < P_SET ? 'ign' : 'set';
        const fuel = i < 0 ? 'H' : FUEL[i], ash = i < 0 ? 'He' : ASH[i];
        const isFe = ash === 'Fe' && i >= 0;
        // 껍질 수: 바닥난 연료 수
        const nSh = i < 0 ? 0 : (ph === 'burn' ? i : i + 1);
        // 중심핵 반지름: 수축하면 줄고, 점화 뒤 조금 회복
        const conU = ph === 'con' ? E(seg(u, P_CON, isFe ? 6.2 : P_IGN)) : (ph === 'ign' || ph === 'set') ? 1 : 0;
        let cr = CR * (1 - 0.34 * conU);
        if (ph === 'set') cr = lerp(CR * 0.66, CR * 0.86, E(seg(u, P_SET, STP)));
        if (ph === 'burn' && i > 0) cr = CR * 0.86;
        const pull = cr / CR; // 바깥 층도 같이 끌려 들어옴
        const outerR = cr + SH * nSh * (0.75 + 0.25 * pull);
        const zT = cl(205 / (CR + SH * Math.max(nSh, 1) + 6), 1.6, 4.2);
        const z = t < T0 ? lerp(1, cl(205 / (CR + SH + 6), 1.6, 4.2), E(seg(t, 0.3, 1.8))) : zT;
        curZ = z;
        // 별 그리기 (확대)
        x.save(); if (z > 1.001) { rr(x, ...VIEW, 22); x.clip(); x.fillStyle = '#05070f'; x.fillRect(...VIEW); } x.translate(sx, sy); x.scale(z, z); x.translate(-sx, -sy);
        glow(x, sx, sy, Re * 1.5, '#ff6a3a', 0.18);
        x.fillStyle = rgbT(3500, 1, 0.85); x.beginPath(); x.arc(sx, sy, Re, 0, 7); x.fill();
        const env = x.createRadialGradient(sx, sy, 40, sx, sy, Re - 6); env.addColorStop(0, '#f4c26b'); env.addColorStop(1, '#b8503a'); x.fillStyle = env; x.beginPath(); x.arc(sx, sy, Re - 6, 0, 7); x.fill();
        // 껍질: 바깥(H) → 안
        const bands = [];
        let r = outerR;
        for (let j = 0; j < nSh; j++) {
          const r1 = r, r0 = r1 - SH * (0.75 + 0.25 * pull);
          const el = FUEL[j];
          x.fillStyle = COL[el]; x.beginPath(); x.arc(sx, sy, r1, 0, 7); x.fill();
          // 껍질 연소: 가장 안쪽 껍질은 바닥난 직후부터 타요
          const f = 0.6 + 0.3 * Math.sin(w * 6 + j); x.save(); x.globalCompositeOperation = 'lighter'; const gr = x.createRadialGradient(sx, sy, r0, sx, sy, r1); gr.addColorStop(0, `rgba(255,225,160,${0.45 * f})`); gr.addColorStop(1, 'rgba(255,190,110,0)'); x.fillStyle = gr; x.beginPath(); x.arc(sx, sy, r1, 0, 7); x.fill(); x.restore();
          x.strokeStyle = 'rgba(0,0,0,.4)'; x.lineWidth = 1.2 / z * 2; x.beginPath(); x.arc(sx, sy, r1, 0, 7); x.stroke();
          bands.push({ r0, r1, el }); r = r0;
        }
        // 중심핵
        const coreEl = ph === 'burn' ? fuel : ash;
        const lit = ph === 'burn' || ph === 'set' || ph === 'ign';
        const heat = ph === 'con' ? conU : ph === 'ign' ? 1 : 0;
        x.fillStyle = COL[coreEl]; x.beginPath(); x.arc(sx, sy, cr, 0, 7); x.fill();
        if (ph === 'burn') { // 중심에 재(다음 원소)가 쌓임
          const dep = i < 0 ? 0.25 : seg(u, 0, P_OUT);
          x.fillStyle = COL[ash]; x.beginPath(); x.arc(sx, sy, cr * Math.sqrt(0.15 + 0.85 * dep), 0, 7); x.fill();
        }
        if (heat > 0) glow(x, sx, sy, cr * 1.15, '#fff4dc', 0.55 * heat);
        if (lit) { const f = 0.6 + 0.3 * Math.sin(w * 6); x.save(); x.globalCompositeOperation = 'lighter'; const gr = x.createRadialGradient(sx, sy, cr * 0.3, sx, sy, cr); gr.addColorStop(0, `rgba(255,235,180,${0.5 * f})`); gr.addColorStop(1, 'rgba(255,190,110,0)'); x.fillStyle = gr; x.beginPath(); x.arc(sx, sy, cr, 0, 7); x.fill(); x.restore(); }
        x.strokeStyle = 'rgba(0,0,0,.45)'; x.lineWidth = 1.4 / z * 2; x.beginPath(); x.arc(sx, sy, cr, 0, 7); x.stroke();
        if (ph === 'ign') glow(x, sx, sy, cr * (1.2 + 3 * seg(u, P_IGN, P_SET)), '#fff2d0', 0.9 * (1 - seg(u, P_IGN, P_SET)));
        x.restore();
        // 힘 · 끌려 들어옴 (화면 픽셀)
        const crp = cr * z, orp = outerR * z;
        if (ph === 'con') infall(x, sx, sy, crp + 6, Math.min(orp + 34, 205), w, seg(u, P_CON, P_CON + 0.4));
        clipView(x, () => {
          if (ph === 'con' || (isFe && ph !== 'burn')) ring(x, sx, sy, crp, 6, isFe ? 64 : 54, isFe ? 4 : 12, 0.35, 6);
          else if (ph === 'out') ring(x, sx, sy, crp, 4, 44, lerp(36, 14, seg(u, P_OUT, P_CON)), 0.35, 5);
          else ring(x, sx, sy, crp, 4, 36, 36, 0.35, 5);
          if (ph === 'con' && nSh > 0) { x.globalAlpha = 0.8; ring(x, sx, sy, orp, 6, 30, 12, 0.1, 4); x.globalAlpha = 1; }
        });
        bandLabels(x, sx, sy, z, [...bands, { r0: 0, r1: cr, el: coreEl, note: '중심핵' }]);
        // 상태 문구
        const say = { burn: `${NAME[fuel]} 핵융합 · 중심에 ${NAME[ash]}(재)이 쌓여요`, out: `${NAME[fuel]} 바닥! 핵융합 멈춤 → 압력 경도력↓`, con: isFe ? '철: 핵융합 불가 → 압력이 회복되지 않아요' : '중력 > 압력 경도력: 중심핵 수축, 바깥 층도 끌려 들어옴', ign: `${S.tempK(TC[ash])} 도달 → ${NAME[ash]} 점화!`, set: `${NAME[ash]} 핵융합 · 중력 = 압력 경도력` }[ph];
        tag(x, say, VIEW[0] + VIEW[2] / 2, 448, ph === 'con' || ph === 'out' ? COL.red : COL.ink, 16);
        // 단계 표시 + 중심 온도
        const steps = [['burn', '연소'], ['out', '바닥'], ['con', '수축'], ['ign', '점화']];
        const cur = ph === 'set' ? 'ign' : ph;
        steps.forEach(([k, l], j) => { const X = 345 + j * 64, on = k === cur, done = steps.findIndex(q => q[0] === cur) > j; x.save(); x.globalAlpha = on ? 1 : done ? 0.6 : 0.3; x.fillStyle = on ? (k === 'con' || k === 'out' ? 'rgba(255,107,125,.9)' : 'rgba(255,180,90,.9)') : 'rgba(255,255,255,.1)'; rr(x, X - 28, 27, 56, 26, 13); x.fill(); text(x, isFe && k === 'ign' ? '없음' : l, X, 40, on ? '#14101a' : COL.ink, 13, 'center', 700); x.restore(); });
        const Tc = ph === 'burn' ? TC[fuel] : ph === 'out' ? TC[fuel] : ph === 'con' ? S.llerp(TC[fuel], TC[ash], conU) : TC[ash];
        legend(x, 30, 40);
        // 사다리
        const LX = 600, LW = 370, RH = 50;
        panel(x, LX, 54, LW, RH * rows.length + 70, `중심핵 핵융합 순서 (이 별 ${M} M☉)`);
        const curIdx = i < 0 ? 0 : (ph === 'ign' || ph === 'set') ? i + 1 : i; // 지금 중심핵에서 타는 줄
        rows.forEach(([e, d], j) => {
          const Y = 106 + j * RH;
          const st = j < curIdx ? 'done' : j === curIdx ? (e === 'Fe' ? 'fe' : (ph === 'out' || ph === 'con') && i >= 0 ? 'wait' : 'now') : (j === i + 1 && ph === 'con') ? 'next' : 'wait';
          const isNow = st === 'now' || st === 'fe' || st === 'next';
          x.globalAlpha = st === 'wait' ? 0.32 : 1;
          if (isNow) { x.fillStyle = st === 'next' ? 'rgba(255,107,125,.14)' : 'rgba(255,180,90,.16)'; rr(x, LX + 8, Y - 21, LW - 16, 42, 10); x.fill(); }
          x.fillStyle = COL[e]; x.beginPath(); x.arc(LX + 28, Y, 10, 0, 7); x.fill();
          text(x, NAME[e] + (e === 'Fe' ? '' : ' 핵융합'), LX + 48, Y, COL.ink, 17, 'left', 700);
          mono(x, e === 'Fe' ? '—' : S.tempK(TC[e]), LX + 205, Y, COL.sun, 14);
          text(x, st === 'done' ? '껍질에서 계속' : st === 'next' ? '수축 중 → 온도↑' : st === 'fe' ? '더 못 탐 → 붕괴' : d, LX + LW - 14, Y, st === 'done' ? COL.dim : st === 'next' ? COL.red : COL.ink, 13, 'right', 600);
          x.globalAlpha = 1;
        });
        text(x, '지금 중심 온도', LX + 18, 106 + rows.length * RH - 6, COL.dim, 14, 'left', 600);
        mono(x, S.tempK(Tc) + (ph === 'con' ? ' ↑' : ''), LX + LW - 14, 106 + rows.length * RH - 6, ph === 'con' ? COL.sun : COL.ink, 18, 'right');
      }
    };
  };

  /* ⑧ 초신성 */
  SC.sn = (P) => {
    const M = P.M || 15, fate = S.fate(M), Mr = S.remnantMass(M), R = rnd(5), ej = [];
    const shells = [[200, '#c9703a'], [70, '#ffd27a'], [58, COL.He], [47, COL.C], [38, COL.Ne], [31, COL.O], [24, COL.Si]];
    for (let i = 0; i < 640; i++) { const sh = shells[Math.floor(R() * R() * shells.length)]; ej.push({ a: R() * 6.283, r: sh[0] * (0.5 + 0.5 * R()), v: 110 + R() * 190, c: sh[1], s: R() }); }
    const tC = 3, tB = 5.6;
    return {
      title: '초신성 폭발', p: 41, dur: 14,
      beats: [[0, '철 중심핵: 핵융합으로 에너지를 못 내서 압력 경도력이 버티지 못해요'], [tC, '중력 붕괴: 중심핵이 1초도 안 돼 무너져요 (중력 ≫ 압력 경도력)'], [tB, '초신성 폭발: 외곽층이 우주 공간으로 날아가요'], [9.2, `남은 중심핵 → ${S.FATE_NAME[fate]} (약 ${Mr.toFixed(1)} M☉). 약 25 M☉ 미만은 중성자별, 그 이상은 블랙홀`]],
      sound: [[tB, 'boom']],
      draw(x, t, w) {
        const sx = 335, sy = 255;
        if (t < tB) {
          const fall = E(seg(t, tC + 0.4, tB)) * 0.12, coreR = t < tC ? 16 : lerp(16, 4, E(seg(t, tC, tC + 0.45)));
          const z = zoomAt(t, [[0.3, 1], [1.5, 2.4]]);
          zoomed(x, sx, sy, z, () => {
            glow(x, sx, sy, 300, '#ff6a3a', 0.18);
            x.fillStyle = rgbT(3500, 1, 0.85); x.beginPath(); x.arc(sx, sy, 200 * (1 - fall * 0.3), 0, 7); x.fill();
            section(x, sx, sy, shells.slice(1).map(([r, c]) => ({ r: r * (1 - fall), c, burn: false })).concat([{ r: coreR, c: COL.Fe }]), w);
          });
          clipView(x, () => { x.globalAlpha = seg(z, 1.3, 2.2); ring(x, sx, sy, Math.max(coreR, 5) * z, 6, t < tC ? 40 : 72, t < tC ? 8 : 3, w * 0.1, t < tC ? 5 : 7); x.globalAlpha = 1; });
          layerTags(x, sx, sy, z, [{ r: 64, txt: '수소', col: '#ffd27a' }, { r: 41, txt: '탄소·네온·산소', col: COL.C }, { r: 20, txt: '규소', col: COL.Si }, { r: coreR * 0.5, txt: '철 중심핵', col: '#c9ced4' }], seg(z, 1.3, 2.2));
          tag(x, t < tC ? '철 중심핵: 버틸 힘이 없어요' : '중력 붕괴!', VIEW[0] + VIEW[2] / 2, 466, t < tC ? COL.dim : COL.red, 18);
          zoomTag(x, z);
        } else {
          const u = t - tB;
          if (u < 1.2) flashAll(x, 0.85 * (1 - u / 1.2));
          x.strokeStyle = `rgba(255,230,190,${cl(1 - u / 3.2, 0, 1)})`; x.lineWidth = 6; x.beginPath(); x.arc(sx, sy, u * 220, 0, 7); x.stroke();
          for (const q of ej) { const r = q.r + q.v * u, a = cl(1 - u / 8.5, 0, 1); x.globalAlpha = a; x.fillStyle = q.c; x.beginPath(); x.arc(sx + Math.cos(q.a) * r, sy + Math.sin(q.a) * r, 2.2 + q.s * 2, 0, 7); x.fill(); }
          x.globalAlpha = 1;
          if (fate === 'bh') {
            x.save(); x.translate(sx, sy); x.scale(1, 0.32); const gr = x.createRadialGradient(0, 0, 18, 0, 0, 70); gr.addColorStop(0, 'rgba(255,240,200,0)'); gr.addColorStop(0.3, 'rgba(255,200,120,.9)'); gr.addColorStop(1, 'rgba(255,120,40,0)'); x.fillStyle = gr; x.beginPath(); x.arc(0, 0, 70, 0, 7); x.fill(); x.restore();
            x.fillStyle = '#000'; x.beginPath(); x.arc(sx, sy, 16, 0, 7); x.fill(); x.strokeStyle = 'rgba(255,220,170,.8)'; x.lineWidth = 2; x.beginPath(); x.arc(sx, sy, 18, 0, 7); x.stroke();
          } else {
            const a = w * 4; x.save(); x.translate(sx, sy); x.rotate(a); x.fillStyle = 'rgba(160,210,255,.25)';
            [1, -1].forEach(sg => { x.beginPath(); x.moveTo(0, 0); x.lineTo(sg * 220, -30); x.lineTo(sg * 220, 30); x.closePath(); x.fill(); }); x.restore();
            starDisk(x, sx, sy, 7, 600000, 1.3, 5);
          }
          if (t > 9.2) tag(x, `${S.FATE_NAME[fate]} · ${Mr.toFixed(1)} M☉`, sx, sy + 60, COL.ink, 17);
        }
        legend(x, 30, 40);
        const LX = 600, LW = 340;
        panel(x, LX, 70, LW, 300, '이 별의 마지막');
        mono(x, `${M} M☉`, LX + 20, 118, COL.ink, 30);
        text(x, '처음 질량', LX + 20, 148, COL.dim, 13);
        [['약 8 M☉ 미만', '백색 왜성', 'wd'], ['약 8~25 M☉', '중성자별', 'ns'], ['약 25 M☉ 이상', '블랙홀', 'bh']].forEach(([a, b, f], i) => {
          const Y = 196 + i * 52; x.globalAlpha = f === fate ? 1 : 0.35;
          if (f === fate) { x.fillStyle = 'rgba(255,180,90,.16)'; rr(x, LX + 10, Y - 20, LW - 20, 40, 10); x.fill(); }
          text(x, a, LX + 24, Y, COL.dim, 15); text(x, b, LX + LW - 24, Y, COL.ink, 17, 'right', 700); x.globalAlpha = 1;
        });
      }
    };
  };

  /* ---------- 재생 ----------
     한 장면(자막 하나)씩 재생하고 끝나면 멈춰서 기다림. '다음'을 눌러야 다음 장면으로.
     처음엔 제목 화면이 부드럽게 들어옴 (갑자기 튀어나오지 않게) */
  const RATE = 0.85, INTRO = 1.8;
  function play(id, P = {}) {
    const sc = SC[id](P), n = sc.beats.length;
    return new Promise(res => {
      const el = K.el('div', 'scene', `
        <canvas class="scene-c"></canvas>
        <div class="scene-intro"><div class="hud-k">천천히 보기 · 학습지 ${sc.p}쪽</div><div class="scene-it">${sc.title}</div><div class="scene-is">장면 ${n}개 · 다음을 눌러 넘겨요</div></div>
        <div class="scene-top"><div class="hud-k">천천히 보기 · 학습지 ${sc.p}쪽</div><div class="scene-t">${sc.title}</div></div>
        <div class="scene-bot">
          <div class="scene-cap"><div class="scene-n num"></div><div class="scene-x"></div><div class="scene-dots">${sc.beats.map(() => '<i></i>').join('')}</div></div>
          <div class="scene-btns"><button class="btn ghost" data-a="skip">건너뛰기</button><button class="btn" data-a="prev" aria-label="이전 장면">◀</button><button class="btn" data-a="re" aria-label="이 장면 다시">↺</button><button class="btn primary" data-a="next">다음 ▶</button></div>
        </div>`);
      document.body.appendChild(el);
      const c = el.querySelector('canvas'), x = c.getContext('2d');
      const capN = el.querySelector('.scene-n'), capX = el.querySelector('.scene-x'), dots = [...el.querySelectorAll('.scene-dots i')];
      const bNext = el.querySelector('[data-a=next]'), bPrev = el.querySelector('[data-a=prev]'), bRe = el.querySelector('[data-a=re]'), bSkip = el.querySelector('[data-a=skip]');
      const intro = el.querySelector('.scene-intro');
      let beat = P.__beat || 0, t = P.__t != null ? P.__t : sc.beats[beat][0], wall = 0, last = performance.now(), alive = true, shown = -1;
      let started = P.__t != null; // 점검용: 바로 시작
      let sounds = (sc.sound || []).filter(q => q[0] > t);
      const segEnd = b => b + 1 < n ? sc.beats[b + 1][0] : sc.dur;
      const R = rnd(3), bg = Array.from({ length: 140 }, () => [R(), R(), R() * 1.4 + 0.3, R()]);
      if (started) intro.remove(); else el.classList.add('pre');
      function paintCap() {
        capX.textContent = sc.beats[beat][1]; capN.textContent = '장면 ' + (beat + 1) + ' / ' + n;
        dots.forEach((d, i) => d.className = i < beat ? 'done' : i === beat ? 'on' : '');
        bPrev.disabled = beat === 0; bNext.textContent = beat + 1 < n ? '다음 ▶' : '시뮬로 ▶';
        capX.classList.remove('in'); void capX.offsetWidth; capX.classList.add('in');
      }
      function frame(now) {
        if (!alive) return;
        const dt = Math.min(0.1, (now - last) / 1000); last = now; wall += dt;
        if (!started && wall > INTRO) { started = true; el.classList.remove('pre'); intro.classList.add('out'); setTimeout(() => intro.remove(), 600); }
        const end = segEnd(beat);
        if (started && t < end) t = Math.min(end, t + dt * RATE);
        const held = started && t >= end;
        bNext.classList.toggle('ready', held);
        const dpr = Math.min(2, g.devicePixelRatio || 1), W = c.clientWidth, H = c.clientHeight;
        if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) { c.width = Math.round(W * dpr); c.height = Math.round(H * dpr); }
        x.setTransform(dpr, 0, 0, dpr, 0, 0); x.fillStyle = '#04060d'; x.fillRect(0, 0, W, H);
        for (const [a, b, r, p] of bg) { x.globalAlpha = 0.35 + 0.3 * Math.sin(wall + p * 9); x.fillStyle = '#cfe0ff'; x.beginPath(); x.arc(a * W, b * H, r, 0, 7); x.fill(); } x.globalAlpha = 1;
        if (started) {
          const capH = el.querySelector('.scene-bot').offsetHeight + 12, topH = 64;
          const k = Math.min(W / VW, (H - capH - topH) / (VH - 100)), ox = (W - VW * k) / 2, oy = topH;
          x.globalAlpha = Math.min(1, (wall - INTRO) / 0.6 + (P.__t != null ? 1 : 0));
          x.setTransform(dpr * k, 0, 0, dpr * k, dpr * ox, dpr * oy);
          try { sc.draw(x, t, wall); } catch (e) { console.error(e); }
          x.globalAlpha = 1;
          if (shown !== beat) { shown = beat; paintCap(); }
        }
        while (started && sounds.length && t >= sounds[0][0]) SFX(sounds.shift()[1]);
        requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
      const close = () => { if (!alive) return; alive = false; removeEventListener('keydown', kd); el.classList.add('out'); setTimeout(() => el.remove(), 350); res(); };
      const go = b => { beat = b; t = sc.beats[b][0]; sounds = (sc.sound || []).filter(q => q[0] >= t); shown = -1; };
      function next() {
        if (!started) { wall = INTRO; return; } // 제목 화면에서 누르면 바로 시작
        if (beat + 1 < n) { go(beat + 1); SFX('tick'); } else close();
      }
      bNext.onclick = next;
      bPrev.onclick = () => { if (beat > 0) go(beat - 1); };
      bRe.onclick = () => go(beat);
      bSkip.onclick = close;
      c.addEventListener('click', next);
      intro.addEventListener('click', next);
      const kd = e => {
        if (e.key === 'Enter' || e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); bPrev.click(); }
        else if (e.key === 'Escape') { e.preventDefault(); close(); }
      };
      addEventListener('keydown', kd);
      setTimeout(() => bNext.focus({ preventScroll: true }), 50);
    });
  }

  g.SCENES = { play, list: Object.keys(SC), visFrac };
})(window);
