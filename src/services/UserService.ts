import { supabase } from "@/supabase/supabase";
import { type User } from "@/components/types/UserTypes";

export const fetchCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching current user:", error.message);
    throw error;
  }

  return data?.user || null;
};
