const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Register a new user
router.post('/register', authLimiter, userController.registerUser);

// Login user
router.post('/login', authLimiter, userController.loginUser);

// Get user by ID (protected)
router.get('/:id', protect, userController.getUser);

// Update user profile (protected)
router.put('/:id', protect, userController.updateUser);

module.exports = router;
