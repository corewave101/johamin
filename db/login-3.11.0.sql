-- 3.11.0 학교 계정 로그인. 두 단계로 나눠서 적용한다.
--
-- 1단계(이미 적용됨, 2026-10-19): 허용 목록과 is_member(). 기존 카드 권한은 그대로라 배포 전에 넣어도 안전하다.
-- 2단계(이 PR이 main에 합쳐져 배포된 뒤에 적용): 카드·덱 읽기를 허용된 로그인 사용자로 제한한다.
--   배포 전에 2단계를 넣으면 지금 사이트(로그인 없음)가 DB 카드를 못 읽는다.
--
-- 반 추가·변경은 코드 배포 없이 대시보드 Table Editor에서 member_rules 행만 바꾸면 된다.
--   예) 1학년 2반: pattern = '26102__@bsis.hs.kr'   ('_'는 아무 글자 하나)
--   예) 1학년 전체: pattern = '261____@bsis.hs.kr'
-- 편집자(public.editors)는 규칙과 상관없이 항상 통과한다.

-- ─── 1단계 ───────────────────────────────────────────────────────────────
create table if not exists public.member_rules (
  pattern    text primary key,               -- LIKE pattern on the login email ('_' = any one character)
  note       text not null default '',
  created_at timestamptz not null default now()
);
alter table public.member_rules enable row level security;
-- No policies: only the Supabase dashboard (which bypasses RLS) can read or change the list.

insert into public.member_rules (pattern, note)
values ('26101__@bsis.hs.kr', '1학년 1반 (로그인 테스트)')
on conflict (pattern) do nothing;

-- Editors always pass. Everyone else must sign in with Google and match a rule.
-- (user_metadata는 사용자가 직접 바꿀 수 있어서 쓰지 않는다. 토큰의 email과 app_metadata.provider만 본다.)
create or replace function public.is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_editor() or (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'provider', '') = 'google'
    and exists (select 1 from public.member_rules r where lower(auth.jwt() ->> 'email') like r.pattern)
  );
$$;
revoke execute on function public.is_member() from public, anon;
grant execute on function public.is_member() to authenticated;

-- ─── 2단계 (배포 후) ─────────────────────────────────────────────────────
-- drop policy if exists "cards readable" on public.cards;
-- drop policy if exists "decks readable" on public.decks;
-- create policy "cards for members" on public.cards for select to authenticated using ((select public.is_member()));
-- create policy "decks for members" on public.decks for select to authenticated using ((select public.is_member()));
--
-- 되돌리기(로그인 없이 다시 공개):
-- create policy "cards readable" on public.cards for select using (true);
-- create policy "decks readable" on public.decks for select using (true);
