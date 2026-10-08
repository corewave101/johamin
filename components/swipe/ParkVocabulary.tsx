// 박상영T · 원문 단어장. Menus are cards (↑ ← → choose, ↓ back) so study never switches from keys/swipes to the mouse.
//   ↑ 카드로 외우기 — flip a word card, → 외웠어 / ← 한 번 더
//   ← 문장 배치     — put the pieces of the definition back in order
//   → 쓰기 테스트   — write the definition; one point per key idea (핵심어), word-for-word earns a badge
// Every mode starts from a fixed set (기본 용어, 유전 법칙 …) so the same few words can be learned together.
import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { geneticsCards } from '../../data/genetics-terms';
import { parkVocabulary as terms, vocabularySets, vocabularySource, type VocabularyTerm } from '../../data/park-vocabulary';
import { compareAnswer, currentRecord, dayKey, gradeTerm, loadVocabulary, saveVocabulary, scoreKeywords, scoreMessage, streakDays, type KeywordScore } from '../../lib/vocabulary';
import MenuCard from './MenuCard';
import OrderDeck from './OrderDeck';
import SwipeGame from './SwipeGame';

type Mode = 'flash' | 'order' | 'write' | 'reverse';
type Screen = 'home' | 'sets' | Mode | 'done' | 'list' | 'choice';
type Done = { id: string; got: number; total: number; perfect?: boolean; firstTry?: boolean };
const MODE_NAME: Record<Mode, string> = { flash: '카드로 외우기', order: '문장 배치', write: '쓰기 테스트', reverse: '뜻 보고 용어 맞히기' };
const byName = new Map(terms.map(t => [t.term, t]));

/** "같○ ○○" — the first letter of each word of a key idea, for a hint. */
const initials = (label: string) => label.replace(/[^\s·()/:,0-9A-Za-z–]/gu, (ch, at: number, all: string) => (at === 0 || /[\s·(/]/.test(all[at - 1]) ? ch : '○'));

export default function ParkVocabulary({ onBack, escapeRef }: { onBack: () => void; escapeRef?: MutableRefObject<(() => boolean) | null> }) {
  const [screen, setScreen] = useState<Screen>('home');
  const [mode, setMode] = useState<Mode>('flash');
  const [progress, setProgress] = useState(loadVocabulary);
  const [saved, setSaved] = useState(true);
  const [setAt, setSetAt] = useState(0);
  const [queue, setQueue] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState<KeywordScore | null>(null);
  const [reverseResult, setReverseResult] = useState<boolean | null>(null);
  const [hint, setHint] = useState(false);
  const [done, setDone] = useState<Done[]>([]);
  const [xpAtStart, setXpAtStart] = useState(0);
  const [query, setQuery] = useState(''); const [filter, setFilter] = useState('all');
  const input = useRef<HTMLTextAreaElement>(null);
  const nextButton = useRef<HTMLButtonElement>(null);
  useEffect(() => { setSaved(saveVocabulary(progress)); }, [progress]);

  const now = Date.now(), today = dayKey();
  const learned = terms.filter(t => currentRecord(progress, t).wins > 0).length;
  const review = terms.filter(t => { const r = currentRecord(progress, t); return (r.mistakes > 0 && r.wins === 0) || (r.wins > 0 && r.due <= now); });
  const starred = terms.filter(t => currentRecord(progress, t).starred);
  const sets = [
    ...vocabularySets.map(s => ({ id: s.id, name: s.name, list: s.terms.map(n => byName.get(n)!).filter(Boolean) })),
    ...(review.length ? [{ id: 'review', name: '다시 볼 용어', list: review }] : []),
    ...(starred.length ? [{ id: 'starred', name: '즐겨찾기', list: starred }] : []),
    { id: 'all', name: '전체 22개', list: terms },
  ];
  const chosenSet = sets[Math.min(setAt, sets.length - 1)];
  const term: VocabularyTerm | undefined = terms.find(t => t.id === queue[index]);

  const clear = () => { setAnswer(''); setScore(null); setReverseResult(null); setHint(false); setFlipped(false); };
  const openSets = (next: Mode) => { setMode(next); setScreen('sets'); };
  const begin = () => { setQueue(chosenSet.list.map(t => t.id)); setIndex(0); setDone([]); setXpAtStart(progress.xp); clear(); setScreen(mode); };
  const advance = () => { clear(); if (index + 1 < queue.length) setIndex(index + 1); else setScreen('done'); };
  const again = (id: string) => { if (queue.filter(x => x === id).length < 2) setQueue(q => [...q, id]); };
  const star = (id: string) => { const t = terms.find(x => x.id === id)!; setProgress(p => ({ ...p, terms: { ...p.terms, [id]: { ...currentRecord(p, t), starred: !currentRecord(p, t).starred } } })); };

  // Esc: one step back. Returns false at the top so the 박상영T menu takes over.
  const back = () => {
    if (screen === 'home') return false;
    if (screen === 'sets' || screen === 'list' || screen === 'choice') setScreen('home');
    else setScreen('sets');
    clear();
    return true;
  };
  if (escapeRef) escapeRef.current = back;

  useEffect(() => { if (term && (screen === 'write' || screen === 'reverse')) input.current?.focus(); }, [index, screen, term]);
  useEffect(() => { if (score || reverseResult !== null) nextButton.current?.focus(); }, [score, reverseResult]);

  const submit = () => {
    if (!term || !answer.trim() || score || reverseResult !== null) return;
    if (screen === 'reverse') { setReverseResult(compareAnswer(answer, term.term, true).correct); return; }
    const result = scoreKeywords(answer, term);
    setScore(result);
    setProgress(p => gradeTerm(p, term, result, !hint));
    setDone(d => [...d, { id: term.id, got: result.got, total: result.total, perfect: result.perfect }]);
    if (result.got < result.total) again(term.id);
  };
  const download = () => {
    const blob = new Blob([vocabularySource + '\n\n' + terms.map(t => `${t.term}\n${t.definition}\n핵심어: ${t.keywords.map(k => k.label).join(', ')}\n출처: ${t.page}쪽`).join('\n\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob), a = document.createElement('a'); a.href = url; a.download = 'park-vocabulary.txt'; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const keywordChips = (t: VocabularyTerm, hits?: boolean[]) => <ul className="keyword-chips" aria-label="핵심어">
    {t.keywords.map((k, i) => <li key={k.label} className={hits ? (hits[i] ? 'is-hit' : 'is-miss') : ''}>{hits ? (hits[i] ? '✓ ' : '· ') : ''}{k.label}</li>)}
  </ul>;

  if (screen === 'choice') return <SwipeGame cards={geneticsCards} deckId="park-vocabulary-choice" deckName="박상영T · 용어 이해 문제" onBack={() => setScreen('home')} backLabel="← 단어장" />;

  if (screen === 'home') return <MenuCard cardKey="vocab-home" topic="박상영T · 원문 단어장" subject={`외운 용어 ${learned} / 22`} question={`오늘 ${progress.days[today]?.length ?? 0} / 5개 · ${progress.xp} XP · 연속 ${streakDays(progress.days)}일`} onBack={onBack} backLabel="박상영T"
    up={{ label: '카드로 외우기', note: '뒤집어 확인', onChoose: () => openSets('flash') }}
    left={{ label: '문장 배치', note: '정의 조각 순서', onChoose: () => openSets('order') }}
    right={{ label: '쓰기 테스트', note: '핵심어 채점', onChoose: () => openSets('write') }}>
    <div className="menu-extras">
      <button type="button" className="glass-button" onClick={() => setScreen('list')}>용어 목록 · 즐겨찾기</button>
      <button type="button" className="glass-button" onClick={() => openSets('reverse')}>뜻 보고 용어 맞히기</button>
      <button type="button" className="glass-button" onClick={() => setScreen('choice')}>용어 이해 객관식 22문제</button>
    </div>
    {!saved && <p className="menu-hint glass" role="alert">이 브라우저에서 저장하지 못했어요. 화면을 닫으면 기록이 사라질 수 있어요.</p>}
  </MenuCard>;

  if (screen === 'sets') {
    const step = (d: number) => setSetAt(i => (Math.min(i, sets.length - 1) + d + sets.length) % sets.length);
    const names = chosenSet.list.map(t => t.term);
    return <MenuCard cardKey={`vocab-set-${chosenSet.id}`} topic={`${MODE_NAME[mode]} · 묶음 ${Math.min(setAt, sets.length - 1) + 1} / ${sets.length}`} subject={chosenSet.name}
      question={names.length > 6 ? `${names.slice(0, 5).join(', ')} 외 ${names.length - 5}개` : names.join(', ')} onBack={() => setScreen('home')} backLabel="단어장"
      up={{ label: '이 묶음 시작', note: `${names.length}개`, onChoose: begin }}
      left={{ label: '이전 묶음', onChoose: () => step(-1) }} right={{ label: '다음 묶음', onChoose: () => step(1) }}>
      <p className="menu-hint glass">← → 로 묶음을 고르고 ↑ 로 시작해요. 같은 묶음을 며칠 반복하면 잘 외워져요.</p>
    </MenuCard>;
  }

  if (screen === 'done') {
    const xp = progress.xp - xpAtStart;
    const best = new Map<string, Done>();
    for (const d of done) { const prev = best.get(d.id); if (!prev || d.got / d.total > prev.got / prev.total) best.set(d.id, d); }
    const scored = [...best.values()];
    const got = scored.reduce((n, d) => n + d.got, 0), total = scored.reduce((n, d) => n + d.total, 0);
    return <MenuCard cardKey="vocab-done" topic={`${MODE_NAME[mode]} · ${chosenSet.name}`} subject="한 묶음 끝!"
      question={mode === 'write' ? `핵심어 ${got} / ${total} · +${xp} XP` : mode === 'order' ? `한 번에 맞춘 정의 ${done.filter(d => d.firstTry).length} / ${new Set(queue).size}` : `${new Set(queue).size}개 확인`}
      onBack={() => setScreen('home')} backLabel="단어장"
      up={{ label: '한 번 더', onChoose: begin }} right={{ label: '다른 묶음', onChoose: () => setScreen('sets') }}
      left={mode !== 'write' ? { label: '쓰기 테스트로', onChoose: () => { setMode('write'); setScreen('sets'); } } : undefined}>
      {mode === 'write' && scored.length > 0 && <ul className="menu-hint glass vocab-summary">
        {scored.map(d => { const t = terms.find(x => x.id === d.id)!; return <li key={d.id}><strong>{t.term}</strong> {d.got} / {d.total}{d.perfect ? ' · 원문 완벽 ✦' : d.got === d.total ? ' · 전부!' : ''}</li>; })}
      </ul>}
    </MenuCard>;
  }

  if (screen === 'flash' && term) {
    const repeat = queue.filter(x => x === term.id).length > 1;
    return <MenuCard cardKey={`flash-${term.id}-${index}`} topic={`${chosenSet.name} · ${index + 1} / ${queue.length}`} subject={term.term}
      question={flipped ? '맞게 떠올렸나요?' : '정의를 떠올려 보세요 · 눌러서 뒤집기'} onBack={() => setScreen('sets')} backLabel="그만"
      onTap={() => setFlipped(f => !f)}
      up={{ label: flipped ? '다시 덮기' : '뒤집기', note: 'Space', onChoose: () => setFlipped(f => !f) }}
      left={{ label: '한 번 더', note: repeat ? '이미 한 번 더 나와요' : '뒤에 다시', onChoose: () => { again(term.id); advance(); } }}
      right={{ label: '외웠어', onChoose: () => { setDone(d => [...d, { id: term.id, got: 1, total: 1 }]); advance(); } }}>
      {flipped ? <div className="flash-back glass" aria-live="polite"><p>{term.definition}</p>{keywordChips(term)}<small>쓰기 테스트는 이 핵심어로 채점해요 · 정답지 {term.page}쪽</small></div>
        : <p className="menu-hint glass">카드를 누르거나 ↑·Space로 뒤집어요.</p>}
    </MenuCard>;
  }

  if (screen === 'order' && term) return <main className="swipe-app biology-app"><div className="biology-study">
    <header className="biology-header glass"><button type="button" className="glass-button" onClick={() => setScreen('sets')}>← 묶음</button><h1>{MODE_NAME.order}</h1></header>
    <OrderDeck pieces={term.pieces} title={term.term} prompt="정의 조각을 순서대로 쌓아 보세요." step={`${chosenSet.name} · ${index + 1} / ${queue.length}`}
      nextLabel={index + 1 < queue.length ? '다음 용어 →' : '결과 보기'}
      onNext={result => { setDone(d => [...d, { id: term.id, got: result.right, total: result.total, firstTry: result.firstTry }]); advance(); }} />
  </div></main>;

  if ((screen === 'write' || screen === 'reverse') && term) {
    const reverse = screen === 'reverse';
    return <main className="swipe-app biology-app"><div className="biology-study">
      <header className="biology-header glass"><button type="button" className="glass-button" onClick={() => setScreen('sets')}>← 묶음</button><h1>{MODE_NAME[screen]}</h1></header>
      <section className="biology-written glass vocab-write" aria-label="용어 쓰기">
        <div className="biology-progress"><span>{chosenSet.name} · {index + 1} / {queue.length}</span><button type="button" className="glass-button" aria-pressed={currentRecord(progress, term).starred} onClick={() => star(term.id)}>★ 즐겨찾기</button></div>
        <h2>{reverse ? '이 정의의 용어는?' : term.term}</h2>
        {reverse ? <p>{term.definition}</p> : <p className="biology-note">정의를 써 보세요. 핵심어 {term.keywords.length}개가 들어가면 만점이에요. 순서·띄어쓰기·조사는 상관없어요.</p>}
        <form onSubmit={e => { e.preventDefault(); submit(); }}>
          <label htmlFor="vocabulary-answer" className="sr-only">{reverse ? '용어 입력' : '정의 입력'}</label>
          <textarea ref={input} id="vocabulary-answer" value={answer} onChange={e => setAnswer(e.target.value)} rows={reverse ? 2 : 5} maxLength={1200} disabled={Boolean(score) || reverseResult !== null} autoComplete="off" spellCheck={false}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); } }} placeholder={reverse ? '용어' : '예) 상동염색체의 같은 위치에 있으며 …'} />
          {!score && reverseResult === null && <div className="biology-actions">
            <button type="submit" className="glass-button is-primary" disabled={!answer.trim()}>채점하기 <kbd>Enter</kbd></button>
            {!reverse && !hint && <button type="button" className="glass-button" onClick={() => setHint(true)}>핵심어 힌트 (XP 없음)</button>}
            <button type="button" className="glass-button" onClick={() => { if (!reverse) { setDone(d => [...d, { id: term.id, got: 0, total: term.keywords.length }]); setProgress(p => gradeTerm(p, term, { got: 0, total: term.keywords.length, perfect: false }, false)); again(term.id); } advance(); }}>모르겠어요</button>
          </div>}
        </form>
        {hint && !score && <p className="vocab-hint">핵심어 {term.keywords.length}개: {term.keywords.map(k => initials(k.label)).join(' · ')}</p>}
        {score && <div className={`biology-model vocab-result ${score.got === score.total ? 'is-full' : ''}`} role="status">
          <h3>{scoreMessage(score)} <span className="vocab-score">{score.got} / {score.total}</span>{score.perfect && <span className="vocab-badge">원문 완벽 ✦</span>}</h3>
          {keywordChips(term, score.hits)}
          <p>{term.definition}</p>
          {score.got < score.total && <p className="biology-note">빠진 핵심어가 있는 용어는 이 묶음 끝에 한 번 더 나와요.</p>}
          <button type="button" ref={nextButton} className="glass-button is-primary" onClick={advance}>{index + 1 < queue.length ? '다음 용어' : '결과 보기'} <kbd>Enter</kbd></button>
        </div>}
        {reverseResult !== null && <div className="biology-model" role="status">
          <h3>{reverseResult ? '정답!' : `정답은 ‘${term.term}’`}</h3>
          <button type="button" ref={nextButton} className="glass-button is-primary" onClick={() => { if (!reverseResult) again(term.id); advance(); }}>{index + 1 < queue.length ? '다음' : '결과 보기'} <kbd>Enter</kbd></button>
        </div>}
        <p className="study-source">교사용 정답지 · {term.page}쪽</p>
      </section>
    </div></main>;
  }

  // 용어 목록
  const filtered = terms.filter(t => `${t.term} ${t.definition}`.includes(query.trim()) && (filter === 'all' || (filter === 'starred' && currentRecord(progress, t).starred) || (filter === 'review' && review.includes(t))));
  return <main className="swipe-app biology-app"><div className="biology-study">
    <header className="biology-header glass"><button type="button" className="glass-button" onClick={() => setScreen('home')}>← 단어장</button><h1>박상영T · 용어 목록</h1></header>
    <section className="biology-menu glass">
      <p className="study-scope">{vocabularySource}. 정의는 정답지 문구 그대로예요. 쓰기 테스트는 아래 핵심어로 채점해요(순서·띄어쓰기·조사 무관). 정의를 글자까지 똑같이 쓰면 ‘원문 완벽’ 배지가 붙어요. 기록은 이 기기에 저장돼요.</p>
      <div className="concept-toolbar"><label>용어·정의 검색<input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="용어 또는 정의" /></label><label>목록 <select value={filter} onChange={e => setFilter(e.target.value)}><option value="all">전체</option><option value="starred">즐겨찾기</option><option value="review">다시 볼 용어</option></select></label></div>
      {!filtered.length && <p role="status">조건에 맞는 용어가 없어요.</p>}
      {filtered.map(t => { const r = currentRecord(progress, t); return <details className="concept-examples" key={t.id}>
        <summary>{t.term} · {r.wins > 0 ? '외움' : '학습 중'}{r.perfect ? ' ✦' : ''}{r.starred ? ' ★' : ''}</summary>
        <p>{t.definition}</p>{keywordChips(t)}
        <p className="study-source">교사용 정답지 · {t.page}쪽 · 빠뜨린 횟수 {r.mistakes}{r.wins > 0 && r.due > 0 ? ` · 다음 복습 ${new Date(r.due).toLocaleDateString('ko-KR')}` : ''}</p>
        <button type="button" className="glass-button" aria-pressed={r.starred} onClick={() => star(t.id)}>{r.starred ? '즐겨찾기 해제' : '즐겨찾기'}</button>
      </details>; })}
      <div className="biology-actions"><button type="button" className="glass-button" onClick={download}>단어장 내려받기 (핵심어 포함)</button></div>
    </section>
  </div></main>;
}
