const {Router, response} = require("express");
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const http = require('https');
//const userRouter = Router();
const apiRouter = Router();
const upload = multer();
const gTTS = require('gtts');
const { text } = require("body-parser");
const rapidAPIKey = process.env.RAPIDAPI_KEY;
const rapidAPIHost = process.env.RAPIDAPI_HOST;
//const audioPath = process.env.AUDIO_PATH;
//const { initializeApp } = require('firebase/app');
//const { getAuth } = require('firebase/auth');
//const mongoClient = require('mongoose');
//const ObjectId = require("mongodb").ObjectId;

const express = require('express');
const User = require("../models/user");

const userRouter = express.Router();

userRouter.post("/newuser", async (req, res) => {
    try {
        const userName = req.body.newUserName;
        const newPass = req.body.newPassword;

        const newUser = new User({ 
          username: userName, 
          password: newPass 
        });
      
        await newUser.save();
        console.log('User saved:', newUser);
        res.status(201).json(newUser);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

userRouter.post("/checktaken", async (req, res) => {
    try {
        const userName = req.body.newUserName.trim().toLowerCase(); // Trim and convert to lowercase

        const userExists = await User.findOne({ username: { $regex: new RegExp('^' + userName + '$', 'i') } }); // Case-insensitive regex

        const isTaken = !!userExists;
        
        res.json({ taken: isTaken });
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});
//todo
//1.get user by id
//2.way to check username
//3.create new entry
//}
apiRouter.use("/user", userRouter);

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
//console.log(text);
//console.log(userId);
//console.log(fileName);
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

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6inh3SZgix6rJCPzOmM0ii4ydEryTtcc",
  authDomain: "audiofile-9393c.firebaseapp.com",
  projectId: "audiofile-9393c",
  storageBucket: "audiofile-9393c.appspot.com",
  messagingSenderId: "330179755119",
  appId: "1:330179755119:web:17a7ff2a9d429be39f219a",
  measurementId: "G-7LS27FRJ15"
};

// Initialize Firebase
//const fireApp = initializeApp(firebaseConfig);
//const auth = getAuth(fireApp);
  

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

//deletes all files inside of specified directory
apiRouter.post('/deleteUserFolder', async (req, res) => { 
  const userId = req.body.userId;
  const folderPath = `./public/uploads/${userId}`;
  try {
    fs.rmSync(folderPath, { recursive: true, force: true });
    console.log(`${folderPath} is deleted!`);
    res.sendStatus(200);
  } catch (err) {
    console.error(`Error while deleting ${folderPath}.`);
    res.sendStatus(500);
  }
});

module.exports = apiRouter;