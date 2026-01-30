import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import '../styles/Workouts.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function Workouts() {
  const { user } = useAuth()
  const [groupedWorkouts, setGroupedWorkouts] = useState([])
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [exerciseHistory, setExerciseHistory] = useState([])
  const [performanceData, setPerformanceData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchGroupedWorkouts()
    }
  }, [user])

  const fetchGroupedWorkouts = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/workouts/grouped/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setGroupedWorkouts(response.data)
    } catch (error) {
      console.error('Error fetching grouped workouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExerciseClick = async (exerciseName) => {
    setSelectedExercise(exerciseName)
    
    try {
      // Fetch last 5 workouts for this exercise
      const historyResponse = await axios.get(
        `${API_URL}/workouts/history/${user.id}/${encodeURIComponent(exerciseName)}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      setExerciseHistory(historyResponse.data)

      // Fetch performance data (top 2 PRs)
      const perfResponse = await axios.get(
        `${API_URL}/performance/${user.id}/${encodeURIComponent(exerciseName)}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      setPerformanceData(perfResponse.data)
    } catch (error) {
      console.error('Error fetching exercise details:', error)
    }
  }

  const handleBackToList = () => {
    setSelectedExercise(null)
    setExerciseHistory([])
    setPerformanceData(null)
  }

  if (loading) {
    return (
      <div className="workouts-container">
        <p>Loading workouts...</p>
      </div>
    )
  }

  // Detail View
  if (selectedExercise) {
    return (
      <div className="workouts-container">
        <div className="exercise-detail">
          <button onClick={handleBackToList} className="back-button">
            ← Back to Workouts
          </button>

          <div className="exercise-detail-header">
            <h1>{selectedExercise}</h1>
          </div>

          {/* Top 2 PRs Section */}
          {performanceData && performanceData.topPerformances && performanceData.topPerformances.length > 0 && (
            <div className="pr-section">
              <h2>🏆 Personal Records</h2>
              <div className="pr-cards">
                {performanceData.topPerformances.map((pr, idx) => (
                  <div key={idx} className={`pr-card ${idx === 0 ? 'first-place' : 'second-place'}`}>
                    <div className="pr-rank">{idx === 0 ? '🥇 1st' : '🥈 2nd'} PR</div>
                    <div className="pr-stats">
                      <div className="pr-stat">
                        <span className="pr-label">Weight</span>
                        <span className="pr-value">{pr.weight} lbs</span>
                      </div>
                      <div className="pr-stat">
                        <span className="pr-label">Reps</span>
                        <span className="pr-value">{pr.reps}</span>
                      </div>
                    </div>
                    <div className="pr-date">
                      {new Date(pr.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last 5 Workouts Section */}
          <div className="history-section">
            <h2>📋 Last 5 Workouts</h2>
            {exerciseHistory.length === 0 ? (
              <p className="no-history">No workout history for this exercise yet.</p>
            ) : (
              <div className="history-list">
                {exerciseHistory.map((workout, idx) => (
                  <div key={workout._id} className="history-card">
                    <div className="history-header">
                      <span className="history-number">#{exerciseHistory.length - idx}</span>
                      <span className="history-date">
                        {new Date(workout.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="history-sets">
                      {workout.allSets && workout.allSets.length > 0 && (
                        <table className="sets-table">
                          <thead>
                            <tr>
                              <th>Set</th>
                              <th>Weight (lbs)</th>
                              <th>Reps</th>
                            </tr>
                          </thead>
                          <tbody>
                            {workout.allSets.map((set, setIdx) => (
                              <tr key={setIdx}>
                                <td className="set-num">{setIdx + 1}</td>
                                <td className="set-weight">{set.weight}</td>
                                <td className="set-reps">{set.reps}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                    {workout.notes && (
                      <div className="history-notes">
                        <strong>Notes:</strong> {workout.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // List View
  return (
    <div className="workouts-container">
      <div className="workouts-header">
        <h1>Workout History</h1>
        <p>Click on any exercise to view performance history</p>
      </div>

      {groupedWorkouts.length === 0 ? (
        <div className="no-workouts">
          <p>No workouts logged yet.</p>
          <p>Complete a workout plan to start tracking your progress!</p>
        </div>
      ) : (
        <div className="exercise-grid">
          {groupedWorkouts.map((workout) => (
            <div
              key={workout._id}
              className="exercise-card"
              onClick={() => handleExerciseClick(workout._id)}
            >
              <div className="exercise-card-header">
                <h3>{workout._id}</h3>
                <span className="exercise-group">{workout.group}</span>
              </div>
              
              <div className="exercise-card-stats">
                <div className="stat-item">
                  <span className="stat-label">Total Workouts</span>
                  <span className="stat-value">{workout.totalWorkouts}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Last Workout</span>
                  <span className="stat-value">
                    {new Date(workout.lastWorkout).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="exercise-card-footer">
                <span>View Details →</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Workouts
