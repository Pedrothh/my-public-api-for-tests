# API para Testes Automatizados

Este projeto é uma API desenvolvida para ser consumida pelos seus testes automatizados. Ela permite a criação, autenticação, consulta e atualização de dados de usuários. A API utiliza tecnologias modernas e está integrada ao banco de dados PostgreSQL hospedado no Railway.

## Tecnologias Utilizadas

- **Node.js**: Plataforma para desenvolvimento do backend.
- **Express**: Framework para a construção de APIs.
- **JWT (Json Web Token)**: Gerenciamento de autenticação e controle de acesso.
- **Dotenv**: Gerenciamento de variáveis de ambiente.
- **PostgreSQL**: Banco de dados relacional.
- **Railway**: Hospedagem da API e banco de dados.
- **Swagger**: Documentação da API com swagger.


## Configuração do Projeto

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```

2. Instale as dependências:
  Versão do node utilizada: 18.16.1
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` com as seguintes variáveis de ambiente:
  ```env
  #NODE_ENV=development
  NODE_ENV=production

  DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
  DATABASE_URL_DEV=postgres://<user>:<password>@<host>:<port>/<database>

  JWT_SECRET="<seu_segredo_jwt>"

  DB_PROD_USER=<user>
  DB_PROD_PASSWORD=<password>
  DB_PROD_NAME=<database>
  DB_PROD_HOST=<host>
  DB_PROD_PORT=<port>

  DB_DEV_USER=<user>
  DB_DEV_PASSWORD=<password>
  DB_DEV_NAME=<database>
  DB_DEV_HOST=<host>
  DB_DEV_PORT=<port>
  ```

4. Inicie o servidor:
   ```bash
   npm start
   ```
  
5. Execute as migrations no banco:
   ```bash
   npx sequelize-cli db:migrate
   ```
  

## Implementações até o Momento:

Login gerando token JWT
Endpoints protegidos por autenticação (Token JWT)
Mudanças no banco de dados através de Migrations com sequelize
Endpoints protegidos por roles de acesso (admin/moderador/usuarios)
Integração com postgres
Separação de ambientes de Produção no Railway e Desenvolvimento (localhost)
Controle de usuários ativos e inativos, com bloqueio de login para usuários inativos
Controle de modificações em usuários (updatedAt)
Bonus: Swagger dark mode :D


## Deploy no Railway

Esta API está hospedada no Railway, com integração ao banco de dados PostgreSQL para facilitar o desenvolvimento e os testes automatizados.


## Contribuição

Sinta-se à vontade para abrir issues ou pull requests para melhorar este projeto.

