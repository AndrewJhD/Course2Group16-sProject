const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    name: {type: String, required: true},
    time: {type: Number, required: true},
    date_made:{type: Date, required: true}
});

const Asset = mongoose.model("Entry", assetSchema);

module.exports = Entry;

