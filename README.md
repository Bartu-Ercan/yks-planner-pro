# YKS Planner Pro

YKS Planner Pro, YKS öğrencileri için haftalık çalışma görevlerini planlama, takip etme ve tamamlama süresini kaydetme uygulamasıdır. Proje ticari kullanıma hazırlanıyor; bu yüzden ürün kararları, teknik yapı ve yeni özellik planları repo içinde açık dokümante edilir.

## Stack

- Next.js 16.2.3
- React 19.2.4
- TypeScript
- Supabase Auth ve Postgres
- Tailwind CSS 4
- Vercel

## Yerel Geliştirme

```bash
npm install
npm run dev
```

Varsayılan geliştirme adresi:

```text
http://localhost:3000
```

## Ortam Değişkenleri

`.env.local` dosyasında şu değerler gerekir:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ANON_KEY
```

`lib/supabase.ts` bu değerleri build sırasında okur. Eksik olursa `npm run build` `supabaseUrl is required` hatasıyla durur.

## Veritabanı

Supabase SQL Editor içinde `supabase-schema.sql` dosyasındaki SQL çalıştırılır.

Ana tablo:

- `gorevler`: ders, konu, gün, hafta, tamamlanma durumu ve gerçek çalışma süresini tutar.

Detaylar: [docs/DATA_MODEL.md](docs/DATA_MODEL.md)

## Dokümantasyon

- Ürün temeli: [docs/PRODUCT.md](docs/PRODUCT.md)
- Mimari: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- Veri modeli: [docs/DATA_MODEL.md](docs/DATA_MODEL.md)
- Tasarım sistemi: [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md)
- Yol haritası: [docs/ROADMAP.md](docs/ROADMAP.md)
- Kararlar: [docs/DECISIONS.md](docs/DECISIONS.md)
- Kalıcı bilgi notları: [docs/KNOWLEDGE.md](docs/KNOWLEDGE.md)
- Feature akışı: [docs/features/_template](docs/features/_template)
- Mevcut planner özelliği: [docs/features/000-core-planner](docs/features/000-core-planner)

## Yeni Özellik Akışı

Büyük özelliklerde uygulama koduna geçmeden önce:

1. `docs/features/<id>/spec.md` ile kullanıcı ihtiyacı ve kabul kriterleri yazılır.
2. `docs/features/<id>/plan.md` ile teknik yaklaşım netleştirilir.
3. `docs/features/<id>/tasks.md` ile uygulanabilir iş listesi çıkarılır.
4. Kod değişikliği yapılır.
5. `npm run lint` ve `npm run build` çalıştırılır.

## Kalite Kontrolleri

```bash
npm run lint
npm run build
```

Frontend davranışı değiştiyse tarayıcıda temel akışlar kontrol edilir:

- Görev ekleme.
- Görev tamamlama ve süre kaydetme.
- Görev taşıma.
- Sağ/sol gün navigasyonu.
- Auth açık ve kapalı kullanım.

## Deploy

Vercel projesinde şu env değerleri tanımlı olmalıdır:

```text
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

GitHub repo:

```text
https://github.com/Bartu-Ercan/yks-planner-pro
```
