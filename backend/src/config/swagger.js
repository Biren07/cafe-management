import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { envConfig } from './env.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cafe Management System API',
      version: '1.0.0',
      description: 'Production-ready REST API documentation for Cafe Management System',
      contact: {
        name: 'Backend Support',
        email: 'support@cafemanagement.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${envConfig.port}/api/v1`,
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/docs/**/*.js', './src/routes/**/*.js', './src/models/**/*.js'],
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
