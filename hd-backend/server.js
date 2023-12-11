const express = require('express');
const cors = require('cors');
const app = express();
const PDFParser = require('pdf-parse');
const multer = require('multer');

const isimler  = require('./isimler');
const port = process.env.PORT || 3002;

app.use(cors());

const storageM = multer.memoryStorage();
const upload = multer({ storage: storageM });

app.post('/pdf', async (req, res) => {
  const { file } = req.body;
  console.log("çağırdı")
  console.log(file)
  const poppler = new Poppler();
  const options = {
    firstPageToConvert: 1,
    lastPageToConvert: 2,
  };
  const text = await poppler
	.pdfToHtml(file, "tester.html", options)
	.then((res) => {
		console.log(res);
	})
	.catch((err) => {
		console.error(err);
		throw err;
	});
		console.log(text);
});


app.post('/pdftohtml', upload.single('file'), async (req, res) => {
  const pdfContent = req.file;

  try {
    const pdfText = pdfContent.buffer.toString('utf-8');

    console.log(pdfText)
    res.status(200).send('Conversion successful');
  } catch (err) {
    console.error(err);
    res.status(500).send('Conversion failed');
  }
});


app.post('/buffer', async (req, res) => {
  const { file } = req.body;
  
  var decoded = Buffer.from(file, 'base64');
  await PDFParser(decoded).then(data=>{
    console.log(data.text);
  }).catch(err=>console.log(err));
  
});


const extractTextFromPDF = async (fileBuffer) => {
  try {
    const uint8Array = new Uint8Array(fileBuffer);

    const data = await PDFParser(uint8Array);

    const textContent = data.text;

    return textContent;
  } catch (error) {
    console.error('Error extracting text from PDF:', error.message);
    throw error;
  }
};

function findMatch(key, extractedArray, possibilityArray, defaultValue = null) {
  // Convert key to lowercase for case-insensitive comparison
  const normalizedKey = key.toLowerCase();

  for (const line of extractedArray) {
    const [lineKey, value] = line.split(':').map(item => item.trim().toLowerCase());

    // Check if the normalized key matches and the value is in the possibilityArray (after lowercasing)
    if (lineKey === normalizedKey && possibilityArray.map(val => val.toLowerCase()).includes(value)) {
      return value;
    }
  }

  // Return the specified defaultValue if no match is found
  return defaultValue;
}


const findMatchingValuesName = (arrT, arrN) => {
  return new Promise((resolve, reject) => {
    if (!Array.isArray(arrN)) {
      reject(new Error('arrN is not an array'));
      return;
    }

    const uniqueNames = new Set();
    console.log("async");

    for (const possibility of arrN) {
      const lowercasePossibility = possibility.toLowerCase();

      arrT.forEach((line, index) => {
        if (line?.toLowerCase()?.includes(lowercasePossibility)) {
          console.log("buldu");
          uniqueNames.add(line);
        }
      });
    }

    // Convert the Set back to an array
    const uniqueNamesArray = [...uniqueNames];
    console.log(uniqueNamesArray[0]);

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
    try {

      return await findMatchingValuesName(arrT, isimler);
    } catch (error) {
      console.error('Error reading the file:', error);
      throw error;
    }
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
      try {
        return await findMatchingValuesName(arrT, isimler);
      } catch (error) {
        console.error('Error reading the file:', error);
        throw error;
      }
    } else {
      distances.sort((a, b) => a.distance - b.distance);
      const nearestIndex = distances[0].index;
      allRes = arrT[nearestIndex];
      return Promise.resolve(allRes);
    }
  }
}


const specificArray = ['Sayın', 'Sayin', 'SN',"Sn","SAYIN"];
const firmNameArray = [
  'Ticaret',
  'Tic', 
  'Sanayi',"LTD","ŞTİ","STI","Limited","ltd",".şti","AŞ.","A.Ş.","A.Ş","Sistemleri", "Şirketi"];

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
        label:"Fatura_No",
        
    },
    Fatura_Tarihi:{
        possible:[['Fatura',"Düzenleme"],["tarihi","Tarihi","Tarih",]],
        checkForNumber:false,
        subtractPossibilities:true,
        proceed:true,
        label:"Fatura_Tarihi",
    },
    Fatura_Türü:{
        possible:[['Fatura',],["Tür","tür"]],
        subtractPossibilities:true,
        proceed:true,
        checkForNumber:false,
        label:"Fatura_Türü",
    },
    Fatura_Tipi:{
        possible:[['Fatura'],["Tipi","tip","tipi"]],
        subtractPossibilities:true,
        proceed:true,
        checkForNumber:false,
        label:"Fatura_Tipi",
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
        label:"Hizmet_Toplam_Tutar",
    }, 
    Genel_Toplam:{
        possible:[['Genel',"Toplam","Ödenecek"],["tutar","Tutarı","Toplam"]],
        subtractPossibilities:true,
        proceed:true,
        checkForNumber:true,
        label:"Genel_Toplam",
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
async function processParameterObject(parameterObject, extractedTextArray) {
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

app.post('/getText', upload.single('file'), async (req, res) => {
  try {
    const textContent = await extractTextFromPDF(req.file.buffer);
    //const tables = identifyTables(textContent);
    let processedText = textContent.replace(/"/g, ''); 
    //const extractedInfo = extractInformation(processedText);
    const textLines = processedText.split(/\r?\n/);
    const nonEmptyTextLines = textLines.filter(line => line.trim() !== '').map(line => line.trim());
    const firmName=await findNearestValueInArray(nonEmptyTextLines, firmNameArray,specificArray)
    const details= await processParameterObject(parameterObject,nonEmptyTextLines)
    res.status(200).json({ 
      success: true, 
      textContent: processedText,
      textLines:nonEmptyTextLines,
      Cari_Adı:firmName,
      ...details
     });
  } catch (error) {
    console.error('Error handling file upload:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
