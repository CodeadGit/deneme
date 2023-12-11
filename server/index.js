const express = require("express");
var cors = require('cors')
const bodyparser =require("body-parser");
const multer = require('multer');
const admin = require('firebase-admin');

const serviceAccount = require('./firebaseCredentials.json'); // Update with your Firebase credentials

const multiparty =require("connect-multiparty");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const MultipartyMiddleware=multiparty({uploadDir:"./images"})
const morgan= require("morgan");

const PORT = process.env.PORT || 3001;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://hduysun-v1.appspot.com',
});
const app = express();
app.use(cors())
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());


app.get("/", (req, res) => {
    res.status(200).json({ message: "Hello from server!" });
  });

cloudinary.config({
    cloud_name: 'dnqt0mijh',
    api_key: '269757612561295',
    api_secret: 'lUwU-WADTmcqxNIxYi-7RA-kjW8'
  });


app.post('/uploads',MultipartyMiddleware,(req,res)=>{
  // Access the uploaded files

  const files = Array(req.files);
  //console.log(req.files.upload)
  // Step 2: Upload the images to Cloudinary
  const uploadedImageUrls = [];

  try {
    // Function to upload each image
    const uploadImage = async (localImageUrl, index) => {
      const result = await cloudinary.uploader.upload(localImageUrl);
      console.log('Image ' + index + ' uploaded to Cloudinary');
      console.log('Cloudinary URL:', result.secure_url);

      uploadedImageUrls[index] = result.secure_url; // Store the Cloudinary URL for the image

      // Check if all images have been uploaded
      if (uploadedImageUrls.length === files.length) {
        // All images have been uploaded, send the response
        console.log('All images uploaded:', uploadedImageUrls);
        res.send('Images uploaded');
      }
    };

    // Upload each image
    for (let i = 0; i < files.length; i++) {
      const localImageUrl = files[i].upload.path;
      uploadImage(localImageUrl, i);
    }
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).send('Error uploading images');
  }
})


const storage = admin.storage().bucket();

const upload = multer({
  storage: multer.memoryStorage(),
});

app.post('/upload-image', (req, res, next) => {
  console.log(req.body); // Log the request body
  next(); // Move to the next middleware
},upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }

    const idForAll = Math.floor(100000 + Math.random() * 900000).toString();
    const imageRef = storage.file(`jodit/${idForAll}.jpg`);

    await imageRef.save(req.file.buffer, { contentType: req.file.mimetype });

    const downloadURL = await imageRef.getSignedUrl({
      action: 'read',
      expires: '03-09-2491', // Replace with a suitable expiration date
    });

    res.json({ success: true, url: downloadURL });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});