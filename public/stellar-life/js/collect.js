/* 1단계 · 모으기 (원시별 → 전주계열성 → 점화)
   물리: 중심 온도 T_c = 1.5×10⁷ K × M/R (비리얼 정리), 1000만 K에서 수소 핵융합 점화
   - 가만히 있으면 시간이 빨리 흐름 → 중력 수축(R↓)이 빨라져 T_c↑
   - 가스를 먹으면 질량↑, 쌓인 물질에 몸이 부풀어 R↑ (강착)
   - 표면 온도: 수축 광도 L = 14.6·M²/R(게임 보정 상수)와 L = 4πR²σT⁴ → 약 1000 K에서 전주계열성 */
(function (g) {
  'use strict';
  const S = STAR, K = CORE, $ = K.$;

  const NEBULAE = [
    { id: 'horse', name: '말머리 성운', where: '오리온자리 · 약 1,400광년', tag: '가벼운 별',
      desc: '붉게 빛나는 성운 앞을 가린 차갑고 어두운 먼지 구름. 가스가 적고 덩어리가 작아요.',
      small: 170, sMax: 12, big: 2, bigM: [1.2, 2], rivals: 3, rivalM: [0.08, 0.3], limit: 120, evap: 0,
      pal: [[.03, .02, .03], [.62, .12, .1], [.95, .3, .22]], blob: [0xffb08a, 0xff8a9e], rim: 0xff6a4a },
    { id: 'orion', name: '오리온 성운', where: 'M42 · 약 1,300광년', tag: '무거운 별',
      desc: '무거운 별(트라페지움)이 태어나는 커다란 별 공장. 가스가 많고 경쟁자도 커요.',
      small: 240, sMax: 40, big: 11, bigM: [1.8, 4.5], rivals: 6, rivalM: [0.4, 1.4], limit: 120, evap: 0,
      pal: [[.03, .03, .06], [.42, .14, .3], [.3, .65, .78]], blob: [0xfff0b0, 0xb8f0ff], rim: 0xff86c0 },
    { id: 'eagle', name: '독수리 성운', where: 'M16 · 약 5,700광년', tag: '시간 압박',
      desc: '근처 무거운 별의 자외선이 "창조의 기둥"을 깎아 내요. 가스가 계속 증발하니 서둘러요.',
      small: 220, sMax: 30, big: 7, bigM: [1.5, 3.5], rivals: 4, rivalM: [0.2, 0.8], limit: 100, evap: 0.012,
      pal: [[.02, .04, .04], [.55, .4, .16], [.3, .8, .66]], blob: [0xffe0a0, 0xb0fff0], rim: 0xffc46a },
    { id: 'taurus', name: '황소자리 분자운', where: '약 450광년', tag: '연습',
      desc: '태양처럼 가벼운 별이 조용히 태어나는 요람. 작은 덩어리가 고르게 많고 경쟁자가 약해요.',
      small: 300, sMax: 8, big: 1, bigM: [1, 1.4], rivals: 2, rivalM: [0.05, 0.15], limit: 140, evap: 0,
      pal: [[.03, .03, .05], [.42, .26, .3], [.8, .6, .5]], blob: [0xffc8a0, 0xe6c8ff], rim: 0xffa070 }
  ];

  function start(stageEl, uiEl, opts) {
    const W3 = K.setup(stageEl, { fov: 50, clear: 0x05060c });
    const { scene, camera, renderer } = W3;
    K.starfield(scene, 2200, 1600);
    let NEB = NEBULAE[0];

    /* ---------- 성운 바닥 ---------- */
    const WORLD = 110;
    const floorU = { uTime: { value: 0 }, uFade: { value: 1 }, uA: { value: new THREE.Vector3() }, uB: { value: new THREE.Vector3() }, uC: { value: new THREE.Vector3() } };
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.ShaderMaterial({
      uniforms: floorU, transparent: true, depthWrite: false,
      vertexShader: `varying vec2 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xz; gl_Position=projectionMatrix*viewMatrix*w; }`,
      fragmentShader: `uniform float uTime,uFade; uniform vec3 uA,uB,uC; varying vec2 vW; ${K.NOISE}
        void main(){ float n=fbm(vec3(vW*.018,uTime*.02)); float m=fbm(vec3(vW*.05+n*2.,uTime*.03));
          float d=length(vW)/${WORLD}.; float edge=smoothstep(1.25,.8,d);
          vec3 c=mix(uA,uB,smoothstep(.35,.75,m))+uC*.35*smoothstep(.58,.82,n);
          gl_FragColor=vec4(c*(.55+.6*edge),(.55+.4*m)*edge*uFade); }`
    }));
    floor.rotation.x = -Math.PI / 2; floor.position.y = -4; floor.renderOrder = -1; scene.add(floor); // 바닥이 가스 덩어리를 덮지 않게 먼저 그림
    const border = new THREE.Mesh(new THREE.RingGeometry(WORLD, WORLD + 0.6, 128), new THREE.MeshBasicMaterial({ color: 0xff9a5a, transparent: true, opacity: 0.18, side: THREE.DoubleSide }));
    border.rotation.x = -Math.PI / 2; border.position.y = -0.5; scene.add(border);
    function setNebula(n) {
      NEB = n; floorU.uA.value.set(...n.pal[0]); floorU.uB.value.set(...n.pal[1]); floorU.uC.value.set(...n.pal[2]);
      border.material.color.set(n.rim);
    }

    /* ---------- 가스 덩어리 ---------- */
    const blobs = [];
    // 가스 덩어리 텍스처: 가운데가 또렷하게 밝음
    const blobTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); const gr = x.createRadialGradient(32, 32, 0, 32, 32, 32);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.28, 'rgba(255,255,255,.9)'); gr.addColorStop(0.55, 'rgba(255,255,255,.3)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
    function addBlob(m, x, z) {
      const c = m > 1 ? 0xfff0d0 : NEB.blob[Math.random() < .3 ? 1 : 0];
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: blobTex, color: c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      const b = { m, x, z, vx: 0, vz: 0, sp, alive: true };
      scaleBlob(b); sp.position.set(x, 0, z); scene.add(sp); blobs.push(b); return b;
    }
    const scaleBlob = b => { const s = 3.4 * Math.cbrt(b.m) + 1.4; b.sp.scale.set(s, s, 1); b.sp.material.opacity = S.clamp(0.7 + b.m, 0.7, 1); };

    /* ---------- 원시별 ---------- */
    function makeProto(M, x, z, isPlayer) {
      const grp = new THREE.Group();
      const mat = K.starMaterial(); const core = new THREE.Mesh(new THREE.SphereGeometry(1, 40, 28), mat);
      const cocoon = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 20), new THREE.MeshBasicMaterial({ color: 0xa04a2a, transparent: true, opacity: 0.22, depthWrite: false }));
      const gl = K.glow(5, 0.5);
      const dpos = new Float32Array(500 * 3), dB = [];
      for (let i = 0; i < 500; i++) dB.push([1.3 + Math.random() * 1.8, Math.random() * 6.283, (Math.random() - .5) * 0.12]);
      const dgeo = new THREE.BufferGeometry(); dgeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
      const disk = new THREE.Points(dgeo, new THREE.PointsMaterial({ size: 0.25, map: K.dotTexture(), color: 0xffa060, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      disk.rotation.x = 0.35;
      grp.add(core, cocoon, gl, disk);
      let reach = null;
      if (isPlayer) { reach = new THREE.Mesh(new THREE.RingGeometry(0.97, 1, 96), new THREE.MeshBasicMaterial({ color: 0xffb45a, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false })); reach.rotation.x = -Math.PI / 2; scene.add(reach); }
      grp.position.set(x, 0, z); scene.add(grp);
      return { M, R: 10, x, z, vx: 0, vz: 0, g: grp, core, mat, cocoon, gl, disk, dB, reach, lit: false, isPlayer, tau: 14 + Math.random() * 6, dU: 0 };
    }
    const reachR = p => 5 + 4.5 * Math.sqrt(p.M);
    const coreR = p => 0.35 + 0.42 * Math.sqrt(p.R);
    const surfaceT = p => S.T_SUN * Math.pow(14.6 * p.M * p.M / Math.pow(p.R, 3), 0.25);
    function minR(M) { if (M >= 0.08) return 0; const TcMax = 1e7 * Math.pow(M / 0.08, 1.3); return 1.5e7 * M / TcMax; }
    const fmtM = M => (M < 1 ? M.toFixed(2) : M.toFixed(M < 10 ? 2 : 1)) + ' M☉';

    /* ---------- 화면 ---------- */
    uiEl.innerHTML = `
    <div class="ui top">
      <div class="top-l" style="flex-direction:column;align-items:flex-start">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <button class="btn back" id="back" aria-label="처음으로">←</button>
          <div class="glass hud" id="hud"><div class="hud-k" id="hk">원시별</div><div class="hud-t num" id="ht">0.05 M☉</div><div class="hud-s" id="hs"></div></div>
        </div>
        <div class="glass" id="mini" hidden style="padding:8px 10px 10px;margin-left:54px">
          <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--dim)"><span id="mini-k">내 별 · 지금 작용하는 힘</span></div>
          <canvas id="minic" style="width:220px;height:150px;display:block"></canvas>
          <div style="font-size:11px;line-height:1.45;color:#d6def4;max-width:220px" id="mini-s"></div>
        </div>
      </div>
      <div class="glass" id="gauge" style="padding:10px 14px;display:grid;gap:7px;width:min(380px,calc(100vw - 150px));pointer-events:auto">
        <div><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--dim)"><span>중심 온도</span><b class="num" id="tcv" style="color:var(--ink)"></b></div>
          <div style="position:relative;height:12px;border-radius:6px;background:#1a2240;margin-top:4px;overflow:hidden"><div id="tcbar" style="position:absolute;inset:0 auto 0 0;background:linear-gradient(90deg,#7a3a2a,#ffb45a,#fff3d6);width:0"></div></div>
          <div style="display:flex;justify-content:space-between;font-size:10px;color:var(--dim);margin-top:2px" class="num"><span>10만 K</span><span>100만 K</span><span style="color:var(--sun)">1000만 K 수소 핵융합</span></div></div>
        <div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;font-size:11px;color:var(--dim)">
          <div>반지름<b class="num" id="rv" style="display:block;color:var(--ink);font-size:13px"></b></div>
          <div>표면 온도<b class="num" id="tv" style="display:block;color:var(--ink);font-size:13px"></b></div>
          <div>흐른 시간<b class="num" id="yv" style="display:block;color:var(--ink);font-size:13px"></b></div>
          <div>남은 성운<b class="num" id="cv" style="display:block;color:var(--ink);font-size:13px"></b></div>
        </div>
        <div id="warp" style="font-size:12px;text-align:center;border-radius:8px;padding:4px;background:rgba(255,255,255,.04)"></div>
      </div>
      <button class="btn back" id="snd" aria-label="소리 켜기/끄기">♪</button>
    </div>
    <div id="ind"></div>
    <div id="joy" hidden style="position:fixed;z-index:25;width:120px;height:120px;margin:-60px 0 0 -60px;border-radius:50%;border:2px solid rgba(255,255,255,.25);pointer-events:none"><div id="knob" style="position:absolute;left:50%;top:50%;width:48px;height:48px;margin:-24px;border-radius:50%;background:rgba(255,180,90,.55)"></div></div>
    <div class="center" id="pick" style="background:rgba(2,4,10,.25);align-items:end;padding-bottom:calc(env(safe-area-inset-bottom,0px) + 18px)">
      <div class="card" style="width:min(1060px,100%);gap:12px">
        <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap"><h2>어느 성운에서 태어날까요?</h2><span style="font-size:13px;color:var(--dim)">별은 저온·고밀도의 암흑 성운에서 태어나요</span></div>
        <div id="nebs" style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px"></div>
        <div class="row"><button class="btn primary" id="born">여기서 태어나기 ▶</button></div>
      </div>
    </div>`;
    const snd = $('#snd'); const paintSnd = () => snd.style.opacity = SFX.muted() ? .45 : 1; paintSnd(); snd.onclick = () => { SFX.toggle(); paintSnd(); };
    $('#back').onclick = () => opts.onHome();
    $('#gauge').style.visibility = 'hidden'; $('#hud').style.visibility = 'hidden';
    const nebs = $('#nebs');
    nebs.innerHTML = NEBULAE.map((n, i) => `<button class="pc" data-i="${i}" style="padding:14px;gap:6px;cursor:pointer">
      <div style="height:54px;border-radius:12px;background:radial-gradient(120% 90% at 30% 60%, rgb(${n.pal[1].map(v => v * 255 | 0)}) 0%, rgb(${n.pal[0].map(v => v * 255 | 0)}) 70%), #05070f;position:relative;overflow:hidden"><span style="position:absolute;right:10px;bottom:8px;width:10px;height:10px;border-radius:50%;background:rgb(${n.pal[2].map(v => v * 255 | 0)});box-shadow:0 0 14px rgb(${n.pal[2].map(v => v * 255 | 0)})"></span></div>
      <div class="pc-k">${n.tag}</div><h3 style="font-size:24px">${n.name}</h3><div style="font-size:12px;color:var(--dim)">${n.where}</div><p style="font-size:13px">${n.desc}</p></button>`).join('');
    const pickNeb = i => { setNebula(NEBULAE[i]); nebs.querySelectorAll('.pc').forEach((b, j) => b.style.borderColor = j === i ? 'var(--sun)' : ''); G.nebI = i; };

    /* ---------- 게임 상태 ---------- */
    const G = { me: null, rivals: [], t: 0, years: 0, over: false, busy: true, keys: {}, joy: null, idle: 0, warp: 1, nebI: 0, started: false };
    function newGame() {
      blobs.forEach(b => scene.remove(b.sp)); blobs.length = 0;
      [G.me, ...G.rivals].forEach(p => { if (p) { scene.remove(p.g); p.reach && scene.remove(p.reach); } });
      const N = NEB;
      for (let i = 0; i < N.small; i++) { const r = Math.sqrt(Math.random()) * WORLD * 0.95, a = Math.random() * 6.283; addBlob(0.02 * Math.pow(N.sMax, Math.random()), r * Math.cos(a), r * Math.sin(a)); /* 0.02 ~ 0.02×sMax M☉, 로그 균등 */ }
      for (let i = 0; i < N.big; i++) { const r = 30 + Math.random() * 70, a = Math.random() * 6.283; addBlob(S.lerp(N.bigM[0], N.bigM[1], Math.random()), r * Math.cos(a), r * Math.sin(a)); }
      G.me = makeProto(0.05, 0, 0, true); G.me.R = 10;
      G.rivals = Array.from({ length: N.rivals }, (_, i) => { const a = i / N.rivals * 6.283 + .4, r = 45 + Math.random() * 40; const p = makeProto(S.lerp(N.rivalM[0], N.rivalM[1], Math.random()), r * Math.cos(a), r * Math.sin(a), false); p.R = 12 + Math.random() * 10; return p; });
      G.t = 0; G.years = 0; G.over = false; G.preDone = false;
    }
    pickNeb(0); newGame();
    nebs.querySelectorAll('.pc').forEach(b => b.onclick = () => { pickNeb(+b.dataset.i); newGame(); SFX('tick'); });
    $('#born').onclick = async () => {
      $('#pick').remove(); $('#gauge').style.visibility = ''; $('#hud').style.visibility = '';
      G.started = true;
      await slow('proto');
      K.banner(NEB.name, '끌어서 움직이고 가스를 먹어요 · 가만히 있으면 시간이 빨리 흘러요', 3200);
      G.busy = false;
    };

    /* ---------- 조작 ---------- */
    const joy = $('#joy'), knob = $('#knob'), dom = renderer.domElement;
    dom.addEventListener('pointerdown', e => { if (!G.started) return; G.joy = { x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, id: e.pointerId }; joy.hidden = false; joy.style.left = e.clientX + 'px'; joy.style.top = e.clientY + 'px'; dom.setPointerCapture(e.pointerId); });
    dom.addEventListener('pointermove', e => { if (!G.joy || e.pointerId !== G.joy.id) return; let dx = e.clientX - G.joy.x0, dy = e.clientY - G.joy.y0; const d = Math.hypot(dx, dy), m = 50; if (d > m) { dx *= m / d; dy *= m / d; } G.joy.dx = dx / m; G.joy.dy = dy / m; knob.style.transform = `translate(${dx}px,${dy}px)`; });
    const jend = () => { G.joy = null; joy.hidden = true; knob.style.transform = ''; };
    dom.addEventListener('pointerup', jend); dom.addEventListener('pointercancel', jend);
    const kd = e => { G.keys[e.key.toLowerCase()] = true; }, ku = e => { G.keys[e.key.toLowerCase()] = false; };
    addEventListener('keydown', kd); addEventListener('keyup', ku);

    /* ---------- 힘 미니맵 (전주계열성부터) ---------- */
    const minic = $('#minic');
    function drawMini(me, t) {
      const dpr = Math.min(2, devicePixelRatio || 1), w = 220, h = 150;
      if (minic.width !== w * dpr) { minic.width = w * dpr; minic.height = h * dpr; }
      const x = minic.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
      const cx = 75, cy = h / 2, Tc = 1.5e7 * me.M / me.R, T = surfaceT(me);
      const rr = S.clamp(28 + 10 * Math.log10(me.R), 22, 56);
      const [r, gg, b] = S.bbRGB(Math.max(1000, T));
      const gr = x.createRadialGradient(cx, cy, 0, cx, cy, rr * 1.6); gr.addColorStop(0, `rgba(${r * 255 | 0},${gg * 255 | 0},${b * 255 | 0},.5)`); gr.addColorStop(1, 'rgba(0,0,0,0)');
      x.fillStyle = gr; x.beginPath(); x.arc(cx, cy, rr * 1.6, 0, 7); x.fill();
      x.fillStyle = `rgb(${r * 255 | 0},${gg * 255 | 0},${b * 255 | 0})`; x.beginPath(); x.arc(cx, cy, rr, 0, 7); x.fill();
      const coreHot = S.clamp(Math.log10(Tc / 1e6), 0, 1);
      x.fillStyle = `rgba(255,${200 + 55 * coreHot | 0},${120 + 120 * coreHot | 0},.95)`; x.beginPath(); x.arc(cx, cy, rr * 0.3, 0, 7); x.fill();
      // 화살표: 중력(안쪽, 빨강) · 압력 경도력(바깥, 하늘색). 압력은 중심 온도가 1000만 K에 가까울수록 중력과 같아짐
      const ratio = me.lit ? 1 : S.clamp(0.35 + 0.65 * Math.log10(Tc / 1e5) / 2, 0.3, 0.97);
      const arrow = (ang, from, to, col, wdt) => {
        const ax = cx + Math.cos(ang) * from, ay = cy + Math.sin(ang) * from, bx = cx + Math.cos(ang) * to, by = cy + Math.sin(ang) * to;
        x.strokeStyle = col; x.fillStyle = col; x.lineWidth = wdt; x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.stroke();
        const hd = Math.atan2(by - ay, bx - ax); x.beginPath(); x.moveTo(bx, by); x.lineTo(bx - 8 * Math.cos(hd - .5), by - 8 * Math.sin(hd - .5)); x.lineTo(bx - 8 * Math.cos(hd + .5), by - 8 * Math.sin(hd + .5)); x.fill();
      };
      const L = 30;
      for (let k = 0; k < 6; k++) {
        const a = k / 6 * Math.PI * 2 + t * 0.15;
        arrow(a, rr + L, rr + 2, '#ff6b7d', 3);
        arrow(a + 0.26, rr - 4, rr - 4 + L * ratio, '#8fe0ff', 3);
      }
      x.font = '600 11px "IBM Plex Sans KR"'; x.textAlign = 'left';
      x.fillStyle = '#ff9aa6'; x.fillText('중력', 156, 50); x.fillRect(150, 46, 4, 4);
      x.fillStyle = '#a6e4ff'; x.fillText('압력 경도력', 156, 70); x.fillRect(150, 66, 4, 4);
      x.fillStyle = '#e9eefc'; x.font = '700 12px "JetBrains Mono", monospace'; x.fillText('압력/중력', 150, 98); x.fillText((ratio * 100).toFixed(0) + '%', 150, 114);
      $('#mini-s').textContent = me.lit ? '중력 = 압력 경도력 · 정역학적 평형' : ratio < 0.95 ? '중력 > 압력 경도력 → 계속 수축, 중력 퍼텐셜 에너지 → 열 + 빛' : '거의 평형 · 곧 핵융합!';
    }

    /* ---------- 사건 ---------- */
    // 천천히 보기: 시뮬을 멈추고 장면 재생
    async function slow(id, P) { G.busy = true; G.joy = null; joy.hidden = true; G.keys = {}; W3.pause(true); await SCENES.play(id, P); W3.pause(false); G.busy = false; }
    async function onPreMain() {
      G.preDone = true; SFX('phase');
      await slow('premain');
      $('#mini').hidden = false;
      K.banner('전주계열성!', '표면 온도 약 1000 K → 가시광선을 내기 시작 · 왼쪽 위에 지금 힘', 2600);
    }
    async function onIgnite(p) {
      p.lit = true; G.over = true; SFX('ignite');
      for (const b of blobs) { const dx = b.x - p.x, dz = b.z - p.z, d = Math.hypot(dx, dz) + 1e-6; if (d < 40) { b.vx += dx / d * 30; b.vz += dz / d * 30; } }
      K.banner('수소 핵융합 점화!', `중심 온도 1000만 K · ${fmtM(p.M)}`, 1800);
      await new Promise(r => setTimeout(r, 1500));
      await slow('ignite', { M: p.M });
      opts.onDone({ M: +p.M.toPrecision(3), neb: NEB, years: G.years });
    }
    function brown(M) {
      G.over = true;
      const c = K.el('div', 'center', `<div class="card"><div class="quiz-eyebrow">모은 질량</div><h2 class="num" style="font-family:var(--f-num)">${fmtM(M)}</h2>
        <p>0.08 M☉에 못 미쳐서 중심 온도가 1000만 K에 닿지 못했어요. 수소 핵융합을 못 하는 <b>갈색 왜성</b>이 되어 천천히 식어요. 별이 되려면 더 모아야 해요!</p>
        <div class="row"><button class="btn primary" id="again">다시 태어나기</button></div></div>`);
      document.body.appendChild(c); $('#again', c).onclick = () => { c.remove(); opts.onRetry(); };
    }

    /* ---------- 물리 한 단계 ---------- */
    function stepProto(p, dt, canEat) {
      const R0 = p.R;
      if (!p.lit) p.R = Math.max(minR(p.M), p.R - p.R / p.tau * dt);
      p.dU = Math.max(0, p.M * p.M * (1 / p.R - 1 / R0)) / Math.max(dt, 1e-4);
      if (canEat && !p.lit) {
        const reach = reachR(p), cr = coreR(p);
        for (const b of blobs) {
          if (!b.alive) continue;
          const dx = p.x - b.x, dz = p.z - b.z, d2 = dx * dx + dz * dz;
          if (d2 > reach * reach) continue;
          const d = Math.sqrt(d2) + 1e-6, a = 50 * p.M / (d2 + 6) + 1.5;
          b.vx += dx / d * a * dt; b.vz += dz / d * a * dt;
          if (d < cr * 1.6 + 1.2 + Math.cbrt(b.m)) {
            b.alive = false; scene.remove(b.sp);
            const m = b.m, M0 = p.M; p.M += m;
            p.R = Math.min(40 * Math.sqrt(p.M) + 8, p.R * Math.pow(1 + m / M0, 0.9)); // 강착으로 부풂(상한 있음)
            if (p.isPlayer) SFX('eat');
          }
        }
      }
      return 1.5e7 * p.M / p.R;
    }
    function drawProto(p, t, dt) {
      const T = surfaceT(p), visible = T >= 1000, cr = coreR(p);
      p.g.position.set(p.x, 0, p.z);
      p.core.scale.setScalar(cr);
      p.cocoon.scale.setScalar(cr * 2.2); p.cocoon.material.opacity = p.lit ? 0 : S.clamp(0.28 - (T - 600) / 4000, 0.04, 0.28);
      K.setTemp(p.mat, Math.max(1000, Math.min(T, 40000)), visible ? 1.15 : 0.35);
      p.mat.uniforms.uTime.value = t;
      const [r, g2, b] = S.bbRGB(Math.max(1000, T)); p.gl.material.color.setRGB(r, g2, b);
      p.gl.scale.setScalar(cr * (p.lit ? 12 : visible ? 6 : 3.2)); p.gl.material.opacity = p.lit ? 1 : visible ? 0.7 : 0.35;
      const a = p.disk.geometry.attributes.position.array, ds = cr * 1.6 + 0.6;
      p.dB.forEach((d, i) => { d[1] += dt * 2.2 / d[0]; a[i * 3] = Math.cos(d[1]) * d[0] * ds; a[i * 3 + 1] = d[2] * ds; a[i * 3 + 2] = Math.sin(d[1]) * d[0] * ds; });
      p.disk.geometry.attributes.position.needsUpdate = true; p.disk.material.opacity = p.lit ? 0.2 : 0.85;
      if (p.reach) { p.reach.scale.setScalar(reachR(p)); p.reach.position.set(p.x, -0.3, p.z); p.reach.material.opacity = p.lit ? 0 : 0.3; }
    }

    /* ---------- 매 프레임 ---------- */
    let lastUI = 0;
    const camPos = new THREE.Vector3(0, 40, 34), tmp = new THREE.Vector3();
    W3.onFrame((dt0, t) => {
      floorU.uTime.value = t;
      const me = G.me; if (!me) return;
      // 입력
      let ix = 0, iz = 0;
      if (G.joy) { ix = G.joy.dx; iz = G.joy.dy; }
      if (G.keys['arrowleft'] || G.keys['a']) ix -= 1; if (G.keys['arrowright'] || G.keys['d']) ix += 1;
      if (G.keys['arrowup'] || G.keys['w']) iz -= 1; if (G.keys['arrowdown'] || G.keys['s']) iz += 1;
      const il = Math.hypot(ix, iz); if (il > 1) { ix /= il; iz /= il; }
      // 가만히 있으면 시간이 빨리 흐름 (최대 6배)
      const still = !G.joy && il < 0.05 && G.started && !G.over;
      G.idle = still ? G.idle + dt0 : 0;
      const wantWarp = G.idle > 0.4 ? Math.min(6, 1 + (G.idle - 0.4) * 6) : 1;
      G.warp += (wantWarp - G.warp) * Math.min(1, dt0 * 6);
      const dt = dt0 * G.warp;
      const run = !G.busy;
      if (run) {
        if (!G.over) { G.t += dt; G.years += dt * 2500; } // 게임 1초 ≈ 2,500년 (원시별 단계 약 10만 년을 수십 초로)
        const left = NEB.limit - G.t;
        const vmax = 24 / (1 + 0.35 * Math.sqrt(me.M));
        if (!me.lit) { me.vx += (ix * vmax - me.vx) * Math.min(1, dt0 * 4); me.vz += (iz * vmax - me.vz) * Math.min(1, dt0 * 4); }
        else { me.vx *= 0.95; me.vz *= 0.95; }
        me.x += me.vx * dt0; me.z += me.vz * dt0;
        const dd = Math.hypot(me.x, me.z); if (dd > WORLD) { me.x *= WORLD / dd; me.z *= WORLD / dd; }
        const Tc = stepProto(me, dt, left > 0 && !G.over);
        if (!G.preDone && surfaceT(me) >= 1000) onPreMain();
        if (!G.over && Tc >= 1e7) onIgnite(me);
        if (!G.over && left <= 0) {
          if (me.M < 0.08) { G.over = true; K.banner('성운이 흩어졌어요', '모은 질량으로는 핵융합에 이르지 못해요', 2600); setTimeout(() => brown(me.M), 2000); }
          else me.tau = 1.5;
        }
        for (const r of G.rivals) {
          if (!r.lit) {
            let best = null, bd = 1e9; for (const b of blobs) { if (!b.alive) continue; const d = (b.x - r.x) ** 2 + (b.z - r.z) ** 2; if (d < bd) { bd = d; best = b; } }
            const v = 13 / (1 + 0.35 * Math.sqrt(r.M));
            if (best) { const dx = best.x - r.x, dz = best.z - r.z, d = Math.hypot(dx, dz) + 1e-6; r.vx += (dx / d * v - r.vx) * dt * 2; r.vz += (dz / d * v - r.vz) * dt * 2; }
            r.x += r.vx * dt; r.z += r.vz * dt;
          }
          const tc = stepProto(r, dt, left > 0);
          if (!r.lit && tc >= 1e7) { r.lit = true; if (Math.hypot(r.x - me.x, r.z - me.z) < 70) K.toast(`근처 원시별이 ${fmtM(r.M)}로 점화! 복사가 주변 가스를 밀어내요`); }
          if (r.lit) for (const b of blobs) { if (!b.alive) continue; const dx = b.x - r.x, dz = b.z - r.z, d2 = dx * dx + dz * dz; if (d2 < 400) { const d = Math.sqrt(d2) + 1e-6; b.vx += dx / d * 20 * dt; b.vz += dz / d * 20 * dt; b.m *= 1 - 0.15 * dt; scaleBlob(b); if (b.m < 0.01) { b.alive = false; scene.remove(b.sp); } } }
        }
        for (const b of blobs) {
          if (!b.alive) continue; b.x += b.vx * dt; b.z += b.vz * dt; b.vx *= 1 - dt * 0.8; b.vz *= 1 - dt * 0.8; b.sp.position.set(b.x, 0, b.z);
          const ev = NEB.evap + (left < 25 && left > 0 ? 0.03 : 0);
          if (ev) { b.m *= 1 - ev * dt; scaleBlob(b); if (b.m < 0.01) { b.alive = false; scene.remove(b.sp); } }
        }
        for (let i = blobs.length - 1; i >= 0; i--) if (!blobs[i].alive) blobs.splice(i, 1);
        floorU.uFade.value = S.clamp(left / 40, 0.25, 1);
      }
      drawProto(me, t, dt); G.rivals.forEach(r => drawProto(r, t, dt));
      const h = G.started ? 24 + reachR(me) * 1.3 : 70;
      camPos.lerp(tmp.set(me.x, h, me.z + h * 0.82), 1 - Math.exp(-dt0 * 3));
      camera.position.copy(camPos); camera.lookAt(me.x, 0, me.z);

      // 화면 밖 무거운 가스 방향
      const ind = $('#ind'); const { w: sw, h: sh } = W3.size(); let html = '';
      if (G.started && !G.over) for (const b of blobs) {
        if (!b.alive || b.m < 1) continue;
        const v = tmp.set(b.x, 0, b.z).project(camera);
        if (Math.abs(v.x) < 0.95 && Math.abs(v.y) < 0.95 && v.z < 1) continue;
        const a = Math.atan2(b.z - me.z, b.x - me.x);
        const cx = sw / 2 + Math.cos(a) * (sw / 2 - 34), cy = sh / 2 + Math.sin(a) * (sh / 2 - 34);
        html += `<div style="position:fixed;z-index:15;left:${S.clamp(cx, 24, sw - 24)}px;top:${S.clamp(cy, 190, sh - 24)}px;transform:translate(-50%,-50%) rotate(${a}rad);color:#ffe0b0;font-size:22px;pointer-events:none;text-shadow:0 0 10px #ff7a3a">➤</div>`;
      }
      ind.innerHTML = html;

      if (t - lastUI > 0.1) {
        lastUI = t;
        const Tc = 1.5e7 * me.M / me.R, T = surfaceT(me);
        $('#ht').textContent = fmtM(me.M);
        $('#hk').textContent = (me.lit ? '주계열성' : T >= 1000 ? '전주계열성' : '원시별') + ' · ' + NEB.name;
        $('#hs').textContent = me.M < 0.08 ? '0.08 M☉보다 가벼우면 핵융합을 못 해요' : '이대로면 마지막엔 ' + S.FATE_NAME[S.fate(me.M)];
        $('#tcv').textContent = S.tempK(Tc);
        $('#tcbar').style.width = S.clamp((Math.log10(Tc) - 5) / 2, 0, 1) * 100 + '%';
        $('#rv').textContent = S.sci(me.R) + ' R☉';
        $('#tv').textContent = S.tempK(T) + (T >= 1000 ? '' : ' 적외선');
        $('#yv').textContent = S.years(G.years);
        const left = Math.max(0, NEB.limit - G.t); $('#cv').textContent = Math.floor(left / 60) + ':' + String(Math.floor(left % 60)).padStart(2, '0');
        const wp = $('#warp');
        wp.innerHTML = G.warp > 1.5 ? `<b style="color:var(--sun)">⏩ 시간 ×${G.warp.toFixed(1)}</b> 가만히 있는 중 · 빨리 수축해요` : '움직이는 동안은 보통 속도 · 가만히 있으면 시간이 빨라져요';
        if (G.preDone) drawMini(me, t);
      }
    });

    return { stop() { removeEventListener('keydown', kd); removeEventListener('keyup', ku); W3.stop(); uiEl.innerHTML = ''; } };
  }

  g.COLLECT = { start, NEBULAE };
})(window);
