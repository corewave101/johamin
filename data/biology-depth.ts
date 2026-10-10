import type { SwipeCard } from './swipe-cards';
import type { WrittenQuestion } from './biology-written';
export const parkDepthCards: SwipeCard[] = [
  {
    "id": "biology-park-depth-001",
    "topic": "심화 · HGP·SNP·GWAS",
    "subject": "박상영T · 심화",
    "question": "환자와 대조군의 수많은 SNP 빈도를 비교해 질병과 연관된 위치를 찾았다. 이에 해당하는 연구는?",
    "answers": {
      "up": "GWAS",
      "left": "한 개체의 핵형 분석",
      "right": "단백질 분해 실험",
      "down": "유전자 발현량만 측정"
    },
    "correct": "up",
    "explanation": "GWAS는 집단에서 유전체 전반의 유전 변이와 형질 간 연관을 조사한다. 핵형 분석은 염색체 수와 구조를 확인한다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-002",
    "topic": "심화 · HGP·SNP·GWAS",
    "subject": "박상영T · 심화",
    "question": "HGP와 GWAS를 비교한 설명 중 옳은 것은?",
    "answers": {
      "up": "GWAS는 모든 SNP의 인과성을 증명",
      "left": "HGP는 서열, GWAS는 형질 연관 조사",
      "right": "HGP는 질병 확진, GWAS는 염색체 계수",
      "down": "HGP와 GWAS는 모두 한 가계만 조사"
    },
    "correct": "left",
    "explanation": "HGP는 인간 유전체의 지도와 서열을 구축한 프로젝트다. GWAS의 통계적 연관 결과만으로 원인 변이를 확정할 수 없다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-003",
    "topic": "심화 · HGP·SNP·GWAS",
    "subject": "박상영T · 심화",
    "question": "두 사람의 같은 DNA 위치가 각각 A와 G다. 이 차이가 집단에서 관찰되는 한 염기 다형성이면?",
    "answers": {
      "up": "염색체 비분리",
      "left": "전좌",
      "right": "SNP",
      "down": "염색체 역위"
    },
    "correct": "right",
    "explanation": "한 염기 위치에서 관찰되는 다형성은 SNP다. 큰 염색체 구간의 방향이나 개수 변화와 구별한다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-004",
    "topic": "심화 · HGP·SNP·GWAS",
    "subject": "박상영T · 심화",
    "question": "GWAS에서 p=10⁻⁹인 SNP A와 p=10⁻⁶인 SNP B의 맨해튼 플롯 높이를 비교하면?",
    "answers": {
      "up": "B가 3 높다",
      "left": "A와 B의 높이가 같다",
      "right": "A가 B의 1000배 높다",
      "down": "A가 3 높다"
    },
    "correct": "down",
    "explanation": "세로축 −log₁₀(p)는 A에서 9, B에서 6이다. 따라서 높이 차는 3이며 p의 비와 높이의 비를 혼동하지 않는다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-005",
    "topic": "심화 · HGP·SNP·GWAS",
    "subject": "박상영T · 심화",
    "question": "한 GWAS의 기준이 p<5×10⁻⁸이다. 유의한 결과에 해당하는 것은?",
    "answers": {
      "up": "p=2×10⁻⁹",
      "left": "p=8×10⁻⁸",
      "right": "p=10⁻⁶",
      "down": "p=0.01"
    },
    "correct": "up",
    "explanation": "2×10⁻⁹만 주어진 기준보다 작다. 유의성 기준은 문제의 조건을 따르며 p가 작다고 효과 크기가 큰 것은 아니다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-006",
    "topic": "심화 · HGP·SNP·GWAS",
    "subject": "박상영T · 심화",
    "question": "맨해튼 플롯의 한 봉우리가 매우 높다. 이 결과만으로 확정할 수 없는 것은?",
    "answers": {
      "up": "기준 초과 여부를 확인할 수 있다",
      "left": "해당 SNP가 직접 질병을 일으킨다",
      "right": "해당 SNP의 p값이 작다",
      "down": "그 위치에 연관 신호가 있다"
    },
    "correct": "left",
    "explanation": "연관된 SNP가 원인 변이 근처의 표지자일 수 있다. 인과성은 후속 기능 연구와 독립 검증이 필요하다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-007",
    "topic": "심화 · HGP·SNP·GWAS",
    "subject": "박상영T · 심화",
    "question": "GWAS에서 같은 SNP의 p가 더 작게 나왔다. 이에 대한 옳은 해석은?",
    "answers": {
      "up": "효과 크기가 반드시 더 크다",
      "left": "모든 보유자가 질병에 걸린다",
      "right": "연관의 통계적 근거가 더 강하다",
      "down": "질병 발생 확률이 p와 같다"
    },
    "correct": "right",
    "explanation": "p값은 귀무가설 아래의 통계적 근거와 관련된다. 개인의 발병 확률이나 효과 크기를 직접 나타내지 않는다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-008",
    "topic": "심화 · HGP·SNP·GWAS",
    "subject": "박상영T · 심화",
    "question": "서로 다른 집단을 섞은 GWAS에서 SNP와 질병이 연관됐다. 집단 구성 차이를 점검하는 이유는?",
    "answers": {
      "up": "집단을 섞으면 SNP가 사라진다",
      "left": "혼합 집단에는 염색체가 없다",
      "right": "p값은 항상 정확히 0이 된다",
      "down": "집단 차이가 가짜 연관을 만들 수 있다"
    },
    "correct": "down",
    "explanation": "집단별 대립유전자 빈도와 질병 빈도가 다르면 혼합 자체가 연관처럼 보일 수 있다. 독립 재현과 집단 구조 점검이 필요하다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-009",
    "topic": "심화 · HGP·SNP·GWAS",
    "subject": "박상영T · 심화",
    "question": "같은 SNP 위치에서 환자 100명 중 A 대립유전자 보유자는 60명, 대조군 100명 중에는 30명이다. 타당한 결론은?",
    "answers": {
      "up": "표본에서 A 보유와 질병이 연관된다",
      "left": "A가 질병의 유일한 원인이다",
      "right": "A를 가진 사람은 모두 환자다",
      "down": "A가 없으면 질병에 걸리지 않는다"
    },
    "correct": "up",
    "explanation": "표본의 보유율 차이는 연관의 단서다. 이 수치만으로 원인·충분조건·필요조건을 확정할 수 없다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-010",
    "topic": "심화 · HGP·SNP·GWAS",
    "subject": "박상영T · 심화",
    "question": "한 사람의 SNP A 보유 여부만으로 다인자 질환을 확진할 수 없다는 설명의 근거는?",
    "answers": {
      "up": "SNP는 언제나 단백질을 제거한다",
      "left": "다른 유전 요인과 환경도 관여한다",
      "right": "모든 SNP는 염색체 밖에 있다",
      "down": "다인자 질환에는 유전 요인이 없다"
    },
    "correct": "left",
    "explanation": "다인자 형질에는 여러 유전 요인과 환경이 함께 영향을 준다. 연관 SNP 한 개는 확진 도구와 같지 않다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-011",
    "topic": "심화 · 키아즈마·교차·연관",
    "subject": "박상영T · 심화",
    "question": "감수 1분열 전기의 교차가 일반적으로 일어나는 두 구조는?",
    "answers": {
      "up": "서로 다른 세포의 염색체",
      "left": "mRNA와 tRNA",
      "right": "상동염색체의 비자매염색분체",
      "down": "같은 염색체의 두 자매염색분체"
    },
    "correct": "right",
    "explanation": "상동염색체가 접합한 뒤 비자매염색분체 사이에서 DNA 구간을 교환한다. 자매염색분체의 단순 복제와 구별한다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-012",
    "topic": "심화 · 키아즈마·교차·연관",
    "subject": "박상영T · 심화",
    "question": "키아즈마를 교차와 연결한 설명 중 옳은 것은?",
    "answers": {
      "up": "DNA 복제가 시작되는 모든 위치",
      "left": "자매염색분체의 동원체만 지칭",
      "right": "비상동염색체 구간 교환 부위",
      "down": "교차 결과 상동염색체가 연결된 부위"
    },
    "correct": "down",
    "explanation": "키아즈마는 교차의 결과로 관찰되는 상동염색체의 연결 부위이며 감수 1분열의 적절한 분리에 기여한다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-013",
    "topic": "심화 · 키아즈마·교차·연관",
    "subject": "박상영T · 심화",
    "question": "교차가 유전적 다양성을 높이는 주된 까닭은?",
    "answers": {
      "up": "기존 대립유전자의 조합을 바꾼다",
      "left": "염색체 수를 반드시 두 배로 늘린다",
      "right": "모든 유전자의 염기서열을 새로 만든다",
      "down": "각 생식세포의 DNA를 없앤다"
    },
    "correct": "up",
    "explanation": "정상적인 교차는 대응하는 DNA 구간을 교환해 새로운 대립유전자 조합을 만든다. 새 대립유전자 생성과 구별한다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-014",
    "topic": "심화 · 키아즈마·교차·연관",
    "subject": "박상영T · 심화",
    "question": "AB/ab인 상동염색체의 네 염색분체 중 두 비자매염색분체만 A와 B 사이에서 한 번 교차했다. 생성 가능한 네 산물은?",
    "answers": {
      "up": "AA·BB·aa·bb",
      "left": "AB·ab·Ab·aB",
      "right": "AB·AB·ab·ab",
      "down": "Ab·Ab·aB·aB"
    },
    "correct": "left",
    "explanation": "교차에 참여하지 않은 두 염색분체는 AB와 ab다. 참여한 두 염색분체는 Ab와 aB가 되어 한 감수분열에서 재조합형이 둘 나온다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-015",
    "topic": "심화 · 키아즈마·교차·연관",
    "subject": "박상영T · 심화",
    "question": "AB/ab 개체를 ab/ab와 검정교배했다. AB:420, ab:380, Ab:100, aB:100이면 재조합률은?",
    "answers": {
      "up": "40%",
      "left": "80%",
      "right": "20%",
      "down": "10%"
    },
    "correct": "right",
    "explanation": "재조합형은 Ab와 aB로 200개이며 전체 1000개다. 200/1000×100=20%다. 한 재조합형만 세지 않는다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-016",
    "topic": "심화 · 키아즈마·교차·연관",
    "subject": "박상영T · 심화",
    "question": "Ab/aB 개체를 ab/ab와 검정교배했다. 가장 많은 두 자손형이 Ab와 aB라면 부모형은?",
    "answers": {
      "up": "AB와 ab",
      "left": "AB와 aB",
      "right": "Ab와 ab",
      "down": "Ab와 aB"
    },
    "correct": "down",
    "explanation": "부모형은 이형접합 부모가 가진 대립유전자 조합이다. 같은 AaBb라도 연관 배열에 따라 부모형이 달라진다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-017",
    "topic": "심화 · 키아즈마·교차·연관",
    "subject": "박상영T · 심화",
    "question": "AB/ab 개체의 재조합률이 12%다. 생식세포 비율이 대칭이면 Ab 생식세포의 비율은?",
    "answers": {
      "up": "6%",
      "left": "12%",
      "right": "44%",
      "down": "88%"
    },
    "correct": "up",
    "explanation": "재조합형 Ab와 aB가 합쳐 12%이므로 각 6%다. 부모형 AB와 ab는 각각 44%다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-018",
    "topic": "심화 · 키아즈마·교차·연관",
    "subject": "박상영T · 심화",
    "question": "AB/ab 개체가 교차 없이 감수분열하고 두 유전자는 완전 연관되어 있다. 가능한 생식세포는?",
    "answers": {
      "up": "AA와 bb",
      "left": "AB와 ab",
      "right": "AB·Ab·aB·ab",
      "down": "Ab와 aB"
    },
    "correct": "left",
    "explanation": "동일 염색체에 있는 두 유전자의 조합은 교차가 없으면 유지된다. 서로 다른 염색체에 있는 독립 분리와 구별한다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-019",
    "topic": "심화 · 키아즈마·교차·연관",
    "subject": "박상영T · 심화",
    "question": "서로 다른 염색체의 A/a와 B/b가 독립적으로 분리된다. 가능한 생식세포 조합 수는?",
    "answers": {
      "up": "8",
      "left": "16",
      "right": "4",
      "down": "2"
    },
    "correct": "right",
    "explanation": "두 상동염색체 쌍의 독립적 분리로 AB, Ab, aB, ab가 가능하다. 이 다양성은 두 좌위 사이 교차 없이도 생긴다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-020",
    "topic": "심화 · 키아즈마·교차·연관",
    "subject": "박상영T · 심화",
    "question": "교차와 돌연변이의 차이를 옳게 설명한 것은?",
    "answers": {
      "up": "교차는 반드시 염색체 수를 바꾼다",
      "left": "돌연변이는 기존 조합만 섞는다",
      "right": "두 과정은 모두 번역에서만 일어난다",
      "down": "교차는 조합, 돌연변이는 변이를 바꾼다"
    },
    "correct": "down",
    "explanation": "정상적인 교차는 기존 변이의 조합을 바꾸며 돌연변이는 서열이나 염색체에 새로운 변화를 만든다. 불균등 교차 같은 예외는 구별한다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-021",
    "topic": "심화 · 키아즈마·교차·연관",
    "subject": "박상영T · 심화",
    "question": "한 감수분열에서 상동염색체 쌍의 두 비자매염색분체가 한 번 교차했다. 재조합형 염색분체 수는?",
    "answers": {
      "up": "2개",
      "left": "1개",
      "right": "3개",
      "down": "4개"
    },
    "correct": "up",
    "explanation": "4개의 염색분체 중 교차에 참여한 2개만 해당 구간에서 재조합형이 된다. 개체군 전체 재조합률과 한 세포의 산물을 구별한다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-022",
    "topic": "심화 · 키아즈마·교차·연관",
    "subject": "박상영T · 심화",
    "question": "두 유전자 사이 다중 교차를 고려하지 않고 재조합형 비율만 지도 거리로 삼았다. 생길 수 있는 문제는?",
    "answers": {
      "up": "교차가 돌연변이로 바뀐다",
      "left": "실제 교차 거리를 과소 추정한다",
      "right": "재조합률이 항상 100%가 된다",
      "down": "부모형이 모두 소멸한다"
    },
    "correct": "left",
    "explanation": "이중 교차 중 일부는 양 끝 표지자의 부모형 조합을 회복시킨다. 따라서 관찰 재조합형만 세면 교차 사건을 놓칠 수 있다.",
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-023",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "subject": "박상영T · 심화",
    "question": "멘델 연구의 1865년과 1866년을 올바르게 구별한 것은?",
    "answers": {
      "up": "1865 재발견·1866 최초 발표",
      "left": "1865 염색체설·1866 성연관 발견",
      "right": "1865 발표·1866 논문 출판",
      "down": "1865 DNA 발견·1866 복제 증명"
    },
    "correct": "right",
    "explanation": "멘델은 1865년 연구를 발표하고 1866년 논문을 출판했다. 발표와 출판을 같은 사건으로 뭉뚱그리지 않는다.",
    "sourceNote": "박상영T 필기 · 연혁 공식 자료 대조 · 1쪽"
  },
  {
    "id": "biology-park-depth-024",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "subject": "박상영T · 심화",
    "question": "1900년에 멘델 연구를 재발견한 인물 묶음은?",
    "answers": {
      "up": "서턴·보베리·모건",
      "left": "그리피스·에이버리·체이스",
      "right": "왓슨·크릭·프랭클린",
      "down": "드브리스·코렌스·체르마크"
    },
    "correct": "down",
    "explanation": "1900년 멘델 연구의 재발견은 드브리스, 코렌스, 체르마크와 연결된다. 다른 묶음은 염색체·DNA 연구와 관련된다.",
    "sourceNote": "박상영T 필기 · 연혁 공식 자료 대조 · 1쪽"
  },
  {
    "id": "biology-park-depth-025",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "subject": "박상영T · 심화",
    "question": "감수분열 때 상동염색체 분리와 멘델의 분리 법칙을 연결한 연구는?",
    "answers": {
      "up": "서턴·보베리의 염색체설",
      "left": "그리피스의 형질전환",
      "right": "허시·체이스의 동위원소 실험",
      "down": "왓슨·크릭의 이중 나선 모형"
    },
    "correct": "up",
    "explanation": "1902~1903년 염색체설은 유전인자의 전달과 감수분열의 염색체 행동을 연결한다. DNA의 화학적 정체를 밝힌 실험과 다르다.",
    "sourceNote": "박상영T 필기 · 연혁 공식 자료 대조 · 1쪽"
  },
  {
    "id": "biology-park-depth-026",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "subject": "박상영T · 심화",
    "question": "모건의 흰눈 초파리 성연관 유전 결과가 발표된 연도는?",
    "answers": {
      "up": "1952년",
      "left": "1910년",
      "right": "1900년",
      "down": "1928년"
    },
    "correct": "left",
    "explanation": "흰눈 초파리 성연관 결과는 1910년에 발표됐다. 필기의 1905 표기는 이 사건의 발표 연도와 구별해 기억한다.",
    "sourceNote": "박상영T 필기 · 연혁 공식 자료 대조 · 1쪽"
  },
  {
    "id": "biology-park-depth-027",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "subject": "박상영T · 심화",
    "question": "그리피스 1928 → 에이버리 연구진 1944의 순서를 설명한 것은?",
    "answers": {
      "up": "동위원소 추적 → 형질전환 발견",
      "left": "DNA 복제 → 멘델 법칙 재발견",
      "right": "현상 발견 → 물질의 정체 확인",
      "down": "이중 나선 → 염색체설"
    },
    "correct": "right",
    "explanation": "그리피스는 형질전환을 관찰했고 에이버리 연구진은 효소 처리 등으로 형질전환 물질이 DNA라는 근거를 얻었다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-depth-028",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "subject": "박상영T · 심화",
    "question": "살아 있는 R형과 가열 사멸 S형을 섞어 주입한 생쥐에서 살아 있는 S형이 검출됐다. 그리피스의 결론은?",
    "answers": {
      "up": "사멸 S형이 단순히 되살아났다",
      "left": "단백질이 유전물질임을 확정했다",
      "right": "RNA가 유전물질임을 확정했다",
      "down": "R형이 형질전환되었다"
    },
    "correct": "down",
    "explanation": "죽은 S형에서 유래한 물질이 살아 있는 R형의 유전적 성질을 바꿨다. 이 실험만으로 그 물질을 DNA로 확정하지 않았다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-depth-029",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "subject": "박상영T · 심화",
    "question": "S형 추출물에 단백질 분해효소나 RNase를 넣어도 형질전환되지만 DNase에서는 안 된다. 핵심 결론은?",
    "answers": {
      "up": "DNA가 형질전환에 필요하다",
      "left": "단백질이 형질전환의 유일 원인이다",
      "right": "효소 종류와 결과는 무관하다",
      "down": "RNA 분해가 DNA를 만들었다"
    },
    "correct": "up",
    "explanation": "단백질과 RNA를 분해해도 활성이 남지만 DNA를 분해하면 사라지므로 DNA가 형질전환에 필요한 물질이라는 근거다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-depth-030",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "subject": "박상영T · 심화",
    "question": "에이버리 실험의 효소 처리군을 비교하려면 함께 필요한 대조 조건은?",
    "answers": {
      "up": "모든 처리군을 다른 온도로 배양",
      "left": "동일 추출물의 효소 무처리군",
      "right": "다른 세균의 염색체 수",
      "down": "생쥐의 털 색"
    },
    "correct": "left",
    "explanation": "효소 무처리군에서 형질전환이 가능함을 확인하고 다른 조건을 일정하게 해야 효소 처리 효과를 비교할 수 있다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-depth-031",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "subject": "박상영T · 심화",
    "question": "허시·체이스 실험에서 DNA와 단백질의 표지에 각각 사용한 것은?",
    "answers": {
      "up": "둘 다 ³⁵S",
      "left": "둘 다 ³²P",
      "right": "³²P와 ³⁵S",
      "down": "³⁵S와 ³²P"
    },
    "correct": "right",
    "explanation": "DNA의 인산기에 인이 있고 일반적인 DNA에는 황이 없다. 단백질의 황 함유 아미노산은 ³⁵S로 추적한다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-depth-032",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "subject": "박상영T · 심화",
    "question": "허시·체이스 실험에서 세균을 감염시킨 뒤 교반하는 주된 목적은?",
    "answers": {
      "up": "DNA를 아미노산으로 분해한다",
      "left": "세균을 모두 사멸시킨다",
      "right": "동위원소를 서로 바꾼다",
      "down": "세균 표면의 파지 껍질을 분리한다"
    },
    "correct": "down",
    "explanation": "교반으로 세균 표면에 남은 파지 단백질 껍질을 떼어낸 뒤 원심분리하여 세균과 껍질의 표지 분포를 비교한다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-depth-033",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "subject": "박상영T · 심화",
    "question": "파지 감염·교반·원심분리 후 세균 침전에서 주로 검출된 표지는?",
    "answers": {
      "up": "³²P",
      "left": "³⁵S",
      "right": "두 표지가 항상 같은 비율",
      "down": "방사성 표지가 전혀 없음"
    },
    "correct": "up",
    "explanation": "DNA에 표지한 ³²P가 세균 침전에 주로 나타나며 단백질에 표지한 ³⁵S는 상층액에 주로 남는다. 결과는 절대 100%로 단정하지 않는다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-depth-034",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "subject": "박상영T · 심화",
    "question": "1953년 DNA 이중 나선 모형의 근거와 관련 인물 연결은?",
    "answers": {
      "up": "서턴의 파지 동위원소 표지",
      "left": "프랭클린·윌킨스의 X선 연구",
      "right": "그리피스의 mRNA 코돈표",
      "down": "멘델의 세균 원심분리"
    },
    "correct": "left",
    "explanation": "왓슨·크릭의 구조 모형에는 샤가프의 염기 조성 및 프랭클린·윌킨스의 X선 연구 등이 근거가 됐다. 구조 제안과 데이터 획득을 구별한다.",
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-depth-035",
    "topic": "심화 · 비분리와 염색체 이상",
    "subject": "박상영T · 심화",
    "question": "한 염색체 쌍이 감수 1분열에서 비분리하고 2분열은 정상이다. 네 생식세포의 염색체 수는?",
    "answers": {
      "up": "정상 네 개",
      "left": "정상 세 개·n+1 한 개",
      "right": "n+1 두 개·n−1 두 개",
      "down": "정상 두 개·n+1·n−1"
    },
    "correct": "right",
    "explanation": "상동염색체가 한쪽으로 함께 이동하므로 1분열 후 두 세포 모두 해당 쌍의 수가 비정상이다. 2분열 후에도 정상 산물이 없다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-036",
    "topic": "심화 · 비분리와 염색체 이상",
    "subject": "박상영T · 심화",
    "question": "감수 1분열은 정상이고 두 세포 중 하나만 한 염색체에서 2분열 비분리했다. 네 생식세포는?",
    "answers": {
      "up": "n+1 두 개·n−1 두 개",
      "left": "정상 네 개",
      "right": "n+1 세 개·n−1 한 개",
      "down": "정상 두 개·n+1·n−1"
    },
    "correct": "down",
    "explanation": "비분리하지 않은 세포에서 정상 생식세포 둘이 나온다. 비분리한 세포에서는 n+1과 n−1이 각각 하나 나온다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-037",
    "topic": "심화 · 비분리와 염색체 이상",
    "subject": "박상영T · 심화",
    "question": "n−1 생식세포가 정상 n 생식세포와 수정했다. 접합자의 염색체 수는?",
    "answers": {
      "up": "2n−1",
      "left": "2n+1",
      "right": "n−1",
      "down": "2n"
    },
    "correct": "up",
    "explanation": "n−1+n=2n−1이다. 단염색체성은 정상 한 쌍 중 하나가 없는 상태이며 배수성 변화와 다르다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-038",
    "topic": "심화 · 비분리와 염색체 이상",
    "subject": "박상영T · 심화",
    "question": "핵형 47,XX,+21의 대표적 수 이상은?",
    "answers": {
      "up": "X 염색체 역위",
      "left": "21번 삼염색체성",
      "right": "18번 삼염색체성",
      "down": "성염색체 단염색체성"
    },
    "correct": "left",
    "explanation": "47개의 염색체 중 21번이 추가된 핵형이다. 대표적인 다운 증후군의 수 이상과 연결되며 모든 사례가 이 핵형이라는 뜻은 아니다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-039",
    "topic": "심화 · 비분리와 염색체 이상",
    "subject": "박상영T · 심화",
    "question": "총 47개 염색체이며 성염색체가 XXY인 핵형은?",
    "answers": {
      "up": "고양이 울음 증후군",
      "left": "에드워드 증후군",
      "right": "클라인펠터 증후군",
      "down": "터너 증후군"
    },
    "correct": "right",
    "explanation": "47,XXY는 클라인펠터 증후군의 대표 핵형이다. 터너는 대표적으로 45,X이며 18번 삼염색체성과 구별한다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-040",
    "topic": "심화 · 비분리와 염색체 이상",
    "subject": "박상영T · 심화",
    "question": "핵형 45,X에서 부족한 염색체와 대표 증후군의 연결은?",
    "answers": {
      "up": "21번 하나·다운",
      "left": "18번 하나·에드워드",
      "right": "Y 하나·클라인펠터",
      "down": "성염색체 하나·터너"
    },
    "correct": "down",
    "explanation": "45,X는 성염색체가 하나인 대표적인 터너 증후군 핵형이다. Y가 사라진 남성이라고 단정하지 않는다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-041",
    "topic": "심화 · 비분리와 염색체 이상",
    "subject": "박상영T · 심화",
    "question": "18번 염색체가 세 개 있는 대표적 수 이상은?",
    "answers": {
      "up": "에드워드 증후군",
      "left": "다운 증후군",
      "right": "터너 증후군",
      "down": "고양이 울음 증후군"
    },
    "correct": "up",
    "explanation": "에드워드 증후군은 대표적으로 18번 삼염색체성이다. 다운은 21번, 고양이 울음 증후군은 5번 짧은 팔 결실과 연결된다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-042",
    "topic": "심화 · 비분리와 염색체 이상",
    "subject": "박상영T · 심화",
    "question": "염색체 배열 ABCDEFG가 ABCEFG로 바뀌었다. 변화는?",
    "answers": {
      "up": "전좌",
      "left": "결실",
      "right": "중복",
      "down": "역위"
    },
    "correct": "left",
    "explanation": "D 구간이 없어졌으므로 결실이다. 염색체 개수 자체가 정상이어도 구조 이상이 있을 수 있다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-043",
    "topic": "심화 · 비분리와 염색체 이상",
    "subject": "박상영T · 심화",
    "question": "한 염색체 배열 ABCDEFG가 ABCDCDEFG로 바뀌었다. 변화는?",
    "answers": {
      "up": "역위",
      "left": "단염색체성",
      "right": "중복",
      "down": "결실"
    },
    "correct": "right",
    "explanation": "CD 구간이 한 번 더 존재하므로 중복이다. 유전자 양의 변화는 유전자 발현에 영향을 줄 수 있다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-044",
    "topic": "심화 · 비분리와 염색체 이상",
    "subject": "박상영T · 심화",
    "question": "염색체 배열 ABCDEFG가 ABEDCFG로 바뀌었다. 변화는?",
    "answers": {
      "up": "중복",
      "left": "삼염색체성",
      "right": "단염색체성",
      "down": "역위"
    },
    "correct": "down",
    "explanation": "CDE 구간이 EDC로 반전됐으므로 역위다. 구간의 소실이나 복제 없이 배열 방향이 바뀔 수 있다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-045",
    "topic": "심화 · 비분리와 염색체 이상",
    "subject": "박상영T · 심화",
    "question": "서로 비상동인 두 염색체가 구간을 교환했다. 상동염색체의 정상 교차와 구별되는 변화는?",
    "answers": {
      "up": "상호 전좌",
      "left": "독립적 분리",
      "right": "DNA 반보존적 복제",
      "down": "염기 치환"
    },
    "correct": "up",
    "explanation": "비상동염색체 사이의 구간 교환은 상호 전좌다. 대응 좌위가 있는 상동염색체의 정상 교차와 구별한다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-046",
    "topic": "심화 · 비분리와 염색체 이상",
    "subject": "박상영T · 심화",
    "question": "유전자 양 손실 없는 균형 전좌 보유자도 비정상 자손을 가질 수 있는 주된 이유는?",
    "answers": {
      "up": "정상 생식세포는 절대 만들지 못한다",
      "left": "감수분열에서 불균형 산물이 가능하다",
      "right": "체세포의 모든 염색체가 사라진다",
      "down": "전좌는 반드시 RNA를 제거한다"
    },
    "correct": "left",
    "explanation": "보유자의 양적 균형이 유지돼도 감수분열의 분리 방식에 따라 결실·중복이 있는 생식세포가 생길 수 있다. 정상 산물도 가능하다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-047",
    "topic": "심화 · 돌연변이 원인과 결과",
    "subject": "박상영T · 심화",
    "question": "DNA 복제 중 잘못 들어간 염기가 수선되지 않고 다음 복제에 전달됐다. 원인은?",
    "answers": {
      "up": "정상적인 독립 분리",
      "left": "상동염색체의 정상 배열",
      "right": "자연발생 복제 오류",
      "down": "항상 자외선 조사"
    },
    "correct": "right",
    "explanation": "외부 변이원 없이도 복제 오류가 교정되지 않으면 돌연변이로 고정될 수 있다. 모든 돌연변이를 방사선 탓으로 돌리지 않는다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-048",
    "topic": "심화 · 돌연변이 원인과 결과",
    "subject": "박상영T · 심화",
    "question": "돌연변이 유발 요인 묶음으로 옳은 것은?",
    "answers": {
      "up": "독립 분리·정상 교차·수정",
      "left": "정상 복제·정상 수선·정상 분리",
      "right": "무작위 수정·정상 접합·정상 배열",
      "down": "자외선·방사선·일부 화학 물질"
    },
    "correct": "down",
    "explanation": "자외선과 방사선, 일부 화학 물질은 DNA 손상을 유발할 수 있다. 정상적인 감수분열 조합 변화와 구별한다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-049",
    "topic": "심화 · 돌연변이 원인과 결과",
    "subject": "박상영T · 심화",
    "question": "성인의 피부 세포에서만 발생한 변이에 대한 설명은?",
    "answers": {
      "up": "피부 세포 계통에 전달될 수 있다",
      "left": "모든 자녀에게 반드시 전달된다",
      "right": "몸의 모든 세포가 즉시 변한다",
      "down": "다음 감수분열에서 항상 사라진다"
    },
    "correct": "up",
    "explanation": "체세포 변이는 해당 세포의 분열로 세포 계통에 전달될 수 있다. 생식세포 계통에 없으면 일반적인 유성생식으로 자손에게 전달되지 않는다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-050",
    "topic": "심화 · 돌연변이 원인과 결과",
    "subject": "박상영T · 심화",
    "question": "mRNA 코돈 GAA가 GAG로 바뀌었고 둘 다 글루탐산을 지정한다. 암호화 결과는?",
    "answers": {
      "up": "염색체 비분리",
      "left": "침묵 돌연변이",
      "right": "미스센스 돌연변이",
      "down": "넌센스 돌연변이"
    },
    "correct": "left",
    "explanation": "유전 암호의 중복성 때문에 염기가 달라도 아미노산이 같을 수 있다. 아미노산 서열이 유지되는 치환을 침묵 돌연변이라고 한다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-051",
    "topic": "심화 · 돌연변이 원인과 결과",
    "subject": "박상영T · 심화",
    "question": "mRNA GAG(글루탐산)가 GUG(발린)으로 바뀌었다. 결과는?",
    "answers": {
      "up": "넌센스 돌연변이",
      "left": "항상 읽는 틀 이동",
      "right": "미스센스 돌연변이",
      "down": "침묵 돌연변이"
    },
    "correct": "right",
    "explanation": "다른 아미노산을 지정하는 치환은 미스센스다. 낫 모양 적혈구의 대표적 β글로빈 변이처럼 단백질 성질에 영향을 줄 수 있다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-052",
    "topic": "심화 · 돌연변이 원인과 결과",
    "subject": "박상영T · 심화",
    "question": "아미노산을 지정하던 UAU가 종결 코돈 UAA로 바뀌었다. 결과는?",
    "answers": {
      "up": "침묵 돌연변이",
      "left": "염색체 중복",
      "right": "상동염색체 전좌",
      "down": "넌센스 돌연변이"
    },
    "correct": "down",
    "explanation": "아미노산 코돈이 종결 코돈으로 바뀌면 번역이 조기에 끝날 수 있다. 이는 넌센스 돌연변이이며 종결 코돈은 아미노산을 지정하지 않는다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-053",
    "topic": "심화 · 돌연변이 원인과 결과",
    "subject": "박상영T · 심화",
    "question": "암호화 구간 중간에 염기 1개가 삽입됐다. 이후 번역에서 예상되는 변화는?",
    "answers": {
      "up": "읽는 틀이 이동할 수 있다",
      "left": "읽는 틀이 반드시 유지된다",
      "right": "염색체 수가 한 개 증가한다",
      "down": "항상 같은 아미노산 하나만 추가된다"
    },
    "correct": "up",
    "explanation": "3의 배수가 아닌 삽입은 이후 코돈을 나누는 기준을 바꾼다. 영향은 삽입 위치와 종결 코돈 등에 따라 달라진다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-054",
    "topic": "심화 · 돌연변이 원인과 결과",
    "subject": "박상영T · 심화",
    "question": "암호화 구간에서 연속 3염기가 결실됐다. 1염기 결실과 비교한 옳은 설명은?",
    "answers": {
      "up": "뒤쪽 코돈은 반드시 전부 바뀐다",
      "left": "뒤쪽 읽는 틀은 유지될 수 있다",
      "right": "단백질 기능이 반드시 정상이다",
      "down": "염색체 하나가 반드시 소실된다"
    },
    "correct": "left",
    "explanation": "3염기 결실은 뒤쪽 읽는 틀을 유지할 수 있지만 단백질의 아미노산 및 기능은 달라질 수 있다. 틀 유지와 기능 정상을 구별한다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-055",
    "topic": "심화 · 돌연변이 원인과 결과",
    "subject": "박상영T · 심화",
    "question": "생식세포 DNA에 생긴 변이가 자손에게 전달될 수 있는 조건은?",
    "answers": {
      "up": "모든 체세포가 같은 변이를 가진다",
      "left": "그 변이가 반드시 우성이다",
      "right": "그 생식세포가 수정에 참여한다",
      "down": "피부에만 변이가 있다"
    },
    "correct": "right",
    "explanation": "생식세포 계통의 변이는 수정에 참여하면 자손에게 전달될 수 있다. 우성 여부는 전달 자체와 다른 문제다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-056",
    "topic": "심화 · 돌연변이 원인과 결과",
    "subject": "박상영T · 심화",
    "question": "DNA 수선 기능이 약해진 세포에서 돌연변이가 늘 수 있는 까닭은?",
    "answers": {
      "up": "유전 암호의 코돈 수가 줄어든다",
      "left": "모든 상동염색체가 독립 분리된다",
      "right": "정상 교차가 전부 중단된다",
      "down": "손상·복제 오류가 더 남기 쉽다"
    },
    "correct": "down",
    "explanation": "DNA 손상과 복제 오류를 수선하지 못하면 변이가 고정될 가능성이 커진다. 수선 실패와 정상 감수분열 과정은 구별한다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-057",
    "topic": "심화 · 사람의 유전 자료 해석",
    "subject": "박상영T · 심화",
    "question": "ABO에서 집단에는 Iᴬ·Iᴮ·i가 있다. 정상 이배체 개인이 같은 좌위에서 가지는 대립유전자 수는?",
    "answers": {
      "up": "2개",
      "left": "3개",
      "right": "1개",
      "down": "혈액형에 따라 4개"
    },
    "correct": "up",
    "explanation": "복대립유전은 집단에 세 종류 이상이 있다는 뜻이다. 정상 이배체 개인은 상동염색체에서 하나씩 두 개를 가진다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-058",
    "topic": "심화 · 사람의 유전 자료 해석",
    "subject": "박상영T · 심화",
    "question": "Iᴬi와 Iᴮi인 부모의 자녀가 AB형일 확률은?",
    "answers": {
      "up": "0",
      "left": "1/4",
      "right": "1/2",
      "down": "3/4"
    },
    "correct": "left",
    "explanation": "가능 유전형은 IᴬIᴮ, Iᴬi, Iᴮi, ii가 각각 1/4다. AB형은 IᴬIᴮ 한 경우다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-059",
    "topic": "심화 · 사람의 유전 자료 해석",
    "subject": "박상영T · 심화",
    "question": "ABO 유전형 IᴬIᴮ, H 좌위 hh인 사람의 봄베이 표현형을 설명한 것은?",
    "answers": {
      "up": "B 항원만 정상적으로 형성",
      "left": "반드시 일반 AB형으로 표현",
      "right": "H 항원이 없어 A·B 항원 형성 제한",
      "down": "A 항원만 정상적으로 형성"
    },
    "correct": "right",
    "explanation": "hh에서는 A·B 항원을 만드는 바탕인 H 항원이 형성되지 않아 ABO 유전형과 항원 표현형이 다를 수 있다. 일반 O형과도 구별한다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-060",
    "topic": "심화 · 사람의 유전 자료 해석",
    "subject": "박상영T · 심화",
    "question": "ABO 유전형 IᴬIᴮ이고 H 좌위가 Hh다. 항원 형성에 대한 설명은?",
    "answers": {
      "up": "h가 한쪽 B 항원만 막는다",
      "left": "H는 A만 만들고 h는 B만 만든다",
      "right": "Hh는 항상 봄베이 표현형이다",
      "down": "H가 기능하면 A·B 항원 모두 가능"
    },
    "correct": "down",
    "explanation": "H/h는 ABO 대립유전자 각각에 붙어 한쪽만 켜고 끄는 스위치가 아니다. 우성 H가 H 항원 형성을 가능하게 하면 A·B 항원 모두 형성될 수 있다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-061",
    "topic": "심화 · 사람의 유전 자료 해석",
    "subject": "박상영T · 심화",
    "question": "어떤 형질 일치율이 일란성 54%, 이란성 12%다. 자료에 부합하는 해석은?",
    "answers": {
      "up": "유전 영향이 시사되며 환경도 고려",
      "left": "전적으로 유전만 결정한다",
      "right": "전적으로 환경만 결정한다",
      "down": "유전 기여도가 정확히 42%다"
    },
    "correct": "up",
    "explanation": "일란성에서 더 높은 일치율은 유전 영향의 단서이며 100% 미만이라는 점과 환경 차이 등을 함께 고려해야 한다. 단순 차이를 기여도로 삼지 않는다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-062",
    "topic": "심화 · 사람의 유전 자료 해석",
    "subject": "박상영T · 심화",
    "question": "상염색체 열성 형질에서 정상 부모 Aa×Aa의 정상 자녀 중 Aa일 조건부 확률은?",
    "answers": {
      "up": "3/4",
      "left": "2/3",
      "right": "1/2",
      "down": "1/4"
    },
    "correct": "left",
    "explanation": "자손 비율 AA:Aa:aa=1:2:1이다. 정상인 AA와 Aa만 남기면 3 중 2가 Aa이므로 조건부 확률은 2/3다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-063",
    "topic": "심화 · 사람의 유전 자료 해석",
    "subject": "박상영T · 심화",
    "question": "X 연관 열성에서 보인자 어머니 XᴬXᵃ와 정상 아버지 XᴬY의 아들 중 환자 비율은?",
    "answers": {
      "up": "0",
      "left": "1",
      "right": "1/2",
      "down": "1/4"
    },
    "correct": "right",
    "explanation": "아들은 아버지에게 Y, 어머니에게 X를 받는다. 어머니의 Xᵃ를 받을 확률이 1/2이므로 아들 중 환자가 1/2다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-064",
    "topic": "심화 · 사람의 유전 자료 해석",
    "subject": "박상영T · 심화",
    "question": "X 연관 열성에서 환자 아버지 XᵃY와 비보인자 어머니 XᴬXᴬ의 딸 유전형은?",
    "answers": {
      "up": "모두 XᵃXᵃ",
      "left": "모두 XᴬXᴬ",
      "right": "절반 XᵃY",
      "down": "모두 XᴬXᵃ"
    },
    "correct": "down",
    "explanation": "딸은 아버지의 Xᵃ와 어머니의 Xᴬ를 받는다. 모두 보인자이며 아버지의 X가 아들에게 직접 전달되지는 않는다.",
    "sourceNote": "박상영T 필기 · 2쪽"
  }
];
export const parkDepthWritten: WrittenQuestion[] = [
  {
    "id": "biology-park-depth-written-001",
    "topic": "심화 · HGP·SNP·GWAS",
    "question": "HGP·SNP·GWAS를 구별하고, 유의한 SNP를 발견해도 원인 유전자를 확정할 수 없는 이유를 설명하시오.",
    "modelAnswer": "HGP는 인간 유전체 지도와 염기서열을 구축한 프로젝트다. SNP는 한 염기 위치의 다형성이며 GWAS는 여러 SNP와 형질의 연관을 집단에서 조사한다. 유의한 SNP는 원인 변이와 가까운 표지자일 수 있으므로 연관만으로 인과성을 확정할 수 없다.",
    "criteria": [
      "세 용어 구별",
      "집단 수준의 연관 조사",
      "표지자와 원인 변이 구별"
    ],
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-written-002",
    "topic": "심화 · HGP·SNP·GWAS",
    "question": "맨해튼 플롯에서 SNP A의 p=10⁻⁸, B의 p=10⁻⁵다. 두 높이를 계산하고, 높은 봉우리와 큰 유전적 효과가 같은 뜻인지 설명하시오.",
    "modelAnswer": "−log₁₀(p)에 따라 A의 높이는 8, B의 높이는 5로 A가 3 높다. 높이는 연관의 통계적 유의성을 나타내며 효과 크기를 나타내지 않는다. 따라서 A의 유전적 효과가 B보다 반드시 크다고 결론 내릴 수 없다.",
    "criteria": [
      "높이 8과 5",
      "높이 차 3",
      "유의성과 효과 크기 구별"
    ],
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-written-003",
    "topic": "심화 · 키아즈마·교차·연관",
    "question": "키아즈마가 유전적 다양성과 상동염색체 분리에 어떻게 연결되는지, 새 대립유전자 생성과 구별하여 설명하시오.",
    "modelAnswer": "감수 1분열 전기에 상동염색체의 비자매염색분체가 대응 구간을 교환하면 기존 대립유전자의 조합이 바뀐다. 키아즈마는 이 교차의 결과로 나타나는 연결 부위이며 자매염색분체의 결합과 함께 상동염색체의 적절한 배열과 분리에 기여한다. 정상 교차의 조합 변화는 돌연변이에 의한 새 대립유전자 생성과 다르다.",
    "criteria": [
      "비자매염색분체 교차",
      "조합 변화와 새 변이 구별",
      "키아즈마의 연결과 분리 기여"
    ],
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-written-004",
    "topic": "심화 · 키아즈마·교차·연관",
    "question": "AB/ab×ab/ab의 자손이 AB 360, ab 340, Ab 150, aB 150이다. 부모형·재조합형과 재조합률을 구하고, 두 재조합형을 모두 세야 하는 이유를 설명하시오.",
    "modelAnswer": "부모형은 AB와 ab이고 재조합형은 Ab와 aB다. 재조합형 300개를 전체 1000개로 나누면 재조합률은 30%다. 교차에서 두 대응 구간을 교환하므로 서로 다른 두 재조합형이 모두 만들어져 두 종류를 합해야 한다.",
    "criteria": [
      "부모형과 재조합형 구별",
      "30% 계산",
      "두 재조합형을 합산"
    ],
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-written-005",
    "topic": "심화 · 키아즈마·교차·연관",
    "question": "AB/ab의 한 감수분열에서 두 비자매염색분체가 한 번 교차한 경우의 네 산물을 쓰고, 이를 근거로 모든 생식세포가 반드시 재조합형이라는 주장을 반박하시오.",
    "modelAnswer": "네 산물은 AB, ab, Ab, aB다. 교차에 참여하지 않은 두 염색분체는 부모형을 유지하고 참여한 두 염색분체만 재조합형이 된다. 따라서 한 번 교차했더라도 네 생식세포 중 둘은 부모형이며 모든 생식세포가 재조합형인 것은 아니다.",
    "criteria": [
      "네 산물 제시",
      "교차에 참여한 두 염색분체",
      "부모형 두 개 유지"
    ],
    "sourceNote": "박상영T 필기 · 1쪽"
  },
  {
    "id": "biology-park-depth-written-006",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "question": "그리피스와 에이버리 연구진의 연구를 연도·처리 방법·결론의 범위로 비교하시오.",
    "modelAnswer": "1928년 그리피스는 살아 있는 R형과 사멸 S형의 혼합에서 형질전환을 관찰했지만 물질의 정체를 확정하지 못했다. 1944년 에이버리 연구진은 S형 추출물에 효소를 처리해 DNase에서만 활성이 사라지는 결과 등을 얻어 DNA가 형질전환 물질이라는 근거를 제시했다.",
    "criteria": [
      "1928·1944 구별",
      "혼합 실험과 효소 처리 구별",
      "현상과 DNA 정체 구별"
    ],
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-depth-written-007",
    "topic": "심화 · 연구 연혁과 실험 증거",
    "question": "허시·체이스 실험의 표지·교반·원심분리 결과를 연결하여 DNA가 유전물질이라는 근거를 설명하시오.",
    "modelAnswer": "1952년 연구에서 DNA는 ³²P, 단백질은 ³⁵S로 표지했다. 감염 후 교반해 세균 표면의 파지 껍질을 분리하고 원심분리했다. 세균 침전에 ³²P가 주로 검출되고 ³⁵S는 주로 상층액에 남아, 세균 안에 들어가 증식을 지시한 물질이 DNA라는 근거를 얻었다.",
    "criteria": [
      "두 표지 대응",
      "교반·원심분리 목적",
      "표지 분포와 DNA 결론"
    ],
    "sourceNote": "박상영T 필기 · 3쪽"
  },
  {
    "id": "biology-park-depth-written-008",
    "topic": "심화 · 비분리와 염색체 이상",
    "question": "한 염색체 쌍만 비분리한다는 조건에서 감수 1분열 비분리와 한 세포의 2분열 비분리가 만드는 네 생식세포를 비교하시오.",
    "modelAnswer": "1분열에서 상동염색체가 분리되지 않고 2분열이 정상이라면 n+1 생식세포 두 개와 n−1 생식세포 두 개가 나온다. 1분열이 정상이고 두 세포 중 하나에서만 2분열 비분리가 일어나면 정상 n 두 개, n+1 한 개, n−1 한 개가 나온다.",
    "criteria": [
      "각 분열의 분리 대상",
      "1분열 비분리 산물",
      "2분열 비분리 산물"
    ],
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-written-009",
    "topic": "심화 · 비분리와 염색체 이상",
    "question": "다운·에드워드·클라인펠터·터너의 대표 핵형 이상을 제시하고, 결실·역위 같은 구조 이상과 구별하시오.",
    "modelAnswer": "대표적으로 다운은 21번 삼염색체, 에드워드는 18번 삼염색체, 클라인펠터는 47,XXY, 터너는 45,X다. 이들은 염색체 수 이상과 연결된다. 결실은 구간 소실, 역위는 구간 방향 반전이며 염색체 총수가 정상이어도 구조 이상이 있을 수 있다.",
    "criteria": [
      "네 대표 수 이상",
      "결실·역위 정의",
      "염색체 수와 구조 구별"
    ],
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-written-010",
    "topic": "심화 · 돌연변이 원인과 결과",
    "question": "침묵·미스센스·넌센스와 읽는 틀 이동을 구별하고, 3염기 결실이 기능 정상임을 보장하지 않는 이유를 설명하시오.",
    "modelAnswer": "침묵 치환은 지정 아미노산이 유지되고 미스센스는 다른 아미노산으로 바뀌며 넌센스는 종결 코돈을 만든다. 암호화 구간의 3의 배수가 아닌 삽입·결실은 뒤쪽 읽는 틀을 이동시킬 수 있다. 3염기 결실은 뒤쪽 틀을 유지해도 아미노산 소실 등으로 단백질 구조와 기능을 바꿀 수 있다.",
    "criteria": [
      "세 치환 결과 구별",
      "틀 이동의 3의 배수 조건",
      "틀 유지와 기능 정상 구별"
    ],
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-written-011",
    "topic": "심화 · 돌연변이 원인과 결과",
    "question": "돌연변이의 자연발생·유발 원인을 각각 제시하고, 체세포 변이와 생식세포 변이의 전달 범위를 비교하시오.",
    "modelAnswer": "자연발생 원인에는 복제 오류와 DNA 손상·수선 실패가 있고 유발 원인에는 자외선·방사선·일부 화학 물질이 있다. 체세포 변이는 해당 세포 계통으로 전달될 수 있다. 생식세포 계통의 변이는 그 생식세포가 수정에 참여하면 자손에게 전달될 수 있으며 우성 여부와는 별개다.",
    "criteria": [
      "자연발생·유발 원인",
      "체세포 계통 전달",
      "수정에 참여한 생식세포 전달"
    ],
    "sourceNote": "박상영T 필기 · 2쪽"
  },
  {
    "id": "biology-park-depth-written-012",
    "topic": "심화 · 사람의 유전 자료 해석",
    "question": "ABO IᴬIᴮ인 사람이 Hh일 때와 hh일 때를 비교하고, H/h가 ABO 대립유전자 하나씩을 개별적으로 조절한다는 주장을 평가하시오.",
    "modelAnswer": "H 좌위가 Hh면 기능하는 H가 H 항원 형성을 가능하게 하여 Iᴬ와 Iᴮ의 산물이 A·B 항원을 만들 수 있다. hh에서는 H 항원 형성이 제한돼 봄베이 표현형이 나타날 수 있다. H/h는 각각 Iᴬ와 Iᴮ에 붙어 한쪽 항원만 켜고 끄는 관계가 아니므로 그 주장은 옳지 않다.",
    "criteria": [
      "Hh에서 H 항원과 A·B 형성",
      "hh와 봄베이 표현형",
      "한 대립유전자씩 대응한다는 주장 반박"
    ],
    "sourceNote": "박상영T 필기 · 2쪽"
  }
];
