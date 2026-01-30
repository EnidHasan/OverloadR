const Plan = require('../models/Plan');

// Get all plans for a user
exports.getPlans = async (req, res) => {
  try {
    console.log('📋 Fetching plans for user:', req.params.userId);
    const plans = await Plan.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    console.log('✅ Found plans:', plans.length);
    res.json(plans);
  } catch (err) {
    console.error('❌ Error fetching plans:', err.message);
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
  console.log('📝 Create plan request received');
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  const plan = new Plan(req.body);
  try {
    console.log('💾 Attempting to save plan...');
    const savedPlan = await plan.save();
    console.log('✅ Plan saved successfully:', savedPlan._id);
    res.status(201).json(savedPlan);
  } catch (err) {
    console.error('❌ Error saving plan:', err.message);
    console.error('Error details:', err);
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
    console.log('🗑️  ==== DELETE PLAN REQUEST RECEIVED ====')
    console.log('🗑️  Plan ID from params:', req.params.id)
    console.log('🗑️  Request method:', req.method)
    console.log('🗑️  Request path:', req.path)
    console.log('🗑️  Request URL:', req.originalUrl)
    
    const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
    
    if (!deletedPlan) {
      console.log('❌ Plan not found for ID:', req.params.id);
      return res.status(404).json({ message: 'Plan not found' });
    }
    
    console.log('✅ Plan deleted successfully:', req.params.id);
    console.log('✅ Deleted plan name:', deletedPlan.name);
    res.json({ message: 'Plan deleted successfully', deletedPlan });
  } catch (err) {
    console.error('❌ Error deleting plan:', err.message);
    res.status(500).json({ message: err.message });
  }
};
