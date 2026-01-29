const PerformanceHistory = require('../models/PerformanceHistory');

// Get performance history for a user
exports.getPerformanceHistory = async (req, res) => {
  try {
    const history = await PerformanceHistory.find({ userId: req.params.userId }).sort({ lastUpdated: -1 });
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get performance for a specific exercise
exports.getExercisePerformance = async (req, res) => {
  try {
    const performance = await PerformanceHistory.findOne({
      userId: req.params.userId,
      exerciseName: req.params.exerciseName
    });
    if (!performance) {
      return res.json({ maxWeight: 0, repsAtMaxWeight: 0 });
    }
    res.json(performance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update or create performance record
exports.updatePerformance = async (req, res) => {
  try {
    const { userId, exerciseName, maxWeight, repsAtMaxWeight } = req.body;

    let performance = await PerformanceHistory.findOne({ userId, exerciseName });

    if (!performance) {
      // Create new record
      performance = new PerformanceHistory({
        userId,
        exerciseName,
        maxWeight,
        repsAtMaxWeight,
        lastUpdated: new Date()
      });
    } else {
      // Update if weight is greater or same weight with more reps
      if (maxWeight > performance.maxWeight || 
          (maxWeight === performance.maxWeight && repsAtMaxWeight > performance.repsAtMaxWeight)) {
        performance.maxWeight = maxWeight;
        performance.repsAtMaxWeight = repsAtMaxWeight;
        performance.lastUpdated = new Date();
      }
    }

    const saved = await performance.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
