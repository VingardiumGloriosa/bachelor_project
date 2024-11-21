import { supabase } from "@/supabase/supabase";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

/**
 * Fetch the currently authenticated user.
 */
export const fetchCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching current user:", error.message);
    throw error;
  }

  return data?.user || null;
};
