const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');

// Get all performance history for a user
router.get('/user/:userId', performanceController.getPerformanceHistory);

// Get performance for a specific exercise
router.get('/:userId/:exerciseName', performanceController.getExercisePerformance);

// Update or create performance record
router.post('/', performanceController.updatePerformance);

// Save completed workout
router.post('/workout', performanceController.saveWorkout);

// Get last workout session for a specific plan
router.get('/last-session/:userId/:planId', performanceController.getLastSession);

module.exports = router;
