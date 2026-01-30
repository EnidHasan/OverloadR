import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import '../styles/Profile.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function Profile() {
  const navigate = useNavigate()
  const { user, logout, updateUser } = useAuth()
  const { showToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (user) {
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchUserProfile = async () => {
    try {
      setLoading(true)
      
      // First try to get from localStorage
      const storedAge = localStorage.getItem('userAge')
      const storedWeight = localStorage.getItem('userWeight')
      const storedCreatedAt = localStorage.getItem('userCreatedAt')
      
      // Set initial form data from user context and localStorage
      setFormData({
        name: user.name || '',
        email: user.email || '',
        age: storedAge || user.age || '',
        weight: storedWeight || user.weight || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

      // Fetch latest data from server
      const response = await axios.get(
        `${API_URL}/users/${user.id}`,
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      )

      if (response.data) {
        // Update form with server data
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          age: response.data.age || '',
          weight: response.data.weight || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
        
        // Update localStorage with server data
        if (response.data.age) localStorage.setItem('userAge', response.data.age)
        if (response.data.weight) localStorage.setItem('userWeight', response.data.weight)
        if (response.data.createdAt) localStorage.setItem('userCreatedAt', response.data.createdAt)
        
        // Update auth context
        updateUser(response.data)
      }
      
      setLoading(false)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile')
      setLoading(false)
      if (err.response?.status === 401) {
        showToast('Session expired. Please log in again.', 'error')
        logout()
        navigate('/login')
      }
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate passwords if changing
    if (formData.newPassword) {
      if (formData.newPassword.length < 6) {
        const msg = 'New password must be at least 6 characters'
        setError(msg)
        showToast(msg, 'error')
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        const msg = 'New passwords do not match'
        setError(msg)
        showToast(msg, 'error')
        return
      }
      if (!formData.currentPassword) {
        const msg = 'Current password is required to change password'
        setError(msg)
        showToast(msg, 'error')
        return
      }
    }

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined
      }

      // Include passwords if changing
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
      }

      console.log('Updating profile for user ID:', user.id)
      console.log('Update data:', updateData)

      const response = await axios.put(
        `${API_URL}/users/${user.id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      )

      console.log('Update successful:', response.data)

      // Update auth context and localStorage
      updateUser(response.data)

      setSuccess('Profile updated successfully!')
      showToast('Profile updated successfully!', 'success')
      setIsEditing(false)
      
      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
      const errorMsg = err.response?.data?.message || 'Failed to update profile'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    }
  }

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully', 'info')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="profile-container">
        <div className="error">Please log in to view your profile</div>
      </div>
    )
  }

  // Get member since date
  const memberSince = localStorage.getItem('userCreatedAt') 
    ? new Date(localStorage.getItem('userCreatedAt')).toLocaleDateString()
    : 'Recently'

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {formData.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h1>{formData.name}</h1>
          <p className="profile-email">{formData.email}</p>
          <p className="member-since">
            Member since {memberSince}
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-section">
            <h2>Personal Information</h2>
            
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  disabled={!isEditing}
                  min="1"
                  max="150"
                  placeholder="Enter your age"
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight (lbs)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  disabled={!isEditing}
                  step="0.1"
                  min="1"
                  placeholder="Enter your weight"
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="form-section">
              <h2>Change Password (Optional)</h2>
              
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  placeholder="Enter current password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (min 6 characters)"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          )}

          <div className="button-group">
            {!isEditing ? (
              <>
                <button
                  type="button"
                  className="btn-edit"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="btn-logout"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button type="submit" className="btn-save">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setIsEditing(false)
                    setError('')
                    // Reset form to current user data
                    setFormData({
                      name: user.name || '',
                      email: user.email || '',
                      age: localStorage.getItem('userAge') || user.age || '',
                      weight: localStorage.getItem('userWeight') || user.weight || '',
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    })
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
