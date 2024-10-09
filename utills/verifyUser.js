const JWT = require('jsonwebtoken');
const { errorHandler } = require('../utills/error');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  
  
  // Check if Authorization header is present and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(errorHandler(401, 'Unauthorized'));
  }
  const token = authHeader.split(' ')[1]; 
  JWT.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification error:", err.message);
      return next(errorHandler(403, 'Forbidden'));
    }
    req.user = user;
    next();
  });
};

module.exports = { verifyToken };
