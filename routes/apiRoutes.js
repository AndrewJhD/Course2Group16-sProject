const {Router, response} = require("express");
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const http = require('https');
const userRouter = Router();
const apiRouter = Router();
const upload = multer();
const gTTS = require('gtts');
const { text } = require("body-parser");
const rapidAPIKey = process.env.RAPIDAPI_KEY;
const rapidAPIHost = process.env.RAPIDAPI_HOST;
const audioPath = process.env.AUDIO_PATH;
//const mongoClient = require("../db/connection");
//const ObjectId = require("mongodb").ObjectId;
//const {User, Entry} = require("../models");

//const targetDb = process.env.MODE == "production";
//const db = mongoClient.db(targetDb);


//apiRouter.use("/user", userRouter);

apiRouter.post('/rapidapi', upload.single('document'), async (request, res) => {
    try {
      console.log("Making fetch");
      const fileData = request.file.buffer;
  
      const formData = new FormData();
      formData.append('file', fileData, { filename: request.file.originalname });
  
      const options = {
          method: 'POST',
          hostname: rapidAPIHost,
          port: null,
          path: '/api/converter/1/FileConverter/Convert',
          headers: {
              'Content-Type': 'multipart/form-data; boundary=' + formData.getBoundary(),
              'Content-Length': formData.getLengthSync(),
              'X-RapidAPI-Key': rapidAPIKey,
              'X-RapidAPI-Host': rapidAPIHost
          }
      };
  
      const req = http.request(options, function (responseFromRapidAPI) {
          const chunks = [];
      
          responseFromRapidAPI.on('data', function (chunk) {
              chunks.push(chunk);
          });
      
          responseFromRapidAPI.on('end', function () {
              const responseBody = Buffer.concat(chunks).toString();
              //console.log(responseBody);
              const data = JSON.parse(responseBody);

              const text = data.text || [];
              res.status(200).send(text);
          });
      });
  
      req.on('error', (error) => {
        console.error('Error calling RapidAPI:', error);
        res.status(500).json({ error: 'Internal server error' });
      });
  
      formData.pipe(req);
  
    } catch (error) {
      console.error('Error processing document:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  
  });
  
  //causes the program to wait until the generation is completed entirely
  function generateAudio(text, userId, fileName) {
    return new Promise((resolve, reject) => {
        const gtts = new gTTS(text, 'en');
        const filePath = `public/uploads/${userId}/audio/${fileName}.mp3`;
        
        gtts.save(filePath, (err, result) => {
            if (err) {
                reject(err);
            } else {
                console.log('Audio generated:', filePath);
                resolve(filePath);
            }
        });
    });
}

apiRouter.post('/saveAudio', async (req, res) => {
  console.log("Entering Audio Maker");
  const userId = req.body.userId;
  const fileName = req.body.fileName;
  const text = req.body.text;
  //console.log(req.body.text);
  //console.log(req.body.userId);
  //console.log(req.body.audioNumber);
  try {
      console.log('Generating audio...');
      const filePath = await generateAudio(text, userId, fileName);
      console.log('Audio generated successfully at: ' + filePath)
      res.sendStatus(200);
  } catch (error) {
      console.error('Error generating audio:', error);
      res.status(500).send('Error generating audio');
  }
});

  //placeholder for a section of the account creation 
  apiRouter.post('/createUserFolders', (req, res) => {
    const userId = req.body.userId;
    const folderPath = `./public/uploads/${userId}/audio`;
    try {
      fs.mkdir(folderPath, { recursive: true }, (err) => {
        if (err) {
            console.error('Error creating folder:', err);
        } else {
            console.log('Folder created successfully!');
        }
    });
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
  });

  module.exports = apiRouter;