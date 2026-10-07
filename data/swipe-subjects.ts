import type { Direction, SwipeCard } from './swipe-cards';
import { astronomyCards } from './astronomy-cards';
import { jeonCards } from './jeon-cards';
interface MenuItem { id: string; name: string; direction: Direction; symbol: string; description: string }
export interface SubjectDeck extends MenuItem { kind: 'deck'; cards: SwipeCard[]; fullName?: string }
export interface SubjectGroup extends MenuItem { kind: 'group'; children: SubjectNode[] }
export type SubjectNode = SubjectDeck | SubjectGroup;
export const subjectMenu: SubjectGroup = {
  id: 'root', kind: 'group', name: '과목 선택', direction: 'up', symbol: '✳', description: '분야를 고르고, 그 안에서 공부할 과목을 골라요.',
  children: [
    { id: 'biology', kind: 'deck', name: '생물', direction: 'up', symbol: '✳', description: '생명의 원리를 한 장씩.', cards: [] },
    { id: 'humanities', kind: 'group', name: '인문(국,사,영)', direction: 'left', symbol: '가', description: '국어 · 사회 · 영어를 방향으로 골라요.', children: [
      { id: 'korean', kind: 'deck', name: '국어', direction: 'up', symbol: '가', description: '말과 글의 감각을 한 장씩.', cards: [] },
      { id: 'social', kind: 'deck', name: '사회', direction: 'left', symbol: '◎', description: '세상을 보는 눈을 한 장씩.', cards: [] },
      { id: 'english', kind: 'deck', name: '영어', direction: 'right', symbol: 'A', description: '문장과 표현을 한 장씩.', cards: [] },
    ] },
    { id: 'astronomy', kind: 'group', name: '행성우주과학', direction: 'right', symbol: '✦', description: '왼쪽은 황, 오른쪽은 전. 공부할 파트를 골라요.', children: [
      { id: 'astronomy-hwang', kind: 'deck', name: '(황)', fullName: '행성우주과학(황)', direction: 'left', symbol: '✦', description: '조립 순서·조작 이유·극축 정렬의 원리.', cards: astronomyCards },
      { id: 'astronomy-jeon', kind: 'deck', name: '(전)', fullName: '행성우주과학(전)', direction: 'right', symbol: '✧', description: '케플러 법칙·천구 좌표·일주와 연주운동·행성과 달 관측.', cards: jeonCards },
    ] },
  ],
};
const flatten = (group: SubjectGroup): SubjectDeck[] => group.children.flatMap(node => node.kind === 'group' ? flatten(node) : [node]);
export const subjectDecks = flatten(subjectMenu);
