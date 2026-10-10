import type { SwipeCard } from './swipe-cards';
import type { WrittenQuestion } from './biology-written';
export const joDepthCards: SwipeCard[] = [
  {
    "id": "biology-jo-depth-001",
    "topic": "심화 · 가닥 방향·전사·RNA 가공",
    "subject": "조용민T · 심화",
    "question": "DNA 주형 가닥이 3′-TAC GGA ATT-5′다. 상보적으로 전사한 mRNA는?",
    "answers": {
      "up": "5′-AUG CCU UAA-3′",
      "left": "5′-UAC GGA AUU-3′",
      "right": "3′-AUG CCU UAA-5′",
      "down": "5′-ATG CCT TAA-3′"
    },
    "correct": "up",
    "explanation": "주형 DNA에 상보적이며 역평행으로 RNA가 합성된다. T에 A, A에 U, C에 G, G에 C를 대응시키고 5′→3′로 쓴다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-002",
    "topic": "심화 · 가닥 방향·전사·RNA 가공",
    "subject": "조용민T · 심화",
    "question": "DNA 암호화 가닥이 5′-ATG CCT TAA-3′다. 이 구간의 mRNA는?",
    "answers": {
      "up": "5′-ATG CCT TAA-3′",
      "left": "5′-AUG CCU UAA-3′",
      "right": "5′-UAC GGA AUU-3′",
      "down": "3′-AUG CCU UAA-5′"
    },
    "correct": "left",
    "explanation": "암호화 가닥과 mRNA는 같은 5′→3′ 방향에서 T/U 차이를 제외하면 같은 서열이다. 주형 가닥과 혼동하지 않는다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-003",
    "topic": "심화 · 가닥 방향·전사·RNA 가공",
    "subject": "조용민T · 심화",
    "question": "RNA 중합효소가 주형 DNA를 읽는 방향과 RNA를 합성하는 방향은?",
    "answers": {
      "up": "둘 다 3′→5′",
      "left": "둘 다 5′→3′",
      "right": "3′→5′ 읽기·5′→3′ 합성",
      "down": "5′→3′ 읽기·3′→5′ 합성"
    },
    "correct": "right",
    "explanation": "RNA의 새 뉴클레오타이드는 3′ 말단에 연결되므로 합성 방향은 5′→3′다. 주형을 읽는 방향은 반대다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-004",
    "topic": "심화 · 가닥 방향·전사·RNA 가공",
    "subject": "조용민T · 심화",
    "question": "pre-mRNA가 엑손 E1-인트론 I1-엑손 E2로 구성된다. 스플라이싱 후 연결은?",
    "answers": {
      "up": "I1-E1-E2",
      "left": "E1-I1",
      "right": "I1만 남음",
      "down": "E1-E2"
    },
    "correct": "down",
    "explanation": "스플라이싱은 인트론을 제거하고 엑손을 연결한다. 엑손을 제거하는 과정이나 DNA 염색체의 결실과 구별한다.",
    "sourceNote": "조용민T 필기 · 2쪽"
  },
  {
    "id": "biology-jo-depth-005",
    "topic": "심화 · 가닥 방향·전사·RNA 가공",
    "subject": "조용민T · 심화",
    "question": "진핵 mRNA의 캡과 폴리 A 꼬리 기능에 대한 옳은 설명은?",
    "answers": {
      "up": "안정성·수송·번역에 기여한다",
      "left": "모든 코돈을 아데닌으로 바꾼다",
      "right": "DNA 주형의 인트론을 자른다",
      "down": "아미노산을 직접 운반한다"
    },
    "correct": "up",
    "explanation": "5′ 캡과 3′ 폴리 A 꼬리는 RNA 안정성과 수송·번역 효율 등에 기여한다. 아미노산 운반은 tRNA의 기능이다.",
    "sourceNote": "조용민T 필기 · 2쪽"
  },
  {
    "id": "biology-jo-depth-006",
    "topic": "심화 · 가닥 방향·전사·RNA 가공",
    "subject": "조용민T · 심화",
    "question": "스플라이싱 복합체의 snRNA와 리보솜 rRNA를 구별한 것은?",
    "answers": {
      "up": "둘 다 반드시 단백질로 번역",
      "left": "snRNA는 가공·rRNA는 번역에 관여",
      "right": "둘 다 아미노산만 운반",
      "down": "snRNA는 DNA 복제·rRNA는 가공"
    },
    "correct": "left",
    "explanation": "snRNA는 스플라이싱에 관여하고 rRNA는 리보솜 구성과 펩타이드 결합 형성에 기여한다. 모든 RNA가 번역되는 것은 아니다.",
    "sourceNote": "조용민T 필기 · 2쪽"
  },
  {
    "id": "biology-jo-depth-007",
    "topic": "심화 · 가닥 방향·전사·RNA 가공",
    "subject": "조용민T · 심화",
    "question": "핵이 있는 세포에서 전사한 RNA가 바로 번역되기 어려운 이유는?",
    "answers": {
      "up": "RNA에는 코돈이 없다",
      "left": "세포질에 tRNA가 없다",
      "right": "전사·가공과 번역 장소가 구분된다",
      "down": "리보솜이 DNA를 직접 읽는다"
    },
    "correct": "right",
    "explanation": "진핵세포에서 전사와 RNA 가공은 핵, 번역은 주로 세포질의 리보솜에서 진행된다. 핵막이 없는 원핵과 구별한다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-008",
    "topic": "심화 · 가닥 방향·전사·RNA 가공",
    "subject": "조용민T · 심화",
    "question": "RNA 주형으로 DNA가 합성됐다. 보통의 전사와 구별되는 정보 흐름은?",
    "answers": {
      "up": "번역",
      "left": "스플라이싱",
      "right": "독립 분리",
      "down": "역전사"
    },
    "correct": "down",
    "explanation": "역전사는 RNA→DNA의 정보 흐름이다. 보통의 전사 DNA→RNA 및 번역 RNA→단백질과 구별한다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-009",
    "topic": "심화 · 번역 단계와 코돈 계산",
    "subject": "조용민T · 심화",
    "question": "mRNA 5′-AUG GCU UUU UGA-3′를 첫 AUG에서 번역한다. 아미노산과 펩타이드 결합 수는?",
    "answers": {
      "up": "3개·2개",
      "left": "4개·3개",
      "right": "3개·3개",
      "down": "2개·1개"
    },
    "correct": "up",
    "explanation": "AUG·GCU·UUU는 각각 아미노산을 지정하지만 UGA는 종결 코돈이다. 선형 사슬 3개 아미노산의 펩타이드 결합은 2개다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-010",
    "topic": "심화 · 번역 단계와 코돈 계산",
    "subject": "조용민T · 심화",
    "question": "mRNA 5′-AUG GCU UAA GGG-3′를 첫 AUG에서 번역한다. 만들어지는 아미노산 수는?",
    "answers": {
      "up": "1개",
      "left": "2개",
      "right": "3개",
      "down": "4개"
    },
    "correct": "left",
    "explanation": "UAA에서 번역이 끝나므로 AUG와 GCU만 번역한다. 종결 뒤 GGG를 같은 폴리펩타이드에 계속 더하지 않는다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-011",
    "topic": "심화 · 번역 단계와 코돈 계산",
    "subject": "조용민T · 심화",
    "question": "mRNA 코돈 5′-GCU-3′에 역평행 결합하는 안티코돈을 5′→3′로 쓰면?",
    "answers": {
      "up": "5′-GCU-3′",
      "left": "5′-GCA-3′",
      "right": "5′-AGC-3′",
      "down": "5′-CGA-3′"
    },
    "correct": "right",
    "explanation": "상보 안티코돈은 3′-CGA-5′다. 이를 5′→3′로 뒤집으면 AGC다. 염기 상보성만 적용하고 방향을 놓치지 않는다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-012",
    "topic": "심화 · 번역 단계와 코돈 계산",
    "subject": "조용민T · 심화",
    "question": "번역 신장 중 새 아미노아실-tRNA가 들어가는 리보솜 자리는?",
    "answers": {
      "up": "P 자리",
      "left": "E 자리",
      "right": "프로모터",
      "down": "A 자리"
    },
    "correct": "down",
    "explanation": "일반적인 신장에서는 새 tRNA가 A 자리로 들어간다. P는 펩타이딜-tRNA, E는 아미노산이 없는 tRNA의 방출과 관련된다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-013",
    "topic": "심화 · 번역 단계와 코돈 계산",
    "subject": "조용민T · 심화",
    "question": "번역 개시 직후 시작 아미노산을 운반한 tRNA가 위치하는 자리는?",
    "answers": {
      "up": "P 자리",
      "left": "A 자리",
      "right": "E 자리",
      "down": "핵공"
    },
    "correct": "up",
    "explanation": "개시 tRNA는 P 자리에 배치된다. 일반적인 신장 tRNA가 A 자리로 들어가는 것과 개시를 구별한다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-014",
    "topic": "심화 · 번역 단계와 코돈 계산",
    "subject": "조용민T · 심화",
    "question": "종결 코돈을 읽은 리보솜에서 직접 작용하는 것은?",
    "answers": {
      "up": "스플라이싱 효소",
      "left": "방출 인자",
      "right": "종결 아미노산 운반 tRNA",
      "down": "DNA 중합효소"
    },
    "correct": "left",
    "explanation": "종결 코돈에 대응하는 일반 아미노아실-tRNA 대신 방출 인자가 작용해 폴리펩타이드가 방출된다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-015",
    "topic": "심화 · 번역 단계와 코돈 계산",
    "subject": "조용민T · 심화",
    "question": "하나의 mRNA를 같은 방향으로 여러 리보솜이 번역한다. 더 아래쪽 리보솜의 폴리펩타이드는?",
    "answers": {
      "up": "반드시 다른 단백질 서열이다",
      "left": "종결 코돈을 아미노산으로 포함",
      "right": "더 길 수 있다",
      "down": "항상 더 짧다"
    },
    "correct": "right",
    "explanation": "같은 시작점과 읽는 틀에서 더 진행한 리보솜은 더 긴 사슬을 합성했을 수 있다. 위치 차이가 다른 유전자 번역을 뜻하지 않는다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-016",
    "topic": "심화 · 번역 단계와 코돈 계산",
    "subject": "조용민T · 심화",
    "question": "100개 아미노산의 단일 사슬을 지정하는 구간은 시작 코돈을 포함한다. 종결 코돈까지 필요한 최소 염기 수는?",
    "answers": {
      "up": "300개",
      "left": "297개",
      "right": "101개",
      "down": "303개"
    },
    "correct": "down",
    "explanation": "아미노산 코돈 100개에 종결 코돈 1개를 더하면 101×3=303개다. 시작 코돈은 이미 100개에 포함되어 두 번 세지 않는다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-017",
    "topic": "심화 · 번역 단계와 코돈 계산",
    "subject": "조용민T · 심화",
    "question": "아미노산 80개로 된 선형 폴리펩타이드의 펩타이드 결합 수는?",
    "answers": {
      "up": "79개",
      "left": "80개",
      "right": "81개",
      "down": "240개"
    },
    "correct": "up",
    "explanation": "선형 사슬의 연결 수는 구성 단위 수보다 하나 적다. 따라서 80−1=79개다. 코돈이나 염기 수와 혼동하지 않는다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-018",
    "topic": "심화 · 번역 단계와 코돈 계산",
    "subject": "조용민T · 심화",
    "question": "mRNA AUG-AAA-UAG의 UAG가 UGG로 바뀌었다. 다른 조건이 같고 뒤쪽에 코돈이 더 있다면?",
    "answers": {
      "up": "DNA 염색체 수가 증가한다",
      "left": "뒤의 종결 코돈까지 더 길어질 수 있다",
      "right": "항상 아미노산 수가 한 개 준다",
      "down": "번역 시작이 반드시 사라진다"
    },
    "correct": "left",
    "explanation": "종결 코돈이 아미노산 코돈으로 바뀌면 기존 위치에서 끝나지 않아 다음 종결까지 합성될 수 있다. 길이 변화는 뒤쪽 서열에 달려 있다.",
    "sourceNote": "조용민T 필기 · 1쪽"
  }
];
export const joDepthWritten: WrittenQuestion[] = [
  {
    "id": "biology-jo-depth-written-001",
    "topic": "심화 · 가닥 방향·전사·RNA 가공",
    "question": "DNA 주형이 3′-TAC GGA ATT-5′일 때 mRNA와 암호화 DNA를 쓰고 두 가닥의 관계를 설명하시오.",
    "modelAnswer": "mRNA는 5′-AUG CCU UAA-3′이고 암호화 DNA는 5′-ATG CCT TAA-3′다. 주형과 RNA는 상보적이며 역평행이다. 같은 5′→3′ 방향에서 암호화 DNA와 RNA는 T와 U 차이를 제외하면 같은 서열이다.",
    "criteria": [
      "mRNA 서열·방향",
      "암호화 DNA 서열·방향",
      "상보·역평행 및 T/U 구별"
    ],
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-written-002",
    "topic": "심화 · 번역 단계와 코돈 계산",
    "question": "5′-AUG GCU UUU UGA-3′를 첫 AUG에서 번역할 때 아미노산 수와 결합 수를 구하고, GCU의 안티코돈을 5′→3′로 쓰시오.",
    "modelAnswer": "종결 UGA는 아미노산을 지정하지 않으므로 아미노산은 3개, 펩타이드 결합은 2개다. GCU의 상보 안티코돈은 3′-CGA-5′이므로 5′→3′로 쓰면 5′-AGC-3′다. 코돈과 안티코돈은 상보적이고 역평행이다.",
    "criteria": [
      "아미노산 3·결합 2",
      "안티코돈 AGC와 방향",
      "종결·역평행 설명"
    ],
    "sourceNote": "조용민T 필기 · 1쪽"
  },
  {
    "id": "biology-jo-depth-written-003",
    "topic": "심화 · 번역 단계와 코돈 계산",
    "question": "리보솜의 A·P·E 자리와 번역 개시·신장·종결을 연결해 설명하시오.",
    "modelAnswer": "개시 tRNA는 P 자리에 놓이며 신장 때 새 아미노아실-tRNA는 A 자리로 들어간다. 펩타이드가 A 자리 tRNA로 옮겨지고 전위하면서 사슬을 가진 tRNA가 P로 이동한다. 아미노산이 없는 tRNA는 E를 거쳐 빠져나가고 종결 코돈에서는 방출 인자가 작용한다.",
    "criteria": [
      "개시 P·신장 A",
      "전위와 E 방출",
      "종결의 방출 인자"
    ],
    "sourceNote": "조용민T 필기 · 1쪽"
  }
];
