const Plan = require('../models/Plan');

// Get all plans for a user
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a single plan by ID
exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new plan
exports.createPlan = async (req, res) => {
  const plan = new Plan(req.body);
  try {
    const savedPlan = await plan.save();
    res.status(201).json(savedPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a plan
exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: 'Plan not found' });

    if (req.body.name) plan.name = req.body.name;
    if (req.body.exercises) plan.exercises = req.body.exercises;
    plan.updatedAt = new Date();

    const updatedPlan = await plan.save();
    res.json(updatedPlan);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a plan
exports.deletePlan = async (req, res) => {
  try {
    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
