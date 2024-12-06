import { type Programme } from "@/components/types/ProgrammeTypes";

export const validateProgramme = (programme: Programme): string[] => {
  const errors: string[] = [];

  if (!programme.name.trim()) {
    errors.push("Programme must have a name.");
  }

  if (programme.workouts.length === 0) {
    errors.push("Programme must have at least one workout.");
  } else {
    programme.workouts.forEach((workout, workoutIndex) => {
      if (!workout.name.trim()) {
        errors.push(`Workout ${workoutIndex + 1} must have a name.`);
      }

      if (workout.workout_exercises.length === 0) {
        errors.push(
          `Workout ${workoutIndex + 1} must have at least one exercise.`
        );
      } else {
        workout.workout_exercises.forEach((exercise, exerciseIndex) => {
          if (!exercise.exercise_id) {
            errors.push(
              `Exercise ${exerciseIndex + 1} in Workout ${
                workoutIndex + 1
              } must be selected.`
            );
          }

          if (exercise.sets.length === 0) {
            errors.push(
              `Exercise ${exerciseIndex + 1} in Workout ${
                workoutIndex + 1
              } must have at least one set.`
            );
          } else {
            exercise.sets.forEach((set, setIndex) => {
              if (set.reps === null || set.reps <= 0) {
                errors.push(
                  `Set ${setIndex + 1} in Exercise ${
                    exerciseIndex + 1
                  } in Workout ${
                    workoutIndex + 1
                  } must have a valid number of reps.`
                );
              }
              if (set.percentage === null || set.percentage <= 0) {
                errors.push(
                  `Set ${setIndex + 1} in Exercise ${
                    exerciseIndex + 1
                  } in Workout ${
                    workoutIndex + 1
                  } must have a valid percentage.`
                );
              }
            });
          }
        });
      }
    });
  }

  return errors;
};
