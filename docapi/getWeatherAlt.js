const axios = require('axios');


const getWeatherAlt=async(params)=>{

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://api.openweathermap.org/data/2.5/weather?q=${params.city}&appid=aee9368ab4b3e538bec75d39005eccf3&units=metric&lang=tr`,
      };
    try {
        const response=await axios(config)    
        
        return response.data;
    }catch (error) {
        return error
    }     
      
}

module.exports = {
    getWeatherAlt
};