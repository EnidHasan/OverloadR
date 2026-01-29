import React, { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { useToast } from '../components/Toast'
import '../styles/Workouts.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const EXERCISES = [
  { id: 'bench-press', name: 'Bench Press', group: 'Chest', muscleDetail: 'Pectoralis major' },
  { id: 'incline-bench-press', name: 'Incline Bench Press', group: 'Chest', muscleDetail: 'Upper chest' },
  { id: 'decline-bench-press', name: 'Decline Bench Press', group: 'Chest', muscleDetail: 'Lower chest' },
  { id: 'dumbbell-press', name: 'Dumbbell Press', group: 'Chest', muscleDetail: 'Chest + stabilizers' },
  { id: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', group: 'Chest', muscleDetail: 'Upper chest' },
  { id: 'machine-chest-press', name: 'Machine Chest Press', group: 'Chest', muscleDetail: 'Chest focus' },
  { id: 'push-up', name: 'Push-up', group: 'Chest', muscleDetail: 'Chest + triceps' },
  { id: 'wide-push-up', name: 'Wide Push-up', group: 'Chest', muscleDetail: 'Outer chest' },
  { id: 'chest-dip', name: 'Chest Dip', group: 'Chest', muscleDetail: 'Lower chest' },
  { id: 'cable-fly', name: 'Cable Fly', group: 'Chest', muscleDetail: 'Chest squeeze' },
  { id: 'pec-deck', name: 'Pec Deck', group: 'Chest', muscleDetail: 'Chest isolation' },
  { id: 'dumbbell-fly', name: 'Dumbbell Fly', group: 'Chest', muscleDetail: 'Chest stretch' },
  { id: 'incline-fly', name: 'Incline Fly', group: 'Chest', muscleDetail: 'Upper chest' },
  { id: 'decline-fly', name: 'Decline Fly', group: 'Chest', muscleDetail: 'Lower chest' },
  { id: 'landmine-press', name: 'Landmine Press', group: 'Chest', muscleDetail: 'Upper chest' },
  { id: 'squeeze-press', name: 'Squeeze Press', group: 'Chest', muscleDetail: 'Inner chest' },
  { id: 'hex-press', name: 'Hex Press', group: 'Chest', muscleDetail: 'Inner chest' },
  { id: 'pullover', name: 'Dumbbell Pullover', group: 'Chest', muscleDetail: 'Chest + lats' },
  { id: 'smith-bench', name: 'Smith Bench Press', group: 'Chest', muscleDetail: 'Chest focus' },
  { id: 'floor-press', name: 'Floor Press', group: 'Chest', muscleDetail: 'Mid chest' },
  { id: 'pull-up', name: 'Pull-up', group: 'Back', muscleDetail: 'Lats' },
  { id: 'chin-up', name: 'Chin-up', group: 'Back', muscleDetail: 'Lats + biceps' },
  { id: 'barbell-curl', name: 'Barbell Curl', group: 'Biceps', muscleDetail: 'Biceps brachii' },
  { id: 'hammer-curl', name: 'Hammer Curl', group: 'Biceps', muscleDetail: 'Brachialis' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', group: 'Triceps', muscleDetail: 'Lateral head' },
  { id: 'squat', name: 'Squat', group: 'Legs', muscleDetail: 'Quads' },
  { id: 'hip-thrust', name: 'Hip Thrust', group: 'Glutes', muscleDetail: 'Glute max' },
  { id: 'plank', name: 'Plank', group: 'Core', muscleDetail: 'Deep core' }
]

function Workouts() {
  const { showToast, showConfirm } = useToast()
  const [workouts, setWorkouts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [sets, setSets] = useState([])
  const [workoutNotes, setWorkoutNotes] = useState('')
  const [workoutDuration, setWorkoutDuration] = useState('')
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    fetchWorkouts()
  }, [])

  const fetchWorkouts = async () => {
    try {
      const userId = localStorage.getItem('userId')
      if (!userId) return
      
      const response = await axios.get(`${API_URL}/workouts/${userId}`)
      setWorkouts(response.data)
    } catch (error) {
      console.error('Error fetching workouts:', error)
    }
  }

  const filteredExercises = useMemo(() => {
    if (!searchTerm.trim()) return []
    const search = searchTerm.toLowerCase()
    return EXERCISES.filter(ex =>
      ex.name.toLowerCase().includes(search) ||
      ex.group.toLowerCase().includes(search) ||
      ex.muscleDetail.toLowerCase().includes(search)
    )
  }, [searchTerm])

  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise)
    setSets([{ reps: '', weight: '' }])
    setSearchTerm('')
    setShowResults(false)
  }

  const handleSetChange = (index, field, value) => {
    const updatedSets = [...sets]
    updatedSets[index] = {
      ...updatedSets[index],
      [field]: field === 'reps' ? parseInt(value) || '' : parseFloat(value) || ''
    }
    setSets(updatedSets)
  }

  const addSet = () => {
    setSets([...sets, { reps: '', weight: '' }])
  }

  const removeSet = (index) => {
    if (sets.length > 1) {
      setSets(sets.filter((_, i) => i !== index))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedExercise) {
      showToast('Please select an exercise', 'warning')
      return
    }

    if (sets.some(set => !set.reps || set.weight === '')) {
      showToast('Please fill in reps and weight for all sets', 'warning')
      return
    }

    try {
      const userId = localStorage.getItem('userId')
      if (!userId) {
        showToast('Please log in to save workouts', 'warning')
        return
      }

      const workoutData = {
        userId,
        exerciseName: selectedExercise.name,
        group: selectedExercise.group,
        muscleDetail: selectedExercise.muscleDetail,
        sets: sets.length,
        allSets: sets,
        duration: workoutDuration || 0,
        notes: workoutNotes
      }

      await axios.post(`${API_URL}/workouts`, workoutData)

      setSelectedExercise(null)
      setSets([])
      setWorkoutNotes('')
      setWorkoutDuration('')
      setSearchTerm('')

      fetchWorkouts()
      showToast('Workout logged successfully!', 'success')
    } catch (error) {
      console.error('Error logging workout:', error)
      showToast('Error logging workout', 'error')
    }
  }

  const handleDelete = async (id) => {
    showConfirm(
      'Delete this workout?',
      async () => {
        try {
          await axios.delete(`${API_URL}/workouts/${id}`)
          fetchWorkouts()
          showToast('Workout deleted', 'info')
        } catch (error) {
          console.error('Error deleting workout:', error)
          showToast('Error deleting workout', 'error')
        }
      }
    )
  }

  return (
    <main className="workouts-container">
      <div className="workouts-header">
        <h1>Log Workout</h1>
        <p>Track your exercises with sets, reps, and weight</p>
      </div>

      <div className="workouts-content">
        <section className="log-section">
          <form onSubmit={handleSubmit} className="workout-form">
            <div className="form-group">
              <label htmlFor="exercise-search">Select Exercise</label>
              <div className="search-container">
                <input
                  id="exercise-search"
                  type="text"
                  placeholder="Search exercises (e.g., Bench Press, Chest, Biceps)..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setShowResults(e.target.value.trim().length > 0)
                  }}
                  className="search-input"
                />
                {showResults && filteredExercises.length > 0 && (
                  <div className="search-results">
                    {filteredExercises.map(exercise => (
                      <div
                        key={exercise.id}
                        className="result-item"
                        onClick={() => handleSelectExercise(exercise)}
                      >
                        <div className="result-name">{exercise.name}</div>
                        <div className="result-meta">
                          {exercise.group} • {exercise.muscleDetail}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedExercise && (
                <div className="selected-exercise-display">
                  <div className="exercise-selected">
                    <span className="exercise-name">{selectedExercise.name}</span>
                    <span className="exercise-group">{selectedExercise.group}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedExercise(null)}
                      className="clear-exercise-btn"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {selectedExercise && (
              <div className="sets-section">
                <div className="sets-header">
                  <h3>Sets Details</h3>
                  <span className="set-count">{sets.length} {sets.length === 1 ? 'Set' : 'Sets'}</span>
                </div>

                <div className="sets-list">
                  {sets.map((set, index) => (
                    <div key={index} className="set-input">
                      <div className="set-number">{index + 1}</div>
                      <div className="set-fields">
                        <div className="field">
                          <label>Reps</label>
                          <input
                            type="number"
                            min="1"
                            value={set.reps}
                            onChange={(e) => handleSetChange(index, 'reps', e.target.value)}
                            placeholder="0"
                            className="reps-input"
                            required
                          />
                        </div>
                        <div className="field">
                          <label>Weight (lbs)</label>
                          <input
                            type="number"
                            min="0"
                            step="2.5"
                            value={set.weight}
                            onChange={(e) => handleSetChange(index, 'weight', e.target.value)}
                            placeholder="0"
                            className="weight-input"
                            required
                          />
                        </div>
                        {sets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSet(index)}
                            className="remove-set-btn"
                            title="Remove this set"
                          >
                            −
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" onClick={addSet} className="add-set-btn">
                  + Add Set
                </button>
              </div>
            )}

            {selectedExercise && (
              <div className="additional-fields">
                <div className="form-group">
                  <label htmlFor="duration">Duration (minutes)</label>
                  <input
                    id="duration"
                    type="number"
                    min="0"
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(e.target.value)}
                    placeholder="Optional"
                    className="input-field"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    value={workoutNotes}
                    onChange={(e) => setWorkoutNotes(e.target.value)}
                    placeholder="Add any notes about this workout..."
                    rows="3"
                    className="textarea-field"
                  ></textarea>
                </div>

                <button type="submit" className="submit-btn">
                  Log Workout
                </button>
              </div>
            )}
          </form>
        </section>

        <section className="history-section">
          <h2>Workout History</h2>

          {workouts.length === 0 ? (
            <p className="no-workouts">No workouts logged yet. Start by selecting an exercise above!</p>
          ) : (
            <div className="workouts-list">
              {workouts.map(workout => (
                <div key={workout._id} className="workout-card">
                  <div className="workout-header">
                    <div>
                      <h3>{workout.exerciseName}</h3>
                      <p className="workout-meta">
                        {workout.group} • {workout.muscleDetail}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDelete(workout._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="workout-details">
                    <p className="workout-date">
                      {new Date(workout.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>

                    <div className="sets-summary">
                      <span className="badge">{workout.sets} Sets</span>
                      {workout.duration && <span className="badge">{workout.duration} min</span>}
                    </div>

                    {workout.allSets && workout.allSets.length > 0 && (
                      <table className="sets-table">
                        <thead>
                          <tr>
                            <th>Set</th>
                            <th>Reps</th>
                            <th>Weight (lbs)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workout.allSets.map((set, idx) => (
                            <tr key={idx}>
                              <td className="set-num">{idx + 1}</td>
                              <td>{set.reps}</td>
                              <td>{set.weight}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {workout.notes && (
                      <p className="workout-notes">
                        <strong>Notes:</strong> {workout.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default Workouts
