import { defineStore } from "pinia";
import { ref } from "vue";
import { AuthService } from "@/services/AuthService";
import { useRouter } from "vue-router";

/**
 * Pinia store to manage authentication.
 */
export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const router = useRouter();

  /**
   * Sign in a user using a magic link sent to their email.
   * @param email - The user's email address.
   */
  const signInWithMagicLink = async (email: string) => {
    try {
      loading.value = true;
      await AuthService.signInWithMagicLink(email);
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error during magic link sign-in:", error.value);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Create a new user and assign a role to them.
   * @param userDetails - An object containing user details (firstName, lastName, roleId).
   * @param userEmail - The user's email address.
   * @returns The newly created user object.
   */
  const createUserAndAssignRole = async (
    userDetails: { firstName: string; lastName: string; roleId: number },
    userEmail: string
  ) => {
    try {
      const newUser = await AuthService.createUser(userDetails);
      await AuthService.assignUserRole(newUser.id, userDetails.roleId);
      await AuthService.storeUserSession(userEmail);
      return newUser;
    } catch (err) {
      console.error(
        "Error creating and assigning user role:",
        (err as Error).message
      );
      throw err;
    }
  };

  /**
   * Sign out the currently logged-in user.
   */
  const signOut = async () => {
    try {
      loading.value = true;
      await AuthService.signOut();
      user.value = null;
      sessionStorage.removeItem("userDetails");
      await router.push({ name: "signin" });
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error during sign-out:", error.value);
    } finally {
      loading.value = false;
    }
  };

  /**
   * Sign in using an OTP sent to the user's email.
   * @param email - The user's email address.
   */
  const signInWithOTP = async (email: string) => {
    try {
      loading.value = true;
      await AuthService.signInWithOTP(email);
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error requesting OTP:", error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Verify an OTP for signing in.
   * @param email - The user's email address.
   * @param otp - The OTP received by the user.
   */
  const verifyOTP = async (email: string, otp: string) => {
    try {
      loading.value = true;
      await AuthService.verifyOTP(email, otp);
    } catch (err) {
      error.value = (err as Error).message;
      console.error("Error verifying OTP:", error.value);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Initialize auth state change listener.
  AuthService.handleAuthStateChange();

  return {
    user,
    loading,
    error,
    signInWithMagicLink,
    createUserAndAssignRole,
    signOut,
    signInWithOTP,
    verifyOTP,
  };
});
