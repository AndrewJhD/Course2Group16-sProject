import { SECRET_ACCESS_TOKEN } from '../config/index.js';
import User from '../models/user.js';
import jwt from 'jsonwebtoken';
import Blacklist from '../models/Blacklist.js';

export async function Verify(req, res, next) {
    const authHeader = req.headers['cookie'];

    if (!authHeader) return res.sendStatus(401);
    const cookie = authHeader.split('=')[1];
    const accessToken = cookie.split(';')[0];
    const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken });
    if (checkIfBlacklisted)
        return res
            .status(401)
            .json({ message: 'This session has expired. Please login' });

    jwt.verify(accessToken, SECRET_ACCESS_TOKEN, async (err, decoded) => {
        if (err) {
            return res
                .status(401)
                .json({ message: 'This session has expired. Please loign' });
        }

        const { id } = decoded;
        const user = await User.findById(id);
        const { password, ...data } = user._doc;
        req.user = data;
        next();
    });
}