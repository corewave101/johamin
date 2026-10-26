import type { SubjectGroup } from './swipe-subjects';
import { socialJoFinalCards, socialJoFinalWritten } from './social-jo-final-cards';
import { chemistryFinalCards, chemistryFinalWritten } from './chemistry-final-cards';
import { socialSungFinalCards, socialSungFinalWritten } from './social-sung-final-cards';
import { englishFinalCards, englishFinalWritten } from './english-final-cards';
import { mathTrigFinalCards, mathTrigFinalWritten } from './math-trig-final-cards';
import { astronomyJeonFinalCards, astronomyJeonFinalWritten } from './astronomy-jeon-final-cards';

// 기말고사 메뉴. 중간고사 카드(data/swipe-subjects.ts의 subjectMenu)는 /midterm/ 보관함으로 옮겼다.
// 처음 화면에서 ↓는 뒤로 갈 곳이 없어서 수학 자리로 쓴다(↑는 중간고사 바로가기).
// 처음 화면에서 ↓는 뒤로 갈 곳이 없어서 수학 자리로 쓴다(↑는 중간고사 바로가기).
// 카드가 없는 덱은 '준비 중'으로 보인다. 카드는 아래 덱 id로 넣는다(DB의 deck_id도 같은 id). 중간고사 덱 id는 다시 쓰지 않는다.
export const finalMenu: SubjectGroup = {
  id: 'root', kind: 'group', name: '과목 선택', direction: 'up', symbol: '✳', description: '분야를 고르고, 그 안에서 공부할 과목을 골라요.',
  children: [
    { id: 'humanities', kind: 'group', name: '인문', direction: 'left', symbol: '가', description: '국어 · 사회 · 영어를 방향으로 골라요.', children: [
      { id: 'korean-final', kind: 'deck', name: '국어', fullName: '국어(기말)', direction: 'up', symbol: '가', description: '기말고사 국어 카드를 준비하고 있어요.', cards: [] },
      { id: 'social-final-group', kind: 'group', name: '사회', direction: 'left', symbol: '◎', description: '왼쪽은 성신제T, 오른쪽은 조안나T. 공부할 파트를 골라요.', children: [
        { id: 'social-sung-final', kind: 'deck', name: '성신제T', fullName: '사회(성신제T · 기말)', direction: 'left', symbol: '◎', description: '학습지 하나 = 에디션 하나. 213 피라미드 에디션: 인구 분포 · 인구 구조 · 인구 피라미드 · 인구 정책.', cards: socialSungFinalCards, writtenQuestions: socialSungFinalWritten },
        { id: 'social-jo-final', kind: 'deck', name: '조안나T', fullName: '사회(조안나T · 기말)', direction: 'right', symbol: '◎', description: '자본주의의 발달과 시장경제: 상업·산업·수정 자본주의·신자유주의 · 경제 체제.', cards: socialJoFinalCards, writtenQuestions: socialJoFinalWritten },
      ] },
      { id: 'english-final', kind: 'deck', name: '영어', fullName: '영어(진달래T · 기말)', direction: 'right', symbol: 'A', description: '연결사와 접속사: 역접 · 인과 · 전치사와의 차이 · 자주 쓰는 표현.', cards: englishFinalCards, writtenQuestions: englishFinalWritten },
    ] },
    { id: 'science', kind: 'group', name: '과학', direction: 'right', symbol: '✳', description: '생물 · 지구과학 · 물리학Ⅱ · 화학을 골라요.', children: [
      { id: 'biology-final', kind: 'deck', name: '생물', fullName: '생물(기말)', direction: 'up', symbol: '✳', description: '기말고사 생물 카드를 준비하고 있어요.', cards: [] },
      { id: 'astronomy-final-group', kind: 'group', name: '지구과학', direction: 'left', symbol: '✦', description: '왼쪽은 황윤환T, 오른쪽은 전효진T. 공부할 파트를 골라요.', children: [
        { id: 'astronomy-hwang-final', kind: 'deck', name: '황윤환T', fullName: '행성우주과학(황윤환T · 기말)', direction: 'left', symbol: '✦', description: '기말고사 황윤환T 카드를 준비하고 있어요.', cards: [] },
        { id: 'astronomy-jeon-final', kind: 'deck', name: '전효진T', fullName: '행성우주과학(전효진T · 기말)', direction: 'right', symbol: '✧', description: '외계 행성 탐사: 도플러 효과 · 적색·청색 편이 · 시선 속도 · 중심별의 시선 속도 변화.', cards: astronomyJeonFinalCards, writtenQuestions: astronomyJeonFinalWritten },
      ] },
      { id: 'physics-chemistry', kind: 'group', name: '물리 · 화학', direction: 'right', symbol: 'F', description: '왼쪽은 물리학Ⅱ, 오른쪽은 화학이에요.', children: [
        { id: 'physics-final-group', kind: 'group', name: '물리학Ⅱ', direction: 'left', symbol: 'F', description: '공부할 선생님 파트를 골라요.', children: [
          { id: 'physics-yang-final', kind: 'deck', name: '양동비T', fullName: '물리학Ⅱ(양동비T · 기말)', direction: 'left', symbol: 'F', description: '기말고사 양동비T 카드를 준비하고 있어요.', cards: [], lab: 'optics' },
        ] },
        { id: 'chemistry-final', kind: 'deck', name: '화학', fullName: '화학(주민지T · 기말)', direction: 'right', symbol: '⚗', description: '탄소 화합물: 분산력 · 알케인 · 이성질 · 명명법 · 고리형 · 알켄 · 알카인 · 알코올.', cards: chemistryFinalCards, writtenQuestions: chemistryFinalWritten },
      ] },
    ] },
    { id: 'math-final-group', kind: 'group', name: '수학', direction: 'down', symbol: '∑', description: '수학 선생님을 골라요.', children: [
      { id: 'math-hwang-final-group', kind: 'group', name: '황종철T', direction: 'left', symbol: '∑', description: '공부할 단원을 골라요.', children: [
        { id: 'math-trig-final', kind: 'deck', name: '삼각함수 각 변환', fullName: '수학(황종철T · 삼각함수 각 변환)', direction: 'up', symbol: 'θ', description: '암산으로 타다닥: 2nπ+x · −x · π±x · π/2±x · 90°×n±θ 각 변환 · 삼각함수표.', cards: mathTrigFinalCards, writtenQuestions: mathTrigFinalWritten },
      ] },
    ] },
  ],
};
