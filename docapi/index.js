const express = require('express')
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const { getCurrency } = require('./getMoney');
const { getWeather } = require('./getWeather');
const { getWeatherAlt } = require('./getWeatherAlt');
const { getGold } = require('./getGold');
const { getGenelPara } = require('./getParaBirimleri');
const { getPuanDurumu, getPuanDurumuFirst, getPuanDurumuSecond } = require('./getPuanDurumu');
const { getEczaneler } = require('./getEczane');
const app = express()
const port = 3005

app.use(express.json());
app.use(cors());
const serviceAccount = {
  "type": "service_account",
  "project_id": "hduysun-v1",
  "private_key_id": "2802d9534e0f2079ffe7e551f52b5b6973f42888",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDdy8+4/kznn4Z+\nLfnAmXda53Y3GtwK+oV5nCzKJTgCLy91aqa8TXLG5YUTTloct2VQPWCimKc05fjd\npnla3H8jgAAg14hGFKVljlGhitdL6TadqiJKvolVfHcQtZR5qG4OQOzDI5/+JGpi\n3FGpBH5xnpg2hP8Hfj1Uo7LvV8G8bLbNdNTkZdXfzV6BBV7lZBPiBoc38Km048q4\ncFCGUXG2OiFmit9lRKPchz9RH/6dx/vcWoDc2sFPPcOkus292V/oFM6bq5oNiZYH\nY/71RbT2be0bBF0jljLanRy0/TSo6t28XC7nXUSudqLtRSQn14CQB7Fts40N6Vh6\n4ekdr2pxAgMBAAECggEAA6+OyrnLyzVAXdRDmFLZ4/8WMhQRGuFEZWZgwSriq3if\nbtxVm9Sj/GWqiI0EBtejsvRo03LleRsm6lSz+LxSzuMiPWl6LdigfKz43XjKRfbr\nbdh6sZLJLfbqSfML3gSxmteIh7VNw+z/fpfqMdHttv4mHzvRECMQf67+ZXyoGcqN\nyABmrabDeK8rs9g7zA90ztqRww2poAxtPXJqIuzSYUz+Xoc6VQbPviEuu+lkXb4/\nvvnkdrIt7bJWmS3z93U3bqL9Auudq1NJcte7+WoyV6brIyA//nBU7uhjyUpyXFmn\niE0pg5NTgViHaxIKC00uRCsb5jMRwe6A/6iPK5xgsQKBgQD0k7SQp0EFbHyVe+1J\nKzb5IAYOzrf62V6QUCQAATeflNb3vwgMM99yzOx1x3t3hVTBZxTu2/4oR5j1SJsg\n3zN7IM33s4iv5bLd+TeWPJ+0vp5vsWVCMyw8jsz/qfEnu9Tdby0CNrpeQ/kI105s\nRC4qPurpK84crpecNLM+/W66qQKBgQDoJ7ngrbZJndj9b0ckVG79z80fKEO/ZjGT\nrnxnZcn3PbjhaEvViuFWhxdrtPtMKV3wOWCTw96B++MHFWDPsvtTHWfeqmc3vT/T\nCYb4RM1QHYA059sOecnqkLAeh1HJ3TxD5EM3uJtwANK1vaFdVKclndSBRm20nizy\nAYf4BysWiQKBgDuVWGH9PSvzGA7a2B4BNy1ODevBlLS6C/2gaITPxxtLiWtl0LIY\nWRGAtwKijIO7qcBMOp9OXQa3Gp53B8PkXIhcn5D+3gfsL71AH7isIERKRBL15rNQ\nADDooSyP3D5P1jX0BcUKTDD24k6zFVnu6khEd7pCf74hErJtbFWmLDmxAoGAVsi6\n+J2Xfi+OtTbK/m69yw3KXTJdGQin0dAxWym29UDSgxjM+HfhQspfW/kc09zG7A1W\n6AYZgLfbp4M7XIlI4Eom0RscWL7bRBXUqax2n9NXYO+neOLYM2KBI/hr/60/YRXM\nduEA4j68hgnsb4o8rZgxn13nltRmctVVscdkORkCgYEAjGiixuW19rp+fAfFu5nV\nYEm22Ej7ywckFnABZt3VOpjDnPBCz5/vaaAWxJK5ld9TTGDNMCQYjppb7OcMQERH\nivVmpJxpoG8c37vOax3m/qTfnnBbazkgkCqvZ8iFvfk5bwLUfvdlRjOA/K8qm8xn\n07oPUsAi5wCcjvC/6x2gvTo=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-k9v8r@hduysun-v1.iam.gserviceaccount.com",
  "client_id": "118320066813028508311",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k9v8r%40hduysun-v1.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};
admin.initializeApp({
credential: admin.credential.cert(serviceAccount)
});

const storage = admin.storage();
const bucket = storage.bucket('hduysun-v1.appspot.com');

const getCityName = async (location) => {
  console.log("fonksiyon içi",location)

  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.long}&radius=1000&key=AIzaSyCluWp7DJQ3HpAMJrUerzfd2RYbSBVvePw&language=tr`,
  };

  try {
    const response = await axios(config);
//console.log(response);

    return response.data;
  } catch (error) {
    return error;
  }
};

const getCountryName = async (location) => {

  console.log("fonksiyon içi",location)
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.long}&key=AIzaSyCluWp7DJQ3HpAMJrUerzfd2RYbSBVvePw&language=tr`,
  };

  try {
    const response = await axios(config);
//console.log(response);

    return response.data;
  } catch (error) {
    return error;
  }
};

app.post("/cityfinder", async (req, res) => {
console.log(req.body);

  try {
    const result = await getCityName(req.body);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Böyle bir şehir yok" });
  }
});

app.post("/countryfinder", async (req, res) => {
console.log(req.body);
try {
    const result = await getCountryName(req.body);

    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: "Böyle bir ülke yok" });
  }
});
// Middleware
app.use(bodyParser.json({ limit: '10mb' })); // Set a larger limit
app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post("/wf", async(req, res) => {
  const param = req.body;
  try {
    const result= await getWeatherAlt(param);
    //res.json({main:result.result.weather[0].main,desc:result.result.weather[0].description,temp:result.result.main.temp})
    res.json({result})

  } catch (error) {
    res.status(500).json({ error: 'WP error occurred',error });
  }
  });
app.post("/eczane", async(req, res) => {
  const param = req.body;
  try {
    const result= await getEczaneler(param);
    //res.json({main:result.result.weather[0].main,desc:result.result.weather[0].description,temp:result.result.main.temp})
    res.json({result})

  } catch (error) {
    res.status(500).json({ error: 'WP error occurred',error });
  }
  });

app.get("/gold", async(req, res) => {
  const param = req.body;
  try {
    const result= await getGold(param);
    //res.json({main:result.result.weather[0].main,desc:result.result.weather[0].description,temp:result.result.main.temp})
    res.json({result})

  } catch (error) {
    res.status(500).json({ error: 'WP error occurred',error });
  }
  });
app.get("/genelPara", async(req, res) => {
  try {
    const result= await getGenelPara();
    //res.json({main:result.result.weather[0].main,desc:result.result.weather[0].description,temp:result.result.main.temp})
    res.json({result})

  } catch (error) {
    res.status(500).json({ error: 'GP error occurred',error });
  }
  });
  app.get("/puan-durumu", async(req, res) => {
    try {
      const result= await getPuanDurumu();
      res.json({result})
  
  
    } catch (error) {
      res.status(500).json({ error: 'Puan Durumu error occurred' });
  
    }
    });
  app.get("/puan-durumu-1", async(req, res) => {
    try {
      const result= await getPuanDurumuFirst();
      res.json({result})
  
  
    } catch (error) {
      res.status(500).json({ error: 'Puan Durumu error occurred' });
  
    }
    });
  app.get("/puan-durumu-2", async(req, res) => {
    try {
      const result= await getPuanDurumuSecond();
      res.json({result})
  
  
    } catch (error) {
      res.status(500).json({ error: 'Puan Durumu error occurred' });
  
    }
    });

app.post('/upload', async (req, res) => {
  try {
    const { img,category,title,id,coll } = req.body;

    // Extract the base64-encoded image data from the data URL
    const base64Image = img.replace(/^data:image\/\w+;base64,/, '');

    // Convert the base64 data to a buffer
    const imageBuffer = Buffer.from(base64Image, 'base64');

    // Define a unique filename for the image
    const filename = `${coll==="PhotoGallery"?"foto":"video"}-galeri/${category}/${title}/kapak-fotografi.jpg`;

    // Upload the image buffer to Firebase Storage
    const file = bucket.file(filename);

    await file.save(imageBuffer);
    const downloadUrl = await file.getSignedUrl({
        action: 'read',
        expires: '03-09-2031' // Replace with an appropriate expiration date
      })

      const db = admin.firestore();
      const docRef = db.collection(coll).doc(id)
      await docRef.update({ headImg: downloadUrl });

      res.status(200).json({ downloadUrl }); // Sending response as JSON
    } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred.');
  }
});
const storageM = multer.memoryStorage();

const upload = multer({ dest: 'uploads/' }); // Set your upload directory

app.post('/editor',upload.single("file") ,async (req, res) => {
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  try {
    // Access the uploaded file using req.file
    const file = req.file;

    // Process the file as needed
    console.log('Uploaded file:', file);

    // Send a response back to the client if necessary
    res.status(200).json({ msgs: ['File uploaded successfully'], error: null });

  } catch (error) {
    console.error('Error handling file upload:', error);
    res.status(500).json({ msgs: ['Error uploading file'] });
  }
});




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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})