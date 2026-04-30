DROP TABLE IF EXISTS gorevler CASCADE;
DROP TABLE IF EXISTS gunluk_notlar CASCADE;

CREATE TABLE gorevler (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  ders VARCHAR(50) NOT NULL,
  konu TEXT NOT NULL,
  gun INTEGER NOT NULL,
  hafta VARCHAR(20) NOT NULL,
  tamam BOOLEAN DEFAULT FALSE,
  gercek_sure INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gorevler_user_id ON gorevler(user_id);
CREATE INDEX idx_gorevler_hafta ON gorevler(hafta);
CREATE INDEX idx_gorevler_gun ON gorevler(gun);

CREATE TABLE gunluk_notlar (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tarih VARCHAR(20) NOT NULL,
  icerik TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_gunluk_notlar_user_id ON gunluk_notlar(user_id);
CREATE INDEX idx_gunluk_notlar_tarih ON gunluk_notlar(tarih);

ALTER TABLE gorevler ENABLE ROW LEVEL SECURITY;
ALTER TABLE gunluk_notlar ENABLE ROW LEVEL SECURITY;

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
