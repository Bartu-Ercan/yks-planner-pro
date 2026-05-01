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
- Tema tercihi `localStorage` içinde `yks-tema` anahtarıyla saklanır; tema sistemi 6 Flat UI Colors paleti üstünde toplam 72 seçenekten oluşur.
- Font tercihi `yks-font`, cursor tercihi `yks-cursor` anahtarıyla saklanır. Eski `yks-bg-style` değeri artık kullanılmaz.
- Fontlar `next/font` ile build sırasında self-host edilir.
- Görev-kaynak çoklu bağı `gorev_kaynaklari` tablosuyla tutulur. Eski `gorevler.kaynak_id` alanı geriye uyumluluk için ilk kaynak kimliğini taşır.
- Supabase OAuth provider ayarları dashboard tarafında yapılır; Google, Apple, Facebook ve Microsoft için secret değerleri repo içine yazılmaz.
- Şifre politikası client tarafında en az 8 karakter, büyük/küçük harf ve rakam olarak kontrol edilir. Supabase Dashboard > Auth > Password Security ayarı aynı kurala çekilmelidir.

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
- Tasarım, ürün, entegrasyon, visual polish ve karmaşık implementation işlerinde önce şu soru sorulur: "Bunu daha iyi yapmak için resmi doküman, iyi bir referans site, plugin, AI aracı veya uzmanlaşmış tool kullanmalı mıyız?" Uygunsa kullanılır, ama repo-native şekilde uyarlanır.
