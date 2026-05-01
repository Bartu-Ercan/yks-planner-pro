alter table public.gorevler
  add column if not exists kaynak_id varchar(80);

create index if not exists idx_gorevler_kaynak_id
  on public.gorevler(kaynak_id);

create table if not exists public.gorev_kaynaklari (
  gorev_id uuid not null references public.gorevler(id) on delete cascade,
  kaynak_id varchar(80) not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (gorev_id, kaynak_id)
);

create index if not exists idx_gorev_kaynaklari_user_id
  on public.gorev_kaynaklari(user_id);

create index if not exists idx_gorev_kaynaklari_kaynak_id
  on public.gorev_kaynaklari(kaynak_id);

alter table public.gorev_kaynaklari enable row level security;

drop policy if exists "users_select" on public.gorev_kaynaklari;
create policy "users_select" on public.gorev_kaynaklari
  for select using (auth.uid() = user_id);

drop policy if exists "users_insert" on public.gorev_kaynaklari;
create policy "users_insert" on public.gorev_kaynaklari
  for insert with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.gorevler
      where gorevler.id = gorev_kaynaklari.gorev_id
      and gorevler.user_id = auth.uid()
    )
  );

drop policy if exists "users_delete" on public.gorev_kaynaklari;
create policy "users_delete" on public.gorev_kaynaklari
  for delete using (auth.uid() = user_id);

insert into public.gorev_kaynaklari (gorev_id, kaynak_id, user_id)
select id, kaynak_id, user_id
from public.gorevler
where kaynak_id is not null
and user_id is not null
on conflict (gorev_id, kaynak_id) do nothing;

notify pgrst, 'reload schema';
