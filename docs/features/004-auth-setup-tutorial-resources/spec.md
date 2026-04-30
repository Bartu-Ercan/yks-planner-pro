# Giriş Kurulumu, Tutorial ve Kaynak Kataloğu Spec

## Amaç

Giriş öncesi sade auth yüzeyi, giriş sonrası kurulum seçimleri, ana ekranda hedefli tutorial ve geniş kontrollü kaynak kataloğu ile ilk kullanım deneyimini güçlendirmek.

## Kapsam

- Logged-out kullanıcı auth gate görür.
- Misafir kullanıcı planner'a girebilir ve tutorial görür.
- Giriş/kayıt yapan kullanıcı ana ekrandan önce setup wizard görür.
- Tutorial ana ekranda hedef elementlere bağlı görünür.
- Header sol/sağ aksiyon gruplarına ayrılır; email kaldırılır.
- Kaynak kataloğu popülerlik ve `Tümü` filtresiyle büyütülür.
- `gorevler.kaynak_id` için non-destructive Supabase migration hazırlanır.

## Kapsam Dışı

- Google/OAuth provider entegrasyonu.
- Vercel deploy.
- Tam otomatik Kitapİşler import sistemi.
- `supabase-schema.sql` dosyasını canlı DB'de çalıştırmak.
