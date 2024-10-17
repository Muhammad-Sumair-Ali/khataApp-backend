const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
  
  if (!token) return res.sendStatus(401); // If no token, send 401 Unauthorized

  jwt.verify(token, 'your_jwt_secret_key', (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token, send 403 Forbidden
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
