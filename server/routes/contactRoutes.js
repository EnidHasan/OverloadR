const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

// Public route - submit contact message
router.post('/', contactController.createContactMessage);

// Admin routes - require authentication
router.get('/', protect, contactController.getAllContactMessages);
router.put('/:id/read', protect, contactController.markAsRead);
router.delete('/:id', protect, contactController.deleteContactMessage);

module.exports = router;
