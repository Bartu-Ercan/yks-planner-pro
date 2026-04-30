alter table public.gorevler
  add column if not exists kaynak_id varchar(80);

create index if not exists idx_gorevler_kaynak_id
  on public.gorevler(kaynak_id);

notify pgrst, 'reload schema';
