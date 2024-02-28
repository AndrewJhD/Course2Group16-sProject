import express from 'express';
import { Register } from '../controllers/auth.js';
import { Login } from '../controllers/auth.js';
import { Logout } from '../controllers/auth.js';
import { Verify } from '../middleware/verify.js';
import Validate from '../middleware/validate.js';
import { check } from 'express-validator';

const router = express.Router();

router.post(
    '/register',
    check('username')
        .notEmpty()
        .withMessage('Enter a valid username'),
    check('password')
        .not()
        .isEmpty()
        .isLength({ min: 8 })
        .withMessage('Your password must be at least 8 characters'),
    Validate,
    Register
);

router.post(
    '/login',
    check('username')
        .notEmpty()
        .withMessage('Please enter a valid username.'),
    check('password')
        .not()
        .isEmpty(),
    Validate,
    Login
);

router.get('/user', Verify);

router.get('/logout', Logout);

export default router;