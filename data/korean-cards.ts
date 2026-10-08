import type { SwipeCard } from './swipe-cards';
import type { WrittenQuestion } from './biology-written';
export const koreanGrammarCards: SwipeCard[] = [
  {
    "id": "korean-grammar-001",
    "topic": "맞춤법의 원리",
    "subject": "한글 맞춤법 제1항",
    "question": "한글 맞춤법의 표기 대상은?",
    "answers": {
      "up": "표준어",
      "left": "방언",
      "right": "모든 입말",
      "down": "외래어만"
    },
    "correct": "up",
    "explanation": "제1항 \"한글 맞춤법은 표준어를 소리대로 적되, 어법에 맞도록 함을 원칙으로 한다.\" 적는 대상은 표준어이고 방언은 제외된다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-002",
    "topic": "맞춤법의 원리",
    "subject": "표준어를 소리대로 적는다",
    "question": "이 원칙이 따르는 것은?",
    "answers": {
      "up": "표음주의",
      "left": "표의주의",
      "right": "형태주의",
      "down": "어원주의"
    },
    "correct": "up",
    "explanation": "소리대로 적는 것은 발음 형태대로 적는 표음주의로, 표음 문자인 한글의 특성을 살려 쓰기의 편의를 도모한다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-003",
    "topic": "맞춤법의 원리",
    "subject": "어법에 맞도록 적는다",
    "question": "이 원칙의 목적은?",
    "answers": {
      "up": "단어 뜻을 쉽게 파악",
      "left": "발음대로 적기",
      "right": "쓰기를 쉽게",
      "down": "외래어 통일"
    },
    "correct": "up",
    "explanation": "어법에 맞도록 적는 것은 각 형태소의 본 모양을 밝혀 적어 단어의 뜻을 쉽게 파악하게 하려는 것(표의주의·형태주의)이다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-004",
    "topic": "맞춤법의 원리",
    "subject": "넓고 [널꼬] · 찾으래 [차즈래] · 얼음 [어름]",
    "question": "이렇게 적는 원리는?",
    "answers": {
      "up": "어법에 맞도록",
      "left": "소리대로",
      "right": "두음 법칙",
      "down": "사이시옷 표기"
    },
    "correct": "up",
    "explanation": "소리 나는 대로 적으면 뜻을 파악하기 어려워 어간 형태를 고정해 원형을 밝혀 적는다. 어법에 맞도록 적는 원리다.",
    "sourceNote": "우리말 바로 쓰기 · 22쪽"
  },
  {
    "id": "korean-grammar-005",
    "topic": "맞춤법의 원리",
    "subject": "거위 · 바다 · 구름 · 설거지",
    "question": "이렇게 적는 원리는?",
    "answers": {
      "up": "소리대로",
      "left": "어법에 맞도록",
      "right": "구개음화",
      "down": "두음 법칙"
    },
    "correct": "up",
    "explanation": "형태소가 나뉘지 않거나 원형과 상관없이 발음대로 적는 단어로, 소리대로 적는 원리를 따른다.",
    "sourceNote": "우리말 바로 쓰기 · 22쪽"
  },
  {
    "id": "korean-grammar-006",
    "topic": "맞춤법의 원리",
    "subject": "믿음 · 지붕 · 낚시 · 놓다 · 늦잠",
    "question": "표기 원칙이 다른 하나는?",
    "answers": {
      "up": "지붕",
      "left": "믿음",
      "right": "낚시",
      "down": "놓다"
    },
    "correct": "up",
    "explanation": "지붕은 집+웅이지만 원형을 밝히지 않고 소리대로 적는다. 믿음·낚시·놓다·늦잠은 원형을 밝혀 어법에 맞도록 적었다.",
    "sourceNote": "우리말 바로 쓰기 · 24쪽"
  },
  {
    "id": "korean-grammar-007",
    "topic": "맞춤법의 원리",
    "subject": "빛 · 날다 · 오리 · 하늘 · 푸르다",
    "question": "적용된 원리가 다른 하나는?",
    "answers": {
      "up": "빛",
      "left": "날다",
      "right": "오리",
      "down": "하늘"
    },
    "correct": "up",
    "explanation": "빛은 [빋]·[비치]·[빈만]처럼 환경에 따라 달리 발음되지만 형태를 고정해 어법에 맞도록 적는다. 나머지는 소리대로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 28쪽"
  },
  {
    "id": "korean-grammar-008",
    "topic": "맞춤법의 원리",
    "subject": "빛 → [빋] [비치] [빈만]",
    "question": "소리대로만 적으면 생기는 문제는?",
    "answers": {
      "up": "한 단어가 여러 형태로",
      "left": "받침을 못 씀",
      "right": "띄어쓰기가 어려워짐",
      "down": "표준어가 사라짐"
    },
    "correct": "up",
    "explanation": "소리대로만 적으면 한 단어가 환경에 따라 여러 형태로 적혀 뜻을 파악하기 어렵다. 그래서 어법에 맞도록 적는 원칙을 붙였다.",
    "sourceNote": "우리말 바로 쓰기 · 24쪽"
  },
  {
    "id": "korean-grammar-009",
    "topic": "맞춤법의 원리",
    "subject": "꽃이다? 꼬치다? 꼿이다?",
    "question": "맞춤법을 정한 까닭은?",
    "answers": {
      "up": "의사소통 혼란을 막으려고",
      "left": "방언을 보존하려고",
      "right": "외래어를 막으려고",
      "down": "발음을 바꾸려고"
    },
    "correct": "up",
    "explanation": "사람마다 다르게 적으면 의사소통이 제대로 되지 않으므로, 우리말을 한글로 적을 때 지킬 약속으로 한글 맞춤법을 정했다.",
    "sourceNote": "우리말 바로 쓰기 · 28쪽"
  },
  {
    "id": "korean-grammar-010",
    "topic": "맞춤법의 원리",
    "subject": "한글 맞춤법 제2항",
    "question": "띄어쓰기의 기본 단위는?",
    "answers": {
      "up": "단어",
      "left": "음절",
      "right": "형태소",
      "down": "문장"
    },
    "correct": "up",
    "explanation": "제2항 \"문장의 각 단어는 띄어 씀을 원칙으로 한다.\" 독립적으로 쓰이는 말의 단위인 단어를 기준으로 띄어 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-011",
    "topic": "맞춤법의 원리",
    "subject": "형태소 원형을 밝혀 적기",
    "question": "이 방식에 대한 설명으로 옳지 않은 것은?",
    "answers": {
      "up": "뜻을 파악하기 어렵다",
      "left": "가독성을 높인다",
      "right": "표의주의다",
      "down": "어법에 맞게 적기다"
    },
    "correct": "up",
    "explanation": "형태소의 원형을 밝혀 적으면 뜻을 얼른 파악하기 쉽다. 뜻을 파악하기 어렵다는 것은 반대 설명이다.",
    "sourceNote": "우리말 바로 쓰기 · 24쪽"
  },
  {
    "id": "korean-grammar-012",
    "topic": "맞춤법의 원리",
    "subject": "앉고 · 앉으니 · 앉아서",
    "question": "이렇게 적는 까닭은?",
    "answers": {
      "up": "어간 앉-을 고정",
      "left": "소리 나는 대로",
      "right": "된소리 표기",
      "down": "두음 법칙"
    },
    "correct": "up",
    "explanation": "[안꼬], [안즈니], [안자서]로 소리 나도 어간 앉-의 형태를 밝혀 적는다. 어법에 맞도록 적는 원리다.",
    "sourceNote": "우리말 바로 쓰기 · 28쪽"
  },
  {
    "id": "korean-grammar-013",
    "topic": "소리에 관한 것",
    "subject": "소쩍새 · 어깨 · 오빠 · 기쁘다",
    "question": "된소리로 적는 까닭은?",
    "answers": {
      "up": "두 모음 사이 된소리",
      "left": "ㄱ·ㅂ 받침 뒤 된소리",
      "right": "사이시옷 때문",
      "down": "두음 법칙 때문"
    },
    "correct": "up",
    "explanation": "제5항: 한 단어 안에서 뚜렷한 까닭 없이 나는 된소리는 된소리로 적는다. 두 모음 사이에서 나는 된소리가 그 하나다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-014",
    "topic": "소리에 관한 것",
    "subject": "산뜻하다 · 잔뜩 · 살짝 · 엉뚱하다",
    "question": "된소리로 적는 까닭은?",
    "answers": {
      "up": "ㄴ·ㄹ·ㅁ·ㅇ 받침 뒤",
      "left": "두 모음 사이",
      "right": "ㄱ·ㅂ 받침 뒤",
      "down": "어원이 분명해서"
    },
    "correct": "up",
    "explanation": "제5항 2: ㄴ·ㄹ·ㅁ·ㅇ 받침 뒤에서 뚜렷한 까닭 없이 나는 된소리는 다음 음절 첫소리를 된소리로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-015",
    "topic": "소리에 관한 것",
    "subject": "깍두기 · 국수 · 접시 · 싹둑",
    "question": "된소리로 적지 않는 까닭은?",
    "answers": {
      "up": "ㄱ·ㅂ 뒤 필연적 된소리",
      "left": "표준어가 아니라서",
      "right": "두 모음 사이라서",
      "down": "한자어라서"
    },
    "correct": "up",
    "explanation": "ㄱ·ㅂ 받침 뒤에서는 필연적으로 된소리가 나므로 일반적 음운 변동으로 설명된다. 그래서 원래 형태대로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 22쪽"
  },
  {
    "id": "korean-grammar-016",
    "topic": "소리에 관한 것",
    "subject": "딱딱 · 쌉쌀하다 · 씁쓸하다",
    "question": "ㄱ·ㅂ 받침 뒤인데 된소리로 적는 까닭은?",
    "answers": {
      "up": "같은·비슷한 음절 겹침",
      "left": "두 모음 사이",
      "right": "뜻을 구별하려고",
      "down": "사이시옷 때문"
    },
    "correct": "up",
    "explanation": "제5항 다만: ㄱ·ㅂ 받침 뒤 된소리는 같은 음절이나 비슷한 음절이 겹쳐 나는 경우가 아니면 된소리로 적지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 25쪽"
  },
  {
    "id": "korean-grammar-017",
    "topic": "소리에 관한 것",
    "subject": "큰집에서 음식을 ___ 먹었다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "잔뜩",
      "left": "잔득",
      "right": "짠뜩",
      "down": "잔뚝"
    },
    "correct": "up",
    "explanation": "잔뜩은 ㄴ 받침 뒤에서 뚜렷한 까닭 없이 된소리가 나므로 된소리로 적는다(제5항).",
    "sourceNote": "우리말 바로 쓰기 · 25쪽"
  },
  {
    "id": "korean-grammar-018",
    "topic": "소리에 관한 것",
    "subject": "쉬는 시간에는 교실이 ___하다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "시끌벅적",
      "left": "시끌벅쩍",
      "right": "시끌뻑적",
      "down": "시끌벅작"
    },
    "correct": "up",
    "explanation": "ㄱ 받침 뒤에서 필연적으로 나는 된소리는 된소리로 적지 않는다. 그래서 시끌벅적으로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 25쪽"
  },
  {
    "id": "korean-grammar-019",
    "topic": "소리에 관한 것",
    "subject": "이번 겨울에 담근 ___가 잘 익었다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "깍두기",
      "left": "깍뚜기",
      "right": "깎두기",
      "down": "깍둑이"
    },
    "correct": "up",
    "explanation": "[깍뚜기]로 소리 나지만 ㄱ 받침 뒤 필연적 된소리이므로 깍두기로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 25쪽"
  },
  {
    "id": "korean-grammar-020",
    "topic": "소리에 관한 것",
    "subject": "날씨가 더워 머리를 ___ 잘랐다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "싹둑",
      "left": "싹뚝",
      "right": "삭둑",
      "down": "싹똑"
    },
    "correct": "up",
    "explanation": "싹둑[싹뚝]은 ㄱ 받침 뒤 필연적 된소리라 된소리로 적지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 22쪽"
  },
  {
    "id": "korean-grammar-021",
    "topic": "소리에 관한 것",
    "subject": "맏이 · 해돋이 · 굳이 · 같이",
    "question": "구개음화가 일어나도 원형을 적는 까닭은?",
    "answers": {
      "up": "형태소 원형을 밝힘",
      "left": "두음 법칙",
      "right": "소리대로 적음",
      "down": "사이시옷 표기"
    },
    "correct": "up",
    "explanation": "제6항(구개음화): ㄷ·ㅌ 받침 뒤에 종속적 관계의 -이(-)나 -히-가 올 때 ㅈ·ㅊ으로 소리 나도 ㄷ·ㅌ으로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-022",
    "topic": "소리에 관한 것",
    "subject": "닫히다 [다치다] · 붙이다 [부치다]",
    "question": "이 발음에 나타난 음운 현상은?",
    "answers": {
      "up": "구개음화",
      "left": "두음 법칙",
      "right": "된소리되기",
      "down": "사이시옷"
    },
    "correct": "up",
    "explanation": "ㄷ·ㅌ이 -이(-)·-히-와 만나 ㅈ·ㅊ으로 소리 나는 현상은 구개음화다. 표기는 원형대로 ㄷ·ㅌ으로 한다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-023",
    "topic": "소리에 관한 것",
    "subject": "제6항의 ‘종속적 관계’",
    "question": "이것이 뜻하는 결합은?",
    "answers": {
      "up": "실질 형태소+형식 형태소",
      "left": "실질+실질 형태소",
      "right": "조사+조사",
      "down": "어미+어미"
    },
    "correct": "up",
    "explanation": "종속적 관계란 체언·어근·용언 어간 같은 실질 형태소에 조사·접미사·어미 같은 형식 형태소가 결합하는 관계다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-024",
    "topic": "소리에 관한 것",
    "subject": "女子 (단어 첫머리)",
    "question": "두음 법칙에 맞는 표기는?",
    "answers": {
      "up": "여자",
      "left": "녀자",
      "right": "니자",
      "down": "너자"
    },
    "correct": "up",
    "explanation": "제10항: 한자음 녀·뇨·뉴·니가 단어 첫머리에 올 때는 두음 법칙에 따라 여·요·유·이로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-025",
    "topic": "소리에 관한 것",
    "subject": "歷史 (단어 첫머리)",
    "question": "두음 법칙에 맞는 표기는?",
    "answers": {
      "up": "역사",
      "left": "력사",
      "right": "녁사",
      "down": "엮사"
    },
    "correct": "up",
    "explanation": "제11항: 한자음 랴·려·례·료·류·리가 단어 첫머리에 올 때는 야·여·예·요·유·이로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-026",
    "topic": "소리에 관한 것",
    "subject": "樂園 (단어 첫머리)",
    "question": "두음 법칙에 맞는 표기는?",
    "answers": {
      "up": "낙원",
      "left": "락원",
      "right": "악원",
      "down": "랔원"
    },
    "correct": "up",
    "explanation": "제12항: 한자음 라·래·로·뢰·루·르가 단어 첫머리에 올 때는 나·내·노·뇌·누·느로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-027",
    "topic": "소리에 관한 것",
    "subject": "여자 · 굳이 · 어깨 · 닫히다 · 똑똑하다",
    "question": "두음 법칙이 적용된 단어는?",
    "answers": {
      "up": "여자",
      "left": "굳이",
      "right": "어깨",
      "down": "닫히다"
    },
    "correct": "up",
    "explanation": "여자(女子)는 녀자의 녀가 첫머리에서 여로 바뀐 두음 법칙 예다. 굳이·닫히다는 구개음화, 어깨는 된소리 표기다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-028",
    "topic": "형태에 관한 것",
    "subject": "“밥 먹었니?” “___, 아직 안 먹었어요.”",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "아니요",
      "left": "아니오",
      "right": "아니여",
      "down": "아니유"
    },
    "correct": "up",
    "explanation": "묻는 말에 부정으로 대답하는 감탄사는 아니요(준말 아뇨)다. 아니오는 아니다의 활용형으로 서술어로 쓰인다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-029",
    "topic": "형태에 관한 것",
    "subject": "이것은 책이오. / 그것은 책이 아니오.",
    "question": "이 문장의 ‘-오’는?",
    "answers": {
      "up": "종결 어미라 생략 불가",
      "left": "조사라 생략 가능",
      "right": "연결 어미",
      "down": "접미사"
    },
    "correct": "up",
    "explanation": "제15항 붙임: 서술어의 종결 어미 ‘-오’는 단어의 일부라 생략할 수 없다. 독립성 있는 조사 ‘요’는 생략할 수 있다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-030",
    "topic": "형태에 관한 것",
    "subject": "이것은 책이요, 그것은 붓이다.",
    "question": "여기의 ‘-요’는?",
    "answers": {
      "up": "연결 어미",
      "left": "종결 어미",
      "right": "보조사 요",
      "down": "접미사"
    },
    "correct": "up",
    "explanation": "‘이다’, ‘아니다’의 어간 뒤에 붙어 다음 말과 이어 주는 연결 어미는 ‘-요’로 적고 생략할 수 없다.",
    "sourceNote": "우리말 바로 쓰기 · 17쪽"
  },
  {
    "id": "korean-grammar-031",
    "topic": "형태에 관한 것",
    "subject": "높이 · 믿음 · 같이 · 굳이",
    "question": "이렇게 적는 규정은?",
    "answers": {
      "up": "제19항 어간 원형 밝힘",
      "left": "제20항 명사 원형",
      "right": "제5항 된소리",
      "down": "제30항 사이시옷"
    },
    "correct": "up",
    "explanation": "제19항: 어간에 -이·-음/-ㅁ이 붙어 명사가 되거나 -이·-히가 붙어 부사가 된 말은 어간의 원형을 밝혀 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-032",
    "topic": "형태에 관한 것",
    "subject": "귀머거리 · 너머 · 마감 · 무덤",
    "question": "어간 원형을 밝히지 않는 까닭은?",
    "answers": {
      "up": "-이·-음 외 모음 접미사",
      "left": "발음이 같아서",
      "right": "한자어라서",
      "down": "두음 법칙 때문"
    },
    "correct": "up",
    "explanation": "제19항 붙임: 어간에 -이·-음 이외의 모음으로 시작된 접미사가 붙어 다른 품사로 바뀐 것은 원형을 밝혀 적지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-033",
    "topic": "형태에 관한 것",
    "subject": "마주 · 도로 · 비로소 · 자주",
    "question": "원형을 밝히지 않은 이 말들의 품사는?",
    "answers": {
      "up": "부사",
      "left": "명사",
      "right": "조사",
      "down": "동사"
    },
    "correct": "up",
    "explanation": "맞+우, 돌+오, 비롯+오, 잦+우처럼 -이·-음 외 모음 접미사가 붙어 부사로 바뀐 것은 원형을 밝혀 적지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-034",
    "topic": "형태에 관한 것",
    "subject": "~나마 · ~부터 · ~조차",
    "question": "원형을 밝히지 않는 까닭은?",
    "answers": {
      "up": "조사로 바뀌어 뜻이 달라짐",
      "left": "명사로 바뀜",
      "right": "두음 법칙",
      "down": "된소리 표기"
    },
    "correct": "up",
    "explanation": "용언에 접미사가 붙어 조사로 바뀌어 뜻이 달라진 것은 원형을 밝혀 적지 않는다(붙다→부터, 좇다→조차).",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-035",
    "topic": "형태에 관한 것",
    "subject": "산 너머에 있는 마을 (넘- + -어)",
    "question": "‘넘어’로 적지 않는 까닭은?",
    "answers": {
      "up": "-이·-음 외 접미사로 명사화",
      "left": "-이가 붙어 명사화",
      "right": "-음이 붙어 명사화",
      "down": "합성어라서"
    },
    "correct": "up",
    "explanation": "너머는 넘-에 -이·-음 이외의 모음 접미사 -어가 붙어 명사가 되었으므로 원형을 밝히지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 26쪽"
  },
  {
    "id": "korean-grammar-036",
    "topic": "형태에 관한 것",
    "subject": "먹이 · 높이 · 익히 · 너머",
    "question": "어간 원형을 밝혀 적지 않은 것은?",
    "answers": {
      "up": "너머",
      "left": "먹이",
      "right": "높이",
      "down": "익히"
    },
    "correct": "up",
    "explanation": "먹이·높이·익히는 -이·-히가 붙어 원형을 밝혔다. 너머는 -이·-음 외 접미사가 붙어 소리대로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 26쪽"
  },
  {
    "id": "korean-grammar-037",
    "topic": "형태에 관한 것",
    "subject": "믿음 · 웃음 · 무덤 · 굳이 · 익히",
    "question": "형태소 원형을 밝혀 적지 않은 것은?",
    "answers": {
      "up": "무덤",
      "left": "믿음",
      "right": "굳이",
      "down": "익히"
    },
    "correct": "up",
    "explanation": "무덤은 묻-에 -엄이 붙은 말로, -이·-음 외 접미사가 붙었으므로 원형을 밝혀 적지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-038",
    "topic": "형태에 관한 것",
    "subject": "마중 (맞- + -웅)",
    "question": "원형을 밝혀 적지 않는 까닭은?",
    "answers": {
      "up": "-이·-음 외 접미사가 붙음",
      "left": "어간 뜻과 멀어짐",
      "right": "두음 법칙",
      "down": "된소리가 나서"
    },
    "correct": "up",
    "explanation": "마중은 맞-에 -이·-음 이외의 모음 접미사 -웅이 붙은 것이다. 어간 뜻과 멀어졌기 때문이 아니다.",
    "sourceNote": "우리말 바로 쓰기 · 29쪽"
  },
  {
    "id": "korean-grammar-039",
    "topic": "형태에 관한 것",
    "subject": "목거리 (목이 붓고 아픈 병)",
    "question": "‘목걸이’와 달리 소리대로 적는 까닭은?",
    "answers": {
      "up": "어간 뜻과 멀어짐",
      "left": "접미사 -웅이 붙음",
      "right": "사이시옷 때문",
      "down": "두음 법칙"
    },
    "correct": "up",
    "explanation": "제19항 다만: -이·-음이 붙어 명사가 되었더라도 그 어간의 뜻과 멀어진 것은 원형을 밝혀 적지 않는다(목거리, 노름).",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-040",
    "topic": "형태에 관한 것",
    "subject": "노름판이 벌어졌다. / 즐거운 놀음",
    "question": "‘노름’을 소리대로 적는 까닭은?",
    "answers": {
      "up": "본뜻에서 멀어짐",
      "left": "-음 외 접미사",
      "right": "두음 법칙",
      "down": "된소리 표기"
    },
    "correct": "up",
    "explanation": "노름(도박)은 놀-+-음이지만 본뜻에서 멀어져 소리대로 적는다. 놀음(놀이)은 원형을 밝혀 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-041",
    "topic": "형태에 관한 것",
    "subject": "곳곳이 · 바둑이 · 삼발이 · 절뚝발이",
    "question": "이렇게 적는 규정은?",
    "answers": {
      "up": "명사 뒤 -이, 명사 원형",
      "left": "어간 뒤 -이, 어간 원형",
      "right": "두음 법칙",
      "down": "사이시옷"
    },
    "correct": "up",
    "explanation": "제20항: 명사 뒤에 -이가 붙어서 된 말은 그 명사의 원형을 밝혀 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-042",
    "topic": "형태에 관한 것",
    "subject": "꼬락서니 · 모가지 · 바가지 · 이파리",
    "question": "명사 원형을 밝히지 않는 까닭은?",
    "answers": {
      "up": "-이 외 모음 접미사",
      "left": "-이 접미사",
      "right": "자음 접미사",
      "down": "어간 뜻과 멀어짐"
    },
    "correct": "up",
    "explanation": "제20항 붙임: -이 이외의 모음으로 시작된 접미사가 붙어서 된 말은 명사의 원형을 밝혀 적지 않는다(꼴+악서니, 목+아지).",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-043",
    "topic": "형태에 관한 것",
    "subject": "꼴 + -악서니",
    "question": "바른 표기는?",
    "answers": {
      "up": "꼬락서니",
      "left": "꼴악서니",
      "right": "꼴악써니",
      "down": "꼬락써니"
    },
    "correct": "up",
    "explanation": "-이 이외의 모음 접미사 -악서니가 붙었으므로 명사 꼴의 원형을 밝히지 않고 꼬락서니로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 29쪽"
  },
  {
    "id": "korean-grammar-044",
    "topic": "형태에 관한 것",
    "subject": "값지다 · 넋두리 · 빛깔 · 낚시 · 늙정이",
    "question": "이렇게 적는 규정은?",
    "answers": {
      "up": "자음 접미사 앞 원형 밝힘",
      "left": "모음 접미사 앞 원형",
      "right": "사이시옷",
      "down": "된소리 표기"
    },
    "correct": "up",
    "explanation": "제21항: 명사나 용언 어간 뒤에 자음으로 시작된 접미사가 붙어서 된 말은 그 명사나 어간의 원형을 밝혀 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-045",
    "topic": "형태에 관한 것",
    "subject": "넓적하다 vs 널따랗다",
    "question": "‘널따랗다’를 소리대로 적는 까닭은?",
    "answers": {
      "up": "겹받침 끝소리가 안 드러남",
      "left": "모음 접미사가 붙음",
      "right": "두음 법칙",
      "down": "사이시옷"
    },
    "correct": "up",
    "explanation": "제21항 다만: 겹받침의 끝소리가 드러나지 않으면 소리대로 적는다. 넓적하다는 ㅂ이 드러나 원형을 밝혀 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-046",
    "topic": "형태에 관한 것",
    "subject": "곰곰이 · 더욱이 · 생긋이 · 일찍이",
    "question": "이 말들이 만들어진 방식은?",
    "answers": {
      "up": "부사 + -이",
      "left": "명사 + -이",
      "right": "어간 + -이",
      "down": "-하다 어근 + -히"
    },
    "correct": "up",
    "explanation": "제25항 2: 부사에 -이가 붙어서 역시 부사가 되는 경우에는 그 부사의 원형을 밝혀 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-047",
    "topic": "형태에 관한 것",
    "subject": "급히 · 꾸준히 · 딱히 · 깨끗이",
    "question": "이 말들이 만들어진 방식은?",
    "answers": {
      "up": "-하다 어근 + -히/-이",
      "left": "부사 + -이",
      "right": "명사 + -이",
      "down": "어간 + -음"
    },
    "correct": "up",
    "explanation": "제25항 1: -하다가 붙는 어근에 -히나 -이가 붙어서 부사가 되면 그 어근의 원형을 밝혀 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-048",
    "topic": "형태에 관한 것",
    "subject": "꽃잎 · 물난리 · 헛웃음 · 빗나가다",
    "question": "원형을 밝혀 적는 까닭은?",
    "answers": {
      "up": "단어·접두사가 결합",
      "left": "두음 법칙",
      "right": "된소리 표기",
      "down": "사이시옷 표기"
    },
    "correct": "up",
    "explanation": "제27항: 둘 이상의 단어가 어울리거나 접두사가 붙어서 이루어진 말은 각각 그 원형을 밝혀 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-049",
    "topic": "형태에 관한 것",
    "subject": "골병 · 며칠 · 오라비 · 부리나케",
    "question": "원형을 밝히지 않는 까닭은?",
    "answers": {
      "up": "어원이 분명하지 않음",
      "left": "발음이 같아서",
      "right": "한자어라서",
      "down": "사이시옷 때문"
    },
    "correct": "up",
    "explanation": "제27항 붙임 2: 어원이 분명하지 아니한 것은 원형을 밝혀 적지 아니한다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-050",
    "topic": "형태에 관한 것",
    "subject": "몇 월 며칠 / 오늘이 ___이지?",
    "question": "바른 표기는?",
    "answers": {
      "up": "며칠",
      "left": "몇일",
      "right": "몇칠",
      "down": "며일"
    },
    "correct": "up",
    "explanation": "며칠은 어원이 분명하지 않아 원형을 밝히지 않고 소리대로 적는다. 몇일은 틀린 표기다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-051",
    "topic": "형태에 관한 것",
    "subject": "반짇고리 · 사흗날 · 섣달 · 숟가락",
    "question": "ㄷ으로 적는 까닭은?",
    "answers": {
      "up": "ㄹ이 ㄷ 소리로 남",
      "left": "사이시옷 대신",
      "right": "두음 법칙",
      "down": "된소리 표기"
    },
    "correct": "up",
    "explanation": "제29항: 끝소리가 ㄹ인 말과 딴 말이 어울릴 때 ㄹ 소리가 ㄷ 소리로 나는 것은 ㄷ으로 적는다(바느질, 사흘, 설, 술).",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-052",
    "topic": "형태에 관한 것",
    "subject": "베풀- + -ㅁ",
    "question": "바른 명사형은?",
    "answers": {
      "up": "베풂",
      "left": "베품",
      "right": "베풀음",
      "down": "베픔"
    },
    "correct": "up",
    "explanation": "용언의 어간과 어미는 구별하여 적는다. 어간 베풀-에 명사형 어미 -ㅁ이 붙으면 베풂이다.",
    "sourceNote": "우리말 바로 쓰기 · 22쪽"
  },
  {
    "id": "korean-grammar-053",
    "topic": "형태에 관한 것",
    "subject": "넓- + -으니",
    "question": "바른 표기는?",
    "answers": {
      "up": "넓으니",
      "left": "널브니",
      "right": "넓브니",
      "down": "널으니"
    },
    "correct": "up",
    "explanation": "용언의 어간과 어미는 구별해 적으므로 어간 넓-에 어미 -으니를 붙여 넓으니로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 25쪽"
  },
  {
    "id": "korean-grammar-054",
    "topic": "형태에 관한 것",
    "subject": "늘어나다 vs 쓰러지다",
    "question": "‘쓰러지다’를 소리대로 적는 까닭은?",
    "answers": {
      "up": "앞말 본뜻에서 멀어짐",
      "left": "앞말 본뜻이 유지됨",
      "right": "접두사가 붙음",
      "down": "두음 법칙"
    },
    "correct": "up",
    "explanation": "두 용언이 어울려 한 용언이 될 때 앞말의 본뜻이 유지되면 원형을 밝히고(늘어나다), 멀어지면 소리대로 적는다(쓰러지다).",
    "sourceNote": "우리말 바로 쓰기 · 22쪽"
  },
  {
    "id": "korean-grammar-055",
    "topic": "형태에 관한 것",
    "subject": "사라지다 · 드러나다 · 쓰러지다",
    "question": "공통 표기 원리는?",
    "answers": {
      "up": "본뜻 멀어져 소리대로",
      "left": "본뜻 유지해 원형대로",
      "right": "사이시옷",
      "down": "된소리 표기"
    },
    "correct": "up",
    "explanation": "살다·들다·쓸다의 본뜻에서 멀어졌으므로 원형을 밝히지 않고 소리 나는 대로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 22쪽"
  },
  {
    "id": "korean-grammar-056",
    "topic": "형태에 관한 것",
    "subject": "구름이 걷히자 산봉우리가 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "드러났다",
      "left": "들어났다",
      "right": "드러낫다",
      "down": "들어낫다"
    },
    "correct": "up",
    "explanation": "드러나다는 앞말 들다의 본뜻에서 멀어졌으므로 소리 나는 대로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 25쪽"
  },
  {
    "id": "korean-grammar-057",
    "topic": "형태에 관한 것",
    "subject": "그들은 사방으로 ___ 도망쳤다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "흩어지고",
      "left": "흐터지고",
      "right": "흩터지고",
      "down": "흐더지고"
    },
    "correct": "up",
    "explanation": "흩어지다는 앞말 흩다의 본뜻이 유지되므로 원형을 밝혀 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 25쪽"
  },
  {
    "id": "korean-grammar-058",
    "topic": "형태에 관한 것",
    "subject": "나무가 ___ 전신주를 덮쳤다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "쓰러지면서",
      "left": "쓸어지면서",
      "right": "쓸러지면서",
      "down": "쓰러지며서"
    },
    "correct": "up",
    "explanation": "쓰러지다는 쓸다의 본뜻에서 멀어진 말이라 소리 나는 대로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 25쪽"
  },
  {
    "id": "korean-grammar-059",
    "topic": "형태에 관한 것",
    "subject": "수출이 작년보다 두 배나 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "늘어났다",
      "left": "느러났다",
      "right": "늘어낫다",
      "down": "늘러났다"
    },
    "correct": "up",
    "explanation": "늘어나다는 늘다의 본뜻이 유지되므로 원형을 밝혀 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 25쪽"
  },
  {
    "id": "korean-grammar-060",
    "topic": "형태에 관한 것",
    "subject": "틈이 점점 ___ 있었다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "벌어지고",
      "left": "버러지고",
      "right": "벌러지고",
      "down": "벌어지구"
    },
    "correct": "up",
    "explanation": "벌어지다는 벌다(틈이 나다)의 본뜻이 유지되므로 원형을 밝혀 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 25쪽"
  },
  {
    "id": "korean-grammar-061",
    "topic": "사이시옷",
    "subject": "나룻배 · 바닷가 · 햇볕 · 귓밥",
    "question": "사이시옷을 적는 조건은?",
    "answers": {
      "up": "뒷말 첫소리가 된소리",
      "left": "ㄴ·ㅁ 앞 ㄴ 덧남",
      "right": "모음 앞 ㄴㄴ 덧남",
      "down": "두 음절 한자어"
    },
    "correct": "up",
    "explanation": "순우리말 합성어로 앞말이 모음으로 끝나고 뒷말 첫소리가 된소리로 나면 사이시옷을 받치어 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-062",
    "topic": "사이시옷",
    "subject": "아랫니 · 잇몸 · 냇물 · 빗물",
    "question": "사이시옷을 적는 조건은?",
    "answers": {
      "up": "ㄴ·ㅁ 앞 ㄴ 덧남",
      "left": "뒷말이 된소리",
      "right": "모음 앞 ㄴㄴ 덧남",
      "down": "앞말이 자음"
    },
    "correct": "up",
    "explanation": "뒷말의 첫소리 ㄴ·ㅁ 앞에서 ㄴ 소리가 덧나는 경우 사이시옷을 적는다(아래+니→아랫니[아랜니]).",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-063",
    "topic": "사이시옷",
    "subject": "뒷일 · 깻잎 · 나뭇잎 · 허드렛일",
    "question": "사이시옷을 적는 조건은?",
    "answers": {
      "up": "모음 앞 ㄴㄴ 덧남",
      "left": "ㄴ·ㅁ 앞 ㄴ 덧남",
      "right": "뒷말이 된소리",
      "down": "두 음절 한자어"
    },
    "correct": "up",
    "explanation": "뒷말의 첫소리 모음 앞에서 ㄴㄴ 소리가 덧나는 경우 사이시옷을 적는다(허드레+일→허드렛일[허드렌닐]).",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-064",
    "topic": "사이시옷",
    "subject": "곳간 · 셋방 · 숫자 · 찻간 · 툇간 · 횟수",
    "question": "이 단어들의 공통점은?",
    "answers": {
      "up": "사이시옷 쓰는 한자어 6개",
      "left": "고유어끼리 합성어",
      "right": "사이시옷 안 씀",
      "down": "세 음절 한자어"
    },
    "correct": "up",
    "explanation": "한자어에는 사이시옷을 적지 않지만, 두 음절로 된 이 여섯 한자어에만 예외로 사이시옷을 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 23쪽"
  },
  {
    "id": "korean-grammar-065",
    "topic": "사이시옷",
    "subject": "개수(個數) · 초점(焦點) · 전세방",
    "question": "사이시옷을 적지 않는 까닭은?",
    "answers": {
      "up": "한자어로만 됨",
      "left": "앞말이 자음으로 끝남",
      "right": "외래어 결합",
      "down": "된소리가 안 남"
    },
    "correct": "up",
    "explanation": "한자어로만 이루어진 단어는 곳간·셋방·숫자·찻간·툇간·횟수를 빼고 사이시옷을 적지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 23쪽"
  },
  {
    "id": "korean-grammar-066",
    "topic": "사이시옷",
    "subject": "핑크빛 · 피자집",
    "question": "사이시옷을 적지 않는 까닭은?",
    "answers": {
      "up": "외래어가 결합함",
      "left": "한자어라서",
      "right": "된소리가 안 남",
      "down": "앞말이 자음"
    },
    "correct": "up",
    "explanation": "고유어와 외래어가 결합한 경우에는 사이시옷을 적지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 23쪽"
  },
  {
    "id": "korean-grammar-067",
    "topic": "사이시옷",
    "subject": "꽃 + 사슴 → 꽃사슴",
    "question": "사이시옷을 쓰지 않는 까닭은?",
    "answers": {
      "up": "앞말이 자음으로 끝남",
      "left": "고유어가 없음",
      "right": "한자어라서",
      "down": "외래어 결합"
    },
    "correct": "up",
    "explanation": "꽃은 받침으로 끝나므로 사이시옷을 더 적지 않는다. 뒷말의 첫소리가 된소리로 난다는 이유만으로 사이시옷을 적는 것은 아니다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-068",
    "topic": "사이시옷",
    "subject": "장마 + 비 → 장맛비 [장마삐]",
    "question": "해당하는 사이시옷 조건은?",
    "answers": {
      "up": "뒷말 첫소리 된소리",
      "left": "ㄴ·ㅁ 앞 ㄴ 덧남",
      "right": "모음 앞 ㄴㄴ 덧남",
      "down": "한자어 예외"
    },
    "correct": "up",
    "explanation": "장맛비는 뒷말 비의 첫소리가 된소리[삐]로 바뀌는 경우다. ㄴ 소리가 덧나는 경우가 아니다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-069",
    "topic": "사이시옷",
    "subject": "나무 + 잎",
    "question": "바른 표기는?",
    "answers": {
      "up": "나뭇잎",
      "left": "나무잎",
      "right": "나문잎",
      "down": "나뭇닢"
    },
    "correct": "up",
    "explanation": "나무+잎은 모음 앞에서 ㄴㄴ 소리가 덧나므로[나문닙] 사이시옷을 받쳐 나뭇잎으로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-070",
    "topic": "사이시옷",
    "subject": "교차(交叉) + 점(點)",
    "question": "사이시옷을 쓰지 않는 까닭은?",
    "answers": {
      "up": "고유어가 없음",
      "left": "앞말이 자음",
      "right": "된소리가 안 남",
      "down": "외래어 결합"
    },
    "correct": "up",
    "explanation": "사이시옷은 결합한 두 명사 중 하나 이상이 고유어여야 한다. 교차점은 한자어끼리라 사이시옷을 쓰지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-071",
    "topic": "사이시옷",
    "subject": "냇물 · 잇몸 · 빗물 · 제삿날",
    "question": "단어 구성이 다른 하나는?",
    "answers": {
      "up": "제삿날",
      "left": "냇물",
      "right": "잇몸",
      "down": "빗물"
    },
    "correct": "up",
    "explanation": "제삿날은 한자어 제사(祭祀)와 고유어 날의 합성어다. 나머지는 순우리말끼리의 합성어다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-072",
    "topic": "사이시옷",
    "subject": "만두 + 국 [만두꾹]",
    "question": "바른 표기는?",
    "answers": {
      "up": "만둣국",
      "left": "만두국",
      "right": "만둔국",
      "down": "만둣꾹"
    },
    "correct": "up",
    "explanation": "뒷말의 첫소리가 된소리로 나므로 사이시옷을 받쳐 만둣국으로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-073",
    "topic": "사이시옷",
    "subject": "후일(後日) + 담(譚)",
    "question": "바른 표기는?",
    "answers": {
      "up": "후일담",
      "left": "훗일담",
      "right": "후잇담",
      "down": "훗날담"
    },
    "correct": "up",
    "explanation": "후일담은 한자어로만 된 말이라 사이시옷을 적지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-074",
    "topic": "사이시옷",
    "subject": "한자어로만 된 단어",
    "question": "사이시옷 표기 원칙은?",
    "answers": {
      "up": "6개 외엔 안 씀",
      "left": "항상 씀",
      "right": "된소리 나면 씀",
      "down": "두 음절이면 씀"
    },
    "correct": "up",
    "explanation": "한자어로만 된 단어에는 원칙적으로 사이시옷을 쓰지 않고, 곳간·셋방·숫자·찻간·툇간·횟수만 예외다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-075",
    "topic": "사이시옷",
    "subject": "고유어+한자어인 사이시옷 표기",
    "question": "표기 조건을 모두 충족하는 예는?",
    "answers": {
      "up": "귓병 · 찻잔 · 훗일",
      "left": "곳간 · 셋방",
      "right": "핑크빛 · 피자집",
      "down": "개수 · 초점"
    },
    "correct": "up",
    "explanation": "고유어와 한자어가 결합한 합성어이면서 앞말이 모음으로 끝나고, 뒷말의 된소리나 ㄴ 소리 덧남 등 발음 조건을 충족해야 한다. 모음으로 끝난다는 조건만으로는 부족하다.",
    "sourceNote": "우리말 바로 쓰기 · 18쪽"
  },
  {
    "id": "korean-grammar-076",
    "topic": "준말",
    "subject": "보이어 → 뵈어, ( ? )",
    "question": "또 하나의 준말은?",
    "answers": {
      "up": "보여",
      "left": "뵈여",
      "right": "봬여",
      "down": "보어"
    },
    "correct": "up",
    "explanation": "제38항: ㅏ·ㅗ·ㅜ·ㅡ 뒤에 -이어가 어울려 줄어질 때는 준 대로 적는다(보이어→뵈어/보여).",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-077",
    "topic": "준말",
    "subject": "싸이어 → ( ? ), 싸여",
    "question": "또 하나의 준말은?",
    "answers": {
      "up": "쌔어",
      "left": "싸여어",
      "right": "쌔여",
      "down": "싸어"
    },
    "correct": "up",
    "explanation": "제38항에 따라 싸이어는 쌔어, 싸여 두 가지로 줄여 적을 수 있다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-078",
    "topic": "준말",
    "subject": "그렇지 않은",
    "question": "준말의 바른 표기는?",
    "answers": {
      "up": "그렇잖은",
      "left": "그렇찮은",
      "right": "그러잖은",
      "down": "그렇쟎은"
    },
    "correct": "up",
    "explanation": "제39항: 어미 -지 뒤에 않-이 어울려 -잖-이 될 때는 준 대로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-079",
    "topic": "준말",
    "subject": "만만하지 않다",
    "question": "준말의 바른 표기는?",
    "answers": {
      "up": "만만찮다",
      "left": "만만잖다",
      "right": "만만챦다",
      "down": "만만찬다"
    },
    "correct": "up",
    "explanation": "제39항: -하지 뒤에 않-이 어울려 -찮-이 될 때는 준 대로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-080",
    "topic": "준말",
    "subject": "간편하게",
    "question": "준말의 바른 표기는?",
    "answers": {
      "up": "간편케",
      "left": "간편게",
      "right": "간편께",
      "down": "간펴케"
    },
    "correct": "up",
    "explanation": "제40항: 하의 ㅏ가 줄고 ㅎ이 다음 음절 첫소리와 어울려 거센소리가 되면 거센소리로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-081",
    "topic": "준말",
    "subject": "생각하건대",
    "question": "준말의 바른 표기는?",
    "answers": {
      "up": "생각건대",
      "left": "생각컨대",
      "right": "생각껀대",
      "down": "생각껀데"
    },
    "correct": "up",
    "explanation": "안울림소리(ㄱ·ㄷ·ㅂ) 뒤에서는 하가 통째로 줄어 거센소리가 되지 않는다. 그래서 생각건대로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-082",
    "topic": "준말",
    "subject": "연구하도록",
    "question": "준말의 바른 표기는?",
    "answers": {
      "up": "연구토록",
      "left": "연구도록",
      "right": "연구또록",
      "down": "연굿도록"
    },
    "correct": "up",
    "explanation": "울림소리 뒤에서 하의 ㅏ가 줄고 ㅎ이 남아 다음 첫소리와 거센소리가 되므로 연구토록으로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-083",
    "topic": "준말",
    "subject": "거북하지",
    "question": "준말의 바른 표기는?",
    "answers": {
      "up": "거북지",
      "left": "거북치",
      "right": "거부치",
      "down": "거북찌"
    },
    "correct": "up",
    "explanation": "ㄱ 받침 뒤라 하가 통째로 줄어든다. 거센소리로 적지 않고 거북지로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-084",
    "topic": "준말",
    "subject": "익숙하지 않다",
    "question": "준말의 바른 표기는?",
    "answers": {
      "up": "익숙지 않다",
      "left": "익숙치 않다",
      "right": "익쑥지 않다",
      "down": "익숙찌 않다"
    },
    "correct": "up",
    "explanation": "ㄱ 받침 뒤에서 하가 통째로 줄면 거센소리로 적지 않는다(익숙지, 생각건대, 깨끗지).",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-085",
    "topic": "준말",
    "subject": "흔하다 → 흔타 · 정결하다 → 정결타",
    "question": "거센소리로 적는 까닭은?",
    "answers": {
      "up": "ㅎ이 다음 첫소리와 어울림",
      "left": "하 전체가 줆",
      "right": "된소리되기",
      "down": "사이시옷"
    },
    "correct": "up",
    "explanation": "울림소리 뒤에서는 하의 ㅏ만 줄고 남은 ㅎ이 다음 음절 첫소리와 어울려 거센소리가 된다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-086",
    "topic": "준말",
    "subject": "흔타 · 간편케 · 생각컨대 · 연구토록",
    "question": "준말 표기가 잘못된 것은?",
    "answers": {
      "up": "생각컨대",
      "left": "흔타",
      "right": "간편케",
      "down": "연구토록"
    },
    "correct": "up",
    "explanation": "생각하건대는 ㄱ 받침 뒤라 하가 통째로 줄어 생각건대로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-087",
    "topic": "띄어쓰기",
    "subject": "민수야, 너밖에 없어.",
    "question": "‘밖에’를 붙여 쓴 까닭은?",
    "answers": {
      "up": "조사라서",
      "left": "의존 명사라서",
      "right": "접두사라서",
      "down": "단위 명사라서"
    },
    "correct": "up",
    "explanation": "그것 말고는의 뜻을 가진 밖에는 조사다. 조사는 그 앞말에 붙여 쓴다(제41항).",
    "sourceNote": "우리말 바로 쓰기 · 23쪽"
  },
  {
    "id": "korean-grammar-088",
    "topic": "띄어쓰기",
    "subject": "뭔 소리야? 나 지금 밖에 있는데?",
    "question": "여기서 ‘밖’의 품사는?",
    "answers": {
      "up": "명사",
      "left": "조사",
      "right": "의존 명사",
      "down": "부사"
    },
    "correct": "up",
    "explanation": "실외를 뜻하는 밖은 명사이므로 앞말과 띄어 쓴다. 너밖에의 밖에(조사)와 구별한다.",
    "sourceNote": "우리말 바로 쓰기 · 23쪽"
  },
  {
    "id": "korean-grammar-089",
    "topic": "띄어쓰기",
    "subject": "오늘만이라도",
    "question": "이렇게 붙여 쓴 까닭은?",
    "answers": {
      "up": "조사가 연속됨",
      "left": "의존 명사라서",
      "right": "어미라서",
      "down": "접사라서"
    },
    "correct": "up",
    "explanation": "조사가 둘 이상 연속되거나 어미 뒤에 붙을 때도 앞말에 붙여 쓴다(만+이라도).",
    "sourceNote": "우리말 바로 쓰기 · 23쪽"
  },
  {
    "id": "korean-grammar-090",
    "topic": "띄어쓰기",
    "subject": "아는 것이 힘이다. / 할 수 있다.",
    "question": "‘것, 수’를 띄어 쓰는 까닭은?",
    "answers": {
      "up": "의존 명사라서",
      "left": "조사라서",
      "right": "단위 명사라서",
      "down": "접미사라서"
    },
    "correct": "up",
    "explanation": "제42항: 의존 명사는 띄어 쓴다. 꾸며 주는 말이 있어야 쓰이지만 명사의 기능을 하는 단어이기 때문이다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-091",
    "topic": "띄어쓰기",
    "subject": "집 한 채 · 소 한 마리 · 옷 한 벌",
    "question": "‘채, 마리, 벌’을 띄어 쓰는 근거는?",
    "answers": {
      "up": "제43항 단위 명사",
      "left": "제41항 조사",
      "right": "제42항 의존 명사",
      "down": "제47항 보조 용언"
    },
    "correct": "up",
    "explanation": "제43항: 단위를 나타내는 명사는 띄어 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-092",
    "topic": "띄어쓰기",
    "subject": "제6회 · 35그램 · 2층",
    "question": "붙여 쓸 수 있는 까닭은?",
    "answers": {
      "up": "순서·숫자와 어울림",
      "left": "조사라서",
      "right": "한자어라서",
      "down": "의존 명사라서"
    },
    "correct": "up",
    "explanation": "단위 명사는 띄어 쓰지만, 순서를 나타내거나 아라비아 숫자와 어울려 쓰이면 붙여 쓸 수 있다(허용).",
    "sourceNote": "우리말 바로 쓰기 · 23쪽"
  },
  {
    "id": "korean-grammar-093",
    "topic": "띄어쓰기",
    "subject": "꺼져 간다 / 꺼져간다",
    "question": "보조 용언 띄어쓰기는?",
    "answers": {
      "up": "띄어 씀 원칙, 붙임 허용",
      "left": "항상 붙여 씀",
      "right": "항상 띄어 씀",
      "down": "붙임 원칙, 띄움 허용"
    },
    "correct": "up",
    "explanation": "제47항: 보조 용언은 띄어 씀을 원칙으로 하되, 경우에 따라 붙여 씀도 허용한다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-094",
    "topic": "띄어쓰기",
    "subject": "너뿐이야. / 웃을 뿐이었다.",
    "question": "두 ‘뿐’의 품사는 차례로?",
    "answers": {
      "up": "조사–의존 명사",
      "left": "의존 명사–조사",
      "right": "조사–조사",
      "down": "의존 명사–의존 명사"
    },
    "correct": "up",
    "explanation": "체언 뒤의 뿐은 조사라 붙여 쓰고, 관형어 뒤에서 따름이라는 뜻의 뿐은 의존 명사라 띄어 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-095",
    "topic": "띄어쓰기",
    "subject": "___ 모두 말해 보자. (알다)",
    "question": "바른 띄어쓰기는?",
    "answers": {
      "up": "아는 대로",
      "left": "아는대로",
      "right": "아 는대로",
      "down": "아는 대 로"
    },
    "correct": "up",
    "explanation": "관형어 아는 뒤의 대로는 의존 명사이므로 띄어 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-096",
    "topic": "띄어쓰기",
    "subject": "손님들은 ___ 충분히 먹었다. (먹다)",
    "question": "바른 띄어쓰기는?",
    "answers": {
      "up": "먹을 만큼",
      "left": "먹을만큼",
      "right": "먹 을만큼",
      "down": "먹을만 큼"
    },
    "correct": "up",
    "explanation": "관형어 먹을 뒤의 만큼은 의존 명사이므로 띄어 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-097",
    "topic": "띄어쓰기",
    "subject": "그 사람은 ___ 누구보다 앞선다. (말)",
    "question": "바른 띄어쓰기는?",
    "answers": {
      "up": "말만큼은",
      "left": "말 만큼은",
      "right": "말만 큼은",
      "down": "말 만 큼은"
    },
    "correct": "up",
    "explanation": "체언 말 뒤의 만큼은 조사이므로 붙여 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-098",
    "topic": "띄어쓰기",
    "subject": "모든 것이 ___ 되었다. (내 생각)",
    "question": "바른 띄어쓰기는?",
    "answers": {
      "up": "내 생각대로",
      "left": "내 생각 대로",
      "right": "내생각 대로",
      "down": "내생각대로"
    },
    "correct": "up",
    "explanation": "체언 생각 뒤의 대로는 조사이므로 붙여 쓴다. 관형어 내와 생각은 띄어 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-099",
    "topic": "띄어쓰기",
    "subject": "보다 높게 뛰자. / 시보다 소설이 좋다.",
    "question": "두 ‘보다’의 품사는 차례로?",
    "answers": {
      "up": "부사–조사",
      "left": "조사–부사",
      "right": "부사–부사",
      "down": "조사–조사"
    },
    "correct": "up",
    "explanation": "어떤 수준보다 한층 더의 뜻인 보다는 부사라 띄어 쓰고, 비교 대상 체언 뒤의 보다는 조사라 붙여 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-100",
    "topic": "띄어쓰기",
    "subject": "사과 10 개 / 사과 10개",
    "question": "두 표기에 대한 설명으로 옳은 것은?",
    "answers": {
      "up": "둘 다 허용",
      "left": "10 개만 맞음",
      "right": "10개만 맞음",
      "down": "둘 다 틀림"
    },
    "correct": "up",
    "explanation": "단위를 나타내는 명사는 띄어 쓰는 것이 원칙이지만, 아라비아 숫자와 어울려 쓰일 때에는 붙여 쓰는 것도 허용된다. 따라서 두 표기가 모두 가능하다.",
    "sourceNote": "우리말 바로 쓰기 · 26쪽"
  },
  {
    "id": "korean-grammar-101",
    "topic": "띄어쓰기",
    "subject": "너무 아는 척을 하지 마.",
    "question": "‘척’을 띄어 쓴 까닭은?",
    "answers": {
      "up": "의존 명사라서",
      "left": "조사라서",
      "right": "보조 용언이라서",
      "down": "접미사라서"
    },
    "correct": "up",
    "explanation": "척은 관형어 아는의 꾸밈을 받는 의존 명사이므로 띄어 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 26쪽"
  },
  {
    "id": "korean-grammar-102",
    "topic": "띄어쓰기",
    "subject": "나는 조용히 웃고만 있었다.",
    "question": "‘만’을 붙여 쓴 까닭은?",
    "answers": {
      "up": "조사는 어미 뒤에도 붙임",
      "left": "의존 명사라서",
      "right": "접미사라서",
      "down": "보조 용언이라서"
    },
    "correct": "up",
    "explanation": "조사는 어미 뒤에 붙을 때도 앞말에 붙여 쓴다(웃-+-고+만).",
    "sourceNote": "우리말 바로 쓰기 · 26쪽"
  },
  {
    "id": "korean-grammar-103",
    "topic": "띄어쓰기",
    "subject": "그는 반성을 ___ 오히려 큰소리를 쳤다.",
    "question": "바른 띄어쓰기는?",
    "answers": {
      "up": "하기는커녕",
      "left": "하기는 커녕",
      "right": "하기 는커녕",
      "down": "하기는커 녕"
    },
    "correct": "up",
    "explanation": "는커녕은 조사(는+커녕)이므로 앞말에 붙여 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-104",
    "topic": "띄어쓰기",
    "subject": "모습은 예전과 ___가 없었다.",
    "question": "바른 띄어쓰기는?",
    "answers": {
      "up": "다를 바",
      "left": "다를바",
      "right": "다 를바",
      "down": "달을 바"
    },
    "correct": "up",
    "explanation": "바는 앞에 꾸미는 말이 있어야 쓰이는 의존 명사이므로 띄어 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-105",
    "topic": "띄어쓰기",
    "subject": "그는 ___ 도전했다.",
    "question": "바른 띄어쓰기는?",
    "answers": {
      "up": "수없이",
      "left": "수 없이",
      "right": "수없 이",
      "down": "수 없 이"
    },
    "correct": "up",
    "explanation": "수없이는 한 단어인 부사이므로 붙여 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-106",
    "topic": "띄어쓰기",
    "subject": "주머니 안에는 ___.",
    "question": "바른 띄어쓰기는?",
    "answers": {
      "up": "잔돈뿐이었다",
      "left": "잔돈 뿐이었다",
      "right": "잔 돈뿐이었다",
      "down": "잔돈뿐 이었다"
    },
    "correct": "up",
    "explanation": "체언 잔돈 뒤의 뿐은 조사이고, 이었다도 조사 이다의 활용형이므로 모두 붙여 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 30쪽"
  },
  {
    "id": "korean-grammar-107",
    "topic": "띄어쓰기",
    "subject": "그 물건은 ___ 빛이 났다.",
    "question": "바른 띄어쓰기는?",
    "answers": {
      "up": "보석같이",
      "left": "보석 같이",
      "right": "보 석같이",
      "down": "보석같 이"
    },
    "correct": "up",
    "explanation": "체언 뒤에 쓰인 같이는 조사이므로 앞말에 붙여 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 30쪽"
  },
  {
    "id": "korean-grammar-108",
    "topic": "띄어쓰기",
    "subject": "학교를 ___ 벌써 3년이 지났다.",
    "question": "바른 띄어쓰기는?",
    "answers": {
      "up": "졸업한 지",
      "left": "졸업한지",
      "right": "졸업 한지",
      "down": "졸 업한 지"
    },
    "correct": "up",
    "explanation": "시간의 경과를 나타내는 지는 의존 명사이므로 띄어 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 30쪽"
  },
  {
    "id": "korean-grammar-109",
    "topic": "띄어쓰기",
    "subject": "하던 것을 ___ 없었다.",
    "question": "바른 띄어쓰기는?",
    "answers": {
      "up": "멈출 수밖에",
      "left": "멈출 수 밖에",
      "right": "멈출수밖에",
      "down": "멈출수 밖에"
    },
    "correct": "up",
    "explanation": "수는 의존 명사라 띄어 쓰고, 밖에는 조사라 수에 붙여 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 30쪽"
  },
  {
    "id": "korean-grammar-110",
    "topic": "띄어쓰기",
    "subject": "이 문제를 ___ 시간이 필요하다.",
    "question": "빈칸에 알맞은 띄어쓰기는?",
    "answers": {
      "up": "해결하는 데",
      "left": "해결하는데",
      "right": "해결 하는데",
      "down": "해결하 는데"
    },
    "correct": "up",
    "explanation": "이 문장의 데는 어떤 일을 하는 데 필요한 시간과 관련된 의존 명사다. 해결하는 뒤에서 띄어 쓴다. 문장을 이어 주는 어미 -는데와 구별한다.",
    "sourceNote": "우리말 바로 쓰기 · 30쪽"
  },
  {
    "id": "korean-grammar-111",
    "topic": "띄어쓰기",
    "subject": "문제 푸는 데 시간이 걸렸다.",
    "question": "‘데’를 띄어 쓴 까닭은?",
    "answers": {
      "up": "의존 명사이기 때문",
      "left": "연결 어미이기 때문",
      "right": "조사이기 때문",
      "down": "접두사이기 때문"
    },
    "correct": "up",
    "explanation": "여기서 데는 문제를 푸는 일과 관련된 의존 명사이므로 앞말과 띄어 쓴다. 어미 -는데가 아니다.",
    "sourceNote": "우리말 바로 쓰기 · 30쪽"
  },
  {
    "id": "korean-grammar-112",
    "topic": "띄어쓰기",
    "subject": "‘지’의 띄어쓰기",
    "question": "‘지’를 띄어 쓰는 경우는?",
    "answers": {
      "up": "시간의 경과를 나타냄",
      "left": "막연한 의문을 나타냄",
      "right": "어미의 일부임",
      "down": "항상 붙여 씀"
    },
    "correct": "up",
    "explanation": "시간의 경과를 나타내는 지는 의존 명사라 띄어 쓴다. 막연한 의문의 -ㄴ지는 어미라 붙여 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 30쪽"
  },
  {
    "id": "korean-grammar-113",
    "topic": "띄어쓰기",
    "subject": "보석같이 · 너같이",
    "question": "‘같이’를 붙여 쓰는 조건은?",
    "answers": {
      "up": "체언 뒤 조사일 때",
      "left": "용언 뒤일 때",
      "right": "문장 앞일 때",
      "down": "항상 띄어 씀"
    },
    "correct": "up",
    "explanation": "같이가 체언 뒤에 쓰여 처럼의 뜻이면 조사이므로 앞말에 붙여 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 30쪽"
  },
  {
    "id": "korean-grammar-114",
    "topic": "띄어쓰기",
    "subject": "아버지가방에들어가신다.",
    "question": "띄어쓰기를 하지 않았을 때의 문제는?",
    "answers": {
      "up": "단어 경계가 불분명함",
      "left": "조사가 모두 빠짐",
      "right": "모든 단어가 외래어임",
      "down": "발음을 표시한 문장임"
    },
    "correct": "up",
    "explanation": "아버지가 방에 들어가신다와 아버지 가방에 들어가신다는 단어 경계가 다르다. 띄어쓰기는 문장의 구조와 의미를 분명하게 보여 준다.",
    "sourceNote": "우리말 바로 쓰기 · 29쪽"
  },
  {
    "id": "korean-grammar-115",
    "topic": "띄어쓰기",
    "subject": "책·공책 등을 챙길 수 있었다.",
    "question": "띄어쓰기 설명으로 틀린 것은?",
    "answers": {
      "up": "등은 단위 명사라 띄움",
      "left": "을은 조사라 붙임",
      "right": "수는 의존 명사라 띄움",
      "down": "있었다는 한 단어"
    },
    "correct": "up",
    "explanation": "여기서 등은 예시한 것들을 열거하는 의존 명사이며 단위 명사가 아니다. 조사 을은 붙여 쓰고, 수는 의존 명사이므로 띄어 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 30쪽"
  },
  {
    "id": "korean-grammar-116",
    "topic": "띄어쓰기",
    "subject": "하늘에서 별이라도 따오겠다.",
    "question": "‘이라도’를 붙여 쓴 까닭은?",
    "answers": {
      "up": "조사라서",
      "left": "의존 명사라서",
      "right": "보조 용언",
      "down": "부사라서"
    },
    "correct": "up",
    "explanation": "이라도는 조사이므로 체언 별에 붙여 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-117",
    "topic": "그 밖의 것",
    "subject": "깨끗__ · 가까__ · 번거로__",
    "question": "빈칸에 공통으로 들어갈 말은?",
    "answers": {
      "up": "-이",
      "left": "-히",
      "right": "-리",
      "down": "-기"
    },
    "correct": "up",
    "explanation": "제51항: 부사의 끝음절이 분명히 이로만 나는 것은 -이로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-118",
    "topic": "그 밖의 것",
    "subject": "급__ · 딱__ · 속__ · 솔직__",
    "question": "빈칸에 공통으로 들어갈 말은?",
    "answers": {
      "up": "-히",
      "left": "-이",
      "right": "-리",
      "down": "-기"
    },
    "correct": "up",
    "explanation": "제51항: 히로만 나거나 이·히로 나는 것은 -히로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-119",
    "topic": "그 밖의 것",
    "subject": "서류를 ___ 살펴보다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "꼼꼼히",
      "left": "꼼꼼이",
      "right": "꼼꼼희",
      "down": "꼼꼼리"
    },
    "correct": "up",
    "explanation": "꼼꼼히는 이·히로 나는 말이므로 -히로 적는다(제51항).",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-120",
    "topic": "그 밖의 것",
    "subject": "이 일은 내가 ___. (하다, 약속)",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "할게",
      "left": "할께",
      "right": "할계",
      "down": "할깨"
    },
    "correct": "up",
    "explanation": "제53항: -(으)ㄹ게 같은 어미는 된소리로 나더라도 예사소리로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-121",
    "topic": "그 밖의 것",
    "subject": "-(으)ㄹ거나 · -(으)ㄹ걸 · -(으)ㄹ게",
    "question": "이 어미의 첫 자음은 어떻게 적는가?",
    "answers": {
      "up": "예사소리로",
      "left": "된소리로",
      "right": "거센소리로",
      "down": "소리대로"
    },
    "correct": "up",
    "explanation": "제53항: 이 어미들은 [께]·[껄]처럼 소리 나도 예사소리로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-122",
    "topic": "그 밖의 것",
    "subject": "-하다가 붙는 어근 + -히",
    "question": "‘딱히’를 ‘딱이’로 적지 않는 까닭은?",
    "answers": {
      "up": "히로 소리 나서",
      "left": "이로 소리 나서",
      "right": "두음 법칙",
      "down": "된소리 표기"
    },
    "correct": "up",
    "explanation": "부사의 끝음절이 히로 나거나 이·히로 나면 -히로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-123",
    "topic": "외래어·로마자",
    "subject": "family",
    "question": "외래어 표기법에 맞는 것은?",
    "answers": {
      "up": "패밀리",
      "left": "훼밀리",
      "right": "페밀리",
      "down": "패미리"
    },
    "correct": "up",
    "explanation": "외래어의 1 음운은 원칙적으로 1 기호로 적는다. f는 ㅍ으로 적어 패밀리다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-124",
    "topic": "외래어·로마자",
    "subject": "chocolate",
    "question": "외래어 표기법에 맞는 것은?",
    "answers": {
      "up": "초콜릿",
      "left": "초콜렛",
      "right": "쵸콜릿",
      "down": "초코렡"
    },
    "correct": "up",
    "explanation": "받침에는 ㄱ·ㄴ·ㄹ·ㅁ·ㅂ·ㅅ·ㅇ만 쓴다. 초콜릿이 바른 표기다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-125",
    "topic": "외래어·로마자",
    "subject": "bus",
    "question": "외래어 표기법에 맞는 것은?",
    "answers": {
      "up": "버스",
      "left": "뻐스",
      "right": "버쓰",
      "down": "뻐쓰"
    },
    "correct": "up",
    "explanation": "파열음 표기에는 된소리를 쓰지 않는 것을 원칙으로 한다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-126",
    "topic": "외래어·로마자",
    "subject": "외래어의 받침",
    "question": "쓸 수 있는 받침은?",
    "answers": {
      "up": "ㄱㄴㄹㅁㅂㅅㅇ",
      "left": "ㄱㄴㄷㄹㅁㅂㅇ",
      "right": "ㄱㄴㄹㅁㅂㅇ",
      "down": "모든 자음"
    },
    "correct": "up",
    "explanation": "외래어 받침에는 ㄱ·ㄴ·ㄹ·ㅁ·ㅂ·ㅅ·ㅇ 일곱 개만 쓴다. ㄷ은 쓰지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-127",
    "topic": "외래어·로마자",
    "subject": "외래어 표기에 쓰는 자모",
    "question": "사용하는 기본 자모의 수는?",
    "answers": {
      "up": "현용 24 자모",
      "left": "40 자모",
      "right": "14 자모",
      "down": "제한 없음"
    },
    "correct": "up",
    "explanation": "외래어는 국어의 현용 24 자모만으로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-128",
    "topic": "외래어·로마자",
    "subject": "종로 [종노]",
    "question": "로마자 표기는?",
    "answers": {
      "up": "Jongno",
      "left": "Jongro",
      "right": "Chongno",
      "down": "Jongnro"
    },
    "correct": "up",
    "explanation": "로마자 표기법은 표준 발음법에 따라 적는다. [종노]로 소리 나므로 Jongno다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-129",
    "topic": "외래어·로마자",
    "subject": "백마 [뱅마]",
    "question": "로마자 표기는?",
    "answers": {
      "up": "Baengma",
      "left": "Baekma",
      "right": "Paengma",
      "down": "Baengmah"
    },
    "correct": "up",
    "explanation": "음운 변화가 일어날 때에는 변화의 결과에 따라 적는다. [뱅마]이므로 Baengma다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-130",
    "topic": "외래어·로마자",
    "subject": "압구정 [압꾸정]",
    "question": "로마자 표기는?",
    "answers": {
      "up": "Apgujeong",
      "left": "Apkkujeong",
      "right": "Abgujeong",
      "down": "Apggujeong"
    },
    "correct": "up",
    "explanation": "된소리되기는 로마자 표기에 반영하지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-131",
    "topic": "외래어·로마자",
    "subject": "낙동강 [낙똥강]",
    "question": "로마자 표기는?",
    "answers": {
      "up": "Nakdonggang",
      "left": "Nakttonggang",
      "right": "Nagdonggang",
      "down": "Rakdonggang"
    },
    "correct": "up",
    "explanation": "된소리는 표기에 반영하지 않으므로 Nakdonggang으로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-132",
    "topic": "외래어·로마자",
    "subject": "부산 · 세종",
    "question": "고유 명사 로마자 표기는?",
    "answers": {
      "up": "Busan · Sejong",
      "left": "busan · sejong",
      "right": "BUSAN · SEJONG",
      "down": "Pusan · Sejong"
    },
    "correct": "up",
    "explanation": "고유 명사는 첫 글자를 대문자로 적는다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-133",
    "topic": "외래어·로마자",
    "subject": "로마자 표기법의 기준",
    "question": "무엇에 따라 적나?",
    "answers": {
      "up": "국어의 표준 발음",
      "left": "한글 철자",
      "right": "영어 발음",
      "down": "한자음"
    },
    "correct": "up",
    "explanation": "국어의 로마자 표기는 국어의 표준 발음에 따라 적는 것을 원칙으로 한다. 철자를 기계적으로 옮기거나 개인의 발음대로 적는 것이 아니다.",
    "sourceNote": "우리말 바로 쓰기 · 19쪽"
  },
  {
    "id": "korean-grammar-134",
    "topic": "혼동하기 쉬운 표기",
    "subject": "부주의로 손을 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "다쳤다",
      "left": "닫혔다",
      "right": "닫쳤다",
      "down": "다첬다"
    },
    "correct": "up",
    "explanation": "다치다는 신체에 상처가 생기다는 뜻이다. 닫히다는 닫다의 피동사, 닫치다는 세게 닫다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-135",
    "topic": "혼동하기 쉬운 표기",
    "subject": "문이 저절로 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "닫혔다",
      "left": "다쳤다",
      "right": "닫쳤다",
      "down": "닫혓다"
    },
    "correct": "up",
    "explanation": "저절로 닫히는 것은 닫다의 피동사 닫히다이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-136",
    "topic": "혼동하기 쉬운 표기",
    "subject": "문을 힘껏 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "닫쳤다",
      "left": "닫혔다",
      "right": "다쳤다",
      "down": "닥쳤다"
    },
    "correct": "up",
    "explanation": "닫치다는 문짝 따위를 세게 닫다는 뜻이다. -치-는 강세 접미사다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-137",
    "topic": "혼동하기 쉬운 표기",
    "subject": "여러 문제를 더 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "맞혔다",
      "left": "마쳤다",
      "right": "맞쳤다",
      "down": "맞첬다"
    },
    "correct": "up",
    "explanation": "맞히다는 문제에 대한 답을 틀리지 않게 하다는 뜻이다. 마치다는 끝내다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 29쪽"
  },
  {
    "id": "korean-grammar-138",
    "topic": "혼동하기 쉬운 표기",
    "subject": "벌써 일을 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "마쳤다",
      "left": "맞혔다",
      "right": "맞쳤다",
      "down": "마첬다"
    },
    "correct": "up",
    "explanation": "마치다는 일이나 과정, 절차 따위가 끝나다(끝내다)는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-139",
    "topic": "혼동하기 쉬운 표기",
    "subject": "나라를 위해 목숨을 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "바쳤다",
      "left": "받쳤다",
      "right": "받혔다",
      "down": "밭쳤다"
    },
    "correct": "up",
    "explanation": "바치다는 무엇을 위해 모든 것을 아낌없이 내놓거나 쓰다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-140",
    "topic": "혼동하기 쉬운 표기",
    "subject": "비가 와서 우산을 ___ 간다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "받치고",
      "left": "바치고",
      "right": "받히고",
      "down": "밭치고"
    },
    "correct": "up",
    "explanation": "받치다는 우산이나 양산을 펴 들다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 29쪽"
  },
  {
    "id": "korean-grammar-141",
    "topic": "혼동하기 쉬운 표기",
    "subject": "쇠뿔에 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "받혔다",
      "left": "받쳤다",
      "right": "바쳤다",
      "down": "밭혔다"
    },
    "correct": "up",
    "explanation": "받히다는 받다(머리나 뿔로 세차게 부딪다)의 피동사다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-142",
    "topic": "혼동하기 쉬운 표기",
    "subject": "술을 체에 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "밭쳤다",
      "left": "받쳤다",
      "right": "바쳤다",
      "down": "받혔다"
    },
    "correct": "up",
    "explanation": "밭치다는 구멍이 뚫린 물건 위에 국수·야채 따위를 올려 물기를 빼다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-143",
    "topic": "혼동하기 쉬운 표기",
    "subject": "약속은 ___ 지켜라.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "반드시",
      "left": "반듯이",
      "right": "반드씨",
      "down": "반듯히"
    },
    "correct": "up",
    "explanation": "반드시는 틀림없이 꼭이라는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-144",
    "topic": "혼동하기 쉬운 표기",
    "subject": "액자를 ___ 걸었다. (비뚤어지지 않게)",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "반듯이",
      "left": "반드시",
      "right": "반듯히",
      "down": "반드기"
    },
    "correct": "up",
    "explanation": "반듯이는 비뚤어지지 않고 바르게라는 뜻이다. 반드시는 꼭, 틀림없이라는 뜻이므로 제시된 의미 조건에 맞지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-145",
    "topic": "혼동하기 쉬운 표기",
    "subject": "돌을 서로 세게 ___. (능동)",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "부딪쳤다",
      "left": "부딪혔다",
      "right": "부딛쳤다",
      "down": "부딪첬다"
    },
    "correct": "up",
    "explanation": "부딪치다는 어떤 것을 다른 것에 맞닿게 하는 능동 표현이다. 목적어 돌을과 능동이라는 조건에 맞는 활용형은 부딪쳤다이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-146",
    "topic": "혼동하기 쉬운 표기",
    "subject": "가만히 있던 손수레가 트럭에 ___. (피동)",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "부딪혔다",
      "left": "부딪쳤다",
      "right": "부딛혔다",
      "down": "부딪혓다"
    },
    "correct": "up",
    "explanation": "부딪히다는 부딪치다의 피동사다. 손수레가 충격을 받은 대상으로 제시되었으므로 부딪혔다를 고른다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-147",
    "topic": "혼동하기 쉬운 표기",
    "subject": "영월을 ___ 왔다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "거쳐",
      "left": "걷혀",
      "right": "걷처",
      "down": "거처"
    },
    "correct": "up",
    "explanation": "거치다는 오가는 도중에 어디를 지나거나 들르다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-148",
    "topic": "혼동하기 쉬운 표기",
    "subject": "외상값이 잘 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "걷힌다",
      "left": "거친다",
      "right": "걷친다",
      "down": "거쳐진다"
    },
    "correct": "up",
    "explanation": "걷히다는 걷다(거두다)의 피동사다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-149",
    "topic": "혼동하기 쉬운 표기",
    "subject": "___ 수 없는 상태에 이르렀다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "걷잡을",
      "left": "겉잡을",
      "right": "겆잡을",
      "down": "걷작을"
    },
    "correct": "up",
    "explanation": "걷잡다는 한 방향으로 치우쳐 흘러가는 형세를 붙들어 잡거나 마음을 진정하다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 29쪽"
  },
  {
    "id": "korean-grammar-150",
    "topic": "혼동하기 쉬운 표기",
    "subject": "___ 이틀은 걸릴 일이다. (대강 짐작하여)",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "겉잡아도",
      "left": "걷잡아도",
      "right": "겉잡어도",
      "down": "걷자바도"
    },
    "correct": "up",
    "explanation": "겉잡다는 겉으로 보고 대강 짐작하여 헤아리다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-151",
    "topic": "혼동하기 쉬운 표기",
    "subject": "그는 부지런하다. ___ 잘 산다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "그러므로",
      "left": "그럼으로",
      "right": "그럼으로써",
      "down": "그러므로써"
    },
    "correct": "up",
    "explanation": "그러므로는 그러니까, 그렇기 때문에의 뜻으로 원인에 따른 결과를 나타낸다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-152",
    "topic": "혼동하기 쉬운 표기",
    "subject": "그는 열심히 공부한다. ___ 은혜에 보답한다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "그럼으로써",
      "left": "그러므로",
      "right": "그러므로써",
      "down": "그럼므로"
    },
    "correct": "up",
    "explanation": "그럼으로(써)는 그렇게 하는 것으로써라는 수단의 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-153",
    "topic": "혼동하기 쉬운 표기",
    "subject": "진도가 너무 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "느리다",
      "left": "늘이다",
      "right": "늘리다",
      "down": "늘인다"
    },
    "correct": "up",
    "explanation": "느리다는 동작을 하는 데 걸리는 시간이 길다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-154",
    "topic": "혼동하기 쉬운 표기",
    "subject": "고무줄을 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "늘인다",
      "left": "늘린다",
      "right": "느린다",
      "down": "늘힌다"
    },
    "correct": "up",
    "explanation": "늘이다는 본디보다 더 길어지게 하다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-155",
    "topic": "혼동하기 쉬운 표기",
    "subject": "수출량을 더 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "늘린다",
      "left": "늘인다",
      "right": "느린다",
      "down": "늘힌다"
    },
    "correct": "up",
    "explanation": "늘리다는 크기·수·분량 따위를 본디보다 더 늘게 하다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-156",
    "topic": "혼동하기 쉬운 표기",
    "subject": "옷을 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "다린다",
      "left": "달인다",
      "right": "다리인다",
      "down": "달린다"
    },
    "correct": "up",
    "explanation": "다리다는 옷의 주름이나 구김을 펴려고 다리미로 문지르다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-157",
    "topic": "혼동하기 쉬운 표기",
    "subject": "약을 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "달인다",
      "left": "다린다",
      "right": "다닌다",
      "down": "달린다"
    },
    "correct": "up",
    "explanation": "달이다는 끓여서 진하게 하거나, 약재에 물을 부어 우러나도록 끓이다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-158",
    "topic": "혼동하기 쉬운 표기",
    "subject": "목이 붓고 아픈 ___를 앓았다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "목거리",
      "left": "목걸이",
      "right": "목그리",
      "down": "목꺼리"
    },
    "correct": "up",
    "explanation": "목이 붓고 아픈 병은 목거리, 목에 거는 장식품은 목걸이다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-159",
    "topic": "혼동하기 쉬운 표기",
    "subject": "나누는 일 / 다른 것으로 대신하는 일",
    "question": "각 뜻에 맞는 말은 차례로?",
    "answers": {
      "up": "가름–갈음",
      "left": "갈음–가름",
      "right": "가름–가름",
      "down": "갈음–갈음"
    },
    "correct": "up",
    "explanation": "가름은 나누거나 구분하는 일이다. 갈음은 다른 것으로 바꾸어 대신하는 일이다. 두 명사의 뜻을 구별해 고른다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-160",
    "topic": "혼동하기 쉬운 표기",
    "subject": "밭에 ___을 주었다. / ___이 빨라졌다.",
    "question": "빈칸에 차례로 들어갈 말은?",
    "answers": {
      "up": "거름–걸음",
      "left": "걸음–거름",
      "right": "거름–거름",
      "down": "걸음–걸음"
    },
    "correct": "up",
    "explanation": "거름은 걸다의 본뜻에서 멀어져 소리대로 적고, 걸음은 걷다의 걸-에 -음이 붙은 형태다.",
    "sourceNote": "우리말 바로 쓰기 · 20쪽"
  },
  {
    "id": "korean-grammar-161",
    "topic": "혼동하기 쉬운 표기",
    "subject": "편지를 ___. / 회의에 ___ 안건",
    "question": "빈칸에 차례로 들어갈 말은?",
    "answers": {
      "up": "부친다–부치는",
      "left": "붙인다–붙이는",
      "right": "부친다–붙이는",
      "down": "붙인다–부치는"
    },
    "correct": "up",
    "explanation": "편지를 보내다, 어떤 문제를 다른 곳에 넘기다는 모두 부치다이다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-162",
    "topic": "혼동하기 쉬운 표기",
    "subject": "빈대떡을 ___. / 논밭을 ___.",
    "question": "빈칸에 공통으로 들어갈 말은?",
    "answers": {
      "up": "부친다",
      "left": "붙인다",
      "right": "붙힌다",
      "down": "부칩다"
    },
    "correct": "up",
    "explanation": "기름에 음식을 익히다, 논밭을 이용하여 농사를 짓다는 모두 부치다이다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-163",
    "topic": "혼동하기 쉬운 표기",
    "subject": "힘이 ___ 일이다. (미치지 못함)",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "부치는",
      "left": "붙이는",
      "right": "붙치는",
      "down": "부티는"
    },
    "correct": "up",
    "explanation": "모자라거나 미치지 못하다는 뜻은 부치다이다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-164",
    "topic": "혼동하기 쉬운 표기",
    "subject": "흥정을 ___. / 조건을 ___.",
    "question": "빈칸에 공통으로 들어갈 말은?",
    "answers": {
      "up": "붙인다",
      "left": "부친다",
      "right": "붙힌다",
      "down": "부치인다"
    },
    "correct": "up",
    "explanation": "겨루는 일을 어울려 시작하게 하다, 조건·이유 따위를 달다는 모두 붙이다이다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-165",
    "topic": "혼동하기 쉬운 표기",
    "subject": "감시원을 ___. / 별명을 ___.",
    "question": "빈칸에 공통으로 들어갈 말은?",
    "answers": {
      "up": "붙인다",
      "left": "부친다",
      "right": "붙힌다",
      "down": "부치운다"
    },
    "correct": "up",
    "explanation": "사람을 딸려 붙게 하다, 이름을 만들어 주다는 모두 붙이다이다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-166",
    "topic": "혼동하기 쉬운 표기",
    "subject": "일을 ___. / 끓인 물을 ___.",
    "question": "빈칸에 차례로 들어갈 말은?",
    "answers": {
      "up": "시킨다–식힌다",
      "left": "식힌다–시킨다",
      "right": "시킨다–시킨다",
      "down": "식힌다–식힌다"
    },
    "correct": "up",
    "explanation": "시키다는 어떤 일을 하게 하다, 식히다는 식다의 사동사다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-167",
    "topic": "혼동하기 쉬운 표기",
    "subject": "이 나무의 둘레는 세 ___이나 된다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "아름",
      "left": "알음",
      "right": "앎",
      "down": "아룸"
    },
    "correct": "up",
    "explanation": "아름은 두 팔을 둥글게 모아 만든 둘레다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-168",
    "topic": "혼동하기 쉬운 표기",
    "subject": "우리는 예전부터 ___이 있는 사이다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "알음",
      "left": "아름",
      "right": "앎",
      "down": "알름"
    },
    "correct": "up",
    "explanation": "알음은 사람끼리 서로 아는 일이다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-169",
    "topic": "혼동하기 쉬운 표기",
    "subject": "___이 힘이다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "앎",
      "left": "알음",
      "right": "아름",
      "down": "암"
    },
    "correct": "up",
    "explanation": "앎은 배우거나 경험하여 모르던 것을 깨달음, 아는 일이다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-170",
    "topic": "혼동하기 쉬운 표기",
    "subject": "밥을 ___. / 윗자리에 ___.",
    "question": "빈칸에 차례로 들어갈 말은?",
    "answers": {
      "up": "안친다–앉힌다",
      "left": "앉힌다–안친다",
      "right": "안친다–안친다",
      "down": "앉힌다–앉힌다"
    },
    "correct": "up",
    "explanation": "안치다는 재료를 솥에 넣고 불 위에 올리다, 앉히다는 앉다의 사동사다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-171",
    "topic": "혼동하기 쉬운 표기",
    "subject": "두 물건의 ___에서 반응이 일어났다. (경계)",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "어름",
      "left": "얼음",
      "right": "얼름",
      "down": "어룸"
    },
    "correct": "up",
    "explanation": "어름은 두 사물의 끝이 맞닿은 자리, 얼음은 물이 얼어서 굳어진 물질이다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-172",
    "topic": "혼동하기 쉬운 표기",
    "subject": "___ 오너라. (조금 지난 뒤에)",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "이따가",
      "left": "있다가",
      "right": "잇따가",
      "down": "이다가"
    },
    "correct": "up",
    "explanation": "이따가는 조금 지난 뒤에라는 뜻의 부사다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-173",
    "topic": "혼동하기 쉬운 표기",
    "subject": "방에 잠깐 ___ 나왔다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "있다가",
      "left": "이따가",
      "right": "잇다가",
      "down": "있따가"
    },
    "correct": "up",
    "explanation": "있다가는 있다에 연결 어미 -다가가 붙은 말로, 어떤 곳에 머물다가 다음 행동을 했다는 뜻이다. 이따가는 조금 지난 뒤를 뜻하는 부사다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-174",
    "topic": "혼동하기 쉬운 표기",
    "subject": "오래 앉았더니 다리가 ___. (찌릿한 느낌)",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "저리다",
      "left": "절이다",
      "right": "절리다",
      "down": "저리우다"
    },
    "correct": "up",
    "explanation": "저리다는 뼈마디나 몸의 일부가 오래 눌려서 감각이 둔하고 아리다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-175",
    "topic": "혼동하기 쉬운 표기",
    "subject": "김장 배추를 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "절인다",
      "left": "저린다",
      "right": "절린다",
      "down": "저리인다"
    },
    "correct": "up",
    "explanation": "절이다는 절다의 사동사로, 소금이나 식초 따위에 절게 하다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-176",
    "topic": "혼동하기 쉬운 표기",
    "subject": "생선을 ___. / 마음을 ___.",
    "question": "빈칸에 차례로 들어갈 말은?",
    "answers": {
      "up": "조린다–졸인다",
      "left": "졸인다–조린다",
      "right": "조린다–조린다",
      "down": "졸인다–졸인다"
    },
    "correct": "up",
    "explanation": "조리다는 양념이 배게 바짝 끓이다, 졸이다는 속을 태우다시피 초조해하다는 뜻이다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-177",
    "topic": "혼동하기 쉬운 표기",
    "subject": "배고파서 며칠을 ___. / 비용을 ___.",
    "question": "빈칸에 차례로 들어갈 말은?",
    "answers": {
      "up": "주렸다–줄인다",
      "left": "줄였다–주린다",
      "right": "주렸다–주린다",
      "down": "줄였다–줄인다"
    },
    "correct": "up",
    "explanation": "주리다는 제대로 먹지 못하여 배를 곯다, 줄이다는 줄다의 사동사다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-178",
    "topic": "혼동하기 쉬운 표기",
    "subject": "열심히 ___ 했다. (자기 나름의 노력)",
    "question": "괄호의 뜻에 맞는 어미는?",
    "answers": {
      "up": "하노라고",
      "left": "하느라고",
      "right": "하너라고",
      "down": "하노라구"
    },
    "correct": "up",
    "explanation": "-노라고는 자기 나름대로 꽤 노력했다는 뜻을 나타낸다. -느라고는 앞의 행동 때문에 뒤의 결과가 생겼다는 뜻이다. 문장의 모양만으로 구별하지 않도록 이 문항에는 의미 조건을 제시했다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-179",
    "topic": "혼동하기 쉬운 표기",
    "subject": "공부___ 밤을 새웠다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "하느라고",
      "left": "하노라고",
      "right": "하느라구",
      "down": "하너라고"
    },
    "correct": "up",
    "explanation": "-느라고는 앞의 내용이 뒤 내용의 목적이나 원인이 됨을 나타낸다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-180",
    "topic": "혼동하기 쉬운 표기",
    "subject": "멀리 ___ 집에서 기다려라. (찾아오다)",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "찾아오느니보다",
      "left": "찾아오는 이보다",
      "right": "찾아오느니 보다",
      "down": "찾아오는이보다"
    },
    "correct": "up",
    "explanation": "-느니보다는 -는 것보다의 뜻인 어미이므로 붙여 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-181",
    "topic": "혼동하기 쉬운 표기",
    "subject": "오는 이가 ___ 많다. (가다)",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "가는 이보다",
      "left": "가느니보다",
      "right": "가는이보다",
      "down": "가느니 보다"
    },
    "correct": "up",
    "explanation": "-는 사람보다의 뜻이면 의존 명사 이에 조사 보다가 붙은 것이므로 가는 이보다로 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-182",
    "topic": "혼동하기 쉬운 표기",
    "subject": "나를 ___ 잘못한 일이 없다. (미워하다)",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "미워하리만큼",
      "left": "미워하리 만큼",
      "right": "미워하리만 큼",
      "down": "미워하이만큼"
    },
    "correct": "up",
    "explanation": "-(으)리만큼은 -(으)ㄹ 정도로의 뜻인 어미이므로 붙여 쓴다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-183",
    "topic": "혼동하기 쉬운 표기",
    "subject": "공부___ 간다. / 지방으로 ___ 한다.",
    "question": "빈칸에 차례로 들어갈 말은?",
    "answers": {
      "up": "하러–가려",
      "left": "하려–가러",
      "right": "하러–가러",
      "down": "하려–가려"
    },
    "correct": "up",
    "explanation": "-(으)러는 가거나 오는 동작의 목적, -(으)려는 어떤 행동을 할 의도나 욕망을 나타낸다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-184",
    "topic": "혼동하기 쉬운 표기",
    "subject": "사람___ 그럴 수는 없다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "으로서",
      "left": "으로써",
      "right": "으로서써",
      "down": "으로세"
    },
    "correct": "up",
    "explanation": "(으)로서는 지위·신분·자격을 나타낸다.",
    "sourceNote": "우리말 바로 쓰기 · 29쪽"
  },
  {
    "id": "korean-grammar-185",
    "topic": "혼동하기 쉬운 표기",
    "subject": "닭___ 꿩을 대신했다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "으로써",
      "left": "으로서",
      "right": "으로써서",
      "down": "으로서써"
    },
    "correct": "up",
    "explanation": "(으)로써는 재료·수단·도구를 나타낸다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-186",
    "topic": "혼동하기 쉬운 표기",
    "subject": "그가 나를 ___ 나도 그를 믿는다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "믿으므로",
      "left": "믿음으로",
      "right": "믿음으로써",
      "down": "믿으므로써"
    },
    "correct": "up",
    "explanation": "-(으)므로는 까닭을 나타내는 어미로, 써가 결합하지 않는다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-187",
    "topic": "혼동하기 쉬운 표기",
    "subject": "서로를 ___ 어려움을 이겨 냈다. (수단)",
    "question": "수단을 나타내는 표현은?",
    "answers": {
      "up": "믿음으로써",
      "left": "믿으므로",
      "right": "믿으므로써",
      "down": "믿음므로"
    },
    "correct": "up",
    "explanation": "믿음으로써는 명사 믿음에 수단을 나타내는 조사 으로써가 붙은 표현이다. 믿으므로는 동사 믿다에 이유를 나타내는 어미 -으므로가 붙은 표현이다. 이 문항은 수단이라는 의미 조건을 명시했으므로 믿음으로써를 고른다.",
    "sourceNote": "우리말 바로 쓰기 · 21쪽"
  },
  {
    "id": "korean-grammar-188",
    "topic": "혼동하기 쉬운 표기",
    "subject": "이번 회의의 안건은 비밀에 ___로 했다.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "부치기",
      "left": "붙이기",
      "right": "붙히기",
      "down": "부티기"
    },
    "correct": "up",
    "explanation": "어떤 일을 거론하거나 문제 삼지 않는 상태에 있게 하다는 뜻은 부치다이다.",
    "sourceNote": "우리말 바로 쓰기 · 29쪽"
  },
  {
    "id": "korean-grammar-189",
    "topic": "혼동하기 쉬운 표기",
    "subject": "게시판에 홍보 전단지를 ___.",
    "question": "빈칸의 바른 표기는?",
    "answers": {
      "up": "붙였다",
      "left": "부쳤다",
      "right": "붙혔다",
      "down": "부첬다"
    },
    "correct": "up",
    "explanation": "맞닿아 떨어지지 않게 하다는 뜻은 붙이다이다.",
    "sourceNote": "우리말 바로 쓰기 · 29쪽"
  }
];
export const koreanGrammarWritten: WrittenQuestion[] = [
  {
    "id": "korean-grammar-written-001",
    "topic": "띄어쓰기",
    "question": "㉠ ‘이번에는 보다 높게 뛰어 보자.’ ㉡ ‘나는 시보다 소설이 좋다.’에서 제시된 ‘보다’의 띄어쓰기가 다른 까닭을 의미와 품사를 들어 쓰시오.",
    "modelAnswer": "㉠의 ‘보다’는 ‘어떤 수준에 비하여 한층 더’라는 뜻의 부사이므로 앞말과 띄어 쓴다. ㉡의 ‘보다’는 비교의 대상을 나타내는 조사이므로 앞말 ‘시’에 붙여 쓴다.",
    "criteria": [
      "㉠ 부사, 한층 더의 뜻",
      "㉡ 조사, 비교 대상",
      "부사는 띄우고 조사는 붙인다는 규정"
    ],
    "sourceNote": "우리말 바로 쓰기 · 27쪽"
  },
  {
    "id": "korean-grammar-written-002",
    "topic": "형태에 관한 것",
    "question": "영희: “축하해 주세요. 우리 집 토끼가 ㉠나아써요.” 철수: “많이 ㉡나아쓰면 저 한 마리 주세요.” 영희: “그게 아니라 병이 다 나은 거예요.” ㉠, ㉡을 말한 사람이 뜻한 대로 맞춤법에 맞게 고치고, 오해가 생긴 까닭을 쓰시오.",
    "modelAnswer": "㉠ 나았어요(병이 낫다), ㉡ 낳았으면(새끼를 낳다). 소리 나는 대로 ‘나아써요’라고 적어 ‘나았어요’와 ‘낳았어요’가 구별되지 않아 오해가 생겼다. 어간(낫-, 낳-)과 어미를 구별해 원형을 밝혀 적어야 뜻이 분명해진다.",
    "criteria": [
      "㉠ 나았어요",
      "㉡ 낳았으면",
      "소리대로 적어 어간이 구별되지 않음"
    ],
    "sourceNote": "우리말 바로 쓰기 · 28쪽"
  },
  {
    "id": "korean-grammar-written-003",
    "topic": "소리에 관한 것",
    "question": "‘구지 어려운 생각을 하지 말고, 조금만 더 힘내십시요.’에서 맞춤법이 틀린 부분 두 곳을 찾아 고치고, 고친 까닭을 쓰시오.",
    "modelAnswer": "‘구지’는 ‘굳이’로 고친다. 어간 ‘굳-’에 ‘-이’가 붙어 [구지]로 소리 나도 원형을 밝혀 ㄷ으로 적는다(구개음화, 제6항). ‘힘내십시요’는 ‘힘내십시오’로 고친다. 종결 어미 ‘-오’는 생략할 수 없는 어미의 일부이다.",
    "criteria": [
      "구지 → 굳이, 구개음화·원형 밝힘",
      "힘내십시요 → 힘내십시오",
      "종결 어미는 -오로 적음"
    ],
    "sourceNote": "우리말 바로 쓰기 · 29쪽"
  },
  {
    "id": "korean-grammar-written-004",
    "topic": "맞춤법의 원리",
    "question": "<보기> 많이, 이슬, 이파리, 오뚝이, 노름(도박), 오빠 — 이 단어들을 한글 맞춤법의 두 표기 원칙인 ㉠ 소리대로 적기, ㉡ 어법에 맞도록 적기로 나누시오.",
    "modelAnswer": "㉠ 소리대로 적기: 이슬, 이파리, 노름(도박), 오빠. ㉡ 어법에 맞도록 적기: 많이, 오뚝이. 이파리는 잎에 -이 외의 모음 접미사 -아리가 붙었고, 노름은 놀다의 본뜻에서 멀어져 원형을 밝히지 않는다.",
    "criteria": [
      "㉠ 이슬·이파리·노름·오빠",
      "㉡ 많이·오뚝이",
      "이파리·노름이 원형을 밝히지 않는 까닭"
    ],
    "sourceNote": "우리말 바로 쓰기 · 24쪽"
  }
];
