import * as dotenv from "dotenv";
dotenv.config();

const { MONGO_URI, PORT, SECRET_ACCESS_TOKEN } = process.env;

export { MONGO_URI, PORT, SECRET_ACCESS_TOKEN };