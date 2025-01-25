const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db'); // Importa a conexão com o banco

const router = express.Router();
const SECRET = process.env.JWT_SECRET; // Substitua por uma variável de ambiente em produção

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticação
 */

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Registrar um novo usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuário registrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     username:
 *                       type: string
 *       400:
 *         description: Usuário já existe
 *       500:
 *         description: Erro no servidor
 */

// Criar um novo usuário
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Validação do username
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return res.status(400).json({ message: 'O nome de usuário é obrigatório e deve ser uma string válida.' });
    }

    // Validação do password
    if (!password || typeof password !== 'string' || password.trim().length < 4) {
      return res.status(400).json({ 
        message: 'A senha é obrigatória, deve ser uma string e conter no mínimo 4 caracteres.' 
      });
    }

    // Verifica se o usuário já existe
    const userExists = await db.query('SELECT username FROM users WHERE username = $1', [username]);
    if (userExists.rows.length > 0) {
      const { username: existingUsername } = userExists.rows[0];
      return res.status(400).json({ message: `Usuário '${existingUsername}' já existe.` });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Salva o usuário no banco
    const newUser = await db.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING id, username',
      [username, hashedPassword]
    );

    // Retorna o usuário criado
    res.status(201).json({ 
      message: 'Usuário registrado com sucesso.', 
      user: { id: newUser.rows[0].id, username: newUser.rows[0].username } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login de usuário
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login bem-sucedido, retorna o token JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Credenciais incorretas
 *       500:
 *         description: Erro no servidor
 */

// Login de usuário
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Busca o usuário no banco
    const user = await db.query('SELECT * FROM users WHERE username = $1', [username]);
    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais incorretas' });
    }

    // Verifica a senha
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Credenciais incorretas' });
    }

    // Gera o token JWT
    const token = jwt.sign({ id: user.rows[0].id, username: user.rows[0].username }, SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

module.exports = router;
