export interface ConceptSection {
  heading: string;
  paragraphs?: string[];
  points?: string[];
  table?: { columns: string[]; rows: string[][] };
}
export interface ConceptLesson {
  id: string; deckId: string; title: string; summary: string; sections: ConceptSection[];
  sourceNote: string; topicKeys: string[];
  examples?: { id: string; context: string; explanation: string; sourceNote: string }[];
}
export const studyConcepts: ConceptLesson[] = [
  {
    "id": "biology-jo-concept-1",
    "deckId": "biology-jo",
    "title": "중심원리와 RNA",
    "summary": "유전 정보는 보통 DNA에서 RNA로 전사되고 RNA의 코돈을 바탕으로 단백질로 번역된다. RNA는 정보를 전달할 뿐 아니라 운반·촉매·가공·조절 기능도 수행한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "mRNA: 번역 주형",
          "tRNA: 안티코돈으로 코돈 인식·아미노산 운반",
          "rRNA: 리보솜 구성·촉매",
          "snRNA: 스플라이싱 / snoRNA: rRNA 가공",
          "miRNA·siRNA: 표적 RNA를 통한 발현 조절"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "DNA→RNA는 전사, RNA→단백질은 번역이다. 역전사는 RNA→DNA이며 단백질→DNA라는 뜻은 아니다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "모든 RNA가 단백질을 암호화한다고 생각하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "biology-jo-001",
        "context": "조용민T · 일반적인 중심원리의 정보 흐름은?",
        "explanation": "DNA에서 RNA로 전사되고 mRNA 정보에 따라 단백질이 번역된다.",
        "sourceNote": "유전자의 발현 수업자료 · 3쪽"
      },
      {
        "id": "biology-jo-002",
        "context": "조용민T · 역전사가 뜻하는 것은?",
        "explanation": "역전사는 RNA 정보를 DNA로 옮기는 과정이다.",
        "sourceNote": "유전자의 발현 수업자료 · 3쪽"
      },
      {
        "id": "biology-jo-003",
        "context": "조용민T · mRNA의 주된 역할은?",
        "explanation": "mRNA의 코돈 배열이 번역되는 아미노산 순서를 결정한다.",
        "sourceNote": "유전자의 발현 수업자료 · 4쪽"
      },
      {
        "id": "biology-jo-004",
        "context": "조용민T · tRNA의 주된 역할은?",
        "explanation": "tRNA는 안티코돈으로 코돈을 인식하고 아미노산을 리보솜에 전달한다.",
        "sourceNote": "유전자의 발현 수업자료 · 4쪽"
      },
      {
        "id": "biology-jo-005",
        "context": "조용민T · snRNA가 관여하는 과정은?",
        "explanation": "snRNA는 단백질과 snRNP를 이루어 pre-mRNA 스플라이싱에 관여한다.",
        "sourceNote": "유전자의 발현 수업자료 · 4쪽"
      },
      {
        "id": "biology-jo-006",
        "context": "조용민T · snoRNA의 대표적인 기능은?",
        "explanation": "작은 핵인 RNA는 핵인에서 rRNA 가공에 관여한다.",
        "sourceNote": "유전자의 발현 수업자료 · 4쪽"
      },
      {
        "id": "biology-jo-007",
        "context": "조용민T · miRNA의 대표적인 작용은?",
        "explanation": "miRNA는 표적 mRNA에 작용해 번역 억제나 분해를 통한 발현 조절에 관여한다.",
        "sourceNote": "유전자의 발현 수업자료 · 4쪽"
      }
    ],
    "topicKeys": [
      "중심원리와 RNA"
    ]
  },
  {
    "id": "biology-jo-concept-2",
    "deckId": "biology-jo",
    "title": "전사",
    "summary": "RNA 중합효소는 DNA 주형을 읽어 상보적인 RNA를 만든다. 원핵과 진핵은 개시 인식과 중합효소 종류에서 차이가 난다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "주형을 3′→5′으로 읽고 RNA는 5′→3′으로 합성",
          "원핵 완전효소=핵심효소+σ 인자",
          "σ 인자는 프로모터 인식 후 이탈",
          "진핵 I: 28S·18S·5.8S rRNA / II: mRNA / III: tRNA·5S rRNA"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "주형 3′-TACGGA-5′에 대응하는 RNA는 5′-AUGCCU-3′이다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "주형 가닥과 암호화 가닥을 혼동하거나 RNA에 T를 넣지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "biology-jo-008",
        "context": "조용민T · RNA 중합효소의 합성 방향은?",
        "explanation": "RNA는 3′ 말단에 뉴클레오타이드가 추가되므로 5′에서 3′으로 합성된다.",
        "sourceNote": "유전자의 발현 수업자료 · 9쪽"
      },
      {
        "id": "biology-jo-009",
        "context": "조용민T · 전사할 때 DNA 주형 가닥을 읽는 방향은?",
        "explanation": "주형을 3′→5′으로 읽으면서 상보적인 RNA를 5′→3′으로 합성한다.",
        "sourceNote": "유전자의 발현 수업자료 · 9쪽"
      },
      {
        "id": "biology-jo-010",
        "context": "조용민T · DNA 주형 3′-TACGGA-5′에서 합성되는 RNA는?",
        "explanation": "RNA에는 T 대신 U가 사용되며 주형과 상보적·역평행이다.",
        "sourceNote": "유전자의 발현 수업자료 · 9쪽"
      },
      {
        "id": "biology-jo-011",
        "context": "조용민T · 원핵세포 σ 인자의 기능은?",
        "explanation": "σ 인자는 RNA 중합효소 완전효소가 프로모터를 인식하게 하며 개시 후 떨어진다.",
        "sourceNote": "유전자의 발현 수업자료 · 6쪽"
      },
      {
        "id": "biology-jo-012",
        "context": "조용민T · 원핵 RNA 중합효소 완전효소의 구성은?",
        "explanation": "핵심효소에 σ 인자가 결합하면 프로모터 인식이 가능한 완전효소가 된다.",
        "sourceNote": "유전자의 발현 수업자료 · 6쪽"
      },
      {
        "id": "biology-jo-013",
        "context": "조용민T · 원핵 프로모터의 대표적인 공통서열 위치는?",
        "explanation": "전사 시작점을 +1로 할 때 상류의 −35, −10 부위가 프로모터 인식에 중요하다.",
        "sourceNote": "유전자의 발현 수업자료 · 8쪽"
      },
      {
        "id": "biology-jo-014",
        "context": "조용민T · RNA 중합효소 I의 대표적인 산물은?",
        "explanation": "진핵 RNA 중합효소 I은 인에서 주요 rRNA 전구체를 합성하며 5S rRNA는 III의 산물이다.",
        "sourceNote": "유전자의 발현 수업자료 · 10쪽"
      },
      {
        "id": "biology-jo-015",
        "context": "조용민T · 진핵 mRNA를 주로 합성하는 효소는?",
        "explanation": "RNA 중합효소 II는 mRNA와 여러 작은 RNA의 전사를 담당한다.",
        "sourceNote": "유전자의 발현 수업자료 · 10쪽"
      },
      {
        "id": "biology-jo-016",
        "context": "조용민T · RNA 중합효소 III의 대표적인 산물은?",
        "explanation": "5S rRNA와 tRNA는 III에 의해 전사된다.",
        "sourceNote": "유전자의 발현 수업자료 · 10쪽"
      },
      {
        "id": "biology-jo-017",
        "context": "조용민T · 자료의 α-아마니틴에 가장 민감한 효소는?",
        "explanation": "자료에서 II는 매우 저해, I은 저해되지 않으며 III은 약간 저해되는 것으로 제시된다.",
        "sourceNote": "유전자의 발현 수업자료 · 10쪽"
      }
    ],
    "topicKeys": [
      "전사"
    ]
  },
  {
    "id": "biology-jo-concept-3",
    "deckId": "biology-jo",
    "title": "RNA 가공",
    "summary": "진핵의 pre-mRNA는 가공되어 안정성과 번역 가능성을 갖춘 성숙 mRNA가 된다. 가공 뒤에도 번역되지 않는 UTR은 남을 수 있다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "5′ cap: 7-메틸구아노신 첨가",
          "스플라이싱: 인트론 제거·엑손 연결",
          "3′ 절단 뒤 PAP가 poly-A 꼬리 첨가",
          "snRNP=snRNA+단백질",
          "선택적 스플라이싱은 엑손 조합을 달리해 산물 다양성 증가"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "같은 pre-mRNA에서 엑손 1-2-4 또는 1-3-4가 이어지면 서로 다른 성숙 mRNA가 생길 수 있다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "UTR을 모두 인트론이라고 하거나 poly-A를 DNA의 T 연속 구간을 그대로 전사한 것으로 보지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "biology-jo-018",
        "context": "조용민T · 진핵 mRNA 5′ cap에 첨가되는 물질은?",
        "explanation": "5′ cap은 7-메틸구아노신 구조로 mRNA 보호와 번역 개시에 관여한다.",
        "sourceNote": "유전자의 발현 수업자료 · 13쪽"
      },
      {
        "id": "biology-jo-019",
        "context": "조용민T · 스플라이싱의 결과는?",
        "explanation": "pre-mRNA에서 인트론을 제거하고 엑손들을 연결해 성숙 mRNA를 만든다.",
        "sourceNote": "유전자의 발현 수업자료 · 13쪽"
      },
      {
        "id": "biology-jo-020",
        "context": "조용민T · snRNP의 구성은?",
        "explanation": "snRNP들이 스플라이시오솜을 구성하며 RNA 성분도 촉매 기능에 관여한다.",
        "sourceNote": "유전자의 발현 수업자료 · 13쪽"
      },
      {
        "id": "biology-jo-021",
        "context": "조용민T · poly-A 꼬리를 첨가하는 효소는?",
        "explanation": "절단된 RNA의 3′ 말단에 PAP가 A를 첨가한다. 꼬리는 DNA의 T 연속서열을 그대로 전사한 것이 아니다.",
        "sourceNote": "유전자의 발현 수업자료 · 14쪽"
      },
      {
        "id": "biology-jo-022",
        "context": "조용민T · 성숙 mRNA의 UTR에 대한 설명은?",
        "explanation": "5′·3′ UTR은 성숙 mRNA에 남아 번역과 안정성 등의 조절에 관여한다.",
        "sourceNote": "유전자의 발현 수업자료 · 12쪽"
      },
      {
        "id": "biology-jo-023",
        "context": "조용민T · 선택적 스플라이싱의 결과는?",
        "explanation": "엑손 조합을 달리하여 한 유전자에서 다양한 mRNA와 단백질 산물이 만들어질 수 있다.",
        "sourceNote": "유전자의 발현 수업자료 · 35쪽"
      }
    ],
    "topicKeys": [
      "RNA 가공"
    ]
  },
  {
    "id": "biology-jo-concept-4",
    "deckId": "biology-jo",
    "title": "유전 암호와 번역",
    "summary": "리보솜은 mRNA를 5′→3′으로 읽고 폴리펩타이드를 N말단→C말단으로 신장한다. 코돈 인식과 아미노산 부착은 서로 다른 단계다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "64개 코돈 중 61개는 아미노산·3개는 종결",
          "tRNA 3′ CCA에 합성효소가 ATP를 사용해 아미노산 부착",
          "동요: 코돈 3번째·안티코돈 1번째 염기",
          "원핵 SD 서열은 16S rRNA와 결합",
          "개시 tRNA는 P 자리·다음 tRNA는 A 자리",
          "23S rRNA는 펩타이드 결합 촉매·종결은 방출 인자"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "원핵 리보솜은 70S(50S+30S), 진핵 세포질은 80S(60S+40S)이다. S는 침강계수여서 단순 합이 아니다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "종결 코돈을 읽는 전용 tRNA가 있다고 하거나 단백질 방향을 5′→3′이라고 쓰지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "biology-jo-024",
        "context": "조용민T · 단백질 합성에 쓰이는 일반적인 아미노산 코돈 수는?",
        "explanation": "총 64개 코돈 중 UAA, UAG, UGA는 종결 코돈이므로 아미노산 코돈은 61개이다.",
        "sourceNote": "유전자의 발현 수업자료 · 15쪽"
      },
      {
        "id": "biology-jo-025",
        "context": "조용민T · 유전 암호의 중복성이 뜻하는 것은?",
        "explanation": "여러 코돈이 같은 아미노산을 지정할 수 있지만 각 코돈의 의미는 일반적으로 특정된다.",
        "sourceNote": "유전자의 발현 수업자료 · 15쪽"
      },
      {
        "id": "biology-jo-026",
        "context": "조용민T · tRNA의 아미노산 결합 부위는?",
        "explanation": "tRNA 3′ 말단의 CCA 끝에 특정 아미노산이 결합한다.",
        "sourceNote": "유전자의 발현 수업자료 · 16쪽"
      },
      {
        "id": "biology-jo-027",
        "context": "조용민T · 아미노아실-tRNA 합성효소의 역할은?",
        "explanation": "ATP를 사용해 아미노산을 활성화하고 알맞은 tRNA에 연결하여 번역의 정확성을 높인다.",
        "sourceNote": "유전자의 발현 수업자료 · 17쪽"
      },
      {
        "id": "biology-jo-028",
        "context": "조용민T · 동요 가설에서 유연한 결합이 일어나는 위치는?",
        "explanation": "코돈 3번째와 안티코돈 1번째 염기의 결합이 상대적으로 유연하여 하나의 tRNA가 여러 코돈을 인식한다.",
        "sourceNote": "유전자의 발현 수업자료 · 18쪽"
      },
      {
        "id": "biology-jo-029",
        "context": "조용민T · 원핵 리보솜의 펩타이드기 전이효소 활성을 갖는 성분은?",
        "explanation": "큰 소단위의 23S rRNA가 펩타이드 결합 형성의 촉매 중심을 이룬다.",
        "sourceNote": "유전자의 발현 수업자료 · 19쪽"
      },
      {
        "id": "biology-jo-030",
        "context": "조용민T · 샤인-달가르노 서열이 상보적으로 결합하는 것은?",
        "explanation": "원핵 mRNA의 SD 서열이 소단위 16S rRNA와 결합하여 개시 위치를 맞춘다.",
        "sourceNote": "유전자의 발현 수업자료 · 20쪽"
      },
      {
        "id": "biology-jo-031",
        "context": "조용민T · 원핵 리보솜 70S의 소단위 조합은?",
        "explanation": "S는 침강계수이므로 단순 산술 합이 아니며 진핵 세포질 리보솜은 80S(60S+40S)이다.",
        "sourceNote": "유전자의 발현 수업자료 · 19쪽"
      },
      {
        "id": "biology-jo-032",
        "context": "조용민T · 세균 번역 개시 tRNA가 처음 자리하는 곳은?",
        "explanation": "개시 tRNA는 P 자리에 위치하며 다음 아미노아실-tRNA가 A 자리로 들어온다.",
        "sourceNote": "유전자의 발현 수업자료 · 21쪽"
      },
      {
        "id": "biology-jo-033",
        "context": "조용민T · 세균의 대표적인 개시 아미노산은?",
        "explanation": "세균의 개시에는 변형된 메티오닌인 포밀메티오닌(fMet)이 사용된다.",
        "sourceNote": "유전자의 발현 수업자료 · 21쪽"
      },
      {
        "id": "biology-jo-034",
        "context": "조용민T · 신장 중 A 자리에 들어오는 것은?",
        "explanation": "다음 코돈에 대응하는 아미노산을 실은 tRNA가 A 자리에 들어온다.",
        "sourceNote": "유전자의 발현 수업자료 · 22쪽"
      },
      {
        "id": "biology-jo-035",
        "context": "조용민T · 폴리펩타이드가 신장되는 방향은?",
        "explanation": "새 아미노산은 사슬의 C말단 쪽에 추가되어 N에서 C로 신장된다.",
        "sourceNote": "유전자의 발현 수업자료 · 22쪽"
      },
      {
        "id": "biology-jo-036",
        "context": "조용민T · 번역 신장에서 GTP가 사용되는 과정은?",
        "explanation": "신장 인자는 GTP를 사용하여 아미노아실-tRNA 도입과 한 코돈씩의 이동을 돕는다.",
        "sourceNote": "유전자의 발현 수업자료 · 22쪽"
      },
      {
        "id": "biology-jo-037",
        "context": "조용민T · 종결 코돈을 인식하는 것은?",
        "explanation": "종결 코돈에는 아미노산을 운반하는 tRNA 대신 방출 인자가 작용해 사슬을 방출한다.",
        "sourceNote": "유전자의 발현 수업자료 · 23쪽"
      },
      {
        "id": "biology-jo-038",
        "context": "조용민T · 폴리리보솜에 대한 설명은?",
        "explanation": "여러 리보솜이 한 mRNA를 번역하여 단백질 합성 효율을 높인다.",
        "sourceNote": "유전자의 발현 수업자료 · 24쪽"
      },
      {
        "id": "biology-jo-039",
        "context": "조용민T · 원핵에서 전사와 번역의 동시 진행이 가능한 이유는?",
        "explanation": "원핵에는 핵막이 없어 전사 중인 mRNA에 리보솜이 결합할 수 있다.",
        "sourceNote": "유전자의 발현 수업자료 · 25쪽"
      }
    ],
    "topicKeys": [
      "유전 암호와 번역"
    ]
  },
  {
    "id": "biology-jo-concept-5",
    "deckId": "biology-jo",
    "title": "유전자 발현 조절",
    "summary": "발현은 염색질 상태부터 전사·RNA 가공·번역·단백질 분해까지 조절될 수 있다. lac 오페론은 억제 해제와 양성 조절을 함께 고려한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "젖당 없음: 억제 단백질이 작동자 결합",
          "젖당 있음: 유도물질이 억제 단백질 작용 약화",
          "포도당 낮음: cAMP 증가·CAP 활성화",
          "젖당 있음+포도당 없음: 최대 발현",
          "히스톤 아세틸화는 전사 촉진 경향·프로모터 DNA 메틸화는 억제 경향",
          "인핸서와 특수 전사 인자의 조합은 세포별 발현에 관여"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "젖당과 포도당이 모두 있으면 억제는 풀려도 CAP 활성화가 약하므로 최대 발현이 아니다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "젖당 유무만으로 최대 발현을 결정하지 않는다. 모든 메틸화 위치의 효과를 동일하게 일반화하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "biology-jo-040",
        "context": "조용민T · 자료의 오페론 구성 요소에 포함되지 않는 것은?",
        "explanation": "조절 유전자는 억제 단백질 등을 만들지만 자료에서는 오페론 자체의 구성 요소와 구별된다.",
        "sourceNote": "유전자의 발현 수업자료 · 27쪽"
      },
      {
        "id": "biology-jo-041",
        "context": "조용민T · 젖당이 없을 때 lac 억제 단백질은?",
        "explanation": "억제 단백질이 작동자에 결합해 구조 유전자 전사를 억제한다.",
        "sourceNote": "유전자의 발현 수업자료 · 28쪽"
      },
      {
        "id": "biology-jo-042",
        "context": "조용민T · 젖당 존재가 lac 억제를 풀어 주는 방식은?",
        "explanation": "젖당에서 유래한 알로락토스가 억제 단백질에 결합하여 작동자 결합을 약화시킨다.",
        "sourceNote": "유전자의 발현 수업자료 · 28쪽"
      },
      {
        "id": "biology-jo-043",
        "context": "조용민T · lac 오페론이 가장 강하게 발현되는 조건은?",
        "explanation": "억제가 풀리고 높은 cAMP에 의해 CAP가 활성화되어 RNA 중합효소의 프로모터 결합을 촉진한다.",
        "sourceNote": "유전자의 발현 수업자료 · 29쪽"
      },
      {
        "id": "biology-jo-044",
        "context": "조용민T · 포도당 농도가 낮을 때 일반적으로 cAMP와 CAP의 상태는?",
        "explanation": "포도당 감소 시 cAMP가 증가하고 cAMP–CAP 복합체가 전사를 촉진한다.",
        "sourceNote": "유전자의 발현 수업자료 · 29쪽"
      },
      {
        "id": "biology-jo-045",
        "context": "조용민T · 젖당과 포도당이 모두 있을 때 lac 발현은?",
        "explanation": "젖당으로 억제가 풀려도 포도당이 있으면 CAP에 의한 활성화가 약해 발현이 낮다.",
        "sourceNote": "유전자의 발현 수업자료 · 29쪽"
      },
      {
        "id": "biology-jo-046",
        "context": "조용민T · 히스톤 아세틸화의 일반적인 효과는?",
        "explanation": "히스톤 아세틸화는 DNA와의 결합을 약화시켜 전사 접근성을 높이는 경향이 있다.",
        "sourceNote": "유전자의 발현 수업자료 · 31쪽"
      },
      {
        "id": "biology-jo-047",
        "context": "조용민T · 프로모터 부근 DNA 메틸화의 일반적인 효과는?",
        "explanation": "조절 부위의 DNA 메틸화는 보통 유전자 발현 억제와 관련된다. 모든 위치에 같은 규칙을 적용하지는 않는다.",
        "sourceNote": "유전자의 발현 수업자료 · 32쪽"
      },
      {
        "id": "biology-jo-048",
        "context": "조용민T · 인핸서에 대한 설명으로 옳은 것은?",
        "explanation": "인핸서는 상류·하류·인트론 등에 존재할 수 있고 특정 활성자의 결합으로 전사를 조절한다.",
        "sourceNote": "유전자의 발현 수업자료 · 33쪽"
      },
      {
        "id": "biology-jo-049",
        "context": "조용민T · 진핵의 유전자 발현 조절은 언제 가능한가?",
        "explanation": "염색질, 전사, RNA 가공, 번역, 번역 후 가공과 분해에서 조절할 수 있다.",
        "sourceNote": "유전자의 발현 수업자료 · 30쪽"
      }
    ],
    "topicKeys": [
      "유전자 발현 조절"
    ]
  },
  {
    "id": "biology-jo-concept-6",
    "deckId": "biology-jo",
    "title": "세포 분화와 발생",
    "summary": "대부분의 유핵 체세포는 같은 유전체를 공유하지만 선택적으로 발현되는 유전자와 단백질이 달라 구조와 기능이 달라진다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "전사 인자의 조합이 선택적 발현 결정",
          "MyoD: 근육 관련 전사 조절",
          "Hox: 몸의 부위 정체성과 체절 구조 조절",
          "배아줄기세포와 iPS는 다형성능",
          "iPS: 분화된 체세포의 재프로그래밍"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "근육세포와 신경세포의 차이는 일반적으로 DNA 전체가 달라서가 아니라 발현 양상이 달라서 생긴다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "iPS의 윤리·면역상 장점을 모든 임상 위험이 사라진다는 말로 확대하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "biology-jo-050",
        "context": "조용민T · 같은 개체의 근육세포와 신경세포가 다른 주된 이유는?",
        "explanation": "대부분의 유핵 체세포는 같은 유전체를 공유하지만 선택적으로 발현하는 유전자와 단백질이 다르다.",
        "sourceNote": "유전자의 발현 수업자료 · 39쪽"
      },
      {
        "id": "biology-jo-051",
        "context": "조용민T · myoD 유전자가 만드는 핵심 조절 산물의 기능은?",
        "explanation": "MyoD는 근육 분화에 관여하는 전사 인자로 관련 유전자 발현을 조절한다.",
        "sourceNote": "유전자의 발현 수업자료 · 40쪽"
      },
      {
        "id": "biology-jo-052",
        "context": "조용민T · Hox 유전자의 대표적인 역할은?",
        "explanation": "체절별 Hox 발현 차이가 각 부위의 구조 형성에 관여한다.",
        "sourceNote": "유전자의 발현 수업자료 · 43쪽"
      },
      {
        "id": "biology-jo-053",
        "context": "조용민T · 유도 만능 줄기세포(iPS)의 제작 원리는?",
        "explanation": "특정 인자를 도입해 체세포를 다형성능을 가진 상태로 되돌린다.",
        "sourceNote": "유전자의 발현 수업자료 · 44쪽"
      },
      {
        "id": "biology-jo-054",
        "context": "조용민T · 환자 유래 iPS 세포의 기대 장점은?",
        "explanation": "환자 자신의 체세포를 사용하면 면역 부적합을 줄일 수 있으나 안전성과 품질 검증이 필요하다.",
        "sourceNote": "유전자의 발현 수업자료 · 44쪽"
      }
    ],
    "topicKeys": [
      "세포 분화와 발생"
    ]
  },
  {
    "id": "biology-park-concept-1",
    "deckId": "biology-park",
    "title": "유전의 기본 원리",
    "summary": "대립유전자는 상동염색체의 같은 좌위에 있는 유전자의 서로 다른 형태다. 유전자형은 유전자의 조합, 표현형은 관찰되는 성질이다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "상동염색체: 부계·모계 쌍 / 자매염색분체: 복제 산물",
          "분리의 법칙: 감수 1분열의 상동염색체 분리",
          "독립의 법칙: 서로 다른 염색체 쌍의 독립 배열·분리",
          "연관 유전자는 교차를 고려",
          "완전 우성 Aa×Aa: 유전자형 1:2:1·표현형 3:1"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "독립인 AaBb×AaBb에서 aabb=1/4×1/4=1/16이다. 복제 직후 DNA 양은 늘지만 동원체 기준 염색체 수는 그대로다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "우성을 더 우수하거나 더 흔한 형질이라고 해석하지 않는다. 독립 조건 없는 교배에 확률 곱을 무조건 적용하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "biology-park-001",
        "context": "박상영T · 상동염색체의 같은 유전자 좌위에 있는 서로 다른 형태의 유전자는?",
        "explanation": "대립유전자는 같은 좌위에서 특정 형질에 관여하며 두 상동염색체의 대립유전자는 같거나 다를 수 있다.",
        "sourceNote": "박상영T 필기 · 1쪽"
      },
      {
        "id": "biology-park-002",
        "context": "박상영T · Aa와 같은 기호로 나타내는 것은?",
        "explanation": "유전자형은 대립유전자의 조합이며 표현형은 관찰되는 특성이다.",
        "sourceNote": "박상영T 필기 · 1쪽"
      },
      {
        "id": "biology-park-003",
        "context": "박상영T · 완전 우성에서 Aa가 우성 표현형인 이유는?",
        "explanation": "열성 대립유전자는 없어지지 않고 생식세포로 전달될 수 있다.",
        "sourceNote": "박상영T 필기 · 1쪽"
      },
      {
        "id": "biology-park-004",
        "context": "박상영T · Aa × Aa의 자손에서 유전자형 비율은?",
        "explanation": "각 부모가 A와 a 생식세포를 같은 확률로 만들어 AA 1/4, Aa 1/2, aa 1/4이다.",
        "sourceNote": "박상영T 필기 · 1쪽"
      },
      {
        "id": "biology-park-005",
        "context": "박상영T · 완전 우성에서 Aa × aa의 우성 표현형 확률은?",
        "explanation": "Aa는 A와 a를 반씩, aa는 a만 전달하므로 Aa와 aa가 1:1이다.",
        "sourceNote": "박상영T 필기 · 1쪽"
      },
      {
        "id": "biology-park-006",
        "context": "박상영T · 분리의 법칙의 세포학적 근거는?",
        "explanation": "상동염색체에 놓인 대립유전자가 감수 1분열에서 서로 분리된다.",
        "sourceNote": "박상영T 필기 · 1쪽"
      },
      {
        "id": "biology-park-007",
        "context": "박상영T · 유전자 A/a와 B/b가 서로 다른 염색체에 있을 때 AaBb의 생식세포 종류는?",
        "explanation": "두 염색체 쌍이 독립적으로 분리되어 네 종류가 각각 1/4이다.",
        "sourceNote": "박상영T 필기 · 1쪽"
      },
      {
        "id": "biology-park-008",
        "context": "박상영T · 완전 우성·독립 유전인 AaBb × AaBb의 aabb 확률은?",
        "explanation": "aa 확률 1/4와 bb 확률 1/4를 곱하면 1/16이다.",
        "sourceNote": "박상영T 필기 · 1쪽"
      },
      {
        "id": "biology-park-009",
        "context": "박상영T · 완전 우성·독립 유전인 AaBb × aabb의 표현형 비율은?",
        "explanation": "검정교배에서는 AaBb가 만드는 네 생식세포가 자손의 표현형에 반영된다.",
        "sourceNote": "박상영T 필기 · 1쪽"
      },
      {
        "id": "biology-park-010",
        "context": "박상영T · 연관된 두 유전자에 대해 옳은 것은?",
        "explanation": "같은 염색체의 유전자는 연관되지만 교차로 재조합될 수 있다.",
        "sourceNote": "박상영T 필기 · 1쪽"
      },
      {
        "id": "biology-park-011",
        "context": "박상영T · 자매염색분체와 상동염색체를 옳게 구별한 것은?",
        "explanation": "자매염색분체는 DNA 복제 후 연결된 두 가닥이며 상동염색체는 같은 유전자 좌위를 갖는 부계·모계 염색체다.",
        "sourceNote": "박상영T 필기 · 1쪽"
      },
      {
        "id": "biology-park-012",
        "context": "박상영T · DNA 복제 직후 체세포에서 변하는 것은?",
        "explanation": "염색체 수는 동원체를 기준으로 세므로 복제 직후에도 동일하고 DNA 양만 2배이다.",
        "sourceNote": "박상영T 필기 · 1쪽"
      }
    ],
    "topicKeys": [
      "유전의 기본 원리"
    ]
  },
  {
    "id": "biology-park-concept-2",
    "deckId": "biology-park",
    "title": "사람의 유전",
    "summary": "사람의 유전은 긴 세대·적은 자손·교배 제한 때문에 가계도와 쌍둥이 연구 등을 이용한다. 성별과 부모-자녀 전달 경로를 함께 읽는다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "정상 부모의 열성 자녀는 부모가 모두 보인자일 수 있음",
          "상염색체와 X·Y 연관 유전 구분",
          "X 연관 유전에서 아들은 아버지의 Y·어머니의 X",
          "복대립유전: 한 좌위의 여러 대립유전자 / 다유전자유전: 여러 좌위가 한 형질 결정",
          "ABO: Iᴬ와 Iᴮ 공동 우성·i 열성",
          "H 물질이 없는 hh는 A·B 항원 형성에 영향"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "Aa×Aa에서 정상 자녀 중 보인자 확률은 2/3이다. Iᴬi×Iᴮi에서는 A·B·AB·O가 각각 1/4이다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "아들 중 발병 확률과 전체 자녀 중 확률을 혼동하지 않는다. 개인이 복대립유전의 모든 대립유전자를 갖는 것은 아니다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "biology-park-013",
        "context": "박상영T · 사람의 유전 연구가 완두보다 어려운 주된 이유는?",
        "explanation": "의도적인 교배가 어렵고 세대 기간이 길며 자손 수가 적어서 통계적 분석이 어렵다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-014",
        "context": "박상영T · 일란성 쌍둥이의 형질 일치율이 이란성보다 높을 때 시사하는 것은?",
        "explanation": "일란성은 유전적 구성이 매우 유사하므로 일치율 차이는 유전적 영향의 근거지만 환경도 고려해야 한다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-015",
        "context": "박상영T · 정상 부모 둘 사이에서 열성 유전병 자녀 aa가 태어났다. 부모 유전자형은?",
        "explanation": "자녀에게 각각 a를 전달하면서 정상인 부모는 모두 보인자 Aa이다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-016",
        "context": "박상영T · 상염색체 열성 유전병에서 Aa × Aa의 정상 자녀가 보인자일 조건부 확률은?",
        "explanation": "정상 자녀 AA:Aa는 1:2이므로 보인자 확률은 2/3이다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-017",
        "context": "박상영T · X 연관 열성에서 보인자 어머니와 정상 아버지의 아들 중 발병 확률은?",
        "explanation": "아들은 아버지의 Y와 어머니의 X를 받으며 어머니가 열성 X를 줄 확률은 1/2이다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-018",
        "context": "박상영T · X 연관 열성에서 발병 아버지와 정상 비보인자 어머니의 딸은?",
        "explanation": "딸은 아버지의 열성 X와 어머니의 정상 X를 받아 모두 보인자가 된다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-019",
        "context": "박상영T · Y 연관 형질의 전형적인 전달 경로는?",
        "explanation": "Y 염색체는 아버지에게서 아들로 전달된다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-020",
        "context": "박상영T · ABO 혈액형이 복대립유전인 이유는?",
        "explanation": "복대립유전은 집단에 세 종류 이상 대립유전자가 있는 것으로 개인은 한 좌위에 두 개를 갖는다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-021",
        "context": "박상영T · Iᴬ와 Iᴮ의 관계는?",
        "explanation": "AB형에서는 A와 B 항원이 모두 발현된다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-022",
        "context": "박상영T · Iᴬi × Iᴮi에서 O형 자녀 확률은?",
        "explanation": "가능한 유전자형은 IᴬIᴮ, Iᴬi, Iᴮi, ii가 각각 1/4이다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-023",
        "context": "박상영T · IᴬIᴮ × ii에서 가능한 자녀 혈액형은?",
        "explanation": "AB형 부모는 Iᴬ 또는 Iᴮ를, O형 부모는 i를 전달한다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-024",
        "context": "박상영T · ABO 항원 형성에 필요한 H 물질이 없는 hh 개체의 겉보기 혈액형은?",
        "explanation": "봄베이 표현형은 H 물질 결핍으로 A/B 항원이 만들어지지 않아 겉보기 O형이 된다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-025",
        "context": "박상영T · 다유전자유전의 대표적인 특징은?",
        "explanation": "키·피부색 등의 형질에는 여러 유전자와 환경 요인이 관여한다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      }
    ],
    "topicKeys": [
      "사람의 유전"
    ]
  },
  {
    "id": "biology-park-concept-3",
    "deckId": "biology-park",
    "title": "사람의 유전병",
    "summary": "돌연변이는 DNA 염기서열이나 염색체의 수·구조 변화다. 생식세포 변이는 자손에게 전달될 수 있으며 체세포 변이와 구분한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "1분열 비분리: n+1 두 개·n−1 두 개",
          "2분열 한 세포 비분리: 정상 n 두 개·n+1 한 개·n−1 한 개",
          "대표 핵형: 다운 21번 삼염색체·클라인펠터 XXY·터너 45,X",
          "구조 이상: 결실·중복·역위·전좌",
          "치환: 동의적·미스센스·넌센스 / 3의 배수 아닌 삽입·결실: 프레임시프트"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "암호화 구간의 1개 염기 결실은 읽는 틀을 바꿀 수 있다. 3개 결실은 뒤쪽 틀을 유지해도 단백질 기능에 영향을 줄 수 있다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "모든 치환이 아미노산을 바꾸거나 모든 돌연변이가 자손에게 전달되는 것은 아니다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "biology-park-026",
        "context": "박상영T · 감수 1분열에서 한 염색체 쌍이 비분리되고 나머지는 정상일 때 생식세포는?",
        "explanation": "상동염색체가 분리되지 않아 감수 1분열 산물에 염색체 하나가 과다 또는 결핍되고 네 생식세포 모두 비정상이다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-027",
        "context": "박상영T · 감수 2분열의 한 세포에서만 비분리될 때 생식세포는?",
        "explanation": "감수 1분열이 정상이라 다른 한 세포의 두 생식세포는 정상이다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-028",
        "context": "박상영T · 다운 증후군의 대표적인 염색체 수 이상은?",
        "explanation": "전형적인 다운 증후군은 21번 염색체가 세 개 존재하는 삼염색체성이다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-029",
        "context": "박상영T · 클라인펠터 증후군의 대표적인 핵형은?",
        "explanation": "성염색체 수 이상으로 XXY 핵형을 보이는 것이 대표적이다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-030",
        "context": "박상영T · 터너 증후군의 대표적인 핵형은?",
        "explanation": "터너 증후군의 대표적인 핵형은 X 염색체 하나만 있는 45, X이다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-031",
        "context": "박상영T · 염색체 일부가 끊어져 사라진 구조 이상은?",
        "explanation": "결실은 구간 소실, 중복은 구간 반복, 역위는 방향 반전, 전좌는 다른 염색체로 이동이다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-032",
        "context": "박상영T · 염색체 ABCDEFG가 ABEDCFG로 바뀌었다. 구조 이상은?",
        "explanation": "CDE 구간의 순서가 EDC로 뒤집혔으므로 역위이다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-033",
        "context": "박상영T · 단백질 암호화 구간에서 1개 염기 삽입의 대표적인 결과는?",
        "explanation": "3의 배수가 아닌 염기 삽입·결실은 프레임시프트를 일으킬 수 있다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-034",
        "context": "박상영T · 염기 치환으로 아미노산이 바뀌지 않는 변이는?",
        "explanation": "여러 코돈이 같은 아미노산을 지정할 수 있어 치환 후에도 같은 아미노산이 들어갈 수 있다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-035",
        "context": "박상영T · 아미노산 코돈이 종결 코돈으로 바뀐 변이는?",
        "explanation": "번역이 조기에 끝나 짧은 단백질이 만들어질 수 있다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      },
      {
        "id": "biology-park-036",
        "context": "박상영T · 자손에게 직접 전달될 수 있는 변이는?",
        "explanation": "생식세포의 DNA 변이는 수정란에 전달될 수 있으며 일반적인 체세포 변이는 자손에게 직접 전달되지 않는다.",
        "sourceNote": "박상영T 필기 · 2쪽"
      }
    ],
    "topicKeys": [
      "사람의 유전병"
    ]
  },
  {
    "id": "biology-park-concept-4",
    "deckId": "biology-park",
    "title": "유전체와 유전 물질",
    "summary": "유전체는 전체 유전 정보를 뜻하며 단백질 암호화 구간만이 아니라 비암호화 DNA도 포함한다. DNA가 유전 물질이라는 결론은 서로 다른 실험의 증거로 뒷받침된다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "뉴클레오타이드=인산+당+염기",
          "뉴클레오솜=히스톤 주위에 감긴 DNA",
          "DNA 두 가닥은 역평행·A–T 2개·G–C 3개 수소 결합",
          "그리피스: 형질전환 / 에이버리: DNase 처리 시 형질전환 소실",
          "허시·체이스: DNA ³²P·단백질 ³⁵S 표지"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "이중 가닥 DNA에서 A=20%이면 T=20%, G=C=30%다. ³²P가 세균 침전물에 주로 검출되어 DNA 유입을 지지한다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "그리피스만으로 DNA라는 물질을 확정했다고 쓰지 않는다. 한 가닥 DNA에 A=T를 무조건 적용하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "biology-park-037",
        "context": "박상영T · 뉴클레오타이드를 이루는 세 성분은?",
        "explanation": "DNA와 RNA의 단위체인 뉴클레오타이드는 인산, 오탄당, 질소 염기로 구성된다.",
        "sourceNote": "박상영T 필기 · 3쪽"
      },
      {
        "id": "biology-park-038",
        "context": "박상영T · 뉴클레오솜의 구조는?",
        "explanation": "뉴클레오솜은 DNA 포장의 기본 단위이며 히스톤 단백질과 DNA로 이루어진다.",
        "sourceNote": "박상영T 필기 · 3쪽"
      },
      {
        "id": "biology-park-039",
        "context": "박상영T · 그리피스 실험에서 쥐가 죽는 조합은?",
        "explanation": "죽은 S형의 물질이 살아 있는 R형을 S형으로 형질전환시킬 수 있었다.",
        "sourceNote": "박상영T 필기 · 3쪽"
      },
      {
        "id": "biology-park-040",
        "context": "박상영T · 에이버리 실험에서 형질전환을 막은 효소는?",
        "explanation": "DNA를 분해했을 때 형질전환이 사라져 DNA가 형질전환 물질임을 뒷받침했다.",
        "sourceNote": "박상영T 필기 · 3쪽"
      },
      {
        "id": "biology-park-041",
        "context": "박상영T · 허시·체이스 실험에서 DNA와 단백질 표지의 올바른 조합은?",
        "explanation": "DNA는 인을 포함하고 황은 없으며 파지 단백질의 일부 아미노산은 황을 포함한다.",
        "sourceNote": "박상영T 필기 · 3쪽"
      },
      {
        "id": "biology-park-042",
        "context": "박상영T · 파지 감염 후 혼합·원심분리한 허시·체이스 실험에서 ³²P의 주된 위치는?",
        "explanation": "DNA 표지인 ³²P가 세균이 든 침전물에 주로 검출되어 DNA 유입을 지지했다.",
        "sourceNote": "박상영T 필기 · 3쪽"
      },
      {
        "id": "biology-park-043",
        "context": "박상영T · 이중 가닥 DNA에서 A=20%이면 G는?",
        "explanation": "A=T=20%이므로 G+C=60%, G=C=30%이다.",
        "sourceNote": "박상영T 필기 · 3쪽"
      },
      {
        "id": "biology-park-044",
        "context": "박상영T · A–T와 G–C의 수소 결합 수는?",
        "explanation": "상보적 염기쌍 A–T는 2개, G–C는 3개의 수소 결합을 형성한다.",
        "sourceNote": "박상영T 필기 · 3쪽"
      },
      {
        "id": "biology-park-045",
        "context": "박상영T · DNA 한 가닥이 5′-ATGC-3′일 때 마주 보는 가닥은?",
        "explanation": "DNA 두 가닥은 역평행이며 A–T, G–C로 상보 결합한다.",
        "sourceNote": "박상영T 필기 · 3쪽"
      },
      {
        "id": "biology-park-046",
        "context": "박상영T · 유전체와 유전자를 옳게 구별한 것은?",
        "explanation": "유전체는 전체 유전 정보를 뜻하며 유전자는 기능성 RNA 또는 단백질 산물에 필요한 정보를 가진다.",
        "sourceNote": "박상영T 필기 · 3쪽"
      },
      {
        "id": "biology-park-047",
        "context": "박상영T · 세균의 전형적인 유전체 특징은?",
        "explanation": "세균은 전형적으로 핵막이 없고 주 염색체가 원형이며 진핵생물은 핵에 여러 선형 염색체가 있다.",
        "sourceNote": "박상영T 필기 · 3쪽"
      }
    ],
    "topicKeys": [
      "유전체와 유전 물질"
    ]
  },
  {
    "id": "social-concept-1",
    "deckId": "social",
    "title": "세계화와 지역화",
    "summary": "세계화는 교통·통신과 국제 교류를 통해 지역 간 연결과 상호 의존이 커지는 과정이다. 지역화는 고유한 자원을 살려 차별화하는 전략이다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "장소 마케팅: 장소 자체의 가치·이미지 개발",
          "지역 브랜드화: 상품·축제·도시를 특별한 브랜드로 인식",
          "지리적 표시: 지역 특성과 상품 품질의 연결",
          "현지화: 현지 문화·종교·관습에 맞춘 기업 전략",
          "글로컬라이제이션: 세계화와 지역적 특성 존중 결합"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "할랄 제품은 현지화, I♥NY는 지역 브랜드화, 보성 녹차는 지리적 표시의 사례로 구별한다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "사례 이름만 외우지 말고 무엇을 변화·표시·브랜드화했는지 판단한다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "social-001",
        "context": "보성 녹차는 전략 A, 「I♥NY」는 전략 B의 사례다. A–B는?",
        "explanation": "보성 녹차는 국내 지리적 표시제 1호이고, 「I♥NY」는 도시를 브랜드로 알리는 지역 브랜드화 전략이다.",
        "sourceNote": "21_260927_160220.pdf · 1쪽"
      },
      {
        "id": "social-002",
        "context": "두바이는 사막과 초고층 빌딩의 이미지를 개발해 관광지로 홍보한다. 이 전략은?",
        "explanation": "장소 마케팅은 특정 장소를 하나의 상품으로 보고 독특한 이미지·시설을 개발해 장소 가치를 높이는 전략이다.",
        "sourceNote": "21_260927_160220.pdf · 1쪽"
      },
      {
        "id": "social-003",
        "context": "리버풀이 비틀즈로 도시를 알리는 전략 X. X의 정의로 옳은 것은?",
        "explanation": "리버풀(비틀즈)은 장소 마케팅 사례다. 장소 마케팅은 특정 장소를 하나의 상품으로 인식해 가치를 높인다.",
        "sourceNote": "21_260927_160220.pdf · 1쪽"
      },
      {
        "id": "social-004",
        "context": "샴페인·다르질링 차가 받은 제도 X. X가 반영하는 상품의 특성은?",
        "explanation": "지리적 표시제는 지역의 기후·지형·토양 등 지리적 특성을 반영한 우수 상품에 그 지역 생산임을 표시하게 한다.",
        "sourceNote": "21_260927_160220.pdf · 1쪽"
      },
      {
        "id": "social-005",
        "context": "부산 「Busan is Good」과 평창 「HAPPY 700」이 공통으로 쓴 전략은?",
        "explanation": "지역의 상품·서비스·축제를 특별한 브랜드로 인식시켜 지역 이미지를 높이는 전략이 지역 브랜드화다.",
        "sourceNote": "21_260927_160220.pdf · 1쪽"
      },
      {
        "id": "social-006",
        "context": "햄버거 회사가 인도에서 소고기를 뺀 채식 메뉴를 판다. 이 과정은?",
        "explanation": "현지화는 기업이 현지의 기후·종교·문화·관습 등을 고려해 상품과 서비스를 맞춰 판매하는 과정이다.",
        "sourceNote": "21_260927_160220.pdf · 3쪽"
      },
      {
        "id": "social-007",
        "context": "라면 회사가 이슬람 문화권 수출용으로 생산한 제품은?",
        "explanation": "이슬람 문화권의 관습을 고려해 할랄 인증 제품을 생산하는 것은 현지화의 대표 사례다.",
        "sourceNote": "21_260927_160220.pdf · 3쪽"
      },
      {
        "id": "social-008",
        "context": "같은 간판의 S커피가 한국에선 한옥 매장이다. 이 전략 = 세계화 + ?",
        "explanation": "세계화를 추구하면서 지역의 고유 문화를 존중하는 글로컬라이제이션은 세계화와 현지화를 합친 전략이다.",
        "sourceNote": "21_260927_160220.pdf · 3쪽"
      },
      {
        "id": "social-009",
        "context": "교통·통신 발달로 나타난 변화로 옳지 않은 것은?",
        "explanation": "교통·통신이 발달하면 국경의 의미와 지역성은 약화되고, 상호 의존성과 이동은 늘며 문화 확산도 빨라진다.",
        "sourceNote": "21_260927_160220.pdf · 4쪽"
      },
      {
        "id": "social-010",
        "context": "세계화의 배경으로 옳지 않은 것은?",
        "explanation": "세계화는 WTO 출범에 따른 자유 무역 확대, 다국적 기업 성장, 교통·통신 발달로 진행되었다. 보호 무역 강화는 반대 방향이다.",
        "sourceNote": "21_260927_160220.pdf · 1쪽"
      },
      {
        "id": "social-011",
        "context": "세계화가 진행될 때 나타나는 특징으로 옳지 않은 것은?",
        "explanation": "세계화로 국제 경쟁이 치열해지는 동시에 국제 협력과 국제적 분업도 활발해진다.",
        "sourceNote": "21_260927_160220.pdf · 1쪽"
      },
      {
        "id": "social-012",
        "context": "지역화 시대에 지역이 경쟁력을 높이려면 고유 전통에 무엇을 접목해야 하나?",
        "explanation": "지역화의 과제는 다른 지역과 차별되는 고유한 전통에 세계의 보편적 가치를 접목하는 것이다.",
        "sourceNote": "21_260927_160220.pdf · 1쪽"
      }
    ],
    "topicKeys": [
      "세계화와 지역화"
    ]
  },
  {
    "id": "social-concept-2",
    "deckId": "social",
    "title": "세계 도시와 기업",
    "summary": "세계 도시는 국제적 경제 활동의 의사결정·연결 기능이 집중된 도시다. 다국적 기업은 기능별 입지 차이를 이용해 공간적으로 분업한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "생산자 서비스업: 금융·법률·회계 등 기업 지원",
          "본사: 의사결정·관리 / 연구소: 기술·인력 / 공장: 생산비·시장",
          "공장은 저임금 지역뿐 아니라 무역 장벽 회피를 위해 선진국에도 위치",
          "긍정 효과와 자본 유출·일자리 이동 등을 함께 분석"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "같은 회사도 본사·연구소·생산 공장이 서로 다른 나라에 있을 수 있다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "도시 계층과 갈등 사례는 기존 수업자료의 분류를 기준으로 학습한다. 현재 순위·최신 현황으로 해석하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "social-013",
        "context": "세계 도시에 집중하는 서비스업 X. X의 예로 알맞은 것은?",
        "explanation": "세계 도시에는 기업 활동을 돕는 생산자 서비스업이 집중한다. 회계·금융·법률·광고·시장 조사가 이에 속한다.",
        "sourceNote": "22_260927_154943.pdf · 1쪽"
      },
      {
        "id": "social-014",
        "context": "음식업·숙박업은 A 서비스업, 금융·시장 조사는 B 서비스업이다. A–B는?",
        "explanation": "일반 소비자에게 직접 제공하면 소비자 서비스업, 기업 활동을 도우면 생산자 서비스업이다.",
        "sourceNote": "22_260927_154943.pdf · 1쪽"
      },
      {
        "id": "social-015",
        "context": "최상위 세계 도시가 아닌 것은?",
        "explanation": "최상위 세계 도시는 런던·뉴욕·도쿄이다. 서울은 토론토·상하이 등과 함께 하위 세계 도시로 분류된다.",
        "sourceNote": "22_260927_154943.pdf · 1쪽"
      },
      {
        "id": "social-016",
        "context": "최상위 세계 도시를 하위 세계 도시와 비교한 설명으로 옳지 않은 것은?",
        "explanation": "상위 계층일수록 도시 수가 적어 인접한 같은 계층 도시와의 거리가 멀다. 본사·국제기구·생산자 서비스업은 많다.",
        "sourceNote": "22_260927_154943.pdf · 1쪽"
      },
      {
        "id": "social-017",
        "context": "파리·시카고·싱가포르가 속한 세계 도시 계층은?",
        "explanation": "세계 도시 체계에서 파리·시카고·로스앤젤레스·싱가포르·암스테르담은 상위 세계 도시에 속한다.",
        "sourceNote": "22_260927_154943.pdf · 1쪽"
      },
      {
        "id": "social-018",
        "context": "다국적 기업의 본사는 A에, 공장은 주로 B에 둔다. A–B는?",
        "explanation": "공간적 분업에서 경영 기획·관리를 맡는 본사는 본국 대도시, 생산 공장은 임금이 낮은 개발도상국에 주로 입지한다.",
        "sourceNote": "22_260927_154943.pdf · 2쪽"
      },
      {
        "id": "social-019",
        "context": "다국적 기업의 연구소가 주로 입지하는 곳의 조건은?",
        "explanation": "연구 및 개발을 담당하는 연구소는 기술 수준이 높은 선진국에 주로 입지한다.",
        "sourceNote": "22_260927_154943.pdf · 2쪽"
      },
      {
        "id": "social-020",
        "context": "생산 공장을 선진국에 세우기도 하는 주된 이유는?",
        "explanation": "공장은 보통 생산비가 싼 개발도상국에 두지만, 무역 장벽을 극복하기 위해 선진국에 세우기도 한다.",
        "sourceNote": "22_260927_154943.pdf · 2쪽"
      },
      {
        "id": "social-021",
        "context": "기획·연구·생산 기능이 공간적으로 분리되는 현상 X. X의 목적은?",
        "explanation": "공간적 분업은 경영의 효율성을 높이고 이윤을 극대화하기 위해 나타난다.",
        "sourceNote": "22_260927_154943.pdf · 2쪽"
      },
      {
        "id": "social-022",
        "context": "서울에서 창업했지만 본사를 도쿄에 둔 넥슨처럼, 본사까지 옮긴 기업은?",
        "explanation": "최근에는 본사나 본사의 핵심 기능까지 해외로 옮긴 초국적 기업이 등장하고 있다.",
        "sourceNote": "22_260927_154943.pdf · 2쪽"
      },
      {
        "id": "social-023",
        "context": "다국적 기업 공장이 개발도상국에 미치는 영향으로 옳지 않은 것은?",
        "explanation": "다국적 기업은 이익을 진출국에 재투자하지 않고 모국으로 가져가 자본 유출이 생길 수 있다.",
        "sourceNote": "22_260927_154943.pdf · 3쪽"
      },
      {
        "id": "social-024",
        "context": "다국적 기업이 생산 시설을 해외로 옮길 때 선진국에 생길 수 있는 문제는?",
        "explanation": "비싼 인건비를 피해 생산 시설을 개발도상국으로 옮기면 선진국에서는 일자리가 줄어 실업 문제가 생긴다.",
        "sourceNote": "22_260927_154943.pdf · 3쪽"
      },
      {
        "id": "social-025",
        "context": "세계화로 전 세계에 확산되는 보편적 가치가 아닌 것은?",
        "explanation": "문화 교류의 확대와 함께 자유·평등·인권 같은 보편적 가치가 전 세계로 확산되고 있다.",
        "sourceNote": "22_260927_154943.pdf · 3쪽"
      }
    ],
    "topicKeys": [
      "세계 도시와 기업"
    ]
  },
  {
    "id": "social-concept-3",
    "deckId": "social",
    "title": "국제 갈등",
    "summary": "국제 갈등은 영토·자원·민족·언어·종교·역사가 복합적으로 얽힌다. 사례를 하나의 원인으로 환원하기보다 주체·지역·쟁점을 연결한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "직접 폭력 부재는 소극적 평화",
          "차별·빈곤 등 구조적 폭력도 제거한 상태는 적극적 평화",
          "문화적 폭력은 폭력을 정당화하는 사상·문화 요소",
          "사례별 대립 주체와 종교·언어·영토의 조합 확인"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "카슈미르를 언어 문제만으로 설명하지 않고 수업자료의 종교·영토 쟁점을 함께 연결한다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "전쟁이 없다는 사실만으로 구조적 차별도 없다고 결론짓지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "social-026",
        "context": "소극적·적극적 평화를 구분한 학자 X. X가 말한 적극적 평화에서 없어져야 할 것은?",
        "explanation": "갈퉁은 직접적·물리적 폭력뿐 아니라 빈곤·차별 같은 구조적 폭력까지 모두 제거된 상태를 적극적 평화라 했다.",
        "sourceNote": "23_260927_155005.pdf · 1쪽"
      },
      {
        "id": "social-027",
        "context": "전쟁은 없지만 빈곤·차별이 남은 사회. 갈퉁의 기준으로 이 상태는?",
        "explanation": "직접적·물리적 폭력이 없는 상태는 소극적 평화다. 구조적 폭력이 남아 있으면 적극적 평화는 아니다.",
        "sourceNote": "23_260927_155005.pdf · 1쪽"
      },
      {
        "id": "social-028",
        "context": "빈곤·정치적 독재·사회적 차별은 갈퉁이 말한 어떤 폭력에 해당하나?",
        "explanation": "사회 구조 자체가 가하는 폭력이 구조적 폭력이다. 빈곤, 정치적 독재, 경제적 착취, 차별과 소외 등이 포함된다.",
        "sourceNote": "23_260927_155005.pdf · 1쪽"
      },
      {
        "id": "social-029",
        "context": "국제 갈등의 특징으로 옳지 않은 것은?",
        "explanation": "국제 갈등은 영역·자원·민족·종교·역사가 복합적으로 얽혀 있어 한 국가의 노력만으로 해결하기 어렵다.",
        "sourceNote": "23_260927_155005.pdf · 1쪽"
      },
      {
        "id": "social-030",
        "context": "북아일랜드 갈등에서 영국계는 A, 아일랜드계는 B를 믿는다. A–B는?",
        "explanation": "북아일랜드에서는 영국계 개신교와 아일랜드계 가톨릭 사이의 종교 갈등이 나타난다.",
        "sourceNote": "23_260927_155005.pdf · 1쪽"
      },
      {
        "id": "social-031",
        "context": "영국 스코틀랜드 갈등에서 잉글랜드는 A, 스코틀랜드는 B다. A–B는?",
        "explanation": "학습지에서 스코틀랜드 갈등 구도는 잉글랜드(성공회) 대 스코틀랜드(장로교)로 정리된다.",
        "sourceNote": "23_260927_155005.pdf · 1쪽"
      },
      {
        "id": "social-032",
        "context": "팔레스타인 지역에서 팔레스타인은 A, 이스라엘은 B를 믿는다. A–B는?",
        "explanation": "팔레스타인 지역 분쟁은 이슬람교(팔레스타인)와 유대교(이스라엘)의 대립이 얽혀 있다.",
        "sourceNote": "23_260927_155005.pdf · 1쪽"
      },
      {
        "id": "social-033",
        "context": "정부군·반군 대립에 이슬람 종파 갈등이 겹쳐 대규모 난민이 생긴 곳 X. X의 종파는?",
        "explanation": "시리아 내전은 정부군과 반군의 대립에 수니파와 시아파의 종파 갈등이 겹쳐 장기화되었다.",
        "sourceNote": "23_260927_155005.pdf · 1쪽"
      },
      {
        "id": "social-034",
        "context": "로힝야족이 박해받는 나라 X. X의 다수 종교와 로힝야족의 종교는?",
        "explanation": "미얀마에서는 다수의 불교도와 이슬람교를 믿는 소수 로힝야족 사이의 갈등이 나타난다.",
        "sourceNote": "23_260927_155005.pdf · 2쪽"
      },
      {
        "id": "social-035",
        "context": "스리랑카에서 타밀족은 A, 신할리즈족은 B를 믿는다. A–B는?",
        "explanation": "스리랑카 갈등은 불교를 믿는 신할리즈족과 힌두교를 믿는 타밀족 사이의 대립이다.",
        "sourceNote": "23_260927_155005.pdf · 2쪽"
      },
      {
        "id": "social-036",
        "context": "인도와 파키스탄이 대립하는 지역 X. X에서 파키스탄 측 종교는?",
        "explanation": "카슈미르 분쟁은 인도(힌두교)와 파키스탄(이슬람교)의 종교 차이와 영토 문제가 얽혀 있다.",
        "sourceNote": "23_260927_155005.pdf · 2쪽"
      },
      {
        "id": "social-037",
        "context": "필리핀에서 분리 독립을 요구하는 모로족의 종교는?",
        "explanation": "필리핀은 대부분 크리스트교를 믿지만, 남부의 모로족은 이슬람교를 믿으며 갈등이 나타난다.",
        "sourceNote": "23_260927_155005.pdf · 2쪽"
      },
      {
        "id": "social-038",
        "context": "나이지리아의 종교 갈등에서 북부는 A, 남부는 B다. A–B는?",
        "explanation": "나이지리아는 북부 이슬람교와 남부 크리스트교 사이의 갈등을 겪는다.",
        "sourceNote": "23_260927_155005.pdf · 2쪽"
      },
      {
        "id": "social-039",
        "context": "수단·남수단 갈등에서 남수단 쪽 종교로 알맞은 것은?",
        "explanation": "수단은 이슬람교, 남수단은 크리스트교·토착 신앙이며 석유 자원 문제(다르푸르)도 얽혀 있다.",
        "sourceNote": "23_260927_155005.pdf · 2쪽"
      },
      {
        "id": "social-040",
        "context": "두 차례 주민 투표가 모두 부결된 분리 독립 요구 지역 X. X의 언어는?",
        "explanation": "캐나다 퀘벡주의 프랑스어 사용 주민들이 분리 독립을 요구했으나 1980년·1995년 투표 모두 부결되었다.",
        "sourceNote": "23_260927_155005.pdf · 3쪽"
      },
      {
        "id": "social-041",
        "context": "벨기에의 북부 플랑드르는 A어, 남부 왈로니아는 B어를 쓴다. A–B는?",
        "explanation": "벨기에는 북부 플랑드르(네덜란드어)와 남부 왈로니아(프랑스어) 사이의 언어 갈등을 겪으며 브뤼셀은 두 언어를 병기한다.",
        "sourceNote": "23_260927_155005.pdf · 3쪽"
      },
      {
        "id": "social-042",
        "context": "주도 바르셀로나가 국가 경제의 약 20%를 차지하며 분리 독립을 원하는 지역은?",
        "explanation": "에스파냐 카탈루냐는 언어·민족 정체성과 경제적 격차를 배경으로 분리 독립 움직임이 있다.",
        "sourceNote": "23_260927_155005.pdf · 4쪽"
      },
      {
        "id": "social-043",
        "context": "국가 없는 세계 최대 민족 X. X의 거주지가 나뉜 나라가 아닌 것은?",
        "explanation": "쿠르드족의 거주지(쿠르디스탄)는 제1차 세계 대전 이후 튀르키예·이란·이라크·시리아 등으로 분리되었다.",
        "sourceNote": "23_260927_155005.pdf · 4쪽"
      },
      {
        "id": "social-044",
        "context": "1994년 대학살이 일어난 르완다에서 소수 지배층 A, 다수 피지배층 B는?",
        "explanation": "벨기에의 식민 지배가 소수 지배층 투치족과 다수 피지배층 후투족의 대립을 심화시켰다.",
        "sourceNote": "23_260927_155005.pdf · 4쪽"
      },
      {
        "id": "social-045",
        "context": "포클랜드 제도를 실효 지배하는 A와 영유권을 주장하는 B는?",
        "explanation": "포클랜드 제도는 영국이 실효 지배하고 아르헨티나가 영유권을 주장해 1982년 전쟁이 일어났다.",
        "sourceNote": "23_260927_155005.pdf · 4쪽"
      },
      {
        "id": "social-046",
        "context": "호르무즈 해협의 아부무사섬을 실효 지배하는 A와 영유권을 주장하는 B는?",
        "explanation": "아부무사섬은 1971년부터 이란이 실효 지배하고 아랍에미리트가 영유권을 주장한다.",
        "sourceNote": "23_260927_155005.pdf · 4쪽"
      },
      {
        "id": "social-047",
        "context": "멕시코 분쟁에서 정부군·시민 자경단과 맞서는 세력은?",
        "explanation": "멕시코 분쟁은 마약 카르텔과 이를 제압하려는 정부군·시민 자경단 사이에서 발생했다.",
        "sourceNote": "23_260927_155005.pdf · 4쪽"
      },
      {
        "id": "social-048",
        "context": "분쟁 지역과 주요 원인의 연결로 옳지 않은 것은?",
        "explanation": "카슈미르 분쟁의 주요 원인은 언어가 아니라 종교(힌두교·이슬람교)와 영토 문제다.",
        "sourceNote": "23_260927_155005.pdf · 5쪽"
      }
    ],
    "topicKeys": [
      "국제 갈등"
    ]
  },
  {
    "id": "social-concept-4",
    "deckId": "social",
    "title": "세계화의 그늘",
    "summary": "세계화는 교류와 성장을 확대하지만 문화 획일화·격차·이동과 복지의 윤리적 충돌도 일으킨다. 문제 해결의 목적과 수단을 구분한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "문화 다양성 보존과 국제 협력",
          "공정 무역: 생산자의 공정한 몫과 자립",
          "ODA·기술 이전: 개발과 자립 지원",
          "보편 윤리: 인류 보편 가치 / 특수 윤리: 집단의 복지·주권",
          "싱어: 피할 수 있는 극단적 고통 감소 / 롤스: 질서 정연한 제도 확립"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "원조의 목적을 물으면 싱어의 고통 감소와 롤스의 제도·사회 조건을 구별한다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "서로 다른 원조 사상가의 목표를 모두 단순한 부의 균등화로 묶지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "social-049",
        "context": "세계 문화가 선진국 문화를 중심으로 비슷해지는 현상 X. X의 결과는?",
        "explanation": "문화의 획일화로 약소국·원주민·소수 민족의 고유문화가 사라질 위험에 처하고 문화적 다양성이 약화된다.",
        "sourceNote": "24_260927_155023.pdf · 1쪽"
      },
      {
        "id": "social-050",
        "context": "선진국은 A 산업, 개발도상국은 B 산업에 집중해 격차가 커진다. A–B는?",
        "explanation": "선진국은 부가 가치가 높은 금융·첨단 기술 산업에, 개발도상국은 부가 가치가 낮은 제조업·농업에 집중한다.",
        "sourceNote": "24_260927_155023.pdf · 1쪽"
      },
      {
        "id": "social-051",
        "context": "관습법처럼 특정 집단 안에서 중요한 가치를 강조하는 입장 X. X가 중시하는 것은?",
        "explanation": "특수 윤리는 특정 집단 내의 가치를 강조하며 개별 국가의 주권, 자국민의 복지 등을 중시한다.",
        "sourceNote": "24_260927_155023.pdf · 1쪽"
      },
      {
        "id": "social-052",
        "context": "브렉시트 이민 문제에서 보편 윤리는 A를, 특수 윤리는 B를 중시한다. A–B는?",
        "explanation": "보편 윤리는 이민자의 자유로운 이동권을, 특수 윤리는 특정 국가 시민이 누릴 복지를 우선시한다.",
        "sourceNote": "24_260927_155023.pdf · 2쪽"
      },
      {
        "id": "social-053",
        "context": "2001년 문화 다양성 선언을 채택한 기구는?",
        "explanation": "2001년 유네스코가 채택한 문화 다양성 선언은 문화의 고유성과 다양성 보존을 위한 국제 협력 사례다.",
        "sourceNote": "24_260927_155023.pdf · 2쪽"
      },
      {
        "id": "social-054",
        "context": "생산자에게 정당한 가격을 지급한 제품을 사는 윤리적 소비 운동 X. X의 효과는?",
        "explanation": "공정 무역은 무역의 이익이 개발도상국의 가난한 생산자에게 돌아가 그들이 경제적으로 자립하도록 돕는다.",
        "sourceNote": "24_260927_155023.pdf · 2쪽"
      },
      {
        "id": "social-055",
        "context": "빈부 격차 해결을 위한 경제적 노력으로 옳지 않은 것은?",
        "explanation": "국제적 분배 정의를 위해 선진국은 ODA·기술 이전으로 자립을 돕고, 공정 무역으로 불공정한 무역 구조를 개선한다.",
        "sourceNote": "24_260927_155023.pdf · 2쪽"
      },
      {
        "id": "social-056",
        "context": "원조 목적을 인류 고통 감소로 본 X, 질서 정연한 사회 확립으로 본 Y. X–Y는?",
        "explanation": "싱어는 극단적 빈곤을 막아 인류 전체의 고통을 줄이자 했고, 롤스는 질서 정연한 사회 확립을 원조 목적으로 보았다.",
        "sourceNote": "24_260927_155023.pdf · 3쪽"
      },
      {
        "id": "social-057",
        "context": "공리주의·세계 시민주의 입장에서 원조를 의무로 본 X. X가 막자고 한 빈곤은?",
        "explanation": "싱어는 도덕적으로 중요한 다른 일을 희생하지 않고 막을 수 있는 극단적 빈곤이 있다면 원조해야 한다고 보았다.",
        "sourceNote": "24_260927_155023.pdf · 3쪽"
      },
      {
        "id": "social-058",
        "context": "공정으로서의 정의를 주장한 X. X가 본 빈곤의 원인은?",
        "explanation": "롤스는 빈곤이 물질적 자원 부족이 아니라 정치·사회 제도의 결함에서 생긴다고 보았다.",
        "sourceNote": "24_260927_155023.pdf · 3쪽"
      },
      {
        "id": "social-059",
        "context": "콜탄처럼 전쟁·범죄를 동원해 생산하는 자원 X. EU가 X에 대해 한 일은?",
        "explanation": "콜탄 같은 분쟁 광물에 대해 EU는 2021년부터 원산지가 분명한 광물만 수입하도록 무역 규제를 시행하고 있다.",
        "sourceNote": "24_260927_155023.pdf · 3쪽"
      },
      {
        "id": "social-060",
        "context": "세계화가 초래하는 문제로 옳지 않은 것은?",
        "explanation": "세계화는 문화 획일화, 빈부 격차 심화, 보편 윤리와 특수 윤리의 갈등, 전염병 확산 등을 초래할 수 있다.",
        "sourceNote": "24_260927_155023.pdf · 1쪽"
      }
    ],
    "topicKeys": [
      "세계화의 그늘"
    ]
  },
  {
    "id": "social-concept-5",
    "deckId": "social",
    "title": "평화와 행위 주체",
    "summary": "국제 사회의 주체는 국가뿐 아니라 정부 간 국제기구·국제 NGO·영향력 있는 개인도 포함한다. 구성원과 목적이 분류 기준이다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "국가: 자국민 보호·외교",
          "정부 간 국제기구: 국가가 구성원·규범·중재",
          "NGO: 공익 목적의 시민 단체",
          "그린피스 환경 / 국제 사면 위원회 인권 / 국경 없는 의사회 의료",
          "칸트: 공화정·평화 연맹 / 갈퉁: 적극적 평화"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "시민 단체인 NGO와 정부가 가입한 국제기구를 이름의 국제성만으로 혼동하지 않는다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "국제 사회의 무정부 상태는 규칙이 전혀 없다는 뜻이 아니라 강제력을 독점한 세계 중앙정부가 없다는 설명이다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "social-061",
        "context": "공식성과 대표성을 지닌 가장 기본적인 행위 주체 X. X가 최우선하는 것은?",
        "explanation": "국가는 가장 기본적인 행위 주체이며, 자국의 이익과 자국민 보호를 위한 외교 활동을 최우선으로 한다.",
        "sourceNote": "25_260927_155047.pdf · 1쪽"
      },
      {
        "id": "social-062",
        "context": "국제 연합(UN)·WHO·IMF가 속한 행위 주체 X. X의 구성원은?",
        "explanation": "정부 간 국제기구는 주권 국가를 구성원으로 하며 국가 간 이해관계를 조정하고 국제 규범을 정립한다.",
        "sourceNote": "25_260927_155047.pdf · 1쪽"
      },
      {
        "id": "social-063",
        "context": "국경 없는 의사회·그린피스·국제 사면 위원회가 속하는 행위 주체는?",
        "explanation": "이들은 공익 실현을 위한 비영리 시민 단체인 국제 비정부 기구(NGO)다.",
        "sourceNote": "25_260927_155047.pdf · 1쪽"
      },
      {
        "id": "social-064",
        "context": "1971년 핵실험 반대로 발족해 고래 보호 활동을 하는 NGO는?",
        "explanation": "그린피스는 1971년 핵실험 반대를 위해 발족했으며 원자력 반대, 방사성 폐기물 투기 저지, 고래 보호 등을 한다.",
        "sourceNote": "25_260927_155047.pdf · 1쪽"
      },
      {
        "id": "social-065",
        "context": "칠레 피노체트 정권의 인권 침해를 고발한 NGO X. X의 활동 영역은?",
        "explanation": "국제 사면 위원회는 고문 추방, 사형 폐지, 난민 보호, 소년병 반대, 양심수 인권 옹호 활동을 한다.",
        "sourceNote": "25_260927_155047.pdf · 1쪽"
      },
      {
        "id": "social-066",
        "context": "남수단 외과 수술·예멘 의료 지원을 한 NGO X. X의 설립 신념은?",
        "explanation": "국경 없는 의사회는 성별·인종·종교와 상관없이 누구나 의료 서비스를 받을 권리가 있다는 신념으로 설립되었다.",
        "sourceNote": "25_260927_155047.pdf · 1쪽"
      },
      {
        "id": "social-067",
        "context": "영향력 있는 개인으로 볼 수 있는 행위 주체가 아닌 것은?",
        "explanation": "영향력 있는 개인에는 강대국 국가 원수, 국제 연합 사무총장, 교황 등이 있다. 그린피스는 NGO다.",
        "sourceNote": "25_260927_155047.pdf · 1쪽"
      },
      {
        "id": "social-068",
        "context": "국제 사회의 특징으로 옳지 않은 것은?",
        "explanation": "국제 사회는 강제력을 가진 중앙 정부가 없는 무정부 상태이며, 자국 이익 추구와 힘의 논리가 작용한다.",
        "sourceNote": "25_260927_155047.pdf · 2쪽"
      },
      {
        "id": "social-069",
        "context": "문화적 폭력을 말한 A의 사상과 평화 연맹을 말한 B의 사상은?",
        "explanation": "갈퉁은 직접적·구조적·문화적 폭력을 제거한 적극적 평화를, 칸트는 평화 연맹을 통한 영구 평화를 주장했다.",
        "sourceNote": "25_260927_155047.pdf · 2쪽"
      },
      {
        "id": "social-070",
        "context": "모든 전쟁을 끝낼 평화 연맹을 주장한 X. X가 각국에 요구한 체제는?",
        "explanation": "칸트는 평화 연맹이 필요하며, 각국은 시민의 자유를 보장하는 공화정 체제를 확립해야 한다고 보았다.",
        "sourceNote": "25_260927_155047.pdf · 2쪽"
      },
      {
        "id": "social-071",
        "context": "종교·사상·언어·예술이 폭력을 정당화하는 것. 갈퉁이 말한 이 폭력은?",
        "explanation": "갈퉁은 종교·사상·언어·예술 등이 폭력을 정당화하는 것을 문화적 폭력이라 하였다.",
        "sourceNote": "25_260927_155047.pdf · 2쪽"
      },
      {
        "id": "social-072",
        "context": "고통받는 사람을 구하려면 무력을 쓸 수 있다는 입장은?",
        "explanation": "절대 평화는 어떤 경우에도 무력을 쓰면 안 된다는 입장이고, 절대 윤리는 사람을 구하려면 폭력도 쓸 수 있다는 입장이다.",
        "sourceNote": "25_260927_155047.pdf · 2쪽"
      },
      {
        "id": "social-073",
        "context": "소극적 평화를 위해 정부 간 국제기구가 맡는 역할은?",
        "explanation": "소극적 평화를 위해 정부 간 국제기구는 분쟁 당사국이 원만한 해결을 모색하도록 중재자 역할을 한다.",
        "sourceNote": "25_260927_155047.pdf · 1쪽"
      }
    ],
    "topicKeys": [
      "평화와 행위 주체"
    ]
  },
  {
    "id": "social-concept-6",
    "deckId": "social",
    "title": "남북 통일",
    "summary": "분단의 배경·통일의 가치·비용과 편익을 구분하고, 민주적·평화적 절차와 주변국 협력을 함께 고려한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "분단 비용: 분단 유지의 유·무형 지출",
          "통일 비용: 격차 통합에 필요한 지출",
          "통일 편익: 경제·비경제적 이익",
          "전쟁 위협 제거와 인권 개선의 평화 차원 구별",
          "국민적 합의와 교류·협력"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "국방 부담은 분단 비용, 통합 과정의 인프라 정비는 통일 비용, 시장 확대는 편익의 예다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "비용만 합산하고 장기 편익을 빠뜨리거나 모든 편익을 현금 수입으로 보지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "social-074",
        "context": "남북 분단의 국내적 배경으로 옳지 않은 것은?",
        "explanation": "자유주의·공산주의 진영 간 냉전 체제는 분단의 국제적 배경이다. 나머지는 국내적 배경이다.",
        "sourceNote": "25_260927_155047.pdf · 2쪽"
      },
      {
        "id": "social-075",
        "context": "통일로 북한 주민 인권이 개선되면 실현되는 평화는?",
        "explanation": "전쟁 위협 제거는 소극적 평화, 이산가족 슬픔 해소·북한 주민 인권 개선은 적극적 평화 실현과 연결된다.",
        "sourceNote": "25_260927_155047.pdf · 2쪽"
      },
      {
        "id": "social-076",
        "context": "국방비는 A 비용, 화폐 통합 비용은 B 비용이다. A–B는?",
        "explanation": "분단 비용은 분단으로 생기는 유·무형 지출(국방비 등), 통일 비용은 통일 후 격차를 통합하는 비용이다.",
        "sourceNote": "25_260927_155047.pdf · 3쪽"
      },
      {
        "id": "social-077",
        "context": "내수 시장 확대·전쟁 위험 해소·규모의 경제는 무엇의 예인가?",
        "explanation": "통일로 얻을 수 있는 경제적·비경제적 이익을 통일 편익이라 하며, 내수 시장 확대 등이 그 예다.",
        "sourceNote": "25_260927_155047.pdf · 3쪽"
      },
      {
        "id": "social-078",
        "context": "1969년 동독과의 교류·협력을 추진한 서독의 정책은?",
        "explanation": "서독은 1969년 동방 정책을 통해 동독과의 교류·협력을 적극적으로 추진하였다.",
        "sourceNote": "25_260927_155047.pdf · 3쪽"
      },
      {
        "id": "social-079",
        "context": "독일 통일 과정에 대한 설명으로 옳지 않은 것은?",
        "explanation": "서독은 독일을 분할 점령했던 미국·소련·영국·프랑스를 설득해 통일에 대한 동의를 이끌어 냈다.",
        "sourceNote": "25_260927_155047.pdf · 3쪽"
      },
      {
        "id": "social-080",
        "context": "바람직한 통일의 조건으로 옳지 않은 것은?",
        "explanation": "바람직한 통일은 평화적 통일, 국민적 합의에 따른 민주적 통일, 주변국과의 협력이 함께 이루어져야 한다.",
        "sourceNote": "25_260927_155047.pdf · 3쪽"
      }
    ],
    "topicKeys": [
      "남북 통일"
    ]
  },
  {
    "id": "social-concept-7",
    "deckId": "social",
    "title": "역사·영토 갈등",
    "summary": "역사 자료의 작성 시점·발신 주체·명시 내용과 해석 범위를 따져 근거를 비교한다. 영역의 기준과 어업상의 합의는 구분한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "자료의 원문 내용과 후대 해석 구별",
          "실효 지배·영유권 주장·최종 법적 결정 구별",
          "기선은 통상 기선과 직선 기선",
          "수업자료의 영해·EEZ 기준과 특수 사례 구분",
          "공동 연구·교류·국제 협력은 평화적 해결 수단"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "영유권 관련 행정 지령에 최종 영토 결정이 아니라는 제한 문구가 있으면 그 범위를 함께 읽는다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "어업 수역 설정을 곧바로 영유권 확정으로 해석하지 않는다. 이 장은 기존 학습지의 역사·영토 쟁점 정리다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "social-081",
        "context": "2002년부터 약 5년간 추진된 중국의 연구 X. X가 중국사로 보려 한 것이 아닌 것은?",
        "explanation": "동북공정은 고조선·부여·고구려·발해의 역사를 중국 고대 지방 정권의 역사로 설명하려는 흐름이 핵심 쟁점이다.",
        "sourceNote": "26_260927_155120.pdf · 1쪽"
      },
      {
        "id": "social-082",
        "context": "동북공정의 추진 배경으로 옳지 않은 것은?",
        "explanation": "동북공정은 변경 안정, 소수 민족 분리 움직임 방지, 국가 통합 강화라는 정책 목표와 결합되어 있다.",
        "sourceNote": "26_260927_155120.pdf · 1쪽"
      },
      {
        "id": "social-083",
        "context": "사도광산 해설에서 에도 시대 기술만 강조하는 왜곡 방식은?",
        "explanation": "특정 시기만 잘라 보여 주는 시기 제한 방식은 근대의 조선인 강제 동원 역사를 주변화한다.",
        "sourceNote": "26_260927_155120.pdf · 2쪽"
      },
      {
        "id": "social-084",
        "context": "'강제 연행'을 모호한 이동·동원으로 바꿔 쓰는 방식 X. X로 생기는 문제는?",
        "explanation": "강제성 약화 방식은 가해 책임과 피해자의 경험을 흐린다.",
        "sourceNote": "26_260927_155120.pdf · 1쪽"
      },
      {
        "id": "social-085",
        "context": "식민 지배를 근대화·질서 확대로 설명하는 왜곡 방식은?",
        "explanation": "침략의 정당화는 지배와 폭력의 불법성과 피해를 축소한다.",
        "sourceNote": "26_260927_155120.pdf · 1쪽"
      },
      {
        "id": "social-086",
        "context": "2024년 세계유산이 된 사도광산에 대해 옳은 태도는?",
        "explanation": "유네스코는 모든 시기의 전체 역사 해설을 권고했다. 등재되었다고 논쟁이 끝난 것이 아니라 이행을 확인해야 한다.",
        "sourceNote": "26_260927_155120.pdf · 2쪽"
      },
      {
        "id": "social-087",
        "context": "정치 지도자의 참배가 외교 갈등이 되는 X. X에 합사된 사람은?",
        "explanation": "야스쿠니 신사는 일본의 전몰자를 기리는 시설로 A급 전범도 합사되어 있어 참배가 침략 미화로 받아들여진다.",
        "sourceNote": "26_260927_155120.pdf · 2쪽"
      },
      {
        "id": "social-088",
        "context": "1877년 일본 최고 행정 기관이 울릉도와 '외 1도'를 일본과 무관하다 한 자료는?",
        "explanation": "태정관 지령은 지적 편찬 과정에서 울릉도와 외 1도가 일본과 관계없다고 지시한 1877년 자료다.",
        "sourceNote": "26_260927_155120.pdf · 3쪽"
      },
      {
        "id": "social-089",
        "context": "1900년 대한제국 칙령 제41호가 울도군 관할에 넣은 섬이 아닌 것은?",
        "explanation": "칙령 제41호는 울도군의 관할을 울릉 전도·죽도·석도로 규정했고, 석도가 독도를 가리키는지 검토한다.",
        "sourceNote": "26_260927_155120.pdf · 3쪽"
      },
      {
        "id": "social-090",
        "context": "1905년 시마네현 고시 제40호로 독도를 편입할 때 일본이 내세운 논리는?",
        "explanation": "일본은 독도가 주인 없는 땅이어서 선점으로 영토를 획득했다는 무주지 선점론을 내세웠다.",
        "sourceNote": "26_260927_155120.pdf · 5쪽"
      },
      {
        "id": "social-091",
        "context": "1946년 SCAPIN 677에 대한 설명으로 옳은 것은?",
        "explanation": "연합군 최고사령부는 일본의 행정 범위에서 독도를 제외했으나, 그 지령이 최종 영유권 결정은 아니라고 명시했다.",
        "sourceNote": "26_260927_155120.pdf · 3쪽"
      },
      {
        "id": "social-092",
        "context": "일본이 독도 편입을 결정한 1905년의 군사적 맥락은?",
        "explanation": "편입은 러일 전쟁 중 러시아 함대 감시 등 군사적 필요에서 이루어졌으며, 1904년에는 망루가 설치되었다.",
        "sourceNote": "26_260927_155120.pdf · 5쪽"
      },
      {
        "id": "social-093",
        "context": "영해는 원칙적으로 A해리, 배타적 경제 수역은 최대 B해리다. A–B는?",
        "explanation": "영해는 기선에서 원칙적으로 12해리, 배타적 경제 수역은 최대 200해리까지 인정된다.",
        "sourceNote": "26_260927_155120.pdf · 3쪽"
      },
      {
        "id": "social-094",
        "context": "동해안은 A 기선, 서·남해안은 B 기선을 적용한다. A–B는?",
        "explanation": "섬이 적은 동해안은 썰물 때 해안선인 통상 기선, 섬이 많은 서·남해안은 직선 기선을 적용한다.",
        "sourceNote": "26_260927_155120.pdf · 4쪽"
      },
      {
        "id": "social-095",
        "context": "일본과 가까워 영해를 12해리보다 좁게 적용하는 곳 X. X의 영해는?",
        "explanation": "대한 해협은 일본과 인접해 직선 기선에서 3해리까지를 영해로 적용한다.",
        "sourceNote": "26_260927_155120.pdf · 4쪽"
      },
      {
        "id": "social-096",
        "context": "1998년 협정으로 한·일 사이 A, 한·중 사이 B 수역을 설정했다. A–B는?",
        "explanation": "신한·일 어업 협정으로 한·일 중간 수역, 한·중 어업 협정으로 한·중 잠정 조치 수역을 설정했다.",
        "sourceNote": "26_260927_155120.pdf · 4쪽"
      },
      {
        "id": "social-097",
        "context": "독도 주변에 난류·한류가 만나 형성되는 수역 X. X 덕분에 풍부한 것은?",
        "explanation": "독도 주변은 조경 수역을 형성해 어족 자원이 풍부하다. 메탄하이드레이트도 매장되어 있다.",
        "sourceNote": "26_260927_155120.pdf · 4쪽"
      },
      {
        "id": "social-098",
        "context": "독도의 가치 중 환경·생태적 가치에 해당하는 것은?",
        "explanation": "독도는 천연 보호 구역이며 해저 화산의 진화 과정을 볼 수 있어 지형학적으로 의미가 크다. 나머지는 영역적·경제적 가치다.",
        "sourceNote": "26_260927_155120.pdf · 4쪽"
      },
      {
        "id": "social-099",
        "context": "센카쿠 열도를 실효 지배하는 A, 쿠릴 열도를 실효 지배하는 B는?",
        "explanation": "센카쿠 열도(댜오위다오)는 일본, 쿠릴 열도(지시마)는 러시아가 실효 지배한다.",
        "sourceNote": "26_260927_155120.pdf · 5쪽"
      },
      {
        "id": "social-100",
        "context": "베트남·필리핀·중국 등이 나눠 지배하며 다투는 군도는?",
        "explanation": "난사(스프래틀리) 군도는 베트남·필리핀·중국·타이완 등이 분할 지배하고, 말레이시아·브루나이도 분쟁에 참여한다.",
        "sourceNote": "26_260927_155120.pdf · 5쪽"
      },
      {
        "id": "social-101",
        "context": "역사 갈등을 평화롭게 해결하는 노력으로 옳지 않은 것은?",
        "explanation": "공동 역사 연구와 국제 연대·교류 확대가 역사 갈등의 평화적 해결 방법이다.",
        "sourceNote": "26_260927_155120.pdf · 5쪽"
      }
    ],
    "topicKeys": [
      "역사·영토 갈등"
    ]
  },
  {
    "id": "social-concept-8",
    "deckId": "social",
    "title": "사회 윤리와 정의",
    "summary": "정의는 권리·갈등 해결·사회 통합과 연결된다. 개인의 선의만으로 구조적 문제를 해결할 수 있는지, 제도와 절차의 역할이 무엇인지 살핀다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "니부어: 개인과 집단의 도덕성 구분·제도와 외적 통제",
          "절차적 정의: 공정한 과정",
          "분배적 정의: 몫의 배분 / 교정적 정의: 부당 이익·손해 시정",
          "개인선과 공동선 구분",
          "아리스토텔레스: 분배의 비례와 교정의 균형"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "개인의 착한 의도가 있어도 집단 이익 추구와 제도적 차별이 유지될 수 있다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "정의의 종류를 결과의 크기만으로 분류하지 않고 문제 상황의 성격을 본다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "social-102",
        "context": "『도덕적 인간과 비도덕적 사회』의 저자 X. X가 집단 문제 해결에 필요하다고 본 것은?",
        "explanation": "니부어는 집단의 비도덕성을 극복하려면 도덕적 선의지의 통제를 받는 외적 강제력이 필요하다고 보았다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 2쪽"
      },
      {
        "id": "social-103",
        "context": "니부어의 주장으로 옳지 않은 것은?",
        "explanation": "니부어는 개인의 도덕적 행위가 집단의 도덕성을 결정하지 못하며, 오히려 구조와 제도가 개인 행위의 도덕성을 결정할 수 있다고 보았다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 1쪽"
      },
      {
        "id": "social-104",
        "context": "니부어에 따르면 집단 간 관계는 윤리적이기보다 지극히 어떠한가?",
        "explanation": "니부어는 집단 간 관계가 지극히 정치적이며, 각 집단이 지닌 힘의 비율에 따라 수립된다고 보았다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 2쪽"
      },
      {
        "id": "social-105",
        "context": "사회 구조·제도의 도덕성을 중시하는 윤리 X. X의 문제 해결 방법은?",
        "explanation": "사회 윤리는 개인의 도덕성 함양과 더불어 사회 구조·제도 개선, 세력 균형, 최소한의 외적 강제력을 해결책으로 본다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 1쪽"
      },
      {
        "id": "social-106",
        "context": "정의를 의로움(義)으로 표현한 A, 지혜·용기·절제의 조화로 본 B는?",
        "explanation": "맹자는 정의를 의로움(義)으로 표현했고, 플라톤은 지혜·용기·절제가 조화를 이룰 때 정의가 나타난다고 보았다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 2쪽"
      },
      {
        "id": "social-107",
        "context": "최대 다수의 최대 행복을 정의로 본 사상가는?",
        "explanation": "벤담은 최대 다수의 사람이 최대의 행복을 얻을 수 있게 하는 것을 정의로 보았다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 2쪽"
      },
      {
        "id": "social-108",
        "context": "공정한 절차로 생긴 결과는 정당하다는 정의는?",
        "explanation": "절차적 정의는 공정한 절차를 통하여 발생한 결과는 정당하다고 보며, 합의 과정의 투명성과 공정성을 중시한다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 3쪽"
      },
      {
        "id": "social-109",
        "context": "아리스토텔레스의 분배적 정의는 A 비례, 교정적 정의는 B 비례다. A–B는?",
        "explanation": "분배적 정의는 공헌에 따라 나누는 기하학적 비례, 교정적 정의는 손해를 바로잡는 산술적 비례를 따른다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 3쪽"
      },
      {
        "id": "social-110",
        "context": "아리스토텔레스가 '공동선과 덕을 위한 법을 준수하는 것'이라 한 정의는?",
        "explanation": "일반적(보편적) 정의는 법을 지키는 것으로, 법을 지키는 사람은 정의롭고 지키지 않는 사람은 부정의하다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 3쪽"
      },
      {
        "id": "social-111",
        "context": "아리스토텔레스의 정의관으로 옳지 않은 것은?",
        "explanation": "각자의 가치(공헌)에 비례해 나누는 것은 분배적 정의다. 교정적 정의는 잘못된 이익·손해를 바로잡는다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 3쪽"
      },
      {
        "id": "social-112",
        "context": "교정적 정의가 적용되는 교섭(거래)의 범위로 옳은 것은?",
        "explanation": "아리스토텔레스의 교정적 정의는 자발적 교섭과 비자발적 교섭 모두에서 생긴 불균형에 적용된다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 3쪽"
      },
      {
        "id": "social-113",
        "context": "'사회 제도의 제1덕목은 정의'라고 한 X. X가 정당화될 수 없다고 본 것은?",
        "explanation": "롤스는 타인의 더 큰 선을 위해 소수의 자유를 빼앗는 것은 정당화될 수 없다고 보았다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 3쪽"
      },
      {
        "id": "social-114",
        "context": "정의의 필요성으로 옳지 않은 것은?",
        "explanation": "정의는 기본권 보장, 갈등 해결, 사회 통합의 기반이 되며 개인선과 공동선을 함께 실현하게 한다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 4쪽"
      },
      {
        "id": "social-115",
        "context": "개인의 행복·자아실현은 A, 구성원 모두의 이익은 B다. A–B는?",
        "explanation": "개인선은 개인이 좋다고 여기며 추구하는 것, 공동선은 사회 구성원 모두에게 이익이 되는 것이다.",
        "sourceNote": "28(27은 수행)_260927_155159.pdf · 4쪽"
      }
    ],
    "topicKeys": [
      "사회 윤리와 정의"
    ]
  },
  {
    "id": "social-concept-9",
    "deckId": "social",
    "title": "분배적 정의",
    "summary": "분배의 공정성은 평등·능력·업적·필요 등의 기준과 권리·절차의 관점에 따라 달라진다. 사상가별 정당화 기준을 비교한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "능력은 가능성·업적은 실제 결과·필요는 최소 생활",
          "롤스: 평등한 기본 자유가 우선·공정한 기회균등·차등 원칙",
          "무지의 베일은 자신의 특수 조건을 가림",
          "노직: 정당한 취득·이전·교정과 최소 국가",
          "왈처: 영역별 사회적 의미·복합 평등"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "롤스에게 불평등은 최소 수혜자에게 최대 이익이 되는 조건에서 정당화될 수 있다. 노직은 정당한 소유 과정에 초점을 둔다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "차등 원칙을 무조건 균등 배분이라고 하거나 노직이 결과의 패턴을 우선한다고 하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "social-116",
        "context": "1인 1표의 선거권은 어떤 분배 기준의 사례인가?",
        "explanation": "1인 1표 선거권, 청소 구역을 같은 넓이로 배정하는 것은 절대적 평등에 따른 분배다.",
        "sourceNote": "29_260927_155223.pdf · 2쪽"
      },
      {
        "id": "social-117",
        "context": "자격증으로 신입을 뽑으면 A, 판매 실적으로 승진시키면 B 기준이다. A–B는?",
        "explanation": "능력은 가능성에, 업적은 실제로 이뤄 낸 결과에 주목한다.",
        "sourceNote": "29_260927_155223.pdf · 2쪽"
      },
      {
        "id": "social-118",
        "context": "기초 생활 수급자 생계 급여의 분배 기준 X. X의 단점은?",
        "explanation": "필요에 따른 분배는 약자의 인간다운 삶을 보장하지만, 한정된 자원과 성취동기 약화가 단점이다.",
        "sourceNote": "29_260927_155223.pdf · 1쪽"
      },
      {
        "id": "social-119",
        "context": "성과 연봉제처럼 결과를 기준으로 나누는 방식 X. X의 단점이 아닌 것은?",
        "explanation": "업적에 따른 분배는 결과를 수량화하기 쉬운 것이 장점이다. 약자 배려 부족, 경쟁 과열 등이 단점이다.",
        "sourceNote": "29_260927_155223.pdf · 1쪽"
      },
      {
        "id": "social-120",
        "context": "능력에 따른 분배의 문제점을 지적한 『공정하다는 착각』의 저자는?",
        "explanation": "샌델은 재능을 갖게 된 것도, 그 재능을 보상하는 사회에 사는 것도 행운이라며 능력 보상을 당연시하지 말라고 했다.",
        "sourceNote": "29_260927_155223.pdf · 1쪽"
      },
      {
        "id": "social-121",
        "context": "절대적 평등에 따른 분배의 단점으로 알맞은 것은?",
        "explanation": "절대적 평등은 기회와 혜택을 균등히 보장하지만 생산 의욕·효율성을 떨어뜨리고 개인의 책임 의식을 약화시킬 수 있다.",
        "sourceNote": "29_260927_155223.pdf · 1쪽"
      },
      {
        "id": "social-122",
        "context": "'능력에 따라 일하고 필요에 따라 분배'를 주장한 X. X가 이상으로 삼은 사회는?",
        "explanation": "마르크스는 생산 수단이 공유되고 계급과 국가가 소멸한 공산 사회를 이상으로 삼았다.",
        "sourceNote": "29_260927_155223.pdf · 2쪽"
      },
      {
        "id": "social-123",
        "context": "최소 수혜자에게 최대 이익을 말한 X. X의 정의 원칙 중 최우선 원칙은?",
        "explanation": "롤스의 정의 원칙은 서열적이어서 제1원칙(평등한 자유)이 제2원칙(공정한 기회균등·차등)보다 우선한다.",
        "sourceNote": "29_260927_155223.pdf · 2쪽"
      },
      {
        "id": "social-124",
        "context": "롤스의 제2원칙을 이루는 두 원칙은?",
        "explanation": "제2원칙은 공정한 기회균등의 원칙과, 불평등은 최소 수혜자에게 최대 이익일 때 정당하다는 차등의 원칙이다.",
        "sourceNote": "29_260927_155223.pdf · 2쪽"
      },
      {
        "id": "social-125",
        "context": "원초적 입장에서 자신의 재능·지위를 모르게 하는 장치 X. X 아래서도 아는 것은?",
        "explanation": "무지의 베일은 자신의 특수한 사실을 가리지만, 인간 사회에 관한 일반적 지식은 알 수 있게 한다.",
        "sourceNote": "29_260927_155223.pdf · 3쪽"
      },
      {
        "id": "social-126",
        "context": "롤스가 본 원초적 입장의 당사자에 대한 설명으로 옳지 않은 것은?",
        "explanation": "원초적 입장의 당사자는 타인의 이익에 관심 없는(상호 무관심) 합리적인 사람으로, 시기심이 없다.",
        "sourceNote": "29_260927_155223.pdf · 3쪽"
      },
      {
        "id": "social-127",
        "context": "롤스의 정의관으로 옳지 않은 것은?",
        "explanation": "롤스는 공직·지위가 형식적으로 열려 있을 뿐 아니라 모두가 차지할 공정한 기회를 가져야 한다고 보았다.",
        "sourceNote": "29_260927_155223.pdf · 2쪽"
      },
      {
        "id": "social-128",
        "context": "상속세·증여세를 무겁게 매겨 부의 세습을 막자는 롤스의 구상은?",
        "explanation": "롤스는 부가 대를 이어 쌓이는 것을 사전에 분산하는 재산 소유 민주주의를 구상했다.",
        "sourceNote": "29_260927_155223.pdf · 2쪽"
      },
      {
        "id": "social-129",
        "context": "취득·이전·교정의 원칙을 말한 X. X가 정당하다고 본 국가는?",
        "explanation": "노직은 국가의 역할이 강도·절도·사기로부터 소유권을 보호하는 데 한정되어야 한다는 최소 국가론을 주장했다.",
        "sourceNote": "29_260927_155223.pdf · 3쪽"
      },
      {
        "id": "social-130",
        "context": "노직의 소유 권리론으로 옳지 않은 것은?",
        "explanation": "노직은 사회적 약자를 위한 과세가 개인의 소유권을 침해한다고 보아 재분배 정책을 비판했다.",
        "sourceNote": "29_260927_155223.pdf · 3쪽"
      },
      {
        "id": "social-131",
        "context": "속임수 없이 자발적 교환·증여·상속으로 받은 소유물. 노직의 어떤 원칙인가?",
        "explanation": "이전의 원칙에 따르면 강압 없는 자발적 교환·증여·상속으로 양도받은 소유물에 정당한 소유 권리가 있다.",
        "sourceNote": "29_260927_155223.pdf · 3쪽"
      },
      {
        "id": "social-132",
        "context": "부자가 돈으로 정치권력까지 얻는 것을 부정의하다고 본 X. X가 강조한 것은?",
        "explanation": "왈처는 한 영역에서 지배적인 가치가 다른 영역의 가치까지 차지하는 것을 부정의로 보고 복합 평등을 강조했다.",
        "sourceNote": "29_260927_155223.pdf · 3쪽"
      },
      {
        "id": "social-133",
        "context": "왈처에 따르면 회사 급여와 안전·복지에 적용할 분배 기준 A–B는?",
        "explanation": "왈처는 이윤 추구 회사는 능력·업적으로, 안전과 복지는 필요를 기준으로 분배해야 한다고 보았다.",
        "sourceNote": "29_260927_155223.pdf · 3쪽"
      },
      {
        "id": "social-134",
        "context": "유용성의 원리로 사회 전체 효용을 극대화하려는 X. X가 받는 비판은?",
        "explanation": "공리주의는 개인의 기본권을 침해하거나 사회적 약자에 무관심할 수 있다는 비판을 받는다.",
        "sourceNote": "29_260927_155223.pdf · 4쪽"
      },
      {
        "id": "social-135",
        "context": "차등의 원칙을 말한 A, 소유 권리론을 말한 B의 재분배 입장은?",
        "explanation": "롤스는 약자를 위한 재분배를 인정하고, 노직은 재분배가 소유권을 침해한다며 반대한다.",
        "sourceNote": "29_260927_155223.pdf · 3쪽"
      }
    ],
    "topicKeys": [
      "분배적 정의"
    ]
  },
  {
    "id": "social-concept-10",
    "deckId": "social",
    "title": "교정적 정의",
    "summary": "교정은 피해 회복과 공정한 처벌을 포함한다. 형벌의 정당화는 범죄에 대한 응보인지 미래의 예방인지에 따라 논거가 달라진다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "배상: 손실 회복 / 형벌: 범죄 처벌",
          "응보: 책임에 상응 / 예방: 사회적 이익과 범죄 억제",
          "칸트: 응보·인격 존중 / 베카리아: 지속적 예방 효과",
          "죄형 법정주의와 비례성은 수업자료의 권리 보장 원칙",
          "루소와 베카리아의 사회 계약 논거 비교"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "강렬하지만 순간적인 효과와 지속적인 억제 효과를 대비하면 베카리아의 논거를 확인할 수 있다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "찬반 결론만 외우지 말고 같은 사회 계약 출발점에서도 논거와 결론이 다를 수 있음을 확인한다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "social-136",
        "context": "사기 피해자에게 손해를 배상하는 것은 교정적 정의 중 무엇인가?",
        "explanation": "배상적 정의는 손해·손실에 대한 공정한 대응(원상 회복)이고, 형벌적 정의는 범죄에 대한 공정한 처벌이다.",
        "sourceNote": "210_260927_155229.pdf · 1쪽"
      },
      {
        "id": "social-137",
        "context": "처벌 자체를 목적으로 보는 A, 범죄 예방 수단으로 보는 B는?",
        "explanation": "응보주의는 정의 실현을 위해 범죄에 상응하는 처벌을, 공리주의(예방주의)는 사회 이익을 위한 범죄 예방을 강조한다.",
        "sourceNote": "210_260927_155229.pdf · 1쪽"
      },
      {
        "id": "social-138",
        "context": "응보주의를 대표하는 사상가 X. X가 형벌의 척도로 본 것은?",
        "explanation": "칸트는 동등성(평등성)의 원리, 즉 보복법만이 형벌의 질과 양을 명확히 제시한다고 보았다.",
        "sourceNote": "210_260927_155229.pdf · 1쪽"
      },
      {
        "id": "social-139",
        "context": "공리주의 처벌관에 대한 비판으로 알맞은 것은?",
        "explanation": "공리주의는 인간을 사회 안정의 수단으로 여겨 존엄성을 훼손한다는 비판을 받는다. 나머지는 응보주의 비판이다.",
        "sourceNote": "210_260927_155229.pdf · 1쪽"
      },
      {
        "id": "social-140",
        "context": "전체 이익을 위해 무고한 사람도 처벌할 수 있다는 비판을 받는 처벌관은?",
        "explanation": "공리주의는 유죄를 사회 전체 이익의 관점에서 판단하므로 죄 없는 사람까지 처벌할 수 있다는 문제가 있다.",
        "sourceNote": "210_260927_155229.pdf · 1쪽"
      },
      {
        "id": "social-141",
        "context": "법에 범죄로 규정되지 않으면 처벌할 수 없다는 원칙 X. X의 의의는?",
        "explanation": "죄형 법정주의는 국민의 자유와 권리를 보장하기 위한 국가 권력의 자기 제한이다.",
        "sourceNote": "210_260927_155229.pdf · 2쪽"
      },
      {
        "id": "social-142",
        "context": "형벌이 범죄 행위에 대한 책임을 초과해서는 안 된다는 원칙은?",
        "explanation": "비례성의 원칙은 범죄와 형벌 사이에 적정한 균형을 유지해야 한다는 원칙이다.",
        "sourceNote": "210_260927_155229.pdf · 2쪽"
      },
      {
        "id": "social-143",
        "context": "형벌을 정언 명령으로 본 A, 종신 노역형이 낫다고 본 B는?",
        "explanation": "칸트는 형벌의 법칙을 정언 명령으로 보았고, 베카리아는 지속적인 종신 노역형이 범죄 예방에 더 효과적이라 했다.",
        "sourceNote": "210_260927_155229.pdf · 2쪽"
      },
      {
        "id": "social-144",
        "context": "칸트의 사형론으로 옳지 않은 것은?",
        "explanation": "칸트는 생과 사 사이에 동종성이 없어 사형을 대체할 형벌이 없다고 보았다.",
        "sourceNote": "210_260927_155229.pdf · 2쪽"
      },
      {
        "id": "social-145",
        "context": "살인자를 사회 계약을 깨뜨린 '적'으로 본 X. X가 사형을 정당화한 근거는?",
        "explanation": "루소는 시민의 생명과 안전 확보라는 사회 계약의 목적에 따라 사형이 정당하다고 보았다.",
        "sourceNote": "210_260927_155229.pdf · 2쪽"
      },
      {
        "id": "social-146",
        "context": "'사형은 한 시민에 대한 국가의 전쟁'이라 한 X. X가 본 범죄의 척도는?",
        "explanation": "베카리아는 범죄의 유일하고 타당한 척도는 범죄자의 의도가 아니라 사회에 끼친 해악이라고 보았다.",
        "sourceNote": "210_260927_155229.pdf · 2쪽"
      },
      {
        "id": "social-147",
        "context": "베카리아의 사형론으로 옳지 않은 것은?",
        "explanation": "베카리아는 사형의 인상은 강렬하나 순간적이라 보고, 억제력은 지속성에서 나오므로 종신 노역형이 더 효과적이라 했다.",
        "sourceNote": "210_260927_155229.pdf · 2쪽"
      },
      {
        "id": "social-148",
        "context": "베카리아가 예외적으로 사형을 인정한 경우는?",
        "explanation": "베카리아는 살인자가 국가의 안전을 위협할 충분한 힘과 조직을 보유한 경우에 한해 사형을 인정했다.",
        "sourceNote": "210_260927_155229.pdf · 3쪽"
      },
      {
        "id": "social-149",
        "context": "루소와 베카리아의 공통점은? (사형 찬반은 다름)",
        "explanation": "루소(찬성)와 베카리아(반대)는 모두 사회 계약론의 관점에서 형벌 문제에 접근했다.",
        "sourceNote": "210_260927_155229.pdf · 2쪽"
      },
      {
        "id": "social-150",
        "context": "벤담에서 일반 예방주의는 사형 A, 특수 예방주의는 사형 B로 이어진다. A–B는?",
        "explanation": "처벌 예고로 일반인의 범죄를 막는 일반 예방은 찬성 논거가, 재사회화를 중시하는 특수 예방은 반대 논거가 된다.",
        "sourceNote": "210_260927_155229.pdf · 3쪽"
      },
      {
        "id": "social-151",
        "context": "사형 제도 반대 논거로 옳지 않은 것은?",
        "explanation": "흉악범의 영구 격리가 필요하다는 것은 사형 찬성 논거다.",
        "sourceNote": "210_260927_155229.pdf · 3쪽"
      }
    ],
    "topicKeys": [
      "교정적 정의"
    ]
  },
  {
    "id": "social-concept-11",
    "deckId": "social",
    "title": "자유주의 vs 공동체주의",
    "summary": "자유주의는 개인의 선택과 권리를, 공동체주의는 정체성의 공동체적 형성과 공동선을 강조한다. 두 입장 모두 정의로운 사회를 지향하며 내부 차이가 있다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "롤스: 평등주의적 자유주의 / 노직: 자유 지상주의",
          "무연고적 자아와 연고적·서사적 자아 구별",
          "샌델: 공동선과 시민 토론",
          "매킨타이어: 공동체의 이야기와 정체성",
          "자유주의의 약자 소외·공동체주의의 집단주의 위험"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "부유세나 역사적 책임을 다루는 발언에서 결론보다 개인의 권리와 공동체의 연속성 중 무엇을 근거로 드는지 읽는다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "모든 자유주의자가 복지나 재분배에 반대한다고 묶지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "social-152",
        "context": "마스크 의무화에 반대하는 A, 찬성하는 B의 정의관은?",
        "explanation": "개인의 자유를 근거로 반대하면 자유주의적, 공동체의 안전을 근거로 찬성하면 공동체주의적 정의관이다.",
        "sourceNote": "211_261006_215826.pdf · 1쪽"
      },
      {
        "id": "social-153",
        "context": "개인이 공동체 전통에서 독립된 존재라는 정의관 X. X의 인간관은?",
        "explanation": "자유주의적 정의관은 개인을 공동체의 전통이나 가치로부터 독립적이고 자율적인 무연고적 자아로 본다.",
        "sourceNote": "211_261006_215826.pdf · 1쪽"
      },
      {
        "id": "social-154",
        "context": "자유주의적 정의관에 대한 설명으로 옳지 않은 것은?",
        "explanation": "자유주의는 사회나 국가가 개인에게 특정 가치관을 강제할 수 없으며 개인의 선택권과 자율성을 보장해야 한다고 본다.",
        "sourceNote": "211_261006_215826.pdf · 1쪽"
      },
      {
        "id": "social-155",
        "context": "같은 자유주의지만 롤스는 A 자유주의, 노직은 B다. A–B는?",
        "explanation": "롤스는 자유와 평등의 조화를 중시하는 평등주의적 자유주의, 노직은 자유를 최우선하는 자유 지상주의다.",
        "sourceNote": "211_261006_215826.pdf · 2쪽"
      },
      {
        "id": "social-156",
        "context": "자유주의가 받는 비판 A, 공동체주의가 받는 비판 B는?",
        "explanation": "자유주의는 극단적 이기주의·약자 소외, 공동체주의는 집단주의·연고주의를 초래할 수 있다는 비판을 받는다.",
        "sourceNote": "211_261006_215826.pdf · 2쪽"
      },
      {
        "id": "social-157",
        "context": "공동체주의적 정의관으로 옳지 않은 것은?",
        "explanation": "공동체주의는 국가가 좋은 삶의 기반이자 정체성의 바탕이므로 도덕적 중립이 불가능하다고 본다.",
        "sourceNote": "211_261006_215826.pdf · 2쪽"
      },
      {
        "id": "social-158",
        "context": "서사적 자아를 말한 A, 연고적 자아를 말한 B는?",
        "explanation": "매킨타이어는 공동체의 이야기 속에서 정체성을 형성하는 서사적 자아를, 샌델은 연고적 자아를 강조했다.",
        "sourceNote": "211_261006_215826.pdf · 3쪽"
      },
      {
        "id": "social-159",
        "context": "서사적 자아를 말한 X. X가 본 현대 사회 분열의 원인은?",
        "explanation": "매킨타이어는 인간을 자유롭고 독립적인 존재로만 보는 자유주의적 인간관에서 현대 사회의 분열이 비롯되었다고 보았다.",
        "sourceNote": "211_261006_215826.pdf · 3쪽"
      },
      {
        "id": "social-160",
        "context": "하나의 사회적 가치가 모든 영역을 장악하는 것을 '전제'라 한 X. X가 비판한 것은?",
        "explanation": "왈처는 공동체의 역사적·문화적 맥락에 따른 다양한 정의 기준을 인정하며 보편주의적 정의관을 비판했다.",
        "sourceNote": "211_261006_215826.pdf · 3쪽"
      },
      {
        "id": "social-161",
        "context": "연고적 자아를 말한 X. X가 공동선 실현에 가장 중요하다고 본 것은?",
        "explanation": "샌델은 시민의 적극적인 정치 참여와 활발한 토론으로 공동선을 실현하는 것이 무엇보다 중요하다고 보았다.",
        "sourceNote": "211_261006_215826.pdf · 3쪽"
      },
      {
        "id": "social-162",
        "context": "'도둑맞은 세대'에 사과한 A 총리, 보상을 거부한 B 총리는?",
        "explanation": "케빈 러드는 공동체주의적으로 과거 잘못을 사과했고, 존 하워드는 자유주의적으로 현세대 책임을 거부했다.",
        "sourceNote": "211_261006_215826.pdf · 3쪽"
      },
      {
        "id": "social-163",
        "context": "앞선 세대의 일을 현세대가 보상할 까닭이 없다는 하워드 총리의 정의관은?",
        "explanation": "존 하워드의 발언은 개인을 공동체 역사와 분리된 존재로 보는 자유주의적 정의관에 가깝다.",
        "sourceNote": "211_261006_215826.pdf · 3쪽"
      },
      {
        "id": "social-164",
        "context": "자유주의 정의관에서 부유세에 대한 입장과 그 근거는?",
        "explanation": "자유주의 관점에서 부유세는 개인이 정당하게 소유한 재산을 침해해 자유를 제한하므로 반대한다.",
        "sourceNote": "211_261006_215826.pdf · 5쪽"
      },
      {
        "id": "social-165",
        "context": "공동 목초지가 앞다툰 방목으로 황폐해진 사례 X. X의 시사점은?",
        "explanation": "공유지의 비극은 사익만 추구하고 공익을 고려하지 않으면 결국 사익조차 지킬 수 없음을 보여 준다.",
        "sourceNote": "211_261006_215826.pdf · 6쪽"
      },
      {
        "id": "social-166",
        "context": "두 정의관의 관계에 대한 설명으로 옳은 것은?",
        "explanation": "두 정의관은 개인의 행복 추구와 정의로운 사회를 함께 지향한다는 점에서 상호 보완적이다.",
        "sourceNote": "211_261006_215826.pdf · 6쪽"
      }
    ],
    "topicKeys": [
      "자유주의 vs 공동체주의"
    ]
  },
  {
    "id": "astronomy-jeon-concept-1",
    "deckId": "astronomy-jeon",
    "title": "궤도와 속력",
    "summary": "케플러 제1법칙은 태양이 타원 궤도의 한 초점에 있다는 설명이고, 제2법칙은 같은 시간에 같은 면적을 쓸고 지나간다는 설명이다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "근일점 빠름·원일점 느림",
          "이심률 작음→원에 가까움",
          "같은 면적→같은 시간",
          "같은 시간에 같은 이동 거리라는 뜻은 아님"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "근일점의 짧은 호와 원일점의 짧은 호를 비교할 때 속력은 태양과의 거리와 면적속도로 판단한다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "태양을 타원의 중심에 두거나 거리와 속력을 같은 비례로 놓지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-jeon-001",
        "context": "행성이 타원을 돈다. 태양을 놓아야 할 자리는?",
        "explanation": "타원 궤도 법칙에서 태양은 타원의 중심이 아니라 두 초점 중 하나에 위치한다.",
        "sourceNote": "행성우주과학 1번_260827_102641.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-002",
        "context": "궤도가 원에 가까워졌다. 작아진 궤도 지표는?",
        "explanation": "이심률은 궤도가 원에서 벗어난 정도다. 이심률이 작을수록 원에 가까워진다.",
        "sourceNote": "행성우주과학 1번_260827_102641.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-003",
        "context": "긴반지름은 그대로, 궤도만 더 납작해졌다. 커진 값은?",
        "explanation": "같은 긴반지름에서 이심률이 커지면 짧은반지름이 줄고 궤도가 더 납작해진다.",
        "sourceNote": "행성우주과학 1번_260827_102641.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-004",
        "context": "같은 행성이 가장 빠르게 지나가는 궤도 위치는?",
        "explanation": "면적속도가 일정하므로 태양에 가장 가까운 근일점에서 속력이 가장 크다.",
        "sourceNote": "행성우주과학 1번_260827_102641.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-005",
        "context": "근일점보다 원일점에서 같은 시간 동안 이동한 호는?",
        "explanation": "원일점에서 속력이 더 작으므로 같은 시간 동안 이동하는 궤도상의 길이도 더 짧다.",
        "sourceNote": "행성우주과학 3번_260827_101443.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-006",
        "context": "태양에서 먼 구간과 가까운 구간을 같은 시간 동안 지났다. 같은 양은?",
        "explanation": "태양과 행성을 잇는 선이 같은 시간에 쓸고 지나가는 면적은 같다. 이동 거리나 속력이 같다는 뜻은 아니다.",
        "sourceNote": "행성우주과학 1번_260827_102641.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-007",
        "context": "쓸린 면적이 A에서 B의 두 배다. 통과 시간도 몇 배인가?",
        "explanation": "같은 행성의 면적속도는 일정하다. 따라서 쓸린 면적과 통과 시간은 비례한다.",
        "sourceNote": "행성우주과학 3번_260827_101443.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-008",
        "context": "긴반지름은 같고 이심률만 커졌다. 두 끝점의 속력 차이는?",
        "explanation": "궤도가 더 납작할수록 근일점과 원일점 거리 차이가 커져 두 위치의 속력 차이도 커진다.",
        "sourceNote": "행성우주과학 1번_260827_102641.pdf · 2쪽"
      }
    ],
    "topicKeys": [
      "궤도와 속력"
    ]
  },
  {
    "id": "astronomy-jeon-concept-2",
    "deckId": "astronomy-jeon",
    "title": "법칙의 유도",
    "summary": "중력은 중심력이므로 태양 기준 돌림힘이 0이고 각운동량이 보존된다. 이것이 일정한 면적속도의 근거다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "L=mrv⊥",
          "dA/dt=L/(2m)",
          "근·원일점은 속도가 반지름과 수직이므로 rₚvₚ=rₐvₐ",
          "원운동에서 GMm/r²=mv²/r"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "rₐ=3rₚ이면 vₚ=3vₐ다. 원궤도에서는 v=√(GM/r)."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "타원 궤도의 모든 지점에서 속도와 반지름이 수직이라고 가정하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-jeon-009",
        "context": "중력은 태양을 향한다. 태양 기준으로 행성을 비트는 효과는?",
        "explanation": "태양 기준 위치벡터와 중력이 같은 직선에 있으므로 돌림힘 rF sinθ는 0이다.",
        "sourceNote": "행성우주과학 2번_260827_101626.pdf · 6쪽"
      },
      {
        "id": "astronomy-jeon-010",
        "context": "태양 기준 알짜 돌림힘이 0이다. 보존되는 회전 운동의 양은?",
        "explanation": "중심력인 중력이 태양 기준 돌림힘을 만들지 않아 각운동량이 보존된다.",
        "sourceNote": "행성우주과학 3번_260827_101443.pdf · 7쪽"
      },
      {
        "id": "astronomy-jeon-011",
        "context": "짧은 시간의 쓸린 넓이를 구할 때 삼각형 높이에 넣을 속도는?",
        "explanation": "쓸린 삼각형의 높이는 v⊥Δt다. 반지름 방향 이동은 이 삼각형의 높이를 만들지 않는다.",
        "sourceNote": "행성우주과학 2번_260827_101626.pdf · 4쪽"
      },
      {
        "id": "astronomy-jeon-012",
        "context": "L=mrv⊥다. 같은 행성의 면적속도 ΔA/Δt를 나타내면?",
        "explanation": "ΔA=rv⊥Δt/2이고 L=mrv⊥이므로 ΔA/Δt=L/(2m)이다.",
        "sourceNote": "행성우주과학 2번_260827_101626.pdf · 4쪽"
      },
      {
        "id": "astronomy-jeon-013",
        "context": "원일점 거리가 근일점의 3배다. 근일점 속력은 원일점의?",
        "explanation": "두 끝점에서 속도는 반지름에 수직이다. rₚvₚ=rₐvₐ이므로 vₚ=3vₐ다.",
        "sourceNote": "행성우주과학 2번_260827_101626.pdf · 6쪽"
      },
      {
        "id": "astronomy-jeon-014",
        "context": "근일점 속력이 원일점의 2배다. 원일점 거리는 근일점의?",
        "explanation": "rₚvₚ=rₐvₐ에서 vₚ=2vₐ를 대입하면 rₐ=2rₚ다.",
        "sourceNote": "행성우주과학 2번_260827_101626.pdf · 6쪽"
      },
      {
        "id": "astronomy-jeon-015",
        "context": "원궤도에서 공전 방향을 계속 안쪽으로 굽히는 힘은?",
        "explanation": "원궤도 유도에서 태양의 중력이 원운동에 필요한 구심력 역할을 한다.",
        "sourceNote": "행성우주과학 3번_260827_101443.pdf · 10쪽"
      },
      {
        "id": "astronomy-jeon-016",
        "context": "태양 질량 M이 행성보다 매우 크다. 원궤도 속력 v²는?",
        "explanation": "GMm/r²=mv²/r에서 행성 질량 m을 소거하면 v²=GM/r이다.",
        "sourceNote": "행성우주과학 2번_260827_101626.pdf · 8쪽"
      }
    ],
    "topicKeys": [
      "법칙의 유도"
    ]
  },
  {
    "id": "astronomy-jeon-concept-3",
    "deckId": "astronomy-jeon",
    "title": "주기와 거리",
    "summary": "같은 중심 천체를 도는 궤도에서는 T²∝a³이다. 타원의 긴반지름과 순간 거리를 구별하고 단위를 통일한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "T²=4π²a³/(GM)",
          "태양 중심·년과 AU이면 수업 근사 T²=a³",
          "원궤도 v∝r^(−1/2)",
          "같은 a에서 T∝M^(−1/2)"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "a=4 AU이면 T=8년이다. 원궤도 반지름이 4배이면 속력은 1/2배, 주기는 8배다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "타원의 조화 법칙에 순간 거리나 짧은반지름을 넣지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-jeon-017",
        "context": "같은 별을 도는 두 행성의 T²/a³가 같으려면 a는?",
        "explanation": "타원 궤도의 조화 법칙은 긴반지름 a를 사용한다. 순간 거리나 짧은반지름을 넣지 않는다.",
        "sourceNote": "행성우주과학 2번_260827_101626.pdf · 9쪽"
      },
      {
        "id": "astronomy-jeon-018",
        "context": "태양을 돌며 긴반지름이 지구의 4배다. 공전 주기는?",
        "explanation": "긴반지름을 AU, 주기를 년으로 쓰면 T²=a³다. T²=64이므로 T=8년이다.",
        "sourceNote": "행성우주과학 2번_260827_101626.pdf · 10쪽"
      },
      {
        "id": "astronomy-jeon-019",
        "context": "태양을 도는 행성의 주기가 8년이다. 긴반지름은?",
        "explanation": "T²=a³에서 a³=64다. 따라서 긴반지름 a=4 AU다.",
        "sourceNote": "행성우주과학 2번_260827_101626.pdf · 10쪽"
      },
      {
        "id": "astronomy-jeon-020",
        "context": "근일점 3.8 AU, 원일점 4.2 AU다. 법칙에 넣을 a는?",
        "explanation": "긴반지름은 두 끝점 거리의 평균이다. a=(3.8+4.2)/2=4 AU다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-021",
        "context": "같은 별 주위 원궤도 반지름이 4배다. 공전 속력은?",
        "explanation": "원궤도에서 v²=GM/r이다. 반지름이 4배면 v²은 1/4배, 속력은 1/2배다.",
        "sourceNote": "행성우주과학 2번_260827_101626.pdf · 8쪽"
      },
      {
        "id": "astronomy-jeon-022",
        "context": "같은 별 주위 원궤도 반지름이 4배다. 주기는?",
        "explanation": "T²∝r³이므로 반지름이 4배일 때 주기는 √64=8배다.",
        "sourceNote": "행성우주과학 2번_260827_101626.pdf · 9쪽"
      },
      {
        "id": "astronomy-jeon-023",
        "context": "반지름은 같은데 중심별 질량이 4배다. 주기는?",
        "explanation": "T²=4π²r³/(GM)이다. 중심별 질량이 4배면 T²은 1/4배, T는 1/2배다.",
        "sourceNote": "행성우주과학 2번_260827_101626.pdf · 9쪽"
      },
      {
        "id": "astronomy-jeon-024",
        "context": "궤도 크기가 다른 행성들을 비교하는 법칙은?",
        "explanation": "조화의 법칙은 서로 다른 행성의 궤도 긴반지름과 공전 주기를 비교한다. 제2법칙은 한 행성의 위치별 운동을 설명한다.",
        "sourceNote": "행성우주과학 2번_260827_101626.pdf · 11쪽"
      }
    ],
    "topicKeys": [
      "주기와 거리"
    ]
  },
  {
    "id": "astronomy-jeon-concept-4",
    "deckId": "astronomy-jeon",
    "title": "천구의 기준",
    "summary": "천구는 실제 거리 대신 관측 방향을 가상 구에 투영한 것이다. 관측자 기준과 지구 자전축 기준을 구별한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "천정·천저: 관측자의 연직선",
          "지평선: 관측자의 수평면",
          "천구 극: 지구 자전축 연장",
          "천구 적도: 적도면 연장",
          "수직권과 시간권의 기준 차이"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "천정은 장소가 바뀌면 달라지지만 천구 북극의 방향은 자전축을 기준으로 한다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "천정과 천구 북극이 항상 같은 점이라고 생각하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-jeon-025",
        "context": "거리는 다르지만 같은 방향의 두 천체를 천구에 표시하면?",
        "explanation": "천구는 방향을 나타내는 가상 구다. 실제 거리가 달라도 방향이 같으면 같은 위치로 투영된다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-026",
        "context": "발밑이 아니라 머리 바로 위의 하늘점을 찾았다. 그 점은?",
        "explanation": "관측자의 연직선을 위로 연장해 천구와 만나는 점이 천정이다. 아래쪽은 천저다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-027",
        "context": "머리 위 천정의 반대편, 연직선 아래쪽 끝점은?",
        "explanation": "천정과 천저는 관측자의 연직선 양쪽 끝점이다. 천구 극과는 기준이 다르다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-028",
        "context": "지구 적도면을 하늘까지 늘였다. 생기는 대원은?",
        "explanation": "지구의 적도면을 연장해 천구와 만나는 대원이 천구의 적도다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-029",
        "context": "관측자가 선 수평면을 하늘까지 늘였다. 생기는 대원은?",
        "explanation": "관측자의 수평면을 연장해 천구와 만나는 대원이 지평선이다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-030",
        "context": "지구 자전축을 하늘까지 연장해서 얻는 두 점은?",
        "explanation": "천구 북극과 남극은 지구 자전축을 연장한 방향이다. 천정·천저는 관측지의 연직선으로 정한다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-031",
        "context": "북극과 천정을 함께 지나는 대원이 지평선을 만나는 곳은?",
        "explanation": "천구 극과 천정을 지나는 자오선은 지평선과 북점·남점에서 만난다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-032",
        "context": "천정·천저를 지나며 고도를 재는 대원은?",
        "explanation": "수직권은 천정·천저를 지나는 대원이다. 고도는 지평선에서 수직권을 따라 잰다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-033",
        "context": "천구 북극·남극을 지나며 적위를 재는 대원은?",
        "explanation": "시간권은 천구의 두 극을 지나는 대원이다. 적위는 천구 적도에서 시간권을 따라 잰다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 2쪽"
      }
    ],
    "topicKeys": [
      "천구의 기준"
    ]
  },
  {
    "id": "astronomy-jeon-concept-5",
    "deckId": "astronomy-jeon",
    "title": "좌표 읽기",
    "summary": "지평 좌표는 방위각·고도, 적도 좌표는 적경·적위로 표현한다. 기준 방향과 각도·시간 환산을 먼저 확인한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "이 자료의 방위각: 북0°·동90°·남180°·서270°",
          "고도+천정거리=90°",
          "적경은 춘분점 기준 0h~24h·1h=15°",
          "적위는 적도 북쪽 +·남쪽 −",
          "북반구 천구 북극 고도=위도"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "천정거리 30°이면 고도 60°다. 적경 6h는 90°다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "자료마다 방위각 기준이 다를 수 있으므로 북점 기준인지 먼저 확인한다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-jeon-034",
        "context": "같은 별을 두 시간 뒤 다시 봤다. 달라지는 좌표 쌍은?",
        "explanation": "지평 좌표는 관측 시각·장소에 따라 변한다. 별의 적도 좌표는 수업에서 다루는 짧은 시간 동안 거의 일정하다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-035",
        "context": "다른 관측지끼리 같은 별을 찾을 공통 좌표는?",
        "explanation": "적도 좌표는 관측자의 위치와 시각에 따른 지평 좌표의 변화를 피해서 별의 방향을 공유한다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-036",
        "context": "북점 기준 시계 방향 방위각 90°다. 어느 방향인가?",
        "explanation": "이 자료는 북점 0°에서 시계 방향으로 방위각을 잰다. 동점은 90°, 남점 180°, 서점 270°다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-037",
        "context": "북점 기준 시계 방향 방위각 270°다. 어느 방향인가?",
        "explanation": "북점 기준 시계 방향의 방위각에서 서쪽은 270°다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-038",
        "context": "남쪽 자오선에 있는 천체의 방위각은? 북점 기준이다.",
        "explanation": "남쪽 자오선의 천체는 정남 방향이다. 북점 기준 방위각은 180°다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-039",
        "context": "천정거리가 30°다. 지평선에서 잰 고도는?",
        "explanation": "천정은 고도 90°다. 고도와 천정거리는 서로 더해 90°이므로 고도는 60°다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-040",
        "context": "적경의 출발점은 천구 적도와 황도가 만나는 어느 점인가?",
        "explanation": "적경은 춘분점에서 천구 적도를 따라 재며 0h~24h로 나타낸다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-041",
        "context": "적경 차이가 6h다. 천구 적도를 따라 잰 각도 차이는?",
        "explanation": "적경 24h는 360°이므로 1h는 15°다. 6h는 90°에 해당한다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-042",
        "context": "천구 적도 남쪽으로 20° 떨어진 별의 적위는?",
        "explanation": "적위는 천구 적도 북쪽을 양수, 남쪽을 음수로 나타낸다. 따라서 −20°다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-043",
        "context": "별이 천구 적도 위에 있다. 적위는?",
        "explanation": "적위는 천구 적도에서 떨어진 각거리다. 천구 적도 위에서는 0°다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-044",
        "context": "북반구에서 천구 북극 고도 40°를 측정했다. 관측지 위도는?",
        "explanation": "북반구에서 천구 북극의 고도는 관측지의 위도와 같다. 북극성은 그 방향을 찾는 근사 기준이다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-045",
        "context": "위도 35°N에서 별이 천정을 통과한다. 그 별의 적위는?",
        "explanation": "관측지 천정의 적위는 그 장소의 위도와 같다. 따라서 천정 통과 별의 적위는 +35°다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-046",
        "context": "두 별의 적위가 같다. 별마다 다를 수 있는 나머지 적도 좌표는?",
        "explanation": "적도 좌표는 적경·적위의 두 값이다. 같은 적위라도 적경이 다르면 천구상의 위치가 다르다.",
        "sourceNote": "행성우주과학 4번_260909_115826.pdf · 3쪽"
      }
    ],
    "topicKeys": [
      "좌표 읽기"
    ]
  },
  {
    "id": "astronomy-jeon-concept-6",
    "deckId": "astronomy-jeon",
    "title": "일주운동",
    "summary": "지구가 서→동으로 자전하여 천체는 동→서로 하루에 한 바퀴 도는 것처럼 보인다. 출몰 조건은 위도와 적위로 판단한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "시간당 약 15°",
          "북쪽 하늘은 북극 중심 반시계",
          "북반구 주극성 δ>90°−φ·전몰성 δ<−(90°−φ)",
          "동서 방향 일주권과 지평선의 각은 90°−φ"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "위도 40°N에서는 적위 +60°가 주극성, −60°가 전몰성, +20°는 출몰성이다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "경계에 접하는 별은 등호 조건을 따로 확인한다. 출몰을 적경만으로 판단하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-jeon-047",
        "context": "별이 동쪽에서 서쪽으로 흘러간다. 이 겉보기 운동의 원인은?",
        "explanation": "지구가 서→동으로 자전하므로 하늘은 반대인 동→서로 일주운동하는 것처럼 보인다.",
        "sourceNote": "행성우주과학 5번_260915_145403.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-048",
        "context": "일주운동으로 별이 그리는 하루의 경로는?",
        "explanation": "일주권은 천체가 일주운동으로 천구에 그리는 경로다. 황도는 태양의 연주운동 경로다.",
        "sourceNote": "행성우주과학 5번_260915_145403.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-049",
        "context": "별이 2시간 동안 일주운동했다. 천구 극 둘레 회전각은?",
        "explanation": "일주운동의 회전각은 시간당 약 15°다. 2시간이면 약 30°다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-050",
        "context": "위도 40°N, 동쪽 하늘의 일주권과 지평선 사이 각은?",
        "explanation": "동·서쪽에서 일주권이 지평선과 이루는 각은 90°−위도다. 따라서 50°다.",
        "sourceNote": "행성우주과학 5번_260915_145403.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-051",
        "context": "북반구 북쪽 하늘을 정면으로 본 별 궤적의 회전 방향은?",
        "explanation": "북쪽 하늘의 별은 천구 북극을 중심으로 반시계 방향으로 일주운동한다.",
        "sourceNote": "행성우주과학 5번_260915_145403.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-052",
        "context": "하루 내내 떠 있고 한 번도 지평선 아래로 내려가지 않는 별은?",
        "explanation": "주극성의 일주권 전체는 지평선 위에 있어 관측지에서 하루 내내 지지 않는다.",
        "sourceNote": "행성우주과학 5번_260915_145403.pdf · 4쪽"
      },
      {
        "id": "astronomy-jeon-053",
        "context": "하루가 지나도 지평선 위로 전혀 올라오지 않는 별은?",
        "explanation": "전몰성은 해당 관측지에서 일주권 전체가 지평선 아래에 있는 별이다.",
        "sourceNote": "행성우주과학 5번_260915_145403.pdf · 4쪽"
      },
      {
        "id": "astronomy-jeon-054",
        "context": "위도 40°N에서 적위 +60°인 별은 어느 부류인가?",
        "explanation": "북반구 주극성 조건은 δ>90°−φ다. 경계 50°보다 적위 60°가 크므로 주극성이다.",
        "sourceNote": "행성우주과학 5번_260915_145403.pdf · 5쪽"
      },
      {
        "id": "astronomy-jeon-055",
        "context": "위도 40°N에서 적위 −60°인 별은 어느 부류인가?",
        "explanation": "북반구 전몰성 조건은 δ<−(90°−φ)다. −60°는 −50°보다 작으므로 전몰성이다.",
        "sourceNote": "행성우주과학 5번_260915_145403.pdf · 5쪽"
      },
      {
        "id": "astronomy-jeon-056",
        "context": "위도 40°N에서 적위 +20°인 별은 어느 부류인가?",
        "explanation": "위도 40°N에서 경계는 적위 ±50°다. +20°는 그 사이이므로 뜨고 지는 출몰성이다.",
        "sourceNote": "행성우주과학 5번_260915_145403.pdf · 5쪽"
      },
      {
        "id": "astronomy-jeon-057",
        "context": "북반구에서 더 북쪽으로 이동했다. 주극성이 되는 적위 범위는?",
        "explanation": "위도가 커지면 주극성 경계 90°−φ가 낮아져 더 많은 북쪽 별이 주극성이 된다.",
        "sourceNote": "행성우주과학 5번_260915_145403.pdf · 5쪽"
      },
      {
        "id": "astronomy-jeon-058",
        "context": "적도에서는 별의 일주권이 지평선을 어떤 각으로 가로지르는가?",
        "explanation": "적도에서는 φ=0°이므로 일주권과 지평선의 각 90°−φ는 90°다.",
        "sourceNote": "행성우주과학 5번_260915_145403.pdf · 5쪽"
      },
      {
        "id": "astronomy-jeon-059",
        "context": "북극에서 보이는 별의 일주권은 지평선과 어떤 관계인가?",
        "explanation": "북극에서는 천구 북극이 천정에 있어 별의 일주권이 지평선과 평행하다.",
        "sourceNote": "행성우주과학 5번_260915_145403.pdf · 5쪽"
      },
      {
        "id": "astronomy-jeon-060",
        "context": "같은 적위의 출몰성, 적경은 5h와 6h다. 먼저 뜨는 쪽은?",
        "explanation": "적위가 같아 출몰 조건이 같으면 적경이 작은 별이 먼저 뜬다. 서로 다른 적위에는 이 단순 비교를 그대로 쓰지 않는다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-061",
        "context": "별 A는 적경 6h·적위 70°, B는 18h·30°. 위도 37.5°N의 주극성은?",
        "explanation": "주극성 경계는 90°−37.5°=52.5°다. 적경이 아니라 적위로 판단하므로 A만 주극성이다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 1쪽"
      }
    ],
    "topicKeys": [
      "일주운동"
    ]
  },
  {
    "id": "astronomy-jeon-concept-7",
    "deckId": "astronomy-jeon",
    "title": "연주운동",
    "summary": "지구 공전 때문에 같은 시각의 별자리가 날짜에 따라 서쪽으로 이동하고 같은 별의 남중이 빨라진다. 태양은 배경 별에 대해 동쪽으로 이동한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "별 남중은 하루 약 4분 빨라짐·한 달 약 2시간",
          "황도: 태양의 연주 경로",
          "황도와 천구 적도 약 23.5°",
          "춘분·하지·추분·동지의 태양 적경 0·6·12·18h"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "하지의 자정 남중 방향은 태양 적경 6h에서 12h 떨어진 18h 근처다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "태양의 연주운동 방향과 하루의 일주운동 방향을 섞지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-jeon-062",
        "context": "매일 같은 시각, 별이 조금씩 서쪽으로 옮겨 보인다. 원인은?",
        "explanation": "날짜에 따른 같은 시각의 별자리 변화는 지구 공전으로 생기는 별의 연주운동이다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-063",
        "context": "별의 남중 시각이 하루에 약 4분 빨라진다. 한 달 뒤 차이는?",
        "explanation": "하루 약 4분씩 30일이면 약 120분이다. 같은 별의 남중은 약 2시간 빨라진다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-064",
        "context": "한 달 뒤 같은 시각의 별 위치와 비슷한 오늘의 시각은?",
        "explanation": "한 달의 연주운동은 같은 시각 별을 약 30° 서쪽으로 옮긴다. 오늘 2시간 더 일주운동한 모습과 비슷하다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-065",
        "context": "별과 반대로 태양은 배경 별 사이에서 해마다 어느 쪽으로 이동하나?",
        "explanation": "지구가 공전하므로 태양은 배경 별에 대해 서→동으로 연주운동한다. 일주운동 방향과 구분한다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-066",
        "context": "태양이 배경 별 사이를 1년 동안 이동하는 하늘의 길은?",
        "explanation": "황도는 지구 공전 궤도면을 천구까지 연장해 얻는 태양의 연주운동 경로다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 4쪽"
      },
      {
        "id": "astronomy-jeon-067",
        "context": "황도와 천구 적도가 기울어 만나는 근본 원인은?",
        "explanation": "지구 자전축이 공전 궤도면의 수직 방향에 대해 약 23.5° 기울어져 황도와 천구 적도도 기울어 만난다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 4쪽"
      },
      {
        "id": "astronomy-jeon-068",
        "context": "태양 적위가 음수에서 양수로 바뀌며 적도를 지난다. 통과점은?",
        "explanation": "태양이 천구 남반구에서 북반구로 이동하며 천구 적도를 지나는 점이 춘분점이다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 4쪽"
      },
      {
        "id": "astronomy-jeon-069",
        "context": "태양 적위가 양수에서 음수로 바뀌며 적도를 지난다. 통과점은?",
        "explanation": "태양이 천구 북반구에서 남반구로 이동하며 천구 적도를 지나는 점이 추분점이다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 4쪽"
      },
      {
        "id": "astronomy-jeon-070",
        "context": "태양이 춘분점에서 황도를 따라 1/4바퀴 이동했다. 적경은?",
        "explanation": "춘분·하지·추분·동지의 태양 적경은 각각 0h·6h·12h·18h다. 춘분에서 1/4바퀴 뒤는 하지다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 5쪽"
      },
      {
        "id": "astronomy-jeon-071",
        "context": "태양 적경이 6h다. 자정에 남중하는 별의 적경은?",
        "explanation": "자정에는 태양과 반대 방향, 적경 차이가 약 12h인 별이 남중한다. 6h+12h=18h다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 4쪽"
      },
      {
        "id": "astronomy-jeon-072",
        "context": "태양 적경이 18h다. 자정 남중 별의 적경은?",
        "explanation": "자정 남중 별은 태양과 적경이 12h 차이 난다. 18h+12h=30h를 24h로 한 바퀴 접으면 6h다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 5쪽"
      }
    ],
    "topicKeys": [
      "연주운동"
    ]
  },
  {
    "id": "astronomy-jeon-concept-8",
    "deckId": "astronomy-jeon",
    "title": "남중과 계절",
    "summary": "남중 고도는 관측지 위도와 천체 적위의 상대 위치로 계산한다. 남쪽 남중 공식을 쓸 때 조건을 확인한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "일반적인 상부 남중 고도 h=90°−∣φ−δ∣",
          "남쪽 남중 조건에서는 h=90°−φ+δ",
          "중위도 북반구의 태양은 하지에 가장 높음",
          "춘·추분 정동→정서·하지 북동→북서·동지 남동→남서"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "φ=35°, δ=+10°이면 남중 고도는 65°다. δ=−10°이면 45°다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "모든 위도·적위에 남쪽 남중의 단순식을 그대로 적용하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-jeon-073",
        "context": "위도 35°N, 적위 +10°인 별이 남쪽에서 남중한다. 고도는?",
        "explanation": "남쪽 남중 조건에서 h=90°−φ+δ다. 90°−35°+10°=65°다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 6쪽"
      },
      {
        "id": "astronomy-jeon-074",
        "context": "위도 35°N, 적위 −10°인 별의 남쪽 남중 고도는?",
        "explanation": "h=90°−φ+δ에 δ=−10°를 넣으면 90°−35°−10°=45°다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 6쪽"
      },
      {
        "id": "astronomy-jeon-075",
        "context": "같은 별을 더 북쪽에서 봤다. 남쪽 남중 고도는?",
        "explanation": "남쪽에서 남중하는 조건을 유지하면 h=90°−φ+δ에서 위도 φ가 커질수록 남중 고도는 낮아진다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 6쪽"
      },
      {
        "id": "astronomy-jeon-076",
        "context": "위도 35°N에서 태양의 남중 고도가 가장 높은 때는?",
        "explanation": "하지에는 태양 적위가 가장 큰 양수이므로 이 위도에서 남중 고도가 가장 높다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 6쪽"
      },
      {
        "id": "astronomy-jeon-077",
        "context": "우리나라에서 태양이 정동보다 북쪽에서 뜬다. 가능한 날은?",
        "explanation": "하지 무렵 태양은 북동쪽에서 떠 북서쪽으로 진다. 춘분·추분은 정동·정서, 동지는 남동·남서다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 6쪽"
      },
      {
        "id": "astronomy-jeon-078",
        "context": "우리나라에서 태양이 남동쪽에 뜨고 낮이 짧다. 어느 때인가?",
        "explanation": "동지에는 태양 적위가 음수이고 일주권의 지평선 위 구간이 짧다. 남동쪽에서 떠 남서쪽으로 진다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 6쪽"
      },
      {
        "id": "astronomy-jeon-079",
        "context": "춘분과 추분, 태양의 남중 고도를 같은 장소에서 비교하면?",
        "explanation": "두 때 모두 태양 적위가 0°다. 같은 장소에서는 남중 고도 90°−위도도 같다.",
        "sourceNote": "행성우주과학 6번_261001_094634.pdf · 6쪽"
      }
    ],
    "topicKeys": [
      "남중과 계절"
    ]
  },
  {
    "id": "astronomy-jeon-concept-9",
    "deckId": "astronomy-jeon",
    "title": "행성 관측",
    "summary": "내행성은 태양 근처의 새벽·초저녁, 외행성은 합·충·구의 배치를 통해 관측 시간을 판단한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "내행성 동방 최대 이각: 초저녁 서쪽 / 서방: 새벽 동쪽",
          "내합: 지구와 태양 사이·크고 가는 위상 / 외합: 멀고 둥근 위상",
          "외행성 충: 일몰에 뜨고 자정 남중",
          "동구 남중 약18시·서구 약6시의 이상화",
          "역행은 배경 별 기준 겉보기 변화"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "충 부근 외행성은 지구와 가까워 시직경이 크고 밤새 관측에 유리하다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "역행을 행성 실제 공전 방향의 반전으로 해석하지 않는다. 내행성에는 충·구를 적용하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-jeon-080",
        "context": "지구 궤도 안쪽을 도는 행성은 밤새 보일 수 있는가?",
        "explanation": "내행성은 태양에서 크게 떨어지지 않아 주로 해 뜨기 전이나 해 진 뒤에 보인다. 충이나 구의 위치가 되지 않는다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-081",
        "context": "금성이 태양 동쪽에 있다. 어느 시간대에 찾을까?",
        "explanation": "태양 동쪽의 내행성은 태양보다 늦게 지므로 초저녁 서쪽 하늘에서 볼 수 있다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-082",
        "context": "금성이 태양 서쪽 최대 이각이다. 찾을 시간·방향은?",
        "explanation": "서방 최대 이각의 내행성은 태양보다 먼저 떠 새벽 동쪽 하늘에서 관측한다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-083",
        "context": "금성을 초저녁에 비교적 오래 보려면 어느 위치가 유리한가?",
        "explanation": "동방 최대 이각에서는 내행성이 태양 동쪽으로 가장 멀리 떨어져 초저녁 관측에 유리하다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 4쪽"
      },
      {
        "id": "astronomy-jeon-084",
        "context": "태양과 지구 사이에 금성이 놓였다. 이 위치 관계는?",
        "explanation": "내합에서는 내행성이 태양과 지구 사이에 놓인다. 외합에서는 태양 반대편에 내행성이 놓인다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-085",
        "context": "금성이 태양 너머에 있다. 지구에서 본 관계는?",
        "explanation": "외합은 태양이 지구와 내행성 사이에 놓인 배치다. 내행성은 지구에서 태양과 같은 방향에 보인다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-086",
        "context": "금성의 시직경은 크지만 밝은 면이 가늘다. 가까운 위치는?",
        "explanation": "내합 부근 금성은 지구와 가까워 시직경이 크지만 햇빛을 받는 면 대부분이 지구 반대편이라 가늘게 보인다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-087",
        "context": "금성은 작게 보이지만 거의 둥글다. 가까운 위치는?",
        "explanation": "외합 부근에는 금성이 멀어 시직경은 작고, 지구를 향한 쪽 대부분이 햇빛을 받아 둥근 위상이다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-088",
        "context": "원궤도인 내행성이 최대 이각에 있다. 보이는 밝은 면은?",
        "explanation": "원궤도에서 최대 이각 시 지구에서 내행성으로 향한 선은 궤도에 접한다. 위상각이 약 90°라 반쪽 위상이다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 1쪽"
      },
      {
        "id": "astronomy-jeon-089",
        "context": "화성이 태양 반대 방향에 있다. 이각과 위치 관계는?",
        "explanation": "충에서는 지구가 태양과 외행성 사이에 놓이며 이각은 180°다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-090",
        "context": "외행성이 해 질 무렵 뜨고 자정에 남중한다. 위치는?",
        "explanation": "충의 외행성은 태양과 반대 방향이라 일몰 무렵 떠 자정에 남중하고 일출 무렵 진다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-091",
        "context": "외행성이 태양 동쪽 90°에 있다. 대략적인 남중 시각은?",
        "explanation": "동구의 외행성은 태양보다 약 6시간 늦게 남중한다. 태양 남중을 12시로 두면 18시다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-092",
        "context": "외행성이 태양 서쪽 90°에 있다. 대략적인 남중 시각은?",
        "explanation": "서구의 외행성은 태양보다 약 6시간 먼저 남중한다. 이상화한 관측 표에서 남중은 6시다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-093",
        "context": "화성이 태양과 거의 같은 시각에 뜨고 진다. 위치 관계는?",
        "explanation": "합에서는 외행성이 태양과 같은 방향에 있어 함께 뜨고 지며 밤에 관측하기 어렵다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 4쪽"
      },
      {
        "id": "astronomy-jeon-094",
        "context": "같은 외행성을 가장 크게, 오래 볼 수 있는 위치는?",
        "explanation": "충 부근 외행성은 지구와 가까워 시직경이 크고 태양 반대편에 있어 밤 동안 관측에 유리하다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 4쪽"
      },
      {
        "id": "astronomy-jeon-095",
        "context": "지구가 바깥 궤도 행성을 추월한다. 배경 별에 대한 운동은?",
        "explanation": "추월 무렵 시선 방향이 바뀌어 외행성이 배경 별에 대해 역행한다. 행성의 실제 공전 방향이 뒤집히는 것은 아니다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 2쪽"
      },
      {
        "id": "astronomy-jeon-096",
        "context": "행성이 배경 별에 대해 동쪽에서 서쪽으로 이동한다. 적경은?",
        "explanation": "역행은 배경 별에 대해 동→서로 이동하여 적경이 감소하는 겉보기 운동이다. 0h 경계를 제외한 구간에서 비교한다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-097",
        "context": "순행과 역행이 바뀌는 순간, 배경 별에 대해 멈춘 듯 보이는 것은?",
        "explanation": "유는 순행과 역행이 전환될 때 행성이 배경 별에 대해 잠시 정지한 듯 보이는 상태다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-098",
        "context": "하루 동안 동→서로 움직였다. 이것만으로 역행이라고 할 수 있나?",
        "explanation": "역행은 날짜에 따른 배경 별 상대 위치의 변화다. 하루의 동→서 일주운동만으로 역행을 판정하지 않는다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 3쪽"
      },
      {
        "id": "astronomy-jeon-099",
        "context": "내행성의 역행은 어느 위치 관계 부근에 나타나는가?",
        "explanation": "내행성은 내합 부근에서 지구에 대한 시선 방향 변화로 역행한다. 외행성은 충 부근에서 역행한다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 2쪽"
      }
    ],
    "topicKeys": [
      "행성 관측"
    ]
  },
  {
    "id": "astronomy-jeon-concept-10",
    "deckId": "astronomy-jeon",
    "title": "회합주기",
    "summary": "상대 배치가 반복되는 시간은 두 천체의 공전 각속도 차이로 결정한다. 공전 주기와 같은 시간이 아니다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "1/S=∣1/P−1/E∣",
          "모든 주기는 같은 단위",
          "지구 주기를 1년으로 둘 때 내·외행성의 부호를 구별",
          "공전 주기가 가까울수록 회합주기는 길어짐"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "외행성 P=2년이면 1/S=1−1/2이므로 S=2년이다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "주기를 그냥 더하거나 차이를 회합주기로 쓰지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-jeon-100",
        "context": "목성이 충에서 다음 충까지 돌아왔다. 측정한 주기는?",
        "explanation": "태양·지구·행성의 상대 배치가 같은 상태로 돌아오는 시간이 회합주기다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 5쪽"
      },
      {
        "id": "astronomy-jeon-101",
        "context": "회합주기를 구하려면 두 행성의 어떤 값 차이를 써야 하나?",
        "explanation": "상대 배치가 반복되는 시간은 두 천체의 공전 각속도 차로 정한다. 1/S=|1/P−1/E|다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 6쪽"
      },
      {
        "id": "astronomy-jeon-102",
        "context": "지구 주기 1년, 내행성 주기 0.5년이다. 회합주기는?",
        "explanation": "1/S=1/0.5−1/1=1이므로 S=1년이다. 같은 단위로 계산한다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 6쪽"
      },
      {
        "id": "astronomy-jeon-103",
        "context": "지구 주기 1년, 외행성 주기 2년이다. 회합주기는?",
        "explanation": "1/S=1/1−1/2=1/2이므로 S=2년이다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 6쪽"
      },
      {
        "id": "astronomy-jeon-104",
        "context": "지구 주기 1년, 금성 주기 0.6년이다. 새벽 최대 이각 반복 간격은?",
        "explanation": "1/S=1/0.6−1=2/3이므로 S=1.5년이다. 같은 쪽 최대 이각 배치도 회합주기마다 반복된다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 7쪽"
      },
      {
        "id": "astronomy-jeon-105",
        "context": "외행성의 주기가 지구 주기에 가까워졌다. 회합주기는?",
        "explanation": "공전 주기가 가까워지면 각속도 차가 줄어든다. 상대적으로 한 바퀴 따라잡는 시간이 길어져 회합주기가 커진다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 6쪽"
      }
    ],
    "topicKeys": [
      "회합주기"
    ]
  },
  {
    "id": "astronomy-jeon-concept-11",
    "deckId": "astronomy-jeon",
    "title": "달 관측",
    "summary": "달 위상은 햇빛을 받는 절반 중 지구에서 보이는 비율로 결정된다. 위상·태양과의 상대 방향·출몰 시간을 함께 연결한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "삭→상현→망→하현→삭",
          "상현: 정오 출·초저녁 남중·자정 몰",
          "망: 일몰 출·자정 남중·일출 몰",
          "하현: 자정 출·일출 남중",
          "항성월 약27.3일·삭망월 약29.5일",
          "달은 동주기 자전·월출은 평균 하루 약50분 늦어짐"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "삭망월은 달이 공전하는 동안 지구도 이동하여 같은 위상 배치를 복원하는 데 시간이 더 필요해 항성월보다 길다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "같은 면이 보인다는 사실을 자전하지 않는다는 뜻으로 해석하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-jeon-106",
        "context": "달이 한쪽 면만 지구에 보인다. 그 이유가 되는 관계는?",
        "explanation": "달은 한 바퀴 공전하는 동안 한 바퀴 자전하는 동주기 자전을 한다. 자전하지 않는 것은 아니다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 9쪽"
      },
      {
        "id": "astronomy-jeon-107",
        "context": "지구와 태양 사이 방향에 달이 있다. 지구에서 본 위상은?",
        "explanation": "삭에서는 달이 태양과 거의 같은 방향이다. 햇빛을 받는 쪽 대부분이 지구 반대편이라 잘 보이지 않는다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 8쪽"
      },
      {
        "id": "astronomy-jeon-108",
        "context": "태양 반대편의 달이 해 질 때 뜬다. 위상은?",
        "explanation": "망의 달은 태양 반대 방향에 있어 밝은 면 전체가 지구 쪽으로 보이며 일몰 무렵 뜬다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 8쪽"
      },
      {
        "id": "astronomy-jeon-109",
        "context": "반달이 초저녁에 남중하고 자정 무렵 진다. 위상은?",
        "explanation": "상현달은 태양 동쪽 90°에 있어 정오 무렵 뜨고 초저녁 남중, 자정 무렵 진다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 8쪽"
      },
      {
        "id": "astronomy-jeon-110",
        "context": "반달이 자정 무렵 떠서 새벽에 남중한다. 위상은?",
        "explanation": "하현달은 태양 서쪽 90°에 있어 자정 무렵 뜨고 일출 무렵 남중한다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 8쪽"
      },
      {
        "id": "astronomy-jeon-111",
        "context": "초저녁 서쪽 하늘에서 가느다란 달을 봤다. 위상은?",
        "explanation": "삭 이후의 초승달은 태양보다 늦게 져 초저녁 서쪽 하늘에 보인다. 그믐달은 새벽 동쪽에서 보인다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 8쪽"
      },
      {
        "id": "astronomy-jeon-112",
        "context": "해 뜨기 전 동쪽에서 가느다란 달을 봤다. 위상은?",
        "explanation": "삭 이전의 그믐달은 태양보다 먼저 떠 새벽 동쪽 하늘에서 관측한다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 8쪽"
      },
      {
        "id": "astronomy-jeon-113",
        "context": "같은 시각에 달을 매일 봤다. 배경 별에 대해 이동하는 쪽은?",
        "explanation": "달이 지구 주위를 서→동으로 공전하므로 같은 시각의 달은 배경 별에 대해 하루 약 13° 동쪽으로 이동한다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 8쪽"
      },
      {
        "id": "astronomy-jeon-114",
        "context": "달이 매일 동쪽으로 이동한다. 다음 날 월출 시각의 경향은?",
        "explanation": "지구가 달 방향을 다시 향하려면 더 자전해야 하므로 월출은 평균적으로 하루 약 50분 늦어진다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 8쪽"
      },
      {
        "id": "astronomy-jeon-115",
        "context": "달이 별을 기준으로 한 바퀴 돌아 제자리다. 이 기간은?",
        "explanation": "항성월은 배경 별을 기준으로 달이 한 바퀴 공전하는 실제 공전 주기다. 약 27.3일이다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 9쪽"
      },
      {
        "id": "astronomy-jeon-116",
        "context": "보름달에서 다음 보름달까지 잰 기간은?",
        "explanation": "같은 위상이 반복되는 기간은 삭망월이며 약 29.5일이다. 별 기준의 항성월보다 길다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 9쪽"
      },
      {
        "id": "astronomy-jeon-117",
        "context": "달은 별 기준 한 바퀴를 돌았지만 아직 보름이 아니다. 원인은?",
        "explanation": "달이 한 바퀴 도는 동안 지구도 태양 주위를 이동한다. 같은 태양·지구·달 배치를 되찾으려 달이 조금 더 공전해야 한다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 9쪽"
      },
      {
        "id": "astronomy-jeon-118",
        "context": "별 기준 주기와 위상 반복 주기 중 더 긴 달의 주기는?",
        "explanation": "지구의 공전 때문에 위상 배치가 복원될 때까지 추가 시간이 필요하여 삭망월이 항성월보다 길다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 9쪽"
      },
      {
        "id": "astronomy-jeon-119",
        "context": "달의 모양이 변할 때 달 표면에서 햇빛을 받는 비율은 대략?",
        "explanation": "일식·월식 등은 제외한다. 달의 절반은 햇빛을 받지만 지구에서 볼 수 있는 밝은 부분의 비율이 바뀐다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 8쪽"
      },
      {
        "id": "astronomy-jeon-120",
        "context": "보름달 뒤 밝은 부분이 줄어든다. 다음 반달의 위상은?",
        "explanation": "달의 위상은 삭→상현→망→하현→삭 순서다. 보름인 망 이후 밝은 부분이 줄면 하현을 지난다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 8쪽"
      },
      {
        "id": "astronomy-jeon-121",
        "context": "초저녁에 상현달을 봤다. 태양에 대한 달의 위치는?",
        "explanation": "상현달은 태양 동쪽으로 약 90° 떨어진다. 하현은 서쪽 약 90°, 망은 반대 방향이다.",
        "sourceNote": "행성우주과학 7번_261001_102238.pdf · 8쪽"
      }
    ],
    "topicKeys": [
      "달 관측"
    ]
  },
  {
    "id": "astronomy-hwang-concept-1",
    "deckId": "astronomy-hwang",
    "title": "관측 계획과 광학 구조",
    "summary": "관측 대상의 날짜·시간·방향을 먼저 확인한 뒤 안전하고 안정적인 장소에서 장비를 준비한다. 광학 부품은 기능을 구별한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "대물렌즈: 빛을 모아 상 형성",
          "접안렌즈: 형성된 상 확대",
          "파인더: 넓은 시야로 대상 찾기",
          "저배율로 도입 뒤 배율 올리기",
          "대상 선정→프로그램 확인→설치→관측"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "시야가 좁은 고배율부터 시작하면 대상을 놓치기 쉬우므로 저배율로 먼저 찾는다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "주망원경뿐 아니라 파인더로도 태양을 직접 보지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-001",
        "context": "행성이 뜨고 지는 시각이 날짜마다 달라지게 만드는 각은?",
        "explanation": "행성의 출몰 시각은 태양과 이루는 각(이각)에 따라 달라진다. 관측 프로그램으로 날짜·시각·방향을 미리 확인한다.",
        "sourceNote": "수업 슬라이드 5"
      },
      {
        "id": "astronomy-002",
        "context": "장비를 다 조립하고 보니 행성이 이미 졌다. 미리 확인했어야 할 것은?",
        "explanation": "탐구 순서는 대상 선정 → 프로그램으로 관측 가능한 날짜·시간 확인 → 망원경 설치 → 관측이다.",
        "sourceNote": "수업 슬라이드 4"
      },
      {
        "id": "astronomy-003",
        "context": "접안렌즈가 확대할 상을 먼저 맺어 주는 렌즈는?",
        "explanation": "대물렌즈가 빛을 모아 상을 맺고, 접안렌즈가 그 상을 확대한다.",
        "sourceNote": "수업 슬라이드 6"
      },
      {
        "id": "astronomy-004",
        "context": "대물렌즈가 맺은 상이 너무 작다. 이 상을 확대하는 부품은?",
        "explanation": "대물렌즈가 맺은 상을 눈으로 확대해 보는 부품이 접안렌즈다.",
        "sourceNote": "수업 슬라이드 6"
      },
      {
        "id": "astronomy-005",
        "context": "주망원경 시야에서 대상을 놓쳤다. 넓은 시야로 다시 찾는 장치는?",
        "explanation": "파인더는 배율이 낮고 시야가 넓어 대상을 먼저 찾는 데 쓴다.",
        "sourceNote": "수업 슬라이드 29"
      },
      {
        "id": "astronomy-006",
        "context": "대상을 아직 못 찾았다. 배율을 높이기 전에 먼저 넓혀야 할 것은?",
        "explanation": "저배율로 넓은 시야를 확보해 대상을 찾은 뒤에 배율을 높인다.",
        "sourceNote": "수업 슬라이드 8"
      },
      {
        "id": "astronomy-007",
        "context": "대물렌즈가 맺은 상을 확대하는 렌즈는 주망원경의 어디에 끼울까?",
        "explanation": "상을 확대하는 접안렌즈는 주망원경의 접안부에 끼운다.",
        "sourceNote": "수업 슬라이드 8"
      },
      {
        "id": "astronomy-008",
        "context": "삼각대가 기울어 가대가 흔들린다. 가장 먼저 바꿀 것은?",
        "explanation": "삼각대가 가대를 안정적으로 받치려면 평평하고 단단한 바닥에 세워야 한다.",
        "sourceNote": "수업 슬라이드 3"
      },
      {
        "id": "astronomy-024",
        "context": "파인더도 빛을 모은다. 파인더로도 직접 겨누면 안 되는 대상은?",
        "explanation": "파인더도 빛을 모으므로 주망원경과 마찬가지로 태양을 직접 보면 안 된다.",
        "sourceNote": "수업 슬라이드 12"
      }
    ],
    "topicKeys": [
      "관측 순서",
      "관측 준비",
      "구조",
      "안전"
    ]
  },
  {
    "id": "astronomy-hwang-concept-2",
    "deckId": "astronomy-hwang",
    "title": "조립과 체결",
    "summary": "자료의 조립 순서는 안정적인 지지대에서 무게와 광학계로 진행한다. 위치 조정용 부품과 이탈 방지용 부품을 구별한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "삼각대→가대→균형추→경통→파인더·접안렌즈",
          "방위각 핀을 미동 나사 사이에 위치",
          "극축 방위 조정 후 장착 너트 최종 체결",
          "추봉 안전 너트로 균형추 이탈 방지",
          "경통 밴드를 과도하게 조이지 않음"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "균형추 위치 고정 나사와 추봉 끝 안전 너트는 목적이 다르다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "과도한 조임은 미세 조정 제한·경통 변형을 일으킬 수 있다. 장비별 실제 조작은 자료의 해당 부품을 확인한다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-009",
        "context": "경통을 올리기 전에, 반대쪽 무게를 맡을 부품부터 단다. 이 부품은?",
        "explanation": "조립 순서는 삼각대 → 가대 → 균형추 → 경통 → 파인더·접안렌즈다.",
        "sourceNote": "수업 슬라이드 4"
      },
      {
        "id": "astronomy-010",
        "context": "관측에 쓸 카메라는 어떤 조절을 하기 전에 달아야 할까?",
        "explanation": "실제로 쓸 카메라와 접안렌즈를 단 상태에서 균형을 맞춘다. 나중에 달면 균형이 다시 깨진다.",
        "sourceNote": "수업 슬라이드 18"
      },
      {
        "id": "astronomy-011",
        "context": "균형을 맞췄다. 두 망원경이 같은 곳을 보게 하는 다음 단계는?",
        "explanation": "조립 뒤 순서는 균형 맞추기 → 파인더 조정 → 극축 맞추기다.",
        "sourceNote": "수업 슬라이드 4"
      },
      {
        "id": "astronomy-012",
        "context": "가대의 좌우 방위 조정 나사 두 개 사이에 끼워지는 것은?",
        "explanation": "삼각대의 방위각 핀이 가대의 방위 조정 나사 사이에 들어가야 좌우 미세 조정을 할 수 있다.",
        "sourceNote": "수업 슬라이드 14"
      },
      {
        "id": "astronomy-013",
        "context": "극축을 좌우로 미세 조정할 수 없다. 가대 밑에서 너무 세게 조인 것은?",
        "explanation": "가대 아래 장착 너트를 너무 조이면 방위 미세 조정이 막힌다. 조정할 여유를 남겨 둔다.",
        "sourceNote": "수업 슬라이드 14"
      },
      {
        "id": "astronomy-014",
        "context": "여유 있게 조여 둔 장착 너트는 언제 완전히 잠글까?",
        "explanation": "극축 방위 조정을 마친 다음 장착 너트를 완전히 조인다.",
        "sourceNote": "수업 슬라이드 14"
      },
      {
        "id": "astronomy-015",
        "context": "추봉을 빼낸 뒤, 추봉 자체를 고정하는 부품은?",
        "explanation": "추봉을 인출한 뒤 추봉 클램프를 잠가 추봉을 고정한다.",
        "sourceNote": "수업 슬라이드 15"
      },
      {
        "id": "astronomy-016",
        "context": "끝의 안전 너트를 빼고 균형추를 끼우는 막대는?",
        "explanation": "균형추는 추봉에 끼운다. 끼운 뒤에는 끝의 안전 너트를 다시 조인다.",
        "sourceNote": "수업 슬라이드 15"
      },
      {
        "id": "astronomy-017",
        "context": "균형추 고정 나사를 풀기 전, 추가 빠지지 않게 확인할 끝 부품은?",
        "explanation": "균형추 위치를 바꾸기 전에 추봉 끝 안전 너트가 조여져 있는지 확인한다. 균형추가 떨어지는 것을 막는 부품이다.",
        "sourceNote": "수업 슬라이드 15"
      },
      {
        "id": "astronomy-018",
        "context": "고정 나사는 균형추 위치를 잡는다. 추봉 끝에서 이탈을 막는 것은?",
        "explanation": "고정 나사는 균형추의 위치를, 안전 너트는 추봉 끝에서 균형추가 빠지는 것을 막는다.",
        "sourceNote": "수업 슬라이드 15"
      },
      {
        "id": "astronomy-019",
        "context": "경통을 수평으로 얹을 수 있게 받침 방향을 바꿀 때 돌리는 축은?",
        "explanation": "적위축을 돌려 경통 받침을 수평 방향으로 맞춘 뒤 경통을 얹는다.",
        "sourceNote": "수업 슬라이드 16"
      },
      {
        "id": "astronomy-020",
        "context": "경통을 고정했더니 겉면이 찌그러졌다. 너무 세게 조인 부품은?",
        "explanation": "경통 밴드를 지나치게 조이면 경통이 변형되거나 광축이 틀어질 수 있다.",
        "sourceNote": "수업 슬라이드 12"
      }
    ],
    "topicKeys": [
      "가대 설치",
      "경통 장착",
      "균형추 장착",
      "조립 순서"
    ]
  },
  {
    "id": "astronomy-hwang-concept-3",
    "deckId": "astronomy-hwang",
    "title": "두 축의 무게 균형",
    "summary": "실제 관측에 사용할 접안렌즈·카메라를 부착한 상태에서 한 축씩 균형을 확인한다. 불균형은 급회전과 구동 부담을 일으킨다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "적위축: 경통을 밴드 안에서 앞뒤 이동",
          "적경축: 균형추를 추봉을 따라 이동",
          "클램프는 한 축씩 천천히 풀기",
          "부착물이 바뀌면 다시 균형 확인",
          "수동 도입 후 클램프 잠가 모터 구동 연결"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "카메라를 나중에 달면 질량 배치가 달라져 처음 균형이 유지되지 않을 수 있다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "두 축을 동시에 풀거나 불균형을 모터 힘으로 버티게 하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-021",
        "context": "모터 대신 손으로 축을 돌리려면 먼저 풀어야 할 것은?",
        "explanation": "적경축·적위축을 손으로 움직이려면 해당 축의 클램프를 푼다.",
        "sourceNote": "수업 슬라이드 17"
      },
      {
        "id": "astronomy-022",
        "context": "손으로 돌리던 축을 다시 모터와 연결하려면 잠글 것은?",
        "explanation": "손으로 대상을 넣은 뒤 축 클램프를 다시 잠그면 구동계와 연결된다.",
        "sourceNote": "수업 슬라이드 17"
      },
      {
        "id": "astronomy-023",
        "context": "손으로 대상을 시야에 넣었다. 추적하기 전에 다시 연결할 것은?",
        "explanation": "풀었던 축 클램프를 다시 잠가 모터 구동계와 연결해야 추적할 수 있다.",
        "sourceNote": "수업 슬라이드 17"
      },
      {
        "id": "astronomy-025",
        "context": "경통이 갑자기 돌아가지 않도록, 균형은 어떤 방식으로 맞출까?",
        "explanation": "두 축을 동시에 풀면 움직임을 제어하기 어렵다. 한 축씩 풀어 균형을 확인한다.",
        "sourceNote": "수업 슬라이드 20"
      },
      {
        "id": "astronomy-026",
        "context": "클램프를 살짝 풀었더니 경통이 휙 돌아갔다. 빠뜨린 과정은?",
        "explanation": "클램프를 풀었을 때 경통이 저절로 돌아간다면 무게 균형이 맞지 않은 것이다.",
        "sourceNote": "수업 슬라이드 18"
      },
      {
        "id": "astronomy-027",
        "context": "균형이 안 맞은 채 모터로 버티면 무리가 가는 부품은?",
        "explanation": "균형이 맞지 않은 채 모터를 돌리면 기어에 부담이 커져 가대 수명이 줄어든다.",
        "sourceNote": "수업 슬라이드 18"
      },
      {
        "id": "astronomy-028",
        "context": "균형 점검 자세를 만들려고 적경축을 돌린다. 수평으로 맞출 축은?",
        "explanation": "적경 클램프를 풀어 적위축이 수평이 되게 한 뒤 고정하는 것이 점검 준비 자세다.",
        "sourceNote": "수업 슬라이드 18"
      },
      {
        "id": "astronomy-029",
        "context": "적위축을 풀자 대물렌즈 쪽이 처진다. 무엇을 앞뒤로 옮길까?",
        "explanation": "적위축 균형은 경통을 밴드 안에서 앞뒤로 밀어 맞춘다.",
        "sourceNote": "수업 슬라이드 19"
      },
      {
        "id": "astronomy-030",
        "context": "경통의 앞뒤 위치가 알맞은지 확인하려면 풀 클램프는?",
        "explanation": "경통이 갑자기 움직이지 않게 받친 채 적위 클램프를 천천히 풀어 적위축 균형을 확인한다.",
        "sourceNote": "수업 슬라이드 19"
      },
      {
        "id": "astronomy-031",
        "context": "균형을 맞춘 뒤 카메라를 달았다. 다시 확인할 것은?",
        "explanation": "카메라를 달면 무게 배치가 바뀌므로 균형을 다시 확인한다.",
        "sourceNote": "수업 슬라이드 18"
      },
      {
        "id": "astronomy-032",
        "context": "적경축을 풀자 경통 쪽이 내려간다. 추봉에서 옮길 것은?",
        "explanation": "적경축 균형은 추봉 위 균형추의 위치를 옮겨 맞춘다.",
        "sourceNote": "수업 슬라이드 20"
      },
      {
        "id": "astronomy-033",
        "context": "균형추를 끝까지 옮겨도 경통 쪽이 무겁다. 어떻게 할까?",
        "explanation": "균형추를 가장 멀리 옮겨도 경통 쪽이 무거우면 균형추를 하나 더 단다.",
        "sourceNote": "수업 슬라이드 20"
      },
      {
        "id": "astronomy-034",
        "context": "적위축 균형 / 적경축 균형을 맞출 때 각각 옮기는 것은?",
        "explanation": "적위축은 경통을 밴드 안에서 앞뒤로, 적경축은 균형추를 추봉을 따라 옮긴다. 두 축을 동시에 풀지 않는다.",
        "sourceNote": "수업 슬라이드 19"
      },
      {
        "id": "astronomy-035",
        "context": "추봉 위 균형추 위치가 알맞은지 보려면 풀어야 할 축은?",
        "explanation": "적경 클램프를 풀어 균형을 확인하고 균형추 위치를 조절한다. 두 축을 동시에 풀지 않는다.",
        "sourceNote": "수업 슬라이드 20"
      }
    ],
    "topicKeys": [
      "무게 균형",
      "클램프"
    ]
  },
  {
    "id": "astronomy-hwang-concept-4",
    "deckId": "astronomy-hwang",
    "title": "초점과 파인더 정렬",
    "summary": "초점은 상의 선명도, 광축 정렬은 두 망원경이 같은 방향을 보는지를 뜻한다. 한쪽 문제를 다른 조작으로 해결하지 않는다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "먼 표적을 저배율 주망원경 중앙에 넣음",
          "고배율에서 중심 재확인",
          "경통 고정 후 파인더 십자선 조정",
          "초점 노브·드로튜브 고정 부품 구별",
          "후드는 잡광 감소"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "상이 선명해도 파인더와 주망원경이 다른 물체를 가리키면 광축 조정을 해야 한다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "흐린 상을 방향 오차라고 하거나 시야 밖 물체를 초점 조절만으로 찾으려 하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-036",
        "context": "조준은 맞는데 별빛이 퍼져 보이지 않는다. 먼저 점검할 것은?",
        "explanation": "초점이 크게 어긋나면 별빛이 퍼져서 시야 안에 있어도 보이지 않을 수 있다.",
        "sourceNote": "수업 슬라이드 25"
      },
      {
        "id": "astronomy-037",
        "context": "상이 흐려 초점 노브를 돌리려 한다. 그 전에 풀어야 할 것은?",
        "explanation": "드로튜브 고정 클램프를 풀고 초점 노브를 돌린다. 경통 밴드와 헷갈리지 않는다.",
        "sourceNote": "수업 슬라이드 25"
      },
      {
        "id": "astronomy-038",
        "context": "초점은 맞는데 옆에서 잡광이 들어온다. 앞으로 펼 부품은?",
        "explanation": "후드를 펼치면 대물렌즈 앞쪽으로 들어오는 잡광을 줄일 수 있다.",
        "sourceNote": "수업 슬라이드 26"
      },
      {
        "id": "astronomy-039",
        "context": "후드를 펴거나 접기 전에 먼저 빼야 할 것은?",
        "explanation": "렌즈 캡을 끼운 채 후드를 움직이면 캡이 끼거나 튀어나올 수 있다.",
        "sourceNote": "수업 슬라이드 26"
      },
      {
        "id": "astronomy-040",
        "context": "파인더 다리 없이 캡 볼트만 끼우면 볼트 끝에 긁힐 수 있는 부품은?",
        "explanation": "파인더 다리 없이 캡 볼트만 끼우면 볼트 끝이 드로튜브에 닿아 긁거나 움직임을 방해한다.",
        "sourceNote": "수업 슬라이드 27"
      },
      {
        "id": "astronomy-041",
        "context": "파인더를 끼울 때 긁히지 않도록 안쪽으로 물려 둘 것은?",
        "explanation": "파인더를 넣기 전에 다리의 조정·고정 나사가 안쪽으로 튀어나오지 않게 물려 둔다.",
        "sourceNote": "수업 슬라이드 28"
      },
      {
        "id": "astronomy-042",
        "context": "파인더 상만 흐리다. 고정 링을 풀고 돌릴 부분은?",
        "explanation": "파인더 접안부의 고정 링을 풀고 접안부를 돌려 초점을 맞춘 뒤 링을 다시 잠근다.",
        "sourceNote": "수업 슬라이드 29"
      },
      {
        "id": "astronomy-043",
        "context": "두 망원경의 상은 선명한데 서로 다른 곳을 가리킨다. 맞출 것은?",
        "explanation": "상이 선명하면 초점은 맞은 것이다. 가리키는 곳이 다르면 파인더의 광축 방향을 조정한다.",
        "sourceNote": "수업 슬라이드 30"
      },
      {
        "id": "astronomy-044",
        "context": "파인더 방향을 맞출 때, 먼 표적을 먼저 시야 중앙에 넣는 쪽은?",
        "explanation": "먼 표적을 주망원경 저배율로 중앙에 넣고 고배율로 다시 맞춘 뒤, 파인더를 조정한다.",
        "sourceNote": "수업 슬라이드 30"
      },
      {
        "id": "astronomy-045",
        "context": "주망원경은 표적에 고정했다. 파인더 십자선을 옮기는 나사는?",
        "explanation": "주망원경을 고정한 채 파인더 조정 나사로 십자선 중앙을 같은 표적에 맞춘다.",
        "sourceNote": "수업 슬라이드 30"
      },
      {
        "id": "astronomy-046",
        "context": "파인더로 찾은 대상이 주망원경에도 보이려면 무엇이 나란해야 할까?",
        "explanation": "파인더와 주망원경의 광축이 나란해야 두 망원경이 같은 대상을 가리킨다.",
        "sourceNote": "수업 슬라이드 29"
      }
    ],
    "topicKeys": [
      "초점",
      "초점과 광축",
      "파인더 장착",
      "후드"
    ]
  },
  {
    "id": "astronomy-hwang-concept-5",
    "deckId": "astronomy-hwang",
    "title": "관리와 보관",
    "summary": "렌즈와 가대의 손상을 예방하려면 먼지·수분·온도 변화와 기계적 체결을 관리한다. 임의 분해는 광학 성능을 손상시킬 수 있다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "먼저 블로어로 먼지 제거",
          "렌즈 전용 종이로 가볍게 청소",
          "수분 건조 후 보관",
          "급격한 온도 변화·스프레이 냉각 주의",
          "젖은 가대의 회로 보호"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "먼지가 붙은 상태에서 문지르면 렌즈가 긁힐 수 있다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "외관에 흠집이 없어도 렌즈 위치 관계가 틀어지면 상이 나빠질 수 있다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-047",
        "context": "렌즈를 닦기 전, 먼지가 끌려 흠집 나지 않게 먼저 쓸 도구는?",
        "explanation": "닦기 전에 블로어로 먼지를 충분히 불어내야 긁힘을 막을 수 있다.",
        "sourceNote": "수업 슬라이드 32"
      },
      {
        "id": "astronomy-048",
        "context": "오래 두면 잘 지워지지 않는 렌즈 얼룩의 원인은?",
        "explanation": "이슬 자국은 시간이 지나면 지우기 어려우므로 늦지 않게 청소한다.",
        "sourceNote": "수업 슬라이드 32"
      },
      {
        "id": "astronomy-049",
        "context": "먼지는 불어냈는데 얼룩이 남았다. 가볍게 닦을 때 쓰는 것은?",
        "explanation": "렌즈 전용 클리닝 페이퍼로 가볍게 닦는다.",
        "sourceNote": "수업 슬라이드 32"
      },
      {
        "id": "astronomy-050",
        "context": "차가운 렌즈를 바로 따뜻한 실내로 옮겼다. 문제가 되는 것은?",
        "explanation": "급격한 온도 변화는 렌즈 면을 흐리게 하고, 심하면 렌즈가 깨질 수도 있다.",
        "sourceNote": "수업 슬라이드 33"
      },
      {
        "id": "astronomy-051",
        "context": "밀폐해 보관하기 전, 곰팡이를 막으려면 없애야 할 것은?",
        "explanation": "습기는 곰팡이·변색·부식의 원인이다. 충분히 말린 뒤 보관한다.",
        "sourceNote": "수업 슬라이드 33"
      },
      {
        "id": "astronomy-052",
        "context": "흠집 없이 다시 조립해도 상이 나빠질 수 있어 금지하는 행동은?",
        "explanation": "렌즈 사이 위치가 조금만 틀어져도 상이 나빠지므로 함부로 분해하지 않는다.",
        "sourceNote": "수업 슬라이드 33"
      },
      {
        "id": "astronomy-053",
        "context": "분사형 에어 클리너가 렌즈를 깨뜨릴 수 있는 이유는?",
        "explanation": "분사형 에어 클리너는 렌즈 일부를 급히 식혀 온도 변화에 약한 렌즈를 손상시킬 수 있다.",
        "sourceNote": "수업 슬라이드 33"
      },
      {
        "id": "astronomy-054",
        "context": "비가 오면 회로가 젖지 않도록 철수하거나 덮어야 할 장치는?",
        "explanation": "가대가 젖으면 회로 단락이 생길 수 있으므로 철수하거나 방수천으로 덮는다.",
        "sourceNote": "수업 슬라이드 12"
      }
    ],
    "topicKeys": [
      "렌즈 관리",
      "보관",
      "장비 관리"
    ]
  },
  {
    "id": "astronomy-hwang-concept-6",
    "deckId": "astronomy-hwang",
    "title": "극축과 추적 원리",
    "summary": "극축 정렬은 적도의 가대의 적경축을 지구 자전축과 평행하게 만드는 일이다. 일주운동 보상과 초점 조절은 다른 문제다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "북반구 극축의 고도=관측지 위도",
          "수평 투영 방향은 북점",
          "목표는 천구 북극·북극성과 정확히 같지 않음",
          "적경축 회전으로 일주운동 보상",
          "북두칠성·카시오페이아로 북극성 찾기"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "위도 35°에서는 극축과 지평면의 각이 35°, 천정 방향과의 각은 55°다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "북극성을 시야 정중앙에 놓기만 하면 언제나 정밀 정렬이 된다고 생각하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-055",
        "context": "북극성도 작은 원을 그리며 돈다. 그 원의 중심은?",
        "explanation": "북극성은 천구 북극에서 조금 떨어져 있어, 천구 북극을 중심으로 작은 원을 그린다.",
        "sourceNote": "수업 슬라이드 35"
      },
      {
        "id": "astronomy-056",
        "context": "북두칠성 국자 끝 두 별을 이어 늘이면 찾을 수 있는 별은?",
        "explanation": "북두칠성 국자 끝의 두 별을 이어 연장하면 극축 정렬의 기준인 북극성을 찾을 수 있다.",
        "sourceNote": "수업 슬라이드 36"
      },
      {
        "id": "astronomy-057",
        "context": "북두칠성이 낮게 떠 보기 어렵다. 반대편의 W 모양 별자리는?",
        "explanation": "북극성을 사이에 두고 북두칠성 반대편에 있는 W 모양 카시오페이아자리로도 북극성을 찾는다.",
        "sourceNote": "수업 슬라이드 36"
      },
      {
        "id": "astronomy-058",
        "context": "위도 35°인 곳에서 극축이 지평면과 이루는 각은?",
        "explanation": "극축이 지평면과 이루는 각은 관측지 위도와 같다. 55°는 천정과 이루는 각이다. 숫자를 외우지 말고 주어진 위도를 적용한다.",
        "sourceNote": "수업 슬라이드 38"
      },
      {
        "id": "astronomy-059",
        "context": "지구 자전축과 나란히 놓고 일주운동을 따라 돌리는 축은?",
        "explanation": "적도의식 가대에서는 극축이 곧 적경축이다. 적위축·경통 광축과 구분한다.",
        "sourceNote": "수업 슬라이드 37"
      },
      {
        "id": "astronomy-060",
        "context": "극축 정렬은 적경축을 무엇과 평행하게 만드는 과정일까?",
        "explanation": "극축 정렬은 가대의 극축(적경축)을 지구 자전축과 평행하게 맞추는 과정이다.",
        "sourceNote": "수업 슬라이드 38"
      },
      {
        "id": "astronomy-061",
        "context": "다른 지역으로 옮겨 극축 기울기를 다시 맞춘다. 필요한 값은?",
        "explanation": "북반구에서 극축이 지평면과 이루는 기울기는 관측지 위도에 맞춘다.",
        "sourceNote": "수업 슬라이드 38"
      },
      {
        "id": "astronomy-062",
        "context": "극축 기울기를 위도에 맞췄다. 극축이 수평으로 향할 방향은?",
        "explanation": "북반구에서는 극축을 수평면에 투영한 방향이 정북을 향해야 한다.",
        "sourceNote": "수업 슬라이드 38"
      },
      {
        "id": "astronomy-063",
        "context": "극축 정렬에서 극축이 실제로 겨눠야 하는 점은?",
        "explanation": "극축은 천구 북극을 향해야 한다. 북극성은 이 점에서 조금 떨어져 있어 도입 위치를 보정한다.",
        "sourceNote": "수업 슬라이드 35"
      },
      {
        "id": "astronomy-064",
        "context": "배율을 높이자 천체가 시야를 금방 벗어난다. 계속 해야 할 동작은?",
        "explanation": "고배율일수록 시야가 좁아 겉보기 움직임이 크게 느껴진다. 추적으로 대상을 붙잡아 둔다.",
        "sourceNote": "수업 슬라이드 38"
      },
      {
        "id": "astronomy-065",
        "context": "초점은 맞는데 장노출 사진에서 별이 길게 늘어졌다. 점검할 기능은?",
        "explanation": "지구 자전에 따른 겉보기 운동을 따라가지 못하면 초점이 맞아도 장노출에서 별이 늘어진다.",
        "sourceNote": "수업 슬라이드 38"
      },
      {
        "id": "astronomy-066",
        "context": "행성을 시야 중앙에 두려면 극축을 중심으로 상쇄해야 할 운동은?",
        "explanation": "적경축을 돌려 지구 자전에 따른 천체의 일주운동을 상쇄한다.",
        "sourceNote": "수업 슬라이드 8"
      }
    ],
    "topicKeys": [
      "극축",
      "극축 적용",
      "북극성",
      "추적"
    ]
  },
  {
    "id": "astronomy-hwang-concept-7",
    "deckId": "astronomy-hwang",
    "title": "EM-200 정렬",
    "summary": "자료의 EM-200 절차는 경도 보정·수평·날짜와 시각 설정·북극성 도입 순서다. 레티클 눈금과 실제 가대 조작을 연결한다.",
    "sections": [
      {
        "heading": "핵심 개념",
        "points": [
          "극축 망원경 앞뒤 커버 열기",
          "적위축을 돌려 관측 통로 확보",
          "바깥 날짜·안쪽 시각 눈금",
          "접안부 회전으로 눈금 대응",
          "방위각·고도 미동으로 지정 위치에 북극성 도입",
          "연도에 따른 위치 보정"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "계산된 도입 위치에 맞추는 것은 경통 방향이 아니라 가대의 방위·고도 미동 조작이다."
        ]
      },
      {
        "heading": "헷갈리기 쉬운 점",
        "paragraphs": [
          "날짜와 시각 눈금을 뒤집거나 경도 보정·연도 보정을 생략하지 않는다."
        ]
      }
    ],
    "sourceNote": "기존 저장소의 해당 파트 수업자료 기반 문항·해설을 재구성",
    "examples": [
      {
        "id": "astronomy-067",
        "context": "극축망원경으로 빛이 지나가도록 앞뒤에서 열어야 할 것은?",
        "explanation": "극축망원경 앞뒤 커버를 모두 열어야 빛이 통과한다.",
        "sourceNote": "수업 슬라이드 43"
      },
      {
        "id": "astronomy-068",
        "context": "극축망원경 커버를 열었다. 안쪽 시야를 트이게 하려고 돌릴 축은?",
        "explanation": "적위 클램프를 풀고 적위축을 돌려 구멍 사이로 극축망원경 시야가 완전히 보이게 한다.",
        "sourceNote": "수업 슬라이드 43"
      },
      {
        "id": "astronomy-069",
        "context": "EM-200 극축망원경의 바깥 눈금에 맞추는 값은?",
        "explanation": "EM-200 레티클은 바깥 원이 날짜, 안쪽 원이 시각 눈금이다.",
        "sourceNote": "수업 슬라이드 43"
      },
      {
        "id": "astronomy-070",
        "context": "EM-200 극축망원경의 안쪽 눈금에 맞추는 값은?",
        "explanation": "안쪽 원은 시각 눈금이다. 바깥 원의 날짜 눈금과 짝지어 맞춘다.",
        "sourceNote": "수업 슬라이드 43"
      },
      {
        "id": "astronomy-071",
        "context": "EM-200에서 날짜·시각 눈금을 맞추기 전에 할 두 가지는?",
        "explanation": "순서는 경도 보정 → 수평 맞추기 → 날짜·시각 눈금 맞추기 → 북극성 도입이다.",
        "sourceNote": "수업 슬라이드 44"
      },
      {
        "id": "astronomy-072",
        "context": "EM-200에서 날짜·시각 눈금을 맞추려고 돌리는 부분은?",
        "explanation": "극축망원경 접안부를 돌려 날짜 눈금과 시각 눈금을 맞춘다.",
        "sourceNote": "수업 슬라이드 44"
      },
      {
        "id": "astronomy-073",
        "context": "레티클에서 도입 위치를 정했다. 북극성을 그 자리로 옮기는 나사는?",
        "explanation": "가대의 방위·고도 미동 나사로 북극성을 정해진 도입 위치에 넣는다.",
        "sourceNote": "수업 슬라이드 45"
      },
      {
        "id": "astronomy-074",
        "context": "날짜·시각이 같아도 해가 바뀌면 북극성 도입 위치를 보정한다. 이유는?",
        "explanation": "세차운동으로 천구 북극과 북극성의 위치 관계가 조금씩 바뀌므로 연도에 맞게 보정한다.",
        "sourceNote": "수업 슬라이드 45"
      },
      {
        "id": "astronomy-075",
        "context": "다른 별자리가 잘 안 보일 때, EM-200 정렬에 쓸 수 있는 별은?",
        "explanation": "EM-200은 극축망원경 시야에 북극성만 보여도 정렬할 수 있다.",
        "sourceNote": "수업 슬라이드 45"
      }
    ],
    "topicKeys": [
      "EM-200"
    ]
  },
  {
    "id": "english-concept-1",
    "deckId": "english",
    "title": "Chichén Itzá",
    "summary": "마야의 주요 도시가 종교·천문·도시 기능을 함께 수행했고, 복잡한 돌 건축을 바퀴와 금속 도구 없이 이루었다는 설명이다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "멕시코·마야 / A.D. 750~1200",
          "쿠쿨칸 신전 365개 계단·계절을 보이는 달력",
          "춘분·추분에 내려오는 뱀 그림자",
          "기초 위에 점점 작은 층을 쌓음",
          "인신 공양의 기록·유물과 행성 관측"
        ]
      },
      {
        "heading": "비교·어휘",
        "table": {
          "columns": [
            "표현",
            "의미·용법"
          ],
          "rows": [
            [
              "stepped pyramid",
              "계단식 피라미드"
            ],
            [
              "equinox",
              "춘분·추분"
            ],
            [
              "carved",
              "조각된"
            ],
            [
              "sacrifice",
              "공양·희생"
            ],
            [
              "astronomer",
              "천문학자"
            ],
            [
              "smaller and smaller",
              "점점 더 작은"
            ],
            [
              "both A and B",
              "A와 B 둘 다"
            ]
          ]
        }
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "달력이라는 비유는 365개 계단과 계절 현상을 연결한다. 종교 유적 설명 뒤에 공양 증거가 이어진다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "그림자 현상을 실제 뱀이 움직인 것으로 해석하지 않는다. 마야와 잉카를 구별한다."
        ]
      },
      {
        "heading": "첨부 학습지의 본문",
        "paragraphs": [
          "Chichén Itzá was a major city of the Maya Empire from A.D. 750 to 1200. Made of stepped pyramids, temples, and other stone structures, the ancient city is now one of Mexico’s most visited tourist destinations. The largest building in Chichén Itzá is the Temple of Kukulkan ―a pyramid with 365 steps. A kind of calendar, the temple shows the change of seasons. On the spring and autumn equinoxes each year, a shadow falls on the pyramid in the shape of a snake. As the sun sets, this shadowy snake goes down the steps to eventually join a carved snake head on the pyramid’s side. The Mayans constructed the pyramids with carved stone. Amazingly, they worked without wheels or metal tools. To build a pyramid, Mayan workers created a base and added smaller and smaller levels as the structure rose. Building the pyramids required many workers. Some pyramids took hundreds of years to complete. Chichén Itzá was both an advanced city center and a religious site. Spanish records show that the Mayans made human sacrifices to a rain god here. Archaeologists have found bones, jewelry, and other objects that people wore when they were sacrificed. Experts also know that the Mayans were knowledgeable astronomers. They used the tops of the pyramids to view Venus and other planets."
        ]
      }
    ],
    "sourceNote": "학습지1 · 1쪽 / 학습지1 변형문제 / 건축물 추가 변형",
    "topicKeys": [
      "Chichén Itzá"
    ]
  },
  {
    "id": "english-concept-2",
    "deckId": "english",
    "title": "Göbekli Tepe",
    "summary": "문자·금속·바퀴가 없는 시기에도 거석을 다룬 능력이 있었으며, 유적의 용도는 가설과 새 증거를 통해 논의되고 있다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "튀르키예 남동부·약 12,000년 전으로 추정",
          "고리 모양 석주·동물 조각",
          "Schmidt: 성스러운 모임 장소 가설",
          "동물 뼈와 큰 용기: 잔치의 가능성",
          "먼 지역의 유사 기둥: 중심지·주변지 관계 비유"
        ]
      },
      {
        "heading": "비교·어휘",
        "table": {
          "columns": [
            "표현",
            "의미·용법"
          ],
          "rows": [
            [
              "pillar",
              "기둥"
            ],
            [
              "arranged in rings",
              "고리 형태로 배열된"
            ],
            [
              "excavate",
              "발굴하다"
            ],
            [
              "feast",
              "잔치"
            ],
            [
              "represent",
              "나타내다·상징하다"
            ],
            [
              "cathedral",
              "대성당"
            ],
            [
              "be able to V",
              "~할 수 있다"
            ]
          ]
        }
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "전체 흐름은 유적 소개→건설 조건→기존 용도 가설→새 증거다. 대성당·지역 교회 비유는 실제 기독교 건물이란 뜻이 아니다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "believe·suggest·perhaps를 확정 사실로 바꾼 선지는 경계한다. 금속·문자가 있었다고 하면 본문과 반대다."
        ]
      },
      {
        "heading": "첨부 학습지의 본문",
        "paragraphs": [
          "Göbekli Tepe, in southeastern Türkiye, is one of the oldest man-made structures on Earth. Experts believe it was built about 12,000 years ago. The structure consists of dozens of stone pillars arranged in rings. Many pillars are covered with carvings of animals. The tallest pillars are 5.5 meters in height and weigh more than 14,500 kilograms. At the time that Göbekli Tepe was built, there was no writing system, and people did not use metal. Even wheels did not exist. Amazingly, though, the builders were able to cut, shape, and transport 16-ton stones. Archaeologists found Stone Age tools such as knives at the site. They think hundreds of workers carved and put the pillars in place. Archaeologists are still debating the purpose of Göbekli Tepe. Klaus Schmidt ― the archaeologist who originally excavated the site ― believed that Göbekli Tepe was a holy meeting place. According to his theory, the T-shaped pillars represent human beings. The pillars face the center of the circle and perhaps represent a religious ceremony. New evidence suggests that large feasts took place at the site. Archaeologists found thousands of small animal bones nearby, with stone containers large enough to hold more than 150 liters of liquid. They also found smaller pillars similar to Göbekli Tepe’s in areas over 200 kilometers away. It’s as though Göbekli Tepe were a cathedral and the other structures were local churches."
        ]
      }
    ],
    "sourceNote": "학습지1 · 2쪽 / 학습지1 변형문제 / 건축물 추가 변형",
    "topicKeys": [
      "Göbekli Tepe"
    ]
  },
  {
    "id": "english-concept-3",
    "deckId": "english",
    "title": "Machu Picchu",
    "summary": "잉카의 산악 도시를 통해 자연환경에 대응한 농업·물 공급·석조 공학을 설명한다. 일부 역사적 목적은 여전히 논쟁 중이다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "페루 안데스·잉카 / 1911년 현지인 안내로 Bingham이 세계에 소개",
          "1400년대 Pachacuti 시대 건설로 추정",
          "돌 계단식 밭→식량 / 수로·분수→물",
          "모르타르 없는 정교한 돌 맞춤→지진에 대한 내구성",
          "건설 목적·포기 이유는 논쟁"
        ]
      },
      {
        "heading": "비교·어휘",
        "table": {
          "columns": [
            "표현",
            "의미·용법"
          ],
          "rows": [
            [
              "remain hidden",
              "숨겨진 상태로 남다"
            ],
            [
              "abandoned",
              "버려진"
            ],
            [
              "terrace",
              "계단식 밭·테라스"
            ],
            [
              "mortar",
              "돌·벽돌을 잇는 모르타르"
            ],
            [
              "breathtaking",
              "숨이 멎을 듯한"
            ],
            [
              "survive",
              "견디다·살아남다"
            ],
            [
              "not only A but also B",
              "A뿐 아니라 B도"
            ]
          ]
        }
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "These features는 계단식 밭과 수로·분수를 받는다. 귀족·사제·숙련공이라는 주민 구성을 받는 것이 아니다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "현지인이 먼저 알고 안내했다는 부분을 빠뜨리지 않는다. 현재 논쟁 중인 이유를 확정하지 않는다."
        ]
      },
      {
        "heading": "첨부 학습지의 본문",
        "paragraphs": [
          "For hundreds of years, Machu Picchu remained hidden in the Andes Mountains of Peru. In 1911, an American explorer named Hiram Bingham introduced the ancient city to the world after local people guided him there. Today, millions of visitors travel to see its beautiful stone buildings and breathtaking mountain views. Although many facts about Machu Picchu are known, historians still debate why the city was built and why it was later abandoned. Most experts believe that Machu Picchu was built in the 1400s during the rule of the Inca emperor Pachacuti. The city was probably home to nobles, priests, and skilled workers rather than a large population. People grew crops on stone terraces that covered the mountainside. They also collected fresh water through a system of carefully planned canals and fountains. These features allowed people to live comfortably in a place that was difficult to reach. One of the most impressive features of Machu Picchu is its stonework. The Inca builders shaped huge stones so carefully that they fit together without mortar. This method made the buildings strong enough to survive many earthquakes. Even after hundreds of years of wind, rain, and earthquakes, much of the city still stands. Machu Picchu shows that the Inca people were not only skilled builders but also talented engineers who understood both nature and architecture."
        ]
      }
    ],
    "sourceNote": "학습지1 · 3쪽 / 학습지1 변형문제 / 건축물 추가 변형",
    "topicKeys": [
      "Machu Picchu"
    ]
  },
  {
    "id": "english-concept-4",
    "deckId": "english",
    "title": "고대 건축물 비교",
    "summary": "세 유적은 고대의 기술·협업 능력과 복합적인 사회적 기능을 보여 주지만, 장소·문명·근거는 다르다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "치첸이트사: 계절·종교·행성 관측",
          "괴베클리 테페: 거석 건설과 용도 논쟁",
          "마추픽추: 산악 생활과 돌 맞춤 공학",
          "여러 지문의 종합 제목은 세 지문의 공통 범위 포함"
        ]
      },
      {
        "heading": "비교·어휘",
        "table": {
          "columns": [
            "유적",
            "지역·문명",
            "핵심 기능·증거"
          ],
          "rows": [
            [
              "Chichén Itzá",
              "멕시코·마야",
              "365계단·그림자·종교·천문"
            ],
            [
              "Göbekli Tepe",
              "튀르키예·신석기 유적",
              "고리 석주·잔치 증거·가설"
            ],
            [
              "Machu Picchu",
              "페루·잉카",
              "계단식 밭·수로·석조 내구성"
            ]
          ]
        }
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "한 유적에만 적용되는 천문 달력이나 지진 저항을 모든 유적의 유일한 목적이라 일반화하면 안 된다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "추정과 확정, 규모, 기술의 유무를 바꾼 오답을 확인한다."
        ]
      }
    ],
    "sourceNote": "학습지1 전체 / 두 종류의 건축물 변형 자료",
    "topicKeys": [
      "고대 건축물 비교"
    ]
  },
  {
    "id": "english-concept-5",
    "deckId": "english",
    "title": "Bartleby: 배경과 인물",
    "summary": "변호사 화자가 월스트리트의 필경사들을 소개하고 Bartleby를 고용하는 도입이다. 인물 대조와 사무실의 벽이 이후 갈등의 배경이 된다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "scrivener: 법률 문서를 베끼는 사람",
          "Turkey: 오전 능숙 / 오후 무모·지저분",
          "Nippers: 오전 짜증 / 오후 침착·생산적",
          "Ginger Nut: 열두 살 심부름 소년",
          "Bartleby: 단정하지만 외롭고 쓸쓸함",
          "가림막: 업무 거리와 사적 공간의 균형"
        ]
      },
      {
        "heading": "비교·어휘",
        "table": {
          "columns": [
            "표현",
            "의미·용법"
          ],
          "rows": [
            [
              "scrivener",
              "필경사"
            ],
            [
              "reckless",
              "무모한"
            ],
            [
              "irritable",
              "짜증을 내는"
            ],
            [
              "forlorn",
              "외롭고 버려진 듯한"
            ],
            [
              "threshold",
              "문턱·입구"
            ],
            [
              "intact",
              "손상되지 않은"
            ],
            [
              "provided",
              "~라는 조건이면"
            ]
          ]
        }
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "Turkey 설명 뒤 on the other hand가 Nippers를 소개하면 뒤의 He는 Nippers다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "이야기 전체를 전지적 시점의 확정 사실로 읽지 않는다. 화자는 자신의 관찰과 감정에 따라 서술한다."
        ]
      },
      {
        "heading": "첨부 학습지의 본문",
        "paragraphs": [
          "I am an elderly man. For the past thirty years, my work as a lawyer has brought me into contact with a particular class of men: the law-copyists, or scriveners. I have known many of them, and could tell many stories that might make you smile or weep. But I’ll leave out the biographies of all other scriveners for a few passages from the life of Bartleby, who was the strangest I ever saw or heard of. At the time of this story, my office was located on Wall Street. On one side, my windows looked out upon the white wall of the interior of a spacious sky-light shaft. On the other side, my windows commanded an unobstructed view of a lofty brick wall, black by age and everlasting shade. This view was not exactly beautiful, but it was at least quiet. I already had two scriveners: Turkey and Nippers. Turkey was a short, fat Englishman who worked wonderfully in the morning, but after his lunch, his face would turn red, and he became energetic but reckless and messy with his ink. Nippers, on the other hand, was a victim of ambition and indigestion. He was nervous and irritable in the morning, but calm and productive in the afternoon. Between them, I had a functional office, provided it was the right time of day. There was also Ginger Nut, my twelve-year-old errand boy, whose most important duty was to buy apples and ginger nuts for the scriveners. But as my business grew, I needed more help. In answer to my advertisement, a young man appeared on my office threshold one morning. He was pallidly neat, pitiably respectable, and incurably forlorn. He was Bartleby. After a brief interview, I hired him. I gave him a seat at a desk near my own, separated by a high green screen. I wanted him to be close enough for me to hand him papers, but private enough to keep his quiet nature intact."
        ]
      }
    ],
    "sourceNote": "학습지2 · 1–2쪽 / Bartleby 변형문제",
    "topicKeys": [
      "Bartleby: 배경과 인물"
    ]
  },
  {
    "id": "english-concept-6",
    "deckId": "english",
    "title": "Bartleby: 거절과 갈등",
    "summary": "초기에 많은 필사를 하던 Bartleby의 조용하지만 단호한 거절이 확대되고 화자의 연민·권위·책임감이 충돌한다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "초기: 대량 필사·기계적 태도",
          "셋째 날: 검토 요청에 첫 거절",
          "업무 거절→필사 중단→벽 응시",
          "사무실 거주와 고립 발견",
          "prefer의 확산은 quiet plague 비유",
          "외부 압박 끝에 화자가 사무실 이전"
        ]
      },
      {
        "heading": "비교·어휘",
        "table": {
          "columns": [
            "표현",
            "의미·용법"
          ],
          "rows": [
            [
              "mechanically",
              "기계적으로"
            ],
            [
              "composure",
              "침착함"
            ],
            [
              "passive resistance",
              "수동적 저항"
            ],
            [
              "dread",
              "두려움"
            ],
            [
              "persuasion",
              "설득"
            ],
            [
              "plague",
              "전염병·골칫거리"
            ],
            [
              "fixture",
              "고정된 물건·붙박이"
            ]
          ]
        }
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "업무량과 즐거움은 다르다. 과거 반대 가정은 그가 즐겁게 일하지 않았음을 드러낸다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "수동적 저항을 폭력적 분노로 바꾸거나 화자가 즉시 해고했다고 하면 틀린다."
        ]
      },
      {
        "heading": "첨부 학습지의 본문",
        "paragraphs": [
          "At first, Bartleby did an extraordinary amount of writing. As if long famishing for something to copy, he eagerly copied my documents. He copied by sunlight and by candlelight. I would have been pleased with his hard work if he had worked cheerfully. But he wrote on silently, palely, mechanically. It was on the third day of his employment that the first crack appeared in this routine. I had a document that needed to be compared for accuracy. I called to Bartleby, asking him to step behind the screen to help me check a few lines. Without moving from his seat, Bartleby replied in a unusually gentle and firm voice: “I would prefer not to.” I sat in stunned silence. I thought my ears had deceived me. I repeated my request, but the response was exactly the same. “I would prefer not to.” I looked at him. He was perfectly calm. There was no sign of anger, impatience, or rudeness in his face. Had he seemed angry or rude, I would have fired him immediately. But his calmness fascinated and paralyzed me. I could not make myself argue with him. As days passed, the situation grew more bizarre. One morning, I asked him to go to the post office; he replied that he would prefer not to. I asked him to call the other clerks to help with a task; he preferred not to. Eventually, I discovered that he had stopped writing altogether. He would spend hours standing behind his screen, staring out the window at the dead brick wall. I tried to talk to him and persuade him. “Bartleby,” I said, “why will you not write? Why will you not do anything?” “I would prefer not to,” he replied, and nothing more.",
          "My emotions toward him were a strange mixture. Sometimes I felt a deep, melancholy pity. I realized that Bartleby was alone in the world — a lonely soul in the middle of the busy, commercial desert of Wall Street. I discovered that he never ate a full dinner; he lived almost entirely on ginger nuts. Even more shockingly, I found out one Sunday morning that he was actually living in the office. He slept on the sofa, washed his face in a small basin, and spent his weekends in the total silence of the empty business district. However, pity soon turned to a sense of dread. His presence began to affect the atmosphere of the office. I found myself, and even Turkey and Nippers, unconsciously using the word ‘prefer’ in our daily speech. His passive resistance was like a quiet plague. I felt that my authority was slowly fading before a man who did nothing, said nothing, and wanted nothing. When I finally told him he must leave, he simply preferred not to. I offered him money; he let it lie on the table. I realized that as long as he remained in my office, he was my responsibility. But the pressure from my professional friends and clients became too much. They wondered why I kept such a ‘useless fixture’ in my office. Desperate to be rid of him, and unable to throw this pale, helpless man into the street, I decided on an extreme measure: I moved my entire office to a new location, leaving Bartleby behind in the empty rooms. But the story did not end there. A few days later, the new tenant of my old office came to me in a state of great excitement. Bartleby was still there. He sat on the stairs by day and slept in the entry hall by night. Everyone was disturbed. To avoid a public scandal, I went back and tried to talk to him one last time. “Bartleby,\" I said, “would you like to work as a store clerk?” “I would prefer not to. I am not particular,” he said. “Would you like a job traveling with someone through Europe?” “Not at all. I would prefer not to.”"
        ]
      }
    ],
    "sourceNote": "학습지3 · 1–2쪽 / Bartleby 변형문제",
    "topicKeys": [
      "Bartleby: 거절과 갈등"
    ]
  },
  {
    "id": "english-concept-7",
    "deckId": "english",
    "title": "Bartleby: 결말과 상징",
    "summary": "새 임차인의 신고로 감옥에 간 Bartleby는 식사를 거부하고 죽는다. 화자는 배달 불능 우편물 취급소 경력의 소문을 듣고 그의 고립을 이해하려 한다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "Tombs에서 다시 벽 응시",
          "요리사에게 화자가 돈을 주지만 식사 거부",
          "Dead Letter Office: 도달하지 못하는 편지",
          "벽: 고립·소통 단절 / 편지: 실패한 희망",
          "I heard a rumor: 소문으로 전해진 정보",
          "마지막 탄식은 개인에서 인간 전체로 시선 확대"
        ]
      },
      {
        "heading": "비교·어휘",
        "table": {
          "columns": [
            "표현",
            "의미·용법"
          ],
          "rows": [
            [
              "subordinate clerk",
              "하급 직원"
            ],
            [
              "destination",
              "목적지"
            ],
            [
              "destined for",
              "~할 운명인"
            ],
            [
              "reverie",
              "몽상"
            ],
            [
              "vacant",
              "텅 빈·멍한"
            ],
            [
              "humanity",
              "인류·인간성"
            ]
          ]
        }
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "배달 불능 편지의 설명 뒤 this를 해석할 때 감옥에서 죽은 사건이 아니라 앞선 경력 소문을 찾는다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "소문을 화자가 직접 증명한 사실로 바꾸지 않는다. 상징은 본문에서 가능한 해석으로 제시한다."
        ]
      },
      {
        "heading": "첨부 학습지의 본문",
        "paragraphs": [
          "I gave up. The new tenants eventually called the police, and Bartleby was taken to the Tombs as a homeless person. When I visited him in prison, he was standing alone in a quiet courtyard, staring at a high wall. “I know where I am,” he said to me, refusing to look at me. “I have nothing to say to you.” I spoke to the prison cook, paying him to ensure Bartleby had good food. But when the cook offered him dinner, Bartleby turned his face toward the wall and said, \"I prefer not to eat today.\" He had decided to stop eating. A few days later, I found him lying in the yard, his head resting against the stones, his eyes open but vacant. He was dead. Some months later, I heard a rumor that before coming to me, Bartleby had been a subordinate clerk in the Dead Letter Office at Washington. He had spent years sorting letters that were sent to people who were already dead, or letters that contained rings and money that would never reach their destination. These letters, intended for life, were destined for the flames. When I heard this, I could finally understand his silence and his ‘dead-wall reveries.’ Surrounded by the failed hopes and dead messages of humanity, his soul had simply given up. He had seen too much of the end of things. Ah, Bartleby! Ah, humanity!"
        ]
      }
    ],
    "sourceNote": "학습지3 · 3쪽 / Bartleby 변형문제",
    "topicKeys": [
      "Bartleby: 결말과 상징"
    ]
  },
  {
    "id": "english-concept-8",
    "deckId": "english",
    "title": "가정법과 시제",
    "summary": "가정법의 동사 형태는 실제 시간과 일치하지 않을 수 있다. 현재 반대 가정·과거 반대 가정·실제 대과거를 의미와 주절까지 보고 구분한다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "현재 반대: If S 과거형, S would/could/might V",
          "과거 반대: If S had p.p., S would/could/might have p.p.",
          "if 생략 도치: Were/Had/Should를 주어 앞으로",
          "wish 과거형: 현재 아쉬움 / wish had p.p.: 과거 후회",
          "as if 과거·과거완료는 비현실 비교의 시점에 따라 선택",
          "had p.p. 형태만으로 가정법 단정 금지"
        ]
      },
      {
        "heading": "비교·어휘",
        "table": {
          "columns": [
            "상황",
            "형태",
            "실제 의미"
          ],
          "rows": [
            [
              "현재 반대",
              "If I were rich, I would travel.",
              "지금 부자가 아니다"
            ],
            [
              "과거 반대",
              "If I had left, I would have arrived.",
              "그때 떠나지 않았다"
            ],
            [
              "대과거 사실",
              "I learned that he had left.",
              "알기 전에 실제 떠났다"
            ],
            [
              "과거 반대 도치",
              "Had I left, I would have arrived.",
              "If I had left와 동일"
            ]
          ]
        }
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "Had he seemed rude는 If he had seemed rude다. had stopped writing은 실제로 더 먼저 필사를 중단한 사건이다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "가정법 과거의 과거형을 무조건 과거 시간으로 번역하지 않는다. 주절 have와 수동태 been을 빠뜨리지 않는다."
        ]
      }
    ],
    "sourceNote": "학습지3 · 1·4쪽 / Bartleby 변형문제",
    "topicKeys": [
      "가정법과 시제"
    ]
  },
  {
    "id": "english-concept-9",
    "deckId": "english",
    "title": "예술과 모방",
    "summary": "현실 모방이라는 그리스의 예술 정의를 소개한 뒤 Pollock의 비모방 예술로 그 정의의 한계를 논증한다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "그리스: 시각적 경험을 복제·사실성",
          "회화는 남아 있지 않아 이야기·조각·도기 그림으로 수준 추정",
          "though: 기존 관점에서 반례로 전환",
          "Pollock: 인식 가능한 사물을 의도적으로 닮지 않게 함",
          "결론: 단순 모방은 예술을 충분히 정의하지 못함"
        ]
      },
      {
        "heading": "비교·어휘",
        "table": {
          "columns": [
            "표현",
            "의미·용법"
          ],
          "rows": [
            [
              "mimesis",
              "모방"
            ],
            [
              "realism",
              "사실성·사실주의"
            ],
            [
              "surmise",
              "짐작하다"
            ],
            [
              "resemble",
              "닮다"
            ],
            [
              "recognizable",
              "알아볼 수 있는"
            ],
            [
              "intentionally",
              "의도적으로"
            ],
            [
              "note",
              "여기서는 주목·언급하다"
            ]
          ]
        }
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "Pollock의 사례는 예술 전체가 모방이라는 일반 정의에 대한 반례다. 모방 예술 자체의 가치를 전부 부정한 것은 아니다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "does not sufficiently define를 예술은 절대 모방할 수 없다는 주장으로 확대하지 않는다."
        ]
      },
      {
        "heading": "첨부 학습지의 본문",
        "paragraphs": [
          "The ancient Greeks felt that the visual artist’s goal was to copy visual experience. This approach appears in the realism of ancient Greek sculpture and pottery. We must sadly note that, due to the action of time and weather, no paintings from ancient Greek artists exist today. We can only surmise their quality based on tales such as that of Zeuxis and Parhassios, the obvious skill in ancient Greek sculpture, and in drawings that survive on ancient Greek pottery. This definition of art as copying reality has a problem, though. Jackson Pollock, a leader in the New York School of the 1950’s, intentionally did not copy existing objects in his art. While painting these works, Pollock and his fellow artists would consciously avoid making marks or passages that resembled recognizable objects. They succeeded at making artwork that did not copy anything, thus demonstrating that the ancient Greek view of art as mimesis ― simple copying ― does not sufficiently define art. "
        ]
      }
    ],
    "sourceNote": "학습지4 · 1쪽 / 학습지4 변형문제",
    "topicKeys": [
      "예술과 모방"
    ]
  },
  {
    "id": "english-concept-10",
    "deckId": "english",
    "title": "측정의 일관성",
    "summary": "개인 경험에 의존하는 측정의 공유 한계를 넘어, 공동체와 교역이 커질수록 공유된 안정적 단위 정의가 필요하다는 설명이다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "주관적 척도: 유용하지만 공유가 어려움",
          "Porter: 공유 규칙이 문화·지리 차이를 연결",
          "측정=언어 비유: 합의된 정의가 있어야 소통",
          "작은 정착지: 신체 부위 기준도 가능",
          "규모 확대·교역 분쟁: 체계의 부족함·더 큰 일관성 필요"
        ]
      },
      {
        "heading": "비교·어휘",
        "table": {
          "columns": [
            "표현",
            "의미·용법"
          ],
          "rows": [
            [
              "consistency",
              "일관성"
            ],
            [
              "subjective",
              "주관적인"
            ],
            [
              "reliable",
              "믿을 만한"
            ],
            [
              "settlement",
              "정착지"
            ],
            [
              "inadequacy",
              "부족함"
            ],
            [
              "tribute",
              "조공"
            ],
            [
              "bridge differences",
              "차이를 잇다"
            ]
          ]
        }
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "these communities는 앞선 정착 공동체, this system은 신체 기준 측정 체계를 받으므로 관련 문장 뒤에 확대·한계 문장이 온다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "주관적 측정에 아무 지식도 없다고 하지 않는다. 거리의 기술을 오직 길이 측정으로 읽지 않는다."
        ]
      },
      {
        "heading": "학습지 본문 · 삽입 문장을 알맞은 위치에 연결",
        "paragraphs": [
          "To harness the full potential of units of measurement, we need some degree of consistency. Subjective measures contain useful knowledge, but this can be difficult to share, based as it is on an individual’s experience. The historian of science Theodore M. Porter describes measurement as a ʻtechnology of distance’: a tool that uses shared rules to bridge differences of culture and geography, allowing for the exchange of information. Following this logic, if measurement is another sort of language, then just as with words, individual units need reliable definitions in order to communicate. In the earliest societies, these definitions might need to be shared no more widely than a single settlement, meaning that the definition can be no more complex than knowing that a unit was equal to a certain body part. As these communities grew in size, though, the inadequacies of this system would become evident. Imagine a disagreement over trade or tribute: it is a moment of conflict that demands greater consistency in measurement."
        ]
      }
    ],
    "sourceNote": "학습지4 · 2쪽 / 학습지4 변형문제",
    "topicKeys": [
      "측정의 일관성"
    ]
  },
  {
    "id": "english-concept-11",
    "deckId": "english",
    "title": "공통 문법·독해",
    "summary": "본문의 내용 흐름과 문장 구조를 함께 읽으면 순서·삽입·어법·서술형 조건을 안정적으로 판단할 수 있다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "분사 후치 수식: 명사+arranged·carved 등",
          "분사구문 복원: 시제·태·주어 관계 확인",
          "독립분사구문: 주절과 다른 의미상 주어 남김",
          "that 접속사 뒤 완전절 / 관계대명사 뒤 필요한 성분이 빠진 절",
          "allow O to V / 능동 사역 make O V",
          "avoid+동명사 / 형용사 enough to V",
          "순서·삽입은 지시어·대조·새 증거의 연결 확인"
        ]
      },
      {
        "heading": "비교·어휘",
        "table": {
          "columns": [
            "표현",
            "의미·용법"
          ],
          "rows": [
            [
              "skilled → skill",
              "형용사에서 명사"
            ],
            [
              "astronomer → astronomical",
              "명사에서 형용사"
            ],
            [
              "excavate → excavation",
              "동사에서 명사"
            ],
            [
              "represent → representation",
              "동사에서 명사"
            ],
            [
              "mechanically → mechanical",
              "부사에서 형용사"
            ],
            [
              "persuade → persuasion",
              "동사에서 명사"
            ],
            [
              "useful → usefulness",
              "형용사에서 명사"
            ],
            [
              "difficult → difficulty",
              "형용사에서 명사"
            ]
          ]
        }
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "objects that people wore에서 wore의 목적어가 빠져 that은 관계대명사다. records show that people worked에서는 뒤 절이 완전하여 접속사다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "철자가 같은 -ed와 -ing도 역할이 다르다. 긴 선지의 익숙한 단어보다 주장 강도와 근거를 확인한다."
        ]
      }
    ],
    "sourceNote": "영어 학습지1–4와 제공된 모든 변형 자료",
    "topicKeys": [
      "공통 문법·독해"
    ]
  },
  {
    "id": "korean-concept-1",
    "deckId": "korean",
    "title": "비문학 독해의 기본",
    "summary": "수업 지문이 아직 제공되지 않아 특정 시험 범위가 아닌 공통 독해 원리를 정리한다. 주장·근거·개념 관계를 구분하여 읽는 것이 출발점이다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "중심 화제: 무엇에 대한 글인가",
          "핵심 주장: 무엇을 말하려는가",
          "근거: 주장에 왜 동의해야 하는가",
          "대조·인과·예시·정의의 문단 기능",
          "지시어는 앞뒤에서 구체적 대상 찾기"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "환경 보호를 주장하고 재활용의 사례를 든다면 재활용 사례와 글 전체의 주장 범위를 구별한다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "본문이 제시하지 않은 상식을 근거로 정답을 고르지 않는다."
        ]
      }
    ],
    "sourceNote": "공통 독해 기초 · 국어 수업자료 미제공",
    "topicKeys": [
      "비문학 독해의 기본"
    ]
  },
  {
    "id": "korean-concept-2",
    "deckId": "korean",
    "title": "문학의 인물·시점·표현",
    "summary": "문학 해석은 작품의 표현과 서술 단서를 근거로 한다. 화자·서술자와 실제 작가를 구별하고 인물의 말과 행동을 함께 읽는다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "화자·서술자: 작품 안에서 말하는 존재",
          "인물의 성격은 말·행동·상황·다른 인물의 평가로 추론",
          "갈등은 대립하는 욕구·가치·상황에서 발생",
          "비유·반복·대조의 효과는 맥락과 연결",
          "상징은 작품 안의 반복·연결을 근거로 해석"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "인물이 침묵한다고 항상 동의한 것은 아니다. 그 장면의 갈등과 행동을 함께 살펴야 한다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "작가의 실제 삶을 작품의 화자와 동일시하지 않는다."
        ]
      }
    ],
    "sourceNote": "공통 문학 기초 · 국어 수업자료 미제공",
    "topicKeys": [
      "문학의 인물·시점·표현"
    ]
  },
  {
    "id": "korean-concept-3",
    "deckId": "korean",
    "title": "서술형 답안 작성",
    "summary": "답안은 문제의 요구와 본문 근거를 정확하게 연결한다. 조건·핵심어·인과 관계를 충족하는 짧고 완전한 문장으로 쓴다.",
    "sections": [
      {
        "heading": "핵심 정리",
        "points": [
          "무엇을 묻는지 먼저 확인",
          "두 근거를 요구하면 둘 다 포함",
          "비교는 공통 기준으로 차이 설명",
          "이유는 사실 나열보다 원인→결과 연결",
          "지정 어미·분량·표현 조건 점검"
        ]
      },
      {
        "heading": "적용 예",
        "paragraphs": [
          "비교 문제는 A는 ~인 반면 B는 ~이다처럼 동일한 비교 기준을 드러낸다."
        ]
      },
      {
        "heading": "시험에서 주의할 점",
        "paragraphs": [
          "핵심어만 나열하고 왜 그 답인지 설명하지 않는 답안을 피한다."
        ]
      }
    ],
    "sourceNote": "공통 답안 작성 기초 · 국어 수업자료 미제공",
    "topicKeys": [
      "서술형 답안 작성"
    ]
  }
];
export const conceptsFor = (deckId: string) => studyConcepts.filter(lesson => lesson.deckId === deckId);
