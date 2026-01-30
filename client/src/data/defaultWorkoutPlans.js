// Default workout plans that are loaded when a user first visits the Saved Plans page

export const DEFAULT_WORKOUT_PLANS = [
  {
    id: Date.now() + 1,
    name: 'Chest Workout',
    createdAt: new Date().toISOString(),
    exercises: [
      {
        name: 'Bench Press',
        group: 'Chest',
        muscleDetail: 'Pectoralis major',
        sets: [
          { reps: 10, weight: 135 },
          { reps: 8, weight: 155 },
          { reps: 6, weight: 175 },
          { reps: 6, weight: 175 }
        ]
      },
      {
        name: 'Incline Dumbbell Press',
        group: 'Chest',
        muscleDetail: 'Upper chest',
        sets: [
          { reps: 10, weight: 50 },
          { reps: 10, weight: 55 },
          { reps: 8, weight: 60 }
        ]
      },
      {
        name: 'Cable Fly',
        group: 'Chest',
        muscleDetail: 'Chest squeeze',
        sets: [
          { reps: 12, weight: 30 },
          { reps: 12, weight: 35 },
          { reps: 10, weight: 40 }
        ]
      },
      {
        name: 'Dips',
        group: 'Chest',
        muscleDetail: 'Lower chest',
        sets: [
          { reps: 10, weight: 0 },
          { reps: 10, weight: 0 },
          { reps: 8, weight: 25 }
        ]
      }
    ]
  },
  {
    id: Date.now() + 2,
    name: 'Leg Workout',
    createdAt: new Date().toISOString(),
    exercises: [
      {
        name: 'Squat',
        group: 'Legs',
        muscleDetail: 'Quads',
        sets: [
          { reps: 10, weight: 135 },
          { reps: 8, weight: 185 },
          { reps: 6, weight: 225 },
          { reps: 6, weight: 225 }
        ]
      },
      {
        name: 'Romanian Deadlift',
        group: 'Legs',
        muscleDetail: 'Hamstrings',
        sets: [
          { reps: 10, weight: 135 },
          { reps: 10, weight: 155 },
          { reps: 8, weight: 175 }
        ]
      },
      {
        name: 'Leg Press',
        group: 'Legs',
        muscleDetail: 'Quads + glutes',
        sets: [
          { reps: 12, weight: 180 },
          { reps: 12, weight: 230 },
          { reps: 10, weight: 270 }
        ]
      },
      {
        name: 'Leg Curl',
        group: 'Legs',
        muscleDetail: 'Hamstrings',
        sets: [
          { reps: 12, weight: 70 },
          { reps: 12, weight: 80 },
          { reps: 10, weight: 90 }
        ]
      },
      {
        name: 'Standing Calf Raise',
        group: 'Legs',
        muscleDetail: 'Calves',
        sets: [
          { reps: 15, weight: 90 },
          { reps: 15, weight: 110 },
          { reps: 12, weight: 130 }
        ]
      }
    ]
  },
  {
    id: Date.now() + 3,
    name: 'Bicep Workout',
    createdAt: new Date().toISOString(),
    exercises: [
      {
        name: 'Barbell Curl',
        group: 'Biceps',
        muscleDetail: 'Biceps brachii',
        sets: [
          { reps: 10, weight: 60 },
          { reps: 10, weight: 70 },
          { reps: 8, weight: 80 },
          { reps: 8, weight: 80 }
        ]
      },
      {
        name: 'Hammer Curl',
        group: 'Biceps',
        muscleDetail: 'Brachialis',
        sets: [
          { reps: 12, weight: 30 },
          { reps: 10, weight: 35 },
          { reps: 10, weight: 40 }
        ]
      },
      {
        name: 'Preacher Curl',
        group: 'Biceps',
        muscleDetail: 'Short head',
        sets: [
          { reps: 12, weight: 50 },
          { reps: 10, weight: 60 },
          { reps: 8, weight: 70 }
        ]
      },
      {
        name: 'Concentration Curl',
        group: 'Biceps',
        muscleDetail: 'Peak',
        sets: [
          { reps: 12, weight: 25 },
          { reps: 12, weight: 30 },
          { reps: 10, weight: 35 }
        ]
      }
    ]
  },
  {
    id: Date.now() + 4,
    name: 'Tricep Workout',
    createdAt: new Date().toISOString(),
    exercises: [
      {
        name: 'Close-Grip Bench',
        group: 'Triceps',
        muscleDetail: 'Triceps',
        sets: [
          { reps: 10, weight: 95 },
          { reps: 8, weight: 115 },
          { reps: 8, weight: 135 },
          { reps: 6, weight: 155 }
        ]
      },
      {
        name: 'Tricep Pushdown',
        group: 'Triceps',
        muscleDetail: 'Lateral head',
        sets: [
          { reps: 12, weight: 60 },
          { reps: 12, weight: 70 },
          { reps: 10, weight: 80 }
        ]
      },
      {
        name: 'Overhead Rope Extension',
        group: 'Triceps',
        muscleDetail: 'Long head',
        sets: [
          { reps: 12, weight: 40 },
          { reps: 12, weight: 50 },
          { reps: 10, weight: 60 }
        ]
      },
      {
        name: 'Skull Crusher',
        group: 'Triceps',
        muscleDetail: 'Long head',
        sets: [
          { reps: 10, weight: 60 },
          { reps: 10, weight: 70 },
          { reps: 8, weight: 80 }
        ]
      }
    ]
  },
  {
    id: Date.now() + 5,
    name: 'Back Workout',
    createdAt: new Date().toISOString(),
    exercises: [
      {
        name: 'Deadlift',
        group: 'Back',
        muscleDetail: 'Posterior chain',
        sets: [
          { reps: 8, weight: 185 },
          { reps: 6, weight: 225 },
          { reps: 5, weight: 275 },
          { reps: 5, weight: 275 }
        ]
      },
      {
        name: 'Pull-up',
        group: 'Back',
        muscleDetail: 'Lats',
        sets: [
          { reps: 10, weight: 0 },
          { reps: 8, weight: 0 },
          { reps: 6, weight: 25 }
        ]
      },
      {
        name: 'Barbell Row',
        group: 'Back',
        muscleDetail: 'Mid-back',
        sets: [
          { reps: 10, weight: 115 },
          { reps: 10, weight: 135 },
          { reps: 8, weight: 155 }
        ]
      },
      {
        name: 'Seated Cable Row',
        group: 'Back',
        muscleDetail: 'Mid-back',
        sets: [
          { reps: 12, weight: 90 },
          { reps: 12, weight: 110 },
          { reps: 10, weight: 130 }
        ]
      },
      {
        name: 'Face Pull',
        group: 'Back',
        muscleDetail: 'Rear delts',
        sets: [
          { reps: 15, weight: 40 },
          { reps: 15, weight: 50 },
          { reps: 12, weight: 60 }
        ]
      }
    ]
  }
];
