# Decisions

## 0001 - Repo-native planlama temeli

Karar: Spec Kit ve Vibe Coder Kit doğrudan kurulmayacak. Bu repoya uygun sade dokümantasyon yapısı kurulacak.

Neden:

- Spec Kit feature spec, plan ve task akışı için güçlü bir model sunuyor.
- Vibe Coder Kit kalıcı bilgi, çalışma kuralları ve session primer fikri için yararlı.
- Ancak iki kitin dosyalarını birebir taşımak gereksiz araç bağımlılığı ve repo gürültüsü yaratır.

Sonuç:

- Dokümantasyon `docs/` altında tutulur.
- Feature geliştirme `docs/features/<id>/spec.md`, `plan.md`, `tasks.md` sırasıyla yapılır.
- Agent kuralları `AGENTS.md` içinde proje gerçeklerine göre tutulur.

## 0002 - Hareketli yedi günlük planner modeli

Karar: Planner görünümü sabit takvim haftası değil, birer gün kayan yedi günlük penceredir.

Neden:

- Kullanıcı sağ/sol oklarla görünümü tek gün ilerletmek ister.
- Yedi günlük pencere hafta sınırlarını aşabilir.

Sonuç:

- Görev yerleşiminde `gun` ve `hafta` birlikte kullanılmalıdır.
- Yeni planner özellikleri bu modeli bozmamalıdır.

## 0003 - Supabase public env değerleri build gereksinimi

Karar: Supabase client public env değerlerini build sırasında zorunlu kabul eder.

Neden:

- `lib/supabase.ts` doğrudan `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` okur.

Sonuç:

- Local, preview ve production ortamlarında iki değer de tanımlı olmalıdır.
- Build hatasında ilk kontrol bu env değerleridir.

## 0004 - Sade premium visual polish

Karar: Visual polish çalışmaları mevcut yedi günlük planner layout'unu koruyarak yapılacak; yeni sidebar, bottom nav, landing hero, analytics panel veya ekstra ana navigasyon eklenmeyecek.

Neden:

- Ürünün ana gücü sade ve hızlı günlük planlama deneyimidir.
- Görsel kalite artarken karar yükü ve arayüz yoğunluğu artmamalıdır.
- Dengeli modda büyük yüzeyler nötr siyah/açık kalmalı, tema rengi sadece accent, aktif durum, progress, focus ve görev aksiyonlarında görünmelidir.

Sonuç:

- Premium hissi spacing, border, shadow, hover, ikon dili ve custom cursor gibi düşük karar yükü yaratan detaylarla yükseltilir.
- Ana aksiyonlarda Lucide ikon metni destekler; dar task aksiyonlarında icon-only kullanım varsa `title` ve `aria-label` zorunludur.
- Custom cursor desktop ile sınırlıdır; touch cihazlarda ve reduced-motion durumunda kapalıdır.
- Tasarım, ürün, entegrasyon ve visual polish işlerinde dış referans, resmi doküman, plugin, uzmanlaşmış tool veya AI desteği önce değerlendirilir.
