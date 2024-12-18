import { defineStore } from "pinia";
import { ref } from "vue";
import { AuthService } from "@/services/AuthService";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null);
  const loading = ref(false);
  const error = ref(null);
  const router = useRouter();

  const signInWithMagicLink = async (email: string) => {
    try {
      loading.value = true;
      await AuthService.signInWithMagicLink(email);
    } catch (err) {
      error.value = err.message;
      console.error("Error during magic link sign-in:", err.message);
    } finally {
      loading.value = false;
    }
  };

  const createUserAndAssignRole = async (
    userDetails: { firstName: string; lastName: string; roleId: number },
    userEmail: string
  ) => {
    try {
      const user = await AuthService.createUser(userDetails);
      await AuthService.assignUserRole(user.id, userDetails.roleId);
      await AuthService.storeUserSession(userEmail);
      return user;
    } catch (err) {
      console.error("Error creating and assigning user role:", err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      loading.value = true;
      await AuthService.signOut();
      user.value = null;
      sessionStorage.removeItem("userDetails");
      await router.push({ name: "signin" });
    } catch (err) {
      error.value = err.message;
      console.error("Error during sign-out:", err.message);
    } finally {
      loading.value = false;
    }
  };

  const signInWithOTP = async (email: string) => {
    try {
      loading.value = true;
      await AuthService.signInWithOTP(email);
    } catch (err) {
      error.value = err.message;
      console.error("Error requesting OTP:", err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      loading.value = true;
      await AuthService.verifyOTP(email, otp);
    } catch (err) {
      error.value = err.message;
      console.error("Error verifying OTP:", err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  AuthService.handleAuthStateChange();

  return {
    user,
    loading,
    error,
    signInWithMagicLink,
    createUserAndAssignRole,
    signOut,
    verifyOTP,
    signInWithOTP,
  };
});
