// 화면 쪽 파이썬 실행기: public/py-worker.js를 띄우고, 코드 한 번 실행을 Promise로 돌려준다.
// 시간이 넘으면 워커를 끝내고(무한 루프도 멈춘다) 다음 실행 때 새로 띄운다.
import { PYODIDE_URL } from './elice';

export interface RunResult { out: string; err: string | null; seconds: number; timedOut: boolean }
export type RunnerState = 'idle' | 'loading' | 'ready' | 'failed';

type Pending = { resolve: (result: RunResult) => void; timer: number };

let worker: Worker | null = null;
let ready: Promise<void> | null = null;
let state: RunnerState = 'idle';
let nextId = 1;
const pending = new Map<number, Pending>();
const listeners = new Set<(state: RunnerState) => void>();

const setState = (next: RunnerState) => { state = next; listeners.forEach(listener => listener(next)); };
export const runnerState = () => state;
export function onRunnerState(listener: (state: RunnerState) => void) { listeners.add(listener); return () => { listeners.delete(listener); }; }

/** 워커를 띄우고 파이썬을 준비한다(이미 준비됐으면 바로 끝난다). */
export function startRunner(): Promise<void> {
  if (ready) return ready;
  setState('loading');
  const created = new Worker(`${import.meta.env.BASE_URL}py-worker.js`);
  worker = created;
  ready = new Promise<void>((resolve, reject) => {
    created.onmessage = event => {
      const data = event.data;
      if (data?.type === 'ready') { setState('ready'); resolve(); }
      else if (data?.type === 'fail') { stop(); setState('failed'); reject(new Error(data.message)); }
      else if (data?.type === 'result') {
        const job = pending.get(data.id);
        if (!job) return;
        pending.delete(data.id);
        clearTimeout(job.timer);
        job.resolve({ out: String(data.out ?? ''), err: data.err ? String(data.err) : null, seconds: Number(data.seconds) || 0, timedOut: false });
      }
    };
    created.onerror = () => { stop(); setState('failed'); reject(new Error('파이썬을 불러오지 못했어요')); };
  });
  created.postMessage({ type: 'init', url: PYODIDE_URL });
  ready.catch(() => { /* reported through the state */ });
  return ready;
}

function stop() {
  worker?.terminate();
  worker = null;
  ready = null;
  for (const [id, job] of pending) { clearTimeout(job.timer); job.resolve({ out: '', err: null, seconds: 0, timedOut: true }); pending.delete(id); }
}

/** 코드를 한 번 돌린다. timeoutMs가 지나면 워커를 끝내고 timedOut으로 돌려준다. */
export async function runPython(code: string, input: string, timeoutMs: number): Promise<RunResult> {
  await startRunner();
  const id = nextId++;
  const current = worker!;
  return new Promise<RunResult>(resolve => {
    const timer = window.setTimeout(() => {
      pending.delete(id);
      resolve({ out: '', err: null, seconds: timeoutMs / 1000, timedOut: true });
      if (worker === current) { stop(); setState('idle'); }
    }, timeoutMs);
    pending.set(id, { resolve, timer });
    current.postMessage({ type: 'run', id, code, input });
  });
}
