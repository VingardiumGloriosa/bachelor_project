import { supabase } from "@/supabase/supabase";
import { type Programme } from "@/components/types/ProgrammeTypes";

export const fetchUserProgrammes = async (
  userId: string
): Promise<Programme[] | null> => {
  try {
    const { data, error } = await supabase.rpc("fetch_user_programmes", {
      user_uuid: userId,
    });

    if (error) {
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
): Promise<any> => {
  try {
    const { data, error } = await supabase.rpc("get_programme_details", {
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

export const fetchExercisesService = async (): Promise<any> => {
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
