DROP TABLE IF EXISTS gorevler CASCADE;

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

ALTER TABLE gorevler ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_select" ON gorevler;
CREATE POLICY "users_select" ON gorevler FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_insert" ON gorevler;
CREATE POLICY "users_insert" ON gorevler FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_update" ON gorevler;
CREATE POLICY "users_update" ON gorevler FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_delete" ON gorevler;
CREATE POLICY "users_delete" ON gorevler FOR DELETE USING (auth.uid() = user_id);
