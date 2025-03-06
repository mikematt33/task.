// Import necessary modules
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const tagRoutes = require('./routes/tagRoutes');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandling');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Route Handlers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/tags', tagRoutes);
app.use('/api/v1/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

module.exports = app;