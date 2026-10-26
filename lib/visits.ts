// 익명 접속 수(4.3.2~): 로그인이 확인된 기기에서 하루(서울 날짜)에 한 번, DB의 날짜별 숫자를 1 올린다.
// 보내는 것은 '오늘 한 번 들어왔다'뿐이다. 계정 · 이메일 · 무엇을 했는지는 보내지도 저장하지도 않는다(db/visits-4.3.2.sql).
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from './supabase-config';

const KEY = 'johamin-visit-day-v1';

/** Today in Seoul as YYYY-MM-DD. */
export const seoulDay = (now = new Date()) => new Date(now.getTime() + 9 * 3600_000).toISOString().slice(0, 10);

export async function countVisit(token: string): Promise<void> {
  const today = seoulDay();
  try { if (localStorage.getItem(KEY) === today) return; } catch { return; }
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/count_visit`, {
      method: 'POST',
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: '{}',
      keepalive: true,
    });
    if (response.ok) localStorage.setItem(KEY, today);
  } catch { /* offline: try again next time */ }
}
