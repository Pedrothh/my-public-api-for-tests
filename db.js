const { Client } = require('pg');

// Conexão com o PostgreSQL usando as variáveis de ambiente
const client = new Client({
  connectionString: process.env.DATABASE_URL, // Usando a URL de conexão do Railway
  ssl: {
    rejectUnauthorized: false, // Necessário para conexões seguras
  },
});

client.connect()
  .then(() => console.log('Conectado ao PostgreSQL!'))
  .catch((err) => console.error('Erro ao conectar ao PostgreSQL', err.stack));

module.exports = client;
