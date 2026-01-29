# OverloadR - Workout Tracker App 💪

A modern, full-stack workout tracking application built with React, Node.js, Express, and MongoDB. Track your exercises, create workout plans, and monitor your fitness progress with an intuitive interface.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![Node](https://img.shields.io/badge/Node-18.x-339933.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248.svg)

## ✨ Features

### 🏋️ Workout Management
- **Log Workouts** - Track exercises with sets, reps, and weight
- **Exercise Library** - 35+ exercises with detailed instructions
- **Learn Mode** - Step-by-step guides, pro tips, and common mistakes to avoid
- **Search & Filter** - Find exercises by name, muscle group, or type

### 📋 Workout Planning
- **Create Plans** - Build custom workout routines
- **Save Plans** - Store your favorite workout combinations
- **Execute Plans** - Follow your plans with real-time tracking
- **Plan Management** - Edit and delete existing plans

### 📊 Performance Tracking
- **Progress Monitoring** - Track your performance over time
- **Workout History** - View all past workouts
- **Performance Analytics** - See your strength gains

### 🎨 User Experience
- **Dark/Light Theme** - Toggle between themes with floating theme switcher
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Modern UI** - Clean interface with smooth animations
- **Toast Notifications** - Real-time feedback for all actions
- **Hamburger Menu** - Intuitive mobile navigation

### 🔐 User Management
- **User Authentication** - Secure login and signup
- **Profile Management** - Manage your account settings
- **Personalized Experience** - Your data, your workouts

## 🚀 Tech Stack

### Frontend
- **React 18** - Modern UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Fast build tool
- **CSS3** - Custom styling with CSS variables

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcrypt** - Password hashing

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- MongoDB 6.x or higher
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/EnidHasan/OverloadR.git
cd OverloadR
```

### Setup MongoDB
1. Install MongoDB locally or use MongoDB Atlas
2. See `MONGODB_SETUP.md` for detailed instructions
3. Create a database named `workout_tracker`

### Backend Setup
```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/workout_tracker
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Development Mode

**Option 1: Run Both Servers Separately**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

**Option 2: Use Start Scripts**

Windows:
```bash
# From root directory
start-server.bat
```

Linux/Mac:
```bash
# From root directory
chmod +x start-server.sh
./start-server.sh
```

### Access the Application
- Frontend: http://localhost:5174
- Backend API: http://localhost:5000

## 📁 Project Structure

```
workout-tracker-app/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── ThemeToggle.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/       # React context providers
│   │   │   └── ThemeContext.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Workouts.jsx
│   │   │   ├── LearnWorkouts.jsx
│   │   │   ├── PlanWorkout.jsx
│   │   │   ├── SavedPlans.jsx
│   │   │   ├── ExecutePlan.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── styles/        # CSS stylesheets
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Express application
│   ├── controllers/       # Route controllers
│   │   ├── userController.js
│   │   ├── workoutController.js
│   │   ├── planController.js
│   │   └── performanceController.js
│   ├── models/           # MongoDB models
│   │   ├── User.js
│   │   ├── Workout.js
│   │   ├── Plan.js
│   │   └── PerformanceHistory.js
│   ├── routes/           # API routes
│   │   ├── userRoutes.js
│   │   ├── workoutRoutes.js
│   │   ├── planRoutes.js
│   │   └── performanceRoutes.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js
│   ├── scripts/          # Utility scripts
│   │   └── initializeDatabase.js
│   ├── server.js         # Entry point
│   └── package.json
│
├── .gitignore
├── MONGODB_SETUP.md
├── README.md
├── start-server.bat      # Windows startup script
└── start-server.sh       # Linux/Mac startup script
```

## 🎯 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User login
- `GET /api/users/:id` - Get user profile

### Workouts
- `GET /api/workouts/:userId` - Get user's workouts
- `POST /api/workouts` - Log new workout
- `DELETE /api/workouts/:id` - Delete workout

### Plans
- `GET /api/plans/:userId` - Get user's plans
- `POST /api/plans` - Create new plan
- `PUT /api/plans/:id` - Update plan
- `DELETE /api/plans/:id` - Delete plan

### Performance
- `GET /api/performance/:userId` - Get performance history
- `POST /api/performance` - Log performance data

## 🎨 Exercise Library

The app includes 35+ exercises across multiple categories:

- **Chest** (20 exercises): Bench Press, Dumbbell Press, Push-ups, Flyes, etc.
- **Back** (5 exercises): Pull-ups, Deadlifts, Rows, Lat Pulldowns, etc.
- **Shoulders** (1 exercise): Overhead Press
- **Biceps** (2 exercises): Barbell Curl, Hammer Curl
- **Triceps** (2 exercises): Tricep Dips, Pushdowns
- **Legs** (3 exercises): Squats, Romanian Deadlifts, Hip Thrusts
- **Core** (1 exercise): Plank

Each exercise includes:
- Detailed description
- Step-by-step instructions
- Pro tips
- Common mistakes to avoid
- Difficulty level
- Equipment needed
- Target muscles

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `NODE_ENV` - Environment (development/production)

**Frontend (.env)**
- `VITE_API_URL` - Backend API URL

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Enid Hasan**
- GitHub: [@EnidHasan](https://github.com/EnidHasan)

## 🙏 Acknowledgments

- Exercise data and information compiled from fitness resources
- Icons and UI inspiration from modern fitness applications
- Community feedback and suggestions

## 📧 Support

For support, open an issue in the GitHub repository at https://github.com/EnidHasan/OverloadR/issues

---

Made with ❤️ and 💪 by Enid Hasan
