require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const { swaggerUi, swaggerDocs } = require('./swagger');
const protectedRoutes = require('./routes/protected');
const authRoutes = require('./routes/auth');  // Importando as rotas de autenticação

const app = express();

// Middleware
app.use(express.json());

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas de autenticação
app.use('/api', authRoutes);

// Rotas protegidas
app.use('/api', protectedRoutes);

// Rota de exemplo
app.get('/', (req, res) => {
  res.send('Bem-vindo à API!');
});

// Porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Documentação disponível em http://localhost:${PORT}/api-docs`);
});
