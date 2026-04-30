# Feature Spec: Günlük Odak Görünümü

## Goal

Kullanıcı haftalık planner çizgisini bozmadan tek bir güne odaklanır, o günün görevlerini yönetir, kısa not alır ve hazırlık kaynaklarını sade biçimde görür.

## User Stories

- Kullanıcı olarak gün başlığına tıklayıp o günün odak görünümünü açmak istiyorum.
- Kullanıcı olarak günlük görünümde görevlerimi tamamlamak, eklemek, çoğaltmak ve silmek istiyorum.
- Kullanıcı olarak güne bağlı kısa not alıp tüm notlarımı kronolojik görmek istiyorum.
- Kullanıcı olarak hazırlık kaynaklarını yazı veya görsel modda görebilmek istiyorum.

## Requirements

- Günlük görünüm ayrı route olmaz; aynı sayfada tam ekran panel olarak açılır.
- Haftalık planner ana ekran olarak kalır.
- Notlar `tarih` alanıyla güne bağlı tutulur.
- Misafir notları `yks-gunluk-notlar`, kayıtlı kullanıcı notları `gunluk_notlar` içinde saklanır.
- Kaynak görünümü tercihi `yks-kaynak-gorunumu` ile saklanır.
- Görsel kaynak modu kapak görseli alanı olan kompakt grid altyapısı sunar.

## Acceptance Criteria

- [ ] Gün başlığı günlük paneli açar.
- [ ] `haftaya dön` paneli kapatır.
- [ ] Günlük panelde görev ekleme, tamamlama, çoğaltma ve silme çalışır.
- [ ] Günlük not refresh sonrası korunur.
- [ ] Header `Notlar` aksiyonu kronolojik arşivi açar.
- [ ] Kaynak görünümü ayarı yazı/görsel arasında değişir ve refresh sonrası korunur.
- [ ] Tasarım paketi davranışları korunur.
