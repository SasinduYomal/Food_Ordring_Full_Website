const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Auth middleware - Token received:', token ? `${token.substring(0, 20)}...` : 'null');

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Auth middleware - Decoded token:', decoded);

      req.user = await User.findById(decoded.id).select('-password');
      console.log('Auth middleware - User found:', req.user ? req.user._id : 'null');
      
      if (!req.user) {
        console.log('Auth middleware - User not found in database');
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      
      if (!req.user.isActive) {
        console.log('Auth middleware - User account is deactivated');
        return res.status(401).json({ message: 'Not authorized, account deactivated' });
      }

      next();
    } catch (error) {
      console.error('Auth middleware - Error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('Auth middleware - No valid Bearer token provided');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin };