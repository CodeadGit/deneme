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

/*  
result is 
{FaturaNo: ['Text with possibility1possibility2']}, it is ok but i need as result {FaturaNo: ['Text with']}

*/

  

  
  
  
  
  function getObjectByKey3(key, array, possibilityArray, subtractPossibilities = false) {
    const result = {
      [key]: array.reduce((accumulator, text) => {
        const lowercaseText = text.toLowerCase();
        const matchedPossibilities = possibilityArray.filter(innerArray =>
          innerArray.some(possibility =>
            lowercaseText.includes(possibility.toLowerCase())
          )
        );
  
        if (matchedPossibilities.length === possibilityArray.length) {
          if (subtractPossibilities) {
            accumulator.push(matchedPossibilities
              .flat()
              .map(possibility => possibility.toLowerCase())
              .reduce((text, possibility) => text.replace(possibility, ''), lowercaseText)
              .trim());
          } else {
            accumulator.push(text);
          }
        }
  
        return accumulator;
      }, [])
    };
  
    return result;
  }
  
  const key3 = "FaturaNo";
  const array3 = [
    "Text with possibilityonepossibilitytwo",
    "possibilityonepossibilitytwo",
    "100TL",
    "Another sub some ridiciolus with POSSIBILITY2",
    "Yet another string that no ontains any"
  ];
  const possibilityArray3 = [["possibilityone"], ["possibilitytwo"]];
  
  // Test with subtractPossibilities set to true
  const resultSubtract = getObjectByKey3(key3, array3, possibilityArray3, true);
  console.log("çıkar",resultSubtract);
  
  // Test with subtractPossibilities set to false (default)
  const resultNoSubtract = getObjectByKey3(key3, array3, possibilityArray3);
  console.log("çıkarma",resultNoSubtract);




  function containsNumber(lines) {
    return lines.some(text => /\d/.test(text));
  }
  
  const array1 = [
    "Text without numbers",
    "Another line with 123.78",
    "Yet another string"
  ];
  
  const array2 = [
    "This line has no numbers",
    "Another line without numbers",
    "And one more without numbers"
  ];
  
  console.log(containsNumber(array1)); // Output: true
  console.log(containsNumber(array2)); // Output: false
  