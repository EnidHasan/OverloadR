const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workout-tracker')
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    console.log('📍 Database:', mongoose.connection.name);
    console.log('📍 Host:', mongoose.connection.host);
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Routes
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/plans', require('./routes/planRoutes'));
app.use('/api/performance', require('./routes/performanceRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

// Basic route
app.get('/api', (req, res) => {
  res.json({ message: 'Workout Tracker API', status: 'connected' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
