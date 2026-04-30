# Kaynak Kitap Sistemi v1 Plan

## Yaklaşım

Katalog verisi repo-native bir TypeScript modülünde tutulur. Supabase tarafı için tablolar hazırlanır; misafir kullanımda `localStorage` ana akış olarak çalışır. Mevcut günlük odak ve haftalık planner tek sayfa yapısı korunur.

## Veri

- `lib/kaynak-katalogu.ts`: Kitapİşler ürün URL ve kapak URL bilgileriyle başlangıç katalogu.
- `yks-kullanici-kaynaklari`: Misafir kullanıcının seçtiği kaynak id listesi.
- `yks-son-kaynak-secimi`: Ders bazlı son kaynak seçimi.
- `yks-onboarding-tamam`: Başlangıç rehberi tamamlandı bilgisi.

## UI

- Header içine kompakt `Kaynaklarım` aksiyonu.
- Katalog modalında TYT/AYT segmenti, ders ve yayınevi filtreleri.
- Görev ekleme formunda kompakt kaynak seçici.
- Günlük hazırlık alanında bağlı kaynak listesi veya kapak grid görünümü.
- Ayarlar > Kaynak içinde rehberi tekrar açma aksiyonu.

## Supabase

- `gorevler.kaynak_id` opsiyonel kaynak bağı.
- `kaynak_katalogu` genel katalog tablosu.
- `kullanici_kaynaklari` kullanıcı seçili kaynakları.
- `kullanici_tercihleri` onboarding ve son kaynak seçimi.
