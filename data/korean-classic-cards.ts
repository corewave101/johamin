import type { Direction, SwipeCard } from './swipe-cards';
import type { WrittenQuestion } from './biology-written';
import type { ClassicRow } from './korean-classic/rows';
import { rows as partA } from './korean-classic/part-a';
import { rows as partB } from './korean-classic/part-b';
import { rows as partC } from './korean-classic/part-c';

// 국어(고전 시가): 「우리 시가 문학의 흐름과 특징」 학습지 7~14쪽에서만 출제한다(참고 자료는 해석 확인용).
// 세 파트(A 갈래 흐름 7~9쪽 · B 이별의 정한 9~11쪽 · C 율격·제재 정리 12~14쪽)를 따로 쓰고 서로 다른 검수자가 원본과 대조했다.
// 단원 순서대로 번호를 매긴다. 한번 붙은 id는 바꾸지 않는다(풀이 기록이 id로 저장됨).

export const koreanClassicTopics = ['고대 가요', '향가', '고려 가요', '시조', '가사', '이별의 정한', '율격', '제망매가', '십 년을 경영하여', '나무도 바윗돌도 없는', '평시조와 사설시조'];
export const koreanClassicSourceTitle = '고전 시가 학습지';

const ordered: ClassicRow[] = koreanClassicTopics.flatMap(topic => [...partA, ...partB, ...partC].filter(row => row[4] === topic));
const directions: Direction[] = ['up', 'left', 'right', 'down'];

export const koreanClassicCards: SwipeCard[] = ordered.map(([question, choices, explanation, page, topic], index) => ({
  id: `korean-classic-${String(index + 1).padStart(3, '0')}`,
  topic, question,
  answers: Object.fromEntries(directions.map((direction, i) => [direction, choices[i]])) as Record<Direction, string>,
  correct: 'up' as Direction, explanation,
  sourceNote: `${koreanClassicSourceTitle} · ${page}쪽`,
}));

/** 검토용: 카드 id → ★(필기를 고침)/☆(학습지 문구 확인) 메모. */
export const koreanClassicReview: Record<string, string> = Object.fromEntries(ordered.flatMap((row, index) => row[5] ? [[koreanClassicCards[index].id, row[5]]] : []));

// 단답형·이유 서술 연습(뭉탱이와 같은 방식): 답이 한 낱말·구로 떨어지는 카드만 고른다.
// 짝짓기(A–B, A / B, A·B), 순서(→), '옳지 않은 것'류는 쓰기로 바꾸면 답이 여러 개라 뺀다.
const writable = (card: SwipeCard) => !/[–→/·,]/.test(card.answers[card.correct]) && !/(않은|아닌|않는|못한|못하는|다른 하나|틀린)/.test(card.question);
const practiceOf = (card: SwipeCard, kind: 'short' | 'written'): WrittenQuestion => {
  const answer = card.answers[card.correct];
  return kind === 'short'
    ? { id: `practice-short-${card.id}`, topic: card.topic, question: `${card.question} (답을 하나만 쓰세요.)`, modelAnswer: answer, criteria: [`정답: ${answer}`], sourceNote: card.sourceNote! }
    : { id: `practice-written-${card.id}`, topic: card.topic, question: `${card.question} 답과 그 이유를 연결하여 서술하시오.`, modelAnswer: `${answer}. ${card.explanation}`, criteria: [`답: ${answer}`, '이유를 학습지 개념으로 설명', '답과 이유를 자연스럽게 연결'], sourceNote: card.sourceNote! };
};
const practiceCards = koreanClassicCards.filter(writable);
// 단답형은 정확히 같은 답을 쓰게 되므로 짧은 용어·작품명만(두 어절 이하, 10자 이하, 괄호·문장 없음).
const shortable = (card: SwipeCard) => { const a = card.answers[card.correct]; return Array.from(a).length <= 10 && a.split(' ').length <= 2 && !/[()]/.test(a) && !/다$/.test(a); };
export const koreanClassicPractice = { short: practiceCards.filter(shortable).map(card => practiceOf(card, 'short')), written: practiceCards.map(card => practiceOf(card, 'written')) };
export const koreanClassicWritten: WrittenQuestion[] = [...koreanClassicPractice.short, ...koreanClassicPractice.written];
