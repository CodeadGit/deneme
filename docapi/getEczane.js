const axios = require('axios');
var convert = require('xml-js');



const getEczaneler = async (info) => {
    var API_KEY="apikey 0GQBAjriPIwWIqjcxU7MhJ:5p1vdCUZGkH9xE3UI5ihuh"

    try {
      const res = await axios.get(
        `https://api.collectapi.com/health/dutyPharmacy?ilce=${info.region}&il=${info.city}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: API_KEY,
          },
        }
      );
      const list = res.data.result;
      return list;

    } catch (error) {
      console.log(error);
    }
  };

module.exports = {
    getEczaneler
};
