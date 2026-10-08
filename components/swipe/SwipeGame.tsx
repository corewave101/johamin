import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { swipeCards, type Direction, type SwipeCard } from '../../data/swipe-cards';
import { arrows, directionOf, directions, isTyping, keyDirections, SWIPE_DISTANCE } from '../../lib/directions';
import { playResult, playSwipe } from '../../lib/sound';
import { recordResult } from '../../lib/progress';
import { recordStreak } from '../../lib/best-streak';
import { IDLE_MS, LEAVE_CHANCE, newTracker, scareForAnswer, triggerScare } from '../../lib/jumpscare';
import { answerCard, getStats, newGame, type AnswerChoice } from '../../lib/swipe-game';
import LaminatedCard from './LaminatedCard';
import StreakFlame from './StreakFlame';

type Offset = { x: number; y: number };
type Flight = { card: SwipeCard; direction: Direction; id: number; from: Offset };
const FLIGHT_MS = 380;

export default function SwipeGame({ cards = swipeCards, deckName = '샘플 덱', deckId, onBack, backLabel = '← 과목' }: { cards?: SwipeCard[]; deckName?: string; deckId?: string; onBack?: () => void; backLabel?: string }) {
  const [game, setGame] = useState(() => newGame(cards));
  const gameRef = useRef(game);
  const scares = useRef(newTracker());
  const idleShown = useRef(false);
  const deck = useRef({ deckId, deckName, onBack });
  deck.current = { deckId, deckName, onBack };
  const started = useRef(performance.now());
  const [flight, setFlight] = useState<Flight | null>(null);
  const [drag, setDrag] = useState<Offset>({ x: 0, y: 0 });
  const dragRef = useRef<Offset>({ x: 0, y: 0 });
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const flightTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const card = game.queue[0];
  const last = game.attempts.at(-1);
  const stats = getStats(game);
  const finished = !card;
  const distance = Math.hypot(drag.x, drag.y);
  const activeDirection = distance > 18 ? directionOf(drag.x, drag.y) : null;

  const moveCard = (offset: Offset) => { dragRef.current = offset; setDrag(offset); };

  const choose = useCallback((direction: AnswerChoice) => {
    const current = gameRef.current;
    if (!current.queue.length) return;
    const now = performance.now();
    const flyTo = direction === 'unknown' ? 'down' : direction;
    setFlight({ card: current.queue[0], direction: flyTo, id: now, from: dragRef.current });
    clearTimeout(flightTimer.current);
    flightTimer.current = setTimeout(() => setFlight(null), FLIGHT_MS);
    const next = answerCard(current, direction, (now - started.current) / 1000);
    const answered = next.attempts[next.attempts.length - 1];
    recordResult(answered.card.id, direction === 'unknown' ? 'u' : answered.correct ? 'c' : 'w');
    const judged = scareForAnswer(scares.current, { correct: answered.correct, unknown: direction === 'unknown', seconds: answered.seconds,
      streakBefore: current.streak, streakAfter: next.streak, astronomy: Boolean(deck.current.deckId?.startsWith('astronomy')) });
    scares.current = judged.tracker;
    if (judged.scare) triggerScare(judged.scare);
    if (deck.current.onBack) recordStreak(deck.current.deckName.split(' · ')[0], next.streak);
    playSwipe(flyTo);
    if (direction !== 'unknown') playResult(next.attempts[next.attempts.length - 1].correct);
    gameRef.current = next;
    setGame(next);
    started.current = now;
    pointer.current = null;
    moveCard({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      const direction = event.code === 'Space' ? 'unknown' : keyDirections[event.key];
      if (!direction || isTyping(event) || !gameRef.current.queue.length) return;
      event.preventDefault();
      if (!event.repeat) choose(direction);
    };
    window.addEventListener('keydown', handleKey);
    return () => { window.removeEventListener('keydown', handleKey); clearTimeout(flightTimer.current); };
  }, [choose]);

  // 9: five minutes on one card. 10: leaving a game in progress.
  const cardKey = card ? `${card.id}-${game.attempts.length}` : '';
  useEffect(() => {
    if (!cardKey) return;
    const timer = setTimeout(() => { idleShown.current = triggerScare('idle', true); }, IDLE_MS);
    return () => clearTimeout(timer);
  }, [cardKey]);
  useEffect(() => () => {
    const left = gameRef.current;
    if (!idleShown.current && left.attempts.length > 0 && left.queue.length > 0 && Math.random() < LEAVE_CHANCE) triggerScare('leave');
  }, []);

  const restart = () => {
    scares.current = newTracker();
    const next = newGame(cards);
    gameRef.current = next;
    setGame(next);
    setFlight(null);
    pointer.current = null;
    moveCard({ x: 0, y: 0 });
    clearTimeout(flightTimer.current);
    started.current = performance.now();
  };
  const press = (event: PointerEvent<HTMLElement>) => {
    if (!event.isPrimary || event.button !== 0) return;
    pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const move = (event: PointerEvent<HTMLElement>) => {
    if (!pointer.current || event.pointerId !== pointer.current.id) return;
    moveCard({ x: event.clientX - pointer.current.x, y: event.clientY - pointer.current.y });
  };
  const release = (event: PointerEvent<HTMLElement>) => {
    if (!pointer.current || event.pointerId !== pointer.current.id) return;
    const x = event.clientX - pointer.current.x, y = event.clientY - pointer.current.y;
    pointer.current = null;
    if (Math.hypot(x, y) >= SWIPE_DISTANCE) { dragRef.current = { x, y }; choose(directionOf(x, y)); }
    else moveCard({ x: 0, y: 0 });
  };
  const cancel = () => { pointer.current = null; moveCard({ x: 0, y: 0 }); };

  const verdict = !last ? '' : last.direction === 'unknown' ? '모름 · 다시 나와요' : last.correct ? '정답' : `오답 · 정답은 ${last.card.answers[last.card.correct]}`;
  const tone = !last ? 'is-idle' : last.direction === 'unknown' ? 'is-unknown' : last.correct ? 'is-correct' : 'is-wrong';

  return <main className={`swipe-app ${onBack ? 'swipe-study' : ''}`}>
    <StreakFlame streak={game.streak} />
    <div className={`swipe-game ${card?.passage ? 'has-passage' : ''}`}>
      <header className="swipe-heading"><h1 className="glass">조하민<span>레츠고</span></h1></header>
      <div className="swipe-deck-bar glass">
        {onBack && <button type="button" className="glass-button" onClick={onBack}>{backLabel}</button>}
        <strong>{deckName}</strong>
        <div className="deck-progress">
          <div className="swipe-progress"><i style={{ width: `${cards.length ? game.mastered.length / cards.length * 100 : 0}%` }} /></div>
          <span className="swipe-progress-row">{game.mastered.length} / {cards.length}</span>
        </div>
      </div>
      {card?.passage && <details key={card.id} open className="swipe-reading glass" onKeyDown={e => { if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) e.stopPropagation(); }}><summary>READ & SOLVE · 문제 지문</summary><small>지문 안에서 스크롤해 끝까지 읽고 카드의 문장·표현을 확인하세요.</small><p lang="en" tabIndex={0} aria-label="영어 문제 지문">{card.passage}</p></details>}
      {finished ? <section className="swipe-complete glass" aria-label="최종 결과">
        <h2>깔끔하게 털었다!</h2>
        <p>{cards.length}장 완료 · 총 {game.attempts.length}번 선택</p>
        <div className="swipe-final-stats">
          <div><strong>{stats.accuracy}<small>%</small></strong><span>정답률</span></div>
          <div><strong>{stats.average.toFixed(1)}<small>초</small></strong><span>평균 반응</span></div>
          <div><strong>{game.bestStreak}</strong><span>최고 연속</span></div>
        </div>
        <button type="button" className="swipe-restart" onClick={restart}>한 판 더</button>
      </section>
      : <section className="swipe-board" aria-label="방향을 선택해 답하기">
        {directions.map(direction => <button type="button" key={direction} className={`swipe-option glass swipe-option-${direction} ${activeDirection === direction ? 'is-active' : ''}`} onClick={() => choose(direction)} aria-label={`${arrows[direction]} ${card.answers[direction]}`}><kbd>{arrows[direction]}</kbd><span>{card.answers[direction]}</span></button>)}
        <div className="swipe-stack">
          {game.queue.length > 2 && <div className="swipe-under swipe-under-two" />}
          {game.queue.length > 1 && <div className="swipe-under swipe-under-one" />}
          <LaminatedCard key={`${card.id}-${game.attempts.length}`} className={`is-current ${pointer.current ? 'is-dragging' : ''}`}
            style={{ '--tx': `${drag.x}px`, '--ty': `${drag.y}px`, '--rot': `${drag.x / 22}deg` } as CSSProperties}
            topic={card.topic} subject={card.subject} question={card.question} portraitKey={deckId}
            onPointerDown={press} onPointerMove={move} onPointerUp={release} onPointerCancel={cancel}>
            {activeDirection && <div className={`swipe-drag-label ${distance >= SWIPE_DISTANCE ? 'is-ready' : ''}`}>{arrows[activeDirection]} {card.answers[activeDirection]}</div>}
          </LaminatedCard>
          {flight && <LaminatedCard key={flight.id} aria-hidden="true" className={`swipe-flying fly-${flight.direction}`}
            style={{ '--fx': `${flight.from.x}px`, '--fy': `${flight.from.y}px`, '--fr': `${flight.from.x / 22}deg` } as CSSProperties}
            topic={flight.card.topic} subject={flight.card.subject} question={flight.card.question} portraitKey={deckId} />}
        </div>
      </section>}
      {!finished && <button type="button" className="swipe-skip glass" onClick={() => choose('unknown')}>모름 <kbd>Space</kbd></button>}
      <section className={`swipe-feedback glass ${tone}`} aria-label="결과창" aria-live="polite" aria-atomic="true">
        {last && <>
          <div className="swipe-feedback-top"><span className="swipe-result-icon" aria-hidden="true">{last.direction === 'unknown' ? '?' : last.correct ? '✓' : '✕'}</span><strong>{verdict}</strong></div>
          <p className="swipe-previous">{last.card.subject ? `${last.card.subject} · ` : ''}{last.card.question}</p>
          <p className="swipe-explanation">{last.card.explanation}</p>
          {last.card.sourceNote && <div className="swipe-source">{last.card.sourceNote}</div>}
          {last.card.sourceSlide && <div className="swipe-source">황윤환T · 슬라이드 {last.card.sourceSlide}</div>}
          {last.card.source && <div className="swipe-source">{last.card.source.teacher && `${last.card.source.teacher} · `}<a href={last.card.source.url} target="_blank" rel="noreferrer">{last.card.source.label ?? last.card.source.title.split('_')[0]} · PDF {last.card.source.page}쪽 ↗</a></div>}
        </>}
      </section>
    </div>
  </main>;
}
