import { supabase } from "@/supabase/supabase";
import { type User } from "@/components/types/UserTypes";

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

export const fetchCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.error("Error fetching current user:", error.message);
    return null;
  }
  return data.user;
};

export const createAthleteProfileService = async (
  email: string,
  firstName: string,
  lastName: string
) => {
  const { error } = await supabase.rpc("create_profile", {
    p_email: email,
    p_first_name: firstName,
    p_last_name: lastName,
  });
  if (error) {
    console.error("Error creating athlete profile:", error.message);
    throw error;
  }
};
