import ObservationLab from './ObservationLab';
import { useEffect, useRef, useState } from 'react';
import type { SubjectDeck } from '../../data/swipe-subjects';
import type { SwipeCard } from '../../data/swipe-cards';
import { missedCards, seenCount } from '../../lib/progress';
import SwipeGame from './SwipeGame';
import ParkStudy from './ParkStudy';
import WrittenPractice, { blankWritten, type WrittenState } from './WrittenPractice';
import CardHand, { type HandCard } from './CardHand';
import ConceptReader from './ConceptReader';
import { conceptsFor } from '../../data/study-concepts';

export default function SubjectStudy({ deck, onBack }: { deck: SubjectDeck; onBack: () => void }) {
  // 박상영T has its own card-style menus (see ParkStudy).
  if (deck.id === 'biology-park') return <ParkStudy deck={deck} onBack={onBack} />;
  return <GeneralStudy deck={deck} onBack={onBack} />;
}

function GeneralStudy({ deck, onBack }: { deck: SubjectDeck; onBack: () => void }) {
  const [mode, setMode] = useState<'menu' | 'concept' | 'problems' | 'choice' | 'missed' | 'written' | 'practice'>('menu');
  const [retryCards, setRetryCards] = useState<SwipeCard[]>([]);
  const [read, setRead] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [writtenTopic, setWrittenTopic] = useState('');
  const lessons = conceptsFor(deck.id);
  const generalCards = deck.cards;
  const choiceCards = topics.length ? generalCards.filter(card => topics.includes(card.topic)) : generalCards;
  const [written, setWritten] = useState<WrittenState>(blankWritten);
  const allWritten = deck.writtenQuestions ?? [];
  const questions = writtenTopic ? allWritten.filter(q => q.topic === writtenTopic) : allWritten;
  const pending = !deck.cards.length && !questions.length && !lessons.length; // a part whose class material has not arrived yet
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => { title.current?.focus(); }, [mode, written.index]);
  // The parent handles Esc; mode navigation uses explicit buttons.
  // A game goes back to the hand it came from: a unit card → the unit hand, otherwise the subject hand.
  const gameBack = mode === 'choice' && topics.length ? 'problems' : 'menu';
  const gameBackLabel = '← 카드 패';
  if (mode === 'missed') return <SwipeGame cards={retryCards} deckId={deck.id} deckName={`${deck.fullName ?? deck.name} · 오답 다시`} onBack={() => setMode(gameBack)} backLabel={gameBackLabel} />;
  if (mode === 'choice') return <SwipeGame cards={choiceCards} deckId={deck.id} deckName={`${deck.fullName ?? deck.name} · 객관식`} onBack={() => setMode(gameBack)} backLabel={gameBackLabel} />;
  if (mode === 'practice') return <ObservationLab onBack={() => setMode('menu')} />;
  const name = deck.fullName ?? deck.name;
  // 카드 패: the subject menu and the unit menu are hands of cards.
  if (mode === 'menu' && !pending) {
    const missedAll = missedCards(generalCards);
    const topicCount = new Set(generalCards.map(card => card.topic)).size;
    const hand: HandCard[] = [
      ...(deck.id === 'astronomy-hwang' ? [{ id: 'practice', kicker: '관측 실습', title: '직접 연습하기', note: '정렬 · 천구 좌표 · 기록', onPlay: () => setMode('practice') }] : []),
      { id: 'concept', kicker: '개념', title: '개념 정리', note: `${lessons.length}단원`, disabled: !lessons.length, onPlay: () => setMode('concept') },
      { id: 'all', kicker: '객관식', title: '전체 풀기', note: `${generalCards.length}문제 · 푼 문제 ${seenCount(generalCards)}`, disabled: !generalCards.length, onPlay: () => { setTopics([]); setMode('choice'); } },
      { id: 'topics', kicker: '객관식', title: '단원 골라 풀기', note: `${topicCount}단원`, disabled: !generalCards.length, onPlay: () => { setTopics([]); setMode('problems'); } },
      ...(missedAll.length ? [{ id: 'missed', kicker: '복습', title: '오답만 다시', note: `${missedAll.length}문제`, onPlay: () => { setRetryCards(missedAll); setMode('missed'); } }] : []),
      ...(allWritten.length ? [{ id: 'written', kicker: '서술형', title: '서술형 쓰기', note: `${allWritten.length}문제`, onPlay: () => { setWrittenTopic(''); setWritten(w => ({ ...w, index: 0 })); setMode('written'); } }] : []),
    ];
    return <CardHand key="menu" deckName={name} prompt="무엇을 할까요?" cards={hand} onBack={onBack} backLabel="과목·파트" start={1} />;
  }
  if (mode === 'problems') {
    const byTopic = [...new Set(generalCards.map(card => card.topic))];
    const related = generalCards.filter(card => topics.includes(card.topic));
    const hand: HandCard[] = [
      ...(topics.length > 1 ? [{ id: 'related', kicker: '방금 본 개념', title: '관련 단원', note: `${related.length}문제`, onPlay: () => setMode('choice') }] : []),
      { id: 'all', kicker: '객관식', title: '전체 단원', note: `${generalCards.length}문제`, onPlay: () => { setTopics([]); setMode('choice'); } },
      ...byTopic.map(topic => { const list = generalCards.filter(card => card.topic === topic); return { id: `t-${topic}`, kicker: `객관식 · 푼 문제 ${seenCount(list)}`, title: topic, note: `${list.length}문제`, onPlay: () => { setTopics([topic]); setMode('choice'); } }; }),
    ];
    return <CardHand key="problems" deckName={name} prompt="어느 단원을 풀까요?" cards={hand} onBack={() => { setTopics([]); setMode('menu'); }} backLabel="학습 메뉴" />;
  }
  return <main className="swipe-app biology-app">
    <div className="biology-study">
      <header className="biology-header glass">
        <button type="button" className="glass-button" onClick={mode === 'menu' ? onBack : () => setMode('menu')}>{mode === 'menu' ? '← 과목·파트' : '← 학습 메뉴'}</button>
        <h1 ref={title} tabIndex={-1}>{deck.fullName ?? deck.name}{mode === 'written' ? ' · 서술형' : mode === 'concept' ? ' · 개념 정리' : ''}</h1>
      </header>
      {mode === 'menu' ? <section className="biology-menu glass" aria-label="학습 메뉴">
        <h2>준비 중</h2><p>{deck.description}</p>
        <p className="study-scope">아직 자료가 없어요. 수업 자료가 들어오면 개념과 문제를 추가할게요.</p>
      </section> : mode === 'concept' ? <ConceptReader read={read} setRead={setRead} lessons={lessons} onPractice={keys => { setTopics(keys); setMode('problems'); }} />
      : <WrittenPractice questions={questions} state={written} setState={setWritten} />}
    </div>
  </main>;
}

