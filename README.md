# YKS Planner Pro

Ticari kullanıma hazırlanacak YKS çalışma planlama uygulaması.

## Teknik yapı

- Next.js
- React
- TypeScript
- Supabase
- Tailwind CSS

## Yerel geliştirme

```bash
npm install
npm run dev
```

## Ortam değişkenleri

`.env.local` dosyası:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ANON_KEY
```

Supabase SQL Editor içinde `supabase-schema.sql` dosyasındaki SQL çalıştırılır.

## GitHub

Private repo:

```text
https://github.com/Bartu-Ercan/yks-planner-pro
```

## Deploy

Vercel üzerinde repo seçilir ve ortam değişkenleri eklenir:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
