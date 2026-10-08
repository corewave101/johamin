import { useEffect, useRef, useState } from 'react';
import type { SubjectDeck } from '../../data/swipe-subjects';
import type { SwipeCard } from '../../data/swipe-cards';
import { missedCards, seenCount } from '../../lib/progress';
import SwipeGame from './SwipeGame';
import ParkVocabulary from './ParkVocabulary';
import ConceptReader from './ConceptReader';
import { conceptsFor } from '../../data/study-concepts';

type Draft = { answer: string; checked: boolean[]; reviewed: boolean };
export default function SubjectStudy({ deck, onBack }: { deck: SubjectDeck; onBack: () => void }) {
  const [mode, setMode] = useState<'menu' | 'concept' | 'problems' | 'choice' | 'missed' | 'written' | 'vocabulary'>('menu');
  const [retryCards, setRetryCards] = useState<SwipeCard[]>([]);
  const [read, setRead] = useState<string[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [writtenTopic, setWrittenTopic] = useState('');
  const separateVocabulary = deck.id === 'biology-park';
  const lessons = conceptsFor(deck.id).filter(l => !separateVocabulary || l.id !== 'biology-park-terms');
  const generalCards = deck.cards.filter(c => !separateVocabulary || c.topic !== '유전학 핵심 용어');
  const choiceCards = topics.length ? generalCards.filter(card => topics.includes(card.topic)) : generalCards;
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const allWritten = (deck.writtenQuestions ?? []).filter(q => !separateVocabulary || q.topic !== '유전학 핵심 용어');
  const questions = writtenTopic ? allWritten.filter(q => q.topic === writtenTopic) : allWritten;
  const pending = !deck.cards.length && !questions.length && !lessons.length; // a part whose class material has not arrived yet
  const q = questions[index];
  const title = useRef<HTMLHeadingElement>(null);
  const draft = q ? drafts[q.id] ?? { answer: '', checked: [], reviewed: false } : null;
  const update = (changes: Partial<Draft>) => {
    if (q && draft) setDrafts(previous => ({ ...previous, [q.id]: { ...draft, reviewed: false, ...changes } }));
  };
  useEffect(() => { title.current?.focus(); }, [mode, index]);
  // The parent handles Esc; mode navigation uses explicit buttons.
  if (mode === 'vocabulary') return <ParkVocabulary onBack={() => setMode('menu')} />;
  if (mode === 'missed') return <SwipeGame cards={retryCards} deckId={deck.id} deckName={`${deck.fullName ?? deck.name} · 오답 다시`} onBack={() => setMode('problems')} backLabel="← 문제 유형" />;
  if (mode === 'choice') return <SwipeGame cards={choiceCards} deckId={deck.id} deckName={`${deck.fullName ?? deck.name} · 객관식`} onBack={() => setMode('problems')} backLabel="← 문제 유형" />;
  const reviewed = questions.filter(item => drafts[item.id]?.reviewed).length;
  const missed = missedCards(choiceCards);
  return <main className="swipe-app biology-app">
    <div className="biology-study">
      <header className="biology-header glass">
        <button type="button" className="glass-button" onClick={mode === 'menu' ? onBack : () => setMode(mode === 'written' ? 'problems' : 'menu')}>{mode === 'menu' ? '← 과목·파트' : mode === 'written' ? '← 문제 파트' : '← 학습 메뉴'}</button>
        <h1 ref={title} tabIndex={-1}>{deck.fullName ?? deck.name}{mode === 'written' ? ' · 서술형' : mode === 'concept' ? ' · 개념 정리' : ''}</h1>
      </header>
      {mode === 'menu' ? <section className="biology-menu glass" aria-label="학습 메뉴">
        <h2>{pending ? '준비 중' : '개념부터, 문제까지'}</h2><p>{deck.description}</p>
        {pending ? <p className="study-scope">아직 자료가 없어요. 수업 자료가 들어오면 개념과 문제를 추가할게요.</p> : <>
        <button type="button" className="biology-mode" onClick={() => setMode('concept')}><strong>개념 파트 · {lessons.length}단원</strong><span>핵심 설명 · 비교·예시 · 주의할 점 · 단원 검색</span></button>
        <button type="button" className="biology-mode" onClick={() => { setTopics([]); setWrittenTopic(''); setIndex(0); setMode('problems'); }}><strong>문제 파트 · 객관식 {generalCards.length} / 서술형 {allWritten.length}</strong><span>단원별 객관식 · 해설과 오답 재출제 · 서술형 직접 채점</span></button>
        {separateVocabulary && <button type="button" className="biology-mode" onClick={() => setMode('vocabulary')}><strong>원문 단어장 · 22개 용어</strong><span>카드 암기 · 정의 그대로 쓰기 · 용어 맞히기 · 5개 테스트 · 복습 기록</span></button>}
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
        {allWritten.length > 0 && <><label className="study-filter">서술형 단원 <select value={writtenTopic} onChange={e => { setWrittenTopic(e.target.value); setIndex(0); }}><option value="">전체 단원</option>{[...new Set(allWritten.map(q => q.topic))].map(topic => <option key={topic}>{topic}</option>)}</select></label><button type="button" className="biology-mode" onClick={() => { setIndex(0); setMode('written'); }}><strong>서술형 {questions.length}문제</strong><span>답안 작성 · 모범답안 · 항목별 직접 채점</span></button></>}
        <button type="button" className="glass-button" onClick={() => setMode('concept')}>개념 정리로 돌아가기</button>
      </section> : q && draft && <section className="biology-written glass" aria-label="서술형 연습">
        <div className="biology-progress"><span>{index + 1} / {questions.length} · {q.topic}</span><span>채점 완료 {reviewed} / {questions.length}</span></div>
        <h2>{q.question}</h2>
        {q.passage && <details key={q.id} open className="swipe-reading"><summary>READ & WRITE · 관련 영어 지문</summary><p lang="en">{q.passage}</p></details>}
        <label htmlFor="written-answer">내 답안</label>
        <textarea id="written-answer" value={draft.answer} onChange={event => update({ answer: event.target.value })} placeholder="핵심 개념과 이유를 문장으로 써 보세요." rows={7} />
        <div className="biology-actions"><button type="button" className="glass-button" aria-expanded={Boolean(revealed[q.id])} onClick={() => setRevealed(previous => ({ ...previous, [q.id]: !previous[q.id] }))}>{revealed[q.id] ? '모범답안 숨기기' : '모범답안·채점 기준 보기'}</button></div>
        {revealed[q.id] && <div className="biology-model">
          <h3>모범답안</h3><p>{q.modelAnswer}</p>
          <fieldset><legend>내 답안에 포함된 항목을 직접 체크하세요 · 각 1점</legend>
            {q.criteria.map((criterion, i) => <label key={criterion}><input type="checkbox" checked={Boolean(draft.checked[i])} onChange={event => { const checked = [...draft.checked]; checked[i] = event.target.checked; update({ checked }); }} />{criterion}</label>)}
          </fieldset>
          <p className="biology-score">직접 채점: {draft.checked.filter(Boolean).length} / {q.criteria.length}점</p>
          <button type="button" className="glass-button" disabled={!draft.answer.trim()} onClick={() => update({ reviewed: !draft.reviewed })}>{draft.reviewed ? '채점 완료 취소' : '채점 완료 표시'}</button>
          {!draft.answer.trim() && <p className="biology-note">내 답안을 작성한 뒤 채점 완료를 표시할 수 있어요.</p>}
        </div>}
        <p className="swipe-source">{q.sourceNote}</p>
        <nav className="biology-actions" aria-label="서술형 문제 이동">
          <button type="button" className="glass-button" disabled={index === 0} onClick={() => setIndex(index - 1)}>← 이전</button>
          <label>문제 <select value={index} onChange={event => setIndex(Number(event.target.value))}>{questions.map((item, i) => <option key={item.id} value={i}>{i + 1}. {item.topic}{drafts[item.id]?.reviewed ? ' ✓' : ''}</option>)}</select></label>
          <button type="button" className="glass-button" disabled={index === questions.length - 1} onClick={() => setIndex(index + 1)}>다음 →</button>
        </nav>
        {reviewed === questions.length && <p role="status" className="biology-score">서술형 {questions.length}문제를 모두 채점했어요!</p>}
      </section>}
    </div>
  </main>;
}

