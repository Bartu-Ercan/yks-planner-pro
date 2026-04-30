# Data Model

## `gorevler`

YKS çalışma görevlerini tutan ana tablodur.

| Alan | Tip | Açıklama |
| --- | --- | --- |
| `id` | UUID | Görev kimliği. Varsayılan `gen_random_uuid()`. |
| `user_id` | UUID | Supabase `auth.users(id)` referansı. |
| `ders` | VARCHAR(50) | Ders adı. |
| `konu` | TEXT | Görev veya konu açıklaması. |
| `gun` | INTEGER | Haftanın günü. Pazartesi `0`, Pazar `6`. |
| `hafta` | VARCHAR(20) | İlgili haftanın pazartesi tarih id'si. Örnek: `2026-04-27`. |
| `tamam` | BOOLEAN | Görev tamamlandı durumu. |
| `gercek_sure` | INTEGER | Tamamlanan görev için dakika cinsinden süre. |
| `created_at` | TIMESTAMPTZ | Oluşturulma zamanı. |

## İndeksler

- `idx_gorevler_user_id`
- `idx_gorevler_hafta`
- `idx_gorevler_gun`

## RLS

RLS açıktır. Kullanıcı sadece kendi görevlerini seçebilir, ekleyebilir, güncelleyebilir ve silebilir.

Politika temeli:

```sql
auth.uid() = user_id
```

## Takvim Modeli

- `gun`, haftanın gün indeksidir.
- `hafta`, o günün ait olduğu pazartesi tarihidir.
- Görev yerleşiminde iki alan birlikte kullanılır.
- Sadece `gun` ile filtreleme hatalıdır; farklı haftalardaki aynı günler çakışır.

## Misafir Veri Modeli

Giriş yapmamış kullanıcının görevleri `localStorage` içinde `yks-gorevler` anahtarıyla saklanır. Kullanıcı giriş yaptığında bu görevler Supabase'e taşınabilir.

## `gunluk_notlar`

Günlük odak görünümünde yazılan güne bağlı notları tutar.

| Alan | Tip | Açıklama |
| --- | --- | --- |
| `id` | UUID | Not kimliği. Varsayılan `gen_random_uuid()`. |
| `user_id` | UUID | Supabase `auth.users(id)` referansı. |
| `tarih` | VARCHAR(20) | Notun ait olduğu gün. Format: `YYYY-MM-DD`. |
| `icerik` | TEXT | Not metni. |
| `created_at` | TIMESTAMPTZ | Oluşturulma zamanı. |

İndeksler:

- `idx_gunluk_notlar_user_id`
- `idx_gunluk_notlar_tarih`

RLS açıktır. Kullanıcı sadece kendi günlük notlarını seçebilir, ekleyebilir, güncelleyebilir ve silebilir.

Misafir notları `localStorage` içinde `yks-gunluk-notlar` anahtarıyla saklanır.

## Kaynak Görünümü Tercihi

Kaynak hazırlık alanının metin veya görsel modda görünmesi `localStorage` içinde `yks-kaynak-gorunumu` anahtarıyla saklanır.

Geçerli değerler:

- `text`
- `visual`
