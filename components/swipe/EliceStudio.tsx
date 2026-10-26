import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { ELICE_CHAPTERS, eliceProblems, solutionOf, type EliceProblem } from '../../data/elice-problems';
import { cleanTraceback, explainError, loadRecords, normalizeOutput, sameOutput, saveRecord, scoreOf, type EliceRecord } from '../../lib/elice';
import { navTargets } from '../../lib/exam';
import { isTyping } from '../../lib/directions';
import { onRunnerState, runnerState, runPython, startRunner, type RunnerState } from '../../lib/py-runner';
import { playResult, playTick } from '../../lib/sound';
import CodeEditor, { highlight, type CodeEditorHandle } from './CodeEditor';
import Confetti from './Confetti';

// 정보(엘리스 수행) 페이지: 카드 없이 엘리스 화면 그대로. 왼쪽 문제, 오른쪽 main.py 편집기 · 실행 · 제출 · 결과.
// 주소 #info-05처럼 문제를 연다(뒤로 가기 = 목록). <base href>가 있어서 링크는 '#…'만 쓰지 않고 지금 주소를 붙인다(안 그러면 처음 화면으로 간다).

const DEFAULT_LIMIT = 3;
const GRACE_MS = 2500;
const ARROW: Record<string, string> = { up: '↑', left: '←', right: '→' };

const idFromHash = () => {
  const id = decodeURIComponent(window.location.hash.slice(1));
  return eliceProblems.some(p => p.id === id) ? id : null;
};

/** `코드`와 **굵게**만 있는 짧은 글. */
function rich(text: string): ReactNode[] {
  return text.split(/(`[^`]+`|\*\*[^*]+\*\*)/).filter(Boolean).map((part, i) => {
    if (part.startsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    return part;
  });
}

const when = (at?: number) => at ? new Date(at).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '-';

export default function EliceStudio() {
  const [openId, setOpenId] = useState<string | null>(idFromHash);
  const [records, setRecords] = useState<Record<string, EliceRecord>>(loadRecords);
  useEffect(() => {
    const sync = () => setOpenId(idFromHash());
    const home = () => { if (window.location.hash) window.location.hash = ''; setOpenId(null); };
    window.addEventListener('hashchange', sync);
    window.addEventListener('johamin:home', home);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('johamin:home', home); };
  }, []);
  const problem = eliceProblems.find(p => p.id === openId);
  // 위쪽 막대 오른쪽의 가호 · 업데이트 · 소리 · 버전 묶음(app/main.tsx)만큼 자리를 비운다.
  const app = useRef<HTMLElement>(null);
  useEffect(() => {
    const dock = document.querySelector<HTMLElement>('.elice-dock');
    if (!dock) return;
    const fit = () => app.current?.style.setProperty('--dock-w', `${Math.ceil(dock.getBoundingClientRect().width)}px`);
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(dock);
    return () => observer.disconnect();
  }, []);
  return <main className="elice-app" ref={app}>
    {problem
      ? <ProblemView key={problem.id} problem={problem} record={records[problem.id]} onRecord={setRecords} />
      : <CourseList records={records} />}
  </main>;
}

function CourseList({ records }: { records: Record<string, EliceRecord> }) {
  const list = useRef<HTMLDivElement>(null);
  const done = eliceProblems.filter(p => (records[p.id]?.best ?? 0) === 100).length;
  const tried = eliceProblems.filter(p => records[p.id]?.best !== undefined);
  const average = tried.length ? Math.round(tried.reduce((sum, p) => sum + (records[p.id]?.best ?? 0), 0) / tried.length) : null;
  useEffect(() => {
    // ↑ ↓ moves between problems, Enter opens (links).
    const onKey = (event: KeyboardEvent) => {
      if (isTyping(event) || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) return;
      const rows = Array.from(list.current?.querySelectorAll<HTMLAnchorElement>('.elice-row') ?? []);
      if (!rows.length) return;
      event.preventDefault();
      const index = rows.indexOf(document.activeElement as HTMLAnchorElement);
      const next = index < 0 ? 0 : Math.max(0, Math.min(rows.length - 1, index + (event.key === 'ArrowDown' ? 1 : -1)));
      rows[next].focus();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  let number = 0;
  return <section className="elice-course glass" ref={list}>
    <header className="elice-course-head">
      <div>
        <p className="elice-kicker"><span aria-hidden="true">⌘</span> 정보 · 엘리스 수행 대비</p>
        <h1>엘리스 코딩 연습</h1>
        <p className="elice-lead">입력 받는 코드 밑에 나머지를 짜고 <b>실행</b> · <b>제출</b>하면 브라우저 안 파이썬이 바로 채점해요. DFS(스택)만 빈칸(<code>____</code>) 채우기예요.</p>
      </div>
      <nav className="elice-nav" aria-label="이동">
        {navTargets('elice').map(target => <a key={target.page} className="glass-button" href={target.href}><span aria-hidden="true">{ARROW[target.direction]}</span> {target.label}</a>)}
      </nav>
    </header>
    <div className="elice-progress" aria-label={`100점 ${done}문제 / ${eliceProblems.length}문제`}>
      <div className="elice-progress-bar"><span style={{ width: `${done / eliceProblems.length * 100}%` }} /></div>
      <p><b>{done}</b> / {eliceProblems.length} 완료{average !== null && <> · 평균 <b>{average}</b>점</>}</p>
    </div>
    {ELICE_CHAPTERS.map(chapter => <section key={chapter.id} className={`elice-chapter${chapter.id === 'must' ? ' is-must' : ''}`}>
      <h2>{chapter.name}<small>{chapter.note}</small></h2>
      <ol>
        {eliceProblems.filter(p => p.chapter === chapter.id).map(p => {
          number += 1;
          const best = records[p.id]?.best;
          return <li key={p.id}>
            <a className="elice-row" href={`${window.location.pathname}#${p.id}`} onClick={() => playTick()}>
              <span className="elice-row-num">{number}</span>
              <span className="elice-row-title">{p.title}{p.must && <em className="elice-must">수행 출제</em>}</span>
              <span className={`elice-row-score${best === 100 ? ' is-full' : best !== undefined ? ' is-part' : ''}`}>{best === undefined ? '-' : `${best}점`}</span>
            </a>
          </li>;
        })}
      </ol>
    </section>)}
  </section>;
}

type Verdict = 'pass' | 'wrong' | 'time' | 'error' | 'skip' | 'wait';
interface Row { verdict: Verdict; seconds?: number; detail?: string; example?: number }
type Terminal =
  | { kind: 'idle' }
  | { kind: 'busy'; note: string }
  | { kind: 'run'; out: string; err: string | null; seconds: number; timedOut: boolean; example?: number; expected?: string }
  | { kind: 'grade'; rows: Row[]; score?: number; note?: string };

// 숨은 테스트의 입력(gen)과 정답 출력은 한 번 만들면 다시 쓴다.
const made = new Map<string, { input: string; expected: string }>();

async function prepare(problem: EliceProblem, index: number) {
  const key = `${problem.id}:${index}`;
  const hit = made.get(key);
  if (hit) return hit;
  const test = problem.tests[index];
  let input = (test.input ?? '') + '\n';
  if (test.gen) {
    const generated = await runPython(test.gen, '', 30000);
    if (generated.err || generated.timedOut) throw new Error('테스트 입력을 만들지 못했어요');
    input = generated.out;
  }
  const solved = await runPython(solutionOf(problem), input, 30000);
  if (solved.err || solved.timedOut) throw new Error('정답 출력을 만들지 못했어요');
  const ready = { input, expected: solved.out };
  made.set(key, ready);
  return ready;
}

function useRunner() {
  const [state, setState] = useState<RunnerState>(runnerState);
  useEffect(() => onRunnerState(setState), []);
  return state;
}

// ── 칸 크기 조절: 문제 | 코드, 코드 / 실행 결과 사이 막대를 끌거나 방향키로 ─────────────────────
const LAYOUT_KEY = 'johamin-elice-layout-v1';
interface Layout { left: number; editor: number }
const DEFAULT_LAYOUT: Layout = { left: 0.4, editor: 0.6 };
const clampLayout = (l: Layout): Layout => ({ left: Math.min(0.72, Math.max(0.18, l.left)), editor: Math.min(0.88, Math.max(0.15, l.editor)) });
function loadLayout(): Layout {
  try { const saved = JSON.parse(localStorage.getItem(LAYOUT_KEY) ?? 'null'); if (saved && typeof saved.left === 'number' && typeof saved.editor === 'number') return clampLayout(saved); } catch { /* default */ }
  return DEFAULT_LAYOUT;
}
const saveLayout = (l: Layout) => { try { localStorage.setItem(LAYOUT_KEY, JSON.stringify(l)); } catch { /* not saved */ } };

/** 끌 수 있는 칸 나눔 막대. axis='x'면 좌우, 'y'면 위아래. value는 0~1(앞 칸 비율). */
function Splitter({ axis, value, label, onChange, onDone, area }: { axis: 'x' | 'y'; value: number; label: string; onChange: (v: number) => void; onDone: () => void; area: () => DOMRect | undefined }) {
  const dragging = useRef(false);
  const at = (event: PointerEvent) => {
    const r = area();
    if (!r) return value;
    return axis === 'x' ? (event.clientX - r.left) / r.width : (event.clientY - r.top) / r.height;
  };
  return <div className={`elice-split is-${axis}`} role="separator" aria-orientation={axis === 'x' ? 'vertical' : 'horizontal'} aria-label={label}
    aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value * 100)} tabIndex={0} title={`${label} (끌기 · 방향키 · 두 번 눌러 처음대로)`}
    onPointerDown={event => { dragging.current = true; event.currentTarget.setPointerCapture(event.pointerId); event.preventDefault(); }}
    onPointerMove={event => { if (dragging.current) onChange(at(event.nativeEvent)); }}
    onPointerUp={() => { if (dragging.current) { dragging.current = false; onDone(); } }}
    onPointerCancel={() => { dragging.current = false; onDone(); }}
    onDoubleClick={() => { onChange(-1); onDone(); }}
    onKeyDown={event => {
      const step = event.shiftKey ? 0.1 : 0.03;
      const less = axis === 'x' ? 'ArrowLeft' : 'ArrowUp', more = axis === 'x' ? 'ArrowRight' : 'ArrowDown';
      if (event.key === less || event.key === more) { event.preventDefault(); onChange(value + (event.key === more ? step : -step)); onDone(); }
      else if (event.key === 'Home') { event.preventDefault(); onChange(-1); onDone(); }
    }}><span aria-hidden="true" /></div>;
}

function ProblemView({ problem, record, onRecord }: { problem: EliceProblem; record?: EliceRecord; onRecord: (all: Record<string, EliceRecord>) => void }) {
  const index = eliceProblems.indexOf(problem);
  const chapter = ELICE_CHAPTERS.find(c => c.id === problem.chapter)!;
  // 4.3.0 때 빈칸 코드로 저장된 것은 새 처음 코드(입력 부분만)로 바꾼다. 점수는 그대로.
  const [code, setCode] = useState(() => record?.code && !(record.code.includes('____') && !problem.blanks) ? record.code : problem.template);
  const [tab, setTab] = useState<'problem' | 'code'>('problem');
  const [stdinPick, setStdinPick] = useState<number | 'custom'>(0);
  const [custom, setCustom] = useState(problem.examples[0].input);
  const [terminal, setTerminal] = useState<Terminal>({ kind: 'idle' });
  const [busy, setBusy] = useState(false);
  const [party, setParty] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const editor = useRef<CodeEditorHandle>(null);
  const body = useRef<HTMLDivElement>(null);
  const ide = useRef<HTMLElement>(null);
  const [layout, setLayout] = useState<Layout>(loadLayout);
  const layoutRef = useRef(layout);
  layoutRef.current = layout;
  const resize = (key: keyof Layout) => (v: number) => setLayout(l => clampLayout({ ...l, [key]: v < 0 ? DEFAULT_LAYOUT[key] : v }));
  const keepLayout = () => saveLayout(layoutRef.current);
  const runner = useRunner();
  const solution = useMemo(() => solutionOf(problem), [problem]);
  const blanksLeft = (code.match(/____/g) ?? []).length;

  // Start Python as soon as a problem opens (first time downloads about 11 MB).
  useEffect(() => { startRunner().catch(() => { /* shown in the toolbar */ }); }, []);
  // Keep what the student typed on this device.
  useEffect(() => {
    const timer = window.setTimeout(() => onRecord(saveRecord(problem.id, { code })), 400);
    return () => window.clearTimeout(timer);
  }, [code, problem.id, onRecord]);

  const go = (offset: number) => {
    const next = eliceProblems[index + offset];
    if (!next) return;
    playTick();
    window.location.hash = next.id;
  };
  const toList = () => { playTick(); window.location.hash = ''; };

  const run = useCallback(async () => {
    if (busy) return;
    setBusy(true); setTab('code');
    const example = stdinPick === 'custom' ? undefined : stdinPick;
    const input = (example === undefined ? custom : problem.examples[example].input).replace(/\n*$/, '\n');
    setTerminal({ kind: 'busy', note: runnerState() === 'ready' ? '실행 중…' : '파이썬 준비 중… (처음 한 번 약 11MB)' });
    try {
      const result = await runPython(code, input, 10000);
      setTerminal({ kind: 'run', ...result, example, expected: example === undefined ? undefined : problem.examples[example].output });
    } catch {
      setTerminal({ kind: 'busy', note: '파이썬을 불러오지 못했어요. 인터넷을 확인하고 다시 눌러 주세요.' });
    } finally { setBusy(false); }
  }, [busy, stdinPick, custom, problem, code]);

  const submit = useCallback(async () => {
    if (busy) return;
    setBusy(true); setTab('code'); playTick();
    const rows: Row[] = problem.tests.map(test => ({ verdict: 'wait', example: (() => { const i = problem.examples.findIndex(ex => ex.input === test.input); return i < 0 ? undefined : i; })() }));
    const show = (note?: string, score?: number) => setTerminal({ kind: 'grade', rows: rows.map(row => ({ ...row })), note, score });
    show(runnerState() === 'ready' ? '채점 중…' : '파이썬 준비 중… (처음 한 번 약 11MB)');
    try {
      let stop = false;
      for (let i = 0; i < problem.tests.length; i += 1) {
        if (stop) { rows[i].verdict = 'skip'; continue; }
        show(`채점 중… ${i + 1} / ${problem.tests.length}`);
        const { input, expected } = await prepare(problem, i);
        const limit = problem.tests[i].limit ?? problem.limit ?? DEFAULT_LIMIT;
        const result = await runPython(code, input, limit * 1000 + GRACE_MS);
        rows[i].seconds = result.seconds;
        if (result.timedOut || result.seconds > limit) {
          rows[i].verdict = 'time';
          rows[i].detail = `${limit}초 안에 끝나지 않았어요`;
          if (result.timedOut) stop = true;
        } else if (result.err) {
          const clean = cleanTraceback(result.err);
          rows[i].verdict = 'error';
          rows[i].detail = [clean.split('\n').at(-1), explainError(clean)].filter(Boolean).join(' · ');
        } else rows[i].verdict = sameOutput(result.out, expected) ? 'pass' : 'wrong';
      }
      const passed = rows.filter(row => row.verdict === 'pass').length;
      const score = scoreOf(passed, rows.length);
      show(undefined, score);
      onRecord(saveRecord(problem.id, { code, last: score, at: Date.now() }));
      playResult(score === 100);
      if (score === 100) setParty(true);
    } catch {
      show('채점하지 못했어요. 인터넷을 확인하고 다시 제출해 주세요.');
    } finally { setBusy(false); }
  }, [busy, problem, code, onRecord]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') { event.preventDefault(); void (event.shiftKey ? submit() : run()); return; }
      if (isTyping(event)) return;
      if (event.key === 'Escape') { event.preventDefault(); toList(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [run, submit]);

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text).then(() => { setCopied(key); window.setTimeout(() => setCopied(null), 1200); }, () => { /* copy not allowed */ });
  };
  const reset = () => {
    if (code !== problem.template && !window.confirm('처음 코드로 되돌릴까요? 지금 쓴 코드는 사라져요.')) return;
    setCode(problem.template); setTerminal({ kind: 'idle' });
  };
  const nextBlank = () => { if (!editor.current?.nextBlank()) editor.current?.focus(); };

  return <div className={`elice-shell show-${tab}`} style={{ '--left': `${layout.left * 100}%`, '--editor': `${layout.editor * 100}%` } as CSSProperties}>
    {party && <Confetti onDone={() => setParty(false)} />}
    <header className="elice-top">
      <a className="elice-menu" href={window.location.pathname} onClick={event => { event.preventDefault(); toList(); }} aria-label="문제 목록 (Esc)" title="문제 목록 (Esc)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
      </a>
      <p className="elice-crumb"><span>{chapter.name}</span><b aria-hidden="true">›</b><strong>{problem.title}</strong></p>
      {problem.must && <em className="elice-must">수행 출제</em>}
      <nav className="elice-pager" aria-label="문제 넘기기">
        <button type="button" onClick={() => go(-1)} disabled={index === 0} aria-label="이전 문제" title="이전 문제">‹</button>
        <span className="elice-count"><b>{index + 1}</b> / {eliceProblems.length}</span>
        <button type="button" className="elice-next" onClick={() => go(1)} disabled={index === eliceProblems.length - 1} aria-label="다음 문제" title="다음 문제">›</button>
      </nav>
      <div className="elice-switch" role="tablist" aria-label="보기">
        <button type="button" role="tab" aria-selected={tab === 'problem'} onClick={() => setTab('problem')}>문제</button>
        <button type="button" role="tab" aria-selected={tab === 'code'} onClick={() => setTab('code')}>코드{blanksLeft > 0 && <span className="elice-switch-count">{blanksLeft}</span>}</button>
      </div>
    </header>

    <div className="elice-body" ref={body}>
      <article className="elice-problem" aria-label="문제">
        <h2>문제</h2>
        {problem.statement.map((text, i) => <p key={i}>{rich(text)}</p>)}
        <h2>입력 형식</h2>
        <ul>{problem.input.map((text, i) => <li key={i}>{rich(text)}</li>)}</ul>
        <h2>출력 형식</h2>
        <ul>{problem.output.map((text, i) => <li key={i}>{rich(text)}</li>)}</ul>
        <h2>입출력 예제</h2>
        {problem.examples.map((example, i) => <div key={i} className="elice-example">
          <h3>입력{i + 1}:</h3>
          <div className="elice-io"><button type="button" className="elice-copy" onClick={() => copy(example.input, `in${i}`)}>{copied === `in${i}` ? '복사됨' : 'Copy'}</button><pre>{example.input}</pre></div>
          <h3>출력{i + 1}:</h3>
          <div className="elice-io"><button type="button" className="elice-copy" onClick={() => copy(example.output, `out${i}`)}>{copied === `out${i}` ? '복사됨' : 'Copy'}</button><pre>{example.output}</pre></div>
        </div>)}
        <p className="elice-limits">시간 제한 {problem.limit ?? DEFAULT_LIMIT}초{problem.tests.some(t => t.limit) && ' (큰 테스트는 더 길게)'} · 숨은 테스트 {problem.tests.length}개</p>
        {problem.tips?.length ? <details className="elice-tips" open={problem.must}>
          <summary>💡 도움말</summary>
          <ul>{problem.tips.map((tip, i) => <li key={i}>{rich(tip)}</li>)}</ul>
        </details> : null}
        <details className="elice-answer">
          <summary>정답 코드 보기</summary>
          {problem.blanks && <p className="elice-answer-blanks">{problem.blanks.map((blank, i) => <span key={i}><b>{'①②③④⑤⑥⑦⑧⑨'[i]}</b> <code>{blank}</code></span>)}</p>}
          <pre className="elice-answer-code">{highlight(solution)}</pre>
        </details>
        <p className="elice-source">근거: {problem.source}</p>
      </article>
      <Splitter axis="x" value={layout.left} label="문제 칸 너비" onChange={resize('left')} onDone={keepLayout} area={() => body.current?.getBoundingClientRect()} />

      <section className="elice-ide" aria-label="코드" ref={ide}>
        <div className="elice-code-area">
        <div className="elice-filetab">
          <span className="elice-file"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></svg>main.py</span>
          <span className="elice-filetab-gap" />
          {problem.blanks && <button type="button" className="elice-tool" onClick={nextBlank} disabled={!blanksLeft} title="다음 빈칸 고르기 (빈칸을 고른 채 Tab)">다음 빈칸{blanksLeft > 0 && ` · ${blanksLeft}`}</button>}
          <button type="button" className="elice-tool" onClick={reset}>초기화</button>
        </div>
        <CodeEditor ref={editor} value={code} onChange={setCode} label="main.py 코드" onShortcut={kind => void (kind === 'submit' ? submit() : run())} />
        </div>
        <Splitter axis="y" value={layout.editor} label="코드 칸 높이" onChange={resize('editor')} onDone={keepLayout} area={() => ide.current?.getBoundingClientRect()} />
        <div className="elice-run-area">
        <div className="elice-toolbar">
          <button type="button" className="elice-run" onClick={() => void run()} disabled={busy} title="실행 (Ctrl+Enter)">실행</button>
          <button type="button" className="elice-submit" onClick={() => void submit()} disabled={busy} title="제출 (Ctrl+Shift+Enter)">제출</button>
          <div className="elice-stat"><small>최종 제출 점수</small><b>{record?.last === undefined ? '-' : `${record.last} 점`}</b></div>
          <div className="elice-stat"><small>최종 제출 시간</small><b>{when(record?.at)}</b></div>
          <span className={`elice-python is-${runner}`} role="status">{runner === 'ready' ? '파이썬 준비됨' : runner === 'loading' ? '파이썬 준비 중…' : runner === 'failed' ? <button type="button" onClick={() => startRunner().catch(() => undefined)}>파이썬 다시 불러오기</button> : ''}</span>
        </div>
        <div className="elice-stdin-pick" role="radiogroup" aria-label="실행할 때 넣을 입력">
          <span>실행 입력</span>
          {problem.examples.map((_, i) => <button key={i} type="button" role="radio" aria-checked={stdinPick === i} onClick={() => setStdinPick(i)}>예제 {i + 1}</button>)}
          <button type="button" role="radio" aria-checked={stdinPick === 'custom'} onClick={() => setStdinPick('custom')}>직접 입력</button>
        </div>
        {stdinPick === 'custom' && <textarea className="elice-stdin" value={custom} onChange={event => setCustom(event.target.value)} aria-label="직접 넣을 입력" spellCheck={false} />}
        <TerminalView terminal={terminal} />
        </div>
      </section>
    </div>
  </div>;
}

const VERDICT: Record<Verdict, { mark: string; text: string }> = {
  pass: { mark: '✔', text: '정답' }, wrong: { mark: '✘', text: '오답' }, time: { mark: '⏱', text: '시간 초과' },
  error: { mark: '⚠', text: '오류' }, skip: { mark: '·', text: '건너뜀' }, wait: { mark: '…', text: '대기' },
};

function TerminalView({ terminal }: { terminal: Terminal }) {
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => { body.current?.scrollTo({ top: 0 }); }, [terminal.kind]);
  let content: ReactNode;
  if (terminal.kind === 'idle') content = <p className="term-idle">/* 코드가 아직 실행되지 않았습니다. */</p>;
  else if (terminal.kind === 'busy') content = <p className="term-note">{terminal.note}</p>;
  else if (terminal.kind === 'run') {
    const clean = terminal.err ? cleanTraceback(terminal.err) : '';
    const why = clean ? explainError(clean) : '';
    const shown = terminal.out.length > 20000 ? terminal.out.slice(0, 20000) + '\n… (너무 길어서 줄였어요)' : terminal.out;
    content = <>
      {terminal.timedOut ? <p className="term-bad">⏱ 10초 안에 끝나지 않아서 멈췄어요. 무한 루프가 아닌지 확인해요.</p> : <>
        {shown ? <pre className="term-out">{shown}</pre> : !clean && <p className="term-note">(출력 없음)</p>}
        {clean && <pre className="term-err">{clean}</pre>}
        {why && <p className="term-bad">{why}</p>}
        {terminal.example !== undefined && !clean && (sameOutput(terminal.out, terminal.expected ?? '')
          ? <p className="term-good">✔ 예제 {terminal.example + 1}의 출력과 같아요. 제출해서 숨은 테스트도 확인해요.</p>
          : <div className="term-diff"><p className="term-bad">✘ 예제 {terminal.example + 1}의 출력과 달라요.</p><p>기대한 출력</p><pre>{normalizeOutput(terminal.expected ?? '')}</pre></div>)}
        {!terminal.timedOut && <p className="term-time">실행 시간 {terminal.seconds.toFixed(3)}초</p>}
      </>}
    </>;
  } else {
    content = <>
      {terminal.score !== undefined && <p className={`term-score${terminal.score === 100 ? ' is-full' : ''}`}><b>{terminal.score}</b> / 100 점{terminal.score === 100 ? ' · 모두 정답!' : ''}</p>}
      {terminal.note && <p className="term-note">{terminal.note}</p>}
      <ol className="term-tests">{terminal.rows.map((row, i) => <li key={i} className={`is-${row.verdict}`}>
        <span className="term-test-name">테스트 {i + 1}{row.example !== undefined && <small> (예제 {row.example + 1})</small>}</span>
        <span className="term-verdict">{VERDICT[row.verdict].mark} {VERDICT[row.verdict].text}</span>
        {row.seconds !== undefined && row.verdict !== 'time' && <span className="term-sec">{row.seconds.toFixed(3)}초</span>}
        {row.detail && <span className="term-detail">{row.detail}</span>}
      </li>)}</ol>
    </>;
  }
  return <div className="elice-terminal" ref={body} aria-live="polite">{content}</div>;
}
