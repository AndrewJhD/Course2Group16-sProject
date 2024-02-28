import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import { PORT, MONGO_URI } from './config/index.js';
import App from './routes/index.js';
import apiRoutes from './routes/apiRoutes.js';

const server = express();

server.disable('x-powered-by'); // Reduce fingerprinting
server.use(cookieParser());
server.use(express.urlencoded({ extended : false }));
server.use(express.json());

mongoose.promise = global.Promise;
mongoose.set('strictQuery', false);
mongoose.connect(MONGO_URI)
.then( () => {
   console.log("Connected to database.");
})
.catch((err)=>{
   console.log(`Database connection error:${err}`);
});

const logger = (req, res, next) => { 
    console.log(req.method, req.url);
    next();
};
server.use(App);

server.use(logger);

server.use(express.static("public"));

server.use("/api", apiRoutes);

server.listen(PORT, () => 
    console.log(`Server running on http://localhost:${PORT}`)
);