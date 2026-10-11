import { isHwangExam } from '../../data/hwang-exam';
import { isShortQuestion } from '../../data/study-practice';
import ChemistryLab from './ChemistryLab';
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
  const [mode, setMode] = useState<'menu' | 'concept' | 'problems' | 'choice' | 'missed' | 'written' | 'short' | 'practice'>('menu');
  const [retryCards, setRetryCards] = useState<SwipeCard[]>([]);
  const [read, setRead] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [writtenTopic, setWrittenTopic] = useState('');
  const lessons = conceptsFor(deck.id);
  const generalCards = deck.cards;
  const choiceCards = topics.length ? generalCards.filter(card => topics.includes(card.topic)) : generalCards;
  const [written, setWritten] = useState<WrittenState>(() => {
    if (deck.id === 'astronomy-hwang') try { const saved = JSON.parse(localStorage.getItem('johamin-hwang-exam-drafts-v1') ?? 'null'); if (saved && typeof saved.index === 'number' && saved.drafts && saved.revealed) return saved; } catch { /* use an empty draft */ }
    return blankWritten();
  });
  useEffect(() => { if (deck.id === 'astronomy-hwang') try { localStorage.setItem('johamin-hwang-exam-drafts-v1', JSON.stringify(written)); } catch { /* storage unavailable */ } }, [deck.id, written]);
  const [wrongOnly, setWrongOnly] = useState(false);
  const exam = deck.id === 'astronomy-hwang';
  const bank = exam ? (deck.writtenQuestions ?? []).filter(isHwangExam) : (deck.writtenQuestions ?? []);
  const allWritten = bank.filter(q => !isShortQuestion(q));
  const allShort = bank.filter(isShortQuestion);
  const activeWritten = mode === 'short' ? allShort : allWritten;
  const scopedQuestions = writtenTopic ? activeWritten.filter(q => q.topic === writtenTopic) : activeWritten;
  const questions = wrongOnly && mode === 'short' ? scopedQuestions.filter(q => written.drafts[q.id]?.correct === false) : scopedQuestions;
  const pending = !deck.cards.length && !questions.length && !lessons.length; // a part whose class material has not arrived yet
  const title = useRef<HTMLHeadingElement>(null);
  useEffect(() => { title.current?.focus(); }, [mode, written.index]);
  // The parent handles Esc; mode navigation uses explicit buttons.
  // A game goes back to the hand it came from: a unit card → the unit hand, otherwise the subject hand.
  const gameBack = mode === 'choice' && topics.length ? 'problems' : 'menu';
  const gameBackLabel = '← 카드 패';
  if (mode === 'missed') return <SwipeGame cards={retryCards} deckId={deck.id} deckName={`${deck.fullName ?? deck.name} · 오답 다시`} onBack={() => setMode(gameBack)} backLabel={gameBackLabel} />;
  if (mode === 'choice') return <SwipeGame cards={choiceCards} deckId={deck.id} deckName={`${deck.fullName ?? deck.name} · 객관식`} onBack={() => setMode(gameBack)} backLabel={gameBackLabel} />;
  if (mode === 'practice') return deck.id === 'chemistry' ? <ChemistryLab onBack={() => setMode('menu')} /> : <ObservationLab onBack={() => setMode('menu')} />;
  const name = deck.fullName ?? deck.name;
  // 카드 패: the subject menu and the unit menu are hands of cards.
  if (mode === 'menu' && !pending) {
    const missedAll = missedCards(generalCards);
    const topicCount = new Set(generalCards.map(card => card.topic)).size;
    const hand: HandCard[] = [
      ...(deck.id === 'chemistry' ? [{ id: 'practice', kicker: '화학 실험', title: '직접 연습하기', note: '적정 곡선 · 완충 · 5% 규칙', onPlay: () => setMode('practice') }] : []),
      ...(deck.id === 'astronomy-hwang' ? [{ id: 'practice', kicker: '관측 실습', title: '직접 연습하기', note: '정렬 · 천구 좌표 · 기록', onPlay: () => setMode('practice') }] : []),
      { id: 'concept', kicker: '개념', title: '개념 정리', note: `${lessons.length}단원`, disabled: !lessons.length, onPlay: () => setMode('concept') },
      { id: 'all', kicker: '객관식', title: '전체 풀기', note: `${generalCards.length}문제 · 푼 문제 ${seenCount(generalCards)}`, disabled: !generalCards.length, onPlay: () => { setTopics([]); setMode('choice'); } },
      { id: 'topics', kicker: '객관식', title: '단원 골라 풀기', note: `${topicCount}단원`, disabled: !generalCards.length, onPlay: () => { setTopics([]); setMode('problems'); } },
      ...(missedAll.length ? [{ id: 'missed', kicker: '복습', title: '오답만 다시', note: `${missedAll.length}문제`, onPlay: () => { setRetryCards(missedAll); setMode('missed'); } }] : []),
      ...(allShort.length ? [{ id: 'short', kicker: '단답형', title: '정답 하나 쓰기', note: `${allShort.length}문제`, onPlay: () => { setWrongOnly(false); setWrittenTopic(''); setWritten(w => ({ ...w, index: 0 })); setMode('short'); } }] : []),
      ...(allWritten.length ? [{ id: 'written', kicker: '서술형', title: '서술형 쓰기', note: `${allWritten.length}문제`, onPlay: () => { setWrongOnly(false); setWrittenTopic(''); setWritten(w => ({ ...w, index: 0 })); setMode('written'); } }] : []),
    ];
    return <CardHand key="menu" deckName={name} prompt="무엇을 할까요?" cards={hand} onBack={onBack} backLabel="과목·파트" start={exam ? hand.findIndex(c => c.id === 'short') : 1} />;
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
        <h1 ref={title} tabIndex={-1}>{deck.fullName ?? deck.name}{mode === 'short' ? ' · 단답형' : mode === 'written' ? ' · 서술형' : mode === 'concept' ? ' · 개념 정리' : ''}</h1>
      </header>
      {mode === 'menu' ? <section className="biology-menu glass" aria-label="학습 메뉴">
        <h2>준비 중</h2><p>{deck.description}</p>
        <p className="study-scope">아직 자료가 없어요. 수업 자료가 들어오면 개념과 문제를 추가할게요.</p>
      </section> : mode === 'concept' ? <ConceptReader read={read} setRead={setRead} lessons={lessons} onPractice={keys => { setTopics(keys); setMode('problems'); }} />
      : <><div className="hwang-exam-filters">
        {exam && <p className="study-scope">시험 범위: 3~38쪽 + EM200 43~46쪽 · 표류법·EM11·카메라 제외 · 답안은 이 기기에 자동 저장돼요.</p>}
        <label>단원 선택 <select value={writtenTopic} onChange={event => { setWrittenTopic(event.target.value); setWritten(w => ({...w,index:0})); }}><option value="">전체 단원</option>{[...new Set(activeWritten.map(q => q.topic))].map(topic => <option key={topic} value={topic}>{topic}</option>)}</select></label>
        {mode === 'short' && <button type="button" className="glass-button" aria-pressed={wrongOnly} onClick={() => { setWrongOnly(!wrongOnly); setWritten(w => ({...w,index:0})); }}>{wrongOnly ? '전체 문제 보기' : '틀린 단답형만 다시'}</button>}
      </div>{questions.length ? <WrittenPractice questions={questions} state={written} setState={setWritten} /> : <p role="status">이 단원에 틀린 단답형이 없어요. 전체 문제 보기로 돌아가 연습하세요.</p>}</>}
    </div>
  </main>;
}

