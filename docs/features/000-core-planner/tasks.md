# Tasks: Core Planner

## Current Baseline

- [x] Yedi günlük görünüm mevcut.
- [x] Birer gün sağ/sol navigasyon mevcut.
- [x] Görev ekleme mevcut.
- [x] Toplu görev ekleme mevcut.
- [x] Görev tamamlama ve süre kaydı mevcut.
- [x] Drag/drop ile görev taşıma mevcut.
- [x] Misafir localStorage akışı mevcut.
- [x] Supabase auth ve kalıcı kayıt akışı mevcut.

## Regression Checklist

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] Sağ ok bir gün ileri taşır.
- [ ] Sol ok bir gün geri taşır.
- [ ] Görev ekleme doğru güne kaydeder.
- [ ] Hafta sınırı geçen görünümde görev doğru kolonda görünür.
- [ ] Drag/drop hedef günün `gun` ve `hafta` değerlerini yazar.
- [ ] Misafir görevleri localStorage içinde korunur.
- [ ] Giriş yapan kullanıcı görevleri Supabase içinde korunur.

## Future Work Candidates

- [ ] Planner state ve tarih yardımcılarını ayrı modüle taşı.
- [ ] Veri tiplerini `app/page.tsx` içinden ortak type dosyasına toparla.
- [ ] Core planner için otomasyon veya component testleri ekle.
- [ ] Auth ve guest migration akışına hata durumları ekle.
