import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../components/Toast'
import '../styles/SavedPlans.css'

function SavedPlans() {
  const navigate = useNavigate()
  const { showToast, showConfirm } = useToast()
  const [plans, setPlans] = useState([])
  const [expandedPlanId, setExpandedPlanId] = useState(null)
  const [editingPlanName, setEditingPlanName] = useState(null)
  const [editingPlanNameValue, setEditingPlanNameValue] = useState('')

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = () => {
    const savedPlans = localStorage.getItem('workoutPlans')
    if (savedPlans) {
      setPlans(JSON.parse(savedPlans))
    }
  }

  const savePlans = (updatedPlans) => {
    localStorage.setItem('workoutPlans', JSON.stringify(updatedPlans))
    setPlans(updatedPlans)
  }

  const deletePlan = (planId) => {
    showConfirm(
      'Delete this plan?',
      () => {
        const updated = plans.filter(p => p.id !== planId)
        savePlans(updated)
        showToast('Plan deleted', 'info')
      }
    )
  }

  const duplicatePlan = (plan) => {
    const newPlan = {
      ...plan,
      id: Date.now(),
      name: `${plan.name} (Copy)`,
      createdAt: new Date().toISOString()
    }
    savePlans([...plans, newPlan])
  }

  const updateSet = (planId, exerciseIdx, setIdx, field, value) => {
    const updated = plans.map(p => {
      if (p.id === planId) {
        const newPlan = { ...p }
        newPlan.exercises[exerciseIdx].sets[setIdx] = {
          ...newPlan.exercises[exerciseIdx].sets[setIdx],
          [field]: value
        }
        return newPlan
      }
      return p
    })
    savePlans(updated)
  }

  const deleteExercise = (planId, exerciseIdx) => {
    const updated = plans.map(p => {
      if (p.id === planId) {
        return {
          ...p,
          exercises: p.exercises.filter((_, idx) => idx !== exerciseIdx)
        }
      }
      return p
    })
    savePlans(updated)
  }

  const addSetToExercise = (planId, exerciseIdx) => {
    const updated = plans.map(p => {
      if (p.id === planId) {
        const newPlan = { ...p }
        newPlan.exercises[exerciseIdx].sets.push({ reps: 8, weight: 0 })
        return newPlan
      }
      return p
    })
    savePlans(updated)
  }

  const deleteSet = (planId, exerciseIdx, setIdx) => {
    const updated = plans.map(p => {
      if (p.id === planId) {
        const newPlan = { ...p }
        newPlan.exercises[exerciseIdx].sets = newPlan.exercises[exerciseIdx].sets.filter(
          (_, idx) => idx !== setIdx
        )
        return newPlan
      }
      return p
    })
    savePlans(updated)
  }

  const startEditSet = (reps, weight) => {
    setEditValues({ reps, weight })
    setEditingSetId(true)
  }

  const startWorkout = (plan) => {
    navigate(`/execute-plan/${plan.id}`)
  }

  const startEditPlanName = (plan) => {
    setEditingPlanName(plan.id)
    setEditingPlanNameValue(plan.name)
  }

  const savePlanName = (planId) => {
    if (!editingPlanNameValue.trim()) {
      showToast('Plan name cannot be empty', 'warning')
      return
    }

    const updated = plans.map(p => {
      if (p.id === planId) {
        return { ...p, name: editingPlanNameValue }
      }
      return p
    })
    savePlans(updated)
    setEditingPlanName(null)
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
            <div key={plan.id} className="plan-card">
              <div className="plan-header-section">
                <div>
                  {editingPlanName === plan.id ? (
                    <div className="edit-plan-name">
                      <input
                        type="text"
                        value={editingPlanNameValue}
                        onChange={(e) => setEditingPlanNameValue(e.target.value)}
                        autoFocus
                        className="plan-name-edit-input"
                      />
                      <button
                        onClick={() => savePlanName(plan.id)}
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
                        {plan.exercises.length} exercises • Created {formatDate(plan.createdAt)}
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
                    onClick={() => startEditPlanName(plan)}
                    title="Edit plan name"
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
                    className="action-btn expand-btn"
                    onClick={() => setExpandedPlanId(expandedPlanId === plan.id ? null : plan.id)}
                  >
                    {expandedPlanId === plan.id ? '−' : '+'}
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => deletePlan(plan.id)}
                    title="Delete this plan"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {expandedPlanId === plan.id && (
                <div className="plan-details">
                  {plan.exercises.map((exercise, exIdx) => (
                    <div key={exIdx} className="exercise-detail">
                      <div className="exercise-header">
                        <div>
                          <h4>{exercise.name}</h4>
                          <span className="muscle-detail">{exercise.muscleDetail}</span>
                        </div>
                        <button
                          className="delete-exercise-btn"
                          onClick={() => deleteExercise(plan.id, exIdx)}
                          title="Remove exercise"
                        >
                          Remove
                        </button>
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
                                  onChange={(e) => updateSet(plan.id, exIdx, setIdx, 'reps', parseInt(e.target.value))}
                                  className="set-input"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  min="0"
                                  step="2.5"
                                  value={set.weight}
                                  onChange={(e) => updateSet(plan.id, exIdx, setIdx, 'weight', parseFloat(e.target.value))}
                                  className="set-input"
                                />
                              </td>
                              <td>
                                <button
                                  className="delete-set-btn"
                                  onClick={() => deleteSet(plan.id, exIdx, setIdx)}
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <button
                        className="add-set-btn"
                        onClick={() => addSetToExercise(plan.id, exIdx)}
                      >
                        + Add Set
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SavedPlans
