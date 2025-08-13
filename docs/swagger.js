const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'E-Commerce API',
    version: '1.0.0',
    description: 'API documentation for E-Commerce project',
  },
  servers: [
    {
      url: `http://localhost:${process.env.PORT || 8000}/api/v1`,
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: { 
        type: 'http', 
        scheme: 'bearer', 
        bearerFormat: 'JWT' 
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'], // Path to your route files with swagger comments
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
