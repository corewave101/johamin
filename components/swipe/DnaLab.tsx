// 박상영T 수행평가 대비 실습(5.0.0~): 마이크로피펫 · 구강상피세포 DNA 추출(스핀 컬럼) · NanoDrop 정량.
// 단계별 애니메이션: ← → (또는 밀기 · 버튼)로 한 단계씩 넘기고, 장면은 CSS 전환으로 움직인다. 계산은 lib/dna-lab.ts.
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import MenuCard from './MenuCard';
import DnaProtocol from './DnaProtocol';
import {
  CONTAMINANTS, MODELS, PIPETTES, displayValue, dnaConcentration, inRange, judge230, judge280, measure, pickPipette, ratios, totalYield,
  type Contaminant, type Digits, type PipetteModel,
} from '../../lib/dna-lab';

type Page = 'menu' | 'protocol' | 'pipette' | 'inside';
type Step = { title: string; text: string; points?: string[] };

export default function DnaLab({ onBack }: { onBack: () => void }) {
  const [page, setPage] = useState<Page>('menu');
  const back = useCallback(() => { if (page === 'menu') onBack(); else setPage('menu'); }, [page, onBack]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault(); e.stopImmediatePropagation(); if (!e.repeat) back();
    };
    window.addEventListener('keydown', key, true); return () => window.removeEventListener('keydown', key, true);
  }, [back]);

  if (page === 'menu') return <MenuCard topic="박상영T · 수행평가 대비" question="어떤 장면을 볼까요?"
    up={{ label: '실험 따라하기', note: '채취부터 NanoDrop까지', onChoose: () => setPage('protocol') }}
    left={{ label: '피펫 속 원리', note: '1단 · 2단 · 표시창', onChoose: () => setPage('pipette') }}
    right={{ label: '막 속 · 순도', note: 'DNA 위치 · 비율 해석', onChoose: () => setPage('inside') }}
    onBack={onBack} backLabel="학습 메뉴">
    <div className="observation-note glass"><p>실험대 위에서 손이 피펫을 들고 시약을 옮기는 장면으로 실험 전체를 따라가요. ← → 로 단계를 넘기고, 원리가 궁금하면 피펫 속 · 막 속 장면을 보세요.</p></div>
  </MenuCard>;

  const title = page === 'protocol' ? '실험 따라하기' : page === 'pipette' ? '피펫 속 원리' : '막 속 · 순도';
  return <main className="swipe-app biology-app optics-app dna-app"><div className="biology-study">
    <header className="biology-header glass"><button type="button" className="glass-button" onClick={back}>← 장면 선택</button><h1>수행 대비 · {title}</h1></header>
    {page === 'protocol' ? <DnaProtocol /> : page === 'pipette' ? <PipetteScene /> : <InsideScene />}
    <p className="dna-foot">수행평가 설명서(구강상피세포 DNA 추출 · NanoDrop One) 기반 · 그림은 원리를 보여 주는 도식이에요.</p>
  </div></main>;
}

/** 단계 넘기기: ← → 키, 장면 밀기, 버튼. */
function useSteps(count: number) {
  const [at, setAt] = useState(0);
  const go = useCallback((d: number) => setAt(i => Math.min(count - 1, Math.max(0, i + d))), [count]);
  useEffect(() => { setAt(i => Math.min(i, count - 1)); }, [count]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA')) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    };
    window.addEventListener('keydown', key); return () => window.removeEventListener('keydown', key);
  }, [go]);
  const start = useRef<number | null>(null);
  const swipe = {
    onPointerDown: (e: React.PointerEvent) => { start.current = e.clientX; },
    onPointerUp: (e: React.PointerEvent) => { if (start.current === null) return; const dx = e.clientX - start.current; start.current = null; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); },
  };
  return { at, setAt, go, swipe };
}

function Stepper({ steps, at, go, setAt, children, swipe, label }: { steps: Step[]; at: number; go: (d: number) => void; setAt: (i: number) => void; children: ReactNode; swipe: object; label: string }) {
  const step = steps[at];
  return <section className="dna-scene">
    <div className="dna-stage" aria-label={label} {...swipe}>{children}</div>
    <div className="dna-step glass" aria-live="polite">
      <div className="dna-step-kicker">{at + 1} / {steps.length}단계</div>
      <h2>{step.title}</h2>
      <p>{step.text}</p>
      {step.points && <ul>{step.points.map(p => <li key={p}>{p}</li>)}</ul>}
    </div>
    <div className="dna-controls">
      <button type="button" className="glass-button" onClick={() => go(-1)} disabled={at === 0}>← 이전</button>
      <div className="dna-dots" role="tablist" aria-label="단계">{steps.map((s, i) => <button type="button" key={s.title} role="tab" aria-selected={i === at} aria-label={`${i + 1}단계 ${s.title}`} onClick={() => setAt(i)} />)}</div>
      <button type="button" className="glass-button" onClick={() => go(1)} disabled={at === steps.length - 1}>다음 →</button>
    </div>
  </section>;
}

/* ───────────── 마이크로피펫 ───────────── */

type PipMode = 'forward' | 'reverse' | 'mistake';
type Pip = { press: 0 | 1 | 2; dip: number; liquid: number; extra?: number; at: 'source' | 'target'; tipOff?: boolean; tilt?: number; bubble?: boolean; outside?: boolean; lying?: boolean; labels?: boolean; air?: 'out' | 'in' };
const PIP_STEPS: Record<PipMode, (Step & { s: Pip })[]> = {
  forward: [
    { title: '구조부터', text: '맨 위 플런저를 눌러 빨아들이고 내보내요. 사용한 팁은 팁 이젝터 버튼으로 손대지 않고 버려요.', points: ['용량 조절 휠로 돌려 맞추고, 표시창에서 숫자로 확인', '샤프트(노즐)에 일회용 팁을 끼움 · 액체는 팁에만 닿음'], s: { press: 0, dip: 0, liquid: 0, at: 'source', labels: true } },
    { title: '용량 맞추기', text: '목표 눈금보다 조금 높게 돌렸다가 내려서 맞춰요. 기어 유격 오차(백래시)를 막기 위해서예요.', points: ['범위 밖으로 돌리면 정밀도가 깨지고 부품이 망가짐'], s: { press: 0, dip: 0, liquid: 0, at: 'source' } },
    { title: '공중에서 1단까지', text: '액체에 담그기 전에, 첫 번째 저항이 느껴지는 1단까지 눌러요. 피스톤이 설정 용량만큼 공기를 밀어내요.', s: { press: 1, dip: 0, liquid: 0, at: 'source', air: 'out' } },
    { title: '2~3 mm 수직으로 담그기', text: '팁 끝을 수면 아래 2~3 mm만, 똑바로 세워 담가요.', points: ['너무 깊게 · 기울여 담그면 팁 바깥에 묻어 과다 흡입'], s: { press: 1, dip: 1, liquid: 0, at: 'source' } },
    { title: '천천히 놓고 1초 기다리기', text: '플런저를 천천히 놓으면 피스톤이 올라가며 부분 진공이 생기고, 대기압이 액체를 피스톤이 움직인 부피만큼 밀어 올려요. 피스톤과 액체 사이 공기층(air cushion)은 그대로 남아요.', points: ['공기 치환 방식: 액체는 피스톤에 닿지 않음'], s: { press: 0, dip: 1, liquid: 1, at: 'source', air: 'in' } },
    { title: '벽에 대고 1단까지', text: '받을 튜브 벽에 팁을 대고 1단까지 눌러 내보내요. 팁 끝에 방울이 조금 남아요.', s: { press: 1, dip: 1, liquid: 0.12, at: 'target' } },
    { title: '2단까지: 블로우아웃', text: '1단을 지나 끝(2단)까지 눌러 남은 방울까지 모두 내보내요. 이것이 정방향 피펫팅이에요.', points: ['정방향: 물 · 완충액 · DNA 용출액 등 대부분의 수용액'], s: { press: 2, dip: 1, liquid: 0, at: 'target' } },
    { title: '팁 버리기', text: '팁 이젝터 버튼으로 팁을 폐기통에 밀어 버려요. 시약이 바뀔 때마다 새 팁, 팁 상자 뚜껑은 팁을 끼운 직후마다 닫아요.', s: { press: 0, dip: 0, liquid: 0, at: 'target', tipOff: true } },
  ],
  reverse: [
    { title: '언제 쓰나요?', text: '역방향 피펫팅은 계면활성제가 든 세포 용해액처럼 끈적이거나 거품이 잘 나는 용액, 휘발성 용액에 써요.', points: ['이번 실험: 용해 완충액이 섞인 혼합액'], s: { press: 0, dip: 0, liquid: 0, at: 'source' } },
    { title: '공중에서 2단까지', text: '정방향과 반대로, 공중에서 끝(2단)까지 눌러요.', s: { press: 2, dip: 0, liquid: 0, at: 'source', air: 'out' } },
    { title: '담그고 천천히 놓기', text: '담근 뒤 천천히 놓으면 설정 용량에 여분까지 더 빨려 들어와요.', s: { press: 0, dip: 1, liquid: 1, extra: 0.22, at: 'source', air: 'in' } },
    { title: '1단까지만 배출', text: '1단까지만 눌러 설정 용량만 내보내요. 끝까지 누르지 않으니 기포가 생기지 않아요.', s: { press: 1, dip: 1, liquid: 0, extra: 0.22, at: 'target' } },
    { title: '여분은 팁째 버리기', text: '팁에 남은 여분은 2단(블로우아웃)으로 빼지 않고 팁과 함께 버려요.', points: ['정방향: 흡입 1단 · 배출 2단', '역방향: 흡입 2단 · 배출 1단'], s: { press: 0, dip: 0, liquid: 0, extra: 0.22, at: 'target', tipOff: true } },
  ],
  mistake: [
    { title: '기울이거나 깊게 담그기', text: '팁 바깥 표면에 액체가 묻어 설정 용량보다 많이 옮겨져요.', s: { press: 0, dip: 1.6, liquid: 1, at: 'source', tilt: -18, outside: true } },
    { title: '플런저를 튕기듯 놓기', text: '액체가 샤프트(몸체) 안으로 튀어 올라 오염 · 고장이 나고, 팁에 기포가 생겨 적게 빨려요. 천천히 놓고 1초 기다려요.', s: { press: 0, dip: 1, liquid: 0.75, at: 'source', bubble: true } },
    { title: '팁에 액체 든 채 눕히기', text: '액체가 몸체 안으로 거꾸로 흘러 들어가요. 항상 거치대에 세워서 걸어요. 다 쓴 뒤 다이얼은 보관 용량(최대 근처)으로 돌려 둬요.', s: { press: 0, dip: 0, liquid: 0.8, at: 'source', lying: true } },
  ],
};

function PipetteScene() {
  const [mode, setMode] = useState<PipMode>('forward');
  const steps = PIP_STEPS[mode];
  const { at, setAt, go, swipe } = useSteps(steps.length);
  const s = steps[Math.min(at, steps.length - 1)].s;
  const pick = (m: PipMode) => { setMode(m); setAt(0); };
  return <>
    <div className="dna-tabs" role="group" aria-label="피펫팅 방법">
      {(['forward', 'reverse', 'mistake'] as PipMode[]).map(m => <button type="button" key={m} className="glass-button" aria-pressed={mode === m} onClick={() => pick(m)}>{m === 'forward' ? '정방향' : m === 'reverse' ? '역방향' : '이러면 안 돼요'}</button>)}
    </div>
    <Stepper steps={steps} at={Math.min(at, steps.length - 1)} go={go} setAt={setAt} swipe={swipe} label="마이크로피펫 장면"><PipetteSvg s={s} /></Stepper>
    <DisplayReader />
  </>;
}

function PipetteSvg({ s }: { s: Pip }) {
  const plunger = s.press === 0 ? 0 : s.press === 1 ? 16 : 26;
  const x = s.at === 'source' ? 0 : 150;
  const y = s.dip * 20;
  const fill = Math.min(1, s.liquid);
  const tipTop = 196, tipBottom = 262, tipH = tipBottom - tipTop;
  const total = Math.min(1.25, fill + (s.extra && fill ? s.extra : 0));
  const level = tipBottom - tipH * 0.62 * total;
  const rot = s.lying ? -78 : s.tilt ?? 0;
  return <svg viewBox="0 0 400 300" className="dna-svg" role="img" aria-label="마이크로피펫 단면 도식">
    <defs><clipPath id="tip-clip"><path d={`M118 ${tipTop} L142 ${tipTop} L132 ${tipBottom} L128 ${tipBottom} Z`} /></clipPath></defs>
    {/* 시약 튜브 · 받을 튜브 */}
    <g className="dna-tube"><path d="M95 230 L95 288 Q130 300 165 288 L165 230" /><rect x="95" y="262" width="70" height="26" className="dna-reagent" rx="6" /><text x="130" y="226">시약</text></g>
    <g className="dna-tube"><path d="M245 230 L245 288 Q280 300 315 288 L315 230" /><rect x="245" y="276" width="70" height="12" className={`dna-reagent ${s.at === 'target' && fill < 1 ? 'is-filled' : ''}`} rx="6" /><text x="280" y="226">받을 튜브</text></g>
    <g className="dna-pip" style={{ transform: `translate(${x}px, ${y - 8}px) rotate(${rot}deg)`, transformOrigin: '130px 150px' }}>
      {/* 플런저 */}
      <g style={{ transform: `translateY(${plunger}px)` }} className="dna-move">
        <rect x="118" y="10" width="24" height="16" rx="5" className="dna-plunger" />
        <rect x="127" y="26" width="6" height="40" className="dna-rod" />
        <rect x="113" y="66" width="34" height="10" rx="2" className="dna-piston" />
      </g>
      {/* 몸체 */}
      <rect x="108" y="40" width="44" height="130" rx="14" className="dna-body" />
      <rect x="152" y="54" width="14" height="10" rx="3" className="dna-ejector" />
      <rect x="116" y="104" width="28" height="34" rx="4" className="dna-window" />
      <text x="130" y="116" className="dna-digit">0</text><text x="130" y="126" className="dna-digit">7</text><text x="130" y="136" className="dna-digit">5</text>
      <rect x="121" y="170" width="18" height="26" className="dna-nozzle" />
      {/* 공기층 */}
      <rect x="113" y={76 + plunger} width="34" height={Math.max(0, 94 - plunger)} className="dna-air" />
      {s.air && <text x="236" y="150" className={`dna-air-note ${s.air}`}>{s.air === 'out' ? '공기 밀려 나감 ↓' : '부분 진공 → 액체 ↑'}</text>}
      {/* 팁 */}
      <g className={`dna-tip ${s.tipOff ? 'is-off' : ''}`}>
        <path d={`M118 ${tipTop} L142 ${tipTop} L132 ${tipBottom} L128 ${tipBottom} Z`} className="dna-tip-shell" />
        <g clipPath="url(#tip-clip)">
          <rect x="110" y={level} width="40" height={tipBottom - level + 2} className="dna-liquid dna-move" />
          {s.extra && fill > 0 && <rect x="110" y={level} width="40" height={tipH * 0.62 * s.extra} className="dna-extra dna-move" />}
          {s.bubble && <><circle cx="130" cy={level + 12} r="4" className="dna-bubble" /><circle cx="128" cy={level + 24} r="3" className="dna-bubble" /></>}
        </g>
        {s.outside && <path d="M141 230 q6 8 0 16" className="dna-outside" />}
        {s.bubble && <circle cx="130" cy="150" r="5" className="dna-splash" />}
      </g>
      {s.labels && <g className="dna-labels">
        <text x="60" y="22">플런저</text><line x1="84" y1="18" x2="116" y2="18" />
        <text x="214" y="62">팁 이젝터</text><line x1="168" y1="58" x2="188" y2="58" />
        <text x="62" y="124">표시창</text><line x1="84" y1="120" x2="114" y2="120" />
        <text x="214" y="96">용량 조절 휠</text><line x1="152" y1="92" x2="182" y2="92" />
        <text x="62" y="186">샤프트</text><line x1="84" y1="182" x2="119" y2="182" />
        <text x="214" y="236">일회용 팁</text><line x1="140" y1="232" x2="186" y2="232" />
      </g>}
    </g>
    <g className="dna-press"><text x="350" y="30">플런저</text>{(['0단', '1단', '2단'] as const).map((l, i) => <text key={l} x="350" y={56 + i * 22} className={s.press === i ? 'is-on' : ''}>{l}</text>)}</g>
  </svg>;
}

function DisplayReader() {
  const [model, setModel] = useState<PipetteModel>('P200');
  const [digits, setDigits] = useState<Digits>([0, 7, 5]);
  const [want, setWant] = useState(600);
  const value = displayValue(model, digits);
  const ok = inRange(model, value);
  const best = pickPipette(want);
  const bump = (i: number, d: number) => setDigits(ds => ds.map((v, j) => j === i ? (v + d + 10) % 10 : v) as Digits);
  return <section className="dna-reader glass" aria-label="표시창 읽기와 피펫 고르기">
    <h2>표시창 읽기</h2>
    <p className="dna-sub">같은 숫자라도 피펫마다 값이 달라요. 피펫을 바꿔 보세요.</p>
    <div className="dna-tabs">{MODELS.map(m => <button type="button" key={m} className="glass-button" aria-pressed={model === m} onClick={() => setModel(m)}>{m}</button>)}</div>
    <div className="dna-display">
      <div className="dna-wheel">{digits.map((d, i) => <div key={i}><button type="button" aria-label={`${i + 1}번째 자리 올리기`} onClick={() => bump(i, 1)}>▲</button><b className={model === 'P20' && i === 2 ? 'is-red' : ''}>{d}</b><button type="button" aria-label={`${i + 1}번째 자리 내리기`} onClick={() => bump(i, -1)}>▼</button></div>)}</div>
      <div className="dna-read">
        <strong>{value} µL</strong>
        <span>{PIPETTES[model].read}</span>
        <span>범위 {PIPETTES[model].min}~{PIPETTES[model].max} µL · 팁 {PIPETTES[model].tip}</span>
        {!ok && <em>범위 밖이에요 — 이렇게 돌리면 안 돼요</em>}
      </div>
    </div>
    <h2>피펫 고르기</h2>
    <p className="dna-sub">범위 안에 드는 것 중 <b>가장 작은</b> 피펫(최대 용량 근처에서 오차가 가장 작아요).</p>
    <div className="dna-tabs">{[2, 8.5, 20, 100, 200, 500, 600].map(v => <button type="button" key={v} className="glass-button" aria-pressed={want === v} onClick={() => setWant(v)}>{v} µL</button>)}</div>
    <p className="dna-pick">{want} µL → <b>{best ?? '없음'}</b>{want === 20 && ' (P20의 최대 용량, P100도 범위 안이지만 더 작은 P20)'}{want === 100 && ' (P100의 최대 용량, P200도 되지만 더 작은 P100)'}{want === 200 && ' (P200의 최대 용량)'}</p>
  </section>;
}

function InsideScene() {
  const [tab, setTab] = useState<'extract' | 'nano'>('extract');
  return <>
    <div className="dna-tabs" role="group" aria-label="장면 고르기">
      <button type="button" className="glass-button" aria-pressed={tab === 'extract'} onClick={() => setTab('extract')}>스핀 컬럼 속 DNA</button>
      <button type="button" className="glass-button" aria-pressed={tab === 'nano'} onClick={() => setTab('nano')}>NanoDrop · 순도 비율</button>
    </div>
    {tab === 'extract' ? <ExtractScene key="e" /> : <NanoScene key="n" />}
  </>;
}

/* ───────────── DNA 추출 ───────────── */

type Pos = { x: number; y: number; o?: number; s?: number };
const EX_STEPS: (Step & { salt: '–' | '고염' | '저염'; dna: string; bottom: string; temp?: string; spin?: boolean; view: 'tube' | 'column'; newTube?: boolean })[] = [
  { title: '세포 채취 · PBS에 풀기', text: '면봉으로 볼 안쪽을 문질러 구강상피세포를 얻고, PBS에 풀어요. PBS는 삼투압 변화 없이 세포를 풀어 주는 등장액이에요.', points: ['DNA는 대부분 핵(핵막 안)에, 미토콘드리아에도 조금', '통증 · 출혈 없이 쉽게 얻을 수 있어서 구강상피세포를 씀'], salt: '–', dna: '세포의 핵 안', bottom: '–', view: 'tube' },
  { title: '① 용해 (Lysis)', text: '용해 완충액(계면활성제)이 세포막과 핵막(인지질 이중층)을 부수고, 프로테이네이스 K가 56°C에서 히스톤 단백질과 DNase까지 분해해 DNA가 용액으로 나와요.', points: ['프로테이네이스 K는 상온에서 스스로 분해돼서 −20°C에 따로 두고 실험 직전에 넣음', '배양 뒤 뚜껑 안쪽 물방울을 스핀다운'], salt: '–', dna: '튜브 속 용액', bottom: '–', temp: '56°C', view: 'tube' },
  { title: '결합 조건 만들기', text: '결합 완충액(고염)과 무수 에탄올을 넣어요. 물 분자층이 벗겨지고 양이온 다리가 생겨, 음전하를 띤 DNA가 실리카 막에 붙을 준비를 해요.', points: ['혼합 용해액은 약 600 µL'], salt: '고염', dna: '튜브 속 용액', bottom: '–', view: 'tube' },
  { title: '② 결합 (Binding)', text: '혼합액을 핑크색 스핀 컬럼의 흰색 실리카 막 정중앙에 올리고 원심분리해요. DNA는 막에 붙어 남고, 나머지는 바깥 통으로 빠져요.', points: ['바깥 통(통과액) = 불순물 → 버림', '테두리가 젖지 않게, 막을 찌르지 않게'], salt: '고염', dna: '실리카 막 위', bottom: '불순물 → 버림', spin: true, view: 'column' },
  { title: '③ 세척 (Washing)', text: '에탄올이 든 세척 완충액(GW1 → GW2)을 통과시켜요. DNA는 막에 그대로 남고 단백질 · 지질 · 염만 씻겨 나가요.', points: ['통과액은 매번 버리고 새 컬렉션 튜브에'], salt: '고염', dna: '실리카 막 위', bottom: '불순물 → 버림', spin: true, view: 'column' },
  { title: '건조 원심분리 (Dry spin)', text: '아무것도 넣지 않고 12,000 rpm으로 돌려 막에 남은 에탄올을 완전히 날려요.', points: ['에탄올이 남으면: DNA가 잘 안 녹아 나옴 · A260/A230 ↓ · PCR 등 효소 반응 방해'], salt: '–', dna: '실리카 막 위', bottom: '에탄올 제거', spin: true, view: 'column' },
  { title: '④ 용출 (Elution)', text: '컬럼을 새 1.5 mL 튜브에 끼우고, 저염 용출 완충액(EA Buffer)을 막 정중앙에 떨어뜨려 1분 이상 기다린 뒤 원심분리해요. 정전기적 반발이 돌아와 DNA가 물에 녹아 아래로 빠져요.', points: ['이번엔 아래 튜브가 정제된 DNA → 챙김!', '벽면에 흘리거나 바로 돌리면 수득량 ↓'], salt: '저염', dna: '새 튜브 속 용액', bottom: '정제된 DNA → 챙김', spin: true, view: 'column', newTube: true },
];
// 입자 위치(단계별). tube 보기: 세포 튜브, column 보기: 컬럼(막 y≈128) + 아래 통(y 190~260).
const R = (seed: number) => { const x = Math.sin(seed * 99.13) * 43758.5453; return x - Math.floor(x); };
const dnaPos = (i: number, at: number): Pos => {
  if (at === 0) return { x: 196 + (i % 3) * 6, y: 168 + Math.floor(i / 3) * 7 };
  if (at <= 2) return { x: 168 + R(i + 1) * 64, y: 150 + R(i + 7) * 90 };
  if (at <= 5) return { x: 168 + i * 13, y: 124 };
  return { x: 170 + R(i + 3) * 60, y: 236 + R(i + 5) * 22 };
};
const junkPos = (i: number, at: number, kind: 'protein' | 'lipid' | 'salt'): Pos => {
  const k = kind === 'protein' ? 0 : kind === 'lipid' ? 20 : 40;
  if (at === 0) {
    if (kind === 'salt') return { x: 200, y: 175, o: 0 };
    const a = (i / 6) * Math.PI * 2 + k;
    return kind === 'lipid' ? { x: 200 + Math.cos(a) * 48, y: 175 + Math.sin(a) * 48 } : { x: 200 + Math.cos(a) * 32, y: 175 + Math.sin(a) * 32 };
  }
  if (at === 1 || at === 2) return { x: 166 + R(i + k + 11) * 68, y: 150 + R(i + k + 13) * 92, s: kind === 'protein' ? 0.6 : 1, o: kind === 'salt' && at === 1 ? 0 : 1 };
  if (at === 3) return i < 4 ? { x: 168 + R(i + k + 17) * 64, y: 228 + R(i + k + 19) * 30, s: kind === 'protein' ? 0.6 : 1 } : { x: 172 + R(i + k) * 56, y: 116, s: kind === 'protein' ? 0.6 : 1 };
  return { x: 200, y: 250, o: 0 };
};
const ethPos = (i: number, at: number): Pos => {
  if (at === 2 || at === 3) return { x: 166 + R(i + 31) * 68, y: at === 2 ? 150 + R(i + 37) * 92 : 230 + R(i + 37) * 26 };
  if (at === 4) return { x: 170 + i * 15, y: 114 };
  if (at === 5) return { x: 170 + i * 15, y: 60, o: 0 };
  return { x: 200, y: 160, o: 0 };
};

function ExtractScene() {
  const { at, setAt, go, swipe } = useSteps(EX_STEPS.length);
  const st = EX_STEPS[at];
  const col = st.view === 'column';
  return <>
    <Stepper steps={EX_STEPS} at={at} go={go} setAt={setAt} swipe={swipe} label="DNA 추출 장면">
      <svg viewBox="0 0 400 300" className="dna-svg" role="img" aria-label={`DNA 추출 ${at + 1}단계 도식`}>
        {/* 세포 튜브 */}
        <g className="dna-fade" style={{ opacity: col ? 0 : 1 }}>
          <path d="M150 70 L150 250 Q200 290 250 250 L250 70" className="dna-glass" />
          <rect x="152" y="140" width="96" height="112" className="dna-buffer" rx="4" />
          <circle cx="200" cy="175" r="54" className="dna-cell" style={{ opacity: at === 0 ? 1 : 0 }} />
          <circle cx="200" cy="172" r="20" className="dna-nucleus" style={{ opacity: at === 0 ? 1 : 0 }} />
          <text x="200" y="62">{at === 0 ? '구강상피세포 + PBS' : at === 1 ? '용해 완충액 + 프로테이네이스 K' : '결합 완충액(고염) + 에탄올'}</text>
        </g>
        {/* 스핀 컬럼 + 컬렉션 튜브 */}
        <g className="dna-fade" style={{ opacity: col ? 1 : 0 }}>
          <path d="M150 180 L150 262 Q200 290 250 262 L250 180" className={`dna-glass ${st.newTube ? 'is-new' : ''}`} />
          <text x="300" y="232" className="dna-small">{st.newTube ? '새 1.5 mL 튜브' : '컬렉션 튜브'}</text>
          <g className={st.spin ? 'dna-spin' : ''}><path d="M156 40 L156 132 L244 132 L244 40" className="dna-column" /><rect x="160" y="122" width="80" height="10" className="dna-membrane" /></g>
          <text x="300" y="128" className="dna-small">실리카 막</text>
          <text x="200" y="32">{at === 3 ? '혼합액 → 막 정중앙' : at === 4 ? '세척 완충액 GW1 · GW2' : at === 5 ? '빈 컬럼 · 12,000 rpm' : at === 6 ? '용출 완충액(저염) → 1분 대기' : ''}</text>
          {at === 6 && <circle cx="200" cy="100" r="7" className="dna-drop" />}
        </g>
        {/* 입자 */}
        {Array.from({ length: 6 }, (_, i) => { const p = junkPos(i, at, 'protein'); return <circle key={`p${i}`} r="5" className="dna-dot protein" style={{ transform: `translate(${p.x}px,${p.y}px) scale(${p.s ?? 1})`, opacity: p.o ?? 1 }} />; })}
        {Array.from({ length: 6 }, (_, i) => { const p = junkPos(i, at, 'lipid'); return <rect key={`l${i}`} x="-5" y="-2" width="10" height="4" className="dna-dot lipid" style={{ transform: `translate(${p.x}px,${p.y}px)`, opacity: p.o ?? 1 }} />; })}
        {Array.from({ length: 6 }, (_, i) => { const p = junkPos(i, at, 'salt'); return <text key={`s${i}`} className="dna-dot salt" style={{ transform: `translate(${p.x}px,${p.y}px)`, opacity: p.o ?? 1 }}>+</text>; })}
        {Array.from({ length: 4 }, (_, i) => { const p = ethPos(i, at); return <circle key={`e${i}`} r="3.5" className="dna-dot ethanol" style={{ transform: `translate(${p.x}px,${p.y}px)`, opacity: p.o ?? 1 }} />; })}
        {Array.from({ length: 6 }, (_, i) => { const p = dnaPos(i, at); return <path key={`d${i}`} d="M-6 -3 q3 6 6 0 t6 0" className="dna-dot dna" style={{ transform: `translate(${p.x}px,${p.y}px)` }} />; })}
        {st.temp && <g className="dna-temp"><rect x="262" y="96" width="62" height="26" rx="13" /><text x="293" y="114">{st.temp}</text></g>}
        <g className="dna-legend"><path d="M24 274 q3 6 6 0 t6 0" className="dna-dot dna" /><text x="44" y="280">DNA</text><circle cx="96" cy="276" r="4" className="dna-dot protein" /><text x="108" y="280">단백질</text><rect x="152" y="274" width="10" height="4" className="dna-dot lipid" /><text x="168" y="280">지질</text><text x="208" y="281" className="dna-dot salt">+</text><text x="220" y="280">염</text><circle cx="250" cy="276" r="3.5" className="dna-dot ethanol" /><text x="258" y="280">에탄올</text></g>
      </svg>
    </Stepper>
    <dl className="dna-status">
      <div><dt>염 농도</dt><dd className={st.salt === '고염' ? 'is-high' : st.salt === '저염' ? 'is-low' : ''}>{st.salt}</dd></div>
      <div><dt>지금 DNA는</dt><dd>{st.dna}</dd></div>
      <div><dt>아래로 빠진 것</dt><dd className={st.bottom.includes('챙김') ? 'is-keep' : st.bottom.includes('버림') ? 'is-toss' : ''}>{st.bottom}</dd></div>
    </dl>
  </>;
}

/* ───────────── NanoDrop ───────────── */

const NANO_STEPS: (Step & { arm: 'up' | 'down'; drop?: 'blank' | 'sample'; wipe?: boolean; beam?: boolean; screen: string; graph?: boolean })[] = [
  { title: '페디스털 닦기', text: '암(Arm)을 올리고 위아래 페디스털을 보풀 없는 새 실험용 천으로 닦아요.', points: ['큐벳에 많이 담는 일반 분광광도계와 달리, 1~2 µL만 올려 측정'], arm: 'up', wipe: true, screen: 'Home' },
  { title: 'dsDNA 모드', text: '홈 화면 Nucleic Acids(핵산) 탭에서 dsDNA를 골라요.', arm: 'up', screen: 'Nucleic Acids › dsDNA' },
  { title: '블랭크: 같은 용액으로', text: 'DNA를 녹인 것과 같은 EA Buffer 1~2 µL를 올리고 암을 내려 블랭크를 잡아요.', points: ['pH · 이온 세기에 따라 비율이 달라짐(산성이면 A260/A280이 낮게)'], arm: 'down', drop: 'blank', beam: true, screen: 'Blank' },
  { title: '다시 닦기', text: '암을 올리고 위아래를 새 천으로 깨끗이 닦아요.', arm: 'up', wipe: true, screen: 'Blank ✓' },
  { title: '시료 올리기', text: 'DNA 용액을 피펫으로 가볍게 섞은 뒤 1~2 µL를 기포 없이 올리고 암을 내려요. 표면장력으로 생긴 액체 기둥에 260 nm 자외선이 지나가요.', points: ['기포는 빛을 산란시켜 오차', '광경로를 자동 조절한 뒤 10 mm 기준으로 환산'], arm: 'down', drop: 'sample', beam: true, screen: 'Measure' },
  { title: '기록하고 닦기', text: '260 nm 부근 봉우리, 농도(ng/µL), A260/A280, A260/A230, 오염물 분석 아이콘을 기록하고 페디스털을 닦아요.', points: ['근처에서 스프레이 병 금지 · 팁이나 손가락으로 긁지 않기'], arm: 'up', wipe: true, screen: 'Result', graph: true },
];

function NanoScene() {
  const { at, setAt, go, swipe } = useSteps(NANO_STEPS.length);
  const st = NANO_STEPS[at];
  return <>
    <Stepper steps={NANO_STEPS} at={at} go={go} setAt={setAt} swipe={swipe} label="NanoDrop 장면">
      <svg viewBox="0 0 400 300" className="dna-svg" role="img" aria-label={`NanoDrop ${at + 1}단계 도식`}>
        <rect x="40" y="200" width="200" height="60" rx="14" className="dna-device" />
        <rect x="104" y="192" width="72" height="10" rx="5" className="dna-pedestal" />
        <g className="dna-move" style={{ transform: st.arm === 'down' ? 'rotate(0deg)' : 'rotate(-38deg)', transformOrigin: '60px 120px' }}>
          <rect x="40" y="104" width="160" height="34" rx="12" className="dna-device" />
          <rect x="104" y="138" width="72" height="8" rx="4" className="dna-pedestal" />
        </g>
        {st.drop && <rect x="132" y={st.arm === 'down' ? 146 : 178} width="16" height={st.arm === 'down' ? 46 : 14} rx="7" className={`dna-move dna-column-drop ${st.drop}`} />}
        {st.beam && <g className="dna-beam"><line x1="140" y1="200" x2="140" y2="146" /><text x="186" y="176">260 nm 자외선</text></g>}
        {st.wipe && <rect x="96" y="176" width="88" height="14" rx="6" className="dna-cloth" />}
        <text x="140" y="290" className="dna-small">페디스털 · 액체 기둥(표면장력)</text>
        <rect x="262" y="70" width="118" height="150" rx="12" className="dna-screen" />
        <text x="321" y="92" className="dna-screen-title">{st.screen}</text>
        {st.graph && <g className="dna-graph"><path d="M276 200 C296 196 306 120 318 112 C330 120 336 180 366 196" /><line x1="318" y1="112" x2="318" y2="204" /><text x="318" y="216">260</text><text x="321" y="140">15.0 ng/µL</text></g>}
      </svg>
    </Stepper>
    <Purity />
  </>;
}

function Purity() {
  const [on, setOn] = useState<Contaminant[]>([]);
  const [volume, setVolume] = useState(100);
  const abs = measure(on);
  const { r280, r230 } = ratios(abs);
  const conc = dnaConcentration(abs.a260);
  const max = 0.5;
  const toggle = (c: Contaminant) => setOn(list => list.includes(c) ? list.filter(x => x !== c) : [...list, c]);
  const verdict280 = judge280(r280), verdict230 = judge230(r230);
  return <section className="dna-reader glass" aria-label="순도 비율과 농도 계산">
    <h2>순도 비율: 무엇이 남으면?</h2>
    <p className="dna-sub">오염 물질이 남으면 <b>분모(A280 · A230)</b>가 커져서 비율이 기준보다 <b>낮아져요</b>.</p>
    <div className="dna-tabs">{(Object.keys(CONTAMINANTS) as Contaminant[]).map(c => <button type="button" key={c} className="glass-button" aria-pressed={on.includes(c)} onClick={() => toggle(c)}>{CONTAMINANTS[c].label}<small>{CONTAMINANTS[c].note}</small></button>)}</div>
    <div className="dna-bars" aria-hidden="true">
      {(['a230', 'a260', 'a280'] as const).map(k => <div key={k}><i style={{ height: `${Math.min(100, abs[k] / max * 100)}%` }} className={k} /><span>{k.slice(1)} nm</span></div>)}
    </div>
    <dl className="dna-status">
      <div><dt>A260/A280 (기준 ≈ 1.8)</dt><dd className={verdict280 === 'ok' ? '' : 'is-toss'}>{r280.toFixed(2)} {verdict280 === 'low' ? '↓ 단백질 · 페놀' : on.includes('rna') ? '↑ RNA 쪽(≈2.0)으로' : '정상'}</dd></div>
      <div><dt>A260/A230 (기준 1.8~2.2)</dt><dd className={verdict230 === 'ok' ? '' : 'is-toss'}>{r230.toFixed(2)} {verdict230 === 'low' ? '↓ 염 · 에탄올' : '정상'}</dd></div>
      <div><dt>농도 = A260 × 50</dt><dd>{abs.a260.toFixed(3)} × 50 = {conc.toFixed(1)} ng/µL{on.includes('rna') ? ' (RNA까지 더해져 실제보다 높게)' : ''}</dd></div>
    </dl>
    <h2>총 수득량</h2>
    <div className="dna-tabs">{[50, 100, 200].map(v => <button type="button" key={v} className="glass-button" aria-pressed={volume === v} onClick={() => setVolume(v)}>용출 {v} µL</button>)}</div>
    <p className="dna-pick">{conc.toFixed(1)} ng/µL × {volume} µL ÷ 1,000 = <b>{totalYield(conc, volume).toFixed(2)} µg</b></p>
    <p className="dna-sub">용출 부피를 줄이면 같은 DNA가 적은 부피에 녹아 <b>농도는 올라가요</b>. 너무 줄이면 막을 다 적시지 못해 <b>수득량은 오히려 줄 수 있어요</b>.</p>
  </section>;
}
