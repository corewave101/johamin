// 정보(엘리스 코딩 수행평가) 대비 · /johamin/elice/ 코딩 연습장 문제.
// 카드가 아니라 엘리스처럼 '문제 + main.py 편집기 + 실행 · 제출 채점'으로 푼다(components/swipe/EliceStudio.tsx).
// 4.3.1~: DFS(스택) 한 문제만 빈칸(____) 채우기이고, 나머지는 입력 받는 코드만 주어지고 나머지를 직접 짠다.
// 제출하면 브라우저 안 파이썬(Pyodide)이 숨은 테스트로 채점한다. 숨은 테스트의 정답 출력은 채점할 때 solution을 돌려 만든다.
// 근거: 정보 수업 자료 「6. DFS와 BFS」 「7. 시간 복잡도 · 완전탐색 · 이진탐색」 노트북, 엘리스 수행 화면(두 개의 카드 · 도서관 책 찾기 · 리본 자르기).
// 5.3.0~: 3차 수행 목록(선택 · 삽입 정렬, 주식왕, 점프, 1로 만들기, 배낭 채우기)과 「8. 정렬 알고리즘」 「9. 탐욕법과 동적계획법」 노트북. 3차 문제 원문은 아직 없어서 목록 이름과 수업 자료로 만들었다.

export type EliceChapterId = 'must3' | 'sort' | 'dp' | 'must' | 'graph' | 'time' | 'brute' | 'binary';

export interface EliceTest {
  /** 표준 입력 그대로. */
  input?: string;
  /** 입력을 print로 만들어 내는 파이썬 코드(큰 입력용). 정해진 seed를 써서 매번 같은 입력이 나온다. */
  gen?: string;
  /** 이 테스트의 시간 제한(초). 없으면 문제의 limit. */
  limit?: number;
}

export interface EliceProblem {
  id: string;
  chapter: EliceChapterId;
  title: string;
  /** 수행평가에 나온다고 한 문제(2차 · 3차 수행 목록). */
  must?: boolean;
  /** 문제 설명 문단. `코드`는 고정폭 글씨로 보인다. */
  statement: string[];
  input: string[];
  output: string[];
  examples: { input: string; output: string }[];
  /** main.py 처음 코드: 빈칸 문제는 ____(밑줄 4개)가 있는 코드, 나머지는 입력 받는 코드만. */
  template: string;
  /** 빈칸 문제만: 빈칸 정답(나오는 순서대로). template을 이것으로 채우면 solution이 된다. */
  blanks?: string[];
  /** 정답 코드(정답 코드 보기 · 숨은 테스트의 정답 출력). */
  solution: string;
  tests: EliceTest[];
  /** 시간 제한(초). 기본 3초. */
  limit?: number;
  /** 💡 도움말(자료 코드와 다른 점, 흔한 실수). */
  tips?: string[];
  source: string;
}

export const BLANK = '____';

export const ELICE_CHAPTERS: { id: EliceChapterId; name: string; note: string }[] = [
  { id: 'must3', name: '3차 수행평가', note: '선택 · 삽입 정렬, 주식왕, 점프, 1로 만들기, 배낭 채우기' },
  { id: 'sort', name: '8. 정렬', note: '버블 · 삽입 · 병합 합치기' },
  { id: 'dp', name: '9. 탐욕법 · 동적계획법', note: '거스름돈, 강당 예약, 동전 DP, 주식 · 점프 · 계단 응용' },
  { id: 'must', name: '2차 수행평가 6문제', note: '꼭 나온다던 6문제 · 엘리스 화면 그대로' },
  { id: 'graph', name: '6. DFS와 BFS', note: '스택 · 큐 · visited, 덩어리, 최단 거리, 격자' },
  { id: 'time', name: '7. 시간 복잡도', note: '최고차항, 역산표, 숨은 O(n)' },
  { id: 'brute', name: '7. 완전탐색', note: '모든 경우 다 해 보기' },
  { id: 'binary', name: '7. 이진탐색', note: '정렬 · 절반 버리기 · 답을 이진탐색' },
];

/** Leading newline off, so the code starts on line 1. */
const py = (strings: TemplateStringsArray) => strings.raw.join('').replace(/^\n/, '');

/** 정점 이름과 이웃 줄을 그래프 입력으로. */
const graphLines = (rows: string[]) => rows.join('\n');
const MATERIAL_GRAPH = ['A B C', 'B A D', 'C A D', 'D B C E', 'E D', 'F G', 'G F'];
const MATERIAL_GRAPH2 = [...MATERIAL_GRAPH, 'H I', 'I H'];
const BIG_GRAPH = ['A B E', 'B A C F', 'C B D G', 'D C H', 'E A F I', 'F B E G J', 'G C F H K', 'H D G L', 'I E J', 'J F I K', 'K G J L', 'L H K'];
const TREE = ['A B C D', 'B A E F', 'C A G', 'D A', 'E B', 'F B H', 'G C', 'H F'];
const CYCLE = ['A B F', 'B A C', 'C B D', 'D C E', 'E D F', 'F E A'];
const SCATTER = ['A', 'B C', 'C B', 'D', 'E F G', 'F E', 'G E', 'H', 'J K', 'K J L', 'L K'];

const MATERIAL_MAZE = ['5 5', '0 0 1 0 0', '1 0 1 0 1', '0 0 0 0 0', '0 1 1 1 0', '0 0 0 1 0'];

export const eliceProblems: EliceProblem[] = [
  // ───────────── 3차 수행평가 (5.3.0~) ─────────────
  {
    id: 'info-27', chapter: 'must3', must: true, title: '선택 정렬 구현',
    statement: [
      'N개의 정수를 **선택 정렬**로 오름차순 정렬하려고 한다. 선택 정렬은 남은 수 중 가장 작은 수를 골라(선택) 남은 구간의 맨 앞 수와 바꾸는 일을 반복한다.',
      '정렬이 제대로 되는지 확인하려고, **한 바퀴(최솟값을 찾아 한 번 바꾸기)가 끝날 때마다** 리스트 전체를 출력한다. `sort()`나 `sorted()`는 쓰지 않는다.',
    ],
    input: ['첫째 줄에 수의 개수 `N`이 주어진다. (2 ≤ N ≤ 100)', '둘째 줄에 정수 `N`개가 공백으로 구분되어 주어진다. (−1,000 ≤ 정수 ≤ 1,000)'],
    output: ['`N − 1`줄에 걸쳐, 바퀴가 끝날 때마다 리스트의 수를 공백으로 구분해 출력한다.', '최솟값이 이미 맨 앞에 있어 바뀌지 않은 바퀴도 그대로 출력한다.'],
    examples: [
      { input: '6\n5 3 8 1 9 2', output: '1 3 8 5 9 2\n1 2 8 5 9 3\n1 2 3 5 9 8\n1 2 3 5 9 8\n1 2 3 5 8 9' },
      { input: '3\n3 2 1', output: '1 2 3\n1 2 3' },
    ],
    template: py`
n = int(input())
arr = list(map(int, input().split()))
`,
    solution: py`
n = int(input())
arr = list(map(int, input().split()))

for i in range(n - 1):
    min_idx = i                        # 일단 i번이 제일 작다고 치고
    for j in range(i + 1, n):          # 뒤를 다 훑어서
        if arr[j] < arr[min_idx]:      # 더 작은 게 있으면
            min_idx = j                # 위치만 기억
    arr[i], arr[min_idx] = arr[min_idx], arr[i]    # 한 바퀴에 딱 한 번 바꾼다
    print(*arr)
`,
    tests: [
      { input: '6\n5 3 8 1 9 2' }, { input: '3\n3 2 1' }, { input: '2\n1 2' }, { input: '5\n1 2 3 4 5' },
      { input: '5\n4 1 3 1 2' }, { input: '6\n-3 7 0 -8 7 2' }, { input: '4\n9 9 9 9' },
      { gen: py`
import random
random.seed(27)
n = 100
print(n)
print(*[random.randint(-1000, 1000) for _ in range(n)])
` },
    ],
    tips: [
      '바퀴마다 `print(*arr)` 한 줄. 바깥 `for i` 안, 안쪽 `for j`가 끝난 뒤에 출력해요.',
      '흔한 실수: 더 작은 수를 볼 때마다 바로 바꾸기. 결과는 정렬돼도 중간 모습이 달라져서 틀려요. 위치(`min_idx`)만 기억했다가 마지막에 한 번 바꿔요.',
      '실제 수행에서 정렬 결과만 묻는다면 마지막 줄만 출력하면 돼요. 바깥 반복이 `n − 1`바퀴인 이유: 마지막 하나는 저절로 제자리예요.',
    ],
    source: '3차 수행 목록 · 8. 정렬 알고리즘 「2. 선택 정렬」',
  },
  {
    id: 'info-28', chapter: 'must3', must: true, title: '삽입 정렬 구현',
    statement: [
      'N개의 정수를 **삽입 정렬**로 오름차순 정렬하려고 한다. 삽입 정렬은 카드를 정리하듯, 앞쪽의 이미 정렬된 부분에 다음 수를 꺼내 자기 자리에 끼워 넣는다.',
      '두 번째 수부터 **한 개를 끼워 넣을 때마다** 리스트 전체를 출력한다. `sort()`나 `sorted()`는 쓰지 않는다.',
    ],
    input: ['첫째 줄에 수의 개수 `N`이 주어진다. (2 ≤ N ≤ 100)', '둘째 줄에 정수 `N`개가 공백으로 구분되어 주어진다. (−1,000 ≤ 정수 ≤ 1,000)'],
    output: ['`N − 1`줄에 걸쳐, 수 하나를 끼워 넣을 때마다 리스트의 수를 공백으로 구분해 출력한다.', '이미 제자리라 움직이지 않은 경우도 그대로 출력한다.'],
    examples: [
      { input: '6\n5 3 8 1 9 2', output: '3 5 8 1 9 2\n3 5 8 1 9 2\n1 3 5 8 9 2\n1 3 5 8 9 2\n1 2 3 5 8 9' },
      { input: '4\n4 3 2 1', output: '3 4 2 1\n2 3 4 1\n1 2 3 4' },
    ],
    template: py`
n = int(input())
arr = list(map(int, input().split()))
`,
    solution: py`
n = int(input())
arr = list(map(int, input().split()))

for i in range(1, n):                      # 1번부터 한 개씩 꺼내서
    j = i
    while j > 0 and arr[j - 1] > arr[j]:   # 왼쪽이 더 크면
        arr[j - 1], arr[j] = arr[j], arr[j - 1]    # 한 칸 앞으로
        j -= 1
    print(*arr)
`,
    tests: [
      { input: '6\n5 3 8 1 9 2' }, { input: '4\n4 3 2 1' }, { input: '2\n2 1' }, { input: '5\n1 2 3 4 5' },
      { input: '6\n3 1 3 1 2 2' }, { input: '5\n0 -5 10 -5 3' }, { input: '7\n1 2 3 4 5 7 6' },
      { gen: py`
import random
random.seed(28)
n = 100
print(n)
print(*[random.randint(-1000, 1000) for _ in range(n)])
` },
    ],
    tips: [
      '`while` 조건의 순서가 중요해요: `j > 0`을 먼저 봐야 `arr[-1]`(맨 뒤 수)과 비교하는 실수를 막아요.',
      '`arr[j - 1] > arr[j]`처럼 **큰 경우에만** 옮겨요. `>=`로 쓰면 같은 수끼리 자리를 바꿔 쓸데없이 움직여요.',
      '거의 정렬된 데이터면 `while`이 바로 끝나서 빨라요(최선 O(n)). 선택 정렬은 정렬 상태와 상관없이 끝까지 비교해요.',
    ],
    source: '3차 수행 목록 · 8. 정렬 알고리즘 「3. 삽입 정렬」',
  },
  {
    id: 'info-29', chapter: 'must3', must: true, title: '나는야 주식왕',
    statement: [
      '여러분은 주식의 가격이 어떻게 될지 미리 알 수 있는 능력을 가지게 됐다. 매일마다의 주식 가격이 주어지고 주식의 가격은 하루동안 변하지 않는다. 하지만 안타깝게도 여러분은 주식을 하루에 딱 1주만 사거나 팔 수 있다. 주식을 사고 판 후 최대 이익을 계산하는 프로그램을 작성하시오.',
    ],
    input: ['첫 번째 줄에 일별 주식가격이 공백 한 칸으로 구분되어 주어진다.'],
    output: ['최대 이익을 출력한다.'],
    examples: [
      { input: '7 1 5 3 6 4', output: '7' },
      { input: '9 7 5 3 1', output: '0' },
      { input: '2 5 1 4', output: '6' },
    ],
    template: py`
s = list(map(int, input().split()))
`,
    solution: py`
s = list(map(int, input().split()))

ans = 0
for i in range(len(s) - 1):        # 마지막 날 다음은 없으니 한 칸 덜
    if s[i] < s[i + 1]:            # 내일 오르면 오늘 사서 내일 판다
        ans += s[i + 1] - s[i]
print(ans)
`,
    limit: 3,
    tests: [
      { input: '7 1 5 3 6 4' }, { input: '9 7 5 3 1' }, { input: '2 5 1 4' }, { input: '5' }, { input: '1 2 3 4 5' },
      { input: '5 5 5 5' }, { input: '3 8 1 2 2 4 3' }, { input: '1 9 1 9 1 9' },
      { gen: py`
import random
random.seed(29)
print(*[random.randint(1, 100000) for _ in range(100000)])
`, limit: 5 },
    ],
    tips: [
      '오르는 날마다 「어제 사서 오늘 판다」고 보면 돼요. 1 → 5로 한 번에 오르나 1 → 3 → 5로 나눠 오르나 이익은 같아서, **오른 만큼을 전부 더하면** 최대예요(탐욕법).',
      '입력에 날 수가 따로 없어요. 한 줄을 통째로 리스트로 받고 길이는 `len(s)`로 써요.',
      '`s[i + 1]`을 보니까 반복은 `range(len(s) - 1)`. `range(len(s))`면 마지막 날에 칸이 없어서 오류가 나요.',
      '한 번만 사고팔 수 있는 버전은 연습의 「주식 한 번 사고팔기」에 있어요.',
    ],
    source: '엘리스 3차 수행 「탐욕법, 동적 계획법 > 나는야 주식왕」',
  },
  {
    id: 'info-30', chapter: 'must3', must: true, title: '점프',
    statement: [
      '희준이는 한 번에 1칸, 2칸, 3칸을 점프할 수 있다. 총 N칸의 계단이 있을 때, 희준이가 정확히 N칸에 도달하는 방법의 수를 구할 수 있는 프로그램을 작성하시오.',
    ],
    input: ['정수 N이 주어진다. (1 ≤ N ≤ 20)'],
    output: ['N칸에 도달하는 방법의 수를 출력한다.'],
    examples: [
      { input: '4', output: '7' },
      { input: '3', output: '4' },
      { input: '1', output: '1' },
    ],
    template: py`
n = int(input())
`,
    solution: py`
n = int(input())

table = [0] * (n + 10)      # n이 1, 2여도 table[3]까지 쓸 수 있게 넉넉히
table[1] = 1                # 1
table[2] = 2                # 1+1, 2
table[3] = 4                # 1+1+1, 1+2, 2+1, 3
for i in range(4, n + 1):
    table[i] = table[i - 1] + table[i - 2] + table[i - 3]   # 마지막 점프가 1칸 · 2칸 · 3칸
print(table[n])
`,
    tests: [
      { input: '4' }, { input: '3' }, { input: '1' }, { input: '2' }, { input: '5' }, { input: '10' }, { input: '20' },
    ],
    tips: [
      '마지막 점프를 보면 관계가 보여요: N칸 바로 전에는 N−1칸(1칸 점프) · N−2칸(2칸) · N−3칸(3칸)에 있었어요. 그래서 f(N) = f(N−1) + f(N−2) + f(N−3).',
      '시작값은 직접 세요: f(1) = 1, f(2) = 2(1+1, 2), f(3) = 4(1+1+1, 1+2, 2+1, 3).',
      '`table = [0] * (n + 1)`로 만들고 `table[3] = 4`를 쓰면 N = 1, 2일 때 칸이 없어서 오류가 나요. `n + 10`처럼 넉넉히 만들거나 작은 N을 따로 처리해요.',
      '1칸 · 2칸만 점프하는 버전은 연습의 「점프 (1·2칸)」에 있어요.',
    ],
    source: '엘리스 3차 수행 「탐욕법, 동적 계획법 > 점프」',
  },

  {
    id: 'info-31', chapter: 'must3', must: true, title: '1로 만들기',
    statement: [
      '정수 X에 사용할 수 있는 연산은 다음 3가지이다.',
      '1. X가 3으로 나누어 떨어지면 3으로 나눈다.',
      '2. X가 2로 나누어 떨어지면 2로 나눈다.',
      '3. 1을 뺀다.',
      '정수 `n`이 주어졌을 때 위의 연산 3개를 적절히 사용해 1을 만드려고 한다. 정수 n이 1이 되면 연산을 더 하지 않고 끝내면 된다. 연산을 사용하는 횟수의 최솟값을 출력하는 프로그램을 작성하시오.',
    ],
    input: ['정수 `n`이 주어진다. (1 ≤ `n` ≤ 1,000,000)'],
    output: ['`n`이 1이 될 때까지 연산을 하는 횟수의 최솟값을 출력한다.'],
    examples: [
      { input: '10', output: '3' },
      { input: '2', output: '1' },
      { input: '15', output: '4' },
    ],
    template: py`
n = int(input())
`,
    solution: py`
n = int(input())

table = [0] * (n + 1)        # table[x] = x를 1로 만드는 최소 횟수, table[1] = 0
for x in range(2, n + 1):
    table[x] = table[x - 1] + 1                  # ③ 1을 뺀 경우
    if x % 2 == 0:
        table[x] = min(table[x], table[x // 2] + 1)   # ② 2로 나눈 경우
    if x % 3 == 0:
        table[x] = min(table[x], table[x // 3] + 1)   # ① 3으로 나눈 경우
print(table[n])
`,
    limit: 3,
    tests: [
      { input: '10' }, { input: '2' }, { input: '15' }, { input: '1' }, { input: '3' }, { input: '642' }, { input: '999999' },
      { input: '1000000', limit: 6 },
    ],
    tips: [
      '탐욕법(나눌 수 있으면 무조건 나누기)은 틀려요: 10 → 5 → 4 → 2 → 1은 4번, 10 → 9 → 3 → 1은 3번.',
      '「마지막에 한 연산」으로 나눠 생각하면 점화식이 나와요: f(x) = min(f(x−1), f(x/2), f(x/3)) + 1 (나누어떨어질 때만).',
      '작은 수부터 표를 채우면 O(N). 재귀로 짜면 100만에서 재귀 한도에 걸려요.',
    ],
    source: '엘리스 3차 수행 「탐욕법, 동적 계획법 > 1로 만들기」',
  },
  {
    id: 'info-32', chapter: 'must3', must: true, title: '배낭 채우기',
    statement: [
      '무게를 K까지 담을 수 있는 배낭과 물건 N개가 있다. 물건마다 무게 W와 가치 V가 정해져 있고, **물건은 쪼갤 수 없으며 한 개씩만** 있다.',
      '배낭에 넣은 물건 무게의 합이 K를 넘지 않게 할 때, 넣을 수 있는 **가치의 합의 최댓값**을 구하는 프로그램을 작성하시오.',
    ],
    input: ['첫째 줄에 물건의 수 `N`과 배낭이 버틸 수 있는 무게 `K`가 주어진다. (1 ≤ N ≤ 100, 1 ≤ K ≤ 10,000)', '다음 `N`줄에 각 물건의 무게 `W`와 가치 `V`가 공백으로 주어진다. (1 ≤ W ≤ 10,000, 0 ≤ V ≤ 1,000)'],
    output: ['가치의 합의 최댓값을 출력한다.'],
    examples: [
      { input: '3 50\n10 60\n20 100\n30 120', output: '220' },
      { input: '4 7\n6 13\n4 8\n3 6\n5 12', output: '14' },
    ],
    template: py`
n, k = map(int, input().split())
items = []
for _ in range(n):
    w, v = map(int, input().split())
    items.append((w, v))
`,
    solution: py`
n, k = map(int, input().split())
items = []
for _ in range(n):
    w, v = map(int, input().split())
    items.append((w, v))

# table[i][j] = 앞의 물건 i개만 써서, 무게 j까지 담을 때 가치의 최댓값
table = [[0] * (k + 1) for _ in range(n + 1)]
for i in range(1, n + 1):
    weight, value = items[i - 1]
    for j in range(1, k + 1):
        if weight <= j:      # 넣을 수 있으면: 안 넣기 vs 넣기
            table[i][j] = max(table[i - 1][j], table[i - 1][j - weight] + value)
        else:                # 못 넣으면 그대로
            table[i][j] = table[i - 1][j]
print(table[n][k])
`,
    limit: 4,
    tests: [
      { input: '3 50\n10 60\n20 100\n30 120' }, { input: '4 7\n6 13\n4 8\n3 6\n5 12' }, { input: '1 5\n6 100' }, { input: '1 5\n5 100' },
      { input: '3 10\n5 10\n5 10\n6 19' }, { input: '4 10\n1 1\n2 3\n3 5\n10 8' },
      { gen: py`
import random
random.seed(32)
n, k = 100, 10000
print(n, k)
for _ in range(n):
    print(random.randint(1, 1000), random.randint(0, 1000))
`, limit: 8 },
    ],
    tips: [
      '탐욕법(무게당 가치가 높은 것부터)은 틀려요: 첫 예제에서 A(10, 60) → B(20, 100)를 넣으면 160, 남은 20에 C(30)가 안 들어가요. 정답은 B + C = 220.',
      '물건 하나씩 「넣는다 / 안 넣는다」 두 경우를 비교해요. 넣으면 `table[i − 1][j − weight] + value` — **i − 1**(그 물건을 쓰기 전)이라야 같은 물건을 두 번 넣지 않아요.',
      '표 크기는 (N + 1) × (K + 1). 0번 줄 · 0번 칸은 「물건 없음 · 무게 0」이라 0이에요.',
    ],
    source: '3차 수행 목록 · 9. 탐욕법과 동적계획법 「2-6. 배낭 문제」',
  },

  // ───────────── 8. 정렬 ─────────────
  {
    id: 'info-33', chapter: 'sort', title: '버블 정렬 (몇 바퀴?)',
    statement: [
      '**개선한 버블 정렬**로 N개의 정수를 오름차순 정렬한다. 이웃한 두 수를 비교해 왼쪽이 크면 바꾸는 일을 한 바퀴씩 반복하되, **한 바퀴 동안 한 번도 바꾸지 않았으면 이미 정렬된 것이니 멈춘다.**',
      '정렬 결과와, 멈출 때까지 돈 바퀴 수(마지막에 아무것도 안 바꾼 바퀴 포함)를 출력하시오.',
    ],
    input: ['첫째 줄에 `N`이 주어진다. (2 ≤ N ≤ 1,000)', '둘째 줄에 정수 `N`개가 주어진다.'],
    output: ['첫째 줄에 정렬된 수를 공백으로 구분해 출력한다.', '둘째 줄에 돈 바퀴 수를 출력한다. 바퀴는 많아야 `N − 1`번 돈다.'],
    examples: [
      { input: '6\n5 3 8 1 9 2', output: '1 2 3 5 8 9\n5' },
      { input: '5\n1 2 3 4 5', output: '1 2 3 4 5\n1' },
    ],
    template: py`
n = int(input())
arr = list(map(int, input().split()))
`,
    solution: py`
n = int(input())
arr = list(map(int, input().split()))

rounds = 0
for i in range(n - 1):                 # 많아야 n-1 바퀴
    rounds += 1
    swapped = False
    for j in range(n - 1 - i):         # 확정된 뒤쪽은 빼고
        if arr[j] > arr[j + 1]:
            arr[j], arr[j + 1] = arr[j + 1], arr[j]
            swapped = True
    if not swapped:                    # 한 번도 안 바꿨으면 끝
        break
print(*arr)
print(rounds)
`,
    tests: [
      { input: '6\n5 3 8 1 9 2' }, { input: '5\n1 2 3 4 5' }, { input: '5\n5 4 3 2 1' }, { input: '2\n2 1' },
      { input: '6\n2 1 3 4 5 6' }, { input: '6\n2 3 4 5 6 1' }, { input: '4\n7 7 7 7' },
      { gen: py`
import random
random.seed(33)
n = 1000
print(n)
print(*[random.randint(1, 100000) for _ in range(n)])
` },
    ],
    tips: [
      '`swapped`는 바퀴마다 `False`로 다시 시작해요. 바깥 반복 밖에 두면 한 번 바꾼 뒤로 계속 `True`라서 멈추지 않아요.',
      '`[2, 3, 4, 5, 6, 1]`처럼 작은 수가 맨 뒤에 있으면 한 바퀴에 한 칸씩만 앞으로 와서 바퀴가 많이 필요해요.',
    ],
    source: '8. 정렬 알고리즘 「1. 버블 정렬 · 버블정렬 개선해보기」',
  },
  {
    id: 'info-34', chapter: 'sort', title: '삽입 정렬 이동 횟수',
    statement: [
      'N개의 정수를 삽입 정렬로 오름차순 정렬할 때, 수가 **한 칸 앞으로 옮겨진 횟수의 합**을 구하는 프로그램을 작성하시오.',
      '`while j > 0 and arr[j - 1] > arr[j]` 안에서 자리를 한 번 바꿀 때마다 1번으로 센다. 거의 정렬된 데이터일수록 이 횟수가 작다.',
    ],
    input: ['첫째 줄에 `N`이 주어진다. (1 ≤ N ≤ 1,000)', '둘째 줄에 정수 `N`개가 주어진다.'],
    output: ['옮겨진 횟수의 합을 출력한다.'],
    examples: [
      { input: '6\n5 3 8 1 9 2', output: '8' },
      { input: '5\n1 2 3 4 5', output: '0' },
    ],
    template: py`
n = int(input())
arr = list(map(int, input().split()))
`,
    solution: py`
n = int(input())
arr = list(map(int, input().split()))

moves = 0
for i in range(1, n):
    j = i
    while j > 0 and arr[j - 1] > arr[j]:
        arr[j - 1], arr[j] = arr[j], arr[j - 1]
        moves += 1                     # 한 칸 옮길 때마다 센다
        j -= 1
print(moves)
`,
    tests: [
      { input: '6\n5 3 8 1 9 2' }, { input: '5\n1 2 3 4 5' }, { input: '5\n5 4 3 2 1' }, { input: '1\n42' },
      { input: '6\n3 3 3 1 1 1' }, { input: '6\n1 2 3 4 6 5' },
      { gen: py`
import random
random.seed(34)
n = 1000
print(n)
print(*[random.randint(1, 1000000) for _ in range(n)])
` },
    ],
    tips: ['완전히 거꾸로면 1 + 2 + … + (N − 1) = N(N − 1)/2번(최악 O(n²)), 이미 정렬돼 있으면 0번(최선 O(n)).', '같은 수끼리는 옮기지 않아요(`>`이지 `>=`가 아니에요).'],
    source: '8. 정렬 알고리즘 「3. 삽입 정렬 · 4-2 거의 정렬된 데이터라면?」',
  },
  {
    id: 'info-35', chapter: 'sort', title: '정렬된 두 줄 합치기',
    statement: [
      '오름차순으로 정렬된 두 리스트 A, B가 주어진다. 두 리스트를 합쳐 오름차순으로 정렬된 하나의 리스트를 출력하는 프로그램을 작성하시오.',
      '병합 정렬의 「합치기」처럼 **두 리스트의 맨 앞끼리만 비교**해 작은 쪽을 꺼내면 O(N + M)에 끝난다.',
    ],
    input: ['첫째 줄에 `N`과 `M`이 주어진다. (1 ≤ N, M ≤ 100,000)', '둘째 줄에 오름차순으로 정렬된 정수 `N`개(리스트 A), 셋째 줄에 오름차순으로 정렬된 정수 `M`개(리스트 B)가 주어진다.'],
    output: ['합친 리스트의 수를 공백으로 구분해 한 줄에 출력한다.'],
    examples: [
      { input: '3 3\n3 5 8\n1 2 9', output: '1 2 3 5 8 9' },
      { input: '2 4\n1 10\n2 3 4 5', output: '1 2 3 4 5 10' },
    ],
    template: py`
n, m = map(int, input().split())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
`,
    solution: py`
n, m = map(int, input().split())
a = list(map(int, input().split()))
b = list(map(int, input().split()))

result = []
i = 0                               # a에서 볼 위치
j = 0                               # b에서 볼 위치
while i < len(a) and j < len(b):
    if a[i] <= b[j]:
        result.append(a[i])
        i += 1
    else:
        result.append(b[j])
        j += 1
result += a[i:]                     # 남은 것 붙이기(이미 정렬돼 있다)
result += b[j:]
print(*result)
`,
    limit: 3,
    tests: [
      { input: '3 3\n3 5 8\n1 2 9' }, { input: '2 4\n1 10\n2 3 4 5' }, { input: '1 1\n5\n5' }, { input: '3 2\n1 2 3\n4 5' },
      { input: '2 3\n7 8\n1 2 3' }, { input: '4 4\n-5 0 0 7\n-5 -1 0 9' },
      { gen: py`
import random
random.seed(35)
n = m = 50000
print(n, m)
print(*sorted(random.randint(-10**5, 10**5) for _ in range(n)))
print(*sorted(random.randint(-10**5, 10**5) for _ in range(m)))
`, limit: 6 },
    ],
    tips: ['마지막 두 줄(`result += a[i:]`, `result += b[j:]`)을 빼먹으면 한쪽이 먼저 바닥났을 때 남은 수가 사라져요.', '`a[i] <= b[j]`의 `=`: 같으면 왼쪽(a)을 먼저 꺼내요(안정 정렬).'],
    source: '8. 정렬 알고리즘 「7. 병합 정렬 · merge」',
  },

  // ───────────── 9. 탐욕법 · 동적계획법 ─────────────
  {
    id: 'info-36', chapter: 'dp', title: '거스름돈 (탐욕법)',
    statement: [
      '편의점에서 N원을 거슬러 줘야 한다. 동전은 **500원, 100원, 50원, 10원**이 충분히 있다.',
      '동전 개수를 가장 적게 하여 거슬러 줄 때 동전의 개수를 구하는 프로그램을 작성하시오.',
    ],
    input: ['첫째 줄에 `N`이 주어진다. N은 10의 배수다. (10 ≤ N ≤ 1,000,000,000)'],
    output: ['동전 개수의 최솟값을 출력한다.'],
    examples: [
      { input: '1260', output: '6' },
      { input: '10', output: '1' },
    ],
    template: py`
money = int(input())
`,
    solution: py`
money = int(input())

count = 0
for c in [500, 100, 50, 10]:        # 큰 동전부터
    count += money // c             # 낼 수 있는 만큼 한꺼번에
    money %= c                      # 남은 돈
print(count)
`,
    tests: [{ input: '1260' }, { input: '10' }, { input: '500' }, { input: '990' }, { input: '1000000000' }, { input: '123450' }],
    tips: ['`while money >= c: money -= c`로 하나씩 빼면 10억 원에서 200만 번 넘게 돌아요. 몫(`//`)과 나머지(`%`)면 동전 종류마다 한 번이에요.', '이 동전들은 큰 동전이 작은 동전의 배수라서 탐욕법이 항상 맞아요. 동전이 1, 3, 4원이면 틀려요(「동전 최소 개수」).'],
    source: '9. 탐욕법과 동적계획법 「1-1. 거스름돈 퀴즈」',
  },
  {
    id: 'info-37', chapter: 'dp', title: '강당 예약',
    statement: [
      '학교 강당을 쓰고 싶은 행사 N개의 시작 시각과 끝 시각이 주어진다. 시간이 겹치는 행사는 동시에 할 수 없지만, **한 행사가 끝나는 시각에 다른 행사를 시작하는 건 괜찮다.**',
      '강당에서 열 수 있는 **행사의 최대 개수**를 구하는 프로그램을 작성하시오. 시작 시각과 끝 시각이 같은 행사도 있을 수 있다.',
    ],
    input: ['첫째 줄에 행사의 수 `N`이 주어진다. (1 ≤ N ≤ 100,000)', '다음 `N`줄에 각 행사의 시작 시각과 끝 시각이 공백으로 주어진다. (0 ≤ 시작 ≤ 끝 ≤ 1,000,000,000)'],
    output: ['열 수 있는 행사의 최대 개수를 출력한다.'],
    examples: [
      { input: '8\n1 4\n3 5\n0 6\n5 7\n3 9\n5 9\n6 10\n8 11', output: '3' },
      { input: '3\n1 5\n4 7\n6 10', output: '2' },
    ],
    template: py`
n = int(input())
events = []
for _ in range(n):
    s, e = map(int, input().split())
    events.append((s, e))
`,
    solution: py`
n = int(input())
events = []
for _ in range(n):
    s, e = map(int, input().split())
    events.append((s, e))

# 일찍 끝나는 것부터, 끝이 같으면 일찍 시작하는 것부터
events.sort(key=lambda ev: (ev[1], ev[0]))
count = 0
last_end = 0                        # 강당이 비는 시각
for s, e in events:
    if last_end <= s:               # 강당이 빈 뒤에 시작하면 고른다
        count += 1
        last_end = e
print(count)
`,
    limit: 3,
    tests: [
      { input: '8\n1 4\n3 5\n0 6\n5 7\n3 9\n5 9\n6 10\n8 11' }, { input: '3\n1 5\n4 7\n6 10' }, { input: '1\n0 0' },
      { input: '2\n2 2\n1 2' }, { input: '3\n3 3\n1 3\n3 3' }, { input: '4\n1 10\n2 3\n4 5\n6 7' },
      { gen: py`
import random
random.seed(37)
n = 40000
print(n)
for _ in range(n):
    s = random.randint(0, 10**8)
    print(s, s + random.randint(0, 10**5))
`, limit: 5 },
    ],
    tips: [
      '기준이 핵심이에요. 짧은 것부터(반례: 1~5, 4~7, 6~10)나 일찍 시작하는 것부터는 틀려요. **일찍 끝나는 것부터**가 항상 맞아요: 가장 일찍 끝나는 걸 고르면 남은 시간이 가장 많이 남거든요.',
      '자료 코드처럼 끝 시각만으로 정렬하면 `(2, 2)`와 `(1, 2)` 순서로 놓였을 때 하나밖에 못 골라요. 끝이 같으면 시작이 빠른 것부터: `key=lambda ev: (ev[1], ev[0])`.',
    ],
    source: '9. 탐욕법과 동적계획법 「1-2 강당 예약 · 1-4 왜 일찍 끝나는 것부터는 항상 맞을까」',
  },
  {
    id: 'info-38', chapter: 'dp', title: '동전 최소 개수 (동적계획법)',
    statement: [
      '어느 나라의 동전 N종류가 각각 충분히 있다. 이 동전들로 정확히 K원을 만들 때, **동전 개수의 최솟값**을 구하는 프로그램을 작성하시오.',
      '동전이 1, 3, 4원이고 K = 6이면 큰 동전부터 고르는 탐욕법은 4 + 1 + 1(3개)이지만, 3 + 3(2개)이 더 적다. K원을 만들 수 없으면 `-1`을 출력한다.',
    ],
    input: ['첫째 줄에 동전 종류 수 `N`과 금액 `K`가 주어진다. (1 ≤ N ≤ 100, 1 ≤ K ≤ 10,000)', '둘째 줄에 동전의 가치 `N`개가 주어진다. (1 ≤ 가치 ≤ 10,000, 서로 다름)'],
    output: ['동전 개수의 최솟값을 출력한다. 만들 수 없으면 `-1`을 출력한다.'],
    examples: [
      { input: '3 6\n1 3 4', output: '2' },
      { input: '2 7\n2 4', output: '-1' },
    ],
    template: py`
n, k = map(int, input().split())
coins = list(map(int, input().split()))
`,
    solution: py`
n, k = map(int, input().split())
coins = list(map(int, input().split()))

INF = float("inf")
table = [INF] * (k + 1)      # table[x] = x원을 만드는 최소 동전 수
table[0] = 0
for x in range(1, k + 1):
    for c in coins:
        if c <= x:           # 마지막에 낸 동전이 c였다면
            table[x] = min(table[x], table[x - c] + 1)
if table[k] == INF:
    print(-1)
else:
    print(table[k])
`,
    limit: 4,
    tests: [
      { input: '3 6\n1 3 4' }, { input: '2 7\n2 4' }, { input: '3 8\n1 4 5' }, { input: '4 1260\n500 100 50 10' },
      { input: '1 9\n10' }, { input: '2 11\n5 7' }, { input: '3 30\n1 15 25' },
      { gen: py`
import random
random.seed(38)
print(100, 10000)
print(*random.sample(range(2, 10001), 100))
`, limit: 8 },
    ],
    tips: [
      '점화식: f(x) = min(f(x − c) + 1) (모든 동전 c ≤ x), f(0) = 0.',
      '처음 값을 0으로 채우면 min이 늘 0이 돼요. **무한대(`float("inf")`)로 채우고** 0원만 0으로.',
      '마지막에 여전히 무한대면 만들 수 없는 금액이에요 → `-1`.',
    ],
    source: '9. 탐욕법과 동적계획법 「1-5 다시 거스름돈 · 2-4 거스름돈 문제(동적계획법)」',
  },
  {
    id: 'info-39', chapter: 'dp', title: '주식 한 번 사고팔기',
    statement: [
      '하민이는 앞으로 N일 동안 어떤 주식의 하루 가격을 미리 알게 되었다. 이 주식을 **딱 한 번 사고(매수), 산 날보다 뒤의 어느 날 딱 한 번 판다(매도)**.',
      '얻을 수 있는 가장 큰 이익(판 가격 − 산 가격)을 구하는 프로그램을 작성하시오. 어떻게 해도 이익이 나지 않으면 사지 않고 `0`을 출력한다.',
    ],
    input: ['첫째 줄에 날 수 `N`이 주어진다. (2 ≤ N ≤ 100,000)', '둘째 줄에 1일부터 N일까지의 주가가 공백으로 구분되어 주어진다. (1 ≤ 주가 ≤ 1,000,000)'],
    output: ['가장 큰 이익을 출력한다.'],
    examples: [
      { input: '6\n7 1 5 3 6 4', output: '5' },
      { input: '5\n7 6 4 3 1', output: '0' },
    ],
    template: py`
n = int(input())
prices = list(map(int, input().split()))
`,
    solution: py`
n = int(input())
prices = list(map(int, input().split()))

min_price = prices[0]        # 지금까지 본 가장 싼 가격(이때 샀다고 치기)
best = 0
for p in prices[1:]:
    if p - min_price > best:     # 오늘 팔면 얼마나 남나
        best = p - min_price
    if p < min_price:            # 더 싼 날이 나오면 산 날을 바꾼다
        min_price = p
print(best)
`,
    limit: 3,
    tests: [
      { input: '6\n7 1 5 3 6 4' }, { input: '5\n7 6 4 3 1' }, { input: '2\n1 2' }, { input: '2\n5 5' },
      { input: '7\n3 8 1 2 2 4 3' }, { input: '5\n9 1 9 1 9' }, { input: '6\n2 4 1 7 5 11' },
      { gen: py`
import random
random.seed(39)
n = 100000
print(n)
print(*[random.randint(1, 1000000) for _ in range(n)])
`, limit: 5 },
      { gen: py`
n = 100000
print(n)
print(*range(n, 0, -1))
`, limit: 5 },
    ],
    tips: [
      '모든 (산 날, 판 날) 쌍을 다 보면 O(n²) → 10만 일이면 50억 번이라 시간 초과예요.',
      '탐욕법: 왼쪽에서 오른쪽으로 한 번 훑으면서 **지금까지의 최저가**만 기억하면, 오늘 팔 때의 최대 이익이 바로 나와요. O(n).',
      '최저가를 먼저 바꾸고 이익을 계산하면 같은 날 사고파는 셈이 돼요(이익 0이라 답은 같지만 순서를 지키는 습관!).',
      '여러 번 사고팔 수 있으면 오른 만큼을 다 더하면 돼요(3차 수행 「나는야 주식왕」). 조건부터 읽어요!',
    ],
    source: '9. 탐욕법과 동적계획법 「1. 탐욕법」 (나는야 주식왕 응용)',
  },  {
    id: 'info-42', chapter: 'dp', title: '점프 (1·2칸)',
    statement: [
      '개구리가 출발점에서 일렬로 놓인 돌 위를 점프해 N번째 돌까지 가려고 한다. 개구리는 한 번에 **1칸 또는 2칸**을 점프할 수 있다.',
      'N번째 돌에 도착하는 서로 다른 방법의 수를 구하는 프로그램을 작성하시오. 예를 들어 3번째 돌까지는 1+1+1, 1+2, 2+1로 3가지다.',
    ],
    input: ['첫째 줄에 `N`이 주어진다. (1 ≤ N ≤ 90)'],
    output: ['N번째 돌에 도착하는 방법의 수를 출력한다.'],
    examples: [
      { input: '4', output: '5' },
      { input: '10', output: '89' },
    ],
    template: py`
n = int(input())
`,
    solution: py`
n = int(input())

table = [0] * (n + 2)        # n이 1이어도 table[2]를 쓸 수 있게 한 칸 더
table[1] = 1
table[2] = 2
for i in range(3, n + 1):
    table[i] = table[i - 1] + table[i - 2]   # 직전 칸에서 1칸 + 두 칸 전에서 2칸
print(table[n])
`,
    tests: [
      { input: '4' }, { input: '10' }, { input: '1' }, { input: '2' }, { input: '3' }, { input: '50' }, { input: '90' },
    ],
    tips: [
      '마지막 점프를 보면 관계가 보여요: N번째 돌 바로 전에는 N−1번째(1칸 점프)나 N−2번째(2칸 점프)에 있었어요. 그래서 f(N) = f(N−1) + f(N−2).',
      '재귀로 쓰면 같은 계산을 계속 반복해서 N = 90이면 끝나지 않아요. 작은 칸부터 표를 채워요(타뷸레이션).',
      '`table = [0] * (n + 1)`로 만들고 `table[2] = 2`를 쓰면 N = 1일 때 칸이 없어서 오류가 나요. 한 칸 더 만들거나 N = 1을 따로 처리해요.',
      '3칸까지 점프하는 버전은 3차 수행 「점프」, 격자 위 점프는 「점프 (격자)」에 있어요.',
    ],
    source: '9. 탐욕법과 동적계획법 「2-5. 계단 오르기」',
  },
  {
    id: 'info-40', chapter: 'dp', title: '점프 (격자)',
    statement: [
      'N×N 게임판의 각 칸에 0부터 9까지의 수가 적혀 있다. 맨 왼쪽 위 칸에서 출발해 맨 오른쪽 아래 칸까지 가려고 한다.',
      '각 칸에 적힌 수는 그 칸에서 **오른쪽 또는 아래쪽으로 정확히 점프해야 하는 칸 수**다. 게임판 밖으로 나가면 안 되고, 0이 적힌 칸에서는 더 갈 수 없다. 맨 오른쪽 아래 칸에는 항상 0이 적혀 있다.',
      '맨 왼쪽 위에서 맨 오른쪽 아래까지 갈 수 있는 경로의 수를 구하는 프로그램을 작성하시오.',
    ],
    input: ['첫째 줄에 게임판의 크기 `N`이 주어진다. (2 ≤ N ≤ 100)', '다음 `N`줄에 각 칸의 수 `N`개가 공백으로 주어진다.'],
    output: ['경로의 수를 출력한다.'],
    examples: [
      { input: '4\n2 3 3 1\n1 2 1 3\n1 2 3 1\n3 1 1 0', output: '3' },
      { input: '3\n1 1 1\n1 1 1\n1 1 0', output: '6' },
    ],
    template: py`
n = int(input())
board = [list(map(int, input().split())) for _ in range(n)]
`,
    solution: py`
n = int(input())
board = [list(map(int, input().split())) for _ in range(n)]

ways = [[0] * n for _ in range(n)]    # ways[x][y] = (x, y)에 도착하는 경로 수
ways[0][0] = 1
for x in range(n):                    # 위 → 아래, 왼쪽 → 오른쪽 순서로 훑으면
    for y in range(n):                #   들어오는 경로는 이미 다 더해져 있다
        jump = board[x][y]
        if jump == 0 or ways[x][y] == 0:
            continue
        if y + jump < n:              # 오른쪽으로 점프
            ways[x][y + jump] += ways[x][y]
        if x + jump < n:              # 아래쪽으로 점프
            ways[x + jump][y] += ways[x][y]
print(ways[n - 1][n - 1])
`,
    limit: 3,
    tests: [
      { input: '4\n2 3 3 1\n1 2 1 3\n1 2 3 1\n3 1 1 0' }, { input: '3\n1 1 1\n1 1 1\n1 1 0' }, { input: '2\n1 1\n1 0' }, { input: '2\n2 1\n1 0' },
      { input: '3\n0 1 1\n1 1 1\n1 1 0' },
      { gen: py`
n = 100
print(n)
for x in range(n):
    print(*[0 if x == y == n - 1 else 1 for y in range(n)])
` },
      { gen: py`
import random
random.seed(40)
n = 100
print(n)
for x in range(n):
    print(*[0 if x == y == n - 1 else random.randint(1, 3) for y in range(n)])
` },
    ],
    tips: ['모든 경로를 DFS로 하나씩 따라가면 경로가 수십억 개라 끝나지 않아요. 칸마다 「여기 도착하는 경로 수」를 적어 두고 뒤로 넘겨줘요(동적계획법).', '오른쪽 · 아래로만 가니까 위에서 아래, 왼쪽에서 오른쪽 순서로 훑으면 한 칸을 볼 때 그 칸으로 오는 경로가 이미 다 모여 있어요.', '경로 수가 아주 커져도 파이썬 정수는 넘치지 않아요.'],
    source: '9. 탐욕법과 동적계획법 「2. 동적계획법」 + 6. DFS와 BFS 「5. 격자」 (점프 응용)',
  },
  {
    id: 'info-41', chapter: 'dp', title: '계단 오르기 (점수)',
    statement: [
      '계단 N개에 각각 점수가 적혀 있다. 계단 아래 시작점에서 출발해 꼭대기(N번째 계단)까지 오르며, 밟은 계단의 점수를 모두 얻는다.',
      '한 번에 **1계단 또는 2계단**씩 오를 수 있지만, **연속된 세 개의 계단을 모두 밟을 수는 없다**(시작점은 계단이 아니다). **마지막 계단은 반드시 밟아야** 한다. 얻을 수 있는 점수 합의 최댓값을 구하는 프로그램을 작성하시오.',
    ],
    input: ['첫째 줄에 계단의 수 `N`이 주어진다. (1 ≤ N ≤ 300)', '다음 `N`줄에 아래 계단부터 차례로 점수가 하나씩 주어진다. (1 ≤ 점수 ≤ 10,000)'],
    output: ['점수 합의 최댓값을 출력한다.'],
    examples: [
      { input: '6\n10\n20\n15\n25\n10\n20', output: '75' },
      { input: '3\n1\n2\n3', output: '5' },
    ],
    template: py`
n = int(input())
score = [int(input()) for _ in range(n)]
`,
    solution: py`
n = int(input())
score = [int(input()) for _ in range(n)]

s = [0] + score                  # s[i] = i번째 계단 점수 (1번부터)
best = [0] * (n + 1)             # best[i] = i번째 계단을 밟고 끝날 때 최대 점수
for i in range(1, n + 1):
    if i == 1:
        best[i] = s[1]
    elif i == 2:
        best[i] = s[1] + s[2]
    else:
        # 마지막 걸음이 2칸(i-2에서) 또는 1칸(i-1에서, 그 전은 i-3에서 2칸)
        best[i] = max(best[i - 2], best[i - 3] + s[i - 1]) + s[i]
print(best[n])
`,
    tests: [
      { input: '6\n10\n20\n15\n25\n10\n20' }, { input: '3\n1\n2\n3' }, { input: '1\n7' }, { input: '2\n3\n4' },
      { input: '4\n1\n100\n100\n1' }, { input: '5\n5\n5\n5\n5\n5' },
      { gen: py`
import random
random.seed(41)
n = 300
print(n)
for _ in range(n):
    print(random.randint(1, 10000))
` },
    ],
    tips: ['「점프」(방법의 수)와 달리 점수의 **최댓값**이고, 세 칸 연속 금지 조건이 있어요.', 'i번째에 1칸으로 왔다면 i−1번째를 밟았고, 그 전은 반드시 i−3에서 2칸 점프했어야 해요(세 칸 연속 금지). 그래서 `best[i − 3] + s[i − 1]`.', 'i = 3일 때 `best[0] = 0`이라 시작점에서 2칸 점프한 경우가 저절로 들어가요.'],
    source: '9. 탐욕법과 동적계획법 「2-5. 계단 오르기」 (응용)',
  },
  // ───────────── 수행평가 6문제 ─────────────
  {
    id: 'info-01', chapter: 'must', must: true, title: 'DFS 방문 순서 (스택)',
    statement: [
      '그래프의 정점과 각 정점의 이웃이 주어진다. 시작 정점에서 **스택을 쓰는 DFS(재귀 X)** 로 방문한 순서를 출력하는 프로그램을 완성하시오.',
      '꺼낼 때는 스택의 맨 뒤에서 꺼내고(LIFO), 이웃은 주어진 순서대로 스택에 넣는다. 스택에 넣을 때 바로 방문 표시를 한다.',
    ],
    input: ['첫째 줄에 정점 수 `N`과 시작 정점 `S`가 공백으로 주어진다. (1 ≤ N ≤ 26)', '다음 `N`줄에 정점 이름과 그 정점의 이웃들이 공백으로 주어진다. 정점 이름은 알파벳 대문자 한 글자다.'],
    output: ['방문한 순서대로 정점 이름을 공백으로 구분해 한 줄에 출력한다.'],
    examples: [
      { input: graphLines(['7 A', ...MATERIAL_GRAPH]), output: 'A C D E B' },
      { input: graphLines(['7 F', ...MATERIAL_GRAPH]), output: 'F G' },
    ],
    template: py`
def dfs(graph, start):
    visited = set([start])
    stack = [start]              # 큐 대신 스택(리스트)
    result = []

    while stack:
        node = stack.____()       # 뒤에서 꺼내기 (LIFO)
        result.append(node)

        for next in graph[node]:
            if next ____ visited:
                stack.____(next)
                visited.____(next)

    return result


n, start = input().split()
graph = {}
for _ in range(int(n)):
    line = input().split()
    graph[line[0]] = line[1:]

print(*dfs(graph, start))
`,
    blanks: ['pop', 'not in', 'append', 'add'],
    solution: py`
def dfs(graph, start):
    visited = set([start])
    stack = [start]              # 큐 대신 스택(리스트)
    result = []

    while stack:
        node = stack.pop()       # 뒤에서 꺼내기 (LIFO)
        result.append(node)

        for next in graph[node]:
            if next not in visited:
                stack.append(next)
                visited.add(next)

    return result


n, start = input().split()
graph = {}
for _ in range(int(n)):
    line = input().split()
    graph[line[0]] = line[1:]

print(*dfs(graph, start))
`,
    tests: [
      { input: graphLines(['7 A', ...MATERIAL_GRAPH]) }, { input: graphLines(['7 F', ...MATERIAL_GRAPH]) }, { input: graphLines(['7 D', ...MATERIAL_GRAPH]) },
      { input: graphLines(['12 A', ...BIG_GRAPH]) }, { input: graphLines(['12 G', ...BIG_GRAPH]) }, { input: graphLines(['8 A', ...TREE]) },
      { input: graphLines(['6 C', ...CYCLE]) }, { input: graphLines(['1 A', 'A']) },
    ],
    tips: [
      '스택은 나중에 넣은 것이 먼저 나와서, 가장 최근에 발견한 곳부터 간다. 그래서 A의 이웃 B, C 중 C로 먼저 간다.',
      '자료 코드는 `visited = set(start)`예요. 정점 이름이 한 글자라 결과는 같지만, `\'AB\'`처럼 두 글자면 `{\'A\', \'B\'}`가 돼요. `set([start])`가 안전해요.',
    ],
    source: '6. DFS와 BFS · 3-1 DFS (스택)',
  },
  {
    id: 'info-02', chapter: 'must', must: true, title: '덩어리 개수 세기',
    statement: [
      '그래프가 몇 개의 덩어리(연결 요소)로 이루어져 있는지 세는 프로그램을 작성하시오.',
      '아직 방문하지 않은 정점에서 새로 탐색을 시작한 횟수가 곧 덩어리 수다. 덩어리 하나는 큐(BFS)로 통째로 방문한다.',
    ],
    input: ['첫째 줄에 정점 수 `N`이 주어진다. (1 ≤ N ≤ 26)', '다음 `N`줄에 정점 이름과 그 정점의 이웃들이 공백으로 주어진다.'],
    output: ['덩어리 개수를 출력한다.'],
    examples: [
      { input: graphLines(['9', ...MATERIAL_GRAPH2]), output: '3' },
      { input: graphLines(['7', ...MATERIAL_GRAPH]), output: '2' },
    ],
    template: py`
n = int(input())
graph = {}
for _ in range(n):
    line = input().split()
    graph[line[0]] = line[1:]
`,
    solution: py`
from collections import deque

def count_comp(graph):
    visited = set()
    count = 0

    for v in graph:
        if v not in visited:
            count = count + 1
            # 이 덩어리를 통째로 방문
            queue = deque([v])
            visited.add(v)
            while queue:
                node = queue.popleft()
                for next in graph[node]:
                    if next not in visited:
                        queue.append(next)
                        visited.add(next)

    return count


n = int(input())
graph = {}
for _ in range(n):
    line = input().split()
    graph[line[0]] = line[1:]

print(count_comp(graph))
`,
    tests: [
      { input: graphLines(['9', ...MATERIAL_GRAPH2]) }, { input: graphLines(['7', ...MATERIAL_GRAPH]) }, { input: graphLines(['12', ...BIG_GRAPH]) },
      { input: graphLines(['11', ...SCATTER]) }, { input: graphLines(['1', 'A']) }, { input: graphLines(['5', 'A', 'B', 'C', 'D', 'E']) },
      { input: graphLines(['6', ...CYCLE]) },
    ],
    tips: ['`count = count + 1`은 자료의 `count += 1`과 같아요.'],
    source: '6. DFS와 BFS · 4-1 연결 요소 세기',
  },
  {
    id: 'info-09', chapter: 'must', must: true, title: '최단 거리 (BFS)',
    statement: ['가중치가 없는 그래프에서 BFS는 최단 거리를 구한다. 시작 정점에서 갈 수 있는 모든 정점까지의 최단 거리를 구하는 프로그램을 작성하시오.', '`dist` 딕셔너리가 거리 기록과 방문 표시(visited)를 함께 맡는다.'],
    input: ['첫째 줄에 정점 수 `N`과 시작 정점 `S`가 주어진다. (1 ≤ N ≤ 26)', '다음 `N`줄에 정점 이름과 그 정점의 이웃들이 공백으로 주어진다.'],
    output: ['갈 수 있는 정점을 이름 순으로 `S → 정점 : 거리칸` 꼴로 한 줄에 하나씩 출력한다.'],
    examples: [{ input: graphLines(['7 A', ...MATERIAL_GRAPH]), output: 'A → A : 0칸\nA → B : 1칸\nA → C : 1칸\nA → D : 2칸\nA → E : 3칸' }],
    template: py`
n, start = input().split()
graph = {}
for _ in range(int(n)):
    line = input().split()
    graph[line[0]] = line[1:]
`,
    solution: py`
from collections import deque

def bfs_distance(graph, start):
    dist = {start: 0}                 # 시작점까지의 거리는 0
    queue = deque([start])

    while queue:
        node = queue.popleft()
        for next in graph[node]:
            if next not in dist:          # dist 가 visited 역할도 함
                dist[next] = dist[node] + 1
                queue.append(next)

    return dist


n, start = input().split()
graph = {}
for _ in range(int(n)):
    line = input().split()
    graph[line[0]] = line[1:]

result = bfs_distance(graph, start)
for v in sorted(result):
    print(f"{start} → {v} : {result[v]}칸")
`,
    tests: [
      { input: graphLines(['7 A', ...MATERIAL_GRAPH]) }, { input: graphLines(['7 E', ...MATERIAL_GRAPH]) }, { input: graphLines(['7 F', ...MATERIAL_GRAPH]) },
      { input: graphLines(['12 A', ...BIG_GRAPH]) }, { input: graphLines(['8 H', ...TREE]) }, { input: graphLines(['6 A', ...CYCLE]) },
    ],
    tips: ['수업 코드 `bfs_distance(graph, start)` 그대로예요: `dist = {start: 0}`, `popleft()`, `if next not in dist`, `dist[next] = dist[node] + 1`.', '꺼낸 정점(`node`)의 거리 + 1이 이웃의 거리예요. BFS는 가까운 정점부터 꺼내니까 처음 기록한 거리가 곧 최단 거리예요.'],
    source: '6. DFS와 BFS · 4-2 최단 거리',
  },
  {
    id: 'info-04', chapter: 'must', must: true, title: '두 개의 카드',
    statement: [
      '빨간 카드 n장이 있고, 각 카드에는 정수 P₁, P₂, …, Pₙ이 적혀 있다. 파란 카드 역시 n장이 있고, 각 카드에는 정수 Q₁, Q₂, …, Qₙ이 적혀 있다.',
      '희준이는 빨간 카드 중에서 1장, 파란 카드 중에서 1장을 선택해 2장의 카드에 적힌 정수의 합을 계산한다. 이 정수의 합이 K가 되도록 하는 방법이 존재하는지 확인할 수 있는 프로그램을 작성하시오.',
    ],
    input: ['첫 번째 줄에 정수 `n`과 `k`가 주어진다. n과 k는 공백 한 칸으로 구분되어져 있다.', '두 번째 줄에 정수 P₁, P₂, …, Pₙ이 공백으로 구분되어져 있다.', '세 번째 줄에 정수 Q₁, Q₂, …, Qₙ이 공백으로 구분되어져 있다.'],
    output: ['합계를 K로 만드는 방법이 포함되어 있으면 `Yes`, 그렇지 않으면 `No`를 출력하시오.'],
    examples: [
      { input: '3 100\n17 57 99\n10 36 53', output: 'No' },
      { input: '4 0\n-3 5 -1 2\n3 -5 1 -2', output: 'Yes' },
    ],
    template: py`
n, k=map(int, input().split())
P=list(map(int, input().split()))
Q=list(map(int, input().split()))
`,
    solution: py`
n, k=map(int, input().split())
P=list(map(int, input().split()))
Q=list(map(int, input().split()))
check=False
for i in range(n):
    for j in range(n):
        if P[i]+Q[j] ==k:
            check=True
if check==True:
    print("Yes")
else:
    print("No")
`,
    tests: [
      { input: '3 100\n17 57 99\n10 36 53' }, { input: '4 0\n-3 5 -1 2\n3 -5 1 -2' }, { input: '1 10\n4\n6' }, { input: '1 10\n5\n6' },
      { input: '3 157\n17 57 99\n10 36 58' }, { input: '5 -7\n-1 -2 -3 -4 -5\n-9 -8 6 7 8' }, { input: '4 20\n10 10 10 10\n9 9 9 9' },
      { gen: py`
import random
random.seed(4)
n = 300
print(n, 123456)
print(*[random.randint(-100000, 100000) for _ in range(n)])
print(*[random.randint(-100000, 100000) for _ in range(n)])
` },
    ],
    tips: ['빨간 카드 하나(`i`)마다 파란 카드 전부(`j`)를 맞춰 보는 완전탐색이에요. 경우의 수는 n × n.', '`==`는 같은지 비교, `=`는 값 넣기예요. `if` 안에는 `==`.'],
    source: '엘리스 수행 · 두 개의 카드',
  },
  {
    id: 'info-05', chapter: 'must', must: true, title: '도서관 책 찾기',
    statement: [
      '학교 도서관에 N권의 책이 있고, 각 책에는 고유한 도서번호가 붙어 있다. 책들은 도서번호 기준으로 오름차순으로 정렬되어 있다.',
      '학생들이 M개의 도서번호를 검색할 때, 각 도서번호에 해당하는 책이 도서관에 있으면 해당 책이 왼쪽에서 몇 번째에 위치하는지(첫 번째부터 시작), 없으면 `-1`을 출력하는 프로그램을 작성하시오.',
    ],
    input: ['첫 번째 줄에 책의 수 `n`과 찾을 도서 번호 수 `m`이 정수로 주어진다. n과 m은 공백 한 칸으로 구분되어 주어진다. (1 ≤ n, m ≤ 100,000)', '두 번째 줄에 `n`개의 책의 도서번호가 오름차순 형태로 주어진다. (1 ≤ 도서 번호 ≤ 100,000)', '세 번째 줄에 찾을 도서번호 `m`개가 공백으로 구분되어 주어진다.'],
    output: ['찾는 도서번호마다 한 줄에 하나씩, 몇 번째에 있는지 또는 `-1`을 출력한다.'],
    examples: [
      { input: '8 3\n1 3 5 7 9 11 13 15\n7 15 8', output: '4\n8\n-1' },
      { input: '5 4\n2 4 6 8 10\n2 10 5 11', output: '1\n5\n-1\n-1' },
    ],
    template: py`
n, m=map(int, input().split())
book=list(map(int, input().split()))
search=list(map(int, input().split()))
`,
    solution: py`
n, m=map(int, input().split())
book=list(map(int, input().split()))
search=list(map(int, input().split()))

def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = (low + high) // 2

        if arr[mid] == target:      # 찾음! 위치를 반환
            return mid + 1
        elif arr[mid] < target:     # 오른쪽 절반만 남김
            low = mid + 1
        else:                       # 왼쪽 절반만 남김
            high = mid - 1

    return -1                       # 없음

for x in search:
    print(binary_search(book, x))
`,
    tests: [
      { input: '8 3\n1 3 5 7 9 11 13 15\n7 15 8' }, { input: '5 4\n2 4 6 8 10\n2 10 5 11' }, { input: '1 3\n7\n7 6 8' },
      { input: '2 4\n3 9\n3 9 1 10' }, { input: '10 5\n1 2 3 4 5 6 7 8 9 10\n1 10 5 6 11' },
      { gen: py`
import random
random.seed(5)
n = m = 50000
book = sorted(random.sample(range(1, 100001), n))
print(n, m)
print(*book)
print(*[random.randint(1, 100000) for _ in range(m)])
`, limit: 5 },
    ],
    tips: ['몇 번째는 1부터 세니까 인덱스 `mid`에 1을 더해요.', 'n, m이 10만이라 하나씩 훑으면 최대 100억 번 → 시간 초과. 이진탐색은 검색 한 번에 17번 정도면 끝나요.', '`while low < high`로 쓰면 하나 남았을 때 확인을 안 해서 맨 끝 책을 못 찾아요.'],
    source: '엘리스 수행 · 탐색 > 도서관 책 찾기',
  },
  {
    id: 'info-06', chapter: 'must', must: true, title: '리본 자르기',
    statement: [
      '희준이는 N개의 리본을 잘라 K명의 학생에게 같은 길이의 리본 조각을 하나씩 나눠주려 한다. 각 리본의 길이는 서로 다를 수 있으며, 하나의 리본에서 여러 조각을 잘라낼 수 있으며 남는 부분은 버린다.',
      'K명에게 모두 나눠줄 수 있는 리본 조각의 최대 길이를 구하라.',
    ],
    input: ['첫 번째 줄에는 리본 수 `n`과 학생수 `k`가 공백으로 구분되어 주어진다. (n, k는 정수, 1 ≤ n ≤ 10,000, 1 ≤ k ≤ 1,000,000) 단, k는 항상 나눠줄 수 있는 값으로 주어진다.', '두 번째 줄에 `n`개의 리본 길이가 공백으로 구분되어 주어진다. (1 ≤ 각 리본 길이 ≤ 2,000,000,000)'],
    output: ['K명에게 나눠줄 수 있는 리본 조각의 최대 길이를 출력한다.'],
    examples: [
      { input: '4 11\n802 743 457 539', output: '200' },
      { input: '3 4\n10 10 15', output: '7' },
    ],
    template: py`
n, k=map(int, input().split())
ribbon=list(map(int, input().split()))
`,
    solution: py`
n, k=map(int, input().split())
ribbon=list(map(int, input().split()))


low = 0
high = max(ribbon)

while low <= high:
    mid = (low + high) // 2 # 자르는 길이
    count = 0
    for v in ribbon:
        count = count + v // mid

    if count >= k:
        low = mid + 1
        answer = mid
    elif count < k:
        high = mid - 1

print(answer)
`,
    tests: [
      { input: '4 11\n802 743 457 539' }, { input: '3 4\n10 10 15' }, { input: '1 1\n2000000000' }, { input: '1 3\n10' },
      { input: '5 5\n5 5 5 5 5' }, { input: '2 7\n3 100' },
      { gen: py`
import random
random.seed(6)
n = 10000
print(n, 1000000)
print(*[random.randint(1000000, 2000000000) for _ in range(n)])
`, limit: 5 },
    ],
    tips: [
      '길이 `mid`로 자르면 리본 `v`에서 `v // mid`조각이 나와요. 조각이 k개 이상이면 더 길게(`low = mid + 1`), 모자라면 더 짧게(`high = mid - 1`).',
      '“답을 이진탐색”하는 문제예요. 길이를 1부터 하나씩 늘려 보면 최대 20억 번이라 시간 초과.',
      '자료처럼 `low = 0`이면 리본이 모두 1일 때 `mid`가 0이 되어 0으로 나누는 오류가 나요. `low = 1`로 시작하면 안전해요.',
    ],
    source: '엘리스 수행 · 탐색 > 리본 자르기',
  },

  // ───────────── 6. DFS와 BFS ─────────────
  {
    id: 'info-07', chapter: 'graph', title: 'BFS 방문 순서 (큐)',
    statement: ['시작 정점에서 **큐를 쓰는 BFS** 로 방문한 순서를 출력하는 프로그램을 작성하시오.', '물결이 퍼지듯 가까운 곳부터 방문한다. 큐는 앞에서 꺼내고(FIFO), 큐에 넣을 때 바로 방문 표시를 한다.'],
    input: ['첫째 줄에 정점 수 `N`과 시작 정점 `S`가 주어진다. (1 ≤ N ≤ 26)', '다음 `N`줄에 정점 이름과 그 정점의 이웃들이 공백으로 주어진다.'],
    output: ['방문 순서를 공백으로 구분해 한 줄에 출력한다.'],
    examples: [{ input: graphLines(['7 A', ...MATERIAL_GRAPH]), output: 'A B C D E' }, { input: graphLines(['7 E', ...MATERIAL_GRAPH]), output: 'E D B C A' }],
    template: py`
n, start = input().split()
graph = {}
for _ in range(int(n)):
    line = input().split()
    graph[line[0]] = line[1:]
`,
    solution: py`
from collections import deque

def bfs(graph, start):
    visited = set([start])       # 방문 표시
    queue = deque([start])        # 갈 곳을 담는 큐
    result = []                  # 방문 순서 기록

    while queue:
        node = queue.popleft()      # 앞에서 꺼내기 (FIFO)
        result.append(node)

        for next in graph[node]:
            if next not in visited:
                queue.append(next)
                visited.add(next)

    return result


n, start = input().split()
graph = {}
for _ in range(int(n)):
    line = input().split()
    graph[line[0]] = line[1:]

print(*bfs(graph, start))
`,
    tests: [
      { input: graphLines(['7 A', ...MATERIAL_GRAPH]) }, { input: graphLines(['7 E', ...MATERIAL_GRAPH]) }, { input: graphLines(['12 A', ...BIG_GRAPH]) },
      { input: graphLines(['12 K', ...BIG_GRAPH]) }, { input: graphLines(['8 H', ...TREE]) }, { input: graphLines(['6 A', ...CYCLE]) },
    ],
    tips: ['큐에 넣자마자 방문 표시를 하는 이유: 어차피 큐에 들어간 정점은 무조건 방문해요. 꺼낼 때 표시하면 같은 정점이 큐에 여러 번 들어가 일이 늘어나요.'],
    source: '6. DFS와 BFS · 2 BFS (큐)',
  },
  {
    id: 'info-08', chapter: 'graph', title: '재귀 DFS 방문 순서',
    statement: ['DFS를 **재귀 함수** 로 써서 방문 순서를 출력하는 프로그램을 작성하시오.', '재귀 버전은 첫 번째 이웃부터 바로 파고든다. 재귀 함수는 컴퓨터가 내부적으로 스택으로 관리한다.'],
    input: ['첫째 줄에 정점 수 `N`과 시작 정점 `S`가 주어진다. (1 ≤ N ≤ 26)', '다음 `N`줄에 정점 이름과 그 정점의 이웃들이 공백으로 주어진다.'],
    output: ['방문 순서를 공백으로 구분해 한 줄에 출력한다.'],
    examples: [{ input: graphLines(['7 A', ...MATERIAL_GRAPH]), output: 'A B D C E' }],
    template: py`
n, start = input().split()
graph = {}
for _ in range(int(n)):
    line = input().split()
    graph[line[0]] = line[1:]
`,
    solution: py`
def dfs_recursive(graph, node):
    visited.add(node)
    result.append(node)

    for next in graph[node]:
        if next not in visited:
            dfs_recursive(graph, next)

    return result


n, start = input().split()
graph = {}
for _ in range(int(n)):
    line = input().split()
    graph[line[0]] = line[1:]

visited = set()
result = []
print(*dfs_recursive(graph, start))
`,
    tests: [
      { input: graphLines(['7 A', ...MATERIAL_GRAPH]) }, { input: graphLines(['7 E', ...MATERIAL_GRAPH]) }, { input: graphLines(['12 A', ...BIG_GRAPH]) },
      { input: graphLines(['8 A', ...TREE]) }, { input: graphLines(['6 D', ...CYCLE]) },
    ],
    tips: ['스택 DFS(A C D E B)와 순서가 달라도 둘 다 올바른 DFS예요. 반복 버전은 마지막 이웃부터, 재귀 버전은 첫 이웃부터 가요.', '⚠️ 정점이 아주 많으면 재귀 한도(기본 1000)에 걸려요.'],
    source: '6. DFS와 BFS · 3-2 재귀로 쓰는 DFS',
  },
  {
    id: 'info-10', chapter: 'graph', title: '갈 수 있을까?',
    statement: ['그래프와 두 정점 `S`, `T`가 주어진다. `S`에서 출발해 `T`에 갈 수 있는지 BFS로 확인하는 프로그램을 작성하시오.'],
    input: ['첫째 줄에 정점 수 `N`이 주어진다. (1 ≤ N ≤ 26)', '다음 `N`줄에 정점 이름과 그 정점의 이웃들이 공백으로 주어진다.', '마지막 줄에 `S`와 `T`가 주어진다.'],
    output: ['갈 수 있으면 `Yes`, 없으면 `No`를 출력한다.'],
    examples: [{ input: graphLines(['7', ...MATERIAL_GRAPH, 'A E']), output: 'Yes' }, { input: graphLines(['7', ...MATERIAL_GRAPH, 'B G']), output: 'No' }],
    template: py`
n = int(input())
graph = {}
for _ in range(n):
    line = input().split()
    graph[line[0]] = line[1:]
s, t = input().split()
`,
    solution: py`
from collections import deque

def can_reach(graph, start, goal):
    visited = set([start])
    queue = deque([start])
    while queue:
        node = queue.popleft()
        if node == goal:
            return True
        for next in graph[node]:
            if next not in visited:
                visited.add(next)
                queue.append(next)
    return False


n = int(input())
graph = {}
for _ in range(n):
    line = input().split()
    graph[line[0]] = line[1:]
s, t = input().split()

if can_reach(graph, s, t):
    print("Yes")
else:
    print("No")
`,
    tests: [
      { input: graphLines(['7', ...MATERIAL_GRAPH, 'A E']) }, { input: graphLines(['7', ...MATERIAL_GRAPH, 'B G']) }, { input: graphLines(['7', ...MATERIAL_GRAPH, 'G F']) },
      { input: graphLines(['11', ...SCATTER, 'J L']) }, { input: graphLines(['11', ...SCATTER, 'A D']) }, { input: graphLines(['11', ...SCATTER, 'H H']) },
    ],
    source: '6. DFS와 BFS · 2 BFS (응용)',
  },
  {
    id: 'info-11', chapter: 'graph', title: '덩어리 개수 (재귀 DFS)',
    statement: ['덩어리 개수를 이번에는 **재귀 DFS** 로 세는 프로그램을 작성하시오. 아직 방문하지 않은 정점을 만날 때마다 개수를 1 늘리고, 그 정점에서 재귀 DFS로 덩어리 전체를 방문한다.'],
    input: ['첫째 줄에 정점 수 `N`이 주어진다. (1 ≤ N ≤ 26)', '다음 `N`줄에 정점 이름과 그 정점의 이웃들이 공백으로 주어진다.'],
    output: ['덩어리 개수를 출력한다.'],
    examples: [{ input: graphLines(['9', ...MATERIAL_GRAPH2]), output: '3' }],
    template: py`
n = int(input())
graph = {}
for _ in range(n):
    line = input().split()
    graph[line[0]] = line[1:]
`,
    solution: py`
def dfs_recursive(graph, node):
    visited.add(node)

    for next in graph[node]:
        if next not in visited:
            dfs_recursive(graph, next)


n = int(input())
graph = {}
for _ in range(n):
    line = input().split()
    graph[line[0]] = line[1:]

visited = set()
count = 0
for v in graph:
    if v not in visited:
        count += 1
        dfs_recursive(graph, v)
print(count)
`,
    tests: [
      { input: graphLines(['9', ...MATERIAL_GRAPH2]) }, { input: graphLines(['7', ...MATERIAL_GRAPH]) }, { input: graphLines(['11', ...SCATTER]) },
      { input: graphLines(['12', ...BIG_GRAPH]) }, { input: graphLines(['3', 'A', 'B', 'C']) },
    ],
    tips: ['자료의 이 셀은 `for v in graph`로 돌면서 `dfs_recursive(graph2, v)`를 불러서 graph2의 H, I 덩어리를 세지 못하고 2가 나와요. 셀 그래프와 탐색할 그래프가 같아야 3이 나와요.'],
    source: '6. DFS와 BFS · 4-1 연결 요소 세기 (재귀)',
  },
  {
    id: 'info-03', chapter: 'graph', title: '미로 최단 거리 (격자 BFS)',
    statement: [
      '`N`×`M` 미로가 주어진다. `0`은 지나갈 수 있는 칸, `1`은 벽이다. 한 번에 상하좌우로 한 칸씩 움직일 수 있다.',
      '출발점에서 도착점까지 가는 **최단 거리(움직인 칸 수)** 를 BFS로 구하는 프로그램을 작성하시오. 갈 수 없으면 `-1`을 출력한다.',
    ],
    input: ['첫째 줄에 `N`과 `M`이 주어진다. (1 ≤ N, M ≤ 30)', '다음 `N`줄에 미로의 각 줄이 `0`과 `1`로 공백을 두고 주어진다.', '마지막 줄에 출발점 `sx sy`와 도착점 `gx gy`가 주어진다. 좌표는 (행, 열)이고 0부터 센다. 출발점과 도착점은 항상 `0`이다.'],
    output: ['최단 거리를 출력한다. 도착할 수 없으면 `-1`을 출력한다.'],
    examples: [
      { input: [...MATERIAL_MAZE, '0 0 4 4'].join('\n'), output: '8' },
      { input: [...MATERIAL_MAZE, '0 0 0 4'].join('\n'), output: '8' },
    ],
    template: py`
n, m = map(int, input().split())
maze = [list(map(int, input().split())) for _ in range(n)]
sx, sy, gx, gy = map(int, input().split())
`,
    solution: py`
from collections import deque

# 상하좌우 이동
moves = [(-1, 0), (1, 0), (0, -1), (0, 1)]

def maze_bfs(maze, start, goal):
    n, m = len(maze), len(maze[0])
    dist = {start: 0}
    queue = deque([start])

    while queue:
        x, y = queue.popleft()
        if (x, y) == goal:
            return dist[(x, y)]

        for dx, dy in moves:
            nx, ny = x + dx, y + dy
            if 0 <= nx < n and 0 <= ny < m:      # 격자 밖으로 나가지 않기
                if maze[nx][ny] == 0 and (nx, ny) not in dist:
                    dist[(nx, ny)] = dist[(x, y)] + 1
                    queue.append((nx, ny))

    return -1                                     # 도달 불가


n, m = map(int, input().split())
maze = [list(map(int, input().split())) for _ in range(n)]
sx, sy, gx, gy = map(int, input().split())
print(maze_bfs(maze, (sx, sy), (gx, gy)))
`,
    tests: [
      { input: [...MATERIAL_MAZE, '0 0 4 4'].join('\n') }, { input: [...MATERIAL_MAZE, '0 0 0 4'].join('\n') }, { input: [...MATERIAL_MAZE, '4 0 0 3'].join('\n') },
      { input: ['3 3', '0 1 0', '0 1 0', '0 1 0', '0 0 2 2'].join('\n') },
      { input: ['5 5', '0 0 0 0 0', '0 0 0 0 0', '0 0 0 0 0', '0 0 0 0 0', '0 0 0 0 0', '2 2 0 0'].join('\n') },
      { input: ['4 6', '0 0 0 0 0 0', '0 0 0 0 0 0', '0 0 0 0 0 0', '0 0 0 0 0 0', '0 0 3 5'].join('\n') },
      { input: ['1 1', '0', '0 0 0 0'].join('\n') },
      { gen: py`
import random
random.seed(3)
n, m = 30, 30
print(n, m)
for i in range(n):
    row = []
    for j in range(m):
        wall = 1 if random.random() < 0.25 else 0
        if (i, j) in ((0, 0), (n - 1, m - 1)):
            wall = 0
        row.append(wall)
    print(*row)
print(0, 0, n - 1, m - 1)
` },
    ],
    tips: [
      '자료 코드는 `queue.pop()`이에요. 그러면 뒤에서 꺼내 스택처럼 움직여서 BFS가 아니고, 미로에 따라 최단 거리보다 길게 나와요. 숨은 테스트에 그런 미로가 있어요. 꼭 `popleft()`!',
      '범위 검사를 빼면 파이썬은 `maze[-1][0]`처럼 음수 인덱스를 허용해서 반대편 칸으로 넘어가요.',
      '좌표는 튜플로 써야 딕셔너리 키나 집합에 넣을 수 있어요.',
    ],
    source: '6. DFS와 BFS · 5 격자에서의 탐색',
  },
  {
    id: 'info-12', chapter: 'graph', title: '섬의 개수 (격자 덩어리)',
    statement: ['`N`×`M` 지도에서 `1`은 땅, `0`은 바다다. 상하좌우로 붙어 있는 땅은 하나의 섬이다. 섬이 몇 개인지 세는 프로그램을 작성하시오.', '격자도 그래프다. 각 칸이 정점이고 상하좌우 칸이 이웃이다.'],
    input: ['첫째 줄에 `N`과 `M`이 주어진다. (1 ≤ N, M ≤ 30)', '다음 `N`줄에 지도의 각 줄이 `0`과 `1`로 공백을 두고 주어진다.'],
    output: ['섬의 개수를 출력한다.'],
    examples: [{ input: '4 5\n1 1 0 0 1\n1 0 0 1 1\n0 0 1 0 0\n1 0 1 1 0', output: '4' }],
    template: py`
n, m = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(n)]
`,
    solution: py`
from collections import deque

moves = [(-1, 0), (1, 0), (0, -1), (0, 1)]

n, m = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(n)]

visited = set()
count = 0
for i in range(n):
    for j in range(m):
        if grid[i][j] == 1 and (i, j) not in visited:
            count += 1
            queue = deque([(i, j)])
            visited.add((i, j))
            while queue:
                x, y = queue.popleft()
                for dx, dy in moves:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < n and 0 <= ny < m:
                        if grid[nx][ny] == 1 and (nx, ny) not in visited:
                            visited.add((nx, ny))
                            queue.append((nx, ny))
print(count)
`,
    tests: [
      { input: '4 5\n1 1 0 0 1\n1 0 0 1 1\n0 0 1 0 0\n1 0 1 1 0' }, { input: '3 3\n1 0 1\n0 1 0\n1 0 1' }, { input: '2 2\n0 0\n0 0' },
      { input: '3 4\n1 1 1 1\n1 1 1 1\n1 1 1 1' }, { input: '1 5\n1 0 1 0 1' },
      { gen: py`
import random
random.seed(12)
n, m = 30, 30
print(n, m)
for i in range(n):
    print(*[1 if random.random() < 0.45 else 0 for j in range(m)])
` },
    ],
    tips: ['격자 탐색 3요소: `moves` 튜플 리스트, 범위 검사 `0 <= nx < n and 0 <= ny < m`, 좌표는 튜플.', '대각선은 붙어 있어도 다른 섬이에요(상하좌우만).'],
    source: '6. DFS와 BFS · 4-1 + 5 격자 (응용)',
  },

  // ───────────── 7. 시간 복잡도 ─────────────
  {
    id: 'info-13', chapter: 'time', title: '최고차항만 남기기',
    statement: ['연산 횟수가 n에 대한 다항식으로 주어질 때 빅오(O) 표기를 출력하는 프로그램을 작성하시오.', '빅오로 쓸 때는 ① 낮은 차수를 버리고 ② 계수를 버린다. 예: `3n² + 5n + 7` → `O(n^2)`.'],
    input: ['첫째 줄에 다항식의 차수 자리 `K`가 주어진다. (0 ≤ K ≤ 6)', '둘째 줄에 nᴷ, nᴷ⁻¹, …, n⁰의 계수 `K+1`개가 높은 차수부터 주어진다. 계수는 0 이상 1000 이하이고, 적어도 하나는 0이 아니다.'],
    output: ['상수만 남으면 `O(1)`, 최고차항이 n이면 `O(n)`, 2차 이상이면 `O(n^차수)`를 출력한다.'],
    examples: [{ input: '2\n3 5 7', output: 'O(n^2)' }, { input: '3\n0 1 1000 0', output: 'O(n^2)' }, { input: '1\n100 0', output: 'O(n)' }],
    template: py`
k = int(input())
coef = list(map(int, input().split()))   # 높은 차수부터
`,
    solution: py`
k = int(input())
coef = list(map(int, input().split()))   # 높은 차수부터

degree = 0
for i in range(k + 1):
    if coef[i] != 0:              # 0이 아닌 첫 항이 최고차항
        degree = k - i
        break

if degree == 0:
    print("O(1)")
elif degree == 1:
    print("O(n)")
else:
    print("O(n^" + str(degree) + ")")
`,
    tests: [
      { input: '2\n3 5 7' }, { input: '3\n0 1 1000 0' }, { input: '1\n100 0' }, { input: '0\n7' }, { input: '2\n0 0 9' },
      { input: '6\n1 0 0 0 0 0 0' }, { input: '4\n0 0 0 2 1' }, { input: '2\n1 1000 0' },
    ],
    tips: ['`n² + 1000n`도 O(n²): n이 커지면 1000n의 비중은 사라져요(n = 10만이면 약 1%).', '`2n`, `100n`, `n / 2`는 모두 O(n). 계수는 “얼마나 느린가”만 바꾸고 “얼마나 빨리 나빠지는가”는 못 바꿔요.'],
    source: '7. 시간 복잡도 · 2 최고차항만 남긴다',
  },
  {
    id: 'info-14', chapter: 'time', title: '1초 역산표',
    statement: ['파이썬은 1초에 대략 1천만 ~ 2천만 번의 단순 연산을 한다. 입력 크기 `N`이 주어질 때, 1초 안에 끝내려면 허용되는 시간 복잡도를 역산표대로 출력하는 프로그램을 작성하시오.', '역산표: N ≤ 20 → O(2^n), N ≤ 500 → O(n^3), N ≤ 5,000 → O(n^2), N ≤ 1,000,000 → O(n log n), N ≤ 10,000,000 → O(n).'],
    input: ['첫째 줄에 질문 수 `T`가 주어진다. (1 ≤ T ≤ 20)', '다음 `T`줄에 `N`이 하나씩 주어진다. (1 ≤ N ≤ 10,000,000)'],
    output: ['질문마다 허용되는 복잡도를 한 줄에 하나씩 출력한다.'],
    examples: [{ input: '3\n20\n3000\n1000000', output: 'O(2^n)\nO(n^2)\nO(n log n)' }],
    template: py`
t = int(input())
for _ in range(t):
    n = int(input())
`,
    solution: py`
t = int(input())
for _ in range(t):
    n = int(input())
    if n <= 20:
        print("O(2^n)")
    elif n <= 500:
        print("O(n^3)")
    elif n <= 5000:
        print("O(n^2)")
    elif n <= 1000000:
        print("O(n log n)")
    else:
        print("O(n)")
`,
    tests: [
      { input: '3\n20\n3000\n1000000' }, { input: '5\n1\n21\n500\n501\n5000' }, { input: '4\n5001\n999999\n1000001\n10000000' }, { input: '2\n300\n7000000' },
    ],
    tips: ['대표 방법: O(2ⁿ) 모든 부분집합, O(n³) 삼중 반복문, O(n²) 이중 반복문, O(n log n) 정렬 · 이진탐색, O(n) 한 번 훑기.'],
    source: '7. 시간 복잡도 · 3-3 역산표',
  },
  {
    id: 'info-15', chapter: 'time', title: '명단 확인 (리스트 → 집합)',
    statement: ['출석부에 학생 번호 N개가 있다. 확인할 번호 M개가 주어질 때, 각 번호가 출석부에 있으면 `1`, 없으면 `0`을 출력하는 프로그램을 작성하시오.', '⏱ 숨은 테스트는 N, M이 10만이다. `x in 리스트`는 O(n)이라 시간 안에 못 끝낸다.'],
    input: ['첫째 줄에 `N`과 `M`이 주어진다. (1 ≤ N, M ≤ 100,000)', '둘째 줄에 출석부 번호 `N`개, 셋째 줄에 확인할 번호 `M`개가 주어진다. (1 ≤ 번호 ≤ 1,000,000)'],
    output: ['확인할 번호마다 `1` 또는 `0`을 공백으로 구분해 한 줄에 출력한다.'],
    examples: [{ input: '5 4\n10 3 7 25 4\n7 8 25 1', output: '1 0 1 0' }],
    template: py`
n, m = map(int, input().split())
names = list(map(int, input().split()))
queries = list(map(int, input().split()))
`,
    solution: py`
n, m = map(int, input().split())
names = set(map(int, input().split()))     # 리스트면 in 이 O(n), 집합이면 O(1)
queries = list(map(int, input().split()))

answer = []
for x in queries:
    if x in names:
        answer.append(1)
    else:
        answer.append(0)
print(*answer)
`,
    limit: 3,
    tests: [
      { input: '5 4\n10 3 7 25 4\n7 8 25 1' }, { input: '1 1\n5\n5' }, { input: '3 3\n1 2 3\n4 5 6' },
      { gen: py`
import random
random.seed(15)
n = m = 100000
print(n, m)
print(*random.sample(range(1, 1000001), n))
print(*[random.randint(1, 1000000) for _ in range(m)])
` },
    ],
    tips: ['숨은 O(n): `x in 리스트` O(n) vs `x in 집합`, `x in 딕셔너리` O(1).', '반복문은 한 겹이어도 안에 `in 리스트`가 있으면 O(n²)이에요.'],
    source: '7. 시간 복잡도 · 3-1 숨은 O(n)',
  },
  {
    id: 'info-16', chapter: 'time', title: '중복 없이 (f5 고치기)',
    statement: ['수 N개가 주어질 때, 처음 나온 순서를 지키면서 중복을 지운 결과를 출력하는 프로그램을 작성하시오.', '자료의 `f5`처럼 `if x not in result`(리스트)로 확인하면 겉보기엔 한 겹이지만 실제로는 O(n²)이다. 이미 본 수를 집합에 따로 기억해 O(n)으로 만든다.'],
    input: ['첫째 줄에 `N`이 주어진다. (1 ≤ N ≤ 100,000)', '둘째 줄에 수 `N`개가 주어진다.'],
    output: ['중복을 지운 수들을 처음 나온 순서대로 공백으로 구분해 출력한다.'],
    examples: [{ input: '8\n3 1 3 2 1 5 2 3', output: '3 1 2 5' }],
    template: py`
n = int(input())
arr = list(map(int, input().split()))
`,
    solution: py`
n = int(input())
arr = list(map(int, input().split()))

result = []
seen = set()
for x in arr:
    if x not in seen:        # 리스트 result에서 찾으면 O(n) → 전체 O(n²)
        result.append(x)
        seen.add(x)
print(*result)
`,
    limit: 3,
    tests: [
      { input: '8\n3 1 3 2 1 5 2 3' }, { input: '1\n42' }, { input: '5\n7 7 7 7 7' }, { input: '6\n-1 0 -1 1 0 2' },
      { gen: py`
import random
random.seed(16)
n = 100000
print(n)
print(*[random.randint(1, 10**9) for _ in range(n)])
` },
    ],
    tips: ['자료 마크다운의 “⚠️ f4를 조심”은 내용상 `f5`(`x not in result`) 이야기예요.'],
    source: '7. 시간 복잡도 · 3-1 코드만 보고 알아내기 (f5)',
  },
  {
    id: 'info-17', chapter: 'time', title: '카드 버리기 (pop(0) → deque)',
    statement: ['1부터 N까지 번호가 적힌 카드가 1번이 맨 위가 되게 쌓여 있다. 카드가 한 장 남을 때까지 다음을 반복한다: 맨 위 카드를 버리고, 그다음 맨 위 카드를 맨 아래로 옮긴다.', '마지막에 남는 카드를 출력하는 프로그램을 작성하시오. 리스트의 `pop(0)`은 O(n)이라 N이 크면 시간이 모자란다.'],
    input: ['첫째 줄에 `N`이 주어진다. (1 ≤ N ≤ 500,000)'],
    output: ['마지막에 남는 카드 번호를 출력한다.'],
    examples: [{ input: '6', output: '4' }, { input: '7', output: '6' }],
    template: py`
n = int(input())
`,
    solution: py`
from collections import deque

n = int(input())
cards = deque(range(1, n + 1))

while len(cards) > 1:
    cards.popleft()                    # 맨 위 카드 버리기
    cards.append(cards.popleft())      # 다음 맨 위 카드를 맨 아래로
print(cards[0])
`,
    limit: 3,
    tests: [{ input: '6' }, { input: '7' }, { input: '1' }, { input: '2' }, { input: '1000' }, { input: '500000' }],
    tips: ['`리스트.pop(0)`, `리스트.insert(0, x)`는 뒤의 원소를 전부 한 칸씩 옮겨서 O(n). `deque.popleft()`는 O(1).', '`리스트.pop()`, `리스트.append(x)`는 원래 O(1)이에요.'],
    source: '7. 시간 복잡도 · 3-1 숨은 O(n) (응용)',
  },
  {
    id: 'info-18', chapter: 'time', title: '겹치는 수 세기 (q5 고치기)',
    statement: ['수 N개 중에서, 자기와 같은 수가 리스트에 하나 이상 더 있는 원소는 몇 개인지 세는 프로그램을 작성하시오.', '자료의 `q5`는 `arr.count(x)`를 원소마다 불러서 O(n²)이다. 딕셔너리로 한 번 훑어 개수를 세어 두면 O(n)이다.'],
    input: ['첫째 줄에 `N`이 주어진다. (1 ≤ N ≤ 100,000)', '둘째 줄에 수 `N`개가 주어진다.'],
    output: ['조건에 맞는 원소의 개수를 출력한다.'],
    examples: [{ input: '6\n1 2 2 3 3 3', output: '5' }, { input: '4\n5 6 7 8', output: '0' }],
    template: py`
n = int(input())
arr = list(map(int, input().split()))
`,
    solution: py`
n = int(input())
arr = list(map(int, input().split()))

freq = {}
for x in arr:
    freq[x] = freq.get(x, 0) + 1     # 한 번 훑으며 개수 세기

count = 0
for x in arr:
    if freq[x] > 1:                  # arr.count(x) 는 O(n)
        count += 1
print(count)
`,
    limit: 3,
    tests: [
      { input: '6\n1 2 2 3 3 3' }, { input: '4\n5 6 7 8' }, { input: '1\n9' }, { input: '5\n4 4 4 4 4' },
      { gen: py`
import random
random.seed(18)
n = 100000
print(n)
print(*[random.randint(1, 150000) for _ in range(n)])
` },
    ],
    tips: ['`리스트.count(x)`, `min()`, `max()`, `sum()`도 전부 한 번씩 훑는 O(n)이에요.'],
    source: '7. 시간 복잡도 · 3-3 연습 (q5)',
  },

  // ───────────── 7. 완전탐색 ─────────────
  {
    id: 'info-19', chapter: 'brute', title: '두 수의 합',
    statement: ['리스트에서 더해서 `target`이 되는 두 수를 완전탐색으로 찾는 프로그램을 작성하시오. 서로 다른 위치의 두 수여야 한다.', '`i`를 앞에서부터, 그 뒤의 `j`를 차례로 확인하다가 처음 찾은 쌍을 출력한다. 확인하는 쌍의 수는 n × (n − 1) / 2다.'],
    input: ['첫째 줄에 `n`과 `target`이 주어진다. (2 ≤ n ≤ 1,000)', '둘째 줄에 수 `n`개가 주어진다.'],
    output: ['처음 찾은 두 수를 공백으로 구분해 출력한다. 없으면 `None`을 출력한다.'],
    examples: [{ input: '5 18\n2 7 11 15 3', output: '7 11' }, { input: '5 100\n2 7 11 15 3', output: 'None' }],
    template: py`
n, target = map(int, input().split())
arr = list(map(int, input().split()))
`,
    solution: py`
def two_sum(arr, target):
    n = len(arr)
    for i in range(n):
        for j in range(i + 1, n):
            if arr[i] + arr[j] == target:
                return (arr[i], arr[j])
    return None


n, target = map(int, input().split())
arr = list(map(int, input().split()))
pair = two_sum(arr, target)
if pair is None:
    print("None")
else:
    print(pair[0], pair[1])
`,
    tests: [
      { input: '5 18\n2 7 11 15 3' }, { input: '5 100\n2 7 11 15 3' }, { input: '2 10\n5 1' }, { input: '3 10\n5 1 5' },
      { input: '6 0\n-4 9 4 2 -2 7' }, { input: '4 6\n3 3 3 3' },
    ],
    tips: ['`range(i, n)`로 쓰면 같은 수를 두 번 더해요(5 + 5 = 10). 숨은 테스트에 있어요.', '“일단 완전탐색으로 풀어 보고, 시간이 부족하면 개선.” n = 10만이면 약 50억 쌍 → 불가능.'],
    source: '7. 완전탐색 · 4-2 두 수의 합',
  },
  {
    id: 'info-20', chapter: 'brute', title: '자릿수의 합',
    statement: ['세 자리 수(100 ~ 999) 중 각 자리 숫자의 합이 `S`인 수는 몇 개인지 완전탐색으로 세는 프로그램을 작성하시오. 900번만 확인하면 되니 완전탐색으로 충분하다.'],
    input: ['첫째 줄에 `S`가 주어진다. (1 ≤ S ≤ 27)'],
    output: ['개수를 출력한다.'],
    examples: [{ input: '15', output: '69' }, { input: '2', output: '3' }],
    template: py`
s = int(input())
`,
    solution: py`
s = int(input())
count = 0
for n in range(100, 1000):
    a = n // 100            # 백의 자리
    b = (n // 10) % 10    # 십의 자리
    c = n % 10           # 일의 자리
    if a + b + c == s:
        count += 1
print(count)
`,
    tests: [{ input: '15' }, { input: '2' }, { input: '1' }, { input: '27' }, { input: '10' }, { input: '20' }],
    source: '7. 완전탐색 · 4-3 자릿수 합',
  },
  {
    id: 'info-21', chapter: 'brute', title: '주사위 두 개의 합',
    statement: ['주사위 두 개를 굴려 눈의 합이 `S`가 되는 경우의 수와 그 경우들을 완전탐색으로 구하는 프로그램을 작성하시오.'],
    input: ['첫째 줄에 `S`가 주어진다. (1 ≤ S ≤ 20)'],
    output: ['첫째 줄에 경우의 수를 출력한다.', '다음 줄부터 첫 번째 주사위 눈이 작은 순서로 `a b`를 한 줄에 하나씩 출력한다.'],
    examples: [{ input: '7', output: '6\n1 6\n2 5\n3 4\n4 3\n5 2\n6 1' }],
    template: py`
s = int(input())
`,
    solution: py`
s = int(input())
count = 0
cases = []
for a in range(1, 7):
    for b in range(1, 7):
        if a + b == s:
            count += 1
            cases.append((a, b))

print(count)
for a, b in cases:
    print(a, b)
`,
    tests: [{ input: '7' }, { input: '2' }, { input: '12' }, { input: '9' }, { input: '1' }, { input: '13' }],
    tips: ['`range(1, 7)`은 1 ~ 6이에요. 끝 숫자는 안 들어가요.'],
    source: '7. 완전탐색 · 4-3 주사위',
  },
  {
    id: 'info-22', chapter: 'brute', title: '두 개의 카드 (빠르게)',
    statement: ['「두 개의 카드」와 같은 문제인데 카드가 훨씬 많다. 빨간 카드 하나와 파란 카드 하나의 합이 K가 되는 방법이 있는지 확인하는 프로그램을 작성하시오.', '⏱ n이 10만이면 이중 반복문은 100억 번이라 시간 초과다. 빨간 카드 `p`마다 `k - p`가 파란 카드에 있는지 집합으로 O(1)에 확인한다.'],
    input: ['첫째 줄에 `n`과 `k`가 주어진다. (1 ≤ n ≤ 100,000)', '둘째 줄에 빨간 카드 `n`개, 셋째 줄에 파란 카드 `n`개가 주어진다.'],
    output: ['방법이 있으면 `Yes`, 없으면 `No`를 출력한다.'],
    examples: [{ input: '3 100\n17 57 99\n10 36 53', output: 'No' }, { input: '4 0\n-3 5 -1 2\n3 -5 1 -2', output: 'Yes' }],
    template: py`
n, k = map(int, input().split())
P = list(map(int, input().split()))
Q = list(map(int, input().split()))
`,
    solution: py`
n, k = map(int, input().split())
P = list(map(int, input().split()))
Q = list(map(int, input().split()))

blue = set(Q)                 # 집합의 in 은 O(1)
check = False
for p in P:
    if k - p in blue:
        check = True
        break
if check:
    print("Yes")
else:
    print("No")
`,
    limit: 3,
    tests: [
      { input: '3 100\n17 57 99\n10 36 53' }, { input: '4 0\n-3 5 -1 2\n3 -5 1 -2' }, { input: '1 10\n4\n6' },
      { gen: py`
import random
random.seed(22)
n = 100000
print(n, 1)
print(*[random.randrange(0, 10**9, 2) for _ in range(n)])
print(*[random.randrange(0, 10**9, 2) for _ in range(n)])
` },
      { gen: py`
import random
random.seed(23)
n = 100000
P = [random.randint(1, 10**9) for _ in range(n)]
Q = [random.randint(1, 10**9) for _ in range(n)]
Q[-1] = 777 - P[-1]
print(n, 777)
print(*P)
print(*Q)
` },
    ],
    tips: ['완전탐색 O(n²) → 집합 O(n). 같은 문제도 n이 크면 방법을 바꿔야 해요.'],
    source: '엘리스 두 개의 카드 + 7. 시간 복잡도 (응용)',
  },

  // ───────────── 7. 이진탐색 ─────────────
  {
    id: 'info-23', chapter: 'binary', title: '이진탐색 기본',
    statement: ['정렬된 리스트에서 값을 이진탐색으로 찾아 **인덱스(0부터)** 를 출력하는 프로그램을 작성하시오. 없으면 `-1`.', '가운데 값과 비교해서 절반을 버린다. 그래서 데이터가 정렬되어 있어야 한다.'],
    input: ['첫째 줄에 `N`이 주어진다. (1 ≤ N ≤ 100,000)', '둘째 줄에 오름차순으로 정렬된 수 `N`개가 주어진다.', '셋째 줄에 질문 수 `M`, 넷째 줄에 찾을 값 `M`개가 주어진다.'],
    output: ['찾을 값마다 인덱스 또는 `-1`을 공백으로 구분해 한 줄에 출력한다.'],
    examples: [{ input: '8\n1 3 5 7 9 11 13 15\n3\n7 15 8', output: '3 7 -1' }],
    template: py`
n = int(input())
arr = list(map(int, input().split()))
m = int(input())
targets = list(map(int, input().split()))
`,
    solution: py`
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1

    while low <= high:
        mid = (low + high) // 2

        if arr[mid] == target:
            return mid              # 찾음! 위치를 반환
        elif arr[mid] < target:
            low = mid + 1              # 오른쪽 절반만 남김
        else:
            high = mid - 1             # 왼쪽 절반만 남김

    return -1                       # 없음


n = int(input())
arr = list(map(int, input().split()))
m = int(input())
targets = list(map(int, input().split()))
print(*[binary_search(arr, t) for t in targets])
`,
    limit: 3,
    tests: [
      { input: '8\n1 3 5 7 9 11 13 15\n3\n7 15 8' }, { input: '1\n4\n3\n4 3 5' }, { input: '2\n1 2\n4\n1 2 0 3' },
      { input: '7\n-9 -5 0 2 4 8 100\n5\n-9 100 4 1 -10' },
      { gen: py`
import random
random.seed(23)
n = 100000
arr = sorted(random.sample(range(-10**6, 10**6), n))
print(n)
print(*arr)
print(n)
print(*[random.randint(-10**6, 10**6) for _ in range(n)])
`, limit: 5 },
    ],
    tips: ['흔한 실수 ② `low = mid`로 쓰면 범위가 안 줄어서 무한 루프. 반드시 `+1`, `-1`.', '흔한 실수 ③ `while low < high`면 원소가 하나 남았을 때 확인하지 않고 끝나요.'],
    source: '7. 이진탐색 · 5-2 · 5-5',
  },
  {
    id: 'info-24', chapter: 'binary', title: '업다운 게임',
    statement: ['“1부터 N 중 하나를 맞혀 보세요. 업/다운만 알려 드립니다.” 매번 남은 범위의 한가운데 `(low + high) // 2`를 부르면 몇 번 만에 맞히는지 출력하는 프로그램을 작성하시오.', '하나씩 부르면 최대 1000번이지만, 한가운데를 부르면 1000개에서도 최대 10번이다.'],
    input: ['첫째 줄에 `N`과 정답 `X`가 주어진다. (1 ≤ X ≤ N ≤ 1,000,000,000)'],
    output: ['부른 횟수를 출력한다.'],
    examples: [{ input: '1000 500', output: '1' }, { input: '1000 1', output: '9' }],
    template: py`
n, x = map(int, input().split())
`,
    solution: py`
n, x = map(int, input().split())
low = 1
high = n
count = 0
while low <= high:
    mid = (low + high) // 2
    count += 1
    if mid == x:
        break
    elif mid < x:          # 업!
        low = mid + 1
    else:                  # 다운!
        high = mid - 1
print(count)
`,
    tests: [{ input: '1000 500' }, { input: '1000 1' }, { input: '1000 1000' }, { input: '1 1' }, { input: '100 37' }, { input: '1000000 999999' }, { input: '1000000000 123456789' }],
    tips: ['n개일 때 최대 횟수는 약 log₂ n: 100개 7번, 1000개 10번, 100만 개 20번, 10억 개 30번.'],
    source: '7. 이진탐색 · 5-1 · 5-3',
  },
  {
    id: 'info-25', chapter: 'binary', title: '정렬부터!',
    statement: ['**정렬되지 않은** 수 N개가 주어진다. 질문으로 주어지는 수가 있는지 이진탐색으로 확인하는 프로그램을 작성하시오.', '흔한 실수 ①: 정렬하지 않고 이진탐색을 하면 오류가 나지 않고 엉뚱한 답이 나와서 더 위험하다.'],
    input: ['첫째 줄에 `N`과 `M`이 주어진다. (1 ≤ N, M ≤ 100,000)', '둘째 줄에 정렬되지 않은 수 `N`개, 셋째 줄에 질문 `M`개가 주어진다.'],
    output: ['질문마다 있으면 `1`, 없으면 `0`을 공백으로 구분해 한 줄에 출력한다.'],
    examples: [{ input: '5 3\n5 2 8 1 9\n8 3 1', output: '1 0 1' }],
    template: py`
n, m = map(int, input().split())
arr = list(map(int, input().split()))
queries = list(map(int, input().split()))
`,
    solution: py`
def binary_search(arr, target):
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return True
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return False


n, m = map(int, input().split())
arr = list(map(int, input().split()))
queries = list(map(int, input().split()))

arr.sort()                     # 이진탐색의 딱 하나의 전제 조건
answer = []
for q in queries:
    if binary_search(arr, q):
        answer.append(1)
    else:
        answer.append(0)
print(*answer)
`,
    limit: 3,
    tests: [
      { input: '5 3\n5 2 8 1 9\n8 3 1' }, { input: '4 4\n40 10 30 20\n10 20 30 40' }, { input: '1 2\n3\n3 4' },
      { gen: py`
import random
random.seed(25)
n = m = 100000
print(n, m)
print(*[random.randint(1, 10**6) for _ in range(n)])
print(*[random.randint(1, 10**6) for _ in range(m)])
`, limit: 5 },
    ],
    tips: ['정렬은 O(n log n)이고 한 번만 하면 돼요. 그 뒤 질문마다 O(log n).'],
    source: '7. 이진탐색 · 5-5 흔한 실수 ①',
  },
  {
    id: 'info-26', chapter: 'binary', title: '떡 자르기',
    statement: ['떡 N개의 높이가 주어진다. 절단기 높이를 H로 정하면, H보다 높은 떡은 윗부분(높이 − H)이 잘려 손님에게 간다. 잘린 떡 길이의 합이 적어도 M이 되게 하는 H의 최댓값을 구하는 프로그램을 작성하시오.', '「리본 자르기」처럼 **답(H)을 이진탐색** 한다. H가 낮을수록 잘린 양이 많아진다.'],
    input: ['첫째 줄에 `N`과 `M`이 주어진다. (1 ≤ N ≤ 10,000, 1 ≤ M ≤ 2,000,000,000)', '둘째 줄에 떡의 높이 `N`개가 주어진다. (1 ≤ 높이 ≤ 1,000,000,000) 높이의 합은 항상 M 이상이다.'],
    output: ['H의 최댓값을 출력한다.'],
    examples: [{ input: '4 6\n19 15 10 17', output: '15' }],
    template: py`
n, m = map(int, input().split())
rice = list(map(int, input().split()))
`,
    solution: py`
n, m = map(int, input().split())
rice = list(map(int, input().split()))

low = 0
high = max(rice)
answer = 0
while low <= high:
    mid = (low + high) // 2      # 절단기 높이
    total = 0
    for h in rice:
        if h > mid:
            total = total + h - mid
    if total >= m:
        answer = mid             # 이 높이도 된다 → 더 높여 본다
        low = mid + 1
    else:
        high = mid - 1
print(answer)
`,
    limit: 3,
    tests: [
      { input: '4 6\n19 15 10 17' }, { input: '1 1\n10' }, { input: '3 30\n10 10 10' }, { input: '5 3\n4 4 4 4 4' },
      { gen: py`
import random
random.seed(26)
n = 10000
print(n, 1000000000)
print(*[random.randint(1, 10**9) for _ in range(n)])
`, limit: 5 },
    ],
    tips: ['높이를 0부터 하나씩 올려 보면 최대 10억 번 → 시간 초과. 이진탐색은 30번이면 끝나요.'],
    source: '7. 이진탐색 + 엘리스 리본 자르기 (응용)',
  },];

/** 정답 코드. */
export const solutionOf = (problem: EliceProblem): string => problem.solution;
