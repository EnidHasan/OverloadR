import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import '../styles/ExecutePlan.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function ExecutePlan() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { showToast } = useToast()
  const [plan, setPlan] = useState(null)
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0)
  const [setInputs, setSetInputs] = useState({})
  const [completedSets, setCompletedSets] = useState({})
  const [performanceHistory, setPerformanceHistory] = useState({})
  const [lastSession, setLastSession] = useState(null)
  const [workoutStartTime] = useState(new Date())
  const [showSummary, setShowSummary] = useState(false)
  const [workoutSession, setWorkoutSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && planId) {
      loadPlan()
      loadPerformanceHistory()
      loadLastSession()
    }
  }, [planId, user])

  // Re-initialize inputs when lastSession loads
  useEffect(() => {
    if (plan && lastSession) {
      initializeInputs(plan)
    }
  }, [lastSession])

  const loadPlan = async () => {
    try {
      setLoading(true)
      // First try to load from localStorage (for immediate access)
      const cachedPlan = localStorage.getItem('currentPlan')
      if (cachedPlan) {
        const parsedPlan = JSON.parse(cachedPlan)
        if (parsedPlan._id === planId) {
          setPlan(parsedPlan)
          initializeInputs(parsedPlan)
          setWorkoutSession({
            planId: parsedPlan._id,
            planName: parsedPlan.name,
            exercises: parsedPlan.exercises.map(ex => ({
              name: ex.name,
              sets: []
            })),
            startTime: new Date().toISOString(),
            endTime: null
          })
          setLoading(false)
          return
        }
      }

      // Fetch from MongoDB
      const response = await axios.get(`${API_URL}/plans/${planId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      
      if (response.data) {
        setPlan(response.data)
        initializeInputs(response.data)
        setWorkoutSession({
          planId: response.data._id,
          planName: response.data.name,
          exercises: response.data.exercises.map(ex => ({
            name: ex.name,
            sets: []
          })),
          startTime: new Date().toISOString(),
          endTime: null
        })
        localStorage.setItem('currentPlan', JSON.stringify(response.data))
      }
    } catch (error) {
      console.error('Error loading plan:', error)
      showToast('Failed to load workout plan', 'error')
      navigate('/saved-plans')
    } finally {
      setLoading(false)
    }
  }

  const loadPerformanceHistory = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`${API_URL}/performance/user/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      
      // Convert array to object keyed by exercise name
      const historyMap = {}
      response.data.forEach(perf => {
        historyMap[perf.exerciseName] = perf
      })
      
      setPerformanceHistory(historyMap)
    } catch (error) {
      console.error('Error loading performance history:', error)
    }
  }

  const loadLastSession = async () => {
    if (!user || !planId) return;
    
    try {
      const response = await axios.get(`${API_URL}/performance/last-session/${user.id}/${planId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      
      if (response.data) {
        setLastSession(response.data)
      }
    } catch (error) {
      console.error('Error loading last session:', error)
    }
  }

  const initializeInputs = (plan) => {
    const inputs = {}
    plan.exercises.forEach((exercise, exIdx) => {
      inputs[exIdx] = {}
      
      // Try to find this exercise in the last session
      let lastExercise = null
      if (lastSession && lastSession.exercises) {
        lastExercise = lastSession.exercises.find(ex => ex.name === exercise.name)
      }
      
      exercise.sets.forEach((set, setIdx) => {
        // Use last session data if available, otherwise use plan defaults
        if (lastExercise && lastExercise.sets && lastExercise.sets[setIdx]) {
          inputs[exIdx][setIdx] = { 
            reps: lastExercise.sets[setIdx].reps || set.reps, 
            weight: lastExercise.sets[setIdx].weight || set.weight 
          }
        } else {
          inputs[exIdx][setIdx] = { reps: set.reps, weight: set.weight }
        }
      })
    })
    setSetInputs(inputs)
  }

  const handleSetInput = (setIdx, field, value) => {
    setSetInputs(prev => ({
      ...prev,
      [currentExerciseIdx]: {
        ...prev[currentExerciseIdx],
        [setIdx]: {
          ...prev[currentExerciseIdx][setIdx],
          [field]: field === 'weight' ? parseFloat(value) || 0 : parseInt(value) || 0
        }
      }
    }))
  }

  const markSetComplete = (setIdx) => {
    const key = `${currentExerciseIdx}-${setIdx}`
    setCompletedSets(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const getPreviousBest = (exerciseName) => {
    return performanceHistory[exerciseName] || null
  }

  const getTopPerformances = (exerciseName) => {
    const perf = performanceHistory[exerciseName]
    if (!perf || !perf.topPerformances) return []
    return perf.topPerformances
  }

  const moveToNextExercise = () => {
    if (currentExerciseIdx < plan.exercises.length - 1) {
      setCurrentExerciseIdx(currentExerciseIdx + 1)
    }
  }

  const finishWorkout = async () => {
    try {
      // Prepare workout data
      const exercisesData = plan.exercises.map((exercise, exIdx) => ({
        name: exercise.name,
        group: exercise.group,
        muscleDetail: exercise.muscleDetail,
        sets: Object.entries(setInputs[exIdx] || {}).map(([_, set]) => ({
          reps: set.reps,
          weight: set.weight
        })).filter(set => set.weight > 0 || set.reps > 0) // Only include completed sets
      })).filter(ex => ex.sets.length > 0) // Only include exercises with sets

      if (exercisesData.length === 0) {
        showToast('No exercises completed', 'warning')
        return
      }

      // Save workout to MongoDB
      await axios.post(`${API_URL}/performance/workout`, {
        userId: user.id,
        planId: plan._id,
        planName: plan.name,
        exercises: exercisesData
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      })

      showToast('Workout saved successfully!', 'success')
      setShowSummary(true)
      
      // Reload performance history to show updated PRs
      await loadPerformanceHistory()
    } catch (error) {
      console.error('Error saving workout:', error)
      showToast('Failed to save workout', 'error')
    }
  }

  if (loading) {
    return (
      <div className="execute-plan">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading workout plan...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="execute-plan">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <p>Workout plan not found</p>
          <button onClick={() => navigate('/saved-plans')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Back to Plans
          </button>
        </div>
      </div>
    )
  }

  const currentExercise = plan.exercises[currentExerciseIdx]
  const topPerformances = getTopPerformances(currentExercise.name)
  const currentInputs = setInputs[currentExerciseIdx] || {}

  if (showSummary) {
    return (
      <div className="execute-plan">
        <div className="workout-summary">
          <h1>Workout Complete!</h1>
          <p className="summary-plan-name">Plan: {plan.name}</p>
          <p className="summary-time">
            Duration: {Math.round((new Date() - workoutStartTime) / 60000)} minutes
          </p>

          <div className="summary-exercises">
            <h2>Exercises Completed</h2>
            {plan.exercises.map((exercise, idx) => (
              <div key={idx} className="summary-exercise">
                <h3>{exercise.name}</h3>
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th>Set</th>
                      <th>Reps</th>
                      <th>Weight (lbs)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(setInputs[idx] && Object.values(setInputs[idx])).map((set, setIdx) => (
                      <tr key={setIdx}>
                        <td>{setIdx + 1}</td>
                        <td>{set.reps}</td>
                        <td>{set.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>

          <div className="summary-actions">
            <button onClick={() => navigate('/saved-plans')} className="back-btn">
              Back to Plans
            </button>
            <button onClick={() => navigate('/plan')} className="new-plan-btn">
              Create New Plan
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="execute-plan">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <p>Loading workout plan...</p>
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="execute-plan">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
          <p>Workout plan not found</p>
          <button onClick={() => navigate('/saved-plans')} style={{ marginTop: '1rem', padding: '0.5rem 1rem' }}>
            Back to Plans
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="execute-plan">
      <header className="workout-header">
        <div>
          <h1>{plan.name}</h1>
          <p className="exercise-progress">Exercise {currentExerciseIdx + 1} of {plan.exercises.length}</p>
        </div>
        <button onClick={() => navigate('/saved-plans')} className="close-btn">✕</button>
      </header>

      <main className="workout-main">
        <section className="current-exercise">
          <div className="exercise-title">
            <h2>{currentExercise.name}</h2>
            <span className="muscle-group">{currentExercise.group} • {currentExercise.muscleDetail}</span>
          </div>

          {topPerformances.length > 0 && (
            <div className="previous-performance">
              <h3>🏆 Personal Records</h3>
              <div className="pr-records">
                {topPerformances.map((perf, idx) => (
                  <div key={idx} className={`pr-record ${idx === 0 ? 'first-pr' : 'second-pr'}`}>
                    <div className="pr-rank">
                      {idx === 0 ? '1st PR' : '2nd PR'}
                    </div>
                    <div className="pr-stats">
                      <div className="pr-stat">
                        <span className="pr-stat-label">Weight</span>
                        <span className="pr-stat-value">{perf.weight} lbs</span>
                      </div>
                      <div className="pr-stat">
                        <span className="pr-stat-label">Reps</span>
                        <span className="pr-stat-value">{perf.reps}</span>
                      </div>
                    </div>
                    <div className="pr-date">
                      {new Date(perf.date).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {lastSession && (() => {
            const lastExercise = lastSession.exercises.find(ex => ex.name === currentExercise.name)
            return lastExercise && (
              <div className="last-workout-info">
                <h3>📋 Last Workout ({new Date(lastSession.completedAt).toLocaleDateString()})</h3>
                <div className="last-workout-sets">
                  {lastExercise.sets.map((set, idx) => (
                    <div key={idx} className="last-set">
                      <span className="set-number">Set {idx + 1}:</span>
                      <span className="set-data">{set.weight} lbs × {set.reps} reps</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}

          <div className="sets-input">
            <h3>Input Your Performance</h3>
            <table className="sets-table">
              <thead>
                <tr>
                  <th>Set</th>
                  <th>Reps</th>
                  <th>Weight (lbs)</th>
                  <th>Complete</th>
                </tr>
              </thead>
              <tbody>
                {currentExercise.sets.map((set, setIdx) => {
                  const isComplete = completedSets[`${currentExerciseIdx}-${setIdx}`]
                  return (
                    <tr key={setIdx} className={isComplete ? 'completed' : ''}>
                      <td className="set-num">{setIdx + 1}</td>
                      <td>
                        <input
                          type="number"
                          min="1"
                          value={currentInputs[setIdx]?.reps || ''}
                          onChange={(e) => handleSetInput(setIdx, 'reps', e.target.value)}
                          placeholder="0"
                          className="input-field"
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          min="0"
                          step="2.5"
                          value={currentInputs[setIdx]?.weight || ''}
                          onChange={(e) => handleSetInput(setIdx, 'weight', e.target.value)}
                          placeholder="0"
                          className="input-field"
                        />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          checked={isComplete}
                          onChange={() => markSetComplete(setIdx)}
                          className="complete-checkbox"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="workout-progress">
          <h3>Exercises</h3>
          <ul className="exercises-list">
            {plan.exercises.map((exercise, idx) => (
              <li
                key={idx}
                className={idx === currentExerciseIdx ? 'active' : ''}
                onClick={() => {
                  savePreviousBest()
                  setCurrentExerciseIdx(idx)
                }}
              >
                <span className="exercise-name">{exercise.name}</span>
                <span className="exercise-check">
                  {completedSets[`${idx}-0`] ? '✓' : ''}
                </span>
              </li>
            ))}
          </ul>

          <div className="progress-buttons">
            <button
              onClick={moveToNextExercise}
              disabled={currentExerciseIdx === plan.exercises.length - 1}
              className="next-btn"
            >
              Next Exercise
            </button>
            <button onClick={finishWorkout} className="finish-btn">
              Finish Workout
            </button>
          </div>
        </aside>
      </main>
    </div>
  )
}

export default ExecutePlan
