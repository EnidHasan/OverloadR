import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import '../styles/NewAuth.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function Signup() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
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

  const validateEmail = (email) => {
    const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com']
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address'
    }
    
    const domain = email.split('@')[1]?.toLowerCase()
    if (!validDomains.includes(domain)) {
      return 'Please use a valid email provider (Gmail, Yahoo, Outlook, Hotmail, or iCloud)'
    }
    
    return null
  }

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter'
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter'
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number'
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'
    }
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      const msg = 'All fields are required'
      setError(msg)
      showToast(msg, 'warning')
      return
    }

    // Email validation
    const emailError = validateEmail(formData.email)
    if (emailError) {
      setError(emailError)
      showToast(emailError, 'warning')
      return
    }

    // Password validation
    const passwordError = validatePassword(formData.password)
    if (passwordError) {
      setError(passwordError)
      showToast(passwordError, 'warning')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      const msg = 'Passwords do not match'
      setError(msg)
      showToast(msg, 'warning')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      })

      if (response.data.token) {
        // Use auth context to store user data with 14-day session
        login(response.data)
        
        showToast('Account created successfully!', 'success')
        setTimeout(() => navigate('/workouts'), 500)
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Signup failed. Please try again.'
      setError(errorMsg)
      showToast(errorMsg, 'error')
      console.error('Signup error details:', {
        status: err.response?.status,
        message: err.response?.data?.message,
        error: err.message,
        url: `${API_URL}/users/register`
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Sign Up</h1>
        <p className="auth-subtitle">Join Workout Tracker today</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>

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
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              required
            />
            <small style={{color: '#888', fontSize: '0.85em', marginTop: '4px', display: 'block'}}>
              Min 8 characters with uppercase, lowercase, number & special character
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
