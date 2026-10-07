-- 조하민레츠고 Supabase schema.
-- Run once in Supabase → SQL Editor, then run db/seed.sql to load the cards.
-- Reading cards needs no login. Cards are edited in the Supabase dashboard (Table Editor), which bypasses RLS.
-- If the app ever gets a login, only emails in public.editors may write through the API.

-- ─── Decks ──────────────────────────────────────────────────────────────
create table if not exists public.decks (
  id          text primary key,                 -- 'social', 'biology-park', ...
  subject     text not null,                    -- '사회', '생물', '행성우주과학'
  name        text not null,                    -- short menu label: '사회', '박상영T', '(전)'
  full_name   text,                             -- deck bar title: '사회(성신제)'
  teacher     text,                             -- '성신제T'
  description text not null default '',
  sort        int  not null default 0
);

-- ─── Cards (one row = one card) ─────────────────────────────────────────
-- kind 'choice':  answer = correct choice, wrong = exactly 3 other choices
-- kind 'written': answer = model answer,  criteria = grading points
create table if not exists public.cards (
  id            text primary key,               -- 'social-042', 'park-written-003'
  deck_id       text not null references public.decks(id) on update cascade,
  kind          text not null default 'choice' check (kind in ('choice', 'written')),
  topic         text not null,
  badge         text,                           -- small label above the question: '박상영T', '영어'
  question      text not null check (char_length(question) between 1 and 200),
  passage       text,                           -- reading passage shown with the question (영어)
  answer        text not null check (char_length(answer) >= 1),
  wrong         text[] not null default '{}',
  criteria      text[] not null default '{}',
  explanation   text not null default '',
  source_label  text not null,                  -- '성신제T · 세계화와 지역화', '박상영T 필기'
  source_page   int,                            -- PDF / note page
  source_slide  int,                            -- slide number (황 deck)
  source_url    text,
  sort          int  not null default 0,        -- order inside the deck
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  updated_by    text,
  constraint choice_shape check (
    kind <> 'choice' or (
      cardinality(wrong) = 3
      and char_length(answer) <= 40
      and answer <> all (wrong)
      and wrong[1] <> wrong[2] and wrong[1] <> wrong[3] and wrong[2] <> wrong[3]
      and char_length(explanation) > 10
    )
  ),
  constraint written_shape check (kind <> 'written' or cardinality(criteria) >= 1)
);
create index if not exists cards_deck_idx on public.cards (deck_id, sort);

-- ─── Editors (emails allowed to change decks and cards) ─────────────────
create table if not exists public.editors (
  email    text primary key,
  added_at timestamptz not null default now()
);

create or replace function public.is_editor() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.editors where email = lower(auth.jwt() ->> 'email'));
$$;

-- ─── Change history (filled automatically) ──────────────────────────────
create table if not exists public.card_history (
  id         bigint generated always as identity primary key,
  card_id    text not null,
  action     text not null,                     -- INSERT / UPDATE / DELETE
  changed_by text,
  changed_at timestamptz not null default now(),
  before     jsonb,
  after      jsonb
);

create or replace function public.stamp_card_update() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  new.updated_by := coalesce(auth.jwt() ->> 'email', 'dashboard');
  return new;
end $$;

create or replace function public.track_card_change() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.card_history (card_id, action, changed_by, before, after)
  values (coalesce(new.id, old.id), tg_op, coalesce(auth.jwt() ->> 'email', 'dashboard'),
          case when tg_op <> 'INSERT' then to_jsonb(old) end,
          case when tg_op <> 'DELETE' then to_jsonb(new) end);
  return null;
end $$;

drop trigger if exists cards_stamp on public.cards;
create trigger cards_stamp before update on public.cards
  for each row execute function public.stamp_card_update();
drop trigger if exists cards_history on public.cards;
create trigger cards_history after insert or update or delete on public.cards
  for each row execute function public.track_card_change();

-- ─── Learner attempts (each user sees only their own) ───────────────────
create table if not exists public.attempts (
  id         bigint generated always as identity primary key,
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  card_id    text not null references public.cards(id) on delete cascade,
  result     text not null check (result in ('correct', 'wrong', 'unknown')),
  created_at timestamptz not null default now()
);
create index if not exists attempts_user_idx on public.attempts (user_id, card_id);

-- ─── Row level security ─────────────────────────────────────────────────
alter table public.decks        enable row level security;
alter table public.cards        enable row level security;
alter table public.editors      enable row level security;
alter table public.card_history enable row level security;
alter table public.attempts     enable row level security;

drop policy if exists "decks readable"   on public.decks;
drop policy if exists "decks editable"   on public.decks;
drop policy if exists "cards readable"   on public.cards;
drop policy if exists "cards editable"   on public.cards;
drop policy if exists "editors see list" on public.editors;
drop policy if exists "history for editors" on public.card_history;
drop policy if exists "own attempts"     on public.attempts;

create policy "decks readable" on public.decks for select using (true);
create policy "decks editable" on public.decks for all using (public.is_editor()) with check (public.is_editor());
create policy "cards readable" on public.cards for select using (true);
create policy "cards editable" on public.cards for all using (public.is_editor()) with check (public.is_editor());
create policy "editors see list" on public.editors for select using (public.is_editor());
create policy "history for editors" on public.card_history for select using (public.is_editor());
create policy "own attempts" on public.attempts for all using (user_id = auth.uid()) with check (user_id = auth.uid());
-- editors itself has no insert/update policy: add or remove editors from the Supabase dashboard only.

-- ─── First editor ───────────────────────────────────────────────────────
insert into public.editors (email) values ('mungga1111@gmail.com') on conflict do nothing;
