const mongoose = require('mongoose');

const performanceHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  exerciseName: {
    type: String,
    required: true,
  },
  topPerformances: [
    {
      weight: {
        type: Number,
        required: true,
      },
      reps: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Compound index to ensure unique user-exercise combo
performanceHistorySchema.index({ userId: 1, exerciseName: 1 }, { unique: true });

module.exports = mongoose.model('PerformanceHistory', performanceHistorySchema);
