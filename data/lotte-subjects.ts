import { lotteCards } from './lotte-cards';
import type { SubjectGroup } from './swipe-subjects';

// 롯데 자이언츠 페이지(/johamin/lotte/, 4.6.0~). 4.8.0부터 롯데 문제 500여 개(찐팬 150여 개 포함, data/lotte-cards.ts).
// 처음 화면 ↑는 이동 메뉴 자리라 비워 둔다. 덱 id는 다른 메뉴와 겹치지 않게 'lotte-'로 시작한다.
export const lotteMenu: SubjectGroup = {
  id: 'root', kind: 'group', name: '롯데', direction: 'up', symbol: '⚾', description: '롯데 자이언츠 문제.',
  children: [
    { id: 'lotte-giants', kind: 'deck', name: '롯데 자이언츠', fullName: '롯데 자이언츠', direction: 'left', symbol: '⚾', description: '우승의 해 · 가을야구 · 레전드 · 기록실 · 감독 · 사직과 응원 · 최근 롯데 · 찐팬 문제.', cards: lotteCards },
  ],
};
