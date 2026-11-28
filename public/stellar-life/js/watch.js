/* 2·3단계 · 주계열 이후 지켜보기
   왼쪽: 잘라 본 3D 별 + 지금 작용하는 힘 / 오른쪽 위: H-R도 / 오른쪽 아래: 지금 일어나는 핵융합
   중심핵(또는 타는 껍질)을 누르면 그 반응을 애니메이션으로 보여 줌.
   초거성의 탄소~규소 연소 단계는 반응 그림 없이 힘만 보여 줌. */
(function (g) {
  'use strict';
  const S = STAR, K = CORE, $ = K.$;

  function start(stageEl, uiEl, opts) {
    const M = opts.M;
    const W3 = K.setup(stageEl, { fov: 42 });
    const { scene, camera, renderer } = W3;
    scene.add(camera);
    K.starfield(scene, 2600, 1800);

    uiEl.innerHTML = `
    <div class="ui top">
      <div class="top-l" style="flex-direction:column;align-items:flex-start">
        <div style="display:flex;gap:10px;align-items:flex-start">
          <button class="btn back" id="back" aria-label="처음으로">←</button>
          <div class="glass hud" style="max-width:min(420px,calc(100vw - 140px))">
            <div class="hud-k" id="hk"></div><div class="hud-t" id="ht"></div><div class="hud-s" id="hs"></div>
            <div class="stats" id="stats" style="padding:8px 0 0;max-width:none"></div>
          </div>
        </div>
      </div>
      <button class="btn back" id="snd" aria-label="소리 켜기/끄기">♪</button>
    </div>
    <div class="glass" id="rx" hidden>
      <div class="rx-h"><div><div class="hud-k" id="rx-k"></div><div class="rx-t" id="rx-t"></div></div></div>
      <div id="rx-list"></div>
    </div>
    <div class="ui bottom" id="ctl" style="justify-content:flex-start">
      <div class="glass bar">
        <button class="btn" id="pp" aria-label="일시정지">⏸</button>
        <button class="btn" id="ff">다음 단계 ⏭</button>
        <div class="num" id="spd" style="font-size:13px;color:var(--dim);padding:0 10px;min-width:150px"></div>
      </div>
    </div>`;
    const css = K.el('style', null, `
      #rx{position:fixed;z-index:22;right:max(12px,env(safe-area-inset-right,0px));bottom:calc(env(safe-area-inset-bottom,0px) + 14px);width:min(410px,36vw);padding:12px 14px;display:flex;flex-direction:column;gap:8px}
      .rx-h{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
      .rx-t{font-family:var(--f-display);font-size:22px;line-height:1.1}
      .rx-row{display:flex;gap:10px;align-items:center;width:100%;text-align:left;border:1px solid var(--line);background:rgba(255,255,255,.03);border-radius:12px;padding:9px 11px;cursor:pointer;margin-top:6px}
      .rx-row:hover{border-color:rgba(255,180,90,.5)}
      .rx-row i{width:12px;height:12px;border-radius:50%;flex:none}
      .rx-row b{font-size:14px} .rx-row span{font-size:12px;color:var(--dim)} .rx-row em{margin-left:auto;font-style:normal;font-size:12px;color:var(--sun);white-space:nowrap}
      #rx-hint{font-size:12px;color:var(--dim);margin-top:6px}
      @media (max-aspect-ratio:1/1){#rx{width:auto;left:max(12px,env(safe-area-inset-left,0px));bottom:calc(env(safe-area-inset-bottom,0px) + 86px)}}`);
    uiEl.appendChild(css);
    $('#back').onclick = () => opts.onHome();
    const snd = $('#snd'); const paintSnd = () => snd.style.opacity = SFX.muted() ? .45 : 1; paintSnd(); snd.onclick = () => { SFX.toggle(); paintSnd(); };

    /* ---------- 3D 별 ---------- */
    const orbit = K.orbit(camera, renderer.domElement, { dist: 14, theta: 0.75, phi: 1.15, min: 1.2, max: 90, auto: 0.05 });
    const starG = new THREE.Group(); scene.add(starG);
    const surfMat = K.starMaterial();
    const surf = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), surfMat); starG.add(surf);
    const glow = K.glow(6, 0.8); starG.add(glow);
    const clipPlanes = [new THREE.Plane(new THREE.Vector3(-1, 0, 0), 0), new THREE.Plane(new THREE.Vector3(0, 0, -1), 0)];
    surfMat.clipIntersection = true;
    const MAXL = 8, Y_AXIS = new THREE.Vector3(0, 1, 0);
    const sliceMat = new THREE.ShaderMaterial({
      uniforms: { uR: { value: new Array(MAXL).fill(1) }, uC: { value: Array.from({ length: MAXL }, () => new THREE.Color()) }, uB: { value: new Array(MAXL).fill(0) }, uN: { value: 1 }, uTime: { value: 0 }, uSel: { value: -1 } },
      vertexShader: `varying vec3 vP; void main(){ vP=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform float uR[${MAXL}]; uniform vec3 uC[${MAXL}]; uniform float uB[${MAXL}]; uniform int uN; uniform float uTime; uniform float uSel; varying vec3 vP;
        ${K.NOISE}
        void main(){ float r=length(vP); if(r>1.) discard;
          vec3 col=vec3(0.); float burn=0.; float edge=1.; float prev=0.; float sel=0.;
          for(int i=0;i<${MAXL};i++){ if(i>=uN) break; if(r<=uR[i] || i==uN-1){ col=uC[i]; burn=uB[i]; sel=float(i)==uSel?1.:0.;
              float d=min(r-prev,uR[i]-r); edge=smoothstep(0.,.012,d); break; } prev=uR[i]; }
          float n=fbm(vec3(vP.xy*9.,uTime*.6)+vP.z*9.);
          col*= .78+.3*n; col=mix(col, col*1.9+vec3(.25,.12,0.), burn*(.45+.35*sin(uTime*5.+r*40.)));
          col+=sel*vec3(.25,.22,.12)*(.6+.4*sin(uTime*6.));
          col*=mix(.55,1.,edge); col*=.9+.2*(1.-r); gl_FragColor=vec4(col,1.); }`,
      side: THREE.DoubleSide
    });
    const faceA = new THREE.Mesh(new THREE.CircleGeometry(1, 96, -Math.PI / 2, Math.PI), sliceMat); faceA.rotation.y = -Math.PI / 2;
    const faceB = new THREE.Mesh(new THREE.CircleGeometry(1, 96, -Math.PI / 2, Math.PI), sliceMat);
    const slice = new THREE.Group(); slice.add(faceA, faceB); starG.add(slice);

    // 힘 화살표 (단면 위): 길이 = 힘의 크기
    const arrows = new THREE.Group(); slice.add(arrows);
    function mkArrow(col) {
      const m = new THREE.MeshBasicMaterial({ color: col, depthTest: false, transparent: true });
      const a = new THREE.Group();
      const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1, 10), m); shaft.rotation.z = -Math.PI / 2;
      const head = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.13, 16), m); head.rotation.z = -Math.PI / 2;
      a.add(shaft, head); a.renderOrder = shaft.renderOrder = head.renderOrder = 9; a.userData = { shaft, head };
      arrows.add(a); return a;
    }
    const aG1 = mkArrow(0xff6b7d), aP1 = mkArrow(0x8fe0ff), aG2 = mkArrow(0xff6b7d), aP2 = mkArrow(0x8fe0ff);
    const lblG = K.label('중력', { color: '#ff9aa6', h: 0.1 }), lblP = K.label('압력 경도력', { color: '#a6e4ff', h: 0.1 });
    const lblNote = K.label(' ', { color: '#e9eefc', h: 0.08 });
    arrows.add(lblG, lblP, lblNote);
    let noteText = '';
    function setNote(t) {
      if (t === noteText) return; noteText = t; arrows.remove(lblNote.userData.cur || lblNote);
      const l = K.label(t, { color: '#e9eefc', h: 0.075 }); l.position.set(0.5, -0.56, 0.01); arrows.add(l); lblNote.userData.cur = l;
    }

    function cloud(n, col, size) {
      const pos = new Float32Array(n * 3), base = [];
      for (let i = 0; i < n; i++) { const u = Math.random() * 2 - 1, th = Math.random() * 6.283, s = Math.sqrt(1 - u * u), rr = 0.85 + 0.15 * Math.random(); base.push([s * Math.cos(th), u, s * Math.sin(th), rr, Math.random()]); pos.set([rr * s * Math.cos(th), rr * u, rr * s * Math.sin(th)], i * 3); }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const p = new THREE.Points(geo, new THREE.PointsMaterial({ size, map: K.dotTexture(), color: col, transparent: true, depthWrite: false, opacity: 0.85, blending: THREE.AdditiveBlending }));
      p.userData.base = base; return p;
    }
    const shell = cloud(2600, 0x7fffd4, 0.25); shell.visible = false; scene.add(shell);
    const wind = cloud(900, 0xffb07a, 0.12); wind.visible = false; scene.add(wind); // 거성의 별바람
    // 맥동할 때마다 날아가는 가스 → 나중에 행성상 성운 (폭발 아님)
    const PN = 5000, pPos = new Float32Array(PN * 3), pCol = new Float32Array(PN * 3), pVel = new Float32Array(PN * 3), pAge = new Float32Array(PN).fill(1e9), pBase = new Float32Array(PN);
    const pGeo = new THREE.BufferGeometry(); pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3)); pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3));
    const puffs = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.2, map: K.dotTexture(), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    puffs.frustumCulled = false; scene.add(puffs); let pHead = 0;
    const PUFF_LIFE = 40, DUST = [0.95, 0.55, 0.32], ION = [0.35, 1, 0.85];
    function emit(n, R0, v0) {
      for (let i = 0; i < n; i++) {
        const k = pHead++ % PN, u = Math.random() * 2 - 1, a = Math.random() * 6.283, sq = Math.sqrt(1 - u * u), d = [sq * Math.cos(a), u, sq * Math.sin(a)], v = v0 * (0.7 + 0.6 * Math.random());
        for (let j = 0; j < 3; j++) { pPos[k * 3 + j] = d[j] * R0; pVel[k * 3 + j] = d[j] * v; }
        pAge[k] = 0; pBase[k] = 0.45 + 0.55 * Math.random();
      }
    }
    function stepPuffs(dts, ion) {
      const c = [0, 1, 2].map(j => S.lerp(DUST[j], ION[j], ion));
      for (let k = 0; k < PN; k++) {
        if (pAge[k] > PUFF_LIFE) { if (pAge[k] < 1e9) { pCol[k * 3] = pCol[k * 3 + 1] = pCol[k * 3 + 2] = 0; pAge[k] = 1e9; } continue; }
        pAge[k] += dts; for (let j = 0; j < 3; j++) pPos[k * 3 + j] += pVel[k * 3 + j] * dts;
        const f = Math.max(0, 1 - pAge[k] / PUFF_LIFE) * pBase[k];
        for (let j = 0; j < 3; j++) pCol[k * 3 + j] = c[j] * f;
      }
      pGeo.attributes.position.needsUpdate = true; pGeo.attributes.color.needsUpdate = true;
    }
    const remnant = new THREE.Group(); scene.add(remnant);
    const bhCore = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    const bhDisk = new THREE.Mesh(new THREE.RingGeometry(1.6, 4.2, 128, 1), new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } }, transparent: true, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending,
      vertexShader: `varying vec2 vU; void main(){ vU=position.xy; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `uniform float uTime; varying vec2 vU; ${K.NOISE} void main(){ float r=length(vU); float a=atan(vU.y,vU.x);
        float n=fbm(vec3(r*3.,a*3.-uTime*1.5/r,uTime*.2)); float k=smoothstep(4.2,1.6,r)*smoothstep(1.55,1.9,r);
        vec3 c=mix(vec3(1.,.45,.15),vec3(1.,.9,.7),smoothstep(3.5,1.7,r)); gl_FragColor=vec4(c*(.4+n),k*(.5+.6*n)); }`
    }));
    bhDisk.rotation.x = -Math.PI / 2 + 0.25;
    const beams = new THREE.Group();
    [1, -1].forEach(sgn => { const c = new THREE.Mesh(new THREE.ConeGeometry(0.6, 9, 24, 1, true), new THREE.MeshBasicMaterial({ color: 0x9fd0ff, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide })); c.position.y = sgn * 4.5; c.rotation.x = sgn > 0 ? Math.PI : 0; beams.add(c); });
    beams.rotation.z = 0.5;

    // H-R도: 카메라에 붙인 판 (가로 화면은 오른쪽 위)
    const hr = new K.HR(1024, 768); hr.drawBase(); hr.commit();
    const hrMesh = K.hrPanel(hr, 4); camera.add(hrMesh);
    function layout() {
      const { w, h } = W3.size(); const d = 12;
      const vh = 2 * d * Math.tan(camera.fov * Math.PI / 360), vw = vh * w / h;
      camera.clearViewOffset();
      if (w >= h * 1.05) {
        const s = 0.21; camera.setViewOffset(w, h, w * s, 0, w, h);
        const pw = Math.min(vw * 0.36, vh * 0.5 * 1024 / 768), ph = pw * 768 / 1024;
        hrMesh.scale.setScalar(pw / 4);
        hrMesh.position.set((0.5 + s) * vw - pw / 2 - vw * 0.035, vh / 2 - ph / 2 - vh * 0.09, -d);
        hrMesh.rotation.set(0, -0.14, 0);
      } else {
        const s = w < 600 ? 0.1 : 0.17; camera.setViewOffset(w, h, 0, h * s, w, h);
        const pw = vw * 0.92, ph = pw * 768 / 1024; hrMesh.scale.setScalar(pw / 4);
        hrMesh.position.set(0, -(0.5 + s) * vh + ph / 2 + vh * (w < 600 ? 0.13 : 0.11), -d);
        hrMesh.rotation.set(-0.12, 0, 0);
      }
    }
    W3.onFrame(() => { }).resize = layout; layout();

    /* ---------- 상태 ---------- */
    const track = S.lifeTrack(M);
    const msPh = track.phases.find(p => p.key === 'ms');
    const G = { age: msPh.t0 + 1, play: false, busy: false, asked: new Set(['nebula', 'proto', 'energy', 'pre1000', 'ms1e7']), score: 0, total: 0, lastPhase: -1, sel: -1, selKind: null, lastOnion: null, tapped: false, samples: [] };
    for (const p of track.phases) { if (p.key === 'bh') continue; for (let i = 0; i <= 40; i++) { const st = S.state(track, p.t0 + p.dur * i / 40 * 0.999); G.samples.push([st.age, st.T, st.L, p.key]); } }
    const visR = R => S.clamp(0.15 + 1.45 * Math.pow(R, 0.28), 0.12, 9.5);
    const PHASE_SEC = { ms: 18, rgb: 10, giant: 10, agb: 14, pn: 9, wd: 10, rsg: 18, sn: 5, ns: 9, bh: 9 };
    const SCENE_OF = { rgb: 'rgb', giant: 'giant', agb: 'agb', rsg: 'onion', sn: 'sn' };
    // 초거성: 헬륨 연소가 기간의 99.9%라도 화면에서는 탄소~규소 단계를 천천히 보여 줌 (화면 시간 비율 45:15:12:13:15)
    const RSG_SEG = S.ONION.map((o, i) => [o.at, o.end, [0.45, 0.15, 0.12, 0.13, 0.15][i]]);
    const rateOf = (p, u) => { if (p.key !== 'rsg') return 1; const s = RSG_SEG.find(x => u < x[1]) || RSG_SEG[4]; return (s[1] - s[0]) / s[2]; };
    const magnifyOf = key => !['ms', 'wd', 'ns', 'pn'].includes(key);
    const dispR = (L, i, n, mag) => i >= n - 1 ? 1 : (mag ? Math.sqrt(L.r) : L.r);

    /* ---------- 반응 판 ---------- */
    // 어떤 반응을 그릴지: 수소 → p-p 또는 CNO(중심 온도가 약 1700만 K 넘으면 CNO 우세), 헬륨 → 헬륨 핵융합. 탄소~철은 그리지 않음
    function reactOf(layer, st) {
      if (!layer || !layer.burn) return null;
      if ((st.onion && st.onion.stage.core !== 'He')) return null;
      if (layer.burn === 'H→He') { const hot = (layer.core || st.phase.key === 'ms') ? st.Tc >= 1.7e7 : M >= 1.3; return hot ? 'cno' : 'pp'; }
      if (layer.burn === 'He→C') return 'triple';
      return null;
    }
    const WHERE = (L, i) => i === 0 || L.core ? '중심핵' : '껍질';
    let rxKey = '';
    function rxItems(st) { return st.layers.map((L, i) => ({ L, i, kind: reactOf(L, st) })).filter(o => o.kind); }
    function paintRx(st) {
      const rx = $('#rx'); const p = st.phase, items = rxItems(st);
      rx.hidden = !items.length; if (!items.length) return;
      const key = p.key + items.map(o => o.i + o.kind).join();
      if (key === rxKey) return; rxKey = key;
      $('#rx-k').textContent = '지금 일어나는 핵융합'; $('#rx-t').textContent = p.energy;
      $('#rx-list').innerHTML = items.map(o => `<button class="rx-row" data-i="${o.i}"><i style="background:${o.L.c}"></i><div><b>${o.L.n}</b><br><span>${o.L.burn.replace('→', ' → ')} · ${REACT.NAME[o.kind]}</span></div><em>크게 보기 ⤢</em></button>`).join('') +
        `<div id="rx-hint">누르면 시뮬을 멈추고 크게 보여 줘요 · 왼쪽 별의 ${items.some(o => o.L.n.includes('중심')) ? '중심핵' : '타는 껍질'}을 눌러도 돼요</div>`;
      $('#rx-list').querySelectorAll('.rx-row').forEach(b => b.onclick = () => { const o = items.find(q => q.i === +b.dataset.i); if (o) openFusion(o); });
    }
    // 핵융합 크게 보기: 시뮬 멈춤
    function openFusion(o) {
      G.tapped = true; G.busy = true; W3.pause(true); SFX('tick');
      const ov = K.el('div', 'fx', `<div class="fx-top"><div class="hud-k">${o.L.n} · ${o.L.burn.replace('→', ' → ')} · 시뮬 멈춤</div><div class="scene-t">${REACT.NAME[o.kind]}</div></div>
        <canvas class="fx-c"></canvas><div class="fx-b"><button class="btn primary" id="fx-x">시뮬로 돌아가기 ▶</button></div>`);
      uiEl.appendChild(ov);
      const c = ov.querySelector('canvas'); let alive = true; const t0 = performance.now();
      (function f(now) { if (!alive) return; REACT.draw(c, o.kind, (now - t0) / 1000); requestAnimationFrame(f); })(t0);
      const close = () => { alive = false; removeEventListener('keydown', kk); ov.remove(); W3.pause(false); G.busy = false; };
      const kk = e => { if (['Escape', 'Enter', ' '].includes(e.key)) { e.preventDefault(); close(); } };
      addEventListener('keydown', kk);
      ov.querySelector('#fx-x').onclick = close; setTimeout(() => ov.querySelector('#fx-x').focus({ preventScroll: true }), 30);
    }

    // 단면을 누르면 그 층을 고름
    const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(); let down = null;
    renderer.domElement.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    renderer.domElement.addEventListener('pointerup', e => {
      if (!down) return; const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t; down = null;
      if (moved > 8 || dt > 600 || !slice.visible) return;
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.set((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1);
      ray.setFromCamera(ndc, camera);
      const hit = ray.intersectObjects([faceA, faceB], false)[0]; if (!hit) return;
      const r = hit.object.worldToLocal(hit.point.clone()).length();
      const st = S.state(track, G.age), mag = magnifyOf(st.phase.key), n = st.layers.length;
      let idx = n - 1; for (let i = 0; i < n; i++) if (r <= dispR(st.layers[i], i, n, mag)) { idx = i; break; }
      const L = st.layers[idx];
      const kind = reactOf(L, st);
      if (kind) openFusion({ L, i: idx, kind });
      else if (!((st.onion && st.onion.stage.core !== 'He'))) K.toast(`${L.n}: 여기서는 핵융합이 일어나지 않아요`);
    });

    /* ---------- 진행 ---------- */
    async function onPhase(st) {
      const p = st.phase; rxKey = '';
      if (SCENE_OF[p.key]) { G.busy = true; W3.pause(true); await SCENES.play(SCENE_OF[p.key], { M, track }); W3.pause(false); G.busy = false; }
      else SFX('phase');
      K.banner(p.name, p.text, 2800);
      if (p.key === 'ms') setTimeout(() => { if (!G.tapped) K.toast('왼쪽 별의 중심핵을 눌러 보세요 · 수소 핵융합을 크게 보여 줄게요', 4200); }, 3600);
    }
    $('#pp').onclick = () => { G.play = !G.play; $('#pp').textContent = G.play ? '⏸' : '▶'; };
    $('#ff').onclick = () => { const p = track.phases[S.state(track, G.age).idx]; G.age = Math.min(track.total - 1e-6, p.t1 + 1e-9 * p.dur); };
    const kd = e => { if (e.key === ' ' && !document.querySelector('.scene, .fx, .center')) { e.preventDefault(); $('#pp').click(); } };
    addEventListener('keydown', kd);

    function finish() {
      G.play = false; G.done = true;
      const ph = track.phases.filter(p => !p.final);
      const tot = ph.reduce((a, p) => a + p.dur, 0);
      const fin = track.phases[track.phases.length - 1];
      let maxR = 0, maxL = 0; for (const [a] of G.samples) { const st = S.state(track, a); if (!['sn', 'protostar', 'premain'].includes(st.phase.key)) { maxR = Math.max(maxR, st.R); maxL = Math.max(maxL, st.L); } }
      const COL = { protostar: '#a35a3a', premain: '#ff9a5a', ms: '#ffd38a', rgb: '#ff8a52', giant: '#ff7a3a', agb: '#e0607e', pn: '#7fffd4', rsg: '#ff6040', sn: '#fff' };
      const bars = ph.map(p => `<div title="${p.name}" style="flex:${Math.max(p.dur / tot, 0.004)};background:${COL[p.key] || '#888'};min-width:3px"></div>`).join('');
      const rows = ph.map(p => `<div style="display:flex;justify-content:space-between;gap:10px;font-size:13px"><span><i style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${COL[p.key]};margin-right:6px"></i>${p.name}</span><span class="num">${S.years(p.dur)} · ${p.dur / tot < 1e-5 ? '0.001% 미만' : (p.dur / tot * 100).toFixed(p.dur / tot < 0.01 ? 3 : 1) + '%'}</span></div>`).join('');
      const fn = track.fateName, josa = /[블중]/.test(fn[0]) ? '로' : '으로';
      const c = K.el('div', 'center', `<div class="card">
        <div class="quiz-eyebrow">${opts.neb.name}에서 태어난 ${M} M☉ 별의 일생</div>
        <h2>${fn}${josa} 남았어요</h2>
        <p>${fin.text}</p>
        <div style="display:flex;height:22px;border-radius:8px;overflow:hidden;gap:1px">${bars}</div>
        <div style="display:grid;gap:4px">${rows}</div>
        <p style="font-size:14px">주계열 단계가 일생의 ${(msPh.dur / tot * 100).toFixed(0)}%.${ph.some(p => ['rgb', 'rsg'].includes(p.key)) ? ' 거성·초거성 단계는 짧게 지나가요.' : ' 이 별은 너무 가벼워서 거성이 되지 않아요.'} 최대 반지름 <b class="num">${S.sci(maxR)} R☉</b>, 최대 광도 <b class="num">${S.sci(maxL)} L☉</b>${fin.Mw ? `, 남은 백색 왜성 <b class="num">${fin.Mw.toFixed(2)} M☉</b>` : fin.Mr ? `, 남은 천체 <b class="num">${fin.Mr.toFixed(1)} M☉</b>` : ''}.</p>
        <div class="row"><button class="btn" id="toq">문제 풀러 가기</button><button class="btn primary" id="again">다시 태어나기</button></div></div>`);
      uiEl.appendChild(c);
      $('#again', c).onclick = () => opts.onRetry(); $('#toq', c).onclick = () => opts.onQuiz();
    }

    /* ---------- 층·힘 ---------- */
    function setLayers(layers, mag) {
      const n = Math.min(MAXL, layers.length);
      sliceMat.uniforms.uN.value = n; sliceMat.uniforms.uSel.value = -1;
      for (let i = 0; i < MAXL; i++) {
        const L = layers[Math.min(i, n - 1)];
        sliceMat.uniforms.uR.value[i] = dispR(L, i, n, mag);
        sliceMat.uniforms.uC.value[i].set(L.c);
        sliceMat.uniforms.uB.value[i] = L.burn ? 1 : 0;
      }
    }
    function setArrows(st, mag) {
      const force = st.phase.force, layers = st.layers;
      const coreR = layers.length > 1 ? dispR(layers[0], 0, layers.length, mag) : 0.3;
      const place = (a, x, y, dir, len) => {
        a.visible = len > 0.01; a.position.set(x, y, 0.004); a.scale.set(dir, 1, 1);
        const { shaft, head } = a.userData; shaft.scale.y = Math.max(0.001, len - 0.1); shaft.position.x = (len - 0.1) / 2; head.position.x = len - 0.06;
      };
      aG2.visible = aP2.visible = false;
      const X = 0.6;
      let note = '';
      if (force === 'eq') { place(aG1, X + 0.34, 0.07, -1, 0.34); place(aP1, X - 0.34, -0.07, 1, 0.34); note = '중력 = 압력 경도력 · 정역학적 평형'; }
      else if (force === 'deg') { place(aG1, X + 0.34, 0.07, -1, 0.34); place(aP1, X - 0.34, -0.07, 1, 0.34); note = '핵융합 없이 압력으로 버팀'; }
      else if (force === 'in') { place(aG1, X + 0.34, 0.07, -1, 0.34); place(aP1, X - 0.1, -0.07, 1, 0.1); note = '중력 > 압력 경도력 → 붕괴'; }
      else if (force === 'out') { place(aG1, X + 0.1, 0.07, -1, 0.1); place(aP1, X - 0.32, -0.07, 1, 0.32); note = '외곽층이 흩어짐'; }
      else {
        const cx = S.clamp(coreR, 0.15, 0.4);
        place(aG1, cx + 0.26, 0.06, -1, 0.26); place(aP1, cx - 0.1, -0.06, 1, 0.1);
        aG2.visible = aP2.visible = true; place(aG2, 0.94, 0.06, -1, 0.1); place(aP2, 0.6, -0.06, 1, 0.34);
        note = '중심핵 수축(중력>압력) · 외곽층 팽창(압력>중력)';
      }
      if ((st.onion && st.onion.stage.core !== 'He')) note = '중심핵 수축과 핵융합이 번갈아 · 바깥은 팽창';
      lblG.position.set(0.74, 0.27, 0.01); lblP.position.set(0.74, -0.27, 0.01); setNote(note);
    }
    function statsHTML(st) {
      const p = st.phase;
      return [['광도', S.sci(st.L) + ' L☉'], ['반지름', p.key === 'bh' ? p.rs.toFixed(0) + ' km' : S.sci(st.R) + ' R☉'], ['표면 온도', p.key === 'bh' ? '—' : S.tempK(st.T)],
        ['중심 온도', p.key === 'bh' ? '—' : S.tempK(st.Tc)], ['나이', S.years(st.age)], ['질량', M + ' M☉']]
        .map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
    }

    /* ---------- 매 프레임 ---------- */
    let lastUI = 0;
    W3.onFrame((dt, t) => {
      surfMat.uniforms.uTime.value = t; sliceMat.uniforms.uTime.value = t; bhDisk.material.uniforms.uTime.value = t;
      const st0 = S.state(track, G.age);
      if (G.play && !G.busy && !G.done) {
        const p = st0.phase, sec = PHASE_SEC[p.key] || 8;
        G.age += p.dur / sec * dt * rateOf(p, st0.u);
        if (G.age >= track.total) { G.age = track.total - 1e-6; finish(); }
      }
      const st = S.state(track, G.age), p = st.phase;
      if (st.idx !== G.lastPhase) { G.lastPhase = st.idx; onPhase(st); }

      const vr = p.key === 'bh' ? 0.6 : visR(st.R);
      const isRem = ['wd', 'ns', 'bh'].includes(p.key);
      starG.scale.setScalar(vr);
      surf.visible = glow.visible = p.key !== 'bh';
      K.setTemp(surfMat, Math.max(st.T, 1000), S.clamp(1.3 + 0.05 * Math.log10(st.L + 1e-6), 1.1, 1.6));
      surfMat.uniforms.uGran.value = p.key === 'wd' || p.key === 'ns' ? 0.05 : (st.R > 30 ? 0.7 : 0.35);
      surfMat.uniforms.uScale.value = st.R > 30 ? 1.6 : 3; // 거성은 커다란 대류 세포
      const [r, gg, b] = S.bbRGB(Math.max(st.T, 1000)); glow.material.color.setRGB(r, gg, b);
      const lg = Math.log10(Math.max(st.L, 1e-6));
      glow.scale.setScalar(p.key === 'sn' ? 4 + 26 * Math.sin(Math.PI * st.u) : S.clamp(2.6 + 0.35 * lg, 1.6, 6));
      glow.material.opacity = S.clamp(0.45 + 0.08 * lg, 0.25, 1);
      glow.position.copy(camera.position).normalize().multiplyScalar(-1.15);

      const mag = magnifyOf(p.key);
      const showCut = p.key !== 'bh' && p.key !== 'sn' && st.layers.length > 0;
      const wa = orbit.st.theta - Math.PI / 4; slice.rotation.y = wa;
      clipPlanes[0].normal.set(-1, 0, 0).applyAxisAngle(Y_AXIS, wa); clipPlanes[1].normal.set(0, 0, -1).applyAxisAngle(Y_AXIS, wa);
      surfMat.clippingPlanes = showCut ? clipPlanes : [];
      slice.visible = showCut; arrows.visible = showCut && (!isRem || p.key === 'wd');
      if (showCut) { setLayers(st.layers, mag); setArrows(st, mag); }

      // 맥동 가스: 팽창할 때마다 한 번씩 (star.js: 광도 ×(1 + 0.25 sin), 맥동 14번)
      const dts = G.play && !G.busy ? dt : 0;
      if (p.key === 'agb') {
        G.envR = vr;
        const cyc = Math.floor((G.age - p.t0) / p.dur * 14 - 0.25);
        if (G.lastCyc === undefined) G.lastCyc = cyc;
        if (cyc > G.lastCyc) { G.lastCyc = cyc; emit(240, vr * 1.02, vr * 0.32); }
      }
      if (p.key === 'pn' && st.u < 0.6 && dts > 0) emit(Math.ceil(700 * dts), S.lerp(G.envR || vr, vr, st.u) * 1.02, (G.envR || vr) * 0.3);
      G.ion = Math.max(G.ion || 0, p.key === 'pn' ? S.smooth(st.u) : p.key === 'wd' ? 1 : 0);
      puffs.material.size = (G.envR || 1) * 0.05;
      stepPuffs(dts, G.ion);
      // 초신성 껍질 · 별바람
      const showShell = p.key === 'sn' || (['ns', 'bh'].includes(p.key) && st.u < 0.35);
      shell.visible = showShell;
      if (showShell) {
        const prog = p.key === 'pn' || p.key === 'sn' ? st.u : 1 + st.u * 3;
        const rad = (M >= 8 ? 3 : 2) + prog * (M >= 8 ? 14 : 8);
        shell.scale.setScalar(rad); shell.material.color.set(M >= 8 ? 0xffb07a : 0x6fffd8);
        shell.material.opacity = S.clamp(1.2 - (isRem ? st.u * 3 : 0), 0, 0.85); shell.material.size = rad * 0.05;
      }
      const windy = p.key === 'rsg' || p.key === 'rgb';
      wind.visible = windy;
      if (windy) {
        const a = wind.geometry.attributes.position.array, base = wind.userData.base;
        base.forEach((q, i) => { q[4] = (q[4] + dt * 0.08) % 1; const rr = 1.05 + q[4] * 1.6; a[i * 3] = q[0] * rr; a[i * 3 + 1] = q[1] * rr; a[i * 3 + 2] = q[2] * rr; });
        wind.geometry.attributes.position.needsUpdate = true; wind.scale.setScalar(vr); wind.material.color.setRGB(r, gg * .8, b * .6);
        wind.material.opacity = 0.3;
      }
      if (p.key === 'bh' && !remnant.children.length) remnant.add(bhCore, bhDisk);
      if (p.key === 'ns' && !remnant.children.length) remnant.add(beams);
      if (p.key === 'bh') { bhCore.scale.setScalar(0.6); bhDisk.scale.setScalar(0.6); }
      if (p.key === 'ns') beams.rotation.y += dt * 9;
      if (!['ns', 'bh'].includes(p.key) && remnant.children.length) remnant.clear();

      orbit.goal.dist = Math.max(5, vr * 4.6 + 3) * (showShell ? 1.9 : 1);
      if (p.key === 'pn' || (p.key === 'wd' && st.u < 0.4)) orbit.goal.dist = Math.max(orbit.goal.dist, (G.envR || vr) * 6.5);
      orbit.update(dt);

      // 반응 애니메이션

      if (t - lastUI > 0.12) {
        lastUI = t;
        $('#ht').textContent = p.name;
        $('#hk').textContent = `${opts.neb.name}에서 태어난 별 · ${p.key === 'ms' ? '주계열 ' + Math.round(st.u * 100) + '%' : '단계 ' + (st.idx + 1) + '/' + track.phases.length}`;
        $('#hs').textContent = p.onion ? p.text.split('.')[0] + ' · 지금: ' + st.onion.stage.label : p.text;
        $('#stats').innerHTML = statsHTML(st);
        $('#spd').textContent = '1초 = ' + S.years(p.dur / (PHASE_SEC[p.key] || 8) * rateOf(p, st.u));
        if (p.onion && G.lastOnion !== st.onion.stage.label) { if (G.lastOnion) { K.toast('중심핵: ' + st.onion.stage.label + ' · 중심 온도 ' + S.tempK(st.onion.stage.Tc)); SFX('tick'); } G.lastOnion = st.onion.stage.label; }
        paintRx(st);
        hr.begin();
        const past = G.samples.filter(s => s[0] <= G.age);
        const pre = past.filter(s => !['sn', 'ns', 'bh'].includes(s[3])).map(s => [s[1], s[2]]);
        const post = past.filter(s => s[3] === 'ns').map(s => [s[1], s[2]]);
        if (!['sn', 'ns', 'bh'].includes(p.key)) pre.push([st.T, st.L]); else if (p.key === 'ns') post.push([st.T, st.L]);
        hr.path(pre, 'rgba(127,214,255,.9)', 5); hr.path(post, 'rgba(159,195,255,.9)', 5);
        if (p.key !== 'bh') hr.marker(st.T, st.L, p.name);
        else { const x = hr.x; x.font = '700 28px "IBM Plex Sans KR"'; x.fillStyle = '#ffd38a'; x.textAlign = 'center'; x.fillText('블랙홀은 빛을 내지 않아 H-R도에 없음', 560, 300); }
        hr.commit();
      }
    });

    K.banner('주계열성', `${opts.neb.name}에서 모은 ${M} M☉ · 이제부터는 일생을 지켜봐요`, 3000);
    setTimeout(() => { G.play = true; }, 600);
    return { stop() { removeEventListener('keydown', kd); W3.stop(); uiEl.innerHTML = ''; } };
  }
  g.WATCH = { start };
})(window);
