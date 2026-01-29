#!/bin/bash

# Workout Tracker - MongoDB Setup Script
# This script helps you set up MongoDB for your workout tracker

echo "================================"
echo "MongoDB Setup for Workout Tracker"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f server/.env ]; then
    echo "⚠️  .env file not found in server folder"
    echo ""
    echo "Please create a .env file in the server folder:"
    echo "1. Copy server/.env.example to server/.env"
    echo "2. Add your MongoDB connection string"
    echo ""
    echo "Example for MongoDB Atlas:"
    echo "MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/workout-tracker?retryWrites=true&w=majority"
    echo ""
    echo "Example for Local MongoDB:"
    echo "MONGODB_URI=mongodb://localhost:27017/workout-tracker"
    echo ""
    exit 1
fi

# Check if node_modules exists
if [ ! -d server/node_modules ]; then
    echo "📦 Installing dependencies..."
    cd server
    npm install
    cd ..
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting your server..."
echo ""
echo "Make sure you have:"
echo "✓ MongoDB running (local or Atlas)"
echo "✓ .env file configured with MONGODB_URI"
echo ""

cd server
npm run dev
