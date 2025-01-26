require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';
const connectionString = isProduction 
  ? process.env.DATABASE_URL 
  : process.env.DATABASE_URL_DEV;

const pool = new Pool({
    connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false, // Adicione isso para evitar problemas com SSL no Railway
});

pool.connect()
  .then(() => {
    isProduction 
    ? console.log('Conectado ao PostgreSQL Produção!')
    : console.log('Conectado ao PostgreSQL Desenvolvimento!')
  })
  .catch((err) => console.error('Erro ao conectar ao PostgreSQL', err.stack));

module.exports = pool;
