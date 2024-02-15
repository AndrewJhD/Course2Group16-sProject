const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
    name: {type: String, required: true},
    //time: {type: Number, required: true},
    //date_made:{type: Date, required: true}
});

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;


