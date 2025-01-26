# API para Testes Automatizados

Este projeto é uma API desenvolvida para ser consumida pelos seus testes automatizados. Ela permite a criação, autenticação, consulta e atualização de dados de usuários. A API utiliza tecnologias modernas e está integrada ao banco de dados PostgreSQL hospedado no Railway.

## Tecnologias Utilizadas

- **Node.js**: Plataforma para desenvolvimento do backend.
- **Express**: Framework para a construção de APIs.
- **JWT (Json Web Token)**: Gerenciamento de autenticação e controle de acesso.
- **Dotenv**: Gerenciamento de variáveis de ambiente.
- **PostgreSQL**: Banco de dados relacional.
- **Railway**: Hospedagem da API e banco de dados.
- **Swagger**: Documentação da API com swagger

## Endpoints Disponíveis até o momento

### **1. Registrar Usuário**
- **URL**: `/api/register`
- **Método**: `POST`
- **Descrição**: Registra um novo usuário no banco de dados.
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Resposta**:
  ```json
  {
    "message": "Usuário registrado com sucesso",
    "id": 1,
    "username": "username"
  }
  ```

---

### **2. Login**
- **URL**: `/api/login`
- **Método**: `POST`
- **Descrição**: Faz login de um usuário e retorna o token de autenticação.
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Resposta**:
  ```json
  {
    "token": "seu_token_jwt"
  }
  ```

---

### **3. Informações do Usuário Autenticado**
- **URL**: `/api/user-info`
- **Método**: `GET`
- **Descrição**: Retorna os dados do usuário autenticado.
- **Cabeçalho**:
  ```
  Authorization: Bearer <seu_token_jwt>
  ```
- **Resposta**:
  ```json
  {
    "id": 1,
    "username": "username"
  }
  ```

---

### **4. Buscar Usuários**
- **URL**: `/api/users`
- **Método**: `GET`
- **Descrição**: Retorna todos os usuários ou um usuário específico com base no parâmetro `id`. Necessita autenticação.
- **Parâmetros de Query (opcional)**:
  - `id`: ID do usuário a ser buscado.
- **Cabeçalho**:
  ```
  Authorization: Bearer <seu_token_jwt>
  ```
- **Resposta** (todos os usuários):
  ```json
  [
    {
      "id": 1,
      "username": "username1"
    },
    {
      "id": 2,
      "username": "username2"
    }
  ]
  ```
- **Resposta** (usuário específico):
  ```json
  {
    "id": 1,
    "username": "username1"
  }
  ```

---

### **5. Atualizar Senha**
- **URL**: `/api/update-password`
- **Método**: `PUT`
- **Descrição**: Permite que o usuário autenticado atualize sua senha.
- **Cabeçalho**:
  ```
  Authorization: Bearer <seu_token_jwt>
  ```
- **Body**:
  ```json
  {
    "currentPassword": "string",
    "newPassword": "string"
  }
  ```
- **Resposta**:
  ```json
  {
    "message": "Senha atualizada com sucesso."
  }
  ```

## Configuração do Projeto

1. Clone o repositório:
   ```bash
   git clone <url-do-repositorio>
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` com as seguintes variáveis de ambiente:
   ```env
   DATABASE_URL="postgres://<user>:<password>@<host>:<port>/<database>"
   JWT_SECRET="<seu_segredo_jwt>"
   NODE_ENV="production"
   ```

4. Inicie o servidor:
   ```bash
   npm start
   ```

## Deploy no Railway

Esta API está hospedada no Railway, com integração ao banco de dados PostgreSQL para facilitar o desenvolvimento e os testes automatizados.

## Contribuição

Sinta-se à vontade para abrir issues ou pull requests para melhorar este projeto.

