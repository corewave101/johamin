import { useEffect, useState } from 'react';
import { answerView, onAnswerViewChange, setAnswerView } from '../../lib/answer-view';
import { CARD_SIZES, cardSize, onCardSizeChange, setCardSize, stepCardSize } from '../../lib/card-size';

/** Bottom-right corner: card size and how answers show. Works the same under every blessing. */
export default function CardSizeControl() {
  const [size, setSize] = useState(cardSize);
  const [view, setView] = useState(answerView);
  const [open, setOpen] = useState(false);
  useEffect(() => onCardSizeChange(setSize), []);
  useEffect(() => onAnswerViewChange(setView), []);
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
     <div className="card-size-row" role="radiogroup" aria-label="답 보기">
      <span className="card-size-label">답</span>
      <button type="button" role="radio" aria-checked={view === 'open'} className="card-size-choice" onClick={() => setAnswerView('open')}>다 보이기</button>
      <button type="button" role="radio" aria-checked={view === 'hidden'} className="card-size-choice" onClick={() => setAnswerView('hidden')}>가리고 밀기</button>
     </div>
     {view === 'hidden' && <p className="card-size-help">답이 흐리게 가려져요. 카드를 밀거나 방향키·답을 한 번 누르면 그 답만 또렷해지고, 링이 차면 확정이에요. 같은 방향을 한 번 더 누르거나 Enter로 골라요.</p>}
    </div>}
    <button type="button" className="card-size-toggle glass" aria-expanded={open} onClick={() => setOpen(!open)} title="카드 크기 · 답 보기">
      <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3.5" width="12" height="17" rx="2.5" /><path d="M2.5 9v6M21.5 9v6" /></svg>
      <span>{percent === 100 ? '보기' : `${percent}%`}</span>
    </button>
  </div>;
}
