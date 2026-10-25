import type { ConceptLesson } from './study-concepts';
import { astronomyJeonFinalCards, ASTRONOMY_JEON_TOPICS, NOTE } from './astronomy-jeon-final-cards';

// 기말고사 · 행성우주과학(전효진T) 학습지 8번 「5. 외계 행성 탐사」를 세 단원으로 정리했다.
// 각 단원의 예시는 같은 단원의 객관식 카드 전부다(카드를 고치면 예시도 같이 바뀐다).
const [T1, T2, T3, T4, T5, T6] = ASTRONOMY_JEON_TOPICS;
const examplesFor = (topics: string[]) => astronomyJeonFinalCards
  .filter(card => topics.includes(card.topic))
  .map(card => ({ id: card.id, context: card.question, explanation: card.explanation, sourceNote: NOTE(card.source?.page ?? 1) }));

const lesson = (id: string, title: string, topicKeys: string[], page: number, summary: string, sections: ConceptLesson['sections']): ConceptLesson => ({
  id, deckId: 'astronomy-jeon-final', title, summary, sections, topicKeys, sourceNote: NOTE(page),
  examplesLabel: '문제로 확인', examples: examplesFor(topicKeys),
});

export const astronomyJeonFinalConcepts: ConceptLesson[] = [
  lesson('astronomy-jeon-final-concept-1', '도플러 효과와 적색 · 청색 편이', [T2, T3], 1,
    '파동의 발생원(광원)이 관측자에게 가까워지면 파장이 짧아지고(청색 편이), 멀어지면 파장이 길어진다(적색 편이). 별빛 스펙트럼의 흡수선이 어느 쪽으로 얼마나 이동했는지로 별의 움직임을 안다.',
    [
      { heading: '도플러 효과', points: [
        '파동의 발생원(광원)이 관측자에게 가까워지거나 멀어질 때 파장이 짧아지거나 길어지는 현상',
        '광원이 나아가는 쪽은 파면이 촘촘해져 파장이 짧고, 반대쪽은 파면이 벌어져 파장이 길다.',
      ] },
      { heading: '접근 · 정지 · 후퇴', table: { columns: ['', '접근할 때', '정지 상태', '후퇴할 때'], rows: [
        ['별빛의 파장', '짧아진다', '그대로', '길어진다'],
        ['흡수선', '파란색(보라색) 쪽으로 이동', '원래 위치', '붉은색 쪽으로 이동'],
        ['이름', '청색 편이', '편이 없음', '적색 편이'],
      ] } },
      { heading: '전자기파의 파장 순서', points: [
        '파장이 짧은 쪽부터: γ선 → X선 → 자외선 → 가시광선 → 적외선 → 전파',
        '가시광선은 보라색 쪽이 짧고 빨간색 쪽이 길다. 자외선은 보라색 바깥, 적외선은 빨간색 바깥이다.',
        '★ 필기의 전자기파 띠는 적외선과 자외선 자리가 바뀌어 있다. 자외선이 가시광선보다 짧은 쪽, 적외선이 긴 쪽이다.',
      ] },
    ]),
  lesson('astronomy-jeon-final-concept-2', '시선 속도', [T4, T6], 2,
    '시선 속도는 관측자 쪽 일직선 방향으로 접근하거나 후퇴하는 속도다. 별빛 스펙트럼의 흡수선 파장 변화로 구하며, 속도가 클수록 파장 변화가 크다.',
    [
      { heading: '뜻과 측정', points: [
        '시선 속도: 어떤 물체가 시선 방향으로 움직이는 속도, 즉 관측자 쪽으로 일직선 방향으로 접근하거나 후퇴하는 속도',
        '별빛 스펙트럼 분석으로 알 수 있다. 접근하거나 후퇴하는 속도가 클수록 흡수선의 파장 변화가 크다.',
        '공간 속도(실제 속도)는 시선 속도와 그에 수직인 접선 속도로 나뉜다. 접선 속도 때문에 천구면에서 보이는 각의 변화가 고유 운동(μ)이다.',
      ] },
      { heading: '시선 속도 식', points: [
        'Vr = c × (λ − λ₀)/λ₀ (c: 빛의 속도 3×10⁵ km/s, λ₀: 원래 파장, λ: 관측 파장)',
        'Vr > 0 → 적색 편이(멀어짐), Vr < 0 → 청색 편이(다가옴), Vr = 0 → 편이 없음',
      ] },
      { heading: '암산 예', points: [
        '500 nm → 501 nm: 3×10⁵ × 1/500 = 600 km/s로 멀어짐',
        '600 nm → 599.8 nm: 3×10⁵ × (−0.2)/600 = −100 km/s, 다가옴',
        '400 nm, 300 km/s로 멀어짐: Δλ = 400 × 300/(3×10⁵) = 0.4 nm → 400.4 nm',
      ] },
    ]),
  lesson('astronomy-jeon-final-concept-3', '중심별의 시선 속도 변화로 외계 행성 찾기', [T1, T5], 2,
    '행성은 빛을 내지 못해 직접 찾기 어렵다. 행성과 중심별은 공통 질량 중심을 함께 돌기 때문에, 중심별 스펙트럼에 적색 편이와 청색 편이가 주기적으로 반복되면 행성이 있다고 판단한다.',
    [
      { heading: '왜 중심별을 보나', points: [
        '외계 행성은 스스로 빛을 내지 못해 찾기 어렵다. 그래서 중심별(태양 같은 별)의 빛을 먼저 탐사한다.',
        '행성과 중심별은 공통 질량 중심을 돈다. 중심별도 작은 궤도를 그리며 지구에 대해 다가왔다 멀어졌다 한다.',
      ] },
      { heading: '①~④ 위치별 스펙트럼', table: { columns: ['중심별의 운동', '스펙트럼', '행성의 운동'], rows: [
        ['시선 방향 속도 변화 없음 (①, ③)', '도플러 효과 없음', '시선에 수직'],
        ['지구에서 멀어짐 (②)', '적색 편이', '지구 쪽으로 다가옴'],
        ['지구에 가까워짐 (④)', '청색 편이', '지구에서 멀어짐'],
      ] } },
      { heading: '주기적 반복', points: [
        '편이 없음 → 적색 편이 → 편이 없음 → 청색 편이가 되풀이된다.',
        '반복 주기는 행성의 공전 주기와 같다.',
        '측정하는 것은 행성의 빛이 아니라 중심별 흡수선의 파장 변화다.',
      ] },
    ]),
];
