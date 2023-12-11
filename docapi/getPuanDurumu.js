const axios = require('axios');


const getPuanDurumu=async()=>{

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://tffapi-1-y6918016.deta.app/live',
        headers: { }
      };
    try {
        const response=await axios(config)    
        
        return response.data;
    }catch (error) {
        return error
    }     
      
};

const getPuanDurumuFirst=async()=>{

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://tffapi-1-y6918016.deta.app/live/league/tff-1',
        headers: { }
      };
    try {
        const response=await axios(config)    
        
        return response.data;
    }catch (error) {
        return error
    }
};
      
const getPuanDurumuSecond=async()=>{

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://tffapi-1-y6918016.deta.app/live/league/tff-2',
        headers: { }
      };
    try {
        const response=await axios(config)    
        
        return response.data;
    }catch (error) {
        return error
    }     
      
};

module.exports = {
    getPuanDurumu,
    getPuanDurumuFirst,
    getPuanDurumuSecond
};