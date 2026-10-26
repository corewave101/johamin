// 양동비T 「빛과 렌즈」 실습: 렌즈 · 거울 광선추적 작도판 + 스크린 상맺힘 + 작도 가이드, 망원경 · 현미경 · 프리즘.
// 수업에서 보여 주신 가상실험실을 앱 화면(SVG)으로 옮겼다. 계산은 lib/optics-lab.ts.
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import MenuCard from './MenuCard';
import {
  SINGLE_VIEW, GRID_CM, APERTURE, isLens, singleImage, screenView, snapDistance, guideSteps, checkStroke, snapPoint,
  telescopeState, microscopeBounds, microscopeState, prismState, fmtCm, type SingleKind, type Pt, type Seg,
} from '../../lib/optics-lab';

type Page = 'menu' | 'lens' | 'mirror' | 'device';
type Device = 'telescope' | 'microscope' | 'prism';
type Tool = 'move' | 'pencil' | 'eraser';
type Stroke = { a: Pt; b: Pt; mark?: 'ok' | 'miss' };
type View = { left: number; right: number; top: number; bottom: number };

const INFO: Record<SingleKind | Device, { title: string; summary: string; concept: string[]; activity: string[] }> = {
  'convex-lens': { title: '볼록 렌즈', summary: '초점 바깥 실상, 초점 안쪽 허상',
    concept: ['광축에 나란한 광선은 굴절 후 반대쪽 초점을 지난다.', '렌즈 중심을 지나는 광선은 거의 직진한다.', '물체가 초점 바깥이면 실상·도립, 초점 안쪽이면 허상·정립·확대가 된다.'],
    activity: ['물체를 2F보다 멀리 둘 때 상의 크기와 방향을 기록한다.', '물체를 F와 2F 사이로 옮길 때 상이 어떻게 달라지는지 비교한다.', '물체를 F 안쪽에 놓고 연장선을 그려 허상의 위치를 찾는다.'] },
  'concave-lens': { title: '오목 렌즈', summary: '항상 정립 허상, 축소',
    concept: ['평행 광선은 렌즈를 지난 뒤 퍼지며, 입사쪽 초점에서 나온 것처럼 보인다.', '렌즈 중심을 지나는 광선은 거의 직진한다.', '물체 위치와 관계없이 작고 바로 선 허상이 생긴다.'],
    activity: ['물체를 가까이, 멀리 움직여도 상이 항상 어느 쪽에 생기는지 확인한다.', '허상을 찾을 때 실제 광선이 아니라 연장선을 사용해야 하는 이유를 적는다.'] },
  'concave-mirror': { title: '오목 거울', summary: '멀리 있으면 실상, 가까우면 확대 허상',
    concept: ['광축에 나란한 광선은 반사 후 초점을 지난다.', '초점을 지나 거울에 닿은 광선은 반사 후 광축과 나란하게 진행한다.', '물체가 초점 안쪽에 있으면 거울 뒤쪽에 확대된 정립 허상이 생긴다.'],
    activity: ['물체가 2F에 있을 때 상의 크기를 물체와 비교한다.', '물체를 F 안쪽으로 옮겨 허상이 생기는 조건을 찾는다.'] },
  'convex-mirror': { title: '볼록 거울', summary: '항상 정립 허상, 축소',
    concept: ['평행 광선은 반사 후 퍼지며, 거울 뒤 초점에서 나온 것처럼 보인다.', '실제 광선은 만나지 않으므로 연장선으로 허상을 찾는다.', '항상 작고 바로 선 허상이 생긴다.'],
    activity: ['물체 거리를 바꿔도 상이 거울 앞에 생기는지 뒤에 생기는지 확인한다.', '자동차 사이드미러가 넓은 범위를 보여 주는 이유를 상의 크기와 연결한다.'] },
  telescope: { title: '굴절 망원경', summary: '먼 물체와 가까운 물체의 상을 비교',
    concept: ['멀리 있는 물체에서 오는 빛은 거의 평행 광선으로 들어온다.', '대물렌즈는 도립 실상인 중간 상을 만든다. 먼 물체일수록 초점면에 가까워진다.', '가까운 물체의 중간 상은 대물렌즈 초점보다 멀리 맺히므로 접안렌즈 위치를 다시 맞춰야 한다.'],
    activity: ['대물렌즈가 만든 중간 상의 방향을 관찰한다.', '가까운 물체로 바꾸고 거리를 움직이며 중간 상의 위치를 비교한다.', '중간 상과 접안렌즈 사이 거리를 초점 거리보다 작게, 같게, 크게 바꾸어 최종 상을 비교한다.'] },
  microscope: { title: '현미경', summary: '대물렌즈와 접안렌즈가 두 번 확대',
    concept: ['물체를 대물렌즈 초점보다 조금 바깥에 두면 확대된 도립 실상이 생긴다.', '중간 상이 접안렌즈 초점 안쪽에 있을 때 최종 상은 도립 허상으로 확대된다.', '물체를 옮겨 중간 상이 접안렌즈 초점 밖으로 가면 최종 상의 종류도 바뀐다.'],
    activity: ['물체가 대물렌즈 초점에 너무 가까우면 중간 상이 어떻게 이동하는지 확인한다.', '대물렌즈의 초점 거리를 줄이면 확대가 커지는 이유를 작도와 연결한다.'] },
  prism: { title: '전반사 프리즘', summary: '임계각보다 큰 입사각에서 경로가 꺾임',
    concept: ['굴절률이 큰 매질에서 작은 매질로 갈 때 전반사가 일어날 수 있다.', '입사각이 임계각보다 크면 굴절광 없이 반사광만 남는다.', '프리즘은 에너지 손실을 줄이면서 빛의 경로를 바꾸는 데 쓰인다.'],
    activity: ['임계각보다 작은 경우와 큰 경우의 빛 경로를 비교한다.', '쌍안경에서 프리즘이 렌즈 사이의 경로를 접는 역할을 설명한다.'] },
};
const DEFAULTS: Record<SingleKind, { f: number; d: number; h: number }> = {
  'convex-lens': { f: 12, d: 30, h: 8 }, 'concave-lens': { f: 12, d: 28, h: 8 }, 'concave-mirror': { f: 12, d: 32, h: 8 }, 'convex-mirror': { f: 12, d: 30, h: 8 },
};
const DEVICE_DEFAULTS = { telFo: 20, telFe: 6, telAngle: 6, telDistant: true, telDo: 50, telGap: 4, micFo: 5, micFe: 8, micDo: 6.2, micTube: 30, prismN: 1.52, prismAngle: 48 };
const MIRROR_HALF = 15, MIRROR_EDGE = 2.4;
const mirrorX = (kind: SingleKind, y: number) => (kind === 'concave-mirror' ? -1 : 1) * MIRROR_EDGE * (y / MIRROR_HALF) ** 2;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const num = (v: number) => Number(v.toFixed(2)).toString();

// ── SVG 작도 도구 (y는 위가 +, SVG에서는 뒤집어 그린다) ───────────────────────────
type Ink = 'in' | 'out' | 'center' | 'final' | 'axis' | 'muted' | 'object' | 'real' | 'virtual' | 'ink' | 'ok' | 'miss' | 'ghost';
function Ray({ a, b, ink = 'in', dash, head = true, width = 0.32 }: { a: Pt; b: Pt; ink?: Ink; dash?: boolean; head?: boolean; width?: number }) {
  return <line x1={a.x} y1={-a.y} x2={b.x} y2={-b.y} className={`ink-${ink}`} strokeWidth={width} strokeDasharray={dash ? '1.1 0.9' : undefined} markerEnd={head ? `url(#optics-head-${ink})` : undefined} />;
}
// 글자 크기는 작도판 가로 폭에 맞춘다(단일 렌즈판 90 cm = 1). 이름표는 판 밖으로 나가지 않게 안쪽으로 민다.
const BoardScale = createContext<{ unit: number; view: View }>({ unit: 1, view: { left: -45, right: 45, top: 22, bottom: -22 } });
function Label({ x, y, children, tone = 'plain' }: { x: number; y: number; children: string; tone?: 'plain' | 'real' | 'virtual' | 'info' | 'warn' | 'bare' }) {
  const { unit: u, view } = useContext(BoardScale);
  const w = ([...children].reduce((sum, ch) => sum + (/[가-힣]/.test(ch) ? 1.85 : ch === ' ' ? 0.6 : 1.1), 0) + 1.4) * u;
  const cx = clamp(x, view.left + w / 2 + 0.3 * u, view.right - w / 2 - 0.3 * u);
  return <g className={`optics-label tone-${tone}`} style={{ fontSize: `${1.9 * u}px` }}>
    {tone !== 'bare' && <rect x={cx - w / 2} y={-y - 1.45 * u} width={w} height={2.9 * u} rx={0.8 * u} strokeWidth={0.12 * u} />}
    <text x={cx} y={-y} dominantBaseline="central" textAnchor="middle">{children}</text>
  </g>;
}
function Arrow({ x, h, ink, dash, base = true }: { x: number; h: number; ink: Ink; dash?: boolean; base?: boolean }) {
  return <g>
    <Ray a={{ x, y: 0 }} b={{ x, y: h }} ink={ink} dash={dash} width={0.5} />
    {base && <line x1={x - 1.4} y1={0} x2={x + 1.4} y2={0} className={`ink-${ink}`} strokeWidth={0.32} strokeDasharray={dash ? '1.1 0.9' : undefined} />}
  </g>;
}
const HEADS: Ink[] = ['in', 'out', 'center', 'final', 'object', 'real', 'virtual', 'ink', 'ok', 'miss', 'ghost', 'muted'];
function Board({ view, children, onPointerDown, onPointerMove, onPointerUp, label, cursor, svgRef }: { view: View; children: ReactNode; onPointerDown?: (e: PointerEvent<SVGSVGElement>) => void; onPointerMove?: (e: PointerEvent<SVGSVGElement>) => void; onPointerUp?: (e: PointerEvent<SVGSVGElement>) => void; label: string; cursor: string; svgRef: React.RefObject<SVGSVGElement | null> }) {
  const w = view.right - view.left, h = view.top - view.bottom;
  const xs: number[] = [], ys: number[] = [];
  for (let x = Math.ceil(view.left / GRID_CM) * GRID_CM; x <= view.right; x += GRID_CM) xs.push(x);
  for (let y = Math.ceil(view.bottom / GRID_CM) * GRID_CM; y <= view.top; y += GRID_CM) ys.push(y);
  return <svg ref={svgRef} className="optics-board" viewBox={`${view.left} ${-view.top} ${w} ${h}`} role="group" aria-label={label} style={{ cursor }}
    onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp}>
    <defs>{HEADS.map(ink => <marker key={ink} id={`optics-head-${ink}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="4.2" markerHeight="4.2" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" className={`fill-${ink}`} /></marker>)}</defs>
    <g className="optics-grid">{xs.map(x => <line key={`x${x}`} x1={x} y1={-view.top} x2={x} y2={-view.bottom} />)}{ys.map(y => <line key={`y${y}`} x1={view.left} y1={-y} x2={view.right} y2={-y} />)}</g>
    <line x1={view.left + 1} y1={0} x2={view.right - 1} y2={0} className="ink-axis" strokeWidth={0.22} />
    <BoardScale.Provider value={{ unit: w / 90, view }}>
      <Label x={view.right - 4} y={-1.8} tone="bare">광축</Label>
      {children}
    </BoardScale.Provider>
  </svg>;
}
function LensShape({ x = 0, half = 15, kind, eye }: { x?: number; half?: number; kind: 'convex' | 'concave'; eye?: boolean }) {
  const t = (v: number) => -v;
  const d = kind === 'convex'
    ? `M${x} ${t(half)}C${x + half * 0.22} ${t(half * 0.53)} ${x + half * 0.22} ${t(-half * 0.53)} ${x} ${t(-half)}C${x - half * 0.22} ${t(-half * 0.53)} ${x - half * 0.22} ${t(half * 0.53)} ${x} ${t(half)}Z`
    : `M${x - 2.2} ${t(half)}C${x} ${t(half * 0.53)} ${x} ${t(-half * 0.53)} ${x - 2.2} ${t(-half)}L${x + 2.2} ${t(-half)}C${x} ${t(-half * 0.53)} ${x} ${t(half * 0.53)} ${x + 2.2} ${t(half)}Z`;
  return <path d={d} className={`optics-lens ${eye ? 'eye' : kind}`} />;
}
function Marks({ xs }: { xs: { x: number; name: string; faint?: boolean }[] }) {
  return <g>{xs.map(m => <g key={`${m.name}${m.x}`} className={m.faint ? 'optics-mark faint' : 'optics-mark'}>
    <line x1={m.x} y1={-0.7} x2={m.x} y2={0.7} strokeDasharray={m.faint ? '0.6 0.6' : undefined} /><Label x={m.x} y={-2.1} tone="bare">{m.name}</Label></g>)}</g>;
}

// ── 스크린에 비친 모습 ───────────────────────────────────────────────────────
function Glyph({ size, blur, scale, dim }: { size: number; blur: number; scale: number; dim?: boolean }) {
  // 물체 모양: 화살표 + 오른쪽 깃발. 상이 거꾸로면 180° 돌아서 위아래 · 좌우가 모두 바뀐다.
  const h = Math.min(33, Math.abs(size) * scale), rot = size < 0 ? 180 : 0;
  const style = { filter: blur > 0.05 ? `blur(${Math.min(14, blur * scale * 0.45)}px)` : undefined, opacity: dim ? 0.55 : clamp(1 / (1 + blur * 0.35), 0.18, 1) };
  return <g transform={`translate(50 37.5) rotate(${rot}) translate(0 ${h / 2})`} style={style}>
    <line x1={0} y1={0} x2={0} y2={-h} className="glyph-stem" />
    <path d={`M0 ${-h - 0.1}l${-h * 0.14} ${h * 0.22}h${h * 0.28}z`} className="glyph-head" />
    <path d={`M0 ${-h * 0.62}h${h * 0.36}l${-h * 0.08} ${h * 0.12}l${h * 0.08} ${h * 0.12}h${-h * 0.36}z`} className="glyph-flag" />
  </g>;
}

export default function OpticsLab({ onBack }: { onBack: () => void }) {
  const [page, setPage] = useState<Page>('menu');
  const [kind, setKind] = useState<SingleKind>('convex-lens');
  const [device, setDevice] = useState<Device>('telescope');
  const [f, setF] = useState(12), [d, setD] = useState(30), [h, setH] = useState(8);
  const [screenOn, setScreenOn] = useState(true), [screenS, setScreenS] = useState(14);
  const [showAnswer, setShowAnswer] = useState(true), [showRays, setShowRays] = useState(true), [showMarks, setShowMarks] = useState(true);
  const [tool, setTool] = useState<Tool>('move');
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [undo, setUndo] = useState<Stroke[][]>([]), [redo, setRedo] = useState<Stroke[][]>([]);
  const [drawing, setDrawing] = useState<Seg | null>(null);
  const [guide, setGuide] = useState<{ on: boolean; index: number; hint: boolean; message: string }>({ on: false, index: 0, hint: false, message: '' });
  const [dev, setDev] = useState(DEVICE_DEFAULTS);
  const drag = useRef<{ id: number; what: 'object' | 'screen' | 'stroke' | 'micro' | 'tele' } | null>(null);
  const svg = useRef<SVGSVGElement | null>(null);

  const single = page === 'lens' || page === 'mirror';
  const image = useMemo(() => singleImage(kind, f, d, h), [kind, f, d, h]);
  const plan = useMemo(() => guideSteps(kind, image), [kind, image]);
  const step = guide.on ? plan.steps[guide.index] : undefined;
  const finished = guide.on && plan.steps.length > 0 && guide.index >= plan.steps.length;
  const screen = useMemo(() => screenView(image, screenS), [image, screenS]);
  const screenX = isLens(kind) ? screenS : -screenS;

  const clearDrawing = useCallback(() => { setStrokes([]); setUndo([]); setRedo([]); setDrawing(null); drag.current = null; }, []);
  const commit = (next: Stroke[]) => { setUndo(u => [...u, strokes]); setStrokes(next); setRedo([]); };
  const undoOnce = useCallback(() => { if (!undo.length || drag.current) return; setRedo(r => [...r, strokes]); setStrokes(undo[undo.length - 1]); setUndo(undo.slice(0, -1)); }, [undo, strokes]);
  const redoOnce = useCallback(() => { if (!redo.length || drag.current) return; setUndo(u => [...u, strokes]); setStrokes(redo[redo.length - 1]); setRedo(redo.slice(0, -1)); }, [redo, strokes]);

  // 설정이 바뀌면 가이드는 처음부터(이미 그린 선이 새 배치와 맞지 않으므로).
  const restartGuide = useCallback((message: string) => { clearDrawing(); setGuide(g => g.on ? { on: true, index: 0, hint: false, message } : g); }, [clearDrawing]);
  const setSingle = (patch: Partial<{ f: number; d: number; h: number }>) => {
    if (patch.f !== undefined) setF(patch.f); if (patch.d !== undefined) setD(patch.d); if (patch.h !== undefined) setH(patch.h);
    if (guide.on) restartGuide('배치가 바뀌어서 처음부터 다시 그려요.');
  };
  const openSingle = (next: SingleKind) => {
    const def = DEFAULTS[next];
    setKind(next); setF(def.f); setD(def.d); setH(def.h); setScreenS(14); clearDrawing();
    setGuide({ on: false, index: 0, hint: false, message: '' }); setShowAnswer(true); setShowRays(true); setTool('move');
  };
  const startGuide = () => {
    clearDrawing(); setShowAnswer(false); setShowRays(false); setTool('pencil');
    setGuide({ on: true, index: 0, hint: false, message: plan.note ?? '' });
  };
  const stopGuide = () => { setGuide({ on: false, index: 0, hint: false, message: '' }); setShowAnswer(true); setShowRays(true); setTool('move'); };
  const advance = (mark: 'ok' | 'miss', stroke: Seg, message: string) => {
    commit([...strokes, { a: stroke[0], b: stroke[1], mark }]);
    const index = mark === 'ok' ? guide.index + 1 : guide.index;
    const done = mark === 'ok' && index >= plan.steps.length;
    if (done) { setShowAnswer(true); setShowRays(true); }
    setGuide({ ...guide, index, hint: false, message: done ? '다 그렸어요! 정답과 광선을 켰어요. 내가 그린 선과 비교해 보세요.' : message });
  };
  const showStep = () => { if (step) advance('ok', step.ghost, `${step.title} — 이렇게 그려요.`); };

  const back = useCallback(() => { if (page === 'menu') onBack(); else { setPage('menu'); stopGuideSilently(); } }, [page, onBack]);
  function stopGuideSilently() { setGuide({ on: false, index: 0, hint: false, message: '' }); setTool('move'); setShowAnswer(true); setShowRays(true); clearDrawing(); }
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault(); e.stopImmediatePropagation();
        if (e.repeat) return;
        if (drawing) { setDrawing(null); drag.current = null; return; }
        back(); return;
      }
      if ((e.ctrlKey || e.metaKey) && !e.altKey && ['z', 'y'].includes(e.key.toLowerCase()) && !(e.target as HTMLElement | null)?.closest?.('input, textarea')) {
        e.preventDefault(); if (e.key.toLowerCase() === 'y' || e.shiftKey) redoOnce(); else undoOnce();
      }
    };
    window.addEventListener('keydown', key, true); return () => window.removeEventListener('keydown', key, true);
  }, [back, drawing, undoOnce, redoOnce]);

  // ── 화면 좌표 → 작도판 좌표 ──
  const toWorld = (e: PointerEvent<SVGSVGElement>): Pt => {
    const el = svg.current; const m = el?.getScreenCTM();
    if (!el || !m) return { x: 0, y: 0 };
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
    return { x: p.x, y: -p.y };
  };
  const pxPerCm = () => svg.current?.getScreenCTM()?.a ?? 8;
  const deviceView = (): View => {
    if (device === 'telescope') { const t = tele; return t.distant ? { left: -24, right: 42, top: 20, bottom: -20 } : { left: -t.doValue - 5, right: t.sep + 15, top: 20, bottom: -20 }; }
    if (device === 'microscope') return { left: -Math.max(14, microscopeBounds(dev.micFo, dev.micTube).max + 2), right: 42, top: 20, bottom: -20 };
    return { left: -28, right: 28, top: 20, bottom: -20 };
  };
  const tele = telescopeState({ fo: dev.telFo, fe: dev.telFe, angle: dev.telAngle, distant: dev.telDistant, objectDistance: dev.telDo, gap: dev.telGap });
  const micro = microscopeState(dev.micFo, dev.micFe, dev.micDo, dev.micTube);
  const prism = prismState(dev.prismN, dev.prismAngle);

  const onDown = (e: PointerEvent<SVGSVGElement>) => {
    if (e.button !== 0 || drag.current) return;
    const p = toWorld(e);
    const touch = e.pointerType === 'touch';
    if (tool === 'eraser') {
      const tol = (touch ? 18 : 12) / pxPerCm();
      let best = -1, bestD = tol;
      strokes.forEach((s, i) => {
        const dx = s.b.x - s.a.x, dy = s.b.y - s.a.y, len2 = dx * dx + dy * dy;
        const t = len2 ? clamp(((p.x - s.a.x) * dx + (p.y - s.a.y) * dy) / len2, 0, 1) : 0;
        const dd = Math.hypot(p.x - s.a.x - t * dx, p.y - s.a.y - t * dy);
        if (dd <= bestD) { best = i; bestD = dd; }
      });
      if (best >= 0) commit(strokes.filter((_, i) => i !== best));
      return;
    }
    if (tool === 'pencil') {
      const start = single ? snapPoint(p, plan.snaps, (touch ? 3 : 2.2)) : p;
      drag.current = { id: e.pointerId, what: 'stroke' };
      e.currentTarget.setPointerCapture(e.pointerId);
      setDrawing([start, start]);
      return;
    }
    if (single) {
      if (Math.abs(p.x + d) < 4 && p.y > -2 && p.y < h + 4) { drag.current = { id: e.pointerId, what: 'object' }; e.currentTarget.setPointerCapture(e.pointerId); return; }
      if (screenOn && Math.abs(p.x - screenX) < 3 && Math.abs(p.y) < 16) { drag.current = { id: e.pointerId, what: 'screen' }; e.currentTarget.setPointerCapture(e.pointerId); }
      return;
    }
    if (device === 'microscope' && Math.abs(p.x + dev.micDo) < 4 && p.y > -2 && p.y < 8.5) { drag.current = { id: e.pointerId, what: 'micro' }; e.currentTarget.setPointerCapture(e.pointerId); }
    if (device === 'telescope' && !dev.telDistant && Math.abs(p.x + dev.telDo) < 4 && p.y > -2 && p.y < 9) { drag.current = { id: e.pointerId, what: 'tele' }; e.currentTarget.setPointerCapture(e.pointerId); }
  };
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const g = drag.current; if (!g || g.id !== e.pointerId) return;
    const p = toWorld(e);
    if (g.what === 'stroke') { setDrawing(s => s ? [s[0], single ? snapPoint(p, plan.snaps, e.pointerType === 'touch' ? 3 : 2.2) : p] : s); return; }
    if (g.what === 'object') { const next = snapDistance(-p.x); if (next !== d) setSingle({ d: next }); return; }
    if (g.what === 'screen') { setScreenS(Math.round(clamp(isLens(kind) ? p.x : -p.x, 2, 44) * 2) / 2); return; }
    if (g.what === 'micro') { const b = microscopeBounds(dev.micFo, dev.micTube); setDev(v => ({ ...v, micDo: Math.round(clamp(-p.x, b.min, b.max) * 10) / 10 })); return; }
    if (g.what === 'tele') setDev(v => ({ ...v, telDo: Math.round(clamp(-p.x, 2 * v.telFo, 5 * v.telFo) * 2) / 2 }));
  };
  const onUp = (e: PointerEvent<SVGSVGElement>) => {
    const g = drag.current; if (!g || g.id !== e.pointerId) return;
    drag.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (g.what !== 'stroke' || !drawing) return;
    const seg = drawing; setDrawing(null);
    if (Math.hypot(seg[1].x - seg[0].x, seg[1].y - seg[0].y) * pxPerCm() < 3) return;
    if (single && step) {
      const ok = checkStroke(step, seg, e.pointerType === 'touch' ? 2.8 : 2);
      advance(ok ? 'ok' : 'miss', seg, ok ? `맞아요! ${step.title}` : `다시 그려 보세요. ${step.hint}`);
      return;
    }
    commit([...strokes, { a: seg[0], b: seg[1] }]);
  };
  const objectKeys = (e: ReactKeyboardEvent) => {
    const delta = e.key === 'ArrowLeft' ? 0.5 : e.key === 'ArrowRight' ? -0.5 : 0;
    if (!delta) return; e.preventDefault(); e.stopPropagation(); setSingle({ d: snapDistance(d + delta) });
  };

  if (page === 'menu') return <MenuCard topic="양동비T · 빛과 렌즈 실습" question="무엇으로 실험할까요?"
    up={{ label: '렌즈', note: '볼록 · 오목', onChoose: () => { openSingle('convex-lens'); setPage('lens'); } }}
    left={{ label: '거울', note: '오목 · 볼록', onChoose: () => { openSingle('concave-mirror'); setPage('mirror'); } }}
    right={{ label: '광학 기기', note: '망원경 · 현미경 · 프리즘', onChoose: () => { setDevice('telescope'); setDev(DEVICE_DEFAULTS); clearDrawing(); setTool('move'); setShowAnswer(true); setShowRays(true); setPage('device'); } }}
    onBack={onBack} backLabel="학습 메뉴">
    <div className="observation-note glass"><p>물체를 움직이면 상이 바로 바뀌어요. 스크린으로 상이 맺히는 자리를 찾고, 작도 가이드로 광선을 한 단계씩 그려 봐요.</p></div>
  </MenuCard>;

  // ── 작도판 내용 ──
  const view: View = single ? SINGLE_VIEW : deviceView();
  const tabs: (SingleKind | Device)[] = page === 'lens' ? ['convex-lens', 'concave-lens'] : page === 'mirror' ? ['concave-mirror', 'convex-mirror'] : ['telescope', 'microscope', 'prism'];
  const current = single ? kind : device;
  const info = INFO[current];
  const toggle = (label: string, on: boolean, set: (v: boolean) => void, disabled = false) => <button type="button" className="glass-button optics-toggle" aria-pressed={on} disabled={disabled} onClick={() => set(!on)}>{label}</button>;
  const slider = (label: string, value: number, min: number, max: number, stepSize: number, unit: string, set: (v: number) => void) =>
    <label className="observation-control">{label} <output>{value}{unit}</output><input type="range" aria-label={label} min={min} max={max} step={stepSize} value={value} onChange={e => set(Number(e.target.value))} /></label>;

  const singleBoard = () => {
    const lens = isLens(kind), fs = image.f, objX = -d;
    const marks = lens ? [-2, -1, 1, 2].map(k => ({ x: k * Math.abs(fs), name: Math.abs(k) === 1 ? 'F' : '2F' }))
      : [-2, -1].map(k => ({ x: k * fs, name: k === -1 ? 'F' : '2F', faint: k * fs > 0 }));
    const rays: ReactNode[] = [];
    if (showRays && !image.infinite) [h, 0, -h * 0.45].forEach((y, i) => {
      const hitX = lens ? 0 : mirrorX(kind, y), ink: Ink = i === 1 ? 'center' : 'in';
      rays.push(<Ray key={`i${i}`} a={{ x: objX, y: h }} b={{ x: hitX, y }} ink={ink} />);
      if (image.real) rays.push(<Ray key={`o${i}`} a={{ x: hitX, y }} b={{ x: image.x, y: image.y }} ink="out" />);
      else {
        const slope = (y - image.y) / (hitX - image.x), endX = lens ? view.right - 3 : view.left + 4;
        rays.push(<Ray key={`o${i}`} a={{ x: hitX, y }} b={{ x: endX, y: y + slope * (endX - hitX) }} ink="out" />);
        if (showAnswer) rays.push(<Ray key={`e${i}`} a={{ x: image.x, y: image.y }} b={{ x: hitX, y }} ink="muted" dash head={false} width={0.22} />);
      }
    });
    const edge = mirrorX(kind, MIRROR_HALF);
    return <>
      {showMarks && <Marks xs={marks.filter(m => m.x > view.left + 2 && m.x < view.right - 2)} />}
      {lens ? <><LensShape kind={fs > 0 ? 'convex' : 'concave'} /><Label x={0} y={17.2}>{fs > 0 ? '볼록 렌즈' : '오목 렌즈'}</Label></>
        : <g className="optics-mirror">{Array.from({ length: 15 }, (_, i) => -14 + i * 2).map(y => { const x = mirrorX(kind, y); return <line key={y} x1={x} y1={-y} x2={x + 1} y2={-y - 0.8} className="hatch" />; })}
          <path d={`M${edge} ${-MIRROR_HALF}Q${-edge} 0 ${edge} ${MIRROR_HALF}`} className={kind === 'concave-mirror' ? 'surface concave' : 'surface convex'} /><Label x={0} y={17.2}>{kind === 'concave-mirror' ? '오목 거울' : '볼록 거울'}</Label></g>}
      {rays}
      {screenOn && <g className="optics-screen" aria-hidden="true">
        <rect x={screenX - 0.45} y={-14} width={0.9} height={28} rx={0.3} />
        {screen.formed && <rect className="spot" x={screenX - 0.7} y={-Math.max(screen.size, 0) - screen.blur / 2} width={1.4} height={Math.abs(screen.size) + screen.blur} rx={0.6} style={{ opacity: clamp(1 / (1 + screen.blur * 0.25), 0.25, 0.9) }} />}
        <Label x={screenX} y={-15.6} tone="info">스크린</Label>
      </g>}
      <g className="optics-object" tabIndex={0} role="slider" aria-label="물체 위치" aria-valuemin={4} aria-valuemax={42} aria-valuenow={d} aria-valuetext={`렌즈에서 ${d} cm`} onKeyDown={objectKeys}>
        <rect x={objX - 3} y={-h - 3} width={6} height={h + 5} className="hit" />
        <Arrow x={objX} h={h} ink="object" /><Label x={objX} y={h + 2}>물체</Label>
      </g>
      {showAnswer && !image.infinite && <g>
        <line x1={image.x} y1={-image.y} x2={image.x} y2={0} className={image.real ? 'ink-real' : 'ink-virtual'} strokeWidth={0.18} strokeDasharray="0.6 0.8" opacity={0.5} />
        <Arrow x={image.x} h={image.y} ink={image.real ? 'real' : 'virtual'} dash={!image.real} />
        <Label x={image.x} y={image.y + (image.y >= 0 ? 2.2 : -2.2)} tone={image.real ? 'real' : 'virtual'}>{`${image.real ? '실상' : '허상'}, ${image.upright ? '정립' : '도립'}`}</Label>
      </g>}
      {showAnswer && image.infinite && <Label x={18} y={7} tone="warn">상은 매우 먼 곳에 생김</Label>}
      {guide.on && guide.hint && step && <Ray a={step.ghost[0]} b={step.ghost[1]} ink="ghost" dash head={step.kind !== 'image'} width={0.45} />}
    </>;
  };

  const deviceLens = (x: number, text: string, fl: number, tone: 'convex' | 'eye') => <g key={text}>
    <LensShape x={x} half={14} kind="convex" eye={tone === 'eye'} />
    <Label x={x} y={16.3}>{text}</Label>
    {showMarks && <Marks xs={[{ x: x + fl, name: 'F' }, { x: x - fl, name: 'F' }]} />}
  </g>;
  const deviceBoard = () => {
    const out: ReactNode[] = [];
    if (device === 'telescope') {
      const t = tele;
      out.push(deviceLens(0, '대물렌즈', t.fo, 'convex'), deviceLens(t.sep, '접안렌즈', t.fe, 'eye'));
      if (!t.distant) {
        const objX = -t.doValue, oh = 5;
        out.push(<g key="obj"><Arrow x={objX} h={oh} ink="object" /><Label x={objX} y={oh + 2}>물체</Label></g>);
        if (showRays) [oh, 0, -oh * 0.35].forEach((hitY, i) => {
          const before = (hitY - oh) / t.doValue - hitY / t.fo;
          const eyeY = t.imageHeight + before * t.do2, after = before - eyeY / t.fe, endX = view.right - 2;
          out.push(<g key={`r${i}`}><Ray a={{ x: objX, y: oh }} b={{ x: 0, y: hitY }} ink={i === 1 ? 'center' : 'in'} /><Ray a={{ x: 0, y: hitY }} b={{ x: t.di1, y: t.imageHeight }} ink="out" />
            <Ray a={{ x: t.di1, y: t.imageHeight }} b={{ x: t.sep, y: eyeY }} ink="out" /><Ray a={{ x: t.sep, y: eyeY }} b={{ x: endX, y: eyeY + after * (endX - t.sep) }} ink="final" />
            {showAnswer && t.di2 < 0 && t.finalX > view.left && <Ray a={{ x: t.finalX, y: t.imageHeight * t.m2 }} b={{ x: t.sep, y: eyeY }} ink="muted" dash head={false} width={0.2} />}</g>);
        });
        if (showAnswer) {
          const finalH = t.imageHeight * t.m2;
          out.push(<g key="img1"><Arrow x={t.di1} h={t.imageHeight} ink="real" /><Label x={t.di1} y={t.imageHeight - 2.2} tone="real">중간 상 실상·도립</Label></g>);
          out.push(!t.infinite && t.finalX > view.left + 2 && t.finalX < view.right - 2 && Math.abs(finalH) < view.top - 3
            ? <g key="img2"><Arrow x={t.finalX} h={finalH} ink={t.di2 > 0 ? 'real' : 'virtual'} dash={t.di2 <= 0} /><Label x={t.finalX} y={finalH + (finalH >= 0 ? 2.2 : -2.2)} tone={t.di2 > 0 ? 'real' : 'virtual'}>{`최종 상 ${t.di2 > 0 ? '실상' : '허상'}·${t.totalM > 0 ? '정립' : '도립'}`}</Label></g>
            : <Label key="img2" x={t.sep - 4} y={-15.5} tone="warn">{t.infinite ? '나간 광선이 평행: 최종 상은 무한원' : '최종 상은 작도판 밖에 생김'}</Label>);
        }
      } else {
        const slope = -Math.tan(t.theta), startX = view.left + 2;
        if (showRays) [8, -4].forEach((hitY, i) => {
          const eyeY = t.imageHeight + (t.imageHeight - hitY) * t.fe / t.fo, outSlope = -t.imageHeight / t.fe;
          out.push(<g key={`r${i}`}><Ray a={{ x: startX, y: hitY + slope * startX }} b={{ x: 0, y: hitY }} /><Ray a={{ x: 0, y: hitY }} b={{ x: t.fo, y: t.imageHeight }} ink="out" />
            <Ray a={{ x: t.fo, y: t.imageHeight }} b={{ x: t.sep, y: eyeY }} ink="out" /><Ray a={{ x: t.sep, y: eyeY }} b={{ x: view.right - 2, y: eyeY + outSlope * (view.right - 2 - t.sep) }} ink="final" /></g>);
        });
        if (showAnswer) out.push(<g key="img"><Arrow x={t.fo} h={t.imageHeight} ink="real" /><Label x={t.fo} y={t.imageHeight - 2.2} tone="real">중간 상 실상·도립</Label><Label x={t.sep + 5.8} y={-12} tone="warn">최종 상은 확대된 허상으로 보임</Label></g>);
        out.push(<Label key="far" x={view.left + 12} y={12} tone="info">{showRays ? '멀리 있는 물체의 평행 광선' : `먼 물체 입사 방향 ${dev.telAngle}도`}</Label>);
      }
    } else if (device === 'microscope') {
      const m = micro, objX = -m.doValue, oh = 4.5, ih = m.m1 * oh, finalX = m.sep + m.di2, finalH = ih * m.m2;
      out.push(deviceLens(0, '대물렌즈', m.fo, 'convex'), deviceLens(m.sep, '접안렌즈', m.fe, 'eye'));
      out.push(<g key="obj"><Arrow x={objX} h={oh} ink="object" /><Label x={objX} y={oh + 2}>작은 물체</Label></g>);
      if (showRays) [oh, 0, -oh * 0.35].forEach((y, i) => {
        const eyeY = y + (ih - y) * m.sep / m.di1, slope = (ih - y) / m.di1 - eyeY / m.fe, endX = view.right - 2;
        out.push(<g key={`r${i}`}><Ray a={{ x: objX, y: oh }} b={{ x: 0, y }} ink={i === 1 ? 'center' : 'in'} /><Ray a={{ x: 0, y }} b={{ x: m.di1, y: ih }} ink="out" />
          <Ray a={{ x: m.di1, y: ih }} b={{ x: m.sep, y: eyeY }} ink="out" /><Ray a={{ x: m.sep, y: eyeY }} b={{ x: endX, y: eyeY + slope * (endX - m.sep) }} ink="final" />
          {showAnswer && m.di2 < 0 && Number.isFinite(finalX) && <Ray a={{ x: finalX, y: finalH }} b={{ x: m.sep, y: eyeY }} ink="muted" dash head={false} width={0.2} />}</g>);
      });
      if (showAnswer) {
        out.push(<g key="img1"><Arrow x={m.di1} h={ih} ink="real" /><Label x={m.di1} y={ih - 2.2} tone="real">중간 상 실상·도립</Label></g>);
        out.push(Number.isFinite(finalX) && finalX > view.left && finalX < view.right
          ? <g key="img2"><Arrow x={finalX} h={finalH} ink={m.di2 > 0 ? 'real' : 'virtual'} dash={m.di2 <= 0} /><Label x={finalX} y={finalH + (finalH >= 0 ? 2.2 : -2.2)} tone={m.di2 > 0 ? 'real' : 'virtual'}>{`최종 상 ${m.di2 > 0 ? '실상' : '허상'}·${m.totalM > 0 ? '정립' : '도립'}`}</Label></g>
          : <Label key="img2" x={m.sep - 5} y={-14} tone="warn">최종 상은 작도판 밖에 생김</Label>);
      }
    } else {
      const tri = [{ x: -8, y: -11 }, { x: 10, y: -11 }, { x: 10, y: 10 }];
      const hit1 = { x: -3, y: 3 }, hit2 = { x: 6.5, y: -6.5 };
      out.push(<g key="prism"><path d={`M${tri.map(p => `${p.x} ${-p.y}`).join('L')}Z`} className="optics-lens convex" /><Label x={3.8} y={-13.5}>유리 프리즘</Label>
        <Ray a={{ x: -14, y: 3 }} b={hit1} width={0.4} /><Ray a={hit1} b={hit2} width={0.4} />
        <Ray a={{ x: hit2.x - 5, y: hit2.y + 5 }} b={{ x: hit2.x + 5, y: hit2.y - 5 }} ink="muted" dash head={false} width={0.18} />
        <Label x={hit2.x - 3.6} y={hit2.y + 4.4}>{`입사각 ${dev.prismAngle.toFixed(0)}도`}</Label><Label x={-13} y={-13} tone="info">{`임계각 ${prism.critical.toFixed(1)}도`}</Label>
        {prism.totalReflection ? <><Ray a={hit2} b={{ x: 0.8, y: -12.2 }} ink="out" width={0.42} /><Label x={1.7} y={-8.9} tone="warn">전반사</Label></>
          : <><Ray a={hit2} b={{ x: 15.5, y: -11.5 }} ink="final" width={0.42} /><Label x={15.5} y={-8.8} tone="warn">일부 굴절</Label></>}</g>);
    }
    return out;
  };

  const strokeLayer = <g className="optics-strokes">
    {strokes.map((s, i) => <line key={i} x1={s.a.x} y1={-s.a.y} x2={s.b.x} y2={-s.b.y} className={`ink-${s.mark ?? 'ink'}`} strokeWidth={0.36} strokeLinecap="round" />)}
    {drawing && <line x1={drawing[0].x} y1={-drawing[0].y} x2={drawing[1].x} y2={-drawing[1].y} className="ink-ink" strokeWidth={0.36} strokeLinecap="round" />}
    {drawing && single && plan.snaps.filter(p => Math.hypot(p.x - drawing[1].x, p.y - drawing[1].y) < 1e-6 || Math.hypot(p.x - drawing[0].x, p.y - drawing[0].y) < 1e-6).map((p, i) => <circle key={i} cx={p.x} cy={-p.y} r={0.9} className="optics-snap" />)}
  </g>;

  // ── 판정 · 스크린 · 가이드 패널 ──
  const metrics: [string, string][] = single
    ? image.infinite ? [['상 종류', '매우 먼 곳'], ['방향', '판정 불가'], ['상 위치', '무한대'], ['배율', '매우 큼']]
      : [['상 종류', image.real ? '실상' : '허상'], ['방향', image.upright ? '정립' : '도립'], ['상 위치', `${fmtCm(Math.abs(image.b))} ${isLens(kind) ? (image.b > 0 ? '렌즈 뒤' : '렌즈 앞') : (image.b > 0 ? '거울 앞' : '거울 뒤')}`], ['배율', `${Math.abs(image.m).toFixed(2)}배 ${image.enlarged ? '확대' : '축소'}`]]
    : device === 'telescope' ? tele.distant ? [['중간 상', '실상·도립'], ['렌즈 사이', fmtCm(tele.sep)], ['각배율', `${Math.abs(tele.angularMag).toFixed(1)}배`], ['최종 상', '허상·도립']]
      : [['중간 상 위치', `${fmtCm(tele.di1)} · 도립 실상`], ['렌즈 사이 거리', fmtCm(tele.sep)], ['최종 상', tele.infinite ? '무한원' : `${tele.di2 > 0 ? '실상' : '허상'}·${tele.totalM > 0 ? '정립' : '도립'}`], ['크기 배율', tele.infinite ? '판정 불가' : `${Math.abs(tele.totalM).toFixed(2)}배`]]
    : device === 'microscope' ? [['중간 상', '실상·도립'], ['중간 상 위치', fmtCm(micro.di1)], ['총 배율', `${Math.abs(micro.totalM).toFixed(1)}배`], ['최종 상', `${micro.di2 > 0 ? '실상' : '허상'}·${micro.totalM > 0 ? '정립' : '도립'}·${Math.abs(micro.totalM) >= 1 ? '확대' : '축소'}`]]
    : [['임계각', `${prism.critical.toFixed(1)}도`], ['현재 입사각', `${dev.prismAngle.toFixed(0)}도`], ['판정', prism.totalReflection ? '전반사' : '굴절 발생'], ['역할', '빛 경로 바꾸기']];
  const hidden = guide.on && !finished; // 가이드 중에는 정답 판정을 가린다
  const screenScale = 18 / h; // 스크린 그림: 물체 높이를 18칸으로 두고 상의 크기를 비교한다

  return <main className="swipe-app biology-app optics-app"><div className="biology-study">
    <header className="biology-header glass"><button type="button" className="glass-button" onClick={back}>← 실험 선택</button><h1>양동비T · {info.title}</h1></header>
    <section className="biology-menu glass optics-panel">
      <div className="optics-tabs" role="group" aria-label="실험 고르기">{tabs.map(t => <button key={t} type="button" className="glass-button" aria-pressed={current === t}
        onClick={() => { if (single) openSingle(t as SingleKind); else { setDevice(t as Device); clearDrawing(); } }}><strong>{INFO[t].title}</strong><small>{INFO[t].summary}</small></button>)}</div>
      <div className="optics-toolbar">
        <div role="group" aria-label="도구">{(['move', 'pencil', 'eraser'] as Tool[]).map(t => <button key={t} type="button" className="glass-button optics-toggle" aria-pressed={tool === t} onClick={() => { setDrawing(null); drag.current = null; setTool(t); }}>{t === 'move' ? '이동' : t === 'pencil' ? '선분 작도' : '지우개'}</button>)}
          <button type="button" className="glass-button optics-toggle" disabled={!undo.length} onClick={undoOnce} aria-label="되돌리기">↶</button><button type="button" className="glass-button optics-toggle" disabled={!redo.length} onClick={redoOnce} aria-label="다시 실행">↷</button>
          <button type="button" className="glass-button optics-toggle" disabled={!strokes.length} onClick={() => commit([])}>전체 지우기</button></div>
        <div role="group" aria-label="보기">{toggle('정답', showAnswer, setShowAnswer, hidden)}{toggle('광선', showRays, setShowRays, hidden)}{toggle('F, 2F', showMarks, setShowMarks)}{single && toggle('스크린', screenOn, setScreenOn)}</div>
      </div>
      <Board view={view} svgRef={svg} label={`${info.title} 광선 작도판`} cursor={tool === 'move' ? 'default' : 'crosshair'} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp}>
        {single ? singleBoard() : deviceBoard()}{strokeLayer}
      </Board>
      <p className="optics-hint">{tool === 'pencil' ? (single ? '선을 그으면 물체 끝 · 렌즈 · 초점 같은 기준점에 끝이 붙어요.' : '두 점을 이어 선분을 그려요.') : tool === 'eraser' ? '지울 선분을 눌러요.' : single ? '물체(검은 화살표)나 스크린을 끌어서 옮겨요. 물체를 누르고 ← →로도 옮길 수 있어요.' : device === 'prism' ? '입사각이 임계각보다 커질 때 전반사로 바뀌는 지점을 찾아요.' : '물체를 끌거나 아래 막대로 거리를 바꿔요.'} · 격자 한 칸 = 5 cm</p>
    </section>

    <div className="optics-grid-panels">
      <section className="biology-menu glass optics-panel">
        <h2>상의 판정</h2>
        {hidden ? <p className="optics-hidden">작도 가이드를 마치면 보여 줘요.</p> : <dl className="optics-metrics">{metrics.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>}
        {single && isLens(kind) && !hidden && <div className="optics-equation"><h3>렌즈 방정식으로 확인</h3><p className="formula">1/f = 1/a + 1/b</p>
          <p>f: 초점 거리 · a: 물체 거리 · b: 상 거리 (렌즈 중심 기준)</p>
          <p className="working">1/b = 1/({num(image.f)}) − 1/({num(image.d)}) (cm⁻¹)</p>
          <p className="working">{image.infinite ? 'a = f: 나간 광선이 평행 → 유한한 곳에 상이 맺히지 않음' : `b = ${num(image.b)} cm · m = −b/a = ${num(image.m)} (${image.real ? '실상' : '허상'}·${image.upright ? '정립' : '도립'})`}</p>
          <p className="sign-note">볼록 f &gt; 0, 오목 f &lt; 0 · 실상 b &gt; 0, 허상 b &lt; 0 · 배율 m = −b/a (음수: 도립, 양수: 정립)</p></div>}
        {single ? <>
          {slider('초점 거리', f, 5, 22, 1, ' cm', v => setSingle({ f: v }))}
          {slider('물체 거리', d, 4, 42, 0.5, ' cm', v => setSingle({ d: v }))}
          {slider('물체 높이', h, 3, 13, 0.5, ' cm', v => setSingle({ h: v }))}
          {screenOn && slider(isLens(kind) ? '스크린 위치 (렌즈 뒤)' : '스크린 위치 (거울 앞)', screenS, 2, 44, 0.5, ' cm', setScreenS)}
        </> : device === 'telescope' ? <>
          <div className="optics-tabs small" role="group" aria-label="물체 거리"><button type="button" className="glass-button" aria-pressed={dev.telDistant} onClick={() => setDev(v => ({ ...v, telDistant: true }))}>먼 물체 (평행광)</button><button type="button" className="glass-button" aria-pressed={!dev.telDistant} onClick={() => setDev(v => ({ ...v, telDistant: false }))}>가까운 물체</button></div>
          {slider('대물렌즈 초점 거리', dev.telFo, 12, 26, 1, ' cm', v => setDev(s => ({ ...s, telFo: v, telDo: clamp(s.telDo, 2 * v, 5 * v) })))}
          {slider('접안렌즈 초점 거리', dev.telFe, 4, 12, 1, ' cm', v => setDev(s => ({ ...s, telFe: v, telGap: clamp(s.telGap, 2, v + 4) })))}
          {dev.telDistant ? slider('먼 물체 각도', dev.telAngle, 2, 10, 0.5, '도', v => setDev(s => ({ ...s, telAngle: v })))
            : <>{slider('물체와 대물렌즈 거리', dev.telDo, 2 * dev.telFo, 5 * dev.telFo, 0.5, ' cm', v => setDev(s => ({ ...s, telDo: v })))}
              {slider('중간 상과 접안렌즈 거리', dev.telGap, 2, dev.telFe + 4, 0.5, ' cm', v => setDev(s => ({ ...s, telGap: v })))}
              <p className="biology-note">물체를 움직이면 접안렌즈도 함께 움직여 위 간격을 유지해요. 간격 = 접안렌즈 초점 거리이면 최종 상은 무한원이에요.</p></>}
        </> : device === 'microscope' ? <>
          {slider('대물렌즈 초점 거리', dev.micFo, 3, 8, 0.5, ' cm', v => setDev(s => { const b = microscopeBounds(v, s.micTube); return { ...s, micFo: v, micDo: Math.round(clamp(s.micDo, b.min, b.max) * 10) / 10 }; }))}
          {slider('물체와 대물렌즈 거리', dev.micDo, microscopeBounds(dev.micFo, dev.micTube).min, microscopeBounds(dev.micFo, dev.micTube).max, 0.1, ' cm', v => setDev(s => ({ ...s, micDo: v })))}
          {slider('렌즈 사이 거리', dev.micTube, 22, 36, 1, ' cm', v => setDev(s => { const b = microscopeBounds(s.micFo, v); return { ...s, micTube: v, micDo: Math.round(clamp(s.micDo, b.min, b.max) * 10) / 10 }; }))}
        </> : <>
          {slider('프리즘 굴절률', dev.prismN, 1.3, 1.8, 0.01, '', v => setDev(s => ({ ...s, prismN: v })))}
          {slider('내부 입사각', dev.prismAngle, 25, 65, 1, '도', v => setDev(s => ({ ...s, prismAngle: v })))}
        </>}
        <button type="button" className="glass-button" onClick={() => { if (single) openSingle(kind); else { setDev(DEVICE_DEFAULTS); clearDrawing(); } }}>처음값으로</button>
      </section>

      {single && <section className="biology-menu glass optics-panel">
        <h2>스크린에 비친 모습</h2>
        {!screenOn ? <p>스크린을 켜면 상이 맺히는 모습을 볼 수 있어요.</p> : hidden ? <p className="optics-hidden">작도 가이드를 마치면 보여 줘요.</p> : <>
          <svg className={`optics-screenview ${screen.formed ? 'lit' : ''}`} viewBox="0 0 100 75" role="img" aria-label={screen.formed ? `스크린의 상: ${screen.sharp ? '또렷함' : '흐림'}` : '스크린에 상이 맺히지 않음'}>
            <rect x={0} y={0} width={100} height={75} rx={5} className="screen-bg" />
            {screen.formed ? <Glyph size={screen.size} blur={screen.blur} scale={screenScale} /> : <circle cx={50} cy={37.5} r={32} className="screen-wash" />}
          </svg>
          <p role="status" className={screen.sharp ? 'optics-good' : ''}>{screen.reason}{screen.move && ` 스크린을 ${isLens(kind) ? '렌즈' : '거울'}에서 ${screen.move === 'away' ? '멀리' : '가까이'} 옮겨 보세요.`}</p>
          {screen.formed && <p className="biology-note">흐림 원 지름 {screen.blur.toFixed(1)} cm · 실상은 스크린에서 위아래 · 좌우가 모두 뒤집혀 보여요.</p>}
          {!image.real && !image.infinite && <><h3>{isLens(kind) ? '렌즈를 통해 눈으로 보면' : '거울을 눈으로 보면'}</h3>
            <svg className="optics-screenview eye" viewBox="0 0 100 75" role="img" aria-label="눈으로 본 허상"><rect x={0} y={0} width={100} height={75} rx={5} className="screen-bg eye" /><Glyph size={image.y} blur={0} scale={screenScale} /></svg>
            <p className="biology-note">허상은 바로 서 있고 {image.enlarged ? '물체보다 커' : '물체보다 작아'} 보여요({Math.abs(image.m).toFixed(2)}배).</p></>}
          <p className="biology-note">흐림은 렌즈 반지름을 {APERTURE} cm로 본 수업용 모형이에요.</p>
        </>}
      </section>}

      {single && <section className="biology-menu glass optics-panel">
        <h2>작도 가이드</h2>
        {!guide.on ? <>
          <p>정답과 광선을 가리고, 상을 찾는 광선을 한 단계씩 그려요. 그린 선은 바로 채점돼요.</p>
          {plan.note ? <p role="status">{plan.note}</p> : <button type="button" className="glass-button" onClick={startGuide}>작도 가이드 시작</button>}
        </> : <>
          {plan.note ? <p role="status">{plan.note}</p> : <ol className="optics-steps">{plan.steps.map((s, i) => <li key={s.id} className={i < guide.index ? 'done' : i === guide.index ? 'now' : ''} aria-current={i === guide.index ? 'step' : undefined}>
            <strong>{i < guide.index ? '✓ ' : ''}{s.title}</strong>{i === guide.index && <span>{s.hint}</span>}</li>)}</ol>}
          <p role="status" className={finished ? 'optics-good' : ''}>{guide.message}</p>
          <div className="optics-actions">
            {step && <button type="button" className="glass-button" aria-pressed={guide.hint} onClick={() => setGuide(g => ({ ...g, hint: !g.hint }))}>{guide.hint ? '힌트 숨기기' : '힌트 보기'}</button>}
            {step && <button type="button" className="glass-button" onClick={showStep}>이 단계 보여 주기</button>}
            {finished && <button type="button" className="glass-button" onClick={startGuide}>다시 그리기</button>}
            <button type="button" className="glass-button" onClick={stopGuide}>가이드 끝내기</button>
          </div>
          <p className="biology-note">{tool === 'pencil' ? '선분 작도 도구로 그려요.' : '선분 작도 도구를 골라야 그릴 수 있어요.'} 틀린 선은 빨갛게 남아요. 지우개나 ↶로 지울 수 있어요.</p>
        </>}
      </section>}

      <section className="biology-menu glass optics-panel">
        <h2>수업 핵심</h2><ul>{info.concept.map(c => <li key={c}>{c}</li>)}</ul>
        <h2>해 볼 것</h2><ul>{info.activity.map(c => <li key={c}>{c}</li>)}</ul>
        <div className="optics-legend"><span className="lg in">입사 광선</span><span className="lg out">굴절·반사 광선</span><span className="lg real">실상</span><span className="lg virtual">허상</span><span className="lg dash">연장선</span></div>
      </section>
    </div>
  </div></main>;
}
