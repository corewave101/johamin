// 시험 시즌. 처음 화면(/johamin/)은 지금 시험(기말고사), /johamin/midterm/은 지난 중간고사 보관함,
// /johamin/elice/는 정보(엘리스 코딩 수행평가) 대비 페이지, /johamin/lotte/는 롯데 자이언츠 페이지(원중이레츠고)다.
// 네 주소는 같은 앱이고, 주소로 어느 메뉴를 보여 줄지만 정한다. 풀이 기록은 카드 id로 저장되니 그대로 이어진다.

// The site root from <base href> (vite.config.ts adds it): '/johamin/' on GitHub Pages, '/' locally.
// Read from the page, not import.meta, so the tests can load this file too (no page there: '/').
const page = typeof document === 'undefined' ? null : document;
const BASE = page ? new URL(page.baseURI).pathname : '/';

/** 중간고사 보관함 주소. */
export const MIDTERM_URL = `${BASE}midterm/`;
/** 정보(엘리스 수행) 대비 주소. */
export const ELICE_URL = `${BASE}elice/`;
/** 롯데 자이언츠 페이지 주소(4.6.0~, 원중이레츠고). */
export const LOTTE_URL = `${BASE}lotte/`;
/** 처음 화면(기말고사) 주소. */
export const HOME_URL = BASE;

/** True on /johamin/midterm (with or without the last slash). */
export const isMidterm = page ? /\/midterm\/?$/.test(page.location.pathname) : false;
/** True on /johamin/elice (with or without the last slash). */
export const isElice = page ? /\/elice\/?$/.test(page.location.pathname) : false;
/** True on /johamin/lotte (with or without the last slash). */
export const isLotte = page ? /\/lotte\/?$/.test(page.location.pathname) : false;
export type ExamPage = 'final' | 'midterm' | 'elice' | 'lotte';
export const examPage: ExamPage = isLotte ? 'lotte' : isElice ? 'elice' : isMidterm ? 'midterm' : 'final';
/** 페이지마다 첫 화면 주소(로그인하고 돌아올 곳). */
export const PAGE_URL: Record<ExamPage, string> = { final: HOME_URL, midterm: MIDTERM_URL, elice: ELICE_URL, lotte: LOTTE_URL };
/** 상단 글자: 롯데 페이지는 원중이레츠고. */
export const BRAND = isLotte ? { first: '원중이', rest: '레츠고' } : { first: '조하민', rest: '레츠고' };

type NavTarget = { page: ExamPage; direction: 'up' | 'left' | 'right'; label: string; note: string; href: string };
/** 이동 메뉴: 기말 · 중간 · 정보는 어느 페이지에서나 같은 자리(↑ 기말고사, ← 중간고사, → 정보). */
export const NAV_TARGETS: NavTarget[] = [
  { page: 'final', direction: 'up', label: '기말고사', note: '처음 화면', href: HOME_URL },
  { page: 'midterm', direction: 'left', label: '중간고사', note: '지난 카드 보관함', href: MIDTERM_URL },
  { page: 'elice', direction: 'right', label: '정보', note: '엘리스 수행 대비', href: ELICE_URL },
];
/** 롯데는 지금 페이지가 비운 자리에 들어간다(롯데 페이지에서는 세 곳이 그대로). */
export const LOTTE_TARGET: Omit<NavTarget, 'direction'> = { page: 'lotte', label: '롯데', note: '원중이레츠고', href: LOTTE_URL };
export const navTargets = (from: ExamPage = examPage): NavTarget[] => {
  const others = NAV_TARGETS.filter(target => target.page !== from);
  const empty = NAV_TARGETS.find(target => target.page === from);
  return empty ? [...others, { ...LOTTE_TARGET, direction: empty.direction }] : others;
};

if (isMidterm && page) page.title = '조하민레츠고 · 중간고사';
if (isElice && page) page.title = '조하민레츠고 · 정보';
if (isLotte && page) page.title = '원중이레츠고 · 롯데';
if (page) page.documentElement.dataset.page = examPage;
