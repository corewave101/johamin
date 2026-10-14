-- 3.8.0 그림 카드: a card can carry a figure shown in the panel beside it (landscape only).
alter table public.cards add column if not exists figure_src text;
alter table public.cards add column if not exists figure_alt text;
