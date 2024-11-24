export interface Programme {
  name: string;
  type: string;
  workouts: Workout[];
}
export interface Workout {
  workout_id: string;
  name: string;
  workout_exercises: Array<WorkoutExercise>;
}

export interface WorkoutExercise {
  workout_exercise_id: string;
  exercise_id: string;
  exercise_order: number;
  sets: Array<Set>;
}

export interface Exercise {
  exercise_id: string;
  name: string;
}

export interface Set {
  set_id: string;
  reps: number;
  weight: number;
  is_max: boolean;
  success: boolean;
}

export interface PR {
  pr_id: string;
  exercise_id: string;
  reps: number;
  weight: number;
  user_id: string;
  achieved_on: Date;
}
