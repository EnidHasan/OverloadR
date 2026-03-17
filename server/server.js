const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { connectToDatabase, disconnectFromDatabase } = require('./config/database');

const app = express();
let server;
let databaseMode = 'external';

// Middleware
app.use(cors());
app.use(express.json());

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
    databaseMode,
    databaseName: mongoose.connection.name || null,
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const connection = await connectToDatabase();
    databaseMode = connection.usingMemoryServer ? 'memory' : 'external';

    console.log('✅ MongoDB connected successfully');
    console.log('📍 Database:', mongoose.connection.name);
    console.log('📍 Host:', mongoose.connection.host);
    if (connection.usingMemoryServer) {
      console.log('⚠️ Running with in-memory MongoDB. Data will be lost when the server stops.');
    }

    server = app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
}

async function shutdown(signal) {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  if (server) {
    await new Promise((resolve) => server.close(resolve));
  }

  await disconnectFromDatabase();
  process.exit(0);
}

process.on('SIGINT', () => {
  shutdown('SIGINT').catch((error) => {
    console.error('❌ Error during shutdown:', error.message);
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  shutdown('SIGTERM').catch((error) => {
    console.error('❌ Error during shutdown:', error.message);
    process.exit(1);
  });
});

startServer();
