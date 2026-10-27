// 롯데 페이지 네온(components/swipe/LotteNeon.tsx)에 켤 문구(4.8.0~, 4.8.1에 부산 사투리 말투로 바꿈).
// 위 줄은 빨강, 아래 줄은 파랑 네온. 틀리면 30%는 원중이가 갑툭튀해서 "뭐라노". 노래 가사는 쓰지 않는다.

export interface AnswerSignal { correct: boolean; unknown: boolean; streakAfter: number; topic?: string }
export type NeonCue =
  | { kind: 'neon'; tone: 'good' | 'bad'; top: string; bottom: string }
  | { kind: 'wonjung'; text: string };

/** 맞혔을 때 돌아가며 켜는 문구. */
export const GOOD_LINES: [string, string][] = [
  ['마, 함', '해보입시더'],
  ['됐다 마!', '이기 정답이다'],
  ['직이네', '진짜로!'],
  ['아따', '잘하네'],
  ['니 쫌', '치나?'],
  ['이기 바로', '롯데다'],
  ['사직이', '들썩들썩한다'],
  ['오늘', '좀 되는데?'],
];
/** 틀렸을 때 돌아가며 켜는 문구(원중이가 안 나올 때). */
export const BAD_LINES: [string, string][] = [
  ['마, 문제에', '집중 안하나?'],
  ['니 지금', '뭐하노'],
  ['아이고 마', '그기 아이다'],
  ['정신', '좀 차리라'],
  ['괜찮다', '다시 함 보자'],
];
/** 틀렸을 때 원중이가 튀어나올 확률. */
export const WONJUNG_CHANCE = 0.3;

/**
 * 어떤 네온을 켤지. 5연속 정답은 "축하할 일이 있어서 축하드립니다", 모름은 "집중 안하나?",
 * 틀리면 30%는 원중이 갑툭튀("뭐라노"), 나머지는 돌아가며.
 */
export function neonFor(signal: AnswerSignal, turn: number, random: () => number = Math.random): NeonCue {
  if (signal.unknown) return { kind: 'neon', tone: 'bad', top: '마, 문제에', bottom: '집중 안하나?' };
  if (!signal.correct) {
    if (random() < WONJUNG_CHANCE) return { kind: 'wonjung', text: '뭐라노' };
    const [top, bottom] = BAD_LINES[turn % BAD_LINES.length];
    return { kind: 'neon', tone: 'bad', top, bottom };
  }
  const n = signal.streakAfter;
  const good = (top: string, bottom: string): NeonCue => ({ kind: 'neon', tone: 'good', top, bottom });
  if (n === 5) return good('축하할 일이 있어서', '축하드립니다');
  if (n >= 10 && n % 5 === 0) return good(`${n}연속이라꼬?`, '우승 가자 마!');
  if (n === 3) return good('3연속이가?', '좀 치네');
  if (signal.topic?.startsWith('찐팬')) return good('찐팬', '인정합니더');
  const [top, bottom] = GOOD_LINES[turn % GOOD_LINES.length];
  return good(top, bottom);
}
