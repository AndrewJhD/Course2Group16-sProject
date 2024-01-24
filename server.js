const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
require("dotenv").config();
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
//app.use("/api", apiRoutes); //commented out to allow webpages to load webpages

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