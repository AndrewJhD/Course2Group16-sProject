const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const port = 3000;
const viewRoutes = require("./routes/viewRoutes");
const apiRoutes = require("./routes/apiRoutes");

const logger = (req, res, next) => { 
    console.log(req.method, req.url);
    next();
};
app.use(logger);
app.use(express.static("public"), express.static("dist"));
app.use(viewRoutes);
app.use("/api", apiRoutes);

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/"); //insert database name here
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}

main().catch((err) => console.error(err));

