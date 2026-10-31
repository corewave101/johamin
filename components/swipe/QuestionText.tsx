// 문제 질문(4.11.0~): "알맞지 않은 것 · 아닌 것 · 볼 수 없는 것"처럼 틀린 것을 고르는 말을 빨간색으로 강조한다.
// 스와이프가 빨라서 "않은"을 놓치고 맞는 보기를 미는 실수를 줄이려는 것(학습지가 "않은"에 밑줄을 긋는 것과 같은 역할).
export const NEGATION = /((?:알맞지|적절하지|옳지|맞지|바르지|어울리지)\s?않은|(?:볼|알)\s?수\s?없는|않는|아닌|거리가\s?먼|틀린)(?=\s?(?:것|하나|보기|설명|진술|사람|인물|말))/g;

export const hasNegation = (text: string) => { NEGATION.lastIndex = 0; return NEGATION.test(text); };

export default function QuestionText({ text }: { text: string }) {
  NEGATION.lastIndex = 0;
  const parts = text.split(NEGATION);
  if (parts.length === 1) return <>{text}</>;
  return <>{parts.map((part, i) => i % 2 ? <em key={i} className="q-negation">{part}</em> : part)}</>;
}
