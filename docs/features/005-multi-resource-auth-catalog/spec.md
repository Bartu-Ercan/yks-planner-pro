# Çoklu Kaynak, Giriş Kurulumu ve Katalog Genişletme Spec

## Amaç

YKS Planner Pro içinde kaynak sistemi tekil görev-kaynak bağından çoklu bağ yapısına geçirilir. Yeni kullanıcı önce temel tercihlerini seçer, ardından ana planner içinde hedefli tutorial ile yönlendirilir. Auth ekranı sosyal giriş seçeneklerine hazır hale gelir. Kaynak kataloğu YKS kapsamındaki popüler yayınlarla genişletilir.

## Kapsam

- Bir görev birden fazla kaynakla ilişkilendirilebilir.
- Günlük `Hazırlık` alanı sadece o günün görevlerine atanmış kaynakları gösterir.
- Giriş yapan yeni kullanıcı ana ekrana gelmeden önce tema, kaynak ve kaynak görünümü kurulumundan geçer.
- Misafir kullanıcı planner'a girince tutorial görür.
- Tutorial `geri`, `ileri`, `bitir` kontrolleriyle çalışır.
- Auth ekranında email/şifre yanında Google, Apple, Facebook ve Microsoft seçenekleri bulunur.
- Şifre kayıt formu en az 8 karakter, harf, rakam, büyük ve küçük harf şartlarını client tarafında kontrol eder.
- Ayarlar içinde `Hesap` sekmesi bulunur.
- Kaynak katalogu 3D, 345, Apotemi, Bilgi Sarmal, Orijinal, Barış, Paraf, Palme, Karekök, Limit ve Acil ağırlıklı YKS kaynaklarıyla genişletilir.

## Kapsam Dışı

- Vercel deploy.
- Supabase OAuth provider secret'larını kodda tutmak.
- Canlı Supabase SQL migration'ını onaysız çalıştırmak.
- Kaynak görsellerini repo içine indirmek.
- Kaynakları kullanıcı hesabına otomatik migrate eden ayrı bir onboarding sonrası veri taşıma akışı.

## Kabul Kriterleri

- Kaynaklı ve kaynaksız görev ekleme çalışır.
- Görev detayında kaynak ekleme ve çıkarma yapılabilir.
- Günlük hazırlık alanı aynı dersten seçilmiş tüm kaynakları değil, sadece göreve atanmış kaynakları gösterir.
- Eski `kaynak_id` verisi yeni `gorev_kaynaklari` akışında geriye uyumlu okunur.
- Auth gate email/şifre, sosyal giriş ve misafir akışlarını sade şekilde sunar.
- Katalogda YKS dışı KPSS, DGS, ALES, LGS ve sınıf kitapları filtrelenir.
