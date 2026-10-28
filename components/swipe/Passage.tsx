// 문제 지문(4.11.0~): 영어 지문은 그대로, 한국어 지문(국어 덱)은 [대괄호] 부분을 밑줄로 보여 준다.
// 카드 질문의 "밑줄 친 부분"이 가리키는 곳이다. 영어 지문의 대괄호는 건드리지 않는다.
const HANGUL = /[가-힣]/;
const MARK = /\[([^\]\s][^\]]*)\]/g;

export const isKoreanPassage = (text: string) => HANGUL.test(text);

export function PassageText({ text }: { text: string }) {
  if (!isKoreanPassage(text)) return <>{text}</>;
  const parts = text.split(MARK);
  return <>{parts.map((part, i) => i % 2 ? <u key={i} className="passage-mark">{part}</u> : part)}</>;
}

/** 지문 칸의 제목 · 안내 · 언어. kind: 문제 카드('solve') 또는 서술 연습('write'). */
export function passageLabels(text: string, kind: 'solve' | 'write') {
  return isKoreanPassage(text)
    ? { lang: 'ko', summary: '지문', hint: kind === 'solve' ? '밑줄 친 부분과 앞뒤 문맥을 확인하세요.' : '', label: '문제 지문' }
    : { lang: 'en', summary: kind === 'solve' ? 'READ & SOLVE · 문제 지문' : 'READ & WRITE · 관련 영어 지문', hint: kind === 'solve' ? '지문 안에서 스크롤해 끝까지 읽고 카드의 문장·표현을 확인하세요.' : '', label: '영어 문제 지문' };
}
