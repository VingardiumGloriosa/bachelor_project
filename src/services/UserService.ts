import { supabase } from "@/supabase/supabase";

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Role {
  id: string;
  name: string;
}

export const fetchRolesService = async (): Promise<Role[] | null> => {
  const { data, error } = await supabase.from("roles").select("*");
  if (error) {
    console.error("Error fetching roles:", error.message);
    throw error;
  }
  const roles = { value: data };
  return roles.value;
};

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

export const signupUserService = async ({
  email,
  firstName,
  lastName,
  roleId,
}: {
  email: string;
  firstName: string;
  lastName: string;
  roleId: string | number | null;
}) => {
  if (!roleId) throw new Error("Role selection is required.");

  try {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;

    sessionStorage.setItem(
      "userDetails",
      JSON.stringify({ firstName, lastName, roleId })
    );
  } catch (error) {
    console.error("Error signing up user:", (error as Error).message);
    throw error;
  }
};
