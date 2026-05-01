# Flat UI Colors Tema Sistemi v4

## Amaç

Tema seçimini daha kaliteli ama kalabalık olmayan iki katmanlı bir yapıya taşımak: önce Flat UI Colors paleti, sonra paletin içindeki tema.

## Kapsam

- 6 palet: American, Aussie, British, Canadian, Turkish, Indian.
- Her palette 6 dark ve 6 light tema.
- Toplam 72 tema.
- Tema kartlarında uygulama içinde üretilmiş swatch önizlemesi.
- Sağ üstte hızlı Dark/Light geçişi.
- Eski tema key'leri için uyumluluk.

## Kapsam Dışı

- Vercel deploy.
- Kaynak kitap sistemi değişikliği.
- Günlük odak, not arşivi, görev taşıma veya kopyalama davranışı değişikliği.
- Dış görsel asset kopyalama.

## Davranış

- `Tema Rengi` sekmesi önce palet kartlarını gösterir.
- Palete girince dark/light segmenti ve ilgili 6 tema görünür.
- Dark/Light toggle aynı palet ve aynı sıra numarasındaki karşı moda geçer.
- Arka plan modu seçimi yoktur.
- Dark zeminde gradient yoktur; light zeminde gradient yoktur.
