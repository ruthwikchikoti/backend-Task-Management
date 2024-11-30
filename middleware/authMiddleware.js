const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized. Token missing.' });
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ success: false, message: 'Unauthorized. Invalid token.' });
    }
    req.user = user;
    next();
  });
};

module.exports = authMiddleware;
