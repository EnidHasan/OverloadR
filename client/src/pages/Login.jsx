import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import '../styles/NewAuth.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function Login() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await axios.post(`${API_URL}/users/login`, formData)
      
      if (response.data.token) {
        // Use auth context to store user data with 14-day session
        login(response.data)
        
        showToast('Login successful!', 'success')
        setTimeout(() => navigate('/workouts'), 500)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Login failed. Please try again.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
      console.error('Login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Login</h1>
        <p className="auth-subtitle">Welcome back to Workout Tracker</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(prev => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l2.1 2.1C2.6 7.04 1.5 9 1.5 12c2.5 5.2 6.5 8 10.5 8 2.03 0 3.94-.63 5.6-1.85l2.87 2.87a.75.75 0 1 0 1.06-1.06l-18-18Zm9.47 15.78A5.25 5.25 0 0 1 5.26 8.9l2.2 2.2a3 3 0 0 0 4.19 4.19l1.35 1.35Zm4.74-3.04-2.01-2a3 3 0 0 0-4.2-4.2L9.6 7.08a5.25 5.25 0 0 1 8.14 5.13c0 .97-.24 1.9-.7 2.75ZM12 4.5c3.83 0 7.2 2.7 9 7.5a15.9 15.9 0 0 1-2.28 4.03l-1.1-1.1A10.9 10.9 0 0 0 19.5 12C17.73 8.04 15.03 6 12 6c-.7 0-1.38.1-2.05.3l-1.6-1.6A8.8 8.8 0 0 1 12 4.5Z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M12 4.5c-4 0-8 2.8-10.5 7.5C4 17.2 8 20 12 20s8-2.8 10.5-8c-2.5-4.7-6.5-7.5-10.5-7.5Zm0 12.5a5 5 0 1 1 0-10 5 5 0 0 1 0 10Zm0-2.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
