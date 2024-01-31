const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    user_id: {type: Number, required: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    /*securityQuestion: {type: String, required: true},
    securityAnswer: {type: String, required: true}, */ //possibly add in but idk if we wanna wait till later for it
    entries: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Entry",
        },
    ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
