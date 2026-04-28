# Product

## Vizyon

YKS Planner Pro, YKS hazırlık sürecini günlük görevler ve haftalık görünüm üzerinden yönetilebilir hale getiren çalışma planlama ürünüdür.

## Hedef Kullanıcı

- YKS'ye hazırlanan öğrenciler.
- Günlük ders ve konu takibi yapmak isteyen kullanıcılar.
- Tamamlanan görevlerin gerçek çalışma süresini görmek isteyen kullanıcılar.
- Planını cihazlar arasında saklamak isteyen kayıtlı kullanıcılar.

## Ana Değer

- Öğrenci, yedi günlük görünümde çalışacağı konuları hızlıca planlar.
- Görevler ders ve konu bazında ayrılır.
- Tamamlanan görevlerde çalışma süresi kaydedilir.
- Kullanıcı giriş yapmadan yerel kayıtla başlayabilir, sonra hesabına taşıyabilir.

## Mevcut Ürün Davranışı

- Yedi günlük görünüm vardır.
- Sağ ve sol navigasyon görünümü birer gün kaydırır.
- Görünüm hafta sınırlarını aşabilir.
- Görevler tek tek veya toplu eklenebilir.
- Görevler günler arasında sürüklenebilir.
- Tamamlama sırasında süre girişi yapılabilir.
- Tema seçimi localStorage içinde saklanır.
- Giriş yapılmamış görevler localStorage içinde tutulur.
- Giriş sonrası görevler Supabase `gorevler` tablosunda tutulur.

## Başarı Kriteri

- Öğrenci bir haftalık çalışma planını hızlı kurabilmeli.
- Görevler yanlış güne veya yanlış haftaya düşmemeli.
- Giriş yapmadan başlayan kullanıcı veri kaybetmeden devam edebilmeli.
- Yeni özellikler ürünü karmaşıklaştırmadan planlama hızını artırmalı.
