import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import type { ConceptLesson } from '../../data/study-concepts';
import { isTyping } from '../../lib/directions';

export default function ConceptReader({ lessons, onPractice, read, setRead }: { lessons: ConceptLesson[]; onPractice: (topics: string[]) => void; read: string[]; setRead: Dispatch<SetStateAction<string[]>> }) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(lessons[0]?.id ?? '');
  const heading = useRef<HTMLHeadingElement>(null);
  const filtered = useMemo(() => lessons.filter(lesson => JSON.stringify(lesson).toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())), [lessons, query]);
  const lesson = filtered.find(item => item.id === selected) ?? filtered[0];
  useEffect(() => { if (lesson) heading.current?.focus(); }, [lesson?.id]);
  // ← → move between lessons, so reading never needs the mouse.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event) || (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') || document.querySelector('[aria-modal="true"]')) return;
      const at = filtered.findIndex(item => item.id === lesson?.id);
      const next = filtered[at + (event.key === 'ArrowRight' ? 1 : -1)];
      if (!next) return;
      event.preventDefault();
      setSelected(next.id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtered, lesson?.id]);
  return <section className="concept-reader" aria-label="개념 정리">
    <div className="concept-toolbar glass"><label>개념 검색<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="단원·용어·내용 검색" /></label><span>학습 표시 {read.length} / {lessons.length}단원</span></div>
    <div className="concept-layout">
      <nav className="concept-index glass" aria-label="개념 단원 선택">
        {filtered.map((item, i) => <button type="button" key={item.id} aria-current={lesson?.id === item.id ? 'true' : undefined} onClick={() => setSelected(item.id)}><span>{i + 1}. {item.title}</span>{read.includes(item.id) && <span aria-label="학습 표시됨">✓</span>}</button>)}
        {!filtered.length && <p role="status">검색 결과가 없어요.</p>}
      </nav>
      {lesson ? <article key={lesson.id} className="concept-article glass">
        <div className="concept-kicker">개념 파트</div><h2 tabIndex={-1} ref={heading}>{lesson.title}</h2><p className="concept-summary">{lesson.summary}</p>
        {lesson.sections.map((section, i) => <section className="concept-section" key={i}>
          <h3>{section.heading}</h3>
          {section.paragraphs?.map((paragraph, j) => <p key={j}>{paragraph}</p>)}
          {section.points && <ul>{section.points.map(point => <li key={point}>{point}</li>)}</ul>}
          {section.table && <div className="concept-table-wrap"><table><thead><tr>{section.table.columns.map(column => <th scope="col" key={column}>{column}</th>)}</tr></thead><tbody>{section.table.rows.map((row, j) => <tr key={j}>{row.map((cell, k) => <td key={k}>{cell}</td>)}</tr>)}</tbody></table></div>}
        </section>)}
        {lesson.examples?.length ? <details className="concept-examples"><summary>{lesson.examplesLabel ?? '수업자료의 추가 적용 사례'} {lesson.examples.length}개</summary>{lesson.examples.map(example => <section key={example.id}><h4>{example.context}</h4><p>{example.explanation}</p><small>{example.sourceNote}</small></section>)}</details> : null}
        {lesson.resources?.length ? <section className="concept-section" aria-label="공식 참고 자료"><h3>공식 참고 자료</h3><ul>{lesson.resources.map(resource => <li key={resource.url}><a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a> · {resource.publisher}<p>{resource.note}</p></li>)}</ul></section> : null}
        <p className="study-source">{lesson.sourceNote}</p>
        <div className="biology-actions"><button type="button" className="glass-button" aria-pressed={read.includes(lesson.id)} onClick={() => setRead(previous => previous.includes(lesson.id) ? previous.filter(id => id !== lesson.id) : [...previous, lesson.id])}>{read.includes(lesson.id) ? '✓ 학습 표시 해제' : '학습한 단원 표시'}</button><button type="button" className="glass-button" onClick={() => onPractice(lesson.topicKeys)}>관련 문제 연습 →</button></div>
      </article> : <div className="concept-article glass"><p>다른 검색어를 입력하거나 검색창을 비워 주세요.</p></div>}
    </div>
  </section>;
}
