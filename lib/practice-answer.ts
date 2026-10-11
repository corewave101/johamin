// Ignore spacing and sentence punctuation; retain signs, decimal points and fractions.
export const normalizePracticeAnswer = (text: string) => text.normalize('NFKC').trim().replace(/[\s,!?，！？“”‘’"'()（）]/g, '').replace(/[。.]$/, '');
export function gradeShortAnswer(input: string, answer: string): boolean {
 if (!input.trim()) return false;
 const entered = normalizePracticeAnswer(input), expected = normalizePracticeAnswer(answer);
 // A/a and B/b carry distinct genetic meanings. Other words and abbreviations ignore case.
 const genetic = /^[ABab]$/.test(answer) || /(?:^|[^A-Za-z])(?:[Aa]{2}|[Bb]{2}|[Aa][Bb]|X[Aa])(?:[^A-Za-z]|$)/.test(answer);
 return genetic ? entered === expected : entered.toLowerCase() === expected.toLowerCase();
}
