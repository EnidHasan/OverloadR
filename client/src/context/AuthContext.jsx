import React, { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Check session validity every minute
  useEffect(() => {
    const interval = setInterval(() => {
      checkAuth()
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    const loginTime = localStorage.getItem('loginTime')
    const userId = localStorage.getItem('userId')
    const userName = localStorage.getItem('userName')
    const userEmail = localStorage.getItem('userEmail')
    const userIsAdmin = localStorage.getItem('userIsAdmin') === 'true'
    const userAge = localStorage.getItem('userAge')
    const userWeight = localStorage.getItem('userWeight')
    const userPhone = localStorage.getItem('userPhone')
    const userAddressLine1 = localStorage.getItem('userAddressLine1')
    const userAddressLine2 = localStorage.getItem('userAddressLine2')
    const userCity = localStorage.getItem('userCity')
    const userState = localStorage.getItem('userState')
    const userPostalCode = localStorage.getItem('userPostalCode')
    const userCountry = localStorage.getItem('userCountry')
    const userCreatedAt = localStorage.getItem('userCreatedAt')

    if (!token || !loginTime) {
      setUser(null)
      setLoading(false)
      return
    }

    // Check if 14 days have passed
    const fourteenDaysInMs = 14 * 24 * 60 * 60 * 1000
    const currentTime = new Date().getTime()
    const elapsedTime = currentTime - parseInt(loginTime)

    if (elapsedTime > fourteenDaysInMs) {
      // Session expired
      logout()
      setLoading(false)
      return
    }

    // Session is still valid
    setUser({
      id: userId,
      name: userName,
      email: userEmail,
      isAdmin: userIsAdmin,
      age: userAge ? parseInt(userAge) : undefined,
      weight: userWeight ? parseFloat(userWeight) : undefined,
      phone: userPhone || undefined,
      addressLine1: userAddressLine1 || undefined,
      addressLine2: userAddressLine2 || undefined,
      city: userCity || undefined,
      state: userState || undefined,
      postalCode: userPostalCode || undefined,
      country: userCountry || undefined,
      createdAt: userCreatedAt,
      token: token
    })
    setLoading(false)
  }

  const login = (userData) => {
    const loginTime = new Date().getTime().toString()
    
    localStorage.setItem('token', userData.token)
    localStorage.setItem('userId', userData._id)
    localStorage.setItem('userName', userData.name)
    localStorage.setItem('userEmail', userData.email)
    localStorage.setItem('userIsAdmin', userData.isAdmin || false)
    localStorage.setItem('loginTime', loginTime)
    
    // Store additional user data if available
    if (userData.age) localStorage.setItem('userAge', userData.age.toString())
    if (userData.weight) localStorage.setItem('userWeight', userData.weight.toString())
    if (userData.phone) localStorage.setItem('userPhone', userData.phone)
    if (userData.addressLine1) localStorage.setItem('userAddressLine1', userData.addressLine1)
    if (userData.addressLine2) localStorage.setItem('userAddressLine2', userData.addressLine2)
    if (userData.city) localStorage.setItem('userCity', userData.city)
    if (userData.state) localStorage.setItem('userState', userData.state)
    if (userData.postalCode) localStorage.setItem('userPostalCode', userData.postalCode)
    if (userData.country) localStorage.setItem('userCountry', userData.country)
    if (userData.createdAt) localStorage.setItem('userCreatedAt', userData.createdAt)

    setUser({
      id: userData._id,
      name: userData.name,
      email: userData.email,
      isAdmin: userData.isAdmin || false,
      age: userData.age,
      weight: userData.weight,
      phone: userData.phone,
      addressLine1: userData.addressLine1,
      addressLine2: userData.addressLine2,
      city: userData.city,
      state: userData.state,
      postalCode: userData.postalCode,
      country: userData.country,
      createdAt: userData.createdAt,
      token: userData.token
    })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('userName')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userIsAdmin')
    localStorage.removeItem('loginTime')
    localStorage.removeItem('userAge')
    localStorage.removeItem('userWeight')
    localStorage.removeItem('userPhone')
    localStorage.removeItem('userAddressLine1')
    localStorage.removeItem('userAddressLine2')
    localStorage.removeItem('userCity')
    localStorage.removeItem('userState')
    localStorage.removeItem('userPostalCode')
    localStorage.removeItem('userCountry')
    localStorage.removeItem('userCreatedAt')
    setUser(null)
  }

  const updateUser = (updatedData) => {
    // Update localStorage
    if (updatedData.name) {
      localStorage.setItem('userName', updatedData.name)
    }
    if (updatedData.email) {
      localStorage.setItem('userEmail', updatedData.email)
    }
    if (updatedData.age !== undefined) {
      localStorage.setItem('userAge', updatedData.age.toString())
    }
    if (updatedData.weight !== undefined) {
      localStorage.setItem('userWeight', updatedData.weight.toString())
    }
    if (updatedData.phone !== undefined) {
      localStorage.setItem('userPhone', updatedData.phone || '')
    }
    if (updatedData.addressLine1 !== undefined) {
      localStorage.setItem('userAddressLine1', updatedData.addressLine1 || '')
    }
    if (updatedData.addressLine2 !== undefined) {
      localStorage.setItem('userAddressLine2', updatedData.addressLine2 || '')
    }
    if (updatedData.city !== undefined) {
      localStorage.setItem('userCity', updatedData.city || '')
    }
    if (updatedData.state !== undefined) {
      localStorage.setItem('userState', updatedData.state || '')
    }
    if (updatedData.postalCode !== undefined) {
      localStorage.setItem('userPostalCode', updatedData.postalCode || '')
    }
    if (updatedData.country !== undefined) {
      localStorage.setItem('userCountry', updatedData.country || '')
    }

    // Update user state - preserve existing fields like id, token, isAdmin
    setUser(prev => ({
      ...prev,
      name: updatedData.name || prev?.name,
      email: updatedData.email || prev?.email,
      age: updatedData.age !== undefined ? updatedData.age : prev?.age,
      weight: updatedData.weight !== undefined ? updatedData.weight : prev?.weight,
      phone: updatedData.phone !== undefined ? updatedData.phone : prev?.phone,
      addressLine1: updatedData.addressLine1 !== undefined ? updatedData.addressLine1 : prev?.addressLine1,
      addressLine2: updatedData.addressLine2 !== undefined ? updatedData.addressLine2 : prev?.addressLine2,
      city: updatedData.city !== undefined ? updatedData.city : prev?.city,
      state: updatedData.state !== undefined ? updatedData.state : prev?.state,
      postalCode: updatedData.postalCode !== undefined ? updatedData.postalCode : prev?.postalCode,
      country: updatedData.country !== undefined ? updatedData.country : prev?.country,
    }))
  }

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
