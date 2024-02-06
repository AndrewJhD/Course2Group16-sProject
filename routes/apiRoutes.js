const {Router, response} = require("express");
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const http = require('https');
const userRouter = Router();
const apiRouter = Router();
const upload = multer();
const rapidAPIKey = process.env.RAPIDAPI_KEY;
const rapidAPIHost = process.env.RAPIDAPI_HOST;
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
              console.log(responseBody);
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

  module.exports = apiRouter;