const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Endpoint para login
 *     tags:
 *       - Authentication
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
 *         description: Login Successfully, returns the JWT token
 *       400:
 *         description: Malformed request or invalid data
 *       401:
 *         description: Incorrect credentials
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Exemplo simples de validação (não use assim em produção, isso é só para demonstração!)
  if (username === 'admin' && password === '1234') {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return res.status(200).json({ token });
  }

  return res.status(401).json({ message: 'Credenciais incorretas' });
});

module.exports = router;
