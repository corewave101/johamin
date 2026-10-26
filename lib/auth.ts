// 학교 구글 계정 로그인. 누가 들어올 수 있는지는 DB(public.member_rules + is_member())가 정한다.
// 공개 키만 쓴다. 로그인 정보는 이 기기 localStorage('johamin-auth-v1')에만 저장된다.
import { AuthClient, type Session } from '@supabase/auth-js';
import { clearCachedRows } from './card-store';
import { clearMark, readMark, saveMark, SCHOOL_DOMAIN, takeAuthError } from './member';
import { ELICE_URL, HOME_URL, isElice, isMidterm, MIDTERM_URL } from './exam';
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './supabase-config';

// 로그인은 항상 처음 화면 주소로 돌아온다(Supabase에 등록된 주소). 중간고사 보관함에서 눌렀으면 끝난 뒤 그리로 다시 보낸다.
const RETURN_KEY = 'johamin-after-login-v1';
function takeReturn(): string | null {
  try { const path = sessionStorage.getItem(RETURN_KEY); sessionStorage.removeItem(RETURN_KEY); return path; } catch { return null; }
}

export const auth = new AuthClient({
  url: `${SUPABASE_URL}/auth/v1`,
  headers: { apikey: SUPABASE_PUBLISHABLE_KEY },
  storageKey: 'johamin-auth-v1',
  flowType: 'pkce',
  persistSession: true,
  autoRefreshToken: true,
  detectSessionInUrl: true,
});

export type Access =
  | { state: 'checking' }
  | { state: 'signed-out'; message?: string }
  | { state: 'denied'; email: string }
  | { state: 'error'; email: string }
  | { state: 'ok'; email: string; offline?: boolean };

/** The signed-in user's token for database requests, or null when signed out. */
export async function accessToken(): Promise<string | null> {
  try { const { data } = await auth.getSession(); return data.session?.access_token ?? null; } catch { return null; }
}

async function askMember(session: Session): Promise<boolean> {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_member`, {
    method: 'POST',
    headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
    body: '{}',
  });
  if (!response.ok) throw new Error(`is_member ${response.status}`);
  return (await response.json()) === true;
}

/** Finishes a login that just came back from Google (if any), then asks the database whether this account may enter. */
export async function checkAccess(): Promise<Access> {
  const returnTo = takeReturn();
  const urlError = takeAuthError(window.location.href);
  if (urlError.message) window.history.replaceState(window.history.state, '', urlError.clean);
  const { error: initError } = await auth.initialize();
  let session: Session | null = null;
  try { session = (await auth.getSession()).data.session; } catch { /* treated as signed out */ }
  if (!session) {
    // No internet and no usable token: a pass remembered on this device still opens the saved cards.
    const mark = readMark();
    if (!navigator.onLine && mark?.ok) return { state: 'ok', email: mark.email, offline: true };
    return { state: 'signed-out', message: urlError.message ?? (initError ? '로그인이 끝나지 않았어요. 한 번 더 눌러 주세요.' : undefined) };
  }
  const email = session.user.email ?? '';
  try {
    const ok = await askMember(session);
    saveMark({ userId: session.user.id, email, ok, at: Date.now() });
    // 명단에서 빠졌거나 차단된 계정: 이 기기에 저장해 둔 카드 사본도 지운다(오프라인으로 계속 보지 못하게).
    // 통과 기록은 위에서 ok=false로 바뀌어 오프라인 통과도 막힌다. 풀이 기록(progress)은 건드리지 않는다.
    if (!ok) clearCachedRows();
    if (ok && ((returnTo === MIDTERM_URL && !isMidterm) || (returnTo === ELICE_URL && !isElice))) { window.location.replace(returnTo); return { state: 'checking' }; }
    return ok ? { state: 'ok', email } : { state: 'denied', email };
  } catch {
    const mark = readMark();
    if (mark?.ok && mark.userId === session.user.id) return { state: 'ok', email, offline: true };
    return { state: 'error', email };
  }
}

export async function signIn() {
  if (isMidterm || isElice) try { sessionStorage.setItem(RETURN_KEY, isElice ? ELICE_URL : MIDTERM_URL); } catch { /* stays on the first screen after login */ }
  const { error } = await auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}${HOME_URL}`,
      // hd: 계정 고르는 화면에 학교 계정을 먼저 보여 준다(통과 판정은 DB가 한다).
      queryParams: { prompt: 'select_account', hd: SCHOOL_DOMAIN },
    },
  });
  if (error) throw error;
}

export async function signOut() {
  try { await auth.signOut({ scope: 'local' }); } catch { /* the local copy is removed either way */ }
  clearMark();
  window.dispatchEvent(new Event('johamin:auth'));
}
