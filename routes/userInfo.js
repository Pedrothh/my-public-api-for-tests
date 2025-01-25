const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate'); // Middleware de autenticação
const db = require('../db'); // Importa a conexão com o banco

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de usuários
 */

/**
 * @swagger
 * /api/user-info:
 *   get:
 *     summary: Retorna informações do usuário autenticado.
 *     tags: [Users]
 *     description: Retorna os dados do usuário baseado no token de autenticação.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Informações do usuário retornadas com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID do usuário.
 *                 username:
 *                   type: string
 *                   description: Nome de usuário.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       500:
 *         description: Erro no servidor.
 */

router.get('/user-info', authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // O middleware 'authenticate' deve inserir o ID do usuário autenticado em `req.user`

    // Busca as informações do usuário no banco de dados
    const user = await db.query('SELECT id, username FROM users WHERE id = $1', [userId]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json(user.rows[0]); // Retorna as informações do usuário
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar informações do usuário.' });
  }
});

module.exports = router;
