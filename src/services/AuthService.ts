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

  static async getCurrentUser() {
    const { data: user, error } = await supabase.auth.getUser();
    if (error) throw new Error(error.message);
    return user;
  }
}
