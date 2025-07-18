const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mạng xã hội API',
            version: '1.0.0',
            description: 'Tài liệu API cho ứng dụng mạng xã hội (Game, Học thuật, Âm nhạc)',
        },
        servers: 
        [
            {
                url: 'http://localhost:3000',
                description: 'Máy chủ phát triển'
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                }
            }
        },
        security: [{
            bearerAuth: []
        }]
    },
    apis: [path.join(__dirname, '../routes/*.js')],
};

const specs = swaggerJsdoc(options);

module.exports = specs;