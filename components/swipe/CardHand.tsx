// 베타 · 카드 패: a subject's menu held as a hand of cards (the same laminated cards as the questions), fanned in an arc.
//   ← → (or slide a finger across the hand) moves to the next card, ↑ / Enter / flicking the card up plays it,
//   ↓ / Esc goes back. A mouse click plays a card; on touch the first tap lifts it and the second tap (or a flick up) plays it.
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { isTyping } from '../../lib/directions';
import { playTick } from '../../lib/sound';
import { modalOpen, useEscape } from './MenuCard';

export interface HandCard { id: string; kicker: string; title: string; note?: string; disabled?: boolean; onPlay: () => void }

const CARD_W = 168; // matches .hand-card width (before card zoom)

export default function CardHand({ deckName, prompt, cards, onBack, backLabel, start = 0 }: {
  deckName: string; prompt: string; cards: HandCard[]; onBack: () => void; backLabel: string; start?: number;
}) {
  const [at, setAt] = useState(Math.min(start, Math.max(cards.length - 1, 0)));
  const [played, setPlayed] = useState<number | null>(null);
  const [width, setWidth] = useState(700);
  const hand = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const drag = useRef<{ id: number; x: number; y: number; i: number | null; type: string; moved: boolean } | null>(null);

  useEffect(() => {
    const el = hand.current;
    if (!el) return;
    const measure = () => setWidth(el.clientWidth);
    measure();
    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { heading.current?.focus({ preventScroll: true }); }, []);

  const play = useCallback((i: number) => {
    const card = cards[i];
    if (!card || card.disabled || played !== null) return;
    playTick();
    setAt(i);
    setPlayed(i);
    setTimeout(() => card.onPlay(), 260); // let the card rise out of the hand first
  }, [cards, played]);
  const step = useCallback((d: number) => setAt(i => Math.min(cards.length - 1, Math.max(0, i + d))), [cards.length]);

  useEscape(onBack);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event) || modalOpen()) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); step(event.key === 'ArrowRight' ? 1 : -1); }
      else if (event.key === 'ArrowUp' || ((event.key === 'Enter' || event.key === ' ') && !(event.target instanceof HTMLButtonElement))) { event.preventDefault(); if (!event.repeat) play(at); }
      else if (event.key === 'ArrowDown') { event.preventDefault(); if (!event.repeat) onBack(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [at, play, step, onBack]);

  // Fan: spacing shrinks as the hand grows so it always fits; the angle shrinks too.
  const n = cards.length;
  const cardW = Math.min(CARD_W, width * 0.42);
  const gap = n > 1 ? Math.min(cardW * 0.78, (width * 0.9 - cardW) / (n - 1)) : 0;
  const angle = Math.min(6, 30 / Math.max(n, 1));
  const drop = Math.min(angle * 0.9, 46 / Math.max(1, ((n - 1) / 2) ** 2)); // how far the outer cards sink along the arc
  const indexAt = (x: number) => {
    const rect = hand.current?.getBoundingClientRect();
    if (!rect || n < 2) return 0;
    const left = rect.left + (rect.width - (cardW + gap * (n - 1))) / 2;
    return Math.min(n - 1, Math.max(0, Math.round((x - left - cardW / 2) / gap)));
  };

  const down = (event: PointerEvent<HTMLDivElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    const target = (event.target as HTMLElement).closest<HTMLElement>('[data-i]');
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, i: target ? Number(target.dataset.i) : null, type: event.pointerType, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    const dx = event.clientX - d.x, dy = event.clientY - d.y;
    if (Math.hypot(dx, dy) > 10) d.moved = true;
    // Sliding sideways scrubs through the hand.
    if (d.moved && Math.abs(dx) > Math.abs(dy)) setAt(indexAt(event.clientX));
  };
  const up = (event: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.id !== event.pointerId) return;
    const dx = event.clientX - d.x, dy = event.clientY - d.y;
    if (dy < -60 && Math.abs(dy) > Math.abs(dx)) { play(at); return; }          // flick up: play the lifted card
    if (d.moved) return;
    const i = d.i ?? indexAt(event.clientX);
    if (d.type === 'mouse' || i === at) play(i); else setAt(i);                // touch: first tap lifts, second plays
  };

  const current = cards[at];
  return <main className="swipe-app hand-app">
    <div className="swipe-game hand-game">
      <header className="swipe-heading"><h1 className="glass" ref={heading} tabIndex={-1}>조하민<span>레츠고</span></h1></header>
      <div className="swipe-deck-bar glass">
        <button type="button" className="glass-button" onClick={onBack}>← {backLabel}</button>
        <strong>{deckName}</strong>
        <span className="hand-beta">베타</span>
      </div>
      <p className="hand-prompt">{prompt}</p>
      <div className="hand" ref={hand} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={() => { drag.current = null; }}
        style={{ '--card-w': `${cardW}px` } as CSSProperties} role="listbox" aria-label={prompt} aria-activedescendant={current ? `hand-${current.id}` : undefined}>
        {cards.map((card, i) => {
          const offset = i - (n - 1) / 2;
          const lifted = i === at;
          const style = {
            '--x': `${(i - (n - 1) / 2) * gap}px`, '--r': `${offset * angle}deg`, '--y': `${offset * offset * drop}px`, '--z': lifted ? 50 : i,
          } as CSSProperties;
          return <div key={card.id} id={`hand-${card.id}`} data-i={i} role="option" aria-selected={lifted} aria-disabled={card.disabled || undefined}
            className={`hand-card ${lifted ? 'is-lifted' : ''} ${played === i ? 'is-played' : ''} ${card.disabled ? 'is-disabled' : ''}`} style={style}>
            <span className="swipe-card hand-face">
              <span className="card-art" aria-hidden="true" />
              <span className="hand-corner" aria-hidden="true">{card.title}</span>
              <span className="card-caption">
                <span className="card-topic">{card.kicker}</span>
                <span className="hand-title">{card.title}</span>
                {card.note && <span className="hand-note">{card.note}</span>}
              </span>
              <span className="card-gloss" aria-hidden="true" />
            </span>
          </div>;
        })}
      </div>
      <div className="hand-actions">
        <button type="button" className="glass-button" disabled={at === 0} onClick={() => step(-1)} aria-label="이전 카드">←</button>
        <button type="button" className="glass-button is-primary hand-play" disabled={!current || current.disabled} onClick={() => play(at)}>
          {current ? `${current.title} 고르기` : '고르기'} <kbd>↑</kbd>
        </button>
        <button type="button" className="glass-button" disabled={at === n - 1} onClick={() => step(1)} aria-label="다음 카드">→</button>
      </div>
      <p className="hand-hint">← → 로 넘기고 ↑ 로 골라요 · 손가락으로 쓸어 넘기고 위로 튕기면 골라져요 · ↓ 뒤로</p>
    </div>
  </main>;
}
