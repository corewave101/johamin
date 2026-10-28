// 양동비T 「편광 가상실험실」을 앱 화면으로 옮겼다(4.10.0~): 편광판과 빛의 세기 · LCD와 OLED · 광자 정보 전송.
// 선생님 파일에서 공동 접속(방 코드 · 서버), 다운로드 버튼, 추세선 9종 맞추기는 뺐고, 21차시 학습지 1쪽의
// "수직인 두 판 사이에 한 장 넣기"를 더했다. 계산은 lib/polarization-lab.ts.
import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import MenuCard from './MenuCard';
import {
  benchStages, threePlates, fmt, fold, lcdPixel, overLinear, overNatural, polOf, ARROW, randomPlan, transmit, pickSample, keyResult, xor, parseBits,
  type Bench, type Bit, type Basis, type Plan, type Photon,
} from '../../lib/polarization-lab';

type Page = 'menu' | 'intensity' | 'display' | 'photon';
type Mode = 'n1' | 'n2' | 'l1' | 'l2' | 'three';
type Knob = 'phi' | 't1' | 't2' | 'alpha';

const MODES: Record<Mode, { title: string; short: string; question: string; knobs: Knob[]; scans: Knob[] }> = {
  n1: { title: '자연광 · 편광판 1개', short: '자연광 1개', question: '자연광에 편광판을 하나 놓으면?', knobs: ['t1'], scans: ['t1'] },
  n2: { title: '자연광 · 편광판 2개', short: '자연광 2개', question: '자연광이 두 편광판을 차례로 지나면?', knobs: ['t1', 't2'], scans: ['t2', 't1'] },
  l1: { title: '선편광 · 편광판 1개', short: '선편광 1개', question: '선편광과 투과축의 각을 바꾸면?', knobs: ['phi', 't1'], scans: ['t1'] },
  l2: { title: '선편광 · 편광판 2개', short: '선편광 2개', question: '선편광이 두 편광판을 차례로 지나면?', knobs: ['phi', 't1', 't2'], scans: ['t2', 't1'] },
  three: { title: '수직인 두 판 + 한 장', short: '편광판 3개', question: '수직인 두 판 사이에 한 장을 넣으면?', knobs: ['alpha'], scans: ['alpha'] },
};
const KNOB: Record<Knob, { label: string; symbol: string }> = {
  phi: { label: '광원 편광 방향', symbol: 'φ' }, t1: { label: '첫 번째 편광판', symbol: 'θ₁' }, t2: { label: '두 번째 편광판', symbol: 'θ₂' }, alpha: { label: '가운데 편광판 P₂', symbol: 'α' },
};
const START = { i0: 100, phi: 0, t1: 0, t2: 45, alpha: 45 };
type Setting = typeof START;
type Record_ = { mode: Mode; scan: Knob; fixed: string; x: number; i: number };

const benchOf = (mode: Mode, s: Setting): Bench => mode === 'three'
  ? { source: 'natural', i0: s.i0, phi: 0, plates: [0, s.alpha, 90] }
  : { source: mode[0] === 'n' ? 'natural' : 'linear', i0: s.i0, phi: s.phi, plates: mode.endsWith('1') ? [s.t1] : [s.t1, s.t2] };
const fixedOf = (mode: Mode, scan: Knob, s: Setting) => [`I₀ ${s.i0}`, ...MODES[mode].knobs.filter(k => k !== scan).map(k => `${KNOB[k].symbol} ${s[k]}°`)].join(' · ');

export default function PolarizationLab({ onBack }: { onBack: () => void }) {
  const [page, setPage] = useState<Page>('menu');
  const back = useCallback(() => { if (page === 'menu') onBack(); else setPage('menu'); }, [page, onBack]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      // 메뉴에서도 여기서 처리해야 바깥(과목 메뉴)까지 한꺼번에 뒤로 가지 않는다(OpticsLab과 같다).
      e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) back();
    };
    window.addEventListener('keydown', key, true); return () => window.removeEventListener('keydown', key, true);
  }, [back]);

  if (page === 'menu') return <MenuCard topic="양동비T · 편광 가상실험실" question="무엇을 실험할까요?"
    up={{ label: '빛의 세기', note: '편광판 · 말뤼스 법칙', onChoose: () => setPage('intensity') }}
    left={{ label: 'LCD · OLED', note: '편광과 디스플레이', onChoose: () => setPage('display') }}
    right={{ label: '광자 정보 전송', note: '앨리스 · 밥 · 이브', onChoose: () => setPage('photon') }}
    onBack={onBack} backLabel="학습 메뉴">
    <div className="observation-note glass"><p>양동비T 편광 가상실험실을 옮겨 왔어요. 편광판을 돌리며 세기를 재고, 디스플레이와 광자 통신에서 편광이 어떻게 쓰이는지 확인해요.</p></div>
  </MenuCard>;

  const title = page === 'intensity' ? '빛의 세기 실험' : page === 'display' ? 'LCD · OLED' : '광자 정보 전송';
  return <main className="swipe-app biology-app optics-app polar-app"><div className="biology-study">
    <header className="biology-header glass"><button type="button" className="glass-button" onClick={back}>← 실험 선택</button><h1>편광 · {title}</h1></header>
    {page === 'intensity' ? <Intensity /> : page === 'display' ? <Display /> : <PhotonLab />}
    <p className="polar-foot">양동비T 「3. 편광」 가상실험실 기반 · 이상적인 광학 모형 · a.u.는 상대 세기 단위예요.</p>
  </div></main>;
}

// ── 공통 조각 ─────────────────────────────────────────────────────
function AngleControl({ label, symbol, value, set }: { label: string; symbol: string; value: number; set: (v: number) => void }) {
  return <div className="polar-control">
    <label>{label} {symbol}<output>{value}°</output>
      <input type="range" min={0} max={180} step={1} value={value} aria-label={`${label} ${symbol}`} onChange={e => set(Number(e.target.value))} /></label>
    <div className="polar-presets" role="group" aria-label={`${symbol} 빠르게 맞추기`}>{[0, 45, 90, 135].map(a =>
      <button key={a} type="button" className="glass-button optics-toggle" aria-pressed={value === a} onClick={() => set(a)}>{a}°</button>)}</div>
  </div>;
}

/** 진행 방향에서 본 전기장 진동 방향. 0°는 수직, 시계 방향으로 잰다. */
function Arrow({ cx, cy, r, angle, tone, heads = true }: { cx: number; cy: number; r: number; angle: number; tone: string; heads?: boolean }) {
  const dx = Math.sin(angle * Math.PI / 180) * r, dy = -Math.cos(angle * Math.PI / 180) * r;
  const head = heads ? 'url(#polar-head)' : undefined;
  return <line x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy} className={`polar-e ${tone}`} markerStart={head} markerEnd={head} />;
}

// ── 빛의 세기 실험 ────────────────────────────────────────────────
function Intensity() {
  const [mode, setMode] = useState<Mode>('n1');
  const [s, setS] = useState<Setting>(START);
  const [scan, setScan] = useState<Knob>('t1');
  const [records, setRecords] = useState<Record_[]>([]);
  const [theory, setTheory] = useState(false);
  const bench = benchOf(mode, s);
  const stages = benchStages(bench);
  const final = stages.at(-1)!.intensity;
  const set = (k: Knob | 'i0', v: number) => setS(prev => ({ ...prev, [k]: v }));
  const open = (next: Mode) => { setMode(next); setScan(MODES[next].scans[0]); setTheory(false); };
  const fixed = fixedOf(mode, scan, s);
  const shown = records.filter(r => r.mode === mode && r.scan === scan && r.fixed === fixed);
  const record = () => setRecords(list => [...list.filter(r => !(r.mode === mode && r.scan === scan && r.fixed === fixed && r.x === s[scan])), { mode, scan, fixed, x: s[scan], i: Number(fmt(final)) }]);
  const curve = useMemo(() => Array.from({ length: 181 }, (_, x) => ({ x, i: benchStages(benchOf(mode, { ...s, [scan]: x })).at(-1)!.intensity })), [mode, s, scan]);

  return <>
    <section className="biology-menu glass optics-panel">
      <div className="optics-tabs" role="group" aria-label="실험 고르기">{(Object.keys(MODES) as Mode[]).map(m =>
        <button key={m} type="button" className="glass-button" aria-pressed={mode === m} onClick={() => open(m)}><strong>{MODES[m].short}</strong><small>{MODES[m].title}</small></button>)}</div>
      <h2>{MODES[mode].question}</h2>
      <BenchView bench={bench} stages={stages} three={mode === 'three'} />
      <dl className="optics-metrics polar-metrics">
        <div><dt>입사 세기 I₀</dt><dd>{s.i0} a.u.</dd></div>
        {stages.length > 1 && <div><dt>첫 번째 판 통과 I₁</dt><dd>{fmt(stages[0].intensity)} a.u.</dd></div>}
        {stages.length > 2 && <div><dt>두 번째 판 통과 I₂</dt><dd>{fmt(stages[1].intensity)} a.u.</dd></div>}
        <div><dt>최종 세기</dt><dd><strong>{fmt(final)} a.u.</strong></dd></div>
        <div><dt>투과율 I / I₀</dt><dd>{s.i0 ? fmt(final / s.i0 * 100) : '—'} %</dd></div>
      </dl>
    </section>

    <div className="optics-grid-panels">
      <section className="biology-menu glass optics-panel">
        <h2>실험 조건</h2>
        <label className="observation-control">광원 세기 I₀ <output>{s.i0} a.u.</output><input type="range" min={0} max={100} step={1} value={s.i0} aria-label="광원 세기 I₀" onChange={e => set('i0', Number(e.target.value))} /></label>
        {MODES[mode].knobs.map(k => <AngleControl key={k} label={KNOB[k].label} symbol={KNOB[k].symbol} value={s[k]} set={v => set(k, v)} />)}
        {mode === 'three' && <p className="optics-hint">P₁ 투과축 0°(수직), P₃ 투과축 90°(수평)로 고정. P₂를 빼면 최종 세기는 0이에요.</p>}
        <div className="optics-actions"><button type="button" className="glass-button" onClick={() => setS(START)}>조건 처음으로</button></div>
      </section>
      <Principle mode={mode} s={s} stages={stages} />
    </div>

    <section className="biology-menu glass optics-panel">
      <h2>측정해서 그래프 그리기</h2>
      {MODES[mode].scans.length > 1 && <div className="optics-tabs small" role="group" aria-label="가로축으로 바꿀 판">{MODES[mode].scans.map(k =>
        <button key={k} type="button" className="glass-button" aria-pressed={scan === k} onClick={() => setScan(k)}><strong>{KNOB[k].symbol}를 바꾸며</strong></button>)}</div>}
      <p className="optics-hint">{KNOB[scan].label} {KNOB[scan].symbol}를 바꾸며 기록해요. 같은 조건({fixed})의 기록만 그래프에 나와요.</p>
      <div className="optics-actions">
        <button type="button" className="glass-button polar-primary" onClick={record}>지금 값 기록 ({KNOB[scan].symbol} = {s[scan]}°, I = {fmt(final)})</button>
        <button type="button" className="glass-button" disabled={!shown.length} onClick={() => setRecords(list => list.filter(r => !shown.includes(r)))}>이 조건 기록 지우기</button>
        <button type="button" className="glass-button optics-toggle" aria-pressed={theory} onClick={() => setTheory(!theory)}>이론 곡선</button>
      </div>
      <Graph points={shown} curve={theory ? curve : []} i0={s.i0} xLabel={`${KNOB[scan].symbol} (°)`} />
      {shown.length > 0 && <table className="polar-table"><thead><tr><th>{KNOB[scan].symbol}</th><th>I (a.u.)</th></tr></thead>
        <tbody>{[...shown].sort((a, b) => a.x - b.x).map(r => <tr key={r.x}><td>{r.x}°</td><td>{r.i}</td></tr>)}</tbody></table>}
      {!shown.length && <p className="optics-hidden">각도를 바꿔 가며 기록하면 점이 찍혀요. 0°, 45°, 90°, 135°, 180°부터 재 보세요.</p>}
    </section>
  </>;
}

function useNarrow() {
  const query = '(max-width: 560px)';
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => { const m = window.matchMedia(query); const on = () => setNarrow(m.matches); m.addEventListener('change', on); return () => m.removeEventListener('change', on); }, []);
  return narrow;
}

function BenchView({ bench, stages, three }: { bench: Bench; stages: ReturnType<typeof benchStages>; three: boolean }) {
  const nodes = bench.plates.length + 2;
  // 폰에서는 실험대 폭을 줄여(viewBox) 글자가 상대적으로 커지게 한다.
  const narrow = useNarrow();
  const W = narrow ? 640 : 1000, H = 420, top = 160, R = narrow ? (nodes > 4 ? 36 : 44) : (nodes > 4 ? 48 : 58), edge = narrow ? 70 : 120;
  const xs = Array.from({ length: nodes }, (_, i) => edge + i * ((W - 2 * edge) / (nodes - 1)));
  const levels = [bench.i0, ...stages.map(st => st.intensity)];
  const pols = [bench.source === 'linear' ? fold(bench.phi) : null, ...stages.map(st => st.pol)];
  const max = Math.max(bench.i0, 1);
  const final = levels.at(-1)!;
  return <svg className={`polar-bench${narrow ? ' is-narrow' : ''}${nodes > 4 ? ' is-five' : ''}`} viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`광학 실험대: 최종 세기 ${fmt(final)} a.u.`}>
    <defs><marker id="polar-head" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="16" markerHeight="16" markerUnits="userSpaceOnUse" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" className="polar-head" /></marker></defs>
    <text x={W / 2} y={44} className="polar-caption">{narrow ? '빛은 왼쪽 → 오른쪽 · 0° 수직, 90° 수평' : '빛은 왼쪽 → 오른쪽 · 원은 진행 방향에서 본 단면 · 0°는 수직, 90°는 수평'}</text>
    {xs.slice(0, -1).map((x, i) => {
      const level = levels[i], w = 6 + 26 * (level / max);
      return <g key={`b${i}`}>
        <rect x={x + R} y={top - w / 2} width={xs[i + 1] - x - 2 * R} height={w} rx={w / 2} className="polar-beam" style={{ opacity: level > 0 ? 0.3 + 0.7 * level / max : 0.08 }} />
        <text x={(x + xs[i + 1]) / 2} y={top - R - 16} className="polar-level">{fmt(level)}{narrow ? '' : ' a.u.'}</text>
        {i > 0 && <g>
          <line x1={x} y1={top + R + 8} x2={x} y2={300} className="polar-tick" />
          <circle cx={x} cy={340} r={34} className="polar-mini" />
          {pols[i] !== null ? <Arrow cx={x} cy={340} r={24} angle={pols[i]!} tone="out" /> : <text x={x} y={347} className="polar-none">빛 없음</text>}
          <text x={x} y={398} className="polar-sub">{pols[i] !== null ? `E ${fmt(pols[i]!)}°` : '통과 없음'}</text>
        </g>}
      </g>;
    })}
    {xs.map((x, i) => {
      if (i === 0) return <g key="src">
        <circle cx={x} cy={top} r={R} className="polar-source" />
        {bench.source === 'natural' ? [0, 30, 60, 90, 120, 150].map(a => <Arrow key={a} cx={x} cy={top} r={R - 16} angle={a} tone="src" heads={false} />) : <Arrow cx={x} cy={top} r={R - 14} angle={bench.phi} tone="src" />}
        <text x={x} y={top + R + 34} className="polar-name">{bench.source === 'natural' ? '자연광' : narrow ? '선편광' : '선편광 광원'}</text>
        <text x={x} y={top + R + 62} className="polar-sub">{bench.source === 'natural' ? (narrow ? '모든 방향' : '모든 방향 섞임') : `φ = ${fmt(bench.phi)}°`}</text>
      </g>;
      if (i === nodes - 1) return <g key="det">
        <circle cx={x} cy={top} r={R} className="polar-detector" style={{ fillOpacity: 0.15 + 0.85 * final / max }} />
        <text x={x} y={top + 11} className="polar-percent">{bench.i0 ? `${fmt(final / bench.i0 * 100)}%` : '—'}</text>
        <text x={x} y={top + R + 34} className="polar-name">{narrow ? '검출기' : '세기 검출기'}</text>
        <text x={x} y={top + R + 62} className="polar-sub">{narrow ? '투과율' : '광원 대비 투과율'}</text>
      </g>;
      const angle = bench.plates[i - 1];
      return <g key={`p${i}`}>
        <circle cx={x} cy={top} r={R} className="polar-plate" />
        <Arrow cx={x} cy={top} r={R - 10} angle={angle} tone="axis" heads={false} />
        <text x={x} y={top + R + 34} className="polar-name">{three || narrow ? `P${i}` : `편광판 ${i}`}</text>
        <text x={x} y={top + R + 62} className="polar-sub">{narrow ? '' : '투과축 '}{fmt(angle)}°</text>
      </g>;
    })}
  </svg>;
}

function Graph({ points, curve, i0, xLabel }: { points: { x: number; i: number }[]; curve: { x: number; i: number }[]; i0: number; xLabel: string }) {
  const W = 640, H = 300, L = 56, B = 250, T = 34, Rt = 620;
  const top = Math.max(i0, 1);
  const px = (x: number) => L + (Rt - L) * x / 180, py = (i: number) => B - (B - T) * i / top;
  return <svg className="polar-graph" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`측정 그래프: 기록 ${points.length}개`}>
    {[0, 45, 90, 135, 180].map(x => <g key={x}><line x1={px(x)} y1={T} x2={px(x)} y2={B} className="grid" /><text x={px(x)} y={B + 22} className="tick">{x}°</text></g>)}
    {[0, 0.25, 0.5, 0.75, 1].map(f => <g key={f}><line x1={L} y1={py(top * f)} x2={Rt} y2={py(top * f)} className="grid" /><text x={L - 8} y={py(top * f) + 5} className="tick end">{fmt(top * f, 0)}</text></g>)}
    <text x={Rt} y={H - 4} className="tick end">{xLabel}</text><text x={L + 6} y={T - 12} className="tick start">I (a.u.)</text>
    {curve.length > 0 && <polyline points={curve.map(p => `${px(p.x)},${py(p.i)}`).join(' ')} className="theory" />}
    {points.map(p => <circle key={p.x} cx={px(p.x)} cy={py(p.i)} r={6} className="dot" />)}
  </svg>;
}

function Principle({ mode, s, stages }: { mode: Mode; s: Setting; stages: ReturnType<typeof benchStages> }) {
  const f = (v: number) => fmt(v);
  let formula: string, working: string, body: ReactNode;
  if (mode === 'n1') {
    formula = 'I₁ = ½ I₀'; working = `${s.i0} ÷ 2 = ${f(stages[0].intensity)} a.u.`;
    body = <><p>자연광은 전기장 방향이 시간에 따라 불규칙하게 바뀌어 모든 방향이 고르게 섞여 있어요. 그래서 편광판만 돌려도 세기가 절반으로 일정하고, 나온 빛은 투과축과 나란하게 진동하는 선편광이에요.</p>
      <p className="working">평균: (1/π)∫₀^π I₀cos²θ dθ = I₀/2</p></>;
  } else if (mode === 'l1') {
    const d = fold(s.t1 - s.phi);
    formula = 'I = I₀ cos²θ'; working = `θ = ${d}° → ${s.i0} × cos²${d}° = ${f(stages[0].intensity)} a.u.`;
    body = <p>투과 진폭은 E = E₀ cos θ이고, 빛의 세기는 진폭의 제곱에 비례해요. 그래서 I/I₀ = E₀²cos²θ / E₀² 에서 말뤼스 법칙 I = I₀cos²θ가 나와요. θ는 입사광의 진동 방향과 투과축 사이의 각이에요.</p>;
  } else if (mode === 'n2') {
    const d = fold(s.t2 - s.t1);
    formula = 'I₂ = ½ I₀ cos²θ'; working = `I₁ = ${f(stages[0].intensity)}, θ = θ₂ − θ₁ = ${d}° → I₂ = ${f(stages[1].intensity)} a.u.`;
    body = <p>첫 판은 각도와 관계없이 I₀/2를 통과시키고, 빛을 θ₁ 방향 선편광으로 만들어요. 두 번째 판에는 두 투과축 사이 각 θ로 말뤼스 법칙을 써요. θ = 0°, 180°에서 최대, 90°에서 0이에요.</p>;
  } else if (mode === 'l2') {
    const d1 = fold(s.t1 - s.phi), d2 = fold(s.t2 - s.t1);
    formula = 'I₂ = I₀ cos²(θ₁−φ) cos²(θ₂−θ₁)'; working = `I₁ = ${s.i0} × cos²${d1}° = ${f(stages[0].intensity)} → I₂ = I₁ × cos²${d2}° = ${f(stages[1].intensity)} a.u.`;
    body = <p>첫 판을 지나면 세기만 바뀌는 게 아니라 편광 방향도 θ₁로 바뀌어요. 그래서 두 번째 판에서는 광원 방향 φ가 아니라 θ₂ − θ₁을 써야 해요.</p>;
  } else {
    formula = 'I₃ = ⅛ I₀ sin²2α'; working = `α = ${s.alpha}° → ${s.i0} ÷ 8 × sin²${fmt(2 * s.alpha)}° = ${f(threePlates(s.i0, s.alpha))} a.u.`;
    body = <><p>I₁ = ½I₀, I₂ = ½I₀cos²α, I₃ = I₂cos²(90° − α) = ½I₀cos²α sin²α = ⅛I₀ sin²2α. 수직인 두 판만 있으면 0인데, 사이에 비스듬한 판을 넣으면 오히려 빛이 지나요.</p>
      <p className="working">sin²2α = 1일 때 최대 → α = 45°, 최대 세기 ⅛I₀</p></>;
  }
  return <section className="biology-menu glass optics-panel">
    <h2>원리 확인</h2>
    <p className="formula">{formula}</p>
    <p className="working">{working}</p>
    {body}
    <p className="sign-note">이상적인 편광판 모형이에요. 실제 필름의 추가 흡수 · 새는 빛은 넣지 않았어요.</p>
  </section>;
}

// ── LCD · OLED ───────────────────────────────────────────────────
function Display() {
  const [voltage, setVoltage] = useState(false);
  const [emit, setEmit] = useState(true);
  const [outer, setOuter] = useState(0);
  const pixel = lcdPixel(100, voltage);
  const lcdOut = overLinear(100, 90, outer), natural = overNatural(100);
  const swatch = (v: number) => ({ opacity: 0.12 + 0.88 * v / 100 });
  return <>
    <div className="optics-grid-panels">
      <section className="biology-menu glass optics-panel">
        <div className="polar-row"><h2>LCD · 액정의 역할</h2><button type="button" className="glass-button optics-toggle" aria-pressed={voltage} onClick={() => setVoltage(!voltage)}>전압 {voltage ? 'ON' : 'OFF'}</button></div>
        <ol className="polar-stack">
          <li className="is-light"><strong>백라이트</strong><span>자연광 · I₀</span></li>
          <li><strong>첫 편광판</strong><span>수직 편광 · I₀/2</span></li>
          <li className="is-lc"><strong>액정</strong><span>{voltage ? '편광 방향 유지 (0°)' : '편광 방향 90° 회전'}</span></li>
          <li><strong>둘째 편광판</strong><span>투과축 수평 (90°)</span></li>
          <li className={pixel.bright ? 'is-bright' : 'is-dark'}><strong>{pixel.bright ? '밝은 화소 · 투과' : '어두운 화소 · 차단'}</strong><span>{fmt(pixel.out)} a.u.</span></li>
        </ol>
        <p>서로 수직인 두 편광판 사이에서 액정이 빛의 편광 상태를 바꾸어 두 번째 편광판의 투과량을 조절해요. 색은 컬러 필터로 골라요.</p>
        <p className="sign-note">TN 방식의 이상적인 기본 모형이에요. 전압과 밝기의 관계는 LCD 방식마다 달라요.</p>
      </section>
      <section className="biology-menu glass optics-panel">
        <div className="polar-row"><h2>OLED · 화소의 역할</h2><button type="button" className="glass-button optics-toggle" aria-pressed={emit} onClick={() => setEmit(!emit)}>발광 {emit ? 'ON' : 'OFF'}</button></div>
        <div className={`polar-oled${emit ? ' is-on' : ''}`}>{['R', 'G', 'B'].map(c => <span key={c} className={`c-${c}`}>{c}</span>)}
          <p>{emit ? '화소 자체가 빛을 내요' : '발광을 끄면 빛이 나오지 않아요'}</p><small>백라이트 없음 · 유기 발광층</small></div>
        <p>OLED는 발광 소자가 직접 빛을 내요. 바깥 빛의 반사를 줄이려고 원형 편광판을 쓰는 구조도 있고, 편광판을 없앤 구조도 있어요.</p>
        <p className="sign-note">RGB 직접 발광은 개념 모형이에요. 실제 제품은 백색 OLED + 컬러 필터 등 구조가 다양해요.</p>
      </section>
    </div>
    <section className="biology-menu glass optics-panel">
      <h2>화면 앞에 편광판을 겹치면</h2>
      <AngleControl label="바깥 선형 편광판" symbol="각도" value={outer} set={setOuter} />
      <div className="polar-swatches">
        <figure><div style={swatch(lcdOut)} /><figcaption>LCD 출력 (수평 선편광)<strong>{fmt(lcdOut, 0)}%</strong></figcaption></figure>
        <figure><div style={swatch(natural)} /><figcaption>자연광 · 이상적 원편광<strong>{fmt(natural, 0)}% · 일정</strong></figcaption></figure>
      </div>
      <p>LCD 출력은 대체로 선편광이라 바깥 편광판을 돌리면 밝기가 바뀌어요(말뤼스 법칙). 자연광이나 이상적인 원편광은 선형 편광판 한 장을 지난 세기가 각도와 관계없이 절반이에요.</p>
      <p><strong>‘OLED = 항상 원편광이 나온다’는 뜻은 아니에요.</strong> 반사 방지용 원형 편광판은 보통 선형 편광판 + ¼파장판이고, 층 순서와 패널 구조에 따라 화면의 편광 상태가 달라요.</p>
      <table className="polar-table wide"><thead><tr><th>항목</th><th>LCD</th><th>OLED</th></tr></thead><tbody>
        <tr><td>광원</td><td>별도의 백라이트</td><td>발광 화소</td></tr>
        <tr><td>밝기 조절</td><td>액정과 편광판으로 투과량 조절</td><td>발광 소자에 흐르는 전류 조절</td></tr>
        <tr><td>편광판 역할</td><td>화소의 빛 투과 조절</td><td>주로 바깥 빛 반사 억제 (구조별 차이)</td></tr>
      </tbody></table>
    </section>
  </>;
}

// ── 광자 정보 전송 (BB84 모형, 한 화면) ──────────────────────────────
const SIZES = [8, 12, 16, 24];
function PhotonLab() {
  const [n, setN] = useState(12);
  const [eve, setEve] = useState(false);
  const [plan, setPlan] = useState<Plan>(() => randomPlan(12, Math.random));
  const [photons, setPhotons] = useState<Photon[] | null>(null);
  const [sample, setSample] = useState<number[]>([]);
  const [message, setMessage] = useState('');
  const result = photons ? keyResult(photons, sample) : null;
  const reset = (size = n) => { setPlan(randomPlan(size, Math.random)); setPhotons(null); setSample([]); setMessage(''); };
  const send = () => { const sent = transmit(plan, eve, Math.random); setPhotons(sent); setSample(pickSample(sent.flatMap((p, i) => p.aBasis === p.bBasis ? [i] : []), Math.random)); setMessage(''); };
  const flip = (key: 'aBits' | 'aBases' | 'bBases' | 'eBases', i: number) => {
    if (photons) return;
    setPlan(p => ({ ...p, [key]: (p[key] ?? []).map((v, j) => j !== i ? v : key === 'aBits' ? (v ? 0 : 1) : (v === '+' ? '×' : '+')) }));
  };
  const bits = parseBits(message);
  const usable = result?.safe ? result.aKey.length : 0;
  const tooLong = bits && bits.length > usable;
  const cipher = bits && result?.safe && !tooLong ? xor(bits, result.aKey) : null;
  const decoded = cipher && result ? xor(cipher, result.bKey) : null;
  const cell = (label: string, on: () => void, disabled: boolean) => <button type="button" className="glass-button polar-chip" disabled={disabled} onClick={on}>{label}</button>;
  const status = (i: number, p: Photon) => {
    if (p.aBasis !== p.bBasis) return '기준 다름 · 제외';
    if (sample.includes(i)) return p.aBit === p.bBit ? '검사 · 일치' : '검사 · 불일치';
    return '키 후보';
  };
  return <>
    <section className="biology-menu glass optics-panel">
      <h2>앨리스 · 밥 · 이브</h2>
      <p>앨리스는 비트와 편광 기준을 정해 광자를 보내고, 밥은 앨리스의 기준을 모른 채 측정 기준을 정해 측정해요. 이브는 중간에서 자기 기준으로 측정하고 그 결과대로 새 광자를 보내요.</p>
      <table className="polar-table wide polar-rules"><thead><tr><th>기준</th><th>비트 0</th><th>비트 1</th></tr></thead><tbody>
        <tr><td>+ 기준</td><td>수직 0° ↕</td><td>수평 90° ↔</td></tr><tr><td>× 기준</td><td>대각 45° ⤢</td><td>역대각 135° ⤡</td></tr></tbody></table>
      <p className="sign-note">+와 ×는 비트가 아니라 측정 기준이에요. 같은 기준으로 재면 비트가 그대로, 다른 기준이면 0 · 1이 반반으로 나와요.</p>
      <div className="optics-actions" role="group" aria-label="활동 설정">
        {SIZES.map(size => <button key={size} type="button" className="glass-button optics-toggle" aria-pressed={n === size} onClick={() => { setN(size); reset(size); }}>광자 {size}개</button>)}
        <button type="button" className="glass-button optics-toggle" aria-pressed={eve} onClick={() => { setEve(!eve); setPhotons(null); setSample([]); }}>도청자 이브 {eve ? '있음' : '없음'}</button>
      </div>
    </section>

    <section className="biology-menu glass optics-panel">
      <div className="polar-row"><h2>{photons ? '전송 기록' : '1. 선택표 만들기'}</h2>
        <div className="optics-actions">{photons ? <button type="button" className="glass-button" onClick={() => reset()}>새로 하기</button>
          : <><button type="button" className="glass-button" onClick={() => reset()}>무작위로 채우기</button><button type="button" className="glass-button polar-primary" onClick={send}>광자 보내기</button></>}</div></div>
      {!photons && <p className="optics-hint">칸을 눌러 비트(0 · 1)와 기준(+ · ×)을 바꿀 수 있어요. 무작위로 정하는 게 원칙이에요.</p>}
      <div className="polar-scroll"><table className="polar-table wide polar-photons">
        <thead><tr><th>#</th><th>앨리스 비트</th><th>앨리스 기준</th><th>보낸 편광</th>{eve && <><th>이브 기준</th>{photons && <th>이브 비트</th>}</>}<th>밥 기준</th>{photons && <><th>밥 비트</th><th>처리</th></>}</tr></thead>
        <tbody>{plan.aBits.map((bit, i) => {
          const p = photons?.[i];
          const row = status(i, p ?? { aBit: 0, aBasis: '+', bBasis: '×', bBit: 0 });
          return <tr key={i} className={p ? (p.aBasis !== p.bBasis ? 'is-out' : sample.includes(i) ? (p.aBit === p.bBit ? 'is-check' : 'is-bad') : 'is-key') : undefined}>
            <td>{i + 1}</td>
            <td>{cell(String(bit), () => flip('aBits', i), Boolean(photons))}</td>
            <td>{cell(plan.aBases[i], () => flip('aBases', i), Boolean(photons))}</td>
            <td>{ARROW[polOf(bit as Bit, plan.aBases[i] as Basis)]} {polOf(bit as Bit, plan.aBases[i] as Basis)}°</td>
            {eve && <><td>{cell(plan.eBases?.[i] ?? '+', () => flip('eBases', i), Boolean(photons))}</td>{p && <td>{p.eBit}</td>}</>}
            <td>{cell(plan.bBases[i], () => flip('bBases', i), Boolean(photons))}</td>
            {p && <><td>{p.bBit}</td><td>{row}</td></>}
          </tr>;
        })}</tbody></table></div>
    </section>

    {result && <section className="biology-menu glass optics-panel">
      <h2>2. 기준 비교 · 검사 · 정보 전송</h2>
      <dl className="optics-metrics polar-metrics">
        <div><dt>기준 일치</dt><dd>{result.kept.length}개</dd></div>
        <div><dt>검사 표본</dt><dd>{result.sample.length}개</dd></div>
        <div><dt>검사 중 불일치</dt><dd>{result.errors}개</dd></div>
        <div><dt>오류율</dt><dd>{result.rate === null ? '표본 없음' : `${fmt(result.rate * 100, 0)}%`}</dd></div>
      </dl>
      <p className="working">오류율 = 불일치 개수 ÷ 검사 표본 수 × 100 · 검사로 공개한 비트는 키에서 빼요.</p>
      {result.sample.length === 0 ? <p className="polar-alert">검사할 비트가 없어요. 다시 시행해요.</p>
        : result.errors > 0 ? <p className="polar-alert">검사 {result.sample.length}개 중 {result.errors}개 불일치 → 도청이나 전송 오류를 의심하고 키 후보를 모두 버려요.</p>
        : <>
          <p className="polar-ok">검사 {result.sample.length}개 중 불일치 0개. 남은 키 {result.aKey.length}비트로 메시지를 보낼 수 있어요. (오류를 못 찾았다고 도청이 없었다는 증명은 아니에요.)</p>
          <dl className="optics-metrics polar-metrics"><div><dt>앨리스 키</dt><dd className="mono">{result.aKey.join('') || '없음'}</dd></div><div><dt>밥 키</dt><dd className="mono">{result.bKey.join('') || '없음'}</dd></div></dl>
          <label className="observation-control">보낼 비트 메시지 (최대 {usable}비트)<input type="text" inputMode="numeric" value={message} placeholder="예: 1010" maxLength={usable || undefined} onChange={e => setMessage(e.target.value.replace(/[^01]/g, ''))} /></label>
          {cipher && decoded && <dl className="optics-metrics polar-metrics">
            <div><dt>암호문 (메시지 XOR 키)</dt><dd className="mono">{cipher.join('')}</dd></div>
            <div><dt>밥이 복호화</dt><dd className="mono">{decoded.join('')}</dd></div>
            <div><dt>결과</dt><dd>{decoded.join('') === message ? '같아요 · 전송 성공' : '달라요 · 키에 오류'}</dd></div></dl>}
        </>}
      <p className="sign-note">이브가 무작위 기준으로 모든 광자를 가로채 다시 보내면, 기준이 같은 비트에서 평균 오류율이 25%예요(이브가 기준을 틀릴 확률 ½ × 그때 밥이 틀릴 확률 ½). 표본이 작으면 실제 값은 달라요. 실제 양자 암호의 인증 · 오류 정정 · 프라이버시 증폭은 생략했어요.</p>
    </section>}
  </>;
}
