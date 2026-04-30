# Architecture

## Genel Yapı

YKS Planner Pro, Next.js App Router üzerinde çalışan client ağırlıklı bir planlama uygulamasıdır. Ana planner deneyimi `app/page.tsx` içinde tutulur. Supabase, auth ve kalıcı görev verisi için kullanılır. Vercel, production deploy ortamıdır.

## Runtime

- Next.js 16.2.3
- React 19.2.4
- TypeScript
- Supabase JS client
- Browser localStorage

## Ana Akış

1. Uygulama açılır.
2. Supabase auth state okunur.
3. Kullanıcı yoksa görevler `localStorage` üzerinden yüklenir.
4. Kullanıcı varsa görevler Supabase `gorevler` tablosundan yüklenir.
5. Görünen yedi günlük pencere `gunOffset` üzerinden hesaplanır.
6. Görevler `gun` ve `hafta` çiftiyle doğru kolona bağlanır.

## Veri Kaynakları

- Supabase:
  - Giriş yapan kullanıcı görevleri.
  - Giriş yapan kullanıcı günlük notları.
  - Auth state.
- localStorage:
  - Misafir görevleri.
  - Misafir günlük notları.
  - Seçili tema.
  - Kaynak görünümü tercihi.

## Kritik Mimari Kural

Planner görünümü takvim haftasına sabit değildir. Görünüm yedi günlük hareketli pencere olarak çalışır. Bu pencere hafta sınırını geçebildiği için her görevde `gun` ve `hafta` birlikte doğru kalmalıdır.

Günlük odak görünümü ayrı route değildir. Haftalık planner içinden seçili gün için açılan tam ekran paneldir; görev verisi aynı `gorevler` modelini, günlük notlar `gunluk_notlar` modelini kullanır.

## Deploy

Vercel build sırasında Supabase public env değerleri gerekir:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Bu değerler eksikse Supabase client oluşturulamaz ve build durur.
