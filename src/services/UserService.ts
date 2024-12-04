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

export const fetchUserRoleService = async (userId: string) => {
  const { data, error } = await supabase.rpc("fetch_user_role", {
    user_uuid: userId,
  });

  if (error) {
    console.error("Error fetching user roles:", error.message);
    return null;
  }

  if (data && data.length > 0) {
    return data[0].role_name;
  }

  return null;
};
