const DEFAULT_DEV_SECRET = 'dev-only-secret-change-me';
let warningShown = false;

const getJwtSecret = () => {
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) {
    return process.env.JWT_SECRET;
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET não configurado em produção.');
  }

  if (!warningShown) {
    console.warn('JWT_SECRET não definido. Usando segredo padrão de desenvolvimento.');
    warningShown = true;
  }

  return DEFAULT_DEV_SECRET;
};

module.exports = { getJwtSecret };
