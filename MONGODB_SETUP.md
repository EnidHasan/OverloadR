# MongoDB Setup Guide for Workout Tracker

This guide will help you set up MongoDB and connect it to your workout tracker application.

## Step 1: Install MongoDB Locally or Use MongoDB Atlas (Cloud)

### Option A: MongoDB Atlas (Recommended for beginners)

1. **Create Free Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up with email or Google account
   - Complete verification

2. **Create a Free Cluster**
   - Click "Build a Cluster"
   - Select FREE tier
   - Choose your preferred region (closest to you)
   - Click "Create"

3. **Get Connection String**
   - Once cluster is created, click "Connect"
   - Select "Drivers"
   - Choose "Node.js"
   - Copy the connection string (you'll see something like):
     ```
     mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
     ```

4. **Create Database User**
   - In Atlas, go to "Database Access"
   - Click "Add New Database User"
   - Create username and password (save these!)
   - Add privileges

5. **Whitelist IP Address**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development: Select "Allow Access from Anywhere" (0.0.0.0/0)
   - For production: Add your specific IP

### Option B: Local MongoDB Installation

**Windows:**
1. Download from https://www.mongodb.com/try/download/community
2. Run installer and follow setup
3. Start MongoDB service
4. Connection string: `mongodb://localhost:27017/workout-tracker`

**Mac (using Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

## Step 2: Set Up Environment Variables

1. **Create `.env` file** in your server directory:
   ```
   server/
   ├── .env
   ├── server.js
   └── ...
   ```

2. **Add this to `.env`:**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/workout-tracker?retryWrites=true&w=majority
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_secret_key_here_change_this
   ```

3. **For local MongoDB, use:**
   ```
   MONGODB_URI=mongodb://localhost:27017/workout-tracker
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_secret_key_here_change_this
   ```

3. **Important: Add `.env` to `.gitignore`**
   ```
   echo ".env" >> .gitignore
   ```

## Step 3: Install Dependencies

Your server already has the required packages, but verify they're installed:

```bash
cd server
npm install
```

Key packages you have:
- `mongoose` - MongoDB ODM (Object Data Modeling)
- `express` - Web framework
- `dotenv` - Environment variable management
- `cors` - Handle cross-origin requests

## Step 4: Your Server is Already Configured!

Your `server.js` already has MongoDB connection:

```javascript
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/workout-tracker')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
```

This will:
1. Read your `.env` file
2. Connect to MongoDB
3. Log success or error messages

## Step 5: Start Your Server

```bash
cd server
npm run dev  # Uses nodemon for auto-reload
```

You should see:
```
MongoDB connected
Server running on port 5000
```

## Step 6: Data Models Explained

### Workout Model
Stores individual workout sessions:
```javascript
{
  userId: ObjectId,           // Reference to user
  exerciseName: "Bench Press",
  group: "Chest",
  muscleDetail: "Pectoralis major",
  sets: 3,
  allSets: [
    { reps: 8, weight: 185 },
    { reps: 8, weight: 185 },
    { reps: 6, weight: 185 }
  ],
  duration: 45,              // minutes
  notes: "Good form today",
  date: 2026-01-29T...       // Auto-generated
}
```

### User Model
Stores user account information:
```javascript
{
  name: "John Doe",
  email: "john@example.com",
  password: "hashed_password",
  age: 25,
  weight: 180,
  createdAt: 2026-01-29T...  // Auto-generated
}
```

## Step 7: Testing the Connection

1. **Start your server:**
   ```bash
   cd server
   npm run dev
   ```

2. **Open another terminal and test API:**
   ```bash
   curl http://localhost:5000/api
   ```

3. **You should get:**
   ```json
   { "message": "Workout Tracker API" }
   ```

## Step 8: Database Queries You Can Now Use

Your backend already has routes to:

### Log a Workout
```bash
POST /api/workouts
Body: {
  "exerciseName": "Bench Press",
  "group": "Chest",
  "muscleDetail": "Pectoralis major",
  "sets": 3,
  "allSets": [
    { "reps": 8, "weight": 185 },
    { "reps": 8, "weight": 185 },
    { "reps": 6, "weight": 185 }
  ],
  "duration": 45,
  "notes": "Great workout"
}
```

### Get All Workouts
```bash
GET /api/workouts/:userId
```

### Delete a Workout
```bash
DELETE /api/workouts/:id
```

## Troubleshooting

### "MongoDB connection error"
- ✓ Check `.env` file exists and has correct URI
- ✓ Check username/password are correct (no special characters need encoding)
- ✓ Check IP whitelist on MongoDB Atlas (if using cloud)
- ✓ Check internet connection

### "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### "Connection refused"
- ✓ For local: Make sure MongoDB service is running
- ✓ For Atlas: Check network access settings

### "Authentication failed"
- ✓ Check username/password in connection string
- ✓ Make sure database user is created in MongoDB Atlas
- ✓ Make sure user has proper roles/permissions

## MongoDB Atlas Connection String Format

Replace these placeholders:
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

Username: (created in Database Access)
Password: (created in Database Access)
Cluster: (your cluster name, e.g., cluster0)
Database: (optional, defaults to admin)
```

## Next Steps

1. ✅ Your frontend (React) is already configured to use axios
2. ✅ Your backend (Express) is ready to receive requests
3. ✅ Your models are set up properly
4. Now just:
   - Set up `.env` file with MongoDB URI
   - Start the server: `npm run dev`
   - Your app is ready to store data!

## Example Full Workflow

1. User logs in/creates account (stored in MongoDB)
2. User plans a workout (exercises stored in browser localStorage)
3. User executes the plan and logs exercises (sent to backend)
4. Backend saves to MongoDB with axios
5. Workout history fetches from MongoDB
6. Performance tracking compares against MongoDB records

All data now persists! 🎉
