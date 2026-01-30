import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import '../styles/Profile.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function Profile() {
  const navigate = useNavigate()
  const { user, logout, updateUser, loading: authLoading } = useAuth()
  const { showToast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const hasFetchedProfile = useRef(false)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    weight: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    hasFetchedProfile.current = false
  }, [user?.id])

  useEffect(() => {
    if (authLoading) {
      return
    }

    console.log('📍 Profile component mounted/updated. User:', user ? `${user.name} (${user.email})` : 'null')

    if (!user) {
      console.log('⚠️ No user found, setting loading to false')
      setLoading(false)
      return
    }

    if (hasFetchedProfile.current) {
      return
    }

    hasFetchedProfile.current = true
    console.log('👤 User object:', user)
    console.log('👤 Fetching profile for user:', user.id)
    fetchUserProfile()
  }, [authLoading, user?.id])

  const fetchUserProfile = async () => {
    setLoading(true)
    setError('')
    
    // Safety timeout - ensure loading completes within 5 seconds
    const timeoutId = setTimeout(() => {
      console.warn('⏱️ Profile loading timeout - setting loading to false')
      setLoading(false)
    }, 5000)
    
    try {
      // Set initial form data from user context and localStorage
      const storedAge = localStorage.getItem('userAge')
      const storedWeight = localStorage.getItem('userWeight')
      const storedPhone = localStorage.getItem('userPhone')
      const storedAddressLine1 = localStorage.getItem('userAddressLine1')
      const storedAddressLine2 = localStorage.getItem('userAddressLine2')
      const storedCity = localStorage.getItem('userCity')
      const storedState = localStorage.getItem('userState')
      const storedPostalCode = localStorage.getItem('userPostalCode')
      const storedCountry = localStorage.getItem('userCountry')
      
      const initialFormData = {
        name: user.name || '',
        email: user.email || '',
        age: storedAge || user.age || '',
        weight: storedWeight || user.weight || '',
        phone: storedPhone || user.phone || '',
        addressLine1: storedAddressLine1 || user.addressLine1 || '',
        addressLine2: storedAddressLine2 || user.addressLine2 || '',
        city: storedCity || user.city || '',
        state: storedState || user.state || '',
        postalCode: storedPostalCode || user.postalCode || '',
        country: storedCountry || user.country || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
      
      setFormData(initialFormData)
      console.log('📝 Initial form data set:', initialFormData)

      // Fetch latest data from server using the authenticated user's ID
      try {
        console.log('🔄 Fetching profile from server...')
        const response = await axios.get(
          `${API_URL}/users/${user.id}`,
          {
            headers: { Authorization: `Bearer ${user.token}` }
          }
        )

        console.log('✅ Profile fetched successfully:', response.data)
        
        if (response.data) {
          // Update form with server data
          const updatedFormData = {
            name: response.data.name || '',
            email: response.data.email || '',
            age: response.data.age || '',
            weight: response.data.weight || '',
            phone: response.data.phone || '',
            addressLine1: response.data.addressLine1 || '',
            addressLine2: response.data.addressLine2 || '',
            city: response.data.city || '',
            state: response.data.state || '',
            postalCode: response.data.postalCode || '',
            country: response.data.country || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
          
          setFormData(updatedFormData)
          console.log('📝 Updated form data with server response:', updatedFormData)
          
          // Update localStorage with server data
          if (response.data.age) localStorage.setItem('userAge', response.data.age)
          if (response.data.weight) localStorage.setItem('userWeight', response.data.weight)
          if (response.data.phone) localStorage.setItem('userPhone', response.data.phone)
          if (response.data.addressLine1) localStorage.setItem('userAddressLine1', response.data.addressLine1)
          if (response.data.addressLine2) localStorage.setItem('userAddressLine2', response.data.addressLine2)
          if (response.data.city) localStorage.setItem('userCity', response.data.city)
          if (response.data.state) localStorage.setItem('userState', response.data.state)
          if (response.data.postalCode) localStorage.setItem('userPostalCode', response.data.postalCode)
          if (response.data.country) localStorage.setItem('userCountry', response.data.country)
          if (response.data.createdAt) localStorage.setItem('userCreatedAt', response.data.createdAt)
          
          // Update auth context
          updateUser(response.data)
        }
      } catch (fetchErr) {
        // If server fetch fails, just use cached data from auth context
        console.warn('⚠️ Could not fetch from server, using cached data:', fetchErr.message)
        // Data is already set from user context above, so just continue
      }
      
      clearTimeout(timeoutId)
      console.log('✅ Profile loading complete')
      setLoading(false)
    } catch (err) {
      clearTimeout(timeoutId)
      console.error('❌ Error in fetchUserProfile:', err)
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
    if (e?.preventDefault) {
      e.preventDefault()
    }
    
    console.log('🔄 Save Changes button clicked. isEditing:', isEditing)

    // Only submit if we're in editing mode
    if (!isEditing) {
      console.log('❌ Not in editing mode, skipping save')
      return
    }

    console.log('✏️ In editing mode, proceeding with update')
    
    setError('')
    setSuccess('')

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        age: formData.age ? parseInt(formData.age) : undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        phone: formData.phone || '',
        addressLine1: formData.addressLine1 || '',
        addressLine2: formData.addressLine2 || '',
        city: formData.city || '',
        state: formData.state || '',
        postalCode: formData.postalCode || '',
        country: formData.country || ''
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

      setFormData(prev => ({
        ...prev,
        name: response.data.name || '',
        email: response.data.email || '',
        age: response.data.age || '',
        weight: response.data.weight || '',
        phone: response.data.phone || '',
        addressLine1: response.data.addressLine1 || '',
        addressLine2: response.data.addressLine2 || '',
        city: response.data.city || '',
        state: response.data.state || '',
        postalCode: response.data.postalCode || '',
        country: response.data.country || ''
      }))

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      console.error('Error updating profile:', err)
      const errorMsg = err.response?.data?.message || 'Failed to update profile'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    }
  }

  const handlePasswordChange = async () => {
    setError('')
    setSuccess('')

    if (!formData.currentPassword) {
      const msg = 'Current password is required to change password'
      setError(msg)
      showToast(msg, 'error')
      return
    }

    if (!formData.newPassword || formData.newPassword.length < 6) {
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

    try {
      const response = await axios.put(
        `${API_URL}/users/${user.id}`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        },
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      )

      updateUser(response.data)
      setSuccess('Password updated successfully!')
      showToast('Password updated successfully!', 'success')
      setShowPasswordChange(false)
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }))
    } catch (err) {
      console.error('Error updating password:', err)
      const errorMsg = err.response?.data?.message || 'Failed to update password'
      setError(errorMsg)
      showToast(errorMsg, 'error')
    }
  }

  const handleLogout = () => {
    logout()
    showToast('Logged out successfully', 'info')
    navigate('/login')
  }

  const handleEditClick = () => {
    console.log('✏️ Edit Profile button clicked, enabling edit mode')
    setError('')
    setSuccess('')
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setError('')
    // Reset form to current user data
    setFormData({
      name: user.name || '',
      email: user.email || '',
      age: localStorage.getItem('userAge') || user.age || '',
      weight: localStorage.getItem('userWeight') || user.weight || '',
      phone: localStorage.getItem('userPhone') || user.phone || '',
      addressLine1: localStorage.getItem('userAddressLine1') || user.addressLine1 || '',
      addressLine2: localStorage.getItem('userAddressLine2') || user.addressLine2 || '',
      city: localStorage.getItem('userCity') || user.city || '',
      state: localStorage.getItem('userState') || user.state || '',
      postalCode: localStorage.getItem('userPostalCode') || user.postalCode || '',
      country: localStorage.getItem('userCountry') || user.country || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  if (authLoading) {
    return (
      <div className="profile-container">
        <div className="loading">Initializing authentication...</div>
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

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
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
          <h1>{formData.name || 'User'}</h1>
          <p className="profile-email">{formData.email || 'Loading...'}</p>
          <p className="member-since">
            Member since {memberSince}
          </p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="profile-form">
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

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="addressLine1">Address Line 1</label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Street address"
              />
            </div>

            <div className="form-group">
              <label htmlFor="addressLine2">Address Line 2</label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleChange}
                disabled={!isEditing}
                placeholder="Apt, suite, unit (optional)"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="City"
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="State"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="postalCode">Postal Code</label>
                <input
                  type="text"
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Postal code"
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  disabled={!isEditing}
                  placeholder="Country"
                />
              </div>
            </div>
          </div>

          {showPasswordChange && (
            <div className="form-section">
              <h2>Change Password</h2>
              
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

              <div className="button-group">
                <button
                  type="button"
                  className="btn-save"
                  onClick={handlePasswordChange}
                >
                  Save Password
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    setShowPasswordChange(false)
                    setFormData(prev => ({
                      ...prev,
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    }))
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="button-group">
            {!isEditing ? (
              <>
                <button
                  type="button"
                  className="btn-edit"
                  onClick={handleEditClick}
                >
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="btn-save"
                  onClick={() => setShowPasswordChange(prev => !prev)}
                >
                  {showPasswordChange ? 'Close Password' : 'Change Password'}
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
                <button 
                  type="button" 
                  className="btn-save"
                  onClick={handleSubmit}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
