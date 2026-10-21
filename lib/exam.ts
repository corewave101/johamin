// 시험 시즌. 처음 화면(/johamin/)은 지금 시험(기말고사), /johamin/midterm/은 지난 중간고사 보관함이다.
// 두 주소는 같은 앱이고, 주소로 어느 메뉴를 보여 줄지만 정한다. 풀이 기록은 카드 id로 저장되니 그대로 이어진다.

// The site root from <base href> (vite.config.ts adds it): '/johamin/' on GitHub Pages, '/' locally.
// Read from the page, not import.meta, so the tests can load this file too (no page there: '/').
const page = typeof document === 'undefined' ? null : document;
const BASE = page ? new URL(page.baseURI).pathname : '/';

/** 중간고사 보관함 주소. */
export const MIDTERM_URL = `${BASE}midterm/`;
/** 처음 화면(기말고사) 주소. */
export const HOME_URL = BASE;

/** True on /johamin/midterm (with or without the last slash). */
export const isMidterm = page ? /\/midterm\/?$/.test(page.location.pathname) : false;

if (isMidterm && page) page.title = '조하민레츠고 · 중간고사';
