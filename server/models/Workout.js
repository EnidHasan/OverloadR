const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseName: {
    type: String,
    required: true
  },
  group: {
    type: String,
    required: true
  },
  muscleDetail: {
    type: String
  },
  sets: {
    type: Number,
    required: true
  },
  allSets: [{
    reps: {
      type: Number,
      required: true
    },
    weight: {
      type: Number,
      required: true
    }
  }],
  duration: {
    type: Number,
    default: 0
  },
  notes: String,
  date: {
    type: Date,
    default: Date.now,
    index: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
