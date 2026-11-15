-- 6.1.0 피직스 캐슬 랭킹. 로그인한 학교 계정(is_member())만 기록을 올리고 순위를 본다.
-- 저장하는 것: 계정 id(누구 기록인지 덮어쓰기용), 학생이 직접 정한 별명, 기록 3개, 고친 시각. 이메일 · 이름은 저장하지 않는다.
-- 순위표에는 별명과 기록만 나온다(계정 id는 밖으로 안 나간다). 표에는 RLS 정책이 없어서 아래 함수로만 읽고 쓴다.
-- 지우기: 학생은 게임 설정 → 랭킹 → 내 기록 지우기(castle_forget). 편집자는 대시보드 Table Editor → castle_scores에서 행 삭제
--   (이상한 별명 · 말이 안 되는 기록). 계정 자체를 막으려면 member_blocks.
-- 기록은 기기에서 계산해 올리는 값이라 마음먹으면 꾸밀 수 있다. 그래서 상한 · 자주 올리기 제한만 둔다(아래 숫자).

create table if not exists public.castle_scores (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  nickname   text not null check (char_length(nickname) between 1 and 10),
  wave       integer not null default 0 check (wave between 0 and 999),            -- 최고 방어 밤
  dps        numeric(9, 1) not null default 0 check (dps between 0 and 99999),      -- 최고 초당 데미지
  sortie     integer not null default 0 check (sortie between 0 and 999999),       -- 토벌 최고 수확(G)
  updated_at timestamptz not null default now()
);
alter table public.castle_scores enable row level security;
-- No policies: read and write only through the security definer functions below.

-- 기록 올리기: 더 좋은 값만 남긴다(내려가지 않음). 별명은 언제든 바꿀 수 있다. 10초에 한 번까지.
create or replace function public.castle_submit(p_nickname text, p_wave integer, p_dps numeric, p_sortie integer)
returns jsonb
language plpgsql volatile security definer set search_path = public as $$
declare
  uid  uuid := auth.uid();
  nick text := btrim(regexp_replace(coalesce(p_nickname, ''), '[[:cntrl:]]', '', 'g'));
  last timestamptz;
begin
  if uid is null or not public.is_member() then return jsonb_build_object('ok', false, 'why', 'member'); end if;
  if char_length(nick) < 1 or char_length(nick) > 10 then return jsonb_build_object('ok', false, 'why', 'nickname'); end if;
  select updated_at into last from public.castle_scores where user_id = uid;
  if last is not null and last > now() - interval '10 seconds' then return jsonb_build_object('ok', false, 'why', 'wait'); end if;
  insert into public.castle_scores as s (user_id, nickname, wave, dps, sortie, updated_at)
  values (uid, nick,
          least(greatest(coalesce(p_wave, 0), 0), 999),
          least(greatest(round(coalesce(p_dps, 0), 1), 0), 99999),
          least(greatest(coalesce(p_sortie, 0), 0), 999999),
          now())
  on conflict (user_id) do update set
    nickname   = excluded.nickname,
    wave       = greatest(s.wave, excluded.wave),
    dps        = greatest(s.dps, excluded.dps),
    sortie     = greatest(s.sortie, excluded.sortie),
    updated_at = now();
  return jsonb_build_object('ok', true);
end;
$$;

-- 순위표: 기록 하나(wave · dps · sortie)로 위에서 p_limit명 + 내 줄(순위 밖이어도). 0점은 안 나온다.
create or replace function public.castle_board(p_metric text, p_limit integer default 20)
returns table (rank bigint, nickname text, score numeric, mine boolean)
language plpgsql stable security definer set search_path = public as $$
declare uid uuid := auth.uid();
begin
  if uid is null or not public.is_member() then return; end if;
  if p_metric not in ('wave', 'dps', 'sortie') then return; end if;
  return query
  with ranked as (
    select s.user_id, s.nickname,
           (case p_metric when 'wave' then s.wave::numeric when 'dps' then s.dps else s.sortie::numeric end) as v,
           s.updated_at
    from public.castle_scores s
  ), ordered as (
    select r.user_id, r.nickname, r.v, rank() over (order by r.v desc) as rk,
           row_number() over (order by r.v desc, r.updated_at asc) as rn
    from ranked r where r.v > 0
  )
  select o.rk, o.nickname, o.v, o.user_id = uid
  from ordered o
  where o.rn <= least(greatest(coalesce(p_limit, 20), 1), 50) or o.user_id = uid
  order by o.rn;
end;
$$;

-- 내 기록과 별명 지우기(순위표에서 빠진다).
create or replace function public.castle_forget() returns void
language sql volatile security definer set search_path = public as $$
  delete from public.castle_scores where user_id = auth.uid();
$$;

-- 내 별명 · 기록(다른 기기에서 이어 볼 때).
create or replace function public.castle_me() returns jsonb
language sql stable security definer set search_path = public as $$
  select to_jsonb(s) - 'user_id' from public.castle_scores s where s.user_id = auth.uid() and public.is_member();
$$;

revoke execute on function public.castle_submit(text, integer, numeric, integer) from public, anon;
revoke execute on function public.castle_board(text, integer) from public, anon;
revoke execute on function public.castle_forget() from public, anon;
revoke execute on function public.castle_me() from public, anon;
grant execute on function public.castle_submit(text, integer, numeric, integer) to authenticated;
grant execute on function public.castle_board(text, integer) to authenticated;
grant execute on function public.castle_forget() to authenticated;
grant execute on function public.castle_me() to authenticated;
