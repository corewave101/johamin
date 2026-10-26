import type { SubjectGroup } from './swipe-subjects';

// 정보(엘리스 코딩 수행평가) 대비 메뉴: /johamin/elice/에서 보인다(lib/exam.ts).
// 처음 화면 ↑는 이동 메뉴 자리라 비워 둔다. 덱 id는 기말 · 중간고사 덱과 겹치지 않게 'info-'로 시작한다.
// 자료가 오면 코딩 연습장(실습)과 카드를 이 덱에 넣는다.
export const eliceMenu: SubjectGroup = {
  id: 'root', kind: 'group', name: '정보', direction: 'up', symbol: '⌘', description: '엘리스 코딩 수행평가를 준비해요.',
  children: [
    { id: 'info-elice', kind: 'deck', name: '정보', fullName: '정보(엘리스 수행)', direction: 'left', symbol: '⌘', description: '엘리스 코딩 수행평가 대비 · 자료가 오면 코딩 연습장과 문제를 넣어요.', cards: [] },
  ],
};
