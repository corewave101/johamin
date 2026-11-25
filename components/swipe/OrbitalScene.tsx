// 주민지T 오비탈 실습의 3D 그림(Three.js r128, lib/three-loader.ts). 화학 계산은 lib/orbital.ts.
// 손가락 · 마우스로 끌면 돌아가고, 두 손가락 · 휠로 확대해요. 탄소를 누르면 onPick.
import { useEffect, useRef, useState } from 'react';
import {
  add, bentAngle, cross, dot, len, orbitalsOf, ringAngle, scale, sub, unit, angleBetween,
  type Molecule, type SceneMode, type Vec,
} from '../../lib/orbital';
import { loadThree, type Three } from '../../lib/three-loader';

export interface AngleSpec { center: number; a: number; b: number }
export interface SceneProps {
  mol: Molecule;
  mode: SceneMode;
  /** σ 겹침(노랑) · π 겹침(보라) 표시. orbital 모드에서만. */
  sigma?: boolean; pi?: boolean;
  /** 고리 C–C 쪽 sp³ 오비탈을 109.5°로 벌려 굽은 겹침을 보여 줌. */
  strain?: boolean;
  angles?: AngleSpec[];
  highlight?: number;
  flagpole?: boolean;
  onPick?: (atom: number) => void;
  /** 처음 방향(라디안: x축 기울기, y축 회전). viewKey가 바뀌면 다시 그 방향으로. */
  view?: [number, number]; viewKey?: string;
  /** 방향키로 돌리기(문제 화면에서는 끔: 방향키가 보기 고르기). */
  keyboard?: boolean;
  label: string;
}

const COLOR = {
  carbon: 0x3b4252, hydrogen: 0xf3f4f6, bond: 0x9aa3b2, hybrid: 0xf59e0b, hybridBack: 0xfcd9a0,
  p: 0x8b5cf6, h1s: 0x2dd4bf, sigma: 0xfacc15, pi: 0x7c3aed, highlight: 0xff4d6d, flag: 0xe11d48, angle: 0x0f766e,
};
const HYBRID_LEN = 1.15, P_LEN = 0.95, H1S = 0.42;

export default function OrbitalScene(props: SceneProps) {
  const host = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<HTMLDivElement>(null);
  const stage = useRef<Stage | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const latest = useRef(props);
  latest.current = props;

  useEffect(() => {
    let alive = true;
    loadThree().then(T => {
      if (!alive || !host.current || !labelsRef.current) return;
      try {
        stage.current = new Stage(T, host.current, labelsRef.current, () => latest.current);
        stage.current.build(latest.current);
        stage.current.resetView(latest.current.view);
        setStatus('ready');
      } catch { setStatus('error'); }
    }).catch(() => alive && setStatus('error'));
    return () => { alive = false; stage.current?.dispose(); stage.current = null; };
  }, []);

  const { mol, mode, sigma, pi, strain, angles, highlight, flagpole } = props;
  useEffect(() => { stage.current?.build(latest.current); }, [mol, mode, sigma, pi, strain, angles, highlight, flagpole, status]);
  useEffect(() => { stage.current?.resetView(latest.current.view); }, [props.viewKey, status]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!props.keyboard) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) return;
      const step = Math.PI / 12;
      const turns: Record<string, [number, number]> = { ArrowLeft: [0, -step], ArrowRight: [0, step], ArrowUp: [-step, 0], ArrowDown: [step, 0] };
      const t = turns[event.key];
      if (!t) return;
      event.preventDefault();
      stage.current?.turn(t[0], t[1]);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [props.keyboard]);

  return <div className="orbital-scene" role="img" aria-label={props.label}>
    <div ref={host} className="orbital-canvas" />
    <div ref={labelsRef} className="orbital-labels" aria-hidden="true" />
    {status === 'loading' && <p className="orbital-status">3D 모형을 불러오는 중이에요…</p>}
    {status === 'error' && <p className="orbital-status is-error">3D 모형을 불러오지 못했어요. 인터넷에 연결된 상태에서 한 번 열면 다음부터는 인터넷 없이도 열려요.</p>}
  </div>;
}

/** Three.js 장면 하나(React 바깥에서 직접 그린다). */
class Stage {
  private T: Three; private renderer: Three; private scene: Three; private camera: Three; private model: Three;
  private labels: { el: HTMLDivElement; at: Three }[] = [];
  private distance = 8; private radius = 3; private frame = 0; private dirty = true; private spinning = true;
  private pointers = new Map<number, { x: number; y: number; sx: number; sy: number }>();
  private pinch = 0;
  private resize: ResizeObserver;
  private carbons: { atom: number; at: Three }[] = [];

  constructor(T: Three, private host: HTMLDivElement, private labelBox: HTMLDivElement, private props: () => SceneProps) {
    this.T = T;
    this.renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setClearColor(0x000000, 0);
    host.appendChild(this.renderer.domElement);
    this.scene = new T.Scene();
    this.camera = new T.PerspectiveCamera(35, 1, 0.1, 100);
    this.scene.add(new T.AmbientLight(0xffffff, 0.62));
    const sun = new T.DirectionalLight(0xffffff, 0.75);
    sun.position.set(3, 5, 6);
    this.camera.add(sun);
    this.scene.add(this.camera);
    this.model = new T.Group();
    this.scene.add(this.model);
    this.spinning = !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    this.resize = new ResizeObserver(() => this.fit());
    this.resize.observe(host);
    this.bindPointer();
    this.fit();
    const loop = () => {
      this.frame = requestAnimationFrame(loop);
      if (this.spinning && !this.pointers.size) { this.turn(0, 0.004, true); }
      if (this.dirty) this.render();
    };
    loop();
  }

  dispose() {
    cancelAnimationFrame(this.frame);
    this.resize.disconnect();
    this.clear();
    this.renderer.dispose();
    this.renderer.domElement.remove();
    this.labelBox.replaceChildren();
  }

  private fit() {
    const w = this.host.clientWidth || 300, h = this.host.clientHeight || 300;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.placeCamera();
  }
  private placeCamera() {
    const fov = this.camera.fov * Math.PI / 180;
    const fitH = this.radius / Math.sin(fov / 2), fitW = this.radius / Math.sin(Math.atan(Math.tan(fov / 2) * this.camera.aspect));
    const base = Math.max(fitH, fitW); // 어느 방향으로 돌려도 판 안에 들어오는 거리
    this.camera.position.set(0, 0, base * this.distanceScale);
    this.camera.near = 0.1; this.camera.far = base * 6;
    this.camera.updateProjectionMatrix();
    this.dirty = true;
  }
  private distanceScale = 1;

  resetView(view?: [number, number]) {
    const T = this.T;
    this.model.quaternion.copy(new T.Quaternion());
    this.distanceScale = 1;
    if (view) { this.turn(view[0], 0, true); this.turn(0, view[1], true); }
    this.placeCamera();
  }
  /** 화면 기준 x축(위아래)과 y축(좌우)으로 돌린다. */
  turn(ax: number, ay: number, keepSpin = false) {
    const T = this.T;
    if (!keepSpin) this.spinning = false;
    const qx = new T.Quaternion().setFromAxisAngle(new T.Vector3(1, 0, 0), ax);
    const qy = new T.Quaternion().setFromAxisAngle(new T.Vector3(0, 1, 0), ay);
    this.model.quaternion.premultiply(qy).premultiply(qx);
    this.dirty = true;
  }

  private bindPointer() {
    const el = this.renderer.domElement as HTMLCanvasElement;
    el.style.touchAction = 'none';
    el.addEventListener('pointerdown', e => {
      el.setPointerCapture(e.pointerId);
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, sx: e.clientX, sy: e.clientY });
      this.spinning = false;
      if (this.pointers.size === 2) this.pinch = this.pinchGap();
    });
    el.addEventListener('pointermove', e => {
      const p = this.pointers.get(e.pointerId);
      if (!p) return;
      if (this.pointers.size === 2) {
        p.x = e.clientX; p.y = e.clientY;
        const gap = this.pinchGap();
        if (this.pinch > 0 && gap > 0) this.zoom(this.pinch / gap);
        this.pinch = gap;
        return;
      }
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      this.turn(dy * 0.01, dx * 0.01);
    });
    const up = (e: PointerEvent) => {
      const p = this.pointers.get(e.pointerId);
      this.pointers.delete(e.pointerId);
      if (this.pointers.size < 2) this.pinch = 0;
      if (p && Math.hypot(e.clientX - p.sx, e.clientY - p.sy) < 8) this.pick(e.clientX, e.clientY);
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', e => { this.pointers.delete(e.pointerId); this.pinch = 0; });
    el.addEventListener('wheel', e => { e.preventDefault(); this.zoom(e.deltaY > 0 ? 1.08 : 1 / 1.08); }, { passive: false });
  }
  private pinchGap() {
    const [a, b] = [...this.pointers.values()];
    return a && b ? Math.hypot(a.x - b.x, a.y - b.y) : 0;
  }
  private zoom(k: number) {
    this.distanceScale = Math.min(2.2, Math.max(0.45, this.distanceScale * k));
    this.placeCamera();
  }
  private pick(x: number, y: number) {
    const onPick = this.props().onPick;
    if (!onPick) return;
    const rect = this.renderer.domElement.getBoundingClientRect();
    let best = -1, bestD = 36;
    for (const c of this.carbons) {
      const v = c.at.clone().applyMatrix4(this.model.matrixWorld).project(this.camera);
      const sx = rect.left + (v.x + 1) / 2 * rect.width, sy = rect.top + (1 - v.y) / 2 * rect.height;
      const d = Math.hypot(sx - x, sy - y);
      if (d < bestD) { bestD = d; best = c.atom; }
    }
    if (best >= 0) onPick(best);
  }

  private clear() {
    this.model.traverse((o: Three) => { o.geometry?.dispose?.(); if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m: Three) => m.dispose()); });
    this.model.clear();
    this.labels = [];
    this.labelBox.replaceChildren();
    this.carbons = [];
  }

  // ── 그리기 ───────────────────────────────────────────────────────────
  private v(p: Vec) { return new this.T.Vector3(p[0], p[1], p[2]); }
  private mat(color: number, opts: { opacity?: number; emissive?: number; shiny?: boolean } = {}) {
    const T = this.T;
    const transparent = opts.opacity !== undefined && opts.opacity < 1;
    return new T.MeshPhongMaterial({
      color, emissive: opts.emissive ?? 0x000000, shininess: opts.shiny ? 70 : 30,
      transparent, opacity: opts.opacity ?? 1, depthWrite: !transparent, side: transparent ? T.DoubleSide : T.FrontSide,
    });
  }
  private sphere(at: Vec, r: number, material: Three) {
    const m = new this.T.Mesh(new this.T.SphereGeometry(r, 24, 16), material);
    m.position.copy(this.v(at));
    this.model.add(m);
    return m;
  }
  private cylinder(a: Vec, b: Vec, r: number, material: Three) {
    const T = this.T;
    const d = sub(b, a), l = len(d);
    const m = new T.Mesh(new T.CylinderGeometry(r, r, l, 12), material);
    m.position.copy(this.v(add(a, scale(d, 0.5))));
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), this.v(unit(d)));
    this.model.add(m);
  }
  /** 핵에서 dir 쪽으로 길이 L, 가장 굵은 반지름 w인 물방울 모양(축 둘레로 돌린 면). */
  private lobe(at: Vec, dir: Vec, L: number, w: number, material: Three) {
    const T = this.T;
    const pts = [];
    const n = 30;
    for (let k = 0; k <= n; k++) {
      const t = k / n; // 0 = 핵, 1 = 끝
      const r = w * 1.85 * Math.pow(t, 0.55) * Math.pow(1 - t, 0.45);
      pts.push(new T.Vector2(Math.max(1e-4, r), t * L));
    }
    const m = new T.Mesh(new T.LatheGeometry(pts, 28), material);
    m.position.copy(this.v(at));
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), this.v(unit(dir)));
    m.renderOrder = 2;
    this.model.add(m);
  }
  private hybridLobe(at: Vec, dir: Vec, opacity: number) {
    this.lobe(at, dir, HYBRID_LEN, HYBRID_LEN * 0.36, this.mat(COLOR.hybrid, { opacity, shiny: true }));
    this.lobe(at, scale(dir, -1), HYBRID_LEN * 0.3, HYBRID_LEN * 0.13, this.mat(COLOR.hybridBack, { opacity: opacity * 0.8 }));
  }
  private pOrbital(at: Vec, dir: Vec, opacity: number) {
    for (const s of [1, -1]) this.lobe(at, scale(dir, s), P_LEN, P_LEN * 0.34, this.mat(COLOR.p, { opacity, shiny: true }));
  }
  /** 늘인 구(겹침 표시): 중심, 긴 축 방향과 세 반지름. */
  private blob(at: Vec, axis: Vec, up: Vec, r: [number, number, number], color: number, opacity: number) {
    const T = this.T;
    const x = unit(axis), y = unit(sub(up, scale(x, dot(up, x)))), z = cross(x, y);
    const m = new T.Mesh(new T.SphereGeometry(1, 24, 16), this.mat(color, { opacity, emissive: color }));
    m.matrixAutoUpdate = false;
    const basis = new T.Matrix4().makeBasis(this.v(x), this.v(y), this.v(z));
    m.matrix.compose(this.v(at), new T.Quaternion().setFromRotationMatrix(basis), new T.Vector3(...r));
    m.renderOrder = 3;
    this.model.add(m);
  }
  private label(text: string, at: Vec, kind = '') {
    const el = document.createElement('div');
    el.className = `orbital-label ${kind}`;
    el.textContent = text;
    this.labelBox.appendChild(el);
    this.labels.push({ el, at: this.v(at) });
  }
  private arc(center: Vec, a: Vec, b: Vec, text: string) {
    const T = this.T;
    const u = unit(sub(a, center)), w = unit(sub(b, center));
    const theta = Math.acos(Math.max(-1, Math.min(1, dot(u, w))));
    const r = 0.5;
    let n = cross(u, w);
    if (len(n) < 1e-6) n = Math.abs(u[2]) < 0.9 ? cross(u, [0, 0, 1]) : cross(u, [1, 0, 0]);
    const k = unit(n), perp = cross(k, u);
    const pts = [];
    for (let i = 0; i <= 24; i++) {
      const t = theta * i / 24;
      pts.push(this.v(add(center, scale(add(scale(u, Math.cos(t)), scale(perp, Math.sin(t))), r))));
    }
    const line = new T.Line(new T.BufferGeometry().setFromPoints(pts), new T.LineBasicMaterial({ color: COLOR.angle, depthTest: false }));
    line.renderOrder = 5;
    this.model.add(line);
    const mid = add(center, scale(unit(add(scale(u, Math.cos(theta / 2)), scale(perp, Math.sin(theta / 2)))), r + 0.32));
    this.label(text, mid, 'is-angle');
  }

  build(p: SceneProps) {
    const { mol, mode } = p;
    this.clear();
    const orbital = mode === 'orbital', showP = mode !== 'ball';
    // 원자 · 결합
    const atomR = (el: string) => orbital ? (el === 'C' ? 0.17 : 0.11) : (el === 'C' ? 0.3 : 0.2);
    mol.atoms.forEach((a, i) => {
      const lit = p.highlight === i, flag = p.flagpole && mol.flagpole?.includes(i);
      const color = flag ? COLOR.flag : a.el === 'C' ? COLOR.carbon : COLOR.hydrogen;
      const m = this.sphere(a.p, atomR(a.el) * (lit || flag ? 1.35 : 1), this.mat(color, { shiny: true, emissive: lit ? COLOR.highlight : flag ? 0x5a0b1c : 0x000000 }));
      if (lit) { this.sphere(a.p, atomR(a.el) * 2.3, this.mat(COLOR.highlight, { opacity: 0.28, emissive: COLOR.highlight })); m.renderOrder = 4; }
      if (a.el === 'C') this.carbons.push({ atom: i, at: this.v(a.p) });
    });
    const bondMat = this.mat(COLOR.bond, { shiny: true });
    for (const b of mol.bonds) {
      const pa = mol.atoms[b.a].p, pb = mol.atoms[b.b].p;
      if (showP || b.order === 1) { this.cylinder(pa, pb, orbital ? 0.045 : 0.08, bondMat); continue; }
      // 공 · 막대 모형의 이중 · 삼중 결합: 분자 평면 안에서 나란히.
      const d = unit(sub(pb, pa));
      const pd = orbitalsOf(mol, b.a)?.p[0] ?? [0, 0, 1];
      const off = scale(unit(cross(d, pd)), 0.11);
      const offs = b.order === 2 ? [scale(off, 1), scale(off, -1)] : [scale(off, 1.6), [0, 0, 0] as Vec, scale(off, -1.6)];
      for (const o of offs) this.cylinder(add(pa, o), add(pb, o), 0.055, bondMat);
    }
    // 오비탈
    if (showP) {
      mol.atoms.forEach((a, i) => {
        const set = orbitalsOf(mol, i, p.strain);
        if (set) {
          if (orbital) for (const l of set.lobes) this.hybridLobe(a.p, l.dir, 0.55);
          for (const pd of set.p) this.pOrbital(a.p, pd, orbital ? 0.42 : 0.5);
        } else if (orbital) this.sphere(a.p, H1S, this.mat(COLOR.h1s, { opacity: 0.32 }));
      });
    }
    if (orbital && p.sigma) {
      for (const b of mol.bonds) {
        const pa = mol.atoms[b.a].p, pb = mol.atoms[b.b].p, d = sub(pb, pa), l = len(d);
        let mid = add(pa, scale(d, 0.5));
        const inRing = p.strain && mol.ring?.includes(b.a) && mol.ring.includes(b.b);
        if (inRing) { // 굽은 결합: 두 오비탈이 만나는 곳은 C–C 축 바깥
          const centre = scale(mol.ring!.reduce((s, r) => add(s, mol.atoms[r].p), [0, 0, 0] as Vec), 1 / mol.ring!.length);
          const out = sub(mid, centre), outward = unit(sub(out, scale(unit(d), dot(out, unit(d)))));
          mid = add(mid, scale(outward, l / 2 * Math.tan(bentAngle(ringAngle(mol)) * Math.PI / 180)));
        }
        const h = mol.atoms[b.a].el === 'H' || mol.atoms[b.b].el === 'H';
        this.blob(mid, d, Math.abs(unit(d)[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0], [l * (h ? 0.22 : 0.2), 0.16, 0.16], COLOR.sigma, 0.55);
      }
    }
    if (showP && p.pi) {
      for (const b of mol.bonds) {
        if (b.order === 1) continue;
        const sa = orbitalsOf(mol, b.a), sb = orbitalsOf(mol, b.b);
        if (!sa || !sb) continue;
        const pa = mol.atoms[b.a].p, pb = mol.atoms[b.b].p, d = sub(pb, pa), mid = add(pa, scale(d, 0.5));
        sa.p.forEach(pda => {
          const pdb = sb.p.reduce((best, x) => Math.abs(dot(x, pda)) > Math.abs(dot(best, pda)) ? x : best, sb.p[0]);
          const align = Math.abs(dot(pda, pdb));
          if (align < 0.04) return;
          const shared = unit(add(pda, scale(pdb, Math.sign(dot(pda, pdb)) || 1)));
          for (const s of [1, -1]) this.blob(add(mid, scale(shared, s * 0.62)), d, shared, [len(d) * 0.62, 0.3, 0.34], COLOR.pi, 0.55 * align);
        });
      }
    }
    if (p.flagpole && mol.flagpole) {
      const [x, y] = mol.flagpole.map(i => mol.atoms[i].p);
      const T = this.T;
      const line = new T.Line(new T.BufferGeometry().setFromPoints([this.v(x), this.v(y)]), new T.LineDashedMaterial({ color: COLOR.flag, dashSize: 0.12, gapSize: 0.08 }));
      line.computeLineDistances();
      this.model.add(line);
      this.label(`${len(sub(x, y)).toFixed(1)} Å`, add(scale(add(x, y), 0.5), [0, 0, 0.35]), 'is-flag');
    }
    for (const s of p.angles ?? []) {
      const c = mol.atoms[s.center].p;
      const angle = angleBetween(sub(mol.atoms[s.a].p, c), sub(mol.atoms[s.b].p, c));
      this.arc(c, mol.atoms[s.a].p, mol.atoms[s.b].p, `${Math.round(angle * 10) / 10}°`);
    }
    // 가운데 맞추고 크기에 맞춰 카메라 거리.
    const centre = scale(mol.atoms.reduce((s, a) => add(s, a.p), [0, 0, 0] as Vec), 1 / mol.atoms.length);
    this.model.children.forEach((o: Three) => {
      if (o.matrixAutoUpdate === false) { const pos = new this.T.Vector3().setFromMatrixPosition(o.matrix); pos.sub(this.v(centre)); o.matrix.setPosition(pos); }
      else o.position.sub(this.v(centre));
    });
    this.labels.forEach(l => l.at.sub(this.v(centre)));
    this.carbons.forEach(c => c.at.sub(this.v(centre)));
    this.radius = Math.max(1.6, ...mol.atoms.map(a => len(sub(a.p, centre)) + (orbital ? 0.62 : 0.32)));
    this.placeCamera();
  }

  private render() {
    this.renderer.render(this.scene, this.camera);
    if (this.labels.length) {
      const w = this.host.clientWidth, h = this.host.clientHeight;
      this.model.updateMatrixWorld();
      for (const l of this.labels) {
        const v = l.at.clone().applyMatrix4(this.model.matrixWorld).project(this.camera);
        l.el.style.transform = `translate(-50%, -50%) translate(${(v.x + 1) / 2 * w}px, ${(1 - v.y) / 2 * h}px)`;
      }
    }
    this.dirty = this.spinning;
  }
}
