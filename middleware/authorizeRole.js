module.exports = (requiredRole) => {
    return (req, res, next) => {
      try {
        // Verifica se o usuário está autenticado e se a role está presente
        if (!req.user || req.user.role === undefined) {
          return res.status(401).json({ message: 'Usuário não autenticado.' });
        }
  
        // Verifica se o usuário tem a role necessária
        if (req.user.role > requiredRole) {
          return res.status(403).json({ message: 'Acesso negado. Permissão insuficiente.' });
        }
  
        next(); // Passa para o próximo middleware ou rota
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erro no servidor.' });
      }
    };
  };
  