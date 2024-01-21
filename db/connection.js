const {MongoClient} = require("mongodb");
console.log(process.env.MODE);
let url = "mongodb://localhost:27017";
if (process.env.MODE == "production") {
    url = ``; //add in connection to techwise db here
} else {
    url = "mongodb://localhost:27017";
}
const mongoClient = new MongoClient(url);
module.exports = mongoClient;
