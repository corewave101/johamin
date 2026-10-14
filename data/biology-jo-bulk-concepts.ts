import type { ConceptLesson } from './study-concepts';
import { biologyJoBulkCards, biologyJoBulkEditions } from './biology-jo-bulk-cards';

// 생물(조용민T) · 뭉탱이: 에디션마다 개념 정리 한 단원. 예시는 그 에디션의 객관식 카드 전부다.
const examplesFor = (topic: string) => biologyJoBulkCards
  .filter(card => card.topic === topic)
  .map(card => ({ id: card.id, context: card.question, explanation: card.explanation, sourceNote: `조용민T · 유전자의 발현 PPT · ${card.source?.page}쪽` }));

const lessonOf = (key: string, summary: string, sections: ConceptLesson['sections'], resources?: ConceptLesson['resources']): ConceptLesson => {
  const edition = biologyJoBulkEditions.find(e => e.key === key);
  if (!edition) throw new Error(`No edition ${key}`);
  return {
    id: `biology-jo-bulk-concept-${key}`, deckId: 'biology-jo-bulk', title: `${edition.name} · ${edition.pages[0]}~${edition.pages[1]}쪽`, summary, sections,
    topicKeys: [edition.name], sourceNote: `조용민T 유전자의 발현 PPT · ${edition.pages[0]}~${edition.pages[1]}쪽`,
    examplesLabel: '이 에디션의 문제', examples: examplesFor(edition.name), ...(resources ? { resources } : {}),
  };
};

export const biologyJoBulkConcepts: ConceptLesson[] = [
  lessonOf('tx', 'DNA의 정보는 RNA 중합효소가 프로모터에 결합해 개시 → 신장 → 종결 순으로 RNA에 옮긴다. 원핵은 σ 인자가 -35·-10 지역을 인식하고, 진핵은 RNA 중합효소 세 종류와 BRE·TATA·Inr·DPE 프로모터를 쓰며, mRNA는 전사 중 5′ 캡·스플라이싱·poly-A 꼬리로 가공된다.', [
    { heading: '중심원리와 RNA 종류', points: [
      '복제: DNA → DNA · 전사: DNA → RNA · 번역: RNA → 단백질 · 역전사: RNA → DNA',
      'mRNA(coding RNA): 아미노산 서열 정보 · rRNA: 리보솜, 번역에 직접 관여 · tRNA: 아미노산 운반',
      'snRNA(작은 핵 RNA): 스플라이싱 · snoRNA(작은 핵인 RNA): pre-rRNA 가공',
      'RNAi: miRNA(마이크로 RNA, 유전자 발현 조절)와 siRNA(소형 간섭 RNA, 침입 DNA 제거)',
    ] },
    { heading: '원핵세포의 전사', table: { columns: ['구분', '내용'], rows: [
      ['RNA 중합효소', '핵심 효소(α₂ββ′ω) + σ 인자 = 완전 효소. σ는 전사 시작 때만 필요하고 약 10개 뉴클레오타이드 합성 후 떨어진다'],
      ['프로모터', 'RNA 중합효소가 결합하는 DNA 부위. -35 지역(TTGACA)을 σ가 인식 → 완전효소 결합, -10 지역(TATAAT, 프립노브 상자)에서 dsDNA가 풀림'],
      ['위치 번호', '+1 = 전사 시작 지점, 0은 없다. 음수 쪽은 상류, 양수 쪽은 하류. 상위 요소(-60~-40)는 AT가 풍부'],
      ['개시 순서', '비특이적 결합 → 닫힌-프로모터 복합체 → 열린-프로모터 복합체 → 전사 개시 → σ 방출 → RNA 사슬 신장'],
    ] } },
    { heading: '진핵세포의 RNA 중합효소', table: { columns: ['효소', '위치', '산물', '액티노마이신 D', 'α-아마니틴'], rows: [
      ['RNA pol. Ⅰ', '인', 'rRNA(28S, 18S, 5.8S)', '매우 저해', '없음'],
      ['RNA pol. Ⅱ', '핵질', 'mRNA, 대부분의 miRNA·snRNA, snoRNA', '약간 저해', '매우 저해'],
      ['RNA pol. Ⅲ', '핵질', '5S rRNA, tRNA, 일부 snRNA', '약간 저해', '약간 저해'],
    ] }, paragraphs: ['원핵 70S = 50S(5S·23S) + 30S(16S), 진핵 80S = 60S(5S·5.8S·28S) + 40S(18S).'] },
    { heading: '진핵세포의 프로모터', table: { columns: ['요소', '위치', '특징'], rows: [
      ['BRE', '약 -37 ~ -32', 'TFⅡB 인식 서열'],
      ['TATA 상자', '약 -31 ~ -26', 'TATAAA, 원핵 프립노브 상자와 유사'],
      ['Inr', '-2 ~ +4', '개시자, +1(A) 포함. Py = 피리미딘(C·T), N = 아무 염기'],
      ['DPE', '+28 ~ +32', '하위 프로모터 요소'],
    ] }, paragraphs: ['일반(보편) 전사 인자는 어떤 유전자를 전사하든 필요하고, 특수 전사 인자는 조합에 따라 세포마다 다른 유전자를 발현시킨다.'] },
    { heading: 'mRNA 가공(진핵, RNA pol. Ⅱ)', points: [
      '5′ 캡: 전사 직후 5′ 말단에 7-메틸구아노신(5′–5′ 삼인산 다리). 분해 억제·세포질 수송·번역 개시 보조',
      '스플라이싱: snRNP(snRNA + 단백질)가 모인 스플라이시오솜(U1·U2·U4·U5·U6)이 전사 중에 인트론(5′ GU … AG 3′)을 올가미 모양으로 잘라 내고 엑손을 잇는다. 인트론은 핵에서 분해',
      '종결: AAUAAA 뒤 약 10~35 뉴클레오타이드에서 절단(가수분해) → PAP가 A를 약 250개까지 첨가. 남은 하류 RNA는 5′ 캡이 없어 분해',
      '성숙 mRNA: 5′ 캡 – 5′ UTR – 암호화 영역 – 3′ UTR – poly-A 꼬리. UTR(비번역 부위)은 번역 과정·조절에 관여',
    ] },
  ], [
    { title: 'From DNA to RNA (Molecular Biology of the Cell)', url: 'https://www.ncbi.nlm.nih.gov/books/NBK26887/', publisher: 'NCBI Bookshelf', note: '전사·프로모터·RNA 가공을 영어 교과서로 더 볼 수 있어요. 시험 기준은 조용민T PPT예요.' },
  ]),
  lessonOf('tl', '유전 암호는 대부분 생물이 함께 쓰고, 아미노아실-tRNA 합성효소가 ATP로 아미노산을 tRNA에 붙인다. 동요 가설 덕분에 tRNA 약 45개로 코돈 61개를 읽으며, 리보솜은 SD 서열로 mRNA를 찾아 개시·신장·종결을 거쳐 N → C 방향으로 폴리펩타이드를 만든다.', [
    { heading: '유전 암호와 tRNA', points: [
      '코돈 64개 = 아미노산 지정 61개 + 종결 코돈 3개(UAA·UAG·UGA). AUG는 Met이자 개시 코돈',
      '유전 암호의 보편성: 다른 생물 세포에서도 같은 단백질 합성(생명공학), 바이러스가 숙주 세포에서 증식',
      'tRNA: 한 가닥이 접혀 염기쌍을 이룬 2차 구조, 3′ 말단 CCA에 아미노산 부착, 안티코돈이 코돈과 상보적으로 결합',
      '아미노아실-tRNA 합성효소: 특정 아미노산만 결합 → 20종류. 아미노산 + ATP → 아미노아실 AMP → 아미노아실 tRNA',
    ] },
    { heading: '동요(wobble) 가설', table: { columns: ['안티코돈 첫 번째 염기', '코돈 세 번째 염기'], rows: [
      ['U', 'A, G'], ['G', 'U, C'], ['I(이노신)', 'U, C, A'],
    ] }, paragraphs: ['코돈 첫째·둘째 염기는 매우 엄격하게, 셋째 염기는 유연하게 수소 결합한다. 그래서 tRNA 약 45개로 코돈 61개를 모두 읽는다.'] },
    { heading: '리보솜과 번역 과정(원핵)', table: { columns: ['단계', '필요한 것', '일어나는 일'], rows: [
      ['개시', '개시 인자(IFs), GTP', '작은 소단위(30S)의 16S rRNA가 SD 서열(AGGAGG)을 인식 → 개시 tRNA(fMet, 안티코돈 UAC)가 P 자리 → 큰 소단위 결합'],
      ['신장', '신장 인자(EFs), GTP', '코돈 인식(A 자리) → 23S rRNA가 펩타이드 결합 촉매 → 한 코돈 이동(A → P → E)'],
      ['종결', '방출 인자(RF), GTP 2분자', '종결 코돈이 A 자리 → 방출 인자가 아미노산 대신 물 첨가 → 폴리펩타이드 방출, 소단위 분리'],
    ] }, paragraphs: ['P 자리 = 펩티딜 tRNA 결합자리, A 자리 = 아미노아실 tRNA 결합자리, E 자리 = 출구자리. 폴리펩타이드는 N-말단에서 C-말단으로만 합성된다.'] },
    { heading: '폴리솜과 동시 진행', points: [
      '폴리리보솜: 한 mRNA를 여러 리보솜이 동시에 번역해 단백질 합성 효율 증가(원핵·진핵 모두). 3′ 쪽 리보솜일수록 사슬이 길다',
      '원핵: 전사·번역 모두 세포질 → 동시 진행 가능. 진핵: 전사는 핵, 번역은 세포질',
      'mRNA 합성과 번역 모두 5′ → 3′. 가장 먼저 결합한 RNA 중합효소가 가장 긴 mRNA를, RNA 중합효소에 가장 가까운 리보솜이 가장 먼저 번역을 시작했다',
    ] },
  ], [
    { title: 'From RNA to Protein (Molecular Biology of the Cell)', url: 'https://www.ncbi.nlm.nih.gov/books/NBK26829/', publisher: 'NCBI Bookshelf', note: '유전 암호·tRNA·리보솜·번역 단계를 영어 교과서로 더 볼 수 있어요. 시험 기준은 조용민T PPT예요.' },
  ]),
  lessonOf('fig', 'PPT 그림 11장에서 답이 되는 이름표를 (가)(나)…로 가린 그림 문제만 모은 단원이다. 그림 속 위치(상류·하류, 왼쪽·오른쪽, 5′·3′ 끝)와 가려진 이름표의 역할을 함께 떠올리는 연습을 한다. 그림 카드는 가로 화면에서 오른쪽 그림 칸에 나온다.', [
    { heading: '전사 쪽 그림', table: { columns: ['그림', '쪽', '가려진 이름표'], rows: [
      ['원핵 RNA 중합효소', '6', '(가) σ 인자'],
      ['원핵 프로모터', '7', '(가) -35 서열 TTGACA · (나) -10 서열 TATAAT'],
      ['리보솜 rRNA 갈래', '10', '(가) 23S rRNA · (나) 18S rRNA'],
      ['진핵 프로모터', '11', '(가) BRE · (나) TATA 상자 · (다) Inr · (라) DPE'],
      ['성숙 mRNA', '12', '(가) 5′ UTR · (나) 3′ UTR'],
      ['poly-A 꼬리 첨가', '14', '(가) AAUAAA · (나) GU-rich'],
    ] } },
    { heading: '번역 쪽 그림', table: { columns: ['그림', '쪽', '가려진 이름표'], rows: [
      ['tRNA 2차 구조', '16', '(가) 아미노산 부착자리 · (나) 안티코돈'],
      ['리보솜 단면', '19', '(가) E 자리 · (나) P 자리 · (다) A 자리'],
      ['SD 서열', '20', '(가) SD 서열 AGGAGG · (나) anti-SD 서열 UCCUCC(16S rRNA)'],
      ['폴리리보솜', '24', '(가)~(라) 리보솜: 3′ 쪽 (라)가 가장 먼저 시작'],
      ['전사·번역 동시 진행', '25', '(가)~(라) RNA 중합효소: 전사 방향 끝의 (라)가 가장 먼저 결합'],
    ] } },
    { heading: '그림 문제 푸는 법', points: [
      '위치 번호부터 본다: 음수(-)는 상류, 양수(+)는 하류, +1이 전사 시작점이다',
      '방향을 본다: 리보솜은 mRNA 5′ → 3′로, RNA 중합효소는 전사 방향 쪽으로 간다. 멀리 간 것일수록 먼저 시작했다',
      '가려진 이름표의 이름과 역할을 함께 떠올린다: 이름을 묻기도 하고, 그 자리에서 일어나는 일을 묻기도 한다',
    ] },
  ]),
];
