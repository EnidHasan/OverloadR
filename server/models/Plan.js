const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  exercises: [
    {
      name: {
        type: String,
        required: true,
      },
      group: {
        type: String,
        required: true,
      },
      muscleDetail: {
        type: String,
        required: true,
      },
      sets: [
        {
          reps: {
            type: Number,
            default: 8,
          },
          weight: {
            type: Number,
            default: 0,
          },
        },
      ],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Indexes for queries
planSchema.index({ userId: 1 });
planSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Plan', planSchema);
