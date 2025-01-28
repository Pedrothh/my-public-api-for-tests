const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate'); // Caminho para o middleware
const db = require('../db'); // Importa a conexão com o banco
const bcrypt = require('bcrypt');
const { User } = require('../models'); // Importando o modelo User


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Endpoints de usuários
 */

// Endpoint para buscar todos os usuários
/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retorna todos os usuários.
 *     tags: [Users]
 *     description: Retorna a lista de todos os usuários. É necessário estar autenticado.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuários retornada com sucesso.
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
 *                   inativo:
 *                     type: integer
 *                     description: Indica se o usuário está inativo (1) ou ativo (0).
 *       401:
 *         description: Token não fornecido ou inválido.
 *       500:
 *         description: Erro no servidor.
 */

router.get('/users', authenticate, async (req, res) => {
  try {
    // Busca todos os usuários, omitindo os inativos
    const users = await User.findAll({
      attributes: ['id', 'username', 'inativo'] // Seleciona somente os campos necessários
    });
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar usuários.' });
  }
});

// Endpoint para buscar um usuário específico pelo ID
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retorna um usuário específico.
 *     tags: [Users]
 *     description: Retorna os dados de um usuário específico com base no `id` fornecido. É necessário estar autenticado.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do usuário a ser buscado.
 *     responses:
 *       200:
 *         description: Usuário retornado com sucesso.
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
 *                 inativo:
 *                   type: integer
 *                   description: Indica se o usuário está inativo (1) ou ativo (0).
 *       401:
 *         description: Token não fornecido ou inválido.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro no servidor.
 */
router.get('/user/:id', authenticate, async (req, res) => {
  const { id } = req.params; // Pega o parâmetro "id" do path parameter

  try {
    // Validação de ID
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: 'O ID deve ser um número válido.' });
    }

    // Busca um usuário específico pelo ID, omitindo os inativos
    const user = await User.findOne({
      where: { id }, // Usuário ativo com o ID fornecido
      attributes: ['id', 'username', 'inativo'] // Seleciona somente os campos necessários
    });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar usuário.' });
  }
});


/**
 * @swagger
 * /inativar-user/{id}:
 *   delete:
 *     summary: Inativar a conta do usuário
 *     description: Realiza a inativação da conta de um usuário, marcando a coluna "inativo" como 1.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: O ID do usuário a ser buscado.
 *     responses:
 *       200:
 *         description: Conta inativada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Conta inativada com sucesso.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID do usuário.
 *                     username:
 *                       type: string
 *                       description: Nome de usuário.
 *                     inativo:
 *                       type: integer
 *                       description: Indica se o usuário está inativo (1) ou ativo (0).
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Data de criação do usuário.
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Data de última atualização do usuário.
 *       400:
 *         description: Solicitação inválida.
 *       404:
 *         description: Usuário não encontrado.
 *       500:
 *         description: Erro no servidor.
 */
router.delete('/inativar-user/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    // Valida se o ID é um número
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: 'O ID fornecido deve ser um número válido.' });
    }

    // Busca o usuário pelo ID
    const user = await User.findByPk(parsedId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (user.inativo === 1) {
      return res.status(400).json({ message: 'Usuário já está inativo.' })
    }

    // Atualiza a coluna "inativo"
    await user.update({ 
      inativo: 1,
      updatedAt: new Date() 
    });

    res.status(200).json({ 
      message: 'Conta inativada com sucesso.', 
      user: {
        id: user.id,
        username: user.username,
        inativo: user.inativo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao inativar usuário.' });
  }
});

 
/**
 * @swagger
 * /reativar-user/{id}:
 *   put:
 *     summary: Reativar a conta do usuário
 *     description: Realiza a inativação da conta de um usuário, marcando a coluna "inativo" como 0.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: O ID do usuário a ser buscado.
 *     responses:
 *       200:
 *         description: Conta reativada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Conta reativada com sucesso.
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: ID do usuário.
 *                     username:
 *                       type: string
 *                       description: Nome de usuário.
 *                     inativo:
 *                       type: integer
 *                       description: Indica se o usuário está ativo (0) ou inativo (1).
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Data de criação do usuário.
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Data da última atualização do usuário.
 *       400:
 *         description: Solicitação inválida
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro no servidor
 */

router.put('/reativar-user/:id', authenticate, async (req, res) => {
  const { id } = req.params; // Extrai o ID do usuário do path parameter
  const parsedId = parseInt(id, 10); // Converte para número inteiro, garantindo que seja válido

  if (isNaN(parsedId)) {
    return res.status(400).json({ message: 'ID inválido. Deve ser um número inteiro.' });
  }

  try {
    // Busca o usuário pelo ID
    const user = await User.findByPk(parsedId);
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    if (user.inativo === 0) {
      return res.status(400).json({ message: 'Usuário já está ativo.' });
    }

    // Atualizando a coluna "inativo" para 0 (reativação lógica)
    await user.update({ 
      inativo: 0,
      updatedAt: new Date() // Atualiza a data de modificação
    });

    res.status(200).json({
      message: 'Conta reativada com sucesso.',
      user: {
        id: user.id,
        username: user.username,
        inativo: user.inativo,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao reativar usuário.' });
  }
});

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Exclui um usuário pelo ID.
 *     description: Exclui um usuário da base de dados pelo ID. Apenas usuários autenticados podem realizar essa ação.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: O ID do usuário a ser excluído.
 *     responses:
 *       200:
 *         description: Usuário excluído com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Usuário excluído com sucesso.
 *       400:
 *         description: O ID fornecido é inválido.
 *       404:
 *         description: Usuário não encontrado.
 *       401:
 *         description: Token não fornecido ou inválido.
 *       500:
 *         description: Erro interno do servidor.
 */
router.delete('/user/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  try {
    // Busca o usuário pelo ID  
    const user = await User.findByPk(id); 

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Valida se o ID é um número
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      return res.status(400).json({ message: 'O ID fornecido deve ser um número válido.' });
    }

    // Exclui o usuário
    await user.destroy();

    res.status(204).json({ message: 'Usuário excluído com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
  });

module.exports = router;
