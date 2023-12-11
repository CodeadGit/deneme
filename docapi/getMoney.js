const axios = require('axios');
var convert = require('xml-js');


const getCurrency=async()=>{

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://www.tcmb.gov.tr/kurlar/today.xml',
        headers: { 
            "Accept": "application/json",
                "Accept-Encoding": "gzip, compress, deflate, br"
        },
        withCredentials: false,
      };
    try {
        const response=await axios(config)
        const xmlData = response.data;

        // Convert XML to JSON
        const jsonData = convert.xml2json(xmlData, { compact: true, spaces: 4 });

        return JSON.parse(jsonData);
        
        
    }catch (error) {
        return error
    }     
      
}

module.exports = {
    getCurrency
};