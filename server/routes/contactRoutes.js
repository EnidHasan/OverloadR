const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const contactController = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

const contactLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 50,
	message: { message: 'Too many requests, please try again later.' },
	standardHeaders: true,
	legacyHeaders: false,
});

router.use(contactLimiter);

// Public route - submit contact message
router.post('/', contactController.createContactMessage);

// Admin routes - require authentication
router.get('/', protect, contactController.getAllContactMessages);
router.put('/:id/read', protect, contactController.markAsRead);
router.delete('/:id', protect, contactController.deleteContactMessage);

module.exports = router;
