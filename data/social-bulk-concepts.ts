import type { ConceptLesson } from './study-concepts';
import { socialBulkCards, socialBulkEditions } from './social-bulk-cards';

// 사회(성신제T) · 뭉탱이: 에디션(학습지)마다 개념 정리 한 단원. 예시는 그 에디션의 객관식 카드 전부다.
const examplesFor = (topic: string) => socialBulkCards
  .filter(card => card.topic === topic)
  .map(card => ({ id: card.id, context: card.question, explanation: card.explanation, sourceNote: `성신제T · ${card.source?.label} · ${card.source?.page}쪽` }));

const lessonOf = (key: string, summary: string, sections: ConceptLesson['sections'], resources?: ConceptLesson['resources']): ConceptLesson => {
  const edition = socialBulkEditions.find(e => e.key === key);
  if (!edition) throw new Error(`No edition ${key}`);
  return {
    id: `social-bulk-concept-${key}`, deckId: 'social-bulk', title: `${edition.name} · ${edition.source.label}`, summary, sections,
    topicKeys: [edition.name], sourceNote: `성신제T 학습지 ${key} · ${edition.source.label}`,
    examplesLabel: '이 에디션의 문제', examples: examplesFor(edition.name), ...(resources ? { resources } : {}),
  };
};

export const socialBulkConcepts: ConceptLesson[] = [
  lessonOf('21', '세계화는 국경을 넘는 교류로 세계가 하나로 통합되어 가는 현상이고, 지역화는 지역의 고유한 특성이 세계적 가치를 지니는 현상이다. 지역은 지리적 표시제·장소 마케팅·지역 브랜드화로, 기업은 현지화·글로컬라이제이션으로 대응한다.', [
    { heading: '세계화', table: { columns: ['구분', '내용'], rows: [
      ['의미', '국경을 넘어 물자·사람·정보의 교류가 활발해지며 세계가 하나로 통합되어 가는 현상'],
      ['배경', '교통·통신 발달(시간·공간적 거리 단축) / WTO 출범(자유 무역 확대) / 다국적 기업 영향력 증대'],
      ['특징', '지역 간 정치·경제·사회·문화가 밀접히 연계 / 상호 의존성 증가 / 경쟁 치열 + 협력·분업 활발'],
    ] } },
    { heading: '교통·통신 발달로 인한 변화 (활동 1)', points: [
      '국경의 의미: 약화 · 지역성: 약화 · 물리적 거리의 영향력: 축소',
      '국가 간 상호 의존성: 강화 · 인구와 물자의 이동: 증가 · 문화 확산 속도: 빠름',
    ] },
    { heading: '지역화와 지역화 전략', table: { columns: ['전략', '뜻', '예'], rows: [
      ['지리적 표시제', '지리적 특성(기후·지형·토양)을 반영한 우수 상품에 생산지 표시를 인정', '보성 녹차(국내 1호), 영덕 대게, 횡성 한우, 샴페인, 다르질링 차, 플로리다 오렌지'],
      ['장소 마케팅', '장소를 상품으로 보고 이미지·시설(랜드마크)을 개발해 장소 가치 상승', '두바이(사막·초고층 빌딩), 리버풀(비틀즈)'],
      ['지역 브랜드화', '상품·서비스·축제를 브랜드로 인식시켜 지역 이미지 향상', '「I♥NY」, 「Seoul, my soul」, 「Busan is Good」, 평창 「HAPPY 700」'],
    ] }, paragraphs: ['지역화의 배경은 지역 경쟁력 강화와 고유문화의 계승·발전이다. 과제는 지역의 고유한 전통에 세계의 보편적 가치를 접목하는 것이다.'] },
    { heading: '지도 자료 (자료 1~3)', table: { columns: ['자료', '나라 · 대상'], rows: [
      ['지리적 표시제 특산물', '아일랜드 아이리시 위스키 · 에스파냐 사프란(아사프란 데 라만차) · 이탈리아 키안티·토스카나 포도주 · 그리스 엘리아 칼라마타스 올리브 · 프랑스 샴페인·보르도·보졸레 · 독일 뮌헨 비어 · 인도 다르질링 차 · 일본 반슈 소면 · 미국 플로리다 오렌지 · 자메이카 블루 마운틴 커피 · 콜롬비아 콜롬비안 커피 · 오스트레일리아 그레이트 서던 포도주'],
      ['장소 마케팅 랜드마크', '오스트레일리아 오페라 하우스 · 프랑스 에펠탑 · 인도 타지마할 · 이탈리아 콜로세움 · 페루 마추픽추 · 브라질 구세주 그리스도상 · 미국 자유의 여신상 · 이집트 피라미드 · 에스파냐 사그라다 파밀리아'],
      ['지역 브랜드화 축제', '몽골 나담 · 페루 쿠스코 태양제 · 인도 홀리 · 일본 삿포로 눈 축제 · 브라질 리우 카니발 · 에스파냐 부뇰 토마토(지중해성 기후) · 네덜란드 알크마르 치즈(서안 해양성 기후)'],
    ] } },
    { heading: '현지화와 글로컬라이제이션', points: [
      '현지화: 기업이 현지의 기후·종교·문화·언어·관습을 고려해 상품·서비스를 맞춤 → 한국 불고기버거, 인도 소고기 뺀 채식 메뉴, 이슬람 문화권 수출용 할랄 인증 라면',
      '글로컬라이제이션 = 세계화 + 현지화: 세계화를 추구하면서 지역 고유문화를 존중 → 같은 간판·상표의 S커피 전문점이 한국은 한옥, 중국은 전통 건축 양식 매장',
      '지역화 전략(지리적 표시제·장소 마케팅·지역 브랜드화)은 지역이, 현지화는 기업이 쓰는 전략이다',
    ] },
  ], [
    { title: '지리적 표시의 뜻과 요건', url: 'https://www.wipo.int/en/web/geographical-indications/faq_geographicalindications', publisher: 'WIPO', note: '상품의 특성과 지리적 원산지 사이의 연결을 확인하세요. 국내 개별 등록 여부는 수업자료를 기준으로 구별하세요.' },
  ]),
];
