export interface Programme {
  name: string;
  type: string;
  workouts: Array<{
    name: string;
    workout_exercises: Array<{
      exercise_id: string;
      exercise_order: number;
      sets: Array<{
        reps: number | null;
        percentage: number | null;
      }>;
    }>;
  }>;
}
export interface Workout {
  workout_id: string;
  name: string;
  exercises: Array<Exercise>;
}

export interface Exercise {
  exercise_id: string;
  name: string;
  sets: Array<Set>;
}

export interface Set {
  set_id: string;
  reps: number;
  weight: number;
  is_max: boolean;
}
