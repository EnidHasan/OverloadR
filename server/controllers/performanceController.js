const PerformanceHistory = require('../models/PerformanceHistory');
const WorkoutSession = require('../models/WorkoutSession');
const Workout = require('../models/Workout');

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
    
    if (!performance || !performance.topPerformances || performance.topPerformances.length === 0) {
      return res.json({ topPerformances: [] });
    }
    
    res.json(performance);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update or create performance record
exports.updatePerformance = async (req, res) => {
  try {
    const { userId, exerciseName, weight, reps } = req.body;

    console.log('📊 Updating performance:', { userId, exerciseName, weight, reps });

    let performance = await PerformanceHistory.findOne({ userId, exerciseName });

    if (!performance) {
      // Create new record with first performance
      performance = new PerformanceHistory({
        userId,
        exerciseName,
        topPerformances: [{ weight, reps, date: new Date() }],
        lastUpdated: new Date()
      });
    } else {
      // Add new performance and sort
      const newPerformance = { weight, reps, date: new Date() };
      performance.topPerformances.push(newPerformance);
      
      // Sort by weight descending, then by reps descending
      performance.topPerformances.sort((a, b) => {
        if (b.weight !== a.weight) return b.weight - a.weight;
        return b.reps - a.reps;
      });
      
      // Keep only top 2
      performance.topPerformances = performance.topPerformances.slice(0, 2);
      performance.lastUpdated = new Date();
    }

    const saved = await performance.save();
    console.log('✅ Performance saved:', saved);
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error saving performance:', err);
    res.status(400).json({ message: err.message });
  }
};

// Save completed workout
exports.saveWorkout = async (req, res) => {
  try {
    const { userId, planId, planName, exercises } = req.body;
    
    console.log('💪 Saving workout with exercises:', exercises.length);

    // Save the workout session
    const session = new WorkoutSession({
      userId,
      planId,
      planName,
      exercises,
      completedAt: new Date()
    });
    await session.save();

    // Save each exercise as individual workout entries
    for (const exercise of exercises) {
      if (!exercise.sets || exercise.sets.length === 0) continue;

      const workout = new Workout({
        userId,
        exerciseName: exercise.name,
        group: exercise.group || 'Unknown',
        muscleDetail: exercise.muscleDetail || '',
        sets: exercise.sets.length,
        allSets: exercise.sets,
        date: new Date()
      });
      await workout.save();
      console.log('✅ Saved workout entry for:', exercise.name);
    }

    // Process each exercise and update performance history
    for (const exercise of exercises) {
      if (!exercise.sets || exercise.sets.length === 0) continue;

      // Find the best set for this exercise
      const bestSet = exercise.sets.reduce((best, current) => {
        if (!best) return current;
        if (current.weight > best.weight) return current;
        if (current.weight === best.weight && current.reps > best.reps) return current;
        return best;
      }, null);

      if (bestSet && bestSet.weight > 0) {
        // Update performance history
        await exports.updatePerformance({
          body: {
            userId,
            exerciseName: exercise.name,
            weight: bestSet.weight,
            reps: bestSet.reps
          }
        }, { status: () => ({ json: () => {} }), json: () => {} });
      }
    }

    res.status(201).json({ message: 'Workout saved successfully', sessionId: session._id });
  } catch (err) {
    console.error('❌ Error saving workout:', err);
    res.status(400).json({ message: err.message });
  }
};

// Get last workout session for a specific plan
exports.getLastSession = async (req, res) => {
  try {
    const { userId, planId } = req.params;
    
    const lastSession = await WorkoutSession.findOne({ userId, planId })
      .sort({ completedAt: -1 })
      .limit(1);
    
    if (!lastSession) {
      return res.json(null);
    }
    
    res.json(lastSession);
  } catch (err) {
    console.error('❌ Error getting last session:', err);
    res.status(500).json({ message: err.message });
  }
};
