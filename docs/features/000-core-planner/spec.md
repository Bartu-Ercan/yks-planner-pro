# Feature Spec: Core Planner

## Goal

YKS öğrencisi, yedi günlük hareketli bir görünümde ders ve konu görevlerini planlar, tamamlar, süre kaydeder ve gerektiğinde günler arasında taşır.

## Users

- YKS'ye hazırlanan öğrenci.
- Giriş yapmadan hızlı plan kurmak isteyen kullanıcı.
- Hesap açarak görevlerini kalıcı saklamak isteyen kullanıcı.

## User Stories

- Kullanıcı olarak bir güne görev eklemek istiyorum; böylece çalışma planımı netleştirebilirim.
- Kullanıcı olarak bir görevi tamamlayıp süre girmek istiyorum; böylece gerçek çalışma süremi takip edebilirim.
- Kullanıcı olarak sağ ve sol oklarla görünümü birer gün kaydırmak istiyorum; böylece planımı kesintisiz takvim akışında görebilirim.
- Kullanıcı olarak görevleri günler arasında taşıyabilmek istiyorum; böylece planımı hızlıca revize edebilirim.
- Kullanıcı olarak giriş yapmadan başlayıp sonra hesapla devam etmek istiyorum; böylece veri kaybetmeden ürünü deneyebilirim.

## Requirements

- Görünüm her zaman yedi gün göstermelidir.
- Navigasyon bir tıklamada bir gün kaymalıdır.
- Görünüm hafta sınırlarını aşabilmelidir.
- Görevler `gun` ve `hafta` eşleşmesine göre görünmelidir.
- Misafir görevleri localStorage içinde saklanmalıdır.
- Giriş yapan kullanıcı görevleri Supabase `gorevler` tablosunda saklanmalıdır.
- Tamamlanan görev için dakika cinsinden gerçek süre kaydedilebilmelidir.

## Acceptance Criteria

- [ ] Sağ ok görünümü tam bir gün ileri taşır.
- [ ] Sol ok görünümü tam bir gün geri taşır.
- [ ] Hafta sınırı geçen görünümde görevler doğru gün kolonunda kalır.
- [ ] Yeni görev doğru `gun` ve `hafta` değerleriyle kaydedilir.
- [ ] Sürüklenen görev hedef günün `gun` ve `hafta` değerlerine taşınır.
- [ ] Giriş yapılmamış kullanım localStorage ile çalışır.
- [ ] Giriş yapılmış kullanım Supabase ile çalışır.

## Out of Scope

- Aylık görünüm.
- Deneme sınavı analizi.
- Abonelik sistemi.
- Yapay zeka önerileri.

## Assumptions

- Haftanın ilk günü pazartesidir.
- `gun` değeri pazartesi `0`, pazar `6` olacak şekilde tutulur.
- `hafta` değeri ilgili haftanın pazartesi tarih id'sidir.
