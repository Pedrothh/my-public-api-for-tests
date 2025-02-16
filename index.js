require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const cors = require('cors'); // Importa o pacote cors
const { swaggerUi, swaggerDocs } = require('./swagger');
const usersRoutes = require('./routes/users');
const usersInfoRoutes = require('./routes/userInfo');
const path = require('path');
const authRoutes = require('./routes/auth');  // Importando as rotas de autenticação

const app = express();

// Middleware
app.use(express.json());

// Configuração do CORS
app.use(cors({
  origin: '*', // Permite todas as origens (não recomendado para produção)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
}));

app.use('/swagger-dark.css', express.static(path.join(__dirname, 'swagger-dark.css')));

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs, {
  customCssUrl: '/swagger-dark.css',
}));

// Rotas de autenticação
app.use('/api', authRoutes);

// Rotas protegidas
app.use('/api', usersRoutes);

app.use('/api', usersInfoRoutes);

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