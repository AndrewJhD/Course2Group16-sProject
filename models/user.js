import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SECRET_ACCESS_TOKEN } from '../config/index.js';

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

UserSchema.methods.generateAccessJWT = function () {
    let payload = {
        id: this._id,
    };
    return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
        expiresIn: '1h',
    });
};

export default mongoose.model('users', UserSchema);
