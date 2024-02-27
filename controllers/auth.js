import User from '../models/user.js';
import bcrypt from 'bcrypt';
import Blacklist from '../models/Blacklist.js';

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
        // Check if the user exists
        const user = await User.findOne({ username }).select('+password');
        if (!user)
            return res.status(401).json({
                status: 'failed',
                data: [],
                message: 'Account does not exist.',
            });
        // If user exists, validate password
        const isPasswordValid = await bcrypt.compare(
            `${req.body.password}`,
            user.password
        );
        // If not valid, return unauthorized response
        if (!isPasswordValid)
            return res.status(401).json({
                status: 'failed',
                data: [],
                message: 'Invalid username or password. Please try again.',
            })
        
        let options = {
            maxAge: 60 * 60 * 1000, // The token will expire after 60 minutes
            httpOnly: true,
            secure: true,
            sameSite: 'None',
        };
        const token = user.generateAccessJWT();
        res.cookie('SessionID', token, options);
        res.status(200).json({
            status: 'success',
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

export async function Logout(req, res) {
    try {
        const authHeader = req.headers['cookie'];
        if (!authHeader) return res.sendStatus(204);
        const cookie = authHeader.split('=')[1];
        const accessToken = cookie.split(';')[0];
        const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });
        if (checkIfBlacklisted) return res.sendStatus(204);
        const newBlacklist = new Blacklist({
            token: accessToken,
        });
        await newBlacklist.save();
        res.setHeader('Clear-Site-Data', '"cookies"');
        res.status(200).json({ message: 'You are logged out!'});
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
        });
    }
    res.end();
}