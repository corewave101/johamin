// 정보(엘리스 수행) 코딩 연습장: 문제 규격, 빈칸 수, 정답 코드를 python3로 실제로 돌려 예제 출력과 같은지 확인한다.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');
const ts = require('typescript');
require.extensions['.ts'] = (m, f) => m._compile(ts.transpileModule(fs.readFileSync(f, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText, f);
const { eliceProblems: problems, ELICE_CHAPTERS, BLANK, solutionOf } = require('../data/elice-problems.ts');
const { normalizeOutput, sameOutput, fillBlanks, blankCount } = require('../lib/elice.ts');

const python = ['python3', 'python'].find(cmd => spawnSync(cmd, ['--version']).status === 0);
assert.ok(python, 'python3가 있어야 정답 코드를 확인할 수 있어요');
const run = (code, input, timeout = 20000) => {
  const r = spawnSync(python, ['-I', '-c', code], { input, encoding: 'utf8', timeout });
  return { out: r.stdout ?? '', err: r.stderr ?? '', status: r.status, timedOut: r.error?.code === 'ETIMEDOUT' };
};

assert.ok(problems.length >= 26, `${problems.length} problems`);
assert.equal(new Set(problems.map(p => p.id)).size, problems.length);
// id는 기록(코드 · 점수)이 붙는 이름이라 바꾸지 않는다. 자리를 옮겨도 id는 그대로(4.5.1: 최단 거리 info-09가 필수, 미로 info-03은 6장).
assert.ok(problems.every(p => /^info-\d{2}$/.test(p.id)), 'id 모양');
assert.deepEqual(problems.map(p => p.id).sort(), problems.map((_, i) => `info-${String(i + 1).padStart(2, '0')}`), '빠진 번호 없이');
assert.equal(problems.find(p => p.id === 'info-03').title, '미로 최단 거리 (격자 BFS)');
assert.equal(problems.find(p => p.id === 'info-09').title, '최단 거리 (BFS)');
const must = problems.filter(p => p.must);
assert.deepEqual(problems.filter(p => p.blanks).map(p => p.id), ['info-01'], '빈칸 문제는 DFS(스택) 하나');
assert.deepEqual(must.map(p => p.title), ['DFS 방문 순서 (스택)', '덩어리 개수 세기', '최단 거리 (BFS)', '두 개의 카드', '도서관 책 찾기', '리본 자르기']);
assert.ok(must.every(p => p.chapter === 'must'));
const chapterIds = ELICE_CHAPTERS.map(c => c.id);
for (const c of chapterIds) assert.ok(problems.some(p => p.chapter === c), c);

let verified = 0;
for (const p of problems) {
  assert.ok(chapterIds.includes(p.chapter), p.id);
  assert.ok(p.title && p.statement.length && p.input.length && p.output.length && p.examples.length && p.source, p.id);
  assert.ok(!solutionOf(p).includes(BLANK), p.id);
  if (p.blanks) {
    // 빈칸 문제(4.3.1~ DFS 스택 하나): ____ 개수 = 정답 개수, 그 밖의 밑줄 5개 이상 금지, 채우면 정답 코드.
    assert.equal(blankCount(p.template), p.blanks.length, `${p.id} blanks`);
    assert.ok(p.blanks.length >= 2 && p.blanks.every(b => b && !b.includes(BLANK)), p.id);
    assert.ok(!/_{5,}/.test(p.template), `${p.id}: only ____ blanks`);
    assert.equal(fillBlanks(p.template, p.blanks), solutionOf(p));
  } else {
    // 나머지: 처음 코드는 입력 받는 줄만. 빈칸 없음, 모든 줄이 input()을 쓰거나 입력 받기(그래프 · 반복) 줄이다.
    assert.equal(blankCount(p.template), 0, `${p.id}: no blanks`);
    assert.ok(p.template.includes('input()'), `${p.id}: reads input`);
    assert.ok(p.template.split('\n').length <= 7, `${p.id}: input lines only`);
    assert.ok(!/\bprint\(|\bdef |\bimport /.test(p.template), `${p.id}: no answer code in the starter`);
    // 입력 받는 줄은 정답 코드에도 그대로 있다(15번 명단 확인만 리스트 → 집합으로 바꾸는 게 문제라 예외).
    if (p.id !== 'info-15') for (const line of p.template.split('\n').filter(l => l.includes('input()'))) assert.ok(solutionOf(p).includes(line.replace(/\s+#.*$/, '')), `${p.id}: ${line}`);
  }
  // 카드 한 장만 보고 풀 수 있게: 문제 안에서 다른 자료를 가리키지 않는다.
  assert.ok(!/(위 그림|학습지에서|앞 문제|위 자료)/.test(p.statement.join(' ')), p.id);
  assert.ok(p.tests.length >= 4, `${p.id} tests`);
  assert.ok(p.tests.every(t => (t.input === undefined) !== (t.gen === undefined)), `${p.id} input xor gen`);
  // 예제는 숨은 테스트에도 들어 있다(예제를 맞히고 제출하면 적어도 그 점수는 받는다).
  for (const ex of p.examples) assert.ok(p.tests.some(t => t.input === ex.input), `${p.id} example in tests`);

  const solution = solutionOf(p);
  for (const [i, ex] of p.examples.entries()) {
    const r = run(solution, ex.input + '\n');
    assert.equal(r.err, '', `${p.id} example ${i + 1}: ${r.err}`);
    assert.ok(sameOutput(r.out, ex.output), `${p.id} example ${i + 1}: got ${JSON.stringify(normalizeOutput(r.out))}`);
    verified += 1;
  }
  // 숨은 테스트: 정답 코드가 오류 없이 출력을 낸다(큰 입력은 gen으로 만든다).
  for (const [i, t] of p.tests.entries()) {
    const input = t.gen ? run(t.gen, '').out : t.input + '\n';
    assert.ok(input.trim(), `${p.id} test ${i + 1} input`);
    const r = run(solution, input);
    assert.equal(r.status, 0, `${p.id} test ${i + 1}: ${r.err}`);
    assert.ok(r.out.trim(), `${p.id} test ${i + 1} output`);
  }
  // 처음 코드 그대로 내면 틀린다. 입력만 받는 코드는 예제 입력으로 오류 없이 돌아간다(입력 형식이 맞는지).
  const blank = run(p.template, p.examples[0].input + '\n');
  assert.ok(blank.status !== 0 || !sameOutput(blank.out, p.examples[0].output), `${p.id}: unfilled template must fail`);
  if (!p.blanks) for (const ex of p.examples) assert.equal(run(p.template, ex.input + '\n').status, 0, `${p.id}: starter reads the input`);
}

// 자료 코드의 함정이 숨은 테스트로 걸러지는지: 미로를 pop()으로 풀면 틀리는 테스트가 있다.
const maze = problems.find(p => p.id === 'info-03');
const popVersion = solutionOf(maze).replace('queue.popleft()', 'queue.pop()');
const trapped = maze.tests.filter(t => t.input).some(t => run(popVersion, t.input + '\n').out.trim() !== run(solutionOf(maze), t.input + '\n').out.trim());
assert.ok(trapped, 'maze: pop() 버전을 잡는 테스트');
// 두 수의 합: range(i, n) 버전을 잡는 테스트
const twoSum = problems.find(p => p.id === 'info-19');
const selfPair = solutionOf(twoSum).replace('range(i + 1, n)', 'range(i, n)');
assert.ok(twoSum.tests.some(t => run(selfPair, t.input + '\n').out.trim() !== run(solutionOf(twoSum), t.input + '\n').out.trim()), 'two_sum: range(i, n)');
// 이진탐색: while low < high 버전을 잡는 테스트
const bs = problems.find(p => p.id === 'info-23');
const lessThan = solutionOf(bs).replace('while low <= high', 'while low < high');
assert.ok(bs.tests.filter(t => t.input).some(t => run(lessThan, t.input + '\n').out.trim() !== run(solutionOf(bs), t.input + '\n').out.trim()), 'binary search: <');

// 출력 비교: 줄 끝 공백과 마지막 빈 줄은 무시, 나머지는 그대로.
assert.ok(sameOutput('1 2 \n3\n\n', '1 2\n3'));
assert.ok(!sameOutput('1 2', '1  2'));
assert.ok(!sameOutput('Yes', 'yes'));

// 화면: 카드 묶음(data/)은 정보 페이지 파일만 불러온다. 처음 뜨는 화면은 data/를 직접 import하지 않는다.
const main = fs.readFileSync('app/main.tsx', 'utf8');
assert.ok(/isElice \? import\('\.\.\/components\/swipe\/EliceStudio'\)/.test(main), 'main.tsx: /elice/는 EliceStudio');
// 4.5.2: 가호 · 업데이트 확인 · 소리 · 버전은 정보 페이지에서 위쪽 막대(.elice-dock)에 모이고, 세 칸은 막대로 크기를 바꾼다.
assert.ok(main.includes('<div className="elice-dock"><BlessingToggle /><AppStatus /><SoundToggle /><UpdateLog'), 'elice dock');
const studio = fs.readFileSync('components/swipe/EliceStudio.tsx', 'utf8');
assert.ok(studio.includes("const LAYOUT_KEY = 'johamin-elice-layout-v1';") && (studio.match(/<Splitter /g) ?? []).length === 2, '칸 나눔 막대 2개');
const worker = fs.readFileSync('public/py-worker.js', 'utf8');
const { PYODIDE_URL } = require('../lib/elice.ts');
assert.ok(/^https:\/\/cdn\.jsdelivr\.net\/npm\/pyodide@\d+\.\d+\.\d+\/$/.test(PYODIDE_URL), PYODIDE_URL);
assert.ok(worker.includes('importScripts') && worker.includes('indexURL'), 'worker loads Pyodide');
const sw = fs.readFileSync('public/sw.js', 'utf8');
assert.ok(sw.includes('/npm/pyodide@'), 'service worker keeps Pyodide for offline use');

console.log(`PASS: 정보 코딩 연습장 ${problems.length}문제(필수 ${must.length}) · 예제 ${verified}개를 정답 코드로 실행해 확인 · 자료 함정(pop · range(i, n) · <) 테스트`);
