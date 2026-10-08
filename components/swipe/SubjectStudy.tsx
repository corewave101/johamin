import { useEffect, useRef, useState } from 'react';
import type { SubjectDeck } from '../../data/swipe-subjects';
import type { SwipeCard } from '../../data/swipe-cards';
import { missedCards, seenCount } from '../../lib/progress';
import SwipeGame from './SwipeGame';
import ParkStudy from './ParkStudy';
import WrittenPractice, { blankWritten, type WrittenState } from './WrittenPractice';
import CardHand, { type HandCard } from './CardHand';
import ConceptReader from './ConceptReader';
import { useBeta } from './useBeta';
import { conceptsFor } from '../../data/study-concepts';

export default function SubjectStudy({ deck, onBack }: { deck: SubjectDeck; onBack: () => void }) {
  // 박상영T has its own card-style menus (see ParkStudy).
  if (deck.id === 'biology-park') return <ParkStudy deck={deck} onBack={onBack} />;
  return <GeneralStudy deck={deck} onBack={onBack} />;
}

function GeneralStudy({ deck, onBack }: { deck: SubjectDeck; onBack: () => void }) {
  const [mode, setMode] = useState<'menu' | 'concept' | 'problems' | 'choice' | 'missed' | 'written'>('menu');
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
  const beta = useBeta(); // 베타 · 카드 패: the menus below become a hand of cards
  useEffect(() => { title.current?.focus(); }, [mode, written.index]);
  // The parent handles Esc; mode navigation uses explicit buttons.
  // In 베타 · 카드 패 a game goes back to the hand it came from: a unit card → the unit hand, otherwise the subject hand.
  const gameBack = beta ? (mode === 'choice' && topics.length ? 'problems' : 'menu') : 'problems';
  const gameBackLabel = beta ? '← 카드 패' : '← 문제 유형';
  if (mode === 'missed') return <SwipeGame cards={retryCards} deckId={deck.id} deckName={`${deck.fullName ?? deck.name} · 오답 다시`} onBack={() => setMode(gameBack)} backLabel={gameBackLabel} />;
  if (mode === 'choice') return <SwipeGame cards={choiceCards} deckId={deck.id} deckName={`${deck.fullName ?? deck.name} · 객관식`} onBack={() => setMode(gameBack)} backLabel={gameBackLabel} />;
  const missed = missedCards(choiceCards);
  const name = deck.fullName ?? deck.name;
  if (beta && mode === 'menu' && !pending) {
    const missedAll = missedCards(generalCards);
    const topicCount = new Set(generalCards.map(card => card.topic)).size;
    const hand: HandCard[] = [
      { id: 'concept', kicker: '개념', title: '개념 정리', note: `${lessons.length}단원`, disabled: !lessons.length, onPlay: () => setMode('concept') },
      { id: 'all', kicker: '객관식', title: '전체 풀기', note: `${generalCards.length}문제 · 푼 문제 ${seenCount(generalCards)}`, disabled: !generalCards.length, onPlay: () => { setTopics([]); setMode('choice'); } },
      { id: 'topics', kicker: '객관식', title: '단원 골라 풀기', note: `${topicCount}단원`, disabled: !generalCards.length, onPlay: () => { setTopics([]); setMode('problems'); } },
      ...(missedAll.length ? [{ id: 'missed', kicker: '복습', title: '오답만 다시', note: `${missedAll.length}문제`, onPlay: () => { setRetryCards(missedAll); setMode('missed'); } }] : []),
      ...(allWritten.length ? [{ id: 'written', kicker: '서술형', title: '서술형 쓰기', note: `${allWritten.length}문제`, onPlay: () => { setWrittenTopic(''); setWritten(w => ({ ...w, index: 0 })); setMode('written'); } }] : []),
    ];
    return <CardHand key="menu" deckName={name} prompt="무엇을 할까요?" cards={hand} onBack={onBack} backLabel="과목·파트" start={1} />;
  }
  if (beta && mode === 'problems') {
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
        <button type="button" className="glass-button" onClick={mode === 'menu' ? onBack : () => setMode(mode === 'written' && !beta ? 'problems' : 'menu')}>{mode === 'menu' ? '← 과목·파트' : mode === 'written' && !beta ? '← 문제 파트' : '← 학습 메뉴'}</button>
        <h1 ref={title} tabIndex={-1}>{deck.fullName ?? deck.name}{mode === 'written' ? ' · 서술형' : mode === 'concept' ? ' · 개념 정리' : ''}</h1>
      </header>
      {mode === 'menu' ? <section className="biology-menu glass" aria-label="학습 메뉴">
        <h2>{pending ? '준비 중' : '개념부터, 문제까지'}</h2><p>{deck.description}</p>
        {pending ? <p className="study-scope">아직 자료가 없어요. 수업 자료가 들어오면 개념과 문제를 추가할게요.</p> : <>
        <button type="button" className="biology-mode" onClick={() => setMode('concept')}><strong>개념 파트 · {lessons.length}단원</strong><span>핵심 설명 · 비교·예시 · 주의할 점 · 단원 검색</span></button>
        <button type="button" className="biology-mode" onClick={() => { setTopics([]); setWrittenTopic(''); setWritten(w => ({ ...w, index: 0 })); setMode('problems'); }}><strong>문제 파트 · 객관식 {generalCards.length} / 서술형 {allWritten.length}</strong><span>단원별 객관식 · 해설과 오답 재출제 · 서술형 직접 채점</span></button>
        <p className="biology-note">객관식 정답·오답 기록은 이 기기에 저장돼요. 개념 학습 표시와 서술형 답안은 새로고침하거나 과목·파트를 나가면 초기화돼요.</p></>}
      </section> : mode === 'concept' ? <ConceptReader read={read} setRead={setRead} lessons={lessons} onPractice={keys => { setTopics(keys); setMode('problems'); }} />
      : mode === 'problems' ? <section className="biology-menu glass" aria-label="문제 유형 선택">
        <h2>문제 파트</h2>
        <label className="study-filter">객관식 단원 <select value={topics.length === 1 ? topics[0] : topics.length ? '__related' : ''} onChange={event => setTopics(event.target.value ? [event.target.value] : [])}>
          <option value="">전체 단원</option>{topics.length > 1 && <option value="__related">현재 개념의 관련 단원</option>}{[...new Set(generalCards.map(card => card.topic))].map(topic => <option key={topic} value={topic}>{topic}</option>)}
        </select></label>
        {choiceCards.length ? <button type="button" className="biology-mode" onClick={() => setMode('choice')}><strong>객관식 {choiceCards.length}문제</strong><span>방향으로 답하기 · 정답과 해설 · 오답 다시 풀기</span></button> : <p className="study-scope">이 단원에 연결된 객관식이 없어요. 전체 단원을 선택해 주세요.</p>}
        {missed.length > 0 && <button type="button" className="biology-mode" onClick={() => { setRetryCards(missed); setMode('missed'); }}><strong>오답만 다시 · {missed.length}문제</strong><span>이 기기에서 마지막으로 틀렸거나 '모름'이었던 문제만</span></button>}
        <p className="biology-note">이 기기에서 푼 객관식 {seenCount(choiceCards)} / {choiceCards.length}문제</p>
        {allWritten.length > 0 && <><label className="study-filter">서술형 단원 <select value={writtenTopic} onChange={e => { setWrittenTopic(e.target.value); setWritten(w => ({ ...w, index: 0 })); }}><option value="">전체 단원</option>{[...new Set(allWritten.map(q => q.topic))].map(topic => <option key={topic}>{topic}</option>)}</select></label><button type="button" className="biology-mode" onClick={() => { setWritten(w => ({ ...w, index: 0 })); setMode('written'); }}><strong>서술형 {questions.length}문제</strong><span>답안 작성 · 모범답안 · 항목별 직접 채점</span></button></>}
        <button type="button" className="glass-button" onClick={() => setMode('concept')}>개념 정리로 돌아가기</button>
      </section> : <WrittenPractice questions={questions} state={written} setState={setWritten} />}
    </div>
  </main>;
}

