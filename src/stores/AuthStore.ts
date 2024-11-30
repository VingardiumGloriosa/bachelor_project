// src/stores/useAuthStore.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { AuthService } from "@/services/AuthService";
import { useRouter } from "vue-router";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(null); // Store current authenticated user
  const loading = ref(false); // Store loading state
  const error = ref(null); // Store error state
  const router = useRouter();

  // Action to sign-in with magic link (sign in or sign up if first time)
  const signInWithMagicLink = async (
    email: string,
    userDetails: { firstName: string; lastName: string; roleId: number }
  ) => {
    try {
      loading.value = true;
      await AuthService.signInWithMagicLink(email); // Call the service to handle sign-in

      // Store user details temporarily to be used when user signs in with the magic link
      sessionStorage.setItem("userDetails", JSON.stringify(userDetails));

      alert("Check your email for a magic link to complete sign-up!");
    } catch (err) {
      error.value = err.message;
      console.error("Error during magic link sign-in:", err.message); // Debugging
    } finally {
      loading.value = false;
    }
  };

  // Listen for authentication changes
  AuthService.handleAuthStateChange();

  return { user, loading, error, signInWithMagicLink };
});
