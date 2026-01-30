import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom'
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
import AboutUs from './pages/AboutUs'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Contact from './pages/Contact'
import AdminDashboard from './pages/AdminDashboard'
import { ToastProvider } from './components/Toast'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ThemeToggle from './components/ThemeToggle'
import Footer from './components/Footer'

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    closeMenu()
  }

  return (
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
          {user ? (
            <>
              <Link className="nav-link" to="/workouts" onClick={closeMenu}>Workouts</Link>
              <Link className="nav-link" to="/learn" onClick={closeMenu}>Learn</Link>
              <Link className="nav-link" to="/plan" onClick={closeMenu}>Plan Workout</Link>
              <Link className="nav-link" to="/saved-plans" onClick={closeMenu}>My Plans</Link>
              <Link className="nav-link" to="/profile" onClick={closeMenu}>Profile</Link>
              <button className="nav-link" onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login" onClick={closeMenu}>Login</Link>
              <Link className="nav-link" to="/signup" onClick={closeMenu}>Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="App">
              <NavBar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
                <Route path="/learn" element={<ProtectedRoute><LearnWorkouts /></ProtectedRoute>} />
                <Route path="/plan" element={<ProtectedRoute><PlanWorkout /></ProtectedRoute>} />
                <Route path="/saved-plans" element={<ProtectedRoute><SavedPlans /></ProtectedRoute>} />
                <Route path="/execute-plan/:planId" element={<ProtectedRoute><ExecutePlan /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              </Routes>
              <Footer />
              <ThemeToggle />
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
