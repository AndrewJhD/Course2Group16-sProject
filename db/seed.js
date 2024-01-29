require("dotenv").config();
const {User, Asset} = require("../models");
const mongoose = require("mongoose");
const sampleData = require("./users.json");

const getId = (entity) => entity._id;

async function connectMongoose() {
    try {
        if (process.env.MODE == "production") {
            await mongoose.connect(`mongodb://192.168.171.67:27017/felipe_r`, {
                useNewUrlParser: true,
                authSource: "test",
                user: "felipe_r",
                pass: process.env.MONGO_PASSWORD,
            });
        } else {
            await mongoose.connect("mongodb://localhost:27017/goose");
        }
    } catch (e) {
        console.error(e);
    }
}

async function seedData() {
    try {
        const userRes = await User.deleteMany({});
        console.log("Users", userRes);
        const assetRes = await Asset.deleteMany({});
        console.log("Assets", assetRes);
        const {users, stocks} = sampleData;
        for (const user of users) {
            const seededAssets = [];
            for (const stock of stocks) {
                const newStock = await Asset.create(stock);
                seededAssets.push(newStock);
            }
            const assetIds = seededAssets.map(getId);
            const newUser = await User.create({
                ...user,
                assets: assetIds,
            });
            console.log("User created", getId(newUser));
            console.log(" with assets ", seededAssets.map(getId));
        }
    } catch (err) {
        console.error(err);
    } finally {
        process.exit();
    }
}

connectMongoose()
    .then(seedData)
    .catch((e) => console.error(e));

