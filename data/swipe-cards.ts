export type Direction = 'up' | 'left' | 'right' | 'down';
export interface SwipeCard {
  id: string;
  topic: string;
  subject?: string;
  question: string;
  answers: Record<Direction, string>;
  correct: Direction;
  explanation: string;
  sourceSlide?: number;
  source?: { title: string; url: string; page: number };
}

// A small authored demo deck. Directions are answer choices, not navigation.
export const swipeCards: SwipeCard[] = [
  { id: 'letters', topic: '워밍업', subject: '조하민레츠고', question: '글자 수는?', answers: { up: '5글자', left: '4글자', right: '6글자', down: '7글자' }, correct: 'right', explanation: '조 · 하 · 민 · 레 · 츠 · 고, 모두 6글자.' },
  { id: 'power', topic: '수학', subject: '2³', question: '계산하면?', answers: { up: '8', left: '6', right: '9', down: '5' }, correct: 'up', explanation: '2 × 2 × 2 = 8.' },
  { id: 'length', topic: 'PYTHON', subject: 'len("hello")', question: '실행 결과는?', answers: { up: '4', left: '6', right: '0', down: '5' }, correct: 'down', explanation: 'len()은 문자열의 길이를 반환해요. hello는 5글자.' },
  { id: 'remainder', topic: 'PYTHON', subject: '7 % 3', question: '나머지는?', answers: { up: '3', left: '1', right: '2', down: '0' }, correct: 'left', explanation: '7을 3으로 나누면 몫은 2, 나머지는 1.' },
  { id: 'triangle', topic: '수학', subject: '삼각형', question: '내각의 합은?', answers: { up: '90°', left: '270°', right: '180°', down: '360°' }, correct: 'right', explanation: '평면 위 삼각형의 세 내각을 합하면 180°.' },
  { id: 'index', topic: 'PYTHON', subject: '"python"[0]', question: '어떤 글자?', answers: { up: 'p', left: 'y', right: 'n', down: 't' }, correct: 'up', explanation: '문자열의 인덱스는 0부터. 첫 번째 글자는 p.' },
  { id: 'half', topic: '수학', subject: '80의 25%', question: '얼마일까?', answers: { up: '40', left: '25', right: '10', down: '20' }, correct: 'down', explanation: '25%는 4분의 1. 80 ÷ 4 = 20.' },
  { id: 'bool', topic: 'PYTHON', subject: '3 > 5', question: '참일까?', answers: { up: 'True', left: 'False', right: 'None', down: '오류' }, correct: 'left', explanation: '3은 5보다 작으므로 비교 결과는 False.' },
  { id: 'range', topic: 'PYTHON', subject: 'list(range(3))', question: '마지막 숫자는?', answers: { up: '3', left: '1', right: '2', down: '0' }, correct: 'right', explanation: 'range(3)은 0, 1, 2. 끝값 3은 포함하지 않아요.' },
  { id: 'square', topic: '수학', subject: '√81', question: '값은?', answers: { up: '9', left: '8', right: '18', down: '27' }, correct: 'up', explanation: '9 × 9 = 81이므로 √81 = 9.' },
  { id: 'list', topic: 'PYTHON', subject: '[10, 20, 30]', question: '원소의 개수는?', answers: { up: '2', left: '30', right: '60', down: '3' }, correct: 'down', explanation: '10, 20, 30 세 개의 원소가 들어 있어요.' },
  { id: 'floor', topic: 'PYTHON', subject: '9 // 2', question: '실행 결과는?', answers: { up: '4.5', left: '4', right: '5', down: '1' }, correct: 'left', explanation: '//는 내림 나눗셈. 9 // 2 = 4.' },
];
