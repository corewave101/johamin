import type { ConceptLesson } from './study-concepts';
import { astronomyHwangFinalCards, ASTRONOMY_HWANG_TOPICS, NOTE } from './astronomy-hwang-final-cards';

// 기말고사 · 행성우주과학(황윤환T) 「행성우주과학 탐구」 슬라이드 50~94를 세 단원으로 정리했다.
// 각 단원의 예시는 같은 단원의 객관식 카드 전부다(카드를 고치면 예시도 같이 바뀐다).
const [H1, H2, H3, H4, H5, H6, H7, H8] = ASTRONOMY_HWANG_TOPICS;
const examplesFor = (topics: string[]) => astronomyHwangFinalCards
  .filter(card => topics.includes(card.topic))
  .map(card => ({ id: card.id, context: card.question, explanation: card.explanation, sourceNote: NOTE(card.sourceSlide ?? 50) }));

const lesson = (id: string, title: string, topicKeys: string[], slide: number, summary: string, sections: ConceptLesson['sections']): ConceptLesson => ({
  id, deckId: 'astronomy-hwang-final', title, summary, sections, topicKeys, sourceNote: NOTE(slide),
  examplesLabel: '문제로 확인', examples: examplesFor(topicKeys),
});

export const astronomyHwangFinalConcepts: ConceptLesson[] = [
  lesson('astronomy-hwang-final-concept-1', 'CCD와 CMOS 카메라', [H1, H2, H3], 51,
    '영상 센서는 실리콘 화소가 밴드갭보다 큰 광자를 흡수해 쌓은 광전자를 읽어 디지털 영상을 만든다. CCD는 전하를 옮겨 증폭기 하나로 읽고, CMOS는 화소마다 증폭해 바로 읽는다. 차이의 핵심은 전하를 읽는 방법이다.',
    [
      { heading: '공통 원리', points: [
        '영상 센서: 빛을 전하로 바꿔 디지털 영상을 얻는 반도체 소자. 각 화소 = MOS 축전기',
        '광자 에너지 E = hc/λ가 밴드갭 E_g보다 커야 광전자가 생긴다 → 실리콘은 λ_cut = hc/E_g ≈ 1.1 μm보다 긴 적외선을 잘 못 본다.',
        '양자 효율 QE = 검출된 전자 수/들어온 광자 수 × 100%. 건판 1~3%, CCD 90% 이상 → t_CCD = t_건판 × QE_건판/QE_CCD',
      ] },
      { heading: 'CCD', points: [
        '읽기: 노출 → 전체 전하를 한 줄씩 아래로 → 맨 아래 줄을 한 칸씩 옮겨 증폭기에서 읽음 → 반복',
        '같은 증폭기를 거쳐 화소 응답이 고름 → 평탄화 유리. 단점: 읽기 시간이 김(네 모서리 증폭기로 1/4로 단축)',
        '선형성이 좋아 빛의 양에 비례하는 신호, 상반칙 불궤 없음 → 정밀 측광',
      ] },
      { heading: 'CCD 전송 방식', table: { columns: ['방식', '구조', '특징'], rows: [
        ['인터라인 전송', '수광 영역과 시프트 레지스터가 번갈아 배열', '수직 → 수평 레지스터로 이동'],
        ['프레임 전송', '수광 화소와 같은 수의 저장 영역', '전하를 한 번에 옮겨 다음 노출 중 읽기'],
        ['풀프레임', '한 소자가 생성 · 저장 · 이동', '수광 면적 넓어 감도 높음, 읽는 동안 기계식 셔터'],
      ] } },
      { heading: 'CMOS와 비교', points: [
        '1-Tr 수동 화소: 수광 면적 넓지만 잡음 크고 고정 패턴 잡음 / 3-Tr 능동 화소: 고정 패턴 잡음 줄지만 수광 면적 비율 낮음 / 4-Tr: 전송 게이트로 초기화 잡음 제거, 빠른 읽기, 전역 셔터 어려움',
        'CCD: 저잡음 · 넓은 동적 범위 · 전역 셔터 · 화질과 감도 우수, 전력 · 가격 높음',
        'CMOS: 화소마다 증폭 → 저전력 · 저가격 · 부분 읽기 쉬움. 최근 후면 조사형 CMOS로 효율이 올라 연구용으로도 개발, 아마추어용은 사실상 CMOS',
      ] },
    ]),
  lesson('astronomy-hwang-final-concept-2', '노출과 DSLR 천체 촬영', [H4, H5, H6], 62,
    '노출량은 빛의 세기(조리개)와 시간(셔터 속도)의 곱이고, ISO는 받은 빛을 밝기로 바꾸는 정도다. DSLR로 천체를 찍을 때는 M · B 모드, 수동 초점, RAW, 미러 락업과 리모트 스위치로 흔들림과 잡음을 줄인다.',
    [
      { heading: '노출 3요소', table: { columns: ['요소', '조절하는 것', '함께 바뀌는 것'], rows: [
        ['조리개(F값)', '빛의 세기, I ∝ 1/N²', '피사계 심도(F값 클수록 앞뒤 선명)'],
        ['셔터 속도', '빛 받는 시간', '움직임 표현(느리면 흐름)'],
        ['ISO 감도', '받은 빛을 밝기로 바꾸는 정도', '높을수록 잡음 증가'],
      ] } },
      { heading: '값 읽기', points: [
        'F값 표준 단계 F1.4 - 2 - 2.8 - 4 - 5.6 - 8 - 11 - 16, 한 단계 = 빛 2배',
        '셔터: 따옴표가 붙으면 초(4″ = 4 s), 숫자만이면 분모(125 = 1/125 s). 한 단계 = 빛 2배',
        '등가 노출: 조리개를 1스톱 열고 셔터를 1스톱 빠르게 하면 노출량이 같다(사진의 심도 · 움직임은 다름).',
      ] },
      { heading: 'EOS 60D로 천체 찍기', points: [
        '크롭 팩터 약 1.6(APS-C 센서) → f_eq ≈ 1.6 f, 화소 크기 약 4.3 μm',
        '직초점 촬영: 렌즈를 떼고 T-링 + T-어댑터로 연결, 대물렌즈의 상이 센서에 바로 맺힌다.',
        '초점: MF로 라이브 뷰 10배 확대, 밝은 별이 가장 작은 점일 때',
        '완전 자동은 밤하늘에서 AF 실패, 1/60 s보다 긴 노출 불가 → M(수동) · B(벌브) 모드',
        '미러 락업: 미러 충격 진동 제거 / 리모트 스위치: 손의 진동 제거',
        'RAW(14비트, 16,384단계) vs JPEG(8비트, 256단계): 스태킹할 사진은 RAW',
        '히스토그램: 하늘 배경 봉우리를 왼쪽 끝에서 떼어 둔다(왼쪽 끝 = 섀도 손실).',
        '장노출 노이즈 감소를 켜면 노출 시간만큼 처리 시간이 더 걸린다 → 연속 촬영은 끄고 다크 프레임으로 보정',
      ] },
      { heading: '장비 관리', points: [
        '카드 포맷은 그 카메라에서(보호한 이미지도 지워짐, 일반 포맷은 데이터가 남음)',
        '결로: 찬 카메라는 비닐 백에 넣어 서서히 온도를 맞춘다.',
        '센서 먼지는 흐린 고리 그림자로 찍힌다 → 플랫 프레임으로 보정',
      ] },
    ]),
  lesson('astronomy-hwang-final-concept-3', '행성 촬영과 태양 관측 위성 자료', [H7, H8], 88,
    '행성은 시직경이 작아 센서 위에서 수십 화소에 불과하므로 동영상 크롭과 럭키 이미징으로 찍는다. 태양 관측 위성 영상의 흑점 이동으로 태양의 자전과 위도에 따라 자전 속도가 다른 차등 자전을 확인한다.',
    [
      { heading: '행성 상의 크기', points: [
        '상의 크기 s = fθ, θ[rad] = θ[″]/206265, 화소 수 N = fθ/p',
        '동영상 크롭(640×480): 센서 가운데만 화소를 줄이지 않고 기록 → 약 7배 망원 효과(배율이 높아진 것은 아님), 60 fps',
        '럭키 이미징: 대기 흔들림 속 수천 프레임 중 선명한 프레임만 골라 합성',
      ] },
      { heading: '촬영 설정', points: [
        '동영상 수동 모드, 셔터 1/4000~1/60 s, ISO 수동',
        '행성 표면이 포화되지 않게 노출, 초점은 크롭 전 10배 확대로',
        '적도의로 추적하고 리모컨으로 촬영 시작 → 진동 줄임',
      ] },
      { heading: '태양 관측 위성 자료', table: { columns: ['자료', '알 수 있는 것'], rows: [
        ['SOHO', '태양과 지구 사이에서 태양을 24시간 관측, 일일 흑점 영상'],
        ['우주환경센터 흑점 자료', '위도 · 경도선이 그려져 차등 자전 확인'],
        ['SDO', '실시간 태양 사진, 파장별 태양 모습'],
      ] } },
      { heading: '흑점으로 본 태양의 자전', points: [
        '여러 흑점이 같은 방향으로 함께 이동 → 태양이 자전한다.',
        '적도 쪽 흑점이 같은 시간에 더 많이 이동 → 위도에 따라 자전 속도가 다르다(차등 자전), 고위도일수록 자전 주기가 길다.',
      ] },
    ]),
];
