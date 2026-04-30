export type SinavTuru = 'TYT' | 'AYT'

export interface KaynakKatalogItem {
  id: string
  sinav: SinavTuru
  ders: string
  yayinevi: string
  ad: string
  kapak_url: string
  urun_url: string
}

const row = (
  id: string,
  sinav: SinavTuru,
  ders: string,
  yayinevi: string,
  ad: string,
  kapak: string,
  urun: string
): KaynakKatalogItem => ({
  id,
  sinav,
  ders,
  yayinevi,
  ad,
  kapak_url: `https://www.kitapisler.com/${kapak}`,
  urun_url: `https://www.kitapisler.com/${urun}`,
})

export const KAYNAK_KATALOGU: KaynakKatalogItem[] = [
  row('tyt-mat-01', 'TYT', 'TYT Mat', 'Aktif Öğrenme Yayınları', 'Aktif Öğrenme TYT Maarif Prime Matematik Soru Bankası', 'images_buyuk/f89/aktif-ogrenme-tyt-maarif-prime-m_MTA3NDg5MDkzNg==_1.jpg', 'aktif-ogrenme-tyt-maarif-prime-matematik-soru-bankasi_107489.html'),
  row('tyt-mat-02', 'TYT', 'TYT Mat', 'Madalyon Yayınları', 'Madalyon Yayınları TYT Problemler Soru Bankası', 'images_buyuk/f68/madalyon-yayinlari-tyt-problemle_MTA3MjY4NTUyMA==_1.jpg', 'madalyon-yayinlari-tyt-problemler-soru-bankasi_107268.html'),
  row('tyt-mat-03', 'TYT', 'TYT Mat', 'Karekök Yayınları', 'Karekök Yayınları TYT Mathematics Zero', 'images_buyuk/f65/karekok-yayinlari-tyt-mathematic_MTA3MjY1NDIzMw==_1.jpg', 'karekok-yayinlari-tyt-mathematics-zero_107265.html'),
  row('tyt-mat-04', 'TYT', 'TYT Mat', 'Madalyon Yayınları', 'Madalyon Yayınları TYT Matematik Soru Bankası', 'images_buyuk/f60/madalyon-yayinlari-tyt-matematik_MTA3MjYwMDAwNg==_1.jpg', 'madalyon-yayinlari-tyt-matematik-soru-bankasi_107260.html'),
  row('tyt-mat-05', 'TYT', 'TYT Mat', 'Tasarı Yayınları', 'Tasarı Yayınları TYT KPSS MEB AGS ALES DGS MSÜ Artı Problemler Soru Bankası', 'images_buyuk/f22/tasari-yayinlari-tyt-kpss-meb-ag_MTA2NTIyNDg0MA==_1.jpg', 'tasari-yayinlari-tyt-kpss-meb-ags-ales-dgs-msu-arti-problemler-soru-bankasi_106522.html'),
  row('tyt-mat-06', 'TYT', 'TYT Mat', 'Öğreti Akademi', 'Öğreti Akademi TYT Matematik Soru Bankası', 'images_buyuk/f95/ogreti-akademi-tyt-matematik-sor_MTA2NDk1NDA1Mw==_1.jpg', 'ogreti-akademi-tyt-matematik-soru-bankasi_106495.html'),

  row('tyt-turkce-01', 'TYT', 'TYT Türkçe', 'ENS Yayıncılık', 'ENS Yayıncılık TYT KPSS MSÜ Dil Bilgisi 3 Adımda Video Destekli Soru Bankası', 'images_buyuk/f65/ens-yayincilik-tyt-kpss-msu-dil-_MTA3NDY1NDYyMA==_1.jpg', 'ens-yayincilik-tyt-kpss-msu-dil-bilgisi-3-adimda-video-destekli-soru-bankasi_107465.html'),
  row('tyt-turkce-02', 'TYT', 'TYT Türkçe', 'Başat Yayınları', 'Başat Yayınları TYT Türkçe Soru Bankası', 'images_buyuk/f37/basat-yayinlari-tyt-turkce-soru-_MTA3NDM3MTkxMw==_1.jpg', 'basat-yayinlari-tyt-turkce-soru-bankasi_107437.html'),
  row('tyt-turkce-03', 'TYT', 'TYT Türkçe', 'Madalyon Yayınları', 'Madalyon Yayınları TYT Türkçe Soru Bankası', 'images_buyuk/f67/madalyon-yayinlari-tyt-turkce-so_MTA3MjY3NTIyMA==_1.jpg', 'madalyon-yayinlari-tyt-turkce-soru-bankasi_107267.html'),
  row('tyt-turkce-04', 'TYT', 'TYT Türkçe', 'Retro Yayınları', 'Retro Yayıncılık Tüm Adaylara Yönelik Dil Bilgisi Paragraf Soru Bankası', 'images_buyuk/f6/retro-yayincilik-tum-adaylara-yo_MTA2OTA2MzAyOQ==_1.jpg', 'retro-yayincilik-tum-adaylara-yonelik-dil-bilgisi-paragraf-soru-bankasi_106906.html'),
  row('tyt-turkce-05', 'TYT', 'TYT Türkçe', 'Tasarı Yayınları', 'Tasarı Yayınları TYT KPSS AGS MSÜ Artı Dil Bilgisi Soru Bankası', 'images_buyuk/f98/tasari-yayinlari-tyt-kpss-ags-ms_MTA2ODk4NTI0Mw==_1.jpg', 'tasari-yayinlari-tyt-kpss-ags-msu-arti-dil-bilgisi-soru-bankasi_106898.html'),
  row('tyt-turkce-06', 'TYT', 'TYT Türkçe', '3D Yayınları', '3D Yayınları TYT Paragraf Soru Bankası', 'images_buyuk/f70/3d-yayinlari-tyt-paragraf-soru-b_MTA2NTcwNTk1OA==_1.jpg', '3d-yayinlari-tyt-paragraf-soru-bankasi_106570.html'),

  row('tyt-fen-01', 'TYT', 'TYT Fen', 'Kafa Dengi Yayınları', 'Kafa Dengi Yayınları TYT Challenger Fizik Soru Bankası', 'images_buyuk/f5/kafa-dengi-yayinlari-tyt-challen_MTA1MzA1NDcyNw==_1.jpg', 'kafa-dengi-yayinlari-tyt-challenger-fizik-soru-bankasi_105305.html'),
  row('tyt-fen-02', 'TYT', 'TYT Fen', 'Paraf Yayınları', 'Paraf Yayınları TYT Fizik 24 Saatte Garanti Soru Bankası', 'images_buyuk/f41/paraf-yayinlari-tyt-fizik-24-saa_MTA0MTQxMDU0OA==_1.jpg', 'paraf-yayinlari-tyt-fizik-24-saatte-garanti-soru-bankasi_104141.html'),
  row('tyt-fen-03', 'TYT', 'TYT Fen', 'Oksijen Yayınları', 'Oksijen Yayınları TYT Fizik Soru Bankası', 'images_buyuk/f84/oksijen-yayinlari-tyt-fizik-soru_MTAzOTg0MzYxOQ==_1.jpg', 'oksijen-yayinlari-tyt-fizik-soru-bankasi_103984.html'),
  row('tyt-fen-04', 'TYT', 'TYT Fen', 'Hız Yayınları', 'Hız Yayınları TYT Fizik Soru Bankası', 'images_buyuk/f20/hiz-yayinlari-tyt-fizik-soru-ban_MTAzNjIwMDYxMg==_1.jpg', 'hiz-yayinlari-tyt-fizik-soru-bankasi_103620.html'),
  row('tyt-fen-05', 'TYT', 'TYT Fen', 'Tammat Yayıncılık', 'Tammat Yayıncılık TYT Kimya Origami Soru Bankası', 'images_buyuk/f25/tammat-yayincilik-tyt-kimya-orig_MTA3NDI1MzkxOA==_1.jpg', 'tammat-yayincilik-tyt-kimya-origami-soru-bankasi_107425.html'),
  row('tyt-fen-06', 'TYT', 'TYT Fen', 'Hız ve Renk Yayınları', 'Hız ve Renk TYT Kimya Soru Bankası', 'images_buyuk/f95/hiz-ve-renk-tyt-kimya-soru-banka_MTA2Njk1MjU0NA==_1.jpg', 'hiz-ve-renk-tyt-kimya-soru-bankasi_106695.html'),

  row('tyt-sosyal-01', 'TYT', 'TYT Sosyal', 'Paraf Yayınları', 'Paraf Yayınları TYT Sedat Tekin Tarih 24 Saatte Garanti Soru Bankası', 'images_buyuk/f14/paraf-akademi-tyt-sedat-tekin-ta_MTA0ODE0NTkwNw==_1.jpg', 'paraf-yayinlari-tyt-sedat-tekin-tarih-24-saatte-garanti-soru-bankasi_104814.html'),
  row('tyt-sosyal-02', 'TYT', 'TYT Sosyal', 'Oksijen Yayınları', 'Oksijen Yayınları TYT Tarih Soru Bankası', 'images_buyuk/f89/oksijen-yayinlari-tyt-tarih-soru_MTAzOTg5NDYwMw==_1.jpg', 'oksijen-yayinlari-tyt-tarih-soru-bankasi_103989.html'),
  row('tyt-sosyal-03', 'TYT', 'TYT Sosyal', 'Hız Yayınları', 'Hız Yayınları TYT Tarih Soru Bankası', 'images_buyuk/f28/hiz-yayinlari-tyt-tarih-soru-ban_MTAzNjI4MTcxNw==_1.jpg', 'hiz-yayinlari-tyt-tarih-soru-bankasi_103628.html'),
  row('tyt-sosyal-04', 'TYT', 'TYT Sosyal', 'Madalyon Yayınları', 'Madalyon Yayınları TYT Coğrafya Soru Bankası', 'images_buyuk/f75/madalyon-yayinlari-tyt-cografya-_MTA3Mjc1MTUzNA==_1.jpg', 'madalyon-yayinlari-tyt-cografya-soru-bankasi_107275.html'),
  row('tyt-sosyal-05', 'TYT', 'TYT Sosyal', 'Limit Yayınları', 'Limit Yayınları TYT Coğrafya Soru Bankası', 'images_buyuk/f44/limit-yayinlari-tyt-cografya-sor_MTA3MjQ0MzU0Ng==_1.jpg', 'limit-yayinlari-tyt-cografya-soru-bankasi_107244.html'),
  row('tyt-sosyal-06', 'TYT', 'TYT Sosyal', 'ENS Yayıncılık', 'ENS Yayıncılık TYT Coğrafya Destek Defterim', 'images_buyuk/f84/ens-yayincilik-tyt-cografya-dest_MTA2Nzg0MTI0Ng==_1.jpg', 'ens-yayincilik-tyt-cografya-destek-defterim_106784.html'),

  row('ayt-mat-01', 'AYT', 'AYT Mat', 'Madalyon Yayınları', 'Madalyon Yayınları AYT Matematik Soru Bankası', 'images_buyuk/f74/madalyon-yayinlari-ayt-matematik_MTA3Mjc0MTM1MQ==_1.jpg', 'madalyon-yayinlari-ayt-matematik-soru-bankasi_107274.html'),
  row('ayt-mat-02', 'AYT', 'AYT Mat', 'Doktrin Yayınları', 'Doktrin Yayınları AYT Sıfırdan Sonsuza Matematik Kesin Net Arttıran Sorular ve İlk 10 Soru', 'images_buyuk/f29/doktrin-yayinlari-ayt-sifirdan-s_MTA3MDI5MTA1OA==_1.jpg', 'doktrin-yayinlari-ayt-sifirdan-sonsuza-matematik-kesin-net-arttiran-sorular-ve-ilk-10-soru_107029.html'),
  row('ayt-mat-03', 'AYT', 'AYT Mat', 'Metin Yayınları', 'Metin Yayınları Karman Çorman AYT Matematik Tekrar Kitabı', 'images_buyuk/f17/metin-yayinlari-karman-corman-ay_MTA2OTE3MTgzOA==_1.jpg', 'metin-yayinlari-karman-corman-ayt-matematik-tekrar-kitabi_106917.html'),
  row('ayt-mat-04', 'AYT', 'AYT Mat', 'Pegem Yayınları', 'Pegem Yayınları AYT Matematik Limit Türev İntegral Tamamı Çözümlü Soru Bankası', 'images_buyuk/f94/pegem-yayinlari-ayt-matematik-li_MTA2NDk0MjAzMg==_1.jpg', 'pegem-yayinlari-ayt-matematik-limit-turev-integral-tamami-cozumlu-soru-bankasi_106494.html'),
  row('ayt-mat-05', 'AYT', 'AYT Mat', 'Matematik Vadisi Yayınları', 'Matematik Vadisi İntegral Tamamı Video Çözümlü Soru Bankası', 'images_buyuk/f10/matematik-vadisi-integral-tamami_MTA2NDEwNDkwNw==_1.jpg', 'matematik-vadisi-integral-tamami-video-cozumlu-soru-bankasi_106410.html'),
  row('ayt-mat-06', 'AYT', 'AYT Mat', 'Ders Platosu', 'Pion Yayınları AYT Trigonometri Ders Platosu 2X Hızında Tekrar', 'images_buyuk/f93/pion-yayinlari-ayt-trigonometri-_MTA2MzkzMzQzNw==_1.jpg', 'pion-yayinlari-ayt-trigonometri-ders-platosu-2x-hizinda-tekrar_106393.html'),

  row('ayt-fizik-01', 'AYT', 'AYT Fizik', 'Orijinal Yayınları', 'Orijinal Yayınları AYT Fizik Soru Bankası', 'images_buyuk/f93/orijinal-yayinlari-ayt-fizik-sor_MTA2OTkzMTQxNg==_1.jpg', 'orijinal-yayinlari-ayt-fizik-soru-bankasi_106993.html'),
  row('ayt-fizik-02', 'AYT', 'AYT Fizik', 'KR Akademi', 'KR Akademi 2026 AYT Twins Fizik Soru Bankası', 'images_buyuk/f12/kr-akademi-2026-ayt-twins-fizik-_MTA2MjEyMzMxOQ==_1.jpg', 'kr-akademi-2026-ayt-twins-fizik-soru-bankasi_106212.html'),
  row('ayt-fizik-03', 'AYT', 'AYT Fizik', 'Apotemi Yayınları', 'Apotemi Yayınları AYT Fizik Soru Bankası', 'images_buyuk/f84/apotemi-yayinlari-ayt-fizik-soru_MTA2MDg0MjEwMA==_1.jpg', 'apotemi-yayinlari-ayt-fizik-soru-bankasi_106084.html'),
  row('ayt-fizik-04', 'AYT', 'AYT Fizik', 'Paraf Yayınları', 'Paraf Yayınları AYT Mor Fizik Soru Kütüphanesi', 'images_buyuk/f66/paraf-yayinlari-ayt-mor-fizik-so_MTA1NzY2NDEzOQ==_1.jpg', 'paraf-yayinlari-ayt-mor-fizik-soru-kutuphanesi_105766.html'),
  row('ayt-fizik-05', 'AYT', 'AYT Fizik', 'Zeduva Yayınları', 'Zeduva Yayınları Fizikfinito AYT Fizik 1 Kitap 3 Kamp Soru Bankası', 'images_buyuk/f30/zeduva-yayinlari-fizikfinito-ayt_MTA1NDMwMjgwMw==_1.jpg', 'zeduva-yayinlari-fizikfinito-ayt-fizik-1-kitap-3-kamp-soru-bankasi_105430.html'),
  row('ayt-fizik-06', 'AYT', 'AYT Fizik', 'Benim Hocam Yayınları', 'Benim Hocam 2026 AYT Fizik Soru Bankası', 'images_buyuk/f6/benim-hocam-2026-ayt-fizik-soru-_MTA0NDA2MDkyOA==_1.jpg', 'benim-hocam-2026-ayt-fizik-soru-bankasi_104406.html'),

  row('ayt-kimya-01', 'AYT', 'AYT Kimya', 'Parlayan Projeler', 'Sinan İhtiyaroğlu AYT Kimya Soru Bankası', 'images_buyuk/f21/sinan-ihtiyaroglu-ayt-kimya-soru_MTA3MzIxMDczOA==_1.jpg', 'sinan-ihtiyaroglu-ayt-kimya-soru-bankasi_107321.html'),
  row('ayt-kimya-02', 'AYT', 'AYT Kimya', 'KR Akademi', 'KR Akademi Celal Hoca AYT Kimya Soru Bankası', 'images_buyuk/f41/kr-akademi-celal-hoca-ayt-kimya-_MTA2OTQxMjIwNQ==_1.jpg', 'kr-akademi-celal-hoca-ayt-kimya-soru-bankasi_106941.html'),
  row('ayt-kimya-03', 'AYT', 'AYT Kimya', 'Orbital Yayınları', 'Orbital Yayınları AYT Kimya Ferrum Tekrar Soru Kampı', 'images_buyuk/f88/orbital-yayinlari-ayt-kimya-ferr_MTA2Mjg4NTkzNw==_1.jpg', 'orbital-yayinlari-ayt-kimya-ferrum-tekrar-soru-kampi_106288.html'),
  row('ayt-kimya-04', 'AYT', 'AYT Kimya', 'ENS Yayıncılık', 'ENS Yayıncılık AYT Kimya Soru Bankası', 'images_buyuk/f88/ens-yayincilik-ayt-kimya-soru-ba_MTA1Njg4Mjk1NA==_1.jpg', 'ens-yayincilik-ayt-kimya-soru-bankasi_105688.html'),
  row('ayt-kimya-05', 'AYT', 'AYT Kimya', 'Oksijen Yayınları', 'Oksijen Yayınları AYT Kimya Soru Bankası', 'images_buyuk/f26/oksijen-yayinlari-ayt-kimya-soru_MTA0ODI2MjEyMQ==_1.jpg', 'oksijen-yayinlari-ayt-kimya-soru-bankasi_104826.html'),
  row('ayt-kimya-06', 'AYT', 'AYT Kimya', 'Hız Yayınları', 'Hız Yayınları AYT Kimya Soru Bankası', 'images_buyuk/f91/hiz-yayinlari-ayt-kimya-soru-ban_MTAzNTkxNTExMg==_1.jpg', 'hiz-yayinlari-ayt-kimya-soru-bankasi_103591.html'),

  row('ayt-bio-01', 'AYT', 'AYT Bio', 'Limit Yayınları', 'Limit Yayınları AYT Biyoloji Soru Bankası', 'images_buyuk/f73/limit-yayinlari-ayt-biyoloji-sor_MTA3MTczMzEzNA==_1.jpg', 'limit-yayinlari-ayt-biyoloji-soru-bankasi_107173.html'),
  row('ayt-bio-02', 'AYT', 'AYT Bio', 'Biyotik Yayınları', 'Biyotik Yayınları AYT Biyoloji Soru Kampı', 'images_buyuk/f55/biyotik-yayinlari-ayt-biyoloji-s_MTA2ODU1NDczNA==_1.jpg', 'biyotik-yayinlari-ayt-biyoloji-soru-kampi_106855.html'),
  row('ayt-bio-03', 'AYT', 'AYT Bio', 'IQ Yayınları', 'IQ Yayınları AYT Biyoloji Başlıyorum Soru Bankası', 'images_buyuk/f83/iq-yayinlari-ayt-biyoloji-basliy_MTA2MDgzMjUxMw==_1.jpg', 'iq-yayinlari-ayt-biyoloji-basliyorum-soru-bankasi_106083.html'),
  row('ayt-bio-04', 'AYT', 'AYT Bio', 'Hız ve Renk Yayınları', 'Hız ve Renk Yayınları AYT Sistemler Soru Bankası', 'images_buyuk/f87/hiz-ve-renk-yayinlari-ayt-sistem_MTA1Njg3NDgyNw==_1.jpg', 'hiz-ve-renk-yayinlari-ayt-sistemler-soru-bankasi_105687.html'),
  row('ayt-bio-05', 'AYT', 'AYT Bio', 'Zeduva Yayınları', 'Zeduva Yayınları AYT Biosem Biyoloji 1 Kitap 3 Kamp Soru Bankası', 'images_buyuk/f72/zeduva-yayinlari-ayt-biosem-biyo_MTA1NjcyNDAzMA==_1.jpg', 'zeduva-yayinlari-ayt-biosem-biyoloji-1-kitap-3-kamp-soru-bankasi_105672.html'),
  row('ayt-bio-06', 'AYT', 'AYT Bio', 'KR Akademi', 'KR Akademi Betül Biyoloji AYT Biyoloji Soru Bankası', 'images_buyuk/f44/kr-akademi-betul-biyoloji-ayt-bi_MTA1NTQ0MDU0MA==_1.jpg', 'kr-akademi-betul-biyoloji-ayt-biyoloji-soru-bankasi_105544.html'),

  row('ayt-edebiyat-01', 'AYT', 'AYT Edebiyat', 'Yayın Denizi', 'Yayın Denizi AYT Edebiyat Soru Bankası', 'images_buyuk/f52/yayin-denizi-ayt-edebiyat-soru-b_MTA3NDUyMzk0OQ==_1.jpg', 'yayin-denizi-ayt-edebiyat-soru-bankasi_107452.html'),
  row('ayt-edebiyat-02', 'AYT', 'AYT Edebiyat', 'KR Akademi', 'KR Akademi Deniz Hoca AYT Edebiyat Meşakkat Serisi Soru Bankası', 'images_buyuk/f96/kr-akademi-deniz-hoca-ayt-edebiy_MTA2Nzk2MjY1Mg==_1.jpg', 'kr-akademi-deniz-hoca-ayt-edebiyat-mesakkat-serisi-soru-bankasi_106796.html'),
  row('ayt-edebiyat-03', 'AYT', 'AYT Edebiyat', 'Hız Yayınları', 'Hız Yayınları AYT Türk Dili ve Edebiyatı Soru Bankası', 'images_buyuk/f99/hiz-yayinlari-ayt-turk-dili-ve-e_MTAzNTk5MDE1MA==_1.jpg', 'hiz-yayinlari-ayt-turk-dili-ve-edebiyati-soru-bankasi_103599.html'),
  row('ayt-edebiyat-04', 'AYT', 'AYT Edebiyat', 'Hız ve Renk Yayınları', 'Hız ve Renk AYT Edebiyat Soru Bankası', 'images_buyuk/f15/hiz-ve-renk-ayt-edebiyat-soru-ba_MTAzNTE1MzIzNg==_1.jpg', 'hiz-ve-renk-ayt-edebiyat-soru-bankasi_103515.html'),
  row('ayt-edebiyat-05', 'AYT', 'AYT Edebiyat', 'Madalyon Yayınları', 'Madalyon Yayınları AYT Edebiyat Soru Bankası', 'images_buyuk/f78/madalyon-yayinlari-ayt-edebiyat-_MTAzMjc4MDkyOQ==_1.jpg', 'madalyon-yayinlari-ayt-edebiyat-soru-bankasi_103278.html'),
  row('ayt-edebiyat-06', 'AYT', 'AYT Edebiyat', 'ENS Yayıncılık', 'ENS Yayıncılık AYT Türk Dili ve Edebiyatı Destek Defterim', 'images_buyuk/f48/ens-yayincilik-ayt-turk-dili-ve-_MTAzMTQ4NDg0MQ==_1.jpg', 'ens-yayincilik-ayt-turk-dili-ve-edebiyati-destek-defterim_103148.html'),

  row('ayt-tarih-01', 'AYT', 'AYT Tarih', 'Zeduva Yayınları', 'Zeduva Yayınları Soner Ardıç AYT Tarih 1 Kitap 3 Kamp Soru Bankası', 'images_buyuk/f5/zeduva-yayinlari-soner-ardic-ayt_MTA1NDA1MjkxMg==_1.jpg', 'zeduva-yayinlari-soner-ardic-ayt-tarih-1-kitap-3-kamp-soru-bankasi_105405.html'),
  row('ayt-tarih-02', 'AYT', 'AYT Tarih', 'KR Akademi', 'KR Akademi Sadettin Hoca AYT Tarih Soru Bankası', 'images_buyuk/f27/kr-akademi-sadettin-hoca-ayt-tar_MTA0NTI3MjQwNg==_1.jpg', 'kr-akademi-sadettin-hoca-ayt-tarih-soru-bankasi_104527.html'),
  row('ayt-tarih-03', 'AYT', 'AYT Tarih', 'Hız Yayınları', 'Hız Yayınları AYT Tarih Soru Bankası', 'images_buyuk/f98/hiz-yayinlari-ayt-tarih-soru-ban_MTAzNTk4NTkwNg==_1.jpg', 'hiz-yayinlari-ayt-tarih-soru-bankasi_103598.html'),
  row('ayt-tarih-04', 'AYT', 'AYT Tarih', 'Madalyon Yayınları', 'Madalyon Yayınları AYT Tarih Soru Bankası', 'images_buyuk/f79/madalyon-yayinlari-ayt-tarih-sor_MTAzMjc5MTA1NQ==_1.jpg', 'madalyon-yayinlari-ayt-tarih-soru-bankasi_103279.html'),
  row('ayt-tarih-05', 'AYT', 'AYT Tarih', 'Benim Hocam Yayınları', 'Benim Hocam Yayınları 2026 AYT Tarih Video Çözümlü Soru Bankası', 'images_buyuk/f11/benim-hocam-yayinlari-2026-ayt-t_MTAyNjExMDEzOA==_1.jpg', 'benim-hocam-yayinlari-2026-ayt-tarih-video-cozumlu-soru-bankasi_102611.html'),
  row('ayt-tarih-06', 'AYT', 'AYT Tarih', 'IQ Yayınları', 'IQ Yayınları AYT Tarih Püf Soru Bankası', 'images_buyuk/f2/iq-yayinlari-ayt-tarih-puf-soru-_MTAyMzAyMjEyMA==_1.jpg', 'iq-yayinlari-ayt-tarih-puf-soru-bankasi_102302.html'),
]

export const KAYNAK_DERSLER = Array.from(new Set(KAYNAK_KATALOGU.map(kaynak => kaynak.ders)))
export const KAYNAK_YAYINEVLERI = Array.from(new Set(KAYNAK_KATALOGU.map(kaynak => kaynak.yayinevi))).sort((a, b) => a.localeCompare(b, 'tr'))
