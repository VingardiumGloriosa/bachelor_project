export interface Programme {
  name: string;
  type: string;
  workouts: Workout[];
}
export interface Workout {
  workout_id: string;
  name: string;
  workout_exercises: Array<Exercise>;
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
  success: boolean;
}
