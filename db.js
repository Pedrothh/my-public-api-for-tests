require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
    connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false, // Adicione isso para evitar problemas com SSL no Railway
});

pool.connect()
  .then(() => console.log('Conectado ao PostgreSQL!'))
  .catch((err) => console.error('Erro ao conectar ao PostgreSQL', err.stack));

module.exports = pool;
