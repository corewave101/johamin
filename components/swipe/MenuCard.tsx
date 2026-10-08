// A menu that works like a card: up to three choices on ↑ ← →, and ↓ is always "back" (grey).
// Arrow keys, swiping the card and tapping the choices all do the same thing, so nobody has to switch
// from keys to mouse or from swiping to tapping in the middle of studying.
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import type { Direction } from '../../data/swipe-cards';
import { arrows, directionOf, directions, isTyping, keyDirections, SWIPE_DISTANCE } from '../../lib/directions';
import { playTick } from '../../lib/sound';
import LaminatedCard from './LaminatedCard';

export interface MenuChoice { label: string; note?: string; onChoose: () => void; disabled?: boolean }
type Props = {
  topic: string; subject?: string; question: string;
  up?: MenuChoice; left?: MenuChoice; right?: MenuChoice;
  onBack: () => void; backLabel?: string;
  /** Tapping the card (or Space) — e.g. flipping a word card. */
  onTap?: () => void;
  /** Changes when the card itself changes, so it is dealt fresh. */
  cardKey?: string;
  children?: ReactNode;   // shown under the card (a note, small extra buttons)
  overlay?: ReactNode;    // shown on the card
};

export const modalOpen = () => typeof document !== 'undefined' && Boolean(document.querySelector('[aria-modal="true"]'));

export default function MenuCard({ topic, subject, question, up, left, right, onBack, backLabel = '이전', onTap, cardKey, children, overlay }: Props) {
  const [drag, setDrag] = useState({ x: 0, y: 0 });
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const slots: Record<Direction, (MenuChoice & { back?: boolean }) | undefined> = { up, left, right, down: { label: backLabel, onChoose: onBack, back: true } };
  const latest = useRef(slots);
  latest.current = slots;
  const tap = useRef(onTap);
  tap.current = onTap;

  const choose = useCallback((direction: Direction) => {
    const slot = latest.current[direction];
    if (!slot || slot.disabled) return;
    playTick();
    setDrag({ x: 0, y: 0 });
    pointer.current = null;
    slot.onChoose();
  }, []);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, [cardKey]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event) || modalOpen()) return;
      if (event.code === 'Space' && tap.current && !(event.target instanceof HTMLButtonElement)) { event.preventDefault(); if (!event.repeat) tap.current(); return; }
      const direction = keyDirections[event.key];
      if (!direction) return;
      event.preventDefault();
      if (!event.repeat) choose(direction);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [choose]);

  const reset = () => { pointer.current = null; setDrag({ x: 0, y: 0 }); };
  const move = (event: PointerEvent<HTMLElement>) => {
    if (!pointer.current || pointer.current.id !== event.pointerId) return;
    setDrag({ x: event.clientX - pointer.current.x, y: event.clientY - pointer.current.y });
  };
  const release = (event: PointerEvent<HTMLElement>) => {
    if (!pointer.current || pointer.current.id !== event.pointerId) return;
    const x = event.clientX - pointer.current.x, y = event.clientY - pointer.current.y;
    reset();
    if (Math.hypot(x, y) >= SWIPE_DISTANCE) choose(directionOf(x, y));
    else if (Math.hypot(x, y) < 8) tap.current?.();
  };
  const distance = Math.hypot(drag.x, drag.y);
  const active = distance > 18 ? directionOf(drag.x, drag.y) : null;
  const highlighted = active && slots[active] && !slots[active]?.disabled ? slots[active] : null;

  return <main className="swipe-app subject-app menu-card-app">
    <div className="swipe-game">
      <header className="swipe-heading"><h1 className="glass" ref={heading} tabIndex={-1}>조하민<span>레츠고</span></h1></header>
      <section className="swipe-board menu-board" aria-label={`${subject ?? question} 메뉴`}>
        {directions.map(direction => {
          const slot = slots[direction];
          const enabled = Boolean(slot && !slot.disabled);
          return <button type="button" key={direction} disabled={!enabled}
            className={`swipe-option swipe-option-${direction} ${enabled ? 'glass' : 'swipe-empty-option'} ${slot?.back ? 'is-back' : ''} ${active === direction && enabled ? 'is-active' : ''}`}
            onClick={() => choose(direction)} aria-label={enabled && slot ? `${arrows[direction]} ${slot.label}` : '빈 선택지'}>
            <kbd>{arrows[direction]}</kbd>
            {slot && <span>{slot.label}{slot.note && <small>{slot.note}</small>}</span>}
          </button>;
        })}
        <div className="swipe-stack">
          <div className="swipe-under swipe-under-two" /><div className="swipe-under swipe-under-one" />
          <LaminatedCard key={cardKey ?? question} className={`is-current ${pointer.current ? 'is-dragging' : ''} ${onTap ? 'is-tappable' : ''}`}
            style={{ '--tx': `calc(${drag.x}px / var(--card-zoom, 1))`, '--ty': `calc(${drag.y}px / var(--card-zoom, 1))`, '--rot': `${drag.x / 22}deg` } as CSSProperties}
            topic={topic} subject={subject} question={question}
            onPointerDown={event => { if (!event.isPrimary || event.button !== 0) return; pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }}
            onPointerMove={move} onPointerUp={release} onPointerCancel={reset} onLostPointerCapture={() => { if (pointer.current) reset(); }}>
            {overlay}
            {highlighted && <div className={`swipe-drag-label ${distance >= SWIPE_DISTANCE ? 'is-ready' : ''}`}>{arrows[active!]} {highlighted.label}</div>}
          </LaminatedCard>
        </div>
      </section>
      {children}
    </div>
  </main>;
}

/** Esc goes back one step. Listens before the subject picker so it does not jump all the way out. */
export function useEscape(onEscape: () => void) {
  const latest = useRef(onEscape);
  latest.current = onEscape;
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || modalOpen()) return;
      event.preventDefault();
      event.stopPropagation();
      if (!event.repeat) latest.current();
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, []);
}
