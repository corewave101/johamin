import { hwangFigurePage, isHwangExam } from '../../data/hwang-exam';
import { gradeHwangAnswer } from '../../lib/hwang-answer';
import { isShortQuestion } from '../../data/study-practice';
import { gradeShortAnswer } from '../../lib/practice-answer';
// 서술형: write an answer, open the model answer and tick the points you covered.
// The drafts live in the parent so they survive going back to the menu.
import type { Dispatch, SetStateAction } from 'react';
import type { WrittenQuestion } from '../../data/biology-written';

export type Draft = { answer: string; checked: boolean[]; reviewed: boolean; correct?: boolean };
export type WrittenState = { index: number; drafts: Record<string, Draft>; revealed: Record<string, boolean> };
export const blankWritten = (): WrittenState => ({ index: 0, drafts: {}, revealed: {} });

export default function WrittenPractice({ questions, state, setState }: { questions: WrittenQuestion[]; state: WrittenState; setState: Dispatch<SetStateAction<WrittenState>> }) {
  const index = Math.min(state.index, Math.max(questions.length - 1, 0));
  const q = questions[index];
  if (!q) return null;
  const short = isShortQuestion(q);
  const figure = hwangFigurePage(q);
  const grade = () => isHwangExam(q) ? gradeHwangAnswer(draft.answer, q) : gradeShortAnswer(draft.answer, q.modelAnswer);
  const draft = state.drafts[q.id] ?? { answer: '', checked: [], reviewed: false };
  const update = (changes: Partial<Draft>) => setState(s => ({ ...s, drafts: { ...s.drafts, [q.id]: { ...draft, reviewed: false, correct: undefined, ...changes } } }));
  const setIndex = (i: number) => setState(s => ({ ...s, index: i }));
  const reviewed = questions.filter(item => state.drafts[item.id]?.reviewed).length;
  const open = Boolean(state.revealed[q.id]);
  return <section className="biology-written glass" aria-label={short ? "단답형 연습" : "서술형 연습"}>
    <div className="biology-progress"><span>{index + 1} / {questions.length} · {q.topic}</span><span>채점 완료 {reviewed} / {questions.length}</span></div>
    <h2>{q.question}</h2>
    {figure && <details key={q.id} className="hwang-reference"><summary>수업자료 그림·힌트 보기 · {figure}쪽</summary><p>그림에는 정답 단서가 포함되어 있어요. 먼저 기억으로 답을 써 보세요.</p><img loading="lazy" src={`images/hwang-exam/page-${figure}.jpg`} alt={`수업자료 ${figure}쪽의 부품과 정렬 그림`} /></details>}
    {q.passage && <details key={q.id} open className="swipe-reading"><summary>READ & WRITE · 관련 영어 지문</summary><p lang="en">{q.passage}</p></details>}
    <label htmlFor="written-answer">내 답안</label>
    <textarea id="written-answer" value={draft.answer} onChange={event => update({ answer: event.target.value })} placeholder={short ? '정답 하나를 입력하세요.' : '핵심 개념과 이유를 문장으로 써 보세요.'} rows={short ? 2 : 7} onKeyDown={event => { if (short && event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); if (draft.answer.trim()) { update({ reviewed: true, correct: grade() }); setState(s => ({ ...s, revealed: { ...s.revealed, [q.id]: true } })); } } }} />
    {short && <div className="biology-actions"><button type="button" className="glass-button is-primary" disabled={!draft.answer.trim()} onClick={() => { update({ reviewed: true, correct: grade() }); setState(s => ({ ...s, revealed: { ...s.revealed, [q.id]: true } })); }}>채점하기 · Enter</button></div>}
    {short && draft.reviewed && <p role="status" className="biology-score">{draft.correct ? '정답이에요!' : '정답을 확인하고 다시 써 보세요.'}</p>}
    <div className="biology-actions"><button type="button" className="glass-button" aria-expanded={open} onClick={() => setState(s => ({ ...s, revealed: { ...s.revealed, [q.id]: !open } }))}>{open ? '정답 숨기기' : short ? '정답 보기' : '모범답안·채점 기준 보기'}</button></div>
    {open && <div className="biology-model">
      <h3>{short ? '정답' : '모범답안'}</h3><p className="written-model-text">{q.modelAnswer}</p>
      {!short && <><fieldset><legend>내 답안에 포함된 항목을 직접 체크하세요 · 각 1점</legend>
        {q.criteria.map((criterion, i) => <label key={criterion}><input type="checkbox" checked={Boolean(draft.checked[i])} onChange={event => { const checked = [...draft.checked]; checked[i] = event.target.checked; update({ checked }); }} />{criterion}</label>)}
      </fieldset>
      <p className="biology-score">직접 채점: {draft.checked.filter(Boolean).length} / {q.criteria.length}점</p>
      <button type="button" className="glass-button" disabled={!draft.answer.trim()} onClick={() => update({ reviewed: !draft.reviewed })}>{draft.reviewed ? '채점 완료 취소' : '채점 완료 표시'}</button>
      {!draft.answer.trim() && <p className="biology-note">내 답안을 작성한 뒤 채점 완료를 표시할 수 있어요.</p>}</>}
    </div>}
    <p className="swipe-source">{q.sourceNote}</p>
    <nav className="biology-actions" aria-label="서술형 문제 이동">
      <button type="button" className="glass-button" disabled={index === 0} onClick={() => setIndex(index - 1)}>← 이전</button>
      <label>문제 <select value={index} onChange={event => setIndex(Number(event.target.value))}>{questions.map((item, i) => <option key={item.id} value={i}>{i + 1}. {item.topic}{state.drafts[item.id]?.reviewed ? ' ✓' : ''}</option>)}</select></label>
      <button type="button" className="glass-button" disabled={index === questions.length - 1} onClick={() => setIndex(index + 1)}>다음 →</button>
    </nav>
    {reviewed === questions.length && <p role="status" className="biology-score">{short ? '단답형' : '서술형'} {questions.length}문제를 모두 채점했어요!</p>}
  </section>;
}
