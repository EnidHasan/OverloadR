const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const planController = require('../controllers/planController');
const { protect } = require('../middleware/auth');

const planLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

router.use(planLimiter);

// Logging middleware for debugging
router.use((req, res, next) => {
  console.log(`📍 Plan route hit: ${req.method} ${req.path}`);
  next();
});

// Get a single plan by ID
router.get('/:id', planController.getPlanById);

// Get all plans for a user
router.get('/user/:userId', planController.getPlans);

// Create a new plan
router.post('/', planController.createPlan);

// Update a plan
router.put('/:id', planController.updatePlan);

// Delete a plan
router.delete('/:id', planController.deletePlan);

module.exports = router;
