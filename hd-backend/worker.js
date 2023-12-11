  const findMatchingValuesName = (arrT, arrN) => {
    return new Promise((resolve, reject) => {
        const uniqueNames = new Set();

        for (const possibility of arrN) {
            const lowercasePossibility = possibility.toLowerCase();

            arrT.forEach((line, index) => {
                if (!line.toLowerCase().includes("vergi") && !line.toLowerCase().includes("dairesi") && line.split(/[ :]/).some(l => l.toLowerCase() === lowercasePossibility)) {
                    uniqueNames.add(line);
                }
            });
        }

        // Convert the Set back to an array if needed
        const uniqueNamesArray = [...uniqueNames];

        resolve(uniqueNamesArray[0]);
    });
};


function findIndexOfMatchedValue(arrT, arrP) {
    for (const possibility of arrP) {
        const index = arrT.findIndex(line => line.includes(possibility));
        if (index !== -1) {
            return index;
        }
    }
    return -1; // Return -1 if no match is found
}


async function findNearestValueInArray(arrT, arrP, specified) {
    let allRes = "";

    const resultIndex = findIndexOfMatchedValue(arrT, specified);

    if (resultIndex === -1 || resultIndex >= arrT.length) {
        return fetch('isimler.txt')
            .then(response => response.text())
            .then(data => {
                const namesArray = data.split('\n').map(name => name.trim());
                return findMatchingValuesName(arrT, namesArray);
            })
            .catch(error => {
                console.error('Error fetching the file:', error);
            });
    } else {
        const distances = arrP.map((possibility) => {
            const index = arrT.findIndex((line) => line.includes(possibility));
            return {
                index: index,
                distance: index !== -1 ? Math.abs(resultIndex - index) : Infinity
            };
        });

        if (distances.filter(d => d.index > 0).length < 1) {
            console.log("isim arıyor");
            return fetch('isimler.txt')
                .then(response => response.text())
                .then(data => {
                    const namesArray = data.split('\n').map(name => name.trim());
                    return findMatchingValuesName(arrT, namesArray, allRes);
                })
                .catch(error => {
                    console.error('Error fetching the file:', error);
                });
        } else {
            distances.sort((a, b) => a.distance - b.distance);
            const nearestIndex = distances[0].index;
            allRes = arrT[nearestIndex];
            return Promise.resolve(allRes);
        }
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
  
  const expectedObjext={
        ETTN:"",
        Fatura_No:"",
        Fatura_Tarihi:"",
        Fatura_Türü:"",
        Fatura_Tipi:"",
        Senaryo:"",
        Cari_Vkn__Tckn:"",
        Sıra_No:"",
        Ürün_Kodu:"",
        Mal__Hizmet_Adı___Açıklama____:"",
        Mal__Hizmet_Miktar:"",
        Mal__Hizmet_Birim:"",
        Mal__Hizmet_Birim_Fiyat:"",
        Hizmet_Toplam_Tutar:"",
        Mal__Hizmet_KDV_Oranı:"",
        Mal__Hizmet_Kdv_Tutarı:"",
        Genel_Toplam:""
  }
  const expectedOutput={
        ETTN:["C3C0ABC8-BEBD-4CAB-9213-5DE220B30452"],
        Fatura_No:["VMH2023000001797"],
        Fatura_Tarihi:["04-11-2023"],
        Fatura_Türü:[""],
        Fatura_Tipi:"[KOMISYONCU]",
        Senaryo:["HKS"],
        Cari_Vkn__Tckn:["3341183468"],
        Sıra_No:["","",""],
        Ürün_Kodu:["","",""],
        Mal_Hizmet_Adı___Açıklama____:["PIRASA","PIRASA","PIRASA"],
        Mal__Hizmet_Miktar:["22.00","12.00","18.00"],
        Mal__Hizmet_Birim:["Adet","Adet","Adet"],
        Mal__Hizmet_Birim_Fiyat:["18.00 TL","13.00 TL","1.00 TL"],
        Hizmet_Toplam_Tutar:["762.38 TL"],
        Mal__Hizmet_KDV_Oranı:["1.00"],
        Mal__Hizmet_Kdv_Tutarı:["7.62 TL"],
        Genel_Toplam:["602.21 TL"]
  }

  const parameterObject={
        ETTN:{
            possible:[['ETTN']],
            whole:true,label:"ETTN",        
        },
        Fatura_No:{
            possible:[
                ['Fatura'],
                ['No:',"no","NO","No","no:"]
            ],
            whole:true,label:"Fatura No",
            
        },
        Fatura_Tarihi:{
            possible:[['Fatura'],["Tarih","tarihi","Tarihi"]],
            whole:true,label:"Fatura Tarihi",
            
        },
        KDV: {
            possible: [['KDV']],
            whole:true,label: 'Hesaplanan KDV',
          },
        Fatura_Türü:{possible:[['Fatura',],["Tür","tür"]],whole:true,label:"Fatura Türü",},
        Fatura_Tipi:{possible:[['Fatura'],["Tipi","tip","tipi"]],whole:true,label:"Fatura Tipi",},
        Senaryo:{possible:[['SENARYO',"Senaryo"]],whole:true,label:"Senaryo",},
        Cari_Vkn_Tckn:{possible:[['VKN',"TCKN","Vkn","Tckn","VKN/TC"]],whole:true,label:"Cari Vkn/Tckn",},
        Sıra_No:{possible:[['Sıra',"No"]],whole:true,label:"Sıra No",},
        Ürün_Kodu:{possible:[['Ürün'],["Kodu"]],whole:true,label:"Ürün Kodu",},
        
        Mal_Hizmet_Adı:{possible:[['Adı',"ad","adi"],["Hizmet","Mal"]],whole:true,label:"Mal/Hizmet Adı",},
        Mal_Hizmet_Miktar:{possible:[['Miktarı',"miktari","miktar"],[,"Hizmet","Mal"]],whole:true,label:"Mal/Hizmet Miktarı",},
        Mal_Hizmet_Birim:{possible:[['Birim',"br","Ad.","adet","kg"],["Hizmet","Mal"]],whole:true,label:"Mal/Hizmet Birim",},
        Mal_Hizmet_Birim_Fiyat:{possible:[['Birim'],["Fiyat"]],whole:true,label:"Mal/Hizmet Birim Fiyat",},
        Hizmet_Toplam_Tutar:{possible:[['Toplam',"Ödenecek"],["Tutar","Tutarı"]],whole:true,label:"Hizmet Toplam Tutar",},
        KDV_Oranı:{possible:[['KDV',"%"],["Oran","%","(%)","()"]],whole:true,label:"Mal/Hizmet KDV Oranı",},
        Kdv_Tutarı:{possible:[['KDV',"%"],["Tutarı","%","KDV"]],whole:true,label:"Mal/Hizmet Kdv Tutarı",},
        Genel_Toplam:{possible:[['Genel',"Toplam","Ödenecek"],["tutar","Tutarı"]],whole:true,label:"Genel Toplam",}
  }

  function getObjectByKey(key, array, possibilityArray) {
    const result = { index: -1 };

    for (let i = 0; i < array.length; i++) {
        const line = array[i].toLowerCase();

        for (const possibility of possibilityArray) {
            const lowerPossibility = possibility.toLowerCase();
            const regex = new RegExp(`\\b${lowerPossibility}\\b`);

            if (regex.test(line)) {
                const match = line.match(/[a-f0-9]{8}[-][a-f0-9]{4}[-][a-f0-9]{4}[-][a-f0-9]{4}[-][a-f0-9]{12}/);
                if (match) {
                    result[key] = match;
                    result.index = i;
                    return result;
                }
            }
        }
    }

    return result;
}

// Example usage:



    const specificArray = ['Sayın', 'Sayin', 'SN',"Sn","SAYIN"];
    const firmNameArray = ['Ticaret', 'Tic', 'Sanayi',"LTD","ŞTİ","STI","Limited","ltd",".şti","AŞ.","A.Ş.","A.Ş","Sistemleri", "Şirketi"];
    const ettnArray = ['ETTN',"Ettn"];
    const vknArray = ['VKN',"Stok"];

    // findNearestValueInArray(nonEmptyTextLines2, firmNameArray,specificArray).then(result => {
    //     console.log(result);
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });;

    const result1 = getObjectByKey("VKN", nonEmptyTextLines3, vknArray);
    const result = getObjectByKey("ETTN", nonEmptyTextLines3, ettnArray);
console.log(result);
//console.log(result1);

function extractInformation(textArray, parameterObject) {
    const result = {};

    Object.keys(parameterObject).forEach(key => {
        const { possible } = parameterObject[key];
        const possibilityArrays = Array.isArray(possible) ? possible : [possible];

        let extractedValues = [];

        for (const possibilityArray of possibilityArrays) {
            if (!Array.isArray(possibilityArray)) continue;

            const regexPatterns = possibilityArray.map(variation =>
                new RegExp(`\\b${variation}\\b:\\s*(.+)`, 'i')
            );

            for (const line of textArray) {
                for (const regexPattern of regexPatterns) {
                    const match = line.match(regexPattern);
                    if (match && match[1]) {
                        extractedValues.push(match[1].trim());
                        break;
                    }
                }
            }

            if (extractedValues.length > 0) {
                break; // If a value is found, break the loop
            }
        }

        result[key] = extractedValues.length > 0 ? extractedValues : "";
    });

    return result;
}



// const extractedInformation = extractInformation(nonEmptyTextLines3, parameterObject);

// console.log(extractedInformation);

function parseTextArray(textArray, parameterObject) {
    const result = {};

    Object.entries(parameterObject).forEach(([key, { possible, label }]) => {
        const possibilityArrays = Array.isArray(possible) ? possible : [possible];

        const regexPatterns = possibilityArrays
            .filter(Array.isArray)
            .flatMap(variations =>
                variations.map(variation =>
                    new RegExp(`\\b${variation}\\b:\\s*(.+)`, 'i')
                )
            );

        const extractedValues = textArray
            .flatMap(line =>
                regexPatterns.reduce((values, regexPattern) => {
                    const match = line.match(regexPattern);
                    return match && match[1] ? [...values, match[1].trim()] : values;
                }, [])
            );

        result[key] = extractedValues.length > 0 ? extractedValues : [""];
    });

    return result;
}

  
  // Example usage
  
//   const resultThird = parseTextArray(nonEmptyTextLines3, parameterObject);
//   console.log(resultThird);
  

  function extractInformationFourth(textArray, parameterObject) {
    const result = {};
  
    Object.entries(parameterObject).forEach(([key, { possible, label }]) => {
      const extractedValues = textArray
        .map(line => {
          const foundVariation = possible.find(variation =>
            variation.every(word => line.toLowerCase().includes(word.toLowerCase()))
          );
  
          if (foundVariation) {
            // Get the remaining part of the line after the found variation
            const remainingPart = line
              .substring(line.toLowerCase().indexOf(foundVariation[foundVariation.length - 1].toLowerCase()) + foundVariation[foundVariation.length - 1].length)
              .trim();
  
            return remainingPart;
          }
  
          return null;
        })
        .filter(value => value !== null);
  
      result[key] = extractedValues.length > 0 ? extractedValues : [""];
    });
  
    return result;
  }
  
  // Example usage
  
  
//   const resultForth = extractInformationFourth(nonEmptyTextLines3, parameterObject);
//   console.log("fourth",resultForth);
  

  function extractInformationFifth(textArray, parameterObject) {
    const result = {};
  
    Object.entries(parameterObject).forEach(([key, { possible, label }]) => {
      const extractedValues = textArray
        .map(line => {
          const foundVariation = possible[0].find(word => line.toLowerCase().includes(word.toLowerCase()));
  
          if (foundVariation) {
            // Get the remaining part of the line after the found word
            const remainingPart = line
              .substring(line.toLowerCase().indexOf(foundVariation.toLowerCase()) + foundVariation.length)
              .trim();
  
            return remainingPart;
          }
  
          return null;
        })
        .filter(value => value !== null);
  
      result[key] = extractedValues.length > 0 ? extractedValues : [""];
    });
  
    return result;
  }


const resultFifth = extractInformationFifth(nonEmptyTextLines3, parameterObject);
   console.log("fifth",resultFifth);
  

function getObjectByPossible(key, array, possibilityArray) {
    const result = { index: -1 };

    for (let i = 0; i < array.length; i++) {
        const line = array[i].toLowerCase();

        for (const possibility of possibilityArray) {
            const lowerPossibility = possibility.toLowerCase();
            const regex = new RegExp(`\\b${lowerPossibility}\\b`);

            if (regex.test(line)) {
                const match = line.match(/[a-f0-9]{8}[-][a-f0-9]{4}[-][a-f0-9]{4}[-][a-f0-9]{4}[-][a-f0-9]{12}/);
                if (match) {
                    result[key] = match;
                    result.index = i;
                    return result;
                }
            }
        }
    }

    return result;
  }
  
  // Example usage:
  const key = "VKN";
  const possibleArrays = ["Tel:","tel"];
  const exampleArray=["ETTN"]
  const resultObject = getObjectByKey("TARİH", nonEmptyTextLines, ["Tarih"]);
  console.log("obj",resultObject);