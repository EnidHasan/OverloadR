import React from 'react'
import '../styles/InfoPages.css'

function AboutUs() {
  return (
    <div className="info-page">
      <div className="info-container">
        <h1>About OverloadR</h1>
        
        <section className="info-section">
          <h2>Our Mission</h2>
          <p>
            OverloadR was created with a simple yet powerful mission: to empower athletes and fitness enthusiasts 
            to track their progress, optimize their workouts, and achieve their strength goals. We believe that 
            progress is best measured through consistent tracking and data-driven insights.
          </p>
        </section>

        <section className="info-section">
          <h2>What We Offer</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>📊 Workout Tracking</h3>
              <p>Log every set, rep, and weight with precision. Track your progress over time with detailed history.</p>
            </div>
            <div className="feature-card">
              <h3>📋 Custom Plans</h3>
              <p>Create personalized workout plans tailored to your goals and save them for quick access.</p>
            </div>
            <div className="feature-card">
              <h3>💪 Exercise Library</h3>
              <p>Learn proper form and technique with our comprehensive exercise database.</p>
            </div>
            <div className="feature-card">
              <h3>📈 Performance Analytics</h3>
              <p>Visualize your progress with charts and track your personal records.</p>
            </div>
          </div>
        </section>

        <section className="info-section">
          <h2>Our Story</h2>
          <p>
            OverloadR was born from the frustration of using complicated fitness apps that were either too basic 
            or overly complex. We wanted to create a tool that strikes the perfect balance - powerful enough for 
            serious athletes, yet simple enough for beginners.
          </p>
          <p>
            Built by fitness enthusiasts for fitness enthusiasts, OverloadR focuses on what matters most: 
            helping you track your workouts efficiently and effectively so you can spend more time lifting 
            and less time logging.
          </p>
        </section>

        <section className="info-section">
          <h2>Our Values</h2>
          <ul className="values-list">
            <li><strong>Simplicity:</strong> Clean, intuitive interface that gets out of your way</li>
            <li><strong>Privacy:</strong> Your workout data belongs to you, always</li>
            <li><strong>Reliability:</strong> Built with modern technology for consistent performance</li>
            <li><strong>Community:</strong> Supporting athletes at every level of their fitness journey</li>
          </ul>
        </section>

        <section className="info-section">
          <h2>Join Our Community</h2>
          <p>
            Whether you're a beginner just starting your fitness journey or a seasoned athlete chasing new PRs, 
            OverloadR is here to support you every step of the way. Join thousands of users who are already 
            tracking their way to success.
          </p>
          <div className="cta-buttons">
            <a href="/signup" className="cta-button primary">Get Started Free</a>
            <a href="/contact" className="cta-button secondary">Contact Us</a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AboutUs
