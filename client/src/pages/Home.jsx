import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Home.css'

function Home() {
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem('token')

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/workouts')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content container">
          <h1 className="tracking-tight">OverloadR</h1>
          <p className="subtitle fw-semibold">Progressive overload, smarter planning, stronger results.</p>
          <button className="cta-button" onClick={handleGetStarted}>
            {isLoggedIn ? 'View Workouts' : 'Get Started'}
          </button>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Why Use OverloadR?</h2>
          <div className="features-grid row g-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card h-100">
                <h3>📊 Track Progress</h3>
                <p>Monitor exercises, sets, reps, and load trends so you always know what to beat next time.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card h-100">
                <h3>💪 Build Routines</h3>
                <p>Build routines with curated exercise libraries and structured set targets by muscle group.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card h-100">
                <h3>📝 Detailed Logging</h3>
                <p>Log session details, rest times, and notes so every workout gets smarter than the last.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card h-100">
                <h3>🎯 Achieve Goals</h3>
                <p>Track milestones and personal bests so you always have a clear next goal.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {!isLoggedIn && (
        <section className="cta-section">
          <div className="container">
            <h2>Ready to Start Your Fitness Journey?</h2>
            <div className="cta-buttons d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <button className="primary-btn" onClick={() => navigate('/login')}>
                Login
              </button>
              <button className="secondary-btn" onClick={() => navigate('/signup')}>
                Sign Up
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
