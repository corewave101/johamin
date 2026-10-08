// 문장 배치: the pieces of an answer are dealt face up across the table; put them on the deck in order.
// Tap (or click) a piece to deal it onto the deck, tap a dealt piece to take it (and everything after it) back.
// Keys: 1–9 deal the numbered piece, Backspace takes the last one back, Enter goes on once the deck is checked.
import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { isTyping } from '../../lib/directions';
import { modalOpen } from './MenuCard';

export interface OrderResult { firstTry: boolean; right: number; total: number }

function shuffled(count: number, seed: number) {
  const order = Array.from({ length: count }, (_, i) => i);
  let s = seed || 1;
  const random = () => { s = (s * 16807) % 2147483647; return s / 2147483647; };
  for (let i = count - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  if (count > 1 && order.every((v, i) => v === i)) order.reverse(); // never dealt already solved
  return order;
}
// A little scatter so the table looks dealt by hand, the same every time for the same piece.
const scatter = (i: number): CSSProperties => ({ '--tilt': `${((i * 37) % 9) - 4}deg`, '--lift': `${((i * 53) % 7) - 3}px` } as CSSProperties);

export default function OrderDeck({ pieces, title, prompt, step, onNext, nextLabel = '다음 →' }: {
  pieces: string[]; title: string; prompt: string; step?: string;
  onNext: (result: OrderResult) => void; nextLabel?: string;
}) {
  const seed = useMemo(() => Math.floor(Math.random() * 2147483646) + 1, [pieces]);
  const deal = useMemo(() => shuffled(pieces.length, seed), [pieces.length, seed]);
  const [placed, setPlaced] = useState<number[]>([]);
  const [tries, setTries] = useState(0);
  const [shown, setShown] = useState(false); // gave up and looked at the answer
  const firstResult = useRef<OrderResult | null>(null);
  const pool = deal.filter(i => !placed.includes(i));
  const full = placed.length === pieces.length;
  const rightAt = placed.map((piece, slot) => piece === slot);
  const right = rightAt.filter(Boolean).length;
  const solved = full && right === pieces.length;
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => { setPlaced([]); setTries(0); setShown(false); firstResult.current = null; heading.current?.focus({ preventScroll: true }); }, [pieces]);
  useEffect(() => {
    if (!full) return;
    setTries(n => n + 1);
    if (!firstResult.current) firstResult.current = { firstTry: right === pieces.length, right, total: pieces.length };
  }, [full]); // eslint-disable-line react-hooks/exhaustive-deps

  const put = (piece: number) => { if (!full) setPlaced(p => [...p, piece]); };
  const takeBack = (slot: number) => { if (!solved) setPlaced(p => p.slice(0, slot)); };
  const retryFromWrong = () => setPlaced(p => p.slice(0, rightAt.indexOf(false)));
  const finish = () => onNext(firstResult.current ?? { firstTry: false, right: 0, total: pieces.length });

  const state = useRef({ pool, full, solved, shown });
  state.current = { pool, full, solved, shown };
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event) || modalOpen()) return;
      const s = state.current;
      if (/^[1-9]$/.test(event.key)) { const piece = s.pool[Number(event.key) - 1]; if (piece !== undefined) { event.preventDefault(); put(piece); } return; }
      if (event.key === 'Backspace') { event.preventDefault(); if (!s.solved) setPlaced(p => p.slice(0, -1)); return; }
      if (event.key === 'Enter' && (s.solved || s.shown) && !(event.target instanceof HTMLButtonElement)) { event.preventDefault(); if (!event.repeat) finish(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }); // re-bound every render so it always sees the latest handlers

  return <section className="order-deck glass" aria-label="문장 배치">
    <div className="biology-progress"><span>{step}</span><span>{tries > 0 && !solved ? `${tries}번째 맞춰 보는 중` : ''}</span></div>
    <h2 ref={heading} tabIndex={-1}>{title}</h2>
    <p className="order-prompt">{prompt}</p>
    <ol className={`order-slots ${full ? (solved ? 'is-solved' : 'is-checked') : ''}`} aria-label="쌓은 순서">
      {pieces.map((_, slot) => {
        const piece = placed[slot];
        if (piece === undefined) return <li key={`empty-${slot}`} className="order-slot is-empty"><span className="order-num">{slot + 1}</span></li>;
        const mark = full ? (rightAt[slot] ? 'is-right' : 'is-wrong') : '';
        return <li key={`p-${piece}`} className={`order-slot is-filled ${mark}`}>
          <button type="button" onClick={() => takeBack(slot)} disabled={solved} aria-label={`${slot + 1}번째: ${pieces[piece]}${solved ? '' : ' · 눌러서 되돌리기'}`}>
            <span className="order-num">{full ? (rightAt[slot] ? '✓' : '✕') : slot + 1}</span><span>{pieces[piece]}</span>
          </button>
        </li>;
      })}
    </ol>
    {!full && <div className="order-table" aria-label="남은 조각">
      {pool.map((piece, k) => <button type="button" key={piece} className="order-piece" style={scatter(piece)} onClick={() => put(piece)}>
        <kbd>{k + 1}</kbd><span>{pieces[piece]}</span>
      </button>)}
    </div>}
    {!full && <p className="biology-note">조각을 순서대로 누르면 위 덱에 착착 쌓여요. 쌓은 조각을 누르면 그 뒤까지 되돌아와요. PC는 숫자키로 고르고 Backspace로 되돌려요.</p>}
    {full && <div className="biology-model" role="status">
      {solved ? <><h3>{tries === 1 ? '한 번에 완성!' : '완성!'}</h3><p>{pieces.join(' ')}</p></>
        : <><h3>{right} / {pieces.length} 자리 맞았어요</h3><p>✕ 표시된 자리부터 다시 놓아 보세요.</p></>}
      <div className="biology-actions">
        {!solved && <button type="button" className="glass-button" onClick={retryFromWrong}>틀린 자리부터 다시</button>}
        {!solved && !shown && <button type="button" className="glass-button" onClick={() => setShown(true)}>정답 순서 보기</button>}
        {(solved || shown) && <button type="button" className="glass-button is-primary" onClick={finish}>{nextLabel} <kbd>Enter</kbd></button>}
      </div>
      {shown && !solved && <ol className="order-answer">{pieces.map((piece, i) => <li key={i}>{piece}</li>)}</ol>}
    </div>}
  </section>;
}
