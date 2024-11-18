import { supabase } from "@/supabase/supabase";
import { type Programme } from "@/components/types/programmeTypes";

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
