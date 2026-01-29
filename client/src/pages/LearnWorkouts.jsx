import React, { useState, useMemo } from 'react'
import '../styles/LearnWorkouts.css'

const EXERCISE_LIBRARY = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    group: 'Chest',
    muscleDetail: 'Pectoralis major, Anterior deltoids, Triceps',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Bench',
    description: 'The bench press is a compound exercise that targets the chest, shoulders, and triceps. It\'s one of the most effective exercises for building upper body strength and muscle mass.',
    instructions: [
      'Lie flat on a bench with your feet firmly on the ground',
      'Grip the barbell slightly wider than shoulder-width',
      'Unrack the bar and lower it to your mid-chest with control',
      'Press the bar up explosively until your arms are fully extended',
      'Keep your shoulder blades retracted throughout the movement'
    ],
    tips: [
      'Keep your elbows at a 45-degree angle to your body',
      'Maintain a slight arch in your lower back',
      'Drive through your feet for more power',
      'Don\'t bounce the bar off your chest'
    ],
    commonMistakes: [
      'Flaring elbows out too wide',
      'Not touching the chest',
      'Lifting hips off the bench',
      'Uneven bar path'
    ]
  },
  {
    id: 'squat',
    name: 'Squat',
    group: 'Legs',
    muscleDetail: 'Quadriceps, Glutes, Hamstrings, Core',
    difficulty: 'Intermediate',
    equipment: 'Barbell, Squat rack',
    description: 'The squat is the king of lower body exercises. It builds strength and mass in the entire lower body while developing core stability and overall athleticism.',
    instructions: [
      'Position the barbell on your upper back (not your neck)',
      'Stand with feet shoulder-width apart, toes slightly out',
      'Take a deep breath and brace your core',
      'Lower by pushing your hips back and bending your knees',
      'Descend until thighs are at least parallel to the ground',
      'Drive through your heels to stand back up'
    ],
    tips: [
      'Keep your chest up and proud throughout',
      'Track your knees over your toes',
      'Maintain a neutral spine',
      'Focus on sitting back, not just down'
    ],
    commonMistakes: [
      'Knees caving inward',
      'Rounding the lower back',
      'Coming up on toes',
      'Not reaching proper depth'
    ]
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    group: 'Back',
    muscleDetail: 'Erector spinae, Glutes, Hamstrings, Lats, Traps',
    difficulty: 'Advanced',
    equipment: 'Barbell',
    description: 'The deadlift is a full-body compound movement that builds overall strength and muscle mass. It primarily targets the posterior chain and is essential for developing a strong back and powerful hips.',
    instructions: [
      'Stand with feet hip-width apart, bar over mid-foot',
      'Bend down and grip the bar just outside your legs',
      'Lower your hips and lift your chest',
      'Take a deep breath and brace your core',
      'Drive through your heels and pull the bar up your legs',
      'Stand tall at the top, then lower with control'
    ],
    tips: [
      'Keep the bar close to your body throughout',
      'Pull the slack out of the bar before lifting',
      'Think "push the floor away" not "pull the bar up"',
      'Lock out hips and knees simultaneously at the top'
    ],
    commonMistakes: [
      'Rounding the lower back',
      'Starting with hips too low or too high',
      'Jerking the bar off the floor',
      'Hyperextending at the top'
    ]
  },
  {
    id: 'pull-up',
    name: 'Pull-up',
    group: 'Back',
    muscleDetail: 'Latissimus dorsi, Biceps, Rear deltoids',
    difficulty: 'Intermediate',
    equipment: 'Pull-up bar',
    description: 'The pull-up is a fundamental upper body exercise that builds back width and arm strength. It\'s a true test of relative strength and body control.',
    instructions: [
      'Hang from a pull-up bar with an overhand grip',
      'Hands should be slightly wider than shoulder-width',
      'Start from a dead hang with arms fully extended',
      'Pull yourself up by driving your elbows down',
      'Bring your chin above the bar',
      'Lower yourself with control to the starting position'
    ],
    tips: [
      'Engage your lats before pulling',
      'Keep your core tight to prevent swinging',
      'Focus on pulling your elbows to your hips',
      'Full range of motion for maximum benefit'
    ],
    commonMistakes: [
      'Using momentum and swinging',
      'Not achieving full extension at the bottom',
      'Chin not clearing the bar',
      'Shrugging shoulders at the top'
    ]
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    group: 'Shoulders',
    muscleDetail: 'Deltoids, Triceps, Upper chest, Core',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    description: 'The overhead press is a fundamental shoulder exercise that builds upper body pressing strength and shoulder stability. It engages the entire body for balance and power.',
    instructions: [
      'Start with the barbell at shoulder height',
      'Grip slightly wider than shoulder-width',
      'Stand with feet shoulder-width apart',
      'Brace your core and squeeze your glutes',
      'Press the bar straight up overhead',
      'Move your head slightly back to clear the bar path',
      'Lock out at the top with biceps by ears',
      'Lower with control back to shoulders'
    ],
    tips: [
      'Keep the bar path vertical',
      'Maintain a tight core throughout',
      'Don\'t lean back excessively',
      'Press slightly back to finish over mid-foot'
    ],
    commonMistakes: [
      'Pressing the bar forward instead of up',
      'Excessive lower back arch',
      'Not locking out fully',
      'Flaring elbows out too wide'
    ]
  },
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    group: 'Back',
    muscleDetail: 'Lats, Rhomboids, Traps, Rear deltoids',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    description: 'The barbell row is an essential back exercise that builds thickness and strength in the mid-back. It complements pull-ups and deadlifts for complete back development.',
    instructions: [
      'Stand with feet hip-width apart',
      'Bend at hips to about 45 degrees',
      'Grip the bar slightly wider than shoulder-width',
      'Keep your back flat and core braced',
      'Pull the bar to your lower chest/upper abdomen',
      'Squeeze your shoulder blades together at the top',
      'Lower with control'
    ],
    tips: [
      'Keep your torso angle consistent',
      'Pull with your elbows, not your hands',
      'Don\'t let your lower back round',
      'Control the eccentric portion'
    ],
    commonMistakes: [
      'Using too much momentum',
      'Rounding the back',
      'Standing too upright',
      'Not achieving full scapular retraction'
    ]
  },
  {
    id: 'dumbbell-press',
    name: 'Dumbbell Press',
    group: 'Chest',
    muscleDetail: 'Pectoralis major, Anterior deltoids, Triceps',
    difficulty: 'Beginner',
    equipment: 'Dumbbells, Bench',
    description: 'The dumbbell press allows for a greater range of motion than the barbell bench press and helps address muscle imbalances. It\'s excellent for building chest strength and size.',
    instructions: [
      'Sit on the bench with dumbbells on your thighs',
      'Lie back and bring the dumbbells to chest level',
      'Position dumbbells at shoulder width with palms forward',
      'Press the dumbbells up and slightly together',
      'Lower with control until you feel a stretch in your chest',
      'Press back up to starting position'
    ],
    tips: [
      'Keep your shoulder blades retracted',
      'Maintain control throughout the movement',
      'Don\'t let dumbbells drift too far apart',
      'Breathe out as you press up'
    ],
    commonMistakes: [
      'Bouncing dumbbells off chest',
      'Arching back excessively',
      'Pressing dumbbells straight up without arc',
      'Losing shoulder blade retraction'
    ]
  },
  {
    id: 'barbell-curl',
    name: 'Barbell Curl',
    group: 'Biceps',
    muscleDetail: 'Biceps brachii, Brachialis, Forearms',
    difficulty: 'Beginner',
    equipment: 'Barbell',
    description: 'The barbell curl is a classic bicep exercise that effectively builds arm size and strength. It allows you to lift heavier weight than dumbbell variations.',
    instructions: [
      'Stand with feet shoulder-width apart',
      'Grip the barbell with an underhand grip',
      'Keep elbows close to your sides',
      'Curl the bar up toward your shoulders',
      'Squeeze your biceps at the top',
      'Lower the bar with control',
      'Keep your upper arms stationary'
    ],
    tips: [
      'Don\'t swing or use momentum',
      'Keep your core tight',
      'Full range of motion for best results',
      'Focus on the squeeze at the top'
    ],
    commonMistakes: [
      'Swinging the weight up',
      'Moving elbows forward',
      'Not fully extending at bottom',
      'Arching the back'
    ]
  },
  {
    id: 'tricep-dip',
    name: 'Tricep Dip',
    group: 'Triceps',
    muscleDetail: 'Triceps, Chest, Anterior deltoids',
    difficulty: 'Intermediate',
    equipment: 'Parallel bars or Dip station',
    description: 'Tricep dips are a compound bodyweight exercise that primarily targets the triceps. They also engage the chest and shoulders, making them excellent for upper body development.',
    instructions: [
      'Grip the parallel bars and lift yourself up',
      'Start with arms fully extended',
      'Lean slightly forward and keep elbows close',
      'Lower your body by bending your elbows',
      'Go down until upper arms are parallel to ground',
      'Press back up to the starting position'
    ],
    tips: [
      'Keep your core engaged',
      'Don\'t go too deep if you feel shoulder pain',
      'Focus on triceps by keeping upright',
      'Control the descent'
    ],
    commonMistakes: [
      'Flaring elbows out',
      'Going too deep and stressing shoulders',
      'Using momentum',
      'Not achieving full lockout'
    ]
  },
  {
    id: 'plank',
    name: 'Plank',
    group: 'Core',
    muscleDetail: 'Rectus abdominis, Transverse abdominis, Obliques',
    difficulty: 'Beginner',
    equipment: 'None',
    description: 'The plank is a foundational core exercise that builds overall stability and endurance. It strengthens the entire core while teaching proper body alignment.',
    instructions: [
      'Start in a push-up position',
      'Lower down onto your forearms',
      'Keep elbows directly under shoulders',
      'Form a straight line from head to heels',
      'Engage your core and squeeze glutes',
      'Hold the position maintaining proper form'
    ],
    tips: [
      'Don\'t let hips sag or pike up',
      'Breathe normally throughout',
      'Focus on quality over duration',
      'Keep your neck neutral'
    ],
    commonMistakes: [
      'Hips sagging toward the floor',
      'Hips too high',
      'Holding breath',
      'Looking up or down excessively'
    ]
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    group: 'Legs',
    muscleDetail: 'Hamstrings, Glutes, Lower back',
    difficulty: 'Intermediate',
    equipment: 'Barbell',
    description: 'The Romanian deadlift is a hip-hinge movement that targets the hamstrings and glutes. It\'s excellent for developing the posterior chain and improving hip mobility.',
    instructions: [
      'Stand holding a barbell at hip level',
      'Keep a slight bend in your knees',
      'Push your hips back and lower the bar',
      'Keep the bar close to your legs',
      'Lower until you feel a stretch in hamstrings',
      'Drive your hips forward to return to standing'
    ],
    tips: [
      'Maintain a flat back throughout',
      'Feel the stretch in your hamstrings',
      'Don\'t go lower than your flexibility allows',
      'Keep the movement smooth and controlled'
    ],
    commonMistakes: [
      'Rounding the back',
      'Squatting instead of hinging',
      'Letting the bar drift away from legs',
      'Bending knees too much'
    ]
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    group: 'Back',
    muscleDetail: 'Latissimus dorsi, Biceps, Rear deltoids',
    difficulty: 'Beginner',
    equipment: 'Lat pulldown machine',
    description: 'The lat pulldown is a machine-based exercise that mimics the pull-up motion. It\'s perfect for building back width and can be adjusted to accommodate different strength levels.',
    instructions: [
      'Sit at the lat pulldown machine',
      'Grip the bar wider than shoulder-width',
      'Start with arms fully extended overhead',
      'Pull the bar down to your upper chest',
      'Squeeze your shoulder blades together',
      'Slowly return to the starting position'
    ],
    tips: [
      'Don\'t lean back excessively',
      'Focus on pulling with your elbows',
      'Keep your chest up',
      'Control the weight on the way up'
    ],
    commonMistakes: [
      'Using too much momentum',
      'Pulling behind the neck',
      'Not achieving full range of motion',
      'Rounding the shoulders forward'
    ]
  }
]

function LearnWorkouts() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('All')
  const [selectedExercise, setSelectedExercise] = useState(null)

  const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Biceps', 'Triceps', 'Core']

  const filteredExercises = useMemo(() => {
    let exercises = EXERCISE_LIBRARY

    if (selectedGroup !== 'All') {
      exercises = exercises.filter(ex => ex.group === selectedGroup)
    }

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase()
      exercises = exercises.filter(ex =>
        ex.name.toLowerCase().includes(search) ||
        ex.group.toLowerCase().includes(search) ||
        ex.muscleDetail.toLowerCase().includes(search) ||
        ex.description.toLowerCase().includes(search)
      )
    }

    return exercises
  }, [searchTerm, selectedGroup])

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return '#4caf50'
      case 'Intermediate':
        return '#ff9800'
      case 'Advanced':
        return '#f44336'
      default:
        return '#757575'
    }
  }

  return (
    <main className="learn-workouts-container">
      <div className="learn-header">
        <h1>Exercise Library</h1>
        <p>Learn proper form and technique for each exercise</p>
      </div>

      <div className="learn-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="muscle-group-filters">
          {muscleGroups.map(group => (
            <button
              key={group}
              className={`filter-btn ${selectedGroup === group ? 'active' : ''}`}
              onClick={() => setSelectedGroup(group)}
            >
              {group}
            </button>
          ))}
        </div>
      </div>

      <div className="learn-content">
        {!selectedExercise ? (
          <div className="exercise-grid">
            {filteredExercises.map(exercise => (
              <div
                key={exercise.id}
                className="exercise-card"
                onClick={() => setSelectedExercise(exercise)}
              >
                <div className="exercise-info">
                  <h3>{exercise.name}</h3>
                  <div className="exercise-meta">
                    <span className="muscle-group">{exercise.group}</span>
                    <span
                      className="difficulty-badge"
                      style={{ backgroundColor: getDifficultyColor(exercise.difficulty) }}
                    >
                      {exercise.difficulty}
                    </span>
                  </div>
                  <p className="exercise-preview">{exercise.description.substring(0, 100)}...</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="exercise-detail">
            <button className="back-btn" onClick={() => setSelectedExercise(null)}>
              ← Back to Exercises
            </button>

            <div className="detail-header">
              <div className="detail-info">
                <h2>{selectedExercise.name}</h2>
                <div className="detail-meta">
                  <span className="meta-item">
                    <strong>Muscle Group:</strong> {selectedExercise.group}
                  </span>
                  <span className="meta-item">
                    <strong>Targets:</strong> {selectedExercise.muscleDetail}
                  </span>
                  <span className="meta-item">
                    <strong>Equipment:</strong> {selectedExercise.equipment}
                  </span>
                  <span
                    className="difficulty-badge"
                    style={{ backgroundColor: getDifficultyColor(selectedExercise.difficulty) }}
                  >
                    {selectedExercise.difficulty}
                  </span>
                </div>
                <p className="description">{selectedExercise.description}</p>
              </div>
            </div>

            <div className="detail-sections">
              <section className="detail-section">
                <h3>How to Perform</h3>
                <ol className="instructions-list">
                  {selectedExercise.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ol>
              </section>

              <section className="detail-section">
                <h3>Pro Tips</h3>
                <ul className="tips-list">
                  {selectedExercise.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </section>

              <section className="detail-section">
                <h3>Common Mistakes to Avoid</h3>
                <ul className="mistakes-list">
                  {selectedExercise.commonMistakes.map((mistake, index) => (
                    <li key={index}>{mistake}</li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

export default LearnWorkouts
