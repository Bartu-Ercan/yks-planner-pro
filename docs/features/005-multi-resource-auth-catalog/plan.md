# Çoklu Kaynak, Giriş Kurulumu ve Katalog Genişletme Plan

## Veri

- `gorev_kaynaklari` bağ tablosu için non-destructive migration eklenecek.
- `gorevler.kaynak_id` korunacak ve yeni tabloya backfill yapılacak.
- Misafir görevleri `kaynak_ids` dizisini doğrudan localStorage içinde saklayacak.

## Uygulama

- Görev ekleme formu ve görev detay modalı çoklu kaynak seçimini destekleyecek.
- Ders değiştiğinde seçili kaynaklar yeni derse uygun olmayan kaynaklardan temizlenecek.
- Günlük `Hazırlık` alanı görevlerdeki `kaynak_ids` üzerinden hesaplanacak.
- Setup wizard giriş yapan kullanıcıda ana ekrandan önce açılacak.
- Tutorial hedefli tooltip sisteminde kalacak, geri kontrolü eklenecek.
- Header email göstermeyecek; auth ve ayarlar sağda kalacak.
- Ayarlar içinde `Hesap` sekmesi eklenecek.

## Auth

- Supabase OAuth çağrıları `google`, `apple`, `facebook`, `azure` provider değerleriyle başlatılacak.
- Facebook için email scope istenecek.
- Email/şifre kayıt formunda güçlü şifre kontrolü yapılacak.

## Katalog

- Kaynaklar repo-native TypeScript katalogunda kalacak.
- Dış kaynaklardan kapak ve ürün URL referansları alınacak, asset kopyalanmayacak.
- Katalog sıralaması `populerlik`, yayınevi önceliği ve ada göre yapılacak.
- YKS dışı başlıklar filtrelenecek.

## Doğrulama

- `npm run lint`
- `npm run build`
- Çoklu kaynaklı görev oluşturma ve detaydan düzenleme manuel kontrolü.
- Günlük hazırlık alanının sadece atanmış kaynakları göstermesi manuel kontrolü.
