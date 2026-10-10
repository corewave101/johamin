import type { SwipeCard } from './swipe-cards';
import type { WrittenQuestion } from './biology-written';
export const chemistryCards: SwipeCard[] = [
  {
    "id": "chemistry-depth-001",
    "topic": "화학 평형 · K·Q·이동",
    "subject": "화학 · 적용",
    "question": "밀폐 용기의 가역 반응이 평형이다. 반드시 성립하는 관계는?",
    "answers": {
      "up": "정반응 속도=역반응 속도",
      "left": "모든 물질의 농도가 같다",
      "right": "반응물과 생성물 양이 항상 같다",
      "down": "분자 사이 반응이 모두 멈춘다"
    },
    "correct": "up",
    "explanation": "동적 평형에서는 두 반응이 계속 진행하면서 속도가 같아 각 농도가 일정하다. 농도 값이 서로 같아야 하는 것은 아니다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 7쪽"
  },
  {
    "id": "chemistry-depth-002",
    "topic": "화학 평형 · K·Q·이동",
    "subject": "화학 · 적용",
    "question": "A+2B⇌C의 평형 상수 식은? 모두 수용액이다.",
    "answers": {
      "up": "[C]²/([A][B])",
      "left": "[C]/([A][B]²)",
      "right": "[A][B]²/[C]",
      "down": "[C]/([A]+2[B])"
    },
    "correct": "left",
    "explanation": "농도 항의 지수는 반응식 계수다. 생성물 항을 반응물 항으로 나누며 B의 계수 2는 제곱에 반영한다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 7쪽"
  },
  {
    "id": "chemistry-depth-003",
    "topic": "화학 평형 · K·Q·이동",
    "subject": "화학 · 적용",
    "question": "CaCO₃(s)⇌CaO(s)+CO₂(g)의 농도로 나타낸 평형 상수는?",
    "answers": {
      "up": "1/[CO₂]",
      "left": "[CaCO₃]/[CaO]",
      "right": "[CO₂]",
      "down": "[CaO][CO₂]/[CaCO₃]"
    },
    "correct": "right",
    "explanation": "순수한 고체 CaCO₃와 CaO의 활동도는 일정하여 농도 평형 상수 식에 넣지 않는다. 기체 CO₂ 항만 남는다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 7쪽"
  },
  {
    "id": "chemistry-depth-004",
    "topic": "화학 평형 · K·Q·이동",
    "subject": "화학 · 적용",
    "question": "A⇌B의 K=4이며 현재 [A]=0.5 M, [B]=1 M이다. 반응 방향은?",
    "answers": {
      "up": "역반응 우세",
      "left": "이미 평형",
      "right": "농도만으로 Q 계산 불가",
      "down": "정반응 우세"
    },
    "correct": "down",
    "explanation": "Q=[B]/[A]=2로 K=4보다 작다. 생성물 B가 늘어 Q가 커지는 정반응 방향으로 진행한다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 7쪽"
  },
  {
    "id": "chemistry-depth-005",
    "topic": "화학 평형 · K·Q·이동",
    "subject": "화학 · 적용",
    "question": "A⇌B의 K=2이고 Q=5다. 평형에 접근하는 동안의 변화는?",
    "answers": {
      "up": "B 감소·A 증가",
      "left": "B 증가·A 감소",
      "right": "둘 다 반드시 증가",
      "down": "두 농도가 즉시 같아짐"
    },
    "correct": "up",
    "explanation": "Q>K이므로 역반응이 우세하여 생성물이 줄고 반응물이 늘어난다. 평형에서 농도가 같아지는 것은 아니다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 7쪽"
  },
  {
    "id": "chemistry-depth-006",
    "topic": "화학 평형 · K·Q·이동",
    "subject": "화학 · 적용",
    "question": "2A⇌B의 K=8이다. 반응식을 B⇌2A로 뒤집으면 K는?",
    "answers": {
      "up": "64",
      "left": "1/8",
      "right": "8",
      "down": "4"
    },
    "correct": "left",
    "explanation": "역반응의 평형 상수는 원래 상수의 역수다. 모든 농도 항의 분자와 분모가 바뀌기 때문이다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 7쪽"
  },
  {
    "id": "chemistry-depth-007",
    "topic": "화학 평형 · K·Q·이동",
    "subject": "화학 · 적용",
    "question": "A⇌B의 K=3이다. 반응식을 2A⇌2B로 쓰면 K는?",
    "answers": {
      "up": "6",
      "left": "1/3",
      "right": "9",
      "down": "3"
    },
    "correct": "right",
    "explanation": "반응식 계수를 2배로 하면 농도 항의 지수도 2배가 되어 평형 상수는 K²=9다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 7쪽"
  },
  {
    "id": "chemistry-depth-008",
    "topic": "화학 평형 · K·Q·이동",
    "subject": "화학 · 적용",
    "question": "같은 온도에서 평형 혼합물에 촉매만 넣었다. 최종 평형 상수는?",
    "answers": {
      "up": "항상 증가한다",
      "left": "항상 감소한다",
      "right": "반드시 1이 된다",
      "down": "변하지 않는다"
    },
    "correct": "down",
    "explanation": "촉매는 정·역반응의 경로를 바꾸어 평형에 빠르게 도달하게 하지만 일정 온도의 평형 상수는 바꾸지 않는다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 7쪽"
  },
  {
    "id": "chemistry-depth-009",
    "topic": "화학 평형 · K·Q·이동",
    "subject": "화학 · 적용",
    "question": "N₂(g)+3H₂(g)⇌2NH₃(g)의 평형에서 온도를 유지하고 부피를 줄였다. 이동 방향은?",
    "answers": {
      "up": "NH₃ 생성 방향",
      "left": "N₂·H₂ 생성 방향",
      "right": "기체 몰수와 무관하게 정지",
      "down": "K가 반드시 증가하는 방향"
    },
    "correct": "up",
    "explanation": "기체 총 몰수가 4에서 2로 줄어드는 정반응 쪽으로 이동한다. 압력 변화 자체는 일정 온도의 K를 바꾸지 않는다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 7쪽"
  },
  {
    "id": "chemistry-depth-010",
    "topic": "화학 평형 · K·Q·이동",
    "subject": "화학 · 적용",
    "question": "발열 정반응의 평형에서 온도를 올렸다. 새 평형에서 K의 변화는?",
    "answers": {
      "up": "온도는 K에 영향을 주지 않는다",
      "left": "감소한다",
      "right": "증가한다",
      "down": "항상 1이 된다"
    },
    "correct": "left",
    "explanation": "열을 생성물처럼 보면 가열은 역반응을 유리하게 한다. 발열 정반응의 생성물 비가 줄어 K가 감소한다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 7쪽"
  },
  {
    "id": "chemistry-depth-011",
    "topic": "평형 실험 · 색 변화와 조작",
    "subject": "화학 · 적용",
    "question": "Cr₂O₇²⁻(주황)+H₂O⇌2CrO₄²⁻(노랑)+2H⁺에 HCl을 소량 넣었다. 대표적 색 변화는?",
    "answers": {
      "up": "항상 무색",
      "left": "항상 파랑",
      "right": "주황 쪽",
      "down": "노랑 쪽"
    },
    "correct": "right",
    "explanation": "H⁺ 증가를 줄이는 역반응이 유리해져 주황색 다이크로뮴산 이온 비율이 증가한다. 염화 이온 효과와 H⁺ 효과를 구별한다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-012",
    "topic": "평형 실험 · 색 변화와 조작",
    "subject": "화학 · 적용",
    "question": "Cr₂O₇²⁻(주황)+H₂O⇌2CrO₄²⁻(노랑)+2H⁺에 NaOH를 소량 넣었다. 설명은?",
    "answers": {
      "up": "OH⁻가 H⁺를 생성해 주황 이동",
      "left": "Na⁺가 직접 파란 착물을 형성",
      "right": "온도 일정해도 K가 반드시 증가",
      "down": "H⁺ 소비로 노랑 쪽 이동"
    },
    "correct": "down",
    "explanation": "OH⁻가 H⁺와 반응하여 그 농도를 낮추므로 H⁺를 만드는 정반응이 유리해지고 노랑색 크로뮴산 이온이 증가한다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-013",
    "topic": "평형 실험 · 색 변화와 조작",
    "subject": "화학 · 적용",
    "question": "분홍 코발트 착물+4Cl⁻⇌파랑 코발트 착물+6H₂O. CaCl₂를 넣을 때 핵심 조작 변수는?",
    "answers": {
      "up": "Cl⁻ 농도 증가",
      "left": "H⁺ 농도만 증가",
      "right": "온도만 감소",
      "down": "기체 압력 증가"
    },
    "correct": "up",
    "explanation": "CaCl₂는 용해되어 염화 이온을 공급한다. 공통 반응물 Cl⁻의 증가로 파랑 착물 생성 방향이 유리해진다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-014",
    "topic": "평형 실험 · 색 변화와 조작",
    "subject": "화학 · 적용",
    "question": "분홍 코발트 착물+4Cl⁻⇌파랑 코발트 착물+6H₂O. 물로 희석할 때 분홍 쪽으로 이동하는 설명은?",
    "answers": {
      "up": "흡열 반응이므로 항상 파랑이 된다",
      "left": "이온 농도 감소로 Q가 커진다",
      "right": "순수한 물 항만 K를 바꾼다",
      "down": "염화 이온 농도가 증가한다"
    },
    "correct": "left",
    "explanation": "물의 활동도를 일정하게 근사하면 Q=[파랑]/([분홍][Cl⁻]⁴)다. 같은 비율 희석에서 Q가 커져 역반응으로 분홍 쪽을 유리하게 한다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-015",
    "topic": "평형 실험 · 색 변화와 조작",
    "subject": "화학 · 적용",
    "question": "분홍 코발트 착물⇌파랑 코발트 착물의 정반응이 흡열이다. 가열·냉각 결과는?",
    "answers": {
      "up": "두 경우 모두 파랑",
      "left": "두 경우 모두 무색",
      "right": "가열 파랑·냉각 분홍",
      "down": "가열 분홍·냉각 파랑"
    },
    "correct": "right",
    "explanation": "가열은 열을 소비하는 정반응, 냉각은 열을 내는 역반응을 유리하게 한다. 농도 조작과 다르게 온도는 K에도 영향을 준다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-016",
    "topic": "평형 실험 · 색 변화와 조작",
    "subject": "화학 · 적용",
    "question": "코발트 평형을 Cl⁻ 첨가와 가열로 각각 파랑 쪽으로 이동시켰다. K를 바꿀 수 있는 조작은?",
    "answers": {
      "up": "Cl⁻ 첨가만",
      "left": "두 조작 모두 반드시 같다",
      "right": "둘 다 K를 바꾸지 않는다",
      "down": "가열"
    },
    "correct": "down",
    "explanation": "같은 온도의 농도 조작은 Q와 조성을 바꾸지만 K는 유지한다. 가열은 온도를 바꾸므로 K도 바뀔 수 있다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-017",
    "topic": "평형 실험 · 색 변화와 조작",
    "subject": "화학 · 적용",
    "question": "주황↔노랑 평형 실험에서 산·염기를 번갈아 넣어 색 변화가 되돌아왔다. 보여 주는 성질은?",
    "answers": {
      "up": "조건 변화에 따른 가역적 평형 이동",
      "left": "생성물이 완전히 사라지는 비가역성",
      "right": "정반응만 존재한다는 사실",
      "down": "산·염기 첨가가 온도와 같다는 사실"
    },
    "correct": "up",
    "explanation": "관찰된 가역적 색 변화는 농도 조건을 바꾸면 평형 조성이 달라질 수 있음을 보여 준다. 색만으로 모든 물질의 소실을 단정하지 않는다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-018",
    "topic": "평형 실험 · 색 변화와 조작",
    "subject": "화학 · 적용",
    "question": "따뜻한 물과 얼음물에 같은 코발트 용액을 넣어 색을 비교한다. 공정한 비교 조건은?",
    "answers": {
      "up": "두 용액의 색이 달라야만 시작한다",
      "left": "초기 농도·부피를 같게 한다",
      "right": "한쪽에만 CaCl₂도 넣는다",
      "down": "한쪽 초기 농도를 10배로 한다"
    },
    "correct": "left",
    "explanation": "온도의 영향을 비교하려면 초기 농도와 부피 등 다른 조건을 같게 하고 충분히 온도가 안정된 뒤 관찰해야 한다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-019",
    "topic": "산·염기 · 짝과 세기·pH",
    "subject": "화학 · 적용",
    "question": "NH₃+H₂O⇌NH₄⁺+OH⁻에서 물의 역할은?",
    "answers": {
      "up": "아무 변화 없는 촉매",
      "left": "항상 산도 염기도 아님",
      "right": "H⁺를 주는 산",
      "down": "H⁺를 받는 염기"
    },
    "correct": "right",
    "explanation": "물은 NH₃에 양성자를 주고 OH⁻가 되므로 이 반응에서 브뢴스테드·로리 산이다. 물의 역할은 반응마다 달라질 수 있다.",
    "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽"
  },
  {
    "id": "chemistry-depth-020",
    "topic": "산·염기 · 짝과 세기·pH",
    "subject": "화학 · 적용",
    "question": "HCl+H₂O→H₃O⁺+Cl⁻에서 물의 역할은?",
    "answers": {
      "up": "H⁺를 주는 산",
      "left": "전자만 받는 산",
      "right": "염화 이온을 주는 염기",
      "down": "H⁺를 받는 염기"
    },
    "correct": "down",
    "explanation": "물은 HCl의 양성자를 받아 H₃O⁺가 되므로 염기다. 물은 다른 반응에서 산으로도 작용할 수 있다.",
    "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽"
  },
  {
    "id": "chemistry-depth-021",
    "topic": "산·염기 · 짝과 세기·pH",
    "subject": "화학 · 적용",
    "question": "짝산·짝염기 관계인 것은?",
    "answers": {
      "up": "H₂CO₃와 HCO₃⁻",
      "left": "HCl과 NaOH",
      "right": "H₃O⁺와 OH⁻",
      "down": "CH₃COOH와 Na⁺"
    },
    "correct": "up",
    "explanation": "짝산·짝염기는 양성자 한 개만 차이난다. H₂CO₃에서 H⁺를 하나 떼면 HCO₃⁻다.",
    "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽"
  },
  {
    "id": "chemistry-depth-022",
    "topic": "산·염기 · 짝과 세기·pH",
    "subject": "화학 · 적용",
    "question": "같은 온도에서 Ka(A)=10⁻³, Ka(B)=10⁻⁶이다. 산과 짝염기의 세기는?",
    "answers": {
      "up": "산의 세기와 짝염기 세기는 비례",
      "left": "A가 강산·B의 짝염기가 더 강함",
      "right": "B가 강산·A의 짝염기가 더 강함",
      "down": "A와 B의 세기가 같다"
    },
    "correct": "left",
    "explanation": "Ka가 클수록 산의 이온화 경향이 크다. KaKb=Kw이므로 강한 산의 짝염기는 더 약하다.",
    "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽"
  },
  {
    "id": "chemistry-depth-023",
    "topic": "산·염기 · 짝과 세기·pH",
    "subject": "화학 · 적용",
    "question": "25℃에서 [H₃O⁺]=10⁻⁴ M인 용액의 pH와 [OH⁻]는?",
    "answers": {
      "up": "4·10⁻⁴ M",
      "left": "10·10⁻¹⁰ M",
      "right": "4·10⁻¹⁰ M",
      "down": "10·10⁻⁴ M"
    },
    "correct": "right",
    "explanation": "pH=−log[H₃O⁺]=4이고 Kw=10⁻¹⁴=[H₃O⁺][OH⁻]에서 [OH⁻]=10⁻¹⁰ M다.",
    "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽"
  },
  {
    "id": "chemistry-depth-024",
    "topic": "산·염기 · 짝과 세기·pH",
    "subject": "화학 · 적용",
    "question": "25℃에서 [OH⁻]=10⁻³ M일 때 pH는?",
    "answers": {
      "up": "3",
      "left": "7",
      "right": "14",
      "down": "11"
    },
    "correct": "down",
    "explanation": "pOH=3이며 pH+pOH=14이므로 pH=11이다. OH⁻를 H₃O⁺처럼 바로 pH 식에 넣지 않는다.",
    "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽"
  },
  {
    "id": "chemistry-depth-025",
    "topic": "산·염기 · 짝과 세기·pH",
    "subject": "화학 · 적용",
    "question": "같은 온도에서 pH 3과 pH 5 용액의 H₃O⁺ 농도 비는?",
    "answers": {
      "up": "100:1",
      "left": "2:1",
      "right": "1:100",
      "down": "5:3"
    },
    "correct": "up",
    "explanation": "pH 3은 10⁻³ M, pH 5는 10⁻⁵ M이므로 100:1이다. pH의 차이를 농도의 단순 차이로 해석하지 않는다.",
    "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽"
  },
  {
    "id": "chemistry-depth-026",
    "topic": "산·염기 · 짝과 세기·pH",
    "subject": "화학 · 적용",
    "question": "0.01 M HCl과 0.10 M CH₃COOH를 비교한다. 강약·농도 구별은?",
    "answers": {
      "up": "두 용액의 강약과 농도 모두 같음",
      "left": "HCl이 강산·아세트산이 더 진함",
      "right": "아세트산이 강산·HCl이 더 진함",
      "down": "농도가 큰 산이 항상 강산"
    },
    "correct": "left",
    "explanation": "HCl은 거의 완전히 이온화하는 강산이고 아세트산은 약산이다. 분석 농도는 아세트산이 10배이며 강약과 농도를 구별한다.",
    "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽"
  },
  {
    "id": "chemistry-depth-027",
    "topic": "산·염기 · 짝과 세기·pH",
    "subject": "화학 · 적용",
    "question": "약산 HA의 초기 농도 C, 이온화량 x다. 물의 이온화를 무시할 때 정확한 식은?",
    "answers": {
      "up": "Ka=(C−x)²/x",
      "left": "Ka=C/x²",
      "right": "Ka=x²/(C−x)",
      "down": "Ka=x²/C만 항상 정확"
    },
    "correct": "right",
    "explanation": "평형 [HA]=C−x, [H₃O⁺]=[A⁻]=x이므로 Ka=x²/(C−x)다. C−x≈C는 x/C가 작을 때만 근사다.",
    "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽"
  },
  {
    "id": "chemistry-depth-028",
    "topic": "산·염기 · 짝과 세기·pH",
    "subject": "화학 · 적용",
    "question": "0.10 M 약산에서 근사 계산 x=0.0020 M을 얻었다. 5% 규칙 적용 결과는?",
    "answers": {
      "up": "20%이므로 근사 불가",
      "left": "0.2%이므로 정확해와 동일",
      "right": "5% 규칙은 강산에만 적용",
      "down": "2%이므로 근사 타당"
    },
    "correct": "down",
    "explanation": "x/C×100=0.0020/0.10×100=2%다. 5% 이하이면 이 기준에서 근사 사용이 타당하며 정확해와 완전히 같다는 뜻은 아니다.",
    "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽"
  },
  {
    "id": "chemistry-depth-029",
    "topic": "산·염기 · 짝과 세기·pH",
    "subject": "화학 · 적용",
    "question": "0.010 M 약산의 근사 x=0.0030 M이다. 다음 계산으로 적절한 것은?",
    "answers": {
      "up": "근사 재검토 후 이차식으로 계산",
      "left": "30%라도 분모를 C로 둔다",
      "right": "pH는 항상 7로 둔다",
      "down": "Ka 대신 Kp를 꼭 사용한다"
    },
    "correct": "up",
    "explanation": "이온화율이 30%로 5%를 넘으므로 C−x≈C가 부적절하다. 정확한 Ka=x²/(C−x)로 풀어야 한다.",
    "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽"
  },
  {
    "id": "chemistry-depth-030",
    "topic": "산·염기 · 짝과 세기·pH",
    "subject": "화학 · 적용",
    "question": "25℃에서 Ka=10⁻⁵인 산의 짝염기 Kb는?",
    "answers": {
      "up": "10⁹",
      "left": "10⁻⁹",
      "right": "10⁻⁵",
      "down": "10⁻¹⁴"
    },
    "correct": "left",
    "explanation": "KaKb=Kw=10⁻¹⁴이므로 Kb=10⁻¹⁴/10⁻⁵=10⁻⁹다. 같은 온도의 짝 관계에 적용한다.",
    "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽"
  },
  {
    "id": "chemistry-depth-031",
    "topic": "중화 반응 · 몰수·희석·혼합",
    "subject": "화학 · 적용",
    "question": "0.20 M HCl 50 mL를 완전 중화하는 0.10 M Ca(OH)₂의 부피는?",
    "answers": {
      "up": "25 mL",
      "left": "200 mL",
      "right": "50 mL",
      "down": "100 mL"
    },
    "correct": "right",
    "explanation": "H⁺는 0.20×0.050=0.010 mol이다. Ca(OH)₂ 한 몰은 OH⁻ 두 몰이므로 2×0.10×V=0.010에서 V=0.050 L다.",
    "sourceNote": "Ⅰ-0. 화학 중화반응 · 3쪽"
  },
  {
    "id": "chemistry-depth-032",
    "topic": "중화 반응 · 몰수·희석·혼합",
    "subject": "화학 · 적용",
    "question": "0.10 M H₂SO₄ 30 mL를 완전 중화하는 0.10 M NaOH는? 두 양성자가 모두 반응한다.",
    "answers": {
      "up": "30 mL",
      "left": "15 mL",
      "right": "90 mL",
      "down": "60 mL"
    },
    "correct": "down",
    "explanation": "산의 반응 양성자 몰수는 2×0.10×0.030=0.006 mol이다. NaOH 0.10 M는 0.060 L가 필요하다.",
    "sourceNote": "Ⅰ-0. 화학 중화반응 · 3쪽"
  },
  {
    "id": "chemistry-depth-033",
    "topic": "중화 반응 · 몰수·희석·혼합",
    "subject": "화학 · 적용",
    "question": "25℃에서 0.10 M HCl 20 mL와 0.10 M NaOH 10 mL를 혼합했다. 부피가 합쳐질 때 남은 H⁺ 농도는?",
    "answers": {
      "up": "1/30 M",
      "left": "0.10 M",
      "right": "1/10 M",
      "down": "1/60 M"
    },
    "correct": "up",
    "explanation": "H⁺ 0.002 mol에서 OH⁻ 0.001 mol을 빼면 0.001 mol이 남는다. 전체 0.030 L로 나누면 1/30 M다.",
    "sourceNote": "Ⅰ-0. 화학 중화반응 · 3쪽"
  },
  {
    "id": "chemistry-depth-034",
    "topic": "중화 반응 · 몰수·희석·혼합",
    "subject": "화학 · 적용",
    "question": "25℃에서 0.10 M HCl 10 mL와 0.10 M NaOH 30 mL를 혼합했다. 남은 OH⁻ 농도는?",
    "answers": {
      "up": "0.20 M",
      "left": "0.050 M",
      "right": "0.10 M",
      "down": "0.025 M"
    },
    "correct": "left",
    "explanation": "OH⁻ 0.003 mol에서 H⁺ 0.001 mol을 빼면 0.002 mol이 남는다. 전체 0.040 L로 나누면 0.050 M다.",
    "sourceNote": "Ⅰ-0. 화학 중화반응 · 3쪽"
  },
  {
    "id": "chemistry-depth-035",
    "topic": "중화 반응 · 몰수·희석·혼합",
    "subject": "화학 · 적용",
    "question": "산 시료 20 mL를 정량 취한 뒤 증류수 30 mL를 추가하고 적정했다. 필요한 NaOH 몰수는?",
    "answers": {
      "up": "2.5배로 감소",
      "left": "산이 약산이면 반드시 0",
      "right": "물 추가 전과 같다",
      "down": "2.5배로 증가"
    },
    "correct": "right",
    "explanation": "정량 취한 산 시료의 산 몰수는 물 추가로 바뀌지 않는다. 같은 산 몰수를 중화하므로 필요한 NaOH 몰수도 같다.",
    "sourceNote": "Ⅰ-0. 화학 중화반응 · 3쪽"
  },
  {
    "id": "chemistry-depth-036",
    "topic": "중화 반응 · 몰수·희석·혼합",
    "subject": "화학 · 적용",
    "question": "원액 10 mL를 물로 최종 100 mL로 희석했다. 같은 원액의 농도를 C라 할 때 희석액 농도는?",
    "answers": {
      "up": "10C",
      "left": "C",
      "right": "C/100",
      "down": "C/10"
    },
    "correct": "down",
    "explanation": "용질 몰수 C×10 mL가 최종 100 mL에 분포하므로 C/10이다. 물을 100 mL 더 넣는 조건과 구별한다.",
    "sourceNote": "Ⅰ-0. 화학 중화반응 · 3쪽"
  },
  {
    "id": "chemistry-depth-037",
    "topic": "중화 반응 · 몰수·희석·혼합",
    "subject": "화학 · 적용",
    "question": "0.10 M HCl과 0.10 M NaOH를 같은 부피 섞었다. 25℃에서 이상적으로 중화점의 pH는?",
    "answers": {
      "up": "7",
      "left": "1",
      "right": "13",
      "down": "강산이므로 항상 1"
    },
    "correct": "up",
    "explanation": "강산·강염기의 같은 반응 몰수라면 염의 가수분해 효과를 무시할 수 있어 25℃에서 중성 pH 7이다.",
    "sourceNote": "Ⅰ-0. 화학 중화반응 · 3쪽"
  },
  {
    "id": "chemistry-depth-038",
    "topic": "중화 반응 · 몰수·희석·혼합",
    "subject": "화학 · 적용",
    "question": "중화점의 정의로 타당한 것은?",
    "answers": {
      "up": "모든 이온이 완전히 없어진 점",
      "left": "산·염기가 화학량론적으로 반응한 점",
      "right": "어떤 산·염기라도 pH가 7인 점",
      "down": "지시약을 처음 넣는 순간"
    },
    "correct": "left",
    "explanation": "중화점은 반응식 계수에 맞는 산·염기 양이 반응한 점이다. 약산·강염기 중화점은 염기성일 수 있고 염 이온은 남아 있다.",
    "sourceNote": "Ⅰ-0. 화학 중화반응 · 3쪽"
  },
  {
    "id": "chemistry-depth-039",
    "topic": "적정 실험 · 그래프와 오차",
    "subject": "화학 · 적용",
    "question": "미지 아세트산 20.0 mL에 0.100 M NaOH 22.0 mL가 정확히 중화량이었다. 산 몰농도는?",
    "answers": {
      "up": "0.220 M",
      "left": "1.10 M",
      "right": "0.110 M",
      "down": "0.0909 M"
    },
    "correct": "right",
    "explanation": "아세트산과 NaOH는 1:1 반응이다. 0.100×0.0220/0.0200=0.110 M이며 mL 비는 서로 약분 가능하다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-040",
    "topic": "적정 실험 · 그래프와 오차",
    "subject": "화학 · 적용",
    "question": "뷰렛 초기 1.20 mL, 최종 23.40 mL다. 사용량은?",
    "answers": {
      "up": "23.40 mL",
      "left": "24.60 mL",
      "right": "1.20 mL",
      "down": "22.20 mL"
    },
    "correct": "down",
    "explanation": "사용량은 최종−초기=23.40−1.20=22.20 mL다. 초기 눈금이 0이 아닐 때 최종값만 쓰면 과대 계산한다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-041",
    "topic": "적정 실험 · 그래프와 오차",
    "subject": "화학 · 적용",
    "question": "미지 산 적정에서 종말점을 지나 NaOH를 과량 넣고 그대로 사용량을 기록했다. 계산한 산 농도는?",
    "answers": {
      "up": "과대",
      "left": "과소",
      "right": "항상 정확",
      "down": "과대·과소가 상쇄되어 동일"
    },
    "correct": "up",
    "explanation": "산 농도를 표준 NaOH 사용 몰수로 계산하므로 기록한 사용량이 커지면 산 몰수와 농도를 과대 추정한다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-042",
    "topic": "적정 실험 · 그래프와 오차",
    "subject": "화학 · 적용",
    "question": "NaOH로 헹구지 않은 뷰렛의 잔류 물이 표준 NaOH를 희석했다. 원래 농도로 산을 계산하면?",
    "answers": {
      "up": "중화가 더 빨라져 과소 추정",
      "left": "산 농도를 과대 추정",
      "right": "산 농도를 과소 추정",
      "down": "산 농도에는 영향 없음"
    },
    "correct": "left",
    "explanation": "실제 NaOH 농도가 낮아 같은 산에 더 큰 부피가 필요하다. 이를 더 높은 원래 농도로 곱하면 산 몰수를 과대 계산한다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-043",
    "topic": "적정 실험 · 그래프와 오차",
    "subject": "화학 · 적용",
    "question": "산으로 헹구지 않은 피펫의 잔류 물이 정량 취한 시료를 희석했다. 원액 농도 계산의 영향은?",
    "answers": {
      "up": "항상 영향 없음",
      "left": "뷰렛 사용량이 더 커져 과대",
      "right": "과소 추정",
      "down": "과대 추정"
    },
    "correct": "right",
    "explanation": "피펫의 정해진 부피에 포함된 실제 산 몰수가 줄어 NaOH 사용량이 감소한다. 원액의 해당 부피에 들어 있을 몰수를 작게 추정한다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-044",
    "topic": "적정 실험 · 그래프와 오차",
    "subject": "화학 · 적용",
    "question": "산을 정량 취한 삼각 플라스크에 증류수 몇 방울이 남아 있다. 적정으로 구한 원액 농도는?",
    "answers": {
      "up": "항상 과소 추정",
      "left": "항상 과대 추정",
      "right": "산이 강산이면 2배",
      "down": "이상적 조건에서 영향 없음"
    },
    "correct": "down",
    "explanation": "정량 취한 산의 몰수는 플라스크의 물로 바뀌지 않는다. 피펫 속 물 때문에 취한 산 몰수가 줄어드는 경우와 구별한다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-045",
    "topic": "적정 실험 · 그래프와 오차",
    "subject": "화학 · 적용",
    "question": "뷰렛 끝에 있던 기포가 적정 중 사라져 눈금 변화 일부가 끝부분을 채웠다. 기록 사용량으로 계산한 산 농도는?",
    "answers": {
      "up": "과대 추정",
      "left": "과소 추정",
      "right": "변화 없음",
      "down": "반드시 정확히 2배"
    },
    "correct": "up",
    "explanation": "눈금 변화에는 플라스크에 도달하지 않고 끝을 채운 부피도 포함된다. 사용량을 과대 기록하므로 산 농도도 과대 추정한다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-046",
    "topic": "적정 실험 · 그래프와 오차",
    "subject": "화학 · 적용",
    "question": "중화점 근처에서 NaOH 첨가 간격을 1 mL에서 0.1 mL로 줄이는 주된 이유는?",
    "answers": {
      "up": "중화점을 pH 7로 고정하기",
      "left": "급격한 pH 변화 구간을 자세히 찾기",
      "right": "NaOH의 농도를 증가시키기",
      "down": "중화 반응 계수를 바꾸기"
    },
    "correct": "left",
    "explanation": "중화점 부근에서는 적은 첨가량에도 pH가 급변한다. 작은 간격은 위치를 자세히 추정하게 하며 표준용액 농도를 바꾸지 않는다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-047",
    "topic": "적정 실험 · 그래프와 오차",
    "subject": "화학 · 적용",
    "question": "pH 센서 값을 기록하기 전에 충분히 저으며 안정될 때까지 기다리는 까닭은?",
    "answers": {
      "up": "모든 용액을 pH 7로 만든다",
      "left": "중화점의 산 몰수를 감소시킨다",
      "right": "국소 농도·응답 지연 영향을 줄인다",
      "down": "산의 총 몰수를 늘린다"
    },
    "correct": "right",
    "explanation": "용액이 섞이지 않으면 국소 pH를 읽을 수 있고 센서에는 응답 시간이 있다. 충분한 혼합과 안정 후 기록이 필요하다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-048",
    "topic": "적정 실험 · 그래프와 오차",
    "subject": "화학 · 적용",
    "question": "센서로 그린 적정 곡선의 축을 올바르게 정한 것은?",
    "answers": {
      "up": "x: pH·y: 시간만",
      "left": "x: 산의 초기 부피·y: pH",
      "right": "x: NaOH 농도·y: 항상 온도",
      "down": "x: NaOH 부피·y: pH"
    },
    "correct": "down",
    "explanation": "수업의 적정 곡선은 첨가한 NaOH의 누적 부피에 따른 pH 변화다. 사용량과 부피 간격을 구분한다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-049",
    "topic": "적정 실험 · 그래프와 오차",
    "subject": "화학 · 적용",
    "question": "지시약 종말점과 화학량론적 중화점의 관계는?",
    "answers": {
      "up": "가까울 수 있지만 항상 같지는 않다",
      "left": "어떤 지시약에서도 항상 같다",
      "right": "종말점은 항상 pH 7이다",
      "down": "중화점에는 지시약이 필수다"
    },
    "correct": "up",
    "explanation": "지시약의 변색 범위와 실제 중화점은 다를 수 있다. 급격한 pH 변화 구간에 맞는 지시약을 선택해야 오차가 작다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-050",
    "topic": "적정 실험 · 그래프와 오차",
    "subject": "화학 · 적용",
    "question": "10배 희석한 식초 20 mL 적정에 0.10 M NaOH 16 mL가 들었다. 원래 식초의 아세트산 농도는?",
    "answers": {
      "up": "8.0 M",
      "left": "0.80 M",
      "right": "0.080 M",
      "down": "0.0080 M"
    },
    "correct": "left",
    "explanation": "희석액 농도는 0.10×16/20=0.080 M다. 원액은 10배이므로 0.80 M이며 희석 배수를 다시 반영한다.",
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-051",
    "topic": "염의 가수분해 · 중화점 pH",
    "subject": "화학 · 적용",
    "question": "25℃에서 CH₃COOH를 NaOH로 적정한 중화점의 pH는?",
    "answers": {
      "up": "7보다 작다",
      "left": "초기 산 pH와 같다",
      "right": "7보다 크다",
      "down": "항상 7"
    },
    "correct": "right",
    "explanation": "생성된 CH₃COO⁻가 물에서 OH⁻를 만들어 염기성을 나타낸다. 화학량론적 중화점과 중성 pH를 구별한다.",
    "sourceNote": "Ⅰ-3. 중화적정 · 17쪽"
  },
  {
    "id": "chemistry-depth-052",
    "topic": "염의 가수분해 · 중화점 pH",
    "subject": "화학 · 적용",
    "question": "25℃에서 NH₃를 HCl로 적정한 중화점이 산성인 주된 까닭은?",
    "answers": {
      "up": "Cl⁻가 강염기로 작용한다",
      "left": "중화 후 남은 NH₃만이 산으로 작용",
      "right": "염이 전혀 생성되지 않는다",
      "down": "NH₄⁺가 물에 H⁺를 준다"
    },
    "correct": "down",
    "explanation": "NH₄⁺는 약염기 NH₃의 짝산으로 물과 반응하여 H₃O⁺를 형성한다. Cl⁻의 효과는 보통 무시한다.",
    "sourceNote": "Ⅰ-3. 중화적정 · 17쪽"
  },
  {
    "id": "chemistry-depth-053",
    "topic": "염의 가수분해 · 중화점 pH",
    "subject": "화학 · 적용",
    "question": "같은 농도의 NaCl과 CH₃COONa 용액을 25℃에서 비교하면?",
    "answers": {
      "up": "NaCl 중성·CH₃COONa 염기성",
      "left": "둘 다 같은 산성",
      "right": "둘 다 항상 pH 7",
      "down": "NaCl 염기성·CH₃COONa 중성"
    },
    "correct": "up",
    "explanation": "강산·강염기 유래 NaCl의 가수분해는 무시할 수 있다. 아세트산 이온은 물과 반응해 OH⁻를 생성한다.",
    "sourceNote": "Ⅰ-3. 중화적정 · 17쪽"
  },
  {
    "id": "chemistry-depth-054",
    "topic": "염의 가수분해 · 중화점 pH",
    "subject": "화학 · 적용",
    "question": "약산 HA 0.10 M 20 mL를 0.10 M NaOH로 적정했다. 중화량은?",
    "answers": {
      "up": "Ka가 없으면 계산 불가",
      "left": "20 mL",
      "right": "Ka가 작으면 반드시 10 mL",
      "down": "초기 H⁺만큼인 극소량"
    },
    "correct": "left",
    "explanation": "단양성자 약산의 전체 HA가 반응하므로 0.002 mol에 해당하는 NaOH 20 mL가 필요하다. 초기 자유 H⁺만 세지 않는다.",
    "sourceNote": "Ⅰ-3. 중화적정 · 17쪽"
  },
  {
    "id": "chemistry-depth-055",
    "topic": "염의 가수분해 · 중화점 pH",
    "subject": "화학 · 적용",
    "question": "CH₃COOH와 NaOH의 중화점에서 CH₃COO⁻ 농도 계산의 분모는?",
    "answers": {
      "up": "NaOH 부피만",
      "left": "생성된 물의 부피만",
      "right": "산과 NaOH의 전체 부피",
      "down": "초기 산 부피만"
    },
    "correct": "right",
    "explanation": "생성된 아세트산 이온 몰수가 혼합 전체 부피에 분포한다. 부피가 합쳐진다는 조건에서는 두 용액 부피를 더한다.",
    "sourceNote": "Ⅰ-3. 중화적정 · 17쪽"
  },
  {
    "id": "chemistry-depth-056",
    "topic": "염의 가수분해 · 중화점 pH",
    "subject": "화학 · 적용",
    "question": "약산의 짝염기 A⁻가 물과 반응하는 식은?",
    "answers": {
      "up": "A⁻+H₂O⇌HA+H₃O⁺",
      "left": "HA+OH⁻⇌A⁻+H₃O⁺",
      "right": "A⁻⇌A+전자",
      "down": "A⁻+H₂O⇌HA+OH⁻"
    },
    "correct": "down",
    "explanation": "A⁻는 물에서 H⁺를 받아 HA가 되고 물은 OH⁻를 남긴다. 짝염기 가수분해와 산의 이온화 식을 구별한다.",
    "sourceNote": "Ⅰ-3. 중화적정 · 17쪽"
  },
  {
    "id": "chemistry-depth-057",
    "topic": "완충 작용 · 원리와 실험 비교",
    "subject": "화학 · 적용",
    "question": "충분한 양의 두 성분으로 만든 전형적인 완충 조합은?",
    "answers": {
      "up": "CH₃COOH와 CH₃COONa",
      "left": "HCl과 NaCl",
      "right": "NaOH와 NaCl",
      "down": "HCl과 HNO₃"
    },
    "correct": "up",
    "explanation": "약산과 그 짝염기가 함께 있으면 첨가 H⁺와 OH⁻를 각각 소비한다. 강산과 그 염만 섞는 것은 전형적 완충계가 아니다.",
    "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽"
  },
  {
    "id": "chemistry-depth-058",
    "topic": "완충 작용 · 원리와 실험 비교",
    "subject": "화학 · 적용",
    "question": "아세트산/아세트산 이온 완충계에 소량 HCl을 넣었다. 주로 소비하는 성분은?",
    "answers": {
      "up": "용액 속 모든 OH⁻만",
      "left": "CH₃COO⁻",
      "right": "Na⁺",
      "down": "Cl⁻"
    },
    "correct": "left",
    "explanation": "CH₃COO⁻+H⁺→CH₃COOH로 첨가한 산을 소비한다. 약산/짝염기 비는 변하지만 pH 변화가 줄어든다.",
    "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽"
  },
  {
    "id": "chemistry-depth-059",
    "topic": "완충 작용 · 원리와 실험 비교",
    "subject": "화학 · 적용",
    "question": "아세트산/아세트산 이온 완충계에 소량 NaOH를 넣었다. 주로 소비하는 성분은?",
    "answers": {
      "up": "Cl⁻",
      "left": "CH₃COO⁻만",
      "right": "CH₃COOH",
      "down": "Na⁺"
    },
    "correct": "right",
    "explanation": "CH₃COOH+OH⁻→CH₃COO⁻+H₂O로 첨가한 염기를 소비한다. 짝염기만 있고 약산이 없다면 이 경로가 제한된다.",
    "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽"
  },
  {
    "id": "chemistry-depth-060",
    "topic": "완충 작용 · 원리와 실험 비교",
    "subject": "화학 · 적용",
    "question": "완충계의 HA 10 mmol, A⁻ 10 mmol에 HCl 2 mmol을 넣었다. 반응 후 양은?",
    "answers": {
      "up": "HA 8·A⁻ 12 mmol",
      "left": "HA 10·A⁻ 12 mmol",
      "right": "HA 12·A⁻ 10 mmol",
      "down": "HA 12·A⁻ 8 mmol"
    },
    "correct": "down",
    "explanation": "H⁺가 A⁻ 2 mmol을 소비하고 HA 2 mmol을 만든다. 첨가한 강산을 먼저 반응시킨 뒤 남은 완충 성분을 계산한다.",
    "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽"
  },
  {
    "id": "chemistry-depth-061",
    "topic": "완충 작용 · 원리와 실험 비교",
    "subject": "화학 · 적용",
    "question": "완충계의 HA 10 mmol, A⁻ 10 mmol에 NaOH 3 mmol을 넣었다. 반응 후 양은?",
    "answers": {
      "up": "HA 7·A⁻ 13 mmol",
      "left": "HA 13·A⁻ 7 mmol",
      "right": "HA 10·A⁻ 7 mmol",
      "down": "HA 13·A⁻ 10 mmol"
    },
    "correct": "up",
    "explanation": "OH⁻는 HA 3 mmol을 소비하고 A⁻ 3 mmol을 만든다. 양성자 이동과 몰수 보존을 함께 확인한다.",
    "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽"
  },
  {
    "id": "chemistry-depth-062",
    "topic": "완충 작용 · 원리와 실험 비교",
    "subject": "화학 · 적용",
    "question": "HA 1 mmol·A⁻ 1 mmol 완충계에 NaOH 3 mmol을 넣었다. 예상 결과는?",
    "answers": {
      "up": "HA가 4 mmol로 증가",
      "left": "HA 소진 후 OH⁻가 남아 pH 급변",
      "right": "원래 pH가 완전히 유지",
      "down": "A⁻가 OH⁻ 전부를 중화"
    },
    "correct": "left",
    "explanation": "HA가 소비할 수 있는 OH⁻는 1 mmol뿐이다. 2 mmol 과량 OH⁻가 남으므로 완충 용량을 넘어 pH가 크게 변한다.",
    "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽"
  },
  {
    "id": "chemistry-depth-063",
    "topic": "완충 작용 · 원리와 실험 비교",
    "subject": "화학 · 적용",
    "question": "같은 HA:A⁻ 비에서 총농도를 10배 낮추었다. 소량 첨가 전 pH와 완충 용량의 대표 변화는?",
    "answers": {
      "up": "pH 동일·용량 10배 증가",
      "left": "비가 같으면 용량도 항상 같음",
      "right": "pH는 비슷·용량은 감소",
      "down": "pH가 반드시 10배·용량 같음"
    },
    "correct": "right",
    "explanation": "적절한 완충 근사에서 pH는 성분 비에 좌우되어 비슷하지만 반응 가능한 몰수가 줄어 완충 용량은 낮아진다.",
    "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽"
  },
  {
    "id": "chemistry-depth-064",
    "topic": "완충 작용 · 원리와 실험 비교",
    "subject": "화학 · 적용",
    "question": "물·약산·짝염기·완충 혼합물에 같은 양의 산·염기를 넣는다. 완충성을 비교할 지표는?",
    "answers": {
      "up": "처음 pH가 7인지 여부만",
      "left": "산과 염기를 넣은 순서만",
      "right": "초기 pH가 모두 같은지 여부",
      "down": "첨가 전후 pH 변화의 크기"
    },
    "correct": "down",
    "explanation": "완충은 초기 pH가 7인지가 아니라 첨가에 따른 pH 변화가 작은 성질이다. 동일 첨가량·초기 부피 등을 통제한다.",
    "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽"
  },
  {
    "id": "chemistry-depth-065",
    "topic": "완충 작용 · 원리와 실험 비교",
    "subject": "화학 · 적용",
    "question": "HA의 Ka=[H⁺][A⁻]/[HA]다. 완충계에서 [HA]=[A⁻]이면?",
    "answers": {
      "up": "[H⁺]≈Ka",
      "left": "[H⁺]≈1/Ka",
      "right": "pH가 항상 7",
      "down": "[H⁺]가 반드시 0"
    },
    "correct": "up",
    "explanation": "같은 농도 비이면 식에서 [H⁺]≈Ka가 된다. 약산 종류마다 Ka가 다르므로 pH 7로 고정되는 것은 아니다.",
    "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽"
  },
  {
    "id": "chemistry-depth-066",
    "topic": "완충 작용 · 원리와 실험 비교",
    "subject": "화학 · 적용",
    "question": "아세트산/아세트산 이온 완충계에 소량 HCl을 넣었다. 원래 상태와 비교한 변화는?",
    "answers": {
      "up": "HA 소멸·pH 반드시 14",
      "left": "A⁻/HA 감소·pH 소폭 감소",
      "right": "A⁻/HA 증가·pH 소폭 증가",
      "down": "두 성분 양과 pH 모두 정확히 불변"
    },
    "correct": "left",
    "explanation": "A⁻가 H⁺를 받아 HA가 되므로 A⁻/HA가 감소한다. [H⁺]=Ka[HA]/[A⁻] 관계에서 H⁺가 늘어 pH가 소폭 낮아진다.",
    "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽"
  },
  {
    "id": "chemistry-depth-067",
    "topic": "계산 심화 · 평형·적정·완충 검산",
    "subject": "화학 · 적용",
    "question": "A⇌B에서 초기 [A]=1.0 M, [B]=0이고 평형 [B]=0.60 M이다. K는? 부피 일정.",
    "answers": {
      "up": "0.4",
      "left": "2.5",
      "right": "1.5",
      "down": "0.6"
    },
    "correct": "right",
    "explanation": "1:1 반응이므로 평형 [A]=1.0−0.60=0.40 M다. K=[B]/[A]=0.60/0.40=1.5다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 8쪽"
  },
  {
    "id": "chemistry-depth-068",
    "topic": "계산 심화 · 평형·적정·완충 검산",
    "subject": "화학 · 적용",
    "question": "2A⇌B에서 초기 [A]=1.0 M, [B]=0이고 평형 [B]=0.20 M이다. 평형 [A]는?",
    "answers": {
      "up": "0.80 M",
      "left": "0.40 M",
      "right": "0.20 M",
      "down": "0.60 M"
    },
    "correct": "down",
    "explanation": "B 0.20 M 생성에는 A가 계수에 따라 0.40 M 감소한다. 남은 [A]=1.0−0.40=0.60 M다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 8쪽"
  },
  {
    "id": "chemistry-depth-069",
    "topic": "계산 심화 · 평형·적정·완충 검산",
    "subject": "화학 · 적용",
    "question": "A+B⇌C의 평형 농도가 A 0.20 M, B 0.50 M, C 0.40 M다. K는?",
    "answers": {
      "up": "4",
      "left": "0.25",
      "right": "1.1",
      "down": "2"
    },
    "correct": "up",
    "explanation": "K=[C]/([A][B])=0.40/(0.20×0.50)=4다. 평형 농도를 반응식 계수의 지수로 대입한다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 8쪽"
  },
  {
    "id": "chemistry-depth-070",
    "topic": "계산 심화 · 평형·적정·완충 검산",
    "subject": "화학 · 적용",
    "question": "A⇌B의 K=4이다. 초기 A 1.0 M만 넣은 일정 부피 용기에서 평형 [B]는?",
    "answers": {
      "up": "4.0 M",
      "left": "0.80 M",
      "right": "0.20 M",
      "down": "0.25 M"
    },
    "correct": "left",
    "explanation": "[B]=x이면 [A]=1−x다. x/(1−x)=4를 풀면 5x=4에서 x=0.80 M다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 8쪽"
  },
  {
    "id": "chemistry-depth-071",
    "topic": "계산 심화 · 평형·적정·완충 검산",
    "subject": "화학 · 적용",
    "question": "HA 0.10 M, Ka=10⁻⁵에서 물 이온화를 무시하고 x≪C 근사한다. [H⁺]와 근사 이온화율은?",
    "answers": {
      "up": "10⁻² M·10%",
      "left": "10⁻⁶ M·1%",
      "right": "10⁻³ M·1%",
      "down": "10⁻⁵ M·0.01%"
    },
    "correct": "right",
    "explanation": "x≈√(KaC)=√10⁻⁶=10⁻³ M이고 x/C=0.01=1%다. 5% 기준에서도 근사가 타당하다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 8쪽"
  },
  {
    "id": "chemistry-depth-072",
    "topic": "계산 심화 · 평형·적정·완충 검산",
    "subject": "화학 · 적용",
    "question": "25℃에서 [H⁺]=2×10⁻³ M이다. log₁₀2=0.301일 때 pH는?",
    "answers": {
      "up": "3.301",
      "left": "0.301",
      "right": "11.301",
      "down": "2.699"
    },
    "correct": "down",
    "explanation": "−log(2×10⁻³)=3−log2=2.699다. 계수 2의 로그를 생략하면 정확한 pH와 다르다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 8쪽"
  },
  {
    "id": "chemistry-depth-073",
    "topic": "계산 심화 · 평형·적정·완충 검산",
    "subject": "화학 · 적용",
    "question": "NaOH 사용량 19.8, 20.0, 20.2 mL의 평균은? 세 값 모두 유효하다.",
    "answers": {
      "up": "20.0 mL",
      "left": "20.2 mL",
      "right": "19.8 mL",
      "down": "60.0 mL"
    },
    "correct": "up",
    "explanation": "세 값의 합 60.0 mL를 3으로 나누면 20.0 mL다. 유효한 반복값을 평균하고 이상치 여부는 별도 기준으로 판단한다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 8쪽"
  },
  {
    "id": "chemistry-depth-074",
    "topic": "계산 심화 · 평형·적정·완충 검산",
    "subject": "화학 · 적용",
    "question": "아세트산 원액 농도 0.80 M, 몰질량 60 g/mol, 밀도 1.0 g/mL다. 질량 백분율은?",
    "answers": {
      "up": "8.0%",
      "left": "4.8%",
      "right": "48%",
      "down": "0.48%"
    },
    "correct": "left",
    "explanation": "1 L 용액의 질량은 1000 g이고 아세트산은 0.80×60=48 g이다. 48/1000×100=4.8%다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 8쪽"
  },
  {
    "id": "chemistry-depth-075",
    "topic": "계산 심화 · 평형·적정·완충 검산",
    "subject": "화학 · 적용",
    "question": "25℃에서 0.10 M HCl 10 mL에 0.10 M NaOH 20 mL를 넣었다. 남은 OH⁻ 농도는?",
    "answers": {
      "up": "1/20 M",
      "left": "1/10 M",
      "right": "1/30 M",
      "down": "0.10 M"
    },
    "correct": "right",
    "explanation": "OH⁻ 과량은 0.002−0.001=0.001 mol이다. 전체 0.030 L로 나누면 1/30 M다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 8쪽"
  },
  {
    "id": "chemistry-depth-076",
    "topic": "계산 심화 · 평형·적정·완충 검산",
    "subject": "화학 · 적용",
    "question": "완충계 Ka=10⁻⁵, [HA]/[A⁻]=2다. 주어진 Ka 관계에서 [H⁺]는?",
    "answers": {
      "up": "5×10⁻⁶ M",
      "left": "10⁻⁵ M",
      "right": "2×10⁵ M",
      "down": "2×10⁻⁵ M"
    },
    "correct": "down",
    "explanation": "Ka=[H⁺][A⁻]/[HA]이므로 [H⁺]=Ka[HA]/[A⁻]=2×10⁻⁵ M다. 비를 뒤집으면 반대 결과가 나온다.",
    "sourceNote": "Ⅰ-0. 화학평형 · 8쪽"
  }
];
export const chemistryWritten: WrittenQuestion[] = [
  {
    "id": "chemistry-depth-written-001",
    "topic": "화학 평형 · K·Q·이동",
    "question": "평형에서 농도가 일정하지만 반응이 멈추지 않는 이유를 설명하고, 촉매와 온도 변화가 K에 미치는 영향을 비교하시오.",
    "modelAnswer": "평형에서는 정반응과 역반응이 계속 진행하되 속도가 같아 순변화가 0이므로 농도가 일정하다. 촉매는 평형 도달을 빠르게 하지만 같은 온도의 K를 바꾸지 않는다. 온도 변화는 반응의 열적 성질에 따라 K를 바꿀 수 있다.",
    "criteria": [
      "동적 평형과 같은 속도",
      "촉매와 K 불변",
      "온도와 K 변화"
    ],
    "sourceNote": "Ⅰ-0. 화학평형 · 7쪽"
  },
  {
    "id": "chemistry-depth-written-002",
    "topic": "평형 실험 · 색 변화와 조작",
    "question": "주황 Cr₂O₇²⁻와 노랑 CrO₄²⁻의 평형에 산·염기를 첨가할 때의 변화를 H⁺와 반응 방향으로 설명하시오.",
    "modelAnswer": "Cr₂O₇²⁻+H₂O⇌2CrO₄²⁻+2H⁺에서 산을 넣으면 H⁺가 증가해 역반응으로 주황 이온이 늘어난다. 염기의 OH⁻는 H⁺를 소비하므로 정반응이 유리해져 노랑 이온이 늘어난다. 일정 온도에서 이 농도 조작은 K를 바꾸지 않는다.",
    "criteria": [
      "산·역반응·주황",
      "OH⁻ 소비·정반응·노랑",
      "일정 온도의 K 유지"
    ],
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-written-003",
    "topic": "평형 실험 · 색 변화와 조작",
    "question": "흡열인 코발트 착물 평형에서 CaCl₂ 첨가·물 희석·가열·냉각의 색 변화와 K 변화 여부를 비교하시오.",
    "modelAnswer": "분홍 착물+4Cl⁻⇌파랑 착물+6H₂O에서 CaCl₂ 첨가는 Cl⁻를 늘려 파랑 쪽으로, 물 희석은 이온 농도 감소로 분홍 쪽으로 이동한다. 흡열 정반응이므로 가열은 파랑, 냉각은 분홍 쪽이다. 같은 온도의 첨가·희석은 K를 바꾸지 않고 온도 변화는 K도 바꿀 수 있다.",
    "criteria": [
      "첨가·희석 색 변화",
      "흡열과 가열·냉각",
      "농도 조작과 온도의 K 차이"
    ],
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-written-004",
    "topic": "산·염기 · 짝과 세기·pH",
    "question": "0.010 M 약산에 대해 x≈0.0030 M을 얻었다. 5% 규칙으로 타당성을 평가하고, 근사가 실패하면 어떤 평형식을 풀어야 하는지 쓰시오.",
    "modelAnswer": "이온화율 x/C×100=30%로 5%를 넘으므로 C−x≈C 근사는 부적절하다. 물의 이온화를 무시한다는 조건에서 평형 농도는 HA가 C−x, H₃O⁺와 A⁻가 x이므로 Ka=x²/(C−x)를 이차식으로 풀어 양의 물리적 해를 선택한다.",
    "criteria": [
      "30% 계산",
      "5% 초과로 근사 부적절",
      "정확한 평형식과 양의 해"
    ],
    "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽"
  },
  {
    "id": "chemistry-depth-written-005",
    "topic": "중화 반응 · 몰수·희석·혼합",
    "question": "아세트산 시료를 정량 취한 뒤 물을 추가하는 경우와 원액 자체를 희석한 뒤 같은 부피를 취하는 경우, NaOH 적정량이 어떻게 달라지는지 설명하시오.",
    "modelAnswer": "정량 취한 시료에 물만 추가하면 산 몰수가 같아 같은 농도 NaOH의 적정량도 같다. 원액 자체를 희석한 뒤 같은 부피를 취하면 단위 부피의 산 몰수가 줄어 필요한 NaOH가 감소한다. 농도 변화와 취한 산의 몰수 변화를 구별해야 한다.",
    "criteria": [
      "정량 시료 물 추가의 몰수 보존",
      "희석 후 같은 부피의 몰수 감소",
      "농도와 몰수 구별"
    ],
    "sourceNote": "Ⅰ-0. 화학 중화반응 · 3쪽"
  },
  {
    "id": "chemistry-depth-written-006",
    "topic": "적정 실험 · 그래프와 오차",
    "question": "미지 아세트산 20.0 mL에 0.100 M NaOH를 적정했다. 초기 눈금 1.20 mL, 최종 23.20 mL일 때 농도를 계산하고 종말점 초과의 오차 방향을 설명하시오.",
    "modelAnswer": "사용량은 23.20−1.20=22.00 mL다. 1:1 반응이므로 아세트산 몰수는 0.100×0.02200=0.002200 mol, 농도는 0.002200/0.0200=0.110 M다. 종말점을 지나 넣은 NaOH까지 사용량으로 잡으면 산 몰수와 농도를 과대 추정한다.",
    "criteria": [
      "눈금 차 22.00 mL",
      "0.110 M 계산",
      "초과 사용량과 과대 추정"
    ],
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-written-007",
    "topic": "적정 실험 · 그래프와 오차",
    "question": "물에 젖은 피펫·물에 젖은 뷰렛·정량 취한 산이 든 물에 젖은 플라스크의 세 경우가 미지 산 농도 계산에 미치는 영향을 비교하시오.",
    "modelAnswer": "산으로 헹구지 않은 피펫 속 물은 취한 산 몰수를 줄여 원액 농도를 과소 추정하게 한다. NaOH로 헹구지 않은 뷰렛 속 물은 표준용액을 희석해 사용량을 늘려 원래 농도로 계산하면 과대 추정한다. 정량 취한 산이 든 플라스크 속 물은 산 몰수를 바꾸지 않아 이상적인 적정 결과에 영향이 없다.",
    "criteria": [
      "피펫 과소와 몰수 감소",
      "뷰렛 과대와 희석",
      "플라스크 몰수 보존"
    ],
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-written-008",
    "topic": "적정 실험 · 그래프와 오차",
    "question": "적정 곡선을 그릴 때 중화점 부근의 부피 간격, 교반, pH 센서 위치를 어떻게 관리하는지 이유와 함께 설명하시오.",
    "modelAnswer": "중화점 부근은 적은 첨가량에도 pH가 크게 변하므로 부피 간격을 작게 한다. NaOH를 넣은 뒤 충분히 저어 국소 농도 차이를 줄이고 센서 응답이 안정된 뒤 기록한다. 센서가 비커 바닥이나 자석 교반기에 닿지 않게 해 파손과 측정 불안정을 줄인다.",
    "criteria": [
      "중화점 근처 작은 간격",
      "교반·응답 안정",
      "센서 접촉 방지"
    ],
    "sourceNote": "실험 정리 · 1쪽"
  },
  {
    "id": "chemistry-depth-written-009",
    "topic": "염의 가수분해 · 중화점 pH",
    "question": "아세트산·NaOH 적정과 NH₃·HCl 적정의 중화점 pH가 다른 이유를 생성 염과 가수분해 반응으로 설명하시오.",
    "modelAnswer": "아세트산·NaOH에서는 CH₃COO⁻가 생겨 CH₃COO⁻+H₂O⇌CH₃COOH+OH⁻로 염기성을 나타낸다. NH₃·HCl에서는 NH₄⁺가 생겨 NH₄⁺+H₂O⇌NH₃+H₃O⁺로 산성을 나타낸다. 중화점은 화학량론적 반응 기준이며 항상 pH 7을 뜻하지 않는다.",
    "criteria": [
      "아세트산 이온과 OH⁻",
      "암모늄 이온과 H₃O⁺",
      "중화점과 pH 7 구별"
    ],
    "sourceNote": "Ⅰ-3. 중화적정 · 17쪽"
  },
  {
    "id": "chemistry-depth-written-010",
    "topic": "완충 작용 · 원리와 실험 비교",
    "question": "HA와 A⁻가 각각 10 mmol인 완충계에 HCl 2 mmol 또는 NaOH 3 mmol을 따로 넣었다. 각 최종 몰수와 pH 변화 방향을 설명하시오.",
    "modelAnswer": "HCl은 A⁻ 2 mmol을 소비해 HA 12 mmol, A⁻ 8 mmol이 되어 pH가 소폭 감소한다. NaOH는 HA 3 mmol을 소비해 HA 7 mmol, A⁻ 13 mmol이 되어 pH가 소폭 증가한다. 완충은 변화가 작다는 뜻이며 pH가 정확히 불변한다는 뜻은 아니다.",
    "criteria": [
      "산 첨가 후 12·8",
      "염기 첨가 후 7·13",
      "pH 방향과 불변 오해 구별"
    ],
    "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽"
  },
  {
    "id": "chemistry-depth-written-011",
    "topic": "완충 작용 · 원리와 실험 비교",
    "question": "증류수·아세트산·아세트산 나트륨·두 성분의 혼합물에 산과 염기를 넣어 비교하는 실험을 설계하시오. 통제 조건과 완충 판단 기준을 포함하시오.",
    "modelAnswer": "각 용액의 초기 부피와 첨가하는 산·염기의 농도·부피, 온도, 교반과 pH 기록 조건을 같게 한다. 산 첨가군과 염기 첨가군은 별도로 준비해 초기 pH와 첨가 후 안정 pH의 차이를 비교한다. 두 성분이 함께 있는 용액이 두 첨가에서 작은 pH 변화를 보이는지 확인하며 초기 pH 7 여부를 기준으로 삼지 않는다.",
    "criteria": [
      "동일 부피·첨가량·측정 조건",
      "산·염기 별도 비교",
      "pH 변화량으로 판단"
    ],
    "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽"
  },
  {
    "id": "chemistry-depth-written-012",
    "topic": "계산 심화 · 평형·적정·완충 검산",
    "question": "A⇌B의 K=4인 일정 부피 용기에 A만 1.0 M 넣었다. 초기·변화·평형 농도를 적고 평형 농도를 계산하시오.",
    "modelAnswer": "초기 농도는 A=1.0 M, B=0이다. 변화는 A=−x, B=+x이므로 평형 농도는 A=1−x, B=x다. K=x/(1−x)=4에서 x=0.80 M를 얻어 A=0.20 M, B=0.80 M다. 농도 합 1.0 M와 K=4를 다시 확인한다.",
    "criteria": [
      "초기·변화·평형 기록",
      "K 식과 x 계산",
      "0.20·0.80 M 검산"
    ],
    "sourceNote": "Ⅰ-0. 화학평형 · 8쪽"
  },
  {
    "id": "chemistry-depth-written-013",
    "topic": "계산 심화 · 평형·적정·완충 검산",
    "question": "10배 희석한 식초 20 mL에 0.10 M NaOH 16 mL가 중화량이었다. 원액 몰농도와 질량 백분율을 구하시오. 밀도 1.0 g/mL, 아세트산 몰질량 60 g/mol.",
    "modelAnswer": "희석액의 산 몰수는 0.10×0.016=0.0016 mol이고 농도는 0.0016/0.020=0.080 M다. 원액은 10배인 0.80 M다. 원액 1 L에 아세트산 48 g이 들어 있고 용액 질량은 1000 g이므로 질량 백분율은 4.8%다.",
    "criteria": [
      "희석액 0.080 M",
      "원액 0.80 M",
      "밀도 반영 4.8%"
    ],
    "sourceNote": "Ⅰ-0. 화학평형 · 8쪽"
  }
];
