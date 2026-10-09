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
import { answerCard, getStats, newGame, type AnswerChoice, type Attempt } from '../../lib/swipe-game';
import LaminatedCard from './LaminatedCard';
import StreakFlame from './StreakFlame';

type Offset = { x: number; y: number };
type Flight = { card: SwipeCard; direction: Direction; id: number; from: Offset };
const FLIGHT_MS = 380;
const OPPOSITE: Record<Direction, Direction> = { up: 'down', down: 'up', left: 'right', right: 'left' };
const verdictOf = (a: Attempt) => a.direction === 'unknown' ? '모름 · 다시 나와요' : a.correct ? '정답' : `오답 · 정답은 ${a.card.answers[a.card.correct]}`;
const toneOf = (a: Attempt) => a.direction === 'unknown' ? 'unknown' : a.correct ? 'correct' : 'wrong';

/** 베타 · 해설 카드: the back of the answered card, laid on top of the deck. */
function BackFace({ attempt }: { attempt: Attempt }) {
  const c = attempt.card;
  return <>
    <div className="back-top"><span className="swipe-result-icon" aria-hidden="true">{attempt.direction === 'unknown' ? '?' : attempt.correct ? '✓' : '✕'}</span><strong>{verdictOf(attempt)}</strong></div>
    <div className="back-body">
      <p className="back-question">{c.subject ? `${c.subject} · ` : ''}{c.question}</p>
      <p className="back-explanation">{c.explanation}</p>
      {c.sourceNote && <p className="back-source">{c.sourceNote}</p>}
      {c.sourceSlide && <p className="back-source">황윤환T · 슬라이드 {c.sourceSlide}</p>}
      {c.source && <p className="back-source">{c.source.teacher && `${c.source.teacher} · `}{c.source.label ?? c.source.title.split('_')[0]} · PDF {c.source.page}쪽</p>}
    </div>
    <p className="back-hint">아무 방향으로 넘기면 다음 카드</p>
  </>;
}

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
  // 해설 카드: after an answer, the card's back comes in from the opposite side and lies on top of the deck.
  // Throw it any way (swipe, arrow, Space/Enter, or any answer button) to reach the next card.
  const [back, setBack] = useState<{ id: number; from: Direction } | null>(null);
  const backRef = useRef(back);
  backRef.current = back;
  const [backDrag, setBackDrag] = useState<Offset>({ x: 0, y: 0 });
  const backDragRef = useRef<Offset>({ x: 0, y: 0 });
  const backPointer = useRef<{ id: number; x: number; y: number } | null>(null);
  const [thrown, setThrown] = useState<{ id: number; dir: Direction; from: Offset; attempt: Attempt } | null>(null);
  const thrownTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const moveBack = (offset: Offset) => { backDragRef.current = offset; setBackDrag(offset); };
  const throwBack = useCallback((dir: Direction) => {
    const attempt = gameRef.current.attempts.at(-1);
    if (!backRef.current || !attempt) return;
    const now = performance.now();
    setThrown({ id: now, dir, from: backDragRef.current, attempt });
    clearTimeout(thrownTimer.current);
    thrownTimer.current = setTimeout(() => setThrown(null), FLIGHT_MS);
    backRef.current = null;
    setBack(null);
    backPointer.current = null;
    moveBack({ x: 0, y: 0 });
    playSwipe(dir);
    started.current = now; // reading the explanation does not count toward the next answer's time
  }, []);
  const [peek, setPeek] = useState<Direction | null>(null);
  const peekRef = useRef<Direction | null>(null);
  peekRef.current = peek;
  const revealed = activeDirection ?? (hidden ? peek : null);
  const pull = activeDirection ? Math.min(distance / SWIPE_DISTANCE, 1) : peek ? 1 : 0;

  const moveCard = (offset: Offset) => { dragRef.current = offset; setDrag(offset); };

  const choose = useCallback((direction: AnswerChoice) => {
    if (backRef.current) { throwBack(direction === 'unknown' ? 'down' : direction); return; }
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
    if (next.queue.length) { const b = { id: now, from: OPPOSITE[flyTo] }; backRef.current = b; setBack(b); }
  }, [throwBack]);
  /** In 가리고 밀기, the first press of a direction only brings its answer into focus; the same direction again (or Enter) answers. */
  const pick = useCallback((direction: Direction) => {
    if (backRef.current) { throwBack(direction); return; }
    if (answerView() === 'hidden' && peekRef.current !== direction) { setPeek(direction); return; }
    choose(direction);
  }, [choose, throwBack]);

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (backRef.current && !isTyping(event)) {
        const dir = keyDirections[event.key] ?? (event.code === 'Space' || event.key === 'Enter' ? 'up' : null);
        if (!dir || (event.key === 'Enter' && event.target instanceof HTMLButtonElement)) return;
        event.preventDefault();
        if (!event.repeat) throwBack(dir);
        return;
      }
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
    return () => { window.removeEventListener('keydown', handleKey); clearTimeout(flightTimer.current); clearTimeout(thrownTimer.current); };
  }, [choose, pick, throwBack]);

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
    <div className={`swipe-game ${card?.passage ? 'has-passage' : ''} ${finished ? 'is-finished' : ''}`}>
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
      : <section className={`swipe-board ${hidden ? 'answers-hidden' : ''} ${revealed ? 'is-pulling' : ''} ${back ? 'has-back' : ''}`} aria-label="방향을 선택해 답하기" style={{ '--pull': pull.toFixed(3) } as CSSProperties}>
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
          {/* Each layer gets its own key prefix: the answer's flight and its back card share a timestamp, and a
              duplicate key made React leave finished cards (with their blur animations) in the DOM. */}
          {flight && <LaminatedCard key={`flight-${flight.id}`} aria-hidden="true" className={`swipe-flying fly-${flight.direction}`}
            style={{ '--fx': `calc(${flight.from.x}px / var(--card-zoom, 1))`, '--fy': `calc(${flight.from.y}px / var(--card-zoom, 1))`, '--fr': `${flight.from.x / 22}deg` } as CSSProperties}
            topic={flight.card.topic} subject={flight.card.subject} question={flight.card.question} />}
          {back && last && <article key={`back-${back.id}`} className={`swipe-card swipe-back from-${back.from} back-${toneOf(last)} ${backPointer.current ? 'is-dragging' : ''}`} aria-label="해설 카드"
            style={{ '--tx': `calc(${backDrag.x}px / var(--card-zoom, 1))`, '--ty': `calc(${backDrag.y}px / var(--card-zoom, 1))`, '--rot': `${backDrag.x / 22}deg` } as CSSProperties}
            onPointerDown={event => { if (!event.isPrimary || event.button !== 0) return; backPointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); }}
            onPointerMove={event => { const b = backPointer.current; if (!b || b.id !== event.pointerId) return; moveBack({ x: event.clientX - b.x, y: event.clientY - b.y }); }}
            onPointerUp={event => { const b = backPointer.current; if (!b || b.id !== event.pointerId) return; const x = event.clientX - b.x, y = event.clientY - b.y; backPointer.current = null; if (Math.hypot(x, y) >= SWIPE_DISTANCE) { backDragRef.current = { x, y }; throwBack(directionOf(x, y)); } else moveBack({ x: 0, y: 0 }); }}
            onPointerCancel={() => { backPointer.current = null; moveBack({ x: 0, y: 0 }); }}>
            <BackFace attempt={last} />
          </article>}
          {thrown && <article key={`thrown-${thrown.id}`} aria-hidden="true" className={`swipe-card swipe-back back-${toneOf(thrown.attempt)} swipe-flying fly-${thrown.dir}`}
            style={{ '--fx': `calc(${thrown.from.x}px / var(--card-zoom, 1))`, '--fy': `calc(${thrown.from.y}px / var(--card-zoom, 1))`, '--fr': `${thrown.from.x / 22}deg` } as CSSProperties}>
            <BackFace attempt={thrown.attempt} />
          </article>}
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
