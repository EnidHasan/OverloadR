import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import { DEFAULT_WORKOUT_PLANS } from '../data/defaultWorkoutPlans'
import '../styles/SavedPlans.css'

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
  { id: 'pull-up', name: 'Pull-up', group: 'Back', muscleDetail: 'Lats' },
  { id: 'chin-up', name: 'Chin-up', group: 'Back', muscleDetail: 'Lats + biceps' },
  { id: 'lat-pulldown', name: 'Lat Pulldown', group: 'Back', muscleDetail: 'Lats' },
  { id: 'barbell-row', name: 'Barbell Row', group: 'Back', muscleDetail: 'Mid-back' },
  { id: 'overhead-press', name: 'Overhead Press', group: 'Shoulders', muscleDetail: 'Deltoids' },
  { id: 'lateral-raise', name: 'Lateral Raise', group: 'Shoulders', muscleDetail: 'Side delts' },
  { id: 'barbell-curl', name: 'Barbell Curl', group: 'Biceps', muscleDetail: 'Biceps brachii' },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', group: 'Biceps', muscleDetail: 'Biceps' },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', group: 'Triceps', muscleDetail: 'Lateral head' },
  { id: 'skull-crusher', name: 'Skull Crusher', group: 'Triceps', muscleDetail: 'Long head' },
  { id: 'squat', name: 'Squat', group: 'Legs', muscleDetail: 'Quads' },
  { id: 'leg-press', name: 'Leg Press', group: 'Legs', muscleDetail: 'Quads' },
  { id: 'hip-thrust', name: 'Hip Thrust', group: 'Glutes', muscleDetail: 'Glutes' }
]

const GROUP_ORDER = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core']

function SavedPlans() {
  const navigate = useNavigate()
  const { showToast, showConfirm } = useToast()
  const { user } = useAuth()
  const [plans, setPlans] = useState([])
  const [expandedPlanId, setExpandedPlanId] = useState(null)
  const [editingPlanId, setEditingPlanId] = useState(null)
  const [editingPlanName, setEditingPlanName] = useState(null)
  const [editingPlanNameValue, setEditingPlanNameValue] = useState('')
  const [loading, setLoading] = useState(true)
  const [addingExercisePlanId, setAddingExercisePlanId] = useState(null)
  const [selectedExerciseIds, setSelectedExerciseIds] = useState([])
  const [exerciseSearchTerm, setExerciseSearchTerm] = useState('')

  useEffect(() => {
    if (user) {
      loadPlansFromDB()
    }
  }, [user])

  const loadPlansFromDB = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/plans/user/${user.id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      
      if (response.data && response.data.length > 0) {
        setPlans(response.data)
      } else {
        // Create default plans in MongoDB if no plans exist
        await createDefaultPlans()
      }
    } catch (error) {
      console.error('Error loading plans:', error)
      showToast('Failed to load workout plans', 'error')
    } finally {
      setLoading(false)
    }
  }

  const createDefaultPlans = async () => {
    try {
      const createdPlans = []
      
      for (const defaultPlan of DEFAULT_WORKOUT_PLANS) {
        const planData = {
          userId: user.id,
          name: defaultPlan.name,
          exercises: defaultPlan.exercises
        }
        
        const response = await axios.post(`${API_URL}/plans`, planData, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        
        createdPlans.push(response.data)
      }
      
      setPlans(createdPlans)
      showToast('Default workout plans loaded!', 'success')
    } catch (error) {
      console.error('Error creating default plans:', error)
      showToast('Failed to create default plans', 'error')
    }
  }

  const deletePlan = (planId) => {
    if (!planId) {
      return
    }
    
    if (!user || !user.token) {
      showToast('Please log in to delete plans', 'error')
      return
    }
    
    showConfirm(
      'Delete this plan? This action cannot be undone.',
      async () => {
        try {
          const url = `${API_URL}/plans/${planId}`
          
          const response = await axios.delete(url, {
            headers: { 
              'Authorization': `Bearer ${user.token}`,
              'Content-Type': 'application/json'
            }
          })
          
          // Remove from UI
          setPlans(prevPlans => prevPlans.filter(p => p._id !== planId))
          setExpandedPlanId(null)
          setEditingPlanId(null)
          
          showToast('Plan deleted successfully', 'success')
        } catch (error) {
          const msg = error.response?.data?.message || error.message || 'Failed to delete plan'
          showToast(msg, 'error')
        }
      }
    )
  }

  const duplicatePlan = async (plan) => {
    try {
      const newPlanData = {
        userId: user.id,
        name: `${plan.name} (Copy)`,
        exercises: plan.exercises
      }
      
      const response = await axios.post(`${API_URL}/plans`, newPlanData, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      
      setPlans([...plans, response.data])
      showToast('Plan duplicated!', 'success')
    } catch (error) {
      console.error('Error duplicating plan:', error)
      showToast('Failed to duplicate plan', 'error')
    }
  }

  const updateSet = async (planId, exerciseIdx, setIdx, field, value) => {
    try {
      const plan = plans.find(p => p._id === planId)
      if (!plan) return

      const updatedExercises = [...plan.exercises]
      updatedExercises[exerciseIdx].sets[setIdx] = {
        ...updatedExercises[exerciseIdx].sets[setIdx],
        [field]: value
      }

      await axios.put(`${API_URL}/plans/${planId}`, {
        exercises: updatedExercises
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      })

      setPlans(plans.map(p => 
        p._id === planId 
          ? { ...p, exercises: updatedExercises }
          : p
      ))
    } catch (error) {
      console.error('Error updating set:', error)
      showToast('Failed to update set', 'error')
    }
  }

  const deleteExercise = async (planId, exerciseIdx) => {
    try {
      const plan = plans.find(p => p._id === planId)
      if (!plan) return

      const updatedExercises = plan.exercises.filter((_, idx) => idx !== exerciseIdx)

      await axios.put(`${API_URL}/plans/${planId}`, {
        exercises: updatedExercises
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      })

      setPlans(plans.map(p => 
        p._id === planId 
          ? { ...p, exercises: updatedExercises }
          : p
      ))
      
      showToast('Exercise removed', 'info')
    } catch (error) {
      console.error('Error deleting exercise:', error)
      showToast('Failed to delete exercise', 'error')
    }
  }

  const addSetToExercise = async (planId, exerciseIdx) => {
    try {
      const plan = plans.find(p => p._id === planId)
      if (!plan) return

      const updatedExercises = [...plan.exercises]
      updatedExercises[exerciseIdx].sets.push({ reps: 8, weight: 0 })

      await axios.put(`${API_URL}/plans/${planId}`, {
        exercises: updatedExercises
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      })

      setPlans(plans.map(p => 
        p._id === planId 
          ? { ...p, exercises: updatedExercises }
          : p
      ))
    } catch (error) {
      console.error('Error adding set:', error)
      showToast('Failed to add set', 'error')
    }
  }

  const deleteSet = async (planId, exerciseIdx, setIdx) => {
    try {
      const plan = plans.find(p => p._id === planId)
      if (!plan) return

      const updatedExercises = [...plan.exercises]
      updatedExercises[exerciseIdx].sets = updatedExercises[exerciseIdx].sets.filter(
        (_, idx) => idx !== setIdx
      )

      await axios.put(`${API_URL}/plans/${planId}`, {
        exercises: updatedExercises
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      })

      setPlans(plans.map(p => 
        p._id === planId 
          ? { ...p, exercises: updatedExercises }
          : p
      ))
    } catch (error) {
      console.error('Error deleting set:', error)
      showToast('Failed to delete set', 'error')
    }
  }

  const startWorkout = (plan) => {
    // Store plan in localStorage for ExecutePlan page
    localStorage.setItem('currentPlan', JSON.stringify(plan))
    navigate(`/execute-plan/${plan._id}`)
  }

  const startEditPlanName = (plan) => {
    setEditingPlanName(plan._id)
    setEditingPlanNameValue(plan.name)
  }

  const toggleEditMode = (planId) => {
    setEditingPlanId(editingPlanId === planId ? null : planId)
    // Auto-expand when entering edit mode
    if (editingPlanId !== planId) {
      setExpandedPlanId(planId)
    }
  }

  const startAddingExercises = (planId) => {
    setAddingExercisePlanId(planId)
    setSelectedExerciseIds([])
    setExerciseSearchTerm('')
  }

  const cancelAddingExercises = () => {
    setAddingExercisePlanId(null)
    setSelectedExerciseIds([])
    setExerciseSearchTerm('')
  }

  const toggleExerciseSelection = (exerciseId) => {
    setSelectedExerciseIds(prev =>
      prev.includes(exerciseId)
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    )
  }

  const confirmAddExercises = async () => {
    if (selectedExerciseIds.length === 0) {
      showToast('Please select at least one exercise', 'warning')
      return
    }

    try {
      const plan = plans.find(p => p._id === addingExercisePlanId)
      if (!plan) return

      const selectedExercises = EXERCISES.filter(ex => selectedExerciseIds.includes(ex.id))
      const newExercises = [
        ...plan.exercises,
        ...selectedExercises.map(ex => ({
          name: ex.name,
          group: ex.group,
          muscleDetail: ex.muscleDetail,
          sets: [{ reps: 8, weight: 0 }]
        }))
      ]

      await axios.put(`${API_URL}/plans/${addingExercisePlanId}`, {
        exercises: newExercises
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      })

      setPlans(plans.map(p =>
        p._id === addingExercisePlanId
          ? { ...p, exercises: newExercises }
          : p
      ))

      showToast(`Added ${selectedExercises.length} exercise(s)`, 'success')
      cancelAddingExercises()
    } catch (error) {
      console.error('Error adding exercises:', error)
      showToast('Failed to add exercises', 'error')
    }
  }

  const groupedExercises = useMemo(() => {
    const normalizedSearch = exerciseSearchTerm.trim().toLowerCase()
    const groups = EXERCISES.reduce((acc, exercise) => {
      if (normalizedSearch) {
        const searchable = `${exercise.name} ${exercise.group} ${exercise.muscleDetail}`.toLowerCase()
        if (!searchable.includes(normalizedSearch)) {
          return acc
        }
      }

      if (!acc[exercise.group]) {
        acc[exercise.group] = []
      }
      acc[exercise.group].push(exercise)
      return acc
    }, {})

    return GROUP_ORDER.filter(group => groups[group]).map(group => ({
      group,
      exercises: groups[group]
    }))
  }, [exerciseSearchTerm])

  const savePlanName = async (planId) => {
    if (!editingPlanNameValue.trim()) {
      showToast('Plan name cannot be empty', 'warning')
      return
    }

    try {
      await axios.put(`${API_URL}/plans/${planId}`, {
        name: editingPlanNameValue
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      })

      setPlans(plans.map(p => 
        p._id === planId 
          ? { ...p, name: editingPlanNameValue }
          : p
      ))
      
      setEditingPlanName(null)
      setEditingPlanId(null)
      setExpandedPlanId(null)
      showToast('Plan name updated', 'success')
    } catch (error) {
      console.error('Error updating plan name:', error)
      showToast('Failed to update plan name', 'error')
    }
  }

  const cancelEditPlanName = () => {
    setEditingPlanName(null)
    setEditingPlanNameValue('')
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="saved-plans">
        <header className="plans-header">
          <h1>Saved Workout Plans</h1>
          <p>Loading your workout plans...</p>
        </header>
      </div>
    )
  }

  return (
    <div className="saved-plans">
      <header className="plans-header">
        <h1>Saved Workout Plans</h1>
        <p>Create, manage, and execute your custom workout plans</p>
      </header>

      {plans.length === 0 ? (
        <div className="empty-plans">
          <p>No saved plans yet.</p>
          <button onClick={() => navigate('/plan')} className="create-btn">
            Create Your First Plan
          </button>
        </div>
      ) : (
        <div className="plans-container">
          {plans.map(plan => (
            <div key={plan._id} className="plan-card">
              <div className="plan-header-section">
                <div>
                  {editingPlanName === plan._id ? (
                    <div className="edit-plan-name">
                      <input
                        type="text"
                        value={editingPlanNameValue}
                        onChange={(e) => setEditingPlanNameValue(e.target.value)}
                        autoFocus
                        className="plan-name-edit-input"
                      />
                      <button
                        onClick={() => savePlanName(plan._id)}
                        className="save-edit-btn"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditPlanName}
                        className="cancel-edit-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <>
                      <h3>{plan.name}</h3>
                      <p className="plan-meta">
                        {plan.exercises.length} exercises • Created {formatDate(plan.createdAt || plan.updatedAt)}
                      </p>
                    </>
                  )}
                </div>
                <div className="plan-actions">
                  <button
                    className="action-btn start-btn"
                    onClick={() => startWorkout(plan)}
                    title="Start this workout"
                  >
                    Start
                  </button>
                  <button
                    className="action-btn edit-btn"
                    onClick={() => toggleEditMode(plan._id)}
                    title="Edit plan"
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn duplicate-btn"
                    onClick={() => duplicatePlan(plan)}
                    title="Duplicate this plan"
                  >
                    Copy
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => deletePlan(plan._id)}
                    title="Delete this plan"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {expandedPlanId === plan._id && (
                <div className="plan-details">
                  {editingPlanId === plan._id && (
                    <div className="plan-edit-section">
                      <h4>Edit Plan Name</h4>
                      <div className="edit-plan-name-form">
                        <input
                          type="text"
                          value={editingPlanNameValue || plan.name}
                          onChange={(e) => setEditingPlanNameValue(e.target.value)}
                          placeholder="Plan name"
                          className="plan-name-input"
                        />
                        <button
                          onClick={() => savePlanName(plan._id)}
                          className="save-name-btn"
                        >
                          Save
                        </button>
                      </div>
                      <button
                        className="add-workout-btn"
                        onClick={() => startAddingExercises(plan._id)}
                      >
                        + Add Workout
                      </button>
                    </div>
                  )}
                  {plan.exercises.map((exercise, exIdx) => (
                    <div key={exIdx} className="exercise-detail">
                      <div className="exercise-header">
                        <div>
                          <h4>{exercise.name}</h4>
                          <span className="muscle-detail">{exercise.muscleDetail}</span>
                        </div>
                        {editingPlanId === plan._id && (
                          <button
                            className="delete-exercise-btn"
                            onClick={() => deleteExercise(plan._id, exIdx)}
                            title="Remove exercise"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <table className="sets-table">
                        <thead>
                          <tr>
                            <th>Set</th>
                            <th>Reps</th>
                            <th>Weight (lbs)</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets.map((set, setIdx) => (
                            <tr key={setIdx}>
                              <td className="set-number">{setIdx + 1}</td>
                              <td>
                                <input
                                  type="number"
                                  min="1"
                                  value={set.reps}
                                  onChange={(e) => updateSet(plan._id, exIdx, setIdx, 'reps', parseInt(e.target.value))}
                                  disabled={editingPlanId !== plan._id}
                                  className="set-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  min="0"
                                  step="2.5"
                                  value={set.weight}
                                  onChange={(e) => updateSet(plan._id, exIdx, setIdx, 'weight', parseFloat(e.target.value))}
                                  disabled={editingPlanId !== plan._id}
                                  className="set-input"
                                />
                              </td>
                              <td>
                                {editingPlanId === plan._id ? (
                                  <button
                                    className="delete-set-btn"
                                    onClick={() => deleteSet(plan._id, exIdx, setIdx)}
                                  >
                                    Delete
                                  </button>
                                ) : (
                                  <span className="view-only">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {editingPlanId === plan._id && (
                        <button
                          className="add-set-btn"
                          onClick={() => addSetToExercise(plan._id, exIdx)}
                        >
                          + Add Set
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {addingExercisePlanId && (
        <div className="exercise-modal-overlay">
          <div className="exercise-modal">
            <div className="modal-header">
              <h2>Add Exercises to Plan</h2>
              <button
                className="modal-close-btn"
                onClick={cancelAddingExercises}
                title="Close"
              >
                ✕
              </button>
            </div>

            <div className="exercise-search">
              <input
                type="text"
                placeholder="Search exercises..."
                value={exerciseSearchTerm}
                onChange={(e) => setExerciseSearchTerm(e.target.value)}
                className="exercise-search-input"
              />
            </div>

            <div className="exercise-list">
              {groupedExercises.map(({ group, exercises }) => (
                <div key={group} className="exercise-group">
                  <h3 className="group-title">{group}</h3>
                  <div className="exercise-items">
                    {exercises.map(exercise => (
                      <label key={exercise.id} className="exercise-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedExerciseIds.includes(exercise.id)}
                          onChange={() => toggleExerciseSelection(exercise.id)}
                        />
                        <div className="exercise-info">
                          <span className="exercise-name">{exercise.name}</span>
                          <span className="exercise-detail">{exercise.muscleDetail}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="modal-actions">
              <button
                className="modal-cancel-btn"
                onClick={cancelAddingExercises}
              >
                Cancel
              </button>
              <button
                className="modal-confirm-btn"
                onClick={confirmAddExercises}
                disabled={selectedExerciseIds.length === 0}
              >
                Add {selectedExerciseIds.length > 0 ? `(${selectedExerciseIds.length})` : ''} Exercise{selectedExerciseIds.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SavedPlans
