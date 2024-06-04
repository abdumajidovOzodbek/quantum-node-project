const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
const authHeader=req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  try {
    const decoded = jwt.verify(token, 'your_secret_key');
    console.log(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
