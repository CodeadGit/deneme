const filteredLines = nonEmptyTextLine.filter(line =>
    !allPossible.concat(iller).concat(isimler).some(word => line.toLowerCase()?.includes(word.toLowerCase()))
  );
  
  const totalArray = [].concat.apply([], filteredLines.map(line => line.split(/\s+/)));

  const filteredLinesSecondLayer = totalArray.filter(line =>
    !allPossibleSecondLayer.some(word => line.toLowerCase()?.includes(word.toLowerCase()))
  ).filter(word => isNaN(parseInt(word, 10)));
  ;

  const possibleArray = ["bedeli","Adet","birim"];

  // Filtering the result array based on the possibleArray
  const resultArray = filteredLinesSecondLayer.filter(prefix =>
    nonEmptyTextLine.some(item =>
      item.includes(prefix) && possibleArray.some(element => item.includes(element))
    )
  );
  const resultArrayThirdLayer = nonEmptyTextLine.filter(prefix =>
    resultArray.some(item =>
      prefix.includes(item)
    )
  );