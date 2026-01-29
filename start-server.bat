@echo off
REM Workout Tracker - MongoDB Setup Script for Windows

echo.
echo ================================
echo MongoDB Setup for Workout Tracker
echo ================================
echo.

REM Check if .env exists
if not exist "server\.env" (
    echo ^^! .env file not found in server folder
    echo.
    echo Please create a .env file in the server folder:
    echo 1. Copy server\.env.example to server\.env
    echo 2. Add your MongoDB connection string
    echo.
    echo Example for MongoDB Atlas:
    echo MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/workout-tracker?retryWrites=true^&w=majority
    echo.
    echo Example for Local MongoDB:
    echo MONGODB_URI=mongodb://localhost:27017/workout-tracker
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "server\node_modules" (
    echo Installing dependencies...
    cd server
    call npm install
    cd ..
    echo Dependencies installed
) else (
    echo Dependencies already installed
)

echo.
echo Starting your server...
echo.
echo Make sure you have:
echo - MongoDB running (local or Atlas)
echo - .env file configured with MONGODB_URI
echo.

cd server
call npm run dev
pause
