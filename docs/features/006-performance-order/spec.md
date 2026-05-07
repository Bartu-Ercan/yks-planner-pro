# Performans ve Gün İçi Sıralama Spec

## Amaç

Planner sürükleme hissi akıcı olacak. Aktif görevler aynı gün içinde kullanıcı tarafından yukarı/aşağı sıralanabilecek. Tamamlanan görevler otomatik olarak günün altında kalacak.

## Davranış

- Aktif görev farklı güne sürüklenebilir.
- Aktif görev aynı gün içinde başka görevin üstüne veya altına bırakılarak sıralanabilir.
- Tamamlanan görevler sürüklenmez ve aktif görevlerin altında listelenir.
- Görev düzenleme kaydı Supabase sonucuna göre yapılır; başarısız kayıt eski state'i kalıcı gibi göstermez.
- Misafir kullanıcı sırası `localStorage` içinde saklanır.
- Giriş yapan kullanıcı sırası `gorevler.sira` alanında saklanır.

## Kabul Kriterleri

- Refresh sonrası görev adı/dersi/kaynak düzenlemesi korunur.
- Refresh sonrası gün içi aktif görev sırası korunur.
- Drag sırasında yazı seçilmez ve sistem cursor geri gelmez.
- Haftalık ve günlük görünüm mevcut sade tasarım çizgisini korur.
