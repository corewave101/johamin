import type { ConceptLesson } from './study-concepts';
import { mathTrigFinalCards, mathTrigSource, MATH_TRIG_TOPICS } from './math-trig-final-cards';

// 기말고사 · 수학(황종철T) 개념원리 170~173쪽 「일반각에 대한 삼각함수의 성질」을 네 단원으로 정리했다.
// 각 단원의 예시는 같은 단원의 객관식 카드 전부다(카드를 고치면 예시도 같이 바뀐다).
const [T1, T2, T3, T4, T5, T6, T7, T8] = MATH_TRIG_TOPICS;
const examplesFor = (topics: string[]) => mathTrigFinalCards
  .filter(card => topics.includes(card.topic))
  .map(card => ({ id: card.id, context: card.question, explanation: card.explanation, sourceNote: card.sourceNote ?? mathTrigSource(170) }));

const lesson = (id: string, title: string, topicKeys: string[], page: number, summary: string, sections: ConceptLesson['sections']): ConceptLesson => ({
  id, deckId: 'math-trig-final', title, summary, sections, topicKeys, sourceNote: mathTrigSource(page),
  examplesLabel: '문제로 확인', examples: examplesFor(topicKeys),
});

export const mathTrigFinalConcepts: ConceptLesson[] = [
  lesson('math-trig-final-concept-1', '2nπ + x와 −x의 삼각함수', [T1, T2], 170,
    '동경이 한 바퀴(2π) 돌면 제자리라 삼각함수 값이 그대로다. −x는 그래프의 대칭으로 본다. sin과 tan은 원점 대칭이라 부호가 바뀌고, cos은 y축 대칭이라 그대로다.',
    [
      { heading: '2nπ + x의 삼각함수 (n은 정수)', points: [
        'sin(2nπ + x) = sin x, cos(2nπ + x) = cos x, tan(2nπ + x) = tan x',
        '도(°)로 쓰면 360°×n + x. 예: sin 390° = sin(360° + 30°) = sin 30° = 1/2',
        'tan은 주기가 π라 tan(nπ + x) = tan x도 된다.',
      ] },
      { heading: '−x의 삼각함수', points: [
        'sin(−x) = −sin x (y = sin x는 원점 대칭)',
        'cos(−x) = cos x (y = cos x는 y축 대칭)',
        'tan(−x) = −tan x (y = tan x는 원점 대칭)',
      ] },
      { heading: '자주 쓰는 값', table: { columns: ['', '0', 'π/6 (30°)', 'π/4 (45°)', 'π/3 (60°)', 'π/2 (90°)'], rows: [
        ['sin', '0', '1/2', '√2/2', '√3/2', '1'],
        ['cos', '1', '√3/2', '√2/2', '1/2', '0'],
        ['tan', '0', '√3/3', '1', '√3', '없음'],
      ] } },
    ]),
  lesson('math-trig-final-concept-2', 'π ± x와 π/2 ± x의 삼각함수', [T3, T4], 170,
    'y = sin x, y = cos x의 그래프를 x축 방향으로 −π, −π/2만큼 평행이동해 겹쳐 보면 공식이 나온다. π가 붙으면 함수는 그대로, π/2가 붙으면 sin과 cos이 서로 바뀌고 tan은 1/tan이 된다.',
    [
      { heading: 'π ± x의 삼각함수', table: { columns: ['', 'π + x', 'π − x'], rows: [
        ['sin', '−sin x', 'sin x'],
        ['cos', '−cos x', '−cos x'],
        ['tan', 'tan x', '−tan x'],
      ] } },
      { heading: 'π/2 ± x의 삼각함수', table: { columns: ['', 'π/2 + x', 'π/2 − x'], rows: [
        ['sin', 'cos x', 'cos x'],
        ['cos', '−sin x', 'sin x'],
        ['tan', '−1/tan x', '1/tan x'],
      ] } },
      { heading: '외우는 대신', points: [
        'π − x는 x에 π − x를 넣는 대신, π + x 공식의 x 자리에 −x를 넣으면 된다. 예: cos(π − x) = −cos(−x) = −cos x',
        'tan은 sin/cos으로 바꾸면 바로 나온다. 예: tan(π/2 + x) = cos x / (−sin x) = −1/tan x',
        '부호는 x를 예각으로 보고 그 각이 있는 사분면에서 원래 함수의 부호로 확인한다.',
      ] },
    ]),
  lesson('math-trig-final-concept-3', '삼각함수의 각 변환 (90° × n ± θ)', [T5, T6, T8], 171,
    '어떤 각이든 90° × n ± θ (π/2 × n ± θ) 꼴로 나타내고, n이 짝수인지 홀수인지로 함수를, 동경이 있는 사분면으로 부호를 정하면 0°~90°의 삼각함수로 바꿀 수 있다.',
    [
      { heading: '세 단계', points: [
        '(i) 주어진 각을 90° × n ± θ 또는 π/2 × n ± θ (n은 정수) 꼴로 나타낸다.',
        '(ii) n이 짝수이면 함수 그대로, 홀수이면 sin → cos, cos → sin, tan → 1/tan',
        '(iii) 그 각의 동경이 있는 사분면에서 원래 함수의 부호가 양이면 +, 음이면 −. θ의 값이 정해지지 않았으면 θ는 예각으로 본다.',
      ] },
      { heading: '사분면별로 양수인 삼각함수', table: { columns: ['사분면', '제1', '제2', '제3', '제4'], rows: [
        ['양수', '모두', 'sin', 'tan', 'cos'],
      ] } },
      { heading: '예: 교재 408~410번', points: [
        'sin 750° = sin(360° × 2 + 30°) = sin 30° = 1/2',
        'cos 210° = cos(90° × 2 + 30°) → 짝수라 cos 그대로, 제3사분면 cos은 음수 → −cos 30° = −√3/2',
        'tan 240° = tan(90° × 2 + 60°) → 짝수라 tan 그대로, 제3사분면 tan은 양수 → tan 60° = √3',
        '★ cos 7π/6 = cos(π + π/6) = −cos π/6 = −√3/2 (−1/2이 아니다)',
        'sin 11π/4 = sin(π/2 × 5 + π/4) → 홀수라 cos, 제2사분면 sin은 양수 → cos π/4 = √2/2',
      ] },
    ]),
  lesson('math-trig-final-concept-4', '삼각함수표', [T7], 172,
    '삼각함수표에는 0°~90°의 sin, cos, tan 값이 소수 넷째 자리까지 있다. 90°보다 큰 각은 각 변환으로 0°~90°의 삼각함수로 바꾼 뒤 표의 값을 쓴다.',
    [
      { heading: '쓰는 순서', points: [
        '각을 180° ± θ 또는 360° − θ로 나타내 0°~90°의 같은 삼각함수로 바꾼다.',
        '부호를 붙인 뒤 표에서 θ의 값을 찾는다.',
      ] },
      { heading: '예', points: [
        'sin 200° = sin(180° + 20°) = −sin 20° = −0.3420',
        'cos 110° = cos(180° − 70°) = −cos 70° = −0.3420',
        'tan 290° = tan(360° − 70°) = −tan 70° = −2.7475',
      ] },
      { heading: '주의', points: [
        'sin 20°와 cos 70°는 값이 같다(0.3420). sin(90° − θ) = cos θ이기 때문이다.',
        '표의 값은 어림값이라 등호(=) 대신 ≈로 쓰기도 한다.',
      ] },
    ]),
];
