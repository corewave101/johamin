import type { SubjectGroup } from './swipe-subjects';

// 롯데 자이언츠 페이지(/johamin/lotte/, 4.6.0~). 문제는 아직 비어 있다(준비 중 덱).
// 처음 화면 ↑는 이동 메뉴 자리라 비워 둔다. 덱 id는 다른 메뉴와 겹치지 않게 'lotte-'로 시작한다.
export const lotteMenu: SubjectGroup = {
  id: 'root', kind: 'group', name: '롯데', direction: 'up', symbol: '⚾', description: '롯데 자이언츠 문제를 준비하고 있어요.',
  children: [
    { id: 'lotte-giants', kind: 'deck', name: '롯데 자이언츠', fullName: '롯데 자이언츠', direction: 'left', symbol: '⚾', description: '롯데 자이언츠 문제를 준비하고 있어요.', cards: [] },
  ],
};
