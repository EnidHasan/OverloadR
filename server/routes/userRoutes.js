const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post('/register', userController.registerUser);

// Login user
router.post('/login', userController.loginUser);

// Get user by ID
router.get('/:id', userController.getUser);

// Update user profile
router.put('/:id', userController.updateUser);

module.exports = router;
