import { supabase } from "@/supabase/supabase";

interface Programme {
  programme_id: string;
  name: string;
  workouts: Array<Workout>;
}

interface Workout {
  workout_id: string;
  name: string;
  exercises: Array<Exercise>;
}

interface Exercise {
  exercise_id: string;
  name: string;
  sets: Array<Set>;
}

interface Set {
  set_id: string;
  reps: number;
  weight: number;
  is_max: boolean;
}

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
