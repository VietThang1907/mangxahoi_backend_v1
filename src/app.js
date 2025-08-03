const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');

//import routes
const authRoutes = require ('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const searchRoutes = require('./routes/searchRoutes');

//khoi tao app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

//su dung routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/search', searchRoutes);

//swagger ui routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

module.exports = app;
