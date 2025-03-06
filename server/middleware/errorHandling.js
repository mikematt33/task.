const { ValidationError, ExistingUserError, EmptyResultError, MissingParameterError } = require('../errors');

const errorHandler = (err, req, res, next) => {
    if (err instanceof ValidationError || err instanceof ExistingUserError || err instanceof MissingParameterError) {
        return res.status(err.statusCode || 400).json({ error: err.message });
    }
    if (err instanceof EmptyResultError) {
        return res.status(err.statusCode || 404).json({ status: 'error', message: err.message });
    }
    
    console.error(err.message);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
};

module.exports = errorHandler;