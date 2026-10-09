import { physicsCards } from './physics-cards';
import { physicsWritten } from './physics-written';
import type { Direction, SwipeCard } from './swipe-cards';
import { astronomyCards } from './astronomy-cards';
import { jeonCards } from './jeon-cards';
import { socialCards } from './social-cards';
import { englishCards } from './english-cards';
import { englishWritten } from './english-written';
import { koreanGrammarCards, koreanGrammarWritten } from './korean-cards';
import { koreanNewyorkCards, koreanNewyorkWritten } from './korean-newyork-cards';
import { parkCards, joCards } from './biology-cards';
import { geneticsCards, geneticsWritten } from './genetics-terms';
import { parkWritten, joWritten, type WrittenQuestion } from './biology-written';
interface MenuItem { id: string; name: string; direction: Direction; symbol: string; description: string }
export interface SubjectDeck extends MenuItem { kind: 'deck'; cards: SwipeCard[]; fullName?: string; writtenQuestions?: WrittenQuestion[] }
export interface SubjectGroup extends MenuItem { kind: 'group'; children: SubjectNode[] }
export type SubjectNode = SubjectDeck | SubjectGroup;
export const subjectMenu: SubjectGroup = {
  id: 'root', kind: 'group', name: '과목 선택', direction: 'up', symbol: '✳', description: '분야를 고르고, 그 안에서 공부할 과목을 골라요.',
  children: [
    { id: 'humanities', kind: 'group', name: '인문', direction: 'left', symbol: '가', description: '국어 · 사회 · 영어를 방향으로 골라요.', children: [
      { id: 'korean', kind: 'group', name: '국어', direction: 'up', symbol: '가', description: '뉴욕제과점 · 문법 · 고전 시가.', children: [
        { id: 'korean-newyork', kind: 'deck', name: '뉴욕제과점', fullName: '국어(뉴욕제과점)', direction: 'left', symbol: '가', description: '김연수 「뉴욕제과점」: 구절 풀이·어머니·결말의 깨달음.', cards: koreanNewyorkCards, writtenQuestions: koreanNewyorkWritten },
        { id: 'korean-grammar', kind: 'deck', name: '문법', fullName: '국어(문법)', direction: 'up', symbol: '가', description: '우리말 바로 쓰기: 한글 맞춤법·띄어쓰기·헷갈리는 표기.', cards: koreanGrammarCards, writtenQuestions: koreanGrammarWritten },
        { id: 'korean-classic', kind: 'deck', name: '고전 시가', fullName: '국어(고전 시가)', direction: 'right', symbol: '가', description: '수업 자료를 기다리는 중.', cards: [] },
      ] },
      { id: 'social', kind: 'deck', name: '사회', fullName: '사회(성신제)', direction: 'left', symbol: '◎', description: '세계화·국제 갈등·평화·정의관·불평등을 꼬아서.', cards: socialCards },
      { id: 'english', kind: 'deck', name: '영어', direction: 'right', symbol: 'A', description: '고대 건축물·Bartleby·가정법·예술과 측정.', cards: englishCards, writtenQuestions: englishWritten },
    ] },
    { id: 'science', kind: 'group', name: '과학', direction: 'up', symbol: '✳', description: '생물 · 지구과학 · 물리학Ⅱ를 골라요.', children: [
    { id: 'biology', kind: 'group', name: '생물', direction: 'up', symbol: '✳', description: '선생님별 객관식과 서술형 연습.', children: [
      { id: 'biology-jo', kind: 'deck', name: '조용민T', fullName: '생물(조용민T)', direction: 'left', symbol: '✳', description: '전사·RNA 가공·번역까지. 오페론부터 제외.', cards: joCards, writtenQuestions: joWritten },
      { id: 'biology-park', kind: 'deck', name: '박상영T', fullName: '생물(박상영T)', direction: 'right', symbol: '✳', description: '유전 법칙·사람의 유전·돌연변이·유전 물질 + 교사용 핵심 용어 22개.', cards: [...parkCards, ...geneticsCards], writtenQuestions: [...parkWritten, ...geneticsWritten] },
    ] },
    { id: 'astronomy', kind: 'group', name: '지구과학', direction: 'left', symbol: '✦', description: '왼쪽은 황, 오른쪽은 전. 공부할 파트를 골라요.', children: [
      { id: 'astronomy-hwang', kind: 'deck', name: '(황)', fullName: '행성우주과학(황)', direction: 'left', symbol: '✦', description: '조립 순서·조작 이유·극축 정렬의 원리.', cards: astronomyCards },
      { id: 'astronomy-jeon', kind: 'deck', name: '(전)', fullName: '행성우주과학(전)', direction: 'right', symbol: '✧', description: '케플러 법칙·천구 좌표·일주와 연주운동·행성과 달 관측.', cards: jeonCards },
    ] },
      { id: 'physics-ii', kind: 'deck', name: '물리학Ⅱ', fullName: '물리학Ⅱ(6~11단원)', direction: 'right', symbol: 'F', description: '수능특강 6~11단원 · 개념 · 새 객관식 · 서술형.', cards: physicsCards, writtenQuestions: physicsWritten },
    ] },
  ],
};
const flatten = (group: SubjectGroup): SubjectDeck[] => group.children.flatMap(node => node.kind === 'group' ? flatten(node) : [node]);
export const subjectDecks = flatten(subjectMenu);
