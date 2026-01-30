import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useToast } from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import '../styles/PlanWorkout.css'

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
  { id: 'lat-pulldown', name: 'Lat Pulldown', group: 'Back', muscleDetail: 'Lats' },
  { id: 'close-grip-pulldown', name: 'Close-Grip Pulldown', group: 'Back', muscleDetail: 'Lower lats' },
  { id: 'straight-arm-pulldown', name: 'Straight-Arm Pulldown', group: 'Back', muscleDetail: 'Lats' },
  { id: 'barbell-row', name: 'Barbell Row', group: 'Back', muscleDetail: 'Mid-back' },
  { id: 'pendlay-row', name: 'Pendlay Row', group: 'Back', muscleDetail: 'Mid-back' },
  { id: 'one-arm-row', name: 'One-Arm Dumbbell Row', group: 'Back', muscleDetail: 'Lats' },
  { id: 'seated-row', name: 'Seated Cable Row', group: 'Back', muscleDetail: 'Mid-back' },
  { id: 'chest-supported-row', name: 'Chest-Supported Row', group: 'Back', muscleDetail: 'Upper back' },
  { id: 't-bar-row', name: 'T-Bar Row', group: 'Back', muscleDetail: 'Mid-back' },
  { id: 'inverted-row', name: 'Inverted Row', group: 'Back', muscleDetail: 'Upper back' },
  { id: 'deadlift', name: 'Deadlift', group: 'Back', muscleDetail: 'Posterior chain' },
  { id: 'rack-pull', name: 'Rack Pull', group: 'Back', muscleDetail: 'Upper back' },
  { id: 'back-extension', name: 'Back Extension', group: 'Back', muscleDetail: 'Lower back' },
  { id: 'good-morning', name: 'Good Morning', group: 'Back', muscleDetail: 'Lower back' },
  { id: 'face-pull', name: 'Face Pull', group: 'Back', muscleDetail: 'Rear delts' },
  { id: 'barbell-shrug', name: 'Barbell Shrug', group: 'Back', muscleDetail: 'Traps' },
  { id: 'single-arm-cable-row', name: 'Single-Arm Cable Row', group: 'Back', muscleDetail: 'Lats' },
  { id: 'machine-row', name: 'Machine Row', group: 'Back', muscleDetail: 'Mid-back' },

  { id: 'overhead-press', name: 'Overhead Press', group: 'Shoulders', muscleDetail: 'Deltoids' },
  { id: 'dumbbell-press', name: 'Dumbbell Shoulder Press', group: 'Shoulders', muscleDetail: 'Deltoids' },
  { id: 'arnold-press', name: 'Arnold Press', group: 'Shoulders', muscleDetail: 'Front delts' },
  { id: 'push-press', name: 'Push Press', group: 'Shoulders', muscleDetail: 'Delts + power' },
  { id: 'lateral-raise', name: 'Lateral Raise', group: 'Shoulders', muscleDetail: 'Side delts' },
  { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', group: 'Shoulders', muscleDetail: 'Side delts' },
  { id: 'rear-delt-fly', name: 'Rear Delt Fly', group: 'Shoulders', muscleDetail: 'Rear delts' },
  { id: 'reverse-pec-deck', name: 'Reverse Pec Deck', group: 'Shoulders', muscleDetail: 'Rear delts' },
  { id: 'front-raise', name: 'Front Raise', group: 'Shoulders', muscleDetail: 'Front delts' },
  { id: 'upright-row', name: 'Upright Row', group: 'Shoulders', muscleDetail: 'Side delts' },
  { id: 'high-pull', name: 'High Pull', group: 'Shoulders', muscleDetail: 'Traps + delts' },
  { id: 'landmine-press-shoulder', name: 'Landmine Shoulder Press', group: 'Shoulders', muscleDetail: 'Front delts' },
  { id: 'cuban-press', name: 'Cuban Press', group: 'Shoulders', muscleDetail: 'Rotator cuff' },
  { id: 'y-raise', name: 'Y-Raise', group: 'Shoulders', muscleDetail: 'Lower traps' },
  { id: 'z-press', name: 'Z-Press', group: 'Shoulders', muscleDetail: 'Delts + core' },
  { id: 'machine-shoulder-press', name: 'Machine Shoulder Press', group: 'Shoulders', muscleDetail: 'Delts' },
  { id: 'plate-raise', name: 'Plate Raise', group: 'Shoulders', muscleDetail: 'Front delts' },
  { id: 'cable-front-raise', name: 'Cable Front Raise', group: 'Shoulders', muscleDetail: 'Front delts' },
  { id: 'prone-rear-raise', name: 'Prone Rear Raise', group: 'Shoulders', muscleDetail: 'Rear delts' },
  { id: 'scaption-raise', name: 'Scaption Raise', group: 'Shoulders', muscleDetail: 'Rotator cuff' },

  { id: 'barbell-curl', name: 'Barbell Curl', group: 'Biceps', muscleDetail: 'Biceps brachii' },
  { id: 'ez-bar-curl', name: 'EZ-Bar Curl', group: 'Biceps', muscleDetail: 'Biceps' },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', group: 'Biceps', muscleDetail: 'Biceps' },
  { id: 'alternating-curl', name: 'Alternating Curl', group: 'Biceps', muscleDetail: 'Biceps' },
  { id: 'incline-curl', name: 'Incline Curl', group: 'Biceps', muscleDetail: 'Long head' },
  { id: 'preacher-curl', name: 'Preacher Curl', group: 'Biceps', muscleDetail: 'Short head' },
  { id: 'spider-curl', name: 'Spider Curl', group: 'Biceps', muscleDetail: 'Short head' },
  { id: 'concentration-curl', name: 'Concentration Curl', group: 'Biceps', muscleDetail: 'Peak' },
  { id: 'hammer-curl', name: 'Hammer Curl', group: 'Biceps', muscleDetail: 'Brachialis' },
  { id: 'cross-body-hammer', name: 'Cross-Body Hammer Curl', group: 'Biceps', muscleDetail: 'Brachialis' },
  { id: 'reverse-curl', name: 'Reverse Curl', group: 'Biceps', muscleDetail: 'Brachioradialis' },
  { id: 'standing-cable-curl', name: 'Standing Cable Curl', group: 'Biceps', muscleDetail: 'Biceps' },
  { id: 'rope-hammer-curl', name: 'Rope Hammer Curl', group: 'Biceps', muscleDetail: 'Brachialis' },
  { id: 'drag-curl', name: 'Drag Curl', group: 'Biceps', muscleDetail: 'Long head' },
  { id: '21s-curl', name: '21s Curl', group: 'Biceps', muscleDetail: 'Biceps' },
  { id: 'zottman-curl', name: 'Zottman Curl', group: 'Biceps', muscleDetail: 'Biceps + forearms' },
  { id: 'machine-curl', name: 'Machine Curl', group: 'Biceps', muscleDetail: 'Biceps' },
  { id: 'band-curl', name: 'Resistance Band Curl', group: 'Biceps', muscleDetail: 'Biceps' },
  { id: 'bayesian-curl', name: 'Bayesian Cable Curl', group: 'Biceps', muscleDetail: 'Long head' },
  { id: 'seated-dumbbell-curl', name: 'Seated Dumbbell Curl', group: 'Biceps', muscleDetail: 'Biceps' },

  { id: 'tricep-pushdown', name: 'Tricep Pushdown', group: 'Triceps', muscleDetail: 'Lateral head' },
  { id: 'rope-pushdown', name: 'Rope Pushdown', group: 'Triceps', muscleDetail: 'Lateral head' },
  { id: 'overhead-rope-extension', name: 'Overhead Rope Extension', group: 'Triceps', muscleDetail: 'Long head' },
  { id: 'overhead-dumbbell-extension', name: 'Overhead Dumbbell Extension', group: 'Triceps', muscleDetail: 'Long head' },
  { id: 'skull-crusher', name: 'Skull Crusher', group: 'Triceps', muscleDetail: 'Long head' },
  { id: 'close-grip-bench', name: 'Close-Grip Bench', group: 'Triceps', muscleDetail: 'Triceps' },
  { id: 'tricep-dip', name: 'Tricep Dip', group: 'Triceps', muscleDetail: 'Triceps' },
  { id: 'diamond-push-up', name: 'Diamond Push-up', group: 'Triceps', muscleDetail: 'Triceps' },
  { id: 'tricep-kickback', name: 'Tricep Kickback', group: 'Triceps', muscleDetail: 'Long head' },
  { id: 'cable-kickback', name: 'Cable Kickback', group: 'Triceps', muscleDetail: 'Long head' },
  { id: 'jm-press', name: 'JM Press', group: 'Triceps', muscleDetail: 'Triceps' },
  { id: 'lying-tricep-extension', name: 'Lying Tricep Extension', group: 'Triceps', muscleDetail: 'Long head' },
  { id: 'dumbbell-floor-press', name: 'Dumbbell Floor Press', group: 'Triceps', muscleDetail: 'Triceps' },
  { id: 'reverse-grip-pushdown', name: 'Reverse-Grip Pushdown', group: 'Triceps', muscleDetail: 'Medial head' },
  { id: 'straight-bar-pushdown', name: 'Straight-Bar Pushdown', group: 'Triceps', muscleDetail: 'Lateral head' },
  { id: 'tate-press', name: 'Tate Press', group: 'Triceps', muscleDetail: 'Long head' },
  { id: 'bench-dip', name: 'Bench Dip', group: 'Triceps', muscleDetail: 'Triceps' },
  { id: 'overhead-ez-extension', name: 'Overhead EZ Extension', group: 'Triceps', muscleDetail: 'Long head' },
  { id: 'cable-overhead-extension', name: 'Cable Overhead Extension', group: 'Triceps', muscleDetail: 'Long head' },
  { id: 'machine-tricep-extension', name: 'Machine Tricep Extension', group: 'Triceps', muscleDetail: 'Triceps' },

  { id: 'squat', name: 'Squat', group: 'Legs', muscleDetail: 'Quads' },
  { id: 'front-squat', name: 'Front Squat', group: 'Legs', muscleDetail: 'Quads' },
  { id: 'back-squat', name: 'Back Squat', group: 'Legs', muscleDetail: 'Quads + glutes' },
  { id: 'leg-press', name: 'Leg Press', group: 'Legs', muscleDetail: 'Quads + glutes' },
  { id: 'hack-squat', name: 'Hack Squat', group: 'Legs', muscleDetail: 'Quads' },
  { id: 'goblet-squat', name: 'Goblet Squat', group: 'Legs', muscleDetail: 'Quads' },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', group: 'Legs', muscleDetail: 'Quads + glutes' },
  { id: 'walking-lunge', name: 'Walking Lunge', group: 'Legs', muscleDetail: 'Quads + glutes' },
  { id: 'reverse-lunge', name: 'Reverse Lunge', group: 'Legs', muscleDetail: 'Quads + glutes' },
  { id: 'step-up', name: 'Step-up', group: 'Legs', muscleDetail: 'Quads + glutes' },
  { id: 'leg-extension', name: 'Leg Extension', group: 'Legs', muscleDetail: 'Quads' },
  { id: 'leg-curl', name: 'Leg Curl', group: 'Legs', muscleDetail: 'Hamstrings' },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', group: 'Legs', muscleDetail: 'Hamstrings' },
  { id: 'stiff-leg-deadlift', name: 'Stiff-Leg Deadlift', group: 'Legs', muscleDetail: 'Hamstrings' },
  { id: 'glute-ham-raise', name: 'Glute-Ham Raise', group: 'Legs', muscleDetail: 'Hamstrings' },
  { id: 'standing-calf-raise', name: 'Standing Calf Raise', group: 'Legs', muscleDetail: 'Calves' },
  { id: 'seated-calf-raise', name: 'Seated Calf Raise', group: 'Legs', muscleDetail: 'Calves' },
  { id: 'single-leg-calf-raise', name: 'Single-Leg Calf Raise', group: 'Legs', muscleDetail: 'Calves' },
  { id: 'box-squat', name: 'Box Squat', group: 'Legs', muscleDetail: 'Quads + glutes' },
  { id: 'sled-push', name: 'Sled Push', group: 'Legs', muscleDetail: 'Quads + conditioning' },

  { id: 'hip-thrust', name: 'Hip Thrust', group: 'Glutes', muscleDetail: 'Glute max' },
  { id: 'barbell-hip-thrust', name: 'Barbell Hip Thrust', group: 'Glutes', muscleDetail: 'Glute max' },
  { id: 'single-leg-hip-thrust', name: 'Single-Leg Hip Thrust', group: 'Glutes', muscleDetail: 'Glute med' },
  { id: 'glute-bridge', name: 'Glute Bridge', group: 'Glutes', muscleDetail: 'Glutes' },
  { id: 'single-leg-glute-bridge', name: 'Single-Leg Glute Bridge', group: 'Glutes', muscleDetail: 'Glute med' },
  { id: 'cable-kickback-glute', name: 'Cable Kickback', group: 'Glutes', muscleDetail: 'Glute max' },
  { id: 'band-kickback', name: 'Banded Kickback', group: 'Glutes', muscleDetail: 'Glutes' },
  { id: 'donkey-kick', name: 'Donkey Kick', group: 'Glutes', muscleDetail: 'Glutes' },
  { id: 'frog-pump', name: 'Frog Pump', group: 'Glutes', muscleDetail: 'Glute max' },
  { id: 'hip-abduction', name: 'Hip Abduction', group: 'Glutes', muscleDetail: 'Glute med' },
  { id: 'banded-lateral-walk', name: 'Banded Lateral Walk', group: 'Glutes', muscleDetail: 'Glute med' },
  { id: 'clamshell', name: 'Clamshell', group: 'Glutes', muscleDetail: 'Glute med' },
  { id: 'step-up-glute', name: 'Step-up (Glute Focus)', group: 'Glutes', muscleDetail: 'Glutes' },
  { id: 'bulgarian-glute', name: 'Bulgarian Split Squat (Glute)', group: 'Glutes', muscleDetail: 'Glutes' },
  { id: 'sumo-deadlift', name: 'Sumo Deadlift', group: 'Glutes', muscleDetail: 'Glutes' },
  { id: 'cable-pull-through', name: 'Cable Pull-Through', group: 'Glutes', muscleDetail: 'Glute max' },
  { id: 'reverse-hyper', name: 'Reverse Hyperextension', group: 'Glutes', muscleDetail: 'Glutes' },
  { id: 'curtsy-lunge', name: 'Curtsy Lunge', group: 'Glutes', muscleDetail: 'Glute med' },
  { id: 'hip-thrust-machine', name: 'Hip Thrust Machine', group: 'Glutes', muscleDetail: 'Glute max' },
  { id: 'single-leg-rdl-glute', name: 'Single-Leg RDL', group: 'Glutes', muscleDetail: 'Glutes + hamstrings' },

  { id: 'plank', name: 'Plank', group: 'Core', muscleDetail: 'Deep core' },
  { id: 'side-plank', name: 'Side Plank', group: 'Core', muscleDetail: 'Obliques' },
  { id: 'hollow-hold', name: 'Hollow Hold', group: 'Core', muscleDetail: 'Deep core' },
  { id: 'dead-bug', name: 'Dead Bug', group: 'Core', muscleDetail: 'Deep core' },
  { id: 'bird-dog', name: 'Bird Dog', group: 'Core', muscleDetail: 'Core + low back' },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', group: 'Core', muscleDetail: 'Lower abs' },
  { id: 'lying-leg-raise', name: 'Lying Leg Raise', group: 'Core', muscleDetail: 'Lower abs' },
  { id: 'reverse-crunch', name: 'Reverse Crunch', group: 'Core', muscleDetail: 'Lower abs' },
  { id: 'crunch', name: 'Crunch', group: 'Core', muscleDetail: 'Upper abs' },
  { id: 'bicycle-crunch', name: 'Bicycle Crunch', group: 'Core', muscleDetail: 'Obliques' },
  { id: 'russian-twist', name: 'Russian Twist', group: 'Core', muscleDetail: 'Obliques' },
  { id: 'woodchop', name: 'Cable Woodchop', group: 'Core', muscleDetail: 'Obliques' },
  { id: 'pallof-press', name: 'Pallof Press', group: 'Core', muscleDetail: 'Anti-rotation' },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', group: 'Core', muscleDetail: 'Anterior core' },
  { id: 'mountain-climber', name: 'Mountain Climber', group: 'Core', muscleDetail: 'Core + cardio' },
  { id: 'toe-touches', name: 'Toe Touches', group: 'Core', muscleDetail: 'Upper abs' },
  { id: 'v-up', name: 'V-Up', group: 'Core', muscleDetail: 'Upper abs' },
  { id: 'sit-up', name: 'Sit-up', group: 'Core', muscleDetail: 'Abs' },
  { id: 'plank-shoulder-tap', name: 'Plank Shoulder Tap', group: 'Core', muscleDetail: 'Anti-rotation' },
  { id: 'flutter-kick', name: 'Flutter Kick', group: 'Core', muscleDetail: 'Lower abs' }
]

const GROUP_ORDER = ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core']

function PlanWorkout() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { user } = useAuth()
  const [selectedIds, setSelectedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [planName, setPlanName] = useState('')
  const [showSaveForm, setShowSaveForm] = useState(false)
  const [saving, setSaving] = useState(false)

  const groupedExercises = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const groups = EXERCISES.reduce((acc, exercise) => {
      if (normalizedSearch) {
        const searchable = `${exercise.name} ${exercise.group} ${exercise.muscleDetail}`.toLowerCase()
        if (!searchable.includes(normalizedSearch)) {
          return acc
        }
      }
      acc[exercise.group] = acc[exercise.group] || []
      acc[exercise.group].push(exercise)
      return acc
    }, {})

    return GROUP_ORDER.filter(group => groups[group]).map(group => ({
      group,
      exercises: groups[group]
    }))
  }, [searchTerm])

  const selectedExercises = useMemo(() => {
    return EXERCISES.filter(exercise => selectedIds.includes(exercise.id))
  }, [selectedIds])

  const selectedGrouped = useMemo(() => {
    return selectedExercises.reduce((acc, exercise) => {
      acc[exercise.group] = acc[exercise.group] || []
      acc[exercise.group].push(exercise)
      return acc
    }, {})
  }, [selectedExercises])

  const handleToggle = (id) => {
    setSelectedIds(prev => (
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    ))
  }

  const handleSavePlan = async () => {
    console.log('handleSavePlan called')
    console.log('Plan name:', planName)
    console.log('Selected IDs:', selectedIds)
    console.log('User:', user)
    
    if (!planName.trim()) {
      showToast('Please enter a plan name', 'warning')
      return
    }

    if (selectedIds.length === 0) {
      showToast('Please select at least one exercise', 'warning')
      return
    }

    if (!user) {
      showToast('Please log in to save plans', 'error')
      navigate('/login')
      return
    }

    setSaving(true)

    try {
      const selectedExercises = EXERCISES.filter(exercise => selectedIds.includes(exercise.id)).map(exercise => ({
        name: exercise.name,
        group: exercise.group,
        muscleDetail: exercise.muscleDetail,
        sets: [{ reps: 8, weight: 0 }, { reps: 8, weight: 0 }, { reps: 8, weight: 0 }]
      }))

      console.log('Selected exercises:', selectedExercises)

      const newPlan = {
        userId: user.id,
        name: planName,
        exercises: selectedExercises
      }

      console.log('Sending plan to server:', newPlan)
      console.log('API URL:', `${API_URL}/plans`)

      const response = await axios.post(`${API_URL}/plans`, newPlan, {
        headers: { Authorization: `Bearer ${user.token}` }
      })

      console.log('Plan saved successfully:', response.data)

      setPlanName('')
      setSelectedIds([])
      setShowSaveForm(false)
      showToast('Plan saved successfully!', 'success')
      setTimeout(() => navigate('/saved-plans'), 500)
    } catch (error) {
      console.error('Error saving plan:', error)
      console.error('Error response:', error.response?.data)
      showToast('Failed to save plan', 'error')
    } finally {
      setSaving(false)
    }
  }

  const handleClear = () => setSelectedIds([])

  return (
    <div className="plan-workout">
      <header className="plan-header">
        <h1>Create Workout Plan</h1>
        <p>Select exercises to build your custom workout routine</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search exercises, body parts, or muscles..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
      </header>

      <div className="plan-content">
        <section className="exercise-list">
          {groupedExercises.length === 0 ? (
            <p className="empty-state">No exercises match your search.</p>
          ) : (
            groupedExercises.map(section => (
              <div key={section.group} className="exercise-group">
                <h2>{section.group}</h2>
                <div className="exercise-grid">
                  {section.exercises.map(exercise => (
                    <label key={exercise.id} className={
                      selectedIds.includes(exercise.id) ? 'exercise-card selected' : 'exercise-card'
                    }>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(exercise.id)}
                        onChange={() => handleToggle(exercise.id)}
                      />
                      <div className="exercise-info">
                        <span className="exercise-name">{exercise.name}</span>
                        <span className="exercise-detail">{exercise.muscleDetail}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        <aside className="selected-panel">
          <div className="selected-header">
            <h2>Your Plan</h2>
            <div className="selected-header-buttons">
              <button onClick={handleClear} disabled={selectedIds.length === 0}>Clear</button>
              <button 
                className="save-plan-btn"
                onClick={() => setShowSaveForm(!showSaveForm)}
                disabled={selectedIds.length === 0}
              >
                Save Plan
              </button>
            </div>
          </div>

          {showSaveForm && (
            <div className="save-plan-form">
              <input
                type="text"
                placeholder="Plan name (e.g., Upper Body Strength)"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="plan-name-input"
              />
              <div className="form-buttons">
                <button onClick={handleSavePlan} className="confirm-save-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save'}
                </button>
                <button 
                  onClick={() => {
                    setShowSaveForm(false)
                    setPlanName('')
                  }}
                  className="cancel-save-btn"
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {selectedIds.length === 0 ? (
            <p className="empty-state">Select exercises to build your plan.</p>
          ) : (
            Object.keys(selectedGrouped).map(group => (
              <div key={group} className="selected-group">
                <h3>{group}</h3>
                <ul>
                  {selectedGrouped[group].map(exercise => (
                    <li key={exercise.id}>
                      <span>{exercise.name}</span>
                      <small>{exercise.muscleDetail}</small>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </aside>
      </div>
    </div>
  )
}

export default PlanWorkout
