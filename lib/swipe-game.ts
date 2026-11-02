import { swipeCards, type Direction, type SwipeCard } from '../data/swipe-cards';

export type AnswerChoice = Direction | 'unknown';
export const RETRY_GAP = 12;
export interface Attempt { card: SwipeCard; direction: AnswerChoice; correct: boolean; seconds: number }
export interface GameState { queue: SwipeCard[]; attempts: Attempt[]; streak: number; bestStreak: number; mastered: string[] }
const directions: Direction[] = ['up', 'left', 'right', 'down'];
function shuffled<T>(items: T[], random: () => number): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export function shuffleAnswers(card: SwipeCard, random = Math.random, changeCorrectDirection = false): SwipeCard {
  const allowed = changeCorrectDirection ? directions.filter(d => d !== card.correct) : directions;
  const correct = allowed[Math.floor(random() * allowed.length)];
  const distractors = shuffled(directions.filter(d => d !== card.correct).map(d => card.answers[d]), random);
  let index = 0;
  const answers = Object.fromEntries(directions.map(d => [d, d === correct ? card.answers[card.correct] : distractors[index++]])) as Record<Direction, string>;
  return { ...card, answers, correct };
}
/** 지문 세트(4.11.0~): 같은 지문을 쓰는 카드는 한 묶음으로 섞이고, 묶음 안에서는 덱 순서대로 나온다. */
function passageUnits(cards: SwipeCard[]): SwipeCard[][] {
  const sets = new Map<string, SwipeCard[]>();
  const units: SwipeCard[][] = [];
  for (const card of cards) {
    const unit = card.passage ? sets.get(card.passage) : undefined;
    if (unit) { unit.push(card); continue; }
    const fresh = [card];
    if (card.passage) sets.set(card.passage, fresh);
    units.push(fresh);
  }
  return units;
}
export function newGame(cards = swipeCards, random = Math.random): GameState {
  return { queue: shuffled(passageUnits(cards), random).flat().map(card => shuffleAnswers(card, random)), attempts: [], streak: 0, bestStreak: 0, mastered: [] };
}
/** Where a retried card goes back in: after RETRY_GAP cards, but never inside another passage set. */
function retrySpot(queue: SwipeCard[]) {
  let at = Math.min(RETRY_GAP, queue.length);
  while (at > 0 && at < queue.length && queue[at].passage && queue[at].passage === queue[at - 1].passage) at++;
  return at;
}
export function answerCard(state: GameState, direction: AnswerChoice, seconds: number, random = Math.random): GameState {
  const card = state.queue[0];
  if (!card) return state;
  const correct = direction === card.correct;
  const queue = state.queue.slice(1);
  // Incorrect and unknown answers return after twelve other cards (or the remaining deck), outside any passage set.
  if (!correct) queue.splice(retrySpot(queue), 0, shuffleAnswers(card, random, true));
  const streak = correct ? state.streak + 1 : 0;
  return { queue, attempts: [...state.attempts, { card, direction, correct, seconds }], streak,
    bestStreak: Math.max(state.bestStreak, streak), mastered: correct ? [...state.mastered, card.id] : state.mastered };
}
export function getStats(state: GameState) {
  const total = state.attempts.length;
  return { accuracy: total ? Math.round(state.attempts.filter(a => a.correct).length / total * 100) : 0,
    average: total ? state.attempts.reduce((sum, a) => sum + a.seconds, 0) / total : 0,
    mistakes: state.attempts.filter(a => !a.correct).length };
}
