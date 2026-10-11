import type { SwipeCard } from './swipe-cards';
export const sciencePractice: Record<string, SwipeCard[]> = {
  "biology-park": [
    {
      "id": "practice-depth-biology-park-001",
      "topic": "심화 · HGP·SNP·GWAS",
      "subject": "박상영T · 심화 적용",
      "question": "GWAS에서 p=10⁻⁹인 점의 −log₁₀(p)는?",
      "answers": {
        "up": "9",
        "left": "−9",
        "right": "10⁻⁹",
        "down": "1/9"
      },
      "correct": "up",
      "explanation": "−log₁₀(10⁻⁹)=9이다. 세로축이 높을수록 p값이 작다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-002",
      "topic": "심화 · HGP·SNP·GWAS",
      "subject": "박상영T · 심화 적용",
      "question": "GWAS의 점 A는 높이 6, B는 높이 8이다. p값이 더 작은 점은?",
      "answers": {
        "up": "좌표만으로 알 수 없다",
        "left": "B",
        "right": "A",
        "down": "두 점이 같다"
      },
      "correct": "left",
      "explanation": "A의 p값은 10⁻⁶, B는 10⁻⁸이므로 B의 통계적 유의성이 더 높다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-003",
      "topic": "심화 · HGP·SNP·GWAS",
      "subject": "박상영T · 심화 적용",
      "question": "질병과 연관된 SNP를 발견했다. 인과성을 확인하려면 추가로 필요한 것은?",
      "answers": {
        "up": "모든 SNP를 원인으로 확정",
        "left": "환자 한 명의 SNP만 관찰",
        "right": "기능 검증 등 추가 증거",
        "down": "유의한 p값만 재표기"
      },
      "correct": "right",
      "explanation": "통계적 연관은 원인 확정과 다르므로 변이의 기능과 다른 연관 변이 등을 추가로 검증해야 한다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-004",
      "topic": "심화 · HGP·SNP·GWAS",
      "subject": "박상영T · 심화 적용",
      "question": "HGP 완료가 모든 사람의 유전체가 동일하다는 뜻인가?",
      "answers": {
        "up": "모든 SNP가 없어진다",
        "left": "사람마다 유전자가 없다",
        "right": "개인의 염색체 수가 늘어난다",
        "down": "개인 간 변이는 남는다"
      },
      "correct": "down",
      "explanation": "HGP는 인간 유전체 지도와 서열 구축을 목표로 했다. SNP 등 개인 간 유전 변이를 없앤 프로젝트가 아니다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-005",
      "topic": "심화 · HGP·SNP·GWAS",
      "subject": "박상영T · 심화 적용",
      "question": "한 위치의 집단 변이가 A 또는 G다. 이 변이와 거리가 먼 유전자의 발현이 연관됐다. 단정할 수 없는 것은?",
      "answers": {
        "up": "A가 반드시 질병 원인임",
        "left": "한 염기 위치의 변이임",
        "right": "집단에서 변이가 관찰됨",
        "down": "연관을 추가로 조사할 수 있음"
      },
      "correct": "up",
      "explanation": "SNP와 형질 사이의 연관이 있어도 인과관계를 바로 단정할 수 없다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-006",
      "topic": "심화 · HGP·SNP·GWAS",
      "subject": "박상영T · 심화 적용",
      "question": "1990년 시작해 2003년 완료된 사업과 집단의 SNP–형질 연관 연구를 순서대로 쓰면?",
      "answers": {
        "up": "핵형 분석–HGP",
        "left": "HGP–GWAS",
        "right": "GWAS–HGP",
        "down": "SNP–핵형 분석"
      },
      "correct": "left",
      "explanation": "HGP는 인간 유전체 프로젝트이고 GWAS는 유전체 전반의 변이와 형질 간 연관 분석이다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-007",
      "topic": "심화 · 키아즈마·교차·연관",
      "subject": "박상영T · 심화 적용",
      "question": "AB/ab의 재조합률은 20%이고 두 재조합형은 같은 비율이다. Ab의 기대 비율은?",
      "answers": {
        "up": "40%",
        "left": "80%",
        "right": "10%",
        "down": "20%"
      },
      "correct": "right",
      "explanation": "재조합형 Ab와 aB를 같은 비율로 만드는 조건에서 합계 20%를 둘로 나누어 각각 10%다.",
      "sourceNote": "박상영T 필기 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-008",
      "topic": "심화 · 키아즈마·교차·연관",
      "subject": "박상영T · 심화 적용",
      "question": "AB/ab의 재조합률은 20%이고 두 부모형은 같은 비율이다. AB의 기대 비율은?",
      "answers": {
        "up": "10%",
        "left": "20%",
        "right": "80%",
        "down": "40%"
      },
      "correct": "down",
      "explanation": "부모형 합계는 80%다. 두 부모형 AB와 ab가 같은 비율이면 각각 40%다.",
      "sourceNote": "박상영T 필기 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-009",
      "topic": "심화 · 키아즈마·교차·연관",
      "subject": "박상영T · 심화 적용",
      "question": "한 번의 교차에 직접 참여한 두 가닥은?",
      "answers": {
        "up": "상동염색체의 비자매염색분체",
        "left": "한 염색체의 자매염색분체",
        "right": "서로 다른 염색체의 중심절",
        "down": "감수 2분열의 두 방추사"
      },
      "correct": "up",
      "explanation": "교차는 감수 1분열 전기에 상동염색체의 비자매염색분체 사이에서 일어난다.",
      "sourceNote": "박상영T 필기 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-010",
      "topic": "심화 · 키아즈마·교차·연관",
      "subject": "박상영T · 심화 적용",
      "question": "한 2가 염색체에서 두 비자매염색분체가 한 번 교차했다. 직접 교환에 참여하지 않은 가닥 수는?",
      "answers": {
        "up": "4개",
        "left": "2개",
        "right": "0개",
        "down": "1개"
      },
      "correct": "left",
      "explanation": "복제된 상동염색체 쌍은 네 염색분체로 이루어진다. 단일 교차에 두 가닥이 참여하면 나머지 두 가닥은 직접 교환에 참여하지 않는다.",
      "sourceNote": "박상영T 필기 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-011",
      "topic": "심화 · 키아즈마·교차·연관",
      "subject": "박상영T · 심화 적용",
      "question": "AB/ab의 검정교배 자손 1000명에서 Ab 90명, aB 110명이었다. 재조합률은?",
      "answers": {
        "up": "11%",
        "left": "40%",
        "right": "20%",
        "down": "9%"
      },
      "correct": "right",
      "explanation": "재조합형 두 종류를 합한 200명을 전체 1000명으로 나누어 20%를 얻는다.",
      "sourceNote": "박상영T 필기 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-012",
      "topic": "심화 · 키아즈마·교차·연관",
      "subject": "박상영T · 심화 적용",
      "question": "키아즈마와 유전적 다양성의 관계로 타당한 것은?",
      "answers": {
        "up": "교차가 새 염색체 쌍을 합성",
        "left": "모든 생식세포의 조합을 같게 함",
        "right": "키아즈마가 염기서열을 항상 바꿈",
        "down": "교차로 새 대립유전자 조합 형성"
      },
      "correct": "down",
      "explanation": "키아즈마는 교차와 관련된 연결 부위다. 교차는 기존 대립유전자를 재조합하여 조합의 다양성을 높인다.",
      "sourceNote": "박상영T 필기 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-013",
      "topic": "심화 · 연구 연혁과 실험 증거",
      "subject": "박상영T · 심화 적용",
      "question": "1928년 그리피스의 결과에서 직접 제시된 것은?",
      "answers": {
        "up": "세균의 형질전환",
        "left": "DNA의 이중나선 구조",
        "right": "DNA의 반보존적 복제",
        "down": "리보솜의 단백질 합성"
      },
      "correct": "up",
      "explanation": "그리피스는 열처리 S형과 살아 있는 R형의 혼합에서 형질전환을 관찰했다. DNA라는 물질의 확인과 구별한다.",
      "sourceNote": "박상영T 필기 · 연혁 공식 자료 대조 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-014",
      "topic": "심화 · 연구 연혁과 실험 증거",
      "subject": "박상영T · 심화 적용",
      "question": "1944년 에이버리 연구에서 DNase를 처리한 추출물의 형질전환이 사라졌다. 근거가 되는 결론은?",
      "answers": {
        "up": "열처리만으로 R형이 S형이 됨",
        "left": "DNA가 형질전환 물질",
        "right": "단백질만이 유전 물질",
        "down": "RNA가 모든 형질을 결정"
      },
      "correct": "left",
      "explanation": "DNA 분해 시 형질전환이 사라지는 결과는 DNA가 형질전환 물질이라는 결론을 뒷받침한다.",
      "sourceNote": "박상영T 필기 · 연혁 공식 자료 대조 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-015",
      "topic": "심화 · 연구 연혁과 실험 증거",
      "subject": "박상영T · 심화 적용",
      "question": "허시–체이스가 단백질 표지에 사용한 동위원소와 DNA 표지는?",
      "answers": {
        "up": "¹⁴C–³⁵S",
        "left": "³⁵S–¹⁵N",
        "right": "³⁵S–³²P",
        "down": "³²P–³⁵S"
      },
      "correct": "right",
      "explanation": "단백질의 황을 ³⁵S로, DNA의 인을 ³²P로 표지하여 세균 안으로 들어가는 물질을 구별했다.",
      "sourceNote": "박상영T 필기 · 연혁 공식 자료 대조 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-016",
      "topic": "심화 · 연구 연혁과 실험 증거",
      "subject": "박상영T · 심화 적용",
      "question": "메셀슨–스탈 실험에서 ¹⁵N DNA를 ¹⁴N 배지에서 두 세대 복제했다. 반보존적 복제의 예상 띠는?",
      "answers": {
        "up": "무거운·가벼운 띠",
        "left": "중간 띠만",
        "right": "무거운 띠만",
        "down": "중간·가벼운 띠"
      },
      "correct": "down",
      "explanation": "첫 세대는 혼성 DNA만 생긴다. 두 번째 세대는 혼성 DNA와 가벼운 DNA가 생겨 두 띠가 나타난다.",
      "sourceNote": "박상영T 필기 · 연혁 공식 자료 대조 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-017",
      "topic": "심화 · 연구 연혁과 실험 증거",
      "subject": "박상영T · 심화 적용",
      "question": "1953년의 DNA 구조 모형과 1958년의 복제 실험을 짝지으면?",
      "answers": {
        "up": "왓슨·크릭–메셀슨·스탈",
        "left": "그리피스–에이버리",
        "right": "허시·체이스–왓슨·크릭",
        "down": "에이버리–그리피스"
      },
      "correct": "up",
      "explanation": "1953년 이중나선 모형 제시와 1958년 반보존적 복제 검증을 서로 구분한다.",
      "sourceNote": "박상영T 필기 · 연혁 공식 자료 대조 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-018",
      "topic": "심화 · 비분리와 염색체 이상",
      "subject": "박상영T · 심화 적용",
      "question": "한 쌍이 감수 1분열에서만 비분리됐다. 네 생식세포 중 정상 염색체 수를 가진 것은?",
      "answers": {
        "up": "4개",
        "left": "0개",
        "right": "1개",
        "down": "2개"
      },
      "correct": "left",
      "explanation": "감수 1분열의 상동염색체 비분리는 n+1 두 개와 n−1 두 개의 생식세포를 만든다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-019",
      "topic": "심화 · 비분리와 염색체 이상",
      "subject": "박상영T · 심화 적용",
      "question": "감수 2분열의 한 세포에서만 한 쌍이 비분리됐다. 정상 생식세포 비율은?",
      "answers": {
        "up": "1/4",
        "left": "1",
        "right": "1/2",
        "down": "0"
      },
      "correct": "right",
      "explanation": "네 생식세포 중 정상 n 두 개와 n+1, n−1 각 하나가 만들어져 정상 비율은 1/2이다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-020",
      "topic": "심화 · 비분리와 염색체 이상",
      "subject": "박상영T · 심화 적용",
      "question": "정상 n 생식세포와 n−1 생식세포가 수정했다. 접합자의 염색체 수는?",
      "answers": {
        "up": "2n",
        "left": "2n+1",
        "right": "n−1",
        "down": "2n−1"
      },
      "correct": "down",
      "explanation": "수정 시 두 생식세포의 염색체 수를 더하면 n+(n−1)=2n−1이다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-021",
      "topic": "심화 · 비분리와 염색체 이상",
      "subject": "박상영T · 심화 적용",
      "question": "염색체 일부가 뒤집혔으나 총 DNA 양은 그대로다. 가장 직접적인 구조 이상은?",
      "answers": {
        "up": "역위",
        "left": "결실",
        "right": "중복",
        "down": "삼염색체성"
      },
      "correct": "up",
      "explanation": "역위는 구간의 방향이 뒤집히는 구조 이상이다. 구간 소실인 결실과 수 변화인 삼염색체성을 구별한다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-022",
      "topic": "심화 · 돌연변이 원인과 결과",
      "subject": "박상영T · 심화 적용",
      "question": "암호화 구간의 2개 염기 삽입이 뒤쪽 번역에 미칠 수 있는 변화는?",
      "answers": {
        "up": "염색체 수가 하나 증가",
        "left": "읽는 틀 변화",
        "right": "반드시 같은 아미노산 유지",
        "down": "항상 DNA 양만 감소"
      },
      "correct": "left",
      "explanation": "3의 배수가 아닌 염기 삽입은 코돈을 읽는 틀을 바꾸어 뒤쪽 서열과 종결 위치에 영향을 줄 수 있다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-023",
      "topic": "심화 · 돌연변이 원인과 결과",
      "subject": "박상영T · 심화 적용",
      "question": "암호화 구간의 6개 염기 결실에서 반드시 성립하는 것은?",
      "answers": {
        "up": "아미노산이 반드시 하나만 감소",
        "left": "종결 코돈이 반드시 사라짐",
        "right": "뒤쪽 읽는 틀은 유지",
        "down": "단백질 기능이 반드시 정상"
      },
      "correct": "right",
      "explanation": "6은 3의 배수이므로 뒤쪽 읽는 틀은 유지된다. 그러나 아미노산 소실이나 경계 코돈 변화로 기능에 영향을 줄 수 있다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-024",
      "topic": "심화 · 돌연변이 원인과 결과",
      "subject": "박상영T · 심화 적용",
      "question": "한 염기 치환 후 아미노산이 같았다. 이를 설명하는 유전 암호의 성질은?",
      "answers": {
        "up": "모든 코돈이 종결 코돈",
        "left": "코돈마다 네 염기를 사용",
        "right": "한 코돈이 모든 아미노산 지정",
        "down": "여러 코돈이 같은 아미노산 지정"
      },
      "correct": "down",
      "explanation": "유전 암호의 중복성 때문에 염기 치환이 있어도 같은 아미노산이 지정될 수 있다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-025",
      "topic": "심화 · 돌연변이 원인과 결과",
      "subject": "박상영T · 심화 적용",
      "question": "피부 세포의 DNA 변이를 발견했다. 자녀 유전을 논하려면 구별해야 할 것은?",
      "answers": {
        "up": "생식세포 계열의 변이 여부",
        "left": "피부 세포의 크기만",
        "right": "부모의 혈액형만",
        "down": "돌연변이 발견 연도만"
      },
      "correct": "up",
      "explanation": "체세포의 변이는 일반적으로 자손에게 직접 전달되지 않으며 생식세포 계열에 생겼는지를 구별해야 한다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-biology-park-026",
      "topic": "심화 · 돌연변이 원인과 결과",
      "subject": "박상영T · 심화 적용",
      "question": "자외선 노출 뒤 DNA 손상이 발견됐다. 손상과 돌연변이의 관계는?",
      "answers": {
        "up": "손상이 없으면 변이는 불가능",
        "left": "복구 실패 등으로 변이가 남을 수 있음",
        "right": "손상은 반드시 모두 유전됨",
        "down": "손상은 모두 염색체 수 증가"
      },
      "correct": "left",
      "explanation": "DNA 손상은 복구될 수 있다. 복구되지 않거나 잘못 복구되어 서열 변화가 고정되면 돌연변이로 이어질 수 있다.",
      "sourceNote": "박상영T 필기 · 2쪽 · 개념 적용 문제"
    }
  ],
  "chemistry": [
    {
      "id": "practice-depth-chemistry-001",
      "topic": "화학 평형 · K·Q·이동",
      "subject": "화학 · 심화 적용",
      "question": "A⇌B에서 K=5, [A]=0.4 M, [B]=1.2 M이다. Q와 반응 방향은?",
      "answers": {
        "up": "Q=5, 평형",
        "left": "Q=0.3, 역반응",
        "right": "Q=3, 정반응",
        "down": "Q=3, 역반응"
      },
      "correct": "right",
      "explanation": "Q=[B]/[A]=3이다. Q<K이므로 생성물 B가 증가하는 방향으로 진행한다.",
      "sourceNote": "Ⅰ-0. 화학평형 · 7쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-002",
      "topic": "화학 평형 · K·Q·이동",
      "subject": "화학 · 심화 적용",
      "question": "A+2B⇌C가 평형이다. 부피를 절반으로 줄인 직후 Q는 원래 K의 몇 배인가?",
      "answers": {
        "up": "1/2배",
        "left": "2배",
        "right": "4배",
        "down": "1/4배"
      },
      "correct": "down",
      "explanation": "모든 농도가 두 배가 되면 Q=[C]/([A][B]²)의 분자는 2배, 분모는 8배가 되어 Q는 K/4가 된다.",
      "sourceNote": "Ⅰ-0. 화학평형 · 7쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-003",
      "topic": "화학 평형 · K·Q·이동",
      "subject": "화학 · 심화 적용",
      "question": "온도가 같은 평형계에 촉매만 넣었다. 바뀌지 않는 것은?",
      "answers": {
        "up": "평형 상수 K",
        "left": "평형 도달 속도",
        "right": "정반응 진행 속도",
        "down": "역반응 진행 속도"
      },
      "correct": "up",
      "explanation": "촉매는 정·역반응 속도를 높여 평형 도달을 빠르게 하지만 같은 온도에서 K를 바꾸지 않는다.",
      "sourceNote": "Ⅰ-0. 화학평형 · 7쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-004",
      "topic": "화학 평형 · K·Q·이동",
      "subject": "화학 · 심화 적용",
      "question": "순수 고체가 남아 있는 불균일 평형에 같은 고체를 더 넣었다. 같은 온도에서 K는?",
      "answers": {
        "up": "항상 0이 된다",
        "left": "변하지 않는다",
        "right": "고체 질량에 비례해 증가",
        "down": "고체 몰수만큼 감소"
      },
      "correct": "left",
      "explanation": "순수한 고체의 활동도는 일정하여 평형 상수 식에 직접 포함하지 않는다. 고체의 양만 더한 것으로 K가 변하지 않는다.",
      "sourceNote": "Ⅰ-0. 화학평형 · 7쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-005",
      "topic": "평형 실험 · 색 변화와 조작",
      "subject": "화학 · 심화 적용",
      "question": "같은 평형 용액을 두 시험관에 나누고 한쪽에만 물을 넣었다. 색 차이 해석에 먼저 고려할 것은?",
      "answers": {
        "up": "K가 반드시 두 배가 됨",
        "left": "모든 이온 농도가 그대로임",
        "right": "희석과 평형 이동 모두",
        "down": "색 차이는 전부 온도 탓"
      },
      "correct": "right",
      "explanation": "물 첨가는 우선 농도를 낮춘다. 이어서 평형이 이동할 수 있으므로 색 진하기만으로 한 원인을 단정하지 않는다.",
      "sourceNote": "실험 정리 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-006",
      "topic": "평형 실험 · 색 변화와 조작",
      "subject": "화학 · 심화 적용",
      "question": "평형의 색 변화를 비교할 때 용액의 양과 시험관 굵기를 맞추는 이유는?",
      "answers": {
        "up": "평형 상수를 같게 만들려고",
        "left": "반응을 완전히 멈추려고",
        "right": "모든 이온을 제거하려고",
        "down": "색 비교 조건을 통제하려고"
      },
      "correct": "down",
      "explanation": "관찰 조건이 다르면 같은 농도에서도 색의 진하기를 다르게 볼 수 있다. 반응에 의한 변화와 관찰 조건의 영향을 구별한다.",
      "sourceNote": "실험 정리 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-007",
      "topic": "평형 실험 · 색 변화와 조작",
      "subject": "화학 · 심화 적용",
      "question": "같은 평형 용액에 공통 이온을 추가했다. Q가 K보다 커진 직후 우세한 진행 방향은?",
      "answers": {
        "up": "역반응",
        "left": "정반응",
        "right": "반응 완전 정지",
        "down": "촉매 생성"
      },
      "correct": "up",
      "explanation": "Q>K이면 생성물 항이 상대적으로 큰 상태이므로 Q를 낮추는 역반응 방향으로 평형에 접근한다.",
      "sourceNote": "실험 정리 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-008",
      "topic": "산·염기 · 짝과 세기·pH",
      "subject": "화학 · 심화 적용",
      "question": "25℃에서 pH=3인 수용액의 [OH⁻]는?",
      "answers": {
        "up": "10³ M",
        "left": "10⁻¹¹ M",
        "right": "10⁻³ M",
        "down": "10⁻⁷ M"
      },
      "correct": "left",
      "explanation": "pOH=14−3=11이므로 [OH⁻]=10⁻¹¹ M이다.",
      "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-009",
      "topic": "산·염기 · 짝과 세기·pH",
      "subject": "화학 · 심화 적용",
      "question": "HA가 H⁺를 내놓은 뒤 A⁻가 됐다. HA와 A⁻의 관계는?",
      "answers": {
        "up": "같은 분자식의 이성질체",
        "left": "두 강염기",
        "right": "짝산–짝염기",
        "down": "두 강산"
      },
      "correct": "right",
      "explanation": "짝산과 짝염기는 H⁺ 하나 차이의 종이다. HA의 짝염기는 A⁻다.",
      "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-010",
      "topic": "산·염기 · 짝과 세기·pH",
      "subject": "화학 · 심화 적용",
      "question": "0.010 M 강산을 완전히 해리하는 1가 산으로 가정한다. 10배 희석 후 pH는?",
      "answers": {
        "up": "1",
        "left": "2",
        "right": "10",
        "down": "3"
      },
      "correct": "down",
      "explanation": "희석 후 [H⁺]=0.0010 M이므로 pH=3이다. 매우 묽은 영역의 물 자동 이온화 보정은 이 조건에서 무시한다.",
      "sourceNote": "Ⅰ-1,2. 산과염기 · 14쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-011",
      "topic": "중화 반응 · 몰수·희석·혼합",
      "subject": "화학 · 심화 적용",
      "question": "0.10 M HCl 30 mL와 0.10 M NaOH 20 mL를 혼합했다. 남는 종과 몰수는?",
      "answers": {
        "up": "H⁺ 1.0 mmol",
        "left": "OH⁻ 1.0 mmol",
        "right": "H⁺ 5.0 mmol",
        "down": "남는 종 없음"
      },
      "correct": "up",
      "explanation": "산 3.0 mmol과 염기 2.0 mmol이 1:1로 중화되어 H⁺가 1.0 mmol 남는다.",
      "sourceNote": "Ⅰ-0. 화학 중화반응 · 3쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-012",
      "topic": "중화 반응 · 몰수·희석·혼합",
      "subject": "화학 · 심화 적용",
      "question": "0.10 M HCl 10 mL와 0.10 M NaOH 30 mL를 혼합했다. 남은 [OH⁻]는?",
      "answers": {
        "up": "0.025 M",
        "left": "0.050 M",
        "right": "0.20 M",
        "down": "0.10 M"
      },
      "correct": "left",
      "explanation": "OH⁻가 2.0 mmol 남고 총 부피는 40 mL이므로 0.050 M이다.",
      "sourceNote": "Ⅰ-0. 화학 중화반응 · 3쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-013",
      "topic": "중화 반응 · 몰수·희석·혼합",
      "subject": "화학 · 심화 적용",
      "question": "아세트산 20 mL를 0.10 M NaOH 24 mL로 완전히 중화했다. 아세트산 몰농도는?",
      "answers": {
        "up": "0.24 M",
        "left": "1.2 M",
        "right": "0.12 M",
        "down": "0.083 M"
      },
      "correct": "right",
      "explanation": "1:1 반응이므로 산 몰수는 2.4 mmol이다. 이를 산의 원래 부피 20 mL로 나누면 0.12 M이다.",
      "sourceNote": "Ⅰ-0. 화학 중화반응 · 3쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-014",
      "topic": "중화 반응 · 몰수·희석·혼합",
      "subject": "화학 · 심화 적용",
      "question": "산 시료에 물만 추가한 뒤 적정했다. 같은 농도 NaOH로 중화점에 필요한 부피는?",
      "answers": {
        "up": "시료 부피에 비례해 증가",
        "left": "반드시 절반이 된다",
        "right": "물의 몰수만큼 감소",
        "down": "변하지 않는다"
      },
      "correct": "down",
      "explanation": "물 첨가로 산 농도는 낮아지지만 산의 몰수는 그대로다. 같은 몰수의 산을 중화하므로 필요한 NaOH 몰수와 부피가 같다.",
      "sourceNote": "Ⅰ-0. 화학 중화반응 · 3쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-015",
      "topic": "적정 실험 · 그래프와 오차",
      "subject": "화학 · 심화 적용",
      "question": "뷰렛 초기 눈금 1.2 mL, 종말점 눈금 23.6 mL다. 투입한 적정액 부피는?",
      "answers": {
        "up": "22.4 mL",
        "left": "23.6 mL",
        "right": "24.8 mL",
        "down": "1.2 mL"
      },
      "correct": "up",
      "explanation": "투입량은 최종 눈금에서 초기 눈금을 빼서 23.6−1.2=22.4 mL이다.",
      "sourceNote": "실험 정리 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-016",
      "topic": "적정 실험 · 그래프와 오차",
      "subject": "화학 · 심화 적용",
      "question": "산을 염기로 적정하며 종말점을 지나치게 넘겼다. 그 부피로 계산한 산 농도는?",
      "answers": {
        "up": "항상 0으로 계산됨",
        "left": "실제보다 크게 계산됨",
        "right": "실제보다 작게 계산됨",
        "down": "정확히 같음"
      },
      "correct": "left",
      "explanation": "필요량보다 많은 염기를 산과 반응한 몰수로 계산하므로 산 몰수와 농도를 과대평가한다.",
      "sourceNote": "실험 정리 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-017",
      "topic": "적정 실험 · 그래프와 오차",
      "subject": "화학 · 심화 적용",
      "question": "산 시료를 옮기는 피펫 안에 남은 물이 산을 희석했다. 고정 부피를 취해 적정하면 산 농도는?",
      "answers": {
        "up": "산 몰수와 무관하게 같음",
        "left": "반드시 두 배가 됨",
        "right": "실제보다 작게 계산됨",
        "down": "실제보다 크게 계산됨"
      },
      "correct": "right",
      "explanation": "피펫 속에서 희석된 시료를 정해진 부피만큼 취하면 포함된 산 몰수가 작아져 원래 농도를 과소평가한다.",
      "sourceNote": "실험 정리 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-018",
      "topic": "적정 실험 · 그래프와 오차",
      "subject": "화학 · 심화 적용",
      "question": "약산–강염기 적정의 반중화점에서 성립하는 관계는?",
      "answers": {
        "up": "pH=7이 항상 성립",
        "left": "[HA]=0",
        "right": "산이 모두 중화됨",
        "down": "pH=pKa"
      },
      "correct": "down",
      "explanation": "반중화점에서는 HA와 A⁻의 양이 같아 완충식에서 농도비의 로그 항이 0이므로 pH=pKa다.",
      "sourceNote": "실험 정리 · 1쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-019",
      "topic": "염의 가수분해 · 중화점 pH",
      "subject": "화학 · 심화 적용",
      "question": "약산 HA를 강염기로 정확히 중화했다. 25℃에서 중화점이 염기성인 이유는?",
      "answers": {
        "up": "A⁻가 물과 반응해 OH⁻ 생성",
        "left": "Na⁺가 강염기로 해리",
        "right": "HA가 모두 H⁺를 방출",
        "down": "항상 NaOH가 남아 있기 때문"
      },
      "correct": "up",
      "explanation": "중화점에는 화학량론적 과량 NaOH가 없다. 약산의 짝염기 A⁻의 가수분해가 염기성을 만든다.",
      "sourceNote": "Ⅰ-3. 중화적정 · 17쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-020",
      "topic": "염의 가수분해 · 중화점 pH",
      "subject": "화학 · 심화 적용",
      "question": "강산–약염기 적정의 중화점에서 산성을 만드는 주요 종은?",
      "answers": {
        "up": "강산의 짝염기",
        "left": "약염기의 짝산",
        "right": "강산이 반드시 남은 종",
        "down": "물의 산소 원자"
      },
      "correct": "left",
      "explanation": "약염기의 짝산이 물과 반응해 H₃O⁺를 만들어 산성이 될 수 있다. 중화점과 중성을 구별한다.",
      "sourceNote": "Ⅰ-3. 중화적정 · 17쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-021",
      "topic": "염의 가수분해 · 중화점 pH",
      "subject": "화학 · 심화 적용",
      "question": "짝산–짝염기에서 Ka=10⁻⁵, 25℃ Kw=10⁻¹⁴이다. Kb는?",
      "answers": {
        "up": "10⁹",
        "left": "10⁻⁵",
        "right": "10⁻⁹",
        "down": "10⁻¹⁹"
      },
      "correct": "right",
      "explanation": "KaKb=Kw이므로 Kb=10⁻¹⁴/10⁻⁵=10⁻⁹이다.",
      "sourceNote": "Ⅰ-3. 중화적정 · 17쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-022",
      "topic": "염의 가수분해 · 중화점 pH",
      "subject": "화학 · 심화 적용",
      "question": "25℃에서 CH₃COONa와 NaCl 용액을 비교한다. 가수분해로 염기성을 보이는 쪽은?",
      "answers": {
        "up": "NaCl",
        "left": "두 용액 모두 강산성",
        "right": "두 용액 모두 강염기성",
        "down": "CH₃COONa"
      },
      "correct": "down",
      "explanation": "아세트산 이온은 약산의 짝염기로 가수분해한다. NaCl의 이온은 이 수준에서 유의한 산·염기 가수분해를 하지 않는다.",
      "sourceNote": "Ⅰ-3. 중화적정 · 17쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-023",
      "topic": "완충 작용 · 원리와 실험 비교",
      "subject": "화학 · 심화 적용",
      "question": "HA/A⁻ 완충 용액에 소량의 강산을 넣었다. H⁺를 주로 소비하는 종은?",
      "answers": {
        "up": "A⁻",
        "left": "HA",
        "right": "물속 Na⁺",
        "down": "새로 생긴 OH⁻만"
      },
      "correct": "up",
      "explanation": "짝염기 A⁻가 H⁺를 받아 HA가 되므로 자유 H⁺의 증가와 pH 변화가 억제된다.",
      "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-024",
      "topic": "완충 작용 · 원리와 실험 비교",
      "subject": "화학 · 심화 적용",
      "question": "HA/A⁻ 완충 용액에 소량의 강염기를 넣었다. OH⁻를 주로 소비하는 종은?",
      "answers": {
        "up": "용기의 유리",
        "left": "HA",
        "right": "A⁻",
        "down": "Na⁺"
      },
      "correct": "left",
      "explanation": "HA가 OH⁻와 반응해 A⁻와 물을 만들어 pH 상승을 억제한다.",
      "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-025",
      "topic": "완충 작용 · 원리와 실험 비교",
      "subject": "화학 · 심화 적용",
      "question": "pKa=4.8, [A⁻]/[HA]=10인 완충 용액의 pH는?",
      "answers": {
        "up": "4.8",
        "left": "10.0",
        "right": "5.8",
        "down": "3.8"
      },
      "correct": "right",
      "explanation": "pH=pKa+log([A⁻]/[HA])=4.8+1=5.8이다.",
      "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽 · 개념 적용 문제"
    },
    {
      "id": "practice-depth-chemistry-026",
      "topic": "완충 작용 · 원리와 실험 비교",
      "subject": "화학 · 심화 적용",
      "question": "같은 산/짝염기 비율로 완충 용액을 희석했다. pH와 단위 부피당 완충 용량의 변화는?",
      "answers": {
        "up": "pH와 완충 용량 모두 증가",
        "left": "pH가 항상 7로 즉시 변함",
        "right": "완충 용량은 항상 일정",
        "down": "pH는 거의 같고 완충 용량 감소"
      },
      "correct": "down",
      "explanation": "유효한 완충 범위에서 농도비가 같으면 pH는 대체로 유지된다. 희석으로 농도가 낮아지므로 같은 부피를 비교할 때 산·염기를 받아낼 수 있는 양과 단위 부피당 완충 용량은 감소한다.",
      "sourceNote": "Ⅰ-5. 완충 작용 · 6쪽 · 개념 적용 문제"
    }
  ]
};
