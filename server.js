import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { PORT, URI } from './config/index.js';
import App from './routes/index.js';
import bodyParser from 'body-parser';
import connectDB from './db/connection.js';
import {} from 'dotenv/config';
import apiRoutes from './routes/apiRoutes.js';
connectDB();

const server = express();

server.use(cors());
server.use(cookieParser());
server.use(express.urlencoded({ extended : false }));
server.use(express.json());

mongoose.promise = global.Promise;
mongoose.set('strictQuery', false);
mongoose
    .connect(URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(console.log('Connected to database'))
    .catch((err) => console.log(err));

server.use(App);

server.listen(PORT, () => 
    console.log(`Server running on http://localhost:${PORT}`)
);

const logger = (req, res, next) => { 
    console.log(req.method, req.url);
    next();
};

App.use(logger);
App.use(bodyParser.urlencoded({extended: false}),bodyParser.json({extended: false}));

App.use(express.static("public"));
App.use("/api", apiRoutes);
    
/* async function main() {
    await mongoose.connect(""); //insert tw database name here
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
}

main().catch((err) => console.error(err)); */

// app.listen(PORT, () => {
//     console.log(`Listening on port ${PORT}`);
// });