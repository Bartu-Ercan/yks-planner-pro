export type SinavTuru = 'TYT' | 'AYT'

export interface KaynakKatalogItem {
  id: string
  sinav: SinavTuru
  ders: string
  yayinevi: string
  ad: string
  kapak_url: string
  urun_url: string
  populerlik: number
}

const row = (
  id: string,
  sinav: SinavTuru,
  ders: string,
  yayinevi: string,
  ad: string,
  kapak: string,
  urun: string,
  populerlik = 50
): KaynakKatalogItem => ({
  id,
  sinav,
  ders,
  yayinevi,
  ad,
  kapak_url: kapak.startsWith('http') ? kapak : `https://www.kitapisler.com/${kapak}`,
  urun_url: urun.startsWith('http') ? urun : `https://www.kitapisler.com/${urun}`,
  populerlik,
})

export const KAYNAK_DERS_TUMU = 'Tümü'

export const YAYINEVI_ONCELIK = [
  '3D Yayınları',
  '345 Yayınları',
  'Orijinal Yayınları',
  'Bilgi Sarmal',
  'Paraf Yayınları',
  'Çap Yayınları',
  'Apotemi Yayınları',
  'Karekök Yayınları',
  'Palme Yayınları',
  'Limit Yayınları',
  'Hız ve Renk Yayınları',
  'Benim Hocam Yayınları',
  'KR Akademi',
  'Yayın Denizi',
  'Miray Yayınları',
  'Endemik Yayınları',
  'Acil Yayınları',
  'Barış Yayınları',
]

const yayineviOncelik = (yayinevi: string) => {
  const index = YAYINEVI_ONCELIK.findIndex(item => yayinevi.toLocaleLowerCase('tr').includes(item.toLocaleLowerCase('tr')))
  return index === -1 ? 999 : index
}

export const kaynakSirala = (a: KaynakKatalogItem, b: KaynakKatalogItem) =>
  (b.populerlik || 0) - (a.populerlik || 0) ||
  yayineviOncelik(a.yayinevi) - yayineviOncelik(b.yayinevi) ||
  a.ad.localeCompare(b.ad, 'tr')

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

  row('genis-3d-tyt-paragraf-01', 'TYT', 'TYT Türkçe', '3D Yayınları', '3D Yayınları TYT AYT Paragraf Soru Bankası', 'images_buyuk/f67/3d-yayinlari-tyt-ayt-paragraf-so_MTAyMDY3NDM0Ng==_1.jpg', '3d-yayinlari-tyt-ayt-paragraf-konu-ozetli-soru-bankasi_102067.html', 98),
  row('genis-3d-tyt-turkce-01', 'TYT', 'TYT Türkçe', '3D Yayınları', '3D Yayınları Ses Yazım Noktalama Konu Özetli Soru Bankası', 'images_buyuk/f64/3d-yayinlari-ses-yazim-noktalama_MTA1NDY0MjIzNA==_1.jpg', '3d-yayinlari-ses-yazim-noktalama-konu-ozetli-soru-bankasi_105464.html', 92),
  row('genis-3d-ayt-edebiyat-01', 'AYT', 'AYT Edebiyat', '3D Yayınları', '3D Yayınları AYT Edebiyat Video Destekli Defter', 'images_buyuk/f64/3d-yayinlari-ayt-edebiyat-video-_MTA1MjY0MzU1NQ==_1.jpg', '3d-yayinlari-ayt-edebiyat-video-destekli-defter_105264.html', 88),
  row('genis-3d-ayt-kimya-01', 'AYT', 'AYT Kimya', '3D Yayınları', '3D Yayınları AYT Kimya Video Destekli Defter', 'images_buyuk/f98/3d-yayinlari-ayt-kimya-video-des_OTk1OTgyNjUz_1.jpg', '3d-yayinlari-ayt-kimya-video-destekli-defter_99598.html', 86),
  row('genis-3d-ayt-tarih-01', 'AYT', 'AYT Tarih', '3D Yayınları', '3D Yayınları AYT Tarih Video Destekli Defter', 'images_buyuk/f63/3d-yayinlari-ayt-tarih-video-des_MTA1MjYzMjMxMg==_1.jpg', '3d-yayinlari-ayt-tarih-video-destekli-defter_105263.html', 82),
  row('345-01', 'TYT', 'TYT Türkçe', '345 Yayınları', '1 Haftada TYT Dil Bilgisi', 'https://www.ucdortbes.com/wp-content/uploads/2025/11/UDB_1-HAFTA-DILBILISI-KAPAK-256x313.png', 'https://www.ucdortbes.com/1-haftada-tyt-dil-bilgisi.html', 91),
  row('345-02', 'TYT', 'TYT Fen', '345 Yayınları', 'TYT Biyoloji 30’lu Deneme', 'https://www.ucdortbes.com/wp-content/uploads/2024/10/UDB_30lu-BIYOLOJIBRANS-DK_2026-256x313.png', 'https://www.ucdortbes.com/tyt-biyoloji-30lu-deneme.html', 82),
  row('345-03', 'TYT', 'TYT Fen', '345 Yayınları', 'TYT Fizik 30’lu Deneme', 'https://www.ucdortbes.com/wp-content/uploads/2024/10/UDB_30lu-FIZIKBRANS-DK_2026-256x313.png', 'https://www.ucdortbes.com/tyt-fizik-30lu-deneme.html', 82),
  row('345-04', 'TYT', 'TYT Fen', '345 Yayınları', 'TYT Kimya 30’lu Deneme', 'https://www.ucdortbes.com/wp-content/uploads/2024/10/UDB_30lu-KIMYABRANS-DK_2026-256x313.png', 'https://www.ucdortbes.com/tyt-kimya-30lu-deneme.html', 82),
  row('genis-345-tyt-fen-01', 'TYT', 'TYT Fen', '345 Yayınları', 'TYT 25’li Fen Bilimleri Deneme', 'https://www.ucdortbes.com/wp-content/uploads/2024/11/TYT-25-FEN-DENEME-KAPAK-2026-256x313.png', 'https://www.ucdortbes.com/tyt-25li-fen-bilimleri-deneme.html', 83),
  row('345-06', 'TYT', 'TYT Türkçe', '345 Yayınları', 'TYT 12’li Türkçe Deneme', 'https://www.ucdortbes.com/wp-content/uploads/2024/11/TYT-12-TURKCE-DENEME-KAPAK-2026-256x313.png', 'https://www.ucdortbes.com/tyt-12li-turkce-deneme.html', 84),
  row('345-07', 'TYT', 'TYT Mat', '345 Yayınları', 'TYT 10’lu Matematik Deneme', 'https://www.ucdortbes.com/wp-content/uploads/2025/02/TYT-MAT-10-DENEME-2026-1-256x313.png', 'https://www.ucdortbes.com/tyt-10lu-matematik-deneme.html', 86),
  row('345-08', 'TYT', 'TYT Fen', '345 Yayınları', 'TYT Kimya Soru Bankası', 'https://www.ucdortbes.com/wp-content/uploads/2024/07/TYT-Kimya-2026-Kapak-Kopya-256x313.png', 'https://www.ucdortbes.com/tyt-kimya-soru-bankasi.html', 88),
  row('345-09', 'TYT', 'TYT Fen', '345 Yayınları', 'TYT Biyoloji Soru Bankası', 'https://www.ucdortbes.com/wp-content/uploads/2024/07/TYT-Biyoloji-2026-Kapak-Kopya-256x313.png', 'https://www.ucdortbes.com/tyt-biyoloji-soru-bankasi.html', 88),
  row('345-10', 'TYT', 'TYT Türkçe', '345 Yayınları', 'TYT Türkçe Soru Bankası', 'https://www.ucdortbes.com/wp-content/uploads/2024/07/TYT-Turkce-2026-Kapak-1-256x313.png', 'https://www.ucdortbes.com/tyt-turkce-soru-bankasi.html', 90),
  row('345-11', 'TYT', 'TYT Fen', '345 Yayınları', 'TYT Fizik Soru Bankası', 'https://www.ucdortbes.com/wp-content/uploads/2024/07/TYT-Fizik-2026-Kapak-256x313.png', 'https://www.ucdortbes.com/tyt-fizik-soru-bankasi.html', 88),
  row('345-12', 'TYT', 'TYT Mat', '345 Yayınları', 'TYT-AYT Geometri Soru Bankası (1. Kitap)', 'https://www.ucdortbes.com/wp-content/uploads/2024/07/Geometri-1-2026-Kapak-1-256x313.png', 'https://www.ucdortbes.com/tyt-ayt-geometri-soru-bankasi-1-kitap.html', 90),
  row('genis-345-tyt-mat-01', 'TYT', 'TYT Mat', '345 Yayınları', 'TYT Matematik Soru Bankası', 'https://www.ucdortbes.com/wp-content/uploads/2024/07/TYT-Matematik-2026-Kapak-256x313.png', 'https://www.ucdortbes.com/tyt-matematik-soru-bankasi.html', 96),
  row('345-14', 'TYT', 'TYT Sosyal', '345 Yayınları', '1 Ayda Tüm TYT Sosyal Soru Bankası', 'https://www.ucdortbes.com/wp-content/uploads/2024/03/345-1-AYDA-SOSYAL-SB-2025-1-256x313.png', 'https://www.ucdortbes.com/1-ayda-tum-tyt-sosyal-soru-bankasi.html', 87),
  row('345-15', 'TYT', 'TYT Sosyal', '345 Yayınları', 'TYT Coğrafya Soru Bankası', 'https://www.ucdortbes.com/wp-content/uploads/2023/08/Cografya-256x313.png', 'https://www.ucdortbes.com/tyt-cografya-soru-bankasi.html', 82),
  row('345-16', 'TYT', 'TYT Genel Deneme', '345 Yayınları', 'TYT Tüm Dersler 5’li Paket Deneme', 'https://www.ucdortbes.com/wp-content/uploads/2023/01/tyt-5li-1100x1343-2024-website-256x313.png', 'https://www.ucdortbes.com/tyt-tum-dersler-5li-paket-deneme.html', 80),
  row('345-17', 'AYT', 'AYT Edebiyat', '345 Yayınları', 'AYT 10’lu Edebiyat – Sosyal 1 Deneme', 'https://www.ucdortbes.com/wp-content/uploads/2025/04/345-AYT-EDEBIYAT-SOSYAL-1-KAPAK-256x313.png', 'https://www.ucdortbes.com/ayt-10lu-edebiyat-sosyal-1-deneme.html', 83),
  row('345-18', 'AYT', 'AYT Mat', '345 Yayınları', 'AYT 10’lu Matematik Deneme', 'https://www.ucdortbes.com/wp-content/uploads/2025/05/345-AYT-10LU-MATEMATIK-256x313.png', 'https://www.ucdortbes.com/ayt-10lu-matematik-deneme.html', 87),
  row('345-19', 'AYT', 'AYT Kimya', '345 Yayınları', 'AYT Kimya 20’li Deneme', 'https://www.ucdortbes.com/wp-content/uploads/2025/04/AYT-Kimya-Brans-20li-2026-256x313.png', 'https://www.ucdortbes.com/ayt-kimya-20li-deneme.html', 82),
  row('345-20', 'AYT', 'AYT Bio', '345 Yayınları', 'AYT Biyoloji 20’li Deneme', 'https://www.ucdortbes.com/wp-content/uploads/2025/04/AYT-Biyoloji-Brans-20li-2026-256x313.png', 'https://www.ucdortbes.com/ayt-biyoloji-20li-deneme.html', 82),
  row('345-21', 'AYT', 'AYT Fizik', '345 Yayınları', 'AYT Fizik 20’li Deneme', 'https://www.ucdortbes.com/wp-content/uploads/2026/03/AYT-Fizik-Brans-20li-2026-256x313.png', 'https://www.ucdortbes.com/ayt-fizik-20li-deneme.html', 82),
  row('345-22', 'AYT', 'AYT Genel Deneme', '345 Yayınları', 'AYT 10’lu Fen Bilimleri Deneme', 'https://www.ucdortbes.com/wp-content/uploads/2025/03/345-AYT-10LU-FEN-DENEME-256x313.png', 'https://www.ucdortbes.com/ayt-10lu-fen-bilimleri-deneme.html', 80),
  row('345-23', 'AYT', 'AYT Edebiyat', '345 Yayınları', 'AYT Edebiyat Soru Bankası', 'https://www.ucdortbes.com/wp-content/uploads/2024/10/AYT-EDEBIYAT-2026-256x313.png', 'https://www.ucdortbes.com/ayt-edebiyat-soru-bankasi.html', 87),
  row('345-24', 'AYT', 'AYT Kimya', '345 Yayınları', 'AYT Kimya Konu Özetli Soru Bankası', 'https://www.ucdortbes.com/wp-content/uploads/2024/07/AYT-KIMYA-2026-Kopya-256x313.png', 'https://www.ucdortbes.com/ayt-kimya-konu-ozetli-soru-bankasi.html', 89),
  row('345-25', 'AYT', 'AYT Bio', '345 Yayınları', 'AYT Biyoloji Konu Özetli Soru Bankası', 'https://www.ucdortbes.com/wp-content/uploads/2024/07/AYT-BIYOLOJI-2026-Kopya-256x313.png', 'https://www.ucdortbes.com/ayt-biyoloji-soru-bankasi.html', 89),
  row('345-26', 'AYT', 'AYT Fizik', '345 Yayınları', 'AYT Fizik Soru Bankası', 'https://www.ucdortbes.com/wp-content/uploads/2024/07/AYT-FIZIK-2026-Kopya-256x313.png', 'https://www.ucdortbes.com/ayt-fizik-soru-bankasi.html', 89),
  row('genis-345-ayt-mat-01', 'AYT', 'AYT Mat', '345 Yayınları', 'AYT Matematik Soru Bankası', 'https://www.ucdortbes.com/wp-content/uploads/2024/07/AYT-MATEMATIK-2026-256x313.png', 'https://www.ucdortbes.com/ayt-matematik-soru-bankasi.html', 95),
  row('345-28', 'TYT', 'TYT Mat', '345 Yayınları', 'Start Geometri', 'https://www.ucdortbes.com/wp-content/uploads/2025/12/UDB_START-GEOMETRI-KAPAK-3D-256x313.png', 'https://www.ucdortbes.com/start-geometri.html', 86),
  row('345-29', 'TYT', 'TYT Türkçe', '345 Yayınları', '20 Adet Paragraf Denemesi', 'https://www.ucdortbes.com/wp-content/uploads/2024/11/UDB_20li-PARAGRAF-DK_2026-1-256x313.png', 'https://www.ucdortbes.com/20-paragraf-denemesi.html', 82),
  row('345-30', 'TYT', 'TYT Türkçe', '345 Yayınları', 'Paragraf Sıfır Risk', 'https://www.ucdortbes.com/wp-content/uploads/2024/07/TYT-SIFIR-RISK-2026-Kapak-256x313.png', 'https://www.ucdortbes.com/paragraf-sifir-risk.html', 86),
  row('345-31', 'TYT', 'TYT Mat', '345 Yayınları', 'TYT-AYT Geometri Soru Bankası (2. Kitap)', 'https://www.ucdortbes.com/wp-content/uploads/2024/12/Geometri-2-256x313.png', 'https://www.ucdortbes.com/tyt-ayt-geometri-soru-bankasi-2-kitap.html', 89),
  row('genis-orijinal-ayt-mat-01', 'AYT', 'AYT Mat', 'Orijinal Yayınları', 'Orijinal Yayınları AYT Matematik Referans 12 li Deneme Sınavı', 'images_buyuk/f35/orijinal-yayinlari-ayt-matematik_MTA1OTM1MjE0OQ==_1.jpg', 'orijinal-yayinlari-ayt-matematik-referans-12-li-deneme-sinavi_105935.html', 93),
  row('genis-orijinal-tyt-mat-01', 'TYT', 'TYT Mat', 'Orijinal Yayınları', 'Orijinal Yayınları TYT Sayılar Denemetre 30 lu Konu Denemesi', 'images_buyuk/f25/orijinal-yayinlari-tyt-sayilar-d_MTA2MDI1MDk1Ng==_1.jpg', 'orijinal-yayinlari-tyt-sayilar-denemetre-30-lu-konu-denemesi_106025.html', 88),
  row('genis-orijinal-tyt-fen-01', 'TYT', 'TYT Fen', 'Orijinal Yayınları', 'Orijinal Mikro TYT Fizik 30 lu Deneme Sınavı', 'images_buyuk/f4/orijinal-mikro-tyt-fizik-30-lu-d_MTA1OTA0NDA0MA==_1.jpg', 'orijinal-mikro-tyt-fizik-30-lu-deneme-sinavi_105904.html', 82),
  row('genis-bilgi-tyt-mat-01', 'TYT', 'TYT Mat', 'Bilgi Sarmal', 'Bilgi Sarmal TYT Matematik 49 Günde Video Ders Kitabı', 'images_buyuk/f82/bilgi-sarmal-tyt-matematik-49-gu_MTAyNDgyMDc0Mg==_1.jpg', 'bilgi-sarmal-tyt-matematik-49-gunde-video-ders-kitabi_102482.html', 94),
  row('genis-bilgi-tyt-fen-01', 'TYT', 'TYT Fen', 'Bilgi Sarmal', 'Bilgi Sarmal TYT Biyoloji 23 Günde Video Ders Kitabı', 'images_buyuk/f83/bilgi-sarmal-tyt-biyoloji-23-gun_MTAyNDgzMTA1Nw==_1.jpg', 'bilgi-sarmal-tyt-biyoloji-23-gunde-video-ders-kitabi_102483.html', 88),
  row('genis-bilgi-tyt-ayt-geometri-01', 'TYT', 'TYT Mat', 'Bilgi Sarmal', 'Bilgi Sarmal TYT AYT Geometri Soru Bankası', 'images_buyuk/f56/bilgi-sarmal-tyt-ayt-geometri-so_MTAyMzU2NTIwNw==_1.jpg', 'bilgi-sarmal-tyt-ayt-geometri-soru-bankasi_102356.html', 91),
  row('genis-bilgi-tyt-turkce-01', 'TYT', 'TYT Türkçe', 'Bilgi Sarmal', 'Bilgi Sarmal Paragraf Stratejik Hamlelerle Soru ve Konu Kampı', 'images_buyuk/f59/bilgi-sarmal-paragraf-stratejik-_MTA1MjU5MzI0Mw==_1.jpg', 'bilgi-sarmal-paragraf-stratejik-hamlelerle-soru-ve-konu-kampi_105259.html', 89),
  row('genis-paraf-tyt-mat-01', 'TYT', 'TYT Mat', 'Paraf Yayınları', 'Paraf Yayınları TYT 30 Günde Hedef 15 Net Matematik Video Ders Kitabı', 'images_buyuk/f29/paraf-yayinlari-tyt-30-gunde-hed_MTA1OTI5MTM0OA==_1.jpg', 'paraf-yayinlari-tyt-30-gunde-hedef-15-net-matematik-video-ders-kitabi_105929.html', 90),
  row('genis-paraf-ayt-mat-01', 'AYT', 'AYT Mat', 'Paraf Yayınları', 'Paraf Yayınları AYT Matematik Elit Karma 10 Deneme', 'images_buyuk/f80/paraf-yayinlari-ayt-matematik-el_MTA3MjgwNTMwOQ==_1.jpg', 'paraf-yayinlari-ayt-matematik-elit-karma-10-deneme_107280.html', 89),
  row('genis-paraf-tyt-turkce-01', 'TYT', 'TYT Türkçe', 'Paraf Yayınları', 'Paraf Yayınları TYT IQ Türkçe Video Çözümlü 15 Branş Deneme', 'images_buyuk/f42/paraf-yayinlari-tyt-iq-turkce-vi_MTA2MDQyMjcwMA==_1.jpg', 'paraf-yayinlari-tyt-iq-turkce-video-cozumlu-15-brans-deneme_106042.html', 84),
  row('genis-cap-tyt-mat-01', 'TYT', 'TYT Mat', 'Çap Yayınları', 'Çap Yayınları TYT MSÜ Matematik Ders Platosu Son 5 Yıl İkiz Çıkmış Sorular', 'images_buyuk/f73/cap-yayinlari-tyt-msu-matematik-_MTA2OTczNTk0Mw==_1.jpg', 'cap-yayinlari-tyt-msu-matematik-ders-platosu-son-5-yil-ikiz-cikmis-sorular_106973.html', 87),
  row('genis-cap-tyt-turkce-01', 'TYT', 'TYT Türkçe', 'Çap Yayınları', 'Çap Yayınları TYT MSÜ Türkçe Ders Platosu Son 5 Yıl İkiz Çıkmış Sorular', 'images_buyuk/f16/cap-yayinlari-tyt-msu-turkce-der_MTA2OTE2NTcwNg==_1.jpg', 'cap-yayinlari-tyt-msu-turkce-ders-platosu-son-5-yil-ikiz-cikmis-sorular_106916.html', 83),
  row('genis-apotemi-tyt-mat-01', 'TYT', 'TYT Mat', 'Apotemi Yayınları', 'Apotemi Yayınları TYT Matematik Soru Bankası', 'images_buyuk/f36/apotemi-yayinlari-tyt-matematik-_MTA1NjM2NTUwMg==_1.jpg', 'apotemi-yayinlari-tyt-matematik-soru-bankasi_105636.html', 92),
  row('genis-apotemi-tyt-fen-01', 'TYT', 'TYT Fen', 'Apotemi Yayınları', 'Apotemi Yayınları TYT Fen Bilimleri 25 Deneme', 'images_buyuk/f61/apotemi-yayinlari-tyt-fen-biliml_MTA1OTYxMTAxOQ==_1.jpg', 'apotemi-yayinlari-tyt-fen-bilimleri-25-deneme_105961.html', 85),
  row('genis-apotemi-ayt-mat-01', 'AYT', 'AYT Mat', 'Apotemi Yayınları', 'Apotemi Yayınları AYT Matematik 15 Çözümlü Deneme', 'images_buyuk/f59/apotemi-yayinlari-ayt-matematik-_MTAxNTU5Mzc1Mw==_1.jpg', 'apotemi-yayinlari-ayt-matematik-15-cozumlu-deneme_101559.html', 86),
  row('genis-karekok-ayt-mat-01', 'AYT', 'AYT Mat', 'Karekök Yayınları', 'Karekök Yayınları AYT Progresif Matematik Soru Bankası', 'images_buyuk/f41/karekok-yayinlari-ayt-progresif-_MTAxNDQxNTkwNA==_1.jpg', 'karekok-yayinlari-ayt-progresif-matematik-soru-bankasi_101441.html', 90),
  row('genis-karekok-tyt-mat-01', 'TYT', 'TYT Mat', 'Karekök Yayınları', 'Karekök Yayınları Geometry Zero', 'images_buyuk/f13/karekok-yayinlari-geometry-zero_MTAzMjEzNTY1MQ==_1.jpg', 'karekok-yayinlari-geometry-zero_103213.html', 86),
  row('genis-karekok-ayt-kimya-01', 'AYT', 'AYT Kimya', 'Karekök Yayınları', 'Karekök Yayınları AYT Kimya Zor Cep Test', 'images_buyuk/f24/karekok-yayinlari-ayt-kimya-zor-_MTA3NDI0MzUyMw==_1.jpg', 'karekok-yayinlari-ayt-kimya-zor-cep-test_107424.html', 80),
  row('genis-palme-tyt-mat-01', 'TYT', 'TYT Mat', 'Palme Yayınları', 'Palme Yayınları TYT Matematik TİM Tematik İzleme Modülleri', 'images_buyuk/f32/palme-yayinlari-tyt-matematik-ti_OTg1MzI0ODAy_1.jpg', 'palme-yayinlari-tyt-matematik-tim-tematik-izleme-modulleri_98532.html', 83),
  row('genis-palme-ayt-fizik-01', 'AYT', 'AYT Fizik', 'Palme Yayınları', 'Palme Yayınları AYT Enerji Fizik Konu Özetli Soru Fasikülleri', 'images_buyuk/f26/palme-yayinlari-ayt-enerji-fizik_OTY3MjYwMzA2_1.jpg', 'palme-yayinlari-ayt-enerji-fizik-konu-ozetli-soru-fasikulleri_96726.html', 82),
  row('genis-limit-tyt-bio-01', 'TYT', 'TYT Fen', 'Limit Yayınları', 'Limit Yayınları TYT Biyoloji Soru Bankası', 'images_buyuk/f45/limit-yayinlari-tyt-biyoloji-sor_MTA3MjQ1MzgyNA==_1.jpg', 'limit-yayinlari-tyt-biyoloji-soru-bankasi_107245.html', 87),
  row('genis-limit-ayt-bio-01', 'AYT', 'AYT Bio', 'Limit Yayınları', 'Limit Yayınları AYT Biyoloji Soru Bankası', 'images_buyuk/f73/limit-yayinlari-ayt-biyoloji-sor_MTA3MTczMzEzNA==_1.jpg', 'limit-yayinlari-ayt-biyoloji-soru-bankasi_107173.html', 86),
  row('genis-limit-ayt-cografya-01', 'AYT', 'AYT Edebiyat', 'Limit Yayınları', 'Limit Yayınları AYT Coğrafya Soru Bankası', 'images_buyuk/f46/limit-yayinlari-ayt-cografya-sor_MTA3MjQ2NDMxOA==_1.jpg', 'limit-yayinlari-ayt-cografya-soru-bankasi_107246.html', 78),
  row('genis-hr-ayt-mat-01', 'AYT', 'AYT Mat', 'Hız ve Renk Yayınları', 'Hız ve Renk AYT Matematik Soru Bankası', 'images_buyuk/f75/hiz-ve-renk-ayt-matematik-soru-b_MTA0Njc1MDc0NA==_1.jpg', 'hiz-ve-renk-ayt-matematik-soru-bankasi_104675.html', 86),
  row('genis-hr-tyt-mat-01', 'TYT', 'TYT Mat', 'Hız ve Renk Yayınları', 'Hız ve Renk Yayınları TYT Matematik 15 x 40 Denemeleri', 'images_buyuk/f90/hiz-ve-renk-yayinlari-tyt-matema_MTA1MTkwNTIxNw==_1.jpg', 'hiz-ve-renk-yayinlari-tyt-matematik-15-x-40-denemeleri_105190.html', 85),
  row('genis-hr-ayt-kimya-01', 'AYT', 'AYT Kimya', 'Hız ve Renk Yayınları', 'Hız ve Renk Yayınları AYT Organik Kimya Soru Bankası', 'images_buyuk/f17/hiz-ve-renk-yayinlari-ayt-organi_MTA0NTE3MzEyNA==_1.jpg', 'hiz-ve-renk-yayinlari-ayt-organik-kimya-soru-bankasi_104517.html', 81),
  row('genis-benim-tyt-mat-01', 'TYT', 'TYT Mat', 'Benim Hocam Yayınları', 'Benim Hocam 2026 TYT Matematik Ders Notları', 'images_buyuk/f37/benim-hocam-2026-tyt-matematik-d_MTA2MDM3MDQ1NA==_1.jpg', 'benim-hocam-2026-tyt-matematik-ders-notlari_106037.html', 84),
  row('genis-benim-ayt-mat-01', 'AYT', 'AYT Mat', 'Benim Hocam Yayınları', 'Benim Hocam 2026 AYT Matematik Ders Notları', 'images_buyuk/f36/benim-hocam-2026-ayt-matematik-d_MTA2MDM2MjIzMg==_1.jpg', 'benim-hocam-2026-ayt-matematik-ders-notlari_106036.html', 83),
  row('genis-benim-tyt-fen-01', 'TYT', 'TYT Fen', 'Benim Hocam Yayınları', 'Benim Hocam TYT Fen Bilimleri 15 li Branş Deneme', 'images_buyuk/f47/benim-hocam-tyt-fen-bilimleri-15_MTA3MjQ3NDUxMw==_1.jpg', 'benim-hocam-tyt-fen-bilimleri-15-li-brans-deneme_107247.html', 80),
  row('genis-kr-ayt-kimya-01', 'AYT', 'AYT Kimya', 'KR Akademi', 'KR Akademi Celal Hoca AYT Kimya Video Ders Kitabı', 'images_buyuk/f35/kr-akademi-celal-hoca-ayt-kimya-_MTA3MTM1MzIwMg==_1.jpg', 'kr-akademi-celal-hoca-ayt-kimya-video-ders-kitabi_107135.html', 90),
  row('genis-kr-tyt-turkce-01', 'TYT', 'TYT Türkçe', 'KR Akademi', 'KR Akademi Nazlı Hocam TYT Türkçe Video Ders Kitabı', 'images_buyuk/f49/kr-akademi-nazli-hocam-tyt-turkc_MTA2MzQ5MzUzMQ==_1.jpg', 'kr-akademi-nazli-hocam-tyt-turkce-video-ders-kitabi_106349.html', 84),
  row('genis-kr-ayt-edebiyat-01', 'AYT', 'AYT Edebiyat', 'KR Akademi', 'KR Akademi 2026 AYT Edebiyat Twins Soru Bankası', 'images_buyuk/f99/kr-akademi-2026-ayt-edebiyat-twi_MTA2NTk5MjY1MA==_1.jpg', 'kr-akademi-2026-ayt-edebiyat-twins-soru-bankasi_106599.html', 83),
  row('genis-yayin-denizi-tyt-turkce-01', 'TYT', 'TYT Türkçe', 'Yayın Denizi', 'Yayın Denizi TYT Türkçe 16 x 40 Branş Denemeleri', 'images_buyuk/f56/yayin-denizi-tyt-turkce-16-x-40-_MTA3NDU2NDkyNA==_1.jpg', 'yayin-denizi-tyt-turkce-16-x-40-brans-denemeleri_107456.html', 85),
  row('genis-yayin-denizi-ayt-edebiyat-01', 'AYT', 'AYT Edebiyat', 'Yayın Denizi', 'Yayın Denizi AYT Edebiyat Denemeleri', 'images_buyuk/f90/yayin-denizi-ayt-edebiyat-deneme_MTA3NDkwMzExMQ==_1.jpg', 'yayin-denizi-ayt-edebiyat-denemeleri_107490.html', 84),
  row('genis-yayin-denizi-tyt-sosyal-01', 'TYT', 'TYT Sosyal', 'Yayın Denizi', 'Yayın Denizi TYT Coğrafya Ders Platosu 7 Günde 2X Hızında Bitir Deneme', 'images_buyuk/f67/yayin-denizi-tyt-cografya-2x-hiz_MTA2NjY3MzY0Ng==_1.jpg', 'yayin-denizi-tyt-cografya-ders-platosu-7-gunde-2x-hizinda-bitir-deneme_106667.html', 78),
  row('genis-miray-tyt-turkce-01', 'TYT', 'TYT Türkçe', 'Miray Yayınları', 'Miray Yayınları TYT Paragraf Soru Bankası', 'images_buyuk/f30/miray-yayinlari-tyt-paragraf-sor_OTc5MzAzNjUz_1.jpg', 'miray-yayinlari-tyt-paragraf-soru-bankasi_97930.html', 82),
  row('genis-miray-tyt-sosyal-01', 'TYT', 'TYT Sosyal', 'Miray Yayınları', 'Miray Yayınları TYT Sosyal Bilimler 15 Deneme', 'images_buyuk/f69/miray-yayinlari-tyt-sosyal-bilim_MTAwMDY5MDQwNw==_1.jpg', 'miray-yayinlari-tyt-sosyal-bilimler-15-deneme_100069.html', 78),
  row('genis-endemik-tyt-mat-01', 'TYT', 'TYT Mat', 'Endemik Yayınları', 'Endemik Yayınları TYT Matematik 12 Deneme', 'images_buyuk/f28/endemik-yayinlari-tyt-matematik-_OTg1Mjg0MDA2_1.jpg', 'endemik-yayinlari-tyt-matematik-12-deneme_98528.html', 79),
  row('genis-endemik-tyt-fen-01', 'TYT', 'TYT Fen', 'Endemik Yayınları', 'Endemik Yayınları TYT Fen Bilimleri 20 Deneme', 'images_buyuk/f33/endemik-yayinlari-tyt-fen-biliml_OTg1MzM0ODU1_1.jpg', 'endemik-yayinlari-tyt-fen-bilimleri-20-deneme_98533.html', 78),
  row('genis-acil-tyt-mat-01', 'TYT', 'TYT Mat', 'Acil Yayınları', 'Acil Yayınları TYT Matematik KURS Soru Bankası', 'images_buyuk/f42/acil-yayinlari-tyt-matematik-kur_MTAxOTQyNDAzNw==_1.jpg', 'acil-yayinlari-tyt-matematik-kurs-soru-bankasi_101942.html', 89),
  row('genis-acil-ayt-mat-01', 'AYT', 'AYT Mat', 'Acil Yayınları', 'Acil Yayınları AYT Matematik KURS Soru Bankası', 'images_buyuk/f73/acil-yayinlari-ayt-matematik-kur_MTAxOTczNDAzNQ==_1.jpg', 'acil-yayinlari-ayt-matematik-kurs-soru-bankasi_101973.html', 88),
  row('genis-baris-tyt-mat-01', 'TYT', 'TYT Mat', 'Barış Yayınları', 'Barış Yayınları TYT MSÜ ALES KPSS DGS Matematik Problemler Konu Denemeleri', 'images_buyuk/f3/baris-yayinlari-tyt-msu-ales-kps_MTA3MTAzNTIzOQ==_1.jpg', 'baris-yayinlari-tyt-msu-ales-kpss-dgs-matematik-problemler-konu-denemeleri_107103.html', 88),
  row('genis-baris-ayt-mat-01', 'AYT', 'AYT Mat', 'Barış Yayınları', 'Barış Yayınları AYT İlk 10 Soru Konu Denemeleri', 'images_buyuk/f1/baris-yayinlari-ayt-ilk-10-soru-_MTAwNTAxMDkyMg==_1.jpg', 'baris-yayinlari-ayt-ilk-10-soru-konu-denemeleri_100501.html', 86),
  row('genis-baris-tyt-fen-01', 'TYT', 'TYT Fen', 'Barış Yayınları', 'Barış Yayınları TYT Fizik Kimya Biyoloji Denemesi 15 Adet', 'images_buyuk/f58/baris-yayinlari-tyt-fizik-kimya-_MTAwMTU4NDUwNg==_1.jpg', 'baris-yayinlari-tyt-fizik-kimya-biyoloji-denemesi-15-adet_100158.html', 77),
]

export const KAYNAK_DERSLER = Array.from(new Set(KAYNAK_KATALOGU.map(kaynak => kaynak.ders)))
export const KAYNAK_YAYINEVLERI = Array.from(new Set(KAYNAK_KATALOGU.map(kaynak => kaynak.yayinevi))).sort((a, b) => yayineviOncelik(a) - yayineviOncelik(b) || a.localeCompare(b, 'tr'))
