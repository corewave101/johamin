// 정보 코딩 연습장의 순수 로직: 빈칸, 출력 비교, 기기에 남기는 코드 · 점수.

/** 브라우저 안 파이썬. 처음 한 번 내려받고(약 11MB) 서비스 워커가 기기에 남긴다(public/sw.js). */
export const PYODIDE_URL = 'https://cdn.jsdelivr.net/npm/pyodide@0.29.4/';

export const blankCount = (code: string) => (code.match(/____/g) ?? []).length;

/** ____를 차례대로 채운다. */
export function fillBlanks(template: string, answers: string[]): string {
  let index = 0;
  return template.replace(/____/g, () => answers[index++] ?? '____');
}

/** 줄 끝 공백과 마지막 빈 줄은 무시한다(엘리스 채점과 같은 정도). */
export const normalizeOutput = (text: string) => text.replace(/\r\n?/g, '\n').split('\n').map(line => line.replace(/\s+$/, '')).join('\n').replace(/\n+$/, '');
export const sameOutput = (a: string, b: string) => normalizeOutput(a) === normalizeOutput(b);

/** 파이썬 오류에서 연습장 내부 줄은 빼고 main.py 줄만 남긴다. */
export function cleanTraceback(text: string): string {
  const lines = text.replace(/\n+$/, '').split('\n');
  const out: string[] = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^\s+File "(?!main\.py)/.test(line)) {
      // skip the frame line and its source line (if any)
      if (i + 1 < lines.length && /^\s{4}\S/.test(lines[i + 1]) && !/^\s+File /.test(lines[i + 1])) i += 1;
      continue;
    }
    out.push(line);
  }
  return out.join('\n');
}

/** 오류 마지막 줄을 쉬운 말로. */
export function explainError(text: string): string {
  const last = text.trim().split('\n').at(-1) ?? '';
  if (/^NameError: name '____'/.test(last) || /^SyntaxError/.test(last) && text.includes('____')) return '아직 채우지 않은 빈칸(____)이 있어요.';
  if (/^SyntaxError|^IndentationError/.test(last)) return '문법 오류예요. 괄호 · 콜론(:) · 들여쓰기를 확인해요.';
  if (/^NameError/.test(last)) return '정의되지 않은 이름을 썼어요. 철자를 확인해요.';
  if (/^IndexError/.test(last)) return '리스트 범위를 벗어났어요.';
  if (/^KeyError/.test(last)) return '딕셔너리에 없는 키를 찾았어요.';
  if (/^ZeroDivisionError/.test(last)) return '0으로 나눴어요.';
  if (/^RecursionError/.test(last)) return '재귀가 너무 깊어요.';
  if (/^EOFError/.test(last)) return '입력을 더 읽으려 했는데 입력이 끝났어요.';
  if (/^TypeError/.test(last)) return '자료형이 맞지 않아요.';
  if (/^ValueError/.test(last)) return '값을 바꾸지 못했어요(예: 글자를 int로).';
  if (/^AttributeError/.test(last)) return '그런 함수(메서드)가 없어요.';
  return '';
}

// ── 기기에 남기는 값: 문제마다 내가 쓴 코드와 최고 점수 ──
export interface EliceRecord { code?: string; best?: number; last?: number; at?: number }
const KEY = 'johamin-elice-v1';

export function loadRecords(): Record<string, EliceRecord> {
  try {
    const raw = localStorage.getItem(KEY);
    const data = raw ? JSON.parse(raw) : {};
    return data && typeof data === 'object' ? data : {};
  } catch { return {}; }
}

export function saveRecord(id: string, patch: EliceRecord): Record<string, EliceRecord> {
  const all = loadRecords();
  const next = { ...all[id], ...patch };
  if (patch.last !== undefined) next.best = Math.max(next.best ?? 0, patch.last);
  all[id] = next;
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* private mode: keeps working without saving */ }
  return all;
}

/** 점수: 맞힌 테스트 비율(0 ~ 100, 정수). */
export const scoreOf = (passed: number, total: number) => total ? Math.round(passed / total * 100) : 0;
