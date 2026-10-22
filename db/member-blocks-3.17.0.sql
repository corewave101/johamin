-- 3.17.0 차단 명단(블랙리스트). member_rules(허용 명단)에 맞아도 member_blocks에 있으면 들어올 수 없다.
--
-- 쓰는 법: 대시보드 Table Editor → member_blocks에 이메일 한 줄 넣기(예: '2610113@bsis.hs.kr'). 빼면 바로 풀린다.
-- 카드·덱 읽기 규칙이 매번 is_member()를 확인하므로, 넣는 순간 그 계정은 DB 카드를 못 받는다(배포 필요 없음).
-- 편집자(public.editors)는 차단 명단과 상관없이 항상 통과한다.

create table if not exists public.member_blocks (
  email      text primary key check (email = lower(email)),  -- 소문자로 저장
  note       text not null default '',
  created_at timestamptz not null default now()
);
alter table public.member_blocks enable row level security;
-- No policies: only the Supabase dashboard (which bypasses RLS) can read or change the list.

create or replace function public.is_member() returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_editor() or (
    coalesce(auth.jwt() -> 'app_metadata' ->> 'provider', '') = 'google'
    and exists (select 1 from public.member_rules r where lower(auth.jwt() ->> 'email') like r.pattern)
    and not exists (select 1 from public.member_blocks b where b.email = lower(auth.jwt() ->> 'email'))
  );
$$;
revoke execute on function public.is_member() from public, anon;
grant execute on function public.is_member() to authenticated;

-- 되돌리기(차단 명단 없이 3.11.0 판정으로):
-- create or replace function public.is_member() returns boolean language sql stable security definer set search_path = public as $$
--   select public.is_editor() or (
--     coalesce(auth.jwt() -> 'app_metadata' ->> 'provider', '') = 'google'
--     and exists (select 1 from public.member_rules r where lower(auth.jwt() ->> 'email') like r.pattern)
--   );
-- $$;
