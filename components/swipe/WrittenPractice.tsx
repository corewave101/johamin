// 서술형: write an answer, open the model answer and tick the points you covered.
// The drafts live in the parent so they survive going back to the menu.
import type { Dispatch, SetStateAction } from 'react';
import type { WrittenQuestion } from '../../data/biology-written';

export type Draft = { answer: string; checked: boolean[]; reviewed: boolean };
export type WrittenState = { index: number; drafts: Record<string, Draft>; revealed: Record<string, boolean> };
export const blankWritten = (): WrittenState => ({ index: 0, drafts: {}, revealed: {} });

export default function WrittenPractice({ questions, state, setState }: { questions: WrittenQuestion[]; state: WrittenState; setState: Dispatch<SetStateAction<WrittenState>> }) {
  const index = Math.min(state.index, Math.max(questions.length - 1, 0));
  const q = questions[index];
  if (!q) return null;
  const draft = state.drafts[q.id] ?? { answer: '', checked: [], reviewed: false };
  const update = (changes: Partial<Draft>) => setState(s => ({ ...s, drafts: { ...s.drafts, [q.id]: { ...draft, reviewed: false, ...changes } } }));
  const setIndex = (i: number) => setState(s => ({ ...s, index: i }));
  const reviewed = questions.filter(item => state.drafts[item.id]?.reviewed).length;
  const open = Boolean(state.revealed[q.id]);
  return <section className="biology-written glass" aria-label="서술형 연습">
    <div className="biology-progress"><span>{index + 1} / {questions.length} · {q.topic}</span><span>채점 완료 {reviewed} / {questions.length}</span></div>
    <h2>{q.question}</h2>
    {q.passage && <details key={q.id} open className="swipe-reading"><summary>READ & WRITE · 관련 영어 지문</summary><p lang="en">{q.passage}</p></details>}
    <label htmlFor="written-answer">내 답안</label>
    <textarea id="written-answer" value={draft.answer} onChange={event => update({ answer: event.target.value })} placeholder="핵심 개념과 이유를 문장으로 써 보세요." rows={7} />
    <div className="biology-actions"><button type="button" className="glass-button" aria-expanded={open} onClick={() => setState(s => ({ ...s, revealed: { ...s.revealed, [q.id]: !open } }))}>{open ? '모범답안 숨기기' : '모범답안·채점 기준 보기'}</button></div>
    {open && <div className="biology-model">
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
      <label>문제 <select value={index} onChange={event => setIndex(Number(event.target.value))}>{questions.map((item, i) => <option key={item.id} value={i}>{i + 1}. {item.topic}{state.drafts[item.id]?.reviewed ? ' ✓' : ''}</option>)}</select></label>
      <button type="button" className="glass-button" disabled={index === questions.length - 1} onClick={() => setIndex(index + 1)}>다음 →</button>
    </nav>
    {reviewed === questions.length && <p role="status" className="biology-score">서술형 {questions.length}문제를 모두 채점했어요!</p>}
  </section>;
}
