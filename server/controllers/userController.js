const { EmptyResultError, MissingParameterError } = require('../errors');
const db = require('../db');

exports.getUsers = async (req, res, next) => {
    try {
        const results = await db.query('SELECT id, email, password, settings FROM users');

        if (results.rows.length === 0) {
            const error = new EmptyResultError('No users found');
            return next(error);
        }

        const transformedResults = results.rows.map(row => ({
            id: row.id,
            email: row.email,
            password: row.password,
            settings: row.settings,
        }));
        res.status(200).json({
            status: 'success',
            results: transformedResults.length,
            data: {
                users: transformedResults
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
        if (!req.params.userID) {
            const error = new MissingParameterError('User ID is required');
            return next(error);
        }

        const result = await db.query('DELETE FROM users WHERE id = $1', [req.params.userID]);

        res.status(204).json({ message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};

exports.getUserSettings = async (req, res, next) => {
    try {
        if (!req.params.userID) {
            const error = new MissingParameterError('User ID is required');
            return next(error);
        }

        const results = await db.query('SELECT settings FROM users WHERE id = $1', [req.params.userID]);

        if (results.rows.length === 0) {
            const error = new EmptyResultError('No settings found');
            return next(error);
        }

        res.status(200).json({
            status: 'success',
            data: {
                settings: results.rows[0].settings
            }
        });
    } catch (error) {
        next(error);
    }
};

exports.updateSettings = async (req, res, next) => {
    try {

        if (!req.body.settings) {
            const error = new MissingParameterError('User ID and settings are required');
            return next(error);
        }

        const result = await db.query('UPDATE users SET settings = $1 WHERE id = $2', [req.body.settings, req.params.userID]);

        
        res.status(200).json({ message: 'Settings updated' });
    } catch (error) {
        next(error);
    }
};