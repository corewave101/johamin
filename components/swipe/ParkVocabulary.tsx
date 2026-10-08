import { useEffect, useRef, useState } from 'react';
import { parkVocabulary as terms, vocabularySource } from '../../data/park-vocabulary';
import { compareAnswer, currentRecord, dayKey, gradeTerm, loadVocabulary, saveVocabulary, streakDays } from '../../lib/vocabulary';
import { geneticsCards } from '../../data/genetics-terms';
import SwipeGame from './SwipeGame';

type Mode = 'list' | 'flash' | 'definition' | 'reverse' | 'test' | 'choice';
export default function ParkVocabulary({ onBack }: { onBack: () => void }) {
 const [mode,setMode]=useState<Mode>('list');
 const [progress,setProgress]=useState(loadVocabulary);
 const [saved,setSaved]=useState(true);
 const [query,setQuery]=useState(''); const [filter,setFilter]=useState('all');
 const [queue,setQueue]=useState<string[]>([]);const [index,setIndex]=useState(0);
 const [answer,setAnswer]=useState('');const [revealed,setRevealed]=useState(false);
 const [hint,setHint]=useState(0);const [ignoreSpaces,setIgnoreSpaces]=useState(false);
 const [result,setResult]=useState<ReturnType<typeof compareAnswer> | null>(null);
 const [sessionWins,setSessionWins]=useState(0);const [sessionErrors,setSessionErrors]=useState(0);
 const input=useRef<HTMLTextAreaElement>(null);
 useEffect(()=>{setSaved(saveVocabulary(progress));},[progress]);
 const today=dayKey();const learned=terms.filter(t=>currentRecord(progress,t).wins>0).length;
 const due=terms.filter(t=>currentRecord(progress,t).due<=Date.now()).length;
 const filtered=terms.filter(t=>`${t.term} ${t.definition}`.includes(query.trim()) && (filter==='all' || filter==='starred' && currentRecord(progress,t).starred || filter==='missed' && currentRecord(progress,t).mistakes>0 && currentRecord(progress,t).wins===0 || filter==='due' && currentRecord(progress,t).due<=Date.now()));
 const term=terms.find(t=>t.id===queue[index]);const finished=queue.length>0 && !term;
 const clear=()=>{setAnswer('');setRevealed(false);setHint(0);setResult(null);};
 const begin=(next:Mode,all=false)=>{
  const sorted=[...filtered].sort((a,b)=>currentRecord(progress,a).due-currentRecord(progress,b).due);
  // Fisher–Yates shuffle for the blind test; learning sessions prioritize due terms.
  if(next==='test') for(let i=sorted.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[sorted[i],sorted[j]]=[sorted[j],sorted[i]];}
  setQueue((all?sorted:sorted.slice(0,5)).map(t=>t.id));setIndex(0);setSessionWins(0);setSessionErrors(0);clear();setMode(next);
 };
 useEffect(()=>{if(term && ['definition','reverse','test'].includes(mode)) input.current?.focus();},[index,mode,term]);
 const submit=()=>{
  if(!term || result || !answer.trim())return;
  const reverse=mode==='reverse', target=reverse?term.term:term.definition;
  const checked=compareAnswer(answer,target,mode!=='test' && ignoreSpaces);
  setResult(checked);
  setSessionWins(n=>n+(checked.correct?1:0));setSessionErrors(n=>n+(checked.correct?0:1));
  if(!reverse) setProgress(p=>gradeTerm(p,term,checked.correct,hint===0 && !ignoreSpaces));
  // A failure returns once later in practice; a test always has a fixed length.
  if(!checked.correct && mode!=='test' && queue.filter(id=>id===term.id).length<2) setQueue(q=>[...q,term.id]);
 };
 const next=()=>{setIndex(i=>i+1);clear();};
 const star=(id:string)=>{const t=terms.find(x=>x.id===id)!;setProgress(p=>({...p,terms:{...p.terms,[id]:{...currentRecord(p,t),starred:!currentRecord(p,t).starred}}}));};
 const download=()=>{
  const blob=new Blob([vocabularySource+'\n\n'+terms.map(t=>`${t.term}\n${t.definition}\n출처: ${t.page}쪽`).join('\n\n')],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='박상영T_원문_단어장.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 if(mode==='choice')return <SwipeGame cards={geneticsCards} deckId="park-vocabulary-choice" deckName="박상영T · 용어 이해 문제" onBack={()=>setMode('list')} backLabel="← 단어장" />;
 return <main className="swipe-app biology-app"><div className="biology-study">
  <header className="biology-header glass"><button type="button" className="glass-button" onClick={mode==='list'?onBack:()=>{setMode('list');clear();}}>{mode==='list'?'← 박상영T 메뉴':'← 단어장'}</button><h1>박상영T · 원문 단어장</h1></header>
  <section className="biology-menu glass"><p>{vocabularySource} · 22개 용어</p><p className="study-scope">정의는 교사용 정답지 문구입니다. PDF 줄바꿈은 한 칸 공백으로 연결했습니다. 기본 채점은 조사·문장부호·내부 띄어쓰기까지 비교하며 입력 앞뒤 공백은 제외합니다. 이 화면의 채점은 원문 암기 연습 기준입니다.</p>
   <div className="biology-progress"><span>원문 성공 {learned} / 22</span><span>오늘 {progress.days[today]?.length ?? 0} / 5개 목표</span><span>{progress.xp} XP · 연속 {streakDays(progress.days)}일</span><span>복습할 용어 {due}개</span></div>
   {!saved && <p role="alert">이 브라우저에서 저장하지 못했어요. 화면을 닫으면 기록이 사라질 수 있어요.</p>}
   <p className="biology-note">힌트 없이 원문을 맞히면 용어당 하루 한 번 10 XP를 받아요. 원문 성공 후 1일·3일·7일 뒤 복습을 안내해요. 기록은 이 기기에 저장됩니다. 뜻을 보고 용어 맞히기·객관식은 원문 성공 기록에 포함되지 않아요.</p>
  </section>
  {mode==='list'?<section className="biology-menu glass">
   <div className="concept-toolbar"><label>용어·정의 검색<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="용어 또는 정의" /></label><label>목록 <select value={filter} onChange={e=>setFilter(e.target.value)}><option value="all">전체</option><option value="starred">즐겨찾기</option><option value="due">복습 예정</option><option value="missed">틀린 용어</option></select></label></div>
   <p>{filtered.length}개 선택됨 · 짧은 연습은 최대 5개씩 시작해요.</p>
   <button type="button" className="biology-mode" disabled={!filtered.length} onClick={()=>begin('flash')}><strong>카드 암기 · 5개씩</strong><span>용어를 보고 정의 떠올리기 → 뒤집어 확인</span></button>
   <button type="button" className="biology-mode" disabled={!filtered.length} onClick={()=>begin('definition')}><strong>정의 원문 입력 · 5개씩</strong><span>한 글자씩 비교 · 오답 한 번 더 연습 · 힌트</span></button>
   <button type="button" className="biology-mode" disabled={!filtered.length} onClick={()=>begin('reverse')}><strong>뜻을 보고 용어 맞히기</strong><span>정의를 먼저 읽고 정확한 용어 입력</span></button>
   <button type="button" className="biology-mode" disabled={!filtered.length} onClick={()=>{setIgnoreSpaces(false);begin('test');}}><strong>원문 실전 테스트 · 5개</strong><span>무작위 출제 · 힌트 없이 엄격 채점</span></button>
   <div className="biology-actions"><button type="button" className="glass-button" disabled={!filtered.length} onClick={()=>begin('definition',true)}>선택한 {filtered.length}개 모두 쓰기</button><button type="button" className="glass-button" onClick={()=>setMode('choice')}>용어 이해 객관식 22문제</button><button type="button" className="glass-button" onClick={download}>원문 단어장 내려받기</button></div>
   {!filtered.length && <p role="status">조건에 맞는 용어가 없어요. 검색어와 목록 조건을 바꿔 주세요.</p>}
   {filtered.map(t=>{const record=currentRecord(progress,t);return <details className="concept-examples" key={t.id}><summary>{t.term} · {record.wins>0?'원문 성공':'학습 중'}{record.starred?' ★':''}</summary><p>{t.definition}</p><p className="study-source">교사용 정답지 · {t.page}쪽 · 원문 오류 {record.mistakes}회{record.due>0?` · 복습 ${new Date(record.due).toLocaleDateString('ko-KR')}`:''}</p><button type="button" className="glass-button" aria-pressed={record.starred} onClick={()=>star(t.id)}>{record.starred?'즐겨찾기 해제':'즐겨찾기'}</button></details>})}
  </section>:finished?<section className="biology-written glass" aria-label="연습 결과"><h2>이번 연습 완료</h2><p>정답 {sessionWins}회 · 오답 {sessionErrors}회{mode==='flash'?' · 카드 확인 완료':''}</p><p>힌트·띄어쓰기 완화 없이 정의를 맞힌 기록만 원문 성공에 포함돼요.</p><div className="biology-actions"><button type="button" className="glass-button" onClick={()=>{setFilter('missed');setMode('list');}}>틀린 용어 모아 보기</button><button type="button" className="glass-button" onClick={()=>setMode('list')}>단어장으로</button></div></section>:term?<section className="biology-written glass" aria-label="용어 연습">
   <div className="biology-progress"><span>{index+1} / {queue.length}{mode==='test'?' · 실전 테스트':''}</span><button type="button" className="glass-button" aria-pressed={currentRecord(progress,term).starred} onClick={()=>star(term.id)}>★ 즐겨찾기</button></div>
   <h2>{mode==='reverse'?'이 정의의 용어는?':term.term}</h2>
   {mode==='reverse' && <p>{term.definition}</p>}
   {mode==='flash'?<><button type="button" className="biology-mode" aria-expanded={revealed} onClick={()=>setRevealed(v=>!v)}>{revealed?term.definition:'정의를 떠올린 뒤 눌러서 확인'}</button>{revealed && <div className="biology-actions"><button type="button" className="glass-button" onClick={()=>{if(queue.filter(id=>id===term.id).length<2)setQueue(q=>[...q,term.id]);next();}}>한 번 더 볼게요</button><button type="button" className="glass-button" onClick={next}>기억했어요 · 다음</button></div>}</>:<>
    {mode!=='test' && mode!=='reverse' && <label><input type="checkbox" checked={ignoreSpaces} disabled={!!result} onChange={e=>{setIgnoreSpaces(e.target.checked);setResult(null);}} /> 띄어쓰기 제외 연습 (원문 성공·XP 제외)</label>}
    <form onSubmit={e=>{e.preventDefault();submit();}}><label htmlFor="vocabulary-answer">{mode==='reverse'?'용어 입력':'정답지의 정의 전체를 입력하세요'}<textarea ref={input} id="vocabulary-answer" value={answer} onChange={e=>setAnswer(e.target.value)} rows={mode==='reverse'?2:6} maxLength={1200} disabled={!!result} autoComplete="off" spellCheck={false} /></label><button type="submit" className="glass-button" disabled={!answer.trim() || !!result}>채점하기</button></form>
    {mode==='definition' && !result && <div className="biology-actions"><button type="button" className="glass-button" onClick={()=>setHint(n=>n+1)}>앞부분 힌트 (원문 성공·XP 제외)</button></div>}
    {hint>0 && <p>힌트: {term.definition.slice(0,hint*15)}…</p>}
    {result && <div className="biology-model" role="status"><h3>{result.correct?'정답!':'원문과 달라요'}</h3>{!result.correct && <p>처음 다른 위치: {result.index+1}번째 글자 · 입력: {result.entered===' '?'[공백]':result.entered || '[끝]'} · 원문: {result.expected===' '?'[공백]':result.expected || '[끝]'}</p>}<p>{mode==='reverse'?term.term:term.definition}</p>{!result.correct && mode!=='reverse' && <details><summary>틀린 위치부터 원문 다시 보기</summary><p>{result.expectedRest}</p></details>}<p>{result.correct && (hint>0 || ignoreSpaces)?'보조 연습 정답입니다. 원문 성공과 XP에는 포함되지 않아요.':''}</p><button type="button" className="glass-button" onClick={next}>다음 용어 →</button></div>}
   </>}
   <p className="study-source">교사용 정답지 · {term.page}쪽</p>
  </section>:<section className="biology-menu glass"><p>연습할 용어가 없어요.</p></section>}
 </div></main>;
}
