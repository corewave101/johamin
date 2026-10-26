// 메인 화면 표시: 과목 메뉴 첫 화면(이동 메뉴 · 과목 · 문제 풀이 중이 아님)이나 정보 문제 목록에 있을 때만 <html>에 at-home을 붙인다.
// 구석의 롯데 로고(LottePeek)는 이때만 보인다(components/swipe/lotte.css).
import { useEffect } from 'react';

export const HOME_CLASS = 'at-home';

export function useHomeScreen(atHome: boolean) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle(HOME_CLASS, atHome);
    return () => root.classList.remove(HOME_CLASS);
  }, [atHome]);
}
