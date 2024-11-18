export interface Programme {
  programme_id: string;
  name: string;
  workouts: Array<Workout>;
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
