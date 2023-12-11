function extractNumbersWithPercentageAndKDV(arr) {
    const result = {};
  
    arr.forEach((text) => {
      // Check if the line has "KDV"
      if (text.includes("KDV")) {
        // Match numbers with % in front or behind them
        const matches = text.match(/%\d+|\d+%/g);
  
        if (matches) {
            result["KDV"] = result["KDV"] || [];
            result["KDV"].push(...matches);
        }
      }
    });
  
    return result;
  }
  
  const nonEmptyTextLines = [
    'Özelleştirme No:TR1.2',
    'Senaryo:TEMELFATURA',
    'Fatura No:IF22023000000961',
    'Fatura Tipi:SATIS',
    'Fatura Tarihi24.10.2023',
    'Fatura No10050912',
    'Müşteri No649372',
    'İrsaliye No:/ PS02023000000189/ PS02023000000190',
    'Ödeme koşulları: 30 gün icinde Indirimsiz',
    'Yalnız : ONSEKIZBINOTUZALTI TL ONDÖRT KRŞ',
    'IFCO LOJİSTİK SİSTEMLERİ TİC. LTD. ŞTİ.',
    'HSBC BANK / KÜRESEL BANKACILIK MERKEZİ ŞB.',
    'TL IBAN:TR64 0012 3001 2310 0031 2282 00',
    'IFCO Lojistik Sistemleri Ticaret Limited Şirketi.',
    'Barbaros Mh. Begonya Sokak NIDAKULE KUZEY No:3',
    'D:122 34746 Ataşehir / İstanbul Türkiye',
    'Tel: 0216 688 81 96 Faks: 0216 688 81 97',
    'E-Posta: info@ifco.com',
    'Vergi Dairesi: KOZYATAĞI VERGİ DAİRESİ',
    'Vergi Numarası: 4650110611',
    'Web Sitesi: www.ifcosystems.com.tr',
    'Sicil No:444282',
    'Mersis No:0465011061100016',
    'İşletme Merkezi:BATI ATASEHIR ISTANBUL',
    'SAYIN',
    'EMRE YAVUZ GIDA URUNLERI SAN. VE TIC. LTD. STI.',
    'Karaburuk Mah. Karaburuk Kumesi Kume Evler No: 276 NO: No:',
    '276',
    'Tekkekoy / Samsun',
    'Vergi Dairesi: 19 MAYIS',
    'Vergi Numarası: 3341183468',
    'e-FATURA',
    'qrcode',
    'ETTN: 0050568E-569B-1EEE-9CFF-5526C3C9EBC7',
    'Sıra',
    'No',
    'Ürün KoduAçıklamaMiktarBirim FiyatNet Tutar',
    '1 CH3415 Kasa teslim (kiralama) bedeli CH3415 544  Adet 6,66 3.623,04  TL',
    '2 CH6416 Kasa teslim (kiralama) bedeli CH6416 1.088  Adet 9,91 10.782,08  TL',
    '3 EP Ahşap palet satış bedeli 5  Adet 125,00 625,00  TL',
    'Toplam :15.030,12 TL',
    'Hesaplanan KDV %20,00 :3.006,02 TL',
    'Genel Toplam :18.036,14 TL'
  ]

 
  const nonEmptyTextLines3 = [
    'SAYIN',
    'EMRE YAVUZ GIDA ÜRÜNLERİ (Marka:X)',
    'MERKEZ/ İSTANBUL',
    'Tel: Fax:',
    'Vergi Dairesi: 19 MAYIS',
    'VKN: 3341183468',
    'Özelleştirme',
    'No:',
    'TR1.2',
    'Senaryo:HKS',
    'Fatura Tipi:KOMISYONCU',
    'Fatura No:VMH2023000001797',
    'Fatura Tarihi:04-11-2023',
    'Fatura Saati:09:24:08.0000000+03:00',
    'Stok Giriş',
    'Tarihi:',
    '24-10-2023',
    'Malzeme/Hizmet AçıklamasıKünyeKapMiktarBirim Fiyat',
    'KDV',
    '%',
    'KDV TutarıMal Hizmet Tutarı',
    'PIRASA   2 22.00 18.00 TL  %1  3.96 TL 396.00 TL',
    'PIRASA   1 12.00 13.00 TL  %1  1.56 TL 156.00 TL',
    'PIRASA   17 210.38 1.00 TL  %1  2.10 TL 210.38 TL',
    'Toplam:20244.38',
    'Yalnız: Altı Yüz İki Türk Lirası Yirmi Bir Kuruş',
    'Harici Masraf:38,12',
    'VİZYON EKOLOJİK TARIM ÜRÜNLERİ SANAYİ VE TİCARET',
    'LİMİTED ŞİRKETİ',
    'KOCATEPE MAH HAL YOLU SOK HAL NO :85/1  No:',
    '34200 KOCATEPE/ İSTANBUL',
    'Tel: 5325588290 Fax: 5325588290',
    'E-Posta: [HAL.EMAIL]',
    'Vergi Dairesi: TUNA',
    'VKN: 9251061691',
    'MERSISNO: 000000',
    'TICARETSICILNO: 377014-S',
    'e-Fatura',
    'ETTN: C3C0ABC8-BEBD-4CAB-9213-5DE220B30452',
    'Komisyon (%5.00)38.12 TL',
    'Komisyon KDV7.62 TL',
    'Navlun69.94 TL',
    'Navlun KDV13.99 TL',
    'Diğer Masraflar38.12 TL',
    'Diğer KDV0.00 TL',
    'Mal Hizmet Toplam Tutarı762.38 TL',
    'Toplam İskonto0.00 TL',
    'Hesaplanan KDV(%1.00)7.62 TL',
    'Vergiler Dahil Toplam Tutar770.00 TL',
    'Vergiler167.79 TL',
    'Ödenecek Tutar602.21 TL'
  ]
  
  
  
  
  
  const resultArray = extractNumbersWithPercentageAndKDV(nonEmptyTextLines3);
  console.log(resultArray);
  