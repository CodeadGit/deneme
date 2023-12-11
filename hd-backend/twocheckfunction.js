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
  
          if (checkForNumber && containsNumber([resultText])) {
            accumulator.push(resultText);
          } else if (!checkForNumber) {
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
    "Text with possibility1possibility2 100TL",
    "Another sub some ridiciolus with POSSIBILITY2",
    "Yet another string that no ontains any",
    "Line with number 123"
  ];
  const possibilityArray = [["possibility1"], ["possibility2"]];
  
  // Test with subtractPossibilities and checkForNumber set to true
  const resultSubtractAndCheck = getObjectByKey3(key, array, possibilityArray, true, true);
  console.log(resultSubtractAndCheck);
  
  // Test with subtractPossibilities set to true and checkForNumber set to false (default)
  const resultSubtract = getObjectByKey3(key, array, possibilityArray, false,false);
  console.log(resultSubtract);
  