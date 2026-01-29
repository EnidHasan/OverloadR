import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import '../styles/ExecutePlan.css'

function ExecutePlan() {
  const { planId } = useParams()
  const navigate = useNavigate()
  const [plan, setPlan] = useState(null)
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0)
  const [setInputs, setSetInputs] = useState({})
  const [completedSets, setCompletedSets] = useState({})
  const [performanceHistory, setPerformanceHistory] = useState({})
  const [workoutStartTime] = useState(new Date())
  const [showSummary, setShowSummary] = useState(false)
  const [workoutSession, setWorkoutSession] = useState(null)

  useEffect(() => {
    loadPlan()
    loadPerformanceHistory()
  }, [planId])

  const loadPlan = () => {
    const plans = JSON.parse(localStorage.getItem('workoutPlans') || '[]')
    const foundPlan = plans.find(p => p.id === parseInt(planId))
    if (foundPlan) {
      setPlan(foundPlan)
      initializeInputs(foundPlan)
      setWorkoutSession({
        planId: foundPlan.id,
        planName: foundPlan.name,
        exercises: foundPlan.exercises.map(ex => ({
          id: ex.id,
          name: ex.name,
          sets: []
        })),
        startTime: new Date().toISOString(),
        endTime: null
      })
    }
  }

  const loadPerformanceHistory = () => {
    const history = JSON.parse(localStorage.getItem('performanceHistory') || '{}')
    setPerformanceHistory(history)
  }

  const initializeInputs = (plan) => {
    const inputs = {}
    plan.exercises.forEach((exercise, exIdx) => {
      inputs[exIdx] = {}
      exercise.sets.forEach((set, setIdx) => {
        inputs[exIdx][setIdx] = { reps: set.reps, weight: set.weight }
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

  const getPreviousBest = (exerciseId) => {
    return performanceHistory[exerciseId] || null
  }

  const moveToNextExercise = () => {
    if (currentExerciseIdx < plan.exercises.length - 1) {
      setCurrentExerciseIdx(currentExerciseIdx + 1)
    }
  }

  const savePreviousBest = () => {
    const currentExercise = plan.exercises[currentExerciseIdx]
    const exerciseKey = currentExercise.id

    const currentBest = getPreviousBest(exerciseKey) || {
      exerciseName: currentExercise.name,
      bestSet: { reps: 0, weight: 0 }
    }

    const inputs = setInputs[currentExerciseIdx] || {}
    let maxWeight = currentBest.bestSet.weight
    let maxReps = currentBest.bestSet.reps

    Object.values(inputs).forEach(set => {
      if (set.weight > maxWeight || (set.weight === maxWeight && set.reps > maxReps)) {
        maxWeight = set.weight
        maxReps = set.reps
      }
    })

    const updated = {
      ...performanceHistory,
      [exerciseKey]: {
        exerciseName: currentExercise.name,
        bestSet: { reps: maxReps, weight: maxWeight },
        lastPerformed: new Date().toISOString(),
        allSets: Object.values(inputs)
      }
    }
    localStorage.setItem('performanceHistory', JSON.stringify(updated))
    setPerformanceHistory(updated)
  }

  const finishWorkout = () => {
    // Save best performance for current exercise
    savePreviousBest()

    // Save the completed workout session
    const completedSession = {
      ...workoutSession,
      endTime: new Date().toISOString(),
      exercises: plan.exercises.map((exercise, exIdx) => ({
        id: exercise.id,
        name: exercise.name,
        group: exercise.group,
        sets: Object.entries(setInputs[exIdx] || {}).map(([_, set]) => ({
          reps: set.reps,
          weight: set.weight
        }))
      }))
    }

    const sessions = JSON.parse(localStorage.getItem('workoutSessions') || '[]')
    sessions.push(completedSession)
    localStorage.setItem('workoutSessions', JSON.stringify(sessions))

    setShowSummary(true)
  }

  if (!plan) {
    return <div className="container"><p>Loading...</p></div>
  }

  const currentExercise = plan.exercises[currentExerciseIdx]
  const previousBest = getPreviousBest(currentExercise.id)
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

          {previousBest && (
            <div className="previous-performance">
              <h3>Previous Best</h3>
              <div className="best-stats">
                <div className="stat">
                  <span className="label">Max Weight</span>
                  <span className="value">{previousBest.bestSet.weight} lbs</span>
                </div>
                <div className="stat">
                  <span className="label">Reps at Max</span>
                  <span className="value">{previousBest.bestSet.reps}</span>
                </div>
                <div className="stat">
                  <span className="label">Last Performed</span>
                  <span className="value">
                    {new Date(previousBest.lastPerformed).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          )}

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
