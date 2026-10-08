import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from 'react';
import { swipeCards, type Direction, type SwipeCard } from '../../data/swipe-cards';
import { answerView, onAnswerViewChange, setAnswerView } from '../../lib/answer-view';
import { arrows, directionOf, directions, isTyping, keyDirections, SWIPE_DISTANCE } from '../../lib/directions';
import { playResult, playSwipe } from '../../lib/sound';
import { recordResult } from '../../lib/progress';
import { recordStreak } from '../../lib/best-streak';
import { IDLE_MS, LEAVE_CHANCE, newTracker, scareForAnswer, triggerCustomScare, triggerScare } from '../../lib/jumpscare';
import { customScareForAnswer, newCustomTracker } from '../../lib/custom-scares';
import { getTheme } from '../../lib/theme';
import { answerCard, getStats, newGame, type AnswerChoice } from '../../lib/swipe-game';
import LaminatedCard from './LaminatedCard';
import { useBeta } from './useBeta';
import StreakFlame from './StreakFlame';

type Offset = { x: number; y: number };
type Flight = { card: SwipeCard; direction: Direction; id: number; from: Offset };
const FLIGHT_MS = 380;

export default function SwipeGame({ cards = swipeCards, deckName = '샘플 덱', deckId, onBack, backLabel = '← 과목' }: { cards?: SwipeCard[]; deckName?: string; deckId?: string; onBack?: () => void; backLabel?: string }) {
  const [game, setGame] = useState(() => newGame(cards));
  const gameRef = useRef(game);
  const scares = useRef(newTracker());
  const customScares = useRef(newCustomTracker());
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
  // 답 보기 = 가리고 밀기: answers stay blurred until pulled toward (or picked once with a key or tap); a ring fills to confirm.
  const [view, setView] = useState(answerView);
  useEffect(() => onAnswerViewChange(setView), []);
  const hidden = view === 'hidden';
  const beta = useBeta(); // 베타 · 가로 화면 해설 카드 (CSS: wide landscape only)
  const [peek, setPeek] = useState<Direction | null>(null);
  const peekRef = useRef<Direction | null>(null);
  peekRef.current = peek;
  const revealed = activeDirection ?? (hidden ? peek : null);
  const pull = activeDirection ? Math.min(distance / SWIPE_DISTANCE, 1) : peek ? 1 : 0;

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
    const event = { correct: answered.correct, unknown: direction === 'unknown', seconds: answered.seconds,
      streakBefore: current.streak, streakAfter: next.streak, astronomy: Boolean(deck.current.deckId?.startsWith('astronomy')) };
    const theme = getTheme();
    if (theme.scares) {
      const judged = scareForAnswer(scares.current, event);
      scares.current = judged.tracker;
      if (judged.scare) triggerScare(judged.scare);
    } else if (theme.customScares.length) {
      // A custom blessing's own scares, checked in the order the person listed them.
      const judged = customScareForAnswer(customScares.current, theme.customScares, event);
      customScares.current = judged.tracker;
      const rule = theme.customScares.find(r => r.id === judged.rule);
      if (rule) triggerCustomScare(rule);
    }
    if (deck.current.onBack) recordStreak(deck.current.deckName.split(' · ')[0], next.streak);
    playSwipe(flyTo);
    if (direction !== 'unknown') playResult(next.attempts[next.attempts.length - 1].correct);
    gameRef.current = next;
    setGame(next);
    started.current = now;
    pointer.current = null;
    setPeek(null);
    moveCard({ x: 0, y: 0 });
  }, []);
  /** In 가리고 밀기, the first press of a direction only brings its answer into focus; the same direction again (or Enter) answers. */
  const pick = useCallback((direction: Direction) => {
    if (answerView() === 'hidden' && peekRef.current !== direction) { setPeek(direction); return; }
    choose(direction);
  }, [choose]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && peekRef.current && !isTyping(event) && !(event.target instanceof HTMLButtonElement) && gameRef.current.queue.length) {
        event.preventDefault();
        if (!event.repeat) choose(peekRef.current);
        return;
      }
      const direction = event.code === 'Space' ? 'unknown' : keyDirections[event.key];
      if (!direction || isTyping(event) || !gameRef.current.queue.length) return;
      event.preventDefault();
      if (event.repeat) return;
      if (direction === 'unknown') choose('unknown');
      else pick(direction);
    };
    window.addEventListener('keydown', handleKey);
    return () => { window.removeEventListener('keydown', handleKey); clearTimeout(flightTimer.current); };
  }, [choose, pick]);

  // 9: five minutes on one card. 10: leaving a game in progress.
  const cardKey = card ? `${card.id}-${game.attempts.length}` : '';
  useEffect(() => {
    if (!cardKey) return;
    const theme = getTheme();
    const idleRule = theme.scares ? null : theme.customScares.find(r => r.trigger === 'idle');
    if (!theme.scares && !idleRule) return;
    const timer = setTimeout(() => {
      if (theme.scares) idleShown.current = triggerScare('idle', true);
      else if (idleRule && Math.random() < idleRule.chance / 100) idleShown.current = triggerCustomScare(idleRule, true);
    }, idleRule ? idleRule.n * 60 * 1000 : IDLE_MS);
    return () => clearTimeout(timer);
  }, [cardKey]);
  useEffect(() => () => {
    const left = gameRef.current;
    if (idleShown.current || left.attempts.length === 0 || left.queue.length === 0) return;
    const theme = getTheme();
    if (theme.scares) { if (Math.random() < LEAVE_CHANCE) triggerScare('leave'); return; }
    const leaveRule = theme.customScares.find(r => r.trigger === 'leave');
    if (leaveRule && Math.random() < leaveRule.chance / 100) triggerCustomScare(leaveRule);
  }, []);

  const restart = () => {
    scares.current = newTracker();
    customScares.current = newCustomTracker();
    const next = newGame(cards);
    gameRef.current = next;
    setGame(next);
    setFlight(null);
    setPeek(null);
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
    <div className={`swipe-game ${card?.passage ? 'has-passage' : ''} ${beta ? 'is-beta' : ''}`}>
      <div className="swipe-main">
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
      : <section className={`swipe-board ${hidden ? 'answers-hidden' : ''} ${revealed ? 'is-pulling' : ''}`} aria-label="방향을 선택해 답하기" style={{ '--pull': pull.toFixed(3) } as CSSProperties}>
        {directions.map(direction => <button type="button" key={direction} className={`swipe-option glass swipe-option-${direction} ${activeDirection === direction ? 'is-active' : ''} ${revealed === direction ? 'is-revealed' : ''}`} onClick={() => pick(direction)} aria-label={`${arrows[direction]} ${card.answers[direction]}`}><kbd>{arrows[direction]}</kbd><span>{card.answers[direction]}</span>{hidden && peek === direction && !activeDirection && <small className="peek-hint">한 번 더 · Enter</small>}</button>)}
        <div className="swipe-stack">
          {game.queue.length > 2 && <div className="swipe-under swipe-under-two" />}
          {game.queue.length > 1 && <div className="swipe-under swipe-under-one" />}
          <LaminatedCard key={`${card.id}-${game.attempts.length}`} className={`is-current ${pointer.current ? 'is-dragging' : ''}`}
            style={{ '--tx': `calc(${drag.x}px / var(--card-zoom, 1))`, '--ty': `calc(${drag.y}px / var(--card-zoom, 1))`, '--rot': `${drag.x / 22}deg` } as CSSProperties}
            topic={card.topic} subject={card.subject} question={card.question}
            onPointerDown={press} onPointerMove={move} onPointerUp={release} onPointerCancel={cancel}>
            {/* The sticker shows only while dragging; a key or tap preview shows its hint on the answer instead (so the card face stays clear). */}
            {activeDirection && <div className={`swipe-drag-label ${distance >= SWIPE_DISTANCE ? 'is-ready' : ''}`}>{arrows[activeDirection]} {card.answers[activeDirection]}{hidden && <small>{distance >= SWIPE_DISTANCE ? '놓으면 선택' : '더 밀면 선택'}</small>}</div>}
          </LaminatedCard>
          {flight && <LaminatedCard key={flight.id} aria-hidden="true" className={`swipe-flying fly-${flight.direction}`}
            style={{ '--fx': `calc(${flight.from.x}px / var(--card-zoom, 1))`, '--fy': `calc(${flight.from.y}px / var(--card-zoom, 1))`, '--fr': `${flight.from.x / 22}deg` } as CSSProperties}
            topic={flight.card.topic} subject={flight.card.subject} question={flight.card.question} />}
        </div>
      </section>}
      {!finished && <div className="swipe-actions">
        <button type="button" className="swipe-skip glass" onClick={() => choose('unknown')}>모름 <kbd>Space</kbd></button>
        {/* 답 보기: all answers written out, or blurred until you pull toward one (a ring fills to confirm). */}
        <button type="button" className={`answer-view-toggle glass ${hidden ? 'is-hidden' : ''}`} aria-pressed={hidden} onClick={() => { setPeek(null); setAnswerView(hidden ? 'open' : 'hidden'); }}
          title={hidden ? '답이 가려져 있어요. 미는 쪽 답만 또렷해져요. 방향키·버튼은 한 번 = 미리 보기, 한 번 더나 Enter = 선택' : '답을 가리고, 밀 때만 보이게 바꿔요'}>
          <span className="answer-view-icon" aria-hidden="true">{hidden ? '◐' : '◯'}</span>
          <span>{hidden ? '답 가리기 켜짐' : '답 가리기'}<small>{hidden ? '밀면 보여요 · 눌러서 끄기' : '눌러서 켜기'}</small></span>
        </button>
      </div>}
      </div>
      <section className={`swipe-feedback glass ${tone}`} aria-label="결과창" aria-live="polite" aria-atomic="true">
        {!last && beta && <p className="swipe-feedback-placeholder">답을 고르면 카드가 뒤집혀서<br />이 자리에 해설 면이 놓여요</p>}
        {last && <div className="swipe-feedback-face" key={game.attempts.length}>
          <div className="swipe-feedback-top"><span className="swipe-result-icon" aria-hidden="true">{last.direction === 'unknown' ? '?' : last.correct ? '✓' : '✕'}</span><strong>{verdict}</strong></div>
          <p className="swipe-previous">{last.card.subject ? `${last.card.subject} · ` : ''}{last.card.question}</p>
          <p className="swipe-explanation">{last.card.explanation}</p>
          {last.card.sourceNote && <div className="swipe-source">{last.card.sourceNote}</div>}
          {last.card.sourceSlide && <div className="swipe-source">황윤환T · 슬라이드 {last.card.sourceSlide}</div>}
          {last.card.source && <div className="swipe-source">{last.card.source.teacher && `${last.card.source.teacher} · `}<a href={last.card.source.url} target="_blank" rel="noreferrer">{last.card.source.label ?? last.card.source.title.split('_')[0]} · PDF {last.card.source.page}쪽 ↗</a></div>}
        </div>}
      </section>
    </div>
  </main>;
}
