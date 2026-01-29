# MongoDB Data Collections Setup

Your Workout Tracker now has **4 complete MongoDB collections** to save all user data:

## Collections Created

### 1. **Users Collection**
Stores user account information with secured passwords.
```
Fields:
- _id: ObjectId (unique)
- name: String (required)
- email: String (required, unique, lowercase)
- password: String (hashed with bcryptjs)
- age: Number (optional)
- weight: Number (optional)
- createdAt: Date (auto)
```
**Endpoint:** POST `/api/users/register` | POST `/api/users/login`

---

### 2. **Workouts Collection**
Stores individual workout sessions with per-set data.
```
Fields:
- _id: ObjectId (unique)
- userId: ObjectId (reference to User)
- exerciseName: String (required)
- group: String (required) - Chest, Back, Shoulders, etc.
- muscleDetail: String - Specific muscle group
- sets: Number (required) - Total number of sets
- allSets: Array of objects
  - reps: Number (required)
  - weight: Number (required)
- duration: Number (minutes, default: 0)
- notes: String (optional)
- date: Date (indexed for fast queries)
- createdAt: Date (auto)
- updatedAt: Date (auto)
```
**Indexes:** 
- `userId` for fast user lookups
- `date` for chronological sorting

**Endpoints:** 
- GET `/api/workouts/:userId` - Get all workouts for user
- POST `/api/workouts` - Create new workout
- PUT `/api/workouts/:id` - Update workout
- DELETE `/api/workouts/:id` - Delete workout

---

### 3. **Plans Collection**
Stores saved workout plans created by users.
```
Fields:
- _id: ObjectId (unique)
- userId: ObjectId (reference to User)
- name: String (required) - Plan name (e.g., "Chest Day")
- exercises: Array of objects
  - exerciseName: String (required)
  - group: String (required)
  - muscleDetail: String
  - sets: Number (default: 3)
- createdAt: Date (auto)
- updatedAt: Date (auto)
```
**Indexes:** 
- `userId` for fast user lookups
- `createdAt` for newest plans first

**Endpoints:**
- GET `/api/plans/user/:userId` - Get all plans for user
- GET `/api/plans/:id` - Get single plan
- POST `/api/plans` - Create new plan
- PUT `/api/plans/:id` - Update plan
- DELETE `/api/plans/:id` - Delete plan

---

### 4. **PerformanceHistory Collection**
Tracks the best weight/reps achieved for each exercise per user.
```
Fields:
- _id: ObjectId (unique)
- userId: ObjectId (reference to User)
- exerciseName: String (required)
- maxWeight: Number (default: 0) - Best weight lifted
- repsAtMaxWeight: Number (default: 0) - Reps at max weight
- lastUpdated: Date (auto)
- createdAt: Date (auto)
- updatedAt: Date (auto)
```
**Indexes:** 
- Unique compound index on `(userId, exerciseName)` - Only one record per user per exercise

**Endpoints:**
- GET `/api/performance/user/:userId` - Get all performance records
- GET `/api/performance/:userId/:exerciseName` - Get specific exercise performance
- POST `/api/performance` - Update performance record

---

## Data Flow

### User Registration
1. User enters name, email, password in signup form
2. Password is hashed with bcryptjs (10 salt rounds)
3. User document created in MongoDB
4. JWT token returned and stored in localStorage
5. User automatically logged in and redirected

### Workout Logging
1. User selects exercise and enters sets (reps/weight)
2. Workout data sent to `/api/workouts`
3. New Workout document created linked to userId
4. Performance automatically updated if better than previous
5. Workout appears in user's history

### Plan Creation
1. User selects exercises and gives plan a name
2. Plan data sent to `/api/plans`
3. New Plan document created with exercises array
4. User can edit, duplicate, or delete plan anytime
5. Plans automatically show only for logged-in user

### Performance Tracking
1. After logging workout, performance automatically updates
2. If weight > previous maxWeight, it's recorded
3. If same weight, reps compared
4. User can see their best lifts per exercise

---

## Authentication & Security

✅ **Passwords:** Hashed with bcryptjs (salted 10 rounds)
✅ **API Keys:** JWT tokens (30-day expiration)
✅ **Data Isolation:** Each user only sees their own data (userId filtering)
✅ **Unique Emails:** Email field has unique index, prevents duplicate accounts
✅ **Data Validation:** All required fields validated before saving

---

## Test the Collections

### 1. Create a User (Sign Up)
```
POST http://localhost:5000/api/users/register
Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. Login
```
POST http://localhost:5000/api/users/login
Body:
{
  "email": "john@example.com",
  "password": "password123"
}
Response includes token and userId
```

### 3. Create a Workout
```
POST http://localhost:5000/api/workouts
Body:
{
  "userId": "<USER_ID>",
  "exerciseName": "Bench Press",
  "group": "Chest",
  "muscleDetail": "Pectoralis major",
  "sets": 3,
  "allSets": [
    {"reps": 8, "weight": 225},
    {"reps": 8, "weight": 225},
    {"reps": 6, "weight": 225}
  ],
  "duration": 45,
  "notes": "Great workout!"
}
```

### 4. Get User's Workouts
```
GET http://localhost:5000/api/workouts/<USER_ID>
Returns all workouts for that user
```

---

## MongoDB Atlas Dashboard

All data syncs to your MongoDB Atlas cluster in real-time:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Log in with your account
3. Click "Databases" → "Collections"
4. Select your cluster and database
5. You'll see all 4 collections with real data!

Your data is now **fully persistent** and **cloud-backed**! 🎉
