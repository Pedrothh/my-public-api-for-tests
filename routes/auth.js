const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db'); // Importa a conexão com o banco
const authenticate = require('../middleware/authenticate'); // Caminho para o middleware
const { User } = require('../models'); // Importando o modelo User
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
 * /register:
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
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return res.status(400).json({ message: `Usuário '${username}' já existe.` });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no banco com o modelo User
    const newUser = await User.create({
      username,
      password: hashedPassword,
      inativo: 0, // Usuário não inativo ao ser criado
    });

    // Retorna o usuário criado
    res.status(201).json({
      message: 'Usuário registrado com sucesso.',
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

/**
 * @swagger
 * /login:
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

  
/**
 * @swagger
 * /update-password:
 *   put:
 *     summary: Atualiza a senha do usuário autenticado.
 *     tags: [Auth]
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
 *       201:
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

    // Busca o usuário no banco de dados usando o Sequelize
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    // Verifica se a senha atual está correta
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'A senha atual está incorreta.' });
    }

    // Hash da nova senha
    const newHashedPassword = await bcrypt.hash(newPassword, 10);

    // Atualiza a senha no banco de dados
    user.password = newHashedPassword;
    await user.save(); // Atualiza a instância no banco de dados

    res.status(201).json({ message: 'Senha atualizada com sucesso.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao atualizar a senha.' });
  }
});

module.exports = router;
