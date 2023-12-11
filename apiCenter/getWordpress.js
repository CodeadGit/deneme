//e8781f59a16282383ce2190af4e730ca
const axios = require('axios');


const getWordpressBlogs=async(params)=>{

    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `https://onlinekesif.com/blog/wp-json/wp/v2/posts?_embedded?_limit=10`,
      };
    try {
        const response=await axios(config)    
        
        return response.data;
    }catch (error) {
        return error
    }     
      
}

module.exports = {
    getWordpressBlogs
};