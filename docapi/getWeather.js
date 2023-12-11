const axios = require('axios');


const getWeather=async(params)=>{

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.open-meteo.com/v1/forecast?latitude=${params.lat}&longitude=${params.long}&current_weather=true&timezone=auto&start_date=${params.startDate}&end_date=${params.endDate}`,
      };
    try {
        const response=await axios(config)    
        
        return response.data;
    }catch (error) {
        return error
    }     
      
}

module.exports = {
    getWeather
};