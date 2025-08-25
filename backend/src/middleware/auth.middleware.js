const jwt = require('jsonwebtoken');
const SECRET_KEY = 'secret_password';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Acceso denegado' });

  const token = authHeader.split(' ')[1]; 

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};