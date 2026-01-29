const Workout = require('../models/Workout');

// Get all workouts for a user
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new workout
exports.createWorkout = async (req, res) => {
  const workout = new Workout(req.body);
  try {
    const savedWorkout = await workout.save();
    res.status(201).json(savedWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a workout
exports.updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (req.body.exerciseName) workout.exerciseName = req.body.exerciseName;
    if (req.body.sets !== undefined) workout.sets = req.body.sets;
    if (req.body.reps !== undefined) workout.reps = req.body.reps;
    if (req.body.weight !== undefined) workout.weight = req.body.weight;
    if (req.body.duration !== undefined) workout.duration = req.body.duration;
    if (req.body.calories !== undefined) workout.calories = req.body.calories;
    if (req.body.notes) workout.notes = req.body.notes;
    
    const updatedWorkout = await workout.save();
    res.json(updatedWorkout);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a workout
exports.deleteWorkout = async (req, res) => {
  try {
    await Workout.findByIdAndDelete(req.params.id);
    res.json({ message: 'Workout deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
