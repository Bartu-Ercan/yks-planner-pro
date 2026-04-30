# Implementation Plan: Günlük Odak Görünümü

## Summary

Günlük odak görünümü, `codex/tasarim-paketi` üzerindeki tasarım sistemi korunarak `app/page.tsx` içinde aynı veri akışına bağlanır. Görevler mevcut `gorevler` modelini kullanır; notlar yeni `gunluk_notlar` modeliyle ayrılır.

## Data Flow

1. Auth state okunur.
2. Görevler mevcut akışla yüklenir.
3. Notlar kullanıcı varsa Supabase `gunluk_notlar`, yoksa `localStorage` üzerinden yüklenir.
4. Gün başlığı seçili gün indexini açar.
5. Günlük panel seçili güne ait görev, not ve kaynak hazırlığını gösterir.

## UI Rules

- Günlük panel tam ekran odak yüzeyidir, ayrı route değildir.
- Header içinde küçük `Notlar` aksiyonu bulunur.
- Hazırlık alanı `text` veya `visual` moduna göre render edilir.
- Yeni sidebar, bottom nav veya dashboard eklenmez.

## Validation

- `npm run lint`
- `npm run build`
- Günlük panel, not arşivi, kaynak görünüm tercihi ve mobil yatay board davranışı browser üzerinden kontrol edilir.
