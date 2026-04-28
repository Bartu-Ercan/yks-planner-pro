# Design System

Bu dosya YKS Planner Pro'nun mevcut frontend tasarım dilini sabitler. Amaç yeni sayfa ve özelliklerde mevcut görsel kimliği korumaktır. Bu doküman redesign brief değildir; mevcut app'in tasarım sözleşmesidir.

## Temel İlke

Yeni UI, mevcut planner ekranının devamı gibi görünmelidir.

Korunacak kimlik:

- Koyu, odaklı çalışma paneli.
- Kompakt ve yoğun ama okunabilir yerleşim.
- Yedi günlük board mantığı.
- Tema bazlı renk vurguları.
- Ders bazlı renk şeritleri.
- Küçük etiketler, ince borderlar, kontrollü radius.
- Minimal animasyon ve net hover hissi.

Yapılmayacaklar:

- Sidebar ekleme.
- Bottom navigation ekleme.
- Landing page hero alanı ekleme.
- Analytics, chart, hedef, profil veya menü paneli uydurma.
- Mevcut uygulamayı genel SaaS dashboard'a çevirme.
- Büyük kartlarla ekranı seyrekleştirme.
- Mor gradient ağırlıklı yeni kimlik kurma.

## Layout

Ana yüzey tam ekran koyu zemindir.

- Desktop padding: yaklaşık `1.5rem 1rem 3rem`.
- Mobile padding: yaklaşık `1rem 0.5rem 3rem`.
- İçerik kartlar içinde boğulmaz; board ana deneyim olarak kalır.
- Header, progress, action panel ve board dikey sırada akar.
- Board desktop'ta 7 eşit kolon, mobile'da yatay scroll alanıdır.
- Mobile kolon minimum genişliği yaklaşık `110-120px`.
- Kolon aralığı kompakt tutulur: yaklaşık `8px`.

## Color System

Ana nötrler:

| Token | Değer | Kullanım |
| --- | --- | --- |
| `bg` | `#0a0a0a` | Sayfa zemini |
| `surface` | `#111827` | Kart, panel, gün başlığı |
| `surface-deep` | `#030712` | Input, tamamlanmış kart, iç panel |
| `border` | `#1f2937` | İnce ayrım çizgileri |
| `text` | `#e5e5e5` | Ana metin |
| `text-strong` | `#ffffff` | Başlık |
| `text-muted` | `#9ca3af` | İkincil metin |
| `text-dim` | `#6b7280` | Yardımcı metin |
| `text-faint` | `#4b5563` | Pasif aksiyonlar |

Tema sistemi üç vurgu rengi kullanır: `primary`, `primaryLight`, `accent`.

Mevcut temalar:

| Tema | Primary | Primary Light | Accent |
| --- | --- | --- | --- |
| Okyanus | `#3b82f6` | `#60a5fa` | `#22d3ee` |
| Gece | `#8b5cf6` | `#a78bfa` | `#c084fc` |
| Orman | `#22c55e` | `#4ade80` | `#34d399` |
| Ateş | `#ef4444` | `#f87171` | `#fb923c` |
| Günbatımı | `#f97316` | `#fb923c` | `#facc15` |
| Pembe Rüya | `#ec4899` | `#f472b6` | `#fbbf24` |

Tema vurgusu kullanılacak yerler:

- Primary button.
- Aktif gün başlığı.
- Aktif segmented control.
- Progress bar gradient.
- Focus border.
- Aktif tarih durumu.

## Subject Colors

Ders renkleri task kartında sol 3px şerit ve ders etiketi için kullanılır.

| Ders | Renk |
| --- | --- |
| TYT Mat | `#60a5fa` |
| TYT Türkçe | `#a78bfa` |
| TYT Fen | `#34d399` |
| TYT Sosyal | `#fbbf24` |
| TYT Genel Deneme | `#f87171` |
| AYT Mat | `#38bdf8` |
| AYT Fizik | `#f472b6` |
| AYT Kimya | `#fb923c` |
| AYT Bio | `#4ade80` |
| AYT Edebiyat | `#c084fc` |
| AYT Tarih | `#facc15` |
| AYT Genel Deneme | `#fb7185` |

Yeni ders eklenirse önce bu tabloya renk atanır. Rastgele renk kullanılmaz.

## Typography

Mevcut app mono hissi taşır.

- Ana app fontu: `'DM Mono', monospace` hissi.
- Global fallback: system sans olabilir, ama planner yüzeyi mono karakterini korur.
- Letter spacing negatif kullanılmaz; küçük uppercase etiketlerde pozitif spacing kullanılabilir.

Ölçek:

| Stil | Boyut | Kullanım |
| --- | --- | --- |
| Eyebrow | `10-11px` | `2026 YKS`, modal üst etiketi |
| Caption | `10px` | tarih, süre, sayaç |
| Small label | `11-12px` | gün adı, progress label |
| Body compact | `13-15px` | input, select, panel metni |
| Task title | `11px` | görev konusu |
| Page title | `18px mobile`, `22px desktop` | `Haftalık Program` |
| Modal title | `20px` | modal ana başlık |

Metinler kısa tutulur. UI açıklama yazılarıyla şişirilmez.

## Shape And Spacing

Radius:

- Small button: `6-8px`.
- Icon button: `8px`.
- Input/select: `10-12px`.
- Task card: `10px`.
- Panel: `12-14px`.
- Modal: `20px`.
- Progress bar: full pill.

Spacing:

- Board column gap: `8px`.
- Column internal gap: `6px`.
- Task card padding: `10px 8px 9px`.
- Panel padding: `12px 16px` veya `20px 22px`.
- Modal padding: `32px 36px`.
- Form control padding: `12-14px`.

## Components

### Header

- Sol tarafta küçük uppercase bağlam etiketi.
- Altında küçük ama net sayfa başlığı.
- Sağ tarafta auth, ayarlar, gün navigasyonu ve bugün butonu.
- Header'a sidebar veya yeni ana nav eklenmez.

### Progress Panel

- `surface` zemin.
- `1px` border.
- `12px` radius.
- İnce `4px` progress bar.
- Bar gradient: `primary -> accent`.
- Metinler küçük ve ölçülü.

### Planner Board

- Her gün bir kolondur.
- Desktop: 7 eşit kolon.
- Mobile: 7 kolon yatay scroll.
- Bugünün başlığı `primary -> primaryLight` gradient alır.
- Normal gün başlığı `surface` zemin ve border alır.
- Gün başlığı kompakt kalır.

### Task Card

- `surface` zemin.
- `1px` border.
- `10px` radius.
- Sol tarafta ders renginde `3px` şerit.
- Ders adı küçük, renkli, bold.
- Konu kısa, tek satır ellipsis.
- Süre alt solda.
- Tamamla ve sil aksiyonları alt sağda.
- Tamamlanan görev `surface-deep`, düşük opacity, line-through.
- Hover: hafif yukarı hareket ve yumuşak shadow.

### Add Button

- Tam genişlik.
- Transparent background.
- `2px dashed border`.
- Büyük `+` karakteri.
- Renk pasif `text-faint`.

### Forms

- Input/select zemini genelde `surface-deep`.
- Border `border`.
- Focus border tema `primary`.
- Formlar kompakt ama dokunulabilir olmalı.
- Select native görünümü sadeleştirilir.

### Buttons

- Primary: tema `primary`, beyaz metin, `600` weight.
- Secondary: `surface-deep` veya `surface`, border, muted text.
- Icon button: kare `32px`, `surface`, border.
- Text-only aksiyonlar sadece ikincil veya düşük riskli komutlarda.

### Modals

- Overlay: `rgba(0,0,0,0.8)`.
- Modal zemin: `surface`.
- Border: `1px solid border`.
- Radius: `20px`.
- Shadow: büyük, koyu.
- Genişlik: `420-480px`.
- İçerik: kısa label, başlık, form, iki aksiyon.
- Modal yeni sayfa gibi davranmaz; hızlı görev akışı için kalır.

### Theme Selector

- Ayarlar modalı içinde kart grid.
- Tema kartları `surface`, `border`, `16px` radius.
- Her tema üç swatch gösterir: `primary`, `primaryLight`, `accent`.
- Aktif tema border ve küçük check ile belirtilir.

### Toast

- Fixed bottom center.
- Yeşil başarı rengi: `#22c55e`.
- Siyah metin.
- `12px` radius.
- Kısa metin.

## Motion

Animasyon az ve işlevsel olmalı.

- Fade/slide giriş: `0.2-0.3s`.
- Hover lift: `translateY(-1px)` veya `translateY(-2px)`.
- Progress width transition: yaklaşık `0.5s`.
- Drag kartı hafif opacity ve küçük rotate alabilir.

## Responsive Rules

Mobile'da mevcut kimlik korunur.

- Yeni bottom nav eklenmez.
- Board yatay scroll kalır.
- Header wrap olabilir.
- Kolon minimum genişliği korunur.
- Modal tam genişliğe yaklaşır ama kenarlarda padding bırakır.
- Desktop için tasarlanan ekstra panel mobile'a zorla eklenmez.

## New Page Rules

Yeni sayfa gerekiyorsa:

- Mevcut header/panel/board dilinden türetilir.
- Aynı tema tokenları kullanılır.
- Yeni ana navigasyon icat edilmez.
- Bilgi yoğunluğu korunur.
- Sayfa bir productivity tool yüzeyi gibi kalır.
- İlk ekran gerçek işlevi göstermelidir; marketing hero kullanılmaz.

Yeni component gerekiyorsa:

- Önce mevcut task card, panel, modal veya form patterninden türet.
- Yeni renk ekleme; tema ve ders renklerini kullan.
- Yeni radius sistemi ekleme.
- Büyük dekoratif arka plan ekleme.
- Uygulama genelinde aynı spacing ölçeğini sürdür.

## Acceptance Checklist

Yeni frontend işi bitmeden şunlar kontrol edilir:

- [ ] Mevcut planner kimliği korunuyor.
- [ ] Sidebar veya bottom nav eklenmedi.
- [ ] Uydurma ürün bölümü eklenmedi.
- [ ] Tema renkleri doğru kullanıldı.
- [ ] Mobile yatay board davranışı bozulmadı.
- [ ] Task card yoğunluğu ve boyutu mevcut stile yakın.
- [ ] Modal, button ve input stilleri mevcut sistemden türedi.
- [ ] `npm run lint` ve gerektiğinde `npm run build` çalıştı.
