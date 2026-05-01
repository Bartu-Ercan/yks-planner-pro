# Kaynak Kitap Sistemi v1 Spec

## Amaç

YKS Planner Pro içinde öğrencinin elindeki TYT/AYT kaynakları seçebilmesi, görev eklerken uygun kaynağı bağlayabilmesi ve günlük odak görünümünde o gün hazırlanacak kitapları görebilmesi.

## Kapsam

- `Kaynaklarım` yüzeyi aynı sayfa içinde modal olarak açılır.
- Katalog TYT/AYT, ders ve yayınevi filtreleriyle kullanılır.
- Kullanıcı katalogdan kitap ekleyip çıkarabilir.
- Görev ekleme formunda kaynak seçimi opsiyoneldir.
- Günlük odakta kopyalama aksiyonu görünmez; haftalık planner kopyalama davranışı korunur.
- İlk kullanım rehberi atlanabilir ve ayarlardan tekrar açılabilir.

## Kapsam Dışı

- Google Tasks entegrasyonu.
- Deneme takip sistemi.
- Otomatik kaynak-kitap eşleştirme.
- Kapak görseli yükleme veya kullanıcı kaynak ekleme formu.
- Vercel deploy.

## Kabul Kriterleri

- Misafir kullanıcı kaynaklarını ve onboarding durumunu refresh sonrası korur.
- Görev kaynağı ders filtresine göre gösterilir.
- Kaynak bağlı görevler günlük hazırlık alanında görünür.
- Günlük görünümde görev çoğaltma aksiyonu yoktur.
- Haftalık görünümde görev çoğaltma aksiyonu çalışmaya devam eder.
