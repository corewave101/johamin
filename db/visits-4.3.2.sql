-- 4.3.2 익명 접속 수: 날짜(서울)별 숫자 하나만 센다. 누가 들어왔는지(이메일 · 계정 id · IP)는 저장하지 않는다.
-- 앱은 로그인이 확인된 기기에서 하루에 한 번 count_visit()을 부른다(lib/visits.ts). 같은 날 다시 열면 안 센다.
-- 보는 법: Supabase 대시보드 → Table Editor → daily_visits (day, visits). RLS 정책이 없어서 앱에서는 읽을 수 없다.
create table if not exists public.daily_visits (
  day    date primary key,
  visits integer not null default 0 check (visits >= 0)
);
alter table public.daily_visits enable row level security;

create or replace function public.count_visit() returns void
language plpgsql volatile security definer set search_path = public as $$
begin
  if not public.is_member() then return; end if;
  insert into public.daily_visits (day, visits)
  values ((now() at time zone 'Asia/Seoul')::date, 1)
  on conflict (day) do update set visits = public.daily_visits.visits + 1;
end;
$$;
revoke execute on function public.count_visit() from public, anon;
grant execute on function public.count_visit() to authenticated;
