const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate'); // Middleware de autenticação
const db = require('../db'); // Importa a conexão com o banco
const { User } = require('../models'); // Importando o modelo User

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de usuários
 */

/**
 * @swagger
 * /user-info:
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
 *                   id:
 *                     type: integer
 *                     description: ID do usuário.
 *                   username:
 *                     type: string
 *                     description: Nome de usuário.
 *                   inativo:
 *                     type: integer
 *                     description: Indica se o usuário está inativo (1) ou ativo (0).
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: Data de criação do usuário.
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: Data de última atualização do usuário.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       500:
 *         description: Erro no servidor.
 */

router.get('/user-info', authenticate, async (req, res) => {
  try {
    const userId = req.user.id; // O middleware 'authenticate' deve inserir o ID do usuário autenticado em `req.user`

    // Busca as informações do usuário no banco de dados
    const user = await User.findOne({
      where: { id: userId },
      attributes: ['id', 'username', 'inativo', 'createdAt', 'updatedAt', 'role'] // Seleciona somente os campos necessários
    });
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Retorna as informações do usuário
    res.status(200).json(user);
    } catch (err) {
      console.error(err);
    res.status(500).json({ message: 'Erro ao buscar informações do usuário.' });
  }
});

module.exports = router;
