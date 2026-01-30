const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  console.log('🔐 Auth middleware check for:', req.method, req.path);
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
      console.log('🔐 Token found, length:', token.length);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production');
      console.log('🔐 Token verified for user ID:', decoded.id);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.log('🔐 User not found in database for ID:', decoded.id);
        return res.status(401).json({ message: 'User not found' });
      }

      console.log('🔐 Auth successful for user:', req.user.email);
      next();
    } catch (error) {
      console.error('🔐 Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('🔐 No authorization header found');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };
