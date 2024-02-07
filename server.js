const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const port = 3000;
const viewRoutes = require("./routes/viewRoutes");
const apiRoutes = require("./routes/apiRoutes");

const logger = (req, res, next) => { 
    console.log(req.method, req.url);
    next();
};
app.use(logger);
app.use(bodyParser.urlencoded({extended: false}),bodyParser.json({extended: false}));

app.use(express.static("public"));
app.use(viewRoutes);
app.use("/api", apiRoutes); //commented out to allow webpages to load webpages



/*app.post('/rapidapi', upload.single('document'), async (request, res) => {
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
            res.status(200).send(responseBody);
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

}); */
    
/* async function main() {
    await mongoose.connect(""); //insert tw database name here
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}

main().catch((err) => console.error(err)); */

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});