const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ISBM School Management System API',
      version: '1.0.0',
      description: 'API documentation for the School Management System',
      contact: {
        name: 'Admin',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    path.join(__dirname, '../routes/*.js'), 
    path.join(__dirname, '../models/*.js')
  ], // Path to the API docs
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
