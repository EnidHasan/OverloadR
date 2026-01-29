import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../components/Toast'
import '../styles/NewAuth.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function Signup() {
  const navigate = useNavigate()
  const { showToast } = useToast()
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

    if (formData.password !== formData.confirmPassword) {
      const msg = 'Passwords do not match'
      setError(msg)
      showToast(msg, 'warning')
      return
    }

    if (formData.password.length < 6) {
      const msg = 'Password must be at least 6 characters'
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
        // Store user data in localStorage
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('userId', response.data._id)
        localStorage.setItem('userName', response.data.name)
        localStorage.setItem('userEmail', response.data.email)
        
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
