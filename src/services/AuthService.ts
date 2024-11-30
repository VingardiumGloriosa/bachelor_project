// src/services/AuthService.ts
import { supabase } from "@/supabase/supabase";

// AuthService to handle authentication logic
export class AuthService {
  // Sign-in with Magic Link (OTP)
  static async signInWithMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw new Error(error.message);
    return true;
  }

  // Sign-out the user
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return true;
  }

  // Get the current authenticated user
  static async getCurrentUser() {
    const { data: user, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return user;
  }

  // Create a new user in the "users" table and assign the role in "userroles"
  static async createUser(userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
  }) {
    try {
      // Insert user into the "users" table
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            email: userDetails.email,
            first_name: userDetails.firstName,
            last_name: userDetails.lastName,
          },
        ])
        .single(); // .single ensures we get only one user as response

      if (error) throw new Error(error.message);

      // Assign role to user in the "userroles" table
      const { error: roleError } = await supabase.from("userroles").insert([
        {
          user_id: data.id, // reference to the user id
          role_id: userDetails.roleId,
        },
      ]);

      if (roleError) throw new Error(roleError.message);

      return data;
    } catch (error) {
      console.error("Error creating user and assigning role:", error.message);
      throw error;
    }
  }

  // Listen for auth state changes
  static async handleAuthStateChange() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth event:", event); // Debugging line to check auth events
      if (event === "SIGNED_IN" && session?.user) {
        console.log("User signed in:", session.user); // Debugging line to check the user
        // Check if the user exists in the "users" table
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", session.user.email)
          .single(); // Check if the user is found by email

        if (error || !user) {
          console.log("User not found, creating new user..."); // Debugging line
          // If the user does not exist, create them and assign a role
          const storedUserDetails = JSON.parse(
            sessionStorage.getItem("userDetails") || "{}"
          );
          if (storedUserDetails) {
            await AuthService.createUser({
              email: session.user.email,
              firstName: storedUserDetails.firstName,
              lastName: storedUserDetails.lastName,
              roleId: storedUserDetails.roleId,
            });
            console.log("User created and role assigned.");
          } else {
            console.error("No user details found in sessionStorage.");
          }
        } else {
          console.log("User already exists in the database.");
        }
      }
    });
  }
}
