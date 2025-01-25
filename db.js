require('dotenv').config();
const { Pool } = require('pg');

const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  host: isProduction ? process.env.DB_PROD_HOST : process.env.DB_LOCAL_HOST,
  port: isProduction ? process.env.DB_PROD_PORT : process.env.DB_LOCAL_PORT,
  database: isProduction ? process.env.DB_PROD_NAME : process.env.DB_LOCAL_NAME,
  user: isProduction ? process.env.DB_PROD_USER : process.env.DB_LOCAL_USER,
  password: isProduction ? process.env.DB_PROD_PASSWORD : process.env.DB_LOCAL_PASSWORD,
  ssl: isProduction ? { rejectUnauthorized: false } : false, // Adicione isso para evitar problemas com SSL no Railway
});

pool.connect()
  .then(() => console.log('Conectado ao PostgreSQL!'))
  .catch((err) => console.error('Erro ao conectar ao PostgreSQL', err.stack));

module.exports = pool;
