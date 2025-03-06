const { ValidationError, ExistingUserError } = require('../errors');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');

const secretKey = crypto.randomBytes(32).toString('hex');

exports.loginCheck = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const result = await db.query('SELECT id, email, password, settings FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            const error = new ValidationError('Invalid email or password');
            return next(error);
        }
        
        const passwordMatch = (password.trim() === user.password.trim());

        if (!passwordMatch) {
            const error = new ValidationError('Invalid email or password');
            return next(error);
        }

        const token = jwt.sign({ id: user.id, email: user.email, settings: user.settings }, secretKey, { expiresIn: '1d' });

        res.status(200).json({ token });
    } catch (err) {
        next(err);
    }
};

exports.registerUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            const error = new ExistingUserError('Email already registered');
            return next(error);
        }

        const newUser = await db.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email, settings', [email, password]);

        const user = newUser.rows[0];

        const token = jwt.sign({ id: user.id, email: user.email, settings: user.settings }, secretKey, { expiresIn: '1d' });

        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};

exports.updatePassword = async (req, res, next) => {
    try {
        const { id, newPassword, confirmNewPassword } = req.body;

        const existingPassword = await db.query('SELECT id FROM users WHERE password = $1', [newPassword]);
        
        if (existingPassword.rows.length > 0) {
            const error = new ExistingUserError('This password is already in use');
            return next(error);
        }

        if (newPassword !== confirmNewPassword) {
            const error = new ValidationError('Passwords do not match');
            return next(error);
        }

        await db.query('UPDATE users SET password = $1 WHERE id = $2', [newPassword, id]);

        res.status(201).json({ message: 'Password updated successfully' });

    } catch (error) {
        next(error);
    }
};

exports.updateEmail = async (req, res, next) => {
    try {
        const { id, newEmail, confirmNewEmail } = req.body;

        const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [newEmail]);
        
        if (existingUser.rows.length > 0) {
            const error = new ExistingUserError('Email already registered to current account');
            return next(error);
        }

        if (newEmail !== confirmNewEmail) {
            const error = new ValidationError('Emails do not match');
            return next(error);
        }

        await db.query('UPDATE users SET email = $1 WHERE id = $2', [newEmail, id]);

        res.status(201).json({ message: 'Email updated successfully' });

    } catch (error) {
        next(error);
    }
};