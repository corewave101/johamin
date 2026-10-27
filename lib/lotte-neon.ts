// 롯데 정답 네온(components/swipe/LotteNeon.tsx)에 켤 문구. 위 줄은 빨강, 아래 줄은 파랑 네온.

export interface AnswerSignal { correct: boolean; unknown: boolean; streakAfter: number; topic?: string }
/** 그냥 맞혔을 때 돌아가며 켜는 문구(위 줄 · 아래 줄). 노래 가사는 쓰지 않는다. */
export const NEON_LINES: [string, string][] = [
  ['마, 함', '해보입시더'],
  ['마!', '정답이다'],
  ['됐다', '마!'],
  ['직이네', '진짜로!'],
  ['롯데', '레츠고!'],
  ['원중이', '레츠고!'],
  ['사직이', '들썩들썩'],
  ['이기 바로', '롯데다'],
  ['와', '미쳤다!'],
  ['홈런', '각이다!'],
  ['완벽한', '스트라이크!'],
  ['오늘도', '이긴다!'],
];

/** 어떤 문구를 켤지: 연속 정답과 찐팬 문제는 따로, 나머지는 돌아가며(같은 문구가 연달아 나오지 않게). */
export function neonFor(signal: AnswerSignal, turn: number): [string, string] | null {
  if (!signal.correct || signal.unknown) return null;
  const n = signal.streakAfter;
  if (n >= 10 && n % 5 === 0) return [`${n}연속`, '우승 각!'];
  if (n === 5) return ['5연속', '가즈아!'];
  if (n === 3) return ['3연속', '정답!'];
  if (signal.topic?.startsWith('찐팬')) return ['찐팬', '인정!'];
  return NEON_LINES[turn % NEON_LINES.length];
}
