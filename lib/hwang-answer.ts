import type { WrittenQuestion } from '../data/biology-written';
import { hwangAliases } from '../data/hwang-exam';
import { gradeShortAnswer, normalizePracticeAnswer } from './practice-answer';
export function gradeHwangAnswer(input: string, q: WrittenQuestion): boolean {
 if (!input.trim()) return false;
 if (q.question.includes('숫자만')) {
  const value = normalizePracticeAnswer(input);
  return /^\d+(?:\.\d+)?$/.test(value) && Number(value) === Number(q.modelAnswer);
 }
 return [q.modelAnswer, ...(hwangAliases[q.modelAnswer] ?? [])].some(answer => gradeShortAnswer(input, answer));
}
