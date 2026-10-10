import { parkDepthCards } from './biology-depth';
import { joDepthCards } from './biology-jo-depth';
import type { SwipeCard } from './swipe-cards';

// 첨부 필기·정리본·유전학 용어집·유전자의 발현 수업자료를 바탕으로 작성.
export const parkCards: SwipeCard[] = [
  {
    "id": "biology-park-001",
    "topic": "유전의 기본 원리",
    "subject": "박상영T",
    "question": "상동염색체의 같은 유전자 좌위에 있는 서로 다른 형태의 유전자는?",
    "answers": {
      "up": "대립유전자",
      "left": "리보솜",
      "right": "히스톤",
      "down": "뉴클레오솜"
    },
    "correct": "up",
    "explanation": "대립유전자는 같은 좌위에서 특정 형질에 관여하며 두 상동염색체의 대립유전자는 같거나 다를 수 있다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-002",
    "topic": "유전의 기본 원리",
    "subject": "박상영T",
    "question": "Aa와 같은 기호로 나타내는 것은?",
    "answers": {
      "up": "유전자형",
      "left": "표현형",
      "right": "대립형질",
      "down": "염색체 수"
    },
    "correct": "up",
    "explanation": "유전자형은 대립유전자의 조합이며 표현형은 관찰되는 특성이다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-003",
    "topic": "유전의 기본 원리",
    "subject": "박상영T",
    "question": "완전 우성에서 Aa가 우성 표현형인 이유는?",
    "answers": {
      "up": "이형접합에서 우성이 표현되기 때문",
      "left": "열성 유전자가 소실되기 때문",
      "right": "A만 복제되기 때문",
      "down": "a가 자손에게 전달되지 않기 때문"
    },
    "correct": "up",
    "explanation": "열성 대립유전자는 없어지지 않고 생식세포로 전달될 수 있다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-004",
    "topic": "유전의 기본 원리",
    "subject": "박상영T",
    "question": "각 대립유전자가 같은 확률로 전달될 때 Aa × Aa 자손의 기대 유전자형 비율은?",
    "answers": {
      "up": "AA:Aa:aa = 1:2:1",
      "left": "AA:Aa:aa = 3:0:1",
      "right": "AA:Aa:aa = 1:1:1",
      "down": "AA:Aa:aa = 2:1:1"
    },
    "correct": "up",
    "explanation": "각 부모가 A와 a를 같은 확률로 전달하고 무작위로 수정된다고 가정하면 AA 1/4, Aa 1/2, aa 1/4이다. 이는 기대 확률이며, 적은 수의 실제 자손이 반드시 같은 비율로 나오는 것은 아니다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-005",
    "topic": "유전의 기본 원리",
    "subject": "박상영T",
    "question": "완전 우성에서 Aa × aa의 우성 표현형 확률은?",
    "answers": {
      "up": "1/2",
      "left": "1/4",
      "right": "3/4",
      "down": "1"
    },
    "correct": "up",
    "explanation": "Aa는 A와 a를 반씩, aa는 a만 전달하므로 Aa와 aa가 1:1이다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-006",
    "topic": "유전의 기본 원리",
    "subject": "박상영T",
    "question": "분리의 법칙의 세포학적 근거는?",
    "answers": {
      "up": "감수 1분열에서 상동염색체 분리",
      "left": "체세포의 세포질 분열만",
      "right": "수정 시 DNA 분해",
      "down": "감수 1분열에서 자매염색분체 분리"
    },
    "correct": "up",
    "explanation": "상동염색체에 놓인 대립유전자가 감수 1분열에서 서로 분리된다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-007",
    "topic": "유전의 기본 원리",
    "subject": "박상영T",
    "question": "유전자 A/a와 B/b가 서로 다른 염색체에 있을 때 AaBb의 생식세포 종류는?",
    "answers": {
      "up": "AB, Ab, aB, ab",
      "left": "AA, aa, BB, bb",
      "right": "AB, ab만",
      "down": "Aa, Bb만"
    },
    "correct": "up",
    "explanation": "두 염색체 쌍이 독립적으로 분리되어 네 종류가 각각 1/4이다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-008",
    "topic": "유전의 기본 원리",
    "subject": "박상영T",
    "question": "완전 우성·독립 유전인 AaBb × AaBb의 aabb 확률은?",
    "answers": {
      "up": "1/16",
      "left": "1/4",
      "right": "3/16",
      "down": "9/16"
    },
    "correct": "up",
    "explanation": "aa 확률 1/4와 bb 확률 1/4를 곱하면 1/16이다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-009",
    "topic": "유전의 기본 원리",
    "subject": "박상영T",
    "question": "완전 우성·독립 유전인 AaBb × aabb의 표현형 비율은?",
    "answers": {
      "up": "1:1:1:1",
      "left": "9:3:3:1",
      "right": "3:1",
      "down": "1:2:1"
    },
    "correct": "up",
    "explanation": "검정교배에서는 AaBb가 만드는 네 생식세포가 자손의 표현형에 반영된다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-010",
    "topic": "유전의 기본 원리",
    "subject": "박상영T",
    "question": "연관된 두 유전자에 대해 옳은 것은?",
    "answers": {
      "up": "같은 염색체에 있어 함께 전달되기 쉬움",
      "left": "반드시 독립의 법칙을 따름",
      "right": "항상 다른 염색체에 존재",
      "down": "교차가 절대 일어나지 않음"
    },
    "correct": "up",
    "explanation": "같은 염색체의 유전자는 연관되지만 교차로 재조합될 수 있다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-011",
    "topic": "유전의 기본 원리",
    "subject": "박상영T",
    "question": "자매염색분체와 상동염색체를 옳게 구별한 것은?",
    "answers": {
      "up": "자매는 복제 산물, 상동은 부계·모계 한 쌍",
      "left": "둘 다 부계·모계 한 쌍",
      "right": "상동은 한 염색체의 복제 산물",
      "down": "자매는 항상 서로 다른 좌위를 가짐"
    },
    "correct": "up",
    "explanation": "자매염색분체는 DNA 복제 후 연결된 두 가닥이며 상동염색체는 같은 유전자 좌위를 갖는 부계·모계 염색체다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-012",
    "topic": "유전의 기본 원리",
    "subject": "박상영T",
    "question": "DNA 복제 직후 체세포의 변화로 옳은 것은?",
    "answers": {
      "up": "DNA 양은 2배, 염색체 수는 동일",
      "left": "염색체 수만 2배",
      "right": "DNA 양과 염색체 수 모두 절반",
      "down": "염색체 수는 4배"
    },
    "correct": "up",
    "explanation": "염색체 수는 동원체를 기준으로 세므로 복제 직후에도 동일하고 DNA 양만 2배이다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-013",
    "topic": "사람의 유전",
    "subject": "박상영T",
    "question": "사람의 유전 연구가 완두보다 어려운 주된 이유는?",
    "answers": {
      "up": "세대가 길고 자손 수가 적음",
      "left": "사람은 DNA가 없음",
      "right": "사람은 감수분열을 하지 않음",
      "down": "모든 형질이 단일 유전자 유전"
    },
    "correct": "up",
    "explanation": "의도적인 교배가 어렵고 세대 기간이 길며 자손 수가 적어서 통계적 분석이 어렵다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-014",
    "topic": "사람의 유전",
    "subject": "박상영T",
    "question": "일란성 쌍둥이의 형질 일치율이 이란성보다 높을 때 시사하는 것은?",
    "answers": {
      "up": "유전적 요인이 관여할 가능성",
      "left": "환경의 영향이 전혀 없음",
      "right": "유전자 하나만 관여",
      "down": "반드시 우성 형질"
    },
    "correct": "up",
    "explanation": "일란성은 유전적 구성이 매우 유사하므로 일치율 차이는 유전적 영향의 근거지만 환경도 고려해야 한다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-015",
    "topic": "사람의 유전",
    "subject": "박상영T",
    "question": "정상 부모 둘 사이에서 열성 유전병 자녀 aa가 태어났다. 부모 유전자형은?",
    "answers": {
      "up": "Aa와 Aa",
      "left": "AA와 AA",
      "right": "AA와 aa",
      "down": "aa와 aa"
    },
    "correct": "up",
    "explanation": "부모 모두 정상이지만 자녀에게 각각 a를 전달했으므로 둘 다 보인자 Aa이다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-016",
    "topic": "사람의 유전",
    "subject": "박상영T",
    "question": "상염색체 열성 유전병에서 Aa × Aa의 정상 자녀가 보인자일 조건부 확률은?",
    "answers": {
      "up": "2/3",
      "left": "1/2",
      "right": "1/4",
      "down": "3/4"
    },
    "correct": "up",
    "explanation": "정상 자녀 AA:Aa는 1:2이므로 보인자 확률은 2/3이다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-017",
    "topic": "사람의 유전",
    "subject": "박상영T",
    "question": "X 연관 열성에서 보인자 어머니와 정상 아버지의 아들 중 발병 확률은?",
    "answers": {
      "up": "1/2",
      "left": "1/4",
      "right": "0",
      "down": "1"
    },
    "correct": "up",
    "explanation": "아들은 아버지의 Y와 어머니의 X를 받으며 어머니가 열성 X를 줄 확률은 1/2이다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-018",
    "topic": "사람의 유전",
    "subject": "박상영T",
    "question": "X 연관 열성에서 발병 아버지와 정상 비보인자 어머니의 딸은?",
    "answers": {
      "up": "모두 정상 보인자",
      "left": "모두 발병",
      "right": "절반 발병",
      "down": "모두 비보인자"
    },
    "correct": "up",
    "explanation": "딸은 아버지의 열성 X와 어머니의 정상 X를 받아 모두 보인자가 된다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-019",
    "topic": "사람의 유전",
    "subject": "박상영T",
    "question": "Y 연관 형질의 전형적인 전달 경로는?",
    "answers": {
      "up": "아버지에서 아들",
      "left": "아버지에서 딸",
      "right": "어머니에서 아들",
      "down": "어머니에서 딸"
    },
    "correct": "up",
    "explanation": "Y 염색체는 아버지에게서 아들로 전달된다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-020",
    "topic": "사람의 유전",
    "subject": "박상영T",
    "question": "ABO 혈액형이 복대립유전인 이유는?",
    "answers": {
      "up": "집단에 Iᴬ, Iᴮ, i 세 대립유전자가 존재",
      "left": "한 사람이 세 대립유전자를 모두 가짐",
      "right": "세 유전자 좌위가 관여",
      "down": "A형과 B형은 항상 열성"
    },
    "correct": "up",
    "explanation": "복대립유전은 집단에 세 종류 이상 대립유전자가 있는 것으로 개인은 한 좌위에 두 개를 갖는다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-021",
    "topic": "사람의 유전",
    "subject": "박상영T",
    "question": "Iᴬ와 Iᴮ의 관계는?",
    "answers": {
      "up": "공동 우성",
      "left": "Iᴬ가 완전 우성",
      "right": "Iᴮ가 완전 우성",
      "down": "둘 다 i에 대해 열성"
    },
    "correct": "up",
    "explanation": "AB형에서는 A와 B 항원이 모두 발현된다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-022",
    "topic": "사람의 유전",
    "subject": "박상영T",
    "question": "Iᴬi × Iᴮi에서 O형 자녀 확률은?",
    "answers": {
      "up": "1/4",
      "left": "0",
      "right": "1/2",
      "down": "3/4"
    },
    "correct": "up",
    "explanation": "가능한 유전자형은 IᴬIᴮ, Iᴬi, Iᴮi, ii가 각각 1/4이다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-023",
    "topic": "사람의 유전",
    "subject": "박상영T",
    "question": "IᴬIᴮ × ii에서 가능한 자녀 혈액형은?",
    "answers": {
      "up": "A형과 B형",
      "left": "AB형과 O형",
      "right": "A형과 O형",
      "down": "모든 혈액형"
    },
    "correct": "up",
    "explanation": "AB형 부모는 Iᴬ 또는 Iᴮ를, O형 부모는 i를 전달한다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-024",
    "topic": "사람의 유전",
    "subject": "박상영T",
    "question": "ABO 항원 형성에 필요한 H 물질이 없는 hh 개체의 겉보기 혈액형은?",
    "answers": {
      "up": "O형",
      "left": "항상 AB형",
      "right": "항상 A형",
      "down": "항상 B형"
    },
    "correct": "up",
    "explanation": "봄베이 표현형은 H 물질 결핍으로 A/B 항원이 만들어지지 않아 겉보기 O형이 된다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-025",
    "topic": "사람의 유전",
    "subject": "박상영T",
    "question": "다유전자유전의 대표적인 특징은?",
    "answers": {
      "up": "여러 유전자와 환경이 연속 변이에 기여",
      "left": "집단에 세 대립유전자만 존재",
      "right": "하나의 유전자만 관여",
      "down": "반드시 3:1로 분리"
    },
    "correct": "up",
    "explanation": "키·피부색 등의 형질에는 여러 유전자와 환경 요인이 관여한다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-026",
    "topic": "사람의 유전병",
    "subject": "박상영T",
    "question": "감수 1분열에서 한 염색체 쌍이 비분리되고 나머지는 정상일 때 생식세포는?",
    "answers": {
      "up": "n+1 두 개, n−1 두 개",
      "left": "n 두 개, n+1 한 개, n−1 한 개",
      "right": "모두 n",
      "down": "모두 n+1"
    },
    "correct": "up",
    "explanation": "상동염색체가 분리되지 않아 감수 1분열 산물에 염색체 하나가 과다 또는 결핍되고 네 생식세포 모두 비정상이다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-027",
    "topic": "사람의 유전병",
    "subject": "박상영T",
    "question": "감수 2분열의 한 세포에서만 비분리될 때 생식세포는?",
    "answers": {
      "up": "n 두 개, n+1 한 개, n−1 한 개",
      "left": "n+1 두 개, n−1 두 개",
      "right": "모두 n",
      "down": "n−1 네 개"
    },
    "correct": "up",
    "explanation": "감수 1분열은 정상이므로 비분리가 없는 나머지 세포에서 생긴 두 생식세포는 정상(n)이다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-028",
    "topic": "사람의 유전병",
    "subject": "박상영T",
    "question": "다운 증후군의 대표적인 염색체 수 이상은?",
    "answers": {
      "up": "21번 삼염색체",
      "left": "18번 삼염색체",
      "right": "성염색체 XO",
      "down": "성염색체 XXY"
    },
    "correct": "up",
    "explanation": "전형적인 다운 증후군은 21번 염색체가 세 개 존재하는 삼염색체성이다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-029",
    "topic": "사람의 유전병",
    "subject": "박상영T",
    "question": "클라인펠터 증후군의 대표적인 핵형은?",
    "answers": {
      "up": "47, XXY",
      "left": "45, X",
      "right": "47, XYY만",
      "down": "46, XX"
    },
    "correct": "up",
    "explanation": "성염색체 수 이상으로 XXY 핵형을 보이는 것이 대표적이다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-030",
    "topic": "사람의 유전병",
    "subject": "박상영T",
    "question": "터너 증후군의 대표적인 핵형은?",
    "answers": {
      "up": "45, X",
      "left": "47, XXY",
      "right": "47, XXX",
      "down": "46, XY"
    },
    "correct": "up",
    "explanation": "터너 증후군의 대표적인 핵형은 X 염색체 하나만 있는 45, X이다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-031",
    "topic": "사람의 유전병",
    "subject": "박상영T",
    "question": "염색체 일부가 끊어져 사라진 구조 이상은?",
    "answers": {
      "up": "결실",
      "left": "중복",
      "right": "역위",
      "down": "전좌"
    },
    "correct": "up",
    "explanation": "결실은 구간 소실, 중복은 구간 반복, 역위는 방향 반전, 전좌는 다른 염색체로 이동이다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-032",
    "topic": "사람의 유전병",
    "subject": "박상영T",
    "question": "염색체 ABCDEFG가 ABEDCFG로 바뀌었다. 구조 이상은?",
    "answers": {
      "up": "역위",
      "left": "결실",
      "right": "중복",
      "down": "전좌"
    },
    "correct": "up",
    "explanation": "CDE 구간의 순서가 EDC로 뒤집혔으므로 역위이다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-033",
    "topic": "사람의 유전병",
    "subject": "박상영T",
    "question": "단백질 암호화 구간에서 1개 염기 삽입의 대표적인 결과는?",
    "answers": {
      "up": "삽입 뒤 읽는 틀이 바뀔 수 있음",
      "left": "항상 아미노산 하나만 추가",
      "right": "반드시 아무 영향 없음",
      "down": "염색체 수가 증가"
    },
    "correct": "up",
    "explanation": "3의 배수가 아닌 염기 삽입·결실은 프레임시프트를 일으킬 수 있다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-034",
    "topic": "사람의 유전병",
    "subject": "박상영T",
    "question": "염기 치환으로 아미노산이 바뀌지 않는 변이는?",
    "answers": {
      "up": "동의적 변이",
      "left": "넌센스 변이",
      "right": "프레임시프트",
      "down": "염색체 비분리"
    },
    "correct": "up",
    "explanation": "여러 코돈이 같은 아미노산을 지정할 수 있어 치환 후에도 같은 아미노산이 들어갈 수 있다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-035",
    "topic": "사람의 유전병",
    "subject": "박상영T",
    "question": "아미노산 코돈이 종결 코돈으로 바뀐 변이는?",
    "answers": {
      "up": "넌센스 변이",
      "left": "동의적 변이",
      "right": "역위",
      "down": "중복"
    },
    "correct": "up",
    "explanation": "번역이 조기에 끝나 짧은 단백질이 만들어질 수 있다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-036",
    "topic": "사람의 유전병",
    "subject": "박상영T",
    "question": "자손에게 직접 전달될 수 있는 변이는?",
    "answers": {
      "up": "생식세포의 변이",
      "left": "피부 체세포의 변이만",
      "right": "성숙 적혈구의 염색체 변이",
      "down": "모든 체세포 변이"
    },
    "correct": "up",
    "explanation": "생식세포의 DNA 변이는 수정란에 전달될 수 있으며 일반적인 체세포 변이는 자손에게 직접 전달되지 않는다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-037",
    "topic": "유전체와 유전 물질",
    "subject": "박상영T",
    "question": "뉴클레오타이드를 이루는 세 성분은?",
    "answers": {
      "up": "인산·당·염기",
      "left": "아미노산·당·염기",
      "right": "인산·지방·단백질",
      "down": "당·히스톤·염기"
    },
    "correct": "up",
    "explanation": "DNA와 RNA의 단위체인 뉴클레오타이드는 인산, 오탄당, 질소 염기로 구성된다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-038",
    "topic": "유전체와 유전 물질",
    "subject": "박상영T",
    "question": "뉴클레오솜의 구조는?",
    "answers": {
      "up": "히스톤 주위를 DNA가 감쌈",
      "left": "DNA 주위를 리보솜이 감쌈",
      "right": "RNA 주위를 인산이 감쌈",
      "down": "염색체 두 개가 결합"
    },
    "correct": "up",
    "explanation": "뉴클레오솜은 DNA 포장의 기본 단위이며 히스톤 단백질과 DNA로 이루어진다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-039",
    "topic": "유전체와 유전 물질",
    "subject": "박상영T",
    "question": "그리피스 실험에서 쥐가 죽는 조합은?",
    "answers": {
      "up": "열처리 S형 + 살아 있는 R형",
      "left": "열처리 S형만",
      "right": "살아 있는 R형만",
      "down": "열처리 R형만"
    },
    "correct": "up",
    "explanation": "죽은 S형의 물질이 살아 있는 R형을 S형으로 형질전환시킬 수 있었다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-040",
    "topic": "유전체와 유전 물질",
    "subject": "박상영T",
    "question": "에이버리 실험에서 형질전환을 막은 효소는?",
    "answers": {
      "up": "DNase",
      "left": "RNase",
      "right": "단백질 분해효소",
      "down": "아밀레이스"
    },
    "correct": "up",
    "explanation": "DNA를 분해했을 때 형질전환이 사라져 DNA가 형질전환 물질임을 뒷받침했다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-041",
    "topic": "유전체와 유전 물질",
    "subject": "박상영T",
    "question": "허시·체이스 실험에서 DNA와 단백질 표지의 올바른 조합은?",
    "answers": {
      "up": "DNA ³²P, 단백질 ³⁵S",
      "left": "DNA ³⁵S, 단백질 ³²P",
      "right": "둘 다 ³⁵S",
      "down": "둘 다 ³²P"
    },
    "correct": "up",
    "explanation": "DNA는 인을 포함하고 황은 없으며 파지 단백질의 일부 아미노산은 황을 포함한다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-042",
    "topic": "유전체와 유전 물질",
    "subject": "박상영T",
    "question": "파지 감염 후 혼합·원심분리한 허시·체이스 실험에서 ³²P의 주된 위치는?",
    "answers": {
      "up": "세균 침전물",
      "left": "파지 껍질 상층액만",
      "right": "공기 중",
      "down": "세균 밖 단백질만"
    },
    "correct": "up",
    "explanation": "DNA 표지인 ³²P가 세균이 든 침전물에 주로 검출되어 DNA 유입을 지지했다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-043",
    "topic": "유전체와 유전 물질",
    "subject": "박상영T",
    "question": "이중 가닥 DNA에서 A=20%이면 G는?",
    "answers": {
      "up": "30%",
      "left": "20%",
      "right": "40%",
      "down": "60%"
    },
    "correct": "up",
    "explanation": "A=T=20%이므로 G+C=60%, G=C=30%이다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-044",
    "topic": "유전체와 유전 물질",
    "subject": "박상영T",
    "question": "A–T와 G–C의 수소 결합 수는?",
    "answers": {
      "up": "2개와 3개",
      "left": "3개와 2개",
      "right": "둘 다 2개",
      "down": "둘 다 3개"
    },
    "correct": "up",
    "explanation": "상보적 염기쌍 A–T는 2개, G–C는 3개의 수소 결합을 형성한다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-045",
    "topic": "유전체와 유전 물질",
    "subject": "박상영T",
    "question": "DNA 한 가닥이 5′-ATGC-3′일 때 마주 보는 가닥은?",
    "answers": {
      "up": "3′-TACG-5′",
      "left": "3′-ATGC-5′",
      "right": "5′-TACG-3′",
      "down": "3′-UACG-5′"
    },
    "correct": "up",
    "explanation": "DNA 두 가닥은 역평행이며 A–T, G–C로 상보 결합한다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-046",
    "topic": "유전체와 유전 물질",
    "subject": "박상영T",
    "question": "유전체와 유전자를 옳게 구별한 것은?",
    "answers": {
      "up": "유전체에는 비암호화 DNA도 포함",
      "left": "유전체는 단백질만의 총합",
      "right": "유전자는 항상 단백질만 암호화",
      "down": "유전체는 mRNA만 포함"
    },
    "correct": "up",
    "explanation": "유전체는 전체 유전 정보를 뜻하며 유전자는 기능성 RNA 또는 단백질 산물에 필요한 정보를 가진다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-047",
    "topic": "유전체와 유전 물질",
    "subject": "박상영T",
    "question": "세균의 전형적인 유전체 특징은?",
    "answers": {
      "up": "핵막 없이 원형 DNA를 가짐",
      "left": "핵 안에 선형 염색체만 가짐",
      "right": "DNA가 전혀 없음",
      "down": "모든 유전자에 인트론 존재"
    },
    "correct": "up",
    "explanation": "세균은 전형적으로 핵막이 없고 주 염색체가 원형이며 진핵생물은 핵에 여러 선형 염색체가 있다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  ...parkDepthCards,
];

export const joCards: SwipeCard[] = [
  {
    "id": "biology-jo-001",
    "topic": "중심원리와 RNA",
    "subject": "조용민T",
    "question": "일반적인 중심원리의 정보 흐름은?",
    "answers": {
      "up": "DNA → RNA → 단백질",
      "left": "단백질 → RNA → DNA",
      "right": "RNA → 단백질 → DNA",
      "down": "DNA → 단백질 → RNA"
    },
    "correct": "up",
    "explanation": "DNA에서 RNA로 전사되고 mRNA 정보에 따라 단백질이 번역된다.",
    "sourceNote": "유전자의 발현 수업자료 · 3쪽"
  },
  {
    "id": "biology-jo-002",
    "topic": "중심원리와 RNA",
    "subject": "조용민T",
    "question": "역전사가 뜻하는 것은?",
    "answers": {
      "up": "RNA를 주형으로 DNA 합성",
      "left": "단백질을 주형으로 RNA 합성",
      "right": "DNA에서 단백질 직접 합성",
      "down": "RNA를 주형으로 단백질 복제"
    },
    "correct": "up",
    "explanation": "역전사는 RNA 정보를 DNA로 옮기는 과정이다.",
    "sourceNote": "유전자의 발현 수업자료 · 3쪽"
  },
  {
    "id": "biology-jo-003",
    "topic": "중심원리와 RNA",
    "subject": "조용민T",
    "question": "mRNA의 주된 역할은?",
    "answers": {
      "up": "단백질 합성의 주형",
      "left": "아미노산 운반",
      "right": "스플라이시오솜 촉매만",
      "down": "DNA 포장"
    },
    "correct": "up",
    "explanation": "mRNA의 코돈 배열이 번역되는 아미노산 순서를 결정한다.",
    "sourceNote": "유전자의 발현 수업자료 · 4쪽"
  },
  {
    "id": "biology-jo-004",
    "topic": "중심원리와 RNA",
    "subject": "조용민T",
    "question": "tRNA의 주된 역할은?",
    "answers": {
      "up": "코돈에 맞는 아미노산 운반",
      "left": "DNA 복제",
      "right": "리보솜 소단위체 조립",
      "down": "인트론만 분해"
    },
    "correct": "up",
    "explanation": "tRNA는 안티코돈으로 코돈을 인식하고 아미노산을 리보솜에 전달한다.",
    "sourceNote": "유전자의 발현 수업자료 · 4쪽"
  },
  {
    "id": "biology-jo-005",
    "topic": "중심원리와 RNA",
    "subject": "조용민T",
    "question": "snRNA가 관여하는 과정은?",
    "answers": {
      "up": "스플라이싱",
      "left": "DNA 메틸화만",
      "right": "펩타이드 운반",
      "down": "DNA 비분리"
    },
    "correct": "up",
    "explanation": "snRNA는 단백질과 snRNP를 이루어 pre-mRNA 스플라이싱에 관여한다.",
    "sourceNote": "유전자의 발현 수업자료 · 4쪽"
  },
  {
    "id": "biology-jo-006",
    "topic": "중심원리와 RNA",
    "subject": "조용민T",
    "question": "snoRNA의 대표적인 기능은?",
    "answers": {
      "up": "pre-rRNA 가공",
      "left": "DNA에서 mRNA 전사",
      "right": "아미노산 운반",
      "down": "종결 코돈 인식"
    },
    "correct": "up",
    "explanation": "작은 핵인 RNA는 핵인에서 rRNA 가공에 관여한다.",
    "sourceNote": "유전자의 발현 수업자료 · 4쪽"
  },
  {
    "id": "biology-jo-007",
    "topic": "중심원리와 RNA",
    "subject": "조용민T",
    "question": "miRNA의 대표적인 작용은?",
    "answers": {
      "up": "표적 mRNA의 발현 억제",
      "left": "염색체 수 증가",
      "right": "아미노산 직접 합성",
      "down": "DNA 인산 골격 절단만"
    },
    "correct": "up",
    "explanation": "miRNA는 표적 mRNA에 작용해 번역 억제나 분해를 통한 발현 조절에 관여한다.",
    "sourceNote": "유전자의 발현 수업자료 · 4쪽"
  },
  {
    "id": "biology-jo-008",
    "topic": "전사",
    "subject": "조용민T",
    "question": "RNA 중합효소의 합성 방향은?",
    "answers": {
      "up": "5′ → 3′",
      "left": "3′ → 5′",
      "right": "양쪽 방향 무작위",
      "down": "N말단 → C말단"
    },
    "correct": "up",
    "explanation": "RNA는 3′ 말단에 뉴클레오타이드가 추가되므로 5′에서 3′으로 합성된다.",
    "sourceNote": "유전자의 발현 수업자료 · 9쪽"
  },
  {
    "id": "biology-jo-009",
    "topic": "전사",
    "subject": "조용민T",
    "question": "전사할 때 DNA 주형 가닥을 읽는 방향은?",
    "answers": {
      "up": "3′ → 5′",
      "left": "5′ → 3′",
      "right": "N말단 → C말단",
      "down": "방향이 없음"
    },
    "correct": "up",
    "explanation": "주형을 3′→5′으로 읽으면서 상보적인 RNA를 5′→3′으로 합성한다.",
    "sourceNote": "유전자의 발현 수업자료 · 9쪽"
  },
  {
    "id": "biology-jo-010",
    "topic": "전사",
    "subject": "조용민T",
    "question": "DNA 주형 3′-TACGGA-5′에서 합성되는 RNA는?",
    "answers": {
      "up": "5′-AUGCCU-3′",
      "left": "5′-TACGGA-3′",
      "right": "5′-ATGCCT-3′",
      "down": "3′-AUGCCU-5′"
    },
    "correct": "up",
    "explanation": "RNA에는 T 대신 U가 사용되며 주형과 상보적·역평행이다.",
    "sourceNote": "유전자의 발현 수업자료 · 9쪽"
  },
  {
    "id": "biology-jo-011",
    "topic": "전사",
    "subject": "조용민T",
    "question": "원핵세포 σ 인자의 기능은?",
    "answers": {
      "up": "프로모터 인식과 개시",
      "left": "번역 종결",
      "right": "펩타이드 결합 형성",
      "down": "poly-A 합성"
    },
    "correct": "up",
    "explanation": "σ 인자는 RNA 중합효소 완전효소가 프로모터를 인식하게 하며 개시 후 떨어진다.",
    "sourceNote": "유전자의 발현 수업자료 · 6쪽"
  },
  {
    "id": "biology-jo-012",
    "topic": "전사",
    "subject": "조용민T",
    "question": "원핵 RNA 중합효소 완전효소의 구성은?",
    "answers": {
      "up": "핵심효소 + σ 인자",
      "left": "핵심효소 + 히스톤",
      "right": "리보솜 + tRNA",
      "down": "PAP + snRNA"
    },
    "correct": "up",
    "explanation": "핵심효소에 σ 인자가 결합하면 프로모터 인식이 가능한 완전효소가 된다.",
    "sourceNote": "유전자의 발현 수업자료 · 6쪽"
  },
  {
    "id": "biology-jo-013",
    "topic": "전사",
    "subject": "조용민T",
    "question": "원핵 프로모터의 대표적인 공통서열 위치는?",
    "answers": {
      "up": "−35와 −10",
      "left": "+35와 +10",
      "right": "+1과 +1000",
      "down": "−1000과 +1000"
    },
    "correct": "up",
    "explanation": "전사 시작점을 +1로 할 때 상류의 −35, −10 부위가 프로모터 인식에 중요하다.",
    "sourceNote": "유전자의 발현 수업자료 · 8쪽"
  },
  {
    "id": "biology-jo-014",
    "topic": "전사",
    "subject": "조용민T",
    "question": "RNA 중합효소 I의 대표적인 산물은?",
    "answers": {
      "up": "28S·18S·5.8S rRNA",
      "left": "mRNA",
      "right": "tRNA만",
      "down": "5S rRNA만"
    },
    "correct": "up",
    "explanation": "진핵 RNA 중합효소 I은 인에서 주요 rRNA 전구체를 합성하며 5S rRNA는 III의 산물이다.",
    "sourceNote": "유전자의 발현 수업자료 · 10쪽"
  },
  {
    "id": "biology-jo-015",
    "topic": "전사",
    "subject": "조용민T",
    "question": "진핵 mRNA를 주로 합성하는 효소는?",
    "answers": {
      "up": "RNA 중합효소 II",
      "left": "RNA 중합효소 I",
      "right": "RNA 중합효소 III",
      "down": "아미노아실-tRNA 합성효소"
    },
    "correct": "up",
    "explanation": "RNA 중합효소 II는 mRNA와 여러 작은 RNA의 전사를 담당한다.",
    "sourceNote": "유전자의 발현 수업자료 · 10쪽"
  },
  {
    "id": "biology-jo-016",
    "topic": "전사",
    "subject": "조용민T",
    "question": "RNA 중합효소 III의 대표적인 산물은?",
    "answers": {
      "up": "5S rRNA와 tRNA",
      "left": "28S rRNA만",
      "right": "mRNA만",
      "down": "단백질"
    },
    "correct": "up",
    "explanation": "5S rRNA와 tRNA는 III에 의해 전사된다.",
    "sourceNote": "유전자의 발현 수업자료 · 10쪽"
  },
  {
    "id": "biology-jo-017",
    "topic": "전사",
    "subject": "조용민T",
    "question": "자료에서 α-아마니틴에 가장 민감한 효소는?",
    "answers": {
      "up": "RNA 중합효소 II",
      "left": "RNA 중합효소 I",
      "right": "PAP",
      "down": "펩타이드기 전이효소"
    },
    "correct": "up",
    "explanation": "자료에서 II는 매우 저해, I은 저해되지 않으며 III은 약간 저해되는 것으로 제시된다.",
    "sourceNote": "유전자의 발현 수업자료 · 10쪽"
  },
  {
    "id": "biology-jo-018",
    "topic": "RNA 가공",
    "subject": "조용민T",
    "question": "진핵 mRNA 5′ cap에 첨가되는 물질은?",
    "answers": {
      "up": "7-메틸구아노신",
      "left": "아데닌 약 250개",
      "right": "히스톤",
      "down": "메티오닌"
    },
    "correct": "up",
    "explanation": "5′ cap은 7-메틸구아노신 구조로 mRNA 보호와 번역 개시에 관여한다.",
    "sourceNote": "유전자의 발현 수업자료 · 13쪽"
  },
  {
    "id": "biology-jo-019",
    "topic": "RNA 가공",
    "subject": "조용민T",
    "question": "스플라이싱의 결과는?",
    "answers": {
      "up": "인트론 제거, 엑손 연결",
      "left": "엑손 제거, 인트론 연결",
      "right": "모든 U 제거",
      "down": "DNA 가닥 절단"
    },
    "correct": "up",
    "explanation": "pre-mRNA에서 인트론을 제거하고 엑손들을 연결해 성숙 mRNA를 만든다.",
    "sourceNote": "유전자의 발현 수업자료 · 13쪽"
  },
  {
    "id": "biology-jo-020",
    "topic": "RNA 가공",
    "subject": "조용민T",
    "question": "snRNP의 구성은?",
    "answers": {
      "up": "snRNA + 단백질",
      "left": "DNA + 히스톤",
      "right": "mRNA + 지질",
      "down": "rRNA + 인산만"
    },
    "correct": "up",
    "explanation": "snRNP들이 스플라이시오솜을 구성하며 RNA 성분도 촉매 기능에 관여한다.",
    "sourceNote": "유전자의 발현 수업자료 · 13쪽"
  },
  {
    "id": "biology-jo-021",
    "topic": "RNA 가공",
    "subject": "조용민T",
    "question": "poly-A 꼬리를 첨가하는 효소는?",
    "answers": {
      "up": "poly-A 합성효소(PAP)",
      "left": "RNA 중합효소 I",
      "right": "DNase",
      "down": "방출 인자"
    },
    "correct": "up",
    "explanation": "절단된 RNA의 3′ 말단에 PAP가 A를 첨가한다. 꼬리는 DNA의 T 연속서열을 그대로 전사한 것이 아니다.",
    "sourceNote": "유전자의 발현 수업자료 · 14쪽"
  },
  {
    "id": "biology-jo-022",
    "topic": "RNA 가공",
    "subject": "조용민T",
    "question": "성숙 mRNA의 UTR에 대한 설명은?",
    "answers": {
      "up": "전사되지만 번역되지 않는 부위",
      "left": "전사되지 않는 DNA만",
      "right": "항상 제거되는 인트론",
      "down": "모두 종결 코돈"
    },
    "correct": "up",
    "explanation": "5′·3′ UTR은 성숙 mRNA에 남아 번역과 안정성 등의 조절에 관여한다.",
    "sourceNote": "유전자의 발현 수업자료 · 12쪽"
  },
  {
    "id": "biology-jo-024",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "단백질 합성에 쓰이는 일반적인 아미노산 코돈 수는?",
    "answers": {
      "up": "61",
      "left": "64",
      "right": "20",
      "down": "3"
    },
    "correct": "up",
    "explanation": "총 64개 코돈 중 UAA, UAG, UGA는 종결 코돈이므로 아미노산 코돈은 61개이다.",
    "sourceNote": "유전자의 발현 수업자료 · 15쪽"
  },
  {
    "id": "biology-jo-025",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "유전 암호의 중복성이 뜻하는 것은?",
    "answers": {
      "up": "한 아미노산을 여러 코돈이 지정",
      "left": "한 코돈이 항상 여러 아미노산 지정",
      "right": "코돈 길이가 매번 다름",
      "down": "모든 코돈이 종결 코돈"
    },
    "correct": "up",
    "explanation": "여러 코돈이 같은 아미노산을 지정할 수 있지만 각 코돈의 의미는 일반적으로 특정된다.",
    "sourceNote": "유전자의 발현 수업자료 · 15쪽"
  },
  {
    "id": "biology-jo-026",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "tRNA의 아미노산 결합 부위는?",
    "answers": {
      "up": "3′ 말단 CCA",
      "left": "5′ 말단 AUG",
      "right": "안티코돈 중심",
      "down": "종결 코돈"
    },
    "correct": "up",
    "explanation": "tRNA 3′ 말단의 CCA 끝에 특정 아미노산이 결합한다.",
    "sourceNote": "유전자의 발현 수업자료 · 16쪽"
  },
  {
    "id": "biology-jo-027",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "아미노아실-tRNA 합성효소의 역할은?",
    "answers": {
      "up": "맞는 tRNA에 아미노산 부착",
      "left": "종결 코돈 생성",
      "right": "DNA 복제",
      "down": "리보솜 소단위 분해"
    },
    "correct": "up",
    "explanation": "ATP를 사용해 아미노산을 활성화하고 알맞은 tRNA에 연결하여 번역의 정확성을 높인다.",
    "sourceNote": "유전자의 발현 수업자료 · 17쪽"
  },
  {
    "id": "biology-jo-028",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "동요 가설에서 유연한 결합이 일어나는 위치는?",
    "answers": {
      "up": "코돈 3번째·안티코돈 1번째",
      "left": "코돈 1번째·안티코돈 3번째",
      "right": "코돈 세 염기 모두 동일하게",
      "down": "tRNA의 CCA와 코돈"
    },
    "correct": "up",
    "explanation": "코돈 3번째와 안티코돈 1번째 염기의 결합이 상대적으로 유연하여 하나의 tRNA가 여러 코돈을 인식한다.",
    "sourceNote": "유전자의 발현 수업자료 · 18쪽"
  },
  {
    "id": "biology-jo-029",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "원핵 리보솜의 펩타이드기 전이효소 활성을 갖는 성분은?",
    "answers": {
      "up": "23S rRNA",
      "left": "16S rRNA만",
      "right": "mRNA",
      "down": "DNA 중합효소"
    },
    "correct": "up",
    "explanation": "큰 소단위의 23S rRNA가 펩타이드 결합 형성의 촉매 중심을 이룬다.",
    "sourceNote": "유전자의 발현 수업자료 · 19쪽"
  },
  {
    "id": "biology-jo-030",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "샤인-달가르노 서열이 상보적으로 결합하는 것은?",
    "answers": {
      "up": "16S rRNA",
      "left": "23S rRNA",
      "right": "5S rRNA",
      "down": "DNA 주형"
    },
    "correct": "up",
    "explanation": "원핵 mRNA의 SD 서열이 소단위 16S rRNA와 결합하여 개시 위치를 맞춘다.",
    "sourceNote": "유전자의 발현 수업자료 · 20쪽"
  },
  {
    "id": "biology-jo-031",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "원핵 리보솜 70S의 소단위 조합은?",
    "answers": {
      "up": "50S + 30S",
      "left": "60S + 40S",
      "right": "35S + 35S",
      "down": "80S + 20S"
    },
    "correct": "up",
    "explanation": "S는 침강계수이므로 단순 산술 합이 아니며 진핵 세포질 리보솜은 80S(60S+40S)이다.",
    "sourceNote": "유전자의 발현 수업자료 · 19쪽"
  },
  {
    "id": "biology-jo-032",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "세균 번역 개시 tRNA가 처음 자리하는 곳은?",
    "answers": {
      "up": "P 자리",
      "left": "A 자리",
      "right": "E 자리",
      "down": "프로모터"
    },
    "correct": "up",
    "explanation": "개시 tRNA는 P 자리에 위치하며 다음 아미노아실-tRNA가 A 자리로 들어온다.",
    "sourceNote": "유전자의 발현 수업자료 · 21쪽"
  },
  {
    "id": "biology-jo-033",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "세균의 대표적인 개시 아미노산은?",
    "answers": {
      "up": "fMet",
      "left": "글리신",
      "right": "류신",
      "down": "트립토판"
    },
    "correct": "up",
    "explanation": "세균의 개시에는 변형된 메티오닌인 포밀메티오닌(fMet)이 사용된다.",
    "sourceNote": "유전자의 발현 수업자료 · 21쪽"
  },
  {
    "id": "biology-jo-034",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "신장 중 A 자리에 들어오는 것은?",
    "answers": {
      "up": "아미노아실-tRNA",
      "left": "비어 있는 tRNA만",
      "right": "DNA",
      "down": "히스톤"
    },
    "correct": "up",
    "explanation": "다음 코돈에 대응하는 아미노산을 실은 tRNA가 A 자리에 들어온다.",
    "sourceNote": "유전자의 발현 수업자료 · 22쪽"
  },
  {
    "id": "biology-jo-035",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "폴리펩타이드가 신장되는 방향은?",
    "answers": {
      "up": "N말단 → C말단",
      "left": "C말단 → N말단",
      "right": "5′ → 3′ 말단",
      "down": "3′ → 5′ 말단"
    },
    "correct": "up",
    "explanation": "새 아미노산은 사슬의 C말단 쪽에 추가되어 N에서 C로 신장된다.",
    "sourceNote": "유전자의 발현 수업자료 · 22쪽"
  },
  {
    "id": "biology-jo-036",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "번역 신장에서 GTP가 사용되는 과정은?",
    "answers": {
      "up": "tRNA 도입과 리보솜 이동",
      "left": "DNA 염기 치환만",
      "right": "poly-A 꼬리 합성만",
      "down": "인트론 절단만"
    },
    "correct": "up",
    "explanation": "신장 인자는 GTP를 사용하여 아미노아실-tRNA 도입과 한 코돈씩의 이동을 돕는다.",
    "sourceNote": "유전자의 발현 수업자료 · 22쪽"
  },
  {
    "id": "biology-jo-037",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "종결 코돈을 인식하는 것은?",
    "answers": {
      "up": "방출 인자",
      "left": "종결 코돈 전용 tRNA",
      "right": "히스톤",
      "down": "σ 인자"
    },
    "correct": "up",
    "explanation": "종결 코돈에는 아미노산을 운반하는 tRNA 대신 방출 인자가 작용해 사슬을 방출한다.",
    "sourceNote": "유전자의 발현 수업자료 · 23쪽"
  },
  {
    "id": "biology-jo-038",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "폴리리보솜에 대한 설명은?",
    "answers": {
      "up": "한 mRNA를 여러 리보솜이 번역",
      "left": "여러 DNA를 한 리보솜이 복제",
      "right": "한 리보솜에 여러 주형 DNA",
      "down": "단백질을 RNA로 전환"
    },
    "correct": "up",
    "explanation": "여러 리보솜이 한 mRNA를 번역하여 단백질 합성 효율을 높인다.",
    "sourceNote": "유전자의 발현 수업자료 · 24쪽"
  },
  {
    "id": "biology-jo-039",
    "topic": "유전 암호와 번역",
    "subject": "조용민T",
    "question": "원핵에서 전사와 번역의 동시 진행이 가능한 이유는?",
    "answers": {
      "up": "핵막으로 분리되지 않기 때문",
      "left": "RNA가 필요 없기 때문",
      "right": "리보솜이 DNA를 번역하기 때문",
      "down": "전사 방향이 반대이기 때문"
    },
    "correct": "up",
    "explanation": "원핵에는 핵막이 없어 전사 중인 mRNA에 리보솜이 결합할 수 있다.",
    "sourceNote": "유전자의 발현 수업자료 · 25쪽"
  },
  ...joDepthCards,
];
