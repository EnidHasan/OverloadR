import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Home from './pages/Home'
import Workouts from './pages/Workouts'
import LearnWorkouts from './pages/LearnWorkouts'
import Login from './pages/Login'
import Signup from './pages/Signup'
import PlanWorkout from './pages/PlanWorkout'
import SavedPlans from './pages/SavedPlans'
import ExecutePlan from './pages/ExecutePlan'
import Profile from './pages/Profile'
import { ToastProvider } from './components/Toast'
import { ThemeProvider } from './context/ThemeContext'
import ThemeToggle from './components/ThemeToggle'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <ThemeProvider>
      <ToastProvider>
        <Router>
          <div className="App">
            <nav className="main-nav">
              <div className="nav-container">
                <Link className="brand-logo" to="/" onClick={closeMenu}>
                  <img src="/logo.png" alt="OverloadR Logo" className="navbar-logo" />
                  <span>OverloadR</span>
                </Link>
                
                <button 
                  className="menu-toggle" 
                  onClick={toggleMenu}
                  aria-label="Toggle navigation"
                  aria-expanded={isMenuOpen}
                >
                  <span className={`hamburger ${isMenuOpen ? 'active' : ''}`}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </span>
                </button>

                <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                  <Link className="nav-link" to="/" onClick={closeMenu}>Home</Link>
                  <Link className="nav-link" to="/workouts" onClick={closeMenu}>Workouts</Link>
                  <Link className="nav-link" to="/learn" onClick={closeMenu}>Learn</Link>
                  <Link className="nav-link" to="/plan" onClick={closeMenu}>Plan Workout</Link>
                  <Link className="nav-link" to="/saved-plans" onClick={closeMenu}>My Plans</Link>
                  <Link className="nav-link" to="/profile" onClick={closeMenu}>Profile</Link>
                  <Link className="nav-link" to="/login" onClick={closeMenu}>Login</Link>
                </div>
              </div>
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/learn" element={<LearnWorkouts />} />
              <Route path="/plan" element={<PlanWorkout />} />
              <Route path="/saved-plans" element={<SavedPlans />} />
              <Route path="/execute-plan/:planId" element={<ExecutePlan />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
            <ThemeToggle />
          </div>
        </Router>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
