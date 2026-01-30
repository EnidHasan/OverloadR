const express = require('express');
const router = express.Router();
const workoutController = require('../controllers/workoutController');

// Get all workouts for a user
router.get('/:userId', workoutController.getWorkouts);

// Get workouts grouped by exercise name
router.get('/grouped/:userId', workoutController.getGroupedWorkouts);

// Get workout history for a specific exercise
router.get('/history/:userId/:exerciseName', workoutController.getExerciseHistory);

// Create a new workout
router.post('/', workoutController.createWorkout);

// Update a workout
router.put('/:id', workoutController.updateWorkout);

// Delete a workout
router.delete('/:id', workoutController.deleteWorkout);

module.exports = router;
