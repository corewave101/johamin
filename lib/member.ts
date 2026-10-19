// 로그인 통과 여부를 이 기기에 기억해 둔 값. 인터넷이 없을 때만 쓴다.
// 진짜 판정은 DB의 is_member()가 한다(db/login-3.11.0.sql). 이 값은 오프라인 공부를 막지 않으려는 편의일 뿐이다.
export const MEMBER_KEY = 'johamin-member-v1';
export const SCHOOL_DOMAIN = 'bsis.hs.kr';

export interface MemberMark { userId: string; email: string; ok: boolean; at: number }

export function readMark(): MemberMark | null {
  try {
    const raw = localStorage.getItem(MEMBER_KEY);
    const mark = raw ? JSON.parse(raw) as MemberMark : null;
    return mark && typeof mark.userId === 'string' && typeof mark.ok === 'boolean' ? mark : null;
  } catch { return null; }
}
export function saveMark(mark: MemberMark) {
  try { localStorage.setItem(MEMBER_KEY, JSON.stringify(mark)); } catch { /* storage may be unavailable */ }
}
export function clearMark() {
  try { localStorage.removeItem(MEMBER_KEY); } catch { /* storage may be unavailable */ }
}

/** 2610112@bsis.hs.kr → 2610112 (학교 계정만 줄여서 보여 준다). */
export const shortEmail = (email: string) => email.toLowerCase().endsWith(`@${SCHOOL_DOMAIN}`) ? email.split('@')[0] : email;

const ERROR_KEYS = ['error', 'error_code', 'error_description'];
/**
 * 구글·Supabase가 로그인 실패를 주소에 붙여 돌려보낼 때(?error=… 또는 #error=…), 그 문구를 꺼내고 주소에서 지운다.
 */
export function takeAuthError(href: string): { message: string | null; clean: string } {
  const url = new URL(href);
  const hash = new URLSearchParams(url.hash.replace(/^#/, ''));
  const pick = (key: string) => url.searchParams.get(key) ?? hash.get(key);
  const code = pick('error');
  const description = pick('error_description');
  if (!code && !description) return { message: null, clean: href };
  for (const key of ERROR_KEYS) { url.searchParams.delete(key); hash.delete(key); }
  const rest = hash.toString();
  url.hash = rest ? `#${rest}` : '';
  const message = code === 'access_denied' ? '로그인을 취소했거나 학교에서 막았어요.' : (description ?? code ?? '').replace(/\+/g, ' ');
  return { message, clean: url.toString() };
}
