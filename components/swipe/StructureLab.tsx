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
  useEffect(() => { try { localStorage.setItem(RANGE_KEY, JSON.stringify(range)); } catch { /* not saved */ } }, [range]);
  const toMenu = useCallback(() => { playTick(); setPage('menu'); }, []);
  if (page === 'menu') return <MenuCard topic="주민지T · 구조식 실습" question="무엇을 해 볼까요?"
    up={{ label: '이름 맞히기', note: '골격 구조식 → 이름', onChoose: () => setPage('name') }}
    left={{ label: '구조식 그리기', note: '이름 → 점 잇기', onChoose: () => setPage('draw') }}
    right={{ label: '자유 그리기', note: '그리면 이름을 알려 줘요', onChoose: () => setPage('free') }}
    onBack={onBack} backLabel="학습 메뉴">
    <p className="structure-menu-note glass">H는 그리지 않는 골격 구조식이에요. 꺾이는 점과 끝점이 탄소예요.</p>
  </MenuCard>;
  const rangeBar = page === 'free' ? null : <div className="structure-range" role="group" aria-label="범위">{CATEGORIES.map(c => <button key={c} type="button" className="glass-button" aria-pressed={range.includes(c)}
    onClick={() => setRange(r => r.includes(c) ? (r.length > 1 ? r.filter(x => x !== c) : r) : [...r, c])}>{CATEGORY_LABEL[c]}</button>)}</div>;
  return <main className="swipe-app biology-app structure-app"><div className="biology-study">
    <header className="biology-header glass"><button type="button" className="glass-button" onClick={toMenu}>← 구조식 실습</button><h1>{page === 'name' ? '이름 맞히기' : page === 'draw' ? '구조식 그리기' : '자유 그리기'}</h1></header>
    {page === 'name' ? <NameQuiz key={range.join()} range={range} rangeBar={rangeBar} />
      : <DrawPractice key={`${page}-${range.join()}`} free={page === 'free'} range={range} rangeBar={rangeBar} />}
  </div></main>;
}

// ── 이름 맞히기: 네 방향 보기(방향키 = 밀기 = 누르기) ─────────────────────────────
function NameQuiz({ range, rangeBar }: { range: Category[]; rangeBar: React.ReactNode }) {
  const next = useCallback(() => { const p = makePuzzle(range, Math.random, { minCarbons: 2 }); return { puzzle: p, choices: nameChoices(p) }; }, [range]);
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
    <div className="structure-quiz">
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

// ── 구조식 그리기: 점을 누르고 이어서 결합 ─────────────────────────────────────
// 판 크기: PC는 가로로 넓게, 폰은 점 간격이 넓게(노네인 주사슬 9개가 들어가는 크기).
const boardSize = () => (typeof window !== 'undefined' && window.innerWidth < 560 ? { COLS: 10, ROWS: 9 } : { COLS: 13, ROWS: 7 });
const SQ3 = Math.sqrt(3) / 2;
type Key = string;
const keyOf = (c: number, r: number): Key => `${c},${r}`;
/** 판의 점 위치(SVG 좌표, 아래가 +). 세로 줄은 간격 1, 옆 줄은 반 칸 어긋나서 이웃 점 6개가 모두 거리 1이다. */
const pos = (key: Key) => { const [c, r] = key.split(',').map(Number); return { x: c * SQ3, y: r + (c % 2 ? 0.5 : 0) }; };
const neighbors = (a: Key, b: Key) => { const p = pos(a), q = pos(b); return Math.abs(Math.hypot(p.x - q.x, p.y - q.y) - 1) < 0.01; };
interface Sketch { atoms: Record<Key, El>; bonds: { a: Key; b: Key; order: Order }[] }
const EMPTY: Sketch = { atoms: {}, bonds: [] };
type Tool = 'C' | 'O' | 'Cl' | 'Br' | 'erase';
const TOOL_LABEL: Record<Tool, string> = { C: '탄소 잇기', O: 'OH', Cl: 'Cl', Br: 'Br', erase: '지우개' };

function sketchToMol(s: Sketch): Mol {
  const keys = Object.keys(s.atoms);
  const index = new Map(keys.map((k, i) => [k, i]));
  return {
    atoms: keys.map(k => { const p = pos(k); return { el: s.atoms[k], x: p.x, y: -p.y }; }), // 분자 좌표는 위가 +
    bonds: s.bonds.map(b => ({ a: index.get(b.a)!, b: index.get(b.b)!, order: b.order })),
  };
}
/** 결합이 없는 탄소 점은 지운다(OH · Cl · Br도 결합이 없으면 지운다). */
const tidy = (s: Sketch): Sketch => {
  const used = new Set(s.bonds.flatMap(b => [b.a, b.b]));
  return { atoms: Object.fromEntries(Object.entries(s.atoms).filter(([k]) => used.has(k))), bonds: s.bonds };
};

function DrawPractice({ free, range, rangeBar }: { free: boolean; range: Category[]; rangeBar: React.ReactNode }) {
  const newTarget = useCallback(() => makePuzzle(range, Math.random, { minCarbons: 2 }), [range]);
  const [target, setTarget] = useState<Puzzle>(newTarget);
  const [sketch, setSketch] = useState<Sketch>(EMPTY);
  const [history, setHistory] = useState<Sketch[]>([]);
  const [tool, setTool] = useState<Tool>('C');
  const [{ COLS, ROWS }] = useState(boardSize);
  const [selected, setSelected] = useState<Key | null>(null);
  const [cursor, setCursor] = useState<Key>(keyOf(2, 3));
  const [result, setResult] = useState<{ ok: boolean; lines: string[] } | null>(null);
  const [reveal, setReveal] = useState(false);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const [hover, setHover] = useState<Key | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  const down = useRef<{ key: Key | null; id: number } | null>(null);

  const commit = (next: Sketch) => { setHistory(h => [...h.slice(-40), sketch]); setSketch(tidy(next)); setResult(null); };
  const undo = () => { const last = history.at(-1); if (!last) return; setHistory(h => h.slice(0, -1)); setSketch(last); setResult(null); };
  const clear = () => { if (Object.keys(sketch.atoms).length) commit(EMPTY); setSelected(null); };

  const connect = (a: Key, b: Key) => {
    if (!neighbors(a, b)) return false;
    const existing = sketch.bonds.find(x => (x.a === a && x.b === b) || (x.a === b && x.b === a));
    if (existing) {
      // 같은 두 점을 다시 이으면 단일 → 이중 → 삼중 → 없음
      const bonds = existing.order === 3 ? sketch.bonds.filter(x => x !== existing) : sketch.bonds.map(x => x === existing ? { ...x, order: (x.order + 1) as Order } : x);
      commit({ atoms: sketch.atoms, bonds });
      playTick();
      return true;
    }
    const atoms = { ...sketch.atoms };
    if (!atoms[a]) atoms[a] = 'C';
    if (!atoms[b]) atoms[b] = tool === 'O' || tool === 'Cl' || tool === 'Br' ? tool : 'C';
    commit({ atoms, bonds: [...sketch.bonds, { a, b, order: 1 }] });
    playTick();
    return true;
  };
  const eraseAt = (key: Key) => {
    if (sketch.atoms[key]) commit({ atoms: sketch.atoms, bonds: sketch.bonds.filter(b => b.a !== key && b.b !== key) });
  };
  const tapDot = (key: Key) => {
    if (tool === 'erase') { eraseAt(key); setSelected(null); return; }
    if (selected && selected !== key) {
      if (connect(selected, key)) { setSelected(null); return; }
      setSelected(key);
      return;
    }
    if (selected === key) { setSelected(null); return; }
    // OH · Cl · Br 도구로 이미 있는 점을 누르면 그 원자로 바꾼다.
    if ((tool === 'O' || tool === 'Cl' || tool === 'Br' || tool === 'C') && sketch.atoms[key] && sketch.atoms[key] !== tool && tool !== 'C') {
      commit({ atoms: { ...sketch.atoms, [key]: tool }, bonds: sketch.bonds });
      return;
    }
    if (tool === 'C' && sketch.atoms[key] && sketch.atoms[key] !== 'C' && !selected) {
      commit({ atoms: { ...sketch.atoms, [key]: 'C' }, bonds: sketch.bonds });
      return;
    }
    setSelected(key);
  };
  const tapBond = (index: number) => {
    const bond = sketch.bonds[index];
    if (tool === 'erase') { commit({ atoms: sketch.atoms, bonds: sketch.bonds.filter((_, i) => i !== index) }); return; }
    const bonds = bond.order === 3 ? sketch.bonds.filter((_, i) => i !== index) : sketch.bonds.map((b, i) => i === index ? { ...b, order: (b.order + 1) as Order } : b);
    commit({ atoms: sketch.atoms, bonds });
    playTick();
  };

  const at = (event: PointerEvent<SVGSVGElement>) => {
    const el = svg.current!;
    const pt = el.createSVGPoint();
    pt.x = event.clientX; pt.y = event.clientY;
    const p = pt.matrixTransform(el.getScreenCTM()!.inverse());
    let best: Key | null = null, dist = 0.42;
    for (let c = 0; c < COLS; c += 1) for (let r = 0; r < ROWS; r += 1) { const q = pos(keyOf(c, r)); const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < dist) { dist = d; best = keyOf(c, r); } }
    return { key: best, p };
  };
  const onDown = (event: PointerEvent<SVGSVGElement>) => {
    const { key } = at(event);
    down.current = { key, id: event.pointerId };
    svg.current?.setPointerCapture(event.pointerId);
  };
  const onMove = (event: PointerEvent<SVGSVGElement>) => { const { key } = at(event); setHover(key); };
  const onUp = (event: PointerEvent<SVGSVGElement>) => {
    const start = down.current;
    down.current = null;
    if (!start || start.id !== event.pointerId) return;
    const { key, p } = at(event);
    if (start.key && key && key !== start.key) { if (tool === 'erase') return; if (!connect(start.key, key)) setSelected(key); else setSelected(null); setCursor(key); return; }
    if (key && key === start.key) { setCursor(key); tapDot(key); return; }
    // 점이 아닌 곳: 결합 가운데를 누르면 결합 차수를 바꾼다.
    const i = sketch.bonds.findIndex(b => { const m1 = pos(b.a), m2 = pos(b.b); return Math.hypot((m1.x + m2.x) / 2 - p.x, (m1.y + m2.y) / 2 - p.y) < 0.3; });
    if (i >= 0) tapBond(i); else setSelected(null);
  };
  const onKeyDown = (event: ReactKeyboardEvent<SVGSVGElement>) => {
    const [c, r] = cursor.split(',').map(Number);
    const move: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
    if (move[event.key]) { event.preventDefault(); const [dc, dr] = move[event.key]; setCursor(keyOf(Math.max(0, Math.min(COLS - 1, c + dc)), Math.max(0, Math.min(ROWS - 1, r + dr)))); return; }
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); tapDot(cursor); return; }
    if (event.key === 'Backspace' || event.key === 'Delete') { event.preventDefault(); eraseAt(cursor); }
  };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event)) { if ((event.ctrlKey || event.metaKey) && event.key === 'z') { event.preventDefault(); undo(); } return; }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const mol = useMemo(() => sketchToMol(sketch), [sketch]);
  const drawnName = useMemo(() => (Object.keys(sketch.atoms).length ? nameOf(mol) : null), [mol, sketch]);
  const check = () => {
    const lines: string[] = [];
    if (!drawnName) { setResult({ ok: false, lines: ['먼저 점을 이어서 구조식을 그려요.'] }); return; }
    const same = sameMolecule(mol, target.mol);
    const stereoOk = !target.plan.stereo || (drawnName.ok && drawnName.plan.stereo === target.plan.stereo);
    const ok = same && stereoOk;
    if (ok) lines.push(`${target.name} 맞아요!`);
    else if (!drawnName.ok) lines.push(drawnName.reason);
    else {
      lines.push(`그린 구조는 「${drawnName.name}」예요.`);
      if (same && !stereoOk) lines.push(`연결은 맞는데 ${target.plan.stereo === 'cis' ? '시스(이중 결합 양쪽 사슬이 같은 쪽)' : '트랜스(양쪽 사슬이 반대쪽)'}로 그려야 해요.`);
      else if (formula(mol) === formula(target.mol)) lines.push('분자식은 같아요(이성질체). 주사슬 길이와 가지 위치를 확인해요.');
      else lines.push(`분자식이 달라요: 그림 ${formula(mol)}, 정답 ${formula(target.mol)} (탄소 ${carbonCount(mol)}개 / ${carbonCount(target.mol)}개)`);
    }
    setResult({ ok, lines });
    setScore(s => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
    playResult(ok);
  };
  const nextTarget = () => { setTarget(newTarget()); setSketch(EMPTY); setHistory([]); setResult(null); setReveal(false); setSelected(null); playTick(); };

  const dots: Key[] = [];
  for (let c = 0; c < COLS; c += 1) for (let r = 0; r < ROWS; r += 1) dots.push(keyOf(c, r));
  const view = { x: -0.6, y: -0.6, w: (COLS - 1) * SQ3 + 1.2, h: ROWS + 0.6 };
  const drawn = skeleton(mol);
  const center = Object.keys(sketch.atoms);
  return <section className="biology-menu glass structure-panel">
    <div className="structure-top">{rangeBar}{!free && <p className="structure-score">맞힌 문제 <b>{score.right}</b> / {score.total}</p>}</div>
    {free ? <p className="structure-prompt">점을 이어 아무 구조식이나 그려 보세요. <b>이름을 바로 알려 줘요.</b></p>
      : <p className="structure-prompt">이 이름의 구조식을 그려요: <b>{target.name}</b></p>}
    <div className="structure-tools" role="group" aria-label="도구">
      {(['C', 'O', 'Cl', 'Br', 'erase'] as Tool[]).map(t => <button key={t} type="button" className="glass-button" aria-pressed={tool === t} onClick={() => { setTool(t); setSelected(null); }}>{TOOL_LABEL[t]}</button>)}
      <span className="structure-tools-gap" />
      <button type="button" className="glass-button" onClick={undo} disabled={!history.length} aria-label="되돌리기">↶ 되돌리기</button>
      <button type="button" className="glass-button" onClick={clear} disabled={!center.length}>모두 지우기</button>
    </div>
    <svg ref={svg} className="structure-board" viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} tabIndex={0} role="application"
      aria-label="구조식 그리기 판. 방향키로 점을 옮기고 Enter로 점을 골라 이어요."
      onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={() => setHover(null)} onKeyDown={onKeyDown}>
      {dots.map(k => { const p = pos(k); return <circle key={k} cx={p.x} cy={p.y} r={0.07} className="structure-dot" />; })}
      {selected && dots.filter(k => neighbors(selected, k)).map(k => { const p = pos(k); return <circle key={`n${k}`} cx={p.x} cy={p.y} r={0.16} className="structure-near" />; })}
      {drawn.strokes.map((s, i) => <line key={i} x1={s.x1} y1={-s.y1} x2={s.x2} y2={-s.y2} className={`structure-bond ${s.kind}`} />)}
      {Object.entries(sketch.atoms).map(([k, el]) => { const p = pos(k); return el === 'C'
        ? <circle key={k} cx={p.x} cy={p.y} r={0.1} className="structure-atom" />
        : <g key={k}><rect x={p.x - 0.36} y={p.y - 0.26} width={0.72} height={0.52} rx={0.12} className="structure-label-bg" /><text x={p.x} y={p.y} className="structure-label">{el === 'O' ? 'OH' : el}</text></g>; })}
      {hover && <circle cx={pos(hover).x} cy={pos(hover).y} r={0.2} className="structure-hover" />}
      {selected && <circle cx={pos(selected).x} cy={pos(selected).y} r={0.24} className="structure-selected" />}
      <circle cx={pos(cursor).x} cy={pos(cursor).y} r={0.3} className="structure-cursor" />
    </svg>
    <p className="structure-hint">점을 누르고 옆 점을 누르면(또는 끌면) 결합이 생겨요. 같은 결합을 다시 이으면 이중 → 삼중 → 지우기. OH · Cl · Br 도구로 끝 점을 바꿔요.</p>
    {free ? <div className="structure-result" role="status">
      {!drawnName ? <p>아직 그린 게 없어요.</p> : drawnName.ok ? <>
        <h2>{drawnName.name}</h2>
        <p className="structure-formula">{formula(mol)}</p>
        <ul>{explain(drawnName.plan).map((line, i) => <li key={i}>{line}</li>)}</ul>
      </> : <p>{drawnName.reason}</p>}
    </div> : <>
      <div className="structure-actions">
        <button type="button" className="glass-button is-primary" onClick={check} disabled={!center.length}>채점하기</button>
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
