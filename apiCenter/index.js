const express = require("express");
const cors = require('cors');

const { getCurrency } =require("./getCurrency.js");
const { getWeather } = require("./getWeather.js");
const { getWordpressBlogs } = require("./getWordpress.js");
const { fetchEczaneInfo } = require("./nobetciEczane.js");

const PORT = process.env.PORT || 3005;

const app=express();

app.use(express.json());
app.use(cors());


app.get("/money", async(req, res) => {
  try {
    console.log('Request received:', req);
    const result = await getCurrency();
    res.json({ result });
    console.log({ result });
  } catch (error) {
    console.error('Error in /money endpoint:', error);
    res.status(500).json({ error: 'Money API error' });
  }
    });
// app.get("/money", async(req, res) => {
//     try {
//       const result= await getCurrency();
//       res.json({result})
//       console.log({result})
  
//     } catch (error) {
//       res.status(500).json({ error: 'Money api ' });
//       console.log(error)

//     }
//     });

app.get("/wf", async(req, res) => {
    const param = req.body;
    try {
      const result= await getWeather(param);
      res.json({result})
  
    } catch (error) {
      res.status(500).json({ error: 'WP error occurred' });
    }
    });

app.get("/eczane", async(req, res) => {
    const param = req.body;
    try {
      const result= await fetchEczaneInfo(param);
      res.json({result})
  
    } catch (error) {
      res.status(500).json({ error: 'WP error occurred' });
    }
    });
app.get("/blogs", async(req, res) => {
    const param = req.body;
    try {
      const result= await getWordpressBlogs(param);
      res.json(result)
  
    } catch (error) {
      res.status(500).json({ error: 'WP error occurred' });
    }
    });

app.listen(PORT, () => {
        console.log(`Hduysun listening on ${PORT}`);
      });