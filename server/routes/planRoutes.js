const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');

// Get all plans for a user
router.get('/user/:userId', planController.getPlans);

// Get a single plan by ID
router.get('/:id', planController.getPlanById);

// Create a new plan
router.post('/', planController.createPlan);

// Update a plan
router.put('/:id', planController.updatePlan);

// Delete a plan
router.delete('/:id', planController.deletePlan);

module.exports = router;
