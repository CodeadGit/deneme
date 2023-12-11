const axios = require('axios');
var convert = require('xml-js');


const getGold=async()=>{

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.genelpara.com/embed/altin.json',
        headers: { 
            "Accept": "application/json",
                "Accept-Encoding": "gzip, compress, deflate, br"
        },
        withCredentials: false,
      };
    try {
        const response=await axios(config)


        return JSON.parse(response.data);
        
        
    }catch (error) {
        return error
    }     
      
}

module.exports = {
    getGold
};