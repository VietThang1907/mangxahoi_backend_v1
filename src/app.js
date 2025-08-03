const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpecs = require('./config/swagger');
const path = require('path');

//import routes
const authRoutes = require ('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const searchRoutes = require('./routes/searchRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

//khoi tao app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Phục vụ file tĩnh từ thư mục 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

//su dung routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);

//swagger ui routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

module.exports = app;
