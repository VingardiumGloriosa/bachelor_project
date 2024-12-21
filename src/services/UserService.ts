import { supabase } from "@/supabase/supabase";

/**
 * Fetch the role for a specific user.
 * @param userId The user's UUID.
 * @returns The role name as a string or null.
 */
export const fetchUserRoleService = async (userId: string) => {
  const { data, error } = await supabase.rpc("fetch_user_role", {
    user_uuid: userId,
  });

  if (error) {
    console.error("Error fetching user role:", error.message);
    return null;
  }

  return data?.[0]?.role_name || null;
};

/**
 * Fetch the currently authenticated user from Supabase.
 * @returns The current user or null.
 */
export const fetchCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching current user:", error.message);
    return null;
  }
  return data.user;
};
