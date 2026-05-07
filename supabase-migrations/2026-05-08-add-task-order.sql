alter table public.gorevler
  add column if not exists sira integer;

with sirali as (
  select
    id,
    (row_number() over (
      partition by user_id, hafta, gun, tamam
      order by created_at asc, id asc
    ) * 1000)::integer as yeni_sira
  from public.gorevler
  where sira is null
)
update public.gorevler
set sira = sirali.yeni_sira
from sirali
where public.gorevler.id = sirali.id;

create index if not exists idx_gorevler_user_hafta_gun_sira
  on public.gorevler(user_id, hafta, gun, tamam, sira);

notify pgrst, 'reload schema';
