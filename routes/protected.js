const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authenticate'); // Caminho para o middleware

/**
 * @swagger
 * /api/protected:
 *   get:
 *     summary: Rota protegida com JWT
 *     tags:
 *       - Protected Route With JWT
 *     security:
 *       - bearerAuth: [] # Requer autenticação
 *     responses:
 *       200:
 *         description: Acesso autorizado
 *       401:
 *         description: Token inválido ou ausente
 */
router.get('/protected', authenticate, (req, res) => {
  res.json({ message: 'Você acessou uma rota protegida!' });
});

module.exports = router;
