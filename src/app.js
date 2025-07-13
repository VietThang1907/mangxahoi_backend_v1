const express = require('express');
const cors = require('cors');

//import routes
const authRoutes = require ('./routes/authRoutes');

//khoi tao app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//su dung routes
app.use('/api/auth', authRoutes);

module.exports = app;
