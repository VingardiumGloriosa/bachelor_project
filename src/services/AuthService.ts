import { supabase } from "@/supabase/supabase";

export class AuthService {
  static async signInWithMagicLink(email: string) {
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw new Error(error.message);
    return true;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(error.message);
    return true;
  }

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

  static async assignUserRole(userId: string, roleId: number) {
    const { error } = await supabase.from("userroles").insert([
      {
        user_id: userId,
        role_id: roleId,
      },
    ]);
    if (error) throw new Error(error.message);
  }

  static async storeUserSession(userEmail: string) {
    const { error } = await supabase.auth.updateUser({ email: userEmail });
    if (error) throw new Error(error.message);
  }

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
}
