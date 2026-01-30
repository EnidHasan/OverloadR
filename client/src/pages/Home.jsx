import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Home.css'

function Home() {
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem('token')

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/saved-plans')
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-background"></div>
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <div className="hero-badge">💪 #1 Progressive Overload Tracker</div>
          <h1 className="tracking-tight">OverloadR</h1>
          <p className="subtitle fw-semibold">Progressive overload, smarter planning, stronger results.</p>
          <p className="hero-description">Transform your fitness journey with intelligent workout tracking and data-driven progress monitoring.</p>
          <div className="hero-buttons">
            <button className="cta-button" onClick={handleGetStarted}>
              {isLoggedIn ? 'View Plans' : 'Get Started'}
            </button>
            <button className="cta-button-secondary" onClick={() => navigate('/about')}>
              Learn More
            </button>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">10K+</span>
              <span className="stat-label">Workouts Logged</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Exercise Library</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Track Progress</span>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Features</span>
            <h2>Why Choose OverloadR?</h2>
            <p className="section-description">Everything you need to track, plan, and dominate your fitness goals</p>
          </div>
          <div className="features-grid row g-4">
            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card h-100">
                <div className="feature-icon">📊</div>
                <h3>Track Progress</h3>
                <p>Monitor exercises, sets, reps, and load trends so you always know what to beat next time.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card h-100">
                <div className="feature-icon">💪</div>
                <h3>Build Routines</h3>
                <p>Build routines with curated exercise libraries and structured set targets by muscle group.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card h-100">
                <div className="feature-icon">📝</div>
                <h3>Detailed Logging</h3>
                <p>Log session details, rest times, and notes so every workout gets smarter than the last.</p>
              </div>
            </div>
            <div className="col-12 col-md-6 col-lg-3">
              <div className="feature-card h-100">
                <div className="feature-icon">🎯</div>
                <h3>Achieve Goals</h3>
                <p>Track milestones and personal bests so you always have a clear next goal.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="benefits-section">
        <div className="container">
          <div className="benefits-content">
            <div className="benefits-image">
              <div className="image-placeholder">
                <span className="placeholder-icon">🏋️</span>
              </div>
            </div>
            <div className="benefits-text">
              <span className="section-badge">Smart Training</span>
              <h2>Train Smarter, Not Harder</h2>
              <div className="benefit-list">
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <div>
                    <h4>Progressive Overload Science</h4>
                    <p>Built on proven strength training principles to ensure continuous gains</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <div>
                    <h4>Data-Driven Insights</h4>
                    <p>Visualize your progress with detailed analytics and performance charts</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <div>
                    <h4>Customizable Workouts</h4>
                    <p>Create personalized plans that adapt to your schedule and fitness level</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <span className="benefit-check">✓</span>
                  <div>
                    <h4>Real-Time Tracking</h4>
                    <p>Log sets and reps instantly during your workout with our intuitive interface</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Success Stories</span>
            <h2>Loved by Fitness Enthusiasts</h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">"OverloadR transformed how I approach strength training. The progressive overload tracking is a game-changer!"</p>
              <div className="testimonial-author">
                <div className="author-avatar">AS</div>
                <div>
                  <div className="author-name">Alex Smith</div>
                  <div className="author-title">Powerlifter</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">"Finally, a tracker that actually helps me plan and execute better workouts. My gains have never been more consistent."</p>
              <div className="testimonial-author">
                <div className="author-avatar">MJ</div>
                <div>
                  <div className="author-name">Maria Johnson</div>
                  <div className="author-title">Bodybuilder</div>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-rating">⭐⭐⭐⭐⭐</div>
              <p className="testimonial-text">"The exercise library and workout planning features are incredibly detailed. It's like having a personal trainer in your pocket."</p>
              <div className="testimonial-author">
                <div className="author-avatar">DK</div>
                <div>
                  <div className="author-name">David Kim</div>
                  <div className="author-title">Fitness Coach</div>
                </div>
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
