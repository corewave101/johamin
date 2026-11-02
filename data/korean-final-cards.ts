import type { Direction, SwipeCard } from './swipe-cards';
import type { WrittenQuestion } from './biology-written';

// 기말고사 · 국어(백은미T): Ⅲ. 우리 문학의 어제와 오늘 — (2) 「춘향전」과 「봉산 탈춤」.
// 근거: 『공통국어2』 교과서 128~135쪽(필기 포함 사진), 「춘향전 · 봉산 탈춤」 학습지 1~6쪽(필기 · 정답 표시 포함),
// 수업 필기 정리(기말고사 공통국어 1~3쪽). '아직 안 배운 것' 자료와 학습지 7쪽 이후는 범위가 아니라 쓰지 않았다.
// 2차(4.11.0~): 학습지 문제 수준으로 다시 썼다 — 원문 지문(passage)을 주고 표현 · 의도 · 기능 · 사회상을 판단하게 한다.
//   지문의 [대괄호]는 밑줄 친 부분이다(화면에서 밑줄로 보인다). 1차 카드(korean-final-001~119)는 쓰지 않고, 번호는 120부터 새로 붙였다.
// ⚠ 카드 id는 만들어지는 순서로 붙는다. 새 카드는 맨 뒤에 붙인다.
export const NOTE = { tb: (page: number) => `백은미T · 공통국어2 교과서 ${page}쪽`, ws: (page: number) => `백은미T · 춘향전·봉산 탈춤 학습지 ${page}쪽`, note: '백은미T · 수업 필기' };

const T1 = "잔치 자리와 어사의 한시", T2 = "어사 출두 장면", T3 = "춘향과의 재회와 결말", T4 = "판소리계 소설의 특징과 주제", T5 = "갈래와 재담 구조", T6 = "말뚝이의 재담과 표현", T7 = "양반들의 놀이 — 시조와 파자", T8 = "취발이 장면과 당대 사회상";
export const KOREAN_FINAL_TOPICS = [T1, T2, T3, T4, T5, T6, T7, T8];

type Src = { tb: number } | { ws: number } | 'note';
type Row = { topic: string; subject?: string; passage?: string; question: string; choices: [string, string, string, string]; explanation: string; src: Src };
const noteOf = (src: Src) => src === 'note' ? NOTE.note : 'tb' in src ? NOTE.tb(src.tb) : NOTE.ws(src.ws);

// 정답이 choices의 맨 앞이다. 게임이 판마다 네 방향을 섞는다.
const rows: Row[] = [
  // ── 검수 1차 묶음(2026-11-02 통과): 필기에서 만든 개념 확인 카드 ──
  { topic: T1, subject: "백성들의 형편을 생각하고 본관 사또의 정체를 감안하여 지었것다.", question: "이 문장에 대한 설명은?", choices: ["서술자가 시의 뜻을 짐작해 끼어듦", "어사가 속으로 시의 뜻을 밝힘", "운봉이 시를 읽고 뜻을 풀이함", "본관 사또가 시의 뜻을 눈치챔"], explanation: "따옴표 없이 서술 속에 들어간 말로, 서술자가 끼어들어 어사가 시를 지은 속뜻을 알려 주는 것이다.", src: { tb: 130 } }, // 201
  { topic: T1, subject: "금동이의 아름다운 술은 일만 백성의 피요 ……", question: "어사가 지은 시의 역할이 아닌 것은?", choices: ["어사의 정체를 좌중에 밝힘", "백성의 분노를 대변함", "탐관오리의 폭정을 비판함", "새로운 사건을 예고함"], explanation: "시를 보고 운봉만 '일이 났다'고 눈치챌 뿐 본관 사또는 끝까지 몰라보므로, 정체는 출두 때 드러난다. 시의 역할은 백성의 분노 대변, 폭정 비판, 극적 긴장감 고조, 새로운 사건 예고다.", src: { ws: 3 } }, // 202
  { topic: T2, subject: "외올망건 공단 모자 새 패랭이 눌러쓰고, 석 자 감발 새 짚신에 한삼 고의 산뜻하게 차려입고", question: "이 대목이 보여 주는 것은?", choices: ["숨어 있던 역졸들이 복장을 갖춤", "수령들이 잔치에 맞게 차려입음", "어사가 걸인 차림을 벗음", "본관의 하인들이 도망 채비를 함"], explanation: "장사치 차림으로 숨어 있던 어사의 부하들이 출두를 앞두고 역졸 복장으로 갈아입은 것이다.", src: { tb: 131 } }, // 203
  { topic: T2, subject: "외치는 소리에 강산이 무너지고 천지가 뒤집히는 듯 초목금수(草木禽獸)인들 아니 떨랴.", question: "쓰인 표현을 바르게 묶은 것은?", choices: ["과장 · 설의", "과장 · 반어", "점층 · 설의", "점층 · 반어"], explanation: "천지가 뒤집히고 풀과 짐승까지 떤다는 것은 과장이고, '아니 떨랴'는 모두 떤다는 뜻을 물음으로 강조한 설의다.", src: { tb: 132 } }, // 204
  { topic: T2, subject: "\"출두야.\" / 등채로 휘닥딱. / \"애고 죽겠다.\"", question: "이런 짧은 문장이 주는 효과는?", choices: ["속도감 · 긴장감", "장중함 · 엄숙함", "느긋함 · 여유", "쓸쓸함 · 애상"], explanation: "짧은 대사와 서술을 잇달아 놓아 어사 출두 장면의 급박함을 살린다.", src: { tb: 132 } }, // 205
  { topic: T2, subject: "인궤 잃고 강정 들고, 병부 잃고 송편 들고, 탕건 잃고 용수 쓰고, 갓 잃고 소반 쓰고.", question: "이 대목에 대한 설명으로 알맞지 않은 것은?", choices: ["편집자적 논평으로 수령을 평가함", "4·4조 4음보의 운율이 느껴짐", "열거와 대구로 소란을 그려 냄", "수령들을 우스꽝스럽게 희화화함"], explanation: "운율 있는 열거와 대구로 수령들의 추태를 보여 줄 뿐, 서술자가 직접 평가하는 말은 없다.", src: { tb: 133 } }, // 206
  { topic: T3, subject: "이 골은 대감이 좌정하시던 골이라.", question: "'대감'은 누구인가?", choices: ["이몽룡의 아버지", "본관 사또 변학도", "운봉 영장", "임금"], explanation: "예전에 남원 부사로 이 고을을 다스린 이몽룡의 아버지다. 그래서 어사가 이곳의 잡소리를 금한다.", src: { tb: 133 } }, // 207
  { topic: T3, subject: "어사또 분부하되, \"얼굴 들어 나를 보라.\"", question: "이 말이 작품에서 갖는 의미는?", choices: ["정체가 드러나는 가장 극적인 순간", "춘향의 절개를 다시 시험하는 말", "춘향에게 벌을 내리는 순간", "정체를 끝까지 숨기려는 말"], explanation: "고개를 든 춘향이 걸인으로 왔던 낭군이 어사또임을 알아보는 장면이다. 절개를 시험하는 것은 그 앞의 '내 수청도 거역할까?'이다.", src: { tb: 134 } }, // 208
  { topic: T3, subject: "춘향 어미 들어와서 가없이 즐겨 하는 말을 어찌 다 설화(說話)하랴.", question: "말하는 이와 그 기능은?", choices: ["서술자 · 이야기를 줄여 넘김", "서술자 · 슬픔을 드러냄", "춘향 어미 · 이야기를 줄여 넘김", "춘향 어미 · 슬픔을 드러냄"], explanation: "서술자가 끼어들어 다 말할 수 없다며 춘향 어미의 기쁜 말을 줄여 넘기는 것으로, 고전 · 판소리계 소설의 특징이다.", src: { tb: 134 } }, // 209
  { topic: T4, subject: "봄풀은 해마다 푸르건만 떠난 객은 돌아오지 않는다고 이른 시(詩)는 나를 두고 이름이라.", question: "중국 시를 끌어온 효과로 알맞은 것은?", choices: ["한시 교양으로 양반층 취향을 맞춤", "서민의 구어로 해학을 살림", "서술자가 끼어들어 평가함", "장면을 늘여 극대화함"], explanation: "중국 시 같은 한문 교양은 양반층의 취향으로, 서민의 해학과 함께 담겨 두 계층 모두 공감할 수 있게 한다.", src: { tb: 135 } }, // 210
  { topic: T4, subject: "춘향으로 정렬부인을 봉하신다. …… 이조 판서, 호조 판서, 좌의정, 우의정, 영의정 다 지내고", question: "결말에 담긴 두 계층의 바람을 바르게 짝지은 것은?", choices: ["양반 입신양명 · 서민 신분 상승", "양반 입신양명 · 서민 절개 예찬", "양반 인간 해방 · 서민 신분 상승", "양반 인간 해방 · 서민 절개 예찬"], explanation: "몽룡이 판서와 정승을 지내는 것은 양반의 입신양명이고, 기생의 딸이 정렬부인이 되는 것은 서민의 신분 상승이다. 절개 예찬은 양반층 취향이다.", src: { tb: 135 } }, // 211
  { topic: T4, subject: "㉠ 춘향과 몽룡의 이별과 재회 / ㉡ 탐관오리 변 사또에 대한 저항", question: "「춘향전」을 ㉠, ㉡에 주목해 읽을 때 드러나는 주제는?", choices: ["㉠ 표면적 주제 · ㉡ 이면적 주제", "㉠ 이면적 주제 · ㉡ 표면적 주제", "㉠, ㉡ 모두 표면적 주제", "㉠, ㉡ 모두 이면적 주제"], explanation: "㉠에 주목하면 신분을 초월한 사랑이라는 표면적 주제가, ㉡에 주목하면 부패한 지배 계층에 대한 서민의 항거라는 이면적 주제가 드러난다.", src: { ws: 3 } }, // 212
  { topic: T4, subject: "변 사또가 수청을 거부한 춘향을 옥에 가둠", question: "이 내용에 반영된 조선 후기 사회상은?", choices: ["지방 관청의 권위가 막강함", "여성의 정절을 중시함", "암행어사가 수령을 감찰함", "탐관오리의 수탈이 심함"], explanation: "수청을 거부했다는 이유만으로 옥에 가둘 만큼 지방 관청의 권위가 막강했다. 정절 중시는 정렬부인 결말, 감찰은 봉고파직, 수탈은 어사의 한시에서 드러난다.", src: { ws: 2 } }, // 213
  { topic: T6, subject: "말뚝이: (벙거지를 쓰고 채찍을 들었다.)", question: "말뚝이의 차림이 알려 주는 것은?", choices: ["말을 모는 하인이라는 신분", "양반을 벌하는 관리라는 신분", "놀이판을 이끄는 악공이라는 신분", "양반 집안의 서자라는 신분"], explanation: "벙거지와 채찍은 말을 모는 마부의 차림으로, 말뚝이가 하인이라는 신분을 드러낸다.", src: { ws: 5 } }, // 214
  { topic: T6, subject: "샌님과 서방님은 흰 창옷에 관을 썼다. …… 샌님과 서방님은 언청이이며", question: "차림과 언청이가 하는 일을 바르게 짝지은 것은?", choices: ["차림은 위엄, 언청이는 희화화", "차림은 위엄, 언청이는 위선 비판", "차림은 위선 비판, 언청이는 희화화", "차림은 위선 비판, 언청이도 위선 비판"], explanation: "흰 창옷에 관은 양반의 위엄을 드러내고, 언청이 같은 외양은 인물을 우스꽝스럽게 만들어 권위를 낮춘다. 복장으로 위선을 비판한다는 것은 학습지에서 틀린 진술로 다뤘다.", src: { ws: 5 } }, // 215
  { topic: T6, subject: "도령은 때때로 형들의 면상을 치며 논다. 끝까지 그런 행동을 한다.", question: "이 행동이 드러내는 것은?", choices: ["양반의 권위가 우스꽝스럽게 무너짐", "형제 사이의 엄한 위계질서", "말뚝이에 대한 양반의 분노", "새 재담이 시작된다는 신호"], explanation: "양반답지 못한 방정맞은 행동으로 양반을 희화화해 권위를 무너뜨린다.", src: { ws: 5 } }, // 216
  { topic: T5, subject: "말뚝이: 쉬이. (춤과 반주 그친다.) 여보, 악공들, 말씀 들으시오.", question: "이 말에서 확인되는 민속극의 특징은?", choices: ["극 밖의 악공까지 극에 끌어들임", "서술자가 악공에게 연주를 지시함", "악공이 극 중 인물 역을 맡음", "무대와 객석이 엄격히 나뉨"], explanation: "반주하는 악공에게 인물이 직접 말을 거는 것은 무대와 판이 열려 있는 민속극의 특징이다.", src: { ws: 5 } }, // 217
  { topic: T7, subject: "서방: 그 피마자(蓖麻子)라고 하는 자가 아닙니까? / 생원: 아, 거 동생 참 용할세.", question: "이 대화가 비판하는 것은?", choices: ["양반의 무지와 허세", "양반의 탐욕과 부패", "하인의 무례함", "서민의 어리석음"], explanation: "글자를 쪼개는 파자라면서 수수께끼를 하고 그것을 용하다고 칭찬하는 데서, 유식한 척하는 양반의 무지와 허세가 드러난다.", src: { ws: 6 } }, // 218
  { topic: T8, subject: "생원: 나랏돈 노랑돈 칠 푼 잘라먹은 놈 …… 을 잡아들여라.", question: "이 장면의 취발이가 대변하는 계층은?", choices: ["조선 후기 신흥 상인층", "몰락한 양반층", "양반에 매인 노비층", "지방의 하급 관리층"], explanation: "취발이는 돈을 모은 조선 후기의 신흥 상인 세력으로, 돈으로 풀려나는 과정에서 양반의 부패를 드러낸다.", src: { ws: 6 } }, // 219
  { topic: T8, subject: "생원: 그러면 이놈의 모가지를 뽑아서 밑구녕에다 갖다 박아라.", question: "이 명령이 드러내는 것은?", choices: ["서민에 대한 양반의 횡포", "양반의 무지와 허세", "양반의 물질만능주의", "하인에 대한 양반의 신뢰"], explanation: "냄새가 난다는 이유만으로 목을 뽑으라는 데서 양반의 잔인함과 횡포가 드러난다. 무지와 허세는 시조 · 파자 장면에서 드러난다.", src: { ws: 6 } }, // 220
  { topic: T5, subject: "쉬이 → 조롱 → 호통 → 변명 → 춤, 쉬이 → 조롱 → ……", question: "양반 과장의 재담들이 이어지는 방식은?", choices: ["인과 관계 없이 되풀이됨", "앞 재담이 원인이 되어 이어짐", "갈등이 점점 커져 절정에 이름", "과거와 현재가 번갈아 나옴"], explanation: "재담 하나가 춤으로 끝나면 '쉬이'로 다음 재담이 새로 열리며, 재담끼리는 인과 관계 없이 시리즈처럼 이어진다.", src: 'note' }, // 221
];

const FIRST_ID = 201;
const directions: Direction[] = ['up', 'left', 'right', 'down'];
export const koreanFinalCards: SwipeCard[] = rows.map(({ topic, subject, passage, question, choices, explanation, src }, index) => ({
  id: `korean-final-${String(FIRST_ID + index).padStart(3, '0')}`,
  topic, ...(subject ? { subject } : {}), question, ...(passage ? { passage } : {}),
  answers: Object.fromEntries(directions.map((direction, i) => [direction, choices[i]])) as Record<Direction, string>,
  correct: 'up' as Direction, explanation, sourceNote: noteOf(src),
}));

// 서술형 채점 카드는 검수를 거친 뒤 다시 넣는다(2차 초안의 서술형은 쓰지 않음).
const rubrics: WrittenQuestion[] = [];

// 단답형 · 이유 서술 연습(뭉탱이와 같은 방식): 답이 한 낱말 · 구로 떨어지는 카드만 고른다. 지문이 있으면 같이 보여 준다.
const writable = (card: SwipeCard) => !/[–→,·/]/.test(card.answers[card.correct]) && !/(않은|아닌|않는|거리가 먼|알맞은 것|바르게|짝지은|묶은)/.test(card.question);
const practiceOf = (card: SwipeCard, kind: 'short' | 'written'): WrittenQuestion => {
  const answer = card.answers[card.correct];
  const passage = card.passage ? { passage: card.passage } : {};
  return kind === 'short'
    ? { id: `practice-short-${card.id}`, topic: card.topic, question: `${card.question} (답을 하나만 쓰세요.)`, modelAnswer: answer, criteria: [`정답: ${answer}`], sourceNote: card.sourceNote!, ...passage }
    : { id: `practice-written-${card.id}`, topic: card.topic, question: `${card.question} 답과 그 이유를 연결하여 서술하시오.`, modelAnswer: `${answer}. ${card.explanation}`, criteria: [`답: ${answer}`, `근거: ${card.explanation}`], sourceNote: card.sourceNote!, ...passage };
};
const practiceCards = koreanFinalCards.filter(writable);
// 단답형은 정확히 같은 답을 쓰게 되므로 짧은 용어만(두 어절 이하, 10자 이하, 괄호 · 문장 없음).
const shortable = (card: SwipeCard) => { const a = card.answers[card.correct]; return Array.from(a).length <= 10 && a.split(' ').length <= 2 && !/[()]/.test(a) && !/다$/.test(a); };
export const koreanFinalPractice = { short: practiceCards.filter(shortable).map(card => practiceOf(card, 'short')), written: practiceCards.map(card => practiceOf(card, 'written')) };
export const koreanFinalWritten: WrittenQuestion[] = [...rubrics, ...koreanFinalPractice.short, ...koreanFinalPractice.written];
