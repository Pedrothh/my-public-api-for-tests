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
 * /users:
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
 * /user:
 *   delete:
 *     summary: Inativar a conta do usuário
 *     description: Realiza a deleção lógica da conta do usuário autenticado, marcando a coluna "deletado" como 1.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         schema:
 *           type: string
 *           description: Token JWT do usuário autenticado
 *     responses:
 *       200:
 *         description: Conta inativada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Conta inativada.
 *       400:
 *         description: Solicitação inválida
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao inativar usuário
 *       404:
 *         description: Usuário não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erro ao inativar usuário
 */

router.delete('/user', authenticate, async (req, res) => {
  const userId = req.user.id; // Supondo que o middleware de autenticação decodifique o ID do usuário no token

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualizando a coluna "deletado" para 1 (deleção lógica)
    await user.update({ 
      deletado: 1,
      updatedAt: new Date() // Atualiza a data de modificação
    });
    res.status(200).json({ message: 'Conta inativada.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao inativar usuário' });
  }
});

  
  

module.exports = router;
