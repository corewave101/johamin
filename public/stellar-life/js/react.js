/* 별의 일생 — 핵융합 반응 애니메이션 (2D 캔버스)
   pp: 양성자-양성자 연쇄 반응, cno: 탄소-질소-산소 순환 반응, triple: 헬륨 핵융합(3 ⁴He → ¹²C) */
(function (g) {
  'use strict';
  const COL = { H: '#ff6b7d', D: '#ff9a5a', He3: '#ffc46a', He4: '#f08a4b', Be: '#9c8cff', C: '#c46aa0', N: '#53b3c9', O: '#6e7fd1', e: '#7fd6ff' };
  const ease = t => t < 0 ? 0 : t > 1 ? 1 : t * t * (3 - 2 * t);
  const lerp = (a, b, t) => a + (b - a) * t;

  function nuc(x, ctx, X, Y, label, col, r = 17) {
    ctx.save();
    const gr = ctx.createRadialGradient(X - r * .35, Y - r * .35, r * .1, X, Y, r);
    gr.addColorStop(0, '#fff'); gr.addColorStop(0.25, col); gr.addColorStop(1, shade(col));
    ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(X, Y, r, 0, 7); ctx.fill();
    ctx.fillStyle = '#10131f'; ctx.font = `700 ${Math.round(r * 0.78)}px "IBM Plex Sans KR", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(label, X, Y + 1); ctx.restore();
  }
  function shade(hex) { const n = parseInt(hex.slice(1), 16); const r = (n >> 16) * .45 | 0, g2 = (n >> 8 & 255) * .45 | 0, b = (n & 255) * .45 | 0; return `rgb(${r},${g2},${b})`; }
  function small(ctx, X, Y, label, col, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(X, Y, 7, 0, 7); ctx.fill(); ctx.fillStyle = '#e9eefc'; ctx.font = '600 13px "IBM Plex Sans KR"'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle'; ctx.fillText(label, X + 11, Y); ctx.restore(); }
  function gamma(ctx, x0, y0, x1, y1, u, a = 1) {
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = '#ffe28a'; ctx.lineWidth = 2.5; ctx.beginPath();
    const n = 40, len = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / len, ny = (x1 - x0) / len;
    for (let i = 0; i <= n; i++) { const s = i / n * u; const X = lerp(x0, x1, s), Y = lerp(y0, y1, s); const w = Math.sin(s * len / 6) * 6; i ? ctx.lineTo(X + nx * w, Y + ny * w) : ctx.moveTo(X + nx * w, Y + ny * w); }
    ctx.stroke(); ctx.fillStyle = '#ffe28a'; ctx.font = '700 14px "IBM Plex Sans KR"'; ctx.fillText('γ', lerp(x0, x1, u) + 8, lerp(y0, y1, u) - 8); ctx.restore();
  }
  function flash(ctx, X, Y, k) { if (k <= 0) return; ctx.save(); const r = 10 + 50 * (1 - k); const gr = ctx.createRadialGradient(X, Y, 0, X, Y, r); gr.addColorStop(0, `rgba(255,250,220,${k})`); gr.addColorStop(1, 'rgba(255,200,120,0)'); ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(X, Y, r, 0, 7); ctx.fill(); ctx.restore(); }
  function caption(ctx, w, top, bottom) {
    ctx.save(); ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    ctx.fillStyle = '#e9eefc'; ctx.font = '700 16px "IBM Plex Sans KR"'; ctx.fillText(top, w / 2, 10);
    ctx.fillStyle = '#9aa6c4'; ctx.font = '500 12px "IBM Plex Sans KR"';
    (Array.isArray(bottom) ? bottom : [bottom]).forEach((l, i, arr) => ctx.fillText(l, w / 2, ctx.canvas.height / (ctx.getTransform().a || 1) - 20 - (arr.length - 1 - i) * 16));
    ctx.restore();
  }

  function pp(ctx, w, h, t) {
    const T = 7.6, u = t % T, cx = w / 2, cy = h / 2 + 4;
    let top = '';
    if (u < 2.4) {
      top = '¹H + ¹H → ²H + e⁺ + ν';
      const a = ease(u / 1.2);
      if (u < 1.2) { nuc(0, ctx, lerp(cx - 130, cx - 16, a), cy, '¹H', COL.H, 15); nuc(0, ctx, lerp(cx + 130, cx + 16, a), cy, '¹H', COL.H, 15); }
      else { const b = ease((u - 1.2) / 1.2); flash(ctx, cx, cy, 1 - b * 1.5); nuc(0, ctx, cx, cy, '²H', COL.D, 19); small(ctx, cx + b * 110, cy - b * 60, 'e⁺ 양전자', COL.e); small(ctx, cx + b * 120, cy + b * 55, 'ν 중성미자', '#b7c2dc', 1 - b * .3); }
    } else if (u < 4.8) {
      top = '²H + ¹H → ³He + γ';
      const v = u - 2.4;
      if (v < 1.0) { const a = ease(v); nuc(0, ctx, cx + 10, cy, '²H', COL.D, 19); nuc(0, ctx, lerp(cx - 140, cx - 22, a), cy, '¹H', COL.H, 15); }
      else { const b = ease((v - 1) / 1.4); flash(ctx, cx, cy, 1 - b * 1.5); nuc(0, ctx, cx, cy, '³He', COL.He3, 21); gamma(ctx, cx + 20, cy - 10, cx + 130, cy - 70, b); }
    } else {
      top = '³He + ³He → ⁴He + ¹H + ¹H';
      const v = u - 4.8;
      if (v < 1.1) { const a = ease(v / 1.1); nuc(0, ctx, lerp(cx - 140, cx - 22, a), cy, '³He', COL.He3, 21); nuc(0, ctx, lerp(cx + 140, cx + 22, a), cy, '³He', COL.He3, 21); }
      else { const b = ease((v - 1.1) / 1.6); flash(ctx, cx, cy, 1 - b * 1.5); nuc(0, ctx, cx, cy, '⁴He', COL.He4, 24); nuc(0, ctx, cx - b * 120, cy - b * 50, '¹H', COL.H, 14); nuc(0, ctx, cx + b * 120, cy - b * 50, '¹H', COL.H, 14); }
    }
    caption(ctx, w, top, ['앞의 두 단계가 두 번씩 일어나 ³He 2개가 생김', '전체: 4 ¹H → ⁴He · 줄어든 질량 0.7% → 에너지 (E = Δmc²)']);
  }

  const CNO_N = [['¹²C', 'C'], ['¹³N', 'N'], ['¹³C', 'C'], ['¹⁴N', 'N'], ['¹⁵O', 'O'], ['¹⁵N', 'N']];
  const CNO_S = [
    ['¹²C + ¹H → ¹³N + γ', 'p'], ['¹³N → ¹³C + e⁺ + ν', 'e'], ['¹³C + ¹H → ¹⁴N + γ', 'p'],
    ['¹⁴N + ¹H → ¹⁵O + γ', 'p'], ['¹⁵O → ¹⁵N + e⁺ + ν', 'e'], ['¹⁵N + ¹H → ¹²C + ⁴He', 'a']
  ];
  function cno(ctx, w, h, t) {
    const step = 1.4, u = t % (step * 6), i = Math.floor(u / step), f = (u % step) / step;
    const cx = w / 2, cy = h / 2 - 4, R = Math.min(w, h) * 0.22;
    const P = k => { const a = -Math.PI / 2 + k / 6 * Math.PI * 2; return [cx + R * Math.cos(a), cy + R * Math.sin(a)]; };
    ctx.save(); ctx.strokeStyle = 'rgba(150,180,255,.25)'; ctx.lineWidth = 2; ctx.setLineDash([5, 6]); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); ctx.restore();
    CNO_N.forEach(([lab, el], k) => { const [x, y] = P(k); ctx.globalAlpha = k === i || k === (i + 1) % 6 ? 1 : 0.65; nuc(0, ctx, x, y, lab, COL[el], 18); ctx.globalAlpha = 1; });
    const [x0, y0] = P(i), [x1, y1] = P((i + 1) % 6), [mx, my] = [lerp(x0, x1, ease(f)), lerp(y0, y1, ease(f))];
    ctx.save(); ctx.strokeStyle = '#ffb45a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(mx, my); ctx.stroke(); ctx.restore();
    const kind = CNO_S[i][1];
    const ox = cx + (x0 + x1 - 2 * cx) * 1.5 / 2, oy = cy + (y0 + y1 - 2 * cy) * 1.5 / 2;
    if (kind === 'p' || kind === 'a') { if (f < 0.5) nuc(0, ctx, lerp(ox, mx, ease(f * 2)), lerp(oy, my, ease(f * 2)), '¹H', COL.H, 12); }
    if (kind === 'e' && f > 0.4) { const b = (f - .4) / .6; small(ctx, lerp(mx, ox, b), lerp(my, oy, b), 'e⁺', COL.e); small(ctx, lerp(mx, cx, b * .8), lerp(my, cy, b * .8), 'ν', '#b7c2dc'); }
    if (kind === 'p' && f > 0.5) gamma(ctx, mx, my, lerp(mx, ox, 1), lerp(my, oy, 1), (f - .5) * 2, 1 - (f - .5));
    if (kind === 'a' && f > 0.5) { const b = (f - .5) * 2; nuc(0, ctx, lerp(mx, cx, b), lerp(my, cy, b), '⁴He', COL.He4, 20); }
    caption(ctx, w, CNO_S[i][0], ['탄소·질소·산소는 촉매: 한 바퀴 돌면 다시 ¹²C', '전체: 4 ¹H → ⁴He (중심 온도가 높은, 무거운 별에서 우세)']);
  }

  function triple(ctx, w, h, t) {
    const T = 6.2, u = t % T, cx = w / 2, cy = h / 2 + 4;
    let top;
    if (u < 2.6) {
      top = '⁴He + ⁴He → ⁸Be';
      if (u < 1.2) { const a = ease(u / 1.2); nuc(0, ctx, lerp(cx - 140, cx - 22, a), cy, '⁴He', COL.He4, 21); nuc(0, ctx, lerp(cx + 140, cx + 22, a), cy, '⁴He', COL.He4, 21); }
      else { const b = (u - 1.2) / 1.4; flash(ctx, cx, cy, 1 - b * 1.6); ctx.globalAlpha = 0.6 + 0.4 * Math.sin(u * 30); nuc(0, ctx, cx, cy, '⁸Be', COL.Be, 23); ctx.globalAlpha = 1;
        ctx.fillStyle = '#9aa6c4'; ctx.font = '500 12px "IBM Plex Sans KR"'; ctx.textAlign = 'center'; ctx.fillText('아주 불안정 (곧 쪼개짐)', cx, cy + 40); }
    } else {
      top = '⁸Be + ⁴He → ¹²C + γ';
      const v = u - 2.6;
      if (v < 1.1) { const a = ease(v / 1.1); nuc(0, ctx, cx + 12, cy, '⁸Be', COL.Be, 23); nuc(0, ctx, lerp(cx - 140, cx - 26, a), cy, '⁴He', COL.He4, 21); }
      else { const b = ease((v - 1.1) / 2.5); flash(ctx, cx, cy, 1 - b * 1.5); nuc(0, ctx, cx, cy, '¹²C', COL.C, 27); gamma(ctx, cx + 24, cy - 12, cx + 135, cy - 70, b); }
    }
    caption(ctx, w, top, ['중심 온도 약 1억 K에서 시작', '전체: 3 ⁴He → ¹²C + 에너지 (헬륨 핵융합)']);
  }

  function draw(canvas, kind, t) {
    const dpr = Math.min(2, g.devicePixelRatio || 1), w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) { canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    const ctx = canvas.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, canvas.width, canvas.height);
    const k = Math.max(1, Math.min(w / 460, h / 280)); // 크게 볼 때는 통째로 확대
    ctx.setTransform(dpr * k, 0, 0, dpr * k, 0, 0);
    ({ pp, cno, triple })[kind](ctx, w / k, h / k, t);
  }
  const NAME = { pp: '양성자-양성자 연쇄 반응', cno: '탄소-질소-산소 순환 반응', triple: '헬륨 핵융합' };
  g.REACT = { draw, NAME };
})(window);
