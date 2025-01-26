const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate'); // Caminho para o middleware
const db = require('../db'); // Importa a conexão com o banco
const bcrypt = require('bcrypt');


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de usuários
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Retorna usuários.
 *     tags: [Users]
 *     description: Retorna todos os usuários ou um usuário específico com base no parâmetro `id`. É necessário estar autenticado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: O ID do usuário a ser buscado.
 *     responses:
 *       200:
 *         description: Usuários retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID do usuário.
 *                   username:
 *                     type: string
 *                     description: Nome de usuário.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro no servidor.
 */

router.get('/users', authenticate, async (req, res) => {
    try {
      const { id } = req.query; // Pega o parâmetro "id" (opcional) da query string
      if (id && isNaN(parseInt(id))) {
        return res.status(400).json({ message: 'O ID deve ser um número válido.' });
      }
      
      if (id) {
        // Busca um usuário específico pelo ID
        const user = await db.query('SELECT id, username FROM users WHERE id = $1', [id]);
  
        if (user.rows.length === 0) {
          return res.status(404).json({ message: 'Usuário não encontrado.' });
        }
  
        return res.status(200).json(user.rows[0]);
      }
  
      // Busca todos os usuários
      const users = await db.query('SELECT id, username FROM users');
      res.status(200).json(users.rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }
  });

  
/**
 * @swagger
 * /api/update-password:
 *   put:
 *     summary: Atualiza a senha do usuário autenticado.
 *     description: Permite que o usuário autenticado atualize sua própria senha.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 description: Senha atual do usuário.
 *                 example: "senhaAntiga123"
 *               newPassword:
 *                 type: string
 *                 description: Nova senha desejada.
 *                 example: "novaSenha456"
 *     responses:
 *       200:
 *         description: Senha atualizada com sucesso.
 *       400:
 *         description: Erro na validação ou senha incorreta.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       500:
 *         description: Erro no servidor.
 */

router.put('/update-password', authenticate, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // ID do usuário autenticado extraído do token pelo middleware
  
    try {
      // Validações básicas
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ message: 'A senha atual e a nova senha são obrigatórias.' });
      }
  
      if (typeof newPassword !== 'string' || newPassword.length < 4) {
        return res.status(400).json({ message: 'A nova senha deve ser uma string com pelo menos 4 caracteres.' });
      }
  
      // Busca o usuário no banco de dados
      const user = await db.query('SELECT password FROM users WHERE id = $1', [userId]);
  
      if (user.rows.length === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
  
      const hashedPassword = user.rows[0].password;
  
      // Verifica se a senha atual está correta
      const isMatch = await bcrypt.compare(currentPassword, hashedPassword);
      if (!isMatch) {
        return res.status(400).json({ message: 'A senha atual está incorreta.' });
      }
  
      // Hash da nova senha
      const newHashedPassword = await bcrypt.hash(newPassword, 10);
  
      // Atualiza a senha no banco de dados
      await db.query('UPDATE users SET password = $1 WHERE id = $2', [newHashedPassword, userId]);
  
      res.status(200).json({ message: 'Senha atualizada com sucesso.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Erro ao atualizar a senha.' });
    }
  });

module.exports = router;
