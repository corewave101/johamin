import { hwangExam } from './hwang-exam';
import { sciencePractice } from './science-practice';
import { studyPractice } from './study-practice';
import { parkDepthCards, parkDepthWritten } from './biology-depth';
import { chemistryCards, chemistryWritten } from './chemistry-content';
import { physicsCards } from './physics-cards';
import { physicsWritten } from './physics-written';
import type { Direction, SwipeCard } from './swipe-cards';
import { astronomyCards } from './astronomy-cards';
import { jeonCards } from './jeon-cards';
import { socialCards } from './social-cards';
import { socialJoCards, socialJoWritten } from './social-jo-cards';
import { socialBulkCards, socialBulkWritten } from './social-bulk-cards';
import { biologyJoBulkCards, biologyJoBulkWritten } from './biology-jo-bulk-cards';
import { koreanClassicCards, koreanClassicWritten } from './korean-classic-cards';
import { englishCards } from './english-cards';
import { englishWordCards } from './english-words';
import { englishWritten } from './english-written';
import { koreanGrammarCards, koreanGrammarWritten } from './korean-cards';
import { koreanNewyorkCards, koreanNewyorkWritten } from './korean-newyork-cards';
import { parkCards, joCards } from './biology-cards';
import { geneticsCards, geneticsWritten } from './genetics-terms';
import { parkWritten, joWritten, type WrittenQuestion } from './biology-written';
interface MenuItem { id: string; name: string; direction: Direction; symbol: string; description: string }
export interface SubjectDeck extends MenuItem { kind: 'deck'; cards: SwipeCard[]; fullName?: string; writtenQuestions?: WrittenQuestion[]; /** Has 그림 카드: asks for landscape and shows the figure panel. */ figures?: boolean; /** 실습 화면(베타 테스트를 켜면 학습 메뉴에 나온다). */ lab?: 'optics' }
export interface SubjectGroup extends MenuItem { kind: 'group'; children: SubjectNode[] }
export type SubjectNode = SubjectDeck | SubjectGroup;
export const subjectMenu: SubjectGroup = {
  id: 'root', kind: 'group', name: '과목 선택', direction: 'up', symbol: '✳', description: '분야를 고르고, 그 안에서 공부할 과목을 골라요.',
  children: [
    { id: 'humanities', kind: 'group', name: '인문', direction: 'left', symbol: '가', description: '국어 · 사회 · 영어를 방향으로 골라요.', children: [
      { id: 'korean', kind: 'group', name: '국어', direction: 'up', symbol: '가', description: '뉴욕제과점 · 문법 · 고전 시가.', children: [
        { id: 'korean-newyork', kind: 'deck', name: '뉴욕제과점', fullName: '국어(뉴욕제과점)', direction: 'left', symbol: '가', description: '김연수 「뉴욕제과점」: 구절 풀이·어머니·결말의 깨달음.', cards: koreanNewyorkCards, writtenQuestions: koreanNewyorkWritten },
        { id: 'korean-grammar', kind: 'deck', name: '문법', fullName: '국어(문법)', direction: 'up', symbol: '가', description: '우리말 바로 쓰기: 한글 맞춤법·띄어쓰기·헷갈리는 표기.', cards: koreanGrammarCards, writtenQuestions: koreanGrammarWritten },
        { id: 'korean-classic', kind: 'deck', name: '고전 시가', fullName: '국어(고전 시가)', direction: 'right', symbol: '가', description: '고대 가요부터 가사까지 갈래의 흐름 · 이별의 정한 · 율격 · 제망매가와 시조 두 편.', cards: koreanClassicCards, writtenQuestions: koreanClassicWritten },
      ] },
      { id: 'social-group', kind: 'group', name: '사회', direction: 'left', symbol: '◎', description: '왼쪽은 성신제T, 오른쪽은 조안나T. 공부할 파트를 골라요.', children: [
        { id: 'social-sung', kind: 'group', name: '성신제T', direction: 'left', symbol: '◎', description: '왼쪽은 기본, 오른쪽은 학습지마다 촘촘한 뭉탱이.', children: [
          { id: 'social', kind: 'deck', name: '기본', fullName: '사회(성신제T)', direction: 'left', symbol: '◎', description: '세계화·국제 갈등·평화·정의관·불평등을 꼬아서.', cards: socialCards },
          { id: 'social-bulk', kind: 'deck', name: '뭉탱이', fullName: '사회(성신제T · 뭉탱이)', direction: 'right', symbol: '◎', description: '학습지 하나 = 에디션 하나. 그 학습지만 촘촘하게 파요.', cards: socialBulkCards, writtenQuestions: socialBulkWritten },
        ] },
        { id: 'social-jo', kind: 'deck', name: '조안나T', fullName: '사회(조안나T)', direction: 'right', symbol: '◎', description: '인권 보장과 헌법: 기본권·기본권 제한·권력 분립·헌법재판소.', cards: socialJoCards, writtenQuestions: socialJoWritten },
      ] },
      { id: 'english', kind: 'deck', name: '영어', direction: 'right', symbol: 'A', description: '고대 건축물·Bartleby·가정법·예술과 측정 + 단어 문제(뜻+품사).', cards: [...englishCards, ...englishWordCards], writtenQuestions: englishWritten },
    ] },
    { id: 'science', kind: 'group', name: '과학', direction: 'right', symbol: '✳', description: '생물 · 지구과학 · 물리학Ⅱ · 화학을 골라요.', children: [
    { id: 'biology', kind: 'group', name: '생물', direction: 'up', symbol: '✳', description: '선생님별 객관식과 서술형 연습.', children: [
      { id: 'biology-jo-t', kind: 'group', name: '조용민T', direction: 'left', symbol: '✳', description: '왼쪽은 기본, 오른쪽은 에디션마다 촘촘한 뭉탱이.', children: [
        { id: 'biology-jo', kind: 'deck', name: '기본', fullName: '생물(조용민T)', direction: 'left', symbol: '✳', description: '전사·RNA 가공·번역까지. 오페론부터 제외.', cards: joCards, writtenQuestions: joWritten },
        { id: 'biology-jo-bulk', kind: 'deck', name: '뭉탱이', fullName: '생물(조용민T · 뭉탱이)', direction: 'right', symbol: '✳', description: '전사 에디션(3~14쪽) · 번역 에디션(15~25쪽). PPT와 필기를 촘촘하게 파요.', cards: biologyJoBulkCards, writtenQuestions: biologyJoBulkWritten, figures: true },
      ] },
      { id: 'biology-park', kind: 'deck', name: '박상영T', fullName: '생물(박상영T)', direction: 'right', symbol: '✳', description: '유전 법칙·사람의 유전·돌연변이·유전 물질 + 교사용 핵심 용어 22개.', cards: [...parkCards.filter(c => !c.id.includes("-depth-")), ...geneticsCards, ...parkDepthCards], writtenQuestions: [...parkWritten.filter(q => !q.id.includes("-depth-")), ...geneticsWritten, ...parkDepthWritten] },
    ] },
    { id: 'astronomy', kind: 'group', name: '지구과학', direction: 'left', symbol: '✦', description: '왼쪽은 황, 오른쪽은 전. 공부할 파트를 골라요.', children: [
      { id: 'astronomy-hwang', kind: 'deck', name: '(황)', fullName: '행성우주과학(황)', direction: 'left', symbol: '✦', description: '조립 순서·조작 이유·극축 정렬의 원리.', cards: astronomyCards },
      { id: 'astronomy-jeon', kind: 'deck', name: '(전)', fullName: '행성우주과학(전)', direction: 'right', symbol: '✧', description: '케플러 법칙·천구 좌표·일주와 연주운동·행성과 달 관측.', cards: jeonCards },
    ] },
      { id: 'physics-chemistry', kind: 'group', name: '물리 · 화학', direction: 'right', symbol: 'F', description: '왼쪽은 물리학Ⅱ, 오른쪽은 화학이에요.', children: [
      { id: 'physics-ii', kind: 'deck', name: '물리학Ⅱ', fullName: '물리학Ⅱ(6~11단원)', direction: 'left', symbol: 'F', description: '수능특강 6~11단원 · 개념 · 새 객관식 · 서술형.', cards: physicsCards, writtenQuestions: physicsWritten },
      { id: 'chemistry', kind: 'deck', name: '화학', fullName: '화학(산·염기 평형과 실험)', direction: 'right', symbol: '⚗', description: '평형 · 산염기 · 중화적정 · 가수분해 · 완충 · 실험 필기 적용.', cards: chemistryCards, writtenQuestions: chemistryWritten },
      ] },
    ] },
  ],
};
function appendPractice(group: SubjectGroup): void {
  for (const node of group.children) {
    if (node.kind === 'group') appendPractice(node);
    else {
      if (studyPractice[node.id]) node.writtenQuestions = [...(node.writtenQuestions ?? []), ...studyPractice[node.id]];
      if (sciencePractice[node.id]) node.cards = [...node.cards, ...sciencePractice[node.id]];
      if (node.id === 'astronomy-hwang') node.writtenQuestions = [...(node.writtenQuestions ?? []), ...hwangExam];
    }
  }
}
appendPractice(subjectMenu);
const flatten = (group: SubjectGroup): SubjectDeck[] => group.children.flatMap(node => node.kind === 'group' ? flatten(node) : [node]);
export const subjectDecks = flatten(subjectMenu);
