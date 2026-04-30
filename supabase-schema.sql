DROP TABLE IF EXISTS gorevler CASCADE;
DROP TABLE IF EXISTS gunluk_notlar CASCADE;
DROP TABLE IF EXISTS kullanici_kaynaklari CASCADE;
DROP TABLE IF EXISTS kullanici_tercihleri CASCADE;
DROP TABLE IF EXISTS kaynak_katalogu CASCADE;

CREATE TABLE gorevler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ders VARCHAR(50) NOT NULL,
  konu TEXT NOT NULL,
  kaynak_id VARCHAR(80),
  gun INTEGER NOT NULL,
  hafta VARCHAR(20) NOT NULL,
  tamam BOOLEAN DEFAULT FALSE,
  gercek_sure INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gorevler_user_id ON gorevler(user_id);
CREATE INDEX idx_gorevler_hafta ON gorevler(hafta);
CREATE INDEX idx_gorevler_gun ON gorevler(gun);
CREATE INDEX idx_gorevler_kaynak_id ON gorevler(kaynak_id);

CREATE TABLE gunluk_notlar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tarih VARCHAR(20) NOT NULL,
  icerik TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gunluk_notlar_user_id ON gunluk_notlar(user_id);
CREATE INDEX idx_gunluk_notlar_tarih ON gunluk_notlar(tarih);

CREATE TABLE kaynak_katalogu (
  id VARCHAR(80) PRIMARY KEY,
  sinav VARCHAR(10) NOT NULL,
  ders VARCHAR(50) NOT NULL,
  yayinevi TEXT NOT NULL,
  ad TEXT NOT NULL,
  kapak_url TEXT NOT NULL,
  urun_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_kaynak_katalogu_sinav ON kaynak_katalogu(sinav);
CREATE INDEX idx_kaynak_katalogu_ders ON kaynak_katalogu(ders);
CREATE INDEX idx_kaynak_katalogu_yayinevi ON kaynak_katalogu(yayinevi);

CREATE TABLE kullanici_kaynaklari (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  kaynak_id VARCHAR(80) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, kaynak_id)
);

CREATE INDEX idx_kullanici_kaynaklari_user_id ON kullanici_kaynaklari(user_id);
CREATE INDEX idx_kullanici_kaynaklari_kaynak_id ON kullanici_kaynaklari(kaynak_id);

CREATE TABLE kullanici_tercihleri (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  onboarding_tamamlandi BOOLEAN DEFAULT FALSE,
  son_kaynak_secimi JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE gorevler ENABLE ROW LEVEL SECURITY;
ALTER TABLE gunluk_notlar ENABLE ROW LEVEL SECURITY;
ALTER TABLE kaynak_katalogu ENABLE ROW LEVEL SECURITY;
ALTER TABLE kullanici_kaynaklari ENABLE ROW LEVEL SECURITY;
ALTER TABLE kullanici_tercihleri ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select" ON gorevler;
CREATE POLICY "users_select" ON gorevler FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert" ON gorevler;
CREATE POLICY "users_insert" ON gorevler FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update" ON gorevler;
CREATE POLICY "users_update" ON gorevler FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete" ON gorevler;
CREATE POLICY "users_delete" ON gorevler FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select" ON gunluk_notlar;
CREATE POLICY "users_select" ON gunluk_notlar FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert" ON gunluk_notlar;
CREATE POLICY "users_insert" ON gunluk_notlar FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update" ON gunluk_notlar;
CREATE POLICY "users_update" ON gunluk_notlar FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete" ON gunluk_notlar;
CREATE POLICY "users_delete" ON gunluk_notlar FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "public_select" ON kaynak_katalogu;
CREATE POLICY "public_select" ON kaynak_katalogu FOR SELECT USING (true);

DROP POLICY IF EXISTS "users_select" ON kullanici_kaynaklari;
CREATE POLICY "users_select" ON kullanici_kaynaklari FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert" ON kullanici_kaynaklari;
CREATE POLICY "users_insert" ON kullanici_kaynaklari FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete" ON kullanici_kaynaklari;
CREATE POLICY "users_delete" ON kullanici_kaynaklari FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_select" ON kullanici_tercihleri;
CREATE POLICY "users_select" ON kullanici_tercihleri FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert" ON kullanici_tercihleri;
CREATE POLICY "users_insert" ON kullanici_tercihleri FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update" ON kullanici_tercihleri;
CREATE POLICY "users_update" ON kullanici_tercihleri FOR UPDATE USING (auth.uid() = user_id);
