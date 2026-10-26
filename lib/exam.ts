// 시험 시즌. 처음 화면(/johamin/)은 지금 시험(기말고사), /johamin/midterm/은 지난 중간고사 보관함,
// /johamin/elice/는 정보(엘리스 코딩 수행평가) 대비 페이지다.
// 세 주소는 같은 앱이고, 주소로 어느 메뉴를 보여 줄지만 정한다. 풀이 기록은 카드 id로 저장되니 그대로 이어진다.

// The site root from <base href> (vite.config.ts adds it): '/johamin/' on GitHub Pages, '/' locally.
// Read from the page, not import.meta, so the tests can load this file too (no page there: '/').
const page = typeof document === 'undefined' ? null : document;
const BASE = page ? new URL(page.baseURI).pathname : '/';

/** 중간고사 보관함 주소. */
export const MIDTERM_URL = `${BASE}midterm/`;
/** 정보(엘리스 수행) 대비 주소. */
export const ELICE_URL = `${BASE}elice/`;
/** 처음 화면(기말고사) 주소. */
export const HOME_URL = BASE;

/** True on /johamin/midterm (with or without the last slash). */
export const isMidterm = page ? /\/midterm\/?$/.test(page.location.pathname) : false;
/** True on /johamin/elice (with or without the last slash). */
export const isElice = page ? /\/elice\/?$/.test(page.location.pathname) : false;
export type ExamPage = 'final' | 'midterm' | 'elice';
export const examPage: ExamPage = isElice ? 'elice' : isMidterm ? 'midterm' : 'final';

/** 이동 메뉴: 방향은 어느 페이지에서나 같다(↑ 기말고사, ← 중간고사, → 정보). 지금 페이지 자리는 비운다. */
export const NAV_TARGETS: { page: ExamPage; direction: 'up' | 'left' | 'right'; label: string; note: string; href: string }[] = [
  { page: 'final', direction: 'up', label: '기말고사', note: '처음 화면', href: HOME_URL },
  { page: 'midterm', direction: 'left', label: '중간고사', note: '지난 카드 보관함', href: MIDTERM_URL },
  { page: 'elice', direction: 'right', label: '정보', note: '엘리스 수행 대비', href: ELICE_URL },
];
export const navTargets = (from: ExamPage = examPage) => NAV_TARGETS.filter(target => target.page !== from);

if (isMidterm && page) page.title = '조하민레츠고 · 중간고사';
if (isElice && page) page.title = '조하민레츠고 · 정보';
