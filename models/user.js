// import mongoose from 'mongoose';

// const userSchema = new mongoose.Schema({
//     username: {type: String, required: true, unique: true},
//     password: {type: String, required: true},
//     entries: [
//         {
//             type: mongoose.Schema.Types.ObjectId,
//             ref: "Entry",
//         },
//     ],
// });

// const User = mongoose.model("User", userSchema);

// export default User;

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema( 
    {
        username: {
            type: String,
            required: 'Your username is required',
            unique: true,
        },
        password: {
            type: String, 
            required: 'Your password is required',
            select: false,
            max: 25,
        },
    },
    { timestamps: true }
);

UserSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, (err, hash) => {
            if (err) return next(err);

            user.password = hash;
            next();
        });
    });
});

export default mongoose.model('users', UserSchema);
