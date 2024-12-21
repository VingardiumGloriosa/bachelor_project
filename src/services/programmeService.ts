import { supabase } from "@/supabase/supabase";
import {
  type Programme,
  type Workout,
  type Exercise,
  type WorkoutExercise,
  type PR,
  type Set,
} from "@/components/types/ProgrammeTypes";

/**
 * Fetch programmes associated with a user.
 * @param userId - The user's UUID.
 * @returns A list of programmes or `null` if an error occurs.
 */
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

/**
 * Fetch details of a specific programme.
 * @param programmeId - The ID of the programme to fetch.
 * @returns The details of the programme.
 */
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

/**
 * Submit a new programme.
 * @param programme_name - The name of the programme.
 * @param programme_type - The type of programme (e.g., personal or team).
 * @param user_uuid - The user's UUID.
 * @param team_uuid - The team's UUID.
 * @param workouts - The workouts associated with the programme.
 * @returns The submission status and programme ID (if created).
 */
export const submitProgrammeService = async (
  programme_name: string,
  programme_type: string,
  user_uuid: string,
  team_uuid: string,
  workouts: []
): Promise<{ status: string; programme_id?: string } | null> => {
  try {
    const { data, error } = await supabase.rpc("create_programme", {
      programme_name,
      programme_type,
      user_uuid,
      team_uuid,
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

/**
 * Fetch all exercises available.
 * @returns A list of exercises.
 */
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

/**
 * Fetch a specific personal record (PR) for a user and exercise.
 * @param userId - The user's UUID.
 * @param exerciseId - The exercise ID.
 * @param repScheme - The rep scheme for the PR.
 * @returns The personal record details.
 */
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

/**
 * Fetch all personal records (PRs) for a specific exercise.
 * @param userId - The user's UUID.
 * @param exerciseId - The exercise ID.
 * @returns A list of personal records.
 */
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
    console.error("Error in fetchPersonalRecordsService:", err);
    throw err;
  }
};

/**
 * Fetch the exercise history for a user and exercise.
 * @param userId - The user's UUID.
 * @param exerciseId - The exercise ID.
 * @returns A list of exercise history records.
 */
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

/**
 * Submit workout sets and check for PR achievements.
 * @param exerciseId - The exercises's UUID.
 * @param userId - The user's UUID.
 * @returns null.
 */
export const postNewPersonalRecord = async (
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

/**
 * Submit workout sets and check for PR achievements.
 * @param workouts - The list of workouts and their sets.
 * @param userId - The user's UUID.
 * @returns Submission status and achieved PRs.
 */
export const submitSetService = async (
  workouts: Workout[],
  userId: string
): Promise<{
  status: string;
  achievedPRs: { exercise: string; weight: number }[];
}> => {
  const achievedPRs: { exercise: string; weight: number }[] = [];
  try {
    const workoutsPlain = workouts.map((workout) =>
      JSON.parse(JSON.stringify(workout))
    );

    const workoutPayload = workoutsPlain.map((workout) => {
      if (!Array.isArray(workout.workout_exercises)) {
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
      return { status: "Error", achievedPRs: [] };
    }

    for (const workout of workouts) {
      for (const exercise of workout.workout_exercises) {
        for (const set of exercise.sets) {
          if (!set.success) continue;

          const currentPR = await fetchPersonalRecordService(
            userId,
            exercise.exercise_id,
            set.reps
          );

          const currentPRData =
            currentPR && currentPR.length > 0 ? currentPR[0] : null;

          if (currentPRData) {
            if (set.weight > currentPRData.weight) {
              await postNewPersonalRecord(userId, exercise.exercise_id, set);
              achievedPRs.push({
                exercise: exercise.exercise,
                weight: set.weight,
              });
            }
          } else {
            await postNewPersonalRecord(userId, exercise.exercise_id, set);
            achievedPRs.push({
              exercise: exercise.exercise,
              weight: set.weight,
            });
          }
        }
      }
    }

    return { status: "Success", achievedPRs };
  } catch (error) {
    console.error("Error in submitSetService:", error);
    return { status: "Error", achievedPRs: [] };
  }
};

/**
 * Fetch all teams available for a coach.
 * @returns A list of teams.
 */
export const fetchTeamsService = async () => {
  const { data, error } = await supabase.rpc("fetch_teams");

  if (error) {
    console.error("Error fetching teams:", error.message);
    return [];
  }

  return data;
};

/**
 * Fetch user-specific goals.
 * @param userId - The user's UUID.
 * @returns A list of goals.
 */
export const fetchUserGoalsService = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc("fetch_user_goals", {
      user_uuid: userId,
    });
    if (error) {
      console.error("Error fetching user goals:", error.message);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error in fetchUserGoalsService:", error);
    throw error;
  }
};

/**
 * Fetch user-specific personal records (PRs).
 * @param userId - The user's UUID.
 * @returns A list of PRs.
 */
export const fetchUserPRsService = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc("fetch_user_prs", {
      user_uuid: userId,
    });
    if (error) {
      console.error("Error fetching user PRs:", error.message);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error("Error in fetchUserPRsService:", error);
    throw error;
  }
};
