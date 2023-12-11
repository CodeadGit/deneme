function containsNumber(lines) {
    return lines.some(text => /\d/.test(text));
  }
  function getObjectByKey3(key, array, possibilityArray, subtractPossibilities = false, checkForNumber = false) {
    const result = {
      [key]: array.reduce((accumulator, text) => {
        const lowercaseText = text.toLowerCase();
        const matchedPossibilities = possibilityArray.filter(innerArray =>
          innerArray.some(possibility =>
            lowercaseText.includes(possibility.toLowerCase())
          )
        );
  
        if (matchedPossibilities.length === possibilityArray.length) {
          let resultText = text;
  
          if (subtractPossibilities) {
            resultText = matchedPossibilities
              .flat()
              .map(possibility => possibility.toLowerCase())
              .reduce((text, possibility) => text.replace(possibility, ''), lowercaseText)
              .replace(/:/g, '')
              .trim();
          }
  
          if (checkForNumber) {
            //sconst numberMatch = resultText.match(/\d+/); //tam sayı
            //const numberMatch = resultText.match(/\d+(?:,\d{3})*(?:\.\d+)?/); //virgülsüz
            const numberMatch = resultText.match(/\d+(?:,\d{3})*(?:\.\d+)?(?:,\d+)?/);

            if (numberMatch) {
              accumulator.push(numberMatch[0]);
            } else {
              accumulator.push("not found");
            }
          } else {
            accumulator.push(resultText);
          }
        }
  
        return accumulator;
      }, [])
    };
  
    return result;
  }

  function extractNumbersWithPercentageAndKDV(arr) {
    const result = [];
  
    arr.forEach((text) => {
      // Check if the line has "KDV"
      if (text.includes("KDV")) {
        // Match numbers with % in front or behind them
        const matches = text.match(/%\d+|\d+%/g);
  
        if (matches) {
          result.push(...matches);
        }
      }
    });
  
    return result;
  }
  const kdvpricepossibles = ["Tutar", "Hesaplanan", "Toplam"];
  
  function extractKDVPrice(arr, keywords) {
    const result = {};
  
    for (let i = 0; i < arr.length; i++) {
      const line = arr[i];
  
      // Check if the line contains "KDV" and one of the specified keywords
      if (line.includes("KDV") && keywords.some(keyword => line.includes(keyword))) {
        // Extract numeric values followed by "TL" and not between parentheses
        const matches = line.match(/(\d[\d.,]*)\s*TL/);
  
        if (matches) {
            result["KDV_Tutari"] = result["KDV_Tutari"] || [];
            result["KDV_Tutari"].push(...matches);
        }
      }
    }
  
    return result;
  }
function processParameterObject(parameterObject, extractedTextArray) {
    const result = {};
  
    for (const key in parameterObject) {
      const { possible, checkForNumber, subtractPossibilities, label } = parameterObject[key];
      const possibilityArray = possible.map(innerArray => innerArray.map(possibility => possibility.toLowerCase()));
  
      const partialResult = getObjectByKey3(key, extractedTextArray, possibilityArray, subtractPossibilities, checkForNumber);
  
      result[label] = partialResult[key];
    }
    const findKDV= extractNumbersWithPercentageAndKDV(extractedTextArray)
    const findKDVprice= extractKDVPrice(extractedTextArray,kdvpricepossibles)

    result["KDV_Oranı"]=findKDV;
    result["KDV_Tutari"]=findKDVprice["KDV_Tutari"];
  
    return result;
  }
  
  // Sample usage
  const parameterObject={
    ETTN:{
        possible:[['ETTN']],
        checkForNumber:false,
        subtractPossibilities:true,
        proceed:true,
        label:"ETTN",
    },
    Fatura_No:{
        possible:[
            ['Fatura'],
            ['No:',"no","NO","No","no:"]
        ],
        checkForNumber:false,
        subtractPossibilities:true,
        proceed:true,
        label:"Fatura No",
        
    },
    Fatura_Tarihi:{
        possible:[['Fatura'],["tarihi","Tarihi","Tarih",]],
        checkForNumber:false,
        subtractPossibilities:true,
        proceed:true,
        label:"Fatura Tarihi",
    },
    Fatura_Türü:{
        possible:[['Fatura',],["Tür","tür"]],
        subtractPossibilities:true,
        proceed:true,
        checkForNumber:false,
        label:"Fatura Türü",
    },
    Fatura_Tipi:{
        possible:[['Fatura'],["Tipi","tip","tipi"]],
        subtractPossibilities:true,
        proceed:true,
        checkForNumber:false,
        label:"Fatura Tipi",
    },
    Senaryo:{
        possible:[['SENARYO',"Senaryo"]],
        subtractPossibilities:true,
        proceed:true,
        checkForNumber:false,
        label:"Senaryo",
    },
    Cari_Vkn_Tckn:{
        possible:[
          ['VKN',"TCKN","Vkn","Tckn","VKN/TC"],
          //["Numarası"]
        ],
        subtractPossibilities:true,
        proceed:true,
        checkForNumber:true,
        label:"Cari_Vkn_Tckn",
        length:[11,10]
    }, 
    Hizmet_Toplam_Tutar:{
        possible:[['Toplam',"Ödenecek"],["Tutar","Tutarı"]],
        subtractPossibilities:true,
        proceed:true,
        checkForNumber:true,
        label:"Hizmet Toplam Tutar",
    }, 
    Genel_Toplam:{
        possible:[['Genel',"Toplam","Ödenecek"],["tutar","Tutarı","Toplam"]],
        subtractPossibilities:true,
        proceed:true,
        checkForNumber:true,
        label:"Genel Toplam",
    }
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
  const nonEmptyTextLines2 = [
    'EMRE YAVUZ GIDA ÜRÜNLERİ SANAYİ VE TİCARET',
    'LİMİTED ŞİRKETİ',
    'KABABÜRÜK MAH. KABABÜRÜK KÜMESİ KÜME EVLER NO:',
    '276',
    '55300 TEKKEKÖY/SAMSUN',
    'Vergi Dairesi: 19 MAYIS  VKN:3341183468',
    'IFCO Lojistik Sistemleri Ticaret Limited Şirketi.',
    'Barbaros Mh. Begonya Sokak No:3 D:122 34746',
    'ATAŞEHİR/İSTANBUL',
    'Tel: 0(216) 688 8196',
    'Tel: (216) 688 8197',
    'info@ifco.com',
    'Vergi Dairesi: KOZYATAĞI  VKN:4650110611',
    'SAYIN',
    'Özelleştirme No:TR1.2',
    'Senaryo:TEMELFATURA',
    'Fatura Tipi:IADE',
    'Fatura No:SEY2023000000910',
    'Fatura Tarihi:29-09-2023',
    'İşlem Saati:15:12:45',
    'Ödeme Türü:Vadeli',
    'e-FATURA',
    'ETTN:B8366258-2ACF-4375-A144-4E27E4454793',
    'CinsiAçıklamaMiktarBirimFiyatKdvMal Tutarı',
    'AHŞAP PALET SATIŞ BEDELİ 72  Ad125,00  %20 9.000,00',
    'CHEP PALET 1208 34  Ad0,00  %20 0,00',
    'Fatura Dahil Bakiye',
    '-766.805,18 Alacak',
    'Yalnız onbinsekizyüz TL',
    'Mal Toplamı 9.000,00 TL',
    'Hesaplanan KDV(%20) 1.800,00 TL',
    'Masraf Toplamı',
    'Vergiler Dahil Toplam Tutar 10.800,00 TL',
    'Ödenecek Tutar 10.800,00 TL',
    'T.GARANTİ BANKASI A.Ş.BUĞDAYPAZARI ŞB.TR720006200144600006296613',
    'Tarih:29-09-2023 Saat:15:12:45 İrsaliye yerine geçer.'
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


const pdfTry1o=[
  "EMRE YAVUZ GIDA ÜRÜNLERİ SANAYİ VE TİCARET",
  "LİMİTED ŞİRKETİ", 
  "KABABÜRÜK MAH. KABABÜRÜK KÜMESİ KÜME EVLER NO:", 
  "276", 
  "55300 TEKKEKÖY/SAMSUN", 
  "Vergi Dairesi: 19 MAYIS  VKN:3341183468",
  "BİM BİRLEŞİK MAĞAZALAR A.Ş.",
  "CİHADİYE MAHALLESİ 23081 SOKAK NO: 9",
  "AKSU/ANTALYA",
  "AKSU/ANTALYA",
  "Vergi Dairesi: BÜYÜK MÜK. VD. B  VKN:1750051846",
  "SAYIN",
  "Özelleştirme No:TR1.2",
  "Senaryo:HKS",
  "Fatura Tipi:SATIS",
  "Fatura No:SEY2023000000912",
  "Fatura Tarihi:03-10-2023",
  "İşlem Saati:13:36:52",
  "İrsaliye No:IEY2023000000372",
  "İrsaliye Tarihi:01-10-2023",
  "e-FATURA",
  "ETTN:43431485-76F0-4B92-8737-3842C01FF65B",
  "CinsiAçıklamaKünyeKs/AdBğ/KgFiyatKdvTutar",
  "DOMATES SALÇALIK  1423369230020992884710 Ad12.040 Kg8,00  %1 96.320,00",
  "Kasa",
  "Bağ",
  "Adet 710",
  "Safi 12.040",
  "Plaka 01AIH918",
  "Hamaliye",
  "Hamaliye KDV",
  "Nakliye",
  "Nakliye KDV",
  "İ.Sandık",
  "İ.Sandık KDV",
  "Mal Toplamı 96.320,00 TL",
  "Hesaplanan KDV(%1) 963,20 TL",
  "Masraf Toplamı 0,00 TL",
  "Vergiler Dahil Toplam Tutar 97.283,20 TL",
  "Ödenecek Tutar 97.283,20 TL",
  "Yalnız doksanyedibinikiyüzseksenüç TL yirmi Kr",
  "9490 FİLE ANTALYA DEPOYA SEVK EDİLMİŞTİR.17 TURPAL PALET/6416-710 KASA",
  "T.GARANTİ BANKASI A.Ş.BUĞDAYPAZARI ŞB.TR720006200144600006296613",
  "Tarih:01-10-2023 Saat:13:36:52 İrsaliye yerine geçer."
  ]
  
  const pdfTry2o=[
  "EMRE YAVUZ GIDA ÜRÜNLERİ SANAYİ VE TİCARET",
  "LİMİTED ŞİRKETİ",
  "KABABÜRÜK MAH. KABABÜRÜK KÜMESİ KÜME EVLER NO:",
  "276",
  "55300 TEKKEKÖY/SAMSUN",
  "Vergi Dairesi: 19 MAYIS  VKN:3341183468",
  "BİM BİRLEŞİK MAĞAZALAR A.Ş.",
  "FİLE - ORHANGAZİ MAH. ATATÜRK BULVARI NO: 59",
  "ESENYURT / İSTANBUL",
  "ESENYURT/İSTANBUL",
  "Vergi Dairesi: BÜYÜK MÜK. VD. B  VKN:1750051846",
  "SAYIN",
  "Özelleştirme No:TR1.2",
  "Senaryo:HKS",
  "Fatura Tipi:SATIS",
  "Fatura No:SEY2023000000947",
  "Fatura Tarihi:06-12-2023",
  "İşlem Saati:10:23:25",
  "İrsaliye No:IEY2023000000410",
  "İrsaliye Tarihi:06-12-2023",
  "e-FATURA",
  "ETTN:304DB106-B0F0-4EB5-8188-77C0AA4250EE",
  "CinsiAçıklamaKünyeKs/AdBğ/KgFiyatKdvTutar",
  "BEYAZ LAHANA  15531792300263201861 Ad330 Kg6,00  %1 1.980,00",
  "Kasa",
  "Bağ",
  "Adet 1",
  "Safi 330",
  "Plaka 61K6110",
  "Hamaliye",
  "Hamaliye KDV",
  "Nakliye",
  "Nakliye KDV",
  "İ.Sandık",
  "İ.Sandık KDV",
  "Mal Toplamı 1.980,00 TL",
  "Hesaplanan KDV(%1) 19,80 TL",
  "Masraf Toplamı 0,00 TL",
  "Vergiler Dahil Toplam Tutar 1.999,80 TL",
  "Ödenecek Tutar 1.999,80 TL",
  "Yalnız bindokuzyüzdoksandokuz TL seksen Kr",
  "FİLE ESENYURT DEPO",
  "T.GARANTİ BANKASI A.Ş.BUĞDAYPAZARI ŞB.TR720006200144600006296613",
  "Tarih:06-12-2023 Saat:10:23:25 İrsaliye yerine geçer.",
  ]
  
    const pdfTry3o=[
  "SAYIN",
  "EMRE YAVUZ GIDA ÜRÜNLERİ SANAYİ VE TİCARET LİMİTED",
  "ŞİRKETİ",
  "No:",
  "Kapı No:",
  "/",
  "tr",
  "Web Sitesi:", 
  "E-Posta:",
  "Tel:",
  "Vergi Dairesi: 19 MAYIS MAL MÜDÜRLÜGÜ",
  "VKN: 3341183468",
  "ÖZKAN TARIM",
  "TUNAY  ÖZKAN",
  "GAZIPASA MAH OGUZHAN CAD NO: 94   No:",
  "Kapı No:",
  "BAFRA/ SAMSUN",
  "Tel: 05439348513 Fax:",
  "Web Sitesi: tunayozkan55@gmail.com",
  "E-Posta: tunayozkan55@gmail.com",
  "Vergi Dairesi: BAFRA VERGI DAIRESI",
  "TCKN: 34211170290",
  "Mersis No:",
  "Ticaret Sicil No:",
  "e-FATURA",
  "Özelleştirme No:TR1.2",
  "Senaryo:TICARIFATURA",
  "Fatura Tipi:SATIS",
  "Fatura No:TOF2023000000526",
  "Fatura Tarihi:04-12-2023 10:55",
  "ETTN:   12890199-45fc-4850-a326-43082355666e",
  "Sıra",
  "No",
  "Mal HizmetMiktarBirim Fiyat",
  "İskonto/",
  "Arttırım",
  "Oranı",
  "İskonto/",
  "Arttırım",
  "Tutarı",
  "KDV",
  "Oranı",
  "KDV TutarıDiğer Vergiler",
  "Mal Hizmet",
  "Tutarı",
  "1 KIRMIZI LAHANA 1.030 kg 5,9406 TL",
  "(+)",
  "%0,00",
  "0,00 TL  %1,00  61,19 TL",
  "6.118,81 TL",
  "2 HİBRİT LAHANA 23.100 kg 2,4752 TL",
  "(+)",
  "%0,00",
  "0,00 TL  %1,00  571,78 TL",
  "57.178,23 TL",
  "Mal Hizmet Toplam Tutarı63.297,04 TL",
  "Toplam İskonto0,00 TL",
  "Hesaplanan KDV(%1.00)632,97 TL", 
  "Vergiler Dahil Toplam Tutar63.930,01 TL",
  "Ödenecek Tutar63.930,01 TL",
  "Not: YALNIZ : ALTMIŞÜÇBİNDOKUZYÜZOTUZ TL BİR KURUS", 
  "Not:"
  ]
  
  const pdfTry4o=[
    "SAYIN",
    "EMRE YAVUZ GIDA ÜRÜNLERİ SANAYİ VE TİCARET LİMİTED",
    "ŞİRKETİ",
    "KABABÜRÜK MAH. KABABÜRÜK KÜMESİ KÜME EVLER 276",
    "Tekkeköy/ Samsun",
    "E-Posta:",
    "Tel:",
    "Vergi Dairesi: 19 MAYIS VERGİ DAİRESİ MÜD.",
    "VKN: 3341183468",
    "SUBENO:",
    "MUSTERINO:",
    "Özelleştirme No:TR1.2",
    "Senaryo:TICARIFATURA",
    "Fatura Tipi:TEVKIFAT",
    "Fatura No:EEE2023000000217",
    "Fatura Tarihi:06-12-2023 13:57",
    "Tevkifat Sebebi: 624---> (2/10) YÜK TAŞIMACILIĞI HİZMETİ [KDVGUT-(I/C-2.1.3.2.11)]+",
    "Not: Yazı ile: # Yirmi Üç Bin İki Yüz TL #",
    "BANKA HESAP BİLGİLERİ",
    "BANKAHESAP TÜRÜIBAN",
    "GARANTİ BANKASITLTR 12 0006 2000 6530 0006 2984 57",
    "GARANTİ BANKASIUSDTR 73 0006 2000 6530 0009 0906 68",
    "GARANTİ BANKASIEUROTR 92 0006 2000 1580 0009 0906 67",
    "EMLAK KATILIMTLTR 21 0021 1000 0006 9110 9000 01",
    "EMLAK KATILIMUSDTR 37 0021 1000 0006 9110 9001 01",
    "TÜRKİYE İŞ BANKASITLTR 19 0006 4000 0017 5200 3056 58",
    "TÜRKİYE İŞ BANKASIUSDTR 85 0006 4000 0027 5200 2311 33",
    "Bu fatura Uysal Yazılım E-Belge Tasarım Aracı kullanılarak tasarlanmıştır.",
    "DERYA ULUSLARARASI TAŞ.GÜM.İNŞ.İÇ VEDIŞ TİC.LTD.ŞTİ.",
    "NEFSİPULATHANE MAHALLESİ ATATÜRK BULVARI SEBAT",
    "İŞHANI NO:49/215",
    "Akçaabat/ Trabzon",
    "Tel: 8508236336",
    "E-Posta: meryemturkmen",
    "Vergi Dairesi: AKÇAABAT VERGİ DAİRESİ MÜD.",
    "VKN: 2930079648",
    "SUBENO:",
    "MERSISNO:",
    "HIZMETNO:",
    "TICARETSICILNO:",
    "e-FATURA",
    "ETTN: d869965c-1e31-4744-a23c-214c0492e643",
    "Sıra",
    "No",
    "Mal HizmetMiktarBirim Fiyat",
    "İskonto",
    "Oranı",
    "İskonto",
    "Tutarı",
    "KDV OranıKDV TutarıDiğer Vergiler",
    "Mal Hizmet",
    "Tutarı",
    "1",
    "61K8448-61AFP767 BAFRA",
    "İSTANBUL NAKLİYE BEDELİ",
    "1 Adet 20.000 TL    %20,00  4.000,00 TL",
    "KDV TEVKİFAT",
    "(%20,00)=800,00 TL",
    "20.000,00 TL",
    "Mal Hizmet Toplam Tutarı20.000,00 TL",
    "Toplam İskonto0,00 TL",
    "Hesaplanan KDV GERCEK(%20)",
    "(20.000,00)",
    "4.000,00 TL",
    "Hesaplanan KDV Tevkifat(%20)800,00 TL",
    "Tevkifata Tabi İşlem Tutarı20.000,00TL",
    "Tevkifata Tabi İşlem Üzerinden Hes. KDV4.000,00TL",
    "Vergiler Dahil Toplam Tutar24.000,00 TL",
    "Ödenecek Tutar23.200,00 TL"
  ]
  
  const pdfTry5o=[
  "Özelleştirme No:TR1.2",
  "Senaryo:TEMELFATURA",
  "Fatura No:BD42023000044589",
  "Fatura Tipi:IADE",
  "Sipariş No:5118969772",
  "Sipariş Tarihi:30-10-2023",
  "Referans No:5163467815",
  "Fatura Tarihi:31.10.2023",
  "YALNIZ : ONBEŞBİNÜÇYÜZALTMIŞİKİ TL VE ON KR",
  "Kod, İrsaliye Numaraları ve Tarihleri :",
  "9403 - BE02023003810232 - 30.10.2023",
  "Merkez Adresi :",
  "BİM Birleşik Mağazalar A.Ş.",
  "Abdurrahmangazi Mah. Ebubekir Cad.   No: 73  Sancaktepe / Istanbul",
  "E-Posta: earsiv@bim.com.tr",
  "Vergi Dairesi: BÜYÜK MÜKELLEFLER",
  "Vergi Numarası: 1750051846",
  "Web Sitesi: www.bim.com.tr",
  "Mersis No:0175005184608645",
  "İşletme Merkezi:Sancaktepe",
  "FİLE Bölge(9401)",
  "Hamidiye Mah. Mimar Sinan Cad.",
  "Çekmeköy / İSTANBUL",
  "Tel: 0216 2173535",
  "e-Fatura",
  "qrcode",
  "EMRE YAVUZ GIDA ÜRÜNLERİ SANAYİ VE TİCARET LİMİTED ŞİRKETİ",
  "KABABÜRÜK MAH KÜME EVLER NO:76 TEKKEKÖY/SAMSUN",
  "Samsun",
  "Vergi Dairesi: 19 MAYIS",
  "Vergi Numarası: 3341183468",
  "E-Posta: e.yavuz.1@hotmail.com",
  "ETTN: 0050569F-E0FF-1EDE-9F8D-E77D0D49EC4C",
  "Malzeme",
  "Kodu/Code",
  "Açıklama/DescriptionMiktar/QuantityFiyat/PriceTutarı/Amount",
  "41100084    PIRASA KG 845  KG 18 TL15.210 TL",
  "Toplam Tutar:15.210,00TL",
  "Hesaplanan KDV (15.210,00) %1.00:152,10TL",
  "Fatura Tutarı:15.362,10TL"
  ]

  const expectedOutput = processParameterObject(parameterObject, pdfTry1o);
  console.log(expectedOutput);
  