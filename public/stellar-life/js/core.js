/* 별의 일생 — 공용 3D·화면 도구 */
(function (g) {
  'use strict';
  const S = g.STAR;

  /* ---------- 렌더러 ---------- */
  function setup(container, opts = {}) {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(2, g.devicePixelRatio || 1));
    renderer.setClearColor(opts.clear || 0x04060d, 1);
    renderer.localClippingEnabled = true;
    container.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(opts.fov || 45, 1, 0.05, 6000);
    const frames = [];
    let last = performance.now(), running = true, alive = true;
    function resize() {
      const w = container.clientWidth, h = container.clientHeight;
      renderer.setSize(w, h, false);
      renderer.domElement.style.width = w + 'px';
      renderer.domElement.style.height = h + 'px';
      camera.aspect = w / Math.max(1, h);
      camera.updateProjectionMatrix();
      frames.forEach(f => f.resize && f.resize(w, h));
    }
    const ro = new ResizeObserver(resize); ro.observe(container);
    resize();
    function loop(now) {
      const dt = Math.min(0.1, (now - last) / 1000); last = now;
      if (!alive) return;
      if (running) { frames.forEach(f => f(dt, now / 1000)); renderer.render(scene, camera); } // 멈춘 동안은 그리지도 않음
      if (alive) requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
    return {
      renderer, scene, camera, container,
      onFrame(fn) { frames.push(fn); return fn; },
      pause(v) { running = !v; },
      stop() { alive = false; ro.disconnect(); renderer.dispose(); renderer.domElement.remove(); frames.length = 0; },
      size() { return { w: container.clientWidth, h: container.clientHeight }; }
    };
  }

  /* ---------- 카메라 궤도 조작(드래그 회전, 핀치·휠 확대) ---------- */
  function orbit(camera, dom, o = {}) {
    const st = { target: new THREE.Vector3().copy(o.target || new THREE.Vector3()), dist: o.dist || 10, theta: o.theta ?? 0.6, phi: o.phi ?? 1.2, min: o.min || 2, max: o.max || 200, auto: o.auto ?? 0.05, enabled: true };
    const goal = { ...st, target: st.target.clone() };
    const ptrs = new Map();
    let pinch0 = 0, dist0 = 0, idle = 0;
    dom.addEventListener('pointerdown', e => { if (!st.enabled) return; dom.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, { x: e.clientX, y: e.clientY }); idle = 0; });
    dom.addEventListener('pointermove', e => {
      if (!ptrs.has(e.pointerId)) return;
      const p = ptrs.get(e.pointerId), dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      if (ptrs.size === 1) { goal.theta -= dx * 0.006; goal.phi = S.clamp(goal.phi - dy * 0.006, 0.15, Math.PI - 0.15); }
      else if (ptrs.size === 2) {
        const [a, b] = [...ptrs.values()]; const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (!pinch0) { pinch0 = d; dist0 = goal.dist; }
        goal.dist = S.clamp(dist0 * pinch0 / d, st.min, st.max);
      }
      idle = 0;
    });
    const up = e => { ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch0 = 0; };
    dom.addEventListener('pointerup', up); dom.addEventListener('pointercancel', up);
    dom.addEventListener('wheel', e => { e.preventDefault(); goal.dist = S.clamp(goal.dist * Math.exp(e.deltaY * 0.001), st.min, st.max); }, { passive: false });
    function update(dt) {
      idle += dt;
      if (idle > 4 && st.auto) goal.theta += st.auto * dt;
      const k = 1 - Math.exp(-dt * 8);
      st.theta += (goal.theta - st.theta) * k; st.phi += (goal.phi - st.phi) * k; st.dist += (goal.dist - st.dist) * k;
      st.target.lerp(goal.target, k);
      const s = Math.sin(st.phi);
      camera.position.set(st.target.x + st.dist * s * Math.sin(st.theta), st.target.y + st.dist * Math.cos(st.phi), st.target.z + st.dist * s * Math.cos(st.theta));
      camera.lookAt(st.target);
    }
    return { st, goal, update, get dragging() { return ptrs.size > 0; } };
  }

  /* ---------- 별 표면 셰이더: 흑체 색 + 주연 감광 + 쌀알 무늬 ---------- */
  const NOISE = `
    vec3 h3(vec3 p){p=fract(p*vec3(.1031,.1030,.0973));p+=dot(p,p.yxz+33.33);return fract((p.xxy+p.yxx)*p.zyx);}
    float vn(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
      float a=dot(h3(i),vec3(1.)),b=dot(h3(i+vec3(1,0,0)),vec3(1.)),c=dot(h3(i+vec3(0,1,0)),vec3(1.)),d=dot(h3(i+vec3(1,1,0)),vec3(1.));
      float e=dot(h3(i+vec3(0,0,1)),vec3(1.)),f2=dot(h3(i+vec3(1,0,1)),vec3(1.)),g=dot(h3(i+vec3(0,1,1)),vec3(1.)),h=dot(h3(i+vec3(1,1,1)),vec3(1.));
      return mix(mix(mix(a,b,f.x),mix(c,d,f.x),f.y),mix(mix(e,f2,f.x),mix(g,h,f.x),f.y),f.z)/3.;}
    float fbm(vec3 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*vn(p);p*=2.03;a*=.5;}return s;}`;
  function starMaterial(o = {}) {
    return new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(1, 0.9, 0.7) }, uTime: { value: 0 }, uGran: { value: 0.35 }, uBright: { value: 1 }, uScale: { value: 3 } },
      vertexShader: `varying vec3 vN; varying vec3 vP; varying vec3 vV;
        #include <clipping_planes_pars_vertex>
        void main(){ vec4 mvPosition=modelViewMatrix*vec4(position,1.); vN=normalize(normalMatrix*normal); vP=position; vV=normalize(-mvPosition.xyz);
          gl_Position=projectionMatrix*mvPosition;
          #include <clipping_planes_vertex>
        }`,
      fragmentShader: `uniform vec3 uColor; uniform float uTime,uGran,uBright,uScale; varying vec3 vN; varying vec3 vP; varying vec3 vV;
        #include <clipping_planes_pars_fragment>
        ${NOISE}
        void main(){
          #include <clipping_planes_fragment>
          float mu=clamp(dot(normalize(vN),normalize(vV)),0.,1.);
          float limb=1.-.6*(1.-mu)-.15*(1.-mu*mu);
          vec3 q=normalize(vP)*uScale;
          float n=fbm(q*2.5+vec3(0.,uTime*.05,uTime*.03));
          float cells=fbm(q*7.+n*2.+uTime*.08);
          float gran=mix(1.,.65+.7*cells,uGran);
          vec3 col=uColor*limb*gran*uBright;
          col+=uColor*pow(1.-mu,3.)*.25;
          gl_FragColor=vec4(col,1.);
        }`,
      clipping: true, side: o.side || THREE.FrontSide
    });
  }
  function setTemp(mat, T, bright = 1) {
    const [r, g2, b] = S.bbRGB(T);
    mat.uniforms.uColor.value.setRGB(r, g2, b);
    mat.uniforms.uBright.value = bright;
  }

  /* ---------- 빛 번짐 스프라이트 ---------- */
  let _glowTex = null;
  function glowTexture() {
    if (_glowTex) return _glowTex;
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d'); const gr = x.createRadialGradient(128, 128, 0, 128, 128, 128);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.18, 'rgba(255,255,255,.55)');
    gr.addColorStop(0.45, 'rgba(255,255,255,.12)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 256, 256);
    _glowTex = new THREE.CanvasTexture(c); return _glowTex;
  }
  function glow(size = 4, opacity = 0.8) {
    const m = new THREE.SpriteMaterial({ map: glowTexture(), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity });
    const s = new THREE.Sprite(m); s.scale.set(size, size, 1); return s;
  }
  let _dot = null;
  function dotTexture() {
    if (_dot) return _dot;
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d'); const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.5, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = gr; x.fillRect(0, 0, 64, 64);
    _dot = new THREE.CanvasTexture(c); return _dot;
  }
  function starfield(scene, n = 2500, r = 1500) {
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, s = Math.sqrt(1 - u * u);
      pos.set([r * s * Math.cos(th), r * u, r * s * Math.sin(th)], i * 3);
      const T = 2500 + Math.pow(Math.random(), 2.5) * 25000; const [a, b, c] = S.bbRGB(T); const k = 0.4 + Math.random() * 0.6;
      col.set([a * k, b * k, c * k], i * 3);
    }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const pts = new THREE.Points(geo, new THREE.PointsMaterial({ size: 2.2, sizeAttenuation: false, vertexColors: true, map: dotTexture(), transparent: true, depthWrite: false }));
    scene.add(pts); return pts;
  }

  /* ---------- 텍스트 스프라이트 ---------- */
  function label(text, o = {}) {
    const c = document.createElement('canvas'); const x = c.getContext('2d');
    const fs = o.size || 44; x.font = `600 ${fs}px "IBM Plex Sans KR", sans-serif`;
    const w = Math.ceil(x.measureText(text).width) + 28; c.width = w; c.height = fs + 22;
    x.font = `600 ${fs}px "IBM Plex Sans KR", sans-serif`; x.textBaseline = 'middle';
    if (o.bg !== false) { x.fillStyle = o.bg || 'rgba(6,10,22,.72)'; x.beginPath(); x.roundRect ? x.roundRect(0, 0, w, c.height, 12) : x.rect(0, 0, w, c.height); x.fill(); }
    x.fillStyle = o.color || '#eaf2ff'; x.fillText(text, 14, c.height / 2 + 1);
    const t = new THREE.CanvasTexture(c); t.minFilter = THREE.LinearFilter;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: o.depthTest ?? false, transparent: true }));
    const h = o.h || 0.5; s.scale.set(h * w / c.height, h, 1); s.renderOrder = 10; return s;
  }

  /* ---------- H-R도 (캔버스) ---------- */
  class HR {
    constructor(w = 1024, h = 768) {
      this.c = document.createElement('canvas'); this.c.width = w; this.c.height = h;
      this.x = this.c.getContext('2d');
      this.m = { l: 104, r: 34, t: 74, b: 84 };
      this.Tmax = 60000; this.Tmin = 900; this.Lmin = -5; this.Lmax = 7;
      this.tex = (typeof THREE !== 'undefined') ? new THREE.CanvasTexture(this.c) : null;
      this.bg = null;
    }
    px(T, L) {
      const { l, r, t, b } = this.m, W = this.c.width - l - r, H = this.c.height - t - b;
      const fx = (Math.log10(this.Tmax) - Math.log10(T)) / (Math.log10(this.Tmax) - Math.log10(this.Tmin));
      const fy = (this.Lmax - Math.log10(Math.max(L, 1e-12))) / (this.Lmax - this.Lmin);
      return [l + fx * W, t + fy * H];
    }
    drawBase() {
      const x = this.x, { l, r, t, b } = this.m, W = this.c.width, H = this.c.height;
      x.clearRect(0, 0, W, H);
      x.fillStyle = 'rgba(8,16,34,.82)'; x.strokeStyle = 'rgba(127,214,255,.45)'; x.lineWidth = 3;
      x.beginPath(); x.roundRect ? x.roundRect(4, 4, W - 8, H - 8, 26) : x.rect(4, 4, W - 8, H - 8); x.fill(); x.stroke();
      // 분광형 띠
      const bands = [[60000, 30000, 'O'], [30000, 10000, 'B'], [10000, 7500, 'A'], [7500, 6000, 'F'], [6000, 5200, 'G'], [5200, 3700, 'K'], [3700, 2400, 'M']];
      x.font = '600 26px "JetBrains Mono", monospace'; x.textAlign = 'center'; x.textBaseline = 'middle';
      bands.forEach(([a, z, n]) => {
        const [x0] = this.px(a, 1), [x1] = this.px(z, 1); const [rr, gg, bb] = S.bbRGB(Math.sqrt(a * z));
        x.fillStyle = `rgba(${rr * 255 | 0},${gg * 255 | 0},${bb * 255 | 0},.10)`; x.fillRect(x0, t, x1 - x0, H - t - b);
        x.fillStyle = `rgb(${rr * 255 | 0},${gg * 255 | 0},${bb * 255 | 0})`; x.fillText(n, (x0 + x1) / 2, t - 26);
      });
      // 격자
      x.strokeStyle = 'rgba(160,200,255,.12)'; x.lineWidth = 1.5; x.font = '500 21px "JetBrains Mono", monospace';
      x.fillStyle = 'rgba(200,225,255,.7)';
      for (let e = this.Lmin; e <= this.Lmax; e += 2) {
        const [, y] = this.px(5000, Math.pow(10, e));
        x.beginPath(); x.moveTo(l, y); x.lineTo(W - r, y); x.stroke();
        x.textAlign = 'right'; x.fillText(e === 0 ? '1' : '10' + String(e).replace('-', '⁻').replace(/\d/g, c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]), l - 12, y);
      }
      [40000, 20000, 10000, 5000, 3000, 2000, 1000].forEach(T => {
        const [xx] = this.px(T, 1);
        x.beginPath(); x.moveTo(xx, t); x.lineTo(xx, H - b); x.stroke();
        x.textAlign = 'center'; x.fillText(T >= 10000 ? (T / 10000) + '만' : T.toLocaleString(), xx, H - b + 26);
      });
      x.fillStyle = 'rgba(220,235,255,.9)'; x.font = '600 23px "IBM Plex Sans KR", sans-serif';
      x.textAlign = 'center'; x.fillText('표면 온도 (K) →낮음', (l + W - r) / 2, H - 26);
      x.save(); x.translate(30, (t + H - b) / 2); x.rotate(-Math.PI / 2); x.fillText('광도 (태양 = 1)', 0, 0); x.restore();
      // 주계열
      x.strokeStyle = 'rgba(255,214,140,.55)'; x.lineWidth = 16; x.lineCap = 'round'; x.beginPath();
      for (let i = 0; i <= 60; i++) { const M = Math.pow(10, -1.1 + i * 2.88 / 60); const L = S.msL(M), T = S.teff(L, S.msR(M)); const [px, py] = this.px(T, L); i ? x.lineTo(px, py) : x.moveTo(px, py); }
      x.globalAlpha = 0.35; x.stroke(); x.globalAlpha = 1;
      x.font = '600 22px "IBM Plex Sans KR", sans-serif'; x.fillStyle = 'rgba(255,214,140,.85)';
      let [qx, qy] = this.px(14000, 300); x.textAlign = 'left'; x.fillText('주계열', qx + 18, qy + 34);
      x.fillStyle = 'rgba(255,150,120,.75)'; [qx, qy] = this.px(3600, 3000); x.fillText('거성', qx - 10, qy);
      [qx, qy] = this.px(5500, 3e5); x.fillText('초거성', qx, qy);
      x.fillStyle = 'rgba(200,220,255,.75)'; [qx, qy] = this.px(25000, 3e-3); x.fillText('백색 왜성', qx, qy);
      this.bg = x.getImageData(0, 0, W, H);
    }
    begin() { if (!this.bg) this.drawBase(); else this.x.putImageData(this.bg, 0, 0); }
    path(pts, color = 'rgba(127,214,255,.95)', w = 5) {
      const x = this.x; if (pts.length < 2) return;
      x.save(); this.clip(); x.strokeStyle = color; x.lineWidth = w; x.lineJoin = 'round'; x.lineCap = 'round'; x.beginPath();
      pts.forEach(([T, L], i) => { const [a, b] = this.px(T, L); i ? x.lineTo(a, b) : x.moveTo(a, b); }); x.stroke(); x.restore();
    }
    clip() { const { l, r, t, b } = this.m; this.x.beginPath(); this.x.rect(l, t, this.c.width - l - r, this.c.height - t - b); this.x.clip(); }
    dot(T, L, rad = 6, col) {
      const x = this.x; let [a, b] = this.px(T, L); const { l, r, t, b: bm } = this.m;
      const W = this.c.width, H = this.c.height; const off = a < l || a > W - r || b < t || b > H - bm;
      a = S.clamp(a, l, W - r); b = S.clamp(b, t, H - bm);
      const [rr, gg, bb] = S.bbRGB(T); x.fillStyle = col || `rgb(${rr * 255 | 0},${gg * 255 | 0},${bb * 255 | 0})`;
      x.beginPath(); x.arc(a, b, rad, 0, Math.PI * 2); x.fill(); return { a, b, off };
    }
    marker(T, L, text) {
      const x = this.x; const d = this.dot(T, L, 12);
      x.strokeStyle = '#fff'; x.lineWidth = 3; x.beginPath(); x.arc(d.a, d.b, 20, 0, Math.PI * 2); x.stroke();
      if (text) {
        x.font = '700 24px "IBM Plex Sans KR", sans-serif'; const tw = x.measureText(text).width + 20;
        const W = this.c.width; let tx = d.a + 28, ty = d.b - 30; if (tx + tw > W - 20) tx = d.a - 28 - tw; if (ty < 50) ty = d.b + 34;
        x.fillStyle = 'rgba(4,8,20,.85)'; x.fillRect(tx, ty - 18, tw, 36); x.fillStyle = '#fff'; x.textAlign = 'left'; x.textBaseline = 'middle'; x.fillText(text, tx + 10, ty);
      }
      if (d.off) {
        x.font = '600 20px "IBM Plex Sans KR", sans-serif'; x.fillStyle = '#ffd38a'; x.textAlign = 'center';
        const H = this.c.height; const yy = d.b + 50 > H - this.m.b ? d.b - 46 : d.b + 50;
        x.fillText(L > Math.pow(10, this.Lmax) ? '↑ 그래프 위로 벗어남' : T > this.Tmax ? '← 너무 뜨거워 그래프 밖' : L < Math.pow(10, this.Lmin) ? '↓ 그래프 아래로 벗어남' : '', d.a + (d.a < 300 ? 110 : 0), yy);
      }
    }
    commit() { if (this.tex) this.tex.needsUpdate = true; }
  }
  function hrPanel(hr, width = 8) {
    const h = width * hr.c.height / hr.c.width;
    const mat = new THREE.MeshBasicMaterial({ map: hr.tex, transparent: true, side: THREE.DoubleSide, depthWrite: false, depthTest: false });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(width, h), mat); m.renderOrder = 20; return m;
  }

  /* ---------- 화면 UI ---------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function quiz(qRaw, layer = document.body) {
    const q = S.shuffledQuiz(qRaw);
    return new Promise(res => {
      const wrap = el('div', 'quiz');
      wrap.innerHTML = `<div class="quiz-card" role="dialog" aria-modal="true">
        <div class="quiz-eyebrow">학습지 ${q.p}쪽 · 빈칸 확인</div>
        <div class="quiz-q">${q.q}</div>
        <div class="quiz-opts">${q.shown.map((o, i) => `<button class="opt" data-i="${i}"><span class="opt-k">${'①②③④'[i]}</span>${o}</button>`).join('')}</div>
        <div class="quiz-why" hidden></div>
        <button class="btn primary quiz-next" hidden>계속</button></div>`;
      layer.appendChild(wrap);
      let ok = false;
      wrap.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => {
        if (wrap.dataset.done) return; wrap.dataset.done = 1;
        const i = +b.dataset.i; ok = i === q.answer;
        wrap.querySelectorAll('.opt').forEach((o, j) => { o.disabled = true; if (j === q.answer) o.classList.add('right'); else if (j === i) o.classList.add('wrong'); });
        const why = $('.quiz-why', wrap); why.hidden = false; why.innerHTML = `<b>${ok ? '정답!' : '아쉬워요.'}</b> ${q.why}`;
        const nx = $('.quiz-next', wrap); nx.hidden = false; nx.focus();
        if (g.SFX) g.SFX(ok ? 'right' : 'wrong');
      }));
      $('.quiz-next', wrap).addEventListener('click', () => { wrap.classList.add('out'); setTimeout(() => wrap.remove(), 220); res(ok); });
      setTimeout(() => wrap.querySelector('.opt').focus(), 50);
    });
  }
  let toastT = 0;
  function toast(msg, ms = 2600) {
    let t = $('.toast'); if (!t) { t = el('div', 'toast'); document.body.appendChild(t); }
    t.innerHTML = msg; t.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), ms);
  }
  function banner(title, sub, ms = 3200) {
    const b = el('div', 'banner', `<div class="banner-t">${title}</div>${sub ? `<div class="banner-s">${sub}</div>` : ''}`);
    document.body.appendChild(b); requestAnimationFrame(() => b.classList.add('on'));
    setTimeout(() => { b.classList.remove('on'); setTimeout(() => b.remove(), 500); }, ms);
  }

  /* ---------- 효과음 (Web Audio 합성) ---------- */
  let ac = null, muted = false;
  try { muted = localStorage.getItem('johamin-stellar-muted') === '1'; } catch (e) { }
  function SFX(kind) {
    if (muted) return;
    try { ac = ac || new (g.AudioContext || g.webkitAudioContext)(); } catch (e) { return; }
    const t = ac.currentTime, o = ac.createOscillator(), v = ac.createGain();
    o.connect(v); v.connect(ac.destination);
    const P = { right: [660, 990, 0.18, 'sine'], wrong: [220, 160, 0.25, 'triangle'], tick: [880, 880, 0.04, 'sine'], phase: [330, 495, 0.5, 'sine'], boom: [90, 30, 1.4, 'sawtooth'], eat: [520, 780, 0.06, 'sine'], ignite: [262, 784, 1.0, 'sine'] }[kind] || [440, 440, 0.1, 'sine'];
    o.type = P[3]; o.frequency.setValueAtTime(P[0], t); o.frequency.exponentialRampToValueAtTime(P[1], t + P[2]);
    v.gain.setValueAtTime(kind === 'boom' ? 0.18 : 0.08, t); v.gain.exponentialRampToValueAtTime(0.0001, t + P[2] + 0.05);
    o.start(t); o.stop(t + P[2] + 0.08);
  }
  SFX.toggle = () => { muted = !muted; try { localStorage.setItem('johamin-stellar-muted', muted ? '1' : '0'); } catch (e) { } return muted; };
  SFX.muted = () => muted;
  g.SFX = SFX;

  g.CORE = { setup, orbit, starMaterial, setTemp, glow, glowTexture, dotTexture, starfield, label, HR, hrPanel, quiz, toast, banner, el, $, NOISE };
})(window);
