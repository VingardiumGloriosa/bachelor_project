import { supabase } from "@/supabase/supabase";
import {
  type Programme,
  type Workout,
  type Exercise,
  type WorkoutExercise,
  type PR,
  type Set,
} from "@/components/types/ProgrammeTypes";

export const fetchUserProgrammes = async (
  userId: string
): Promise<Programme[] | null> => {
  try {
    const { data, error } = await supabase.rpc("fetch_user_programmes", {
      user_uuid: userId,
    });
    if (error) {
      console.error("Supabase RPC Error:", error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching programmes:", (error as Error).message);
    return null;
  }
};

export const fetchProgrammeDetails = async (
  programmeId: string
): Promise<Programme> => {
  try {
    const { data, error } = await supabase.rpc("fetch_programme_details", {
      programme: programmeId,
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  } catch (error) {
    console.error(
      "Error fetching programme details:",
      (error as Error).message
    );
    throw error;
  }
};

export const submitProgrammeService = async (
  programme_name: string,
  programme_type: string,
  user_uuid: string,
  workouts: []
): Promise<{ status: string; programme_id?: string } | null> => {
  try {
    const { data, error } = await supabase.rpc("create_programme", {
      programme_name,
      programme_type,
      user_uuid,
      workouts: workouts.map((workout) => ({
        ...workout,
        workout_exercises: workout.workout_exercises.map((exercise) => ({
          exercise_id: exercise.exercise_id,
          exercise_order: exercise.exercise_order,
          sets: exercise.sets,
        })),
      })),
    });

    if (error) throw new Error(error.message);

    return {
      status: data?.status || "Success",
      programme_id: data?.programme_id,
    };
  } catch (error) {
    console.error("Error submitting programme:", (error as Error).message);
    throw error;
  }
};

export const fetchExercisesService = async (): Promise<Exercise> => {
  try {
    const { data, error } = await supabase.rpc("fetch_exercises");

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error("Error fetching exercises:", (error as Error).message);
    throw error;
  }
};

export const fetchPersonalRecordService = async (
  userId: string,
  exerciseId: string,
  repScheme: string
): Promise<PR> => {
  try {
    const { data, error } = await supabase.rpc("fetch_specific_pr", {
      user_uuid: userId,
      ex_id: exerciseId,
      rep_scheme_input: repScheme,
    });

    if (error) {
      console.error("Error fetching personal record:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Error in fetchPersonalRecordService:", err);
    throw err;
  }
};

export const fetchPersonalRecordsService = async (
  userId: string,
  exerciseId: string
): Promise<PR> => {
  try {
    const { data, error } = await supabase.rpc("fetch_exercise_pr", {
      user_uuid: userId,
      ex_id: exerciseId,
    });

    if (error) {
      console.error("Error fetching personal record:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Error in fetchPersonalRecordService:", err);
    throw err;
  }
};

export const fetchExerciseHistoryService = async (
  userId: string,
  exerciseId: string
): Promise<PR> => {
  try {
    const { data, error } = await supabase.rpc("fetch_exercise_history", {
      p_exercise_id: exerciseId,
      p_user_id: userId,
    });

    if (error) {
      console.error("Error fetching exercise history:", error);
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("Error in fetchExerciseHistoryService:", err);
    throw err;
  }
};

const postNewPersonalRecord = async (
  userId: string,
  exerciseId: string,
  set: Set
): Promise<void> => {
  try {
    const { data, error } = await supabase.rpc("submit_new_pr", {
      p_user_id: userId,
      p_exercise_id: exerciseId,
      p_rep_scheme: `${set.reps}`,
      p_weight: set.weight,
    });

    if (error) {
      console.error("Error posting new personal record:", error.message);
      throw new Error(error.message);
    }
  } catch (err) {
    console.error("Error in postNewPersonalRecord:", err);
  }
};

export const submitSetService = async (
  workouts: Workout[],
  userId: string
): Promise<{ status: string } | null> => {
  try {
    const workoutsPlain = workouts.map((workout) =>
      JSON.parse(JSON.stringify(workout))
    );

    const workoutPayload = workoutsPlain.map((workout) => {
      if (!Array.isArray(workout.workout_exercises)) {
        console.error(
          "Error: workout_exercises is not an array or is undefined for workout",
          workout.workout_id
        );
        throw new Error("Invalid workout structure");
      }

      const workoutExercises = workout.workout_exercises.map(
        (exercise: WorkoutExercise) => ({
          exercise: exercise,
          sets: exercise.sets.map((set) => ({
            set_id: set.set_id,
            weight: set.weight,
            reps: set.reps,
            success: set.success,
          })),
        })
      );

      return {
        workout_id: workout.workout_id,
        workout_exercises: workoutExercises,
      };
    });

    const { data, error } = await supabase.rpc("submit_workout_setlogs", {
      user_id: userId,
      workouts: workoutPayload,
    });

    if (error) {
      console.error("Error in RPC call:", error);
      return { status: "Error" };
    }
    for (const workout of workouts) {
      for (const exercise of workout.workout_exercises) {
        for (const set of exercise.sets) {
          if (!set.success) continue;

          const currentPR = await fetchPersonalRecordService(
            userId,
            exercise.workout_exercise_id,
            `${set.reps}`
          );
          if (!currentPR || set.weight > currentPR.weight) {
            await postNewPersonalRecord(userId, exercise.exercise_id, set);
          }
        }
      }
    }
    return { status: "Success" };
  } catch (error) {
    console.error("Error in submitSetService:", error);
    return { status: "Error" };
  }
};
