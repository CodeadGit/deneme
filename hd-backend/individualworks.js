function getObjectByKey(key, array, possibilityArray) {
    const result = {
      [key]: array.reduce((accumulator, text) => {
        const lowercaseText = text.toLowerCase();
        const matchedPossibilities = possibilityArray.filter(innerArray =>
          innerArray.some(possibility =>
            lowercaseText.includes(possibility.toLowerCase())
          )
        );
  
        if (matchedPossibilities.length === possibilityArray.length) {
          accumulator.push(matchedPossibilities
            .flat()
            .map(possibility => possibility.toLowerCase())
            .reduce((text, possibility) => text.replace(possibility, ''), lowercaseText)
            .trim());
        }
  
        return accumulator;
      }, [])
    };
  
    return result;
  }
  
  const key = "FaturaNo";
  const array = [
    "Text with possibility1possibility2",
    "Another sub some ridiciolus with POSSIBILITY2",
    "Yet another string that no ontains any"
  ];
  const possibilityArray = [["ridiciolus"], ["possibility2"]];
  
  const result = getObjectByKey(key, array, possibilityArray);
  console.log(result);