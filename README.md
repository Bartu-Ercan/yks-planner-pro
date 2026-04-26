# YKS Planner 📚

Koyu temalı, haftalık YKS çalışma programı planlayıcısı. Tüm cihazlardan (MacBook, iPhone, Android tablet) senkronize şekilde kullanabilirsin.

## Özellikler ✨

-  **Haftalık program** - 7 günlük grid görünümü
- ✅ **Görev takibi** - Tamamlandı/çalışıldı olarak işaretle
- 📋 **Toplu görev ekleme** - Rutin görevler (her gün 30 soru gibi)
- ➕ **Günlük görev** - O güne özel görevler
- 🌙 **Koyu tema** - Göz yormayan tasarım
- 📊 **İlerleme takibi** - Günlük ve haftalık % tamamlanma
- 📱 **Responsive** - Mobil ve masaüstü uyumlu

## Kurulum 🚀

### 1. GitHub'a Push

```bash
cd ~/Desktop/qwen/projects/yks-planner

# GitHub'da yeni repo oluştur: https://github.com/new
# Repo adı: yks-planner

git init
git add .
git commit -m "Initial commit: YKS Planner"
git branch -M main
git remote add origin https://github.com/SENIN_USERNAME/yks-planner.git
git push -u origin main
```

### 2. Supabase Kurulumu

1. https://supabase.com/dashboard adresine git
2. "New Project" oluştur
3. Project Settings > API'den şu değerleri kopyala:
   - `Project URL`
   - `anon/public` key

4. `.env.local` dosyasını düzenle:
```
NEXT_PUBLIC_SUPABASE_URL=https://SENIN_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SENIN_ANON_KEY
```

5. Supabase SQL Editor'da `supabase-schema.sql` dosyasındaki SQL'i çalıştır

### 3. Vercel Deploy

1. https://vercel.com/dashboard adresine git
2. "Add New Project" > GitHub reposunu seç (`yks-planner`)
3. Environment Variables ekle:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. "Deploy" butonuna tıkla

## Kullanım 📖

### Görev Ekleme
1. Sağ üstteki "+ Görev Ekle" butonuna tıkla
2. Günü seç
3. Dersi seç (AYT Matematik, TYT Fen, vs.)
4. Görevi yaz (örn: "30 soru çöz")
5. "Ekle" butonuna tıkla

### Rutin Görev Ekleme
1. "Rutin Ekle" butonuna tıkla
2. Hangi günlerde olacağını seç (birden fazla seçebilirsin)
3. Ders ve görevi gir
4. Otomatik olarak tüm günlere eklenir

### Görev Tamamlama
- Görevin solundaki kutucuğa tıkla
- İlerleme çubuğu otomatik güncellenir

### Mobil Kullanım
- Üstteki gün butonlarından gün seç
- Görevlerini takip et

## Teknolojiler 🛠️

- Next.js 14
- Tailwind CSS
- Supabase (Database + Auth)
- Lucide React (Icons)

---

**Bartu için yapıldı** 💜
