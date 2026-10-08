// 박상영T: every menu is a card (↑ ← → to choose, ↓ back), so keys, swipes and taps never have to change hands.
//   박상영T     ↑ 개념 정리   ← 문제 풀기   → 원문 단어장
//   문제 풀기   ↑ 객관식 전체  ← 단원 골라 풀기  → 서술형
//   서술형      ↑ 문장 배치로 풀기  → 직접 써 보기
// Esc always goes back one step.
import { useMemo, useRef, useState } from 'react';
import type { SubjectDeck } from '../../data/swipe-subjects';
import type { SwipeCard } from '../../data/swipe-cards';
import { conceptsFor } from '../../data/study-concepts';
import { missedCards, seenCount } from '../../lib/progress';
import { splitPieces } from '../../lib/vocabulary';
import ConceptReader from './ConceptReader';
import MenuCard, { useEscape } from './MenuCard';
import OrderDeck from './OrderDeck';
import ParkVocabulary from './ParkVocabulary';
import SwipeGame from './SwipeGame';
import WrittenPractice, { blankWritten, type WrittenState } from './WrittenPractice';

const TERMS = '유전학 핵심 용어';
type Screen = 'home' | 'concept' | 'problems' | 'topics' | 'choice' | 'writtenMenu' | 'written' | 'order' | 'orderDone' | 'vocab';

export default function ParkStudy({ deck, onBack }: { deck: SubjectDeck; onBack: () => void }) {
  const lessons = useMemo(() => conceptsFor(deck.id).filter(l => l.id !== 'biology-park-terms'), [deck.id]);
  const cards = useMemo(() => deck.cards.filter(c => c.topic !== TERMS), [deck.cards]);
  const written = useMemo(() => (deck.writtenQuestions ?? []).filter(q => q.topic !== TERMS), [deck.writtenQuestions]);
  const pieces = useMemo(() => written.map(q => splitPieces(q.modelAnswer)), [written]);
  const topics = useMemo(() => [...new Set(cards.map(c => c.topic))], [cards]);

  const [screen, setScreen] = useState<Screen>('home');
  const [read, setRead] = useState<string[]>([]);
  const [game, setGame] = useState<{ cards: SwipeCard[]; name: string; back: Screen } | null>(null);
  const [topicAt, setTopicAt] = useState(0);
  const [writtenState, setWrittenState] = useState<WrittenState>(blankWritten);
  const [orderAt, setOrderAt] = useState(0);
  const [orderFirstTry, setOrderFirstTry] = useState(0);
  const vocabBack = useRef<(() => boolean) | null>(null);

  const play = (list: SwipeCard[], name: string, back: Screen) => { setGame({ cards: list, name, back }); setScreen('choice'); };
  const startOrder = () => { setOrderAt(0); setOrderFirstTry(0); setScreen('order'); };
  const backFrom: Record<Screen, () => void> = {
    home: onBack, concept: () => setScreen('home'), problems: () => setScreen('home'), topics: () => setScreen('problems'),
    choice: () => setScreen(game?.back ?? 'problems'), writtenMenu: () => setScreen('problems'), written: () => setScreen('writtenMenu'),
    order: () => setScreen('writtenMenu'), orderDone: () => setScreen('writtenMenu'),
    vocab: () => { if (!vocabBack.current?.()) setScreen('home'); },
  };
  useEscape(() => backFrom[screen]());

  const name = deck.fullName ?? deck.name;
  if (screen === 'vocab') return <ParkVocabulary onBack={() => setScreen('home')} escapeRef={vocabBack} />;
  if (screen === 'choice' && game) return <SwipeGame cards={game.cards} deckId={deck.id} deckName={game.name} onBack={backFrom.choice} backLabel={game.back === 'concept' ? '← 개념' : '← 문제 풀기'} />;

  if (screen === 'home') return <MenuCard cardKey="park-home" topic={name} question="무엇을 할까?" onBack={onBack} backLabel="과목·파트"
    up={{ label: '개념 정리', note: `${lessons.length}단원`, onChoose: () => setScreen('concept') }}
    left={{ label: '문제 풀기', note: `객관식 ${cards.length} · 서술형 ${written.length}`, onChoose: () => setScreen('problems') }}
    right={{ label: '원문 단어장', note: '22개 용어', onChoose: () => setScreen('vocab') }}>
    <p className="menu-hint glass">{deck.description} <span>방향키·밀기·누르기 모두 돼요 · ↓ 또는 Esc로 뒤로</span></p>
  </MenuCard>;

  if (screen === 'problems') {
    const missed = missedCards(cards);
    return <MenuCard cardKey="park-problems" topic={name} question="어떻게 풀까?" onBack={backFrom.problems}
      up={{ label: '객관식 전체', note: `${cards.length}문제`, onChoose: () => play(cards, `${name} · 객관식`, 'problems') }}
      left={{ label: '단원 골라 풀기', note: `${topics.length}단원`, onChoose: () => setScreen('topics') }}
      right={{ label: '서술형', note: `${written.length}문제`, onChoose: () => setScreen('writtenMenu') }}>
      <div className="menu-extras">
        {missed.length > 0 && <button type="button" className="glass-button" onClick={() => play(missed, `${name} · 오답 다시`, 'problems')}>오답만 다시 · {missed.length}문제</button>}
        <span className="menu-hint-inline">이 기기에서 푼 객관식 {seenCount(cards)} / {cards.length}</span>
      </div>
    </MenuCard>;
  }

  if (screen === 'topics') {
    const topic = topics[topicAt] ?? topics[0];
    const list = cards.filter(c => c.topic === topic);
    const step = (d: number) => setTopicAt(i => (i + d + topics.length) % topics.length);
    return <MenuCard cardKey={`park-topic-${topic}`} topic={`단원 ${topicAt + 1} / ${topics.length}`} subject={topic} question={`객관식 ${list.length}문제 · 푼 문제 ${seenCount(list)}`} onBack={backFrom.topics}
      up={{ label: '이 단원 풀기', note: `${list.length}문제`, onChoose: () => play(list, `${name} · ${topic}`, 'topics') }}
      left={{ label: '이전 단원', onChoose: () => step(-1) }} right={{ label: '다음 단원', onChoose: () => step(1) }}>
      <p className="menu-hint glass">← → 로 단원을 넘기고 ↑ 로 시작해요.</p>
    </MenuCard>;
  }

  if (screen === 'writtenMenu') return <MenuCard cardKey="park-written" topic={name} subject="서술형" question={`${written.length}문제 · 순서 맞추기부터, 직접 쓰기까지`} onBack={backFrom.writtenMenu}
    up={{ label: '문장 배치로 풀기', note: '모범답안 조각 순서 맞추기', onChoose: startOrder }}
    right={{ label: '직접 써 보기', note: '답안 작성 · 직접 채점', onChoose: () => setScreen('written') }}>
    <p className="menu-hint glass">문장 배치로 흐름을 잡고, 직접 써 보기로 넘어가면 좋아요.</p>
  </MenuCard>;

  if (screen === 'orderDone') return <MenuCard cardKey="park-order-done" topic={`${name} · 문장 배치`} subject={`${written.length}문제 완성!`} question={`한 번에 맞춘 문제 ${orderFirstTry}개`} onBack={backFrom.orderDone}
    up={{ label: '한 번 더', onChoose: startOrder }} right={{ label: '직접 써 보기', onChoose: () => setScreen('written') }} />;

  return <main className="swipe-app biology-app">
    <div className="biology-study">
      <header className="biology-header glass">
        <button type="button" className="glass-button" onClick={backFrom[screen]}>{screen === 'concept' ? '← 박상영T' : '← 서술형'}</button>
        <h1 tabIndex={-1}>{name}{screen === 'concept' ? ' · 개념 정리' : screen === 'order' ? ' · 문장 배치' : ' · 서술형'}</h1>
      </header>
      {screen === 'concept' ? <ConceptReader read={read} setRead={setRead} lessons={lessons} onPractice={keys => play(cards.filter(c => keys.includes(c.topic)), `${name} · 관련 객관식`, 'concept')} />
        : screen === 'order' ? <OrderDeck pieces={pieces[orderAt]} title={written[orderAt].question} prompt="모범답안 조각을 순서대로 쌓아 보세요." step={`${orderAt + 1} / ${written.length} · ${written[orderAt].topic}`}
          nextLabel={orderAt + 1 < written.length ? '다음 문제 →' : '결과 보기'}
          onNext={result => { if (result.firstTry) setOrderFirstTry(n => n + 1); if (orderAt + 1 < written.length) setOrderAt(orderAt + 1); else setScreen('orderDone'); }} />
        : <WrittenPractice questions={written} state={writtenState} setState={setWrittenState} />}
    </div>
  </main>;
}
