// 주민지T 「Ⅲ. 탄소 화합물과 반응」 오비탈 실습(6.5.0~): 혼성 오비탈 · σ/π와 회전 · 고리 스트레인을 3D로 돌려 보고, 문제로 확인한다.
// 화학 계산은 lib/orbital.ts, 3D 그림은 OrbitalScene.
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent, type ReactNode } from 'react';
import type { Direction } from '../../data/swipe-cards';
import { arrows, directionOf, directions, isTyping, keyDirections, SWIPE_DISTANCE } from '../../lib/directions';
import { playResult, playTick } from '../../lib/sound';
import {
  HYB_SOURCE, HYB_TEXT, MAX_BUILD_CARBONS, START_GRAPH, addCarbon, addReason, anglesAround, bentAngle, bondCounts, buildMolecule, flipTarget, formula, hybOf,
  makeQuestion, molecule, orbitalsOf, orderReason, piAlignment, removeFrom, ringAngle, setOrder, skeleton2D, stereoOf, toggleFlip, twist,
  type BuildGraph, type Hyb, type OrbitalQuestion, type QuizKind, type SceneMode,
} from '../../lib/orbital';
import { nameOf, render } from '../../lib/structure';
import MenuCard, { modalOpen, useEscape } from './MenuCard';
import OrbitalScene, { type AngleSpec } from './OrbitalScene';

type Page = 'menu' | 'build' | 'hybrid' | 'bond' | 'ring' | 'quiz';
const PAGE_TITLE: Record<Exclude<Page, 'menu'>, string> = { build: '직접 만들기', hybrid: '혼성 오비탈', bond: 'σ · π와 회전', ring: '고리 스트레인', quiz: '오비탈 문제' };
const fmt = (n: number) => `${Math.round(n * 10) / 10}°`.replace('.0°', '°');

export default function OrbitalLab({ onBack, start = 'menu' }: { onBack: () => void; start?: 'menu' | 'quiz' }) {
  const [page, setPage] = useState<Page>(start);
  const back = useCallback(() => { playTick(); if (page === 'menu' || (start === 'quiz' && page === 'quiz')) onBack(); else setPage('menu'); }, [page, start, onBack]);
  useEscape(back); // 한 단계만 뒤로(과목 메뉴까지 튀어 나가지 않게)

  if (page === 'menu') return <MenuCard topic="주민지T · 오비탈 실습" question="무엇을 돌려 볼까요?"
    up={{ label: '직접 만들기', note: '탄소를 붙여 오비탈 보기', onChoose: () => setPage('build') }}
    left={{ label: 'σ · π와 회전', note: '왜 C=C는 못 돌까?', onChoose: () => setPage('bond') }}
    right={{ label: '고리 스트레인', note: '굽은 겹침 · 의자형/보트형', onChoose: () => setPage('ring') }}
    onBack={onBack} backLabel="학습 메뉴">
    <div className="orbital-menu-extra">
      <p className="structure-menu-note glass">끌어서 돌리고, 두 손가락이나 휠로 확대해요.</p>
      <div className="orbital-chips">
        <button type="button" className="glass-button orbital-quiz-link" onClick={() => { playTick(); setPage('hybrid'); }}>혼성 오비탈 예시 →</button>
        <button type="button" className="glass-button orbital-quiz-link" onClick={() => { playTick(); setPage('quiz'); }}>오비탈 문제 풀기 →</button>
      </div>
    </div>
  </MenuCard>;

  return <main className="swipe-app biology-app structure-app orbital-app"><div className="biology-study">
    <header className="biology-header glass">
      <button type="button" className="glass-button" onClick={back}>{start === 'quiz' && page === 'quiz' ? '← 학습 메뉴' : '← 오비탈 실습'}</button>
      <h1>{PAGE_TITLE[page]}</h1>
    </header>
    {page === 'build' ? <BuildPage /> : page === 'hybrid' ? <HybridPage /> : page === 'bond' ? <BondPage /> : page === 'ring' ? <RingPage /> : <QuizPage />}
  </div></main>;
}

function Chips<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: { id: T; name: string }[]; onChange: (v: T) => void }) {
  return <div className="orbital-chips" role="group" aria-label={label}>
    {options.map(o => <button key={o.id} type="button" className="glass-button" aria-pressed={value === o.id} onClick={() => { playTick(); onChange(o.id); }}>{o.name}</button>)}
  </div>;
}
function Toggle({ on, onChange, children }: { on: boolean; onChange: (v: boolean) => void; children: ReactNode }) {
  return <button type="button" className="glass-button orbital-toggle" aria-pressed={on} onClick={() => onChange(!on)}>{children}</button>;
}
function Legend({ items }: { items: ('hybrid' | 'p' | 'h1s' | 'sigma' | 'pi' | 'flag')[] }) {
  const text = { hybrid: '혼성 오비탈', p: '남는 p 오비탈', h1s: 'H의 1s 오비탈', sigma: 'σ 겹침(정면)', pi: 'π 겹침(측면)', flag: '서로 밀어내는 H' };
  return <ul className="orbital-legend">{items.map(i => <li key={i}><i className={`swatch is-${i}`} />{text[i]}</li>)}</ul>;
}

// ── 혼성 오비탈 ─────────────────────────────────────────────────────────
const HYB_MOLS = [{ id: 'methane', name: '메테인' }, { id: 'ethene', name: '에텐' }, { id: 'ethyne', name: '에타인' }, { id: 'propene', name: '프로펜' }, { id: 'propyne', name: '프로파인' }];
const HYB_INFO: Record<Hyb, { mix: string; shape: string; left: string }> = {
  sp3: { mix: 's 1개 + p 3개 → 혼성 오비탈 4개', shape: '정사면체로 퍼져요', left: '남는 p 오비탈이 없어 단일 결합만 만들어요.' },
  sp2: { mix: 's 1개 + p 2개 → 혼성 오비탈 3개', shape: '한 평면에서 삼각형으로 퍼져요', left: '남는 p 오비탈 1개가 옆 탄소의 p와 측면으로 겹쳐 π 결합 1개를 만들어요.' },
  sp: { mix: 's 1개 + p 1개 → 혼성 오비탈 2개', shape: '일직선으로 퍼져요', left: '남는 p 오비탈 2개가 서로 수직으로 π 결합 2개를 만들어요.' },
};
// ── 직접 만들기 ─────────────────────────────────────────────────────────
// 탄소를 고르고 단일 · 이중 · 삼중 결합으로 탄소를 붙이면, 수소가 저절로 채워지고 혼성에 맞는 3D 모양 · 오비탈이 바로 바뀐다.
const ORDER_LABEL: Record<1 | 2 | 3, string> = { 1: 'C–C 단일', 2: 'C=C 이중', 3: 'C≡C 삼중' };
const ORDERS = [1, 2, 3] as const;
/** 막힌 결합들의 이유를 한 줄로: “빈 자리가 1개라 이중 · 삼중 결합은 못 붙여요”. */
function blockedText(blocked: { o: 1 | 2 | 3; why: string | null }[]) {
  const room = blocked.filter(b => b.why?.startsWith('빈 자리가'));
  const free = room[0]?.why?.match(/빈 자리가 (\d)개/)?.[1];
  const parts = room.length ? [`빈 자리가 ${free}개라 ${room.map(b => ['', '단일', '이중', '삼중'][b.o]).join(' · ')} 결합은 못 붙여요`] : [];
  for (const b of blocked) if (b.why && !b.why.startsWith('빈 자리가') && !parts.includes(b.why)) parts.push(b.why);
  return parts.join(' · ');
}
function BuildPage() {
  const [graph, setGraph] = useState<BuildGraph>(START_GRAPH);
  const [selected, setSelected] = useState(0);
  const [history, setHistory] = useState<{ graph: BuildGraph; selected: number }[]>([]);
  const [orbitals, setOrbitals] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const [showPi, setShowPi] = useState(true);
  const [showSigma, setShowSigma] = useState(false);
  const mol = useMemo(() => buildMolecule(graph), [graph]);
  const sel = Math.min(selected, graph.length - 1);
  const hyb = hybOf(mol, sel)!;
  const set = orbitalsOf(mol, sel)!;
  const around = anglesAround(mol, sel);
  const angles: AngleSpec[] = useMemo(() => showAngles ? (hyb === 'sp' ? around.slice(0, 1) : around.slice(0, 3)).map(a => ({ center: sel, a: a.a, b: a.b })) : [], [showAngles, around, sel, hyb]);
  const { sigma, pi } = bondCounts(mol);
  const named = useMemo(() => nameOf(skeleton2D(mol)), [mol]);
  // 고른 탄소가 걸린 이중 결합 먼저, 없으면 분자 안의 아무 이중 결합(시스 · 트랜스가 되는 것).
  const flipAt = [sel, ...graph.map((_, k) => k)].map(k => flipTarget(graph, k)).find(k => k >= 0) ?? -1;
  const parent = graph[sel].parent;

  const commit = useCallback((next: BuildGraph, nextSelected: number) => {
    setHistory(h => [...h.slice(-40), { graph, selected: sel }]);
    setGraph(next); setSelected(nextSelected); playTick();
  }, [graph, sel]);
  const add = useCallback((order: 1 | 2 | 3) => { if (!addReason(graph, sel, order)) commit(addCarbon(graph, sel, order), graph.length); }, [graph, sel, commit]);
  const bond = (order: 1 | 2 | 3) => { if (order !== graph[sel].order && !orderReason(graph, sel, order)) commit(setOrder(graph, sel, order), sel); };
  const remove = useCallback(() => {
    if (graph.length === 1) return;
    const { graph: next, map } = removeFrom(graph, sel);
    commit(next, sel === 0 ? 0 : Math.max(0, map[graph[sel].parent]));
  }, [graph, sel, commit]);
  const undo = useCallback(() => {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory(h => h.slice(0, -1)); setGraph(last.graph); setSelected(last.selected); playTick();
  }, [history]);
  // PC: 1 · 2 · 3 = 붙이기, Delete = 지우기, Z = 되돌리기(방향키는 모형 돌리기).
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event) || modalOpen() || event.altKey || event.metaKey) return;
      if (event.key === '1' || event.key === '2' || event.key === '3') { event.preventDefault(); add(Number(event.key) as 1 | 2 | 3); }
      else if (event.key === 'Delete' || event.key === 'Backspace') { event.preventDefault(); remove(); }
      else if (event.key.toLowerCase() === 'z') { event.preventDefault(); undo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [add, remove, undo]);

  const blocked = ORDERS.map(o => ({ o, why: addReason(graph, sel, o) })).filter(x => x.why);
  const info = HYB_INFO[hyb];
  return <section className="biology-menu glass orbital-panel">
    <div className="orbital-controls">
      <div className="orbital-chips" role="group" aria-label="탄소 고르기">
        {graph.map((_, k) => <button key={k} type="button" className="glass-button" aria-pressed={k === sel} onClick={() => { playTick(); setSelected(k); }}>C{k + 1} · {HYB_TEXT[hybOf(mol, k)!]}</button>)}
      </div>
      <div className="orbital-chips">
        <Toggle on={orbitals} onChange={setOrbitals}>오비탈</Toggle>
        {orbitals && <Toggle on={showSigma} onChange={setShowSigma}>σ 겹침</Toggle>}
        <Toggle on={showPi} onChange={setShowPi}>π 겹침</Toggle>
        <Toggle on={showAngles} onChange={setShowAngles}>결합각</Toggle>
      </div>
    </div>
    <div className="orbital-body is-build">
      <OrbitalScene mol={mol} mode={orbitals ? 'orbital' : 'ball'} highlight={sel} angles={angles} sigma={showSigma} pi={showPi} onPick={i => { if (i < graph.length) { playTick(); setSelected(i); } }}
        keyboard viewKey="build" view={[0.3, 0.15]} label={`직접 만든 분자 ${formula(mol)} 3D 모형, 고른 탄소 C${sel + 1}은 ${HYB_TEXT[hyb]} 혼성`} />
      <aside className="orbital-info">
        <h2>{named.ok ? render(named.plan) : '이름 없음'} <small>{formula(mol)} · σ {sigma} · π {pi}</small></h2>
        {!named.ok && <p className="structure-source">{named.reason}</p>}
        <div className="orbital-build-box">
          <p className="orbital-build-title">빛나는 <b>C{sel + 1}</b>에 탄소 붙이기</p>
          <div className="orbital-build-row">
            {ORDERS.map(o => <button key={o} type="button" className="glass-button orbital-build-add" disabled={Boolean(addReason(graph, sel, o))} onClick={() => add(o)}>
              <kbd>{o}</kbd> {ORDER_LABEL[o]}</button>)}
          </div>
          {blocked.length > 0 && <p className="orbital-build-why">{blockedText(blocked)}</p>}
          {parent >= 0 && <>
            <p className="orbital-build-title">C{parent + 1}–C{sel + 1} 결합 바꾸기</p>
            <div className="orbital-build-row">
              {ORDERS.map(o => { const why = orderReason(graph, sel, o); return <button key={o} type="button" className="glass-button" aria-pressed={graph[sel].order === o}
                disabled={graph[sel].order !== o && Boolean(why)} title={why ?? undefined} onClick={() => bond(o)}>{['', '단일', '이중', '삼중'][o]}</button>; })}
            </div>
          </>}
          <div className="orbital-build-row">
            {flipAt >= 0 && <button type="button" className="glass-button" onClick={() => commit(toggleFlip(graph, flipAt), sel)}>시스 ↔ 트랜스</button>}
            <button type="button" className="glass-button" disabled={graph.length === 1} onClick={remove}>{sel === 0 ? '처음부터' : `C${sel + 1}부터 지우기`}</button>
            <button type="button" className="glass-button" disabled={!history.length} onClick={undo}>되돌리기</button>
          </div>
        </div>
        <p className="orbital-big">C{sel + 1}: <b>{HYB_TEXT[hyb]} 혼성</b> · 혼성 오비탈 {set.lobes.length}개 · 남는 p {set.p.length}개</p>
        <ul>
          <li>{info.mix} · {info.shape}</li>
          <li>결합각 {[...new Set(around.map(a => fmt(a.angle)))].join(' · ') || '—'} (모형에서 잰 값)</li>
          <li>{info.left}</li>
        </ul>
        <p className="structure-source">탄소를 누르거나 위 C 버튼으로 골라요. 수소는 남는 자리에 저절로 붙어요. 탄소는 {MAX_BUILD_CARBONS}개까지, 고리는 ‘고리 스트레인’에서 봐요. 근거: 주민지T {HYB_SOURCE[hyb]}</p>
        {orbitals && <Legend items={[...(['hybrid', 'p', 'h1s'] as const), ...(showSigma ? ['sigma' as const] : []), ...(showPi && pi ? ['pi' as const] : [])]} />}
      </aside>
    </div>
  </section>;
}

function HybridPage() {
  const [molId, setMolId] = useState('methane');
  const [orbitals, setOrbitals] = useState(true);
  const [showAngles, setShowAngles] = useState(true);
  const mol = molecule(molId);
  const carbons = useMemo(() => mol.atoms.map((_, i) => i).filter(i => mol.atoms[i].el === 'C'), [mol]);
  const [picked, setPicked] = useState(0);
  useEffect(() => setPicked(carbons[0]), [carbons]);
  const atom = carbons.includes(picked) ? picked : carbons[0];
  const hyb = hybOf(mol, atom)!;
  const set = orbitalsOf(mol, atom)!;
  const around = anglesAround(mol, atom);
  const angles: AngleSpec[] = useMemo(() => showAngles ? (hyb === 'sp' ? around.slice(0, 1) : around.slice(0, 3)).map(a => ({ center: atom, a: a.a, b: a.b })) : [], [showAngles, around, atom, hyb]);
  const measured = [...new Set(around.map(a => fmt(a.angle)))];
  const info = HYB_INFO[hyb];
  return <section className="biology-menu glass orbital-panel">
    <div className="orbital-controls">
      <Chips label="분자" value={molId} options={HYB_MOLS} onChange={setMolId} />
      <div className="orbital-chips">
        <Toggle on={orbitals} onChange={setOrbitals}>오비탈</Toggle>
        <Toggle on={showAngles} onChange={setShowAngles}>결합각</Toggle>
      </div>
    </div>
    <div className="orbital-body">
      <OrbitalScene mol={mol} mode={orbitals ? 'orbital' : 'ball'} highlight={atom} angles={angles} onPick={setPicked} keyboard viewKey={molId} view={[0.35, 0.5]}
        label={`${mol.name} 3D 모형, 빛나는 탄소는 ${HYB_TEXT[hyb]} 혼성`} />
      <aside className="orbital-info">
        {carbons.length > 1 && <div className="orbital-chips" role="group" aria-label="탄소 고르기">
          {carbons.map((c, k) => <button key={c} type="button" className="glass-button" aria-pressed={c === atom} onClick={() => { playTick(); setPicked(c); }}>탄소 {k + 1} · {HYB_TEXT[hybOf(mol, c)!]}</button>)}
        </div>}
        <h2>{mol.name} <small>{formula(mol)}</small></h2>
        <p className="orbital-big">빛나는 탄소: <b>{HYB_TEXT[hyb]} 혼성</b></p>
        <ul>
          <li>{info.mix} · {info.shape}</li>
          <li>결합각 {measured.join(' · ')} (모형에서 잰 값)</li>
          <li>혼성 오비탈 {set.lobes.length}개가 이웃 원자와 정면으로 겹쳐 σ 결합 {set.lobes.length}개</li>
          <li>{info.left}</li>
        </ul>
        <p className="structure-source">근거: 주민지T {HYB_SOURCE[hyb]} · 탄소를 누르거나 위 버튼으로 바꿔 봐요.</p>
        {orbitals && <Legend items={set.p.length ? ['hybrid', 'p', 'h1s'] : ['hybrid', 'h1s']} />}
      </aside>
    </div>
  </section>;
}

// ── σ · π와 회전 ────────────────────────────────────────────────────────
const BOND_MOLS = [{ id: 'ethane', name: '에테인 C–C' }, { id: 'ethene', name: '에텐 C=C' }, { id: 'cis-2-butene', name: '2-뷰텐 C=C' }];
function BondPage() {
  const [molId, setMolId] = useState('ethene');
  const [angle, setAngle] = useState(0);
  const [all, setAll] = useState(false);
  const base = molecule(molId);
  const [a, b] = base.axis!;
  const mol = useMemo(() => angle ? twist(base, a, b, angle) : base, [base, a, b, angle]);
  const single = molId === 'ethane';
  const align = single ? 1 : piAlignment(mol, a, b);
  const shape = stereoOf(mol);
  const mode: SceneMode = single || all ? 'orbital' : 'p';
  const { sigma, pi } = bondCounts(molecule(molId));
  const piState = align > 0.95 ? 'π 결합 있음' : align > 0.2 ? 'π 겹침이 줄어 결합이 약해져요' : 'π 결합 끊김';
  return <section className="biology-menu glass orbital-panel">
    <div className="orbital-controls">
      <Chips label="분자" value={molId} options={BOND_MOLS} onChange={id => { setMolId(id); setAngle(0); }} />
      {!single && <div className="orbital-chips"><Toggle on={all} onChange={setAll}>혼성 오비탈 · σ도 보기</Toggle></div>}
    </div>
    <div className="orbital-body">
      <OrbitalScene mol={mol} mode={mode} sigma pi keyboard viewKey={molId} view={[0.5, 0.65]} label={`${base.name}의 한쪽을 ${angle}° 돌린 모형`} />
      <aside className="orbital-info">
        <label className="orbital-slider">
          <span>오른쪽 탄소를 C{single ? '–' : '='}C 축으로 돌리기 <b>{angle}°</b></span>
          <input type="range" min={0} max={180} step={5} value={angle} onChange={e => setAngle(Number(e.target.value))} />
        </label>
        <div className="orbital-chips">{[0, 45, 90, 135, 180].map(t => <button key={t} type="button" className="glass-button" aria-pressed={angle === t} onClick={() => { playTick(); setAngle(t); }}>{t}°</button>)}</div>
        {single ? <>
          <p className="orbital-big">σ 결합만 있어요 · <b>자유롭게 돌아요</b></p>
          <ul>
            <li>sp³ 오비탈이 C–C 축을 따라 정면으로 겹쳐요(σ, 노랑).</li>
            <li>축을 중심으로 돌려도 겹치는 모양이 그대로라 결합이 끊어지지 않아요.</li>
          </ul>
        </> : <>
          <div className="orbital-meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(align * 100)} aria-label="두 p 오비탈이 나란한 정도">
            <span>두 p 오비탈이 나란한 정도</span><b>{Math.round(align * 100)}%</b><i style={{ width: `${align * 100}%` }} />
          </div>
          <p className={`orbital-big${align <= 0.2 ? ' is-broken' : ''}`}>{piState}{shape && molId !== 'ethene' ? <> · 지금 <b>{shape === 'cis' ? '시스' : '트랜스'}</b> 모양</> : null}</p>
          <ul>
            <li>C=C는 σ 1개(정면) + π 1개(p 오비탈이 측면으로 겹침)예요.</li>
            <li>돌리면 두 p가 어긋나고, 90°에서 수직이 되어 π 결합이 끊어져요.</li>
            <li>π를 끊어야만 돌 수 있으니 C=C는 실온에서 자유 회전을 못 해요{molId !== 'ethene' ? '. 그래서 시스와 트랜스가 서로 바뀌지 않아요' : ''}.</li>
          </ul>
        </>}
        <p className="structure-source">분자 전체 σ {sigma}개 · π {pi}개 · 근거: 주민지T PPT 4 · 3{molId !== 'ethane' ? '~4' : ''} · 6쪽</p>
        <Legend items={mode === 'orbital' ? ['hybrid', 'p', 'h1s', 'sigma', 'pi'] : ['p', 'pi']} />
      </aside>
    </div>
  </section>;
}

// ── 고리 스트레인 ───────────────────────────────────────────────────────
const RING_MOLS = [{ id: 'cyclopropane', name: '사이클로프로페인' }, { id: 'cyclobutane', name: '사이클로뷰테인' }, { id: 'cyclopentane', name: '사이클로펜테인' }, { id: 'chair', name: '사이클로헥세인 의자형' }, { id: 'boat', name: '보트형' }];
function RingPage() {
  const [molId, setMolId] = useState('cyclopropane');
  const [orbitals, setOrbitals] = useState(true);
  // 의자형 · 보트형은 H 위치를 보는 거라 처음엔 공 · 막대 모형으로.
  const pickRing = (id: string) => { setMolId(id); setOrbitals(id !== 'chair' && id !== 'boat'); };
  const [showAngles, setShowAngles] = useState(true);
  const mol = molecule(molId);
  const r = mol.ring!;
  const angle = ringAngle(mol), bent = bentAngle(angle);
  const angles: AngleSpec[] = useMemo(() => showAngles ? [{ center: r[1], a: r[0], b: r[2] }] : [], [showAngles, r]);
  const six = molId === 'chair' || molId === 'boat';
  const strained = molId === 'cyclopropane' || molId === 'cyclobutane';
  return <section className="biology-menu glass orbital-panel">
    <div className="orbital-controls">
      <Chips label="고리" value={molId} options={RING_MOLS} onChange={pickRing} />
      <div className="orbital-chips">
        <Toggle on={orbitals} onChange={setOrbitals}>오비탈 겹침</Toggle>
        <Toggle on={showAngles} onChange={setShowAngles}>결합각</Toggle>
      </div>
    </div>
    <div className="orbital-body">
      <OrbitalScene mol={mol} mode={orbitals ? 'orbital' : 'ball'} strain sigma angles={angles} flagpole={molId === 'boat'} keyboard viewKey={molId} view={six ? [0.3, 0.35] : [0.9, 0.3]}
        label={`${mol.name} 3D 모형, 고리 결합각 약 ${fmt(angle)}`} />
      <aside className="orbital-info">
        <h2>{mol.name} <small>{formula(mol)}</small></h2>
        <p className="orbital-big">고리 결합각 약 <b>{fmt(angle)}</b>{molId === 'cyclobutane' ? ' (주름진 사각형)' : ''}</p>
        {six ? <ul>
          <li>평면이 아니라 “주름잡힌” 고리예요. 결합각이 정사면체각(109.5°)에 아주 가까워 sp³ 오비탈이 정면에서 겹쳐요.</li>
          {molId === 'boat'
            ? <li><b>보트형</b>: 위쪽 두 H(빨강)가 서로 가까워 반발력이 커요 → 의자형이 더 안정해요.</li>
            : <li><b>의자형</b>: 서로 부딪히는 H가 없어요. 보트형으로 바꿔 위쪽 H를 비교해 봐요.</li>}
          <li>25℃에서 사이클로헥세인은 99% 이상 의자형으로 있어요.</li>
        </ul> : <ul>
          <li>sp³ 오비탈은 서로 109.5°로 벌어지려 해요. 고리 결합각이 {fmt(angle)}라서, 오비탈이 C–C 축에서 약 <b>{fmt(bent)}</b> 비껴 겹쳐요(노랑이 축 바깥에 생겨요).</li>
          <li>{strained ? '정면으로 효율적으로 겹치지 못하니 결합이 약하고 스트레인이 커서 반응성이 커요.' : '정사면체각에 아주 가까워 거의 정면으로 겹쳐요 → 강한 C–C 결합, 매우 안정해요.'}</li>
        </ul>}
        <p className="structure-source">근거: 주민지T PPT 3 · {six ? '2' : molId === 'cyclopropane' ? '1' : '1~2'}쪽{molId === 'cyclopentane' ? ' · 실제처럼 한 탄소가 살짝 접힌 봉투 모양 모형이에요' : ''}</p>
        {orbitals && <Legend items={molId === 'boat' ? ['hybrid', 'h1s', 'sigma', 'flag'] : ['hybrid', 'h1s', 'sigma']} />}
      </aside>
    </div>
  </section>;
}

// ── 문제 ───────────────────────────────────────────────────────────────
const KIND_NAME: Record<QuizKind, string> = { hyb: '혼성', count: 'σ · π 개수', cistrans: '시스-트랜스', ring: '고리', chair: '의자형 · 보트형', twist: '회전' };
function QuizPage() {
  const [q, setQ] = useState<OrbitalQuestion>(() => makeQuestion());
  const [n, setN] = useState(0);
  const [picked, setPicked] = useState<Direction | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const slots = useMemo(() => Object.fromEntries(directions.map((d, i) => [d, q.choices[i]])) as Record<Direction, string>, [q]);
  const answer = directions.find(d => slots[d] === q.answer)!;
  const next = useCallback(() => { setPicked(null); setQ(old => makeQuestion(Math.random, old.kind)); setN(x => x + 1); playTick(); }, []);
  const choose = useCallback((d: Direction) => {
    if (picked) { next(); return; }
    const ok = d === answer;
    setPicked(d);
    setScore(s => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
    playResult(ok);
  }, [picked, answer, next]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event) || modalOpen()) return;
      if (picked && (event.key === 'Enter' || event.code === 'Space')) { event.preventDefault(); next(); return; }
      const d = keyDirections[event.key];
      if (!d) return;
      event.preventDefault();
      if (!event.repeat) choose(d);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose, picked, next]);
  const release = (event: PointerEvent<HTMLElement>) => {
    if (!pointer.current || pointer.current.id !== event.pointerId) return;
    const dx = event.clientX - pointer.current.x, dy = event.clientY - pointer.current.y;
    pointer.current = null; setDrag({ x: 0, y: 0 });
    if (Math.hypot(dx, dy) >= SWIPE_DISTANCE) choose(directionOf(dx, dy));
    else if (picked) next();
  };
  // 답을 고르면 숨겨 둔 오비탈 · 겹침을 보여 준다.
  const mode: SceneMode = picked && (q.kind === 'hyb' || q.kind === 'count' || q.kind === 'ring') ? 'orbital' : q.mode;
  const ok = picked === answer;
  return <section className="biology-menu glass orbital-panel">
    <div className="structure-top"><p className="orbital-kind">{KIND_NAME[q.kind]}</p><p className="structure-score">맞힌 문제 <b>{score.right}</b> / {score.total}</p></div>
    <div className="orbital-body is-quiz">
      <OrbitalScene mol={q.mol} mode={mode} highlight={q.highlight} strain={q.kind === 'ring'} sigma={Boolean(picked) && (q.kind === 'ring' || q.kind === 'count')} pi={q.kind === 'twist' || Boolean(picked)}
        flagpole={Boolean(picked) && q.kind === 'chair'} view={q.view} viewKey={String(n)} label="문제 3D 모형. 끌어서 돌려 보세요" />
      <div className="orbital-quiz">
        <div className="orbital-ask" style={{ transform: `translate(${drag.x * 0.3}px, ${drag.y * 0.3}px) rotate(${drag.x * 0.02}deg)` }}
          onPointerDown={event => { pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }}
          onPointerMove={event => { if (pointer.current?.id === event.pointerId) setDrag({ x: event.clientX - pointer.current.x, y: event.clientY - pointer.current.y }); }}
          onPointerUp={release} onPointerCancel={() => { pointer.current = null; setDrag({ x: 0, y: 0 }); }}>
          <p>{q.ask}</p>
          <small>왼쪽 모형은 끌어서 돌려요 · 이 카드는 밀어서 답해요</small>
        </div>
        <div className="orbital-choices">
          {directions.map(d => <button key={d} type="button" className={`structure-choice choice-${d}${picked ? (d === answer ? ' is-right' : d === picked ? ' is-wrong' : ' is-dim') : ''}`} onClick={() => choose(d)}>
            <kbd>{arrows[d]}</kbd><span>{slots[d]}</span></button>)}
        </div>
        {picked ? <div className={`structure-result ${ok ? 'is-right' : 'is-wrong'}`} role="status">
          <h2>{ok ? '정답이에요!' : '아쉬워요'} · {q.answer}</h2>
          <ul>{q.explain.map((line, i) => <li key={i}>{line}</li>)}</ul>
          <p className="structure-source">근거: 주민지T {q.source}{mode === 'orbital' && q.mode !== 'orbital' ? ' · 모형에 오비탈을 띄웠어요' : ''}</p>
          <button type="button" className="glass-button is-primary" onClick={next} ref={el => el?.focus({ preventScroll: true })}>다음 문제 →</button>
        </div> : <p className="structure-hint">방향키, 카드 밀기, 보기 누르기 모두 돼요.</p>}
      </div>
    </div>
  </section>;
}
