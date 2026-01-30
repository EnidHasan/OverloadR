import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { useNavigate } from 'react-router-dom'
import '../styles/AdminDashboard.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function AdminDashboard() {
  const { user } = useAuth()
  const { showToast, showConfirm } = useToast()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)

  useEffect(() => {
    if (!user?.isAdmin) {
      showToast('Access denied. Admin only.', 'error')
      navigate('/')
      return
    }
    loadMessages()
  }, [user, navigate])

  const loadMessages = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/contact`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setMessages(response.data)
    } catch (error) {
      console.error('Error loading messages:', error)
      showToast('Failed to load messages', 'error')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (messageId) => {
    try {
      await axios.put(`${API_URL}/contact/${messageId}/read`, {}, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      loadMessages()
    } catch (error) {
      console.error('Error marking as read:', error)
      showToast('Failed to mark as read', 'error')
    }
  }

  const deleteMessage = async (messageId) => {
    showConfirm(
      'Are you sure you want to delete this message?',
      async () => {
        try {
          await axios.delete(`${API_URL}/contact/${messageId}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          })
          showToast('Message deleted', 'success')
          setSelectedMessage(null)
          loadMessages()
        } catch (error) {
          console.error('Error deleting message:', error)
          showToast('Failed to delete message', 'error')
        }
      }
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const unreadCount = messages.filter(m => !m.read).length

  if (loading) {
    return <div className="admin-loading">Loading messages...</div>
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="stat-card">
            <h3>{messages.length}</h3>
            <p>Total Messages</p>
          </div>
          <div className="stat-card unread">
            <h3>{unreadCount}</h3>
            <p>Unread Messages</p>
          </div>
        </div>
      </div>

      <div className="messages-container">
        <div className="messages-list">
          <h2>Contact Messages</h2>
          {messages.length === 0 ? (
            <p className="no-messages">No messages yet</p>
          ) : (
            messages.map((message) => (
              <div
                key={message._id}
                className={`message-item ${!message.read ? 'unread' : ''} ${selectedMessage?._id === message._id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedMessage(message)
                  if (!message.read) {
                    markAsRead(message._id)
                  }
                }}
              >
                <div className="message-header">
                  <h3>{message.name}</h3>
                  {!message.read && <span className="unread-badge">New</span>}
                </div>
                <p className="message-email">{message.email}</p>
                <p className="message-subject"><strong>Subject:</strong> {message.subject}</p>
                <p className="message-date">{formatDate(message.createdAt)}</p>
              </div>
            ))
          )}
        </div>

        {selectedMessage && (
          <div className="message-detail">
            <div className="detail-header">
              <h2>Message Details</h2>
              <button
                className="delete-btn"
                onClick={() => deleteMessage(selectedMessage._id)}
              >
                Delete
              </button>
            </div>
            <div className="detail-body">
              <div className="detail-row">
                <strong>From:</strong> {selectedMessage.name}
              </div>
              <div className="detail-row">
                <strong>Email:</strong> <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
              </div>
              <div className="detail-row">
                <strong>Subject:</strong> {selectedMessage.subject}
              </div>
              <div className="detail-row">
                <strong>Date:</strong> {formatDate(selectedMessage.createdAt)}
              </div>
              <div className="detail-row">
                <strong>Status:</strong> {selectedMessage.read ? 'Read' : 'Unread'}
              </div>
              <div className="detail-message">
                <strong>Message:</strong>
                <p>{selectedMessage.message}</p>
              </div>
              <div className="detail-actions">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="reply-btn"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        )}

        {!selectedMessage && messages.length > 0 && (
          <div className="message-detail placeholder">
            <p>Select a message to view details</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
