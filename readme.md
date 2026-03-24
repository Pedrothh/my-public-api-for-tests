# API para Testes Automatizados

Este projeto é uma API desenvolvida para ser consumida pelos seus testes automatizados. Ela permite a criação, autenticação, consulta e atualização de dados de usuários. Agora a API roda sem banco de dados, usando armazenamento em memória.

## Tecnologias Utilizadas

- **Node.js**: Plataforma para desenvolvimento do backend.
- **Express**: Framework para a construção de APIs.
- **JWT (Json Web Token)**: Gerenciamento de autenticação e controle de acesso.
- **Dotenv**: Gerenciamento de variáveis de ambiente.
- **Armazenamento em memória**: Dados mantidos enquanto a API está em execução.
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
  JWT_SECRET="<seu_segredo_jwt>"
  DEFAULT_ADMIN_USERNAME=admin
  DEFAULT_ADMIN_PASSWORD=admin1234
  ```

4. Inicie o servidor:
   ```bash
   npm start
   ```
  
## Implementações até o Momento:

-  Login gerando token JWT
-  Endpoints protegidos por autenticação (Token JWT)
-  Endpoints protegidos por roles de acesso (admin/moderador/usuarios)
-  API sem dependência de banco de dados externo
-  Controle de usuários ativos e inativos, com bloqueio de login para usuários inativos
-  Controle de modificações em usuários (updatedAt)


## Contribuição

Sinta-se à vontade para abrir issues ou pull requests para melhorar este projeto.

