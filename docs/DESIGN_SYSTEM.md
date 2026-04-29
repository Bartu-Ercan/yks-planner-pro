# Design System

Bu dosya YKS Planner Pro'nun mevcut frontend tasarım dilini sabitler. Amaç yeni sayfa ve özelliklerde mevcut görsel kimliği korumaktır. Bu doküman redesign brief değildir; mevcut app'in tasarım sözleşmesidir.

## Temel İlke

Yeni UI, mevcut planner ekranının devamı gibi görünmelidir.

Korunacak kimlik:

- Odaklı çalışma paneli; dark temalar ana karakteri korur, light temalar aynı kompakt dili taşır.
- Kompakt ve yoğun ama okunabilir yerleşim.
- Yedi günlük board mantığı.
- Tema bazlı dark/light renk vurguları.
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

Ana yüzey tam ekran tema zeminidir.

- Desktop padding: yaklaşık `1.5rem 1rem 3rem`.
- Mobile padding: yaklaşık `1rem 0.5rem 3rem`.
- İçerik kartlar içinde boğulmaz; board ana deneyim olarak kalır.
- Header, progress, action panel ve board dikey sırada akar.
- Board desktop'ta 7 eşit kolon, mobile'da yatay scroll alanıdır.
- Mobile kolon minimum genişliği yaklaşık `110-120px`.
- Kolon aralığı kompakt tutulur: yaklaşık `8px`.

## Color System

Tema sistemi v2, her temayı kendi token setiyle taşır. Renkler Color Hunt'ın hand-picked palette mantığı ve Flat UI Colors'ın dengeli kontrast yaklaşımı baz alınarak seçilir; dış palette birebir kopyalanmaz.

Tema tokenları:

| Token | Kullanım |
| --- | --- |
| `mode` | `dark` veya `light` görsel mod |
| `primary` | Ana buton, aktif durum, focus border |
| `primaryLight` | İkincil vurgu, aktif sayaç, gradient ucu |
| `accent` | Progress gradient ve yardımcı vurgu |
| `bg`, `bgGradient` | Sayfa zemini |
| `card` | Kart, panel, gün başlığı |
| `cardSoft` | Input, iç panel, tamamlanmış kart |
| `border`, `hoverBorder` | İnce ayrım ve hover border |
| `text`, `textStrong` | Ana metin ve başlık |
| `muted`, `faint` | İkincil metin ve pasif aksiyon |
| `onPrimary` | Primary zemin üstü metin |
| `success`, `successText` | Toast ve başarı durumu |
| `overlay`, `shadow`, `hoverShadow` | Modal ve hover derinliği |

Arka plan modları:

- `Dengeli`: varsayılan moddur. Dark temalarda sayfa zemini, kartlar, gün kutuları ve panel yüzeyleri düz siyaha yakın nötr tonlar kullanır. Light temalarda aynı yüzeyler düz nötr açık tonlara çekilir. Tema rengi büyük yüzeylere tint vermez; sadece accent, aktif durum ve aksiyonlarda görünür.
- `Atmosferik`: tema kartlarındaki daha renkli `bgGradient` değerlerini kullanır.
- Arka plan modu globaldir; her tema için ayrı kart üretilmez.

Mevcut tema seti:

| Tema | Mode | Primary | Primary Light | Accent |
| --- | --- | --- | --- | --- |
| Okyanus | Dark | `#3b82f6` | `#60a5fa` | `#22d3ee` |
| Gece | Dark | `#a78bfa` | `#c4b5fd` | `#f0abfc` |
| Orman | Dark | `#10b981` | `#34d399` | `#a3e635` |
| Ateş | Dark | `#f43f5e` | `#fb7185` | `#fb923c` |
| Günbatımı | Dark | `#f97316` | `#fdba74` | `#facc15` |
| Pembe Rüya | Dark | `#ec4899` | `#f472b6` | `#f59e0b` |
| Sabah | Light | `#d97706` | `#f59e0b` | `#0891b2` |
| Gökyüzü | Light | `#2563eb` | `#60a5fa` | `#06b6d4` |
| Mint | Light | `#059669` | `#34d399` | `#14b8a6` |
| Lavanta | Light | `#7c3aed` | `#a78bfa` | `#ec4899` |
| Şeftali | Light | `#ea580c` | `#fb923c` | `#f43f5e` |
| Studio | Light | `#111827` | `#374151` | `#2563eb` |

Eski `localStorage` tema anahtarları korunur: `mavi`, `mor`, `yesil`, `kirmizi`, `turuncu`, `pembe`. Yeni seçimler yine `yks-tema` içinde saklanır.

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

Mevcut app mono hissi taşır. Font seçimi `yks-font` ile saklanır ve `next/font` üzerinden self-host edilir.

- Varsayılan font: `DM Mono`.
- Font seçenekleri: `DM Mono`, `Geist Mono`, `JetBrains Mono`, `IBM Plex Mono`, `Space Grotesk`, `Manrope`.
- Mono seçenekler planner kimliğini korur; sans seçenekler daha modern/premium ama sade kalmalıdır.
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

- Tema `card` zemini.
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
- Normal gün başlığı tema `card` zemin ve border alır.
- Gün başlığı kompakt kalır.

### Task Card

- Tema `card` zemini.
- `1px` border.
- `10px` radius.
- Sol tarafta ders renginde `3px` şerit.
- Ders adı küçük, renkli, bold.
- Konu kısa, tek satır ellipsis.
- Süre alt solda.
- Tamamla ve sil aksiyonları alt sağda.
- Tamamlanan görev `cardSoft`, düşük opacity, line-through.
- Hover: hafif yukarı hareket ve yumuşak shadow.

### Add Button

- Tam genişlik.
- Transparent background.
- `2px dashed border`.
- Büyük `+` karakteri.
- Renk pasif `faint`.

### Forms

- Input/select zemini genelde `cardSoft`.
- Border `border`.
- Focus border tema `primary`.
- Formlar kompakt ama dokunulabilir olmalı.
- Select native görünümü sadeleştirilir.

### Buttons

- Primary: tema `primary`, `onPrimary` metin, `600` weight.
- Secondary: `cardSoft` veya `card`, border, muted text.
- Icon button: kare `32px`, `card`, border.
- Ana aksiyonlarda ikon metni destekler; metin kaldırılmaz.
- Dar task card aksiyonları icon-only olabilir; `title` ve `aria-label` zorunludur.
- Text-only aksiyonlar sadece ikincil veya düşük riskli komutlarda.

### Modals

- Overlay: tema `overlay`.
- Modal zemin: tema `card`.
- Border: `1px solid border`.
- Radius: `20px`.
- Shadow: tema `shadow`.
- Genişlik: `420-480px`.
- İçerik: kısa label, başlık, form, iki aksiyon.
- Modal yeni sayfa gibi davranmaz; hızlı görev akışı için kalır.

### Theme Selector

- Ayarlar modalı içinde kart grid.
- Üst seviye sekmeler: `Tema Rengi` ve `Font`.
- `Tema Rengi` içinde arka plan modu ve dark/light tema listesi yer alır.
- `Font` içinde 6 font kartı ve canlı kısa preview yer alır.
- `Cursor` içinde 2 seçenek yer alır: `Sade` ve `Sistem`.
- Dark / Light segmented control kullanır.
- Tema kartları seçili arka plan moduna göre önizleme verir; `border`, `16px` radius ve kompakt yoğunluğu korur.
- Her tema üç swatch gösterir: `primary`, `primaryLight`, `accent`.
- Aktif tema border ve küçük check ile belirtilir.

### Toast

- Fixed bottom center.
- Tema `success` zemini ve `successText` metni.
- `12px` radius.
- Kısa metin.

## Motion

Animasyon az ve işlevsel olmalı.

- Fade/slide giriş: `0.2-0.3s`.
- Hover lift: `translateY(-1px)` veya `translateY(-2px)`.
- Progress width transition: yaklaşık `0.5s`.
- Drag kartı hafif opacity ve küçük rotate alabilir.
- Custom cursor tercihi `yks-cursor` ile saklanır. Seçenekler sadece `Sade` ve `Sistem` olmalıdır; `Sade` tema renginde düz ok kullanır ve hover/drag/copy sırasında şekil değiştirmez.
- Custom cursor mobile, touch cihazlar ve reduced-motion durumunda kapalıdır.
- Drag/copy sırasında küçük ghost card ve hedef gün focus hissi kullanılabilir; büyük efekt, parıltı veya oyuncak görsel kullanılmaz.

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
- Tasarım, ürün, entegrasyon, visual polish veya karmaşık implementation işi başlamadan önce iyi bir dış referans, plugin, resmi doküman, uzmanlaşmış tool veya AI desteği kaliteyi artırır mı diye özellikle değerlendirilir; uygunsa kullanılır, ama mevcut tasarım diline uyarlanır.

## Acceptance Checklist

Yeni frontend işi bitmeden şunlar kontrol edilir:

- [ ] Mevcut planner kimliği korunuyor.
- [ ] Sidebar veya bottom nav eklenmedi.
- [ ] Uydurma ürün bölümü eklenmedi.
- [ ] Tema tokenları doğru kullanıldı.
- [ ] Dark ve light tema kontrastları okunabilir.
- [ ] Font seçimi okunabilir ve localStorage'dan geri yükleniyor.
- [ ] Arka plan modu dengeli/atmosferik olarak geri yükleniyor.
- [ ] Mobile yatay board davranışı bozulmadı.
- [ ] Task card yoğunluğu ve boyutu mevcut stile yakın.
- [ ] Modal, button ve input stilleri mevcut sistemden türedi.
- [ ] İkonlar metinleri yok etmedi; dar icon-only aksiyonlarda erişilebilir etiket var.
- [ ] Custom cursor desktop'ta sade çalışıyor, mobile/touch/reduced-motion durumunda kapalı.
- [ ] `npm run lint` ve gerektiğinde `npm run build` çalıştı.
