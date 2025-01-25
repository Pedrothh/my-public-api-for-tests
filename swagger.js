const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Minha API',
      version: '1.0.0',
      description: 'API com autenticação JWT e Swagger',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Servidor local' },
      { url: 'https://my-public-api-for-tests-production.up.railway.app', description: 'Servidor na Railway (Produção)' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Formato do token
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Aplica autenticação global
      },
    ],
  },
  apis: ['./routes/*.js'], // Inclui comentários de arquivos na pasta routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerUi,
  swaggerDocs,
};
