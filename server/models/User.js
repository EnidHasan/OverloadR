const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  age: Number,
  weight: Number,
  isAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to compare password (plain text)
userSchema.methods.comparePassword = function(candidatePassword) {
  return this.password === candidatePassword;
};

module.exports = mongoose.model('User', userSchema);
