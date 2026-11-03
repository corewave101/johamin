// 박상영T 수행평가 대비(5.0.0~): 실험 전체를 실험대 장면으로 따라가는 애니메이션.
// 5.0.1~: 세 파트(체크포인트)에서 골라 영화관 모드(전체 화면)로 끝까지 이어 재생한다. 아래 Cinema 참고.
// 근거: 수행평가 설명서 「2. 단계별 실험 방법」(추출 1~9 · NanoDrop 10~15).
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

type Model = 'P20' | 'P200' | 'P1000';
type Pip = { m: Model; x: number; y: number; tip?: 'y' | 'b'; liq?: number; press?: 0 | 1 | 2 };
type Tube = { x: number; y: number; level: number; kind: 'tube' | 'column' | 'new'; label?: string; dna?: boolean };
type Frame = { say: string; pip?: Pip; tubes: Tube[]; swab?: { x: number; y: number }; fx?: 'vortex' | 'heat' | 'spin' | 'wipe' | 'timer' | 'measure' | 'tilt'; nano?: { arm: 'up' | 'down'; drop?: boolean; screen: string }; hi?: number[] };
type Step = { title: string; text: string; why?: string[]; frames: Frame[] };

// 실험대 자리(x). 아래 선반 바닥 y=400, 위 선반 바닥 y=258.
const REAG = { PBS: 236, TL: 286, ProK: 344, GB: 404, EtOH: 454, GW1: 504, GW2: 554, EA: 604 } as const;
type Reagent = keyof typeof REAG;
const REAG_NAME: Record<Reagent, string> = { PBS: 'PBS', TL: 'Buffer TL', ProK: 'ProK', GB: 'Buffer GB', EtOH: '에탄올', GW1: 'GW1', GW2: 'GW2', EA: 'EA Buffer' };
const TIPS = { y: 118, b: 170 };
const RACK1 = 660, RACK2 = 712, VORTEX = 776, HEAT = 846;
const STAND = { x: 66, y: 352 };
const WASTE = { x: 620, y: 222 };
const CENTRI = { x: 790, y: 206 };
const NANO = { x: 470, y: 236 };

const tube = (x: number, level: number, label = '내 튜브', y = 400): Tube => ({ x, y, level, kind: 'tube', label });
const column = (x: number, level: number, y = 400, label = '스핀 컬럼'): Tube => ({ x, y, level, kind: 'column', label });

/** 시약 하나를 피펫으로 옮기는 장면들(정방향): 들기 → 팁 → 공중 1단 → 담가 놓기 → 벽에 1단·2단 → 팁 버리기. */
function transfer(m: Model, from: Reagent | { x: number; y: number; name: string }, to: { x: number; y: number }, vol: string, before: Tube[], after: Tube[], center = false): Frame[] {
  const tip = m === 'P1000' ? 'b' : 'y';
  const src = typeof from === 'string' ? { x: REAG[from], y: 364, name: REAG_NAME[from] } : from;
  const set = m === 'P20' ? `${vol} → 표시창 맞추기` : `${vol}로 맞추기`;
  return [
    { say: `${m} 들고 ${set}`, pip: { m, x: STAND.x + 40, y: STAND.y }, tubes: before },
    { say: `${tip === 'b' ? '파란' : '노란'} 팁 끼우고 팁 상자 뚜껑 닫기`, pip: { m, x: TIPS[tip], y: 378, tip }, tubes: before, hi: [TIPS[tip]] },
    { say: '공중에서 1단까지 누르기', pip: { m, x: src.x, y: 318, tip, press: 1 }, tubes: before, hi: [src.x] },
    { say: `${src.name}에 2~3 mm 담그고 천천히 놓기`, pip: { m, x: src.x, y: src.y, tip, liq: 1 }, tubes: before, hi: [src.x] },
    { say: center ? '실리카 막 정중앙에 가까이 대고 천천히(테두리 안 젖게)' : '튜브 벽에 대고 1단 → 2단까지(블로우아웃)', pip: { m, x: to.x + (center ? 0 : -5), y: to.y, tip, liq: 0, press: center ? 1 : 2 }, tubes: after, hi: [to.x] },
    { say: '팁 이젝터로 팁 버리기', pip: { m, x: WASTE.x, y: WASTE.y - 14, liq: 0 }, tubes: after, hi: [WASTE.x] },
  ];
}
const intoTube = (x: number) => ({ x, y: 374 });
const ontoMembrane = (x: number) => ({ x, y: 352 });

const balance = '맞은편에 균형 튜브(대칭)';
const STEPS: Step[] = [
  { title: '구강상피세포 채취', text: '면봉으로 볼 안쪽을 충분히 문질러 세포를 얻고, PBS가 든 튜브에 면봉을 담가 세포를 풀어요.', why: ['PBS = 등장액: 삼투압 변화 없이 세포를 풀어 줌', 'DNA는 대부분 핵 안 · 통증 없이 쉽게 채취'], frames: [
    { say: '면봉으로 볼 안쪽 문지르기', swab: { x: 214, y: 214 }, tubes: [tube(RACK1, 0.15)] },
    { say: '볼 안쪽을 여러 번, 충분히', swab: { x: 210, y: 226 }, tubes: [tube(RACK1, 0.15)] },
    { say: 'PBS 튜브에 면봉을 담가 세포 풀기', swab: { x: RACK1, y: 352 }, tubes: [tube(RACK1, 0.15)], hi: [RACK1] },
  ] },
  { title: '용해 완충액 200 µL', text: '튜브에 Buffer TL 200 µL를 P200으로 넣어요. 계면활성제가 세포막 · 핵막(인지질 이중층)을 부숴요.', why: ['계면활성제라 거품이 잘 남 → 천천히(필요하면 역방향)'], frames: transfer('P200', 'TL', intoTube(RACK1), '200 µL', [tube(RACK1, 0.15)], [tube(RACK1, 0.4)]) },
  { title: '프로테이네이스 K 20 µL', text: '얼음통에서 막 꺼낸 프로테이네이스 K 20 µL를 P20으로 넣어요. 상온에서 스스로 분해되니 미리 섞어 두지 않아요.', why: ['P20 표시창 2 · 0 · 0 = 20.0 µL'], frames: transfer('P20', 'ProK', intoTube(RACK1), '20 µL', [tube(RACK1, 0.4)], [tube(RACK1, 0.44)]) },
  { title: '볼텍싱 → 56°C 배양', text: '볼텍싱으로 섞고 56°C에서 완전히 녹을 때까지 배양해요. 프로테이네이스 K가 히스톤 단백질과 DNase를 분해해요. 뚜껑 안 물방울은 스핀다운.', frames: [
    { say: '볼텍서에 대고 섞기', tubes: [tube(VORTEX, 0.44, '내 튜브', 372)], fx: 'vortex', hi: [VORTEX] },
    { say: '히트블록 56°C에서 배양', tubes: [tube(HEAT, 0.44, '내 튜브', 392)], fx: 'heat', hi: [HEAT] },
    { say: `원심분리기로 가볍게 스핀다운 · ${balance}`, tubes: [], fx: 'spin', hi: [CENTRI.x] },
    { say: '랙에 꽂기', tubes: [tube(RACK1, 0.44)] },
  ] },
  { title: '결합 완충액 200 µL', text: 'Buffer GB(고염) 200 µL를 넣고 15초 펄스 볼텍싱한 뒤 56°C에서 10분 배양해요.', why: ['고염 조건: DNA가 실리카 막에 붙을 준비'], frames: [
    ...transfer('P200', 'GB', intoTube(RACK1), '200 µL', [tube(RACK1, 0.44)], [tube(RACK1, 0.66)]),
    { say: '15초 펄스 볼텍싱', tubes: [tube(VORTEX, 0.66, '내 튜브', 372)], fx: 'vortex', hi: [VORTEX] },
    { say: '56°C에서 10분', tubes: [tube(HEAT, 0.66, '내 튜브', 392)], fx: 'heat', hi: [HEAT] },
  ] },
  { title: '무수 에탄올 200 µL', text: '무수 에탄올 200 µL를 넣고 15초 볼텍싱, 가볍게 스핀다운해요. 혼합 용해액은 약 600~620 µL가 돼요.', frames: [
    ...transfer('P200', 'EtOH', intoTube(RACK1), '200 µL', [tube(RACK1, 0.66)], [tube(RACK1, 0.9)]),
    { say: '15초 볼텍싱', tubes: [tube(VORTEX, 0.9, '내 튜브', 372)], fx: 'vortex', hi: [VORTEX] },
    { say: `가볍게 스핀다운 · ${balance}`, tubes: [], fx: 'spin', hi: [CENTRI.x] },
    { say: '혼합 용해액 약 600~620 µL', tubes: [tube(RACK1, 0.9)] },
  ] },
  { title: '컬럼에 올리기 → 원심분리', text: '혼합액 약 600 µL를 P1000으로 핑크색 스핀 컬럼의 흰색 실리카 막 정중앙에 올려요. 10,000 rpm 1분 → 아래 통과액은 버리고 새 컬렉션 튜브에.', why: ['DNA는 막에 붙어 남음 · 통과액 = 불순물', '혼합액은 거품 · 점성 주의(역방향 피펫팅)'], frames: [
    ...transfer('P1000', { x: RACK1, y: 380, name: '혼합 용해액' }, ontoMembrane(RACK2), '약 600 µL', [tube(RACK1, 0.9), column(RACK2, 0)], [tube(RACK1, 0.06), column(RACK2, 0.6)], true),
    { say: `10,000 rpm 1분 · ${balance}`, tubes: [tube(RACK1, 0.06)], fx: 'spin', hi: [CENTRI.x] },
    { say: '통과액(불순물) 버리기 → 새 컬렉션 튜브', tubes: [tube(RACK1, 0.06), column(RACK2, 0)], pip: undefined, hi: [WASTE.x] },
  ] },
  { title: '세척 1 · 2', text: 'GW1 500 µL → 10,000 rpm 1분 → 통과액 버리기, 이어서 GW2 500 µL로 한 번 더. DNA는 막에 남고 불순물만 씻겨 나가요.', frames: [
    ...transfer('P1000', 'GW1', ontoMembrane(RACK2), '500 µL', [column(RACK2, 0)], [column(RACK2, 0.5)], true),
    { say: '10,000 rpm 1분', tubes: [], fx: 'spin', hi: [CENTRI.x] },
    { say: '통과액 버리기 → 새 컬렉션 튜브', tubes: [column(RACK2, 0)], hi: [WASTE.x] },
    ...transfer('P1000', 'GW2', ontoMembrane(RACK2), '500 µL', [column(RACK2, 0)], [column(RACK2, 0.5)], true).slice(1, 5),
    { say: '10,000 rpm 1분 → 통과액 버리기', tubes: [column(RACK2, 0)], fx: 'spin', hi: [CENTRI.x] },
  ] },
  { title: '건조 원심분리(Dry spin)', text: '빈 컬럼을 아무것도 넣지 않고 12,000 rpm에서 1~2분 돌려 막에 남은 에탄올을 완전히 날려요.', why: ['에탄올이 남으면: DNA가 잘 안 녹아 나옴 · A260/A230 ↓ · PCR 방해'], frames: [
    { say: '빈 컬럼 그대로 원심분리기로', tubes: [column(RACK2, 0)], hi: [RACK2] },
    { say: '12,000 rpm 1~2분 · 잔여 에탄올 제거', tubes: [], fx: 'spin', hi: [CENTRI.x] },
  ] },
  { title: '용출 100 µL → DNA 얻기', text: '컬럼을 새 1.5 mL 튜브에 옮겨 끼우고, 용출 완충액(EA Buffer, 저염) 100 µL를 막 정중앙에 떨어뜨려요. 실온 1분 이상 기다린 뒤 10,000 rpm 1분.', why: ['이번엔 아래 튜브가 정제된 DNA → 챙김!', '벽에 흘리거나 바로 돌리면 수득량 ↓'], frames: [
    { say: '컬럼을 새 1.5 mL 튜브로 옮기기', tubes: [{ ...column(RACK2, 0), kind: 'new' as const, label: '새 1.5 mL' }], hi: [RACK2] },
    ...transfer('P200', 'EA', ontoMembrane(RACK2), '100 µL', [{ ...column(RACK2, 0), kind: 'new' as const, label: '새 1.5 mL' }], [{ ...column(RACK2, 0.3), kind: 'new' as const, label: '새 1.5 mL' }], true).slice(1),
    { say: '실온에서 1분 이상 기다리기', tubes: [{ ...column(RACK2, 0.3), kind: 'new' as const, label: '새 1.5 mL' }], fx: 'timer', hi: [RACK2] },
    { say: '10,000 rpm 1분', tubes: [], fx: 'spin', hi: [CENTRI.x] },
    { say: '튜브 바닥 = 정제된 DNA 용액!', tubes: [{ ...tube(RACK2, 0.3, 'DNA 용액'), dna: true }], hi: [RACK2] },
  ] },
  { title: 'NanoDrop: 닦고 블랭크', text: '암을 올려 위아래 페디스털을 새 천으로 닦고, dsDNA 모드에서 EA Buffer 1~2 µL로 블랭크를 잡아요. 다시 닦아요.', why: ['블랭크는 DNA를 녹인 것과 같은 용액(pH · 이온 세기)'], frames: [
    { say: '암 올리고 위아래 페디스털 닦기', tubes: [{ ...tube(RACK2, 0.3, 'DNA 용액'), dna: true }], fx: 'wipe', nano: { arm: 'up', screen: 'Home' }, hi: [NANO.x] },
    { say: 'Nucleic Acids → dsDNA', tubes: [{ ...tube(RACK2, 0.3, 'DNA 용액'), dna: true }], nano: { arm: 'up', screen: 'dsDNA' }, hi: [NANO.x] },
    { say: 'P20으로 EA Buffer 1~2 µL', pip: { m: 'P20', x: REAG.EA, y: 364, tip: 'y', liq: 1 }, tubes: [{ ...tube(RACK2, 0.3, 'DNA 용액'), dna: true }], nano: { arm: 'up', screen: 'dsDNA' }, hi: [REAG.EA] },
    { say: '아래 페디스털에 올리기', pip: { m: 'P20', x: NANO.x, y: NANO.y - 4, tip: 'y', liq: 0, press: 1 }, tubes: [{ ...tube(RACK2, 0.3, 'DNA 용액'), dna: true }], nano: { arm: 'up', drop: true, screen: 'dsDNA' }, hi: [NANO.x] },
    { say: '암 내리고 블랭크 측정', tubes: [{ ...tube(RACK2, 0.3, 'DNA 용액'), dna: true }], fx: 'measure', nano: { arm: 'down', drop: true, screen: 'Blank' }, hi: [NANO.x] },
    { say: '암 올리고 다시 닦기', tubes: [{ ...tube(RACK2, 0.3, 'DNA 용액'), dna: true }], fx: 'wipe', nano: { arm: 'up', screen: 'Blank ✓' }, hi: [NANO.x] },
  ] },
  { title: 'NanoDrop: 시료 측정', text: 'DNA 용액을 피펫으로 가볍게 섞고, 1~2 µL를 기포 없이 올려 암을 내려요. 260 nm 봉우리 · 농도 · A260/A280 · A260/A230을 기록하고 닦아요.', why: ['농도 = A260 × 50 · 수득량 = 농도 × 100 µL ÷ 1,000'], frames: [
    { say: '피펫으로 가볍게 섞기(위아래 농도 차이)', pip: { m: 'P20', x: RACK2, y: 380, tip: 'y', liq: 1, press: 1 }, tubes: [{ ...tube(RACK2, 0.3, 'DNA 용액'), dna: true }], nano: { arm: 'up', screen: 'dsDNA' }, hi: [RACK2] },
    { say: '1~2 µL를 기포 없이 올리기', pip: { m: 'P20', x: NANO.x, y: NANO.y - 4, tip: 'y', liq: 0, press: 1 }, tubes: [{ ...tube(RACK2, 0.28, 'DNA 용액'), dna: true }], nano: { arm: 'up', drop: true, screen: 'dsDNA' }, hi: [NANO.x] },
    { say: '암 내리기 → 액체 기둥 · 260 nm 측정', tubes: [{ ...tube(RACK2, 0.28, 'DNA 용액'), dna: true }], fx: 'measure', nano: { arm: 'down', drop: true, screen: 'Measure' }, hi: [NANO.x] },
    { say: '결과 기록: 봉우리 · 농도 · 두 비율', tubes: [{ ...tube(RACK2, 0.28, 'DNA 용액'), dna: true }], nano: { arm: 'down', drop: true, screen: 'Result' }, hi: [NANO.x] },
    { say: '암 올리고 닦아서 마무리', tubes: [{ ...tube(RACK2, 0.28, 'DNA 용액'), dna: true }], fx: 'wipe', nano: { arm: 'up', screen: 'Home' }, hi: [NANO.x] },
  ] },
];
export const PROTOCOL_STEPS = STEPS;

/* ───────────── 영화관 재생기(5.0.1~) ─────────────
   타임라인 = 모든 단계의 장면을 이은 것. 처음 화면에서 세 파트(체크포인트) 중 하나를 고르면 거기서부터 끝까지 이어진다.
   장면이 바뀔 때는 한꺼번에 움직이지 않고 '들어 올리기 → 옮기기 → 내리기 → 동작' 순서로 나눠 보여 준다.
   스페이스 · → · 화면 클릭 = 다음 장면(움직이는 중이면 먼저 그 장면을 끝까지), ← = 이전 장면, Esc = 나가기. */
type Shown = Omit<Frame, 'say'>;
type Phase = { f: Shown; ms: number };
const CHAPTERS = [
  { title: '세포 용해', note: '채취 · 용해 완충액 · ProK · 결합 조건', from: 0 },
  { title: '컬럼 정제', note: '결합 · 세척 · 건조 · 용출', from: 6 },
  { title: 'NanoDrop 측정', note: '블랭크 · 시료 · 기록', from: 10 },
];
const TIMELINE = STEPS.flatMap((s, step) => s.frames.map((f, i) => ({ ...f, step, i })));
const startOf = (step: number) => TIMELINE.findIndex(t => t.step === step);
const chapterOf = (step: number) => CHAPTERS.reduce((c, ch, i) => step >= ch.from ? i : c, 0);
const HOME = { x: STAND.x + 40, y: STAND.y };

/** 이전 장면 → 다음 장면 사이를 단계별 움직임으로 쪼갠다(마지막 단계가 다음 장면 그대로). */
function phasesBetween(prev: Shown | null, next: Shown): Phase[] {
  if (!prev) return [{ f: next, ms: 700 }];
  const out: Phase[] = [];
  const keep = { ...prev, fx: undefined, hi: next.hi };
  let pip = prev.pip;
  const travel = (to: { x: number; y: number }, carry: Pip) => {
    if (Math.abs(carry.x - to.x) < 1 && Math.abs(carry.y - to.y) < 1) return carry;
    const lift = Math.min(300, carry.y - 24, to.y - 24);
    const far = Math.abs(carry.x - to.x) > 2;
    if (far) {
      out.push({ f: { ...keep, pip: { ...carry, y: lift } }, ms: 420 });
      out.push({ f: { ...keep, pip: { ...carry, x: to.x, y: lift } }, ms: 620 });
    }
    const landed = { ...carry, x: to.x, y: to.y };
    out.push({ f: { ...keep, pip: landed }, ms: 420 });
    return landed;
  };
  // 피펫: 다른 피펫으로 바꾸면 거치대에 걸고 새 피펫을 든다. 들고 있는 상태(팁 · 액체 · 누름)는 도착한 뒤에 바뀐다.
  if (pip && (!next.pip || next.pip.m !== pip.m)) { travel(HOME, pip); pip = undefined; out.push({ f: { ...keep, pip: undefined }, ms: 300 }); }
  if (next.pip) {
    const carry = pip ?? { ...next.pip, x: HOME.x, y: HOME.y, tip: undefined, liq: 0, press: 0 };
    if (!pip) out.push({ f: { ...keep, pip: carry }, ms: 380 });
    travel(next.pip, carry);
  }
  // 튜브: 자리가 바뀌면 들어서 옮긴 뒤 내려놓는다(양은 도착한 뒤에 바뀐다).
  const moved = next.tubes.some((t, i) => prev.tubes[i] && (prev.tubes[i].x !== t.x || prev.tubes[i].y !== t.y));
  if (moved) {
    const base = out.length ? out[out.length - 1].f : keep;
    out.push({ f: { ...base, tubes: prev.tubes.map(t => ({ ...t, y: t.y - 46 })) }, ms: 380 });
    out.push({ f: { ...base, tubes: next.tubes.map((t, i) => ({ ...(prev.tubes[i] ?? t), x: t.x, y: t.y - 46 })) }, ms: 560 });
    out.push({ f: { ...base, tubes: next.tubes.map((t, i) => ({ ...(prev.tubes[i] ?? t), x: t.x, y: t.y })) }, ms: 380 });
  }
  out.push({ f: next, ms: 900 });
  return out;
}

export default function DnaProtocol() {
  const [cinema, setCinema] = useState<number | null>(null);
  return <section className="dna-chapters">
    <p className="dna-sub">실험 전체를 영화처럼 따라가요. 파트를 고르면 거기서부터 끝까지 이어서 재생돼요(체크포인트). 스페이스나 화면을 누르면 다음 장면으로 넘어가요.</p>
    <div className="dna-chapter-list">
      {CHAPTERS.map((c, i) => <button type="button" key={c.title} className="dna-chapter glass" onClick={() => setCinema(startOf(c.from))}>
        <span className="dna-chapter-no">파트 {i + 1}</span><strong>{c.title}</strong><small>{c.note}</small>
        <span className="dna-chapter-steps">{STEPS.slice(c.from, CHAPTERS[i + 1]?.from ?? STEPS.length).map(s => s.title).join(' → ')}</span>
      </button>)}
    </div>
    {cinema !== null && <Cinema start={cinema} onClose={() => setCinema(null)} />}
  </section>;
}

function Cinema({ start, onClose }: { start: number; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState(start);
  const [phase, setPhase] = useState(0);
  const [auto, setAuto] = useState(false);
  const prevShown = useRef<Shown | null>(null);
  const cur = TIMELINE[at];
  const phases = useMemo(() => phasesBetween(prevShown.current, cur), [at]); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = phases[Math.min(phase, phases.length - 1)].f;
  const playing = phase < phases.length - 1;
  useEffect(() => { setPhase(0); }, [at]);
  useEffect(() => {
    if (playing) { const id = window.setTimeout(() => setPhase(p => p + 1), phases[phase].ms); return () => window.clearTimeout(id); }
    prevShown.current = cur;
    if (auto && at < TIMELINE.length - 1) { const id = window.setTimeout(() => setAt(a => a + 1), 1600); return () => window.clearTimeout(id); }
  }, [phase, playing, auto, at, phases, cur]);
  const next = useCallback(() => {
    if (playing) { setPhase(phases.length - 1); return; }
    setAt(a => Math.min(TIMELINE.length - 1, a + 1));
  }, [playing, phases.length]);
  const jump = useCallback((i: number) => { prevShown.current = null; setAt(Math.max(0, Math.min(TIMELINE.length - 1, i))); setPhase(0); }, []);
  const prev = useCallback(() => jump(at - 1), [jump, at]);
  const close = useCallback(() => { if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); onClose(); }, [onClose]);
  useEffect(() => {
    root.current?.requestFullscreen?.().catch(() => { /* 전체 화면을 못 쓰면 화면을 덮는 모드로 */ });
    const left = () => { if (!document.fullscreenElement) onClose(); };
    document.addEventListener('fullscreenchange', left);
    return () => document.removeEventListener('fullscreenchange', left);
  }, [onClose]);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'ArrowRight' || e.key === 'Enter') { e.preventDefault(); e.stopImmediatePropagation(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); e.stopImmediatePropagation(); prev(); }
      else if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); close(); }
      else if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); e.stopImmediatePropagation(); }
    };
    window.addEventListener('keydown', key, true); return () => window.removeEventListener('keydown', key, true);
  }, [next, prev, close]);
  const step = STEPS[cur.step];
  const ch = chapterOf(cur.step);
  return <div ref={root} className="dna-cinema" role="dialog" aria-modal="true" aria-label="실험 영상">
    <div className="dna-screen-area" onClick={next}>
      <Bench f={{ ...shown, say: cur.say }} focus={focusOf(cur)} zoom />
      <div className="dna-subtitle" aria-live="polite">{cur.say}</div>
      {!playing && !auto && <div className="dna-next-hint">스페이스 · 클릭 → 다음</div>}
    </div>
    <aside className="dna-aside">
      <div className="dna-aside-top"><span>파트 {ch + 1} · {CHAPTERS[ch].title}</span><button type="button" className="glass-button" onClick={close}>✕ 나가기</button></div>
      <div className="dna-step-kicker">{cur.step + 1} / {STEPS.length}단계</div>
      <h2>{step.title}</h2>
      <p>{step.text}</p>
      {step.why && <ul className="dna-why">{step.why.map(w => <li key={w}>{w}</li>)}</ul>}
      <ol className="dna-checklist">{step.frames.map((f, i) => <li key={i} className={i < cur.i ? 'is-done' : i === cur.i ? 'is-now' : ''}><button type="button" onClick={() => jump(startOf(cur.step) + i)}>{f.say}</button></li>)}</ol>
      <div className="dna-aside-controls">
        <button type="button" className="glass-button" onClick={prev} disabled={at === 0}>← 이전</button>
        <button type="button" className="glass-button" aria-pressed={auto} onClick={() => setAuto(a => !a)}>{auto ? '❚❚ 자동 멈춤' : '▶ 자동 재생'}</button>
        <button type="button" className="glass-button" onClick={next} disabled={at === TIMELINE.length - 1 && !playing}>다음 →</button>
      </div>
      <div className="dna-timeline" aria-label="진행">
        {STEPS.map((s, i) => <button type="button" key={s.title} title={s.title} aria-label={`${i + 1}단계 ${s.title}`} className={`${i < cur.step ? 'is-done' : i === cur.step ? 'is-now' : ''} ${CHAPTERS.some(c => c.from === i) ? 'is-checkpoint' : ''}`} onClick={() => jump(startOf(i))} />)}
      </div>
    </aside>
  </div>;
}

function MicroTube({ t }: { t: Tube }) {
  const h = t.kind === 'tube' ? 44 : 56, w = t.kind === 'tube' ? 18 : 20;
  const body = `M${-w / 2} ${-h} L${-w / 2} ${-14} Q0 2 ${w / 2} ${-14} L${w / 2} ${-h}`;
  const liquidH = (h - 10) * t.level;
  return <g className="dna-move" style={{ transform: `translate(${t.x}px, ${t.y}px)` }}>
    {t.kind !== 'tube' && <g>
      <rect x="-8" y={-h - 30} width="16" height="34" rx="3" className="dna-pink" />
      <rect x="-7" y={-h - 2} width="14" height="4" className="dna-membrane" />
      {t.level > 0 && t.kind === 'column' && <rect x="-6" y={-h - 2 - 20 * t.level} width="12" height={20 * t.level} className="dna-liquid" />}
    </g>}
    <path d={body} className={`dna-microtube ${t.kind === 'new' ? 'is-new' : ''}`} />
    {(t.kind === 'tube' || t.kind === 'new') && t.level > 0 && <path d={`M${-w / 2 + 2} ${-4 - liquidH} L${-w / 2 + 2} -14 Q0 0 ${w / 2 - 2} -14 L${w / 2 - 2} ${-4 - liquidH} Z`} className={`dna-liquid dna-move ${t.dna ? 'is-dna' : ''}`} />}
    <text y={t.kind === 'tube' ? -h - 8 : -h - 38} className="dna-small dna-tube-label">{t.label}</text>
  </g>;
}

function Pipette({ p }: { p: Pip }) {
  const press = p.press === 1 ? 6 : p.press === 2 ? 10 : 0;
  const scale = (p.m === 'P20' ? 0.9 : p.m === 'P1000' ? 1.12 : 1) * 1.25;
  return <g className="dna-move" style={{ transform: `translate(${p.x}px, ${p.y}px) scale(${scale})` }}>
    {/* 팔(소매)과 장갑 낀 손 */}
    <path d="M8 -48 C 40 -36, 70 0, 120 60" className="dna-sleeve" />
    {p.tip && <path d="M-4 -28 L4 -28 L1 0 L-1 0 Z" className={`dna-tip-mini ${p.tip}`} />}
    {p.tip && (p.liq ?? 0) > 0 && <path d="M-2.4 -14 L2.4 -14 L1 -1 L-1 -1 Z" className="dna-liquid" />}
    <rect x="-3" y="-36" width="6" height="9" className="dna-nozzle" />
    <rect x="-9" y="-104" width="18" height="70" rx="7" className="dna-body" />
    <text x="0" y="-80" className="dna-model">{p.m.slice(1)}</text>
    <g className="dna-move" style={{ transform: `translateY(${press}px)` }}><rect x="-5" y="-118" width="10" height="12" rx="3" className="dna-plunger" /></g>
    <ellipse cx="2" cy="-50" rx="13" ry="10" className="dna-glove" />
    <ellipse cx="0" cy="-112" rx="5" ry="4" className="dna-glove" />
  </g>;
}

/** 폰(좁은 화면)에서는 지금 움직이는 곳을 따라 실험대를 확대해 보여 준다. */
function useNarrow() {
  const query = '(max-width: 640px)';
  const [narrow, setNarrow] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => { const m = window.matchMedia(query); const on = () => setNarrow(m.matches); m.addEventListener('change', on); return () => m.removeEventListener('change', on); }, []);
  return narrow;
}
const focusOf = (f: Frame) => f.fx === 'spin' ? CENTRI.x : f.swab ? Math.min(f.swab.x, 400) : f.pip?.x ?? f.hi?.[0] ?? f.tubes[0]?.x ?? 450;

/** focus: 카메라가 비출 곳(x). zoom: 영화관 모드처럼 넓은 화면에서도 확대해 따라간다. 카메라는 부드럽게 옮겨 간다. */
function Bench({ f, focus, zoom }: { f: Frame; focus?: number; zoom?: boolean }) {
  const hi = new Set(f.hi ?? []);
  const narrow = useNarrow();
  const close = narrow || zoom;
  const w = narrow ? 420 : zoom ? 600 : 900;
  const x0 = close ? Math.max(0, Math.min(900 - w, (focus ?? focusOf(f)) - w / 2)) : 0;
  const y0 = close ? 140 : 130, h = close ? 290 : 300;
  return <svg viewBox={`0 ${y0} ${w} ${h}`} className="dna-svg is-bench" role="img" aria-label={f.say}><g className="dna-camera" style={{ transform: `translateX(${-x0}px)` }}>
    {/* 선반과 실험대 */}
    <rect x="0" y="400" width="900" height="30" className="dna-table" />
    <rect x="420" y="258" width="480" height="8" className="dna-shelf" />
    {/* 얼굴(채취 장면) */}
    <g className="dna-face dna-fade" style={{ opacity: f.swab ? 1 : 0 }}><circle cx="180" cy="214" r="40" /><circle cx="168" cy="204" r="4" className="dna-eye" /><path d="M176 232 q14 8 26 0" className="dna-mouth" /><text x="180" y="270" className="dna-small">볼 안쪽</text></g>
    {f.swab && <g className="dna-move" style={{ transform: `translate(${f.swab.x}px, ${f.swab.y}px)` }}><line x1="0" y1="0" x2="60" y2="-70" className="dna-swab" /><ellipse cx="0" cy="0" rx="5" ry="8" className="dna-swab-head" /></g>}
    {/* 피펫 거치대 */}
    <g className="dna-stand"><rect x="14" y="300" width="8" height="100" /><rect x="14" y="300" width="88" height="7" />{(['P20', 'P200', 'P1000'] as const).map((m, i) => <g key={m}><rect x={30 + i * 26} y="309" width="10" height="44" rx="4" className={f.pip?.m === m ? 'is-out' : ''} /><text x={35 + i * 26} y={366 + (i % 2) * 11} className="dna-small">{m}</text></g>)}<text x="58" y="422" className="dna-small">피펫 거치대</text></g>
    {/* 팁 상자 */}
    <g className={hi.has(TIPS.y) ? 'is-hi' : ''}><rect x={TIPS.y - 22} y="374" width="44" height="26" rx="4" className="dna-tipbox y" /><text x={TIPS.y} y="422" className="dna-small">노란 팁</text></g>
    <g className={hi.has(TIPS.b) ? 'is-hi' : ''}><rect x={TIPS.b - 22} y="374" width="44" height="26" rx="4" className="dna-tipbox b" /><text x={TIPS.b} y="422" className="dna-small">파란 팁</text></g>
    {/* 시약 */}
    {(Object.keys(REAG) as Reagent[]).map(r => <g key={r} className={hi.has(REAG[r]) ? 'is-hi' : ''}>
      {r === 'ProK' ? <rect x={REAG[r] - 22} y="368" width="44" height="32" rx="6" className="dna-ice" /> : null}
      <rect x={REAG[r] - 13} y="350" width="26" height="50" rx="5" className="dna-bottle" />
      <rect x={REAG[r] - 11} y="360" width="22" height="38" rx="4" className={`dna-reagent r-${r}`} />
      <text x={REAG[r]} y="422" className="dna-small">{REAG_NAME[r]}</text>
    </g>)}
    {/* 랙 · 볼텍서 · 히트블록 */}
    <rect x={RACK1 - 26} y="392" width="78" height="8" className="dna-rack" />
    <g className={`${hi.has(VORTEX) ? 'is-hi' : ''}`}><rect x={VORTEX - 24} y="372" width="48" height="28" rx="8" className="dna-machine" /><text x={VORTEX} y="422" className="dna-small">볼텍서</text></g>
    <g className={`${hi.has(HEAT) ? 'is-hi' : ''} ${f.fx === 'heat' ? 'is-heat' : ''}`}><rect x={HEAT - 28} y="374" width="56" height="26" rx="4" className="dna-heatblock" /><text x={HEAT} y="388" className="dna-temp-label">56°C</text><text x={HEAT} y="422" className="dna-small">히트블록</text></g>
    {/* 폐기통 */}
    <g className={hi.has(WASTE.x) ? 'is-hi' : ''}><path d={`M${WASTE.x - 22} ${WASTE.y - 16} L${WASTE.x - 16} 258 L${WASTE.x + 16} 258 L${WASTE.x + 22} ${WASTE.y - 16}`} className="dna-waste" /><text x={WASTE.x} y="280" className="dna-small">폐기통</text></g>
    {/* 원심분리기 */}
    <g className={hi.has(CENTRI.x) ? 'is-hi' : ''}>
      <rect x={CENTRI.x - 60} y={CENTRI.y - 50} width="120" height="102" rx="18" className="dna-machine" />
      <g className={f.fx === 'spin' ? 'dna-rotor is-spin' : 'dna-rotor'} style={{ transformOrigin: `${CENTRI.x}px ${CENTRI.y}px` }}>
        <circle cx={CENTRI.x} cy={CENTRI.y} r="38" className="dna-rotor-plate" />
        {f.fx === 'spin' && <><rect x={CENTRI.x - 5} y={CENTRI.y - 34} width="10" height="22" rx="4" className="dna-pink" /><rect x={CENTRI.x - 5} y={CENTRI.y + 12} width="10" height="22" rx="4" className="dna-balance" /></>}
      </g>
      <text x={CENTRI.x} y="280" className="dna-small">원심분리기{f.fx === 'spin' ? ' · 대칭 배치' : ''}</text>
    </g>
    {/* NanoDrop */}
    <g className={hi.has(NANO.x) ? 'is-hi' : ''}>
      <rect x={NANO.x - 50} y={NANO.y} width="100" height="22" rx="8" className="dna-machine" />
      <rect x={NANO.x - 8} y={NANO.y - 3} width="16" height="5" rx="2" className="dna-pedestal" />
      <g className="dna-move" style={{ transform: f.nano?.arm === 'down' ? 'rotate(0deg)' : 'rotate(-40deg)', transformOrigin: `${NANO.x - 46}px ${NANO.y - 26}px` }}>
        <rect x={NANO.x - 50} y={NANO.y - 34} width="76" height="16" rx="7" className="dna-machine" />
        <rect x={NANO.x - 8} y={NANO.y - 19} width="16" height="4" rx="2" className="dna-pedestal" />
      </g>
      {f.nano?.drop && <rect x={NANO.x - 4} y={f.nano.arm === 'down' ? NANO.y - 15 : NANO.y - 9} width="8" height={f.nano.arm === 'down' ? 12 : 6} rx="3" className="dna-liquid dna-move" />}
      {f.fx === 'measure' && <line x1={NANO.x} y1={NANO.y + 2} x2={NANO.x} y2={NANO.y - 16} className="dna-uv" />}
      {f.fx === 'wipe' && <rect x={NANO.x - 18} y={NANO.y - 12} width="36" height="8" rx="3" className="dna-cloth" />}
      <rect x={NANO.x + 56} y={NANO.y - 60} width="72" height="58" rx="8" className="dna-screen" />
      <text x={NANO.x + 92} y={NANO.y - 40} className="dna-screen-title">{f.nano?.screen ?? 'Home'}</text>
      {f.nano?.screen === 'Result' && <path d={`M${NANO.x + 62} ${NANO.y - 8} C ${NANO.x + 80} ${NANO.y - 10}, ${NANO.x + 86} ${NANO.y - 34}, ${NANO.x + 92} ${NANO.y - 34} C ${NANO.x + 98} ${NANO.y - 34}, ${NANO.x + 104} ${NANO.y - 12}, ${NANO.x + 122} ${NANO.y - 8}`} className="dna-peak" />}
      <text x={NANO.x} y="280" className="dna-small">NanoDrop One</text>
    </g>
    {f.fx === 'timer' && <g className="dna-timer"><circle cx={RACK2 + 40} cy="300" r="16" /><text x={RACK2 + 40} y="305">1분</text></g>}
    {/* 튜브들 */}
    {f.tubes.map((t, i) => <g key={i} className={f.fx === 'vortex' && t.x === VORTEX ? 'dna-shake' : ''}><MicroTube t={t} /></g>)}
    {f.pip && <Pipette p={f.pip} />}
  </g></svg>;
}
