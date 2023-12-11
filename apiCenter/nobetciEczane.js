//e8781f59a16282383ce2190af4e730ca
const axios = require('axios');


const fetchEczaneInfo = async (params) => {

    
    try {
      const res = await axios.get(
        `https://api.collectapi.com/health/dutyPharmacy?ilce=${params.region}&il=${params.city}`,
        {
          headers: {
            "Content-Type": "application/json",
            "authorization":
              "apikey 0GQBAjriPIwWIqjcxU7MhJ:5p1vdCUZGkH9xE3UI5ihuh",
          },
        }
      );
      const list = res.data.result;
      return list
    } catch (error) {
      console.log(error);
    }
  };

module.exports = {
    fetchEczaneInfo
};