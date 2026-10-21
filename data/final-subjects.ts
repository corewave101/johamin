import type { SubjectGroup } from './swipe-subjects';
import { socialJoFinalCards, socialJoFinalWritten } from './social-jo-final-cards';

// 기말고사 메뉴. 중간고사 카드(data/swipe-subjects.ts의 subjectMenu)는 /midterm/ 보관함으로 옮겼다.
// 카드가 없는 덱은 '준비 중'으로 보인다. 카드는 아래 덱 id로 넣는다(DB의 deck_id도 같은 id). 중간고사 덱 id는 다시 쓰지 않는다.
export const finalMenu: SubjectGroup = {
  id: 'root', kind: 'group', name: '과목 선택', direction: 'up', symbol: '✳', description: '분야를 고르고, 그 안에서 공부할 과목을 골라요.',
  children: [
    { id: 'humanities', kind: 'group', name: '인문', direction: 'left', symbol: '가', description: '국어 · 사회 · 영어를 방향으로 골라요.', children: [
      { id: 'korean-final', kind: 'deck', name: '국어', fullName: '국어(기말)', direction: 'up', symbol: '가', description: '기말고사 국어 카드를 준비하고 있어요.', cards: [] },
      { id: 'social-final-group', kind: 'group', name: '사회', direction: 'left', symbol: '◎', description: '왼쪽은 성신제T, 오른쪽은 조안나T. 공부할 파트를 골라요.', children: [
        { id: 'social-sung-final', kind: 'deck', name: '성신제T', fullName: '사회(성신제T · 기말)', direction: 'left', symbol: '◎', description: '기말고사 성신제T 카드를 준비하고 있어요.', cards: [] },
        { id: 'social-jo-final', kind: 'deck', name: '조안나T', fullName: '사회(조안나T · 기말)', direction: 'right', symbol: '◎', description: '자본주의의 발달과 시장경제: 상업·산업·수정 자본주의·신자유주의 · 경제 체제.', cards: socialJoFinalCards, writtenQuestions: socialJoFinalWritten },
      ] },
      { id: 'english-final', kind: 'deck', name: '영어', fullName: '영어(기말)', direction: 'right', symbol: 'A', description: '기말고사 영어 카드를 준비하고 있어요.', cards: [] },
    ] },
    { id: 'science', kind: 'group', name: '과학', direction: 'right', symbol: '✳', description: '생물 · 지구과학 · 물리학Ⅱ · 화학을 골라요.', children: [
      { id: 'biology-final', kind: 'deck', name: '생물', fullName: '생물(기말)', direction: 'up', symbol: '✳', description: '기말고사 생물 카드를 준비하고 있어요.', cards: [] },
      { id: 'astronomy-final', kind: 'deck', name: '지구과학', fullName: '지구과학(기말)', direction: 'left', symbol: '✦', description: '기말고사 지구과학 카드를 준비하고 있어요.', cards: [] },
      { id: 'physics-chemistry', kind: 'group', name: '물리 · 화학', direction: 'right', symbol: 'F', description: '왼쪽은 물리학Ⅱ, 오른쪽은 화학이에요.', children: [
        { id: 'physics-final', kind: 'deck', name: '물리학Ⅱ', fullName: '물리학Ⅱ(기말)', direction: 'left', symbol: 'F', description: '기말고사 물리학Ⅱ 카드를 준비하고 있어요.', cards: [] },
        { id: 'chemistry-final', kind: 'deck', name: '화학', fullName: '화학(기말)', direction: 'right', symbol: '⚗', description: '기말고사 화학 카드를 준비하고 있어요.', cards: [] },
      ] },
    ] },
  ],
};
