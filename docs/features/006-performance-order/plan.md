# Performans ve Gün İçi Sıralama Plan

## Uygulama

- `gorevler.sira` için non-destructive migration eklenecek.
- Görevler aktif/tamamlanan ayrımıyla `sira` ve `created_at` fallback üzerinden sıralanacak.
- Pointer drag hedefi gün kolonu ve görev kartı üst/alt yarısı olarak hesaplanacak.
- Drag ghost ve custom cursor konumu React state yerine `ref + requestAnimationFrame` ile güncellenecek.
- Görev düzenleme Supabase update sonucunu kontrol edecek ve state'i DB dönüşüyle yenileyecek.

## Doğrulama

- `npm run lint`
- `npm run build`
- Aynı gün sıralama, farklı güne taşıma, görev düzenleme, refresh ve deploy doğrulaması.
