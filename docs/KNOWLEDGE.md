# Knowledge

## Proje Kimliği

- Ürün adı: YKS Planner Pro.
- Canonical path: `/Users/bartuercan/Documents/YKS Planner Pro`.
- Legacy path: `/Users/bartuercan/Documents/New project 3`.
- Repo: `https://github.com/Bartu-Ercan/yks-planner-pro`.

## Bilinen Teknik Gerçekler

- Next.js sürümü 16.2.3. Kod değişmeden önce `node_modules/next/dist/docs/` içindeki ilgili doküman okunmalı.
- Supabase client `NEXT_PUBLIC_SUPABASE_URL` ve `NEXT_PUBLIC_SUPABASE_ANON_KEY` ister.
- Ana tablo `gorevler`.
- RLS kullanıcı bazlıdır.
- Misafir görevleri `localStorage` içinde saklanır.
- Tema tercihi `localStorage` içinde `yks-tema` anahtarıyla saklanır; tema sistemi 6 dark ve 6 light seçenekten oluşur.

## Planner Notları

- `gunOffset` görünümün başlangıç gününü belirler.
- Görünen pencere yedi gündür.
- Sağ ok `+1 gün`, sol ok `-1 gün` davranışı vermelidir.
- Hafta sınırı geçildiğinde görevler hem `gun` hem `hafta` ile eşleşmelidir.
- Toplu ekleme görünür gün etiketlerine göre çalışmalıdır.

## Deploy Notları

- Vercel build için Supabase public env değerleri gerekir.
- `supabaseUrl is required` hatası env eksikliğine işaret eder.
- Başarılı build sonrası public erişim ayrıca kontrol edilmelidir.

## Çalışma Disiplini

- Büyük özellikler önce spec, sonra plan, sonra tasks dosyasıyla netleştirilir.
- Kararlar `docs/DECISIONS.md` içine kısa ve tarihsel bağlamla eklenir.
- Tekrarlayan hata ve çözüm bilgileri bu dosyaya yazılır.
- Yeni frontend ekranları ve componentleri `docs/DESIGN_SYSTEM.md` içindeki mevcut tasarım diliyle uyumlu olmalıdır.
