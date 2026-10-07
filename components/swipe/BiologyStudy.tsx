import { useEffect, useRef, useState } from 'react';
import type { SubjectDeck } from '../../data/swipe-subjects';
import SwipeGame from './SwipeGame';

type Draft = { answer: string; checked: boolean[]; reviewed: boolean };
export default function BiologyStudy({ deck, onBack }: { deck: SubjectDeck; onBack: () => void }) {
  const [mode, setMode] = useState<'menu' | 'choice' | 'written'>('menu');
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const questions = deck.writtenQuestions ?? [];
  const q = questions[index];
  const title = useRef<HTMLHeadingElement>(null);
  const draft = q ? drafts[q.id] ?? { answer: '', checked: [], reviewed: false } : null;
  const update = (changes: Partial<Draft>) => {
    if (q && draft) setDrafts(previous => ({ ...previous, [q.id]: { ...draft, reviewed: false, ...changes } }));
  };
  useEffect(() => { title.current?.focus(); }, [mode, index]);
  // Esc is handled by the parent picker; this component uses explicit mode buttons.
  if (mode === 'choice') return <SwipeGame cards={deck.cards} deckName={`${deck.fullName} · 객관식`} onBack={() => setMode('menu')} backLabel="← 문제 유형" />;
  const reviewed = questions.filter(item => drafts[item.id]?.reviewed).length;
  return <main className="swipe-app biology-app">
    <div className="biology-study">
      <header className="biology-header glass">
        <button type="button" className="glass-button" onClick={mode === 'menu' ? onBack : () => setMode('menu')}>{mode === 'menu' ? '← 선생님 선택' : '← 문제 유형'}</button>
        <h1 ref={title} tabIndex={-1}>{deck.fullName}{mode === 'written' ? ' · 서술형' : ''}</h1>
      </header>
      {mode === 'menu' ? <section className="biology-menu glass" aria-label="문제 유형 선택">
        <h2>어떤 문제를 풀까?</h2><p>{deck.description}</p>
        <button type="button" className="biology-mode" onClick={() => setMode('choice')}><strong>객관식 {deck.cards.length}문제</strong><span>방향으로 답하기 · 정답과 해설 · 오답 다시 풀기</span></button>
        <button type="button" className="biology-mode" onClick={() => setMode('written')}><strong>서술형 {questions.length}문제</strong><span>답안 작성 · 모범답안 · 항목별 직접 채점</span></button>
        <p className="biology-note">답안과 채점 기록은 이 파트에 머무는 동안 유지돼요. 새로고침하거나 선생님 선택으로 돌아가면 초기화돼요.</p>
      </section> : q && draft && <section className="biology-written glass" aria-label="서술형 연습">
        <div className="biology-progress"><span>{index + 1} / {questions.length} · {q.topic}</span><span>채점 완료 {reviewed} / {questions.length}</span></div>
        <h2>{q.question}</h2>
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
