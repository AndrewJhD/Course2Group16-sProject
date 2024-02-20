import Router from 'express';
import multer from 'multer';
import FormData from 'form-data';
import fs from 'fs';
import http from 'https';
const apiRouter = Router();
const upload = multer();
import gTTS from 'gtts';
import text from 'body-parser';
const rapidAPIKey = process.env.RAPIDAPI_KEY;
const rapidAPIHost = process.env.RAPIDAPI_HOST;
const audioPath = process.env.AUDIO_PATH;
import express from 'express';
import User from '../models/user.js';
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

userRouter.post("/checkUsername", async (req, res) => {
    try {
        const userName = req.body.username; 


        const userExists = await User.findOne({ username: userName });

        if (userExists) {
            console.log('Username exists:', userName);
            res.status(200).json({ exists: true });
        } else {

            console.log('Username does not exist:', userName);
            res.status(200).json({ exists: false });
        }
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});
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

apiRouter.post('/deleteSingleAudio', async (req, res) => { //not testible yet due to reliance on browse page being completed frist
    const userId = req.body.userId;
    const fileName = req.body.fileName;
    const filePath = `./public/uploads/${userId}/audio/${fileName}.mp3`;
    try {
        fs.unlinkSync(filePath);
        console.log(`${filePath} has been deleted.`);
        res.status(200);
      } catch (error) {
        console.error(`Error deleting ${filePath}:`, error);
        res.status(500);
      }
});

apiRouter.post('/checkFiles', async (req, res) => { //not testible yet due to reliance on browse page being completed frist
    const userId = req.body.userId;
    const fileName = req.body.fileName;
    const filePath = `./public/uploads/${userId}/audio/${fileName}.mp3`;
    if (fileExists(filePath)) {
      console.log('File exists.');
      res.status(200).send('true');
    } else {
      console.log('File does not exist.');
      res.status(200).send('false');
    }
});

function fileExists(filePath) {
    try {
      // Check if the file exists synchronously
      console.log("checking for file");
      return fs.existsSync(filePath);
    } catch (error) {
      console.error('Error checking file existence:', error);
      return false;
    }
}

export default apiRouter;