const mongoose = require('mongoose');

const workoutSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  exercises: [{
    name: {
      type: String,
      required: true
    },
    group: String,
    sets: [{
      reps: Number,
      weight: Number
    }]
  }],
  completedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WorkoutSession', workoutSessionSchema);
