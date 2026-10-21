import type { ConceptLesson } from './study-concepts';
import { NOTE, socialJoFinalCards } from './social-jo-final-cards';

// 기말고사 · 조안나T 1차시 「주제 1 자본주의의 발달과 시장경제」를 단원별로 정리했다(학습 노트 1쪽 + 교과서 69쪽).
// 각 단원의 예시는 같은 단원의 객관식 카드 전부다(카드를 고치면 예시도 같이 바뀐다).
const examplesFor = (topics: string[]) => socialJoFinalCards
  .filter(card => topics.includes(card.topic))
  .map(card => ({ id: card.id, context: card.question, explanation: card.explanation, sourceNote: card.sourceNote ?? NOTE }));

const lesson = (id: string, title: string, topicKeys: string[], summary: string, sections: ConceptLesson['sections']): ConceptLesson => ({
  id, deckId: 'social-jo-final', title, summary, sections, topicKeys, sourceNote: `${NOTE} · 통합사회 교과서 69쪽`,
  examplesLabel: '문제로 확인', examples: examplesFor(topicKeys),
});

export const socialJoFinalConcepts: ConceptLesson[] = [
  lesson('social-jo-final-concept-1', '자본주의의 의미 · 경제 체제', ['자본주의의 의미와 특징', '경제 체제의 분류'],
    '자본주의는 사유 재산 제도를 바탕으로 시장에서 자유로운 경제활동을 보장하는 경제 체제다. 경제 체제는 기본적인 경제 문제를 해결하는 방식에 따라 시장 경제 체제와 계획 경제 체제로 나뉜다.',
    [
      { heading: '자본주의의 의미와 특징', points: [
        '의미: 사유 재산 제도를 바탕으로 시장에서 자유로운 경제활동을 보장하는 경제 체제',
        '특징: 사유 재산권 보장, 경제활동의 자유, 사적 이익 추구 인정, 시장 경제 체제와 결합',
        '↔ 사회주의: 계획 + 중앙 통제',
      ] },
      { heading: '경제 체제의 분류', table: { columns: ['체제', '경제 문제를 해결하는 방식'], rows: [
        ['시장 경제 체제', '시장 가격에 따른 자유로운 의사 결정'],
        ['계획 경제 체제', '정부의 계획과 명령, 통제'],
      ] } },
    ]),
  lesson('social-jo-final-concept-2', '상업 자본주의 · 산업 자본주의', ['자본주의의 전개', '상업 자본주의', '산업 자본주의'],
    '자본주의는 상업 자본주의 → 산업 자본주의 → 수정 자본주의 → 신자유주의 순으로 전개되었다. 상업 자본주의는 유통에서, 산업 자본주의는 제조업에서 이윤을 얻었다.',
    [
      { heading: '상업 자본주의 (16~18세기)', points: [
        '배경: 16세기 신항로 개척 이후 교역망 확대, 금과 은 유입, 절대 왕정의 중상주의 정책',
        '특징: 상품의 유통 과정에서 이윤을 추구',
        '절대 왕정: 중앙 집권 체제 확립과 영토 확장 전쟁 자금을 위해 상공업 지원',
        '중상주의: 금·은 확보가 곧 국가의 부 → 금·은 유출을 막고 유입을 늘림',
        '국가의 경제 통제: 수출 장려·수입 통제, 수입 관세, 곡물법(자국 농업 보호), 항해 조례(자국 해운 보호)',
        '흐름: 중세(지방 분권·가톨릭·장원) → 봉건 제도 약화 → 왕권 강화 → 중상주의',
      ] },
      { heading: '산업 자본주의 (18~19세기)', points: [
        '배경: 18세기 중반 영국에서 시작된 산업 혁명으로 대량 생산이 가능해짐',
        '증기 기관: 석탄을 적게 쓰며 강한 동력 → 방적기·방직기 → 생산량 급증 → 산업 자본 축적',
        '가내 수공업 → 공장제 기계 공업(공장 대량 생산)',
        '특징: 제조업을 바탕으로 이윤을 창출',
        '애덤 스미스 《국부론》: 시장의 기능을 ‘보이지 않는 손’에 비유, 개인이 자기 이익을 추구하면 사회의 이익도 증진',
        '자유방임주의: 정부의 시장 개입 최소화, 개인의 경제적 자유 최대 보장 → 작은 정부',
      ] },
    ]),
  lesson('social-jo-final-concept-3', '수정 자본주의 · 신자유주의', ['수정 자본주의', '신자유주의'],
    '수정 자본주의는 시장 실패와 대공황을 배경으로 정부가 적극 개입했고, 신자유주의는 정부 실패와 석유 파동 이후의 스태그플레이션을 배경으로 다시 시장을 강조했다.',
    [
      { heading: '수정 자본주의', points: [
        '배경: 독과점 같은 시장 실패, 1929년 미국 대공황',
        '특징: 정부가 적극적으로 시장에 개입해 시장 실패·경기 침체를 해결',
        '케인스: 정부가 유효 수요를 창출해 경기 침체를 극복',
        '뉴딜 정책: 루스벨트 대통령, 정부 기능 확대와 적극적인 구제 정책으로 대공황 극복',
      ] },
      { heading: '신자유주의', points: [
        '배경: 정부 실패, 1970년대 석유 파동 이후 스태그플레이션',
        '특징: 정부의 시장 개입을 줄이고 시장에 의해 경제 문제를 해결',
        '석유 파동 → 스태그플레이션: 유가 상승 → 생산비 증가 → 물가 상승 → 소비 위축 → 기업 수입 감소 → 투자·고용 감소 → 경기 침체',
      ] },
    ]),
];
