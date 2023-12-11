const axios = require('axios');
var convert = require('xml-js');


const getGenelPara = async () => {
    try {
        const response = await fetch("https://api.genelpara.com/embed/para-birimleri.json");
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        return jsonData;
    } catch (error) {
        console.error('Error:', error);
        throw error; // You can choose to handle the error or propagate it to the calling code
    }
};

module.exports = {
    getGenelPara
};
