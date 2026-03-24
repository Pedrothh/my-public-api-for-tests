const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/jwtSecret');

const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret());
    req.user = decoded; // Adiciona o payload do token ao req.user
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

module.exports = authenticate;
