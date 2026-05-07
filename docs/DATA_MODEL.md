# Data Model

## `gorevler`

YKS çalışma görevlerini tutan ana tablodur.

| Alan | Tip | Açıklama |
| --- | --- | --- |
| `id` | UUID | Görev kimliği. Varsayılan `gen_random_uuid()`. |
| `user_id` | UUID | Supabase `auth.users(id)` referansı. |
| `ders` | VARCHAR(50) | Ders adı. |
| `konu` | TEXT | Görev veya konu açıklaması. |
| `kaynak_id` | VARCHAR(80) | Eski tekil kaynak bağı. Çoklu kaynak sisteminde ilk seçili kaynak uyumluluk için burada tutulur. |
| `gun` | INTEGER | Haftanın günü. Pazartesi `0`, Pazar `6`. |
| `hafta` | VARCHAR(20) | İlgili haftanın pazartesi tarih id'si. Örnek: `2026-04-27`. |
| `sira` | INTEGER | Gün içi görev sırası. Aktif görevler bu alanla sıralanır. |
| `tamam` | BOOLEAN | Görev tamamlandı durumu. |
| `gercek_sure` | INTEGER | Tamamlanan görev için dakika cinsinden süre. |
| `created_at` | TIMESTAMPTZ | Oluşturulma zamanı. |

## İndeksler

- `idx_gorevler_user_id`
- `idx_gorevler_hafta`
- `idx_gorevler_gun`
- `idx_gorevler_kaynak_id`
- `idx_gorevler_user_hafta_gun_sira`

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
- Gün içinde `tamam=false` görevler üstte `sira` değerine göre listelenir.
- `tamam=true` görevler otomatik olarak aktif görevlerin altında kalır.

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

## Görev-Kaynak Bağ Modeli

Çoklu kaynak sisteminde görev ile kitap bağlantıları `gorev_kaynaklari` tablosunda tutulur. Bir görev birden fazla kaynakla ilişkilendirilebilir.

### `gorev_kaynaklari`

| Alan | Tip | Açıklama |
| --- | --- | --- |
| `gorev_id` | UUID | `gorevler(id)` referansı. |
| `kaynak_id` | VARCHAR(80) | Repo içi katalogdaki kaynak kimliği. |
| `user_id` | UUID | Supabase `auth.users(id)` referansı. |
| `created_at` | TIMESTAMPTZ | Bağın oluşturulma zamanı. |

Primary key:

```sql
(gorev_id, kaynak_id)
```

RLS açıktır. Kullanıcı sadece kendi görevlerinin kaynak bağlarını okuyabilir, ekleyebilir ve silebilir. Eski `gorevler.kaynak_id` alanı migration sırasında bu tabloya taşınır ve geriye uyumluluk için korunur.

Misafir görevlerinde çoklu kaynaklar doğrudan `localStorage` görev objesindeki `kaynak_ids` dizisinde tutulur.

## Kaynak Kitap Modeli

Kaynak sistemi v1'de katalog repo içindeki `lib/kaynak-katalogu.ts` dosyasından beslenir. Supabase tarafında aynı veri modeline geçiş için tablolar hazırdır.

### `kaynak_katalogu`

| Alan | Tip | Açıklama |
| --- | --- | --- |
| `id` | VARCHAR(80) | Katalog kaynak kimliği. |
| `sinav` | VARCHAR(10) | `TYT` veya `AYT`. |
| `ders` | VARCHAR(50) | Planner ders adıyla eşleşir. |
| `yayinevi` | TEXT | Yayınevi adı. |
| `ad` | TEXT | Kitap adı. |
| `kapak_url` | TEXT | Kapak görseli URL'si. |
| `urun_url` | TEXT | Kitapİşler ürün URL'si. |
| `populerlik` | INTEGER | Katalog sıralamasında kullanılan öncelik değeri. |

### `kullanici_kaynaklari`

Kullanıcının katalogdan seçtiği kaynakları tutar. Bir kullanıcı aynı kaynağı bir kez seçebilir.

### `kullanici_tercihleri`

Başlangıç rehberi durumu ve ders bazlı son kaynak seçimi gibi küçük kullanıcı tercihlerini tutar.

Misafir kaynak verileri:

- `yks-kullanici-kaynaklari`
- `yks-son-kaynak-secimi`
- `yks-onboarding-tamam`

## Kaynak Görünümü Tercihi

Kaynak hazırlık alanının metin veya görsel modda görünmesi `localStorage` içinde `yks-kaynak-gorunumu` anahtarıyla saklanır.

Geçerli değerler:

- `text`
- `visual`
