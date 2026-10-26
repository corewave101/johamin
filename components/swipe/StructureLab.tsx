// 주민지T 「Ⅲ. 탄소 화합물과 반응」 구조식 실습: 골격 구조식 보고 이름 맞히기 · 이름 보고 구조식 그리기 · 자유 그리기.
// 화학 로직(이름 붙이기 · 같은 분자 판정 · 그림 좌표)은 lib/structure.ts.
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent } from 'react';
import type { Direction } from '../../data/swipe-cards';
import { arrows, directionOf, directions, isTyping, keyDirections, SWIPE_DISTANCE } from '../../lib/directions';
import { playResult, playTick } from '../../lib/sound';
import {
  CATEGORY_LABEL, carbonCount, explain, formula, makePuzzle, nameChoices, nameOf, sameMolecule, skeleton,
  type Category, type El, type Mol, type Order, type Puzzle,
} from '../../lib/structure';
import MenuCard from './MenuCard';

type Page = 'menu' | 'name' | 'draw' | 'free';
const CATEGORIES: Category[] = ['alkane', 'cyclo', 'alkene', 'alkyne', 'alcohol'];
const RANGE_KEY = 'johamin-structure-range-v1';
const LEVEL_KEY = 'johamin-structure-level-v1';
type Level = 'basic' | 'hard';
const loadLevel = (): Level => { try { return localStorage.getItem(LEVEL_KEY) === 'hard' ? 'hard' : 'basic'; } catch { return 'basic'; } };

function loadRange(): Category[] {
  try {
    const saved = JSON.parse(localStorage.getItem(RANGE_KEY) ?? 'null');
    if (Array.isArray(saved)) { const list = saved.filter((c): c is Category => CATEGORIES.includes(c)); if (list.length) return list; }
  } catch { /* default range */ }
  return [...CATEGORIES];
}

/** 골격 구조식 그림. numbers를 주면 주사슬(고리) 번호를 원자 옆에 붙인다. */
export function MoleculeSvg({ mol, numbers, label, className = '' }: { mol: Mol; numbers?: number[]; label: string; className?: string }) {
  const { strokes, labels, box } = skeleton(mol);
  const pad = 0.75;
  const w = Math.max(box.maxX - box.minX + pad * 2, 3), h = Math.max(box.maxY - box.minY + pad * 2, 2.2);
  const cx = (box.minX + box.maxX) / 2, cy = (box.minY + box.maxY) / 2;
  const center = { x: mol.atoms.reduce((s, a) => s + a.x, 0) / mol.atoms.length, y: mol.atoms.reduce((s, a) => s + a.y, 0) / mol.atoms.length };
  const tag = (atom: number) => {
    const a = mol.atoms[atom];
    const nb = mol.bonds.filter(b => b.a === atom || b.b === atom).map(b => mol.atoms[b.a === atom ? b.b : b.a]);
    let dx = nb.reduce((s, t) => s + a.x - t.x, 0), dy = nb.reduce((s, t) => s + a.y - t.y, 0);
    if (Math.hypot(dx, dy) < 0.3 && nb.length === 2) { dx = -(nb[1].y - nb[0].y); dy = nb[1].x - nb[0].x; if (dy < 0) { dx = -dx; dy = -dy; } } // 일직선(삼중 결합): 위쪽에
    if (Math.hypot(dx, dy) < 0.3) { dx = a.x - center.x; dy = a.y - center.y; }
    if (Math.hypot(dx, dy) < 0.1) { dx = 0; dy = 1; }
    const l = Math.hypot(dx, dy);
    return { x: a.x + dx / l * 0.42, y: a.y + dy / l * 0.42 };
  };
  return <svg className={`structure-svg ${className}`} style={{ maxWidth: `${Math.round(w * 62)}px` }} viewBox={`${cx - w / 2} ${-cy - h / 2} ${w} ${h}`} role="img" aria-label={label}>
    {strokes.map((s, i) => <line key={i} x1={s.x1} y1={-s.y1} x2={s.x2} y2={-s.y2} className={`structure-bond ${s.kind}`} />)}
    {labels.map((l, i) => <g key={i}><rect x={l.x - 0.36} y={-l.y - 0.26} width={0.72} height={0.52} rx={0.12} className="structure-label-bg" /><text x={l.x} y={-l.y} className="structure-label">{l.text}</text></g>)}
    {numbers?.map((atom, i) => { const p = tag(atom); return <g key={`n${i}`} className="structure-number"><circle cx={p.x} cy={-p.y} r={0.2} /><text x={p.x} y={-p.y}>{i + 1}</text></g>; })}
  </svg>;
}

export default function StructureLab({ onBack }: { onBack: () => void }) {
  const [page, setPage] = useState<Page>('menu');
  const [range, setRange] = useState<Category[]>(loadRange);
  const [level, setLevel] = useState<Level>(loadLevel);
  useEffect(() => { try { localStorage.setItem(RANGE_KEY, JSON.stringify(range)); localStorage.setItem(LEVEL_KEY, level); } catch { /* not saved */ } }, [range, level]);
  const toMenu = useCallback(() => { playTick(); setPage('menu'); }, []);
  if (page === 'menu') return <MenuCard topic="주민지T · 구조식 실습" question="무엇을 해 볼까요?"
    up={{ label: '이름 맞히기', note: '골격 구조식 → 이름', onChoose: () => setPage('name') }}
    left={{ label: '구조식 그리기', note: '이름 → 그림판에 그리기', onChoose: () => setPage('draw') }}
    right={{ label: '자유 그리기', note: '그리면 이름을 알려 줘요', onChoose: () => setPage('free') }}
    onBack={onBack} backLabel="학습 메뉴">
    <p className="structure-menu-note glass">H는 그리지 않는 골격 구조식이에요. 꺾이는 점과 끝점이 탄소예요.</p>
  </MenuCard>;
  const rangeBar = page === 'free' ? null : <div className="structure-filters">
    <div className="structure-level" role="group" aria-label="난이도">{(['basic', 'hard'] as Level[]).map(l => <button key={l} type="button" className={`glass-button${l === 'hard' ? ' is-hard' : ''}`} aria-pressed={level === l} onClick={() => setLevel(l)}>{l === 'basic' ? '기본' : '🔥 고난도'}</button>)}</div>
    <div className="structure-range" role="group" aria-label="범위">{CATEGORIES.map(c => <button key={c} type="button" className="glass-button" aria-pressed={range.includes(c)}
      onClick={() => setRange(r => r.includes(c) ? (r.length > 1 ? r.filter(x => x !== c) : r) : [...r, c])}>{CATEGORY_LABEL[c]}</button>)}</div>
  </div>;
  const hard = level === 'hard';
  return <main className="swipe-app biology-app structure-app"><div className="biology-study">
    <header className="biology-header glass"><button type="button" className="glass-button" onClick={toMenu}>← 구조식 실습</button><h1>{page === 'name' ? '이름 맞히기' : page === 'draw' ? '구조식 그리기' : '자유 그리기'}</h1></header>
    {page === 'name' ? <NameQuiz key={`${level}-${range.join()}`} range={range} hard={hard} rangeBar={rangeBar} />
      : <DrawPractice key={`${page}-${level}-${range.join()}`} free={page === 'free'} range={range} hard={hard} rangeBar={rangeBar} />}
  </div></main>;
}

// ── 이름 맞히기: 네 방향 보기(방향키 = 밀기 = 누르기) ─────────────────────────────
function NameQuiz({ range, hard, rangeBar }: { range: Category[]; hard: boolean; rangeBar: React.ReactNode }) {
  const next = useCallback(() => { const p = makePuzzle(range, Math.random, { minCarbons: 2, hard }); return { puzzle: p, choices: nameChoices(p) }; }, [range, hard]);
  const [round, setRound] = useState(next);
  const [picked, setPicked] = useState<Direction | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const slots = useMemo(() => Object.fromEntries(directions.map((d, i) => [d, round.choices[i]])) as Record<Direction, string>, [round]);
  const answer = directions.find(d => slots[d] === round.puzzle.name)!;
  const choose = useCallback((d: Direction) => {
    if (picked) { setPicked(null); setRound(next()); playTick(); return; }
    if (!slots[d]) return;
    const ok = d === answer;
    setPicked(d);
    setScore(s => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
    playResult(ok);
  }, [picked, slots, answer, next]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event)) return;
      if (picked && (event.key === 'Enter' || event.code === 'Space')) { event.preventDefault(); choose('up'); return; }
      const d = keyDirections[event.key];
      if (!d) return;
      event.preventDefault();
      if (!event.repeat) choose(d);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, picked]);
  const release = (event: PointerEvent<HTMLElement>) => {
    if (!pointer.current || pointer.current.id !== event.pointerId) return;
    const dx = event.clientX - pointer.current.x, dy = event.clientY - pointer.current.y;
    pointer.current = null; setDrag({ x: 0, y: 0 });
    if (Math.hypot(dx, dy) >= SWIPE_DISTANCE) choose(directionOf(dx, dy));
    else if (picked) choose('up');
  };
  const p = round.puzzle;
  return <section className="biology-menu glass structure-panel">
    <div className="structure-top">{rangeBar}<p className="structure-score">맞힌 문제 <b>{score.right}</b> / {score.total}</p></div>
    <div className={`structure-quiz${hard ? ' is-hard' : ''}`}>
      {directions.map(d => <button key={d} type="button" className={`structure-choice choice-${d}${picked ? (d === answer ? ' is-right' : d === picked ? ' is-wrong' : ' is-dim') : ''}`} onClick={() => choose(d)} disabled={!slots[d]}>
        <kbd>{arrows[d]}</kbd><span>{slots[d]}</span></button>)}
      <div className="structure-card" style={{ transform: `translate(${drag.x * 0.35}px, ${drag.y * 0.35}px) rotate(${drag.x * 0.02}deg)` }}
        onPointerDown={event => { pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }}
        onPointerMove={event => { if (pointer.current?.id === event.pointerId) setDrag({ x: event.clientX - pointer.current.x, y: event.clientY - pointer.current.y }); }}
        onPointerUp={release} onPointerCancel={() => { pointer.current = null; setDrag({ x: 0, y: 0 }); }}>
        <p className="structure-ask">이 화합물의 이름은?</p>
        <MoleculeSvg mol={p.mol} numbers={picked ? p.plan.parent : undefined} label={picked ? `${p.name}의 골격 구조식` : '이름을 맞힐 골격 구조식'} />
        <p className="structure-formula">{formula(p.mol)}</p>
      </div>
    </div>
    {picked ? <div className={`structure-result ${picked === answer ? 'is-right' : 'is-wrong'}`} role="status">
      <h2>{picked === answer ? '정답이에요!' : '아쉬워요'} · {p.name}</h2>
      <ul>{explain(p.plan).map((line, i) => <li key={i}>{line}</li>)}</ul>
      {p.page && <p className="structure-source">주민지T {p.page}에 나온 화합물이에요.</p>}
      <button type="button" className="glass-button is-primary" onClick={() => choose('up')} autoFocus>다음 문제 →</button>
    </div> : <p className="structure-hint">방향키, 카드 밀기, 보기 누르기 모두 돼요.</p>}
  </section>;
}

// ── 구조식 그리기: 위에서 원자 · 결합을 고르고, 그림판에 툭 누르면 그 자리에 생긴다 ─────────────────
const UNIT = 44; // 그림판 px → 분자 단위(결합 하나 ≈ 44px). 시스 · 트랜스 판정에 쓴다.
const HIT_ATOM = 20, HIT_BOND = 11;
const REACH_PX = UNIT * 1.9; // 고른 원자에서 이만큼 안쪽을 누르면 이어지고, 더 멀면 따로 시작한다
type Tool = 'C' | 'O' | 'Cl' | 'Br' | 1 | 2 | 3 | 'move' | 'erase';
const ATOM_TOOLS: Tool[] = ['C', 'O', 'Cl', 'Br'];
const BOND_TOOLS: Tool[] = [1, 2, 3];
const TOOL_LABEL: Record<string, string> = { C: '탄소', O: 'OH', Cl: 'Cl', Br: 'Br', 1: '단일 C–C', 2: '이중 C=C', 3: '삼중 C≡C', move: '✥ 옮기기', erase: '지우개' };
const isAtomTool = (t: Tool): t is El => t === 'C' || t === 'O' || t === 'Cl' || t === 'Br';
const isBondTool = (t: Tool): t is Order => t === 1 || t === 2 || t === 3;
interface CAtom { id: number; el: El; x: number; y: number }
interface CBond { a: number; b: number; order: Order }
interface Drawing { atoms: CAtom[]; bonds: CBond[] }
const EMPTY: Drawing = { atoms: [], bonds: [] };

function drawingToMol(d: Drawing): Mol {
  const index = new Map(d.atoms.map((a, i) => [a.id, i]));
  return { atoms: d.atoms.map(a => ({ el: a.el, x: a.x / UNIT, y: -a.y / UNIT })), bonds: d.bonds.map(b => ({ a: index.get(b.a)!, b: index.get(b.b)!, order: b.order })) };
}
const segmentDistance = (p: { x: number; y: number }, a: CAtom, b: CAtom) => {
  const vx = b.x - a.x, vy = b.y - a.y, len2 = vx * vx + vy * vy || 1;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * vx + (p.y - a.y) * vy) / len2));
  return Math.hypot(p.x - (a.x + vx * t), p.y - (a.y + vy * t));
};

function DrawPractice({ free, range, hard, rangeBar }: { free: boolean; range: Category[]; hard: boolean; rangeBar: React.ReactNode }) {
  const newTarget = useCallback(() => makePuzzle(range, Math.random, { minCarbons: 2, hard }), [range, hard]);
  const [target, setTarget] = useState<Puzzle>(newTarget);
  const [drawing, setDrawing] = useState<Drawing>(EMPTY);
  const [history, setHistory] = useState<Drawing[]>([]);
  const [tool, setTool] = useState<Tool>('C');
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<{ ok: boolean; lines: string[] } | null>(null);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const [size, setSize] = useState({ w: 800, h: 460 });
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const nextId = useRef(1);
  const press = useRef<{ id: number; start: { x: number; y: number }; atom: number | null; moved: boolean; before: Drawing } | null>(null);

  // 그림판 크기 = 화면에 보이는 크기(px). 좁은 폰에서는 조금 낮게.
  useEffect(() => {
    const el = svg.current;
    if (!el) return;
    const fit = () => { const w = Math.max(280, Math.round(el.clientWidth)); setSize({ w, h: w < 560 ? Math.round(w * 1.05) : 460 }); };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const atomAt = (p: { x: number; y: number }, list = drawing.atoms) => {
    let best: CAtom | null = null, dist = HIT_ATOM;
    for (const a of list) { const d = Math.hypot(a.x - p.x, a.y - p.y); if (d < dist) { dist = d; best = a; } }
    return best;
  };
  const bondAt = (p: { x: number; y: number }) => {
    const byId = new Map(drawing.atoms.map(a => [a.id, a]));
    let best = -1, dist = HIT_BOND;
    drawing.bonds.forEach((b, i) => { const d = segmentDistance(p, byId.get(b.a)!, byId.get(b.b)!); if (d < dist) { dist = d; best = i; } });
    return best;
  };
  const commit = (next: Drawing, before = drawing) => { setHistory(h => [...h.slice(-60), before]); setDrawing(next); setResult(null); };
  const undo = () => { const last = history.at(-1); if (!last) return; setHistory(h => h.slice(0, -1)); setDrawing(last); setSelected(null); setResult(null); };
  const clear = () => { if (drawing.atoms.length) commit(EMPTY); setSelected(null); };
  const place = (d: Drawing, el: El, p: { x: number; y: number }) => {
    const atom = { id: nextId.current++, el, x: Math.max(14, Math.min(size.w - 14, p.x)), y: Math.max(14, Math.min(size.h - 14, p.y)) };
    return { drawing: { ...d, atoms: [...d.atoms, atom] }, atom };
  };
  const bond = (d: Drawing, a: number, b: number, order: Order, overwrite: boolean): Drawing => {
    if (a === b) return d;
    const i = d.bonds.findIndex(x => (x.a === a && x.b === b) || (x.a === b && x.b === a));
    if (i < 0) return { ...d, bonds: [...d.bonds, { a, b, order }] };
    return overwrite ? { ...d, bonds: d.bonds.map((x, j) => (j === i ? { ...x, order } : x)) } : d;
  };
  const removeAtom = (d: Drawing, id: number): Drawing => ({ atoms: d.atoms.filter(a => a.id !== id), bonds: d.bonds.filter(b => b.a !== id && b.b !== id) });

  /** 그림판을 한 번 툭 눌렀을 때(마우스 · 손가락 · Enter 모두 여기로). */
  const tap = (p: { x: number; y: number }) => {
    const hit = atomAt(p);
    if (tool === 'erase') {
      if (hit) { commit(removeAtom(drawing, hit.id)); setSelected(null); return; }
      const bi = bondAt(p);
      if (bi >= 0) commit({ ...drawing, bonds: drawing.bonds.filter((_, i) => i !== bi) });
      return;
    }
    if (tool === 'move') { setSelected(hit ? hit.id : null); return; }
    if (isBondTool(tool)) {
      if (hit) {
        if (selected !== null && selected !== hit.id && drawing.atoms.some(a => a.id === selected)) { commit(bond(drawing, selected, hit.id, tool, true)); setSelected(null); playTick(); }
        else setSelected(selected === hit.id ? null : hit.id);
        return;
      }
      const bi = bondAt(p);
      if (bi >= 0) { commit({ ...drawing, bonds: drawing.bonds.map((b, i) => (i === bi ? { ...b, order: tool } : b)) }); playTick(); return; }
      setSelected(null);
      return;
    }
    // 원자 도구: 빈 곳 → 그 자리에 원자(고른 원자가 있으면 결합까지), 원자 → 고르기 · 잇기
    const el = tool as El;
    const fromAtom = drawing.atoms.find(a => a.id === selected);
    const near = (q: { x: number; y: number }) => fromAtom && Math.hypot(q.x - fromAtom.x, q.y - fromAtom.y) <= REACH_PX;
    if (!hit) {
      const made = place(drawing, el, p);
      const link = fromAtom && near(p);
      commit(link ? bond(made.drawing, fromAtom.id, made.atom.id, 1, false) : made.drawing);
      setSelected(el === 'C' ? made.atom.id : null);
      playTick();
      return;
    }
    if (fromAtom?.id === hit.id) { setSelected(null); return; }
    if (fromAtom && near(hit)) { commit(bond(drawing, fromAtom.id, hit.id, 1, false)); setSelected(hit.el === 'C' ? hit.id : null); playTick(); return; }
    setSelected(hit.id);
  };

  const point = (event: PointerEvent<SVGSVGElement>) => {
    const r = svg.current!.getBoundingClientRect();
    return { x: (event.clientX - r.left) * size.w / r.width, y: (event.clientY - r.top) * size.h / r.height };
  };
  const onDown = (event: PointerEvent<SVGSVGElement>) => {
    const p = point(event);
    press.current = { id: event.pointerId, start: p, atom: atomAt(p)?.id ?? null, moved: false, before: drawing };
    svg.current?.setPointerCapture(event.pointerId);
  };
  const onMove = (event: PointerEvent<SVGSVGElement>) => {
    const p = point(event);
    setHover(p);
    const pr = press.current;
    if (!pr || pr.id !== event.pointerId) return;
    if (Math.hypot(p.x - pr.start.x, p.y - pr.start.y) > 8) pr.moved = true;
    if (tool === 'move' && pr.atom !== null && pr.moved) setDrawing(d => ({ ...d, atoms: d.atoms.map(a => (a.id === pr.atom ? { ...a, x: Math.max(14, Math.min(size.w - 14, p.x)), y: Math.max(14, Math.min(size.h - 14, p.y)) } : a)) }));
  };
  const onUp = (event: PointerEvent<SVGSVGElement>) => {
    const pr = press.current;
    press.current = null;
    if (!pr || pr.id !== event.pointerId) return;
    const p = point(event);
    if (!pr.moved) { tap(p); return; }
    if (tool === 'move') { if (pr.atom !== null) { setHistory(h => [...h.slice(-60), pr.before]); setResult(null); } return; }
    // 원자에서 끌어서 놓기: 다른 원자 위면 결합, 빈 곳이면 새 원자 + 결합
    if (pr.atom === null || tool === 'erase') return;
    const end = atomAt(p);
    if (end && end.id === pr.atom) return;
    const order: Order = isBondTool(tool) ? tool : 1;
    if (end) { commit(bond(drawing, pr.atom, end.id, order, isBondTool(tool))); setSelected(end.el === 'C' ? end.id : null); playTick(); return; }
    const el: El = isAtomTool(tool) ? tool : 'C';
    const made = place(drawing, el, p);
    commit(bond(made.drawing, pr.atom, made.atom.id, order, false));
    setSelected(el === 'C' ? made.atom.id : null);
    playTick();
  };
  const onKeyDown = (event: ReactKeyboardEvent<SVGSVGElement>) => {
    const c = cursor ?? { x: size.w / 2, y: size.h / 2 };
    const step = event.shiftKey ? 8 : UNIT * 0.5;
    const moves: Record<string, [number, number]> = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] };
    if (moves[event.key]) { event.preventDefault(); const [dx, dy] = moves[event.key]; setCursor({ x: Math.max(10, Math.min(size.w - 10, c.x + dx)), y: Math.max(10, Math.min(size.h - 10, c.y + dy)) }); return; }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setCursor(c); tap(c); return; }
    if (event.key === 'Backspace' || event.key === 'Delete') { event.preventDefault(); const hit = atomAt(c); if (hit) { commit(removeAtom(drawing, hit.id)); setSelected(null); } }
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); undo(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const mol = useMemo(() => drawingToMol(drawing), [drawing]);
  const drawnName = useMemo(() => (drawing.atoms.length ? nameOf(mol) : null), [mol, drawing.atoms.length]);
  const overfull = useMemo(() => new Set(drawing.atoms.filter(a => a.el === 'C' && drawing.bonds.filter(b => b.a === a.id || b.b === a.id).reduce((s, b) => s + b.order, 0) > 4).map(a => a.id)), [drawing]);
  const check = () => {
    const lines: string[] = [];
    if (!drawnName) { setResult({ ok: false, lines: ['먼저 구조식을 그려요.'] }); return; }
    const same = sameMolecule(mol, target.mol);
    const stereoOk = !target.plan.stereo || (drawnName.ok && drawnName.plan.stereo === target.plan.stereo);
    const ok = same && stereoOk;
    if (ok) lines.push(`${target.name} 맞아요!`);
    else if (!drawnName.ok) lines.push(drawnName.reason);
    else {
      lines.push(`그린 구조는 「${drawnName.name}」예요.`);
      if (same && !stereoOk) lines.push(`연결은 맞는데 ${target.plan.stereo === 'cis' ? '시스(이중 결합 양쪽 사슬이 같은 쪽)' : '트랜스(양쪽 사슬이 반대쪽)'}로 그려야 해요. 옮기기 도구로 원자를 끌어 바꿔요.`);
      else if (formula(mol) === formula(target.mol)) lines.push('분자식은 같아요(이성질체). 주사슬 길이와 가지 위치를 확인해요.');
      else lines.push(`분자식이 달라요: 그림 ${formula(mol)}, 정답 ${formula(target.mol)} (탄소 ${carbonCount(mol)}개 / ${carbonCount(target.mol)}개)`);
    }
    setResult({ ok, lines });
    setScore(s => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
    playResult(ok);
  };
  const nextTarget = () => { setTarget(newTarget()); setDrawing(EMPTY); setHistory([]); setResult(null); setReveal(false); setSelected(null); playTick(); };

  const { strokes, labels } = skeleton(mol);
  const sel = drawing.atoms.find(a => a.id === selected);
  const hint = tool === 'erase' ? '지울 원자나 결합을 눌러요.' : tool === 'move' ? '원자를 끌어서 옮겨요(시스 · 트랜스 모양 바꾸기).'
    : isBondTool(tool) ? `원자 두 개를 차례로 누르거나 이미 있는 결합을 누르면 ${TOOL_LABEL[tool].slice(0, 2)} 결합이 돼요.`
    : sel ? `고른 원자 근처를 누르면 ${tool === 'O' ? 'OH' : tool === 'C' ? '탄소' : tool}가 이어서 생겨요(가까운 원자를 누르면 고리처럼 이어져요). 멀리 누르면 따로 시작해요.` : `빈 곳을 누르면 그 자리에 ${tool === 'O' ? 'OH' : tool === 'C' ? '탄소' : tool}가 생겨요. 이미 있는 원자를 누르면 거기서부터 이어 그려요.`;
  return <section className="biology-menu glass structure-panel">
    <div className="structure-top">{rangeBar}{!free && <p className="structure-score">맞힌 문제 <b>{score.right}</b> / {score.total}</p>}</div>
    {free ? <p className="structure-prompt">아무 구조식이나 그려 보세요. <b>이름을 바로 알려 줘요.</b></p>
      : <p className={`structure-prompt${hard ? ' is-hard' : ''}`}>이 이름의 구조식을 그려요: <b>{target.name}</b></p>}
    <div className="structure-palette" role="toolbar" aria-label="그리기 도구">
      <div role="group" aria-label="원자">{ATOM_TOOLS.map(t => <button key={t} type="button" className="glass-button" aria-pressed={tool === t} onClick={() => { setTool(t); setSelected(null); }}>{TOOL_LABEL[t]}</button>)}</div>
      <div role="group" aria-label="결합">{BOND_TOOLS.map(t => <button key={t} type="button" className="glass-button" aria-pressed={tool === t} onClick={() => { setTool(t); setSelected(null); }}>{TOOL_LABEL[t]}</button>)}</div>
      <div role="group" aria-label="편집">{(['move', 'erase'] as Tool[]).map(t => <button key={t} type="button" className="glass-button" aria-pressed={tool === t} onClick={() => { setTool(t); setSelected(null); }}>{TOOL_LABEL[t]}</button>)}
        <button type="button" className="glass-button" onClick={undo} disabled={!history.length} aria-label="되돌리기">↶</button>
        <button type="button" className="glass-button" onClick={clear} disabled={!drawing.atoms.length}>모두 지우기</button></div>
    </div>
    <svg ref={svg} className={`structure-canvas tool-${tool}`} viewBox={`0 0 ${size.w} ${size.h}`} style={{ aspectRatio: `${size.w} / ${size.h}` }} tabIndex={0} role="application"
      aria-label="구조식 그림판. 방향키로 십자선을 옮기고 Enter로 누른 것처럼 놓아요."
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={() => setHover(null)} onKeyDown={onKeyDown}>
      <defs><pattern id="structure-grid" width={UNIT / 2} height={UNIT / 2} patternUnits="userSpaceOnUse"><circle cx={UNIT / 4} cy={UNIT / 4} r={1} className="structure-grid-dot" /></pattern></defs>
      <rect x={0} y={0} width={size.w} height={size.h} fill="url(#structure-grid)" />
      {sel && hover && isAtomTool(tool) && !atomAt(hover) && <line x1={sel.x} y1={sel.y} x2={hover.x} y2={hover.y} className="structure-ghost" />}
      {strokes.map((s, i) => <line key={i} x1={s.x1 * UNIT} y1={-s.y1 * UNIT} x2={s.x2 * UNIT} y2={-s.y2 * UNIT} className={`structure-ink ${s.kind}`} />)}
      {drawing.atoms.map(a => a.el === 'C'
        ? <circle key={a.id} cx={a.x} cy={a.y} r={overfull.has(a.id) ? 7 : 4} className={`structure-c${overfull.has(a.id) ? ' is-over' : ''}`} />
        : null)}
      {labels.map((l, i) => <g key={`l${i}`}><rect x={l.x * UNIT - 15} y={-l.y * UNIT - 11} width={30} height={22} rx={6} className="structure-label-bg" /><text x={l.x * UNIT} y={-l.y * UNIT} className="structure-canvas-label">{l.text}</text></g>)}
      {sel && <circle cx={sel.x} cy={sel.y} r={12} className="structure-selected" />}
      {cursor && <g className="structure-crosshair"><line x1={cursor.x - 10} y1={cursor.y} x2={cursor.x + 10} y2={cursor.y} /><line x1={cursor.x} y1={cursor.y - 10} x2={cursor.x} y2={cursor.y + 10} /></g>}
    </svg>
    <p className="structure-hint">{hint}</p>
    {free ? <div className="structure-result" role="status">
      {!drawnName ? <p>아직 그린 게 없어요.</p> : drawnName.ok ? <>
        <h2>{drawnName.name}</h2>
        <p className="structure-formula">{formula(mol)}</p>
        <ul>{explain(drawnName.plan).map((line, i) => <li key={i}>{line}</li>)}</ul>
      </> : <p>{drawnName.reason}</p>}
    </div> : <>
      <div className="structure-actions">
        <button type="button" className="glass-button is-primary" onClick={check} disabled={!drawing.atoms.length}>채점하기</button>
        <button type="button" className="glass-button" onClick={() => setReveal(v => !v)}>{reveal ? '정답 가리기' : '정답 보기'}</button>
        <button type="button" className="glass-button" onClick={nextTarget}>다음 문제 →</button>
      </div>
      {result && <div className={`structure-result ${result.ok ? 'is-right' : 'is-wrong'}`} role="status">
        <h2>{result.ok ? '정답이에요!' : '다시 해 봐요'}</h2>
        <ul>{result.lines.map((line, i) => <li key={i}>{line}</li>)}</ul>
      </div>}
      {reveal && <div className="structure-reveal">
        <MoleculeSvg mol={target.mol} numbers={target.plan.parent} label={`${target.name}의 골격 구조식`} />
        <ul>{explain(target.plan).map((line, i) => <li key={i}>{line}</li>)}</ul>
      </div>}
    </>}
  </section>;
}
