const parameterObject={
    ETTN:{
        possible:[['ETTN']],
        checkForNumber:false,
        subtractPossibilities:true,
        label:"ETTN",
    },
    Fatura_No:{
        possible:[
            ['Fatura'],
            ['No:',"no","NO","No","no:"]
        ],
        checkForNumber:false,
        subtractPossibilities:true,
        label:"Fatura No",
        
    },
    Fatura_Tarihi:{
        possible:[['Fatura'],["Tarih","tarihi","Tarihi"]],
        checkForNumber:false,
        subtractPossibilities:true,
        label:"Fatura Tarihi",
    },
    Fatura_Türü:{
        possible:[['Fatura',],["Tür","tür"]],
        subtractPossibilities:true,
        checkForNumber:false,
        label:"Fatura Türü",
    },
    Fatura_Tipi:{
        possible:[['Fatura'],["Tipi","tip","tipi"]],
        subtractPossibilities:true,
        checkForNumber:false,
        label:"Fatura Tipi",
    },
    Senaryo:{
        possible:[['SENARYO',"Senaryo"]],
        subtractPossibilities:true,
        checkForNumber:false,
        label:"Senaryo",
    },
    Cari_Vkn_Tckn:{
        possible:[['VKN',"TCKN","Vkn","Tckn","VKN/TC"]],
        subtractPossibilities:true,
        checkForNumber:false,
        label:"Cari Vkn/Tckn",
    },
    Sıra_No:{
        possible:[['Sıra',"No"]],
        subtractPossibilities:true,
        checkForNumber:false,
        label:"Sıra No",
    },
    Ürün_Kodu:{
        possible:[['Ürün'],["Kodu"]],
        subtractPossibilities:true,
        checkForNumber:false,
        label:"Ürün Kodu",
    },
    Hizmet_Toplam_Tutar:{
        possible:[['Toplam',"Ödenecek"],["Tutar","Tutarı"]],
        subtractPossibilities:true,
        checkForNumber:true,
        label:"Hizmet Toplam Tutar",
    }, 
    Genel_Toplam:{
        possible:[['Genel',"Toplam","Ödenecek"],["tutar","Tutarı"]],
        subtractPossibilities:true,
        checkForNumber:true,
        label:"Genel Toplam",
    }
}

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
              .trim();
          }
  
          if (checkForNumber) {
            const numberMatch = resultText.match(/\d+/);
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
  
  const key = "FaturaNo";
  const array = [
    "Textwithpossibilityonepossibilitytwo100TL",
    "Another sub some ridiciolus with POSSIBILITY2",
    "Yet another string that no ontains any",
    "Line with number 123"
  ];
  const possibilityArray = [["possibilityone"], ["possibilitytwo"]];
  
  // Test with subtractPossibilities and checkForNumber set to true
  const resultSubtractAndCheck = getObjectByKey3(key, array, possibilityArray, true, true);
  console.log(resultSubtractAndCheck);
  
  // Test with subtractPossibilities set to true and checkForNumber set to false (default)
  const resultSubtract = getObjectByKey3(key, array, possibilityArray,false, false);
  console.log(resultSubtract);