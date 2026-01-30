const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Register a new user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Get user by ID (protected)
router.get('/:id', protect, userController.getUser);

// Update user profile (protected)
router.put('/:id', protect, userController.updateUser);

module.exports = router;
