import User from '../models/user.js';
import bcrypt from 'bcrypt';

export async function Register(req, res) {
    const { username, password } = req.body;
    try {
        const newUser = new User({
            username,
            password,
        });
        const existingUser = await User.findOne({ username });
        if (existingUser)
            return res.status(400).json({
                status: 'failed',
                data: [],
                message: 'It seems you already have an account, please try loggin in.',
        });
        const savedUser = await newUser.save();
        const { role, ...userData } = savedUser._doc;
        res.status(200).json({
            status: 'success',
            data: [userData],
            message: 
                'Your account has been successfully created!',
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            code: 500,
            data: [],
            message: 'Internal Server Error',
        });
    }
    res.end();
}

export async function Login(req, res) {
    const { username } = req.body;
    try {
        const user = await User.findOne({ username }).select('+password');
        if (!user)
            return res.status(401).json({
                status: 'failed',
                data: [],
                message: 'Invalid username or password. Please try again.',
            });
        const isPasswordValid = bcrypt.compare(
            `${req.body.password}`,
            user.password
        );
        if (!isPasswordValid)
            return res.status(401).json({
                status: 'failed',
                data: [],
                message: 'Invalid username or password. Please try again.',
            })
        const {password, ...userData } = user._doc;

        res.status(200).json({
            status: 'success',
            data: [userData],
            message: 'You have successfully logged in.',
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            code: 500,
            data: [],
            message: 'Internal Server Error',
        });
    }
    res.end();
}