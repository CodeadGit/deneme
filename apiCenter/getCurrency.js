const axios = require('axios');


const getCurrency=async()=>{

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.genelpara.com/embed/para-birimleri.json',
        headers: { }
      };
    try {
        const response=await axios(config)
          return response.data;
        
        
    }catch (error) {
        return error
    }     
      
}

module.exports = {
    getCurrency
};