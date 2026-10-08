import { useEffect, useState } from 'react';
import { CARD_SIZES, cardSize, onCardSizeChange, setCardSize, stepCardSize } from '../../lib/card-size';

/** Bottom-right corner: make the card set smaller or bigger. Works the same under every blessing. */
export default function CardSizeControl() {
  const [size, setSize] = useState(cardSize);
  const [open, setOpen] = useState(false);
  useEffect(() => onCardSizeChange(setSize), []);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  // Phones stop at 120% (see app/swipe.css) so the arrows still fit beside the card.
  const max = typeof matchMedia === 'function' && matchMedia('(max-width: 900px)').matches ? 1.2 : CARD_SIZES[CARD_SIZES.length - 1];
  const shown = Math.min(size, max);
  const percent = Math.round(shown * 100);
  return <div className="card-size">
    {open && <div className="card-size-panel glass">
     <div className="card-size-row" role="group" aria-label="카드 크기">
      <span className="card-size-label">크기</span>
      <button type="button" onClick={() => stepCardSize(-1)} disabled={size === CARD_SIZES[0]} aria-label="카드 작게">−</button>
      <output aria-live="polite">{percent}%</output>
      <button type="button" onClick={() => { if (size < max) stepCardSize(1); }} disabled={shown >= max} aria-label="카드 크게">+</button>
      {size !== 1 && <button type="button" className="card-size-reset" onClick={() => setCardSize(1)}>기본</button>}
     </div>
    </div>}
    <button type="button" className="card-size-toggle glass" aria-expanded={open} onClick={() => setOpen(!open)} title="카드 크기">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3.5" width="12" height="17" rx="2.5" /><path d="M2.5 9v6M21.5 9v6" /></svg>
      <span>{percent === 100 ? '크기' : `${percent}%`}</span>
    </button>
  </div>;
}
