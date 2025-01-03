import { supabase } from "@/supabase/supabase";

/**
 * A service class for managing authentication operations.
 */
export class AuthService {
  /**
   * Sends a magic link to the user's email for authentication.
   * @param email - The user's email address.
   * @throws If the operation fails.
   */
  static async signInWithMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw new Error(error.message);
    return true;
  }

  /**
   * Logs out the current user.
   * @throws If the operation fails.
   */
  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return true;
  }

  /**
   * Creates a new user in the database.
   * @param userDetails - An object containing user details (firstName, lastName, email, roleId).
   * @returns The newly created user object.
   * @throws If the operation fails.
   */
  static async createUser(userDetails: {
    firstName: string;
    lastName: string;
    email: string;
    roleId: number;
  }) {
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email: userDetails.email,
          first_name: userDetails.firstName,
          last_name: userDetails.lastName,
        },
      ])
      .single();

    if (error) throw new Error(error.message);

    return data;
  }

  /**
   * Assigns a role to an existing user.
   * @param userId - The user's UUID.
   * @param roleId - The role's ID.
   * @throws If the operation fails.
   */
  static async assignUserRole(userId: string, roleId: number) {
    const { error } = await supabase.from("userroles").insert([
      {
        user_id: userId,
        role_id: roleId,
      },
    ]);
    if (error) throw new Error(error.message);
  }

  /**
   * Stores a user's session in Supabase.
   * @param userEmail - The user's email address.
   * @throws If the operation fails.
   */
  static async storeUserSession(userEmail: string) {
    const { error } = await supabase.auth.updateUser({ email: userEmail });
    if (error) throw new Error(error.message);
  }

  /**
   * Listens for changes in the authentication state and updates the user accordingly.
   */
  static async handleAuthStateChange() {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", session.user.email)
          .single();

        if (error || !user) {
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
          } else {
            console.error("No user details found in sessionStorage.");
          }
        }
      }
    });
  }

  /**
   * Sends an OTP to the user's email for authentication.
   * @param email - The user's email address.
   * @throws If the operation fails.
   */
  static async signInWithOTP(email: string) {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw new Error(error.message);
  }

  /**
   * Verifies the provided OTP for authentication.
   * @param email - The user's email address.
   * @param otp - The OTP received by the user.
   * @throws If the operation fails.
   */
  static async verifyOTP(email: string, otp: string) {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: "email",
    });
    if (error) throw new Error(error.message);
  }
  /**
   * Fetches the access token for the demo account.
   * @returns Access token for the demo user.
   */
  static async fetchDemoAccessToken(): Promise<string | null> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "gloriagrofova@outlook.com", // Replace with your demo account's email
        password: "glg", // Replace with a dummy password
      });

      if (error) throw new Error(error.message);

      return data.session.access_token;
    } catch (error) {
      console.error("Error fetching demo access token:", error.message);
      return null;
    }
  }
}
