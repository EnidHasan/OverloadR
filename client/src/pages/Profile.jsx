import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../styles/Profile.css'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
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
    fetchUserProfile()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('user'))
      if (!userData || !userData.token) {
        navigate('/login')
        return
      }

      const response = await axios.get(
        `http://localhost:5000/api/users/${userData._id}`,
        {
          headers: { Authorization: `Bearer ${userData.token}` }
        }
      )

      setUser(response.data)
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        age: response.data.age || '',
        weight: response.data.weight || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setLoading(false)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError('Failed to load profile')
      setLoading(false)
      if (err.response?.status === 401) {
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
        setError('New password must be at least 6 characters')
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('New passwords do not match')
        return
      }
      if (!formData.currentPassword) {
        setError('Current password is required to change password')
        return
      }
    }

    try {
      const userData = JSON.parse(localStorage.getItem('user'))
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

      const response = await axios.put(
        `http://localhost:5000/api/users/${userData._id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${userData.token}` }
        }
      )

      // Update local storage with new data
      const updatedUser = { ...userData, ...response.data }
      localStorage.setItem('user', JSON.stringify(updatedUser))

      setUser(response.data)
      setSuccess('Profile updated successfully!')
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
      setError(err.response?.data?.message || 'Failed to update profile')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
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
        <div className="error">Failed to load profile</div>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <h1>{user.name}</h1>
          <p className="profile-email">{user.email}</p>
          <p className="member-since">
            Member since {new Date(user.createdAt).toLocaleDateString()}
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
                />
              </div>

              <div className="form-group">
                <label htmlFor="weight">Weight (kg)</label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  disabled={!isEditing}
                  step="0.1"
                  min="1"
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
                    setFormData({
                      name: user.name || '',
                      email: user.email || '',
                      age: user.age || '',
                      weight: user.weight || '',
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
