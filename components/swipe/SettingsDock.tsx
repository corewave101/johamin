// 설정(≡) 버튼(4.11.0~): 소리 · 답 가리기 · 카드 크기 · 갑툭튀 · 롯데 로고 · 업데이트 확인을 한곳에 모았다.
// 버튼은 화면 위에 떠 있고, 끌어서 옮기면 왼쪽 · 오른쪽 가장자리에 붙는다(위치는 이 기기에 기억, lib/settings.ts).
// 정보 코딩 연습장(/elice/)은 위쪽 막대의 elice-dock을 그대로 쓴다.
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import AppStatus from './AppStatus';
import { isMuted, onMutedChange, setMuted } from '../../lib/sound';
import { answerView, onAnswerViewChange, setAnswerView } from '../../lib/answer-view';
import { CARD_SIZES, cardSize, onCardSizeChange, setCardSize, stepCardSize } from '../../lib/card-size';
import { dockSpot, isOn, onToggle, saveDockSpot, setOn, snapDock, type DockSpot, type ToggleKey } from '../../lib/settings';
import { isLotte } from '../../lib/exam';

const DRAG_START = 6;
/** 기본 자리: 오른쪽 가장자리. 넓은 화면은 위쪽 막대(가호 · 진행 막대 · 연속 정답) 바로 아래,
 *  세로 폰은 위쪽에 국어 · 영어 지문 칸이 오므로 아래쪽(처음으로 칸과 롯데 로고 위). */
const defaultSpot = (): DockSpot => {
  if (typeof window === 'undefined') return { side: 'right', y: 0.15 };
  const h = Math.max(window.innerHeight, 1);
  return window.innerWidth <= 600 && h > window.innerWidth ? { side: 'right', y: Math.max(0.5, (h - 160) / h) } : { side: 'right', y: Math.min(0.5, 104 / h) };
};

function Switch({ label, note, on, set }: { label: string; note?: string; on: boolean; set: (on: boolean) => void }) {
  return <button type="button" role="switch" aria-checked={on} className="settings-row settings-switch" onClick={() => set(!on)}>
    <span><strong>{label}</strong>{note && <small>{note}</small>}</span>
    <i aria-hidden="true" />
  </button>;
}

function useToggle(key: ToggleKey) {
  const [on, setState] = useState(() => isOn(key));
  useEffect(() => onToggle((k, value) => { if (k === key) setState(value); }), [key]);
  return [on, (value: boolean) => setOn(key, value)] as const;
}

function Panel({ onClose, side, lower }: { onClose: () => void; side: 'left' | 'right'; lower: boolean }) {
  const [muted, setMutedState] = useState(isMuted);
  useEffect(() => onMutedChange(setMutedState), []);
  const [hidden, setHidden] = useState(() => answerView() === 'hidden');
  useEffect(() => onAnswerViewChange(view => setHidden(view === 'hidden')), []);
  const [size, setSize] = useState(cardSize);
  useEffect(() => onCardSizeChange(setSize), []);
  const [scares, setScares] = useToggle('scares');
  const [peek, setPeek] = useToggle('lottePeek');
  // Phones stop at 120% (see app/swipe.css) so the arrows still fit beside the card.
  const max = typeof matchMedia === 'function' && matchMedia('(max-width: 900px)').matches ? 1.2 : CARD_SIZES[CARD_SIZES.length - 1];
  const shown = Math.min(size, max);
  const first = useRef<HTMLButtonElement>(null);
  useEffect(() => { first.current?.focus(); }, []);
  const rows: ReactNode[] = [
    <Switch key="sound" label="소리" note={muted ? '꺼져 있어요' : '넘김 · 정답 소리'} on={!muted} set={on => setMuted(!on)} />,
    <Switch key="hide" label="답 가리기" note={hidden ? '미는 쪽 답만 또렷해져요' : '보기 네 개가 다 보여요'} on={hidden} set={on => setAnswerView(on ? 'hidden' : 'open')} />,
    <div key="size" className="settings-row settings-size" role="group" aria-label="카드 크기">
      <span><strong>카드 크기</strong><small>{Math.round(shown * 100)}%</small></span>
      <div>
        <button type="button" onClick={() => stepCardSize(-1)} disabled={size === CARD_SIZES[0]} aria-label="카드 작게">−</button>
        <button type="button" onClick={() => { if (size < max) stepCardSize(1); }} disabled={shown >= max} aria-label="카드 크게">+</button>
        {size !== 1 && <button type="button" className="settings-reset" onClick={() => setCardSize(1)}>기본</button>}
      </div>
    </div>,
    <Switch key="scares" label="갑툭튀" note={scares ? '하민의 가호 · 직접 만든 가호에서 나와요' : '꺼져 있어요'} on={scares} set={setScares} />,
    ...(isLotte ? [] : [<Switch key="peek" label="롯데 로고" note={peek ? '메인 화면 구석에 보여요' : '숨겨져 있어요'} on={peek} set={setPeek} />]),
  ];
  return <>
    <div className="settings-scrim" onClick={onClose} aria-hidden="true" />
    <div className={`settings-panel glass is-${side}${lower ? ' is-lower' : ''}`} role="dialog" aria-modal="true" aria-label="설정">
      <div className="settings-head"><strong>설정</strong><button ref={first} type="button" className="settings-close" onClick={onClose} aria-label="설정 닫기">닫기</button></div>
      <div className="settings-rows">{rows}</div>
      <div className="settings-update"><AppStatus /></div>
      <p className="settings-tip">≡ 버튼은 끌어서 옮길 수 있어요.</p>
    </div>
  </>;
}

export default function SettingsDock() {
  const [spot, setSpot] = useState<DockSpot>(() => dockSpot() ?? defaultSpot());
  const [open, setOpen] = useState(false);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const pointer = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
  const button = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => { setOpen(false); button.current?.focus(); }, []);
  useEffect(() => {
    if (!open) return;
    // 열려 있는 동안 방향키 · Esc가 카드나 메뉴를 움직이지 않게 막는다.
    const guard = (event: KeyboardEvent) => {
      if (event.key === 'Tab') return;
      if (event.key === 'Escape') { event.preventDefault(); close(); }
      event.stopImmediatePropagation();
    };
    window.addEventListener('keydown', guard, true);
    return () => window.removeEventListener('keydown', guard, true);
  }, [open, close]);

  const down = (event: PointerEvent<HTMLButtonElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent<HTMLButtonElement>) => {
    const p = pointer.current;
    if (!p || p.id !== event.pointerId) return;
    if (!p.moved && Math.hypot(event.clientX - p.x, event.clientY - p.y) < DRAG_START) return;
    p.moved = true;
    setDrag({ x: event.clientX, y: event.clientY });
  };
  const up = (event: PointerEvent<HTMLButtonElement>) => {
    const p = pointer.current;
    if (!p || p.id !== event.pointerId) return;
    pointer.current = null;
    if (p.moved) {
      const next = snapDock(event.clientX, event.clientY, window.innerWidth, window.innerHeight);
      setSpot(next); saveDockSpot(next); setDrag(null);
    } else setOpen(o => !o);
  };
  const cancel = () => { pointer.current = null; setDrag(null); };
  const style = (drag
    ? { left: `${drag.x}px`, top: `${drag.y}px`, translate: '-50% -50%' }
    : { [spot.side]: 'max(10px, env(safe-area-inset-' + spot.side + ', 0px))', top: `calc(${(spot.y * 100).toFixed(2)}% - 22px)` }) as CSSProperties;
  return <>
    <button ref={button} type="button" className={`settings-fab glass${drag ? ' is-dragging' : ''}${open ? ' is-open' : ''}`} style={style}
      aria-label="설정" aria-expanded={open} aria-haspopup="dialog" title="설정 · 끌어서 옮기기"
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={cancel}
      onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); event.stopPropagation(); setOpen(o => !o); } }}>
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 7h14M5 12h14M5 17h14" /></svg>
    </button>
    {open && <Panel onClose={close} side={spot.side} lower={spot.y > 0.5} />}
  </>;
}
