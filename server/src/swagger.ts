import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Event Planning API', version: '1.0.0', description: 'Use **Authorize** to set your JWT (from login/signup).' },
    servers: [{ url: 'http://localhost:4000' }],
    components: {
      securitySchemes: {
        bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: [path.join(__dirname, 'swagger-docs.ts')],
};

const spec = swaggerJsdoc(options);

export const swaggerUiHandler = swaggerUi.serve;
export const swaggerSetup = swaggerUi.setup(spec);
