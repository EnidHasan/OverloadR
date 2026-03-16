const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const performanceController = require('../controllers/performanceController');

const performanceLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100,
	message: { message: 'Too many requests, please try again later.' },
	standardHeaders: true,
	legacyHeaders: false,
});

// Get all performance history for a user
router.get('/user/:userId', performanceLimiter, performanceController.getPerformanceHistory);

// Get performance for a specific exercise
router.get('/:userId/:exerciseName', performanceLimiter, performanceController.getExercisePerformance);

// Update or create performance record
router.post('/', performanceLimiter, performanceController.updatePerformance);

// Save completed workout
router.post('/workout', performanceLimiter, performanceController.saveWorkout);

// Get last workout session for a specific plan
router.get('/last-session/:userId/:planId', performanceLimiter, performanceController.getLastSession);

module.exports = router;
