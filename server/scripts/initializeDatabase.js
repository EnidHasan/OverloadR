const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Workout = require('../models/Workout');

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workout-tracker');
    console.log('✅ Connected to MongoDB');

    // Create collections and indexes
    console.log('\n📦 Creating collections and indexes...\n');

    // Users Collection
    await User.collection.drop().catch(() => {});
    await User.collection.createIndex({ email: 1 }, { unique: true });
    console.log('✅ Users collection created with indexes');

    // Workouts Collection
    await Workout.collection.drop().catch(() => {});
    await Workout.collection.createIndex({ userId: 1 });
    await Workout.collection.createIndex({ date: -1 });
    await Workout.collection.createIndex({ exerciseName: 1 });
    console.log('✅ Workouts collection created with indexes');

    // Create a Plans collection for saved workout plans
    const plansCollectionExists = await mongoose.connection.db.listCollections({ name: 'plans' }).toArray();
    
    if (plansCollectionExists.length === 0) {
      await mongoose.connection.db.createCollection('plans');
      console.log('✅ Plans collection created');
    } else {
      console.log('✅ Plans collection already exists');
    }

    // Create indexes for Plans collection
    const plansCollection = mongoose.connection.collection('plans');
    await plansCollection.createIndex({ userId: 1 });
    await plansCollection.createIndex({ createdAt: -1 });
    console.log('✅ Plans collection indexes created');

    // Create a PerformanceHistory collection for tracking best lifts
    const perfHistoryExists = await mongoose.connection.db.listCollections({ name: 'performancehistories' }).toArray();
    
    if (perfHistoryExists.length === 0) {
      await mongoose.connection.db.createCollection('performancehistories');
      console.log('✅ PerformanceHistory collection created');
    } else {
      console.log('✅ PerformanceHistory collection already exists');
    }

    // Create indexes for PerformanceHistory collection
    const perfCollection = mongoose.connection.collection('performancehistories');
    await perfCollection.createIndex({ userId: 1, exerciseName: 1 }, { unique: true });
    console.log('✅ PerformanceHistory collection indexes created');

    console.log('\n✨ Database initialization complete!\n');
    console.log('Collections created:');
    console.log('  • users - User accounts and authentication');
    console.log('  • workouts - Individual workout sessions with per-set data');
    console.log('  • plans - Saved workout plans');
    console.log('  • performancehistories - Best performance records per exercise\n');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    process.exit(1);
  }
}

initializeDatabase();
