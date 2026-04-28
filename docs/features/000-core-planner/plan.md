# Implementation Plan: Core Planner

## Summary

Core planner mevcut uygulamanın ana deneyimidir. Client state, Supabase verisi ve localStorage birlikte kullanılır. Görünüm sabit hafta değil, `gunOffset` ile birer gün kayan yedi günlük penceredir.

## Current State

- Ana uygulama `app/page.tsx` içinde.
- Supabase client `lib/supabase.ts` içinde.
- Ana veri tablosu `gorevler`.
- Misafir kullanıcı verisi `localStorage` içinde `yks-gorevler` anahtarıyla tutulur.
- Tema `yks-tema` anahtarıyla saklanır.

## Data Flow

1. Auth state okunur.
2. Kullanıcı varsa Supabase'ten görünür haftalara ait görevler alınır.
3. Kullanıcı yoksa localStorage içinden görünür haftalara ait görevler alınır.
4. `gorunenGunler` yedi günlük pencereyi üretir.
5. Aktif görevler `gun` ve `hafta` çiftiyle görünür güne bağlanır.

## Change Rules

- Planner davranışı değiştirilirken `gun` ve `hafta` birlikte ele alınmalıdır.
- Hafta sınırı geçen pencereler test edilmelidir.
- Toplu ekleme ve drag/drop aynı tarih modelini kullanmalıdır.
- Auth ve misafir kullanım aynı kabul senaryolarıyla kontrol edilmelidir.

## Risks

- Sadece `gun` ile eşleşme yapılırsa farklı haftalardaki görevler yanlış kolona düşer.
- Env değerleri eksikse build Supabase client oluştururken durur.
- localStorage ve Supabase yolları ayrı kaldığı için tek taraflı test yeterli değildir.

## Validation

- `npm run lint`
- `npm run build`
- Sağ ok: görünüm `+1 gün` ilerler.
- Sol ok: görünüm `-1 gün` geri gelir.
- Hafta sınırı geçen görünümde görev ekleme ve taşıma doğru çalışır.
- Misafir ve giriş yapmış kullanıcı yolları kontrol edilir.
